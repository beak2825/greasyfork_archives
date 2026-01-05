// ==UserScript==
// @name         显示圈选的元素部分截图
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  try to take over the world!
// @author       You
// @match        *://*.growingio.com/projects/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18164/%E6%98%BE%E7%A4%BA%E5%9C%88%E9%80%89%E7%9A%84%E5%85%83%E7%B4%A0%E9%83%A8%E5%88%86%E6%88%AA%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/18164/%E6%98%BE%E7%A4%BA%E5%9C%88%E9%80%89%E7%9A%84%E5%85%83%E7%B4%A0%E9%83%A8%E5%88%86%E6%88%AA%E5%9B%BE.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

document.addEventListener("click", function(e) {
    var sdiv = document.getElementsByClassName("screenshot");
    for(var i = 0; i < sdiv.length; i++) {
        var sc = sdiv[i];
        var vp = sc.children[0];
        if(vp.src.match(/\/\/gta.growingio.com\/uploads\/.*\/viewport.jpg/)) {
           var target = document.createElement("img");
           target.src = vp.src.replace("viewport", "target");
           target.style.border = "dashed red";
           target.style.position = 'static';
           vp.style.position = 'static';
           sc.insertBefore(target, vp);
        }
    }
});