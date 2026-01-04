// ==UserScript==
// @name         MediaFire Batch Downloader
// @namespace    http://tampermonkey.net/
// @include     http://www.mediafire.com/folder/*
// @include     https://www.mediafire.com/folder/*
// @include     http://www.mediafire.com/file/*
// @include     https://www.mediafire.com/file/*
// @version      0.1
// @description  Batch download files from a MediaFire folder
// @author       ShadowLin
// @license      GNU GPL v3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498949/MediaFire%20Batch%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/498949/MediaFire%20Batch%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function startDownload() {
        var listItems = document.querySelectorAll('#main_list > li');
        for (var i = 0; i < listItems.length; i++) {
            var link = listItems[i].querySelector('a');
            if (link) {
                window.open(link.href, '_blank');
            }
        }
    }

    var upgradeButtonFrame = document.querySelector('.upgrade_button_frame');
    if (upgradeButtonFrame) {
        var button = document.createElement('button');
        button.textContent = 'DOWNLOAD ALL';
        button.classList.add('Btn', 'Btn--greenUpgrade');
        button.style.backgroundColor = '#33CC66';
        button.style.color = '#222835';
        button.addEventListener('click', startDownload);
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