// ==UserScript==
// @name         my_助手（H5-my-bp源版）
// @namespace    公众号：时光先报
// @version      2.0.8
// @description  辅助购my门票:自动提交
// @author       secret119
// @license      All Rights Reserved
// @match        https://buy.damai.cn/*
// @match        https://detail.damai.cn/*
// @match        https://m.damai.cn/*
// @match        https://show.maoyan.com/*
// @match        https://h5.dianping.com/*
// @match        https://mclient.alipay.com/*
// @match        https://mtop.damai.cn/h5/mtop.alibaba.detail.subpage.getdetail/*
// @match        https://mtop.damai.cn/*
// @match        https://m.taopiaopiao.com/*
// @grant        GM_xmlhttpRequest
// @connect      api.m.taobao.com
// @connect      api.pinduoduo.com
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/472878/my_%E5%8A%A9%E6%89%8B%EF%BC%88H5-my-bp%E6%BA%90%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472878/my_%E5%8A%A9%E6%89%8B%EF%BC%88H5-my-bp%E6%BA%90%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

var version = "2.0.8";

var $style = $('<style>' +
    '#control_container{margin: 20px 0; background:#e9e9e9;padding:20px 0;}' +
    'p{margin:10px 0;}' +
    '#control_container button{width:80%;margin:10px 10%;padding:10px 0;font-size:50px;border-style: solid;}' +
    '#start_btn{margin:15px 0;color:#fff;background:#ff457a;}' +
    '#end_btn{color:red;}' +
    '.input_wrapper{display: flex;justify-content:center;font-size: 16px; margin-bottom:10px;}' +
    ".input_wrapper_phone{font-size: 28px;padding:5px 0; text-align:center;}" +
    ".input_wrapper_phone input{width: 30%;}" +
    '.notice{margin:0px 10px;padding:10px 10px;color:darkslategrey;}' +
    '#wx{text-align: center;}' +
    '#countdown_wrapper {display:none; font-size: 30px; text-align:center; background:#ffeaf1;}' +
    '#countdown_wrapper p{width:100%;}' +
    '#countdown {font-size: 50px; color:#ff1268;}' +
    '#selected_event {font-size: 30px; color:#ff1268;}' +
    '.warning {color:red; font-weight:400;}' +
    'h3 {font-weight:800;}' +
    '</style>');

$(document).ready(function () {
    var curr_url = window.location.href;

    //maoyan --------  h5
    if (curr_url.includes("/ticket-level")) {
        setTimeout(my_ajax_test, 0);
        sessionStorage.setItem('selected_price', null);
        my_date_selected();
    }
    //bp
    if (curr_url.includes("show.maoyan.com/qqw/tickets")) {
        setTimeout(my_ajax_test, 0);
        my_bp_check();
    }

    if ((curr_url.includes("show.maoyan.com/qqw") && curr_url.includes("detail")) || curr_url.includes('h5.dianping.com/app/myshow')) {
        if ('YES' == sessionStorage.getItem('if_reset')) {
            window.location.href = sessionStorage.getItem('skuUrl');
        }
        my_phone_detail_ui();
        my_ajax_test();
    }
    //my_pay
    if (curr_url.includes("https://show.maoyan.com/qqw/confirm") || curr_url.includes("https://h5.dianping.com/app/movieshoworder/pre-order.html")) {
        if ('YES' == sessionStorage.getItem('if_start')) {
            my_fill_phone_form();
            sessionStorage.setItem('submitBtn_click', 0);
            //定时停止刷新
            setTimeout(() => {
                clearTimeout(window.timer);
                clearTimeout(window.timer_order);
                sessionStorage.clear();
                if (curr_url.includes("dianping")) {
                    window.location.href = 'https://h5.dianping.com/app/myshow/?utm_source=dpshare&fromTag=dpshare&utm_content=dpshare#/order-list';
                } else {
                    window.location.href = 'https://show.maoyan.com/qqw/myshow/?#/order-list?%24%24frombottomtab=1';
                }
            }, 760000);
        }
    }

    //tips
    if (curr_url.includes("https://excashier.alipay.com/") || curr_url.includes("https://mclient.alipay.com") || curr_url.includes("https://mpay.meituan.com")) {
        clearTimeout(window.timer);
        clearTimeout(window.timer_order);
        sessionStorage.clear();
        alert("下单成功，尽快付款哦");
    }
});

Number.prototype.toHHMMSS = function () {
    var hours = Math.floor(this / 3600) < 10 ? ("00" + Math.floor(this / 3600)).slice(-2) : Math.floor(this / 3600);
    var minutes = ("00" + Math.floor((this % 3600) / 60)).slice(-2);
    var seconds = ("00" + (this % 3600) % 60).slice(-2);
    return hours + ":" + minutes + ":" + seconds;
};

