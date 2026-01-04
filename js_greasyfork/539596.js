// ==UserScript==
// @name         复制标题bigseller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  复制标题
// @license      MIT
// @author       Rayu
// @match        https://www.bigseller.pro/web/statis/board.htm
// @match        https://www.bigseller.com/web/statis/board.htm
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/539596/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98bigseller.user.js
// @updateURL https://update.greasyfork.org/scripts/539596/%E5%A4%8D%E5%88%B6%E6%A0%87%E9%A2%98bigseller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement('button');
    btn.textContent = '复制标题';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: 9999,
        padding: '8px 15px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
    });
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        const elems = document.querySelectorAll('.line_ellipsis.title_el:not(.name_el)');
        if(elems.length === 0) {
            alert('未找到符合条件的元素！');
            return;
        }
        const textList = Array.from(elems).map(e => e.innerText.trim());
        const textToCopy = textList.join('\n');

        if(typeof GM_setClipboard === 'function'){
            GM_setClipboard(textToCopy);
            alert('已复制符合条件元素的文本！');
        } else if(navigator.clipboard){
            navigator.clipboard.writeText(textToCopy).then(() => {
                alert('已复制符合条件元素的文本！');
            }).catch(e => alert('复制失败：'+e));
        } else {
            alert('浏览器不支持复制操作！');
        }
    });
})();
