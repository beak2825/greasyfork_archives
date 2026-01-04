// ==UserScript==
// @name         bathome 代码高亮
// @namespace    aloxaf_bat
// @version      0.0.7
// @description  将 bathome 的代码块使用 highlight.js 高亮
// @author       aloxaf
// @include      /https?://[^.]+.bathome.net/
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/highlight.min.js
// @require      https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/languages/dos.min.js
// @require      https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/languages/vbscript.min.js
// @require      https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/languages/powershell.min.js
// @require      https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/languages/rust.min.js
// @require      https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/languages/awk.min.js
// @require      https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.17.1/build/languages/julia.min.js
// @require      https://cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.7.0/dist/highlightjs-line-numbers.min.js
// @downloadURL https://update.greasyfork.org/scripts/391890/bathome%20%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/391890/bathome%20%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

/*
highlight.min.js 已包含对以下语言的支持, 如果需要其他语言请手动添加
apache bash coffeescript cpp cs css
diff http ini java javascript json
makefile xml markdown nginx
objectivec perl php properties python
ruby shell sql yaml
*/

(function() {
    'use strict';

    // 配置白名单, 因为 PowerShell 总是被识别成 PHP, 然而事实上论坛 PHP 并不多
    // 故用白名单排除掉其他语言
    hljs.configure({
        classPrefix: 'hljs-',
        tabReplace: null,
        useBR: false,
        languages: [
            'dos', 'vbscript', 'powershell', 'awk', 'bash', 'javascript',
            'python', 'perl', 'rust', 'julia', 'cpp', 'cs',
            'html', 'xml', 'json', 'ini',
        ],
    });

    function extract_text(codeblock) {
        let result = document.evaluate('.//li/text()', codeblock, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
        let node = result.iterateNext();
        let str = '';
        while (node) {
            str += node.data;
            node = result.iterateNext();
        }
        return str;
    }

    let codeblocks = document.getElementsByTagName('pre');
    for (let codeblock of codeblocks) {
        let text = extract_text(codeblock)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        codeblock.innerHTML=`<code>${text}</code>`;
        codeblock.classList.remove('blockcode');
    }

    for (let codeblock of document.getElementsByTagName('code')) {
        hljs.highlightBlock(codeblock);
        hljs.lineNumbersBlock(codeblock);
    }

})();