// -------  待text   --------

// -------  maoyan 完整版普通版 开始  --------

function my_bp_check() {
    var showArea = $('.show-area');
    if (showArea == null || showArea.length == 0) {
        setTimeout(() => {
            var showArea = $('.show-area');
            if (showArea == null || showArea.length == 0) {
                if ($("#weapp-module-topas") != null && $("#weapp-module-topas").length != 0) {
                    if ($("#weapp-module-topas").text().indexOf('未开售') != -1) {
                        window.location.reload();
                    }
                }
                // var dbdy = document.body;
                // if (dbdy.textContent != null && dbdy.textContent.indexOf('确认') == -1) {
                //     window.location.reload();
                // }
            }
        }, Math.floor(Math.random() * 300) + 200);

        if ($("#weapp-module-topas") != null && $("#weapp-module-topas").length != 0) {
            if ($("#weapp-module-topas").text().indexOf('未开售') != -1) {
                window.location.reload();
            }
        }
        setTimeout(my_bp_check, 100);
        return;
    }

    //date-select
    var date_elms = showArea.eq(0).find('.show-item');
    var changci_sn = Number(sessionStorage.getItem('changci_sn'));
    if (date_elms.length > changci_sn) {
        if (date_elms[changci_sn].className.indexOf('on') == -1) {
            date_elms[changci_sn].click();
        }
    } else {
        if (date_elms[0].className.indexOf('on') == -1) {
            date_elms[0].click();
        }
    }
    setTimeout(my_bp_price, 0);
    //open
}

function my_bp_price() {
    var price_elms = $('.price-area .price-item');
    if (price_elms == null || price_elms.length == 0) {
        setTimeout(my_bp_price, 50);
        return;
    }
    //校验场次
    var date_elms = $('.show-area').eq(0).find('.show-item');
    var changci_sn = Number(sessionStorage.getItem('changci_sn'));
    if (date_elms.length > changci_sn) {
        if (date_elms[changci_sn].className.indexOf('on') == -1) {
            my_bp_check();
            return;
        }
    }

    var price_sn = Number(sessionStorage.getItem('price_sn'));
    if (Number.isNaN(price_sn)) {
        price_sn = 0;//默认0
    }
    if (price_elms.length > price_sn) {
        if (price_elms[price_sn].textContent.indexOf('缺货') == -1) {
            if (price_elms[price_sn].className.indexOf('on') == -1) {
                price_elms[price_sn].click();
            }
        } else {
            console.log(price_elms[price_sn].textContent + '，重新选择');
            window.timer = setTimeout(() => {
                window.location.reload();
            }, 100 + Math.floor(Math.random() * 400));
            return;
        }
    } else {
        if (price_elms[0].className.indexOf('on') == -1) {
            price_elms[0].click();
        }
    }
    //check
    if (price_elms.length > price_sn) {
        if (price_elms[price_sn].className.indexOf('on') == -1) {
            setTimeout(my_bp_price, 0);
            return;
        }
    }
    //价位选好了，选人数
    setTimeout(my_bp_select, 0);
}

function my_bp_select() {
    var number_select = $('.choice-num');
    if (number_select == null || number_select.length == 0) {
        setTimeout(my_bp_select, 50);
        return;
    }
    var phone_people_num = Number(sessionStorage.getItem('phone_people_num'));
    if (Number.isNaN(phone_people_num) || phone_people_num == 0) {
        phone_people_num = 2;//默认为2
    }

    var prenum = Number(number_select.text());
    console.log("设置数量：" + phone_people_num + ",需加人数：" + phone_people_num - prenum);
    if (phone_people_num - prenum > 0) {
        for (var i = 0; i < phone_people_num - prenum; i++) {
            setTimeout(() => {
                $('.add-opt').click();
            }, 20);
        }
    }
    setTimeout(my_bp_button, 0);
}

function my_bp_button() {
    var phone_people_num = Number(sessionStorage.getItem('phone_people_num'));
    if (Number.isNaN(phone_people_num) || phone_people_num == 0) {
        phone_people_num = 2;//默认为2
    }
    var prenum = Number($('.choice-num').text());
    if (phone_people_num != prenum) {
        setTimeout(my_bp_button, 50);
        return;
    }
    console.log("提交订单--设置数量：" + phone_people_num + ",已选人数：" + prenum);
    $('.confirm-ticket').click();//my的确认按钮
    setTimeout(() => {
        var confirmdt = $('.confirm-ticket');
        if (confirmdt != null) {
            confirmdt.click();
            if (confirmdt.length > 0) {
                confirmdt[0].click();
            }
        }
    }, 0);
    setTimeout(() => {
        var confirmdt = $('.confirm-ticket');
        if (confirmdt != null) {
            confirmdt.click();
            if (confirmdt.length > 0) {
                confirmdt[0].click();
            }
        }
    }, 100);
    setTimeout(() => {
        var confirmdt = $('.confirm-ticket');
        if (confirmdt != null) {
            confirmdt.click();
            if (confirmdt.length > 0) {
                confirmdt[0].click();
            }
        }
    }, 200);
}


