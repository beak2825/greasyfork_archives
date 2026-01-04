"use strict";

// ==UserScript==
// @name         Advaita List Word Wrap
// @namespace    http://tampermonkey.net/
// @import url('https://fonts.googleapis.com/css2?family=Lexend+Deca&family=Noto+Serif&display=swap');
// @version      0.3
// @license     MIT; https://openuserjs.org/users/mahadevaniyer
// @description  In Advaita List website, Some posts require horizontal scroll because of lack of line breaks. This script fixes that by giving Word Wrap & some font enhancements.
// @author       Mahadevan Iyer
// @match        https://www.advaita-vedanta.org/archives/advaita-l/*
// @match        https://lists.advaita-vedanta.org/archives/advaita-l/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406521/Advaita%20List%20Word%20Wrap.user.js
// @updateURL https://update.greasyfork.org/scripts/406521/Advaita%20List%20Word%20Wrap.meta.js
// ==/UserScript==

let styleSheet = `
/* Changes body font to Lexend Deca */
body {
font-family: "Lexend Deca",sans-serif !important;
}

body H1 {
font-family: "Noto Serif",sans-serif !important;
}

body {
  color: #222;
  background: #fff;
}

body.dark-theme {
  color: #eee;
  background: #1f1f1f;
}

a {
  color: #0033cc;
}

body.dark-theme a {
  color: #52a1fd;
}

/* gives wrap to pre tag, also changes font to Lexend Deca */

pre {
            overflow-x: auto;
            white-space: pre-wrap;
            white-space: -moz-pre-wrap;
            white-space: -pre-wrap;
            white-space: -o-pre-wrap;
            word-wrap: break-word;
            font-family: 'Lexend Deca';
            font-stretch: expanded;
         }

/* Google Search Style */
#googlesearch {
  position: relative;
  padding-top: 15px;
  width: 50%;
}

/* gives fluidity to text and increase font size */
html {
  font-size: 16px;
}
@media screen and (min-width: 320px) {
  html {
    font-size: calc(16px + 6 * ((100vw - 320px) / 680));
  }
}
@media screen and (min-width: 1000px) {
  html {
    font-size: 22px;
  }
}

.btn-toggle {
  align-items: normal;
  background-color: rgba(0,0,0,0);
  border-color: rgb(0, 0, 238);
  border-style: none;
  box-sizing: content-box;
  color: rgb(0, 0, 238);
  cursor: pointer;
  display: inline;
  font: inherit;
  height: auto;
  padding: 5;
  perspective-origin: 0 0;
  text-align: start;
  text-decoration: underline;
  transform-origin: 0 0;
  width: auto;
  -moz-appearance: none;
  -webkit-logical-height: 1em; /* Chrome ignores auto, so we have to use this hack to set the correct height  */
  -webkit-logical-width: auto; /* Chrome ignores auto, but here for completeness */
}

`;
(function() {
    /* Import Lexand Deca Font from Google Fonts */
    let lexfont = document.createElement('link');
    lexfont.rel = 'stylesheet';
    lexfont.href = 'https://fonts.googleapis.com/css2?family=Lexend+Deca&family=Noto+Serif&display=swap';
    document.head.appendChild(lexfont);

    /* Custom Google Search Code */
    let gsearch = document.createElement('script');
    gsearch.id = 'googlesearch';
    gsearch.type = 'text/javascript';
    gsearch.src = 'https://cse.google.com/cse.js?cx=006692653450856610993:ftezolpnggu';
    document.head.appendChild(gsearch);

    /* Creates Style Sheet where all styles are defined */
    let s = document.createElement('style');
    s.type = "text/css";
    s.innerHTML = styleSheet;
    (document.head || document.documentElement).appendChild(s);


    /* Google Search Div Tag, placed after first Heading */
    let div = document.createElement('div');
    div.setAttribute('class', 'gcse-searchbox-only');
    div.setAttribute('id', 'googlesearch');
    document.getElementsByTagName("h1")[0].appendChild(div);

    /* Dark Mode */
    /* Create a Button */
    var btn2 = document.createElement('BUTTON');
    btn2.innerHTML = ' 👓[ Dark Mode ] ';
    btn2.classList.add('btn-toggle')
    document.body.appendChild(btn2);
    /* give body A class name */
    //document.getElementsByTagName('body')[0].className = 'dark-theme || light-theme';
    /* js for button toggle */
    const btn = document.querySelector(".btn-toggle");
    btn.addEventListener("click", function() {
        document.body.classList.toggle("dark-theme");
    });

    /* pdf */
    var pdfsave = document.createElement('a');
    var link = document.createTextNode(" 📃 [ Save to PDF ] ");
    pdfsave.appendChild(link);
    pdfsave.href = "https://www.sejda.com/html-to-pdf?save-link";
    document.body.appendChild(pdfsave);


})();