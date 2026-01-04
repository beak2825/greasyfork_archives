// ==UserScript==
// @name         BilibiliCleaner
// @namespace    http://tampermonkey.net/
// @version      0.9.93
// @description  Remove some boring tips.
// @author       mnts
// @include      http?://live.bilibili.com/?*
// @include      *://*live.bilibili.*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/36873/BilibiliCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/36873/BilibiliCleaner.meta.js
// ==/UserScript==

function removeVideoCannotAutoplayTips()
{
    var divsTips = document.getElementsByClassName('video-cannot-autoplay-tips');
    for (var i = divsTips.length - 1; i >= 0; i--) {
        var divTips = divsTips[i];
        divTips.outerHTML = null;
    }
}

function clickPopup()
{
    var i = 0;

    //full channel present
    var divPopup = document.getElementById('chat-popup-area-vm');
    if (divPopup !== undefined && divPopup !== null) {
        var divsTitle = divPopup.getElementsByClassName('title');

        for (i = 0; i < divsTitle.length; i++) {
            var divTitle = divsTitle[i];

            var strsMatched = divTitle.innerHTML.match(/已.*等待/g);
            if (strsMatched === undefined || strsMatched === null) {
                var divsMain = divPopup.getElementsByClassName('main');

                for (var j = 0; j < divsMain.length; j++) {
                    divsMain[j].click();
                }
            }
        }
    }

    //full channel present, storm result, storm validate code input set focus
    var divsNotice = document.getElementsByClassName('link-popup-panel');
    var inputStormValid = null, divStormValidClose = null, btnStormValidValid = null; //for storm valid panel
    for (i = 0; i < divsNotice.length; i++) {
        var divNotice = divsNotice[i];

        var h2sTitle = divNotice.getElementsByClassName('popup-title');
        var h2Title = (h2sTitle.length > 0 ? h2sTitle[0] : h2sTitle);

        var inputsStormValid = divNotice.getElementsByClassName('link-input');
        var psTip = divNotice.getElementsByClassName('tip');
        if (psTip.length > 0 && inputsStormValid.length > 0) {
            if (psTip[0].innerHTML.match(/.*输入验证码才能领取奖励哦.*/g).length > 0) {
                inputStormValid = inputsStormValid[0];
                divStormValidClose = divNotice.getElementsByClassName('close-btn')[0];
                btnStormValidValid = divNotice.getElementsByClassName('bl-button')[0];
            }
        }

        //medal fav value reaches daily top notice
        var isMedalDailyTop = false;
        if (h2Title.innerHTML === '提示') {
            var divsContent = divNotice.getElementsByClassName('popup-content-ctnr');
            if (divsContent !== undefined && divsContent != null && divsContent.length === 2) {
                var divContent = divsContent[1];
                var strsMatched2 = divContent.innerHTML.match(/.*勋章【.*】已达.*上限/g);
                if (strsMatched2 !== undefined && strsMatched2 !== null) isMedalDailyTop = true;
                strsMatched2 = divContent.innerHTML.match(/.*勋章【.*】升到.*级/g);
                if (strsMatched2 !== undefined && strsMatched2 !== null) isMedalDailyTop = true;
            }
        }

        var shouldContinue = true;
        if (h2Title.innerHTML === '获奖结果') shouldContinue = false;
        if (h2Title.innerHTML === '中奖名单') shouldContinue = false;
        if (h2Title.innerHTML === '节奏风暴') shouldContinue = false;
        if (isMedalDailyTop === true) shouldContinue = false;
        //if (h2Title.innerHTML === '请填写信息') shouldContinue = true;

        if (shouldContinue === true) continue;

        var btnsOK = divNotice.getElementsByClassName('bl-button');
        for (j = 0; j < btnsOK.length; j++) {
            btnsOK[j].click();
        }

        var divsIgnoreNotices = document.getElementsByClassName('ignore-notice');
        var iptIgnore = document.getElementById('cbIgnore');
        if (iptIgnore !== undefined && iptIgnore !== null) iptIgnore.checked = true;
        var divsClose = divNotice.getElementsByClassName('close-btn');
        for (j = 0; j < divsClose.length; j++) {
            divsClose[j].click();
        }
    }

    //for new UI of full channel presents
    var divsGift = document.getElementsByClassName('chat-draw-area-cntr');
    if (divsGift != null && divsGift != undefined) {
        for (i = 0; i < divsGift.length; i++) {
            var divGift = divsGift[i];
            var divsFuncBar = divGift.getElementsByClassName('function-bar draw');
            if (divsFuncBar != null && divsFuncBar != undefined) {
                for (j = 0; j < divsFuncBar.length; j++) {
                    var divFuncBar = divsFuncBar[j];
                    divFuncBar.click();
                }
            }
        }
    }

    //storm click
    var divsStorm = document.getElementsByClassName('rhythm-storm');
    if (inputStormValid === null || inputStormValid === undefined) {
        //click storm when there is no storm valid panel
        for (i = 0; i < divsStorm.length; i++) {
            var divStorm = divsStorm[i];
            divStorm.click();
        }
        flagDivInput = 0;
    } else {
        if (divsStorm.length <= 0 && (divStormValidClose != null && divStormValidClose != undefined)) {
            //close storm valid panel when storm has already disappeared
            divStormValidClose.click();
            flagDivInput = 0;
        } else {
            if (flagDivInput === 0) {
                inputStormValid.focus();
                inputStormValid.addEventListener('keyup', function(event) {
                    if (event.key === 'Enter') { //press enter to validate
                        var inputStormValid = event.target;
                        console.log('inputStormValid = ' + inputStormValid);
                        var divPopup = inputStormValid.parentNode, i = 0;
                        for (i = 0; i < 10; i++) {
                            if (divPopup.classList.contains('popup-content-ctnr')) break;
                            divPopup = divPopup.parentNode;
                        }
                        if (i >= 10) return;
                        console.log('divPopup = ' + divPopup);

                        var btnsOK = divPopup.getElementsByClassName('bl-button');
                        for (i = 0; i < btnsOK.length; i++) {
                            btnsOK[i].click();
                        }
                        console.log('btnsOK = ' + btnsOK);
                    }
                });
            }
            flagDivInput = 1;
        }
    }
}

