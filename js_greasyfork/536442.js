// ==UserScript==
// @name         大人网站签到工具
// @version      1.0.1
// @description  用于各种论坛和网站自动签到 网站自动点击签到 根据论坛签到工具 二次开发 需要添加其他网站请私聊我留下网站地址
// @author       Fxy29
// @homepage     https://greasyfork.org/zh-CN/scripts/536442-%E5%A4%A7%E4%BA%BA%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7
// @icon         https://www.dismall.com/favicon.ico
// @match        https://googlewk.com/*
// @match        https://jiuyh.com/*
// @match        https://*.weme.lat/*
// @match        *://lzone.moe/
// @match        https://hggard.com/
// @match        https://*.wnflb2023.com/*
// @match        *://*.2cycd.com/*
// @match        *://*.2cycdx.com/*
// @match        https://51acg.buzz/*
// @match        https://nb.mcy002.org/*
// @match        https://*.xms2.cc/*
// @match        https://moxing.lol/*
// @match        https://moxing.chat/*
// @match        https://mox.moxing.lol/*
// @match        https://*.mhh1.com/
// @match        https://xhcyw.com/
// @match        https://xhcyra.com/
// @match        https://*.vikacg.com/*
// @match        https://2dfan.com/*
// @match        https://xsijishe.com/*
// @match        https://xsijishe.net/*
// @match        https://*.feixing66.com/*
// @match        https://hjd2048.com/*
// @match        https://ruyanhk.net/*
// @match        https://www.52gts.com/*
// @match        https://fxacg.cc/*
// @match        https://www.haijiao.com/*
// @match        https://kmacg20.com/*
// @match        https://*.deepxt.top/*
// @match        https://www.aicgo.net/*
// @match        https://www.aicg.app/*
// @match        https://*.north-plus.net/*
// @match        https://*.soul-plus.net/*
// @match        https://*.south-plus.net/*
// @match        https://*.white-plus.net/*
// @match        https://*.level-plus.net/*
// @match        https://*.summer-plus.net/*
// @match        https://*.spring-plus.net/*
// @match        https://*.snow-plus.net/*
// @match        https://*.east-plus.net/*
// @match        https://*.blue-plus.net/*
// @include      https://sxsy*.com/*
// @exclude      https://leaves.red/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.4/jquery.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @copyright 	 2025 Fxy29
// @license      Apache-2.0
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/536442/%E5%A4%A7%E4%BA%BA%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/536442/%E5%A4%A7%E4%BA%BA%E7%BD%91%E7%AB%99%E7%AD%BE%E5%88%B0%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {

    var APPNAME=GM_info.script.name+"-"+GM_info.script.version;
    var NOLOGIN="-----------------------------\n["+APPNAME+"]\n状态异常或未登录，登录后自动签到\n-----------------------------";
    var QIANDAO="-----------------------------\n["+APPNAME+"]\n签到完成！\n-----------------------------";
    var QIANDAOTEXT="-----------------------------\n["+APPNAME+"]\n领取完成！\n-----------------------------";

    /* globals jQuery, $, waitForKeyElements */

    //WK综合论坛 鱼C论坛 91ACG次元小屋 茹伊映画 巨大爱好者
    if (isURL("googlewk") || isURL("fishc.com.cn") || isURL("51acg.buzz") || isURL("ruyanhk") || isURL("52gts")) {
        window.setTimeout(function(){
            if (isURL('k_misign-sign.html') || isURL('plugin.php?id=k_misign:sign') || isURL('k_misign:sign') || isURL('sign.php')) {
                if (window.find("您今天还没有签到")||window.find("您今天還沒有簽到")) {
                    $("#JD_sign").click();
                    return;
                }
            }
        },2000);
        return;
    }

    //樱花萌ACG
    else if (isURL("jiuyh")) {
        if (isURL('yinxingfei_zzza:yinxingfei_zzza_hall') || isURL("yinxingfei_zzza-yinxingfei_zzza_hall.html")) {
            window.setTimeout(function(){document.getElementById("zzza_go").click();},2000);
        }
        return;
    }

    //微密圈/觅圈/铁粉空间资源站 飞星资源网
    else if (isURL("weme") || isURL("feixing66")) {
        if (isURL('user')) {
            window.setTimeout(function(){
                if (window.find("今日签到")) {
                    $(".usercheck.checkin")[0].click();
                    return;
                }
            },2000);
        }
        return;
    }

    //绅士之庭
    else if (isURL("hggard.com") || isURL("lzone.moe")) {
        if ($('#checkw').length > 0) {
            const textContent = $('#checkw').text().trim();
            if (textContent.includes('点此签到')) {
                $('#checkin').trigger('click');
            }
        }
        return;
    }

    //魔性论坛2.0
    else if (isURL("mox.moxing.chat/forum/sign") || isURL("mox.moxing.lol/forum/sign")) {
        window.setTimeout(function(){
            if (window.find("今日已签到")){
                return;
            }else{
                const targetBtn = document.querySelector('button.el-button--primary.is-round');
                if(targetBtn && !targetBtn.disabled) {
                    targetBtn.focus();
                    targetBtn.offsetHeight; // 强制DOM更新
                    targetBtn.click();
                } else {
                    console.log('魔性论坛2.0签到未成功，可能是:\n1.已签到完成；\n2.网站代码更新了,给我提交反馈。');
                }
            }
        },3000);
        return;
    }

    //福利吧论坛 魔性论坛 司机社
    else if (isURL("wnflb2023") || isURL("moxing.lol") || isURL("moxing.chat") || isURL("xsijishe")) {
        window.setTimeout(function(){
            if(!window.find("自动登录")){
                var imgs6 = document.getElementById("fx_checkin_b");
                if (imgs6.alt.indexOf("签到领奖") == 0 || imgs6.alt.indexOf("点击签到") == 0) {
                    $("#fx_checkin_b").click();
                    setTimeout(() => {
                        location.reload();
                    }, 1000 + Math.random() * 2000);
                }
            }
        },5000);
        return;
    }

    //萌次元  幻天领域
    else if (isURL("mcy") || isURL("acgns")) {
        window.setTimeout(function(){
            if(window.find("签到")){
                $(".inn-nav__point-sign-daily__btn")[0].click();
            }
        },5000);
        return;
    }

    //2048论坛
    else if (isURL("hjd2048.com/2048/hack.php?H_name=qiandao")) {
        window.setTimeout(function(){
            if (window.find("今天已签到")) {
                return;
            }else{
                document.querySelector('input[name="qdxq"][value="yl"]').checked = true;
                $("#submit_bbb").click();
            }
        },2000);
        return;
    }

    //moxing new
    else if (isURL("mox.moxing")) {
        window.setTimeout(function(){
            if(window.find("签到抽奖")){
                $(".el-button.el-button--primary.is-round")[0].click();
            }
        },10000);
        return;
    }

    //新妙社
    else if (isURL("xms2.cc")) {
        if (isURL('dsu_paulsign-sign.html')) {
            window.setTimeout(function(){
                if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
                    $("#kx").click();
                    $(".btn")[0].click();
                }
            },1000);
        }
        return;
    }

    //LittleSkin
    else if (isURL("littleskin")) {
        window.setTimeout(function(){
            if(window.find("签到")){
                $(".bg-gradient-primary")[0].click();
            }
        },2000);
        return;
    }

    //二次元虫洞
    else if (isURL("2cycd") || isURL("2cycdx.com")) {
        if ($('#dcsignin_tips').attr("style").indexOf("signin_no")!=-1){
            $("#dcsignin_tips").click();
            window.setTimeout(function(){
                $(".dcsignin_list li")[14].click();
                $('#emotid').val('10');
                $('.pnc')[0].click();
            },2000);
        }
        return;
    }

    //萌幻之乡
    else if (isURL("mhh1")) {
        window.setTimeout(function(){
            if(window.find("签到")){
                $(".inn-nav__point-sign-daily__btn")[0].click();
            }
        },10000);
        return;
    }

    //芯幻
    else if (isURL("xhcy")) {
        window.setTimeout(function(){
            var aTag = document.querySelector('#inn-nav__point-sign-daily a');
            if (aTag && aTag.title !== '已签到') {
                aTag.click();
            }
        },3000);
        return;
    }

    //维咔VikACG
    else if (isURL("vikacg.com/wallet/mission")) {
        window.setTimeout(function(){
            if (window.find("已经签到")) {
                return;
            }else{
                document.evaluate('//button[contains(normalize-space(),"立即签到")]', document).iterateNext()?.click();
            }
        },8000);
        return;
    }

    //2DFan
    else if (isURL("2dfan.com/users")) {
        window.setTimeout(function(){
            const button = document.getElementById('do_checkin');
            if (button && button.textContent.includes('今日签到')) {
                button.click();
            }
        },15000);
        return;
    }

    //飞雪论坛
    else if (isURL("fxacg")) {
        window.setTimeout(function(){
            if (!!document.querySelector('#dcsignin_tips')?.style.backgroundImage?.match(/signin_yes\.png/)) {
                return;
            }else{
                document.querySelector('a[href="plugin.php?id=dc_signin"][onclick*="dc_signin:sign"]').click();
                setTimeout(() => document.querySelector('img[alt="郁闷"]').closest('li').click(), 1000);
                setTimeout(() => document.querySelector('button[name="signpn"]').click(), 1000);
            }
        },2000);
        return;
    }

    //海角社区
    else if (isURL("haijiao.com/task/index")) {
        window.setTimeout(function(){
            if (window.find("已签到")) {
                return;
            }else{
                document.querySelector('[data-v-c0348162] > .button_ok').click();
                setTimeout(() => {
                    location.reload();
                }, 1000 + Math.random() * 2000);
            }
        },4000);
        return;
    }

    //尚香书苑
    else if (isURL("sxsy")) {
        window.setTimeout(function(){
            if (document.getElementById("fx_checkin_b").src.includes('mini.gif')){
                document.getElementById("fx_checkin_b").click();
                return;
            }
        },2000);
        return;
    }

    //深度学堂
    else if (isURL("deepxt")) {
        window.setTimeout(function(){
            const qiandao_actions = document.querySelectorAll('.my-user-qiandao-action.text-center.bg-danger');
            qiandao_actions.forEach(element => {
                if (element.textContent.includes('签到领金币')) {
                    element.click();
                }
            });
        },2000);
        return;
    }

    //AiCGO社区
    else if (isURL("aicg")) {
        window.setTimeout(function(){
            const checkinButton = document.getElementById('checkin_button2');
            if (checkinButton && !checkinButton.textContent.includes('已签到')) {
                checkinButton.click();
            }
        },2000);
        return;
    }

    //South Plus
    else if (isURL("plus.net/plugin.php?H_name-tasks.html")) {
        window.setTimeout(function(){
            const KEY = 'plus-lastExecTime';
            const H24 = 86400000;

            const lastExec = GM_getValue(KEY, 0);
            const now = Date.now();

            if (now - lastExec >= H24) {
                let count = 0;
                const timer = setInterval(() => {
                    GM_setValue(KEY, now);
                    ['14', '15'].forEach(cid => {
                        fetch(`plugin.php?H_name=tasks&action=ajax&actions=job2&cid=${cid}`)
                            .catch(e => console.error('访问失败:', e));
                    });
                    if (++count >= 2) clearInterval(timer);
                }, 1000);
            } else {
                const remain = Math.ceil((H24 - (now - lastExec)) / 3600000);
                alert("-----------------------------\n["+APPNAME+"]\n请等待 "+remain+" 小时后再打开任务页面")
            }
        },2000);
        return;
    }

    else {
        //其他论坛
        //qd();
        qd2();
        qd3();
    }
})();

