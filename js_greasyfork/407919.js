// ==UserScript==
// @name        VSpeed
// @version     1.0
// @description 视频倍速
// @namespace   https://www.speed.com/
// @author      speed
// @match       https://www.bjjnts.cn/lessonStudy/*
// @grant       none
// @modified    2020-07-30
// @downloadURL https://update.greasyfork.org/scripts/407919/VSpeed.user.js
// @updateURL https://update.greasyfork.org/scripts/407919/VSpeed.meta.js
// ==/UserScript==

var playbackRate = 4;
    var duration2 = maxTime;
    var isqg = true;
    $(".new_demotop").html("<b>自动连播 当前播放速度 "+playbackRate+" 倍,按键C加速 X减速 Z恢复原速 倍速太快会频繁暂停 建议稳定4倍速</b>");
    // 视频模块处理
    video.ontimeupdate=function(){
        duration2 =parseInt(this.currentTime);
    };
    // 视频结束处理
    video.addEventListener('ended', function(e) {
        if (duration - maxTime > 1 && duration != learnDuration) {
            video.currentTime = maxTime;
            return;
        }
        $('.lesson-'+lessonNum+' .course_study_menuschedule em').html('已完成<br>100%');
        var nextLesson = lessonNum+1;
        $('.lesson-'+nextLesson+' .course_study_menuschedule').addClass('lock_state');
        $('.lesson-'+nextLesson).attr('data-lock','0');
        $.post("/addstudentTaskVer2/" + courseid + "/" + lessonid, { "learnTime": duration,"push_event":"ended" },function(data){
            if(data.code == 200){
                $.cookie('lessonid', lessonid);
            }
            isqg = true;
            console.log('自动进入下一视频');
        });

    });
    // 禁止视频快进
    video.addEventListener('timeupdate', function (e) {
        var currentTime = parseInt(video.currentTime);
        if(currentTime - oldTime >= 70 && currentTime > learnDuration){
            oldTime = currentTime;
            $.post("/addstudentTaskVer2/" + courseid + "/" + lessonid, { "learnTime": currentTime,"push_event":"update" },function(data){

            });
        }
    })

    // 播放事件
    video.addEventListener('play', function (e) {
        video.playbackRate = playbackRate;
    })
    setInterval(
        function(){
            isface=0;
            beginFaceSign=0;
            is_supported_userMedia='';
            isPlay=true;
            var ds= $(".new_demoul a");
            for(var i = 0;i<ds.length;i++){
                var lessonnum = $(ds[i]).attr("data-lessonnum");
                var lessonid =  $(ds[i]).attr("data-lessonid");
                var lock =  $(ds[i]).attr("data-lock");
                var isface =  $(ds[i]).attr("data-isface");
                var txt =$(".lesson-"+lessonnum + " .course_study_menuschedule").text();
                txt =  txt.replace(/[ ]/g,"");
                txt =  txt.replace(/[\r\n]/g,"");
                var qg =  $(ds[i]).attr("data-qg");

                if(txt!="已完成100%" &&lock==0 && qg!=1 && isqg){
                    //$(ds[i]).click();
                    $(ds[i]).attr("data-qg",1);
                    isqg = false;
                    $(".lesson-"+lessonnum)[0].click();
                    console.log(lessonnum);
                }else{
                    // console.log(txt);
                }
            }
        },1000);

    // 加循环去除弹窗
    setInterval(
        function(){
            isface=0;
            beginFaceSign=0;
            is_supported_userMedia='';
            isPlay=true;
            if($(".layui-layer-btn0")){
                $(".layui-layer-btn0").click();
            };
            if( $("#face_startbtn")){
                $("#face_startbtn").click();
            }  ;
        },1000);

    //设置快捷键
    $('body').keyup(function() {
        // 先判断焦点是不是在文本框中或者下拉框
        if (document.activeElement.localName != "input" && document.activeElement.localName != "select" ) {
            var value = event.keyCode;
            if (value == 67) {
                video.playbackRate = playbackRate + 1;
                playbackRate+=1;
            }else if (value == 88){
                video.playbackRate = playbackRate - 1;
                playbackRate=  playbackRate-1;
            }else if (value == 90){
                video.playbackRate = 1;
                playbackRate = 1;
            }
            $(".new_demotop").html("<b><font color=Aqua>自动连播 当前播放速度 "+playbackRate+" 倍,按键C加速 X减速 Z恢复原速 倍速太快会频繁暂停 建议稳定4倍速</font></b>");
            console.log(playbackRate);
        }
    });