// ==UserScript==
// @name         去除360安全/极速扩展中心限制
// @author       huqiu2
// @version      2.0.0.0
// @grant        unsafeWindow
// @run-at       document-idle
// @license      MPL-2.0
// @description  让其他基于Chromium的浏览器可以直接从360安全/极速扩展中心下载扩展，不主动 不解释 不负责
// @icon         data:image/x-icon;base64,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lv//+u//8/zw/6Dtnf86yzj/A7L//wCx//8AsP//ALH//wCx//8Asf//ALH//w9i/v8ZNf3/GTj+/xk7/v8aPf//Gj//nintFLAq6xP/Zc8Q//STDf/2lg3/9pkM//ebDf/4ng3/+KIM//mkDP/6qAz/+6sM//utDv/916H//////////////////////6Dj0P8Arf//AK3//wCt//8Arf//AK3//wCt//8Fl///GDL8/xgz/f8ZNv7/GTn+/xo8/v8aPv/NKewUfjLoE7Tolg369ZQN//aXDf/2mQ3/95sN//ifDP/5ogz/+aUM//qoDP/7qRH/821i//3w+f//////////////////////7fn//wCp//8Aqf//AKn//wCq//8Aqv//A57//xQ5/P8YLvz/GDL9/xk1/f8ZOP7/GTv+/xo9/+MAAAAA9ZINUfWSDf/1kg3/9ZIN//WTDf/1lA3/9pUN//aYDf/3mg3/+JwP//Fgcf/pKbn//fD6///////////////////////s+P//AKf//wCm//8Ap///AKb//wWO/v8UM/v/Fyn7/xct/P8YMP3/GDT9/xk3/v8ZOv7/Gjz+3QAAAAD1lQ6m9ZUO//WVDv/1lQ7/9ZUO//WVDv/1lQ7/9ZUO//WVDv/yblb/6S28/+ktvP/1o+L//////////////////////4/X//8ApP//AKT//wWN/v8PRfv/FiD6/xYj+/8XJ/v/Fyv8/xgv/P8YMv3/GTb9/xk5/v8ZO/64AAAAAPaZENf2mRD/9pkQ//aZEP/2mRD/9pkQ//aZEP/2mRD/9pMd/+w0tv/rML//6zC//+s1wf/zoeD/8vP///Hy//+iu///PWb0/zpX9P8uQfv/GBz5/xUa+f8VHvr/FiL6/xYm+/8XKvz/GC38/xgx/f8YNP3/GTj+/xk6/ncAAAAA950R8vedEf/3nRH/950R//edEf/3nRH/950R//edEf/zZW7/7TTC/+00wv/tM8L/7DPC/+wwv/9kN+j/NUH9/zVB/v80Qv7/NUH+/zVB/f80Pvz/HCH6/xUc+f8WIPr/FiT7/xco+/8XLPz/GDD8/xgz/f8ZNv7/GTn+IwAAAAD3oRPy96ET//ehE//3oRP/96ET//ehE//3oRP/96ET/+8/sv/vN8b/7zfF/+83xv/vN8X/7jbF/70n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
// @match        https://ext.se.360.cn/*
// @match        https://ext.chrome.360.cn/*
// @require      https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js
// @namespace    https://greasyfork.org/zh-CN/scripts/481066
// @downloadURL https://update.greasyfork.org/scripts/481066/%E5%8E%BB%E9%99%A4360%E5%AE%89%E5%85%A8%E6%9E%81%E9%80%9F%E6%89%A9%E5%B1%95%E4%B8%AD%E5%BF%83%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/481066/%E5%8E%BB%E9%99%A4360%E5%AE%89%E5%85%A8%E6%9E%81%E9%80%9F%E6%89%A9%E5%B1%95%E4%B8%AD%E5%BF%83%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {

    function matchURL(x) {
        return window.location.href.indexOf(x) != -1;
    }

    // 360极速扩展中心
    if (matchURL("ext.chrome.360.cn")) {
        Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 QIHU 360EE",writable:false,configurable:false,enumerable:true});
        document.getElementById('yellowtip').remove();
    }

    // 360安全扩展中心
    if (matchURL("ext.se.360.cn")) {
        Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.289 Safari/537.36 QIHU 360SE",writable:false,configurable:false,enumerable:true});
        // 选择要删除的 script 元素
        var scripts = document.querySelectorAll('script[src="js/se6api.js"], script[src="js/appcenter.js?v=2"]');

        // 如果找到了要删除的 script 元素，则删除它
        if (scripts.length > 0) {
            scripts.forEach(function (script) {
                script.remove();
                console.log("360 脚本被删除了");
            });
        }

        // 提取JSON函数
        function extractJSONFunction() {
            if (typeof unsafeWindow.extlist !== 'undefined') {
                return unsafeWindow.extlist;
            } else {
                console.error('extlist 对象未定义');
                return null;
            }
        }

        // 替换div元素中a标签的href值
        var divs = document.querySelectorAll('div.appwrap');
        for (var i = 0; i < divs.length; i++) {
            var crx_id = divs[i].getAttribute('crx_id');
            var extlist = extractJSONFunction(); // 调用提取 JSON 函数获取 extlist 的 JSON 数组
            if (extlist[crx_id]) {
                var filename = extlist[crx_id].filename;
                var aTag = divs[i].querySelector('a.install');
                aTag.setAttribute('href', filename); // 替换 a 标签中的 href 值为获取到的 filename
                console.log("DIV替换完毕！");
            }
        }

        // 替换li元素中a标签的href值
        var liElements = document.querySelectorAll('li[crx_id]');
        liElements.forEach(function (li) {
            var crxId = li.getAttribute('crx_id');
            var extlist = extractJSONFunction(); // 调用提取 JSON 函数获取 extlist 的 JSON 数组
            if (extlist[crxId]) {
                var filename = extlist[crxId].filename;
                var aTag = li.querySelector('a.install');
                if (aTag) {
                    aTag.setAttribute('href', filename);
                    console.log("LI替换完毕！");
                }
            }
        });
    }
})();