//传递的url和当前url是否包含
function isURL(x) {
    return window.location.href.indexOf(x) != -1;
}

//取消前后空格
function trim(s){
    return s.replace(/(^\s*)|(\s*$)/g, "");
}

//跳转到传递的地址
function toURL(x) {
    window.location.href=x;
}

function qd() {
    if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
        var kxImg = document.getElementById("kx_s");
        var todaySayTextArea = document.getElementById("todaysay");
        if (kxImg == null) {
            return;
        }
        kxImg.setAttribute('checked', true);
        todaySayTextArea.value = "今天天气真好~签到。";
        var button = document.getElementById("qiandao");
        button.submit();
        return;
    }
}

function qd2() {
    document.getElementById("kx").click();
    var todaySayTextArea = document.getElementById("todaysay");
    if (todaySayTextArea != null) {
        todaySayTextArea.value = "今天天气真好~签到。";
    }
    unsafeWindow.showWindow('qwindow', 'qiandao', 'post', '0');
    return;
}

function qd3() {
    var elements = p.elements,i = 0;
    setTimeout(function () {
        try {
            var els;
            if (elements instanceof Array){ els = p.elements;}
            else {
                els = p.elements();
            }
            while (els[i]) {
                var obj = (p.elements instanceof Array) ? document.querySelector(els[i]) : els[i];
                if (obj == null) return;
                if (obj.tagName == "A" && obj.href.indexOf("javascript") < 0 && obj.onclick == "undefined") GM_openInTab(obj.href);
                else obj.click();
                i++;
            }
        } catch (e) {
            alert(e);
        }
    }, 400);
    setTimeout(function () {
        if (autoClose) window.close();
    }, delay + 100);
    return;
}

