// ==UserScript==
// @name                Twitter: Zoom In Image
// @name:zh-TW          Twitter 放大圖片
// @name:zh-CN          Twitter 放大图像
// @name:ja             Twitter 画像を拡大
// @name:ko             Twitter 이미지 확대
// @name:ru             Twitter Увеличить изображение
// @version             1.2.5
// @description         Zoom in the image which is under the cursor.
// @description:zh-TW   放大滑鼠游標下的圖片。
// @description:zh-CN   放大滑鼠光标下的图像。
// @description:ja      カーソルの下にある画像を拡大します。
// @description:ko      커서 아래에있는 이미지를 확대합니다.
// @description:ru      Увеличьте изображение под курсором.
// @author              Hayao-Gai
// @namespace           https://github.com/HayaoGai
// @icon                https://i.imgur.com/M9oO8K9.png
// @match               https://twitter.com/*
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/382243/Twitter%3A%20Zoom%20In%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/382243/Twitter%3A%20Zoom%20In%20Image.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const svgLoading = `<svg width="100%" height="100%" viewBox="0 0 32 32"><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="opacity: 0.2;"></circle><circle cx="16" cy="16" fill="none" r="14" stroke-width="4" style="stroke-dasharray: 80; stroke-dashoffset: 60;"></circle></svg>`;
    const textStyle = `
.zoomin-loading {
    position: fixed;
    width: 26px;
    height: 26px;
    display: none;
}
.zoomin-loading-show {
    display: flex !important;
}
.zoomin-canvas {
    border-radius: 8px;
    position: fixed;
    background-color: #e0e0e0;
    pointer-events: none;
    opacity: 0;
}
.zoomin-canvas-show {
    transition: opacity 0.4s;
    opacity: 1 !important;
}
.zoomin-zoom {
    border-radius: 8px;
    position: fixed;
    pointer-events: none;
    opacity: 0;
}
.zoomin-zoom-show {
    transition: opacity 0.4s;
    opacity: 1 !important;
}`;
    let currentUrl = document.location.href;
    let updating = false, showing = false;
    let loading, canvas, zoom, currentImage;

    css();

    init(10);

    locationChange();

    window.addEventListener("scroll", update);

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(removeBlock, 500 * i);
            setTimeout(createLoading, 500 * i);
            setTimeout(createCanvas, 500 * i);
            setTimeout(createZoom, 500 * i);
            setTimeout(eventListener, 500 * i);
            setTimeout(sensitiveContent, 500 * i);
        }
    }

    // create
    function removeBlock() {
        // remove the div block on every avatar.
        document.querySelectorAll(".r-1twgtwe").forEach(block => block.remove());
    }

    function removeLoading() {
        if (!loading) return;
        loading.remove();
        loading = null;
    }

    function createLoading() {
        // check svg
        if (!getColor()) return;
        // check exist
        if (!!loading) return;
        // create
        loading = document.createElement("div");
        loading.className = "zoomin-loading css-1dbjc4n r-17bb2tj r-1muvv40 r-127358a r-1ldzwu0";
        loading.innerHTML = svgLoading;
        loading.querySelectorAll("circle").forEach(circle => { circle.style.stroke = getColor(); });
        document.body.appendChild(loading);
    }

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
        if (!!zoom) return;
        // create
        zoom = document.createElement("img");
        zoom.classList.add("zoomin-zoom");
        document.body.appendChild(zoom);
    }

    // event
    function eventListener() {
        // situation 1: disable if you go into the image page.
        if (currentUrl.includes("photo/1")) return;
        // situation 2: return if loading, canvas or zoom doesn't exist.
        if (!loading || !canvas || !zoom) return;
        // add thumbnail mouse event.
        document.querySelectorAll(".r-4gszlv:not(zoomin-listener)").forEach(thumbnail => {
            thumbnail.classList.add("zoomin-listener");
            // return if the video thumbnail is exist.
            if (!thumbnail.closest(".r-1777fci") || (thumbnail.closest(".r-1777fci") && !thumbnail.closest(".r-1777fci").querySelector("[data-testid='playButton']"))) {
                const image = thumbnail.parentElement.querySelector("img");
                image.addEventListener("mousemove", showImage);
                image.addEventListener("mouseleave", hideImage);
            }
        });
    }

    function sensitiveContent() {
        document.querySelectorAll(".r-42olwf.r-1vsu8ta:not(.zoomin-view)").forEach(view => {
            view.classList.add("zoomin-view");
            view.addEventListener("click", () => init(3));
        });
    }

    function showImage() {
        // avoid calling this function multiple times.
        if (showing) return;
        showing = true;
        currentImage = this;
        // get image original size url.
        const origin = getOrigin(currentImage.src);
        if (!origin) return;
        zoom.setAttribute("src", origin);
        // show loading icon.
        loading.style.left = getLeft();
        loading.style.top = getTop();
        loading.classList.add("zoomin-loading-show");
        // detail
        zoomDetail();
    }

    function hideImage() {
        showing = false;
        loading.classList.remove("zoomin-loading-show");
        canvas.classList.remove("zoomin-canvas-show");
        zoom.classList.remove("zoomin-zoom-show");
        zoom.removeAttribute("src");
    }

    function zoomDetail() {
        // wait until get the image size.
        if (!zoom.naturalWidth)
        {
            setTimeout(zoomDetail, 100);
            return;
        }
        // hide loading icon.
        loading.classList.remove("zoomin-loading-show");
        // fit zoom original size for browser.
        const w = zoom.naturalWidth;
        const h = zoom.naturalHeight;
        const clientW = document.documentElement.clientWidth;
        const clientH = document.documentElement.clientHeight;
        const situation1 = w > clientW;
        const situation2 = h > clientH;
        if (situation1 && situation2) {
            const rate = clientH / h;
            const new_w = w * rate;
            const new_h = clientH;
            if (new_w > clientW) {
                const rate2 = clientW / new_w;
                const new_w2 = clientW;
                const new_h2 = new_h * rate2;
                setSize(canvas, new_w2, new_h2);
                setSize(zoom, new_w2 - 10, new_h2 - 10);
            } else {
                setSize(canvas, new_w, new_h);
                setSize(zoom, new_w - 10, new_h - 10);
            }
        } else if (situation1) {
            const rate3 = clientW / w;
            const new_h3 = h * rate3;
            setSize(canvas, clientW, new_h3);
            setSize(zoom, clientW - 10, new_h3 - 10);
        } else if (situation2) {
            const rate4 = clientH / h;
            const new_w4 = w * rate4;
            setSize(canvas, new_w4, clientH);
            setSize(zoom, new_w4 - 10, clientH - 10);
        } else {
            setSize(canvas, w + 10, h + 10);
            setSize(zoom, w, h);
        }
        // position
        const cWidth = parseInt(canvas.style.width);
        const cHeight = parseInt(canvas.style.height);
        const zWidth = parseInt(zoom.style.width);
        const zHeight = parseInt(zoom.style.height);
        let cLeft = clientW / 2 - cWidth / 2;
        let cTop = clientH / 2 - cHeight / 2;
        if (cLeft < 0) cLeft = 0;
        if (cTop < 0) cTop = 0;
        let zLeft = clientW / 2 - zWidth / 2;
        let zTop = clientH / 2 - zHeight / 2;
        if (zLeft < 0) zLeft = 0;
        if (zTop < 0) zTop = 0;
        canvas.classList.add("zoomin-canvas-show");
        canvas.style.left = `${cLeft}px`;
        canvas.style.top = `${cTop}px`;
        zoom.classList.add("zoomin-zoom-show");
        zoom.style.left = `${zLeft}px`;
        zoom.style.top = `${zTop}px`;
    }

    // method
    function getColor() {
        let color = "";
        document.querySelectorAll("svg.r-50lct3").forEach(svg => {
            if (!!color) return;
            color = getComputedStyle(svg).color;
        });
        return color;
    }

    function getOrigin(url) {
        // situation 1: post
        if (url.includes("media") || url.includes("card")) {
            const search = url.split("&name=");
            const last = search[search.length - 1];
            return url.replace(last, "orig");
        }
        // situation 2: banner
        else if (url.includes("banner")) {
            const search = url.split("/");
            const last = search[search.length - 1];
            return url.replace(last, "1500x500");
        }
        // situation 3: avatar
        else if (url.includes("profile")) {
            const search1 = url.split("_");
            const search2 = url.split(".");
            const last1 = search1[search1.length - 1];
            const last2 = search2[search2.length - 1];
            return url.replace(`_${last1}`, `.${last2}`);
        }
        // situation 3: video
        else {
            return null;
        }
    }

    function getLeft() {
        return `${document.documentElement.clientWidth / 2 - 13}px`;
    }

    function getTop() {
        return `${document.documentElement.clientHeight / 2 - 13}px`;
    }

    function setSize(element, width, height) {
        element.style.width = `${width}px`;
        element.style.height = `${height}px`;
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
                    hideImage();
                    removeLoading();
                    init(10);
                }
            });
        });
        const target = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();
