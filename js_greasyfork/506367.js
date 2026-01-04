// ==UserScript==
// @name         Huggingface LaTeX 解析 (KaTeX)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  使用 KaTeX 解析 Hugging Face 数据集页面中的 LaTeX 公式
// @author       qzh
// @match        https://huggingface.co/datasets/*
// @match        https://hf-mirror.com/datasets/*
// @icon         https://huggingface.co/favicon.ico
// @license      GPL
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/506367/Huggingface%20LaTeX%20%E8%A7%A3%E6%9E%90%20%28KaTeX%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506367/Huggingface%20LaTeX%20%E8%A7%A3%E6%9E%90%20%28KaTeX%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载 KaTeX 库
    var katexScript = document.createElement("script");
    katexScript.type = "text/javascript";
    katexScript.src = "https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.js";
    document.getElementsByTagName("head")[0].appendChild(katexScript);

    var katexCss = document.createElement("link");
    katexCss.rel = "stylesheet";
    katexCss.href = "https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/katex.min.css";
    document.getElementsByTagName("head")[0].appendChild(katexCss);

    // 加载 KaTeX 自动渲染插件
    var autoRenderScript = document.createElement("script");
    autoRenderScript.type = "text/javascript";
    autoRenderScript.src = "https://cdn.jsdelivr.net/npm/katex@0.15.3/dist/contrib/auto-render.min.js";
    document.getElementsByTagName("head")[0].appendChild(autoRenderScript);

    // 确保所有资源加载完毕后执行渲染
    autoRenderScript.onload = function() {
        // 定期检查元素是否存在
        var checkExist = setInterval(function() {
            const targetElements = document.querySelectorAll('td.min-w-fit.max-w-sm.break-words.p-2, td.min-w-fit.max-w-sm.break-words.p-2.align-top');
            if (targetElements.length > 0) {
                clearInterval(checkExist); // 找到元素后停止检查
                renderLatexInElement(document.body);
            }
        }, 1000); // 每秒检查一次
    };

    // 针对特定类名进行监听和渲染
    function renderLatexInElement(element) {
        const targetElements = element.querySelectorAll('td.min-w-fit.max-w-sm.break-words.p-2, td.min-w-fit.max-w-sm.break-words.p-2.align-top');
        if (targetElements.length === 0) {
            console.warn("未找到匹配的元素");
        } else {
            targetElements.forEach(el => {
                try {
                    renderMathInElement(el, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "\\[", right: "\\]", display: true},
                            {left: "\\(", right: "\\)", display: false},
                            {left: "$", right: "$", display: false}
                        ],
                        throwOnError: false
                    });
                } catch (e) {
                    console.error("KaTeX rendering error:", e);
                }
            });
        }
    }
})();
