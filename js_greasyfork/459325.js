// ==UserScript==
// @name         FC Console Pick HCs
// @namespace    https://github.com/samoore036/CF-TamperMonkey-Scripts
// @version      4.3
// @description  Display set rates, TURs, and hcs vs actuals to increase visibility of pick hc deviations
// @author       mooshahe
// @match        https://picking-console.na.picking.aft.a2z.com/fc/*/
// @match        https://picking-console.na.picking.aft.a2z.com/fc/*/process-paths
// @match        https://picking-console.na.picking.aft.a2z.com/fc
// @grant        GM.xmlHttpRequest
// @connect      process-path.na.picking.aft.a2z.com
// @connect      insights.prod-na.pack.aft.a2z.com
// @downloadURL https://update.greasyfork.org/scripts/459325/FC%20Console%20Pick%20HCs.user.js
// @updateURL https://update.greasyfork.org/scripts/459325/FC%20Console%20Pick%20HCs.meta.js
// ==/UserScript==

/*
ready state changes do not work at all, neither does window/document.loaded.
fc console is dynamically generated so must wait until it is completely loaded
*/

let fc = document.URL.split('/')[4];

//three requests to be made: get active process path data, get set process path data and get active batches
const activeData = new Promise(function(resolve) {
    GM.xmlHttpRequest({
        method: 'GET',
        url: `https://picking-console.na.picking.aft.a2z.com/api/fcs/${fc}/process-paths/information`,
        onreadystatechange: function(response) {
            if (response.readyState == 4 && response.status == 200) {
                resolve(this.response);
            } else {
                console.log('did not get active data');
            }
        }
    })
})

const setData = new Promise(function(resolve) {
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://process-path.na.picking.aft.a2z.com/api/processpath/${fc}/processPathWithUserSettingsList`,
            onreadystatechange: function(response) {
                if (response.readyState == 4 && response.status == 200) {
                    resolve(this.response);
                }  else {
                    console.log('did not get set data');
                }
            }
        })
});

const batchData = new Promise(function(resolve) {
    GM.xmlHttpRequest({
        method: 'GET',
        url: `https://picking-console.na.picking.aft.a2z.com/api/fcs/${fc}/batch-info/Active`,
        onreadystatechange: function(response) {
            if (response.readyState == 4 && response.status == 200) {
                resolve(this.response);
            }  else {
                console.log('did not get active batch data');
            }
        }
    })
})

//after data is retrieved for set process paths, get active batch data, then wait until DOM is loaded then execute script
Promise.all([activeData, setData, batchData]).then((data) => {
    let interval = setInterval(() => {
        if (document.getElementById('awsui-expandable-section-6') != null) {
            clearInterval(interval);
            loadScript(data);
        }
    }, 1000);
})

