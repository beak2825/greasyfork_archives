// ==UserScript==
// @name         SWC Events Clipboard
// @namespace    https://www.swcombine.com/
// @version      1.2
// @description  Adds an "Copy" button to the SWC Events page, which adds the event details to the clipboard.
// @author       code-syl
// @match        https://www.swcombine.com/members/events/index.php*
// @icon         https://www.swcombine.com/favicon.ico
// @grant        none
// @license      MIT
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @downloadURL https://update.greasyfork.org/scripts/457041/SWC%20Events%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/457041/SWC%20Events%20Clipboard.meta.js
// ==/UserScript==
/* @require      https://code.jquery.com/jquery-3.6.3.min.js /* <-- enable when not using waitForKeyElements.js */

(function() {
    'use strict';

    const styles = `
        .eventmsg:not(:hover) #alani-copy { 
            display: none;
        }

        .eventmsg:hover #alani-copy,
        .eventpriv {
            align-self: center;
        }
        
        .eventpriv img {
            padding-top: 0 !important;
        }`;

    let styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const onCopyClick = (jNode) => {
        const swcDateTime = jNode.find('.eventdate')[0].outerText;
        const eventText = jNode.find('.eventtext')[0].outerText;

        navigator.clipboard.writeText(swcDateTime + ' ' + eventText)
            .then(() => { console.info('Copied event details to clipboard.'); })
            .catch(error => { console.error('Failed to copy event details to clipboard: ', error); });
    };

    const addCopyButton = (jNode) => {
        let button = document.createElement('button');
            button.id = 'alani-copy';
            button.textContent = 'Copy';
            button.style.height = '2rem';
            button.addEventListener('click', () => onCopyClick(jNode));

        jNode.find('.eventpriv')
             .before(button);
    }

    waitForKeyElements('.eventmsg', addCopyButton);
})();