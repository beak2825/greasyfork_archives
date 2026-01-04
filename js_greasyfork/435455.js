// ==UserScript==
// @name         Clean Twitter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make Twitter Experience Even Better
// @author       Cactus
// @match        https://twitter.com/home
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435455/Clean%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/435455/Clean%20Twitter.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

(function () {
  'use strict';
  var css = `
  /* Remove Logo */
  [aria-label="Twitter"] {
    display: none;
  }


  /*
  * LEFT COLUMN
  */

  /* Remove nav I don't use */
  /* [aria-label="Search and explore"],
  [aria-label="Bookmarks"],
  [aria-label="Lists"]
  {
    display: none;
  } */


  [aria-label="Lists"],
  [aria-label="Search and explore"]
  /*[aria-label="Notifications"]*/

   {display: none;}


  /* Less visual weight for nav options */
  [aria-label="Primary"] [dir="auto"] {
    font-size: 1rem;
    font-weight: 400;
  }

  /* Tigher grouping */
  [aria-label="Primary"] a {
    padding: 0;
  }

  /* Hide distracting profile toggle */

  /*
  [data-testid="SideNav_AccountSwitcher_Button"] {
    display: none;
  }
  */

  /*
  * TWEET BUTTON
  */

  /* Make button flatter, less loud */
  [aria-label="Tweet"] {
    border: none;
    box-shadow: none;
    background-color: #7856FF;
  }

  /* Style to look like other UI */
  [aria-label="Tweet"] div {
    color: #f4f8fa;
  }

  [aria-label="Tweet"]:hover {
    filter: none;
  }

  [aria-label="Tweet"]:hover {
    background-color: #f4f8fa;
  }

  [aria-label="Tweet"]:hover div {
    color: #7856FF;
  }




  /*
  * RIGHT COLUMN
  */

  /* See ya later, racism aggregator */
  [aria-label="Timeline: Trending now"] {
    display: none;
  }

  /* Less visual weight for who to follow */
  [aria-label="Who to follow"] [aria-level="2"][role="heading"] .r-1qd0xha {
    font-size: 1rem;
  }

  /* Tone down unfollow */
  [data-testid="16515870-unfollow"] {
    filter: grayscale(1);
    opacity: 0.5;
  }

  /* Remove the background color from Who to Follow */
  [data-testid="sidebarColumn"] .r-1u4rsef {
    background-color: transparent !important;
  }


  /*
  * DM DRAWER
  */

  [data-testid="DMDrawer"] {
    display: none;
  }

  nav.css-1dbjc4n.r-18u37iz.r-1w6e6rj.r-ymttw5 {
    display: none;

  }

  /* Hide browser scrollbar */
  ::-webkit-scrollbar {
      display:none;

  }

  div.css-1dbjc4n.r-1wtj0ep.r-ymttw5.r-1f1sjgu {
    display: none;

  }



  div.css-1dbjc4n.r-1uaug3w.r-1uhd6vh.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1bro5k0.r-1udh08x {
    display: none;
  }

  div.css-1dbjc4n.r-1uaug3w.r-1uhd6vh.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x {
    display: none;
  }

  div.css-1dbjc4n.r-yfoy6g.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-1ifxtd0.r-1udh08x {
    display: none;

  }

  div.css-1dbjc4n.r-1awozwy.r-aqfbo4.r-yfoy6g.r-18u37iz.r-1h3ijdo.r-6gpygo.r-15ysp7h.r-1xcajam.r-ipm5af.r-1hycxz.r-136ojw6 {
    padding-top: 110px;
  }

  div.css-1dbjc4n.r-1awozwy.r-1m3jxhj.r-xnswec.r-18u37iz.r-1d7fvdj.r-d9fdf6.r-tvv088.r-13qz1uu {
    display: none;

  }
`;
  addGlobalStyle(css);
})();