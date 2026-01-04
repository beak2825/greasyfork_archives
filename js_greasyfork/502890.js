// ==UserScript==
// @name         S.TO Alternate Style | DarkMode
// @namespace    https://s.to/
// @version      24.8A2
// @description  Alternativer Stil für S.TO als Darkmode.
// @author       mOlDaViA
// @match        https://s.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/502890/STO%20Alternate%20Style%20%7C%20DarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/502890/STO%20Alternate%20Style%20%7C%20DarkMode.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function () {
  'use strict';

  var mainLoggedInSiteCSS = '';
  var mainLoggedOutSiteCSS = '';
  var seriesSiteCSS = '';
  var popularSiteCSS = '';
  var manualSiteCSS = '';
  var searchSiteCSS = '';
  var randomiteCSS = '';
  var calenderSiteCSS = '';
  var accountSiteCSS = '';
  var profileSiteCSS = '';
  var messagesSiteCSS = '';
  var supportSiteCSS = '';
  var watchlistSiteCSS = '';
  var aboSiteCSS = '';
  var settingsSiteCSS = '';

  var wrapper = document.getElementById("wrapper");
  var container = document.querySelector(".container");
  var footer = document.querySelector(".footer");
  var images = document.querySelectorAll('.shoutboxMessage img');
  var logo = document.querySelector('.header-logo');
  var modal = document.querySelector(".modal");
  var avatar = document.querySelector(".avatar");
  var dd = document.querySelector(".dd");
  var homepageInfo = document.querySelector('.homepageInformationText');
  var censorElement1 = document.querySelector(
    'div[style="display: block;padding: 0;color: white;font-weight: bold;background: #243743; margin: 8px 0 0 0;font-size: 15px;"]'
  );
  var censorElement2 = document.querySelector(".censorshipWarning");
  var censorElement3 = document.querySelector(".censorshipInfo");

  var sb = document.querySelector(".shoutbox");
  var sbBody = document.querySelector(".shoutboxBody");
  var sbHeader = document.querySelector(".shoutboxHeader");
  var sbOpenButton = document.createElement('div');
  var sbArrow = document.createElement('i');
  var sbcomments = document.createElement('i');
  var isDarkMode = true;

  wrapper.appendChild(sbBody);

  if (isDarkMode) {
    mainLoggedInSiteCSS = /*css*/`
        .button {
    color: #d8d4cf;
    }

    .button.blue {
    background: #243743;
    }

    @media(min-width: 1200px) {
    .container {
      padding-top: 100px;
    }
    }

    .col-md-12.col-sm-12.col-xs-12{
      padding-top: 3px
    }
    .homepageSupportFAQList{
      padding-bottom: 22px
    }
    .col-lg-12.col-md-12.col-xs-12.col-sm-4{
      height: 100px
    }

    .main-header {
    background: #1d2c36;
    position: fixed;
    width: 100%;
    z-index: 500;
    box-shadow: 0px 5px 10px rgb(0, 0, 0, 1);
    }

    .header-content{
    background: transparent;
    }

    .header-container a {
    color: #d8d4cf;
    }

    .header-container nav .offset-navigation,
    .listTag.right{
    float: left;
    }

    .header-container nav .user {
    display: block;
    margin-left: 135px;
    }
    
    .header-container nav > ul {
  padding: 0 45px;
}

    .header-container nav .user .avatar {
    margin-right: 15px;
    }

    .header-container nav .user .modal ul li .icon-container i {
    color: #d8d4cf;
    }

    .logo-wrapper{
    background: transparent;
    padding: 0px;
    }

    .primary-navigation{
    padding: 22px 0 22px 50px;
    }

    .primary-navigation > ul > li ul li i {
      color: #d8d4cf;
    }

    .primary-navigation > ul > li ul li i

    .menuSearchButton .fas.fa-search {
    font-size: 20px;
    color: #d8d4cf;
    margin: 0;
    }

    .liveNewsFeedButton> i.fas.fa-bell {
    font-size: 20px;
    color: #d8d4cf;
    margin: 0;
    }

    .catalogNav{
    margin-top: 20px;
    margin-bottom: 0px;
    padding-left: 5px;
    }

    .catalogNav li {
    float: left;
    line-height: 27px;
    margin-right: 8px;
    margin-bottom: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 1);
    background: #1d2c36;
    text-align: center;
    }

    .catalogNav li a {
    color: #fff;
    display: block;
    text-decoration: none;
    }

    .coverListNavigation span {
    color: #d8d4cf;
    background: transparent;
    }

    .coverListItem img.loaded,
    .homeContentPromotionBoxPicture img.loaded,
    .seriesCoverBox img.loaded {
    opacity:0.85;
    }

    .container h1, .container h2, .container h3, .container h4, .container h6, .pageTitle h1 {
    color: #d8d4cf;
    }

    .homeContentPromotionBoxPicture > span > h3 {
    color: #d8d4cf;
    }

    .newEpisodeList a, .newEpisodeList strong {
    color: #d8d4cf;
    }


    .homeContentGenresList li a, .homeContentGenresList li > div {
    color: #d8d4cf;
    background: #243743;
    }

    .homepageSupportFAQList {
    background: #1b2431;
    padding: 20px 20px;
    margin-bottom: 8px;
    margin-top: 12px;
    box-shadow: 0 1px 12px #090c0f;
    }

    .listTag.green {
    border: 2px solid #009941;
    }

    .listTag.blue2 {
    border: 2px solid #308abe;
    }

    // .listTag.bigListTag.grey{
    //   border-color: #009941;
    //   background: #009941
    // }

    .newEpisodeList {
    background: #252e35;
    }

    #searchAutocomplete img {
      opacity: 0.85;
    }

    .coverListItem img {
      opacity: 0.85;
    }

    .shoutboxBody {
      display: none;
      position: fixed;
      bottom: 170px;
      right: 25px;
      width: 300px;
      background: #040404;
      border-radius: 25px;
      z-index: 999;
      max-height: 500px;
      height: 500px;
    }
    
    #shoutboxMessage{
      height: 60px;
    }

    .shoutboxMessages {
      height: 355px;
    }

    .tvSeriesCalendarNavigation .listTag, .newEpisodeList .listTag {
    color: #d8d4cf;
    }

    .tvSeriesCalendarNavigation ul li a {
    color: #d8d4cf;
    }
    `;

    mainLoggedOutSiteCSS = /*css*/`

    `;

    seriesSiteCSS = /*css*/`

    `;

    popularSiteCSS = /*css*/`

    `;

    manualSiteCSS = /*css*/`

    `;

    searchSiteCSS = /*css*/`

    `;

    randomiteCSS = /*css*/`

    `;

    calenderSiteCSS = /*css*/`

    `;

    accountSiteCSS = /*css*/`

    `;

    profileSiteCSS = /*css*/`

    `;

    messagesSiteCSS = /*css*/`

    `;

    watchlistSiteCSS = /*css*/`

    `;

    aboSiteCSS = /*css*/`

    `;

    settingsSiteCSS = /*css*/`

    `;
  }
  else {
    mainLoggedInSiteCSS = /*css*/`

    `;

    mainLoggedOutSiteCSS = /*css*/`

    `;

    seriesSiteCSS = /*css*/`

    `;

    popularSiteCSS = /*css*/`

    `;

    manualSiteCSS = /*css*/`

    `;

    searchSiteCSS = /*css*/`

    `;

    randomiteCSS = /*css*/`

    `;

    calenderSiteCSS = /*css*/`

    `;

    accountSiteCSS = /*css*/`

    `;

    profileSiteCSS = /*css*/`

    `;

    messagesSiteCSS = /*css*/`

    `;

    watchlistSiteCSS = /*css*/`

    `;

    aboSiteCSS = /*css*/`

    `;

    settingsSiteCSS = /*css*/`

    `;
  }

  GM_addStyle(mainLoggedInSiteCSS);
  // GM_addStyle(mainLoggedOutSiteCSS);
  // GM_addStyle(seriesSiteCSS);
  // GM_addStyle(popularSiteCSS);
  // GM_addStyle(manualSiteCSS);
  // GM_addStyle(searchSiteCSS);
  // GM_addStyle(randomiteCSS);
  // GM_addStyle(calenderSiteCSS);
  // GM_addStyle(accountSiteCSS);
  // GM_addStyle(profileSiteCSS);
  // GM_addStyle(messagesSiteCSS);
  // GM_addStyle(supportSiteCSS);
  // GM_addStyle(watchlistSiteCSS);
  // GM_addStyle(aboSiteCSS);
  // GM_addStyle(settingsSiteCSS);

  //     function onDOMLoaded() {
  //         replaceHeaderLogo();
  //     }

  //     if (document.readyState === 'loading') {
  //         document.addEventListener('DOMContentLoaded', onDOMLoaded);
  //     } else {
  //         onDOMLoaded();
  //     }

  /* HEADER */
  // #region HEADER

  logo.src = "https://gist.githubusercontent.com/m0lDaViA/40efba16fd61e23d8348925ac4678896/raw/016aeb60af9777a8095059871bb8116efb37b4a2/logo-sto-serienstream-sx-to-serien-online-streaming-vod-NEW4.svg";

  /* REMOVED */
  dd.remove();
  censorElement1.remove();
  // censorElement2.remove();
  censorElement3.remove();
  homepageInfo.remove();
  sb.remove();
  avatar.appendChild(modal);
  avatar.addEventListener("mouseover", function () {
    $(".modal").fadeIn(200)
  })
  // #endregion

  wrapper.addEventListener("click", function () {
    $(".modal").hide()
  })

  // #region SHOUTBOX
  sbOpenButton.class = "sbOpenButton";
  sbOpenButton.style.position = 'fixed';
  sbOpenButton.style.bottom = '100px';
  sbOpenButton.style.right = '120px';
  sbOpenButton.className = 'sbOpenButton';
  sbOpenButton.style.background = "#1d2c36"
  sbOpenButton.style.zIndex = '999';
  sbOpenButton.style.boxSizing = 'border-box';
  sbOpenButton.style.boxShadow = 'rgb(0, 0, 0) 0px 1px 3px';
  sbOpenButton.style.width = '100px';
  sbOpenButton.style.height = '50px';
  sbOpenButton.style.borderRadius = '25px';
  sbOpenButton.style.display = "flex";
  sbOpenButton.style.cursor = "pointer";
  sbOpenButton.addEventListener("click", function () {
    if ($(".shoutboxBody").is(":visible")) {
      $(".shoutboxBody").hide();
      $(".shoutboxHeader .fas.fa-arrow-circle-up").removeClass("fa-arrow-circle-up").addClass("fa-arrow-circle-down");
      eraseCookie("displayShoutbox")
    } else {
      $(".shoutboxBody").fadeIn();
      $(".shoutboxHeader .fas.fa-arrow-circle-down").removeClass("fa-arrow-circle-down").addClass("fa-arrow-circle-up");
      shoutbox.updatePosts();
      createCookie("displayShoutbox", 1, 7)
    }
  });
  sbOpenButton.addEventListener("mouseover", function () {
    $(".sbOpenButton").style.background = "#243743";
  });

  sbArrow.className = 'fas fa-arrow-circle-up';
  sbArrow.style.position = 'absolute';
  sbArrow.style.color = "#d8d4cf"
  sbArrow.style.borderRadius = '65px';
  sbArrow.style.fontSize = '21px';
  sbArrow.style.height = '33px';
  sbArrow.style.width = '33px';
  sbArrow.style.top = '32%';
  sbArrow.style.left = '60%';
  // Comments
  sbcomments.className = 'fas fa-comments';
  sbcomments.style.position = 'absolute';
  sbcomments.style.color = "#d8d4cf"
  sbcomments.style.borderRadius = '65px';
  sbcomments.style.fontSize = '21px';
  sbcomments.style.height = '33px';
  sbcomments.style.width = '33px';
  sbcomments.style.top = '32%';
  sbcomments.style.left = '20%';

  /* MESSAGES */

  images.forEach(function (img) {
    img.style.borderRadius = '20px';
  });

  // #endregion

  /* ADD */

  sbOpenButton.appendChild(sbArrow);
  sbOpenButton.appendChild(sbcomments);
  wrapper.insertBefore(sbOpenButton, footer);

})();