// ==UserScript==
// @name           Fix arabic font
// @version        1.1
// @description    Script that fixes arabic language 
// @match          *://*/*
// @namespace https://greasyfork.org/users/1336272
// @downloadURL https://update.greasyfork.org/scripts/501115/Fix%20arabic%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/501115/Fix%20arabic%20font.meta.js
// ==/UserScript==

(function () {
  function logger(text) {
    console.log(`Arabic : ${text}`);
  }

  function addStyle(styleString) {
    const style = document.createElement("style");
    style.textContent = styleString;
    document.head.append(style);
  }

  function addFont(fontName) {
    // search if font is already added
    const fonts = document.querySelectorAll("style");
    for (const font of fonts) {
      if (font.textContent?.includes(fontName)) {
        return;
      }
    }

    logger(`addFont: ${fontName}`);
    addStyle(`
            @import url('https://fonts.googleapis.com/css2?family=${fontName
              .split(" ")
              .join("+")}&display=swap');
              p {
                  overflow:hidden;
              }
              * {
                  font-family: ${fontName}, sans-serif !important;
              }
              `);
  }
  function fixDir() {
    logger(`fixing dir`);

    // fix direction in css
    addStyle(`
          p ,h1 {
            unicode-bidi: plaintext;
            text-align: start;
          }`);
  }

  function fixArabic() {
    addFont("Noto Sans Arabic");
    fixDir();
  }

  fixArabic();
})();