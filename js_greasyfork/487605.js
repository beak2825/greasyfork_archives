// ==UserScript==
// @name         THBWiki跳过简单对话
// @namespace    https://thdog.moe/
// @version      0.1.0
// @description  为方便校对翻译，直接转到中日对照页面
// @author       shirokurakana
// @match        https://thwiki.cc/*
// @run-at     document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487605/THBWiki%E8%B7%B3%E8%BF%87%E7%AE%80%E5%8D%95%E5%AF%B9%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/487605/THBWiki%E8%B7%B3%E8%BF%87%E7%AE%80%E5%8D%95%E5%AF%B9%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = decodeURI(document.location.toString());
    var m = null;
    var wikipath = null;
    // https://thwiki.cc/游戏对话:东方兽王园/博丽灵梦
    if( (m = url.match(/^https?:\/\/(?:.*?)thwiki\.cc\/(.+)\??.*$/i)) ) {
        wikipath = m[1];
        if(wikipath.match(/^游戏对话:/)){
            if(wikipath.match(/中日对照/)){
               return;
            }
            document.location = "https://thwiki.cc/"+wikipath+"/中日对照";
        }
    }
    //if( (m = url.match(/^https?:\/\/(?:.*?)thwiki\.cc\/index.php\?title=(.+)&.*?$/i)) ) {
        //wikipath = m[1];
    //}
})();