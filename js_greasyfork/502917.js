// ==UserScript==
// @name         Enlarge Youtube Profile Images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Control size of profile images in the Youtube comment section.
// @match        https://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502917/Enlarge%20Youtube%20Profile%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/502917/Enlarge%20Youtube%20Profile%20Images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurable variables (replace popup settings)
    const config = {
        size: 60,
        square: true,
        noHover: false,
        sizeAlt: 60,
        squareAlt: true,
        noHoverAlt: false
    };

    // Main functionality
    function initMain() {
        window.addEventListener("contextmenu", e => {
            if (e.target?.tagName === "IMG") {
                if (e.target.closest("#author-thumbnail")) {
                    window.open(e.target.src.split("=")[0], "_blank")
                    e.stopImmediatePropagation()
                    e.preventDefault()
                }
            }
        });

        const desc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
        Object.defineProperty(HTMLImageElement.prototype, "src", {
            configurable: true,
            enumerable: true,
            get: desc.get,
            set: function(value) {
                let isShorts = this.closest('ytd-engagement-panel-section-list-renderer');
                if (value.includes("https://yt3.ggpht.com") && this.closest("#author-thumbnail")) {
                    return desc.set.call(this, value.replace(/\=s\d+/, `=s${isShorts ? config.sizeAlt : config.size}`));
                }
                return desc.set.call(this, value);
            }
        });

        let s = document.createElement("style");
        s.innerHTML = `
            #primary ytd-comment-view-model #author-thumbnail yt-img-shadow ${getBase(config.size, config.square)};
            ytd-shorts ytd-comment-view-model #author-thumbnail yt-img-shadow ${getBase(config.sizeAlt, config.squareAlt)};
        `;
        document.documentElement.appendChild(s);
    }

    function getBase(size, square) {
        return `{ height: ${size}px !important; width: ${size}px !important; border-radius: ${square ? "0px" : "50%"} !important; }`;
    }

    // Hover functionality
    let activeRect;
    let wrapper;

    function initHover() {
        if (!config.noHover || !config.noHoverAlt) {
            window.addEventListener("mouseover", handleMouseOver, {
                capture: true,
                passive: true
            });
            window.addEventListener("mouseout", handleMouseOut, {
                capture: true,
                passive: true
            });
            window.addEventListener("scroll", handleScroll, {
                passive: true,
                capture: true
            });
        }
    }

    function show(src, rect) {
        if (!wrapper) {
            wrapper = document.createElement("img");
            wrapper.id = "eypi";
            wrapper.addEventListener("load", handleLoad);
            const s = document.createElement("style");
            s.textContent = `#eypi {position: fixed; left: 0px; top: 0px; width: 0px; height: 0px; pointer-events: none; z-index: 999999999;}`;
            document.head.appendChild(s);
        }
        wrapper.remove();
        activeRect = rect;
        wrapper.src = src.split("=")[0];
    }

    function handleLoad(e) {
        if (!activeRect || !(wrapper?.naturalWidth)) return;
        let x = activeRect.x + activeRect.width + 20;
        let y = activeRect.y + 20;
        let width = wrapper.naturalWidth;
        let height = wrapper.naturalHeight;
        let ratio = width / height;
        if (height > (window.innerHeight - 80)) {
            y = 40;
            height = window.innerHeight - 80;
            width = height * ratio;
        }
        const maxWidth = (window.innerWidth - x - 40);
        if (width > maxWidth) {
            width = maxWidth;
            height = width / ratio;
        }
        const floorX = x;
        const floorY = 40;
        const ceilX = window.innerWidth - width - 40;
        const ceilY = window.innerHeight - height - 40;
        x = Math.min(Math.max(floorX, x), ceilX);
        y = Math.min(Math.max(floorY, y), ceilY);
        wrapper.style.left = `${x}px`;
        wrapper.style.top = `${y}px`;
        wrapper.style.width = `${width}px`;
        wrapper.style.height = `${height}px`;
        document.body.appendChild(wrapper);
    }

    function handleScroll(e) {
        activeRect && remove();
    }

    function remove() {
        wrapper.remove();
        wrapper.src = "";
        activeRect = null;
    }

    function handleMouseOver(e) {
        activeRect && remove();
        const img = e.target;
        if (!(img?.tagName === "IMG" && img.src.includes("https://yt3.ggpht.com"))) return;
        if (!(e.target.closest("#author-thumbnail"))) return;
        let isShorts = e.target.closest('ytd-engagement-panel-section-list-renderer');
        if (config.noHoverAlt && isShorts) return;
        if (config.noHover && !isShorts) return;
        e.stopImmediatePropagation();
        show(img.src.split("=")[0], img.getBoundingClientRect());
    }

    function handleMouseOut(e) {
        activeRect && remove();
    }

    // Initialize
    initMain();
    initHover();
})();