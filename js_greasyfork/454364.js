// ==UserScript==
// @name Goodreads personal modifications
// @namespace github.com/holyspiritomb
// @version 1.22.12-14.0
// @description Making goodreads look nicer for me on my phone
// @author holyspiritomb
// @homepageURL https://github.com/holyspiritomb/userstyles/blob/main/goodreads/main.user.css
// @grant GM_addStyle
// @run-at document-start
// @match https://www.goodreads.com/review/list/*
// @include /^(?:https://www\.goodreads\.com/(?!book/add_to_books_widget/).*)$/
// @include /^(?:https://www\.goodreads\.com/book/(?!add_to_books_widget/).*)$/
// @downloadURL https://update.greasyfork.org/scripts/454364/Goodreads%20personal%20modifications.user.js
// @updateURL https://update.greasyfork.org/scripts/454364/Goodreads%20personal%20modifications.meta.js
// ==/UserScript==

(function() {
let css = "";
if (new RegExp("^(?:https://www\\.goodreads\\.com/(?!book/add_to_books_widget/).*)\$").test(location.href)) {
  css += `
      :root {
          --mobile-font-size: 12pt;
          --desktop-font-size: 18pt;
          --default-font: 'Lato', sans-serif;
      }
      @media (min-width: 981px) {
          div.content {
              box-sizing: border-box;
              margin: auto;
          }
      }
      @media (min-width: 1200px) {
          main.PageFrame__main.BookPage {
              max-width: 90vw;
          }
      }
      main.PageFrame__main.BookPage,
      div.pageContent {
          background-color: rgba(0, 0, 0, 50%) !important;
          backdrop-filter: blur(2px);
          border-radius: 5px;
          box-sizing: border-box;
      }
      div.mainContentFloat {
          background-color: rgba(0, 0, 0, 50%) !important;
          backdrop-filter: blur(2px);
          box-sizing: border-box;
      }
      html.mobile[style],
      html.mobile div.siteHeader,
      html.withAppInstallationBanner .siteHeader {
          top: 0 !important;
          margin-top: 0 !important;
      }
      html.mobile,
      html.mobile body {
          font-size: var(--mobile-font-size);
          line-height: calc(1.5*var(--mobile-font-size));
      }
      html.desktop,
      html.desktop body {
          font-size: var(--desktop-font-size);
          line-height: calc(1.5*var(--desktop-font-size));
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
      .gr-h1--serif,
      .gr-h2--serif,
      .gr-h3--serif,
      .gr-h4--serif,
      .gr-h5--serif,
      span.ContributorLink__name[data-testid='name'],
      .editionsPage :is(.pageTitle,.publishedDate),
      .editionBox__desc__bookTitle,
      .readable,
      .readable :is(p, ol, ul, td, th),
      .Text__h1,
      .Text__h2,
      .Text__h3,
      .Text__h4,
      .Text__h5,
      .Text__h6,
      .Text__title1,
      .Text__title2,
      .Text__title2-static,
      .Text__title3,
      .Text__title4,
      .RatingStatistics__rating {
          font-family: var(--default-font) !important;
      }
      h2.brownBackground,
      h2.brownBackground a {
          font-size: var(--desktop-font-size) !important;
          font-family: var(--default-font) !important;
      }
      html.mobile h2.brownBackground,
      html.mobile h2.brownBackground a {
          font-size: var(--mobile-font-size) !important;
          font-family: var(--default-font) !important;
      }
      #bookTitle {
          font-size: 3em;
      }
      h1.bookTitle,
      h1.bookTitle cite,
      cite.bookTitle {
          font-size: 1.75em;
      }
  `;
}
if (location.href.startsWith("https://www.goodreads.com/review/list/")) {
  css += `
      /* my booklists */
      html.desktop table#books {
          width: 100% !important;
          box-sizing: border-box;
      }
      div#rightCol,
      #leadercol {
          width: 100% !important;
      }

      /* to make the page stay a certain width on my phone */
      form#perPageForm,
      form#sortForm,
      div#reviewPagination {
          display: block;
      }
      div#leftCol,
      .myBooksNav ul li:nth-child(3),
      .myBooksNav ul li:nth-child(4),
      .myBooksNav ul li:nth-child(5) {
          display: none;
      }
  `;
}
if (new RegExp("^(?:https://www\\.goodreads\\.com/book/(?!add_to_books_widget/).*)\$").test(location.href)) {
  css += `
      /* single book page */
      #premiumAdTop,
      span#rating_graph,
      div#choiceBadge,
      div#flashContainer,
      div#smartbanner,
      div.siteHeader__topFullImageContainer,
      div#flashMessages {
          display: none !important;
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
