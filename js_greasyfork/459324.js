// ==UserScript==
// @name         Dwell Call Outs
// @namespace    https://github.com/samoore036/CF-TamperMonkey-Scripts
// @version      1.4
// @description  Organize cpt call outs by pack group and put in an easy to read format for visibility in tracking dwelling cages
// @author       mooshahe
// @match        https://rodeo-iad.amazon.com/*/ItemList?*
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/459324/Dwell%20Call%20Outs.user.js
// @updateURL https://update.greasyfork.org/scripts/459324/Dwell%20Call%20Outs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /*
    ---all global variables---
    */
    const fc = document.URL.split('/')[3];
    const rodeoLink = `https://rodeo-iad.amazon.com/${fc}/ExSD?yAxis=PROCESS_PATH&zAxis=WORK_POOL&shipmentTypes=ALL&exSDRange.quickRange=TODAY&exSDRange.dailyStart=00%3A00&exSDRange.dailyEnd=00%3A00&giftOption=ALL&fulfillmentServiceClass=ALL&fracs=NON_FRACS&isEulerExSDMiss=ALL&isEulerPromiseMiss=ALL&isEulerUpgraded=ALL&isReactiveTransfer=ALL&workPool=PredictedCharge&workPool=PlannedShipment&_workPool=on&workPool=ReadyToPick&workPool=ReadyToPickHardCapped&workPool=ReadyToPickUnconstrained&workPool=PickingNotYetPicked&workPool=PickingNotYetPickedPrioritized&workPool=PickingNotYetPickedNotPrioritized&workPool=PickingNotYetPickedHardCapped&workPool=CrossdockNotYetPicked&_workPool=on&workPool=PickingPicked&workPool=PickingPickedInProgress&workPool=PickingPickedInTransit&workPool=PickingPickedRouting&workPool=PickingPickedAtDestination&workPool=Inducted&workPool=RebinBuffered&workPool=Sorted&workPool=GiftWrap&workPool=Packing&workPool=Scanned&workPool=ProblemSolving&workPool=ProcessPartial&workPool=SoftwareException&workPool=Crossdock&workPool=PreSort&workPool=TransshipSorted&workPool=Palletized&_workPool=on&_workPool=on&processPath=&minPickPriority=MIN_PRIORITY&shipMethod=&shipOption=&sortCode=&fnSku=`;

    //remove this content as it is useless
    const displayElement = document.getElementsByClassName('shipment-list-tabs')[0];
    displayElement.textContent = '';

    const rows = Array.from(document.getElementsByClassName('result-table')[0].querySelectorAll('tr'));
    rows.shift(); //shift method removes first element of an array

    //dwellarray is a filtered list of each item to make sure we don't double count items from the same cage in the call out
    const dwellArray = [];

    /*arrays for each category. separated by singles pack group, multis pack group, bod/noncon/handtape grouped together, HOV and scanned
      with TNS sites having different variations of where they process the same process path, this grouping method captures the variation
      seen in our sites
    */
    const singles = [];
    const multis = [];
    const misc = [];
    const hov = [];
    const scanned = [];

    const cpt = document.getElementsByClassName('result-table')[0].querySelectorAll('tr')[1].querySelectorAll('td')[3].textContent.split(' ')[1];

    //get stats to display as a summary
    let nonPickableTotal = 0;
    let pickingPickedTotal = 0;
    let pickingPickedAvg = 0;
    let sortedTotal = 0;
    let sortedAvg = 0;
    let scannedTotal = 0;
    let scannedAvg = 0;
    let psolveTotal = 0;
    let psolveAvg = 0;
    addStats();

    function addStats() {
        // alert user if they did not include the options, else continue with the script
        if (!document.URL.includes('enabledColumns=LAST_EXSD&enabledColumns=OUTER_SCANNABLE_ID')) {
            displayOptionsError();
        } else {
            for (let i = 0; i < rows.length; i++) {
                let workPool = rows[i].querySelectorAll('td')[14].textContent.trim();
                let dwellTime = parseInt(rows[i].querySelectorAll('td')[15].textContent.trim().split('\n')[0]);
                switch (workPool) {
                    case 'PickingNotYetPickedNonPickable':
                    case 'ReadyToPickNonPickable':
                        nonPickableTotal++;
                        break;
                    case 'PickingPickedInProgress':
                    case 'PickingPickedInTransit':
                    case 'PickingPickedAtDestination':
                        pickingPickedTotal++;
                        pickingPickedAvg += dwellTime;
                        break;
                    case 'Sorted':
                        sortedTotal++;
                        sortedAvg += dwellTime;
                        break;
                    case 'Scanned':
                        scannedTotal++;
                        scannedAvg += dwellTime;
                        break;
                    case 'ProblemSolving':
                        psolveTotal++;
                        psolveAvg += dwellTime;
                }
            }
        }
    }

    class dwellCallout{
        constructor(scannableId, outerScannableId, pp, batchId, quantity, workPool, dwellTime) {
            this.scannableId = scannableId;
            this.outerScannableId = outerScannableId;
            this.pp = pp;
            this.batchId = batchId;
            this.quantity = quantity;
            this.workPool = workPool;
            this.dwellTime = dwellTime;
        }
    }

    /*
    ---array sorting logic---
    */
    filterToDwellArray();

    /*iterate through every row and create an object for it
      since
    */
    function filterToDwellArray() {
        for (let i = 0; i < rows.length; i++) {
            //if item is still PNYP or RTP, skip it as that is not a value-added call out to be made
            //also skip psolve and packing
            let workPool = rows[i].querySelectorAll('td')[14].textContent.trim();
            if (workPool.includes('PickingNotYetPicked') || workPool.includes('ReadyToPick') || workPool.includes('ProblemSolving') || workPool.includes('Packing')) {
                continue;
            }

            let dwellTime = rows[i].querySelectorAll('td')[15].textContent.trim().split('\n')[0];

            if (workPool.includes('PickingPickedInProgress')) {
                if (dwellTime < 60) {
                    continue;
                }
            }

            if (workPool.includes('PickingPickedInTransit')) {
                if (dwellTime < 50) {
                    continue;
                }
            }

            if (workPool.includes('PickingPickedAtDestination')) {
                if (dwellTime < 20) {
                    continue;
                }
            }

            if (workPool.includes('RebinBuffered')) {
                if (dwellTime < 30) {
                    continue;
                }
            }

            if (workPool.includes('Sorted')) {
                if (dwellTime < 30) {
                    continue;
                }
            }

            let quantity = parseInt(rows[i].querySelectorAll('td')[13].textContent.trim());

            let scannableId = rows[i].querySelectorAll('td')[5].textContent.trim();
            if (!scannableIsUnique(scannableId, quantity)) {
                continue;
            }

            let outerScannableId = rows[i].querySelectorAll('td')[6].textContent.trim();

            //if work pool is picking picked at destination, change data to outer scannable id for value-added call out
            if (workPool === 'PickingPickedAtDestination') {
                workPool = outerScannableId;
            }
            if (workPool === 'PickingPickedInTransit') {
                workPool = 'PPIT';
            }
            if (workPool === 'PickingPickedInProgress') {
                workPool = 'PPIP';
            }

            //if batch is in rebin buffered, change scannable id to rebin station for value-added call out
            if (workPool === 'RebinBuffered') {
                scannableId = outerScannableId;
            }

            let pp = rows[i].querySelectorAll('td')[10].textContent.trim().replace('PP', '');

            let batchId = rows[i].querySelectorAll('td')[12].textContent.trim();
            if (pp.includes('Multi')) {
                if (!batchIsUnique(batchId, quantity)) {
                continue;
                }
            }

            let dwellObj = new dwellCallout(scannableId, outerScannableId, pp, batchId, quantity, workPool, dwellTime);
            dwellArray.push(dwellObj);
            arraySort(dwellObj);
        }
    }

    /*check if the current obj has the same scannable id as previous entries
      if so, do not add to array and instead increase quantity for previous entry
      quantity is needed so that quantity can increase by the appropriate amount
    */
    function scannableIsUnique(id, quantity) {
        for (let obj of dwellArray) {
            if (obj.scannableId === id) {
                obj.quantity += quantity;
                return false;
            }
        }
        return true;
    }

    /*check if current batch id is same as previous entries
      if so, do not add to array and instead increase quantity for previous entry
    */
    function batchIsUnique(id, quantity) {
        for (let obj of dwellArray) {
            if (obj.batchId === id) {
                obj.quantity += quantity;
                return false;
            }
        }
        return true;
    }

    //put the object in the appropriate array which becomes it's own div display in rodeo
    function arraySort(obj) {
        //if item is in scanned, do not need to know process path
        if (obj.workPool === 'Scanned') {
            if (obj.dwellTime >= 30) {
                scanned.push(obj);
            }
            return;
        }
        switch(obj.pp) {
            case 'HOVAuto':
            case 'HOVSingle':
            case 'HOVAutoL':
            case 'HOVBOD':
            case 'HOVHeavy':
            case 'HOVNonCon':
            case 'HOVSIOC':
            case 'HOVNonAuto':
            case 'HOVBox':
                hov.push(obj);
                break;
            case 'MultiBldgWide':
            case 'MultiBldgWideOP':
            case 'MultiBldgWideOPVNA':
            case 'MultiFloor':
            case 'MultiMCF':
            case 'MultiDG':
            case 'MultiZappos':
            case 'MultiCASEPallet':
            case 'MultiWrap':
            case 'BatchCart':
                multis.push(obj);
                break;
            case 'SingleFloor':
            case 'SingleOP':
            case 'SingleOP2':
            case 'SingleOPVNA':
            case 'SingleOPZappos':
            case 'SingleFloorDG':
            case 'SingleCart':
            case 'SingleTray':
            case 'SingleTrayHVA':
            case 'SingleTrayHVB':
                singles.push(obj);
                break;
            case 'SingleOPBOD':
            case 'SingleFloorBOD':
            case 'SingleOPNonCon':
            case 'SingleOPNonConLong':
            case 'SingleFloorNonCon':
            case 'SingleFloorSIOC':
            case 'SingleOPSIOC':
            case 'SingleOPVNASIOC':
            case 'SingleOPWeights':
            case 'SingleFloorWeights':
            case 'SingleMCF':
            case 'SingleFloorMCF':
            case 'SingleFloorNonAuto':
            case 'SingleOPNonAuto':
            case 'SingleOPHandTape':
            case 'SingleFloorHandTape':
            case 'SingleTraySIOC':
            case 'SingleSp00SIOC':
                misc.push(obj);
                break;
        }
    }

    //sort arrays by quantity is the default
    sortArraysByQuantity();

    //convert dwell time to readable format
    function getReadableTime(time) {
        if (time === 0 || time === 'NaN') {
            return 'N/A';
        }
        let hours = Math.floor(time/60);
        let minutes = time - (hours * 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    }

    /*sort each array by quantity in descending order. quantity is the most value-added call out to make to site when chasing a cpt
      scanned is by default sorted by dwell time as each sp00 is unique so qty will never be more than 1
    */
    function sortArraysByQuantity() {
        singles.sort((a, b) => {return b.quantity - a.quantity});
        multis.sort((a, b) => {return b.quantity - a.quantity});
        misc.sort((a, b) => {return b.quantity - a.quantity});
        hov.sort((a, b) => {return b.quantity - a.quantity});
        scanned.sort((a, b) => {return b.dwellTime - a.dwellTime});
    }

    function sortArraysByDwellTime() {
        singles.sort((a, b) => {return b.dwellTime - a.dwellTime});
        multis.sort((a, b) => {return b.dwellTime - a.dwellTime});
        misc.sort((a, b) => {return b.dwellTime - a.dwellTime});
        hov.sort((a, b) => {return b.dwellTime - a.dwellTime});
        // scanned.sort((a, b) => {return b.dwellTime - a.dwellTime});
    }

    /*
    ---making tables for each array---
    */
    function makeSinglesTable() {
        const table = document.createElement('table');

        const titleRow = document.createElement('tr');

        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.textContent = `Singles for ${cpt}`;
        titleHeader.colSpan = '4';
        titleRow.appendChild(titleHeader);

        const headerRow = document.createElement('tr');

        const th1 = document.createElement('th');
        th1.textContent = 'Scannable Id';
        th1.classList.add('scannable-id');
        headerRow.appendChild(th1);

        const th2 = document.createElement('th');
        th2.textContent = 'Last Location';
        th2.classList.add('work-pool');
        headerRow.appendChild(th2);

        const th3 = document.createElement('th');
        th3.textContent = 'Quantity';
        th3.classList.add('quantity');
        headerRow.appendChild(th3);

        const th4 = document.createElement('th');
        th4.textContent = 'Dwell Time';
        th4.classList.add('dwell-time');
        headerRow.appendChild(th4);

        table.appendChild(titleRow);
        table.appendChild(headerRow);

        return table;
    }

    function makeMultisTable() {
        const table = document.createElement('table');

        const titleRow = document.createElement('tr');
        
        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.textContent = `Multis for ${cpt}`;
        titleHeader.colSpan = '5';
        titleRow.appendChild(titleHeader);

        const headerRow = document.createElement('tr');

        const th1 = document.createElement('th');
        th1.textContent = 'Scannable Id';
        th1.classList.add('scannable-id');
        headerRow.appendChild(th1);

        const th2 = document.createElement('th');
        th2.textContent = 'Last Location';
        th2.classList.add('work-pool');
        headerRow.appendChild(th2);

        const th3 = document.createElement('th');
        th3.textContent = 'Batch Id';
        th3.classList.add('batch-id');
        headerRow.appendChild(th3);

        const th4 = document.createElement('th');
        th4.textContent = 'Quantity';
        th4.classList.add('quantity');
        headerRow.appendChild(th4);

        const th5 = document.createElement('th');
        th5.textContent = 'Dwell Time';
        th5.classList.add('dwell-time');
        headerRow.appendChild(th5);

        table.appendChild(titleRow);
        table.appendChild(headerRow);

        return table;
    }

    //change title of table depending on pack group
    function makeMiscTable(pp) {
        const table = document.createElement('table');

        const titleRow = document.createElement('tr');

        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.textContent = `${pp} for ${cpt}`;
        titleHeader.colSpan = '5';
        titleRow.appendChild(titleHeader);
  
        const headerRow = document.createElement('tr');

        const th1 = document.createElement('th');
        th1.textContent = 'Scannable Id';
        th1.classList.add('scannable-id');
        headerRow.appendChild(th1);

        const th2 = document.createElement('th');
        th2.textContent = 'Last Location';
        th2.classList.add('work-pool');
        headerRow.appendChild(th2);

        const th3 = document.createElement('th');
        th3.textContent = 'Process Path';
        th3.classList.add('process-path');
        headerRow.appendChild(th3);

        const th4 = document.createElement('th');
        th4.classList.add('quantity');

        th4.textContent = 'Quantity';
        headerRow.appendChild(th4);

        const th5 = document.createElement('th');
        th5.classList.add('dwell-time');
        th5.textContent = 'Dwell Time';
        headerRow.appendChild(th5);

        table.appendChild(titleRow);
        table.appendChild(headerRow);

        return table;
    }

    function makeScannedTable() {
        const table = document.createElement('table');

        const titleRow = document.createElement('tr');

        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.textContent = `Scanned for ${cpt}`;
        titleHeader.colSpan = '3';
        titleRow.appendChild(titleHeader);

        const headerRow = document.createElement('tr');

        const th1 = document.createElement('th');
        th1.textContent = 'Sp00';
        th1.classList.add('scannable-id');
        headerRow.appendChild(th1);

        const th2 = document.createElement('th');
        th2.textContent = 'Last Location';
        th2.classList.add('process-path');
        headerRow.appendChild(th2);

        const th3 = document.createElement('th');
        th3.textContent = 'Dwell Time';
        th3.classList.add('dwell-time');
        headerRow.appendChild(th3);

        table.appendChild(titleRow);
        table.appendChild(headerRow);

        return table;
    }

    /*
    ---adding data to the respective table---
    */
    function addDataToSinglesTable(array, table) {
        for (let obj of array) {
            const row = document.createElement('tr');

            const td1 = document.createElement('td');
            td1.textContent = obj.scannableId;
            row.appendChild(td1);

            const td2 = document.createElement('td');
            td2.textContent = obj.outerScannableId;

            //if the cage is at a work station, highlight green
            if (td2.textContent.includes('ws')) {
                td2.style.backgroundColor = '#8ec1ef';
            }
            row.appendChild(td2);

            const td3 = document.createElement('td');
            td3.textContent = obj.quantity;
            row.appendChild(td3);

            const td4 = document.createElement('td');
            td4.textContent = getReadableTime(obj.dwellTime);

            // change color of cell based on dwell time
            switch (true) {
                case obj.dwellTime >= 360:
                    td4.style.backgroundColor = '#F8696B';
                    break;
                case obj.dwellTime >= 120:
                    td4.style.backgroundColor = '#ee821d';
                    break;
                case obj.dwellTime >= 60:
                    td4.style.backgroundColor = '#eee71d';
                    break;
                case obj.dwellTime >= 30:
                    td4.style.backgroundColor = '#39ca33';
                    break;
                case obj.dwellTime >= 0:
                    td4.style.backgroundColor = '#e2fae1';
                    break;
            }

            row.appendChild(td4);

            table.appendChild(row);
        }
    }

    function addDataToMultisTable(array, table) {
        for (let obj of array) {
            const row = document.createElement('tr');

            const td1 = document.createElement('td');
            td1.textContent = obj.scannableId;
            row.appendChild(td1);

            const td2 = document.createElement('td');
            td2.textContent = obj.outerScannableId;

            //if the cage is at a work station, highlight green
            if (td2.textContent.includes('ws')) {
                td2.style.backgroundColor = '#8ec1ef';
            }
            row.appendChild(td2);

            const td3 = document.createElement('td');
            td3.textContent = obj.batchId;
            row.appendChild(td3);

            const td4 = document.createElement('td');
            td4.textContent = obj.quantity;
            row.appendChild(td4);

            const td5 = document.createElement('td');
            td5.textContent = getReadableTime(obj.dwellTime);

            // change color of cell based on dwell time
            switch (true) {
                case obj.dwellTime >= 360:
                    td5.style.backgroundColor = '#F8696B';
                    break;
                case obj.dwellTime >= 120:
                    td5.style.backgroundColor = '#ee821d';
                    break;
                case obj.dwellTime >= 60:
                    td5.style.backgroundColor = '#eee71d';
                    break;
                case obj.dwellTime >= 30:
                    td5.style.backgroundColor = '#39ca33';
                    break;
                case obj.dwellTime >= 0:
                    td5.style.backgroundColor = '#e2fae1';
                    break;
            }

            row.appendChild(td5);

            table.appendChild(row);
        }
    }

    function addDataToMiscTable(array, table, category) {
        for (let obj of array) {
            const row = document.createElement('tr');

            const td1 = document.createElement('td');
            td1.textContent = obj.scannableId;
            row.appendChild(td1);

            const td2 = document.createElement('td');
            td2.textContent = obj.outerScannableId;

            //if the cage is at a work station, highlight green
            if (td2.textContent.includes('ws')) {
                td2.style.backgroundColor = '#8ec1ef';
            }
            row.appendChild(td2);

            const td3 = document.createElement('td');
            td3.textContent = obj.pp;
            row.appendChild(td3);

            const td4 = document.createElement('td');
            td4.textContent = obj.quantity;
            row.appendChild(td4);

            const td5 = document.createElement('td');
            td5.textContent = getReadableTime(obj.dwellTime);

            // change color of cell based on dwell time
            switch (true) {
                case obj.dwellTime >= 360:
                    td5.style.backgroundColor = '#F8696B';
                    break;
                case obj.dwellTime >= 120:
                    td5.style.backgroundColor = '#ee821d';
                    break;
                case obj.dwellTime >= 60:
                    td5.style.backgroundColor = '#eee71d';
                    break;
                case obj.dwellTime >= 30:
                    td5.style.backgroundColor = '#39ca33';
                    break;
                case obj.dwellTime >= 0:
                    td5.style.backgroundColor = '#e2fae1';
                    break;
            }

            row.appendChild(td5);

            table.appendChild(row);
        }
    }

    function addDataToScannedTable(array, table) {
        for (let obj of array) {
            const row = document.createElement('tr');

            const td1 = document.createElement('td');
            td1.textContent = obj.scannableId;
            row.appendChild(td1);

            const td2 = document.createElement('td');
            td2.textContent = obj.outerScannableId;

            //if the cage is at a work station, highlight green
            if (td2.textContent.includes('ws')) {
                td2.style.backgroundColor = '#8ec1ef';
            }
            row.appendChild(td2);

            const td3 = document.createElement('td');
            td3.textContent = getReadableTime(obj.dwellTime);

            // change color of cell based on dwell time
            switch (true) {
                case obj.dwellTime >= 360:
                    td3.style.backgroundColor = '#F8696B';
                    break;
                case obj.dwellTime >= 120:
                    td3.style.backgroundColor = '#ee821d';
                    break;
                case obj.dwellTime >= 60:
                    td3.style.backgroundColor = '#eee71d';
                    break;
                case obj.dwellTime >= 30:
                    td3.style.backgroundColor = '#39ca33';
                    break;
                case obj.dwellTime >= 0:
                    td3.style.backgroundColor = '#e2fae1';
                    break;
            }

            row.appendChild(td3);

            table.appendChild(row);
        }
    }

    /*
    ---main html elements which consists of a side bar and a content div---
    */
    function makeMainDisplayDiv() {
        const parentElement = document.getElementById('content-panel-padding');

         /*
        necessary to reset display when changing display by sort button
        or else it will keep adding the display on every press
        */
        if (document.getElementById('main-display-div') !== null) {
            const mainDiv = document.getElementById('main-display-div');
            mainDiv.parentElement.removeChild(mainDiv);
        }

        const mainDiv = document.createElement('div');
        mainDiv.setAttribute('id', 'main-display-div');

        mainDiv.appendChild(makeSideBar());
        mainDiv.appendChild(makeContentDiv());
       
        parentElement.prepend(mainDiv);
    }

    //contains sort button div, summary, legend, quick links (on load)
    function makeSideBar() {
        const sideBar = document.createElement('div');
        sideBar.setAttribute('id', 'sidebar');

        sideBar.appendChild(sortOptionDiv());

        const summaryTable = makeSummaryTable();
        styleTable(summaryTable);
        sideBar.appendChild(summaryTable);

        sideBar.appendChild(makeLegend());

        return sideBar;
    }

    //contains all tables for call outs 
    function makeContentDiv() {
        
        const contentDiv = document.createElement('div');
        contentDiv.setAttribute('id', 'content-div');
        //reset div so if sort buttons are pressed, resets display instead of adding to
        contentDiv.innerHTML = '';
        
        //only make table if there is a call out to display
        if (singles.length > 0) {
            const div = document.createElement('div');
            div.classList.add('table-div');

            const singlesTable = makeSinglesTable();
            addDataToSinglesTable(singles, singlesTable);
            styleTable(singlesTable);
            div.appendChild(singlesTable, 4);
            contentDiv.appendChild(div);
        }

        if (multis.length > 0) {
            const div = document.createElement('div');
            div.classList.add('table-div');

            const multisTable = makeMultisTable();
            addDataToMultisTable(multis, multisTable);
            styleTable(multisTable);
            div.appendChild(multisTable, 5);
            contentDiv.appendChild(div);
        }

        if (misc.length > 0) {
            const div = document.createElement('div');
            div.classList.add('table-div');

            const miscTable = makeMiscTable('BOD/NonCon/HandTape/Misc.');
            addDataToMiscTable(misc, miscTable, 'misc');
            styleTable(miscTable);
            div.appendChild(miscTable, 5);
            contentDiv.appendChild(div);
        }

        if (hov.length > 0) {
            const div = document.createElement('div');
            div.classList.add('table-div');

            const hovTable = makeMiscTable('HOV');
            addDataToMiscTable(hov, hovTable);
            styleTable(hovTable);
            div.appendChild(hovTable, 5);
            contentDiv.appendChild(div);
        }

        if (scanned.length > 0) {
            const div = document.createElement('div');
            div.classList.add('table-div');

            const scannedTable = makeScannedTable();
            addDataToScannedTable(scanned, scannedTable);
            styleTable(scannedTable);
            div.appendChild(scannedTable, 3);
            contentDiv.appendChild(div);
        }

        return contentDiv;
    }

    function makeLegend() {
        const div = document.createElement('div');
        div.classList.add('table-div');

        const table = document.createElement('table');

        const header = document.createElement('thead');

        const titleRow = document.createElement('tr');

        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.style.textAlign = 'center';

        titleHeader.textContent = 'Legend';
        titleHeader.colSpan = '1';
        titleRow.appendChild(titleHeader);
        table.appendChild(titleRow);

        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.textContent = 'at a work station';
        td1.style.backgroundColor = '#8ec1ef';
        td1.style.textAlign = 'center';
        td1.style.padding = '0 0.5rem 0 0.5rem';
        tr1.appendChild(td1);
        table.appendChild(tr1);
        

        const tr2 = document.createElement('tr');
        const td2 = document.createElement('td');
        td2.textContent = 'less than 30 min dwell';
        td2.style.backgroundColor = '#e2fae1';
        td2.style.textAlign = 'center';
        td2.style.padding = '0 0.5rem 0 0.5rem';
        tr2.appendChild(td2);
        table.appendChild(tr2);
        
        const tr3 = document.createElement('tr');
        const td3 = document.createElement('td');
        td3.textContent = 'dwelling 30 min - 1 hour';
        td3.style.backgroundColor = '#39ca33';
        td3.style.textAlign = 'center';
        td3.style.padding = '0 0.5rem 0 0.5rem';
        tr3.appendChild(td3);
        table.appendChild(tr3);
       
        const tr4 = document.createElement('tr');
        const td4 = document.createElement('td');
        td4.textContent = 'dwelling 1 - 2 hours';
        td4.style.backgroundColor = '#eee71d';
        td4.style.textAlign = 'center';
        td4.style.padding = '0 0.5rem 0 0.5rem';
        tr4.appendChild(td4);
        table.appendChild(tr4);
       
        const tr5 = document.createElement('tr');
        const td5 = document.createElement('td');
        td5.textContent = 'dwelling 2 - 6 hours';
        td5.style.backgroundColor = '#ee821d';
        td5.style.textAlign = 'center';
        td5.style.padding = '0 0.5rem 0 0.5rem';
        tr5.appendChild(td5);
        table.appendChild(tr5);
        
        const tr6 = document.createElement('tr');
        const td6 = document.createElement('td');
        td6.textContent = 'dwelling 6+ hours';
        td6.style.backgroundColor = '#f8696B';
        td6.style.textAlign = 'center';
        td6.style.padding = '0 0.5rem 0 0.5rem';
        tr6.appendChild(td6);
        table.appendChild(tr6);

        div.appendChild(table);

        return div;
    }

    function makeSummaryTable() {
        const div = document.createElement('div');
        div.classList.add('table-div');

        const table = document.createElement('table');
        table.setAttribute('id', 'summary-table');

        const header = document.createElement('thead');

        const titleRow = document.createElement('tr');

        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');

        titleHeader.textContent = 'Summary';
        titleHeader.colSpan = '3';
        titleHeader.style.textAlign = 'center';
        titleRow.appendChild(titleHeader);
        
        const headerRow = document.createElement('tr');

        const th1 = document.createElement('th');
        th1.textContent = 'Work Pool';
        th1.style.width = '2rem';
        headerRow.appendChild(th1);

        const th2 = document.createElement('th');
        th2.textContent = 'Total';
        th2.style.width = '2rem';
        headerRow.appendChild(th2);

        const th3 = document.createElement('th');
        th3.textContent = '⠀⠀Avg Dwell Time';
        headerRow.appendChild(th3);

        header.appendChild(titleRow);
        header.appendChild(headerRow);
        table.appendChild(header);

        table.appendChild(makeTableRow('Nonpickable', nonPickableTotal, ' '));
        table.appendChild(makeTableRow('Picking Picked', pickingPickedTotal, getReadableTime((pickingPickedAvg/pickingPickedTotal).toFixed(0))));
        table.appendChild(makeTableRow('Sorted', sortedTotal, getReadableTime((sortedAvg/sortedTotal).toFixed(0))));
        table.appendChild(makeTableRow('Scanned', scannedTotal, getReadableTime((scannedAvg/scannedTotal).toFixed(0))));
        table.appendChild(makeTableRow('Psolve', psolveTotal, getReadableTime((psolveAvg/psolveTotal).toFixed(0))));

        div.appendChild(table);

        return div;
    }

    function makeTableRow(wp, tot, avgDwell) {
        const tr = document.createElement('tr');

        const td1 = document.createElement('td');
        td1.textContent = wp;
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        td2.textContent = tot;
        tr.appendChild(td2);

        const td3 = document.createElement('td');
        td3.textContent = avgDwell;
        tr.appendChild(td3);

        return tr;
    }

    function makeLi(string) {
        const li = document.createElement('li');
        li.textContent = string;
        li.style.listStyle = 'none';
        return li;
    }

    function sortOptionDiv() {
        const div = document.createElement('div');
        div.style.border = '2px solid black';
        div.style.borderRadius = '0.3rem';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.gap = '0.5rem';
        div.style.padding = '0.5rem';

        const quantitySortBtn = document.createElement('button');
        quantitySortBtn.textContent = 'Sort by quantity';
        quantitySortBtn.addEventListener('click', sortByQuantity);
        div.appendChild(quantitySortBtn);

        const dwellTimeSortBtn = document.createElement('button');
        dwellTimeSortBtn.textContent = 'Sort by dwell time';
        dwellTimeSortBtn.addEventListener('click', sortByDwellTime);
        div.appendChild(dwellTimeSortBtn);

        return div;
    }

    function sortByQuantity() {
        sortArraysByQuantity();
        load();
    }

    function sortByDwellTime() {
        sortArraysByDwellTime();
        load();
    }

    async function makeQuickLinksDiv() {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.justifyContent = 'center';
        div.style.border = '2px solid black';
        div.style.padding = '1rem';
        div.style.borderRadius = '0.3rem';

        const table = document.createElement('table');

        const titleRow = document.createElement('tr');

        const titleHeader = document.createElement('th');
        titleHeader.classList.add('table-header');
        titleHeader.style.textAlign = 'center';

        titleHeader.textContent = 'Quick Links';
        titleHeader.colSpan = '1';
        titleRow.appendChild(titleHeader);
        table.appendChild(titleRow);

        let value = await makeRequest(rodeoLink)
        let dom = new DOMParser().parseFromString(value, 'text/html');

        let scannedLink = dom.getElementById('ScannedTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].querySelector('a').href;
        let psolveLink = dom.getElementById('ProblemSolvingTable').getElementsByClassName('grand-total')[0].getElementsByClassName('subtotal')[0].querySelector('a').href;

        let scannedTitle = scannedLink === null ? 'No scanned units!' : 'Total Scanned';
        let psolveTitle = psolveLink === null ? 'No psolve units!' : 'Total Psolve';

        const tr1 = document.createElement('tr');
        const td1 = document.createElement('td');
        td1.style.textAlign = 'center';
        td1.style.padding = '0 0.5rem 0 0.5rem';
        if (scannedLink !== null) {
            td1.appendChild(makeAnchorElement(scannedLink, scannedTitle))
        } else {
            td1.textContent = scannedTitle;
        }
        tr1.appendChild(td1);
        table.appendChild(tr1);

        const tr2 = document.createElement('tr');
        const td2 = document.createElement('td');
        td2.style.textAlign = 'center';
        td2.style.padding = '0 0.5rem 0 0.5rem';
        if (psolveLink !== null) {
            td2.appendChild(makeAnchorElement(psolveLink, psolveTitle))
        } else {
            td2.textContent = psolveTitle;
        }
        tr2.appendChild(td2);
        table.appendChild(tr2);

        div.appendChild(table);

        const sideBar = document.getElementById('sidebar');
        sideBar.appendChild(div);
    };

    function makeRequest(link) {
        return new Promise((resolve) => {
            GM.xmlHttpRequest ({
                    method: "GET",
                    url: link,
                    onreadystatechange: function(response) {
                        if(response.readyState == 4 && response.status == 200) {
                            resolve(this.response);
                        }
                    }
                })
        })
    }

    function makeAnchorElement(link, wp) {
        const a = document.createElement('a');
        a.setAttribute('href', link)
        a.innerHTML = wp;
        return a;
    }

    // alert user if they do not have the proper options checked as this is a very common error
    function displayOptionsError() {
        const div = document.getElementById('shipmentList.topPager');
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Please go to options and enable ONLY Last Expected Ship Date and Outer Scannable ID, save as default, then reload.';
        errorMessage.style.cssText += `
        font-weight: bold; color: red; background-color: yellow; width: 60%;
        `
        div.prepend(errorMessage);
    }

    /*
    ---styling elements---
    */
    function styleTable(table) {
        // table.style.border = '2px solid black';
        const tds = Array.from(table.querySelectorAll('td'));
        tds.forEach(td => td.style.textAlign = 'center');
        tds.forEach(td => td.style.padding = '0 0.5rem 0 0.5rem');
        const ths = Array.from(table.querySelectorAll('th'));
        ths.forEach(th => th.style.textAlign = 'center');

        //using arrays as each table has different columns and going by query selector will throw an error
        const scannableIdColumns = Array.from(table.getElementsByClassName('scannable-id'))
            .forEach(column => column.style.width = '10rem');

        const processPathColumns = Array.from(table.getElementsByClassName('process-path'))
            .forEach(column => column.style.width = '10rem');

        const workPoolColumns = Array.from(table.getElementsByClassName('work-pool'))
            .forEach(column => column.style.width = '3rem');

        const quantityColumns = Array.from(table.getElementsByClassName('quantity'))
            .forEach(column => column.style.width = '5rem');

        const dwellTimeColumns = Array.from(table.getElementsByClassName('dwell-time'))
            .forEach(column => column.style.width = '3rem');

        const batchIdColumns = Array.from(table.getElementsByClassName('batch-id'))
            .forEach(column => column.style.width = '2rem');
    }


    //can only dynamically style after divs have been created 
    function styleDivs() {
        styleSideBar();
        styleContentDiv();
        styleMainDisplayDiv();
        styleTableDivs();
        styleTableHeaders();
        styleSummary();
    }

    function styleSideBar() {
        const sideBar = document.getElementById('sidebar');
        sideBar.style.display = 'flex';
        sideBar.style.flexDirection = 'column';
        sideBar.style.gap = '1rem';
    }

    function styleContentDiv() {
        const contentDiv = document.getElementById('content-div');
        contentDiv.setAttribute('id', 'content-div');
        contentDiv.style.display = 'flex';
        contentDiv.style.flexWrap = 'wrap';
        contentDiv.style.gap = '3rem';
        contentDiv.style.alignItems = 'flex-start';
    }

    function styleMainDisplayDiv() {
        const div = document.getElementById('main-display-div');
        div.style.display = 'flex';
        div.style.gap = '1rem';
    }

    function styleTableDivs() {
        const divs = Array.from(document.querySelectorAll('.table-div'));
        for (let div of divs) {
            div.style.display = 'flex';
            div.style.justifyContent = 'center';
            div.style.border = '2px solid black';
            div.style.padding = '1rem';
            div.style.borderRadius = '0.3rem';
        }
    }

    function styleTableHeaders() {
        const headers = Array.from(document.querySelectorAll('.table-header'));
        for (let header of headers) {
            header.style.fontSize = '1.1rem';
            header.style.borderBottom = '2px solid black';
        }
    }

    function load() {
        makeMainDisplayDiv();
        styleDivs();
        makeQuickLinksDiv();
    }

    function styleSummary() {
        const table = document.getElementById('summary-table');
        const tds = table.querySelectorAll('td');
        for (let td of tds) {
            td.style.textAlign = 'center';
        }
    }

    load();
    
})();
