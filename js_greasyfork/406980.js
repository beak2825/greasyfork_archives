// ==UserScript==
// @name         V2EX Browser
// @namespace    https://iamazing.cn/
// @version      0.1
// @description  使用左右箭头切换不同 id 的主题
// @author       JustSong
// @match        https://www.v2ex.com/t/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406980/V2EX%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/406980/V2EX%20Browser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getTopicId() {
        let path = window.location.pathname;
        let matched = path.match(/[0-9][0-9]*/);
        let id = matched[0];
        return parseInt(id);
    }

    function gotoTopic(id) {
        if (typeof id === 'number' && id > 0) {
            let path = "/t/" + id;
            window.location.pathname = path;
        }
    }

    window.addEventListener("keydown", function(e) {
        let id = getTopicId();
        if (e.key === "ArrowLeft") {
            id--;
        } else if (e.key === "ArrowRight") {
            id++;
        } else return;
        gotoTopic(id);
    });
})();