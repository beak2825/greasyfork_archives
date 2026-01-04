// ==UserScript==
// @name         LkMaster
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows users to bookmark pages on lkmaster.com and navigate back to them later using a button overlay.
// @author       LkTheMaster
// @match        https://lkmaster.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://lkmaster.com
// @downloadURL https://update.greasyfork.org/scripts/487749/LkMaster.user.js
// @updateURL https://update.greasyfork.org/scripts/487749/LkMaster.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Function to load bookmarks from localStorage
    function loadBookmarks() {
        return JSON.parse(localStorage.getItem('bookmarks')) || [];
    }

    // Function to save bookmarks to localStorage
    function saveBookmarks(bookmarks) {
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    // Reset bookmarks when page is loaded
    if (!localStorage.getItem('bookmarks')) {
        saveBookmarks([]);
    }

    // Add CSS for styling bookmark buttons
    const styles = `
        .bookmark-button {
            position: fixed;
            bottom: 20px;
            left: 20px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
            z-index: 9999;
            display: none;
        }
        .bookmark-button:hover {
            background-color: #0056b3;
        }
        .bookmark-item-container {
            position: fixed;
            bottom: 80px;
            left: 20px;
            z-index: 10000;
            display: none;
        }
        .bookmark-item {
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
            margin-bottom: 8px;
            display: block;
        }
        .bookmark-item:hover {
            background-color: #0056b3;
        }
        .remove-button {
            margin-left: 5px;
            color: #fff;
            cursor: pointer;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Add bookmark button
    const bookmarkButton = $('<button class="bookmark-button">&#9733;</button>').appendTo('body');

    bookmarkButton.click(function() {
        const currentPage = window.location.href;
        const bookmarks = loadBookmarks();
        bookmarks.push(currentPage);
        saveBookmarks(bookmarks);
        console.log("Bookmarked:", currentPage);
        renderBookmarkButtons();
    });

    // Render bookmark buttons
    function renderBookmarkButtons() {
        $('.bookmark-item-container').remove();
        const bookmarks = loadBookmarks();
        const container = $('<div class="bookmark-item-container"></div>').appendTo('body');
        bookmarks.forEach(function(bookmark, index) {
            const button = $(`<button class="bookmark-item">${bookmark}<span class="remove-button">x</span></button>`)
                .appendTo(container);
            button.click(function() {
                window.location.href = bookmark;
            });
            button.find('.remove-button').click(function(event) {
                event.stopPropagation();
                const updatedBookmarks = bookmarks.filter((_, i) => i !== index);
                saveBookmarks(updatedBookmarks);
                renderBookmarkButtons();
            });
        });
        container.fadeIn(); // Show bookmark buttons
    }

    // Show bookmark buttons if there are bookmarks
    $(document).ready(function() {
        renderBookmarkButtons();
    });

    // Show/hide bookmark button based on scroll position
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('.bookmark-button').fadeIn();
        } else {
            $('.bookmark-button').fadeOut();
        }
    });
})(jQuery);
