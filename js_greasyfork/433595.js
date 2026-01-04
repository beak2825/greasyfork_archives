// ==UserScript==
// @name         Advanced Prev And Next
// @namespace    https://goldenhind.tumblr.com/
// @version      1.1
// @description  Ctrl+Alt+Shift + (LArrow to rel["prev"] || RArrow to rel["next"]) etc...;
// @author       hisaruki
// @match        https://*/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/c/c2/Wikimoji-Next_Track.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433595/Advanced%20Prev%20And%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/433595/Advanced%20Prev%20And%20Next.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window == window.parent){
        const params = new URLSearchParams(window.location.search);
        const root = new URL(document.URL);
        let prev = document.querySelector('[rel="prev"]');
        let next = document.querySelector('[rel="next"]');
        if(prev){
            prev = prev.getAttribute("href");
        }
        if(next){
            next = next.getAttribute("href");
        }
        ["page", "p"].map(p => {
            let v = params.get(p);
            let res = false;
            if(v && isFinite(v)){
                v = v - 0;
                prev = new URL(document.URL);
                next = new URL(document.URL);
                next.searchParams.set(p, v + 1);
                prev.searchParams.set(p, v - 1);
                prev = prev.toString();
                next = next.toString();
                res = true;
            }
            return res;
        });
        if(!next){
            let nextPage = Infinity;
            Array.from(document.querySelectorAll("a")).map(a => {
                let href = new URL(a.getAttribute("href"), document.URL);
                if(href.origin == root.origin){
                    ["page", "p"].map(p => {
                        if(href.searchParams.get(p) && isFinite(href.searchParams.get(p))){
                            p = href.searchParams.get(p) - 0;
                            if(p < nextPage){
                                nextPage = p;
                                next = href.toString();
                            }
                        }
                    });
                }
            });
        }
        console.log(next, prev);

        document.addEventListener('keydown', e => {
            if(e.shiftKey && e.altKey && e.shiftKey){
                if(e.key == "ArrowRight" && next){
                    location.href = next;
                }
                if(e.key == "ArrowLeft" && prev){
                    location.href = prev;
                }
            }
        });
    }
    // Your code here...
})();