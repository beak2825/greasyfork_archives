// ==UserScript==
// @name         Blacket Theme Switcher
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Theme switcher
// @author       You
// @match        https://*.blacket.org/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/541231/Blacket%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/541231/Blacket%20Theme%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

   const amoledCSS = `
        .styles__blooketText___1pMBG-camelCase {
            font-size: 40px;
            font-family: Titan One, sans-serif;
            text-decoration: none;
            color: white;
            filter: drop-shadow(0px 0px 5px white);
            margin-bottom: 20px;
            text-align: center;
        }

        .styles__background___2J-JA-camelCase {
            background-color: #000 !important;
        }

        .styles__bazaarItem___Meg69-camelCase {
            background-color: #111111 !important;
            transition: 0.2s ease-in-out;
        }

        .styles__bazaarItem___Meg69-camelCase:hover {
            background-color: #222222 !important;
            transform: scale(1.05);
        }

        .styles__bazaarItems___KmNa2-camelCase {
            background-color: #000 !important;
        }

        .styles__blookGridContainer___AK47P-camelCase {
            background-color: #000 !important;
        }

        .styles__button___2hNZo-camelCase,
        .styles__buttonFilled___23Dcn-camelCase {
            background-color: #000 !important;
        }

        .styles__buttonInside___39vdp-camelCase,
        .styles__front___vcvuy-camelCase {
            background-color: #fff !important;
            color: #000 !important;
        }

        .styles__cardContainer___NGmjp-camelCase {
            background-color: #000 !important;
        }

        .styles__chatCurrentRoom___MCaV4-camelCase {
            background-color: #000 !important;
        }

        .styles__chatEmojiButton___8RFa2-camelCase {
            background-color: #000 !important;
            transition: 0.2s ease-in-out;
        }

        .styles__chatEmojiButton___8RFa2-camelCase:hover {
            background-color: #111111 !important;
        }

        .styles__chatInputContainer___gkR4A-camelCase {
            background-color: #000 !important;
        }

        .styles__chatRoomsListContainer___Gk4Av-camelCase {
            background-color: #000 !important;
        }

        .styles__chatRoomsTitle___fR4Av-camelCase {
            background-color: #000 !important;
        }

        .styles__chatRooms___o5ASb-camelCase {
            background-color: #000 !important;
        }

        .styles__chatUploadButton___g39Ac-camelCase {
            background-color: #000 !important;
            transition: 0.2s ease-in-out;
        }

        .styles__chatUploadButton___g39Ac-camelCase:hover {
            background-color: #111111 !important;
        }

        .styles__container___1BPm9-camelCase {
            background-color: #000 !important;
        }

        .styles__container___2VzTy-camelCase {
            background-color: #000 !important;
        }

        .styles__container___3St5B-camelCase {
            background-color: #000 !important;
        }

        .styles__containerHeader___3xghM-camelCase {
            background-color: #000 !important;
        }

        .styles__containerHeaderInside___2omQm-camelCase {
            background-color: #000 !important;
        }

        .styles__containerHeaderRight___3xghM-camelCase,
        .styles__containerHeaderRightFriends___3xghM-camelCase {
            background-color: #000 !important;
        }

        .styles__editHeaderContainer___2G1ji-camelCase {
            background-color: #000 !important;
        }

        .styles__edge___3eWfq-camelCase {
            background-color: #fff !important;
        }

        .styles__formsForm___MvA35-camelCase {
            background-color: #000 !important;
        }

        .styles__header___22Ne2-camelCase {
            background-color: #000 !important;
        }

        .styles__header___2O21B-camelCase {
            background-color: #000 !important;
        }

        .styles__headerBadgeBg___12ogR-camelCase {
            background-color: #000 !important;
        }

        .styles__headerSide___1r1-b-camelCase {
            background-color: #000 !important;
        }

        .styles__horizontalBlookGridLine___4SAvz-camelCase {
            background-color: #fff !important;
        }

        .styles__infoContainer___2uI-S-camelCase {
            background-color: #000 !important;
        }

        .styles__input___2XTSp-camelCase {
            background-color: #000 !important;
        }

        .styles__left___9beun-camelCase {
            background-color: #000 !important;
        }

        .styles__loginButton___1e3jI-camelCase {
            background-color: #fff !important;
            color: #000 !important;
        }

        .styles__myTokenAmount___ANKHA-camelCase {
            background-color: #000 !important;
        }

        .styles__otherTokenAmount___SEGGS-camelCase {
            background-color: #000 !important;
        }

        .styles__postsContainer___39_IQ-camelCase {
            background-color: #111111 !important;
        }

        .styles__profileContainer___CSuIE-camelCase {
            background-color: #000 !important;
        }

        .styles__profileDropdownMenu___2jUAA-camelCase {
            background-color: #000 !important;
        }

        .styles__profileDropdownOption___ljZXD-camelCase {
            background-color: #000 !important;
        }

        .styles__profileDropdownOption___ljZXD-camelCase:hover {
            background-color: #111111 !important;
        }

        .styles__rightButtonInside___14imT-camelCase {
            color: #000 !important;
        }

        .styles__sidebar___1XqWi-camelCase {
            background-color: #000 !important;
        }

        .styles__signUpButton___3_ch3-camelCase {
            background-color: #000 !important;
            color: #fff !important;
        }

        .styles__statContainer___QKuOF-camelCase {
            background-color: #111111 !important;
        }

        .styles__statsContainer___QnrRB-camelCase {
            background-color: #000 !important;
        }

        .styles__toastContainer___o4pCa-camelCase {
            background-color: #000 !important;
        }

        .styles__tokenContainer___3yBv--camelCase {
            background-color: #000 !important;
        }

        .styles__tradingContainer___B1ABS-camelCase {
            background-color: #000 !important;
        }

        .styles__verticalBlookGridLine___rQWaZ-camelCase {
            background-color: #fff !important;
        }

        #searchInput {
            background-color: #111111 !important;
        }

        textarea {
            background-color: #000 !important;
        }

        .toastMessage {
            background-color: #000 !important;
        }

        input {
            background-color: #000 !important;
        }

        hr {
            background-color: #fff !important;
        }
    `;

    const redCSS = `
        :root {
            --red: #c41a1a;
            --red-hover: #a31313;
            --text-white: #ffffff;
            --button-red: #d62b2b;
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
            background-color: var(--red) !important;
            color: var(--text-white) !important;
        }
        .styles__bazaarItem___Meg69-camelCase,
        .styles__chatEmojiButton___8RFa2-camelCase,
        .styles__chatUploadButton___g39Ac-camelCase {
            background-color: var(--red-hover) !important;
            transition: 0.2s ease-in-out;
        }
        .styles__bazaarItem___Meg69-camelCase:hover,
        .styles__chatEmojiButton___8RFa2-camelCase:hover,
        .styles__chatUploadButton___g39Ac-camelCase:hover,
        .styles__profileDropdownOption___ljZXD-camelCase:hover {
            background-color: #890f0f !important;
            transform: scale(1.05);
        }
        .styles__button___2hNZo-camelCase,
        .styles__buttonFilled___23Dcn-camelCase {
            background-color: var(--button-red) !important;
            color: var(--text-white) !important;
        }
        .styles__buttonInside___39vdp-camelCase,
        .styles__front___vcvuy-camelCase,
        .styles__loginButton___1e3jI-camelCase {
            background-color: var(--text-white) !important;
            color: var(--red-hover) !important;
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
            background-color: var(--button-red) !important;
        }
    `;
        const DarkRedCSS = `
        :root {
 .styles__blooketText___1pMBG-camelCase {
            font-size: 40px;
            font-family: Titan One, sans-serif;
            text-decoration: none;
            color: white;
            filter: drop-shadow(0px 0px 5px white);
            margin-bottom: 20px;
            text-align: center;
        }

        .styles__background___2J-JA-camelCase {
            background-color: #240404 !important;
        }

        .styles__bazaarItem___Meg69-camelCase {
            background-color: #43090D !important;
            transition: 0.2s ease-in-out;
        }

        .styles__bazaarItem___Meg69-camelCase:hover {
            background-color: #43090D !important;
            transform: scale(1.05);
        }

        .styles__bazaarItems___KmNa2-camelCase {
            background-color: #5C0101 !important;
        }

        .styles__blookGridContainer___AK47P-camelCase {
            background-color: #1F0406 !important;
        }

        .styles__button___2hNZo-camelCase,
        .styles__buttonFilled___23Dcn-camelCase {
            background-color: #9F141F !important;
        }

        .styles__buttonInside___39vdp-camelCase,
        .styles__front___vcvuy-camelCase {
            background-color: #5C0101 !important;
            color: #9F141F !important;
        }

        .styles__cardContainer___NGmjp-camelCase {
            background-color: #9F141F !important;
        }

        .styles__chatCurrentRoom___MCaV4-camelCase {
            background-color: #5A0515 !important;
        }

        .styles__chatEmojiButton___8RFa2-camelCase {
            background-color: #BD1825 !important;
            transition: 0.2s ease-in-out;
        }

        .styles__chatEmojiButton___8RFa2-camelCase:hover {
            background-color: #BDA01E !important;
        }

        .styles__chatInputContainer___gkR4A-camelCase {
            background-color: #000000 !important;
        }

        .styles__chatRoomsListContainer___Gk4Av-camelCase {
            background-color: #330707 !important;
        }

        .styles__chatRoomsTitle___fR4Av-camelCase {
            background-color: #330707 !important;
        }

        .styles__chatRooms___o5ASb-camelCase {
            background-color: #5C0008 !important;
        }

        .styles__chatUploadButton___g39Ac-camelCase {
            background-color: #B3000F !important;
            transition: 0.2s ease-in-out;
        }

        .styles__chatUploadButton___g39Ac-camelCase:hover {
            background-color: #2C37B3 !important;
        }

        .styles__container___1BPm9-camelCase {
            background-color: #B3000F !important;
        }

        .styles__container___2VzTy-camelCase {
            background-color: #5F0000 !important;
        }

        .styles__container___3St5B-camelCase {
            background-color: #5F0000 !important;
        }

        .styles__containerHeader___3xghM-camelCase {
            background-color: #5F0000 !important;
        }

        .styles__containerHeaderInside___2omQm-camelCase {
            background-color: #5F0000 !important;
        }

        .styles__containerHeaderRight___3xghM-camelCase,
        .styles__containerHeaderRightFriends___3xghM-camelCase {
            background-color: #5F0000 !important;
        }

        .styles__editHeaderContainer___2G1ji-camelCase {
            background-color: #5F0000 !important;
        }

        .styles__edge___3eWfq-camelCase {
            background-color: #5C0101 !important;
        }

        .styles__formsForm___MvA35-camelCase {
            background-color: #5F0000) !important;
        }

        .styles__header___22Ne2-camelCase {
            background-color: #5F0000 !important;
        }

        .styles__header___2O21B-camelCase {
            background-color: #F50C0C !important;
        }

        .styles__headerBadgeBg___12ogR-camelCase {
            background-color: #F50C0C !important;
        }

        .styles__headerSide___1r1-b-camelCase {
            background-color: #F50C0C !important;
        }

        .styles__horizontalBlookGridLine___4SAvz-camelCase {
            background-color: #5C0101 !important;
        }

        .styles__infoContainer___2uI-S-camelCase {
            background-color: #430303 !important;
        }

        .styles__input___2XTSp-camelCase {
            background-color: #430303 !important;
        }

        .styles__left___9beun-camelCase {
            background-color: #430303 !important;
        }

        .styles__loginButton___1e3jI-camelCase {
            background-color: #fff !important;
            color: #430303 !important;
        }

        .styles__myTokenAmount___ANKHA-camelCase {
            background-color: #430303 !important;
        }

        .styles__otherTokenAmount___SEGGS-camelCase {
            background-color: #430303 !important;
        }

        .styles__postsContainer___39_IQ-camelCase {
            background-color: #5C0101 !important;
        }

        .styles__profileContainer___CSuIE-camelCase {
            background-color: #430303 !important;
        }

        .styles__profileDropdownMenu___2jUAA-camelCase {
            background-color: #430303 !important;
        }

        .styles__profileDropdownOption___ljZXD-camelCase {
            background-color: #920707 !important;
        }

        .styles__profileDropdownOption___ljZXD-camelCase:hover {
            background-color: #111111 !important;
        }

        .styles__rightButtonInside___14imT-camelCase {
            color: #920707 !important;
        }

        .styles__sidebar___1XqWi-camelCase {
            background-color: #3E0303 !important;
        }

        .styles__signUpButton___3_ch3-camelCase {
            background-color: #3E0303 !important;
            color: #5C0101 !important;
        }

        .styles__statContainer___QKuOF-camelCase {
            background-color: #111111 !important;
        }

        .styles__statsContainer___QnrRB-camelCase {
            background-color: #3E0303 !important;
        }

        .styles__toastContainer___o4pCa-camelCase {
            background-color: #3E0303 !important;
        }

        .styles__tokenContainer___3yBv--camelCase {
            background-color: #3E0303 !important;
        }

        .styles__tradingContainer___B1ABS-camelCase {
            background-color: #3E0303 !important;
        }

        .styles__verticalBlookGridLine___rQWaZ-camelCase {
            background-color: #5C0101 !important;
        }

        #searchInput {
            background-color: #5C0101 !important;
        }

        textarea {
            background-color: setGradient(#8D1329, #000000) !important;
        }

        .toastMessage {
            background-color: setGradient(#8D1329, #000000) !important;
        }

        input {
            background-color: setGradient(#8D1329, #000000) !important;
        }

        hr {
            background-color: #5C0101 !important;
        }
    `;
    const orangeCSS = `
 :root {
            --orange: #c46a1a;
            --orange-hover: #a35213;
            --text-white: #ffffff;
            --button-orange: #d67f2b;
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
            background-color: var(--orange) !important;
            color: var(--text-white) !important;
        }
 
        .styles__bazaarItem___Meg69-camelCase,
        .styles__chatEmojiButton___8RFa2-camelCase,
        .styles__chatUploadButton___g39Ac-camelCase {
            background-color: var(--orange-hover) !important;
            transition: 0.2s ease-in-out;
        }
 
        .styles__bazaarItem___Meg69-camelCase:hover,
        .styles__chatEmojiButton___8RFa2-camelCase:hover,
        .styles__chatUploadButton___g39Ac-camelCase:hover,
        .styles__profileDropdownOption___ljZXD-camelCase:hover {
            background-color: #8f3f07 !important;
            transform: scale(1.05);
        }
 
        .styles__button___2hNZo-camelCase,
        .styles__buttonFilled___23Dcn-camelCase {
            background-color: var(--button-orange) !important;
            color: var(--text-white) !important;
        }
 
        .styles__buttonInside___39vdp-camelCase,
        .styles__front___vcvuy-camelCase,
        .styles__loginButton___1e3jI-camelCase {
            background-color: var(--text-white) !important;
            color: var(--orange-hover) !important;
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
            background-color: var(--button-orange) !important;
        }
    `;
