// ==UserScript==
// @name         matters文章-IPFS連結生成器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       catding
// @match        https://matters.news/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423511/matters%E6%96%87%E7%AB%A0-IPFS%E9%80%A3%E7%B5%90%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/423511/matters%E6%96%87%E7%AB%A0-IPFS%E9%80%A3%E7%B5%90%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let data = __NEXT_DATA__['props']['apolloState']['data'];
    for(let key in data){
        if(data[key]['dataHash']){
            var dataHash = data[key]['dataHash']
        }
    }
    var a = document.createElement("a");
    a.href = `https://ipfs.io/ipfs/${dataHash}`;
    a.textContent = "點我在IPFS觀看";
    a.style = "color:blue;"
    a.target = '_tab';
    document.querySelector("section.title").appendChild(a);
})();