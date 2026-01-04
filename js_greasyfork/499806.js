// ==UserScript==
// @name         Amazon Books to Z-library and Anna's Archive
// @namespace    open-in-z-library-annasarchive
// @version      1.0
// @description  Adds buttons to Amazon book pages to redirect to Z-library and Annas Archive pages based on ISBN-13
// @author       Sebirate
// @match        https://*.amazon.*/*/dp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499806/Amazon%20Books%20to%20Z-library%20and%20Anna%27s%20Archive.user.js
// @updateURL https://update.greasyfork.org/scripts/499806/Amazon%20Books%20to%20Z-library%20and%20Anna%27s%20Archive.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function redirectToSingleLogin() {
        var isbn13 = getISBN13();
        if (!isbn13) {
            alert("No ISBN-13 Found.");
        } else {
            window.open('https://singlelogin.re/s/' + isbn13);
        }
    }

    function redirectToAnnasArchive() {
        var isbn13 = getISBN13();
        if (!isbn13) {
            alert("No ISBN-13 Found.");
        } else {
            window.open('https://annas-archive.gs/search?index=&page=1&q=' + isbn13);
        }
    }

    function getISBN13() {
        var detailBullets = document.getElementById('detailBulletsWrapper_feature_div');
        var isbn13 = null;

        if (detailBullets) {
            var listItems = detailBullets.querySelectorAll('ul li span.a-list-item');
            for (var i = 0; i < listItems.length; i++) {
                if (listItems[i].textContent.includes('ISBN-13')) {
                    isbn13 = listItems[i].textContent.match(/(\d{3}-\d{10}|\d{13})/)[0];
                    break;
                }
            }
        }
        return isbn13;
    }

    function addButton() {
        var imageBlockNew = document.getElementById('imageBlockNew_feature_div');
        var imageBlock = document.getElementById('imageBlock_feature_div');
        var booksImageBlock = document.getElementById('booksImageBlock_feature_div');
        var askWidgetQuestions = document.getElementById('ask-btf_feature_div');

        // Check if either of the div tags is present and ask-btf_feature_div is not present
        if ((imageBlockNew || booksImageBlock || imageBlock) && !askWidgetQuestions) {
            var singleLoginButton = createButton('Open in Z-Library', redirectToSingleLogin, '#377458');
            var annasArchiveButton = createButton('Open in Anna\'s Archive', redirectToAnnasArchive, '#0056b3');

            var buttonContainer = document.createElement('div');
            buttonContainer.style.marginTop = '20px';
            buttonContainer.style.textAlign = 'center';

            // Apply responsive styles
            var buttonsCSS = `
                display: inline-block;
                margin: 10px;
                padding: 8px 12px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-weight: bold;
                text-decoration: none;
                cursor: pointer;
                color: #ffffff;
                border: none;
                border-radius: 4px;
                background-color: transparent;
                transition: background-color 0.3s ease, transform 0.3s ease;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            `;

            singleLoginButton.style.cssText = buttonsCSS + `
                background-color: #377458;
            `;

            annasArchiveButton.style.cssText = buttonsCSS + `
                background-color: #0056b3;
            `;

            // Hover effects
            singleLoginButton.addEventListener('mouseover', function() {
                singleLoginButton.style.transform = 'scale(1.05)';
            });

            singleLoginButton.addEventListener('mouseout', function() {
                singleLoginButton.style.transform = 'scale(1)';
            });

            annasArchiveButton.addEventListener('mouseover', function() {
                annasArchiveButton.style.transform = 'scale(1.05)';
            });

            annasArchiveButton.addEventListener('mouseout', function() {
                annasArchiveButton.style.transform = 'scale(1)';
            });

            buttonContainer.appendChild(singleLoginButton);
            buttonContainer.appendChild(annasArchiveButton);

            // Insert the buttons after either of the div tags
            if (imageBlockNew) {
                imageBlockNew.parentNode.insertBefore(buttonContainer, imageBlockNew.nextSibling);
            } else if (booksImageBlock) {
                booksImageBlock.parentNode.insertBefore(buttonContainer, booksImageBlock.nextSibling);
            } else if (imageBlock) {
                imageBlock.parentNode.insertBefore(buttonContainer, imageBlock.nextSibling);
            }
        }
    }

    function createButton(text, onClickFunction, backgroundColor) {
        var button = document.createElement('button');
        button.innerText = text;
        button.onclick = onClickFunction;

        return button;
    }

    function shadeColor(color, percent) {
        var f = parseInt(color.slice(1), 16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16,
            G = (f >> 8) & 0x00FF,
            B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }

    addButton();
})();