const DarkOrangeCSS = `
.styles__blooketText___1pMBG-camelCase {
    font-size: 40px;
    font-family: Titan One, sans-serif;
    text-decoration: none;
    color: white;
    filter: drop-shadow(0px 0px 5px white);
    margin-bottom: 20px;
    text-align: center;
}

.styles__background___2J-JA-camelCase {
    background-color: #4a2a00 !important; /* brighter dark orange */
}

.styles__bazaarItem___Meg69-camelCase {
    background-color: #935600 !important;
    transition: 0.2s ease-in-out;
}

.styles__bazaarItem___Meg69-camelCase:hover {
    background-color: #935600 !important;
    transform: scale(1.05);
}

.styles__bazaarItems___KmNa2-camelCase {
    background-color: #6e4000 !important;
}

.styles__blookGridContainer___AK47P-camelCase {
    background-color: #4a2a00 !important;
}

.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase {
    background-color: #f07e00 !important; /* brighter medium dark orange */
}

.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase {
    background-color: #6e4000 !important;
    color: #f07e00 !important;
}

.styles__cardContainer___NGmjp-camelCase {
    background-color: #f07e00 !important;
}

.styles__chatCurrentRoom___MCaV4-camelCase {
    background-color: #7c5200 !important;
}

.styles__chatEmojiButton___8RFa2-camelCase {
    background-color: #e08f17 !important;
    transition: 0.2s ease-in-out;
}

.styles__chatEmojiButton___8RFa2-camelCase:hover {
    background-color: #d1b845 !important;
}

.styles__chatInputContainer___gkR4A-camelCase {
    background-color: #000000 !important;
}

.styles__chatRoomsListContainer___Gk4Av-camelCase,
.styles__chatRoomsTitle___fR4Av-camelCase {
    background-color: #6e4000 !important;
}

.styles__chatRooms___o5ASb-camelCase {
    background-color: #704100 !important;
}

.styles__chatUploadButton___g39Ac-camelCase {
    background-color: #bd7200 !important;
    transition: 0.2s ease-in-out;
}

.styles__chatUploadButton___g39Ac-camelCase:hover {
    background-color: #bd9034 !important;
}

.styles__container___1BPm9-camelCase {
    background-color: #bd7200 !important;
}

.styles__container___2VzTy-camelCase,
.styles__container___3St5B-camelCase,
.styles__containerHeader___3xghM-camelCase,
.styles__containerHeaderInside___2omQm-camelCase,
.styles__containerHeaderRight___3xghM-camelCase,
.styles__containerHeaderRightFriends___3xghM-camelCase,
.styles__editHeaderContainer___2G1ji-camelCase {
    background-color: #724300 !important;
}

.styles__edge___3eWfq-camelCase {
    background-color: #6e4000 !important;
}

.styles__formsForm___MvA35-camelCase {
    background-color: #724300 !important;
}

.styles__header___22Ne2-camelCase {
    background-color: #724300 !important;
}

.styles__header___2O21B-camelCase,
.styles__headerBadgeBg___12ogR-camelCase,
.styles__headerSide___1r1-b-camelCase {
    background-color: #ffa31a !important; /* bright orange */
}

.styles__horizontalBlookGridLine___4SAvz-camelCase {
    background-color: #6e4000 !important;
}

.styles__infoContainer___2uI-S-camelCase,
.styles__input___2XTSp-camelCase,
.styles__left___9beun-camelCase,
.styles__myTokenAmount___ANKHA-camelCase,
.styles__otherTokenAmount___SEGGS-camelCase,
.styles__profileContainer___CSuIE-camelCase,
.styles__profileDropdownMenu___2jUAA-camelCase {
    background-color: #5f3d00 !important;
}

.styles__loginButton___1e3jI-camelCase {
    background-color: #fff !important;
    color: #5f3d00 !important;
}

.styles__profileDropdownOption___ljZXD-camelCase {
    background-color: #be7c15 !important;
}

.styles__profileDropdownOption___ljZXD-camelCase:hover {
    background-color: #111111 !important;
}

.styles__rightButtonInside___14imT-camelCase {
    color: #be7c15 !important;
}

.styles__sidebar___1XqWi-camelCase {
    background-color: #6e4000 !important;
}

.styles__signUpButton___3_ch3-camelCase {
    background-color: #6e4000 !important;
    color: #6e4000 !important;
}

.styles__statContainer___QKuOF-camelCase {
    background-color: #111111 !important;
}

.styles__statsContainer___QnrRB-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__tokenContainer___3yBv--camelCase,
.styles__tradingContainer___B1ABS-camelCase {
    background-color: #6e4000 !important;
}

.styles__verticalBlookGridLine___rQWaZ-camelCase {
    background-color: #6e4000 !important;
}

#searchInput {
    background-color: #6e4000 !important;
}

textarea,
.toastMessage,
input {
    background: linear-gradient(135deg, #f29c3f, #000000) !important;
}

hr {
    background-color: #6e4000 !important;
}
`;


    const yellowCSS = `
    :root {
        --deep-yellow: #d4c60f;
        --deep-yellow-hover: #b1a309;
        --text-white: #ffffff;
        --button-yellow: #e2d414;
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
        background-color: var(--deep-yellow) !important;
        color: var(--text-white) !important;
    }

    .styles__bazaarItem___Meg69-camelCase,
    .styles__chatEmojiButton___8RFa2-camelCase,
    .styles__chatUploadButton___g39Ac-camelCase {
        background-color: var(--deep-yellow-hover) !important;
        transition: 0.2s ease-in-out;
    }

    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__chatEmojiButton___8RFa2-camelCase:hover,
    .styles__chatUploadButton___g39Ac-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
        background-color: #a99708 !important;
        transform: scale(1.05);
    }

    .styles__button___2hNZo-camelCase,
    .styles__buttonFilled___23Dcn-camelCase {
        background-color: var(--button-yellow) !important;
        color: var(--text-white) !important;
    }

    .styles__buttonInside___39vdp-camelCase,
    .styles__front___vcvuy-camelCase,
    .styles__loginButton___1e3jI-camelCase {
        background-color: var(--text-white) !important;
        color: var(--deep-yellow-hover) !important;
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
        background-color: var(--button-yellow) !important;
    }
`;
const DarkYellowCSS = `
.styles__blooketText___1pMBG-camelCase {
    font-size: 40px;
    font-family: Titan One, sans-serif;
    text-decoration: none;
    color: white;
    filter: drop-shadow(0px 0px 5px white);
    margin-bottom: 20px;
    text-align: center;
}

.styles__background___2J-JA-camelCase {
    background-color: #6e6800 !important; /* brighter dark yellow */
}

.styles__bazaarItem___Meg69-camelCase {
    background-color: #a29f00 !important;
    transition: 0.2s ease-in-out;
}

.styles__bazaarItem___Meg69-camelCase:hover {
    background-color: #a29f00 !important;
    transform: scale(1.05);
}

.styles__bazaarItems___KmNa2-camelCase {
    background-color: #7c7700 !important;
}

.styles__blookGridContainer___AK47P-camelCase {
    background-color: #6e6800 !important;
}

.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase {
    background-color: #fff700 !important; /* bright dark yellow */
}

.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase {
    background-color: #7c7700 !important;
    color: #fff700 !important;
}

.styles__cardContainer___NGmjp-camelCase {
    background-color: #fff700 !important;
}

.styles__chatCurrentRoom___MCaV4-camelCase {
    background-color: #8a8500 !important;
}

.styles__chatEmojiButton___8RFa2-camelCase {
    background-color: #f5f523 !important;
    transition: 0.2s ease-in-out;
}

.styles__chatEmojiButton___8RFa2-camelCase:hover {
    background-color: #f9f95a !important;
}

.styles__chatInputContainer___gkR4A-camelCase {
    background-color: #000000 !important;
}

.styles__chatRoomsListContainer___Gk4Av-camelCase,
.styles__chatRoomsTitle___fR4Av-camelCase {
    background-color: #7c7700 !important;
}

.styles__chatRooms___o5ASb-camelCase {
    background-color: #827f00 !important;
}

.styles__chatUploadButton___g39Ac-camelCase {
    background-color: #e9e900 !important;
    transition: 0.2s ease-in-out;
}

.styles__chatUploadButton___g39Ac-camelCase:hover {
    background-color: #f9f959 !important;
}

.styles__container___1BPm9-camelCase {
    background-color: #e9e900 !important;
}

.styles__container___2VzTy-camelCase,
.styles__container___3St5B-camelCase,
.styles__containerHeader___3xghM-camelCase,
.styles__containerHeaderInside___2omQm-camelCase,
.styles__containerHeaderRight___3xghM-camelCase,
.styles__containerHeaderRightFriends___3xghM-camelCase,
.styles__editHeaderContainer___2G1ji-camelCase {
    background-color: #7c7700 !important;
}

.styles__edge___3eWfq-camelCase {
    background-color: #7c7700 !important;
}

.styles__formsForm___MvA35-camelCase {
    background-color: #7c7700 !important;
}

.styles__header___22Ne2-camelCase {
    background-color: #7c7700 !important;
}

.styles__header___2O21B-camelCase,
.styles__headerBadgeBg___12ogR-camelCase,
.styles__headerSide___1r1-b-camelCase {
    background-color: #ffff33 !important; /* bright yellow */
}

.styles__horizontalBlookGridLine___4SAvz-camelCase {
    background-color: #7c7700 !important;
}

.styles__infoContainer___2uI-S-camelCase,
.styles__input___2XTSp-camelCase,
.styles__left___9beun-camelCase,
.styles__myTokenAmount___ANKHA-camelCase,
.styles__otherTokenAmount___SEGGS-camelCase,
.styles__profileContainer___CSuIE-camelCase,
.styles__profileDropdownMenu___2jUAA-camelCase {
    background-color: #767000 !important;
}

.styles__loginButton___1e3jI-camelCase {
    background-color: #fff !important;
    color: #767000 !important;
}

.styles__profileDropdownOption___ljZXD-camelCase {
    background-color: #d1cf14 !important;
}

.styles__profileDropdownOption___ljZXD-camelCase:hover {
    background-color: #111111 !important;
}

.styles__rightButtonInside___14imT-camelCase {
    color: #d1cf14 !important;
}

.styles__sidebar___1XqWi-camelCase {
    background-color: #7c7700 !important;
}

.styles__signUpButton___3_ch3-camelCase {
    background-color: #7c7700 !important;
    color: #7c7700 !important;
}

.styles__statContainer___QKuOF-camelCase {
    background-color: #111111 !important;
}

.styles__statsContainer___QnrRB-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__tokenContainer___3yBv--camelCase,
.styles__tradingContainer___B1ABS-camelCase {
    background-color: #7c7700 !important;
}

.styles__verticalBlookGridLine___rQWaZ-camelCase {
    background-color: #7c7700 !important;
}

#searchInput {
    background-color: #7c7700 !important;
}

textarea,
.toastMessage,
input {
    background: linear-gradient(135deg, #f9f940, #000000) !important;
}

hr {
    background-color: #7c7700 !important;
}
`;


    const greenCSS = `
    :root {
        --deep-green: #0a8a0a;
        --deep-green-hover: #076f07;
        --text-white: #ffffff;
        --button-green: #12a012;
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
        background-color: var(--deep-green) !important;
        color: var(--text-white) !important;
    }

    .styles__bazaarItem___Meg69-camelCase,
    .styles__chatEmojiButton___8RFa2-camelCase,
    .styles__chatUploadButton___g39Ac-camelCase {
        background-color: var(--deep-green-hover) !important;
        transition: 0.2s ease-in-out;
    }

    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__chatEmojiButton___8RFa2-camelCase:hover,
    .styles__chatUploadButton___g39Ac-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
        background-color: #065906 !important;
        transform: scale(1.05);
    }

    .styles__button___2hNZo-camelCase,
    .styles__buttonFilled___23Dcn-camelCase {
        background-color: var(--button-green) !important;
        color: var(--text-white) !important;
    }

    .styles__buttonInside___39vdp-camelCase,
    .styles__front___vcvuy-camelCase,
    .styles__loginButton___1e3jI-camelCase {
        background-color: var(--text-white) !important;
        color: var(--deep-green-hover) !important;
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
        background-color: var(--button-green) !important;
    }
`;
const DarkGreenCSS = `
:root {
    .styles__blooketText___1pMBG-camelCase {
        font-size: 40px;
        font-family: Titan One, sans-serif;
        text-decoration: none;
        color: white;
        filter: drop-shadow(0px 0px 5px white);
        margin-bottom: 20px;
        text-align: center;
    }

    .styles__background___2J-JA-camelCase {
        background-color: #042404 !important; /* very dark green */
    }

    .styles__bazaarItem___Meg69-camelCase {
        background-color: #094309 !important; /* dark green */
        transition: 0.2s ease-in-out;
    }

    .styles__bazaarItem___Meg69-camelCase:hover {
        background-color: #094309 !important;
        transform: scale(1.05);
    }

    .styles__bazaarItems___KmNa2-camelCase {
        background-color: #015c01 !important;
    }

    .styles__blookGridContainer___AK47P-camelCase {
        background-color: #041f04 !important;
    }

    .styles__button___2hNZo-camelCase,
    .styles__buttonFilled___23Dcn-camelCase {
        background-color: #149f14 !important; /* medium green */
    }

    .styles__buttonInside___39vdp-camelCase,
    .styles__front___vcvuy-camelCase {
        background-color: #015c01 !important;
        color: #149f14 !important;
    }

    .styles__cardContainer___NGmjp-camelCase {
        background-color: #149f14 !important;
    }

    .styles__chatCurrentRoom___MCaV4-camelCase {
        background-color: #155a05 !important;
    }

    .styles__chatEmojiButton___8RFa2-camelCase {
        background-color: #18bd18 !important;
        transition: 0.2s ease-in-out;
    }

    .styles__chatEmojiButton___8RFa2-camelCase:hover {
        background-color: #a0bd18 !important;
    }

    .styles__chatInputContainer___gkR4A-camelCase {
        background-color: #000000 !important;
    }

    .styles__chatRoomsListContainer___Gk4Av-camelCase {
        background-color: #073307 !important;
    }

    .styles__chatRoomsTitle___fR4Av-camelCase {
        background-color: #073307 !important;
    }

    .styles__chatRooms___o5ASb-camelCase {
        background-color: #005c00 !important;
    }

    .styles__chatUploadButton___g39Ac-camelCase {
        background-color: #00b300 !important;
        transition: 0.2s ease-in-out;
    }

    .styles__chatUploadButton___g39Ac-camelCase:hover {
        background-color: #2c37b3 !important; /* kept original blue hover for contrast */
    }

    .styles__container___1BPm9-camelCase {
        background-color: #00b300 !important;
    }

    .styles__container___2VzTy-camelCase,
    .styles__container___3St5B-camelCase,
    .styles__containerHeader___3xghM-camelCase,
    .styles__containerHeaderInside___2omQm-camelCase,
    .styles__containerHeaderRight___3xghM-camelCase,
    .styles__containerHeaderRightFriends___3xghM-camelCase,
    .styles__editHeaderContainer___2G1ji-camelCase {
        background-color: #005f00 !important;
    }

    .styles__edge___3eWfq-camelCase {
        background-color: #015c01 !important;
    }

    .styles__formsForm___MvA35-camelCase {
        background-color: #005f00 !important;
    }

    .styles__header___22Ne2-camelCase {
        background-color: #005f00 !important;
    }

    .styles__header___2O21B-camelCase,
    .styles__headerBadgeBg___12ogR-camelCase,
    .styles__headerSide___1r1-b-camelCase {
        background-color: #0cf50c !important; /* bright green */
    }

    .styles__horizontalBlookGridLine___4SAvz-camelCase {
        background-color: #015c01 !important;
    }

    .styles__infoContainer___2uI-S-camelCase,
    .styles__input___2XTSp-camelCase,
    .styles__left___9beun-camelCase,
    .styles__myTokenAmount___ANKHA-camelCase,
    .styles__otherTokenAmount___SEGGS-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__profileDropdownMenu___2jUAA-camelCase {
        background-color: #034303 !important;
    }

    .styles__loginButton___1e3jI-camelCase {
        background-color: #fff !important;
        color: #034303 !important;
    }

    .styles__profileDropdownOption___ljZXD-camelCase {
        background-color: #079207 !important;
    }

    .styles__profileDropdownOption___ljZXD-camelCase:hover {
        background-color: #111111 !important;
    }

    .styles__rightButtonInside___14imT-camelCase {
        color: #079207 !important;
    }

    .styles__sidebar___1XqWi-camelCase {
        background-color: #033e03 !important;
    }

    .styles__signUpButton___3_ch3-camelCase {
        background-color: #033e03 !important;
        color: #015c01 !important;
    }

    .styles__statContainer___QKuOF-camelCase {
        background-color: #111111 !important;
    }

    .styles__statsContainer___QnrRB-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__tokenContainer___3yBv--camelCase,
    .styles__tradingContainer___B1ABS-camelCase {
        background-color: #033e03 !important;
    }

    .styles__verticalBlookGridLine___rQWaZ-camelCase {
        background-color: #015c01 !important;
    }

    #searchInput {
        background-color: #015c01 !important;
    }

    textarea,
    .toastMessage,
    input {
        background: linear-gradient(135deg, #138d13, #000000) !important;
    }

    hr {
        background-color: #015c01 !important;
    }
}
`;

