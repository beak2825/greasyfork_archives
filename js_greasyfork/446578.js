// ==UserScript==
// @name         Bilibili-Minus-Minus
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  简化网页版B站视频界面
// @author       insorker
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @note         2022.08-31-V0.4.3 修复直播推荐bug
// @note         2022.08-31-V0.4.2 修复动态bug
// @note         2022.08-31-V0.4.1 根据个人习惯修改，不喜欢可以取消hideRightContainer();注释
// @note         2022.08-31-V0.4.0 “右侧显示”更新为人性化图标，修复显示bug
// @note         2022.08-30-V0.3.2 “右侧显示”修复
// @note         2022.06-16-V0.3.1 “右侧显示”按钮属性变动。如再次发生如上情况，可考虑重写按钮样式。
// @note         2022.06-16-V0.3.0 可选择在视频界面是否移除右边栏
// @note         2022.06-16-V0.2.0 分集视频不移除右边栏，单集视频移除右边栏
// @note         2022.06-16-V0.1.0 移除视频界面右侧广告和推荐；移除动态界面右侧广告和话题
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/446578/Bilibili-Minus-Minus.user.js
// @updateURL https://update.greasyfork.org/scripts/446578/Bilibili-Minus-Minus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (function addStyle() {
        let css = `
        .right-container-disp:hover {
            background-color: rgb(240, 240, 240);
        }
        .right-container-disp {
            position: fixed;
            right: 6px;
            bottom: 6px;
            background-color: #fff;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: #999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            box-shadow: 0 0 6px rgba(0,0,0,.12);
            cursor: pointer;
            z-index: 5;
        }
        .disp-show {
            width: 0;
            height: 0;
            position: fixed;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-left: 7px solid #999;
        }
        .disp-hide {
            width: 0;
            height: 0;
            position: fixed;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            border-right: 7px solid #999;
        }
        `;

        GM_addStyle(css);
    })();

    if (location.host.includes("t.bilibili.com")) {
        const appContainer = document.getElementById('app');

        const appCallback = function(mutationsList, observer) {
            // leftEntry
            function hideLeftEntry() {
                let leftEntry = document.querySelector('.left-entry');
                moveSearch('right');

                if (leftEntry)
                    displaySwitch(leftEntry, 'hide');
            }
            // search placeholder
            function hideSearchPlaceHolder() {
                let placeHolder = document.querySelector('.nav-search-input');

                if (placeHolder)
                    placeHolder.setAttribute('placeholder', '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili');
            }
            // advertisement
            function hideAdvertisement() {
                let ads = document.querySelector('.bili-dyn-ads');

                if (ads)
                    displaySwitch(ads, 'hide');
            }
            // topic
            function hideTopic() {
                let topic = document.querySelector('.right .sticky');

                if (topic)
                    displaySwitch(topic, 'hide');
            }
            // announcement
            function hideAnnouncement() {
                let announcement = document.querySelector('.bili-dyn-banner');

                if (announcement)
                    displaySwitch(announcement, 'hide');
            }
            // right
            function hideRight() {
                let right = document.querySelector('.right');

                if (right)
                    displaySwitch(right, 'hide');
            }

            for (let mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    hideLeftEntry();
                    hideSearchPlaceHolder();
                    hideAdvertisement();
                    hideTopic();
                    hideAnnouncement();
                    hideRight();
                }
            }
        };

        const observer = new MutationObserver(appCallback);
        observer.observe(appContainer, { childList: true, subtree: true });
    }
    else {
        (function() {
            let body = document.querySelector('body');
            let display = document.createElement('div');
            display.className = 'right-container-disp';
            display.innerHTML = "<div class='disp-show'></div>";
            body.appendChild(display);

            display.onclick = function() {
                // 不再监听DOM的变动
                observer.disconnect();
                rightContainerDisplaySwitch();
            };
        })();

        function rightContainerDisplaySwitch(hide = false) {
            let rightContainer = document.querySelector('.right-container.is-in-large-ab');
            let display = document.querySelector('.right-container-disp');

            if (rightContainer) {
                if (hide || displayState(rightContainer) == 'show') {
                    displaySwitch(rightContainer, 'hide');
                    display.firstChild.className = 'disp-hide';
                    moveSearch('right');
                }
                else {
                    displaySwitch(rightContainer, 'show');
                    display.firstChild.className = 'disp-show';
                    moveSearch('center');
                }
            }
        }

        const appContainer = document.getElementById('app');

        const appCallback = function(mutationsList, observer) {
            //=====top
            // leftEntry
            function hideLeftEntry() {
                let leftEntry = document.querySelector('.left-entry');

                if (leftEntry)
                    displaySwitch(leftEntry, 'hide');
            }
            // search placeholder
            function hideSearchPlaceHolder() {
                let placeHolder = document.querySelector('.nav-search-input');

                if (placeHolder)
                    placeHolder.setAttribute('placeholder', '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili');
            }

            //=====right
            // advertisement
            function hideAdvertisement() {
                let ad_report_top = document.querySelector('a.ad-report.video-card-ad-small');
                let ad_report_bottom = document.getElementById('right-bottom-banner');
                let slide_ad = document.getElementById('slide_ad');
                let bannerAd = document.getElementById('bannerAd');

                if (ad_report_top)
                    displaySwitch(ad_report_top, 'hide');
                if (ad_report_bottom)
                    displaySwitch(ad_report_bottom, 'hide');
                if (slide_ad)
                    displaySwitch(slide_ad, 'hide');
                if (bannerAd)
                    displaySwitch(bannerAd, 'hide');
            }
            // recommend list
            function hideRecommendList() {
                let recommendList = document.getElementById('reco_list');

                if (recommendList)
                    displaySwitch(recommendList, 'hide');
            }
            // live
            function hideLive() {
                // let live = document.getElementById('live_recommand_report');
                let live = document.getElementsByClassName('pop-live-small-mode')[0];

                if (live)
                    displaySwitch(live, 'hide');
            }
            // activity
            function hideActivity() {
                let activity = document.getElementById('activity_vote');

                if (activity)
                    displaySwitch(activity, 'hide');
            }
            // right
            function hideRightContainer() {
                let rightContainer = document.querySelector('.right-container.is-in-large-ab');

                if (rightContainer) {
                    let multiPage = document.getElementById('multi_page');

                    if (!multiPage)
                        rightContainerDisplaySwitch(true);
                }
            }

            for (let mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    hideLeftEntry();
                    hideSearchPlaceHolder();
                    hideAdvertisement();
                    hideRecommendList();
                    hideLive();
                    hideActivity();
                    // hideRightContainer();
                }
            }
        };

        const observer = new MutationObserver(appCallback);
        observer.observe(appContainer, { childList: true, subtree: true });
    }

    // ===== utils
    // display
    function displayState(item) {
        if (item.style.display == 'none')
            return 'hide';
        return 'show';
    }
    function displaySwitch(item, state) {
        if (state == 'hide')
            item.style.display = 'none';
        else if (state == 'show')
            item.style.display = '';
    }
    // move search bar
    function moveSearch(position) {
        let search = document.querySelector('.center-search__bar');

        if (search) {
            if (position == 'right')
                search.style.margin = '0 0 0 auto';
            else if (position == 'center')
                search.style.margin = '0 auto';
        }
    }
    // utils =====
})();