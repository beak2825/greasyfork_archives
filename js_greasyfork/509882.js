// ==UserScript==
// @name            华医网_基层卫生人员能力训练平台
// @namespace       https://bbs.tampermonkey.net.cn/
// @version         2024.09.24.0456
// @description     自动开始播放，当前小节播放完自动切下一节，当前课程所有章节播放完自动切换下一个课程，疲劳提醒自动继续。
// @author          BN_Dou
// @match           https://jcpxkh.91huayi.com/exercise*
// @icon            https://www.91huayi.com/upload/images/2019/12/3017338625.png
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_registerMenuCommand
// @license         AGPL License
// @downloadURL https://update.greasyfork.org/scripts/509882/%E5%8D%8E%E5%8C%BB%E7%BD%91_%E5%9F%BA%E5%B1%82%E5%8D%AB%E7%94%9F%E4%BA%BA%E5%91%98%E8%83%BD%E5%8A%9B%E8%AE%AD%E7%BB%83%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/509882/%E5%8D%8E%E5%8C%BB%E7%BD%91_%E5%9F%BA%E5%B1%82%E5%8D%AB%E7%94%9F%E4%BA%BA%E5%91%98%E8%83%BD%E5%8A%9B%E8%AE%AD%E7%BB%83%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // ⭕⭕⭕wxpusher推送用户uid
    var uid = GM_getValue("uid", "");

    //添加菜单
    GM_registerMenuCommand('⭕wxpusher推送用户uid', addUid);
    function addUid() {
        uid = GM_getValue("uid", "");
        var input_uid = prompt("首次使用\n\n若要使用微信推送进度功能\n\n请把刚刚微信扫码订阅后返回的“uid”复制粘贴到下方输入框\n\n然后开始使用。");
        if (input_uid) {
            GM_setValue("uid", input_uid);
        }
        else {
            if (!uid) {
                alert("未填写推送uid，不使用推送功能。\n若不想使用，请自行禁用脚本，以免每次访问页面都弹出该提示。");
                return;
            }
            else {
                var is_uid = prompt("检测到已存在推送uid\n\n若继续使用原有的uid推送，请直接点击“确定”。\n若不想使用，请直接点击“取消”。", uid);
                if (!is_uid) {
                    GM_setValue("uid", "");
                }
                return;
            }
        }
    }

    // 页面video窗口加载完成后执行
    waitElement('video', function () {
        // 删除评分区
        document.querySelector("body > div.wrapper > div.middleContent > div.playContent > div.pl_content").remove();
        console.log("删除评分区");
        // 删除评论区
        document.querySelector("body > div.wrapper > div.middleContent > div.playContent > div.pl_load_content").remove();
        console.log("删除评论区");
        // 播放初始化
        // if (document.querySelector(".vjs-big-play-button")) {
        //    document.querySelector(".vjs-big-play-button").click();
        // }
        // 推送uid为空时，弹出扫码订阅
        if (!uid) {
            console.log("推送uid为空，弹出扫码订阅");
            // wxpusher推送订阅二维码
            $(".wrapper").prepend(
                `<div id='subscription' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5);'>
                <div id='subscription_content' style=' display: flex; flex-direction: column; align-items: center; background-color: #AFEEEE; padding: 20px; border-radius: 10px;'>
                    <h1 style='color: red; font-size: 2em; margin-bottom: 20px;'>📢wxpusher推送订阅二维码📢</h1>
                    <br>
                    <span style='text-align: center; font-size: 1.5em;'>👇&nbsp;&nbsp;&nbsp;👇&nbsp;&nbsp;&nbsp;👇</span>
                    <a style='text-align: center;' href='https://wxpusher.zjiecode.com/api/qrcode/e61cgr6Ht4uXbWiqjaZFEocrMNNVK7u2xjrpBAJaOmSpiZYJ4JIgOl1VPhvgUegq.jpg' onclick="window.open(this.href, 'mozillaWindow', 'popup,width=400,height=400,');return false;">
                        <span style='color: Purple; text-align: center; font-size: 1.5em; display: block;'>点击跳转订阅<br>「学习进度」</span>
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
        else {
            console.log("推送uid为：" + uid);
        }
    });

    // 列出所有课程计划
    showCourse();

    // 运行需要点击启动
    var fisrtUse = GM_getValue("fisrtUse", false);
    if (fisrtUse) {
        // 持续监控
        var AutoPlay = setInterval(function () {
            let log = "";
            if (document.querySelector("body > div.wrapper > div.middleContent > div.playContent > div.playRoute")) {
                log += document.querySelector("body > div.wrapper > div.middleContent > div.playContent > div.playRoute").innerText + "\n";
            }
            console.log("持续监控\n" + log);

            if (document.querySelector("section.ccH5FadeOut")) {
                console.log("显示状态栏");
                document.querySelector("section.ccH5FadeOut").className = "ccH5FadeIn";
            }

            // 静音
            // document.querySelector("span.ccH5vm").click()

            // 视频控制台“播放按钮”状态是否是亮起
            if (document.querySelector("span.ccH5TogglePlay.ccToggleBtn")) {
                // 播放
                console.log("点击播放");
                document.querySelector("span.ccH5TogglePlay.ccToggleBtn").click();
                htPlayer.play();
            }

            // 人脸识别弹窗
            if (document.querySelector(".popup_box").style.display == "block") {
                console.log("关闭人脸识别弹窗");
                ContinueLearning();
            }

            // 当前任务完成
            if (document.querySelector("#replaybtn.adrPlayBtn") && document.querySelector("#replaybtn.adrPlayBtn").style.display == "block") {
                // 删除当前页面课程计划
                delCourse();
                // 切换下一个课程计划
                nextCourse();
            }
        }, 3000);
    }
    else {
        let rules = GM_getValue("courseRules", []);
        if (rules.length > 0) {
            topNotice("如需启动计划，请在插件选项中点击“启动/关闭”按钮！");
        }
        else {
            topNotice("运行需先添加课程计划");
        }
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
        let name = document.querySelector("ss").innerText;
        // 总结结果
        let result = "😆恭喜，任务已完成！";
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
                <caption>华医网_基层卫生人员能力训练平台</caption>
                <thead>
                    <tr>
                        <th>姓名</th>
                        <th>日志</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${name}</td>
                        <td>${result}</td>
                    </tr>
                </tbody>
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
            "summary": `华医网_${name}`,//消息摘要，显示在微信聊天页面或者模版消息卡片上，限制长度100，可以不传，不传默认截取content前面的内容。
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

    // 添加菜单
    GM_registerMenuCommand('启动/关闭 计划', start);
    GM_registerMenuCommand('添加课程计划', getcourseList);
    GM_registerMenuCommand('删除所有课程计划', delCourseAll);
    GM_registerMenuCommand('删除当前课程计划', delCourse);
    GM_registerMenuCommand('列出剩余计划', showCourse);

    // GM_registerMenuCommand('允许弹出窗口或重定向', test);
    // function test(){
    //     window.open('edge://settings/content/popups','_blank');
    // }

    // 启动/关闭 计划
    function start() {
        var fisrtUse = GM_getValue("fisrtUse", false);
        if (fisrtUse) {
            GM_setValue("fisrtUse", false);
            topNotice("关闭计划 成功");
            location.reload();
        }
        else {
            let rules = GM_getValue("courseRules", []);
            if (rules.length > 0) {
                GM_setValue("fisrtUse", true);
                topNotice("启动计划 成功");
                location.reload();
                nextCourse();
            }
            else {
                topNotice("启动计划 失败！请先添加课程计划，之后再启动计划。");
            }
        }
    }

    // 列出剩余计划
    function showCourse() {
        let rules = GM_getValue("courseRules", []);
        var course = "";
        if (rules.length > 0) {
            for (var i = 0; i < rules.length; i++) {
                course += (i + 1) + '：' + rules[i].url + '\n';
            }
        }
        console.log(course);
        document.querySelector("h1").innerText += "【还剩 " + rules.length + "个视频】";
    }

    // 获取课程链接
    function getcourseList() {
        var courseList = [];
        var xhr = new XMLHttpRequest();
        var learnPlanId = sessionStorage.getItem("learnPlanId");
        xhr.open("POST", "https://jcpxkh.91huayi.com/exercise/ExerciseCourse/GetLearnCourseList", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send("learnPlanId=" + learnPlanId);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                courseList = JSON.parse(xhr.responseText).Data.data;
                // console.log(courseList);
                for (var i = 0; i < courseList.length; i++) {
                    if (courseList[i].Learning_state != 1) {
                        addCourse(courseList[i].LearningPlan_Courseware_Id);
                    }
                }
            }
        };
    }

    // 添加课程计划
    function addCourse(learningPlan_Courseware_Id) {
        var ruleData = { "url": "https://jcpxkh.91huayi.com/exercise/ExerciseCourse/CoursePlay?courseware_id=" + learningPlan_Courseware_Id };
        addR(ruleData).then((res) => {
            if (res.status == 200) {
                topNotice("添加规则成功");
                document.oncontextmenu = null;
                document.onclick = null;
            }
            else {
                topNotice("Error，添加规则失败");
                document.oncontextmenu = null;
                document.onclick = null;
            }
        });
    }

    // 添加课程计划
    function addR(ruleData) {
        // 直接将规则保存到本地存储
        let rules = GM_getValue("courseRules", []);
        rules.push(ruleData);
        GM_setValue("courseRules", rules);
        return Promise.resolve({ status: 200 });
    }

    // 删除所有课程计划
    function delCourseAll() {
        GM_setValue("courseRules", []);
        topNotice("删除所有课程计划");
    }

    //删除当前页面课程计划
    function delCourse() {
        var ruleData = { "url": window.location.href }
        delR(ruleData).then((res) => {
            if (res.status == 200)
                topNotice("删除当前页面课程计划成功");
            else
                topNotice("Error，删除当前页面课程计划失败");
        });
    }

    //删除课程计划
    function delR(ruleData) {
        // 从本地存储中删除规则
        let rules = GM_getValue("courseRules", []);
        rules = rules.filter(rule => rule.url !== ruleData.url);
        GM_setValue("courseRules", rules);
        return Promise.resolve({ status: 200 });
    }

    // 切换下一个课程计划
    function nextCourse() {
        let rules = GM_getValue("courseRules", []);
        if (rules.length > 0) {
            topNotice("切换下一个课程计划");
            console.log(rules[0]);
            window.open(rules[0].url, '_blank');
            window.close();
        }
        else {
            if (document.querySelector("#replaybtn")) {
                // 停止脚本循环检测
                console.log("停止脚本循环检测");
                clearInterval(AutoPlay);

                // 推送任务进度
                console.log("推送任务进度");
                if (uid) {
                    WxPusher();
                }

                // 任务完成弹窗提示
                topNotice("任务完成弹窗提示");
                $("#content").prepend(
                    `<div id='notification' style='position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.5);'>
                        <div id='notification_content' style=' display: flex; flex-direction: column; align-items: center; background-color: #AFEEEE; padding: 20px; border-radius: 10px;'>
                            <h1 style='color: #FF0000; font-size: 2em; margin-bottom: 20px;'>📢推送提示📢</h1>
                            <p style='font-size: 1.2em; text-align: center;'>🎉🎉🎉<br><span style='font-size: 1.5em;'>所有课程计划全部完成</span><br>🎉🎉🎉<br><span style='font-size: 1.5em;'>自动关闭计划运行</span><br>🎉🎉🎉<br><span style='font-size: 1.5em;'>需要做题的自行去做</span><br>🎉🎉🎉</p >
                            <br>
                            <button id='confirm' style=' padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 1.2em; '>我已确认</button>
                        </div>
                    </div>`
                );
                $('#confirm').on('click', function () {
                    $('#notification').remove();
                    $('#notification_content').remove();
                });
                GM_setValue("fisrtUse", false);
                topNotice("课程计划全部完成！自动关闭计划运行");
            }
        }
    }

    function topNotice(msg) {
        var div = document.createElement('div');
        div.id = 'topNotice';
        div.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 5%; z-index: 9999999999; background: rgba(117,140,148,1); display: flex; justify-content: center; align-items: center; color: #fff; font-family: "Microsoft YaHei"; text-align: center;';
        div.innerHTML = msg;
        div.style.fontSize = 'medium';
        document.body.appendChild(div);
        setTimeout(function () {
            document.body.removeChild(document.getElementById('topNotice'));
        }, 3500);
    }
})();