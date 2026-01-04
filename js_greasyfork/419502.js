// ==UserScript==
// @name         Fam Grabber
// @author       https://greasyfork.org/en/users/547396
// @description  Grab name, image, and color data of familiars 
// @namespace    https://greasyfork.org/users/547396
// @match        *://*.flightrising.com/game-database/item/*/gene-colors
// @grant        none
// @version      0.1
// @downloadURL https://update.greasyfork.org/scripts/419502/Fam%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/419502/Fam%20Grabber.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // quick ugly css (don't look at me)
    const css = '#dataBar{position:fixed;left:0;top:0;padding:.25rem 1rem 1rem;background:#2c8a89;z-index:999;width:150px;font-size:10px;}textarea{width:1px;height:1px;border:0;outline:none;}#dataMessage{font-style:italic;}#dataBar h3,#dataMessage{font-family:courier;margin:.5rem 0;}#btns{display:flex;flex-wrap:wrap;box-sizing:border-box;}#btns button{flex:0 0 46%;max-width:50%;border:2px solid #000;outline:0;cursor:pointer;background:#000;color:#fff;font-family:courier;padding:.25rem .5rem;line-height:1.5;font-size:9px; margin:2%;}#btns button:hover,#btns button:focus{background:transparent!important;color:#000;}#btns button:nth-child(3){background:#333;}#btns button:nth-child(4){background:#0e7d7c;}#btns button:nth-child(5){flex:0 0 96%;max-width:96%;padding:0;background:transparent;border:0;text-align:left;color:#000;}';

    init();

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
            titleNode = document.createTextNode('Fam Grabber'),
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
        let addItem = createEl('button'),
            clear = createEl('button'),
            reset = createEl('button'),
            copy = createEl('button'),
            scry = createEl('button'),
            btnContainer = createEl('div');

        addItem.innerText = 'Add';
        clear.innerText = 'Remove';
        reset.innerText = 'Reset';
        copy.innerText = 'Copy';

        btnContainer.appendChild(addItem);
        btnContainer.appendChild(clear);
        btnContainer.appendChild(reset);
        btnContainer.appendChild(copy);

        bar.appendChild(btnContainer);
        btnContainer.setAttribute('id','btns');

        addItem.addEventListener('click', checkItem);
        clear.addEventListener('click', clearItem);
        reset.addEventListener('click', clearAll);
        copy.addEventListener('click', copyToClipboard);
    }

    // check if item meets standards
    function checkItem() {
        let current = getCurrentItem();

        return setLocalStorage( current );
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

        dataStore.innerHTML = "Current Items (" + count + "): <br>" + idArr.join("<br>");
        dataClipboard.value = dataArr.join("\n");
    }

    // local storage events
    function setLocalStorage( item ) {
        let current = item;
        let did = 'item-' + current[0];

        localStorage.setItem( did, JSON.stringify(current) );
        success('Item Added');

        // refresh the data
        buildData( getLocalStorage() );
    }

    function getLocalStorage() {
        let storedItems = [];

        Object.keys(localStorage).forEach(function(key){
            if (key.includes('item-')) {
                storedItems.push(JSON.parse(localStorage.getItem(key)));
            }
        });

        let sortedArr = storedItems.sort((a, b) => a[3] - b[3]);

        return sortedArr;
    }

    function clearItem() {
        let current = getCurrentItem(),
            did = 'item-' + current[0];

        localStorage.removeItem( did );
        success('Item Removed');

        // refresh the data
        buildData( getLocalStorage() );
    }

    // wipe all storage for domain (not the best, should be based on current keys)
    function clearAll() {
        localStorage.clear();

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

    // get current item and return as an array
    function getCurrentItem() {
        let item = [],
            getNum = 1;

        let famImg = document.getElementsByClassName('common-animated-familiar-frame')[0].src,
            itemID = document.getElementsByClassName('game-database-record-sidebar-value')[0].innerText,
            itemTitle = document.getElementsByClassName('itemTitle')[0].innerText,
            itemColors = document.querySelectorAll('.common-plain-table tr td:first-child'),
            itemInfoArr = [];

        for (let color of itemColors) {
            let data = color.innerText;

            data = data.split("\n");

            itemInfoArr.push( data );
        }

        item = [itemID,itemTitle,famImg,getOrderNum(itemID),itemInfoArr];

        return item;
    }

    function getOrderNum( nID ) {
        let localItem = JSON.parse(localStorage.getItem('item-' + nID));

        if( localItem ) {
            return localItem[3];
        } else {
            return localStorage.length + 1;
        }
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