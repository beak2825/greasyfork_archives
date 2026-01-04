// ==UserScript==
// @name         download mangarawjp
// @namespace    download-mangarawjp
// homepage      https://greasyfork.org/en/scripts/482893-download-mangarawjp
// @version      0.3.2
// @description  Add download button at mangarawjp.one website.
// @author       JaHIY
// @license      GNU GPLv3
// @match        https://mangarawjp.one/*
// @icon         https://mangarawjp.one/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/@zip.js/zip.js@2.7.32/dist/zip.min.js
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/482893/download%20mangarawjp.user.js
// @updateURL https://update.greasyfork.org/scripts/482893/download%20mangarawjp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createIconElement(iconName) {
        const span = document.createElement('span');
        const i = document.createElement('i');
        i.classList.add('fa', `fa-${iconName}`);
        i.ariaHidden = 'true';
        span.classList.add('icon', 'is-size-6');
        span.append(i);
        return span;
    }

    function createDownloadElement(pageLink, name) {
        const btn = document.createElement('button');
        const downloadIcon = createIconElement('download');
        downloadIcon.dataset.pageLink = pageLink;
        downloadIcon.dataset.name = name;
        downloadIcon.classList.add('download-manga');
        btn.type = 'button';
        btn.classList.add('button', 'is-small');
        btn.append(downloadIcon);
        return btn;
    }

    class DownloadMethodABC {
        #doc;
        static selector = '';
        constructor(doc) {
            this.#doc = doc;
        }
        get doc() {
            return this.#doc;
        }
        get selector() {
            return this.constructor.selector;
        }
        static test(doc) {
            return doc.querySelectorAll(this.selector).length > 0;
        }
        test() {
            return this.constructor.test(this.doc);
        }
        async downloadSingleImage(imageURL) {
            const resp = await GM.xmlHttpRequest({
                url: imageURL,
                headers: {
                    referer: this.doc.URL,
                },
                responseType: 'blob',
            });

            if (resp.status !== 200) {
                throw new Error(`Cannot download the image from ${imageURL}`);
            }

            const blob = resp.response;

            if (!blob.type.startsWith('image/')) {
                throw new Error(`The image from ${imageURL} is not a valid image: ${blob.type}`);
            }

            return blob;
        }
        getImageURLs() {
            return [];
        }
        async downloadImages() {
            const images = await Promise.all(this.getImageURLs().map(this.downloadSingleImage, this));
            return images;
        }
    }

    class DownloadMethodV1 extends DownloadMethodABC {
        static selector = '.container-chapter-reader .card-wrap img';
        getImageURLs() {
            const targetElements = Array.from(this.doc.querySelectorAll(this.selector));
            return targetElements.map(el => el.dataset.src);
        }
    }

    class DownloadMethodV2 extends DownloadMethodABC {
        static selector = '.container-chapter-reader .card-wrap .chapter-lazy';
        static key = 'F2pGsgyJNT7bZmMk';
        #baseURL;
        #config;
        #imageOrder;
        constructor(doc) {
            super(doc);
        }
        get key() {
            return this.constructor.key;
        }
        get config() {
            if (!this.#config) {
                const configStr = this.doc.querySelector('.container > script')
                                    .textContent.match(/^window.__M_CONFIG=(\{.*\})$/)[1];
                this.#config = JSON.parse(configStr.replaceAll(/(\w+):\s*("[^"]*"|true|false)/g, '"$1":$2'));
            }
            return this.#config;
        }
        static decrypt(key, encryptedStr) {
            const keyNum = key.split('').map(ch => ch.charCodeAt(0)).reduce((acc, v) => acc ^ v);
            return splitByNum(encryptedStr, 2)
                .map(hexStr => parseInt(hexStr, 16))
                .map(num => keyNum ^ num)
                .map(ch => String.fromCharCode(ch))
                .join('');
        }
        static getImageOrder(key, id) {
            const s = this.decrypt(key, id);
            const magicNumber = 11;
            return splitByNum(s, 2).map(decStr => parseInt(decStr) - magicNumber);
        }
        get imageOrder() {
            if (!this.#imageOrder) {
                this.#imageOrder = this.constructor.getImageOrder(this.key, this.config.id);
                console.log(this.#imageOrder);
            }
            return this.#imageOrder;
        }
        get baseURL() {
            if (!this.#baseURL) {
                this.#baseURL = this.constructor.decrypt(this.config.domain, this.config.c);
                console.log(this.#baseURL);
            }
            return this.#baseURL;
        }
        getImageURLs() {
            const targetElements = Array.from(this.doc.querySelectorAll(this.selector));
            return targetElements.map(el => `${this.baseURL}${el.dataset.z}`);
        }
        async decryptSingleImage(encryptedImageBlob) {
            const image = await loadImage(encryptedImageBlob);
            const width = image.naturalWidth;
            const height = image.naturalHeight;

            const cellWidth = width / 4;
            const cellHeight = height / 4;

            const canvas = document.createElement("canvas");
            [canvas.width, canvas.height] = [width, height];
            const ctx = canvas.getContext("2d");

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    const imageOrder = this.imageOrder[i + j*4];
                    const oldI = imageOrder % 4;
                    const oldJ = Math.floor(imageOrder / 4);
                    const sourceX = oldI * cellWidth;
                    const sourceY = oldJ * cellHeight;
                    const targetX = i * cellWidth;
                    const targetY = j * cellHeight;
                    ctx.drawImage(image, sourceX, sourceY, cellWidth, cellHeight, targetX, targetY, cellWidth, cellHeight);
                }
            }

            const decryptedImageBlob = await canvasToBlob(canvas);
            return decryptedImageBlob;
        }
        async decryptImages(imageBlobs) {
            return await Promise.all(imageBlobs.map(this.decryptSingleImage, this));
        }
        async downloadImages() {
            const decryptedImageBlobs = await Promise.all(this.getImageURLs().map(async (imageURL, i) => {
                const encryptedImageBlob = await this.downloadSingleImage(imageURL);
                console.log(`Downloaded image ${i}`)
                const decryptedImageBlob = await this.decryptSingleImage(encryptedImageBlob);
                console.log(`Decrypted image ${i}`)
                return decryptedImageBlob;
            }, this));
            return decryptedImageBlobs;
        }
    }

    function splitByNum(str, n) {
        const re = new RegExp(`.{1,${n}}`, 'g');
        return str.match(re) || [];
    }

    function first(arr, fn) {
        for (const i of arr) {
            if (fn(i, arr)) {
                return i;
            }
        }
        return null;
    }

    async function downloadImages(pageLink) {
        const parser = new DOMParser();
        const resp = await GM.xmlHttpRequest({
            url: pageLink,
            headers: {
                referer: pageLink,
            },
        });

        if (resp.status !== 200) {
            throw new Error(`Cannot download the page from ${pageLink}`);
        }

        const text = resp.responseText;

        const doc = parser.parseFromString(text, 'text/html');

        const methods = [DownloadMethodV1, DownloadMethodV2];
        const method = first(methods, m => m.test(doc));

        if (!method) {
            throw new Error('Cannot find available method to download images!');
        }

        const m = new method(doc);
        const imageBlobs = await m.downloadImages();

        return imageBlobs;
    }

    async function loadImage(blob) {
        const blobURL = URL.createObjectURL(blob);
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', (err) => reject(err));
            image.crossorigin = "anonymous";
            image.src = blobURL;
        }).then(image => {
            URL.revokeObjectURL(blobURL);
            return image;
        });
    }

    async function canvasToBlob(canvas) {
        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), 'image/jpeg', 1);
        })
    }

    async function downloadManga(el) {
        const clickedElement = el.target.parentNode;
        if (clickedElement
            && clickedElement.matches('.download-manga')
            && clickedElement.dataset.pageLink) {
            console.log(clickedElement);

            const pageLink = clickedElement.dataset.pageLink;
            const name = clickedElement.dataset.name;

            const imageBlobs = await downloadImages(pageLink);

            const blobWriter = new zip.BlobWriter("application/zip");
            const zipWriter = new zip.ZipWriter(blobWriter);
            const targetLength = imageBlobs.length.toString().length;
            await Promise.all(Array.from(imageBlobs.entries()).map(async ([i, blob]) => {
                console.log(i, blob);
                const filename = `${i.toString().padStart(targetLength,'0')}.jpg`;
                await zipWriter.add(filename, new zip.BlobReader(blob));
            }));
            const zipFile = await zipWriter.close();
            const blobURL = URL.createObjectURL(zipFile);

            const anchor = document.createElement("a");
            anchor.download = `${name}.zip`;
            console.log(anchor.download);
            anchor.href = blobURL;
            document.body.appendChild(anchor);
            anchor.click();
            document.body.removeChild(anchor);
            URL.revokeObjectURL(blobURL);
        }
    }

    function addClickButton(el) {
        const anchor =el.querySelector('a.text-info');
        const pageLink = anchor.href;
        const name = anchor.title.replaceAll(/[\\\/:*?"<>|]/g, " ").trim();
        const downloadElement = createDownloadElement(pageLink, name);
        el.append(downloadElement);
        return el;
    }

    document.querySelectorAll('.list-scoll th').forEach(addClickButton);
    document.querySelector('.list-scoll').addEventListener('click', downloadManga);
})();

