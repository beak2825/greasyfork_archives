// ==UserScript==
// @name         Parallel Realities: Tutorial Readability
// @namespace    http://codesthings.com
// @version      1.3
// @description  Make the tutorials more readable
// @author       JamesCodesThings
// @license      MIT
// @match        *://*.parallelrealities.co.uk/tutorials/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parallelrealities.co.uk
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/448996/Parallel%20Realities%3A%20Tutorial%20Readability.user.js
// @updateURL https://update.greasyfork.org/scripts/448996/Parallel%20Realities%3A%20Tutorial%20Readability.meta.js
// ==/UserScript==


    const readableCss = `
    @font-face {
    font-family: 'DejaVu Sans';
    font-style: normal;
    font-weight: 400;
    src: local('DejaVu Sans'), url('https://fonts.cdnfonts.com/s/107/DejaVuSans.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans';
    font-style: italic;
    font-weight: 400;
    src: local('DejaVu Sans'), url('https://fonts.cdnfonts.com/s/107/DejaVuSans-Oblique.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans';
    font-style: normal;
    font-weight: 700;
    src: local('DejaVu Sans'), url('https://fonts.cdnfonts.com/s/107/DejaVuSans-Bold.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans';
    font-style: italic;
    font-weight: 700;
    src: local('DejaVu Sans'), url('https://fonts.cdnfonts.com/s/107/DejaVuSans-BoldOblique.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans Condensed';
    font-style: normal;
    font-weight: 400;
    src: local('DejaVu Sans Condensed'), url('https://fonts.cdnfonts.com/s/107/DejaVuSansCondensed.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans Condensed';
    font-style: italic;
    font-weight: 400;
    src: local('DejaVu Sans Condensed'), url('https://fonts.cdnfonts.com/s/107/DejaVuSansCondensed-Oblique.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans Condensed';
    font-style: normal;
    font-weight: 700;
    src: local('DejaVu Sans Condensed'), url('https://fonts.cdnfonts.com/s/107/DejaVuSansCondensed-Bold.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans Condensed';
    font-style: italic;
    font-weight: 700;
    src: local('DejaVu Sans Condensed'), url('https://fonts.cdnfonts.com/s/107/DejaVuSansCondensed-BoldOblique.woff') format('woff');
}


@font-face {
    font-family: 'DejaVu Sans Mono';
    font-style: normal;
    font-weight: 400;
    src: local('DejaVu Sans Mono'), url('https://fonts.cdnfonts.com/s/108/DejaVuSansMono.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans Mono';
    font-style: italic;
    font-weight: 400;
    src: local('DejaVu Sans Mono'), url('https://fonts.cdnfonts.com/s/108/DejaVuSansMono-Oblique.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans Mono';
    font-style: normal;
    font-weight: 700;
    src: local('DejaVu Sans Mono'), url('https://fonts.cdnfonts.com/s/108/DejaVuSansMono-Bold.woff') format('woff');
}
@font-face {
    font-family: 'DejaVu Sans Mono';
    font-style: italic;
    font-weight: 700;
    src: local('DejaVu Sans Mono'), url('https://fonts.cdnfonts.com/s/108/DejaVuSansMono-BoldOblique.woff') format('woff');
}

body, body.readable {
  background:none !important;
  background-image:none !important;
  background-color: #1a1a1a !important;
  font-family: 'DejaVu Sans', sans-serif;
  font-size: 14px;
}

.readable code.hljs {
  border: solid 1px #2e2e2e;
  font-family : 'DejaVu Sans Mono' , sans-serif ;
  font-size: 1rem;
}

.readable span.code {
  font-family : 'DejaVu Sans Mono' , sans-serif ;
}

.readable p.subSection {
  border-bottom: none;
font-size: 18px;
}

.readable a.backToTOC, iframe.itchio {
  display:none;
}`;

    document.body.className += 'readable';
    GM_addStyle(readableCss);
