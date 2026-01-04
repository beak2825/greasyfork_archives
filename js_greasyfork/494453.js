// ==UserScript==
// @name         国家开放大学
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  国家开放大学课程自动脚本
// @author       You
// @match        https://lms.ouchn.cn/course/*full-screen*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494453/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/494453/%E5%9B%BD%E5%AE%B6%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6.meta.js
// ==/UserScript==

let csscc = '.popup {\
position: fixed;\
top: 200px;\
right: 10px;\
transform: translate(-50%, -50%);\
width: 300px;\
padding: 0px;\
background-color: rgba(0,0,0,0.8);\
border-radius: 10px;\
box-shadow: 0px 3px 7px rgba(0,0,0,0.20), 0px 0px 20px rgba(255,255,255,0.10);\
font-family: Arial, sans-serif;\
font-size: 16px;\
z-index: 9999;\
background-image: linear-gradient(90deg, #75d6ff, #2b32b2);\
}' +
    '.popup h2 {\
margin: 0;\
padding-bottom: 10px;\
font-size: 28px;\
text-align: center;\
color: #FFFFFF;\
border-bottom: 1px solid #cccccc;\
}' +
    '.popup p {\
margin: 10px 0;\
line-height: 1;\
color: #333333;\
text-align: justify;\
}'

let move = ' <script type=\"text/javascript\">\ ' +
    'var rec = document.getElementById(\"rec\") \
var down = false;\
var dx = 0;\
var dy = 0;\
var sx = 0;\
var sy = 0;' +
    'document.onmousemove = function(e){\
if (down) {\
var ev = e || event;\
console.log(ev.clientY)\
rec.style.top = ev.clientY - (dy - sy) + \'px\';\
rec.style.left = ev.clientX - (dx - sx) + \'px\';\
}\
}' +
    'rec.onmousedown = function(){\
dx = event.clientX;\
dy = event.clientY;\
sx = parseInt(rec.style.left);\
sy = parseInt(rec.style.top);\
if (!down) {\
down  = true;\
}\
}' +
    'document.onmouseup = function(){\
if (down) {\
down = false;\
}\
}' +
    '</script>'

const sleep = (timeout) => {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve();
        }, timeout)
    })
}

