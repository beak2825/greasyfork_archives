// ==UserScript==
// @name                Twitter: Hide Image
// @name:zh-TW          Twitter 隱藏圖片
// @name:zh-CN          Twitter 隐藏图片
// @name:ja             Twitter 画像を非表示
// @name:ko             Twitter 이미지 숨기기
// @name:ru             Twitter Скрыть изображение
// @version             1.0.5
// @description         Make Twitter Images Opacity Lower.
// @description:zh-TW   調整 Twitter 圖片的透明度。
// @description:zh-CN   调整 Twitter 图片的透明度。
// @description:ja      Twitter 画像の不透明度を低くします。
// @description:ko      Twitter 이미지 불투명도를 낮추십시오.
// @description:ru      Уменьшите непрозрачность изображений в Twitter.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/M9oO8K9.png
// @match               https://twitter.com/*
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/399694/Twitter%3A%20Hide%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/399694/Twitter%3A%20Hide%20Image.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    // icons made by https://www.flaticon.com/authors/pixel-perfect
    const iconOn = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 298.667969h-213.335938c-82.34375 0-149.332031-67.007813-149.332031-149.335938 0-82.324219 66.988281-149.332031 149.332031-149.332031h213.335938c82.34375 0 149.332031 67.007812 149.332031 149.332031 0 82.328125-66.988281 149.335938-149.332031 149.335938zm-213.335938-266.667969c-64.703125 0-117.332031 52.652344-117.332031 117.332031 0 64.683594 52.628906 117.335938 117.332031 117.335938h213.335938c64.703125 0 117.332031-52.652344 117.332031-117.335938 0-64.679687-52.628906-117.332031-117.332031-117.332031zm0 0"/><path d="m362.667969 234.667969c-47.0625 0-85.335938-38.273438-85.335938-85.335938 0-47.058593 38.273438-85.332031 85.335938-85.332031 47.058593 0 85.332031 38.273438 85.332031 85.332031 0 47.0625-38.273438 85.335938-85.332031 85.335938zm0-138.667969c-29.398438 0-53.335938 23.914062-53.335938 53.332031 0 29.421875 23.9375 53.335938 53.335938 53.335938 29.394531 0 53.332031-23.914063 53.332031-53.335938 0-29.417969-23.9375-53.332031-53.332031-53.332031zm0 0"/></svg>`;
    const iconOff = `<svg width="35" height="35" viewBox="0 -107 512 512"><path d="m362.667969 0h-213.335938c-82.324219 0-149.332031 66.988281-149.332031 149.332031 0 82.347657 67.007812 149.335938 149.332031 149.335938h213.335938c82.324219 0 149.332031-66.988281 149.332031-149.335938 0-82.34375-67.007812-149.332031-149.332031-149.332031zm-213.335938 234.667969c-47.058593 0-85.332031-38.273438-85.332031-85.335938 0-47.058593 38.273438-85.332031 85.332031-85.332031 47.0625 0 85.335938 38.273438 85.335938 85.332031 0 47.0625-38.273438 85.335938-85.335938 85.335938zm0 0"/></svg>`;
    const textStyle = `
.hide-set {
    transition: opacity 0.3s;
    opacity: 0.1;
}
.show-set {
    opacity: 1 !important;
}
.icon-set {
    position: absolute;
    transition: opacity 0.3s;
}
.toggle-off-set {
    opacity: 0 !important;
}`;
    const colors = ["r-13gxpu9", "r-61mi1v", "r-daml9f", "r-xfsgu1", "r-1qkqhnw", "r-nw8l94"];
    let currentUrl = document.location.href;
    let updating = false;

    css();

    init(10);

    locationChange();

    window.addEventListener("scroll", update);

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(addToggle, 500 * i);
            setTimeout(sortToggle, 500 * i);
            setTimeout(findImage, 500 * i);
            setTimeout(removeBlock, 500 * i);
            setTimeout(showImage, 500 * i);
        }
    }

    // toggle
    function addToggle() {
        // exist
        if (!!document.querySelector(".toggle-set")) return;
        // check
        const panel = document.querySelector(".r-1awozwy.r-1h3ijdo.r-1777fci") || document.querySelector(".r-18u37iz.r-1ye8kvj");
        if (!panel) return;
        // create
        const div1 = document.createElement("div");
        div1.className = "css-1dbjc4n r-obd0qt r-1pz39u2 r-1777fci r-1joea0r r-1vsu8ta r-18qmn74 toggle-set";
        div1.addEventListener("click", () => onClick(divOn, divOff));
        const div2 = document.createElement("div");
        div2.className = "css-18t94o4 css-1dbjc4n r-1niwhzg r-42olwf r-sdzlij r-1phboty r-rs99b7 r-1w2pmg r-1vuscfd r-53xb7h r-1ny4l3l r-mk0yit r-o7ynqc r-6416eg r-lrvibr";
        const divOn = document.createElement("div");
        divOn.className = `css-901oao r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-a023e6 r-vw2c0b r-1777fci r-eljoum r-dnmrzs r-bcqeeo r-q4m81j r-qvutc0 icon-set ${getColor()}`;
        divOn.innerHTML = iconOn;
        const svg1 = divOn.querySelector("svg");
        svg1.setAttribute("class", `r-4qtqp9 r-yyyyoo r-1q142lx r-dnmrzs r-bnwqim r-1plcrui r-lrvibr ${getColor()}`);
        const divOff = document.createElement("div");
        divOff.className = `css-901oao r-1awozwy r-6koalj r-18u37iz r-16y2uox r-1qd0xha r-a023e6 r-vw2c0b r-1777fci r-eljoum r-dnmrzs r-bcqeeo r-q4m81j r-qvutc0 icon-set ${getColor()}`;
        divOff.innerHTML = iconOff;
        const svg2 = divOff.querySelector("svg");
        svg2.setAttribute("class", `r-4qtqp9 r-yyyyoo r-1q142lx r-dnmrzs r-bnwqim r-1plcrui r-lrvibr ${getColor()}`);
        // on or off
        if (getToggle()) divOff.classList.add("toggle-off-set");
        else divOn.classList.add("toggle-off-set");
        // append
        panel.appendChild(div1);
        div1.appendChild(div2);
        div2.appendChild(divOn);
        div2.appendChild(divOff);
    }

    function sortToggle() {
        // sometimes, there's a empty div block the toggle bar.
        const panel = document.querySelector(".r-1awozwy.r-1h3ijdo.r-1777fci");
        if (!panel) return;
        const lastChild = panel.lastElementChild;
        if (lastChild.childElementCount === 0) lastChild.remove();
    }

    function onClick(on, off) {
        const afterClick = !getToggle();
        GM_setValue("toggle", afterClick);
        if (afterClick) {
            on.classList.remove("toggle-off-set");
            off.classList.add("toggle-off-set");
        } else {
            on.classList.add("toggle-off-set");
            off.classList.remove("toggle-off-set");
        }
        init(3);
    }

    function getColor() {
        let finalColor = "";
        document.querySelectorAll("svg.r-50lct3").forEach(svg => {
            if (!!finalColor) return;
            const svgClass = svg.className.baseVal;
            for (const color of colors) {
                if (svgClass.includes(color)) {
                    finalColor = color;
                }
            }
        });
        return finalColor;
    }

    function getToggle() {
        return GM_getValue("toggle", true);
    }

    // hide
    function findImage() {
        // toggle
        if (!getToggle()) return;
        // all images
        document.querySelectorAll(".r-4gszlv:not(.check-set)").forEach(function(image) {
            image.classList.add("check-set");
            // except emoji
            if (image.style.backgroundImage.includes("svg")) return;
            if (!image.className.includes("hide-set")) image.classList.add("hide-set");
            image.classList.remove("show-set");
            // event
            const touch = image.parentElement.querySelector("img");
            touch.addEventListener("mouseenter", imageListener);
            touch.addEventListener("mouseleave", imageListener);
        });
    }

    function removeBlock() {
        // remove the div block on every avatar.
        document.querySelectorAll(".r-1twgtwe").forEach(block => block.remove());
    }

    function imageListener() {
        const image = this.parentElement.querySelector("div");
        const isHiding = !image.className.includes("show-set");
        if (isHiding) image.classList.add("show-set");
        else image.classList.remove("show-set");
    }

    // show
    function showImage() {
        // toggle
        if (getToggle()) return;
        // all images
        document.querySelectorAll(".check-set").forEach(function(image) {
            image.classList.remove("check-set");
            // except emoji
            if (image.style.backgroundImage.includes("svg")) return;
            image.classList.add("show-set");
            // event
            const touch = image.parentElement.querySelector("img");
            touch.removeEventListener("mouseenter", imageListener);
            touch.removeEventListener("mouseleave", imageListener);
        });
    }

    // other
    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.querySelector("head").appendChild(style);
    }

    function update() {
        if (updating) return;
        updating = true;
        init(3);
        setTimeout(() => { updating = false; }, 1000);
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
