// ==UserScript==
// @name         Genshin Map Helper
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  genshin map helper (e.g. reecntly toggled, group toggled)
// @author       The Insider Gamer
// @match        https://webstatic-sea.mihoyo.com/app/ys-map-sea/index.html*
// @icon         https://img-os-static.hoyolab.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432167/Genshin%20Map%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/432167/Genshin%20Map%20Helper.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const mruID = 'gs-mru-id';
    const mruClass = 'gs-mru-btn';
    let shortcutText = [
        "Common Chest",
        "Electroculus",
        "Electrogranum",
        "Electro Seelie",
        "Seelie",
        "Time Trial Challenge",
        "Sakura Bloom",
        "Naku Weed",
        "Crystal Marrow",
        "Amethyst Lump",
        "Mini Puzzle",
    ];
    let shortcutTextDisabled = [
        'Statue of The Seven',
        'Teleport Waypoint',
        'Domain',
        'Waverider Waypoint (Cannot Teleport)',
        'Frostbearing Tree',
        'Glimmering Beacon (Cannot Teleport)',
    ];

    function teleportsGroupToggle() {
        document.querySelector('[data-title="Statue of The Seven"]').click();
        document.querySelector('[data-title="Teleport Waypoint"]').click();
        document.querySelector('[data-title="Domain"]').click();
    }

    function chestsGroupToggle() {
        document.querySelector('[data-title="Common Chest"]').parentElement.parentElement.querySelector('[data-text=Collapse]').querySelector('span').click()
    }

    function quizzesGroupToggle() {
        document.querySelector("[data-title='Time Trial Challenge']").parentElement.parentElement.querySelector('[data-text=Collapse]').querySelector('span').click()
    }

    document.body.addEventListener('keydown', function(evt) {
        // Status of the Eleven, Teleport waypoint, domain toggle
        if(evt.ctrlKey && evt.altKey && evt.shiftKey && evt.key == 'T') {
            teleportsGroupToggle()
        }

        if(evt.ctrlKey && evt.key == 'Z') {
            // simulate click 'Hide Pin' when the item popup up is visible
            document.getElementsByClassName('map-popup__switch map-popup__switch--unmarked')[0].click();
        }

        if(evt.ctrlKey && evt.key == 'S') {
            document.querySelector('[data-title="Electroculus"]').click();
        }

        if(evt.ctrlKey && evt.key == 'E') {
            document.querySelector('[data-title="Electro Seelie"]').click();
        }

        if(evt.ctrlKey && evt.altKey && evt.key == 'W') {
            document.querySelector('[data-title="Statue of The Seven"]').parentElement.parentElement.querySelector('[data-text=Collapse]').querySelector('span').click()
        }


        if(evt.ctrlKey && evt.altKey && evt.key == 'c') {
            document.querySelector('[data-title="Common Chest"]').click()
        }


        // chest group select toggle
        if(evt.ctrlKey && evt.altKey && evt.shiftKey && evt.key == 'C') {
            chestsGroupToggle()
        }

        // puzzle group select toggle
        if(evt.ctrlKey && evt.altKey && evt.shiftKey && evt.key == 'Q') {
            quizzesGroupToggle()
        }
    })




    let isVisible = function(innerText) {
        if(!document.querySelector(`[data-title="${innerText}"]`)) return false
        return document.querySelector(`[data-title="${innerText}"]`).className.indexOf(innerText) ;
    }


    let createNewBtnToMru = function(mru, innerText) {
        let btn = document.createElement('button')
        btn.className = mruClass;
        btn.innerText = innerText;
        if (isVisible(innerText)) btn.classList.add('iw-visible');
        btn.onclick = function() {
            console.log(`innerText: ${this.innerText}`);
            this.classList.toggle('iw-visible');
            document.querySelector('[data-title="' + this.innerText + '"').click();
        }
        mru.append(btn);
    }

    let createNewBtnToElem = function(elem, theButton) {
        const btn = document.createElement('button')
        btn.className = mruClass;
        btn.innerText = theButton.label;
        btn.onclick = function() {
            console.log(`innerText: ${this.innerText}`);
            this.classList.toggle('iw-visible');
            theButton.callback()
        }
        elem.append(btn);

    }

    let addExistingItemToShortcut = function(mru, innerText) {
        if(shortcutText.indexOf(innerText) >= 0) return;
        if(shortcutTextDisabled.indexOf(innerText) >= 0) return;
        shortcutText.push(innerText);
        createNewBtnToMru(mru, innerText)
    }

    let addToShortcutIfVisible = function(mru, innerText, item) {
        if(item.className.indexOf('visible') >=0) addExistingItemToShortcut(mru, innerText);
    }

    let addListenerToExistingItems = function(mru) {
        let items = document.querySelectorAll('[data-title]')
        for(let i=0; i < items.length; i++) {
            const innerText = items[i].dataset.title
            items[i].addEventListener('click', function(ev) {
                addExistingItemToShortcut(mru, innerText);
            })
            addToShortcutIfVisible(mru, innerText, items[i]);
        }
    }


    const createShortcutGroupCtrl = function() {

        const panelElem = document.getElementsByClassName('layer-control__panel')[0]
        if(!panelElem) {
            setTimeout(() => createShortcutGroupCtrl(),1000);
            return;
        }
        const shortcutGroupBtn = [
            {
                label: 'Teleports Group',
                callback: teleportsGroupToggle
            },
            {
                label: 'Quizzes Group',
                callback: quizzesGroupToggle,
            },
            {
                label: 'Chests Group',
                callback: chestsGroupToggle,
            },

        ]


        const createGroupHTML = function() {
            const elemID = 'gn-group-layer-2205'
            const panelHtmlStr = `<li class="layer-control__group">
    <div data-text="Collapse" class="layer-control__group-title">
        <div class="layer-control__group-title-name">Shortcut Group</div>
    </div>
    <div id='${elemID}'>
    </div>
</li>`;



                const newLayerCtrl = document.createElement('li');
                newLayerCtrl.innerHTML = panelHtmlStr.trim();
                panelElem.prepend(newLayerCtrl);

                return {elemID}
            }

            const {elemID} = createGroupHTML()
            const groupElem = document.getElementById(elemID)

            for(let i=0; i<shortcutGroupBtn.length; i++){
                createNewBtnToElem(groupElem, shortcutGroupBtn[i]);
            }

            return {
                createGroupHTML,
                elemID,
            }

        }


        let createShortcutLayerCtrl = function(panelElem) {

            const panelHtmlStr = `<li class="layer-control__group">
    <div data-text="Collapse" class="layer-control__group-title">
        <div class="layer-control__group-title-name">Shortcut & Recently Toggled</div>
    </div>
    <div id='${mruID}'>
    </div>
</li>`;

        const newLayerCtrl = document.createElement('li');
        newLayerCtrl.innerHTML = panelHtmlStr.trim();
        panelElem.prepend(newLayerCtrl);
    }


    let addBtnToShortcutLayerCtrl = function() {
        const panelElem = document.getElementsByClassName('layer-control__panel')[0]
        if(!panelElem) {
            setTimeout(() => addBtnToShortcutLayerCtrl(),1000);
            return;
        }
        createShortcutLayerCtrl(panelElem);
        const mru = document.getElementById(mruID);

        addListenerToExistingItems(mru);

        for(let i=0; i<shortcutText.length; i++){
            createNewBtnToMru(mru, shortcutText[i]);
        }
    }

    let addMruBtnCssStyle = function() {
        document.styleSheets[0].insertRule('.iw-visible{ background: #cc3232; color: white; border: 1px solid #ce90909e;}');
        document.styleSheets[0].insertRule('.gs-mru-btn { border: 1px solid #cccccc9e; margin: 2px; padding: 5px 10px; border-radius: 14px; color: grey; cursor: pointer}');
    }

    addMruBtnCssStyle();
        addBtnToShortcutLayerCtrl()
        createShortcutGroupCtrl()

    })();