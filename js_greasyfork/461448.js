// ==UserScript==
// @name         zhyDaDa_超星网课助手
// @version      1.21.1
// @description  [个人向] 刷超星尔雅的网课, 现在支持pdf/ppt/视频/音频的处理, 提供了设置面板可以调节, 解决了鼠标移开视频暂停的问题
// @author       zhyDaDa
// @namespace    http://zhydada.github.io/
// @updateurl    https://greasyfork.org/scripts/461448-zhydada-%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B/code/zhyDaDa_%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @homepage     http://zhydada.github.io/scripts/4.user.js
// @license      personal - use only

// @match        *://mooc.s.ecust.edu.cn/*
// @match        *://mooc1.chaoxing.com/*
// @match        *://mooc1.s.ecust.edu.cn/mooc-ans/mycourse/*

// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAkACQAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9yL68aMTFZP3i7toZ9q55xk9hWLovi+6vtRjhurdrdZQQrbzywGcc+wP5Vf1U/Jc/Vv5msK/t5JfIaFo98Mqy/McA4zx+tfP0uG8HTcqNZt8+0m2nHfVWaT6bpnPnGbPBYulS05Grt/Mv634vubDUHhtbdrlYwN7bjwxGcfkQfxrb0+4kkWBnb5m27grZXPfB71ytlbyRtcNKybppmk+Vs4zjj8MVv6VJu+yjPRl/mK58Zw3RqSp0cJpyfFO7bloul7Xv2svuDJ82ljcZVpK3IldP5ianGzpdemW/ma53Wb99PtlePaxZ9vzDpwT/AErsZ4CzyK0bFSTxtrI8ReFTrFnHHCogZJA5JjPIwRj9R+VZ4HiinVxyWNhy0722bSXn1fyX+YZ1k8sbiIV7rlirNdWYujag+oWztJtVlfaNo68A+/rXRaT9+25/jX+Yqv4d8KnR7OSOdVuGeQuCIzwMAY/T9a1rW18uWMLCyhWGPl6V0YjijCU8ZNYenJwvZNKy6d9fvDJcnlgq9Su2uWSskt1sf//Z
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/461448/zhyDaDa_%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/461448/zhyDaDa_%E8%B6%85%E6%98%9F%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
+ 1.0 视频基本操作
+ 1.1 寻找猎物多次更新
+ 1.2 确保在看到绿色勾勾出现再跳
+ 1.3 自动判断视频有没有放过, 只挑没放过的视频看
+ 1.4 克服浏览器禁止自动播放的限制, 尽力剔除bug
+ 1.5 可以完成ppt和pdf的任务了
+ 1.6 提供设置面板(保存设置完善成功)
+ 1.7 第二种pdf完善, 全局变量问题解决
+ 1.8 解决了多开和节流问题
+ 1.9 可以处理audio音频任务了
+ 1.10 面板最小化
+ 1.11 读书任务
+ 1.12 记忆面板位置
+ 1.13 保持窗口聚焦, 击败onblur的监视
+ 1.14 采用creatWorker维持后台运行
+ 1.15 和视频一样, 到阅读任务, 自动打开阅读窗口
+ 1.16 持续阅读(看完了再刷新重头来过)
+ 1.17 修复了一个bug: 部分界面的iframe采用data传递一个JSON来表示任务类型
+ 1.18 能够找到答案并展示
+ 1.19 修复了一个bug: 有时候会出现iframe的data属性报错的情况
+ 1.19.1 加一个类型wmv
+ 1.20 修复了无法自动寻找猎物的问题(原因是对于一些iframeNode.parentNode不包含icon节点, 届时就resolve不了)
+ 1.20.1 加一个类型book, 但仅做受理, 由于跨域问题, 无法直接操作, 所幸一般没有任务点, 直接先留坑
+ 1.20.2 加了一个类型flv
+ 1.21.0 新版的界面适配, 对任务点的新处理
+ 1.21.1 debug
     */

    //#region 防止多次启动
    if (!(window === window.top) || typeof zhy_settings !== 'undefined') return;
    //#endregion
    //#region /*======================div:函数定义==========================*/
    unsafeWindow.zhy_settings = GM_getValue("zhy_settings", {
        skipGreen: true,
        playbackRate: '1',
        loc_x: '50px',
        loc_y: '50px',
        scrollInterval: 500,
        setMin: 0,
    });
    zhy_settings.done = false;
    unsafeWindow.zhyDaDa = {};
    unsafeWindow.lastCallTime = 0;
    /**
     * 醒目的控制台输出
     * @param {"string"} log 要打印到控制台的话
     * @param {"报错"|"警告"|"启动"|"提示"|"幽灵白"} color 字体颜色 可选项为["报错"|"警告"|"启动"|"提示"|"幽灵白"] 默认绿色
     * @param {"int"} fontSize 字体大小, 默认24
     */
    zhyDaDa.sendLog = (log, color, fontSize) => {
        switch (color) {
            case "报错":
                color = "red";
                break;
            case "警告":
                color = "#F2AB26";
                break;
            case "启动":
                color = "#A162F7";
                break;
            case "提示":
                color = "#35D4C7";
                break;
            case "幽灵白":
                color = "ghostwhite";
                break;
            default:
                color = color || "#43bb88";
                break;
        }

        fontSize = fontSize || 24;
        console.log('%c' + log, 'color: ' + color + ';font-size: ' + fontSize + 'px;font-weight: bold;'); //text-decoration: underline;
    }

    zhyDaDa.getBaseDocument = () => {
        var currentWindow = window;

        while (currentWindow !== currentWindow.parent) {
            currentWindow = currentWindow.parent;
        }

        return currentWindow.document;
    }

    /**
     * 模拟cmd中的sleep函数
     * @param {"number"} d deltaTime 即要等待的时间差 照旧以毫秒为单位
     */
    function sleep(d) {
        return new Promise((success, fail) => {
            setTimeout(success, d);
        });
    }
    //#endregion

    function create(f) {
        var blob = new Blob(['(' + f + ')()']);
        var url = window.URL.createObjectURL(blob);
        var worker = new Worker(url);
        return worker;
    }

    const createWorker = (callback, time) => {
        var pollingWorker = create(`function (e) {
    setInterval(function () {
      this.postMessage(null)
    }, ${time})
  }`);
        pollingWorker.onmessage = callback
        return pollingWorker;
    }

    const stopWorker = (vm) => {
        try {
            vm && vm.terminate()
        } catch (err) {
            console.log(err)
        }
    }

    /*======================div:全局效果==========================*/



    zhyDaDa.findPray = (skipGreen = false) => {
        // 节流
        let currentTime = Date.now();
        if (currentTime - unsafeWindow.lastCallTime < 3600) return false;
        unsafeWindow.lastCallTime = currentTime;
        try {
            let currentPointIndex = 0;
            let pointsCataList;
            let points = $("#coursetree .roundpoint,.roundpointStudent", zhyDaDa.getBaseDocument()).get();
            if(!points || points.length <1){
                points = $(".posCatalog_select .prevTips", zhyDaDa.getBaseDocument()).get();
                // 0有任务 1任务完成 2无任务 3任务上锁
                // 新版中无任务直接不存在, 上锁任务未知
                pointsCataList = points.map((e, i) => {
                    if (e.parentNode.className == "posCatalog_active") {
                        currentPointIndex = i;
                    }
                    if (e.className.indexOf("catalog_points_yi") >= 0) {
                        return 0;
                    } else if (e.className.indexOf("icon_Completed") >= 0) {
                        return 1;
                    } else {
                        return 2;
                    }
                });
            }else{
            // 0有任务 1任务完成 2无任务 3任务上锁
            pointsCataList = points.map((e, i) => {
                if (e.parentNode.className == "currents") {
                    currentPointIndex = i;
                }
                if (e.className.indexOf("jobCount") >= 0) {
                    return 0;
                } else if (e.className.indexOf("blue") >= 0) {
                    return 1;
                } else if (e.className.indexOf("noJob") >= 0) {
                    return 2;
                } else if (e.className.indexOf("lock") >= 0) {
                    return 3;
                }
            });}

            console.log(pointsCataList,currentPointIndex);


            if (skipGreen || !unsafeWindow.zhy_settings.skipGreen) {
                let next = points[currentPointIndex + 1];
                if(next.parentNode.querySelector('a')){
                    next.parentNode.querySelector('a').click();}
                else{
                    next.parentNode.querySelector('span').click();}
                unsafeWindow.setTimeout(() => { zhyDaDa.main(); }, 4800);
            } else if (points.length > 0) {
                let i = currentPointIndex;
                while (pointsCataList[++i] != 0 && i < points.length);
                if (i == points.length && pointsCataList[i] != 0) {
                    i = 0;
                    while (pointsCataList[++i] != 0 && i < currentPointIndex);
                    if (i == currentPointIndex) zhy_settings.done = true;
                }
                let next = points[i];
                if(next.parentNode.querySelector('a')){
                    next.parentNode.querySelector('a').click();}
                else{
                    next.parentNode.querySelector('span').click();}
                unsafeWindow.setTimeout(() => { zhyDaDa.main(); }, 4800);
            }
        } catch(e) {
            zhyDaDa.sendLog("找不到猎物了", "报错");
            console.log(e);
        }
    }

    zhyDaDa.turnToNextPage = () => {
        let focus = $(".currents", zhyDaDa.getBaseDocument()).get()[0];
        let neighbour = focus.parentNode.nextElementSibling;
        neighbour.firstElementChild.querySelector('a').click();
    }

    zhyDaDa.getIframes = () => {
        let aaa = $("iframe", zhyDaDa.getBaseDocument()).get();
        if (aaa.length < 1) {
            return false;
        } else if (aaa[0].id == "iframe") {
            aaa = $("iframe", aaa[0].contentWindow.document).get();
        }
        return aaa;
    }

    zhyDaDa.classifyTasks = (taskIframes) => {
        let tasks = []; // [$iframe,"catagory"]
        tasks = taskIframes.map((iframe) => {
            let className = iframe.className;
            let catagory;
            try {
                let data = iframe.getAttribute('data');
                if (!data) {
                    // 说明没有data, 判断class
                    if (className.indexOf("video") > 0) catagory = "video";
                    else if (className.indexOf("pdf") > 0) catagory = "pdf";
                    else if (className.indexOf("ppt") > 0) catagory = "ppt";
                    else if (className.indexOf("audio") > 0) catagory = "audio";

                } else {
                    let json_data = JSON.parse(iframe.getAttribute('data'));
                    let bookname = json_data.bookname; // 图书包含图书出版信息, 需要另外判断(判断依据"bookname")
                    let type = json_data.type;
                    let job_id = json_data.jobid;
                    if (!type && !job_id && !bookname) throw new ReferenceError("该任务data属性既无type也无jobid, 还不是图书");
                    else if (bookname) catagory = "book";
                    else if (type) {
                        switch (type) {
                            case ".mp4":
                            case ".wmv":
                            case ".flv":
                                catagory = "video";
                                break;
                            case ".ppt":
                            case ".pptx":
                                catagory = "ppt";
                                break;
                            case ".pdf":
                            case ".doc":
                            case ".docx":
                                catagory = "pdf";
                                break;
                            default:
                                throw new ReferenceError("该任务data属性给出的type不存在\n现在的type: " + type);
                        }
                    } else if (job_id) {
                        if (JSON.parse(iframe.getAttribute('data')).jobid.indexOf('work') == 0) catagory = "work";
                        else if (JSON.parse(iframe.getAttribute('data')).jobid.indexOf('read') == 0) catagory = "read";
                        else throw new ReferenceError("该任务data属性给出的jobid不存在");
                    }
                }
            } catch (e) {
                console.log(e);
                zhyDaDa.sendLog("任务分类时出现未知错误", "报错");
                // throw new ReferenceError("任务分类时出现未知错误");
            } finally {
                catagory = catagory || "unknown";
            }

            return [iframe, catagory];
        });
        return tasks;
    }

    zhyDaDa.dealTasks = (tasksList) => {
        return new Promise((resolve, reject) => {
            if (tasksList.length < 1) {
                resolve();
            } else {
                let iframeNode = tasksList[0][0];
                let iframeCata = tasksList[0][1];
                switch (iframeCata) {
                    case "video":
                        zhyDaDa.dealVideo(iframeNode).then(() => {
                            tasksList.shift();
                            zhyDaDa.dealTasks(tasksList).then(resolve);
                        });
                        break;

                    case "pdf":
                        zhyDaDa.dealPdf(iframeNode).then(() => {
                            tasksList.shift();
                            zhyDaDa.dealTasks(tasksList).then(resolve);
                        });
                        break;

                    case "ppt":
                        zhyDaDa.dealPpt(iframeNode).then(() => {
                            tasksList.shift();
                            zhyDaDa.dealTasks(tasksList).then(resolve);
                        });
                        break;
                    case "audio":
                        zhyDaDa.dealAudio(iframeNode).then(() => {
                            tasksList.shift();
                            zhyDaDa.dealTasks(tasksList).then(resolve);
                        });
                        break;

                    case "read":
                        zhyDaDa.dealRead(iframeNode).then(() => {
                            resolve();
                        });
                        break;

                    case "book":
                        zhyDaDa.dealBook(iframeNode).then(() => {
                            tasksList.shift();
                            zhyDaDa.dealTasks(tasksList).then(resolve);
                        });
                        break;

                    case "work":
                        zhyDaDa.dealWork(iframeNode);
                        resolve("等用户做作业");
                        break;

                    default:
                        zhyDaDa.sendLog("该任务类型暂时未开发, 直接跳过咯", "警告");
                        tasksList.shift();
                        zhyDaDa.dealTasks(tasksList).then(resolve);
                        break;
                }
            }

        })
    }

    //#region div: Video
    zhyDaDa.dealVideo = (iframeNode) => {
        return new Promise((resolve, reject) => {
            let iconNode = iframeNode.parentNode;
            if (iconNode.classList.length > 1 && zhy_settings.skipGreen) resolve();
            else {
                let videoNode = iframeNode.contentWindow.document.querySelector("video");
                zhyDaDa.watchVideo(videoNode).then(resolve);
            }

        })

    }

    zhyDaDa.watchVideo = (video) => {
        return new Promise((resolve, reject) => {
            video.addEventListener('ended', onEnded); // 添加 ended 事件处理程序

            video.volume = 0;
            video.play(); // 开始播放视频
            video.playbackRate = Number(zhy_settings.playbackRate);
            video.pause = () => { return true }

            // 1.21新增: 针对视频中出现的问题枚举解答
            try {
                // let video = $0;
                let tkTopic = video.parentElement.querySelector(".tkTopic");
                let type = tkTopic.querySelector(".tkTopic_title").innerText;
                let choices = tkTopic.querySelector(".tkItem_ul").children;
                let submit = tkTopic.querySelector("#videoquiz-submit");

                switch (type) {
                    case "[单选题]":
                    case "[判断题]":
                        for (let i = 0; i < choices.length; i++) {
                            const e = choices[i];
                            e.firstChild.click();
                            submit.click();
                        }
                    case "[多选题]":
                        let len = choices.length;
                        let dp = (x) => {
                            if (x == len) {
                                submit.click();
                                return;
                            }
                            const e = choices[x];
                            e.firstChild.click();
                            dp(x + 1);
                            e.firstChild.click();
                            dp(x + 1);
                        }
                        dp(0);
                    default:
                        throw new ReferenceError("视频内的问题, 出现了新的题型: " + type);
                }

            } catch (e) { }

            function onEnded() {
                video.removeEventListener('ended', onEnded); // 删除 ended 事件处理程序
                resolve(); // 视频播放完成，设置 Promise 状态为 fulfilled
            }
        });
    }
    //#endregion

    //#region div: Pdf
    zhyDaDa.dealPdf = (iframeNode) => {
        return new Promise((resolve, reject) => {
            let iconNode = iframeNode.parentNode;
            let img = iframeNode.contentWindow.document.querySelector("#img");
            if (iconNode.classList.length > 1 && zhy_settings.skipGreen) resolve();
            else {
                img.scrollTop = img.scrollHeight;
                let btn = iframeNode.contentWindow.document.querySelector(".mkeRbtn");
                let num = iframeNode.contentWindow.document.querySelector(".all").innerText;
                num = Number(num);
                for (let i = 0; i < num + 2; i++) {
                    btn.click();
                }
                if (iconNode.firstChild.className.indexOf("icon") == -1) resolve();
            }
        });
    }
    //#endregion

    //#region div: Ppt
    zhyDaDa.dealPpt = (iframeNode) => {
        return new Promise((resolve, reject) => {
            try {
                let iconNode = iframeNode.parentNode;
                if (iconNode.classList.length > 1 && zhy_settings.skipGreen) resolve();
                else {
                    let btn = iframeNode.contentWindow.document.querySelector(".nextBtn");
                    let num = iframeNode.contentWindow.document.querySelector(".all").innerText;
                    num = Number(num);
                    for (let i = 0; i < num + 2; i++) {
                        btn.click();
                    }
                    if (iconNode.firstChild.className.indexOf("icon") == -1) resolve();
                }
            } catch (e) {
                zhyDaDa.sendLog("遇到了异种ppt, 报错信息见下方, 请手动处理, 本次跳过", "警告");
                console.log(e);
                resolve();
            }
        })

    }
    //#endregion

    //#region div: Audio
    zhyDaDa.dealAudio = (iframeNode) => {
        return new Promise((resolve, reject) => {
            let iconNode = iframeNode.parentNode;
            if (iconNode.classList.length > 1 && zhy_settings.skipGreen) resolve();
            else {
                let btn = iframeNode.contentWindow.document.querySelector(".vjs-play-control");
                let audioElement = iframeNode.contentWindow.document.querySelector("audio");

                audioElement.addEventListener('ended', onEnded); // 添加 ended 事件处理程序

                audioElement.volume = 0;
                audioElement.playbackRate = Number(zhy_settings.playbackRate);
                audioElement.pause = () => { return true }
                audioElement.play(); // 开始播放音频

                function onEnded() {
                    audioElement.removeEventListener('ended', onEnded); // 删除 ended 事件处理程序
                    resolve(); // 音频播放完成，设置 Promise 状态为 fulfilled
                }
            }

        })

    }
    //#endregion

    //#region div: Read
    zhyDaDa.dealRead = (iframeNode) => {
        return new Promise((resolve, reject) => {
            // 搜索所有的span, 找出其中innerText为"去阅读"的span, 点击它
            let toReadSpan;
            let frame_content = iframeNode.contentWindow.document.querySelector("#frame_content");
            let spans = frame_content.contentWindow.document.getElementsByTagName("span");
            for (let i = 0; i < spans.length; i++) {
                if (spans[i].innerText == "去阅读") {
                    toReadSpan = spans[i];
                    break;
                }
            }
            toReadSpan.click();
            resolve();
        });
    }
    //#endregion

    //#region div: Book
    zhyDaDa.dealBook = (iframeNode) => {
        return new Promise((resolve, reject) => {
            let frame_content = iframeNode.contentWindow.document.querySelector("[name='bookifame']");
            // todo: 以下内容涉及跨域问题, 这本图书是另一个主机地址的资源, 无法直接操作, 所幸一般没有任务点, 直接先留坑
            // let readWeb = frame_content.contentWindow.document.querySelector("#Readweb");
            // step = readWeb.scrollHeight / 10;
            // for (let i = 0; i < 10; i++) {
            //     readWeb.scrollTo(0, step * i);
            // }
            resolve();
        });
    }

    //#endregion

    //#region div: Work
    zhyDaDa.dealWork = (iframeNode) => {
        iframeNode.style.border = "2px red solid";
        zhyDaDa.sendLog("遇到了习题, 用红框标出, 直接跳过", "警告");
        return;
        let frame_content = iframeNode.contentWindow.document.querySelector("#frame_content");
        let form = frame_content.contentWindow.document.querySelector("#form1");
        let sss = form.serialize();
        let pat = /answer([0-9]*?)=(.*?)&answertype([0-9]*?)=([0-9]+?)&/g
        let counts = 0;
        let answerArea = zhyDaDa.getBaseDocument().querySelector("#answerArea");
        let answerString = "";
        while ((result = pat.exec(sss)) != null) {
            let answer = result[2];
            let answertype = result[4];
            answerString += `第${++counts}题: ${answer}\n`;
        }
        answerArea.value = answerString;
    }
    //#endregion

    zhyDaDa.main = () => {

        // 节流
        let currentTime = Date.now();
        if (currentTime - unsafeWindow.lastCallTime < 3600) return false;
        unsafeWindow.lastCallTime = currentTime;
        if (zhy_settings.done) return true;
        let taskIframes = zhyDaDa.getIframes();
        if (!taskIframes) return false;
        let classifiedTasksList = zhyDaDa.classifyTasks(taskIframes);
        zhyDaDa.dealTasks(classifiedTasksList).then(() => {
            zhyDaDa.sendLog("本次任务已完成, 正在寻找下一个猎物", "提示");
            unsafeWindow.setTimeout(() => { zhyDaDa.findPray(zhyDaDa.skipGreen); }, 4500);
        });
    }
    // 插入控制面板浮窗
    zhyDaDa.insertPanel = () => {
        let _style = `
        <style>
            #zhy_settings_panel_4 {
            position: fixed;
            top: ${zhy_settings.loc_y || "50px"};
            left: ${zhy_settings.loc_x || "50px"};
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            font-size: 12px;
            z-index: 99999;
            width: 180px;
            }

            #zhy_settings_panel_4 h3 {
                margin-top: 0;
                margin-bottom: 10px;
            }
            #drag-handle {
                width: 100%;
                height: 18px;
                cursor: move;
                background: grey;
                border-radius: 10px;
                margin-bottom: 10px;
                text-align: center;
                color: #bbb;
                user-select: none;
                min-width: 80px;
            }

            #zhy_settings_panel_4 .zhy_settings_item {
            margin-bottom: 10px;
            }

            #zhy_settings_panel_4 label {
            display: inline-block;
            width: 120px;
            }

            #playbackRateContainer {
            display: grid;
            }

            #playbackRateContainer input[type="radio"] {
            display: none;
            }

            #playbackRateContainer label {
            flex: 1;
            text-align: center;
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            cursor: pointer;
            }

            #playbackRateContainer input[type="radio"]:checked + label {
            background-color: #ccc;
            }

            #scrollInterval{
            width: 120px;
            }

        </style>
        `;
        let _html = `
        <div id="zhy_settings_panel_4">
        <div id="drag-handle" flag="0">双击最小化</div>
        <h3>设置面板</h3>
        <div class="zhy_settings_item" id="config">
            <label for="setMin">默认最小化面板</label>
            <input type="checkbox" id="setMin" checked>
        </div>
        <div class="zhy_settings_item">
            <label for="skipGreenToggle">跳过已经看完的任务点:</label>
            <input type="checkbox" id="skipGreenToggle" checked>
        </div>
        <div class="zhy_settings_item">
            <label for="startWork">启动刷课:</label>
            <button id="startWork">启动</button>
        </div>
        <div class="zhy_settings_item">
            <label for="goToNextPrey">直接前往下一课:</label>
            <button id="goToNextPrey">启动</button>
        </div>
        <div class="zhy_settings_item">
            <label>视频播放速率:</label>
            <div id="playbackRateContainer">
            <input type="radio" id="rate1" name="playbackRate" value="1" checked>
            <label for="rate1">1</label>

            <input type="radio" id="rate1.25" name="playbackRate" value="1.25">
            <label for="rate1.25">1.25</label>

            <input type="radio" id="rate1.5" name="playbackRate" value="1.5">
            <label for="rate1.5">1.5</label>

            <input type="radio" id="rate2" name="playbackRate" value="2">
            <label for="rate2">2</label>
            </div>
        </div>
        <hr>
        <div class="zhy_settings_item">
            <label for="scrollInterval">滚动间隔(毫秒):</label>
            <input type="number" id="scrollInterval" value="500">
        </div>
        <hr>
        <div class="zhy_settings_item">
            <label for="answerArea">章节测验答案: </label>
            <input type="textarea" id="answerArea" value="">
        </div>

        </div>
        `;

        document.documentElement.insertAdjacentHTML('beforeend', _style + _html);


        // 获取设置面板元素
        var panel = document.getElementById("zhy_settings_panel_4");

        // 获取浮窗标题栏元素
        let panelHeader = document.getElementById("drag-handle");

        // 定义变量记录鼠标按下时的坐标和面板的初始位置
        let startX, startY, panelX, panelY;

        // 给标题栏添加鼠标按下事件监听器
        panelHeader.addEventListener("mousedown", function (e) {
            // 记录鼠标按下时的坐标和面板的初始位置
            startX = e.clientX;
            startY = e.clientY;
            panelX = panel.offsetLeft;
            panelY = panel.offsetTop;

            // 给 document 添加鼠标移动和松开事件监听器
            document.addEventListener("mousemove", movePanel);
            document.addEventListener("mouseup", stopPanel);
        });

        // 双击标题栏最小化面板
        panelHeader.addEventListener("dblclick", function () {
            // 判断面板是否已经最小化
            // 如果panel的flag属性值不为"1", 说明面板没有最小化
            if (panel.getAttribute("flag") != "1") {
                // 将panel中除了标题栏之外的元素隐藏
                for (let i = 1; i < panel.children.length; i++) {
                    panel.children[i].style.display = "none";
                }
                panelHeader.innerHTML = "双击恢复";
                // 修改panel的flag属性为"1"
                panel.setAttribute("flag", "1");
            } else {
                for (let i = 1; i < panel.children.length; i++) {
                    panel.children[i].style.display = "block";
                }
                panelHeader.innerHTML = "双击最小化";
                panelHeader.style.width = "100%";
                // 修改panel的flag属性为"0"
                panel.setAttribute("flag", "0");
            }
        });

        // 移动浮窗的函数
        function movePanel(e) {
            // 计算鼠标移动的距离
            var deltaX = e.clientX - startX;
            var deltaY = e.clientY - startY;

            // 更新面板的位置
            panel.style.left = panelX + deltaX + "px";
            panel.style.top = panelY + deltaY + "px";
        }

        // 停止移动浮窗的函数
        function stopPanel() {
            // 记录位置
            zhy_settings.loc_x = panel.style.left;
            zhy_settings.loc_y = panel.style.top;
            GM_setValue("zhy_settings", zhy_settings);
            // 移除鼠标移动和松开事件监听器
            document.removeEventListener("mousemove", movePanel);
            document.removeEventListener("mouseup", stopPanel);
        }


        // 获取设置面板中的元素
        let skipGreenToggle = document.getElementById("skipGreenToggle");
        let startWork = document.getElementById("startWork");
        let goToNextPrey = document.getElementById("goToNextPrey");
        let playbackRateRadios = document.getElementsByName("playbackRate");
        let setMin = document.getElementById("setMin");

        skipGreenToggle.checked = zhy_settings.skipGreen;
        let inputElement = $(`input[name='playbackRate'][value='${zhy_settings.playbackRate}']`).get();
        (inputElement.length > 0) && (inputElement[0].checked = true);
        setMin.checked = zhy_settings.setMin === 1 ? true : false;
        // 如果设置了默认最小化面板, 则最小化面板(即模拟双击标题栏)
        if (zhy_settings.setMin === 1) {
            panelHeader.dispatchEvent(new MouseEvent("dblclick"));
        }

        // 定义回调函数
        function settingsChanged(ratio) {
            zhy_settings.setMin = zhyDaDa.getBaseDocument().getElementById("setMin").checked ? 1 : 0;
            zhy_settings.skipGreen = zhyDaDa.getBaseDocument().getElementById("skipGreenToggle").checked ? 1 : 0;
            zhy_settings.playbackRate = ratio || zhy_settings.playbackRate;
            zhy_settings.scrollInterval = zhyDaDa.getBaseDocument().getElementById("scrollInterval").value;
            GM_setValue("zhy_settings", zhy_settings);
        }

        // 给setMin添加change事件监听器，当状态发生改变时调用回调函数
        setMin.addEventListener("change", () => { settingsChanged(); });

        // 给skipGreenToggle添加change事件监听器，当状态发生改变时调用回调函数
        skipGreenToggle.addEventListener("change", () => { settingsChanged(); });

        // 给startWork添加click事件监听器，当点击时调用回调函数
        startWork.addEventListener("click", () => { zhyDaDa.main(); });

        // 给goToNextPrey添加click事件监听器，当点击时调用回调函数
        goToNextPrey.addEventListener("click", () => { zhyDaDa.findPray(true); });

        // 给playbackRateRadios中的每个单选按钮添加click事件监听器，当点击时调用回调函数
        playbackRateRadios.forEach(function (radio) {
            radio.addEventListener("click", (event) => { settingsChanged(event.target.value); });
        });

        // 给scrollInterval添加change事件监听器，当状态发生改变时调用回调函数
        document.getElementById("scrollInterval").addEventListener("change", (event) => {
            zhy_settings.scrollInterval = event.target.value;
            GM_setValue("zhy_settings", zhy_settings);
        });
    }

    /**
     * 读书功能实现
     */
    zhyDaDa.readBook = () => {
        //缓慢滚动页面到底部, 每2秒滚动一次, 滚动距离为屏幕高度的1/40
        let scrollInterval = createWorker(() => {
            // 滚动body
            document.body.scrollBy(0, window.innerHeight / 40);
            if (window.innerHeight + document.body.scrollTop >= document.body.children[0].offsetHeight) {
                // 找到id为loadbutton的a标签, 点击它, 找不到就clearInterval
                let loadButton = document.getElementById("loadbutton");
                if (loadButton) {
                    loadButton.click();
                } else {
                    location.reload();
                }
            }
        }, zhy_settings.scrollInterval || 500);

    }

    /**
     * 保持屏幕焦点
     */
    zhyDaDa.keepFocus = () => {
        const videoDom = document.createElement('video');
        const hiddenCanvas = document.createElement('canvas');
        videoDom.setAttribute('style', 'display:none');
        videoDom.setAttribute('muted', '');
        videoDom.muted = true;
        videoDom.setAttribute('autoplay', '');
        videoDom.autoplay = true;
        videoDom.setAttribute('playsinline', '');
        hiddenCanvas.setAttribute('style', 'display:none');
        hiddenCanvas.setAttribute('width', '1');
        hiddenCanvas.setAttribute('height', '1');
        hiddenCanvas.getContext('2d').fillRect(0, 0, 1, 1);
        videoDom.srcObject = hiddenCanvas.captureStream();
        try {
            unsafeWindow.onblur = () => {
                return true;
            }
            window.onblur = () => {
                return true;
            }
            unsafeWindow.focus();
            window.focus();
        } catch (e) {
            return true;
        }
    }

    zhyDaDa.sendLog("\n###################\n##zhyDaDa 网课助手##\n###################", "启动", 32);
    unsafeWindow.setTimeout(() => { zhyDaDa.insertPanel() }, 1000);
    if (document.title.indexOf("全屏显示") > -1) {
        unsafeWindow.setTimeout(() => { zhyDaDa.readBook() }, 2400);
    } else {
        unsafeWindow.setTimeout(() => { zhyDaDa.main() }, 4800);
        createWorker(() => { zhyDaDa.main() }, 15000);
    }
    createWorker(() => { zhyDaDa.keepFocus() }, 5000);
})();