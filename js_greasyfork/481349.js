// ==UserScript==
// @name         wmsHelper
// @namespace    http://tampermonkey.net/
// @version      0.4 切换图片生成到40084
// @description  wms操作助手
// @author       Ziker
// @match        https://wms.yqn.com/62100/*
// @match        https://pr-wms.yqn.com/62100/*
// @match        https://qa4-wms.yqn.com/62100/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         https://favicon.qqsuu.cn/work.yqn.com
// @grant GM_openInTab
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @run-at       document-body
// @noframes
// @license           AGPL License
// @downloadURL https://update.greasyfork.org/scripts/481349/wmsHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/481349/wmsHelper.meta.js
// ==/UserScript==

window.jq = $.noConflict(true);

(function (window) {
    window.pageHelper = {
        // 等待元素可见
        async waitElementVisible(visibleTag, index, fun) {
            let node = jq(visibleTag)
            if (node === null || node[index] === null || node[index] === undefined) {
                setTimeout(() => {
                    pageHelper.waitElementVisible(visibleTag, index, fun)
                }, 500)
            } else {
                fun()
            }
        },
        sleep(duration) {
            return new Promise(resolve => {
                setTimeout(resolve, duration)
            })
        },
        showToast(msg, duration) {
            const oldNotify = document.querySelector(".custom-notify");
            if (oldNotify !== undefined && oldNotify !== null) {
                document.body.removeChild(oldNotify)
            }
            // 显示提示
            duration = isNaN(duration) ? 3000 : duration;
            const m = document.createElement('div');
            m.className = "custom-notify"
            m.innerHTML = msg;
            m.style.cssText = "display: flex;justify-content: center;align-items: center;width:80%; min-width:180px; " +
                "background:#000000; opacity:0.98; height:auto;min-height: 50px;font-size:25px; color:#fff; " +
                "line-height:30px; text-align:center; border-radius:4px; position:fixed; top:60%; left:10%; z-index:999999;";
            document.body.appendChild(m);
            setTimeout(function () {
                const d = 0.5;
                m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
                m.style.opacity = '0';
                setTimeout(function () {
                    if (document.body.contains(m)) {
                        document.body.removeChild(m)
                    }
                }, d * 1000);
            }, duration);
        },
        // 模拟键盘按下
        clickUpAndDown(inputElement, keyChar) {
            let lastValue = inputElement.value;
            inputElement.value = keyChar;
            let event = new Event("input", {bubbles: true});
            //  React15
            event.simulated = true;
            //  React16 内部定义了descriptor拦截value，此处重置状态
            let tracker = inputElement._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            inputElement.dispatchEvent(event);
        }
    }
})(window);


