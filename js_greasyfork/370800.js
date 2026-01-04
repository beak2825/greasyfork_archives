// ==UserScript==
// @name         灯塔党建视频学习
// @namespace    aaron.js.greasyfork.org
// @version      1.5
// @description  2019-09-05更新
// @author       Aaron
// @match        *.dtdjzx.gov.cn/course/special/*
// @match        *.dtdjzx.gov.cn/recommend
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370800/%E7%81%AF%E5%A1%94%E5%85%9A%E5%BB%BA%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/370800/%E7%81%AF%E5%A1%94%E5%85%9A%E5%BB%BA%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
var user1=0;

(function() {
    'use strict';

    // Your code here...
    $.postJSON("/bintang/getUserId", {}).then(e=>{
        if(e)
            user1=e;
        else
            alert("请登录");
    })
    $($(".top.clearfix")[1]).append('<p class="title" id="p_gobtn" style="color:  blue;cursor: pointer;">加速学习</p>');
    $("body").append('<script src="/js/sign/crypto-js/core.js"></script><script src="/js/sign/crypto-js/md5.js"></script><script src="/js/sign/sign.js"></script>');
    $("#p_gobtn").click(e=>{
        $("body").append('<div id="divConsole" style="height:600px;width:300px;position: fixed;top: 30px;background-color: #000;left: 15px;color: #aaa;border-radius: 10px;padding: 8px;overflow-y: auto;">>>学习进度面板<br/></div>')
        $("li.xuanji").each((i,n)=>{
            if(n.outerHTML.indexOf("已学")<0){
                var url=$(n).find("a")[0].getAttribute("href");
                $(n).find(".content>.course-mes").append('<span style="line-height: 30px;color: blue;float: right;margin-right: 15px;cursor: pointer;"><a href="javascript:gosss(\''+url+'\')">学习</a></span>');
            }
        });
        $(".xuanji-item").each((i,n)=>{
            if(n.outerHTML.indexOf("已学")<0){
                var url=n.getAttribute("href");
                $(n).find(".xuanji-content>.course-mes").append('<span style="line-height: 30px;color: blue;float: right;margin-right: 15px;cursor: pointer;"><a href="javascript:gosss(\''+url+'\')">学习</a></span>');
            }
        });
    });
    window.divlog=function(n,s,c){
        if(!c)
            c="#aaa";
        $("#divConsole").append(">><span style='color:#fff'>"+n+"</span>：<span style='color:"+c+"'>"+s+"</span><br/>");
    }
    window.gosss=function(url){
        divlog("新的学习","正在载入……");
        $.get(url).error(e=>{
            divlog("新的学习","载入失败！","#f00");
        }).then((h,s,o)=>{

            var project2 = JSON.parse($(h).find("#script_course").html());
            var str=$($(h).find("script")[3]).html();
            window.appSecret=str.substring(str.indexOf("'")+1,str.indexOf(";")-1);

            aaAddTimeCount(project2);
            $(h).find("xuanji-item").each((i,n)=>{
                $.get(n.href).then((h1,s1,o1)=>{
                    var project1 = JSON.parse($(h1).find("#script_course").html());
                    aaAddTimeCount(project2);
                })
            });
        });
    }
    window.aaAddTimeCount=function(project){
        //$.get("http://v.dtdjzx.gov.cn/dyjy/video/"+project.sdPath);
        divlog(project.courseName,"正在载入……");
        $.postJSON("/bintang/addTimeCount", project).fail(e=>{
        divlog(project.courseName,"载入超时","#F00");
        }).then(data=>{
            if(data.code){
				$.postJSON("/bintang/getUserId", {}).fail(e=>{
                    divlog(project.courseName,"载入超时","#F00");
                }).then(
					function(data) {
						var userId = data;
						var getStudyTimes=parseInt(project.courseDuration*60-3);
                        setTimeout(()=>{
							aaToprogress(userId,project,getStudyTimes,'recordProgress');
						},1000);

						setTimeout(()=>{
							aaToprogress(userId,project,project.courseDuration*60,'updateTimeEnd');
						},5000);
					});

            }else{
                divlog(project.courseName,"载入失败","#F00");
            }
        });
    }
	window.aaToprogress=function(userId,project,getStudyTimes,u){
        //var appSecret = '如果自动获取失败，这里替换成你自己的appSecret';
        if(!appSecret){
            divlog("自动获取appSecret失败，请修改第92行代码。")
        }
		var receive = {
			timelength:project.courseDuration,
			courseId:project.courseId,
			userId:userId,
			studyTimes:getStudyTimes
		}
		var requestParam = {
			courseId:project.courseId,
			userId:userId,
			studyTimes:getStudyTimes
		}
		var appKey = userId;
		var timestamp = new Date().getTime();
		var nonce = guid();
		var signatureType = 'MD5';
		var authType = 'ACCESSKEY';
		var signatureVersion = '1';
		var requestUri = '/bintang/recordProgress';
		var signature = sign(appKey, appSecret, requestUri, timestamp, nonce, requestParam);
		var signatureEntity = {
			'appKey' : appKey,
			'timestamp' : timestamp,
			'nonce' : nonce,
			'signatureType' : signatureType,
			'authType' : authType,
			'signatureVersion' : signatureVersion,
			'requestUri' : requestUri,
			'signature' : signature
		};
		$.postJSON("/bintang/"+u, {
			'signatureEntity' : signatureEntity,
			'receive' : receive
		}).then(function(data) {
                    if(data.isRecord){
                    divlog(project.courseName,"学习完成","#0F0");
                    }
                }).fail(e=>{
            var msg="学习失败";
            if(e.status==500)
                msg="服务器端发生错误";
            else if(e.status>=400 && e.status<500)
                msg="学习资源未找到";
            divlog(project.courseName,msg,"#F00");
        });
	}
})();