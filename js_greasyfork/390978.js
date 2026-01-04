// ==UserScript==
// @name         云班课高效助手
// @name:zh-CN   云班课高效助手
// @author       bellamy.n.h
// @namespace    http://tampermonkey.net/
// @version      1.88
// @description  【高效再升级😃！高效使用云班课，一个脚本就够了！😎】 【🧡视频倍速：新增视频倍速控件(支持 倍速递加、递减；倍速重置；一键最佳倍速；视频快进、快退)】、【💛视频连播：新版视频连播功能，支持从当前视频开始连播（配合视频控件，体验更佳）】、【💙快捷键：新增快捷键系统,常用功能都已加入，高效更进一步】、【💚资源处理：批量点击、下载、批处理】 
// @match        https://www.mosoteach.cn/web/index.php*
// @include      *://www.mosoteach.cn/web/index.php*
// @note         Version 1.88    修复视频播放界面点击连播相关按钮无效；修复对全局键盘的频繁操作误判，改为只判断快捷键的频繁操作；修改视频快进、视频快退的速度为一次前进或后退5s；
// @note         Version 1.85 —— 1.87    修复连播视频时数量错误BUG；重构快捷键视图生成代码，降冗余；Add Statistical Analysis System；限制对快捷键的频繁操作；特殊处理部分高频使用的快捷键；Fix Some Bugs。
// @note         Version 1.80    😁【新增视频倍速控件(支持 倍速递加、递减；倍速重置；一键最佳倍速；视频快进、快退)】、【新版视频连播功能，支持从当前视频开始连播（配合视频控件，可达到极度自由）】、【新增快捷键系统,常用功能已都加入，高效更进一步】、【修复模拟点击/下载失效Bug】、【限制全部连播最大速度为8倍】
// @note         Version 1.70    视频最高16倍速连播；调用系统通知，反馈更佳；
// @note         Version 1.65    偷偷改了些小Bug 🤭，使连播更顺畅。下个版本上16倍速连播喽😊
// @note         Version 1.60    新增测试功能，支持 连续播放所有视频、 立即看完当前视频（测试阶段，还请反馈）
// @note         Version 1.50    加强对输入值约束； 支持多栏处理； chrome浏览器自动打开 设置页面地址更改； 其他Bug修复。
// @note         Version 1.40    优化代码；  新增浏览器类型判断，支持chrome浏览器自动打开 设置页面。
// @note         Version 1.32    优化操作反馈 （可以重置已选择的资源栏数）
// @note         Version 1.31    修复可能存在的Bug (页面无法自动关闭)
// @icon         https://s1.ax1x.com/2020/05/18/Yf6Kcd.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/layer.js
// @require      https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/qs@6.9.4/dist/qs.min.js
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/390978/%E4%BA%91%E7%8F%AD%E8%AF%BE%E9%AB%98%E6%95%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/390978/%E4%BA%91%E7%8F%AD%E8%AF%BE%E9%AB%98%E6%95%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


