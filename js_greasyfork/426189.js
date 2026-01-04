// ==UserScript==
// @name         论坛签到工具
// @namespace    bbsSign
// @version      1.2.4
// @description  常用论坛签到工具，包括远景论坛、天使动漫论坛、52破解、TTG、卡饭等
// @author       Lucky XU
// @include      http*://u2.dmhy.org/*
// @include      http*://*.pcbeta.com/*
// @include      http*://www.tsdm*.*/*
// @include      http*://totheglory.im/*
// @include      http*://www.52pojie.cn/*
// @include      http*://www.smzdm.com/*
// @include      http*://bbs.kafan.cn/*
// @include      http*://www.natfrp.com/*
// @include      http*://www.cordcloud.*/*
// @include      http*://www.mielink.cc/*
// @include      http*://zodgame.xyz/*
// @include      http*://o2v3.imotor.com/*
// @include      http*://www.flyert.com/*
// @include      http*://www.55188.com/*
// @include      http*://fishc.com.cn/*
// @include      http*://www.pdawiki.com/*
// @include      http*://www.910car.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/426189/%E8%AE%BA%E5%9D%9B%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/426189/%E8%AE%BA%E5%9D%9B%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    // 日期格式化
    Date.prototype.format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    // U2
    if (matchURL("u2.dmhy.org")) {
        if (matchURL("showup.php")) {
            var message = $("textarea[name='message']");
            if (message) message.text("注意：回答按钮点击时即提交，手滑损失自负~");
        } else if (window.find("立即签到")) {
            window.location.href = "showup.php";
        }
    }

    // 远景
    if (matchURL("bbs.pcbeta.com") || matchURL("i.pcbeta.com")) {
        // 判断是否登录
        if ($('.vwmy').length > 0) {
            // 获取上次签到日期
            var pcbetaLastSignDate = getData('pcbeta');
            if (!pcbetaLastSignDate || compareDate(new Date().format("yyyy-MM-dd"), pcbetaLastSignDate)) {
                console.log('开始自动签到！');
                $.ajax({
                    type: "GET",
                    url: "/home.php?mod=task&do=apply&id=149",
                    success: function (data) {
                        if (data.indexOf('恭喜您，任务已成功完成，您将收到奖励通知，请注意查收') != -1) {
                            console.log('签到完成!');
                            setData('pcbeta', new Date().format("yyyy-MM-dd"));
                        }
                        if (data.indexOf('抱歉，本期您已申请过此任务，请下期再来') != -1) {
                            console.log('重复签到!');
                            setData('pcbeta', new Date().format("yyyy-MM-dd"));
                        }
                    }
                })
            }
        }
    }

    // TTG
    if (matchURL("totheglory.im")) {
        if ($("#signed")) $("#signed")[0].click();
    }

    // 天使动漫
    if (matchURL("tsdm")) {
        qd('签到领奖!', 'wl_s');
    }

    // 52破解
    if (matchURL("52pojie.cn")) {
        var qdimg = $("img[src$='qds.png']");
        if (qdimg) {
            $.ajax({
                url: 'home.php?mod=task&do=apply&id=2',
                dataType: 'html',
                success: function (result) {
                    if (result.indexOf('任务已完成') != -1) {
                        console.log("签到成功!");
                        qdimg.attr('src', 'https://www.52pojie.cn/static/image/common/wbs.png');
                    }
                }
            })
        }
    }

    // 什么值得买
    if (matchURL("smzdm.com")) {
        var signBtn = $('.J_punch');
        if ($('.J_punch').length > 0 && signBtn.text() == '签到领奖') {
            $('.J_punch')[0].click();
        }
    }

    // 卡饭
    if (matchURL("kafan.cn")) {
        var dklink = $("img[src$='dk.png']").closest("a");
        if ($("img[src$='wb.png']").closest("a").css('display') === 'none') {
            dklink[0].click();
        }
    }

    // Sakura Frp
    if (matchURL("www.natfrp.com")) {
        // 判断是否登录
        if ($('#token').length > 0) {
            // 获取上次签到日期
            var sakuraFrpLastSignDate = getData('sakura_frp');
            if (!sakuraFrpLastSignDate || compareDate(new Date().format("yyyy-MM-dd"), sakuraFrpLastSignDate)) {
                // 跳转到签到页面
                window.location.href = "/user/sign";
            }
        }

        // 签到
        if ($('#sign').length > 0) {
            setTimeout(function () {
                $('#switch_captcha')[0].click();
            }, 1000)
            setTimeout(function () {
                console.log('开始签到')
                $('#sign').click();
                setData('sakura_frp', new Date().format("yyyy-MM-dd"));
            }, 5000)
        } else {
            if (window.find("您今天已经签到过了")) {
                console.log('已签到')
                setData('sakura_frp', new Date().format("yyyy-MM-dd"));
            }
        }
    }

    // CordCloud
    if (matchURL("cordcloud")) {
        var qdBtn = $("#checkin");
        if (qdBtn.length > 0) {
            $.ajax({
                type: "POST",
                url: "/user/checkin",
                dataType: "json",
                success: function (data) {
                    $("#checkin-msg").html(data.msg);
                    $("#checkin-btn").hide();
                    $("#msg").html(data.msg);
                }
            })
        }
    }

    // 羊圈
    if (matchURL("www.mielink.cc")) {
        $('body').bind('DOMNodeInserted', function (e) {
            if ($(e.target).find('span:contains(流量红包)').length > 0) {
                $('span:contains(流量红包)')[0].click()
            }
        });
    }

    // ZodGame
    if (matchURL("zodgame.xyz")) {
        qd('', 'fd_s');
    }

    // 神曲音乐论坛
    if (matchURL("o2v3.imotor.com")) {
        if ($('#umenu > a[href^="logging.php?action=login"]').length > 0) {
            console.log('未登录');
            return;
        }
        // 获取上次签到日期
        var pdawikiLastSignDate = getData('imotor');
        if (!pdawikiLastSignDate || compareDate(new Date().format("yyyy-MM-dd"), pdawikiLastSignDate)) {
            if (matchURL('dps_sign:sign')) {
                if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                    $('input[value="kx"]').attr('checked', true);
                    $("#todaysay").val('每天签到水一发。。。');
                    $('input[type="submit"]')[0].click();
                }
                if (window.find("您今天已经签到过了")) {
                    setData('imotor', new Date().format("yyyy-MM-dd"));
                }
            } else if (window.find('每日签到')) {
                window.location.href = "plugin.php?id=dps_sign:sign";
            }
        }
    }

    // 飞客茶馆
    if (matchURL("flyert.com")) {
        if ($('a[data-title="签到"]').length > 0) {
            $.ajax({
                url: 'plugin.php?id=k_misign:sign&operation=qiandao&formhash=' + $("input[name='formhash']").val() + '&from=insign&is_ajax=1',
                dataType: 'html',
                success: function (result) {
                    if (result.indexOf('签到成功') != -1) {
                        console.log("签到成功!");
                        location.reload();
                    }
                }
            })
        }
    }

    // 910汽车改装网
    if (matchURL("910car.com")) {
        if (matchURL('k_misign:sign')) {
            if ($('#JD_sign').length > 0) {
                $.ajax({
                    url: 'plugin.php?id=k_misign:sign&operation=qiandao&formhash=' + $("input[name='formhash']").val() + '&from=insign&inajax=1&ajaxtarget=JD_sign',
                    dataType: 'html',
                    success: function (result) {
                        console.log("签到成功!");
                        // location.reload();
                    }
                })
            }
        }
    }

    // 理想论坛
    if (matchURL("55188.com/plugin.php?id=sign")) {
        if ($('#addsign').length > 0) {
            $.ajax({
                url: 'plugin.php?id=sign&mod=add&jump=1',
                dataType: 'html',
                success: function (result) {
                    if (result.indexOf('success') != -1) {
                        console.log("签到成功!");
                        $('#addsign').attr("class", "btn btnvisted");
                    }
                }
            })
        }
    }

    // 鱼C论坛
    if (matchURL("fishc.com.cn")) {
        // 获取上次签到日期
        var fishcLastSignDate = getData('fishc');
        if (!fishcLastSignDate || compareDate(new Date().format("yyyy-MM-dd"), fishcLastSignDate)) {
            if ($('#ls_username').length == 0) {
                // 跳转到签到页面
                window.location.href = "plugin.php?id=k_misign:sign";
            }
        }

        // 签到
        if (matchURL('k_misign:sign')) {
            if ($('#JD_sign').length > 0) {
                $('#JD_sign')[0].click();
                console.log('签到成功!');
                setData('fishc', new Date().format("yyyy-MM-dd"));
            } else if ($('.btnvisted').length > 0) {
                console.log('已签到!');
                setData('fishc', new Date().format("yyyy-MM-dd"));
            }
        }
    }

    // 掌上百科
    if (matchURL("www.pdawiki.com")) {
        if ($('form[action^="member.php?mod=logging&action=login"]').length > 0) {
            console.log('未登录');
            return;
        }
        // 获取上次签到日期
        var pdawikiLastSignDate = getData('imotor');
        if (!pdawikiLastSignDate || compareDate(new Date().format("yyyy-MM-dd"), pdawikiLastSignDate)) {
            if (matchURL('dsu_paulsign:sign')) {
                if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                    $('input[value="kx"]').attr('checked', true);
                    $("#todaysay").val('每天签到水一发。。。');
                    $('#qiandao').submit();
                }
                if (window.find("您今天已经签到过了")) {
                    setData('imotor', new Date().format("yyyy-MM-dd"));
                }
            } else if (window.find('每日签到')) {
                window.location.href = "plugin.php?id=dsu_paulsign:sign";
            }
        }
    }

    function qd(checkElement, emoji) {
        if (matchURL('dsu_paulsign:sign')) {
            if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                $("#" + emoji).attr('checked', true);
                $("#todaysay").val("每天签到水一发。。。");
                $("#qiandao").submit();
            }
        } else if (window.find(checkElement)) {
            window.location.href = "plugin.php?id=dsu_paulsign:sign";
        }
    }

    // 比较日期大小
    function compareDate(date1, date2) {
        var d1 = new Date(date1);
        var d2 = new Date(date2);
        if (d1.getTime() > d2.getTime()) {
            return true;
        } else {
            return false;
        }
    }

    // 获取分割后的最后的文本
    function getLastText(text, separtor) {
        var arr = text.split(separtor);
        return arr[arr.length - 1];
    }

    function getStorageData() {
        var data = GM_getValue('BBSSignHelperData');
        if (!data) {
            data = {};
        }
        return data;
    }

    function getData(key) {
        var data = getStorageData();
        return data[key];
    }

    function setData(key, value) {
        var data = getStorageData();
        data[key] = value;
        return GM_setValue('BBSSignHelperData', data);
    }

    function deleteStorageData() {
        GM.deleteValue("BBSSignHelperData");
    }

    function matchURL(x) {
        return window.location.href.indexOf(x) != -1;
    }
})();