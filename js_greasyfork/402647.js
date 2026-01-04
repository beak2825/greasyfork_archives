// ==UserScript==
// @name                Discord: Hide Image
// @name:zh-TW          Discord 隱藏圖片
// @name:zh-CN          Discord 隐藏图片
// @name:ja             Discord 画像を非表示
// @name:ko             Discord 이미지 숨기기
// @name:ru             Discord Скрыть изображение
// @version             1.0.9
// @description         Make images opacity lower.
// @description:zh-TW   使圖片較為透明。
// @description:zh-CN   使图片较为透明。
// @description:ja      画像の不透明度を低くします。
// @description:ko      이미지의 불투명도를 낮추십시오.
// @description:ru      Уменьшите непрозрачность изображений.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/rE9N0R7.png
// @match               https://discord.com/channels/*
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/402647/Discord%3A%20Hide%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/402647/Discord%3A%20Hide%20Image.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // icons made by https://www.flaticon.com/authors/pixel-perfect
    const iconOn = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 298.667969h-213.335938c-82.34375 0-149.332031-67.007813-149.332031-149.335938 0-82.324219 66.988281-149.332031 149.332031-149.332031h213.335938c82.34375 0 149.332031 67.007812 149.332031 149.332031 0 82.328125-66.988281 149.335938-149.332031 149.335938zm-213.335938-266.667969c-64.703125 0-117.332031 52.652344-117.332031 117.332031 0 64.683594 52.628906 117.335938 117.332031 117.335938h213.335938c64.703125 0 117.332031-52.652344 117.332031-117.335938 0-64.679687-52.628906-117.332031-117.332031-117.332031zm0 0"/><path d="m362.667969 234.667969c-47.0625 0-85.335938-38.273438-85.335938-85.335938 0-47.058593 38.273438-85.332031 85.335938-85.332031 47.058593 0 85.332031 38.273438 85.332031 85.332031 0 47.0625-38.273438 85.335938-85.332031 85.335938zm0-138.667969c-29.398438 0-53.335938 23.914062-53.335938 53.332031 0 29.421875 23.9375 53.335938 53.335938 53.335938 29.394531 0 53.332031-23.914063 53.332031-53.335938 0-29.417969-23.9375-53.332031-53.332031-53.332031zm0 0"/></svg>`;
    const iconOff = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 0h-213.335938c-82.324219 0-149.332031 66.988281-149.332031 149.332031 0 82.347657 67.007812 149.335938 149.332031 149.335938h213.335938c82.324219 0 149.332031-66.988281 149.332031-149.335938 0-82.34375-67.007812-149.332031-149.332031-149.332031zm-213.335938 234.667969c-47.058593 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.273438-85.332031 85.332031-85.332031 47.0625 0 85.335938 38.273438 85.335938 85.332031 0 47.0625-38.273438 85.335938-85.335938 85.335938zm0 0"/></svg>`;

    // css
    const textStyle = `
.hide-set {
    transition: opacity 0.3s;
}
.switch-set {
    fill: white;
    text-align: center;
    bottom: 10px;
    cursor: pointer;
    pointer-events: all;
}`;

    // target
    const targets = [
        "img:not(.icon-27yU2q)", // all images.
        "video", // all videos ( gifs ).
        ".animatedContainer-1pJv5C", // the image on top of server channel lists.
        ".avatarContainer-2inGBK", // the avatar images in channels.
        ".icon-27yU2q" // discord server icons.
    ];

    // update
    let updating = false;

    css();

    init(10);

    locationChange();

    window.addEventListener("scroll", update, true);

    function init(times) {
        for (let i = 0; i < times; i++) {
            // switch
            setTimeout(switchButton, 500 * i);
            // hide
            for (const target of targets) {
                setTimeout(() => hideTarget(target), 500 * i);
            }
        }
        // show
        showTarget();
    }

    function switchButton() {
        // check exist
        const isExist = document.querySelector(".switch-set");
        if (!!isExist) return;
        // left panel ( parent )
        const leftPanel = document.querySelector("nav");
        if (!leftPanel) return;
        // add switch button
        const button = document.createElement("div");
        button.className = "unreadMentionsIndicatorBottom-BXS58x switch-set";
        button.innerHTML = getToggle() ? iconOn : iconOff;
        button.addEventListener("click", onClick);
        leftPanel.appendChild(button);
    }

    function onClick() {
        const afterClick = !getToggle();
        GM_setValue("switch", afterClick);
        this.innerHTML = afterClick ? iconOn : iconOff;
        init(3);
    }

    function hideTarget(target) {
        // check toggle
        if (!getToggle()) return;
        // hide target
        document.querySelectorAll(`${target}:not(.hide-set)`).forEach(t => {
            t.classList.add("hide-set");
            t.style.opacity = 0.1;
            t.addEventListener("mouseenter", addListener);
            t.addEventListener("mouseleave", addListener);
        });
    }

    function showTarget() {
        // check toggle
        if (getToggle()) return;
        // show target
        document.querySelectorAll(".hide-set").forEach(t => {
            t.classList.remove("hide-set");
            t.style.opacity = 1;
            t.removeEventListener("mouseenter", addListener);
            t.removeEventListener("mouseleave", addListener);
        });
    }

    function getToggle() {
        return GM_getValue("switch", true);
    }

    function addListener() {
        this.style.opacity = this.style.opacity > 0.5 ? 0.1 : 1;
    }

    function update() {
        if (updating) return;
        updating = true;
        init(3);
        setTimeout(() => { updating = false; }, 1000);
    }

    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.head.appendChild(style);
    }

    function locationChange() {
        window.addEventListener('locationchange', () => init(10));
        // situation 1
        history.pushState = (f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushState'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.pushState);
        // situation 2
        history.replaceState = (f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replaceState'));
            window.dispatchEvent(new Event('locationchange'));
            return ret;
        })(history.replaceState);
        // situation 3
        window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')));
    }

})();
