// ==UserScript==
// @name         周口专业课
// @namespace    http://1234.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zkzj.jxjyedu.org.cn//student/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411141/%E5%91%A8%E5%8F%A3%E4%B8%93%E4%B8%9A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/411141/%E5%91%A8%E5%8F%A3%E4%B8%93%E4%B8%9A%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
				var video = document.querySelector('#media2_video');
				video.addEventListener('ended',function(){
				   video.load();
				},false);
			},1000)
})();