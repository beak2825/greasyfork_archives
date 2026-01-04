/* ==UserStyle==
@name         Wigle.net Dark Mode
@version      20240926.22.60
@namespace    wigle.net
@description  Dark Mode for Wigle.net
@author       Nick2bad4u
@license      The UnLicense
@downloadURL https://update.greasyfork.org/scripts/513432/Wiglenet%20Dark%20Mode.user.css
@updateURL https://update.greasyfork.org/scripts/513432/Wiglenet%20Dark%20Mode.meta.css
==/UserStyle== */
@-moz-document domain("wigle.net") {
  :root {
    filter: invert(1);
    /*            background-color: black; */
  }
  img:not(.mwe-math-fallback-image-display):not(.mwe-math-fallback-image-inline):not(
      img[alt='GPS']
    ):not(img[alt='Cell']):not(img[alt='WiFi']):not(img[alt='BT']) {
    filter: invert(1);
  }
  .mw-logo {
    filter: invert(100%);
  }
}
