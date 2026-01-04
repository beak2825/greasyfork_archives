// ==UserScript==
// @name         雨课堂防老六神器
// @namespace    http://tampermonkey.net/
// @version      2024-11-20
// @description  用于在雨课堂下课后，在老师下一次开课且自己还未进入雨课堂签到时，直接跳转到雨课堂上课页面。使用方法：打开当前的课程详情页面（一般是 https://www.yuketang.cn/v2/web/studentLog/课程id），点击开始请求即可。当新开课且没进入时，会自动跳转到课程页面。（课程详情页面不能关）
// @author       soladuor
// @match        https://*.yuketang.cn/v2/web/studentLog/*
// @match        https://*.yuketang.cn/v2/web/index
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0I4REE0RUY4RjAwMTFFNzk3MThFMkYwOTUyRUJGMjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0I4REE0RjA4RjAwMTFFNzk3MThFMkYwOTUyRUJGMjAiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozQjhEQTRFRDhGMDAxMUU3OTcxOEUyRjA5NTJFQkYyMCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozQjhEQTRFRThGMDAxMUU3OTcxOEUyRjA5NTJFQkYyMCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkxZQwUAAAFKUExURWOe9P///3eq9a3M+Z7D+JS898/h/H6v9mag9Hqs9vj7/7XR+m2k9enx/dXl/KjJ+d/r/ZK798Ta+3Sp9Zm/+Ozz/qzL+f3+/32u9mmh9Hut9uPu/cfc+5i/+Gmi9Pb6/nWp9Xaq9ejx/f39/+71/nCm9f7///H2/vz9//X5/o24983g+/7+/5a++PP4/sXb++Hs/Wyj9Wqj9djn/IWz9nKo9ebv/dLj/K7M+Ze++Gih9Hir9pO897PP+r3W+nir9cbc++30/q/O+b7W+vr8//L3/o65993q/fn7/4m29+vz/meh9Gqi9Ii196PG+MHY++Lt/dro/Pb5/p3C+JC69/v9/2Wf9Hyu9vn8/2Wg9PT4/rTQ+qTH+anJ+cPa+2Sf9JW997zV+tPk/H+v9snd+/j6/pnA+LHO+evy/m+m9XKn9XSo9ZG798re+z70b3UAAAGuSURBVHja7JflbwJBEMV3gBY44HAtUKyCU3d3d3f3//9rd0lpuHLA7U3a1N6Xt5nJ/JJLbuURAMGkNxAVMuhNAgABi5GoltECREDMU4JATAQlE9HjAHpiwAFK43vi/ahS1JNraj2TSEmLTQAQUjBszjoWoaiZA0mDlbTUw+OHc76q3+vZ8MK7nLKAEepNstOByV6QSCMLaGSLyulHTwE+SjngbDYdB+AFpMS+lWJnUOsGWdUGjLUDzPewzjWAGsAW82HWiasD6Jg3lDo/CpCm7sUAbqm/YAAk69D6UYA3/WnA8kIEBQi0gVeHAZxSz32LveBivo0AmCcAYn4OALsXBsqPtJYTq5lwAAKXsQuD7KGqEFDSbwKECjY7F8B51VEO8GUA2qMcgCOAfSPmT5ymFevvuBf+AV8LeJAAbLRyzgWwSbdCxNHVv8sBSKy1yD9G87SZrANw53Wa6q/3HLSu1gDsiNY6AcX8PFT1amsONnQqjQGVgOagfYkjR3SzmeKzvY2tWkWXnzOJeDaTx8WF/Qbcd1FMqAk7yecKHbrQsQ8dPNHRFx2+sfH/VYABAJzvJscE8bzaAAAAAElFTkSuQmCC
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489733/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%98%B2%E8%80%81%E5%85%AD%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/489733/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%98%B2%E8%80%81%E5%85%AD%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定时器间隔时间（单位ms）
    let sleepTime = 1000 * 60 * 1

    // 获取课程id
    let url_split = window.location.href.split("/")
    let class_id= url_split[url_split.length-1].split("?")[0]
    console.log(class_id)

    // 记录次数
    let log = document.createElement("div")
    log.style.color = "red"
    log.style.float="left"
    log.innerHTML = `+++ 开启日志记录 | 定时器间隔时间 [ ${sleepTime/1000} s ] +++`
    // 请求次数
    let sendTimes = 0

    // 定时器id
    let sendTimer;
    // 开启定时器
    function startTimer(){
        //清除旧定时器
        clearInterval(sendTimer);
        // 执行一次代码
        getMessage()
        // 开启新定时器
        sendTimer = setInterval(() => {
            getMessage()
        }, sleepTime);
    }

    function getMessage(){
        log.innerHTML = `=== 请求次数 : [ ${++sendTimes} ] | 定时器间隔时间 [ ${sleepTime/1000} s ] ===`;
        let resp = {}
        GM_xmlhttpRequest({
            url:`https://www.yuketang.cn/v2/api/web/logs/learn/${class_id}?actype=14&page=0&offset=20&sort=-1`,
            method :"get",
            onload:function(xhr){
                console.log(xhr.responseText);
                resp=JSON.parse(xhr.responseText)
                console.log("JSON转为JS对象")
                console.log(resp)
                main(resp)
            }
        });
    }

    // 主要逻辑函数，如果上课了且没有签到则直接跳转到上课页面
    function main(resp){
        if (resp.errcode ===0){
            console.log("请求成功")
            const activitie = resp.data.activities[0]
            // attend_status 是否已签到
            // is_finished   是否已下课
            if(activitie.attend_status||activitie.is_finished){
                // 下课了 或者 签过到了 就不管了
            }else{
                // 没下课，也没签到，直接跳到上课页面
                /*
                GM_notification({
                    text: "快点回来签到",// 通知文字（除非设置了突出显示，否则为必填）
                    title:`雨课堂签到提示 == > ${activitie.title}`,// 通知的标题
                    //image : "",// 通知图像
                    highlight:true,// 一个布尔型标志，是否突出显示发送通知的选项卡（除非设置了文本，否则为必需）
                    silent: false,// 一个布尔值是否不播放声音
                    timeout: 60000,// 通知将被隐藏的时间（毫秒，0则禁用）
                    ondone : (byUser) => {
                        console.log('done user:', byUser);
                    },// 在通知关闭时（无论是由超时还是单击触发）或突出显示选项卡时调用
                    onclick :() => {
                        console.log('onclick');
                    },// 在用户单击通知时调用
                });
                */
                // document.querySelector(".activity__wrap").click()
                window.open(`https://www.yuketang.cn/lesson/fullscreen/v3/${activitie.courseware_id}`,"_blank")
            }
        } else{
            console.log("请求失败")
            log.innerHTML = `===> 请求失败[${resp.errmsg}] === ` + log.innerHTML
        }
    }

    // 主功能按钮
    let btn = document.createElement("button")
    btn.style.float="left"
    btn.innerHTML = "开始请求"

    // 点击开始请求
    function startClick(){
        // 获取课程id
        url_split = window.location.href.split("/")
        class_id= url_split[url_split.length-1].split("?")[0]
        console.log(class_id)
        // 开始定时任务
        startTimer()
        // 按钮绑定 点击结束请求
        btn.innerHTML = "点击结束请求"
        btn.onclick = endClick
    }

    // 点击结束请求
    function endClick(){
        //清除定时器
        clearInterval(sendTimer);
        // 按钮绑定 点击结束请求
        btn.innerHTML = "开始请求"
        btn.onclick = startClick
    }

    // 按钮绑定初始化
    btn.onclick = startClick

    // 测试弹窗按钮
    let alertBtn = document.createElement("button")
    alertBtn.style.float="left"
    alertBtn.innerHTML = "测试弹窗按钮"
    alertBtn.onclick = function () {
        GM_notification({text: "快点回来签到"});
    };

    let timer = setInterval(() => {
        if (document.querySelector(".headerCard") !== null) {
            document.querySelector(".headerCard").append(btn);
            document.querySelector(".headerCard").append(log);
            //document.querySelector(".headerCard").append(alertBtn);
            // 找到了挂载点则清空当前定时器
            console.log("按钮已挂载")
            clearInterval(timer);
        }
    }, 1000);

    // Your code here...
})();