// ==UserScript==
// @name         Reddit Delete 🗑️
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically deletes every visible post/comment on your userpage
// @author       Agreasyforkuser
// @match        https://old.reddit.com/user/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483995/Reddit%20Delete%20%F0%9F%97%91%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/483995/Reddit%20Delete%20%F0%9F%97%91%EF%B8%8F.meta.js
// ==/UserScript==

function delete_content(){
    'use strict';
    function simulateClick(element) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }
    const linkObjects = document.querySelectorAll('.link, .comment');
    let currentIndex = 0;
    function deleteNextPost() {
        if (currentIndex < linkObjects.length) {
            const link = linkObjects[currentIndex];
            const deleteLink = link.querySelector('a[data-event-action="delete"]');
            if (deleteLink) {
                simulateClick(deleteLink);
                setTimeout(() => {
                    const yesLink = link.querySelector('a.yes');
                    if (yesLink) {
                        simulateClick(yesLink);
                        setTimeout(deleteNextPost, 300);
                    }
                }, 300);
            } else {
                currentIndex++;
                setTimeout(deleteNextPost, 300);
            }
        }
    }
    deleteNextPost();
}

    // Place a shortcut
    var link = document.createElement('a');
    link.href = 'javascript:void(0);';
    link.textContent = 'delete all content🗑️';
    link.style.color = 'white';
    link.style.backgroundColor = 'red';
    link.style.padding = '5px';
    link.style.fontWeight = 'bold';
    link.style.borderRadius = '20px';
    link.style.display = 'inline-table';
    link.addEventListener('click', function(event) {
        event.preventDefault();
        if (window.confirm('Are you sure you want to delete all visible submissions and comments?')) {
            delete_content();}
    });
    document.querySelector('.menuarea').appendChild(link);