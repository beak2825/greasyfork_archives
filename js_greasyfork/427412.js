// ==UserScript==
// @name         deepin论坛(含uos)--大额头变透明
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  大额头变透明
// @author       小明
// @match        https://bbs.deepin.org/*
// @match        https://bbs.chinauos.com/*
// @icon         https://bbs.deepin.org/favicon.ico?domain=deepin.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427412/deepin%E8%AE%BA%E5%9D%9B%28%E5%90%ABuos%29--%E5%A4%A7%E9%A2%9D%E5%A4%B4%E5%8F%98%E9%80%8F%E6%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/427412/deepin%E8%AE%BA%E5%9D%9B%28%E5%90%ABuos%29--%E5%A4%A7%E9%A2%9D%E5%A4%B4%E5%8F%98%E9%80%8F%E6%98%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setTimeout(function(){
		if(location.host=="bbs.chinauos.com"){
			document.getElementsByClassName("nav")[0].style.opacity="0.2"
		}else{
			document.getElementsByTagName('d-header')[0].style.opacity="0.2"
		}
    }, 2000)

})();