function my_date_selected() {
    var my_bottom = $('.show-list-wrap');
    if (my_bottom == null || my_bottom.length == 0) {
        var refresh_button = $('.refresh_button');//判断是否有点击刷新按钮
        if (refresh_button != null && refresh_button.length >= 0) {
            refresh_button.click();
        }
        setTimeout(my_date_selected, 50);
        return;
    }

    //date-select
    var date_elms = $('.show-list-wrap').eq(0).find('.wrap-item');
    var changci_sn = Number(sessionStorage.getItem('changci_sn'));
    if (date_elms.length > changci_sn) {
        if (date_elms[changci_sn].className.indexOf('selected') == -1) {
            date_elms[changci_sn].click();
        }
    } else {
        if (date_elms[0].className.indexOf('selected') == -1) {
            date_elms[0].click();
        }
    }
    //open
    if ('YES' == sessionStorage.getItem('if_start')) {
        setTimeout(my_selected_price, 50);
    }
}

function my_selected_price() {
    var price_elms = $('#ticket-list-wrap .wrap-item');
    if (price_elms == null || price_elms.length == 0) {
        setTimeout(my_selected_price, 50);
        return;
    }
    if (sessionStorage.getItem('selected_price') != 'YES') {
        sessionStorage.setItem('selected_price', "YES");
    } else {
        return;
    }
    var price_sn = Number(sessionStorage.getItem('price_sn'));
    if (Number.isNaN(price_sn)) {
        price_sn = 0;
    }
    if (price_elms.length > price_sn) {
        if (price_elms[price_sn].className.indexOf('outOfStock') == -1 && price_elms[price_sn].className.indexOf('soldOut') == -1) {
            price_elms[price_sn].click();
        } else {
            alert(price_elms[price_sn].textContent + '，请重新选择');
            return;
        }
    } else {
        price_elms[0].click();
    }
    setTimeout(my_num_select, 0);
}

function my_num_select() {
    var number_select = $('.ticket-number-select-amount');
    if (number_select == null || number_select.length == 0) {
        setTimeout(my_num_select, 50);
        return;
    }
    var phone_people_num = Number(sessionStorage.getItem('phone_people_num'));
    if (Number.isNaN(phone_people_num) || phone_people_num == 0) {
        phone_people_num = 2;//默认为2
    }
    var prenum = Number(number_select.text().substring(0, 1));
    console.log("设置数量：" + phone_people_num + ",已选人数：" + prenum);
    if (phone_people_num - prenum > 0) {
        for (var i = 0; i < phone_people_num - prenum; i++) {
            setTimeout(() => {
                $('.ticket-number-select-add').click();
            }, 20);
        }
    }
    setTimeout(my_price_button, 0);
}

function my_price_button() {
    var phone_people_num = Number(sessionStorage.getItem('phone_people_num'));
    if (Number.isNaN(phone_people_num) || phone_people_num == 0) {
        phone_people_num = 2;//默认为2
    }
    var prenum = Number($('.ticket-number-select-amount').text().substring(0, 1));
    if (phone_people_num != prenum) {
        setTimeout(my_price_button, 50);
        return;
    }
    console.log("提交订单--设置数量：" + phone_people_num + ",已选人数：" + prenum);

    if ($('.buttom-block .button').text().indexOf('请选择') == -1) {
        $('.buttom-block .button').click();
        if ($('.buttom-block .button') != null && $('.buttom-block .button').length > 0) {
            $('.buttom-block .button')[0].click();
        }
    } else {
        my_date_selected();
    }

    setTimeout(() => {
        var confirmbt = $('.buttom-block .button');
        if (confirmbt != null) {
            if (confirmbt.text().indexOf('请选择') == -1) {
                confirmbt.click();
                if (confirmbt.length > 0) {
                    confirmbt[0].click();
                }
            }
        }
    }, 0);
    setTimeout(() => {
        var confirmbt = $('.buttom-block .button');
        if (confirmbt != null) {
            if (confirmbt.text().indexOf('请选择') == -1) {
                confirmbt.click();
                if (confirmbt.length > 0) {
                    confirmbt[0].click();
                }
            }
        }
    }, 100);
    setTimeout(() => {
        var confirmbt = $('.buttom-block .button');
        if (confirmbt != null) {
            if (confirmbt.text().indexOf('请选择') == -1) {
                confirmbt.click();
                if (confirmbt.length > 0) {
                    confirmbt[0].click();
                }
            }
        }
    }, 200);
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
                window.current_time = result.server_time;
                if (window.sellStartTime_timestamp == undefined) {
                    $("#countdown_wrapper").show();
                    window.sellStartTime_timestamp = Number(sessionStorage.getItem('sellStartTime_timestamp'));
                }
                var time_difference = window.sellStartTime_timestamp - window.current_time;
                console.log("距开抢时间：" + time_difference);
                if (time_difference < 750) {
                    if (sessionStorage.getItem('skuUrl') == null || window.sellStartTime_timestamp == undefined) {
                        my_bottom_button();
                    } else {
                        window.location.href = sessionStorage.getItem('skuUrl');
                    }
                } else {
                    var time_text = Math.ceil(time_difference / 1000);
                    $("#countdown").text(time_text.toHHMMSS());
                    $("#diff_start_ms").text("毫秒数：" + time_difference);
                    window.timer = setTimeout(my_timed_Uphone, num);
                }
            } else {
                setTimeout(() => {
                    my_syncTime_pdd(500);
                }, 1000);
            }
        }
    });
}

