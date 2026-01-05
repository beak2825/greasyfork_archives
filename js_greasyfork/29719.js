// ==UserScript==
// @name         TwitchVODEnhancer
// @author       sooqua
// @namespace    https://github.com/sooqua/
// @version      0.4
// @match        *://*.twitch.tv/*
// @run-at       document-start
// @grant        GM_addStyle
// @description Find the most interesting moments in Twitch.tv Videos (VODs).
// @downloadURL https://update.greasyfork.org/scripts/29719/TwitchVODEnhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/29719/TwitchVODEnhancer.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const client_id = 'ENTER_YOUR_CLIENT_ID',
        canvas_width = 2500,
        canvas_height = 1,
        slider_height = 2.6,
        slider_height_unit = 'em',
        step = 60000, // msec.
        auto_zoom = 1; // width of one step (%), non-zero values override the 'zoom' value
    let zoom = 3;
    const gradient = [
        [
            0,
            [0, 0, 0]
        ],
        [
            25,
            [60, 100, 90]
        ],
        [
            30,
            [132, 220, 198]
        ],
        [
            33,
            [165, 255, 214]
        ],
        [
            35,
            [255, 222, 158]
        ],
        [
            85,
            [255, 166, 158]
        ],
        [
            100,
            [255, 104, 107]
        ]
    ];
    const slider_half_height = slider_height / 2;

    let steps_data_mc = [],
        steps_data_ts = [];

    let observer;

    async function init() {
        await initOn(document);
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(async function(node) {
                    if (node instanceof HTMLElement) {
                        await initOn(node);
                    }
                });
            });
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    async function initOn(base) {
        let slider = base.querySelector('.js-player-slider');
        if (!slider) return;
        let slider_handle = base.querySelector('.ui-slider-handle');
        if (!slider_handle) return;
        observer.disconnect();

        let vid_id = /twitch.tv\/videos\/(\d+)/.exec(window.location.href)[1];

        let r = await getJson('https://api.twitch.tv/kraken/videos/' + vid_id + '?client_id=' + client_id),
            vid_start = new Date(r.recorded_at).getTime(),
            vid_length = r.length * 1000,
            vid_end = vid_start + vid_length,
            step_width = Math.round(step / vid_length * canvas_width);

        if (auto_zoom) {
            zoom = (auto_zoom / (step_width / canvas_width * 100)).clamp(1, 100);
        }

        GM_addStyle(`
        .player-seek {
            top: 0px !important;
        }
        .canvasWrapper {
            transform: translateZ(0) !important;
            overflow: hidden !important;
        }
        .js-player-slider:before {
            display: none !important;
        }
        .js-player-slider > .ui-slider-range {
            pointer-events: none !important;
            z-index: 1 !important;
            background: rgba(169, 145, 212, .5) !important;
            height: ${slider_height + slider_height_unit} !important;
            top: 0px !important;
            transition: initial !important;
        }
        .js-player-slider > .ui-slider-handle {
            pointer-events: none !important;
            width: .1em !important;
            height: ${slider_height + slider_height_unit} !important;
            background: black !important;
            border: .1em dotted white !important;
            margin-left: 0em !important;
            top: 0em !important;
            border-radius: initial !important;
            transition: initial !important;
        }
        .player-slider--roundhandle .ui-slider-handle:before {
            display: none !important;
        }
        .player-slider__popup-container {
            box-shadow: none !important;
            background: hsla(0,0%,0%,.5) !important;
        }
        .player-slider__muted-segments {
            pointer-events: none !important;
            height: ${slider_half_height + slider_height_unit} !important;
            top: ${slider_half_height + slider_height_unit} !important;
        }
        .player-slider__muted {
            pointer-events: none !important;
            height: ${slider_half_height + slider_height_unit} !important;
        }
        .sliderCanvas:hover {
            transform: scale(${zoom}, 1) !important;
        }`);

        let wrapper = document.createElement('div');
        wrapper.className = 'canvasWrapper';

        let c = document.createElement('canvas');
        c.className = 'sliderCanvas';
        c.width = canvas_width;
        c.height = canvas_height;
        c.style.width = '100%';
        c.style.height = slider_height + slider_height_unit;

        wrapper.appendChild(c);
        slider.appendChild(wrapper);

        let sheet;
        c.addEventListener('mousemove', function(e) {
            let r = wrapper.getBoundingClientRect(),
                m = (e.pageX - r.left) / r.width * 100;
            c.style.transformOrigin = m + '% center 0px';
            let m_h = (parseFloat(slider_handle.style.left) * zoom - m * zoom + m).clamp(0, 100);

            let s = `
            .ui-slider-handle {
                left: ${m_h}% !important;
            }
            .ui-slider-range {
                width: ${m_h}% !important;
            }`;

            let muted_bars = document.querySelectorAll('.player-slider__muted');
            for (let i = 0, l = muted_bars.length; i < l; ++i) {
                let m_b = (parseFloat(muted_bars[i].style.left) * zoom - m * zoom + m).clamp(0, 100);
                s += `
                .js-muted-segments-container > span:nth-child(${i + 1}) {
                    left: ${m_b}% !important;
                    transform: scale(${zoom}, 1) !important;
                    transform-origin: left !important;
                }`;
            }

            sheet = setStyle(s, sheet);
        });
        c.addEventListener('mouseout', function() {
            sheet = setStyle('', sheet);
        });

        let last_step_ts = vid_start,
            curr_step_mc = 0,
            ctx = c.getContext('2d');
        ctx.fillStyle = 'rgba(0, 0, 0, .5)';
        ctx.fillRect(0, 0, canvas_width, canvas_height);
        for (let ts = vid_start; ts < vid_end; ts += 30000) {
            r = await getJson('https://rechat.twitch.tv/rechat-messages?video_id=v' + vid_id + '&start=' + Math.round(ts / 1000));
            if (r.data.length === 0) {
                continue;
            }

            for (let i = 0; i < r.data.length; i++) {
                curr_step_mc++;
                let curr_msg_ts = r.data[i].attributes.timestamp;
                if (curr_msg_ts - last_step_ts >= step) {
                    steps_data_ts.push(curr_msg_ts);
                    steps_data_mc.push(curr_step_mc);
                    curr_step_mc = 0;

                    let steps_data_mc_max = Math.max(...steps_data_mc);
                    if (steps_data_mc_max <= 0) continue;

                    for (let i = 0, l = steps_data_mc.length; i < l; ++i) {
                        let pos = ((steps_data_ts[i] - vid_start) / (vid_end - vid_start)).clamp(0, 1),
                            int = (steps_data_mc[i] / steps_data_mc_max * 100).clamp(1, 100),
                            col = pickGradientColor(int, gradient);
                        ctx.fillStyle = 'rgb(' + col.join() + ')';
                        ctx.fillRect(Math.round(pos * canvas_width) - step_width, 0, step_width, canvas_height);
                    }

                    last_step_ts = curr_msg_ts;
                }
            }
        }
    }
    
    function getJson(url) {
        return new Promise(function(resolve) {
            let xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function() { resolve(JSON.parse(this.responseText)); });
            xhr.open('GET', url,);
            xhr.send();
        });
    }

    function pickGradientColor(position, gradient) {
        let color_range = [];
        for (let i = 0; i < gradient.length; i++) {
            if (position<=gradient[i][0]) {
                color_range = [i-1,i];
                break;
            }
        }

        //Get the two closest colors
        let first_color = gradient[color_range[0]][1],
            second_color = gradient[color_range[1]][1];

        //Calculate ratio between the two closest colors
        let first_color_x = gradient[color_range[0]][0]/100,
            second_color_x = gradient[color_range[1]][0]/100-first_color_x,
            slider_x = position/100-first_color_x,
            ratio = slider_x/second_color_x;

        return pickHex( second_color,first_color, ratio );
    }

    function pickHex(color1, color2, weight) {
        let w = weight * 2 - 1,
            w1 = (w+1) / 2,
            w2 = 1 - w1;
        return [Math.round(color1[0] * w1 + color2[0] * w2),
            Math.round(color1[1] * w1 + color2[1] * w2),
            Math.round(color1[2] * w1 + color2[2] * w2)];
    }

    function setStyle(cssText) {
        let sheet = document.createElement('style');
        sheet.type = 'text/css';
        /* Optional */ window.customSheet = sheet;
        (document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
        return (setStyle = function(cssText, node) {
            if(!node || node.parentNode !== sheet)
                return sheet.appendChild(document.createTextNode(cssText));
            node.nodeValue = cssText;
            return node;
        })(cssText);
    }

    /**
    * Returns a number whose value is limited to the given range.
    *
    * Example: limit the output of this computation to between 0 and 255
    * (x * 255).clamp(0, 255)
    *
    * @param {Number} min The lower boundary of the output range
    * @param {Number} max The upper boundary of the output range
    * @returns A number in the range [min, max]
    * @type Number
    */
    Number.prototype.clamp = function(min, max) {
        return Math.min(Math.max(this, min), max);
    };

    document.addEventListener('DOMContentLoaded', init);
})();