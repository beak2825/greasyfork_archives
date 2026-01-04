// ==UserScript==
// @name            Copy Title Alt+T
// @name:zh         Alt+T 复制Markdown格式标题和地址快速分享
// @name:en         Alt+T Copy Title and Link as Markdown Style
// @description     Press Alt+T to copy title and url like this `# ${TITLE}\n${URL}` and Alt+Shift+T to copy the markdown style link `[${TITLE}]( ${URL} )`
// @description:zh  按 Alt+T 复制 Markdown 格式的链接 `[${TITLE}]( ${URL} )` and Alt+Shift+T 复制 标题和地址 `# ${TITLE}\n${URL}`
// @namespace       https://userscript.snomiao.com/
// @version         0.7.3
// @author          snomiao@gmail.com
// @match           *://*/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/400973/Copy%20Title%20Alt%2BT.user.js
// @updateURL https://update.greasyfork.org/scripts/400973/Copy%20Title%20Alt%2BT.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var textCopy = (content) => {
        const input = document.createElement('textarea');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', content);
        input.innerHTML = content;
        input.setAttribute(
            'style',
            'position: fixed; top:0; left:0;z-index: 9999'
        );
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, input.value.length);

        let ok = false;
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            ok = true;
        }
        document.body.removeChild(input);
        ok && alert('Title Copied\n' + content);
        ok || alert('copy title failed, please check browser version');
        return ok || false;
    };
    var TitleGet = () => {
        const LongestTitle = [
            document.title,
            document.querySelector('h1')?.innerText || '',
        ]
            .map((str) => str.replace(/\r?\n.*/g, ''))
            .sort((a, b) => a.length - b.length)
            .pop();
        return LongestTitle;
    };
    window.addEventListener(
        'keydown',
        (e) => {
            if (e.altKey && !e.shiftKey && !e.ctrlKey && e.code == 'KeyT') {
                textCopy(`[${TitleGet()}]( ${location.href} )`);
                e.preventDefault();
                e.stopPropagation();
            }
            if (e.altKey && e.shiftKey && !e.ctrlKey && e.code == 'KeyT') {
                textCopy(`# ${TitleGet()}\n${location.href}`);
                e.preventDefault();
                e.stopPropagation();
            }
        },
        false
    );
})();
