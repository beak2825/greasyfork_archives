// ==UserScript==
// @name         Kone gg Gallery Viewer
// @description  코네용 갤러리 뷰어
// @namespace    http://tampermonkey.net/
// @version      2.3
// @author       Mowa
// @match        https://kone.gg/s/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537176/Kone%20gg%20Gallery%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/537176/Kone%20gg%20Gallery%20Viewer.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    // Singleton
    class Kgv {
        // static createImageFromArrayBuffer(arrayBuffer) {
        //     // ArrayBuffer를 Uint8Array로 변환
        //     const uint8Array = new Uint8Array(arrayBuffer);
            
        //     // Base64로 인코딩
        //     const base64String = btoa(String.fromCharCode(...uint8Array));
            
        //     // Data URL 생성
        //     const dataUrl = `data:image/jpeg;base64,${base64String}`;
            
        //     // img element 생성
        //     const img = document.createElement('img');
        //     img.src = dataUrl;
            
        //     return img;
        // }

        // static arrayBufferToString(arrayBuffer) {
        //     // ArrayBuffer를 Uint8Array로 변환
        //     const uint8Array = new Uint8Array(arrayBuffer);
            
        //     // 문자열로 변환
        //     let str = '';
        //     for (let i = 0; i < uint8Array.length; i++) {
        //         str += String.fromCharCode(uint8Array[i]);
        //     }
        //     return str;
        // }
    
        // static async getCanvasImage (imgSrc, maxSize = 200) {
        //     return new Promise((resolve, reject) => {
        //         GM_xmlhttpRequest({
        //             method: 'GET',
        //             url: imgSrc,
        //             responseType: 'arraybuffer',
        //             // headers: {
        //             //     'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        //             //     'Accept-Encoding': 'gzip, deflate, br',
        //             //     'Accept-Language': navigator.language || navigator.userLanguage,
        //             //     'Cookie': document.cookie,
        //             //     'Host': window.location.host,
        //             //     'Referer': window.location.href,
        //             //     'User-Agent': navigator.userAgent,
        //             // },
        //             onload: (response) => {
        //                 console.log(response.response);
        //                 console.log(Kgv.arrayBufferToString(response.response));
        //                 const imgElement = Kgv.createImageFromArrayBuffer(response.response)
        //                 imgElement.onload = () => {
        //                     const canvas = document.createElement('canvas');
        //                     const ctx = canvas.getContext('2d');
        //                     const originalWidth = imgElement.naturalWidth || imgElement.width;
        //                     const originalHeight = imgElement.naturalHeight || imgElement.height;
        //                     const ratio = Math.min(maxSize / originalWidth, maxSize / originalHeight);
        //                     const newWidth = Math.round(originalWidth * ratio);
        //                     const newHeight = Math.round(originalHeight * ratio);
        //                     canvas.width = newWidth;
        //                     canvas.height = newHeight;
        //                     ctx.imageSmoothingEnabled = true;
        //                     ctx.imageSmoothingQuality = 'high';
        //                     ctx.drawImage(imgElement, 0, 0, newWidth, newHeight);
        //                     resolve(canvas);
        //                 };
        //                 imgElement.onerror = (e) => {
        //                     console.error('Error XHR loading image:', e);
        //                     reject(e);
        //                 };
        //                 document.body.appendChild(imgElement); // Append to body to avoid CORS issues
        //             },
        //             onerror: (e) => {
        //                 console.error('Error XHR fetching image:', e);
        //                 reject(e);
        //             }
        //         })
        //     });
        // }

        // static async resizeImageToBase64 (imgSrc, maxSize = 200, outputFormat = 'image/jpeg', quality = 0.8) {
        //     const canvas = await Kgv.getCanvasImage(imgSrc, maxSize);
        //     return canvas.toDataURL(outputFormat, quality);
        // }

        // static async getLargeImageData (imgSrc, maxSize = 200) {
        //     const canvas = await Kgv.getCanvasImage(imgSrc, maxSize);
        //     return [canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height];
        // }

        // static async calculateImageDiffHash (imgSrc, hashSize = 16) {
        //     const getBrightness = (imageData, width, x, y) => {
        //         const idx = (y * width + x) * 4;
        //         return (imageData[idx] + imageData[idx + 1] + imageData[idx + 2]) / 3; // Average RGB
        //     }
            
        //     const [imageData, width, height] = await Kgv.getLargeImageData(imgSrc, hashSize);
        //     let hash = new Array(hashSize*hashSize).fill(0).join('');
        //     for (let y = 0; y < height; y += 1) {
        //         for (let x = 0; x < width-1; x += 1) {
        //             hash[y * hashSize + x] = Math.floor(
        //                 (
        //                     (getBrightness(imageData, width, x, y) - getBrightness(imageData, width, x + 1, y))
        //                     + 256
        //                 ) / 512 * 10
        //             );
        //         }
        //     }
        //     return hash;
        // }

        // static diffHashHammingDistanceNormal(hash1, hash2) {
        //     const min = Math.min(hash1.length, hash2.length);
        //     let distance = 0;
        //     for (let i = 0; i < min; i++) {
        //         if (hash1[i] !== hash2[i]) {
        //             distance++;
        //         }
        //     }
        //     return distance / min;
        // }

        // static async calculateImageHistogram (imgSrc, hashSize = 16) {
        //     const [imageData, width, height] = await Kgv.getLargeImageData(imgSrc, hashSize);

        //     const histogram = { r: new Array(256).fill(0), g: new Array(256).fill(0), b: new Array(256).fill(0) };
            
        //     for (let i = 0; i < imageData.length; i += 4) {
        //         histogram.r[imageData[i]]++;
        //         histogram.g[imageData[i + 1]]++;
        //         histogram.b[imageData[i + 2]]++;
        //     }
            
        //     return histogram;
        // }

        // static histogramToString (histogram) {
        //     const combined = [...histogram.r, ...histogram.g, ...histogram.b];
        //     const uint16Array = new Uint16Array(combined);
        //     const bytes = new Uint8Array(uint16Array.buffer);
        //     let binary = '';
        //     for (let i = 0; i < bytes.length; i++) {
        //         binary += String.fromCharCode(bytes[i]);
        //     }
        //     return btoa(binary);
        // }

        // static stringToHistogram (str) {
        //     // Base64 디코딩
        //     const binary = atob(str);
        //     const bytes = new Uint8Array(binary.length);
        //     for (let i = 0; i < binary.length; i++) {
        //         bytes[i] = binary.charCodeAt(i);
        //     }
        //     const uint16Array = new Uint16Array(bytes.buffer);
        //     const combined = Array.from(uint16Array);
            
        //     return {
        //         r: combined.slice(0, 256),
        //         g: combined.slice(256, 512),
        //         b: combined.slice(512, 768)
        //     };
        // }

        // static compareHistogram (hist1, hist2) {
        //     let correlation = 0;
        //     const channels = ['r', 'g', 'b'];
            
        //     for (const channel of channels) {
        //         let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0;
                
        //         for (let i = 0; i < 256; i++) {
        //             sum1 += hist1[channel][i];
        //             sum2 += hist2[channel][i];
        //             sum1Sq += hist1[channel][i] * hist1[channel][i];
        //             sum2Sq += hist2[channel][i] * hist2[channel][i];
        //             pSum += hist1[channel][i] * hist2[channel][i];
        //         }
                
        //         const num = pSum - (sum1 * sum2 / 256);
        //         const den = Math.sqrt((sum1Sq - sum1 * sum1 / 256) * (sum2Sq - sum2 * sum2 / 256));
                
        //         if (den === 0) continue;
        //         correlation += num / den;
        //     }
            
        //     return correlation / 3;
        // }

        // Credit: https://greasyfork.org/en/scripts/536425-kone-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EB%8C%93%EA%B8%80-%EA%B0%9C%EC%84%A0
        static async handleModalsInIframeKone(doc) {
            try {
                const nsfwOverlayContainer = doc.querySelector('div.relative.min-h-60 > div.absolute.w-full.h-full.backdrop-blur-2xl');
                if (nsfwOverlayContainer && nsfwOverlayContainer.offsetParent !== null) {
                    const viewContentButton = nsfwOverlayContainer.querySelector('div.flex.gap-4 button:nth-child(2)');
                    if (viewContentButton && viewContentButton.textContent?.includes('콘텐츠 보기')) {
                        viewContentButton.click();
                        await new Promise(resolve => setTimeout(resolve, 500));
                    } else {
                        Kgv.hideElementInIframe(doc, '.age-verification-popup');
                        Kgv.hideElementInIframe(doc, '.content-overlay.block');
                    }
                } else {
                    Kgv.hideElementInIframe(doc, '.age-verification-popup');
                    Kgv.hideElementInIframe(doc, '.content-overlay.block');
                }
            } catch (e) { }
        }

        // Credit: https://greasyfork.org/en/scripts/536425-kone-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EB%8C%93%EA%B8%80-%EA%B0%9C%EC%84%A0
        static hideElementInIframe(doc, selector) {
            try {
                const elements = doc.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.offsetParent !== null) {
                        el.style.setProperty('display', 'none', 'important');
                    }
                });
            } catch (e) { }
        }

        // Credit: https://greasyfork.org/en/scripts/536425-kone-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EB%8C%93%EA%B8%80-%EA%B0%9C%EC%84%A0
        static extractImagesFromIframeDocument(doc) {
            const proseContainer = doc.querySelector('div.prose-container');
            if (!proseContainer || !proseContainer.shadowRoot) {
                return [];
            }
            const contentInShadow = proseContainer.shadowRoot.querySelector('div.dark');
            if (!contentInShadow) {
                return [];
            }
            return [...contentInShadow.querySelectorAll('img')]
                .filter(img => (
                    img.src && !/kone-logo|default|placeholder|data:image/.test(img.src)
                ));
        }

        static relativeUrlToAbsolute (relativeUrl) {
            if (!relativeUrl) return '';
            try {
                const baseUrl = window.location.origin + window.location.pathname;
                return new URL(relativeUrl, baseUrl).href;
            } catch (e) {
                console.error('Invalid relative URL:', relativeUrl, e);
                return '';
            }
        }

        static filterOnlyPathUrl (url) {
            if (!url) return '';
            try {
                const parsedUrl = new URL(url);
                return parsedUrl.pathname;
            } catch (e) {
                console.error('Invalid URL:', url, e);
                return '';
            }
        }

        static kgvCSS = /* css */ `
    
        .kgv-list {
            width: 100%;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
            align-content: flex-start;
            gap: 0.2em;
        }
        
        .kgv-gallery {
            display: inline-block;
            width: 10.5em;
        }

        .kgv-gallery-good {
            color: var(--color-red-400);
        }

        .kgv-gallery-bad {
            color: #444;
        }
        
        .kgv-gallery-preview {
            display: flex;
            justify-content: center;
            align-items: center;

            width: 10.5em;
            height: 10.5em;
            overflow: hidden;

            background-color: #777;
            border-radius: 5px;
        }

        .kgv-gallery-preview img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }

        .kgv-gallery-bad .kgv-gallery-preview > * {
            filter: grayscale(100%) blur(10px);
        }

        .kgv-gallery-preview video {
            object-fit: contain;
            width: 100%;
            height: 100%;

            display: flex;
            flex-direction: column;
        }
        
        .kgv-gallery-info {
            width: auto;
            padding: 5px 0 0 0;

            font-size: 0.8rem;
            line-height: 1.1;
        }

        .kgv-gallery-info-1 {
            display: block;
        }

        .kgv-gallery-info-2 {
            display: flex;
            flex-direction: row;
            gap: 0.2em;
        }

        .kgv-gallery-info-3 {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.2em;
            margin-top: 0.2em;

            color: #777;
        }

        .kgv-gallery-info-2 svg, .kgv-gallery-info-3 svg {
            display: inline-block !important;
        }

        .kgv-gallery-info-3 > * {
            margin: 0 !important;
            padding: 0 !important;
        }
        
        .kgv-title {
            display: inline;

            font-weight: bold;
            line-height: 1.2;
        }

        .kgv-comment {
            display: inline;

            color: #777;
        }

        .kgv-author {
            height: 0.8rem;
            overflow: hidden;
        }

        .kgv-view {
            color: #777;
        }

        .kgv-vote {
            color: #777;
        }

        .kgv-time {
            color: #777;
        }

        .kgv-gallery-bad .kgv-vote {
            color: #f00;
        }

        .kgv-block {
            display: none;
        }

        .kgv-gallery-bad .kgv-block {
            display: inline-block;

            color: #f00;
        }

        .kgv-menu {
            display: flex;
            flex-direction: row;
            gap: 0.5em;

            flex: 0 0 auto;
        }

        .kgv-menu-container {
            box-sizing: border-box;
            boder: 0 solid;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: row;

            border: 1px solid #777;
            border-radius: 5px;
        }

        .kgv-menu-container > .kgv-menu-container-btn {
            flex: 1;

            padding: 0.4em 0.2em;

            border-left: 1px solid #777;

            cursor: pointer;
            text-align: center;
            font-size: 0.7em;
        }

        .kgv-menu-container > .kgv-menu-container-btn:first-child {
            border-left: none;
        }

        .kgv-menu-container > .kgv-menu-container-btn.active {
            background-color: #007bff;

            color: #fff;
        }

        .kgv-menu-btn {
            padding: 0.4em 0.2em;

            border: 1px solid #777;
            border-radius: 5px;

            cursor: pointer;
            font-size: 0.7em;
        }

        .kgv-mibang-handle {
            border: 5px solid #007bff !important;
            cursor: pointer;
        }
        `;

        // Instance start

        static key = 'mowkgv'
        static keyCacheImgUrls = `${Kgv.key}_cacheImgUrls`;
        static keyMibang = `${Kgv.key}_mibang`;
        static instance = null;
        static defaultConfig = {
            viewerType: 1, // 0: default(List), 1: Gallery
            maxCacheImgUrls: 100000,
        };
        static qMain = 'main > div.mx-auto > div.mx-auto > div.flex > div.flex';
        static qSubTitle =  'main > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)';
        static qSubMenu = 'main .py-2 .p-3:nth-child(1)';
        static qSubMenuBtns = 'main .py-2 .p-3:nth-child(1) > .items-center';
        static qSubMenuSearch = 'main .py-2 .p-3:nth-child(2)';
        static qSubCategory = 'main div[dir=ltr]';
        static qSubMain = 'div.h-full.flex-col';
        static qSubMainListContainer = 'div.h-full.flex-col > div.grow.flex-col > div.grow';
        static qSubMainList = 'div.h-full.flex-col > div.grow.flex-col > div.grow > div.w-full';
        static async getInstance () { return Kgv.instance || (Kgv.instance = await Object.create(Kgv.prototype)).init(); }
        constructor () { throw new Error(); }

        listeners = {};
        config = {};
        cacheImgUrls = new Map();
        mibang = [];
        previewIframe = null;
        queuePreviewImgUrls = [];
        queueTimeoutUid = null;
        galleryViewListElement = null;
        originListMutationObserver = null;
        popupMibang = null;

        async init () {
            // Due to Object.create
            this.listeners = {};
            this.config = {};
            this.cacheImgUrls = new Map();
            this.mibang = [];
            if (this.previewIframe) {
                this.previewIframe.remove();
            }
            this.previewIframe = null;
            this.queuePreviewImgUrls = [];
            this.queueTimeoutUid = null;
            this.galleryViewListElement = null;
            this.originListMutationObserver = null;
            this.popupMibang = null;

            this.loadAllConfig();
            // this.loadAllMibang();
            this.loadCacheImgUrls();
            GM_addStyle(Kgv.kgvCSS);
            return this;
        }

        addEventListener(type, listener, once = false) {
            if (!this.listeners[type]) {
                this.listeners[type] = [];
            }
            if (once) {
                const wrappedListener = (...args) => {
                    listener.apply(this, args);
                    this.removeEventListener(type, wrappedListener);
                };
                this.listeners[type].push(wrappedListener);
            } else {
                this.listeners[type].push(listener);
            }
        }
        
        removeEventListener(type, listener) {
            if (!this.listeners[type]) return;
            const index = this.listeners[type].indexOf(listener);
            if (index > -1) {
                this.listeners[type].splice(index, 1);
            }
        }
        
        dispatchEvent(event) {
            if (!this.listeners[event.type]) return true;
            this.listeners[event.type].forEach(listener => {
                listener.call(this, event);
            });
            return true;
        }

        loadAllConfig () { for (const [key, value] of Object.entries(Kgv.defaultConfig)) this.config[key] = GM_getValue(`${Kgv.key}_${key}`, value); }
        saveConfig (key, value) { GM_setValue(`${Kgv.key}_${key}`, this.config[key] = value); }

        ensureCacheImgUrls () {
            if (!this.cacheImgUrls) this.loadCacheImgUrls();
            if (this.cacheImgUrls.size > this.config.maxCacheImgUrls) {
                console.warn(`Cache size exceeded limit (${this.config.maxCacheImgUrls}), trimming cache.`);
            }
            while (this.cacheImgUrls.size > this.config.maxCacheImgUrls) {
                this.cacheImgUrls.delete(this.cacheImgUrls.keys().next().value);
            }
        }

        loadCacheImgUrls() {
            try {
                this.cacheImgUrls = new Map(JSON.parse(localStorage.getItem(Kgv.keyCacheImgUrls) || '[]'));
            } catch (e) {
                console.error('Failed to parse cacheImgUrls:', e);
                this.cacheImgUrls = new Map();
            }
        }

        saveCacheImgUrls() {
            if (!this.cacheImgUrls) return;
            try {
                localStorage.setItem(Kgv.keyCacheImgUrls, JSON.stringify([...this.cacheImgUrls.entries()]));
            } catch (e) {
                if (e instanceof DOMException && e.name === 'QuotaExceededError') {
                    if (this.config.maxCacheImgUrls > 100) {
                        let nextLimit = Math.floor(this.cacheImgUrls.size * 0.9);
                        if (nextLimit < 100) nextLimit = 100;
                        this.saveConfig('maxCacheImgUrls', nextLimit);
                        return this.saveCacheImgUrls();
                    }
                }
                console.error('Failed to save cacheImgUrls:', e);
            }
        }

        // null: no image, undefined: not cached
        getCacheImgUrl (url) {
            if (!url) return undefined;
            return this.cacheImgUrls.get(Kgv.filterOnlyPathUrl(url));
        }

        // loadAllMibang () {
        //     try {
        //         this.mibang = JSON.parse(localStorage.getItem(Kgv.keyMibang) || '[]');
        //     } catch (e) {
        //         console.error('Failed to parse mibang:', e);
        //         this.mibang = [];
        //     }
        // }

        // saveAllMibang () {
        //     if (!this.mibang) return;
        //     try {
        //         localStorage.setItem(Kgv.keyMibang, JSON.stringify(this.mibang));
        //     } catch (e) {
        //         console.error('Failed to save mibang:', e);
        //     }
        // }

        // saveMibang(imgSrc) {
        //     const previewBase64 = Kgv.resizeImageToBase64(imgSrc);
        //     const diffHash = Kgv.calculateImageDiffHash(imgSrc);
        //     const histogram = Kgv.histogramToString(Kgv.calculateImageHistogram(imgSrc));
            
        //     this.mibang.push({
        //         previewBase64,
        //         diffHash,
        //         histogram,
        //     });
        //     this.saveAllMibang();
        // }

        // checkIsMibang (imgSrc) {
        //     if (!this.mibang || this.mibang.length === 0) {
        //         return false;
        //     }
        //     const diffHash = Kgv.calculateImageDiffHash(imgSrc);
        //     const histogram = Kgv.calculateImageHistogram(imgSrc);
        //     for (const item of this.mibang) {
        //         if (Kgv.diffHashHammingDistanceNormal(item.diffHash, diffHash) < 0.1 &&
        //             Kgv.compareHistogram(Kgv.stringToHistogram(item.histogram), histogram) > 0.9) {
        //             return true;
        //         }
        //     }
        // }

        buildMenu () {
            const menuLoop = (max_retries = 20, delay = 100) => {
                const subMenuBtns = document.querySelector(Kgv.qSubMenuBtns);
                if (!subMenuBtns) {
                    if (max_retries > 0) {
                        return setTimeout(() => menuLoop(max_retries - 1, delay), delay);
                    } else {
                        console.warn('Max retries reached, subMenuBtns not found.');
                        return;
                    }
                }
                Object.assign(subMenuBtns.style, {
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                })

                let customMenu = subMenuBtns.querySelector('.kgv-menu');
                if (!customMenu) {
                    customMenu = document.createElement('div');
                    customMenu.classList.add('kgv-menu');
                    subMenuBtns.appendChild(customMenu);
                } else {
                    customMenu.innerHTML = '';
                }
                
                const viewStyleContainer = document.createElement('div');
                viewStyleContainer.classList.add('kgv-menu-container');

                const viewStyleElem0 = document.createElement('button');
                viewStyleElem0.classList.add('kgv-menu-container-btn');
                if (this.config.viewerType === 0) {
                    viewStyleElem0.classList.add('active');
                }
                viewStyleElem0.textContent = '📜 리스트'
                viewStyleElem0.addEventListener('click', async () => {
                    if (this.config.viewerType === 0) {
                        console.debug('Already in list view, no action taken.');
                        return;
                    }
                    this.saveConfig('viewerType', 0);
                    // Refresh page
                    window.location.reload();
                    
                });
                viewStyleContainer.appendChild(viewStyleElem0);

                const viewStyleElem1 = document.createElement('button');
                viewStyleElem1.classList.add('kgv-menu-container-btn');
                if (this.config.viewerType === 1) {
                    viewStyleElem1.classList.add('active');
                }
                viewStyleElem1.textContent = '🖼️ 갤러리';
                viewStyleElem1.addEventListener('click', async () => {
                    if (this.config.viewerType === 1) {
                        console.debug('Already in gallery view, no action taken.');
                        return;
                    }
                    this.saveConfig('viewerType', 1);
                    // Refresh page
                    window.location.reload();
                });
                viewStyleContainer.appendChild(viewStyleElem1);
                customMenu.appendChild(viewStyleContainer);

                const cacheClearBtn = document.createElement('button');
                cacheClearBtn.classList.add('kgv-menu-btn');
                cacheClearBtn.textContent = '🗑️ 캐시제거';
                cacheClearBtn.addEventListener('click', () => {
                    if (confirm('캐시된 이미지 URL을 모두 삭제하시겠습니까?')) {
                        this.cacheImgUrls.clear();
                        this.saveCacheImgUrls();
                        // Refresh page
                        window.location.reload();
                    }
                });
                customMenu.appendChild(cacheClearBtn);

                subMenuBtns.appendChild(customMenu);

                // const mibandAddBtn = document.createElement('button');
                // mibandAddBtn.classList.add('kgv-menu-btn');
                // mibandAddBtn.textContent = '➕ 미방추가';
                // mibandAddBtn.addEventListener('click', () => {
                //     if (mibandAddBtn.classList.contains('active')) {
                //         return;
                //     }
                //     mibandAddBtn.classList.add('active');
                //     this.addMibangState();
                // });
                // customMenu.appendChild(mibandAddBtn);
                
                // const mibangBtn = document.createElement('button');
                // mibangBtn.classList.add('kgv-menu-btn');
                // mibangBtn.textContent = '🪄 미방';
                // mibangBtn.addEventListener('click', () => {
                //     if (this.popupMibang) {
                //         this.popupMibang.remove();
                //         this.popupMibang = null;
                //     } else {
                //         this.buildPopupMibang();
                //     }
                // });
                // customMenu.appendChild(mibangBtn);
            };
            menuLoop();
        }

        // addMibangState () {
        //     alert('이미지 클릭 시 미방에 추가되며, 미리보기에서 제외됩니다.\n취소하려면 새로고침하세요.');
        //     const allImgElements = document.querySelectorAll('img');
        //     if (!allImgElements || allImgElements.length === 0) {
        //         console.warn('No image elements found to add Mibang state.');
        //         return;
        //     }

        //     allImgElements.forEach((imgElement) => {
        //         if (imgElement.classList.contains('kgv-mibang-handle')) return;
        //         imgElement.classList.add('kgv-mibang-handle');
        //         imgElement.onclick = (e) => {
        //             e.stopPropagation();
        //             e.preventDefault();
                    
        //             this.saveMibang(imgElement.src);
        //             // refresh page
        //             window.location.reload();
        //         };
        //     });
        // }

        // buildPopupMibang () {
        //     if (this.popupMibang) {
        //         this.popupMibang.remove();
        //         this.popupMibang = null;
        //     }
        //     this.popupMibang = document.createElement('div');
        //     this.popupMibang.classList.add('kgv-popup-mibang');
        //     this.popupMibang.style.position = 'fixed';
        //     this.popupMibang.style.top = '50%';
        //     this.popupMibang.style.left = '50%';
        //     this.popupMibang.style.transform = 'translate(-50%, -50%)';
        //     this.popupMibang.style.backgroundColor = '#fff';
        //     this.popupMibang.style.padding = '1em';
        //     this.popupMibang.style.borderRadius = '5px';
        //     this.popupMibang.style.zIndex = '1000';

        //     const title = document.createElement('h2');
        //     title.textContent = '미방 설정';
        //     this.popupMibang.appendChild(title);

        //     const mibangList = document.createElement('ul');
        //     mibangList.classList.add('kgv-mibang-list');
        // }
        
        pickPreviewCandidate (imgElements) {
            console.debug('Picking preview candidate from:', imgElements);
            if (!imgElements || imgElements.length === 0) return null;
            // for (const imgElement of imgElements) {
            //     if (this.checkIsMibang(imgElement.src)) {
            //         console.debug('Found Mibang image, skipping:', imgElement);
            //         continue;
            //     }
            //     return imgElement;
            // }
            return imgElements[0];
        }

        async crawlPreviewImgUrls (url) {
            return new Promise((resolve, _) => {
                const finalize = (resultUrl) => {
                    this.previewIframe.remove();
                    this.previewIframe = null;
                    return resolve(resultUrl);
                }

                url = Kgv.relativeUrlToAbsolute(url);
                if (this.previewIframe) {
                    this.previewIframe.remove();
                    this.previewIframe = null;
                }
                this.previewIframe = document.createElement('iframe');
                Object.assign(this.previewIframe.style, {
                    position: 'fixed',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    visibility: 'hidden',
                });
                document.body.appendChild(this.previewIframe);

                this.previewIframe.onload = async () => {
                    console.debug('Preview iframe loaded:', url);

                    const retryLoop = async (maxRetries = 20, delay = 100) => {
                        try {
                            const doc = this.previewIframe.contentDocument || this.previewIframe.contentWindow.document;
                            const shadowRoot = doc?.querySelector('.prose-container')
                            if (shadowRoot) {
                                await Kgv.handleModalsInIframeKone(doc);
                                const previewElement = this.pickPreviewCandidate(Kgv.extractImagesFromIframeDocument(doc));
                                if (!previewElement || !previewElement.src) {
                                    console.warn('No valid preview image found in iframe document:', url);
                                    return finalize(null);
                                }
                                return finalize(previewElement.src);
                            } else {
                                return setTimeout(() => {
                                    if (maxRetries > 0) {
                                        console.debug('Retrying to load iframe content, remaining retries:', maxRetries);
                                        return retryLoop(maxRetries - 1, delay);
                                    } else {
                                        console.warn('Max retries reached, no valid content found in iframe document:', url);
                                        return finalize(null);
                                    }
                                }, delay);
                            }
                        } catch (e) {
                            console.error('Error loading iframe document:', e);
                            return finalize(null);
                        }
                    };
                    await retryLoop();
                };
                this.previewIframe.onerror = (e) => {
                    console.error('Error loading iframe:', e);
                    return finalize(null);
                };

                this.previewIframe.src = url;
            });
        }

        async runQueuePreviewImgUrls () {
            if (this.queueTimeoutUid) {
                return;
            } else if (this.queuePreviewImgUrls.length === 0) {
                console.debug('No URLs in queue to process.');
                return;
            }

            this.queueTimeoutUid = -1;
            const nextUrl = this.queuePreviewImgUrls.shift();
            if (nextUrl) {
                console.debug('Processing URL from queue:', nextUrl);
                try {
                    const previewUrl = await this.crawlPreviewImgUrls(nextUrl);
                    this.cacheImgUrls.set(Kgv.filterOnlyPathUrl(nextUrl), previewUrl || null);
                    this.ensureCacheImgUrls();
                    this.saveCacheImgUrls();
                    this.dispatchEvent(new CustomEvent('previewImgUrlCrawled', {
                        detail: { url: nextUrl, previewUrl: previewUrl }
                    }));
                } catch (e) {
                    console.error('Error processing URL in queue:', nextUrl, e);
                }
            }
            this.queueTimeoutUid = setTimeout(() => {
                this.queueTimeoutUid = null;
                this.runQueuePreviewImgUrls();
            }, 0);
        }

        requestQueuePreviewImgUrl (url) {
            if (!url) {
                console.warn('Invalid URL requested for preview image:', url);
                return;
            }
            const cachedImgUrl = this.getCacheImgUrl(url);
            if (cachedImgUrl !== undefined) {
                this.dispatchEvent(new CustomEvent('previewImgUrlCrawled', {
                    detail: { url: url, previewUrl: cachedImgUrl }
                }));
            } else {
                this.queuePreviewImgUrls.push(url);
                this.runQueuePreviewImgUrls();
            }
        }

        koneParseGalleryInfoList (list) {
            const resultGalleryInfo = [];
            for (const item of list) {
                const galleryInfo = {
                    link: item.querySelector('a')?.href || '',
                    badgeHtml: item.querySelector('a .contents > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)')?.outerHTML || '',
                    title: item.querySelector('a .contents > div:nth-child(1) div.flex.items-center > span.text-ellipsis')?.innerHTML || '',
                    commentCountStr: item.querySelector('a .contents > div:nth-child(1) div.flex > span.text-xs')?.innerHTML || '',
                    author: item.querySelector('a .contents > div:nth-child(1) > div:nth-child(3) .text-ellipsis')?.innerHTML || '',
                    timeStr: item.querySelector('a .contents > div:nth-child(1) > div:nth-child(4)')?.innerHTML || '',
                    viewStr: item.querySelector('a .contents > div:nth-child(1) > div:nth-child(5)')?.innerHTML || '',
                    rating: parseInt(item.querySelector('a .contents > div:nth-child(1) > div:nth-child(6)')?.innerHTML.replace(/[^0-9\-]/g, '')) || 0,
                    isRatingHigh: item.querySelector('a .contents > div:nth-child(1) > div:nth-child(6)')?.classList.contains('text-red-500') || false,
                    isRatingLow: false,
                };
                if (galleryInfo.rating < 0) {
                    galleryInfo.isRatingLow = true;
                }
                resultGalleryInfo.push(galleryInfo);
            }
            return resultGalleryInfo;
        }

        buildGalleryCard (galleryInfo) {
            const card = document.createElement('a');
            card.href = galleryInfo.link;
            card.classList.add('kgv-gallery');
            if (galleryInfo.isRatingHigh) {
                card.classList.add('kgv-gallery-good');
            }
            if (galleryInfo.isRatingLow) {
                card.classList.add('kgv-gallery-bad');
            }
            card.innerHTML = /*html*/ `
<div class="kgv-gallery-preview">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor"><path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-360q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z"/></svg>
</div>
<div class="kgv-gallery-info">
    <div class="kgv-gallery-info-1">
        <span class="kgv-title">${galleryInfo.title}</span>
        <span class="kgv-comment">
            ${galleryInfo.commentCountStr}
        </span>
    </div>
    <div class="kgv-gallery-info-2">
        <span class="kgv-author">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 -960 960 960" fill="currentColor"><path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z"/></svg>
            ${galleryInfo.author}
        </span>
    </div>
    <div class="kgv-gallery-info-3">
        <span class="kgv-category">
            ${galleryInfo.badgeHtml || ''}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><circle cx="256" cy="256" r="64" fill="currentColor"/><path fill="currentColor" d="M490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96c-42.52 0-84.33 12.15-124.27 36.11c-40.73 24.43-77.63 60.12-109.68 106.07a31.92 31.92 0 0 0-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416c46.71 0 93.81-14.43 136.2-41.72c38.46-24.77 72.72-59.66 99.08-100.92a32.2 32.2 0 0 0-.1-34.76ZM256 352a96 96 0 1 1 96-96a96.11 96.11 0 0 1-96 96Z"/></svg>
        <span class="kgv-view">
            ${galleryInfo.viewStr}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512"><path fill="currentColor" d="M456 128a40 40 0 0 0-37.23 54.6l-84.17 84.17a39.86 39.86 0 0 0-29.2 0l-60.17-60.17a40 40 0 1 0-74.46 0L70.6 306.77a40 40 0 1 0 22.63 22.63L193.4 229.23a39.86 39.86 0 0 0 29.2 0l60.17 60.17a40 40 0 1 0 74.46 0l84.17-84.17A40 40 0 1 0 456 128Z"/></svg>
        <span class="kgv-vote">
            ${galleryInfo.rating}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 512 512"><path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48zm0 368c-88.22 0-160-71.78-160-160s71.78-160 160-160s160 71.78 160 160s-71.78 160-160 160z"/><path fill="currentColor" d="M272 144h-32v144l96.97 58.18l16.03-26.28L272 240V144z"/></svg>
        <span class="kgv-time">
            ${galleryInfo.timeStr}
        </span>
    </div>
</div>
            `;
            const onCrawled = (e) => {
                if (Kgv.filterOnlyPathUrl(e.detail.url) === Kgv.filterOnlyPathUrl(galleryInfo.link)) {
                    this.removeEventListener('previewImgUrlCrawled', onCrawled);
                    const previewElement = card.querySelector('.kgv-gallery-preview');
                    if (previewElement) {
                        previewElement.innerHTML = '';
                        if (e.detail.previewUrl) {
                            const imgElement = document.createElement('img');
                            imgElement.loading = 'lazy';
                            imgElement.src = e.detail.previewUrl;
                            
                            previewElement.appendChild(imgElement);
                        }
                    }
                }
            }
            this.addEventListener('previewImgUrlCrawled', onCrawled);
            this.requestQueuePreviewImgUrl(galleryInfo.link);

            return card;
        }

        renderGalleryList () {
            const loadingLoop = (max_retries = 20, delay = 100) => {
                const listContainer = document.querySelector(Kgv.qSubMainListContainer);
                const list = document.querySelectorAll(Kgv.qSubMainList);
                if (listContainer && list && list.length > 0) {
                    if (this.originListMutationObserver) {
                        this.originListMutationObserver.disconnect();
                        this.originListMutationObserver = null;
                    }
                    this.originListMutationObserver = new MutationObserver(() => {
                        console.debug('Gallery list changed, re-rendering gallery list.');
                        this.buildMenu();
                        this.renderGalleryList();
                    });
                    this.originListMutationObserver.observe(listContainer, {
                        childList: true,
                        subtree: true,
                    });

                    // Reset queue
                    this.queuePreviewImgUrls = [];
                    const galleryInfoList = this.koneParseGalleryInfoList(list);
                    if (galleryInfoList.length === 0) {
                        console.warn('No gallery info found.');
                        return;
                    }
                    
                    if (this.galleryViewListElement) {
                        this.galleryViewListElement.remove();
                        this.galleryViewListElement = null;
                    }
                    this.galleryViewListElement = document.createElement('div');
                    this.galleryViewListElement.classList.add('kgv-list');
                    galleryInfoList.map(this.buildGalleryCard.bind(this)).forEach(card => {
                        this.galleryViewListElement.appendChild(card);
                    });

                    listContainer.after(this.galleryViewListElement);
                    listContainer.style.display = 'none';
                } else {
                    if (max_retries > 0) {
                        return setTimeout(() => loadingLoop(max_retries - 1, delay), delay);
                    } else {
                        console.warn('Max retries reached, gallery list not found.');
                    }
                }
            }

            if (this.config.viewerType === 1) {
                loadingLoop();
            }
        }

        observeURLChange() {
            let lastUrl = location.href;

            const onURLChange = () => {
                setTimeout(() => {
                    console.debug('URL changed, re-rendering gallery list:', lastUrl);
                    kgvInstance.buildMenu()
                    kgvInstance.renderGalleryList();
                }, 100);
            }

            const urlChangeHandler = () => {
                if (location.href !== lastUrl && location.href.includes('/s/')) {
                    lastUrl = location.href;
                    onURLChange();
                }
            };

            const urlObserver = new MutationObserver(urlChangeHandler);
            urlObserver.observe(document.body, { childList: true, subtree: true });

            const originalPush = history.pushState;
            history.pushState = function () {
                originalPush.apply(this, arguments);
                urlChangeHandler();
            };

            window.addEventListener('popstate', urlChangeHandler);
            onURLChange(); // Initial call to render on script load
        }
    }

    // Initialize the Kgv instance
    const kgvInstance = await Kgv.getInstance();
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        kgvInstance.observeURLChange();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            kgvInstance.observeURLChange();
        });
    }
})();
