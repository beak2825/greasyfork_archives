// ==UserScript==
// @name         YT Speed Buttons(L改)
// @name:zh-TW   YT速度按鈕(L改)
// @description  Add speed buttons to YouTube 增加YT速度按鈕
// @namespace    1
// @homepageURL    https://greasyfork.org/zh-TW/users/4839
// @version      1.1.4
// @run-at       document-end
// @author       Braden Best
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=youtube.com&sz=128
// @match        *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/484535/YT%20Speed%20Buttons%28L%E6%94%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/484535/YT%20Speed%20Buttons%28L%E6%94%B9%29.meta.js
// ==/UserScript==
/*快捷鍵
* 復原
+ 加速
- 減速
*/
function video_speed_buttons(anchor, video_el){
    if(!anchor || !video_el)
        return null;
/*按鈕設定*/
    const COLOR_SELECTED = "#FF5500",
        COLOR_NORMAL = "grey",
        BUTTON_SIZE = "120%",
        DEFAULT_SPEED = 1.0,
        LABEL_TEXT = "",
        ALLOW_EXTERNAL_ACCESS = false;

    const BUTTON_TEMPLATES = [
        ["25%",    0.25],
        ["50%",    0.5],
        ["Speed", 1],
        ["1.25x",  1.25],
        ["1.5x",   1.5],
        ["2x",     2],
        ["3x",     3],
        ["4x",     4],
        //["8x",     8],
        //["16x",    16]
    ];

    const buttons = {
        head:      null,
        selected:  null,
        last:      null
    };
/*快捷鍵設定*/
    const keyboard_controls = [
        ["-", "Speed Down", function(ev){
            if(is_comment_box(ev.target))
                return false;

            (buttons.selected || buttons.head)
                .getprev()
                .el
                .dispatchEvent(new MouseEvent("click"));
        }],
        ["+", "Speed Up", function(ev){
            if(is_comment_box(ev.target))
                return false;

            (buttons.selected || buttons.head)
                .getnext()
                .el
                .dispatchEvent(new MouseEvent("click"));
        }],
        ["*", "Reset Speed", function(ev){
            let selbtn = buttons.head;
            let result = null;

            if(is_comment_box(ev.target))
                return false;

            while(selbtn !== null && result === null)
                if(selbtn.speed === DEFAULT_SPEED)
                    result = selbtn;
                else
                    selbtn = selbtn.next;

            if(result === null)
                result = buttons.head;

            result.el.dispatchEvent(new MouseEvent("click"));
        }],

    ];

    const container = (function(){
        let div = document.createElement("div");
        let prev_node = null;

        div.className = "vsb-container";
        div.style.border = "0.5px solid #ccc";
        div.style.marginBottom = "0px";
        div.style.paddingBottom = "0px";
        div.appendChild(SpeedButtonLabel(LABEL_TEXT));

        BUTTON_TEMPLATES.forEach(function(button){
            let speedButton = SpeedButton(...button, div);

            if(buttons.head === null)
                buttons.head = speedButton;

            if(prev_node !== null){
                speedButton.prev = prev_node;
                prev_node.next = speedButton;
            }

            prev_node = speedButton;

            if(speedButton.speed == DEFAULT_SPEED)
                speedButton.select();
        });

        return div;
    })();

    function is_comment_box(el){
        const candidate = [
            ".comment-simplebox-text",
            "textarea"
        ].map(c => document.querySelector(c))
         .find(el => el !== null);

        if(candidate === null){
            logvsb("video_speed_buttons::is_comment_box", "no candidate for comment box. Assuming false.");
            return 0;
        }

        return el === candidate;
    }

    function setPlaybackRate(el, rate){
        if(el)
            el.playbackRate = rate;
        else
            logvsb("video_speed_buttons::setPlaybackRate", "video element is null or undefined", 1);
    }

    function SpeedButtonLabel(text){
        let el = document.createElement("span");
/*按鈕文字*/
        el.innerHTML = text;
        el.style.marginRight = "10px";
        el.style.fontWeight = "bold";
        el.style.fontSize = BUTTON_SIZE;
        el.style.color = COLOR_NORMAL;

        return el;
    }

    function SpeedButton(text, speed, parent){
        let el = SpeedButtonLabel(text);
        let self;

        el.style.cursor = "pointer";

        el.addEventListener("click", function(){
            setPlaybackRate(video_el, speed);
            self.select();
        });

        parent.appendChild(el);

        function select(){
            if(buttons.last !== null)
                buttons.last.el.style.color = COLOR_NORMAL;

            buttons.last = self;
            buttons.selected = self;
            el.style.color = COLOR_SELECTED;
        }

        function getprev(){
            if(self.prev === null)
                return self;

            return buttons.selected = self.prev;
        }

        function getnext(){
            if(self.next === null)
                return self;

            return buttons.selected = self.next;
        }

        return self = {
            el,
            text,
            speed,
            prev:  null,
            next:  null,
            select,
            getprev,
            getnext
        };
    }

    function kill(){
        anchor.removeChild(container);
        document.body.removeEventListener("keydown", ev_keyboard);
    }

    function set_video_el(new_video_el){
        video_el = new_video_el;
    }

    function ev_keyboard(ev){
        let match = keyboard_controls.find(([key, unused, callback]) => key === ev.key);
        let callback = (match || {2: ()=>null})[2];

        callback(ev);
    }

    setPlaybackRate(video_el, DEFAULT_SPEED);
    anchor.insertBefore(container, anchor.firstChild);
    document.body.addEventListener("keydown", ev_keyboard);

    return {
        controls: keyboard_controls,
        buttons,
        kill,
        SpeedButton,
        setPlaybackRate,
        is_comment_box,
        set_video_el,
        ALLOW_EXTERNAL_ACCESS,
    };
}

video_speed_buttons.from_query = function(anchor_q, video_q){
    return video_speed_buttons(
            document.querySelector(anchor_q),
            document.querySelector(video_q));
}

// Multi-purpose Loader (defaults to floating on top right)
const loader_data = {
    container_candidates: [
        // YouTube
        "div#above-the-fold",
    ],

    css_div: [

    ].map(rule => rule.split(/: */)),

    css_vsb_container: [

    ].map(rule => rule.split(/: */))
};

function logvsb(where, msg, lvl = 0){
    let logf = (["info", "error"])[lvl];

    console[logf](`[vsb::${where}] ${msg}`);
}

function loader_loop(){
    let vsbc = () => document.querySelector(".vsb-container");
    let candidate;
    let default_candidate;
    let vsb_handle;

    if(vsbc() !== null)
        return;

    candidate = loader_data
        .container_candidates
        .map(candidate => document.querySelector(candidate))
        .find(candidate => candidate !== null);

    default_candidate = (function(){
        let el = document.createElement("div");

        loader_data.css_div.forEach(function([name, value]){
            el.style[name] = value; });

        return el;
    }());

    vsb_handle = video_speed_buttons(candidate || default_candidate, document.querySelector("video"));

    if(candidate === null){
        logvsb("loader_loop", "no candidates for title section. Defaulting to top of page.");
        document.body.appendChild(default_candidate);

        loader_data.css_vsb_container.forEach(function([name, value]){
            vsbc().style[name] = value;
        });
    }

    if(vsb_handle.ALLOW_EXTERNAL_ACCESS)
        window.vsb = vsb_handle;
}

setInterval(function(){
    if(document.readyState === "complete")
        setTimeout(loader_loop, 1000);
}, 1000); // Blame YouTube for this
