// ==UserScript==
// @name         检查更新
// @namespace    http://tampermonkey.net/Upgrate-Check
// @version      0.0.0.4
// @description  检查脚本是否有更新
// @author       PY-DNG
// @include      https://greasyfork.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/409908/%E6%A3%80%E6%9F%A5%E6%9B%B4%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/409908/%E6%A3%80%E6%9F%A5%E6%9B%B4%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自我检查更新
    const upgradeInfo = checkNewVersion(409908, true, 2);
    console.log(upgradeInfo);

    // 检查更新函数
    // greasyforkId: greasyfork为脚本分配的Id，可以在URL里看到
    // popup: 是否弹出更新页面，默认为true
    // mode: 检查更新的方法，可以有以下值：
    //     1. 从脚本本身获取最新版本号，适合大多数情况；当脚本名字在新版本中改变时会失效，所以不适用脚本名字可能改变的情况
    //     2. 从脚本发布页获取最新版本号，适合脚本特别大，或者脚本名字可能改变的情况
    //     省略，默认为1
    // 返回值:
    //     Object {
    //         hasNewVer: <bull>   有没有新版本
    //         latestVer: <string> 最新版本的版本号
    //         curVer:    <string> 当前版本的版本号
    //     }
    function checkNewVersion(greasyforkId, popup, mode) {
        // 参数预处理
        greasyforkId = String(greasyforkId);
        popup = popup ? popup : true;
        mode = mode ? mode : 1;

        // 初始化返回值
        const reObj = {};
        reObj.hasNewVer = undefined;
        reObj.latestVer = undefined;
        reObj.curVer = GM_info.script.version;

        // 检查更新
        const scriptURL = encodeURI('https://greasyfork.org/zh-CN/scripts/{TID}-{NAME}/code/{NAME}.user.js'.replace('{TID}', greasyforkId).replace('{NAME}', GM_info.script.name));
        const scriptPageURL = 'https://greasyfork.org/zh-CN/scripts/{TID}'.replace('{TID}', greasyforkId);
        const url = (mode === 2) ? scriptPageURL : scriptURL;
        GM_xmlhttpRequest({
            method: 'GET',
            synchronous: false,
            url: url,
            onload: function(request) {
                reObj.latestVer = (mode === 2) ? getVersionFromPage(request.responseText) : getVersionFromScript(request.responseText);
                const scriptSourceURL = (mode === 2) ? (getHrefFromPage(request.responseText)) : (request.finalUrl);
                reObj.hasNewVer = compareVersion(reObj.latestVer, reObj.curVer);
                if (reObj.hasNewVer) {
                    if (popup) {
                        GM_openInTab(scriptSourceURL, {
                            active: false,
                            insert: true,
                            setParent: true,
                            incognito: false
                        });
                    }
                }
                return reObj;
            }
        })

        // 从脚本内容获取版本号
        function getVersionFromScript(code) {
            return code.match(/(?<=\/\/ ==UserScript==\n)(.*\n*)+/)[0].match(/(?<=\/\/ @version +)(\d\.?)+/)[0];
        }

        // 从脚本发布页内容获取版本号
        function getVersionFromPage(HTML) {
            return HTML.match(/(?<=<dd class="script-show-version"><span>).*(?=<\/span><\/dd>)/g)[0];
        }

        // 从脚本发布页内容获取脚本链接
        function getHrefFromPage(HTML) {
            return 'https://greasyfork.org/zh-CN' + HTML.match(/(?<=<a class="install-link" .+href=").+.user.js/g)[0];
        }

        // 判断ver1是否大雨ver2
        function compareVersion(verA, verB) {
            // 尽量的规范一下版本号：替换连续的多个点(....)为一个(.)，去除最后没有后续数字的点("1.2.3.4." => "1.2.3.4")
            // 同时转换成数组，以点号(.)分割
            const verAarr = verA.replace(/(\.){2,}/g, '.').replace(/\.$/, '').split('.');
            const verBarr = verB.replace(/(\.){2,}/g, '.').replace(/\.$/, '').split('.');
            for (let i = 0; i < ((verAarr.length < verBarr.length) ? verAarr.length : verBarr.length); i++) {
                if (verAarr[i] === verBarr[i]) {continue;};
                return (verAarr[i] > verBarr[i]);
            }
            return false;
        }

        // 定义多行字符串函数
        function multiline(fn) {
            return fn.toString().split('\n').slice(1,-1).join('\n') + '\n';
        }
    }
})();