// ==UserScript==
// @name         优学院全能脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/393233-优学院全能脚本
// @version      0.66
// @description  优学院全能测试脚本
// @author       Conastin
// @match        https://ua.ulearning.cn/learnCourse/learnCourse.html?*
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
// @supportURL   https://greasyfork.org/zh-CN/scripts/393233-优学院全能脚本
// @downloadURL https://update.greasyfork.org/scripts/393233/%E4%BC%98%E5%AD%A6%E9%99%A2%E5%85%A8%E8%83%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/393233/%E4%BC%98%E5%AD%A6%E9%99%A2%E5%85%A8%E8%83%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ctrl_state=false;
    var learning_state=false;
    unsafeWindow.localStorage.removeItem('failureRecord');
    try{unsafeWindow.document.__defineGetter__('hidden',function(){return false})}catch(e){Object.defineProperty(unsafeWindow.document,'hidden',{get:function(){return false}})};
    try{unsafeWindow.document.__defineGetter__('visibilityState',function(){return 'visible'})}catch(e){Object.defineProperty(unsafeWindow.document,'visibilityState',{get:function(){return 'visible'}})};
    function gm_get(name,defaultValue){if(typeof GM_getValue==='function'){return new Promise((resolve,reject)=>{resolve(GM_getValue(name,defaultValue))})}else{return GM.getValue(name,defaultValue)}};
    function gm_set(name,defaultValue){if(typeof GM_setValue==='function'){GM_setValue(name,defaultValue)}else{GM.setValue(name,defaultValue)}};
    function gm_xml(obj){if(typeof GM_xmlhttpRequest==='fcuntion'){GM_xmlhttpRequest(obj)}else{GM.xmlhttpRequest(obj)}};
    function save_set(){gm_set('speed',window.speed);gm_set('muted',window.muted);gm_set('auto_do',window.auto_do);gm_set('auto_exit',window.auto_exit)};
    function get_ele_set(){window.speed=$('input[id="speed"]')[0].value;window.muted=$('input[id="video_muted"]')[0].checked;window.auto_exit=$('input[id="exit"]')[0].checked};
    function set_ele(){$('input[id="speed"]')[0].value=window.speed;$('input[id="video_muted"]')[0].checked=window.muted;$('input[id="auto_do"]')[0].checked=window.auto_do;$('input[id="exit"]')[0].checked=window.auto_exit;}
    gm_get('speed').then((speed)=>{
        gm_get('muted').then((muted)=>{
            gm_get('auto_do').then((auto_do)=>{
                gm_get('auto_exit').then((auto_exit)=>{
                    if(speed==undefined){speed=5}
                    if(muted==undefined){muted=true}
                    if(auto_do==undefined){auto_do=true}
                    if(auto_exit==undefined){auto_exit=true}
                    window.speed=speed;window.muted=muted;window.auto_do=auto_do;window.auto_exit=auto_exit;save_set();
                    $(unsafeWindow.document).ready(function(){
                        unsafeWindow.document.body.addEventListener('DOMSubtreeModified',function(){unsafeWindow.$(unsafeWindow).off('beforeunload')} , false);
                        add_ele();
                    });
                })
            })
        })
    })
    function learning(){
        if(learning_state==false){
            learning_state=true;
            document.querySelector('button[id="startstop"]').innerHTML = '停止学习';
            var learning_class=function(){
                if(document.getElementsByClassName('modal-backdrop fade in')[0]!=null){
                    var cl_fade=false;
                    if(document.querySelector("[data-bind='text: $root.i18nMsgText().gotIt']")!=null){document.querySelector("[data-bind='text: $root.i18nMsgText().gotIt']").click();cl_fade=true}
                    if(document.querySelector("[data-bind='text: $root.i18nMsgText().confirmLeave']")!=null){
                        document.querySelector("[data-bind='text: $root.i18nMsgText().confirmLeave']").click();cl_fade=true
                    }
                    if(document.querySelector("[data-bind='text: i18nMessageText().nextChapter']")!=null){
                        document.querySelector("[data-bind='text: i18nMessageText().nextChapter']").click();cl_fade=true
                    }
                    if(cl_fade==false){
                        alert('未知情况，请反馈问题。');
                        document.querySelector('button[id="startstop"]').innerHTML = '开始学习';
                        return false
                    }
                    else{
                        if(learning_state==true){
                            setTimeout(learning_class,200)
                        }
                    }
                }
                else{
                    var data = new Array();
                    var data_exc = new Array();
                    var all_finsh=false;
                    for (let i = 0;i < $('video').length;i++)
                    {
                        data[i] = new Array();
                        data[i]['video'] = document.querySelectorAll('video')[i];
                        data[i]['video'].onwaiting=(event)=>{data[i]['onwaiting']=true}
                        data[i]['state']=false;
                        data[i]['ele_tips']=false;
                        data[i]['onwaiting']=false;
                    }
                    function watch_video(){
                        if(all_finsh==true){
                            //所有视频看完或停止观看
                            console.log("all_finsh");
                            if(document.querySelector("[data-bind='text: $root.i18nMessageText().exercise']").innerHTML=="练习"){
                                function showAnswer() {
                                    var sqList = [];
                                    var re = [];
                                    $('.question-wrapper').each(function (k, v) {
                                        var id = $(v).attr('id');
                                        sqList.push(id.replace('question', ''));
                                    });
                                    console.log(sqList);
                                    $(sqList).each(function (k, id) {
                                        $.ajax({
                                            async: false,
                                            type: "get",
                                            url: 'https://api.ulearning.cn/questionAnswer/' + id,
                                            datatype: 'json',
                                            success: function (result) {
                                                re.push(result.correctAnswerList);
                                            }
                                        });
                                    });
                                    console.log(re);
                                    var an = [];
                                    $(re).each(function (k, v) {
                                        an.push(v.join(','));
                                    });
                                    var t = $('.question-wrapper').find('.question-title-html');
                                    t.each(function (k, v) {
                                        console.log(v);
                                        $(v).after('<span style="color:red;">答案：' + an.shift() + '</span>');
                                    });
                                }
                                showAnswer();
                            }
                            if(learning_state==true){
                                console.log("learning_state");
                                setTimeout( function () {
                                    unsafeWindow.koLearnCourseViewModel.goNextPage();
                                    for (var k = 0; k < document.querySelectorAll("[data-bind='text: $root.nextPageName()']").length; ++k) {
                                        if (document.querySelectorAll("[data-bind='text: $root.nextPageName()']")[k].innerHTML == "没有了") {
                                            if (window.auto_exit == true)
                                            {
                                                unsafeWindow.koLearnCourseViewModel.goBack();
                                            }
                                            else
                                            {
                                                document.querySelector('button[id="startstop"]').innerHTML = '学习完成（该按钮已不可点击）';
                                                document.querySelector('button[id="startstop"]').disabled = true;
                                            }
                                            return;
                                        }
                                    }
                                    setTimeout(learning_class,200)
                                },200)
                            }
                        }
                        else
                        {
                            var counts=0;
                            for(let count=0;count<document.querySelectorAll("div[class='video-info'] span").length;count++){
                                let data_bind = document.querySelectorAll("div[class='video-info'] span")[count].getAttribute('data-bind');
                                if (data_bind == 'text: $root.i18nMessageText().finished'){
                                    console.log("//已看完");
                                    data[counts]['ele_tips']=true
                                    if(data[counts]['onwaiting']==false){
                                        if(data[counts]['video'].paused==true){
                                            data[counts]['state']=true
                                        }
                                    }else{
                                        data[counts]['onwaiting']=false
                                    }
                                    counts++;
                                }
                                else if (data_bind == 'text: $root.i18nMessageText().viewed' || data_bind == 'text: $root.i18nMessageText().unviewed'){
                                    console.log("//已观看或未观看");
                                    //已观看或未观看
                                    counts++;
                                }
                            }
                            var all=true
                            for(let j=0;j<data.length;j++){
                                console.log("进入all=true for");
                                if(data[j]['ele_tips']==false && data[j]['state']==false){
                                    all=false;
                                    if(data[j]['video'].paused==true){
                                        data[j]['video'].play();
                                        if(data[j]['video'].muted!=window.muted){
                                            data[j]['video'].muted = window.muted;
                                        }
                                        if(data[j]['video'].playbackRate!=window.speed){
                                            data[j]['video'].playbackRate = window.speed;
                                        }
                                    }
                                    else{
                                        if(data[j]['video'].muted!=window.muted){
                                            data[j]['video'].muted = window.muted;
                                        }
                                        if(data[j]['video'].playbackRate!=window.speed){
                                            data[j]['video'].playbackRate = window.speed;
                                        }
                                    }
                                    break;
                                }
                                else if(data[j]['ele_tips']==true && data[j]['state']==false){
                                    all=false
                                }
                            }
                            if(all==true){all_finsh=true}
                            setTimeout(watch_video,200)
                        }
                    }
                    watch_video();
                }
            }
            learning_class();
        }else{
            learning_state=false;
            document.querySelector('button[id="startstop"]').innerHTML = '开始学习';
        }
    }
    function ctrl_mune(){
        if(ctrl_state==false){
            ctrl_state=true;
            $('div[id="set-mune"]').attr('style','position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px;');
            $('span[id="set-auto"]')[0].innerHTML = '保存<br />并<br />隐藏';
        }
        else{
            ctrl_state=false;
            $('div[id="set-mune"]').attr('style','position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px; display: none;');
            $('span[id="set-auto"]')[0].innerHTML = '设置<br />及<br />开关'
        }
        get_ele_set()
        save_set()
    }
    function add_ele(){
        try{
            document.getElementById("statModal").parentNode.removeChild(document.getElementById("statModal"));
            document.getElementsByClassName("user-guide")[0].parentNode.removeChild(document.getElementsByClassName("user-guide")[0]);
        }
        catch(e){;}
        var e=document.createElement('div');
        e.setAttribute("style", "width: 60px;height: 74px;overflow: hidden;position: fixed;right: 10px;bottom: 10%;padding: 4px;background-color: #06a9f4;z-index: 9999;border: 1px solid rgb(233, 234, 236);");e.setAttribute("id","set-auto");e.innerHTML='<div style="cursor: pointer; text-align: center; padding: 0px;"><span id="set-auto" style="font-size: 12px;line-height: 16px;color: rgb(255, 255, 255);">设置<br />&<br />开关</span></div>';document.querySelector('body').appendChild(e);
        var e_=document.createElement('div');
        e_.setAttribute("style", "position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px; display: none;");e_.setAttribute("id", "set-mune");e_.innerHTML = '<div style="display: block;overflow: hidden;height: 300px;width: 300px;border: 1px solid rgb(233, 234, 236);background-color: rgb(255, 255, 255);"><div style="display: block; border-bottom: 1px solid rgb(230, 230, 230); height: 35px; line-height: 35px; margin: 0px; padding: 0px; overflow: hidden;"><span style="float: left;display: inline;padding-left: 8px;font: 700 14px/35px SimSun;">设置 & 开关</span></div><div style="display: block; position: absolute; top: 36px; width: 100%; height: calc(100% - 36px);"><div style="height: 100%; overflow: auto; padding: 0px 12px; margin: 0px;"><div><label style="display: inline;" title="调速">现在倍速：<input id="speed" type="number" min="0.5" max="5"></label></div><div><label style="display: inline;" title="静音"><input id="video_muted" type="checkbox">静音</label></div><div><label style="display: inline;" title="自动答题"><input id="auto_do" type="checkbox">自动答题</label></div><div><label style="display: inline;" title="退出"><input id="exit" type="checkbox">完成后返回课程目录</label></div><div><label style="display: inline;" title="开始/停止"><button id="startstop">开始学习</button></label></div></div></div></div>';document.querySelector('body').appendChild(e_);
        set_ele();
        $('#set-auto').click(ctrl_mune);
        $('#startstop').click(learning)
    }
})();