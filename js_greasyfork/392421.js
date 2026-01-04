// ==UserScript==
// @icon         http://pan.baidu.com/box-static/disk-system/images/favicon.ico
// @name         Javbus
// @namespace    gan713
// @author       一条肠
// @description  javbus去广告
// @include      *://www.dmmbus.co/*
// @include      *://www.javbus.zone/*
// @version      0.3.3
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392421/Javbus.user.js
// @updateURL https://update.greasyfork.org/scripts/392421/Javbus.meta.js
// ==/UserScript==
(function(){
'use strict';
const adclasses=["alert","ad-table","ad-list","footer","ptb30","ptb10"];
for(let adclass of adclasses){
let elements=document.getElementsByClassName(adclass);
for(let element of elements){
element.style.display='none';
}
}
})();