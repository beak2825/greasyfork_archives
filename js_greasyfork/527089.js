// ==UserScript==
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @name         寒假暑假研修
// @namespace    https://gitee.com/tangpc/gongxukemu
// @version      0.0.1
// @description  寒假暑假研修学习
// @author       tpc
// @match        https://basic.smartedu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527089/%E5%AF%92%E5%81%87%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/527089/%E5%AF%92%E5%81%87%E6%9A%91%E5%81%87%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var year = "2025";
    var hjpx_url="https://s-file-1.ykt.cbern.com.cn/teach/api_static/trains/"+year+"hjpx.json";
    var hjpx2025_train_courses="https://s-file-1.ykt.cbern.com.cn/teach/api_static/trains/2025hjpx/train_courses.json";
    //获取当前课程主ID
    //https://s-file-1.ykt.cbern.com.cn/teach/api_static/trains/2025hjpx.json
    //获取当前用户课程一级ID,5aa28de6-ad0a-4c92-aebd-632b9d7165f0为当前课程主ID
    //https://s-file-1.ykt.cbern.com.cn/teach/api_static/trains/5aa28de6-ad0a-4c92-aebd-632b9d7165f0.json
    //获取当前课程二级ID,2c5f7bc2-699a-4433-b650-b5e554ed15e3为课程一级ID
    //https://s-file-2.ykt.cbern.com.cn/teach/s_course/v2/business_courses/2c5f7bc2-699a-4433-b650-b5e554ed15e3/course_relative_infos/zh-CN.json
    //获取课程三级ID,ea459773-c059-4320-8805-2035ce6019eb为课程二级ID
    //https://s-file-1.ykt.cbern.com.cn/teach/s_course/v2/activity_sets/ea459773-c059-4320-8805-2035ce6019eb/fulls.json
    //提交学习进度,1503e96a-e01d-446a-9e82-d61fce960ea9为课程三级ID,452589097891为用户ID,从cookie中获取
    //https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/1503e96a-e01d-446a-9e82-d61fce960ea9/452589097891
	//https://x-study-record-api.ykt.eduyun.cn/v1/study_details
    var $button1 = $("<button style=\"position: absolute;right: 42%;top: 50px;color: #ecdf24;background: #241717;display: block;z-index: 999;\">完成视频</button>")
	
    $("body").append($button1)
	
    //定义任务数组,用于学习完毕关闭任务
    var taskList = new Array()
	//一键学习
    $button1.click(function(){
        var userid = getCookie("X-EDU-WEB-ROLE").split(":")[0];//用户ID
        console.log("userid:"+userid);
        $.get(hjpx_url,function(data){//获取课程主ID和列表ID
            var trains=data;
            //var id1=trains["train"]["id"];//课程主ID
            var ids=trains["train_course_ids"];//课程一级ID列表
            $.each(ids,function(i,id){
                $.get("https://s-file-2.ykt.cbern.com.cn/teach/s_course/v2/business_courses/"+id+"/course_relative_infos/zh-CN.json",function(data2){//获取课程二级ID
                    var activity_set_id=data2["course_detail"]["activity_set_id"];//课程二级ID
                    $.get("https://s-file-1.ykt.cbern.com.cn/teach/s_course/v2/activity_sets/"+activity_set_id+"/fulls.json",function(data3){//获取课程三级ID
                        var activity_set_name = data3["activity_set_name"];
                        var nodes=data3["nodes"];
                        $.each(nodes,function(j,node){
                            var child_nodes=node["child_nodes"];
                            $.each(child_nodes,function(k,child){
                                var activity_resources=child["relations"]["activity"]["activity_resources"];
                                $.each(activity_resources,function(m,resource){
                                    var resource_id=resource["resource_id"];
                                    var study_time =resource["study_time"];
                                    var req = {"position":study_time};
                                    $.ajax({
                                        type: "put",
                                        contentType:"application/json;charset=UTF-8",
                                        url: "https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/"+resource_id+"/"+userid,
                                        data: JSON.stringify(req),
                                        success: function(data4){
                                            console.log(data4);
                                            // var req2 = {"user_id":userid,"resource_id":id,"resource_name":activity_set_name,"resource_type":"t_course","catalog_type":"teacherTraining","topic_type":id,"progress":100,"status":1,"ext_info":""};
                                            // $.ajax({
                                            //     type: "post",
                                            //     contentType:"application/json;charset=UTF-8",
                                            //     url: "https://x-study-record-api.ykt.eduyun.cn/v1/study_details",
                                            //     data: JSON.stringify(req2),
                                            //     success: function(data5){
                                            //         console.log(data5);
                                            //     }
                                            // });
                                        }
                                    });
                                })

                            })
                        })

                    })

                })

            })

        })

    })
    //获取cookie的值
    function getCookie(name) {
        let cookieArray = document.cookie.split(';');
        for(let i = 0; i < cookieArray.length; i++) {
            let cookiePair = cookieArray[i].split('=');
            if(name == cookiePair[0].trim()) {
                return decodeURIComponent(cookiePair[1]);
            }
        }
        return null;
    }
	//解析方法参数
	function getParam(str){
		var params = {};
		var p1= str.substring(str.indexOf('(')+1,str.indexOf(')'))
		var user_id = p1.split(',')[0]
		var course_id = p1.split(',')[1]
		params.user_id=user_id
		params.course_id=course_id
		return params;

	}
    //解析url参数
    function getUrlkey(url) {
        var params = {};
        var urls = url.split("?");
        var arr = urls[1].split("&");
        for (var i = 0, l = arr.length; i < l; i++) {
            var a = arr[i].split("=");
            params[a[0]] = a[1];
        }
        return params;
    }
    //重写setInterval方法
    var __sto = setInterval;
    window.setInterval = function(callback,timeout,params){
        var args = Array.prototype.slice.call(arguments,2);
        var _cb = function(){
            callback.apply(null,args);
        }
        return __sto(_cb,timeout);
    }
    
})();