function loadScript(data) {
    'use strict';

    let currentFreeSelection;
    let currentAssignedSelection;
    let currentAssignedList;

    let activePickersTotal = 0;
    let setPickersTotal = 0;
    let activeMultisTotal = 0;
    let setMultisTotal = 0;
    let activeSinglesTotal = 0;
    let setSinglesTotal = 0;

    let actualTUR = 0;
    let setTUR = 0;

    const activeData = JSON.parse(data[0]).processPathInformationMap;
    const setData = JSON.parse(data[1]).processPaths; //gives an array of all process paths with set settings
    const batchData = JSON.parse(data[2]).pickBatchInformationList;

    /*---------------------------/
    -local storage functionality-
    /--------------------------*/

    /*
    initialize localstorage if it has not been created yet
    localstorage keys per site are fc-ce, fc-tso, fc-vrets
    */
    if (localStorage.getItem(`${fc}-ce`) === null) {
        localStorage.setItem(`${fc}-ce`, JSON.stringify([]));
    }
    if (localStorage.getItem(`${fc}-tso`) === null) {
        localStorage.setItem(`${fc}-tso`, JSON.stringify([]));
    }
    if (localStorage.getItem(`${fc}-vrets`) === null) {
        localStorage.setItem(`${fc}-vrets`, JSON.stringify([]));
    }

    function getCePaths() {
        let ceArr = JSON.parse(localStorage.getItem(`${fc}-ce`));

        if (ceArr.includes(',')) {
            const arr = ceArr[0].split(',');
            const trimmedArr = arr.map(path => path.trim());
            //sort array alphabetically, as rodeo displays paths alphabetically (therefore CF planner as well), so that it aligns with planning tools
            return trimmedArr.sort();
        }

        return ceArr.sort();
    }

    function addCePath(pp) {
        const currentCePaths = getCePaths();
        currentCePaths.push(pp);
        localStorage.setItem(`${fc}-ce`, JSON.stringify(currentCePaths));
    }

    function removeCePath(pp) {
        const currentCePaths = getCePaths();
        for (let i = 0; i < currentCePaths.length; i++) {
            if (currentCePaths[i] === pp) {
                currentCePaths.splice(i, 1);
            }
        }
        localStorage.setItem(`${fc}-ce`, JSON.stringify(currentCePaths));
    }

    function getTsoPaths() {
        let tsoArr = JSON.parse(localStorage.getItem(`${fc}-tso`))
        if (tsoArr.includes(',')) {
            const arr = tsoArr[0].split(',');
            const trimmedArr = arr.map(path => path.trim());
            return trimmedArr.sort();
        }

        return tsoArr.sort();
    }

    function addTsoPath(pp) {
        const currentTsoPaths = getTsoPaths();
        currentTsoPaths.push(pp);
        localStorage.setItem(`${fc}-tso`, JSON.stringify(currentTsoPaths));
    }

    function removeTsoPath(pp) {
        const currentTsoPaths = getTsoPaths();
        for (let i = 0; i < currentTsoPaths.length; i++) {
            if (currentTsoPaths[i] === pp) {
                currentTsoPaths.splice(i, 1);
            }
        }
        localStorage.setItem(`${fc}-tso`, JSON.stringify(currentTsoPaths));
    }

    function getVretsPaths() {
        let vretsArr = JSON.parse(localStorage.getItem(`${fc}-vrets`))
        if (vretsArr.includes(',')) {
            const arr = vretsArr[0].split(',');
            const trimmedArr = arr.map(path => path.trim());
            return trimmedArr.sort();
        }

        return vretsArr.sort();
    }

    function addVretsPath(pp) {
        const currentVretsPaths = getVretsPaths();
        currentVretsPaths.push(pp);
        localStorage.setItem(`${fc}-vrets`, JSON.stringify(currentVretsPaths));
    }

    function removeVretsPath(pp) {
        const currentVretsPaths = getVretsPaths();
        for (let i = 0; i < currentVretsPaths.length; i++) {
            if (currentVretsPaths[i] === pp) {
                currentVretsPaths.splice(i, 1);
            }
        }
        localStorage.setItem(`${fc}-vrets`, JSON.stringify(currentVretsPaths));
    }

    function isCurrentPath(pp) {
        const cePaths = getCePaths();
        const tsoPaths = getTsoPaths();
        const vretsPaths = getVretsPaths();
        for (let path of cePaths) {
            if (path === pp) {
                return true;
            }
        }
        for (let path of tsoPaths) {
            if (path === pp) {
                return true;
            }
        }
        for (let path of vretsPaths) {
            if (path === pp) {
                return true;
            }
        }
        return false;
    }

    /*---------------/
    -DOM adjustments-
    /---------------*/
    loadDisplay();

    function loadDisplay() {
        editOriginalDom();
        const parentDiv = document.getElementsByClassName('awsui-row')[0];
        const mainDiv = makePluginDisplay();

        const topDiv = makeTopDiv();
        mainDiv.appendChild(makeTopDiv());

        const ceTableDiv = makeTableDiv('ce');
        ceTableDiv.appendChild(makeCeArrowToggle());
        mainDiv.appendChild(ceTableDiv);

        const tsoTableDiv = makeTableDiv('tso');
        tsoTableDiv.appendChild(makeTsoArrowToggle());
        mainDiv.appendChild(tsoTableDiv);

        const vretsTableDiv = makeTableDiv('vrets');
        vretsTableDiv.appendChild(makeVretsArrowToggle());
        mainDiv.appendChild(vretsTableDiv);

        parentDiv.appendChild(mainDiv);

        loadTables();
        //on load, tso and vrets tables are hidden
        document.getElementById('tso-table').style.display = 'none';
        document.getElementById('vrets-table').style.display = 'none';

        const overlay = makeOverlay();
        mainDiv.appendChild(overlay);
        styleSelectedLi();
        styleElements();
    }


    function editOriginalDom() {
        //use original feature to default hide this div on load
        let displayDiv = document.getElementById('awsui-expandable-section-6');
        displayDiv.classList.remove('awsui-expandable-section-content-expanded');

        let divArrow = document.getElementById('awsui-expandable-section-6-trigger');
        divArrow.classList.remove('awsui-expandable-section-header-expanded');

        //hide legend display
        document.getElementsByClassName('awsui-row')[1].style.display = 'none';
    }

    //main display for the plugin that will go at the top above all other divs
    function makePluginDisplay() {
        const div = document.createElement('div');
        div.setAttribute('id', 'main-div');

        return div;
    }

    function makeSettingsButton() {
        const button = document.createElement('button');
        button.setAttribute('id', 'settings-btn');
        button.textContent = 'Process Path Settings';
        button.addEventListener('click', openOverlay);

        return button;
    }


    /*------------------/
    -Added DOM elements-
    /-----------------*/

    /*------------------/
    -Settings functionality to add/remove
    paths to categories through local storage-
    /-----------------*/
    function makeOverlay() {
        const overlay = document.createElement('div');
        overlay.setAttribute('id', 'overlay');
        overlay.style.display = 'none';
        overlay.appendChild(makeSettingsDiv());

        return overlay;
    }

    function makeSettingsDiv() {
        const settingsDiv = document.createElement('div');
        settingsDiv.setAttribute('id', 'settings-div');

        const currentPathsDiv = document.createElement('div');
        currentPathsDiv.setAttribute('id', 'current-paths-div');

        const header = document.createElement('h3');
        header.textContent = 'Current Paths';
        currentPathsDiv.appendChild(header);

        const pathsDiv = document.createElement('div');
        pathsDiv.setAttribute('id', 'paths-div');
        currentPathsDiv.appendChild(pathsDiv);

        const ceDiv = document.createElement('div');
        ceDiv.setAttribute('id', 'current-ce-list-div');
        const ceHeader = document.createElement('h4');
        ceHeader.textContent = 'CE paths';
        ceDiv.appendChild(ceHeader);

        const ceList = document.createElement('ul');
        ceList.setAttribute('id', 'current-ce-paths');
        ceList.style.minWidth = '18rem';
        loadCurrentCePaths(ceList);
        ceDiv.appendChild(ceList);
        pathsDiv.appendChild(ceDiv);

        const tsoDiv = document.createElement('div');
        tsoDiv.setAttribute('id', 'current-tso-list-div');
        const tsoHeader = document.createElement('h4');
        tsoHeader.textContent = 'TSO paths';
        tsoDiv.appendChild(tsoHeader);

        const tsoList = document.createElement('ul');
        tsoList.setAttribute('id', 'current-tso-paths');
        tsoList.style.minWidth = '15rem';
        loadCurrentTsoPaths(tsoList);
        tsoDiv.appendChild(tsoList);
        pathsDiv.appendChild(tsoDiv);

        const vretsDiv = document.createElement('div');
        vretsDiv.setAttribute('id', 'current-vrets-list-div');
        const vretsHeader = document.createElement('h4');
        vretsHeader.textContent = 'Vrets paths';
        vretsDiv.appendChild(vretsHeader);

        const vretsList = document.createElement('ul');
        vretsList.setAttribute('id', 'current-vrets-paths');
        vretsList.style.minWidth = '15rem';
        loadCurrentVretsPaths(vretsList);
        vretsDiv.appendChild(vretsList);
        pathsDiv.appendChild(vretsDiv);

        const buttonDiv = document.createElement('div');
        buttonDiv.setAttribute('id', 'button-div');

        const removeButton = document.createElement('button');
        removeButton.classList.add('settings-btn');
        removeButton.setAttribute('id', 'remove-btn');
        removeButton.textContent = 'Remove path';
        removeButton.addEventListener('click', removeCurrentPath);
        buttonDiv.appendChild(removeButton);

        //has the same functionality as the close settings button. added as users were searching for a button to press after putting in paths
        const saveButton = document.createElement('button');
        saveButton.classList.add('settings-btn');
        saveButton.setAttribute('id', 'save-btn');
        saveButton.textContent = 'Save paths';
        saveButton.addEventListener('click', closeSettings);
        buttonDiv.appendChild(saveButton);
        currentPathsDiv.appendChild(buttonDiv);

        settingsDiv.appendChild(currentPathsDiv);
        settingsDiv.appendChild(makeAllPathsDiv());
        settingsDiv.appendChild(makeCloseSettingsBtn());

        return settingsDiv;
    }

    function makeAllPathsDiv() {
        const allPathsDiv = document.createElement('div');
        allPathsDiv.setAttribute('id', 'all-paths-div');

        const header = document.createElement('h3');
        header.textContent = 'All Paths';
        allPathsDiv.appendChild(header);

        const mainSelectionDiv = document.createElement('div');
        mainSelectionDiv.setAttribute('id', 'main-selection-div');

        const listDiv = document.createElement('div');
        listDiv.setAttribute('id', 'list-div');

        const allPathsList = document.createElement('ul');
        allPathsList.setAttribute('id', 'all-paths-list');
        loadAllFreePaths(allPathsList);
        listDiv.appendChild(allPathsList);
        mainSelectionDiv.appendChild(listDiv);

        const selectionDiv = document.createElement('div');
        selectionDiv.setAttribute('id', 'selection-div');

        const ceAddButton = document.createElement('button');
        ceAddButton.setAttribute('id', 'ce-btn');
        ceAddButton.classList.add('settings-btn');
        ceAddButton.textContent = 'Add to CE list';
        ceAddButton.addEventListener('click', addToCEList);
        selectionDiv.appendChild(ceAddButton);

        const tsoAddButton = document.createElement('button');
        tsoAddButton.setAttribute('id', 'tso-btn');
        tsoAddButton.classList.add('settings-btn');
        tsoAddButton.textContent = 'Add to TSO list';
        tsoAddButton.addEventListener('click', addToTSOList);
        selectionDiv.appendChild(tsoAddButton);

        const vretsAddButton = document.createElement('button');
        vretsAddButton.setAttribute('id', 'vrets-btn');
        vretsAddButton.classList.add('settings-btn');
        vretsAddButton.textContent = 'Add to VRETs list';
        vretsAddButton.addEventListener('click', addToVretsList);
        selectionDiv.appendChild(vretsAddButton);

        mainSelectionDiv.appendChild(selectionDiv);
        allPathsDiv.appendChild(mainSelectionDiv);

        return allPathsDiv;
    }

    function makeCloseSettingsBtn() {
        const button = document.createElement('button');
        button.setAttribute('id', 'close-btn');
        button.textContent = '✖';
        button.addEventListener('click', closeSettings);

        return button;
    }

    /*-----------------/
    -DOM element logic-
    /----------------*/

    function closeSettings() {
        const overlay = document.getElementById('overlay');
        overlay.style.display = 'none';
        loadTables();
    }

    function loadCurrentCePaths(list) {
        const currentPaths = getCePaths();
        for (let pp of currentPaths) {
            list.appendChild(makeLi(list, pp));
        }
    }

    function loadCurrentTsoPaths(list) {
        const currentPaths = getTsoPaths();
        for (let pp of currentPaths) {
            list.appendChild(makeLi(list, pp));
        }
    }

    function loadCurrentVretsPaths(list) {
        const currentPaths = getVretsPaths();
        for (let pp of currentPaths) {
            list.appendChild(makeLi(list, pp));
        }
    }

    function removeCurrentPath() {
        if (currentAssignedSelection === '') {
            return;
        }
        switch (currentAssignedList) {
            case 'current-ce-paths':
                removeCePath(currentAssignedSelection);
                break;
            case 'current-tso-paths':
                removeTsoPath(currentAssignedSelection);
                break;
            case 'current-vrets-paths':
                removeVretsPath(currentAssignedSelection);
                break;
        }
        updateFreePathsList();
        updateCurrentLists();
    }

    function loadAllFreePaths(list) {
        for (const pp in activeData) {
            if (!isCurrentPath(pp)) {
                list.appendChild(makeLi(list, pp));
            }
        }
    }

    function updateFreePathsList() {
        const div = document.getElementById('list-div');
        const list = document.getElementById('all-paths-list');
        list.remove();

        const newList = document.createElement('ul');
        newList.setAttribute('id', 'all-paths-list');
        
        for (const pp in activeData) {
            if (!isCurrentPath(pp)) {
                newList.appendChild(makeLi(newList, pp));
            }
        }
        
        div.appendChild(newList);
        styleElements();
    }

    function removeFromFreePathsList(path) {
        const list = document.getElementById('all-paths-list');
        const lis = Array.from(list.querySelectorAll('li'));

        //iterate through the list items to find the removed process path and remove it from the list
        for (let li of lis) {
            if (li.textContent === path) {
                list.removeChild(li);
            }
        }

        styleSelectedLi();
    }

    function updateCurrentLists() {
        const currentCeList = document.getElementById('current-ce-paths');
        const currentTsoList = document.getElementById('current-tso-paths');
        const currentVretsList = document.getElementById('current-vrets-paths');
        currentCeList.remove();
        currentTsoList.remove();
        currentVretsList.remove();

        const ceDiv = document.getElementById('current-ce-list-div');
        const newCeList = document.createElement('ul');
        newCeList.setAttribute('id', 'current-ce-paths');
        newCeList.style.minWidth = '18rem';
        getCePaths().forEach(pp => newCeList.appendChild(makeLi(newCeList, pp)));
        ceDiv.appendChild(newCeList);

        const tsoDiv = document.getElementById('current-tso-list-div');
        const newTsoList = document.createElement('ul');
        newTsoList.setAttribute('id', 'current-tso-paths');
        newTsoList.style.minWidth = '15rem';
        getTsoPaths().forEach(pp => newTsoList.appendChild(makeLi(newTsoList, pp)));
        tsoDiv.appendChild(newTsoList);

        const vretsDiv = document.getElementById('current-vrets-list-div');
        const newVretsList = document.createElement('ul');
        newVretsList.setAttribute('id', 'current-vrets-paths');
        newVretsList.style.minWidth = '15rem';
        getVretsPaths().forEach(pp => newVretsList.appendChild(makeLi(newVretsList, pp)));
        vretsDiv.appendChild(newVretsList);

        styleSelectedLi();

        styleElements();
    }

    function makeLi(list, pp) {
        const li = document.createElement('li');
        if (list.id === 'all-paths-list') {
            li.classList.add('all-paths-li');
            li.textContent = pp;
        } else {
            li.classList.add('current-path');
            li.textContent = pp;
        }

        li.onmouseover = li.style.cursor = 'pointer';

        return li;
    }

    /*
    lists should first check if there is a selected value, otherwise do nothing
    if there is a value, update the appropriate local storage to include this
    take that path out of all paths list by checking against local storage
    update current paths for that path by checking against local storage
    */
    function addToCEList() {
        if (currentFreeSelection === undefined || currentFreeSelection === '') {
            return;
        }
        addCePath(currentFreeSelection);
        removeFromFreePathsList(currentFreeSelection);
        updateCurrentLists();
        clearSelectedPath();
    }

    function addToTSOList() {
        if (currentFreeSelection === undefined || currentFreeSelection === '') {
            return;
        }
        addTsoPath(currentFreeSelection);
        removeFromFreePathsList(currentFreeSelection);
        updateCurrentLists();
        clearSelectedPath();
    }

    function addToVretsList() {
        if (currentFreeSelection === undefined || currentFreeSelection === '') {
            return;
        }
        addVretsPath(currentFreeSelection);
        removeFromFreePathsList(currentFreeSelection);
        updateCurrentLists();
        clearSelectedPath();
    }

    function makeTopDiv() {
        const div = document.createElement('div');
        div.setAttribute('id', 'top-div');

        const settingsDiv = document.createElement('div');
        settingsDiv.appendChild(makeSettingsButton());
        div.appendChild(settingsDiv);

        return div;
    }

    function makeMultisSummaryDiv() {
        const div = document.createElement('div');
        div.title = 'Includes all multis paths listed above';
        div.style.cssText += `
        cursor: help; display: flex; align-items: center; gap: 1vw;
        border: 2px solid black;
        `
        const titleDiv = document.createElement('div');
        titleDiv.textContent = 'Multis Totals';
        titleDiv.style.cssText += `
        border-right: 2px solid black;
        height: 100%;
        line-height:100px;
        padding-left: 0.5vw;
        padding-right: 0.5vw;
        `
        div.appendChild(titleDiv);

        const categoryDivs = document.createElement('div');
        categoryDivs.style.cssText += `
        display: flex; flex-direction: column;
        padding-right: 0.5vw;
        `
        const activeTotalDiv = document.createElement('div');
        activeTotalDiv.setAttribute('id', 'multis-active-div');
        categoryDivs.appendChild(activeTotalDiv);

        const setTotalDiv = document.createElement('div');
        setTotalDiv.setAttribute('id', 'multis-set-div');
        categoryDivs.appendChild(setTotalDiv);

        const deltaDiv = document.createElement('div');
        deltaDiv.setAttribute('id', 'multis-delta-div');
        categoryDivs.appendChild(deltaDiv);

        const deviationDiv = document.createElement('div');
        deviationDiv.setAttribute('id', 'multis-deviation-div');
        categoryDivs.appendChild(deviationDiv);
        div.appendChild(categoryDivs);

        return div;
    }

    function makeSinglesSummaryDiv() {
        const div = document.createElement('div');
        div.title = 'Includes all paths listed above that are not multis or HOV';
        div.style.cssText += `
        cursor: help; display: flex; align-items: center; gap: 1vw;
        border: 2px solid black;
        `
        const titleDiv = document.createElement('div');
        titleDiv.textContent = 'Singles Totals';
        titleDiv.style.cssText += `
        border-right: 2px solid black;
        height: 100%;
        line-height:100px;
        padding-left: 0.5vw;
        padding-right: 0.5vw;
        `
        div.appendChild(titleDiv);
        
        const categoryDivs = document.createElement('div');
        categoryDivs.style.cssText += `
        display: flex; flex-direction: column;
        padding-right: 0.5vw;
        `
        categoryDivs.style.cssText += 'display: flex; flex-direction: column;'
        const activeTotalDiv = document.createElement('div');
        activeTotalDiv.setAttribute('id', 'singles-active-div');
        categoryDivs.appendChild(activeTotalDiv);

        const setTotalDiv = document.createElement('div');
        setTotalDiv.setAttribute('id', 'singles-set-div');
        categoryDivs.appendChild(setTotalDiv);

        const deltaDiv = document.createElement('div');
        deltaDiv.setAttribute('id', 'singles-delta-div');
        categoryDivs.appendChild(deltaDiv);

        const deviationDiv = document.createElement('div');
        deviationDiv.setAttribute('id', 'singles-deviation-div');
        categoryDivs.appendChild(deviationDiv);
        div.appendChild(categoryDivs);

        return div;
    }

    function makeTableDiv(category) {
        const div = document.createElement('div');
        div.setAttribute('id', `${category}-table-div`);

        return div;
    }

    function makeCeTable() {
        const ceTable = document.createElement('table');
        ceTable.setAttribute('id', 'ce-table');
        const titleRow = document.createElement('tr');
        titleRow.style.fontSize = '2rem';
        titleRow.style.color = 'white';
        titleRow.style.backgroundColor = '#3b82f6';
        titleRow.style.border = '1px solid black';
        titleRow.style.borderBottom = 'none';
        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.textContent = 'CE Paths';
        titleHeader.colSpan = '11';
        titleRow.appendChild(titleHeader);
        ceTable.appendChild(titleRow);

        const categoriesRow = document.createElement('tr');
        categoriesRow.style.fontSize = '1.5rem';
        categoriesRow.style.color = 'white';
        categoriesRow.style.backgroundColor = '#3b82f6';
        categoriesRow.style.borderLeft = '1px solid black';
        categoriesRow.style.borderRight = '1px solid black';

        const td1 = makeHeaderTd('Process Path');
        categoriesRow.appendChild(td1);
        const td2 = makeHeaderTd('BL/Active');
        td2.title = 'Batch Limit/Current active batches';
        td2.style.cursor = 'help';
        categoriesRow.appendChild(td2);
        const td3 = makeHeaderTd('Active Pickers');
        categoriesRow.appendChild(td3);
        const td4 = makeHeaderTd('Planned Pickers');
        categoriesRow.appendChild(td4);
        const td5 = makeHeaderTd('Delta');
        categoriesRow.appendChild(td5);
        const td6 = makeHeaderTd('Deviation');
        categoriesRow.appendChild(td6);
        const td7 = makeHeaderTd('Actual TUR');
        categoriesRow.appendChild(td7);
        const td8 = makeHeaderTd('Set TUR');
        categoriesRow.appendChild(td8);
        const td9 = makeHeaderTd('Actual Rate');
        categoriesRow.appendChild(td9);
        const td10 = makeHeaderTd('Set Rate');
        categoriesRow.appendChild(td10);
        const td11 = makeHeaderTd('Status');
        categoriesRow.appendChild(td11);
        ceTable.appendChild(categoriesRow);

        return ceTable;
    }

    function makeTsoTable() {
        const tsoTable = document.createElement('table');
        tsoTable.setAttribute('id', 'tso-table');
        const titleRow = document.createElement('tr');
        titleRow.style.fontSize = '2rem';
        titleRow.style.color = 'white';
        titleRow.style.backgroundColor = '#8B5CF6';
        titleRow.style.border = '1px solid black';
        titleRow.style.borderBottom = 'none';
        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.textContent = 'TSO Paths';
        titleHeader.colSpan = '9';
        titleRow.appendChild(titleHeader);
        tsoTable.appendChild(titleRow);

        const categoriesRow = document.createElement('tr');
        categoriesRow.style.fontSize = '1.5rem';
        categoriesRow.style.color = 'white';
        categoriesRow.style.backgroundColor = '#8B5CF6';
        categoriesRow.style.borderLeft = '1px solid black';
        categoriesRow.style.borderRight = '1px solid black';

        const td1 = makeHeaderTd('Process Path');
        categoriesRow.appendChild(td1);
        const td2 = makeHeaderTd('BL');
        categoriesRow.appendChild(td2);
        const td3 = makeHeaderTd('Active Pickers');
        categoriesRow.appendChild(td3);
        const td4 = makeHeaderTd('Planned Pickers');
        categoriesRow.appendChild(td4);
        const td5 = makeHeaderTd('Delta');
        categoriesRow.appendChild(td5);
        const td6 = makeHeaderTd('Deviation');
        categoriesRow.appendChild(td6);
        const td7 = makeHeaderTd('Actual TUR');
        categoriesRow.appendChild(td7);
        const td8 = makeHeaderTd('Set TUR');
        categoriesRow.appendChild(td8);
        const td9 = makeHeaderTd('Actual Rate');
        categoriesRow.appendChild(td9);
        const td10 = makeHeaderTd('Set Rate');
        categoriesRow.appendChild(td10);
        const td11 = makeHeaderTd('Status');
        categoriesRow.appendChild(td11);
        tsoTable.appendChild(categoriesRow);

        return tsoTable;
    }

    function makeVretsTable() {
        const vretsTable = document.createElement('table');
        vretsTable.setAttribute('id', 'vrets-table');
        const titleRow = document.createElement('tr');
        titleRow.style.fontSize = '2rem';
        titleRow.style.color = 'white';
        titleRow.style.backgroundColor = '#10B981';
        titleRow.style.border = '1px solid black';
        titleRow.style.borderBottom = 'none';
        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.textContent = 'Vrets Paths';
        titleHeader.colSpan = '9';
        titleRow.appendChild(titleHeader);
        vretsTable.appendChild(titleRow);

        const categoriesRow = document.createElement('tr');
        categoriesRow.style.fontSize = '1.5rem';
        categoriesRow.style.color = 'white';
        categoriesRow.style.backgroundColor = '#10B981';
        categoriesRow.style.borderLeft = '1px solid black';
        categoriesRow.style.borderRight = '1px solid black';

        const td1 = makeHeaderTd('Process Path');
        categoriesRow.appendChild(td1);
        const td2 = makeHeaderTd('BL');
        categoriesRow.appendChild(td2);
        const td3 = makeHeaderTd('Active Pickers');
        categoriesRow.appendChild(td3);
        const td4 = makeHeaderTd('Planned Pickers');
        categoriesRow.appendChild(td4);
        const td5 = makeHeaderTd('Delta');
        categoriesRow.appendChild(td5);
        const td6 = makeHeaderTd('Deviation');
        categoriesRow.appendChild(td6);
        const td7 = makeHeaderTd('Actual TUR');
        categoriesRow.appendChild(td7);
        const td8 = makeHeaderTd('Set TUR');
        categoriesRow.appendChild(td8);
        const td9 = makeHeaderTd('Actual Rate');
        categoriesRow.appendChild(td9);
        const td10 = makeHeaderTd('Set Rate');
        categoriesRow.appendChild(td10);
        const td11 = makeHeaderTd('Status');
        categoriesRow.appendChild(td11);
        vretsTable.appendChild(categoriesRow);

        return vretsTable;
    }

    function loadTables() {
        activePickersTotal = 0;
        setPickersTotal = 0;
        activeMultisTotal = 0;
        setMultisTotal = 0;
        activeSinglesTotal = 0;
        setSinglesTotal = 0;

        const ceTableDiv = document.getElementById('ce-table-div');
        let prevCeDisplay;
        if (document.getElementById('ce-table') != null) {
            prevCeDisplay = document.getElementById('ce-table').style.display;
            document.getElementById('pick-totals-div').remove();
            document.getElementById('ce-table').remove();
            document.getElementById('summary-div').remove();
        }
        ceTableDiv.appendChild(makeTotalsDiv());
        ceTableDiv.appendChild(loadCeTable());
        const summaryDiv = document.createElement('div');
        summaryDiv.setAttribute('id', 'summary-div');
        summaryDiv.style.cssText += `display: flex; gap: 2vw; align-self: center;`
        summaryDiv.appendChild(makeMultisSummaryDiv());
        summaryDiv.appendChild(makeSinglesSummaryDiv());
        ceTableDiv.appendChild(summaryDiv);
        loadTotals();

        document.getElementById('ce-table').style.display = prevCeDisplay;

        const tsoTableDiv = document.getElementById('tso-table-div');
        let prevTsoDisplay;
        if (document.getElementById('tso-table') != null) {
            prevTsoDisplay = document.getElementById('tso-table').style.display;
            document.getElementById('tso-table').remove();
        }
        tsoTableDiv.appendChild(loadTsoTable());
        document.getElementById('tso-table').style.display = prevTsoDisplay;

        const vretsTableDiv = document.getElementById('vrets-table-div');
        let prevVretsDisplay;
        if (document.getElementById('vrets-table') != null) {
            prevVretsDisplay = document.getElementById('vrets-table').style.display;
            document.getElementById('vrets-table').remove();
        }
        vretsTableDiv.appendChild(loadVretsTable());
        document.getElementById('vrets-table').style.display = prevVretsDisplay;

        styleTables();
        styleTotals();
    }

    function makeCeArrowToggle() {
        const div = document.createElement('div');
        div.classList.add('arrow-div');
        div.style.display = 'flex';

        const button = document.createElement('button');
        button.classList.add('arrow-toggle');
        button.textContent = '▼';
        div.appendChild(button);

        button.addEventListener('click', (e) => {
            toggleTotalsDiv();
            toggleCeParentElement(e);
            if (e.target.textContent.includes('▼')) {
                e.target.textContent = '▶';
                const span = document.createElement('span');
                span.textContent = 'Toggle CE Table';
                div.appendChild(span);
                styleSpans();
                span.style.color = '#0073bb';
                span.style.fontWeight = 'bold';
                span.style.fontSize = '1.4rem';
            } else {
                e.target.textContent = '▼';
                let parentElement = e.target.parentElement;
                let span = parentElement.childNodes[1];
                parentElement.removeChild(span);
                styleElements();
            }
        })

        return div;
    }

    function makeTsoArrowToggle() {
        const div = document.createElement('div');
        div.classList.add('arrow-div');
        div.style.display = 'flex';

        const button = document.createElement('button');
        button.classList.add('arrow-toggle');
        button.textContent = '▶';
        div.appendChild(button);

        const span = document.createElement('span');
        span.textContent = 'Toggle TSO Table';
        div.appendChild(span);
        span.style.color = '#0073bb';
        span.style.fontWeight = 'bold';
        span.style.fontSize = '1.4rem';

        button.addEventListener('click', (e) => {
            toggleParentElement(e);
            if (e.target.textContent.includes('▼')) {
                e.target.textContent = '▶';
                const span = document.createElement('span');
                span.textContent = 'Toggle TSO Table';
                div.appendChild(span);
                styleSpans();
                span.style.color = '#0073bb';
                span.style.fontWeight = 'bold';
                span.style.fontSize = '1.4rem';
            } else {
                e.target.textContent = '▼';
                let parentElement = e.target.parentElement;
                let span = parentElement.childNodes[1];
                e.target.parentElement.removeChild(span);
            }
        })

        return div;
    }

    function makeVretsArrowToggle() {
        const div = document.createElement('div');
        div.classList.add('arrow-div');
        div.style.display = 'flex';

        const button = document.createElement('button');
        button.classList.add('arrow-toggle');
        button.textContent = '▶';
        div.appendChild(button);

        const span = document.createElement('span');
        span.textContent = 'Toggle Vrets Table';
        div.appendChild(span);
        span.style.color = '#0073bb';
        span.style.fontWeight = 'bold';
        span.style.fontSize = '1.4rem';

        button.addEventListener('click', (e) => {
            toggleParentElement(e);
            if (e.target.textContent.includes('▼')) {
                e.target.textContent = '▶';
                const span = document.createElement('span');
                span.textContent = 'Toggle Vrets Table';
                div.appendChild(span);
                styleSpans();
                span.style.color = '#0073bb';
                span.style.fontWeight = 'bold';
                span.style.fontSize = '1.4rem';
            } else {
                e.target.textContent = '▼';
                let parentElement = e.target.parentElement;
                let span = parentElement.childNodes[1];
                parentElement.removeChild(span);
            }
        })

        return div;
    }

    function toggleTotalsDiv() {
        const div = document.getElementById('pick-totals-div');
        if (div.style.display !== 'none') {
            div.style.display = 'none';
        } else {
            div.style.display = 'flex';
        }
    }

    function toggleCeParentElement(e) {
        const table = e.target.parentElement.parentElement.childNodes[2];
        if (table.style.display !== 'none') {
            table.style.display = 'none';
        } else {
            table.style.display = 'block';
            styleTables();
        }
    }

    function toggleParentElement(e) {
        const table = e.target.parentElement.parentElement.childNodes[1];
        if (table.style.display !== 'none') {
            table.style.display = 'none';
        } else {
            table.style.display = 'block';
        }
    }

    function makeTotalsDiv() {
        const div = document.createElement('div');
        div.setAttribute('id', 'pick-totals-div');

        const activeDiv = document.createElement('div');
        activeDiv.title = 'Active picker total does not take HOV paths into account.';
        activeDiv.style.cursor = 'help';
        activeDiv.setAttribute('id', 'active-div');
        const activeTitleDiv = document.createElement('div');
        activeTitleDiv.textContent = 'Active Pickers';
        activeTitleDiv.style.color = 'grey';
        activeDiv.appendChild(activeTitleDiv);
        const activePickers = document.createElement('div');
        activePickers.setAttribute('id', 'active-pickers-div');

        activeDiv.appendChild(activePickers);

        div.appendChild(activeDiv);

        const setDiv = document.createElement('div');
        setDiv.setAttribute('id', 'set-div');
        setDiv.title = 'Planned picker total does not take HOV paths into account.';
        setDiv.style.cursor = 'help';
        const setTitleDiv = document.createElement('div');
        setTitleDiv.textContent = 'Planned Pickers';
        setTitleDiv.style.color = 'grey';
        setDiv.appendChild(setTitleDiv);
        const setPickers = document.createElement('div');
        setPickers.setAttribute('id', 'set-pickers-div');
        setDiv.appendChild(setPickers);
        div.appendChild(setDiv);

        return div;
    }

    function loadCeTable() {
        const table = makeCeTable();

        getCePaths().forEach(pp => {
            table.appendChild(makeCeRow(pp));
        });

        return table;
    }

    function loadTsoTable() {
        const table = makeTsoTable();

        getTsoPaths().forEach(pp => {
            table.appendChild(makeOtherRow(pp));
        })

        return table;
    }

    function loadVretsTable() {
        const table = makeVretsTable();

        getVretsPaths().forEach(pp => {
            table.appendChild(makeOtherRow(pp));
        })

        return table;
    }

    function loadTotals() {
        const activeDiv = document.getElementById('active-pickers-div');
        activeDiv.textContent = activePickersTotal;

        const setDiv = document.getElementById('set-pickers-div');
        setDiv.textContent = setPickersTotal;

        const multisActiveDiv = document.getElementById('multis-active-div');
        multisActiveDiv.textContent = `active: ${activeMultisTotal}`

        const multisSetDiv = document.getElementById('multis-set-div');
        multisSetDiv.textContent = `planned: ${setMultisTotal}`

        const multisDeltaDiv = document.getElementById('multis-delta-div');
        multisDeltaDiv.textContent = `delta: ${activeMultisTotal - setMultisTotal}`

        const multisDeviationDiv = document.getElementById('multis-deviation-div');
        multisDeviationDiv.textContent = `deviation: ${getDeviationPercent(activeMultisTotal, setMultisTotal)}`

        const singlesActiveDiv = document.getElementById('singles-active-div');
        singlesActiveDiv.textContent = `active: ${activeSinglesTotal}`

        const singlesSetDiv = document.getElementById('singles-set-div');
        singlesSetDiv.textContent = `planned: ${setSinglesTotal}`

        const singlesDeltaDiv = document.getElementById('singles-delta-div');
        singlesDeltaDiv.textContent = `delta: ${activeSinglesTotal - setSinglesTotal}`

        const singlesDeviationDiv = document.getElementById('singles-deviation-div');
        singlesDeviationDiv.textContent = `deviation: ${getDeviationPercent(activeSinglesTotal, setSinglesTotal)}`
    }

    function makeCeRow(pp) {
        const row = document.createElement('tr');
        row.classList.add('path-row');
        const setData = getPathApi(pp);

        const ppTd = makeLinkTd(pp);
        ppTd.style.textAlign = 'left';
        row.appendChild(ppTd);

        
        const tur = setData.unitRateTarget; 
        const pra = setData.pickRateAverage;

        let setPickers;
        if (tur === 0 || pra === 0) {
            setPickers = 0;
        } else {
            // take 10 off of TUR as set pickers will round up and this will offset over counting by 1 from testing
            setPickers = Math.ceil((parseInt(tur - Math.floor(pra * 0.9)))/pra); //api does not have planned pickers so it is calculated by TUR/pick rate average
        }
        const activePickers = getActivePickers(pp);

        //do not count HOV pickers or MultiCASEPallet as part of active picker total
        if (!pp.includes('HOV') || !pp.includes('MultiCASEPallet')) {
            console.log(`active pickers total before adding: ${activePickersTotal} in ${pp}`);
            activePickersTotal += parseInt(activePickers);
        }
        
        //do not count pp in planned pickers total if it's an HOV path or MultiCASEPallet as default hc is 10 which is always inaccurate
        if (pp.includes('HOV') || pp.includes('MultiCASEPallet')) {
        } else {
            setPickersTotal += parseInt(setPickers);
        }

        if (!pp.includes('HOV') && !pp.includes('Multi')) {
            let number = parseInt(setPickers);
            setSinglesTotal += number;
            activeSinglesTotal += parseInt(activePickers);
        }

        //only give a number for batch limit if it is a multis path
        if (pp.includes('Multi') && !pp.includes('MultiCASEPallet')) {
            let setBatches = setData.openBatchQuantityLimit;
            let activeBatches = getActiveBatches(pp);
            row.appendChild(makeTd(`${setBatches}/${activeBatches}`));
            setMultisTotal += parseInt(setPickers);
            activeMultisTotal += parseInt(activePickers);
        } else {
            row.appendChild(makeTd(''));
        }

        row.appendChild(makeTd(activePickers));
        row.appendChild(makeTd(setPickers));

        const deltaTd = makeTd(getDelta(setPickers, activePickers));
        switch(deltaTd.textContent) {
            case '0': deltaTd.style.backgroundColor = '#22c55e';
                break;
            default: deltaTd.style.backgroundColor = '#f87171';
        }
        row.appendChild(deltaTd);

        const deviationTd = makeTd(getDeviationPercent(activePickers, setPickers));
        row.appendChild(deviationTd);

        row.appendChild(makeTd(getActualTur(pp)));

        //if path is HOV and TUR is set to 1000, flag green, otherwise red. SW is all HOV paths should be set to 1000
        const turTd = makeTd(tur);
        if (pp.includes('PPHOV') || pp.includes('MultiCASEPallet')) {
            switch(turTd.textContent) {
                case '1000': turTd.style.backgroundColor = '#22c55e';
                    break;
                default: turTd.style.backgroundColor = '#f87171';
            }
            turTd.title = 'SW for all HOV paths is to set PRA/TUR to 100/1000. If set properly, TUR will highlight green; red if not set correctly';
            turTd.style.cursor = 'help';
        }
        row.appendChild(turTd);

        row.appendChild(makeTd(getActualRate(getActualTur(pp), getActivePickers(pp))));
        row.appendChild(makeTd(pra));

        const statusTd = makeTd(setData.status);
        statusTd.style.color = 'white';
        statusTd.style.fontSize = '1.4rem';
        statusTd.style.textAlign = 'center';
        switch (statusTd.textContent) {
            case 'Active': statusTd.style.backgroundColor = '#22c55e';
                break;
            case 'Active_CollateDisabled':
                statusTd.textContent = 'ACD';
                statusTd.style.backgroundColor = 'red';
            default: statusTd.style.backgroundColor = 'red';
        }
        row.appendChild(statusTd);

        return row;
    }

    function makeOtherRow(pp) {
        const row = document.createElement('tr');
        row.classList.add('path-row');
        const setData = getPathApi(pp);

        const ppTd = makeLinkTd(pp);
        ppTd.style.textAlign = 'left';
        row.appendChild(ppTd);

        const tur = setData.unitRateTarget;
        const pra = setData.pickRateAverage;
        const setPickers = pra === 0 ? '' : Math.ceil(tur/pra); //api does not have planned pickers so it is calculated by TUR/pick rate average

        //only give a number for batch limit if it is a multis path
        row.appendChild(makeTd(setData.openBatchQuantityLimit));

        row.appendChild(makeTd(getActivePickers(pp)));
        row.appendChild(makeTd(setPickers));

        const deltaTd = makeTd(getDelta(setPickers, getActivePickers(pp)));
        switch(deltaTd.textContent) {
            case '0': deltaTd.style.backgroundColor = '#22c55e';
                break;
            default: deltaTd.style.backgroundColor = '#f87171';
        }
        row.appendChild(deltaTd);

        row.appendChild(makeTd(getActualTur(pp)));

        row.appendChild(makeTd(tur));

        const statusTd = makeTd(setData.status);
        statusTd.style.color = 'white';
        statusTd.style.fontSize = '1.4rem';
        statusTd.style.textAlign = 'center';
        switch (statusTd.textContent) {
            case 'Active': statusTd.style.backgroundColor = '#22c55e';
                break;
            case 'Active_CollateDisabled':
                statusTd.textContent = 'ACD';
                statusTd.style.backgroundColor = 'red';
            default: statusTd.style.backgroundColor = 'red';
        }
        row.appendChild(statusTd);

        return row;
    }

    function makeLinkTd(pp) {
        const td = document.createElement('td');
        td.classList.add('row-td');

        const a = document.createElement('a');
        a.textContent = pp;
        a.href = `https://process-path.na.picking.aft.a2z.com/fc/${fc}/properties/process-path/${pp}`;
        td.appendChild(a);

        return td;
    }

    function makeHeaderTd(str) {
        const td = document.createElement('td');
        td.classList.add('header-td');
        td.textContent = str;
        return td;
    }

    function makeTd(str) {
        const td = document.createElement('td');
        td.classList.add('row-td');
        td.textContent = str;
        return td;
    }

    //make getters for all the info needed
    /*
    two categories of data. set data that needs to be accessed
    by the process path's api, including batch limit, status,
    planned pickers, set TUR, and set rate (PRA). actual data that can
    be accessed on the main page of fc console, including active pickers,
    actual TUR, and actual rate.
    */

    //return api path object to get access to all attributes
    function getPathApi(pp) {
        for (let path of setData) {
            if (path.processPathName === pp) {
                return path;
            }
        }
    }

    function getActivePickers(pp) {
        let path = getProcessPath(pp);
        let activePickers = activeData[path].PickerCount;

        return activePickers;
    }

    function getActiveBatches(pp) {
        let batchCount = 0;
        for (let i = 0; i < batchData.length; i++) {
            if (batchData[i].processPath === pp) {
                batchCount++;
            }
        }

        return batchCount;
    }

    function getDelta(setPickers, activePickers) {
        return activePickers - setPickers;
    }

    function getDeviationPercent(activePickers, setPickers) {
        if (activePickers == 0) {
            return '100%';
        }
        const deviationPercent = ((setPickers - activePickers) / setPickers) * 100 * -1;
        return `${deviationPercent > 0 ? '+' : ''}${deviationPercent.toFixed(0)}%`;
    }

    function getActualTur(pp) {
        let path = getProcessPath(pp);
        return activeData[path].UnitsPerHour;
    }

    //api does not contain actual rate. it is calculated by UPH/active pickers
    function getActualRate(TUR, activePickers) {
        if (parseInt(TUR) === 0) {
            return 'N/A';
        }
        return Math.round(parseInt(TUR) / parseInt(activePickers));
    }

    //find the process path obj in activeData api
    function getProcessPath(pp) {
        for (const path in activeData) {
            if (path === pp) {
                return path;
            }
        }
    }

    /*--------/
    -Stylings-
    /-------*/
    function styleElements() {
        styleParentDiv();
        styleMainDiv();
        styleArrows();
        styleSettingsBtn();
        styleSettingsDiv();
        styleTotals();
        styleLists();
        removeLiStyle();
        styleTables();
    }

    function styleParentDiv() {
        const parentDiv = document.getElementsByClassName('awsui-row')[0];
        parentDiv.style.display = 'flex';
    }

    function styleMainDiv() {
        const mainDiv = document.getElementById('main-div');
        mainDiv.style.minWidth = '75%';
        mainDiv.style.boxSizing = 'border-box';
        mainDiv.style.boxShadow = '0 1px 1px 0 rgba(0,28,36,.3), 1px 1px 1px 0 rgba(0,28,36,.3), -1px 1px 1px 0 rgba(0,28,36,.3)';
        mainDiv.style.borderTop = '1px solid #EAEDED';
        mainDiv.style.display = 'flex';
        mainDiv.style.flexDirection = 'column';
        mainDiv.style.padding = '2rem';
        mainDiv.style.marginLeft = '1rem';

        const topDiv = document.getElementById('top-div');
        topDiv.style.display = 'flex';
        topDiv.style.gap = '2rem';
        topDiv.style.justifyContent = 'end';
    }

    function styleArrows() {
        const arrows = Array.from(document.getElementsByClassName('arrow-toggle'));
        arrows.forEach(arrow => {
                arrow.style.fontSize = '1.5rem';
                arrow.style.color = '#645e5e';
                arrow.style.backgroundColor = 'transparent';
                arrow.style.border = 'none';
                arrow.style.display = 'flex';
                arrow.style.gap = '1rem';
            })
        arrows.forEach(arrow => arrow.onmouseover = arrow.style.cursor = 'pointer');
    }

    function styleSpans() {
        const spans = Array.from(document.getElementsByName('span'))
            .forEach(span => {
                span.style.color = '#0073bb';
                span.style.fontWeight = 'bold';
                span.style.fontSize = '1.4rem';
            });
    }

    function styleSettingsBtn() {
        const button = document.getElementById('settings-btn');
        button.onmouseover = button.style.cursor = 'pointer';

        button.style.height = '5rem';
        button.style.width = '12rem';
        button.style.border = '2px solid darkblue';
        button.style.backgroundColor = '#FDE68A';
        button.style.fontSize = '1.7rem';
        button.style.display = 'flex';
        button.style.flexWrap = 'wrap';
        button.style.alignItems = 'center';
    }

    //call this when you click settings button to start displaying it
    function openOverlay() {
        const overlay = document.getElementById('overlay');
        overlay.style.zIndex = '1000';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
    }

    function styleSettingsDiv() {
        const settingsDiv = document.getElementById('settings-div');
        settingsDiv.style.border = '2px solid black';
        settingsDiv.style.backgroundColor = '#e4e4e7';
        settingsDiv.style.display = 'flex';
        settingsDiv.style.gap = '1rem';
        settingsDiv.style.minWidth = '40%';
        settingsDiv.style.borderRadius = '20px';

        const currentPathsDiv = document.getElementById('current-paths-div');
        currentPathsDiv.style.display = 'flex';
        currentPathsDiv.style.flexDirection = 'column';
        currentPathsDiv.style.alignItems = 'center';
        currentPathsDiv.style.padding = '3rem 3rem';

        const pathsDiv = document.getElementById('paths-div');
        pathsDiv.style.display = 'flex';

        const allPathsDiv = document.getElementById('all-paths-div');
        allPathsDiv.style.display = 'flex';
        allPathsDiv.style.flexDirection = 'column';
        allPathsDiv.style.alignItems = 'center';
        allPathsDiv.style.borderLeft = '2px solid black';
        allPathsDiv.style.padding = '3rem 3rem';

        const mainSelectionDiv = document.getElementById('main-selection-div');
        mainSelectionDiv.style.display = 'flex';
        mainSelectionDiv.style.marginTop = '3rem';
        mainSelectionDiv.style.gap = '3rem';

        const contentDiv = document.getElementById('selection-div');
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.gap = '5rem';
        contentDiv.style.paddingTop = '2rem';

        const closeBtn = document.getElementById('close-btn');
        closeBtn.style.position = 'relative';
        closeBtn.style.top = '10%';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '2rem';
        closeBtn.style.fontSize = '2rem';
        closeBtn.style.width = '3.5rem';
        closeBtn.style.height = '3.5rem';
        closeBtn.style.color = 'white';
        closeBtn.style.backgroundColor = '#dc2626';

        closeBtn.onmouseover = closeBtn.style.cursor = 'pointer';

        const buttonDiv = document.getElementById('button-div');
        buttonDiv.style.display = 'flex';
        buttonDiv.style.gap = '6rem';

        const removeBtn = document.getElementById('remove-btn');
        removeBtn.style.backgroundColor = '#EF4444';
        removeBtn.style.border = '2px solid darkred';
        removeBtn.style.marginTop = '2rem';
        removeBtn.style.marginLeft = '1.5rem';

        const saveBtn = document.getElementById('save-btn');
        saveBtn.style.backgroundColor = '#34D399';
        saveBtn.style.border = '2px solid darkgreen';
        saveBtn.style.marginTop = '2rem';
        saveBtn.style.marginLeft = '1.5rem';

        const ceBtn = document.getElementById('ce-btn');
        ceBtn.style.backgroundColor = '#3b82f6';
        ceBtn.style.border = '2px solid blue';

        const tsoBtn = document.getElementById('tso-btn');
        tsoBtn.style.backgroundColor = '#8B5CF6';
        tsoBtn.style.border = '2px solid #5B21B6';

        const vretsBtn = document.getElementById('vrets-btn');
        vretsBtn.style.backgroundColor = '#10B981';
        vretsBtn.style.border = '2px solid darkgreen';

        //stylings for both main headers
        const headers = Array.from(document.querySelectorAll('h3'))
            .forEach(header => header.style.marginLeft = '2rem');

        //common stylings for all three buttons
        const btns = Array.from(document.getElementsByClassName('settings-btn'));
        for (let btn of btns) {
            btn.style.width = '16rem';
            btn.style.fontSize = '1.7rem';
            btn.style.fontWeight = 'bold';
            btn.style.padding = '0.5rem 0 0.5rem 0';
            btn.style.color = 'white';
            btn.onmouseover = btn.style.cursor = 'pointer';
        }
    }

    function styleTotals() {
        const tableDiv = document.getElementById('ce-table-div');
        tableDiv.style.display = 'flex';
        tableDiv.style.flexDirection = 'column';

        const totalsDiv = document.getElementById('pick-totals-div');
        totalsDiv.style.alignSelf = 'center';
        totalsDiv.style.display = 'flex';
        totalsDiv.style.gap = '6rem';

        const setDiv = document.getElementById('set-div');
        setDiv.style.display = 'flex';
        setDiv.style.flexDirection = 'column';
        setDiv.style.gap = '1rem';

        const setPickers = document.getElementById('set-pickers-div');
        setPickers.style.fontSize = '4rem';

        const activeDiv = document.getElementById('active-div');
        activeDiv.style.display = 'flex';
        activeDiv.style.flexDirection = 'column';
        activeDiv.style.gap = '1rem';

        const activePickers = document.getElementById('active-pickers-div');
        activePickers.style.fontSize = '4rem';
    }

    function styleLists() {
        const lists = Array.from(document.querySelectorAll('ul'));
        for (let list of lists) {
            list.style.height = '25rem';
            list.style.overflow = 'scroll';
            list.style.overflowX = 'hidden';
            list.style.display = 'flex';
            list.style.flexDirection = 'column';
            list.style.backgroundColor = 'white';
            list.style.padding = '1rem';
        }
    }

    function removeLiStyle() {
        const lis = Array.from(document.querySelectorAll('li'))
            .forEach(li => li.style.listStyle = 'none');
    }

    function styleSelectedLi() {
        const lis = Array.from(document.querySelectorAll('li'));
        lis.forEach(li => li.addEventListener('click', (e) => {
            for (let li of lis) {
                if (e.target === li) {
                    //if the li has not been selected, highlight it and set current selection to this li
                    if (!e.target.classList.contains('selected')) {
                        e.target.style.backgroundColor = 'darkblue';
                        e.target.style.color = 'white';
                        e.target.classList.add('selected');
                        if (li.classList.contains('current-path')) {
                            currentAssignedSelection = e.target.textContent;
                            currentAssignedList = e.target.parentElement.id;
                            currentFreeSelection = '';
                        } else {
                            currentFreeSelection = e.target.textContent;
                            currentAssignedSelection = '';
                            currentAssignedList = '';
                        }
                    } else {
                        //if the li has already been selected, deselect it and remove li from current selection
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = 'black';
                        e.target.classList.remove('selected');
                        currentAssignedSelection = '';
                        currentFreeSelection = '';
                        currentAssignedList = '';
                    }
                } else {
                    //update all other li's to not be highlighted
                    li.style.backgroundColor = 'white';
                    li.style.color = 'black';
                    li.classList.remove('selected');
                }
            }
        }))
    }

    function clearSelectedPath() {
        const lis = Array.from(document.querySelectorAll('li'));
        lis.forEach(li => li.classList.remove('selected'));
        currentFreeSelection = '';
        currentAssignedSelection = '';
    }

    function styleTables() {
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            table.style.textAlign = 'center';
            table.style.borderCollapse = 'collapse';
            table.style.margin = '1rem 2rem';

            const tds = Array.from(table.getElementsByClassName('row-td'));
            tds.forEach(td => {
                td.style.border = '1px solid black';
                td.style.padding = '3px 5px';
            })

            const rows = Array.from(table.getElementsByClassName('path-row'));
            for (let i = 0; i < rows.length; i++) {
                if (i % 2 !== 0) {
                    rows[i].style.backgroundColor = 'white';
                }
            }
        })

        const links = document.querySelectorAll('a');
        links.forEach(a => {
            a.onmouseover = () => {
                a.style.cursor = 'pointer';
                a.style.color = 'blue';
                a.style.borderBottom = '1px solid blue';
            }
            a.onmouseleave = () => {
                a.style.color = 'black';
                a.style.border = 'none';
            }
            a.style.textDecoration = 'none';
            a.style.color = 'black';
        })
    }

    loadPackTable();

    async function loadPackTable() {
        let data = await getPack();
        let dom = new DOMParser().parseFromString(data, 'text/html');

        console.log(dom.querySelectorAll('table'));
    }

    function getPack() {
        return new Promise((resolve) => {
            GM.xmlHttpRequest ({
                method: "GET",
                url: `https://insights.prod-na.pack.aft.a2z.com/packman/aggregate?fc=${fc}`,
                onreadystatechange: function(response) {
                    if (response.readyState == 4 && response.status === 200) {
                        resolve(this.response);
                    }
                }
            })
        })
    }
};