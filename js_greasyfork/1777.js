// ==UserScript==
// @name        True Links for wenku8
// @namespace   http://inecmc.blogspot.com
// @description Decrypt all flashget links in wenku8.cn
// @include     http://www.wenku8.cn/*
// @version     0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1777/True%20Links%20for%20wenku8.user.js
// @updateURL https://update.greasyfork.org/scripts/1777/True%20Links%20for%20wenku8.meta.js
// ==/UserScript==

(function() {

    var links = document.querySelectorAll("a[onclick^='con']");  
    for(var i=0;i<links.length;i++){
        var dirtyLink = links[i].getAttribute("onclick");
        var start = dirtyLink.indexOf("http");
        var end = dirtyLink.indexOf("',");
        var trueLink = dirtyLink.substring(start,end);
        links[i].removeAttribute("oncontextmenu");
        links[i].removeAttribute("onclick");
        links[i].setAttribute("href",trueLink);      
    }    
})();