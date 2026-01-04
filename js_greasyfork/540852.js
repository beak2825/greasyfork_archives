// ==UserScript==
// @name         Gl tournament
// @namespace    http://tampermonkey.net/
// @description  Gl tournament helper (with Save & Load army buttons on tournaments)
// @version      1.3
// @author       Julian Delphiki II
// @match        https://www.heroeswm.ru/leader_spec_army.php?idx=1&setkamarmy=*
// @match        https://www.heroeswm.ru/tournaments.php*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540852/Gl%20tournament.user.js
// @updateURL https://update.greasyfork.org/scripts/540852/Gl%20tournament.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = location.href;

    if (url.includes('setkamarmy=1')) {
        setTimeout(setArmyFromUrl, 1000);
    }

    if (url.includes('/tournaments.php')) {
        injectStyles();
        addSaveLoadButtons();
    }
})();

function addSaveLoadButtons() {
    const autoImgs = document.querySelectorAll('img[src*="btn_autoalignment_done.png"], img[src*="btn_autoalignment.png"]');
    if (!autoImgs.length) return;

    autoImgs.forEach(img => {
        // Find the table row that contains the army
        const armyRow = img.closest('tr');
        if (armyRow.querySelector('.saveArmyBtn')) return;

        // Create td cell for Save button
        const saveTd = document.createElement('td');
        saveTd.style.width = '35px';
        saveTd.style.paddingTop = '2px';
        saveTd.style.verticalAlign = 'middle';

        // Save Button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'saveArmyBtn';
        saveBtn.title       = 'Save army';
        saveBtn.textContent = '💾';
        saveBtn.addEventListener('click', () => {
            const armyData = extractArmyData();
            if (Object.keys(armyData).length > 0) {
                // Find first unused set number
                let setNumber = null;
                for (let i = 1; i <= 99; i++) {
                    const setKey = `savedArmy_${i}`;
                    const existingArmy = GM_getValue(setKey, null);
                    if (!existingArmy || Object.keys(existingArmy).length === 0) {
                        setNumber = i;
                        break;
                    }
                }

                if (setNumber) {
                    const setKey = `savedArmy_${setNumber}`;
                    GM_setValue(setKey, armyData);
                    alert(`Army saved to set ${setNumber}!`);
                } else {
                    alert('All army set slots (1-99) are full. Please delete some sets first.');
                }
            } else {
                alert('No army data found to save.');
            }
        });
        saveTd.appendChild(saveBtn);

        // Create td cell for Load button
        const loadTd = document.createElement('td');
        loadTd.style.width = '35px';
        loadTd.style.paddingTop = '2px';
        loadTd.style.verticalAlign = 'middle';

        // Load Button
        const loadBtn = document.createElement('button');
        loadBtn.className = 'loadArmyBtn';
        loadBtn.title       = 'Load army';
        loadBtn.textContent = '📥';
        loadBtn.addEventListener('click', () => {
            showArmySetSelector();
        });
        loadTd.appendChild(loadBtn);

        // Insert both cells as the first two cells in the row
        armyRow.insertBefore(loadTd, armyRow.firstChild);
        armyRow.insertBefore(saveTd, armyRow.firstChild);
    });
}

function injectStyles() {
    if (document.getElementById('saveLoadBtnStyles')) return;

    const css = `
    .saveArmyBtn, .loadArmyBtn {
      width: 32px;
      height: 32px;
      border: 1px solid #888;
      background: #fff;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
    }
    .saveArmyBtn:hover, .loadArmyBtn:hover {
      background: #f0f0f0;
    }`;

    const style = document.createElement('style');
    style.id = 'saveLoadBtnStyles';
    style.textContent = css;
    document.head.appendChild(style);
}

function showArmySetSelector() {
    // Find all available sets
    const availableSets = [];
    for (let i = 1; i <= 99; i++) {
        const setKey = `savedArmy_${i}`;
        const savedArmy = GM_getValue(setKey, null);
        if (savedArmy && Object.keys(savedArmy).length > 0) {
            availableSets.push({
                number: i,
                army: savedArmy
            });
        }
    }

    if (availableSets.length === 0) {
        alert('No saved armies found.');
        return;
    }

    createArmySetModal(availableSets);
}

