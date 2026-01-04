// ==UserScript==
// @name         bilibili 小助手
// @namespace    https://greasyfork.org/zh-TW/users/725704
// @version      1.2.4
// @description  一个很普通的脚本
// @author       quiet
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/video/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/419961/bilibili%20%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419961/bilibili%20%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var $ = window.jQuery;
var div;
var divList;
var video;
var checkvideo;
if (GM_getValue('skipOpKey') == '' || GM_getValue('skipOpKey') === undefined) {
    GM_setValue('skipOpKey', 'K');
};
if (GM_getValue('forwardSkipTime') == '' || GM_getValue('forwardSkipTime') === undefined) {
    GM_setValue('forwardSkipTime', '1');
};
if (GM_getValue('forwardSkipTimeKey') == '' || GM_getValue('forwardSkipTimeKey') === undefined) {
    GM_setValue('forwardSkipTimeKey', 'L');
};
if (GM_getValue('backwardSkipTime') == '' || GM_getValue('backwardSkipTime') === undefined) {
    GM_setValue('backwardSkipTime', '1');
};
if (GM_getValue('backwardSkipTimeKey') == '' || GM_getValue('backwardSkipTimeKey') === undefined) {
    GM_setValue('backwardSkipTimeKey', 'J');
};
if (GM_getValue('autoDisableSpecial') == '' || GM_getValue('autoDisableSpecial') === undefined) {
    GM_setValue('autoDisableSpecial', 'checked');
};
if (GM_getValue('autoDisSpcInput') == '' || GM_getValue('autoDisSpcInput') === undefined) {
    GM_setValue('autoDisSpcInput', '150')
};

