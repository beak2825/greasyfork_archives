// ==UserScript==
// @name Add to Goodreads widget styling
// @namespace github.com/holyspiritomb
// @version 1.0.1
// @description Colors to match the DarkReader Tokyo Night scheme I use on Amazon.
// @author holyspiritomb
// @homepageURL https://github.com/holyspiritomb/userstyles/blob/main/goodreads/add-to-gr-widget.user.css
// @grant GM_addStyle
// @run-at document-start
// @match https://www.goodreads.com/book/add_to_books_widget/*
// @downloadURL https://update.greasyfork.org/scripts/456250/Add%20to%20Goodreads%20widget%20styling.user.js
// @updateURL https://update.greasyfork.org/scripts/456250/Add%20to%20Goodreads%20widget%20styling.meta.js
// ==/UserScript==

(function() {
let css = `

    @font-face {
        font-family: 'Amazon Ember';
        font-weight: 200;
        src: url('https://m.media-amazon.com/images/S/sash/Dv1WQ5DdeMS5qP7.woff2') format('woff2'), url('https://m.media-amazon.com/images/S/sash/e0LnMbFWJC-TMQz.woff') format('woff');
    }

    @font-face {
        font-family: 'Amazon Ember';
        font-weight: 200;
        font-style: italic;
        src: url('https://m.media-amazon.com/images/S/sash/ozb5-CLHQWI6Soc.woff2') format('woff2'), url('https://m.media-amazon.com/images/S/sash/twzZHebXjCHBb6v.woff') format('woff');
    }

    @font-face {
        font-family: 'Amazon Ember';
        src: url('https://m.media-amazon.com/images/S/sash/pDxWAF1pBB0dzGB.woff2') format('woff2'), url('https://m.media-amazon.com/images/S/sash/kfKKBuoqcD$AUKL.woff') format('woff');
    }

    @font-face {
        font-family: 'Amazon Ember';
        font-style: italic;
        src: url('https://m.media-amazon.com/images/S/sash/WOnTLzkiaEccV7F.woff2') format('woff2'), url('https://m.media-amazon.com/images/S/sash/JJsp0ZvgpfwzJM6.woff') format('woff');
    }

    @font-face {
        font-family: 'Amazon Ember';
        font-weight: 500;
        src: url('https://m.media-amazon.com/images/S/sash/VjTR4RqBzY0mUYx.woff2') format('woff2'), url('https://m.media-amazon.com/images/S/sash/XIvhNCZAsrT80Wz.woff') format('woff');
    }

    @font-face {
        font-family: 'Amazon Ember';
        font-weight: 500;
        font-style: italic;
        src: url('https://m.media-amazon.com/images/S/sash/KwhNPG8Jz-Vz2X7.woff2') format('woff2'), url('https://m.media-amazon.com/images/S/sash/YAEPfuhs1l-argd.woff') format('woff');
    }

    @font-face {
        font-family: 'Amazon Ember';
        font-weight: 700;
        src: url('https://m.media-amazon.com/images/S/sash/KFPk-9IF4FqAqY-.woff2') format('woff2'), url('https://m.media-amazon.com/images/S/sash/mzVbGSgvdBfRLX9.woff') format('woff');
    }

    @font-face {
        font-family: 'Amazon Ember';
        font-style: italic;
        font-weight: 700;
        src: url('https://m.media-amazon.com/images/S/sash/2SazJx$EeTHfhMN.woff2') format('woff2'), url('https://m.media-amazon.com/images/S/sash/CjbL$jCCegyfqZ7.woff') format('woff');
    }

    :root {
        --darkreader-neutral-background: #15161e;
        --darkreader-neutral-text: #86a2c6;
        --darkreader-selection-background: #ffaaff;
        --darkreader-selection-text: #000;
    }

    body,
    .shelfDropdownNew,
    .shelfInDropdown {
        background-color: #1a1b26;
        color: rgb(160, 169, 210);
        border: 0;
    }

    div.shelfInDropdown:hover {
        background-color: #262737;
    }

    a,
    a:link,
    a:visited {
        color: rgb(75, 228, 255);
    }

    body,
    p,
    ol,
    ul,
    td,
    th,
    a {
        font-family: 'Amazon Ember', Arial, sans-serif;
    }

    input {
        accent-color: rgb(75, 228, 255);
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
