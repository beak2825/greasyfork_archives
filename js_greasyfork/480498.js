// ==UserScript==
// @name         lowerCodeHelper
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  低代码平台助手
// @author       Ziker
// @match        https://ops.iyunquna.com/63008/*
// @match        http://localhost:63342/api/file/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://favicon.qqsuu.cn/work.yqn.com
// @note         2023年12月18日20:26:31 V0.3.4 fix RT 显示BUG
// @note         2024年01月04日11:50:57 V0.3.5 支持自定义包名接口打开文件
// @note         2024年01月10日11:00:40 V0.3.6 修复子流程,mq,job 跳转不显示
// @note         2024年01月15日19:46:34 V0.3.7 修复自定义包名 子流程,mq,job 不跳转，MQ 消费RT显示
// @note         2024年01月19日17:22:12 V0.3.8 顶部工具栏按钮新增多个工具按钮
// @note         2024年01月28日18:32:49 V0.3.9 修复Bug
// @note         2024年02月02日19:59:18 V0.4.0 修复导致游览器卡顿的问题
// @grant GM_openInTab
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @run-at       document-body
// @noframes
// @license           AGPL License
// @downloadURL https://update.greasyfork.org/scripts/481147/lowerCodeHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/481147/lowerCodeHelper.meta.js
// ==/UserScript==

window.jq = $.noConflict(true);

(function (window) {
    window.pageHelper = {
        // 等待元素可见
        waitElementVisible(visibleTag, fun) {
            const observer = new MutationObserver(() => {
                // 如果是目标元素存在
                if (document.querySelector(visibleTag)) {
                    observer.disconnect();
                    fun();
                }
            });
            observer.observe(document.body, {
                attributes: true, childList: true, subtree: true, characterData: true
            });
        },
        getCurrentApiId() {
            return unsafeWindow.activeKey
        },
        getAppId() {
            return parseInt(new URLSearchParams(window.location.href.split('?')[1]).get('appId'))
        },
        sleep(duration) {
            return new Promise(resolve => {
                setTimeout(resolve, duration)
            })
        },
        showToast(msg, duration) {
            // 显示提示
            duration = isNaN(duration) ? 3000 : duration
            const m = document.createElement('div')
            m.innerHTML = msg
            m.style.cssText = "display: flex;justify-content: center;align-items: center;width:60%; min-width:180px; " +
                "background:#000000; opacity:0.98; height:auto;min-height: 50px;font-size:25px; color:#fff; " +
                "line-height:30px; text-align:center; border-radius:4px; position:fixed; top:85%; left:20%; z-index:999999;"
            document.body.appendChild(m)
            setTimeout(function () {
                const d = 0.5
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in'
                m.style.opacity = '0'
                setTimeout(function () {
                    document.body.removeChild(m)
                }, d * 1000)
            }, duration)
        },
        // 关闭窗口
        closeWindow() {
            window.opener = null
            window.open('', '_self')
            window.close()
        },
        formatString(str, len, padding) {
            const diff = len - str.toString().length
            if (diff > 0) {
                return padding.repeat(diff) + str
            } else {
                return str
            }
        },
        initSetting() {
            const customSetting = document.createElement("div")
            document.body.appendChild(customSetting)
            customSetting.innerHTML = `
                <div id="copy-setting"
                     style="display: none;position: absolute;top: 0;right: 0;background-color: #fff3f3;padding: 10px;width: 600px;z-index: 9999">
                    <p>拷贝动作</p>
                    <p><label>Copy File Id <input type="radio" name="copyValue" value="1" /></label></p>
                    <p><label>Rest Api Open File <input type="radio" name="copyValue" value="2" checked/></label>&nbsp;&nbsp;&nbsp;较新版本IDEA需要下载 <a target="_blank" href="https://plugins.jetbrains.com/plugin/19991-ide-remote-control">IDE Remote Control </a> 插件</p>
                    <p><label>ToolBox Open File <input type="radio" name="copyValue" value="3" /></label>&nbsp;&nbsp;&nbsp;需要下载 <a target="_blank" href="https://www.jetbrains.com/toolbox-app/">Jetbrains ToolBox</a> 工具箱软件</p>
                    <div id="projectPath" style="visibility: visible"><p><label><input name="path" style="width: 100%" type="text" placeholder="项目路径截止到 src 前  E:/yqnProject/yqn-wms/yqn-wms-rest-provider/"/></label></p></div>
                    <p style="visibility: hidden"><label>同时打开编排IDE <input type="checkbox" name="openIDE" /></label>&nbsp;&nbsp;&nbsp;</p>
                    <div style="display: flex;margin: 5px;justify-content: space-between">
                        <button id="save" lang="zh" type="button" class="ant-btn ant-btn-default perf-tracked yqn-button"><span
                                style="margin-left: 5px;">save</span></button>
                        <button id="close" lang="zh" type="button" class="ant-btn ant-btn-default perf-tracked yqn-button"><span
                                style="margin-left: 5px;">close</span></button>
                    </div>
                </div>
`
            let copyValue = localStorage.getItem("copyValue")
            copyValue = copyValue === null || copyValue === undefined ? 1 : copyValue
            document.querySelector('input[name="copyValue"][value="' + copyValue + '"]').checked = true
            document.getElementById("projectPath").style.visibility = copyValue === "2" ? "visible" : "hidden"

            let path = localStorage.getItem("path")
            document.querySelector('input[name="path"]').value = path === null || path === undefined ? null : path

            let openIDE = JSON.parse(localStorage.getItem("openIDE"))
            document.querySelector('input[name="openIDE"]').checked = openIDE === null || openIDE === undefined ? false : openIDE

            const radios = document.querySelectorAll('input[name="copyValue"]')
            for (let i = 0; i < radios.length; i++) {
                radios[i].onchange = () => {
                    const remoteRadio = document.querySelector('input[name="copyValue"]:checked')
                    document.getElementById("projectPath").style.visibility = remoteRadio.value === "2" ? "visible" : "hidden"
                }
            }
            document.getElementById("save").addEventListener("click", () => {
                const remoteRadio = document.querySelector('input[name="copyValue"]:checked').value
                const pathInput = document.querySelector('input[name="path"]').value
                const openIDEValue = document.querySelector('input[name="openIDE"]').checked
                if (remoteRadio === '2' && (pathInput === null || pathInput.length === 0)) {
                    this.showToast("路径不可为空", 1000)
                } else {
                    localStorage.setItem("copyValue", remoteRadio)
                    localStorage.setItem("path", pathInput)
                    localStorage.setItem("openIDE", JSON.stringify(openIDEValue))
                    this.showToast("保存成功", 1000)
                }
            })
            document.getElementById("close").addEventListener("click", () => {
                document.getElementById("copy-setting").style.display = "none"
            })
        }
    }
})(window);


