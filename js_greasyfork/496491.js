// ==UserScript==
// @name 2015 TO 2017 STEAM
// @namespace //userstyles.world/user/ItsJustAPlayer
// @version 6.5
// @description original theme is by userstyles.world/user/ItsJustAPlayerV5 works perfectly with https://greasyfork.org/en/scripts/496492-steam-favicon
// @author .....
// @grant GM_addStyle
// @run-at document-start
// @match *://*.steamcommunity.com/*
// @match *://*.help.steampowered.com/*
// @match *://*.steampowered.com/*
// @downloadURL https://update.greasyfork.org/scripts/496491/2015%20TO%202017%20STEAM.user.js
// @updateURL https://update.greasyfork.org/scripts/496491/2015%20TO%202017%20STEAM.meta.js
// ==/UserScript==

(function() {
let css = `
/*STEAM 2014
BY IJAP, ASSISTED BY TERSIS WILVIN
CSS BASED OFF STEAM 2014'S CSS*/
/*
 * HEADER
 */
/* apply 16px padding to the sides of all the page-wide divs to prevent content
	from touching the sides on small resolutions */
div#footer,
div#global_header,
div#store_header,
div#main,
div.page_area {
    padding-left: 16px;
    padding-right: 16px;
}
 
body.v6 div#store_header {
    background-color: transparent;
}
.home_page_content .responsive_store_nav_ctn_spacer #store_header {
    background-color: transparent;
}
 
div#global_header .submenuitem.active, div#global_header .submenuitem:hover {
    text-decoration: none;
     background: transparent;
    color: #dcdedf;
}
 
#global_action_menu > * {
    vertical-align: unset;
}
div.page_content {
    width: 940px;
    margin: 0px auto;
    position: relative;
    z-index: 2;
}
 
 
div#global_header {
    background-image: url('https://b.thumbs.redditmedia.com/xIXbYzDawAaCZBqeYRRmxU8_kV0TctFRIusqws6z_9Y.jpg');
    background-color: #000000;
    border-bottom: 1px solid #4D4B48;
    background-position: center top;
    min-width: 940px;
}
 
/**/
div#global_header .content {
    background-image: url('https://b.thumbs.redditmedia.com/xIXbYzDawAaCZBqeYRRmxU8_kV0TctFRIusqws6z_9Y.jpg');
    background-position: center top;
    position: relative;
    width: 940px;
    height: 104px;
    margin: 0px auto;
 
    z-index: 402;
}
 
 
div#global_header .menuitem.supernav_active {
    color: #b8b6b4;
}
 
div#global_header .menuitem.supernav_active::after {
    content: "";
    display: none;
    width: 100%;
    height: 2.5px;
    background: #1a9fff;
    border-radius: 3px;
    animation: slide 0.1s;
    margin-top: 2px;
}
div#global_header {
    font-family: Arial,sans-serif!important;
    color: #ffffff;
    background-color: #000000;
    font-size: 12px;
}
 
div#global_actions {
    position: absolute;
    right: 0px;
    top: 6px;
 
    height: 21px;
    line-height: 21px;
 
    color: #b8b6b4;
    font-size: 11px;
 
    z-index: 401;
}
 
div#global_actions a.global_action_link {
    padding: 0px 4px;
    color: #b8b6b4;
}
 
div#global_actions .global_action_link:hover {
    text-decoration: none;
    color: #ffffff;
}
 
 
 
div#global_actions .user_avatar {
    float: right;
    margin-left: 3px;
}
 
div#global_header div.logo {
    float: left;
    padding-top: 30px;
    margin-right: 40px;
    width: 176px;
    height: 44px;
    /*  background-image: 
 url("//store.akamai.steamstatic.com/public/images/v5/globalheader_logo.png");*/
}
 
#logo_holder a img {
    background-image: url(//steamstore-a.akamaihd.net/public/images/v5/globalheader_logo.png);
    object-position: 176px;
}
 
div#global_header .menuitem {
    display: block;
    position: relative;
 
    padding-top: 40px;
    padding-left: 7px;
    padding-right: 7px;
    padding-bottom: 7px;
    line-height: 16px;
 
    float: left;
    font-size: 14px;
    color: #b8b6b4;
    text-transform: uppercase;
    font-family: Arial,sans-serif!important;
}
 
div#global_header .menuitem.active,
div#global_header .menuitem:hover {
    color: #ffffff;
    text-decoration: none;
}
 
div#global_header .menuitem.active {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/globalheader_highlight.png');
    background-repeat: repeat-x;
}
 
div#global_header .activebg {
    display: none;
}
 
#header_wallet_ctn {
    text-align: right;
    padding-right: 12px;
    line-height: normal;
}
 
#language_pulldown,
#account_pulldown {
    display: inline-block;
    margin: 1px;
    padding-left: 4px;
    line-height: 19px;
}
 
#language_pulldown.focus,
#account_pulldown.focus {
    margin: 0px;
    border: 1px solid #82807C;
    color: #ffffff;
}
 
#account_dropdown > .popup_body {
    width: 150px;
}
 
.header_installsteam_btn {
    float: left;
    position: relative;
    height: 21px;
    margin-right: 3px;
    margin-top: 2px;
}
 
 
.header_installsteam_btn_green .header_installsteam_btn_leftcap,
.header_installsteam_btn_green .header_installsteam_btn_rightcap,
.header_installsteam_btn_green .header_installsteam_btn {
    background-image: url('//steamstore-a.akamaihd.net/public/shared/images/header/btn_header_installsteam_green.png');
}
 
.header_installsteam_btn_gray .header_installsteam_btn_leftcap,
.header_installsteam_btn_gray .header_installsteam_btn_rightcap,
.header_installsteam_btn_gray .header_installsteam_btn {
    background-image: url('//steamstore-a.akamaihd.net/public/shared/images/header/btn_header_installsteam_gray.png');
}
 
 
 
.header_installsteam_btn {
    display: inline-block;
   background: linear-gradient(180deg, rgba(115,136,93,1) 0%, rgba(79,108,52,1) 100%);
 
    padding-left: 0px;
    padding-right: 0px;
    height: 21px;
    line-height: 21px;
    background-repeat: repeat-x;
    text-decoration: none;
    color: #e5e4dc;
    font-weight: normal;
}
 
.header_installsteam_btn_content {
    display: inline-block;
    padding-left: 35px;
    background-position: 10px 3px;
    background-image: url(//store.akamai.steamstatic.com/public/shared/images/header/btn_header_installsteam_download.png?v=1);
    background-repeat: no-repeat;
    text-decoration: none;
    color: #e5e4dc;
    background-color: unset!important;
    font-weight: normal;
}
 
.header_installsteam_btn_content:hover {
    text-decoration: none;
    color: #ffffff;
}
 
 
div#global_header .menuitem_new {
    position: absolute;
    top: 27px;
    font-size: 11px;
    color: #85b0df
}
 
div#global_header .submenuitem {
    text-decoration: none;
    text-transform: uppercase;
    font-size: 11px;
    color: #b8b6b4;
    padding-right: 10px;
}
 
 
div#global_header .submenuitem.moderator {
    color: #b80000;
}
 
div#global_header .submenuitem.active.moderator,
div#global_header .submenuitem.moderator:hover {
    color: #ff0000;
}
 
.community_sub_nav {
    position: absolute;
    left: 7px;
    top: 65px;
    width: 650px;
    font-size: 14px;
}
 
.menuitem.username {
    max-width: 250px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
 
.supernav_content {
    max-width: 138px;
    background: #000 url(//i.imgur.com/NrYG3k6.jpeg) top left no-repeat;
    padding: unset;
    box-shadow: 3px 3px 5px -3px #000;
    text-align: left;
    padding-top: 7px;
    padding-left: 7px;
    padding-right: 7px;
    padding-bottom: 7px;
    z-index: 500;
}
 
.supernav_content > a {
    display: block;
    padding: 6px 0;
    text-transform: uppercase;
    font-size: 12px;
}
 
.supernav_content > a:hover {
    color: #4897cf;
    text-decoration: none;
}
gg
 
/*
 * Store Platforms
 */
span.platform_img {
    display: inline-block;
    width: 22px;
    height: 22px;
    background-repeat: no-repeat;
}
 
img.platform_small,
.platform_img {
    vertical-align: middle;
    margin-right: 1px;
}
 
span.platform_img.win {
    background-image: url(//web.archive.org/web/20150228132825im_/http://store.akamai.steamstatic.com/public/images/v6/icon_platform_win.png);
}
 
span.platform_img.mac {
    background-image: url(//store.akamai.steamstatic.com/public/images/v6/icon_platform_mac.png);
}
 
span.platform_img.linux {
    width: 72px;
    background-image: url(//store.akamai.steamstatic.com/public/images/v6/icon_steamplay.png);
}
 
.tab_item.focus .tab_item_details span.platform_img.win {
    background-image: url(//web.archive.org/web/20150228132825im_/http://store.akamai.steamstatic.com/public/images/v6/icon_platform_win.png);
}
.tab_item.focus .tab_item_details span.platform_img.mac {
    background-image: url(//store.akamai.steamstatic.com/public/images/v6/icon_platform_mac.png);
}
 
.tab_item.focus .tab_item_details span.platform_img.linux {
    background-image: url(httpss://store.akamai.steamstatic.com/public/images/v6/icon_steamplay.png);
}
 
 
.col.search_name .platform_img {
    opacity: 1;
}
body.v6 .store_nav .popup_block_new .popup_body.search_v2{
    border: 1px solid #82807c;
    position: relative;
    background-color: #3b3938;
    background-image: url(//steamstore-a.akamaihd.net/public/shared/images/popups/bg_popup.png);
    background-repeat: repeat-x;
    background-position: top;
}
 
.popup_body.search_v2 .match.match_v2 .match_subtitle {
  
    left: 15px;
 
}
 
.popup_body.search_v2 .match.match_v2 .match_name {
 
    left: 15px;
 
}
 
.popup_body.search_v2 .match.match_v2 .match_img {
    left: 15px;
}
 
 
.popup_body.search_v2 .match.match_v2 {
    border-top: unset;
    color: #DCDEDF;
    margin: 0;
    padding: 4px 0px 4px 0px;
}
 
 
gg
 
.highlight_ctn {
    padding-top: 16px;
    padding-left: 16px;
}
 
img.game_header_image_full {
    width: 308px;
    height: 136px;
}
.game_header_image_ctn {
    margin-bottom: 7px;
    width: 308px;
    height: 136px;
}
 
#game_highlights a {
    color: #529cde;
}
.game_review_summary.positive {
    color: #529cde;
}
.app_tag {
    display: inline-block;
    line-height: 19px;
    padding: 0 7px;
    color: #b0aeac !important;
    background-color: #384959;
    margin-right: 2px;
    border-radius: 3px;
    box-shadow: 1px 1px 0 0 #000000;
    cursor: pointer;
    margin-bottom: 3px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
 
.tab_preview .tags > a {
    box-shadow: 1px 1px 0 0 #000000;
    background-color: #384959;
    color: # !important;
}
 
.tab_review_summary {
    padding: 5px 7px;
    margin-bottom: 10px;
    color: #c6d4df;
    background-color: #1a1a1a;
    width: 258px;
    border-radius: 2px;
}
 
 
#store_nav_area .store_nav_bg {
    height: 35px;
    padding: 0px 0px;
    background: linear-gradient(to bottom, #3B698A 0%, #3B698A 100%);
    background-position: 0px 0px;
}
#store_nav_area .store_nav_bg, .home_page_body_ctn.has_takeover #store_nav_area .store_nav_bg {
   height: 35px;
    padding: 0px 0px;
    background: linear-gradient(to bottom, #3B698A 0%, #3B698A 100%);
    background-position: 0px 0px;
}
 
.searchbox {
    background-image: url(//i.imgur.com/oLQIGgG.png?v=2);
    color: #305D8B;
    width: 240px;
    height: 27px;
    position: relative;
    z-index: 2;
}
.searchbox {
    background-color: unset;
    border-radius: 3px;
    border: 0px solid rgba( 0, 0, 0, 0.3);
     box-shadow: unset; 
    color: #fff;
    margin-bottom: 0px;
    outline: none;
    height: 27px;
    padding: 0px 7px;
    cursor: unset!important;
}
 
.searchbox:hover {
    background-image: url(//i.imgur.com/stChsIj.png?v=2);
    box-shadow: unset;
    border-radius: 3px;
    border: 0px solid rgba( 0, 0, 0, 0.3);
 
    color: #5AA9D9;
    margin-bottom: 0px;
    outline: none;
    height: 27px;
    padding: 0px 7px;
    cursor: unset!important;
}
 
.popup_block_new {
    visibility: visible;
    top: 42px;
    display: block;
    opacity: 1;
}
.popup_menu.popup_menu_browse .popup_menu_subheader.reduced_vspace.responsive_hidden {
  display:none!important;
}
 
.popup_menu_twocol_new > .popup_menu:not(:first-child) {
    display:none;
}
#genre_flyout .popup_body {
    padding-top: 7px;
    padding-bottom: 7px;
    left: 0px;
    width: auto
}
#genre_flyout{
    left: 273px!important;
}
 
 
 
 
a#store_search_link img:hover {
    background-image: none;
}
 
.searchbox input.default {
    border: none;
    color: #cdcac1;
    font-size: 13px;
    margin-left: 8px;
    width: 206px;
 
    outline: none;
}
 
/*.searchbox input, .searchbox input.default {
    font-size: 0;
}
.searchbox:before {
    content: "search the store";
    color: #305D8B;
    font-style: italic;
    font-size: 13px;
    line-height: 26px;
    
}*/
.searchbox input {
    border: none;
    content: "search the store";
    color: #305D8B;
    margin-left: 8px;
    width: 206px;
    outline: none;
}
 
.searchbox input::placeholder {
    color: #305D8B;
}
div#store_search {
    float: right;
    border-left: 1px solid #000000;
    padding: 4px 4px;
    height: 27px;
}
 
a#store_search_link img {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 1px;
    right: -1px;
    background-image: url(localhost);
}
 
 
.search_result_row,
.search_result_row:hover {
    position: relative;
    background-color: #1f1f1f;
    border-color: #1f1f1f;
    padding-left: 15px;
    padding-top: 5px;
    padding-bottom: 1px;
    margin-bottom: 1px;
    display: block;
    text-decoration: none;
    color: #5EB0E0;
    font-family: Arial,sans-serif!important;
    font-weight: 300;
}
 
 
.search_result_row:hover {
    position: relative;
    background-color: #1f1f1f;
    border-color: #8bb9e0;
    padding-left: 15px;
    padding-top: 5px;
    padding-bottom: 1px;
    margin-bottom: 1px;
    display: block;
    text-decoration: none;
    color: #5AA9D9;
    font-family: Arial,sans-serif!important;
    font-weight: 300;
}
.search_result_row .col.search_name {
    width: 250px;
    margin-left: 5px;
}
 
.search_result_row .col.search_released {
    width: 85px;
    color: #5AA9D9;
    font-size: 11px;
    line-height: 45px;
    white-space: nowrap; 
    text-overflow: ellipsis;
    overflow: hidden;
}
 
.page_header_ctn.search .responsive_store_nav_ctn_spacer #store_header {
    padding-bottom: 0px;
    background-color: #3b3938;
    
}
 
 
.page_header_ctn.search {
    padding-bottom: 70px;
    background: url(none) bottom center no-repeat;
    
}
.searchbar .label {
    font-size: 12px;
    color: #305D8B;
    display: inline-block;
    margin-right: 4px;
}
 
 
.searchtag {
    color:#b0aeac;
}
.search_result_row .ds_options {
    right: auto;
    left: 120px;
}
 
 
 
gg
 
 
gg
 
/*User games page*/
/*mosth hacky way of doing this shit*/
.gameslistapp_DisplayControls_2_BHL {
    display: block;
    line-height: 24px;
    padding-bottom: 0;
}
.gameslistfilter_Filter_ZQQNQ {
    position: static;
    display: unset;
    height: 100%;
}
.gameslistfilter_Filter_ZQQNQ input {
    background-color: #1a1a1a;
    color: #909090;
    border: 1px solid #707070;
    padding: 1px 0px;
    box-sizing: unset;
    width: auto;
    height: 100%
}
.gameslistapp_BothOwnedFilter_NKeON {
    display: none
}
.gameslistapp_SortOptions_3pgJX {
    display: block;
    float: right;
    margin-bottom: 8px;
}
.gameslistapp_SortOptions_3pgJX li {
    display: inline-block;
    text-align: center
}
.gameslistapp_SortOptions_3pgJX .gameslistapp_SortOption_YcplN {
    color: #B0AEAC;
    text-decoration: underline;
}
.gameslistapp_SortOptions_3pgJX .gameslistapp_SortOption_YcplN:hover {
    color: #EBEBEB;
    text-decoration: underline;
}
.gameslistapp_SortOptions_3pgJX .gameslistapp_SortOption_YcplN.gameslistapp_SelectedSort_MA0Ih {
    color: #B0AEAC;
    text-decoration: none;
    cursor: text;
}
 
.gameslistitems_GamesListItem_2-pQF .gameslistitems_GameName_22awl {
    font-weight: 400;
    font-size: 14px;
    color: var(--typography-color-primary);
    line-height: var(--typography-font-size-large);
    display: -webkit-inline-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding-bottom: 0.14em;
}
.gameslistitems_AchievementsProgress_3L-qR .gameslistitems_AchievementsProgressLabel_3eZML {
    grid-area: label;
    font-weight: 700;
    margin-right: 8px;
    color: inherit;
    letter-spacing: .03em;
      font-size: 10px;
}
 
.gameslistitems_AchievementsProgress_3L-qR {
 
    align-items: flex-start;
}
.gameslistitems_GamesListItem_2-pQF .gameslistitems_AchievementContainer_38RhR .gameslistitems_AchievementsProgress_3L-qR {
    row-gap: 0px;
}
 
.gameslistitems_GamesListItem_2-pQF .gameslistitems_Playtime_2Eeyh .gameslistitems_FactLabel_2L1rk {
    font-weight: 700;
    letter-spacing: .03em;
    color: var(--typography-color-neutral);
    font-size: 10px;
}
.gameslistitems_GamesListItem_2-pQF .gameslistitems_GameItemPortrait_1bAC6 {
    background-image: url(//web.archive.org/web/20140714125607im_///steamcommunity-a.akamaihd.net/public/images/skin_1/gamelogoholder_default.jpg);
    width: 184px;
    height: 69px;
    border: 0;
    padding: 4px;
    margin: 0;
}
 
.gameslistitems_GamesListItem_2-pQF {
    position: relative;
    --padding: 0px;
    display: grid;
    box-sizing: border-box;
    height: 87px;
    margin-top: 10px;
    row-gap: 6px;
    border: 1px solid #454545;
    background-color: transparent;
    grid-template-columns: 214px min-content auto;
}
 
.gameslistitems_GamesListItem_2-pQF .gameslistitems_Buttons_1uRB5 {
    grid-area: links;
    display: flex;
    align-items: flex-start;
    gap: 10px;
}
.gameslistitems_GamesListItem_2-pQF .gameslistitems_Playtime_2Eeyh {
    grid-area: playtime;
    display: flex;
    flex-direction: row;
    gap: 190px;
    white-space: nowrap;
    color: var(--typography-color-neutral);
}
.gameslistitems_GamesListItem_2-pQF .gameslistitems_GameNameContainer_w6q9p {
    padding-top: 4px;
    align-items: flex-start;
    height: 16px;
    margin-right: 32px;
}
 
.gameslistitems_GamesListItem_2-pQF .gameslistitems_Buttons_1uRB5 .gameslistitems_NavButton_3aNUl {
    padding: 3px 8px 3px 0px;
}
.gameslistitems_NavButton_3aNUl {
    padding-left:5px!important;
    background: #1a1a1a;
    color:#939393;
    border-radius: 2px;
    font-size: 11px;
 
}
 
 
.gameslistapp_Gameslistapp_2nl8H {
     padding: 0px;
    background-image: url(//steamcommunity-a.akamaihd.net/public/images/skin_1/profile_shared_general_background.jpg);
    background-repeat: no-repeat;
    width: 958px;
    min-height: 441px;
}
 
.gameslistitems_GamesListItemContainer_29H3o{
    display: contents;
    top: 0px!important;
    padding-bottom: 10px;
}
 
.gameslistremote_DownloadIconButton_2P659 svg {
    margin-top: 4px;
    width: 8px;
 
}
 
.gameslistremote_RemoteControls_1Fput .gameslistremote_ButtonContainer_2mckt {
 
    margin-bottom: 10px;
}
 
gg
 
/* steam inbox */
/* notification box */
#header_notification_area {
    float: left;
    margin-right: 3px;
    margin-top: -6px;
    margin-left: 8px;
        background-color: #1B1B18;
}
 
.header_notification_btn {
    position: relative;
    height: 29px;
 
    cursor: pointer;
}
 
.header_notification_empty {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/btn_notification_grey.png');
    background-repeat: no-repeat;
    background-position: center top;
    width: 29px;
}
 
.header_notification_empty:hover,
.header_notification_empty.focus {
    background-position: center bottom;
}
 
.header_notification_green {
    padding: 0 28px 0 10px;
 
    background-repeat: repeat-x;
    background-position: 0 -29px;
 
    line-height: 29px;
    font-weight: bold;
    color: #ffffff;
}
 
.header_notification_green,
.header_notification_green .leftcap,
.header_notification_green .rightcap {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/btn_notification_green.png?=1');
}
 
.header_notification_green:hover,
.header_notification_green.focus {
    background-position: 0 -87px;
}
 
.header_notification_green:hover .leftcap,
.header_notification_green.focus .leftcap {
    background-position: 0 -58px;
}
.header_notification_green:hover .rightcap,
.header_notification_green.focus .rightcap {
    background-position: right -58px;
}
 
.header_notification_green .leftcap {
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 29px;
    background-position: left top;
}
 
.header_notification_green .rightcap {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 29px;
    background-position: right top;
}
 
#header_notification_dropdown .popup_menu_item {
    line-height: 30px;
    padding: 0 12px 0 12px;
    background-repeat: no-repeat;
    background-position: left center;
    color: #bfbfbf;
}
 
#header_notification_dropdown .popup_menu_item.active_inbox_item {
    color: #70ba24;
}
 
.header_notification_dropdown_seperator {
    margin: 0 7px;
    height: 1px;
    background-color: #6b6865;
}
 
.notification_icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 16px;
 
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_icons_sprite.png');
}
 
.header_notification_comments .notification_icon {
    background-position: 0 0;
}
 
.header_notification_items .notification_icon {
    background-position: 0 -16px;
}
 
.header_notification_invites .notification_icon {
    background-position: 0 -32px;
}
 
.header_notification_gifts .notification_icon {
    background-position: 0 -48px;
}
 
.header_notification_offlinemessages .notification_icon {
    background-position: 0 -64px;
}
 
/* these are shown conditionally so not a big deal that they aren't in the sprite */
.header_notification_tradeoffers .notification_icon {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_tradeoffers.png');
}
 
.header_notification_asyncgame .notification_icon {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_async_game.png');
}
 
.header_notification_asyncgameinvite .notification_icon {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_async_game_invite.png');
}
 
/* re-uses comment icon */
.header_notification_moderatormessage .notification_icon {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_moderator_message.png');
}
 
 
#header_parental_area {
    float: left;
    margin-right: 3px;
    margin-top: -6px;
    margin-left: 8px;
}
 
.header_parental_btn {
    position: relative;
    top: -1px;
    height: 30px;
 
    background-image: url('//web.archive.org/web/20140705173030im_///cdn.store.steampowered.com/public/shared/images/header/btn_parent.png');
    background-position: center center;
    background-repeat: no-repeat;
 
    padding: 0 30px 0 10px;
}
 
#header_parental_link.header_parental_btn {
    cursor: pointer;
}
 
#header_parental_link.header_parental_locked:hover,
.header_parental_locked.focus {
    background-position: 0 -86px;
}
 
#header_parental_link.header_parental_unlocked:hover,
.header_parental_unlocked:focus {
    background-position: 0 -28px;
}
 
.header_parental_unlocked {
    background-position: 0 1px;
}
 
.header_parental_locked {
    background-position: 0 -57px;
}
#account_pulldown:after {
    content: "'s account"
}
 
.header_notification_btn.header_notification_bell {
    display: block;
    width: 29px;
    height: 28px;
    padding: 0px;
    margin: 0px;
   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFPSURBVDhPxZOxb4JAFId/d4hook0TTNHgYAcTQ+hCgprYpf7hdpUwsBmX1rnBqQMNUaA8ONHDtmmnfsnL5b139x13F1ivp+MrGGNoNFRkWYokSfIxEx2ZKwFjHKqq3j4uFi95epPHu+/7evQRFaI6kkBRFHS7Xdj2w1uz2bwTZdo92263fL8PcTgcqVI2ciqBpmno9/sYje6P+ecrRbFGGIZst3tFFEWiciFYPi1xTBLpoHQPdRTO2ep5JTKAixFJmmZpmuIy6Mz1qG9SCcbjMVqtliQ4Bb0ARafTgeM4YkVJJaCmbduwLAucc0lAOw8GA0wmEzH7TCU4QSLDMIoXoTsgWbvdhmmaYoaMJIjjGOv1uljoui5msxmm0yl0XYfneWKWjCQIggDz+RzD4VBUSiinOsnrVAJq0qSfoP5msxFZybf/wm+5usS/8t8C4BOcG5Ok49Rf7wAAAABJRU5ErkJggg==) no-repeat #1B1B18;
  /*  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFnSURBVDhPxZI/bsIwFMa/JBAEQlGkSAUO0LBEmRCMdMwFyp4rwAGaXqFMHIKFsrOWCxSlUnc6pBJdaP4QNzZ2mgBSxdSf9OTnZ7/Pz8+WTPMWl5BlGfV6HYfDAVEUIU1TvlLmTEBRFDQaDX0ynrxnUy2zr9lsZgSfARM6pSSgqio6nQ5G96OPZrN5w8P0dLJ4Xsi+72O/34MQwlcKApqmwbZtDId3SVa+woInbDav0mq1QhAEPFIQ8B48hFH0K50hSRL3jj49Wa1WJe/R49GsV3xEFMckjmMUjd5ZWBiGbPwOw9IhuYDjONB1HUmSsM7TUfj0Bai1Wi24rsszjuRX8P03przdbrFcLlmzigwGA/T7feZ3u2Z+t7wCQbvdhmVZqNVq7C9UKhUYhoFer8d3nEAroJY1iOx2OzKdPpH1+oVOc+icxgUih1VfFChuuoRYvyjwV7JgPp+XBM6+8rWcNfFa/lsA+AETDwXLz114zAAAAABJRU5ErkJggg==) no-repeat #181818;*/
    background-position: center;
    background-size: 16px;
    background-color: #1B1B18;
     border: 2px solid #4d4b49;
    border-radius: 0px 0px 3px 3px;
}
 
.backgroundImg {
display:none;
}
 
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Grey_2Sj0M,
    ._2Z7EdkE4UF7dnGM4VibIvZ._2Sj0MS5lHpROEv7qTMLEsn{
    background-color: transparent;
    width: 28px;
    height: 28px;
   
}
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Grey_2Sj0M svg,
    ._2Z7EdkE4UF7dnGM4VibIvZ._2Sj0MS5lHpROEv7qTMLEsn svg{
    display:none;
}
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Green_1ad8S svg,
    ._2Z7EdkE4UF7dnGM4VibIvZ._1ad8S4q3EoWrectZjRucjc svg{
    display:none;
}
 
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Grey_2Sj0M:not(.greenenvelope_Disabled_3KMlw):hover ,
    ._2Z7EdkE4UF7dnGM4VibIvZ._2Sj0MS5lHpROEv7qTMLEsn:not(._3KMlwWjyKj6H0MWpR9jscq):hover{
    background-color: transparent;
    transition-property: none;
    transition-duration: 0ms;
      display: block;
    width: 29px;
    height: 28px;
    padding: 0px;
    margin: 0px;     
 background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFnSURBVDhPxZI/bsIwFMa/JBAEQlGkSAUO0LBEmRCMdMwFyp4rwAGaXqFMHIKFsrOWCxSlUnc6pBJdaP4QNzZ2mgBSxdSf9OTnZ7/Pz8+WTPMWl5BlGfV6HYfDAVEUIU1TvlLmTEBRFDQaDX0ynrxnUy2zr9lsZgSfARM6pSSgqio6nQ5G96OPZrN5w8P0dLJ4Xsi+72O/34MQwlcKApqmwbZtDId3SVa+woInbDav0mq1QhAEPFIQ8B48hFH0K50hSRL3jj49Wa1WJe/R49GsV3xEFMckjmMUjd5ZWBiGbPwOw9IhuYDjONB1HUmSsM7TUfj0Bai1Wi24rsszjuRX8P03przdbrFcLlmzigwGA/T7feZ3u2Z+t7wCQbvdhmVZqNVq7C9UKhUYhoFer8d3nEAroJY1iOx2OzKdPpH1+oVOc+icxgUih1VfFChuuoRYvyjwV7JgPp+XBM6+8rWcNfFa/lsA+AETDwXLz114zAAAAABJRU5ErkJggg==) no-repeat #181818;
       background-position: center;
    background-size: 16px;
    background-color: #1B1B18;
     border: 2px solid #4d4b49;
    border-radius: 0px 0px 3px 3px;
    
}
.greenenvelope_NotificationsButton_2Z7Ed,
     ._2Z7EdkE4UF7dnGM4VibIvZ{
    width: 29px;
    height: 28px;
    float: left;
    margin-right: 3px;
    margin-top: 2px;
    margin-left: 2px;
}
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Green_1ad8S, 
    ._2Z7EdkE4UF7dnGM4VibIvZ._1ad8S4q3EoWrectZjRucjc{
     background: linear-gradient(to bottom, #799B2C 5%, #5C7E10 95%);
    
   /*  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURd3d3f///+no6JCOjby7utLS0YWDgbGwr/T09KalpJuZmHp3dsfGxm9sagAAAGmW7zAAAAAPdFJOU///////////////////ANTcmKEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABSSURBVChTncxRDoAwCANQOibb3OT+x90QNNE/7Q/pCynpK/+AcCU5cI6+iQMKV+ttRwCoE5IM3IB29M7rBlQutrDeHIYkmzB3aGe1ZIdnPoPqBGvCCkERArFYAAAAAElFTkSuQmCC");*/
    background-position: center;
    background-repeat: no-repeat;
    background-color: #5c7e10;
    color: #fff;
}
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Green_1ad8S:after,
     ._2Z7EdkE4UF7dnGM4VibIvZ._1ad8S4q3EoWrectZjRucjc:after {
     content:"";  
     width: 29px;
     height: 28px;
     float: left;
     background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURd3d3f///+no6JCOjby7utLS0YWDgbGwr/T09KalpJuZmHp3dsfGxm9sagAAAGmW7zAAAAAPdFJOU///////////////////ANTcmKEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABSSURBVChTncxRDoAwCANQOibb3OT+x90QNNE/7Q/pCynpK/+AcCU5cI6+iQMKV+ttRwCoE5IM3IB29M7rBlQutrDeHIYkmzB3aGe1ZIdnPoPqBGvCCkERArFYAAAAAElFTkSuQmCC");
    background-position: center;
    background-repeat: no-repeat;
 
}
 
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Green_1ad8S:hover,
     ._2Z7EdkE4UF7dnGM4VibIvZ._1ad8S4q3EoWrectZjRucjc:hover{
     background: linear-gradient(to bottom, #799B2C 5%, #799B2C 95%);
}
 
 
gg
 
/* steam inbox */
/* notification box */
#header_notification_area {
    float: left;
    margin-right: 3px;
    margin-top: -6px;
    margin-left: 8px;
        background-color: #1B1B18;
}
 
.header_notification_btn {
    position: relative;
    height: 29px;
 
    cursor: pointer;
}
 
.header_notification_empty {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/btn_notification_grey.png');
    background-repeat: no-repeat;
    background-position: center top;
    width: 29px;
}
 
.header_notification_empty:hover,
.header_notification_empty.focus {
    background-position: center bottom;
}
 
.header_notification_green {
    padding: 0 28px 0 10px;
 
    background-repeat: repeat-x;
    background-position: 0 -29px;
 
    line-height: 29px;
    font-weight: bold;
    color: #ffffff;
}
 
.header_notification_green,
.header_notification_green .leftcap,
.header_notification_green .rightcap {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/btn_notification_green.png?=1');
}
 
.header_notification_green:hover,
.header_notification_green.focus {
    background-position: 0 -87px;
}
 
.header_notification_green:hover .leftcap,
.header_notification_green.focus .leftcap {
    background-position: 0 -58px;
}
.header_notification_green:hover .rightcap,
.header_notification_green.focus .rightcap {
    background-position: right -58px;
}
 
.header_notification_green .leftcap {
    position: absolute;
    left: 0;
    top: 0;
    width: 5px;
    height: 29px;
    background-position: left top;
}
 
.header_notification_green .rightcap {
    position: absolute;
    right: 0;
    top: 0;
    width: 20px;
    height: 29px;
    background-position: right top;
}
 
#header_notification_dropdown .popup_menu_item {
    line-height: 30px;
    padding: 0 12px 0 12px;
    background-repeat: no-repeat;
    background-position: left center;
    color: #bfbfbf;
}
 
#header_notification_dropdown .popup_menu_item.active_inbox_item {
    color: #70ba24;
}
 
.header_notification_dropdown_seperator {
    margin: 0 7px;
    height: 1px;
    background-color: #6b6865;
}
 
.notification_icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 16px;
 
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_icons_sprite.png');
}
 
.header_notification_comments .notification_icon {
    background-position: 0 0;
}
 
.header_notification_items .notification_icon {
    background-position: 0 -16px;
}
 
.header_notification_invites .notification_icon {
    background-position: 0 -32px;
}
 
.header_notification_gifts .notification_icon {
    background-position: 0 -48px;
}
 
.header_notification_offlinemessages .notification_icon {
    background-position: 0 -64px;
}
 
/* these are shown conditionally so not a big deal that they aren't in the sprite */
.header_notification_tradeoffers .notification_icon {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_tradeoffers.png');
}
 
.header_notification_asyncgame .notification_icon {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_async_game.png');
}
 
.header_notification_asyncgameinvite .notification_icon {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_async_game_invite.png');
}
 
/* re-uses comment icon */
.header_notification_moderatormessage .notification_icon {
    background-image: url('//cdn.store.steampowered.com/public/shared/images/header/inbox_moderator_message.png');
}
 
 
#header_parental_area {
    float: left;
    margin-right: 3px;
    margin-top: -6px;
    margin-left: 8px;
}
 
.header_parental_btn {
    position: relative;
    top: -1px;
    height: 30px;
 
    background-image: url('//web.archive.org/web/20140705173030im_///cdn.store.steampowered.com/public/shared/images/header/btn_parent.png');
    background-position: center center;
    background-repeat: no-repeat;
 
    padding: 0 30px 0 10px;
}
 
#header_parental_link.header_parental_btn {
    cursor: pointer;
}
 
#header_parental_link.header_parental_locked:hover,
.header_parental_locked.focus {
    background-position: 0 -86px;
}
 
#header_parental_link.header_parental_unlocked:hover,
.header_parental_unlocked:focus {
    background-position: 0 -28px;
}
 
.header_parental_unlocked {
    background-position: 0 1px;
}
 
.header_parental_locked {
    background-position: 0 -57px;
}
#account_pulldown:after {
    content: "'s account"
}
 
.header_notification_btn.header_notification_bell {
    display: block;
    width: 29px;
    height: 28px;
    padding: 0px;
    margin: 0px;
   background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFPSURBVDhPxZOxb4JAFId/d4hook0TTNHgYAcTQ+hCgprYpf7hdpUwsBmX1rnBqQMNUaA8ONHDtmmnfsnL5b139x13F1ivp+MrGGNoNFRkWYokSfIxEx2ZKwFjHKqq3j4uFi95epPHu+/7evQRFaI6kkBRFHS7Xdj2w1uz2bwTZdo92263fL8PcTgcqVI2ciqBpmno9/sYje6P+ecrRbFGGIZst3tFFEWiciFYPi1xTBLpoHQPdRTO2ep5JTKAixFJmmZpmuIy6Mz1qG9SCcbjMVqtliQ4Bb0ARafTgeM4YkVJJaCmbduwLAucc0lAOw8GA0wmEzH7TCU4QSLDMIoXoTsgWbvdhmmaYoaMJIjjGOv1uljoui5msxmm0yl0XYfneWKWjCQIggDz+RzD4VBUSiinOsnrVAJq0qSfoP5msxFZybf/wm+5usS/8t8C4BOcG5Ok49Rf7wAAAABJRU5ErkJggg==) no-repeat #1B1B18;
  /*  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFnSURBVDhPxZI/bsIwFMa/JBAEQlGkSAUO0LBEmRCMdMwFyp4rwAGaXqFMHIKFsrOWCxSlUnc6pBJdaP4QNzZ2mgBSxdSf9OTnZ7/Pz8+WTPMWl5BlGfV6HYfDAVEUIU1TvlLmTEBRFDQaDX0ynrxnUy2zr9lsZgSfARM6pSSgqio6nQ5G96OPZrN5w8P0dLJ4Xsi+72O/34MQwlcKApqmwbZtDId3SVa+woInbDav0mq1QhAEPFIQ8B48hFH0K50hSRL3jj49Wa1WJe/R49GsV3xEFMckjmMUjd5ZWBiGbPwOw9IhuYDjONB1HUmSsM7TUfj0Bai1Wi24rsszjuRX8P03przdbrFcLlmzigwGA/T7feZ3u2Z+t7wCQbvdhmVZqNVq7C9UKhUYhoFer8d3nEAroJY1iOx2OzKdPpH1+oVOc+icxgUih1VfFChuuoRYvyjwV7JgPp+XBM6+8rWcNfFa/lsA+AETDwXLz114zAAAAABJRU5ErkJggg==) no-repeat #181818;*/
    background-position: center;
    background-size: 16px;
    background-color: #1B1B18;
     border: 2px solid #4d4b49;
    border-radius: 0px 0px 3px 3px;
}
 
.backgroundImg {
display:none;
}
 
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Grey_2Sj0M,
    ._2Z7EdkE4UF7dnGM4VibIvZ._2Sj0MS5lHpROEv7qTMLEsn{
    background-color: transparent;
    width: 28px;
    height: 28px;
   
}
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Grey_2Sj0M svg,
    ._2Z7EdkE4UF7dnGM4VibIvZ._2Sj0MS5lHpROEv7qTMLEsn svg{
    display:none;
}
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Green_1ad8S svg,
    ._2Z7EdkE4UF7dnGM4VibIvZ._1ad8S4q3EoWrectZjRucjc svg{
    display:none;
}
 
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Grey_2Sj0M:not(.greenenvelope_Disabled_3KMlw):hover ,
    ._2Z7EdkE4UF7dnGM4VibIvZ._2Sj0MS5lHpROEv7qTMLEsn:not(._3KMlwWjyKj6H0MWpR9jscq):hover{
    background-color: transparent;
    transition-property: none;
    transition-duration: 0ms;
      display: block;
    width: 29px;
    height: 28px;
    padding: 0px;
    margin: 0px;     
 background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFnSURBVDhPxZI/bsIwFMa/JBAEQlGkSAUO0LBEmRCMdMwFyp4rwAGaXqFMHIKFsrOWCxSlUnc6pBJdaP4QNzZ2mgBSxdSf9OTnZ7/Pz8+WTPMWl5BlGfV6HYfDAVEUIU1TvlLmTEBRFDQaDX0ynrxnUy2zr9lsZgSfARM6pSSgqio6nQ5G96OPZrN5w8P0dLJ4Xsi+72O/34MQwlcKApqmwbZtDId3SVa+woInbDav0mq1QhAEPFIQ8B48hFH0K50hSRL3jj49Wa1WJe/R49GsV3xEFMckjmMUjd5ZWBiGbPwOw9IhuYDjONB1HUmSsM7TUfj0Bai1Wi24rsszjuRX8P03przdbrFcLlmzigwGA/T7feZ3u2Z+t7wCQbvdhmVZqNVq7C9UKhUYhoFer8d3nEAroJY1iOx2OzKdPpH1+oVOc+icxgUih1VfFChuuoRYvyjwV7JgPp+XBM6+8rWcNfFa/lsA+AETDwXLz114zAAAAABJRU5ErkJggg==) no-repeat #181818;
       background-position: center;
    background-size: 16px;
    background-color: #1B1B18;
     border: 2px solid #4d4b49;
    border-radius: 0px 0px 3px 3px;
    
}
.greenenvelope_NotificationsButton_2Z7Ed,
     ._2Z7EdkE4UF7dnGM4VibIvZ{
    width: 29px;
    height: 28px;
    float: left;
    margin-right: 3px;
    margin-top: 2px;
    margin-left: 2px;
}
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Green_1ad8S, 
    ._2Z7EdkE4UF7dnGM4VibIvZ._1ad8S4q3EoWrectZjRucjc{
     background: linear-gradient(to bottom, #799B2C 5%, #5C7E10 95%);
    
   /*  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURd3d3f///+no6JCOjby7utLS0YWDgbGwr/T09KalpJuZmHp3dsfGxm9sagAAAGmW7zAAAAAPdFJOU///////////////////ANTcmKEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABSSURBVChTncxRDoAwCANQOibb3OT+x90QNNE/7Q/pCynpK/+AcCU5cI6+iQMKV+ttRwCoE5IM3IB29M7rBlQutrDeHIYkmzB3aGe1ZIdnPoPqBGvCCkERArFYAAAAAElFTkSuQmCC");*/
    background-position: center;
    background-repeat: no-repeat;
    background-color: #5c7e10;
    color: #fff;
}
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Green_1ad8S:after,
     ._2Z7EdkE4UF7dnGM4VibIvZ._1ad8S4q3EoWrectZjRucjc:after {
     content:"";  
     width: 29px;
     height: 28px;
     float: left;
     background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAtUExURd3d3f///+no6JCOjby7utLS0YWDgbGwr/T09KalpJuZmHp3dsfGxm9sagAAAGmW7zAAAAAPdFJOU///////////////////ANTcmKEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABSSURBVChTncxRDoAwCANQOibb3OT+x90QNNE/7Q/pCynpK/+AcCU5cI6+iQMKV+ttRwCoE5IM3IB29M7rBlQutrDeHIYkmzB3aGe1ZIdnPoPqBGvCCkERArFYAAAAAElFTkSuQmCC");
    background-position: center;
    background-repeat: no-repeat;
 
}
 
.greenenvelope_NotificationsButton_2Z7Ed.greenenvelope_Green_1ad8S:hover,
     ._2Z7EdkE4UF7dnGM4VibIvZ._1ad8S4q3EoWrectZjRucjc:hover{
     background: linear-gradient(to bottom, #799B2C 5%, #799B2C 95%);
}
 
 
gg
 
/*buttons*/
.ico16 {
    display: inline-block;
    width: 16px;
    height: 16px;
    background: url(//steamstore-a.akamaihd.net/public/shared/images/buttons/icons_16.png);
    vertical-align: text-top;
}
 
.ico16.reportv6 {
    background-position: -128px 0px;
}
 
.ico16.thumb_upv6 {
    background-position: -80px 0px;
}
 
.ico16.thumb_downv6 {
    background-position: -32px 0px;
}
.btnv6_blue_hoverfade {
    border-radius: 2px;
    border: none;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    text-transform: uppercase;
    text-decoration: none !important;
    color: #5EB0E0 !important;
    
}
 
.btnv6_grey_black {
    border-radius: 2px;
    border: none;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none !important;
    color: #ebebeb !important;
    background: #1a1a1a;
}
.store_nav .tab > span {
    font-size: 11px;
    font-weight:normal;
    color: #67C1F5;
    line-height: 33px;
    padding: 0px 15px;
    display: block;
    background: #5a5654;
    background: -moz-linear-gradient(top, #396788 0%, #396788 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #396788), color-stop(100%, #396788));
    background: -webkit-linear-gradient(top, #396788 0%, #396788 100%);
    background: -o-linear-gradient(top, #396788 0%, #396788 100%);
    background: -ms-linear-gradient(top, #396788 0%, #396788 100%);
    background: linear-gradient(to bottom, #396788 0%, #396788 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#396788', endColorstr='#396788', GradientType=0);
    text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.3);
}
a.pulldown_desktop {
    display: inline;
    color: #67C1F5;
}
 
.store_nav .tab {
    font-size: 11px;
    color: #67C1F5;
    line-height: 33px;
    display: block;
    background: #396788;
    background: -moz-linear-gradient(top, #396788 0%, #396788 100%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #396788), color-stop(100%, #396788));
    background: -webkit-linear-gradient(top, #396788 0%, #396788 100%);
    background: -o-linear-gradient(top, #396788 0%, #396788 100%);
    background: -ms-linear-gradient(top, #396788 0%, #396788 100%);
    background: linear-gradient(to bottom, #396788 0%, #396788 100%);
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#396788', endColorstr='#396788', GradientType=0);
    float: left;
    border-right: 1px solid #000000;
    cursor: pointer;
}
.store_nav .tab:hover > span,
.store_nav .tab:hover,
.store_nav .tab.focus > span,
.store_nav .tab.focus {
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #61B6E7), color-stop(100%, #4887AB));
}
 
.game_purchase_action_bg {
    height: 34px;
    background-color: #3c3d3e;
    padding: 3px 3px 3px 0px;
    border-radius: 3px;
    -moz-border-radius: 3px;
}
.game_purchase_action .game_purchase_price {
    background-color: #000000;
    color: #d6d7d8;
    font-size: 13px;
    padding-top: 8px;
    padding-left: 12px;
    padding-right: 12px;
    height: 26px;
}
.btn_green_steamui {
    border-radius: 2px;
    border: none;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none !important;
    color: #fff;
    background: transparent;
    text-shadow: 1px 1px 0px rgba( 0, 0, 0, 0);
}
 
.btn_blue_steamui {
    border-radius: 2px;
    border: none;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none !important;
    color: #fff;
    background: transparent;
    text-shadow: 1px 1px 0px rgba( 0, 0, 0, 0.3 );
}
 
.btn_green_white_innerfade {
    
    color: #fff!important;
}
 
.btn_medium > span,
input.btn_medium {
    padding: 0 15px;
    line-height: 30px;
    text-align: center;
    text-transform: none;
    font-size: 13px;
    font-family: 'Arial';
}
 
 
.btn_green_steamui > span {
    border-radius: 2px;
    font-size: 11px;
    display: block;
    text-transform: uppercase;
    background-image: url(//store.akamai.steamstatic.com/public/images/v5/btn_addtocart_repeat.gif)/* background: #6fa720;
    background: -webkit-linear-gradient( top, #BBDD90 0%, #577B27 50%);
   /* background: linear-gradient( to bottom, #6fa720 5%, #588a1b 95%);*/
    /* background: linear-gradient( to right, #75b022 5%, #588a1b 95%); */
}
 
.btn_blue_steamui > span {
    border-radius: 2px;
    font-size: 11px;
    display: block;
    text-transform: uppercase;
    background-image: url(//web.archive.org/web/20100628201407im_///cdn.store.steampowered.com/public/images/v5/btn_packageinfo_corners.gif);
   /* background: -webkit-linear-gradient( top, #75b022 5%, #588a1b 95%);
    background: linear-gradient( to bottom, #75b022 5%, #588a1b 95%);
    background: linear-gradient( to right, #47bfff 5%, #1a44c2 60%);
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    background-position: 25%;
    background-size: 330% 100%;*/
}
 
.pagebtn, a.pagebtn {
    display: inline-block;
    line-height: 24px;
    background-color: #000000;
    border: 1px solid #000000;
    border-radius: 3px;
    cursor: pointer;
    padding: 0px 16px;
    color: #939393;
    font-size: 14px;
}
 
.pagebtn:not(.disabled):hover, a.pagebtn:not(.disabled):hover {
    background-color: #97C0E3;
    border-color: #97C0E3;
    color: #3C3D3E;
    text-decoration: none;
}
.pagebtn.disabled, .pagebtn.disabled:hover, a.pagebtn.disabled, a.pagebtn.disabled:hover {
    opacity: 1;
    border: 1px solid #333333;
    background-color: transparent;
    color: #333333;
    cursor: default;
}
 
#shareEmbedRow.block.responsive_apppage_details_left > a.btnv6_blue_hoverfade.btn_medium {
     background: #1a1a1a;
}
 
#shareEmbedRow.block.responsive_apppage_details_left > a.btnv6_blue_hoverfade.btn_medium:hover {
       text-decoration: none !important;
    color: #000 !important;
    background: #97C0E3;
}
 
i.ico18.thumb_up{
    filter:grayscale(100%)
    
}
 
i.ico18.thumb_down{
    filter:grayscale(100%)
    
}
 
 
.btnv6_grey_black:not(.btn_disabled):not(:disabled):not(.btn_active):not(.active):hover {
    text-decoration: none !important;
    color: #000 !important;
    background: #97C0E3;
}
 
.ico_hover:not(.btn_disabled):not(:disabled):not(.btn_active):not(.active):hover .ico16.thumb_upv6 {
    background-position: -112px 0px;
}
 
 
.ico_hover:not(.btn_disabled):not(:disabled):not(.btn_active):not(.active):hover .ico16.thumb_downv6 {
    background-position: -48px 0px;
}
 
.ico_hover:not(.btn_disabled):not(:disabled):not(.btn_active):not(.active):hover .ico16.funny {
    background-position: -240px 16px;
}
 
.home_right_btn{
    z-index: 1;
    position: relative;
}
.btnv6_white_transparent.btn_small.btn_uppercase{
    position: absolute;
    
    right: 0px;
    border-left: 1px solid #000000;
    height: 26px;
    border: none;
    padding: 1px;
    display: inline-block;
    cursor: pointer;
    text-decoration: none !important;
    color: #fff !important;
    background: transparent;
    padding-left:10px;
}
 
.btn_small > span, input.btn_small {
    padding: 0 15px;
    font-size: 12px;
    line-height: 13px;
}
 
gg
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