const TrianguletGreenCSS = `
:root {
    --tri-bg: #5bd331;
    --tri-panel: #133e08;
    --tri-button-orange: #f5a623;
    --tri-button-blue: #2c8bff;
    --tri-light-green: #6af942;
    --tri-text-white: #ffffff;
}

/* Background and containers */
body, #app,
.styles__background___2J-JA-camelCase,
.styles__container___1BPm9-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__chatCurrentRoom___MCaV4-camelCase,
.styles__chatRoomsListContainer___Gk4Av-camelCase,
.styles__infoContainer___2uI-S-camelCase {
    background-color: var(--tri-bg) !important;
    background-image: repeating-conic-gradient(rgba(255,255,255,0.02) 0% 25%, transparent 0% 50%) 50% / 100px 100px;
    color: var(--tri-text-white) !important;
}

/* Sidebar and header */
.styles__sidebar___1XqWi-camelCase,
.styles__header___22Ne2-camelCase {
    background-color: var(--tri-panel) !important;
    color: var(--tri-text-white) !important;
}

.styles__sidebar___1XqWi-camelCase *,
.styles__header___22Ne2-camelCase * {
    color: var(--tri-text-white) !important;
}

/* Stat containers */
.styles__statContainer___QKuOF-camelCase,
.styles__statsContainer___QnrRB-camelCase,
.styles__topStatsContainer___dWfN7-camelCase,
.styles__bottomStatsContainer___1O6MJ-camelCase,
.styles__profileContainer___CSuIE-camelCase {
    background-color: var(--tri-panel) !important;
    border-radius: 10px !important;
    box-shadow: 0 0 10px rgba(0,0,0,0.4);
    color: var(--tri-text-white) !important;
}

/* Buttons (orange only for primary actions) */
.styles__buttonFilled___23Dcn-camelCase,
.styles__button___2hNZo-camelCase:not(.styles__profileDropdownOption___ljZXD-camelCase) {
    background-color: var(--tri-button-orange) !important;
    color: var(--tri-text-white) !important;
    border: none !important;
}

/* Blue buttons (login etc.) */
.styles__buttonInside___39vdp-camelCase,
.styles__loginButton___1e3jI-camelCase {
    background-color: var(--tri-button-blue) !important;
    color: var(--tri-text-white) !important;
}

/* Inputs and messages */
input, textarea, .toastMessage {
    background-color: #ffffff10 !important;
    color: var(--tri-text-white) !important;
    border: 1px solid #ffffff30 !important;
}

/* All text */
*, *::before, *::after {
    color: var(--tri-text-white) !important;
}

/* Links */
a, .styles__link___5UR6_-camelCase {
    color: var(--tri-light-green) !important;
}

/* Dropdown and bazaar options — now use panel green */
.styles__profileDropdownOption___ljZXD-camelCase,
.styles__selectOption___1RxYj-camelCase {
    background-color: var(--tri-panel) !important;
    color: var(--tri-text-white) !important;
}

/* Hover styles */
.styles__profileDropdownOption___ljZXD-camelCase:hover,
.styles__bazaarItem___Meg69-camelCase:hover {
    background-color: #1e6821 !important;
    transform: scale(1.05);
}
`;



    const blueCSS = `
:root {
    --deep-blue: #1a28c4;
    --deep-blue-hover: #131fa3;
    --text-white: #ffffff;
    --button-blue: #2b39d6;
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
    background-color: var(--deep-blue) !important;
    color: var(--text-white) !important;
}

.styles__bazaarItem___Meg69-camelCase,
.styles__chatEmojiButton___8RFa2-camelCase,
.styles__chatUploadButton___g39Ac-camelCase {
    background-color: var(--deep-blue-hover) !important;
    transition: 0.2s ease-in-out;
}

.styles__bazaarItem___Meg69-camelCase:hover,
.styles__chatEmojiButton___8RFa2-camelCase:hover,
.styles__chatUploadButton___g39Ac-camelCase:hover,
.styles__profileDropdownOption___ljZXD-camelCase:hover {
    background-color: #101890 !important;
    transform: scale(1.05);
}

.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase {
    background-color: var(--button-blue) !important;
    color: var(--text-white) !important;
}

.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase,
.styles__loginButton___1e3jI-camelCase {
    background-color: var(--text-white) !important;
    color: var(--deep-blue-hover) !important;
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
    background-color: var(--button-blue) !important;
}
`;
    const DarkBlueCSS = `
:root {
.styles__blooketText___1pMBG-camelCase {
            font-size: 40px;
            font-family: Titan One, sans-serif;
            text-decoration: none;
            color: white;
            filter: drop-shadow(0px 0px 5px white);
            margin-bottom: 20px;
            text-align: center;
        }

        .styles__background___2J-JA-camelCase {
            background-color: #020524 !important;
        }

        .styles__bazaarItem___Meg69-camelCase {
            background-color: #020943 !important;
            transition: 0.2s ease-in-out;
        }

        .styles__bazaarItem___Meg69-camelCase:hover {
            background-color: #050C43 !important;
            transform: scale(1.05);
        }

        .styles__bazaarItems___KmNa2-camelCase {
            background-color: #050A5C !important;
        }

        .styles__blookGridContainer___AK47P-camelCase {
            background-color: #02041F !important;
        }

        .styles__button___2hNZo-camelCase,
        .styles__buttonFilled___23Dcn-camelCase {
            background-color: #0B129F !important;
        }

        .styles__buttonInside___39vdp-camelCase,
        .styles__front___vcvuy-camelCase {
            background-color: #06105C !important;
            color: #0C0F9F !important;
        }

        .styles__cardContainer___NGmjp-camelCase {
            background-color: #0C0F9F !important;
        }

        .styles__chatCurrentRoom___MCaV4-camelCase {
            background-color: #040B5A !important;
        }

        .styles__chatEmojiButton___8RFa2-camelCase {
            background-color: #0B14BD !important;
            transition: 0.2s ease-in-out;
        }

        .styles__chatEmojiButton___8RFa2-camelCase:hover {
            background-color: #BDA01E !important;
        }

        .styles__chatInputContainer___gkR4A-camelCase {
            background-color: #030727 !important;
        }

        .styles__chatRoomsListContainer___Gk4Av-camelCase {
            background-color: #050833 !important;
        }

        .styles__chatRoomsTitle___fR4Av-camelCase {
            background-color: #050833 !important;
        }

        .styles__chatRooms___o5ASb-camelCase {
            background-color: #050F5C !important;
        }

        .styles__chatUploadButton___g39Ac-camelCase {
            background-color: #0C1AB3 !important;
            transition: 0.2s ease-in-out;
        }

        .styles__chatUploadButton___g39Ac-camelCase:hover {
            background-color: #B30707 !important;
        }

        .styles__container___1BPm9-camelCase {
            background-color: #0104B3 !important;
        }

        .styles__container___2VzTy-camelCase {
            background-color: #00015F !important;
        }

        .styles__container___3St5B-camelCase {
            background-color: #00015F !important;
        }

        .styles__containerHeader___3xghM-camelCase {
            background-color: #00015F !important;
        }

        .styles__containerHeaderInside___2omQm-camelCase {
            background-color: #00015F !important;
        }

        .styles__containerHeaderRight___3xghM-camelCase,
        .styles__containerHeaderRightFriends___3xghM-camelCase {
            background-color: #00015F !important;
        }

        .styles__editHeaderContainer___2G1ji-camelCase {
            background-color: #00015F !important;
        }

        .styles__edge___3eWfq-camelCase {
            background-color: #04065C !important;
        }

        .styles__formsForm___MvA35-camelCase {
            background-color: #00015F) !important;
        }

        .styles__header___22Ne2-camelCase {
            background-color: #00015F !important;
        }

        .styles__header___2O21B-camelCase {
            background-color: #2C11F5 !important;
        }

        .styles__headerBadgeBg___12ogR-camelCase {
            background-color: #2C11F5 !important;
        }

        .styles__headerSide___1r1-b-camelCase {
            background-color: #2C11F5 !important;
        }

        .styles__horizontalBlookGridLine___4SAvz-camelCase {
            background-color: #060A5C !important;
        }

        .styles__infoContainer___2uI-S-camelCase {
            background-color: #080343 !important;
        }

        .styles__input___2XTSp-camelCase {
            background-color: #020543 !important;
        }

        .styles__left___9beun-camelCase {
            background-color: #020543 !important;
        }

        .styles__loginButton___1e3jI-camelCase {
            background-color: #fff !important;
            color: #020543 !important;
        }

        .styles__myTokenAmount___ANKHA-camelCase {
            background-color: #020543 !important;
        }

        .styles__otherTokenAmount___SEGGS-camelCase {
            background-color: #020543 !important;
        }

        .styles__postsContainer___39_IQ-camelCase {
            background-color: #1A005C !important;
        }

        .styles__profileContainer___CSuIE-camelCase {
            background-color: #020543 !important;
        }

        .styles__profileDropdownMenu___2jUAA-camelCase {
            background-color: #020543 !important;
        }

        .styles__profileDropdownOption___ljZXD-camelCase {
            background-color: #040B92 !important;
        }

        .styles__profileDropdownOption___ljZXD-camelCase:hover {
            background-color: #111111 !important;
        }

        .styles__rightButtonInside___14imT-camelCase {
            color: #001692 !important;
        }

        .styles__sidebar___1XqWi-camelCase {
            background-color: #04053E !important;
        }

        .styles__signUpButton___3_ch3-camelCase {
            background-color: #04053E !important;
            color: #04095C !important;
        }

        .styles__statContainer___QKuOF-camelCase {
            background-color: #111111 !important;
        }

        .styles__statsContainer___QnrRB-camelCase {
            background-color: #04053E !important;
        }

        .styles__toastContainer___o4pCa-camelCase {
            background-color: #04053E !important;
        }

        .styles__tokenContainer___3yBv--camelCase {
            background-color: #04053E !important;
        }

        .styles__tradingContainer___B1ABS-camelCase {
            background-color: #04053E !important;
        }

        .styles__verticalBlookGridLine___rQWaZ-camelCase {
            background-color: #04085C !important;
        }

        #searchInput {
            background-color: #04085C1 !important;
        }

        textarea {
            background-color: setGradient(#8D1329, #000000) !important;
        }

        .toastMessage {
            background-color: setGradient(#8D1329, #000000) !important;
        }

        input {
            background-color: setGradient(#8D1329, #000000) !important;
        }

        hr {
            background-color: #10055C !important;
        }
    `;


