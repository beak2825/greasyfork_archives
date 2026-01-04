
// ==UserScript==
// @name         jy-nba
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  自动使用战术经验
// @author       haiger
// @match        *://hupu.cdn.ttnba.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414013/jy-nba.user.js
// @updateURL https://update.greasyfork.org/scripts/414013/jy-nba.meta.js
// ==/UserScript==

(function() {
    'use strict';
let zsTimer = setInterval(() => {
    let useIndex = 1 // 想要使用第几个的战术经验
    let wantRest = 0 // 使用到剩下多少的时候停下，要全用完写0即可
    let rest = parseInt(document.getElementsByClassName("label_cont ng-binding")[useIndex - 1].innerHTML.slice(1));
    if (rest <= wantRest) {
        clearInterval(zsTimer)
    } else {
        let btn = document.getElementsByClassName("sub_btn on")[useIndex - 1];
        angular.element(btn).triggerHandler('click');
    }
}, 100);
})();