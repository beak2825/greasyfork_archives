// ==UserScript==
// @name         zxxtjt
// @namespace    zxxtjt
// @version      0.38
// @description  Coinlist
// @author       zxxtjt
// @match        https://*.coinlist.co/*
// @match        *:///C:/Users/XTJT/Desktop/CL/*
// @match        https://*.zxxtjt.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @run-at       document-end
/* globals jQuery, $, waitForKeyElements */
// @connect      zxxtjt.com
// @connect      coinlist.co
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/432419/zxxtjt.user.js
// @updateURL https://update.greasyfork.org/scripts/432419/zxxtjt.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //#region  Common Parameter

    let hosturl = "https://zxxtjt.com:1314/api/";

    //#endregion

    //#region Common Method

    //定时器--先自执行一次
    //callback：回调函数
    //time：间隔执行时间
    const commonInterval = (callback, time) => {
        const waittimer = setTimeout(() => {
            clearTimeout(waittimer);
            let counter = 0;
            callback(counter++);
            (function inner() {
                const timer = setTimeout(() => {
                    clearTimeout(timer);
                    callback(counter++);
                    inner();
                }, time);
            })();
        }, 3 * 1000);
    };

    //延迟执行
    //callback：回调函数
    //time：延迟执行时间
    const commonTimeout = (callback, time) => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            callback();
        }, time);
    };

    //#endregion

    //#region Common Execute

    commonInterval(CommonExecute, 60 * 1000);//一分钟调用一次

    function CommonExecute(counter) {
        //3分钟执行一次
        if (counter % 3 == 0) {
            commonTimeout(AutoPurchase, 3 * 1000);
            commonTimeout(QueueMonitor, 3 * 1000);
        }

        //5分钟执行一次
        if (counter % 5 == 0) {
            commonTimeout(PreLogIn, 3 * 1000);
            commonTimeout(LogIn, 3 * 1000);
            commonTimeout(ChormeAuthCode, 3 * 1000);
            commonTimeout(GetStarted, 3 * 1000);
            commonTimeout(ContinueWith, 3 * 1000);
            commonTimeout(ConfirmResidence, 3 * 1000);
            commonTimeout(CompleteQuiz, 3 * 1000);
            commonTimeout(ErrorCaptchaUnsolvable, 3 * 1000);
            commonTimeout(Captcha, 13 * 1000);
        }

        //10分钟执行一次
        if (counter % 10 == 0) {
            commonTimeout(ExcuteAddress, counter == 0 ? 3 * 1000 : (randomNumBoth(0, 5) * 60 * 1000 + 3 * 1000));//随机睡眠0到5分钟，防止并发量过大
        }

        //30分钟执行一次
        if (counter % 30 == 0) {
            commonTimeout(ApproveNewDevice, 3 * 1000);
        }

        //60分钟执行一次
        if (counter % 60 == 0) {
            commonTimeout(ReEnterWaitingRoom, 3 * 1000);
        }
    };

    //#endregion

    //#region 1：自动购买

    function AutoPurchase() {
        //判断金额输入框是否存在
        if (document.body.contains(document.getElementById("investment_committed_amount"))) {
            //异步发送
            commonTimeout(() => {
                //邮件发送
                let url = hosturl + "Coinlist/GetSendEmail?title=Coinlist自动购买开始&content=Coinlist进入自动购买流程";
                runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) { });
            }, 1000);

            let purchaseurl = hosturl + "Coinlist/GetPurchaseAmount";
            runAsync(purchaseurl, "GET", "").then((result) => { return result; }).then(function (result) {
                if (result != null && result != undefined && result != '') {
                    //金额赋值
                    let t = document.querySelector('#investment_committed_amount');
                    let evt = document.createEvent('HTMLEvents');
                    evt.initEvent('input', true, true);
                    t.value = result;
                    t.dispatchEvent(evt)

                    //币种选择
                    $("label[for='investment_currency_usdt']").click();

                    //选中所有协议
                    let arr = document.getElementsByTagName("input");
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].getAttribute('type') == 'checkbox') {
                            arr[i].checked = true;
                        }
                    }

                    commonTimeout(() => {
                        //点击购买按钮
                        clickPlus(".js-submit-investment-form");

                        commonTimeout(() => {
                            //点击确认购买按钮
                            clickPlus(".js-confirm_purchase");
                        }, 1000);
                    }, 1000);

                    //异步发送
                    commonTimeout(() => {
                        //邮件发送
                        let url = hosturl + "Coinlist/GetSendEmail?title=Coinlist自动购买完成&content=Coinlist自动购买完成";
                        runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) { });
                    }, 3 * 1000);
                }
            });
        }
    };

    //#endregion

    //#region 2：登录部分

    //登录页面
    function PreLogIn() {
        //判断Log in是否存在
        let clink = $('a.c-link');
        for (let i = 0; i < clink.length; i++) {
            if (clink[i].text == 'Log in' && !(document.body.contains(document.getElementById("user_email")) && document.body.contains(document.getElementById("user_password")))) {//排除登录页面，防止密码错误页面出现
                let isapprovepage = false;
                //判断Approve new device是否存在
                let newdevice = $('h1');
                for (let j = 0; j < newdevice.length; j++) {
                    if (newdevice[j].innerText == 'Approve new device') {
                        isapprovepage = true;
                    }
                }
                if (!isapprovepage)//排除授权设备页面
                {
                    clink[i].click();
                }
            }
        }
    };

    //登录界面
    function LogIn() {
        //判断邮箱输入框是否存在
        if (document.body.contains(document.getElementById("user_email")) && document.body.contains(document.getElementById("user_password"))) {
            let url = hosturl + "Coinlist/GetBaseInfo";
            runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) {
                if (result != null && result != undefined && result != '') {
                    let obj = JSON.parse(result);
                    if (obj != null && obj.email != null && obj.email != undefined && obj.email != '') {
                        $("#user_email").val(obj.email);
                    }
                    if (obj != null && obj.pwd != null && obj.pwd != undefined && obj.pwd != '') {
                        $("#user_password").val(obj.pwd);
                    }
                }

                if ($("#user_email").val() && $("#user_password").val()) {
                    let login = document.getElementsByName('commit');
                    for (let i = 0; i < login.length; i++) {
                        if (login[i].value == 'Log in') {
                            login[i].click();
                        }
                    }
                }
            });
        }
    };

    //谷歌身份界面
    function ChormeAuthCode() {
        //判断谷歌身份框金额输入框是否存在
        if (document.body.contains(document.getElementById("multi_factor_authentication_totp_otp_attempt"))) {
            let url = hosturl + "Coinlist/GetChormeAuthCode";
            runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) {
                if (result != null && result != undefined && result != '') {
                    //谷歌身份框赋值
                    $('input#multi_factor_authentication_totp_otp_attempt').val(result);
                    let chromelogin = document.getElementsByName('commit');
                    for (let i = 0; i < chromelogin.length; i++) {
                        if (chromelogin[i].value == 'Log in') {
                            chromelogin[i].click();
                        }
                    }
                }
            });
        }
    };

    //#endregion

    //#region 3：答题部分

    //Get started
    function GetStarted() {
        //判断Get started是否存在
        let getstarted = $('a.js-get_started_cta');
        for (let i = 0; i < getstarted.length; i++) {
            if (getstarted[i].text == 'Get started') {
                getstarted[i].click();
            }
        }
    };

    //Continue with
    function ContinueWith() {
        //判断Continue with是否存在
        let continuewith = $('a.js-submit_existing_entity');
        for (let i = 0; i < continuewith.length; i++) {
            continuewith[i].click();
        }
    };

    //Confirm Residence
    function ConfirmResidence() {
        //判断居住地输入框是否存在
        if (document.body.contains(document.getElementById("forms_offerings_participants_residence_residence_country"))) {
            let url = hosturl + "Coinlist/GetResidence";
            runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) {
                if (result != null && result != undefined && result != '') {
                    //居住地赋值
                    let residence = document.getElementById("forms_offerings_participants_residence_residence_country");
                    for (let i = 0; i < residence.length; i++) {
                        if (residence[i].text == result) {
                            residence[i].selected = true;
                        }
                    }

                    //选中所有协议
                    let investment = document.getElementsByTagName("input");
                    for (let i = 0; i < investment.length; i++) {
                        if (investment[i].getAttribute('type') == 'checkbox') {
                            investment[i].checked = true;
                        }
                    }

                    //点击Continue
                    let continueresidence = $('a.js-submit');
                    for (let i = 0; i < continueresidence.length; i++) {
                        if (continueresidence[i].text == 'Continue') {
                            continueresidence[i].click();
                        }
                    }
                }
            });
        }
    };

    //答题页面
    function CompleteQuiz() {
        //判断是否答题页面
        let quiz = $('h4');
        for (let i = 0; i < quiz.length; i++) {
            if (quiz[i].innerText == 'Complete the qualification quiz') {
                //获取答题脚本
                let url = hosturl + "Coinlist/GetAnswerScript";
                runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) {
                    if (result != null && result != undefined && result != '') {
                        eval(result);
                    }
                });

                commonTimeout(() => {
                    let completequiz = true;
                    let quizlist = $('div.s-marginBottom1').children('div.c-input-group');
                    for (let j = 0; j < quizlist.length; j++) {
                        let radiolist = $(quizlist[j]).find('input[type=radio]');
                        let completeradio = false;
                        for (let k = 0; k < radiolist.length; k++) {
                            completeradio = completeradio || radiolist[k].checked;
                        }
                        completequiz = completequiz && completeradio;
                    }
                    if (completequiz) {
                        //点击Continue
                        let continuequiz = $('a.js-submit');
                        for (let m = 0; m < continuequiz.length; m++) {
                            if (continuequiz[m].text == 'Continue') {
                                continuequiz[m].click();
                            }
                        }
                    }
                }, 15 * 1000);
            }
        }
    };

    //#endregion

    //#region 4：统一重定向地址

    //重定向地址
    function ExcuteAddress() {
        if (window.location.href.toLowerCase().search('zxxtjt.com') > 0) {
            let url = hosturl + "Coinlist/GetExcuteAddress";
            runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) {
                if (result != null && result != undefined && result != '') {
                    // 1.在原来的窗体中直接跳转用
                    // 2、在新窗体中打开页面用
                    let redirectUrl = (result.toLowerCase().search('zxxtjt.com') > 0) ? ("window.location.href = '" + result + "';") : ("let newWindow = window.open(); newWindow.location.href = '" + result + "';");
                    eval(redirectUrl);
                }
            });
        }
    };

    //#endregion

    //#region 5：异常情况处理

    //谷歌图形码识别异常
    function ErrorCaptchaUnsolvable() {
        //判断error是否存在
        let solver = $('div.captcha-solver');
        for (let i = 0; i < solver.length; i++) {
            var state = solver[i].dataset.state;
            if (state && state == "error") {
                window.location.href = window.location.href;
            }
        }
    };

    //#endregion

    //#region 6：排队监控

    //队列监控
    function QueueMonitor() {
        //判断队列数是否存在
        if (document.body.contains(document.getElementById("MainPart_lbUsersInLineAheadOfYou"))) {
            let url = hosturl + "Coinlist/GetQueueNumber?number=" + document.getElementById("MainPart_lbUsersInLineAheadOfYou").innerText;
            runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) { });
        }
    };

    //#endregion

    //#region 7：Re-enter the waiting room

    //队列监控
    function ReEnterWaitingRoom() {
        //判断Re-enter the waiting room是否存在
        if (document.body.contains(document.getElementById("enqueue-error")) && document.getElementById("enqueue-error").style.display == "block") {
            var a = $(document.getElementById("enqueue-error")).find("strong").closest("a");
            for (let i = 0; i < a.length; i++) {
                a[i].click();
                window.opener = null;
                window.open('', '_self');
                window.close();
            }
        }
    };

    //#endregion

    //#region 88：谷歌图形码识别--只处理登录界面的，其他由扩展处理

    function Captcha() {
        //判断邮箱输入框是否存在
        if (document.body.contains(document.getElementById("user_email")) && document.body.contains(document.getElementById("user_password"))) {
            //图形识别
            let textarea = document.querySelector("textarea[name=h-captcha-response]");
            if (textarea) {
                //排除隐藏无需验证的图形码
                let ishavedispalycaptcha = false;
                let div = $("div");
                for (let i = 0; i < div.length; i++) {
                    if ($(div[i]).attr("style") && $(div[i]).attr("style").search('left: -10000px; top: -10000px') > 0) {
                        ishavedispalycaptcha = true;
                    }
                }
                if (!ishavedispalycaptcha) {
                    let container = textarea.parentNode;
                    let sitekey = $(container).attr("sitekey");
                    if (!sitekey) {
                        let recaptchaclients = findRecaptchaClients();
                        if (recaptchaclients) {
                            sitekey = recaptchaclients[0].sitekey;
                        }
                    }

                    if (sitekey) {
                        let url = hosturl + "Coinlist/GetCaptcha?siteKey=" + sitekey + "&url=" + encodeURI(window.location.href);
                        runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) {
                            if (result != null && result != undefined && result != '') {
                                $(container).find("textarea").val(result);
                                textarea.closest("form").submit();
                            }
                        });
                    }
                }
            }
        }
    };

    //#endregion

    //#region 99:授权设备

    function ApproveNewDevice() {
        //判断Approve new device是否存在
        let newdevice = $('h1');
        for (let i = 0; i < newdevice.length; i++) {
            if (newdevice[i].innerText == 'Approve new device') {
                //邮件发送
                let url = hosturl + "Coinlist/GetSendEmail?title=Coinlist Approve&content=Approve new device";
                runAsync(url, "GET", "").then((result) => { return result; }).then(function (result) { });
            }
        }
    };

    //#endregion




    // //调用
    // runAsync("http://localhost/cannot/toilet", "POST", "content=erwer").then((result) => { return result; }).then(function (result) {
    //     console.log("第57行" + result);
    // });

    //send数据函数
    //参数1：url;参数2：请求类型get或post;参数3：post的body;
    function runAsync(url, send_type, data_ry) {
        let p = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: send_type,
                url: url,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                data: data_ry,
                onload: function (response) {
                    resolve(response.responseText);
                },
                onerror: function (response) {
                    //console.log("请求失败");
                    reject("请求失败");
                }
            });
        })
        return p;
    }

    //睡眠 使用for循环
    function sleep(delay) {
        for (let t = Date.now(); Date.now() - t <= delay;);
    }

    //生成随机数 min ≤ num ≤ max
    function randomNumBoth(Min, Max) {
        let Range = Max - Min;
        let Rand = Math.random();
        let num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    }

    function clickPlus(el) {
        let btn = document.querySelector(el);
        let clickEvent = new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            clientX: 150,
            clientY: 150
        });
        btn.dispatchEvent(clickEvent);
    }

    // 查找Recaptcha回调函数
    function findRecaptchaClients() {
        // eslint-disable-next-line camelcase
        if (typeof (___grecaptcha_cfg) !== 'undefined') {
            // eslint-disable-next-line camelcase, no-undef
            return Object.entries(___grecaptcha_cfg.clients).map(([cid, client]) => {
                let data = { id: cid, version: cid >= 10000 ? 'V3' : 'V2' };
                let objects = Object.entries(client).filter(([_, value]) => value && typeof value === 'object');

                objects.forEach(([toplevelKey, toplevel]) => {
                    let found = Object.entries(toplevel).find(([_, value]) => (
                        value && typeof value === 'object' && 'sitekey' in value && 'size' in value
                    ));

                    if (typeof toplevel === 'object' && toplevel instanceof HTMLElement && toplevel['tagName'] === 'DIV') {
                        data.pageurl = toplevel.baseURI;
                    }

                    if (found) {
                        let [sublevelKey, sublevel] = found;

                        data.sitekey = sublevel.sitekey;
                        let callbackKey = data.version === 'V2' ? 'callback' : 'promise-callback';
                        let callback = sublevel[callbackKey];
                        if (!callback) {
                            data.callback = null;
                            data.function = null;
                        } else {
                            data.function = callback;
                            let keys = [cid, toplevelKey, sublevelKey, callbackKey].map((key) => `['${key}']`).join('');
                            data.callback = `___grecaptcha_cfg.clients${keys}`;
                        }
                    }
                });
                return data;
            });
        }
        return [];
    }

})();