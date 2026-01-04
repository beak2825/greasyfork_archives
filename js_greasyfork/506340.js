// ==UserScript==
// @name        Better HiAnime
// @namespace   http://tampermonkey.net/
// @version     3.1
// @author      Ghoste
// @description Improves UX on HiAnime: Removes blur, Adds rounded corners, Speeds up the website & more.
// @icon        https://hianime.to/images/icons-192.png
// @license     MIT
// @include     *://*hianime*/*
// @grant       GM_addStyle
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/506340/Better%20HiAnime.user.js
// @updateURL https://update.greasyfork.org/scripts/506340/Better%20HiAnime.meta.js
// ==/UserScript==

/* This is the default configuration for the script, This should be good enough for most people,
   but if it isnt, then feel free to modify it to your taste, i've labeled everything so it shouldnt be too difficult.

   If you dont like a part of the style,
   you can remove it by selecting everything from:

   HERE -->> /* Example Label */
/*           blabla {
             font-weight: 400;
             } <<-- TO HERE (including the "}" otherwise you'll break the script lol.)
*/


GM_addStyle ( `
    /* Change font weight so its just a bit bolder. */
    html body {
    font-weight: 400;
    }
    /* Adds rounded corners to the "show more" button. */
    html body .btn-showmore {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to the "Today,Week,Month" background */
    html body .nav-fill {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to the "Today,Week,Month" buttons themselves */
    html body .nav-link {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to Genre buttons. */
    html body .cbox.cbox-genres ul li a {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to cboxes (frames). */
    html body .cbox {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to search items. */
    html body .nav-item {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to the search "view all results" button. */
    html body .nav-bottom {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to the filter button. */
    html body .filter-icon {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to the search box */
    html body .search-input {
    border-radius: 15px !important;
    }
    /* Adds rounded corners to the search pop-up (suggestions) */
    html body .search-result-pop {
    top: 50px !important;
    border-radius: 15px !important;
    }
    /* Removes the topbar blur. */
    html body #header.fixed {
    background-color: rgb(32 31 49) !important;
    backdrop-filter: none !important;
    }
    /* Adds rounded corners to images. */
    html body .film-poster {
    border-radius: 8px !important;
    }
    /* Removes the image blur effect on hover. */
    html body .flw-item .film-poster .film-poster-ahref:after {
    backdrop-filter:none !important;
    }
    /* Removes the background blur for the hover pop-up. */
    html body .qtip-default {
    border-radius: 15px !important;
    backdrop-filter:none !important;
    background: rgb(81 80 100) !important;
    }
    /* Changes the transition times for hover effects. */
    html body .film-poster-ahref i, .film-poster-ahref:after, .film-poster-ahref:before, .film-poster-img, .preform.preform-dark .form-control, .trending-list {
    transition: all .2s ease 0s !important;
    -webkit-transition: all .2s ease 0s !important;
    }
    html body #header.header-home, #sidebar_menu, .block-rating .button-rate, .film-poster-ahref:after, .flw-item, .live-thumbnail-img, .lv-list .item, .profile-avatar, .rep-in .btn i, .toggle-onoff, .toggle-onoff>span, div.detail .is-info>div {
    transition: all .2s ease 0s;
    -webkit-transition: none !important;
    }
    /* Removes the description ad */
    html body .film-text.m-hide {
    display:none !important;
    }
    /* Removes the sharing section */
    html body .share-buttons {
    display:none !important;
    }
    /* Fixes the empty area left after removing the sharing section */
    html body .ani_detail-stage {
    margin-bottom: 0px !important;
    }
    /* Removes the comment shortcut. */
    html body .dt-comment {
    display:none !important;
    }
    /* Removes the Ad Banner for mobile devices. */
    html body .intro-app {
    display:none !important;
    }
    /* Removes the menu blur */
    html body #sidebar_menu_bg {
    backdrop-filter: none !important;
    }
    /* Corrects the menu color */
    html body #sidebar_menu {
    background: rgb(48 47 69) !important;
    }
    /* Corrects the user menu color */
    html body #user_menu {
    background-color: rgb(32 31 49) !important;
    backdrop-filter: none !important;
    }
` );