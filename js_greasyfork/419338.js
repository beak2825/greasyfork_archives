// ==UserScript==
// @name         1CEduVideoDownloader
// @description  Allows for easy video downloads from 1C-Edu web-portal
// @version      1.0
// @author       o4zloioroman
// @match        https://dist.edu.1c.ru/library.html*
// @namespace https://greasyfork.org/users/722089
// @downloadURL https://update.greasyfork.org/scripts/419338/1CEduVideoDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/419338/1CEduVideoDownloader.meta.js
// ==/UserScript==

/* globals $ */

(function() {
    'use strict';

    $(window).on('load', () => {
        const findAndAppend = function() {
            var endPath = $('iframe.gwt-Frame.x-component').contents().find('video').attr('src') || $('iframe.gwt-Frame.x-component').contents().find('video').find('source').attr('src');
            if(!endPath) return;

            const downloadIconUrl = 'https://www.iconarchive.com/download/i103415/paomedia/small-n-flat/floppy.ico';

            function OnDownloadButtonClickHandler(e) {

                const downloadLink = window.location.origin + endPath;

                const lessonName = $('.toolbarAsHeaderForDlrList.x-component').text();
                const filename = lessonName + '.mp4';

                let a = document.createElement("a");
                a.href = downloadLink;
                a.setAttribute('download', filename);
                a.click();
            }

            const toolbar = $('button:contains("Действия")').parents('tr.x-toolbar-right-row');
            const downloadTr = toolbar.children().eq(1).clone();
            const downloadButton = downloadTr.find('button');
            const icon = downloadButton.find('img');

            icon.attr('src', downloadIconUrl);
            icon.css('background', '');
            downloadButton.on('click', OnDownloadButtonClickHandler);

            toolbar.prepend(downloadTr);
        };

        const waitForTableOfContents = setInterval(function() {
            if ($('span:contains("Оглавление учебника")').length) {

                const videoIconCss = 'rgba(0, 0, 0, 0) url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABEklEQVR42qVRu4oCQRDcb5CbMT9OA9MLNbiZVr9CBL9C/IXpVe4QDsQfMDE3MVI0FwzN9WJz7epdsz0Y3YVe+lFV1HQnSdnPeN4aH04vheMNBHbWh64UI8lv1oW+JW4XhsyAAVY5FPaJIf5RJ51QwzDC8Q1YzcG1no/SHIqlebRAhh2Ci8ZVYinNwxMCh4zD1+TN8y8GFUobsQLAIleucelCB+20hWG1y/Y/sqXvar7opnLAzSy9HtjkynxNPuRMPW2KE0uT96J4uFSscMCFg6m+h8b12B0Am+dT+YWzpTCTk6xjBYAFR/KLCsg2WZ8Se0bBKicTKPsEqLn0U4qBntGNCXVRYJZvf6CcfIl/Jc54uQOfd/loLfNp0wAAAABJRU5ErkJggg==") no-repeat scroll 0px 0px / auto padding-box border-box';

                const nodes = $('.x-tree3-node:has(".x-tree3-el")');
                $.each(nodes, (i, val) => {
                    let bg = $(val).find('img.x-tree3-node-icon').css('background');
                    if($(val).find('img.x-tree3-node-icon').css('background') != videoIconCss) return;

                    $(val).on('click', iframeFunction);
                });

                clearInterval(waitForTableOfContents);
            }
        }, 100);

        // wait for video iframe
        const iframeFunction = function() {
            const waitForIframe = setInterval(function() {
                if ($('iframe.gwt-Frame.x-component').contents().find('video').length) {
                    findAndAppend();
                    clearInterval(waitForIframe);
                }
            }, 100);
        };

        iframeFunction();
    });
})();