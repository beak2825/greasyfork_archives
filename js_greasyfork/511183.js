// ==UserScript==
// @name         Exhentai Flow Viewer
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @author       MrJohnnY20
// @match        https://exhentai.org/s/*
// @description  This scripts helps you to view a gallery in a single page, from up to down.
// @locale       en
// @downloadURL https://update.greasyfork.org/scripts/511183/Exhentai%20Flow%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/511183/Exhentai%20Flow%20Viewer.meta.js
// ==/UserScript==

var container; // The <div> to hold images, intending to inherit it's style.
var parser;

function getNext(currURL, currDOC) {
    'use strict';
    var nextURL = currDOC.getElementById('next').href;

    // The last page has the next url directing to itself.
    if (currURL === nextURL) {
        console.log('Reach the last page');
        return;
    }

    // Prepare http request for the next page.
    var nextPage = new XMLHttpRequest();
    nextPage.onreadystatechange = function () {
        if (nextPage.readyState !== 4) {
            return;
        }

        if (nextPage.status !== 200) {
            console.log('Failed to fetch ' + nextURL + ': ' + nextPage.status);
            return;
        }

        var doc = parser.parseFromString(nextPage.responseText, 'text/html');
        var img = doc.getElementById('img');

        const originalImgOnError = img.getAttribute('onerror');

        // Originally a method 'nl' (in ehg_show.c.js) will be called on image fetch fail to change the url with a query `?nl=xxxx-xxxx`. This uses a backup server with different img URL.
        // Stop ehg_c from refreshing the page and use the backup img URL directly.
        img.onerror = () => {
            // This will cause an error log in browser console.
            console.log('Error loading img. Try uses backup img instead.');
            const regex = /'([^']*)'/g;
            let suffix = '';
            try {
                suffix = regex.exec(originalImgOnError)[1];
            } catch (e) {
                console.log(
                    'Extract the nl parameter fails. Loading backup image fails.'
                );
                return;
            }
            const backupPageURL = nextURL + '?nl=' + suffix;

            // Fetch backup img url.
            const backupPage = new XMLHttpRequest();
            backupPage.onreadystatechange = () => {
                if (backupPage.readyState !== 4 || backupPage.status !== 200) {
                    return;
                }

                const backupImgURL = parser
                    .parseFromString(backupPage.responseText, 'text/html')
                    .getElementById('img')
                    .getAttribute('src');

                img.src = backupImgURL;
            };
            backupPage.open('GET', backupPageURL, false);
            backupPage.send();
        };

        img.style.paddingTop = '1em';
        container.append(img);
        setTimeout(getNext, 500, nextURL, doc);
    };

    nextPage.open('GET', nextURL, false);
    nextPage.send();
}

(function () {
    parser = new DOMParser();
    container = document.getElementById('i3');
    getNext(document.URL, document);
})();