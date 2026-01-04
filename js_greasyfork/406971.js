// ==UserScript==
// @name         洛学教育网
// @namespace    http://163.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        http://www.luoxuejiaoyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406971/%E6%B4%9B%E5%AD%A6%E6%95%99%E8%82%B2%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/406971/%E6%B4%9B%E5%AD%A6%E6%95%99%E8%82%B2%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


			setInterval(function () {
			    //当任务完成后，回到首页
			    if(document.getElementsByClassName("es-icon es-icon-iccheckcircleblack24px mrs text-md").length != 0){
			        document.getElementsByClassName("btn btn-primary btn-sm")[0].click()

			    }
			    //回到首页后，点击继续学习
			    if(document.getElementsByClassName("btn btn-primary btn-lg mt10")){
			        document.getElementsByClassName("btn btn-primary btn-lg mt10")[0].click()
			    }
			}, 2000)

})();