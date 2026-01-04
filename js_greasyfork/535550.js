// ==UserScript==
// @name        YT首頁排列
// @namespace   https://greasyfork.org/zh-TW/users/4839-leadra
// @match       https://www.youtube.com/
// @match       https://www.youtube.com/feed/subscriptions
// @grant       none
// @license     MIT
// @run-at      document-start
// @version     1.0
// @author      Pedro
// @icon      https://www.youtube.com/favicon.ico
// @description 首頁+訂閱頁面的影片縮圖、shorts、貼文排列數量修改，斷行空白會補滿
// @downloadURL https://update.greasyfork.org/scripts/535550/YT%E9%A6%96%E9%A0%81%E6%8E%92%E5%88%97.user.js
// @updateURL https://update.greasyfork.org/scripts/535550/YT%E9%A6%96%E9%A0%81%E6%8E%92%E5%88%97.meta.js
// ==/UserScript==
/*
Pedro.原作者有上架擴充
擴充YouTube Tweaks
https://chromewebstore.google.com/detail/youtube-tweaks/oeakphpfoaeggagmgphfejmfjbhjfhhh
*/
// Videos
let maxNumOfColumns = 4;
let minColumnWidth = 200;

// Shorts
let maxNumOfColumns2 = 6;
let minColumnWidth2 = 150;

// Posts
let maxNumOfColumns3 = 4;
let minColumnWidth3 = 326;


function calcNumOfElements(type) {
    if (!pm) pm = document.getElementById('page-manager');

    if (type == 'video') {
        for (let i = maxNumOfColumns; i > 0; i--) {
            if ((pm?.clientWidth - 32) / i >= minColumnWidth) {
                document.documentElement.style.setProperty('--videosPerRow', i);
                return i;
            }
        }
    } else if (type == 'short') {
        for (let i = maxNumOfColumns2; i > 0; i--) {
            if ((pm?.clientWidth - 32) / i >= minColumnWidth2) return i;
        }
    } else {
        for (let i = maxNumOfColumns3; i > 0; i--) {
            if ((pm?.clientWidth - 32) / i >= minColumnWidth3) return i;
        }
    }
}

let pm, hasRun, hasRun2;
const origObjDefineProp = Object.defineProperty;
Object.defineProperty = function() {
    if (!hasRun && arguments[0]?.refreshGridLayout) {
        hasRun = 1;
        let rgl = arguments[0].refreshGridLayout;

        arguments[0].refreshGridLayout = function() {
            origObjDefineProp(this, 'elementsPerRow', {
                get: function() {
                    return calcNumOfElements('video') || 1;
                },
                set: function(x) {
                    elementsPerRow = x;
                },
                configurable: true
            });

            origObjDefineProp(this, 'slimItemsPerRow', {
                get: function() {
                    return calcNumOfElements('short') || 1;
                },
                set: function(x) {
                    slimItemsPerRow = x;
                },
                configurable: true
            });

            return rgl.apply(this, arguments);
        }
    }

    if (!hasRun2 && arguments[0]?.refreshGridLayoutNew) {
        hasRun2 = 1;
        let rglNew = arguments[0].refreshGridLayoutNew;

        arguments[0].refreshGridLayoutNew = function() {
            origObjDefineProp(this, 'elementsPerRow', {
                get: function() {
                    let type;
                    if (this.isShortsShelf?.() || this.isGameCardShelf?.() || this.isMiniGameCardShelf?.()) type = 'short';
                    else if (this.isPostShelfRenderer?.()) type = 'post';
                    else type = 'video';

                    return calcNumOfElements(type) || 1;
                },
                set: function(x) {
                    elementsPerRow = x;
                },
                configurable: true
            });

            return rglNew.apply(this, arguments);
        }
    }

    return origObjDefineProp.apply(this, arguments);
}

const sheet = new CSSStyleSheet();
document.adoptedStyleSheets = [sheet];
sheet.replaceSync(`
ytd-rich-grid-media[mini-mode] {
  max-width: initial;
}

ytd-two-column-browse-results-renderer[page-subtype=channels]:has(ytd-rich-grid-renderer:not([is-shorts-grid])) {
  width: calc(100% - 32px) !important;
  max-width: calc(var(--videosPerRow) * (var(--ytd-rich-grid-item-max-width) + var(--ytd-rich-grid-item-margin))) !important;
}

#home-page-skeleton .rich-grid-media-skeleton {
  min-width: ${minColumnWidth - 16}px !important;
  flex-basis: ${minColumnWidth - 16}px !important;
}
`);