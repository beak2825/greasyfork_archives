// ==UserScript==
// @name         kilnwarter
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description   kovwm
// @author       lly
// @match        https://faucets.chain.link/*
// @match        https://zkx.fi/*
// @match        https://subspace.network/*
// @match        https://whitelist.nft.com/*
// @match        https://www.brine.finance/*
// @match        https://faucet.kintsugi.themerge.dev/*
// @match        https://faucet.sepolia.dev/*
// @match        https://faucet.kiln.themerge.dev/*
// @match        https://forms.leapwallet.io/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/crypto-js/3.1.9-1/crypto-js.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/Base64/1.1.0/base64.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.hex.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/unibabel/unibabel.base32.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/forge/dist/forge.min.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/sha1-hmac.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/botp/index.js
// @require      https://cdn.jsdelivr.net/npm/clshuangcool@3.0.0/authenticator.js
// @grant        GM_xmlhttpRequest
// @connect      weleader5.oss-cn-shenzhen.aliyuncs.com
// @connect      pv.sohu.com
// @connect      clcode.getpx.cn
// @connect      2captcha.com
// @connect      airdropapi.beetaa.cn
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
// @license		 lly
// @downloadURL https://update.greasyfork.org/scripts/445513/kilnwarter.user.js
// @updateURL https://update.greasyfork.org/scripts/445513/kilnwarter.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(function () {
        pageOperate();
    })
    function pageOperate() {
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        console.info(pageurl)
        if (pageurl.indexOf("sibforms.com") > -1) {
            pageurl = "799bd0d7.sibforms.com"
        }

        switch (pageurl) {
            case 'faucets.chain.link/kovan':
                var findinal = setInterval(function () {
                    if ($('#recaptcha').length > 0 && $('[title="reCAPTCHA"]') && $('[title="reCAPTCHA"]').length > 0 && $($('[title="reCAPTCHA"]')[0]).attr('src')) {
                        var hcapSrc = $($('[title="reCAPTCHA"]')[0]).attr('src');
                        if (hcapSrc.split('#').length > 0 && hcapSrc.split('#')[0] && hcapSrc.split('#')[0].split('k=').length > 1 && hcapSrc.split('#')[0].split('k=')[1].split('&')[0]) {
                            var sitekeycap = hcapSrc.split('#')[0].split('k=')[1].split('&')[0];
                            console.info(sitekeycap);
                            clearInterval(findinal);
                            queueRecaptchasel(sitekeycap)
                            return;
                        }
                    }

                }, 3000);
                break;
            case 'faucet.kintsugi.themerge.dev/':
                var findinalstr = setInterval(function () {
                    if ($('[title="widget containing checkbox for hCaptcha security challenge"]') && $('[title="widget containing checkbox for hCaptcha security challenge"]').length > 0 && $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src')) {
                        var hcapSrc = $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src');
                        var sitekeycap = '9ce2fe68-6c29-4b1c-8abf-94a17a59a64c';
                        console.info(sitekeycap);
                        clearInterval(findinalstr);
                        GM_xmlhttpRequest({
                            url: "http://clcode.getpx.cn:3001/api/coinlist_kintsugI/Get",
                            method: "GET",
                            data: "",
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded"
                            },
                            onload: function (xhr) {
                                if (xhr.status == 200) {
                                    var data = JSON.parse(xhr.responseText);
                                    //$("input[name='address']").value="0x2c850725EbE5f99CA90c84f7dc10B6f8442ecCe1"
                                    if (data.response != null) {
                                        $("input[name='address']").attr("value", data.response.Wallet);
                                        hcaptchaAuto(sitekeycap)
                                        return;

                                    }

                                }

                            }
                        })
                    }

                }, 3000);
                break;

            case 'faucet.kiln.themerge.dev/':
            case 'faucet.kiln.themerge.dev':
                var findinalstr = setInterval(function () {
                    if ($('[title="widget containing checkbox for hCaptcha security challenge"]') && $('[title="widget containing checkbox for hCaptcha security challenge"]').length > 0 && $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src')) {
                        var hcapSrc = $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src');
                        var sitekeycap = '9ce2fe68-6c29-4b1c-8abf-94a17a59a64c';
                        console.info(sitekeycap);
                        clearInterval(findinalstr);
                        GM_xmlhttpRequest({
                            url: "http://airdropapi.beetaa.cn:3082/api/coinlist_kintsugI/Get",
                            method: "GET",
                            data: "",
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded"
                            },
                            onload: function (xhr) {
                                if (xhr.status == 200) {
                                    var data = JSON.parse(xhr.responseText);
                                    //$("input[name='address']").value="0x2c850725EbE5f99CA90c84f7dc10B6f8442ecCe1"
                                    if (data.response != null) {
                                        $("input[name='address']").attr("value", data.response.Wallet);
                                        hcaptchaAuto(sitekeycap,"https://faucet.kintsugi.themerge.dev/")
                                        return;

                                    }

                                }

                            }
                        })
                    }

                }, 15000);
                break;
            case 'faucet.sepolia.dev/':
            case 'faucet.sepolia.dev':
                var findinalstr = setInterval(function () {
                    if ($('[title="widget containing checkbox for hCaptcha security challenge"]') && $('[title="widget containing checkbox for hCaptcha security challenge"]').length > 0 && $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src')) {
                        var hcapSrc = $($('[title="widget containing checkbox for hCaptcha security challenge"]')[0]).attr('src');
                        var sitekeycap = 'f0da04d3-528f-4539-bf05-a0fa4a098ab9';
                        console.info(sitekeycap);
                        clearInterval(findinalstr);
                        GM_xmlhttpRequest({
                            url: "http://airdropapi.beetaa.cn:3082/api/coinlist_kintsugI/Get",
                            method: "GET",
                            data: "",
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded"
                            },
                            onload: function (xhr) {
                                if (xhr.status == 200) {
                                    var data = JSON.parse(xhr.responseText);
                                    //$("input[name='address']").value="0x2c850725EbE5f99CA90c84f7dc10B6f8442ecCe1"
                                    if (data.response != null) {
                                        $("input[name='address']").attr("value", data.response.Wallet);
                                        hcaptchaAuto(sitekeycap,"https://faucet.sepolia.dev/")
                                        return;

                                    }

                                }

                            }
                        })
                    }

                }, 15000);
                break;




        }
    }
    function IsSendData(postData) {
        //成功
        GM_xmlhttpRequest({
            url: 'http://clcode.getpx.cn:3081/api/KongTou_Email/updateEmailById',
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
    function queueRecaptchasel(sitekey, url, button, from) {
        var slefgre = findRecaptchaClients();
        sitekey = slefgre[0].sitekey;
        if (sitekey) {
            GM_xmlhttpRequest({
                url: 'http://2captcha.com/in.php?key=953bfccd8519015fd0150f2383bbe802&method=userrecaptcha&googlekey=' + sitekey + '&pageurl=' + url,
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
                            console.info('http://2captcha.com/res.php?key=953bfccd8519015fd0150f2383bbe802&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString())
                            GM_xmlhttpRequest({
                                url: 'http://2captcha.com/res.php?key=953bfccd8519015fd0150f2383bbe802&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
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
                                        //var callbackFun = slefgre[0].callback;
                                        //eval(callbackFun + '("' + codeEnd + '")');
                                        //___grecaptcha_cfg.clients['0']['l']['l'].callback(codeEnd)
                                        console.info('谷歌验证请求成功')
                                        $(button).click()
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

    function recaptchaAuto(selfsitekeycap, url, button) {
        //去做h人机验证
        if (selfsitekeycap) {
            console.info('http://2captcha.com/in.php?key=953bfccd8519015fd0150f2383bbe802&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=' + url);
            GM_xmlhttpRequest({
                url: 'http://2captcha.com/in.php?key=953bfccd8519015fd0150f2383bbe802&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=' + url,
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
                            console.info('http://2captcha.com/res.php?key=953bfccd8519015fd0150f2383bbe802&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString())
                            GM_xmlhttpRequest({
                                url: 'http://2captcha.com/res.php?key=953bfccd8519015fd0150f2383bbe802&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
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
                                        $(button).click()
                                        window.location.href = url;
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
    function hcaptchaAuto(selfsitekeycap,url) {
        //去做h人机验证
        if (selfsitekeycap) {
            console.info('http://2captcha.com/in.php?key=953bfccd8519015fd0150f2383bbe802&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=' + url);
            GM_xmlhttpRequest({
                url: 'http://2captcha.com/in.php?key=953bfccd8519015fd0150f2383bbe802&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=' + url,
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
                            console.info('http://2captcha.com/res.php?key=953bfccd8519015fd0150f2383bbe802&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString())
                            GM_xmlhttpRequest({
                                url: 'http://2captcha.com/res.php?key=953bfccd8519015fd0150f2383bbe802&action=get&id=' + capcode + '&tt=' + Date.parse(new Date()).toString(),
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
                                        $("button").click()
                                        setTimeout(function () {
                                            if (url != "") {
                                                window.location.href = url;
                                            } else {
                                                window.location.href = 'https://faucet.kiln.themerge.dev';
                                            }
                                            
                                        }, 45000);

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