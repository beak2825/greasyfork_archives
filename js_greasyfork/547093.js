// ==UserScript==
// @name         No Rounded YouTube
// @name:ja      YouTube角丸削除
// @namespace    youtube-square-corners
// @version      1.0
// @description  Remove rounded corners on YouTube
// @description:ja YouTubeの角丸を無くします。
// @author       User
// @match        https://*.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547093/No%20Rounded%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/547093/No%20Rounded%20YouTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSquareCornerStyles() {
        const styleId = 'youtube-square-corners-style';
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            a.ytd-thumbnail, ytd-mini-guide-entry-renderer,
            .ytd-miniplayer #modern-player-container,
            .ytd-miniplayer #modern-card,
            .ytd-miniplayer #player-container,
            .ytd-miniplayer #card,
            ytd-rich-metadata-renderer,
            #thumbnail.ytd-macro-markers-list-item-renderer,
            ytd-multi-page-menu-renderer,
            .YtSearchboxComponentInputBox, button[aria-label="Search"], .ytd-searchbox,
            .sbdd_b, .sbsb_a,
            ytd-menu-popup-renderer[sheets-refresh],
            tp-yt-paper-dialog[modern],
            ytd-engagement-panel-section-list-renderer[modern-panels],
            #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer,
            .ytp-settings-menu.ytp-rounded-menu, .ytp-settings-menu,
            .ytp-ce-video.ytp-ce-large-round, div.ytp-autonav-endscreen-upnext-thumbnail,
            ytd-guide-entry-renderer[active],
            ytd-mini-guide-entry-renderer[guide-refresh],
            yt-interaction.ytd-guide-entry-renderer,
            ytd-play戲list-video-renderer,
            .yt-spec-button-shape-next--icon-leading,
            ytd-thumbnail[size=large]:before,
            #player.ytd-channel-video-player-renderer,
            .ytp-ce-playlist.ytp-ce-large-round,
            .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview,
            .ytp-videowall-still-round-large, .ytp-videowall-still-image,
            .ytd-backstage-image-renderer,
            .yt-img-shadow,
            .image-wrapper.ytd-hero-playlist-thumbnail-renderer,
            .immersive-header-container,
            #container.ytd-playlist-panel-renderer,
            .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--segmented-end,
            tp-yt-paper-toast.yt-notification-action-renderer,
            .yt-spec-button-shape-next--size-m,
            .thumbnail-container.ytd-notification-renderer,
            #video-preview-container.ytd-video-preview,
            .ytp-autonav-endscreen-upnext-thumbnail.rounded-thumbnail,
            ytd-menu-popup-renderer,
            #ytd-player,
            .ytd-c4-tabbed-header-renderer,
            .dropdown-content, .ytd-watch-flexy,
            .player-container.ytd-reel-video-renderer, .metadata-container,
            .thumbnail-container,
            #dismissed.ytd-rich-grid-media,
            .rich-thumbnail.ytd-ghost-grid-renderer,
            .yt-interaction,
            .ShortsLockupViewModelHostThumbnailContainerRounded,
            .YtPlayerStoryboardStoryboardImageWrapper,
            yt-content-preview-image-view-model,
            .page-header-view-model-wiz__page-header-background,
            .yt-sheet-view-model-wiz,
            yt-thumbnail-view-model,
            .yt-spec-avatar-shape--live-ring:after,
            .yt-video-attribute-view-model__hero-section,
            .ytSearchboxComponentInputBox,
            .ytPlayerStoryboardStoryboardImageWrapper,
            .shortsLockupViewModelHostThumbnailContainerRounded,
            #media-container,
            .ytwPivotButtonViewModelHostImage,
            .ytdMiniplayerComponentContent,
            .reel-video-in-sequence-thumbnail.ytd-shorts,
            .ytImageBannerViewModelHost {
                border-radius: unset !important;
                -webkit-border-radius: unset !important;
                -moz-border-radius: unset !important;
            }

            ytd-thumbnail,
            ytd-thumbnail img,
            .ytd-thumbnail,
            .ytd-thumbnail img,
            yt-img-shadow,
            yt-img-shadow img,
            .yt-img-shadow,
            .yt-img-shadow img,
            ytd-video-renderer img,
            ytd-compact-video-renderer img,
            ytd-rich-item-renderer img,
            ytd-playlist-video-renderer img,
            img[src*="ytimg.com"],
            img[src*="googleusercontent.com"],
            img[src*="hqdefault"],
            img[src*="mqdefault"],
            img[src*="sddefault"],
            img[src*="maxresdefault"] {
                border-radius: unset !important;
                -webkit-border-radius: unset !important;
                -moz-border-radius: unset !important;
                clip-path: none !important;
                mask: none !important;
                -webkit-mask: none !important;
            }

            .ytd-rich-item-renderer-highlight {
                background-color: unset !important;
                box-shadow: unset !important;
                border-radius: unset !important;
            }

            #logo.ytd-topbar-logo-renderer:focus:before {
                outline: unset !important;
            }

            .ytp-tooltip.ytp-preview,
            .ytp-tooltip.ytp-preview:not(.ytp-text-detail) .ytp-tooltip-bg,
            .ytp-tooltip-bg {
                border-radius: unset !important;
                -webkit-border-radius: unset !important;
            }

            .ytp-tooltip.ytp-rounded-tooltip.ytp-text-detail.ytp-preview .ytp-tooltip-bg {
                border-top-left-radius: unset !important;
                border-bottom-left-radius: unset !important;
            }

            tp-yt-paper-item.ytd-guide-entry-renderer {
                --paper-item-focused-before-border-radius: unset !important;
            }

            #description.ytd-watch-metadata,
            ytd-rich-metadata-renderer {
                background: transparent !important;
                background-color: transparent !important;
                border-radius: unset !important;
            }

            .yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal,
            .yt-spec-button-shape-next--overlay.yt-spec-button-shape-next--tonal {
                background-color: transparent !important;
            }

            .ytd-app,
            .html5-main-video,
            .html5-video-player,
            .ytp-miniplayer-scrim,
            .yt-image-banner-view-model-wiz,
            video,
            .video-stream {
                border-radius: unset !important;
                -webkit-border-radius: unset !important;
                -moz-border-radius: unset !important;
            }

            .collections-stack-wiz__collection-stack1,
            .collections-stack-wiz__collection-stack2 {
                display: none !important;
            }

            a.ytd-playlist-thumbnail,
            #thumbnail,
            #playlist-thumbnail,
            #thumbnail-container,
            .yt-collection-thumbnail-view-model--has-stacks {
                border-radius: unset !important;
                border-top: unset !important;
            }

            * {
                --yt-img-border-radius: 0px !important;
                --yt-video-border-radius: 0px !important;
                --yt-spec-base-background: transparent !important;
                --paper-item-focused-before-border-radius: unset !important;
            }

            [style*="border-radius"] {
                border-radius: unset !important;
            }
        `;

        const targetElement = document.head || document.documentElement || document.getElementsByTagName('html')[0];
        if (targetElement) {
            targetElement.appendChild(style);
        }
    }

    function applyDirectStyles() {
        const allImages = document.querySelectorAll('img');
        allImages.forEach(img => {
            if (img.src && (img.src.includes('ytimg.com') || img.src.includes('googleusercontent.com'))) {
                img.style.borderRadius = 'unset';
                img.style.webkitBorderRadius = 'unset';
                img.style.mozBorderRadius = 'unset';
                if (img.parentElement) {
                    img.parentElement.style.borderRadius = 'unset';
                }
            }
        });

        const thumbnailElements = document.querySelectorAll(`
            ytd-thumbnail,
            .ytd-thumbnail,
            yt-img-shadow,
            .yt-img-shadow,
            .thumbnail-container,
            yt-thumbnail-view-model
        `);
        thumbnailElements.forEach(element => {
            element.style.borderRadius = 'unset';
            element.style.webkitBorderRadius = 'unset';
            element.style.mozBorderRadius = 'unset';
        });
    }

    function initialize() {
        addSquareCornerStyles();
        applyDirectStyles();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const currentUrl = location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            setTimeout(() => {
                addSquareCornerStyles();
                applyDirectStyles();
            }, 100);
        }
    });

    observer.observe(document.body || document.documentElement, {
        childList: true,
        subtree: true
    });

    setInterval(() => {
        if (!document.getElementById('youtube-square-corners-style')) {
            addSquareCornerStyles();
        }
        applyDirectStyles();
    }, 2000);
})();