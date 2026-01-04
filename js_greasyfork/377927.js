// ==UserScript==
// @name         GoodBlox Dark Theme
// @namespace    https://yoshi.isverylame.com/projects/goodblox/
// @version      0.5.3
// @description  Dark theme for GoodBlox.
// @author       mydiscordaccountgotdisabled#9955, modified by yoshi#7279
// @match        *://goodblox.xyz/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/377927/GoodBlox%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/377927/GoodBlox%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
    body { background-color: #313439; color: white; }
    .content, #UserStatisticsPane #UserStatistics, #UserBadgesPane #UserBadges { background-color: #313439; }
    #LoginView #AlreadySignedIn { background-color: #2b2d31; }
    #LoginView h5 { background-color: #25272b; color: white;}
    #SplashContainer #GoodBloxAtAGlance { background-color: #2b2d31; }
    h2, h3, h4, a:link, a:visited, a:active, a:hover, #PaneNewUser h3, #SplashContainer h2,  #SplashContainer h3, #SplashContainer #GoodBloxAtAGlance #ThingsToDo, .GridItem { color: white; }
    #UserPlaces .Place .Description { border: dashed 1px white; color: white; }
    #UserPlaces .Place .Thumbnail { border: solid 1px white; }
    #UserPlaces .Place .Statistics { border-top: dashed 1px white; border-left: dashed 1px white; border-right: dashed 1px white; color: white; }
    .GridItem:hover, a.GridItem:hover { color: #4a5059; }
    #UpdatePanel1 #CharButtons input, #UpdatePanel1 #CharButtons input:hover { color: white; }
    #SplashContainer #UserPlacesPane { background-color: #2b2d31; }
    #SplashContainer #UserPlacesPane #UserPlaces_Header { background-color: #25272b; }
    #Header .Navigation { background-color: #2b2d31; }
    #Banner #Alerts #AlertSpace { background-color: white; border: solid 1px #000; }
    .GridHeader { color: white; background-color: #25272b; }
    .Grid, .GridPager { background-color: #2b2d31; color: white; }
    .GridItem:hover a { color: #4a5059; }
    #ItemContainer { background-color: #555; border: solid 1px #eee; color: #eee;}
    #ItemContainer h2 { background-color: #333; color: #ccc; }
    #UserAssetsPane #UserAssets h4, #UserBadgesPane #UserBadges h4, #UserStatisticsPane #UserStatistics h4 { background-color: #333; border-bottom: solid 1px #000; color: #ccc; }
    #ItemContainer .CommentsContainer .Comment { background-color: #666; }
    #ItemContainer #Summary { background-color: #555; color: #fff; border: dashed 1px #fff; }
    #CatalogContainer .SearchBar { background-color: #27292c; border: solid 0px #bbb; }
    .content h2 { background-color: rgb(0, 0, 0); color: rgb(191,191,191); }
    .Legalese a { text-decoration: underline; }
    #UserAssetsPane .AssetsMenuItem_Selected { background-color: #777; }
    #ProfilePane table, #LoginView .AspNet-Login, td.forumRow, td.forumRowHighlight, td.forumAlternate, .modalPopup { background-color: #313439; }
    #CatalogContainer .Asset .AssetThumbnail { border: solid 1px #fff; }
    #Error { background-color: #555; color: #eee; }
    #Error h2 { background-color: #333; color: #ccc; }
    #ItemContainer #Configuration { background-color: #555; border-bottom: dashed 1px #fff; border-left: dashed 1px #fff; border-right: dashed 1px #fff; }
    #ItemContainer #Actions { background-color: #555; border-top: dashed 1px #fff; border-bottom: dashed 1px #fff; border-left: dashed 1px #fff; border-right: dashed 1px #fff; }
    #EditItemContainer, #Registration, #AlreadyRegistered, #TermsAndConditions, #EditProfileContainer { background-color: #555; color: #eee; }
    #EditItemContainer h2, #Registration h2, #AlreadyRegistered h3, #TermsAndConditions h3, #EditProfileContainer h2, .Panel h4 { background-color: #333; color: #ccc; }
    #FrameLogin, #FrameLogin h3 { color: black; }
    #PaneNewUser { background-color: #313439; border: 1px solid #dcdcdc; color: white; }
    .normalTextSmall, .normalTextSmallBold, .normalTextSmaller, a.forumTitle:visited, a.forumTitle:link, a.linkSmallBold:visited, a.linkMenuSink:visited, a.menuTextLink:visited, a.menuTextLink:link, #FeaturedBadge_Community .FeaturedBadgeContent p, #BadgesContainer .Legend .BadgesList { color: white; }
    td.forumHeaderBackgroundAlternate, #BadgesContainer .Legend .BadgesList li, #BadgesContainer .Legend h4 { background-color: #313439; background-image: none;}
    #BadgesContainer .AccordionHeader, #BadgesContainer .TopAccordionHeader, #BadgesContainer .BottomAccordionHeader, #FeaturedBadge_Community h4, #MyAccountBalanceContainer h3 { background-color: #343434; }
    #BadgesContainer .AccordionHeader:hover, #BadgesContainer .TopAccordionHeader:hover, #BadgesContainer .BottomAccordionHeader:hover { background-color: #707070; }
    #InboxContainer .InboxRow:hover, #InboxContainer .InboxRow_Unread:hover { background-color: #ddd; color: #4a5059; }
    #InboxContainer .InboxRow:hover a, #InboxContainer .InboxRow_Unread:hover a { color: #4a5059; }
`)
})();