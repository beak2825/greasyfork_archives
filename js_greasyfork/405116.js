// ==UserScript==
// @name                Discord: Zoom In Small Icon
// @name:zh-TW          Discord 放大小圖示
// @name:zh-CN          Discord 放大小图示
// @name:ja             Discord 小さいアイコンにズームイン
// @name:ko             Discord 작은 아이콘 확대
// @name:ru             Discord Увеличить маленькую иконку
// @version             1.0.1
// @description         Zoom in the image which is under the cursor.
// @description:zh-TW   放大滑鼠游標下的圖片。
// @description:zh-CN   放大滑鼠光标下的图像。
// @description:ja      カーソルの下にある画像を拡大します。
// @description:ko      커서 아래에있는 이미지를 확대합니다.
// @description:ru      Увеличьте изображение под курсором.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/rE9N0R7.png
// @match               https://discord.com/channels/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/405116/Discord%3A%20Zoom%20In%20Small%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/405116/Discord%3A%20Zoom%20In%20Small%20Icon.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const targets = [ "avatar-3FKimL", "avatar-2e8lTP", "emoji" ];
    const textStyle = `
.zoomin-canvas {
    border-radius: 8px;
    position: fixed;
    background-color: #e0e0e0;
    pointer-events: none;
    opacity: 0 !important;
    z-index: 1003;
}
.zoomin-canvas-show {
    transition: opacity 0.4s;
    opacity: 1 !important;
}
.zoomin-zoom {
    position: relative;
    left: 5px;
    top: 5px;
    border-radius: 8px;
    pointer-events: none;
    opacity: 0 !important;
}
.zoomin-zoom-show {
    transition: opacity 0.4s;
    opacity: 1 !important;
}`;
    let currentUrl = document.location.href;
    let updating = false, showing = false;
    let canvas, zoom;

    css();

    init(10);

    locationChange();

    window.addEventListener("scroll", update, true);

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(createCanvas, 500 * i);
            setTimeout(createZoom, 500 * i);
            for (const target of targets) {
                setTimeout(() => eventListener(target), 500 * i);
            }
        }
    }

    // create
    function createCanvas() {
        // check exist
        if (!!canvas) return;
        // create
        canvas = document.createElement("div");
        canvas.classList.add("zoomin-canvas");
        document.body.appendChild(canvas);
    }

    function createZoom() {
        // check exist
        if (!canvas || !!zoom) return;
        // create
        zoom = document.createElement("img");
        zoom.classList.add("zoomin-zoom");
        zoom.style.backgroundColor = getTheme();
        canvas.appendChild(zoom);
    }

    // event
    function eventListener(target) {
        // return if canvas or zoom doesn't exist.
        if (!canvas || !zoom) return;
        // add target mouse event.
        document.querySelectorAll(`.${target}:not(zoomin-listener)`).forEach(t => {
            t.classList.add("zoomin-listener");
            t.addEventListener("mousemove", showImage);
            t.addEventListener("mouseleave", hideImage);
        });
    }

    function showImage() {
        // avoid calling this function multiple times.
        if (showing) return;
        showing = true;
        // detail
        const url = getSource(this);
        if (!url) return;
        zoom.setAttribute("src", url);
        zoomDetail();
    }

    function hideImage() {
        showing = false;
        canvas.classList.remove("zoomin-canvas-show");
        zoom.classList.remove("zoomin-zoom-show");
        setTimeout(() => {
            if (!showing) zoom.removeAttribute("src");
        }, 500);
    }

    function zoomDetail() {
        // wait until get the image size.
        if (!zoom.naturalWidth) {
            setTimeout(zoomDetail, 100);
            return;
        }
        // size
        const w = zoom.naturalWidth;
        const h = zoom.naturalHeight;
        canvas.style.width = `${w + 10}px`;
        canvas.style.height = `${h + 10}px`;
        zoom.style.width = `${w}px`;
        zoom.style.height = `${h}px`;
        // position
        let left = getCursorX();
        let top = getCursorY();
        const clientW = document.documentElement.clientWidth;
        // situation 1: the icon position is too right to show.
        if (left + w > clientW) left = left - w;
        // situation 2: the icon position is too top to show.
        if (top - h - 30 > 0) top = top - h - 30;
        canvas.style.left = `${left}px`;
        canvas.style.top = `${top}px`;
        // class
        canvas.classList.add("zoomin-canvas-show");
        zoom.classList.add("zoomin-zoom-show");
    }

    // method
    function getSource(element) {
        // situation 1: image
        if (!!element.src) return resizeImage(element.src)
        // situation 2: div with style
        else if (!!element.style.backgroundImage) return resizeImage(element.style.backgroundImage.split(/"/)[1])
        // situation 3: div children
        else if (!!element.querySelector("img")) return element.querySelector("img").src;
        // situation 4: not an image
        else return null;
    }

    function getTheme() {
        const theme = document.querySelector("html").className.includes("light") ? "#ffffff" : "#363940";
        return theme;
    }

    function getCursorX() {
        const e = window.event;
        return e.pageX - document.documentElement.scrollLeft - document.body.scrollLeft;
    }

    function getCursorY() {
        const e = window.event;
        return e.pageY - document.documentElement.scrollTop - document.body.scrollTop;
    }

    function resizeImage(url) {
        const index = url.indexOf("?")
        if (index === -1) return url
        return url.replace(url.substring(index), "")
    }

    // others
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
        const target = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();