function my_bottom_button() {
    var my_bottom = $(".detail-normal-button");
    if (my_bottom == null || my_bottom.length == 0) {
        setTimeout(my_bottom_button, 200);
        return;
    }
    if (my_bottom.text().indexOf("立即") != -1) {
        //click tips
        $(".detail-normal-button").click();
    } else if (my_bottom.text().indexOf("缺货登记") != -1) {

    } else {
        setTimeout(my_bottom_button, 200);
    }
}

function my_timed_Uphone() {
    var diff_time = window.sellStartTime_timestamp - window.current_time;
    if (window.current_time == undefined || diff_time < 9000) {
        my_syncTime_pdd(200);
    } else if (diff_time < 60000) {
        my_syncTime_pdd(1000);
    } else {
        my_syncTime_pdd(3000);
    }
}

function my_fill_phone_form() {
    var selectinfo = $(".wrapper__count");
    if (selectinfo != null && selectinfo.length != 0) {
        var tipnum = Number(selectinfo.text().substring(10, 11));
        var yesnum = $(".wrapper__item.wrapper__item--selected").length;
        console.log("票数：" + tipnum + ",已选数：" + yesnum);
        if (tipnum - yesnum > 0) {
            var numdiv = $(".wrapper__item");
            for (var i = 0; i < tipnum - yesnum; i++) {
                for (var j = 0; j < numdiv.length; j++) {
                    if (numdiv[j].className.indexOf('wrapper__item--selected') == -1) {
                        numdiv[j].click();
                        break;
                    }
                }
            }
        }
    }
    setTimeout(my_check_fill, 0);
}

function my_check_fill() {
    var selectinfo = $(".wrapper__count");
    if (selectinfo != null && selectinfo.length != 0) {
        var tipnum = Number(selectinfo.text().substring(2, 3));
        var yesnum = $(".wrapper__item.wrapper__item--selected").length;
        if (tipnum == yesnum) {
            setTimeout(my_submit_phone_order, 0);
        } else {
            my_fill_phone_form();
        }
    } else {
        var qpfs = $('.wrapper__list');
        if (qpfs == null || qpfs.length == 0) {
            var checknum = Number(sessionStorage.getItem('my_check_fill'));
            if (Number.isNaN(checknum) || checknum == 0) {
                checknum = 1;
                sessionStorage.setItem('my_check_fill', checknum);
            } else if (checknum > 6) {
                setTimeout(my_submit_phone_order, 100);
                return;
            } else {
                sessionStorage.setItem('my_check_fill', checknum + 1);
            }
        }
        setTimeout(my_fill_phone_form, 0);
    }
}

function my_submit_phone_order() {
    console.log("提交订单中...");
    var submitBtn = $(".submit-right >button");
    if (submitBtn == null || submitBtn.length == 0) {
        setTimeout(my_fill_phone_form, 300);
        return;
    }
    submitBtn.click();
    //计算次数
    var checknum = Number(sessionStorage.getItem('submitBtn_click'));
    if (Number.isNaN(checknum)) {
        checknum = 0;//默认0
    }
    sessionStorage.setItem('submitBtn_click', checknum + 1);
    window.timer_order = setTimeout(my_check_phone_alert, 100 + Math.floor(Math.random() * 800));
}

