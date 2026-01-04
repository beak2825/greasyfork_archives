// ==UserScript==
// @name         替换<code>让谷歌翻译更准确
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  谷歌翻译不能正确翻译带<code>的元素,更新修复某些code显示灰底白字看不清
// @author       You
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452850/%E6%9B%BF%E6%8D%A2%3Ccode%3E%E8%AE%A9%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E6%9B%B4%E5%87%86%E7%A1%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/452850/%E6%9B%BF%E6%8D%A2%3Ccode%3E%E8%AE%A9%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E6%9B%B4%E5%87%86%E7%A1%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const func = ()=>{
        setTimeout(()=>{
            Array.from(document.getElementsByTagName('code')).forEach(code=>{
                const isLongCode = code.offsetWidth > 200
                //document.documentElement.offsetWidth/3
                if (!isLongCode) {
                    const span = document.createElement('span')
                    span.textContent = code.textContent


                    // 获取code的计算样式
                    const codeStyle = window.getComputedStyle(code);

                    // 复制相关样式到span
                    span.style.backgroundColor = codeStyle.backgroundColor;
                    span.style.color = codeStyle.color;
                    span.style.padding = codeStyle.padding;
                    span.style.margin = codeStyle.margin;
                    span.style.border = codeStyle.border;
                    span.style.borderRadius = codeStyle.borderRadius;
                    span.style.fontFamily = codeStyle.fontFamily;
                    span.style.fontSize = codeStyle.fontSize;
                    span.style.fontWeight = codeStyle.fontWeight;
                    span.style.lineHeight = codeStyle.lineHeight;

                    // 替换code元素
                    code.parentNode.insertBefore(span, code)
                    code.parentElement.removeChild(code)
                }
            })

            console.log('替换<code>完成')

        }
                   , 1000)
    }

    func();

    //修改native以拦截popstate事件
    var pushState = history.pushState;
    history.pushState = function() {
        var ret = pushState.apply(history, arguments);
        window.dispatchEvent(new Event("pushstate"));
        window.dispatchEvent(new Event("locationchangefathom"));
        return ret;
    }

    window.addEventListener("popstate", function() {
        window.dispatchEvent(new Event("locationchangefathom"))
    });
    window.addEventListener("locationchangefathom", trackPageview)
    function trackPageview() {
        func();
    }
}
)();
