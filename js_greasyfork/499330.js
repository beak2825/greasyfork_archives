// ==UserScript==
// @name         Late 2020 Roblox Ban Screen Script
// @namespace    https://greasyfork.org/en/scripts/499330-late-2020-roblox-ban-screen-script
// @version      1.31
// @license      GNU GPLv3
// @description  Reverts to the 2020-2024 Roblox ban screen.
// @author       boiby
// @match        https://www.roblox.com/not-approved*
// @match        https://www.roblox.com/fr/not-approved*
// @match        https://www.roblox.com/es/not-approved*
// @connect      https://usermoderation.roblox.com/v1/not-approved*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/499330/Late%202020%20Roblox%20Ban%20Screen%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/499330/Late%202020%20Roblox%20Ban%20Screen%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = `
        .dark-theme .enable-three-dee {
            background-color: #393b3d;
        }
        .light-theme .enable-three-dee {
            background-color: #ffffff;
        }
        .light-theme p, .light-theme b {
        color: #606162;
        }
        .light-theme .not-approved-title {
        #393b3d
}
        .dark-theme #container-main, .dark-theme #content, .dark-theme #footer-container {
            background-color: #232527;
        }
        .light-theme #container-main, .light-theme #content, .light-theme #footer-container {
            background-color: #f7f7f8;
        }
        .dark-theme p, .dark-theme b {
  color: #bdbebe;
  }
:root:has(.dark-theme) {
        background-color: #232527;
}

