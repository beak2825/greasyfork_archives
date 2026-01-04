// ==UserScript==
// @name         CSDN ad remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除CSDN多余广告
// @author       hualin.su
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405724/CSDN%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/405724/CSDN%20ad%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //debugger

    let container_aside = document.getElementsByClassName('blog_container_aside');
    container_aside[0].innerHTML=""

	removeNodeById('csdn-toolbar');
	removeNodeByClassName('left-toolbox');
    removeNodeByClassName('first-recommend-box');
	removeNodeByClassName('comment-box');
    removeNodeByClassName('bottom-pub-footer');
    removeNodeByClassName('recommend-box');

	function removeNodeById(nodeId){
		var node = document.getElementById(nodeId);
		if (node != null)
		node.remove();
	}
	function removeNodeByClassName(nodeId){
		var fastre = document.getElementsByClassName(nodeId);
        //fastre[0].innerHTML=""
	    if (!!fastre.length) {
        for (const i of fastre) {
            i.remove();
        }
        }
	}

})();