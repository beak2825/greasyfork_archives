//javascript
// ==UserScript==
// @name baiduswitch
// @namespace http://tampermonkey.net/
// @version 0.2
// @description try to take over the world!
// @author dded
// @match https://aistudio.baidu.com/*cpu*/user/52469/*
// @grant none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/402763/baiduswitch.user.js
// @updateURL https://update.greasyfork.org/scripts/402763/baiduswitch.meta.js
// ==/UserScript==
(function() {
'use strict';

    function bot(){

        if ($(".n-env-current-name-info")[0] && $(".n-env-current-name-info")[0].textContent=="基础版"){
            $(".n-env-current-operate-name").click()
            $(".confirm-btn-primary").click()
        }
    }
    if (!$(".n-env-current-name-info")[0]){
            alert("请手动切换到环境选项卡")
    }
    setInterval(function(){
        bot();
	    }, 5000);
})();