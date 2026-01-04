// ==UserScript==
// @name         CSDN免登录自动阅读更多
// @namespace    http://tampermonkey.net/
// @version      1
// @description	 自动点击阅读更多按钮，CSDN未登录时也避免跳转登录界面。去除了一些无用元素。
// @author       443
// @iconURL		 https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=3856144780,3450407977&fm=58
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374949/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/374949/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
		var d = document;
		window.csdn.anonymousUserLimit.judgement = function() {
            return !0;
        };
        if(d.getElementById('btn-readmore')!=null)
		{
			d.getElementById('btn-readmore').click();
		}
		d.getElementsByClassName('pulllog-box')[0].style.display = '';			
		d.getElementsByClassName('meau-list')[0].style.display = 'none'; 	
		d.getElementsByClassName('persion_article')[0].style.display = 'none'; 
		d.getElementsByClassName('edu-promotion')[0].style.display = 'none';
})();