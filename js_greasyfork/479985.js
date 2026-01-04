// ==UserScript==
// @name            专技天下_Autoplay
// @description     自动开始播放，当前小节播放完自动切下一节，当前课程所有章节播放完自动切换下一个课程，疲劳提醒自动继续。
// @author          BN_Dou
// @version         3.2.0
// @namespace       http://tampermonkey.net/
// @match           https://greasyfork.org/zh-CN/users/883089-bndou
// @match           https://*.zgzjzj.com/*
// @match           https://*.zgzjzj.net/*
// @icon            https://www.zgzjzj.com/static/img/zjlogo.b408176.png
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @grant           GM_xmlhttpRequest
// @license         AGPL License
// @connect         bndou.top
// @downloadURL https://update.greasyfork.org/scripts/479985/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B_Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/479985/%E4%B8%93%E6%8A%80%E5%A4%A9%E4%B8%8B_Autoplay.meta.js
// ==/UserScript==
// 👇👇说明👇👇
// ❗❗❗使用前按照此入口进入
// ① 网页中找到自己头像的位置鼠标移过去
// ② 下拉菜单中找到观看记录
// ③ 从观看记录进课程视频
// ✅即可使用全自动
// ✅默认中间有观看记录的跳过，所以请不要随意切视频，避免造成进度丢失（如果丢失，解决办法就是从头到尾重新看）
// ⭕如需推送消息，请自行扫码订阅后配置其参数
// 👆👆说明👆👆
(function () {
    'use strict';

    // 1自购课 2观看记录
    var module;
    setInterval(function () {
        if(new URL(window.location.href).pathname.includes('/learncenter/play')){
            module = 1;
        } else if (new URL(window.location.href).pathname.includes('/recordPlay')){
            module = 2;
        } else {
            module = 0;
        }
    }, 1000);

    // ⭕wxpusher推送用户uid
    var uid = GM_getValue("uid", "");

    //添加菜单
    GM_registerMenuCommand('⭕wxpusher推送用户uid', addUid);
    function addUid(){
        uid = GM_getValue("uid", "");
        var input_uid = prompt("首次使用\n\n若要使用微信推送进度功能\n\n请把刚刚微信扫码订阅后返回的“uid”复制粘贴到下方输入框\n\n然后开始使用。");
        if (input_uid) {
            GM_setValue("uid", input_uid);
        }
        else {
            if (!uid){
                alert("未填写推送uid，不使用推送功能。\n若不想使用，请自行禁用脚本，以免每次访问页面都弹出该提示。");
                return;
            }
            else {
                var is_uid = prompt("检测到已存在推送uid\n\n若继续使用原有的uid推送，请直接点击“确定”。\n若不想使用，请直接点击“取消”。", uid);
                if (!is_uid){
                    GM_setValue("uid", "");
                }
                return;
            }
        }
    }
    GM_registerMenuCommand('⭕添加自购课', addPlans);
    async function addPlans(){
        const userInfo = await getInfoFromLocalStorage();
        const plans = await getPlanList(userInfo.token);
        // 过滤出 isPass为0 的ID
        GM_setValue("plans", plans.filter(item => item.isPass === 0).map(item => item.id));
        console.log("添加自购课成功！");
    }

    if (module != 0){
        // 页面video窗口加载完成后执行
        waitElement('video.vjs-tech', function () {
            // 删除logo
            $('div.weblogo').remove();
            // 删除首页
            $('a.index').remove();
            // 删除商城
            $('div.shopcar').remove();
            // 删除联系电话
            $('div.secondTel').remove();
            // 删除分享按钮
            $('div.m-new-share-box').remove();
            // 删除客服帮助悬浮框
            $('div.helpv').remove();
            // 删除评论区
            $('div.course-info-box').remove();
            // 删除推荐
            $('div.course-recommend').remove()
            // 删除页脚
            $('div.footer').remove();
            // 播放初始化
            // if (document.querySelector(".vjs-big-play-button")) {
            //    document.querySelector(".vjs-big-play-button").click();
            // }
            // 推送uid为空时，弹出扫码订阅
            if (!uid) {
                // wxpusher推送订阅二维码
                $("#app").prepend(
                    `<div id='subscription' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5);'>
                <div id='subscription_content' style=' display: flex; flex-direction: column; align-items: center; background-color: #AFEEEE; padding: 20px; border-radius: 10px;'>
                    <h1 style='color: red; font-size: 2em; margin-bottom: 20px;'>📢wxpusher推送订阅二维码📢</h1>
                    <br>
                    <span style='text-align: center; font-size: 1.5em;'>👇&nbsp;&nbsp;&nbsp;👇&nbsp;&nbsp;&nbsp;👇</span>
                    <a style='text-align: center;' href='https://wxpusher.zjiecode.com/api/qrcode/e61cgr6Ht4uXbWiqjaZFEocrMNNVK7u2xjrpBAJaOmSpiZYJ4JIgOl1VPhvgUegq.jpg' onclick="window.open(this.href, 'mozillaWindow', 'popup,width=400,height=400,');return false;">
                        <span style='color: Purple; text-align: center; font-size: 1.5em; display: block;'>点击跳转订阅<br>「专技天下学习进度」</span>
                    </a >
                    <span style='text-align: center; font-size: 1.5em;'>👆&nbsp;&nbsp;&nbsp;👆&nbsp;&nbsp;&nbsp;👆</span>
                    <br>
                    <span style='color: red; text-align: center; font-size: 1em;'>微信扫码订阅后请点击下方确认</span>
                    <br>
                    <br>
                    <button id='confirm' style=' padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.2em; '>我已确认</button>
                </div>
            </div>`
                );
                $('#confirm').on('click', function () {
                    $('#subscription').remove();
                    $('#subscription_content').remove();
                    addUid();
                });
            }
        });

        // 持续监控
        let ZJTX_AutoPlay = setInterval(function () {
            let playProgress;
            if (document.querySelector(".vjs-play-progress").getAttribute("style")) {
                // 获取视频播放进度
                playProgress = document.querySelector(".vjs-play-progress").getAttribute("style").substring(7);
            }

            $("video.vjs-tech").prop("muted", true);

            // 视频控制台"播放按钮"状态是否是亮起
            if (document.querySelector(".vjs-play-control").getAttribute("title") == "Play") {
                // 播放
                document.querySelector(".vjs-play-control").click();
            }

            // 视频播放进度是否到100%
            if (playProgress == "100%;") {
                if (module == 1) {
                    // 判断当前课程是否全部完成，否则点击切换下一小节
                    if (document.querySelector(".el-progress").getAttribute("aria-valuenow") == "100"){
                        let cid = new URL(window.location.href).searchParams.get('cid');
                        // 从本地存储中删除课程id
                        let plans = GM_getValue("plans", []);
                        plans = plans.filter(id => id != cid);
                        GM_setValue("plans", plans);

                        const targetButton = document.querySelector("#app > div.home-index > div.secondaryContent > div > div.bread-pieces > a");
                        if (targetButton) {
                            targetButton.click();
                        }

                        // 停止脚本循环检测
                        clearInterval(ZJTX_AutoPlay);
                        clearInterval(TimingTask);

                        if (GM_getValue("plans", []).length !== 0) {
                            // 切换下一个自购课程
                            location.assign(`https://xiangtan.zgzjzj.net/learncenter/play?pid=0&cid=${GM_getValue("plans", [])[0]}&model=3`);
                        }

                        // 调用更新进度API
                        updateProgressToAPI();
                    } else {
                        // 获取所有目标元素
                        const elementList = document.querySelectorAll("div.class-catlog > ul > li > ul > li");
                        let clicked = false;
                        if (elementList.length > 0) {
                            // 第一阶段：查找并点击第一个空class元素
                            for (const element of elementList) {
                                // 判断元素的class属性是否为空
                                if (element.className === '') {
                                    // 点击该元素
                                    element.click();
                                    clicked = true;
                                    // 跳出循环
                                    break;
                                }
                            }

                            // 第二阶段：如果没找到，则清空所有元素的class并点击第一个
                            if (!clicked) {
                                elementList.forEach(el => el.className = '');
                                elementList[0].click();
                            }
                        }
                        // 点击下一节
                        // document.querySelector(".el-icon-caret-right").click();
                        // 调用更新进度API
                        updateProgressToAPI();
                    }
                } else if (module == 2) {
                    // 调用更新进度API
                    updateProgressToAPI();

                    // 判断课程已合格数是否和课程数相同 => 不同：继续切换章节
                    if (document.querySelectorAll("span.active3").length != document.querySelectorAll("h3.plan-tt").length &&
                       document.querySelector("span.f-fr.kcpross > i").innerText.trim() != "100%") {
                        try {
                            let kj_tt = document.querySelectorAll("div.kj-tt");
                            kj_tt.forEach((item, index) => {
                                // 判断章节列表是否未播放 => 是：切换章节
                                if (item.className.indexOf("activeColor") == -1 && item.className.indexOf("finished") == -1) {
                                    // 未播放过的章节切换
                                    item.click();
                                    // 跳出循环
                                    throw new Error('切换章节');
                                }
                                // 判断索引是否到了最后一个课程章节列表的最后一章节 => 是：刷新页面，更新进度
                                if ((index + 1) == kj_tt.length) {
                                    // 判断是否有已观看但未完成的章节 => 是：清空其状态
                                    let active = document.querySelectorAll("span.active");
                                    if (active.length) {
                                        Array.from(active).forEach((active_item) => {
                                            // 获取课程的标签
                                            let parent_obj = active_item.parentElement.parentElement.parentElement.nextSibling;
                                            // 取章节列表循环迭代
                                            Array.from(parent_obj.querySelectorAll("div.kj-tt")).forEach((item) => {
                                                // 清空"已播放"状态
                                                let classVal = item.getAttribute("class").replace("finished", "");
                                                item.setAttribute("class", classVal);
                                            });
                                        });
                                        // 跳出循环
                                        throw new Error('有已观看但未完成的章节，其状态已清空，继续切换章节');
                                    }
                                    // 刷新页面，更新课程进度
                                    location.reload();
                                }
                            })
                        } catch (e) {
                            throw e;
                        }
                    } else {
                        // 停止脚本循环检测
                        clearInterval(ZJTX_AutoPlay);
                        clearInterval(TimingTask);
                        // 调用更新进度API
                        updateProgressToAPI();
                        // 推送任务进度
                        if (uid) {
                            WxPusher();
                        }
                        // 任务完成弹窗提示
                        $("#app").prepend(
                            `<div id='notification' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5);'>
                        <div id='content' style=' display: flex; flex-direction: column; align-items: center; background-color: #AFEEEE; padding: 20px; border-radius: 10px;'>
                            <h1 style='color: #FF0000; font-size: 2em; margin-bottom: 20px;'>📢脚本提示📢</h1>
                            <p style='font-size: 1.2em; text-align: center;'>🎉🎉🎉<br><span style='font-size: 1.5em;'>该课程全部播放完成并合格</span><br>🎉🎉🎉<br><span style='font-size: 1.5em;'>脚本停止循环检测</span><br>🎉🎉🎉<br><span style='font-size: 1.5em;'>需要做题的自行去做</span><br>🎉🎉🎉</p >
                            <br>
                            <button id='confirm' style=' padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.2em; '>我已确认</button>
                        </div>
                    </div>`
                        );
                        $('#confirm').on('click', function () {
                            $('#notification').remove();
                            $('#content').remove();
                        });
                    }
                }
            }

            // 弹出疲劳提醒
            if (document.querySelector("div.el-message-box__wrapper")) {
                if (document.querySelector("div.el-message-box__wrapper").style.display != "none") {
                    // 点击确定
                    if (document.querySelector("div.el-message-box__btns button.el-button")) {
                        document.querySelector("div.el-message-box__btns button.el-button").click()
                    }
                }
            }


            // // 课程切换开关
            // let next_KeCheng;
            // if (playProgress == "100%;") {
            //     let zhangjie = document.querySelectorAll(".class-catlog ul li ul li");
            //     zhangjie.forEach((item, index) => {
            //         if (item.className.indexOf("active") == -1) {
            //             if ((index + 1) == zhangjie.length) {
            //                 next_KeCheng = true;
            //             }
            //         } else {
            //             next_KeCheng = false
            //             // 章节切换
            //             document.querySelector(".el-icon-caret-right").click();
            //         }
            //     })
            // }

            // // 课程切换
            // if (next_KeCheng) {
            //     // 判断章节是否全部已观看
            //     let end = Array.from(document.querySelectorAll(".class-catlog ul li ul li")).every(function (item) {
            //         return item.querySelector(".play-btn").innerText.indexOf("已观看") != -1;
            //     });
            //     if (end) {
            //         // 切换到下一个课程
            //         let kecheng = document.querySelectorAll(".swiper-slide");
            //         for (let i = 0; i < kecheng.length; i++) {
            //             if (parseInt(kecheng[i].querySelector(".progresstext").innerText) == 100) {
            //                 if ((i + 1) < kecheng.length) {
            //                     if (parseInt(kecheng[i + 1].querySelector(".progresstext").innerText) < 100) {
            //                         kecheng[i + 1].querySelector('.left-img').click();
            //                         break;
            //                     }
            //                 }
            //             } else {
            //                 // 更新课程进度
            //                 location.reload();
            //             }
            //         }
            //     }
            // }
        }, 3000);
    }

    // 封装通用的 fetch 请求函数
    async function makeRequest(url, token, body = {}) {
        try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'token': token
                },
                body: JSON.stringify(body)
            };
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`请求 ${url} 出错:`, error);
            return null;
        }
    }

    // 获取用户信息及 unitName
    async function getInfoFromLocalStorage() {
        const token = localStorage.getItem('token');
        const basicInfo = {
            token,
            username: localStorage.getItem('username'),
            tel: localStorage.getItem('tel'),
            idnumber: localStorage.getItem('idnumber'),
            provinceName: localStorage.getItem('provinceName'),
            cityName: localStorage.getItem('cityName')
        };

        let unitName = null;
        if (token) {
            const userInfoResponse = await makeRequest('https://zj-api.zgzjzj.com/api/user/user/userInfo', token);
            unitName = userInfoResponse?.data?.unitName;
        }

        basicInfo.location = [basicInfo.provinceName, basicInfo.cityName, unitName].filter(Boolean).join('');
        return basicInfo;
    }

    // 获取计划列表
    async function getPlanList(token) {
        let planListResponse = null;
        switch (module) {
            case 1:
                planListResponse = await makeRequest('https://zj-api.zgzjzj.com/api/class/classLibrary/selectSelfBuying', token, { data: { type: 0, pageNum: 1, pageSize: 96, className: "" } });
                return (planListResponse?.data?.list || []).map(record => ({
                    id: record.id,
                    isPass: record.isPass,
                    planName: record.name,
                    status: record.isPass === 1? '100%' : '0%'
                }));
                break;
            case 2:
                planListResponse = await makeRequest('https://zj-api.zgzjzj.com/api/plan/plan/myPlanList', token, { data: { pageNum: 1, pageSize: 10, planName: "" } });
                const planList = planListResponse?.data?.list || [];
                const result = [];
                
                for (const record of planList) {
                    try {
                        const classInfo = await makeRequest('https://zj-api.zgzjzj.com/api/class/classLibrary/getUserPlanClassOtherInfo', token, { 
                            data: { 
                                upid: record.id, 
                                pid: record.planId 
                            } 
                        });
                        
                        let status = '0%';
                        if (classInfo?.data?.allClassHour > 0) {
                            const percentage = Math.floor(classInfo.data.allPassClassHour / classInfo.data.allClassHour * 100);
                            status = `${percentage}%`;
                        }
                        
                        result.push({
                            planName: record.name,
                            status: status
                        });
                    } catch (error) {
                        console.error('获取课程信息失败:', error);
                        result.push({
                            planName: record.name,
                            status: '0%'
                        });
                    }
                }
                return result;
                break;
            default:
                console.log("无法分辨页面！");
        }
    }

    async function updateStatusData() {
        const userInfo = await getInfoFromLocalStorage();
        const plans = await getPlanList(userInfo.token);
        const finalResult = { ...userInfo, plans };
        const jsonResult = JSON.stringify(finalResult);
        console.log(jsonResult);
        return finalResult;
    }

    // 定时推送
    let TimingTask;
    if (uid) {
        TimingTask = setInterval(function () {
            let refreshHours = new Date().getHours();
            let refreshMin = new Date().getMinutes();
            let refreshSec = new Date().getSeconds();
            let time000000 = refreshHours === 0 && refreshMin === 0 && refreshSec === 0;
            let time030000 = refreshHours === 3 && refreshMin === 0 && refreshSec === 0;
            let time060000 = refreshHours === 6 && refreshMin === 0 && refreshSec === 0;
            let time090000 = refreshHours === 9 && refreshMin === 0 && refreshSec === 0;
            let time120000 = refreshHours === 12 && refreshMin === 0 && refreshSec === 0;
            let time150000 = refreshHours === 15 && refreshMin === 0 && refreshSec === 0;
            let time180000 = refreshHours === 18 && refreshMin === 0 && refreshSec === 0;
            let time210000 = refreshHours === 21 && refreshMin === 0 && refreshSec === 0;
            if (time000000 || time030000 || time060000 || time090000 || time120000 || time150000 || time180000 || time210000) {
                WxPusher();
            }
        }, 1000);
    }

    // 等待标签加载
    function waitElement(selector, callback) {
        let element = document.querySelector(selector);
        if (element) {
            callback();
        } else {
            setTimeout(() => {
                waitElement(selector, callback);
            }, 1000);
        }
    }

    // WxPusher推送
    function WxPusher() {
        // 初始化推送信息
        // 获取用户姓名
        let name = document.querySelector("div.container").querySelectorAll("span")[document.querySelector("div.container").querySelectorAll("span").length - 1].innerText;
        // 获取任务名
        let quest = document.querySelectorAll("div.f-fl a")[document.querySelectorAll("div.f-fl a").length - 1].innerText;
        // 获取学习进度
        let progress = document.querySelector("span.kcpross i").innerText;
        // 总结结果
        let result;
        if (progress.match(RegExp(/100/))) {
            result = "😆恭喜，任务已完成，请开启下一任务！";
        } else {
            result = "😟抱歉，任务未完成，再努努力！";
        }
        // 推送内容模板
        let content =
            `<style type="text/css">
                table{
                    width: 100%;
                    border-collapse: collapse;
                }
                
                table caption{
                    font-size: 1.5em;
                    font-weight: bold;
                    margin: 5% 0;
                }
                
                th,td{
                    border: 2mm ridge rgba(128,0,128,0.6);
                    text-align: center;
                    padding: 1em;
                }
                
                table thead tr{
                    background-color: #9966c9;
                    color: Black;
                }
                
                table tbody tr{
                    background-color: #e9def3;
                    color: Black;
                }
                
                table tbody tr:hover{
                    background-color: #dcc1f5;
                }
                
                table tbody tr td:first-child{
                    color: #f40;
                }
                
                table tfoot tr td{
                    background-color: #e9def3;
                    color: Black;
                    text-align: center;
                }
            </style>
            <table>
                <caption>专技天下</caption>
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>任务</th>
                        <th>进度</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${name}</td>
                        <td>${quest}</td>
                        <td>${progress}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3">${result}</td>
                    </tr>
                </tfoot>
            </table>`;

        // 第一步：创建需要的对象
        let httpRequest = new XMLHttpRequest();
        // 第二步：打开连接
        httpRequest.open('POST', 'https://wxpusher.zjiecode.com/api/send/message', true);
        //设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.setRequestHeader("Content-type", "application/json");
        //发送请求 将情头体写在send中
        let body = JSON.stringify({
            "appToken": "AT_TVLwBLQ9RmXmOgqYByMIEWqjcY6DeOhX",
            "content": content,
            "summary": `专技天下_${name}_${progress}`,//消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
            "contentType": 2,//内容类型 1表示文字  2表示html(只发送body标签内部的数据即可，不包括body标签) 3表示markdown
            "uids": [uid],//发送目标的UID，是一个数组。
            "url": "", //原文链接，可选参数
            "verifyPay": false //是否验证订阅时间，true表示只推送给付费订阅用户，false表示推送的时候，不验证付费，不验证用户订阅到期时间，用户订阅过期了，也能收到。
        });
        httpRequest.send(body);
        // 获取数据后的处理程序
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            // 验证请求是否发送成功
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                // 获取到服务端返回的数据
                let json = httpRequest.responseText;
                console.log(json);
            }
        };
    }

    // 更新进度数据到API
    async function updateProgressToAPI() {
        try {
            const statusData = await updateStatusData();
            
            // 使用GM_xmlhttpRequest处理跨域请求
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://bndou.top:9425/api/update-data",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    data: JSON.stringify(statusData),
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            console.log('更新进度数据成功:', response.responseText);
                        } else {
                            console.error('更新进度数据API返回错误:', response.status, response.responseText);
                        }
                    },
                    onerror: function(error) {
                        console.error('更新进度数据请求发送失败:', error);
                    },
                    ontimeout: function() {
                        console.error('更新进度数据请求超时');
                    }
                });
                return true;
            } else {
                // 备用方法：使用普通XMLHttpRequest
                return new Promise((resolve, reject) => {
                    let httpRequest = new XMLHttpRequest();
                    httpRequest.open('POST', 'http://bndou.top:9425/api/update-data', true);
                    httpRequest.setRequestHeader("Content-Type", "application/json");
                    httpRequest.setRequestHeader("Accept", "application/json");
                    
                    // 增加请求超时设置
                    httpRequest.timeout = 10000; // 10秒超时
                    
                    // 将JavaScript对象转换为JSON字符串
                    const body = JSON.stringify(statusData);
                    
                    httpRequest.onreadystatechange = function() {
                        if (httpRequest.readyState == 4) {
                            if (httpRequest.status >= 200 && httpRequest.status < 300) {
                                console.log('更新进度数据成功:', httpRequest.responseText);
                                resolve(true);
                            } else {
                                console.error('更新进度数据API返回错误:', httpRequest.status, httpRequest.responseText || '无响应内容');
                                resolve(false);
                            }
                        }
                    };
                    
                    httpRequest.onerror = function(e) {
                        console.error('更新进度数据网络错误:', e);
                        resolve(false);
                    };
                    
                    httpRequest.ontimeout = function() {
                        console.error('更新进度数据请求超时');
                        resolve(false);
                    };
                    
                    try {
                        httpRequest.send(body);
                        console.log('数据发送中...', JSON.parse(body).username);
                    } catch (e) {
                        console.error('发送请求时出错:', e);
                        resolve(false);
                    }
                });
            }
        } catch (error) {
            console.error('更新进度数据失败:', error);
            return false;
        }
    }
})();