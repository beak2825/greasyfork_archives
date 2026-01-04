// ==UserScript==
// @name		Melvor DungeonTimer
// @namespace	http://tampermonkey.net/
// @version		1.0.0.1
// @description	Displays different statistics relating to dungeon completion (Completion count since the script has been installed,previous time, best time, average time)
// @description	Please report issues via message to Chrono#1840 on Discord
// @author		Chrono
// @match		https://*.melvoridle.com/*
// @exclude		https://wiki.melvoridle.com*
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/425457/Melvor%20DungeonTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/425457/Melvor%20DungeonTimer.meta.js
// ==/UserScript==

var DISPLAY_CLEAR_BUTTONS = false;

function script() {
    if (window.DungeonTimer !== undefined) {
        console.error('DungeonTimer is already loaded!');
    } else {
        createDungeonTimerData();
        createDungeonTimer();
        loadDungeonTimer();
    }

    function createDungeonTimerData() {

        //get the player key (allow multi account) and define local storage key name
        var playerStorageKey = getKeysForCharacter(currentCharacter) +'DungeonTimerDataV2' ;

        //Check if there is already a key matching this script in local storage
        if (localStorage.getItem(playerStorageKey)!== null)
        {
            window.DungeonTimerData = JSON.parse(localStorage.getItem(playerStorageKey))
            console.log("DungeonTimerData Key found - Data retrieved");
        }
        else
        {
            //check if previous version of the local storage exists
            if (localStorage.getItem('DungeonTimerDataV2')!== null)
            {
                window.DungeonTimerData = JSON.parse(localStorage.getItem('DungeonTimerDataV2'))
                console.log("DungeonTimerData Key found - Data retrieved");
                localStorage.removeItem('DungeonTimerDataV2');
            }
            else
            {
                window.DungeonTimerData = []

                if (localStorage.getItem('DungeonTimerData')!== null)
                {
                    window.DungeonTimerData = JSON.parse(localStorage.getItem('DungeonTimerData'))

                    for (i=0; i<window.DungeonTimerData.length; i++)
                    {
                        window.DungeonTimerData[i][3] = [window.DungeonTimerData[i][3]];
                    }

                    localStorage.removeItem('DungeonTimerData');
                }
            }
        }

        //If the key is missing dungeon entries, add them to the end of the list
        var i
        for (i=window.DungeonTimerData.length;i<DUNGEONS.length;i++)
        {
            //comp count, last time, best time, average times (last 20)
            window.DungeonTimerData.push([0,0,0,[]])
        }

        // save settings to local storage
        window.DungeonTimerSettings = {
            save: () => {
                window.localStorage[playerStorageKey] = window.JSON.stringify(window.DungeonTimerData);
            }
        };

        //Check for the dungeon completion key

        window.DungeonCompCount = []

        if (dungeonCompleteCount!== null)
        {
            window.DungeonCompCount = dungeonCompleteCount;
        }
        else
        {
            for (i=0;i<DUNGEONS.length;i++)
            {
                window.DungeonCompCount.push(window.DungeonTimerData[i][0])
            }
        }
    }

    function createDungeonTimer() {
        // global object
        window.DungeonTimer = {};

        DungeonTimer.log = function (...args) {
            console.log("Melvor DungeonTimer:", ...args)
        }

        DungeonTimer.createSettingsMenu = () => {
            // set names
            DungeonTimer.menuItemID = 'DungeonTimerButton';
            DungeonTimer.modalID = 'DungeonTimerModal';

            // clean up in case elements already exist
            destroyMenu(DungeonTimer.menuItemID, DungeonTimer.modalID);

            // create wrappers and access point
            DungeonTimer.radio = document.createElement('div');
            DungeonTimer.content = document.createElement('div');
            DungeonTimer.content.className = 'mdtGridContainer';

            addMenuItem('Dungeon Timers', 'https://cdn.melvor.net/core/v018/assets/media/skills/combat/dungeon.svg', DungeonTimer.menuItemID, 'DungeonTimerModal')
            addModal('Dungeon Timers', DungeonTimer.modalID, [DungeonTimer.radio,DungeonTimer.content])

            // create the dungeon cards
            DungeonTimer.addDungeonData();

            // log
            DungeonTimer.log('added Timer menu!')
        }

        //the dungeonID order does not match the order shown in the dungeon combat menu, so artificially change dungeon order
        //if a new dungeon is added, revert order until manually fixed
        var i
        var dungeonOrder = [0,1,6,7,2,13,4,3,12,5,14,8,9,10,11,15]
        if (dungeonOrder.length!=DUNGEONS.length)
        {
            dungeonOrder = []
            for (i=0;i<DUNGEONS.length;i++)
            {
                dungeonOrder.push(i)
            }
        }

        //for each dungeon, add a card to the modal menu that includes the dungeon image, its name and the data from local storage
        DungeonTimer.addDungeonData = () => {
            DungeonTimer.toggleCard = new Card(DungeonTimer.radio, '', '150px', true);
            DungeonTimer.toggleCard.addRadio('Display Timer Clear Buttons   ', 25, 'ClearButtonToggle', ['Show','Hide'], [ShowMDTButtons,HideMDTButtons], 1)

            for (i=0;i<DUNGEONS.length;i++)
            {
                DungeonTimer.DungeonCard = new Card(DungeonTimer.content, '166px', '105px', true);

                DungeonTimer.DungeonCard.addImage(DUNGEONS[dungeonOrder[i]].media, 30,'');
                DungeonTimer.DungeonCard.addSectionTitle(DUNGEONS[dungeonOrder[i]].name, '')
                DungeonTimer.DungeonCard.addNumberOutput('Completion Count ', dungeonCompleteCount[dungeonOrder[i]], 20,'', 'Completion'+dungeonOrder[i])
                DungeonTimer.DungeonCard.addNumberOutput('Previous Time ', formatTime(window.DungeonTimerData[dungeonOrder[i]][1]), 20,'', 'PreviousTime'+dungeonOrder[i])
                DungeonTimer.DungeonCard.addNumberOutput('Best Time ', formatTime(window.DungeonTimerData[dungeonOrder[i]][2]), 20,'', 'BestTime'+dungeonOrder[i])
                DungeonTimer.DungeonCard.addNumberOutput('Average Time ', formatTime(AverageTimeCalc(window.DungeonTimerData[dungeonOrder[i]][3])), 20,'', 'AverageTime'+dungeonOrder[i])
                DungeonTimer.DungeonCard.addClearButtons('Clear Best', 'Clear Avg', deleteBestTime, deleteAverageTime,i)

            };
        }

        ////////////////////
        //internal methods//
        ////////////////////

        function HideMDTButtons() {
            var clearButtons = document.getElementsByClassName("mdtbutton");
            var grid = document.getElementsByClassName('mdtGridContainer')[0];
            var cards = grid.getElementsByClassName('mdtCardContainer');

            clearButtons.forEach(button => button.style.display = "none");
            grid.style.gridTemplateRows = "167px 167px 167px 167px 167px";
            cards.forEach(card => card.style.height = '166px');
        }

        function ShowMDTButtons() {
            var clearButtons = document.getElementsByClassName("mdtbutton");
            var grid = document.getElementsByClassName('mdtGridContainer')[0];
            var cards = grid.getElementsByClassName('mdtCardContainer');

            clearButtons.forEach(button => button.style.display = "block");
            grid.style.gridTemplateRows = "207px 207px 207px 207px 207px";
            cards.forEach(card => card.style.height = '206px');
        }

        function deleteBestTime(index) {
            console.log('Best Time Cleared.');
            window.DungeonTimerData[dungeonOrder[index]][2] = 0
            UpdateMenu(index)
        }

        function deleteAverageTime(index) {
            console.log('Average Time Cleared.');
            window.DungeonTimerData[dungeonOrder[index]][3] = []
            UpdateMenu(index)
        }

        function AverageTimeCalc(list) {
            if (list.length >0)
            {
                return list.reduce((a, b) => a + b, 0)/list.length
            }
            else
            {
                return 0
            }
        }

        // Convert milliseconds to minutes/seconds and format them
        function formatTime(ms) {
            let seconds = Math.round(ms / 100)/10;
            // split minutes and seconds
            let m = Math.floor(seconds / 60);
            let s = ('0000'+Number(seconds- m*60).toFixed(1)).slice(-4) ;

            var formattedTime = m + "min " + s + "s";

            // append m and s etc then concat and return
            if (ms == 0)
            {
                return "-";
            }
            else
            {
                return formattedTime;
            }
        }

        //declare global variables that will be used to measure time
        var dungeonTickStopwatch = [];
        var dungeonStartTick;
        var dungeonIconElement = document.getElementById("combat-dungeon-img");

        // Store a reference to the game's selectDungeon function
        combatManager._selectDungeon = combatManager.selectDungeon;
        // Overwrite the game's selectDungeon function to inject timer function and tooltip generation function
        combatManager.selectDungeon = (dungeonID) => {
            combatManager._selectDungeon(dungeonID);
            try {
                //start the timer
                dungeonStartTick = combatManager.tickCount;
                generateTooltip(dungeonID);
            } catch (e) {
                console.error(e);
            }
        };

        // Store a reference to the game's pauseDungeon function
        combatManager._pauseDungeon = combatManager.pauseDungeon;
        // Overwrite the game's pauseDungeon function to stop the stopwatch when the dungeon is paused
        combatManager.pauseDungeon = () => {
            try {
                //stop the watch and add the time to the array
                dungeonTickStopwatch.push(combatManager.tickCount - dungeonStartTick);
            } catch (e) {
                console.error(e);
            } finally {
                combatManager._pauseDungeon();
            }
        };

        // Store a reference to the game's resumeDungeon function
        combatManager._resumeDungeon = combatManager.resumeDungeon;
        // Overwrite the game's resumeDungeon function to restart the stopwatch when the dungeon is resumed
        combatManager.resumeDungeon = () => {
            try {
                //end the timer and process the output
                dungeonStartTick = combatManager.tickCount;
            } catch (e) {
                console.error(e);
            } finally {
                combatManager._resumeDungeon();
            }
        };

        combatManager._stopCombat = combatManager.stopCombat;
        // Overwrite the game's stopCombat function to empty the stopwatch array in case of death or if running away, and destroy the tooltip
        combatManager.stopCombat = () => {
            try {
                if (dungeonIconElement._tippy)
                    dungeonIconElement._tippy.destroy();
                dungeonTickStopwatch = []
            } catch (e) {
                console.error(e);
            } finally {
                combatManager._stopCombat();
            }
        };

        const _rollForPetDungeonPet = rollForPetDungeonPet;
        // Overwrite the game's rollForPetDungeonPet function to tally timers, update dungeon data and destroy tooltip when the dungeon is completed
        rollForPetDungeonPet = (petID, dungeonID) => {
            try {
                //end the timer and process the output
                var dungeonTimeTick = combatManager.tickCount - dungeonStartTick;
                if (!isNaN(dungeonTimeTick))
                {
                    dungeonTickStopwatch.forEach(tickCount => dungeonTimeTick += tickCount);
                    dungeonTickStopwatch = []
                    FillLocalStorageValues(dungeonID,dungeonTimeTick*50);

                    if (loadingOfflineProgress == false)
                    {
                        UpdateMenu(dungeonID);
                    }
                    //console.log(dungeonTimeTick*50);
                }

                if (dungeonIconElement._tippy)
                {
                    dungeonIconElement._tippy.destroy();
                }
                generateTooltip(dungeonID);

                dungeonStartTime = Date.now();
                dungeonStartTick = combatManager.tickCount;


            } catch (e) {
                console.error(e);
            } finally {
                _rollForPetDungeonPet(petID, dungeonID);
            }
        };

        //update the data of the selected dungeon in local storage
        function FillLocalStorageValues(dungeonID,dungeonTime) {
            //Dungeon Completion count
            window.DungeonTimerData[dungeonID][0]++; //used for average time
            //window.DungeonCompCount[dungeonID]++; //used for display
            //Latest time
            window.DungeonTimerData[dungeonID][1] = dungeonTime;
            //Best time
            if (window.DungeonTimerData[dungeonID][2] == 0 || window.DungeonTimerData[dungeonID][2] > window.DungeonTimerData[dungeonID][1])
            {
                window.DungeonTimerData[dungeonID][2] = window.DungeonTimerData[dungeonID][1]
            }
            //Average time
            //store 20 times and average
            if (window.DungeonTimerData[dungeonID][3].length === 20)
            {
                window.DungeonTimerData[dungeonID][3].splice(0, 1);
            }

            window.DungeonTimerData[dungeonID][3].push(dungeonTime);

        }

        //Update the values for the completed dungeon in the script menu
        function UpdateMenu(dungeonID){
            document.getElementById('Completion'+dungeonID).innerText = window.DungeonCompCount[dungeonID]
            document.getElementById('PreviousTime'+dungeonID).innerText = formatTime(window.DungeonTimerData[dungeonID][1])
            document.getElementById('BestTime'+dungeonID).innerText = formatTime(window.DungeonTimerData[dungeonID][2])
            document.getElementById('AverageTime'+dungeonID).innerText = formatTime(AverageTimeCalc(window.DungeonTimerData[dungeonID][3]))
        }

        //create tooltip and populate its content
        function generateTooltip(dungeonID) {
            // Generate progression Tooltips
            if (!dungeonIconElement._tippy) {
                tippy(dungeonIconElement, {
                    allowHTML: true,
                    interactive: false,
                    animation: false,
                });
            }
            var tooltip = '' ;
            if (window.DungeonTimerData[dungeonID][0] == 0)
            {
                tooltip = "No time on record";
            }
            else
            {
                tooltip += 'Previous Time : ' + formatTime(window.DungeonTimerData[dungeonID][1]) + '<br>';
                tooltip += 'Best Time : ' + formatTime(window.DungeonTimerData[dungeonID][2]) + '<br>';
                tooltip += 'Average Time : ' + formatTime(AverageTimeCalc(window.DungeonTimerData[dungeonID][3]));
            }
            // wrap and return
            dungeonIconElement._tippy.setContent(`<div>${tooltip}</div>`);
        }
    }

    function loadDungeonTimer() {
        // Loading script
        DungeonTimer.log('loading...');

        DungeonTimer.log('loaded!');
        setTimeout(DungeonTimer.createSettingsMenu, 50);

        // regularly save settings to local storage
        setInterval(window.DungeonTimerSettings.save, 1000)
    }
}

