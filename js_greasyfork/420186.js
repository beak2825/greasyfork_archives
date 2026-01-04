// ==UserScript==
// @name         西南科技大学视频学习
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202106101511
// @description  西南科技大学学习助手，2倍速看视频，尚课平台。
// @author       流浪的蛊惑
// @run-at       document-end
// @match        *://learnspace.swust.net.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420186/%E8%A5%BF%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/420186/%E8%A5%BF%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var gjs=0,gwxsj={gt:[]},gjdcx=true;
    var sftj=true;//是否初始化
    var gtime=0,gstu=null,gtjsj,gpidx=0;
    function getParams(c) {
        var d = {
            courseId: c.courseId,
            itemId: c.itemId,
            time1: CommonUtil.formatStr((new Date()).getTime(), 20),
            time2: CommonUtil.formatStr(parseInt(c.startTime), 20),
            time3: CommonUtil.formatStr(CommonUtil.timeToSeconds(c.videoTotalTime), 20),
            time4: CommonUtil.formatStr(parseInt(c.endTime), 20),
            videoIndex: c.videoIndex,
            time5: CommonUtil.formatStr(c.studyTimeLong, 20),
            terminalType: c.terminalType
        };
        return d
    }
    function gtjjl(data){
        var d = CommonUtil.getPlatformPath() + "/course/study/learningTime_saveVideoLearnDetailRecord.action";
        var p = d + "?studyRecord=" + encodeURIComponent(data);
        $.ajax({
            url: p,
            type: "GET",
            cache: false,
            success: function(e) {
                $("#gtjjg").html((new Date()).getTime()+"<br />"+e);
            }
        });
    }
    function ggetjd(data){
        let tjsj="{\"params.courseId\":\""+data.courseId+"\",\"params.itemId\":\""+data.itemId+"\",\"params.videoTotalTime\":\""+data.videoTotalTime+"\"}"
        $.ajax({
            method:"POST",
            url:"/learnspace/learn/learn/common/video_learn_record_detail.action",
            data:JSON.parse(tjsj),
            success:function(e){
                $("#gwxx").html(e);
                gjdcx=true;
            },
            error:function(xhr, textStatus, errorThrown){
                console.log("进入error---");
                console.log("状态码："+xhr.status);
                console.log("状态:"+xhr.readyState);//当前状态,0-未初始化，1-正在载入，2-已经载入，3-数据进行交互，4-完成。
                console.log("错误信息:"+xhr.statusText );
                console.log("返回响应信息："+xhr.responseText );//这里是详细的信息
                console.log("请求状态："+textStatus);
                console.log(errorThrown);
                console.log("请求失败");
            }
        });
    }
    setInterval(function(){
        let gzj1=document.getElementsByClassName("dumascroll_area");
        if(gzj1.length>0){
            let gxx=localStorage.getItem(_ACTIVITYID_);
            let gj1=gzj1[0].getElementsByTagName("li");
            for(let i=0;i<gj1.length;i++){
                if(gj1[i].getElementsByTagName("span")[0].className!="done"){
                    if(gxx==null){
                        gj1[i].getElementsByTagName("span")[0].className="done";
                        localStorage.setItem(_ACTIVITYID_,"开始学习");
                        gj1[i].getElementsByTagName("a")[0].click();
                        break;
                    }
                }
            }
            let gj2=gzj1[0].getElementsByClassName("s_point");
            for(let i=0;i<gj2.length;i++){
                if(gj2[i].getAttribute("itemtype")=="video" && gj2[i].getAttribute("completestate")=="0"){
                    if(gxx==null){
                        localStorage.setItem(_ACTIVITYID_,"开始学习");
                        gj2[i].click();
                        break;
                    }
                }
            }
        }
        if(sftj){
            if($.defaults!=undefined){
                gtime=CommonUtil.timeToSeconds($.defaults.videoTotalTime);
                gstu=$.defaults;
                if(gstu.position>0){
                    let gpro=document.getElementsByClassName("cont video1")[0];
                    gpro.innerHTML="<div style=\"text-align:center;\"><div id=\"gzt\">平台限制最高可以2倍速度学习,学习可多开，倍速学习中…</div><div id=\"gxxjd\"></div><div id=\"gtjjg\"></div><div id=\"gwxx\"></div></div>";
                    sftj=false;
                    ggetjd(gstu);
                }
                gtjsj=5;
            }
        }
        if(gtime>0){
            if($(".track-undo").length>0 && gjdcx && gpidx==0){
                let gstr="未学习部分：";
                gpidx=0;
                gwxsj={gt:[]};
                for(let i=0;i<$(".track-undo").length;i++){
                    let gsj=$(".track-undo")[i].getElementsByClassName("track-txt");
                    let gwx={
                        gks:CommonUtil.timeToSeconds(gsj[0].innerText.replace(/开始：/g,"")),
                        gjs:CommonUtil.timeToSeconds(gsj[1].innerText.replace(/结束：/g,""))
                    };
                    gstr+="<div>从 "+gwx.gks+" 到 "+gwx.gjs+" 秒</div>";
                    gwxsj.gt.push(gwx);
                }
                $("#gwxx").html(gstr);
            }
            if(gwxsj.gt.length>0 && gjdcx){
                gjdcx=false;
                gtime=gwxsj.gt[gpidx].gjs;
                gstu.startTime=gwxsj.gt[gpidx].gks;
                gstu.position=gwxsj.gt[gpidx].gks;
                gstu.endTime=gwxsj.gt[gpidx].gks;
            }
            if(gtime==0){
                gtime=CommonUtil.timeToSeconds($.defaults.videoTotalTime);
            }
            gstu.position+=2.1;
            gstu.endTime+=2.1;
            if(parseInt(gstu.position)>=gtime){
                gstu.position=gtime;
                gstu.endTime=gtime;
                gtjsj=0;
                gjdcx=true;
                gpidx++;
            }
            var  gtj=getParams(gstu);
            gjs++;
            $("#gxxjd").text("当前时间："+parseInt(gstu.position)+" 秒，结束时间："+gtime+" 秒。");
            if(gjs>gtjsj){
                gjs=0;
                gtjsj=30;
                gstu.startTime=parseInt(gstu.position);
                gtjjl((CommonUtil.encrypt(JSON.stringify(gtj))));
                if(gpidx==gwxsj.gt.length){
                    gtime=0;
                    localStorage.removeItem(_ACTIVITYID_);
                }
            }
        }else{
            sftj=true;
        }
    },1000);
})();