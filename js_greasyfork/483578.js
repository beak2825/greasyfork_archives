// ==UserScript==
// @name         Image Grabber
// @namespace    https://fxzfun.com/userscripts
// @version      1.0.0
// @description  grab images from pages that you can't right click on images
// @author       FXZFun
// @match        *://*/*
// @icon         https://fxzfun.com/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483578/Image%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/483578/Image%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let elements;
    let overlay;
    let dialog;

    window.addEventListener('keypress', function(e){
        if (e.shiftKey && e.keyCode == 126) {
            startGrabber();
        }
    }, false);

    function isPointInBBox(x, y, bbox) {
        return ((x > bbox.left) &&
                (x < bbox.right) &&
                (y > bbox.top) &&
                (y < bbox.bottom))
    }

    function startGrabber() {
        GM_addStyle(`
            .fxzfun-ig-highlight { border: 1px solid darkred; }
            .fxzfun-ig-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 1000;}

            dialog {
                width: 500px;
                margin: auto;
                border: none;
                border-radius: 12px;
                box-shadow: 0 0 5px #21212121;
                background-color: #fafafa;
                font-family: monospace, 'Roboto', 'Lato', 'Open Sans', sans-serif;
                outline: none;
            }

            dialog::backdrop { background: rgba(0, 0, 0, 0.2); }

            p.title {
                text-transform: uppercase;
                margin-top: 0;
                color: #757575;
            }

            .fxzfun-ig-gallery {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
            }

            .fxzfun-ig-gallery::empty {
                content: "No images found";
            }

            .fxzfun-ig-gallery img {
                width: 120px;
                height: 120px;
                border-radius: 6px;
            }

            .fxzfun-ig-gallery-item {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                gap: 20px;
                width: 100%;
                font-size: 1.2em;
                align-items: center;
            }

            .fxzfun-ig-gallery-item p {
                overflow: hidden;
                width: 300px;
                text-overflow: ellipsis;
                text-wrap: nowrap;
            }

            .fxzfun-ig-gallery-item div {
                flex-basis: 50%;
            }

            .fxzfun-ig-actions a {
                color: #757575;
                text-decoration: none;
                font-size: 16px;
                text-transform: uppercase;
            }

            .fxzfun-ig-actions a:hover {
                color: #bdbdbd;
            }
        `);

        overlay = document.createElement("div");
        overlay.classList.add("fxzfun-ig-overlay");
        document.body.appendChild(overlay);

        elements = new Set();

        document.body.addEventListener("mousemove", mouseMoveListener);

        overlay.addEventListener("click", e => {
            let images = new Set();
            elements.forEach(el => {
                let style = (el.currentStyle || window.getComputedStyle(el, false));
                if (el.tagName === "IMG") images.add(el.src);
                if (el.tagName === "SVG") images.add(URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(el)], { type: 'image/svg+xml' })));
                if (style.backgroundImage.startsWith('data:image') || style.background.startsWith('data:image')) images.add(style.background);

                let backgroundImageMatches = style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                if (backgroundImageMatches?.length > 1) images.add(backgroundImageMatches?.[1]);

                let backgroundMatches = style.backgroundImage.match(/url\(["']?(.*?)["']?\)/);
                if (backgroundMatches?.length > 1) images.add(backgroundMatches?.[1]);
            });
            showDialog(images);
        });
    }

    function mouseMoveListener(e) {
        document.querySelectorAll('*').forEach(node => {
            if (isPointInBBox(e.x, e.y, node.getBoundingClientRect())) {
                if (!node.classList.contains("fxzfun-ig-highlight") && !node.classList.contains("fxzfun-ig-overlay")) {
                    node.classList.add("fxzfun-ig-highlight");
                    elements.add(node);
                }
            } else {
                node.classList.remove("fxzfun-ig-highlight");
                elements.delete(node);
            }
        });
    }

    function showDialog(images) {
        dialog = dialog ?? document.createElement("dialog");
        let imageLinks = Array.from(images);
        dialog.innerHTML = `
        <p class="title">[/] Image Grabber</p>
        <div class="fxzfun-ig-gallery">
            ${imageLinks.map((url, index) => !!url && `
                <div class="fxzfun-ig-gallery-item" id="item${index}">
                    <img src="${url}" />
                    <div>
                        <p>${url.split("/").at(-1)}</p>
                        <p class="fxzfun-ig-actions">
                            <a href="${url}" target="_blank">Open ${NEW_TAB_ICON}</a>
                            <a href="${url}" target="_blank" download="${url.split("/").at(-1)}">Download ${DOWNLOAD_ICON}</a>
                        </p>
                    </div>
                </div>
            `).join('')}
        </div>`;
        document.body.appendChild(dialog);
        dialog.showModal();

        dialog.addEventListener('click', (e) => e.target.isEqualNode(dialog) && dialog.close());

        overlay.remove();
        document.querySelectorAll(".fxzfun-ig-highlight").forEach(el => el.classList.remove("fxzfun-ig-highlight"));
        document.querySelectorAll(".fxzfun-ig-copyLink").forEach(el => el);
        document.body.removeEventListener("mousemove", mouseMoveListener);
    }

    const NEW_TAB_ICON = `<svg width="16" height="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M17 17H3V3h5V1H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5h-2z"/><path fill="currentColor" d="m11 1l3.3 3.3L8.6 10l1.4 1.4l5.7-5.7L19 9V1z"/></svg>`;
    const DOWNLOAD_ICON = `<svg width="16" height="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M17 12v5H3v-5H1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5z"/><path fill="currentColor" d="M15 9h-4V1H9v8H5l5 6z"/></svg>`;
    const COPY_ICON = `<svg width="16" height="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M17 3H9v2H7V3c0-1.1.895-2 2-2h8c1.1 0 2 .895 2 2v8c0 1.1-.895 2-2 2h-2v-2h2z"/><path fill="currentColor" d="M3 9v8h8V9zm8-2c1.1 0 2 .895 2 2v8c0 1.1-.895 2-2 2H3c-1.1 0-2-.895-2-2V9c0-1.1.895-2 2-2z"/></svg>`;
})();
