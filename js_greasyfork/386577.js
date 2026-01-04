// ==UserScript==
// @name         jf2
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  free jf2
// @author       Me
// @include      https://*.189.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386577/jf2.user.js
// @updateURL https://update.greasyfork.org/scripts/386577/jf2.meta.js
// ==/UserScript==

+function() {
    'use strict';
    //https://m.sc.189.cn/handlecloud-page/point/index01.html?fastcode=20000335&cityCode=sc
    window.alert = function(msg){
    		console.log(msg);
    }
    _dododo();

     function _dododo(){

     	let gcdx = document.getElementById('current_qdljf');
     	let stl = gcdx.getAttribute('style');
     	if(stl == 'color: white; width: 162px; display: none;'){
     		gcdx.setAttribute('style','color: white; width: 162px;');
     		//console.log('already done');
     		gcdx.click();
     	}
     }

}();