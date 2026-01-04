// ==UserScript==
// @name         删除百度右侧推荐内容
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  try to take over the world!
// @author       You
// @match          *://*.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373809/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E5%8F%B3%E4%BE%A7%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/373809/%E5%88%A0%E9%99%A4%E7%99%BE%E5%BA%A6%E5%8F%B3%E4%BE%A7%E6%8E%A8%E8%8D%90%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
      if (location.hostname=="www.baidu.com"){
             var auto = setInterval(function() {
            if (document.getElementById('content_right')){
                document.getElementById('content_right').style.display="none";
            }
            if(document.getElementById('rrecom-container')){
                document.getElementById('rrecom-container').style.display="none";
            }
            if(document.getElementsByClassName("opr-recommends-merge-content")[0]){
                document.getElementsByClassName("opr-recommends-merge-content")[0].style.display="none";

            }
        }, 50);
      }
})();