const BluletBlueCSS = `
:root {
  --blulet-bg: #001c6b;
  --blulet-panel: #003399;
  --blulet-accent: #004de6;
  --blulet-text: #ffffff;
}

/* Global background and containers */
body, #app,
.styles__background___2J-JA-camelCase,
.styles__container___1BPm9-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__chatCurrentRoom___MCaV4-camelCase,
.styles__chatRoomsListContainer___Gk4Av-camelCase,
.styles__infoContainer___2uI-S-camelCase {
  background-color: var(--blulet-bg) !important;
  background-image: var(--blulet-tile-pattern);
  background-size: 300px 300px;
  color: var(--blulet-text) !important;
  font-family: 'Fredoka One', sans-serif !important;
}

/* Sidebar and header */
.styles__sidebar___1XqWi-camelCase,
.styles__header___22Ne2-camelCase {
  background-color: var(--blulet-panel) !important;
  color: var(--blulet-text) !important;
}

.styles__sidebar___1XqWi-camelCase *,
.styles__header___22Ne2-camelCase * {
  color: var(--blulet-text) !important;
}

/* Stat containers */
.styles__statContainer___QKuOF-camelCase,
.styles__statsContainer___QnrRB-camelCase,
.styles__topStatsContainer___dWfN7-camelCase,
.styles__bottomStatsContainer___1O6MJ-camelCase,
.styles__profileContainer___CSuIE-camelCase {
  background-color: var(--blulet-panel) !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  color: var(--blulet-text) !important;
}

/* Buttons */
.styles__button___2hNZo-camelCase:not(.styles__profileDropdownOption___ljZXD-camelCase),
.styles__buttonFilled___23Dcn-camelCase {
  background-color: transparent !important;
  border: 2px solid var(--blulet-accent) !important;
  color: var(--blulet-text) !important;
  border-radius: 10px;
  transition: background 0.3s;
}

.styles__button___2hNZo-camelCase:hover,
.styles__buttonFilled___23Dcn-camelCase:hover {
  background-color: var(--blulet-accent) !important;
}

/* Inputs and messages */
input, textarea, .toastMessage {
  background-color: #ffffff10 !important;
  color: var(--blulet-text) !important;
  border: 1px solid #ffffff30 !important;
}

/* Dropdowns */
.styles__profileDropdownOption___ljZXD-camelCase,
.styles__selectOption___1RxYj-camelCase {
  background-color: var(--blulet-panel) !important;
  color: var(--blulet-text) !important;
}

/* Hover styles */
.styles__profileDropdownOption___ljZXD-camelCase:hover,
.styles__bazaarItem___Meg69-camelCase:hover {
  background-color: #002a88 !important;
  transform: scale(1.03);
}
`;




    const purpleCSS = `
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
    const DarkPurpleCSS = `
.styles__blooketText___1pMBG-camelCase {
    font-size: 40px;
    font-family: Titan One, sans-serif;
    text-decoration: none;
    color: white;
    filter: drop-shadow(0px 0px 5px white);
    margin-bottom: 20px;
    text-align: center;
}

.styles__background___2J-JA-camelCase {
    background-color: #1a001a !important; /* very dark purple */
}

.styles__bazaarItem___Meg69-camelCase {
    background-color: #330033 !important; /* dark purple */
    transition: 0.2s ease-in-out;
}

.styles__bazaarItem___Meg69-camelCase:hover {
    background-color: #330033 !important;
    transform: scale(1.05);
}

.styles__bazaarItems___KmNa2-camelCase {
    background-color: #100050 !important;
}

.styles__blookGridContainer___AK47P-camelCase {
    background-color: #1a001a !important;
}

.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase {
    background-color: #4b007a !important; /* medium dark purple */
}

.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase {
    background-color: #100050 !important;
    color: #4b007a !important;
}

.styles__cardContainer___NGmjp-camelCase {
    background-color: #4b007a !important;
}

.styles__chatCurrentRoom___MCaV4-camelCase {
    background-color: #3f004d !important;
}

.styles__chatEmojiButton___8RFa2-camelCase {
    background-color: #5a0080 !important;
    transition: 0.2s ease-in-out;
}

.styles__chatEmojiButton___8RFa2-camelCase:hover {
    background-color: #8a76a8 !important;
}

.styles__chatInputContainer___gkR4A-camelCase {
    background-color: #000000 !important;
}

.styles__chatRoomsListContainer___Gk4Av-camelCase {
    background-color: #220022 !important;
}

