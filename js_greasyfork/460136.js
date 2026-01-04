// ==UserScript==
// @name         tinderBox
// @namespace    tinderTools
// @version      0.2
// @description  虚拟优惠按键弹窗
// @author       You
// @include      *://www.baidu.com/*
// @include      *://www.taobao.com/*
// @include      *://item.taobao.com/*
// @include      *://detail.tmall.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license      GPL License
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/460136/tinderBox.user.js
// @updateURL https://update.greasyfork.org/scripts/460136/tinderBox.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    .tinderbox {top:300px; left: 40%; position: fixed;width: 320px;height: 154px;border: 1px #cccccc solid;border-radius: 10px;z-index: 999999;background: #ffffff;padding: 12px;}
    .tinderbox .close {position: absolute;right: -20px;top: -20px;width: 30px;height: 30px;background: rgb(255, 255, 255);border-radius: 25px;border: 1px #aaaaaa solid;cursor: pointer;}
    .tinderbox .close:hover {background: #eeeeee;}
    .tinderbox .close:before {position: absolute;content: '';width: 22px;height: 1px;background: rgb(100, 100, 100);transform: rotate(45deg);top: 15px;left: 4px;}
    .tinderbox .close:after {content: '';position: absolute;width: 22px;height: 1px;background: rgb(100, 100, 100);transform: rotate(-45deg);top: 15px;left: 4px;}
    .tinderbox input {transition:all 0.30s ease-in-out;-webkit-transition: all 0.30s ease-in-out;-moz-transition: all 0.30s ease-in-out;border:#364f86 1px solid;border-radius:3px;outline:none;font-size: 16px;float: left;}
    .tinderbox input[type=text] {width: 160px;height: 40px;border: 1px #999999 solid;margin: 7px 10px;}
    .tinderbox input[type=text]::-webkit-input-placeholder{color:#cccccc;font-size: 14px;}

    .tinderbox button {width: 80px;height: 40px;border: 1px #999999 solid;background: #ffffff;border-radius: 4px;font-size: 16px;margin: 7px 0;font-size: 16px;color: #666666;}
    .tinderbox input::focus {box-shadow:0 0 5px rgba(81, 203, 238, 1);-webkit-box-shadow:0 0 5px rgba(81, 203, 238, 1);-moz-box-shadow:0 0 5px rgba(81, 203, 238, 1);}

    .tinderbox .uico {display: block;width: 40px;height: 40px;background-color: #cccccc;border-radius: 3px;float: left;text-align: center;padding: 8px;}
    .tinderbox .uico span {color: #ffffff;position: absolute;margin-left: 7px;margin-top: 27px;width: 32px;height: 12px;border-left: solid 1px currentColor;border-right: solid 1px currentColor;border-top: solid 1px currentColor;border-bottom: solid 1px transparent;background-color: currentColor;border-radius: 6px 6px 0 0;}
    .tinderbox .uico span:before {content: '';position: absolute;left: 2px;top: -25px;width: 25px;height: 25px;border-radius: 50%;border: solid 1px currentColor;background-color: currentColor;}

    .tinderbox img.coupon {width: 100%;height: 80px;padding: 15px 0px;}

    .tinderbox .remindBox {position: absolute;width: 300px;height: 140px;background-color: #ffffff;text-align: center;transform: translate(-50%, -50%);top: 50%;left: 50%;border: 1px #ccc solid;}
    .tinderbox .remindBox span {display: block;padding: 8px 0;}
    .tinderbox .remindBox button {color: #333333;background-color: #dddddd;}

    .tinderbox.hidden {display:none;}
    .tinderbox .remindBox.hidden {display:none;}
    `);

    var tinderBox = $('<div class="tinderbox hidden"></div>');
    var closeBtn = $('<div class="close"></div>');
    var userIcon = '<div class="uico"><img width="100%" src="https://pic1.zhimg.com/80/v2-c1748343e68d08167b4c950fb54c4bf6_720w.jpg?source=1940ef5c" alt=""></div>';
    var inputText = $('<input type="text" name="userName" placeholder="输入亮灯牌的用户" />');
    var sendBtn = $('<button>确定</button>');
    var couponImg = '<img class="coupon" src="https://pic.616pic.com/ys_bnew_img/00/06/12/6QLoLGyq3C.jpg" />';
    tinderBox.append(closeBtn, userIcon, inputText, sendBtn, couponImg);

    var remindBox = $('<div class="remindBox hidden"></div>');
    var spanText1 = $('<span>账户名：【】</span>');
    var spanText2 = $('<span>操作成功，24小时内到达</span>');
    var remindBtn = $('<button>确认</button>');
    remindBox.append(spanText1, spanText2, remindBtn);
    tinderBox.append(remindBox);

    closeBtn.click(function(){
        tinderBox.addClass('hidden');
    });

    sendBtn.click(function(){
        $(spanText1).html('账户名：【' +  $(inputText).val() + '】');
        $(inputText).val('');
        remindBox.removeClass('hidden');
    });

    remindBtn.click(function(){
        remindBox.addClass('hidden');
    });

    $('.ItemHeader--root--DXhqHxP').click(function(){
        tinderBox.removeClass('hidden');
    });

    $('body').append(tinderBox);

})();