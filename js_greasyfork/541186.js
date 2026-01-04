// ==UserScript==
// @name         播放器增强 (Firefox Android)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动增强网页视频播放器功能，包括手势控制、倍速和跳跃。
// @author       Nihility (Modified for Firefox by Gemini)
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541186/%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%20%28Firefox%20Android%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541186/%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%20%28Firefox%20Android%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Via 瀏覽器特有的配置，現在直接作為 JavaScript 變數
    const config = {
        sec_1cm: 10,
        increase_1cm: 5
    };

    /* lib begin */

    function debounce(fn, ms = 0) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    function throttle(fn, wait) {
        let inThrottle, lastFn, lastTime;
        return function(...args) {
            if (!inThrottle) {
                fn.apply(this, args);
                lastTime = Date.now();
                inThrottle = true;
            } else {
                clearTimeout(lastFn);
                lastFn = setTimeout(function() {
                    if (Date.now() - lastTime >= wait) {
                        fn.apply(this, args);
                        lastTime = Date.now();
                    }
                }, Math.max(wait - (Date.now() - lastTime), 0));
            }
        };
    }

    function is_same_size_position(ele1, ele2) {
        try {
            return ele1.clientWidth === ele2.clientWidth &&
                   ele1.clientHeight === ele2.clientHeight &&
                   ele1.scrollHeight === ele2.scrollHeight;
        } catch (e) {
            return false;
        }
    }

    function find_top_wrap_ele(ele) {
        let wrap = ele;
        while (ele && ele.tagName !== 'BODY' && ele.parentElement) { // Added ele check for safety
            ele = ele.parentElement;
            if (is_same_size_position(wrap, ele)) {
                wrap = ele;
            }
        }
        return wrap;
    }

    function is_parent(ele, parent) {
        while (ele && ele.tagName !== 'BODY' && ele !== parent && ele.parentElement !== parent) {
            ele = ele.parentElement;
        }
        return ele && ele.parentElement === parent; // Added ele check for safety
    }

    function flatten(array) {
        if (!Array.isArray(array)) {
            return [array];
        } else if (array.length === 0) {
            return [];
        } else {
            return flatten(array[0]).concat(flatten(array.slice(1)));
        }
    }

    function zero_padding(number, length = 2) {
        return String(number).padStart(length, '0'); // More modern way
    }

    function sec2HHMMSS(time, sec_base = 1) {
        const sec = sec_base, min = 60 * sec, hour = 60 * min;
        const h = Math.floor(time / hour);
        const m = Math.floor((time % hour) / min);
        const s = Math.floor((time % min) / sec);
        let result = zero_padding(m) + ':' + zero_padding(s);
        if (h) {
            return zero_padding(h) + ':' + result;
        } else {
            return result;
        }
    }

    function HHMMSS2sec(time, sec_base = 1) {
        const sec = sec_base, min = 60 * sec, hour = 60 * min;
        const split = time.split(':');
        let h = 0, m = 0, s = 0;

        if (split.length === 3) {
            h = parseInt(split[0], 10);
            m = parseInt(split[1], 10);
            s = parseInt(split[2], 10);
        } else if (split.length === 2) {
            m = parseInt(split[0], 10);
            s = parseInt(split[1], 10);
        } else if (split.length === 1) {
            s = parseInt(split[0], 10);
        }
        return h * hour + m * min + s * sec;
    }

    let _1cm_pixel_num_cached = null;
    function get_1cm_pixel_num() {
        if (_1cm_pixel_num_cached !== null) {
            return _1cm_pixel_num_cached;
        }
        const div = document.createElement('div');
        div.style.cssText = 'position: fixed; width: 1cm; visibility: hidden;';
        document.body.appendChild(div); // Use appendChild
        const pixel = div.clientWidth;
        div.remove();
        _1cm_pixel_num_cached = pixel;
        return pixel;
    }

    function px2cm(px) {
        return px / get_1cm_pixel_num();
    }

    /* lib end */

    /* add custom event begin */

    function copy(obj) {
        return JSON.parse(JSON.stringify(obj)); // More robust copy
    }

    // Custom event definitions - no need to export directly
    // Using CustomEvent for broader compatibility
    function TapEvent(detail) {
        return new CustomEvent('tap', { bubbles: true, cancelable: true, detail: detail });
    }

    function DoubleTapEvent(detail) {
        return new CustomEvent('doubletap', { bubbles: true, cancelable: true, detail: detail });
    }

    // This conversion to MouseEvent might not be necessary or effective in all cases
    // TouchEvent2MouseEvent is usually for simulating click from touch
    function TouchEvent2MouseEvent(event_type, event) {
        const touch = event.changedTouches && event.changedTouches[0] || event.touches && event.touches[0] || {};
        return new MouseEvent(event_type, {
            bubbles: true,
            cancelable: true,
            clientX: touch.clientX,
            clientY: touch.clientY,
            screenX: touch.screenX,
            screenY: touch.screenY,
            // Copy other relevant properties
        });
    }

    function add_tap_event_hook(element) {
        let start_touch, end_touch, end_event_details;
        const start = e => {
            start_touch = copy(e.touches[0]);
            end_event_details = copy(e); // Store event details for custom event
        };
        const move = e => {
            end_touch = copy(e.touches[0]);
            end_event_details = copy(e);
        };
        const end = e => {
            if (Math.abs(start_touch.clientX - end_touch.clientX) <= 10 &&
                Math.abs(start_touch.clientY - end_touch.clientY) <= 10) {
                e.target.dispatchEvent(new TapEvent(end_event_details)); // Dispatch CustomEvent
                e.preventDefault(); // Prevent default touch behavior
                e.target.dispatchEvent(TouchEvent2MouseEvent('click', e)); // Dispatch simulated click
            }
        };

        element.addEventListener('touchstart', start, { passive: false });
        element.addEventListener('touchmove', move, { passive: false });
        element.addEventListener('touchend', end, { passive: false });

        return function event_clearer() {
            element.removeEventListener('touchstart', start, { passive: false });
            element.removeEventListener('touchmove', move, { passive: false });
            element.removeEventListener('touchend', end, { passive: false });
        };
    }

    function add_doubletap_event_hook(element) {
        let last_tap_time = 0;
        const doubletap_judge = e => {
            // Check if it's a tap event, not a touch event
            if (e.type === 'tap') {
                if (Date.now() - last_tap_time <= 250) { // 250ms is common double-tap threshold
                    last_tap_time = 0;
                    e.target.dispatchEvent(new DoubleTapEvent(e.detail)); // Dispatch CustomEvent
                    e.preventDefault(); // Prevent default click on double-tap if necessary
                } else {
                    last_tap_time = Date.now();
                }
            }
        };

        element.addEventListener('tap', doubletap_judge, true);

        return function event_clearer() {
            element.removeEventListener('tap', doubletap_judge, true);
        };
    }

    /* add custom event end */

    function create_prompt_panel() {
        const prompt_div = document.createElement('div');
        const prompt_symbol_div = document.createElement('div');
        const prompt_time_div = document.createElement('div');
        const prompt_time_begin_span = document.createElement('span');
        const prompt_time_end_span = document.createElement('span');

        prompt_div.append(prompt_symbol_div, prompt_time_div);
        prompt_time_div.append(prompt_time_begin_span, ' / ', prompt_time_end_span);

        prompt_div.style.cssText = `
            width: 10em;
            position: absolute;
            z-index: 99999999;
            left: 50%;
            top: 50%;
            padding: 15px 0px;
            margin: calc(-0.5em - 15px) auto auto -5em;
            background-color: rgba(51, 51, 51, 0.8);
            border-radius: 15px;
            text-align: center;
            font-size: 0.5cm; /* Ensure cm units are calculated based on get_1cm_pixel_num() if needed */
            color: white;
            display: none;
        `;
        prompt_time_begin_span.style.color = '#2fb3ff';

        return {
            div: prompt_div,
            symbol: prompt_symbol_div,
            left_time: prompt_time_begin_span,
            right_time: prompt_time_end_span,
        };
    }

    function create_control_panel() {
        const div = document.createElement('div');
        const content_divs = Array(5).fill().map(() => document.createElement('div'));
        div.append(...content_divs); // Use spread syntax for append

        div.style.cssText = `
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            position: absolute;
            z-index: 9999999999;
            top: 0;
            background-color: rgba(51, 51, 51, 0.8);
            color: white;
            box-sizing: border-box;
            display: none;
            justify-content: center;
            align-items: center;
            font-size: 1cm;
            pointer-events: auto;
        `;

        return {
            display() {
                div.style.display = 'flex';
            },
            hidden() {
                div.style.display = 'none';
            },
            toggle() {
                if (div.style.display === 'flex') {
                    this.hidden();
                } else {
                    this.display();
                }
            },
            div,
            content_divs,
        };
    }

    const get_video_touch_hook = (video, e_initial) => { // Renamed 'e' to 'e_initial' to avoid confusion
        let top_wrap = find_top_wrap_ele(video);
        if (top_wrap === video) {
            top_wrap = document.createElement('div');
            video.parentElement.insertBefore(top_wrap, video);
            top_wrap.append(video);
        }

        const event_clearer = [add_tap_event_hook, add_doubletap_event_hook].map(x => x(top_wrap));

        const hook_fn = {
            start: [],
            move: [],
            end: [],
        };

        let start_x, start_time;
        const touch_start = e => {
            start_x = e.touches[0].screenX;
            start_time = video.currentTime;

            hook_fn.start.forEach(fn => fn(e, start_time));
        };
        if (e_initial) { // Use e_initial here
            setTimeout(touch_start, 0, e_initial);
        }

        const touch_move = e => {
            const end_x = e.touches[0].screenX;
            const x_distance_px = end_x - start_x;
            const time_length = px2cm(x_distance_px) * (config.sec_1cm || 1); // Use config.sec_1cm

            hook_fn.move.forEach(fn => fn(e, start_time, x_distance_px, time_length));
        };

        const touch_end = e => {
            hook_fn.end.forEach(fn => fn(e));
        };

        top_wrap.addEventListener('touchstart', touch_start, { passive: false });
        top_wrap.addEventListener('touchmove', touch_move, { passive: false });
        top_wrap.addEventListener('touchend', touch_end, { passive: false });

        const remove_hook = () => {
            top_wrap.removeEventListener('touchstart', touch_start);
            top_wrap.removeEventListener('touchmove', touch_move);
            top_wrap.removeEventListener('touchend', touch_end);
        };

        return { video, hook_fn, wrap: top_wrap, event_clearer: event_clearer.concat(remove_hook) };
    };

    const hook_video_move = hook => {
        const {video, hook_fn} = hook;

        let paused_on_start; // Renamed 'paused' to avoid conflict
        hook_fn.start.push(() => {
            paused_on_start = video.paused;
        });

        let playing;
        const pause_video = () => { // Renamed 'pause'
            if (!video.paused) {
                video.pause();
                playing = true;
            }
        };
        const play_video = debounce(() => { // Renamed 'play'
            if (playing) {
                video.play();
                playing = false;
            }
        }, 100);

        hook_fn.move.push((e, start_time, x_distance_px, time_length) => {
            pause_video();
            video.currentTime = Math.max(Math.min(start_time + time_length,
                video.duration),
                0);
            play_video();
        });
    };

    const hook_video_time_change = hook => {
        const {video, hook_fn, event_clearer} = hook;
        const top_wrap = find_top_wrap_ele(video);
        const video_prompt = create_prompt_panel();
        top_wrap.append(video_prompt.div);

        event_clearer.push(() => video_prompt.div.remove());

        hook_fn.start.push(() => {
            video_prompt.right_time.innerText = sec2HHMMSS(video.duration);
        });

        hook_fn.move.push((e, start_time, x_distance_px, time_length) => {
            video_prompt.div.style.display = 'block';
            time_length = video.currentTime - start_time; // Recalculate based on actual current time
            video_prompt.symbol.innerText = time_length < 0 ? '-' : '+';
            video_prompt.symbol.innerText += sec2HHMMSS(Math.abs(time_length));
            video_prompt.left_time.innerText = sec2HHMMSS(video.currentTime);
        });

        hook_fn.end.push(() => {
            video_prompt.div.style.display = 'none';
        });
    };

    const hook_video_control = hook => {
        const {video, hook_fn, event_clearer} = hook;
        const top_wrap = find_top_wrap_ele(video);
        const wrap = document.createElement('div');
        const paddle_div = document.createElement('div'); // Unused in original, but kept
        const speed_div = document.createElement('div');
        const jump_div = document.createElement('div');
        const skip_div = document.createElement('div');
        const fullscreen_div = document.createElement('div');
        const control = create_control_panel();

        top_wrap.append(wrap);
        const buttons = [paddle_div, speed_div, jump_div, skip_div, fullscreen_div];
        wrap.append(...buttons); // Use spread syntax
        wrap.append(control.div);

        wrap.style.cssText = `
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0px;
            left: 0px;
            pointer-events: none;
            z-index: 9999999999;
            display: none;
        `;

        const update_wrap_size = () => {
            wrap.style.fontSize = `${Math.min(video.clientHeight, video.clientWidth) / buttons.length / 4}px`;
        };

        // Call once initially
        update_wrap_size();

        buttons.forEach(div => div.style.cssText =
            `
            width: 3em;
            height: 3em;
            line-height: 3em;
            text-align: center;
            border: solid white;
            border-radius: 100%;
            color: white;
            pointer-events: auto;
            `);

        paddle_div.style.pointerEvents = 'none';
        paddle_div.style.visibility = 'hidden';

        const skip_video = throttle(e => {
            video.currentTime = video.duration;
        }, 500);
        const toggle_play_state = throttle(e => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }, 500);
        const toggle_fullscreen = throttle(e => {
            if (document.fullscreenElement) { // Use document.fullscreenElement
                document.exitFullscreen();
            } else {
                // Ensure top_wrap has requestFullscreen method
                if (top_wrap.requestFullscreen) {
                    top_wrap.requestFullscreen();
                } else if (video.requestFullscreen) { // Fallback to video element itself
                    video.requestFullscreen();
                }
            }
        }, 500);

        const update_button = () => {
            speed_div.innerText = video.playbackRate + 'x';
            jump_div.innerText = sec2HHMMSS(video.currentTime);
        };
        const hidden_wrap = () => {
            control.hidden();
            wrap.style.display = 'none';
            wrap.style.pointerEvents = 'none';
        };

        const hidden_wrap_delay = debounce(hidden_wrap, 3000);

        const display_wrap = throttle((e) => {
            update_wrap_size();
            wrap.style.display = 'block';
            update_button();
            hidden_wrap_delay();
        }, 1000);

        const prevent_event = e => {
            if (e.cancelable) {
                e.preventDefault();
            }
            e.stopImmediatePropagation();
        };

        skip_div.innerText = 'skip';
        fullscreen_div.innerText = 'FS';

        skip_div.addEventListener('tap', skip_video);
        fullscreen_div.addEventListener('tap', toggle_fullscreen);

        wrap.addEventListener('touchend', prevent_event);

        wrap.addEventListener('touchmove', e => {
            prevent_event(e);
            update_button();
            hidden_wrap_delay();
        });

        top_wrap.addEventListener('tap', display_wrap);
        top_wrap.addEventListener('doubletap', toggle_play_state);

        event_clearer.push(() => {
            top_wrap.removeEventListener('tap', display_wrap);
            top_wrap.removeEventListener('doubletap', toggle_play_state);
            wrap.remove();
        });

        function speed_activate() {
            video.playbackRate = parseFloat(control.div.innerText.replace(/[\r\n]+/g, ''));
            update_button();
            hidden_wrap();
        }

        function jump_activate() {
            video.currentTime = HHMMSS2sec(control.div.innerText.replace(/[\r\n]+/g, ''));
            update_button();
            hidden_wrap();
        }

        function clear_content() {
            control.content_divs.forEach(div => div.innerHTML = '');
        }

        const set_content_tap_fn = (() => {
            let bind_fn = [];
            return fn => {
                bind_fn.forEach(([div, boundFn]) => div.removeEventListener('tap', boundFn)); // Use boundFn
                bind_fn = [];
                control.content_divs.forEach(div => {
                    const newFn = fn; // Ensure a new function reference for each binding
                    bind_fn.push([div, newFn]);
                    div.addEventListener('tap', newFn);
                });
            };
        })();

        let state = [];
        function set_state() {
            control.content_divs.forEach((div, i) => state[i] = div.innerText);
        }

        let start_y_touch, modifier_func; // Renamed modifier
        const start_control_drag = e => { // Renamed start
            start_y_touch = e.touches[0].screenY;
            set_state();
        };
        const move_control_drag = e => { // Renamed move
            const end_y = e.touches[0].screenY;
            const y_distance_px = start_y_touch - end_y;
            const increase = Math.floor(px2cm(y_distance_px) * (config.increase_1cm || 1)); // Use config.increase_1cm
            const idx = Array.from(e.target.parentElement.children).indexOf(e.target);
            if (modifier_func[idx]) { // Use modifier_func
                modifier_func[idx](increase);
            }
        };

        const increase_helper = (state_idx, increase_val, // Renamed increase
            limit, pre_ele_modifier, wrap_fn = x => x) => { // Renamed wrap
            const v = parseFloat(state[state_idx]) + increase_val;
            if (limit !== undefined) {
                if (pre_ele_modifier) {
                    if (v >= limit) {
                        pre_ele_modifier(Math.floor(v / limit));
                        control.content_divs[state_idx].innerText = wrap_fn(v % limit);
                    } else if (v < 0) {
                        pre_ele_modifier(-1);
                        control.content_divs[state_idx].innerText = wrap_fn(limit + v);
                    } else {
                        control.content_divs[state_idx].innerText = wrap_fn(v);
                    }
                } else {
                    control.content_divs[state_idx].innerText =
                        wrap_fn(Math.min(Math.max(v, 0), limit));
                }
            } else {
                control.content_divs[state_idx].innerText = wrap_fn(v);
            }
        };

        const speed_modifier_funcs = []; // Renamed speed_modifier
        speed_modifier_funcs[0] = (increase) => {
            increase_helper(0, increase);
        };
        speed_modifier_funcs[2] = (increase) => {
            increase_helper(2, increase, 10, speed_modifier_funcs[0]);
        };
        speed_modifier_funcs[3] = (increase) => {
            increase_helper(3, increase, 10, speed_modifier_funcs[2]);
        };


        const jump_modifier_funcs = []; // Renamed jump_modifier
        jump_modifier_funcs[0] = (increase) => {
            increase_helper(0, increase, undefined, undefined, zero_padding);
        };
        jump_modifier_funcs[2] = (increase) => {
            increase_helper(2, increase, 60, jump_modifier_funcs[0], zero_padding);
        };
        jump_modifier_funcs[4] = (increase) => {
            increase_helper(4, increase, 60, jump_modifier_funcs[2], zero_padding);
        };

        speed_div.addEventListener('tap', throttle(e => {
            e.stopImmediatePropagation();
            clear_content();
            const split = video.playbackRate.toString().split('.');
            control.content_divs[0].innerText = split[0];
            control.content_divs[1].innerText = '.';
            control.content_divs[2].innerText = (split[1] || '00')[0] || '0'; // Access char by index
            control.content_divs[3].innerText = (split[1] || '00')[1] || '0'; // Access char by index
            control.content_divs[4].innerText = 'x';
            modifier_func = speed_modifier_funcs; // Assign modifier_func
            set_content_tap_fn(speed_activate);
            control.display();
            wrap.style.pointerEvents = 'auto';
        }, 500));

        jump_div.addEventListener('tap', throttle(e => {
            e.stopImmediatePropagation();
            clear_content();
            const time = sec2HHMMSS(video.currentTime);
            const split = time.split(':');
            if (split.length < 3) {
                split.unshift('00');
            }
            control.content_divs[0].innerText = split[0];
            control.content_divs[1].innerText = ':';
            control.content_divs[2].innerText = split[1];
            control.content_divs[3].innerText = ':';
            control.content_divs[4].innerText = split[2];
            modifier_func = jump_modifier_funcs; // Assign modifier_func
            set_content_tap_fn(jump_activate);
            control.display();
            wrap.style.pointerEvents = 'auto';
        }, 500));

        control.content_divs.forEach(div => {
            div.addEventListener('touchstart', start_control_drag, { passive: false });
            div.addEventListener('touchmove', move_control_drag, { passive: false });
        });
    };

    function get_frames_recursive(window_obj) {
        const frames = [window_obj];
        for (let i = 0; i < window_obj.frames.length; i++) {
            try {
                // Accessing cross-origin frames might throw an error
                if (window_obj.frames[i] && window_obj.frames[i].document) {
                    frames.push(...get_frames_recursive(window_obj.frames[i]));
                }
            } catch (e) {
                // console.warn("Cannot access cross-origin frame:", e);
                continue;
            }
        }
        return frames;
    }

    function get_videos() {
        const frames = get_frames_recursive(window);
        const frame_video = frame => Array.from(frame.document.querySelectorAll('video'));
        const shadow_output_elements = frame => Array.from(frame.document.querySelectorAll("shadow-output")); // Assuming 'shadow-output' is still relevant
        const shadow_video = shadow_ele => Array.from(shadow_ele.shadowRoot ? shadow_ele.shadowRoot.querySelectorAll("video") : []);

        const all_videos = [];
        frames.forEach(frame => {
            all_videos.push(...frame_video(frame));
            shadow_output_elements(frame).forEach(shadow_ele => {
                all_videos.push(...shadow_video(shadow_ele));
            });
        });
        return all_videos;
    }

    function find_hook(video) {
        window.__hook_video__ = window.__hook_video__ || [];
        const exist_video = window.__hook_video__.find(v => v.video === video);
        return exist_video;
    }

    function register_hook(hook) {
        if (!find_hook(hook.video)) {
            window.__hook_video__.push(hook);
            return hook;
        }
        return null; // Return null if already hooked
    }

    const hook_video_init = (video) => { // Renamed from hook_video
        const exist_video = find_hook(video);
        if (video.clientWidth > 0 && video.clientHeight > 0 && // Ensure video is visible
            (!exist_video || !is_parent(exist_video.wrap, find_top_wrap_ele(video)))) { // Check if parent changed
            
            // Only create new hook if video is not already handled or its wrapping parent has changed
            if (!exist_video) {
                 const hook = get_video_touch_hook(video);
                 hook_video_move(hook);
                 hook_video_time_change(hook);
                 hook_video_control(hook);
                 register_hook(hook);
                 console.log('video-improve: loaded for ', video, ', wrapped by ', find_top_wrap_ele(video));
            } else if (!is_parent(exist_video.wrap, find_top_wrap_ele(video))) {
                // If video exists but its wrapper changed, re-hook it
                exist_video.event_clearer.forEach(x => x()); // Clear old event listeners
                const new_hook = get_video_touch_hook(video);
                hook_video_move(new_hook);
                hook_video_time_change(new_hook);
                hook_video_control(new_hook);
                Object.assign(exist_video, new_hook); // Update existing hook object
                console.log('video-improve: reloaded for ', video, ', wrapped by ', find_top_wrap_ele(video));
            }
        }
    };

    // Initial scan and periodic scan for videos
    function scan_and_hook_videos() {
        get_videos().forEach(hook_video_init);
    }

    // Run initial scan
    scan_and_hook_videos();

    // Periodically scan for new videos (e.g., dynamically loaded content)
    setInterval(scan_and_hook_videos, 3000);

})();