// ==UserScript==
// @name         万能视频学习脚本
// @namespace    http://tampermonkey.net/
// @version     1.0.0
// @description  支持：倍速功能，自动连播、自动播放、自动静音
// @author       快乐加倍
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @noframes
// @icon         https://www.zhihuishu.com/favicon.ico
// @connect      www.gaozhiwang.top
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475503/%E4%B8%87%E8%83%BD%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/475503/%E4%B8%87%E8%83%BD%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    let basehost = 'http://www.gaozhiwang.top';
    let bserUrl = 'http://www.gaozhiwang.top:7001';
    const panelcss = `
        .myTool{
            background: #fff;
            width: 234px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: fixed;
            z-index: 999;
            top: 236px;
            left: -14px;
            box-sizing: border-box;
            padding: 15px 9px;
            border-radius: 5px;
            box-shadow: 0 0 9px rgba(0,0,0,.5);
        }
        .controls{
            position: absolute;
            right: 12px;
            font-size: 27px;
            top: 9px;
            cursor: pointer;
            transition: all 0.4s;
        }
        .controls:hover{
            color: #1f74c;
            transform: rotate(360deg);
        }

        .myTool-content{
            transition: all 0.4s;
            overflow: hidden;
        }
        .mytoolkeyipt{
            width: 130px;
            height: 22px !important;
            outline: none;
            padding: 0px 3px;
            border: 1px solid #757575FF;
            border-radius: 3px;
            font-size: 13px;
            padding: 0px 3px;
            margin-right: 5px;
            margin-top: 2px;
        }
        .addkey-btn{
            color: #fff;
            background: #1f74ca;
        }
        .removkey-btn{
            color: #000;
            display: none;
            background: #eee;
        }
        .handleKeyBtn{
            width: 54px;
            height: 24px;
            margin-top: 2px;
            border: none;
            font-size: 12px;
            border-radius: 2px;
            cursor: pointer;
        }

        .handleSpeedUp{
            background: orange;
            font-size: 12px;
            color: #fff;
            padding: 4px 15px;
            border-radius: 5px;
            margin: 0 auto;
            max-width: 80px;
            margin-top: 10px;
            cursor: pointer;
            text-align: center;
        }
        .ctxTipWrap{
            min-width: 200px;
            min-height: 50px;
            text-align: center;
            line-height: 50px;
            background: #fff;
            position: fixed;
            z-index: 999;
            left: 50%;
            top: 50%;
            border-radius: 9px;
            box-shadow: 0 0 5px rgba(0,0,0,.6);
            display:none;
        }
        .cxtsection{
          width: 100%;
          box-sizing: border-box;
          padding: 0 5px;
          margin-bottom: 2px;
        }
        .cxtsection .ctx-title{
          text-align: left;
          margin-top: 12px;
          font-size: 12px;
          color: #4e5969;
          border-left: 2px solid #1f74ca;
          border-radius: 2px;
          padding-left: 3px;
          line-height: 16px;
        }
        .ctxsection2{
          display: flex;
          justify-content: space-between;
        }
        .ctxsection2 .speed-select{
          width: 50%;
          height: 22px !important;
          outline: none;
          position: relative;
          top: 10px;
          border: 1px solid #757575FF;
          border-radius: 3px;
          padding-left: 10px;
        }
        .ctxsection3{
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .feedbackBtn{
            font-size: 13px;
            position: relative;
            top: 5px;
            cursor: pointer;
            color: #000;
        }
        a{
            text-decoration: none;
        }
    `;
    const panelhtml = `
<div class="myTool">
    <div class="controls ctxcontrols">×</div>
    <div class=''><a style="color: black;" href="${basehost}" target="_blank">?高智Ai自动学习程序</a></div>

    <div class="myTool-content">
        <div class="nokey">
            <div class="btns">
                <div class="btn1"
                     style="text-align: center;color: #1776FDFF;text-decoration: underline;margin: 5px 0;cursor: pointer;">
                    <a href="${basehost}" target="_blank">点击获取Key</a>
                </div>
                <a href="${basehost}" id="slogan" target="_blank" style="text-decoration: none;">

                </a>
            </div>
        </div>

        <div class="cxtsection ctxsection1">
          <div class="ctx-title title3">
            输入Key：
          </div>
          <div class="ipt-wrap" style="display: flex;align-items: center;justify-content: space-between;">
            <input class="mytoolkeyipt" />
            <div style="width: 120px;height: 18px;margin-right: 5px;display: none;" class="mytoolkey"></div>
            <button class="handleKeyBtn addkey-btn" id="addKey">绑定</button>
            <button class="handleKeyBtn removkey-btn" id="removeKey">解绑</button>
          </div>
        </div>

        <div class="cxtsection ctxsection2">
          <div class="ctx-title">
            设置倍速：
          </div>
          <select name="" id="ctxspeed" class="speed-select">
            <option value="1" class="option">
              × 1.0
            </option>
            <option value="5" class="option">
              × 5.00
            </option>
            <option value="10" class="option" selected="selected">
              × 10.00
            </option>
            <option value="16" class="option">
              × 16.00
            </option>
          </select>
        </div>

        <div class="cxtsection ctxsection3">
          <div class="ctx-title">
            意见反馈：
          </div>
          <a href="${basehost}"><div class="feedbackBtn">去反馈</div></a>
        </div>

        <div class="scriptTip" style="display: none;border-radius: 4px;margin-top: 9px;font-size: 12px;background: rgba(108,201,255,0.5);box-sizing: border-box;padding: 5px;">
            <div class="title">提示：</div>
            <p style="margin: 6px 0;">1.兴趣课全网目前仅支持最高1.5倍速</p>
        </div>
        <div class="cxtsection cxtsection3" style="display: none">
          <div class="ctx-title">
            当前作答题目：
          </div>
          <div class="ctxtopic-name">贵州省贵阳市毓秀路27号贵州省人才大市场4楼</div>
        </div>
        <div class="handleSpeedUp">点击加速</div>
    </div>

    <div id="ctxTipWrap" class="ctxTipWrap"></div>
</div>
    `;
    let ElementObj = {};
    let Internetcourse = {
        henanzhujianjy: { id: 42, name: '河南省住建专业技术人员继续教育', host: 'zjpx.icitpower.com:8080' },
    };
    let speedArr = [1, 3, 5, 10, 16];
    let toolOption = {
        accelerator: 1,
        CtxMain: null,
        SchoolType: -1
    };
    class Main {
        constructor() {
            this.studentType = 1;
            this.speedStatus = 0;
            this.listenVidoeStatusTimer = null;
            this.init();
        }
        init() {
            setTimeout(() => {
                let _schoolInfoColletion = localStorage.getItem('schoolInfoColletion');
                if (_schoolInfoColletion) {
                }
                else {
                    this.colletionSchoolData();
                }
            }, 2500);
        }
        updateSpeedElement(num) {
            if (this.speedStatus == 0)
                return;
            ElementObj.$video.playbackRate = num;
        }
        handleClickSpeedUp(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                let key = localStorage.getItem('mytoolkey');
                if (key) {
                    this.speedStatus = 1;
                    let result = yield fetchData({
                        method: 'GET',
                        url: bserUrl + `/speedup?toolkey=${key}&canuse=${toolOption.SchoolType}`,
                    });
                    if (result.code == 200) {
                        this.speedStatus = 1;
                        toolOption.CtxMain.play();
                    }
                    else {
                        showTip(`???${result.message}`, 5000, true);
                        return;
                    }
                    this.randomListen();
                }
                else if (!key) {
                    alert('请先购买key');
                    window.open(basehost);
                }
                else {
                    alert('程序错误，请联系客服');
                }
            });
        }
        handleAddKey(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!ElementObj.$ipt.value) {
                    window.open(basehost);
                    return;
                }
                let result = yield fetchData({
                    method: 'GET',
                    url: bserUrl + '/vertifykey?toolkey=' + ElementObj.$ipt.value
                });
                if (result.data.count > 0) {
                    localStorage.setItem('mytoolkey', ElementObj.$ipt.value);
                    localStorage.setItem('_localSpeed', toolOption.accelerator.toString());
                    callback(ElementObj.$ipt.value);
                }
                else {
                    alert('输入的key不存在');
                }
            });
        }
        handleRemoveKey() {
            localStorage.removeItem('mytoolkey');
            localStorage.removeItem('_localSpeed');
            ElementObj.$title3.innerText = '绑定key：';
            ElementObj.$mytoolkey.style.display = 'none';
            ElementObj.$ctxsection2.style.display = 'none';
            ElementObj.$nokey.style.display = 'block';
            ElementObj.$ipt.style.display = 'block';
            ElementObj.$addKey.style.display = 'block';
            ElementObj.$removeKey.style.display = 'none';
            ElementObj.$handleSpeedUp.style.background = 'orange';
            ElementObj.$handleSpeedUp.innerText = '点击加速';
            this.updateSpeedElement(1);
        }
        stopSpeedUp() {
            this.speedStatus = 0;
            toolOption.CtxMain.updateSpeedElement(1);
            ElementObj.$handleSpeedUp.style.background = 'orange';
            ElementObj.$handleSpeedUp.innerText = '点击加速';
            showTip(`?停止加速成功`);
        }
        handleChangeCtxSpeed(e) {
            let key = localStorage.getItem('mytoolkey');
            if (key) {
                let whiteList = speedArr;
                let s = Number(e);
                if (e && whiteList.includes(s)) {
                    toolOption.accelerator = s;
                    localStorage.setItem('_localSpeed', s.toString());
                    if (ElementObj.$video) {
                        ElementObj.$video.playbackRate = s;
                    }
                }
            }
            else if (!key) {
                alert('请先购买key');
                window.open(basehost);
            }
            else {
                alert('程序错误，请联系客服');
            }
        }
        colletionSchoolData() {
            return __awaiter(this, void 0, void 0, function* () {
                let key = `s${toolOption.SchoolType}`;
                let result = yield fetchData({
                    method: 'GET',
                    url: bserUrl + '/colletionschool?schoolType=' + key,
                });
                if (result.code == 200) {
                    localStorage.setItem('schoolInfoColletion', `${new Date()}`);
                }
            });
        }
        randomListen() {
            setTimeout(() => {
                let key = localStorage.getItem('mytoolkey');
                if (!ElementObj.$video.paused && !key) {
                    ElementObj.$video.pause();
                }
            }, 5000);
        }
        listenVidoeStatus($video, callback) {
            if (!$video)
                return;
            let count = 0;
            this.listenVidoeStatusTimer = setInterval(() => {
                if ($video.readyState < 4) {
                    console.log(`检测到${count}次，视频正在加载`);
                    count += 1;
                    if (count >= 20) {
                        location.reload();
                    }
                }
                let status = $video.paused;
                if (status) {
                    count += 1;
                    console.log(`检测到视频暂停了${count}次`);
                    if (typeof callback == 'function') {
                        if (count >= 20) {
                            location.reload();
                        }
                        else {
                            callback();
                        }
                    }
                    else {
                        console.log('callback不是一个函数');
                    }
                }
            }, 3000);
        }
        changeHtml($wrap) {
            return __awaiter(this, void 0, void 0, function* () {
                let _style = `
                width: 100%;
                height: 100%;
                background: #eae9e9;
                position: absolute;
                z-index: 999;
                overflow: scroll;
                top: 0;
                padding-left: 10px;
            `;
                let dom = document.createElement('div');
                dom.setAttribute('class', 'ctxstatsbox');
                dom.setAttribute('style', _style);
                $wrap.appendChild(dom);
                yield sleep(300);
                ElementObj.$ctxstatsbox = document.querySelector('.ctxstatsbox');
                this.addInfo('?初始化已完成，正在播放');
            });
        }
        addInfo(str, type) {
            let $ctxstatsbox_lis = document.querySelectorAll('.ctxstatsbox_li');
            if ($ctxstatsbox_lis.length >= 15) {
                ElementObj.$ctxstatsbox.innerHTML = '';
            }
            let li = `<li class="ctxstatsbox_li" style="color: ${type == 0 ? '#f01414' : '#000'};line-height: 30px;font-size: 16px;list-style: none;">${str}</li>`;
            ElementObj.$ctxstatsbox.innerHTML += li;
        }
        listenPageHide() {
            let timer3;
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    console.log("页面被隐藏");
                    let count = 0;
                    timer3 = setInterval(() => {
                        count += 1;
                        if (count >= 5) {
                            this.addInfo('⚠️⚠️⚠️请勿长时间隐藏该学习页面', 0);
                        }
                    }, 5000);
                }
                else {
                    clearInterval(timer3);
                    console.log("页面被显示");
                }
            });
        }
    }
    class henanzhujianjy extends Main {
        constructor() {
            super();
            this.taskLength = 0;
            this.parentIndex = -1;
            this.currentIndex = -1;
            this.timer = null;
            this._init();
        }
        _init() {
            return __awaiter(this, void 0, void 0, function* () {
                let interval = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        console.log('正在初始化==》》');
                        ElementObj.$document = document.querySelector("frame[name='main']").contentDocument.querySelector('#layui-layer-iframe1').contentDocument;
                        ElementObj.$allTask = ElementObj.$document.querySelectorAll('.layui-timeline-item');
                        if (ElementObj.$allTask.length) {
                            clearInterval(interval);
                            this.getCurrentIndex();
                        }
                    }
                    catch (e) {
                    }
                }), 2000);
            });
        }
        getCurrentIndex() {
            return __awaiter(this, void 0, void 0, function* () {
                showTip('⚠️⚠️⚠️正在初始化', 1500);
                yield sleep(200);
                ElementObj.$allTask.forEach((item, index) => {
                    let $i = item.querySelector('.icon_ok');
                    if (!$i && this.currentIndex == -1) {
                        this.currentIndex = index;
                    }
                });
                ElementObj.$allTask[this.currentIndex].click();
                console.log('currentIndex==>>>', this.currentIndex);
                showTip('✅✅✅初始化完成，可点击加速', 3500);
            });
        }
        getEle(ele) {
            return document.querySelector("frame[name='main']").contentDocument.querySelector('#layui-layer-iframe1').contentDocument.querySelector(ele);
        }
        getVideoDom() {
            return new Promise(resolve => {
                let Timer = setInterval(() => {
                    ElementObj.$video = this.getEle('video');
                    if (!!ElementObj.$video) {
                        clearInterval(Timer);
                        resolve(true);
                    }
                }, 1000);
            });
        }
        play() {
            return __awaiter(this, void 0, void 0, function* () {
                clearInterval(this.listenVidoeStatusTimer);
                clearInterval(this.listenRebortTime);
                yield this.getVideoDom();
                ElementObj.$video.volume = 0;
                ElementObj.$video.play();
                setTimeout(() => {
                    ElementObj.$video.playbackRate = toolOption.accelerator;
                }, 3500);
                ElementObj.$handleSpeedUp.style.background = '#f01414';
                ElementObj.$handleSpeedUp.innerText = '加速成功';
                this.listRebort();
                ElementObj.$video.addEventListener('ended', () => __awaiter(this, void 0, void 0, function* () {
                    showTip('⚠️⚠️⚠️检测到视频已播放完，5秒后自动切换下一个视频', 4500);
                    yield sleep(3000);
                    let $btn = this.getEle('.layui-layer-btn0') || null;
                    $btn === null || $btn === void 0 ? void 0 : $btn.click();
                    ElementObj.$document = document.querySelector("frame[name='main']").contentDocument.querySelector('#layui-layer-iframe1').contentDocument;
                    ElementObj.$allTask = ElementObj.$document.querySelectorAll('.layui-timeline-item');
                    yield sleep(200);
                    if (this.currentIndex >= ElementObj.$allTask.length - 1) {
                        alert('当前视频已全部播放完');
                        return;
                    }
                    console.log('currentIndex==>>>', this.currentIndex);
                    this.currentIndex += 1;
                    let $nextBtn = ElementObj.$allTask[this.currentIndex];
                    yield sleep(200);
                    $nextBtn.click();
                    setTimeout(() => {
                        this.handleClickSpeedUp();
                    }, 4500);
                }));
                ElementObj.$video.addEventListener('pause', () => {
                    setTimeout(() => {
                        ElementObj.$video.volume = 0;
                        ElementObj.$video.play();
                    }, 1500);
                });
            });
        }
        listRebort() {
            this.listenRebortTime = setInterval(() => {
                console.log('人机检测中==》》》');
                let $btn = this.getEle('.layui-layer-btn0') || null;
                if (!!$btn) {
                    setTimeout(() => {
                        $btn.click();
                        ElementObj.$video.play();
                    }, 3000);
                }
            }, 10 * 1000);
        }
    }
    class Addpanel {
        constructor() {
            this.$panelWrap = document.createElement('div');
            this.$panelStyle = document.createElement('style');
            this._init();
        }
        _init() {
            var _a;
            this.$panelWrap.innerHTML = panelhtml;
            this.$panelStyle.innerHTML = panelcss;
            ElementObj.$documentLeft = document.querySelector("frame[name='leftFrame']").contentDocument;
            (_a = ElementObj.$documentLeft.querySelector('head')) === null || _a === void 0 ? void 0 : _a.appendChild(this.$panelStyle);
            let $body = ElementObj.$documentLeft.querySelector('body');
            $body.appendChild(this.$panelWrap);
            ElementObj.$title3 = ElementObj.$documentLeft.querySelector('.title3');
            ElementObj.$mytoolkey = ElementObj.$documentLeft.querySelector('.mytoolkey');
            ElementObj.$nokey = ElementObj.$documentLeft.querySelector('.nokey');
            ElementObj.$addKey = ElementObj.$documentLeft.getElementById('addKey');
            ElementObj.$removeKey = ElementObj.$documentLeft.getElementById('removeKey');
            ElementObj.$ipt = ElementObj.$documentLeft.querySelector('.mytoolkeyipt');
            ElementObj.$handleSpeedUp = ElementObj.$documentLeft.querySelector('.handleSpeedUp');
            ElementObj.$playButton = ElementObj.$documentLeft.querySelector('#playButton');
            ElementObj.$ctxTipWrap = ElementObj.$documentLeft.querySelector('#ctxTipWrap');
            ElementObj.$ctxsection2 = ElementObj.$documentLeft.querySelector('.ctxsection2');
            ElementObj.$ctxcontrols = ElementObj.$documentLeft.querySelector('.ctxcontrols');
            let storageKey = localStorage.getItem('mytoolkey');
            if (storageKey) {
                this.handleSetHtml(storageKey);
            }
            this.optimizePannel();
            this.setSpeedOption();
            this.addEvent();
            this.getSlogan();
        }
        optimizePannel() {
        }
        setSpeedOption() {
            try {
                ElementObj.$speedSelect = ElementObj.$documentLeft.querySelector('#ctxspeed');
                let html = ``;
                for (var i = 0; i < speedArr.length; i++) {
                    let str = `
                <option value="${speedArr[i] == 1.15 ? 1.15 : speedArr[i]}" class="option">
                  × ${speedArr[i] == 1.15 ? 1.2 : speedArr[i]}.0
                </option>
                `;
                    html += str;
                }
                ElementObj.$speedSelect.innerHTML = html;
                var _localSpeed = localStorage.getItem('_localSpeed');
                if (_localSpeed) {
                    ElementObj.$speedSelect.value = _localSpeed;
                    toolOption.accelerator = Number(_localSpeed);
                }
            }
            catch (e) {
            }
        }
        handleSetHtml(key) {
            try {
                ElementObj.$ipt.style.display = 'none';
                ElementObj.$title3.innerText = '当前key：';
                ElementObj.$mytoolkey.innerText = key;
                ElementObj.$mytoolkey.style.display = 'block';
                ElementObj.$nokey.style.display = 'none';
                ElementObj.$removeKey.style.display = 'block';
                ElementObj.$addKey.style.display = 'none';
                ElementObj.userKey = key;
            }
            catch (e) {
            }
        }
        addEvent() {
            try {
                ElementObj.$addKey.addEventListener('click', () => {
                    toolOption.CtxMain.handleAddKey((key) => {
                        this.handleSetHtml(key);
                    });
                });
                ElementObj.$removeKey.addEventListener('click', () => {
                    toolOption.CtxMain.handleRemoveKey();
                });
                ElementObj.$handleSpeedUp.addEventListener('click', () => {
                    toolOption.CtxMain.handleClickSpeedUp();
                });
                ElementObj.$ctxsection2.addEventListener('change', (e) => {
                    toolOption.CtxMain.handleChangeCtxSpeed(e.target.value);
                });
                ElementObj.$ctxcontrols.addEventListener('click', () => {
                    let $myToolContent = document.querySelector('.myTool-content');
                    let isHide = GM_getValue("hideCtx", null);
                    if (isHide) {
                        $myToolContent.style.height = 'auto';
                        ElementObj.$ctxcontrols.innerText = '×';
                    }
                    else {
                        $myToolContent.style.height = '0px';
                        ElementObj.$ctxcontrols.innerText = '?';
                    }
                    GM_setValue("hideCtx", !isHide);
                });
            }
            catch (e) {
            }
        }
        getSlogan() {
            fetchData({
                url: bserUrl + '/getslogan',
                method: "GET"
            }).then((res) => {
                ElementObj.$slogan = ElementObj.$documentLeft.querySelector('#slogan');
                ElementObj.$slogan.innerHTML = res.result.text1;
            });
        }
    }
    function $el(selector, root2 = window.document) {
        const el2 = root2.querySelector(selector);
        return el2 === null ? void 0 : el2;
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function fetchData(option) {
        return new Promise(resolve => {
            try {
                GM_xmlhttpRequest(Object.assign(Object.assign({}, option), { onload: function (xhr) {
                        if (xhr.status == 200) {
                            resolve(JSON.parse(xhr.response));
                        }
                    } }));
            }
            catch (e) {
                fetch(option.url, {
                    method: option.method
                }).then(res => res.json()).then(res => {
                    resolve(res);
                });
            }
        });
    }
    function showTip(text, time = 1500, isAlert) {
        ElementObj.$ctxTipWrap.style.display = 'block';
        ElementObj.$ctxTipWrap.innerText = text;
        let timer = setTimeout(() => {
            ElementObj.$ctxTipWrap.style.display = 'none';
        }, time);
        if (isAlert) {
            alert(text);
        }
    }
    function recognitionType() {
        let current_host = location.host;
        if (/www.gaozhiwang.top/.test(current_host))
            return;
        toolOption.CtxMain = henanzhujianjy;
        toolOption.SchoolType = Internetcourse.henanzhujianjy.id;
    }
    setTimeout(() => {
        recognitionType();
        toolOption.CtxMain = new toolOption.CtxMain();
        new Addpanel();
    }, 5000);
})();
