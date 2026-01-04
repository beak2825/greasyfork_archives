// ==UserScript==
// @name         32号空间刷刷助手
// @license      公众号：时光现报
// @namespace    公众号：时光现报
// @version      1.4
// @description  32号空间自动刷新工具，自动提醒
// @author       wuj
// @include      https://32.baokuan.cc/
// @include      https://32.baokuan.cc/?*
// @grant        none
// @icon         https://www.abmbio.xin/favicon.ico
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/446611/32%E5%8F%B7%E7%A9%BA%E9%97%B4%E5%88%B7%E5%88%B7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446611/32%E5%8F%B7%E7%A9%BA%E9%97%B4%E5%88%B7%E5%88%B7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var $style = $('<style>' +
    '#control_container{position:fixed;right:0px;bottom:270px;width:100px;height:50px; background:#e9e9e9;}' +
    'p{margin:10px 0;}' +
    '#control_container button{width:50%;font-size:12px;text-align:center;vertical-align:middle;}' +
    '.input_wrapper{font-size: 12px;text-align:center;vertical-align:middle;background:#e9e9e9;}' +
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

    var $duration_input = $('<div class="input_wrapper" id="duration_input_wrapper">刷新间隔(s)：<input id="duration_input" class="input_fill" type="text" value="2"></div>');
    $control_container.append($style);
    $control_container.append($duration_input);
    var $type = $('<div class="input_wrapper" id="select_ck">只查四兽？[1/0]：<input id="select_ck_input" class="input_fill" type="text" value="1"></div>');
    $control_container.append($type);

    var $amount_input = $('<div class="input_wrapper" id="amount_input_wrapper">设置金额(元)：<input id="amount_input" type="text" class="input_fill" value="1000"></div>');
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
    btn.style.background = '#e9e9e9';
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
        var select_ck_input = $("#select_ck_input").val();//是否只查四兽

        window.dotimer = setInterval(function () {
            num += 1;
            if (document.getElementsByClassName('left_select_btn')[0].children[1].className != 'activeIndex') {//按价格升序
                //window.location.href = 'https://32.baokuan.cc/#/pages/shop/newshop';//页面刷新
                setTimeout(function () {
                    document.getElementsByClassName('left_select_btn')[0].children[1].click();//点击价格
                }, 100);
            }
            if (document.readyState == 'complete') {
                if (document.getElementsByClassName('cuIcon-down')[0] == undefined) {
                    setTimeout(function () {
                        document.getElementsByClassName('activeIndex')[0].click();
                    }, 100);
                }
                if (1 == select_ck_input) {
                    setTimeout(select_ckli(num % 4), 100);
                } else {
                    document.getElementsByClassName('isSeal')[0].click();
                }

                //刷新完成直接检测
                setTimeout(function () {
                    testPrice(dotimer, num, select_ck_input, amount_input)
                }, 200);

            } else {
                console.log("%c  ------  %c", "background:#f26522; color:#ffffff");
            }
        }, time_num * 1000);

    }

    function testPrice(dotimer, num, select_ck_input, amount_input) {
        if (document.readyState == 'complete' && document.getElementsByClassName('step-list-money')[0] != null) {
            var amount = document.getElementsByClassName('step-list-money')[0].innerText.substring(1);
            console.log(" 当前低价：%c " + amount + "---锁单金额< " + amount_input, "background:#f26522; color:#ffffff");
            //如果在支付中，也继续刷新
            var display = document.getElementsByClassName('shop_list_item')[0].getElementsByClassName('isBayMaySeal')[0].style.display;
            if (Number(amount) < Number(amount_input) && display == 'none') {
                if (1 == select_ck_input) {
                    var selaname = document.getElementsByClassName('title_name')[0].innerHTML;
                    if (selaname.indexOf('青龙') == -1 && selaname.indexOf('白虎') == -1 && selaname.indexOf('朱雀') == -1 && selaname.indexOf('玄武') == -1) {
                        console.log('重新筛选....');
                        setTimeout(select_ckli(0), 200);
                        return;
                    }
                }

                console.log("%c  捡漏开始下单...    %c", "background:#f26522; color:#ffffff", "", "锁单价格--->" + amount);
                document.getElementsByClassName('step-list-money')[0].click();
                setTimeout(submit_order, 200);
                clearInterval(dotimer);

            } else if (document.getElementsByClassName('title_name')[0].innerHTML.indexOf('朱雀') != -1 && Number(amount) < Number(10000) && display == 'none') {
                console.log("%c  捡漏开始下单...    %c", "background:#f26522; color:#ffffff", "", "锁单价格--->" + amount);
                document.getElementsByClassName('step-list-money')[0].click();
                setTimeout(submit_order, 200);
                clearInterval(dotimer);
            } else {
                if (display == 'none') {
                    console.log('查询第' + num + '次');
                } else {
                    console.log('检测到正在支付中...继续查询第' + num + '次');
                }
            }
            //console.log("%c  等待加载完成---","background:#f26522; color:#ffffff");
        }
    }

    function select_ckli(select_ck_input) {
        if (select_ck_input < 4) {
            document.getElementsByClassName('stepBox_right')[0].children[select_ck_input].click();
        } else {
            console.log("%c 请输入0-3---", "background:#f26522; color:#ffffff");
        }
    }

    function submit_order() {
        document.getElementById('audio_play').play();
        var fedd = document.getElementsByClassName('buyBtn')[0];
        if (document.readyState == 'complete' && (fedd != null || fedd != undefined)) {
            fedd.click();
            setTimeout(after_click_param('position-fixed'), 100);
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