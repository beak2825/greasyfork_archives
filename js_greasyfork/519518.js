// ==UserScript==
// @name         MediaFire Batch Downloader
// @namespace    http://tampermonkey.net/
// @include     http://www.mediafire.com/folder/*
// @include     https://www.mediafire.com/folder/*
// @include     http://www.mediafire.com/file/*
// @include     https://www.mediafire.com/file/*
// @version      0.2
// @description  Batch download files from a MediaFire folder
// @author       ShadowLin / Update by Dwelling9512
// @license      GNU GPL v3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519518/MediaFire%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/519518/MediaFire%20Batch%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let linkSet = new Set();

    function findAll() {
        var listItems = document.querySelectorAll('#main_list > li');
        var found = false;
        var listSize = linkSet.size;
        for (var i = 0; i < listItems.length; i++) {
            var link = listItems[i].querySelector('a');
            if (link) {
                linkSet.add(link.href);
                if (linkSet.size > listSize) {
                    found = true;
                }
            }
        }

        var newLinks = linkSet.size - listSize;
        listSize = linkSet.size;

        if (found) {
            window.scrollBy(0,60*newLinks);
            //console.log("MORE!");
            //console.log(newLinks);
            var delay = 500 + (Math.random() * 2000);
            setTimeout(function() {
                findAll();
            }, delay);
        } else {
            console.log("Total Found:");
            console.log(listSize);
            startDownload();
        }
    }

    function startDownload() {
        var i = 0;
        for (const link of linkSet) {
            var delay = (3000 * i) + (Math.random() * 2000);
            setTimeout(function() {
                window.open(link, '_blank');
            }, delay);
            i++;
        }
    }

    var upgradeButtonFrame = document.querySelector('.upgrade_button_frame');
    if (upgradeButtonFrame) {
        var button = document.createElement('button');
        button.textContent = 'DOWNLOAD ALL';
        button.classList.add('Btn', 'Btn--greenUpgrade');
        button.style.backgroundColor = '#33CC66';
        button.style.color = '#222835';
        button.addEventListener('click', findAll);
        upgradeButtonFrame.parentNode.replaceChild(button, upgradeButtonFrame);
    }
})();

(function() {
    'use strict';

    var input = document.querySelector('.download_link .input');
    if (input) {
        var dl = input.getAttribute('href');
        console.log(dl);
        location.replace(dl);

        var set = setInterval(closeWindows, 1000 * 5);

        function closeWindows() {
            window.close();
            clearInterval(set);
        }
    } else {
        console.error('Could not find download link');
    }
})();