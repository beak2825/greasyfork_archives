// ==UserScript==
// @name        Wanikani Golden Burn
// @namespace   rfindley
// @description Turn burned items to gold.
// @version     1.2.2
// @match       https://community.wanikani.com/*
// @match       https://www.wanikani.com/
// @match       https://www.wanikani.com/dashboard
// @match       https://www.wanikani.com/level/*
// @match       https://www.wanikani.com/radicals*
// @match       https://www.wanikani.com/kanji*
// @match       https://www.wanikani.com/vocabulary*
// @match       https://preview.wanikani.com/
// @match       https://preview.wanikani.com/dashboard
// @match       https://preview.wanikani.com/level/*
// @match       https://preview.wanikani.com/radicals*
// @match       https://preview.wanikani.com/kanji*
// @match       https://preview.wanikani.com/vocabulary*
// @copyright   2022+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15781/Wanikani%20Golden%20Burn.user.js
// @updateURL https://update.greasyfork.org/scripts/15781/Wanikani%20Golden%20Burn.meta.js
// ==/UserScript==

window.wkgoldburn = {};

(function(gobj) {

    // Function to add a style tag.
    function add_css(css) {
        let style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        let text = document.createTextNode(css);
        style.appendChild(text);
        document.head.append(style);
    }

    if (window.location.hostname === 'community.wanikani.com') {
      add_css(`
        .avatar-flair[class*="level-60"] {
          color: rgb(223,170,11) !important;
          background: linear-gradient(45deg, rgba(242,215,12,1) 0%,rgba(255,255,255,1) 56%,rgba(252,235,0,1) 96%) !important;
          border: 1px solid rgba(242,215,12,.5);
          box-sizing: border-box;
        }
        .avatar-flair[class*="level-60"]:after {
          color: rgb(223,170,11) !important;
        }
      `);
      return;
    }

    if (location.pathname.match(/^\/level\//) ||
        location.pathname.match(/^\/(radicals|kanji|vocabulary)(\/.*)?$/)) {
        add_css(`
            :root {
                --color-burned:#fbc550 !important;
                --color-burned-dark:#faac05 !important;
            }
            body .subject-character--grid.subject-character--burned .subject-character__characters,
            body .subject-character--grid.subject-character--burned .subject-character__info {opacity:1;}
            body .subject-character--grid.subject-character--burned,
            body .subject-character--burned:not(.subject-character--grid) .subject-character__characters {
                border-top:1px solid var(--color-burned);
                border-left:1px solid var(--color-burned);
                color: #fff;
                text-shadow:1px 1px 3px #000;
                box-shadow:inset -2px -2px 2px #0005, inset 2px 2px 1px #fff7;
            }
            .character-grid__item .character-item--burned .radical-image {opacity:1;}
            .character-grid__item--vocabulary .character-item__info {font-size:14px;}
            .character-grid__item--vocabulary .character-item__info-meaning {padding-bottom:2px;}
        `);
        return;
    }

    if (location.pathname.match(/^\/(dashboard)?/)) {

        add_css(`
            body .dashboard section.srs-progress ul li:last-child,
            body ul.alt-character-list span.burned {
                background-color:#fbc042;
                background-image:linear-gradient(-45deg, #fbc550, #faac05);
            }
        `);

        // Ultimate Timeline
        add_css(`
            body #timeline svg .burn {fill:#fbc042;}
            body #timeline svg .markers .bur {fill:#fbc042;}
            body #timeline .review_info .summary .bur,
            body #timeline .review_info[data-mode="srs_stage"] .burn {background-color:#fbc042;background-image:linear-gradient(to bottom, #fccd69, #faac05);color:#333;}
            body #timeline .review_info[data-mode="srs_stage"] .burn svg.radical {stroke:#333;}
            body #timeline .review_info[data-mode="srs_stage"] li.burn {border:1px solid #fbc042;}
        `);
    }

})(window.wkgoldburn);
