// ==UserScript==
// @name         apiv云播
// @namespace    http://tampermonkey.net/
// @icon         http://apiv.ga/favicon.ico
// @version      1.0
// @description  找出页面中的磁力链接，并提供跳转到apiv云播页面
// @author       枫不平
// @include      https://btdigg.org/search*
// @include      http://btdigg.org/search*
// @include      http://www.mp4ba.com/*
// @include      http://*.jav*.*
// @include      https://*.jav*.*
// @include      http://*.torrent*.*/*
// @include      https://*.torrent*.*/*
// @include      http://*.bt*.*
// @include      https://*.bt*.*
// @include      http://*.cili*.*
// @include      https://*.cili*.*
// @include      http://torrentproject.*
// @include      https://torrentproject.*
// @include      https://avmo.pw/*
// @include      http://www.dmm.co.jp/digital/videoa/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26944/apiv%E4%BA%91%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/26944/apiv%E4%BA%91%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getAllMagnet(nodes) {
        var styDiy = 'width:16px;height:16px;background-image:url("http://apiv.ga/favicon.ico");background-size:16px 16px;display: inline-block';
    	var aobj = document.createElement('a');
    	aobj.target = '_blank';
    	aobj.style.cssText = styDiy;
    	for(var i = 0; i < nodes.length ; i++ ){
            var aexp = aobj.cloneNode(true);
    		var magnet = nodes[i].href.match(/\w{40}/,'g');
    		aexp.href = 'http://apiv.ga/magnet/' + magnet;
    		nodes[i].parentNode.appendChild(aexp);
    	}
    }
    var count = 0;
    function init() {
    	window.setTimeout(function () {
    		var nodes = document.querySelectorAll('a[href^="magnet"]');
    		if( nodes.length > 0){
    			getAllMagnet(nodes);
    		}else if(count < 5){
    			init();
                console.log('fail');
                count++;
    		}
    	},200);
    }
    window.onload = init;
})();