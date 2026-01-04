// ==UserScript==
// @name         Github假开源黑名单
// @namespace    https://qinlili.bid
// @version      0.1
// @description  拒绝假开源
// @author       琴梨梨
// @match        https://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/442249/Github%E5%81%87%E5%BC%80%E6%BA%90%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/442249/Github%E5%81%87%E5%BC%80%E6%BA%90%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const blacklist=['/PyJun']
    let username=location.pathname.substr(0,location.pathname.indexOf("/",1));
    if(blacklist.includes(username)){
        if(confirm("你正在访问假开源项目，点击确定继续，点击取消返回")){

        }else{
            history.back();
        }
    }
})();