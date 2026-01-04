// ==UserScript==
// @name                Instagram: Hide Image
// @name:zh-TW          Instagram 隱藏圖片
// @name:zh-CN          Instagram 隐藏图片
// @name:ja             Instagram 画像を非表示
// @name:ko             Instagram 이미지 숨기기
// @name:ru             Instagram Скрыть изображение
// @version             1.0.3
// @description         Make Instagram Images Opacity Lower.
// @description:zh-TW   調整 Instagram 圖片的透明度。
// @description:zh-CN   调整 Instagram 图片的透明度。
// @description:ja      Instagram 画像の不透明度を低くします。
// @description:ko      Instagram 이미지 불투명도를 낮추십시오.
// @description:ru      Уменьшите непрозрачность изображений в Instagram.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/obCmlr9.png
// @match               https://www.instagram.com/*
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/400736/Instagram%3A%20Hide%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/400736/Instagram%3A%20Hide%20Image.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // icons made by https://www.flaticon.com/authors/pixel-perfect
    const iconOn = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 298.667969h-213.335938c-82.34375 0-149.332031-67.007813-149.332031-149.335938 0-82.324219 66.988281-149.332031 149.332031-149.332031h213.335938c82.34375 0 149.332031 67.007812 149.332031 149.332031 0 82.328125-66.988281 149.335938-149.332031 149.335938zm-213.335938-266.667969c-64.703125 0-117.332031 52.652344-117.332031 117.332031 0 64.683594 52.628906 117.335938 117.332031 117.335938h213.335938c64.703125 0 117.332031-52.652344 117.332031-117.335938 0-64.679687-52.628906-117.332031-117.332031-117.332031zm0 0"/><path d="m362.667969 234.667969c-47.0625 0-85.335938-38.273438-85.335938-85.335938 0-47.058593 38.273438-85.332031 85.335938-85.332031 47.058593 0 85.332031 38.273438 85.332031 85.332031 0 47.0625-38.273438 85.335938-85.332031 85.335938zm0-138.667969c-29.398438 0-53.335938 23.914062-53.335938 53.332031 0 29.421875 23.9375 53.335938 53.335938 53.335938 29.394531 0 53.332031-23.914063 53.332031-53.335938 0-29.417969-23.9375-53.332031-53.332031-53.332031zm0 0"/></svg>`;
    const iconOff = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 0h-213.335938c-82.324219 0-149.332031 66.988281-149.332031 149.332031 0 82.347657 67.007812 149.335938 149.332031 149.335938h213.335938c82.324219 0 149.332031-66.988281 149.332031-149.335938 0-82.34375-67.007812-149.332031-149.332031-149.332031zm-213.335938 234.667969c-47.058593 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.273438-85.332031 85.332031-85.332031 47.0625 0 85.335938 38.273438 85.335938 85.332031 0 47.0625-38.273438 85.335938-85.335938 85.335938zm0 0"/></svg>`;
    const textStyle = `
.switch-set {
    margin-left: 20px;
}
.hide-set {
    transition: opacity 0.3s;
    opacity: 0.1;
}
.show-set {
    opacity: 1 !important;
}`;
    let currentUrl = document.location.href;
    let updating = false;

    css();

    init(10);

    locationChange();

    window.addEventListener("scroll", update);

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(addToggle, 500 * i);
            setTimeout(findImage1, 500 * i);
            setTimeout(findImage2, 500 * i);
            setTimeout(findVideo, 500 * i);
            setTimeout(showAll, 500 * i);
        }
    }

    // toggle
    function addToggle() {
        // check exist
        const exist = document.querySelector(".switch-set");
        if (!!exist) {
            exist.innerHTML = getToggle() ? iconOn : iconOff;
            return;
        }
        // panel
        const panel = document.querySelector(".ctQZg");
        if (!panel) return;
        // switch
        const button = document.createElement("button");
        button.className = "dCJp8 afkep switch-set";
        button.innerHTML = getToggle() ? iconOn : iconOff;
        button.addEventListener("click", onClick);
        panel.appendChild(button);
    }

    function onClick() {
        const afterClick = !getToggle();
        GM_setValue("switch", afterClick);
        this.innerHTML = afterClick ? iconOn : iconOff;
        init(3);
    }

    function getToggle() {
        return GM_getValue("switch", true);
    }

    // hide image
    function findImage1() {
        // check toggle
        if (!getToggle()) return;
        // image ( avatar )
        document.querySelectorAll("img._6q-tv:not(.hide-set)").forEach(image => {
            image.classList.add("hide-set");
            // event
            image.addEventListener("mouseenter", showImage);
            image.addEventListener("mouseleave", hideImage);
        });
    }

    function findImage2() {
        // check toggle
        if (!getToggle()) return;
        // image ( post )
        document.querySelectorAll("img.FFVAD:not(.hide-set)").forEach(image => {
            image.classList.add("hide-set");
            // event
            const hover = image.closest(".eLAPa").lastElementChild;
            hover.addEventListener("mouseenter", showImage);
            hover.addEventListener("mouseleave", hideImage);
        });
    }

    function showImage() {
        const tag = this.tagName;
        // avatar
        if (tag === "IMG") this.classList.add("show-set");
        // post
        else this.parentElement.querySelector("img").classList.add("show-set");
    }

    function hideImage() {
        const tag = this.tagName;
        // avatar
        if (tag === "IMG") this.classList.remove("show-set");
        // post
        else this.parentElement.querySelector("img").classList.remove("show-set");
    }

    // hide video
    function findVideo() {
        // check toggle
        if (!getToggle()) return;
        // video
        document.querySelectorAll("video:not(.hide-set)").forEach(video => {
            video.classList.add("hide-set");
            // thumbnail
            const thumbnail = video.parentElement.querySelector("img");
            thumbnail.classList.add("hide-set");
            // event
            const hover = video.closest(".kPFhm").lastElementChild;
            hover.addEventListener("mouseenter", showVideo);
            hover.addEventListener("mouseleave", hideVideo);
        });
    }

    function showVideo() {
        const video = this.parentElement.querySelector("video");
        video.classList.add("show-set");
    }

    function hideVideo() {
        const video = this.parentElement.querySelector("video");
        video.classList.remove("show-set");
    }

    // show all
    function showAll() {
        // check toggle
        if (getToggle()) return;
        // show
        document.querySelectorAll(".hide-set").forEach(target => target.classList.remove("hide-set"));
    }

    // other
    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.head.appendChild(style);
    }

    function update() {
        if (updating) return;
        updating = true;
        init(3);
        setTimeout(() => { updating = false }, 1000);
    }

    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl !== document.location.href) {
                    currentUrl = document.location.href;
                    init(10);
                }
            });
        });
        const target = document.querySelector("body");
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();
