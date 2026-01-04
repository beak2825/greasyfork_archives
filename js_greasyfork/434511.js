// ==UserScript==
// @name         Alook浏览器的via插件助手（GreasyFork、openuserjs）
// @namespace    http://tampermonkey.net/*
// @version      0.1
// @description  a script help alook(ios) install script from greasyfork and openuserjs
// @author       Number17831
// @match        https://greasyfork.org/*/scripts/*
// @match        https://openuserjs.org/scripts/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434511/Alook%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84via%E6%8F%92%E4%BB%B6%E5%8A%A9%E6%89%8B%EF%BC%88GreasyFork%E3%80%81openuserjs%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/434511/Alook%E6%B5%8F%E8%A7%88%E5%99%A8%E7%9A%84via%E6%8F%92%E4%BB%B6%E5%8A%A9%E6%89%8B%EF%BC%88GreasyFork%E3%80%81openuserjs%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isVia = window.via && typeof window.via.addon === "function";
    let Base64 = {encode: s=>btoa(unescape(encodeURIComponent(s))), decode: s=>decodeURIComponent(escape(window.atob(s)))};
    let zhBase64 = {
        encode: function (input) {
            let _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            let output = "";
            let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            let i = 0;
            input = this.utf8_encode(input);
            while (i < input.length) {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
                if (isNaN(chr2)) { enc3 = enc4 = 64;
                } else if (isNaN(chr3)) { enc4 = 64; }
                output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
            }
            return output;
        },
        utf8_encode: function(_string) {
            return _string.replace(/([\u2E80-\u2EFF\u2F00-\u2FDF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FBF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF])/g, str => {
                return '\\u' + str.charCodeAt(0).toString(16)
            })
        }
    };

    function tryGetExec(result, idx, fallback) { if (result.length < idx + 1) return fallback; else return result[idx]; }

    async function addonApp(scriptUrl) {
        let scriptContent = await (await (fetch(scriptUrl))).text();
        let version = tryGetExec(/\/\/\s*@version\s*([0-9\.]*)/.exec(scriptContent), 1, "unknown");
        let author = tryGetExec(/\/\/\s*@author\s*([^\s]*)/.exec(scriptContent), 1, "unknown");
        let name = tryGetExec(/\/\/\s*@name\s*([^\s]*)/.exec(scriptContent), 1, "unknown");
        // alook javascript 扩展 匹配类型建议采用链接网址，比域名更精确，但是alook匹配采用正则表达式，普通油猴脚本采用*作为通配符匹配，
        // 因此这里做一个简单的转换，把match匹配地址中的 “*” 全部改成标准正则表达式 “.*”
        // let match = /\/\/ @match\s*([^\s]*)/.exec(scriptContent)[1];
        let match = scriptContent.match(/\/\/\s*@(match|include)\s*([^\s\n]*)/g)
                                  .map(s=>tryGetExec(/\/\/\s*@(match|include)\s*([^\s]*)/.exec(s), 2, "unknown"))
                                  .map(s=>s.replaceAll("*", ".*"))
                                  .join("@@");
        let codeStr = Base64.encode(
`
(function (){
${scriptContent}
})();
`
        );
        // let codeStr = scriptContent;
        var appJson = {
            author: name,
            id: "1",
            runat : 1,
            version : version,
            name: name,
            url: match,
            code: codeStr,
        };
        var appStr = JSON.stringify(appJson);
        var addon_result = zhBase64.encode(appStr);
        try {
            // alert(appStr);
            window.via.addon(addon_result);
        } catch (error) {
            alert(error);
            console.log(error);
        }
    }

    function FindInstallBtn(selectStr) {

        // 查找标题元素用到的querySelector字符串
        let installBtn = document.querySelector(selectStr);
        if (!installBtn) return false;

        var button = document.createElement("a");
        button.append(isVia ? "通过via安装插件" : "当前浏览器不支持via插件安装");
        button.className = installBtn.className;
        button.style.color = "black";
        button.style.background = "lightgreen";
        //storyDiv.append(button)
        button.onclick = async () => {
            // alert("install via plugin by script url: " + installBtn.href);
            let url = installBtn.href;
            url = prompt("是否安装当前链接所对应的脚本？（注：如果脚本比较大，可能会花一点时间，长时间没有反馈就是安装失败）", url);
            if (url) addonApp(url);
        };
        installBtn.parentNode.insertBefore(button, installBtn.nextSibling);
        return true;
    };

    let targets = [
        "a.install-link", // greasy fork
        "a.btn.btn-info[type='text/javascript']", // openuserjs
    ];
    for (let i = 0; i < targets.length; ++i) {
        if (FindInstallBtn(targets[i])) break;
    }

})();