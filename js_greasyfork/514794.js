// ==UserScript==
// @name         好医生手机版10倍速刷课
// @version      1.0
// @description  好医生10倍速刷课 （继续医学教育培训）
// @author       kylanuta
// @match        *://tjws.cmechina.net/phone/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1388423
// @downloadURL https://update.greasyfork.org/scripts/514794/%E5%A5%BD%E5%8C%BB%E7%94%9F%E6%89%8B%E6%9C%BA%E7%89%8810%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/514794/%E5%A5%BD%E5%8C%BB%E7%94%9F%E6%89%8B%E6%9C%BA%E7%89%8810%E5%80%8D%E9%80%9F%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hook() {
        const head = document.querySelectorAll("head:not([data-jqhooked])")?.[0];
        if (head) {
            console.log("head hooked!");
            head.dataset.jqhooked = true;
            const oo = head.insertBefore;
            head.insertBefore = (a,b) => {
                a.src = a.src.replace(/play_speed=\d+/, "play_speed=1")
                return oo.apply(head, [a,b]);
            }
        }

        document.querySelectorAll('video').forEach((vid) => {
            vid.muted = true;
            vid.playbackRate = 10;
        });
    }

    setInterval(hook, 500);
})();