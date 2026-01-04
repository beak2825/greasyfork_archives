// ==UserScript==
// @name         雨课堂题目提醒，腾讯课堂签到提醒
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  雨课堂题目检测，课堂答题后返回正确答案，腾讯课堂检测签到，弹窗提醒（所有提醒浏览器最小化也会生效）。禁止网页通知的刷新页面会重新要求权限，还不行可以自行百度“网页通知权限”。
// @author       bzg
// @match          *://*.yuketang.cn/*
// @match	       *://ke.qq.com/webcourse*
// @grant	       GM_getValue
// @grant	       GM_setValue
// @grant	       GM_registerMenuCommand
// @grant	       GM_addStyle
// @grant	       GM.setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442064/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%A2%98%E7%9B%AE%E6%8F%90%E9%86%92%EF%BC%8C%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E7%AD%BE%E5%88%B0%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/442064/%E9%9B%A8%E8%AF%BE%E5%A0%82%E9%A2%98%E7%9B%AE%E6%8F%90%E9%86%92%EF%BC%8C%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E7%AD%BE%E5%88%B0%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==
(function() {
    'use strict';
    GM_registerMenuCommand("查看已提醒次数", function() {
        alert("已提醒次数：" + (GM_getValue("remind_times") || 0))
    });
    // let tag = document.createElement('div');
    // tag.id = "myDiv";
    // tag.innerHTML = `<div style="height: 100px; width: 100px;background: blue;top: 0px;"><p>test</p></div>`;
    // document.body.appendChild(tag);

    var status = true,
        shine = false,
        titleInit = "课堂"
    window.onload = function() {
        titleInit = document.title
        // 判断是否支持提醒
        if (window.Notification) {
            var permission = Notification.permission;
            if (permission === 'granted') {} else {
                Notification.requestPermission().then(function(permission) {
                    console.log('用户是否允许通知： ', permission === 'granted' ? '允许' : '拒绝');
                });
            }
        } else {
            alert('你的浏览器不支持此消息提示功能，请使用chrome内核的浏览器！')
        }
        if (location.href.match(/ke.qq.com/)) {
            tencent_course();
        }
        if (location.href.match(/yuketang.cn/)) {
            rainingRoom();
        }
    }
    window.onfocus = function() {
        status = false;
        shine = false;
    };
    window.onblur = function() {
        status = true;
        shine = true;
        document.title = titleInit;
    };
    // for IE
    document.onfocusin = function() {
        status = false;
        shine = false;
    };
    document.onfocusout = function() {
        status = true;
        shine = true;
        document.title = titleInit;
    };
    //腾讯课堂签到
    function tencent_course() {
        var tencent_monitor = setInterval(function test() {
            var tencent_node = document.getElementsByClassName("sign-dialog")
            if (!tencent_node.length) {
                // console.log("no sign")
                return;
            }
            // 标签闪动
            if (shine) {
                var title = document.title;
                if (/HXDM/.test(title) === false) {
                    document.title = '【HXDM】';
                } else {
                    document.title = '【come back】';
                }
            }
            // 腾讯课堂签到提醒
            if (status) {
                var sign_notice = new Notification('腾讯课堂', {
                    body: "hxdm，签到了！！！",
                    icon: "https://lh3.googleusercontent.com/proxy/N6c9yyNg5g3Si-bkRNwbWt6FxVK-Xmra7uuqgHHwEiqrJb0xQc6pMLEH_SGOxwRDhxkB5XbekwR-i5ng1XORK13TCjk1il2uu5mx_gUZce867N5Rjis_"
                });
                sign_notice.onerror = function(err) {
                    alert("显示通知出错，请认真听课！！！", err)
                    console.log(err);
                };
                GM_setValue('remind_times', (GM_getValue('remind_times') || 0) + 1);
                status = false
                console.log("HXDM", GM_getValue('remind_times'))
            }
        }, 1000)
    }
    // 雨课堂题目提醒
    function rainingRoom() {
        var raining_monitor = setInterval(function test() {
            // 三层保险
            var rain_1 = document.getElementsByClassName("pl10 f16 cfff")
            var rain_2 = document.getElementsByClassName("box-start")
            var rain_3 = document.getElementsByClassName("submit-btn f18").length != 0 ? document.getElementsByClassName("submit-btn f18")[0] : { innerHTML: "none" }
            // 标签闪动
            if ((rain_1.length || rain_2.length || rain_3.innerHTML == "提交答案") && shine) {
                var title = document.title;
                if (/HXDM/.test(title) === false) {
                    document.title = '【HXDM】';
                } else {
                    document.title = '【come back】';
                }
            } else {
                return;
            }
            // 雨课堂做题提醒
            if (status) {
                var notification = new Notification('雨课堂', {
                    body: "hxdm，有习题！！！",
                    icon: "https://lh3.googleusercontent.com/proxy/N6c9yyNg5g3Si-bkRNwbWt6FxVK-Xmra7uuqgHHwEiqrJb0xQc6pMLEH_SGOxwRDhxkB5XbekwR-i5ng1XORK13TCjk1il2uu5mx_gUZce867N5Rjis_"
                });
                notification.onclick = function() {
                    console.log('onclick');
                };
                notification.onerror = function(err) {
                    alert("显示通知出错，请认真听课！！！", err)
                    console.log(err);
                };
                notification.onclose = function() {
                    console.log("close")
                }
                GM_setValue('remind_times', (GM_getValue('remind_times') || 0) + 1);
                console.log("HXDM", GM_getValue('remind_times'))
                status = false
            }
        }, 1000)
        XMLHttpRequest.prototype.send = new Proxy(XMLHttpRequest.prototype.send, {
            "apply": (target, thisArg, args) => {
                thisArg.addEventListener(
                    "load", event => {
                        const result = JSON.parse(event.target.responseText);
                        // console.log("this:", result.data.answer)
                        if (!result.data) { return; }
                        if (result.data.answer) {
                            var answer = result.data.answer,
                                temp = [],
                                temp2 = ""
                            if (typeof(answer) == "object") {
                                temp = answer;
                                answer = "";
                                for (var i = 0, len = Object.keys(temp).length, key = Object.keys(temp); i < len; i++) {
                                    for (var j = 0, len2 = temp[key[i]].length; j < len2; j++) {
                                        temp2 = temp2 + temp[key[i]][j] + "/"
                                        console.log(temp2)
                                    }
                                    answer = answer + '_' + (i + 1) + '_' + temp2
                                    // console.log(temp[key[i]].length,answer, temp2)
                                    temp2 = ""
                                }
                            }
                            // console.log(answer)
                            if (confirm(`正确答案是【${answer}】，得分【${result.data.score}】,是否复制正确答案？`)) {
                                GM.setClipboard(answer);
                                // var textArea = document.createElement('textarea');
                                // textArea.style.position = 'fixed';
                                // textArea.style.top = '10000000px';
                                // textArea.value = answer;
                                // document.body.appendChild(textArea);
                                // textArea.select();
                                // try {
                                //     document.execCommand('copy');
                                // } catch (err) {
                                //     alert('该浏览器不支持点击复制到剪贴板');
                                // }
                                // document.body.removeChild(textArea);
                            }
                        }
                    })
                return target.apply(thisArg, args);
            }
        })
    }
    // Your code here...
})();