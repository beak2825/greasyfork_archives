// ==UserScript==
// @name         📦 资源嗅探
// @namespace    https://ez118.github.io/
// @version      0.2
// @description  网页资源嗅探的另一种选择
// @author       ZZY_WISU
// @match        *://*/*
// @license      MIT
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @require      https://unpkg.com/zepto@1.2.0/dist/zepto.min.js
// @downloadURL https://update.greasyfork.org/scripts/547686/%F0%9F%93%A6%20%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/547686/%F0%9F%93%A6%20%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.meta.js
// ==/UserScript==

var resList = [];

function Toast(text) {
    // Toast提示消息，适配VIA和MBrowser的原生Toast
    try{
        if (typeof(window.via) == "object") window.via.toast(text);
        else if (typeof(window.mbrowser) == "object") window.mbrowser.showToast(text);
        else alert(text);
    }catch{
        alert(text);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(
            () => {
                Toast('链接已复制');
            },
            (err) => {
                Toast('复制失败:' + err);
            }
        );
    } else {
        Toast("浏览器不支持写入剪贴板");
    }
}

function getFileName(url) {
    try {
        const urlObj = new URL(url);
        // 获取路径部分（path）
        const path = urlObj.pathname;
        // 使用正则或 split 来获取最后一个路径段（文件名）
        const filename = path.split('/').pop();
        return filename || ''; // 如果没有文件名，返回空字符串
    } catch (error) {
        Toast('无效的 URL 格式:', error);
        return '';
    }
}

function siftOut(entry) {
    // 是否筛出
    const initType = entry.initiatorType;
    const fileType = entry.contentType;
    const filePath = entry.name;
    if(initType == 'audio' || initType == 'video' || initType == 'embed' || fileType.includes('video') || fileType.includes('audio') || filePath.includes(".m3u8") || filePath.includes(".mp3") || filePath.includes(".flv") || fileType.includes("/vnd.") || (fileType == 'application/octet-stream' && filePath.includes(".ts")) || fileType.includes("mp2t")) {
        if(( (fileType == 'application/octet-stream' && filePath.includes(".ts")) || fileType.includes("mp2t")) && JSON.stringify(resList).includes(".m3u8")) return true;
        return false;
    } else {
        return true;
    }
}

function AddObserver(callback) {
    new PerformanceObserver((entryList) => {
        // 任意资源加载完成基本都会回调（极少数情况不会，可忽略）
        entryList.getEntries().forEach((entry) => {
            // console.log(entry)
            if(!siftOut(entry)) callback(entry);
        })
    }).observe({ entryTypes: ['resource'] })
}

function hookFetchAndXHR(callback) {
    // Hook fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('.m3u8')) {
            console.log('m3u8 detected via fetch:', url);
            callback({ type: 'fetch', url, init: args[1] });
        }
        return originalFetch.apply(this, args);
    };

    // Hook XHR
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        if (typeof url === 'string' && url.includes('.m3u8')) {
            console.log('m3u8 detected via XHR:', url);
            callback({ type: 'xhr', method, url });
        }
        return originalOpen.call(this, method, url, ...args);
    };
}


(function() {
    'use strict';

    var menu_mgr = GM_registerMenuCommand('查看嗅探结果', function () {$(".userjs_getres_dlg").show() }, 'o');

    GM_addStyle(`
        .userjs_getres_dlg {  user-select:none; background-color:#FFFFFFEE; color:#000; border:1px solid #99999999; position:fixed; top:50%; height:fit-content; left:50%; transform:translateX(-50%) translateY(-50%); width:92vw; max-width:300px; max-height:92vh; padding:15px; border-radius:15px; z-index:100000; box-shadow:0 1px 10px #BBB; box-sizing:border-box; }
        .userjs_getres_dlg * { font-family:"Hiragino Sans GB","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif; box-sizing:border-box; }
        .userjs_getres_dlg_title { margin:5px; margin-bottom:15px; font-size:24px; }
        .userjs_getres_dlg_container { width:100%; height:fit-content; display:block; max-height:calc(92vh - 130px); overflow:hidden auto; }
        .userjs_getres_dlg_item { width:100%; padding:10px 5px; margin:0; display:flex; flex-direction:row; vertical-align:middle; cursor:pointer; word-break:break-all; }
        .userjs_getres_dlg_item:hover { background-color:#55555555; }
        .userjs_getres_dlg_cancel { border:none; background-color:transparent; padding:8px; margin:0; color:#6d7fb4; cursor:pointer; overflow:hidden; }
    `);

    document.addEventListener('DOMContentLoaded', function() {
        // 创建元素
        var dlgEle = $('<div class="userjs_getres_dlg"></div>');
        $(document.body).append(dlgEle);
        dlgEle.hide();

        dlgEle.html(`
            <h3 class="userjs_getres_dlg_title">嗅探结果</h3>
            <div class="userjs_getres_dlg_container"></div>
            <button class="userjs_getres_dlg_cancel">关闭</button>
        `);

        $(document).on('click', ".userjs_getres_dlg_cancel", function() {
            dlgEle.hide();
        });

        $(document).on('click', ".userjs_getres_dlg_item", function(e) {
            var url = $(e.currentTarget).data('url').trim();
            window.open(url, "_blank");
        });

        $(document).on('contextmenu', '.userjs_getres_dlg_item', function(e) {
            e.preventDefault(); // 阻止默认右键菜单
            var url = $(e.currentTarget).data('url').trim();
            copyToClipboard(url);
        });
    });

    AddObserver(function (entry) {
        for(var i = 0; i < resList.length; i ++) {
            if(resList[i] == entry.name) {
                return;
            }
        }
        resList.push(entry.name);
        $(".userjs_getres_dlg_container").append(
            $("<div class='userjs_getres_dlg_item'></div>").data("url", entry.name).text(getFileName(entry.name))
        );

        $(".userjs_getres_dlg").show();
    });

    hookFetchAndXHR(function (entry) {
        for(var i = 0; i < resList.length; i ++) {
            if(resList[i] == entry.url) {
                return;
            }
        }
        resList.push(entry.url);
        $(".userjs_getres_dlg_container").append(
            $("<div class='userjs_getres_dlg_item'></div>").data("url", entry.url).text(getFileName(entry.url))
        );

        $(".userjs_getres_dlg").show();
    });
})();