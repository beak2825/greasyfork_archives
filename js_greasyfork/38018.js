// ==UserScript==
// @name         自用论坛辅助签到
// @namespace    bbshelper
// @version      2.0.2
// @description  常用论坛辅助签到工具，包括远景论坛、天使动漫论坛、52破解、TTG、卡饭等
// @author       Eva
// @include      http*://u2.dmhy.org/*
// @include      http*://*.pcbeta.com/*
// @include      http*://www.tsdm*.*/*
// @include      http*://totheglory.im/*
// @include      http*://www.52pojie.cn/*
// @include      http*://www.smzdm.com/*
// @include      http*://bbs.kafan.cn/*
// @include      http*://www.natfrp.com/*
// @include      http*://www.cordcloud.*/*
// @include      http*://www.mielink.com/*
// @include      http*://zodgame.xyz/*
// @include      http*://o2v3.imotor.com/*
// @include      http*://www.flyert.com/*
// @include      http*://www.55188.com/*
// @include      http*://fishc.com.cn/*
// @include      http*://www.pdawiki.com/*
// @include      http*://bbs.acgrip.com/*
// @include      http*://ikuuu.co/*
// @include      http*://hifini.com/*
// @include      http*://www.anywlan.com/*
// @include      http*://www.mydigit.cn/*
// @include      http*://bbs.tampermonkey.net.cn/*
// @include      http*://legado.cn/*
// @include      http*://www.znds.com/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @run-at 		 document-end
// @downloadURL https://update.greasyfork.org/scripts/38018/%E8%87%AA%E7%94%A8%E8%AE%BA%E5%9D%9B%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/38018/%E8%87%AA%E7%94%A8%E8%AE%BA%E5%9D%9B%E8%BE%85%E5%8A%A9%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    // 日期格式化
    Date.prototype.format = function (fmt) {
        const o = {
            "M+": this.getMonth() + 1,                 //月份
            "d+": this.getDate(),                    //日
            "h+": this.getHours(),                   //小时
            "m+": this.getMinutes(),                 //分
            "s+": this.getSeconds(),                 //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds()             //毫秒
        }
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substring(4 - RegExp.$1.length))
        }
        for (const k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substring(("" + o[k]).length)))
            }
        }
        return fmt
    }

    // 判断上次签到日期
    const checkSignDate = function (name) {
        return new Promise(function (resolve, reject) {
            const lastSignDate = getData(name)
            if (!lastSignDate || compareDate(new Date().format("yyyy-MM-dd"), lastSignDate)) {
                resolve(lastSignDate)
            }
        })
    }

    // U2
    if (matchURL("u2.dmhy.org")) {
        if (matchURL("showup.php")) {
            const message = $("textarea[name='message']")
            if (message) message.text("注意：回答按钮点击时即提交，手滑损失自负~")
        } else if (window.find("立即签到")) {
            window.location.href = "showup.php"
        }
    }

    // 远景
    if (matchURL("bbs.pcbeta.com") || matchURL("i.pcbeta.com")) {
        // 判断是否登录
        if ($('#myrepeats').length > 0) {
            const variableName = 'pcbeta'
            checkSignDate(variableName).then(() => {
                console.log('开始自动签到！')
                $.ajax({
                    type: "GET",
                    url: "/home.php?mod=task&do=apply&id=149",
                    success: function (data) {
                        if (data.indexOf('恭喜您，任务已成功完成，您将收到奖励通知，请注意查收') != -1) {
                            console.log('签到完成!')
                            setSignData(variableName)
                        }
                        if (data.indexOf('抱歉，本期您已申请过此任务，请下期再来') != -1) {
                            console.log('重复签到!')
                            setSignData(variableName)
                        }
                    }
                })
            })
        }
    }

    // TTG
    if (matchURL("totheglory.im")) {
        if ($("#sp_signed")) setTimeout(() => $("#sp_signed a")[0].click(), 100)
    }

    // 天使动漫
    if (matchURL("tsdm")) {
        qd('签到领奖!', 'wl_s')
    }

    // 52破解
    if (matchURL("52pojie.cn")) {
        const qdimg = $("img[src$='qds.png']")
        if (qdimg) {
            $('a[href^="home.php?mod=task&do=apply&id=2"]')[0].click()
        }
    }

    // 什么值得买
    if (matchURL("smzdm.com")) {
        const signBtn = $('.J_punch')
        if ($('.J_punch').length > 0 && signBtn.text() == '签到领奖') {
            $('.J_punch')[0].click()
        }
    }

    // 卡饭
    if (matchURL("kafan.cn")) {
        const dklink = $("img[src$='dk.png']").closest("a")
        if ($("img[src$='wb.png']").closest("a").css('display') === 'none') {
            dklink[0].click()
        }
    }

    // Sakura Frp
    if (matchURL("www.natfrp.com")) {
        const variableName = 'sakura_frp'

        // 判断是否登录
        if ($('#token').length > 0) {
            checkSignDate(variableName).then(() => {
                // 跳转到签到页面
                window.location.href = "/user/sign"
            })
        }

        // 签到
        if ($('#sign').length > 0) {
            setTimeout(function () {
                $('#switch_captcha')[0].click()
            }, 1000)
            setTimeout(function () {
                console.log('开始签到')
                $('#sign').click()
                setSignData(variableName)
            }, 5000)
        } else {
            if (window.find("您今天已经签到过了")) {
                console.log('已签到')
                setSignData(variableName)
            }
        }
    }

    // CordCloud
    if (matchURL("cordcloud")) {
        const qdBtn = $("#checkin")
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
    if (matchURL("www.mielink.com")) {
        $('body').bind('DOMNodeInserted', function (e) {
            if ($(e.target).find('span:contains(流量红包)').length > 0) {
                $('span:contains(流量红包)')[0].click()
            }
        })
    }

    // ZodGame
    if (matchURL("zodgame.xyz")) {
        qd('', 'fd_s')
    }

    // 神曲音乐论坛
    if (matchURL("o2v3.imotor.com")) {
        if ($('#umenu > a[href^="logging.php?action=login"]').length > 0) {
            console.log('未登录')
            return
        }

        const variableName = 'imotor'
        checkSignDate(variableName).then(() => {
            if (matchURL('dps_sign:sign')) {
                if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                    $('input[value="kx"]').attr('checked', true)
                    $("#todaysay").val('每天签到水一发。。。')
                    $('input[type="submit"]')[0].click()
                }
                if (window.find("您今天已经签到过了")) {
                    setSignData(variableName)
                }
            } else if (window.find('每日签到')) {
                window.location.href = "plugin.php?id=dps_sign:sign"
            }
        })
    }

    // 飞客茶馆
    if (matchURL("flyert.com")) {
        if ($('a[data-title="签到"]').length > 0) {
            $.ajax({
                url: 'plugin.php?id=k_misign:sign&operation=qiandao&formhash=' + $("input[name='formhash']").val() + '&from=insign&is_ajax=1',
                dataType: 'html',
                success: function (data) {
                    if (data.indexOf('签到成功') != -1) {
                        console.log("签到成功!");
                        location.reload();
                    }
                }
            })
        }
    }

    // 理想论坛
    if (matchURL("55188.com/plugin.php?id=sign")) {
        if ($('#addsign').length > 0) {
            $.ajax({
                url: 'plugin.php?id=sign&mod=add&jump=1',
                dataType: 'html',
                success: function (data) {
                    if (data.indexOf('success') != -1) {
                        console.log("签到成功!");
                        $('#addsign').attr("class", "btn btnvisted");
                    }
                }
            })
        }
    }

    // 鱼C论坛
    if (matchURL("fishc.com.cn")) {
        const variableName = 'fishc'
        checkSignDate(variableName).then(() => {
            if ($('#ls_username').length == 0) {
                // 跳转到签到页面
                window.location.href = "plugin.php?id=k_misign:sign"
            }
        })

        // 签到
        if (matchURL('k_misign:sign')) {
            if ($('#JD_sign').length > 0) {
                $('#JD_sign')[0].click()
                console.log('签到成功!')
                setSignData(variableName)
            } else if ($('.btnvisted').length > 0) {
                console.log('已签到!')
                setSignData(variableName)
            }
        }
    }

    // 掌上百科
    if (matchURL("www.pdawiki.com")) {
        if ($('form[action^="member.php?mod=logging&action=login"]').length > 0) {
            console.log('未登录')
            return
        }

        const variableName = 'pdawiki'
        checkSignDate(variableName).then(() => {
            if (matchURL('dsu_paulsign:sign')) {
                if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                    $('input[value="kx"]').attr('checked', true)
                    $("#todaysay").val('每天签到水一发。。。')
                    $('#qiandao').submit()
                }
                if (window.find("您今天已经签到过了")) {
                    setSignData(variableName)
                }
            } else if (window.find('每日签到')) {
                window.location.href = "plugin.php?id=dsu_paulsign:sign"
            }
        })
    }

    // VCB-S
    if (matchURL("bbs.acgrip.com")) {
        if ($('a.login').length > 0) {
            console.log('未登录')
            return
        }
        const variableName = 'vcb-s'
        checkSignDate(variableName).then(() => {
            if (matchURL('dsu_paulsign-sign')) {
                if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                    $('input[value="kx"]').attr('checked', true)
                    $("#todaysay").val('每天签到水一发。。。')
                    $('#qiandao').submit()
                }
                if (window.find("您今天已经签到过了")) {
                    setSignData(variableName)
                }
            } else if (window.find('每日签到')) {
                window.location.href = "dsu_paulsign-sign.html"
            }
        })
    }

    // iKuuu
    if (matchURL("ikuuu.co/user")) {
        const variableName = 'ikuuu'
        checkSignDate(variableName).then(() => {
            if (window.find("每日签到")) {
                $('#checkin-div a')[0].click()
            }
            if (window.find("明日再来")) {
                setSignData(variableName)
            }
        })
    }

    // HiFiNi
    if (matchURL("hifini.com")) {
        const variableName = 'hifini'
        checkSignDate(variableName).then(() => {
            if (window.find("签到")) {
                $('#sign')[0].click()
                setSignData(variableName)
            }
            if (window.find("已签")) {
                setSignData(variableName)
            }
        })
    }

    // Anywlan
    if (matchURL("www.anywlan.com")) {
        if ($('a[href^="member.php?mod=logging&action=login"]').length > 0) {
            console.log('未登录')
            return
        }

        const variableName = 'anywlan'

        // 签到页面
        if (matchURL('dc_signin:sign')) {
            if ($('#signform').length > 0) {
                $('#signform [name="emotid"]').val('1')
                $('#signform [name="content"]').val('记上一笔，hold住我的快乐！')
                $("#signform").submit()
                setSignData(variableName)
            }
        }

        checkSignDate(variableName).then(() => {
            if (window.find("您今日已经签过到")) {
                setSignData(variableName)
                window.location.href = "javascript:history.back()"
            } else {
                window.location.href = "plugin.php?id=dc_signin:sign"
            }
        })
    }

    // 数码之家
    if (matchURL("www.mydigit.cn")) {
        if ($('#ls_username').length > 0) {
            console.log('未登录')
            return
        }

        // 签到页面
        if (matchURL('k_misign-sign.html')) {
            if ($('#JD_sign').length > 0) {
                $('#JD_sign')[0].click()
            }
        }

        const variableName = 'mydigit'
        checkSignDate(variableName).then(() => {
            if (window.find("您的签到排名")) {
                setSignData(variableName)
            } else {
                window.location.href = "k_misign-sign.html"
            }
        })
    }

    // 油猴中文网
    if (matchURL("bbs.tampermonkey.net.cn")) {
        if ($('.comiis_dlq').length > 0) {
            console.log('未登录')
            return
        }

        const variableName = 'tampermonkey_cn'
        checkSignDate(variableName).then(() => {
            if (matchURL('dsu_paulsign-sign.html')) {
                if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                    $("#fd_s").attr('checked', true)
                    $("#todaysay").val("每天签到水一发。。。")
                    $("#qiandao").submit()
                }
                if (window.find("您今天已经签到过了")) {
                    setSignData(variableName)
                }
            } else if (window.find('每日签到')) {
                window.location.href = "dsu_paulsign-sign.html"
            }
        })
    }

    // 阅读论坛
    if (matchURL("legado.cn")) {
        if ($('#return_ls').length > 0) {
            console.log('未登录')
            return
        }

        // 签到页面
        if (matchURL('k_misign-sign.html')) {
            if ($('#JD_sign').length > 0) {
                $('#JD_sign')[0].click()
            }
        }

        const variableName = 'legado'
        checkSignDate(variableName).then(() => {
            if (window.find("您的签到排名")) {
                setSignData(variableName)
            } else {
                window.location.href = "k_misign-sign.html"
            }
        })
    }

    // 智能电视网
    if (matchURL("www.znds.com")) {
        const signBtn = $('a[onclick^="showWindow(\\"ljdaka"]')
        if (signBtn.length > 0) {
            signBtn[0].click()
        }
    }

    function qd(checkElement, emoji) {
        if (matchURL('dsu_paulsign:sign')) {
            if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                $("#" + emoji).attr('checked', true)
                $("#todaysay").val("每天签到水一发。。。")
                $("#qiandao").submit()
            }
        } else if (window.find(checkElement)) {
            window.location.href = "plugin.php?id=dsu_paulsign:sign"
        }
    }

    // 比较日期大小
    function compareDate(date1, date2) {
        const d1 = new Date(date1)
        const d2 = new Date(date2)
        return d1.getTime() > d2.getTime()
    }

    function getStorageData() {
        return GM_getValue('BBSSignHelperData') ?? {}
    }

    function getData(key) {
        return getStorageData()[key]
    }

    function setData(key, value) {
        const data = getStorageData()
        data[key] = value
        GM_setValue('BBSSignHelperData', data)
    }

    function setSignData(variableName) {
        setData(variableName, new Date().format("yyyy-MM-dd"))
    }

    function deleteStorageData() {
        GM.deleteValue("BBSSignHelperData")
    }

    function matchURL(x) {
        return window.location.href.indexOf(x) != -1
    }
})()