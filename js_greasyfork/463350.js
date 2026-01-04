// ==UserScript==
// @name			1_TiderInsider-mobile
// @description			Better fit on mobile devices
// @match			*://*.tiderinsider.com/*
// @match			https://www.tiderinsider.com/*
// @grant			GM_addStyle
// @namespace			https://greasyfork.org/en/scripts/463350-1_tiderinsider-mobile
// @author			sports_wook
// @version			2025.09.04
// @downloadURL https://update.greasyfork.org/scripts/463350/1_TiderInsider-mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/463350/1_TiderInsider-mobile.meta.js
// ==/UserScript==


GM_addStyle (`

#top-addiv {
  position: unset !important;
  background-color: transparent !important;
  overflow: hidden;
  display: none !important;
  width: 0px !important;
  height: 0px !important;
}

adcode, [id^="google_ads_iframe"] {
    display: none !important;
    width: 0px !important;
    height: 0px !important;
}

:root {
    --black: #000000;
    --crimson: #7E0000 !important;
    --red-text: #CE2C3A;
    --red-background: #7E0000;
    --grey: #808080;
    --grey-dark: #5f5f5f;
    --grey-text: #bdbdbd;
    --grey-secondary: #a9a9a9;
    --white: #FFFFFF;
    --white-light: #EEEEEE;
}

#logotop {
  background-color: var(--red-background) !important;
}

body, #pagebody, #actionbar, #pagefooter {
    font-size-adjust: 0.6 !important;
}

a.subjectMain {
    color: var(--red-text) !important;
    font-weight: bold !important;
#    text-decoration: underline !important;
    font-style: normal !important;
    font-size-adjust: 0.65 !important;
}

a.msgAuthor {
    color: var(--grey-secondary) !important;
    font-weight: bold !important;
    font-style: italic !important;
}

ul.nested span.msgHeaderThd a.subjectReply {
    font-style: normal !important;
    font-weight: normal !important;
    color: var(--black);
}

li.msgHeaderMain, li.msgHeaderReply {
    font-style: normal !important;
}

span#pgNavCurrentTop {
    padding-left: 0.5rem !important;
    padding-right: 0.5rem !important;
}

li.msgHeaderMain, li.msgHeaderReply {
    color: var(--grey) !important;
    font-style: normal !important;
}

#navbar li.navheader {
    color: var(--red-text) !important;
}

#navbar li a:hover {
  background-color: var(--red-background) !important;
}

.article p, .article li {
    line-height: 1.65 !important;
}

.article h1 {
  color: var(--red-text) !important;
}

#actionbar select:hover, #actionbar button:hover, form button:hover, form select:hover {
  color: var(--white) !important;
  background-color: var(--red-background) !important;
}



@media (prefers-color-scheme: light) {

  body, #pagebody, #actionbar, #pagefooter, #navbar, #navbar li {
    background-color: var(--white) !important;
  }

  #homepage, #pagebody {
      color: var(--black) !important;
  }

  li.msgHeaderMain > span.msgHeaderThd, li.msgHeaderReply > span.msgHeaderThd, span.msgHeaderThd {
      color: var(--grey-dark) !important;
      font-style: italic !important;
  }

  ul.nested span.msgHeaderThd a.subjectReply {
      color: var(--black);
  }

  span#pgNavCurrentTop {
      background-color: var(--red-background) !important;
      color: var(--white) !important;
  }

  .msg__li::before {
      color: var(--red-text) !important;
  }

  .msg-lead-post::before {
      color: var(--grey) !important;
  }

  a.msgAuthor {
      color: var(--grey) !important;
  }

  .msgBody {
      color: var(--black) !important;
  }

  a.subjectReply {
      --darkreader-text-0040ff: var(--black) !important;
      color: var(--darkreader-text-0040ff) !important;
  }

  #navbar li {
      border-top-color: #dfdfdf !important;
      border-right-color: #dfdfdf !important;
      border-bottom-color: #dfdfdf !important;
      border-left-color: #dfdfdf !important;
  }

  #navbar li.navheader {
      background-color: var(--white) !important;
      color: var(--red-text) !important;
      border-color: var(--red-text);
      border-top: 0.2rem solid !important;
      border-bottom: 0.2rem solid !important;
  }

  #navbar li a {
      color: var(--black) !important;
  }

  #navbar li a:hover {
      color: var(--white) !important;
  }

}



@media (prefers-color-scheme: dark) {

  body, #pagebody, #actionbar, #pagefooter, #navbar, #navbar li {
      background-color: var(--black) !important;
  }

  #homepage, #pagebody {
      color: var(--white-light) !important;
  }

  #contentcenter .homepage a:visited, .article a:visited {
      color: var(--red-text) !important;
  }

  li.msgHeaderMain > span.msgHeaderThd, li.msgHeaderReply > span.msgHeaderThd, span.msgHeaderThd {
      color: var(--grey) !important;
      font-style: italic !important;
  }

  ul.nested span.msgHeaderThd a.subjectReply {
      color: var(--white-light);
  }

  .mbPageNavbar a:hover {
      background-color: var(--red-background) !important;
  }

  span#pgNavCurrentTop {
      background-color: var(--red-background) !important;
      color: var(--white) !important;
  }

  a.msgAuthor {
      color: var(--grey-secondary) !important;
  }

  .msgBody {
      color: var(--white-light) !important;
  }

  a.subjectReply {
      --darkreader-text-0040ff: var(--white-light) !important;
      color: var(--darkreader-text-0040ff) !important;
  }

  .msg__li::before {
      color: var(--red-text) !important;
  }

  .msg-lead-post::before {
      color: var(--grey-secondary) !important;
  }

  #pageheadertopic p, #pageheadertitle p, #pageheadersubtitle p {
      color: var(--white-light) !important;
  }

  button, select, .mbPageNavbar div {
      background-color: #687476 !important;
  }

  #navbar li {
      border-top-color: #1c2225 !important;
      border-right-color: #1c2225 !important;
      border-bottom-color: #1c2225 !important;
      border-left-color: #1c2225 !important;
  }

  #navbar li.navheader {
      color: var(--red-text) !important;
      border-color: var(--red-text);
      border-top: 0.2rem solid !important;
      border-bottom: 0.2rem solid !important;
  }

  * {
      scrollbar-color: #687476  var(--black) !important;
  }

  table.roster tr.subheader {
      background-color: var(--black) !important;
      color: var(--white) !important;
  }

  table.roster tr.odd, table.roster tr.even {
      color: black !important;
  }

  table.roster tr.header {
      background-color: var( --red-background) !important;
  }

}

`);