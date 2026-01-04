// ==UserScript==
// @name Goodreads personal modifications (phone)
// @namespace github.com/holyspiritomb
// @version 1.22.12-15.1
// @description Making goodreads look nicer for me on my phone
// @author holyspiritomb
// @homepageURL https://github.com/holyspiritomb/userstyles/blob/main/goodreads/main-phone.user.css
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.goodreads.com/list/show/*
// @match https://www.goodreads.com/review/list/*
// @match https://www.goodreads.com/series/*
// @include /^(?:https://www\.goodreads\.com/(?!book/add_to_books_widget/).*)$/
// @include /^(?:https://www\.goodreads\.com/book/(?!add_to_books_widget/).*)$/
// @include https://www.goodreads.com*/*
// @downloadURL https://update.greasyfork.org/scripts/449807/Goodreads%20personal%20modifications%20%28phone%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449807/Goodreads%20personal%20modifications%20%28phone%29.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.goodreads.com")) {
  css += `
      :root {
          --wtr-button-width: 250px;
          --wtr-button-left-width: 200px;
          --wtr-button-height: 44px;
          --mobile-font-size: 12pt;
          --desktop-font-size: 22pt;
          --default-font: 'Lato', sans-serif;
      }
      html.desktop {
          main:has(.homeSecondaryColumn) {
              margin-left: auto !important;
              margin-right: auto !important;
              width: 100vw !important;
              .homeSecondaryColumn {
                  width: calc(50vw - 18px) !important;
                  margin-right: 6px !important;
                  margin-left: 12px !important;
              }
              .homeTertiaryColumn {
                  width: calc(50vw - 18px) !important;
                  margin-right: 6px !important;
                  margin-left: 12px !important;
              }
              .homePrimaryColumn {
                  /* width: 45vw !important; */
                  width: calc(50vw - 18px) !important;
                  margin-left: 6px !important;
                  margin-right: 12px !important;
                  .siteAnnouncement {
                      margin-left: unset !important;
                  }
                  h3.gr-newsfeed__title {
                      margin-left: unset !important;
                  }
                  .gr-newsfeedItem {
                      margin-left: unset !important;
                      .gr-newsfeedItem__body {
                          padding-right: 8px !important;
                          .gr-newsfeedItem__header {
                              margin-right: 48px !important;
                          }
                      }
                  }
              }
          }
          .wantToReadButton {
              height: var(--wtr-button-height) !important;
              width: var(--wtr-button-width) !important;
              max-width: var(--wtr-button-width) !important;
              max-inline-size: var(--wtr-button-width) !important;
              .wantToReadButton__left{
                  height: var(--wtr-button-height) !important;
                  width: var(--wtr-button-left-width) !important;
              }
              .wantToReadButton__leftUnshelved{
                  height: var(--wtr-button-height) !important;
                  width: var(--wtr-button-left-width) !important;
                  button.wantToReadButton__leftUnshelvedButton {
                      width: var(--wtr-button-width) !important;
                  }
              }
              .wantToReadButton__leftShelved{
                  height: var(--wtr-button-height) !important;
                  width: var(--wtr-button-left-width) !important;
                  button.wantToReadButton__leftShelvedButton {
                      width: var(--wtr-button-width) !important;
                      height: var(--wtr-button-height) !important;
                      .wantToReadButton__shelvedButtonText {
                          padding-top: 0px !important;
                          width: calc(var(--wtr-button-left-width) - 13px) !important;
                          min-inline-size: calc(var(--wtr-button-left-width) - 13px) !important;
                      }
                  }
              }
              .dropdown.dropdown--wantToReadMenu {
                  padding-top: 13px !important;
                  padding-bottom: 13px !important;
              }
          }
          input[type="radio"].gr-radioButtonGroup__button,
          input[type="checkbox"].wantToReadMenu__shelfCheckbox {
              height: 28px !important;
              width: 28px !important;
          }
          div.headroom-wrapper[style^="height: 50px"],
          div.headroom-wrapper[style^="height: 50px"] > .headroom--unfixed > nav {
              height: 48px !important;
          }
      }
  `;
}
if (new RegExp("^(?:https://www\\.goodreads\\.com/(?!book/add_to_books_widget/).*)\$").test(location.href)) {
  css += `

      :root {
          --mobile-font-size: 12pt;
          --desktop-font-size: 22pt;
          --default-font: 'Lato', sans-serif;
      }

      /* @media (max-width: 980px) { */
      /*     :is(td.field, th.header):is(.avg_rating, .date_added, .date_pub, .date_pub_edition, .asin, .format, .rating) { */
      /*         display: none; */
      /*     } */
      /* } */

      /* div.pageContent, */
      /* div.mainContentFloat { */
      /*     background-color: rgba(0, 0, 0, 85%); */
      /* } */

      /* new goodreads book pages */

      main.PageFrame__main.BookPage {
          /* background-color: rgba(0, 0, 0, 40%); */
          border-radius: 5px;
          padding: 10px;
          box-sizing: border-box;
      }
      @media (min-width: 1200px) {
          main.PageFrame__main.BookPage {
              max-width: 90vw;
          }
      }
      @media (min-width: 981px) {
          div.content {
              width: 98vw;
              box-sizing: border-box;
          }
          div.siteHeader {
              left: 0 !important;
          }
          .mainContent {
              margin: unset;
          }
      }
      html.mobile,
      html.mobile body .pageContent {
          font-size: var(--mobile-font-size);
          font-family: var(--default-font);
          line-height: 1.45em;
      }
      html.desktop :not(div#imagecol > div.wtrButtonContainer),
      html.desktop body .mainContentContainer * :not(div#imagecol > div.wtrButtonContainer) {
          font-size: var(--desktop-font-size);
          font-family: var(--default-font);
          line-height: 1.5em;
      }
      html.desktop div#imagecol > div.wtrButtonContainer > :is(div.wtrDown.wtrLeft, div.wtrDown.wtrRight),
      html.desktop div#imagecol > div.wtrButtonContainer > div.wtrDown.wtrLeft > span[title],
      html.desktop div#imagecol > div.wtrButtonContainer > div.wtrDown.wtrRight > button.wtrShelfButton {
          font-size: inherit !important;
          line-height: inherit !important;
      }
      h2.brownBackground,
      h2.brownBackground a {
          font-size: var(--desktop-font-size) !important;
          font-family: var(--default-font);
      }

      #bookTitle,
      h1.bookTitle,
      h1.bookTitle cite,
      cite.bookTitle,
      #bookAuthors .authorName,
      #bookAuthors .by,
      #description,
      h1,
      h1[data-testid='bookTitle'],
      span.ContributorLink__name[data-testid='name'],
      .editionsPage :is(.pageTitle,.publishedDate),
      .editionBox__desc__bookTitle,
      .readable,
      .readable :is(p, ol, ul, td, th),
      [class^="Text__h"],
      [class^="Text__title"],
      .RatingStatistics__rating {
          font-family: var(--default-font) !important;
      }
      #bookTitle {
          font-size: 3em;
      }
      h1.bookTitle,
      h1.bookTitle cite,
      cite.bookTitle {
      font-size: 24px !important;
      }
      a.siteHeader__topLevelLink,
      a.primaryNavMenu__trigger--siteHeaderBrowseMenu span {
          font-size: 16px;
      }
      html.desktop a[href='/toggle_mobile'] {
          font-size: 3em;
      }
      html.mobile a[href='/toggle_mobile'] {
          font-size: 1.5em;
      }
      .responsiveSiteFooter__appLinksColumn {
          flex-direction: column;
      }
      .gr-col-lg-4,
      div.responsiveSiteFooter__appLinksColumnBadges,
      footer > div > div.gr-row > div:first-child,
      html.mobile div#smartbanner,
      span.headerPersonalNav__flag,
      ul.responsiveSiteFooter__linkList li:first-child {
          display: none;
      }

      div.BookRatingStars {
          display: none;
      }

      @media screen and (max-width: 600px) {
          div.ReviewsList{
              max-height:75vh;
              overflow-y: auto;
          }
      }

  `;
}
if (location.href.startsWith("https://www.goodreads.com/list/show/")) {
  css += `
      /* listopia */
      div.rightContainer {
          display: none;
      }

      html.desktop .siteHeader {
          width: 100vw;
          margin-left: auto;
          margin-right: auto;
          right: unset !important;
          left: unset !important;
          overflow-x: hidden;
      }

      html.desktop #all_votes {
          width: 100%;
      }

      html.desktop .mainContentContainer .mainContent .mainContentFloat {
          width: calc(100vw - 16px);
          margin-left: 8px;
          margin-right: 8px;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
          .leftContainer {
              width: calc(100vw - 32px);
              margin-left: auto;
              margin-right: auto;
              box-sizing: border-box;
              -moz-box-sizing: border-box;
          }
      }

      html.desktop div#bodycontainer.content {
          width: 100vw;
          overflow-x: hidden;
          .mainContentContainer {
              width: 100vw;
              .mainContent {
                  width: 100vw;
              }
          }
      }
      html.desktop :is(#comment_list, #comment_form) {
          width: calc(100vw - 30px);
          margin-left: auto;
          margin-right: auto;
      }
      html.desktop .comment {
          width: calc(100vw - 32px);
          .u-anchorTarget {
              width: 90%;
          }
          .brownBox {
              width: 90%;
          }
          div > div.right {
              position: relative;
              right: 15px;
          }

      }
      html.desktop .wtrRight.wtrUp,
      html.desktop .wtrRight.wtrDown {
          width: 44px !important;
      }
      html.desktop :is(button.wtrToRead, .wtrLeft.wtrUp, .wtrRight.wtrUp, .wtrShelfButton) {
          height: 44px !important;
      }

      html.desktop .wtrButtonContainer {
          width: 212px !important;
          height: 44px !important;
          .wtrStatusToRead {
              height: 44px;
              box-sizing: border-box;
          }
          .wtrLeft.wtrUp {
              width: calc(212px - 44px) !important;
          }
          .wtrLeft.wtrDown {
              width: calc(212px - 44px) !important;
          }
          button.wtrToRead span.progressTrigger {
              font-size: 20px;
          }
          span[title="Want to Read"] {
              font-size: 20px !important;
          }
      }

      html.desktop #all_votes > table.tableList > tbody > tr {
          > td[width="100%"] {
              width: 60% !important;
          }
          > td:first-child {
              width: 5% !important;
          }
      }
  	html.desktop a.siteHeader__logo {
          display: block !important;
  	}

      html.desktop div.siteHeader__topLine > div.siteHeader__contents > div.searchBox--navbar {
          width: 45vw !important
      }
  `;
}
if (location.href.startsWith("https://www.goodreads.com/review/list/")) {
  css += `
      div#flashContainer,
      div#leadercol :is(div.myBooksNav > ul > li > span, div#header),
      div.myBooksSearch,
      div#leftCol,
      div#side,
      .myBooksNav ul li:nth-child(3),
      .myBooksNav ul li:nth-child(4),
      .myBooksNav ul li:nth-child(5),
      .myBooksNav ul li:nth-child(6),
      .myBooksNav ul li:nth-child(7) {
          display: none;
      }
      div#rightCol {
          width: 95vw !important;
      }

      html.desktop #leadercol {
          width: 94vw !important;
      }
      .siteHeaderBottomSpacer {
          display: block;
      }
      @media (min-width: 500px) {
          html.desktop.withSiteHeaderTopFullImage .siteHeaderBottomSpacer {
              padding-bottom: 100px !important;
          }
      }
      ul.personalNav > li:not(:last-child) {
          display: none;
      }
      div.right.uitext {
          float: left !important;
      }

      /* to make the page stay a certain width on my phone */
      form#perPageForm,
      div#reviewPagination {
          display: block;
          margin-top: 15px;
          margin-bottom: 15px;
      }
      div#reviewPagination a,
      div#reviewPagination em,
      form#perPageForm label,
      form#perPageForm select,
      a#batchEditLink,
      a#shelfSettingsLink {
          font-size: 26pt;
      }
      form#sortForm {
          display: none;
      }
      @media (max-width: 1199px) {
          html.desktop {
              width:100vw;
              .mainContent {
                  width:100vw;
              }
              .mainContentFloat {
                  width: calc(100vw - 16px);
                  margin-left:8px;
                  margin-right:8px;
                  box-sizing: border-box;
              }
              #bodycontainer {
                  width: 100vw;
              }
              .siteHeader {
                  width: 100vw;
              }
              #rightCol:has(table#books) {
                  overflow-x: auto;
              }
          }
      }
      html.desktop div.siteHeader__topLine > div.siteHeader__contents > div.searchBox--navbar {
          width: 45vw !important
      }
  `;
}
if (new RegExp("^(?:https://www\\.goodreads\\.com/book/(?!add_to_books_widget/).*)\$").test(location.href)) {
  css += `
      div.rightContainer,
      div#controls,
      #premiumAdTop,
      span#rating_graph,
      div#choiceBadge,
      div#flashMessages,
      div#flashContainer,
      div#smartbanner {
          display: none;
      }
      html.desktop .mainContentContainer .mainContent,
      html.desktop .mainContentContainer .mainContent .mainContentFloat .leftContainer {
          width: 100% !important;
          box-sizing: border-box;
      }
      html.desktop .mainContentContainer .mainContent .mainContentFloat {
          width: 92%;
          box-sizing: border-box;
      }
      @media (max-width: 980px) {
          html.desktop #imagecol {
              position: absolute;
              left: 68%;
              box-sizing: border-box;
          }
          html.desktop #metacol {
              width: 67%;
              box-sizing: border-box;
          }
          html.mobile div.bookInfoGroup {
              width: calc(414px - 75px);
          }
      }
      @media (min-width: 981px) {
          html.desktop .content,
          html.desktop header {
              width: 960px;
              box-sizing: border-box;
          }
          html.desktop #imagecol {
              float: right;
              box-sizing: border-box;
          }
      }
  `;
}
if (location.href.startsWith("https://www.goodreads.com/series/")) {
  css += `
      :root {
          --desktop-font-size: 16px;  
          --wtr-button-width: 180px;
          --wtr-button-left-width: 110px;
          --wtr-button-height: 40px;
      }
      html.desktop {
          div.wtrModalContainer.wtrMenuToggleModal {
              padding-top: 11px !important;
              padding-bottom: 11px !important;
          }
          li.siteHeader__topLevelItem {
              padding-top: 12px;
          }
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
