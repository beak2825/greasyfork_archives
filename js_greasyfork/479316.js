// ==UserScript==
// @name         Kemono Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Have fun :)
// @license      MIT
// @author       Leimah
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.su
// @match        https://kemono.su/*/post/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/479316/Kemono%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/479316/Kemono%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var zip;
    var metadata;
    var imagesInfo;
    var finishedTasks;
    var label;

    function log(...args) {
        console.log('[Kemono downloader]', args);
    }

    function getAllImagePaths() {
        const images = Array.from(document.querySelectorAll('.post__thumbnail img'))
            .map(_ => _.parentNode)
            .map(_ => _.href);

        return _.uniq(images);
    }

    function getRawFileName(path, index) {
        const url = new URL(path);
        const rawFileName = url.searchParams.get('f') ?? `Image-${index}`;
        return rawFileName;
    }

    function getMetadata() {
        const userName = document.querySelector('.post__user-name').textContent.trim();
        const [title, platform] = Array.from(document.querySelectorAll('.post__title span'))
            .map(_ => _.textContent)
            .map(_ => _.trim())

        return {
            userName,
            title,
            platform,
        }
    }

    function normalizeFileName(path) {
        return path.replace(/\/\\/g, '_');
    }

    function assembleFileName(metadata, path, index) {
        const rawFileName = getRawFileName(path, index);
        const fileName = `[${metadata.userName}]${metadata.platform} ${index} - ${rawFileName}`

        return normalizeFileName(fileName);
    }

    const cache = new Map();

    function fetchFile(fileName, path) {
        if (cache.has(fileName)) {
            log(`File ${fileName} already in cache, will get it from cache`);
            return cache.get(fileName);
        }
        log('prepare to download', { fileName, path })
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: path,
                binary: true,
                responseType: 'blob',
                onerror: e => {
                    log('Failed to download file: ' + path + ' as ' + fileName);
                    log(e);
                    reject(e);
                },
                onload: resp => {
                    // const urlCreator = window.URL || window.webkitURL;
                    log('download finished', resp);
                    cache.set(fileName, resp.response);
                    resolve(resp.response)
                }
            })
        })
    }

    function generateInfo(metadata, images) {
        const obj = {
            metadata,
            images
        }

        return JSON.stringify(obj, undefined, 2);
    }

    function sleep(second = 0.2) {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), second * 1000)
        })
    }

    function getZipName() {
        const {userName, title, platform} = metadata;
        const fileName = `[${userName}]${platform} ${title}.zip`
        return normalizeFileName(fileName);
    }

    function updateButtonText() {
        const allTasks = imagesInfo.length;
        const labelInfo = `Downloading (${finishedTasks}/${allTasks})`;

        label.textContent = labelInfo;
    }

    function addButton() {
        const root = document.querySelector('.post__actions');

        const button = document.createElement('button');
        label = document.createElement('span');
        label.textContent = 'Download';

        button.innerHTML = '<span class="post__download-icon">⬇️</span>';
        button.appendChild(label);

        button.classList.add('post__download', 'post__fav'); // add post__fav for the style
        button.type = 'button';

        finishedTasks = 0;

        button.addEventListener('click', async () => {
            zip.file('info.json', generateInfo(metadata, imagesInfo));

            for (const { fileName, url } of imagesInfo) {
                const resp = await fetchFile(fileName, url);
                zip.file(fileName, resp);
                finishedTasks += 1;
                updateButtonText();
                await sleep();
            }

            log('all file downloaded, will generate zip')

            var urlCreator = window.URL || window.webkitURL;
            const blob = await zip.generateAsync({ type: 'blob' });
            var imageUrl = urlCreator.createObjectURL(blob, { type: 'application/zip' });
            var tag = document.createElement('a');
            tag.href = imageUrl;
            tag.download = getZipName();
            document.body.appendChild(tag);
            tag.click();
            document.body.removeChild(tag);
            log(zip);
        })

        root.appendChild(button);
    }

    function main() {
        log('start');
        const allImages = getAllImagePaths();
        metadata = getMetadata();
        const allImageNames = allImages.map((path, index) => ({
            url: path,
            fileName: assembleFileName(metadata, path, index),
        }));
        zip = new JSZip();

        log({
            allImageNames,
            allImages,
            metadata,
        });

        imagesInfo = allImageNames;

        log(zip);

        addButton();
    }

    main();
})();