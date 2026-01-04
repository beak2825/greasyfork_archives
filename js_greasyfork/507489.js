// ==UserScript==
// @name         删除节点
// @license      MIT
// @version      1.0.3
// @namespace    http://tampermonkey.net/
// @description  remove any dom you hate
// @author       IBAS
// @match        *://*/*
// @icon         https://i0.hdslb.com/bfs/face/e86287c6372e8c603724f65049cad9671fa1460c.jpg@240w_240h_1c_1s_!web-avatar-nav.avif
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507489/%E5%88%A0%E9%99%A4%E8%8A%82%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/507489/%E5%88%A0%E9%99%A4%E8%8A%82%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const domAction = {
        delete: "delete",
        hide: "hide",
        nothing: "nothing",
    };
    const selectorType = {
        all: "all",
        single: "single",
    };
    const formatSelector = function (selector, action, selectorType) {
        if (typeof selector === "string") {
            return {
                selector: selector,
                action: domAction.delete,
                selectorType: selectorType,
                msg: "",
            }
        } else {
            return selector;
        }
    };
    let updateLocalStorage = (function () {
        const cache_name = "test_rm_cache_keep_090812";
        let cache = [];
        let init = false;
        const getIndex = function (selector, append = false) {
            let i = 0;
            for (;i < cache.length; i++) {
                if (cache[i].selector === selector) {
                    break;
                }
            }
            if (i === cache.length) {
                if (append) {
                    cache.push(formatSelector(selector));
                    return i;
                } else {
                    return -1;
                }
            }
            return i;
        }
        return {
            init() {
                if (init) {
                    return cache;
                } else {
                    const cacheContent = localStorage.getItem(cache_name);
                    if (cacheContent) {
                        try {
                            cache = JSON.parse(cacheContent);
                        } catch (e) {
                            cache = [];
                        }
                        finally {
                        }
                    } else {
                        cache = [];
                    }
                    init = true;
                    return cache;
                }
            },
            set(selector, action = domAction.delete, sType = selectorType.single, msg = "") {
                let i = getIndex(selector, true);
                if (action && action in domAction) {
                    cache[i].action = action;
                }
                if (sType && sType in selectorType) {
                    cache[i].selectorType = sType;
                }
                if (msg) {
                    cache[i].msg = msg;
                }
                localStorage.setItem(cache_name, JSON.stringify(cache));
            },
            remove(selector) {
                let i = getIndex(selector, false);
                if (i !== -1) {
                    cache.splice(i, 1);
                    localStorage.setItem(cache_name, JSON.stringify(cache));
                }
            }
        }
    })();
    function getSelector(element) {
        if (!element) return '';

        // 如果元素有 id，直接返回 id 选择器
        if (element.id) {
            return `#${element.id}`;
        }

        // 获取标签名
        let selector = element.tagName.toLowerCase();
        if (selector === 'body') {
            return selector;
        }

        // 如果有类名，添加类选择器
        if (element.className) {
            const classNames = element.className.trim().split(/\s+/);
            // if (classNames.includes(labelCssName)) {
            //     classNames.splice(classNames.indexOf(labelCssName), 1);
            // }
            selector += '.' + classNames.join('.');
        }

        // 如果是兄弟节点中的唯一一个同类节点，返回标签名和类名
        let sibling = element;
        let siblingIndex = 0;
        while (sibling.previousElementSibling) {
            sibling = sibling.previousElementSibling;
            siblingIndex++;
        }

        if (siblingIndex > 0) {
            selector += `:nth-child(${siblingIndex + 1})`;
        }

        // 递归获取父元素的选择器，并加上当前选择器
        const parent = element.parentElement;
        if (parent) {
            return `${getSelector(parent)} > ${selector}`;
        } else {
            return selector;
        }
    };
    let setStyle = function (style) {
        const styleDom = document.createElement("style");
        styleDom.innerText = style;
        document.head.append(styleDom);
    };
    let labelCssName = "";
    const deleteElement = function (target) {
        target.classList.remove(labelCssName);
        let selector = getSelector(target);
        const msg = prompt("标签", "x");
        if (target.id) {
            updateLocalStorage.set(selector, "", "", msg);
            // 去除 id，有些网站的 id 是随机的，如果不删除，可能下次将失效
            target.id = "";
            selector = getSelector(target);
        }
        updateLocalStorage.set(selector, "", "", msg);
        target.remove();
    }
    let createChildNode = (function () {
        let historyList = [];
        const info = {
            action: '',
            target: null,
            dom: null,
        };
        const render = function () {
            historyList.forEach(h => {
                if (h.classList) {
                    h.classList.remove(labelCssName)
                }
            });
            historyList = [];
            if (info.target) {
                historyList.push(info.target);
                info.target.classList.add(labelCssName);
            }
        };
        const doAction = function () {
            switch (info.action) {
                case "up":
                    if (info.target === document.body) {
                        alert("无法继续到上一级了");
                    } else {
                        info.target = info.target.parentNode;
                    }
                    break;
                case "down":
                    const child = info.target.children;
                    if (child && child.length) {
                        info.target = child[0];
                    }
                    break;
                case "left":
                    if (info.target.previousElementSibling) {
                        info.target = info.target.previousElementSibling;
                    }
                    break;
                case "right":
                    if (info.target.nextElementSibling) {
                        info.target = info.target.nextElementSibling;
                    }
                    break;
                case "delete":
                    info.dom.style.display = "none";
                    deleteElement(info.target);
                case "close":
                    info.target = null;
                    info.dom.style.display = "none";
                    break;
            }
            render();
        };
        function first(dom) {
            let id = dom.id;
            labelCssName = `${id}_box_line_item_label`;
            setStyle(`
    #${id}_box {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }
    #${id}_box_line {
        display: flex;
        flex-direction: row;
        gap: 2px;
    }
    .${id}_box_line_item {
        flex: 1;
        background: #03A9F4;
        width: 30px;
        text-align: center;
    }
    `);
            setStyle(`
    .${labelCssName} {
        background: repeating-linear-gradient(45deg, #fff, #fff 10px, #66A1FF 10px, #66a1ff 20px);
        border: 8px solid red;
    }
    `);
            dom.innerHTML = `<div id="${id}_box">
    <div id="${id}_box_line">
        <div class="${id}_box_line_item"></div>
        <div class="${id}_box_line_item" action="up">上</div>
        <div class="${id}_box_line_item" action="close">关</div>
    </div>
    <div id="${id}_box_line">
        <div class="${id}_box_line_item" action="left">左</div>
        <div class="${id}_box_line_item" action="delete">删</div>
        <div class="${id}_box_line_item" action="right">右</div>
    </div>
    <div id="${id}_box_line">
        <div class="${id}_box_line_item"></div>
        <div class="${id}_box_line_item" action="down">下</div>
        <div class="${id}_box_line_item"></div>
    </div>
</div>`;
            new Array(...dom.getElementsByClassName(`${id}_box_line_item`)).forEach(ele => {
                ele.onclick = function () {
                    const action = this.getAttribute("action");
                    info.action = action;
                    if (action) {
                        doAction();
                    }
                };
            });
            first = () => {};
        };
        return function (dom, target) {
            dom.style.display = "block";
            first(dom);
            info.dom = dom;
            info.target = target;
            render();
        };
    })();

    let getDom = (function() {
        const id = "menu_id_ibas_test_rm";
        let ele = null;
        setStyle(`
        #menu_id_ibas_test_rm {
            display: block;
            position: fixed;
            z-index: 10000000000000000;
            background: darkgray;
            padding: 5px;
            border-radius: 5px;
            width: 100px;
            text-align: center;
            cursor: pointer;
            border: 2px solid gray;
            border-radius: 4px;
        }`);
        function createDom() {
            ele = document.createElement("div");
            ele.id = id;
            document.body.append(ele);
            return ele;
        };

        return function() {
            return ele ? ele : createDom();
        };
    })();
    const table = (function () {
        const tbodyId = `menu_id_ibas_test_rm_panel_table_tbody`;
        let div = null;
        setStyle(`
    #menu_id_ibas_test_rm_panel {
        z-index: 1000000000000000000;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        background: #2196f340;
        cursor: pointer;
    }
    #menu_id_ibas_test_rm_panel_content {
        width: calc(100% - 60px);
        height: calc(100% - 60px);
        border-radius: 30px;
        margin: 30px;
        background: bisque;
        padding: 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: calc(100vh - 60px);
    }
    .menu_id_ibas_test_rm_panel_content_table_dom {
        flex: 1;
        overflow-y: scroll;
    }
    .menu_id_ibas_test_rm_panel_title {
        height: 30px;
        line-height: 30px;
    }
    .menu_id_ibas_test_rm_panel_title_btn {
        line-height: 30px;
        text-decoration: underline;
        cursor: pointer;
        margin: 0 10px 0 0;
    }
    .menu_id_ibas_test_rm_panel_content_table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        table-layout: fixed; /* 让表格列可以自适应 */
    }
    .menu_id_ibas_test_rm_panel_content_table th, .menu_id_ibas_test_rm_panel_content_table td {
        padding: 12px;
        border: 1px solid #ddd;
        text-align: left;
    }
    .menu_id_ibas_test_rm_panel_content_table th {
        background-color: #f2f2f2;
        font-weight: bold;
    }
    .menu_id_ibas_test_rm_panel_content_table tr:nth-child(even) {
        background-color: #f9f9f9;
    }
    .menu_id_ibas_test_rm_panel_content_table tr:hover {
        background-color: #f1f1f1;
    }
    .menu_id_ibas_test_rm_panel_content_table th:nth-child(-n+5), .menu_id_ibas_test_rm_panel_content_table td:nth-child(-n+5) {
        width: 60px; /* 第一列宽度固定为150px */
    }`);
        function init() {
            div = document.createElement('div');
            div.style.display = 'none';
            div.id = `menu_id_ibas_test_rm_panel`;
            div.innerHTML = `<div id="menu_id_ibas_test_rm_panel_content">
        <div class="menu_id_ibas_test_rm_panel_title">
            <span class="menu_id_ibas_test_rm_panel_title_close menu_id_ibas_test_rm_panel_title_btn">关闭</span>
            <span class="menu_id_ibas_test_rm_panel_title_add menu_id_ibas_test_rm_panel_title_btn">添加</span>
        </div>
        <div class="menu_id_ibas_test_rm_panel_content_table_dom">
            <table class="menu_id_ibas_test_rm_panel_content_table">
                <thead>
                <tr>
                    <th>删除</th>
                    <th>隐藏</th>
                    <th>跳过</th>
                    <th>qAll</th>
                    <th>删除</th>
                    <th>标签</th>
                    <th>选择器</th>
                </tr>
                </thead>
                <tbody id="${tbodyId}">
                </tbody>
            </table>
        </div>
    </div>`;
            document.body.append(div);
            document.getElementsByClassName('menu_id_ibas_test_rm_panel_title_close')[0].onclick = function () {
                div.style.display = 'none';
            };
            document.getElementsByClassName('menu_id_ibas_test_rm_panel_title_add')[0].onclick = function () {
                alert("开发中... ...")
            };
            init = () => {};
        }
        return {
            showTable() {
                init();
                let tbody = document.getElementById(tbodyId);
                tbody.innerHTML = '';
                let newDom = ``;
                updateLocalStorage.init().forEach((cache, ind) => {
                    const id = `table_label_${(Math.random() * 1000).toFixed()}_${ind}`
                    cache = formatSelector(cache);
                    newDom += `<tr class="${id}">
                <td><input type="radio" action="${domAction.delete}" name="${cache.selector}" ${cache.action === domAction.delete ? 'checked' : ''}/></td>
                <td><input type="radio" action="${domAction.hide}" name="${cache.selector}" ${cache.action === domAction.hide ? 'checked' : ''}/></td>
                <td><input type="radio" action="${domAction.nothing}" name="${cache.selector}" ${cache.action === domAction.nothing ? 'checked' : ''}/></td>
                <td><input type="checkbox" ${cache.selectorType === selectorType.all ? 'checked' : ''} name="${cache.selector}" label="${id}"/><span id="${id}">${cache.selectorType === selectorType.all ? "多" : "单"}</span></td>
                <td><button name="${cache.selector}" label="${id}">删</button></td>
                <td>${cache.msg}</td>
                <td>${cache.selector}</td>
            </tr>`;
                });
                tbody.innerHTML = newDom;
                new Array(...tbody.getElementsByTagName('input')).forEach(inp => {
                    inp.onchange = function () {
                        if (inp.type === 'radio') {
                            const selector = this.getAttribute('name');
                            const action = this.getAttribute('action');
                            updateLocalStorage.set(selector, action);
                        } else if (inp.type === 'checkbox') {
                            const selector = this.getAttribute('name');
                            const label = this.getAttribute('label');
                            const checked = this.checked;
                            updateLocalStorage.set(selector, "", checked ? selectorType.all : selectorType.single);
                            document.getElementById(label).innerText = checked ? "多" : "单";
                        }
                    };
                });
                new Array(...tbody.getElementsByTagName('button')).forEach(btn => {
                    btn.onclick = function () {
                        const selector = this.getAttribute('name');
                        while (true) {
                            const ret = prompt("确定删除？(yes/y 或 no/n)", "yes");
                            if (ret.startsWith('y') || ret.startsWith('Y')) {
                                updateLocalStorage.remove(selector);
                                const label = this.getAttribute('label');
                                const tr = document.getElementsByClassName(label);
                                if (tr && tr.length) {
                                    tr[0].remove();
                                }
                                break;
                            } else if (ret.startsWith('n') || ret.startsWith('N')) {
                                break;
                            }
                        }
                    };
                });
                div.style.display = 'block';
            },
        };
    })();

    let windowOnLoad = function () {
        const cache = new Array(...updateLocalStorage.init());
        const removeDom = function () {
            const undo = [];
            while (cache.length) {
                const c = formatSelector(cache.shift());
                let dom = [];
                if (c.selectorType === selectorType.all) {
                    dom = document.querySelectorAll(c.selector);
                } else {
                    dom = [document.querySelector(c.selector)];
                }
                if (dom.length) {
                    if (c.action === domAction.delete) {
                        dom.forEach(d => d ? d.remove() : null);
                        // dom.remove();
                    } else if (c.action === domAction.hide) {
                        dom.forEach(d => d ? (d.style.display = 'none') : null);
                        // dom.style.display = 'none';
                    } else {
                        // nothing
                    }
                } else {
                    undo.push(c);
                    return;
                }
            }
            cache.splice(0,0, ...undo);
        };
        let run = false;
        let time = 10;
        let id = setInterval(() => {
            if (run) {} else {
                if (!time) {
                    clearInterval(id);
                    console.log("delete over");
                    return;
                }
                time--;
                run = true;
                removeDom();
                run = false;
                if (!cache.length) {
                    clearInterval(id);
                    console.log("delete over");
                }
            }
        }, 500);


        document.addEventListener('keydown', function(event) {
            // 检查是否按下 Ctrl + S
            if (event.ctrlKey && event.key === 'q') {
                // 在这里编写保存逻辑
                table.showTable();
            }
        });
    };

    document.addEventListener('contextmenu', function(event) {
        console.log(event);
        event.preventDefault(); // 阻止默认右键菜单

        const menu = getDom();
        createChildNode(menu, event.target);
        menu.style.top = event.clientY + 'px';
        menu.style.left = event.clientX + 'px';
        menu.style.display = 'block';
    });
    windowOnLoad();
})();