function needsReload()
{ //bilibili直播页面的h5播放器卡住显示一个加载菊花的时候

    var needs = false;

    var divsLoading = document.getElementsByClassName('video-loading');
    if (divsLoading.length > 0) needs = true;

    if (needs === true) {
        var divsLiveEnding = document.getElementsByClassName('bilibili-live-player-ending-panel');
        if (divsLiveEnding.length > 0) {
            if (divsLiveEnding[0].style.display != "none") needs = false;
        }
    }

    return needs;
}

function doVideoReload()
{
    var divsReload = document.getElementsByClassName('bilibili-live-player-video-controller-reload-btn');
    if (divsReload.length <= 0) return;

    var divReload = divsReload[0];
    var btnsReload = divReload.getElementsByTagName('button');
    if (btnsReload.length <= 0) return;

    console.log('Loading detected, trying to reload...');
    var btnReload = btnsReload[0];
    btnReload.click();
}

function needsReloadPage()
{ //当你用Ctrl+Shift+T重新紧急打开一个刚刚关掉的直播页面想观看时，直播页面却显示“肥肠抱歉，该页面暂时无法访问”的时候
    var divs404 = document.getElementsByClassName('error-404');
    var div404 = (divs404.length <= 0 ? null : divs404[0]);
    if (div404 === null) return false;

    var result = true;

    if (result === true) {
        var imgsNotice = div404.getElementsByTagName('img');
        if (imgsNotice.length > 0) {
            var imgNotice = imgsNotice[0];
            var src = imgNotice.getAttribute('src');
            var strsMatched = src.match(/\/feedback\//g); //为了区分是“直播间不存在”的情况还是“Ctrl+Shift+T重新打开一个刚关掉的直播间”的情况
            if (strsMatched === undefined || strsMatched === null) result = false;
        }
    }

    return result;
}

function tryCommon()
{ //live.bilibili.com/*
    var body = document.getElementsByTagName('body')[0];
    if (body === undefined || body === null) return false;

    if (needsReloadPage()) location.reload();

    window.addEventListener('load', function(event) {
        removeVideoCannotAutoplayTips();
    });

    console.log('Setup removeVideoCannotAutoplayTips');
    console.log('Setup clickPopup()');
    setInterval(function() {
        removeVideoCannotAutoplayTips();
        clickPopup();
    }, 500);
    console.log('Setup auto-reload when stucked');
    setInterval(function() {
        if (needsReload()) doVideoReload();
    }, 15000);

    return true;
}

function clickLotteryClose()
{
    var divsClose = document.getElementsByClassName('lottery-close lottery-close-wrap');
    for (var i = 0; i < divsClose.length; i++) {
        divsClose[i].click();
    }
}

function cycleClickHongbao()
{
    clickHongbao();
    const intervalHongbao = setInterval(function() {
        clickHongbao();
    }, 60000);
}

function clickHongbao()
{
    clickLotteryClose();

    var divsHongbao = document.getElementsByClassName('popularity-red-envelope-entry gift-left-part');
    for (var i = 0; i < divsHongbao.length; i++) {
        divsHongbao[i].click();
    }

    const intervalClickJoin = setInterval(function() {
        clearInterval(intervalClickJoin);

        var joined = false;

        var divsJoined = document.getElementsByClassName('join-btn-content join-timeout-lastnum'); //倒计时中提示
        if (divsJoined.length > 0) joined = true;
        var divsResult = document.getElementsByClassName('abnormalResult'); //没中奖提示
        if (divsResult.length > 0) joined = true;
        var divsPopup = document.getElementsByClassName('lottery'); //中奖提示
        for (var i = 0; i < divsPopup.length; i++) {
            var divsWinning = divsPopup[i].getElementsByClassName('winning');
            if (divsWinning.length > 0) joined = true;
        }

        if (joined != true) {
            var divsJoin = document.getElementsByClassName('join-btn-content join-timeout-start');
            for (var k = 0; k < divsJoin.length; k++) {
                divsJoin[k].click();
            }
            console.log('click join');
        }

        const intervalClickClose = setInterval(function() {
            clearInterval(intervalClickClose);

            var joined = false;

            var divsJoined = document.getElementsByClassName('join-btn-content join-timeout-lastnum'); //倒计时中提示
            if (divsJoined.length > 0) joined = true;
            var divsResult = document.getElementsByClassName('abnormalResult'); //没中奖提示
            if (divsResult.length > 0) joined = true;
            var divsPopup = document.getElementsByClassName('lottery'); //中奖提示
            for (var i = 0; i < divsPopup.length; i++) {
                var divsWinning = divsPopup[i].getElementsByClassName('winning');
                if (divsWinning.length > 0) joined = true;
            }

            if (joined == true) {
                console.log('click close');
                clickLotteryClose();
            }

        }, 1000)

    }, 1000);

    console.log('click hongbao');
}

var flagDivInput = 0;
tryCommon();
cycleClickHongbao();
