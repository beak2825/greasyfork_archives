// ==UserScript==
// @name         优学院2
// @version      1.0.2
// @description  可用来看优学院视频而不用手动点击, 感谢原作者 @Brush-JIM
// @author       ycx, cara0672
// @match        */umooc/user/study.do*
// @match        */learnCourse/learnCourse.html*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlhttpRequest
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         https://www.ulearning.cn/ulearning/favicon.ico
// @namespace https://greasyfork.org/users/105582
// @downloadURL https://update.greasyfork.org/scripts/405770/%E4%BC%98%E5%AD%A6%E9%99%A22.user.js
// @updateURL https://update.greasyfork.org/scripts/405770/%E4%BC%98%E5%AD%A6%E9%99%A22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.localStorage.removeItem('failureRecord');
    try {
        unsafeWindow.document.__defineGetter__( 'hidden' , function() {
            return false;
        }
                                              )
    }
    catch (error) {
        Object.defineProperty( unsafeWindow.document , 'hidden' , { get:function() { return false; } } );
    }
    try {
        unsafeWindow.document.__defineGetter__( 'visibilityState' , function() {
            return 'visible';
        }
                                              )
    }
    catch (error) {
        Object.defineProperty( unsafeWindow.document, 'visibilityState' , { get:function() { return 'visible'; } } );
    }
    /* ==== 载入答题脚本 - 来自 https://github.com/hsmustard/youxueyuan ==== */
    var GM_Head = document.getElementsByTagName('head')[0] || document.documentElement,
        GM_JQ = document.createElement('script');
    //GM_JQ.src = 'https://hsmustard.github.io/youxueyuan/yxy.min.js';
    //GM_JQ.type = 'text/javascript';
    GM_JQ.innerHTML = 'function showAnswer(){ var pageId = koLearnCourseViewModel.currentPage().id(); var sqList = []; var re = []; $(\'.question-wrapper\').each(function(k,v){ var id = $(v).attr(\'id\'); sqList.push(id.replace(\'question\',\'\')); }); $(sqList).each(function(k, id) { $.ajax({ async: false, type : "get", url : \'https://api.ulearning.cn/questionAnswer/\' + id + \'?parentId=\' + pageId, datatype : \'json\', success : function(result) { re.push(result.correctAnswerList); } }); }); var an = []; $(re).each(function(k,v){ an.push(v.join(\',\')); }); var t = $(\'.question-wrapper\').find(\'.question-title-html\'); t.each(function(k,v){ $(v).after(\'<span style="color:red;">答案：\'+an.shift()+\'</span>\'); }); }';
    GM_Head.insertBefore(GM_JQ, GM_Head.firstChild);
    /* ============================================= */
    function gm_get( name , defaultValue ) {
        if ( typeof GM_getValue === 'function' ) {
            return new Promise ( ( resolve , reject ) => {
                resolve( GM_getValue( name , defaultValue ) );
            } )
        }
        else {
            return GM.getValue( name , defaultValue );
        }
    }
    function gm_set( name , defaultValue ) {
        if ( typeof GM_setValue === 'function' ) {
            GM_setValue( name , defaultValue );
        }
        else {
            GM.setValue( name ,defaultValue );
        }
    }
    function gm_xml ( obj ) {
        if ( typeof GM_xmlhttpRequest === "function" ) {
            GM_xmlhttpRequest( obj );
        }
        else {
            GM.xmlhttpRequest( obj );
        }
    }

    function auto_answer(){
        var submit_answer_button = $('[data-bind="text: $root.i18nMessageText().submit, click: submitQuiz"]')[0];

        if (!submit_answer_button || submit_answer_button.innerHTML !== "提交"){
            return 0;
        }else{
            var pageId = koLearnCourseViewModel.currentPage().id();
            var answer_no = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7, 'true': 0, 'false': 1};
            var question =  $('.question-wrapper.show-answer');
            var question_choice_list = [];
            var answer_list = [];

            for (var i = 0; i < question.length; i++) {
                //获取题目选项
                if ($('#' + question[i].id).find(".checking-type").length !== 0){
                    question_choice_list.push($('#' + question[i].id).find(".choice-btn"));
                }else{
                    question_choice_list.push($('#' + question[i].id).find(".choice-item"));
                }
                //获取题目答案
                $.ajax({
                    async: false,
                    type : "get",
                    url : 'https://api.ulearning.cn/questionAnswer/' + question[i].id.replace('question', '') + '?parentId=' + pageId,
                    datatype : 'json',
                    success : function(result) {
                        answer_list.push(result.correctAnswerList);
                    }
                });
            }

            for(var j = 0; j < answer_list.length; j++) {
                for(var k = 0; k < answer_list[j].length; k++){
                    //点击正确答案
                    question_choice_list[j][answer_no[answer_list[j][k]]].click();
                }
            }
            //点击提交按钮
            submit_answer_button.click();
            return 1;
        }

    }

    $(unsafeWindow.document).ready(
        function () {
            //删除统计元素
            document.getElementById("statModal").parentNode.removeChild(document.getElementById("statModal"));
            //删除指导元素
            document.getElementsByClassName("user-guide")[0].parentNode.removeChild(document.getElementsByClassName("user-guide")[0]);
            //侧边栏
            var cbl = document.createElement("div");
            cbl.setAttribute("style", "width: 60px;height: 74px;overflow: hidden;position: fixed;right: 10px;bottom: 10%;padding: 4px;background-color: #06a9f4;z-index: 9999;border: 1px solid rgb(233, 234, 236);");
            //cbl.setAttribute('style',"display:table-cell;*display:inline-block;*float:left;width:60px;height:70px;vertical-align:middle;border:1px solid #e3e3e9;margin:0;background-color:#fff;");
            cbl.setAttribute("id","set-auto");
            cbl.innerHTML='<div style="cursor: pointer; text-align: center; padding: 0px;"><span id="set-auto" style="font-size: 12px;line-height: 16px;color: rgb(255, 255, 255);">设置<br />&<br />开关</span></div>';
            document.querySelector('body').appendChild(cbl);
            var xfk = document.createElement('div');
            xfk.setAttribute("style", "position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px; display: none;");
            xfk.setAttribute("id", "set-mune-hide");
            xfk.innerHTML = '<div style="display: block;overflow: hidden;height: 300px;width: 300px;border: 1px solid rgb(233, 234, 236);background-color: rgb(255, 255, 255);"><div style="display: block; border-bottom: 1px solid rgb(230, 230, 230); height: 35px; line-height: 35px; margin: 0px; padding: 0px; overflow: hidden;"><span style="float: left;display: inline;padding-left: 8px;font: 700 14px/35px SimSun;">设置 & 开关</span></div><div style="display: block; position: absolute; top: 36px; width: 100%; height: calc(100% - 36px);"><div style="height: 100%; overflow: auto; padding: 0px 12px; margin: 0px;"><div><label style="display: inline;" title="调速">现在倍速：<input id="speed" type="text"></label></div><div><label style="display: inline;" title="静音"><input id="video_muted" type="checkbox">静音</label></div><div><label style="display: inline;" title="退出"><input id="exit" type="checkbox">完成后返回课程目录</label></div><div><label style="display: inline;" title="开始/停止"><button id="startstop">开始学习</button></label> <label><button onclick="showAnswer();">显示答案</button></label></div>——————————<br />公告（Greasemonkey可能看不到）：<br /><span id="trips"></span></div></div></div>';
            document.querySelector('body').appendChild(xfk);
            unsafeWindow.document.body.addEventListener('DOMSubtreeModified',function(){unsafeWindow.$(unsafeWindow).off('beforeunload')} , false);
            gm_get( 'speed' ).then( ( speed ) => {
                gm_get( 'muted' ).then( ( muted ) => {
                    gm_get( 'auto-exit' ).then( ( auto_exit ) => {
                        if ( speed === undefined ) {
                            $( 'input[id="speed"]' )[0].value = 1;
                            speed = 1;
                        }
                        else {
                            $('input[id="speed"]')[0].value = speed;
                        }
                        if ( muted === undefined ) {
                            $('input[id="video_muted"]')[0].checked = false;
                            muted = false;
                        }
                        else {
                            $('input[id="video_muted"]')[0].checked = muted;
                        }
                        if ( auto_exit === undefined ) {
                            $('input[id="exit"]')[0].checked = true;
                            auto_exit = true;
                        }
                        else {
                            $('input[id="exit"]')[0].checked = auto_exit;
                        }
                        $("#set-auto").click(
                            function()
                            {
                                if ($('span[id="set-auto"]')[0].innerText == '设置\n&\n开关')
                                {
                                    $('div[id="set-mune-hide"]').attr('style','position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px;');
                                    $('div[id="set-mune-hide"]').attr('id','set-mune-unhide');
                                    $('span[id="set-auto"]')[0].innerHTML = '保存<br />&<br />隐藏';
                                }
                                else
                                {
                                    $('div[id="set-mune-unhide"]').attr('style','position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px; display: none;');
                                    $('div[id="set-mune-unhide"]').attr('id','set-mune-hide');
                                    $('span[id="set-auto"]')[0].innerHTML = '设置<br />&<br />开关';
                                    gm_set( 'speed' , $('input[id="speed"]')[0].value );
                                    gm_set( 'muted' , $('input[id="video_muted"]')[0].checked );
                                    gm_set( 'auto-exit' , $('input[id="exit"]')[0].checked );
                                }
                            }
                        )
                        $("#startstop").click(
                            function()
                            {
                                gm_set( 'speed' , $('input[id="speed"]')[0].value );
                                gm_set( 'muted' , $('input[id="video_muted"]')[0].checked );
                                gm_set( 'auto-exit' , $('input[id="exit"]')[0].checked );
                                if ($('button[id="startstop"]')[0].innerHTML == '开始学习')
                                {
                                    var watch_class = function(){
                                        gm_get( 'speed' ).then( ( speed ) => {
                                            gm_get( 'muted' ).then( ( muted ) => {
                                                gm_get( 'auto-exit' ).then( ( auto_exit ) => {
                                                    if (document.getElementsByClassName('modal-backdrop fade in')[0] != null) {
                                                        console.log('提示框');
                                                        if (document.querySelector("[data-bind='text: $root.i18nMsgText().gotIt']") != null) {
                                                            console.log('视频提示');
                                                            document.querySelector("[data-bind='text: $root.i18nMsgText().gotIt']").click();
                                                        }
                                                        else if (document.querySelector("[data-bind='text: $root.i18nMsgText().confirmLeave']") != null) {
                                                            console.log('未完成确认');
                                                            document.querySelector("[data-bind='text: $root.i18nMsgText().confirmLeave']").click();
                                                        }
                                                        else if (document.querySelector("[data-bind='text: i18nMessageText().nextChapter']") != null )
                                                        {
                                                            console.log('章节统计');
                                                            document.querySelector("[data-bind='text: i18nMessageText().nextChapter']").click();
                                                        }
                                                        else {
                                                            alert('未知情况，暂无应对方案，请将本页面截屏，返回给作者。');
                                                            document.querySelector('button[id="startstop"]').innerHTML = '开始学习';
                                                            return (false);
                                                        }
                                                        setTimeout(watch_class,2000);
                                                    }
                                                    else
                                                    {
                                                        var data = new Array();
                                                        for (var i = 0;i < $('video').length;i++)
                                                        {
                                                            data[i] = new Array();
                                                            data[i]["video"] = document.querySelectorAll('video')[i];
                                                        }
                                                        var counts = 0;
                                                        for (var count = 0;count < document.querySelectorAll("div[class='video-info'] span").length;count++)
                                                        {
                                                            var data_bind = document.querySelectorAll("div[class='video-info'] span")[count].getAttribute('data-bind');
                                                            if (data_bind == 'text: $root.i18nMessageText().finished')
                                                            {
                                                                data[counts]['s'] = true;
                                                                counts++;
                                                                console.log(true);
                                                            }
                                                            else if (data_bind == 'text: $root.i18nMessageText().viewed' || data_bind == 'text: $root.i18nMessageText().unviewed')
                                                            {
                                                                data[counts]['s'] = false;
                                                                counts++;
                                                                console.log(false);
                                                            }
                                                        }
                                                        var all = true
                                                        for (var j = 0;data.length > j;j++)
                                                        {
                                                            if (data[j]['s'] == false)
                                                            {
                                                                all = false;
                                                                if (data[j]['video'].paused == true)
                                                                {
                                                                    data[j]['video'].play();
                                                                    data[j]['video'].muted = muted;
                                                                    data[j]['video'].playbackRate = speed;
                                                                    data[j]['video'].muted = muted;
                                                                }
                                                                else
                                                                {
                                                                    data[j]['video'].muted = muted;
                                                                    data[j]['video'].playbackRate = speed;
                                                                    data[j]['video'].muted = muted;
                                                                }
                                                                break;
                                                            }
                                                        }
                                                        if (all == true)
                                                        {
                                                            setTimeout( function () {
                                                                auto_answer();
                                                                console.log('下一页');
                                                                unsafeWindow.koLearnCourseViewModel.goNextPage();
                                                                for (var k = 0; k < document.querySelectorAll("[data-bind='text: $root.nextPageName()']").length; ++k) {
                                                                    console.log(document.querySelectorAll("[data-bind='text: $root.nextPageName()']")[k].innerHTML);
                                                                    if (document.querySelectorAll("[data-bind='text: $root.nextPageName()']")[k].innerHTML == "没有了") {
                                                                        if (auto_exit == true)
                                                                        {
                                                                            unsafeWindow.koLearnCourseViewModel.goBack();
                                                                        }
                                                                        else
                                                                        {
                                                                            document.querySelector('button[id="startstop"]').innerHTML = '学习完成（该按钮已不可点击）';
                                                                            document.querySelector('button[id="startstop"]').disabled = true;
                                                                        }
                                                                        return (true);
                                                                    };
                                                                };
                                                                if ( document.querySelector('button[id="startstop"]').innerHTML == '停止学习' ) {
                                                                    setTimeout(watch_class,2000);
                                                                }
                                                            } , 1000 )
                                                        }
                                                        else
                                                        {
                                                            if ( document.querySelector('button[id="startstop"]').innerHTML == '停止学习' ) {
                                                                setTimeout(watch_class,2000);
                                                            }
                                                        }
                                                    }
                                                } )
                                            } )
                                        } )
                                    }
                                    document.querySelector('button[id="startstop"]').innerHTML = '停止学习';
                                    watch_class();
                                }
                                else
                                {
                                    clearTimeout(unsafeWindow.watch_class_);
                                    document.querySelector('button[id="startstop"]').innerHTML = '开始学习';
                                }
                            }
                        );
                    } )
                } )
            } )
        }
    )
})();