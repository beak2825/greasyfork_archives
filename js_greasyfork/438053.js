// ==UserScript==
// @name            Browse your interests without registration
// @name:it         Naviga i tuoi interessi senza registrazione
// @namespace       http://andrealazzarotto.com/
// @description     Find more ideas on the web without login/registration
// @description:it  Trova altre idee sul web senza accedere o registrarti
// @version         2.4
// @include         https://www.pinterest.tld/*
// @copyright       2014+, Andrea Lazzarotto
// @require         https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js
// @require         https://greasyfork.org/scripts/35383-gm-addstyle-polyfill/code/GMaddStyle%20Polyfill.js?version=231590
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438053/Browse%20your%20interests%20without%20registration.user.js
// @updateURL https://update.greasyfork.org/scripts/438053/Browse%20your%20interests%20without%20registration.meta.js
// ==/UserScript==
 
/* Greasemonkey 4 wrapper */
if (typeof GM !== "undefined" && !!GM.addStyle)
    GM_addStyle = GM.addStyle;
 
$(document).ready(function () {
    // We need to start from a page with a search bar
    if (location.pathname == "/")
        location.href = "https://" + location.host + "/search/pins/?q=pin&rs=typed";
 
    GM_addStyle(`
        .UnauthBanner, body>.Modal, .ModalManager>.Modal, .Closeup__wrapper>div[style*='fixed'], iframe[src*=smartlock], div[data-test-id=signup] {
            display: none !important;
        }
 
        .noScroll {
            overflow: auto !important;
        }
 
        div[style*='cubic-bezier'], div[style*='fixed']>div[style*='opacity: 0.5'], div[style*='background-color: rgba(0, 0, 0, 0.6);'], .FullPageModal__scroller {
            display: none !important;
        }
 
        div.gridContainer>div, .Grid {
            height: auto !important;
        }
 
        :root body { overflow-y: auto !important; }
    `);
});