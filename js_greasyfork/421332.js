// ==UserScript==
//
// @name         Darkmode User
// @version      2.3
// @namespace    https://github.com/Purfview/Darkmode-User
// @description  Darkmode for the websites.
// @icon         https://i.imgur.com/ZftAaI6.png
// @license      MIT
//
// @homepage     https://github.com/Purfview/Darkmode-User
// @supportURL   https://github.com/Purfview/Darkmode-User/issues
//
// @require      https://cdn.jsdelivr.net/npm/darkmode-js@1.5.7/lib/darkmode-js.min.js
// @require      https://greasyfork.org/scripts/403996-exev/code/ExEv.js?version=808391
//
// @include      https://karagarga.in/*
// @include      https://secret-cinema.pw/*
// @include      https://forum.doom9.org/*
//
// @run-at       document-start
// @noframes
//
// @downloadURL https://update.greasyfork.org/scripts/421332/Darkmode%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/421332/Darkmode%20User.meta.js
// ==/UserScript==
//
/*=========================  Version History  ==================================

1.0   -   First public release, only one site added.

1.1   -   Added SC site.
      -   Added basic func for the "unknown" sites at @include.
      -   Sites' specific code was split to separate functions.
      -   Much faster switching to darkmode (no waiting for external images/resources).
      -   Return original background in white mode.

1.2   -   Fixed few SC icons.

1.3   -   Added Doom9 site.

1.4   -   Added Greasyfork site. Some tweaks for SC and Doom9.

1.5   -   Script wasn't working with Tampermonkey from v1.1. Fixed!

1.6   -   Added Tik site.

1.7   -   New feature: Seamless transitions to darkmode.

1.7.1 -   Less contrast on the toggle button.

1.7.2 -   Fixed KG.

1.7.3 -   Fixed menus on SC and Greasyfork.

1.7.4 -   KG tweaks.

1.7.5 -   KG tweaks.

1.7.6 -   SC tweak.

1.8.0 -   Removed Tik.
          Possible fix for "sometimes script not loadding".

1.8.1 -   Improved "1.8.0" fix

1.8.2 -   doom9 tweak.

2.0   -   Implemented fallback to check if Darkmode.js is loaded. (sometimes it fails on 'bodyloaded' event)
          Removed cinematik from @include
          Removed greasyfork (they implemented own darkmode)

2.1   -   Added 100ms delay to fallback func

2.2   -   Increased delay to 300ms

2.3   -   Reverted 2.1 & 2.2
          Added check if Darkmode.js is loaded to addDarkmodeWidget func. (problem was that sometimes 'bodyloaded' is triggered after 'DOMContentLoaded')

==============================================================================*/


//==============================================================================
//    Sites' specific funcs.
//==============================================================================

function siteKG() {
  const urlPath = window.location.pathname;
  if (urlPath == '/browse.php'     ||
      urlPath == '/current.php'    ||
      urlPath == '/history.php'    ||
      urlPath == '/friends.php'    ||
      urlPath == '/bookmarks.php'  ||
      urlPath == '/reqdetails.php' ||
      urlPath == '/mytorrents.php'  ) {
    addGlobalStyles('img {mix-blend-mode: screen}');
    addGlobalStyles('a div img {mix-blend-mode: normal}');
    addGlobalStyles('table .clear {isolation: isolate}');
    addGlobalStyles('table[cellpadding="10"][bgcolor="red"] {mix-blend-mode: difference}');
    addGlobalStyles('table[width="660"][cellpadding="10"] tbody tr[style="background-color: #008000; color: #fff;"] {mix-blend-mode: difference}');
    addGlobalStyles('body>table>tbody>tr>td.outer>span {mix-blend-mode: difference}');
    addGlobalStyles('body>table>tbody>tr>td.embedded {mix-blend-mode: screen}');
  } else if (urlPath == '/userdetails.php') {
    addGlobalStyles('table[width="660"][cellpadding="10"] tbody tr[style="background-color: #008000; color: #fff;"] {mix-blend-mode: difference}');
    addGlobalStyles('body>table>tbody>tr>td.outer>span {mix-blend-mode: difference}');
    addGlobalStyles('body>table>tbody>tr>td.embedded {mix-blend-mode: screen}');
  } else {
    addGlobalStyles('table[cellpadding="10"][bgcolor="red"] {mix-blend-mode: difference}');
    addGlobalStyles('table[width="660"][cellpadding="10"] tbody tr[style="background-color: #008000; color: #fff;"] {mix-blend-mode: difference}');
    addGlobalStyles('body>table>tbody>tr>td.outer>span {mix-blend-mode: difference}');
    addGlobalStyles('body>table>tbody>tr>td.embedded {mix-blend-mode: screen}');
    addGlobalStyles('div[style="width: 75%; background-color: #f9f; padding: 5px; margin: 5px; color: #000;"] {mix-blend-mode: difference}');
  }
}

