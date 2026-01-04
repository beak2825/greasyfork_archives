// ==UserScript==
// @name         优学院看视频（新）
// @namespace    https://greasyfork.org/zh-CN/scripts/382033
// @version      2020.09.15
// @description  可用来看优学院视频而不用手动点击
// @author       Brush-JIM
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
// @supportURL   https://greasyfork.org/zh-CN/scripts/382033
// @require      https://greasyfork.org/scripts/394494-优学院答题/code/优学院答题.js
// @downloadURL https://update.greasyfork.org/scripts/382033/%E4%BC%98%E5%AD%A6%E9%99%A2%E7%9C%8B%E8%A7%86%E9%A2%91%EF%BC%88%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/382033/%E4%BC%98%E5%AD%A6%E9%99%A2%E7%9C%8B%E8%A7%86%E9%A2%91%EF%BC%88%E6%96%B0%EF%BC%89.meta.js
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
    function save_set(){gm_set('speed',window.speed);gm_set('muted',window.muted);gm_set('auto_exit',window.auto_exit);gm_set('auto_answer',window.auto_answer);};
    function get_ele_set(){window.speed=$('input[id="speed"]')[0].value;window.muted=$('input[id="video_muted"]')[0].checked;window.auto_exit=$('input[id="exit"]')[0].checked;window.auto_answer=$('input[id="auto_answer"]')[0].checked};
    function set_ele(){$('input[id="speed"]')[0].value=window.speed;$('input[id="video_muted"]')[0].checked=window.muted;$('input[id="exit"]')[0].checked=window.auto_exit;$('input[id="auto_answer"]')[0].checked=window.auto_answer;}
    gm_get('speed').then((speed)=>{
        gm_get('muted').then((muted)=>{
            gm_get('auto_exit').then((auto_exit)=>{
                gm_get( 'auto_answer' ).then((auto_answer)=>{
                    if(speed==undefined){speed=1}
                if(muted==undefined){muted=false}
                if(auto_exit==undefined){auto_exit=true}
                if(auto_answer==undefined){auto_answer=false}
                window.speed=speed;window.muted=muted;window.auto_exit=auto_exit;window.auto_answer=auto_answer;save_set();
                $(unsafeWindow.document).ready(function(){
                    add_ele();
                    unsafeWindow.document.body.addEventListener('DOMSubtreeModified',function(){unsafeWindow.$(unsafeWindow).off('beforeunload')} , false);
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
                            setTimeout(learning_class,2000)
                        }
                    }
                }
                else{
                    var data = new Array();
                    var all_finsh=false;
                    for (let i = 0;i < $('mediaelementwrapper video:first-child').length;i++)
                    {
                        data[i] = new Array();
                        data[i]['video'] = $('mediaelementwrapper video:first-child')[i];
                        data[i]['video'].onwaiting=(event)=>{data[i]['onwaiting']=true}
                        data[i]['state']=false;
                        data[i]['ele_tips']=false;
                        data[i]['onwaiting']=false;
                        data[i]['seek'] = 0;
                    }
                    function watch_video(){
                        if(all_finsh==true){
                            if(learning_state==true){
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
                                    setTimeout(learning_class,2000)
                                },2000)
                            }
                        }
                        else
                        {
                            var counts=0;
                            for(let count=0;count<$('.video-bottom span:first-child').length;count++){
                                let data_bind = $('.video-bottom span:first-child')[count].getAttribute('data-bind');
                                if (data_bind == 'text: $root.i18nMessageText().finished')
                                {
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
                                    counts++;
                                }
                            }
                            var all=true
                            for(let j=0;j<data.length;j++){
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
                                    if(data[j]['seek'] === data[j]['video'].currentTime){
                                        data[j]['video'].currentTime = data[j]['video'].currentTime - 3;
                                    }
                                    data[j]['seek'] = data[j]['video'].currentTime;
                                    break;
                                }
                                else if(data[j]['ele_tips']==true && data[j]['state']==false){
                                    all=false
                                }
                            }
                            if(all==true){all_finsh=true}
                            setTimeout(watch_video,2000)
                        }
                    }
                    watch_video();
                }
            }
            learning_class()
        }else{
            learning_state=false;
            document.querySelector('button[id="startstop"]').innerHTML = '开始学习';
        }}
    function ctrl_mune(){
        if(ctrl_state==false){
            ctrl_state=true;
            $('div[id="set-mune"]').attr('style','position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px;');
            $('span[id="set-auto"]')[0].innerHTML = '保存<br />&<br />隐藏';
        }
        else{
            ctrl_state=false;
            $('div[id="set-mune"]').attr('style','position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px; display: none;');
            $('span[id="set-auto"]')[0].innerHTML = '设置<br />&<br />开关'
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
        e_.setAttribute("style", "position: fixed;height: 300px;bottom: 10%;z-index: 9999;right: 70px; display: none;");e_.setAttribute("id", "set-mune");e_.innerHTML = '<div style="display: block;overflow: hidden;height: 300px;width: 300px;border: 1px solid rgb(233, 234, 236);background-color: rgb(255, 255, 255);"><div style="display: block; border-bottom: 1px solid rgb(230, 230, 230); height: 35px; line-height: 35px; margin: 0px; padding: 0px; overflow: hidden;"><span style="float: left;display: inline;padding-left: 8px;font: 700 14px/35px SimSun;">设置 & 开关</span></div><div style="display: block; position: absolute; top: 36px; width: 100%; height: calc(100% - 36px);"><div style="height: 100%; overflow: auto; padding: 0px 12px; margin: 0px;"><div><label style="display: inline;" title="调速">现在倍速：<input id="speed" type="number" min="1" max="10"></label></div><div><label style="display: inline;" title="静音"><input id="video_muted" type="checkbox">静音</label></div><div style="display: none"><label style="display: inline;" title="答题"><input id="auto_answer" type="checkbox">启用答题功能</label></div><div><label style="display: inline;" title="退出"><input id="exit" type="checkbox">完成后返回课程目录</label></div><div><label style="display: inline;" title="开始/停止"><button id="startstop">开始</button></label></div><div><font color="red"><h1>特殊更新</h1>此脚本为应急脚本，只能刷视频，不能答题！！！并且可能不作长期维护</font><br>原因：向另一个脚本提交更新后，作者暂时没有消息，所以暂时更新该脚本用于应急</div></div></div></div>';document.querySelector('body').appendChild(e_);
        set_ele();
        $('#set-auto').click(ctrl_mune);
        $('#startstop').click(learning);
    }
})();