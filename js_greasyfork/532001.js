// ==UserScript==
// @name         YouTube Layout Fix
// @namespace    http://tampermonkey.net/
// @version      5.13
// @description  Forces a multi-column grid, hides ads & unwanted shelves, fixes layout bugs on channel pages & search, adjusts text/spacing, and optionally hides Shorts.
// @author       Kalakaua
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532001/YouTube%20Layout%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/532001/YouTube%20Layout%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ADJUSTABLE VALUES (User Prefs) ---

    // === General Grid Layout (Home, Subs, Channel Pages, etc.) ===
    const desiredColumnCount      = 6;      // Number of columns for main content grids
    const gridEdgePadding         = "24px"; // Padding on the left/right edges of the main grids
    const gridItemHorizontalMargin= "6px";  // Space between grid items horizontally
    const gridItemBottomMargin    = "24px"; // Space below each grid item

    // === Grid Items - Text & Spacing ===
    const gridTitleScale          = 1.12;   // Title text size multiplier
    const gridChannelScale        = 0.85;   // Channel name text size multiplier
    const gridMetadataScale       = 1.00;   // Views/Date text size multiplier (scales a rem-based value for consistency)
    const gridChannelMarginTop    = "-1px"; // Space above channel name
    const gridMetaMarginTop       = "-4px"; // Space above views/date line
    const gridBylineMarginBottom  = "5px";  // Space below the channel name line on grid items.

    // === Channel Page Specifics ===
    const channelShelfItemWidth   = 230;    // px - Width of videos in horizontal shelves (like "For You") on channel pages.

    // === Search Results Page (/results) - Layout ===
    const searchThumbnailWidth    = "350px"; // Width of video/playlist thumbnails
    const searchResultsInitialMarginTop  = "16px";  // Space above the very first search result section
    const searchResultsSectionMarginBottom = "0px"; // Space below each section of results (videos, playlists, etc.)
    const searchDescFixedWidth    = "800px"; // Fixed width for description snippets to help align 3-dot menus

    // === Search Results Page - Text Sizes ===
    const searchTitleScale        = 1.4;    // Scale factor for video, playlist, and channel titles
    const searchChannelScale      = 1.20;   // Scale factor for channel names listed under video results
    const searchVideoViewsDateScale = 1.6;  // Base scale for video views/date & playlist metadata
    const searchMetaSnippetScale  = 1.35;   // Scale factor for subsequent playlist metadata rows (video list)
    const searchChannelSubMetaScale = 1.6;  // Scale factor for a channel item's subscriber count and @handle
    const searchPlaylistMetaSizeOffset = 2; // px - Adds extra size to playlist metadata (channel & "View full playlist" link).

    // === Search Results Page - Channel Item Layout ===
    const searchChannelAvatarMaxWidth = "362px"; // Max width for the channel avatar container
    const searchChannelTextMaxWidth = "630px"; // Max width for the channel text container (title, subs, desc)

    // === Watch Page - Below Video Player ===
    const watchOwnerChannelScale  = 1.5;    // Scale factor for the channel name under the video
    const watchTopRowMarginTop    = "-4px"; // Space above the views/date line under the video title
    const watchSubCountMarginTop  = "-3.5px";// Space above the subscriber count

    // === Sidebar (Watch Page Right Sidebar) ===
    const sidebarTitleScale       = 1.05;   // Scale factor for video titles in the sidebar
    const sidebarChannelNameScale = 1.0;    // Scale factor for channel names in the sidebar
    const sidebarViewsDateScale   = 1.0;    // Scale factor for views/date in the sidebar
    const sidebarTitleMarginBottom= "6px";  // Space below sidebar video titles
    const sidebarBadgeScale       = 0.85;   // Scale factor for badges (e.g., "New")
    const sidebarBadgeMarginTop   = "2px";  // Space above badges
    const sidebarBadgeMarginBottom= "0px";  // Space below badges

    // === Comment Section (Watch Page) ===
    const commentTextScale        = 1.15;   // Scale factor for main comment and reply text
    const commentMetaScale        = 1.1;    // Scale factor for author/timestamp metadata

    // --- Technical Values ---
    const minimalPxReduction      = "0.01px"; // Minimal reduction for calc() robustness in grid width calculation
    const channelShelfItemHeight  = Math.round((channelShelfItemWidth / 16) * 9); // Auto-calculate 16:9 height

    // --- END OF ADJUSTABLE VALUES ---


    let css = `
        :root {
           --gm-grid-title-size: ${gridTitleScale}em;
           --gm-grid-channel-size: ${gridChannelScale}em;
           --gm-grid-metadata-size: ${gridMetadataScale}em; /* Kept for legacy playlist grid */
           --gm-grid-metadata-final-size: calc(1.3rem * ${gridMetadataScale});
           --gm-watch-owner-channel-size: ${watchOwnerChannelScale}em;
           --gm-watch-title-size: 1.5rem;
           --gm-sidebar-title-size: ${sidebarTitleScale}em;
           --gm-sidebar-channel-size: ${sidebarChannelNameScale}em;
           --gm-sidebar-viewsdate-size: ${sidebarViewsDateScale}em;
           --gm-sidebar-badge-size: ${sidebarBadgeScale}em;
           --gm-search-title-scale: ${searchTitleScale};
           --gm-search-channel-scale: ${searchChannelScale};
           --gm-search-title-size: calc(1.0rem * var(--gm-search-title-scale));
           --gm-search-channel-size: calc(0.8em * var(--gm-search-channel-scale));
           --gm-search-metasnippet-size: calc(0.8em * ${searchMetaSnippetScale});
           --gm-search-video-views-date-size: calc(0.78rem * ${searchVideoViewsDateScale});
           --gm-search-channel-submeta-size: calc(0.8rem * ${searchChannelSubMetaScale});
           --gm-comment-text-final-size: calc(1rem * ${commentTextScale});
           --gm-comment-meta-final-size: calc(0.8rem * ${commentMetaScale});
           --gm-search-playlist-meta-final-size: calc(var(--gm-search-video-views-date-size) + ${searchPlaylistMetaSizeOffset}px);
        }

        /* ========================================================== */
        /* === GLOBAL FIXES & STYLES === */
        /* ========================================================== */

        /* --- Hide Verified & Artist Badges --- */
        ytd-badge-supported-renderer:has(.badge.badge-style-type-verified),
        ytd-badge-supported-renderer:has(.badge.badge-style-type-verified-artist),
        ytd-author-comment-badge-renderer yt-icon,
        .yt-core-attributed-string__image-element:not(img) {
            display: none !important;
        }

        /* --- UI Annoyance Fixes (Scrollbars, Buttons, Header) --- */
        ytd-app {
            overflow-x: hidden !important;
        }
        html.fullscreen,
        html.fullscreen body {
            overflow-x: hidden !important;
        }
        .ytp-fullscreen-button::after,
        #contentContainer::after,
        .ytp-play-button::before {
            content: none !important;
        }
        ytd-app:has(ytd-browse[page-subtype="home"]) #frosted-glass.with-chipbar {
            height: 56px !important;
        }

        /* ========================================================== */
        /* === MAIN GRID LAYOUT & STYLING === */
        /* ========================================================== */

        /* --- Hide Unwanted Grid Items & Shelves --- */
        #masthead-ad,
        ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
        ytd-rich-section-renderer {
            display: none !important;
        }

        /* --- Grid Container --- */
        #contents.ytd-rich-grid-renderer {
            padding-left: ${gridEdgePadding} !important;
            padding-right: ${gridEdgePadding} !important;
            box-sizing: border-box !important;
            width: 100% !important;
        }
        ytd-browse[page-subtype="channels"] #contents.ytd-rich-grid-renderer,
        ytd-browse[page-subtype="channels"] ytd-item-section-renderer #contents > ytd-rich-grid-renderer {
            padding-left: ${gridEdgePadding} !important;
            padding-right: ${gridEdgePadding} !important;
            box-sizing: border-box !important;
            width: 100% !important;
        }

        /* --- Rule Set 2: Playlist Feed & Other Grids (via :not()) --- */
        #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer:not( ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer, ytd-browse[page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer, ytd-browse[page-subtype="channels"] #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer ) {
            margin-left: ${gridItemHorizontalMargin} !important;
            margin-right: ${gridItemHorizontalMargin} !important;
            margin-bottom: ${gridItemBottomMargin} !important;
            max-width: calc(100% / ${desiredColumnCount} - ${gridItemHorizontalMargin} * 2 - ${minimalPxReduction}) !important;
        }
        #contents.ytd-rich-grid-renderer ytd-rich-item-renderer:not(...) .yt-lockup-metadata-view-model-wiz__title {
            font-size: var(--gm-grid-title-size) !important;
            line-height: 1.2em !important;
            max-height: 2.4em !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            margin-bottom: 1px !important;
        }
        #contents.ytd-rich-grid-renderer ytd-rich-item-renderer:not(...) .yt-content-metadata-view-model-wiz__metadata-text {
            font-size: var(--gm-grid-metadata-size) !important;
            line-height: 1.3em !important;
            display: inline !important;
        }
        #contents.ytd-rich-grid-renderer ytd-rich-item-renderer:not(...) .yt-lockup-metadata-view-model-wiz__metadata {
            margin-top: ${gridMetaMarginTop} !important;
            line-height: 1.3em;
        }
        #contents.ytd-rich-grid-renderer ytd-rich-item-renderer:not(...) a.yt-core-attributed-string__link--call-to-action-color {
            font-size: 0.9em !important;
            margin-top: 2px !important;
        }

        /* --- Rule Set 1A: Old Structure (Channels, etc.) --- */
        ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer,
        ytd-browse[page-subtype="subscriptions"] #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer,
        ytd-browse[page-subtype="channels"] #contents.ytd-rich-grid-renderer > ytd-rich-item-renderer {
            margin-left: ${gridItemHorizontalMargin} !important;
            margin-right: ${gridItemHorizontalMargin} !important;
            margin-bottom: ${gridItemBottomMargin} !important;
            max-width: calc(100% / ${desiredColumnCount} - ${gridItemHorizontalMargin} * 2 - ${minimalPxReduction}) !important;
            border: none !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer #video-title.ytd-rich-grid-media,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer #video-title.ytd-rich-grid-media,
        ytd-browse[page-subtype="channels"] ytd-rich-item-renderer #video-title.ytd-rich-grid-media {
            font-size: var(--gm-grid-title-size) !important;
            line-height: 1.2em !important;
            max-height: 2.4em !important;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 1px !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer #byline-container,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer #byline-container,
        ytd-browse[page-subtype="channels"] ytd-rich-item-renderer #byline-container {
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: flex !important;
            align-items: center !important;
            margin-top: ${gridChannelMarginTop} !important;
            line-height: 1.2em !important;
            gap: 0 !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer ytd-channel-name,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer ytd-channel-name,
        ytd-browse[page-subtype="channels"] ytd-rich-item-renderer ytd-channel-name {
            font-size: var(--gm-grid-channel-size) !important;
            line-height: 1.25em !important;
            display: inline-block !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            flex-grow: 1 !important;
            min-width: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            vertical-align: baseline !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer #metadata-line,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer #metadata-line,
        ytd-browse[page-subtype="channels"] ytd-rich-item-renderer #metadata-line {
            line-height: 1.3em !important;
            margin-top: ${gridMetaMarginTop} !important;
            display: block !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer #metadata-line > span,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer #metadata-line > span,
        ytd-browse[page-subtype="channels"] ytd-rich-item-renderer #metadata-line > span {
            font-size: var(--gm-grid-metadata-final-size) !important;
            line-height: 1.2em !important;
            display: inline !important;
            vertical-align: baseline !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer #metadata-line > span:first-of-type,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer #metadata-line > span:first-of-type,
        ytd-browse[page-subtype="channels"] ytd-rich-item-renderer #metadata-line > span:first-of-type {
            margin-right: 0.5em !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer #metadata-line > span:first-of-type::after,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer #metadata-line > span:first-of-type::after,
        ytd-browse[page-subtype="channels"] ytd-rich-item-renderer #metadata-line > span:first-of-type::after {
            content: none !important;
        }

        /* --- Rule Set 1B: LATEST Structure (Home & Subs pages) --- */
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer .yt-lockup-metadata-view-model__title,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer .yt-lockup-metadata-view-model__title {
            font-size: var(--gm-grid-title-size) !important;
            line-height: 1.2em !important;
            max-height: 2.4em !important;
            -webkit-line-clamp: 2 !important;
            margin-bottom: 1px !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer .yt-lockup-metadata-view-model__metadata,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer .yt-lockup-metadata-view-model__metadata {
             margin-top: ${gridChannelMarginTop} !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer .yt-content-metadata-view-model__metadata-row:first-of-type .yt-core-attributed-string > span,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer .yt-content-metadata-view-model__metadata-row:first-of-type .yt-core-attributed-string > span {
             font-size: var(--gm-grid-channel-size) !important;
             line-height: 1.25em !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer .yt-content-metadata-view-model__metadata-row:last-of-type .yt-core-attributed-string,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer .yt-content-metadata-view-model__metadata-row:last-of-type .yt-core-attributed-string {
             font-size: var(--gm-grid-metadata-final-size) !important;
             line-height: 1.2em !important;
             display: inline !important;
             vertical-align: baseline !important;
        }
        ytd-browse[page-subtype="home"] ytd-rich-item-renderer .yt-content-metadata-view-model__metadata-row,
        ytd-browse[page-subtype="subscriptions"] ytd-rich-item-renderer .yt-content-metadata-view-model__metadata-row {
            margin-top: 0 !important;
            margin-bottom: 0 !important;
        }

        /* ========================================================== */
        /* === CHANNEL PAGE SPECIFIC STYLES === */
        /* ========================================================== */

        /* --- Channel Page - Main "Videos" Tab Grid Sizing --- */
        ytd-browse[page-subtype="channels"] ytd-rich-grid-renderer > #contents > ytd-grid-video-renderer {
            max-width: calc(100% / ${desiredColumnCount} - ${gridItemHorizontalMargin} * 2 - ${minimalPxReduction}) !important;
        }

        /* --- Channel Page - Universal Video Styles (Grid & Shelves) --- */
        ytd-browse[page-subtype="channels"] ytd-grid-video-renderer #video-title {
            font-size: var(--gm-grid-title-size) !important;
            line-height: 1.2em !important;
            max-height: 2.4em !important;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-bottom: 1px !important;
        }
        ytd-browse[page-subtype="channels"] ytd-grid-video-renderer #metadata-line {
            line-height: 1.3em !important;
            margin-top: ${gridMetaMarginTop} !important;
            display: block !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        ytd-browse[page-subtype="channels"] ytd-grid-video-renderer #metadata-line > span {
            font-size: var(--gm-grid-metadata-size) !important;
            line-height: 1.2em !important;
            display: inline !important;
            vertical-align: baseline !important;
        }
        ytd-browse[page-subtype="channels"] ytd-grid-video-renderer #byline-container {
            margin-bottom: ${gridBylineMarginBottom} !important;
        }

        /* --- Channel Page - Horizontal Video Shelves --- */
        ytd-shelf-renderer:not(:has(ytd-thumbnail[size="large"])) yt-horizontal-list-renderer ytd-grid-video-renderer {
             margin: 0 ${gridItemHorizontalMargin} !important;
        }
        ytd-shelf-renderer ytd-grid-video-renderer:has(ytd-thumbnail[size="large"]) {
            width: ${channelShelfItemWidth}px !important;
            margin: 0 ${gridItemHorizontalMargin} !important;
        }
        ytd-shelf-renderer ytd-grid-video-renderer:has(ytd-thumbnail[size="large"]) ytd-thumbnail {
            width: 100% !important;
            height: ${channelShelfItemHeight}px !important;
        }


        /* ========================================================== */
        /* === SEARCH RESULTS PAGE (/results) === */
        /* ========================================================== */

        /* --- General Layout & Spacing --- */
        ytd-search-header-renderer[has-chip-bar] {
            margin-bottom: 16px !important;
        }

        ytd-search ytd-item-section-renderer {
            margin-bottom: ${searchResultsSectionMarginBottom} !important;
            margin-top: 0 !important;
        }


        /* --- Video Items --- */
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] {
            display: flex !important;
            margin-bottom: 0 !important;
            align-items: flex-start !important;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] #dismissible ytd-thumbnail.ytd-video-renderer {
            width: ${searchThumbnailWidth} !important;
            min-width: ${searchThumbnailWidth} !important;
            max-width: ${searchThumbnailWidth} !important;
            flex-basis: ${searchThumbnailWidth} !important;
            flex-shrink: 0 !important;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] #dismissible div.text-wrapper.ytd-video-renderer {
            margin-left: 12px !important;
            flex: 1 !important;
            min-width: 0;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] a#video-title.ytd-video-renderer yt-formatted-string {
            font-size: var(--gm-search-title-size) !important;
            line-height: 1.25em !important;
            max-height: 2.5em !important;
            -webkit-line-clamp: 2 !important;
            display: -webkit-box !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            margin-bottom: 3px !important;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] #metadata-line.ytd-video-meta-block span.inline-metadata-item {
            font-size: var(--gm-search-video-views-date-size) !important;
            line-height: 1.3em !important;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] #channel-name.ytd-video-renderer yt-formatted-string > a,
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] #channel-name.ytd-video-renderer yt-formatted-string {
            font-size: var(--gm-search-channel-size) !important;
            line-height:1.3em !important;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] #channel-thumbnail.ytd-video-renderer {
            width: 20px !important;
            height: 20px !important;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] .metadata-snippet-container.ytd-video-renderer yt-formatted-string.metadata-snippet-text,
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] .metadata-snippet-container-one-line.ytd-video-renderer yt-formatted-string.metadata-snippet-text {
            font-size: 1.2rem !important;
            line-height: 1.3em !important;
            max-height: 2.6em !important;
            overflow: hidden !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] .metadata-snippet-container.ytd-video-renderer,
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] .metadata-snippet-container-one-line.ytd-video-renderer {
            width: ${searchDescFixedWidth} !important;
            min-width: ${searchDescFixedWidth} !important;
            max-width: ${searchDescFixedWidth} !important;
            display: block !important;
            margin-top: 4px !important;
        }
        ytd-search ytd-item-section-renderer ytd-video-renderer[is-search] #expandable-metadata.ytd-video-renderer {
            display: none !important;
        }

        /* --- Playlist Items (in Search) --- */
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-lockup-view-model--horizontal {
            display: flex !important;
            align-items: flex-start !important;
            margin-bottom: 0 !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model a.yt-lockup-view-model__content-image {
            width: ${searchThumbnailWidth} !important;
            min-width: ${searchThumbnailWidth} !important;
            max-width: ${searchThumbnailWidth} !important;
            flex-basis: ${searchThumbnailWidth} !important;
            flex-shrink: 0 !important;
            margin-right: 12px !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-lockup-view-model__metadata {
            position: relative !important;
            width: ${searchDescFixedWidth} !important;
            min-width: ${searchDescFixedWidth} !important;
            max-width: ${searchDescFixedWidth} !important;
            flex-shrink: 0;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-lockup-metadata-view-model {
            width: 100%;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-lockup-metadata-view-model__text-container {
            width: 100% !important;
            padding-right: 44px !important;
            box-sizing: border-box !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-lockup-metadata-view-model__menu-button {
            position: absolute !important;
            top: -11px !important;
            right: 0px !important;
            width: 40px !important;
            height: 40px !important;
            z-index: 5 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-lockup-metadata-view-model__menu-button button-view-model > button.yt-spec-button-shape-next {
            width: 40px !important;
            height: 40px !important;
            padding: 8px !important;
            box-sizing: border-box !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-lockup-metadata-view-model__menu-button button-view-model > button.yt-spec-button-shape-next .yt-spec-button-shape-next__icon {
            margin: 0 !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-lockup-metadata-view-model__title {
            font-size: var(--gm-search-title-size) !important;
            line-height: 1.25em !important;
            max-height: 2.5em !important;
            -webkit-line-clamp: 2 !important;
            display: -webkit-box !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            margin-bottom: 4px !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-content-metadata-view-model > .yt-content-metadata-view-model__metadata-row:not(:first-of-type) .yt-content-metadata-view-model__metadata-text {
            font-size: var(--gm-search-metasnippet-size) !important;
            line-height: 1.3em !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-content-metadata-view-model > .yt-content-metadata-view-model__metadata-row:first-of-type .yt-content-metadata-view-model__metadata-text,
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-content-metadata-view-model > .yt-content-metadata-view-model__metadata-row:last-of-type .yt-content-metadata-view-model__metadata-text {
            font-size: var(--gm-search-playlist-meta-final-size) !important;
            line-height: 1.3em !important;
        }
        ytd-search ytd-item-section-renderer yt-lockup-view-model .yt-content-metadata-view-model__metadata-row {
            margin-bottom: 2px;
        }

        /* --- Channel Items (in Search) --- */
        ytd-search ytd-item-section-renderer ytd-channel-renderer {
            display: block;
            margin-bottom: 0 !important;
            width: 100%;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #content-section {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #avatar-section {
            max-width: ${searchChannelAvatarMaxWidth} !important;
            min-width: 240px !important;
            margin-right: 16px !important;
            flex-shrink: 0 !important;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer[use-bigger-thumbs][bigger-thumb-style=BIG] #avatar-section,
        ytd-search ytd-item-section-renderer ytd-channel-renderer[use-bigger-thumbs] #avatar-section {
            max-width: ${searchChannelAvatarMaxWidth} !important;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #info-section {
            flex-grow: 1 !important;
            min-width: 0;
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-start !important;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #info-section a#main-link {
            max-width: ${searchChannelTextMaxWidth} !important;
            flex-grow: 1;
            min-width: 0;
            display: block;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #buttons {
            display: flex !important;
            align-items: center !important;
            flex-shrink: 0 !important;
            margin-left: 16px !important;
            padding-right: 72px !important;
            box-sizing: border-box !important;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #channel-title yt-formatted-string {
            font-size: var(--gm-search-title-size) !important;
            line-height: 1.3em !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #metadata yt-formatted-string,
        ytd-search ytd-item-section-renderer ytd-channel-renderer #metadata span {
            font-size: var(--gm-search-channel-submeta-size) !important;
            line-height: 1.4em !important;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #metadata {
            margin-top: 2px !important;
        }
        ytd-search ytd-item-section-renderer ytd-channel-renderer #description {
            font-size: 1.2rem !important;
            line-height: 1.3em !important;
            -webkit-line-clamp: 2 !important;
            display: -webkit-box !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            margin-top: 4px !important;
        }


        /* ========================================================== */
        /* === WATCH PAGE (/watch) === */
        /* ========================================================== */

        /* --- Below Player --- */
        .title.ytd-video-primary-info-renderer h1.ytd-video-primary-info-renderer {
            font-size: var(--gm-watch-title-size) !important;
            line-height: 1.2em !important;
        }
        #top-row.ytd-watch-metadata {
            margin-top: ${watchTopRowMarginTop} !important;
        }
        ytd-video-owner-renderer ytd-channel-name {
            font-size: var(--gm-watch-owner-channel-size) !important;
            line-height: 1.05em !important;
            margin: 0 !important;
            padding: 0 !important;
            display: block !important;
        }
        #owner-sub-count.ytd-video-owner-renderer {
            margin-top: ${watchSubCountMarginTop} !important;
            margin-bottom: 0 !important;
        }
        #description-inner #description .content.ytd-video-secondary-info-renderer,
        .ytd-expander.ytd-video-secondary-info-renderer {
            font-size: 0.8em !important;
            line-height: 1.35em !important;
        }
        #info-text.ytd-video-primary-info-renderer {
            font-size: 0.8em !important;
        }

        /* --- Sidebar --- */
        ytd-compact-video-renderer h3.ytd-compact-video-renderer {
            margin-bottom: ${sidebarTitleMarginBottom} !important;
            margin-top: 0 !important;
        }
        #video-title.ytd-compact-video-renderer {
            font-size: var(--gm-sidebar-title-size) !important;
            line-height: 1.3em !important;
            max-height: 2.6em !important;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        ytd-compact-video-renderer ytd-channel-name {
            font-size: var(--gm-sidebar-channel-size) !important;
            line-height: 1.35em !important;
            margin-bottom: 1px !important;
        }
        ytd-compact-video-renderer #metadata-line span.inline-metadata-item {
            font-size: var(--gm-sidebar-viewsdate-size) !important;
            line-height: 1.45em !important;
        }
        ytd-compact-video-renderer ytd-badge-supported-renderer.badges {
            margin-top: ${sidebarBadgeMarginTop} !important;
            margin-bottom: ${sidebarBadgeMarginBottom} !important;
            font-size: var(--gm-sidebar-badge-size) !important;
            line-height: 1.2 !important;
        }

        /* --- Comment Section --- */
        ytd-comment-replies-renderer ytd-comment-view-model[is-reply] > #main > #expander {
            font-size: 1rem !important;
        }
        ytd-comment-view-model #expander > #content > yt-attributed-string#content-text {
            font-size: var(--gm-comment-text-final-size) !important;
            line-height: 1.5em !important;
        }
        ytd-comments ytd-comment-thread-renderer > ytd-comment-view-model:not([is-reply]) #header-author #author-text,
        ytd-comments ytd-comment-thread-renderer > ytd-comment-view-model:not([is-reply]) #header-author .published-time-text.ytd-comment-view-model a {
            font-size: var(--gm-comment-meta-final-size) !important;
            line-height: 1.4em !important;
        }
        ytd-comments ytd-comment-replies-renderer ytd-comment-view-model[is-reply] #header-author #author-text,
        ytd-comments ytd-comment-replies-renderer ytd-comment-view-model[is-reply] #header-author .published-time-text.ytd-comment-view-model a {
            font-size: calc(var(--gm-comment-meta-final-size) + 3px) !important;
            line-height: 1.4em !important;
        }
        #toolbar.ytd-comment-action-buttons-renderer {
            font-size: var(--gm-comment-meta-final-size) !important;
        }
        #header-author #author-text.ytd-comment-renderer {
            color: #aaa !important;
        }
    `;

    // ===================================================================
    // === OPTIONAL FEATURE: HIDE UNWANTED SHELVES & SHORTS CONTENT
    // ===================================================================
    const hideUnwantedContent = true;

    if (hideUnwantedContent) {
        css += `
            /* Hide the main Shorts shelf on Home/Channel pages */
            ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts]) {
                display: none !important;
            }
            /* Hide various unrelated shelves in Search Results */
            ytd-search ytd-shelf-renderer,
            ytd-search ytd-horizontal-list-renderer,
            ytd-search ytd-reel-shelf-renderer,
            ytd-search grid-shelf-view-model,
            ytd-search ytd-horizontal-card-list-renderer {
                display: none !important;
            }
            /* Hide individual video items in search that are actually Shorts */
            ytd-search ytd-video-renderer[is-search]:has(a#thumbnail[href^="/shorts/"]) {
                display: none !important;
            }
            /* Hide the "Shorts" link in the main sidebar guide */
            ytd-guide-entry-renderer:has(a#endpoint[title="Shorts"]) {
                display: none !important;
            }
        `;
    }
    // ===================================================================

    // ===================================================================
    // === OPTIONAL FEATURE: HIDE "Shorts" FILTER CHIP IN SEARCH
    // ===================================================================
    const hideSearchShortsChip = true;

    if (hideSearchShortsChip) {
        css += `
            /* Find the chip renderer that contains a "Shorts" title */
            yt-chip-cloud-chip-renderer:has(yt-formatted-string#text[title="Shorts"]) {
                display: none !important;
            }
        `;
    }
    // ===================================================================


    // ===================================================================
    // --- SEARCH RESULTS REMOVAL OF EMPTY CONTAINERS ---
    // ===================================================================

    (function cleanupSearchAds() {
        const itemSectionSelector = 'ytd-item-section-renderer';
        const adSlotSelector = 'ytd-ad-slot-renderer';
        const videoSelector = 'ytd-video-renderer';

        function performCleanup() {
            const allSections = document.querySelectorAll(itemSectionSelector);
            if (!allSections.length) return;

            allSections.forEach(section => {
                const containsAd = section.querySelector(adSlotSelector);
                const containsVideo = section.querySelector(videoSelector);
                if (containsAd && !containsVideo) {
                    section.remove();
                }
            });
        }

        const observer = new MutationObserver(() => {
            if (window.location.pathname === '/results') {
                performCleanup();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        if (window.location.pathname === '/results') {
            performCleanup(); // Initial run
        }
        console.log('YouTube Search Ad Section Cleanup: Active');
    })();
    // ===================================================================

    // ===================================================================
    // === DELETE LEFTOVER "LOAD MORE" SPINNERS IN SEARCH RESULTS
    // ===================================================================

    const continuationSelector = 'ytd-continuation-item-renderer';
    const itemSectionSelector = 'ytd-item-section-renderer';

    function cleanupStuckSpinners() {
        const allSpinners = document.querySelectorAll(continuationSelector);
        if (allSpinners.length === 0) return;

        allSpinners.forEach(spinner => {
            const nextElement = spinner.nextElementSibling;

            if (nextElement && nextElement.tagName.toLowerCase() === 'ytd-item-section-renderer') {
                spinner.remove();
            }
        });
    }

    const spinnerObserver = new MutationObserver(() => {
        if (window.location.pathname === '/results') {
            cleanupStuckSpinners();
        }
    });

    spinnerObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Run once on initial load, just in case.
    if (window.location.pathname === '/results') {
        cleanupStuckSpinners();
    }


    // ===================================================================

    if (typeof GM_addStyle === 'function') {
        const scriptVersion = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : 'N/A';
        GM_addStyle(css);
        console.log(`YouTube Layout Script: v${scriptVersion} Active (${desiredColumnCount} Cols)`);
    } else {
        console.error("YouTube Layout Script: GM_addStyle is not defined.");
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

})();