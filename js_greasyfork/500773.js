// ==UserScript==
// @name         斗鱼直播间有些右下角游戏广告
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  广告关闭 启用脚本后F5刷新页面 出现脚本红点代表生效
// @author       You
// @match        https://www.douyu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500773/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E6%9C%89%E4%BA%9B%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%B8%B8%E6%88%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/500773/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E6%9C%89%E4%BA%9B%E5%8F%B3%E4%B8%8B%E8%A7%92%E6%B8%B8%E6%88%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
        if(document.getElementsByClassName("IconCardAdCard  IconCardAdCardBigNew")){
        document.getElementsByClassName("IconCardAdCard  IconCardAdCardBigNew")[0].remove()
        }
    },5000)
    console.log("douyu ad del success")
})();