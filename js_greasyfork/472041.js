// ==UserScript==
// @name         NGA自动展开折叠 collapse auto open
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动展开折叠，怕眼瞎的时候别开
// @author       Ai
// @match		*://ngabbs.com/*
// @match		*://*.ngacn.cc/*
// @match		*://ngacn.cc/*
// @match		*://bbs.nga.cn/*
// @match		*://g.nga.cn/*
// @match       *://nga.178.com/*
// @match       *://*.nga.178.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472041/NGA%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%8A%98%E5%8F%A0%20collapse%20auto%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/472041/NGA%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%8A%98%E5%8F%A0%20collapse%20auto%20open.meta.js
// ==/UserScript==

var pageURLCheckTimer = setInterval (
    function () {
        if (this.lastPathStr !== location.pathname
            || this.lastQueryStr !== location.search
            || this.lastPathStr === null
            || this.lastQueryStr === null
           ) {
            this.lastPathStr = location.pathname;
            this.lastQueryStr = location.search;
            setTimeout(main,500);
        }
    }
    , 100
);

function main () {
    var btn=document.getElementsByClassName('collapse_btn');
    Array.prototype.filter.call(
        btn,
        function (btn) {
            btn.getElementsByTagName("button")[0].click();
        },
    );
}