// ==UserScript==
// @name         JLPT 捡漏
// @version      1.0
// @namespace    https://github.com/Konano
// @description  一个辅助 JLPT 考场捡漏的小工具
// @author       Konano
// @match        https://jlpt.neea.edu.cn/index.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432278/JLPT%20%E6%8D%A1%E6%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/432278/JLPT%20%E6%8D%A1%E6%BC%8F.meta.js
// ==/UserScript==

function script() {
    // 填写想要捡漏的学校考场
    var monitorSchool = ["清华大学", "北京大学"];
    // 预定前是否需要确认学校信息
    var needConfirm = false;
    // 是否加快刷新频率
    var speedUp = true;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    var chkStatus = 0;
    var initStatus = 0;

    function initChkImg() {
        var selectorinputChk = "#chooseaddrForm > table:nth-child(1) > tbody > tr:nth-child(2) > td.inputChk > img";
        var selectorvalueChk = "#chooseaddrForm > table:nth-child(1) > tbody > tr:nth-child(2) > td.inputChk > input[type=text]:nth-child(2)";
        var chkImg = document.querySelector(selectorinputChk);
        var chkImgCode = document.querySelector(selectorvalueChk);
        if (initStatus == 0) {
            initStatus = 1;
            chkImg.height *= 3;
            chkImg.width *= 3;
            chkImg.addEventListener('load', async function(e) {
                if (chkStatus == 1) {
                    await sleep(200);
                    if (chkStatus == 1) {
                        chkStatus = 9;
                        chkImgCode.value = prompt('验证码');
                        if (chkImgCode.value != '') {
                            chkStatus = 0;
                        } else {
                            chkStatus = -1;
                        }
                    }
                }
            }, true);
        }
    }

    function getChkimgAjax(c) {
        cache.redo = null;
        cache.cancel = function() {
            if (user.get("step") == "register") {
                gotoStep("agreement")
            }
        }
        ;
        var e = c;
        setChangeImgLink(e, false);
        c = $(c);
        var b = getURL("chkImg.do");
        var d = c.getElementsBySelector("input[name='chkImgCode']")[0];
        var f = c.getElementsBySelector("[name='chkImg']")[0];
        var a = user.get("chkImgFlag");
        if (!a) {
            a = generateRandomFlag(18);
            user.set("chkImgFlag", a)
        }
        new Ajax.Request(b,{
            method: "post",
            parameters: "chkImgFlag=" + a,
            requestHeaders: {
                RequestType: "ajax"
            },
            onSuccess: function(g) {
                var h = g.responseJSON;
                if (h == null) {
                    g.request.options.onFailure();
                    return
                }
                if (!h.retVal) {
                    processError(h.errorNum);
                    return
                }
                user.set("chkImgSrc", h.chkImgFilename);
                d.value = "";
                setChkimg(c);
                setChangeImgLink(e, true)
            },
            onFailure: function(g) {
                setChangeImgLink(e, true)
            }
        })
    }

    function processError(a) {
        var c;
        if (cache["getMsg" + a]) {
            c = cache["getMsg" + a];
            cache["getMsg" + a] = null
        }
        var b;
        if (cache["remainAction" + a]) {
            b = cache["remainAction" + a];
            cache["remainAction" + a] = null
        }
        var d;
        if (cache["getTickMsg" + a]) {
            d = cache["getTickMsg" + a];
            cache["getTickMsg" + a] = null
        }
        if (!c) {
            c = function() {
                return errorCode[a]
            }
        }
        if (layer) {
            layer.setMsg(c(a))
        }
        console.log('Error Code', a);
        if (a == 101 || a == 102 || a == 303 || a == 315 || a == 316 || a == 310) {
            if (!b) {
                b = function() {
                    gotoStep("login")
                }
            }
            layer.show();
            layer.setTickMsg(1, b, d);
            return
        }
        if (a >= 200 && a <= 206 || a >= 300 && a <= 317) {
            if (!b) {
                b = function() {
                    cancel()
                }
            }
            if (a == 313) chkStatus = -9; else chkStatus = -4;
            if (layer) {
                layer.hide()
            }
            b();
            return
        }
        if (!b) {
            b = dispatch
        }
        if (layer) {
            layer.show();
            chkStatus = -3;
            cancel();
        }
    }

    function bookseat(c, b, a) {
        c = $(c);
        var d = c.getElementsBySelector("[name='chkImgCode']")[0];
        if (checkIsInValid(checkIsNull, d, function() {
            alert("请输入验证码")
        })) {
            return
        }
        user.set("bkkd", b);
        if (needConfirm && !confirm("您所选择的考试级别为：" + LevelName[user.get("bkjb")] + "，考试地点为：" + a)) {
            return
        }
        cache.redo = function() {
            bookseat(c, b, a)
        }
        ;
        cache.cancel = null;
        if (user.get("isChangeKD") == 0) {
            new Ajax.Request(getURL("book.do"),{
                method: "post",
                requestHeaders: {
                    RequestType: "ajax"
                },
                parameters: serializeUser(["bkjb", "bkkd", "ksid", "ksIdNo", "chkImgFlag", "ksLoginFlag"]) + "&chkImgCode=" + $F(d),
                onCreate: function() {
                    layer.show();
                    chkStatus = 3;
                    layer.setTitle("定座");
                    layer.setMsg("定座请求发送中...");
                    layer.showLoading()
                },
                onSuccess: function(e) {
                    var h = e.responseJSON;
                    if (h == null) {
                        e.request.options.onFailure();
                        return
                    }
                    clearChkimgCache();
                    if (h.retVal == 0) {
                        cache.remainAction304 = function() {
                            gotoStep("status")
                        }
                        ;
                        function i() {
                            getChkimg("chooseaddrDiv")
                        }
                        cache.remainAction305 = i;
                        cache.remainAction306 = i;
                        cache.remainAction313 = i;
                        processError(h.errorNum);
                        return
                    }
                    var g = getURL("queryBook.do");
                    var k = serializeUser(["ksid", "ksIdNo", "ksLoginFlag"]);
                    var j = 10;
                    var f = function() {
                        new Ajax.Request(g,{
                            method: "post",
                            requestHeaders: {
                                RequestType: "ajax"
                            },
                            parameters: k,
                            onCreate: function() {
                                layer.setMsg("定座请求结果查询中...")
                            },
                            onSuccess: function(l) {
                                var m = l.responseJSON;
                                if (m == null) {
                                    l.request.options.onFailure();
                                    return
                                }
                                if (m.retVal == 0) {
                                    cache.getTickMsg310 = function(o, n) {
                                        return ""
                                    }
                                    ;
                                    cache.remainAction310 = f;
                                    cache.remainAction304 = function() {
                                        gotoStep("status")
                                    }
                                    ;
                                    processError(m.errorNum)
                                } else {
                                    updateUser(m);
                                    layer.setMsg("预定座位成功");
                                    chkStatus = -2;
                                    layer.setTickMsg(3, dispatch)
                                }
                            },
                            onFailure: function() {
                                if (--j <= 0) {
                                    cache.getMsg317 = function() {
                                        return "查询错误次数过多"
                                    }
                                    ;
                                    processError(317)
                                } else {
                                    cache.getTickMsg316 = function(m, l) {
                                        return (l - m) + "秒后重试..."
                                    }
                                    ;
                                    cache.remainAction316 = f;
                                    j = 10;
                                    processError(316)
                                }
                            }
                        })
                    };
                    f()
                },
                onFailure: function() {
                    processError(100)
                }
            })
        } else {
            new Ajax.Request(getURL("changebook.do"),{
                method: "post",
                requestHeaders: {
                    RequestType: "ajax"
                },
                parameters: serializeUser(["bkjb", "bkkd", "ksid", "ksIdNo", "chkImgFlag", "ksLoginFlag"]) + "&chkImgCode=" + $F(d),
                onCreate: function() {
                    layer.show();
                    layer.setTitle("更改考点");
                    layer.setMsg("更改考点请求发送中...");
                    layer.showLoading()
                },
                onSuccess: function(e) {
                    var f = e.responseJSON;
                    if (f == null) {
                        e.request.options.onFailure();
                        return
                    }
                    clearChkimgCache();
                    if (f.retVal == 0) {
                        processError(f.errorNum);
                        return
                    }
                    layer.setMsg("更改考点成功");
                    chkStatus = -2;
                    layer.setTickMsg(3, dispatch)
                },
                onFailure: function() {
                    processError(100)
                }
            })
        }
    }

    var availableSchool = [];

    function getInfo() {
        cache.redo = getInfo;
        cache.cancel = null;
        new Ajax.Request("chooseAddr.do?bkjb=" + user.get("bkjb"),{
            method: "get",
            requestHeaders: {
                RequestType: "ajax"
            },
            onCreate: function() {
                layer.show();
                layer.setTitle("选择考点");
                layer.setMsg("页面载入中");
                layer.showLoading()
            },
            onSuccess: function(originalRequest) {
                var jsonObj = eval(originalRequest.responseText);
                if (jsonObj == null) {
                    originalRequest.request.options.onFailure();
                    return
                }
                availableSchool = jsonObj.filter(x => monitorSchool.includes(x.mc) && x.vacancy != 0);
                layer.hide();
            },
            onFailure: function(originalRequest) {
                processError(100)
            }
        })
    }

    async function monitorState() {
        sleep(3000);
        initChkImg();
        chkStatus = 0;
        while (true) {

            // 验证码
            chkStatus = 1;
            getChkimgAjax('chooseaddrDiv');
            while (chkStatus == 1 || chkStatus == 9) { await sleep(10); }
            console.log('Captcha', chkStatus);
            if (chkStatus == -1) break;

            // 监控是否可预订
            while (availableSchool.length == 0) {
                chkStatus = 0;
                getInfo();
                await sleep(100);
                while (layer.visible() && chkStatus == 0) { await sleep(10); }
                if (speedUp) {
                    await sleep(50);
                } else {
                    await sleep(1000);
                }
            }
            console.log('Available', availableSchool);
            var schoolID = availableSchool[0].id;
            var schoolName = availableSchool[0].mc;

            // 预定
            chkStatus = 2;
            bookseat('chooseaddrForm',schoolID,schoolName);
            while (chkStatus == 2) { await sleep(10); }
            while (layer.visible() && chkStatus == 3) { await sleep(10); }
            console.log('Booked', chkStatus);
            if (chkStatus == -2) break;
            if (chkStatus == -3) break;
            if (chkStatus == -4) continue;
            if (chkStatus == -9) {
                availableSchool = [];  // 该考场已无座位
                continue;
            }
        }
    }
}

(function() {
    'use strict';
    if (document.querySelector("#chooseaddrDiv > div.sectiontitle").innerHTML == "选择考点") {
        document.head.appendChild(document.createElement('script')).innerHTML = script.toString().replace(/^function.*{|}$/g, '');
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "捡漏");
        button.setAttribute("onclick", "monitorState()");
        document.querySelector("#kdTable > tbody > tr:nth-child(1) > th").appendChild(button);
    }
})();