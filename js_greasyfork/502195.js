// ==UserScript==
// @name         熊貓 Eagle 支援
// @name:ja      Exhentaiイーグルサポート
// @name:en      Exhentai Eagle Support
// @description  自動開啟 Exhentai 原圖並將其加入 Eagle
// @description:ja  Exhentaiのオリジナル畫像を自動的に開き、Eagleに追加します
// @description:en  Automatically open Exhentai original images and add them to Eagle
// @author       Max
// @namespace    https://greasyfork.org/zh-TW/users/1021017-max46656
// @version      1.0.2
// @match        *://exhentai.org/s/*
// @match        *://e-hentai.org/s/*
// @match        *://exhentai.org/g/*
// @match        *://e-hentai.org/g/*
// @match        *://*.hath.network*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        window.close
// @icon         https://exhentai.org/favicon.ico
// @license MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/502195/%E7%86%8A%E8%B2%93%20Eagle%20%E6%94%AF%E6%8F%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/502195/%E7%86%8A%E8%B2%93%20Eagle%20%E6%94%AF%E6%8F%B4.meta.js
// ==/UserScript==

class PicTrioFactory {
    constructor() {
        this.url = window.location.href;
        this.observer = new MutationObserver(this.checkTitleChange.bind(this));
        this.observer.observe(document.querySelector('title'), { subtree: true, characterData: true, childList: true });
    }

    checkTitleChange(mutations) {
        if (this.url !== window.location.href) {
            this.url = window.location.href;
            this.createInstance();
        }
    }

    getToWork() {
        const currentUrl = window.location.href;
        if (currentUrl.match(/.*\.hath\.network.*\/(h|om)/)) {
            const eagleAdder = new EagleImageAdder();
            eagleAdder.addImageToEagle();
        } else if (currentUrl.match(/.*:\/\/(ex|e-)?hentai\.org\/s\/.*/)) {
            const opener = new OriginalPicOpener();
            opener.savePicInfo();
            opener.openOriginalPic();
        } else if (currentUrl.match(/.*:\/\/(ex|e-)?hentai\.org\/g\/.*/)) {
            const albumManager = new AlbumPageManager();
            albumManager.addButton();
            albumManager.saveAlbumInfo();
        }
    }
}


class AlbumPageManager {
    constructor() {
        this.isAuto = GM_getValue('isAuto', false);
    }

    addButton() {
        const container = document.querySelector('#gd2');
        if (!container) return;

        const button = document.createElement('button');
        this.updateButtonText(button);
        this.styleButton(button);

        button.addEventListener('click', () => {
            this.isAuto = !this.isAuto;
            GM_setValue('isAuto', this.isAuto);
            this.updateButtonText(button);
        });

        container.appendChild(button);
    }

    updateButtonText(button) {
        button.textContent = this.isAuto ? 'AutoEagle: On' : 'AutoEagle: Off';
    }

    styleButton(button) {
        button.style.padding = '5px';
        button.style.backgroundColor = 'rgb(79, 83, 91)';
        button.style.color = 'rgb(241, 241, 242)';
        button.style.border = '1px solid #ccc';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.margin = '5px';
    }

    saveAlbumInfo() {
        const urlID = window.location.pathname.split('/')[2];
        let albumTitle = document.title.replace(/ - ExHentai\.org$/, '').replace(/ - E-Hentai\.org$/, '');
        //console.log("albumTitle",albumTitle);
        const albumData = GM_getValue('albumData', {});
        albumData[urlID] = {
            albumUrl: window.location.href,
            albumTitle: albumTitle,
        };
        GM_setValue('albumData', albumData);
    }
}

class OriginalPicOpener {
    constructor() {
        this.isAuto = GM_getValue('isAuto', false);
        //console.log("isAuto", this.isAuto);
    }

    openOriginalPic() {
        if (!this.isAuto) return;

        const links = document.querySelectorAll('a');
        for (const link of links) {
            if (link.textContent.includes('original')) {
                link.click();
                break;
            }
        }
    }

    savePicInfo() {
        const currentUrl = window.location.href;
        const picIDMatch = currentUrl.match(/\/s\/(.*?)\/(.*?)$/);
        if (!picIDMatch) return;

        const albumID = picIDMatch[2].split('-')[0];
        const picID = picIDMatch[1];
        const albumData = GM_getValue('albumData', {});
        const albumInfo = albumData[albumID] || {};
        const picData = GM_getValue('picData', {});
        picData[picID] = {
            albumUrl: albumInfo.albumUrl,
            albumTitle: albumInfo.albumTitle,
        };
        GM_setValue('picData', picData);
        //console.log(albumInfo);
    }
}

class EagleImageAdder {
    constructor() {
        this.EAGLE_SERVER_URL = "http://localhost:41595";
        this.EAGLE_IMPORT_API_URL = `${this.EAGLE_SERVER_URL}/api/item/addFromURL`;
        this.isAuto = GM_getValue('isAuto', true);
    }

    addImageToEagle() {
        if (!this.isAuto) return;

        const imageData = this.getImageData();
        GM_xmlhttpRequest({
            url: this.EAGLE_IMPORT_API_URL,
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(imageData),
            onload: function(response) {
                console.log('Image added to Eagle:', response);
                if (response.status >= 200 && response.status < 300) {
                    window.close();
                } else {
                    console.error('Failed to add image to Eagle:', response);
                }
            },
            onerror: function(error) {
                console.error('Failed to add image to Eagle:', error);
            }
        });
    }

    getImageData() {
        const imageUrl = window.location.href;
        let picIDMatch = imageUrl.match(/\/h\/(.{10})/);
        if (picIDMatch) {
        } else {
            // 第二種正則表達式匹配 om/ 格式的 URL
            picIDMatch = imageUrl.match(/\/om\/\d+\/(.{10})/);
        }
        //console.log(picIDMatch);
        const picID = picIDMatch[1];
        //console.log("picIDMatch",picIDMatch);
        const picData = GM_getValue('picData', {});
        const picInfo = picData[picID] || {};
        //console.log("picID",picID,"picInfo",picInfo);
        return {
            url: imageUrl,
            name: `${picInfo.albumTitle} - ${imageUrl.split('/').pop()}`,
            website: picInfo.albumUrl ?? imageUrl
        };
    }
}

class DataCleaner {
    constructor() {
        this.registerMenu();
    }

    registerMenu() {
        GM_registerMenuCommand('Clean Old Data', this.cleanOldData.bind(this));
    }

    cleanOldData() {
        const albumData = GM_getValue('albumData', {});
        const picData = GM_getValue('picData', {});

        let albumDataDeleted = 0;
        let picDataDeleted = 0;

        for (const key in albumData) {
            delete albumData[key];
            albumDataDeleted++;
        }

        for (const key in picData) {
            delete picData[key];
            picDataDeleted++;
        }

        GM_setValue('albumData', albumData);
        GM_setValue('picData', picData);

        console.log(`Old data cleaned. Deleted ${albumDataDeleted} albumData and ${picDataDeleted} picData entries.`);
    }
}

const picPage = new PicTrioFactory();
picPage.getToWork();
const dataCleaner = new DataCleaner();
