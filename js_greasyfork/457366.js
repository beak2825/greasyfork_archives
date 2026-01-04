// ==UserScript==
// @name         sc-theme-green
// @namespace    NegUtl
// @version      0.1.6
// @description  green theme for soundcloud.com
// @author       You
// @match        https://soundcloud.com/*
// @match        https://insights-ui.soundcloud.com/*
// @match        https://secure.soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundcloud.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457366/sc-theme-green.user.js
// @updateURL https://update.greasyfork.org/scripts/457366/sc-theme-green.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // colors
    const bg = 'hsl(162, 30%, 21%)';
    const bg_dark = 'hwb(162deg 14% 80%)';
    const bg_light = 'rgb(36, 89, 71)';
    const item_bg = 'rgb(39, 70, 61)';
    const item_hov_bg = 'rgb(244, 213, 11)';
    const modal_bg = 'rgba(0, 0, 0, 0.75)';

    const txt = 'rgba(255, 205, 26, 95%)';
    const txt_link = 'rgb(255, 212, 56)';
    const txt_strong = 'rgb(255, 221, 0)';
    const txt_blk = 'rgb(18, 18, 18)';

    const btn = 'hsl(47deg, 40%, 80%)';
    const btn_on = 'hsl(24deg, 100%, 62%)';
    const btn_on_dark = 'hsl(24deg, 100%, 40%)';

    const bg_10p = bg.replace(')',', .1)');
    const item_bg_10p = item_bg.replace(')',', .1)');
    const item_hov_bg_10p = item_hov_bg.replace(')',', .1)');
    const txt_strong_25p = item_hov_bg.replace(')',', .25)');
    const txt_strong_55p = item_hov_bg.replace(')',', .55)');
    const btn_50p = btn.replace(')',', .5)');

    const border = 'rgba(255, 255, 255, 0.2)';
    const radius = '7px';

    // misc
    const shadow = 'rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px'
    const trans = '256ms' // transition time
    const pad_big = 16;
    const pad_lil = 12;
    const margin_lil = 12;
    const scrollbar_width = 14;


    // icons svg
    const prev = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTcgNmgydjEySDdWNnptMiA2bDggNlY2bC04IDZ6Ii8+PC9zdmc+Cg==";
    const play = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTggNXYxNGwxMS03eiIvPjwvc3ZnPgo=";
    const pause = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTYgMTloNFY1SDZ2MTR6bTgtMTR2MTRoNFY1aC00eiIvPjwvc3ZnPgo=";
    const next = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTcgMThsOC02LTgtNnYxMnptOC0xMnYxMmgyVjZoLTJ6Ii8+PC9zdmc+Cg==";
    const shuffle = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iI2Y1MCIgZD0iTTEzLjU4NiAxN2wtOC04SDNWN2gzLjQxNGw4IDhIMTd2MmgtMy40MTR6TTMgMTVoMi41ODZsMi4yMDctMi4yMDcgMS40MTQgMS40MTQtMi41MDEgMi41MDEtLjI5My4yOTJIM3YtMnptMTQtNmgtMi41ODZsLTIuMjA3IDIuMjA3LTEuNDE0LTEuNDE0TDEzLjU4NiA3SDE3djJ6bTQgN2wtNCAzdi02bDQgM3ptMC04bC00IDNWNWw0IDN6Ii8+PC9zdmc+Cg=="
    const rep_none = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTEyIDhIOWE0IDQgMCAxIDAgMCA4aDZhNCA0IDAgMCAwIDIuMTA0LTcuNDAzbDEuNzctMS4xOC4wMi4wMThBNiA2IDAgMCAxIDE1IDE4SDlBNiA2IDAgMSAxIDkgNmgzVjRsNCAzLTQgM1Y4eiIvPjwvc3ZnPgo="
    const rep_one = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iI2Y1MCIgZD0iTTExLjAyNyAxNmE0LjU1IDQuNTUgMCAwIDAgLjIzIDJIOUE2IDYgMCAxIDEgOSA2aDNWNGw0IDMtNCAzVjhIOWE0IDQgMCAxIDAgMCA4aDIuMDI3em03LjcyNS0yLjYxYTMuOTk3IDMuOTk3IDAgMCAwLTEuNjQ4LTQuNzkybDEuNzctMS4xOC4wMi4wMTdBNS45ODcgNS45ODcgMCAwIDEgMjEgMTJjMCAxLjMtLjQxMyAyLjUwMy0xLjExNiAzLjQ4NmE0LjQ5NiA0LjQ5NiAwIDAgMC0xLjEzMi0yLjA5NnoiLz48cGF0aCBmaWxsPSIjZjUwIiBkPSJNMTUuNSAyMGEzLjUgMy41IDAgMSAxIDAtNyAzLjUgMy41IDAgMCAxIDAgN3ptLS41LTV2NGgxdi00aC0xem0tMSAwdjFoMXYtMWgtMXoiLz48L3N2Zz4K"
    const rep_all = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iI2Y1MCIgZD0iTTEyIDhIOWE0IDQgMCAxIDAgMCA4aDZhNCA0IDAgMCAwIDIuMTA0LTcuNDAzbDEuNzctMS4xOC4wMi4wMThBNiA2IDAgMCAxIDE1IDE4SDlBNiA2IDAgMSAxIDkgNmgzVjRsNCAzLTQgM1Y4eiIvPjwvc3ZnPgo="


    const loading = "https://i.giphy.com/media/WYbMI41VvDKGE22b3I/giphy.gif";

    if (location.hostname === 'soundcloud.com') {
        document.head.insertAdjacentHTML('afterend', String.raw`
<style>




/* scrollbar */

body {
    overflow: overlay;
}
::-webkit-scrollbar {
    position: absolute;
    width: ${scrollbar_width}px;
}
::-webkit-scrollbar:horizontal {
    display: none;
}
::-webkit-scrollbar-thumb {
    background-color: ${txt_strong_25p};
    border-radius: ${radius};
}
::-webkit-scrollbar-thumb:hover {
    background-color: ${txt_strong_55p};
}

/* for firefox */
html {
    scrollbar-color: hsla(52, 100%, 50%, 0.25) transparent;
}




* {
    border-color: ${border} !important;
}




/* text color */


.sc-text-primary, .sc-text-secondary, .sc-text-body, .sc-font-light, p, span, dd {
    color: ${txt} !important;
}
.sc-link, .sc-link-primary, .sc-link-secondary, .sc-text-h3, h3, a, h4 {
    color: ${txt_link} !important;
}
.sc-text-h1, .sc-text-h2, h1, h2 {
    color: ${txt_strong} !important;
}




.commentItem__usernameLink {
    color: ${btn} !important;
}
.quotaMeter div {
    color: ${txt} !important;
}
.select__labelText {
    color: ${btn} !important;
}
.accountSocial__empty {
    color: ${txt} !important;
}
td.notificationsPreferences__bodyCell {
    color: ${txt} !important;
}
.g-link-user {
    color: ${btn} !important;
}
.addToNextUp:not(.moreActions__button):hover > .sc-button-alt-labels > span {
    color: ${item_hov_bg} !important;
}
.listenEngagement__footer .addToNextUp:hover > .sc-button-alt-labels > span {
    color: ${bg} !important;
}
.sc-button-selected.addToNextUp > .sc-button-alt-labels > span {
    color: ${btn_on} !important;
}
.audibleEditForm__requiredText {
    color: ${txt_strong} !important;
}




/* background color */

html, body, #app, .sc-background-white, .quotaMeterWrapper {
    background: none !important;
    background-color: ${bg} !important;
}
.playControls__bg, .playControls__inner, .sc-background-light {
    background-color: ${bg_dark} !important;
}


.dropdownMenu * {
    background-color: ${bg_light} !important;
    color: ${btn} !important;
    border: none !important;
    border-radius: ${radius} !important;
}
.dropdownMenu {
    box-shadow: ${shadow};
    border-radius: ${radius} !important;
}

.ui-widget {
    background-color: ${bg_light} !important;
}

.topStats__wrapperEligible:focus, .topStats__wrapperEligible:hover {
    background-color: ${bg_light} !important;
}

.dialog, .dialog__arrow {
    background-color: ${bg_light} !important;
}

#onetrust-banner-sdk, #onetrust-pc-sdk, #ot-sel-blk {
    background-color: ${bg} !important;
    box-shadow: ${shadow} !important;
}
.ot-ven-dets {
    background-color: ${bg_light} !important;
}
#onetrust-accept-btn-handler, #onetrust-pc-btn-handler {
    margin: 6px 0 !important;
}

.banner {
    background-color: ${bg_light} !important;
}

.l-fixed-top-one-column>.l-top {
    background-color: ${bg} !important;
}

.sidebarInfoBox__body {
    background-color: ${bg_dark} !important;
    border-radius: ${radius} !important;
    border: none !important;
    padding: 18px !important;
}
.sidebarInfoBox {
    border: none !important;
}

.currentPlan__planContainer, .currentPlan__planUpsell {
    background-color: ${bg} !important;
}
.currentPlan__basicPremierUpsell, .consumerSubscription__upsell {
    background-color: ${bg_dark} !important;
}
.currentPlan__upsellIcon + div {
    color: ${txt} !important;
}

.trackManager__upsellWrapper {
    background-color: transparent !important;
}

.topStatsModule__header.sc-background-light, .statsOverview__separator {
    background-color: transparent !important;
}
.statsBarChart__bottom {
    stroke: transparent !important;
}
.readMoreTile__countWrapper {
    background-color: ${bg} !important;
}

.audibleEditForm__audio, .audibleEditForm__form {
    background-color: transparent !important;
}

/* upload */

.uploadMain__foot {
    background-color: ${bg} !important;
    border: none !important;
}
.uploadMain__chooserContainer {
    background-color: ${bg_light} !important;
    margin: 16px 0 !important;
    border-radius: ${radius} !important;
}
.quotaMeterWrapper {
    border-radius: ${radius} !important;
}




/* queue */

.queue, .queue__itemWrapper {
    background-color: ${bg_light} !important;
}
.queue {
    border-radius: ${radius} ${radius} 0 0 !important;
}
.queueItemView.m-active, .queueItemView:hover {
    background-color: ${item_hov_bg} !important;
}
.queueItemView.m-active *, .queueItemView:hover *{
    color: ${txt_blk} !important;
}
.queueItemView__dragHandle {
    background-image: none !important;
    background-color: ${txt_blk};
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0NDQyIgZD0iTTkgNWgydjJIOVY1em00IDBoMnYyaC0yVjV6bTAgOGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJWOXptMCA4aDJ2MmgtMnYtMnpNOSA5aDJ2Mkg5Vjl6bTAgNGgydjJIOXYtMnptMCA0aDJ2Mkg5di0yeiIvPgogICAgPC9nPgo8L3N2Zz4K) no-repeat 50%;
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI0NDQyIgZD0iTTkgNWgydjJIOVY1em00IDBoMnYyaC0yVjV6bTAgOGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJWOXptMCA4aDJ2MmgtMnYtMnpNOSA5aDJ2Mkg5Vjl6bTAgNGgydjJIOXYtMnptMCA0aDJ2Mkg5di0yeiIvPgogICAgPC9nPgo8L3N2Zz4K) no-repeat 50%;
    mask-size: 24px 24px;
    -webkit-mask-size: 24px 24px;
}
.playControls__queue {
    transform: translate(0,6px) !important;
}
.sc-button.sc-button-nostyle {
    border: none !important;
}
.queue__hide {
    background-image: none !important;
    background-color: ${btn} !important;
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyeiIvPgogICAgPC9nPgo8L3N2Zz4K) no-repeat 50%;
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iIzAwMCIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMTkgNi40MUwxNy41OSA1IDEyIDEwLjU5IDYuNDEgNSA1IDYuNDEgMTAuNTkgMTIgNSAxNy41OSA2LjQxIDE5IDEyIDEzLjQxIDE3LjU5IDE5IDE5IDE3LjU5IDEzLjQxIDEyeiIvPgogICAgPC9nPgo8L3N2Zz4K) no-repeat 50%;
    mask-size: 24px 24px;
    -webkit-mask-size: 24px 24px;
}

.sc-button.queueItemView__like,
.sc-button.queueItemView__more {
    border: solid 1px ${txt_blk} !important;
}
    .sc-button.queueItemView__like.sc-button-selected {
        border-color: ${btn_on_dark} !important;
    }
.sc-button.queueItemView__like:before,
.sc-button.queueItemView__more:before {
    background-color: ${txt_blk} !important;
    left: -1px !important;
}
    .sc-button.queueItemView__like.sc-button-selected:before {
        background-color: ${btn_on_dark} !important;
    }
.sc-button.queueItemView__like:hover,
.sc-button.queueItemView__more:hover {
    background-color: ${txt_blk} !important;
}
    .sc-button.queueItemView__like.sc-button-selected:hover {
        background-color: ${btn_on_dark} !important;
    }
.sc-button.queueItemView__like:hover:before,
.sc-button.queueItemView__more:hover:before {
    background-color: ${item_hov_bg} !important;
}
.sc-button.queueItemView__like {
    margin-right: 4px;
}




/* modal */

.modal.modalWhiteout {
    background-color: ${modal_bg} !important;
}
.modal__header, .modal__title, .modal__modal {
    background-color: ${bg} !important;
}
.modal__modal {
    border-radius: ${radius} !important;
}
.modal__header, .modal__title {
    border-radius: ${radius} ${radius} 0 0 !important;
}
.modal__header+.modal__modal {
    border-radius: 0 0 ${radius} ${radius} !important;
}

.g-modal-section, .tabs__tabs {
    background-color: ${bg} !important;
    border-radius: ${radius};
}
.modal__closeButton {
    background-image: none !important;
    background-color: ${btn} !important;
    mask: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Q2xvc2U8L3RpdGxlPjxwYXRoIGQ9Ik0xMCA4LjU0NUwzLjQ1NSAyIDIgMy40NTUgOC41NDUgMTAgMiAxNi41NDUgMy40NTUgMTggMTAgMTEuNDU1IDE2LjU0NSAxOCAxOCAxNi41NDUgMTEuNDU1IDEwIDE4IDMuNDU1IDE2LjU0NSAyIDEwIDguNTQ1eiIgZmlsbD0iIzMzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+Cg==) 50% no-repeat;
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+Q2xvc2U8L3RpdGxlPjxwYXRoIGQ9Ik0xMCA4LjU0NUwzLjQ1NSAyIDIgMy40NTUgOC41NDUgMTAgMiAxNi41NDUgMy40NTUgMTggMTAgMTEuNDU1IDE2LjU0NSAxOCAxOCAxNi41NDUgMTEuNDU1IDEwIDE4IDMuNDU1IDE2LjU0NSAyIDEwIDguNTQ1eiIgZmlsbD0iIzMzMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+Cg==) 50% no-repeat;
    mask-size: 75%;
    -webkit-mask-size: 75%;
    transform: translate(-15px, 15px);
}
.sc-classic .modal__closeButton:focus {
    outline: solid;
}



/* header */

.header {
    background-color: ${bg_dark} !important;
}
.headerMenu__link {
    font-weight: normal;
}
.header>li>a:focus, .sc-classic .header__navMenu>li>a.selected {
    background-color: ${txt_blk} !important;
    color: ${btn} !important;
}
.header__userNavButton.selected {
    background-color: ${txt_blk} !important;
    border-radius: ${radius};
}
.header__inner {
    position: relative;
    left: ${-scrollbar_width/2}px;
}
.notificationIcon.activities:before {
    background-image: none !important;
    background-color: ${btn} !important;
    mask: url(https://a-v2.sndcdn.com/assets/images/activities-66caaa5e.svg) 50% 50% no-repeat;
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/activities-66caaa5e.svg) 50% 50% no-repeat;
}
.notificationIcon.messages:before {
    background-image: none !important;
    background-color: ${btn} !important;
    mask: url(https://a-v2.sndcdn.com/assets/images/messages-f517d0eb.svg) 50% 50% no-repeat;
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/messages-f517d0eb.svg) 50% 50% no-repeat;
}
.header__moreButton {
    background-image: none !important;
    background-color: ${btn} !important;
    mask: url(https://a-v2.sndcdn.com/assets/images/more-0e9e752c.svg) 50% 50% no-repeat;
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/more-0e9e752c.svg) 50% 50% no-repeat;
}

/*
.newItemBadge.newItems__some {
    background-color: ${btn_on} !important;
}
*/

.header__logo {
    background: transparent !important;
}
.header__logoLink {
    background-color: ${btn} !important;
    background-image: none !important;
    mask-image: url(https://a-v2.sndcdn.com/assets/images/brand-1b72dd82.svg);
    -webkit-mask-image: url(https://a-v2.sndcdn.com/assets/images/brand-1b72dd82.svg);
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: 11px;
    -webkit-mask-position: 11px;
    mask-size: 49px 22px;
    -webkit-mask-size: 49px 22px;
}
.header__logoLink:focus {
    background-color: ${btn_on} !important;
}


.headerMenu__link:hover {
    background-color: ${btn} !important;
    color: ${bg_light} !important;
}
.headerMenu__link:after {
    background-image: none !important;
    background-color: ${btn};
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
}
.headerMenu__link:hover:after {
    background-image: none !important;
    background-color: ${bg_light};
}

.profileMenu__profile:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjEgMTEuODZjLS44MjUtLjQxOC0xLjI0My0xLjUzNi0xLjI0My0yLjMyIDAtLjQuMjY4LS43MzUuNTA3LTEuMDA3LjY0OC0uNzQzIDEuMTU0LTEuNjI0IDEuMTU0LTMuNTA3QzEyLjUxOCAyLjI1IDEwLjg1OCAxIDguOTg4IDFjLTEuODcgMC0zLjUzIDEuMjUtMy41MyA0LjAyNiAwIDEuODgzLjUwNSAyLjc2NCAxLjE1MyAzLjUwNy4yNC4yNzIuNTEuNjA3LjUxIDEuMDA2IDAgLjc4NC0uNDIgMS45MDItMS4yNDYgMi4zMi0xLjI0NC42My0zLjQyMyAxLjE2Ny00LjM2NSAxLjg4Qy4yNSAxNC42OTUgMCAxNyAwIDE3aDE4cy0uMjc3LTIuMzA2LTEuNTM0LTMuMjZjLS45NDItLjcxMy0zLjEyLTEuMjUtNC4zNjUtMS44OHoiLz4KPC9zdmc+Cg==);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjEgMTEuODZjLS44MjUtLjQxOC0xLjI0My0xLjUzNi0xLjI0My0yLjMyIDAtLjQuMjY4LS43MzUuNTA3LTEuMDA3LjY0OC0uNzQzIDEuMTU0LTEuNjI0IDEuMTU0LTMuNTA3QzEyLjUxOCAyLjI1IDEwLjg1OCAxIDguOTg4IDFjLTEuODcgMC0zLjUzIDEuMjUtMy41MyA0LjAyNiAwIDEuODgzLjUwNSAyLjc2NCAxLjE1MyAzLjUwNy4yNC4yNzIuNTEuNjA3LjUxIDEuMDA2IDAgLjc4NC0uNDIgMS45MDItMS4yNDYgMi4zMi0xLjI0NC42My0zLjQyMyAxLjE2Ny00LjM2NSAxLjg4Qy4yNSAxNC42OTUgMCAxNyAwIDE3aDE4cy0uMjc3LTIuMzA2LTEuNTM0LTMuMjZjLS45NDItLjcxMy0zLjEyLTEuMjUtNC4zNjUtMS44OHoiLz4KPC9zdmc+Cg==);
    mask-size: 14px;
    -webkit-mask-size: 14px;
    mask-position: center 3px;
    -webkit-mask-position: center 3px;
}
.profileMenu__likes:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjgwNSAzQzguNzg1IDMgOCA1LjM0NSA4IDUuMzQ1UzcuMjE0IDMgNS4xOTcgM0MzLjQ5NCAzIDEuNzQ4IDQuMDk2IDIuMDMgNi41MTRjLjM0NCAyLjk1MyA1LjcyNSA2LjQ4IDUuOTYzIDYuNDg3LjIzOC4wMSA1LjczOC0zLjcyIDUuOTg4LTYuNS4yMDgtMi4zLTEuNDczLTMuNS0zLjE3NS0zLjV6Ii8+Cjwvc3ZnPgo=);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTEwLjgwNSAzQzguNzg1IDMgOCA1LjM0NSA4IDUuMzQ1UzcuMjE0IDMgNS4xOTcgM0MzLjQ5NCAzIDEuNzQ4IDQuMDk2IDIuMDMgNi41MTRjLjM0NCAyLjk1MyA1LjcyNSA2LjQ4IDUuOTYzIDYuNDg3LjIzOC4wMSA1LjczOC0zLjcyIDUuOTg4LTYuNS4yMDgtMi4zLTEuNDczLTMuNS0zLjE3NS0zLjV6Ii8+Cjwvc3ZnPgo=);
    mask-size: 16x;
    -webkit-mask-size: 16px;
    mask-position: center 2px;
    -webkit-mask-position: center 2px;
}
.profileMenu__stations:after {
    mask-image: url(https://a-v2.sndcdn.com/assets/images/stations-c047dd48.svg);
    -webkit-mask-image: url(https://a-v2.sndcdn.com/assets/images/stations-c047dd48.svg);
    mask-size: 20px 20px;
    -webkit-mask-size: 20px 20px;
    mask-position: center 4px;
    -webkit-mask-position: center 4px;
}
.profileMenu__following:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij4KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOC40IDE4LjVsMi41IDUgLjIuNUgyOGwtMi4xLTQuMy00LjEtMS41di0yLjVjMS4yLTEuMSAxLjgtMy4yIDEuOC01LjEgMC0yLjEtMi0zLjYtMy41LTMuNnMtMy41IDEuNi0zLjUgMy42YzAgMS45LjUgNCAxLjggNS4xdjIuNWgtLjFsLjEuM3oiLz4KICAgIDxwYXRoIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsLjcpIiBkPSJNMTcuNSAxOWwtNS0xLjh2LTNjMS40LTEuMiAyLTMuOCAyLTUuOSAwLTIuNC0yLjMtNC4zLTQtNC4zLTEuNyAwLTQgMS44LTQgNC4zIDAgMi4yLjYgNC43IDIgNS45djNsLTUgMS44TDEgMjRoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij4KICAgIDxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0xOC40IDE4LjVsMi41IDUgLjIuNUgyOGwtMi4xLTQuMy00LjEtMS41di0yLjVjMS4yLTEuMSAxLjgtMy4yIDEuOC01LjEgMC0yLjEtMi0zLjYtMy41LTMuNnMtMy41IDEuNi0zLjUgMy42YzAgMS45LjUgNCAxLjggNS4xdjIuNWgtLjFsLjEuM3oiLz4KICAgIDxwYXRoIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsLjcpIiBkPSJNMTcuNSAxOWwtNS0xLjh2LTNjMS40LTEuMiAyLTMuOCAyLTUuOSAwLTIuNC0yLjMtNC4zLTQtNC4zLTEuNyAwLTQgMS44LTQgNC4zIDAgMi4yLjYgNC43IDIgNS45djNsLTUgMS44TDEgMjRoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    mask-size: 19px;
    -webkit-mask-size: 19px;
    mask-position: top;
    -webkit-mask-position: top;
}
.profileMenu__friends:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij4KICAgIDxwYXRoIGZpbGw9InJnYmEoNTEsNTEsNTEsLjcpIiBkPSJNMTguNCAxOC41bDIuNSA1IC4yLjVIMjhsLTIuMS00LjMtNC4xLTEuNXYtMi41YzEuMi0xLjEgMS44LTMuMiAxLjgtNS4xIDAtMi4xLTItMy42LTMuNS0zLjZzLTMuNSAxLjYtMy41IDMuNmMwIDEuOS41IDQgMS44IDUuMXYyLjVoLS4xbC4xLjN6Ii8+CiAgICA8cGF0aCBmaWxsPSIjMzMzIiBkPSJNMTcuNSAxOWwtNS0xLjh2LTNjMS40LTEuMiAyLTMuOCAyLTUuOSAwLTIuNC0yLjMtNC4zLTQtNC4zLTEuNyAwLTQgMS44LTQgNC4zIDAgMi4yLjYgNC43IDIgNS45djNsLTUgMS44TDEgMjRoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCIgdmlld0JveD0iMCAwIDI4IDI4Ij4KICAgIDxwYXRoIGZpbGw9InJnYmEoNTEsNTEsNTEsLjcpIiBkPSJNMTguNCAxOC41bDIuNSA1IC4yLjVIMjhsLTIuMS00LjMtNC4xLTEuNXYtMi41YzEuMi0xLjEgMS44LTMuMiAxLjgtNS4xIDAtMi4xLTItMy42LTMuNS0zLjZzLTMuNSAxLjYtMy41IDMuNmMwIDEuOS41IDQgMS44IDUuMXYyLjVoLS4xbC4xLjN6Ii8+CiAgICA8cGF0aCBmaWxsPSIjMzMzIiBkPSJNMTcuNSAxOWwtNS0xLjh2LTNjMS40LTEuMiAyLTMuOCAyLTUuOSAwLTIuNC0yLjMtNC4zLTQtNC4zLTEuNyAwLTQgMS44LTQgNC4zIDAgMi4yLjYgNC43IDIgNS45djNsLTUgMS44TDEgMjRoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    mask-size: 19px;
    -webkit-mask-size: 19px;
    mask-position: top;
    -webkit-mask-position: top;
}
.profileMenu__premium:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGZpbGw9IiMzMzMiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTggMTEuNzEzTDEyLjMyOCAxNWwtMS42NTYtNS4zMDhMMTUgNi40NzhIOS42OTJMOCAxIDYuMzA4IDYuNDc4SDFsNC4zMjggMy4yMTRMMy42NzIgMTV6IiAvPgo8L3N2Zz4K);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGZpbGw9IiMzMzMiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTggMTEuNzEzTDEyLjMyOCAxNWwtMS42NTYtNS4zMDhMMTUgNi40NzhIOS42OTJMOCAxIDYuMzA4IDYuNDc4SDFsNC4zMjggMy4yMTRMMy42NzIgMTV6IiAvPgo8L3N2Zz4K);
    mask-size: 16px;
    -webkit-mask-size: 16px;
    mask-position: 50%;
    -webkit-mask-position: 50%;
}
.profileMenu__trackManager:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNOC42NjcgMnYxMkg3LjMzM1YyaDEuMzM0ek02IDR2OEg0LjY2N1Y0SDZ6bTUuMzMzIDEuMzMzdjUuMzM0SDEwVjUuMzMzaDEuMzMzem0tOCAxLjMzNHYyLjY2NkgyVjYuNjY3aDEuMzMzem0xMC42NjcgMHYyLjY2NmgtMS4zMzNWNi42NjdIMTR6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNOC42NjcgMnYxMkg3LjMzM1YyaDEuMzM0ek02IDR2OEg0LjY2N1Y0SDZ6bTUuMzMzIDEuMzMzdjUuMzM0SDEwVjUuMzMzaDEuMzMzem0tOCAxLjMzNHYyLjY2NkgyVjYuNjY3aDEuMzMzem0xMC42NjcgMHYyLjY2NmgtMS4zMzNWNi42NjdIMTR6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=);
    mask-size: 20px;
    -webkit-mask-size: 20px;
    mask-position: top;
    -webkit-mask-position: top;
}
.profileMenu__distribute:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDE2IDEyIj4KICAgIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0xLjYyIDEwaDEydjJoLTEydi0yem02LjUyNi03djZINy4wOTRWM2gtMS41OEw3LjYyIDBsMi4xMDUgM0g4LjE0NnptLTUuOTkgMS4yNTdsMi44NjcgNC4wOTYtLjg2Mi42MDMtMi44NjgtNC4wOTVMMCA1Ljc2NmwuMDAzLTMuNjY1IDMuNDQ2IDEuMjUtMS4yOTQuOTA2aC4wMDF6bTEyLjA1LjU4MmwtMi44NjggNC4wOTYtLjg2My0uNjA0IDIuODY4LTQuMDk2LTEuMjkzLS45MDUgMy40NDUtMS4yNS4wMDQgMy42NjUtMS4yOTMtLjkwNnoiLz4KPC9zdmc+Cg==);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxMiIgdmlld0JveD0iMCAwIDE2IDEyIj4KICAgIDxwYXRoIGZpbGw9IiMzMzMiIGQ9Ik0xLjYyIDEwaDEydjJoLTEydi0yem02LjUyNi03djZINy4wOTRWM2gtMS41OEw3LjYyIDBsMi4xMDUgM0g4LjE0NnptLTUuOTkgMS4yNTdsMi44NjcgNC4wOTYtLjg2Mi42MDMtMi44NjgtNC4wOTVMMCA1Ljc2NmwuMDAzLTMuNjY1IDMuNDQ2IDEuMjUtMS4yOTQuOTA2aC4wMDF6bTEyLjA1LjU4MmwtMi44NjggNC4wOTYtLjg2My0uNjA0IDIuODY4LTQuMDk2LTEuMjkzLS45MDUgMy40NDUtMS4yNS4wMDQgMy42NjUtMS4yOTMtLjkwNnoiLz4KPC9zdmc+Cg==);
    mask-size: 16px;
    -webkit-mask-size: 16px;
    mask-position: 50%;
    -webkit-mask-position: 50%;
}
.profileMenu__sets:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9IiMzMzMiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTIgNmgxMHYxMEgyeiIvPgogICAgICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjciIGQ9Ik01IDJoMTF2MTBoLTJWNEg1eiIvPgogICAgPC9nPgo8L3N2Zz4K);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9IiMzMzMiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTIgNmgxMHYxMEgyeiIvPgogICAgICAgIDxwYXRoIGZpbGwtb3BhY2l0eT0iLjciIGQ9Ik01IDJoMTF2MTBoLTJWNEg1eiIvPgogICAgPC9nPgo8L3N2Zz4K);
    mask-size: 18px;
    -webkit-mask-size: 18px;
    mask-position: 9px 2px;
    -webkit-mask-position: 9px 2px;
}
.profileMenu__partnerOffers:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuMzM2NjQgMy42OTcyQzcuNDQwMTUgMy43ODM0NiA3LjUgMy45MTEyNCA3LjUgNC4wNDU5OUM3LjUgNC4yOTY3MyA3LjI5NjczIDQuNSA3LjA0NTk4IDQuNUg0LjUzOTg1QzMuOTY1NTYgNC41IDMuNSA0LjAzNDQ1IDMuNSAzLjQ2MDE2QzMuNSAyLjI4NDY2IDQuODcxMDEgMS42NDI1MSA1Ljc3NDA1IDIuMzk1MDVMNy4zMzY2NCAzLjY5NzJaIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik04LjY2MzM2IDMuNjk3MkM4LjU1OTg1IDMuNzgzNDYgOC41IDMuOTExMjQgOC41IDQuMDQ1OTlDOC41IDQuMjk2NzMgOC43MDMyNyA0LjUgOC45NTQwMiA0LjVIMTEuNDYwMkMxMi4wMzQ0IDQuNSAxMi41IDQuMDM0NDUgMTIuNSAzLjQ2MDE2QzEyLjUgMi4yODQ2NiAxMS4xMjkgMS42NDI1MSAxMC4yMjU5IDIuMzk1MDVMOC42NjMzNiAzLjY5NzJaIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik0zLjUgNS41QzIuOTQ3NzIgNS41IDIuNSA1Ljk0NzcyIDIuNSA2LjVWOEg3LjVWNS41SDMuNVoiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTguNSA1LjVWOEgxMy41VjYuNUMxMy41IDUuOTQ3NzIgMTMuMDUyMyA1LjUgMTIuNSA1LjVIOC41WiIgZmlsbD0iIzMzMzMzMyIvPgo8cGF0aCBkPSJNMTMgOUg4LjVWMTRIMTJDMTIuNTUyMyAxNCAxMyAxMy41NTIzIDEzIDEzVjlaIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik03LjUgMTRWOUgzVjEzQzMgMTMuNTUyMyAzLjQ0NzcyIDE0IDQgMTRINy41WiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTcuMzM2NjQgMy42OTcyQzcuNDQwMTUgMy43ODM0NiA3LjUgMy45MTEyNCA3LjUgNC4wNDU5OUM3LjUgNC4yOTY3MyA3LjI5NjczIDQuNSA3LjA0NTk4IDQuNUg0LjUzOTg1QzMuOTY1NTYgNC41IDMuNSA0LjAzNDQ1IDMuNSAzLjQ2MDE2QzMuNSAyLjI4NDY2IDQuODcxMDEgMS42NDI1MSA1Ljc3NDA1IDIuMzk1MDVMNy4zMzY2NCAzLjY5NzJaIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik04LjY2MzM2IDMuNjk3MkM4LjU1OTg1IDMuNzgzNDYgOC41IDMuOTExMjQgOC41IDQuMDQ1OTlDOC41IDQuMjk2NzMgOC43MDMyNyA0LjUgOC45NTQwMiA0LjVIMTEuNDYwMkMxMi4wMzQ0IDQuNSAxMi41IDQuMDM0NDUgMTIuNSAzLjQ2MDE2QzEyLjUgMi4yODQ2NiAxMS4xMjkgMS42NDI1MSAxMC4yMjU5IDIuMzk1MDVMOC42NjMzNiAzLjY5NzJaIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik0zLjUgNS41QzIuOTQ3NzIgNS41IDIuNSA1Ljk0NzcyIDIuNSA2LjVWOEg3LjVWNS41SDMuNVoiIGZpbGw9IiMzMzMzMzMiLz4KPHBhdGggZD0iTTguNSA1LjVWOEgxMy41VjYuNUMxMy41IDUuOTQ3NzIgMTMuMDUyMyA1LjUgMTIuNSA1LjVIOC41WiIgZmlsbD0iIzMzMzMzMyIvPgo8cGF0aCBkPSJNMTMgOUg4LjVWMTRIMTJDMTIuNTUyMyAxNCAxMyAxMy41NTIzIDEzIDEzVjlaIiBmaWxsPSIjMzMzMzMzIi8+CjxwYXRoIGQ9Ik03LjUgMTRWOUgzVjEzQzMgMTMuNTUyMyAzLjQ0NzcyIDE0IDQgMTRINy41WiIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4K);
    mask-size: 16px;
    -webkit-mask-size: 16px;
    mask-position: 50%;
    -webkit-mask-position: 50%;
}
.profileMenu__insights:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0icmdiKDUxLCA1MSwgNTEpIiBkPSJNMyA2LjVjMC0uMjc2LjIxNi0uNS40OTUtLjVoMi4wMWMuMjczIDAgLjQ5NS4yMjkuNDk1LjV2MTFjMCAuMjc2LS4yMTYuNS0uNDk1LjVoLTIuMDFDMy4yMjIgMTggMyAxNy43NzEgMyAxNy41di0xMXptNy00LjAwNGMwLS4yNzQuMjE2LS40OTYuNDk1LS40OTZoMi4wMWMuMjczIDAgLjQ5NS4yMjYuNDk1LjQ5NnYxNS4wMDhjMCAuMjc0LS4yMTYuNDk2LS40OTUuNDk2aC0yLjAxYy0uMjczIDAtLjQ5NS0uMjI2LS40OTUtLjQ5NlYyLjQ5NnptNyA3LjAxNGMwLS4yODIuMjE2LS41MS40OTUtLjUxaDIuMDFjLjI3MyAwIC40OTUuMjIyLjQ5NS41MXY3Ljk4YzAgLjI4Mi0uMjE2LjUxLS40OTUuNTFoLTIuMDFjLS4yNzMgMC0uNDk1LS4yMjItLjQ5NS0uNTFWOS41MXpNMi41IDIwaDE5Yy4yNzYgMCAuNS4yMjQuNS41djFjMCAuMjc2LS4yMjQuNS0uNS41aC0xOWMtLjI3NiAwLS41LS4yMjQtLjUtLjV2LTFjMC0uMjc2LjIyNC0uNS41LS41eiIvPgogICAgPC9nPgo8L3N2Zz4K);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0icmdiKDUxLCA1MSwgNTEpIiBkPSJNMyA2LjVjMC0uMjc2LjIxNi0uNS40OTUtLjVoMi4wMWMuMjczIDAgLjQ5NS4yMjkuNDk1LjV2MTFjMCAuMjc2LS4yMTYuNS0uNDk1LjVoLTIuMDFDMy4yMjIgMTggMyAxNy43NzEgMyAxNy41di0xMXptNy00LjAwNGMwLS4yNzQuMjE2LS40OTYuNDk1LS40OTZoMi4wMWMuMjczIDAgLjQ5NS4yMjYuNDk1LjQ5NnYxNS4wMDhjMCAuMjc0LS4yMTYuNDk2LS40OTUuNDk2aC0yLjAxYy0uMjczIDAtLjQ5NS0uMjI2LS40OTUtLjQ5NlYyLjQ5NnptNyA3LjAxNGMwLS4yODIuMjE2LS41MS40OTUtLjUxaDIuMDFjLjI3MyAwIC40OTUuMjIyLjQ5NS41MXY3Ljk4YzAgLjI4Mi0uMjE2LjUxLS40OTUuNTFoLTIuMDFjLS4yNzMgMC0uNDk1LS4yMjItLjQ5NS0uNTFWOS41MXpNMi41IDIwaDE5Yy4yNzYgMCAuNS4yMjQuNS41djFjMCAuMjc2LS4yMjQuNS0uNS41aC0xOWMtLjI3NiAwLS41LS4yMjQtLjUtLjV2LTFjMC0uMjc2LjIyNC0uNS41LS41eiIvPgogICAgPC9nPgo8L3N2Zz4K);
    mask-size: 16px;
    -webkit-mask-size: 16px;
    mask-position: 50%;
    -webkit-mask-position: 50%;
}
.profileMenu__stats:after {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9IiMzMzMiPgogICAgICAgIDxwYXRoIGQ9Ik0wIDdoM3YxMEgwek0xMCA0aDN2MTNoLTN6TTE1IDFoM3YxNmgtM3pNNSAyaDN2MTVINXoiLz4KICAgIDwvZz4KPC9zdmc+Cg==);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxnIGZpbGw9IiMzMzMiPgogICAgICAgIDxwYXRoIGQ9Ik0wIDdoM3YxMEgwek0xMCA0aDN2MTNoLTN6TTE1IDFoM3YxNmgtM3pNNSAyaDN2MTVINXoiLz4KICAgIDwvZz4KPC9zdmc+Cg==);
    mask-size: 14px;
    -webkit-mask-size: 14px;
    mask-position: 10px 3px;
    -webkit-mask-position: 10px 3px;
}





/* tag */

.sc-tag {
    border: solid ${txt_link} 1px !important;
    background-color: ${item_bg} !important;
    padding: 2px 10px !important;
    margin-top: 3px !important;
}
.soundList__item:hover .sc-tag {
    background-color: ${item_hov_bg} !important;
}
.soundList__item:hover .sc-tag:hover {
    background-color: ${txt_blk} !important;
}
.sc-tag:hover .sc-tagContent, .sc-tag:hover:before {
    color: ${txt_link} !important;
}

.sc-tag:hover {
    background-color: ${btn} !important;
    border-color: ${btn} !important;
}
.sc-tag:hover::before, .sc-tag:hover > .sc-truncate {
    color: ${txt_blk} !important;
}




.soundList__item, .soundBadgeList__item, .historicalPlays__item {
    background-color: ${item_bg};
    box-shadow: ${shadow};
}
.soundList__item:hover, .soundBadgeList__item:hover, .historicalPlays__item:hover, .soundBadge:hover:not(.compact) {
    background-color: ${item_hov_bg} !important;
}
.soundList__item:hover *:not(.theme-dark > span), .soundBadgeList__item:hover *, .historicalPlays__item:hover *, .soundBadge:hover:not(.compact) * :not(.sc-label-blue *) {
    color: ${txt_blk} !important;
    border-color: ${txt_blk} !important;
}
.soundList__item:hover .sc-ministats:before, .soundBadgeList__item:hover .sc-ministats:before, .historicalPlays__item:hover .sc-ministats:before, .soundBadge:hover:not(.compact) .sc-ministats:before {
    background-color: ${txt_blk} !important;
}

.soundBadge:hover:not(.compact) .sc-button:before {
    background-color: ${txt_blk} !important;
}
    .soundBadge:hover:not(.compact) .sc-button:hover:before {
        background-color: ${item_hov_bg} !important;
    }
    .soundBadge:hover:not(.compact) .sc-button:hover {
        background-color: ${txt_blk} !important;
    }
.sc-label-blue {
    background-color: ${txt_blk} !important;
}


.compactTrackListItem:hover, .compactTrackListItem:hover *, .compactTrackList__moreLink:hover {
    background-color: ${bg_dark} !important;
    color: ${txt} !important;
}
.compactTrackListItem.clickToPlay.active {
    background-color: ${bg_dark} !important;
}
.compactTrackListItem.clickToPlay.active * {
    color: ${txt_strong} !important;
}

.sc-ministats:before {
    background-color: ${txt} !important;
}
.compactTrackListItem__additional {
    background: none !important;
}


.soundList__item {
    padding: 12px ${pad_big}px ${pad_big-9}px ${pad_big}px !important;
    margin-bottom: 28px !important;
    border-radius: ${radius};
    transition: ${trans};
}
.soundBadgeList__item, .historicalPlays__item {
    padding: ${pad_lil-6}px ${pad_lil}px ${pad_lil-10}px ${pad_lil}px !important;
    margin: ${margin_lil-6}px 0 ${margin_lil}px 0 !important;
    border-radius: ${radius};
}
.spotlight__item {
    border: none !important;
}
.fullHero {
    background: transparent !important;
    box-shadow: ${shadow};
}
.fullHero, .fullHero .backgroundGradient__buffer, .profileHeaderBackground__visual {
    border-radius: 0 0 ${radius} ${radius} !important;
}
.selectionPlaylistBanner, .backgroundGradient__buffer {
    box-shadow: ${shadow};
    border-radius: ${radius} !important;
}

.profileHeaderBackground {
    background: transparent !important;
}
.profileHeaderBackground .backgroundGradient__buffer {
    border-radius: 0 0 ${radius} ${radius} !important;
}
.profileHeader {
    box-shadow: ${shadow} !important;
}



.sc-artwork:not(.image__rounded, .g-avatar-badge-avatar){
    box-shadow: ${shadow};
    border-radius: ${radius} !important;
}
.sc-classic .image__whiteOutline .image__full {
    border-color: ${bg} !important;
}


.dialog__centertop {
    background-color: ${bg_light} !important;
    box-shadow: ${shadow};
    border-radius: ${radius};
    border: none !important;
}


.profileUploadFooter {
    background: none !important;
}


.dropbar__content {
    background-color: ${bg} !important;
    position: relative;
    top: -1px;
}
.searchTitle {
    background-color: ${bg} !important;
}
.listenContent__inner.listenContent__visual.sc-mx-2x {
    background-color: ${bg}
}



.sound__soundActions {
    background-color: transparent !important;
}
.soundBadge__additional {
    background: linear-gradient(90deg,${item_bg_10p},${item_bg} 17px) !important;
}
li:hover .soundBadge__additional {
    background: linear-gradient(90deg,${item_hov_bg_10p},${item_hov_bg} 17px) !important;
}


.truncatedUserDescription__wrapper:after, .truncatedAudioInfo__wrapper:after {
    background: linear-gradient(${bg_10p},${bg}) !important;
}

.linkMenu {
    background-color: ${bg_light} !important;
    border-radius: ${radius};
}

.trackMonetizationSidebarUpsell {
    border-radius: ${radius};
}

kbd {
    background-color: ${btn} !important;
    color: ${txt_blk} !important;
}


.linkMenu__link {
    color: ${btn} !important;
}
.linkMenu__link:hover {
    background-color: ${btn} !important;
    color: ${bg_light} !important;
    border-radius: ${radius};
}
.sc-button-dropdown:focus:not(.sc-button-disabled):not(:disabled) {
    box-shadow: none !important;
}
    .sc-button-dropdown.sc-button-active:not(.sc-button-dropdown-plain), .sc-button-dropdown:hover:not(.sc-button-dropdown-plain) {
        background-color: ${btn};
    }
.sc-button-dropdown:after {
    border-color: ${btn};
}
    .sc-button-dropdown:hover:after {
        border-color: ${bg};
    }


.sc-button-block:before {
    display: none !important;
}
.moreActions, .moreActions__button {
    border-radius: ${radius} !important;
    background-color: ${bg_light} !important;
}
.moreActions {
    box-shadow: ${shadow} !important;
    border: none !important;
}

ul.sc-ministats-group {
    flex-wrap: nowrap;
    text-overflow: ellipsis;
}
ul.sc-ministats-group > li.sc-ministats-item > .sc-ministats {
    display: flex;
}


.audibleEditForm__audioButtonsContainer > .sc-label.sc-label-blue {
    left: -32px;
}

.searchOptions__navigationItem.active {
    background: transparent !important;
}
.searchOptions__navigationItem.active > .g-nav-link {
    background-color: ${btn} !important;
    border-radius: ${radius} 0 0 ${radius} !important;
    color: ${txt_blk} !important;
    text-shadow: none !important;
    background-position: 5px 3px !important;
}
.searchOptions__navigationItem > .g-nav-link {
    background-position: 5px -28px !important;
    color: ${btn} !important;
}




.searchOptions__navigationItem.active:after {
    border-left-color: ${btn} !important;
}







/* icons */

/* footer player */
.playControls__play, .playControls__prev, .playControls__next, .shuffleControl:before, .shuffleControl:after, .repeatControl, .repeatControl:before, .repeatControl:after {
    background: none !important;
    background-color: ${btn} !important;
    transition: 0s !important;
}
.playControls__play {
    mask: url("${play}") no-repeat 55%;
    -webkit-mask: url("${play}") no-repeat 55%;
}
.playControls__play.playing {
    mask: url("${pause}") no-repeat 55%;
    -webkit-mask: url("${pause}") no-repeat 55%;
}
.playControls__prev {
    mask: url("${prev}") no-repeat 55%;
    -webkit-mask: url("${prev}") no-repeat 55%;
}
.playControls__next {
    mask: url("${next}") no-repeat 55%;
    -webkit-mask: url("${next}") no-repeat 55%;
}
.shuffleControl:before {
    mask: url("${shuffle}") no-repeat 55%;
    -webkit-mask: url("${shuffle}") no-repeat 55%;
}
.shuffleControl:after {
    background-color: ${txt} !important;
    mask: url("${shuffle}") no-repeat 55%;
    -webkit-mask: url("${shuffle}") no-repeat 55%;
}
.repeatControl.m-none {
    mask: url("${rep_none}") no-repeat 55%;
    -webkit-mask: url("${rep_none}") no-repeat 55%;
}
.repeatControl.m-one {
    mask: url("${rep_one}") no-repeat 55%;
    -webkit-mask: url("${rep_one}") no-repeat 55%;
}
    .repeatControl:after {
        background-color: ${txt} !important;
    }
.repeatControl.m-all {
    background-color: ${txt} !important;
    mask: url("${rep_all}") no-repeat 55%;
    -webkit-mask: url("${rep_all}") no-repeat 55%;
}
    .repeatControl:before {
        background-color: ${txt} !important;
    }

.volume__button {
    background-color: ${btn} !important;
    background-image: none !important;
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTE4IDEwLjU4NGwtMi4yOTMtMi4yOTEtMS40MTQgMS40MTQgMi4yOTMgMi4yOTEtMi4yOTEgMi4yOTEgMS40MTQgMS40MTUgMi4yOTItMi4yOTIgMi4yOTQgMi4yOTIgMS40MTQtMS40MTUtMi4yOTMtMi4yOTEgMi4yOTEtMi4yOS0xLjQxNC0xLjQxNS0yLjI5MiAyLjI5MXpNNCA5aDQuMDAyTDEyIDV2MTRjLTIuNDQ2LTIuNjY3LTMuNzc4LTQtMy45OTgtNEg0Vjl6Ii8+PC9zdmc+Cg==) no-repeat 0;
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTE4IDEwLjU4NGwtMi4yOTMtMi4yOTEtMS40MTQgMS40MTQgMi4yOTMgMi4yOTEtMi4yOTEgMi4yOTEgMS40MTQgMS40MTUgMi4yOTItMi4yOTIgMi4yOTQgMi4yOTIgMS40MTQtMS40MTUtMi4yOTMtMi4yOTEgMi4yOTEtMi4yOS0xLjQxNC0xLjQxNS0yLjI5MiAyLjI5MXpNNCA5aDQuMDAyTDEyIDV2MTRjLTIuNDQ2LTIuNjY3LTMuNzc4LTQtMy45OTgtNEg0Vjl6Ii8+PC9zdmc+Cg==) no-repeat 0;
    outline: 0;
    width: 24px;
    height: 46px;
}
.volume__sliderWrapper {
    background-color: ${btn} !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 3px;
}
.volume__sliderWrapper:before, .volume__sliderWrapper:after {
    border-color: ${btn} !important;
}
.sc-classic .volume[data-level="1"] .volume__button,
.sc-classic .volume[data-level="2"] .volume__button,
.sc-classic .volume[data-level="3"] .volume__button,
.sc-classic .volume[data-level="4"] .volume__button,
.sc-classic .volume[data-level="5"] .volume__button {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTQgOWg0LjAwMkwxMiA1djE0Yy0yLjQ0Ni0yLjY2Ny0zLjc3OC00LTMuOTk4LTRINFY5em0xMCA0YTEgMSAwIDAgMCAwLTJWOWEzIDMgMCAwIDEgMCA2di0yeiIvPjwvc3ZnPgo=);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTQgOWg0LjAwMkwxMiA1djE0Yy0yLjQ0Ni0yLjY2Ny0zLjc3OC00LTMuOTk4LTRINFY5em0xMCA0YTEgMSAwIDAgMCAwLTJWOWEzIDMgMCAwIDEgMCA2di0yeiIvPjwvc3ZnPgo=);
}
.sc-classic .volume[data-level="6"] .volume__button,
.sc-classic .volume[data-level="7"] .volume__button,
.sc-classic .volume[data-level="8"] .volume__button,
.sc-classic .volume[data-level="9"] .volume__button,
.sc-classic .volume[data-level="10"] .volume__button {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTQgOWg0LjAwMkwxMiA1djE0Yy0yLjQ0Ni0yLjY2Ny0zLjc3OC00LTMuOTk4LTRINFY5em0xMCA0YTEgMSAwIDAgMCAwLTJWOWEzIDMgMCAwIDEgMCA2di0yem0wIDRhNSA1IDAgMCAwIDAtMTBWNWE3IDcgMCAwIDEgMCAxNHYtMnoiLz48L3N2Zz4K);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZmlsbD0iIzMzMyIgZD0iTTQgOWg0LjAwMkwxMiA1djE0Yy0yLjQ0Ni0yLjY2Ny0zLjc3OC00LTMuOTk4LTRINFY5em0xMCA0YTEgMSAwIDAgMCAwLTJWOWEzIDMgMCAwIDEgMCA2di0yem0wIDRhNSA1IDAgMCAwIDAtMTBWNWE3IDcgMCAwIDEgMCAxNHYtMnoiLz48L3N2Zz4K);
}


.sc-icon, .sc-ministats:before {
    background-color: ${txt};
    background-image: none !important;
}
.sc-icon-artist-shortcut-activity {
    mask: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjMzMzMgNi42NjY3MUgxNS4zMzMzVjkuMzMzMzdIMTMuMzMzM1Y2LjY2NjcxWk05LjMzMzMzIDQuMDAwMDRIMTEuMzMzM1YxMkg5LjMzMzMzVjQuMDAwMDRaTTUuMzMzMzMgMS4zMzMzN0g3LjMzMzMzVjE0LjY2NjdINS4zMzMzM1YxLjMzMzM3Wk0xLjMzMzMzIDUuMzMzMzdIMy4zMzMzM1YxMC42NjY3SDEuMzMzMzNWNS4zMzMzN1oiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSIvPgo8L3N2Zz4K);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEzLjMzMzMgNi42NjY3MUgxNS4zMzMzVjkuMzMzMzdIMTMuMzMzM1Y2LjY2NjcxWk05LjMzMzMzIDQuMDAwMDRIMTEuMzMzM1YxMkg5LjMzMzMzVjQuMDAwMDRaTTUuMzMzMzMgMS4zMzMzN0g3LjMzMzMzVjE0LjY2NjdINS4zMzMzM1YxLjMzMzM3Wk0xLjMzMzMzIDUuMzMzMzdIMy4zMzMzM1YxMC42NjY3SDEuMzMzMzNWNS4zMzMzN1oiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSIvPgo8L3N2Zz4K);
    mask-size: 20px 20px;
    -webkit-mask-size: 20px 20px;
}
.sc-icon-calendar {
    mask: url(https://a-v2.sndcdn.com/assets/images/calendar-f8dabf8c.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/calendar-f8dabf8c.svg);
    mask-size: 18px 18px;
    -webkit-mask-size: 18px 18px;
}
.sc-icon-follower {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cGF0aCBmaWxsPSJyZ2JhKDE1MywgMTUzLCAxNTMsIDAuNykiIGQ9Ik0xOC40IDE4LjVsMi41IDUgLjIuNWg2LjlsLTIuMS00LjMtNC4xLTEuNXYtMi41YzEuMi0xLjEgMS44LTMuMiAxLjgtNS4xIDAtMi4xLTItMy42LTMuNS0zLjZzLTMuNSAxLjYtMy41IDMuNmMwIDEuOS41IDQgMS44IDUuMXYyLjVoLS4xbC4xLjN6Ii8+CiAgICA8cGF0aCBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIGQ9Ik0xNy41IDE5bC01LTEuOHYtM2MxLjQtMS4yIDItMy44IDItNS45IDAtMi40LTIuMy00LjMtNC00LjMtMS43IDAtNCAxLjgtNCA0LjMgMCAyLjIuNiA0LjcgMiA1Ljl2M2wtNSAxLjgtMi41IDVoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cGF0aCBmaWxsPSJyZ2JhKDE1MywgMTUzLCAxNTMsIDAuNykiIGQ9Ik0xOC40IDE4LjVsMi41IDUgLjIuNWg2LjlsLTIuMS00LjMtNC4xLTEuNXYtMi41YzEuMi0xLjEgMS44LTMuMiAxLjgtNS4xIDAtMi4xLTItMy42LTMuNS0zLjZzLTMuNSAxLjYtMy41IDMuNmMwIDEuOS41IDQgMS44IDUuMXYyLjVoLS4xbC4xLjN6Ii8+CiAgICA8cGF0aCBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIGQ9Ik0xNy41IDE5bC01LTEuOHYtM2MxLjQtMS4yIDItMy44IDItNS45IDAtMi40LTIuMy00LjMtNC00LjMtMS43IDAtNCAxLjgtNCA0LjMgMCAyLjIuNiA0LjcgMiA1Ljl2M2wtNSAxLjgtMi41IDVoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    mask-size: 20px 20px;
    -webkit-mask-size: 20px 20px;
}
.sc-icon-following {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cGF0aCBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIGQ9Ik0xOC40IDE4LjVsMi41IDUgLjIuNWg2LjlsLTIuMS00LjMtNC4xLTEuNXYtMi41YzEuMi0xLjEgMS44LTMuMiAxLjgtNS4xIDAtMi4xLTItMy42LTMuNS0zLjZzLTMuNSAxLjYtMy41IDMuNmMwIDEuOS41IDQgMS44IDUuMXYyLjVoLS4xbC4xLjN6Ii8+CiAgICA8cGF0aCBmaWxsPSJyZ2JhKDE1MywgMTUzLCAxNTMsIDAuNykiIGQ9Ik0xNy41IDE5bC01LTEuOHYtM2MxLjQtMS4yIDItMy44IDItNS45IDAtMi40LTIuMy00LjMtNC00LjMtMS43IDAtNCAxLjgtNCA0LjMgMCAyLjIuNiA0LjcgMiA1Ljl2M2wtNSAxLjgtMi41IDVoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cGF0aCBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIGQ9Ik0xOC40IDE4LjVsMi41IDUgLjIuNWg2LjlsLTIuMS00LjMtNC4xLTEuNXYtMi41YzEuMi0xLjEgMS44LTMuMiAxLjgtNS4xIDAtMi4xLTItMy42LTMuNS0zLjZzLTMuNSAxLjYtMy41IDMuNmMwIDEuOS41IDQgMS44IDUuMXYyLjVoLS4xbC4xLjN6Ii8+CiAgICA8cGF0aCBmaWxsPSJyZ2JhKDE1MywgMTUzLCAxNTMsIDAuNykiIGQ9Ik0xNy41IDE5bC01LTEuOHYtM2MxLjQtMS4yIDItMy44IDItNS45IDAtMi40LTIuMy00LjMtNC00LjMtMS43IDAtNCAxLjgtNCA0LjMgMCAyLjIuNiA0LjcgMiA1Ljl2M2wtNSAxLjgtMi41IDVoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    mask-size: 20px 20px;
    -webkit-mask-size: 20px 20px;
}
.sc-icon-stats {
    mask: url(https://a-v2.sndcdn.com/assets/images/stats-130d116b.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/stats-130d116b.svg);
    mask-size: 18px 18px;
    -webkit-mask-size: 18px 18px;
}
.sc-icon-like {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    mask-size: 20px 20px;
    -webkit-mask-size: 20px 20px;
}
.sc-icon-repost {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg==);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg==);
    mask-size: 20px 20px;
    -webkit-mask-size: 20px 20px;
}
.sc-icon-set {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzLjEgKDM5MDEyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19wbGF5bGlzdF8xODwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzLz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJpY19wbGF5bGlzdCIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIj4KICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi4wMDAwMDAsIDIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTIiIHg9IjAiIHk9IjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgtMiIgZmlsbC1vcGFjaXR5PSIwLjciIHBvaW50cz0iMyAwIDE0IDAgMTQgMTAgMTIgMTAgMTIgMiAzIDIiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzLjEgKDM5MDEyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19wbGF5bGlzdF8xODwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzLz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJpY19wbGF5bGlzdCIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIj4KICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi4wMDAwMDAsIDIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTIiIHg9IjAiIHk9IjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgtMiIgZmlsbC1vcGFjaXR5PSIwLjciIHBvaW50cz0iMyAwIDE0IDAgMTQgMTAgMTIgMTAgMTIgMiAzIDIiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    mask-size: 18px 18px;
    -webkit-mask-size: 18px 18px;
}
.sc-icon-sound {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cmVjdCB4PSI1IiB5PSIxMiIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIiB3aWR0aD0iMiIgaGVpZ2h0PSI0Ii8+CiAgICA8cmVjdCB4PSIyMSIgeT0iMTIiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSIgd2lkdGg9IjIiIGhlaWdodD0iNCIvPgogICAgPHJlY3QgeD0iMTciIHk9IjEwIiBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIHdpZHRoPSIyIiBoZWlnaHQ9IjgiLz4KICAgIDxyZWN0IHg9IjkiIHk9IjgiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSIgd2lkdGg9IjIiIGhlaWdodD0iMTIiLz4KICAgIDxyZWN0IHg9IjEzIiB5PSI1IiBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4Ii8+Cjwvc3ZnPgo=);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cmVjdCB4PSI1IiB5PSIxMiIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIiB3aWR0aD0iMiIgaGVpZ2h0PSI0Ii8+CiAgICA8cmVjdCB4PSIyMSIgeT0iMTIiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSIgd2lkdGg9IjIiIGhlaWdodD0iNCIvPgogICAgPHJlY3QgeD0iMTciIHk9IjEwIiBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIHdpZHRoPSIyIiBoZWlnaHQ9IjgiLz4KICAgIDxyZWN0IHg9IjkiIHk9IjgiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSIgd2lkdGg9IjIiIGhlaWdodD0iMTIiLz4KICAgIDxyZWN0IHg9IjEzIiB5PSI1IiBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4Ii8+Cjwvc3ZnPgo=);
    mask-size: 24px 24px;
    -webkit-mask-size: 24px 24px;
}
.sc-icon-comment {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2NvbW1lbnQ8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPGcgaWQ9InN0YXRzX2NvbW1lbnQiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNC45OTk2MTQ5OCwzIEMzLjg5NTI1ODEyLDMgMywzLjg4NjU1NDg0IDMsNS4wMDU5MTkwNSBMMyw3Ljk5NDA4MDk1IEMzLDkuMTAxOTE5NDUgMy44ODc0MzMyOSwxMCA0Ljk5OTYxNDk4LDEwIEwxMS4wMDAzODUsMTAgQzEyLjEwNDc0MTksMTAgMTMsOS4xMTM0NDUxNiAxMyw3Ljk5NDA4MDk1IEwxMyw1LjAwNTkxOTA1IEMxMywzLjg5ODA4MDU1IDEyLjExMjU2NjcsMyAxMS4wMDAzODUsMyBMNC45OTk2MTQ5OCwzIFogTTUsMTAgTDUsMTMgTDgsMTAgTDUsMTAgWiIgaWQ9IlJlY3RhbmdsZS00MiIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIvPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2NvbW1lbnQ8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPGcgaWQ9InN0YXRzX2NvbW1lbnQiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNC45OTk2MTQ5OCwzIEMzLjg5NTI1ODEyLDMgMywzLjg4NjU1NDg0IDMsNS4wMDU5MTkwNSBMMyw3Ljk5NDA4MDk1IEMzLDkuMTAxOTE5NDUgMy44ODc0MzMyOSwxMCA0Ljk5OTYxNDk4LDEwIEwxMS4wMDAzODUsMTAgQzEyLjEwNDc0MTksMTAgMTMsOS4xMTM0NDUxNiAxMyw3Ljk5NDA4MDk1IEwxMyw1LjAwNTkxOTA1IEMxMywzLjg5ODA4MDU1IDEyLjExMjU2NjcsMyAxMS4wMDAzODUsMyBMNC45OTk2MTQ5OCwzIFogTTUsMTAgTDUsMTMgTDgsMTAgTDUsMTAgWiIgaWQ9IlJlY3RhbmdsZS00MiIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIvPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    mask-size: 22px 22px;
    -webkit-mask-size: 22px 22px;
}
.sc-icon-user {
    mask: url(https://a-v2.sndcdn.com/assets/images/user-0edb86cb.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/user-0edb86cb.svg);
    mask-size: 16px 16px;
    -webkit-mask-size: 16px 16px;
}
.sc-icon-date {
    mask: url(https://a-v2.sndcdn.com/assets/images/calendar-f8dabf8c.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/calendar-f8dabf8c.svg);
    mask-size: 16px 16px;
    -webkit-mask-size: 16px 16px;
}
.sc-icon-duration {
    mask: url(https://a-v2.sndcdn.com/assets/images/duration-99edf63a.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/duration-99edf63a.svg);
    mask-size: 16px 16px;
    -webkit-mask-size: 16px 16px;
}
.sc-icon-license {
    mask: url(https://a-v2.sndcdn.com/assets/images/license-db5cbbae.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/license-db5cbbae.svg);
    mask-size: 16px 16px;
    -webkit-mask-size: 16px 16px;
}


/*
.sc-icon- {
    mask: url();
    -webkit-mask: url();
    mask-size: 16px 16px;
    -webkit-mask-size: 16px 16px;
}
*/

.sc-icon-large.sc-icon-history-orange, .sc-icon-large.sc-icon-history-dark {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwYXRoIGZpbGw9InJnYigyNTUsIDg1LCAwKSIgZD0iTTEuNjQzIDMuMTQzTC40MjcgMS45MjdBLjI1LjI1IDAgMDAwIDIuMTA0VjUuNzVjMCAuMTM4LjExMi4yNS4yNS4yNWgzLjY0NmEuMjUuMjUgMCAwMC4xNzctLjQyN0wyLjcxNSA0LjIxNWE2LjUgNi41IDAgMTEtMS4xOCA0LjQ1OC43NS43NSAwIDEwLTEuNDkzLjE1NCA4LjAwMSA4LjAwMSAwIDEwMS42LTUuNjg0ek03Ljc1IDRhLjc1Ljc1IDAgMDEuNzUuNzV2Mi45OTJsMi4wMjguODEyYS43NS43NSAwIDAxLS41NTcgMS4zOTJsLTIuNS0xQS43NS43NSAwIDAxNyA4LjI1di0zLjVBLjc1Ljc1IDAgMDE3Ljc1IDR6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxwYXRoIGZpbGw9InJnYigyNTUsIDg1LCAwKSIgZD0iTTEuNjQzIDMuMTQzTC40MjcgMS45MjdBLjI1LjI1IDAgMDAwIDIuMTA0VjUuNzVjMCAuMTM4LjExMi4yNS4yNS4yNWgzLjY0NmEuMjUuMjUgMCAwMC4xNzctLjQyN0wyLjcxNSA0LjIxNWE2LjUgNi41IDAgMTEtMS4xOCA0LjQ1OC43NS43NSAwIDEwLTEuNDkzLjE1NCA4LjAwMSA4LjAwMSAwIDEwMS42LTUuNjg0ek03Ljc1IDRhLjc1Ljc1IDAgMDEuNzUuNzV2Mi45OTJsMi4wMjguODEyYS43NS43NSAwIDAxLS41NTcgMS4zOTJsLTIuNS0xQS43NS43NSAwIDAxNyA4LjI1di0zLjVBLjc1Ljc1IDAgMDE3Ljc1IDR6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=);
    mask-size: 18px 18px;
    -webkit-mask-size: 18px 18px;
}
.sc-icon-large.sc-icon-sound-orange, .sc-icon-large.sc-icon-sound-dark {
    mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cmVjdCB4PSI1IiB5PSIxMiIgZmlsbD0icmdiKDI1NSwgODUsIDApIiB3aWR0aD0iMiIgaGVpZ2h0PSI0Ii8+CiAgICA8cmVjdCB4PSIyMSIgeT0iMTIiIGZpbGw9InJnYigyNTUsIDg1LCAwKSIgd2lkdGg9IjIiIGhlaWdodD0iNCIvPgogICAgPHJlY3QgeD0iMTciIHk9IjEwIiBmaWxsPSJyZ2IoMjU1LCA4NSwgMCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjgiLz4KICAgIDxyZWN0IHg9IjkiIHk9IjgiIGZpbGw9InJnYigyNTUsIDg1LCAwKSIgd2lkdGg9IjIiIGhlaWdodD0iMTIiLz4KICAgIDxyZWN0IHg9IjEzIiB5PSI1IiBmaWxsPSJyZ2IoMjU1LCA4NSwgMCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4Ii8+Cjwvc3ZnPgo=);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cmVjdCB4PSI1IiB5PSIxMiIgZmlsbD0icmdiKDI1NSwgODUsIDApIiB3aWR0aD0iMiIgaGVpZ2h0PSI0Ii8+CiAgICA8cmVjdCB4PSIyMSIgeT0iMTIiIGZpbGw9InJnYigyNTUsIDg1LCAwKSIgd2lkdGg9IjIiIGhlaWdodD0iNCIvPgogICAgPHJlY3QgeD0iMTciIHk9IjEwIiBmaWxsPSJyZ2IoMjU1LCA4NSwgMCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjgiLz4KICAgIDxyZWN0IHg9IjkiIHk9IjgiIGZpbGw9InJnYigyNTUsIDg1LCAwKSIgd2lkdGg9IjIiIGhlaWdodD0iMTIiLz4KICAgIDxyZWN0IHg9IjEzIiB5PSI1IiBmaWxsPSJyZ2IoMjU1LCA4NSwgMCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4Ii8+Cjwvc3ZnPgo=);
    mask-size: 28px 28px;
    -webkit-mask-size: 28px 28px;
}
.sc-icon-large.sc-icon-set-orange, .sc-icon-large.sc-icon-set-dark {
    mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzLjEgKDM5MDEyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19wbGF5bGlzdF8xODwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzLz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJpY19wbGF5bGlzdCIgZmlsbD0icmdiKDI1NSwgODUsIDApIj4KICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi4wMDAwMDAsIDIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTIiIHg9IjAiIHk9IjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgtMiIgZmlsbC1vcGFjaXR5PSIwLjciIHBvaW50cz0iMyAwIDE0IDAgMTQgMTAgMTIgMTAgMTIgMiAzIDIiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    -webkit-mask-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMThweCIgaGVpZ2h0PSIxOHB4IiB2aWV3Qm94PSIwIDAgMTggMTgiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzLjEgKDM5MDEyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19wbGF5bGlzdF8xODwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzLz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJpY19wbGF5bGlzdCIgZmlsbD0icmdiKDI1NSwgODUsIDApIj4KICAgICAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMi4wMDAwMDAsIDIuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8cmVjdCBpZD0iUmVjdGFuZ2xlLTIiIHg9IjAiIHk9IjQiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPgogICAgICAgICAgICAgICAgPHBvbHlnb24gaWQ9IlBhdGgtMiIgZmlsbC1vcGFjaXR5PSIwLjciIHBvaW50cz0iMyAwIDE0IDAgMTQgMTAgMTIgMTAgMTIgMiAzIDIiLz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    mask-size: 18px 18px;
    -webkit-mask-size: 18px 18px;
}

.sc-icon-large[class$="-orange"] {
    background-color: ${btn} !important;
}
.g-tabs-link.active, .g-tabs-link.active:hover {
    color: ${btn} !important;
    border-color: ${btn} !important;
}
.g-tabs-link {
    border-color: transparent !important;
}
.g-tabs-link:hover {
    border-color: ${txt_link} !important;
}





.sc-status-icon-activity {
    background-color: ${txt_link};
    background-image: none !important;
    mask: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjkiIGZpbGw9IiNGRjU1MDAiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyA4SDE0LjVWMTBIMTNWOFpNMTAgNkgxMS41VjEySDEwVjZaTTcgNEg4LjVWMTRIN1Y0Wk00IDdINS41VjExSDRWN1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjkiIGZpbGw9IiNGRjU1MDAiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMyA4SDE0LjVWMTBIMTNWOFpNMTAgNkgxMS41VjEySDEwVjZaTTcgNEg4LjVWMTRIN1Y0Wk00IDdINS41VjExSDRWN1oiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=);
    mask-size: 18px 18px;
    -webkit-mask-size: 18px 18px;
    border: none !important;
}





.sc-ministats-midium:before {
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
.sc-ministats-small:before {
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
    height: 16px !important;
    position: relative;
    top: -2px;
}

.sc-ministats-comments:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2NvbW1lbnQ8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPGcgaWQ9InN0YXRzX2NvbW1lbnQiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNC45OTk2MTQ5OCwzIEMzLjg5NTI1ODEyLDMgMywzLjg4NjU1NDg0IDMsNS4wMDU5MTkwNSBMMyw3Ljk5NDA4MDk1IEMzLDkuMTAxOTE5NDUgMy44ODc0MzMyOSwxMCA0Ljk5OTYxNDk4LDEwIEwxMS4wMDAzODUsMTAgQzEyLjEwNDc0MTksMTAgMTMsOS4xMTM0NDUxNiAxMyw3Ljk5NDA4MDk1IEwxMyw1LjAwNTkxOTA1IEMxMywzLjg5ODA4MDU1IDEyLjExMjU2NjcsMyAxMS4wMDAzODUsMyBMNC45OTk2MTQ5OCwzIFogTTUsMTAgTDUsMTMgTDgsMTAgTDUsMTAgWiIgaWQ9IlJlY3RhbmdsZS00MiIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIvPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2NvbW1lbnQ8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPGcgaWQ9InN0YXRzX2NvbW1lbnQiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNC45OTk2MTQ5OCwzIEMzLjg5NTI1ODEyLDMgMywzLjg4NjU1NDg0IDMsNS4wMDU5MTkwNSBMMyw3Ljk5NDA4MDk1IEMzLDkuMTAxOTE5NDUgMy44ODc0MzMyOSwxMCA0Ljk5OTYxNDk4LDEwIEwxMS4wMDAzODUsMTAgQzEyLjEwNDc0MTksMTAgMTMsOS4xMTM0NDUxNiAxMyw3Ljk5NDA4MDk1IEwxMyw1LjAwNTkxOTA1IEMxMywzLjg5ODA4MDU1IDEyLjExMjU2NjcsMyAxMS4wMDAzODUsMyBMNC45OTk2MTQ5OCwzIFogTTUsMTAgTDUsMTMgTDgsMTAgTDUsMTAgWiIgaWQ9IlJlY3RhbmdsZS00MiIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCIvPg0KICAgICAgICA8L2c+DQogICAgPC9nPg0KPC9zdmc+DQo=);
}
.sc-ministats-followers:before {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cGF0aCBmaWxsPSJyZ2JhKDE1MywgMTUzLCAxNTMsIDAuNykiIGQ9Ik0xOC40IDE4LjVsMi41IDUgLjIuNWg2LjlsLTIuMS00LjMtNC4xLTEuNXYtMi41YzEuMi0xLjEgMS44LTMuMiAxLjgtNS4xIDAtMi4xLTItMy42LTMuNS0zLjZzLTMuNSAxLjYtMy41IDMuNmMwIDEuOS41IDQgMS44IDUuMXYyLjVoLS4xbC4xLjN6Ii8+CiAgICA8cGF0aCBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIGQ9Ik0xNy41IDE5bC01LTEuOHYtM2MxLjQtMS4yIDItMy44IDItNS45IDAtMi40LTIuMy00LjMtNC00LjMtMS43IDAtNCAxLjgtNCA0LjMgMCAyLjIuNiA0LjcgMiA1Ljl2M2wtNSAxLjgtMi41IDVoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cGF0aCBmaWxsPSJyZ2JhKDE1MywgMTUzLCAxNTMsIDAuNykiIGQ9Ik0xOC40IDE4LjVsMi41IDUgLjIuNWg2LjlsLTIuMS00LjMtNC4xLTEuNXYtMi41YzEuMi0xLjEgMS44LTMuMiAxLjgtNS4xIDAtMi4xLTItMy42LTMuNS0zLjZzLTMuNSAxLjYtMy41IDMuNmMwIDEuOS41IDQgMS44IDUuMXYyLjVoLS4xbC4xLjN6Ii8+CiAgICA8cGF0aCBmaWxsPSJyZ2IoMTUzLCAxNTMsIDE1MykiIGQ9Ik0xNy41IDE5bC01LTEuOHYtM2MxLjQtMS4yIDItMy44IDItNS45IDAtMi40LTIuMy00LjMtNC00LjMtMS43IDAtNCAxLjgtNCA0LjMgMCAyLjIuNiA0LjcgMiA1Ljl2M2wtNSAxLjgtMi41IDVoMTlsLTIuNS01eiIvPgo8L3N2Zz4K);
}
.sc-ministats-likes:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
}
.sc-ministats-plays:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX3BsYXkgNDwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnMvPg0KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPg0KICAgICAgICA8ZyBpZD0ic3RhdHNfcGxheS0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNCwxMyBMNCwzIEwxMyw4IEw0LDEzIFoiIGlkPSJzdGF0c19wbGF5LTMiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiLz4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg0K);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX3BsYXkgNDwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnMvPg0KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPg0KICAgICAgICA8ZyBpZD0ic3RhdHNfcGxheS0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNNCwxMyBMNCwzIEwxMyw4IEw0LDEzIFoiIGlkPSJzdGF0c19wbGF5LTMiIHNrZXRjaDp0eXBlPSJNU1NoYXBlR3JvdXAiLz4NCiAgICAgICAgPC9nPg0KICAgIDwvZz4NCjwvc3ZnPg0K);
}
.sc-ministats-reposts:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg==);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigxNTMsIDE1MywgMTUzKSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg==);
}
.sc-ministats-sounds:before {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cmVjdCB4PSI1IiB5PSIxMiIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiB3aWR0aD0iMiIgaGVpZ2h0PSI0Ii8+CiAgICA8cmVjdCB4PSIyMSIgeT0iMTIiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgd2lkdGg9IjIiIGhlaWdodD0iNCIvPgogICAgPHJlY3QgeD0iMTciIHk9IjEwIiBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjgiLz4KICAgIDxyZWN0IHg9IjkiIHk9IjgiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgd2lkdGg9IjIiIGhlaWdodD0iMTIiLz4KICAgIDxyZWN0IHg9IjEzIiB5PSI1IiBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4Ii8+Cjwvc3ZnPgo=);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyOCIgaGVpZ2h0PSIyOCI+CiAgICA8cmVjdCB4PSI1IiB5PSIxMiIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiB3aWR0aD0iMiIgaGVpZ2h0PSI0Ii8+CiAgICA8cmVjdCB4PSIyMSIgeT0iMTIiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgd2lkdGg9IjIiIGhlaWdodD0iNCIvPgogICAgPHJlY3QgeD0iMTciIHk9IjEwIiBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjgiLz4KICAgIDxyZWN0IHg9IjkiIHk9IjgiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgd2lkdGg9IjIiIGhlaWdodD0iMTIiLz4KICAgIDxyZWN0IHg9IjEzIiB5PSI1IiBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiIHdpZHRoPSIyIiBoZWlnaHQ9IjE4Ii8+Cjwvc3ZnPgo=);
}
.sc-ministats-downloads:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPlJlY3RhbmdsZSAzMTwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnMvPg0KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPg0KICAgICAgICA8cGF0aCBkPSJNMywxMSBMMywxMyBMMTMsMTMgTDEzLDExIEwzLDExIFogTTMsNCBMMTMsNCBMOCwxMCBMMyw0IFogTTYsMiBMNiw0IEwxMCw0IEwxMCwyIEw2LDIgWiIgaWQ9IlJlY3RhbmdsZS0zMSIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPlJlY3RhbmdsZSAzMTwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnMvPg0KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPg0KICAgICAgICA8cGF0aCBkPSJNMywxMSBMMywxMyBMMTMsMTMgTDEzLDExIEwzLDExIFogTTMsNCBMMTMsNCBMOCwxMCBMMyw0IFogTTYsMiBMNiw0IEwxMCw0IEwxMCwyIEw2LDIgWiIgaWQ9IlJlY3RhbmdsZS0zMSIgZmlsbD0icmdiKDE1MywgMTUzLCAxNTMpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
}




.sc-button {
    background: transparent;
    border: solid ${btn} 1px !important;
    color: ${btn} !important;
}
.sc-button span {
    color: ${btn} !important;
}
.sc-button:before {
    background-image: none !important;
    background-color: ${btn};
}
.sc-button:hover {
    background-color: ${btn};
    color: ${bg} !important;
}
.sc-button:hover:before {
    background-color: ${bg} !important;
}

.sc-button.sc-button-white, .sc-button-primary:not(.sc-button-selected) {
    background-color: ${btn} !important;
    color: ${bg} !important;
}
.sc-button-primary:not(.sc-button-selected) span {
    color: ${bg} !important;
}
.sc-button-primary:not(.sc-button-selected)::before {
    background-color: ${bg} !important;
}
.sc-button.sc-button-white:hover, .sc-button-primary:not(.sc-button-selected):hover {
    background-color: ${btn_on} !important;
    border-color: ${btn_on} !important;
}
.sc-button-toolbar > button {
    margin-left: 4px !important;
}


/* "...more" dropdown buttons */
.moreActions__button {
    border: none !important;
}
.moreActions__button:hover {
    background-color: ${btn} !important;
    color: ${bg_light} !important;
}
.moreActions__button:hover span {
    background-color: ${btn} !important;
    color: ${bg_light} !important;
}




/* play button */

.sc-button-play:before {
    border: none !important;
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjhweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgOCAxNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuMi4yICg5OTgzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5QbGF5IDI4PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9ImJ1dHRvbnMiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjUzLjAwMDAwMCwgLTg5MC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTE2NTMsOTA0IEwxNjU0Ljg0NjE1LDg5NyBMMTY1Myw4OTAgTDE2NjEsODk3IEwxNjUzLDkwNCBaIiBpZD0iUGxheS0yOCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjhweCIgaGVpZ2h0PSIxNHB4IiB2aWV3Qm94PSIwIDAgOCAxNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuMi4yICg5OTgzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5QbGF5IDI4PC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9ImJ1dHRvbnMiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNjUzLjAwMDAwMCwgLTg5MC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTE2NTMsOTA0IEwxNjU0Ljg0NjE1LDg5NyBMMTY1Myw4OTAgTDE2NjEsODk3IEwxNjUzLDkwNCBaIiBpZD0iUGxheS0yOCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
}
.sc-button-pause:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjhweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgOCAxMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuMi4yICg5OTgzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5QYXVzZSAyNDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxnIGlkPSJidXR0b25zIiBza2V0Y2g6dHlwZT0iTVNBcnRib2FyZEdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4Mi4wMDAwMDAsIC05MzUuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNjg3LDkzNSBMMTY4Nyw5NDUgTDE2OTAsOTQ1IEwxNjkwLDkzNSBMMTY4Nyw5MzUgWiBNMTY4Miw5MzUgTDE2ODIsOTQ1IEwxNjg1LDk0NSBMMTY4NSw5MzUgTDE2ODIsOTM1IFoiIGlkPSJQYXVzZS0yNCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjhweCIgaGVpZ2h0PSIxMHB4IiB2aWV3Qm94PSIwIDAgOCAxMCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDMuMi4yICg5OTgzKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5QYXVzZSAyNDwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPgogICAgICAgIDxnIGlkPSJidXR0b25zIiBza2V0Y2g6dHlwZT0iTVNBcnRib2FyZEdyb3VwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTY4Mi4wMDAwMDAsIC05MzUuMDAwMDAwKSIgZmlsbD0iI0ZGRkZGRiI+CiAgICAgICAgICAgIDxwYXRoIGQ9Ik0xNjg3LDkzNSBMMTY4Nyw5NDUgTDE2OTAsOTQ1IEwxNjkwLDkzNSBMMTY4Nyw5MzUgWiBNMTY4Miw5MzUgTDE2ODIsOTQ1IEwxNjg1LDk0NSBMMTY4NSw5MzUgTDE2ODIsOTM1IFoiIGlkPSJQYXVzZS0yNCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
}


.sc-button-play:active, .sc-button-play:focus {
    background-color: ${btn_on} !important;
    border-color: ${btn_on} !important;
}
.soundList__item:hover .sc-button-play:active, .soundList__item:hover .sc-button-play:focus {
    background-color: ${btn_on_dark} !important;
    border-color: ${btn_on_dark} !important;
}
.sc-button-play:active:before, .sc-button-play:focus:before {
    background-color: ${item_bg} !important;
}
.soundList__item:hover .sc-button-play:active:before, .soundList__item:hover .sc-button-play:focus:before {
    background-color: ${item_hov_bg} !important;
}

.sc-button-xlarge.sc-button-play:before {
    mask-size: 12px 18px !important;
    -webkit-mask-size: 12px 18px !important;
}

.playButton.m-stretch:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE4cHgiIGhlaWdodD0iMjlweCIgdmlld0JveD0iMCAwIDE4IDI5IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4yLjIgKDk5ODMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlBsYXkgNjA8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4KICAgICAgICA8ZyBpZD0iYnV0dG9ucyIgc2tldGNoOnR5cGU9Ik1TQXJ0Ym9hcmRHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2NjUuMDAwMDAwLCAtODE4LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8cGF0aCBkPSJNMTY2NSw4NDcgTDE2NjkuMTUzODUsODMyLjUgTDE2NjUsODE4IEwxNjgzLDgzMi41IEwxNjY1LDg0NyBaIiBpZD0iUGxheS02MCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE4cHgiIGhlaWdodD0iMjlweCIgdmlld0JveD0iMCAwIDE4IDI5IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4yLjIgKDk5ODMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlBsYXkgNjA8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcz48L2RlZnM+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4KICAgICAgICA8ZyBpZD0iYnV0dG9ucyIgc2tldGNoOnR5cGU9Ik1TQXJ0Ym9hcmRHcm91cCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2NjUuMDAwMDAwLCAtODE4LjAwMDAwMCkiIGZpbGw9IiNGRkZGRkYiPgogICAgICAgICAgICA8cGF0aCBkPSJNMTY2NSw4NDcgTDE2NjkuMTUzODUsODMyLjUgTDE2NjUsODE4IEwxNjgzLDgzMi41IEwxNjY1LDg0NyBaIiBpZD0iUGxheS02MCIgc2tldGNoOnR5cGU9Ik1TU2hhcGVHcm91cCI+PC9wYXRoPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    mask-size: 40% 60%;
    -webkit-mask-size: 40% 60%;
    mask-position: 60%;
    -webkit-mask-position: 60%;
}
.playButton.m-stretch.sc-button-pause:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE4cHgiIGhlaWdodD0iMjdweCIgdmlld0JveD0iMCAwIDE4IDI3IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4yLjIgKDk5ODMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlBhdXNlIDYwPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9ImJ1dHRvbnMiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzQxLjAwMDAwMCwgLTgxOC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTE3NTIsODE4IEwxNzUyLDg0NSBMMTc1OSw4NDUgTDE3NTksODE4IEwxNzUyLDgxOCBaIE0xNzQxLDgxOCBMMTc0MSw4NDUgTDE3NDgsODQ1IEwxNzQ4LDgxOCBMMTc0MSw4MTggWiIgaWQ9IlBhdXNlLTYwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE4cHgiIGhlaWdodD0iMjdweCIgdmlld0JveD0iMCAwIDE4IDI3IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnNrZXRjaD0iaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoL25zIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4yLjIgKDk5ODMpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPgogICAgPHRpdGxlPlBhdXNlIDYwPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGRlZnM+PC9kZWZzPgogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+CiAgICAgICAgPGcgaWQ9ImJ1dHRvbnMiIHNrZXRjaDp0eXBlPSJNU0FydGJvYXJkR3JvdXAiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xNzQxLjAwMDAwMCwgLTgxOC4wMDAwMDApIiBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHBhdGggZD0iTTE3NTIsODE4IEwxNzUyLDg0NSBMMTc1OSw4NDUgTDE3NTksODE4IEwxNzUyLDgxOCBaIE0xNzQxLDgxOCBMMTc0MSw4NDUgTDE3NDgsODQ1IEwxNzQ4LDgxOCBMMTc0MSw4MTggWiIgaWQ9IlBhdXNlLTYwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIj48L3BhdGg+CiAgICAgICAgPC9nPgogICAgPC9nPgo8L3N2Zz4=);
    mask-size: 42% 56%;
    -webkit-mask-size: 42% 56%;
    mask-position: 50% 51%;
    -webkit-mask-position: 50% 51%;
}

.soundTitle__playButton > .sc-button-play {
    margin: 0 4px;
}

.soundTitle__playButton.soundTitle__playButtonHero > .sc-button-play,
.soundBadge__playButton > .sc-button-play,
.playableTile__playButton > .sc-button-play,
.selectionPlaylistBanner__playButton > .sc-button-play {

    background-color: ${txt_blk} !important;
    border: none !important;
}
.soundTitle__playButton.soundTitle__playButtonHero > .sc-button-play::before,
.soundBadge__playButton > .sc-button-play::before,
.playableTile__playButton > .sc-button-play::before,
.selectionPlaylistBanner__playButton > .sc-button-play::before {

    background-color: ${txt} !important;
}
    .soundTitle__playButton.soundTitle__playButtonHero > .sc-button-play:hover,
    .soundBadge__playButton > .sc-button-play:hover,
    .playableTile__playButton > .sc-button-play:hover,
    .selectionPlaylistBanner__playButton > .sc-button-play:hover {

        background-color: ${txt} !important;
    }
    .soundTitle__playButton.soundTitle__playButtonHero > .sc-button-play:hover::before,
    .soundBadge__playButton > .sc-button-play.playButton.sc-button.sc-button-large:hover::before,
    .playableTile__playButton > .sc-button-play:hover::before,
    .selectionPlaylistBanner__playButton > .sc-button-play:hover::before {

        background-color: ${txt_blk} !important;
    }
.soundTitle__playButton.soundTitle__playButtonHero {
    margin-right: 12px !important;
}


.sc-button.sc-button-translucent:not(.sc-button-cta) {
    background-color: ${btn} !important;
    opacity: 0.8;
    color: ${bg} !important;
}
.sc-button.sc-button-translucent:not(.sc-button-cta)::before {
    background-color: ${bg} !important;
}
.sc-button.sc-button-translucent:not(.sc-button-cta):hover {
    opacity: 1;
}


.soundList__item:hover .sc-button:before, .soundBadgeList__item:hover .sc-button:before, .historicalPlays__item:hover .sc-button:before {
    background-color: ${txt_blk};
}
.soundList__item:hover .sc-button:hover, .soundBadgeList__item:hover .sc-button:hover, .historicalPlays__item:hover .sc-button:hover {
    background-color: ${txt_blk};
    color: ${item_hov_bg} !important;
}
.soundList__item:hover .sc-button:hover:before, .soundBadgeList__item:hover .sc-button:hover:before, .historicalPlays__item:hover .sc-button:hover:before {
    background-color: ${item_hov_bg} !important;
}



.sc-button-group-small > button:before {
    mask-size: 16px 16px;
    -webkit-mask-size: 16px 16px;
}

.sc-button-like:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPnN0YXRzX2xpa2VzX2dyZXk8L3RpdGxlPg0KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPg0KICAgIDxkZWZzLz4NCiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBza2V0Y2g6dHlwZT0iTVNQYWdlIj4NCiAgICAgICAgPHBhdGggZD0iTTEwLjgwNDk4MTgsMyBDOC43ODQ3MTU3OSwzIDguMDAwNjUyODUsNS4zNDQ4NjQ4NiA4LjAwMDY1Mjg1LDUuMzQ0ODY0ODYgQzguMDAwNjUyODUsNS4zNDQ4NjQ4NiA3LjIxMjk2Mzg3LDMgNS4xOTYwNDQ5NCwzIEMzLjQ5NDMxMzE4LDMgMS43NDgzNzQsNC4wOTU5MjY5NCAyLjAzMDA4OTk2LDYuNTE0MzA1MzIgQzIuMzczNzI3NjUsOS40NjY3Mzc3NSA3Ljc1NDkxOTE3LDEyLjk5Mjg3MzggNy45OTMxMDk1OCwxMy4wMDEwNTU3IEM4LjIzMTI5OTk4LDEzLjAwOTIzNzggMTMuNzMwOTgyOCw5LjI3ODUzNzggMTMuOTgxNDU5LDYuNTAxMjQwNSBDMTQuMTg3ODY0Nyw0LjIwMDk3MDIzIDEyLjUwNjcxMzYsMyAxMC44MDQ5ODE4LDMgWiIgaWQ9IkltcG9ydGVkLUxheWVycyIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
}
.sc-button-repost:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigzNCwgMzQsIDM0KSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg==);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggMy4wLjMgKDc4OTEpIC0gaHR0cDovL3d3dy5ib2hlbWlhbmNvZGluZy5jb20vc2tldGNoIC0tPg0KICA8dGl0bGU+c3RhdHNfcmVwb3N0PC90aXRsZT4NCiAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogIDxkZWZzLz4NCiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgPGcgaWQ9InJlcG9zdC0iIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigzNCwgMzQsIDM0KSI+DQogICAgICA8cGF0aCBkPSJNMiw2IEwyLDExLjAwMDM4NSBDMiwxMi4xMDQ3NDE5IDIuOTAxOTUwMzYsMTMgNC4wMDg1MzAyLDEzIEwxMC45OTU3MzQ5LDEzIEwxMC45OTU3MzQ5LDEzIEwxMCwxMyBMMTAsMTMgTDgsMTEgTDQsMTEgTDQsNiBMMy41LDYgTDYsNiBMMywzIEwwLDYgTDIsNiBMMiw2IFogTTYsMyBMNS4wMDQyNjUxLDMgTDExLjk5MTQ2OTgsMyBDMTMuMDk4MDQ5NiwzIDE0LDMuODk1MjU4MTIgMTQsNC45OTk2MTQ5OCBMMTQsMTAgTDEyLDEwIEwxMiw1IEw4LDUgTDYsMyBaIE0xNiwxMCBMMTAsMTAgTDEzLDEzIEwxNiwxMCBaIiBpZD0iUmVjdGFuZ2xlLTQzIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KICA8L2c+DQo8L3N2Zz4NCg==);
}
.sc-button-share:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/share-e2febe1d.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/share-e2febe1d.svg);
}
.sc-button-copylink:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/copylink-f0c85b1d.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/copylink-f0c85b1d.svg);
}
.sc-button-edit:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/edit-2fe52d66.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/edit-2fe52d66.svg);
}
.sc-button-more:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iNHB4IiB2aWV3Qm94PSIwIDAgMTQgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8dGl0bGU+bW9yZTwvdGl0bGU+CiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSI3IiBjeT0iMiIgcj0iMiIvPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIyIiByPSIyIi8+CiAgPC9nPgo8L3N2Zz4K);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE0cHgiIGhlaWdodD0iNHB4IiB2aWV3Qm94PSIwIDAgMTQgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8dGl0bGU+bW9yZTwvdGl0bGU+CiAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIyIi8+CiAgICA8Y2lyY2xlIGN4PSI3IiBjeT0iMiIgcj0iMiIvPgogICAgPGNpcmNsZSBjeD0iMTIiIGN5PSIyIiByPSIyIi8+CiAgPC9nPgo8L3N2Zz4K);
    mask-size: 14px 4px !important;
    -webkit-mask-size: 14px 4px !important;
}
.sc-button-queue:before {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMGgyMHYyMEgweiIvPgogICAgICAgIDxwYXRoIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNNCA5aDEwdjJINFY5em0wIDRoMTB2Mkg0di0yem0wLThoOHYySDRWNXptMTAtNGw0IDMtNCAzVjF6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZD0iTTAgMGgyMHYyMEgweiIvPgogICAgICAgIDxwYXRoIGZpbGw9InJnYigzNCwgMzQsIDM0KSIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNNCA5aDEwdjJINFY5em0wIDRoMTB2Mkg0di0yem0wLThoOHYySDRWNXptMTAtNGw0IDMtNCAzVjF6Ii8+CiAgICA8L2c+Cjwvc3ZnPgo=);
    mask-size: 20px 20px !important;
    -webkit-mask-size: 20px 20px !important;
}
.sc-button-follow:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KICA8cGF0aCBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTUuNTQyIDEuMTY3YzIuNzcgMCAzLjM4NiAyLjkxNiAyLjE1NSA2LjEyNSAzLjE2OSAxLjMwOCAzLjM4NiAzLjk3NyAzLjM4NiA0Ljk1OEgwYzAtLjk4MS4yMTgtMy42NSAzLjM4Ny00Ljk1OC0xLjIzMi0zLjIxOC0uNjE2LTYuMTI1IDIuMTU1LTYuMTI1em0wIDEuMTY2Yy0xLjU4NCAwLTIuMTI3IDEuNzctMS4wNjYgNC41NDIuMjI2LjU5LS4wNiAxLjI1NC0uNjQ0IDEuNDk1LTEuNTE3LjYyNi0yLjI2MyAxLjU3Mi0yLjUzNyAyLjcxM2g4LjQ5NGMtLjI3NS0xLjE0MS0xLjAyLTIuMDg3LTIuNTM3LTIuNzEzYTEuMTY3IDEuMTY3IDAgMCAxLS42NDQtMS40OTZjMS4wNi0yLjc2NC41MTYtNC41NC0xLjA2Ni00LjU0em02LjQxNC0uNTgzYy4xNyAwIC4yOTQuMTMuMjk0LjI5MlYzLjVoMS40NThjLjE1NyAwIC4yOTIuMTMyLjI5Mi4yOTR2LjU3OGMwIC4xNy0uMTMuMjk1LS4yOTIuMjk1SDEyLjI1djEuNDU4YS4yOTYuMjk2IDAgMCAxLS4yOTQuMjkyaC0uNTc4YS4yODkuMjg5IDAgMCAxLS4yOTUtLjI5MlY0LjY2N0g5LjYyNWEuMjk2LjI5NiAwIDAgMS0uMjkyLS4yOTV2LS41NzhjMC0uMTcuMTMxLS4yOTQuMjkyLS4yOTRoMS40NThWMi4wNDJjMC0uMTU3LjEzMi0uMjkyLjI5NS0uMjkyaC41Nzh6Ii8+Cjwvc3ZnPgo=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNCIgaGVpZ2h0PSIxNCIgdmlld0JveD0iMCAwIDE0IDE0Ij4KICA8cGF0aCBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTUuNTQyIDEuMTY3YzIuNzcgMCAzLjM4NiAyLjkxNiAyLjE1NSA2LjEyNSAzLjE2OSAxLjMwOCAzLjM4NiAzLjk3NyAzLjM4NiA0Ljk1OEgwYzAtLjk4MS4yMTgtMy42NSAzLjM4Ny00Ljk1OC0xLjIzMi0zLjIxOC0uNjE2LTYuMTI1IDIuMTU1LTYuMTI1em0wIDEuMTY2Yy0xLjU4NCAwLTIuMTI3IDEuNzctMS4wNjYgNC41NDIuMjI2LjU5LS4wNiAxLjI1NC0uNjQ0IDEuNDk1LTEuNTE3LjYyNi0yLjI2MyAxLjU3Mi0yLjUzNyAyLjcxM2g4LjQ5NGMtLjI3NS0xLjE0MS0xLjAyLTIuMDg3LTIuNTM3LTIuNzEzYTEuMTY3IDEuMTY3IDAgMCAxLS42NDQtMS40OTZjMS4wNi0yLjc2NC41MTYtNC41NC0xLjA2Ni00LjU0em02LjQxNC0uNTgzYy4xNyAwIC4yOTQuMTMuMjk0LjI5MlYzLjVoMS40NThjLjE1NyAwIC4yOTIuMTMyLjI5Mi4yOTR2LjU3OGMwIC4xNy0uMTMuMjk1LS4yOTIuMjk1SDEyLjI1djEuNDU4YS4yOTYuMjk2IDAgMCAxLS4yOTQuMjkyaC0uNTc4YS4yODkuMjg5IDAgMCAxLS4yOTUtLjI5MlY0LjY2N0g5LjYyNWEuMjk2LjI5NiAwIDAgMS0uMjkyLS4yOTV2LS41NzhjMC0uMTcuMTMxLS4yOTQuMjkyLS4yOTRoMS40NThWMi4wNDJjMC0uMTU3LjEzMi0uMjkyLjI5NS0uMjkyaC41Nzh6Ii8+Cjwvc3ZnPgo=);
    mask-size: 14px 14px !important;
    -webkit-mask-size: 14px 14px !important;
}
.sc-button-insights:before {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBkPSJNMyA2LjVjMC0uMjc2LjIxNi0uNS40OTUtLjVoMi4wMWMuMjczIDAgLjQ5NS4yMjkuNDk1LjV2MTFjMCAuMjc2LS4yMTYuNS0uNDk1LjVoLTIuMDFDMy4yMjIgMTggMyAxNy43NzEgMyAxNy41di0xMXptNy00LjAwNGMwLS4yNzQuMjE2LS40OTYuNDk1LS40OTZoMi4wMWMuMjczIDAgLjQ5NS4yMjYuNDk1LjQ5NnYxNS4wMDhjMCAuMjc0LS4yMTYuNDk2LS40OTUuNDk2aC0yLjAxYy0uMjczIDAtLjQ5NS0uMjI2LS40OTUtLjQ5NlYyLjQ5NnptNyA3LjAxNGMwLS4yODIuMjE2LS41MS40OTUtLjUxaDIuMDFjLjI3MyAwIC40OTUuMjIyLjQ5NS41MXY3Ljk4YzAgLjI4Mi0uMjE2LjUxLS40OTUuNTFoLTIuMDFjLS4yNzMgMC0uNDk1LS4yMjItLjQ5NS0uNTFWOS41MXpNMi41IDIwaDE5Yy4yNzYgMCAuNS4yMjQuNS41djFjMCAuMjc2LS4yMjQuNS0uNS41aC0xOWMtLjI3NiAwLS41LS4yMjQtLjUtLjV2LTFjMC0uMjc2LjIyNC0uNS41LS41eiIvPgogICAgPC9nPgo8L3N2Zz4K);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBkPSJNMyA2LjVjMC0uMjc2LjIxNi0uNS40OTUtLjVoMi4wMWMuMjczIDAgLjQ5NS4yMjkuNDk1LjV2MTFjMCAuMjc2LS4yMTYuNS0uNDk1LjVoLTIuMDFDMy4yMjIgMTggMyAxNy43NzEgMyAxNy41di0xMXptNy00LjAwNGMwLS4yNzQuMjE2LS40OTYuNDk1LS40OTZoMi4wMWMuMjczIDAgLjQ5NS4yMjYuNDk1LjQ5NnYxNS4wMDhjMCAuMjc0LS4yMTYuNDk2LS40OTUuNDk2aC0yLjAxYy0uMjczIDAtLjQ5NS0uMjI2LS40OTUtLjQ5NlYyLjQ5NnptNyA3LjAxNGMwLS4yODIuMjE2LS41MS40OTUtLjUxaDIuMDFjLjI3MyAwIC40OTUuMjIyLjQ5NS41MXY3Ljk4YzAgLjI4Mi0uMjE2LjUxLS40OTUuNTFoLTIuMDFjLS4yNzMgMC0uNDk1LS4yMjItLjQ5NS0uNTFWOS41MXpNMi41IDIwaDE5Yy4yNzYgMCAuNS4yMjQuNS41djFjMCAuMjc2LS4yMjQuNS0uNS41aC0xOWMtLjI3NiAwLS41LS4yMjQtLjUtLjV2LTFjMC0uMjc2LjIyNC0uNS41LS41eiIvPgogICAgPC9nPgo8L3N2Zz4K);
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
.sc-button-startstation:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/start-station-ea018c5a.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/start-station-ea018c5a.svg);
    mask-size: 16px 12px !important;
    -webkit-mask-size: 16px 12px !important;
}
.sc-button-addtoset:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPkdyb3VwPC90aXRsZT4NCiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4NCiAgICA8ZGVmcy8+DQogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgICAgIDxnIGlkPSJhZGQtdG8tcGxheWxpc3QiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigzNCwgMzQsIDM0KSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNMTIsMyBMMTIsMSBMMTQsMSBMMTQsMyBMMTYsMyBMMTYsNSBMMTQsNSBMMTQsNyBMMTIsNyBMMTIsNSBMMTAsNSBMMTAsMyBMMTIsMyBaIE0wLDMgTDAsNSBMOCw1IEw4LDMgTDAsMyBaIE0wLDcgTDAsOSBMMTAsOSBMMTAsNyBMMCw3IFogTTAsMTEgTDAsMTMgTDEwLDEzIEwxMCwxMSBMMCwxMSBaIiBpZD0iUmVjdGFuZ2xlLTIwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgICAgIDwvZz4NCiAgICA8L2c+DQo8L3N2Zz4NCg==);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPkdyb3VwPC90aXRsZT4NCiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4NCiAgICA8ZGVmcy8+DQogICAgPGcgaWQ9IlBhZ2UtMSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc2tldGNoOnR5cGU9Ik1TUGFnZSI+DQogICAgICAgIDxnIGlkPSJhZGQtdG8tcGxheWxpc3QiIHNrZXRjaDp0eXBlPSJNU0xheWVyR3JvdXAiIGZpbGw9InJnYigzNCwgMzQsIDM0KSI+DQogICAgICAgICAgICA8cGF0aCBkPSJNMTIsMyBMMTIsMSBMMTQsMSBMMTQsMyBMMTYsMyBMMTYsNSBMMTQsNSBMMTQsNyBMMTIsNyBMMTIsNSBMMTAsNSBMMTAsMyBMMTIsMyBaIE0wLDMgTDAsNSBMOCw1IEw4LDMgTDAsMyBaIE0wLDcgTDAsOSBMMTAsOSBMMTAsNyBMMCw3IFogTTAsMTEgTDAsMTMgTDEwLDEzIEwxMCwxMSBMMCwxMSBaIiBpZD0iUmVjdGFuZ2xlLTIwIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgICAgIDwvZz4NCiAgICA8L2c+DQo8L3N2Zz4NCg==);
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
.sc-button-report:before {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00OTQgLTg0NykiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik01MDMgODQ3Ljc1YzQuNTU0IDAgOC4yNSAzLjY5NiA4LjI1IDguMjVzLTMuNjk2IDguMjUtOC4yNSA4LjI1LTguMjUtMy42OTYtOC4yNS04LjI1IDMuNjk2LTguMjUgOC4yNS04LjI1em0wIDEuNWMtMy43MjYgMC02Ljc1IDMuMDI0LTYuNzUgNi43NXMzLjAyNCA2Ljc1IDYuNzUgNi43NSA2Ljc1LTMuMDI0IDYuNzUtNi43NS0zLjAyNC02Ljc1LTYuNzUtNi43NXptMCA5YTEuMTI1IDEuMTI1IDAgMTEwIDIuMjUgMS4xMjUgMS4xMjUgMCAwMTAtMi4yNXptLjU4Ny02YS41LjUgMCAwMS41LjVsLS4wMDEuMDM3LS4zMDIgNC4xYS41MDEuNTAxIDAgMDEtLjQ5OS40NjNoLS41N2EuNTAyLjUwMiAwIDAxLS41LS40NjNsLS4zLTQuMWEuNS41IDAgMDEuNDYxLS41MzZsLjAzNy0uMDAxaDEuMTc0eiIvPgogICAgPC9nPgo8L3N2Zz4K);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDE4IDE4Ij4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00OTQgLTg0NykiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPHBhdGggZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik01MDMgODQ3Ljc1YzQuNTU0IDAgOC4yNSAzLjY5NiA4LjI1IDguMjVzLTMuNjk2IDguMjUtOC4yNSA4LjI1LTguMjUtMy42OTYtOC4yNS04LjI1IDMuNjk2LTguMjUgOC4yNS04LjI1em0wIDEuNWMtMy43MjYgMC02Ljc1IDMuMDI0LTYuNzUgNi43NXMzLjAyNCA2Ljc1IDYuNzUgNi43NSA2Ljc1LTMuMDI0IDYuNzUtNi43NS0zLjAyNC02Ljc1LTYuNzUtNi43NXptMCA5YTEuMTI1IDEuMTI1IDAgMTEwIDIuMjUgMS4xMjUgMS4xMjUgMCAwMTAtMi4yNXptLjU4Ny02YS41LjUgMCAwMS41LjVsLS4wMDEuMDM3LS4zMDIgNC4xYS41MDEuNTAxIDAgMDEtLjQ5OS40NjNoLS41N2EuNTAyLjUwMiAwIDAxLS41LS40NjNsLS4zLTQuMWEuNS41IDAgMDEuNDYxLS41MzZsLjAzNy0uMDAxaDEuMTc0eiIvPgogICAgPC9nPgo8L3N2Zz4K);
    mask-size: 18px 18px !important;
    -webkit-mask-size: 18px 18px !important;
}
.sc-button-camera:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/camera-2d93bb05.svg);
    mask-size: 15px 12px !important;
    -webkit-mask-size: 15px 12px !important;
}
.sc-button-reply:before {
    mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALRJREFUGNNjYCAexMnhkYyxTHiJUzIqIeFX/n+sUhHMEZMT/ucBIRbJMKHw3Un/s8Ew7H/Y27CTYe1h0gi9+5L+Z8Bh2v+U/3H/w74Eu0Kl30xueZ/2HxWm/o/4GqQIlv7P+3Py7CfJ/0Hw//7Ph2+cOXhl0ouMP3HzoPr/s/zP23Ar6W8C0Gn/uf+r/bf/X/liX+MhJAf+Dzx7Ju0XEl/kVTmKD/7rP9qDwudG8+J/SQaqAgBt9GUu05AvWgAAAABJRU5ErkJggg==);
    -webkit-mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALRJREFUGNNjYCAexMnhkYyxTHiJUzIqIeFX/n+sUhHMEZMT/ucBIRbJMKHw3Un/s8Ew7H/Y27CTYe1h0gi9+5L+Z8Bh2v+U/3H/w74Eu0Kl30xueZ/2HxWm/o/4GqQIlv7P+3Py7CfJ/0Hw//7Ph2+cOXhl0ouMP3HzoPr/s/zP23Ar6W8C0Gn/uf+r/bf/X/liX+MhJAf+Dzx7Ju0XEl/kVTmKD/7rP9qDwudG8+J/SQaqAgBt9GUu05AvWgAAAABJRU5ErkJggg==);
}
.sc-button-message:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/message-a0c65ef1.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/message-a0c65ef1.svg);
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
.sc-button-delete:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/delete-d90bf5e4.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/delete-d90bf5e4.svg);
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
.sc-button-mastering:before {
    mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxIDEpIj48cGF0aCBkPSJNMyA1LjczMlYxNEgxVjUuNzMyYy4yOTQuMTcuNjM2LjI2OCAxIC4yNjhhMS45OSAxLjk5IDAgMDAxLS4yNjh6TTMgMHYyLjI2OEExLjk5IDEuOTkgMCAwMDIgMmExLjk5IDEuOTkgMCAwMC0xIC4yNjhWMGgyek04IDExLjczMlYxNEg2di0yLjI2OGMuMjk0LjE3LjYzNi4yNjggMSAuMjY4YTEuOTkgMS45OSAwIDAwMS0uMjY4ek04IDB2OC4yNjhBMS45OSAxLjk5IDAgMDA3IDhhMS45OSAxLjk5IDAgMDAtMSAuMjY4VjBoMnpNMTMgNS43MzJWMTRoLTJWNS43MzJjLjI5NC4xNy42MzYuMjY4IDEgLjI2OGExLjk5IDEuOTkgMCAwMDEtLjI2OHpNMTMgMHYyLjI2OEExLjk5IDEuOTkgMCAwMDEyIDJhMS45OSAxLjk5IDAgMDAtMSAuMjY4VjBoMnoiIGZpbGw9InJnYig1MSwgNTEsIDUxKSIvPjxjaXJjbGUgc3Ryb2tlPSJyZ2IoNTEsIDUxLCA1MSkiIGN4PSIxMi4wMDEiIGN5PSI0IiByPSIyIi8+PGNpcmNsZSBzdHJva2U9InJnYig1MSwgNTEsIDUxKSIgY3g9IjcuMDAxIiBjeT0iMTAiIHI9IjIiLz48Y2lyY2xlIHN0cm9rZT0icmdiKDUxLCA1MSwgNTEpIiBjeD0iMi4wMDEiIGN5PSI0IiByPSIyIi8+PC9nPjwvc3ZnPgo=);
    -webkit-mask: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxIDEpIj48cGF0aCBkPSJNMyA1LjczMlYxNEgxVjUuNzMyYy4yOTQuMTcuNjM2LjI2OCAxIC4yNjhhMS45OSAxLjk5IDAgMDAxLS4yNjh6TTMgMHYyLjI2OEExLjk5IDEuOTkgMCAwMDIgMmExLjk5IDEuOTkgMCAwMC0xIC4yNjhWMGgyek04IDExLjczMlYxNEg2di0yLjI2OGMuMjk0LjE3LjYzNi4yNjggMSAuMjY4YTEuOTkgMS45OSAwIDAwMS0uMjY4ek04IDB2OC4yNjhBMS45OSAxLjk5IDAgMDA3IDhhMS45OSAxLjk5IDAgMDAtMSAuMjY4VjBoMnpNMTMgNS43MzJWMTRoLTJWNS43MzJjLjI5NC4xNy42MzYuMjY4IDEgLjI2OGExLjk5IDEuOTkgMCAwMDEtLjI2OHpNMTMgMHYyLjI2OEExLjk5IDEuOTkgMCAwMDEyIDJhMS45OSAxLjk5IDAgMDAtMSAuMjY4VjBoMnoiIGZpbGw9InJnYig1MSwgNTEsIDUxKSIvPjxjaXJjbGUgc3Ryb2tlPSJyZ2IoNTEsIDUxLCA1MSkiIGN4PSIxMi4wMDEiIGN5PSI0IiByPSIyIi8+PGNpcmNsZSBzdHJva2U9InJnYig1MSwgNTEsIDUxKSIgY3g9IjcuMDAxIiBjeT0iMTAiIHI9IjIiLz48Y2lyY2xlIHN0cm9rZT0icmdiKDUxLCA1MSwgNTEpIiBjeD0iMi4wMDEiIGN5PSI0IiByPSIyIi8+PC9nPjwvc3ZnPgo=);
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
.sc-button-distribute:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iZGlzdHJpYnV0ZV9pY29uIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNNCwxNCBMMTYsMTQgTDE2LDE2IEw0LDE2IEw0LDE0IFogTTEwLjUyNjMxNTgsNyBMMTAuNTI2MzE1OCwxMyBMOS40NzM2ODQyMSwxMyBMOS40NzM2ODQyMSw3IEw3Ljg5NDczNjg0LDcgTDEwLDQgTDEyLjEwNTI2MzIsNyBMMTAuNTI2MzE1OCw3IFogTTQuNTM1MTkwMjYsOC4yNTY4MTAzNyBMNy40MDMwNzI0NCwxMi4zNTI1NzA2IEw2LjU0MDgwNzEzLDEyLjk1NjMzNTMgTDMuNjcyOTI0OTUsOC44NjA1NzUwNCBMMi4zNzk1MjY5OCw5Ljc2NjIyMjA0IEwyLjM4MzMyODI5LDYuMTAxMjM2NTcgTDUuODI4NTg4MjIsNy4zNTExNjMzNyBMNC41MzUxOTAyNiw4LjI1NjgxMDM3IFogTTE2LjU4NTU3NTcsOC44MzkwODk5NiBMMTMuNzE3NjkzNSwxMi45MzQ4NTAyIEwxMi44NTU0MjgyLDEyLjMzMTA4NTUgTDE1LjcyMzMxMDQsOC4yMzUzMjUyOSBMMTQuNDI5OTEyNCw3LjMyOTY3ODI4IEwxNy44NzUxNzIzLDYuMDc5NzUxNDkgTDE3Ljg3ODk3MzcsOS43NDQ3MzY5NiBMMTYuNTg1NTc1Nyw4LjgzOTA4OTk2IFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICAgIDwvZz4KPC9zdmc+Cg==);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8ZyBpZD0iZGlzdHJpYnV0ZV9pY29uIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNNCwxNCBMMTYsMTQgTDE2LDE2IEw0LDE2IEw0LDE0IFogTTEwLjUyNjMxNTgsNyBMMTAuNTI2MzE1OCwxMyBMOS40NzM2ODQyMSwxMyBMOS40NzM2ODQyMSw3IEw3Ljg5NDczNjg0LDcgTDEwLDQgTDEyLjEwNTI2MzIsNyBMMTAuNTI2MzE1OCw3IFogTTQuNTM1MTkwMjYsOC4yNTY4MTAzNyBMNy40MDMwNzI0NCwxMi4zNTI1NzA2IEw2LjU0MDgwNzEzLDEyLjk1NjMzNTMgTDMuNjcyOTI0OTUsOC44NjA1NzUwNCBMMi4zNzk1MjY5OCw5Ljc2NjIyMjA0IEwyLjM4MzMyODI5LDYuMTAxMjM2NTcgTDUuODI4NTg4MjIsNy4zNTExNjMzNyBMNC41MzUxOTAyNiw4LjI1NjgxMDM3IFogTTE2LjU4NTU3NTcsOC44MzkwODk5NiBMMTMuNzE3NjkzNSwxMi45MzQ4NTAyIEwxMi44NTU0MjgyLDEyLjMzMTA4NTUgTDE1LjcyMzMxMDQsOC4yMzUzMjUyOSBMMTQuNDI5OTEyNCw3LjMyOTY3ODI4IEwxNy44NzUxNzIzLDYuMDc5NzUxNDkgTDE3Ljg3ODk3MzcsOS43NDQ3MzY5NiBMMTYuNTg1NTc1Nyw4LjgzOTA4OTk2IFoiIGlkPSJDb21iaW5lZC1TaGFwZSIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz4KICAgIDwvZz4KPC9zdmc+Cg==);
    mask-size: 20px 20px !important;
    -webkit-mask-size: 20px 20px !important;
}
.sc-button-facebook:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/facebook-02b09d52.png);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/facebook-02b09d52.png);
    mask-size: 10px !important;
    -webkit-mask-size: 10px !important;
}
.sc-button-google:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CiAgPGc+CiAgICA8cGF0aCBmaWxsPSIjRUE0MzM1IiBkPSJNMjQgOS41YzMuNTQgMCA2LjcxIDEuMjIgOS4yMSAzLjZsNi44NS02Ljg1QzM1LjkgMi4zOCAzMC40NyAwIDI0IDAgMTQuNjIgMCA2LjUxIDUuMzggMi41NiAxMy4yMmw3Ljk4IDYuMTlDMTIuNDMgMTMuNzIgMTcuNzQgOS41IDI0IDkuNXoiLz4KICAgIDxwYXRoIGZpbGw9IiM0Mjg1RjQiIGQ9Ik00Ni45OCAyNC41NWMwLTEuNTctLjE1LTMuMDktLjM4LTQuNTVIMjR2OS4wMmgxMi45NGMtLjU4IDIuOTYtMi4yNiA1LjQ4LTQuNzggNy4xOGw3LjczIDZjNC41MS00LjE4IDcuMDktMTAuMzYgNy4wOS0xNy42NXoiLz4KICAgIDxwYXRoIGZpbGw9IiNGQkJDMDUiIGQ9Ik0xMC41MyAyOC41OWMtLjQ4LTEuNDUtLjc2LTIuOTktLjc2LTQuNTlzLjI3LTMuMTQuNzYtNC41OWwtNy45OC02LjE5Qy45MiAxNi40NiAwIDIwLjEyIDAgMjRjMCAzLjg4LjkyIDcuNTQgMi41NiAxMC43OGw3Ljk3LTYuMTl6Ii8+CiAgICA8cGF0aCBmaWxsPSIjMzRBODUzIiBkPSJNMjQgNDhjNi40OCAwIDExLjkzLTIuMTMgMTUuODktNS44MWwtNy43My02Yy0yLjE1IDEuNDUtNC45MiAyLjMtOC4xNiAyLjMtNi4yNiAwLTExLjU3LTQuMjItMTMuNDctOS45MWwtNy45OCA2LjE5QzYuNTEgNDIuNjIgMTQuNjIgNDggMjQgNDh6Ii8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDQ4djQ4SDB6Ii8+CiAgPC9nPgo8L3N2Zz4K);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZpZXdCb3g9IjAgMCA0OCA0OCI+CiAgPGc+CiAgICA8cGF0aCBmaWxsPSIjRUE0MzM1IiBkPSJNMjQgOS41YzMuNTQgMCA2LjcxIDEuMjIgOS4yMSAzLjZsNi44NS02Ljg1QzM1LjkgMi4zOCAzMC40NyAwIDI0IDAgMTQuNjIgMCA2LjUxIDUuMzggMi41NiAxMy4yMmw3Ljk4IDYuMTlDMTIuNDMgMTMuNzIgMTcuNzQgOS41IDI0IDkuNXoiLz4KICAgIDxwYXRoIGZpbGw9IiM0Mjg1RjQiIGQ9Ik00Ni45OCAyNC41NWMwLTEuNTctLjE1LTMuMDktLjM4LTQuNTVIMjR2OS4wMmgxMi45NGMtLjU4IDIuOTYtMi4yNiA1LjQ4LTQuNzggNy4xOGw3LjczIDZjNC41MS00LjE4IDcuMDktMTAuMzYgNy4wOS0xNy42NXoiLz4KICAgIDxwYXRoIGZpbGw9IiNGQkJDMDUiIGQ9Ik0xMC41MyAyOC41OWMtLjQ4LTEuNDUtLjc2LTIuOTktLjc2LTQuNTlzLjI3LTMuMTQuNzYtNC41OWwtNy45OC02LjE5Qy45MiAxNi40NiAwIDIwLjEyIDAgMjRjMCAzLjg4LjkyIDcuNTQgMi41NiAxMC43OGw3Ljk3LTYuMTl6Ii8+CiAgICA8cGF0aCBmaWxsPSIjMzRBODUzIiBkPSJNMjQgNDhjNi40OCAwIDExLjkzLTIuMTMgMTUuODktNS44MWwtNy43My02Yy0yLjE1IDEuNDUtNC45MiAyLjMtOC4xNiAyLjMtNi4yNiAwLTExLjU3LTQuMjItMTMuNDctOS45MWwtNy45OCA2LjE5QzYuNTEgNDIuNjIgMTQuNjIgNDggMjQgNDh6Ii8+CiAgICA8cGF0aCBmaWxsPSJub25lIiBkPSJNMCAwaDQ4djQ4SDB6Ii8+CiAgPC9nPgo8L3N2Zz4K);
    mask-size: 10px !important;
    -webkit-mask-size: 10px !important;
}


/*
could not mask apple logo

.sc-button-apple:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/apple-b8eb965f.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/apple-b8eb965f.svg);
    mask-size: 18px !important;
    -webkit-mask-size: 18px !important;
}
*/

.sc-button-pageleft:before {
    mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAOklEQVQoz2NgoAmQEFVchUdaMVTpldJ/PHqV/oMgHr04FCD0YlWArJc8BQStIMKRRHmTiIAiKqhJBACxeD5HJ1bD4gAAAABJRU5ErkJggg==);
    -webkit-mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAOklEQVQoz2NgoAmQEFVchUdaMVTpldJ/PHqV/oMgHr04FCD0YlWArJc8BQStIMKRRHmTiIAiKqhJBACxeD5HJ1bD4gAAAABJRU5ErkJggg==);
}
.sc-button-pageright:before {
    mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAPUlEQVQoz2NgoBpQXCUhileB0n+lV4qh+BUAIR5zIArwmANXgMscZAVYzSFJAX4r8DsSvzfxBxTBoCYbAACdKz5HKUMPPAAAAABJRU5ErkJggg==);
    -webkit-mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAPUlEQVQoz2NgoBpQXCUhileB0n+lV4qh+BUAIR5zIArwmANXgMscZAVYzSFJAX4r8DsSvzfxBxTBoCYbAACdKz5HKUMPPAAAAABJRU5ErkJggg==);
}
.sc-button-download:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPlJlY3RhbmdsZSAzMTwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnMvPg0KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPg0KICAgICAgICA8cGF0aCBkPSJNMywxMSBMMywxMyBMMTMsMTMgTDEzLDExIEwzLDExIFogTTMsNCBMMTMsNCBMOCwxMCBMMyw0IFogTTYsMiBMNiw0IEwxMCw0IEwxMCwyIEw2LDIgWiIgaWQ9IlJlY3RhbmdsZS0zMSIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+DQo8c3ZnIHdpZHRoPSIxNnB4IiBoZWlnaHQ9IjE2cHgiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxuczpza2V0Y2g9Imh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaC9ucyI+DQogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+DQogICAgPHRpdGxlPlJlY3RhbmdsZSAzMTwvdGl0bGU+DQogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+DQogICAgPGRlZnMvPg0KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHNrZXRjaDp0eXBlPSJNU1BhZ2UiPg0KICAgICAgICA8cGF0aCBkPSJNMywxMSBMMywxMyBMMTMsMTMgTDEzLDExIEwzLDExIFogTTMsNCBMMTMsNCBMOCwxMCBMMyw0IFogTTYsMiBMNiw0IEwxMCw0IEwxMCwyIEw2LDIgWiIgaWQ9IlJlY3RhbmdsZS0zMSIgZmlsbD0icmdiKDM0LCAzNCwgMzQpIiBza2V0Y2g6dHlwZT0iTVNTaGFwZUdyb3VwIi8+DQogICAgPC9nPg0KPC9zdmc+DQo=);
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
.sc-button-upload:before {
    mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzLjEgKDM5MDEyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19yZXBsYWNlX2ZpbGVfMTY8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcy8+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iaWNfcmVwbGFjZV9maWxlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjAwMDAwMCwgMi4wMDAwMDApIiBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiPgogICAgICAgICAgICA8cGF0aCBkPSJNMCw5IEwwLDExIEwxMCwxMSBMMTAsOSBMMCw5IFogTTEwLDYgTDAsNiBMNSwwIEwxMCw2IFogTTMsNiBMMyw4IEw3LDggTDcsNiBMMyw2IFoiIGlkPSJTaGFwZSIvPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    -webkit-mask: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMTYgMTYiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8IS0tIEdlbmVyYXRvcjogU2tldGNoIDQzLjEgKDM5MDEyKSAtIGh0dHA6Ly93d3cuYm9oZW1pYW5jb2RpbmcuY29tL3NrZXRjaCAtLT4KICAgIDx0aXRsZT5pY19yZXBsYWNlX2ZpbGVfMTY8L3RpdGxlPgogICAgPGRlc2M+Q3JlYXRlZCB3aXRoIFNrZXRjaC48L2Rlc2M+CiAgICA8ZGVmcy8+CiAgICA8ZyBpZD0iUGFnZS0xIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iaWNfcmVwbGFjZV9maWxlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzLjAwMDAwMCwgMi4wMDAwMDApIiBmaWxsPSJyZ2IoMzQsIDM0LCAzNCkiPgogICAgICAgICAgICA8cGF0aCBkPSJNMCw5IEwwLDExIEwxMCwxMSBMMTAsOSBMMCw5IFogTTEwLDYgTDAsNiBMNSwwIEwxMCw2IFogTTMsNiBMMyw4IEw3LDggTDcsNiBMMyw2IFoiIGlkPSJTaGFwZSIvPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+);
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
.sc-button-gotostats:before {
    mask: url(https://a-v2.sndcdn.com/assets/images/stats-6a4d17e6.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/stats-6a4d17e6.svg);
    mask-size: 14px 14px !important;
    -webkit-mask-size: 14px 14px !important;
}

/*         |
           v
.sc-button-:before {
    mask: url();
    -webkit-mask: url();
    mask-size: 16px 16px !important;
    -webkit-mask-size: 16px 16px !important;
}
*/


.reportCopyright {
    background-image: none !important;
    border: none !important;
}
.reportCopyright:hover {
    background-color: transparent;
}
.reportCopyright:before {
    content: "a";
    color: transparent !important;
    background-color: ${btn} !important;
    mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAnElEQVR4AZXNUQqDMBCE4TlWKApbiGBEpVYphQb6knvkaDnalLWK60uhfjA+5CfBX1+SBAvJiPKmCc7HizwZaQJ73MvEucx4FRtsPy+BA8c84pHtDetUcmXDwC53uGf7BBKcXFhTg7a0uJWFR4B0ChoMnLgGEhGBqEwQuAayQOmoLaihQS89vnQ2+w1ePHbwhgaVVDjoGE4cLLifPnBzeJR4+XAqAAAAAElFTkSuQmCC);
    -webkit-mask: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAQAAACR313BAAAAnElEQVR4AZXNUQqDMBCE4TlWKApbiGBEpVYphQb6knvkaDnalLWK60uhfjA+5CfBX1+SBAvJiPKmCc7HizwZaQJ73MvEucx4FRtsPy+BA8c84pHtDetUcmXDwC53uGf7BBKcXFhTg7a0uJWFR4B0ChoMnLgGEhGBqEwQuAayQOmoLaihQS89vnQ2+w1ePHbwhgaVVDjoGE4cLLifPnBzeJR4+XAqAAAAAElFTkSuQmCC);
    -webkit-mask-position: 0 0 !important;
    position: absolute;
    left: 0px;
}
.reportCopyright:hover:before {
    color: transparent !important;
    background-color: ${txt_link} !important;
}
.reportCopyright__full {
    color: ${btn} !important;
}
.reportCopyright:hover >.reportCopyright__full {
    color: ${txt_link} !important;

}


.hintButton {
    background-image: none !important;
    background-color: ${btn} !important;
    mask: url(https://a-v2.sndcdn.com/assets/images/tooltip_inactive-17c43e39.svg);
    -webkit-mask: url(https://a-v2.sndcdn.com/assets/images/tooltip_inactive-17c43e39.svg);
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: 50%;
    -webkit-mask-position: 50%;
    mask-size: 100%;
    -webkit-mask-size: 100%;
}

.playbackSoundBadge__actions > * {
    margin: 0 3px;
}
.playbackSoundBadge__showQueue {
    border: solid ${btn} 1px !important;
    border-radius: 3px;
}
    .playbackSoundBadge.m-queueVisible .playbackSoundBadge__showQueue {
        border-color: ${btn_on} !important;
    }
.playbackSoundBadge .playbackSoundBadge__queueIcon {
    fill: ${btn} !important;
}
    .playbackSoundBadge.m-queueVisible .playbackSoundBadge__queueIcon {
        fill: ${btn_on} !important;
    }

.tileGallery__sliderButton {
    background-color: ${btn};
    border: none !important;
}
    .tileGallery__sliderButton:hover {
        transform: scale(1.125);
        box-shadow: ${shadow};
    }
.tileGallery__sliderButton:after {
    border-color: ${bg} !important;
}



/* mask common properties (load at last) */

.sc-icon, .sc-button:before, .sc-ministats:before {
    mask-position: 50%;
    -webkit-mask-position: 50%;
    mask-repeat: no-repeat !important;
    -webkit-mask-repeat: no-repeat !important;
}

/* button liked / reposted / followed */

.sc-button-selected {
    color: ${btn_on} !important;
    border-color: ${btn_on} !important;
}
.sc-button-selected:before {
    background-color: ${btn_on} !important;
}
.sc-button-selected:hover {
    background-color: ${btn_on};
    color: ${bg} !important;
}
.sc-button-selected:hover:before {
    background-color: ${bg} !important;
}
.soundList__item:hover .sc-button-selected, .soundBadgeList__item:hover .sc-button-selected, .historicalPlays__item:hover .sc-button-selected {
    border-color: ${btn_on_dark} !important;
    color: ${btn_on_dark} !important;
}
.soundList__item:hover .sc-button-selected:before, .soundBadgeList__item:hover .sc-button-selected:before, .historicalPlays__item:hover .sc-button-selected:before {
    background-color: ${btn_on_dark} !important;
    border-color: ${btn_on_dark} !important;
}
.soundList__item:hover .sc-button-selected:hover, .soundBadgeList__item:hover .sc-button-selected:hover, .historicalPlays__item:hover .sc-button-selected:hover {
    background-color: ${btn_on_dark} !important;
    color: ${item_hov_bg} !important;
}
.soundList__item:hover .sc-button-selected:hover:before, .soundBadgeList__item:hover .sc-button-selected:hover:before, .historicalPlays__item:hover .sc-button-selected:hover:before {
    background-color: ${item_hov_bg} !important;
}




.sc-button:disabled {
    background-color: ${btn_50p} !important;
}
.sc-checkbox-check {
    background-color: ${btn} !important;
}


.sc-button.sc-pending, .sc-button.sc-pending:focus, .sc-button.sc-pending:hover {
    background-color: hsl(0deg 0% 50%) !important;
}



.accountSettings__deleteAccount {
    padding: 2px 9px 2px 8px !important;
}
 {
    color: ${txt_blk} !important;
}




/* stats placeholder */

.topStatsItemPlaceholder__text:before, .topStatsItemPlaceholder__text:after {
    background-color: ${txt} !important;
}
.topStatsItemPlaceholder__visual, .topStatsItemPlaceholder__visual:before, .topStatsItemPlaceholder__visual:after {
    border-color: ${txt} !important;
}
.country > .topStatsItemPlaceholder__visual, .city > .topStatsItemPlaceholder__visual {
    background-image: none !important;
    background-color: ${txt};
    -mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIHN0cm9rZT0iI0U1RTVFNSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMy41IDEyLjd2MjYuMDYzQzUuMDEyIDM5LjkxIDcuNTEgNDAuNSAxMC45OTggNDAuNWMyLjUyNCAwIDMuODc2LS4yMzggMTIuNDM3LTEuOTg3IDIuODgzLS41OSA0LjkxNC0uOTcgNi45NTctMS4yODcgMy4yNDItLjUwMiA2LjA1My0uNzUgOC42MjUtLjcxNyAyLjA2Mi4xMSAzLjc0OC41IDUuMjM2IDEuMTA4LjYzLjI1NyAxLjc5NS44NiAyLjE0MiAxLjAyNS4wMi0uMTEuMDM3LS4yNzcuMDQ4LS41MDQuMDIzLS40My4wMy0zLjc4NS4wNTctNS4xNFYxM2MwLTEuOTc0LTQuNjEtMy41NDMtNy41NjMtMy40MzUtMi4zOTItLjI1Ny02LjgyLjIzNy0xMy4xNyAxLjM0LTEuMDkuMTktMi4yMy4zOTUtMy40Ny42MjUtMS42MDUuMjk4LTYuNDggMS4yMzMtNi44OTMgMS4zMS0yLjI5LjQzMi0zLjYwNy42NTItNC4zNjMuNzE4QTE4Ljk2MiAxOC45NjIgMCAwIDEgMy41IDEyLjd6IiAvPgo8L3N2Zz4K);
    -webkit-mask-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIHN0cm9rZT0iI0U1RTVFNSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiBkPSJNMy41IDEyLjd2MjYuMDYzQzUuMDEyIDM5LjkxIDcuNTEgNDAuNSAxMC45OTggNDAuNWMyLjUyNCAwIDMuODc2LS4yMzggMTIuNDM3LTEuOTg3IDIuODgzLS41OSA0LjkxNC0uOTcgNi45NTctMS4yODcgMy4yNDItLjUwMiA2LjA1My0uNzUgOC42MjUtLjcxNyAyLjA2Mi4xMSAzLjc0OC41IDUuMjM2IDEuMTA4LjYzLjI1NyAxLjc5NS44NiAyLjE0MiAxLjAyNS4wMi0uMTEuMDM3LS4yNzcuMDQ4LS41MDQuMDIzLS40My4wMy0zLjc4NS4wNTctNS4xNFYxM2MwLTEuOTc0LTQuNjEtMy41NDMtNy41NjMtMy40MzUtMi4zOTItLjI1Ny02LjgyLjIzNy0xMy4xNyAxLjM0LTEuMDkuMTktMi4yMy4zOTUtMy40Ny42MjUtMS42MDUuMjk4LTYuNDggMS4yMzMtNi44OTMgMS4zMS0yLjI5LjQzMi0zLjYwNy42NTItNC4zNjMuNzE4QTE4Ljk2MiAxOC45NjIgMCAwIDEgMy41IDEyLjd6IiAvPgo8L3N2Zz4K);
    mask-repeat: no-repeat;
    -webkit-mask-repeat: no-repeat;
    mask-position: left -5px;
    -webkit-mask-position: left -5px;
}




/* comment input bar */

.commentForm__wrapper {
    background-color: transparent !important;
    border-radius: ${radius};
}
.commentForm__wrapper:focus-within {
    border-color: ${btn} !important;
}
#tokenInput__comment {
    background-color: transparent !important;
    border: none !important;
    color: ${txt};
}
.commentForm.m-large .commentForm__avatar {
    transform: scale(0.7);
}




.playableTile__actionButton.sc-button:not(.sc-button-selected):before {
    background-color: ${txt} !important;
}
    .playableTile__actionButton.sc-button:hover {
        background-color: ${txt} !important;
    }
    .playableTile__actionButton.sc-button.sc-button-selected:hover {
        background-color: ${btn_on} !important;
    }
    .playableTile__actionButton.sc-button:hover:before {
        background-color: ${txt_blk} !important;
    }




.paging-eof:before {
    display: none !important;
}




.loading {
    background: transparent url("${loading}") no-repeat 50% !important;
    background-size: 40px !important;
}



#content > div > div.l-listen-wrapper > div.l-about-main > div > div:nth-child(1) > div > div {
    border: none;
}
.sc-classic .listenEngagement {
    box-shadow: none;
}




</>
        `);
    }


    else if (location.hostname === 'insights-ui.soundcloud.com') {
        document.head.insertAdjacentHTML('afterend', String.raw`


<style>
html, body, main {
    background-color: ${bg} !important;
}
[class*=Card_Card__] {
    background-color: ${bg_light} !important;
    border: none !important;
    border-radius: ${radius} !important;
    box-shadow: ${shadow} !important;
}
[class*=Card_CardFooter__] {
    background: transparent !important;
}
rect:not([class*=Bar_GraphBar]) {
    fill: transparent;
}
rect {
    mask: none;
}
* {
    color: ${txt} !important;
}
[class*=List_Active__] {
    color: ${btn} !important;
}
[class*=Pill_Pill]:not([class*=Pill_isActive]), [class*=Pill_Pill]:not([class*=Pill_isActive]) * {
    color: ${bg} !important;
    background-color: ${btn} !important;
}
[class*=Pill_isActive] {
    background-color: ${txt_blk} !important;
}
[class*=GraphBar_YAxisItem__] {
    background-color: ${bg_light} !important;
    color: ${txt_strong} !important;
}
[class*=List_ListItemContent__]:hover {
    background-color: ${item_hov_bg} !important;
}
[class*=List_ListItemContent__]:hover * {
    color: ${txt_blk} !important;
}
[class*=DropdownMenu_DropdownToggle__] {
    background-color: ${btn} !important;
    border-radius: ${radius} !important;
    padding: 0 12px !important;
}
[class*=DropdownMenu_SelectionListLabel] {
    display: none;
}
[class*=DropdownMenu_ListContainer__] {
    background-color: ${bg_light} !important;
}
[class*=DropdownMenu_DropdownContentContainer__] {
    border: none !important;
    background: none !important;
    box-shadow: ${shadow} !important;
}
[class*=DropdownMenu_ListLink___]:hover {
    background-color: ${btn} !important;
    border-radius: ${radius} !important;
}
[class*=DropdownMenu_ListLink__]:hover span {
    color: ${bg_light} !important;
}
[class*=DropdownMenu_ListLabel__] > span {
    color: ${btn} !important;
}
[class*=DropdownMenu_DropdownToggleButton__] * {
    color: ${bg} !important;
}
::-webkit-scrollbar{
  display: none;
}
</>


        `);
    }


    else {
        document.head.insertAdjacentHTML('afterend', String.raw`
<style>
#app, .connect-form {
    background-color: ${bg};
}
span {
    color: ${txt};
}
a {
    color: ${btn} !important;
}
.auth-method-separator:before, .auth-method-separator:after {
    border-color: ${border};
}
h2 {
    color: ${txt_strong} !important;
}
</>
        `);
    }

})();