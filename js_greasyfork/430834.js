// ==UserScript==
// @name         bd4自动连播
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bd4自动连播功能
// @author       zhoushengming
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @match        https://www.mp4er.com/play/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430834/bd4%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/430834/bd4%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==
(function() {
	'use strict';

	// 1. 创建一个变量
	var ref = "";
	/// 2. 定时刷新调用的方法
	function consoleLog() {
		var ptime = $(".dplayer-ptime").text();
        var dtime = $(".dplayer-dtime").text();
        var href = window.location.href;

        // https://www.mp4er.com/play/9840-50.htm
        console.log("ptime:" + ptime);
        console.log("dtime:" + dtime);
        if(ptime == ""){
            return;
        }
        if(ptime == "0:00"){
            return;
        }

        if(ptime == dtime){

            console.log("href:" + href);
            var end1 = href.lastIndexOf("-");
            var end2 = href.lastIndexOf(".");
            var number = href.substr(end1 + 1,end2-end1-1);
            console.log("number:" + number);
            var target_number = Number(number)+1;
            var target = href.substr(0,end1+1)+target_number+href.substr(end2,href.length);
            console.log("target:" + target);
            window.location.href=target;
        }
	}
	// 3. 设置定时刷新
	ref = setInterval(function() {
		consoleLog();
	}, 1000);
	//4. 阻止定时刷新
	//clearInterval(ref);

})();