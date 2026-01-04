// ==UserScript==
// @name        ThGrab
// @version     0.1.8
// @description Grab contents from thothub network (private)
// @author      Fredddy
// @icon        https://thothub.mx/favicon.ico
// @include     *://thothub.*/*/*
// @require     https://code.jquery.com/jquery-latest.min.js
// @require     https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.umd.js
// @resource    fancyboxCSS https://cdn.jsdelivr.net/npm/@fancyapps/ui@5.0/dist/fancybox/fancybox.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @license     GPLv3
// @namespace https://greasyfork.org/users/1379128
// @downloadURL https://update.greasyfork.org/scripts/512841/ThGrab.user.js
// @updateURL https://update.greasyfork.org/scripts/512841/ThGrab.meta.js
// ==/UserScript==

(() => {
    "use strict";
    GM_addStyle(GM_getResourceText("fancyboxCSS"));
    $(document).ready(function () {
        if (/^https:\/\/thothub\..*\/albums\/\d+\/.*$/.test(document.baseURI)) {
            var privateAcess;

            Fancybox.bind('[data-fancybox="gallery"]', {
                compact: false,
                contentClick: "iterateZoom",
                Images: {
                    Panzoom: {
                        maxScale: 3,
                    },
                },
                Toolbar: {
                    display: {
                        left: [
                            "infobar",
                            "download"
                        ],
                        right: [
                            "iterateZoom",
                            "close",
                        ],
                    }
                }
            });

            getAlbum();
            console.info(`[ThGrab] Enable bypass THGB`);
        }

        function getAlbum() {
            let imgs;

            if (!$(".images .message").length) {
                privateAcess = false;
                imgs = $(".images a img");
                console.info(`[ThGrab] Fetch ${imgs.length} pics from public album`);
            } else {
                privateAcess = true;
                imgs = $(".images .item.private img");
                $(".images .message").remove();
                console.info(`[ThGrab] Fetch ${imgs.length} pics from private album`);
            }

            document.title = `${document.title.split("-")[0]} • (${privateAcess ? 'Bypass' : 'Public'})`;
            $(".headline").html(`<div id="album-title" style="
                width: 50%;
                margin: 0 auto;
                text-align: center;">
                <h2>${document.title}</h2>
            </div>`);

            if (imgs.length >= 1) {
                const loadPromises = [];

                imgs.each(function (index) {
                    let img = $(this);
                    loadPromises.push(new Promise((resolve) => {
                        img.on("load", function () {
                            if (!img.attr("src").includes("sources/")) {
                                let src = img
                                    .attr("src")
                                    .replace("main/", "")
                                    .replace(/\d+x\d+\//, "sources/");
                                img.attr("src", src);
                                img.attr("title", `${document.title} - ${index + 1}`);
                                img.attr("data-fancybox", "gallery");
                                img.attr("data-caption", `${document.title} - #${index + 1}`);
                                img.css("cursor", "pointer");
                            }
                            resolve();
                        });
                    }));
                });

                Promise.all(loadPromises).then(() => {
                    if (!privateAcess) {
                        const callback = function (mutationsList, observer) {
                            mutationsList.forEach(mutation => {
                                if (mutation.type === 'childList') {
                                    mutation.addedNodes.forEach(node => {
                                        if (node.classList && node.classList.contains('fancybox-close')) {
                                            node.click();
                                            console.info(`[ThGrab] Close default UI`);
                                        }
                                    });
                                }
                            });
                        };

                        const observer = new MutationObserver(callback);

                        observer.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                    }
                });
            }
        }
    });
})();
