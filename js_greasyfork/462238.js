// ==UserScript==
// @name         galgamezz.cc 预览
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  快乐
// @author       wssgyy
// @match        http://www.galgamezz.cc/bbs/viewthread.php?tid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=galgamezz.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462238/galgamezzcc%20%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462238/galgamezzcc%20%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.onload = function(){
        //<img src="" onload="thumbImg(this)" alt="" width="600" height="350" style="cursor: pointer;">
        var nodes = document.querySelectorAll("a[target=_blank]");
        var i=0;
        var len = nodes.length;
        for(;i<len && nodes[i].href;i++){
            var comp = nodes[i].href.slice(-3);
            if(comp == "jpg" || comp == "gif"){
                var href = nodes[i].href;
                var newnode = "<img src="+href+" onload=\"thumbImg(this)\" alt=\"\" width=\"600\" height=\"350\" style=\"cursor: pointer;\">";
                nodes[i].insertAdjacentHTML('beforebegin',newnode)
            }
        }
    }
})();