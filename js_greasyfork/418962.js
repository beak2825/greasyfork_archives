// ==UserScript==
// @name         Fjord Bootcamp Keyboard Pagination
// @name:ja      フィヨルドブートキャンプ･キーページネーション
// @namespace    https://greasyfork.org/ja/users/570127
// @version      2025.12.25.3
// @description  【非公式】Fjord Bootcampで左右のキーで移動できるようになります
// @description:ja  【非公式】Fjord Bootcampで左右のキーで移動できるようになります
// @author       universato
// @license      CC0
// @match        https://bootcamp.fjord.jp/*
// @supportURL   https://twitter.com/universato
// @downloadURL https://update.greasyfork.org/scripts/418962/Fjord%20Bootcamp%20Keyboard%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/418962/Fjord%20Bootcamp%20Keyboard%20Pagination.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', function (event) {
        if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) { return; }

        const activeElement = document.activeElement;
        if (activeElement.isContentEditable) { return; }
        if (/^(INPUT|TEXTAREA)$/.test(activeElement.tagName)) { return; }

        if (event.ctrlKey || event.metaKey || event.altKey) { return; }

        let element;
        const pathnames = location.pathname.split('/');
        const flag0 = (pathnames[1] === 'reports') && pathnames[2];
        const flag1 = (pathnames[1] === 'current_user') && pathnames[2].match(/^(questions|reports|watches)$/);
        const flag2 = pathnames[1].match(/^(announcements|events|notifications|pages|portfolios|practices|questions|reports|searchables|users)$/);
        if (flag0){
            if (event.key === 'ArrowLeft'){
                element = document.querySelector('a.page-content-prev-next__item-link.is-prev');
            }else if(event.key === 'ArrowRight'){
                element = document.querySelector('a.page-content-prev-next__item-link.is-next');
            }
        } else if (flag1 || flag2){
            if (event.key === 'ArrowLeft'){
                element = document.querySelector('a.pagination__item-link.is-prev');
            }else if(event.key === 'ArrowRight'){
                element = document.querySelector('a.pagination__item-link.is-next');
            }
        }
        element?.click();
    }, false);
})();
