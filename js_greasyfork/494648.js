// ==UserScript==
// @name        请求替换器
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @license     MIT
// @version     1.2
// @author      youngyy
// @description 2024/5/9 20:23:13
// @downloadURL https://update.greasyfork.org/scripts/494648/%E8%AF%B7%E6%B1%82%E6%9B%BF%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/494648/%E8%AF%B7%E6%B1%82%E6%9B%BF%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==
/**
 * 弹窗 显示替换操作
 */
let reqList = [];

function tableRow(table, position, key, value) {
    const tr = table.insertRow();
    tr.insertCell().innerText = position
    tr.insertCell().innerText = key
    const td2 = tr.insertCell();
    td2.innerText = value
    td2.contentEditable = true;

    let deleteTd = tr.insertCell();
    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        table.deleteRow(this.parentElement.parentElement.rowIndex);
    };
    deleteTd.appendChild(deleteButton);
}

function urlParam(uri, table) {
    const url = getUrlObj(uri);
    const params = new URLSearchParams(url.search);
    params.forEach((value, key) => tableRow(table, 'url', key, value))
}

function bodyParam(obj, table, parentKey) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            if (!(typeof obj[key] === 'object' && obj[key] !== null)) {
                tableRow(table, 'body', fullKey, obj[key])
            } else {
                if (Array.isArray(obj[key])) {
                    // 使用forEach遍历数组
                    obj[key].forEach((item, index) => {
                        let arrKey = `${fullKey}[${index}]`;
                        if (typeof item === 'object' && item !== null) {
                            bodyParam(item, table, arrKey);
                        } else {
                            tableRow(table, 'body', arrKey, item)
                        }
                    });
                } else {
                    bodyParam(obj[key], table, fullKey);
                }
            }
        }
    }
}

function clickReqLi(item) {
    let tableContainer = document.getElementById("tableContainer");
    tableContainer.replaceChildren()

    let element = document.createElement("h4");
    // 使用URL构造函数来解析这个字符串
    const url = getUrlObj(item.url);
    element.id = "h4uri"
    element.innerText = `${url.origin}${url.pathname}`
    tableContainer.appendChild(element)

    const table = document.createElement('table');
    table.setAttribute('border', '1');
    table.setAttribute('width', '500px');
    table.style.cssText = ` text-align: center; `;
    // 创建表头
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['位置', '参数名', '值', '操作'].forEach(function (headerName) {
        var th = document.createElement('th');
        th.textContent = headerName;
        headerRow.appendChild(th);
    });

    urlParam(item.url, table)
    bodyParam(item.data, table)
    tableContainer.appendChild(table)
}

function hideDialog() {
    document.getElementById('dialogReqRepl').style.display = 'none'
}

function showDialog() {
    let dialog = document.getElementById('dialogReqRepl');
    if (dialog) {
        dialog.style.display = 'block';
    } else {
        const dialogHtmlStr = `
            <div id="dialogReqRepl" style="position: fixed; left: 0; top: 50%; width: 600px; height: 600px;overflow-y: scroll; background-color: #fff; border: 1px solid #ccc; padding: 10px; z-index: 9999;">
                <button id="closeDialogBtn" onclick="document.getElementById('tableContainer')?.replaceChildren();reqList=[];document.getElementById('reqList')?.replaceChildren()">清空</button>
                <button id="closeDialogBtn" onclick="document.getElementById('dialogReqRepl').style.display = 'none'">关闭</button>
                <ul id="reqList" style="width: 600px;height: 200px;overflow: scroll;white-space: nowrap; padding: 0;margin: 0"></ul>
                <div id="tableContainer"></div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', dialogHtmlStr);
        // 使div可拖拽
        document.getElementById('dialogReqRepl').addEventListener('mousedown', function (e) {
            const div = e.target;
            // 鼠标位置与div边界的偏移量
            const offsetX = e.clientX - div.offsetLeft;
            const offsetY = e.clientY - div.offsetTop;
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);

            function mouseMoveHandler(e) {
                div.style.left = (e.clientX - offsetX) + 'px';
                div.style.top = (e.clientY - offsetY) + 'px';
            }

            function mouseUpHandler() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            }
        })
    }
}

function showReqLog() {
    // 添加接口请求信息
    let str = "";
    reqList.forEach((item) => {
        str += `<li class="reqLi" style="border: 1px solid #ccc;padding: 5px;">${item.url}</li>`
    });
    let element = document.querySelector('#reqList');
    if (element) {
        element.innerHTML = str
        // 添加点击事件
        document.querySelectorAll('.reqLi').forEach((item, idx) => {
            item.addEventListener('click', () => {
                clickReqLi(reqList[idx])
            })
        })
    }
}

function getUrlObj(uri) {
    return new URL(uri, window.location.origin)
}

function hasTable() {
    return document.querySelector('#tableContainer table')
}

function isCurrUri(url) {
    if (hasTable()) {
        // 判断uri是否为设置的
        let element = document.querySelector('#h4uri');
        let urlObj = getUrlObj(element.innerText);
        let obj = getUrlObj(url);
        return obj.pathname === urlObj.pathname;
    }
}

function uriReplaceBody(dataStr, uris) {
    if (!isCurrUri(uris)) {
        return dataStr;
    }
    // 替换参数
    let parse = JSON.parse(dataStr);

    let listOf = document.querySelectorAll('#tableContainer table tr');
    Array.from(listOf).slice(1).forEach(item => {
        // 每行一个参数对
        let data = item.querySelectorAll("td");
        let s = data[1].innerText;
        parse[s] = data[2].innerText;
    })
    return JSON.stringify(parse);
}

function uriReplaceParam(url) {
    if (!isCurrUri(url)) {
        return url;
    }
    // 替换参数
    let listOf = document.querySelectorAll('#tableContainer table tr');
    const urls = getUrlObj(url);
    Array.from(listOf).slice(1).forEach(item => {
        // 每行一个参数对
        let data = item.querySelectorAll("td");
        let s = data[1].innerText;
        let text = data[2].innerText;
        urls.searchParams.set(s, text);
    })
    return urls.toString();
}

function mains() {
    document.addEventListener('keydown', (event) => {
        if (!(event.altKey && event.key === 'e')) {
            return;
        }
        // 隐藏或显示
        let elementById = document.getElementById('dialogReqRepl');
        if (elementById?.style.display === 'block') {
            hideDialog()
        } else {
            showDialog()
        }


        event.stopPropagation();
        event.preventDefault();
    });

    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function (data) {
        const self = this;
        // 获取reqList最后一项
        reqList[reqList.length - 1].data = JSON.parse(data);
        showReqLog()
        // 替换body
        data = uriReplaceBody(data, self._url)
        originalSend.call(self, data);
    };

    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async) {
        this._url = url;
        reqList.push({
            method: method,
            url: url,
        });
        url = uriReplaceParam(url);
        originalOpen.call(this, method, url, async);
    };
}

mains()