.styles__chatRoomsTitle___fR4Av-camelCase {
    background-color: #220022 !important;
}

.styles__chatRooms___o5ASb-camelCase {
    background-color: #1a005c !important;
}

.styles__chatUploadButton___g39Ac-camelCase {
    background-color: #30007a !important;
    transition: 0.2s ease-in-out;
}

.styles__chatUploadButton___g39Ac-camelCase:hover {
    background-color: #4b309a !important;
}

.styles__container___1BPm9-camelCase {
    background-color: #30007a !important;
}

.styles__container___2VzTy-camelCase,
.styles__container___3St5B-camelCase,
.styles__containerHeader___3xghM-camelCase,
.styles__containerHeaderInside___2omQm-camelCase,
.styles__containerHeaderRight___3xghM-camelCase,
.styles__containerHeaderRightFriends___3xghM-camelCase,
.styles__editHeaderContainer___2G1ji-camelCase {
    background-color: #1a005f !important;
}

.styles__edge___3eWfq-camelCase {
    background-color: #100050 !important;
}

.styles__formsForm___MvA35-camelCase {
    background-color: #1a005f !important;
}

.styles__header___22Ne2-camelCase {
    background-color: #1a005f !important;
}

.styles__header___2O21B-camelCase,
.styles__headerBadgeBg___12ogR-camelCase,
.styles__headerSide___1r1-b-camelCase {
    background-color: #5200a8 !important; /* bright dark purple */
}

.styles__horizontalBlookGridLine___4SAvz-camelCase {
    background-color: #100050 !important;
}

.styles__infoContainer___2uI-S-camelCase,
.styles__input___2XTSp-camelCase,
.styles__left___9beun-camelCase,
.styles__myTokenAmount___ANKHA-camelCase,
.styles__otherTokenAmount___SEGGS-camelCase,
.styles__profileContainer___CSuIE-camelCase,
.styles__profileDropdownMenu___2jUAA-camelCase {
    background-color: #2a002a !important;
}

.styles__loginButton___1e3jI-camelCase {
    background-color: #fff !important;
    color: #2a002a !important;
}

.styles__profileDropdownOption___ljZXD-camelCase {
    background-color: #3d0073 !important;
}

.styles__profileDropdownOption___ljZXD-camelCase:hover {
    background-color: #111111 !important;
}

.styles__rightButtonInside___14imT-camelCase {
    color: #3d0073 !important;
}

.styles__sidebar___1XqWi-camelCase {
    background-color: #220022 !important;
}

.styles__signUpButton___3_ch3-camelCase {
    background-color: #220022 !important;
    color: #100050 !important;
}

.styles__statContainer___QKuOF-camelCase {
    background-color: #111111 !important;
}

.styles__statsContainer___QnrRB-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__tokenContainer___3yBv--camelCase,
.styles__tradingContainer___B1ABS-camelCase {
    background-color: #220022 !important;
}

.styles__verticalBlookGridLine___rQWaZ-camelCase {
    background-color: #100050 !important;
}

#searchInput {
    background-color: #100050 !important;
}

textarea,
.toastMessage,
input {
    background: linear-gradient(135deg, #3b007f, #000000) !important;
}

hr {
    background-color: #100050 !important;
}
`;



const PurpetPurpleCSS = `
 :root {
    --colors-primary: #3c005d;
    --colors-primary-hover: #2a0043;
    --colors-secondary: #590080;
    --colors-tertiary: #9070a3;
    --colors-background: #4a006e;

    --text-light: #ffffff;
}

.styles__blooketText___1pMBG-camelCase {
    color: var(--text-light) !important;
    filter: drop-shadow(0px 0px 5px var(--text-light));
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
    background-color: var(--colors-primary) !important;
    color: var(--text-light) !important;
}

.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase,
button,
.btn {
    background-color: var(--colors-secondary) !important;
    color: var(--text-light) !important;
}

.styles__button___2hNZo-camelCase:hover,
.styles__buttonFilled___23Dcn-camelCase:hover,
button:hover,
.btn:hover {
    background-color: var(--colors-primary-hover) !important;
    transform: scale(1.03);
}

.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase,
.styles__loginButton___1e3jI-camelCase {
    background-color: var(--text-light) !important;
    color: var(--colors-secondary) !important;
}

.styles__bazaarItem___Meg69-camelCase,
.styles__chatEmojiButton___8RFa2-camelCase,
.styles__chatUploadButton___g39Ac-camelCase {
    background-color: var(--colors-secondary) !important;
    transition: 0.2s ease-in-out;
}

.styles__bazaarItem___Meg69-camelCase:hover,
.styles__chatEmojiButton___8RFa2-camelCase:hover,
.styles__chatUploadButton___g39Ac-camelCase:hover,
.styles__profileDropdownOption___ljZXD-camelCase:hover {
    background-color: var(--colors-primary-hover) !important;
    transform: scale(1.05);
}

.styles__edge___3eWfq-camelCase,
.styles__horizontalBlookGridLine___4SAvz-camelCase,
.styles__verticalBlookGridLine___rQWaZ-camelCase,
hr {
    background-color: var(--text-light) !important;
}

.styles__rightButtonInside___14imT-camelCase {
    color: var(--text-light) !important;
}

#searchInput {
    background-color: var(--colors-tertiary) !important;
    color: var(--text-light) !important;
}
`;

const TrianguletPurpleCSS = `
:root {
  --tri-purple-bg: #9c27b0;
  --tri-purple-panel: #4a0072;
  --tri-purple-button: #ba68c8;
  --tri-text-white: #ffffff;
}

/* Background and containers */
body, #app, .styles__background___2J-JA-camelCase,
.styles__container___1BPm9-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__chatCurrentRoom___MCaV4-camelCase,
.styles__chatRoomsListContainer___Gk4Av-camelCase,
.styles__infoContainer___2uI-S-camelCase {
  background-color: var(--tri-purple-bg) !important;
  background-image: repeating-conic-gradient(rgba(255,255,255,0.02) 0% 25%, transparent 0% 50%) 50% / 100px 100px;
  color: var(--tri-text-white) !important;
}

/* Sidebar and header */
.styles__sidebar___1XqWi-camelCase,
.styles__header___22Ne2-camelCase {
  background-color: var(--tri-purple-panel) !important;
  color: var(--tri-text-white) !important;
}

.styles__sidebar___1XqWi-camelCase *,
.styles__header___22Ne2-camelCase * {
  color: var(--tri-text-white) !important;
}

/* Stat containers */
.styles__statContainer___QKuOF-camelCase,
.styles__statsContainer___QnrRB-camelCase,
.styles__topStatsContainer___dWfN7-camelCase,
.styles__bottomStatsContainer___1O6MJ-camelCase,
.styles__profileContainer___CSuIE-camelCase {
  background-color: var(--tri-purple-panel) !important;
  border-radius: 10px !important;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
  color: var(--tri-text-white) !important;
}

/* Buttons */
.styles__button___2hNZo-camelCase:not(.styles__profileDropdownOption___ljZXD-camelCase),
.styles__buttonFilled___23Dcn-camelCase {
  background-color: var(--tri-purple-button) !important;
  color: var(--tri-text-white) !important;
  border: none !important;
}

.styles__buttonInside___39vdp-camelCase,
.styles__loginButton___1e3jI-camelCase {
  background-color: var(--tri-purple-button) !important;
  color: var(--tri-text-white) !important;
}

/* Inputs and messages */
input, textarea, .toastMessage {
  background-color: #ffffff10 !important;
  color: var(--tri-text-white) !important;
  border: 1px solid #ffffff30 !important;
}

/* Text and links */
*, *::before, *::after {
  color: var(--tri-text-white) !important;
}

a, .styles__link___5UR6_-camelCase {
  color: #e1bee7 !important;
}

/* Dropdown options */
.styles__profileDropdownOption___ljZXD-camelCase,
.styles__selectOption___1RxYj-camelCase {
  background-color: var(--tri-purple-panel) !important;
  color: var(--tri-text-white) !important;
}

/* Hover styles */
.styles__profileDropdownOption___ljZXD-camelCase:hover,
.styles__bazaarItem___Meg69-camelCase:hover {
  background-color: #6a1b9a !important;
  transform: scale(1.05);
}
`;

    const pinkCSS = `
:root {
    --pink: #f702c6;
    --pink-hover: #d401ad;
    --text-white: #ffffff;
    --button-pink: #f702c6;
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
    background-color: var(--pink) !important;
    color: var(--text-white) !important;
}

.styles__bazaarItem___Meg69-camelCase,
.styles__chatEmojiButton___8RFa2-camelCase,
.styles__chatUploadButton___g39Ac-camelCase {
    background-color: var(--pink-hover) !important;
    transition: 0.2s ease-in-out;
}

.styles__bazaarItem___Meg69-camelCase:hover,
.styles__chatEmojiButton___8RFa2-camelCase:hover,
.styles__chatUploadButton___g39Ac-camelCase:hover,
.styles__profileDropdownOption___ljZXD-camelCase:hover {
    background-color: #a8008e !important;
    transform: scale(1.05);
}

.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase {
    background-color: var(--button-pink) !important;
    color: var(--text-white) !important;
}

.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase,
.styles__loginButton___1e3jI-camelCase {
    background-color: var(--text-white) !important;
    color: var(--pink-hover) !important;
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
    background-color: var(--button-pink) !important;
}
`;
const DarkPinkCSS = `
.styles__blooketText___1pMBG-camelCase {
    font-size: 40px;
    font-family: Titan One, sans-serif;
    text-decoration: none;
    color: white;
    filter: drop-shadow(0px 0px 5px white);
    margin-bottom: 20px;
    text-align: center;
}

.styles__background___2J-JA-camelCase {
    background-color: #551a3c !important; /* brighter dark pink */
}

.styles__bazaarItem___Meg69-camelCase {
    background-color: #aa3274 !important;
    transition: 0.2s ease-in-out;
}

.styles__bazaarItem___Meg69-camelCase:hover {
    background-color: #aa3274 !important;
    transform: scale(1.05);
}

.styles__bazaarItems___KmNa2-camelCase {
    background-color: #7f265b !important;
}

.styles__blookGridContainer___AK47P-camelCase {
    background-color: #551a3c !important;
}

.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase {
    background-color: #ee5599 !important; /* brighter medium pink */
}

.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase {
    background-color: #7f265b !important;
    color: #ee5599 !important;
}

.styles__cardContainer___NGmjp-camelCase {
    background-color: #ee5599 !important;
}

.styles__chatCurrentRoom___MCaV4-camelCase {
    background-color: #8a3865 !important;
}

.styles__chatEmojiButton___8RFa2-camelCase {
    background-color: #f066a4 !important;
    transition: 0.2s ease-in-out;
}

.styles__chatEmojiButton___8RFa2-camelCase:hover {
    background-color: #e8a7be !important;
}

.styles__chatInputContainer___gkR4A-camelCase {
    background-color: #000000 !important;
}

.styles__chatRoomsListContainer___Gk4Av-camelCase,
.styles__chatRoomsTitle___fR4Av-camelCase {
    background-color: #7f265b !important;
}

.styles__chatRooms___o5ASb-camelCase {
    background-color: #7d2a57 !important;
}

.styles__chatUploadButton___g39Ac-camelCase {
    background-color: #d8437b !important;
    transition: 0.2s ease-in-out;
}

.styles__chatUploadButton___g39Ac-camelCase:hover {
    background-color: #d87a9e !important;
}

.styles__container___1BPm9-camelCase {
    background-color: #d8437b !important;
}

.styles__container___2VzTy-camelCase,
.styles__container___3St5B-camelCase,
.styles__containerHeader___3xghM-camelCase,
.styles__containerHeaderInside___2omQm-camelCase,
.styles__containerHeaderRight___3xghM-camelCase,
.styles__containerHeaderRightFriends___3xghM-camelCase,
.styles__editHeaderContainer___2G1ji-camelCase {
    background-color: #852a52 !important;
}

