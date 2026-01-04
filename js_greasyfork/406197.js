// ==UserScript==
// @name         script4xin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       小新
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406197/script4xin.user.js
// @updateURL https://update.greasyfork.org/scripts/406197/script4xin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //
    var obj =  document.getElementById("content_left");
    var tag_obj = obj.children;
    var obj_length = tag_obj.length;
    for(var i = 0 ; i < obj_length ; i++) {
//获取每个子元素的 id 值，1-10 之间的保留               //alert(tag_obj[i].getAttribute('id'));
if(!tag_obj[i]) {continue;}
var idVal = tag_obj[i].getAttribute('id');
if(idVal && idVal >= 1 && idVal <= 10) {

 //obj.removeChild(tag_obj[0]);
 continue;
 } else { //删除该子元素

 if(tag_obj[i])
 obj.removeChild(tag_obj[i]);                   //删除完后，所有子元素序号又从0开始重新排列
i = 0;
}}


})();