:root:has(.light-theme) {
        background-color: #f7f7f8;
}
        .not-approved-page-web-app-root {
            margin-top: 4%;
        }
        .not-approved-page-web-app-root .not-approved-content-container {
            max-width: 800px;
            padding: 15px!important;
        }
        .chat-container {
            display: none;
        }
        .light-theme {
            color: #606162;
            text-rendering: auto;
        }
        .not-approved-page-web-app-root .not-approved-content-container .not-approved-title {
            font-weight: 400 !important;
            margin-bottom: 16px !important;
            margin-top: 6px !important;
        }
        .violation-panel {
            display:block!important;
border: 1px solid!important;
        }

        dd {
            font-weight: bold!important;
        }
        .content {
            margin-top: 0 auto!important;
        }
        @media (max-width: 543px) {
          .builder-font div {
             font-size: 16px;
             font-weight: 400;
             line-height: 1.5em !important;
          }
          .builder-font p {
             font-size: 16px;
             font-weight: 400;
             line-height: 1.5em !important;
          }
          .content {
             padding-top: 0px;
          }
        }
        h1,
        h2,
        h3,
        h4,
        h5 {
            line-height: 1.4em !important;
            margin: 0 !important;
            margin-bottom: 0px !important;
            padding: 5px 0 !important;
        }
        .not-approved-page-web-app-root .not-approved-content-container .not-approved-action-section .not-approved-action-section-children[data-testid="logout-button"] button {
  width: 90px !important;
  border: 1px solid #b8b8b8;
}
        .not-approved-page-web-app-root .not-approved-content-container .not-approved-action-section .not-approved-action-section-children a:visited {
            color: #32B5FF !important;
        }
        .not-approved-page-web-app-root .not-approved-content-container .not-approved-action-section .not-approved-action-section-children a {
            color: #528bff !important;
        }
        .not-approved-page-web-app-root .not-approved-content-container .not-approved-action-section .not-approved-action-section-children {
            padding: 12px !important;
            margin-top: 6px !important;
            margin-bottom: -16px !important;
            align-items: center;
        }
        .not-approved-web-app-root .builder-font div {
             line-height: 1.5em !important;
        }
        .not-approved-web-app-root .builder-font p > div {
             line-height: 1.5em !important;
        }
        .light-theme .content {
  color: #393b3d;
}
.not-approved-page-web-app-root .not-approved-content-container .not-approved-action-section .not-approved-action-section-children[data-testid="logout-button"] button {
  width: 90px !important;
  border: 1px solid #393b3d;
}
        .not-approved-web-app-root .builder-font p.div {
             line-height: 1.5em !important;
        }
        .light-theme .enable-three-dee {
color: #393b3d;
        }

        .not-approved-web-app-root .builder-font p {
             line-height: 1.5em !important;
        }
        .not-approved-page-web-app-root .not-approved-content-container .not-approved-action-section .not-approved-action-section-children[data-testid="logout-button"] {
            margin-top: 8px !important;
            margin-bottom: 17px !important;
            align-items: center;
            margin-left: auto;
            margin-right: auto;
        }
        .not-approved-page-web-app-root .not-approved-content-container .not-approved-action-section .not-approved-action-section-children[data-testid="logout-button"] button {
            width: 90px!important;
            border: 1px solid;
        }
        .dark-theme .not-approved-page-web-app-root .not-approved-content-container .not-approved-info-section {
            font-weight: 300 !important;
            color: #ffffff !important;
            line-height: 1.5em !important;
        }
        .light-theme .not-approved-page-web-app-root .not-approved-content-container .not-approved-info-section {
            font-weight: 300 !important;
            color: #000000 !important;
            line-height: 1.5em !important;
        }
        .light-theme .btn-control-md:hover {
            background-color: transparent;
            border-color: #393b3d;
            color: #393b3d;
        }
        .enable-three-dee {
        color: #b8b8b8;
        }
        .builder-font .font-body,
        .builder-font .text-description,
        .builder-font .text-favorite,
        .builder-font p {
            font-weight: 300 !important;
            line-height: 1.5em !important;
        }
        p div {
            font-weight: 300 !important;
            line-height: 1.5em !important;
        }
        .builder-font strong {
            font-weight: 600 !important;
            line-height: 1.5em !important;
        }
        p {
            line-height: 1.5em !important;
            margin-right: 2px !important;
            line-height: 1.5em !important;
        }
        p.text-footer {
            font-size: 10px !important;
            font-weight: 400 !important;
        }
        .not-approved-checkbox-text {
            font-weight: 400 !important;
        }
        @media (max-width: 991px) {
    .not-approved-title {
        font-size: 20px!important;
    }
    .not-approved-content-container {
        min-width: 100%!important;
    }
    p, strong, b {
        font-size: 16px!important;
    }}
    `;
    const styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode(style));
    document.head.appendChild(styleElement);
})();
(function() {
    'use strict';
    function applyStylesAndHideElements() {
        document.querySelectorAll('.not-approved-title[data-testid="main-page-title"]').forEach(function(element) {
            if (element.textContent.trim() === 'Account Deleted' ||
                element.textContent.trim() === 'Compte supprimé') {
                const standards = document.querySelector('div[data-testid="community-standards"]');
                if (standards) {
                    standards.style.display = 'none';
                }
            }
        });
    }
    window.addEventListener('load', applyStylesAndHideElements);
    const observer = new MutationObserver(applyStylesAndHideElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
(function() {
    'use strict';
    function replaceBannedText() {
        let elements = document.querySelectorAll('.not-approved-title');
        elements.forEach(function(element) {
            if (element.textContent.trim() === 'Banned for 6 Months') {
                element.textContent = 'Banned for 183 Days';
            }
        });
        elements.forEach(function(element) {
            if (element.textContent.trim() === 'Banned for 1 Year') {
                element.textContent = 'Banned for 365 Days';
            }
        });
    }
    replaceBannedText();
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            replaceBannedText();
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

(function() {
    'use strict';

    function cautionkill() {
        const foreshadowDivs = document.querySelectorAll('div[data-testid="foreshadow"]');
        foreshadowDivs.forEach(div => {
            div.remove();
        });
    }

    window.addEventListener('load', cautionkill);

    const observer = new MutationObserver(cautionkill);
    observer.observe(document.body, { childList: true, subtree: true });

})();
(function() {
    'use strict';
    function checkAndHideAppealsNotice() {
        const titleElement = document.querySelector('.not-approved-title');
        const appealsNotice = document.querySelector('[data-testid="appeals-notice"]');

        if (titleElement && appealsNotice) {
            if (titleElement.textContent.trim() === 'Warning') {
                appealsNotice.style.display = 'none';
            } else {
                appealsNotice.style.display = '';
            }
        }
    }

    const observer = new MutationObserver(checkAndHideAppealsNotice);

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    checkAndHideAppealsNotice();
})();
// Made by boiby