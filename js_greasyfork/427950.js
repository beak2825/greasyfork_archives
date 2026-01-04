// ==UserScript==
// @name         TCG Player Sales Display Data
// @namespace    https://www.tcgplayer.com/
// @version      0.52
// @description  Remove obfuscation around TCG Player Sales Data
// @author       Peter Creutzberger
// @match        https://www.tcgplayer.com/product/*
// @icon         https://www.tcgplayer.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427950/TCG%20Player%20Sales%20Display%20Data.user.js
// @updateURL https://update.greasyfork.org/scripts/427950/TCG%20Player%20Sales%20Display%20Data.meta.js
// ==/UserScript==

(function() {
    'use strict';
    writeDataRequestButton();

    const addCondition = () => ({
        totalSpend: 0,
        totalQtySold: 0,
        totalOrders:0,
        historicSalesData: {daysAgo:{}},
        orderQtyOverFour: 0,
        avgQtyPerOrder: function(totalQtySold,totalOrders ) {
            return (totalQtySold / totalOrders) > 0 ? (totalQtySold / totalOrders).toFixed(2) : 0;
        },
        marketPriceByOrder: function(totalSpend, totalOrders) {
            return (totalSpend / totalOrders).toFixed(2);
        }
    });

    const cleanPriceValue = (price) => +price.replace(/[^0-9.]/g,'');

    const strToInt = (str) => +str;

    const shapeSalesData = (salesData) => {
        return !salesData[1]?.children[1]?.innerHTML.includes('tcg-icon') ? {date: salesData[0].innerText, condition: mapCondition( salesData[1].getElementsByTagName('span')[0].innerText ), quantity: salesData[2].innerText, price: salesData[3].innerText} :
            {date: salesData[0].innerText, condition: `${ mapCondition( salesData[1].getElementsByTagName('span')[0].innerText ) } with Photo`, quantity: salesData[2].innerText, price: salesData[3].innerText};
    }

    const checkSaleDate = (salesArray, saleDate, price) => {
        if (!salesArray.earliestSaleDateData || !salesArray.latestSaleDateData) { return {earliestSaleDateData: {date: saleDate, price: price}, latestSaleDateData: {date: saleDate, price: price}}; }
        const dateFromSaleDate = new Date(saleDate).getTime();
        const dateFromEarliestSaleDate = new Date(salesArray.earliestSaleDateData.date).getTime();
        if (dateFromSaleDate < dateFromEarliestSaleDate || dateFromSaleDate === dateFromEarliestSaleDate) { return Object.assign(salesArray, {earliestSaleDateData: {date: saleDate, price: price}}); }
        const dateFromLatestSaleDate = new Date(salesArray.latestSaleDateData.date).getTime();
        if (dateFromSaleDate > dateFromLatestSaleDate || dateFromSaleDate === dateFromLatestSaleDate) { return Object.assign(salesArray, {latestSaleDateData: {date: saleDate, price: price}}); }
    }

    const checkOrderQty = (salesArray, date, qty, price) => { if ( !salesArray.largestQtySold || salesArray.largestQtySold.qty < qty) { return {largestQtySold: {date: date, qty: qty, price: price}}; } }

    const historicDataSetting = (salesArray, saleDate, dateDiff, price, qty) => {
        if (!salesArray.historicSalesData.daysAgo || !salesArray.historicSalesData.daysAgo[dateDiff]) { return {totalSpend: price, totalQtySold: qty, totalOrders: 1, saleDate: saleDate}; }
        const historicSalesDataStatus = salesArray.historicSalesData.daysAgo[dateDiff];
        return {totalSpend: historicSalesDataStatus.totalSpend += price, totalQtySold: historicSalesDataStatus.totalQtySold += qty, totalOrders: historicSalesDataStatus.totalOrders += 1, saleDate: saleDate};
    }

    const updateSalesTotals = (salesArray, price, qty) => {
        salesArray.totalSpend += (price * qty);
        salesArray.totalQtySold += qty;
        salesArray.totalOrders += 1;
        salesArray.orderQtyOverFour += qty < 4 ? 0 : 1
    }

    const gatherSalesData = () => {
        const salesByCondition = {};
        const historicDateArr = setHistoricDateArr(daysToLookBack());
        Array.from(document.getElementsByClassName('latest-sales-table__tbody')[0].children).forEach( listOfSales => {
            const reshapedSalesData = shapeSalesData( Array.from(listOfSales.getElementsByTagName('td')) );
            const currentCondition = reshapedSalesData.condition;
            if ( !Object.keys(salesByCondition).includes(currentCondition) ) { salesByCondition[currentCondition] = addCondition(); }
            const cleanPrice = cleanPriceValue(reshapedSalesData.price);
            Object.assign(salesByCondition[currentCondition],
                checkOrderQty(salesByCondition[currentCondition], reshapedSalesData.date, strToInt(reshapedSalesData.quantity), cleanPrice),
                checkSaleDate(salesByCondition[currentCondition], reshapedSalesData.date, cleanPrice)
            );
            updateSalesTotals(salesByCondition[currentCondition], cleanPrice, strToInt(reshapedSalesData.quantity));
            const saleDateDiff = historicDateArr.includes(reshapedSalesData.date) ? getSaleDateDiff(todaysDate, reshapedSalesData.date) : -1;
            if ( saleDateDiff > -1 ) {
                salesByCondition[currentCondition].historicSalesData.daysAgo[saleDateDiff] = historicDataSetting(salesByCondition[currentCondition], reshapedSalesData.date, saleDateDiff, cleanPrice, strToInt(reshapedSalesData.quantity));
            }
        })
        return salesByCondition;
    }

    const adjustSalesDataDivHeight = (div, timesToAdjustHeight) => (parseInt(div.style.height.replace(/[^0-9]/g,'')) + 115 * timesToAdjustHeight) + "px";

    const writeSalesDataContainer = () => {
        const salesDataDisplayDiv = document.createElement('div');
        const setBottom = document.getElementsByClassName("_hj_feedback_container")[0] ? 'bottom:100px' : 'bottom:0';
        salesDataDisplayDiv.innerHTML = (`<div class="salesDataDisplay" style="position:fixed;${setBottom};left:0;z-index:8888;width:auto;height:0;min-height:300px;max-height:600px;overflow-y:scroll;padding:0 5px 0 0;border:1px solid #d00;background:#999;color:#fff;line-height:normal"></div>`);
        document.body.prepend(salesDataDisplayDiv);
        return document.getElementsByClassName('salesDataDisplay')[0];
    }

    const displaySalesData = (salesByCondition, salesDataDisplayDiv) => {
        gatherTotalQtyInView( salesDataDisplayDiv );
        salesByCondition.forEach(cardConditionData => {
            const cardDisplayData = buildSalesDataDisplay(cardConditionData[0], cardConditionData[1]);
            salesDataDisplayDiv.innerHTML += cardDisplayData.cardDisplayData;
            salesDataDisplayDiv.style.height = adjustSalesDataDivHeight(salesDataDisplayDiv, cardDisplayData.timesToAdjustHeight);
        });
    }

    const buildSalesDataDisplay = (cardCondition, cardConditionData) => {
        let heightAdjustmentCount = 1;
        let cardDisplayString = `<div class="displayContainer"><strong>${cardCondition}</strong><br />
                <span id="salesHeader" style="margin-left: 20px;"><strong>Overall Sales Data</strong></span><br />
                <span id="totalSold" style="margin-left: 40px;">Total Sold: ${cardConditionData.totalQtySold} - Total Orders: ${cardConditionData.totalOrders} - Total Spend: ${cardConditionData.totalSpend.toFixed(2)}</span><br />
                <span id="avgQtyPerOrder" style="margin-left: 40px;">Avg Qty Per Order: ${cardConditionData.avgQtyPerOrder(cardConditionData.totalQtySold, cardConditionData.totalOrders)}</span><br />
                <span id="orderQtyOverFour" style="margin-left: 40px;">Orders with Qty 4+... ${cardConditionData.orderQtyOverFour}</span><br />
                <span id="earliestSaleDate" style="margin-left: 40px;">Earliest Sale Date: ${cardConditionData.earliestSaleDateData.date} - Sale Price ${cardConditionData.earliestSaleDateData?.price}</span><br />
                <span id="latestSaleData" style="margin-left: 40px;">Latest Sale Date: ${cardConditionData.latestSaleDateData.date} - Sale Price: ${cardConditionData.latestSaleDateData?.price}</span><br />
                <span id="largestOrderInfo" style="margin-left: 40px;">Largest Order... Date: ${cardConditionData.largestQtySold.date} - Qty: ${cardConditionData.largestQtySold.qty} - Price Per: ${cardConditionData.largestQtySold.price}</span><br />`;
        if ( Object.keys(cardConditionData.historicSalesData.daysAgo).length ) {
            heightAdjustmentCount++;
            cardDisplayString += `<br /><span id="historicSalesHeader" style="margin-left: 20px;"><strong>Historic Sales Data</strong></span><br />`;
            const historicSalesData = cardConditionData.historicSalesData;
            Object.keys(historicSalesData.daysAgo).forEach( daysAgo =>
                cardDisplayString += `<span id="${daysAgo}-daysAgoMarker" style="margin-left: 30px;"><strong>Days Ago: ${daysAgo} - ${historicSalesData.daysAgo[daysAgo].saleDate}</strong></span><br />
                        <span id="${daysAgo}-dayAgo-TotalSold" style="margin-left: 40px;">Total Orders: ${historicSalesData.daysAgo[daysAgo].totalOrders} - Total Spend: ${historicSalesData.daysAgo[daysAgo].totalSpend.toFixed(2)} - Total Qty Sold: ${historicSalesData.daysAgo[daysAgo].totalQtySold}</span><br />
                        <span id="${daysAgo}-dayAgo-AvgQtyPerOrder" style="margin-left: 40px;">Avg Qty Per Order: ${cardConditionData.avgQtyPerOrder(historicSalesData.daysAgo[daysAgo].totalQtySold, historicSalesData.daysAgo[daysAgo].totalOrders)}</span><br />
                        <span id="${daysAgo}-dayAgo-MarketPrice" style="margin-left: 40px;">Market Price: ${cardConditionData.marketPriceByOrder( historicSalesData.daysAgo[daysAgo].totalSpend, historicSalesData.daysAgo[daysAgo].totalOrders ) }</span><br />`
            );
        }
        cardDisplayString += `</div><br />`;
        return {cardDisplayData: cardDisplayString, timesToAdjustHeight: heightAdjustmentCount};
    }

    const decorateSalesHistoryHeader = (clickCount = 0) => {
        const fontColor = '#fa7ad0';
        const backgroundColor = '#7afaa4';
        document.getElementsByClassName('modal__title')[0].children[0].innerHTML = `<div style="color:${fontColor};background:${backgroundColor}">GATHERING SALES DATA - Click Count: ${clickCount}</span>`;
    }

    const toggleGatherDataButton = () => { document.getElementsByClassName('dataRequestButton')[0].disabled = !document.getElementsByClassName('dataRequestButton')[0].disabled; }

    async function loadSalesDataSplash() {
        //open sales modal
        document.getElementsByClassName("modal__activator")[0].click();
        await loadMoreSalesData();
        return gatherSalesData();
    }

    const beginSalesDataDisplay = (salesByCondition) => {
        //close sales modal
        document.getElementsByClassName('modal__close')[0].click()
        const salesDataDisplayDiv = writeSalesDataContainer();
        displaySalesData( Object.entries(salesByCondition).sort((conditionOne, conditionTwo) => conditionOne[1].totalQtySold - conditionTwo[1].totalQtySold ).reverse(), salesDataDisplayDiv );
    }

    async function loadMoreSalesData() {
        const maxClicks = 50;
        await sleep(500);
        for (let clickCount = 0; clickCount < maxClicks; clickCount++) {
            await sleep(600);
            decorateSalesHistoryHeader(clickCount);
            if ( document.getElementsByClassName("sales-history-snapshot__load-more__button")[0] ) { document.getElementsByClassName("sales-history-snapshot__load-more__button")[0].click(); }
            else { clickCount = maxClicks; }
        }
    }

    const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)); }

    const missingDomElements = ( elemsToCheck) => {
        let missingElements = 0;
        elemsToCheck.forEach( domElement => missingElements += domElement ? 0 : 1 );
        return missingElements > elemsToCheck.length;
    }

    window.startDataRequest = function() {
        clearHtmlElements();
        const priceGuide = document.getElementsByClassName("price-guide__more")[0]?.children[0];
        const modalActivator = document.getElementsByClassName("modal__activator");
        if ( missingDomElements( [priceGuide, modalActivator] ) ) { alert('TCGPlayer DOM Elements are out of alignment. This script must be updated to function properly.'); }
        else {
            toggleGatherDataButton();
            loadSalesDataSplash()
                .then(result => beginSalesDataDisplay(result))
                .then(() => writeSalesToggle())
                .finally(() => toggleGatherDataButton())
        }
    }

    /********************
    Pull in current quantity for sale in view
    ********************/

    const setQtyInViewByCondition = (condition, qty, qtyInView) => {
        const shorthandCondition = mapCondition(condition);
        if (Object.keys(qtyInView).includes(shorthandCondition)) {
            qtyInView[shorthandCondition].quantity += qty;
            qtyInView[shorthandCondition].vendorCount += 1;
            if( !qtyInView[shorthandCondition].largestQuantity || qtyInView[shorthandCondition].largestQuantity < qty) { qtyInView[shorthandCondition].largestQuantity = qty; }
        }
        else { qtyInView[shorthandCondition] = {quantity: qty, vendorCount: 1, largestQuantity: qty}; }
    }

    const mapCondition = (condition) => {
        const hasFoil = condition.match(/foil/gi) ? ' Foil' : '';
        const conditionMap = {
            'Near Mint': 'NM',
            'Lightly Played': 'LP',
            'Moderately Played': 'MP',
            'Heavily Played': 'HP',
            'Damaged': 'DMG',
            'Unopened': 'Sealed'
        };
        return (conditionMap[condition.replace(/( holofoil| foil)/gi, '')] || 'Unlisted') + hasFoil;
    }

    const getTotalQtyInView = (qtyInView) => Object.keys(qtyInView).reduce( (prevVal, conditionKey) => prevVal + qtyInView[conditionKey].quantity, 0);

    const getQtyInViewByCondition = () => {
        const qtyInView = {};
        if( document.getElementsByClassName('listing-item product-details__listings-results').length ) {
            Array.from(document.getElementsByClassName('listing-item product-details__listings-results')).forEach( listingItem => {
                const condition = listingItem.getElementsByClassName('listing-item__listing-data__info__condition')[0].innerText;
                const quantity = +listingItem.getElementsByClassName('add-to-cart__available')[0].innerText.split(' ')[1];
                setQtyInViewByCondition(condition, quantity, qtyInView );
            });
        } else {
            Array.from(document.getElementsByClassName('listing-item__listing-data')).forEach( listingItem => {
                let condition = '';
                // desktop classing
                if ( listingItem.getElementsByClassName('listing-item__listing-data__info__condition').length ) {
                    condition = listingItem.getElementsByClassName('listing-item__listing-data__info__condition')[0].innerText;
                }
                // mobile/small resolution classing
                if ( listingItem.getElementsByClassName('listing-item__listing-data__condition').length ) {
                    condition = listingItem.getElementsByClassName('listing-item__listing-data__condition')[0].innerText;
                }
                const quantity = +listingItem.getElementsByClassName('add-to-cart__available')[0].innerText.split(' ')[1];
                setQtyInViewByCondition(condition, quantity, qtyInView );
            });
        }
        return qtyInView;
    }

    const buildQtyInViewDisplay = (qtyInView) => Object.entries(qtyInView).reduce( (prevQtyData, currQty) => prevQtyData.concat(`<span style="margin-left: 20px;">${currQty[0]}: ${currQty[1].quantity} - Vendor Count: ${currQty[1].vendorCount} - Largest Qty: ${currQty[1].largestQuantity}</span><br />`), '');

    window.gatherTotalQtyInView = function( salesDataDisplayDiv = undefined) {
        if ( !salesDataDisplayDiv ) {
            clearHtmlElements();
            salesDataDisplayDiv = writeSalesDataContainer();
        }
        const qtyInViewByCondition = getQtyInViewByCondition();
        const totalQtyInView = getTotalQtyInView(qtyInViewByCondition);
        salesDataDisplayDiv.innerHTML += `<strong>Total copies in view: </strong>${totalQtyInView}<br />\
        <strong>Condition breakout:</strong><br />${buildQtyInViewDisplay(qtyInViewByCondition)}<br />`;
        writeSalesToggle();
    }

    /********************
    HTML element interaction
    ********************/

    const clearHtmlElements = () => {
        ['salesDataDisplay', 'salesDataToggle'].forEach( selector => {
            if ( document.getElementsByClassName(selector)[0] ) { document.getElementsByClassName(selector)[0].remove(); }
        });
    }

    window.toggleSalesData = function() {
        const display = document.getElementsByClassName('salesDataDisplay')[0].style.display;
        document.getElementsByClassName('salesDataDisplay')[0].style.display = display === 'none' ? 'inline' : 'none';
    }

    /********************
    Write interactive HTML elements
    ********************/

    const writeSalesToggle = () => {
        if ( !document.getElementsByClassName('salesDataToggle')[0] ) {
            const div = document.createElement('div');
            div.innerHTML = ('<button class="salesDataToggle" style="position:fixed;top:60px;left:0;z-index:9999;width:auto;height:20px;padding:0 5px 0 0;background:#0b0;color:#fff;font-weight:bold;" onclick="toggleSalesData()">Toggle Sales Data Display</button>');
            document.body.prepend(div);
        }
    }

    function writeDaysToLookBackSpinner() {
        const div = document.createElement('div');
        div.style.cssText = 'position:fixed;top:0;left:0;z-index:9999;width:auto;height:20px;padding:0 5px 0 0;background:#a00;color:#fff;font-size:10pt;font-weight:bold;appearance:inherit;';
        div.innerHTML = ('Days to Look Back <input type="number" class="daysToLookBack" id="daysToLookBack" min="0" max="7" step="1" value="2" style="height:20px;font-size:10pt!important"/>');
        document.body.prepend(div);
    }

    function writeDataRequestButton() {
        writeDaysToLookBackSpinner();
        const div = document.createElement('div');
        div.innerHTML = ('<button class="dataRequestButton" style="position:fixed;top:20px;left:0;z-index:9999;width:auto;height:20px;padding:0 5px 0 0;background:#00b;color:#fff;font-weight:bold;" onclick="startDataRequest()">Gather Sales Data</button>');
        document.body.prepend(div);
        writeGatherTotalCopiesButton()
    }

    function writeGatherTotalCopiesButton() {
        const div = document.createElement('div');
        div.innerHTML = ('<button class="qtyInViewButton" style="position:fixed;top:40px;left:0;z-index:9999;width:auto;height:20px;padding:0 5px 0 0;background:#AC00FF;color:#fff;font-weight:bold;" onclick="gatherTotalQtyInView()">Gather Quantity in View</button>');
        document.body.prepend(div);
    }

    /********************
    Re-inventing the wheel of time because we are not importing the moment library.
    ********************/

    const setHistoricDateArr = (daysToLookBack) => {
        let historicDatesArr = [];
        for (let dayCount = 0; dayCount <= daysToLookBack; dayCount++) {
            historicDatesArr.push( formatDateToTCG( new Date(Date.now() - (daysInMilliseconds(dayCount) ))) );
        }
        return historicDatesArr;
    }

    const formatDateToTCG = (date) => (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear().toString().slice(2);

    const parseStrDate = (stringDate) => {
        const dateArr = stringDate.split('/');
        return new Date(dateArr[2], dateArr[0] - 1, dateArr[1]);
    }

    const getSaleDateDiff = (firstDate, secondDate) => Math.ceil((parseStrDate(firstDate) - parseStrDate(secondDate)) / daysInMilliseconds(1) );

    const daysInMilliseconds = (days = 1) => 1000 * 60 * 60 * (24 * days);

    const daysToLookBack = () => +document.getElementsByClassName('daysToLookBack')[0].value >= 0 ? +document.getElementsByClassName('daysToLookBack')[0].value : 2;

    const todaysDate = formatDateToTCG(new Date());
})();
