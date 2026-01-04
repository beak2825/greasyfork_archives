// ==UserScript==
// @author          zhzLuke96
// @name            油管视频旋转...
// @name:en         youtube player rotate plug
// @version         1.2
// @description     油管的视频旋转插件.
// @description:en  rotate youtebe player.
// @namespace       https://github.com/zhzLuke96/
// @match           https://www.youtube.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/395950/%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E6%97%8B%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/395950/%E6%B2%B9%E7%AE%A1%E8%A7%86%E9%A2%91%E6%97%8B%E8%BD%AC.meta.js
// ==/UserScript==
 
(async function () {
    'use strict';
    const rule_name = "ytp_player_user_js";
 
    // ref:https://stackoverflow.com/questions/27078285/simple-throttle-in-js
    function throttle(callback, limit) {
        var waiting = false;
        return function () {
            if (!waiting) {
                callback.apply(this, arguments);
                waiting = true;
                setTimeout(function () {
                    waiting = false;
                }, limit);
            }
        }
    }
 
    const dommap = {};
    const applydom = (key, fn) => dommap[key] && fn(dommap[key]);
 
    // init ytp_horizintal ytp_vertical class
    ;
    (rule => {
        var style = document.createElement('style');
        document.getElementsByTagName('head')[0].appendChild(style);
        style.innerHTML = rule
    })(`
    video.ytp_horizintal{transform:rotateX(180deg)}
    video.ytp_vertical{transform:rotateY(180deg)}
    `);
 
    const $ = q => document.querySelector(q);
    const currentLang = (navigator.language || navigator.browserLanguage || navigator.systemLanguage).toLowerCase() || '';
    const on_zh_lang = currentLang.indexOf("zh") > -1;
 
    let $styleElem = null; // cache var
 
    function setup($ytp_player, $ytp_player_vid) {
        if (!$ytp_player || !$ytp_player_vid) {
            return
        }
        if (!$styleElem) {
            $styleElem = document.createElement('style');
            document.getElementsByTagName('head')[0].appendChild($styleElem);
        }
 
        // mount <video> element
        $ytp_player_vid.classList.add(rule_name);
        let currentCSS = {};
        const state = {
            rotate: 0, // 0 1 2 3 => 0 90 180 270
            horizintal: false,
            vertical: false,
 
            plugin_working: false,
        }
        // utils
        function setStyle(rule) {
            $styleElem.innerHTML = `.${rule_name}{${rule}}`;
        }
 
        function css_dump(obj) {
            let ret = "";
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    ret += `${key}:${obj[key]} !important;`;
                }
            }
            return ret;
        }
 
        function toggleRuleTransform(rule) {
            if (currentCSS["transform"]) {
                if (currentCSS["transform"].indexOf(rule) > -1)
                    currentCSS["transform"] = currentCSS["transform"].replace(rule, "")
                else
                    currentCSS["transform"] += rule;
            } else {
                currentCSS["transform"] = rule;
            }
            setStyle(css_dump(currentCSS));
        }
 
        // bind play event
        setTimeout(() => {
            $ytp_player_vid.addEventListener('play', () => state.plugin_working && update());
            $ytp_player.addEventListener("resize", throttle(() => state.plugin_working && setTimeout(update, 100), 500));
        }, 500)
 
        const update = () => {
            // ---------- rotate ---------- 👇
            const y = (() => {
                const [pw, ph] = [$ytp_player.clientWidth, $ytp_player.clientHeight];
                let [w, h] = [$ytp_player_vid.clientWidth, $ytp_player_vid.clientHeight];
                if (state.rotate % 2 == 1) {
                    [w, h] = [h, w];
                }
                // pw === w
                if (~~(pw * h / w) <= h) { // 💥💥💥
                    return pw / w;
                }
                // ph === h
                return ph / h;
            })();
 
            const css = {};
            css["transform"] = `rotate(${state.rotate * 90}deg)`;
            css["transform"] += ` scale(${y})`;
            currentCSS = css;
            setStyle(css_dump(css));
            // ---------- rotate ---------- 👆
            if (state.horizintal) {
                if (state.rotate % 2 == 1) toggleRuleTransform("rotateX(180deg)")
                else toggleRuleTransform("rotateY(180deg)");
            }
            if (state.vertical) {
                if (state % 2 == 1) toggleRuleTransform("rotateY(180deg)")
                else toggleRuleTransform("rotateX(180deg)");
            }
 
            // ---------- update UI ---------- 👇
            applydom('menu_rotate', (elem) => {
                elem.querySelector(".ytp-menuitem-content").innerHTML = state.rotate * 90 + '°';
            })
            // applydom('menu_horizintal', (elem) => {
            //     elem.setAttribute('aria-checked', state.horizintal.toString());
            // })
            // applydom('menu_vertical', (elem) => {
            //     elem.setAttribute('aria-checked', state.vertical.toString());
            // })
            // applydom('menu_pip', (elem) => {
            //     // 
            // })
            // ---------- update UI ---------- 👆
        }
 
        return {
            rotate() {
                state.plugin_working = true;
                state.rotate = (state.rotate + 1) % 4;
                update();
                return state.rotate;
            },
            toogleHorizintal() {
                state.plugin_working = true;
                state.horizintal = !state.horizintal;
                update();
                return state.horizintal;
            },
            toogleVertical() {
                state.plugin_working = true;
                state.vertical = !state.vertical;
                update();
                return state.vertical;
            },
            reset() {
                state.rotate = 0;
                state.horizintal = false;
                state.vertical = false;
                update();
                return state;
            },
        }
    }
 
    let playerApi = null; //
    { // mount
        const $vid = $(".html5-main-video");
        const $player = $(".html5-video-player");
 
        if ($vid && $player) {
            playerApi = setup($player, $vid);
        } else {
            // 也许...有某种情况会不生成player
            window.addEventListener('popstate', () => {
                const $vid = $(".html5-main-video");
                const $player = $(".html5-video-player");
                if ($vid && $player) {
                    playerApi = setup($player, $vid);
                }
            })
        }
    };
 
    // button and menu
    async function addbutton(html, options, onRight = true) {
        let p, push;
        if (onRight) {
            p = $(".ytp-right-controls");
            push = n => p.insertBefore(n, p.firstElementChild);
        } else {
            // left
            p = $(".ytp-left-controls");
            push = n => p.appendChild(n);
        }
 
        let b = await new Promise((resolve, reject) => {
            function c() {
                if ($('.ytp-settings-button')) {
                    resolve($('.ytp-settings-button').cloneNode(true))
                } else {
                    setTimeout(() => {
                        c()
                    }, 1000)
                }
            }
            c()
        })
        b.innerHTML = html;
        b.className = "ytp-button";
        push(b);
        if (options.key) dommap[options.key] = b;
        if (options.click) b.addEventListener("click", options.click);
        if (options.css) b.style.cssText = options.css;
        if (options.id) b.id = options.id;
        if (options.title) b.title = options.title;
        return b;
    }
 
    // rotate 90
 
    await addbutton(`
<svg viewBox="0 0 1536 1536" aria-labelledby="rwsi-awesome-repeat-title" id="si-awesome-repeat" width="100%" height="100%"><title id="rwsi-awesome-repeat-title">icon repeat</title><path d="M1536 128v448q0 26-19 45t-45 19h-448q-42 0-59-40-17-39 14-69l138-138Q969 256 768 256q-104 0-198.5 40.5T406 406 296.5 569.5 256 768t40.5 198.5T406 1130t163.5 109.5T768 1280q119 0 225-52t179-147q7-10 23-12 14 0 25 9l137 138q9 8 9.5 20.5t-7.5 22.5q-109 132-264 204.5T768 1536q-156 0-298-61t-245-164-164-245T0 768t61-298 164-245T470 61 768 0q147 0 284.5 55.5T1297 212l130-129q29-31 70-14 39 17 39 59z"></path></svg>
            `, {
        click: () => playerApi.rotate && playerApi.rotate(),
        css: "fill:white;width:20px;margin-right:1rem;",
        id: "rotate-btn",
        title: on_zh_lang ? "旋转视频" : "rotate",
        key: 'btn_rotate'
    })
 
    function append_context_menu({
        label = '',
        content = '<div class="ytp-menuitem-toggle-checkbox"></div>',
        href,
        icon,
        callback,
        key
    }) {
        const $menu = document.querySelector(".ytp-contextmenu>.ytp-panel>.ytp-panel-menu");
        let $ele = null;
        if (href) {
            $ele = document.querySelector(".ytp-contextmenu>.ytp-panel>.ytp-panel-menu>a.ytp-menuitem").cloneNode(true)
            $ele.href = href;
        } else {
            $ele = document.querySelector(".ytp-contextmenu>.ytp-panel>.ytp-panel-menu>div.ytp-menuitem").cloneNode(true)
        }
        key && (dommap[key] = $ele);
        label && ($ele.querySelector(".ytp-menuitem-label").innerHTML = label);
        content && ($ele.querySelector(".ytp-menuitem-content").innerHTML = content);
        icon && ($ele.querySelector(".ytp-menuitem-icon").innerHTML = icon);
        if (typeof (callback) == "function") $ele.addEventListener("click", callback)
 
        $menu.appendChild($ele)
    };
 
    (function mountMenu() {
        const $menu = document.querySelector(".ytp-contextmenu>.ytp-panel>.ytp-panel-menu");
        if (!$menu || $menu.innerHTML === '') {
            // waiting framework do something
            return setTimeout(mountMenu, 300)
        }
 
        // github link
        append_context_menu({
            key: 'menu_github',
            label: "-- github --",
            content: "️️⭐",
            href: "https://github.com/zhzLuke96/ytp-rotate",
        })
 
        // rotate menuitem
        append_context_menu({
            key: 'menu_rotate',
            callback: (ev) => {
                if (!playerApi) return;
                const elem = ev.currentTarget;
                elem.querySelector(".ytp-menuitem-content").innerHTML = playerApi.rotate() * 90 + '°';
 
            },
            label: on_zh_lang ? "旋转90°" : "rotate 90°",
            content: "️️0°",
        })
 
        // flip horizintal
        append_context_menu({
            key: 'menu_horizintal',
            callback(ev) {
                if (!playerApi) return;
                const elem = ev.currentTarget;
                elem.setAttribute('aria-checked', playerApi.toogleHorizintal().toString());
            },
            label: on_zh_lang ? "水平翻转" : "flip horizintal",
            icon: '<div style="text-align: center;">↔️</div>'
        })
 
        // flip vertical
        append_context_menu({
            key: 'menu_vertical',
            callback(ev) {
                if (!playerApi) return;
                const elem = ev.currentTarget;
                elem.setAttribute('aria-checked', playerApi.toogleVertical().toString());
            },
            label: on_zh_lang ? "垂直翻转" : "flip vertical",
            icon: '<div style="text-align: center;">↕️</div>'
        })
 
        // picture in picture
        append_context_menu({
            key: 'menu_pip',
            callback(ev) {
                const elem = ev.currentTarget;
                try {
                    if (document.pictureInPictureElement) {
                        document.exitPictureInPicture()
                        elem.setAttribute('aria-checked', (false).toString());
                    } else {
                        $("video").requestPictureInPicture();
                        elem.setAttribute('aria-checked', (true).toString());
                    }
                } catch (error) {
                    let msg = on_zh_lang ? "浏览器不支持[PictureInPicture]或脚本加载错误" : "Browser does not support [PictureInPicture] or script loading error";
                    console.log(msg);
                    alert(msg);
                }
            },
            label: on_zh_lang ? "画中画" : "PIP",
            icon: '<div style="text-align: center;">🖼️</div>',
        })
    })();
})();