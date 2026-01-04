// ==UserScript==
// @name         中国石油大学网络教育 -【学习助手】
// @namespace    https://dongliwei.cn/
// @version      1.2
// @description  可一键完成”在线作业“和”学习视频“
// @author       DongLiwei
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js
// @match        http://www.cupde.cn/learning/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/435184/%E4%B8%AD%E5%9B%BD%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%20-%E3%80%90%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/435184/%E4%B8%AD%E5%9B%BD%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%20-%E3%80%90%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var autoOverClass = GM_getValue("autoOverClass",false);
    var waitForAction = false;

    var url=location.href;
    if(url.indexOf("homeworkPaperList_toHomework")!==-1){
        getRightAnwser();
    }else if(url.indexOf("/CourseImports/bjsy/")!==-1){
        initDiv();
        initVideoScripts();
    }

    function initDiv(){
        var sdiv = $('<div><b><input type="checkbox" id="autoPassClass">自动过课</b>' +
             '<hr>勾选后将自动点击过课、下一课' +
             '<hr>如果加载卡住，请点击</div>');
        sdiv.css({
            'position': 'fixed',
            'top': '25px',
            'right': '10px',
            'width': '280px',
            'border': '2px solid #000',
            'z-index': '999',
            'background-color': 'rgb(221, 221, 221)',
            'padding': '5px'
        });
        $('body').append(sdiv);

        $('#autoPassClass').prop('checked',autoOverClass);

        var sbtn = $('<button>刷新</btton>');
        sdiv.append(sbtn);
        sbtn.click(function () {
             location.reload();
        });


        var dragging = false;
        var iX,iY;
        sdiv.mousedown(function (e) {
            dragging = true;
            iX = e.clientX - this.offsetLeft;
            iY = e.clientY - this.offsetTop;
            this.setCapture && this.setCapture();
            //return false;
        });
        document.onmousemove = function (e) {
            if (dragging) {
                e = e || window.event;
                var oX = e.clientX - iX;
                var oY = e.clientY - iY;
                sdiv.css({
                    'left': oX + 'px',
                    'top': oY + 'px'
                });
                return false;
            }
        };
        $(document).mouseup(function (e) {
            dragging = false;
            e.cancelBubble = true;
        });

        refreshCheckbox();
    }

    function refreshCheckbox()
    {
        autoOverClass = $('#autoPassClass').prop('checked') === true;
        GM_setValue("autoOverClass",autoOverClass);

        if(autoOverClass && waitForAction){
            console.log("自动完成课程！");
            setTimeout(completed_lesson,1000);
        }else{
            setTimeout(refreshCheckbox,1000);
        }
    }

    function initVideoScripts()
    {
        $(document).keyup(function(event){
           if(event.ctrlKey && event.keyCode==80){
               completed_lesson();
           }
           if(event.ctrlKey && event.keyCode==78){
               next_lesson();
           }
           if(event.ctrlKey && event.keyCode==76){
               completed_lesson();
               next_lesson();
           }

       });
       setTimeout(init_info,100);
    }

    //完成课程
    function completed_lesson()
    {
        //视频时间
        var video_time = Math.floor(MsnGetDuration());
        video_time = video_time + randomNum(2,10)*60 + randomNum(2,50);
        var formattedTime = convertTotalSeconds( video_time );

        if(isNaN(video_time))
        {
            alert("未获取到视频时间，请点击刷新后重试！");
            return;

        }
        doLMSSetValue("cmi.core.entry", "");
        doLMSSetValue("cmi.core.lesson_status", "completed");
        doLMSSetValue("cmi.core.session_time", formattedTime );
        doLMSSetValue("cmi.core.total_time", formattedTime );

        //doLMSFinish();
        doLMSCommit();

        if(autoOverClass)
        {
            console.log("自动进入下一课！");
            next_lesson();
        }else{
            alert("过课完成，本课学习时间：" + formattedTime);
        }
    }

    //下一课
    function next_lesson()
    {
        var courseName= GetCoursePath(document.location.href);
        var jumpCourseName = GetJumpCourseName(courseName, 1);

        if(jumpCourseName == null || courseName == jumpCourseName)
        {
             alert("学习完成！已经是最后一课！");
        }else{
            JumpToNextCourse();
        }

    }

    //初始化视频信息
    function init_info()
    {
        $("#infoLayer").remove();
        $("#courseTitle").before("<div id=\"infoLayer\"></div>");

        //会话ID
        var sessionid = document.cookie.split(';')[0].split('=')[1];
        //$("#infoLayer").append("Your sessionid is <b>" + sessionid+ "</b></br>");
        $("#infoLayer").append("<b>【学习助手提示】</b> 可使用键盘快捷键Ctrl+P完成过课，Ctrl+N进入下一课</br>");

        //课程状态
        //var status = doLMSGetValue( "cmi.core.lesson_status" );
        //$("#infoLayer").append("status=" +status + "</br>");

        //total_time
        //var total_time = doLMSGetValue("cmi.core.total_time");
        //var total_timeF = format2Sec(total_time);
        //$("#infoLayer").append("total_time=" + total_timeF + "  (" + total_time  + ")</br>");

        //session_time
        //var session_time = doLMSGetValue("cmi.core.session_time");
        //var session_timeF = format2Sec(session_time);
        //$("#infoLayer").append("session_time=" + session_timeF + "  (" + session_time  + ")</br>");

        //视频时间
        var video_time = NaN;
        var video_timeF = NaN;

        try{
            video_time = Math.floor(MsnGetDuration());
            video_timeF = convertTotalSeconds( video_time );
        }catch(e){
            alert("excption");
            $("#infoLayer").append("<b>正在等待视频加载...</b>");
            setTimeout(init_info,100);
            return;
        }

        if(isNaN(video_time))
        {
            $("#infoLayer").append("<b>正在等待视频加载...</b>");
            setTimeout(init_info,100);
        }else{

            $("#infoLayer").append("<b>加载完成</b> video_time=" + video_time + "  (" + video_timeF  + ")</br>");
            init_buttons();

            if(autoOverClass){
                console.log("自动完成课程！");
                setTimeout(completed_lesson,1000);
            }else{
                waitForAction = true;
            }
        }
    }

    //初始化视频按钮
    function init_buttons()
    {
        $("#courseTitle").after("<div id=\"dlw_buttons\"></div>");
        //$("#dlw_buttons").append("<input type=\"button\" id=\"init_info\" value=\"刷新\" >   ");
        $("#dlw_buttons").append("<input type=\"button\" id=\"completed_lesson\" value=\"过课(P)\" >   ");
        $("#dlw_buttons").append("<input type=\"button\" id=\"next_lesson\" value=\"下一课(N)\" >");
        $("#completed_lesson").on("click", completed_lesson);
        $("#next_lesson").on("click", next_lesson);
    }

    //随机数
    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }


     //获取正确答案
    function getRightAnwser(){
        var homeworkInfoId = getQueryVariable("homeworkInfo.id");
        var url=`http://www.cupde.cn/learning/entity/function/homework/homeworkPaperList_showAnswer.action?homeworkInfo.id=${homeworkInfoId}&homeworkInfo.type=0&homeworkInfo.title=`
        $.get(url,function(html){
            var htmlObj=$(html);

            var answerStr = getAnsersStr(html);
            $(".progress").after("<div id=\"ansers\" style=\"word-wrap: break-word;background: white;margin-left: 50%;\"><b>" + answerStr + "</b></br><input type=\"button\" value=\"一键完成\" id=\"one-sumbit\"/></div>");
            $(".progress").parent().css({"pointer-events":"none"});
            $("#one-sumbit").parent().css({"pointer-events":"auto"});
            $("#one-sumbit").click(function(){
               setRightAnwser(htmlObj);
            });
        });
    }

    //勾选答案
    function setRightAnwser(htmlObj)
    {
        htmlObj.find("div[name^='tm'] .answer_key span[style]").each(function(i){
                var answer=$(this).html().replace("<!--","").replace("-->","");
                var answerObj=$(answer);
                //var rightAnswer= answerObj.find(".zdh_right_answer");
                var rightAnswer= $.trim($(answerObj[1]).text());
                rightAnswer=rightAnswer=="正确"?"1":rightAnswer=="错误"?"0":rightAnswer;

                //console.log($(`#tm${i+1} input[value='${rightAnswer}']`));

                //移除选择
                $(`#tm${i+1} input`).removeAttr("checked");

                //针对答案有|分割的
                var rightAnswers = rightAnswer.split('|');
                $.each(rightAnswers,function(_,d){
                  $(`#tm${i+1} input[value='${d}']`).prop('checked',true);
                })

                //针对没有|分割的
                if(rightAnswer.length>1 && rightAnswers.length<=1){
                    for(var j=0;j<rightAnswer.length;j++)
                    {
                        $(`#tm${i+1} input[value='${rightAnswer[j]}']`).prop('checked',true);
                    }
                }
                //console.log($(answerObj[1]).text());
            });
    }

    //获取答案字符串
    function getAnsersStr(htmlStr)
    {
        var reg = /<span class=\"zdh_right_answer\" >正确答案：<\/span><span>(.*?)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<\/span>/g;
        var resultStr="";

        var index=1;
        while (true)
        {
            var result = reg.exec(htmlStr);

            if (result == null) {
                break;
            }

            var anser = index + "=" + result[1];
            resultStr += anser + ", ";

            index++;
        }

        //console.log(resultStr);
        return resultStr;
    }

    //获取url参数
    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

})();