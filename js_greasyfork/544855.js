// ==UserScript==
// @name         YTMusictoSpotify
// @namespace    https://greasyfork.org/en/users/1500575-just-j
// @version      2025-12-24
// @description  Transform YTMusic into a spotify-like interface!
// @author       Just J
// @match        https://music.youtube.com/*
// @icon         https://music.youtube.com/img/favicon_144.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544855/YTMusictoSpotify.user.js
// @updateURL https://update.greasyfork.org/scripts/544855/YTMusictoSpotify.meta.js
// ==/UserScript==
const css = `
@font-face {
  font-family: 'SpotifyMixUI';
  src: url('https://encore.scdn.co/fonts/SpotifyMixUI-Regular-cc3b1de388efa4cbca6c75cebc24585e.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SpotifyMixUI';
  src: url('https://encore.scdn.co/fonts/SpotifyMixUI-Bold-4264b799009b1db5c491778b1bc8e5b7.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'SpotifyMixUITitle';
  src: url('https://encore.scdn.co/fonts/SpotifyMixUITitleVariable-8769ccfde3379b7ebcadd9529b49d0cc.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
html {
    --fallback-fonts: Helvetica Neue, helvetica, arial, Hiragino Kaku Gothic ProN, Meiryo, MS Gothic;
    font-family: SpotifyMixUI,CircularSp-Arab,CircularSp-Hebr,CircularSp-Cyrl,CircularSp-Grek,CircularSp-Deva,var(--fallback-fonts,sans-serif)!important;
}
:root {
    --encore-body-font-stack: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    --encore-title-font-stack: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    --encore-variable-font-stack: SpotifyMixUITitleVariable, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
.logo.ytmusic-logo {
    height: 35px;
    object-position: left;
    object-fit: cover;
    width: 38px;
}
yt-icon-button#guide-button {
    display: none;
}
tp-yt-paper-item.style-scope.ytmusic-guide-entry-renderer.home {
    padding: 0 17px;
    width: 16px;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    border-radius: 50%;
    justify-content: center;
    -ms-flex-negative: 0;
    background-color: #1f1f1f;
    color: #b3b3b3;
    flex-shrink: 0;
}
yt-icon.ytmusic-guide-entry-renderer {
    margin: 0;
}
.guide-icon.style-scope.ytmusic-guide-entry-renderer .yt-icon-shape.style-scope.yt-icon.yt-spec-icon-shape div svg {
    left: -7px;
    position: absolute;
    width: 200% !important;
    color: white;
}
ytmusic-nav-bar[is-bauhaus-sidenav-enabled] .center-content.ytmusic-nav-bar {
    justify-content: center;
    width: 100%;
    flex: 1;
    margin-left: 0;
    padding-left: 30px;
}
ytmusic-logo.style-scope.ytmusic-nav-bar {
    padding-bottom: 8px;
    z-index: 1;
    margin-left: 27px;
    margin-right: 20px !important;
}
ytmusic-nav-bar[is-bauhaus-sidenav-enabled] ytmusic-search-box.ytmusic-nav-bar {
    margin-left: 9px;
}
ytmusic-search-box[is-bauhaus-sidenav-enabled]:not([opened]):not([has-query]) .search-box.ytmusic-search-box, ytmusic-search-box[is-bauhaus-sidenav-enabled] .search-box.ytmusic-search-box {
    border: none;
    background: #1f1f1f;
    border-radius: 500px;
    -webkit-box-shadow: none;
    box-shadow: none;
    cursor: pointer;
    -webkit-transition: all .22s ease-in;
    transition: all .22s ease-in;
    -webkit-padding-end: 96px !important;
    padding-inline-end: 96px !important;
}
tp-yt-paper-item.style-scope.ytmusic-guide-entry-renderer.home {
    -webkit-transition: all .22s ease-in;
    transition: all .22s ease-in;
}
.search-box.ytmusic-search-box {
    height: 48px;
}
ytmusic-app[is-bauhaus-sidenav-enabled] #guide-wrapper.ytmusic-app {
    border: none;
    background: none;
}
#sections.ytmusic-guide-renderer {
    width: 325px;
    margin-left: 10px;
    border-radius: 8px;
    background: #121212;
}
ytmusic-guide-renderer {
    height: calc(99vh - var(--ytmusic-nav-bar-height));
    padding-top: 0;
}
ytmusic-app[is-bauhaus-sidenav-enabled]:not([guide-collapsed]) {
    --ytmusic-guide-width: 220px;
}
ytmusic-browse-response[has-background]:not([disable-gradient]) .background-gradient.ytmusic-browse-response {
    background: black !important;
}
ytmusic-nav-bar[is-bauhaus-sidenav-enabled] .right-content.ytmusic-nav-bar {
    right: 30px;
}
ytmusic-chip-cloud-chip-renderer.ytmusic-chip-cloud-renderer {
    padding: 10px 0 0;
}
ytmusic-chip-cloud-chip-renderer[enable-bauhaus-style][chip-style=STYLE_LARGE_TRANSLUCENT_AND_SELECTED_WHITE] a.ytmusic-chip-cloud-chip-renderer, .gradient-box.style-scope.ytmusic-chip-cloud-chip-renderer {
    border-radius: 9999px!important;
}
.title.ytmusic-carousel-shelf-basic-header-renderer {
    font-family: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    font-size: 2.5rem;
}
.title.ytmusic-two-row-item-renderer, .subtitle.ytmusic-two-row-item-renderer, .third-title.ytmusic-two-row-item-renderer {
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    font-size: 1.5rem;
}
#contents.ytmusic-section-list-renderer:not(:has(ytmusic-description-shelf-renderer[is-track-lyrics-page])) {
    margin-right: 10px;
    min-height: 100vh;
    background-image: linear-gradient(rgba(0, 0, 0, 0.6) 0, #121212 100%), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=);
    background-color: rgb(83, 83, 83);
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    border-radius: 8px;
    margin-left: 345px;
}
.style-scope.ytmusic-browse-response:has(div#header) #contents.ytmusic-section-list-renderer {
    padding-top: 70px;
}
div#primary ytmusic-section-list-renderer div#contents.ytmusic-section-list-renderer {
    min-height: fit-content;
    padding-top: 0 !important;
}
div#secondary ytmusic-section-list-renderer div#contents.ytmusic-section-list-renderer {
    padding-top: 0px!important;
    width: 168%;
}
#content-wrapper.ytmusic-browse-response {
    margin-left: 0;
}
#contents.ytmusic-section-list-renderer>ytmusic-carousel-shelf-renderer.ytmusic-section-list-renderer:not(:last-child), #contents.ytmusic-section-list-renderer>ytmusic-immersive-carousel-shelf-renderer.ytmusic-section-list-renderer:not(:last-child) {
    margin-bottom: 0;
}
.header-group.ytmusic-carousel-shelf-renderer {
    padding: 0 0 12px 0;
}
#contents.ytmusic-section-list-renderer>*.ytmusic-section-list-renderer:not(.fullbleed) {
    margin-bottom: 20px;
}
ytmusic-guide-entry-renderer:not([is-primary]) .title.ytmusic-guide-entry-renderer {
    font-size: 1.6rem;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif) !important;
}
ytmusic-guide-entry-renderer:not([is-primary]) .subtitle.ytmusic-guide-entry-renderer {
    font-size: 1.3rem;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif) !important;
}
input#input {
    font-size: 1.6rem;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif) !important;
}
ytmusic-search-box[is-bauhaus-sidenav-enabled] input.ytmusic-search-box {
    color: #b3b3b3;
    padding: 0;
}
ytmusic-player-bar[is-cairo-voting-animation-enabled] .right-controls.ytmusic-player-bar {
    top: 25px;
    position: absolute;
    width: fit-content!important;
    z-index: 1
}
.left-controls.style-scope.ytmusic-player-bar {
    width: 650px;
    position: absolute;
    padding-left: 15px;
    padding-top: 20px;
    z-index: 2;
}
ytmusic-player-bar[is-cairo-voting-animation-enabled] .middle-controls.ytmusic-player-bar {
    z-index: 1;
    width: 100%!important;
    margin-bottom: 15px
}
#progress-bar.ytmusic-player-bar, #progress-bar.ytmusic-player-bar:hover, #progress-bar.ytmusic-player-bar[focused] {
    z-index: 9;
    left: 35%;
    top: 70px;
    width: 30%;
}
ytmusic-app-layout>[slot=player-bar], #player-bar-background.ytmusic-app-layout {
    height: 90px;
}
ytmusic-player-bar {
    background: black;
}
#progress-bar.ytmusic-player-bar {
    --paper-slider-container-color: #4d4d4d;
    --paper-slider-active-color: white;
}
#progress-bar.ytmusic-player-bar[focused], ytmusic-player-bar:hover #progress-bar.ytmusic-player-bar {
    --paper-slider-knob-color: white;
    --paper-slider-knob-start-color: white;
    --paper-slider-knob-start-border-color: white;
}
ytmusic-two-column-browse-results-renderer[is-album-detail-page], ytmusic-two-column-browse-results-renderer[is-playlist-detail-page], ytmusic-two-column-browse-results-renderer[page-type=MUSIC_PAGE_TYPE_PODCAST_SHOW_DETAIL_PAGE] {
    flex-direction: column;
    margin: 0;
}
ytmusic-two-column-browse-results-renderer[page-type=MUSIC_PAGE_TYPE_PODCAST_SHOW_DETAIL_PAGE], ytmusic-two-column-browse-results-renderer[is-album-detail-page] #primary.ytmusic-two-column-browse-results-renderer, ytmusic-two-column-browse-results-renderer[is-playlist-detail-page] #primary.ytmusic-two-column-browse-results-renderer {
    top: 5px;
    position: relative!important;
}
ytmusic-two-column-browse-results-renderer #primary.ytmusic-two-column-browse-results-renderer {
    --ytmusic-content-width: 1510px;
}
.thumbnail.ytmusic-responsive-header-renderer {
    margin-top: 0!important;
    position: absolute;
    width: 264px;
}
#contents.ytmusic-section-list-renderer>*.ytmusic-section-list-renderer:not(.fullbleed) {
    margin-top: 30px;
    margin-left: 20px;
}
ytmusic-two-column-browse-results-renderer div#secondary ytmusic-section-list-renderer div#contents.ytmusic-section-list-renderer {
    padding-top: 380px !important;
}
.facepile-container.ytmusic-responsive-header-renderer {
    margin-top: 0;
}
yt-formatted-string.title.style-scope.ytmusic-responsive-header-renderer {
    -webkit-line-clamp: 1;
    padding-left: 300px;
    text-align: left;
    font-weight: 800;
    font-size: 10rem;
    font-family: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
ytmusic-responsive-header-renderer[has-facepile] .facepile-container.ytmusic-responsive-header-renderer {
    justify-content: left;
    margin-left: 300px;
    margin-top: 235px;
}
.subtitle-wrapper.ytmusic-responsive-header-renderer, .second-subtitle-container.ytmusic-responsive-header-renderer {
    justify-content: left;
    padding-left: 300px;
}
ytmusic-responsive-header-renderer[is-playlist-detail-page] .header-description.ytmusic-responsive-header-renderer:not(:empty), ytmusic-responsive-header-renderer[is-album-detail-page] .header-description.ytmusic-responsive-header-renderer:not(:empty) {
    margin-top: 40px;
    justify-content: left;
    padding-left: 300px;
}
#chips.ytmusic-chip-cloud-renderer {
    position: absolute;
    padding-left: 170px;
    left: 200px;
}
ytmusic-two-column-browse-results-renderer .description.ytmusic-two-column-browse-results-renderer {
    margin-top: 0;
}
.thumbnail-edit-button.ytmusic-responsive-header-renderer {
    bottom: -48px;
    right: max(16px,(209% - var(--ytmusic-responsive-header-renderer-thumbnail-height)) / 2 + 8px);
}
ytmusic-shelf-renderer[is-playlist-detail-page] .title.ytmusic-shelf-renderer>yt-formatted-string.ytmusic-shelf-renderer, ytmusic-shelf-renderer[is-album-detail-page] .title.ytmusic-shelf-renderer>yt-formatted-string.ytmusic-shelf-renderer {
    padding-left: 15px;
}
ytmusic-carousel-shelf-basic-header-renderer[carousel-style=MUSIC_CAROUSEL_SHELF_BASIC_HEADER_STYLE_DISPLAY_TWO] .details.ytmusic-carousel-shelf-basic-header-renderer {
    padding-left: 15px;
}
ytmusic-search-box[is-bauhaus-sidenav-enabled][opened] .search-box.ytmusic-search-box {
    border: none;
    box-shadow: inset 0 0 0 2px #fff;
    background: #2a2a2a;
    border-radius: 9999px !important;
}
ytmusic-two-row-item-renderer[aspect-ratio=MUSIC_TWO_ROW_ITEM_THUMBNAIL_ASPECT_RATIO_SQUARE] .image.ytmusic-two-row-item-renderer {
    border-radius: 6px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, .5);
}
ytmusic-two-row-item-renderer[aspect-ratio=MUSIC_TWO_ROW_ITEM_THUMBNAIL_ASPECT_RATIO_SQUARE] .image-wrapper.ytmusic-two-row-item-renderer {
    padding-top: 85%;
}
.image.ytmusic-two-row-item-renderer {
    width: 85%;
}
#items.ytmusic-carousel {
    width: 96%;
    gap: 0;
}
ytmusic-responsive-header-renderer[is-playlist-detail-page] .subtitle-wrapper.ytmusic-responsive-header-renderer, ytmusic-responsive-header-renderer[is-album-detail-page] .subtitle-wrapper.ytmusic-responsive-header-renderer {
    top: 85px;
    position: absolute;
}
ytmusic-responsive-header-renderer[is-playlist-detail-page] .second-subtitle.ytmusic-responsive-header-renderer, ytmusic-responsive-header-renderer[is-album-detail-page] .second-subtitle.ytmusic-responsive-header-renderer {
    position: absolute;
    width: 100%;
    top: 275px;
    padding-left: 200px;
    color: #b3b3b3;
}
.action-buttons.ytmusic-responsive-header-renderer {
    top: 300px;
    position: absolute;
    justify-content: left;
}
h1.style-scope.ytmusic-responsive-header-renderer {
    position: absolute;
    padding-top: 77px;
}
.yt-avatar-stack-view-model-wiz__avatar-stack-text {
    font-size: 1.25rem;
    font-weight: 700;
}
.secondary-flex-columns.ytmusic-responsive-list-item-renderer .flex-column.ytmusic-responsive-list-item-renderer, .title.ytmusic-responsive-list-item-renderer, .yt-avatar-stack-view-model-wiz__avatar-stack-text {
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
ytmusic-responsive-list-item-renderer[is-playlist-detail-page][stack-flex-columns]:not([has-single-column]) .title-column.ytmusic-responsive-list-item-renderer, ytmusic-responsive-list-item-renderer[is-album-detail-page][stack-flex-columns]:not([has-single-column]) .title-column.ytmusic-responsive-list-item-renderer {
    margin: 0 0 2px;
}
.play-pause-button yt-icon.style-scope.ytmusic-player-bar {
    border-radius: 9999px;
    background: white;
}
.play-pause-button .yt-icon-button .ytmusic-player-bar .yt-icon-shape div {
    width: 70%!important;
    height: 70%!important;
    color: black;
}
.content.ytmusic-tabbed-search-results-renderer {
    margin: 0;
    width: 100%;
}
ytmusic-tabbed-search-results-renderer #contents.ytmusic-section-list-renderer {
    padding-top: 35px;
    background: #121212;
    margin-left: 130px;
}
ytmusic-chip-cloud-renderer#steering-chips iron-selector ytmusic-chip-cloud-chip-renderer.ytmusic-chip-cloud-renderer {
    padding: 0;
}
ytmusic-chip-cloud-renderer#steering-chips iron-selector {
    position: inherit!important;
    padding-left: 0 !important;
}
div#automix-contents {
    padding-top: 40px;
}
#tabs.ytmusic-tabbed-search-results-renderer {
    display: none;
}
.card-container.style-scope.ytmusic-card-shelf-renderer {
    background: #181818;
}
ytmusic-card-shelf-renderer .actions-container.ytmusic-card-shelf-renderer:has(>.ytmusic-card-shelf-renderer:is(ytmusic-toggle-button-renderer,yt-button-renderer).ytmusic-card-shelf-renderer~.ytmusic-card-shelf-renderer:is(ytmusic-toggle-button-renderer,yt-button-renderer)).ytmusic-card-shelf-renderer {
    display: none;
}
.title.ytmusic-card-shelf-renderer {
    font-size: 35px;
    font-weight: 700;
    font-family: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
.title.ytmusic-card-shelf-header-basic-renderer {
    font-family: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    font-size: 2.5rem;
}
.title.ytmusic-shelf-renderer>yt-formatted-string.ytmusic-shelf-renderer {
    font-size: 2.5rem;
    font-family: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline {
    font-weight: 700;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    border: none;
    color: #b3b3b3;
}
ytmusic-player-page .content.ytmusic-player-page {
    padding-top: 45px!important;
    padding-left: 190px!important;
    padding-right: 45px!important;
}
ytmusic-responsive-list-item-renderer.style-scope.ytmusic-shelf-renderer {
    border: none !important;
}
.main-card-content-container.ytmusic-card-shelf-renderer {
    display: flex;
    justify-self: left;
    flex-direction: column;
}
.thumbnail-container.ytmusic-card-shelf-renderer {
    border-radius: 6px;
    margin-right: auto;
    margin-bottom: 0;
    margin-top: 25px;
}
.subtitle.ytmusic-responsive-header-renderer, .second-subtitle.ytmusic-responsive-header-renderer {
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
.subtitle.ytmusic-card-shelf-renderer {
    font-size: 1.25rem;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
.left-items.ytmusic-responsive-list-item-renderer {
    border-radius: 6px;
}
.content-info-wrapper.ytmusic-player-bar .byline.ytmusic-player-bar {
    font-size: 1.2rem;
    font-family: var(--encore-body-font-stack);
    color: #b3b3b3 !important;
}
.content-info-wrapper.ytmusic-player-bar {
    margin: 9px 8px 0 16px;
    overflow: hidden;
}
.time-info.ytmusic-player-bar {
    font-family: var(--encore-body-font-stack);
    bottom: 14px;
    position: absolute;
    padding-left: 36%;
}
.subtitle.ytmusic-responsive-header-renderer, .second-subtitle.ytmusic-responsive-header-renderer {
    font-size: 1.3rem;
    color: white;
}
.strapline.ytmusic-responsive-header-renderer {
    z-index: 1;
    margin-top: 0;
    justify-content: left;
    padding-left: 300px;
    top: 275px;
    position: absolute;
    width: 195px;
}
.action-buttons.ytmusic-responsive-header-renderer:has(ytmusic-toggle-button-renderer) {
    top: 325px;
}
.thumbnail-overlay.ytmusic-two-row-item-renderer {
    width: 85%;
}
.title-group.style-scope.ytmusic-two-row-item-renderer {
    max-width: 200px;
}
.subtitle.ytmusic-two-row-item-renderer, .third-title.ytmusic-two-row-item-renderer {
    max-width: 200px;
}
ytmusic-immersive-header-renderer[is-bauhaus-sidenav-enabled] .image.ytmusic-immersive-header-renderer~.content-container-wrapper.ytmusic-immersive-header-renderer .gradient-container.ytmusic-immersive-header-renderer {
    padding: 0 0 0 300px;
}
yt-formatted-string.title.style-scope.ytmusic-immersive-header-renderer {
    font-weight: 800;
    font-size: 10rem;
    font-family: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
ytmusic-immersive-header-renderer[is-bauhaus-sidenav-enabled] .image.ytmusic-immersive-header-renderer {
    margin-top: 68px;
    margin-left: calc(var(--ytmusic-guide-width) + 125px);
}
.content-info-wrapper.ytmusic-player-bar .title.ytmusic-player-bar {
    font-size: 1.4rem;
    font-family: var(--encore-body-font-stack);
}
.image.ytmusic-player-bar {
    height: 50px;
}
ytmusic-carousel-shelf-basic-header-renderer[carousel-style=MUSIC_CAROUSEL_SHELF_BASIC_HEADER_STYLE_DISPLAY_TWO] .title.ytmusic-carousel-shelf-basic-header-renderer {
    font-size: 2.5rem;
    font-family: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
ytmusic-carousel-shelf-basic-header-renderer[carousel-style=MUSIC_CAROUSEL_SHELF_BASIC_HEADER_STYLE_DISPLAY_TWO] .details.ytmusic-carousel-shelf-basic-header-renderer {
    padding-left: 0;
}
.content-container.style-scope.ytmusic-visual-header-renderer {
    padding-left: 280px !important;
}
.strapline.ytmusic-card-shelf-header-basic-renderer {
    color: #b3b3b3;
    text-transform: none;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    font-size: 1.3rem;
}
.strapline.ytmusic-shelf-renderer {
    color: #b3b3b3;
    text-transform: none;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    font-size: 1.3rem;
}
.title.ytmusic-visual-header-renderer {
    overflow: hidden;
    font-family: SpotifyMixUITitle, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    font-weight: 800;
    font-size: 10rem;
    text-overflow: ellipsis;
    max-width: 915px;
}
.card-container.ytmusic-card-shelf-renderer {
    width: calc(var(--ytmusic-content-width) / 2);
}
.undercards-container.ytmusic-card-shelf-renderer {
    display: none;
}
ytmusic-card-shelf-renderer yt-button-shape {
    display: none;
}
tp-yt-paper-item.ytmusic-guide-entry-renderer:hover {
    --ytmusic-guide-entry-background-color: #282828
}
yt-button-shape#button-shape-subscribe button {
    border: 1px solid #7c7c7c;
}
.title.ytmusic-immersive-header-renderer {
    max-width: 805px;
}
.play-button.ytmusic-immersive-header-renderer, .radio-button.ytmusic-immersive-header-renderer {
    margin-right: 10px;
}
ytmusic-section-list-renderer[main-page-type="MUSIC_PAGE_TYPE_ARTIST"] div#contents {
    padding-top: 0 !important;
}
.strapline.ytmusic-carousel-shelf-basic-header-renderer {
    text-transform: none;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    font-size: 1.15rem;
}
.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--tonal {
    background: #1f1f1f;
}
.yt-core-attributed-string--white-space-no-wrap {
    font-family: var(--encore-body-font-stack);
    font-weight: 700;
}
ytmusic-search-box[is-bauhaus-sidenav-enabled]:not([opened]):not([has-query]) .search-box.ytmusic-search-box:hover, ytmusic-search-box[is-bauhaus-sidenav-enabled] .search-box.ytmusic-search-box:hover {
    box-shadow: inset 0 0 0 1px #404040;
    background: #2a2a2a;
}
tp-yt-paper-item.style-scope.ytmusic-guide-entry-renderer.home:hover {
    background: #2a2a2a;
}
yt-icon-button#next-items-button {
    right: 20px;
    z-index: 2;
    position: absolute;
    top: 175px;
}
yt-icon-button#previous-items-button {
    margin-left: 20px;
    left: 0;
    z-index: 2;
    position: absolute;
    top: 175px;
}
.title.ytmusic-header-renderer {
    padding-top: 55px;
    padding-left: 38px;
    position: absolute;
}
ytmusic-two-column-browse-results-renderer #primary.ytmusic-two-column-browse-results-renderer {
    max-width: calc(var(--ytmusic-content-width) - var(--minimum-page-side-margin));
    height: 0;
}
ytmusic-two-column-browse-results-renderer #secondary.ytmusic-two-column-browse-results-renderer {
    max-width: 100%;
}
ytmusic-two-column-browse-results-renderer:not([is-playlist-detail-page]):not([is-album-detail-page]) .description.ytmusic-two-column-browse-results-renderer {
    height: 100%;
    width: 145%
}
div#header-description {
    margin-top: 0;
    position: absolute;
    padding-left: 300px;
    top: 240px;
}
div#contents:has(#chips) ytmusic-responsive-header-renderer {
    margin-top: 60px;
    margin-left: 20px;
}
.yt-avatar-stack-view-model__avatar-stack-text {
    font-size: 13px;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    padding-top: 2px;
    font-weight: bold;
}
ytmusic-description-shelf-renderer[is-playlist-detail-page] .description.ytmusic-description-shelf-renderer, ytmusic-description-shelf-renderer[is-playlist-detail-page]:not([has-strapline]) .description.non-expandable.ytmusic-description-shelf-renderer, ytmusic-description-shelf-renderer[is-album-detail-page] .description.ytmusic-description-shelf-renderer, ytmusic-description-shelf-renderer[is-album-detail-page]:not([has-strapline]) .description.non-expandable.ytmusic-description-shelf-renderer {
    font-size: 13px;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
    height: 15px;
}
.fixed-column.ytmusic-responsive-list-item-renderer[size=MUSIC_RESPONSIVE_LIST_ITEM_FIXED_COLUMN_SIZE_SMALL] {
    font-size: 14px;
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
ytmusic-nav-bar tp-yt-paper-item yt-icon div {
    width: 215px !important;
}
ytmusic-search-box #suggestion-list.ytmusic-search-box {
    top: calc((var(--ytmusic-search-box-height)) * 1.4) !important;
    background: #2a2a2a !important;
    border-radius: 8px !important;
}
ytmusic-search-suggestions-section, ytmusic-search-suggestion {
    background: none;
}
.ytmusic-search-suggestion {
    font-family: SpotifyMixUI, CircularSp-Arab, CircularSp-Hebr, CircularSp-Cyrl, CircularSp-Grek, CircularSp-Deva, var(--fallback-fonts, sans-serif);
}
.ytmusic-search-suggestion .bold.yt-formatted-string {
    color: white;
}
yt-icon-button#previous-items-button, yt-icon-button#next-items-button {
    opacity: 0;
}
yt-icon-button#previous-items-button:hover, yt-icon-button#next-items-button:hover {
    opacity: 100%;
}
`;
const style = document.createElement('style')
style.type = 'text/css'
style.appendChild(document.createTextNode(css))
document.head.appendChild(style)

