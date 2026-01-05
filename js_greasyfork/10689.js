// ==UserScript==
// @name        玩你妈逼滚去学
// @namespace   0w0右手
// @include     *
// @version     0.00001
// @description 防止任何使用浏览器的行为 滚去学
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10689/%E7%8E%A9%E4%BD%A0%E5%A6%88%E9%80%BC%E6%BB%9A%E5%8E%BB%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/10689/%E7%8E%A9%E4%BD%A0%E5%A6%88%E9%80%BC%E6%BB%9A%E5%8E%BB%E5%AD%A6.meta.js
// ==/UserScript==

(function(){

//=================================公共函数===================================
	function $(id){
		if(typeof id != undefined){
			return document.getElementById(id);
		}
	}
	function loadStyle(css){
    	if(typeof GM_addStyle!='undefined'){
        	GM_addStyle(css);
    	}
    	else{
        	var heads=document.getElementsByTagName('head');
        	if(heads.length>0){
            	var node=document.createElement('style');
            	node.type='text/css';
            	node.appendChild(document.createTextNode(css));
            	heads[0].appendChild(node);
        	}
    	}
	}

//=================================CSS========================================
	var cssstyle = '\
	#PlayMask{\
		left:0px !important;\
		top:0px !important;\
		position:fixed !important;\
		z-index:9999999999 !important;\
		background:rgba(248,248,248,0.9) url("http://bbs.gamefy.cn/data/attachment/album/201506/28/1958487z1feo71j5ennven.png") no-repeat center top !important;\
	}';
	loadStyle(cssstyle);

//============================================================================
	
	var mask = document.createElement('div');
	mask.id = 'PlayMask';
	window.top.document.documentElement.appendChild(mask);
	mask.style.width = document.body.clientWidth + 'px';
	mask.style.height = document.body.clientHeight + 'px';

})();