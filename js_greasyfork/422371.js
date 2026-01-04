// ==UserScript==
// @name         noi
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  happy
// @author       jsh
// @match        http://noi.openjudge.cn/topic/*
// @match        http://noi.openjudge.cn/ch0101/clarify/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422371/noi.user.js
// @updateURL https://update.greasyfork.org/scripts/422371/noi.meta.js
// ==/UserScript==

(function() {
    var items=document.getElementsByTagName("p");
    var fg=document.getElementsByTagName("a");
    var username=fg[1].firstChild.nodeValue;
    for(var i=0;i<items.length;i++){
        var t="@"+username;
        var value=items[i].firstChild.nodeValue;
        if(value.indexOf(t)>-1){
            t="有人@了你";
            alert(t);
        }
    }

})();