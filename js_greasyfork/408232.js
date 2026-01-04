// ==UserScript==
// @name         MCBBS Extender Core
// @namespace    https://i.zapic.cc
// @version      v2.0.3
// @description  MCBBS模块化优化框架
// @author       Zapic
// @match        https://*.mcbbs.net/*
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/408232/MCBBS%20Extender%20Core.user.js
// @updateURL https://update.greasyfork.org/scripts/408232/MCBBS%20Extender%20Core.meta.js
// ==/UserScript==

//Core
const MExt_version = "2.0.3";
const MExt_vercode = "121043";
(() => {
    //夹带私货
    console.log(" %c Zapic's Homepage %c https://i.zapic.cc ", "color: #ffffff; background: #E91E63; padding:5px;", "background: #000; padding:5px; color:#ffffff");
    // jQuery检查
    if (typeof jQuery == "undefined") {
        console.error("This page does NOT contain JQuery,MCBBS Extender will not work.");
        return;
    }
    //在手机页面主动禁用
    if (document.getElementsByTagName('meta').viewport) {
        console.log("MCBBS Extender not fully compatible with Moblie page,exit manually");
        return;
    }
    const selfMd = {
        "meta": {
            "id": "MExt_Core",
            "name": "MCBBS Extender Core Loader",
            "version": "2.0.3",
            "updateInfo":[]
        }
    }

    // 初始化配置
    let valueList = null;
    const configList = [];
    const moduleList = {};
    // 加载ValueStorage
    try {
        valueList = JSON.parse(localStorage.getItem("MExt_config"));
        if (typeof valueList != "object" || valueList == null) {
            valueList = {};
            localStorage.setItem("MExt_config", "{}")
        }
    } catch (ig) {
        valueList = {};
        localStorage.setItem("MExt_config", "{}")
    }
    // 导出模块
    const exportModule = (...modules) => {
        for (let m of modules) {
            try {
                moduleLoader(m);
                dispatchEvent(new CustomEvent("MExtModuleLoaded",{"detail":m.meta}));
            } catch (e) {
                console.error("Error occurred while try to load a module:\n" + e);
            }
        }
    }
    const dlg = (m) => {
        console.debug("[MCBBS Extender]" + m);
    };
    const setValue = (name, val) => {
        valueList[name] = val;
        localStorage.setItem("MExt_config", JSON.stringify(valueList));
    }
    const getValue = (name) => {
        return valueList[name];
    }
    const deleteValue = (name) => {
        delete valueList[name];
        localStorage.setItem("MExt_config", JSON.stringify(valueList));
    }
    const appendStyle = (style) => {
        let s = document.createElement("style");
        s.className = "MExtStyle";
        s.innerHTML = style;
        document.head.appendChild(s);
    };
    const getRequest = (variable, url = "") => {
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
    const moduleLoader = (module) => {
        // 载入配置项
        if (typeof module.meta == "undefined" || typeof module.meta.id !== "string") {
            throw new Error("Invalid module meta");
        }
        moduleList[module.meta.id] = module.meta;
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
        if (typeof module.case == "function") {
            if (!module.case()) {
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

    // 对外暴露API
    const MExt = {
        "exportModule": exportModule,
        "jQuery": unsafeWindow.jQuery,
        "configList": configList,
        "moduleList": moduleList,
        "versionName": MExt_version,
        "versionCode": MExt_vercode,
        "Storage": {
            "get": getValue,
            "set": setValue,
            "delete": deleteValue
        },
        "Units": {
            "appendStyle": appendStyle,
            "getRequest": getRequest,
            "debugLog": dlg
        }
    };
    unsafeWindow.MExt = MExt;
    unsafeWindow.dispatchEvent(new CustomEvent("MExtLoaded",{bubbles: true}));
    exportModule(selfMd);
})();

// Discuz UI Operate Event Dispatcher
(async ()=>{
    await new Promise(_ => { !unsafeWindow.MExt ? unsafeWindow.addEventListener("MExtLoaded", __ => { _(unsafeWindow.MExt) }) : _(unsafeWindow.MExt)});
    const removeHandler = (r) => {
        switch (r.target.nodeName) {
            case "TBODY":
                if (typeof r.target.id != "undefined") {
                    if (r.target.id.lastIndexOf("normalthread_") >= 0) {
                        r.target.dispatchEvent(new CustomEvent("ThreadPreviewClosed",{bubbles: true}));
                    }
                }
                break;
            case "DIV":
                if (typeof r.target.id != 'undefined' && r.target.id.lastIndexOf("threadPreview_") >= 0) {
                    if (r.removedNodes[0].nodeName == "SPAN" && r.removedNodes[0].innerText == " 请稍候...") {
                        r.target.dispatchEvent(new CustomEvent("ThreadPreviewOpened",{bubbles: true}));
                    }
                } else if (r.removedNodes.length >= 3 && r.target.id.lastIndexOf("post_") >= 0) {
                    if (r.removedNodes[0].nodeName == "A" && r.removedNodes[0].name == "newpost" && r.removedNodes[0].parentNode != null) {
                        r.target.dispatchEvent(new CustomEvent("ThreadFlushStarted",{bubbles: true}));
                    }
                } else if (r.target.id == "append_parent") {
                    if (r.removedNodes[0].nodeName == "DIV") {
                        if (r.removedNodes[0].id == "fwin_rate") {
                            r.target.dispatchEvent(new CustomEvent("RateWindowClosed",{bubbles: true}));
                        } else if (r.removedNodes[0].id == "fwin_reply") {
                            r.target.dispatchEvent(new CustomEvent("ReplyWindowClosed",{bubbles: true}));
                        } else if (typeof r.removedNodes[0].id != 'undefined' && r.removedNodes[0].id.lastIndexOf("fwin_miscreport") >= 0) {
                            r.target.dispatchEvent(new CustomEvent("ReportWindowClosed",{bubbles: true}));
                        }
                    }
                }
                break;
        }
    }
    const addHandler = (r) => {
        switch (r.target.nodeName) {
            case "DIV":
                if (typeof r.target.id != "undefined") {
                    if (r.target.id.lastIndexOf("threadPreview_") >= 0) {
                        if (r.addedNodes[0].nodeName == "SPAN" && r.addedNodes[0].innerText == " 请稍候...") {
                            r.target.dispatchEvent(new CustomEvent("ThreadPreviewPreOpen",{bubbles: true}));
                        }
                    } else if (r.addedNodes.length >= 3 && r.target.id.lastIndexOf("post_") >= 0) {
                        if (r.addedNodes[0].nodeName == "A" && r.addedNodes[0].name == "newpost" && r.addedNodes[0].parentNode != null) {
                            r.target.dispatchEvent(new CustomEvent("ThreadFlushFinished",{bubbles: true}));
                        }
                    } else if (r.target.id == "append_parent") {
                        if (r.addedNodes[0].nodeName == "DIV") {
                            if (r.addedNodes[0].id == "fwin_rate") {
                                r.addedNodes[0].dispatchEvent(new CustomEvent("RateWindowPreOpen",{bubbles: true}));
                            } else if (r.addedNodes[0].id == "fwin_reply") {
                                r.addedNodes[0].dispatchEvent(new CustomEvent("ReplyWindowPreOpen",{bubbles: true}));
                            } else if (typeof r.addedNodes[0].id != 'undefined' && r.addedNodes[0].id.lastIndexOf("fwin_miscreport") >= 0) {
                                r.addedNodes[0].dispatchEvent(new CustomEvent("ReportWindowPreOpen",{bubbles: true}));
                            }
                        }
                    } else if (r.target.id === "") {
                        if (r.target.parentElement != null && r.target.parentElement == "postlistreply") {
                            r.target.dispatchEvent(new CustomEvent("NewReplyAppended",{bubbles: true}));
                        }
                    }
                }
                break;
            case "A":
                if (r.addedNodes[0].nodeName == "#text" && typeof tid == "undefined") {
                    if (r.addedNodes[0].nodeValue == "正在加载, 请稍后...") {
                        r.target.dispatchEvent(new CustomEvent("ThreadsListLoadStart",{bubbles: true}));
                    } else if (r.addedNodes[0].nodeValue == "下一页 »") {
                        r.target.dispatchEvent(new CustomEvent("ThreadsListLoadFinished",{bubbles: true}));
                    }
                }
                break;
            case "TD":
                if (r.target.id == "fwin_content_rate" && r.addedNodes[0].nodeName == "DIV" && r.addedNodes[0].id == "floatlayout_topicadmin") {
                    r.target.dispatchEvent(new CustomEvent("RateWindowOpened",{bubbles: true}));
                }
                if (r.target.id == "fwin_content_reply" && r.addedNodes[0].nodeName == "H3" && r.addedNodes[0].id == "fctrl_reply") {
                    r.target.dispatchEvent(new CustomEvent("ReplyWindowOpened",{bubbles: true}));
                }
                if (typeof r.target.id != 'undefined' && r.target.id.lastIndexOf("fwin_content_miscreport") >= 0 && r.addedNodes[0].nodeName == "H3" && r.addedNodes[0].id.lastIndexOf("fctrl_miscreport") >= 0) {
                    r.target.dispatchEvent(new CustomEvent("ReportWindowOpened",{bubbles: true}));
                }
                break;
        }
    }
    const mainHandler = (r) => {
        if (r.type == "childList") {
            if (r.addedNodes.length > 0) {
                addHandler(r);
            }
            if (r.removedNodes.length > 0) {
                removeHandler(r);
            }
        }
    }
    let O = new MutationObserver((e) => {
        for (let record of e) {
            mainHandler(record);
        }
    });
    document.addEventListener("DOMContentLoaded",()=>{
        O.observe(document.body, { childList: true, subtree: true });
    });
    // 钩住DiscuzAjax函数,使其触发全局事件
    const __ajaxpost = unsafeWindow.ajaxpost;
    unsafeWindow.ajaxpost = (formid, showid, waitid, showidclass, submitbtn, recall) => {
        let relfunc = () => {
            if (typeof recall == 'function') {
                recall();
            } else {
                eval(recall);
            }
            this.dispatchEvent(new CustomEvent("DiscuzAjaxPostFinished",{bubbles: true}));
        }
        __ajaxpost(formid, showid, waitid, showidclass, submitbtn, relfunc);
    }
    const __ajaxget = unsafeWindow.ajaxget;
    unsafeWindow.ajaxget = (url, showid, waitid, loading, display, recall) => {
        let relfunc = () => {
            if (typeof recall == 'function') {
                recall();
            } else {
                eval(recall);
            }
            this.dispatchEvent(new CustomEvent("DiscuzAjaxGetFinished",{bubbles: true}));
        }
        __ajaxget(url, showid, waitid, loading, display, relfunc);
    }
})();

// Config Panel
(async () => {
    const MExt = await new Promise(_ => { !unsafeWindow.MExt ? unsafeWindow.addEventListener("MExtLoaded", __ => { _(unsafeWindow.MExt) }) : _(unsafeWindow.MExt)});
    const $ = MExt.jQuery;
    const Md = {
        "meta": {
            "id": "MExt_Config",
            "name": "MCBBS Extender 设置",
            "version": "2.0.3",
            "updateInfo": []
        },
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
        }`
    };
    MExt.exportModule(Md);
    const getRequest = MExt.Units.getRequest;
    $(() => {
        // 发送警告
        if (location.pathname == "/forum.php" && getRequest('mod') == "post" && getRequest('action') == "newthread" && getRequest('fid') == "246") {
            const alertWin = document.createElement("div");
            alertWin.style = "max-width:430px;position: fixed; left: 20px; top: 80px; z-index: 9999; transform: matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025) translateX(-120%); background: rgba(228, 0, 0, 0.81); color: white; padding: 15px; transition-duration: 0.3s; border-radius: 5px; box-shadow: rgba(0, 0, 0, 0.66) 2px 2px 5px 0px;";
            alertWin.innerHTML = `<h1 style="font-size: 3em;float: left;margin-right: 12px;font-weight: 500;margin-top: 6px;">警告</h1><span style="font-size: 1.7em;">您正在向反馈与投诉版发表新的帖子</span><br>如果您正在向论坛报告论坛内的Bug,请先关闭此脚本再进行一次复现,以确保Bug不是由MCBBS Extender造成的.`;
            document.body.appendChild(alertWin);
            setTimeout(() => { alertWin.style.transform = "matrix3d(1, 0, 0, 0.0001, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1.025)"; }, 10);
            setTimeout(() => { alertWin.style.transform = "none"; }, 300);
            setTimeout(() => { alertWin.style.transform = "translateX(-120%)"; }, 10000);
        }
        // 设置界面初始化
        const btnContainer = document.createElement("li");
        const btnMExt = document.createElement("a");
        btnMExt.href = "javascript: void(0);";
        btnMExt.id = "MExt_config";
        btnMExt.innerHTML = "MCBBS Extender 设置";
        btnContainer.appendChild(btnMExt);
        const target = document.querySelector("#user_info_menu .user_info_menu_btn");
        if(target == null) return;
        target.appendChild(btnContainer);
        btnMExt.addEventListener("click", () => {
            let confwinContent = '<style>body{overflow:hidden}.altw{width:700px;max-width:95vh;}.alert_info {background-image: unset;padding-left: 20px;padding-right: 17px;}</style><div class="conf_contain">';
            const inputType = {
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
            unsafeWindow.showDialog(
                confwinContent,
                "confirm",
                "MCBBS Extender 设置",
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
                        unsafeWindow.showDialog("设置已保存,刷新生效<style>.alert_info{background:url(https://www.mcbbs.net/template/mcbbs/image/right.gif) no-repeat 8px 8px}</style>", "confirm", "", () => { location.reload() }, true, () => { }, "", "刷新", "确定");
                    });
                },
                true,
                () => { },
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
})();

// Update Manager
(async () => {
    const MExt = await new Promise(_ => { !unsafeWindow.MExt ? unsafeWindow.addEventListener("MExtLoaded", __ => { _(unsafeWindow.MExt) }) : _(unsafeWindow.MExt)});
    MExt.exportModule({
        "meta": {
            "id": "MExt_updateManager",
            "name": "MCBBS Extender Update Manager",
            "version": "2.0.3",
            "updateInfo": []
        }
    });
    if (localStorage.getItem("MExt_UpdateMgr") == null) {
        localStorage.setItem("MExt_UpdateMgr", JSON.stringify(MExt.moduleList));
        unsafeWindow.showDialog("<b>欢迎使用MCBBS Extender</b>.<br>脚本本身不包含任何功能,请到<a style=\"color: #E91E63\" href=\"https://github.com/Proj-MExt/Modules-Repo\">模块仓库</a>寻找模块.<br>设置按钮已经放进入了您的个人信息菜单里,如需调整设置请在个人信息菜单里查看.", "right", "欢迎", () => {
            unsafeWindow.showMenu('user_info');
            unsafeWindow.MExt.jQuery("#MExt_config").css("background-color", "#E91E63").css("color", "#fff");
            setTimeout(() => {
                unsafeWindow.hideMenu('user_info_menu');
                unsafeWindow.MExt.jQuery("#MExt_config").css("background-color", "").css("color", "");
            }, 3000);
        });
        return;
    }
    let updateContent = '';
    let source = null;
    try {
        source = JSON.parse(localStorage.getItem("MExt_UpdateMgr"));
    } catch(e){
        localStorage.setItem("MExt_UpdateMgr", JSON.stringify(MExt.moduleList));
        return;
    }finally {
        localStorage.setItem("MExt_UpdateMgr", JSON.stringify(MExt.moduleList));
    }
    const compareVer = (b,a) => {
        return [b,a][0] != [b,a].sort()[0];
    }
    for (let m in MExt.moduleList ){
        if(typeof source[m] != "undefined" && typeof MExt.moduleList[m].version != "undefined"){
            if(compareVer(MExt.moduleList[m].version,source[m].version)){
                if(typeof MExt.moduleList[m].updateInfo !="undefined" && MExt.moduleList[m].updateInfo.length > 0){
                    updateContent += "<b>" + (typeof MExt.moduleList[m].name == "undefinded" ? MExt.moduleList[m].id : MExt.moduleList[m].name) + "</b> " + source[m].version + " &gt; " + MExt.moduleList[m].version + "<br>";
                    for(let info of MExt.moduleList[m].updateInfo){
                        updateContent += info + "<br>"
                    }
                }
            }
        }
    }
    if(updateContent == "") return;
    unsafeWindow.showDialog("<b>模块已更新</b>" + updateContent, "right");
})();

