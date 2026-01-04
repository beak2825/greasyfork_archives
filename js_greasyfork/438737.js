// ==UserScript==
// @name         Dark Vanity
// @namespace    https://www.arxiv-vanity.com/
// @version      0.1
// @description  Dark theme for vanity
// @author       Sangjee Dondrub <sangjeedondrub@live.com>
// @match        https://www.arxiv-vanity.com/papers/*
// @resource     REMOTE_CSS https://cdn.jsdelivr.net/npm/@forevolve/bootstrap-dark@1.0.0/dist/css/bootstrap-dark.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @icon         data:image/ico;base64,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
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438737/Dark%20Vanity.user.js
// @updateURL https://update.greasyfork.org/scripts/438737/Dark%20Vanity.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var authors = document.querySelector('.ltx_authors')
    authors.innerHTML = authors.innerHTML.replace(/  /g, ', ')

    // Load remote CSS
    // vanity uses bootstrap
    // Black theme for Boostrap
    // @see https://github.com/Tampermonkey/tampermonkey/issues/835
    const myCss = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(myCss);

    // customized
    GM_addStyle ( `
    div.ltx_page_content, div.ltx_title_document, .ltx_bibitem{
     font-family: "Merriweather", "Open Sans", "Book Antiqua" ! important;
     font-size: large !important;
     background: black;
    }

    .ltx_personname {
      font-family: "Merriweather", "Open Sans", "Book Antiqua" !important;
      font-size: large !mportant;
      font-size: 0.8em !important;
    }
    p {
      text-align: justify !important;
    }
    p.ltx_align_center {
      text-align: center !important;
    }
    article.ltx_document {
      background: black !important;
      color: white !important;
    }

    cite {
       color: #7c7ec1 !important;
    }

    img {
      background: lightgray !important;
      max-width: 700px !important;
      height: auto !important;
      display: block !important;
      margin: auto !important;
    }

    figure.ltx_figure figcaption {
      display: block !important;
      max-width: 700px !important;
      margin:auto !important;
      text-align: justify !important;
      padding-top: 1em !important;
    }

    .ltx_border_tt, .ltx_border_t {
      border-top: 1px solid white !important;
    }

    .ltx_title, .ltx_title_section {
      margin-bottom: 1em !important;
      display: contents !important;
    }

    section.ltx_section {
      margin: 2em 0 !important;
    }

    .ltx_para, .ltx_abstract {
      width: 100% !important;
      margin-top: 0.5em !important;
     }

     .ltx_ERROR {
       display: none !important;
     }

     .ltx_authors {
        font-size: 1.0em !important;
     }

     .ltx_equation {
      position: relative !important;
     }

     .ltx_align_right {
       position: absolute !important;
       right: 10px !important;
     }

` );
})();