// ==UserScript==
// @name          AmaLand Network - Photo Albums
// @description   Reveals download links for Photo Albums
// @include       http://members.429members.com/*
// @include       http://members.amaland.com/*
// @include       http://members.asianpornmembers.com/*
// @include       http://members.bestgfvideos.com/*
// @include       http://members.boyfriendnudes.com/*
// @include       http://members.gf-members.com/*
// @include       http://members.gfarchive.com/*
// @include       http://members.gfpornbox.com/*
// @include       http://members.gfpornmovies.com/*
// @include       http://members.gfpornvideos.com/*
// @include       http://members.gfsexvideos.com/*
// @include       http://members.gfvideohub.com/*
// @include       http://members.gossipmembers.com/*
// @include       http://members.madporn.com/*
// @include       http://members.porndvdhub.com/*
// @include       http://members.sexadgang.dk/*
// @include       http://members.spankbox.com/*
// @include       http://members.thehardcorenetwork.com/*
// @include       http://members.toonpass.com/*
// @run-at        document-start
// @author        Lucifuga
// @version       0.2
// @grant         GM_addStyle
// @namespace https://greasyfork.org/users/160947
// @downloadURL https://update.greasyfork.org/scripts/35987/AmaLand%20Network%20-%20Photo%20Albums.user.js
// @updateURL https://update.greasyfork.org/scripts/35987/AmaLand%20Network%20-%20Photo%20Albums.meta.js
// ==/UserScript==
 
GM_addStyle ( "                                     \
    .upgrade-trial-dialog, .b-modal.__b-popup1__, .b-modal.__b-popup2__, .trialDownloadDialog.trial-popup.default-popup.hide, .favoriteTrialDialog.favorite-trial-popup.trial-popup.default-popup.hide, .dvdTrialDownloadDialog.dvd-trial-popup.trial-popup.default-popup.hide, .promotionbox.visible-md.visible-lg, .ads-block-bottom-wrap.row.visible-md.visible-lg, .ad.visible-md.visible-lg.topVideoListAdZone, .col-md-4.visible-lg.visible-md, .btn.default-btn.caps.trialDownload, .video-player-wrapper, .btn.default-btn.trialFavoriteMembershipPopup, .dvd-header-promotion.clearfix.visible-md.visible-lg {                                   \
        display: none !important;       \
    }                                               \
    .fa.fa-download {                                   \
        font-size: 60px !important;       \
    }                                               \
    span.btn.default-btn.addFavorite.hidden-md.hidden-lg, .messageBlockFavorite.video-block-message.hidden-md.hidden-lg.hide {                                   \
        display: block !important;       \
    }                                               \
    .layout-page, .side-box.side-bar.sideBar, .clearfix.footer, .header-topic-responsive.clearfix, .side-box.top-bar.clearfix.topBar, .video-player-bar.clearfix, video-comments-box.clearfix, input, .video-comments-box.clearfix, .comments-container.commentsContainer, .comment-field.commentMessage.commentField, .default-btn, .video-player-rating-item, .show-more-link, .header-topic-responsive.header-topic-video-list, .header-topic, .dropdown-menu.dropDownMenu.unstyled-list.clearfix, .header-topic-responsive, .notification-info, .main-form-input, .search-form .selectbox, .selectbox .dropdown, .video-box .views, .comment-dialog, a, .actor-aka, .biography-label, .bio-text, .selectbox {                                   \
        background-color: #000 !important;       \
        color: #FFF !important;       \
    }                                               \
    .Embedded {                                   \
        color: #FF0002 !important;       \
    }                                               \
    #playerId {                                   \
        height: 100% !important;       \
    }                                               \
    a.btn.default-btn.caps.hidden-md.hidden-lg {                                   \
        display: block !important;       \
        position:       fixed;          \
        top:            0px;            \
        left:           0px;            \
        height:         70px;            \
        width:          70px;            \
    }                                               \
" );
