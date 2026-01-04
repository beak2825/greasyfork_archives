// ==UserScript==
// @name        Pixiv作品與首頁中自動點選「檢視全部」
// @name:en     Pixiv Home and Artwork Page Auto-Click "View All"
// @name:ja     Pixivホームページおよび作品ページで「すべて表示」を自動クリック// @description 在User首頁與Tag首頁中自動展開；當作品包含多張圖片時自動展開(漫畫作品不受影響)
// @description 在User首頁與Tag首頁中自動展開；當作品包含多張圖片時自動展開(漫畫作品不受影響)
// @description:en Automatically expands on User Home and Tag Home pages; automatically expands artworks with multiple images (manga artworks are not affected).
// @description:ja ユーザーホームページおよびタグホームページで自動的に展開します。複数の画像を含む作品では自動的に展開します（マンガ作品は影響を受けません）。

// @match       https://www.pixiv.net/artworks/*
// @match       https://www.pixiv.net/en/artworks/*
// @match       https://www.pixiv.net/users/*
// @match       https://www.pixiv.net/en/artworks/*
// @grant       none
// @version     1.1.2
// @icon        https://www.google.com/s2/favicons?sz=64&domain=pixiv.net

// @author      Max
// @namespace   https://github.com/Max46656
// @license MPL2.0
// @downloadURL https://update.greasyfork.org/scripts/542777/Pixiv%E4%BD%9C%E5%93%81%E8%88%87%E9%A6%96%E9%A0%81%E4%B8%AD%E8%87%AA%E5%8B%95%E9%BB%9E%E9%81%B8%E3%80%8C%E6%AA%A2%E8%A6%96%E5%85%A8%E9%83%A8%E3%80%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/542777/Pixiv%E4%BD%9C%E5%93%81%E8%88%87%E9%A6%96%E9%A0%81%E4%B8%AD%E8%87%AA%E5%8B%95%E9%BB%9E%E9%81%B8%E3%80%8C%E6%AA%A2%E8%A6%96%E5%85%A8%E9%83%A8%E3%80%8D.meta.js
// ==/UserScript==

class ReadingStand {
    constructor() {
        this.notMangaTexts = ['查看全部', '檢視全部', 'すべて見る', 'Show all', '모두 보기'];
        this.setupUrlChangeListener();
    }

    expandArtwork() {
        const viewAllButton = Array.from(document.querySelectorAll('button:not(:disabled)'))
        .find(btn =>
              window.getComputedStyle(btn).display !== 'none' &&
              this.notMangaTexts.some(text => btn.textContent.includes(text))
             );
        if (viewAllButton) {
            viewAllButton.click();
        }
    }

    expandGallery() {
        const patterns = [
            /(en\/users|users)\/[0-9]*$/,
            /(en\/tags|tags)\/[^\/]*$/,
            /(en\/users|users)\/[0-9]*\/request\/sent$/,
        ];

        const currentUrl = self.location.href;
        const hasExpanded = /\/artworks\?p=\d+$/.test(currentUrl);

        if (!hasExpanded && patterns.some(pattern => pattern.test(currentUrl))) {
            self.location.href = currentUrl + '/artworks?p=1';
        }
    }

    setupUrlChangeListener() {
        const delay = (n) => new Promise(r => setTimeout(r, n * 1000));

        const oldPushState = history.pushState;
        history.pushState = function pushState() {
            const result = oldPushState.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        const oldReplaceState = history.replaceState;
        history.replaceState = function replaceState() {
            const result = oldReplaceState.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('locationchange'));
            return result;
        };

        window.addEventListener('popstate', () => {
            window.dispatchEvent(new Event('locationchange'));
        });


        window.addEventListener("load", () => {
            window.dispatchEvent(new Event('locationchange'));
        });

        window.addEventListener('locationchange', () => {
            delay(0.7).then(() => {
                this.expandArtwork();
                this.expandGallery();
            });
        });
    }
}

const JohnThePageTurner = new ReadingStand();
