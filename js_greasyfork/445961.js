// ==UserScript==
// @name         Digit77 Helper
// @namespace    cn.XYZliang.digit77Helper
// @version      2.3
// @description  Digit77下载助手。自动复制提取码，跳过ouo.io的三秒等待时间！
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.slim.min.js
// @license      GNU General Public License v3.0
// @author       XYZliang
// @supportURL   https://qianniuossplus.jxufesoftware.club/README.html
// @homepage     https://greasyfork.org/zh-CN/scripts/445961-digit77-helper
// @match        *://www.digit77.com/*
// @match        *://ouo.press/*
// @match        *://ouo.io/*
// @match        *://app.mediatrack.cn/shares/*
// @match        *://app.mediatrack.cn/shares/*
// @match        *://download.kstore.space/download/2078/Digit77Helper/*
// @match        *://*.sharepoint.com/*
// @match        *://www.aliyundrive.com/*
// @match        *://cloud.189.cn/*
// @match        *://*.jxufesoftware.club/*
// @match        *://www.wulihub.com.cn/gc/JPKAvA/*
// @icon         https://www.digit77.com/lib/img/logo.svg
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-end
// @connect      *

// @downloadURL https://update.greasyfork.org/scripts/445961/Digit77%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/445961/Digit77%20Helper.meta.js
// ==/UserScript==
/* globals jQuery, $ */

