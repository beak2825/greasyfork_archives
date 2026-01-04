// ==UserScript==
// @name         Necra's Dragon Poster Tool
// @author       https://greasyfork.org/en/users/547396
// @description  A tool to grab specific data (id, name, image url) from dragon bios to handle/parse elsewhere. Uses localStorage to retain information between dragons. Requires scry image in bio.
// @namespace    https://greasyfork.org/users/547396
// @match        https://*.flightrising.com/dragon/*
// @grant        none
// @version      0.20
// @downloadURL https://update.greasyfork.org/scripts/419265/Necra%27s%20Dragon%20Poster%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/419265/Necra%27s%20Dragon%20Poster%20Tool.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // quick ugly css (don't look at me)
    const css = '#dataBar{position:fixed;left:0;top:0;padding:.25rem 1rem 1rem;background:#e8cd38;z-index:999;width:150px;font-size:10px;}textarea{width:1px;height:1px;border:0;outline:none;}#dataMessage{font-style:italic;}#dataBar h3,#dataMessage{font-family:courier;margin:.5rem 0;}#btns{display:flex;flex-wrap:wrap;box-sizing:border-box;}#btns button{flex:0 0 46%;max-width:50%;border:2px solid #000;outline:0;cursor:pointer;background:#000;color:#fff;font-family:courier;padding:.25rem .5rem;line-height:1.5;font-size:9px; margin:2%;}#btns button:hover,#btns button:focus{background:transparent!important;color:#000;}#btns button:nth-child(3){background:#333;}#btns button:nth-child(4){background:#a57917;}#btns button:nth-child(5){flex:0 0 96%;max-width:96%;padding:0;background:transparent;border:0;text-align:left;color:#000;}';

    // check if user is current user, if so init
    checkUser();

    function checkUser() {
        const getUser = getEl('namespan').getElementsByTagName('span')[0].innerText,
              getLair = document.getElementsByClassName('breadcrumbs')[0].getElementsByTagName('a')[0].innerText;

        if (getUser === getLair) {
            init();
        }
    }

    // initialize
    function init() {
        let bar = createBar(),
            dataArr = getLocalStorage();

        addActions( bar );

        if (dataArr.length !== 0) {
            buildData( dataArr );
        }
    }

    // create bar
    function createBar() {
        let body = document.body,
            style = createEl('style'),
            cssNode = document.createTextNode(css),
            dataBar = createEl('div'),
            title = createEl('h3'),
            titleNode = document.createTextNode('Dragon Poster Tool'),
            dataStore = createEl('div'),
            dataMessage = document.createElement('div'),
            dataClipboard = document.createElement('textarea');

        style.appendChild(cssNode);
        body.appendChild(style);
        body.appendChild(dataBar);

        dataBar.appendChild(title);
        title.appendChild(titleNode);

        dataBar.appendChild(dataStore);
        dataBar.appendChild(dataClipboard);
        dataBar.appendChild(dataMessage);

        dataBar.setAttribute('id','dataBar');
        dataMessage.setAttribute('id','dataMessage');
        dataStore.setAttribute('id','dataStore');
        dataClipboard.setAttribute('id','dataClipboard');

        return dataBar;
    }

    // add action buttons
    function addActions( bar ) {
        let addDragon = createEl('button'),
            clear = createEl('button'),
            reset = createEl('button'),
            copy = createEl('button'),
            scry = createEl('button'),
            btnContainer = createEl('div');

        addDragon.innerText = 'Add';
        clear.innerText = 'Remove';
        reset.innerText = 'Reset';
        copy.innerText = 'Copy';
        scry.innerText = 'Toggle Scry Requirement';

        btnContainer.appendChild(addDragon);
        btnContainer.appendChild(clear);
        btnContainer.appendChild(reset);
        btnContainer.appendChild(copy);
        btnContainer.appendChild(scry);

        bar.appendChild(btnContainer);
        btnContainer.setAttribute('id','btns');

        addDragon.addEventListener('click', checkDragon);
        clear.addEventListener('click', clearDragon);
        reset.addEventListener('click', clearAll);
        copy.addEventListener('click', copyToClipboard);
        scry.addEventListener('click', scryToggle);
    }

    // check if dragon meets standards
    function checkDragon() {
        let current = getCurrentDragon(),
            scry = current[2],
            scryState = localStorage.getItem('scryState');

        let response = ( ( scry == '' || scry == undefined ) && scryState == 'required' ) ? error('Dragon cannot be added, no scry in bio') : setLocalStorage( current );

        return response;
    }

    // toggle scry requirement state
    function scryToggle() {
        let currentState = localStorage.getItem('scryState');

        if ( currentState === null || currentState === 'notRequired' ) {
            localStorage.setItem('scryState', 'required');
            success('Scry is required');
        } else {
            localStorage.setItem('scryState', 'notRequired');
            success('Scry is not required');
        }
    }

    // parse data for input
    function buildData( dataArr ) {
        let idArr = [],
            dEntry = '',
            count = 0,
            dataStore = getEl('dataStore'),
            dataClipboard = getEl('dataClipboard');

        for ( let item in dataArr ) {
            count++;
            dEntry = dataArr[item][1] + ' (#' + dataArr[item][0] + ')';

            idArr.push(dEntry);
        }

        dataStore.innerHTML = "Current Dragons (" + count + "): <br>" + idArr.join("<br>");
        dataClipboard.value = dataArr.join("\n");
    }

    // local storage events
    function setLocalStorage( dragon ) {
        let current = dragon;
        let scry = current[2];
        let did = 'dragon-' + current[0];

       if (scry == '' || scry == null) {
           current[2] = 'no-scry-url';
       }

        localStorage.setItem( did, JSON.stringify(current) );
        success('Dragon Added');

        // refresh the data
        buildData( getLocalStorage() );
    }

    function getLocalStorage() {
        let storedDragons = [];

        Object.keys(localStorage).forEach(function(key){
            if (key.includes('dragon-')) {
                storedDragons.push(JSON.parse(localStorage.getItem(key)));
            }
        });

        let sortedArr = storedDragons.sort((a, b) => a[3] - b[3]);

        return sortedArr;
    }

    function clearDragon() {
        let current = getCurrentDragon(),
            did = 'dragon-' + current[0];

        localStorage.removeItem( did );
        success('Dragon Removed');

        // refresh the data
        buildData( getLocalStorage() );
    }

    // Clear all storage items with dragon- as part of the key
    function clearAll() {
        Object.keys(localStorage).forEach(function(key){
            if (key.includes('dragon-')) {
                localStorage.removeItem(key);
            }
        });

        success('Data Reset');

        // refresh the data
        buildData( getLocalStorage() );
    }

    // copy data to clipboard
    function copyToClipboard() {
        let dataInput = getEl( 'dataClipboard' );

        dataInput.select();
        dataInput.setSelectionRange(0, 99999); // ??
        document.execCommand('copy');

        success('Copied to clipboard');
    }

    // get current dragon and return as an array
    function getCurrentDragon() {
        let dragon = [],
            getNum = 1;

        let dragonID = document.getElementsByClassName('dragon-profile-header-number')[0].innerText,
            nID = dragonID.substring(2, dragonID.length-1),
            dragonName = document.getElementsByClassName('dragon-profile-header-name')[0].innerText,
            dragonBio = document.getElementsByClassName('dragon-profile-bio-text')[0],
            bioImages = dragonBio.getElementsByTagName('IMG'),
            dragonInfo = document.querySelectorAll('.dragon-profile-stat-icon-value'),
            dragonGender = getEl('dragon-profile-icon-sex-tooltip'),
            genderVal = dragonGender.getElementsByTagName('STRONG')[0].innerText,
            dragonPrice = getEl('dragon-profile-icon-for-sale-tooltip'),
            dragonParents = document.getElementsByClassName('dragon-profile-lineage-parents')[0],
            ahListingPrice = 'no-ah-listing',
            dragonScry = '',
            dragonScryArr = [],
            dragonInfoArr = [],
            finalScryChunk = 'no scries';

        if ( dragonPrice ) {
            ahListingPrice = dragonPrice.getElementsByTagName('STRONG')[1].innerText;
        }

        for (let item of bioImages) {
            if ( item.src.includes('preview/dragon') || item.src.includes('rendern/350') ) {
                dragonScryArr.push(item.src);
            }
        }

        for (let gene of dragonInfo) {
            let data = gene.innerText;
            data = data.split("\n");

            dragonInfoArr.push( data[0], data[1] );
        }

        dragonScry = dragonScryArr[0]; // assign the first scry

        if ( dragonScryArr.length > 1 ) {
            finalScryChunk = dragonScryArr.join("|");
        }

        dragon = [nID,dragonName,dragonScry,getOrderNum(nID),dragonInfoArr,genderVal,ahListingPrice,finalScryChunk,getParent(dragonParents)];

        return dragon;
    }

    function getOrderNum( nID ) {
        let localItem = JSON.parse(localStorage.getItem('dragon-' + nID));

        if( localItem ) {
            return localItem[3];
        } else {
            return localStorage.length + 1;
        }
    }

    function getParent( cBlock ) {
        let eachParent = cBlock.getElementsByTagName('li'),
            i = 0,
            individual = [];

        if ( eachParent.length > 1 ) {
            for (i; i < eachParent.length; i++) {
                let parentUrl = eachParent[i].getElementsByTagName('a')[0].href,
                    popID = parentUrl.split('/').pop();

                individual.push(popID);
            }
        }

        return individual;
    }

    // helpers
    function createEl( type ) {
       return document.createElement( type );
    }

    function getEl( idName ) {
       return document.getElementById( idName );
    }

    function error( message ) {
        alert( message );
    }

    function success( message ) {
        let success = getEl('dataMessage');

        success.innerText = message;
    }
})();