// ==UserScript==
// @name         MpAutoPublish
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  微信公众号自动发布插件
// @author       yeahMao
// @match        http://mp.weixin.qq.com/*
// @match        https://mp.weixin.qq.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @require      https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.js
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// 红色油猴才有的权限 @grant        GM_cookie
// 红色油猴才有的权限 @grant        unsafeWindow
// 红色油猴才有的权限 @grant        window
// @copyright 2021, yeahmiao (https://greasyfork.org/zh-CN/users/1039500-yeahmao)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461565/MpAutoPublish.user.js
// @updateURL https://update.greasyfork.org/scripts/461565/MpAutoPublish.meta.js
// ==/UserScript==


(function() {
    'use strict';


// 获取群发ticket
function getticket() {
    Log.info('获取群发ticket');
    return WechatRequest({
        url: `${Config.api.safeassistant}?1=1&token=${getUrlParam('token')}`,
        form: {
            token: getUrlParam('token'),
            f: 'json',
            ajax: 1,
            random: Math.random(),
            action: 'get_ticket',
        },
    }).then((body) => {
        console.log(body)
        if (body.base_resp.ret === 0) {
            Log.info('群发ticket获取成功');
            return {
                ticket: body.ticket,
                operation_seq: body.operation_seq,
            };
        } else {
            Log.info('群发ticket获取失败');
            throw body;
        }
    });
}

// var ticket = getticket();
// console.log(ticket)

function fabu_setting_set_mingtian() {
    var _dropbox_jintian_mingtian = $('div.mass-send__timer > div > dl > div:nth-child(2) > ul > li.weui-desktop-dropdown__list-ele');
    if (_dropbox_jintian_mingtian.length >= 2) {
        _dropbox_jintian_mingtian[1].click()
    }
}

function fabu_setting_qunfa(jintian_mingtian, send__timer, hour, minute) {
    // 今天明天按钮（两个元素的时候，才能继续执行）
    var dropbox_jintian_mingtian = $('.weui-desktop-form__dropdown__value');
    if (dropbox_jintian_mingtian.length < 2) {
        return false;
    }
    if (dropbox_jintian_mingtian[0].innerText != jintian_mingtian) {
        // dropbox_jintian_mingtian[0].innerText = jintian_mingtian;
        // dropbox_jintian_mingtian[0].setAttribute('title', jintian_mingtian);
       return false;
    }

    var send__timer__input =  $('div.mass-send__timer  input')
    if (send__timer__input.length < 2) {
        return false;
    }

    // 方案三：可见的元素点击
    // 显示出来时间选择框
    if($('.weui-desktop-picker__dd__time.weui-desktop-picker__dd').is(":visible") == false) {
        $('.weui-desktop-icon__time:visible').click();
        return false;
    }
    var eles_h = $('div.mass-send__timer > dl > dd > ol.weui-desktop-picker__time__panel.weui-desktop-picker__time__hour > li:nth-child(' + (hour+1) + ').weui-desktop-picker__selected:visible');
    var eles_m = $('div.mass-send__timer > dl > dd > ol.weui-desktop-picker__time__panel.weui-desktop-picker__time__minute > li:nth-child(' + (minute+1) + ').weui-desktop-picker__selected:visible');
    if (eles_h.length == 0 || eles_m.length == 0) {
        var eles_h = $('div.mass-send__timer > dl > dd > ol.weui-desktop-picker__time__panel.weui-desktop-picker__time__hour > li:nth-child(' + (hour+1) + '):visible');
        var eles_m = $('div.mass-send__timer > dl > dd > ol.weui-desktop-picker__time__panel.weui-desktop-picker__time__minute > li:nth-child(' + (minute+1) + '):visible');
        eles_h[0].click();
        eles_m[0].click();
        return false;
    }

    return true;
}

// 0. 打开定时群发
// 1. 今天还可以群发1次
//      设置时间为12:12
// 2. 今天还可以群发0次
//      设置时间为12:00
function fabu_setting(day) {
    // 0. 打开定时群发
    {
        var eles = $('.mass-send__form input.weui-desktop-switch__input');
        if (eles.length) {
            if (eles[0].checked == false) {
                eles[0].click()
                return
            }
        }
    }
    var dingshi_qunfa = $('.weui-desktop-form__control-group .weui-desktop-switch__box');
    if (dingshi_qunfa.length) {
        var dropbox_jintian_mingtian = $('.weui-desktop-form__dropdown__value');
        if (dropbox_jintian_mingtian.length < 2) {
            dingshi_qunfa[0].click();
            return false;
        }
    }

    // 元素不存在（未加载），直接返回
    var mass_send__footer = $('.mass-send__footer');
    if (mass_send__footer.length == 0) {
        return
    }

    var mass_send__footer_txt = mass_send__footer[0].innerText;
    console.log(">>>        mass_send__footer_txt = ", mass_send__footer_txt);

    // 发布今天的
    if (day == 1) {
        if (mass_send__footer_txt.search('今天还可以群发1次') == -1) {
            alert('今天还可以群发0次!!!   ' + mass_send__footer_txt)
            return false;
        }

        let d = new Date();
        if (d.getHours() < 11) {
            return fabu_setting_qunfa('今天', '11:55', 11, 55);
        } else if (d.getHours() < 18) {
            return fabu_setting_qunfa('今天', '18:18', 18, 18);
        } else {
            return true;
        }
    }
    // 发布明天的
    else if (day == 2) {
        if (mass_send__footer_txt.search('今天还可以群发') != -1) {
            fabu_setting_set_mingtian();
            return false;
        } else if (mass_send__footer_txt.search('明天还可以群发0次') != -1) {
            alert('明天还可以群发0次!!!    ' + mass_send__footer_txt)
        } else if (mass_send__footer_txt.search('明天还可以群发1次') != -1) {
            console.log(">>>        明天还可以群发1次");
            return fabu_setting_qunfa('明天', '11:58', 11, 58);
        } else {
            alert('未知内容：' + mass_send__footer_txt)
        }
    }

    return false;
}

function getContinueSend() {
  var ret = null;
  var btns = $('.weui-desktop-dialog__ft button');
  for (var i = 0;  i < btns.length; ++i) {
    var btn = btns[i];
    console.log(btn)
  }
}
// getContinueSend()

function fabu(day, timer_id) {

    // 取消选中《文中广告智能插入》
    var js_auto_insert_ad = $('.js_auto_insert_ad')
    if (js_auto_insert_ad.length == 0) {
        alert('【失败】 取消选中《文中广告智能插入》');
        clearInterval(timer_id);
        return;
    } else {
        if (js_auto_insert_ad[0].checked) {
            js_auto_insert_ad[0].click();
        }
    }

    var mass_send__footer = $('.mass-send__footer');
    var jixu_qunfa = $('div > div:nth-child(2) > div.weui-desktop-dialog__wrp > div > div.weui-desktop-dialog__ft > div > div:nth-child(1) > button');
    var wechat_yanzheng = $('body > div.dialog_wrp.ui-draggable > div > div.dialog_hd > h3');
    if (wechat_yanzheng.length && $(wechat_yanzheng[0]).is(":visible")) {
        console.log(">>> 微信验证");
        // 微信验证：清理定时器
        clearInterval(timer_id);
        throw(-1);
    }
    else if (jixu_qunfa.length && $(jixu_qunfa[0]).is(":visible")) {
        console.log(">>> 继续群发");
        jixu_qunfa.click()
        clearInterval(timer_id);
    }
    else if (mass_send__footer.length && $(mass_send__footer).is(":visible")) {
        console.log(">>> 设置页面");
        // 如果设置完成了，执行点击《群发》按钮
        if (fabu_setting(day)) {
            // 立即发送
            var btn_qunfa = $('div.weui-desktop-dialog__ft > div > div.weui-desktop-popover__wrp > div > button');
            btn_qunfa.click();
        }
    }
    else {
        console.log(">>> 保存并群发");
        $('#js_send').click()
    }
}

// day: "today" / "tomorrow"
// day: 1 / 2
function main(day) {
    // debugger;
    var timer_id = setInterval(function() {
        fabu(day, timer_id);
    }, 1234);
}

    document.body.onkeyup = function (e) {
        e = e || window.event; //标准化事件处理
        var s = e.type + " " + e.keyCode; //获取键盘事件类型和按下的值
        console.log(s, e);
        switch(e.keyCode){ // 获取当前按下键盘键的编码
            // case 0x31 : //  1
            case 0x61 : //  小键盘 1
                console.log('发布今天的')
                main(1)
                break;
            // case 0x32 : //  2
            case 0x62 : //  小键盘 2
                console.log('发布明天的')
                main(2)
                break;
        }
        return false
    }
})();

