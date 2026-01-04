// ==UserScript==
// @name         Gitmind批量导出文件为pdf
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在Gitmind目录页一键导出当前目录下文件为pdf
// @author       Ctrl+T
// @match         https://gitmind.cn/app/doc/*
// @match         https://gitmind.cn/app/my/dir/*
// @match         https://gitmind.cn/app/my
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/408914/Gitmind%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E6%96%87%E4%BB%B6%E4%B8%BApdf.user.js
// @updateURL https://update.greasyfork.org/scripts/408914/Gitmind%E6%89%B9%E9%87%8F%E5%AF%BC%E5%87%BA%E6%96%87%E4%BB%B6%E4%B8%BApdf.meta.js
// ==/UserScript==

(function () {
    let url = window.location.href;
    if (url.includes('my')) { // 目录页
        addButton();
    } else if (url.includes('doc') && url.includes('export')) { // 文件页
        download();
    }
})();

/**
 * 增加按钮“批量导出”到“多选”之后
 */
function addButton() {
    let parentDom = document.querySelector('.tool-bar > div');
    let buttonDom = document.createElement('div');
    let batchButtonDom = document.querySelector('.tool-bar .batch-btn');
    buttonDom.innerText = '批量导出'
    buttonDom.className = 'mind-btn fr';
    buttonDom.onclick = function() {
        getDirGuid();
    }
    parentDom.insertBefore(buttonDom, batchButtonDom);
}

/**
 * 第一步：获取目录号
 */
function getDirGuid() {
    let url = window.location.href;
    if (url.includes('dir')) { // 非根页面，直接从url获取dirguid
        getLs(url.substring(url.lastIndexOf("\/")+1, url.length));
    } else { // 根页面，使用ajax获取
        let xhr = customXMLHttpRequest('post','https://api.gitmind.cn/api/get_root_dir',true);
        xhr.send('{"naotu_type":0}');
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                getLs(xhr.response['data']['file_guid']);
            }
        }
    }
}

/**
 * 第二步：使用目录号获取本页面所有文件信息
 * @param {String} dirGuid 目录号
 */
function getLs(dirGuid) {
    let xhr = customXMLHttpRequest('post','https://api.gitmind.cn/api/ls',true);
    let payLoad = {
        'dir_guid': dirGuid,
        'naotu_type': 0
    }
    xhr.send(JSON.stringify(payLoad));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            openFiles(xhr.response.data)
        }
    }
}

/**
 * 第三步：根据文件列表打开对应网页进行下载
 * @param {List} files 文件列表
 */
function openFiles(files) {
    for (let file of files) {
        if (file['file_type'] == 'directory') {
            getLs(file['file_guid']);
        } else if (file['file_type'] == 'file') {
            GM_openInTab('https://gitmind.cn/app/doc/' + file['file_guid'] + '?export')
        }
    }
}

/**
 * 自定义XHR对象闭包，提前设定好token
 */
let customXMLHttpRequest = (function (jwtoken) {

    function getXMLHttpRequest(method, url, async){
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open(method, url, async);
        xmlHttpRequest.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        xmlHttpRequest.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xmlHttpRequest.responseType = 'json';
        return xmlHttpRequest;
    }

    return getXMLHttpRequest;
})(localStorage.getItem('mindmap_api_token'));

/**
 * 文件页的下载脚本
 */
function download() {
    // 替换XHR函数
    replaceXHR();

    // 外轮询，等待界面上的“导出”按钮出现
    let outerInterval = setInterval(function () {
        let exportBtn = document.querySelector('.editor-header-right button:last-child');
        if (exportBtn) {
            exportBtn.click()
            clearInterval(outerInterval);

            // 内轮询，等待模态框中的单选按钮出现
            let innerInterval = setInterval(function () {
                let radios = document.querySelectorAll('.dialog-body .radio-item');
                if (radios.length) {
                    clearInterval(innerInterval);
                    for (let radio of radios) {
                        if (radio.getElementsByClassName('el-radio__label')[0].textContent == 'PDF') { // 选择类别为pdf
                            radio.click();
                            let modalExportBtn = document.querySelector('.dialog-btns button')
                            modalExportBtn.click();
                            break;
                        }
                    }
                }
            }, 20)
        }
    }, 20)
}

/**
 * 替换XHR函数，使得下载完成后自动关闭页面
 */
function replaceXHR() {
    var open = window.XMLHttpRequest.prototype.open,
        send = window.XMLHttpRequest.prototype.send;

    function openReplacement(method, url, async, user, password) {
        this._url = url;
        return open.apply(this, arguments);
    }

    function sendReplacement(data) {
        if (this.onreadystatechange) {
            this._onreadystatechange = this.onreadystatechange;
        }
        this.onreadystatechange = onReadyStateChangeReplacement;
        return send.apply(this, arguments);
    }

    function onReadyStateChangeReplacement() {
        // 下载完成后自动关闭页面
        if (this._url == "https://api.gitmind.cn/api/export-pdf" && this.readyState == 4) {
            window.open(location, '_self').close();
        }

        if (this._onreadystatechange) {
            return this._onreadystatechange.apply(this, arguments);
        }
    }

    window.XMLHttpRequest.prototype.open = openReplacement;
    window.XMLHttpRequest.prototype.send = sendReplacement;
}