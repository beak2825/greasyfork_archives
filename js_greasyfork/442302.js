// ==UserScript==
// @name         bootstrap docs bookmark
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  bootstrap docs bookmarks
// @author       Fenion
// @match        https://bootstrap-4.ru/docs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getbootstrap.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/442302/bootstrap%20docs%20bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/442302/bootstrap%20docs%20bookmark.meta.js
// ==/UserScript==

window.onload = () => {
    const bmbutton = document.createElement('div');
    bmbutton.innerText = 3;
    bmbutton.style = `position: fixed;
        bottom: 20px;
        right: 20px;
        background: gold;
        width: 30px;
        height: 30px;
        `;
    bmbutton.addEventListener('click', () => {
        if (!localStorage.getItem('bookmark')) return;
        const [id, path] = localStorage.getItem('bookmark').split(',');
        if (location.pathname === path) return document.getElementById(id).scrollIntoView();
        location.href = encodeURI(location.origin + path + "#" + id);
    });
    document.body.appendChild(bmbutton);

    const targetPage = document.getElementsByClassName('bd-content')[0];
    const headersCollection = targetPage.querySelectorAll('h3, h2, h4');
    for (const header of headersCollection) {
        const addButton = document.createElement('button');
        addButton.innerText = '+';
        addButton.addEventListener('click', () => {
            localStorage.setItem('bookmark', [header.id, location.pathname]);
            alert('Сохранено');
        });
        header.appendChild(addButton);
    }
};