// ==UserScript==
// @name         Bonusbank Enhancement Suite
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds features to enhance your bonusbank.com.au experience.
// @license      GPLv3
// @author       Chris Aprea
// @match        https://bonusbank.com.au/matched-betting-software-lite/
// @match        https://bonusbank.com.au/matched-betting-software/
// @icon         https://www.google.com/s2/favicons?sz=64&domain_url=https://bonusbank.com.au/
// @resource     TOASTIFY_CSS https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.2/toastify.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.11.2/toastify.min.js
// @downloadURL https://update.greasyfork.org/scripts/439314/Bonusbank%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/439314/Bonusbank%20Enhancement%20Suite.meta.js
// ==/UserScript==

/* globals ClipboardJS, Toastify */

(function() {
    'use strict';

    let isModalOpen = false;
    let lastIsModalOpen = false;
    let lastBet = '';

    const toastifyCss = GM_getResourceText( 'TOASTIFY_CSS' );
    GM_addStyle( toastifyCss );

    document.addEventListener( 'click', e => {
        const eventTarget = e.target;

        if ( ! [ 'sr', 'snr' ].includes( eventTarget.parentElement.className ) ) {
            return;
        }

        lastBet = eventTarget.parentElement.parentElement.querySelector( '.bet' ).textContent;
    } );

    setInterval( () => {
        isModalOpen = !! document.querySelector( '.ReactModal__Content' );

        if ( isModalOpen === lastIsModalOpen ) {
            return;
        }

        lastIsModalOpen = isModalOpen;

        if ( ! isModalOpen ) {
            return;
        }

        const modalContent = document.querySelector( '.ReactModal__Content' );
        const stakeElem = document.querySelector( '[name="stake"]' );
        const backOddsElem = document.querySelector( '[name="backOdds"]' );
        const layOddsElem = document.querySelector( '[name="layOdds"]' );
        const layCommissionElem = document.querySelector( '[name="layCommission"]' );

        const copyBetToClipboardElement = document.createElement( 'button' );
        copyBetToClipboardElement.innerText = 'Copy bet to clipboard';
        copyBetToClipboardElement.className = 'btn btn-secondary';
        Object.assign( copyBetToClipboardElement.style, {
            display: 'block',
            margin: '20px auto 0',
        } );

        new ClipboardJS(
            copyBetToClipboardElement,
            {
                text: () => {
                    const betSummaryString = document.querySelector( '.css-pdgl6h' ).textContent;
                    const [mode, sport, event, bookmaker, market] = betSummaryString.split( ' - ' );

                    const currentDate = new Date();
                    const data = [
                        `${currentDate.getDate().toString().padStart(2,'0')}-${(currentDate.getMonth() + 1).toString().padStart(2,'0')}-${currentDate.getFullYear().toString().substr(-2)}`,
                        bookmaker,
                        mode.startsWith( 'SNR' ) ? 'Bonus Bet SNR' : 'Wagering Bet',
                        event,
                        lastBet,
                        backOddsElem.value,
                        layOddsElem.value,
                        stakeElem.value,
                        modalContent.querySelector( '.css-meywbh b' ).textContent.substr( 1 ),
                        `${layCommissionElem.value}%`
                    ];

                    return data.join( '\t' );
                }
            }
        ).on( 'success', () => {
            Toastify( {
                text: 'Bet copied to clipboard',
                duration: 3000,
                gravity: 'bottom',
                position: 'left',
            } ).showToast();
        } );

        modalContent.insertAdjacentElement( 'beforeend', copyBetToClipboardElement );
        modalContent.style.height = `calc( ${modalContent.style.height} + ${copyBetToClipboardElement.offsetHeight + parseInt( window.getComputedStyle(copyBetToClipboardElement).marginTop )}px`;
    }, 500 );
})();
