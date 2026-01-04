// ==UserScript==
// @name         Goodreads - Enlarge edition covers
// @namespace    https://greasyfork.org/users/11679
// @version      1.0
// @description  Enlarge book covers on Goodreads editions page
// @author       Drazen Bjelovuk
// @match        *://www.goodreads.com/work/editions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407629/Goodreads%20-%20Enlarge%20edition%20covers.user.js
// @updateURL https://update.greasyfork.org/scripts/407629/Goodreads%20-%20Enlarge%20edition%20covers.meta.js
// ==/UserScript==

(function() {
    const button = document.createElement('a');
    button.innerText = 'enlarge covers';
    button.className = 'right';
    button.style.marginLeft = '8px';
    button.href = '';
    button.onclick = (e) => {
        e.preventDefault();
        document.querySelectorAll('.leftAlignedImage').forEach((el) => {
            el.style.width = 'auto';
            const img = el.querySelector('img')
            img.setAttribute('src', img.getAttribute('src').replace(/[^.]*\.([^.]*)$/, '$1'));
            img.removeAttribute('height');
            img.setAttribute('width', '150');
        });
    };
    const container = document.querySelector('.leftContainer.workEditions');
    container.insertBefore(button, container.firstChild);
})();