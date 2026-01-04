// ==UserScript==
// @name         MCBBS Extender
// @namespace    https://i.zapic.cc
// @version      release-2.0.4
// @description  MCBBS行为拓展/样式修复
// @author       Zapic
// @match        https://*.mcbbs.net/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/429005/MCBBS%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/429005/MCBBS%20Extender.meta.js
// ==/UserScript==

// Core
(() => {
    let ShouldRun = true;
    // jQuery检查
    if (typeof jQuery == "undefined") {
        console.error("This page does NOT contain JQuery,MCBBS Extender will not work.");
        ShouldRun = false;
    }
    //在手机页面主动禁用
    if (document.getElementsByTagName('meta').viewport) {
        console.log("MCBBS Extender not fully compatible with Moblie page,exit manually");
        ShouldRun = false;
    }
    // Gear浏览器上的Polyfill
    if(typeof console.debug == "undefined") {
        console.debug = function() {};
    }
    //夹带私货
    console.log(" %c Zapic's Homepage %c https://i.zapic.cc ", "color: #ffffff; background: #E91E63; padding:5px;", "background: #000; padding:5px; color:#ffffff");
    // 基本信息初始化
    let version = "v2.0.4";
    let vercode = 121044;
    let valueList = {};
    let configList = [];
    // 加载ValueStorage
    try {
        valueList = JSON.parse(localStorage.getItem("MExt_config"));
        if (typeof valueList != "object" || valueList == null) {
            valueList = {};
            localStorage.setItem("MExt_config", "{}")
        }
    } catch (ignore) {
        valueList = {};
        localStorage.setItem("MExt_config", "{}")
    }
    // 导出模块
    let exportModule = (...modules) => {
        if (!ShouldRun) { return; }
        for (let m of modules) {
            try {
                moduleLoader(m);
            } catch (e) {
                console.error("Error occurred while try to load a module:\n" + e);
            }
        }
    }
    let $ = unsafeWindow.jQuery;
    let dlg = (m) => {
        console.debug("[MCBBS Extender]" + m);
    };
    let setValue = (name, val) => {
        valueList[name] = val;
        localStorage.setItem("MExt_config", JSON.stringify(valueList));
    }
    let getValue = (name) => {
        return valueList[name];
    }
    let deleteValue = (name) => {
        delete valueList[name];
        localStorage.setItem("MExt_config", JSON.stringify(valueList));
    }
    $('head').append('<style id="MExt_CoreStyle"></style>');
    let appendStyle = (style) => {
        document.getElementById('MExt_CoreStyle').innerHTML += "\n" + style;
    };
    let getRequest = (variable, url = "") => {
            let query = url ? /\?(.*)/.exec(url)[1] : window.location.search.substring(1);
            let vars = query.split("&");
            for (let i = 0; i < vars.length; i++) {
                let pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return (false);
        }
        // 模块加载器
    let moduleLoader = (module) => {
        // 载入配置项
        if (typeof module.config !== "undefined") {
            module.config.forEach((v) => {
                if (typeof getValue(v.id) == "undefined") {
                    setValue(v.id, v.default);
                }
                let config = v;
                v.value = getValue(v.id);
                configList.push(config);
            });
        }
        // 判断是否应该运行
        if (typeof module.runcase == "function") {
            if (!module.runcase()) {
                return;
            }
        }
        // 加载模块CSS
        if (typeof module.style == 'string') {
            appendStyle(module.style);
        }
        // 运行模块Core
        if (typeof module.core == "function") {
            module.core();
        }
    }

    // 钩住DiscuzAjax函数,使其触发全局事件
    let __ajaxpost = ajaxpost;
    ajaxpost = (formid, showid, waitid, showidclass, submitbtn, recall) => {
        let relfunc = () => {
            if (typeof recall == 'function') {
                recall();
            } else {
                eval(recall);
            }
            $(this).trigger('DiscuzAjaxPostFinished');
        }
        __ajaxpost(formid, showid, waitid, showidclass, submitbtn, relfunc);
    }
    let __ajaxget = ajaxget;
    ajaxget = (url, showid, waitid, loading, display, recall) => {
        let relfunc = () => {
            if (typeof recall == 'function') {
                recall();
            } else {
                eval(recall);
            }
            $(this).trigger('DiscuzAjaxGetFinished');
        }
        __ajaxget(url, showid, waitid, loading, display, relfunc);
    }
    dlg("Hooked into Discuz Ajax");

    // 对外暴露API
    let MExt = {
        "ValueStorage": {
            "get": getValue,
            "set": setValue,
            "delete": deleteValue
        },
        "exportModule": exportModule,
        "debugLog": dlg,
        "versionName": version,
        "versionCode": vercode,
        "jQuery": $,
        "configList": configList,
        "Units": {
            "appendStyle": appendStyle,
            "getRequest": getRequest
        }
    };
    unsafeWindow.MExt = MExt;
    dlg("Core loaded.");
})();

// Settings
(() => {
    let MExt = unsafeWindow.MExt;
    let $ = MExt.jQuery;
    let Md = {
        "style": `.conf_contain {
            max-height: 45vh;
            overflow-y: auto;
            padding-right: 5px;
            overflow-x: hidden;
            scrollbar-color: rgba(0, 0, 0, 0.17) #f7f7f7;
            scrollbar-width: thin;
        }

        .alert_info ::-webkit-scrollbar {
            background: #f7f7f7;
            height: 7px;
            width: 7px
        }

        .alert_info ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.35);
        }

        .alert_info ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.17);
        }

        .conf_item {
            line-height: 1.2;
            margin-bottom: 5px;
        }

        .conf_title {
            font-weight: 1000;
        }

        .conf_subtitle {
            font-size: 10px;
            color: rgba(0, 0, 0, 0.5);
            padding-right: 40px;
            display: block;
        }

        .conf_check {
            float: right;
            margin-top: -25px;
        }

        .conf_input {
            float: right;
            width: 30px;
            margin-top: -27px;
        }

        .conf_longinput {
            width: 100%;
            margin-top: 5px;
        }

        .conf_textarea {
            width: calc(100% - 4px);
            margin-top: 5px;
            resize: vertical;
            min-height: 50px;
        }`,
        "core": () => {
            let getRequest = MExt.Units.getRequest;
            $(() => {
                // 发送警告
                if (location.pathname == "/forum.php" && getRequest('mod') == "post" && getRequest('action') == "newthread" && getRequest('fid') == "246") {
                    $("body").append($(`<div id="close_script_alert" style="max-width:430px;position: fixed; left: 20px; top: 80px; z-index: 9999; transform: matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025) translateX(-120%); background: rgba(228, 0, 0, 0.81); color: white; padding: 15px; transition-duration: 0.3s; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.66) 2px 2px 5px 0px;"><h1 style="font-size: 3em;float: left;margin-right: 12px;font-weight: 500;margin-top: 6px;">警告</h1><span style="font-size: 1.7em;">您正在向反馈与投诉版发表新的帖子</span><br>如果您正在向论坛报告论坛内的Bug,请先关闭此脚本再进行一次复现,以确保Bug不是由MCBBS Extender造成的.</div>`));
                    setTimeout(() => { $("#close_script_alert")[0].style.transform = "matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025)"; }, 10);
                    setTimeout(() => { $("#close_script_alert")[0].style.transform = "none"; }, 300);
                    setTimeout(() => { $("#close_script_alert")[0].style.transform = "translateX(-120%)"; }, 10000);
                    MExt.debugLog("Warning send");
                }
                // 设置界面初始化
                $("#user_info_menu .user_info_menu_btn").append("<li><a href='javascript: void(0);' id=\"MExt_config\">MCBBS Extender 设置</a></li>");
                let confwinContent = '<style>body{overflow:hidden}.altw{width:700px;max-width:95vh;}.alert_info {background-image: unset;padding-left: 20px;padding-right: 17px;}</style><div class="conf_contain">';
                let inputType = {
                    "check": '',
                    "num": '',
                    "text": '',
                    "textarea": ''
                };
                MExt.configList.forEach((v) => {
                    switch (v.type) {
                        case "check":
                            inputType.check += '<p class="conf_item"><span class="conf_title">' + v.name + '</span><br><span class="conf_subtitle">' + v.desc + '</span><input class="conf_check" type="checkbox" id="in_' + v.id + '"></input></p>';
                            break;
                        case "num":
                            inputType.num += '<p class="conf_item"><span class="conf_title">' + v.name + '</span><br><span class="conf_subtitle">' + v.desc + '</span><input type="number" class="conf_input" id="in_' + v.id + '"></input></p>';
                            break;
                        case "text":
                            inputType.text += '<p class="conf_item"><span class="conf_title">' + v.name + '</span><br><span class="conf_subtitle">' + v.desc + '</span><input type="text" class="conf_longinput" id="in_' + v.id + '"></input></p>';
                            break;
                        case "textarea":
                            inputType.textarea += '<p class="conf_item"><span class="conf_title">' + v.name + '</span><br><span class="conf_subtitle">' + v.desc + '</span><textarea class="conf_textarea" id="in_' + v.id + '"></textarea></p>';
                            break;
                        default:
                            inputType.check += '<p class="conf_item"><span class="conf_title">' + v.name + '</span><br><span class="conf_subtitle">' + v.desc + '</span><input class="conf_check" type="checkbox" id="in_' + v.id + '"></input></p>';
                            break;
                    }
                });
                confwinContent += inputType.check + inputType.num + inputType.text + inputType.textarea + '</div>';
                MExt.debugLog('Setting window content loaded.');
                $("#MExt_config").on("click", () => {
                    unsafeWindow.showDialog(
                        confwinContent,
                        "confirm",
                        "MCBBS Extender 设置<a href=\"https://github.com/Proj-MExt/Modules-Repo/\" target=\"_blank\" style=\"margin-left: 460px;color: #369;text-decoration: underline;\">插件市场</a>",
                        () => {
                            MExt.configList.forEach((v) => {
                                let val = '';
                                if (v.type == "num" || v.type == "text" || v.type == "textarea") {
                                    val = $("#in_" + v.id).val();
                                } else {
                                    val = $("#in_" + v.id).prop("checked");
                                }
                                MExt.ValueStorage.set(v.id, val);
                            });
                            setTimeout(() => {
                                unsafeWindow.showDialog("设置已保存,刷新生效<style>.alert_info{background:url(https://www.mcbbs.net/template/mcbbs/image/right.gif) no-repeat 8px 8px}</style>", "confirm", "", () => { location.reload() }, true, () => {}, "", "刷新", "确定");
                            });
                        },
                        true,
                        () => {},
                        "MCBBS Extender " + MExt.versionName + " - <s>世界第二委屈公主殿下</s>"
                    );
                    MExt.configList.forEach((v) => {
                        if (v.type == "num" || v.type == "text" || v.type == "textarea") {
                            $("#in_" + v.id).val(MExt.ValueStorage.get(v.id));
                        } else {
                            $("#in_" + v.id).prop("checked", MExt.ValueStorage.get(v.id));
                        }
                    });
                });
            });
        }
    };
    MExt.exportModule(Md);
})();

// Update Manager
(() => {
    let updatelist = [
        "1. 修复 头像无法显示的问题.",
        "2. 修复 替换Flash播放器处理意外的元素(感谢@CaveNightingale 提供的修复方案)",
        "3. <a href=\"https://github.com/Proj-MExt/Modules-Repo\">插件市场</a>开张啦! 可以在设置菜单内找到插件市场的链接喵~ 欢迎提交自己开发的插件w"
    ];
    unsafeWindow.MExt.exportModule({
        "core": () => {
            if (typeof unsafeWindow.MExt.ValueStorage.get("LastVersion") == "undefined") {
                unsafeWindow.MExt.ValueStorage.set("LastVersion", unsafeWindow.MExt.versionCode);
                showDialog("<b>欢迎使用MCBBS Extender</b>.<br>本脚本的设置按钮已经放进入了您的个人信息菜单里,如需调整设置请在个人信息菜单里查看.", "right", "欢迎", () => {
                    showMenu('user_info');
                    unsafeWindow.MExt.jQuery("#MExt_config").css("background-color", "#E91E63").css("color", "#fff");
                    setTimeout(() => {
                        hideMenu('user_info_menu');
                        unsafeWindow.MExt.jQuery("#MExt_config").css("background-color", "").css("color", "");
                    }, 3000);
                });
                return;
            }
            if (unsafeWindow.MExt.ValueStorage.get("LastVersion") == unsafeWindow.MExt.versionCode) { return; }
            let updateContent = '';
            updatelist.forEach((v) => {
                updateContent += "<br>" + v;
            });
            showDialog("<b>MCBBS Extender 已经更新至 " + unsafeWindow.MExt.versionName + "</b>" + updateContent, "right");
            unsafeWindow.MExt.ValueStorage.set("LastVersion", unsafeWindow.MExt.versionCode);
        }
    });
})();

//Modules
(() => {
    let staticRes = {
        "atBtnImage": "data:image/png;base64,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",
        "medalReflectImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAA3CAYAAACGnvPUAAAAAXNSR0IArs4c6QAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA1UlEQVRYw+3Qy6rBARRGcQcjl1zCG5AkkY48gUiEMHU/7/8GS/vUHoqif1/ZgzX/tVLAn0qpwAQmMIH5NsxECWM1gYMKxsoBUxWM1wKOKhgrD8xUMF47yUvPMFYBmKtgvA5wUsFYRWChgrF+gC5wVsB4JWCpgvFLvU9dehfjlYGVCsYv9YGLAsarAGsVjJUGBsBVAeNVgY0Kxi8NX7mUBMarAVsVjF/6fXQpaYxXB3YqGCsDjICbAsZrAHsVjJUFxiqY/wITmMAEJjCBCUxgAhOYb8PcAbo5rkGPsZmjAAAAAElFTkSuQmCC",
        "rainbowBtnImage": "data:image/png;base64,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"
    };
    let MExt = unsafeWindow.MExt;
    let $ = MExt.jQuery;
    let dlg = MExt.debugLog;
    let Stg = MExt.ValueStorage;
    let fixCodeBlock = {
        "style": `pre:not([id]) code {
    background: #f7f7f7;
    display: block;
    font-family: Monaco, Consolas, 'Lucida Console', 'Courier New', serif;
    font-size: 12px;
    line-height: 1.8em;
    padding: 10px;
    border: #ccc solid 1px;
    position: relative;
}

.pl .blockcode ol li:hover {
    background: none;
    color: #666
}

.pl .blockcode ol li {
    white-space: nowrap;
    list-style: none;
    padding-left:0;
    margin-left:0;
}

.pl pre em, .pl .blockcode em {
    font-size: 0;
}

.pl pre em::after, .pl .blockcode em::after {
    content: 'Copy';
    position: absolute;
    top: 3px;
    right: 7px;
    display: block;
    font-size: 14px;
    border: #369 dashed 1px;
    padding: 0 7px;
    border-radius: 3px;
    transition-duration: .1s;
    opacity: 0.3;
    color: #369;
    cursor: pointer;
    font-family: Monaco, Consolas, 'Lucida Console', 'Courier New', serif;
}

.pl .blockcode,.pl pre:not([id]) {
    position: relative;
    padding: 0;
}

.pl pre em:active::after, .pl .blockcode em:active::after {
    background: #369;
    border: #369 solid 2px;
    color: white;
}

.pl .blockcode em:hover::after, .pl pre em:hover::after {
    opacity: 1;
}

.pl .blockcode div[id], pre:not([id]) code {
    max-height: 500px;
    overflow: auto;
    padding: 10px 30px 5px 50px;
    background: #F7F7F7 url(https://www.mcbbs.net/template/mcbbs/image/codebg.gif) repeat-y 0 0;
    scrollbar-width: thin;
}

.pl .blockcode div[id]::-webkit-scrollbar, pre:not([id]) code::-webkit-scrollbar {
    width: 7px;
    height: 7px;
}

.pl .blockcode div[id]::-webkit-scrollbar-thumb, pre:not([id]) code::-webkit-scrollbar-thumb {
    background: #00000040
}

.line-counter {
    position: sticky;
    float: left;
    left: -50px;
    line-height: 1.8em;
    padding-top: 3px;
    user-select: none;
    margin: -4px 0px -50px -50px;
    border-right: #d6d6d6 solid 1px;
    width: 38px;
    background: #ededed;
    font-size: 12px;
    font-family: Monaco, Consolas, 'Lucida Console', 'Courier New', serif;
    padding-right: 4px;
    text-align: right;
}

.pl .blockcode ol {
    margin: 0!important;
}

.pl .t_table .blockcode ol li {
    width:0;
}
pre:not([id]) code br{
    display: none;
}
`,
        "core": () => {
            // 构建代码行计数器
            let LnBuilder = (ln) => {
                let str = "";
                for (let i = 1; i <= ln; i++) {
                    str += (i < 10 ? "0" + i.toString() : i.toString()) + ".\n";
                }
                return str;
            };
            // 为代码块添加行数显示与复制按钮
            let fixCode = () => {
                $(".pl pre:not([id]) code:not([code-fixed])").attr("code-fixed",'').each((i, v) => {
                    // 构建计数器
                    let ln = v.innerHTML.split("\n").length;
                    let lnC = LnBuilder(ln);
                    let counter = document.createElement("div");
                    counter.className = "line-counter";
                    counter.innerText = lnC;
                    // 构建按钮
                    let copy = document.createElement("em");
                    copy.className = "code-copy";
                    copy.addEventListener("click", (e) => {
                        let n = e.currentTarget.previousSibling;
                        copycode(n);
                    });
                    v.prepend(counter);
                    v.parentElement.append(copy);
                });
                $(".pl div.blockcode:not([code-fixed])").attr("code-fixed",'').each((i, v) => {
                    // 构建计数器
                    let ln = v.firstElementChild.firstElementChild.childElementCount;
                    let lnC = LnBuilder(ln);
                    let counter = document.createElement("div");
                    counter.className = "line-counter";
                    counter.innerText = lnC;
                    v.firstElementChild.prepend(counter);
                });
                dlg('Line counter appended.');
            }
            copycode = (t) => {
                    console.log(t.firstElementChild);
                    setCopy(t.innerText.replace(/\n\n/g, "\n").replace(t.firstElementChild.innerText,''), "代码已复制到剪贴板");
                    dlg("Code copied.");
                };
            $(fixCode);
            $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", fixCode);
        },
        "config": [{
            "id": "fixCodeBlock",
            "default": true,
            "type": "check",
            "name": "美化代码块样式",
            "desc": "修正代码块的一些样式,如滚动条."
        }],
        "runcase": () => { return MExt.ValueStorage.get("fixCodeBlock"); }
    };
    let queryMessage = {
        "runcase": () => { return MExt.ValueStorage.get("queryMessage") },
        "config": [{
            "id": "queryMessage",
            "default": true,
            "type": "check",
            "name": "后台轮询消息",
            "desc": "在后台自动查询是否有新的消息并推送,需保证至少打开一个页面."
        }, {
            "id": "queryMessageInterval",
            "default": 60,
            "type": "num",
            "name": "后台轮询消息间隔",
            "desc": "两次轮询消息之间的间隔,单位秒.注意,过低的值可能会导致你被论坛屏蔽,超过200的值可能会导致消息反复推送."
        }],
        "core": () => {
            let checkNotifica = (noNotifica = false) => {
                    if (localStorage.getItem("MExt_ActiveQueryId") != queryId) {
                        return false;
                    }
                    dlg("Checking message...");
                    $.get("/forum.php?mod=misc", (d) => {
                        // 设置最后通知时间为当前时间,以防止反复推送
                        localStorage.setItem('notifica-time', new Date().getTime());
                        let dom = $(d);
                        // 获得顶栏图标类
                        let noticlass = dom.find("#myprompt").attr("class");
                        // 获得通知菜单元素
                        let notimenu = dom.filter("#myprompt_menu");
                        // 将顶栏图标类写入当前页
                        $("#myprompt").attr("class", noticlass);
                        // 将通知菜单写入当前页
                        $("#myprompt_menu").html(notimenu.html());
                        // 获得消息内容,用作缓存
                        let noticontent = notimenu.html();
                        // 判断是否应该发送消息
                        if (!noNotifica && localStorage.getItem("MExt_LastNoticeContent") != noticontent) {
                            // 获得通知脚本(暴力)
                            let scp = dom.filter("script[src*=html5notification]").nextUntil("div").last().text();
                            // 将最后通知时间设置为1,强行启用通知
                            localStorage.setItem('notifica-time', 1);
                            // 执行通知脚本
                            eval(scp);
                            dlg("Notifica sent.");
                            // 写入消息缓存
                            localStorage.setItem("MExt_LastNoticeContent", noticontent);
                            localStorage.setItem("MExt_LastNoticeCount", noticlass);
                        }
                    });
                }
                // 刷新消息缓存
            let flushContent = () => {
                    $.get("/forum.php?mod=misc", (d) => {
                        let dom = $(d);
                        let noticontent = dom.filter("#myprompt_menu").html();
                        let noticlass = dom.find("#myprompt").attr("class");
                        // 写入消息缓存
                        localStorage.setItem("MExt_LastNoticeContent", noticontent);
                        localStorage.setItem("MExt_LastNoticeCount", noticlass);
                    });
                }
                // 生成queryID,用于页面间的互斥
            let queryId = hash(new Date().getTime().toLocaleString(), 16);
            // 判断是否在消息页面||最后通知时间是否超过200秒
            if ((location.pathname == "/home.php" && (getRequest('do') == "pm" || getRequest('do') == "notice")) || new Date().getTime() - localStorage.getItem("notifica-time") > 200000) {
                flushContent();
            } else {
                checkNotifica();
            }
            dlg("Query id is " + queryId + ".");
            // 运行定时器,用于检查其他页面是否在运行
            setInterval(() => {
                if (localStorage.getItem("MExt_LastQuery") == "") {
                    localStorage.setItem("MExt_LastQuery", 0);
                }
                let nowtime = Math.floor(new Date().getTime() / 1000);
                if ((localStorage.getItem("MExt_ActiveQueryId") == "" || nowtime - localStorage.getItem("MExt_LastQuery") > 5) && localStorage.getItem("MExt_ActiveQueryId") != queryId) {
                    localStorage.setItem("MExt_ActiveQueryId", queryId);
                    checkNotifica();
                    dlg("Kick off inactive querier,start query.");
                }
                if (localStorage.getItem("MExt_ActiveQueryId") == queryId) {
                    localStorage.setItem("MExt_LastQuery", nowtime);
                }
            }, 1000);
            dlg("Running checker actived.");
            // 判断是否有HTML5Notification
            if (!unsafeWindow.Html5notification) {
                $.getScript("data/cache/html5notification.js?xm6");
                dlg("Html5notification added.");
            }
            //
            $(window).on("focus", () => {
                dlg("Get content from cache");
                $("#myprompt_menu").html(localStorage.getItem("MExt_LastNoticeContent"));
                $("#myprompt").attr("class", localStorage.getItem("MExt_LastNoticeCount"));
            });
            // 定时运行检查函数
            setInterval(checkNotifica, MExt.ValueStorage.get('queryMessageInterval') * 1000);
            dlg("Message query actived.");
        }
    };
    let rememberPage = {
        "runcase": () => { return MExt.ValueStorage.get("rememberPage") },
        "config": [{
            "id": "rememberPage",
            "default": true,
            "type": "check",
            "name": "板块内翻页记忆",
            "desc": "点击板块内下一页按钮时记忆当前页."
        }],
        "core": () => {
            $(() => {
                let npbtn = $("#autopbn");
                if (npbtn.length) {
                    // 绑定事件
                    let orgfunc = npbtn[0].onclick;
                    npbtn[0].onclick = null;
                    npbtn.on("click", () => {
                        if (npbtn.html() == "正在加载, 请稍后...") { return false; }
                        let nextpageurl = npbtn.attr('rel');
                        let curpage = parseInt(npbtn.attr('curpage'));
                        npbtn.attr('curpage', curpage + 1);
                        nextpageurl = nextpageurl.replace(/&page=\d+/, '&page=' + (curpage + 1));
                        $("#threadlisttableid").append("<a class=\"mext_rempage\" rel=\"" + nextpageurl + "\"></a>")
                        history.replaceState(null, null, nextpageurl);
                        orgfunc();
                    });
                    $("#separatorline").after("<a class=\"mext_rempage\" rel=\"" + window.location + "\"></a>");
                    let timer = -1;
                    // 事件防抖
                    $(window).on("scroll", () => {
                        clearTimeout(timer);
                        timer = setTimeout(() => {
                            let scroll = document.scrollingElement.scrollTop - window.innerHeight / 2;
                            let url = null;
                            document.querySelectorAll(".mext_rempage").forEach((v, i) => {
                                let vtop = v.offsetTop;
                                if (vtop < scroll || i == 0) {
                                    url = v.rel;
                                }
                            });
                            if (url) {
                                history.replaceState(null, null, url);
                            }
                        }, 250);
                    });
                }
                dlg("Page remember actived.");
            });
        }
    };
    let animationGoToTop = {
        "runcase": () => { return MExt.ValueStorage.get("animationGoToTop") },
        "config": [{
            "id": "animateGoToTopButton",
            "default": true,
            "name": "回到顶部按钮美化",
            "type": "check",
            "desc": "为右侧回到顶部按钮增加动画以及位置修正."
        }],
        "style": `#scrolltop {
    bottom: 270px!important;
    visibility: visible;
    overflow-x: hidden;
    width: 75px;
}

.scrolltopa {
    transition-duration: .15s;
    margin-left: -40px;
    opacity: 0;
}

.scrolltopashow {
    margin-left: 0px;
    opacity: 1;
}`,
        "core": () => {
            unsafeWindow.showTopLink = () => {
                let ft = $('#ft')[0];
                if (ft) {
                    let scrolltop = $('#scrolltop')[0];
                    if (!scrolltop) {
                        return false;
                    }
                    let scrolltopbtn = $(".scrolltopa");
                    let scrollHeight = parseInt(document.body.getBoundingClientRect().top);
                    let basew = parseInt(ft.clientWidth);
                    let sw = scrolltop.clientWidth;
                    if (basew < 1000) {
                        let left = parseInt(fetchOffset(ft)['left']);
                        left = left < sw ? left * 2 - sw : left;
                        scrolltop.style.left = (basew + left + 44) + 'px';
                    } else {
                        scrolltop.style.left = 'auto';
                        scrolltop.style.right = 0;
                    }
                    if (scrollHeight < -100) {
                        scrolltopbtn.addClass("scrolltopashow");
                    } else {
                        scrolltopbtn.removeClass("scrolltopashow");
                    }
                }
            }
            showTopLink();
        }
    };
    let pinnerTopBar = {
        "runcase": () => { return MExt.ValueStorage.get("pinnedTopBar") },
        "config": [{
            "id": "pinnedTopBar",
            "default": true,
            "name": "更好的固定顶栏",
            "type": "check",
            "desc": "优化固定顶栏的行为,如与编辑栏的兼容性,以及在极窄窗口下的显示."
        }],
        "style": `#toptb {
    position: fixed;
    width: 100%;
    z-index: 790;
    top: 0;
    box-shadow: rgba(0, 0, 0, 0.3) 3px 3px 5px 1px;
    min-width: 510px;
}

.new_wp {
    max-width: 1130px;
    width: 100%;
}

.mc_map_wp {
    padding-top: 45px;
}

.mw {
    padding-top: 60px
}

#user_info_menu, #myprompt_menu, #usertools_menu, #sslct_menu, #scbar_type_menu {
    position: fixed!important;
    top: 47px!important
}

#scbar_type_menu {
    top: 38px!important;
}

#e_controls {
    z-index: 790!important
}

@media screen and (max-width: 860px) {
    #toptb .z.light {
        display: none;
    }
    #toptb>.new_wp>.y {
        float: none;
        margin-left: 12px;
    }
}`,
        "core": () => {
            $(() => {
                // 重写editorcontrolpos函数,与固定顶栏兼容
                editorcontrolpos = () => {
                    if (editorisfull) {
                        return;
                    }
                    let scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
                    if (scrollTop + 47 > editorcontroltop && editorcurrentheight > editorminheight) {
                        $("#" + editorid + '_controls').prop("style", "z-index:0!important").css("position", 'fixed').css("top", '47px').css("width", editorcontrolwidth + 'px');
                        $("#" + editorid + '_controls_mask').css("display", '');
                    } else {
                        $("#" + editorid + '_controls').css("position", '').css('top', '').css('width', '');
                        $("#" + editorid + '_controls_mask').css('display', 'none');
                    }
                };
                //增加一个5px的遮罩,防止鼠标经过空隙时碰到底层内容
                $("#toptb").after('<div style="position: fixed;top: 47px;height: 5px;width: 100%;z-index:700;"></div>');
                dlg("Mask appended.");
            });
        }
    };
    let fixTopBarPopMenu = {
        "runcase": () => { return MExt.ValueStorage.get("fixTopBarPopMenu") },
        "config": [{
            "id": "fixTopBarPopMenu",
            "default": true,
            "type": "check",
            "name": "弹出菜单美化",
            "desc": "美化弹出菜单的样式,如个人信息菜单."
        }],
        "style": `.p_pop:not(.blk) a {
border-radius: 5px;
border-bottom: none;
}

div#user_info_menu {
margin-top: 5px;
}

.user_info_menu_info>li {
margin-top: 2px;
}

a.rank {
padding: 2px 7px!important;
border-radius: 14px;
}

a.rank:hover {
text-decoration: none;
}

ul.user_info_menu_btn {
padding-top: 6px;
}

ul.user_info_menu_btn>li>a:hover {
background:

}

ul.user_info_menu_btn>li>a {
padding: 5px 8px;
border-radius: 5px;
}

ul.user_info_menu_btn>li>a[onclick]:hover {
background: red!important;
}

#myprompt_menu {
margin-left: -10px;
}

#myprompt_menu, #usertools_menu, #sslct_menu {
z-index: 791!important;
margin-top: 5px!important;
transform: translateX(-50%);
margin-left: 20px;
}

.p_pop:not(.h_pop) {
border: 1px solid #d1d1d1;
min-width: unset;
border-radius: 5px;
}

#myprompt_menu>li>a, #usertools_menu>li>a, #scbar_type_menu>li>a {
border: none;
border-radius: 5px;
text-align: center;
padding: 3px 15px;
}

#myprompt_menu>li>a:hover, #scbar_type_menu>li>a:hover, #usertools_menu>li>a:hover {
background: #36b030;
color: white;
}

div#sslct_menu {
margin-left: 54px;
padding-left: 14px;
}

.sslct_btn {
border: none!important;
width: 15px;
height: 15px;
padding: 2px;
}

.sslct_btn i {
border-radius: 50%;
width: 13px;
height: 13px;
}

#scbar_type_menu {
background: url(https://www.mcbbs.net/template/mcbbs/image/bg-wool-white.png);
}

a#scbar_type:after {
content: "▼";
margin-left: 10px;
}

#scbar_type_menu>li>a {
padding: 3px 5px;
line-height: 20px;
height: 20px;
}

.scbar_type_td {
background: url(https://www.mcbbs.net/template/mcbbs/image/scbar_txt.png) -95px center no-repeat
}

.y_search {
width: 249px;
border-radius: 3px;
overflow: hidden;
}
.y_search_inp {
float: unset;
}

#scbar_txt {
width: 130px;
background-color: transparent;
}
body.winter{
--MExtBtnClr: #5c8dff!important;
}
body.nether{
--MExtBtnClr: #a42e0b!important;
}
body{
--MExtBtnClr: #36b030!important;
}
.user_info_menu_info li a.rank, ul.user_info_menu_btn>li>a:hover, .p_pop:not(.blk) a:hover,#myprompt_menu>li>a:hover, #scbar_type_menu>li>a:hover, #usertools_menu>li>a:hover, .p_pop:not(.blk) a:hover {
background: var(--MExtBtnClr);
color: white;
}`,
        "core": () => {
            let __extstyle = extstyle;
            let checkStyle = (style = null) => {
                let theme = style == null ? getcookie('extstyle') : style;
                if (theme == "./template/mcbbs/style/winter") {
                    $("body").removeClass("nether").addClass("winter");
                } else if (theme == "./template/mcbbs/style/default") {
                    $("body").removeClass("winter nether");
                } else {
                    $("body").addClass("nether").removeClass("winter");
                }
            }
            extstyle = (style) => {
                __extstyle(style);
                checkStyle(style);
            }
            checkStyle();
        }
    };
    let hoverableMesdal = {
        "runcase": () => { return MExt.ValueStorage.get("hoverableMedal") },
        "config": [{
            "id": "hoverableMedal",
            "default": true,
            "name": "玻璃质感勋章",
            "type": "check",
            "desc": "亮闪闪的勋章~"
        }],
        "style": `.hoverable-medal:hover:after {
    margin-top: 0px!important;
    opacity: 1!important;
}

.hoverable-medal:after {
    display: block;
    content: '';
    margin-top: -15px;
    opacity: 0.6;
    transition-duration: .4s;
    background-image: url(` + staticRes.medalReflectImage + `);
    width: 100%;
    height: 100%;
    filter: blur(2px);
}

div.tip.tip_4[id*=md_] {
    width: 105px;
    height: 165px;
    border: none;
    box-shadow: black 0px 2px 10px -3px;
    margin-left: 38px;
    margin-top: 115px;
    background: black;
    overflow: hidden;
    pointer-events: none!important;
    border-radius: 5px;
    padding: 0px;
}

div.tip.tip_4[id*=md_] .tip_horn {
    background-size: cover;
    background-position: center;
    height: 200%;
    width: 200%;
    z-index: -1;
    filter: blur(7px) brightness(0.8);
    top: -50%;
    left: -50%;
}

div.tip.tip_4[id*=md_] .tip_c {
    color: rgba(255, 255, 255, 0.98);
}

div.tip.tip_4[id*=md_] h4 {
    text-align: center;
    padding: 10px 5px;
    background-color: rgba(255, 255, 255, 0.3);
}

div.tip.tip_4[id*=md_] p {
    padding: 0px 10px;
    position: absolute;
    top: calc(50% + 38px);
    transform: translateY(calc(-50% - 26px));
}

.md_ctrl {
    margin-left: 17px!important;
    padding-bottom: 15px;
}

.hoverable-medal {
    width: 31px;
    height: 53px;
    transition-duration: 0.4s;
    border-radius: 3px;
    display: inline-block;
    margin: 5px;
    background-position: center;
    box-shadow: 0px 2px 5px 0px black;
    overflow: hidden;
}

.hoverable-medal:hover {
    transform: matrix3d(1, 0, 0, 0, 0, 1, 0, -0.003, 0, 0, 1, 0, 0, -1.5, 0, 0.9);
    box-shadow: 0px 2px 10px -3px black;
}

.pg_medal .mgcl img {
    margin-top: 12px!important
}

.mg_img {
    box-shadow: inset 0 0 10px 4px rgba(0, 0, 0, 0.3);
    border-radius: 5px;
}
.md_ctrl:not([glassmedal]){
    display:none;
}`,
        "core": () => {
            let rewriteMedal = () => {
                // 遍历所有未重写楼层
                $('.md_ctrl:not([glassmedal])').attr("glassmedal", "true").each((t, v) => {
                    // 遍历楼层所有勋章
                    $(v).children(0).children('img').each((b, n) => {
                        // 获得勋章ID
                        let id = 'md' + /\_\d*$/.exec(n.id)[0];
                        // 重写勋章结构
                        $(v).append(
                            $('<span class="hoverable-medal" id="' + n.id + '" style="background-image:url(' + n.src + ')"></span>').on('mouseover', () => {
                                showMenu({
                                    'ctrlid': n.id,
                                    'menuid': id + '_menu',
                                    'pos': '12!'
                                });
                            })
                        );
                        // 重写提示样式
                        $("#" + id + "_menu .tip_horn").css("background-image", "url(" + n.src + ")");
                        // 移除旧的勋章
                        n.remove();
                    });
                });
            };
            //调用重写勋章函数
            $(rewriteMedal);
            // 在Ajax时重新调用Ajax函数,保存勋章样式
            $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", rewriteMedal);
        }
    };
    let viewWarns = {
        "runcase": () => { return MExt.ValueStorage.get("viewWarns") },
        "config": [{
            "id": "viewWarns",
            "default": true,
            "name": "查看警告记录",
            "type": "check",
            "desc": "为每一层楼和每一个个人主页(除自己)添加查看警告记录按钮"
        }],
        "style": `.view_warns_inposts {
    background: url(template/mcbbs/image/warning.gif) no-repeat 0px 2px;
    background-size: 16px;
    width: 90px!important;
}

.view_warns_home a {
    background: url(template/mcbbs/image/warning.gif) no-repeat 1px 2px!important;
    background-size: 16px!important;
}`,
        "core": () => {
            let addVWLink = () => {
                    $(".plhin:not([vw-added*=true])").each((i, v) => {
                        let href = $(v).find(".authi .xw1").attr("href");
                        if (!href) {
                            return false;
                        }
                        let uid = /uid=(\d*)/.exec(href)[1];
                        $(v).attr("vw-added", "true").find("ul.xl.xl2.o.cl").append($('<li class="view_warns_inposts"><a href="forum.php?mod=misc&action=viewwarning&tid=952104&uid=' + uid + '" title="查看警告记录" class="xi2" onclick="showWindow(\'viewwarning\', this.href)">查看警告记录</a></li>'));
                    });
                    dlg("In-posts view warns link added");
                }
                // 在DiscuzAjax时重新调用添加函数,防止失效
            $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", addVWLink);
            dlg("add VWLink Ajax Event attached.");
            $(() => {
                // 添加查看警告按钮
                addVWLink();
                // 用户信息界面添加查看警告按钮
                let href = $("#uhd .cl a").attr("href");
                if (!href) {
                    return false;
                }
                let uid = /uid=(\d*)/.exec(href)[1];
                if (!uid) {
                    return false;
                }
                $("#uhd .mn ul").append('<li class="view_warns_home"><a href="forum.php?mod=misc&action=viewwarning&tid=952104&uid=' + uid + '" title="查看警告记录" class="xi2" onclick="showWindow(\'viewwarning\', this.href)">查看警告记录</a></li>');
                dlg("Home page view warns link added.")
            });
        }
    };
    let removeLinkWarn = {
        "runcase": () => { return MExt.ValueStorage.get("removeLinkWarn") && location.pathname == "/plugin.php" && MExt.Units.getRequest('id') == "link_redirect" },
        "config": [{
            "id": "removeLinkWarn",
            "default": true,
            "name": "移除外链警告",
            "type": "check",
            "desc": "去除论坛跳转外链时的警告页面."
        }],
        "core": () => {
            let url = MExt.Units.getRequest('target');
            if (url) {
                // 跳就完事了
                location.href = decodeURIComponent(url);
            }
        }
    };
    let useIgInQuickReply = {
        "runcase": () => { return MExt.ValueStorage.get("useIgInQuickReply") },
        "config": [{
            "id": "useIgInQuickReply",
            "default": true,
            "name": "快速回复使用个人签名",
            "type": "check",
            "desc": "在页脚快速回复帖子时使用个人签名."
        }],
        "core": () => {
            // 快速回复框使用个人签名
            let hookReplyBtn = () => {
                if ($("#fwin_reply #usesig").length > 0) { return false; }
                $("#fwin_reply #postsubmit").after('<label for="usesig" style="margin-left: 10px;float: left;margin-top: 3px;"><input type="checkbox" name="usesig" id="usesig" class="pc" value="1" checked="checked">使用个人签名</label>');
                dlg("Use Ig Checkbox appended.");
            }
            $("#append_parent").on('DOMNodeInserted', hookReplyBtn);
            $(() => {
                // 底部快速回复增加选项
                $("#fastpostsubmit").after('<label for="usesig" style="margin-left: 10px;"><input type="checkbox" name="usesig" id="usesig" class="pc" value="1" checked="checked">使用个人签名</label>');
            });
        }
    };
    let fixImgZoom = {
        "runcase": () => { return MExt.ValueStorage.get("fixImgZoom") },
        "config": [{
            "id": "fixImgZoom",
            "default": true,
            "name": "优化图片缩放",
            "type": "check",
            "desc": "使用更现代的方法实现图片缩放."
        }],
        "style": `#img_scale {
    opacity: 0;
    position: absolute;
    right: 20px;
    bottom: 20px;
    background: #0006;
    transition-duration: .2s;
    color: white;
    padding: 10px;
    pointer-events: none;
    border-radius: 10px;
}

#imgzoom_zoom {
    height: auto;
    transition-duration: .2s
}

#imgzoom_zoomlayer {
    height: auto!important
}

#imgzoom {
    width: auto!important;
    height: auto!important
}`,
        "core": () => {
            let __zoom = zoom;
            let t = 0;
            // 初始化基本缩放信息对象
            let img = { width: 0, height: 0, top: 0, left: 0, radio: 1, scale: 1, orgwidth: 0 };
            // 缩放函数
            let resize = (width) => {
                    dlg("Image resizing...")
                    clearTimeout(t);
                    // 显示缩放比例
                    $("#img_scale").html(parseInt(img.scale * 100) + "%").css("opacity", 1);
                    t = setTimeout(() => { $("#img_scale").css("opacity", 0) }, 2000);
                    // 计算目标大小和位置
                    let ow = img.width;
                    img.width = width;
                    ow = (ow - img.width) / -2;
                    img.left -= ow;
                    img.top -= ow * img.radio;
                    // 修改
                    $("#imgzoom_zoom").css("width", img.width + "px");
                    $("#imgzoom").css("left", img.left + "px");
                    $("#imgzoom").css("top", img.top + "px");
                }
                // 保存基本信息
            let initP = () => {
                dlg("Init Picture info");
                img.width = parseInt($("#imgzoom_zoom").attr("width"));
                img.height = parseInt($("#imgzoom_zoom").attr("height"));
                img.radio = img.height / img.width;
                img.top = parseInt($("#imgzoom").css("top"));
                img.left = parseInt($("#imgzoom").css("left"));
                img.scale = 1;
                img.orgwidth = img.width;
            }
            zoom = (obj, zimg, nocover, pn, showexif) => {
                // 伪装成IE,使原函数的DOMMouseScroll事件监听器以可以被卸除的形式添加
                BROWSER.ie = 6;
                __zoom(obj, zimg, nocover, pn, showexif);
                // 防止翻车,改回去
                setTimeout(() => {
                    BROWSER.ie = 0;
                    dlg("IE canceled.")
                }, 1000);
                // 等待窗口出现
                let wait = setInterval(() => {
                    if ($("#imgzoom_zoom").length) {
                        dlg("Image found");
                        clearInterval(wait);
                        // 信息归零,准备下一次保存
                        img = { width: 0, height: 0, top: 0, left: 0, radio: 1, scale: 1, orgwidth: 0 };
                        // 显示遮罩
                        $("#imgzoom_cover").css("display", "unset");
                        // 判断是否已经监听事件,防止超级加倍
                        if ($("#imgzoom").attr("fixed") == "true") { return true; }
                        // 原始尺寸按钮事件
                        $("#imgzoom_adjust").on("click", () => {
                            dlg("return source size");
                            $("#imgzoom").css("transition-property", "opacity,top,left,transform");
                            img.width == 0 ? initP() : 0;
                            img.scale = 1;
                            resize($("#imgzoom_zoom").attr("width"));
                        });
                        // 屏蔽页面滚动
                        $("#imgzoom_cover").on("mousewheel DOMMouseScroll", (e) => {
                            if (e.ctrlKey || e.altKey || e.shiftKey) { return true; }
                            e.preventDefault();
                        });
                        // 卸除原函数监听器
                        $("#imgzoom")[0].onmousewheel = null;
                        // 增加显示缩放大小元素并监听事件
                        $("#imgzoom").append(`<span id="img_scale"></span>`).on("mousewheel DOMMouseScroll", (e) => {
                            // 判断是否按下功能键
                            if (e.ctrlKey || e.altKey || e.shiftKey) { dlg("Func key pressed."); return true; }
                            // 阻止滚动
                            e.preventDefault();
                            // 兼容火狐,正确判断滚轮方向
                            let scroll = e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -e.originalEvent.detail;
                            // 忽略无效滚动
                            if (scroll == 0) { return true; }
                            // 判断是否需要初始化
                            img.width == 0 ? initP() : 0;
                            // 规定需要显示过渡动画的属性
                            $("#imgzoom").css("transition-property", "opacity,top,left,transform");
                            // 判断是否过小
                            if (scroll < 0 && ((img.width < 350 && img.radio < 1) || (img.width * img.radio < 350 && img.radio >= 1))) {
                                // 回弹动画
                                dlg("Reach min size");
                                $("#imgzoom").css("transform", "scale(0.8)");
                                setTimeout(() => { $("#imgzoom").css("transform", "scale(1)"); }, 200);
                                return true;
                            }
                            // 修改缩放比例
                            img.scale += scroll > 0 ? 0.1 : -0.1;
                            // 判断比例是否过小
                            if (img.scale < 0.1) {
                                img.scale = 0.1;
                                // 回弹动画
                                dlg("Reach min size");
                                $("#imgzoom").css("transform", "scale(0.8)");
                                setTimeout(() => { $("#imgzoom").css("transform", "scale(1)"); }, 200);
                                return true;
                            }
                            // 缩放
                            resize(img.orgwidth * Math.pow(img.scale, 2));
                        }).attr("fixed", "true");
                        // 按下鼠标事件
                        $("#imgzoom").on("mousedown", (e) => {
                            // 按下鼠标时移除修改位置的过渡动画,使窗口跟手
                            dlg("Animate removed");
                            $("#imgzoom").css("transition-property", "opacity");
                        });
                        // 释放鼠标事件
                        $("#imgzoom").on("mouseup", (e) => {
                            // 改回去
                            $("#imgzoom").css("transition-property", "opacity,top,left,transform");
                            // 保存移动后的窗口位置
                            img.top = parseInt($("#imgzoom").css("top"));
                            img.left = parseInt($("#imgzoom").css("left"));
                            dlg("Animate added,Pos saved");
                        });
                    }
                }, 50);
            }
        }
    }
    let disableAutoplay = {
        "runcase": () => { return MExt.ValueStorage.get("disableAutoplay") },
        "config": [{
            "id": "disableAutoplay",
            "default": false,
            "name": "禁止BGM自动播放",
            "type": "check",
            "desc": "阻止页内BGM自动播放."
        }],
        "core": () => {
            let clearAutoPlay = () => {
                $("iframe[id*=iframe_mp3]:not([id*=no_autoplay])").each((i, v) => {
                    // 重构播放器,去除自动播放属性
                    let player = document.createElement("iframe");
                    let hidden = document.createElement("div");
                    hidden.id = v.id;
                    hidden.style.display = "none";
                    player.id = v.id + "_no_autoplay";
                    player.width = v.width;
                    player.height = v.height;
                    player.frameBorder = v.frameBorder;
                    player.allow = v.allow;
                    player.src = v.src.replace("&auto=1", "");
                    v.after(hidden);
                    v.after(player);
                    v.remove();
                    dlg("Canceled all autoplay");
                });
            };
            $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", () => { setTimeout(clearAutoPlay, 100); });
            $(clearAutoPlay);
        }
    };
    let rememberEditorMode = {
        "runcase": () => { return MExt.ValueStorage.get("remenberEditMode") },
        "config": [{
            "id": "remenberEditMode",
            "default": true,
            "name": "记忆编辑器模式",
            "type": "check",
            "desc": "记忆高级编辑器是纯文本模式还是即时模式."
        }],
        "core": () => {
            if (localStorage.getItem("MExt_EditMode") === null) {
                localStorage.setItem("MExt_EditMode", "false");
            }
            $(() => {
                dlg("Remenber Editor Mode actived.");
                $("#e_switchercheck").on("click", (e) => {
                    dlg("Editor mode switch.");
                    localStorage.setItem("MExt_EditMode", e.currentTarget.checked.toString());
                });
                if (localStorage.getItem("MExt_EditMode") == "true") {
                    dlg("Switch editor mode");
                    $("#e_switchercheck").click();
                }
            });
        }
    };
    let highlightThreads = {
        "runcase": () => { return MExt.ValueStorage.get("highlightThreads") },
        "config": [{
            "id": "highlightThreads",
            "default": true,
            "name": "帖子列表高亮",
            "type": "check",
            "desc": "列表高亮显示帖子类型."
        }],
        "style": `.tl .icn {
    background-color: rgba(200, 200, 200, 0.3)!important;
    background-image: linear-gradient(-90deg, rgb(251 242 219), transparent);
    border-left: 3px solid rgb(200, 200, 200);
    transition-duration: .2s;
}
.tl .icn.newReply {
    background-color: rgba(255, 136, 0, 0.3)!important;
    border-left: 3px solid rgb(255, 136, 0);
}

.tl .icn.newMember {
    background-color: rgba(110, 232, 115, 0.3)!important;
    border-left: 3px solid rgb(110, 232, 115);
}

.tl .icn.hotThread {
    background-color: rgba(235, 132, 132, 0.3)!important;
    border-left: 3px solid rgb(235, 132, 132);
}

.tl .icn.digest {
    background-color: rgba(0, 203, 214, 0.3)!important;
    border-left: 3px solid rgb(0, 203, 214);
}

.tl .icn.digest2 {
    background-color: rgba( 0, 161, 204, 0.3)!important;
    border-left: 3px solid rgb( 0, 161, 204);
}

.tl .icn.digest3 {
    background-color: rgba(0, 123, 194, 0.3)!important;
    border-left: 3px solid rgb(0, 123, 194);
}

.tl .icn.close {
    background-color: rgba(187, 187, 187, 0.3)!important;
    border-left: 3px solid rgb(187, 187, 187);
}

.tl .icn.forumSticker {
    background-color: rgba(161, 215, 252, 0.3)!important;
    border-left: 3px solid rgb(161, 215, 252);
}

.tl .icn.partSticker {
    background-color: rgba(110, 171, 235, 0.3)!important;
    border-left: 3px solid rgb(110, 171, 235);
}

.tl .icn.globalSticker {
    background-color: rgba(33, 106, 207, 0.3)!important;
    border-left: 3px solid rgb(33, 106, 207);
}

.tl .icn.poll {
    background-color: rgba(250, 123, 147, 0.3)!important;
    border-left: 3px solid rgb(250, 123, 147);
}

.tl .icn.debate {
    background-color: rgba(0, 153, 204, 0.3)!important;
    border-left: 3px solid rgb(0, 153, 204);
}`,
        "core": () => {
            let highlighting = () => {
                $('#moderate a[title*="有新回复"]').parent().addClass("newReply");
                $('#moderate img[alt="新人帖"]').parent().parent().children(".icn").addClass("newMember");
                $('#moderate img[alt="热帖"]').parent().parent().children(".icn").addClass("hotThread");
                //精华
                $('#moderate img[alt="digest"]').parent().parent().children(".icn").addClass("digest");
                $('#moderate img[title="精华 2"]').parent().parent().children(".icn").addClass("digest2");
                $('#moderate img[title="精华 3"]').parent().parent().children(".icn").addClass("digest3");
                $('#moderate a[title*="关闭的主题"]').parent().addClass("close");
                $('#moderate a[title*="本版置顶主题"]').parent().addClass("forumSticker");
                $('#moderate a[title*="分类置顶主题"]').parent().addClass("partSticker");
                $('#moderate a[title*="全局置顶主题"]').parent().addClass("globalSticker");
                $('#moderate a[title*="辩论"]').parent().addClass("debate");
                $('#moderate a[title*="投票"]').parent().addClass("poll");
                $('#moderate a[title*="悬赏"]').parent().addClass("newReply");
                $('#moderate a.s.xst[style*=color]').each((i, v) => {
                    v.parentNode.previousElementSibling.style.setProperty("background-color", v.style.color.replace(")", ",0.4)").replace("rgb(", "rgba("), "important");
                    v.parentNode.previousElementSibling.style.borderLeftColor = v.style.color;
                });
                dlg("Thread list highlighting done.");
            };
            $(highlighting);
            let waiter = 0;
            $(() => {
                let nxBtn = $("#autopbn");
                nxBtn.on("click", () => {
                    if (waiter == 0) {
                        waiter = setInterval(() => {
                            if (nxBtn.text() != "正在加载, 请稍后...") {
                                clearInterval(waiter);
                                waiter = 0;
                                highlighting();
                            }
                        }, 100);
                    }
                });
            });
        }
    };
    let fixAnchor = {
        "runcase": () => { return MExt.ValueStorage.get("fixAnchor") },
        "config": [{
            "id": "fixAnchor",
            "default": false,
            "name": "帖内锚点修复",
            "type": "check",
            "desc": "防止帖内锚点被意外的赋予样式."
        }],
        "style": `table.plhin td.t_f span[id]:not([id^=anchor_]), .fastpreview span[id]:not([id^=anchor_]) {
    display: none;
}`,
        "core": () => {
            let fix = () => {
                $("table.plhin td.t_f span[id]:not([id^=anchor_]),.fastpreview span[id]:not([id^=anchor_])").each((i, v) => {
                    $("a[href$=#" + v.id + "]").each((i, v) => {
                        v.href.replace("#" + v.id, "#anchor_" + v.id);
                    });
                    v.id = "anchor_" + v.id;
                });
                dlg('Anchor fixed.');
            }
            $(fix);
            $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", fix);
        }
    };
    let replaceFlash = {
    "runcase": () => { return MExt.ValueStorage.get("replaceFlash") },
    "config": [{
        "id": "replaceFlash",
        "default": true,
        "name": "Flash播放器替换",
        "type": "check",
        "desc": "将网易云Flash播放器替换成H5播放器."
    }],
    "core": () => {
        let replace = () => {
            $("span[id*=swf] embed").each((i, v) => {
                let player = document.createElement("iframe");
                if(v.src.indexOf("style/swf/widget.swf") == -1){
                    return;
                }
                player.src = v.src.replace("style/swf/widget.swf", "outchain/player").replace("sid=", "id=");
                player.width = v.width;
                player.height = v.height;
                player.frameBorder = "no";
                player.allow = "autoplay; fullscreen";
                player.id = v.parentElement.id + "_no_autoplay";
                v.parentElement.after(player);
                v.parentElement.remove();
            });
        }
        $(replace);
        $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", replace);
    }
};
    let restrictMedalLine = {
        "runcase": () => { return MExt.ValueStorage.get("maxMedalLine") >= 0 },
        "config": [{
            "id": "maxMedalLine",
            "default": -1,
            "type": "num",
            "name": "最大勋章行数",
            "desc": "限制楼层勋章的最大行数,提升鼠标滚轮寿命,设置为-1以禁用此功能."
        }],
        "style": `.md_ctrl span.toggle-all {
            width: 125px;
            display: block;
            position: absolute;
            bottom: 0;
            text-align: center;
            left: 0;
            padding: 30px 0px 5px 0px;
            background-image: linear-gradient(0deg, #e3c99e, #e3c99e, transparent);
            color: #3e6c99;
            cursor: pointer;
            user-select: none;
        }

        .md_ctrl {
            position: relative;
            overflow-y: hidden;
            max-height: ` + (Stg.get('maxMedalLine') * (Stg.get('hoverableMedal') ? 60 : 55) + 45).toString() + `px!important;
            transition:unset!important;
        }

        .md_ctrl.show-all {
            max-height: 3000px!important;
            padding-bottom: 40px;
        }`,
        "core": () => {
            let restrict = () => {
                // 判断是否在个人主页
                if ($("#uhd").length > 0) { $("#restrictMedalLine").remove(); return; }
                // 限制勋章行数
                dlg("Restricting line...");
                $('.md_ctrl:not([restrictline])').attr("restrictline", "true").append($("<span class=\"toggle-all\">展开/收起勋章</span>").on("click", (e) => { $(e.target).parent().toggleClass("show-all") })).each((i, v) => {
                    if ((v.childElementCount - 2 <= Stg.get('maxMedalLine') * 3 && Stg.get('hoverableMedal')) || (v.firstChild.childElementCount - 2 <= Stg.get('maxMedalLine') * 3 && !Stg.get('hoverableMedal'))) {
                        v.removeChild(v.lastChild);
                    }
                });
            }
            $(restrict);
            $(this).on("DiscuzAjaxGetFinished DiscuzAjaxPostFinished", restrict);
        }
    };
    let quickAt = {
        "runcase": () => { return MExt.ValueStorage.get("quickAtList").length > 0 },
        "config": [{
            "id": "quickAtList",
            "default": "",
            "name": "快速 @ 列表",
            "type": "text",
            "desc": "按下Ctrl+Shift+A/或者按钮以快速在当前输入框内插入预定义的@用户名代码.用户名之间用\",\"(半角逗号)分隔."
        }],
        "style": `#fastpostatList.in_editorbtn, #postatList {
            background-size: 54px;
            background-position: -23px 3px;
        }

        #fastpostatList, #postatList {
            background-image: url(` + staticRes.atBtnImage + `);
            background-size: 50px;
            background-position: -6px 2px;
        }`,
        "core": () => {
            let getAtCode = () => {
                    // 分隔list
                    let quickAtList = Stg.get('quickAtList').split(",");
                    let atstr = "";
                    //拼接@代码
                    $(quickAtList).each((i, v) => {
                        atstr += "@" + v + " ";
                    });
                    return atstr;
                }
                // 将函数暴露到全局
            MExt_Func_getAtCode = getAtCode;
            // 监听按键事件
            $(document).on("keydown", (e) => {
                if (e.shiftKey && e.ctrlKey && e.keyCode == 65) {
                    // 判断是否在输入框内
                    if (($(document.activeElement).prop("nodeName") == "INPUT" && $(document.activeElement).prop("type") == "text")) {
                        // 拼接方法插入
                        $(document.activeElement).val($(document.activeElement).val() + getAtCode());
                        dlg("@ string added");
                    } else if ($(document.activeElement).prop("nodeName") == "TEXTAREA") {
                        // discuz内建函数插入
                        seditor_insertunit('fastpost', getAtCode(), '');
                        dlg("@ string added");
                    }
                }
            });
            // 高级编辑模式插入@代码
            $(() => {
                if ($("#e_iframe").length) {
                    // 由于高级模式的输入框是iFrame,无法直接监听,故再次监听高级输入框的按键事件
                    $($("#e_iframe")[0].contentWindow).on("keydown", (e) => {
                        if (e.shiftKey && e.ctrlKey && e.keyCode == 65) {
                            // 判断是否在输入框内
                            if ($(document.activeElement).prop("nodeName") == "IFRAME") {
                                //discuz内建函数插入
                                insertText(getAtCode());
                                dlg("@ string added");
                            }
                        }
                    });
                }
            });
            let hookReplyBtn = () => {
                if ($("#postatList").length > 0) { return false; }
                $("#postat.fat").after('<a id="postatList" href="javascript:;" title="快速@" onclick="seditor_insertunit(\'post\',MExt_Func_getAtCode(), \'\');">快速@</a> ');
                dlg("Reply at bottons appends.");
            }
            $("#append_parent").on('DOMNodeInserted', hookReplyBtn);
            $(() => {
                $("#fastpostat").after('<a id="fastpostatList" href="javascript:;" title="快速@" class="" onclick="seditor_insertunit(\'fastpost\',MExt_Func_getAtCode(), \'\');">快速@</a> ');
                $("#e_adv_s1").append('<a id="fastpostatList" href="javascript:;" title="快速@" class="in_editorbtn" onclick="insertText(MExt_Func_getAtCode());">快速@</a>');
            });
        }
    };
    let miscFix = {
        "runcase": () => { return /^[01]*$/.exec(Stg.get('miscFix')) },
        "config": [{
            "id": "miscFix",
            "default": "",
            "name": "杂项修复",
            "type": "text",
            "desc": "此值用于规定杂项修复的行为,默认值为空,修改为0000000000以关闭全部.错误的值会使该项失效.详情请查阅源码."
        }],
        "style": '',
        "core": () => {
            let fixconf = Stg.get('miscFix').split("");
            let fixlist = [
                // 暗牧悬浮预览
                { "style": ".t_f font[style*=\"background-color:black\"], .t_f font[style*=\"background-color:#000\"] {transition-duration: .3s;transition-delay: .5s;cursor: default;}.t_f font[style*=\"background-color:black\"]:hover, .t_f font[style*=\"background-color:#000\"]:hover {transition-delay: 0s;background-color: transparent!important;}" },
                //增加空方法,用于修复论坛的一个报错.
                { "script": "announcement = () => {};relatekw = ()=>{};" },
                //修复页脚问题
                { "style": ".mc_map_wp{min-height:calc(100vh - 202px)!important;}" },
                //修复用户组页面不对齐的问题
                { "style": ".tdats .tb{margin-top:0px}" },
                // 修复编辑器@超级加倍的问题
                { "script": "$(()=>{if(typeof setEditorEvents != \"undefined\"){let __setEditorEvents = setEditorEvents;setEditorEvents= ()=>{ __setEditorEvents();setEditorEvents=()=>{};}}})" },
                // 允许改变个人签名编辑框大小
                { "style": "#sightmlmessage{resize:vertical;}" },
                // 按住shift点击带有超链接的图片则不打开链接
                { "script": `$(()=>{$("img.zoom").parent().each((i,v)=>{if(v.nodeName=="A"){$(v).on("click",(e)=>{console.log(e);if(e.shiftKey){e.preventDefault();}})}})})` },
                // 修复某些页面书框被撕裂的问题
                { "script": "$(()=>{if(!$('.mc_map_wp .mc_map_border_foot').length){$('.mc_map_border_foot').remove();$('.mc_map_wp').append('<div class=\"mc_map_border_foot\"></div>')}})" },
                 // 主动聚焦编辑器iframe,修复报错问题.
                { "script": "$(()=>{if(typeof wysiwyg !='undefined' && wysiwyg){editwin.document.body.focus()};})" },
                // 小提示样式修复
                { "style": ".pc_inner{padding-left:12px}" }
            ];
            let styleContent = "";

            $(fixlist).each((i, v) => {
                if (typeof fixconf[i] == "undefined") { fixconf[i] = "1" }
                if (fixconf[i] === "1") {
                    // 拼接样式字符串
                    styleContent += fixlist[i].style ? fixlist[i].style : "";
                    // 执行脚本
                    eval(fixlist[i].script ? fixlist[i].script : "");
                }
            });
            MExt.Units.appendStyle(styleContent);
        }
    };
    let myReportReason = {
        "runcase": () => { return MExt.ValueStorage.get("myReportReason").length > 0 },
        "config": [{
            "id": "myReportReason",
            "default": "",
            "name": "自定义举报理由",
            "type": "textarea",
            "desc": "在举报时提供自定义的举报理由,一行一个理由."
        }],
        "core": () => {
            // 获得举报内容列表函数
            let getReasons = () => {
                    // 分隔list
                    let reportReason = Stg.get('myReportReason').split("\n");
                    let rrstr = "<p class=\"mtn mbn\">";
                    //拼接HTML
                    $(reportReason).each((i, v) => {
                        rrstr += '<label><input type="radio" name="report_select" class="pr" onclick="$(\'report_other\').style.display=\'none\';$(\'report_msg\').style.display=\'none\';$(\'report_message\').value=\'' + v + '\'" value="' + v + '"> ' + v + '</label><br>';
                    });
                    rrstr += "</p>";
                    return rrstr;
                }
                // 举报按钮钩子函数
            let hookReportWin = () => {
                if ($("#report_reasons[appended]").length > 0) { return false; };
                let reportContent = getReasons();
                $("#report_reasons").attr("appended", "true").before(reportContent);
            }
            $("#append_parent").on('DOMNodeInserted', hookReportWin);
        }
    };
    let myCSS = {
        "runcase": () => { return MExt.ValueStorage.get("myCSS").length > 0 },
        "config": [{
            "id": "myCSS",
            "default": "",
            "name": "自定义CSS",
            "type": "textarea",
            "desc": "在框内的CSS会被加载到页面内,可自由发挥."
        }],
        "style": MExt.ValueStorage.get("myCSS")
    };
    let myLinks = {
        "runcase": () => { return MExt.ValueStorage.get("myLinks").length > 0 },
        "config": [{
            "id": "myLinks",
            "default": "",
            "name": "自定义工具菜单链接",
            "type": "textarea",
            "desc": "在右上角\"工具\"菜单里添加自定义的链接,以\"[名称] [链接]\"的格式添加(如\"个人主页 home.php\"),一行一个."
        }],
        "core": () => {
            // 分割
            $(Stg.get('myLinks').split("\n")).each((i, v) => {
                try {
                    //判断是否合法
                    if (!v.split(" ")[1] || !v.split(" ")[0]) { return true; }
                    // 添加
                    $(() => { $("#usertools_menu").append('<li><a href="' + v.split(" ")[1] + '">' + v.split(" ")[0] + '</a></li>') });
                } catch (ignore) {}
            });
        }
    };
    MExt.exportModule(fixCodeBlock, queryMessage, rememberPage, animationGoToTop, pinnerTopBar, fixTopBarPopMenu, hoverableMesdal, viewWarns, removeLinkWarn, useIgInQuickReply, fixImgZoom, disableAutoplay, rememberEditorMode,
        highlightThreads, fixAnchor, replaceFlash, restrictMedalLine, quickAt, miscFix, myReportReason, myCSS, myLinks);
})();