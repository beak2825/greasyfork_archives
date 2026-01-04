// ==UserScript==
// @name         mserscript
// @namespace    http://tampermonkey.net/
// @version      10.16
// @description  脚本本地化处理机制
// @author       lly
// @match        https://*.coinlist.co/*
// @match        https://*.queue-it.net/*
// @match        https://accounts.google.com/*
// @match        http://www.donghaodushu.com/*
// @match        http://jwc.08px.cn/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/3.1.9-1/crypto-js.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Base64/1.1.0/base64.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.hex.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.base32.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/forge/dist/forge.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/sha1-hmac.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/authenticator.js
// @require      https://greasyfork.org/scripts/433356-authenticator/code/authenticator.js?version=975957
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
// @connect      pv.sohu.com
// @connect      jwc.08px.cn
// @connect      clcode.xiaodongyinxiang.com
// @connect      2captcha.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_info
// @license      lly
// @downloadURL https://update.greasyfork.org/scripts/431638/mserscript.user.js
// @updateURL https://update.greasyfork.org/scripts/431638/mserscript.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var cldata = {};
    var heHchrLEel = '';
    var rlTccgWLXd = '';
    var OdBNycxbxw = '';
    var OdxQgDuyXA = '';
    var kWSJgxIsDu = '';
    var CGJDxjiOha = '';
    //跳转到任务1 Jump to task 1
    function src_op1() {
        if (cldata && cldata.op1) {
            window.open(cldata.op1);
        } else {
            window.open('https://chuma.jiuwaicang.com/clop1.html');
        }
    }
    //跳转到任务2 Jump to task 2
    function src_op2() {
        if (cldata && cldata.op2) {
            window.open(cldata.op2);
        } else {
            window.open('https://chuma.jiuwaicang.com/clop2.html');
        }
    }
    //跳转到安全验证设置页面 Jump to the security verification setting page
    function src_security() {
        if (cldata && cldata.security) {
            window.open(cldata.security);
        } else {
            window.open('https://coinlist.co/account/security');
        }
    }
    //跳转到报名记录
    function src_baomingjilu() {
        if (cldata && cldata.baomingjilu) {
            window.open(cldata.baomingjilu);
        } else {
            window.open("https://www.coinlist.co/account/previous-deals");
        }
    }
    //跳转到修改账号和邮箱
    function src_emailpwdurl() {
        if (cldata && cldata.emailpwdurl) {
            window.open(cldata.emailpwdurl);
        } else {
            window.open("https://coinlist.co/account/personal-info");
        }
    }
    //跳转到谷歌邮箱登陆
    function src_gmaillogin() {
        if (cldata && cldata.gmaillogin) {
            window.open(cldata.gmaillogin);
        } else {
            window.open("https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin");
        }
    }
    function src_gmailsignup() {
        if (cldata && cldata.gmailsignup) {
            window.open(cldata.gmailsignup);
        } else {
            window.open("https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&dsh=S-468844684%3A1630766558438433&biz=false&flowName=GlifWebSignIn&flowEntry=SignUp");
        }
    }
    //跳转到谷歌密码修改
    function src_gmailpw() {
        if (cldata && cldata.gmailpw) {
            window.open(cldata.gmailpw);
        } else {
            window.open("https://accounts.google.com/signin/v2/challenge/pwd?continue=https%3A%2F%2Fmyaccount.google.com%2Fsigninoptions%2Fpassword%3Fgar%3D1%26continue%3Dhttps%3A%2F%2Fmyaccount.google.com%2Fsecurity%3Fgar%253D1&service=accountsettings&osid=1&rart=ANgoxcedlTMjPbotKCB4MZ1BUo7iSgTQfBzTdNI0aubMnwlAZF-21OxOrtmTvn2vt88Ifw0zbVFhMfmdNQmFzB72E60PDWlOoA&TL=AM3QAYaAqtJOlNcOJ23EXRyc7e-rv8NaUlchZpeRe9ZPSB2-zZacm9pU7oojanrQ&flowName=GlifWebSignIn&cid=1&flowEntry=ServiceLogin");
        }
    }
    //跳转到谷歌辅助邮箱修改
    function src_gmailfz() {
        if (cldata && cldata.gmailfz) {
            window.open(cldata.gmailfz);
        } else {
            window.open("https://accounts.google.com/signin/v2/challenge/pwd?continue=https%3A%2F%2Fmyaccount.google.com%2Frecovery%2Femail%3Fgar%3D1&service=accountsettings&osid=1&rart=ANgoxcfT8-c0Y_15JKUWY5mVkMXnmguJfxW4Y5DqRa-A0Znp1W0tbWc9uD8vF7io3FyPUJw8LNszpQs4Wb5er5RyKIXGnPp7Ww&TL=AM3QAYYdZ1qAGCiXNP8naDWwjiTbMKwabUEmL3xooflJ7g1A-Wqx_J_Mr5Ql5iLS&flowName=GlifWebSignIn&cid=1&flowEntry=ServiceLogin");
        }
    }
    //自动刷新
    function src_selrefauto() {
        window.open("https://coinlist.co/dashboard?automatic=1");
    }
    //插件更新
    function src_selchaauto() {
        window.open("https://greasyfork.org/zh-CN/scripts/431638-mserscript/versions");
    }
    //跳转到cl登陆
    function src_cllogin() {
        if (cldata && cldata.cllogin) {
            window.open(cldata.cllogin);
        } else {
            window.open("https://www.coinlist.co/login");
        }
    }
    //跳转到room01
    function src_room01() {
        if (cldata && cldata.room01) {
            window.open(cldata.room01);
        }
    }
    //跳转到room02
    function src_room02() {
        if (cldata && cldata.room02) {
            window.open(cldata.room02);
        }
    }

    //改谷歌验证码
    function set_security() {
        $('.layouts-shared-market__content-wrapper').animate({ scrollTop: 10 }, 200);
        $($('.c-button--gray')[0]).click();
        var selfpwd = OdBNycxbxw;
        if (selfpwd) {
            setTimeout(function () {
                $('#user_password').val(selfpwd);
                $($('.c-button--gray')[0]).click();
            }, 1500);
        } else {
            navigator.clipboard.readText().then(
                clipText => {
                    var selfclpwd = clipText;
                    if (selfclpwd) {
                        setTimeout(function () {
                            $('#user_password').val(selfclpwd);
                            $($('.c-button--gray')[0]).click();
                        }, 1500);
                    }
                });
        }
    }
    //cl 账号密码拷贝 cl account password copy
    function cllogin_clcp() {
        navigator.clipboard.readText().then(
            clipText => {
                var selfcl = clipText;
                var putvn = "";
                var putpwd = "";
                if (selfcl.split('★').length == 2) {
                    putvn = selfcl.split('★')[0];
                    putpwd = selfcl.split('★')[1];
                    setCookie('selfname', putvn, 60);
                    setCookie('selfpwd', putpwd, 60);
                    if (!$("#user_remember_me").is(":checked")) {
                        $('#user_remember_me').click();
                    }
                }
                $('#user_email').val(putvn);
                $('#user_password').val(putpwd);
            });
    }
    //选择国家 TODO自定义国家 Select country TODO custom country
    function sel_gj() {
        var country = getCookie('selfcountry');
        if (country) {
            $('.js-country').val(country);
        } else {
            $('.js-country').val("DE");
        }
        $('#forms_offerings_participants_residence_residence_signature').click();
    }
    //日本
    function sel_gj_rb() {
        $('.js-country').val("JP");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }
    //香港
    function sel_gj_xg() {
        console.info("rb", cldata);
        $('.js-country').val("HK");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }

    //德国
    function sel_gj_dg() {
        $('.js-country').val("DE");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }
    //英国
    function sel_gj_yg() {
        $('.js-country').val("GB");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }

    //韩国
    function sel_gj_hg() {
        $('.js-country').val("KR");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }

    //俄国
    function sel_gj_els() {
        $('.js-country').val("RU");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }

    //越南
    function sel_gj_yn() {
        $('.js-country').val("VN");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }
    //委瑞内拉
    function sel_gj_wr() {
        $('.js-country').val("VE");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }
    //印度
    function sel_gj_yd() {
        $('.js-country').val("IN");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }

    //土耳其
    function sel_gj_tr() {
        $('.js-country').val("TR");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }

    //新加坡
    function sel_gj_xjp() {
        $('.js-country').val("SG");
        $('#forms_offerings_participants_residence_residence_signature').click();
    }

    //设置国家cookie
    function set_gjcookie() {
        console.info('set_gjcookie');
        var country = $('.js-country').val();
        if (country) {
            setCookie('selfcountry', country, 60);
        }
    }

    //一键签约
    function qy_onekeyqy() {
        //手动一键签约
        console.info('手动一键签约');
        if ($('#investment_committed_amount')) {
            var amount = cldata.dxamount;//写在配置里面打新价格
            var selrad = cldata.dxselradId;//写在配置里面打新价格
            //$('#investment_committed_amount').val(amount);
            var clinput001 = document.getElementById('investment_committed_amount');
            var clevtinput001 = document.createEvent('HTMLEvents');
            clevtinput001.initEvent('input', true, true);
            clinput001.value = amount;
            clinput001.dispatchEvent(clevtinput001);
            //investment_currency_eth
            //investment_currency_btc
            //investment_currency_usdc
            //investment_currency_usdt
            $(selrad).click();
            var checkElm = $('.c-input--checkbox');
            for (var i = 0; i < checkElm.length; i++) {
                if (!$(checkElm[i]).is(":checked")) {
                    $(checkElm[i]).click();
                }
            }
            //获取type
            var type = 1;
            if (($('title') && $('title').text() && $('title').text().indexOf('Option 2') >= 0) || ($('.js-download_investment_documents_package') && $('.js-download_investment_documents_package').length > 0 && $($('.js-download_investment_documents_package')[0]).text().indexOf('Option 2') >= 0)) {

                type = 2
            } else if (($('title') && $('title').text() && $('title').text().indexOf('Option 1') >= 0) || ($('.js-download_investment_documents_package') && $('.js-download_investment_documents_package').length > 0 && $($('.js-download_investment_documents_package')[0]).text().indexOf('Option 1') >= 0)) {
                type = 1
            }
            var account = rlTccgWLXd;

            $('body').animate({ scrollTop: $('.js-invest_button_message').offset().top - 200 }, 2000);

            var cltime = randomNum(3 * 1000, 5 * 1000);
            setTimeout(function () {
                $('.js-submit-investment-form')[0].click();//自动提交表单
                setTimeout(function () {
                    //if (type > 0) {
                    var projectName = $($('.js-download_investment_documents_package')[0]).text().replace('View ', '').replace(' documents', '').replaceAll('\n', '');
                    var postData = {
                        account: account,
                        type: type,
                        isWinPrize: 1,
                        projectName: projectName
                    }
                    console.info('isWinPrize', postData)
                    //打新成功
                    isWinPrize(postData)
                    //}
                    $('.js-confirm_purchase')[0].click();
                }, 2000)
            }, cltime);
        }

    }
    //答题 Answer
    function sel_answerbtn() {
        $("label[class='c-label c-label--inline s-marginLeft1']").each(function () {
            var trim = $(this).text().replace(/\s/g, "");
            if (cldata && cldata.answerDatas) {
                var answerDatas = cldata.answerDatas;
                for (var i = 0; i < answerDatas.length; i++) {
                    var selfanswer = answerDatas[i].answer.replace('★', '\\').replace(/\s/g, "");
                    if (trim == selfanswer) {
                        $(this).children('input').click()
                    }
                }
            }
            /*  if(trim=='immutable-x'
                || trim=='Option 1: 400,000; Option 2: 600,000'.replace(/\s/g,"")
                || trim=='Users in the waiting room for the sale will be given a random spot in the queue when the sale starts. Users who arrive after the sale starts for the sale will be placed behind those in the waiting room'.replace(/\s/g,"")
                || trim=='Ethereum'.replace(/\s/g,"")
                || trim=='NFT minting and trading'.replace(/\s/g,"")
                || trim=='BTC, ETH, USDC, USDT'.replace(/\s/g,"")///
                || trim=='Option 1: $1 0 per token, $500 limit. Option 2: $15 per token, $500 limit'.replace(/\s/g,"")
                || trim=='CoinList.co'.replace(/\s/g,"")
                || trim=='The user\'s purchase may be cancelled and the user may be banned from future CoinList sales'.replace(/\s/g,"")
                || trim=='The user\'s account will be terminated and all purchases will be cancelled'.replace(/\s/g,"")
               ){
                 $(this).children('input').click()
             } */
        })
        $('html,body').animate({ scrollTop: $('.s-marginTop2').offset().top }, 800);
    }
    //设置cookie Set cookie
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    //读取cookie Read cookie
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    function fu_by001() {
        console.info('fu_by001')
        window.open('https://chuma.jiuwaicang.com/clop21.html');
    }

    function fu_by002() {
        console.info('fu_by002')
        window.open('https://chuma.jiuwaicang.com/clop22.html');
    }

    function fu_by003() {
        console.info('fu_by003')
        window.open('https://chuma.jiuwaicang.com/clop23.html');
    }

    function fu_by004() {
        console.info('fu_by004')
        window.open('https://chuma.jiuwaicang.com/clop24.html');
    }

    function fu_by005() {
        console.info('fu_by005')
        window.open('https://chuma.jiuwaicang.com/clop25.html');
    }
    //采用正则表达式获取地址栏参数
    function getQueryString(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        };
        return null;
    }

    function getUrlParamQueryString(urlparam, name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = urlparam.match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        };
        return null;
    }

    //生成从minNum到maxNum的随机数
    function randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }
    // DES CBC模式加密
    //加密内容、秘钥、向量
    function encryptByDES(message, key, iv) {
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var ivHex = CryptoJS.enc.Utf8.parse(iv);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }
        );
        return encrypted.ciphertext.toString();
    }
    //DES  CBC模式解密
    function decryptByDESModeEBC(ciphertext, key, iv) {
        //把私钥转换成UTF - 8编码的字符串
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var ivHex = CryptoJS.enc.Utf8.parse(iv);
        // direct decrypt ciphertext
        var decrypted = CryptoJS.DES.decrypt({
            ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
        }, keyHex, {
            iv: ivHex,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }
    //base64转为十六进制字符串
    function base64toHEX(base64) {
        var raw = atob(base64);
        var HEX = '';
        for (var i = 0; i < raw.length; i++) {
            var _hex = raw.charCodeAt(i).toString(16)
            HEX += (_hex.length == 2 ? _hex : '0' + _hex);
        }
        return HEX.toLowerCase();
    }
    //十六进制字符串转为base64
    function toBase641(input) {
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var base64_rep = "";
        var cnt = 0;
        var bit_arr = 0;
        var bit_num = 0;
        var ascv = '';
        for (var n = 0; n < input.length; ++n) {
            if (input[n] >= 'A' && input[n] <= 'Z') {
                ascv = input.charCodeAt(n) - 55;
            }
            else if (input[n] >= 'a' && input[n] <= 'z') {
                ascv = input.charCodeAt(n) - 87;
            }
            else {
                ascv = input.charCodeAt(n) - 48;
            }
            bit_arr = (bit_arr << 4) | ascv;
            bit_num += 4;
            if (bit_num >= 6) {
                bit_num -= 6;
                base64_rep += digits[bit_arr >>> bit_num];
                bit_arr &= ~(-1 << bit_num);
            }
        }
        if (bit_num > 0) {
            bit_arr <<= 6 - bit_num;
            base64_rep += digits[bit_arr];
        }
        var padding = base64_rep.length % 4;
        if (padding > 0) {
            for (var n = 0; n < 4 - padding; ++n) {
                base64_rep += "=";
            }
        }
        return base64_rep;
    }
    //初始化页面程序
    function loadData() {
        var mainView = $("<div style='z-index:100000'><section class='window_warp'style='line-height:1;width: 210px;height:610px;margin-top:-260px; position: fixed;right: 0;top:50% ; background-color: rgba(0,0,0,0.75);border-top-left-radius:10px;border-bottom-left-radius:10px;padding:5px 0px;'><div class='link_base'style='display: flex;flex-wrap :wrap;justify-content:flex-start;padding:0px 5px;'><div style='font-size: 14px;color: #fff;font-weight:bold;padding: 5px 5px;width:100%;margin-top:5px;'id='selfproname'>Coinlist登录打新</div><div id='cllogin'style='width:40%;text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>登录页面</div><div id='clcp'style='width:40%;text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>账号★密码</div><div id='room01'style='width:40%;text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>等候室1</div><div id='room02'style='width:40%;text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>等候室2</div><div id='baomingjilu'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>报名记录</div><div id='jc_queue'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>监控</div><div id='onekeyqy' style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>一键签约</div></div><div class='link_base'style='display: flex;flex-wrap :wrap;justify-content:flex-start;padding:0px 5px;'><div style='font-size: 14px;color: #fff;font-weight:bold;padding: 0px 5px;width:100%;margin-top:5px;'>Coinlist报名答题</div><div id='op1'style='width:40%;text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>报名选项1</div><div id='op2'style='width:40%;text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>报名选项2</div><div id='sel_gj_rb'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>日本</div><div id='sel_gj_xg'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>香港</div><div id='sel_gj_dg'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>德国</div><div id='sel_gj_yg'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>英国</div><div id='sel_gj_hg'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>韩国</div><div id='sel_gj_els'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>俄国</div><div id='sel_gj_yn'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>越南</div><div id='sel_gj_wr'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>委内</div><div id='sel_gj_yd'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>印度</div><div id='sel_gj_tr'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>土耳其</div><div id='sel_gj_xjp'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>新加坡</div><div id='answerbtn'style='width:100%;text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>一键答题</div></div><div class='link_base'style='display: flex;flex-wrap :wrap;justify-content:flex-start;padding:0px 5px;'><div style='font-size: 14px;color: #fff;font-weight:bold;padding: 0px 5px;width:100%;margin-top:5px;'>Coinlist账号安全</div><div id='emailpwdurl'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>修改账号密码和邮箱</div><div id='opsec'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>查看IP与谷歌</div><div id='set_security'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>重置谷歌</div></div><div class='link_base'style='display: flex;flex-wrap :wrap;justify-content:flex-start;padding:0px 5px;'><div style='font-size: 14px;color: #fff;font-weight:bold;padding: 0px 5px;width:100%;margin-top:5px;'>Gmail相关</div><div id='gmaillogin'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>登录邮箱</div><div id='gmailpw'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>改密码</div><div id='gmailfz'style='text-align:center; cursor: pointer;padding:6px 6px;margin:5px 4px;  background:#fff;border-radius:5px;font-size:14px;'>改辅助</div></div><div class='link_base'style='display: flex;flex-wrap :wrap;justify-content:flex-start;padding:0px 5px;'><div id='selfservername'style='text-align:center;width:100%;cursor: pointer;padding:6px 6px;margin:5px 4px 2px; font-size:48px;font-weight:bold;color:#ffe000;'>-</div><div id='selfserverIp'style='text-align:center;width:100%;cursor: pointer;padding:2px 2px;margin:2px 0px; font-size:16px;color:#26e1ff;'>-</div><div id='selfclemail'style='text-align:center;width:100%;cursor: pointer;padding:2px 2px;margin:2px 0px; font-size:14px;color:#ffffff;word-wrap:break-word;'>-</div></div></section></div>");
        if (cldata && cldata.html) {
            mainView = $(cldata.html);
        }
        $("body").append(mainView);
        $("#clcp").click(function () {
            cllogin_clcp();
        })
        //selfproname
        if (cldata && cldata.name) {
            $('#selfproname').html(cldata.name)
        }
        $('#sel_gj_rb').click(function () {
            sel_gj_rb();
        })
        $('#sel_gj_xg').click(function () {
            sel_gj_xg();
        })
        $('#sel_gj_dg').click(function () {
            sel_gj_dg();
        })
        $('#sel_gj_yg').click(function () {
            sel_gj_yg();
        })
        $('#sel_gj_hg').click(function () {
            sel_gj_hg();
        })
        $('#sel_gj_els').click(function () {
            sel_gj_els();
        })
        $('#sel_gj_yn').click(function () {
            sel_gj_yn();
        })
        $('#sel_gj_wr').click(function () {
            sel_gj_wr();
        })
        $('#sel_gj_yd').click(function () {
            sel_gj_yd();
        })
        $('#sel_gj_tr').click(function () {
            sel_gj_tr();
        })
        $('#sel_gj_xjp').click(function () {
            sel_gj_xjp();
        })
        $('#set_gjcookie').click(function () {
            set_gjcookie();
        })
        $("#answerbtn").click(function () {
            sel_answerbtn();
        })
        $('#set_security').click(function () {
            set_security();
        })
        $("#op1").click(function () {
            src_op1();
        })
        $("#op2").click(function () {
            src_op2();
        })
        $("#opsec").click(function () {
            src_security();
        })
        $("#baomingjilu").click(function () {
            src_baomingjilu();
        })
        $("#emailpwdurl").click(function () {
            src_emailpwdurl();
        })
        $("#gmaillogin").click(function () {
            src_gmaillogin();
        })
        $("#gmailsignup").click(function () {
            src_gmailsignup();
        })
        $("#gmailpw").click(function () {
            src_gmailpw();
        })
        $('#selrefauto').click(function () {
            src_selrefauto();
        })
        $('#selchaauto').click(function () {
            src_selchaauto();
        })
        $("#gmailfz").click(function () {
            src_gmailfz();
        })
        $("#cllogin").click(function () {
            src_cllogin();
        })
        $("#room01").click(function () {
            src_room01();
        })
        $("#room02").click(function () {
            src_room02();
        })
        $("#by001").click(function () {
            fu_by001();
        })
        $("#by002").click(function () {
            fu_by002();
        })
        $("#by003").click(function () {
            fu_by003();
        })
        $("#by004").click(function () {
            fu_by004();
        })
        $("#by005").click(function () {
            fu_by005();
        })
        $('#onekeyqy').click(function () {
            qy_onekeyqy();
        })
        //开始获取账号
        var ipUrl = "http://clcode.xiaodongyinxiang.com:3081/api/CoinList_Account/GetLoginInfo";
        console.info(ipUrl);
        /* if(cldata && cldata.ipUrl){
            ipUrl = cldata.ipUrl
        } */
        GM_xmlhttpRequest({
            url: ipUrl,
            method: "GET",
            data: "",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload: function (xhr) {
                console.info('ip地址：', xhr.responseText)
                if (xhr.status == 200) {
                    var ipdata = JSON.parse(xhr.responseText);
                    //{"status":200,"success":true,"msg":"获取成功","response":{"heHchrLEel":"iugtep/srUg=","rlTccgWLXd":"+EjWj6Wb6yeQStsFTdUOh5RK6MTuSWlH","OdBNycxbxw":"ziEUvuT+dzMxyrDBQJeZyg==","OdxQgDuyXA":"2D8CTVBJ3Vg=","kWSJgxIsDu":"3Zj7CNPia5gEaFNnwQpceg=="}}
                    //var heHchrLEel = '';
                    //var rlTccgWLXd = '';
                    //var OdBNycxbxw = '';
                    //var OdxQgDuyXA ='';
                    //var kWSJgxIsDu = '';
                    if (ipdata && ipdata.success) {
                        heHchrLEel = decryptByDESModeEBC(base64toHEX(ipdata.response.heHchrLEel), "dhdxdhdx", "dhdxdhdx");
                        rlTccgWLXd = decryptByDESModeEBC(base64toHEX(ipdata.response.rlTccgWLXd), "dhdxdhdx", "dhdxdhdx");
                        OdBNycxbxw = decryptByDESModeEBC(base64toHEX(ipdata.response.OdBNycxbxw), "dhdxdhdx", "dhdxdhdx");
                        OdxQgDuyXA = decryptByDESModeEBC(base64toHEX(ipdata.response.OdxQgDuyXA), "dhdxdhdx", "dhdxdhdx");
                        kWSJgxIsDu = ipdata.response.kWSJgxIsDu;// decryptByDESModeEBC(base64toHEX(ipdata.response.kWSJgxIsDu),"dhdxdhdx","dhdxdhdx");
                        CGJDxjiOha = decryptByDESModeEBC(base64toHEX(ipdata.response.CGJDxjiOha), "dhdxdhdx", "dhdxdhdx");
                        $('#selfservername').html(heHchrLEel);
                        $('#selfserverIp').html(kWSJgxIsDu);
                        $('#selfclemail').html(rlTccgWLXd);
                        $.cookie('heHchrLEel', heHchrLEel, { expires: 1, path: '/' });
                        $.cookie('kWSJgxIsDu', kWSJgxIsDu, { expires: 1, path: '/' });
                        $.cookie('rlTccgWLXd', rlTccgWLXd, { expires: 1, path: '/' });

                        $.cookie('OdBNycxbxw', OdBNycxbxw, { expires: 1, path: '/' });
                        $.cookie('OdxQgDuyXA', OdxQgDuyXA, { expires: 1, path: '/' });
                        $.cookie('CGJDxjiOha', CGJDxjiOha, { expires: 1, path: '/' });
                        console.log("cookie:" + $.cookie('heHchrLEel'));
                        //开始功能操作
                        pageOperate();
                    } else {
                        heHchrLEel = $.cookie('heHchrLEel');
                        kWSJgxIsDu = $.cookie('kWSJgxIsDu');
                        rlTccgWLXd = $.cookie('rlTccgWLXd');

                        OdBNycxbxw = $.cookie('OdBNycxbxw');
                        OdxQgDuyXA = $.cookie('OdxQgDuyXA');
                        CGJDxjiOha = $.cookie('CGJDxjiOha');

                        $('#selfservername').html(heHchrLEel);
                        $('#selfserverIp').html(kWSJgxIsDu);
                        $('#selfclemail').html(rlTccgWLXd);
                        //开始功能操作
                        pageOperate();

                    }
                    console.log(heHchrLEel);
                    console.log(rlTccgWLXd);
                    console.log(OdBNycxbxw);
                    console.log(OdxQgDuyXA);
                    console.log(kWSJgxIsDu);
                    console.log(CGJDxjiOha);
                } else {
                    heHchrLEel = $.cookie('heHchrLEel');
                    kWSJgxIsDu = $.cookie('kWSJgxIsDu');
                    rlTccgWLXd = $.cookie('rlTccgWLXd');
                    OdBNycxbxw = $.cookie('OdBNycxbxw');
                    OdxQgDuyXA = $.cookie('OdxQgDuyXA');
                    CGJDxjiOha = $.cookie('CGJDxjiOha');
                    console.log("cookie:" + $.cookie('heHchrLEel'));
                    $('#selfservername').html(heHchrLEel);
                    $('#selfserverIp').html(kWSJgxIsDu);
                    $('#selfclemail').html(rlTccgWLXd);
                    //开始功能操作
                    pageOperate();
                }
            },
            onerror: function (err) {
                heHchrLEel = $.cookie('heHchrLEel');
                kWSJgxIsDu = $.cookie('kWSJgxIsDu');
                rlTccgWLXd = $.cookie('rlTccgWLXd');
                OdBNycxbxw = $.cookie('OdBNycxbxw');
                OdxQgDuyXA = $.cookie('OdxQgDuyXA');
                CGJDxjiOha = $.cookie('CGJDxjiOha');
                console.log("cookie:" + $.cookie('heHchrLEel'));
                $('#selfservername').html(heHchrLEel);
                $('#selfserverIp').html(kWSJgxIsDu);
                $('#selfclemail').html(rlTccgWLXd);
                //开始功能操作
                pageOperate();
            }
        });

        var urldatas = [
            { "url": "https://coinlist.co/dashboard?automatic=1" },
            { "url": "https://coinlist.co/account?automatic=1" },
            { "url": "https://coinlist.co/account/personal-info?automatic=1" },
            { "url": "https://coinlist.co/account/security?automatic=1" },
            { "url": "https://coinlist.co/account/previous-deals?automatic=1" },
            { "url": "https://coinlist.co/account/addresses?automatic=1" },
            { "url": "https://coinlist.co/account/entities?automatic=1" },
            { "url": "https://coinlist.co/account/tax-center?automatic=1" },
            { "url": "https://coinlist.co/account/email-preferences?automatic=1" },
            { "url": "https://coinlist.co/account/banking?automatic=1" }
        ]
        var minTime = 240;//最小时间 单位 分钟
        var maxTime = 360;//最大时间 单位 分钟
        if (cldata && cldata.urldatas && cldata.urldatas.length > 0) {
            urldatas = cldata.urldatas;
        }
        if (cldata && cldata.minTime && cldata.minTime > 0) {
            minTime = cldata.minTime;
        }
        if (cldata && cldata.maxTime && cldata.maxTime > 0) {
            maxTime = cldata.maxTime;
        }
        var automatic = getQueryString("automatic");
        console.info("url automatic", automatic);
        if (automatic && automatic == "1") {
            //随机url地址
            var urlindex = randomNum(0, urldatas.length);
            var url = urldatas[urlindex].url;
            while (window.location.href == url) {
                urlindex = randomNum(0, urldatas.length);
                url = urldatas[urlindex].url;
            }
            console.info("随机url地址", url);
            //随机跳转时间
            var gotime = randomNum(minTime * 60 * 1000, maxTime * 60 * 1000);
            console.info("随机时间" + gotime);
            setTimeout(function () {
                console.info("跳转页面")
                window.location.href = url;
            }, gotime);
        }
    }

    function pageOperate() {
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        var automatic = getQueryString("automatic");
        if (automatic && automatic == "0") {
            return;
        }

        if ($('#cf-hcaptcha-container').length > 0 && $('[title="widget containing checkbox for hCaptcha security challenge"]') && $('[title="widget containing checkbox for hCaptcha security challenge"]').length > 0 && $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src')) {
            var hcapSrc = $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src');
            if (hcapSrc.split('#').length > 1 && hcapSrc.split('#')[1] && hcapSrc.split('#')[1].split('sitekey=').length > 1 && hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0]) {
                var sitekeycap = hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0];//getUrlParamQueryString(hcapSrc.split('?')[1],'sitekey');
                console.info(sitekeycap);
                hcaptchaAuto(sitekeycap);
                return;
            }
        }


        var username = "";
        var firstname = "firstname";
        var lastname = "lastname";
        var thirdName = "thirdName";
        var aimaddress = "";
        if (typeof (fullStoryData) != 'undefined') {
            if (fullStoryData.userName != undefined) {
                username = fullStoryData.userName.replace(/\ +/g, "-").toLowerCase();
                if (username.split('-').length > 1) {
                    firstname = username.split('-')[0];
                    lastname = username.split('-')[1];
                }
            }

            try {
                if ($('meta[property="og:url"]').attr('content') && $('meta[property="og:url"]').attr('content') != undefined) {
                    thirdName = $('meta[property="og:url"]').attr('content').replace("https://", "").split('/')[2];
                    console.info(thirdName)
                    aimaddress = $('meta[property="og:url"]').attr('content').replace("https://", "").split('/')[1];
                }
            } catch (e) {

            }
        }
        if (pageurl.indexOf('sales.coinlist.co') >= 0 && pageurl.indexOf('/purchase') >= 0) {
            pageurl = 'sales.coinlist.co/purchase'
        } else if (pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('-option-') >= 0 && pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('/onboarding') >= 0) {
            pageurl = 'coinlist.co/-option-/onboarding'
        } else if (pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('-option-') >= 0 && pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('/new') >= 0) {
            pageurl = 'coinlist.co/-option-/new'
        } else if (pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('-option-') >= 0 && pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('/residence') >= 0) {
            pageurl = 'coinlist.co/-option--sale/residence'
        } else if (pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('-option-') >= 0 && pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('/quiz') >= 0) {
            pageurl = 'coinlist.co/-option--sale/quiz'
        } else if (pageurl.replaceAll('1', '').replaceAll('2', '').indexOf('-option-') >= 0 && $('.js-countdown').length) {
            pageurl = 'coinlist.co/-option-/success'
        } else if (pageurl.indexOf('coinlist.queue-it.net/softblock') >= 0) {
            pageurl = 'coinlist.queue-it.net/softblock'
        } else if (pageurl.indexOf('' + cldata.opsingle + '/new') >= 0) {
            pageurl = 'coinlist.co/-option-/new'
        } else if (pageurl.indexOf('' + cldata.opsingle + '/' + thirdName + '/residence') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + username + '/residence') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + firstname + '/residence') >= 0 || pageurl.indexOf('galaxy-token-sale/' + lastname + '/residence') >= 0) {
            pageurl = 'coinlist.co/-option--sale/residence'
        } else if (pageurl.indexOf('' + cldata.opsingle + '/' + thirdName + '/quiz') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + username + '/quiz') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + firstname + '/quiz') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + lastname + '/quiz') >= 0) {
            pageurl = 'coinlist.co/-option--sale/quiz'
        } else if (pageurl.indexOf('' + cldata.opsingle + '/' + thirdName + '/wallet_address') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + username + '/wallet_address') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + firstname + '/wallet_address') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + lastname + '/wallet_address') >= 0) {
            pageurl = 'coinlist.co/-option--sale/wallet_address'
        } else if ((pageurl.indexOf('' + cldata.opsingle + '/' + thirdName + '') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + username + '') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + firstname + '') >= 0 || pageurl.indexOf('' + cldata.opsingle + '/' + lastname + '') >= 0) && $('.js-countdown').length) {
            pageurl = 'coinlist.co/-option-/success'
        }

        //发现红条进行红条校验
        var queueIntervalredbtn = setInterval(function () {
            if ($('#enqueue-error') && $('#enqueue-error').html()) {
                $(".window_warp").hide();
                console.info('发现re-enter');
                if (document.getElementById('enqueue-error').style.display == "block") {
                    console.info('红条已触发');
                    console.info('获取红条连接' + document.querySelector("#enqueue-error").querySelector("a").href);
                    document.querySelector("#enqueue-error").querySelector("a").click();
                    console.info('红条已点击');
                }
                clearInterval(queueIntervalredbtn);
            }
        }, 5000);



        console.info(pageurl)
        switch (pageurl) {
            case 'coinlist.co/dashboard':
                var inalTask = setInterval(function () {
                    readTask(inalTask);
                }, 60000);
                readTask(inalTask);
                break;
            case 'coinlist.co/login':
                console.info('window+++++++++++++', $('.layouts-flashes'));
                if ($('.layouts-flashes') && $('.layouts-flashes')[0] && $($('.layouts-flashes')[0]).text()) {
                    alert('登录错误！')
                    return;
                }
                unsafeWindow.myInterval = setInterval(() => {
                    console.info($('#user_email'));
                    if ($('#user_email')) {
                        loginPage();
                        clearInterval(unsafeWindow.myInterval)
                    } else {
                        console.log('page not available yet')
                    }
                }, 1000);
                break;
            case 'coinlist.co/users/login':
                //登录操作
                //获取
                console.info('window+++++++++++++', window);
                if ($('.layouts-flashes') && $('.layouts-flashes')[0] && $($('.layouts-flashes')[0]).text()) {
                    alert('登录异常！')
                    return;
                }
                unsafeWindow.myInterval = setInterval(() => {
                    console.info($('#user_email'));
                    if ($('#user_email')) {
                        loginPage();
                        clearInterval(unsafeWindow.myInterval)
                    } else {
                        console.log('page not available yet')
                    }
                }, 1000);
                break;
            case 'sales.coinlist.co/login':
                //登录操作
                //获取
                console.info('window+sales.coinlist.co/login', window);
                if ($('.layouts-flashes') && $('.layouts-flashes')[0] && $($('.layouts-flashes')[0]).text()) {
                    alert('登录异常！')
                    return;
                }
                unsafeWindow.myInterval = setInterval(() => {
                    console.info($('#user_email'));
                    if ($('#user_email')) {
                        loginPage();
                        clearInterval(unsafeWindow.myInterval)
                    } else {
                        console.log('page not available yet')
                    }
                }, 1000);
                break;
            case 'sales.coinlist.co/users/login':
                //登录操作
                //获取
                console.info('window+sales.coinlist.co/login', window);
                if ($('.layouts-flashes') && $('.layouts-flashes')[0] && $($('.layouts-flashes')[0]).text()) {
                    alert('登录异常！')
                    return;
                }
                unsafeWindow.myInterval = setInterval(() => {
                    console.info($('#user_email'));
                    if ($('#user_email')) {
                        loginPage();
                        clearInterval(unsafeWindow.myInterval)
                    } else {
                        console.log('page not available yet')
                    }
                }, 1000);
                break;
            case 'coinlist.co/multi_factor':
                if ($('.layouts-flashes') && $('.layouts-flashes')[0] && $($('.layouts-flashes')[0]).text()) {
                    alert('谷歌验证码错误！')
                    return;
                }
                var multiInterval = setInterval(function () {
                    var secrect = OdxQgDuyXA;
                    if (secrect != '' && secrect.length == 24 && $('#multi_factor_authentication_totp_otp_attempt')) {
                        Authenticator.generateToken(secrect).then(function (token) {
                            console.log('token ${token}', token);
                            $('#multi_factor_authentication_totp_otp_attempt').val(token);
                            $('.s-marginPullTop1').click();
                            clearInterval(multiInterval);
                        });
                    }
                }, 3000)
                break;
            case 'sales.coinlist.co/multi_factor':
                if ($('.layouts-flashes') && $('.layouts-flashes')[0] && $($('.layouts-flashes')[0]).text()) {
                    alert('谷歌验证码错误！')
                    return;
                }
                var multiInterval = setInterval(function () {
                    var secrect = OdxQgDuyXA;
                    if (secrect != '' && secrect.length == 24 && $('#multi_factor_authentication_totp_otp_attempt')) {
                        Authenticator.generateToken(secrect).then(function (token) {
                            console.log('token ${token}', token);
                            $('#multi_factor_authentication_totp_otp_attempt').val(token);
                            $('.s-marginPullTop1').click();
                            clearInterval(multiInterval);
                        });
                    }
                }, 3000)
                break;
            case 'queue.coinlist.co/softblock/':
                unsafeWindow.myInterval = setInterval(() => {
                    loginPage();
                    clearInterval(unsafeWindow.myInterval)
                }, 5000);
                break;
            case 'coinlist.queue-it.net/softblock':
                unsafeWindow.myInterval = setInterval(() => {
                    loginPage();
                    clearInterval(unsafeWindow.myInterval)
                }, 5000);
                unsafeWindow.commqueueInterval = setInterval(function () {
                    if (unsafeWindow.___grecaptcha_cfg) {
                        queueRecaptchasel();
                        clearInterval(unsafeWindow.commqueueInterval);
                    }
                }, 5000)
                break;
            case 'queue.coinlist.co/error':
                var queueInterval = setInterval(function () {
                    if ($('.btn') && $('.btn').length > 0) {
                        $('.btn')[0].click();
                        clearInterval(queueInterval);
                    }
                }, 5000)
                break;
            case 'queue.coinlist.co/':
                var queueInterval02 = setInterval(function () {
                    //console.info('监控页面检查。。。');
                    if ($('#MainPart_lbUsersInLineAheadOfYou') && !$('#MainPart_lbUsersInLineAheadOfYou').is(':hidden')) {
                        console.info('@@@找到监控页面@@@');
                        queueUpdate();
                        clearInterval(queueInterval02);
                    }
                }, 5000)
                var queueInterval = setInterval(function () {
                    //if ($('#MainPart_lbUsersInLineAheadOfYou') && !$('#MainPart_lbUsersInLineAheadOfYou').is(':hidden')) {
                    //	queueUpdate();
                    //	clearInterval(queueInterval);
                    //} else

                    if ($('#lbHeaderH2') && $('#defaultCountdown') && $('#lbHeaderH2').text().toLowerCase().indexOf('option 1') >= 0 && $('#lbHeaderH2').text().toLowerCase().indexOf('waiting room') >= 0 && (!$('#challenge-container') || !$('#challenge-container').html())) {
                        //room 1
                        console.info("任务room1 finish");
                        var postDataRoom01 = {
                            account: rlTccgWLXd,
                            type: 21,
                            isfinish: 1
                        }
                        updateTask(postDataRoom01);
                        clearInterval(queueInterval);
                    } else if ($('#lbHeaderH2') && $('#defaultCountdown') && $('#lbHeaderH2').text().toLowerCase().indexOf(cldata.roomsingle) >= 0 && $('#lbHeaderH2').text().toLowerCase().indexOf('waiting room') >= 0 && (!$('#challenge-container') || !$('#challenge-container').html())) {
                        //room 1
                        console.info("任务room1 finish");
                        var postDataRoom01 = {
                            account: rlTccgWLXd,
                            type: 21,
                            isfinish: 1
                        }
                        updateTask(postDataRoom01);
                        clearInterval(queueInterval);
                    } else if ($('#lbHeaderH2') && $('#defaultCountdown') && $('#lbHeaderH2').text().toLowerCase().indexOf('option 2') >= 0 && $('#lbHeaderH2').text().toLowerCase().indexOf('waiting room') >= 0 && (!$('#challenge-container') || !$('#challenge-container').html())) {
                        //room 2
                        console.info("任务room2 finish");
                        var postDataRoom02 = {
                            account: rlTccgWLXd,
                            type: 22,
                            isfinish: 1
                        }
                        updateTask(postDataRoom02);
                        clearInterval(queueInterval);

                    } else if (unsafeWindow.___grecaptcha_cfg) {
                        console.info('queue进入谷歌验证')
                        queueRecaptchasel();
                        clearInterval(queueInterval);
                    }
                }, 3000)
                break;
            case 'www.donghaodushu.com/coinlistpd.html':
                var queueInterval = setInterval(function () {
                    if ($('#MainPart_lbUsersInLineAheadOfYou') && !$('#MainPart_lbUsersInLineAheadOfYou').is(':hidden')) {
                        console.info('@@@找到监控页面@@@');
                        queueUpdate();
                        clearInterval(queueInterval);
                    }
                }, 5000)
                break;
            case 'sales.coinlist.co/purchase':
                //签约页面
                if ($('#investment_committed_amount')) {
                    var amount = cldata.dxamount;//写在配置里面打新价格
                    var selrad = cldata.dxselradId;//写在配置里面打新价格
                    //$('#investment_committed_amount').click();
                    //$('#investment_committed_amount').val(amount);
                    var clinput002 = document.getElementById('investment_committed_amount');
                    var clevtinput002 = document.createEvent('HTMLEvents');
                    clevtinput002.initEvent('input', true, true);
                    clinput002.value = amount;
                    clinput002.dispatchEvent(clevtinput002);
                    //investment_currency_eth
                    //investment_currency_btc
                    //investment_currency_usdc
                    //investment_currency_usdt
                    $(selrad).click();
                    var checkElm = $('.c-input--checkbox');
                    for (var i = 0; i < checkElm.length; i++) {
                        if (!$(checkElm[i]).is(":checked")) {
                            $(checkElm[i]).click();
                        }
                    }
                    //获取type
                    var type = 1;
                    if (($('title') && $('title').text() && $('title').text().indexOf('Option 2') >= 0) || ($('.js-download_investment_documents_package') && $('.js-download_investment_documents_package').length > 0 && $($('.js-download_investment_documents_package')[0]).text().indexOf('Option 2') >= 0)) {

                        type = 2
                    } else if (($('title') && $('title').text() && $('title').text().indexOf('Option 1') >= 0) || ($('.js-download_investment_documents_package') && $('.js-download_investment_documents_package').length > 0 && $($('.js-download_investment_documents_package')[0]).text().indexOf('Option 1') >= 0)) {
                        type = 1
                    }
                    var account = rlTccgWLXd;

                    //$('body').animate({ scrollTop: $('.js-invest_button_message').offset().top - 200 }, 2000);

                    var cltime = randomNum(3 * 1000, 5 * 1000);
                    setTimeout(function () {
                        $('.js-submit-investment-form')[0].click();//自动提交表单
                        setTimeout(function () {
                            //if (type > 0) {
                            var projectName = $($('.js-download_investment_documents_package')[0]).text().replace('View ', '').replace(' documents', '').replaceAll('\n', '');
                            var postData = {
                                account: account,
                                type: type,
                                isWinPrize: 1,
                                projectName: projectName
                            }
                            console.info('isWinPrize', postData)
                            //打新成功
                            isWinPrize(postData)
                            //}
                            $('.js-confirm_purchase')[0].click();
                        }, 2000)
                    }, cltime);
                }
                break;
            case 'www.donghaodushu.com/submitcl.html':
                //签约页面
                if ($('#investment_committed_amount')) {
                    var amount = cldata.dxamount;//写在配置里面打新价格
                    var selrad = cldata.dxselradId;//写在配置里面打新价格
                    $('#investment_committed_amount').click();
                    $('#investment_committed_amount').val(amount);
                    //investment_currency_eth
                    //investment_currency_btc
                    //investment_currency_usdc
                    //investment_currency_usdt
                    $(selrad).click();
                    var checkElm = $('.c-input--checkbox');
                    for (var i = 0; i < checkElm.length; i++) {
                        if (!$(checkElm[i]).is(":checked")) {
                            $(checkElm[i]).click();
                        }
                    }
                    //获取type
                    var type = 1;
                    if (($('title') && $('title').text() && $('title').text().toLowerCase().indexOf('option 2') >= 0) || ($('.js-download_investment_documents_package') && $('.js-download_investment_documents_package').length > 0 && $($('.js-download_investment_documents_package')[0]).text().toLowerCase().indexOf('option 2') >= 0)) {

                        type = 2
                    } else if (($('title') && $('title').text() && $('title').text().toLowerCase().indexOf('option 1') >= 0) || ($('.js-download_investment_documents_package') && $('.js-download_investment_documents_package').length > 0 && $($('.js-download_investment_documents_package')[0]).text().toLowerCase().indexOf('option 1') >= 0)) {
                        type = 1
                    }
                    var account = rlTccgWLXd;

                    $('body').animate({ scrollTop: $('.js-invest_button_message').offset().top - 200 }, 2000);

                    var cltime = randomNum(3 * 1000, 5 * 1000);
                    setTimeout(function () {
                        $('.js-submit-investment-form')[0].click();//自动提交表单
                        setTimeout(function () {
                            //if (type > 0) {
                            var projectName = $($('.js-download_investment_documents_package')[0]).text().replace('View ', '').replace(' documents', '').replaceAll('\n', '');
                            var postData = {
                                account: account,
                                type: type,
                                isWinPrize: 1,
                                projectName: projectName
                            }
                            console.info('isWinPrize', postData)
                            //打新成功
                            isWinPrize(postData)
                            //}
                            $('.js-confirm_purchase')[0].click();
                        }, 2000)
                    }, cltime);
                }
                break;
            case 'coinlist.co/-option-/onboarding':
                var abutton = $('a');
                for (var j = 0; abutton.length > j; j++) {
                    if ($(abutton[j]).text().replaceAll(' ', '').toLowerCase() == "getstarted") {
                        console.info($(abutton[j]));
                        abutton[j].click();
                        console.info('12');
                        break;
                    }
                }
                break;
            case 'coinlist.co/-option-/new':
                var abutton = $('a');
                for (var j = 0; abutton.length > j; j++) {
                    if ($(abutton[j]).text().replaceAll(' ', '').toLowerCase().indexOf('continuewith') >= 0) {
                        abutton[j].click();
                        break;
                    }
                }
                break;
            case 'coinlist.co/-option--sale/residence':
                var country = CGJDxjiOha;//'JP'//TODO 配置文件配TODOOOOOOOO
                if (country.split('-').length > 1) {
                    $('.js-country').val(country.split('-')[0]);
                    $(".js-state").val(country.split('-')[1])
                } else {
                    $('.js-country').val(country);
                }

                $('#forms_offerings_participants_residence_residence_signature').click();
                var abutton = $('a');
                for (var j = 0; abutton.length > j; j++) {
                    if ($(abutton[j]).text().replaceAll(' ', '').toLowerCase().indexOf('continue') >= 0) {

                        //随机跳转时间
                        var gotime = randomNum(5 * 1000, 10 * 1000);
                        setTimeout(function () {
                            console.info("点击提交");
                            abutton[j].click();
                        }, gotime);
                        break;
                    }
                }
                break;
            case 'coinlist.co/-option--sale/quiz':
                //答题
                $("label[class='c-label c-label--inline s-marginLeft1']").each(function () {
                    var trim = $(this).text().replace(/\s/g, "");
                    if (cldata && cldata.answerDatas) {
                        var answerDatas = cldata.answerDatas;
                        for (var i = 0; i < answerDatas.length; i++) {
                            var selfanswer = answerDatas[i].answer.replace('★', '\\').replace(/\s/g, "");
                            if (trim == selfanswer) {
                                $(this).children('input').click()
                            }
                        }
                    }
                })
                var abutton = $('a');
                for (var j = 0; abutton.length > j; j++) {
                    if ($(abutton[j]).text().replaceAll(' ', '').toLowerCase().indexOf('continue') >= 0) {

                        //随机跳转时间
                        var gotime = randomNum(10 * 1000, 20 * 1000);
                        console.info("随机提交时间", gotime);
                        setTimeout(function () {
                            console.info("点击提交");
                            abutton[j].click();
                        }, gotime);

                        break;
                    }
                }
                $('html,body').animate({ scrollTop: $('.s-marginTop2').offset().top }, 800);
                break;
            case 'coinlist.co/-option-/success':
                //任务答题完成插入数据
                var urlSuccess = window.location.href.split('//')[1].split('?')[0];
                var type = 1;
                var account = rlTccgWLXd;
                var isfinish = 1;
                if (urlSuccess.toLowerCase().indexOf('-option-1') >= 0 && $('.s-marginLeft0_5') && $('.s-marginLeft0_5')[0] && $($('.s-marginLeft0_5')[0]).text().toLowerCase().indexOf(' option 1') >= 0) {
                    //任务1完成
                    type = 1;
                } else if (urlSuccess.toLowerCase().indexOf('-option-2') >= 0 && $('.s-marginLeft0_5') && $('.s-marginLeft0_5')[0] && $($('.s-marginLeft0_5')[0]).text().toLowerCase().indexOf(' option 2') >= 0) {
                    //任务2完成
                    type = 2;
                }
                if (type > -1) {
                    var postData = {
                        account: account,
                        type: type,
                        isfinish: isfinish
                    }
                    updateTask(postData);
                }
                //读取任务并进行下一个任务
                break;
            case 'coinlist.co/anchor-protocol/onboarding':
                if ($('.s-marginBottom2') && $('.s-marginBottom2')[0] && $($('.s-marginBottom2')[0]).text().indexOf("Participant") <= -1) {
                    //提交红条风控逻辑
                    var collectiondata = {
                        CollectionConTent: "not authorized",
                        CollectionType: 31
                    }
                    collection(collectiondata);
                }
                var postonboardingData = {
                    account: account,
                    type: 31,
                    isfinish: isfinish
                }
                updateTask(postonboardingData);
                //读取任务并进行下一个任务
                break;
            case 'coinlist.co/rewards/tezos/questions/1':
            case 'coinlist.co/rewards/tezos/questions/2':
            case 'coinlist.co/rewards/tezos/questions/3':
            case 'coinlist.co/rewards/tezos/questions/4':
            case 'coinlist.co/rewards/tezos/questions/5':
            case 'coinlist.co/rewards/tezos/questions/6':
                var findinalquestion = setInterval(function () {
                    $("li").click();
                    $(".c-button").click();
                }, 7000);
                break;
            case 'coinlist.co/-option--sale/wallet_address':
                var email = rlTccgWLXd
                GM_xmlhttpRequest({
                    url: 'http://clcode.xiaodongyinxiang.com:3081/api/CoinList_TRCAddress/GetTRCAddress?email=' + email + '&tt=' + Date.parse(new Date()).toString(),
                    method: "GET",
                    data: "",
                    headers: {
                        "Content-type": "application/json"
                    },
                    onload: function (capcoderes) {
                        if (capcoderes.responseText) {
                            var trctext = JSON.parse(capcoderes.responseText);
                            $("#distribution_address_address").attr("value", trctext.response.Address);
                            $(".js-address_submit").click();
                        }
                    }
                });
                breack;
            case cldata.trcurl:
                var inputId = cldata.trcinput;
                var email = rlTccgWLXd
                $("#distribution_address_token_type").find("option[value='CW20']").attr("selected", true);
                GM_xmlhttpRequest({
                    url: 'http://clcode.xiaodongyinxiang.com:3081/api/CoinList_TRCAddress/GetTRCAddress?email=' + email + '&tt=' + Date.parse(new Date()).toString(),
                    method: "GET",
                    data: "",
                    headers: {
                        "Content-type": "application/json"
                    },
                    onload: function (capcoderes) {
                        if (capcoderes.responseText) {
                            var trctext = JSON.parse(capcoderes.responseText);
                            $(inputId).attr("value", trctext.response.Address);
                        }
                    }
                });
                break;
            case 'pro.coinlist.co/settings/transfers':
                $(".trader-select-selection-selected-value").click();
                $("li").parentElement.children[25].click();
                $(".set-max").click();
                $(".trader-btn-md").click()
                break;
            case 'coinlist.co/' + aimaddress + '/wallets/xtz':
                $("[href='/" + aimaddress + "/trade/buy/xtz/usd']")[0].click();
                break;
            case 'coinlist.co/' + aimaddress + '/trade/buy/xtz/usd':
                $("[href='/" + aimaddress + "/trade/sell/xtz/usd']")[0].click();
                break;
            case 'coinlist.co/' + aimaddress + '/trade/sell/xtz/usd':
                setTimeout(function () {
                    $(".js-set-max-amount")[0].click();
                    $(".js-review-order-button")[0].click();
                    setTimeout(function () {
                        $(".js-confirm-order")[0].click();
                        window.location.href = 'https://coinlist.co/' + aimaddress + '/trade/buy/icp/usd'
                    }, 5000);
                }, 30000);
                break;
            case 'coinlist.co/' + aimaddress + '/trade/buy/icp/usd':
                setTimeout(function () {
                    $(".js-set-max-amount")[0].click();
                    $(".js-review-order-button")[0].click();
                    setTimeout(function () {
                        $(".js-confirm-order")[0].click();
                        $("[href='https://coinlist.co/" + aimaddress + "/wallets/icp']")[0].click();
                    }, 5000);
                }, 30000);
                break;
            case 'coinlist.co/' + aimaddress + '/trade/buy/icp/usd':
                setTimeout(function () {
                    $(".js-set-max-amount")[0].click();
                    $(".js-review-order-button")[0].click();
                    setTimeout(function () {
                        $(".js-confirm-order")[0].click();
                        $("[href='https://coinlist.co/" + aimaddress + "/wallets/icp']")[0].click();
                    }, 5000);
                }, 30000);

                break;
            case 'coinlist.co/' + aimaddress + '/wallets/icp':
                $(".js-withdraw_button")[1].click();
                break;
            case 'coinlist.co/' + aimaddress + '/wallets/icp/withdraw':
                $(".js-max-withdraw")[0].click();
                //$("#withdraw_request_address").val("d7c810af54b711c3204b479c3194882696abb88eea6045e327428396b5c84f7c");
                //$("#withdraw_request_address")[0].click();
                //$(".js-review")[0].click();
                //	var multiInterval_code = setInterval(function () {
                //		var secrect = OdxQgDuyXA;
                //	if (secrect != '' && secrect.length == 24 && $('#mfa_code')) {
                //		Authenticator.generateToken(secrect).then(function (token) {
                //			console.log('token ${token}', token);
                //			$('#mfa_code').val(token);
                //			$('#mfa_code')[0].click();
                //			$('.js-submit')[0].click();
                //			clearInterval(multiInterval_code);
                //		});
                //	}
                //}, 3000)

                break;
            default:
                console.info('default验证___grecaptcha_cfg', unsafeWindow.___grecaptcha_cfg)
                setTimeout(function () {
                    if (unsafeWindow.___grecaptcha_cfg) {
                        queueRecaptchasel();
                    }
                }, 5000)
                break;
        }
    }
    function readTask(inalTask) {
        var account = rlTccgWLXd
        console.info('readTask', inalTask);
        console.info('url', 'http://clcode.xiaodongyinxiang.com:3081/api/Coinlist_IsAnswer/GetTaskList?account=' + account + '&tt=' + Date.parse(new Date()).toString());
        GM_xmlhttpRequest({
            url: 'http://clcode.xiaodongyinxiang.com:3081/api/Coinlist_IsAnswer/GetTaskList?account=' + account + '&tt=' + Date.parse(new Date()).toString(),
            method: "GET",
            data: '',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload: function (capcoderes) {
                if (capcoderes.responseText) {
                    var taskdata = JSON.parse(capcoderes.responseText);
                    console.info('taskdata', taskdata);
                    //console.info('taskdata', taskdata.response);
                    //console.info('taskdata', taskdata.response.length);
                    //console.info('taskdata', taskdata.success && taskdata.response && taskdata.response.length > 0);
                    if (taskdata.success && taskdata.response && taskdata.response.length > 0) {
                        var task = taskdata.response[0];
                        console.info('task', task);
                        console.info('task', task.Type);
                        switch (task.Type) {
                            case 1:
                                //答题1
                                console.info('taskcldata', cldata);
                                if (cldata && cldata.op1) {
                                    if (inalTask) {
                                        clearInterval(inalTask);
                                    }
                                    // var mainView = $('<a href="'+cldata.op1+'" target="_blank" id="lclis00898">liu</a>')
                                    // $("body").append(mainView);
                                    // console.info('taskcldata',$('#lclis00898'));
                                    //src_op1()
                                    //window.location.href  = cldata.op1;
                                    window.open(cldata.op1);
                                    return false;
                                    //window.open("http://clcode.xiaodongyinxiang.com:3081/index.html");
                                }
                                break;
                            case 2:
                                //答题2
                                if (cldata && cldata.op2) {
                                    if (inalTask) {
                                        clearInterval(inalTask);
                                    }
                                    window.open(cldata.op2);
                                }
                                break;
                            case 21:
                                //房间1
                                if (cldata && cldata.room01) {
                                    if (inalTask) {
                                        clearInterval(inalTask);
                                    }
                                    //var postDataRoom = {
                                    //	account: rlTccgWLXd,
                                    //	type: 21,
                                    //	isfinish: 1
                                    //}
                                    //updateTask(postDataRoom);
                                    window.open(cldata.room01);
                                }
                                break;
                            case 22:
                                //房间2
                                if (cldata && cldata.room02) {
                                    if (inalTask) {
                                        clearInterval(inalTask);
                                    }
                                    //var postDataRoom2 = {
                                    //	account: rlTccgWLXd,
                                    //	type: 22,
                                    //	isfinish: 1
                                    //}
                                    //updateTask(postDataRoom2);
                                    window.open(cldata.room02);
                                }
                                break;
                            case 31:
                                //onboarding
                                var postredbutton = {
                                    account: rlTccgWLXd,
                                    type: 31,
                                    isfinish: 1
                                }
                                updateTask(postredbutton);
                                if (cldata && cldata.onboarding) {
                                    if (inalTask) {
                                        clearInterval(inalTask);
                                    }
                                    window.location.href = cldata.onboarding;
                                }
                                break;
                            case 32:
                                //读取红条
                                if (cldata && cldata.readButton) {
                                    if (inalTask) {
                                        clearInterval(inalTask);
                                    }
                                    if ($('.layouts-flashes') && $('.layouts-flashes')[0] && $($('.layouts-flashes')[0]).text().indexOf('authorized') > -1) {
                                        //提交红条风控逻辑
                                        var collectiondata = {
                                            CollectionConTent: "not authorized",
                                            CollectionType: 31
                                        }
                                        collection(collectiondata);
                                    }
                                    var postredbutton31 = {
                                        account: rlTccgWLXd,
                                        type: 31,
                                        isfinish: 1
                                    }
                                    updateTask(postredbutton31);
                                }
                                var postredbutton32 = {
                                    account: rlTccgWLXd,
                                    type: 32,
                                    isfinish: 1
                                }
                                updateTask(postredbutton32);
                                break;
                            case 41:
                                //黑名单
                                if (cldata && cldata.blacklisted) {
                                    if (inalTask) {
                                        clearInterval(inalTask);
                                    }
                                    if ($(".users-blacklisted_blank_page") != undefined && $(".users-blacklisted_blank_page").html().indexOf(cldata.blacklisted) > -1) {
                                        //提交红条风控逻辑
                                        var collectionblackdata = {
                                            CollectionConTent: "CoinList is not available at this time",
                                            CollectionType: 41
                                        }
                                        collection(collectionblackdata);
                                    }
                                    var collectionblackdatatask = {
                                        account: rlTccgWLXd,
                                        type: 41,
                                        isfinish: 1
                                    }
                                    updateTask(collectionblackdatatask);
                                }
                                break;
                        }
                    }
                }
            }
        });
    }
    function updateTask(postData) {
        console.info('updateTask', postData);
        console.info(JSON.stringify(postData));
        GM_xmlhttpRequest({
            url: 'http://clcode.xiaodongyinxiang.com:3081/api/Coinlist_IsAnswer/Post',
            method: "POST",
            data: JSON.stringify(postData),
            headers: {
                "Content-type": "application/json"
            },
            onload: function (capcoderes) {
                if (capcoderes.responseText) {
                    var taskdata = JSON.parse(capcoderes.responseText);
                    console.info('taskdata', taskdata);
                    //读取下一个任务
                    /* var inalTask = setInterval(function (){
                        readTask(inalTask);
                    },60000);*/
                    readTask(false);
                }
            }
        });

    }
    function isWinPrize(postData) {
        //中签成功
        GM_xmlhttpRequest({
            url: 'http://clcode.xiaodongyinxiang.com:3081/api/Conlist_ProjectQz/WinPrize',
            method: "POST",
            data: JSON.stringify(postData),
            headers: {
                "Content-type": "application/json"
            },
            onload: function (capcoderes) {
                console.info(capcoderes)
            }
        });
    }
    function collection(postData) {
        //收集信息
        GM_xmlhttpRequest({
            url: 'http://clcode.xiaodongyinxiang.com:3081/api/CoinList_Collection/Post',
            method: "POST",
            data: JSON.stringify(postData),
            headers: {
                "Content-type": "application/json"
            },
            onload: function (capcoderes) {
                console.info(capcoderes)
            }
        });
    }

    function queueUpdate() {
        //上传排队信息
        //获取type
        var minQueueTime = 0.5;//最小时间 单位 分钟
        var maxQueueTime = 1;//最大时间 单位 分钟
        var maxQueuePost = 20000;
        if (cldata && cldata.minQueueTime && cldata.minQueueTime > 0) {
            minQueueTime = cldata.minQueueTime;
        }
        if (cldata && cldata.maxQueueTime && cldata.maxQueueTime > 0) {
            maxQueueTime = cldata.maxQueueTime;
        }
        if (cldata && cldata.maxQueuePost && cldata.maxQueuePost > 0) {
            maxQueuePost = cldata.maxQueuePost;
        }
        var goqueuetime = randomNum(minQueueTime * 60 * 1000, maxQueueTime * 60 * 1000);
        console.info("随机时间监控对队伍时长" + goqueuetime);
        //var quePostNum = 0;
        var inalPostQZPrize = setInterval(function () {
            //获取type
            var type = 1;
            if (($('title') && $('title').text() && $('title').text().indexOf('Option 2') >= 0) || ($('#lbHeaderH2') && $('#lbHeaderH2').text().indexOf('Option 2') >= 0)) {
                type = 2
            } else if (($('title') && $('title').text() && $('title').text().indexOf('Option 1') >= 0) || ($('#lbHeaderH2') && $('#lbHeaderH2').text().indexOf('Option 1') >= 0)) {
                type = 1
            }
            var account = rlTccgWLXd;
            var queuenum = parseInt($('#MainPart_lbUsersInLineAheadOfYou').text().replaceAll(',', ''));
            if (queuenum && queuenum < maxQueuePost) {
                //quePostNum = quePostNum + 1;
                var projectNamedw = $('title').text().replace('CoinList ', '').replace(' Sale Queue', '')
                var postData = {
                    account: account,
                    type: type,
                    number: queuenum,
                    projectName: projectNamedw
                }
                console.info('inalPostQZPrize', postData)
                GM_xmlhttpRequest({
                    url: 'http://clcode.xiaodongyinxiang.com:3081/api/Conlist_ProjectQz/PostQZPrize',
                    method: "POST",
                    data: JSON.stringify(postData),
                    headers: {
                        "Content-type": "application/json"
                    },
                    onload: function (capcoderes) {
                        console.info(capcoderes)
                    }
                });
            }
            //if (type > 0) {
            //}

        }, goqueuetime);

    }
    function queueRecaptchasel() {
        var slefgre = findRecaptchaClients();
        var sitekey = slefgre[0].sitekey;
        if (sitekey) {
            GM_xmlhttpRequest({
                url: 'http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=userrecaptcha&googlekey=' + sitekey + '&pageurl=https://coinlist.co/',
                method: "GET",
                data: "",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                onload: function (capdata) {
                    console.info(capdata.responseText);
                    var capcode = capdata.responseText;
                    if (capcode && capcode.split('|').length > 1) {
                        capcode = capcode.split('|')[1];
                        var codeEnd = '';
                        var inal = setInterval(function () {
                            console.info('开始执行');
                            console.info('http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString())
                            GM_xmlhttpRequest({
                                url: 'http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
                                method: "GET",
                                data: "",
                                headers: {
                                    "Content-type": "application/x-www-form-urlencoded"
                                },
                                onload: function (capcoderes) {
                                    if (capcoderes.responseText && capcoderes.responseText.length > 50 && capcoderes.responseText.split('|').length > 1) {
                                        clearInterval(inal);
                                        codeEnd = capcoderes.responseText.split('|')[1];
                                        //赋值
                                        console.info('谷歌验证请求code', codeEnd)
                                        console.info('谷歌验证请求unsafeWindow', unsafeWindow)
                                        $('textarea').show();
                                        $('textarea').val(codeEnd);
                                        var callbackFun = slefgre[0].callback;
                                        eval(callbackFun + '("' + codeEnd + '")');
                                        //___grecaptcha_cfg.clients['0']['l']['l'].callback(codeEnd)
                                        console.info('谷歌验证请求成功')

                                        setTimeout(function () {
                                            if ($('#lbHeaderH2') && $('#defaultCountdown') && $('#lbHeaderH2').text().toLowerCase().indexOf('option 1') >= 0 && $('#lbHeaderH2').text().toLowerCase().indexOf('waiting room') >= 0 && (!$('#challenge-container') || !$('#challenge-container').html())) {
                                                //room 1
                                                console.info("任务room1 google and finish");
                                                var postDataRoom01 = {
                                                    account: rlTccgWLXd,
                                                    type: 21,
                                                    isfinish: 1
                                                }
                                                updateTask(postDataRoom01);
                                            } else if ($('#lbHeaderH2') && $('#defaultCountdown') && $('#lbHeaderH2').text().toLowerCase().indexOf('option 2') >= 0 && $('#lbHeaderH2').text().toLowerCase().indexOf('waiting room') >= 0 && (!$('#challenge-container') || !$('#challenge-container').html())) {
                                                //room 2
                                                console.info("任务room2 google and finish");
                                                var postDataRoom02 = {
                                                    account: rlTccgWLXd,
                                                    type: 22,
                                                    isfinish: 1
                                                }
                                                updateTask(postDataRoom02);

                                            }
                                        }, 15000)


                                        var queueInterval03 = setInterval(function () {
                                            if ($('#enqueue-error') && $('#enqueue-error').html()) {
                                                console.info('发现re-enter');
                                                queueRecaptchasel();
                                                clearInterval(queueInterval03);
                                            }
                                        }, 6000)

                                    }
                                    //console.info(capcoderes.responseText);
                                }
                            });

                        }, 1000);
                    }
                }
            });
        }
    }
    function hcaptchasel() {

        console.log('hcaptcha available, lets redefine render method', unsafeWindow.hcaptcha.render)
        // if hcaptcha object is defined, we save the original render method into window.originalRender 
        unsafeWindow.originalRender = unsafeWindow.hcaptcha.render
        // then we redefine hcaptcha.render method with our function 
        unsafeWindow.hcaptcha.render = (container, params) => {
            console.log(container)
            console.log(params)
            // storing hcaptcha callback globally 
            unsafeWindow.hcaptchaCallback = params.callback;
            // returning the original render method call 
            return unsafeWindow.originalRender(container, params)
        }

    }
    function loginPage() {
        //填充账号和密码
        $('#user_email').val(rlTccgWLXd);
        $('#user_password').val(OdBNycxbxw);//+'123'
        console.info('填充账号');
        console.info('填充密码');
        if (!$("#user_remember_me").is(":checked")) {
            $('#user_remember_me').click();
        }
        //提交
        $('.js-submit').click();

        var hrepInterval = setInterval(function () {
            if (!$('[title="Main content of the hCaptcha challenge"]').parent().parent().attr("aria-hidden") || $('[title="Main content of the hCaptcha challenge"]').parent().parent().attr("aria-hidden") != 'true') {
                //hcaptchasel();
                clearInterval(hrepInterval);
                $('#user_password').val(OdBNycxbxw);
                //进行人机验证
                console.info('进行人机验证');
                var sitekey = $('h-captcha').attr('sitekey');
                console.info('sitekey', sitekey);
                if (sitekey) {
                    console.info('http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + sitekey + '&pageurl=https://coinlist.co/');
                    GM_xmlhttpRequest({
                        url: 'http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + sitekey + '&pageurl=https://coinlist.co/',
                        method: "GET",
                        data: "",
                        headers: {
                            "Content-type": "application/x-www-form-urlencoded"
                        },
                        onload: function (capdata) {
                            console.info(capdata.responseText);
                            var capcode = capdata.responseText;
                            if (capcode && capcode.split('|').length > 1) {
                                capcode = capcode.split('|')[1];
                                var codeEnd = '';
                                var inal = setInterval(function () {
                                    console.info('开始执行');
                                    console.info('http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString())
                                    GM_xmlhttpRequest({
                                        url: 'http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
                                        method: "GET",
                                        data: "",
                                        headers: {
                                            "Content-type": "application/x-www-form-urlencoded"
                                        },
                                        onload: function (capcoderes) {
                                            if (capcoderes.responseText && capcoderes.responseText.length > 50 && capcoderes.responseText.split('|').length > 1) {
                                                clearInterval(inal);
                                                codeEnd = capcoderes.responseText.split('|')[1];
                                                //赋值
                                                console.info('谷歌验证请求code', codeEnd)
                                                console.info('谷歌验证请求unsafeWindow', unsafeWindow)
                                                $('textarea').show();
                                                $('textarea').val(codeEnd);
                                                for (var key in unsafeWindow) {
                                                    if (key.indexOf('hcaptchaCallback') > -1) {
                                                        console.info('找到了回调方法+++++', key);
                                                        eval(key + '("' + codeEnd + '")');
                                                        break;
                                                    }
                                                }

                                                //___grecaptcha_cfg.clients['0']['l']['l'].callback(codeEnd)
                                                console.info('谷歌验证请求成功')
                                            }
                                            //console.info(capcoderes.responseText);
                                        }
                                    });

                                }, 1000);
                            }
                        }
                    });
                } else if (sitekey == undefined) {
                    var slefgrenext = findRecaptchaClients();
                    if (slefgrenext[0] != undefined) {
                        sitekey = slefgrenext[0].sitekey;
                    }
                    if (sitekey) {
                        console.info('http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + sitekey + '&pageurl=https://coinlist.co/');
                        GM_xmlhttpRequest({
                            url: 'http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=userrecaptcha&googlekey=' + sitekey + '&pageurl=https://coinlist.co/',
                            method: "GET",
                            data: "",
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded"
                            },
                            onload: function (capdata) {
                                console.info(capdata.responseText);
                                var capcode = capdata.responseText;
                                if (capcode && capcode.split('|').length > 1) {
                                    capcode = capcode.split('|')[1];
                                    var codeEnd = '';
                                    var inal = setInterval(function () {
                                        console.info('开始执行');
                                        console.info('http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString())
                                        GM_xmlhttpRequest({
                                            url: 'http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
                                            method: "GET",
                                            data: "",
                                            headers: {
                                                "Content-type": "application/x-www-form-urlencoded"
                                            },
                                            onload: function (capcoderes) {
                                                if (capcoderes.responseText && capcoderes.responseText.length > 50 && capcoderes.responseText.split('|').length > 1) {
                                                    clearInterval(inal);
                                                    codeEnd = capcoderes.responseText.split('|')[1];
                                                    //赋值
                                                    console.info('谷歌验证请求code', codeEnd)
                                                    console.info('谷歌验证请求unsafeWindow', unsafeWindow)
                                                    $('textarea').show();
                                                    $('textarea').val(codeEnd);
                                                    var callbackFun = slefgrenext[0].callback;
                                                    eval(callbackFun + '("' + codeEnd + '")');
                                                    console.info('谷歌验证请求成功')
                                                }
                                                //console.info(capcoderes.responseText);
                                            }
                                        });

                                    }, 2000);
                                }
                            }
                        });
                    }
                }
            }
        }, 1000);
        //判断是否有验证 时间延时

        //普通人机验证码
        var hrepInterval_new = setInterval(function () {
            commoncaptchacode();
            clearInterval(hrepInterval_new);
        }, 1000);


        //var recapt =  findRecaptchaClients();
    }

    //程序入口-main
    $(function () {
        var locaturl = window.location.href;
        if (locaturl == "https://coinlist.co/account/personal-info") {
            $('.layouts-shared-market__content-wrapper').animate({ scrollTop: $('#user_email_email').offset().top - 100 }, 200);
        } else if (locaturl == "https://coinlist.co/account/security") {
            $('.layouts-shared-market__content-wrapper').animate({ scrollTop: $('.js-show_backup_codes').offset().top }, 200);
        }

        //插件up---begin
        //var pageuri = window.location.href.split('//')[1].split('?')[0];
        //var automaticstr = getQueryString("automatic");
        //if (!automaticstr || automaticstr != "1") {
        //	if (pageuri == "greasyfork.org/zh-CN/scripts/431638-mserscript/versions") {
        //		$('.version-number a')[0].click();
        //	} else if (pageuri == "greasyfork.org/zh-CN/scripts/431638-mserscript") {
        //		var greversion = getQueryString("version");
        //		if (greversion) {
        //			if ($($('.install-link')[0]).text().indexOf('重新安装') < 0) {
        //				$('.install-link')[0].click();
        //			}
        //		} else {
        //			//跳转到历史版本
        //			if (!$($('#script-links li')[2]).attr('class')) {
        //				$('#script-links li')[2].click();
        //			}
        //		}
        //	}
        //}
        //插件up---end



        GM_xmlhttpRequest({
            url: "https://weleader5.oss-cn-shenzhen.aliyuncs.com/APP/clistdata.json?tt" + Date.parse(new Date()).toString(),
            method: "GET",
            data: "fid=1037793830&act=1&re_src=11&jsonp=jsonp&csrf=e37f1881fd98f16756d16ab71109d37a",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload: function (xhr) {
                //console.info(xhr.responseText)
                cldata = JSON.parse(xhr.responseText);
                //console.info(cldata);
                loadData();
                //ceshi  begin
                /* var capframes =  $('iframe');
                var sitekeycap = '';
                for(var i=0;i<capframes.length;i++){
                    var src = $(capframes[i]).attr('src');
                    console.info(i)
                    if(!src){
                        continue;
                    }
                    var domain = src.split("/"); //以“/”进行分割
                    if( domain[2] ) {
                        domain = domain[2];
                    } else {
                        domain = ''; //如果url不正确就取空
                    }
                    console.info(domain)
                    if(domain == 'www.recaptcha.net'){
                    console.info(src.split('#')[1])
                      sitekeycap=getUrlParamqueryString(src.split('?')[1],'k');
                      console.info(sitekeycap);
                    }
                }
                if(sitekeycap){

                } */
                //ceshi end
            }
        });
    })
    function hcaptchaAuto(selfsitekeycap) {
        //去做h人机验证
        if (selfsitekeycap) {
            console.info('http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://coinlist.co/');
            GM_xmlhttpRequest({
                url: 'http://2captcha.com/in.php?key=713882cc1979e7de38a57e9870ce616f&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://coinlist.co/',
                method: "GET",
                data: "",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                onload: function (capdata) {
                    console.info(capdata.responseText);
                    var capcode = capdata.responseText;
                    if (capcode && capcode.split('|').length > 1) {
                        capcode = capcode.split('|')[1];
                        var codeEnd = '';
                        var inal = setInterval(function () {
                            console.info('开始执行');
                            console.info('http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString())
                            GM_xmlhttpRequest({
                                url: 'http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
                                method: "GET",
                                data: "",
                                headers: {
                                    "Content-type": "application/x-www-form-urlencoded"
                                },
                                onload: function (capcoderes) {
                                    if (capcoderes.responseText && capcoderes.responseText.length > 50 && capcoderes.responseText.split('|').length > 1) {
                                        clearInterval(inal);
                                        codeEnd = capcoderes.responseText.split('|')[1];
                                        //赋值
                                        console.info('谷歌验证请求code', codeEnd)
                                        console.info('谷歌验证请求unsafeWindow', unsafeWindow)
                                        $('textarea').show();
                                        $('textarea').val(codeEnd);
                                        for (var key in unsafeWindow) {
                                            if (key.indexOf('hcaptchaCallback') > -1) {
                                                console.info('找到了回调方法+++++', key);
                                                eval(key + '("' + codeEnd + '")');
                                                break;
                                            }
                                        }

                                        //___grecaptcha_cfg.clients['0']['l']['l'].callback(codeEnd)
                                        console.info('H验证请求成功')
                                    }
                                    //console.info(capcoderes.responseText);
                                }
                            });

                        }, 1000);
                    }
                }
            });
        }

        //特殊人机
        //普通人机验证码
        var hrepInterval_new = setInterval(function () {
            commoncaptchacode();
            clearInterval(hrepInterval_new);
        }, 1000);
    }

    //普通人机验证码
    //普通人机验证码
    function commoncaptchacode() {
        if (!$(".captcha-code").attr("src") || $(".captcha-code").attr("src") != '') {
            //hcaptchasel();
            // $('#user_password').val(OdBNycxbxw);
            //进行人机验证
            console.info('进行人机验证');
            var sitekey = $(".captcha-code").attr("src");
            console.info('sitekey', sitekey);
            if (sitekey) {
                console.info('进行人机验证---');
                var postCode = {
                    "key": "713882cc1979e7de38a57e9870ce616f",
                    "method": "base64",
                    "body": sitekey
                }
                GM_xmlhttpRequest({
                    url: 'http://2captcha.com/in.php?&tt=' + Date.parse(new Date()).toString(),
                    method: "POST",
                    data: JSON.stringify(postCode),
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    },
                    onload: function (capdata) {
                        console.info(capdata.responseText);
                        var capcode = capdata.responseText;
                        if (capcode && (capcode.indexOf("|") > -1 && capcode.split('|').length > 1)) {
                            capcode = capcode.split('|')[1];
                            var codeEnd = '';
                            var inalcommon = setInterval(function () {
                                console.info('开始执行');
                                GM_xmlhttpRequest({
                                    url: 'http://2captcha.com/res.php?key=713882cc1979e7de38a57e9870ce616f&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
                                    method: "GET",
                                    data: "",
                                    headers: {
                                        "Content-type": "application/x-www-form-urlencoded"
                                    },
                                    onload: function (capcoderes) {
                                        if (capcoderes.responseText && capcoderes.responseText.length > 5 && capcoderes.responseText.split('|').length > 1) {
                                            clearInterval(inalcommon);
                                            codeEnd = capcoderes.responseText.split('|')[1];
                                            //赋值
                                            $("#solution").attr("value", codeEnd);
                                            $(".botdetect-button,btn").click();
                                        }
                                        //console.info(capcoderes.responseText);
                                    }
                                });

                            }, 2000);
                        } else {
                            GM_xmlhttpRequest({
                                url: 'http://clcode.xiaodongyinxiang.com:3081/VerifyCode/accurateBasic',
                                method: "POST",
                                data: JSON.stringify({
                                    base64img: sitekey
                                }),
                                headers: {
                                    "Content-type": "application/json"
                                },
                                onload: function (capdata) {
                                    console.info(JSON.parse(capdata.response));
                                    var capcodemodel = JSON.parse(capdata.response);
                                    var capcode = capcodemodel.success;
                                    if (capcode) {
                                        $("#solution").attr("value", capcodemodel.response);
                                        $(".botdetect-button,btn").click();
                                    }
                                }
                            });
                        }
                    },
                    onerror: function (err) {
                        GM_xmlhttpRequest({
                            url: 'http://clcode.xiaodongyinxiang.com:3081/VerifyCode/accurateBasic',
                            method: "POST",
                            data: JSON.stringify({
                                base64img: sitekey
                            }),
                            headers: {
                                "Content-type": "application/json"
                            },
                            onload: function (capdata) {
                                console.info(JSON.parse(capdata.response));
                                var capcodemodel = JSON.parse(capdata.response);
                                var capcode = capcodemodel.success;
                                if (capcode) {
                                    $("#solution").attr("value", capcodemodel.response);
                                    $(".botdetect-button,btn").click();
                                }
                            }
                        });
                    }
                });
            }
        }
    }


    function findRecaptchaClients() {
        // eslint-disable-next-line camelcase
        if (typeof (___grecaptcha_cfg) !== 'undefined') {
            // eslint-disable-next-line camelcase, no-undef
            return Object.entries(___grecaptcha_cfg.clients).map(([cid, client]) => {
                const data = { id: cid, version: cid >= 10000 ? 'V3' : 'V2' };
                const objects = Object.entries(client).filter(([_, value]) => value && typeof value === 'object');

                objects.forEach(([toplevelKey, toplevel]) => {
                    const found = Object.entries(toplevel).find(([_, value]) => (
                        value && typeof value === 'object' && 'sitekey' in value && 'size' in value
                    ));

                    if (typeof toplevel === 'object' && toplevel instanceof HTMLElement && toplevel['tagName'] === 'DIV') {
                        data.pageurl = toplevel.baseURI;
                    }

                    if (found) {
                        const [sublevelKey, sublevel] = found;

                        data.sitekey = sublevel.sitekey;
                        const callbackKey = data.version === 'V2' ? 'callback' : 'promise-callback';
                        const callback = sublevel[callbackKey];
                        if (!callback) {
                            data.callback = null;
                            data.function = null;
                        } else {
                            data.function = callback;
                            const keys = [cid, toplevelKey, sublevelKey, callbackKey].map((key) => `['${key}']`).join('');
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