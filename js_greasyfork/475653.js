// ==UserScript==
// @name         huawei-vmall助手
// @namespace    公众号：时光先报
// @version      1.0.6
// @description  毫秒级华为商城助手
// @author       secret119
// @license      All Rights Reserved
// @match        https://www.vmall.com/product/*.html
// @match        https://*.cloud.huawei.com/*
// @match        https://www.vmall.com/product/*.html?*
// @match        https://www.vmall.com/order/*
// @match        https://sale.vmall.com/rush/*
// @connect      api.m.taobao.com
// @connect      api.pinduoduo.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475653/huawei-vmall%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/475653/huawei-vmall%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var version = "1.0.6";
(function () {
    'use strict';
    window.onload = () => {
        // 自动登录
        if (window.location.href.indexOf('cloud.huawei') !== -1) {
            // 浏览器记住密码的情况下
            setTimeout(() => {
                $('body').click()
            }, 1000)
            setTimeout(() => {
                $('.button-base-box').click()
            }, 2000)
        }
        // 提交订单
        if (window.location.href.indexOf('/order') !== -1) {
            if (sessionStorage.getItem('isRuning') == 'true') {
                if (document.getElementById('checkoutSubmit') != null) {
                    document.getElementById('checkoutSubmit').click();//提交订单
                }
                order_check();
                ec.order.submit();
            }
            //定时5分停止刷新
            // setTimeout(() => {
            //     clearTimeout(window.timer1);
            //     clearTimeout(window.timer2);
            //     sessionStorage.clear();
            //     window.location.href = 'https://www.vmall.com/member/order?t=' + new Date().getTime();
            // }, 300000);
        }
        // 商城申购
        if (window.location.href.indexOf('/product') !== -1) {
            if (rush.account.isLogin()) {
                initBox();
            } else {
                rush.business.doGoLogin(); //页面登录
            }
        }
        // 检查登录情况
        if (window.location.href.indexOf('/rush') !== -1) {
            if (ec.account.isLogin()) {
                const skuIds = ec.skuList.map((item) => {
                    return item.skuInfo[0].id
                }).join(',')
                const getTime = new Date().getTime()
                getSkuRushbuyInfo(skuIds, getTime)
            } else {
                window.location.replace(ec.loginUrl)
            }
        }

    }

    function order_check() {
        var box_ok = $('.box-ok');//再试试
        if (box_ok.length == 1) {
            console.log("再试试..." + box_ok[0].textContent);
            $('.box-ok')[0].click();
        } else if (box_ok.length == 3) {
            console.log("再试试..." + box_ok[2].textContent);
            $('.box-ok')[2].click();
        }
        window.timer2 = setTimeout(() => {
            console.log("订单校验...");
            if (document.getElementById('checkoutSubmit') != null) {
                console.log("提交订单...");
                document.getElementById('checkoutSubmit').click();//提交订单
            }
            ec.order.submit();
            order_check();
        }, 100 + Math.floor(Math.random() * 500));
    }

    const initBox = () => {
        if ($('.product-button.clearfix')[0].lastChild == null) {
            setTimeout(initBox, 300);
            return;
        }
        const style = `#rushToBuyBox{z-index: 9999;background-color:rgba(255,235,235,0.7);width:260px;font-size:14px;position:fixed;top:20%;right:150px;padding:10px;border-radius:5px;box-shadow:1px 1px 9px 0 #888;transition:right 1s;text-align:center}#rushToBuyBox:hover{right:10px}.title{font-size:16px;font-weight:bold;margin:10px 0}.title span{font-size:12px;color:#9c9c9c}#formList{margin:10px}.time span{color:red}#formList input{background:0;height:20px;font-size:14px;outline:0;border:1px solid #ccc;margin-bottom:10px}#formList input:focus{border:1px solid #4ebd0d}#formList div span{font-size:12px;color:red}#formList div{margin-bottom:10px}.countdown{margin-top:10px}`
        const html = `
                    <div id='rushToBuyBox'>
                        <h3 class="title">
                            华为商城助手 <span>公众号【时光先报】${version}</span>
                        </h3>
                        <form id='formList'>
                            <div>活动开始时间</div>
                            <input type="text" id="g_startTime"  value="" placeholder="2023/09/19 10:08:00" />
                            <div>提前刷新页面<span>(s)</span></div>
                            <input type="checkBox" id='isRefresh'> 开启</input>
                            <input style="margin-left:10px;width: 100px;" disabled id='refreshTime' type="number" /> 秒</br>
                            <button id='rushToBuy'>开始运行</button><button style='margin-left:5px' id='stop'>停止[清缓存]</button>
                        </form>
                        <div class='countdown'>倒计时: <span id='g_countdown'>00:00:00</span>秒</div>
                    </div>
                    `
        var stylenode = document.createElement('style');
        stylenode.setAttribute("type", "text/css");
        if (stylenode.styleSheet) { // IE
            stylenode.styleSheet.cssText = style;
        } else { // w3c
            var cssText = document.createTextNode(style);
            stylenode.appendChild(cssText);
        }
        var node = document.createElement('div');
        node.innerHTML = html;
        document.head.appendChild(stylenode);
        document.body.appendChild(node);
        const g_startTime = document.querySelector('#g_startTime')
        const isRefresh = document.querySelector('#isRefresh')
        const refreshTime = document.querySelector('#refreshTime')
        const countdown = document.querySelector('#rushToBuy')
        const stop = document.querySelector('#stop')
        isRefresh.addEventListener('change', () => {
            sessionStorage.setItem('isRefresh', isRefresh.checked);
            refreshTime.disabled = !isRefresh.checked;
        });
        countdown.addEventListener('click', () => {
            countdown.disabled = true;
            countdown.innerText = '等待抢购中...'
            sessionStorage.setItem('isRuning', true);
            server_time_Uphone();
        });
        stop.addEventListener('click', () => {
            countdown.disabled = false
            countdown.innerText = '开始运行'
            sessionStorage.clear();
            clearTimeout(window.timer1);
            clearTimeout(window.timer2);
        });
        if (sessionStorage.getItem('isRuning') == 'true') {
            countdown.disabled = true;
            countdown.innerText = '等待抢购中...'
            refreshTime.disabled = false;
            refreshTime.value = 0;
            server_time_Uphone();
            return;
        }

        // 设置开始时间
        var cdate = $('.product-button.clearfix')[0].lastChild.textContent;
        if (cdate == null || cdate.indexOf('开始') === -1) {
            cdate = new Date().getTime(); //开始时间时间戳
            sessionStorage.setItem('g_startTime', cdate);
        } else {
            cdate = cdate.substring(0, cdate.indexOf('开始'));
            var startTime = cdate.replace('月', '-').replace('日', '').trim() + ":00";
            startTime = new Date().getFullYear() + "-" + startTime;
            if (navigator.userAgent.indexOf("Safari") != -1) {
                startTime = startTime.replace(/-/g, '/');
            }
            g_startTime.value = startTime;
            //开始时间时间戳
            sessionStorage.setItem('g_startTime', new Date(startTime).getTime());
        }
        sessionStorage.setItem('current_time', new Date().getTime());

        refreshTime.value = 30;
        isRefresh.click();
    }

    function server_time_Uphone() {
        var sellStartTime_timestamp = Number(sessionStorage.getItem('g_startTime'));
        var current_time = Number(sessionStorage.getItem('current_time'));
        var diff_time = sellStartTime_timestamp - current_time;
        if (current_time == undefined || diff_time < 10000) {
            my_syncTime_pdd(200);
        } else if (diff_time < 60000) {
            my_syncTime_pdd(1000);
        } else {
            my_syncTime_pdd(2000);
        }
    }

    function my_syncTime_pdd(num) {
        GM_xmlhttpRequest({
            url: "https://api.pinduoduo.com/api/server/_stm",
            method: 'GET',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function (responseDetails) {
                if (responseDetails.status == 200) {
                    var result = JSON.parse(responseDetails.responseText.replace('fff(', '').replace(')', ''));
                    var currentTime = result.server_time;
                    var startTime = Number(sessionStorage.getItem('g_startTime'));
                    sessionStorage.setItem('current_time', currentTime);

                    const isRefresh = document.querySelector('#isRefresh')
                    const refreshTime = document.querySelector('#refreshTime')
                    var time_difference = startTime - currentTime;
                    console.log("距开抢时间：" + time_difference);
                    if (isRefresh.checked && time_difference <= refreshTime.value * 1000) {
                        if (time_difference >= 20 * 1000) {//至少提前20秒刷新
                            sessionStorage.setItem('isRefresh', !isRefresh.checked)
                            window.location.reload();
                        }
                    }
                    if (time_difference < 1200) {
                        rushToBuy();
                    } else {
                        var time_text = Math.ceil(time_difference / 1000);
                        document.querySelector('#g_countdown').innerText = time_text.toHHMMSS();
                        window.timer = setTimeout(server_time_Uphone, num);
                    }
                } else {
                    setTimeout(() => {
                        my_syncTime_pdd(500);
                    }, 1000);
                }
            }
        });
    }

    // 点击申购
    const rushToBuy = () => {
        if (window.location.href.indexOf('/rush') !== -1) {
            ec.submit(0);
        }
        if (window.location.href.indexOf('/product') !== -1) {
            var pclearfix = $('.product-button.clearfix')
            if (pclearfix == null || pclearfix.length == 0) {
                console.log("开抢已结束");
            } else {
                if (pclearfix[0].lastChild.textContent.indexOf('立即') == -1 && pclearfix[0].lastChild.textContent.indexOf('支付') == -1) {
                    console.log("还未开抢，继续等待");
                    window.timer1 = setTimeout(rushToBuy, 100);
                    return;
                } else {
                    pclearfix[0].lastChild.click(); //立即下单
                    rush_check();
                }
            }
        }
    }

    function rush_check() {
        var queue_btn = $('.queue-btn');
        if (queue_btn instanceof Element) {
            console.log(queue_btn.textContent);//等待弹框
            if ($('.t-small.t-small-big').textContent != null) {
                //是否等待、重新点击申购
                if ($('.t-small.t-small-big').textContent.indexOf('已售完')) {
                    setTimeout(rushToBuy, 500 + Math.floor(Math.random() * 5000));
                    return;
                }
            }
            window.timer1 = setTimeout(rush_check, 300);
            return;
        }
        var pclearfix = $('.product-button.clearfix');//下单按钮判断
        if (pclearfix == null || pclearfix.length == 0) {
            console.log("抢购已结束");
            return;
        }
        window.timer2 = setTimeout(rush_check, 300 + Math.floor(Math.random() * 500));
    }

    Number.prototype.toHHMMSS = function () {
        var hours = Math.floor(this / 3600) < 10 ? ("00" + Math.floor(this / 3600)).slice(-2) : Math.floor(this / 3600);
        var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2);
        var seconds = ("00" + (this % 3600) % 60).slice(-2);
        return hours + ":" + minutes + ":" + seconds;
    };
})();