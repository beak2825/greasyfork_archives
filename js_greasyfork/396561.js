// ==UserScript==
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @name         Youtube 字幕翻譯重疊修復、字幕字形改微軟正黑體
// @namespace    https://github.com/InterfaceGUI/
// @version      1.1
// @description  Youtube caption overlap repair.
// @author       LarsHagrid
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @downloadURL https://update.greasyfork.org/scripts/396561/Youtube%20%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AD%AF%E9%87%8D%E7%96%8A%E4%BF%AE%E5%BE%A9%E3%80%81%E5%AD%97%E5%B9%95%E5%AD%97%E5%BD%A2%E6%94%B9%E5%BE%AE%E8%BB%9F%E6%AD%A3%E9%BB%91%E9%AB%94.user.js
// @updateURL https://update.greasyfork.org/scripts/396561/Youtube%20%E5%AD%97%E5%B9%95%E7%BF%BB%E8%AD%AF%E9%87%8D%E7%96%8A%E4%BF%AE%E5%BE%A9%E3%80%81%E5%AD%97%E5%B9%95%E5%AD%97%E5%BD%A2%E6%94%B9%E5%BE%AE%E8%BB%9F%E6%AD%A3%E9%BB%91%E9%AB%94.meta.js
// ==/UserScript==

var fsize = [];
for(var i = 2; i < 100; i+=2){
  fsize.push(i);
}

var cfg = new MonkeyConfig({
    title: 'Setting 設置',
    menuCommand: true,
    params: {
        font_size: {
            type: 'select',
            choices: fsize,
            default: '40'
        },
        font_weight: {
            type: 'select',
            choices: ['bold','bolder','normal','lighter'],
            default: 'bold'
        },
        font: {
            type: 'text',
            default: 'Microsoft JhengHei'
        }
    }
});

var fontSize = cfg.get('font_size');
var font = cfg.get('font');
var fontWeight = cfg.get('font_weight');

//字體更改
//font-family:字型清單
//font-weight:字型樣式
//webkit-text-stroke:字型外框
function setFont(){
    GM_addStyle(`
    .ytp-caption-segment{
            font-family: `+ font +`,"Monotype Corsiva", "URW Chancery L", "Apple Chancery", "Dancing Script", cursive !important;
            font-weight: `+ fontWeight +` !important;
            font-size: `+ fontSize +`pt !important;
            -webkit-text-stroke: 1.5px black !important;
    }
` )};

var $ = window.jQuery;
'use strict';


$(document).ready(function () {
    setFont();
    setInterval(CCFixs, 10); //檢查字幕重疊頻率(10ms)
    setInterval(CheckConfiguration, 1000);
});

function CheckConfiguration() {
    if (fontSize == cfg.get('font_size') && font == cfg.get('font') && fontWeight == cfg.get('font_weight')){
    }else{
        fontSize = cfg.get('font_size');
        font = cfg.get('font');
        fontWeight = cfg.get('font_weight');
        setFont();
    }

}
function CCFixs() {
    var temp1 = ["", ""];

    $(".caption-window").each(function (index, element) {
        temp1[index] = $(this).attr('id').replace("caption-window-_", "");
    })
    if (parseInt(temp1[0]) > parseInt(temp1[1])) {
        $("#caption-window-_" + temp1[1]).remove();
    } else if (parseInt(temp1[0]) < parseInt(temp1[1])) {
        $("#caption-window-_" + temp1[0]).remove();
    }
}


