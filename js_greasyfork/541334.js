// ==UserScript==
// @name         一键收纳/展开勋章按钮
// @namespace    https://zmpt.cc/
// @namespace    https://zmpt.club/
// @version      1.6
// @description  只在指定站点的用户详情页收纳/展开勋章，兼容慢加载
// @author       Copilot
// @match        https://zmpt.cc/userdetails.php*
// @match        https://zmpt.club/userdetails.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541334/%E4%B8%80%E9%94%AE%E6%94%B6%E7%BA%B3%E5%B1%95%E5%BC%80%E5%8B%8B%E7%AB%A0%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/541334/%E4%B8%80%E9%94%AE%E6%94%B6%E7%BA%B3%E5%B1%95%E5%BC%80%E5%8B%8B%E7%AB%A0%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getMedalContainer() {
        let forms = document.getElementsByTagName('form');
        for (let form of forms) {
            let divs = form.querySelectorAll('div[style*="flex-wrap: wrap"]');
            for (let div of divs) {
                let children = div.children;
                if (children.length > 0 && children[0].querySelector('img.preview')) {
                    return div;
                }
            }
        }
        return null;
    }

    function hideMedalCards(medalContainer) {
        if (!medalContainer) return [];
        let medalCards = Array.from(medalContainer.children);
        medalCards.forEach(card => {
            card.style.display = 'none';
            // 修正图片协议
            let imgs = card.querySelectorAll('img');
            imgs.forEach(img => {
                if (img.src.startsWith('http://')) {
                    img.src = img.src.replace('http://', 'https://');
                }
            });
        });
        return medalCards;
    }

    function insertButton(medalContainer, medalCards) {
        // 防止重复插入
        if (medalContainer.parentNode.querySelector('.medal-toggle-btn')) return;

        let btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'medal-toggle-btn';
        btn.innerText = '展开勋章';
        btn.style.margin = '10px';
        btn.style.padding = '4px 12px';
        btn.style.background = '#feb147';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '16px';

        let isCollapsed = true;
        btn.onclick = function (e) {
            e.stopPropagation();
            isCollapsed = !isCollapsed;
            medalCards.forEach(card => card.style.display = isCollapsed ? 'none' : '');
            btn.innerText = isCollapsed ? '展开勋章' : '收纳勋章';
        };

        medalContainer.parentNode.insertBefore(btn, medalContainer);
    }

    // 轮询查找勋章区，最多查找3秒
    let tryCount = 0;
    let timer = setInterval(function () {
        let medalContainer = getMedalContainer();
        if (medalContainer) {
            clearInterval(timer);
            let medalCards = hideMedalCards(medalContainer);
            insertButton(medalContainer, medalCards);
        }
        if (++tryCount > 30) clearInterval(timer); // 最多查30次
    }, 100);

})();