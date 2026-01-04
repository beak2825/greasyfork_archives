// ==UserScript==
// @name         9Anime Fullscreen Video + Widescreen format
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1.0
// @description  Automatically clicks the Skip Intro button on Crunchyroll.com when available and makes the video fullscreen
// @author       JRem
// @require      https://cdn.jsdelivr.net/gh/mlcheng/js-toast@ebd3c889a1abaad615712485ce864d92aab4c7c0/toast.min.js
// @match        https://9anime.vc/watch/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453449/9Anime%20Fullscreen%20Video%20%2B%20Widescreen%20format.user.js
// @updateURL https://update.greasyfork.org/scripts/453449/9Anime%20Fullscreen%20Video%20%2B%20Widescreen%20format.meta.js
// ==/UserScript==

// Toast Vars
const options = {
      settings: {
        duration: 3000,
      },
      style: {
        main: {
          background: "black",
          color: "white",
          width: "auto",
          'max-width': '10%',
        }
      }
};

const volopts = {
      settings: {
        duration: 500,
      },
      style: {
        main: {
          background: "black",
          color: "white",
          width: "auto",
          'max-width': '10%',
        }
      }
};

// Fullscreen Video Code
window.onload = function(){
    setTimeout(function () {
        var css = '.container {width: 98vw !important;max-width: 98vw !important;min-width: 98vw !important;margin: 0;padding: 0;}';
            css += '#wrapper,#site_menu,#logo,#search,.header-group,#header_right {margin: 0;padding: 0;}';
            css += '#watch-block .wb_-playerarea {min-width: 99vw !important;height: 95vh !important;padding-bottom: 0;}';
            css += '#header {display: flex;margin: 0;padding: 0;}';
            css += '.prebreadcrumb {display: none;}';
        GM_addStyle(css);
    }, 5000);
    iqwerty.toast.toast('Fullscreen added', options);
};

var css1 = '.container {width: 98vw !important;max-width: 98vw !important;min-width: 98vw !important;margin: 0;padding: 0;}';
    css1 += '#wrapper,#site_menu,#logo,#search,.header-group,#header_right {margin: 0;padding: 0;}';
    css1 += '#watch-block .wb_-playerarea {min-width: 99vw !important;height: 95vh !important;padding-bottom: 0;}';
    css1 += '#header {display: flex;margin: 0;padding: 0;}';
    css1 += '.prebreadcrumb {display: none;}';
GM_addStyle(css1);

