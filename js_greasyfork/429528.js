// ==UserScript==
// @name         Open/save images with RMB without prompt on Gelbooru/Danbooru/etc
// @namespace    https://github.com/Amasoken/scripts
// @version      0.25
// @description  interact with images using RMB and modifier keys
// @author       Amasoken
// @match        http*://*/*
// @grant        GM_download
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446396/Opensave%20images%20with%20RMB%20without%20prompt%20on%20GelbooruDanbooruetc.user.js
// @updateURL https://update.greasyfork.org/scripts/446396/Opensave%20images%20with%20RMB%20without%20prompt%20on%20GelbooruDanbooruetc.meta.js
// ==/UserScript==

/*
INFO:

Interact with images using RMB (Right Mouse Button) and modifier keys.
Basically a shortcut to save images without 'Save as' window, or preview images fast.
Created to save time while browsing gelbooru, deviantart, sankakucomplex, etc. since I got tired of waiting for 'Save as' window forever on my potato laptop.

Use cases:
- Open a bunch of images in separate tabs without doing 'Right click > Open in a new tab' routine
- View every image separately, save them faster without 'Save as' window or just close the tab
- Preview image in a new window, admire the image then save it or just close the window

Controls (when clicking on the image):
  alt + RMB: Download an image without prompt. If the image url is cross-origin AND no extension specified in the url, new tab will open instead. Example -- images in steam hub.
 ctrl + RMB: Open an image in a new tab (not focused).
shift + RMB: Open an image in a new window (focused).

On the opened image tab (when clicking on the image):
  alt + RMB: Download an image without prompt, then close the tab (won't close if opened by entering direct link in the address bar, since script can only close tabs when they were opened by script/context menu).
 ctrl + RMB: Close the tab.
shift + RMB: Close the tab.
*/

(function () {
    'use strict';

    const DEFAULT_DOWNLOAD_NAME = 'download';
    const AVAILABLE_EXTENSIONS = ['gif', 'ico', 'jpeg', 'jpg', 'png', 'webp'];

    const isTargetImage = (e) => e.target.tagName === 'IMG' && e.target.src;
    const isImageOnlyPage = Boolean(document.body) && document.querySelector('body img') === document.body.lastChild;

    document.addEventListener(
        'contextmenu',
        (e) => {
            const { ctrlKey, altKey, shiftKey } = e;

            if (ctrlKey + altKey + shiftKey) {
                let imageElement = isTargetImage(e) ? e.target : e.target.querySelector('img');
                if (imageElement) {
                    e.preventDefault();
                    handleImageClick(e, imageElement);
                    return false;
                }
            }
        },
        false
    );

    function handleImageClick(e, imageElement = e.target) {
        const { ctrlKey, altKey, shiftKey } = e;
        const isSingleKeyPressed = ctrlKey + altKey + shiftKey === 1;
        if (!isSingleKeyPressed) return;

        // ctrl + RMB click
        if (ctrlKey) {
            e.stopPropagation();
            if (isImageOnlyPage) {
                closeWindow();
            } else {
                openInNewTab(imageElement.src);
            }
        }

        // alt + RMB click
        if (altKey) {
            const shouldCloseTab = isImageOnlyPage;
            e.stopPropagation();
            saveImage(imageElement.src, shouldCloseTab);
        }

        // shift + RMB click
        if (isSingleKeyPressed && shiftKey) {
            e.stopPropagation();
            !isImageOnlyPage && openInNewWindow(imageElement.src);
            isImageOnlyPage && closeWindow();
        }
    }

    function openInNewTab(imageUrl) {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.target = '_blank';
        link.rel = 'noreferrer noopener';
        link.click();
    }

    function openInNewWindow(imageUrl) {
        window.open(imageUrl, '_blank');
    }

    function closeWindow() {
        const closeButton = document.createElement('button');
        closeButton.onclick = () => window.close();

        closeButton.click();
    }

    function getNameAndExtensionFromUrl(url) {
        const urlSplit = url.split('/');
        let fileName = urlSplit[urlSplit.length - 1]; // last path part is probably the file name
        fileName = fileName.split('?')[0]; // drop query params if present
        fileName = decodeURI(fileName); // handle encoded url

        let ext = '',
            name = fileName || DEFAULT_DOWNLOAD_NAME;

        const splitFileName = fileName.split('.');

        // set extension if present
        if (splitFileName.length > 1) {
            ext = splitFileName.pop();
            name = splitFileName.join('.');
        }

        // check if extension is correct and not just a part of file name, like in 'file.name'
        if (ext && !AVAILABLE_EXTENSIONS.includes(ext)) {
            name += `.${ext}`;
            ext = '';
        }

        return [name, ext];
    }

    function getFileName(url) {
        const [name, ext] = getNameAndExtensionFromUrl(url);

        if (ext && AVAILABLE_EXTENSIONS.includes(ext)) {
            return `${name}.${ext}`;
        }

        return name;
    }

    function saveImageWithA(url, name) {
        const a = document.createElement('a');
        a.href = url;
        a.download = name;

        a.click();
    }

    function isSameOrigin(link1, link2) {
        const URL1 = new URL(link1);
        const URL2 = new URL(link2);

        return URL1.origin === URL2.origin;
    }

    function saveImage(url, shouldCloseTab) {
        const fileName = getFileName(url);

        // for same origin download with A tag since it's faster than waiting for onload
        if (isSameOrigin(window.location.href, url)) {
            saveImageWithA(url, fileName);
            if (shouldCloseTab) closeWindow();
        } else {
            GM_download({
                url,
                name: fileName,
                onload: () => shouldCloseTab && closeWindow(),
                onerror: (error) => {
                    console.log('GM_download error: ', error);

                    if (error.error === 'not_whitelisted') {
                        // possibly webp
                        saveImageWithA(url, fileName);
                        if (shouldCloseTab) closeWindow();
                    }
                },
            });
        }
    }
})();
