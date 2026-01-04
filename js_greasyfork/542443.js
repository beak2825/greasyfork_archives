// ==UserScript==
// @name         短剧测试工具
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  短剧数据测试工具
// @author       诸葛
// @match        https://duanju.baidu.com/builder/rc/playletPlat/home
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542443/%E7%9F%AD%E5%89%A7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/542443/%E7%9F%AD%E5%89%A7%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const mainBtn = document.createElement('button');
    mainBtn.textContent = '操作菜单';
    Object.assign(mainBtn.style, {
        position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999',
        padding: '10px 15px', borderRadius: '8px', backgroundColor: '#007bff',
        color: '#fff', border: 'none', cursor: 'pointer',
    });
    document.body.appendChild(mainBtn);

    const btnContainer = document.createElement('div');
    Object.assign(btnContainer.style, {
        position: 'fixed', bottom: '70px', right: '20px', zIndex: '9999',
        display: 'none', flexDirection: 'column', gap: '8px',
    });
    document.body.appendChild(btnContainer);

    function createSubBtn(text, onClickFn) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            padding: '8px 12px', borderRadius: '6px', backgroundColor: '#28a745',
            color: '#fff', border: 'none', cursor: 'pointer',
        });
        btn.onclick = onClickFn;
        return btn;
    }

    function makeEditable(span, outlineColor, tooltip, isPaid = false) {
        const originalText = span.textContent.trim();
        const prefix = isPaid && originalText.startsWith('¥') ? '¥' : '';
        const valueOnly = originalText.replace(/[¥w万]/g, '').trim();

        const input = document.createElement('input');
        input.value = valueOnly;
        input.style.width = `${span.offsetWidth}px`;
        input.style.border = `1px dashed ${outlineColor}`;
        input.style.fontSize = window.getComputedStyle(span).fontSize;
        input.style.color = window.getComputedStyle(span).color;
        input.style.background = 'transparent';
        input.style.outline = 'none';
        input.style.textAlign = 'center';

        span.replaceWith(input);
        input.focus();

        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                let val = parseFloat(input.value.trim());
                if (!isNaN(val)) {
                    let formatted = val >= 10000 ? (val / 10000).toFixed(1).replace(/\.0$/, '') + 'w' : val.toString();
                    formatted = prefix + formatted;

                    const newSpan = document.createElement('span');
                    newSpan.className = 'enmr19oCUPIn5TZV7oQu';
                    newSpan.textContent = formatted;

                    input.replaceWith(newSpan);
                    insertGrowthInfo(newSpan);
                }
            }
        });
    }

    function hasGrowthInfoInserted(span) {
        const next1 = span.nextElementSibling;
        const next2 = next1 && next1.nextElementSibling;
        return (
            next1?.classList?.contains('e_q69JpbpTsjLLUrAKe0') ||
            next2?.classList?.contains('NyUBXuiR44wQStiPo79R')
        );
    }

    function insertGrowthInfo(span) {
        if (hasGrowthInfoInserted(span)) return;

        const textSpan = document.createElement('span');
        textSpan.className = 'e_q69JpbpTsjLLUrAKe0';
        textSpan.textContent = '比前7日';

        const percentDiv = document.createElement('div');
        percentDiv.className = 'NyUBXuiR44wQStiPo79R xE23oh9COyXzWJqnezeb';
        percentDiv.style.display = 'inline-flex';
        percentDiv.style.alignItems = 'center';
        percentDiv.style.gap = '4px';

        const arrow = document.createElement('span');
        arrow.textContent = '▲';
        arrow.style.color = 'red';
        arrow.style.fontWeight = 'bold';

        const percentValue = document.createElement('span');
        percentValue.textContent = `${Math.floor(Math.random() * 21) + 10}%`;
        percentValue.style.color = 'red';
        percentValue.style.fontWeight = 'bold';

        percentDiv.appendChild(arrow);
        percentDiv.appendChild(percentValue);

        span.insertAdjacentElement('afterend', percentDiv);
        span.insertAdjacentElement('afterend', textSpan);
    }

    function modifySpanForFreeOrPaid() {
        document.querySelectorAll('span.enmr19oCUPIn5TZV7oQu').forEach(span => {
            const text = span.textContent.trim();
            if (/^¥?\d/.test(text)) {
                makeEditable(span, 'orange', '仅修改数值部分（¥不变），回车完成', true);
            }
        });
    }

    btnContainer.appendChild(createSubBtn('数据修改', modifySpanForFreeOrPaid));

    mainBtn.addEventListener('click', () => {
        btnContainer.style.display = btnContainer.style.display === 'none' ? 'flex' : 'none';
    });

    const style = document.createElement('style');
    style.textContent = `
        input:focus,
        span[contenteditable="true"]:focus {
            outline: none !important;
            box-shadow: none !important;
            border: none !important;
        }
    `;
    document.head.appendChild(style);
})();