$(function () {
    'use strict';

    var config = {
        isCRX: false,
        notificationTitle: "云班课高效助手",
        icon128: "https://s1.ax1x.com/2020/05/18/Yf6pp4.png",
        icon48: "https://s1.ax1x.com/2020/05/18/Yf6Kcd.png",
        icon32: "https://s1.ax1x.com/2020/05/18/Yf6BBq.png",
        icon16: 'https://s1.ax1x.com/2020/05/18/Yfg71e.png',
        layer_css: "https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/layer.min.css",
        layer_js: "https://cdnjs.cloudflare.com/ajax/libs/layer/2.3/layer.js",
        jquery_js: "https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js",
        layui_js: "https://cdn.jsdelivr.net/npm/layui-src@2.5.5/dist/layui.min.js",
        fontawesome_css: "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.13.0/css/all.min.css",
        base: "https://mst.bellamy.top:8443",

    };

    var openInTab;
    var setVal;
    var getVal;
    var notification;
    var delVal;
    var listVals;
    var qs = Qs;

    if (config.isCRX) {
        console.log("in CRX");
        /**
         * ***********
         * For CRX  Begin
         * ***********
         *
         * ***********
         * Override the following apis provided by TamperMonkey
         * these apis can only work well in TamperMonkey Script
         * but they can not work in CRX
         */

        /**
         * [GM_openInTab : send message to bg.js to create New Tab according to these following parameters]
         * @param {[String]} forWhat [onDownload  or  offDownload]
         * @param {[String]} _url    [new tab]
         * @param {[Boolean]} _option [is or not active]
         */
        function GM_openInTab(_url, _option, forWhat) {

            chrome.runtime.sendMessage({
                createTab: forWhat,
                url: _url,
                option: "active" === _option,
            });

        }

        function GM_setValue(name, value) {

        }

        function GM_getValue(name, defaultValue) {

        }
        /**
         * send message to chrome API
         *      chrome.notifications.create(string notificationId, NotificationOptions options, function callback)
         * @param {[type]}   notificationDetails [description]
         * @param {Function} callback            [description]
         */
        function GM_notification(notificationDetails, callback) {
            chrome.runtime.sendMessage({
                notifDetails: {
                    details: notificationDetails,
                    callbackFunc: callback
                }
            });
        }

        function GM_deleteValue(name) {

        }

        function GM_listValues() {

        }

        /**
         * ***********
         * For CRX End
         * ***********
         */
        openInTab = GM_openInTab; //GM_openInTab(url, option);
        setVal = GM_setValue; // GM_setValue(name, value)
        getVal = GM_getValue; // GM_getValue(name, defaultValue)
        notification = GM_notification; // GM_notification(text, title, image, onclick)
        delVal = GM_deleteValue; // GM_deleteValue(name)
        listVals = GM_listValues; // GM_listValues()


        // inject layer.css
        $("<link>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: config.fontawesome_css
            })
            .appendTo("head");


    } else {
        console.log("in Script ");

        openInTab = GM_openInTab; //GM_openInTab(url, option);
        setVal = GM_setValue; // GM_setValue(name, value)
        getVal = GM_getValue; // GM_getValue(name, defaultValue)
        notification = GM_notification; // GM_notification(text, title, image, onclick)
        delVal = GM_deleteValue; // GM_deleteValue(name)
        listVals = GM_listValues; // GM_listValues()



        // inject layer.css
        $("<link>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: config.layer_css
            })
            .appendTo("head");


        // inject layer.css
        $("<link>")
            .attr({
                rel: "stylesheet",
                type: "text/css",
                href: config.fontawesome_css
            })
            .appendTo("head");

    }

    /**
     * For  notification  function
     * 
     * text - the text of the notification (required unless highlight is set)
     * title - the notificaton title
     * image - the image
     * highlight - a boolean flag whether to highlight the tab that sends the notfication (required unless text is set)
     * silent - a boolean flag whether to not play a sound
     * timeout - the time after that the notification will be hidden (0 = disabled)
     * ondone - called when the notification is closed (no matter if this was triggered by a timeout or a click) or the tab was highlighted
     * onclick - called in case the user clicks the notification
     */
    function getNotificationDetails(_text, _timeout, _title, _image, _highlight, _silent, _ondone, _onclick) {

        let details = {
            text: _text === undefined ? '' : _text,
            title: _title === undefined || _title === null ? config.notificationTitle : _title,
            image: _image === undefined || _image === null ? config.icon48 : _image,
            highlight: _highlight === undefined || _highlight === null ? true : _highlight,
            silent: _silent === undefined || _silent === null ? false : _silent,
            timeout: _timeout === undefined || _timeout === null ? 6000 : _timeout,
            ondone: _ondone === undefined || _ondone === null ? null : _ondone,
            onclick: _onclick === undefined || _onclick === null ? null : _onclick
        };
        return details;

    };


    /**
     *  Determine the browser type
     */
    function browserType() {
        var userAgent = navigator.userAgent; //get browser userAgent string
        var isOpera = userAgent.indexOf("Opera") > -1;
        if (isOpera) {
            return "Opera"
        }; //is Opera or not
        if (userAgent.indexOf("Firefox") > -1) {
            return "FF";
        } //is Firefox or not
        if (userAgent.indexOf("Chrome") > -1) {
            return "Chrome";
        }
        if (userAgent.indexOf("Safari") > -1) {
            return "Safari";
        } //is Safari or not
        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
            return "IE";
        }; //is IE or not
    }
    /**
     *  sleep function
     *  @param numberMillis -- 要睡眠的毫秒数
     */
    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return;
        }
    }

    /**
     * Remove duplicate value in array
     */
    function removeDuplicate(arr) {
        let x = new Set(arr);
        return [...x];
    }
    /**
     *   download resources function
     */
    function download(name, href) {
        var a = document.createElement("a"), //创建a标签
            e = document.createEvent("MouseEvents"); //创建鼠标事件对象
        e.initEvent("click", false, false); //初始化事件对象
        a.href = href; //设置下载地址
        a.download = name; //设置下载文件名
        a.dispatchEvent(e); //给指定的元素，执行事件click事件
    }

    /**
     * Refresh page tips
     */
    function refreshPage() {
        alert("操作完成，请小可爱刷新页面查看结果！！！");
    }

    /**
     * cancel action
     */
    function cancel() {
        alert("已取消操作！");
    }
    /**
     *  点击和下载前以弹窗二次确认
     *  modeName
     *  return boolean
     **/
    function popupComfirm(modeName) {
        let conf_str = false;
        conf_str = confirm("小可爱，你即将执行“" + modeName + "”操作！！！" + "\n\n" +
            "根据选择资源数量的不同，会打开相应数量的页面，如果数量较多，请不要惊慌，因为这些页面会自动关闭的哦！！！" + "\n\n" +
            "你是否按照上一个提示，进行了相应的操作？" + "\n\n" + "如果是，你是否要开始执行本次操作？");
        return conf_str;
    }

    /**
     * cleaning data  数据清洗 inputString -> idsArr
     */
    function cleanData(inputString) {
        //去除字符串中的所有空格
        inputString.replace(/\s*/g, "");
        //去掉首尾的 - 字符
        if (inputString.charAt(0) == "-") {
            if (inputString.charAt(inputString.length - 1) == "-")
                inputString = inputString.substring(1, inputString.length - 1);
            else
                inputString = inputString.substring(1, inputString.length);
        } else if (inputString.charAt(inputString.length - 1) == "-") {
            inputString = inputString.substring(0, inputString.length - 1);
        }
        //console.log(inputString + "/" + inputString.charAt(0) +"/" + inputString.charAt(inputString.length-1));
        //分割出要点击的栏号，存入数组，用于映射出对应的资源栏id
        let idsArr = inputString.split("-");
        //去重并排序
        idsArr = removeDuplicate(idsArr).sort();
        //去除超出资源栏总数的无效值
        let temp = [];
        for (let i = 0; i < idsArr.length; i++) {
            // console.log("srcBarSum is" + srcBarSum);
            if (idsArr[i] <= srcBarSum && idsArr[i] > 0) {
                temp.push(idsArr[i]);
                // console.log("temp is" + temp);
            }
        }
        // console.log("idsArr is" + idsArr);
        return idsArr = temp;

    }

    /**
     *  根据模式名执行对应的批量处理操作
     *
     *  点击确认按钮弹出确认弹窗，
     *  如果确认执行，则执行点击操作，
     *  否则执行 取消操作
     */
    function batchForMoreSrcBars(modeName, ids) {
        if (ids.length == 0)
            ids.push(".res-row-box");

        let isDownloadMode = modeName == "模拟点击" ? "false" : (modeName == "批量下载" ? "true" : "其他");

        if (popupComfirm(modeName)) {
            try {
                // console.log(chosenIDs);
                let startIndex = $("#head").val();
                let endIndex = $("#tail").val();
                for (let id of ids) {
                    // console.log(thisID);
                    try {
                        batch(isDownloadMode, id, startIndex, endIndex);
                    } catch (e) {
                        console.log(id + "该栏执行异常，跳过执行");
                        continue;
                    }
                }
            } finally {
                //点击完成，提示刷新页面
                setTimeout(refreshPage, 0);
                //置空栏号输入框
                $(".indexNum").val("");

            }
        } else {
            cancel();
        }
    }

    /**
     *  Click or download in bulk according to
     *  isDownload : true -> Download Mode  ;  false -> Click Mode
     *  thisBarID  : 此次要执行的资源栏 id
     *  startIndex : 此次资源栏中执行的开始资源编号
     *  endIndex   : 此次资源栏中执行的结束资源编号
     *
     */
    function batch(isDownload, thisBarID, startIndex, endIndex) {
        //let isDownloadMesg = isDownload == "false" ? "模拟点击" : "批量下载";

        //  以下五个等价，实现相同功能，但写法是逐步优化
        //  var list = document.getElementsByClassName("res-row-open-enable");
        //  var list = $(".res-row-open-enable");
        //  var list = $(".hide-div").children();
        //  var list = $(".res-row-box").children(".hide-div").children();
        let list = $(thisBarID).children(".hide-div").children();
        let succNum = 0;
        let failNum = 0;
        let tempUrl;
        let win;

        let actualStartIndex = startIndex <= list.length && startIndex > 0 ? startIndex : (startIndex <= 0 ? 1 : list.length); //小于0则为 1 ； 大于 最大值 则为 最大值
        let actualEndIndex = endIndex <= list.length && endIndex > 0 ? endIndex : (endIndex <= 0 ? 1 : list.length); //输入值超出资源总数的值，则将输入值置为总数的值
        if (actualStartIndex > actualEndIndex) {
            //console.log("here");
            alert("小可爱😀，你的起始结束值写反了哟！");
            return;
        }
        // console.log("actualStartIndex: " + actualStartIndex);
        // console.log("actualEndIndex: " + actualEndIndex);
        // list 存在并不为空
        if (null == list || list.length == 0) {
            console.log(thisBarID + "对应的资源栏为空");
        } else {

            for (let i = actualStartIndex - 1; i < actualEndIndex; i++) {
                // console.log(i);
                // console.log(list);
                // console.log(list[i]);
                try {

                    tempUrl = list[i].getAttribute("data-href");
                    if (null == tempUrl || tempUrl == "") {

                        console.log("资源栏：" + thisBarId + "的第 " + (i + 1) + " 条资源未获取到URL");

                    } else {

                        win = window.open(tempUrl);
                        if (isDownload == 'false') {
                            sleep(100); //睡眠，是为了确保每个资源都被正常获取
                            win.close();
                        }
                        succNum++;
                        // console.log(tempUrl);

                    }
                } catch (e) {
                    console.log(e.name + ": " + e.message);
                    console.log("资源栏：" + thisBarId + "的第 " + (i + 1) + " 条未成功执行 ；URL :   " + list[i].getAttribute("data-href"));
                    failNum++;
                    continue;
                }
            }

        }
        console.log("共检索到 " + list.length + "条； 成功执行 " + succNum + " 次！ 失败 " + failNum + " 次！ 操作范围：从第 " + actualStartIndex + " 条 至 第 " + actualEndIndex + " 条。");
    }

    /**
     *  click all resources in two ways according to 'isPositive'
     */
    function clickAll(isPositive) {

        let isPositiveMesg = isPositive == "true" ? "正序点击" : "倒序点击";

        let conf_str = false;
        conf_str = confirm("小可爱，你即将执行“" + isPositiveMesg +
            "全部资源”操作，如果资源量较大（> 1000），耗时就会较久，打开的页面也会较多哦！不过都会自动关闭的哦！！！" + "\n\n" +
            "小可爱，资源较多时，还请三思啊！！！" + "\n\n" + "你是否要执行？");
        if (conf_str) {
            let list = document.getElementsByClassName("res-row-open-enable");
            let succNum = 0;
            let failNum = 0;
            let tempUrl;
            let win;
            if (isPositive == "true") {
                for (let i = 0; i < list.length; i++) {
                    try {
                        tempUrl = list[i].getAttribute("data-href");
                        win = window.open(tempUrl);
                        sleep(100); //睡眠，是为了确保每个资源都被正常获取
                        win.close();
                        succNum++;
                        // console.log(tempUrl);
                    } catch (e) {
                        console.log(e.name + ": " + e.message);
                        console.log("该条未成功执行 ；URL :   " + list[i].getAttribute("data-href"));
                        failNum++;
                        continue;
                    }
                }
            } else {
                for (let i = list.length - 1; i >= 0; i--) {
                    try {
                        tempUrl = list[i].getAttribute("data-href");
                        win = window.open(tempUrl);
                        sleep(100); //睡眠，是为了确保每个资源都被正常获取
                        win.close();
                        succNum++;
                        // console.log(tempUrl);
                    } catch (e) {
                        console.log(e.name + ": " + e.message);
                        console.log("该条未成功执行 ；URL :   " + list[i].getAttribute("data-href"));
                        failNum++;
                        continue;
                    }
                }
            }
            console.log(isPositiveMesg + "：  共检索到 " + list.length + "条； 成功执行 " + succNum + " 次！ 失败 " + failNum + " 次！");
            setTimeout(refreshPage, 0);
        } else {
            alert("已取消操作！");
        }
    }

    /**
     *  open a new tab according the url and execute callback function
     */
    function newTabAlert(forWhat, url, option, callback) {
        if (config.isCRX)
            openInTab(url, option, forWhat);
        else
            openInTab(url, option);
        if (typeof callback === "function") {
            callback();
        }
    }



    /******************************************
     * play videos
     * 
     */

    let playVideoConfig = {
        isContinuous: false,
        isPlayAll: false,
        isPlayPart: false,
        videoDuration: '',
    };



    /**********************************************
     *  Play  all videos continuously
     */

    let arr = [];
    let count = 0;
    let interval;
    let timeout;
    let intervalTime = 4000; //millisecond
    let isContinuousPaly = false;
    let rate = 1; // <=10
    let weight = 1000 / rate;
    let currentVideoIndex = 0;
    let nextVideoIndex = 0; //当前第几个视频
    let bufferTime = 10000; // millisecond
    let maxRate = 8;
    let log = '';

    //将所有视频资源存入数组，以作点击使用
    let a = $("div[data-mime='video']");
    let tempArr = Object.keys(a);
    let tpArr = tempArr.slice(0, tempArr.length - 2);
    tpArr.forEach((key) => {
        //console.log(key, a[key]);
        arr.push(a[key]);
    });
    //console.log(arr.length);
    // for (let a in arr) {
    //  console.log(a);
    // }
    // 
    playVideoConfig.videoDuration = $('.video-duration');


    function onContinuousPlayFunc() {

        if (playVideoConfig.isContinuous) {
            layer.msg('【无效操作】 ： 连播功能已开启');
            return;
        }

        playVideoConfig.isContinuous = true;

        if (typeof ($("#continuousPlay").attr("class")) != "undefined") {
            let text = "连续播放已开启,无需重复开启";
            //alert(text);
            notification(getNotificationDetails(text), null);
            //layer.msg("test");
            return;
        }

        alert("请先关闭 【 Win10 专注助手 】 再使用，否则无法正常提示信息 \n\n 提示：在通知托盘中关闭");


        //      $('<div id = "continuousPlay" class="mejs__button">\
        // <button type="button" aria-controls="mep_0" title="开始连续播放" aria-label="Play" tabindex="0"></button>\
        // </div>\
        // <div id = "stopContinuousPlay" class="mejs__button mejs__playpause-button mejs__pause">\
        // <button type="button" aria-controls="mep_0" title="暂停连续播放" aria-label="Pause" tabindex="0"></button>\
        // </div>\
        // <div id = "continuousPlayN" class="mejs__button">\
        // <button type="button" aria-controls="mep_0" title="开始连续播放(n)" aria-label="Play" tabindex="0"></button>\
        // </div>\
        // <div id = "stopContinuousPlayN" class="mejs__button mejs__playpause-button mejs__pause">\
        // <button type="button" aria-controls="mep_0" title="暂停连续播放(n)" aria-label="Pause" tabindex="0"></button>\
        // </div>\
        // ').insertAfter(".mejs__fullscreen-button");

        $('<div id="helper-btn" class="content-center" style="background-color:rgba(255, 255, 255, 0.5);">\
            <span class="video-btn content-center"><i id="continuousPlayAll" class="fa fa-play-circle" aria-hidden="true" style="cursor:pointer"></i></span>\
            <span class="video-btn content-center"><i id="stopContinuousPlayAll" class="fa fa-stop-circle" aria-hidden="true" style="cursor:pointer"></i></span>\
            <span class="video-btn content-center"><i id="continuousPlayPart" class="fa fa-play" aria-hidden="true" style="cursor:pointer"></i></span>\
            <span class="video-btn content-center"><i id="stopContinuousPlayPart" class="fa fa-stop" aria-hidden="true" style="cursor:pointer"></i></span>\
            </div>').insertBefore("#preview-video");

        //For all
        $("#continuousPlayAll").click(() => {
            startContinuousPlayAll();
        });

        $("#stopContinuousPlayAll").click(() => {
            stopContinuousPlayAll();

        });


        //For part
        $("#continuousPlayPart").click(() => {
            startContinuousPlayForPart();
        });

        $("#stopContinuousPlayPart").click(() => {
            stopContinuousPlayForPart();
        });



        let txt = "连续播放已开启，请到视频播放页面使用";
        notification(getNotificationDetails(txt), null);
    }


    /**
     * close continuous play
     * 
     */
    function offContinuousPlayFunc() {

        if (!playVideoConfig.isContinuous) {
            layer.msg('【无效操作】 ： 连播功能已关闭');
            return;
        }

        $('#continuousplayAll, #stopContinusPlayAll, #continuousPlayPart, #stopContinusPlayPart').unbind();
        $('#helper-btn').remove();
        if (playVideoConfig.isPlayAll) {
            stopContinuousPlayAll();
        }
        if (playVideoConfig.isPlayPart) {
            stopContinuousPlayForPart();
        }
        playVideoConfig.isContinuous = false;
        layer.msg('连播功能已关闭！');
    }



    /**
     * For all
     * steps that must be taken when start  playing continuously
     */
    function startContinuousPlayAll() {

        if (playVideoConfig.isPlayPart) {
            layer.msg('【无效操作】 : 正常连播进行中...');
            return;
        }
        if (isContinuousPaly) {
            layer.msg("【无效操作】：全部连播进行中...");
            return;
        }


        if (playBySpecifiedRateAndNotify()) {
            $('.video-duration').remove();
            playVideoConfig.isPlayAll = true;
            isContinuousPaly = true;
            layer.msg('禁用进度条', function () {
                clickDiv();
            });

        } else {
            notification(getNotificationDetails("已取消本次操作！"), null);
        }
    }

    /**
     * For all
     * steps that must be taken when stopping  playing continuously
     */
    function stopContinuousPlayAll() {


        if (playVideoConfig.isPlayPart) {
            stopContinuousPlayForPart();
            playVideoConfig.isPlayPart = false;
        }

        if (!isContinuousPaly) {
            layer.msg("【无效操作】：全部连播未执行");
            return;
        }
        // console.log("llllllllll:"+$('.video-duration') );
        if ($('.video-duration').length == 0) {
            $(playVideoConfig.videoDuration).insertAfter('#mep_0');
        }
        isContinuousPaly = false;
        playVideoConfig.isPlayAll = false;
        //停掉当前还未执行完的 interval timeout
        clearInterval(interval);
        clearTimeout(timeout);
        layer.msg('全部连播已关闭');
        let stopContinusPlayText = "已退出连续播放模式，但保留了关闭视频即可看完功能;\n下一次连续播放从第 " + (nextVideoIndex + 1) + " 个视频开始。";
        //alert(stopContinusPlayText);
        notification(getNotificationDetails(stopContinusPlayText), null);
    }

    /**
     * For part
     * start playing continuously part of all the specified videos 
     */
    function startContinuousPlayForPart() {

        if (playVideoConfig.isPlayAll) {
            layer.msg('【无效操作】 : 全部连播进行中...');
            return;
        }
        if (videoConfig.isContinuousPaly) {
            layer.msg("【无效操作】：正常连播进行中...");
            return;
        }


        playVideoConfig.isPlayPart = true;
        videoConfig.isContinuousPaly = true;
        play(videoConfig.currentVideoDivs);
    }

    //部分连播
    //开始时不需要设置播放速度，
    //结束时不需要提示下次播放位置
    //只需开始/结束提即可
    /**
     * For part
     * stop playing continuously part of all the specified videos 
     */
    function stopContinuousPlayForPart() {


        if (playVideoConfig.isPlayAll) {
            stopContinuousPlayAll();
            playVideoConfig.isPlayAll = false;
        }


        if (!videoConfig.isContinuousPaly) {
            layer.msg("【无效操作】：正常连播未执行");
            return;
        }

        videoConfig.isContinuousPaly = false;
        playVideoConfig.isPlayPart = false;

        let video = document.querySelector('video');
        let isPaused = video.paused;
        if (isPaused) {
            video.play();
            video.pause();
        } else {
            video.pause();
            video.play();
        }
    }

    /**
     * unlock progress bar and click this div
     * return the index of layer
     */
    function unlockBarAndClickDiv(div, func) {
        layer.msg('解锁进度条中...', {
            time: 1500,
        },
            function () {
                let info = '未上锁';
                if ($(div).attr('data-drag') == 'N') {

                    $(div).attr('data-drag', 'Y');
                    info = '已解锁！';

                }
                layer.msg(info, {
                    time: 1500
                },
                    function () {
                        $(div).trigger('click');
                        if (typeof func === "function") {
                            func();
                        }
                    });

            });
    }

    /**
     * is or not a number
     * @param  {[type]}  val [description]
     * @return {Boolean}     [description]
     */
    function isNumber(val) {

        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }

    }

    /**
     * play next videos according to the specified  rate inputed by user  and  notify user
     */
    function playBySpecifiedRateAndNotify() {

        let inputRate = prompt("以几倍速度进行连续播放呀🧐（最高" + maxRate + "倍哦！）建议1.8倍最佳🤭");
        //console.log(inputRate);
        if (inputRate == null) {
            return false;
        }
        if (!isNumber(inputRate)) {
            let text = "啥❓ 你输入了啥，那是数字吗？\n 再输一次吧，别输出咯！😀";
            notification(getNotificationDetails(text), null);
            return false;
        }
        rate = inputRate <= 0 ? 1 : (inputRate > maxRate ? maxRate : inputRate);
        weight = 1000 / rate;
        let text = "连续播放已开始！\n将以 " + rate + " 倍速 播放 " + (arr.length - nextVideoIndex) + " 个视频。";
        //console.log(text);
        notification(getNotificationDetails(text), null);
        return true;

    }
    /**
     * edit those value about duration before sending ajax
     */
    function send() {
        $.ajaxSetup({
            beforeSend: function () {
                let argsData = arguments[1].data
                let falseArgsData = "";
                let falseVal;
                for (let k in argsData) {

                    if (k.includes("watch_to")) {
                        //console.log("before: " + k + " : " + argsData[k]);
                        falseVal = argsData.duration;
                        //console.log("after: " + k + " : " + falseVal);
                    } else {
                        falseVal = argsData[k];
                    }
                    falseArgsData = falseArgsData + "&" + k + "=" + falseVal;
                }
                arguments[1].data = falseArgsData.substring(1, falseArgsData.length);
            },
            processData: false,
            complete: function () {
                console.log("send completed");
            }
        });
    }
    /**
     * trigger the click action of the current DIV
     *
     */
    function clickDiv() {
        currentVideoIndex = count++;
        nextVideoIndex = currentVideoIndex + 1;

        if (isContinuousPaly == false) {
            //console.log("在播放第 " + (nextVideoIndex) + " 个视频时退出了连续播放");
            return;
        }

        //第一次使用连续播放开启 关闭即可看完
        if (currentVideoIndex == 0) {
            send();
        }

        if (currentVideoIndex < arr.length) {
            // $(arr[currentVideoIndex]).trigger("click");
            unlockBarAndClickDiv(arr[currentVideoIndex], playThisVideo);
            // setTimeout(function() {layer.close(index)}, videoConfig.loadingTime);
            //console.log(currentVideoIndex + " :  " + arr[currentVideoIndex]);
            // playThisVideo();
        } else {
            setTimeout(() => {
                clearInterval(interval);
            }, 0);
            //console.log("currentVideoIndex: " + currentVideoIndex);
            //关掉最后一个视频
            $(".close-window").trigger("click");
            alert("连续播放结束， 共连续播放了 " + arr.length + " 个视频，即将刷新页面");
            location.reload();
        }
    }

    /**
     * play the current video until it is over and play the next video
     */
    function playThisVideo() {
        if (currentVideoIndex >= arr.length) {
            return;
        }
        let duration;
        let currentTime;
        setTimeout(() => {
            let video = document.querySelector('video');
            let duration = video.duration;
            let currentTime = video.currentTime;
            let isPaused = video.paused;
            //console.log(isPaused ? "暂停" : "未停");
            // if video has paused then play the video
            if (isPaused) {
                $(".mejs__replay").trigger("click");
                //console.log("开始播放");
            }
            setTimeout(() => {
                //console.log(document.querySelector('video').paused ? "暂停" : "未停");
            }, 500);
            video.playbackRate = rate;

            //second --> millisecond
            let remain = (duration - currentTime) * weight;

            console.log("该视频剩余播放时长 ：" + remain + " 毫秒");

            //停掉上一个interval timeout
            clearInterval(interval);
            clearTimeout(timeout);

            //is NaN
            if (duration != duration || currentTime != currentTime || remain != remain) {

                stopContinuousPlayAll();
                notification(getNotificationDetails("执行异常，已停止本次连播。" +
                    "\n下一次连续播放从第 " + (nextVideoIndex + 1) + " 个视频开始。", 10000), null);
                return;

            }


            interval = setInterval(clickDiv, remain + intervalTime);

            timeout = setTimeout(() => {
                //console.log("当前视频播放到：" + document.querySelector('video').currentTime);
                $(".close-window").trigger("click");
                //console.log("关闭第" + nextVideoIndex + "个视频");
                //console.log(intervalTime + " 毫秒后播放下一个视频");
            }, remain);

        }, bufferTime);
    }


    /**
     * play all the videos since this video
     */
    let videoConfig = {
        videoSum: 0,
        currentVideoId: '',
        currentVideoDivs: arr,
        isContinuousPaly: false,
        loadingTime: 6000,
        rate: 1,

    }

    $("div[data-mime='video']").each(function (i, e) {
        let ts = $(this);
        ts.attr('id', 'vdoId_' + i);
        ts.bind('click', function (event) {
            /* Act on the event */
            let id = videoConfig.currentVideoId = ts.attr('id');
            let split = id.split('_');
            let newFirstIndex = Number(split[1]);
            videoConfig.currentVideoDivs = arr.slice(newFirstIndex);
            //console.log(videoConfig.currentVideoDivs);

        });
        videoConfig.videoSum = ++i;
    });


    //每拿一个阻塞一次，
    function play(videosArr) {

        layer.msg(
            "连播开始！(共" + videosArr.length + "个)", {
            time: 3000
        },

            async function () {
                let isOver = true;
                for (let i = 0; isOver && i < videosArr.length; i++) {
                    //console.log("time:" + i);
                    isOver = await playOne(videosArr[i]);

                }
                //console.log("Done all");
                videoConfig.isContinuousPaly = false;
                layer.msg("连播结束！");
            }
        );
    }



    function playOne(div) {
        unlockBarAndClickDiv(div);
        let index = layer.load();

        // if(document.querySelector('video').readyState == 4){
        //  layer.msg("OK");
        // };
        return new Promise(resolve => {
            setTimeout(() => {

                //close load
                layer.close(index);

                let video = document.querySelector('video');

                let onPause = function () {
                    let a = video.currentTime == 0 || video.currentTime == video.duration;
                    let b = videoConfig.isContinuousPaly;
                    if (b && a) {
                        //视频播完会回到开头如果没有回到开头应该在结尾
                        resolve(true);
                        //console.log("连播&结束");
                    } else if (!b && !a) {
                        //如果按下暂停前关闭了连续播放 == 结束本次列表循环
                        resolve(false);
                        //console.log("play stopped");
                    } else if (b && !a) {
                        //如果还在连续播放但是按下暂停 == 暂停 ，什么也不做
                        //console.log("play blocked");
                    } else if (!b && a) {
                        //不再连播但播放结束
                        resolve(false);
                        //console.log("不连播&结束");
                    }
                }

                video.removeEventListener('pause', onPause, false);
                // let duration = video.duration;
                // let currentTime = video.currentTime;
                let isPaused = video.paused;
                //console.log(isPaused ? "本是暂停" : "本是播放");
                // if video has paused then play the video
                if (isPaused) {
                    $(".mejs__replay").trigger("click");
                    //console.log("暂停-》开始播放");
                }
                setTimeout(() => {
                    //console.log(document.querySelector('video').paused ? "依旧暂停" : "已打开播放");
                }, 500);
                video.playbackRate = keyboardEvent.currentSpeed;
                // video.addEventListener("ended", function() {
                //  resolve(true);
                //  console.log("this over");
                // });
                video.addEventListener('pause', onPause);

            }, videoConfig.loadingTime);

        });

    }


    /**********************************************
     * keyMap module
     */
    let keyboardEvent = {
        keyBindings: [],
        speedStep: 0,
        rewindTime: 0,
        advanceTime: 0,
        fastSpeed: 0,
        slowerKeyCode: 0,
        fasterKeyCode: 0,
        rewindKeyCode: 0,
        advanceKeyCode: 0,
        resetKeyCode: 0,
        fasterKeyCode: 0,
        currentSpeed: 1.0,
        functionKey: {
            keyMap: 0,
            playAll: 0,
            stopPlayAll: 0,
            playPart: 0,
            stopPlayPart: 0,
            onContinuousPlayFunc: 0,
            offContinuousPlayFunc: 0,
            showTips: 0

        },
        keyMapInfo: ``,
        keyMapDetail: []

    };


    // for video
    keyboardEvent.keyBindings.push({
        action: "slower",
        key: Number(keyboardEvent.slowerKeyCode) || 83,
        value: Number(keyboardEvent.speedStep) || 0.1,
        force: false,
        predefined: true
    }); // default S
    keyboardEvent.keyBindings.push({
        action: "faster",
        key: Number(keyboardEvent.fasterKeyCode) || 87,
        value: Number(keyboardEvent.speedStep) || 0.1,
        force: false,
        predefined: true
    }); // default: W
    keyboardEvent.keyBindings.push({
        action: "rewind",
        key: Number(keyboardEvent.rewindKeyCode) || 65,
        value: Number(keyboardEvent.rewindTime) || 5,
        force: false,
        predefined: true
    }); // default: A
    keyboardEvent.keyBindings.push({
        action: "advance",
        key: Number(keyboardEvent.advanceKeyCode) || 68,
        value: Number(keyboardEvent.advanceTime) || 5,
        force: false,
        predefined: true
    }); // default: D
    keyboardEvent.keyBindings.push({
        action: "reset",
        key: Number(keyboardEvent.resetKeyCode) || 82,
        value: 1.0,
        force: false,
        predefined: true
    }); // default: R
    keyboardEvent.keyBindings.push({
        action: "fast",
        key: Number(keyboardEvent.fastKeyCode) || 71,
        value: Number(keyboardEvent.fastSpeed) || 1.8,
        force: false,
        predefined: true
    }); // default: G


    // for functions
    keyboardEvent.keyBindings.push({
        action: 'keyMap',
        key: Number(keyboardEvent.functionKey.keyMap) || 77
    }); // M
    keyboardEvent.keyBindings.push({
        action: 'playAll',
        key: Number(keyboardEvent.functionKey.playAll) || 90
    }); // Z
    keyboardEvent.keyBindings.push({
        action: 'stopPlayAll',
        key: Number(keyboardEvent.functionKey.stopPlayAll) || 88
    }); // X
    keyboardEvent.keyBindings.push({
        action: 'playPart',
        key: Number(keyboardEvent.functionKey.playPart) || 67
    }); // C
    keyboardEvent.keyBindings.push({
        action: 'stopPlayPart',
        key: Number(keyboardEvent.functionKey.stopPlayPart) || 86
    }); // V
    keyboardEvent.keyBindings.push({
        action: 'onContinuousPlayFunc',
        key: Number(keyboardEvent.functionKey.onContinuousPlayFunc) || 66
    }); // B
    keyboardEvent.keyBindings.push({
        action: 'offContinuousPlayFunc',
        key: Number(keyboardEvent.functionKey.offContinuousPlayFunc) || 78
    }); // N


    keyboardEvent.keyBindings.push({
        action: 'showTips',
        key: Number(keyboardEvent.functionKey.showTips) || 84
    }); // T


    /**
     * get the content of the action specified 
     * the action bound to some event
     * @return  json
     */
    function getKeyBindingsByAction(action) {

        let item = keyboardEvent.keyBindings.find(item => item.action === action);
        return item;

    }

    /**
     * get the value  by specified action and keyname
     * @param  {string} action  [the action bound to some event]
     * @param  {string} keyname 
     * @return {[type]}         
     */
    function getValueByActionAndKeyname(action, keyname) {
        return getKeyBindingsByAction(action)[keyname];
    }

    /**
     * [get  all  values by specified keyname  ]
     * @return {[array]} [all values]
     */
    function getAllValuesByKeyname(keyname) {
        let all = [];
        let arr = keyboardEvent.keyBindings;
        for (let i in arr) {
            let x = arr[i];
            /**
             * access value by variable key
             * x.keyname  ==> x[keyname]
             */
            all.push(x[keyname]);
        }
        // console.log('all:'+ all);
        return all;
    }

    function changeKeycode(keycodeArr, toLowercase) {

        let arr = [];
        for (let i in keycodeArr) {
            // if (toLowercase) {
            //  arr.push(keycodeArr[i] + 32);
            // }else{
            //  arr.push(keycodeArr[i] - 32);
            // }
            toLowercase == true ? arr.push(keycodeArr[i] + 32) : arr.push(keycodeArr[i] - 32);

        }
        //console.log(keycodeArr + '****' + arr);

        return arr;

    }

    /**
     * initialize  keyboardEvent: keyMapInfo keyMapDetail
     * @type {[type]}
     */

    keyboardEvent.keyMapDetail = [

        ['强制关闭Chrome', 'Alt + F4'],
        ['查看快捷键', 'shift + m'],
        ['弹出提示', 'shift + t'],
        [`视频加速 （+${getKeyBindingsByAction('faster').value}）`, 'W'],
        [`视频减速 （-${getKeyBindingsByAction('slower').value}）`, 'S'],
        [`视频快退 ${getKeyBindingsByAction('rewind').value}s`, 'A'],
        [`视频快进 ${getKeyBindingsByAction('advance').value}s`, 'D'],
        [`最佳倍速 （${getKeyBindingsByAction('fast').value}）`, 'G'],
        [`重置倍速 （${getKeyBindingsByAction('reset').value}）`, 'R'],
        ['开启连播', 'shift + b'],
        ['关闭连播', 'shift + n'],
        ['开始正常连播', 'shift + c'],
        ['结束正常连播', 'shift + v'],
        ['开始全部连播', 'shift + z'],
        ['结束全部连播', 'shift + x']

    ];
    //获取 快捷键列表
    function getKeyMapView() {
        let viewArr = keyboardEvent.keyMapDetail.map((item) => {
            return `<p class="content-center"><span class="keyMap-name"> ${item[0]} </span> <span class="keyMap-value"> ${item[1]} </span></p>`
        });
        return viewArr.join(' ');
    }

    keyboardEvent.keyMapInfo = `
    <div id="keyMapInfo">
    <p class="content-center keyMap-head"><span class="keyMap-name">功能</span><span class="keyMap-value">快捷键</span></p>
    <hr>
    ${getKeyMapView()}
    </div>
    `;

    /**
     * bind keyboard eventListener to document
     */
    let lastTimeStamp = 0;
    let isSameKey = false;
    let lastKeyCode = 0;
    let recent2KeysInterval = 0;
    let requiredInterval = 200;

    /**
     * 如果连续两次操作同一个快捷键的时间间隔小于要求的时间间隔，则不执行
     */
    function isFrequent(interval, requiredInterval){
        if (isSameKey && (interval < requiredInterval) ) {
            layer.msg("操作过于频繁");
            return;
        }
    }

    $(document).bind('keypress', function (event) {
        /* 禁止频繁操作 */
        let curTimeStamp = event.timeStamp;
        recent2KeysInterval = curTimeStamp - lastTimeStamp;
        lastTimeStamp = curTimeStamp;
        
        //此处写法会导致对所有keydown生效
        // if (recent2KeysInterval < 200) {
        //     layer.msg("操作过于频繁");
        //     return;
        // }

        /* Act on the event */
        let keyCode = event.keyCode;
        let altKey = event.altKey;
        let ctrlKey = event.ctrlKey;
        let shiftKey = event.shiftKey;
        //console.log("keyCode:" + keyCode);

        /* 记录最近两次按下是否为同一个 key */
        isSameKey = lastKeyCode == keyCode ? true : false;
        lastKeyCode = keyCode;


        let lowercase = changeKeycode(getAllValuesByKeyname('key').slice(0, 6), true);
        // console.log('[119, 115, 97, 100, 114, 103]:' + lowercase);
        let funcKeyLowercase = changeKeycode(getAllValuesByKeyname('key').slice(6), true);
        // console.log("[109, 122, 120, 99, 118, 98, 110]:" + funcKeyLowercase);
        let funcKeyUppercase = getAllValuesByKeyname('key').slice(6);
        // console.log("[77, 90, 88, 67, 86, 66, 78]：" + funcKeyUppercase);
        let playVdoFuncKeyLowercase = getAllValuesByKeyname('key').slice(7, 11);

        // shift + lowercase => uppercase    小写键盘
        let shiftAndLowercase = shiftKey && ((funcKeyUppercase.find(item => item === keyCode) === undefined ? false : true));
        // shift + uppercase => lowercase    大写键盘
        let shiftAndUppercase = shiftKey && ((funcKeyLowercase.find(item => item === keyCode) === undefined ? false : true));

        let shiftAndPlayVdoLowercase = shiftKey && ((playVdoFuncKeyLowercase.find(item => item === keyCode) === undefined ? false : true));

        if (!document.querySelector('video').paused) {

            if (lowercase.find(item => item === keyCode)) {
                //console.log("is pause:"+ document.querySelector('video').paused);
                layer.msg('请打开大写键盘 以使用 【视频控件】');
                return;
            }
            if (shiftAndUppercase) {
                layer.msg('请关闭大写键盘 以使用完整的快捷键功能');
                return;
            }
            if (shiftAndPlayVdoLowercase) {
                if (!playVideoConfig.isContinuous) {
                    layer.msg('请先开启连播功能');
                    return;
                }

            }

        } else if (document.querySelector('video').paused) {

            if (shiftAndUppercase) {
                layer.msg('请关闭大写键盘！以使用完整的快捷键功能');
                return;
            }
            //四个连播功能（ZXCV）在没有开启连播时，提醒开启连播功能
            if (shiftAndPlayVdoLowercase) {
                if (!playVideoConfig.isContinuous) {
                    layer.msg('请先开启连播功能');
                    return;
                }
            }
            if (!shiftAndLowercase) {
                return;
            }

        }


        let item = keyboardEvent.keyBindings.find(item => item.key === keyCode);
        if (item) {

            let video = document.querySelector('video');
            doAction(item, video);

        }

    });



    /**
     * [doAction description]
     * @param  {[type]} item  [that event triggered]
     * @param  {[type]} video [description]
     */
    function doAction(item, video) {

        //避免频繁的快捷键操作（只对存在的快捷键有效）
        //如果连续两次操作同一个快捷键的时间间隔小于要求的时间间隔，则操作无效
        if (isSameKey && (recent2KeysInterval < requiredInterval) ) {
            layer.msg("操作过于频繁");
            return;
        }

        let action = item.action;
        let value = item.value;
        let num = (video.playbackRate).toFixed(1);

        /**
         * send a record ( special Keys )
         */
        if (keyboardEventMap.has(action)) {

            if (
                !(specialKeyboardEventMap.has(action)
                    && isSameKey
                    && recent2KeysInterval < statConfig.specialKeysInterval)
            ) {
                // console.log('not special keys')
                // console.log(specialKeyboardEventMap.has(action));
                // console.log(isSameKey);
                // console.log(recent2KeysInterval);
                record(keyboardEventMap.get(action))
            }
        }


        if (action == 'slower') {

            video.playbackRate -= value;
            num = (video.playbackRate).toFixed(1);
            keyboardEvent.currentSpeed = num;
            layer.msg(num + " 倍");

        } else if (action == 'faster') {

            video.playbackRate += value;
            num = (video.playbackRate).toFixed(1);
            keyboardEvent.currentSpeed = num;
            layer.msg(num + " 倍");

        } else if (action == 'rewind') {

            video.currentTime -= value;
            layer.msg("- " + value + 's');
            return;

        } else if (action == 'advance') {

            video.currentTime += value;
            layer.msg("+ " + value + 's');
            return;

        } else if (action == 'reset') {

            video.playbackRate = value;
            num = (video.playbackRate).toFixed(1);
            keyboardEvent.currentSpeed = num;
            layer.msg(num + " 倍");

        } else if (action == 'fast') {

            video.playbackRate = value;
            num = (video.playbackRate).toFixed(1);
            keyboardEvent.currentSpeed = num;
            layer.msg(num + " 倍");

        } else if (action == 'keyMap') {

            let i = layer.alert(
                keyboardEvent.keyMapInfo, {
                //icon: 1
                anim: 2
            },
                function (index) {
                    //layer.msg('操作成功！');
                    layer.close(index);
                });

            layer.title('Key Map', i);
            return;


        } else if (action == 'playAll') {
            $("#continuousPlayAll").trigger('click');
            return;

        } else if (action == 'stopPlayAll') {
            $("#stopContinuousPlayAll").trigger('click');
            return;

        } else if (action == 'playPart') {
            $("#continuousPlayPart").trigger('click');
            return;

        } else if (action == 'stopPlayPart') {
            $("#stopContinuousPlayPart").trigger('click');
            return;
        } else if (action == 'onContinuousPlayFunc') {
            onContinuousPlayFunc();
            return;

        } else if (action == 'offContinuousPlayFunc') {
            offContinuousPlayFunc();
            return;
        } else if (action == 'showTips') {
            showTips();
            return;
        }



    }


    /************************************
     * tips module
     */

    let tipsConfig = {
        params: {
            tipsMore: true,
            tips: 1,
            time: 6000
        },
    };

    function showTips() {
        layer.tips('全部连播', '#continuousPlayAll', tipsConfig.params);
        layer.tips('终止全部连播', '#stopContinuousPlayAll', tipsConfig.params);
        layer.tips('正常连播', '#continuousPlayPart', tipsConfig.params);
        layer.tips('终止正常连播', '#stopContinuousPlayPart', tipsConfig.params);
    }

    /**********************************
     * statistics
     */
    var meta = '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>';
    $("head").prepend(meta);
    const clickEventMap = new Map([
        ['mode-click', 1],
        ['mode-download', 2],
        ['refresh', 3],
        ['reset', 4],
        ['choose', 5],
        ['confirm', 7],
        ['downloadSrc', 8],
        ['download-res-btn', 9],
        ['forward', 10],
        ['reverse', 11],
        ['continuousPlayAll', 26],
        ['stopContinuousPlayAll', 27],
        ['continuousPlayPart', 28],
        ['stopContinuousPlayPart', 29],
    ]);
    const keyboardEventMap = new Map([
        ['keyMap', 12],
        ['showTips', 13],
        ['faster', 14],
        ['slower', 15],
        ['rewind', 16],
        ['advance', 17],
        ['fast', 18],
        ['reset', 19],
        ['onContinuousPlayFunc', 20],
        ['offContinuousPlayFunc', 21],
        ['playPart', 22],
        ['stopPlayPart', 23],
        ['playAll', 24],
        ['stopPlayAll', 25]
    ]);
    // ?s 内的操作记为 1 次 有效记录
    const specialKeyboardEventMap = new Map([
        ['faster', 14],
        ['slower', 15],
        ['rewind', 16],
        ['advance', 17],
    ]);
    let statConfig = {
        recordURL: config.base + '/hits/saveOrUpdateUsePostWithoutCORS',
        //? s 内记 1 
        specialKeysInterval: 5000
    }
    let record = (fcId) => {

        let params = {
            htFcId: fcId
        }
        axios({
            method: 'POST',
            url: statConfig.recordURL,
            data: qs.stringify(params),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((response) => {
            //succ
            console.log("succ")
        }).catch((error) => {
            //err
            console.log("err")
        });
    }

    window.addEventListener("click", (event) => {
        let id = event.target.id;
        if (clickEventMap.has(id)) {
            record(clickEventMap.get(id))
        }
    });
    $(document).on('click','#forward, #reverse, #download-res-btn, .download-res-button ', (event) => {
        let id = event.target.id;
        let classNames = event.target.className;
        if( classNames.includes('download-res-button')){
            id = 'download-res-btn';
        }
        if (clickEventMap.has(id)) {
            record(clickEventMap.get(id))
        }
    });




    /**
     * MosoteachHelper CSS
     */
    const styleTag = `
<style>
.helper-btn{
border:1px solid #aaa;
border-radius:25px;
width:10%;
color:#fff;
font-weight:1000;
box-shadow:darkgrey 3px 3px 7px 2px;
cursor:pointer;
transition: .2s;
}
.helper-btn-a:hover{
//     opacity: 0.6;    //透明度
//     background-color: #4d79ff !important;
background-color: rgba(0, 151, 179,1) !important;
box-shadow: darkgrey 2px 2px 5px 1px !important;
}
.helper-btn-b:hover{
background-color:rgba(204, 0, 0,1) !important;
}
.helper-btn:active{
background-color:#002b80 !important;
border:3px solid #eee !important;
box-shadow: darkgrey 1px 1px 2px 1px !important;
}
#refresh{
float:right;
background-color:rgba(204, 0, 0,0.6);
}
#reset{
float:right;
background-color:rgba(204, 0, 0,0.6);
}
#mode-click{ background:rgba(0, 151, 179,0.7);}
#mode-download{ background:rgba(0, 151, 179,0.7);}
#confirm{ background:rgba(0, 151, 179,0.7);}
#downloadSrc{ background:rgba(0, 151, 179,0.7);}
#choose{ background:rgba(204, 0, 0,0.6);}
//#refresh{ background:rgba(0, 151, 179,0.7);}

.content-center{
    display: -webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    /*垂直居中*/
    -webkit-box-align: center;
    -moz-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    justify-content: center;
    align-items: center;
    justify-content: center;
}

.video-btn{
    color:white; 
    font-size:20px; 
    width:20%;
    height: 34px;
}

#keyMapInfo{
    width:300px;
}

.keyMap-head{
    font-size: 16px;
    font-weight: 700;
}

.keyMap-name{
    width: 50%;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
}

.keyMap-value{
    width: 50%;
    font-size: 16px;
    font-weight: 700;
    color: orange;
}

</style>`;
    $(styleTag).appendTo('head');

    //为每个资源添加下载按钮
    $(".res-row-open-enable").each(function () {
        if ($(this).find(".download-res-button").length > 0) return; //如果已经存在下载按钮（例如mp3），则不再添加
        $(this).find("ul").html('<li id="download-res-btn" class="download-ress download-res-button">下载</li>' + $(this).find("ul").html());
        // $(this).find("ul").html('<li id="forward">正序点击</li>' + $(this).find("ul").html());
        // $(this).find("ul").html('<li id="reverse">倒序点击</li>' + $(this).find("ul").html());
    });
    //单个资源下载
    $(document).on('click', '#download-res-btn', function () {
        var resHref = $(this).parents(".res-row-open-enable").attr('data-href');
        window.open(resHref);
    });

    $('<div id="functionAreaTitle" style="padding:0 20px">\
<div class="clear20"></div>\
<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" width="100%" color=#0BD SIZE=4>\
<div class="clear10"></div>\
<div class="res-row-title">\
<span style="color: #0BD;font-weight:600; font-size:16px"> 功能区 </span>\
<span > Powered by </span>\
<span ><a href="https://greasyfork.org/zh-CN/scripts/390978-%E4%BA%91%E7%8F%AD%E8%AF%BE%E9%AB%98%E6%95%88%E5%8A%A9%E6%89%8B">云班课高效助手  </a></span>\
<span style="color: orange;font-weight:500; font-size:14px">  查看快捷键 ：shift + m </span>\
<i class="slidedown-button manual-order-hide-part icon-angle-down" data-sort="1001"></i>\
</div>\
</div>\
<div class="clear20"></div>\
<!-- helper area Start -->\
<div id="functionAreaContent" class="hide-div" data-status="N" data-sort="1001" style="display: none;">\
<div id="helper" style="padding:0 40px;">\
<div class="res-row-title" >\
<span class="res-group-name">当前模式： </span>\
<span id="modeName" style="color: #0BD;font-weight:600">未选择 </span>\
<span class="span-display" style="color: red"> | ( 选择模式后，请按照提示操作，否则会出错；“模拟点击/下载”执行完毕后需刷新页面,数据才会更新。）</span>\
<i class="icon-angle-down slidedown-button manual-order-hide-part" data-sort="997"></i>\
</div>\
<div class="hide-div" data-status="N" data-sort="997" style="display: none;">\
<form class="appendTxt res-row" style="padding:20px 20px 0px 20px ; !important">\
<input id="mode-click" class="helper-btn helper-btn-a"  type="button" value="模拟点击">\
<input id="mode-download" class="helper-btn helper-btn-a" type="button" value="批量下载">\
<input id="reset" class="helper-btn helper-btn-a helper-btn-b" type="button" value="重置">\
<input id="refresh" class="helper-btn helper-btn-a helper-btn-b" type="button" value="刷新页面">\
</form>\
</div>\
<div id="module-3">\
<div class="clear30"></div>\
<div class="res-row-title" >\
<span class="res-group-name" >已选栏号：</span>\
<span id="barID" style="color: #0BD;font-weight:600"> 全选 </span>\
<span class="span-display" style="color: #0BD" > | (范围： 最大值为资源栏总数 / 不填写 则视为全选)</span>\
<span class="span-display" style="color: red">(注意：资源栏号是从资源区里第一栏开始)</span>\
<i class="icon-angle-down slidedown-button manual-order-hide-part" data-sort="1000"></i>\
</div>\
<div class="hide-div" data-status="N" data-sort="1000" style="display: none;">\
<form class="appendTxt res-row" style="padding:20px 20px 0px 20px ; !important">\
<input id="bar_index" placeholder="选择栏号   [  if (value < 1) --> 1 ; if (value > max) --> max  ]      选择多栏语法： 3-2-4-6  "  \
onkeyup="this.value=this.value.replace(/[^\\d][-]/g,\'\')" onafterpaste="this.value=this.value.replace(/[^\\d][-]/g,\'\')" style="border:1px solid #0BD; border-radius:8px;width:86%">&nbsp\
<input id="choose" class="helper-btn helper-btn-a helper-btn-b"  type="button" value="重置">\
</form>\
</div>\
</div>\
<div id="module-1">\
<div class="clear30"></div>\
<div class="res-row-title" >\
<span class="res-group-name" >模拟批量点击/下载</span>\
<span class="span-display" style="color: #0BD" >(范围：以资源总数值作为范围最大值)</span>\
<span class="span-display" style="color: red">( 点击对应按钮，将打开较多页面，请耐心等待其自动关闭。可在“控制台”里查看运行日志)</span>\
<i class="icon-angle-down slidedown-button manual-order-hide-part" data-sort="998"></i>\
</div>\
<div class="hide-div" data-status="N" data-sort="998" style="display: none;">\
<form class="appendTxt res-row" style="padding:20px 20px 0px 20px ; !important">\
<input id="head" class="indexNum" placeholder="起始位置    [  if (value < 1) --> 1 ; if (value > max) --> max  ]"  style="border:1px solid #0BD; border-radius:8px;width:42%" >&nbsp\
<input id="tail" class="indexNum" placeholder="结束位置    [  if (value < 1) --> 1 ; if (value > max) --> max  ]" style="border:1px solid #0BD; border-radius:8px;width:42%">&nbsp\
<input id="confirm" class="helper-btn helper-btn-a"  type="button" value="模拟点击">\
<input id="downloadSrc" class="helper-btn helper-btn-a"  type="button" value="批量下载">\
</form>\
</div>\
</div>\
<div id="module-2">\
<div class="clear30"></div>\
<div class="res-row-title" >\
<span class="res-group-name" >模拟全部点击（耗时较长）</span>\
<span class="span-display" style="color: #0BD" >(范围：所有资源)</span>\
<span class="span-display" style="color: red">( 点击后，将会自动打开较多页面，请耐心等待其自动关闭。可在“控制台(F12 -> console)”里查看运行日志)</span>\
<i class="icon-angle-down slidedown-button manual-order-hide-part" data-sort="999"></i>\
</div>\
<div class="hide-div" data-status="N" data-sort="999" style="display: none;">\
<div class="res-row drag-res-row" style="height:37px !important">\
<div class="operation manual-order-hide-part" style="float:left;!important">\
<ul style="margin-top:0px;"><li id="reverse">倒序点击</li><li id="forward">正序点击</li>\
<div class="clear"></div>\
</ul>\
</div>\
</div>\
</div>\
</div>\
<div id="module-4">\
<div class="clear30"></div>\
<div class="res-row-title" >\
<span class="res-group-name" >功能测试模块  </span>\
<span style="color: red"><a href = "https://greasyfork.org/en/scripts/390978-%E4%BA%91%E7%8F%AD%E8%AF%BE%E9%AB%98%E6%95%88%E5%8A%A9%E6%89%8B/feedback">  点此反馈 （维护不易，还请好评 🙇 ‍）</a></span>\
<i class="icon-angle-down slidedown-button manual-order-hide-part" data-sort="1002"></i>\
</div>\
<div class="hide-div" data-status="N" data-sort="1002" style="display: none;">\
<div class="res-row drag-res-row" style="height:37px !important">\
<div class="operation manual-order-hide-part" style="float:left;!important">\
<ul style="margin-top:0px;">\
<li id ="continuousPlayMode">视频连续播放控件（按钮在视频界面）</li>\
<li > 快捷键系统（  shift + m  ）</li>\
<div class="clear"></div>\
</ul>\
</div>\
</div>\
</div>\
</div>\
</div>\
</div>\
<!-- helper area End -->\
<div id="sourceTitle" style="padding:0 20px">\
<div class="clear10"></div>\
<HR style="FILTER: alpha(opacity=100,finishopacity=0,style=3)" width="100%" color=#0BD SIZE=4>\
<div class="clear10"></div>\
<div class="res-row-title">\
<span style="color: #0BD;font-weight:600; font-size:16px"> 资源区 </span>\
</div>\
</div>\
').insertAfter("#res-view-way");
    // 初始化
    $("#module-1,#module-2").css("display", "none");
    $("#confirm, #downloadSrc, #mode-click, #mode-download").css("display", "inline");
    // change mode
    $(document).on('click', '#mode-click', function () {
        $("#module-1, #module-2").css("display", "block");
        //         等价于
        //         document.getElementById("module-1").style.display="block";
        //         document.getElementById("module-2").style.display="block";
        //         document.getElementById('confirm').style.display = document.getElementById('confirm').style.display=="inline"?"inline":"none";
        $("#downloadSrc, #mode-download").css("display", "none");
        //         $("#mode-click").css({"background-color":"#0BD","color":"#fff"});
        $("#modeName").text("模拟点击");
        if (browserType() == "Chrome") {
            newTabAlert("onDownload", "chrome://settings/downloads", 'active', function () {
                alert("操作提醒：\n" + "务必操作，否则请不要向下执行任何操作！！！\n" + "\n" +
                    "（识别到您使用的是Chrome浏览器）" + "\n\n" +
                    "   已自动为你打开浏览器【设置】页面" + "\n" +
                    "   【提醒】：如果没有结果可在搜索框中搜索【保存位置】" + "\n" +
                    " 【 打开 】 “下载前询问每个文件的保存位置” 右侧按钮");
            });
        } else {
            alert("操作提醒：\n" + "务必操作，否则请不要向下执行任何操作！！！\n" + "\n" +
                "（以下只是 chrome 浏览器操作步骤）" + "\n" +
                "  1. 新建 Tab 页\n" + "   -->\n" +
                "  2. 地址栏输入： chrome://settings/?search=downloads\n" + "   -->\n" +
                "  3. 打开 “下载前询问每个文件的保存位置” 右侧按钮");
        }
    });
    $(document).on('click', '#mode-download', function () {
        document.getElementById("module-1").style.display = "block";
        $("#module-2, #confirm, #mode-click").css("display", "none");
        //         $("#mode-download").css({"background-color":"#0BD","color":"#fff"});
        $("#modeName").text("批量下载");
        if (browserType() == "Chrome") {
            newTabAlert("offDownload", "chrome://settings/downloads", 'active', function () {
                alert("操作提醒：\n" + "务必操作，否则请不要向下执行任何操作！！！\n" + "\n" +
                    "（识别到您使用的是Chrome浏览器）" + "\n\n" +
                    "   已自动为你打开浏览器【设置】页面" + "\n" +
                    "   【提醒】：如果没有结果可在搜索框中搜索【保存位置】" + "\n" +
                    " 【 关闭 】 “下载前询问每个文件的保存位置” 右侧按钮")
            });
        } else {
            alert("操作提醒：\n" + "务必操作，否则请不要向下执行任何操作！！！\n" + "\n" +
                "（以下只是 chrome 浏览器操作步骤）" + "\n" +
                "  1. 新建 Tab 页\n" + "   -->\n" +
                "  2. 地址栏输入：chrome://settings/?search=downloads\n" + "   -->\n" +
                "  3. 关闭 “下载前询问每个文件的保存位置” 右侧按钮");
        }
    });
    $(document).on('click', '#reset', function () {
        $("#module-1,#module-2").css("display", "none");
        $("#confirm, #downloadSrc, #mode-click, #mode-download").css("display", "inline");
        //         $("#mode-download, #mode-click").css({"background-color":"#fff","color":"#000"});
        $("#modeName").text("未选择");

    });
    // 刷新
    $(document).on('click', '#refresh', function () {
        layer.msg('即将刷新...', {
            time: 2500 //如果不配置，默认是3秒
          }, function(){
            location.reload()
          }); 
        
    })
    //资源栏总数
    var srcBarSum = 0;
    //   给分栏添加 id 易于按栏操作
    $(".res-row-box").each(function (i, e) {
        $(this).attr('id', 'id_' + i);
        srcBarSum = i + 1;
    });
    //存储所有被选择的资源栏 id
    var chosenIDs = [];
    $(document).on('click', '#choose', function () {
        //获取点击时按钮值
        var val = $("#choose").val();
        //接受用户输入的id 字符串
        let inputString = $("#bar_index").val().trim();
        //inputString经过清洗后得到的有效资源栏编号
        let idsArr = cleanData(inputString);

        if (val == "确认选择") {
            /**
             * 用户修改要选择的资源栏点击确认后
             * 根据有效资源栏编号生成对应资源栏id存入数组备用
             * 并显示被选择的所有有效资源栏
             */

            //无输入内容,选择全部栏
            if (idsArr.length == 0) {
                chosenIDs.push(".res-row-box");
            } else {
                //有输入内容，转化成对应的id,放入数组备用
                for (let id of idsArr) {
                    chosenIDs.push("#id_" + (id - 1));
                }
            }
            //test
            // console.log(idsArr);
            //var barID = $("#bar_index").val();
            let barID_str = idsArr.length == 0 ? "全选" : idsArr;
            //var barID_str =  (barID > 0 && barID < 21) ? barID : "全选";
            alert("小可爱，你已将要操作的资源栏修改为： " + barID_str);
            $("#barID").text(barID_str);
            $("#choose").val("重置");
            $("#choose").css('background-color', 'rgba(204, 0, 0,0.6)');

        } else {
            /**
             * 用户重置资源栏输入框
             * 置空输入框 和 存储的所有资源栏id
             * 被选择的资源栏设为全选
             */
            $("#bar_index").val("");
            chosenIDs = [];
            $("#choose").val("确认选择");
            $("#choose").click();

        }

    });

    // reset  bar_index
    $('#bar_index').bind("input propertychange", function (event) {
        $("#choose").val("确认选择");
        $("#choose").css('background-color', 'rgba(0, 151, 179,0.7)');
    });


    /**
     * Main body
     *
     */

    /**
     * 根据指定的所有资源栏id，进行模拟点击
     */
    $(document).on('click', '#confirm', function () {
        batchForMoreSrcBars("模拟点击", chosenIDs)
    });

    /**
     * 根据指定的所有资源栏id，进行批量下载
     *
     */
    $(document).on('click', '#downloadSrc', function () {
        batchForMoreSrcBars("批量下载", chosenIDs)
    });

    /**
     * 模拟正序点击全部资源
     *
     */
    $(document).on('click', '#forward', function () {
        clickAll("true")
    });

    /**
     * 模拟倒序点击全部资源
     *
     */
    $(document).on('click', '#reverse', function () {
        clickAll("false")
    });

    /**
     * Play videos continuously
     */
    $(document).on('click', '#continuousPlayMode', () => {
        continuousPlay()
    })


});