function qd4(checkElement, emojiImg) {
    if (isURL('dsu_paulsign:sign') || isURL('dsu_paulsign-sign.html') || isURL('hack.php?H_name=qiandao')) {
        if ((window.find("今天签到了吗") && window.find("写下今天最想说的话")) || window.find("今天未签到")) {
            $("#" + emojiImg).attr('checked', true);
            $("#todaysay").val("每天签到水一发。。。");
            $("#qiandao").submit();
        }
    } else if (window.find(checkElement)) {
        toURL("plugin.php?id=dsu_paulsign:sign");
    }
}

function qd5(checkElement, emojiImg) {
    if (isURL('dsu_paulsign-sign.html')) {
        if (window.find("今天签到了吗") && window.find("写下今天最想说的话")) {
            $("#" + emojiImg).click();
            $("#todaysay").val("每天签到水一发。。。");
            $("#qiandao").submit();
        }
    } else if (window.find(checkElement)) {
        toURL("dsu_paulsign-sign.html");
    }
}

function toURL_once(url,name='time'){
    const t = new Date();
    const time = [t.getFullYear(),t.getMonth()+1,t.getDate()].join("/");
    const itemName = "qd_"+name;
    if(localStorage.getItem(itemName) != time){
        localStorage.setItem(itemName,time);
        toURL(url);
    }
}