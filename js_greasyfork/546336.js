// ==UserScript==
// @name         LZT_AccountMenuScrollFix
// @namespace    https://greasyfork.org/ru/scripts/546336
// @version      1.0
// @description  Добавляет адаптивную прокрутку в меню навигации и исправляет отображение на разных экранах.
// @author       llimonix
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @match        https://lzt.market/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546336/LZT_AccountMenuScrollFix.user.js
// @updateURL https://update.greasyfork.org/scripts/546336/LZT_AccountMenuScrollFix.meta.js
// ==/UserScript==

(function() {
    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    addGlobalStyle(`
        .menuBlockWrapper {
            max-height: 85vh;
            overflow-y: auto;
        }

        .menuBlockWrapper::-webkit-scrollbar {
            width: 5px;
        }

        .menuBlockWrapper::-webkit-scrollbar-thumb {
            background-color: #949494;
            border: 1px solid transparent;
            border-radius: 10px;
            background-clip: padding-box;
        }
    `);

    const menuBlocks = document.querySelectorAll('div#AccountMenu div.menuBlock');
    menuBlocks.forEach(block => {
        block.classList.add('menuBlockWrapper');
    });

})();