(function() {
    div = document.createElement('div');
    div.style.position = 'absolute';
    div.style.left = '20px';
    div.style.top = '150px';
    div.style.width = '170px';
    div.style.height = '25px';
    div.style.fontSize = '15px';
    div.style.background = '#F4F4F4';
    div.innerHTML = `<div style="display:inline;">小助手</div>
<div class="openCloseButton" style="display:inline; float:right; cursor:pointer;">收起</div>
<div class="openCloseList" style="border-style:groove; height:290px;">
    <hr>
    <br>
    <div class="loadVideoStat">正在加载播放器。。</div>
    <button id="skipOpButton" class="ElementsInList" style="border-style:groove; display:none; float:left;cursor:pointer;">跳过</button>
    <div class="ElementsInList" style="display:none;">番剧op(1:30):</div>
    <input id="skipOpKey" class="ElementsInList" autocomplete="off" style="border-style:groove; display:none; width:12px; height:12px;" value="${GM_getValue('skipOpKey')}">
    <div id="skipOptext" class="ElementsInList" style="display:none;">键</div>
    <br>
    <br>
    <button id="forwardSkipTimeButton" class="ElementsInList" style="border-style:groove; display:none; float:left; cursor:pointer;">前进</button>
    <input id="forwardSkipTime" class="ElementsInList" autocomplete="off" style="border-style:groove; display:none; width:25px; height:20px;" value="${GM_getValue('forwardSkipTime')}">
    <div class="ElementsInList" style="display:none;" maxlength="3">秒:</div>
    <input id="forwardSkipTimeKey" class="ElementsInList" autocomplete="off" style="border-style:groove; display:none; width:12px; height:12px;" value="${GM_getValue('forwardSkipTimeKey')}">
    <div class="ElementsInList" style="display:none;">键</div>
    <br>
    <br>
    <button id="backwardSkipTimeButton" class="ElementsInList" style="border-style:groove; display:none; float:left; cursor:pointer;">后退</button>
    <input id="backwardSkipTime" class="ElementsInList" autocomplete="off" style="border-style:groove; display:none; width:25px; height:20px;" value="${GM_getValue('backwardSkipTime')}">
    <div class="ElementsInList" style="display:none;" maxlength="3">秒:</div>
    <input id="backwardSkipTimeKey" class="ElementsInList" autocomplete="off" style="border-style:groove; display:none; width:12px; height:12px;" value="${GM_getValue('backwardSkipTimeKey')}">
    <div class="ElementsInList" style="display:none;">键</div>
    <br>
    <br>
    <button id="videoSpeed3x" class="ElementsInList" style="border-style:groove; display:none; float:left; cursor:pointer;">3.0x</button>
    <button id="videoSpeed025x" class="ElementsInList" style="border-style:groove; display:none; cursor:pointer;">0.25x</button>
    <br>
    <div class="ElementsInList" style="display:none;">倍速后可能无法显示弹幕</div>
    <br>
    <br>
    <input id="autoDisSpcCB" class="ElementsInList" style="-webkit-appearance:checkbox; display:none; float:left; cursor:pointer; width:15px; height:15px;" type="checkbox" ${GM_getValue('autoDisableSpecial')}>
    <div class="ElementsInList" style="display:none;">高级弹幕多於</div>
    <input id="autoDisSpcInput" class="ElementsInList" autocomplete="off" style="border-style:groove; display:none; width:35px; height:20px;" value="${GM_getValue('autoDisSpcInput')}">
    <div class="ElementsInList" style="display:none;">时</div>
    <br>
    <div class="ElementsInList" style="display:none;">自动屏蔽高级弹幕</div>
</div>`;
    try{
        document.body.appendChild(div);
    } catch(e) {console.log('[小助手]错误： ' + e);}
    divList = document.getElementsByClassName('openCloseList')[0];
    divList.style.background = '#F4F4F4';
    var btn = document.getElementsByClassName('openCloseButton')[0];
    if (GM_getValue('closeList') === true) {
        $(divList).hide();
        btn.textContent = '展开';
    };
    btn.addEventListener('click', function(e) {
        if (btn.textContent === '收起') {
            GM_setValue('closeList', true);
            $(divList).slideUp();
            btn.textContent = '展开';
            return;
        };
        if (btn.textContent === '展开') {
            GM_setValue('closeList', false);
            $(divList).slideDown();
            btn.textContent = '收起';
            return;
        };
    });
    checkvideo = setInterval(() => {
        video = document.getElementsByTagName('video')[0];
        if (video != null) {
            $('.loadVideoStat').hide();
            var eil = document.getElementsByClassName('ElementsInList');
            var i;
            for (i = 0; i < eil.length; i++) {
                eil[i].style.display = 'inline';
            }
            clearInterval(checkvideo);
            EventList();
            check();
        };
    }, 1000);
})();
function EventList() {
    var skipOpBtn = document.getElementById('skipOpButton');
    var inputBox = document.getElementById('skipOpKey');
    var FSTimeBtn = document.getElementById('forwardSkipTimeButton');
    var FSTimeInput = document.getElementById('forwardSkipTime');
    var FSTimeKeyInput = document.getElementById('forwardSkipTimeKey');
    var BSTimeBtn = document.getElementById('backwardSkipTimeButton');
    var BSTimeInput = document.getElementById('backwardSkipTime');
    var BSTimeKeyInput = document.getElementById('backwardSkipTimeKey');
    var SpeedFastBtn = document.getElementById('videoSpeed3x');
    var SpeedSlowBtn = document.getElementById('videoSpeed025x');
    var autoDisSpcCB = document.getElementById('autoDisSpcCB');
    var autoDisSpcInput = document.getElementById('autoDisSpcInput');
    var lastInputBox = inputBox.value;
    var lastFSTimeInput = FSTimeInput.value;
    var lastFSTimeKeyInput = FSTimeKeyInput.value;
    var lastBSTimeInput = BSTimeInput.value;
    var lastBSTimeKeyInput = BSTimeKeyInput.value;
    var lastautoDisSpcInput = autoDisSpcInput.value;
    skipOpBtn.onclick = () => {
        video.currentTime = video.currentTime + 90;
    };
    document.addEventListener('keydown', (event) => {
        if (event.key.toLowerCase() == inputBox.value.toLowerCase()) {
            video.currentTime = video.currentTime + 90;
        };
        if (event.key.toLowerCase() == FSTimeKeyInput.value.toLowerCase()) {
            video.currentTime = video.currentTime + parseInt(FSTimeInput.value);
        };
        if (event.key.toLowerCase() == BSTimeKeyInput.value.toLowerCase()) {
            video.currentTime = video.currentTime - parseInt(BSTimeInput.value);
        };
    });
    inputBox.addEventListener('input', (e) => {
        if (inputBox.value == '' || e.data.toUpperCase() == FSTimeKeyInput.value || e.data.toUpperCase() == BSTimeKeyInput.value) {
            inputBox.value = lastInputBox;
        } else {
            inputBox.value = e.data.toUpperCase();
            if (e.data == null ||e.data == " ") {
                GM_setValue('skipOpKey', 'K');
                inputBox.value = 'K';
            };
            GM_setValue('skipOpKey', inputBox.value);
        };
        lastInputBox = inputBox.value;
    });
    FSTimeBtn.onclick = () => {
        video.currentTime = video.currentTime + parseInt(FSTimeInput.value);
    };
    FSTimeInput.addEventListener('input', (e) => {
        if (isNaN(parseInt(FSTimeInput.value))|| (parseInt(FSTimeInput.value)) < 1 || ''+FSTimeInput.value != parseInt(FSTimeInput.value)) {
            FSTimeInput.value = '1';
        };
        if (FSTimeInput.value.length > 3) {FSTimeInput.value = lastFSTimeInput};
        GM_setValue('forwardSkipTime', FSTimeInput.value);
        lastFSTimeInput = FSTimeInput.value;
    });
    FSTimeKeyInput.addEventListener('input', (e) => {
        if (FSTimeKeyInput.value == '' || e.data.toUpperCase() == inputBox.value || e.data.toUpperCase() == BSTimeKeyInput.value) {
            FSTimeKeyInput.value = lastFSTimeKeyInput;
        } else {
            FSTimeKeyInput.value = e.data.toUpperCase();
            if (e.data == null ||e.data == " ") {
                GM_setValue('forwardSkipTimeKey', 'L');
                FSTimeKeyInput.value = 'L';
            };
            GM_setValue('forwardSkipTimeKey', FSTimeKeyInput.value);
        };
        lastFSTimeKeyInput = FSTimeKeyInput.value;
    });
    BSTimeBtn.onclick = () => {
        video.currentTime = video.currentTime - parseInt(BSTimeInput.value);
    };
    BSTimeInput.addEventListener('input', (e) => {
        if (isNaN(parseInt(BSTimeInput.value))|| (parseInt(BSTimeInput.value)) < 1 || ''+BSTimeInput.value != parseInt(BSTimeInput.value)) {
            BSTimeInput.value = '1';
        };
        if (BSTimeInput.value.length > 3) {BSTimeInput.value = lastBSTimeInput};
        GM_setValue('backwardSkipTime', BSTimeInput.value);
        lastBSTimeInput = BSTimeInput.value;
    });
    BSTimeKeyInput.addEventListener('input', (e) => {
        if (BSTimeKeyInput.value == '' || e.data.toUpperCase() == inputBox.value || e.data.toUpperCase() == FSTimeKeyInput.value) {
            BSTimeKeyInput.value = lastBSTimeKeyInput;
        } else {
            BSTimeKeyInput.value = e.data.toUpperCase();
            if (e.data == null ||e.data == " ") {
                GM_setValue('backwardSkipTimeKey', 'L');
                BSTimeKeyInput.value = 'L';
            };
            GM_setValue('backwardSkipTimeKey', BSTimeKeyInput.value);
        };
        lastBSTimeKeyInput = BSTimeKeyInput.value;
    });
    SpeedFastBtn.onclick = () => {
        video.playbackRate = 3.0;
        video.defaultPlaybackRate = 3.0;
    };
    SpeedSlowBtn.onclick = () => {
        video.playbackRate = 0.25;
        video.defaultPlaybackRate = 0.25;
    };
    autoDisSpcCB.addEventListener('change', (e) => {
        if (e.currentTarget.checked === true) {GM_setValue('autoDisableSpecial', 'checked');};
        if (e.currentTarget.checked === false) {GM_setValue('autoDisableSpecial', 'none');};
    });
    autoDisSpcInput.addEventListener('input', (e) => {
        if (isNaN(parseInt(autoDisSpcInput.value))|| (parseInt(autoDisSpcInput.value)) < 1 || ''+autoDisSpcInput.value != parseInt(autoDisSpcInput.value)) {
            autoDisSpcInput.value = '200';
        };
        if (autoDisSpcInput.value.length > 4) {autoDisSpcInput.value = lastautoDisSpcInput};
        GM_setValue('autoDisSpcInput', autoDisSpcInput.value);
        lastautoDisSpcInput = autoDisSpcInput.value;
    });
};

