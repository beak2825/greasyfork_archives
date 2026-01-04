// ==UserScript==
// @name         星亚科技-江苏教师教育
// @namespace    https://greasyfork.org/zh-CN/users/41249-tantiancai
// @version      221115
// @description  自动挂机学习。
// @license      左手天才
// @author       XY-Tantiancai
// @match        https://jste.lexiangla.com/classes/*/courses/*
// @match        https://lexiangla.com/classes/*/courses/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454841/%E6%98%9F%E4%BA%9A%E7%A7%91%E6%8A%80-%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/454841/%E6%98%9F%E4%BA%9A%E7%A7%91%E6%8A%80-%E6%B1%9F%E8%8B%8F%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function getUnsafeWindow() {
        if(this)
        {
            console.log(this);
            if (typeof(this.unsafeWindow) !== "undefined") {//Greasemonkey, Scriptish, Tampermonkey, etc.
                return this.unsafeWindow;
            } else if (typeof(unsafeWindow) !== "undefined" && this === window && unsafeWindow === window) {//Google Chrome natively
                var node = document.createElement("div");
                node.setAttribute("onclick", "return window;");
                return node.onclick();
            }else
            {
            }
        } else {//Opera, IE7Pro, etc.
            return window;
        }
    }
    var myUnsafeWindow = getUnsafeWindow();
    var doc = myUnsafeWindow.document;
    var processTimer = null;
    var cntRetry = 0;
	myUnsafeWindow.clearInterval(processTimer);
    // 每隔5秒检测一次
    processTimer = myUnsafeWindow.setInterval(TimeProcess, 5000);

    // 检测函数
    function TimeProcess()
    {
        // 播放按钮表示时，点击播放按钮
        if($('.vjs-big-play-button').css('display') != 'none')
        {
	        console.log('点击播放', 'color:blue');
	        $('.vjs-big-play-button').click();
        }

        // 确定按钮表示时，点击确定按钮
        var confirm = $(".venom-confirm");
        if(confirm.length > 0 && confirm.css('display') != 'none')
        {
            console.log('点击确定', 'color:blue');
            $('.venom-btn-primary').click();
        }
    }

})();
