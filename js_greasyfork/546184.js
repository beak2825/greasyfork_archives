// ==UserScript==
// @name         巴哈姆特 - 巴哈小屋文章翻頁快捷鍵
// @namespace    http://tampermonkey.net/
// @version      2025-08-18
// @description  巴哈小屋文章翻頁左右方向快捷鍵。
// @author       You
// @match        *://*/*
// @match        https://home.gamer.com.tw/artwork.php?sn=*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546184/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E5%B7%B4%E5%93%88%E5%B0%8F%E5%B1%8B%E6%96%87%E7%AB%A0%E7%BF%BB%E9%A0%81%E5%BF%AB%E6%8D%B7%E9%8D%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/546184/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20-%20%E5%B7%B4%E5%93%88%E5%B0%8F%E5%B1%8B%E6%96%87%E7%AB%A0%E7%BF%BB%E9%A0%81%E5%BF%AB%E6%8D%B7%E9%8D%B5.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

        const linkTexts = {
            ArrowLeft: ['上一篇', '上一頁','上一页','上一章','前一篇', '前一頁','前一页','前一章', '←', '‹', '«', 'Previous', 'Prev', 'Zurück', 'Précédent', 'Anterior', 'Indietro'],
            ArrowRight: ['下一篇','下一頁','下一页','下一章','後一篇', '後一頁','後一页','下一章', '→', '›', '»', 'Next', 'Weiter', 'Suivant', 'Siguiente', 'Avanti']
        };

        const targetTextList = linkTexts[e.key];
        const links = Array.from(document.querySelectorAll('a'));

  const getLinkText = link => {
    const text = link.textContent || '';
    const aria = link.getAttribute('aria-label') || '';
    const title = link.getAttribute('title') || '';
    return (text + ' ' + aria + ' ' + title).toLowerCase();
  };
        const target = links.find(link => {
            const text = getLinkText(link).trim();
            return targetTextList.some(keyword => text.includes(keyword.toLowerCase()));
        });

        if (target) {
            target.click();
        } else {
            console.log(`找不到符合「${e.key === 'ArrowLeft' ? '上一頁' : '下一頁'}」的連結`);
        }
    });
})();
