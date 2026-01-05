// ==UserScript==
// @name         什么值得买精选页面精简
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Yuxing Sun
// @match        http://www.smzdm.com/jingxuan/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26232/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E7%B2%BE%E9%80%89%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/26232/%E4%BB%80%E4%B9%88%E5%80%BC%E5%BE%97%E4%B9%B0%E7%B2%BE%E9%80%89%E9%A1%B5%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var top = document.getElementsByClassName('J_feed_hot_index');
    if (top.length > 0) {
        top[0].style.display = 'none';
    }
    
    document.getElementById('feed-side').style.display = 'none';
    document.getElementById('feed-main').style.width = '100%';
    
    var feedCountItemCount = 0;
    setInterval(function () {
        var feedContents = document.getElementsByClassName('z-feed-content');
        if (feedCountItemCount != feedContents.length) {
            feedCountItemCount = feedContents.length;
            for(var i = 0; i < feedContents.length; i ++) {
                feedContents[i].style.width = '962px';
            }
        }
    }, 100);
    
    //Your code here...
})();