// ==UserScript==
// @name         琉璃神社老司机
// @namespace    https://greasyfork.org/users/8650
// @version      1.0.1
// @description  Don't panic.
// @author       圆环之理
// @match      *://hacg.*/*
// @match      *://*.hacg.*/*
// @match      *://*.llss.*/*
// @match      *://*.llss.fun/*
// @match      *://*.liuli.*/*
// @icon         https://www.llss.me/favicon.ico
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446317/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E8%80%81%E5%8F%B8%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/446317/%E7%90%89%E7%92%83%E7%A5%9E%E7%A4%BE%E8%80%81%E5%8F%B8%E6%9C%BA.meta.js
// ==/UserScript==



(function(){
    'use strict';

    // Force HTTPS
    if(self.location.protocol == "http:") self.location.replace(self.location.href.replace(/^http/, "https"));

    let oldDriver = document.querySelector('.entry-content');
    let childDriver = oldDriver.childNodes;
    let takeMe;
    let fuel;
    let i;
    let j;
    for(i = childDriver.length - 1; i >= 0; --i) {
        if(takeMe = childDriver[i].textContent.match(/([a-z0-9]{40})|(\w{32})|(([a-z0-9]{8,39})( ?)[\u4e00-\u9fa5 ]{2,}( ?)+([a-z0-9]{2,31})\b)/ig)){
            for(j = 0;j < takeMe.length; ++j) {
                fuel = '<a href="magnet:?xt=urn:btih:' +
                    ( takeMe[j].length >= 40 ? takeMe[j].toString().replace(/(\s|[\u4e00-\u9fa5])+/g, '').trim() : takeMe[j] ) +
                    '">老司机链接</a>';
                // console.log(takeMe[j], '<a href="magnet:?xt=urn:btih:' + fuel);
                childDriver[i].innerHTML = childDriver[i].innerHTML.toString().replace(takeMe[j], fuel);
            }}
}})();