(function () {
    let historyTrace = ''
    'use strict';
    let appName = null
    let packageNameMap = []
    let typeMap = []
    let mutationObserverApiList = []
    jq(document).ready(function () {
        // 关闭第二种文件打开方位打开的网页
        if (window.location.href.indexOf("localhost:63342/api/file/") >= 0) {
            window.pageHelper.closeWindow()
            return
        }
        // 监听api tab变动
        waitObserve(".tabs-bar", () => {
            // 关闭刚刚加入的所有变动监听
            for (let i = 0; i < mutationObserverApiList.length; i++) {
                mutationObserverApiList[i].disconnect()
            }
            mutationObserverApiList = []
            // bar切换关闭首页显示
            const homePage = document.querySelector(".tab-home-page");
            const tabsBar = document.querySelector(".tabs-bar");
            if (nonNull(homePage) && nonNull(tabsBar) && nonNull(tabsBar.childNodes) && tabsBar.childNodes.length > 0) {
                homePage.style.display = 'none'
            }
            // 监听属性面板变动
            const appPanelTag = ".tab-content-presentation-components.theia-tab-" + window.pageHelper.getCurrentApiId()
            waitObserve(appPanelTag + " .p-8", () => {
                const p8 = document.querySelector(appPanelTag + " .p-8")
                const panel = p8.querySelector(".ant-form.ant-form-vertical.yqn-form")
                if (nonNull(panel) && isNull(panel.querySelector(".customScriptInfo"))) {
                    const div = document.createElement("div")
                    div.className = "customScriptInfo"
                    panel.appendChild(div)
                    // 获取当前 NodeName
                    const childProcessNode = panel.querySelector("#code")
                    const codeSpan = p8.querySelector(".dashboard-code span")
                    if (isNull(childProcessNode) && isNull(codeSpan)) {
                        return
                    }
                    let nodeName = nonNull(childProcessNode) ? childProcessNode.value : codeSpan.textContent
                    // 获取当前节点信息
                    getNodeInfo(nodeName, node => {
                        // 处理信息
                        const divNode = document.querySelector(appPanelTag + " .customScriptInfo")
                        if (isNull(divNode)) {
                            return
                        }
                        // 清空显示
                        divNode.innerHTML = ""
                        // 脚本
                        if (nonNull(node.scriptId)) {
                            divNode.appendChild(createTextButton("脚本:" + node.scriptId, () => copyToClipboard(node.scriptId)))
                        }
                        // 入参
                        let id = node.inputScriptId
                        const inputScriptIds = node.inputScriptIds
                        if (nonNull(inputScriptIds)) {
                            id = nonNull(id) ? id : inputScriptIds.example
                            id = nonNull(id) ? id : inputScriptIds.record
                            id = nonNull(id) ? id : inputScriptIds.recordList
                            id = nonNull(id) ? id : inputScriptIds.condition
                            id = nonNull(id) ? id : inputScriptIds.id
                        }
                        let isJava = true
                        if (isNull(id) && nonNull(node.dslBulidData)) {
                            id = node.dslBulidData.dslScriptId
                            isJava = false
                        }
                        if (nonNull(id)) {
                            divNode.appendChild(createTextButton("入参:" + id, () => copyToClipboard(id, isJava)))
                        }
                        // 条件
                        const executeScriptId = node.executeScriptId
                        if (nonNull(executeScriptId)) {
                            divNode.appendChild(createTextButton("条件:" + executeScriptId, () => copyToClipboard(executeScriptId)))
                        }
                        // 校验
                        const assertScriptId = node.assertScriptId
                        if (nonNull(assertScriptId)) {
                            divNode.appendChild(createTextButton("校验:" + assertScriptId, () => copyToClipboard(assertScriptId)))
                        }
                    })
                }
            }, true, observe => mutationObserverApiList.push(observe))
            // 监听执行历史面板变动
            const executeHistoryBodyTag = appPanelTag + " .test-split-item.test-split-item-right .ant-table-body tbody"
            waitObserve(executeHistoryBodyTag, () => {
                const lines = document.querySelectorAll(executeHistoryBodyTag + "  .ant-table-row.ant-table-row-level-0")
                if (nonNull(lines) && lines.length > 0 && isNull(lines[0].querySelector(".customer-button-div"))) {
                    appendFlagNode(lines[0], "customer-button-div")
                    getExecuteHistory(content => {
                        for (let i = 0; i < content.length; i++) {
                            const tds = lines[i].querySelectorAll("td")
                            const actionCol = tds[tds.length - 1]
                            const detailButton = actionCol.querySelectorAll("button")[0]
                            detailButton.style.display = "none"
                            actionCol.insertBefore(createTextButton("RT:" + content[i].rt, () => {
                                detailButton.click()
                                historyTrace = tds[2].innerText
                            }), detailButton)
                        }
                    })
                }
            }, true, observe => mutationObserverApiList.push(observe))
            // 获取接口package
            const currentApiId = window.pageHelper.getCurrentApiId();
            if (isNull(packageNameMap[currentApiId])) {
                getApiPackageName(process => {
                    packageNameMap[currentApiId] = isNull(process.packageName) || process.packageName === '' ? 'api_' + process.id : process.packageName
                    const type = isNull(process.type) || process.type === '' ? 'api' : process.type;
                    if (type === 'childProcess') {
                        typeMap[currentApiId] = 'api'
                    } else {
                        typeMap[currentApiId] = type
                    }
                })
            }
        }, true)

        // 监听body变动
        waitObserve("body", () => {
            // 监听执行日志流程图变动
            const processPanelTag = ".node-bpmn #canvas .bjs-container .djs-container .viewport .layer-base"
            const processPanel = document.querySelector(processPanelTag)
            if (isNull(processPanel)) {
                return
            }
            if (isNull(processPanel.querySelector(".customer-rt"))) {
                appendFlagNode(processPanel, "customer-rt")
                const oldRtNode = processPanel.querySelectorAll(".bpmn-tiny-label");
                if (nonNull(oldRtNode)) {
                    oldRtNode.forEach(v => v.style.display = "none")
                }
                getByTraceId(apiNodeLogList => {
                    for (let i = 0; i < apiNodeLogList.length; i++) {
                        const log = apiNodeLogList[i]
                        const textNode = processPanel.querySelector("[data-element-id='" + log.nodeId + "'] text")
                        if (isNull(textNode)) {
                            continue
                        }
                        const tspan = textNode.querySelector("tspan")
                        if (nonNull(tspan)) {
                            const rtNode = tspan.cloneNode(true)
                            textNode.appendChild(rtNode)
                            rtNode.setAttribute("x", "65")
                            rtNode.setAttribute("y", "15")
                            rtNode.innerHTML = window.pageHelper.formatString(log.rt, 4, '&nbsp;&nbsp;')
                        }
                    }
                })
            }
        }, false)
        // 工具栏设置按钮
        waitObserve(".app-actions", () => {
            const buttonLists = document.querySelector(".app-actions")
            if (isNull(buttonLists) || nonNull(document.querySelector(".setting-flag"))) {
                return
            }
            appendFlagNode(document.body, "setting-flag")
            appendToolBarButton("设置", () => {
                const settingPanel = document.getElementById("copy-setting")
                settingPanel.style.display = settingPanel.style.display === 'block' ? 'none' : "block"
            })
            appendToolBarButton("首页", () => {
                // 关闭首页显示
                const homePage = document.querySelector(".tab-home-page");
                const tabsBar = document.querySelector(".tabs-bar");
                if (nonNull(homePage) && nonNull(tabsBar) && nonNull(tabsBar.childNodes) && tabsBar.childNodes.length > 0) {
                    homePage.style.display = homePage.style.display === 'block' ? 'none' : "block"
                }
            })
            appendToolBarButton("需求列表", () => {
                getVersionId(versionData => {
                    if (isNull(versionData) || versionData.length === 0) {
                        window.pageHelper.showToast("未在YWork查询到当前分支与之对应需求版本,先在YWork发布清单添加当前分支")
                    } else {
                        if (versionData.length > 1) {
                            let name = "";
                            for (let i = 0; i < versionData.length; i++) {
                                name += versionData[i].appVersion + " ";
                            }
                            window.pageHelper.showToast("当前分支查到了如下 " + name + " 多个版本,不能直接跳转!")
                        } else {
                            window.open("https://ops.iyunquna.com/request/list/3?versionId=" + versionData[0].id)
                        }
                    }
                })
            })
            appendToolBarButton("全量发布", () => {
                window.pageHelper.showToast("正在发布", 3000)
                getVersionId(versionData => {
                    if (isNull(versionData) || versionData.length === 0) {
                        window.pageHelper.showToast("未在YWork查询到当前分支与之对应版本,先在YWork发布清单添加当前分支")
                    } else {
                        if (versionData.length > 1) {
                            let name = "";
                            for (let i = 0; i < versionData.length; i++) {
                                name += versionData[i].appVersion + " ";
                            }
                            window.pageHelper.showToast("当前分支查到了如下 " + name + " 多个版本,不能直接发布!")
                        } else {
                            getPublishId(versionData[0].id, publishData => {
                                if (isNull(publishData) || isNull(publishData.publishId)) {
                                    window.pageHelper.showToast("发布清单查询失败")
                                } else {
                                    publish(publishData.publishId, pushData => {
                                        if (isNull(pushData) || pushData.result !== true) {
                                            window.pageHelper.showToast("发布失败", 2000)
                                        } else {
                                            window.pageHelper.showToast("发布成功", 1500)
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            })
            appendToolBarButton("发布记录", () => {
                window.open("https://ops.iyunquna.com/release-record/manage?appId=" + window.pageHelper.getAppId())
            })
        })

        window.pageHelper.initSetting()
        getAppProjectName(data => {
            appName = data
            console.log("项目名称", data)
        })
        sync2Idea()
    })

    function sync2Idea() {
        const editor = document.getElementById("theia-editor");
        if (nonNull(editor)) {
            setTimeout(() => {
                sync2Idea()
            }, 1000 * 60)
            jq.ajax({
                url: 'http://127.0.0.1:63242/socket.io',
                method: 'POST',
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                contentType: 'application/json',
                data: JSON.stringify({
                    "url": editor.src
                }),
            })
        } else {
            window.pageHelper.sleep(500).then(() => sync2Idea())
        }
    }

    function nonNull(o) {
        return o !== null && o !== undefined
    }

    function isNull(o) {
        return o === null || o === undefined
    }

    // 追加标记节点
    function appendFlagNode(node, flag) {
        const divFlag = document.createElement("div")
        node.appendChild(divFlag)
        divFlag.className = flag
        divFlag.style.display = "none"
    }

    let isProcessing = []

    // 等待出现并监听变化
    function waitObserve(visibleTag, fun, attributes = true, observeFuc = null) {
        window.pageHelper.waitElementVisible(visibleTag, () => {
            let mutationObserver = new MutationObserver(function () {
                if (isProcessing[visibleTag]) {
                    return;
                }
                isProcessing[visibleTag] = true
                fun()
                setTimeout(() => isProcessing[visibleTag] = false, 150)
            })
            mutationObserver.observe(document.querySelector(visibleTag), {
                attributes: attributes, childList: true, subtree: true, characterData: true
            })
            observeFuc = observeFuc === null || observeFuc === undefined ? () => "" : observeFuc
            observeFuc(mutationObserver)
        })
    }

    function copyToClipboard(text, isJava = true) {
        let copyValue = localStorage.getItem("copyValue")
        copyValue = copyValue === null || copyValue === undefined ? '1' : copyValue
        if (copyValue === '1') {
            let textarea = document.createElement('textarea')
            textarea.value = text
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            window.pageHelper.showToast("已拷贝 " + text, 1500)
        } else if (copyValue === '2') {
            let path = localStorage.getItem("path")
            path = path === null || path === undefined ? null : (path.endsWith("/") ? path : path + '/')
            otherReq("http://127.0.0.1:63342/api/file/" + path + "src/main/java/com/yqn/framework/composer/" + typeMap[window.pageHelper.getCurrentApiId()] +
                "/" + packageNameMap[window.pageHelper.getCurrentApiId()] + "/script/Script_" + text + (isJava ? ".java" : ".json"))
            window.pageHelper.showToast("已打开文件,如未打开,检查插件是否安装以及path是否正确", 2000)
        } else if (copyValue === '3') {
            const url = 'jetbrains://idea/navigate/reference?project=' + appName + '&fqn=com.yqn.framework.composer.' + typeMap[window.pageHelper.getCurrentApiId()] +
                '.' + packageNameMap[window.pageHelper.getCurrentApiId()] + '.script.Script_' + text;
            window.open(url)
            window.pageHelper.showToast("已打开文件,如未打开,请确认已安装Jetbrains Toolbox ", 2000)
        }
    }

    // 创建按钮
    function createTextButton(name, listener) {
        const button = document.createElement("button")
        button.type = "button"
        button.id = name
        button.className = "ant-btn ant-btn-link perf-tracked yqn-button yqn-link-no-padding customer-button"
        button.style.marginRight = '5px'
        button.onclick = listener
        const span = document.createElement("span")
        span.textContent = name
        button.appendChild(span)
        return button
    }

    // 创建工具栏按钮
    function appendToolBarButton(name, listener) {
        const buttonLists = document.querySelector(".app-actions")
        const settingButton = document.createElement("div")
        settingButton.style.marginLeft = '10px'
        const button = document.createElement("button")
        button.type = "button"
        button.id = name
        button.className = "ant-btn ant-btn-default perf-tracked yqn-button"
        button.onclick = listener
        const span = document.createElement("span")
        span.textContent = name
        button.appendChild(span)
        settingButton.appendChild(button)
        buttonLists.appendChild(settingButton)
    }

    // 获取分支YWork版本ID
    function getVersionId(fuc) {
        remoteReq('/api/42070/yqn_integrate/bg/integrate_app_version/v2/query_application_version', {
            "appBranch": localStorage.getItem("defaultBranch")
        }, data => {
            fuc(data)
        })
    }

    // 获取应用清单ID
    function getPublishId(versionId, fuc) {
        remoteReq('/api/42070/api/call/cicd/publish/get_app_list', {
            "appVersionId": versionId
        }, data => {
            fuc(data)
        })
    }

    // 发布
    function publish(publishId, fuc) {
        remoteReq('/api/42070/api/call/cicd/app/publish', {
            "colorTagId": "",
            "env": 4,
            "ignorePublishClash": 0,
            "publishId": publishId,
            "appIds": [window.pageHelper.getAppId()],
            "ignoreBranchBehind": 0
        }, data => {
            fuc(data)
        })
    }


    const addressArr = ['', '/process', '/mq', '/job']

    function getApiPackageName(fuc, apiMode = 0) {
        remoteReq('/api/42080/api' + addressArr[apiMode] + '/details_composer', {
            "id": window.pageHelper.getCurrentApiId(),
        }, data => {
            if (isNull(data)) {
                if (apiMode === 0) {
                    getApiPackageName(fuc, 1)
                    getApiPackageName(fuc, 2)
                    getApiPackageName(fuc, 3)
                }
                return
            }
            let processDefine = JSON.parse(data.processDefine)
            fuc(processDefine.process)
        })
    }

    // 拿流程信息
    function getNodeInfo(nodeName, fuc, apiMode = 0) {
        remoteReq('/api/42080/api' + addressArr[apiMode] + '/details_composer', {
            "id": window.pageHelper.getCurrentApiId(),
        }, data => {
            if (isNull(data)) {
                if (apiMode === 0) {
                    getNodeInfo(nodeName, fuc, 1)
                    getNodeInfo(nodeName, fuc, 2)
                    getNodeInfo(nodeName, fuc, 3)
                }
                return
            }
            let processDefine = JSON.parse(data.processDefine)
            for (let i = 0; i < processDefine.nodes.length; i++) {
                if (processDefine.nodes[i].code === nodeName) {
                    fuc(processDefine.nodes[i])
                    break
                }
            }
        })
    }

    // 拿历史执行数据
    function getExecuteHistory(fuc) {
        remoteReq('/api/42086/apiLog/list', {}, data => {
            if (nonNull(data) && nonNull(data.content)) {
                fuc(data.content)
            }
        })
    }

    // 拿 trace 执行数据
    function getByTraceId(fuc, apiMode = 0) {
        const apiType = ['api', 'process', 'consumer', 'job']
        remoteReq('/api/42086/apiLog/getByTraceId', {
            "traceIdLike": historyTrace,
            "testCaseId": null,
            "apiTypeCode": apiMode === 0 ? "api" : apiType[apiMode]
        }, data => {
            if (nonNull(data) && nonNull(data.apiNodeLogList) && data.apiNodeLogList.length !== 0) {
                fuc(data.apiNodeLogList)
            } else if (apiMode === 0) {
                getByTraceId(fuc, 1)
                getByTraceId(fuc, 2)
                getByTraceId(fuc, 3)
            }
        })
    }

    // 获取应用名称
    function getAppProjectName(fuc) {
        remoteReq('/api/42080/application/getById', {}, data => {
            if (nonNull(data)) {
                fuc(data.appName)
            }
        })
    }


    function remoteReq(url, model, fuc) {
        model.apiId = window.pageHelper.getCurrentApiId()
        model.appId = window.pageHelper.getAppId()
        if (isNull(model.env)) {
            model.env = "qa4"
        }
        model.page = 1
        model.size = 20
        jq.ajax({
            url: 'https://gw-ops.iyunquna.com' + url,
            method: 'POST',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            contentType: 'application/json',
            data: JSON.stringify({
                "header": {
                    "xSourceAppId": "63008",
                    "guid": "6f87e073-1da1-4017-b2de-c109abcd6d123",
                    "lang": "zh",
                    "timezone": "Asia/Shanghai"
                },
                "model": model
            }),
            success: function (response) {
                if (response.code === 200) {
                    fuc(response.data)
                } else {
                    fuc(null)
                }
            },
            error: function (xhr, status, error) {
                console.log('Request failed:', error)
                fuc(null)
            }
        })
    }


    function otherReq(url) {
        jq.ajax(url, {
            method: "GET",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true
        })
    }
})();

