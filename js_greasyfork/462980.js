// ==UserScript==
// @name         自适应宽度脚本2
// @version      2
// @description  自动将页面宽度调整为适合屏幕大小的宽度
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @namespace https://greasyfork.org/users/13961
// @downloadURL https://update.greasyfork.org/scripts/462980/%E8%87%AA%E9%80%82%E5%BA%94%E5%AE%BD%E5%BA%A6%E8%84%9A%E6%9C%AC2.user.js
// @updateURL https://update.greasyfork.org/scripts/462980/%E8%87%AA%E9%80%82%E5%BA%94%E5%AE%BD%E5%BA%A6%E8%84%9A%E6%9C%AC2.meta.js
// ==/UserScript==
(function() {
    var SCROLLBAR_ADJUST = 16; // 滚动条宽度的调整值
    var isFit = GM_getValue('isFit', true); // 是否启用自适应宽度
    function addPreWrapCSS() {
        var style = document.createElement('style');
        style.innerHTML = 'pre { white-space: pre-wrap; }';
        document.head.appendChild(style);
    }
    function iter(elems, f) {
        for (var i = 0; i < elems.length; i++) {
            var e = elems[i];
            if (f(e)) {
                // 处理 e 元素
            }
        }
    }
    function fit() {
        addPreWrapCSS();
        var elements = document.querySelectorAll('*');
        iter(elements, function(e) {
            if (e.tagName === 'PRE') {
                e.style.maxWidth = 'none';
            }
            if (e.offsetWidth > window.innerWidth - SCROLLBAR_ADJUST) {
                e.style.width = '100%';
                e.style.boxSizing = 'border-box';
            } else {
                e.style.width = 'auto';
            }
        });
    }
    function applyFit() {
        isFit = !isFit;
        GM_setValue('isFit', isFit);
        GM_notification('自适应宽度状态已更新：' + (isFit ? '开启' : '关闭'));
        window.postMessage({ cmd: 'toggle', fit: isFit }, '*');
        fit();
    }
    function processMessage(event) {
        if (event.data.cmd === 'toggle') {
            applyFit();
        }
    }
    window.addEventListener('resize', function() {
        if (isFit) {
            fit();
        }
    });
    window.addEventListener('message', processMessage, false);
    if (isFit) {
        fit();
    }
       // 监听查看全部回答按钮的点击事件
    var btn = document.querySelector('.QuestionMainAction');
    if (btn) {
        btn.addEventListener('click', function() {
            // 等待回答内容加载完成后再执行自适应宽度
            setTimeout(fit, 1000);
        });
    }
})();