// inject the script
(function () {
    function injectScript(main) {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
        document.body.appendChild(scriptElement).parentNode.removeChild(scriptElement);
    }

    function loadScript() {
        if ((window.isLoaded && !window.currentlyCatchingUp)
            || (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp)) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            injectScript(script);
        }
    }
    const scriptLoader = setInterval(loadScript, 200);
})();


//all the next functions are taken from Melvor Idle Combat Simulator (https://github.com/visua0/Melvor-Idle-Combat-Simulator-Reloaded) and are used to create the sidebar menu

destroyMenu = (menuItemId, modalID, menuID = 'mdtToolsMenu') => {
    // remove the MICSR tab access point
    const tab = document.getElementById(menuItemId);
    if (tab !== null) {
        window.menuTabs = window.menuTabs.filter(x => x !== tab);
        tab.remove();
    }
    // remove the tools menu if it is empty
    const menu = document.getElementById(menuID);
    if (menu !== null && menu.length === 0) {
        menu.remove();
    }
    // hide and remove the modal
    const modal = document.getElementById(modalID);
    if (modal !== null) {
        $(modal).modal('hide');
        $(modal).modal('dispose');
        modal.remove();
    }
}

addMenuItem = (itemTitle, iconSrc, accessID, modalID, menuTitle = 'Tools', menuID = 'mcsToolsMenu', eyeID = 'mdtHeadingEye') => {
    createMenu(menuTitle, menuID, eyeID);
    if (window.menuTabs === undefined) {
        window.menuTabs = [];
    }

    const tabDiv = document.createElement('li');
    window.menuTabs.push(tabDiv);
    tabDiv.id = accessID;
    tabDiv.style.cursor = 'pointer';
    tabDiv.className = 'nav-main-item mdtNoSelect';

    const menuButton = document.createElement('div');
    menuButton.className = 'nav-main-link nav-compact';
    menuButton.dataset.toggle = 'modal';
    menuButton.dataset.target = '#' + modalID;
    tabDiv.appendChild(menuButton);

    const icon = document.createElement('img');
    icon.className = 'nav-img';
    icon.src = iconSrc;
    menuButton.appendChild(icon);

    const menuText = document.createElement('span');
    menuText.className = 'nav-main-link-name';
    menuText.textContent = itemTitle;
    menuButton.appendChild(menuText);

    document.getElementById(menuID).after(tabDiv);

    // return access point
    return tabDiv;
}