function createArmySetModal(availableSets) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Create modal content
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 20px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        position: relative;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
    `;

    const title = document.createElement('h3');
    title.textContent = 'Select Army Set to Load';
    title.style.cssText = 'margin: 0; color: #333; font-size: 18px;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #666;
        padding: 5px;
        border-radius: 3px;
    `;
    closeBtn.onmouseover = () => closeBtn.style.background = '#f0f0f0';
    closeBtn.onmouseout = () => closeBtn.style.background = 'none';
    closeBtn.onclick = () => document.body.removeChild(overlay);

    header.appendChild(title);
    header.appendChild(closeBtn);
    modal.appendChild(header);

    // Create sets container
    const setsContainer = document.createElement('div');
    setsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;';

    // Create set cards
    availableSets.forEach(set => {
        const setCard = document.createElement('div');
        setCard.style.cssText = `
            border: 2px solid #ddd;
            border-radius: 6px;
            padding: 15px;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #f9f9f9;
        `;

        setCard.onmouseover = () => {
            setCard.style.borderColor = '#007bff';
            setCard.style.background = '#f0f8ff';
            setCard.style.transform = 'translateY(-2px)';
            setCard.style.boxShadow = '0 4px 12px rgba(0, 123, 255, 0.2)';
        };
        setCard.onmouseout = () => {
            setCard.style.borderColor = '#ddd';
            setCard.style.background = '#f9f9f9';
            setCard.style.transform = 'translateY(0)';
            setCard.style.boxShadow = 'none';
        };

        // Set header
        const setHeader = document.createElement('div');
        setHeader.style.cssText = `
            font-weight: bold;
            font-size: 16px;
            color: #333;
            margin-bottom: 10px;
            text-align: center;
            background: #007bff;
            color: white;
            padding: 8px;
            border-radius: 4px;
            margin: -15px -15px 10px -15px;
            position: relative;
        `;
        setHeader.textContent = `Army Set ${set.number}`;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 8px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 50%;
            width: 22px;
            height: 22px;
            font-size: 12px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        `;

        deleteBtn.onmouseover = () => {
            deleteBtn.style.background = '#c82333';
            deleteBtn.style.transform = 'scale(1.1)';
        };
        deleteBtn.onmouseout = () => {
            deleteBtn.style.background = '#dc3545';
            deleteBtn.style.transform = 'scale(1)';
        };

        deleteBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering the card click
            if (confirm(`Delete Army Set ${set.number}?`)) {
                const setKey = `savedArmy_${set.number}`;
                GM_setValue(setKey, null); // Remove from storage
                setCard.remove(); // Remove from modal

                // If no more sets, close modal and show message
                if (setsContainer.children.length === 0) {
                    document.body.removeChild(overlay);
                    alert('All army sets have been deleted.');
                }
            }
        };

        setHeader.appendChild(deleteBtn);

        // Army composition
        const armyList = document.createElement('div');
        armyList.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            justify-content: center;
            align-items: center;
        `;

        Object.entries(set.army).forEach(([creature, count]) => {
            const creatureContainer = document.createElement('div');
            creatureContainer.style.cssText = `
                position: relative;
                display: inline-block;
            `;

            const creatureImg = document.createElement('img');
            creatureImg.src = `https://dcdn.heroeswm.ru/i/portraits/${creature}.png`;
            creatureImg.style.cssText = `
                width: 40px;
                height: 40px;
                border: 1px solid #ccc;
                border-radius: 3px;
                display: block;
            `;

            const countOverlay = document.createElement('div');
            countOverlay.textContent = count;
            countOverlay.style.cssText = `
                position: absolute;
                top: -3px;
                right: -3px;
                background: #ff6b35;
                color: white;
                font-size: 11px;
                font-weight: bold;
                padding: 2px 4px;
                border-radius: 8px;
                min-width: 16px;
                text-align: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                line-height: 1;
            `;

            creatureContainer.appendChild(creatureImg);
            creatureContainer.appendChild(countOverlay);
            armyList.appendChild(creatureContainer);
        });

        setCard.appendChild(setHeader);
        setCard.appendChild(armyList);

        // Click handler
        setCard.onclick = () => {
            // Generate URL with army parameters
            let url = 'https://www.heroeswm.ru/leader_spec_army.php?idx=1&setkamarmy=1';
            for (const [creature, count] of Object.entries(set.army)) {
                url += `&${creature}=${count}`;
            }

            // Navigate to the URL which will trigger setArmyFromUrl
            window.location.href = url;
        };

        setsContainer.appendChild(setCard);
    });

    modal.appendChild(setsContainer);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Close on overlay click
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    };
}

function extractArmyData() {
    const armyData = {};

    // Find all creature elements in the army display
    const creatureElements = document.querySelectorAll('.cre_creature');

    creatureElements.forEach(creatureEl => {
        // Find the creature image with portrait
        const creatureImg = creatureEl.querySelector('img[src*="/portraits/"]');
        if (!creatureImg) return;

        // Extract creature name from the image src
        const src = creatureImg.src;
        const match = src.match(/\/portraits\/(.+?)\.png/);
        if (!match) return;

        const creatureName = match[1];

        // Find the count element
        const countEl = creatureEl.querySelector('.cre_amount');
        if (!countEl) return;

        const count = parseInt(countEl.textContent.trim());
        if (isNaN(count)) return;

        armyData[creatureName] = count;
    });

    return armyData;
}

function setArmyFromUrl(){
    army_try_to_reset();

    var params = document.location.href.split('&');
    console.log(params);
    var noChuvi = 0;
    for(var i=1;i<=35;i++){
        if( params[i] ){
            var chelCnt = params[i].split('=');
            console.log(chelCnt);
            chelCnt[0] = chelCnt[0].replace('30','33');
            if( $('div.creature_slider_portrait img[src*="/' + chelCnt[0] + '.png"]').length ){
                var idChuviList = $('div.creature_slider_portrait img[src*="/' + chelCnt[0] + '.png"]').prev().attr('id').replace('obj_fon','');
                obj_army[i-noChuvi]['link'] = idChuviList;
                obj_army[i-noChuvi]['count'] = chelCnt[1];
            } else {
                noChuvi++;
            }
        } else {
            noChuvi++;
        }
    }
    console.log(obj_army);
    show_details();
    if(noChuvi>0){
        //alert('Не найдено юнитов: '+noChuvi+'');
    }
}