.styles__edge___3eWfq-camelCase {
    background-color: #7f265b !important;
}

.styles__formsForm___MvA35-camelCase {
    background-color: #852a52 !important;
}

.styles__header___22Ne2-camelCase {
    background-color: #852a52 !important;
}

.styles__header___2O21B-camelCase,
.styles__headerBadgeBg___12ogR-camelCase,
.styles__headerSide___1r1-b-camelCase {
    background-color: #ff3ea6 !important; /* bright pink */
}

.styles__horizontalBlookGridLine___4SAvz-camelCase {
    background-color: #7f265b !important;
}

.styles__infoContainer___2uI-S-camelCase,
.styles__input___2XTSp-camelCase,
.styles__left___9beun-camelCase,
.styles__myTokenAmount___ANKHA-camelCase,
.styles__otherTokenAmount___SEGGS-camelCase,
.styles__profileContainer___CSuIE-camelCase,
.styles__profileDropdownMenu___2jUAA-camelCase {
    background-color: #7f265b !important;
}

.styles__loginButton___1e3jI-camelCase {
    background-color: #fff !important;
    color: #7f265b !important;
}

.styles__profileDropdownOption___ljZXD-camelCase {
    background-color: #c14e84 !important;
}

.styles__profileDropdownOption___ljZXD-camelCase:hover {
    background-color: #111111 !important;
}

.styles__rightButtonInside___14imT-camelCase {
    color: #c14e84 !important;
}

.styles__sidebar___1XqWi-camelCase {
    background-color: #7f265b !important;
}

.styles__signUpButton___3_ch3-camelCase {
    background-color: #7f265b !important;
    color: #7d2a57 !important;
}

.styles__statContainer___QKuOF-camelCase {
    background-color: #111111 !important;
}

.styles__statsContainer___QnrRB-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__tokenContainer___3yBv--camelCase,
.styles__tradingContainer___B1ABS-camelCase {
    background-color: #7f265b !important;
}

.styles__verticalBlookGridLine___rQWaZ-camelCase {
    background-color: #7f265b !important;
}

#searchInput {
    background-color: #7f265b !important;
}

textarea,
.toastMessage,
input {
    background: linear-gradient(135deg, #f07eb1, #000000) !important;
}

hr {
    background-color: #7f265b !important;
}
`;


const whiteCSS = `
    :root {
        --white-bg: #e6e6e6;
        --white-bg-alt: #f9f9f9;
        --shadow-color: rgba(0,0,0,0.1);
        --text-black: #000000;
        --button-white: #ffffff;
        --button-hover: #dcdcdc;
    }

    /* Make all text black */
    * {
        color: var(--text-black) !important;
    }

    .styles__blooketText___1pMBG-camelCase {
        filter: drop-shadow(0 0 3px var(--shadow-color));
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
        background-color: var(--white-bg) !important;
        box-shadow: 0 0 8px var(--shadow-color) !important;
        border: 1px solid #ccc !important;
    }

    .styles__bazaarItem___Meg69-camelCase,
    .styles__chatEmojiButton___8RFa2-camelCase,
    .styles__chatUploadButton___g39Ac-camelCase {
        background-color: var(--white-bg-alt) !important;
        transition: 0.2s ease-in-out;
        border: 1px solid #ccc !important;
    }

    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__chatEmojiButton___8RFa2-camelCase:hover,
    .styles__chatUploadButton___g39Ac-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
        background-color: var(--button-hover) !important;
        transform: scale(1.05);
        border-color: #bbb !important;
    }

    .styles__button___2hNZo-camelCase,
    .styles__buttonFilled___23Dcn-camelCase {
        background-color: var(--button-white) !important;
        border: 1px solid #ccc !important;
    }

    .styles__buttonInside___39vdp-camelCase,
    .styles__front___vcvuy-camelCase,
    .styles__loginButton___1e3jI-camelCase {
        background-color: var(--text-black) !important;
        color: var(--white-bg) !important;
        border: none !important;
    }

    .styles__edge___3eWfq-camelCase,
    .styles__horizontalBlookGridLine___4SAvz-camelCase,
    .styles__verticalBlookGridLine___rQWaZ-camelCase,
    hr {
        background-color: var(--text-black) !important;
    }

    .styles__rightButtonInside___14imT-camelCase {
        color: var(--text-black) !important;
    }

    #searchInput {
        background-color: var(--button-white) !important;
        border: 1px solid #ccc !important;
    }
