// ==UserScript==
// @name         EntHub Draw
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Выборка постов для розыгрыша
// @author       REIONE
// @match        https://enthub.it/story/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enthub.it
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/1275709
// @downloadURL https://update.greasyfork.org/scripts/490205/EntHub%20Draw.user.js
// @updateURL https://update.greasyfork.org/scripts/490205/EntHub%20Draw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
      #copy-list-btn {
        position: absolute;
        right: 4rem;
      }
    `);

    const keyword = "участвую";
    const sortingBtn = document.querySelector('.relative.inline-block.text-left[x-data="wireui_dropdown"]');
    const getListBtn = document.createElement('a');
    getListBtn.innerText = 'Собрать список участвующих';
    getListBtn.id = 'copy-list-btn';
    getListBtn.href = '#';
    getListBtn.className = "text-lg font-semibold dark:text-slate-200";
    getListBtn.onclick = (e) => {
        e.preventDefault();
        const posts = document.querySelectorAll('#comments div[id*="comment-"] p.comment-body');
        let text = '';
        let number = 0;
        for (let i = 0; i < posts.length; i++) {
            const postText = posts[i].innerText.toLowerCase();
            const words = postText.split(' ');
            if (words[0].includes(keyword)) {
                const author = posts[i].parentElement.querySelector('a[href*="https://enthub.it/u/"]').href;
                const url = document.location.href + `#${posts[i].parentElement.id}`;
                text += `${number} | Автор: ${author} | Ссылка на комментарий: ${url} | Текст: ${posts[i].innerText}\n\n`;
                number++;
            }
        }
        navigator.clipboard.writeText(text);
        alert("Скопировано в буфер");
    }
    sortingBtn.parentElement.insertBefore(getListBtn, sortingBtn);
})();