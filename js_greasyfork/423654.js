// ==UserScript==
// @name        哔哩哔哩（bilibili | B站）多p 合集 视频选集区标题显示加宽加高
// @namespace   http://tampermonkey.net/
// @version     0.6
// @description 哔哩哔哩（bilibili | B站 | b站）多p 合集 视频选集区标题显示加宽加高， v0.6 支持2023年新版播放器的合集列表标题显示加宽和新增加高，修复了有封面的合集没有加宽的问题
// @author      chulong
// @homepage    https://greasyfork.org/zh-CN/scripts/423654
// @match       https://www.bilibili.com/video/av*
// @match       https://www.bilibili.com/video/BV*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423654/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%20%7C%20B%E7%AB%99%EF%BC%89%E5%A4%9Ap%20%E5%90%88%E9%9B%86%20%E8%A7%86%E9%A2%91%E9%80%89%E9%9B%86%E5%8C%BA%E6%A0%87%E9%A2%98%E6%98%BE%E7%A4%BA%E5%8A%A0%E5%AE%BD%E5%8A%A0%E9%AB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/423654/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%20%7C%20B%E7%AB%99%EF%BC%89%E5%A4%9Ap%20%E5%90%88%E9%9B%86%20%E8%A7%86%E9%A2%91%E9%80%89%E9%9B%86%E5%8C%BA%E6%A0%87%E9%A2%98%E6%98%BE%E7%A4%BA%E5%8A%A0%E5%AE%BD%E5%8A%A0%E9%AB%98.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...
    const CONFIG_WIDTH = "550px"; // 全屏播放时，右下角选集容器的宽度
    const SCRIPT_NAME = 'B站分P合集标题显示加宽脚本'

    // 被监控对象，右下角控制按钮区域， 只有全屏时才会出现选集按钮 这是新版的
    var newPartTitleListInFullScreenModeElementToObserve = document.querySelector(
        "#bilibili-player > div > div > div.bpx-player-primary-area >" +
        "div.bpx-player-video-area > div.bpx-player-control-wrap >" +
        "div.bpx-player-control-entity > div.bpx-player-control-bottom >" +
        "div.bpx-player-control-bottom-right"
    )

    // 获取播放器的高度，后续分p合集列表容器参照此高度
    let videoPlayerHeight = window.getComputedStyle(document.getElementById('playerWrap')).height;

    if (newPartTitleListInFullScreenModeElementToObserve) {
        handleNewPlayPage();
    } else {
        handleOldPlayPage();
    }

    function handleNewPlayPage() {

        // 获取投稿按钮的位置，后面加宽参考它的位置
        let uploadButtonRect = document.querySelector('.header-upload-entry').getBoundingClientRect();

        // 直接把右边的整个容器加宽
        let rightContainer = document.querySelector('.right-container');
        let rightContainerRect = rightContainer.getBoundingClientRect()
        let rightContianerEnlargeWidth = (uploadButtonRect.x + uploadButtonRect.width -  rightContainerRect.x - rightContainerRect.width ) *2 * 0.9 + rightContainerRect.width  + 'px'
        rightContainer.style.width = rightContianerEnlargeWidth

        // 非全屏时，新版播放页，常规播放或宽屏播放时分p选集列表的标题宽度，分p参考视频 https://www.bilibili.com/video/BV15J4m1L7YB/
        let multiPageDiv = document.getElementById("multi_page");
        if(multiPageDiv) {
            GM_addStyle(`.multi-page-v1 .cur-list .list-box li{width: ${rightContianerEnlargeWidth} !important}`)
        }

         // 非全屏时，合集列表显示框宽度
        let sectionListDiv = document.querySelector('div.video-sections-content-list');
        if (sectionListDiv) {
            // 对于无封面的合集 支持有分类和无分类， 有分类参考视频 https://space.bilibili.com/10330740/channel/collectiondetail?sid=1517
            let videoSectionsContainer = document.querySelector('div.base-video-sections-v1')
            if (videoSectionsContainer) { 
                let sectionListWidth = uploadButtonRect.x + uploadButtonRect.width -  videoSectionsContainer.getBoundingClientRect().x;
                // 非全屏时，合集列表标题
                let videoEpisodeCardInfoTitleNodeList = document.querySelectorAll('div.video-episode-card__info-title');
                videoEpisodeCardInfoTitleNodeList.forEach((item, index) => {
                    item.style.width = sectionListWidth - 60 + 'px';
                })
            } else if(document.querySelector('.video-episode-card__cover')) { // 对于有封面的 参考视频 https://www.bilibili.com/video/BV1634y1i7rV
                console.log(SCRIPT_NAME, '这个合集有封面')
                GM_addStyle(`.video-section-list{width: ${rightContianerEnlargeWidth} !important}`)
            }
        }
                
        // 非全屏时，合集列表显示框的高度
        let sectionListDivObserver = new MutationObserver(function callback1(mutationRecords, observer) {
            mutationRecords.forEach((item, index) =>{
                // if (item.type == 'childList') {
                    sectionListDiv.style.height = 'fit-content'
                    sectionListDiv.style.maxHeight = videoPlayerHeight;
            })

        });
        let childListChangeObserveConfig = {
            attributes: true,
            childList: true,
            subtree: false,
        };
        sectionListDivObserver.observe(sectionListDiv, childListChangeObserveConfig);

        // 网页全屏或全屏播放时选集列表的容器的宽度
        GM_addStyle('.bpx-player-ctrl-eplist-menu-wrap{width: 550px}')
    }

    // -------- 以下是处理旧版播放页（2023年以前）
    function handleOldPlayPage() {
        // 常规播放或宽屏播放时选集列表的宽度
        var listDiv = document.querySelector("#multi_page > div.cur-list");
        if (listDiv) {
            listDiv.style.width = CONFIG_WIDTH;
        }

        // 网页全屏或全屏播放时选集列表的宽度
        function callback(mutationRecords, observer) {
            let titleListWrap = document.querySelector("div.bilibili-player-video-btn-menu-wrap");
            if (titleListWrap) {
                titleListWrap.style.width = CONFIG_WIDTH;
                observer.disconnect(); // 一直监听 会收到播放时间的更新，每秒都在触发 callback。所以用完立即 disconnect
                handlePartChangeInFullScreenMode();
            }
        }

        var partTitleListInFullScreenModeElementToObserve = document.querySelector(
            "#bilibiliPlayer > div.bilibili-player-area > div.bilibili-player-video-wrap > "
            + "div.bilibili-player-video-control-wrap > div.bilibili-player-video-control > "
            + "div.bilibili-player-video-control-bottom > div.bilibili-player-video-control-bottom-right"
        );

        let partTitleListInFullScreenModeLoadMutationObserver = new MutationObserver(callback);
        let config = {
            childList: true,
            subtree: true,
        };
        partTitleListInFullScreenModeLoadMutationObserver.observe(partTitleListInFullScreenModeElementToObserve, config);

        // 网页全屏或全屏播放时选集列表的宽度, 如果发生切p， 页面不会reload, 但是宽度复原了，这是处理此种情况，
        // 比原来的 observer 一直监听性能更好，原有的 observer 会收到播放时间的更新，每秒都在触发 callback
        function handlePartChangeInFullScreenMode() {
            let titleListToObserve = document.querySelector("#multi_page > div.cur-list > ul");
            if (!titleListToObserve) {
                return;
            }
            var obser = new MutationObserver(function (mutationRecords, observer) {
                let titleListWrap = document.querySelector("div.bilibili-player-video-btn-menu-wrap");
                if (titleListWrap) {
                    titleListWrap.style.width = CONFIG_WIDTH;
                }
            });
            obser.observe(titleListToObserve, {
                attributes: true,
                subtree: true,
                attributeFilter: ["class"],
            });
        }
    }
})();