(function() {
    'use strict';
    let timer = '';

    jQuery(document).ready(function () {

        // 创建一个浮窗元素
        var div = document.createElement("div");
        div.setAttribute('id','rec');
        div.classList.add("popup");
        div.style = "position:absolute;left: 2200px;top: 400px;opacity: 0.8";
        div.innerHTML = "<ol style=\"list-style:none;padding:0px;width:300px;height:300px;overflow-y:auto\" id=\"logol\"></ol><style>" + csscc + "</style>";
        // 将浮窗添加到页面中
        document.body.appendChild(div);

        var rec = document.getElementById("rec")
        var down = false;
        var dx = 0;
        var dy = 0;
        var sx = 0;
        var sy = 0;
        document.onmousemove = function(e){
            if (down) {
                var ev = e || event;
                //console.log(ev.clientY)
                rec.style.top = ev.clientY - (dy - sy) + 'px';
                rec.style.left = ev.clientX - (dx - sx) + 'px';
            }
        }
        rec.onmousedown = function(){
            dx = event.clientX;
            dy = event.clientY;
            sx = parseInt(rec.style.left);
            sy = parseInt(rec.style.top);
            if (!down) {
                down  = true;
            }
        }
        document.onmouseup = function(){
            if (down) {
                down = false;
            }
        }

        timer = setInterval(function(){
            run_main();
        }, 6000 * 1);
    })

    function log_surface(text){
        var now = new Date();

        var year = now.getFullYear();
        var month = ('0' + (now.getMonth() + 1)).slice(-2);
        var day = ('0' + now.getDate()).slice(-2);
        var hours = ('0' + now.getHours()).slice(-2);
        var minutes = ('0' + now.getMinutes()).slice(-2);
        var seconds = ('0' + now.getSeconds()).slice(-2);

        var formattedTime = hours + ':' + minutes + ':' + seconds;

        var logOl=document.getElementById("logol");
        var li=document.createElement("li");
        li.innerHTML=formattedTime + ': ' + text;
        logOl.appendChild(li);
        logOl.scrollTop = logOl.scrollHeight;
    }

    function next_label(){
        try{
            document.getElementsByClassName('next-btn ivu-btn ivu-btn-default')[0].click()
        }catch(e){
            log_surface('下一节点击失败' + e);
        }
    }

    async function run_main(){
        clearInterval(timer);

        var class_select = document.getElementsByClassName('full-screen-mode-sidebar-menu-item active')[0].children[1].children[0].getAttribute('class');
        debugger
        switch(class_select){
            case 'font activity-type-icon font-syllabus-page':
                next_label();
                log_surface('正常页面，点击下一个');
                break
            case 'font activity-type-icon font-syllabus-forum':
                log_surface('讨论页面');
                var list_first = document.getElementsByClassName('forum-topic-list')[0].children[0].children[2].children;
                var title = '';
                var content = '';
                for(var i = 0;i < list_first.length;i++){
                    if(list_first[i].getAttribute('class').includes('title')){
                        title = list_first[i].textContent;
                    }
                    if(list_first[i].getAttribute('class').includes('content')){
                        content = list_first[i].textContent;
                    }
                }
                await sleep(1000);
                document.getElementsByClassName('ivu-btn ivu-btn-primary')[0].click();
                log_surface('点击发表帖子');
                await sleep(200);

                var t = document.getElementsByClassName('fields')[0].children[0].children[1];
                var evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', true, true);
                t.value=title;
                t.dispatchEvent(evt)
                log_surface('填充标题');
                await sleep(2000);
                document.getElementsByClassName('fields')[1].children[0].children[1].children[0].children[2].children[0].textContent = content;
                log_surface('填充内容');
                await sleep(2000);
                document.getElementsByClassName('button button-green medium')[document.getElementsByClassName('button button-green medium').length-1].click();
                log_surface('确定提交');
                await sleep(1000);
                log_surface('点击下一个');
                next_label();
                break
            case 'font activity-type-icon font-syllabus-online-video':
                log_surface('视频页面');
                //判断是否有视频
                try{
                    await sleep(2000);
                    var video_list = document.getElementsByClassName('vjs-tech');
                    await sleep(2000);
                    if(video_list.length > 0){
                        log_surface("开始尝试播放视频");

                        //点击播放按钮
                        document.getElementsByClassName('vjs-tech')[0].muted = true;
                        log_surface("静音");
                        await sleep(1000);
                        document.getElementsByClassName('mvp-toggle-play mvp-first-btn-margin')[0].click();
                        log_surface("开始播放");
                        await sleep(1000);
                        document.getElementsByClassName('vjs-tech')[0].playbackRate = 4.0;
                        var time_all_video = document.getElementsByClassName('vjs-tech')[0].duration;
                        while(1){
                            await sleep(2000);
                            document.addEventListener("fullscreenchange", function (event) {
                                event.stopPropagation();
                            }, true);
                            document.addEventListener("mozfullscreenchange", function (event) {
                                event.stopPropagation();
                            }, true);
                            document.addEventListener("pagehide", function (event) {
                                event.stopPropagation();
                            }, true);
                            document.addEventListener("pageshow", function (event) {
                                event.stopPropagation();
                            }, true);

                            document.addEventListener("visibilitychange", function (event) {
                                event.stopPropagation();
                            }, true);
                            document.addEventListener("-webkit-visibilitychange", function (event) {
                                event.stopPropagation();
                            }, true);
                            document.addEventListener("webkitvisibilitychange", function (event) {
                                event.stopPropagation();
                            }, true);
                            document.addEventListener("webkitfullscreenchange", function (event) {
                                event.stopPropagation();
                            }, true);
                            var time_now_video = document.getElementsByClassName('vjs-tech')[0].currentTime;

                            log_surface(time_now_video + '/' + time_all_video)

                            //document.getElementsByClassName('vjs-tech')[0].currentTime = time_all_video - 5;

                            if(time_now_video > time_all_video - 10){
                                log_surface('视频播放完成')
                                await sleep(8000);
                                log_surface('点击下一个');
                                next_label();

                                break;
                            }
                            var video_status = document.getElementsByClassName('vjs-tech')[0].paused;
                            var video_status_icon = document.getElementsByClassName('mvp-toggle-play mvp-first-btn-margin')[0].children[0].getAttribute('class');
                            //log_surface(video_status + '/' + video_status_icon)

                            if(video_status == true){
                                try{
                                    document.getElementsByClassName('vjs-tech')[0].muted = true;
                                    document.getElementsByTagName('video')[0].play();
                                    //document.getElementsByClassName('mvp-toggle-play mvp-first-btn-margin')[0].click();
                                }catch (e1){
                                    log_surface(e1);
                                }
                            }
                        }
                    }
                }catch(e){
                    log_surface(e)
                }
                break
            case 'font activity-type-icon font-syllabus-material':
                log_surface('附件页面');
                document.getElementsByClassName('ivu-table-row')[0].children[document.getElementsByClassName('ivu-table-row')[0].children.length-1].children[0].children[0].click();
                log_surface('查看附件');
                await sleep(2000);
                document.getElementsByClassName('right close')[2].children[0].click();
                log_surface('关闭附件');
                await sleep(2000);
                log_surface('点击下一个');
                next_label();
                break
            case 'font activity-type-icon font-syllabus-web-link':
                log_surface('链接页面');
                try{
                    var href_ = document.getElementsByClassName('button medium button-green open-link-button')[0].getAttribute('href');
                }catch(e){
                    log_surface('点击失败');
                }
                window.open(href_, "_blank");
                await sleep(2000);
                log_surface('点击下一个');
                next_label();
                await sleep(2000);
                break
            case 'font activity-type-icon font-syllabus-exam':
                log_surface('考试界面');
                await sleep(500);
                log_surface('点击下一个');
                next_label();
                await sleep(2000);
                break
            case 'font activity-type-icon font-syllabus-homework':
                log_surface('期末考试界面');
                await sleep(500);
                log_surface('点击下一个');
                next_label();
                await sleep(2000);
                break
            default:
                log_surface('未知界面');
                await sleep(500);
                log_surface('点击下一个');
                next_label();
                break
        }
        timer = setInterval(function(){
            run_main();
        }, 6000 * 1);
    }
})();