function my_check_phone_alert() {
    var unpay_modal = $(".unpay-modal-title");
    if (unpay_modal != null && unpay_modal.length != 0) {
        $(".confirm-btn").click();
        alert($(".unpay-modal-title").text())
        return;
    }
    var selectinfo = $(".wrapper__count");
    if (selectinfo != null && selectinfo.length != 0) {
        var tipnum = Number(selectinfo.text().substring(2, 3));
        var yesnum = $(".wrapper__item.wrapper__item--selected").length;
        if (tipnum != yesnum) {
            setTimeout(my_fill_phone_form, 100);
            return;
        }
    }
    //网络开小差
    var err_page = $(".err-page-container .button");
    if (err_page != null && err_page.length != 0) {
        err_page.click();
        err_page[0].click();
        return;
    }

    var pingtu = $(".yoda-puzzle-slider-wrap._yoda_wrapper");
    if (pingtu != null && pingtu.length != 0) {
        //滑块拼图验证
        var puzzleImageMainElment = document.getElementById("puzzleImageMain");//拼图元素
        var sliderBoxElement = document.getElementById("puzzleSliderBox");//滑块按钮

        return;
    }
    //计算次数
    var checknum = Number(sessionStorage.getItem('submitBtn_click'));
    var refreshButton = $(".refresh__button_container");//继续猫眼
    if (refreshButton != null || refreshButton.length != 0) {
        refreshButton.click();
        if (checknum > 100) {
            if (checknum % 6 == 0) {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 1000) + 500);
            } else if (checknum % 4 == 0) {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 2000) + 1500);
            } else {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 2000) + 500);
            }
        } else if (checknum > 50) {
            if (checknum % 8 == 0) {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 2800) + 500);
            }else{
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 1500) + 600);
            }
        } else if (checknum > 20) {
            if (checknum % 3 == 0) {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 1800) + 600);
            }else{
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 900) + 400);
            }
        } else {
            window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 400) + 100);
        }
        return;
    }
    var yoda_slider = $(".yoda-slider-wrapper._yoda_wrapper");
    if (yoda_slider == null || yoda_slider.length == 0) {
        if (checknum > 100) {
            if (checknum % 6 == 0) {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 1000) + 500);
            } else if (checknum % 4 == 0) {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 2000) + 1500);
            } else {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 2000) + 500);
            }
        } else if (checknum > 50) {
            if (checknum % 8 == 0) {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 2800) + 500);
            }else{
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 1500) + 600);
            }
        } else if (checknum > 20) {
            if (checknum % 3 == 0) {
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 1800) + 600);
            }else{
                window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 900) + 400);
            }
        } else {
            window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 400) + 100);
        }
        return;
    }
    if (yoda_slider.text().indexOf('滑块验证') != -1) {
        console.log("滑块验证...");
        var sliderElement = document.getElementById("yodaBoxWrapper");
        if (sliderElement == null || sliderElement.length == 0) {
            window.timer = setTimeout(my_submit_phone_order, Math.floor(Math.random() * 300));
            return;
        }
        var sliderButtonElement = document.getElementById("yodaBox");//滑块按钮
        setTimeout(() => {
            my_yodaBoxWrapper(sliderButtonElement, sliderElement.offsetWidth - sliderButtonElement.offsetWidth);
        }, 100);
    }

    if (1 == 0) {
        window.location.href = 'https://show.maoyan.com/qqw/confirm?';
    }
}