function siteSC() {
  addGlobalStyles('img {mix-blend-mode: screen}');
  addGlobalStyles('#header {background: white}');
  addGlobalStyles('.colhead_dark {mix-blend-mode: difference}');
  addGlobalStyles('.fronttab {mix-blend-mode: exclusion}');
  addGlobalStyles('.colhead {mix-blend-mode: difference}');
  addGlobalStyles('.settings_sidebar {isolation: isolate}');
  addGlobalStyles('#textarea_wrap_0 {isolation: isolate}');
  addGlobalStyles('.widethin .header .topbar {mix-blend-mode: difference}');
  addGlobalStyles('.torrent_description table tbody tr {mix-blend-mode: difference}');
  addGlobalStyles('#covers #cover_div_0 .brackets {mix-blend-mode: normal}');
  addGlobalStyles('.wrapicon {mix-blend-mode: normal}');
  addGlobalStyles('.potwicon {mix-blend-mode: normal}');
  addGlobalStyles('iframe {mix-blend-mode: screen}');
  addGlobalStyles('.noty_buttons {mix-blend-mode: difference}');
  addGlobalStyles('.torrentdetails blockquote {background-color: white}');
  addGlobalStyles('label.collage_button {background: grey}');
}

function siteDoom9() {
  addGlobalStyles('img {mix-blend-mode: screen}');
  addGlobalStyles('#vB_Editor_QR_cmd_removeformat img, \
                   #vB_Editor_QR_cmd_bold img, \
                   #vB_Editor_QR_cmd_italic img, \
                   #vB_Editor_QR_cmd_underline img, \
                   #vB_Editor_QR_color_out img \
                   {mix-blend-mode: normal}');
  addGlobalStyles('#vB_Editor_001_controls img {mix-blend-mode: normal}');
  addGlobalStyles('#vB_Editor_001_popup_smilie img, \
                   #vB_Editor_001_cmd_createlink img, \
                   #vB_Editor_001_cmd_unlink img, \
                   #vB_Editor_001_cmd_email img, \
                   #vB_Editor_001_cmd_insertimage img, \
                   #vB_Editor_001_cmd_wrap0_quote img, \
                   #vB_Editor_001_cmd_wrap0_php img \
                   {mix-blend-mode: screen}');
}

function siteUnknown() {
  addGlobalStyles('img {mix-blend-mode: screen}');
}

//==============================================================================
//   Toggle/Add/Remove funcs.
//==============================================================================

function addGlobalStyles(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.className = 'DarkmodeUser';
  style.innerHTML = css;
  head.appendChild(style);
}

function removeGlobalStyles() {
  var removeEl = [].slice.apply(document.getElementsByClassName("DarkmodeUser"));
  for (var i = 0; i < removeEl.length; i++) {
    removeEl[i].remove();
  }
}

function toggleGlobalStyles() {
  var modestate = window.localStorage['darkmode'];
  if (modestate == "true") {
    addBackground();
    const urlHost = window.location.hostname;
    if (urlHost == 'karagarga.in') {
      siteKG();
    } else if (urlHost == 'secret-cinema.pw') {
      siteSC();
    } else if (urlHost == 'forum.doom9.org') {
      siteDoom9();
    } else {
      siteUnknown();
    }
  } else {
    removeGlobalStyles();
    removeBackground();
  }
}

function removeBackground() {
  console.log("Darkmode User (removeBackground): Started.");
  document.getElementsByClassName('darkmode-background')[0].remove();
}

function addBackground() {
  console.log("Darkmode User (addBackground): Started.");
  if (document.querySelector('.darkmode-background') !== null) { return; }
  var backgroundDiv = document.createElement('div');
  backgroundDiv.setAttribute('class', 'darkmode-background');
  document.body.insertBefore(backgroundDiv, document.body.firstChild);
}

//==============================================================================
//    Fallback
//==============================================================================

function fallbackFunc() {
  if (document.querySelector('.darkmode-layer--button')) {
    return;
  } else {
      console.log("Darkmode User (fallbackFunc): Triggered.");
      addDarkmodeWidget();
  }
}

//==============================================================================
//    Darkmode.js
//==============================================================================

function addDarkmodeWidget() {
  if (document.querySelector('.darkmode-layer--button')) {
    return;
  } else {
      console.log("Darkmode User (addDarkmodeWidget): Started.");
      const options = {
        bottom: '32px',
        right: '32px',
        left: 'unset',
        time: '0.0s',
        mixColor: '#fff',
        backgroundColor: '#fff',
        buttonColorDark: '#333333',
        buttonColorLight: '#b3b3b3',
        saveInCookies: true,
        label: '',
        autoMatchOsTheme: false
      };
      new Darkmode(options).showWidget();
      // Add func to the widged button to toggle styles on click.
      document.getElementsByClassName('darkmode-toggle')[0].onclick = function () {toggleGlobalStyles()};
      // Add styles on the page load.
      const darkmode = window.localStorage['darkmode'];
      if (darkmode == "true") {
        toggleGlobalStyles();
      } else {
        // Remove custom white background.
        removeBackground();
      }
  }
}

//============================================================================//
//================================  MAIN  ====================================//
//============================================================================//


document.events.on('bodyloaded', () => {
  console.log("Darkmode User (bodyloaded): Triggered.");
  addDarkmodeWidget();
});

// Fallback
window.addEventListener('DOMContentLoaded', fallbackFunc);