function check() {
    var autoDisSpcAble;
    var send = true;
    var checkLoop = setInterval(() => {
        autoDisSpcAble = GM_getValue('autoDisableSpecial');
        if (autoDisSpcAble == 'checked') {
            var checkDanmaku = setInterval(() => {
                autoDisSpcAble = GM_getValue('autoDisableSpecial');
                if (autoDisSpcAble == 'none') {clearInterval(checkDanmaku);};
                var SpcDanmaku = document.getElementsByClassName('bilibili-player-video-adv-danmaku')[0].querySelectorAll('div');
                var autoDisSpcNum = GM_getValue('autoDisSpcInput');
                if (SpcDanmaku.length >= autoDisSpcNum) {
                    if (autoDisSpcAble != 'none') {
                        $('.bilibili-player-video-adv-danmaku').hide();
                        var toast = document.getElementsByClassName('bilibili-player-video-toast-top')[0];
                        if (send) {send = false;toast.innerHTML = `<div class="bilibili-player-video-toast-item">检测到高级弹幕多於${autoDisSpcNum}，自动屏蔽中</div>`;setTimeout(() => {toast.innerHTML = '';},3000);};
                    };
                } else {$('.bilibili-player-video-adv-danmaku').show();send = true;};
            }, 100);
            autoDisSpcAble = GM_getValue('autoDisSpcInput');
        } else {
            send = true;
            $('.bilibili-player-video-adv-danmaku').show()
        };
    }, 500);
};