const fontUrls = [
  'https://encore.scdn.co/fonts/SpotifyMixUI-Regular-cc3b1de388efa4cbca6c75cebc24585e.woff2',
  'https://encore.scdn.co/fonts/SpotifyMixUITitleVariable-8769ccfde3379b7ebcadd9529b49d0cc.woff2',
  'https://encore.scdn.co/fonts/SpotifyMixUI-Bold-4264b799009b1db5c491778b1bc8e5b7.woff2'
]

for (const url of fontUrls) {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = url
  link.as = 'font'
  link.type = 'font/woff2'
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

function waitForElement(selector, callback, root = document.body) {
  const el = root.querySelector(selector)
  if (el) {
    callback(el)
    return
  }
  const obs = new MutationObserver(() => {
    const el = root.querySelector(selector)
    if (el) {
      obs.disconnect()
      callback(el)
    }
  })
  obs.observe(root, { childList: true, subtree: true })
}

function navigateHome() {
  const app = document.querySelector('ytmusic-app')
  if (!app) return
  app.dispatchEvent(
    new CustomEvent('yt-navigate', {
      detail: {
        endpoint: {
          browseEndpoint: {
            browseId: 'FEmusic_home'
          }
        }
      },
      bubbles: true,
      composed: true
    })
  )
}

function paperitemfix() {
  waitForElement(
    '.scroller.scroller-on-hover.style-scope.ytmusic-guide-section-renderer',
    container => {
      const items = container.querySelectorAll('.style-scope.ytmusic-guide-section-renderer')
      for (let i = 1; i < items.length; i++) items[i].style.display = 'none'
      const parent = document.querySelector('.style-scope.ytmusic-guide-entry-renderer')
      const titleColumn = parent?.querySelector('.title-column.style-scope.ytmusic-guide-entry-renderer')
      if (titleColumn) titleColumn.remove()
      if (parent) parent.classList.add('home')
    }
  )
}

function moveLogoToNav() {
  const logo = document.querySelector('ytmusic-logo')
  const navBar = document.querySelector('ytmusic-nav-bar[is-cairo-voting-animation-enabled]')
  if (logo && navBar) navBar.prepend(logo)
}

function adjustHomeButton() {
  waitForElement(
    'tp-yt-paper-item.ytmusic-guide-entry-renderer.home',
    homeButton => {
      if (homeButton.dataset.adjusted) return
      const center = document.querySelector('.center-content.style-scope.ytmusic-nav-bar')
      if (!center) return
      homeButton.dataset.adjusted = 'true'
      center.insertBefore(homeButton, center.children[1] || null)
      homeButton.addEventListener('click', e => {
        e.preventDefault()
        e.stopPropagation()
        navigateHome()
      })
    }
  )
}

function removeDividers() {
  document.querySelectorAll('#divider').forEach(el => el.remove())
  const leftContent = document.querySelector('.left-content.ytmusic-nav-bar')
  if (leftContent) leftContent.remove()
}

function swapControls() {
  const left = document.querySelector('.left-controls')
  const middle = document.querySelector('.middle-controls')
  if (left && middle && left.parentElement === middle.parentElement) {
    const parent = left.parentElement
    parent.insertBefore(middle, left)
    const tmp = left.className
    left.className = middle.className
    middle.className = tmp
  }
}

function isOverflowing(el) {
  return el.scrollWidth > el.clientWidth
}

function replaceSpanWithMarquee(span) {
  const marquee = document.createElement('marquee')
  marquee.className = span.className
  marquee.textContent = span.textContent
  span.replaceWith(marquee)
}

function replaceMarqueeWithSpan(marquee) {
  const span = document.createElement('span')
  span.className = marquee.className
  span.textContent = marquee.textContent
  marquee.replaceWith(span)
}

function updateMarquee() {
  const el = document.querySelector('.content-info-wrapper.ytmusic-player-bar .byline.ytmusic-player-bar')
  if (!el) return
  const overflowing = isOverflowing(el)
  if (overflowing && el.tagName === 'SPAN') replaceSpanWithMarquee(el)
  else if (!overflowing && el.tagName === 'MARQUEE') replaceMarqueeWithSpan(el)
}

;(function () {
  const app = document.querySelector('ytmusic-app')
  let lastPath = location.pathname + location.search
  let scheduled = false

  paperitemfix()
  moveLogoToNav()
  adjustHomeButton()
  removeDividers()
  swapControls()
  updateMarquee()

  const observer = new MutationObserver(() => {
    const path = location.pathname + location.search
    if (path !== lastPath && !scheduled) {
      lastPath = path
      scheduled = true
      requestAnimationFrame(() => {
        if (path.startsWith('/watch')) updateMarquee()
        scheduled = false
      })
    }
  })

  observer.observe(app || document.body, { childList: true, subtree: true })
})()