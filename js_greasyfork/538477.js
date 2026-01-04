// ==UserScript==
// @name         Blacket Purple Theme
// @version      1.1.4
// @description  Purple theme for Blacket!
// @icon         https://blacket.org/content/logo.png
// @author       monkxy#0001
// @namespace    http://monkxy.com
// @match        https://*.blacket.org/*
// @require      https://blacket.org/lib/js/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/538477/Blacket%20Purple%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/538477/Blacket%20Purple%20Theme.meta.js
// ==/UserScript==

(async () => {
    setTimeout(() => {
        console.log(
            "%c[blacket purple theme] loaded!",
            "color: #fff; padding: 10px; border-radius: 5px; font-size: 20px; font-weight: bold; text-shadow: 0px 0px 10px #6a1b9a;"
        );
    }, 1000);

    let $ = jQuery;

    let css = `
        :root {
            --deep-purple: #6a1b9a;
            --deep-purple-hover: #4b1373;
            --text-white: #ffffff;
            --button-purple: #7e22ce;
        }

        .styles__blooketText___1pMBG-camelCase {
            color: var(--text-white);
            filter: drop-shadow(0px 0px 5px var(--text-white));
        }

        .styles__background___2J-JA-camelCase,
        .styles__bazaarItems___KmNa2-camelCase,
        .styles__blookGridContainer___AK47P-camelCase,
        .styles__cardContainer___NGmjp-camelCase,
        .styles__chatCurrentRoom___MCaV4-camelCase,
        .styles__chatInputContainer___gkR4A-camelCase,
        .styles__chatRoomsListContainer___Gk4Av-camelCase,
        .styles__chatRoomsTitle___fR4Av-camelCase,
        .styles__chatRooms___o5ASb-camelCase,
        .styles__container___1BPm9-camelCase,
        .styles__container___2VzTy-camelCase,
        .styles__container___3St5B-camelCase,
        .styles__containerHeader___3xghM-camelCase,
        .styles__containerHeaderInside___2omQm-camelCase,
        .styles__containerHeaderRight___3xghM-camelCase,
        .styles__containerHeaderRightFriends___3xghM-camelCase,
        .styles__editHeaderContainer___2G1ji-camelCase,
        .styles__formsForm___MvA35-camelCase,
        .styles__header___22Ne2-camelCase,
        .styles__header___2O21B-camelCase,
        .styles__headerBadgeBg___12ogR-camelCase,
        .styles__headerSide___1r1-b-camelCase,
        .styles__infoContainer___2uI-S-camelCase,
        .styles__input___2XTSp-camelCase,
        .styles__left___9beun-camelCase,
        .styles__myTokenAmount___ANKHA-camelCase,
        .styles__otherTokenAmount___SEGGS-camelCase,
        .styles__postsContainer___39_IQ-camelCase,
        .styles__profileContainer___CSuIE-camelCase,
        .styles__profileDropdownMenu___2jUAA-camelCase,
        .styles__profileDropdownOption___ljZXD-camelCase,
        .styles__sidebar___1XqWi-camelCase,
        .styles__signUpButton___3_ch3-camelCase,
        .styles__statContainer___QKuOF-camelCase,
        .styles__statsContainer___QnrRB-camelCase,
        .styles__toastContainer___o4pCa-camelCase,
        .styles__tokenContainer___3yBv--camelCase,
        .styles__tradingContainer___B1ABS-camelCase,
        textarea,
        input,
        .toastMessage {
            background-color: var(--deep-purple) !important;
            color: var(--text-white) !important;
        }

        .styles__bazaarItem___Meg69-camelCase,
        .styles__chatEmojiButton___8RFa2-camelCase,
        .styles__chatUploadButton___g39Ac-camelCase {
            background-color: var(--deep-purple-hover) !important;
            transition: 0.2s ease-in-out;
        }

        .styles__bazaarItem___Meg69-camelCase:hover,
        .styles__chatEmojiButton___8RFa2-camelCase:hover,
        .styles__chatUploadButton___g39Ac-camelCase:hover,
        .styles__profileDropdownOption___ljZXD-camelCase:hover {
            background-color: #3d0d5c !important;
            transform: scale(1.05);
        }

        .styles__button___2hNZo-camelCase,
        .styles__buttonFilled___23Dcn-camelCase {
            background-color: var(--button-purple) !important;
            color: var(--text-white) !important;
        }

        .styles__buttonInside___39vdp-camelCase,
        .styles__front___vcvuy-camelCase,
        .styles__loginButton___1e3jI-camelCase {
            background-color: var(--text-white) !important;
            color: var(--deep-purple-hover) !important;
        }

        .styles__edge___3eWfq-camelCase,
        .styles__horizontalBlookGridLine___4SAvz-camelCase,
        .styles__verticalBlookGridLine___rQWaZ-camelCase,
        hr {
            background-color: var(--text-white) !important;
        }

        .styles__rightButtonInside___14imT-camelCase {
            color: var(--text-white) !important;
        }

        #searchInput {
            background-color: var(--button-purple) !important;
        }
    `;

    $('head').append(`<style>${css}</style>`);
})();