// 用户设置
let seeting = GM_getValue("seeting")
if (seeting == null || seeting.length == 0 || seeting == undefined || seeting) {
    seeting = "{\"autofill\":true,\"ouo\":true,\"unzip\":true,\"fenmiaozhen\":true,\"baidu\":true,\"onedriver\":true,\"tianyi\":true,\"aliyun\":true,\"error\":true,\"fmzautofill\":true,\"fmzautodown\":true,\"fmzautofav\":false,\"fmzautosave\":false,\"bdautofill\":true,\"bdautodown\":true,\"bdautosave\":false,\"odautofill\":true,\"odautodown\":false,\"tyautofill\":true,\"tyautodown\":true,\"tyautosave\":false,\"alautofill\":true,\"alautodown\":true,\"alautosave\":false}"
    GM_setValue("seeting", seeting)
}
seeting = JSON.parse(seeting)
let values = GM_listValues()
if (values.length > 200) {
    for (let i = 0; i < values.length; i++) {
        if (values[i] != "seeting") {
            GM_deleteValue(values[i])
        }
    }
    consoleLog("已自动清除缓存！")
}
// 脚本代码
'use strict';
let url = location.host;
consoleLog("Digit77 Helper 加载成功！")
if (url == "www.digit77.com" && seeting.autofill) {
    if ($("#history_version details").length > 0) {
        $("#history_version th")[2].innerText = "下载链接（已开启Digit77 Helper自动复制提取码）"
        $("#history_version a").each(function () {
            let codeText = this.innerHTML;
            let code = codeText.split(" ")[1]
            if (code != undefined) {
                let ouoLinkCode = (this.href).split("/")
                GM_setValue(ouoLinkCode[ouoLinkCode.length - 1], code);
                // this.addEventListener('click', function () {
                //     let text=code
                //     GM_setClipboard(text)
                // });
            }
        })
        let frontElement = $("#history_version details")[0]
        let insertHtml = '<details style="margin-top: 20px;">' +
            '<summary style="background-color: crimson;">Digit77 Helper设置</summary>' +
            ' <div class="table-wrapper" style="padding-right: 10px;overflow-x: hidden;">' +
            '<iframe src="https://download.kstore.space/download/2078/Digit77Helper/index.html" style="border: 5px solid #e835351a;border-radius: 10px;width: 100%;height: 400px;overflow-x: hidden;">' +
            '</iframe></div>' +
            '</details>'
        frontElement.insertAdjacentHTML('afterend', insertHtml);
    }
} else if (url.indexOf("ouo") != -1 && seeting.ouo) {
    consoleLog("正在跳过ouo")
    $(document).ready(function () {
        $("h4").innerText = "Digit77 Help正在跳过等待！"
        $(".btn-main").innerText = "欢迎使用Digit77 Helper"
    })
    if (location.pathname.split("/")[1] == "go") {
        let reallyUrlGeter = location.origin + "/xreallcygo/" + location.pathname.split("/")[2]
        let reallyUrlData = $("#form-go").serializeArray()
        GM_xmlhttpRequest({
            method: "POST",
            url: reallyUrlGeter,
            data: $.param(reallyUrlData),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            },
            onload: function (response) {
                let url = addGetParameter(response.finalUrl, "Digit77HelperPwd", GM_getValue(location.pathname.split("/")[2]))
                if (response.status == 200) {
                    //延长一下待在页面的时间，提升广告的佣金？
                    setTimeout(function () {
                        window.location.href = url
                    }, 1000)
                } else {
                    failedToGetJumpAddress(GM_getValue(location.pathname.split("/")[2]))
                }
            },
            onerror: function () {
                failedToGetJumpAddress(GM_getValue(location.pathname.split("/")[2]))
            }
        });
    } else {
        //延长一下待在页面的时间，提升广告的佣金？
        setTimeout(function () {
            $(".btn-main").click()
        }, 1500)
    }
} else if (url == "app.mediatrack.cn" && seeting.fenmiaozhen) {
    let pass = getUrlParam("Digit77HelperPwd")
    if ((pass != null || pass != "") && seeting.fmzautofill) {
        let code = (location.pathname).split("/")[2]
        let keyName = "mtweb_" + code + "password"
        let extractCodeThere = false
        if (localStorage.getItem(keyName) != null) {
            extractCodeThere = true
            consoleLog("提取码存在！延期提取码。")
        } else {
            extractCodeThere = false
            consoleLog("提取码不存在！注入提取码。")
        }
        //{"value":"9742","options":{"seconds":86400},"expiredAt":1654346827431,"createAt":1654260427431}
        let now = new Date().getTime()
        let expiredTime = 24 * 60 * 60
        let codeValue = {
            "value": pass,
            "options": {
                "seconds": expiredTime
            },
            "expiredAt": now + expiredTime * 1000,
            "createAt": now
        }
        window.localStorage.setItem(keyName, JSON.stringify(codeValue))
        consoleLog("已注入提取" + pass)
        if (!extractCodeThere) {
            window.location.reload()
        }
    } else {
        consoleLog("没有提取码或未打开功能！")
    }
    let time = setInterval(function () {
        let fun = document.getElementsByClassName("MuiButtonBase-root MuiButton-root MuiButton-contained btn normal")
        if (fun.length > 2) {
            if (seeting.fmzautodown) {
                fun[2].click()
                let time1 = setInterval(function () {
                    let downFun = $(":contains(确定)")
                    if (downFun.length > 0) {
                        consoleLog("检测到下载框")
                        clearInterval(time1)
                        setTimeout(function () {
                            downFun[downFun.length -1].click()
                            copyUnzipPwd()
                        }, 500)
                    }
                }, 333)
            }
            if (seeting.fmzautofav) {
                fun[0].click()
            }
            if (seeting.fmzautosave) {
                fun[1].click()
            }
            clearInterval(time)
        }
    }, 333)
} else if (url.indexOf("sharepoint.com") != -1 && seeting.onedriver) {
    if (location.pathname.indexOf("onedrive.aspx") == -1) {
        consoleLog("非下载页面")
        if (seeting.odautofill && getUrlParam("Digit77HelperPwd") != null) {
            document.getElementById("txtPassword").value = getUrlParam("Digit77HelperPwd")
            document.getElementById("btnSubmitPassword").click();
        }
    } else {
        consoleLog("下载页面")
        if (seeting.odautodown) {
            let time = setInterval(function () {
                let downFun = document.getElementsByName("下载")
                if (downFun.length > 0) {
                    consoleLog("检测到下载框")
                    clearInterval(time)
                    setTimeout(function () {
                        downFun[0].click()
                        copyUnzipPwd()
                    }, 333)
                }
            }, 333)
        }
    }
} else if (url = "www.aliyundrive.com" && document.title == "阿里云盘分享" && seeting.aliyun) {
    function downSave() {
        let time = setInterval(function () {
            let downFun = document.getElementsByClassName("ant-dropdown-trigger")
            if (downFun.length > 0) {
                clearInterval(time)
                setTimeout(function () {
                    document.getElementsByClassName("ant-dropdown-trigger")[1].click()
                    if (seeting.alautodown) {
                        let time = setInterval(function () {
                            let downFun = $(":contains(下载)")
                            if (downFun.length > 10) {
                                consoleLog("检测到下载框")
                                clearInterval(time)
                                setTimeout(function () {
                                    downFun[downFun.length - 1].click()
                                    copyUnzipPwd()
                                }, 333)
                            }
                        }, 333)
                    }
                    if (seeting.alautosave) {
                        let time = setInterval(function () {
                            let saveFun = $(":contains(转存)")
                            if (saveFun.length > 5) {
                                consoleLog("检测到转存框")
                                clearInterval(time)
                                setTimeout(function () {
                                    saveFun[saveFun.length - 1].click()
                                }, 333)
                            }
                        }, 333)
                    }
                }, 333)
            }
        }, 333)

    }
    let time = setInterval(function () {
        let saveFun = $(":contains(下载)")
        if (saveFun.length > 5) {
            consoleLog("加载完成")
            clearInterval(time)
            if ($(":contains(极速查看文件)").length > 0 && seeting.alautofill) {
                let input = ['.ant-input', 'input[type="text"]']
                let button = ['.button--fep7l', 'button[type="submit"]']
                doFillAction(input, button, getUrlParam("Digit77HelperPwd"));
                downSave()
            } else {
                downSave()
            }
        }
    }, 333)
} else if (location.host == "cloud.189.cn" && seeting.tianyi) {
    function downSave() {
        if (seeting.tyautodown) {
            let time = setInterval(function () {
                let downFun = $(":contains(下载)")
                if (downFun.length > 10) {
                    consoleLog("检测到下载框")
                    clearInterval(time)
                    setTimeout(function () {
                        $(".btn-download")[0].click()
                    }, 333)
                }
            }, 333)
        }
        if (seeting.tyautosave) {
            let time = setInterval(function () {
                let saveFun = $(":contains(转存)")
                if (saveFun.length > 5) {
                    consoleLog("检测到转存框")
                    clearInterval(time)
                    setTimeout(function () {
                        document.getElementsByClassName("btn-save-as")[0].click()
                    }, 333)
                }
            }, 333)
        }
    }
    let time = setInterval(function () {
        let saveFun = $(":contains(属于私密分享)")
        if (saveFun.length > 5) {
            consoleLog("加载完成")
            clearInterval(time)
            let notice = $(":contains(属于私密分享)")
            setTimeout(function () {
                if ($(notice[notice.length - 1]).is(":visible") && seeting.tyautofill) {
                    var input = ['.access-code-item #code_txt']
                    var button = ['.access-code-item .visit']
                    doFillAction(input, button, getUrlParam("Digit77HelperPwd"));
                    downSave()
                } else {
                    downSave()
                }
            }, 1000)
        }
    }, 333)
} else {
    if ($(":contains(Helper设置)").length > 5) {
        consoleLog("进入设置页面！")
        document.getElementById("save").addEventListener('click', function () {
            let data = sumbit()
            GM_setValue("seeting", data);
            GM_notification("设置保存成功！", "Digit77 Helper")
        })
        document.getElementById("clean").addEventListener('click', function () {
            let datas = GM_listValues()
            for (let i = 0; i < datas.length; i++) {
                if (datas[i] != "seeting") {
                    GM_deleteValue(datas[i])
                }
            }
            GM_notification("设置清除成功！", "Digit77 Helper")
        })
        let inputs = $("#seeting input")
        inputs.each(function () {
            let key = this.id
            this.checked = seeting[key]
        })
        updateForm()
    }
}

