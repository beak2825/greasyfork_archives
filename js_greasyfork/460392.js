// ==UserScript==
// @name         MS Whiteboard Optimizer
// @namespace    https://i.zapic.moe/
// @version      0.1
// @description  Optimize performance of MS Whiteboard with a lot of content
// @author       KawaiiZapic
// @match        https://whiteboard.office.com/me/whiteboards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=office.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460392/MS%20Whiteboard%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/460392/MS%20Whiteboard%20Optimizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const debounceList = {};
    const debounce = (name,cb, time) => {
        const result = debounceList[name] > 0;
        result && clearTimeout(debounceList[name]);
        debounceList[name] = setTimeout(() => {
            debounceList[name] = -1;
            cb();
        }, time);
        return result;
    }
    const getGrandparent = $ => $.parentElement.parentElement;
    const io = new IntersectionObserver((entries) => {
         entries.forEach((entry) => {
             const grand = getGrandparent(entry.target);
             if (entry.intersectionRatio > 0) {
                 grand.style.visibility = ""
                 grand.style.display = ""
             } else {
                 grand.style.visibility = "hidden"
             }
         });
    });
    setInterval(() => {
        const canvasContent = document.querySelector('#canvasContent');
        if (!canvasContent || canvasContent.__attached) return;
        canvasContent.__attached = true;
        const observerOptions = {
            childList: true,
            attributes: false,
            subtree: false
        }
        const observer = new MutationObserver(() => {
           debounce("mutation", () => {
               canvasContent.querySelectorAll("svg.inkGroup").forEach(v => {
                   if (v.__observerd) return;
                   v.__observerd = true;
                   io.observe(v);
               });
           }, 1000)
        });
        observer.observe(canvasContent, observerOptions);
        const attrObserver = new MutationObserver(() => {
            if (!debounce("attribute", () => {
                console.log("drag end");
                canvasContent.querySelectorAll("svg.inkGroup").forEach(v => {
                    const grand = getGrandparent(v);
                    if (grand.style.visibility == "hidden") {
                        grand.style.display = "none";
                    }
                });
            },1000)) {
                console.log("drag start");
                canvasContent.querySelectorAll("svg.inkGroup").forEach(v => {
                    const grand = getGrandparent(v);
                    if (grand.style.display == "none") {
                        grand.style.visibility = "hidden";
                        grand.style.display = "";
                    }
                });
            }
        });
        const transformComponent = document.querySelector(".transformComponent");
        attrObserver.observe(transformComponent, {
            childList: false,
            attributes: true,
            subtree: false
        });
        console.log("[MWF] MO attached.");
    }, 1000);
})();