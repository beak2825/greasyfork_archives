// ==UserScript==
// @name         Blu-Ray News
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display posts from Blu-Ray news.
// @author       You
// @match        https://passthepopcorn.me/index.php
// @icon         https://www.google.com/s2/favicons?domain=passthepopcorn.me
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/434320/Blu-Ray%20News.user.js
// @updateURL https://update.greasyfork.org/scripts/434320/Blu-Ray%20News.meta.js
// ==/UserScript==

( async () => {
    'use strict';

    GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.blu-ray.com/news/",
    onload: function (response) {

        const mainColumn = document.querySelector( '.main-column' );

       // console.log(response.responseText, 'finish');
        const openStart = '<td width="728" style="padding-top: 3px">';
        const openEnd = '</td>';
        const offset = openStart.length;

        const thead = document.querySelector( '.main-column table thead' );
        const newHead = thead.cloneNode(true);

        const p = response.responseText.indexOf( openStart ) + openStart.length;
        const res = response.responseText.substring( p, response.responseText.indexOf( openEnd, p ) );

        const table = document.createElement( 'table' );



        table.id = 'blu-ray-news';
        table.classList.add( 'table', 'table--panel-like', 'table--bordered', 'hidden' );

        mainColumn.insertBefore( table, document.getElementById( 'news' ) );
        table.innerHTML = '<td>' + res + '</td>';

        const divs = table.querySelectorAll( 'div' );
        const images = table.querySelectorAll( 'img' );
        const lineBreaks = table.querySelectorAll( 'br' );
        divs.forEach( ( div, index ) => {
            div.style.width = '100%';
            if ( index === 1 ) {
                div.style.border = 'none';
                div.style.margin = '0';
            }
        } );
        images.forEach( image => {
            image.style.display = 'none';
        } );

        lineBreaks[0].style.display = 'none';
        lineBreaks[1].style.display = 'none';

        const style = document.createElement( 'style' );

        table.prepend( newHead );

        const tableLinks = table.querySelectorAll( 'a' );
        tableLinks.forEach( tableLink => {
            tableLink.target = '_blank';
        } );

        document.head.appendChild( style );
        style.innerHTML = 'a + br { display: none } #blu-ray-news h2 { display: none; } #blu-ray-news div:first-of-type { border: none } #blu-ray-news div:first-of-type h3 { margin: 0 } #blu-ray-news div:nth-child(2) { margin: 0; border-top: 0 } #blu-ray-news br:first-child, #blu-ray-news br:nth-child(2) { display: none } #blu-ray-news h3 { margin: .5rem 0 0 } #blu-ray-news small { margin-bottom: .15rem 0 .5rem; display: block } #blu-ray-news div { border-top: 1px solid rgba(0,0,0,0.15); margin-top: .5rem } .table-button { font-size: 8pt; border: none; padding: 0; background: transparent; display: inline }';

        const allTables = mainColumn.querySelectorAll( '.main-column > table' );
        const allTableHeaders = mainColumn.querySelectorAll( 'thead th' );
        const allTableHeaderLinks = mainColumn.querySelectorAll( 'thead th a' );

        allTableHeaderLinks.forEach( tableHeaderLink => {
            if ( tableHeaderLink.classList.contains( 'simple-tabs__link' ) ) {

                tableHeaderLink.addEventListener( 'click', () => {
                    table.classList.add( 'hidden' );
                    const toggleNewsButtons = document.querySelectorAll( '[data-toggle-news]' );
                    toggleNewsButtons.forEach( toggleNewsButton => {
                        const reference = tableHeaderLink.getAttribute( 'onClick' );
                        const shownTable = document.querySelector( '.main-column > table:not( .hidden )' );
                        const shownLink = shownTable.querySelector( `[onClick="${reference}"]` );
                        if ( shownLink ) {
                            shownLink.classList.add( 'simple-tabs__link--active' );
                        }
                        toggleNewsButton.classList.remove( 'simple-tabs__link--active' );
                    } );
                });
            }
        });

        allTableHeaders.forEach( tableHeader => {
            const border = document.createElement( 'span' );
            border.textContent = '| ';
            const toggleNewSection = document.createElement( 'button' );
            toggleNewSection.classList.add( 'table-button' );
            toggleNewSection.setAttribute( 'data-toggle-news', 'true' );
            toggleNewSection.textContent = 'Blu-Ray News';
            tableHeader.append( border );
            tableHeader.append( toggleNewSection );
        } );

        const toggleNewsButtons = document.querySelectorAll( '[data-toggle-news]' );

        toggleNewsButtons.forEach( toggleNewsButton => {
            toggleNewsButton.addEventListener( 'click', () => {
                allTableHeaderLinks.forEach( tableHeaderLink => {
                    tableHeaderLink.classList.remove( 'simple-tabs__link--active' );
                } );
                toggleNewsButtons.forEach( toggleNewsButton => {
                    toggleNewsButton.classList.add( 'simple-tabs__link--active' );
                } );
                allTables.forEach( table => {
                    table.classList.add( 'hidden' );
                } );
                table.classList.remove( 'hidden' );
            })
        });

    }
    });


})();