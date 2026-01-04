// ==UserScript==
// @name         Pornhub移动端体验提升
// @namespace    https://pornhub.com
// @version      0.0.2
// @description  Pornhub移动端使用体验提升，优化了视频播放页交互
// @author       生机勃勃的勃勃
// @match        https://cn.pornhub.com/*
// @match        https://pornhub.com/*
// @icon         https://ei.phncdn.com/www-static/images/vmobile/icon_2x.png?cache=2024041901
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/493102/Pornhub%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BD%93%E9%AA%8C%E6%8F%90%E5%8D%87.user.js
// @updateURL https://update.greasyfork.org/scripts/493102/Pornhub%E7%A7%BB%E5%8A%A8%E7%AB%AF%E4%BD%93%E9%AA%8C%E6%8F%90%E5%8D%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const tabFilters = document.querySelector('#tabFilters ul.tabs')
    if (tabFilters) {
        tabFilters.addEventListener('click', (e) => {
            console.log('ee', e.target)
            const tabWrapperDom = document.querySelector(".tabWrapper")
            let top = tabWrapperDom && tabWrapperDom.offsetTop - 265
            console.log('top', top)
            setTimeout(() => {
                window.scrollTo(0, top)
            }, 0)
        })
    }

    const adContainer = document.querySelectorAll('.adContainer')
    if (adContainer) {
        adContainer.forEach(dom => dom.style.display = 'none')
    }

    GM_addStyle(`
        #videoShow .playerWrapper {
            position: sticky;
            top: 58px;
            z-index: 100;
        }
        #mobileHeader {
            position: fixed !important;
        }
        #mobileHeader.js-headerHidden {
            transform: unset !important;
            z-index: 100;
        }
        #mobileHeader.js-headerHidden .topNav {
            height: 60px !important;
        }
        #relatedVideos, #recommendedVideos, #playlist-box  {
            max-width: 100%;
            display: flex;
            flex-wrap: wrap;
        }
        #videoShow .mostPopularComment {
            padding: 12px 8px;
            margin-bottom: 0;
        }
        #videoShow div.tabWrapper .tabFilterWrapper#tabFilters {
            top: 275px !important;
            padding-top: 15px;
            display: block;
        }
        #videoShow .mgp_adRollContainer .mgp_adRollSkipButton {
            right: 0;
            padding: 15px 0;
        }
        #videoShow .mgp_adRollContainer .mgp_adRollSkipButton .mgp_adRollSkipButtonContent {
            width: 100vw;
        }
        #videoShow div.tabWrapper > div {
            display: none;
        }
        #videoShow div.tabWrapper > div#related {
            display: block;
        }
        /** 
        .tabWrapper .userFavoriteSection .videoList>ul>li,.tabWrapper .videoList>li,.tabWrapper .playList>li {
            width: 50% !important;
            padding: 2px;
            margin: 6px 0 !important;
        }
        * /
    `)
})();