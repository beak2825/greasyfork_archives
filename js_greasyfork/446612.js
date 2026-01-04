// ==UserScript==
// @name         数藏HELLO刷刷助手
// @license       公众号：时光现报
// @namespace    公众号：时光现报
// @version      1.3
// @description  scsj自动刷新工具，自动提醒
// @author       wuj
// @include      https://scsjie.com/
// @include      https://scsjie.com/#/shop/goodDetail?*
// @grant        none
// @icon         https://www.abmbio.xin/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/446612/%E6%95%B0%E8%97%8FHELLO%E5%88%B7%E5%88%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446612/%E6%95%B0%E8%97%8FHELLO%E5%88%B7%E5%88%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var $style = $('<style>' +
    '#control_container{position:fixed;right:0px;bottom:220px;width:100px;height:50px; background:#e9e9e9;}' +
    'p{margin:10px 0;}' +
    '#control_container button{width:50%;font-size:12px;text-align:center;vertical-align:middle;}' +
    '.input_wrapper{font-size: 12px;text-align:center;vertical-align:middle;}' +
    '.input_fill{width:50%;font-size: 10px;text-align:center;vertical-align:middle;}' +
    '.notice{margin:10px 10px;padding:10px 10px;color:darkslategrey;border-style: solid; border-width: 1px; border-color:darkslategrey;}' +
    '#wx{text-align: center;}' +
    '#countdown_wrapper {display:none; font-size: 16px; text-align:center; background:#ffeaf1;}' +
    '#countdown_wrapper p{width:100%;}' +
    '#countdown {font-size: 20px; color:#ff1268;}' +
    '.warning {color:red; font-weight:400;}' +
    'h3 {font-weight:800;}' +
    '</style>');

(function () {
    'use strict';

    var $control_container = $("<div id='control_container'></div>");

    var $duration_input = $('<div class="input_wrapper" id="duration_input_wrapper">刷新间隔(s)：<input id="duration_input" class="input_fill" type="text" value="4"></div>');
    $control_container.append($style);
    $control_container.append($duration_input);
    var $amount_input = $('<div class="input_wrapper" id="amount_input_wrapper">设置金额(元)：<input id="amount_input" type="text" class="input_fill" value="250"></div>');
    $control_container.append($amount_input);

    var audio = document.createElement('audio');  //生成一个audio元素
    audio.id = 'audio_play';
    audio.loop = true;
    //audio.controls = false;  //这样控件才能显示出来
    audio.src = 'http://data.huiyi8.com/2017/gha/03/17/1702.mp3';  //音乐的路径
    $control_container.append(audio);  //把它添加到页面中

    const btn = document.createElement('button');
    btn.style.position = 'fixed';
    btn.style.right = 0;
    btn.style.bottom = '150px';
    btn.style.width = '100px';
    btn.style.height = '50px';
    btn.style.color = 'green';
    btn.innerText = '开始捡漏';
    btn.addEventListener('click', rush);
    document.body.appendChild(btn);
    $control_container.insertBefore(btn);

    const btnclos = document.createElement('button_close');
    btnclos.style.position = 'fixed';
    btnclos.style.right = 0;
    btnclos.style.bottom = '120px';
    btnclos.style.width = '100px';
    btnclos.style.height = '20px';
    btnclos.style.background = '#e9e9e9';
    btnclos.style['text-align'] = 'center';
    btnclos.style['vertical-align'] = 'middle';
    btnclos.style.color = 'red';
    btnclos.innerText = '停止刷新';
    btnclos.addEventListener('click', close);
    document.body.appendChild(btnclos);

    function rush() {
        console.log("开始查询!!😄");

        let num = 0;
        var time_num = $("#duration_input").val();
        var amount_input = $("#amount_input").val();
        window.dotimer = setInterval(function () {
            num += 1;
            document.getElementsByClassName('news_header_bottom_btn row_center')[0].click();
            sleep(200);
            if (document.readyState == 'complete') {
                setTimeout(after_click_param('drawer_bottom_right_btn'), 100);
            } else {
                console.log("%c  ------  %c", "background:#f26522; color:#ffffff");
            }

            setTimeout(function () {
                testprice(dotimer, num, amount_input)
            }, 400);

        }, time_num * 1000);

    }


    function testprice(dotimer, num, amount_input) {
        if (document.readyState == 'complete' && document.getElementsByClassName('row_between home_card_content')[0] != null) {
            var amount = document.getElementsByClassName('row_between home_card_content')[0].firstChild.children[0].innerText;
            console.log(" 当前低价：%c " + amount + "---锁单金额< " + amount_input, "background:#f26522; color:#ffffff");
            //如果在支付中，继续刷新
            var payinNum = document.getElementsByClassName('home_card_view')[0].getElementsByClassName('pay_in_top_img').length;
            if (Number(amount) < Number(amount_input) && Number(payinNum) == 0) {
                document.getElementsByClassName('home_card_view')[0].click();
                setTimeout(submit_order, 100);
                console.log("%c  捡漏成功    %c", "background:#f26522; color:#ffffff", "", "锁单价格--->" + amount);
                clearInterval(dotimer);
            }else{
                if (Number(payinNum) == 0) {
                    console.log('查询第' + num + '次');
                } else {
                    console.log('检测到正在支付中...继续查询第' + num + '次');
                }
            }
        }else{
            setTimeout(function () {
                testprice(dotimer, num, amount_input)
            }, 200);
        }
    }

    function submit_order() {
        document.getElementById('audio_play').play();
        var alerts = document.getElementsByClassName('bottom_btn row_center')[0];
        if (document.readyState == 'complete' && (alerts != null || alerts != undefined)) {
            document.getElementsByClassName('bottom_btn row_center')[0].click();
            setTimeout(after_click_param('van-button van-button--default van-button--large van-dialog__confirm van-hairline--left'), 100);
        } else {
            setTimeout(submit_order, 100);
        }

    }

    function after_click_param(cname) {
        return function () {
            after_click(cname);
        }
    }

    function after_click(cname) {
        var fedd = document.getElementsByClassName(cname)[0];
        if (document.readyState == 'complete' && (fedd != null || fedd != undefined)) {
            document.getElementsByClassName(cname)[0].click();
        } else {
            setTimeout(after_click_param(cname), 100);
        }

    }

    function close() {
        clearInterval(window.dotimer);
    }

    function sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return true;
        }
    }

})();