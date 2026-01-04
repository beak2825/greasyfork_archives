// ==UserScript==
// @name         2022 reddit.com/r/place template
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Template for 2022 version of r/place
// @author       qwcan
// @match        https://hot-potato.reddit.com/embed*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442577/2022%20redditcomrplace%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/442577/2022%20redditcomrplace%20template.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    'use strict';



    let src = "https://cdn.mirai.gg/tmp/dotted-place-template.png";




    if (window.top !== window.self) {


        window.addEventListener('load', () => {
            console.log("/r/place template starting...");
            let canv;
            let cam;
            let emb;

            canv = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0];
            cam = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-camera")[0];
            emb = document.getElementsByTagName("mona-lisa-embed")[0];

            function toHtml(str) {
                var htmlObject = document.createElement('div');
                htmlObject.innerHTML = str;
                return htmlObject.firstChild;
            }
            const params = (location.search||"?").substr(1).split("&").map(x => x.split("=").map(a => unescape(a))).reduce((o,[k,v]) => Object.assign(o, {[k]: v}), {});
            var img = document.createElement("img");
            img.src = src;
            img.className = "place-canvas";
            Object.assign(img.style, {
                transform: `translate(${params.ox - 0.5}px,${params.oy - 0.5}px)`,
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                zIndex: 50,
                opacity: 1.0,
                imageRendering: "pixelated"
            });

            img.style.width=`${img.width/3}px`;
            img.style.height=`${img.height/3}px`;
            const v = canv;
            if(!v) {
                console.log("Uh oh.");
                return;
            }
            v.shadowRoot.children[0].appendChild(img);
            const cb = emb.shadowRoot.children[0].getElementsByTagName('mona-lisa-status-pill')[0];
            const c2 = toHtml(`<button style="pointer-events:auto" id="place-template-button" class="place-camera-button" style="display:inline-block; top:110px; background-image:inherit">Toggle template</button>`);
            cb.parentNode.insertBefore(c2, cb);
            let active = 1;
            c2.addEventListener("click", () => {
                if (active == 1) {
                    active = 0;
                    img.style.visibility = "hidden";
                } else if (active == 0) {
                    active = 1;
                    img.style.visibility = "inherit";
                    img.style.opacity = 1.0;
                }
            });

            // Add a style to put a hole in the pixel preview (to see the current or desired color)
            const waitForPreview = setInterval(() => {
                const preview = cam.querySelector("mona-lisa-pixel-preview");
                if (preview) {
                    clearInterval(waitForPreview);
                    const style = document.createElement('style')
                    style.innerHTML = '.pixel { clip-path: polygon(-20% -20%, -20% 120%, 37% 120%, 37% 37%, 62% 37%, 62% 62%, 37% 62%, 37% 120%, 120% 120%, 120% -20%); }'
                    preview.shadowRoot.appendChild(style);
                }
            }, 100);

            console.log("/r/place template added");

        });

    }
})();