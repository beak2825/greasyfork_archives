// ==UserScript==
// @name         柠檬文才视频学习脚本，可以自动学习，自动连播，自选倍速（但是高倍数不稳定）
// @namespace    http://tampermonkey.net/
// @version      5.0.2
// @description  支持【柠檬文才】
// @author       ao
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        window.close
// @icon         https://www.zhihuishu.com/favicon.ico
// @connect      www.gaozhiwang.top
// @connect      localhost
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475865/%E6%9F%A0%E6%AA%AC%E6%96%87%E6%89%8D%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%EF%BC%8C%E8%87%AA%E9%80%89%E5%80%8D%E9%80%9F%EF%BC%88%E4%BD%86%E6%98%AF%E9%AB%98%E5%80%8D%E6%95%B0%E4%B8%8D%E7%A8%B3%E5%AE%9A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/475865/%E6%9F%A0%E6%AA%AC%E6%96%87%E6%89%8D%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%8F%AF%E4%BB%A5%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0%EF%BC%8C%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD%EF%BC%8C%E8%87%AA%E9%80%89%E5%80%8D%E9%80%9F%EF%BC%88%E4%BD%86%E6%98%AF%E9%AB%98%E5%80%8D%E6%95%B0%E4%B8%8D%E7%A8%B3%E5%AE%9A%EF%BC%89.meta.js
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
            top: 70px;
            left: 44px;
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
    <div class=''><a style="color: black;" href="${basehost}" target="_blank">📺高智Ai自动学习程序</a></div>
    
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
        ningmengwencai: { id: 3, name: '柠檬文才' },
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
                        showTip(`🔉🔉🔉${result.message}`, 5000, true);
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
            showTip(`🔉停止加速成功`);
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
                if (ElementObj.$video) {
                    if (!ElementObj.$video.paused && !key) {
                        ElementObj.$video.pause();
                    }
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
                this.addInfo('🔉初始化已完成，正在播放');
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
    class ningmengwencai extends Main {
        constructor() {
            super();
            this.taskLength = 0;
            this.currentIndex = 0;
            this._init();
        }
        _init() {
            ElementObj.$allTask = document.querySelectorAll('.childSection');
            this.taskLength = ElementObj.$allTask.length;
            this.getCurrentIndex();
        }
        getCurrentIndex() {
            ElementObj.$allTask.forEach((item, index) => {
                let hasClass = item.className.includes('active');
                if (hasClass) {
                    this.currentIndex = index;
                }
            });
        }
        play() {
            return __awaiter(this, void 0, void 0, function* () {
                ElementObj.$allTask[this.currentIndex].click();
                yield sleep(2000);
                ElementObj.$video = document.querySelector('video');
                this.updateSpeedElement(toolOption.accelerator);
                let $tip1Btn = document.querySelector('.layui-layer-btn0');
                if ($tip1Btn) {
                    $tip1Btn.click();
                }
                ElementObj.$video.play();
                ElementObj.$handleSpeedUp.style.background = '#f01414';
                ElementObj.$handleSpeedUp.innerText = '加速成功';
                ElementObj.$video.addEventListener('ended', () => {
                    this.currentIndex += 1;
                    if (this.currentIndex > ElementObj.$allTask.length) {
                        return;
                    }
                    let $saveBtn = document.querySelector("#saveBtn");
                    $saveBtn.click();
                    setTimeout(() => {
                        this.handleClickSpeedUp();
                    }, 2500);
                }, false);
            });
        }
    }
    class Addpanel {
        constructor() {
            this.$panelWrap = document.createElement('div');
            this.$panelStyle = document.createElement('style');
            this._init();
        }
        _init() {
            var _a, _b;
            this.$panelWrap.innerHTML = panelhtml;
            this.$panelStyle.innerHTML = panelcss;
            (_a = document.querySelector('head')) === null || _a === void 0 ? void 0 : _a.appendChild(this.$panelStyle);
            if (toolOption.SchoolType == 3) {
                (_b = document.querySelector('#bigContainer')) === null || _b === void 0 ? void 0 : _b.appendChild(this.$panelWrap);
            }
            ElementObj.$title3 = document.querySelector('.title3');
            ElementObj.$mytoolkey = document.querySelector('.mytoolkey');
            ElementObj.$nokey = document.querySelector('.nokey');
            ElementObj.$addKey = document.getElementById('addKey');
            ElementObj.$removeKey = document.getElementById('removeKey');
            ElementObj.$ipt = document.querySelector('.mytoolkeyipt');
            ElementObj.$handleSpeedUp = document.querySelector('.handleSpeedUp');
            ElementObj.$playButton = document.querySelector('#playButton');
            ElementObj.$ctxTipWrap = document.querySelector('#ctxTipWrap');
            ElementObj.$ctxsection2 = document.querySelector('.ctxsection2');
            ElementObj.$ctxcontrols = document.querySelector('.ctxcontrols');
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
            ElementObj.$speedSelect = document.querySelector('#ctxspeed');
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
                    ElementObj.$ctxcontrols.innerText = '🔛';
                }
                GM_setValue("hideCtx", !isHide);
            });
        }
        getSlogan() {
            fetchData({
                url: bserUrl + '/getslogan',
                method: "GET"
            }).then((res) => {
                ElementObj.$slogan = document.querySelector('#slogan');
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
        if (/www.wencaischool.net/.test(current_host) || /learning.wencaischool.net/.test(current_host)) {
            toolOption.CtxMain = ningmengwencai;
            toolOption.SchoolType = Internetcourse.ningmengwencai.id;
        }
        if (/study.wencaischool.net/.test(current_host)) {
            toolOption.SchoolType = 3;
            toolOption.CtxMain = Internetcourse.ningmengwencai;
        }
    }
    setTimeout(() => {
        recognitionType();
        toolOption.CtxMain = new toolOption.CtxMain();
        new Addpanel();
    }, 5000);
})();