function failedToGetJumpAddress(pwd) {
    if (!seeting.error) {
        return
    }
    GM_notification("获取ouo跳转链接失败！这导致无法自动填写提取码，请手动粘贴提取码！", "Digit77 helper错误")
    GM_setClipboard(pwd)
}

function addGetParameter(url, name, value) {
    url += (url.split("?")[1] ? "&" : "?") + name + "=" + value;
    return url;
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return encodeURI(r[2]);
    return null; //返回参数值
}

function consoleLog(text) {
    console.log("%c" + text, "color: #ff0000; font-size: 16px; font-weight: bold;");
}

function insterScript(src, type) {
    var importJs = document.createElement('script') //在页面新建一个script标签
    importJs.setAttribute("type", type) //给script标签增加type属性
    importJs.setAttribute("src", src) //给script标签增加src属性， url地址为cdn公共库里的
    document.body.insertBefore(importJs, document.body.firstChild)
}

function sumbit() {
    let inputs = $("#seeting input")
    let datas = {}
    inputs.each(function () {
        datas[$(this).attr("id")] = this.checked
    })
    let data = JSON.stringify(datas)
    return data
}

function updateForm(notFirst = true) {
    let inputs = $("#seeting input")
    inputs.each(function () {
        let id = $(this).attr("id")
        switch (id) {
            case "fenmiaozhen":
                if (this.value == "on" || notFirst)
                    openfmz.click()
                break
            case "baidu":
                if (this.value == "on" || notFirst)
                    openbd.click()
                break
            case "onedriver":
                if (this.value == "on" || notFirst)
                    openod.click()
                break
            case "tianyi":
                if (this.value == "on" || notFirst)
                    openty.click()
                break
            case "aliyun":
                if (this.value == "on" || notFirst)
                    openal.click()
                break
        }
    })
}

