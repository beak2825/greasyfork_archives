// ==UserScript==
// @name         remove-b-tail
// @namespace    https://github.com/xuqifzz/remove-b-tail
// @version      0.1
// @description  去掉B站专栏复制的小尾巴
// @author       You
// @match        https://www.bilibili.com/read/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/464885/remove-b-tail.user.js
// @updateURL https://update.greasyfork.org/scripts/464885/remove-b-tail.meta.js
// ==/UserScript==

(function() {
    'use strict';

    HTMLDivElement.prototype.realAddEventListener = HTMLAnchorElement.prototype.addEventListener;
    HTMLDivElement.prototype.addEventListener = function(a,b,c){
        if(a =="copy") return;
        return this.realAddEventListener(a,b,c);
    };
})();