addModal = (title, id, content) => {
    // create modal
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'modal';

    // create dialog
    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';
    modal.appendChild(modalDialog);

    // create content wrapper
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content mdtmodal-content';
    modalDialog.appendChild(modalContent);

    // create header
    const modalHeader = $(`<div class="block block-themed block-transparent mb-0"><div class="block-header bg-primary-dark">
        <h3 class="block-title">${title}</h3>
        <div class="block-options"><button type="button" class="btn-block-option" data-dismiss="modal" aria-label="Close">
        <i class="fa fa-fw fa-times"></i></button></div></div></div>`);
    $(modalContent).append(modalHeader);

    // add content
    content.forEach(x => modalContent.appendChild(x));

    // insert modal
    document.getElementById('page-container').appendChild(modal);

    // return modal
    return modal;
}

createMenu = (title, menuID, eyeID) => {
    // check if tools menu already exists
    let menu = document.getElementById(menuID);
    if (menu !== null) {
        return menu;
    }

    // Create new tools menu
    menu = document.createElement('li');
    menu.id = menuID;
    menu.className = 'nav-main-heading mdtNoSelect';
    menu.textContent = title;

    // Create heading eye
    const headingEye = document.createElement('i');
    headingEye.className = 'far fa-eye text-muted ml-1';
    headingEye.id = eyeID;
    headingEye.onclick = () => headingEyeOnClick(eyeID);
    headingEye.style.cursor = 'pointer';
    menu.appendChild(headingEye);
    window.eyeHidden = false;

    // insert menu before Minigames
    document.getElementsByClassName('nav-main-heading').forEach(heading => {
        if (heading.textContent === 'Minigame') {
            heading.parentElement.insertBefore(menu, heading);
        }
    });
}