function copyUnzipPwd(){
    GM.GM_setClipboard("digit77.com")
}
//  以下代码修改自 网盘智能识别助手
let util = {
    clog(c) {
        console.group('[网盘智能识别助手]');
        console.log(c);
        console.groupEnd();
    },

    parseQuery(name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = location.search.substr(1).match(reg);
        if (r != null) return (r[2]);
        return null;
    },

    getValue(name) {
        return GM_getValue(name);
    },

    setValue(name, value) {
        GM_setValue(name, value);
    },

    sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    },

    addStyle(id, tag, css) {
        tag = tag || 'style';
        let doc = document,
            styleDom = doc.getElementById(id);
        if (styleDom) return;
        let style = doc.createElement(tag);
        style.rel = 'stylesheet';
        style.id = id;
        tag === 'style' ? style.innerHTML = css : style.href = css;
        document.head.appendChild(style);
    },

    isHidden(el) {
        try {
            return el.offsetParent === null;
        } catch (e) {
            return false;
        }
    },

    query(selector) {
        if (Array.isArray(selector)) {
            let obj = null;
            for (let i = 0; i < selector.length; i++) {
                let o = document.querySelector(selector[i]);
                if (o) {
                    obj = o;
                    break;
                }
            }
            return obj;
        }
        return document.querySelector(selector);
    }
};

function doFillAction(inputSelector, buttonSelector, pwd) {
    let maxTime = 10;
    let ins = setInterval(async () => {
        maxTime--;
        let input = util.query(inputSelector);
        let button = util.query(buttonSelector);
        if (input && !util.isHidden(input)) {
            clearInterval(ins);
            let lastValue = input.value;
            input.value = pwd;
            //Vue & React 触发 input 事件
            let event = new Event('input', {
                bubbles: true
            });
            let tracker = input._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);
            await util.sleep(500); //1秒后点击按钮
            button.click();

        } else {
            maxTime === 0 && clearInterval(ins);
        }
    }, 333);
}