`;


const rainbowCSS = `
@keyframes rainbowFade {
  0%   { background-color: #FF0000; }
  16%  { background-color: #FF7F00; }
  33%  { background-color: #FFFF00; }
  50%  { background-color: #00FF00; }
  66%  { background-color: #0000FF; }
  83%  { background-color: #4B0082; }
  100% { background-color: #9400D3; }
}

body, #app,
.styles__background___2J-JA-camelCase,
.styles__app___bM8h5-camelCase,
.styles__sidebar___1XqWi-camelCase,
.styles__header___22Ne2-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__chatCurrentRoom___MCaV4-camelCase,
.styles__chatRoomsListContainer___Gk4Av-camelCase,
.styles__chatRooms___o5ASb-camelCase,
.styles__container___1BPm9-camelCase,
.styles__profileContainer___CSuIE-camelCase,
.styles__statContainer___QKuOF-camelCase,
.styles__friendContainer___3wVox-camelCase,
.styles__bazaarItem___Meg69-camelCase,
.styles__topStatsContainer___dWfN7-camelCase,
.styles__statsContainer___1r5je-camelCase,
.styles__bottomStatsContainer___1O6MJ-camelCase,
.styles__statsContainer___QnrRB-camelCase,
.styles__infoContainer___2uI-S-camelCase,
.styles__profileDropdownOption___ljZXD-camelCase,
.styles__selectOption___1RxYj-camelCase,
.arts__chatModal___4JFsa-camelCase {  /* Added chatModal */
  animation: rainbowFade 15s infinite alternate;
  color: white !important;
}

/* Also apply rainbow animation to popups, modals, toasts */
.popup,
.modal,
.toast,
.tooltip,
[role="dialog"],
[role="alert"],
.styles__toastContainer___o4pCa-camelCase,
.styles__modal___someClass-camelCase,
.styles__popup___someClass-camelCase,
.arts__chatModal___4JFsa-camelCase { /* Added chatModal here too */
  animation: rainbowFade 15s infinite alternate !important;
  background-color: unset !important;
  color: white !important;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(255,255,255,0.5);
}

/* Inputs, buttons, selects inside chat & popups */
textarea, input, select, button {
  background-color: rgba(0, 0, 0, 0.35) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

/* Hover states */
.styles__buttonFilled___23Dcn-camelCase:hover,
.styles__button___2hNZo-camelCase:hover,
.styles__bazaarItem___Meg69-camelCase:hover,
.styles__profileDropdownOption___ljZXD-camelCase:hover,
.styles__selectOption___1RxYj-camelCase:hover {
  background-color: rgba(0, 0, 0, 0.6) !important;
  transform: scale(1.05);
  color: white !important;
}

hr, .styles__edge___3eWfq-camelCase {
  background-color: white !important;
}
`;

    const rainbow2CSS = `
:root {
/* TITLE TEXT */
.styles__blooketText___1pMBG-camelCase {
    font-size: 40px;
    font-family: Titan One, sans-serif;
    text-decoration: none;
    color: white;
    filter: drop-shadow(0px 0px 5px white);
    margin-bottom: 20px;
    text-align: center;
}

/* UNIVERSAL RAINBOW GRADIENT */
.rainbowBG,
.styles__background___2J-JA-camelCase,
.styles__bazaarItem___Meg69-camelCase,
.styles__bazaarItems___KmNa2-camelCase,
.styles__blookGridContainer___AK47P-camelCase,
.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase,
.styles__cardContainer___NGmjp-camelCase,
.styles__chatCurrentRoom___MCaV4-camelCase,
.styles__chatEmojiButton___8RFa2-camelCase,
.styles__chatInputContainer___gkR4A-camelCase,
.styles__chatRoomsListContainer___Gk4Av-camelCase,
.styles__chatRoomsTitle___fR4Av-camelCase,
.styles__chatRooms___o5ASb-camelCase,
.styles__chatUploadButton___g39Ac-camelCase,
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
.styles__statContainer___QKuOF-camelCase,
.styles__statsContainer___QnrRB-camelCase,
.styles__toastContainer___o4pCa-camelCase,
.styles__tokenContainer___3yBv--camelCase,
.styles__tradingContainer___B1ABS-camelCase,
textarea,
input,
#searchInput,
.toastMessage {
    background: linear-gradient(286deg,
        #ff0000, #ff7f00, #ffff00,
        #00ff00, #0000ff, #4b0082, #8f00ff,
        #ff0000, #ff7f00, #ffff00,
        #00ff00, #0000ff, #4b0082, #8f00ff
    ) !important;

    background-size: 300% 300%;
    animation: rainbowShift 10s linear infinite;
}

/* HOVER BRIGHTEN */
.styles__bazaarItem___Meg69-camelCase:hover,
.styles__chatEmojiButton___8RFa2-camelCase:hover,
.styles__chatUploadButton___g39Ac-camelCase:hover,
.styles__profileDropdownOption___ljZXD-camelCase:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
}

/* WHITE UI ELEMENTS */
.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase,
.styles__loginButton___1e3jI-camelCase {
    background-color: #fff !important;
    color: #000 !important;
}

/* WHITE LINES */
.styles__edge___3eWfq-camelCase,
.styles__horizontalBlookGridLine___4SAvz-camelCase,
.styles__verticalBlookGridLine___rQWaZ-camelCase,
hr {
    background-color: #fff !important;
}

/* 🌈 CIRCULAR RAINBOW ANIMATION */
@keyframes rainbowShift {
    0% { background-position: 50% 0%; }
    25% { background-position: 100% 50%; }
    50% { background-position: 50% 100%; }
    75% { background-position: 0% 50%; }
    100% { background-position: 50% 0%; }
}
`;

    const CottonCandyCSS = `
:root {
    --accent: #f000;
    --primary: #f000;
    --secondary: var(--halloween-orange);
    --tertiary: #1a1a1a;
    --halloween-purple: #a67fec;
    --halloween-orange: #2eb7e8;
}

.bb_customCSSBox {
    background-color: var(--primary) !important;
}

.styles__tokenBalanceIcon___3MGhs-camelCase {
    content: url("/content/tokenIcon.webp");
}

.styles__containerHeader___3xghM-camelCase {
    box-shadow: 0 0.208vw rgba(0, 0, 0, 0.1), inset 0 -0.208vw rgba(0, 0, 0, 0.1);
}

.styles__background___2J-JA-camelCase {
    background: linear-gradient(to right, #9796f0, #fbc7d4);
}

.styles__blooksBackground___3oQ7Y-camelCase {
    display: none !important;
    visibility: hidden !important;
    background-image: none !important;
}

.styles__sidebar___1XqWi-camelCase {
    background: linear-gradient(to bottom, rgba(18, 194, 233, 0.4) 0%, rgba(196, 113, 237, 0.4) 50%, rgba(246, 79, 89, 0.4) 100%);
}

.styles__container___1BPm9-camelCase,
.bb_bigModal {
    background: linear-gradient(45deg, rgba(251, 199, 212, 0.9) 0%, rgba(151, 150, 240, 0.9) 100%);
}

.styles__chatInputContainer___gkR4A-camelCase {
    border-radius: 15px;
    background-color: rgba(0, 0, 0, 0.3);
    margin: 4px;
}

.styles__button___1_E-G-camelCase .styles__button___3zpwV-camelCase {
    background-color: var(--primary);
}

.styles__header___2O21B-camelCase {
    background-color: var(--tertiary);
}

.styles__dateRow___1jkQT-camelCase {
    color: #f1f1f1;
}

.bb_roleTag {
    background-color: rgba(0, 0, 0, 0.2);
    border: 1px solid #404040;
}

.styles__contextMenuContainer___3jAmv-camelCase {
    background-color: rgba(0, 0, 0, 0.6);
    border: 2px solid #000;
}

.styles__profileContainer___CSuIE-camelCase,
.styles__tradingContainer___B1ABS-camelCase {
    background-color: rgba(0, 0, 0, 0.3);
}

.styles__left___9beun-camelCase {
    background-color: rgba(111, 0, 111, 0.3);
    border: 3px solid rgba(0, 0, 0, 0.3);
}

.styles__blooketText___1pMBG-camelCase {
    font-family: Titan One !important;
    font-size: 2.383vw !important;
}

.styles__chatMessageButtonContainer___4jCa3-camelCase,
.styles__blookGridContainer___AK47P-camelCase {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    border: 3px solid rgba(0, 0, 0, 0.3);
}

.styles__blookGridContainer___AK47P-camelCase {
    border-width: 5px;
    border-radius: 25px;
}

.styles__verticalBlookGridLine___rQWaZ-camelCase,
.styles__horizontalBlookGridLine___4SAvz-camelCase {
    background-color: #fff;
    border-radius: 5px;
}

.styles__smallChatContainer__RT55a-camelCase {
    margin-bottom: 15px;
    border-radius: 15px;
}

#searchInput {
    background-color: rgba(0, 0, 0, 0.4) !important;
}

#searchInput::placeholder {
    color: #fff;
    opacity: 0.75;
}

.toastMessage {
    background-color: rgba(0, 0, 0, 0.7) !important;
}

.styles__pageButton___1wFuu-camelCase {
    transition: 0.7s cubic-bezier(0, 1.46, 0.58, 1);
}

.styles__pageButton___1wFuu-camelCase:hover {
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
}
`;
    const BlooketCSS = `
    /**
 * @name Blooket
 * @description Simple Blooket theme for blacket.
 * @author DMrD
 */

:root {
    --accent: #f000;
    --primary: #f000;
    --secondary: var(#2eb7e8);
    --tertiary: #1a1a1a;
    --halloween-purple: #a67fec;
    --halloween-orange: #2eb7e8;
}

.styles__background___2J-JA-camelCase,
.styles__sidebar___1XqWi-camelCase {
    background: #0bc2cf;
}

.styles__pageButton___1wFuu-camelCase {
    transition: 0.7s cubic-bezier(0, 1.46, 0.58, 1);
    font-weight: bold;
}

.styles__pageButton___1wFuu-camelCase:hover {
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
}

.styles__blooketText___1pMBG-camelCase {
    font-family: Titan One !important;
    font-size: 2.383vw !important;
}

.styles__tokenBalanceIcon___3MGhs-camelCase {
    content: url("/content/tokenIcon.webp");
}

.styles__contextMenuContainer___3jAmv-camelCase {
    background-color: var(--secondary);
    border-color: #fff;
    border-style: solid;
    border-radius: 6px;
    border-width: 3px;
    font-weight: bold;
}
`;
    const ChocoletBrownCSS = `
:root {
    --earth-base: #2d1c10;
    --earth-base-hover: #432a16;
    --earth-light: #5a3921;

    --earth-accent-green: #0e8719;
    --earth-accent-green-dark: #1a340c;

    --earth-accent-red: #ce1313;
    --earth-gold: gold;

    --text-white: #ffffff;
    --text-dark: #3a3a3a;
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
    background-color: var(--earth-base) !important;
    color: var(--text-white) !important;
}


.styles__bazaarItem___Meg69-camelCase,
.styles__chatEmojiButton___8RFa2-camelCase,
.styles__chatUploadButton___g39Ac-camelCase {
    background-color: var(--earth-base-hover) !important;
    transition: 0.2s ease-in-out;
}

.styles__bazaarItem___Meg69-camelCase:hover,
.styles__chatEmojiButton___8RFa2-camelCase:hover,
.styles__chatUploadButton___g39Ac-camelCase:hover,
.styles__profileDropdownOption___ljZXD-camelCase:hover {
    background-color: var(--earth-light) !important;
    transform: scale(1.05);
}

.styles__button___2hNZo-camelCase,
.styles__buttonFilled___23Dcn-camelCase {
    background-color: var(--earth-accent-green-dark) !important;
    color: var(--text-white) !important;
}

.styles__button___2hNZo-camelCase:hover,
.styles__buttonFilled___23Dcn-camelCase:hover {
    background-color: var(--earth-accent-green) !important;
    transform: scale(1.05);
}


.styles__buttonInside___39vdp-camelCase,
.styles__front___vcvuy-camelCase,
.styles__loginButton___1e3jI-camelCase {
    background-color: var(--text-white) !important;
    color: var(--earth-base-hover) !important;
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
    background-color: var(--earth-light) !important;
    color: var(--text-white) !important;
}
`;

  const HalloweenCSS = `
    :root {
    --accent: #0b0b0b;
    --primary: #000;
    --secondary: var(--halloween-orange);
    --tertiary: #1a1a1a;

    --halloween-purple: #512888;
    --halloween-orange: #E66C2C;
}

.styles__blooketText___1pMBG-camelCase {
    font-size: 2.783vw !important;
    font-family: Creepster, sans-serif !important;
}

a {
    color: lightblue;
}

.toastMessage {
    position: fixed;
    bottom: 0;
    right: 0;
    text-align: right;
    width: fit-content;
    padding: 0.521vw;
    margin-bottom: 0.521vw;
    border-radius: 0.365vw 0.000vw 0.000vw 0.365vw;
    background-color: var(--primary);
    box-shadow: inset 0 -0.313vw rgba(0, 0, 0, 0.2);
    transition: 0.25s;
    z-index: 14;
}

@keyframes heartbeat {
    0% {
        transform: scale(0.8);
    }

    5% {
        transform: scale(0.9);
    }

    10% {
        transform: scale(0.8);
    }

    15% {
        transform: scale(1);
    }

    50% {
        transform: scale(0.8);
    }

    100% {
        transform: scale(0.8);
    }
}

.styles__toastContainer___o4pCa-camelCase {
    position: fixed;
    width: 20.833vw;
    height: 6.510vw;
    background-color: var(--primary);
    right: 0;
    top: 3.646vw;
    z-index: 998;
    border-radius: 0.521vw 0.000vw 0.000vw 0.521vw;
    box-shadow: inset 0 -0.260vw rgba(0, 0, 0, 0.2);
    display: flex;
    animation: styles__toastContainer___o4pCa-camelCase 0.25s linear;
    cursor: pointer;
}

.styles__toastIcon___vna3A-camelCase {
    position: relative;
    bottom: 0.156vw;
    left: 0.260vw;
    transform: scale(0.9);
}

.styles__toastTitle___39Rac-camelCase {
    font-size: 1.563vw;
    color: white;
    position: absolute;
    top: 0.260vw;
    left: 5.990vw;
}

.styles__toastMessage___xar43-camelCase {
    position: relative;
    color: white;
    top: 2.344vw;
    left: 0.417vw;
    overflow: hidden;
    height: 3.125vw;
    width: 14.583vw;
    filter: opacity(0.5);
    font-size: 0.83vw;
}

@keyframes styles__toastContainer___o4pCa-camelCase {
    0% {
        transform: translateX(100%);
    }

    100% {
        transform: translateX(0%);
    }
}

@keyframes flyIn {
    0% {
        opacity: 0;
        transform: translateX(100%);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes flyOut {
    0% {
        opacity: 1;
        transform: translateX(0%);
    }

    100% {
        opacity: 1;
        transform: translateX(100%);
    }
}

.arts__modal___VpEAD-camelCase {
    display: block;
    position: fixed;
    z-index: 15;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.6);
}

.loaderModal {
    display: flex;
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.6);
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.loader {
    transform: scale(200%);
}

.styles__inputContainer___t9pz0-camelCase {
    border: 0.104vw solid rgba(0, 0, 0, 0.17);
    border-radius: 0.313vw;
    width: 90%;
    height: 45;
}

.loaderBox {
    width: 1.823vw;
    height: 2.096vw;
    -webkit-animation: loading 2s linear infinite;
    animation: loading 2s linear infinite;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0.208vw;
    z-index: 3;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

.loaderBlook {
    width: 100%;
    height: 100%;
    -o-object-fit: contain;
    object-fit: contain;
    overflow-y: none;
    filter: drop-shadow(0.000vw 0.000vw 0.260vw #000000);
}

.loaderText {
    color: white;
    margin-bottom: 6.250vw;
    text-align: center;
    margin-right: 7.292vw;
}

.blookContainerLoader {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    outline: none;
    position: relative;
    display: flex;
    justify-content: flex-end;
}

@-webkit-keyframes loading {
    4.25% {
        border-bottom-left-radius: 0.208vw;
        border-bottom-right-radius: 0.208vw;
    }

    6.25% {
        transform: translateY(0.469vw) rotate(22.5deg);
    }

    12.5% {
        transform: translateY(0.938vw) scaleY(0.9) rotate(45deg);
        border-bottom-right-radius: 1.953vw;
    }

    18.75% {
        transform: translateY(0.469vw) rotate(67.5deg);
    }

    25% {
        transform: translateY(0) rotate(90deg);
    }

    29.25% {
        border-bottom-right-radius: 0.208vw;
        border-top-right-radius: 0.208vw;
    }

    31.25% {
        transform: translateY(0.469vw) rotate(112.5deg);
    }

    37.5% {
        transform: translateY(0.938vw) scaleY(0.9) rotate(135deg);
        border-top-right-radius: 1.953vw;
    }

    43.75% {
        transform: translateY(0.469vw) rotate(157.5deg);
    }

    50% {
        transform: translateY(0) rotate(180deg);
    }

    54.25% {
        border-top-right-radius: 0.208vw;
        border-top-left-radius: 0.208vw;
    }

    56.25% {
        transform: translateY(0.469vw) rotate(202.5deg);
    }

    62.5% {
        transform: translateY(0.938vw) scaleY(0.9) rotate(225deg);
        border-top-left-radius: 1.953vw;
    }

    68.75% {
        transform: translateY(0.469vw) rotate(247.5deg);
    }

    75% {
        border-top-left-radius: 0.208vw;
        transform: translateY(0) rotate(270deg);
    }

    79.25% {
        border-bottom-left-radius: 0.208vw;
    }

    81.25% {
        transform: translateY(0.469vw) rotate(292.5deg);
    }

    87.5% {
        transform: translateY(0.938vw) scaleY(0.9) rotate(315deg);
        border-bottom-left-radius: 1.953vw;
    }

    93.75% {
        transform: translateY(0.469vw) rotate(337.5deg);
    }

    to {
        transform: translateY(0) rotate(1turn);
    }
}

@keyframes loading {
    4.25% {
        border-bottom-left-radius: 0.208vw;
        border-bottom-right-radius: 0.208vw;
    }

    6.25% {
        transform: translateY(0.469vw) rotate(22.5deg);
    }

    12.5% {
        transform: translateY(0.938vw) scaleY(0.9) rotate(45deg);
        border-bottom-right-radius: 1.953vw;
    }

    18.75% {
        transform: translateY(0.469vw) rotate(67.5deg);
    }

    25% {
        transform: translateY(0) rotate(90deg);
    }

    29.25% {
        border-bottom-right-radius: 0.208vw;
        border-top-right-radius: 0.208vw;
    }

    31.25% {
        transform: translateY(0.469vw) rotate(112.5deg);
    }

    37.5% {
        transform: translateY(0.938vw) scaleY(0.9) rotate(135deg);
        border-top-right-radius: 1.953vw;
    }

    43.75% {
        transform: translateY(0.469vw) rotate(157.5deg);
    }

    50% {
        transform: translateY(0) rotate(180deg);
    }

    54.25% {
        border-top-right-radius: 0.208vw;
        border-top-left-radius: 0.208vw;
    }

    56.25% {
        transform: translateY(0.469vw) rotate(202.5deg);
    }

    62.5% {
        transform: translateY(0.938vw) scaleY(0.9) rotate(225deg);
        border-top-left-radius: 1.953vw;
    }

    68.75% {
        transform: translateY(0.469vw) rotate(247.5deg);
    }

    75% {
        border-top-left-radius: 0.208vw;
        transform: translateY(0) rotate(270deg);
    }

    79.25% {
        border-bottom-left-radius: 0.208vw;
    }

    81.25% {
        transform: translateY(0.469vw) rotate(292.5deg);
    }

    87.5% {
        transform: translateY(0.938vw) scaleY(0.9) rotate(315deg);
        border-bottom-left-radius: 1.953vw;
    }

    93.75% {
        transform: translateY(0.469vw) rotate(337.5deg);
    }

    to {
        transform: translateY(0) rotate(1turn);
    }
}

@keyframes chatAnimate__spin {
    0% {
        transform: rotate(0deg);
    }

    30% {
        transform: rotate(-25deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

@keyframes chatAnimate__glow {
    0% {
        filter: drop-shadow(0.000vw 0.000vw 0.000vw black);
    }

    50% {
        filter: drop-shadow(0.000vw 0.052vw 0.260vw white);
    }

    100% {
        filter: drop-shadow(0.000vw 0.000vw 0.000vw black);
    }
}


@keyframes chatAnimate__scale {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes chatAnimate__flip {
    0% {
        transform: rotateY(0deg) scale(1);
    }

    50% {
        transform: rotateY(360deg) scale(1.2);
        perspective: 1000;
    }

    100% {
        transform: rotateY(1080deg) scale(1);
    }
}
`;



    // Function to inject/update the theme CSS
function applyTheme(theme) {
    let styleEl = document.getElementById('blacket-theme-style');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'blacket-theme-style';
        document.head.appendChild(styleEl);
    }

    // Handle custom color theme
    if (theme === 'Custom') {
        let customColor = localStorage.getItem('customThemeColor') || '#00ffff';
        const userInput = prompt('Enter a hex color (e.g. #ff8800):', customColor);
        if (userInput && /^#([0-9A-Fa-f]{3}){1,2}$/.test(userInput)) {
            customColor = userInput;
            localStorage.setItem('customThemeColor', customColor);
        }
        styleEl.textContent = generateCustomCSS(customColor);
        return;
    }
        switch (theme) {
            case 'Amoled': styleEl.textContent = amoledCSS; break;
            case 'Red': styleEl.textContent = redCSS; break;
            case 'Dark Red': styleEl.textContent = DarkRedCSS; break;
            case 'Orange': styleEl.textContent = orangeCSS; break;
            case 'Dark Orange': styleEl.textContent = DarkOrangeCSS; break;
            case 'Yellow': styleEl.textContent = yellowCSS; break;
            case 'Dark Yellow': styleEl.textContent = DarkYellowCSS; break;
            case 'Green': styleEl.textContent = greenCSS; break;
            case 'Dark Green': styleEl.textContent = DarkGreenCSS; break;
            case 'Blue': styleEl.textContent = blueCSS; break;
            case 'Dark Blue': styleEl.textContent = DarkBlueCSS; break;
            case 'Purple': styleEl.textContent = purpleCSS; break;
            case 'Dark Purple': styleEl.textContent = DarkPurpleCSS; break;
            case 'Pink': styleEl.textContent = pinkCSS; break;
            case 'Dark Pink': styleEl.textContent = DarkPinkCSS; break;
            case 'White': styleEl.textContent = whiteCSS; break;
            case 'Rainbow': styleEl.textContent = rainbowCSS; break;
            case 'Rainbow2': styleEl.textContent = rainbow2CSS; break;
            case 'Cotton Candy': styleEl.textContent = CottonCandyCSS; break;
            case 'Blooket': styleEl.textContent = BlooketCSS; break;
            case 'Halloween': styleEl.textContent = HalloweenCSS; break;
            case 'Legacy': styleEl.textContent = ''; initLegacyParticles(); break;
            case 'Triangulet Green': styleEl.textContent = TrianguletGreenCSS; break;
            case 'Triangulet Purple': styleEl.textContent =TrianguletPurpleCSS; break;
            case 'Blulet Blue': styleEl.textContent =BluletBlueCSS; break;
            case 'Purpet Purple': styleEl.textContent =PurpetPurpleCSS; break;
            case 'Chocolet Brown': styleEl.textContent =ChocoletBrownCSS; break;
            default: styleEl.textContent = ''; break; // Default clears styles
        }
    }

function generateCustomCSS(color) {
    return `
    :root {
        --custom-color: ${color};
        --custom-text: #ffffff;
    }

    /* Main backgrounds */
    body, #app,
    .styles__background___2J-JA-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__containerHeader___3xghM-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__tokenContainer___3yBv--camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase,
    .toastMessage {
        background-color: var(--custom-color) !important;
        color: var(--custom-text) !important;
    }

    /* Buttons */
    .styles__button___2hNZo-camelCase,
    .styles__buttonFilled___23Dcn-camelCase {
        background-color: var(--custom-color) !important;
        color: var(--custom-text) !important;
        border: none !important;
    }

    /* Inputs, selects, textareas */
    input, select, textarea {
        background-color: var(--custom-color) !important;
        color: var(--custom-text) !important;
        border: 1px solid var(--custom-text) !important;
    }

    /* Dropdown menu options */
    .styles__profileDropdownOption___ljZXD-camelCase,
    .styles__bazaarItem___Meg69-camelCase {
        background-color: var(--custom-color) !important;
        color: var(--custom-text) !important;
        border-radius: 4px;
    }

    .styles__bazaarItem___Meg69-camelCase:hover,
    .styles__profileDropdownOption___ljZXD-camelCase:hover {
        background-color: rgba(0, 0, 0, 0.3) !important;
        transform: scale(1.05);
    }

    /* Headers, navbars */
    .styles__headerRow___1tdPa-camelCase,
    .styles__infoContainer___2uI-S-camelCase {
        background-color: var(--custom-color) !important;
        color: var(--custom-text) !important;
    }

    /* Borders and dividers */
    hr, .styles__edge___3eWfq-camelCase {
        background-color: var(--custom-text) !important;
    }

    /* Scrollbar styling */
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    ::-webkit-scrollbar-track {
        background: var(--custom-color);
    }
    ::-webkit-scrollbar-thumb {
        background: var(--custom-text);
        border-radius: 10px;
    }

    /* Placeholder text */
    ::placeholder {
        color: #cccccc !important;
    }
    `;
}

   function initLegacyParticles() {
    if (document.getElementById('particles-js')) return;

    const container = document.createElement('div');
    container.id = 'particles-js';
    Object.assign(container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '-1',
        pointerEvents: 'none',
        opacity: '1',
    });
    document.body.prepend(container);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://web.archive.org/web/20220406180854cs_/https://blacket.org/particles.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://web.archive.org/web/20220406180854js_/https://blacket.org/particles.js';
    script.onload = () => {
        particlesJS("particles-js", {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle" },
                opacity: { value: 0.5 },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1
                },
                move: {
                    enable: true, speed: 6, direction: "none", random: false,
                    straight: false, out_mode: "out"
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });

        const style = document.createElement('style');
        style.textContent = `
            body, #app {
                background-color: transparent !important;
           }
    .styles__background___2J-JA-camelCase,
    .styles__sidebar___1XqWi-camelCase,
    .styles__container___1BPm9-camelCase,
    .styles__header___22Ne2-camelCase,
    .styles__toastContainer___o4pCa-camelCase,
    .styles__chatCurrentRoom___MCaV4-camelCase,
    .styles__chatRoomsListContainer___Gk4Av-camelCase,
    .styles__chatRooms___o5ASb-camelCase,
    .styles__chatInputContainer___gkR4A-camelCase,
    .styles__chatMessagesContainer___8J3rW-camelCase,
    .styles__profileContainer___CSuIE-camelCase,
    .styles__statContainer___QKuOF-camelCase,
    .styles__topStatsContainer___dWfN7-camelCase,
    .styles__statsContainer___1r5je-camelCase,
    .styles__bottomStatsContainer___1O6MJ-camelCase,
    .styles__statsContainer___QnrRB-camelCase {
        background-color: transparent !important;
        backdrop-filter: none !important;
    }
        #particles-js {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1 !important;
        pointer-events: none;
        opacity: 1;
    }
        `;
        document.head.appendChild(style);
    };
    document.head.appendChild(script);
}



    // Immediately apply saved theme on script load to persist on every page
    const savedTheme = localStorage.getItem('blacketTheme') || 'Default';
    applyTheme(savedTheme);

    // Add the cloned Additions panel with the theme selector dropdown inside the settings sidebar
function addClonedAdditionsPanel() {
    if (document.getElementById("additions-panel")) return; // Already added

    // Find the profile panel among all containers
    const profilePanel = Array.from(document.querySelectorAll(".styles__infoContainer___2uI-S-camelCase"))
        .find(el => el.innerText.includes("Username:") && el.innerText.includes("Role:"));

    if (!profilePanel) {
        setTimeout(addClonedAdditionsPanel, 250);
        return;
    }

    // Parent container where all info containers live
    const parentContainer = profilePanel.parentElement;
    if (!parentContainer) {
        setTimeout(addClonedAdditionsPanel, 250);
        return;
    }

    const clonedPanel = profilePanel.cloneNode(true);
    clonedPanel.id = "additions-panel";

    clonedPanel.innerHTML = `
        <div class="styles__headerRow___1tdPa-camelCase">
            <i class="fas fa-paintbrush-alt styles__headerIcon___1ykdN-camelCase" aria-hidden="true" style="color: #8f8f8f;"></i>
            <div class="styles__infoHeader___1lsZY-camelCase" style="color: #fff;">Additions</div>
        </div>
        <div style="font-size: 20px; color: #fff;">
            Change Theme: <br>
            <select id="themeselect" class="styles__link___5UR6_-camelCase"
                style="background-color: #2f2f2f; color: #fff; border: 1px solid #8f8f8f; outline: none;
                padding: 5px 10px; border-radius: 5px; font-size: 15px; cursor: pointer;
                margin-top: 5px; margin-bottom: 5px; margin-left: 5px;">
                <option>Default</option>
                <option>Amoled</option>
                <option>Red</option>
                <option>Dark Red</option>
                <option>Orange</option>
                <option>Dark Orange</option>
                <option>Yellow</option>
                <option>Dark Yellow</option>
                <option>Green</option>
                <option>Dark Green</option>
                <option>Blue</option>
                <option>Dark Blue</option>
                <option>Purple</option>
                <option>Dark Purple</option>
                <option>Pink</option>
                <option>Dark Pink</option>
                <option>White</option>
                <option>Rainbow</option>
                <option>Rainbow2</option>
                <option>Cotton Candy</option>
                <option>Blooket</option>
                <option>Halloween</option>
                <option>Custom</option>
                <option>Legacy</option>
                <option>Triangulet Green</option>
                <option>Triangulet Purple</option>
                <option>Blulet Blue</option>
                <option>Purpet Purple</option>
                <option>Chocolet Brown</option>
            </select>
        </div>
    `;

    parentContainer.appendChild(clonedPanel);

    const savedTheme = localStorage.getItem('blacketTheme') || 'Default';
    const themeSelect = document.getElementById('themeselect');
    themeSelect.value = savedTheme;

    themeSelect.addEventListener('change', () => {
        const selected = themeSelect.value;
        localStorage.setItem('blacketTheme', selected);
        location.reload();
    });
}

// Start the process, retry until ready
addClonedAdditionsPanel();


})();