headingEyeOnClick = (eyeID) => {
    const headingEye = document.getElementById(eyeID);
    if (window.eyeHidden) {
        headingEye.className = 'far fa-eye text-muted ml-1';
        window.menuTabs.forEach(tab => tab.style.display = '');
        window.eyeHidden = false;
    } else {
        headingEye.className = 'far fa-eye-slash text-muted ml-1';
        window.menuTabs.forEach(tab => tab.style.display = 'none');
        window.eyeHidden = true;
    }
}


Card = class {
    constructor(parentElement, height, inputWidth, outer = false) {
        this.outerContainer = document.createElement('div');
        this.outerContainer.className = `mdtCardContainer${outer ? ' mdtOuter block block-rounded border-top border-combat border-4x bg-combat-inner-dark' : ''}`;
        if (height !== '') {
            this.outerContainer.style.height = height;
        }
        this.container = document.createElement('div');
        this.container.className = 'mdtCardContentContainer';
        this.outerContainer.appendChild(this.container);
        parentElement.appendChild(this.outerContainer);
        this.inputWidth = inputWidth;
        this.dropDowns = [];
        this.numOutputs = [];
    }

    addImage(imageSource, imageSize, imageID = '') {
        const newImage = document.createElement('img');
        newImage.style.width = `${imageSize}px`;
        newImage.style.height = `${imageSize}px`;
        newImage.id = imageID;
        newImage.src = imageSource;
        const div = document.createElement('div');
        div.className = 'mb-1';
        div.style.textAlign = 'center';
        div.appendChild(newImage);
        this.container.appendChild(div);
        return newImage;
    }

    addNumberOutput(labelText, initialValue, height, imageSrc, outputID, setLabelID = false) {
        if (!outputID) {
            outputID = `mdt ${labelText} Output`;
        }
        const newCCContainer = this.createCCContainer();
        if (imageSrc && imageSrc !== '') {
            newCCContainer.appendChild(this.createImage(imageSrc, height));
        }
        const newLabel = this.createLabel(labelText, outputID, setLabelID);
        if (setLabelID) {
            newLabel.id = `mdt ${labelText} Label`;
        }
        newCCContainer.appendChild(newLabel);
        const newOutput = document.createElement('span');
        newOutput.className = 'mdtNumberOutput';
        newOutput.style.width = this.inputWidth;
        newOutput.textContent = initialValue;
        newOutput.id = outputID;
        newCCContainer.appendChild(newOutput);


        this.container.appendChild(newCCContainer);
        this.numOutputs.push(newOutput);
    }

    addSectionTitle(titleText, titleID) {
        const newSectionTitle = document.createElement('div');
        if (titleID) {
            newSectionTitle.id = titleID;
        }
        newSectionTitle.textContent = titleText;
        newSectionTitle.className = 'mdtSectionTitle';
        const titleContainer = document.createElement('div');
        titleContainer.className = 'd-flex justify-content-center';
        titleContainer.appendChild(newSectionTitle);
        this.container.appendChild(titleContainer);
    }

    addClearButtons(buttonText1,buttonText2, onclickCallback1, onclickCallback2, index) {
        const newButton1 = document.createElement('button');
        newButton1.type = 'button';
        newButton1.id = `MCS ${buttonText1} Button`;
        newButton1.className = 'btn btn-danger m-1 mdtbutton';
        newButton1.style.width = `50%`;
        newButton1.style.color = `#fff`;
        newButton1.textContent = buttonText1;
        newButton1.onclick = () => onclickCallback1(index);

        const newButton2 = document.createElement('button');
        newButton2.type = 'button';
        newButton2.id = `MCS ${buttonText2} Button`;
        newButton2.className = 'btn btn-danger m-1 mdtbutton';
        newButton2.style.width = `50%`;
        newButton2.style.color = `#fff`;
        newButton2.textContent = buttonText2;
        newButton2.onclick = () => onclickCallback2(index);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex';
        buttonContainer.appendChild(newButton1);
        buttonContainer.appendChild(newButton2);
        this.container.appendChild(buttonContainer);
    }

    createCCContainer() {
        const newCCContainer = document.createElement('div');
        newCCContainer.className = 'mdtCCContainer';
        return newCCContainer;
    }

    createLabel(labelText, referenceID) {
        const newLabel = document.createElement('label');
        newLabel.className = 'mdtLabel';
        newLabel.textContent = labelText;
        newLabel.for = referenceID;
        return newLabel;
    }

    createImage(imageSrc, height) {
        const newImage = document.createElement('img');
        newImage.style.height = `${height}px`;
        newImage.src = imageSrc;
        return newImage;
    }

    addRadio(labelText, height, radioName, radioLabels, radioCallbacks, initialRadio, imageSrc = '') {
        const newCCContainer = this.createCCContainer();
        if (imageSrc && imageSrc !== '') {
            newCCContainer.appendChild(this.createImage(imageSrc, height));
        }
        newCCContainer.appendChild(this.createLabel(labelText, ''));
        newCCContainer.id = `MCS ${labelText} Radio Container`;
        const radioContainer = document.createElement('div');
        radioContainer.className = 'mcsRadioContainer';
        newCCContainer.appendChild(radioContainer);
        // Create Radio elements with labels
        for (let i = 0; i < radioLabels.length; i++) {
            radioContainer.appendChild(this.createRadio(radioName, radioLabels[i], `MCS ${labelText} Radio ${radioLabels[i]}`, initialRadio === i, radioCallbacks[i]));
        }
        this.container.appendChild(newCCContainer);
    }

    createRadio(radioName, radioLabel, radioID, checked, radioCallback) {
        const newDiv = document.createElement('div');
        newDiv.className = 'custom-control custom-radio custom-control-inline';
        const newRadio = document.createElement('input');
        newRadio.type = 'radio';
        newRadio.id = radioID;
        newRadio.name = radioName;
        newRadio.className = 'custom-control-input';
        if (checked) {
            newRadio.checked = true;
        }
        newRadio.addEventListener('change', radioCallback);
        newDiv.appendChild(newRadio);
        const label = this.createLabel(radioLabel, radioID);
        label.className = 'custom-control-label';
        label.setAttribute('for', radioID);
        newDiv.appendChild(label);
        return newDiv;
    }
}



