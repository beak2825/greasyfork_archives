// ==UserScript==
// @name         Flight Rising: Predict Morphology - Next Option + Image Code Copy
// @description  Adds buttons to select the next/previous options for each dropdown. Automatically predicts, removing excess clicks. Adds option to copy scry image code with settings for auto copy & adult on load.
// @namespace    https://greasyfork.org/en/users/547396
// @author       https://greasyfork.org/en/users/547396
// @match        *://*.flightrising.com/scrying/predict*
// @grant        none
// @version      0.4
// @downloadURL https://update.greasyfork.org/scripts/423730/Flight%20Rising%3A%20Predict%20Morphology%20-%20Next%20Option%20%2B%20Image%20Code%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/423730/Flight%20Rising%3A%20Predict%20Morphology%20-%20Next%20Option%20%2B%20Image%20Code%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = document.getElementById('predict-morphology'),
          optionsBlock = container.getElementsByClassName('scry-options')[0],
          commonRows = optionsBlock.getElementsByClassName('common-row'),
          predictBtn = document.getElementById('scry-button'),
          loadBtn = document.getElementById('load-morphology'),
          scryLoad = document.getElementsByClassName('scry-load')[0],
          copyBtn = document.createElement('button'),
          copyPasta = document.createElement('input');

    // do it!
    init();

    function init() {
        buildCopy();
        loadScryUrl();
        loadSettings();

        for ( let row of commonRows ) {

            let selector = row.getElementsByTagName('select')[0],
                shuffle = row.getElementsByClassName('scry-shuffle')[0],
                selectName = selector.name,
                col = selector.parentNode;

            selector.style.maxWidth = '75%';
            selector.style.order = 2;
            shuffle.style.right = '-12px';
            col.style.display = 'flex';
            col.style.alignItems = 'center';
            col.style.columnGap = '.2rem';

            appendDownSelect( col, selector, selectName, true );
            appendDownSelect( col, selector, selectName, false );
        }
        predictBtn.addEventListener('click', loadScryUrl);
    }

    // append next button
    function appendDownSelect( col, selector, name, down ) {
        const downAction = document.createElement('button');
        downAction.innerHTML = down ? '&#8609;' : '&#8607;';
        downAction.name = name;
        downAction.style.order = down ? 3 : 1;

        downAction.addEventListener('click', e => {
            changeSelect(selector, down, e);
        });

        col.appendChild(downAction);
    }

    // select next/prev option, ignoring all disabled options
    function changeSelect(selector, dir, e) {
        const select = selector;
        const direction = dir ? 1 : -1;

        const collectionArr = Array
        .from(select.options)
        .reduce((arr, opt, idx) => {
            if (!opt.disabled) arr.push(idx);
            return arr;
        }, []);


        const pos = collectionArr.indexOf(select.selectedIndex);
        const length = collectionArr.length;

        const nextPos = (pos + direction + length) % length;

        select.selectedIndex = collectionArr[nextPos];

        predict();
    }


    // append copy button and field to scry load box
    function buildCopy() {
        scryLoad.style.height = '145px';
        copyBtn.classList.add('beigebutton');
        copyBtn.classList.add('thingbutton');
        copyBtn.style.width = '100%';
        copyBtn.innerText = 'Copy Image BBC Code';
        scryLoad.appendChild(copyPasta);
        scryLoad.appendChild(copyBtn);
        copyBtn.addEventListener('click', copyToClipboard);
    }

    function loadScryUrl() {
        copyPasta.value = 'loading...';

        setTimeout(function(){
            copyPasta.value = '[img]' + getDragonImage() + '[/img]';
        }, 500);
    }

    function getDragonImage() {
        const dImg = document.getElementById('dragon-image'),
              dImgSrc = dImg.getElementsByTagName('img')[0].src;

        return dImgSrc;
    }

    // load settings
    function loadSettings() {
        const settingsContainer = document.createElement('div');

        let autoCopy = createCheck('autoCopy', 'Automatically Copy');
        let growUp = createCheck('growUp', 'Adult On Load');

        container.appendChild(settingsContainer);
        settingsContainer.style.position = 'absolute';
        settingsContainer.style.top = '0';
        settingsContainer.appendChild(autoCopy);
        settingsContainer.appendChild(growUp);
    }

    function copyToClipboard() {
        copyPasta.select();
        copyPasta.setSelectionRange(0, 99999);

        navigator.clipboard.writeText(copyPasta.value);
        document.execCommand('copy');

        appendMessage();
    }

    // post Message
    function appendMessage() {
        const message = document.createElement('div');

        message.innerHTML = 'copied to clipboard';
        scryLoad.appendChild(message);

        message.style.font = 'italic normal 9px Times, serif';
        message.style.margin = '3px 0';

        setTimeout( function() {
            scryLoad.removeChild(message);
        }, 1000 );
    }

    // checkbox el
    function createCheck( name, label ) {
        let itemContainer = document.createElement('div'),
            checkboxInput = document.createElement('input'),
            checkboxLabel = document.createElement('label'),
            getSavedVal = localStorage.getItem( name );

        checkboxInput.type = 'checkbox';
        checkboxInput.id = name;
        checkboxInput.name = name;

        checkboxLabel.innerText = label;
        checkboxLabel.setAttribute('for', name);

        itemContainer.appendChild(checkboxInput);
        itemContainer.appendChild(checkboxLabel);

        itemContainer.style.display = 'flex';
        itemContainer.style.alignItems = 'center';
        itemContainer.style.font = 'normal 10px/15px arial, sans-serif';
        checkboxLabel.style.paddingLeft = '.5rem';

        checkboxInput.checked = (getSavedVal == 'true' ) ? true : false;
        checkboxInput.addEventListener('click', updateSetting);

        applySetting( name, getSavedVal );

        return itemContainer;
    }

    // apply setting logic if true
    function applySetting( name, returnVal ) {
        if ( name == 'growUp' && returnVal == 'true' ) {
            let ageVal = document.getElementsByName('age')[0];

            if ( ageVal.value == 0 ) {
                changeSelect(ageVal);
            }
        }

        if ( name == 'autoCopy' && returnVal == 'true' ) {
            setTimeout(function(){
                copyToClipboard();
            }, 1000);
        }
    }

    function updateSetting( e ) {
        localStorage.setItem( e.target.name, e.target.checked );
    }

    // trigger predict
    function predict() {
        predictBtn.click();
    }

})();