function my_ajax_test() {
    var open = XMLHttpRequest.prototype.open;
    var send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function () {
        var url = arguments[1];
        var method = arguments[0];
        if (method.toUpperCase() === 'GET' && url.indexOf('/myshow/ajax/v2') != -1) {
            this._url = url;
        }
        open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function () {
        this.addEventListener('readystatechange', function () {
            if (this.readyState === 4 && this.status === 200) {
                if (this._url && this._url.indexOf('/myshow/ajax/v2/show') != -1) {
                    var result = JSON.parse(this.responseText);
                    //price
                    if ("YES" == sessionStorage.getItem('if_janlou')) {
                        setTimeout(() => {
                            sessionStorage.setItem('jianlou_load', 'YES');
                            my_price_jianlou();
                        }, 100);

                    } else if ('YES' == sessionStorage.getItem('if_start')) {
                        setTimeout(my_selected_price, 0);
                    }
                } else if (this._url && this._url.indexOf('/myshow/ajax/v2/performance') != -1 && this._url.indexOf('/shows') != -1) {
                    var result = JSON.parse(this.responseText);
                    console.log(result.msg);
                    if (sessionStorage.getItem('skuUrl') != null && sessionStorage.getItem('skuUrl') != undefined) {
                        if (result.msg.indexOf('未开售') != -1) {
                            sessionStorage.setItem('if_reset', 'YES');//开始捡漏
                            setTimeout(() => {
                                window.location.href = sessionStorage.getItem('skuUrl');
                            }, 0);
                            return;
                        }
                    }

                    var if_janlou = sessionStorage.getItem('if_janlou');//开始捡漏
                    if ("YES" == if_janlou) {
                        console.log('捡漏刷新中...');
                        setTimeout(() => {
                            sessionStorage.setItem('jianlou_load', 'YES')
                            my_dateContent_click(0);
                        }, 100);
                        return;
                    }
                    setTimeout(my_date_selected, 100);
                }

            }
        });
        send.apply(this, arguments);
    };
}

function my_price_jianlou() {
    //price
    var price_elms = $('#ticket-list-wrap .wrap-item');
    if (price_elms == null || price_elms.length == 0) {
        setTimeout(my_price_jianlou, 200);
        return;
    }
    var price_sn = Number(sessionStorage.getItem('price_sn'));
    if (Number.isNaN(price_sn)) {
        price_sn = 0;
    }
    if (price_elms.length <= price_sn) {
        price_sn = 0;
    }
    for (var k = 0; k < price_elms.length; k++) {
        if (price_elms[k].className.indexOf('outOfStock') == -1 && price_elms[k].className.indexOf('soldOut') == -1) {
            if (price_sn == 0 || k == price_sn) {
                console.log("%c  检测到有余票    %c", "background:#f26522; color:#ffffff", "", "price--->" + price_elms[price_sn].textContent);
                price_elms[k].click();
                setTimeout(my_num_select, 100);
                return;
            }
        }
    }
    //重新查询
    var jl_timer_out = sessionStorage.getItem("jl_timer_out");
    if (jl_timer_out == null || jl_timer_out == 'YES') {
        setTimeout(() => {
            my_dateContent_click(0);
        }, Math.floor(Math.random() * 400) + 1100);
    }

}


function my_dateContent_click(index) {
    var my_bottom = $('.show-list-wrap');
    if (my_bottom == null || my_bottom.length == 0) {
        clearTimeout(window.timer);
        clearTimeout(window.timer_order);
        sessionStorage.clear();
        return;
    }
    //date-select
    var date_elms = $('.show-list-wrap').eq(0).find('.wrap-item');

    var changci_sn = Number(sessionStorage.getItem('changci_sn'));
    if (changci_sn < 0 || changci_sn >= date_elms.length) {
        changci_sn = 0;
    }
    if (date_elms[index] != null) {
        console.log('查询场次：' + date_elms[index].textContent);
    } else {
        console.log('查询完毕，开始下一轮---------');
        sessionStorage.setItem("jl_timer_out", "YES");
        return;
    }

    const jianlou_load = (changci_sn, date_elms, index) => {
        var jianlou_flag = sessionStorage.getItem('jianlou_load');
        if ('YES' == jianlou_flag || jianlou_flag == null) {
            if (changci_sn == 0) {
                date_elms[changci_sn].click();
            } else if (changci_sn > 0) {
                if (index < date_elms.length) {
                    date_elms[changci_sn].click();
                }
            } else {
                if (index < date_elms.length) {
                    if (index == date_elms.length - 1) {
                        sessionStorage.setItem("jl_timer_out", "YES");
                        date_elms[index].click();
                    } else {
                        date_elms[index].click();
                        sessionStorage.setItem("jl_timer_out", "NO");
                        sessionStorage.setItem('jianlou_load', 'NO')
                        window.timer = setTimeout(function () {
                            my_dateContent_click(index + 1);
                        }, Math.floor(Math.random() * 400) + 100);
                    }
                }
            }
        } else {
            window.timer = setTimeout(() => {
                jianlou_load(changci_sn, date_elms, index);
            }, 500)
        }
    }
    jianlou_load(changci_sn, date_elms, index);
}


function my_phone_detail_ui() {
    var $service = $(".index-tab-wrapper");
    if ($service == null || $service.length == 0) {
        setTimeout(my_phone_detail_ui, 300);
        return;
    }

    var $control_container = $("<div id='control_container'></div>");
    var $wx = $(`<div id="wx" class="notice"><p>公众号【时光先报】 ${version}</p></div>`);
    var $changciId = $('<div class="input_wrapper_phone" id="changci_input_wrapper">场次序号：<input id="changci_input" type="text" value="0" ></div>');
    var $eventId = $('<div class="input_wrapper_phone" id="event_input_wrapper">票价序号：<input id="event_input" type="text" value="0" ></div>');
    var $number_input = $('<div class="input_wrapper_phone" id="number_input_wrapper">观影人数量：<input id="number_input" type="number" value="1" min="1" max="6"></div>');
    var $delayTime = $('<div class="input_wrapper_phone" id="delayTime_input_wrapper">提前毫秒数：<input id="delayTime_input" type="text" value="500"></div>');

    var $start_btn = $('<button id="start_btn">开始抢票</button>');
    var $end_btn = $('<button id="end_btn">停止-清缓存</button>');
    var $notice = $('<div id="notice" class="notice"><h3>使用步骤</h3><p>1.提前登录-填写购票人,收货地址</p><p>2.输入场次票价序号,从0开始</p><p>3.点击‘开始抢票’</p></div>');
    var $notice2 = $('<div id="notice2" class="notice"><p>注：默认选2个观演人（可修改）</p></div>');
    var $countdown = $('<div id="countdown_wrapper"><p id="diff_start_ms">ms</p><p>倒计时:</p><p id="countdown">00:00:00</p></div>');

    $control_container.append($style);
    $control_container.append($wx);
    $control_container.append($changciId);
    $control_container.append($eventId);
    $control_container.append($number_input);
    $control_container.append($delayTime);
    $control_container.append($start_btn);
    //btn开始
    var $datetime_input = $(`<div id="datetime_input_div" style="display:flex; align-items:center;margin:25px 10%;"> <button id="jianloubtn" style="color: green;width: 80%;">开始捡漏</button></div>`);

    $control_container.append($datetime_input);


    $control_container.append($end_btn);
    $control_container.append($notice);
    $control_container.append($notice2);

    $control_container.insertBefore($service);
    $countdown.insertBefore($control_container);

    $("#start_btn").click(function () {
        var changcisn = $("#changci_input").val();
        var price_sn = $("#event_input").val();
        if (price_sn == "" || price_sn == null) {
            alert("请先输入票价序号");
            return;
        }
        if (changcisn == "" || changcisn == null) {
            alert("请先输入场次序号");
            return;
        }
        sessionStorage.setItem('changci_sn', changcisn);
        sessionStorage.setItem('price_sn', price_sn);
        var people_num = $("#number_input").val();
        window.phone_people_num = people_num;
        sessionStorage.setItem('phone_people_num', people_num);
        sessionStorage.setItem('reload_cnt', 0);
        var detailurl = window.location.href.substring(window.location.href.indexOf('detail'));
        var idlength = detailurl.indexOf('?');
        if (window.location.href.includes("show.maoyan.com/qqw")) {
            var skuUrl = 'https://show.maoyan.com/qqw/tickets?id=' + detailurl.substring(idlength - 6, idlength);
            sessionStorage.setItem('skuUrl', skuUrl);
            console.log("skuUrl：" + skuUrl);
        } else {
            var skuUrl = 'https://h5.dianping.com/app/myshow/?utm_source=dpshare&fromTag=dpshare&utm_content=0VRr1cCb#/ticket-level?id=' + detailurl.substring(idlength - 6, idlength) + '&modelStyle=0&_blank=true';
            sessionStorage.setItem('skuUrl', skuUrl);
            console.log("skuUrl：" + skuUrl);
        }

        //已经开抢了，立即购买
        var cdate = $('.bomb-time');
        var sellStartTime = "";
        if (cdate == null || cdate.length == 0) {
            sellStartTime = new Date().getTime() - Number($("#delayTime_input").val()); //开始时间时间戳
        } else {
            cdate = cdate.text() == null ? cdate[0].innerText : cdate.text();
            var startTime = cdate.replace('月', '-').replace('日', '').replace('开抢', '').trim() + ":00";
            startTime = new Date().getFullYear() + "-" + startTime;
            if (navigator.userAgent.indexOf("Safari") != -1) {
                startTime = startTime.replace(/-/g, '/');
            }
            sellStartTime = new Date(startTime).getTime() - Number($("#delayTime_input").val()); //开始时间时间戳
        }
        window.sellStartTime_timestamp = sellStartTime;
        sessionStorage.setItem('sellStartTime_timestamp', sellStartTime);

        // $("#selected_event").text(changcisn);
        $("#countdown_wrapper").show();
        sessionStorage.setItem('if_start', 'YES');//是否开始
        if ('YES' == sessionStorage.getItem('is_immediate')) {
            alert("该场次需配合手动选座，选座后自动提交");
            result = seat_phone_confirm_url(eventid, price, people_num);
            window.seat_phone_order_url = result;
            timedUpdate_phone_seat();
        } else {
            my_timed_Uphone();
        }
    });
    $("#end_btn").click(function () {
        clearTimeout(window.timer);
        clearTimeout(window.timer_order);
        sessionStorage.clear();
        $("#countdown_wrapper").hide();
    });

    $("#jianloubtn").click(my_jianloubtn_click);
}

function my_jianloubtn_click() {
    var changcisn = $("#changci_input").val();
    var price_sn = $("#event_input").val();
    var people_num = $("#number_input").val();
    sessionStorage.setItem('phone_people_num', people_num);
    sessionStorage.setItem('changci_sn', changcisn);
    sessionStorage.setItem('price_sn', price_sn);

    sessionStorage.setItem('if_start', 'YES');//是否开始
    sessionStorage.setItem('if_janlou', "YES");//开始捡漏
    $(".detail-normal-button").click();
}


function my_yodaBoxWrapper(sliderButtonElement, sliderDistance) {
    // var sliderElement = document.getElementById("yodaBoxWrapper");

    // var sliderButtonElement = document.getElementById("yodaBox");
    // var sliderDistance = sliderElement.offsetWidth - sliderButtonElement.offsetWidth; // 滑行的距离

    const touchIdentifier = Date.now();
    const touchStart = new Touch({
        identifier: touchIdentifier,
        target: sliderButtonElement,
        clientX: sliderButtonElement.getBoundingClientRect().left,
        clientY: sliderButtonElement.getBoundingClientRect().top,
        screenX: sliderButtonElement.getBoundingClientRect().left,
        screenY: sliderButtonElement.getBoundingClientRect().top,
        pageX: sliderButtonElement.getBoundingClientRect().left,
        pageY: sliderButtonElement.getBoundingClientRect().top,
        radiusX: 1,
        radiusY: 1,
        force: 1,
    });
    const touchStartEvent = new TouchEvent('touchstart', {
        cancelable: true,
        bubbles: true,
        composed: true,
        touches: [touchStart],
        targetTouches: [touchStart],
        changedTouches: [touchStart],
    });
    sliderButtonElement.dispatchEvent(touchStartEvent);

    const duration = 900; // 滑动持续时间（毫秒）
    const startTime = Date.now();

    function updateTouchMove() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1); // 计算进度（0到1之间）

        const speed = 1 - Math.pow(1 - progress, 3); // 根据进度计算速度，可以根据需求调整速度曲线
        const distance = sliderDistance * speed; // 根据速度计算当前滑动距离

        const randomX = Math.random() * 10 - 5; // X轴随机偏移量
        const randomY = Math.random() * 10 - 5; // Y轴随机偏移量

        const touchMove = new Touch({
            identifier: touchIdentifier,
            target: sliderButtonElement,
            clientX: sliderButtonElement.getBoundingClientRect().left + distance + randomX,
            clientY: sliderButtonElement.getBoundingClientRect().top + randomY,
            screenX: sliderButtonElement.getBoundingClientRect().left + distance + randomX,
            screenY: sliderButtonElement.getBoundingClientRect().top + randomY,
            pageX: sliderButtonElement.getBoundingClientRect().left + distance + randomX,
            pageY: sliderButtonElement.getBoundingClientRect().top + randomY,
            radiusX: 1,
            radiusY: 1,
            force: progress, // 根据进度设置压力值
        });

        const touchMoveEvent = new TouchEvent('touchmove', {
            cancelable: true,
            bubbles: true,
            composed: true,
            touches: [touchMove],
            targetTouches: [touchMove],
            changedTouches: [touchMove],
        });
        sliderButtonElement.dispatchEvent(touchMoveEvent);

        if (progress < 1) {
            requestAnimationFrame(updateTouchMove); // 继续更新滑动状态
        } else {
            const touchEnd = new Touch({
                identifier: touchIdentifier,
                target: sliderButtonElement,
                clientX: sliderButtonElement.getBoundingClientRect().left + sliderDistance + randomX,
                clientY: sliderButtonElement.getBoundingClientRect().top + randomY,
                screenX: sliderButtonElement.getBoundingClientRect().left + sliderDistance + randomX,
                screenY: sliderButtonElement.getBoundingClientRect().top + randomY,
                pageX: sliderButtonElement.getBoundingClientRect().left + sliderDistance + randomX,
                pageY: sliderButtonElement.getBoundingClientRect().top + randomY,
                radiusX: 1,
                radiusY: 1,
                force: 1,
            });

            const touchEndEvent = new TouchEvent('touchend', {
                cancelable: true,
                bubbles: true,
                composed: true,
                touches: [touchEnd],
                targetTouches: [touchEnd],
                changedTouches: [touchEnd],
            });
            sliderButtonElement.dispatchEvent(touchEndEvent);
        }
    }

    requestAnimationFrame(updateTouchMove);

    console.log("滑块验证..." + sliderDistance);
    window.timer_order = setTimeout(my_check_phone_alert, 1000);
}

// -------  猫眼 完整版普通版 结束  --------'
