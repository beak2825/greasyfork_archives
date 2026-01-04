// ==UserScript==
// @name         昆明理工大学继续教育学院网络教学平台
// @version      0.0.6
// @description  监控面板，自动播放...
// @author       Xiguayaodade
// @license      MIT
// @match        *://jjxxpt.kust.edu.cn/*
// @match        *://jjxxpt.kust.edu.cn/*
// @match        *://JJXXPT.KUST.EDU.CN/*
// @grant        GM_info
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @namespace    http://tampermonkey.net/
// @homepage     http://8.130.116.135/?article/
// @source       http://8.130.116.135/?article/
// @icon         https://picx.zhimg.com/v2-ce62b58ab2c7dc67d6cabc3508db5795_l.jpg?source=32738c0c
// @connect      icodef.com
// @connect      localhost
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/477437/%E6%98%86%E6%98%8E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E7%BD%91%E7%BB%9C%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477437/%E6%98%86%E6%98%8E%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E9%99%A2%E7%BD%91%E7%BB%9C%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    if (window.self !== window.top) {
        return;
    }

    var speedonoff = false;
    var speedIn = null;
    var ddds3 = null;
    var addMessage = null;


    let btn1 = GM_registerMenuCommand("\u4f5c\u8005\uff1a\ud83c\udf49\u897f\u74dc\u8981\u5927\u7684\ud83c\udf49", function () {
        confirm("Hello,\u611f\u8c22\u4f7f\u7528\ud83c\udf49\u897f\u74dc\u5237\u8bfe\u52a9\u624b\ud83c\udf49\uff01\u591a\u591a\u53cd\u9988\u54e6");
        GM_unregisterMenuCommand(btn1);
    }, "");
    let btn2 = GM_registerMenuCommand("\u4ed8\u8d39\u5185\u5bb9", function () {
        alert("\u9650\u65f6\u514d\u8d39\uff0c\u5168\u529b\u5f00\u53d1\u4e2d...");
    }, "p");

    //存储当前课程章节数量
    var chapterCount = 0;
    //存储当前课程章节索引
    var chapterId = 1;
    //存储课后练习小题数量
    var questionCount = 0;
    //课后练习选择框索引
    var rediosIndex = 1;
    /**
     * 视频列表关键字
     * @type {string}
     */
    const VDHREFS = "vdHrefs";
    /**
     * 请求地址
     * @type {string}
     */
    var href = 'https://jjxxpt.kust.edu.cn/net/xs/Student_ShowSC.asp?';
    /**
     * cookies存储
     * @type {string}
     */
    var cookies = "";
    /**
     * 课程信息存储
     * @type {[]}
     */
    const chapterdata = [];
    /**
     *当前页面缓存标记
     *@type {String}
     */
    const NOWPAGE = "nowPage";
    /**
     *存储当前页面href
     *@param href 当前页面地址
     *@returns {*}
     */
    function saveNowPage(href) {
        GM_setValue(NOWPAGE, href);
    }
    /**
     *缓存中获取前页面href当前页面地址
     *@returns {String}
     */
    function getNowPage() {
        return GM_getValue(NOWPAGE);
    }
    /**
     * 验证码识别
     * @returns {*}
     */
    function autoInput() {
        let captcha = document.getElementsByTagName("tbody")[2].children[2].children[1].children[1].innerText;
        document.getElementsByTagName("tbody")[2].children[2].children[1].children[0].value = captcha;
    }
    /**
     * 获取cookie
     * @returns {*}
     */
    function getCookie(){
        cookies = document.cookie;
    }
    /**
     * 获取视频时长
     * @returns {float}
     */
    function getVdTime(vdUrl){
        var video = document.createElement("video");
        video.src = vdUrl;
        video.addEventListener("loadedmetadata", function () {
            var duration = video.duration;
            var vTime = parseInt(duration / 60 + 1);
            console.log(vdUrl.substring(0, 64),vTime + "分钟");
            addMessage(vdUrl.substring(0, 64),vTime + "分钟");
            var oValue = getVdHref();
            for(let x=0;x<oValue.length;x++){
                if(oValue[x].url === vdUrl){
                    oValue[x].time = vTime;
                }
            }
            GM_setValue(VDHREFS, oValue);
            return vTime;
        });
    }
    /**
     * 获取cids
     * @returns {string}
     */
    function getCids(ctid){
        return document.getElementsByTagName("tbody")[1].children[ctid].querySelectorAll('input')[3].value;
    }
    /**
     * 获取SNID
     * @returns {string}
     */
    function getSnid(ctid){
        return document.getElementsByTagName("tbody")[1].children[ctid].querySelectorAll('input')[7].value;
    }
    /**
     * 获取视频链接
     * @returns {string}
     */
    function getVideoHref(ctid){
        var vdHref = document.getElementsByTagName("tbody")[1].children[ctid].querySelectorAll('input')[1].value;
        return vdHref;
    }
    /**
     * 获取视频链接列表
     * @returns {*|*[]}
     */
    function getVdHref() {
        var value = GM_getValue(VDHREFS, []);
        if (Array.isArray(value)) {
            return value;
        }
        return [];
    }
    /**
     * 保存视频链接到本地
     * @param {string} adhref
     * @param {float} adTime
     * @returns {boolean}
     */
    function addVdHref(adhref,adTime){
        var oldValue = getVdHref();
        if (oldValue.findIndex(value => value == adhref) > -1) {
            alert("已经存在列表中");
            return false;
        }

        oldValue.push({url: adhref, time: adTime});

        GM_setValue(VDHREFS, oldValue);

        return true;
    }
    /**
     * 获取章节名称
     * @returns {string}
     */
    function getChapterName(ctid){
        return document.getElementsByTagName("tbody")[1].children[ctid].querySelectorAll('input')[0].value;
    }
    /**
     * 保存课程信息
     * @returns {*}
     */
    function saveChapterData(ctid){
        chapterdata.push({cids: getCids(ctid), snid: getSnid(ctid), videoHref: getVideoHref(ctid), name: getChapterName(ctid)});
        addVdHref(getVideoHref(ctid),67);
    }
    /**
     * 学习请求
     * @returns {*}
     */
    function studyRequire(){
        if(chapterdata.length < 1 || chapterdata == [] || chapterdata == null){
            addMessage("学习结束");
            console.log("学习结束");
        }
        else{
            // chapterdata.length
            for(let i=0;i<chapterdata.length;i++){
                let ju = false;
                var tsurl = href + "CID=" + chapterdata[i].cids + "&SNID=" + chapterdata[i].snid;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: tsurl,
                    Cookie: cookies,
                    onload: function(response) {
                        var pattern = /���γ��������ߣ�(\d+Сʱ\d+��\d+��)/;
                        var result = response.responseText.match(pattern);
                        var timeArray = result[1].match(/\d+/g);

                        var hours = parseInt(timeArray[0]);
                        var minutes = parseInt(timeArray[1]);
                        var seconds = parseInt(timeArray[2]);

                        var formattedTime = (hours*60) + (minutes + 1) + (seconds/60) ;
                        addMessage(chapterdata[i].name+"请求成功："+formattedTime+"分钟");
                        console.log(chapterdata[i].name+"请求成功："+formattedTime+"分钟");
                        let arrays1 = getVdHref();
                        for (let j = 0; j < arrays1.length; j++) {
                            if (arrays1[j].url === chapterdata[i].videoHref && arrays1[j].time <= formattedTime) {
                                addMessage(chapterdata[i].name + "||已完成("+formattedTime+"/"+arrays1[j].time+")，将移除");
                                console.log(chapterdata[i].name + "||已完成("+formattedTime+"/"+arrays1[j].time+")，将移除");
                                chapterdata.splice(i, 1);
                                ju = true;
                                break;
                            }else{
                                // console.log(arrays1[j].url + "||总时长("+arrays1[j].time+")");
                            }
                        }
                    },
                    onerror: function(response) {
                        console.log(chapterdata[i].name+'请求失败：tsurl->' + chapterdata[i].snid);
                        addMessage(chapterdata[i].name+'请求失败：tsurl->' + chapterdata[i].snid);
                    }
                });
                if (ju) {
                    ju = false;
                    break;
                }
            }
        }
    }
    /**
     * 学习方法
     * @returns {*}
     */
    function kaiShi(){
        if(chapterId < chapterCount){
            let judg = document.getElementsByTagName("tbody")[1].children[chapterId].lastChild.childElementCount;
            if(judg > 0){
                saveChapterData(chapterId);
                chapterId++;
                kaiShi();
            }else{
                chapterId++;
                kaiShi();
            }
        }else{
            ddds3.children().remove();
            addMessage("首次请求");
            console.log("首次请求");
            studyRequire();
            // addMessage("获取视频时长");
            // console.log("获取视频时长");
            // var arrays = getVdHref();
            // for(let k=0;k<arrays.length;k++){
            //     let massageTime = getVdTime(arrays[k].url);
            // }
            setInterval(function(){
                ddds3.children().remove();
                studyRequire();
            },120000);
        }
    }

    //------多选题答题方法start------
    var moreRe = function(){
        setTimeout(function(){
            let positiveSolution = document.querySelectorAll("tbody")[2].children[rediosIndex-1].getElementsByTagName("td")[0].getElementsByTagName("input")[0].value;
            let array = positiveSolution.split(' ');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                for(var j=0;j<str2.length;j++){
                    switch(str2[j])
                    {
                        case 'A':
                            document.querySelectorAll("tbody")[2].children[rediosIndex-1+2].children[0].children[0].click();
                            console.log("点击A");
                            break;
                        case 'B':
                            document.querySelectorAll("tbody")[2].children[rediosIndex-1+3].children[0].children[0].click();
                            console.log("点击B");
                            break;
                        case 'C':
                            document.querySelectorAll("tbody")[2].children[rediosIndex-1+4].children[0].children[0].click();
                            console.log("点击C");
                            break;
                        case 'D':
                            document.querySelectorAll("tbody")[2].children[rediosIndex-1+5].children[0].children[0].click();
                            console.log("点击D");
                            break;
                        case 'E':
                            document.querySelectorAll("tbody")[2].children[rediosIndex-1+6].children[0].children[0].click();
                            console.log("点击E");
                            break;
                        case 'F':
                            document.querySelectorAll("tbody")[2].children[rediosIndex-1+7].children[0].children[0].click();
                            console.log("点击F");
                            break;
                        case 'G':
                            document.querySelectorAll("tbody")[2].children[rediosIndex-1+8].children[0].children[0].click();
                            console.log("点击G");
                            break;
                        default:
                            console.log("当前多选题选项过多，系统需更新！");
                    }
                }
            },500);
            setTimeout(function(){
                rediosIndex++;
                answer();
            },1500);
        },500);
    }
    //------多选题答题方法end------

    //------单选题答题方法start------
    var onlyRe = function(){
        setTimeout(function(){
            let positiveSolution = document.querySelectorAll("tbody")[2].children[rediosIndex-1].getElementsByTagName("td")[0].getElementsByTagName("input")[0].value;
            let array = positiveSolution.split(' ');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                switch(str2[0])
                {
                    case 'A':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+2].children[0].children[0].click();
                        console.log("点击A");
                        break;
                    case 'B':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+3].children[0].children[0].click();
                        console.log("点击B");
                        break;
                    case 'C':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+4].children[0].children[0].click();
                        console.log("点击C");
                        break;
                    case 'D':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+5].children[0].children[0].click();
                        console.log("点击D");
                        break;
                    case 'E':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+6].children[0].children[0].click();
                        console.log("点击E");
                        break;
                    case 'F':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+7].children[0].children[0].click();
                        console.log("点击F");
                        break;
                }
            },500);
            setTimeout(function(){
                rediosIndex++;
                answer();
            },1000);
        },500);
    }
    //------单选题答题方法end------

    //------判断题答题方法start------
    var judgRe = function(){
        setTimeout(function(){
            let positiveSolution = document.querySelectorAll("tbody")[2].children[rediosIndex-1].getElementsByTagName("td")[0].getElementsByTagName("input")[0].value;
            let array = positiveSolution.split(' ');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                switch(str2[0])
                {
                    case 'Y':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+2].children[0].children[0].click();
                        console.log("点击Y");
                        break;
                    case 'N':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+3].children[0].children[0].click();
                        console.log("点击N");
                        break;
                }
            },500);
            setTimeout(function(){
                rediosIndex++;
                answer();
            },1000);
        },500);
    }
    //------判断题答题方法end------

    //------考试start------
    var answer = function(){
        // for(let i=0; i<questionCount; i++){
        if(rediosIndex <= questionCount){
            if(document.querySelectorAll("tbody")[2].children[rediosIndex-1].getElementsByTagName("td") != null && document.querySelectorAll("tbody")[2].children[rediosIndex-1].getElementsByTagName("td")[0].getElementsByTagName("b")[0] != null){
                let str = document.querySelectorAll("tbody")[2].children[rediosIndex-1].getElementsByTagName("td")[0].getElementsByTagName("b")[0].innerText;
                let tName = str.substring(1,4);
                if(tName === '单选题'){
                    console.log("xigua:单选题，开始作答");
                    addMessage("xigua:单选题，开始作答");
                    onlyRe();
                }
                if(tName === '多选题'){
                    console.log("xigua:多选题，开始作答");
                    addMessage("xigua:多选题，开始作答");
                    moreRe();
                }
                if(tName === '是非题'){
                    console.log("xigua:是非题，开始作答");
                    addMessage("xigua:是非题，开始作答");
                    judgRe();
                }
            }else{
                console.log(rediosIndex+":非题目");
                rediosIndex++;
                answer();
            }
        }
        else{
            console.log("xigua:作答完毕,请手动提交");
            addMessage("xigua:作答完毕，请手动提交");
        }
        // }
    }
    //------考试end------

    const panel = function () {
        var container = $('<div id="gm-interface"></div>');
        var titleBar = $('<div id="gm-title-bar">\ud83c\udf49\u897f\u74dc\u7f51\u8bfe\u52a9\u624b\ud83c\udf49</div>');
        var minimizeButton = $('<div title="\u6536\u8d77" style="display:black"><svg id="gm-minimize-button" class="bi bi-dash-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/><path fill-rule="evenodd" d="M3.5 8a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.5-.5z"/></svg></div>');
        var maxButton = $('<div title="\u5c55\u5f00" style="display:none"><svg id="gm-minimize-button" class="bi bi-plus-square" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 3.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5H4a.5.5 0 0 1 0-1h3.5V4a.5.5 0 0 1 .5-.5z"/><path fill-rule="evenodd" d="M7.5 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0V8z"/><path fill-rule="evenodd" d="M14 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/></svg></div>');
        var content = $('<div id="gm-content"></div>');
        var tips = $('<div class="tip" style="display:none;">\u957f\u6309\u62d6\u62fd</div>');
        var scrollText = $('<marquee>').text('\u4e7e\u5764\u672a\u5b9a\uff0c\u4f60\u6211\u7686\u662f\u9ed1\u9a6c----\u4f5c\u8005\uff1a\u897f\u74dc\u8981\u5927\u7684\uff08\u611f\u8c22\u652f\u6301\uff01\uff09').css({
            'position': 'absolute',
            'top': '15%',
            'left': '50%',
            'transform': 'translate(-50%, -50%)',
            'width': '90%',
            'height': '25px',
            'font-size': '16px',
            'line-height': '1.5',
            'white-space': 'nowrap'
        }).appendTo(content);
        //var ddds1 = $('<div style="position: absolute;top: 20%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="startxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">\u542f\u52a8</button></div>');
        //var ddds5 = $('<div style="position: absolute;top: 35%;width:90%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u70b9\u51fb\u542f\u52a8\uff1a<button id="stopxg" style="position: absolute;width:48px;right: 10px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">暂停</button></div>');
        var ddds2 = $('<div style="position: absolute;top: 73%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;">\u65ad\u70b9\u500d\u901f\uff1a<button id="switchButton" style="position: absolute;width:88px;right: 180px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">当前：关闭</button><button id="speedxgone" style="position: absolute;width:88px;right: 38px;background-color: #ffe5e5;border-radius: 4px;border-color: #ffc0c0;color: grey;">清空缓存</button></div>');
        ddds3 = $('<div id="message-container" style="position: absolute;display: grid;align-content: center;justify-content: center;top: 20%;width:94%;height:52%;max-height:62%;overflow-y:auto;padding: 3px;background: #ffffff;border-radius: 5px;"></div>');
        var ddds4 = $('<div style="position: absolute;top: 85%;width:94%;height:10%;padding: 3px;background: #ffedf0;border-radius: 5px;"><a href="http://8.130.116.135/?article/" style="position: absolute;right: 10px;text-decoration: none;color: pink;">\u003e\u003e\u003e\u8054\u7cfb\u003a\u0031\u0039\u0030\u0038\u0032\u0034\u0035\u0033\u0030\u0032\u0040\u0071\u0071\u002e\u0063\u006f\u006d</a></div>');

        container.append(titleBar);
        //content.append(ddds1);
        //content.append(ddds5);
        content.append(ddds2);
        content.append(ddds3);
        content.append(ddds4);
        container.append(content);
        container.append(maxButton);
        container.append(minimizeButton);
        $('body').append(container);
        $('body').append(tips);

        GM_addStyle(`
        #gm-interface {
            position: fixed;
            top: 50%;
            left: 50%;
            border-radius: 5px;
            background-color: white;
            z-index: 9999;
        }

        #gm-title-bar {
            padding: 5px;
            background-color: #ffc0c0;
            border: 1px solid black;
            border-radius: 5px;
            cursor: grab;
        }

        #gm-minimize-button {
            position: absolute;
            top: 2px;
            right: 2px;
            width: 30px;
            height: 30px;
            border-radius: 5px;
            padding: 0;
            font-weight: bold;
            background-color: #ffc0c0;
            cursor: pointer;
        }

        #gm-content {
            padding: 10px;
            border: 1px solid black;
            border-radius: 2px 2px 5px 5px;
            background-color: #ffe5e5;
            width: 400px;
            height: 300px;
        }
        .tip{
            font-family: "黑体";
            color: black;
            -webkit-transform: scale(0.8);
            position:absolute;
            padding: 6px 5px;
            background-color:#ffe8f0;
            border-radius: 4px;
            z-index: 9999;
        }
    `);

        titleBar.on('mousemove', function (e) {
            tips.attr("style", "display:black;");
            var top = e.pageY + 5;
            var left = e.pageX + 5;
            tips.css({
                'top': top + 'px',
                'left': left + 'px'
            });
        });

        titleBar.on('mouseout', function () {
            tips.hide();
        });

        titleBar.on('mousedown', function (e) {
            var startX = e.pageX - container.offset().left + window.scrollX;
            var startY = e.pageY - container.offset().top + window.scrollY;

            $(document).on('mousemove', function (e) {
                e.preventDefault();
                var newX = e.pageX - startX;
                var newY = e.pageY - startY;
                container.css({ left: newX, top: newY });
            });

            $(document).on('mouseup', function () {
                $(document).off('mousemove');
                $(document).off('mouseup');
            });
        });


        minimizeButton.on('click', function () {
            minimizeButton.attr("style", "display:none;");
            maxButton.attr("style", "display:black;");
            content.slideToggle(0);
            container.css({ width: 200 });
        });

        maxButton.on('click', function () {
            minimizeButton.attr("style", "display:black;");
            maxButton.attr("style", "display:none;");
            content.slideToggle(0);
            container.css({ width: 422.22 });
        });

        // $("#speedxgsex").on('click',function(){
        //     document.querySelector("video").playbackRate=16;
        //     addMessage("\u500d\u901f\uff1a\u0058\u0031\u0036");
        // });

        $("#speedxgone").on('click', function () {
            // GM_deleteValue("courseId");
            // 获取所有的键
            var keys = GM_listValues();

            // 遍历删除每个键值对
            for (var i = 0; i < keys.length; i++) {
                GM_deleteValue(keys[i]);
            }
            ddds3.children().remove();
            addMessage("已清空缓存");
        });

        $("#switchButton").on('click', function () {
            if (speedonoff) {
                speedonoff = false;
                addMessage("\u500d\u901f\uff1a\u5173\u95ed");
                $("#switchButton").text("当前：关闭");
            } else {
                speedonoff = true;
                addMessage("\u500d\u901f\uff1a\u5f00\u542f");
                $("#switchButton").text("当前：开启");
            }
        });

        // 监听鼠标滚轮事件，实现消息框滚动
        ddds3.on('mousewheel', function (event) {
            event.preventDefault();
            var scrollTop = ddds3.scrollTop();
            ddds3.scrollTop(scrollTop + event.originalEvent.deltaY);
        });

        // 添加新消息
        addMessage = function (message) {
            // 检查消息数量，移除最早的一条消息
            if (ddds3.children().length >= 288) {
                ddds3.children().first().remove();
            }
            // 创建消息元素并添加到消息框容器
            var messageElement = $('<div class="message"></div>').text(message).css({
                'margin-bottom': '10px'
            }).appendTo(ddds3);
        }

    }

    panel();
    addMessage("\u002d\u002d\u002d\u002d\u6b63\u5728\u542f\u52a8\uff0c\u8bf7\u7a0d\u540e\u002e\u002e\u002e\u002d\u002d\u002d\u002d");

    //------等待网页加载完成start-----
    var wait = setInterval(function () {
        ddds3.children().first().remove();
        let nowUrl = window.location.href;
        if (nowUrl === 'https://jjxxpt.kust.edu.cn/NET/XS/Management/Login.asp' || nowUrl === 'https://jjxxpt.kust.edu.cn/NET/XS/Management/login.asp') {
            addMessage("\u767b\u5f55\u9875\uff0c\u83b7\u53d6\u9a8c\u8bc1\u7801");
            setTimeout(function () {
                autoInput();
            }, 1000);
        }
        else if (nowUrl === 'https://jjxxpt.kust.edu.cn/NET/XS/StudentMainList.asp') {
            addMessage("课程列表,请进入要学习的课程");
        }
        else if (nowUrl.substring(0, 49) === 'https://jjxxpt.kust.edu.cn/NET/XS/Student_KPT_MX_') {
            addMessage("章节列表");
            getCookie();
            chapterCount = document.getElementsByTagName("tbody")[1].childElementCount;
            kaiShi();
            clearInterval(wait);
        }
        else if(nowUrl.substring(0, 53) === 'https://jjxxpt.kust.edu.cn/NET/XS/StudentTest.asp?CID'){
            addMessage("考试页，开始模拟");
            questionCount = document.querySelectorAll("tbody")[2].childElementCount;
            setTimeout(function(){
                answer();
            },1000);
        }
        else {
            addMessage("请进入课程章节列表或进入考试");
        }
        clearInterval(wait);
    }, 500);
    //------等待网页加载完成end-----

})();