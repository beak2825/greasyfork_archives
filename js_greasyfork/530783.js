// ==UserScript==
// @name         Bilibili Fan Badge Optimization
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Reset Bilibili fan badge color styles and hide project management tasks
// @author       Gavin Hon
// @match        https://live.bilibili.com/*
// @match        https://link.bilibili.com/*
// @match        https://www.bilibili.com/blackboard/live/*
// @noframes
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530783/Bilibili%20Fan%20Badge%20Optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/530783/Bilibili%20Fan%20Badge%20Optimization.meta.js
// ==/UserScript==

GM_addStyle(`
    .level-info,
    .bettery-block,
    .progress.wealth-wrap.is-vertical,
    .section-block.battery-block.dp-none.a-move-in-left {
        display: none !important;
    }

    .header-node.w-100.p-relative.border-box.over-hidden,
    .user-panel.p-relative.border-box.none-select.panel-shadow {
        height: auto;
    }

    .shortcuts-ctnr > .shortcut-item:nth-child(2) {
        display: none !important;
    }
`);

(function() {
    const settings = {
        chatVerticalSpacing: 1,
        adjustLiveInterface: false,
        redirectActivePages: true,
        modifyFanBadgeStyle: true,
        badgeRoundedCorners: false,
    };

    // Redirect to original page when active theme detected
    const removeActiveTopics = function() {
        const frames = document.getElementsByTagName("iframe");
        const regex = /live\.bilibili\.com\/blanc\/.+?liteVersion=true/;
        for (let i = 0; i < frames.length; i++) {
            if (regex.test(frames[i].src)) {
                window.location.href = frames[i].src;
            }
        }
    };

    if (settings.redirectActivePages) {
        setTimeout(removeActiveTopics, 0);
        setTimeout(removeActiveTopics, 5000);
    }

    // Remove feedback button caused by window adjustments
    setInterval(() => {
        const feedback = document.querySelector("#js-player-decorator > div > div.bilibili-live-player-video-area > img");
        if (feedback) feedback.remove();
    }, 1000);

    function addStyle(rules) {
        const styleElement = document.createElement('style');
        styleElement.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(styleElement);
        styleElement.appendChild(document.createTextNode(rules));
    }

    if (settings.adjustLiveInterface) {
        addStyle(`
            /* Chat column width adjustment */
            #aside-area-vm {
                width: 400px !important;
                right: -150px !important;
            }

            /* Leaderboard adjustments */
            .tabs.isHundred {
                text-align: center;
                margin: 0 auto;
            }
            #rank-list-ctnr-box {
                width: 100%!important;
            }

            /* Video area adjustments */
            .live-room-app .app-content .app-body .player-and-aside-area .left-container {
                width: calc(100% - 212px - 12px)!important;
                right: 50px;
            }

            /* Dropdown menu adjustments */
            .guard-rank-cntr .rank-cntr .btn-box .guard-daily-record .board-icon+.daily-text {
                margin-top: -63px !important;
            }
            button.bl-button.live-skin-highlight-text.live-skin-separate-area-hover.bl-button--primary.bl-button--size {
                left: -35px !important;
                top: -34px !important;
            }
            .guard-daily-record.live-skin-main-text {
                margin-left: 52px;
            }
            img.daily-record-title-img {
                left: 150px !important;
            }
            .guard-rank-cntr .rank-cntr .btn-box .guard-daily-record .board-icon {
                top: -18px !important;
                left: -277px !important;
            }
        `);
    }

    if (settings.modifyFanBadgeStyle) {
        if (!settings.badgeRoundedCorners) {
            addStyle(`
                .fans-medal-item, .fans-medal-item::after {
                    border-radius: unset !important;
                }
            `);
        }

        addStyle(`
            /* 2233 button positioning */
            .avatar-btn.pointer.a-scale-in-ease.model-22,
            .avatar-btn.pointer.a-scale-in-ease.model-33 {
                left: 150px;
                position: relative;
            }

            /* Mini player adjustments */
            .live-player-ctnr.minimal {
                border-radius: 0;
                width: 1280px;
                height: 720px;
            }
            .live-player-ctnr.minimal:before {
                width: auto !important;
            }

            /* Background height adjustment */
            .room-bg.p-fixed {
                max-height: 1080px !important;
            }

            /* Chat area optimizations */
            div#penury-gift-msg {
                max-height: 26px;
                bottom: 18px;
            }
            div#chat-history-list {
                height: 100%
            }

            /* Slow down gift animation */
            .penury-gift-item.v-middle.a-move-in-top {
                animation: move-in-top cubic-bezier(.22,.58,.12,.50) 0.8s;
            }

            /* Badge styling overrides */
            .chat-history-panel .chat-history-list .chat-item.danmaku-item.chat-colorful-bubble {
                margin: 0 !important;
                background-color: transparent !important;
            }
            .fans-medal-item.medal-guard {
                margin-left: 0px !important;
                border-color: #769fd2 !important
            }
            .fans-medal-item .fans-medal-label.medal-guard {
                padding-left: 4px !important;
            }
            .chat-colorful-bubble span.user-name.v-middle.pointer.open-menu {
                color: #aaa !important;
            }

            /* Hide system messages */
            .chat-item.important-prompt-item,
            div#welcome-item-video,
            .top3-notice.chat-item
            .chat-item.convention-msg.border-box,
            .chat-item.hot-rank-msg,
            .chat-item.common-danmuku-msg.border-box,
            .shop-popover,
            .wealth-medal.wealth,
            .wealth-medal-ctnr.fans-medal-item-target.dp-i-block.p-relative.v-middle {
                display: none !important;
            }
            .danmaku-item-container {
                width: auto !important;
                height: 100% !important;
            }

            /* Badge color overrides */
            /* Levels 1-4 */
            .fans-medal-label[style*="#5762A799"],
            .fans-medal-item[style*="#5762A799"] {
                background: linear-gradient(45deg, #5B958D 0%, #5B958D 100%) !important;
                border-color: #5B958D !important;
            }
            .fans-medal-level[style*="#5762A799"] {
                color: #5B958D !important;
            }

            /* Levels 5-8 */
            .fans-medal-label[style*="#5866C799"],
            .fans-medal-item[style*="#5866C799"] {
                background: linear-gradient(45deg, #5D7B9D 0%, #5D7B9D 100%) !important;
                border-color: #5D7B9D !important;
            }
            .fans-medal-level[style*="#5866C799"] {
                color: #5D7B9D !important;
            }

            /* Levels 9-12 */
            .fans-medal-label[style*="#596FE099"],
            .fans-medal-item[style*="#596FE099"] {
                background: linear-gradient(45deg, #8C7CA6 0%, #8C7CA6 100%) !important;
                border-color: #8C7CA6 !important;
            }
            .fans-medal-level[style*="#596FE099"] {
                color: #8C7CA6 !important;
            }

            /* Levels 13-16 */
            .fans-medal-label[style*="#C85DC499"],
            .fans-medal-item[style*="#C85DC499"] {
                background: linear-gradient(45deg, #BE6686 0%, #BE6686 100%) !important;
                border-color: #BE6686 !important;
            }
            .fans-medal-level[style*="#C85DC499"] {
                color: #BE6686 !important;
            }

            /* Levels 17-20 */
            .fans-medal-label[style*="#DC6B6B99"],
            .fans-medal-item[style*="#DC6B6B99"] {
                background: linear-gradient(45deg, #C69E22 0%, #C69E22 100%) !important;
                border-color: #C69E22 !important;
            }
            .fans-medal-level[style*="#DC6B6B99"] {
                color: #C69E22 !important;
            }
        `);
    }

    // Adjust chat message spacing
    addStyle(`.chat-history-panel .chat-history-list .chat-item{padding: ${settings.chatVerticalSpacing}px 5px !important;}`);
})();