(function () {
    'use strict';
    const domain = window.location.href.indexOf("qa4") >= 0 ? 'qa4-' : window.location.href.indexOf("pr-") >= 0 ? 'pr-' : '';
    jq(document).ready(function () {
        // 顶部工具栏变化
        waitObserve("#app", () => {
            if (nonNull(document.querySelector(".forkButton"))) {
                return;
            }
            const toolbar = document.querySelector(".yqn-topbar-module");
            appendFlagNode(toolbar, "forkButton")
            const firstChildNode = toolbar.childNodes[0];
            // toolbar.insertBefore(createTextButton("PDA理货", () => {
            //     getCurrentRelocation(true, id => {
            //         if (isNull(id)) {
            //             window.pageHelper.showToast("当前登录用户在当前仓库暂无实时理货任务", 4000)
            //         } else {
            //             GM_openInTab("https://" + domain + "wms.yqn.com/62100/transfer-ship/detail/" + id, false)
            //         }
            //     })
            // }, "ant-btn ant-btn-link perf-tracked yqn-button download-record"), firstChildNode)
            //
            // toolbar.insertBefore(createTextButton("PDA移库", () => {
            //     getCurrentRelocation(false, id => {
            //         if (isNull(id)) {
            //             window.pageHelper.showToast("当前登录用户在当前仓库暂无移库计划任务", 4000)
            //         } else {
            //             GM_openInTab("https://" + domain + "wms.yqn.com/62100/transfer-ship/detail/" + id, false)
            //         }
            //     })
            // }, "ant-btn ant-btn-link perf-tracked yqn-button download-record"), firstChildNode)
            //
            // toolbar.insertBefore(createTextButton("PDA拣货", () => {
            //     getCurrentPickingOrder(id => {
            //         if (isNull(id)) {
            //             window.pageHelper.showToast("当前登录用户在当前仓库暂无拣货任务", 4000)
            //         } else {
            //             GM_openInTab("https://" + domain + "wms.yqn.com/62100/picking/detail/" + id, false)
            //         }
            //     })
            // }, "ant-btn ant-btn-link perf-tracked yqn-button download-record"), firstChildNode)

            toolbar.insertBefore(createTextButton("叉车", () => {
                getMaxForkliftCode(forkLift => {
                    if (forkLift === '') {
                        window.pageHelper.showToast("没找到叉车", 1000)
                    } else {
                        window.pageHelper.showToast(imageHtml(forkLift), 4000)
                    }
                })
            }, "ant-btn ant-btn-link perf-tracked yqn-button download-record"), firstChildNode)

            toolbar.insertBefore(createTextButton("入库码", () => {
                getFirstContainerNo(1, containerNo => {
                    if (isNull(containerNo)) {
                        window.pageHelper.showToast("好像没容器了", 1000)
                    } else {
                        window.pageHelper.showToast(imageHtml(containerNo), 4000)
                    }
                })
            }, "ant-btn ant-btn-link perf-tracked yqn-button download-record"), firstChildNode)
            toolbar.insertBefore(createTextButton("出库码", () => {
                getFirstContainerNo(2, containerNo => {
                    if (isNull(containerNo)) {
                        window.pageHelper.showToast("好像没容器了", 1000)
                    } else {
                        window.pageHelper.showToast(imageHtml(containerNo), 4000)
                    }
                })
            }, "ant-btn ant-btn-link perf-tracked yqn-button download-record"), firstChildNode)
            toolbar.insertBefore(createTextButton("装车码", () => {
                getFirstContainerNo(3, containerNo => {
                    if (isNull(containerNo)) {
                        window.pageHelper.showToast("好像没容器了", 1000)
                    } else {
                        window.pageHelper.showToast(imageHtml(containerNo), 4000)
                    }
                })
            }, "ant-btn ant-btn-link perf-tracked yqn-button download-record"), firstChildNode)
        })
        // 处理表格
        parseTable()
        // 监听 content 页面变动
        waitObserve(".layout-common-page", () => {
            // 关闭非 Chrome 游览器顶部下载提示
            const svgIcon = document.querySelector(".yqn-icon.close");
            if (svgIcon) {
                const clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true
                });
                svgIcon.dispatchEvent(clickEvent);
            }

            const module = document.querySelector(".yqn-header")
            if (isNull(module)) {
                return;
            }
            // 拣货单详情页面
            if (module.textContent.indexOf("拣货单") >= 0 && module.textContent.indexOf("详情") >= 0) {
                pickingOrder()
            }
            // 移库单详情页面
            if (module.textContent.indexOf("移库单") >= 0 && module.textContent.indexOf("详情") >= 0) {

            }
            // 出库单详情页面
            if (module.textContent.indexOf("出库单") >= 0 && module.textContent.indexOf("详情") >= 0) {
                outboundOrder()
            }
            // 拣货单列表
            if (module.textContent.indexOf("拣货单") >= 0 && module.textContent.indexOf("详情") <= 0) {
                pickingOrderList()
            }
            // 装车单列表
            if (module.textContent.indexOf("装车单") >= 0 && module.textContent.indexOf("详情") <= 0) {
                packingOrderList()
            }
            // 验货复核
            if (module.textContent.indexOf("验货复核") >= 0) {
                inspectionGoods()
            }
        })
    })

    function parseTable() {
        setTimeout(() => {
            parseTable()
            tableExecute()
        }, 1500)
    }

    // 拣货单页面
    function pickingOrder() {
        const buttons = document.querySelector(".yqn-parser-button-list");
        if (nonNull(buttons) && isNull(document.querySelector(".custom-outbound-button"))) {
            appendFlagNode(buttons, "custom-outbound-button")
            buttons.appendChild(createButton("去复核", () => {
                const customOutCode = document.querySelector(".pop-card-c.plaintext");
                GM_openInTab("https://" + domain + "wms.yqn.com/62100/outbound-order/inspection-goods?code=" + customOutCode.textContent, false)
            }))
        }
    }

    // 出库单页面
    function outboundOrder() {
        const buttons = document.querySelector(".yqn-parser-button-list");
        if (nonNull(buttons) && isNull(document.querySelector(".custom-outbound-button"))) {
            appendFlagNode(buttons, "custom-outbound-button")
            queryPickingOrder(data => {
                if (nonNull(data)) {
                    // 跳转拣货单按钮
                    buttons.appendChild(createButton("拣货单", () => {
                        const customOutCode = document.querySelector(".pop-card-c.plaintext");
                        GM_openInTab("https://" + domain + "wms.yqn.com/62100/picking/list?customOutCode=" + customOutCode.textContent, false)
                    }))
                    // 去复核按钮
                    buttons.appendChild(createButton("去复核", () => {
                        GM_openInTab("https://" + domain + "wms.yqn.com/62100/outbound-order/inspection-goods?code=" + data.code, false)
                    }))
                }
            })
            queryLoadingOrder(data => {
                if (nonNull(data)) {
                    // 跳转装车单按钮
                    buttons.appendChild(createButton("装车单", () => {
                        const customOutCode = document.querySelector(".pop-card-c.plaintext");
                        GM_openInTab("https://" + domain + "wms.yqn.com/62100/packing/list?customOutCode=" + customOutCode.textContent, false)
                    }))
                }
            })
        }
    }

    // 拣货单列表
    function pickingOrderList() {
        const customOutCode = new URLSearchParams(window.location.href.split('?')[1]).get('customOutCode');
        if (isNull(customOutCode)) {
            return
        }
        // 搜索出库单号的拣货单
        const node = document.querySelector("#outboundCode");
        if (nonNull(node) && isNull(document.querySelector(".custom-input"))) {
            appendFlagNode(document.body, "custom-input")
            window.pageHelper.clickUpAndDown(node, customOutCode)
        }
    }

    // 装车单列表
    function packingOrderList() {
        const customOutCode = new URLSearchParams(window.location.href.split('?')[1]).get('customOutCode');
        if (isNull(customOutCode)) {
            return
        }
        // 搜索出库单号的装车单
        const node = document.querySelector("#outBoundOrderCode");
        if (nonNull(node) && isNull(document.querySelector(".custom-input"))) {
            appendFlagNode(document.body, "custom-input")
            window.pageHelper.sleep(400)
                .then(() => {
                    window.pageHelper.clickUpAndDown(node, customOutCode)
                    const search = document.querySelector(".yqn-filter-operation .ant-btn.ant-btn-primary.perf-tracked.yqn-button");
                    search.click()
                })
        }
    }

    // 验货复核
    function inspectionGoods() {
        const code = new URLSearchParams(window.location.href.split('?')[1]).get('code');
        if (isNull(code)) {
            return
        }
        const node = document.querySelector("#pickContainerNo");
        if (nonNull(node) && isNull(document.querySelector(".custom-input"))) {
            appendFlagNode(document.body, "custom-input")
            window.pageHelper.clickUpAndDown(node, code)
            // 创建一个KeyboardEvent对象并设置相关属性
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                bubbles: true,
                cancelable: true,
                keyCode: 13
            });
            // 通过目标元素触发KeyboardEvent对象
            node.dispatchEvent(event);
        }
    }

    // 表格处理
    function tableExecute() {
        try {
            // table 容器
            const containers = document.querySelectorAll(".ant-table-container");
            if (containers == null || containers.length === 0) {
                return
            }
            for (let i = 0; i < containers.length; i++) {
                const container = containers[i];
                const tHeader = container.querySelector(".ant-table-header")
                let keyIndexArray = []
                const ths = tHeader.querySelectorAll("th");
                for (let i = 0; i < ths.length; i++) {
                    const text = ths[i].innerText.toLowerCase();
                    if (text.indexOf("sku".toLowerCase()) >= 0 ||
                        text.indexOf("UPC".toLowerCase()) >= 0 ||
                        text.indexOf("识别码".toLowerCase()) >= 0 ||
                        text.indexOf("容器号".toLowerCase()) >= 0 ||
                        text.indexOf("库位".toLowerCase()) >= 0 ||
                        text.indexOf("叉车编码".toLowerCase()) >= 0 ||
                        text.indexOf("容器编码".toLowerCase()) >= 0 ||
                        text.indexOf("序列号".toLowerCase()) >= 0 ||
                        text.indexOf("SN码".toLowerCase()) >= 0) {
                        keyIndexArray.push(i)
                    }
                }
                const tBody = container.querySelector(".ant-table-tbody")
                let lines = tBody.querySelectorAll(".ant-table-row.ant-table-row-level-0");
                if (lines == null) {
                    lines = tBody.querySelectorAll(".ant-table-row.ant-table-row-level-0")
                }
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    let tds = line.querySelectorAll("td");
                    if (tds[keyIndexArray[0]].innerText.indexOf("QRC") >= 0 || line.innerText.indexOf("QRC") >= 0) {
                        continue
                    }
                    let dataArray = []
                    for (let i = 0; i < tds.length; i++) {
                        if (keyIndexArray.indexOf(i) >= 0) {
                            dataArray.push(tds[i].innerText)
                        }
                    }
                    if (dataArray.length > 0 && tds[keyIndexArray[0]].innerText.indexOf("QRC") < 0) {
                        let td = tds[keyIndexArray[0]];
                        if (td.querySelector("span") != null) {
                            td = td.querySelector("span")
                        }
                        td.appendChild(createTextButton("QRC", () => {
                            window.pageHelper.showToast(imageHtml(dataArray), 7000)
                        }))
                    }
                }
            }
        } catch (e) {
            throw e
        }
    }

    // 追加标记节点
    function appendFlagNode(node, flag) {
        const divFlag = document.createElement("div");
        node.appendChild(divFlag)
        divFlag.className = flag;
        divFlag.style.display = "none"
    }

    function imageHtml() {
        let html = "<div style=\"display: flex;margin-top: 10px;margin-bottom: 10px\">";
        if (arguments.length === 1 && arguments[0] instanceof Array) {
            for (let i = 0; i < arguments[0].length; i++) {
                html += "    <img src=\"https://gw-wms.yqn.com/api/40084/yqn_video/additional/qrcode_create_png?code=" + arguments[0][i] + "&width=220&height=220&desc=1\" alt='" + arguments[0][i] + "'/>";
                if (i !== arguments[0].length - 1) {
                    html += "    <span style=\"width: 170px\"></span>";
                }
            }
        } else {
            for (let i = 0; i < arguments.length; i++) {
                html += "    <img src=\"https://gw-wms.yqn.com/api/40084/yqn_video/additional/qrcode_create_png?code=" + arguments[i] + "&width=220&height=220&desc=1\" alt='" + arguments[i] + "'/>";
                if (i !== arguments.length - 1) {
                    html += "    <span style=\"width: 170px\"></span>";
                }
            }
        }
        html += "</div>";
        return html;
    }

    function nonNull(o) {
        return o !== null && o !== undefined;
    }

    function isNull(o) {
        return o === null || o === undefined;
    }

    // 等待出现并监听变化
    function waitObserve(visibleTag, fun, attributes = true) {
        window.pageHelper.waitElementVisible(visibleTag, 0, () => {
            new MutationObserver(function (mutationsList) {
                fun()
            }).observe(document.querySelector(visibleTag), {
                attributes: attributes,
                childList: true,
                subtree: true,
                characterData: true
            })
        })
    }

    // 创建文本按钮
    function createTextButton(name, listener, className = "ant-btn ant-btn-link perf-tracked yqn-button yqn-link-no-padding customer-button") {
        const button = document.createElement("button")
        button.type = "button"
        button.id = name
        button.className = className
        button.onclick = listener
        const span = document.createElement("span")
        span.textContent = name
        button.appendChild(span)
        return button;
    }

    // 创建按钮
    function createButton(name, listener) {
        const button = document.createElement("button")
        button.type = "button"
        button.id = name
        button.className = "ant-btn ant-btn-default perf-tracked yqn-button"
        button.onclick = listener
        const a = document.createElement("a")
        a.textContent = name
        a.className = "render-button-text"
        button.appendChild(a)
        return button;
    }

    // 拿一个新容器
    function getFirstContainerNo(type, fuc) {
        request('/yqn_wms/bg/container/v2/list', {
            "statusList": [1],
            "containerType": type
        }, data => {
            if (nonNull(data.content) && data.content.length > 0) {
                fuc(data.content[0].containerCode)
            } else {
                fuc(null)
            }
        })
    }

    // 拿一个全能叉车
    function getMaxForkliftCode(fuc) {
        request('/yqn_wms/bg/forklift/v2/list', {}, data => {
            if (nonNull(data.content) && data.content.length > 0) {
                let emptyCode = ''
                let code = ''
                let areMaxLayer = 0
                let areMaxLen = 0
                let emptyAreMaxLayer = 0;
                for (let i = 0; i < data.content.length; i++) {
                    const forklift = data.content[i];
                    const num = isNull(forklift.maximumLayer) ? 0 : forklift.maximumLayer;
                    // 空库区
                    if (isNull(forklift.warehouseAreaList) || forklift.warehouseAreaList.length === 0) {
                        if (emptyAreMaxLayer <= num) {
                            emptyAreMaxLayer = num;
                            emptyCode = forklift.code;
                        }
                    } else {
                        // 非空库区
                        if (areMaxLen <= forklift.warehouseAreaList.length && areMaxLayer <= num) {
                            areMaxLen = forklift.warehouseAreaList.length;
                            areMaxLayer = num;
                            code = forklift.code;
                        }
                    }
                }
                fuc(emptyCode.length !== 0 ? emptyCode : code)
            } else {
                fuc(null)
            }
        })
    }

    // 拿当前拣货单
    function getCurrentPickingOrder(fuc) {
        request('/yqn_wms/app/picking/v2/get_task', {}, data => {
            fuc(data.id)
        })
    }

    // 拿移库单
    function getCurrentRelocation(real, fuc) {
        request('/yqn_wms/app/relocation/v2/' + (real ? 'get_immediately' : 'get_task'), {}, data => {
            fuc(data.id)
        })
    }

    // 查询出库单对应拣货单
    function queryPickingOrder(fuc) {
        request('/yqn_wms/bg/picking/v2/list', {
            "outboundCode": new URLSearchParams(window.location.href.split('?')[1]).get('code'),
        }, data => {
            if (nonNull(data.content) && data.content.length > 0) {
                for (let i = 0; i < data.content.length; i++) {
                    fuc(data.content[i])
                }
            } else {
                fuc(null)
            }
        })
    }

    // 查询出库单对应装车单
    function queryLoadingOrder(fuc) {
        request('/yqn_wms/bg/loading_order/v2/list', {
            "outBoundOrderCode": new URLSearchParams(window.location.href.split('?')[1]).get('code')
        }, data => {
            if (nonNull(data.content) && data.content.length > 0) {
                for (let i = 0; i < data.content.length; i++) {
                    fuc(data.content[i])
                }
            } else {
                fuc(null)
            }
        })
    }

    // 发起请求
    function request(interfaceUrl, model, success) {
        const url = 'https://' + domain + 'gw-wms.yqn.com/api/40081/api/call' + interfaceUrl
        model.page = 1
        model.size = 100
        model.warehouseId = localStorage.getItem("warehouseId")
        jq.ajax({
            url: url,
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
                if (response.code === 200 && nonNull(response.data)) {
                    success(response.data)
                }
            },
            error: function (xhr, status, error) {
                console.log('Request failed:', error);
            }
        });
    }
})();
