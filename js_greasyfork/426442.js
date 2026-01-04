// ==UserScript==
// @name        Discuz BUX广告点击赚积分
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description Discuz论坛插件 BUX广告点击赚积分 自动
// @author       lvweicheng
// @match       *://*/plugin.php?id=jnbux
// @icon        https://ae01.alicdn.com/kf/U0b4f37bdfa1c41a68fdf6a63a973a4427.jpg
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.1.0/jquery.min.js
// @require     https://cdn.bootcdn.net/ajax/libs/layer/3.3.0/layer.min.js
// @grant       GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/426442/Discuz%20BUX%E5%B9%BF%E5%91%8A%E7%82%B9%E5%87%BB%E8%B5%9A%E7%A7%AF%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/426442/Discuz%20BUX%E5%B9%BF%E5%91%8A%E7%82%B9%E5%87%BB%E8%B5%9A%E7%A7%AF%E5%88%86.meta.js
// ==/UserScript==

(function() {

    'use strict';
    $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.3.0/theme/default/layer.min.css" rel="stylesheet">`);

    run();
    function getUserId() {
        let url = $(".vwmy a").attr('href');
        let pattern = /(\d){1,}/;
        return url.match(pattern) | url.match(pattern)[0];
    }
    function getTasks() {
        let html = $("html").html();
        let pattern = /window.open(.){1,}/g;
        let tasks = [];
        if (html.match(pattern)){
            tasks = html.match(pattern);
        }
        let returns = [];
        let features = "height=500, width=500, top=100, left=100, location=no";
        for (const tasksKey in tasks) {
            pattern = /plugin.php(.){1,}(\d)/;
            let url = tasks[tasksKey].match(pattern)[0];
            let jsStr = "window.open('"+ url +"', '', '"+ features +"')"
            returns.push(jsStr);
            // returns.push(tasks[tasksKey].replace('newwindow', '').replace('""', "'" + features + "'"));
        }
        return returns;
    }

    function msg(msg, icon = 1, taskId = 999) {
        layer.msg(msg, {
            offset: 'rt' //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
            ,id: taskId //防止重复弹出
            ,shade: 0 //不显示遮罩
            ,icon: icon
        });
    }
    function checkJoin() {
        let flag = document.evaluate("//ul[@class='xl xl2 cl']/li[1]/a/font/b/text()").iterateNext();
        return !(flag == null);
    }

    function run(res) {
        console.log(parent)
        let id = getUserId();
        if (!id){
            msg('还没有登录', 5);
            return;
        }
        if (!checkJoin()){
            msg('还没有加入', 5);
            return;
        }
        let tasks = getTasks();
        if (tasks.length == 0){
            msg('今日任务已完成');
            return;
        }
        let promise = Promise.resolve();
        let runCount = 0;
        tasks.forEach((task, index) => {
            let pattern = /clickid=\d{1,}/;
            let taskId = task.match(pattern)[0].split('=')[1];
            promise =  promise.then(() => {
                return new Promise((resolve => {
                    let newWindow = eval(task);
                    if (newWindow){
                        setTimeout(()=>{
                            let timer = setInterval(() => {
                                if (!newWindow.document.getElementById('timer')){
                                    msg('任务id:' + taskId + '执行成功', 1, taskId);
                                    clearInterval(timer);
                                    resolve(newWindow);
                                }
                            }, 1000);
                        },5000);
                    }
                }));
            });
            promise.then((res) => {
                res.close();
                runCount += 1;
                if (runCount >= tasks.length){
                    window.location.reload();
                }
            });
        });
    }
})();