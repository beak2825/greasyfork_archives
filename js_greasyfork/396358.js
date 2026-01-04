// ==UserScript==
// @name         NCME
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  try to take over the world!
// @author       兴风作浪
// @match        http://www.ncme.org.cn/ProjectList.do*
// @match        http://www.ncme.org.cn/entityManage/entityView.do?type=play2&id=*
// @match       http://www.ncme.org.cn/projectDetail.do?id=*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/396358/NCME.user.js
// @updateURL https://update.greasyfork.org/scripts/396358/NCME.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var escape=["15601765","15300908"];
    var isPlayFlag=false;
    $.ajaxSettings.async = false;
    function tongjiProjectStudyLog(obj){
        var is_finished=false;
        $.get("/projectDetail.do?id="+obj,
               function(data){
            //>已学完</button>
            //            console.log(data.indexOf(">已学完</button>"));
            //            console.log("Data Loaded: " + data);
            if(data.indexOf(">已学完</button>")!=-1){
                is_finished=true;
                 console.log("Data Loaded:已完成");
            }
        });
        //         $.ajax({
        //             url:"/projectDetail.do?id="+obj,
        //             type: 'POST',
        //             dataType: 'json',
        //             async:false,
        //             error:function(xhr){
        // 			console.log("错误提示： " + xhr.status + " " + xhr.statusText);
        // 		},
        //             success: function(data){
        //                 var result = eval(data);
        //                 console.log("result:"+result);
        //                 if(result.message==1){
        //                     is_finished= false; //("开始学习");
        //                 }
        //                 if(result.message==2){
        //                     is_finished= false; //("继续学习");
        //                 }
        //                 if(result.message==3){
        //                     is_finished= true; //已学完;
        //                 }
        //             }
        //         });
        console.log(obj,is_finished);
        return is_finished;
    }
    if(window.location.href.indexOf("ProjectList.do")>0){//在列表界面运行
        console.log("列表界面");
        var lis=$("li[onclick^='javascript:gotoDetail']");
        var finishi=true;
        lis.each(function(index,value){
            var course_id=$(this)[0]["onclick"].toString().substr(48,8);
            //console.log(escape.includes(course_id))
            //tongjiProjectStudyLog(course_id) ? console.log("已完成"):$(this)[0].onclick();
            if(!escape.includes(course_id)){
                if(tongjiProjectStudyLog(course_id)){
                    console.log("已完成")
                }else{
                    finishi=false;
                    //console.log( $(this))
                    localStorage.setItem("lasturl", window.location.href);
                    location.href = "/entityManage/entityView.do?type=play2&id="+ course_id + "&paramType=project"
                    return false;
                }
            }else{
                console.log("跳过"+course_id);
            }
        });
        if(finishi)(alert("本页以刷完"))
        //alert("本页以刷完");

    }
    if(window.location.href.indexOf("projectDetail.do")>0){//在列表界面运行
        console.log("详情界面");
        if($("[name='study_begin']")[0].innerText=="已学完"){
            location.href =  localStorage.getItem("lasturl");
        }else{
            $("[name='study_begin']")[0].click()
        }
    }
    // function on_spark_player_start() {
    //     console.log("on_spark_player_start");
    //     window.vLength = document.getElementById("playerswf").getDuration() ;
    //     window.currVideoPlayLengthMax=window.vLength;
    //     //        console.log(window.currVideoPlayLengthMax);
    //     //        console.log(window.vLength);
    //     var swf=document.getElementById("playerswf");
    //     swf.pause();
    //     swf.seek(window.vLength-4);
    //     swf.resume();
    // }
    function test(){
        if(tongjiProjectStudyLog(window.currUnitIdVal)){
            history.go(-1);
            return;
        }
        console.log("开始检测是否有未完成课程")
        var has_dones=$(".has_done");
        var units=$(".unit")
        console.log(has_dones);
        has_dones.each(function(index,value){
            console.log(index,value);
            //units[index].onclick();
            console.log($(this)[0].innerText.indexOf("")>-1);
            if($(this)[0].innerText.indexOf("")>-1 || $(this)[0].innerText.indexOf("")>-1){
                if(!isPlayFlag){
                    units[index].onclick();
                }
                console.log("存在未完成视频",units[index]);
                return true ;
            }else{
                console.log("该单元完成");
                console.log($("fa fa-angle-left")[0]);
                location.href =  localStorage.getItem("lasturl");
            }
        });
    }
    if(window.location.href.indexOf("entityView.do")>0){//播放界面
        var oldon_spark_player_start= window.on_spark_player_start;
        console.log("视频播放界面");
        window.on_spark_player_start=function () {
            console.log("视频播放开始");
            isPlayFlag=true;
            oldon_spark_player_start.apply(null, arguments); // 调用原函数
            var swf=document.getElementById("playerswf");
            swf.pause();
            window.currVideoPlayLengthMax=window.vLength;
            swf.seek(window.vLength-4);
            swf.resume();
        }
    }
    var oldon_spark_player_stop = window.on_spark_player_stop
    window.on_spark_player_stop = function () {
        console.log("视频播放停止");
        isPlayFlag=false;
        oldon_spark_player_stop.apply(null, arguments); // 调用原函数
        test();}
}


)();