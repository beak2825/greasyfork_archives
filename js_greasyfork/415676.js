// ==UserScript==
// @name         b-danmaku-high none display
// @namespace    http://tampermonkey.net/
// @version      0.5.1
// @description  try to take over the world!
// @author       You
// @match        *://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415676/b-danmaku-high%20none%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/415676/b-danmaku-high%20none%20display.meta.js
// ==/UserScript==
//本来想参考bilihelper来写 但是太花时间了 简单做一个算了
//直接灌css完事
(function() {
    'use strict';
    var tag = document.createElement("STYLE");
	var css = document.createTextNode(".b-danmaku-high {display:none!important;}");
	tag.appendChild(css);
	document.head.appendChild(tag);
})();
/*(function() {
    'use strict';
    setInterval(function(){
        var info = document.getElementsByClassName("b-danmaku-high");
        if(info.length){
            let length=info.length;
            for(let i=0;i<length;i++){
                info[i].style.display = "none";
            }
        }
    }, 500);
    // Your code here...
})();*/