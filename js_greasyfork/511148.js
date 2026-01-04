// ==UserScript==
// @name         olx otomoto image quality fix
// @version      2024-05-09
// @description  replace image links on olx and otomoto with full quality links
// @license      MIT
// @author       liime
// @match        https://www.otomoto.pl/*
// @match        https://www.olx.pl/*
// @grant        none
// @namespace https://greasyfork.org/users/1375709
// @downloadURL https://update.greasyfork.org/scripts/511148/olx%20otomoto%20image%20quality%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/511148/olx%20otomoto%20image%20quality%20fix.meta.js
// ==/UserScript==
(function(){

    function waitForElm(selector) {
        return new Promise(resolve => {
       /*     if (document.querySelectorAll(selector)) {
                return resolve(document.querySelectorAll(selector));
            }
*/
            const observer = new MutationObserver(mutations => {
                if (document.querySelectorAll(selector)) {
                    //observer.disconnect();
                    resolve(document.querySelectorAll(selector));
                }
            });

            // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    const upsize = function(imgconts) {
        'use strict';
        console.log(imgconts);
        for (let img of imgconts) {
            try {
                let upscaled = img.src.replace(/s\=\d+x\d+/g, "s=0x0");
                let upscaledset = img.srcset.replace(/s\=\d+x\d+/g, "s=0x0");
                if (upscaled != img.src) {
                    img.setAttribute("src", upscaled);
                    console.log(img.src);
                }
                if (upscaledset != img.srcset) {
                    img.setAttribute("srcset", upscaledset);
                    console.log(img.srcset);
                }
                console.log("bullshit");
            } catch (e) {
                console.error(e);
                console.error(img);
            }
        }
    };

    (async function() {
        while (true) {
            let imgcontainers = await waitForElm('.embla__slide img, .swiper-slide img');
            upsize(imgcontainers);
        }
    })()

})()



