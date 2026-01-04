// ==UserScript==
// @name         Preminthelper
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Preminth报名助手
// @author       aridrop
// @match        https://*.premint.xyz/*
// @match        https://*.twitter.com/*
// @match        https://*.hcaptcha.com/*
// @match        https://democaptcha.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.min.js
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
// @connect      2captcha.com
// @connect      airdropapi.beetaa.cn
// @connect      localhost
// @connect      api.yescaptcha.com
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
// @downloadURL https://update.greasyfork.org/scripts/445238/Preminthelper.user.js
// @updateURL https://update.greasyfork.org/scripts/445238/Preminthelper.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var taskId = "";
    $(function () {
        //加载浮动层
        var mainView = $("<section style='position:fixed;right: 10px;top: 50%;transform: translate(0,-50%);display: flex;flex-direction:column;'> <img id='jstwitter' src='data:image/png;base64,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' style='width: 100px;height: 100px;padding:14px;margin: 5px 0px;justify-content: center;align-items: center;border-radius:10px;width:100px;heigth:100px; display: flex;background-color:#06c020;'> <img id='discord' src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAABECAYAAAA4E5OyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LjljY2M0ZGU5MywgMjAyMi8wMy8xNC0xNDowNzoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjMgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjY2Qjc1N0RDRDgyMTExRUNBOEM4QjIwOTc0OTIyM0ZCIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjY2Qjc1N0RERDgyMTExRUNBOEM4QjIwOTc0OTIyM0ZCIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjZCNzU3REFEODIxMTFFQ0E4QzhCMjA5NzQ5MjIzRkIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NjZCNzU3REJEODIxMTFFQ0E4QzhCMjA5NzQ5MjIzRkIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz73q0jBAAAENUlEQVR42uyaS0hVQRjHveYjfIteIs3KFCuLKMmFEYHiQjepQUXQpiJoEQRCFBQY9BCKFtUiSnDRIgp7rHJRZBIZ+dhVWFGmFUVQ+H6k6en/wUiny73nzMyZc73nNh/8mMWd882c/3z3zHzfOT7DMGK0/bVYLYEWRAuiBdGCaEG0IFoQLYgWRAuiBdGCeN/irH70+XyOnCOTLkRTCjaDFvh7IeHjIJqloAd0wsdPB/Ph6xQKiQETwXZwHfQb/1qbhL8sMGryMQu6wVlQKiOIHT6rG+eNEPgoQ0MrWQcyLLpuYyu9nK16MkiiocgNGAHj4BP4ChrASQt/H8BN0IS5fl7wCEGfctBj8Nsvgb6/wQxnX+p3F+QuWITgujQ0vSAngp6J9zHnHU4ixMkucy7CxCCrw03XOHEgFSG4hnYN2jEWReDOSc+SYsx9LJwRciVCxSDLA/VhixD0r0bTGuHnq2FQEHhmcStCGjxw4EwHR12PEI9Ex7xNgGW4h0E3I6Q+xjtGB759rkUI+uWjee+xhJBOskW4jzk3ImS/B7PjAlCpPP2HsrEy4RchttuNeghllrkeFaQGCxqnpB5ismrJybyjGgZIBOXAL+HjDehmPipAtuD1WWAraHdcIzD16TLEbBLsDVIraRTwMQ72BPhYDC4Y4naeN9u1FQRtJivMiNguiwW4yOmjzsLHZcH5PFUpSIXg4B02EZkKBm18PLHxkQ6GBaMtnkcQnodqieB/9p5NnXYUzSOHPihXESlJ0iFtg6pdRlSQfo4+A2HwEWjFqgQpFBw4maNPahh8BNpKVYKInj+2KOjD46NMcF75jrddOtCwYq+I0WuDJRbjVXL4GALZFj6qJLbexyoeqn6JylgKuA3nKUFuZBWaZs56xi30Twrig/KTJokDXprjbJeFWZ/kKZUyYypEU+01AVSBYyBTwMdb0Ai62El13keGxHxeg/VOBVnNjs7RYH0s+3X0UI2PiR5LVLHLzEaRIJMqBBmJIkFGVAgyLDHwTJhucFqw/6gKQcYFo6SN7SK14IELfzlaoKtgE1gLhgSu/a6kHkJnB0qfOQ8/c+AOKGbX5tIHL+zN/JAhZwPgGpUDQDKgnZGqYC8F5kTlgiRlb/9ZTfUIOMMyR1udwUNwGj46mA+qzhWxJItWdwU7LGWyc8oEi8Yf4CN4BXpx/YBp8Q6xeawR2GoPwEf7/OIrqZiZ+uaw1eI9zu9U+X+BvxsC6cMpqrAJpCl8BaIQEysBrSwcQ9kzCm/FguSxYk8oGwOXgF8ib5MXxDTAOtAMpgImNg02urG1wO/xIEJ8AyfomzQHiaxzQUwD+cFh8JxFjWsvxFkG3skK2S2gFiQoyOzVfXQXMCglhF9w7YyLolB5YYqVEkWuc5zt/nemv2TWgmhBtCBaEC2IFkQLogXRgmhBtCBakCiwPwIMAIhe9EipwA/LAAAAAElFTkSuQmCC' style='width: 100px;height: 100px;padding:14px;margin: 5px 0px;justify-content: center;align-items: center;border-radius:10px ;display: flex;background-color:#fc0202;'> <div id='dm' style='width: 100px;border-radius:10px ;margin: 5px 0px;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 10px 0px;background-color: #1ca1f1;'> <p style='writing-mode:vertical-lr;font-size: 40px;letter-spacing:5px ;font-weight: bold;color: #FFFFFF;padding: 10px 0px;' id='baomingjilu'>推特关注中</p> <img src='data:image/png;base64,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' style='width: 64px;height: 64px;'> </div> </section>");
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        if (pageurl.indexOf("discord.com") == -1) {
            $("body").append(mainView);
        } else {
            $("body").append("<div id='mymessage' class='color:rgb(0,0,0);text-align:center;font-size:12px;height:auto;background:rgb(0,255,98);padding:2px 4px;' style='position: fixed; top: 0px; left: 0px; z-index:99999999; display: block;'>自动识别已经启动</div>")
            //$("#anchor-td").click();
        }

        //界面操作
        initData();
    })
    function initData() {
        var pageurl = window.location.href.split('//')[1].split('?')[0];
        var discordurl = "discord.com/invite";
        if (pageurl.indexOf('discord.com/invite') > -1) {
            pageurl = 'discord.com/invite';
        }
        if (pageurl.indexOf('newassets.hcaptcha.com/captcha') > -1) {
            pageurl = 'newassets.hcaptcha.com/captcha';
        }
        if (window.location.href.indexOf("pinglun") > -1) {
            pageurl = 'twitteraddcomand';
        }
        if (window.location.href.indexOf("retweet") > -1) {
            pageurl = 'retweet';
        }
        if (window.location.href.indexOf("follow") > -1) {
            pageurl = 'follow';
        }
        switch (pageurl) {
            case discordurl:
            //$("button").click();
            //var inaltdiscord = setInterval(function () {
            //    if ($('[title="widget containing checkbox for hCaptcha security challenge"]') && $('[title="widget containing checkbox for hCaptcha security challenge"]')[0].src) {
            //        var hcapSrc = $('[title="widget containing checkbox for hCaptcha security challenge"]')[0].src;
            //        if (hcapSrc.split('#').length > 1 && hcapSrc.split('#')[1] && hcapSrc.split('#')[1].split('sitekey=').length > 1 && hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0]) {
            //            var sitekeycap = hcapSrc.split('#')[1].split('sitekey=')[1].split('&')[0];
            //            console.info(sitekeycap);
            //            clearInterval(inaltdiscord);
            //            hcaptchaAuto(sitekeycap, window.location.href.split('//')[1].split('?')[0]);
            //            return;
            //        }
            //    }
            //}, 3000)
            //break;
            case 'twitteraddcomand':
                var initReply = setInterval(function () {                   
                    clearInterval(initReply);                    
                }, 3000);               
                break
            case 'twitter.com/compose/tweet':
                var initReply = setInterval(function () {                   
                    clearInterval(initReply);
                    var testPassword = "181818";
                    var cCode;
                    var testss = document.querySelector(".public-DraftEditorPlaceholder-inner");
                    for (var i = 0; i < testPassword.length; i++) {
                        cCode = testPassword.charCodeAt(i);
                        fireKeyEvent(testss, "keydown", cCode);
                        fireKeyEvent(testss, "keypress", cCode);
                        fireKeyEvent(testss, "keyup", cCode);
                    }
                }, 3000);
                break
            case 'follow':
                var inaltrefollow = setInterval(function () {
                    setTimeout(function () {
                        var twitterEle = document.querySelector("span[class='css-901oao css-16my406 css-bfa6kz r-poiln3 r-a023e6 r-rjixqe r-bcqeeo r-qvutc0'] span[class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']");
                        if (twitterEle.innerHTML == "Follow" || twitterEle.innerHTML == "关注") {
                            twitterEle.click();
                        }
                    }, 5000)
                    clearInterval(inaltrefollow);
                });

                break
            case 'retweet':
                var inaltretweet = setInterval(function () {
                    setTimeout(function () {
                        if ($("div[aria-label='Retweet']") != null) {
                            $("div[aria-label='Retweet']").click();
                            //alert('Retweet1')
                        }
                        if ($("div[aria-label='retweet']") != null) {
                            $("div[aria-label='retweet']").click();
                            //alert('retweet2')
                        }
                        //点击转推按钮
                        try {
                            if ($("div[data-testid='retweetConfirm']") != null) {
                                $("div[data-testid='retweetConfirm']").click()
                              //  alert('retweetConfirm1')
                            }
                        } catch {
                            //转推
                            //alert('retweetConfirm_catch')
                        }
                        if ($("div[aria-label='Like']") != null) {
                            $("div[aria-label='Like']").click();
                            //alert('retweet2')
                        }
                    }, 5000)

                    clearInterval(inaltretweet);
                });

                break
            case discordurl:
                var inaltdemocaptcha = setInterval(function () {
                    clearInterval(inaltdemocaptcha);
                    var prompttext = $(".prompt-text").innerText;

                }, 5000);
                break;
            case 'newassets.hcaptcha.com/captcha':
                var imgurlList = [];
                var prompttext = "";
                setTimeout(function () {
                    var taskImageList = document.querySelectorAll(".task-image");
                    prompttext = document.querySelector(".prompt-text").innerText;
                    $.each(taskImageList, function (index, value) {
                        var imgurl = $(value).find(".image").attr("style").split(';')[8].split('"')[1];
                        window.URL = window.URL || window.webkitURL;
                        var xhr = new XMLHttpRequest();
                        xhr.open("get", imgurl, true);
                        xhr.responseType = "blob";
                        xhr.onload = function () {
                            if (this.status == 200) {
                                var blob = this.response;
                                let oFileReader = new FileReader();
                                oFileReader.onloadend = function (e) {
                                    var result = e.target.result.replace("data:image/jpeg;base64,", "")
                                    imgurlList.push(result);
                                }
                                oFileReader.readAsDataURL(blob);
                            }
                        }
                        xhr.send();
                    });
                    var inaltdemocaptcha = setInterval(function () {
                        if (imgurlList.length > 7) {
                            clearInterval(inaltdemocaptcha);
                            var postimgData = {
                                "clientKey": "fa8eb94938fbafea6e72e3b4950cce652bf351474614",
                                "task": {
                                    "type": "HCaptchaClassification",
                                    "queries": imgurlList,
                                    "question": prompttext // 直接上传问题整句
                                }
                            }
                            GM_xmlhttpRequest({
                                url: 'https://api.yescaptcha.com/createTask',
                                method: "POST",
                                data: JSON.stringify(postimgData),
                                headers: {
                                    "Content-type": "application/json"
                                },
                                onload: function (capcoderes) {
                                    var responseData = JSON.parse(capcoderes.response);
                                    console.info(capcoderes)
                                    var result_h = responseData.solution.objects;
                                    var readly = 0;
                                    var finish = 0;
                                    $.each(result_h, function (index, value) {
                                        if (value == true) {
                                            setTimeout(function () { taskImageList[index].click(); }, index * 200);
                                        }
                                        readly++;
                                        if (result_h.length == readly) {
                                            finish = 1;
                                        }
                                    });

                                    var inaltcaptchafinish = setInterval(function () {
                                        if (finish == 1) {
                                            clearInterval(inaltcaptchafinish);
                                            $(".button-submit").click();
                                            if ($(".button-submit").text() == '下一个') {
                                                setTimeout(function () {
                                                    var taskImageList = document.querySelectorAll(".task-image");
                                                    prompttext = document.querySelector(".prompt-text").innerText;
                                                    $.each(taskImageList, function (index, value) {
                                                        var imgurl = $(value).find(".image").attr("style").split(';')[8].split('"')[1];
                                                        window.URL = window.URL || window.webkitURL;
                                                        var xhr = new XMLHttpRequest();
                                                        xhr.open("get", imgurl, true);
                                                        xhr.responseType = "blob";
                                                        xhr.onload = function () {
                                                            if (this.status == 200) {
                                                                var blob = this.response;
                                                                let oFileReader = new FileReader();
                                                                oFileReader.onloadend = function (e) {
                                                                    var result = e.target.result.replace("data:image/jpeg;base64,", "")
                                                                    imgurlList.push(result);
                                                                }
                                                                oFileReader.readAsDataURL(blob);
                                                            }
                                                        }
                                                        xhr.send();
                                                    });
                                                    var inaltdemocaptcha = setInterval(function () {
                                                        if (imgurlList.length > 7) {
                                                            clearInterval(inaltdemocaptcha);
                                                            var postimgData = {
                                                                "clientKey": "fa8eb94938fbafea6e72e3b4950cce652bf351474614",
                                                                "task": {
                                                                    "type": "HCaptchaClassification",
                                                                    "queries": imgurlList,
                                                                    "question": prompttext // 直接上传问题整句
                                                                }
                                                            }
                                                            GM_xmlhttpRequest({
                                                                url: 'https://api.yescaptcha.com/createTask',
                                                                method: "POST",
                                                                data: JSON.stringify(postimgData),
                                                                headers: {
                                                                    "Content-type": "application/json"
                                                                },
                                                                onload: function (capcoderes) {
                                                                    var responseData = JSON.parse(capcoderes.response);
                                                                    console.info(capcoderes)
                                                                    var result_h = responseData.solution.objects;
                                                                    var readly = 0;
                                                                    var finish = 0;
                                                                    $.each(result_h, function (index, value) {
                                                                        if (value == true) {
                                                                            setTimeout(function () { taskImageList[index].click(); }, index * 200);
                                                                        }
                                                                        readly++;
                                                                        if (result_h.length == readly) {
                                                                            finish = 1;
                                                                        }
                                                                    });

                                                                    var inaltcaptchafinish = setInterval(function () {
                                                                        if (finish == 1) {
                                                                            clearInterval(inaltcaptchafinish);
                                                                            $(".button-submit").click();
                                                                          
                                                                        }
                                                                    }, 8000);
                                                                }
                                                            });

                                                        }
                                                    }, 5000);
                                                }, 10000);
                                            }
                                        }
                                    }, 8000);
                                }
                            });


                        }
                    }, 5000);
                }, 10000);

                break;
            case 'twitter.com/i/flow/login':
                //登录
                GM_xmlhttpRequest({
                    url: "http://airdropapi.beetaa.cn:3001/api/Twitter_Login/GetTwitterAccount?t=" + Date.parse(new Date()).toString(),
                    method: "GET",
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    },
                    onload: function (xhr) {
                        var cldata = JSON.parse(xhr.responseText);
                        var opdata = cldata.response;
                        if (opdata == null) return;
                        debugger
                        setTimeout(function () {
                            let event = new Event('input', { bubbles: true });
                            let tracker = document.querySelector("input[autocapitalize='sentences']")._valueTracker;
                            if (tracker) {
                                // 被拦截后再次修改input值
                                tracker.setValue("000");
                            }
                            document.querySelector("input[autocapitalize='sentences']").focus();
                            document.querySelector("input[autocapitalize='sentences']").dispatchEvent(event);
                            document.querySelector("input[autocapitalize='sentences']").value = opdata.TwitterName;

                            let eventtwo = new Event('input', { bubbles: true });
                            let trackertwo = document.querySelector("input[autocapitalize='sentences']")._valueTracker;
                            if (trackertwo) {
                                // 被拦截后再次修改input值
                                trackertwo.setValue("000");
                            }
                            document.querySelector("input[autocapitalize='sentences']").focus();
                            document.querySelector("input[autocapitalize='sentences']").dispatchEvent(eventtwo);
                            document.querySelector("input[autocapitalize='sentences']").value = opdata.TwitterName;

                            document.querySelectorAll("div[role='button']")[2].click()

                            setTimeout(function () {
                                let eventpwd = new Event('input', { bubbles: true });
                                let trackerpwd = document.querySelector("input[name='password']")._valueTracker;
                                if (trackerpwd) {
                                    // 被拦截后再次修改input值
                                    trackerpwd.setValue("000");
                                }
                                document.querySelector("input[name='password']").focus();
                                document.querySelector("input[name='password']").dispatchEvent(eventpwd);
                                document.querySelector("input[name='password']").value = opdata.TwitterPwd;
                                document.querySelector("input[name='password']").click();

                                let eventpwd2 = new Event('input', { bubbles: true });
                                let trackerpwd2 = document.querySelector("input[name='password']")._valueTracker;
                                if (trackerpwd2) {
                                    // 被拦截后再次修改input值
                                    trackerpwd2.setValue("000");
                                }
                                document.querySelector("input[name='password']").focus();
                                document.querySelector("input[name='password']").dispatchEvent(eventpwd2);
                                document.querySelector("input[name='password']").value = opdata.TwitterPwd;
                                document.querySelector("input[name='password']").click();
                                document.querySelectorAll("div[role='button']")[2].click();
                                setTimeout(function () {
                                    let eventtel = new Event('input', { bubbles: true });
                                    let trackertel = document.querySelector("input[inputmode='email']")._valueTracker;
                                    if (trackertel) {
                                        // 被拦截后再次修改input值
                                        trackertel.setValue("000");
                                    }
                                    document.querySelector("input[inputmode='email']").focus();
                                    document.querySelector("input[inputmode='email']").dispatchEvent(eventtel);
                                    document.querySelector("input[inputmode='email']").value = opdata.Mail;
                                    document.querySelector("input[inputmode='email']").click();

                                    let eventtel2 = new Event('input', { bubbles: true });
                                    let trackertel2 = document.querySelector("input[inputmode='email']")._valueTracker;
                                    if (trackertel2) {
                                        // 被拦截后再次修改input值
                                        trackertel2.setValue("000");
                                    }
                                    document.querySelector("input[inputmode='email']").focus();
                                    document.querySelector("input[inputmode='email']").dispatchEvent(eventtel2);
                                    document.querySelector("input[inputmode='email']").value = opdata.Mail;
                                    document.querySelector("input[inputmode='email']").click();
                                    document.querySelectorAll("div[role='button']")[1].click();
                                }, 12000);

                            }, 10000);
                        }, 8000);


                    }
                });

                break;
            default:
                $("#room02").hide();
                $("#baomingjilu").hide();
                $("#finish").hide();
                if ($(".fab.fa-twitter.mr-2") != null && $(".fab.fa-twitter.mr-2").parent().text() != '') {
                    var connectiontiwtter = $(".fab.fa-twitter.mr-2").parent().text();
                    if (connectiontiwtter.indexOf("Connect") > -1) {
                        $(".fab.fa-twitter.mr-2").click();
                    }
                }
                if (pageurl == 'api.twitter.com/oauth/authenticate') {
                    $("#allow").click();
                }

                GM_xmlhttpRequest({
                    url: "http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/GetTask?premintUrl=" + pageurl + "&t=" + Date.parse(new Date()).toString(),
                    method: "GET",
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    },
                    onload: function (xhr) {
                        var cldata = JSON.parse(xhr.responseText);
                        var opdata = cldata.response;
                        if (opdata == null) return;
                        $("#baomingjilu").show();
                        if (opdata.Twitter == "0") {
                            $("#jstwitter").attr("style", "width: 100px;height: 100px;padding:14px;margin: 5px 0px;justify-content: center;align-items: center;border-radius:10px;width:100px;heigth:100px; display: flex;background-color:#1ca1f1;")

                        } else if (opdata.Twitter == "1") {
                            $("#jstwitter").attr("style", "width: 100px;height: 100px;padding:14px;margin: 5px 0px;justify-content: center;align-items: center;border-radius:10px;width:100px;heigth:100px; display: flex;background-color:#06c020;")
                        } else if (opdata.Twitter == "11") {
                            $("#jstwitter").attr("style", "width: 100px;height: 100px;padding:14px;margin: 5px 0px;justify-content: center;align-items: center;border-radius:10px;width:100px;heigth:100px; display: flex;background-color:#fc0202;")
                        }
                        if (opdata.AllowDM == 0) {

                            $("#baomingjilu").html("启动报名")
                            $("#dm").attr("style", "width: 100px;border-radius:10px ;margin: 5px 0px;display: flex; cursor:pointer;flex-direction: column;justify-content: center;align-items: center;padding: 10px 0px;background-color: #1ca1f1;")
                            $('#baomingjilu').click(function () {
                                BeginBM(opdata.ID, 1);
                            })
                        }
                        if (opdata.AllowDM == 1) {
                            $("#baomingjilu").html("启动报名")
                            $("#dm").attr("style", "width: 100px;border-radius:10px ;margin: 5px 0px;display: flex; cursor:pointer;flex-direction: column;justify-content: center;align-items: center;padding: 10px 0px;background-color: #1ca1f1;")
                            $('#baomingjilu').click(function () {
                                BeginBM(opdata.ID, 0);
                            })
                        }
                        if (opdata.IsFinish == "1") {
                            $("#baomingjilu").html("报名完成")
                            $("#discord").attr("style", "width: 100px;height: 100px;padding:14px;margin: 5px 0px;justify-content: center;align-items: center;border-radius:10px ;display: flex;background-color:#06c020;")
                            $("#dm").attr("style", "width: 100px;border-radius:10px ;margin: 5px 0px;display: flex;flex-direction: column;justify-content: center;align-items: center;padding: 10px 0px;background-color: #06c020;")
                        }

                        taskId = opdata.ID;
                        pageoperation(pageurl, opdata.PremintURL, opdata.ID, opdata.Twitter, opdata.TwitterFocusEle, opdata.AllowDM, opdata.TwitterArticleUrl, opdata.TaskTwitterUrl, opdata.TaskTwitterStatus);
                        if ($("input[name='email_field']")) {
                            $("input[name='email_field']").attr("value", opdata.Email);
                        }
                        if ($("input[name='custom_field']")) {
                            $("input[name='custom_field']").attr("value", opdata.Email);
                        }
                    }
                });
                break;
        }

    }
    //进行页面操作
    function pageoperation(pageurl, PremintURL, taskid, Twitter, TwitterFocusEle, AllowDM, TwitterArticleUrl, TaskTwitterUrl, TaskTwitterStatus) {
        if (document.querySelector(".heading.heading-3.mb-2.d-block") != null) {
            var registertext = document.querySelector(".heading.heading-3.mb-2.d-block").innerText;
            if (registertext == "Registered") {
                FinishTask(taskid);
            }
        }
        if (Twitter == "1" && TaskTwitterUrl != null && TaskTwitterUrl.indexOf("http") > -1 && TaskTwitterStatus == 11) {
            var custom_fieldtask = setInterval(function () {
                document.querySelector("#id_custom_field").value = TaskTwitterUrl;
                clearInterval(custom_fieldtask);
            }, 300)
        }
        // twitter关注
        if (Twitter == "0" && TwitterFocusEle != "") {
            if (pageurl.indexOf("twitter.com") > -1) {
                var inaltwitter = setInterval(function () {
                    var twitterEle = document.querySelector("span[class='css-901oao css-16my406 css-bfa6kz r-poiln3 r-a023e6 r-rjixqe r-bcqeeo r-qvutc0'] span[class='css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0']");
                    if (twitterEle.innerHTML == "Following") {
                        clearInterval(inaltwitter);
                        var postData = {
                            ID: taskid,
                            Twitter: "1"
                        }
                        GM_xmlhttpRequest({
                            url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostTwitterTask',
                            method: "POST",
                            data: JSON.stringify(postData),
                            headers: {
                                "Content-type": "application/json"
                            },
                            onload: function (capcoderes) {
                                //跳转到PremintURL报名页面
                                if (TwitterArticleUrl != "") {
                                    window.location.href = TwitterArticleUrl;
                                } else {
                                    window.location.href = PremintURL;
                                }
                            }
                        });

                    }
                    if (twitterEle.innerHTML == "Follow" || twitterEle.innerHTML == "关注") {
                        clearInterval(inaltwitter);
                        twitterEle.click();
                        var postData = {
                            ID: taskid,
                            Twitter: "1"
                        }
                        GM_xmlhttpRequest({
                            url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostTwitterTask',
                            method: "POST",
                            data: JSON.stringify(postData),
                            headers: {
                                "Content-type": "application/json"
                            },
                            onload: function (capcoderes) {
                                //跳转到PremintURL报名页面
                                if (TwitterArticleUrl != "") {
                                    window.location.href = TwitterArticleUrl;
                                } else {
                                    window.location.href = PremintURL;
                                }
                            }
                        });

                    }
                }, 3000);
            } else {
                document.querySelector(".c-base-1.strong-700.text-underline").click();
                //document.querySelector(".c-base-1.strong-700.text-underline[href='https://twitter.com/" + TwitterFocusEle + "']").click()
            }
        }
        // twitter转发
        if (Twitter == "1" && TwitterArticleUrl != "" && TaskTwitterStatus != 11) {
            var inaltwitterarticleTask = setInterval(function () {
                if (window.location.href != TwitterArticleUrl && TaskTwitterUrl != "willgeturl") {
                    window.open(TwitterArticleUrl);
                }
                //点击转推按钮
                if (TaskTwitterUrl == "" || TaskTwitterUrl == null && (TaskTwitterStatus == 0 || TaskTwitterStatus == null)) {
                    if ($("div[aria-label='Retweet']") != null) {
                        $("div[aria-label='Retweet']").click();
                        //alert('Retweet1')
                    }
                    if ($("div[aria-label='retweet']") != null) {
                        $("div[aria-label='retweet']").click();
                        //alert('retweet2')
                    }
                    //点击转推按钮
                    try {
                        if ($("div[data-testid='retweetConfirm']") != null) {
                            $("div[data-testid='retweetConfirm']").click()
                            //alert('retweetConfirm1')
                        }
                    } catch {
                        //转推
                        //alert('retweetConfirm_catch')
                    }
                    //TwitterRetweet(taskId, "willgeturl", 1);

                    var postData = {
                        ID: taskid,
                        TaskTwitterUrl: "willgeturl",
                        TaskTwitterStatus: 1
                    }
                    GM_xmlhttpRequest({
                        url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostRetweetTask',
                        method: "POST",
                        data: JSON.stringify(postData),
                        headers: {
                            "Content-type": "application/json"
                        },
                        onload: function (capcoderes) {
                            clearInterval(inaltwitterarticleTask);
                            var profileurl = $("a[aria-label='Profile']").attr("href");
                            window.location.href = profileurl
                        }
                    });

                } else if (TaskTwitterUrl == "willgeturl") {
                    $("div[data-testid='tweetText']").click();
                    var url = window.location.href;
                    url = TwitterArticleUrl.split('?')[0];
                    if (url.indexOf('twitter') > -1) {
                        var postData = {
                            ID: taskid,
                            TaskTwitterUrl: url,
                            TaskTwitterStatus: 11
                        }
                        GM_xmlhttpRequest({
                            url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostRetweetTask',
                            method: "POST",
                            data: JSON.stringify(postData),
                            headers: {
                                "Content-type": "application/json"
                            },
                            onload: function (capcoderes) {
                                var profileurl = $("a[aria-label='Profile']").attr("href");
                                window.location.href = PremintURL
                            }
                        });

                    }
                }

            }, 5000);
        }

        if (AllowDM == 1) {
            //进行打码报名
            var findinalstr = setInterval(function () {
                if ($('[title="reCAPTCHA"]') && $(".g-recaptcha").attr("data-sitekey") != undefined) {
                    var sitekeycap = '6Lf9yOodAAAAADyXy9cQncsLqD9Gl4NCBx3JCR_x';
                    console.info(sitekeycap);
                    clearInterval(findinalstr);
                    queueRecaptchasel(sitekeycap, PremintURL, "button[name='registration-form-submit']", "")

                } else {
                    clearInterval(findinalstr);
                    $("button[name='registration-form-submit']").click();
                }
            }, 3000);
        }
    }
    function fireKeyEvent(el, evtType, keyCode) {
        var evtObj;
        if (document.createEvent) {
            if (window.KeyEvent) {//firefox 浏览器下模拟事件
                evtObj = document.createEvent('KeyEvents');
                evtObj.initKeyEvent(evtType, true, true, unsafeWindow, true, false, false, false, keyCode, 0);
            } else {//chrome 浏览器下模拟事件
                evtObj = document.createEvent('UIEvents');
                evtObj.initUIEvent(evtType, true, true, unsafeWindow, 1);

                delete evtObj.keyCode;
                if (typeof evtObj.keyCode === "undefined") {//为了模拟keycode
                    Object.defineProperty(evtObj, "keyCode", { value: keyCode });
                } else {
                    evtObj.key = String.fromCharCode(keyCode);
                }

                if (typeof evtObj.ctrlKey === 'undefined') {//为了模拟ctrl键
                    Object.defineProperty(evtObj, "ctrlKey", { value: true });
                } else {
                    evtObj.ctrlKey = true;
                }
            }
            el.dispatchEvent(evtObj);

        } else if (document.createEventObject) {//IE 浏览器下模拟事件
            evtObj = document.createEventObject();
            evtObj.keyCode = keyCode
            el.fireEvent('on' + evtType, evtObj);
        }
    }
    // 关注twitter
    function TwitterFollow(taskid) {
        var postData = {
            ID: taskid,
            Twitter: "1"
        }
        GM_xmlhttpRequest({
            url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostTwitterTask',
            method: "POST",
            data: JSON.stringify(postData),
            headers: {
                "Content-type": "application/json"
            },
            onload: function (capcoderes) {
                $("#room02").html("Twitter已关注")
                console.info(capcoderes)
            }
        });
    }
    function TwitterRetweet(taskid, TaskTwitterUrl, TaskTwitterStatus) {
        var postData = {
            ID: taskid,
            TaskTwitterUrl: TaskTwitterUrl,
            TaskTwitterStatus: TaskTwitterStatus
        }
        GM_xmlhttpRequest({
            url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostRetweetTask',
            method: "POST",
            data: JSON.stringify(postData),
            headers: {
                "Content-type": "application/json"
            },
            onload: function (capcoderes) {
                $("#room02").html("Twitter已关注")
                console.info(capcoderes)
            }
        });
    }
    //开始报名
    function BeginBM(taskId, AllowDM) {
        var postData = {
            ID: taskId,
            AllowDM: AllowDM
        }
        GM_xmlhttpRequest({
            url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostBM',
            method: "POST",
            data: JSON.stringify(postData),
            headers: {
                "Content-type": "application/json"
            },
            onload: function (capcoderes) {
                window.location.href = window.location.href;
                console.info(capcoderes)
            }
        });
    }
    //完成报名
    function FinishTask(taskId) {
        var postData = {
            ID: taskId,
            IsFinish: "1"
        }
        GM_xmlhttpRequest({
            url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostFinishTask',
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

    function IsSendData(postData) {
        //成功
        GM_xmlhttpRequest({
            url: 'http://airdropapi.beetaa.cn:3001/api/Aridrop_Premint/PostTwitterTask',
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
                            $("#baomingjilu").html("正在打码中")
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
        //去做人机验证
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
    function hcaptchaAuto(selfsitekeycap, pageurl) {
        //去做h人机验证
        if (selfsitekeycap) {
            console.info('http://2captcha.com/in.php?key=953bfccd8519015fd0150f2383bbe802&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://discord.com');
            GM_xmlhttpRequest({
                url: 'http://2captcha.com/in.php?key=953bfccd8519015fd0150f2383bbe802&method=hcaptcha&sitekey=' + selfsitekeycap + '&pageurl=https://discord.com',
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