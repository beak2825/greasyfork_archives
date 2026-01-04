// ==UserScript==
// @name Igre123.com - Old Theme
// @namespace https://greasyfork.org/users/668240
// @version 1.0.8
// @description Dark theme for Slovenian page igre123.com
// @author .itstyler.
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/409482/Igre123com%20-%20Old%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/409482/Igre123com%20-%20Old%20Theme.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `

 
@document domain("igre123.com") {
    html {
        background-color: #dae5ea;
    }
    
    body {
        font-size: 15px;
        background-color: #dae5ea;
    }
    
    
    
    
    
    #MainMenuContainer {
        position: static;
        left: 0;
        top: 0;
        width: 100%;
        height: 221px;
        margin-bottom: -90px;
        background: url(http://shrani.si/f/1C/Bl/4gLgggso/circles.png);
        background-repeat: no-repeat;
        background-position: 70%;
    }
    
    #MainMenu {
        position: relative;
        width: 990px;
        height: 221px;
        margin: 0 auto;
        background: none;
    }
    
    #MainMenu::after {
        display: none;
        background: none;
    
    }
    
    #MainMenuLogo a {
        background-repeat: no-repeat;
        background-position: left;
        width: 320px;
        height: 100px;
    }
    
    #MainMenuUserLinks {
        position: absolute;
        margin-top: 0;
        right: 0;
        width: auto;
        height: 33px;
        padding-right: 10px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: #e7eff1;
        background-color: rgba(231, 239, 241, 0.69);
        font-size: 12px;
    }
    
    #MainMenuUserLinks img {
        display: none;
    }
    
    #MainMenuUserLinks span {
        margin-top: 3px;
    }
    
    #MainMenuUserLinks a {
        font-size: 13px;
        color: #404041;
        font-weight: normal;
    }
    
    .iconlink .icon-bubbles3::before {
        content: "sporočila";
        font-family: "Trebuchet MS";
        font-size: 13px;
        line-height: 32px;
        font-weight: normal;
        color: #404041;
        padding-left: 10px;
    
    }
    
    .iconlink .icon-file-text::before {
        content: "obvestila";
        font-family: "Trebuchet MS";
        font-size: 13px;
        line-height: 32px;
        font-weight: normal;
        color: #404041;
        padding-left: 10px;
        padding-right: 10px;
    }
    
    .dropdown input[type="checkbox"]+.dropdown_button .arrow {
        border-top: 8px solid black;
    }
    
    .dropdown .dropdown_content {
        background-color: #e7eff1;
        background-color: rgba(231, 239, 241, 0.80);
        padding-bottom: 3px;
        margin-top: 9px;
    }
    
    #NumOfUnreadPmsSpan {
        top: 0px;
        left: -1px;
        font-size: 11px;
    }
    
    #NumOfUnSeenNotifications {
        top: 0px;
        left: -10px;
        font-size: 11px;
    }
    
    #MainMenuPortalLinks {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        float: right;
        margin-top: 50px;
        height: 29px;
        width: 215px;
        padding-top: 10px;
        padding-right: 10px;
        background: #bac7cd;
    }
    
    #MainMenuPortalLinks a {
        color: #404041;
        padding-left: 5px;
        padding-right: 5px;
        padding-top: 4px;
        padding-bottom: 4px;
        font-size: 14px;
    }
    
    #MainMenuPortalLinks a.SelectedMenuItem {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: #e7eff1;
        border: none;
    }
    
    #MainMenuPortalLinks a:hover {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: #e7eff1;
    }
    
    form[action="/action/search_Base/RedirectToSearch"] {
        margin-left: 150px;
        margin-top: 33px;
        width: 300px;
    }
    
    #txtSearch {
        border: 1px solid #cdcccc;
    }
    
    #btnDoSearch {
        border: 1px solid #cdcccc;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Igralni Menu - - - */
    #CategoriesContainer {
        background-color: transparent;
    }
    
    #CategoriesMenu {
        background-color: #fff;
        height: 30px;
        padding-top: 2px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        position: relative;
        z-index: 3;
    }
    
    #CategoriesMenuCategories {
        margin: auto;
    }
    
    #CategoriesMenu a {
        color: #404041;
        font-size: 14px;
    }
    
    #CategoriesMenu [class^='icon-']:before {
        color: #404041;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Igre - - - */
    .content-with-top {
        z-index: 10;
        background: #b9c7cd !important;
    }
    
    #GamesCategory {
        background-color: transparent;
    }
    
    #GamesCategoryHeader {
        position: relative;
    }
    
    #TopBanner {
        display: none;
    }
    
    .SortHolder {
        padding-top: 0;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Prijava - - - */
    #SignupPageBackground {
        width: 1000px;
        position: relative;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Profil - - - */
    #content {
        background-color: #fff;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        display: flex;
        flex-wrap: wrap;
    }
    
    #MyProfileMenu {
        order: 1;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        padding-bottom: 5px;
        background-color: #fff;
        width: 990px;
        height: 65px;
        z-index: 7;
        font-size: 14px;
        font-weight: bold;
    }
    
    #MyProfileMenuInner {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: #879aa4;
        width: 955px !important;
        margin-left: 10px !important;
        margin-right: 10px !important;
        margin-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        overflow: hidden !important;
        height: 34px !important;
    }
    
    #MyProfileMenu #MyProfileMenuInner ol li a {
        color: #e7eff1;
    }
    
    
    #MyProfileMenu #MyProfileMenuInner ol li:hover {
        background-color: #e7eff1;
    }
    
    #MyProfileMenu #MyProfileMenuInner ol li:hover a {
        color: #404041;
    }
    
    #MyProfileMenu #MyProfileMenuInner ol li.SelectedItem {
        background-color: #e7eff1;
    }
    
    #MyProfileMenu #MyProfileMenuInner ol li.SelectedItem a {
        color: #404041;
    }
    
    #MyProfile {
        order: 2;
        overflow: hidden;
        justify-content: space-between;
        width: 340px;
        height: auto;
        margin-left: 0px;
        margin-top: -50px;
        z-index: 5;
        background-color: #fff;
    }
    
    #MyProfile #MyProfileImage img {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 0px !important;
        border-bottom-right-radius: 0px !important;
        width: 300px;
        height: auto;
        max-height: none;
        float: left;
        background-color: #fff;
        margin-left: 10px;
    }
    
    #MyProfile #MyProfileData {
        margin-left: 10px;
    }
    
    #MyProfile #MyProfileData #MyName {
        display: none;
    }
    
    #MyProfile #MyProfileData #MyControls {
        float: left;
        margin-bottom: 15px;
    }
    
    #MyProfile #MyProfileData #MyControls #SendPm .FakeButton {
        background-color: #899ba5;
        margin-right: 13px;
        border: solid 1px #899ba5;
    }
    
    #FriendshipStatus a.FakeButton {
        background-color: #899ba5;
        border: solid 1px #899ba5;
    }
    
    #MyProfile #MyProfileData #MyUsername {
        float: left;
        padding: 10px;
        margin-bottom: 10px;
        width: 280px;
        height: 20px;
        background-color: #899ba5;
        color: #fff;
        font-size: 20px;
        font-weight: normal;
        margin-top: -5px;
    }
    
    #ProfileWrapper {
        order: 3;
        float: left;
        width: 650px;
        overflow: hidden;
        background-color: #fff;
        position: relative;
    }
    
    #ProfileWrapper #ProfileBoxes {
        display: grid;
        grid-template-columns: repeat(2, 300px);
        grid-gap: 25px 30px;
        padding: 0;
        padding-bottom: 25px;
    }
    
    #ProfileWrapper #ProfileBoxes .ProfileBox {
        margin-top: 0;
    }
    
    #ProfileWrapper .GamesCategorySubtitle {
        background-color: #889ba5;
        padding-left: 10px;
        padding-top: px;
        padding-bottom: 3px;
        width: 625px;
        height: 30px;
        z-index: 5;
    }
    
    
    .GamesCategorySubtitle .SubTitleHolder h2 {
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        margin: 0;
    }
    
    div.GamesCategorySubtitle .SubTitleHolder h2 span {
        font-size: 12px;
    }
    
    #ProfileWrapper #GameBottom #msgTable .pager-items .img {
        padding-left: 0px;
    }
    
    #ProfileWrapper #GameBottom #msgTable .pager-items .usr {
        padding-left: 5px;
        font-size: 14px;
    }
    
    #ProfileWrapper #GameBottom #msgTable .pager-items a {
        font-size: 14px;
    }
    
    .forumsubj {
        padding-left: 10px;
    }
    
    #ProfileDescription {
        margin-right: 5px;
    }
    
    #GameBottom {
        display: flex;
        flex-direction: column;
        margin-right: 15px;
    }
    
    #msgTable {
        order: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    
    .pager-items {
        order: 1;
    }
    
    #addCommentDiv .even {
        width: 670px;
        margin-top: 10px;
        margin-left: -10px;
        overflow: hidden;
    }
    
    #addCommentDiv #smilies-link {
        margin-right: 50px;
    }
    
    #addCommentDiv textarea {
        width: 600px;
        overflow: hidden;
    }
    
    .addCommentForm {
        order: 2;
        height: 230px;
        overflow: auto;
        z-index: 7;
    }
    
    .forumsubj #btnSend {
        margin-top: -20px;
        position: absolute;
    }
    
    .img {
        z-index: 1;
        position: relative;
    }
    
    .usr {
        z-index: 1;
        position: relative;
    }
    
    .FriendsList ul li {
        margin: 0;
    }
    
    .NumOfUnconfirmedFriends {
        background-color: #ccdbe1;
        color: #404041;
        border-radius: 5px;
    }
    
    #pager {
        order: 2;
        margin-top: 5px;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    .profileblock .row .even {
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Sporočila - - - */
    #private-messages {
        position: absolute;
        z-index: 5;
        margin-top: 30px;
        width: 990px;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Forum - - - */
    #forumHolder {
        margin-top: 25px;
    }
    
    #scrollToTop {
        background-color: #879aa4 !important;
    }
    
    .msgSubject {
        background-color: #b9c7cd;
    }
    
    .msgSubject a {
        color: black !important;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Obvestila - - - */
    #Notifications {
        position: absolute;
        z-index: 5;
        width: 990px;
        margin-top: 30px;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Nastavitve - - - */
    #MySettingsMenu {
        background-color: #fff;
        z-index: 5;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Chat settings - - - */
    #content {
        background: rgba(0, 0, 0, 0);
        margin-top: 0px;
    }
    
    #title-and-menu {
        position: absolute;
        width: 990px;
        background-color: rgba(0, 0, 0, 0);
    }
    
    #wideContent {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        background: #b9c7cd;
        padding: 10px;
        margin-top: 25px;
        margin-right: 0;
        display: flex;
        z-index: 5;
        position: absolute;
    }
    
    #groupchat-message {
        float: left;
        width: 748px;
    }
    
    #groupchatmenu {
        border-top-left-radius: 5px;
        float: left;
        width: 748px;
        height: 28px;
        padding-top: 2px;
        background: #879aa4;
    }
    
    #FirstTabContainer {
        background: #879aa4;
    }
    
    li#GroupChatTab.selected a.name-no-close span.icon-users:before,
    li#GroupChatTab a.name-no-close span.icon-users:before {
        content: "vsi";
        font-family: "Trebuchet MS";
        font-size: 12px;
        font-weight: bold;
    }
    
    #tab-mover {
        border-top-right-radius: 5px;
        float: right;
        position: absolute;
        right: 235px;
        height: 28px;
        background: #879aa4;
    }
    
    .groupchatmenu-container {
        background-color: #879aa4;
    }
    
    .groupchatmenu-container li a.name {
        background: #879aa4;
    }
    
    .groupchatmenu-container li a.close {
        background-color: #879aa4;
    }
    
    .icon-user[class^="icon-"],
    [class*=" icon-"] {
        display: block;
    }
    
    #GroupChatMessagesDivContainer {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        float: left;
        clear: both;
        width: 748px;
        background: #fff;
        padding-bottom: 5px;
        padding-top: 2px;
    }
    
    .messages {
        background: #fff;
        clear: both;
        height: 460px;
        overflow: auto;
    }
    
    .messages li {
        border-bottom: 1px solid #d9d9d9;
        padding: 2px 4px 1px 4px;
    }
    
    .messages li.GroupChatSysMessage {
        padding: 2px 4px 1px 4px;
        background-color: #fefbc8;
        text-align: center;
    }
    
    #post-message {
        border-top-left-radius: 5px !important;
        border-top-right-radius: 5px !important;
        border-bottom-left-radius: 5px !important;
        border-bottom-right-radius: 5px !important;
        float: left;
        width: 748px;
        height: 81px;
        margin-top: 10px;
        background: #e7eff1;
    }
    
    #post-message input.text {
        margin-bottom: 8px;
    }
    
    #post-message a#smilies-link {
        margin-top: 5px;
    }
    
    #UsersListContainer {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        padding: 5px;
        margin-left: 10px;
        background: #e7eff1;
        width: 206px;
    }
    
    #UserListTitle {
        display: none;
    }
    
    #UsersList {
        width: 200px;
        height: 566px;
        background: #e7eff1;
    }
    
    #UsersList li {
        border-bottom: 1px solid #d9d9d9;
    }
    
    .SmallAvatar {
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        width: 43px;
        height: 43px;
        padding-left: 3px;
        margin-right: 7px;
    }
    
    .userinfo span.UserInfoUserName {
        margin-top: 1px;
    }
    
    .UserInfoProfile {
        width: 120px;
        height: 12px;
        float: left;
        padding-bottom: 3px;
        margin: 0;
    }
    
    .UserName::before {
        content: "Profil ";
        font-size: 12px;
    }
    
    input[type="button"],
    input[type="submit"] {
        background-color: #6d6b6c !important;
        font-family: "Trebuchet MS";
    }
    
    a#smilies-link {
        width: 100px;
    }
    
    a#smilies-link::after {
        content: " Dodaj smeška";
        color: black;
    }
    
    #CrosslinksBreaker {
        background-color: #dae5ea;
        width: 1000px;
        margin-top: 625px;
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /* - - - Footer - - - */
    
    #footerContainer {
        position: absolute;
    }
    
    .cookie_consent span {
        margin: 0 auto;
        padding: 5px;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        background-color: #fff;
        margin-bottom: 20px;
        color: #404041;
    }
`;
if ((location.hostname === "igre123.com" || location.hostname.endsWith(".igre123.com"))) {
  css += `
      html {
          background-color: #dae5ea;
      }
      
      body {
          font-size: 15px;
          background-color: #dae5ea;
      }
      
      
      
      
      
      #MainMenuContainer {
          position: static;
          left: 0;
          top: 0;
          width: 100%;
          height: 221px;
          margin-bottom: -90px;
          background: url(http://shrani.si/f/1C/Bl/4gLgggso/circles.png);
          background-repeat: no-repeat;
          background-position: 70%;
      }
      
      #MainMenu {
          position: relative;
          width: 990px;
          height: 221px;
          margin: 0 auto;
          background: none;
      }
      
      #MainMenu::after {
          display: none;
          background: none;
      
      }
      
      #MainMenuLogo a {
          background-repeat: no-repeat;
          background-position: left;
          width: 320px;
          height: 100px;
      }
      
      #MainMenuUserLinks {
          position: absolute;
          margin-top: 0;
          right: 0;
          width: auto;
          height: 33px;
          padding-right: 10px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: #e7eff1;
          background-color: rgba(231, 239, 241, 0.69);
          font-size: 12px;
      }
      
      #MainMenuUserLinks img {
          display: none;
      }
      
      #MainMenuUserLinks span {
          margin-top: 3px;
      }
      
      #MainMenuUserLinks a {
          font-size: 13px;
          color: #404041;
          font-weight: normal;
      }
      
      .iconlink .icon-bubbles3::before {
          content: "sporočila";
          font-family: "Trebuchet MS";
          font-size: 13px;
          line-height: 32px;
          font-weight: normal;
          color: #404041;
          padding-left: 10px;
      
      }
      
      .iconlink .icon-file-text::before {
          content: "obvestila";
          font-family: "Trebuchet MS";
          font-size: 13px;
          line-height: 32px;
          font-weight: normal;
          color: #404041;
          padding-left: 10px;
          padding-right: 10px;
      }
      
      .dropdown input[type="checkbox"]+.dropdown_button .arrow {
          border-top: 8px solid black;
      }
      
      .dropdown .dropdown_content {
          background-color: #e7eff1;
          background-color: rgba(231, 239, 241, 0.80);
          padding-bottom: 3px;
          margin-top: 9px;
      }
      
      #NumOfUnreadPmsSpan {
          top: 0px;
          left: -1px;
          font-size: 11px;
      }
      
      #NumOfUnSeenNotifications {
          top: 0px;
          left: -10px;
          font-size: 11px;
      }
      
      #MainMenuPortalLinks {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          float: right;
          margin-top: 50px;
          height: 29px;
          width: 215px;
          padding-top: 10px;
          padding-right: 10px;
          background: #bac7cd;
      }
      
      #MainMenuPortalLinks a {
          color: #404041;
          padding-left: 5px;
          padding-right: 5px;
          padding-top: 4px;
          padding-bottom: 4px;
          font-size: 14px;
      }
      
      #MainMenuPortalLinks a.SelectedMenuItem {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: #e7eff1;
          border: none;
      }
      
      #MainMenuPortalLinks a:hover {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: #e7eff1;
      }
      
      form[action="/action/search_Base/RedirectToSearch"] {
          margin-left: 150px;
          margin-top: 33px;
          width: 300px;
      }
      
      #txtSearch {
          border: 1px solid #cdcccc;
      }
      
      #btnDoSearch {
          border: 1px solid #cdcccc;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Igralni Menu - - - */
      #CategoriesContainer {
          background-color: transparent;
      }
      
      #CategoriesMenu {
          background-color: #fff;
          height: 30px;
          padding-top: 2px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          position: relative;
          z-index: 3;
      }
      
      #CategoriesMenuCategories {
          margin: auto;
      }
      
      #CategoriesMenu a {
          color: #404041;
          font-size: 14px;
      }
      
      #CategoriesMenu [class^='icon-']:before {
          color: #404041;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Igre - - - */
      .content-with-top {
          z-index: 10;
          background: #b9c7cd !important;
      }
      
      #GamesCategory {
          background-color: transparent;
      }
      
      #GamesCategoryHeader {
          position: relative;
      }
      
      #TopBanner {
          display: none;
      }
      
      .SortHolder {
          padding-top: 0;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Prijava - - - */
      #SignupPageBackground {
          width: 1000px;
          position: relative;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Profil - - - */
      #content {
          background-color: #fff;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          display: flex;
          flex-wrap: wrap;
      }
      
      #MyProfileMenu {
          order: 1;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          padding-bottom: 5px;
          background-color: #fff;
          width: 990px;
          height: 65px;
          z-index: 7;
          font-size: 14px;
          font-weight: bold;
      }
      
      #MyProfileMenuInner {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: #879aa4;
          width: 955px !important;
          margin-left: 10px !important;
          margin-right: 10px !important;
          margin-top: 10px;
          padding-bottom: 10px;
          padding-left: 10px;
          overflow: hidden !important;
          height: 34px !important;
      }
      
      #MyProfileMenu #MyProfileMenuInner ol li a {
          color: #e7eff1;
      }
      
      
      #MyProfileMenu #MyProfileMenuInner ol li:hover {
          background-color: #e7eff1;
      }
      
      #MyProfileMenu #MyProfileMenuInner ol li:hover a {
          color: #404041;
      }
      
      #MyProfileMenu #MyProfileMenuInner ol li.SelectedItem {
          background-color: #e7eff1;
      }
      
      #MyProfileMenu #MyProfileMenuInner ol li.SelectedItem a {
          color: #404041;
      }
      
      #MyProfile {
          order: 2;
          overflow: hidden;
          justify-content: space-between;
          width: 340px;
          height: auto;
          margin-left: 0px;
          margin-top: -50px;
          z-index: 5;
          background-color: #fff;
      }
      
      #MyProfile #MyProfileImage img {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
          width: 300px;
          height: auto;
          max-height: none;
          float: left;
          background-color: #fff;
          margin-left: 10px;
      }
      
      #MyProfile #MyProfileData {
          margin-left: 10px;
      }
      
      #MyProfile #MyProfileData #MyName {
          display: none;
      }
      
      #MyProfile #MyProfileData #MyControls {
          float: left;
          margin-bottom: 15px;
      }
      
      #MyProfile #MyProfileData #MyControls #SendPm .FakeButton {
          background-color: #899ba5;
          margin-right: 13px;
          border: solid 1px #899ba5;
      }
      
      #FriendshipStatus a.FakeButton {
          background-color: #899ba5;
          border: solid 1px #899ba5;
      }
      
      #MyProfile #MyProfileData #MyUsername {
          float: left;
          padding: 10px;
          margin-bottom: 10px;
          width: 280px;
          height: 20px;
          background-color: #899ba5;
          color: #fff;
          font-size: 20px;
          font-weight: normal;
          margin-top: -5px;
      }
      
      #ProfileWrapper {
          order: 3;
          float: left;
          width: 650px;
          overflow: hidden;
          background-color: #fff;
          position: relative;
      }
      
      #ProfileWrapper #ProfileBoxes {
          display: grid;
          grid-template-columns: repeat(2, 300px);
          grid-gap: 25px 30px;
          padding: 0;
          padding-bottom: 25px;
      }
      
      #ProfileWrapper #ProfileBoxes .ProfileBox {
          margin-top: 0;
      }
      
      #ProfileWrapper .GamesCategorySubtitle {
          background-color: #889ba5;
          padding-left: 10px;
          padding-top: px;
          padding-bottom: 3px;
          width: 625px;
          height: 30px;
          z-index: 5;
      }
      
      
      .GamesCategorySubtitle .SubTitleHolder h2 {
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          margin: 0;
      }
      
      div.GamesCategorySubtitle .SubTitleHolder h2 span {
          font-size: 12px;
      }
      
      #ProfileWrapper #GameBottom #msgTable .pager-items .img {
          padding-left: 0px;
      }
      
      #ProfileWrapper #GameBottom #msgTable .pager-items .usr {
          padding-left: 5px;
          font-size: 14px;
      }
      
      #ProfileWrapper #GameBottom #msgTable .pager-items a {
          font-size: 14px;
      }
      
      .forumsubj {
          padding-left: 10px;
      }
      
      #ProfileDescription {
          margin-right: 5px;
      }
      
      #GameBottom {
          display: flex;
          flex-direction: column;
          margin-right: 15px;
      }
      
      #msgTable {
          order: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
      }
      
      .pager-items {
          order: 1;
      }
      
      #addCommentDiv .even {
          width: 670px;
          margin-top: 10px;
          margin-left: -10px;
          overflow: hidden;
      }
      
      #addCommentDiv #smilies-link {
          margin-right: 50px;
      }
      
      #addCommentDiv textarea {
          width: 600px;
          overflow: hidden;
      }
      
      .addCommentForm {
          order: 2;
          height: 230px;
          overflow: auto;
          z-index: 7;
      }
      
      .forumsubj #btnSend {
          margin-top: -20px;
          position: absolute;
      }
      
      .img {
          z-index: 1;
          position: relative;
      }
      
      .usr {
          z-index: 1;
          position: relative;
      }
      
      .FriendsList ul li {
          margin: 0;
      }
      
      .NumOfUnconfirmedFriends {
          background-color: #ccdbe1;
          color: #404041;
          border-radius: 5px;
      }
      
      #pager {
          order: 2;
          margin-top: 5px;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      .profileblock .row .even {
          
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Sporočila - - - */
      #private-messages {
          position: absolute;
          z-index: 5;
          margin-top: 30px;
          width: 990px;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Forum - - - */
      #forumHolder {
          margin-top: 25px;
      }
      
      #scrollToTop {
          background-color: #879aa4 !important;
      }
      
      .msgSubject {
          background-color: #b9c7cd;
      }
      
      .msgSubject a {
          color: black !important;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Obvestila - - - */
      #Notifications {
          position: absolute;
          z-index: 5;
          width: 990px;
          margin-top: 30px;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Nastavitve - - - */
      #MySettingsMenu {
          background-color: #fff;
          z-index: 5;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Chat settings - - - */
      #content {
          background: rgba(0, 0, 0, 0);
          margin-top: 0px;
      }
      
      #title-and-menu {
          position: absolute;
          width: 990px;
          background-color: rgba(0, 0, 0, 0);
      }
      
      #wideContent {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          background: #b9c7cd;
          padding: 10px;
          margin-top: 25px;
          margin-right: 0;
          display: flex;
          z-index: 5;
          position: absolute;
      }
      
      #groupchat-message {
          float: left;
          width: 748px;
      }
      
      #groupchatmenu {
          border-top-left-radius: 5px;
          float: left;
          width: 748px;
          height: 28px;
          padding-top: 2px;
          background: #879aa4;
      }
      
      #FirstTabContainer {
          background: #879aa4;
      }
      
      li#GroupChatTab.selected a.name-no-close span.icon-users:before,
      li#GroupChatTab a.name-no-close span.icon-users:before {
          content: "vsi";
          font-family: "Trebuchet MS";
          font-size: 12px;
          font-weight: bold;
      }
      
      #tab-mover {
          border-top-right-radius: 5px;
          float: right;
          position: absolute;
          right: 235px;
          height: 28px;
          background: #879aa4;
      }
      
      .groupchatmenu-container {
          background-color: #879aa4;
      }
      
      .groupchatmenu-container li a.name {
          background: #879aa4;
      }
      
      .groupchatmenu-container li a.close {
          background-color: #879aa4;
      }
      
      .icon-user[class^="icon-"],
      [class*=" icon-"] {
          display: block;
      }
      
      #GroupChatMessagesDivContainer {
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          float: left;
          clear: both;
          width: 748px;
          background: #fff;
          padding-bottom: 5px;
          padding-top: 2px;
      }
      
      .messages {
          background: #fff;
          clear: both;
          height: 460px;
          overflow: auto;
      }
      
      .messages li {
          border-bottom: 1px solid #d9d9d9;
          padding: 2px 4px 1px 4px;
      }
      
      .messages li.GroupChatSysMessage {
          padding: 2px 4px 1px 4px;
          background-color: #fefbc8;
          text-align: center;
      }
      
      #post-message {
          border-top-left-radius: 5px !important;
          border-top-right-radius: 5px !important;
          border-bottom-left-radius: 5px !important;
          border-bottom-right-radius: 5px !important;
          float: left;
          width: 748px;
          height: 81px;
          margin-top: 10px;
          background: #e7eff1;
      }
      
      #post-message input.text {
          margin-bottom: 8px;
      }
      
      #post-message a#smilies-link {
          margin-top: 5px;
      }
      
      #UsersListContainer {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          padding: 5px;
          margin-left: 10px;
          background: #e7eff1;
          width: 206px;
      }
      
      #UserListTitle {
          display: none;
      }
      
      #UsersList {
          width: 200px;
          height: 566px;
          background: #e7eff1;
      }
      
      #UsersList li {
          border-bottom: 1px solid #d9d9d9;
      }
      
      .SmallAvatar {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          width: 43px;
          height: 43px;
          padding-left: 3px;
          margin-right: 7px;
      }
      
      .userinfo span.UserInfoUserName {
          margin-top: 1px;
      }
      
      .UserInfoProfile {
          width: 120px;
          height: 12px;
          float: left;
          padding-bottom: 3px;
          margin: 0;
      }
      
      .UserName::before {
          content: "Profil ";
          font-size: 12px;
      }
      
      input[type="button"],
      input[type="submit"] {
          background-color: #6d6b6c !important;
          font-family: "Trebuchet MS";
      }
      
      a#smilies-link {
          width: 100px;
      }
      
      a#smilies-link::after {
          content: " Dodaj smeška";
          color: black;
      }
      
      #CrosslinksBreaker {
          background-color: #dae5ea;
          width: 1000px;
          margin-top: 625px;
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      /* - - - Footer - - - */
      
      #footerContainer {
          position: absolute;
      }
      
      .cookie_consent span {
          margin: 0 auto;
          padding: 5px;
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
          border-bottom-left-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: #fff;
          margin-bottom: 20px;
          color: #404041;
      }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