//define GM_addStyle
if (typeof GM_addStyle == 'undefined') {
    this.GM_addStyle = (aCss) => {
        'use strict';
        let head = document.getElementsByTagName('head')[0];
        if (head) {
            let style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = aCss;
            head.appendChild(style);
            return style;
        }
        return null;
    };
}

//CSS Style for the grid container
GM_addStyle ( "                                                   \
.mdtGridContainer {                                               \
display:                   grid;                                  \
grid-template-columns:     265px 265px 265px;                     \
grid-template-rows:        167px 167px 167px 167px 167px 167px;   \
column-gap:                5px;                                   \
row-gap:                   5px;                                   \
justify-content:           center;                                \
align-items:               center;                                \
}                                                                 \
.mdtmodal-content {                                               \
width:                     fit-content;                           \
padding:                   0px 10px;                              \
}                                                                 \
#mdtModal.show {                                                  \
display:                   flex !important;                       \
}                                                                 \
#mdtModal .modal-dialog {                                         \
max-width:                 95%;                                   \
display:                   inline-block;                          \
}                                                                 \
.mdtSectionTitle {                                                \
text-align:                center;                                \
font-size:                 18px;                                  \
max-width:                 240px;                                 \
margin-top:                0.25rem;                               \
margin-bottom:             0.25rem;                               \
}                                                                 \
.mdtNoSelect {                                                    \
user-select:               none;                                  \
}                                                                 \
.mdtOuter {                                                       \
padding:                   0.25rem;                               \
margin:                    0.25rem !important;                    \
min-width:                 250px;                                 \
}                                                                 \
.mdtNumberOutput {                                                \
text-align:                right;                                 \
border-bottom:             1px solid;                             \
line-height:               1.15;                                  \
padding:                   0 2px;                                 \
}                                                                 \
.mdtSectionTitle {                                                \
text-align:                center;                                \
font-size:                 18px;                                  \
max-width:                 240px;                                 \
margin-top:                0.25rem;                               \
margin-bottom:             0.25rem;                               \
}                                                                 \
.mdtLabel {                                                       \
text-align:                right;                                 \
margin-right:              4px;                                   \
margin-bottom:             0px;                                   \
white-space:               nowrap;                                \
font-weight:               unset;                                 \
}                                                                 \
.mdtCCContainer {                                                 \
display:                   flex;                                  \
align-items:               center;                                \
justify-content:           flex-end;                              \
line-height:               20px;                                  \
padding:                   0 0.25rem;                             \
}                                                                 \
.mdtbutton {                                                      \
display:                   none;                                  \
}                                                                 \
" );