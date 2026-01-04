// ==UserScript==
// @name        AO3 Fonts and Stat Icons
// @match       https://archiveofourown.org/*
// @grant       none
// @author      Yours Truly
// @description Adds my custom fonts as well as icons for stuff
// @license     MIT
// @namespace   ao3-fonts-and-icons
// @version     1.1.1
// @icon        https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Logo_Archive_of_Our_Own.svg/330px-Logo_Archive_of_Our_Own.svg.png
// @require     https://unpkg.com/lucide@latest
// @require     https://update.greasyfork.org/scripts/539241/AO3LucideIcons.js
// @downloadURL https://update.greasyfork.org/scripts/489920/AO3%20Fonts%20and%20Stat%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/489920/AO3%20Fonts%20and%20Stat%20Icons.meta.js
// ==/UserScript==

(function () {
  function loadFonts() {
    const fontsCSS = document.createElement("style");
    fontsCSS.innerHTML = `
      @import url('https://fonts.cdnfonts.com/css/noto-sans');
      @import url('https://fonts.cdnfonts.com/css/fjalla-one');
      @import url('https://fonts.cdnfonts.com/css/martian-mono');
    `;

    document.head.appendChild(fontsCSS);
  }

  loadFonts();
  IconifyAO3({
    iconifyStats: true,
    iconifyUserNav: false,
  });
})();