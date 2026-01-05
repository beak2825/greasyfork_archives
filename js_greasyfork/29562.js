// ==UserScript==
// @name        Klatu's Elements script
// @namespace   Klatu
// @version     18
// @description Deck manager
// @author      Klatu
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/1.6.0/clipboard.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min.js
// @match       http://www.kongregate.com/games/zanzarino/elements*
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/29562/Klatu%27s%20Elements%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/29562/Klatu%27s%20Elements%20script.meta.js
// ==/UserScript==

jQuery.noConflict();

//main function
window.addEventListener('load', () => {
    var copyDeckCodeClipboard,
        createDeckPopup,
        createDeckButton,
        createDeckCodeInput,
        createDeckNameInput,
        deckBeingDeleted,
        deckBeingModified,
        decks,
        decksDiv,
        deleteConfirmButton,
        deleteConfirmPopup,
        deleteConfirmSpan,
        div,
        exportClipboard,
        exportImportContainer,
        exportButton,
        importButton,
        importPopup,
        importPopupButton,
        importPopupInput,
        modifyDeckButton,
        modifyDeckPopup,
        modifyDeckCodeInput,
        modifyDeckNameInput,
        popupContainer,
        style,
        styleElement,
        tab,
        tabLink;

    function showPopup(popup) {
        popupContainer.style.display = 'flex';
        for (var child of popupContainer.children) child.style.display = 'none';
        popup.style.display = 'block';
    }

    function hidePopups() {
        popupContainer.style.display = 'none';
    }

    function createCloseCross() {
        var cross = document.createElement('span');
        cross.className = 'klatu-close-cross';
        cross.addEventListener('click', hidePopups);
        return cross;
    }

    function saveDecks() {
        localStorage.setItem('elementsDecks', JSON.stringify(decks));
    }

    function createDeck() {
        var deck = {
            name: createDeckNameInput.value,
            code: createDeckCodeInput.value
        };
        decks.push(deck);
        saveDecks();
        hidePopups();
        updateDecksDiv();
    }

    function focusWhenUserPressesTab(e) {
        if (e.which === 9 || e.keyCode === 9) {
            e.preventDefault();
            this.focus();
        }
    }

    function createForm(submitFunction) {
        function submit(e) {
            if (e.which === 13 || e.keyCode === 13) {
                e.preventDefault();
                submitFunction();
            }
        }

        //link the last element with the first one and add the submit listener to it
        arguments[arguments.length - 1].addEventListener('keydown', focusWhenUserPressesTab.bind(arguments[1]));
        arguments[arguments.length - 1].addEventListener('keydown', submit);
        //link the each of the other elements with the next ones
        for (var i = 1; arguments[i + 1]; i++) {
            arguments[i].addEventListener('keydown', focusWhenUserPressesTab.bind(arguments[i + 1]));
            arguments[i].addEventListener('keydown', submit);
        }
    }

    function modifyDeck() {
        deckBeingModified.name = modifyDeckNameInput.value;
        deckBeingModified.code = modifyDeckCodeInput.value;
        saveDecks();
        hidePopups();
        updateDecksDiv();
    }

    function deleteDeck() {
        decks.splice(decks.indexOf(deckBeingDeleted), 1);
        saveDecks();
        updateDecksDiv();
        hidePopups();
    }

    function showCreateDeckPopup() {
        createDeckNameInput.value = '';
        createDeckCodeInput.value = '';
        showPopup(createDeckPopup);
        createDeckNameInput.focus();
    }

    function copyDeckCode() {
        if (!Clipboard.isSupported()) {
            alert('Wait for the script\'s next version please :(');
        }
    }

    function showModifyDeckPopup() {
        var index = this.parentNode.parentNode.getAttribute('data-klatu-index');
        deckBeingModified = decks[index];
        modifyDeckNameInput.value = deckBeingModified.name;
        modifyDeckCodeInput.value = deckBeingModified.code;
        showPopup(modifyDeckPopup);
    }

    function showDeleteConfirmPopup() {
        var index = this.parentNode.parentNode.getAttribute('data-klatu-index');
        deckBeingDeleted = decks[index];
        deleteConfirmSpan.innerText = 'Do you want to delete the deck "'+deckBeingDeleted.name+'"?';
        showPopup(deleteConfirmPopup);
    }

    function returnElementWhenItExists(id) {
        return new Promise((resolve, reject) => {
            var element = $(id),
                interval;
            if (element) resolve(element);
            interval = setInterval(() => {
                var element = $(id);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                }
            }, 1000);
        });
    }

    function updateDecksDiv() {
        for (var i = decksDiv.children.length - 1; 0 <= i; i--) decksDiv.children[i].remove();
        for (i = 0; i < decks.length; i++) {
            var deck = decks[i];
            var deckDiv = document.createElement('div');
            var deckNameDiv = document.createElement('div');
            var deckActionsDiv=document.createElement('div');
            var deckCopySpan = document.createElement('span');
            var deckModifySpan = document.createElement('span');
            var deckDeleteSpan = document.createElement('span');
            deckDiv.setAttribute('data-klatu-index', i);
            deckDiv.className = 'klatu-deck-div klatu-flex klatu-spaced-flex';
            deckNameDiv.innerText = deck.name;
            deckNameDiv.className = 'klatu-deck-name-div';
            deckDiv.appendChild(deckNameDiv);
            deckCopySpan.setAttribute('data-clipboard-text', deck.code);
            deckCopySpan.addEventListener('click', copyDeckCode);
            deckActionsDiv.appendChild(deckCopySpan);
            deckActionsDiv.className='klatu-deck-actions-div';
            deckModifySpan.className = 'klatu-deck-modify-span';
            deckModifySpan.addEventListener('click', showModifyDeckPopup);
            deckActionsDiv.appendChild(deckModifySpan);
            deckCopySpan.className = 'klatu-deck-copy-span';
            deckDeleteSpan.className = 'klatu-deck-delete-span';
            deckDeleteSpan.addEventListener('click', showDeleteConfirmPopup);
            deckActionsDiv.appendChild(deckDeleteSpan);
            deckDiv.appendChild(deckActionsDiv);
            if (i % 2) deckDiv.className += ' even';
            decksDiv.appendChild(deckDiv);
        }
    }

    function importDecks(event){
        try{
            var decksBeingImported=JSON.parse(importPopupInput.value);
            if(decksBeingImported instanceof Array){
                for(var deckBeingImported of decksBeingImported){
                    isInDecks=false;
                    for(var i=0; i<decks.length&&!isInDecks; i++){
                        var deck=decks[i];
                        if(deck.name===deckBeingImported.name&&deck.code===deckBeingImported.code) isInDecks=true;
                    }
                    if(!isInDecks) decks.push(deckBeingImported);
                }
                saveDecks();
                updateDecksDiv();
                hidePopups();
            }
            else jQuery.notify("Invalid code.", "error");
        }
        catch(error){
            jQuery.notify("Invalid code.", "error");
        }
    }

    //add own style
    style =
        '.klatu-close-cross {' +
        '  position: absolute;' +
        '  top: 4px;' +
        '  right: 4px;' +
        '  background-color: #E95420;' +
        '  border-radius: 50%;' +
        '  width: 18px;' +
        '  height: 18px;' +
        '  text-align: center;' +
        '  line-height: 18px;' +
        '  cursor: pointer;' +
        '}' +
        '.klatu-close-cross:before {' +
        '  content: "×";' +
        '  font-size: 15px;' +
        '}' +
        '.klatu-popup {' +
        '  padding: 26px 26px 8px 26px;' +
        '  position: relative;' +
        '  background-color: #333;' +
        '  text-align: center;' +
        '  font-size: 22px;' +
        '  color: white;' +
        '}' +
        '.klatu-popup>input {' +
        '  margin: 0 auto;' +
        '  display: block;' +
        '  width: 750px;' +
        '  font-family: monospace;' +
        '}' +
        '.klatu-flex {' +
        '  display: flex;' +
        '  align-items: center;' +
        '}' +
        '.klatu-centered-flex {'+
        '  justify-content: center;' +
        '}'+
        '.klatu-spaced-flex {'+
        '  justify-content: space-between;' +
        '}'+
        '.klatus-elements-script-button {' +
        '  display: block;' +
        '  padding: 6px 12px;' +
        '  margin: 8px auto 0 auto;' +
        '  font-size: 14px;' +
        '  font-weight: 400;' +
        '  line-height: 1.42857143;' +
        '  text-align: center;' +
        '  white-space: nowrap;' +
        '  vertical-align: middle;' +
        '  -ms-touch-action: manipulation;' +
        '  touch-action: manipulation;' +
        '  cursor: pointer;' +
        '  -webkit-user-select: none;' +
        '  -moz-user-select: none;' +
        '  -ms-user-select: none;' +
        '  user-select: none;' +
        '  width: 120px;' +
        '  background-image: none;' +
        '  border: 1px solid transparent;' +
        '  border-radius: 4px;' +
        '  color: #fff;' +
        '  background-color: #337ab7;' +
        '  border-color: #2e6da4;' +
        '}' +
        '.klatus-elements-script-button.export, .klatus-elements-script-button.import {' +
        '  background-color: #666;' +
        '  border-color: #af9052;' +
        '}' +
        '.klatu-deck-actions-div>span {' +
        '  font-size: 20px;' +
        '  font-weight: bold;' +
        '  padding: 1px 3px 1px 3px;' +
        '  cursor: pointer;' +
        '}' +
        '.klatu-deck-div.even {' +
        '  background-color: #333;' +
        '}' +
        '.klatu-deck-delete-span:before {' +
        '  content: "×";' +
        '  color: red;' +
        '}' +
        '.klatu-deck-copy-span:before {' +
        '  content: "?";' +
        '  color: #0275d8' +
        '}' +
        '.klatu-deck-modify-span:before {' +
        '  content: "✍";' +
        '  color: #f0ad4e' +
        '}' +
        '.tabpane {' +
        '  height: 489px' +
        '}' +
        '#klatu-popup-container {' +
        '  justify-content: center;' +
        '  align-items: center;' +
        '  position: fixed;' +
        '  z-index: 9999;' +
        '  top: 0;' +
        '  left: 0;' +
        '  width: 100vw;' +
        '  height: 100vh;' +
        '  background-color: rgba(0, 0, 0, 0.75);' +
        '}' +
        '.notiyjs-corner {' +
        '  z-index: 99999;' +
        '}'+
        '.klatu-deck-div {' +
        '  font-size: 15px;' +
        '  font-family: sans-serif;' +
        '  padding: 6px;' +
        '  background-color: #111;' +
        '  color: #eee;' +
        '}';
    styleElement = document.createElement('style');
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);

    //create the popup container
    popupContainer = document.createElement('div');
    popupContainer.id = 'klatu-popup-container';
    popupContainer.style.display = 'none';
    popupContainer.addEventListener('click', function(e) {
        if (e.target === this) hidePopups();
    });
    document.body.appendChild(popupContainer);

    //hide visible popups when the user presses escape
    window.addEventListener('keyup', (e) => {
        if (e.which === 27 || e.keyCode === 27) hidePopups();
    });

    //create the delete confirm popup
    deleteConfirmPopup = document.createElement('div');
    deleteConfirmPopup.className = 'klatu-popup';
    deleteConfirmSpan = document.createElement('span');
    deleteConfirmButton = document.createElement('button');
    deleteConfirmButton.className = 'klatus-elements-script-button';
    deleteConfirmButton.innerText = 'Yes';
    deleteConfirmButton.addEventListener('click', deleteDeck);
    deleteConfirmPopup.appendChild(deleteConfirmSpan);
    deleteConfirmPopup.appendChild(deleteConfirmButton);
    deleteConfirmPopup.appendChild(createCloseCross());
    popupContainer.appendChild(deleteConfirmPopup);

    //create the create deck popup
    createDeckPopup = document.createElement('div');
    createDeckPopup.className = 'klatu-popup';
    createDeckNameInput = document.createElement('input');
    createDeckNameInput.placeholder = 'Enter your deck\'s name';
    createDeckPopup.appendChild(createDeckNameInput);
    createDeckCodeInput = document.createElement('input');
    createDeckCodeInput.placeholder = 'Enter your deck\'s code';
    createDeckPopup.appendChild(createDeckCodeInput);
    createDeckButton = document.createElement('button');
    createDeckButton.className = 'klatus-elements-script-button';
    createDeckButton.innerText = 'Add deck';
    createDeckButton.addEventListener('click', createDeck);
    createDeckPopup.appendChild(createDeckButton);
    createDeckPopup.appendChild(createCloseCross());
    popupContainer.appendChild(createDeckPopup);
    createForm(createDeck, createDeckNameInput, createDeckCodeInput);

    //create the modify deck popup
    modifyDeckPopup = document.createElement('div');
    modifyDeckPopup.className = 'klatu-popup';
    modifyDeckNameInput = document.createElement('input');
    modifyDeckNameInput.placeholder = 'Enter your deck\'s new name';
    modifyDeckPopup.appendChild(modifyDeckNameInput);
    modifyDeckCodeInput = document.createElement('input');
    modifyDeckCodeInput.placeholder = 'Enter your deck\'s new code';
    modifyDeckPopup.appendChild(modifyDeckCodeInput);
    modifyDeckButton = document.createElement('button');
    modifyDeckButton.className = 'klatus-elements-script-button';
    modifyDeckButton.innerText = 'Modify deck';
    modifyDeckButton.addEventListener('click', modifyDeck);
    modifyDeckPopup.appendChild(modifyDeckButton);
    modifyDeckPopup.appendChild(createCloseCross());
    popupContainer.appendChild(modifyDeckPopup);
    createForm(modifyDeck, modifyDeckNameInput, modifyDeckCodeInput);

    //create the deck manager div
    div = document.createElement('div');
    div.style.display='none';
    div.id = 'klatus-elements-script-tab-pane';
    div.className = 'tabpane';

    //create the DECKS tab
    tab = document.createElement('li');
    tab.id = 'klatus-elements-script-tab';
    tab.className = 'tab';
    tabLink = document.createElement('a');
    tabLink.innerText = 'Decks';
    tabLink.key = div.id;
    tabLink.href = '#' + div.id;
    tabLink.addEventListener('click', function(e) {
        holodeck._tabs.setActiveTab(this);
        e.preventDefault();
    });
    tab.appendChild(tabLink);

    //load saved decks
    decks = localStorage.getItem('elementsDecks') ? JSON.parse(localStorage.getItem('elementsDecks')) : [];

    //create the decks div
    decksDiv = document.createElement('div');
    div.appendChild(decksDiv);
    jQuery(decksDiv).sortable({
        update: (event, deckDivObject) => {
            var item = deckDivObject.item;
            var deck = decks.splice(item[0].getAttribute('data-klatu-index'), 1)[0];
            decks.splice(item.index(), 0, deck);
            saveDecks();
            updateDecksDiv();
        },
        axis: 'y'
    });
    updateDecksDiv();

    //create the add deck button
    var button = document.createElement('button');
    button.innerText = 'Add deck';
    button.className = 'klatus-elements-script-button';
    button.addEventListener('click', showCreateDeckPopup);
    div.appendChild(button);

    //create the export/import container
    exportImportContainer = document.createElement('div');
    exportImportContainer.className = 'klatu-flex klatu-centered-flex';
    div.appendChild(exportImportContainer);

    //create the export button
    exportButton = document.createElement('button');
    exportButton.className = 'export klatus-elements-script-button';
    exportButton.innerText = 'Export decks';
    exportImportContainer.appendChild(exportButton);

    //create the import button
    importButton = document.createElement('button');
    importButton.className = 'import klatus-elements-script-button';
    importButton.innerText = 'Import decks';
    importButton.addEventListener('click', ()=>{
        showPopup(importPopup);
        importPopupInput.value = '';
        importPopupInput.focus();
    });
    exportImportContainer.appendChild(importButton);

    //create the import popup
    importPopup = document.createElement('div');
    importPopup.className = 'klatu-popup';
    importPopupInput = document.createElement('input');
    importPopupInput.placeholder = 'Enter your decks\' import code';
    importPopupInput.addEventListener('keydown', e=>{
        if(e.which===13||e.keyCode===13){ //if the user pressed enter...
            importDecks();
        }
    });
    importPopup.appendChild(importPopupInput);
    importPopupButton = document.createElement('button');
    importPopupButton.className = 'klatus-elements-script-button';
    importPopupButton.innerText = 'Import';
    importPopupButton.addEventListener('click', importDecks);
    importPopup.appendChild(importPopupButton);
    importPopup.appendChild(createCloseCross());
    popupContainer.appendChild(importPopup);

    //append my elements to the body when the appropriate elements are ready
    returnElementWhenItExists('main_tab_set').then((element) => element.appendChild(tab));
    returnElementWhenItExists('kong_game_ui').then((element) => element.appendChild(div));

    //add the tab and the div to the holodeck
    new Promise((resolve, reject) => {
        var interval;
        if (window.holodeck && window.holodeck._tabs) resolve(window.holodeck._tabs);
        interval = setInterval(() => {
            if (window.holodeck && window.holodeck._tabs) {
                clearInterval(interval);
                resolve(window.holodeck._tabs);
            }
        }, 1000);
    }).then(tabs => {
        tabs.links.push(tabLink);
        tabs.containers._object[div.id] = div;
    });

    //instantiate Clipboard to allow copying deck codes by clicking the appropriate icons
    copyDeckCodeClipboard = new Clipboard('.klatu-deck-copy-span');
    copyDeckCodeClipboard.on('success', () => jQuery.notify("Your deck code has been copied to your clipboard.", "success"));
    copyDeckCodeClipboard.on('error', () => jQuery.notify("There was an error while copying your deck code to your clipboard.", "error"));

    //instantiate Clipboard to allow exporting all the user's decks
    exportClipboard = new Clipboard(exportButton, {
        text: ()=>JSON.stringify(decks)
    });
    exportClipboard.on('success', () => jQuery.notify("Your export code has been copied to your clipboard.", "success"));
    exportClipboard.on('error', () => jQuery.notify("There was an error while copying your export code to your clipboard.", "error"));
});