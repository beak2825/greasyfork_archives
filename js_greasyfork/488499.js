// ==UserScript==
// @name         Melee Decklist Dump
// @namespace    https://melee.gg/
// @version      0.06
// @description  List out decklists to console
// @author       Peter Creutzberger
// @match        */Tournament/View/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melee.gg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488499/Melee%20Decklist%20Dump.user.js
// @updateURL https://update.greasyfork.org/scripts/488499/Melee%20Decklist%20Dump.meta.js
// ==/UserScript==

(function() {
    'use strict';

    createDataRequestButton();

    function createDataRequestButton() {
        const div = document.createElement('div');
        div.innerHTML = ('<button class="dataRequestButton" style="position:fixed;top:0;left:0;z-index:9999;width:auto;height:20px;padding:0 5px 0 0;background:#00b;color:#fff;font-weight:bold;" onclick="beginDisplay()">Display Decklists</button>');
        document.body.prepend(div);
    }

    const writeDecklistContainer = () => {
        const div = document.createElement('div');
        div.innerHTML = ('<div class="decklistContainer" style="position:fixed;bottom:20px;left:0;z-index:8888;width:auto;height:200px;max-height:600px;overflow-y:scroll;padding:0 5px 0 0;border:1px solid #d00;background:#fff;color:#000;"></div>');
        document.body.prepend(div);

    }

    const startDecklistDisplay = () => {
        const div = document.getElementsByClassName('decklistContainer')[0];
        const decklistsFromTable = Array.from( document.querySelector("#tournament-standings-table").getElementsByTagName('tr') )
        if ( decklistsFromTable.length > 0 ) {
            div.innerHTML += `<strong><em>Deck Population data found in console.</em></strong><br />`;
            const decklistArr = processDecklists( getDeckLists( decklistsFromTable ), '', true );
            writeDecklists( div, decklistArr );
            displayDecklistPopulation( countDeckPopulation( processDecklists( decklistArr, '-', false ) ) );
        } else {
            div.innerHTML += 'No decklists found. Try again. :(';
        }
    }

    const getDeckLists = ( decklistArr ) => {
        return decklistArr.reduce( (acc, curr) => {
            const currentRow = Array.from( curr.getElementsByClassName('match-table-player-container') );
            if( currentRow.length > 1 ) {
                return [...acc, [{[currentRow[1]?.innerText?.trim() || null]: {'href': currentRow[1]?.children[0]?.href || null, 'player': currentRow[0]?.innerText?.trim() || null, 'playerHref': currentRow[0]?.children[0]?.href || null} }]]
            }
            return acc;
        }, []);
    }

    const buildDecklistFilters = ( additionalFilters ) => {
        let decklistFilter = ['Desklist', 'N/A'];

        if( Array.isArray( additionalFilters ) ) { decklistFilter.concat( additionalFilters ); }
        if( typeof( additionalFilters) === 'string' && additionalFilters ) { decklistFilter.push( additionalFilters ); }

        return decklistFilter;
    }

    const processDecklists = ( decklistArr, additionalFilters = '', sortStatus = false ) => {
        const decklistFilters = buildDecklistFilters( additionalFilters );

        decklistArr = decklistArr.filter( decklistName => !decklistFilters.includes( Object.keys( decklistName[0] )[0].trim() ) );

        if( sortStatus ) { decklistArr.sort( (a, b) => Object.keys( a[0] )[0].trim() > Object.keys( b[0] )[0].trim() ? 1 : -1 ); }

        return decklistArr;
    }

    const writeDecklists = ( div, decklistArr ) => {
        decklistArr.forEach( decklistData => {
            div.style.height = adjustHeight(div);

            let innerHtml = Object.values( decklistData[0]) [0].href ? `<a href="${ Object.values( decklistData[0] )[0].href }" target="_blank" style="color: #007bff;">${ Object.keys( decklistData[0] ) }</a>` : `No decklist found`;
            innerHtml += ` by `;
            innerHtml += Object.values( decklistData[0] )[0].playerHref ? `<a href="${ Object.values( decklistData[0] )[0].playerHref }" target="_blank" style="color: #007bff;">${ Object.values( decklistData[0] )[0].player }</a><br />` : `No player name found.`;
            div.innerHTML += innerHtml;
        });
    }

    const countDeckPopulation = function( decklistArr ) {
        let deckPopulationObjTemp = {};
        let deckPopulationObj = {};
        let deckPopulationArr = [];

        decklistArr.forEach( deckData => {
            const deckName = Object.keys( deckData[0] )[0];
            if ( deckPopulationObjTemp[deckName] ) { deckPopulationObjTemp[deckName] += 1; }
            else { deckPopulationObjTemp[deckName] = 1; }
        } )

        Object.entries( deckPopulationObjTemp ).forEach( ( deckName, population) => deckPopulationArr.push( [deckName, population] ) );

        deckPopulationArr.sort( ( a, b ) => b[0][1] - a[0][1] ).forEach( elem => deckPopulationObj[ elem[0][0] ] = elem[0][1] );

        return deckPopulationObj;
    }

    const displayDecklistPopulation = function( decklistData) {
        console.log('%cDeck Population Data:',"font-weight:bold; color:yellow");
        if ( decklistData ) { console.table( decklistData ); }
        else { console.log('No decklists found. Try again. :(') }
    }

    window.beginDisplay = function() {
        clearHtmlElements();
        writeDecklistContainer();
        startDecklistDisplay();
    }

    const adjustHeight = ( div ) => ( parseInt(div.style.height.replace(/[a-zA-Z]/g,'' ) ) + 20 ) + "px";

    const clearHtmlElements = () => {
        const htmlElementsToClear = ['decklistContainer'];
        htmlElementsToClear.forEach( selector => {
            if ( document.getElementsByClassName(selector)[0] ) { document.getElementsByClassName(selector)[0].remove(); }
        });
    }
})();
