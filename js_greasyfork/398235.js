// ==UserScript==
// @name         自动任务
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398235/%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/398235/%E8%87%AA%E5%8A%A8%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

const waitForLoadTime = 2000;
const TASK_STATUS = {init: 0, success: 1, fail: -1};
(function() {
    'use strict';

    // Your code here...

    // 创建iframe任务数据集中存储，解决跨越问题
    var noHostCache = (() => {
        var frame = document.createElement('iframe');
        // frame.style = 'display: none';
        frame.id = 'storage-frame';
        frame.src = `data:text/html,
            <html>
                <script>
                    window.addEventListener('message', function(e) {
                        if (e.source != window.parent) {
                            return;
                        }
                        console.log(e.data);
                        var data = JSON.parse(e.data);
                        var res = false;;
                        if (data.opr == 'get') {
                            res = localStorage.getItem(data.key);
                        } else if (data.opr == 'set') {
                            localStorage.setItem(data.key, data.value);
                            res = true;
                        }
                        window.parent.postMessage(JSON.stringify(res), '*');
                    }, false);
                </script>
                <body></body>
            </html>
        `;
        frame.src = 'https://lin_bo.gitee.io/html/localStorage.html';
        // document.body.append(frame);

        function set(key, value) {
            var data = JSON.stringify({opr: 'set', key: key, value: value});
            new Promise((resolve, reject) => {
                document.getElementById('storage-frame').contentWindow.postMessage(data, '*');
            }).then((data) => {
                console.log(data)
            }).catch((e) => {
                console.error(`set错误 ${e}`)
            });
        }

        function get(key) {
            var data = JSON.stringify({opr: 'get', key: key});
            document.getElementById('storage-frame').contentWindow.postMessage('data', '*');
            window.addEventListener('message',function(e){
                if(e.source!=window.parent) return;
                console.log(e.data);
            }, false);
        }

        return {set: set, get: get};
    })();

    // 任务核心功能
    const _task = (function() {

        const taskKeyPrefix = 'bob_auto_task';
        const taskKey = `${taskKeyPrefix}_${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}`;

        function getCache(key) {
            try {
                var data = noHostCache.get(key);
                if (data) {
                    return JSON.parse(data);
                }
                return null;
            } catch (e) {
                console.error(e);
                return null;
            }
        }

        function setCache(key, data) {
            if (!data) {
                return;
            }
            noHostCache.set(key, JSON.stringify(data));
        }

        // 判断是否匹配到任务
        function isUrlMatchTask(curUrl, taskUrl) {
            var cUrl = new URL(curUrl);
            var cPath = `${cUrl.protocol}//${cUrl.hostname}${cUrl.port == '' ? '' : ':'+cUrl.port}${cUrl.pathname}`;
            var tUrl = new URL(taskUrl);
            var tPath = `${tUrl.protocol}//${tUrl.hostname}${tUrl.port == '' ? '' : ':'+tUrl.port}${tUrl.pathname}`;
            return cPath == tPath;
        }

        // 获取当前网页任务信息
        function getCurrentTaskInfo() {
            var allTask = getCache(taskKey);
            if (!allTask) {
                return null;
            }
            var taskInfo = allTask.filter((item, index) => {
                return isUrlMatchTask(window.location.href, item.url);
            });
            if (taskInfo && taskInfo[0]) {
                return taskInfo[0];
            }
            return null;
        }

        // 注册任务
        function _reg(name, fun, url) {
            if (!(name && fun && url)) {
                console.warn('注册任务，必须有 name、 fun、 url');
                return;
            }

            // 删除非当天任务
            for (var i=0; i<window.localStorage.length; i++) {
                var key = window.localStorage.key(i);
                if (key.indexOf(taskKeyPrefix) == 0 && key !== taskKey) {
                    console.log(`删除以前任务: ${key}`)
                    window.localStorage.removeItem(key);
                }
            }
            var task = getCurrentTaskInfo();
            if (task) {
                console.log(`已注册任务: ${JSON.stringify(task)}`);
                return;
            }
            var taskInfo = getCache(taskKey);
            // 创建当天任务
            if (!taskInfo) {
                console.log(`创建当天任务: ${taskKey}`);
                taskInfo = [];
            }
            console.log(`注册任务: 【${name}】 ${url}`)
            // status: -1: 失败; 0: 未执行; 1: 成功
            taskInfo.push({name: name, url: url, fun: fun, status: 0})
            setCache(taskKey, taskInfo);
        }

        // 执行成功
        function success() {
            // 获取当前任务
            var allTask = getCache(taskKey);
            if (!allTask) {
                return null;
            }
            var index =  -1;
            allTask.forEach((item, i) => {
                if (isUrlMatchTask(window.location.href, item.url)) {
                    index = i;
                }
            });
            if (index >= 0) {
                var task = allTask[index];
                task.status = TASK_STATUS.success;
                var tasks = getCache(taskKey);
                allTask[index[0]] = task;
                setCache(taskKey, allTask);
                console.log('任务执行成功: ' + JSON.stringify(task));
                return;
            }
            console.warn('当前页没有任务');
        }

        // 执行失败
        function fail() {
            // 获取当前任务
            var allTask = getCache(taskKey);
            if (!allTask) {
                return null;
            }
            var index =  -1;
            allTask.forEach((item, i) => {
                if (isUrlMatchTask(window.location.href, item.url)) {
                    index = i;
                }
            });
            if (index >= 0) {
                var task = allTask[index];
                task.status = TASK_STATUS.fail;
                var tasks = getCache(taskKey);
                allTask[index[0]] = task;
                setCache(taskKey, allTask);
                console.log('任务执行失败: ' + JSON.stringify(task));
                return;
            }
            console.warn('当前页没有任务');
        }

        // 执行下一个任务
        function doNext() {
            var allTask = getCache(taskKey);
            allTask.forEach(item => {
                if (item.status == 0) {
                    console.log(`开始执行: ${item.name}`)
                } else if (item.status == 1) {
                    console.log(`跳过已执行: ${item.name}`)
                } else if (item.status == 1) {
                    console.log(`跳过失败: ${item.name}`)
                }
            });
        }

        // 开始任务
        function start() {
            // 获取当前任务
            var taskInfo = getCurrentTaskInfo();
            if (!taskInfo) {
                console.log('当前无任务')
                return;
            }
            console.log(`当前任务: ${JSON.stringify(taskInfo)}`);
            // 执行任务
            window.addEventListener("load", () => {
                setTimeout(() => {
                    eval(`${taskInfo.fun}()`);
                }, waitForLoadTime);
            });
            //
        }

        // 执行任务
        function reg(name, fun, url) {
            if (isUrlMatchTask(window.location.href, url)) {
                 window.addEventListener("load", () => {
                    setTimeout(() => {
                        console.log(`开始执行: ${name}`)
                        eval(`${fun}()`);
                    }, waitForLoadTime);
                });
            }
            return;
        }

        return {reg: reg, doNext: doNext, start: start, success: success, fail: fail};
    })();


    // 任务1
    _task.reg('测试任务', 'task1', 'file:///C:/Users/71085/Desktop/temp/jd.html');
    function task1() {
        setTimeout(() => {
            console.log('taksk1')
        }, 1000);
    }

    // 任务1
    _task.reg('京东金融-每日签到', 'task11', 'https://uf.jr.jd.com/activities/sign/v5/index.html?channel=JRAPP');
    function task11() {
        var signBtn = document.querySelector('.sign-btn');
        if (signBtn) {
            if (signBtn.innerHTML.indexOf('已连续签到') >= 0) {
                console.log('每日签到：已签到');
            } else {
                signBtn.click();
                console.log('每日签到：成功');
                // TODO 关闭奖励
            }
        } else {
            console.warn('每日签到：找不到签到按钮');
        }
    }


    // 注册任务2
    // _task.reg('京东金融-种草阅读文章', 'task2', 'https://jddx.jd.com/m/jddnew/discovery/0.html');
    function task2() {
        console.log('开始阅读3篇种草文章');
        var jddUrls = new Array();
        var targets = document.getElementsByClassName('essay-holder');
        // 一个连接含有 'essay-holder' 这样两个标签，从标签中解析出url参数
        var p1 = targets[0].getAttribute('clstag'); // jr|keycount|jiandandian_0305|faxianpage_neirong_info_8582799
        p1 = p1.substr(p1.lastIndexOf('_')); // 得到 8582799
        jddUrls.push(`https://jddx.jd.com/m/jdd/index.html?id=${p1}`);

        var p2 = targets[2].getAttribute('clstag');
        p2 = p2.substr(p2.lastIndexOf('_'));
        jddUrls.push(`https://jddx.jd.com/m/jdd/index.html?id=${p2}`);

        var p3 = targets[4].getAttribute('clstag');
        p3 = p3.substr(p3.lastIndexOf('_'));
        jddUrls.push(`https://jddx.jd.com/m/jdd/index.html?id=${p3}`);
        jddUrls.forEach(url => {
            console.log(url)
            var aTag = document.createElement('a');
            aTag.href = url
            aTag.target = '_blank'
            // aTag.click();
        });
        targets[0].click();
    }

    // 注册任务3
    _task.reg('看广告领京东豆', 'task3', 'https://jdda.jd.com/btyingxiao/advertMoney/html/collar.html?iframeSrc=https%3A%2F%2Fpro.m.jd.com%2Fmall%2Factive%2F3xdpa5DWqPDhqZgf9qX1kkfixyES%2Findex.html%3Ffrom%3Dkgg&adId=09999999&bussource=');
    function task3() {
        console.log('看广告领京东豆');
        var runner = setInterval(() => {
                    var btn = document.getElementById('idButton');
                    if (btn.innerHTML === '同一广告不能重复领取！') {
                        clearInterval(runner);
                        console.log('看广告领京东豆: 已完成');
                        return;
                    }
                    if (btn && btn.getAttribute('class') === 'button') {
                        btn.click();
                        clearInterval(runner);
                        console.log('查看广告领豆: 完成');
                    } else {
                        console.log('查看广告领豆: 未有可领取按钮');
                    }
                }, 1000);

    }

    // 注册任务4
    _task.reg('赚钱签到', 'task4', 'https://jddx.jd.com/m/jddnew/money/index.html?from=jrmd');
    function task4() {
        console.log('赚钱签到');
        var p = document.getElementsByClassName('item-content');
        for (var i=0; i<p.length; i++) {
            var className = p[i].childNodes[0].getAttribute('class');
            if ('item-icon today done' === className) {
                console.log('赚钱签到： 已签到');
            } else if (className.indexOf(' today ') >= 0) {
                p[i].click();
                console.log('赚钱签到：签到完成');
                // TODO 关闭奖励
            }
        }
        // 领取每日任务
        console.log('领取赚钱任务: 开始');
        var btns = document.getElementsByClassName('listItem-jingdou item');
        var hasTaskBtn = false;
        for (var j=0; j<btns.length; j++) {
            var btnHtml = btns[j].innerHTML;
            // 只领取一个京东豆的任务
            if (btnHtml.indexOf('去浏览') > 0 && btnHtml.indexOf('class="num">+1</span>') > 0) {
                hasTaskBtn = true;
                btns[j].click();
            } else if (btnHtml.indexOf('领取任务') > 0 && btnHtml.indexOf('class="num">+1</span>') > 0) {
                hasTaskBtn = true;
                btns[j].click();
            }
        }
        if (!hasTaskBtn) {
            console.log('当前页没有任务领取按钮');
        } else {
            window.location.reload();
        }
        console.log('领取赚钱任务: 完成');
    }

})();