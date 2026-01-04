// ==UserScript==
// @name         Fuck YuDao Plus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  芋道文档免登陆 注意：需要配合AdbBlock插件，拦截`*.iocoder.cn/assets/js/app*$script`资源加载
// @author       懒汉叔叔
// @match        http*://*.iocoder.cn/*
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493747/Fuck%20YuDao%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/493747/Fuck%20YuDao%20Plus.meta.js
// ==/UserScript==

(function () {

    // 取消vm debug
    (function(){}).constructor === Function;
    Function.prototype.constructor = function(){};

    'use strict';

    function modifyScript(script, newContent) {
        const parent = script.parentNode;
        const newScript = document.createElement('script');
        newScript.text = newContent;
        parent.replaceChild(newScript, script);
    }

    // 获取所有带有 async 或 defer 属性的 <script> 元素
    const asyncScripts = document.querySelectorAll('script[async],script[defer]');
    asyncScripts.forEach(script => {
        if (script.src.indexOf("app")>0) {
            let appSrc = script.src
            var xhr = new XMLHttpRequest();
            xhr.open('GET', appSrc, false);
            xhr.send();
            if (xhr.status === 200) {
                //debugger
                let str = xhr.responseText
                let newScriptText = str
                .replace(`}()&&function(){`,`}()&&function(){/*`)
                .replace(`clearInterval(a))},1e3)`,`clearInterval(a))},1e3)*/`)
                modifyScript(script, newScriptText);
            }
        }
    });

})();