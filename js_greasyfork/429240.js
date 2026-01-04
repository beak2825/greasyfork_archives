// ==UserScript==
// @name         华为云课堂防止内存溢出
// @version      2.3.2
// @description  防止video.js刷新iframe导致内存溢出，增加判断登录是否过期。
// @author       LittleJake
// @license      Apache2.0
// @match        https://education.huaweicloud.com/courses/*
// @icon         https://www.google.cn/s2/favicons?domain=huaweicloud.com
// @grant        none
// @namespace https://greasyfork.org/users/773473
// @downloadURL https://update.greasyfork.org/scripts/429240/%E5%8D%8E%E4%B8%BA%E4%BA%91%E8%AF%BE%E5%A0%82%E9%98%B2%E6%AD%A2%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/429240/%E5%8D%8E%E4%B8%BA%E4%BA%91%E8%AF%BE%E5%A0%82%E9%98%B2%E6%AD%A2%E5%86%85%E5%AD%98%E6%BA%A2%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var rm = function(){
		//去除iframe
        if (document.getElementById("testIframe")){
            document.getElementById("testIframe").remove();
            console.log("rm success.");
        }
        //去除水印
        $('#watermark').val("False");
    };
	
	//处理登录失效问题
	if ($){
		let data_id = $(".vert-0").attr("data-id"),
			course_id = $(".vert-0").children().attr("data-course-id");
		let ajax_url = "https://education.huaweicloud.com/courses/" + course_id + "/xblock/" + data_id + "/handler/save_user_video_time";
		if (data_id && course_id){
			setInterval(function(){
				if ($){
					$.ajax({
						url: ajax_url,
						data: '{"msg":0,"type":""}',
						method: "POST",
						error: function(e){
							console.log(e.status);
							if (e.status == 403){
								window.location = "https://auth.huaweicloud.com/authui/login.html?service="+window.location;
								$ = null;
							}
						},
					});
				}
			}, 10000);
        }
		
		window.onload = rm;
        $("body").on('click', rm);
	}
	console.log("===华为云课堂增强脚本===");
	console.log("项目地址：https://github.com/LittleJake/education-huawei-memory-leak/");
	console.log("by LittleJake, licensed under Apache2.0");
})();
