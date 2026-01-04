// ==UserScript==
// @name         WME Sabbath Closures
// @description  Create closures for Sabbath and holidays.
// @namespace    https://greasyfork.org/users/gad_m/wme_sabbath_closures
// @version      1.0.7
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         data:image/png;base64,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
// @connect      raw.githubusercontent.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/461298/WME%20Sabbath%20Closures.user.js
// @updateURL https://update.greasyfork.org/scripts/461298/WME%20Sabbath%20Closures.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global I18n */
/* global GM_xmlhttpRequest */

(function() {

    'use strict';
    console.info('wme-sabbath-closures: loaded');

    const SCRIPT_ID = "wme-sabbath-closures";
    const WME_sabbath_restrictionDescPrefix = 'Updated by WME script on ';
    const WME_sabbath_reason = "\u05e1\u05d2\u05d5\u05e8 \u05d1\u05e9\u05d1\u05ea\u05d5\u05ea \u05d5\u05d7\u05d2\u05d9 \u05d9\u05e9\u05e8\u05d0\u05dc";
    const OPERATION_TO_DESCRIPTION = {
        1: "Update Restrictions",
        2: "Check if Closures Exist",
        3: "Delete Existing Closures",
        4: "Add Closures",
        5: "Add Closures For Specific Dates",
        6: "Update Restrictions of 'reverted' Segments"
    };

    const OPERATION_UPDATE_RESTRICTIONS = 1;
    const OPERATION_CHECK_IF_CLOSURES_EXIST = 2;
    const OPERATION_DELETE_EXISTING_CLOSURES = 3;
    const OPERATION_ADD_CLOSURES = 4;
    const OPERATION_ADD_CLOSURES_FOR_HOLIDAY = 5;
    const OPERATION_UPDATE_RESTRICTIONS_OF_REVERTED_SEGMENTS = 6; // ones that are open only on Sabbath

    const hardcodedMode = false;
    const WME_sabbath_segmentsAsJsonArray_hardcoded = [];
    const WME_sabbath_revertedSegmentsAsJsonArray_hardcoded = [];
    const WME_sabbath_holidaysSegmentsAsJsonArray_hardcoded = [];
    let WME_sabbath_segmentsAsJsonArray;
    let WME_sabbath_segmentsAsIDsArray;
    let WME_sabbath_revertedSegmentsAsJsonArray;
    let WME_sabbath_holidaysSegmentsAsJsonArray;
    let WME_sabbath_jerusalemTimesAsJson;
    let WME_sabbath_citiesAsJson;
    let WME_sabbath_csrfToken;
    let WME_sabbath_daylightSavingTime = initDaylightSavingTime();
    let WME_sabbath_checkClosuresResult;
    let WME_sabbath_existingRestrictions = [];
    let WME_sabbath_timeout;
    let WME_sabbath_existingClosures;
    let WME_sabbath_requestErrors;
    let WME_sabbath_setRestrictionsResult;
    let WME_sabbath_setRevertRestrictionsResult;
    let WME_sabbath_holidayDate;

    function afterWmeInitialized() {
        console.debug('wme-sabbath-closures: afterWmeInitialized()');
        Promise.resolve(W['loginManager']._getCsrfToken()).then(function (res) {
            WME_sabbath_csrfToken = res;
            console.info('wme-sabbath-closures: token: ' + res);
        });
        initUI();
    }

    function initUI() {
        console.debug('wme-sabbath-closures: initUI()');
        let registerSidebarTabResult = registerSidebarTab();
        W['userscripts'].waitForElementConnected(registerSidebarTabResult['tabLabel']).then(() => {
            registerSidebarTabResult['tabLabel'].innerText = "\u05e9\u05d0\u05d1\u05e2\u05e1";
        });
        W['userscripts'].waitForElementConnected(registerSidebarTabResult['tabPane']).then(() => {
            initTabPane(registerSidebarTabResult['tabPane']);
            registerUiEvents();
            checkDuplications(WME_sabbath_segmentsAsJsonArray, "WME_sabbath.Segments.json");
            checkDuplications(WME_sabbath_revertedSegmentsAsJsonArray, "RevertSegments.json");
            checkDuplications(WME_sabbath_holidaysSegmentsAsJsonArray, "WME_sabbath.HolidaysSegments.json");
        });
    }

    function registerSidebarTab() {
        console.debug('wme-sabbath-closures: registerSidebarTab()');
        try {
            W['userscripts'].removeSidebarTab(SCRIPT_ID);
            console.debug('wme-sabbath-closures: registerSidebarTab() removeSidebarTab() succeeded.');
        } catch (e) {
            console.debug('wme-sabbath-closures: registerSidebarTab() failed [OK] if not registered yet. Original error: ' + e);
        }
        return W['userscripts'].registerSidebarTab(SCRIPT_ID);
    }

    function initTabPane(tabPane) {
        console.debug('wme-sabbath-closures: initTabPane()');
        // highlight segments
        let section = document.createElement('p');
        section.style.paddingTop = "0px";
        section.style.direction = "rtl";
        //section.style.textIndent = "16px";
        section.id = "wmeSabbathSection";
        //let jerusalemDiff = 18;
        let jerusalemStartAt = getJerusalemStartTime();
        let text1 = document.createTextNode("\u05db\u05e0\u05d9\u05e1\u05ea \u05e9\u05d1\u05ea \u0028\u05d9\u002d\u05dd\u0029\u003a ");
        let l1 = document.createElement('label');
        l1.setAttribute("id", "jerusalemStartAt_label");
        l1.innerText = toHoursMinutes(jerusalemStartAt);
        let plannedTimesTitle = '\u05d6\u05de\u05e0\u05d9 \u05d7\u05e1\u05d9\u05de\u05d4 \u05de\u05ea\u05d5\u05db\u05e0\u05e0\u05d9\u05dd\u003a';
        let plannedJerusalemFromTime = new Date(jerusalemStartAt.getTime());
        let minutesMargin = getMinutesMargin();
        plannedJerusalemFromTime.setMinutes(jerusalemStartAt.getMinutes() - minutesMargin);

        // Tel Aviv
        let plannedTelAvivFromTime = new Date(plannedJerusalemFromTime);
        let tlvOffset = getMinutesOffset('TelAviv');
        plannedTelAvivFromTime.setMinutes(plannedTelAvivFromTime.getMinutes() + tlvOffset);

        // Haifa
        let plannedHaifaFromTime = new Date(plannedJerusalemFromTime);
        let haifaOffset = getMinutesOffset('Haifa');
        plannedHaifaFromTime.setMinutes(plannedHaifaFromTime.getMinutes() + haifaOffset);

        let plannedEndTime = new Date(jerusalemStartAt.getTime());
        // 76 = avg minutes between start and end at Jerusalem
        plannedEndTime.setMinutes(jerusalemStartAt.getMinutes() + 76 + minutesMargin);
        let jerB = document.createElement('b');
        jerB.append(text1, l1);
        let b1 = document.createElement('b');
        b1.innerText = '\u05de\u05e8\u05d5\u05d5\u05d7 \u05d1\u05d8\u05d7\u05d5\u05df\u003a ';
        let t1 = document.createTextNode(minutesMargin + ' \u05d3\u05e7\u05d5\u05ea');
        let b2 = document.createElement('b');
        b2.innerText = plannedTimesTitle;
        let b4 = document.createElement('b');
        b4.innerText = '\u05ea\u05dc \u05d0\u05d1\u05d9\u05d1\u003a '
        let label3 = document.createElement('label');
        label3.setAttribute("id", "plannedTelAvivFromTime_label");
        label3.innerText = toHoursMinutes(plannedTelAvivFromTime);
        let t3 = document.createTextNode( ' \u05e2\u05d3 ');
        let label4 = document.createElement('label');
        label4.setAttribute("id", "plannedEndTime2_label");
        label4.innerText = toHoursMinutes(plannedEndTime);
        section.append(jerB, document.createElement('br'), b1, t1, document.createElement('br'), document.createElement('br'), b2, document.createElement('br'), b4, label3, t3, label4, document.createElement('br'), document.createElement('br'));
        let input1 = document.createElement('input');
        input1.setAttribute("type", "checkbox");
        input1.setAttribute("id", "btn_daylightSavingTime");
        input1.setAttribute("title", "\u05e9\u05e2\u05d5\u05df \u05e7\u05d9\u05e5");
        input1.style.marginLeft = '8px';
        if (WME_sabbath_daylightSavingTime) {
            input1.setAttribute("checked", "");
        }
        let t5 = document.createTextNode( '\u05e9\u05e2\u05d5\u05df \u05e7\u05d9\u05e5');
        section.append(input1, t5, document.createElement('br'), document.createElement('br'));
        let b6 = document.createElement('b');
        b6.innerText = '\u05de\u05e1\u05e4\u05e8 \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05dc\u05e2\u05d3\u05db\u05d5\u05df\u003a ';
        let t6 = document.createTextNode( WME_sabbath_segmentsAsJsonArray.length + ' ');
        let a1 = document.createElement("a");
        a1.setAttribute("id", "segmentsListHtml");
        a1.innerText = "\u0028\u05e8\u05e9\u05d9\u05de\u05d4\u0029";
        a1.style.cursor = "pointer";
        let t7 = document.createTextNode( '.');
        let b7 = document.createElement('b');
        b7.innerText = '\u05de\u05e1\u05e4\u05e8 \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05dc\u05d7\u05d2\u05d9\u05dd \u05d1\u05dc\u05d1\u05d3\u003a ';
        let t8 = document.createTextNode( WME_sabbath_holidaysSegmentsAsJsonArray.length + ' ');
        let a2 = document.createElement("a");
        a2.setAttribute("id", "holidaysSegmentsListHtml");
        a2.innerText = "\u0028\u05e8\u05e9\u05d9\u05de\u05d4\u0029";
        a2.style.cursor = "pointer";
        let t9 = document.createTextNode( '.');
        let b8 = document.createElement('b');
        b8.innerText = '\u05de\u05e1\u05e4\u05e8 \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05d4\u05e4\u05d5\u05db\u05d9\u05dd \u0028\u05e4\u05ea\u05d5\u05d7\u05d9\u05dd \u05e8\u05e7 \u05d1\u05e9\u05d1\u05ea\u0029 \u05dc\u05e2\u05d3\u05db\u05d5\u05df\u003a ';
        let t10 = document.createTextNode( WME_sabbath_revertedSegmentsAsJsonArray.length + ' ');
        let a3 = document.createElement("a");
        a3.setAttribute("id", "revertedSegmentsListHtml");
        a3.innerText = "\u0028\u05e8\u05e9\u05d9\u05de\u05d4\u0029";
        a3.style.cursor = "pointer";
        let t11 = document.createTextNode( '.');
        let b9 = document.createElement('b');
        b9.innerText = '\u05e1\u05d4\u0022\u05db \u05dc\u05d1\u05d3\u05d9\u05e7\u05d4 \u0028\u05d4\u05db\u05dc \u05e4\u05d7\u05d5\u05ea \u05db\u05e4\u05d9\u05dc\u05d5\u05d9\u05d5\u05ea\u0029\u003a ' + removeDuplicateSegments(WME_sabbath_segmentsAsJsonArray.concat(WME_sabbath_revertedSegmentsAsJsonArray).concat(WME_sabbath_holidaysSegmentsAsJsonArray)).length;
        let b10 = document.createElement('b');
        b10.innerText = '\u05e1\u05d4\u0022\u05db \u05dc\u05d4\u05d2\u05d1\u05dc\u05d5\u05ea\u002f\u05e1\u05d2\u05d9\u05e8\u05d5\u05ea\u003a ' + removeDuplicateSegments(WME_sabbath_segmentsAsJsonArray.concat(WME_sabbath_revertedSegmentsAsJsonArray)).length;
        section.append(b6, t6, a1, t7, document.createElement('br'), b7, t8, a2, t9, document.createElement('br'), b8, t10, a3, t11, document.createElement('br'), b9, document.createElement('br'), b10, document.createElement('br'), document.createElement('br'));

        let table1 = document.createElement("table");
        table1.setAttribute("border", "1");
        table1.setAttribute("frame", "hsides");
        table1.setAttribute("rules", "rows");
        let tr1 = document.createElement("tr");
        let td11 = document.createElement("td");
        let input2 = document.createElement("input");
        input2.setAttribute("type", "button");
        input2.setAttribute("value", "\u05d1\u05d3\u05d5\u05e7 \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea");
        input2.setAttribute("id", "btn_checkClosuresButton");
        input2.style.width = "95%";
        td11.appendChild(input2);
        let td12 = document.createElement("td");
        let text12 = document.createTextNode( '\u05d1\u05d3\u05d9\u05e7\u05d4 \u05d4\u05d0\u05dd \u05d9\u05e9 \u05dc\u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u0028\u05d5\u05d0\u05d6 \u05d4\u05dd \u05e0\u05e2\u05d5\u05dc\u05d9\u05dd \u05dc\u05e2\u05e8\u05d9\u05db\u05d4\u0029.');
        td12.appendChild(text12);
        tr1.append(td11, td12);

        let tr3 = document.createElement("tr");
        let td31 = document.createElement("td");
        let input3 = document.createElement("input");
        input3.setAttribute("type", "button");
        input3.setAttribute("value", "\u05de\u05d7\u05e7 \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea");
        input3.setAttribute("id", "btn_deleteClosuresButton");
        input3.style.width = "95%";
        td31.appendChild(input3);
        let td32 = document.createElement("td");
        let text32 = document.createTextNode( '\u05de\u05d7\u05d9\u05e7\u05d4 \u05e9\u05dc \u05db\u05dc \u05d4\u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u05d1\u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05d4\u05de\u05d9\u05d5\u05e2\u05d3\u05d9\u05dd \u05dc\u05d4\u05d2\u05d1\u05dc\u05d5\u05ea \u05d1\u05e9\u05d1\u05ea \u0028\u05db\u05d9\u05d5\u05d5\u05df \u05e9\u05de\u05e7\u05d8\u05e2 \u05e2\u05dd \u05d4\u05d2\u05d1\u05dc\u05d4 \u05e0\u05e2\u05d5\u05dc \u05dc\u05e2\u05e8\u05d9\u05db\u05d4\u0029.');
        td32.appendChild(text32);
        tr3.append(td31, td32);

        let tr5 = document.createElement("tr");
        let td51 = document.createElement("td");
        let input4 = document.createElement("input");
        input4.setAttribute("type", "button");
        input4.setAttribute("value", "\u05e2\u05d3\u05db\u05df \u05d4\u05d2\u05d1\u05dc\u05d5\u05ea");
        input4.setAttribute("id", "btn_setRestrictionsButton");
        input4.style.width = "95%";
        td51.appendChild(input4);
        let td52 = document.createElement("td");
        let text52 = document.createTextNode( '\u05e2\u05d3\u05db\u05d5\u05df \u05d4\u05d2\u05d1\u05dc\u05d5\u05ea \u05e2\u05dc \u05d4\u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05d1\u05d4\u05ea\u05d0\u05dd \u05dc\u05d6\u05de\u05e0\u05d9 \u05d4\u05e9\u05d1\u05ea \u05d4\u05e0\u0022\u05dc.');
        td52.appendChild(text52);
        tr5.append(td51, td52);

        let tr7 = document.createElement("tr");
        let td71 = document.createElement("td");
        let input5 = document.createElement("input");
        input5.setAttribute("type", "button");
        input5.setAttribute("value", "\u05d4\u05d5\u05e1\u05e3 \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea");
        input5.setAttribute("id", "btn_addClosuresButton");
        input5.style.width = "95%";
        td71.appendChild(input5);
        let td72 = document.createElement("td");
        let text42 = document.createTextNode( '\u05d4\u05d5\u05e1\u05e4\u05ea \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u05dc\u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05dc\u05e1\u05d5\u05e4\u0022\u05e9 \u05d4\u05e7\u05e8\u05d5\u05d1 \u05d1\u05d4\u05ea\u05d0\u05dd \u05dc\u05d6\u05de\u05e0\u05d9 \u05d4\u05e9\u05d1\u05ea \u05d4\u05e0\u0022\u05dc.');
        td72.appendChild(text42);
        tr7.append(td71, td72);

        let tr9 = document.createElement("tr");
        let td91 = document.createElement("td");
        let input6 = document.createElement("input");
        input6.setAttribute("type", "button");
        input6.setAttribute("value", "\u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u05d7\u05d2");
        input6.setAttribute("id", "btn_addHolidayClosuresButton");
        input6.style.width = "95%";
        td91.appendChild(input6);
        let td92 = document.createElement("td");
        td92.style.paddingTop = "5px";
        let text92 = document.createTextNode(" \u05ea\u05d0\u05e8\u05d9\u05da\u003a ");
        let input92 = document.createElement("input");
        input92.setAttribute("type", "text");
        input92.setAttribute("id", "wmeSabbath_holidayDatePicker");
        input92.setAttribute("placeholder", "mm/dd/yyyy");
        input92.setAttribute("title", '\u05ea\u05d0\u05e8\u05d9\u05da \u05d1\u05e4\u05d5\u05e8\u05de\u05d8 \u006d\u006d\u002f\u0064\u0064\u002f\u0079\u0079\u0079\u0079');
        input92.style.height = "20px";
        input92.style.width = "100px";
        input92.setAttribute("type", "text");
        let text93 = document.createTextNode("\u05de\u05e1\u0027 \u05d9\u05de\u05d9\u05dd\u003a ");
        let select93 = document.createElement("select");
        select93.style.height = "25px";
        select93.style.width = "64px";
        select93.style.marginTop = "7px";
        select93.setAttribute("id", "wmeSabbath_holidayNumOfDays");
        let option1 = document.createElement("option");
        option1.setAttribute("value", "1");
        let textOption1 = document.createTextNode("1");
        option1.appendChild(textOption1);
        let option2 = document.createElement("option");
        option2.setAttribute("value", "2");
        let textOption2 = document.createTextNode("2");
        option2.appendChild(textOption2);
        let option3 = document.createElement("option");
        option3.setAttribute("value", "3");
        let textOption3 = document.createTextNode("3");
        option3.appendChild(textOption3);
        select93.append(option1, option2, option3);
        let text94 = document.createTextNode("\u05d4\u05d5\u05e1\u05e4\u05ea \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u05dc\u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05dc\u05ea\u05d0\u05e8\u05d9\u05da \u05e0\u05d1\u05d7\u05e8 \u05d1\u05d4\u05ea\u05d0\u05dd \u05dc\u05d6\u05de\u05e0\u05d9 \u05d4\u05e9\u05d1\u05ea \u05d4\u05e0\u0022\u05dc.");
        td92.append(text92, input92, document.createElement('br'), text93, select93, document.createElement('br'), text94);
        tr9.append(td91, td92);
        table1.append(tr1, tr3, tr5, tr7, tr9);

        section.append(table1);

        let label7 = document.createElement("label");
        label7.setAttribute("id", "result_label")
        label7.style.wordBreak = "break-word";
        let label8 = document.createElement("label");
        label8.setAttribute("id", "error_label")
        label8.style.wordBreak = "break-word";
        label8.style.color = "red";
        label8.style.fontWeight = "bold";
        section.append(label7, document.createElement('br'), label8);

        tabPane.append(section);

    }

    function registerUiEvents() {
        console.debug('wme-sabbath-closures: registerUiEvents()');
        jQuery('#btn_daylightSavingTime').on("click", daylightSavingTimeClick);
        jQuery('#btn_checkClosuresButton').on("click", checkClosuresButtonClick);
        jQuery('#btn_deleteClosuresButton').on("click", deleteClosuresButtonClick);
        jQuery('#btn_setRestrictionsButton').on("click", setRestrictionsButtonClick);
        jQuery('#btn_addClosuresButton').on("click", addClosuresButtonClick);
        jQuery('#btn_addHolidayClosuresButton').on("click", addHolidayClosuresButtonClick);
        jQuery('#segmentsListHtml').on("click", {segmentsList:WME_sabbath_segmentsAsJsonArray},openNewWidowSegmentsList);
        jQuery('#revertedSegmentsListHtml').on("click", {segmentsList:WME_sabbath_revertedSegmentsAsJsonArray},openNewWidowSegmentsList);
        jQuery('#holidaysSegmentsListHtml').on("click", {segmentsList:WME_sabbath_holidaysSegmentsAsJsonArray},openNewWidowSegmentsList);
    }

    /*
    * Opens a new browser tab to display all effected segments as a list
    */
    function openNewWidowSegmentsList(event) {
        let segmentsList = event.data.segmentsList;
        // prepare the data
        let items = [];
        // sort by city name
        for (let i = 0; i < segmentsList.length; i++) {
            let segment = segmentsList[i];
            if (typeof items[segment.cityName] === 'undefined') {
                items[segment.cityName] = [];
            }
            items[segment.cityName].push(segment);
        }
        let htmlContent = document.createElement("html");
        let head = document.createElement("head");
        let title = document.createElement("title");
        title.innerText = "&#1512;&#1513;&#1497;&#1502;&#1514; &#1492;&#1502;&#1511;&#1496;&#1506;&#1497;&#1501;"
        head.appendChild(title);
        let body = document.createElement("body");
        body.setAttribute("dir", "rtl");
        body.style.paddingTop = "20px";
        body.style.paddingRight = "50px";
        body.style.fontFamily = "'Open Sans','Alef',helvetica,sans-serif";
        let h2 = document.createElement("h2");
        h2.innerText = "\u05e8\u05e9\u05d9\u05de\u05ea \u05d4\u05de\u05e7\u05d8\u05e2\u05d9\u05dd";
        body.append(h2);
        for (let key in items) { // loop over cities
            if (items.hasOwnProperty(key)) {
                let h3 = document.createElement("h3");
                h3.innerText = key;
                body.append(h3);
                let citySegments = items[key];
                let ul = document.createElement("ul");
                for (let j = 0; j < citySegments.length; j++) { // loop over segments in city
                    let li = document.createElement("li");
                    let a = document.createElement("a");
                    a.setAttribute("target", "_blank");
                    a.setAttribute("href", composePermalink(citySegments[j].permalink));
                    a.innerText = citySegments[j].streetName
                    li.appendChild(a);
                    ul.appendChild(li)
                }
                body.append(ul);
            }
        }
        htmlContent.append(head, body);
        let newWindow = window.open("", "_blank");
        let newDocument = newWindow.document;
        newDocument.body.appendChild(htmlContent);
        newDocument.close();
    }

    /*
    * converts partial permalink from script json file to valid Waze permalink
    * In JSON file lon, lat and segment ID. e.g. lon=34.84654&lat=32.08035&segments=985948
    * Default values:
    *   layers: 4 (only roads)
    *   zoom: 8
    *   env: il
    **/
    function composePermalink(val) {
        let result = 'https://' + document.location.host + '/';
        if (I18n.locale !== 'en') {
            result += I18n.locale + '/';
        }
        result += 'editor/?env=il&lon=' + getQueryParam(val, 'lon') + '&lat=' + getQueryParam(val, 'lat') + '&s=3638528&zoom=8&segments=' + getQueryParam(val, 'segments');
        return result;
    }

    function daylightSavingTimeClick(val) {
        let offset = val.target.checked ? 1 : -1;
        let jerusalemStartAt_label = jQuery("#jerusalemStartAt_label");
        jerusalemStartAt_label.text(getWithTimeOffset(jerusalemStartAt_label.text(), offset, 0));
        let plannedTelAvivFromTime_label = jQuery("#plannedTelAvivFromTime_label");
        plannedTelAvivFromTime_label.text(getWithTimeOffset(plannedTelAvivFromTime_label.text(), offset, 0));
        let plannedEndTime2_label = jQuery("#plannedEndTime2_label");
        plannedEndTime2_label.text(getWithTimeOffset(plannedEndTime2_label.text(), offset, 0));
    }
    
    /**
     * Check if segments have closures button click
     */
    function checkClosuresButtonClick() {
        console.info("wme-sabbath-closures: checkClosuresButtonClick()")
        WME_sabbath_checkClosuresResult = resetCheckClosuresResult();
        //doSession();
        updateSabbathSegments(removeDuplicateSegments(WME_sabbath_segmentsAsJsonArray.concat(WME_sabbath_revertedSegmentsAsJsonArray).concat(WME_sabbath_holidaysSegmentsAsJsonArray)), true, OPERATION_CHECK_IF_CLOSURES_EXIST);
    }

    /**
     * Update segments restrictions button click
     */
    function setRestrictionsButtonClick() {
        console.debug("wme-sabbath-closures: setRestrictionsButtonClick()")
        WME_sabbath_setRestrictionsResult = resetSetRestrictionsResult();
        WME_sabbath_setRevertRestrictionsResult = resetSetRestrictionsResult();
        doSession();
        updateSabbathSegments(WME_sabbath_segmentsAsJsonArray, true, OPERATION_UPDATE_RESTRICTIONS);
        updateSabbathSegments(WME_sabbath_revertedSegmentsAsJsonArray, true, OPERATION_UPDATE_RESTRICTIONS_OF_REVERTED_SEGMENTS);
    }

    /**
     * Delete all segments closures button click
     */
    function deleteClosuresButtonClick() {
        console.info("wme-sabbath-closures: deleteClosuresButtonClick()")
        WME_sabbath_checkClosuresResult = resetCheckClosuresResult();
        //doSession();
        updateSabbathSegments(removeDuplicateSegments(WME_sabbath_segmentsAsJsonArray.concat(WME_sabbath_holidaysSegmentsAsJsonArray)), true, OPERATION_DELETE_EXISTING_CLOSURES);
    }

    /**
     * Add closures to segments button click
     */
    function addClosuresButtonClick() {
        console.info("wme-sabbath-closures: addClosuresButtonClick()")
        WME_sabbath_checkClosuresResult = resetCheckClosuresResult();
        //doSession();
        updateSabbathSegments(WME_sabbath_segmentsAsJsonArray, true, OPERATION_ADD_CLOSURES);
    }

    function addHolidayClosuresButtonClick() {
        console.info("wme-sabbath-closures: addHolidayClosuresButtonClick()")
        let dateValue = jQuery("#wmeSabbath_holidayDatePicker")[0].value;
        if (dateValue === '') {
            // must set date
            alert('\u05d1\u05d7\u05e8 \u05ea\u05d0\u05e8\u05d9\u05da');
            return;
        } else {
            let dateRegExp = '(0[1-9]|1[012])/(0[1-9]|[12][0-9]|3[01])/202[0-9]';
            if (!dateValue.match(dateRegExp)) {
                // must match expected format
                alert('\u05ea\u05d0\u05e8\u05d9\u05da \u05d1\u05e4\u05d5\u05e8\u05de\u05d8 \u006d\u006d\u002f\u0064\u0064\u002f\u0079\u0079\u0079\u0079');
                return;
            } else {
                // later than today
                WME_sabbath_holidayDate = new Date(dateValue.substring(6, 10) + '-' + dateValue.substring(0, 2) + '-' + dateValue.substring(3, 5));
                if (WME_sabbath_holidayDate < new Date()) {
                    // must be later than today
                    alert('\u05d4\u05ea\u05d0\u05e8\u05d9\u05da \u05e6\u05e8\u05d9\u05da \u05dc\u05d4\u05d9\u05d5\u05ea \u05de\u05d0\u05d5\u05d7\u05e8 \u05de\u05d4\u05d9\u05d5\u05dd');
                    return;
                }
            }
        }
        WME_sabbath_checkClosuresResult = resetCheckClosuresResult();
        //doSession();
        updateSabbathSegments(removeDuplicateSegments(WME_sabbath_segmentsAsJsonArray.concat(WME_sabbath_holidaysSegmentsAsJsonArray)), true, OPERATION_ADD_CLOSURES_FOR_HOLIDAY);
    }

    function doSession() {
        GM_xmlhttpRequest ( {
            method: "GET",
            url: 'https://' + document.location.host + W['Config'].paths.auth + '?language=' + I18n.locale,
            onload: function (responseObj) {
                if (responseObj.status === 200) {
                    //console.debug("wme-sabbath-closures: session created successfully");
                } else {
                    console.error("wme-sabbath-closures: : failed to create session. Status: " + responseObj.status + " text status: " + responseObj.response);
                }
            }
        });
    }

    /*
    * reset result objects between action clicks
    */
    function resetCheckClosuresResult() {
        jQuery("#result_label").empty();
        jQuery("#error_label").empty();
        WME_sabbath_requestErrors = [];
        return {};
    }

    /*
    * reset result objects between action clicks
    */
    function resetSetRestrictionsResult() {
        jQuery("#result_label").empty();
        return {
            updatedSegmentsCount: 0,
            notFoundSegments: [],
            notAllowedSegments: [],
            unknownReasonSegments: [],
            badRestrictionNumber: []
        };
    }

    function checkDuplications(jsonArraySegments, fileName) {
        // error handling - stop script if there are duplicate segments. this must be an error in data. no reason for duplications.
        let allProcessed = [];
        let duplicatedFound = [];
        for (const segment of jsonArraySegments) {
            let segmentID = getSegmentID(segment);
            if (allProcessed.includes(segmentID)) {
                duplicatedFound.push(segmentID);
            } else {
                allProcessed.push(segmentID);
            }
        }
        if (duplicatedFound.length > 0) {
            let msg = '\u05e1\u05d9\u05d2\u05de\u05e0\u05d8 \u05db\u05e4\u05d5\u05dc\u003a ' + duplicatedFound.join(" ") + ' ' + fileName;
            setErrorAndDisable(msg);
        }
    }

    function setErrorAndDisable(msg) {
        jQuery("input[id^='btn_']").prop("disabled", true);
        jQuery("#error_label").html(msg);
    }
    
    /*
    * Update segments.
    * operation === 1 update restrictions
    * operation === 2 check if closures exist
    * operation === 3 delete existing closures
    * operation === 4 add closures
    * operation === 5 add closures for specific holiday
    * operation === 6 update restrictions of 'reverted' segments - ones that are open only on Sabbath
    * This function enables recursive call
    */
    function updateSabbathSegments(jsonArraySegments, updateUI, operation) {
        console.info("wme-sabbath-closures: updateSabbathSegments() operation: '" + OPERATION_TO_DESCRIPTION[operation] + "'");
        if (jsonArraySegments.length === 0) {
            //done. nothing to do.
            return;
        }
        WME_sabbath_existingClosures = [];
        let interval = 1000;//((operation === OPERATION_CHECK_IF_CLOSURES_EXIST || operation === OPERATION_DELETE_EXISTING_CLOSURES)?800:1000);//to avoid http status 429 too many requests at the same time
        if (operation === OPERATION_CHECK_IF_CLOSURES_EXIST || operation === OPERATION_DELETE_EXISTING_CLOSURES) {
            checkClosureWithTimeout(jsonArraySegments, operation === OPERATION_DELETE_EXISTING_CLOSURES, interval).then(() => {
                console.info("wme-sabbath-closures: updateSabbathSegments() operation: '" + OPERATION_TO_DESCRIPTION[operation] + "' done!");
            });
            return;
        }
        let fromTimeRestriction = jQuery("#plannedTelAvivFromTime_label").text();
        let toTimeRestriction = jQuery("#plannedEndTime2_label").text();
        let timestamp = new Date();
        timestamp.setMinutes(timestamp.getMinutes() - timestamp.getTimezoneOffset());
        let restrictionDescription = WME_sabbath_restrictionDescPrefix + timestamp.toJSON().slice(0, 16).replace("T", " ") + " by " + (W['loginManager']['user']['userName'] || W['loginManager']['user']['attributes']['userName']);
        let nextFriday = getNextFriday();
        let nextSaturday = getNextSaturday();
        if (operation === OPERATION_ADD_CLOSURES_FOR_HOLIDAY) {
            // calc 1 day before - when the closure should start:
            WME_sabbath_holidayDate.setDate(WME_sabbath_holidayDate.getDate() - 1);
            nextFriday = getDateString(WME_sabbath_holidayDate);
            // calc when closure should end:
            WME_sabbath_holidayDate.setDate(WME_sabbath_holidayDate.getDate() + parseInt(jQuery("#wmeSabbath_holidayNumOfDays option:selected").text()));
            nextSaturday = getDateString(WME_sabbath_holidayDate);
        }
        let toTimeClosure = nextSaturday + " " + toTimeRestriction;

        // update in balk instead of for each one
        let balk = 10;
        let timeout = interval;
        for (let i = 0; i < jsonArraySegments.length; i += balk) {
            WME_sabbath_timeout = timeout;
            let closuresSubActions = [];
            let restrictionsSubActions = [];
            let segments = [];
            for (let j = 0; (j + i) < jsonArraySegments.length && j < balk; j++) {
                let segment = jsonArraySegments[i + j];
                let segmentID = getSegmentID(segment);
                if (operation !== OPERATION_CHECK_IF_CLOSURES_EXIST && !WME_sabbath_existingRestrictions.hasOwnProperty(segmentID)) {
                    // must check segment status and store existing TBR
                    jQuery("#error_label").html('\u05d7\u05d5\u05d1\u05d4 \u05dc\u05d1\u05d3\u05d5\u05e7 \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u05dc\u05e4\u05e0\u05d9 \u05e2\u05d3\u05db\u05d5\u05e0\u05d9\u05dd');
                    return;
                }
                segments.push(segment);
                let fromTimeClosure = nextFriday + " " + fromTimeRestriction;
                if (operation === OPERATION_ADD_CLOSURES_FOR_HOLIDAY && segment['start'] && segment['end']) {
                    window.console.log("wme-sabbath-closures: : holiday segment. start: " + segment['start'] + " end: " + segment['end']);
                    fromTimeClosure = nextFriday + " " + segment['start'];
                    toTimeClosure = nextSaturday + " " + segment['end'];
                }
                let closuresSubActionTrue = createClosuresSubActionPayload(segmentID, segment.cityName, segment.streetName, fromTimeClosure, toTimeClosure, true);
                let closuresSubActionFalse = createClosuresSubActionPayload(segmentID, segment.cityName, segment.streetName, fromTimeClosure, toTimeClosure, false);
                closuresSubActions.push(closuresSubActionTrue);
                closuresSubActions.push(closuresSubActionFalse);
                let restrictionsSubAction = createRestrictionsSubActionPayload(segmentID, fromTimeRestriction, toTimeRestriction, restrictionDescription);
                if (operation === OPERATION_UPDATE_RESTRICTIONS_OF_REVERTED_SEGMENTS) {
                    restrictionsSubAction = createRevertedRestrictionsSubActionPayload(segmentID, fromTimeRestriction, toTimeRestriction, restrictionDescription, segment['fwd'], segment.rev);
                }
                // handle existing restrictions (if not related to sabbath plugin - add them as well)
                WME_sabbath_existingRestrictions[segmentID].forEach(val => {
                    if (val.description == null || !val.description.startsWith(WME_sabbath_restrictionDescPrefix)) {
                        restrictionsSubAction._subActions[0].attributes.restrictions.push(val);
                    }
                });
                /*jQuery.each(WME_sabbath_existingRestrictions[segmentID].fwdRestrictions, function(i, val) {
                  if (val.description == null || !val.description.startsWith(WME_sabbath_restrictionDescPrefix)) {
                    restrictionsSubAction._subActions[0].attributes.fwdRestrictions.push(val);
                  }
                });
                jQuery.each(WME_sabbath_existingRestrictions[segmentID].revRestrictions, function(i, val) {
                  if (!val.description.startsWith(WME_sabbath_restrictionDescPrefix)) {
                    restrictionsSubAction._subActions[0].attributes.revRestrictions.push(val);
                  }
                });*/
                restrictionsSubActions.push(restrictionsSubAction);
            } // end j for
            let closuresParentSubActions = [createSubActions(closuresSubActions)];
            let closuresPayload = createPayload(closuresParentSubActions);
            let restrictionsPayload = createPayload(restrictionsSubActions);
            switch (operation) {
                case OPERATION_UPDATE_RESTRICTIONS:
                case OPERATION_UPDATE_RESTRICTIONS_OF_REVERTED_SEGMENTS:
                    doUpdateRestrictionsWithTimeout(restrictionsPayload, segments, updateUI, timeout, operation);
                    timeout += interval;
                    break;
                case OPERATION_ADD_CLOSURES:
                case OPERATION_ADD_CLOSURES_FOR_HOLIDAY:
                    doAddClosuresWithTimeout(closuresPayload, segments, timeout);
                    timeout += interval;
                    break;
            }
        }
    }

    /*
    * Convert date object to string in format yyyy-mm-dd
    */
    function getDateString(date) {
        let month = date.getMonth() + 1;
        let dayInMonth = date.getDate();
        return date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (dayInMonth < 10 ? '0' + dayInMonth : dayInMonth);
    }

    function createRevertedRestrictionsSubActionPayload(segmentID, fromTimeVal, toTimeVal, descriptionVal, fwd, rev) {
        let directionVal;
        if (fwd && rev) {
            directionVal = "BOTH";
        } else if (fwd) {
            directionVal = "FWD";
        } else {
            directionVal = "REV"
        }
        //let sundayToThursdayRestriction =  {allDay:true, fromTime:null, toTime:null, fromDate:null, toDate:null, vehicleTypes:-1, days:31, description:descriptionVal, difficult:false};
        let sundayToThursdayRestriction = {
            editable: true,
            defaultType: "BLOCKED",
            description: descriptionVal,
            timeFrames: [{fromTime: null, toTime: null, startDate: null, endDate: null, weekdays: 79}],
            driveProfiles: {},
            direction: directionVal,
            disposition: 1,
            laneType: null
        };
        //let fridayRestriction =  {allDay:false, fromTime:"00:00", toTime:fromTimeVal, fromDate:null, toDate:null, vehicleTypes:-1, days:32, description:descriptionVal, difficult:false};
        let fridayRestriction = {
            editable: true,
            defaultType: "BLOCKED",
            description: descriptionVal,
            timeFrames: [{fromTime: "0:00", toTime: fromTimeVal, startDate: null, endDate: null, weekdays: 16}],
            driveProfiles: {},
            direction: directionVal,
            disposition: 1,
            laneType: null
        };
        //let sabbathRestriction = {allDay:false, fromTime:toTimeVal, toTime:"00:00", fromDate:null, toDate:null, vehicleTypes:-1, days:64, description:descriptionVal, difficult:false};
        let sabbathRestriction = {
            editable: true,
            defaultType: "BLOCKED",
            description: descriptionVal,
            timeFrames: [{fromTime: toTimeVal, toTime: "0:00", startDate: null, endDate: null, weekdays: 32}],
            driveProfiles: {},
            direction: directionVal,
            disposition: 1,
            laneType: null
        };
        let restrictionsVal = [sundayToThursdayRestriction, fridayRestriction, sabbathRestriction];
        //let fwdRestrictionsVal = [];
        //if (fwd) {
//       fwdRestrictionsVal.push(sundayToThursdayRestriction);
//       fwdRestrictionsVal.push(fridayRestriction);
//       fwdRestrictionsVal.push(sabbathRestriction);
//     }
//     let revRestrictionsVal = [];
//     if (rev) {
//       revRestrictionsVal.push(fridayRestriction);
//       revRestrictionsVal.push(sabbathRestriction);
//       revRestrictionsVal.push(sundayToThursdayRestriction);
//     }

//     let attributesVal = {fwdRestrictions:fwdRestrictionsVal, revRestrictions:revRestrictionsVal, id:segmentID};
        let attributesVal = {restrictions: restrictionsVal, id: segmentID};

        let subActionVal = {_objectType: "segment", action: "UPDATE", attributes: attributesVal};
        let subActionsVal = [subActionVal];
        return {name: "MultiAction", _subActions: subActionsVal};
    }

    function createClosuresSubActionPayload(segmentID, cityName, streetName, startDateVal, endDateVal, forwardVal) {
        return {
            _objectType: "roadClosure",
            action: "ADD",
            attributes: {
                reason: WME_sabbath_reason,
                location: streetName + ", " + cityName,
                segID: segmentID,
                id: W.model['roadClosures'].generateUniqueID(),
                startDate: startDateVal,
                endDate: endDateVal,
                forward: forwardVal,
                permanent: true
            }
        }
    }

    function createRestrictionsSubActionPayload(segmentID, fromTimeVal, toTimeVal, descriptionVal) {
        //let fridayRestriction =  {allDay:false, fromTime:fromTimeVal, toTime:"00:00", fromDate:null, toDate:null, vehicleTypes:-1, days:32, description:descriptionVal};
        let fridayRestriction = {
            editable: true,
            defaultType: "BLOCKED",
            description: descriptionVal,
            timeFrames: [{fromTime: fromTimeVal, toTime: "0:00", startDate: null, endDate: null, weekdays: 16}],
            driveProfiles: {},
            direction: "BOTH",
            disposition: 1,
            laneType: null
        };
        //let sabbathRestriction = {allDay:false, fromTime:"00:00", toTime:toTimeVal, fromDate:null, toDate:null, vehicleTypes:-1, days:64, description:descriptionVal};
        let sabbathRestriction = {
            editable: true,
            defaultType: "BLOCKED",
            description: descriptionVal,
            timeFrames: [{fromTime: "0:00", toTime: toTimeVal, startDate: null, endDate: null, weekdays: 32}],
            driveProfiles: {},
            direction: "BOTH",
            disposition: 1,
            laneType: null
        };
        let restrictionsVal = [fridayRestriction, sabbathRestriction];
        //let fwdRestrictionsVal = [];
        //fwdRestrictionsVal.push(fridayRestriction);
        //fwdRestrictionsVal.push(sabbathRestriction);
        //let revRestrictionsVal = [];
        //revRestrictionsVal.push(fridayRestriction);
        //revRestrictionsVal.push(sabbathRestriction);

        //let attributesVal = {fwdRestrictions:fwdRestrictionsVal, revRestrictions:revRestrictionsVal, id:segmentID};
        let attributesVal = {restrictions: restrictionsVal, id: segmentID};

        let subActionVal = {_objectType: "segment", action: "UPDATE", attributes: attributesVal};
        let subActionsVal = [subActionVal];
        return {name: "MultiAction", _subActions: subActionsVal};
    }

    function createSubActions(subActionsVal) {
        return {name: "MultiAction", _subActions: subActionsVal};
    }

    function createPayload(subActions) {
        let actionsVal = {name: "CompositeAction", _subActions: subActions};
        return {actions: actionsVal};
    }

    async function checkClosureWithTimeout(segments, checkAndDelete, interval) {
        const allSegmentIDs = segments.map(segment => getSegmentID(segment));
        const processedSegmentIDs = new Set();
        for (const segment of segments) {
            let segmentID = getSegmentID(segment);
            if (!processedSegmentIDs.has(segmentID)) {
                processedSegmentIDs.add(segmentID);
                await checkClosure(segment, checkAndDelete, allSegmentIDs, processedSegmentIDs);
                await new Promise((resolve) => setTimeout(resolve, interval)); // Wait for 500ms
            } else {
                console.debug(`wme-sabbath-closures: checkClosureWithTimeout() segment ${segment.permalink} already processed, skipping...`);
            }
        }
    }

    function doUpdateRestrictionsWithTimeout(restrictionsPayload, segments, updateUI, timeout, operation) {
        setTimeout(function () {
            doUpdateRestrictions(restrictionsPayload, segments, updateUI, operation);
        }, timeout);
    }

    function doAddClosuresWithTimeout(closuresPayload, segments, timeout) {
        setTimeout(function () {
            doAddClosures(closuresPayload, segments);
        }, timeout);
    }

    function doUpdateRestrictions(payload, segments, updateUI, operation) {
        let segmentsIDs = segments.map(it => getSegmentID(it));
        console.debug('wme-sabbath-closures: doUpdateRestrictions() for segments: ' + segmentsIDs + '...');
        let segmentsLength = segments.length;
        let urlVal = "https://" + document.location.host + W['Config'].paths.features + "?language=" + I18n.locale + "&bbox=34.846128%2C32.080247%2C34.846817%2C32.080445";
        GM_xmlhttpRequest ( {
            method: "POST",
            headers: {
                "X-CSRF-Token": WME_sabbath_csrfToken,
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01"
            },
            url: urlVal,
            responseType: 'json',
            data: JSON.stringify(payload),
            contentType: "application/json; charset=UTF-8",
            onload: function (responseObj) {
                if (responseObj.status === 200) {
                    console.debug('wme-sabbath-closures: doUpdateRestrictions() for segments: ' + segmentsIDs + ' returned 200.');
                    Object.values(responseObj.response.segments).forEach(val => {
                        // expect 4 restrictions
                        if (operation === OPERATION_UPDATE_RESTRICTIONS) {
                            //let restNum = val.fwdRestrictions.length + val.revRestrictions.length;
                            let restNum = val.restrictions.length;
                            //if (restNum < 4 && updateUI) {
                            if (restNum < 2 && updateUI) {
                                // can be more than 4 if there are non sabbath related restrictions
                                console.error('wme-sabbath-closures: : only ' + restNum + ' restrictions were set to segment ' + val.id);
                                WME_sabbath_setRestrictionsResult.badRestrictionNumber.push(val.id);
                            }
                        }
                    });
                    if (operation === OPERATION_UPDATE_RESTRICTIONS) {
                        WME_sabbath_setRestrictionsResult.updatedSegmentsCount += segmentsLength;
                    } else {
                        WME_sabbath_setRevertRestrictionsResult.updatedSegmentsCount += segmentsLength;
                    }
                    updateResultUI4UpdateRestrictions(updateUI, operation);
                } else {
                    if (responseObj.status === 500) {
                        try {
                            // workaround. unknown reason. 1 by 1 succeed.
                            let code = JSON.parse(responseObj.response)['errorList'][0].code;
                            if (code === 300 && segmentsLength > 1) {
                                /*console.error('wme-sabbath-closures: : ' + data.responseText + ' for number of segments: ' + this.segments.length);
                                let split = Math.round(this.segments.length/2);
                                WME_sabbath_timeout += 1000;
                                console.error('wme-sabbath-closures: ' + data.responseText + ' retry for segments: 0-' + split);
                                doUpdateRestrictionsWithTimeoutFallback(this.segments.slice(0,split));
                                WME_sabbath_timeout += 1000;
                                console.error('wme-sabbath-closures: ' + data.responseText + ' retry for segments: ' + split + "-" + this.segments.length);
                                doUpdateRestrictionsWithTimeoutFallback(this.segments.slice(split,this.segments.length));*/
                                for (let i = 0; i < segmentsLength; i++) {
                                    WME_sabbath_timeout += 1000;
                                    doUpdateRestrictionsWithTimeoutFallback([segments[i]], WME_sabbath_timeout, operation);
                                }
                                return;
                            }
                        } catch (e) {
                        }
                        console.error('wme-sabbath-closures: status 500:' + responseObj.response + '. The following segments were not updated: ' + JSON.stringify(segments));
                        return;
                    }
                    let segmentID;
                    if (responseObj.response && responseObj.response['errorList'] && responseObj.response['errorList'].length > 0) {
                        segmentID = responseObj.response['errorList'][0].objects[0].id;
                    } else {
                        console.error('wme-sabbath-closures: no segment ID as there is no error list. HTTP Status:' + responseObj.status + " Response Text:\n" + responseObj.response);
                    }
                    let pushTo;
                    let pushToParent = (operation === OPERATION_UPDATE_RESTRICTIONS) ? WME_sabbath_setRestrictionsResult : WME_sabbath_setRevertRestrictionsResult
                    if (segmentID && typeof segmentID !== 'undefined') {
                        switch (responseObj.status) {
                            case 406:
                                pushTo = pushToParent.notFoundSegments;
                                break;
                            case 403:
                                pushTo = pushToParent.notAllowedSegments;
                                break;
                            default:
                                pushTo = pushToParent.unknownReasonSegments;
                                console.error('wme-sabbath-closures: response:\n' + responseObj.response);
                                break;
                        }
                        // remove problematic segments and re-update
                        let found = false;
                        for (let i = 0; i <= segmentsLength; i++) {
                            if (getSegmentID(segments[i]) === segmentID) {
                                found = true;
                                if (typeof pushTo !== 'undefined') {
                                    pushTo.push(segments[i]);
                                }
                                segments.splice(i, 1);
                                break;
                            }
                        }
                        if (found) {
                            updateSabbathSegments(segments, updateUI, operation);
                        } else {
                            alert('wme-sabbath-closures: unknown error caused the following segments not to be updated: ' + JSON.stringify(segments));
                        }
                    } else {
                        alert('wme-sabbath-closures: unknown error caused the following segments not to be updated: ' + JSON.stringify(segments) + '. Check console for more details');
                    }
                    updateResultUI4UpdateRestrictions(updateUI, operation);
                }
            }
        });
    }

    function doAddClosures(payload, segments) {
        let segmentsLength = segments.length;
        let segmentsIDs = segments.map(it => getSegmentID(it));
        console.debug('wme-sabbath-closures: doAddClosures() for segments: ' + segmentsIDs + '...');
        if (typeof WME_sabbath_checkClosuresResult.numOfAddSuccess === 'undefined') {
            WME_sabbath_checkClosuresResult.numOfAddSuccess = 0;
            WME_sabbath_checkClosuresResult.numOfAddFail = 0;
            WME_sabbath_checkClosuresResult.numOfAddAlreadyExists = 0;
        }
        let urlVal = "https://" + document.location.host + W['Config'].paths.features + "?language=" + I18n.locale + "&bbox=0,0,0,0";
        GM_xmlhttpRequest ({
            url: urlVal,
            method: "POST",
            headers: {
                "X-CSRF-Token": WME_sabbath_csrfToken,
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01"
            },
            responseType: 'json',
            data: JSON.stringify(payload),
            contentType: "application/json; charset=UTF-8",
            onload: function (data) {
                if (data.status === 200) {
                    console.debug('wme-sabbath-closures: doAddClosures() for segments: ' + segmentsIDs + ' returned 200.');
                    for (let i = 0; i < segments.length; i++) {
                        if (data.response.segments[getQueryParam(segments[i].permalink, 'segments')]['hasClosures']) {
                            WME_sabbath_checkClosuresResult.numOfAddSuccess++;
                        } else {
                            let segmentCreatedOn = new Date(data.response.segments[getQueryParam(segments[i].permalink, 'segments')]['createdOn']).toISOString().slice(0, 10);
                            let segmentUpdatedOn = new Date(data.response.segments[getQueryParam(segments[i].permalink, 'segments')]['updatedOn']).toISOString().slice(0, 10);
                            console.error('wme-sabbath-closures: failed to add closures for segment ' + segments[i].permalink + '. Expected if map was not built since segment creation/update creation date: ' + segmentCreatedOn +  ' update: ' + segmentUpdatedOn);
                            WME_sabbath_checkClosuresResult.numOfAddFail++;
                        }
                    }
                    updateResultUI4checkClosure();
                } else {
                    console.warn('wme-sabbath-closures: doAddClosures() for segments: ' + segmentsIDs + ' returned ' + data.status + "!");
                    try {
                        // workaround. unknown reason. 1 by 1 succeed.
                        let code = data.response['errorList'][0].code;
                        if (data.status === 500 && code === 300 && segmentsLength > 1) {
                            for (let i = 0; i < segmentsLength; i++) {
                                WME_sabbath_timeout += 1000;
                                doAddClosuresWithTimeoutFallback([segments[i]], WME_sabbath_timeout);
                            }
                            return;
                        } else if (data.status === 406 && code === 500 && data.response['errorList'][0].details.startsWith('Road Closure time is overlapped -')) {
                            WME_sabbath_checkClosuresResult.numOfAddAlreadyExists += segmentsLength;
                            updateResultUI4checkClosure();
                            return;
                        }
                    } catch (e) {
                        console.error('wme-sabbath-closures: failed parsing/updating closures for segments. Exception:\n' + e + "\nData:\n" + JSON.stringify(data.response, null, 4));
                    }
                    WME_sabbath_checkClosuresResult.numOfAddFail += segmentsLength;
                    updateResultUI4checkClosure();
                }
            }// onload
        });
    }

    function doAddClosuresWithTimeoutFallback(segments, timeout) {
        setTimeout(function () {
            updateSabbathSegments(segments, true, OPERATION_ADD_CLOSURES);
        }, timeout);
    }

    function getRefreshHrefA() {
        let hrefVal
        try {
            hrefVal = jQuery('.WazeControlPermalink').find('a')[1].href;
        } catch (e) {
        }
        if (typeof hrefVal === 'undefined') {
            hrefVal = 'javascript:history.go(0);';
        }
        let a = document.createElement("a");
        a.setAttribute("href", hrefVal);
        a.innerText = '\u05d8\u05e2\u05df \u05de\u05d7\u05d3\u05e9 \u05d0\u05ea \u05d4\u05d3\u05e4\u05d3\u05e4\u05df';
        return a;
    }

    /*
    * updates the result UI (invoked by each GM_xmlhttpRequest call)
    */
    function updateResultUI4UpdateRestrictions(updateUI) {
        if (!updateUI) {
            return;
        }
        let resultLabel = jQuery("#result_label");
        resultLabel.empty();
        let b1 = document.createElement("b");
        b1.innerText = WME_sabbath_setRestrictionsResult.updatedSegmentsCount;
        resultLabel.append(b1, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e2\u05d5\u05d3\u05db\u05e0\u05d5 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4\u002e"), document.createElement("br"));
        if (WME_sabbath_setRestrictionsResult['notFoundSegments'].length > 0) {
            let b2 = document.createElement("b");
            b2.innerText = WME_sabbath_setRestrictionsResult['notFoundSegments'].length.toString();
            resultLabel.append(b2, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05d0\u05d9\u05e0\u05dd \u05e7\u05d9\u05d9\u05de\u05d9\u05dd ("));
            resultLabel.append(segments2html(WME_sabbath_setRestrictionsResult['notFoundSegments']));
            resultLabel.append(document.createTextNode(")"), document.createElement("br"));
        }
        if (WME_sabbath_setRestrictionsResult.notAllowedSegments.length > 0) {
            let b3 = document.createElement("b");
            b3.innerText = WME_sabbath_setRestrictionsResult['notAllowedSegments'].length.toString();
            resultLabel.append(b3, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e0\u05e2\u05d5\u05dc\u05d9\u05dd \u05dc\u05e2\u05e8\u05d9\u05db\u05d4 ("));
            resultLabel.append(segments2html(WME_sabbath_setRestrictionsResult.notAllowedSegments));
            resultLabel.append(document.createTextNode(")"), document.createElement("br"));
        }
        if (WME_sabbath_setRestrictionsResult['unknownReasonSegments'].length > 0) {
            let b4 = document.createElement("b");
            b4.innerText =  WME_sabbath_setRestrictionsResult['unknownReasonSegments'].length.toString();
            resultLabel.append(b4, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05dc\u05d0 \u05e2\u05d5\u05d3\u05db\u05e0\u05d5 \u05de\u05e1\u05d9\u05d1\u05d4 \u05dc\u05d0 \u05d9\u05d3\u05d5\u05e2\u05d4 ("));
            resultLabel.append(segments2html(WME_sabbath_setRestrictionsResult['unknownReasonSegments']));
            resultLabel.append(document.createTextNode(")"), document.createElement("br"));
        }
        if (WME_sabbath_setRestrictionsResult['badRestrictionNumber'].length > 0) {
            let b5 = document.createElement("b");
            b5.innerText =  WME_sabbath_setRestrictionsResult['badRestrictionNumber'].length.toString();
            let b6 = document.createElement("b");
            b6.style.color = "red";
            b6.innerText =  "\u05e0\u05d0 \u05dc\u05d3\u05d5\u05d5\u05d7 \u05db\u05ea\u05e7\u05dc\u05d4 \u05d1\u05e1\u05e7\u05e8\u05d9\u05e4\u05d8\u002e";
            resultLabel.append(b5, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05d1\u05d4\u05dd \u05de\u05e1\u05e4\u05e8 \u05d4\u05d2\u05d1\u05dc\u05d5\u05ea \u05e9\u05d1\u05d5\u05e6\u05e2\u05d5 \u05d1\u05e4\u05d5\u05e2\u05dc \u05dc\u05d0 \u05ea\u05e7\u05d9\u05df\u002e "), b6, document.createElement("br"));
        }
        let b7 = document.createElement("b");
        b7.innerText =  "\u05de\u05ea\u05d5\u05da " + (WME_sabbath_setRestrictionsResult.updatedSegmentsCount + WME_sabbath_setRestrictionsResult.notFoundSegments.length + WME_sabbath_setRestrictionsResult.notAllowedSegments.length + WME_sabbath_setRestrictionsResult.unknownReasonSegments.length) + ' \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e8\u05d2\u05d9\u05dc\u05d9\u05dd.';
        resultLabel.append(b7, document.createElement("br"));
        // reverted:
        let b8 = document.createElement("b");
        b8.innerText = WME_sabbath_setRevertRestrictionsResult.updatedSegmentsCount;
        resultLabel.append(b8, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e2\u05d5\u05d3\u05db\u05e0\u05d5 \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4\u002e"), document.createElement("br"));
        if (WME_sabbath_setRevertRestrictionsResult['notFoundSegments'].length > 0) {
            let b9 = document.createElement("b");
            b9.innerText = WME_sabbath_setRevertRestrictionsResult['notFoundSegments'].length.toString();
            resultLabel.append(b9, document.createElement(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05d0\u05d9\u05e0\u05dd \u05e7\u05d9\u05d9\u05de\u05d9\u05dd ("));
            resultLabel.append(segments2html(WME_sabbath_setRevertRestrictionsResult['notFoundSegments']));
            resultLabel.append(document.createTextNode(")"), document.createElement("br"));
        }
        if (WME_sabbath_setRevertRestrictionsResult['notAllowedSegments'].length > 0) {
            let b10 = document.createElement("b");
            b10.innerText = WME_sabbath_setRevertRestrictionsResult['notAllowedSegments'].length.toString();
            resultLabel.append(b10, document.createElement(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e0\u05e2\u05d5\u05dc\u05d9\u05dd \u05dc\u05e2\u05e8\u05d9\u05db\u05d4 ("));
            resultLabel.append(segments2html(WME_sabbath_setRevertRestrictionsResult['notAllowedSegments']));
            resultLabel.append(document.createTextNode(")"), document.createElement("br"));
        }
        if (WME_sabbath_setRevertRestrictionsResult['unknownReasonSegments'].length > 0) {
            let b11 = document.createElement("b");
            b11.innerText = WME_sabbath_setRevertRestrictionsResult['unknownReasonSegments'].length.toString();
            resultLabel.append(b11, document.createElement(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05dc\u05d0 \u05e2\u05d5\u05d3\u05db\u05e0\u05d5 \u05de\u05e1\u05d9\u05d1\u05d4 \u05dc\u05d0 \u05d9\u05d3\u05d5\u05e2\u05d4 ("));
            resultLabel.append(segments2html(WME_sabbath_setRevertRestrictionsResult['unknownReasonSegments']));
            resultLabel.append(document.createTextNode(")"), document.createElement("br"));
        }
        if (WME_sabbath_setRevertRestrictionsResult['badRestrictionNumber'].length > 0) {
            let b12 = document.createElement("b");
            b12.innerText = WME_sabbath_setRevertRestrictionsResult['badRestrictionNumber'].length.toString();
            let b13 = document.createElement("b");
            b13.style.color = "red";
            b13.innerText = '\u05e0\u05d0 \u05dc\u05d3\u05d5\u05d5\u05d7 \u05db\u05ea\u05e7\u05dc\u05d4 \u05d1\u05e1\u05e7\u05e8\u05d9\u05e4\u05d8\u002e';
            resultLabel.append(b12, document.createElement(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05d1\u05d4\u05dd \u05de\u05e1\u05e4\u05e8 \u05d4\u05d2\u05d1\u05dc\u05d5\u05ea \u05e9\u05d1\u05d5\u05e6\u05e2\u05d5 \u05d1\u05e4\u05d5\u05e2\u05dc \u05dc\u05d0 \u05ea\u05e7\u05d9\u05df\u002e "), b13, document.createElement("br"));
        }
        let b14 = document.createElement("b");
        b14.innerText = "\u05de\u05ea\u05d5\u05da " + (WME_sabbath_setRevertRestrictionsResult.updatedSegmentsCount + WME_sabbath_setRevertRestrictionsResult.notFoundSegments.length + WME_sabbath_setRevertRestrictionsResult.notAllowedSegments.length + WME_sabbath_setRevertRestrictionsResult.unknownReasonSegments.length) + ' \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u0022\u05d4\u05e4\u05d5\u05db\u05d9\u05dd\u0022.';
        let b15 = document.createElement("b");
        b15.innerText = "\u05e1\u05d4\u0022\u05db: " + (WME_sabbath_setRestrictionsResult.updatedSegmentsCount + WME_sabbath_setRestrictionsResult.notFoundSegments.length + WME_sabbath_setRestrictionsResult.notAllowedSegments.length + WME_sabbath_setRestrictionsResult.unknownReasonSegments.length + WME_sabbath_setRevertRestrictionsResult.updatedSegmentsCount + WME_sabbath_setRevertRestrictionsResult.notFoundSegments.length + WME_sabbath_setRevertRestrictionsResult.notAllowedSegments.length + WME_sabbath_setRevertRestrictionsResult.unknownReasonSegments.length);
        resultLabel.append(b14, document.createElement("br"), b15, document.createElement("br"), document.createElement("br"));
        resultLabel.append(getRefreshHrefA());
    }

    /*
    * converts an array of segments to html array of hyperlinks, to show nice result on error segments
    */
    function segments2html(segments) {
        let result = [];
        if (typeof segments !== 'undefined') {
            for (let i = 0; i < segments.length; i++) {
                let a1 = document.createElement("a");
                a1.setAttribute("href", composePermalink(segments[i].permalink));
                a1.setAttribute("target", "blank");
                a1.setAttribute("title", segments[i].streetName + ', ' + segments[i].cityName);
                a1.innerText = getSegmentID(segments[i]).toString();
                result.push(a1);
                if ((i + 1) < segments.length) {
                    result.push(document.createTextNode(','));
                }
            }
        }
        return result;
    }

    function checkClosure(segment, checkAndDelete, allSegmentIDs, processedSegmentIDs) {
        let lat = parseFloat(getQueryParam(segment.permalink, 'lat'));
        let lon = parseFloat(getQueryParam(segment.permalink, 'lon'));
        let segmentID = parseInt(getQueryParam(segment.permalink, 'segments'));
        let segmentFound = false;
        // to get all roadTypes: roadTypes=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13%2C14%2C15%2C16%2C17%2C18%2C19%2C20%2C21
        // to get only roads: roadTypes=1%2C2%2C4%2C7%2C17
        let urlVal = "https://" + document.location.host + W['Config'].paths.features + "?roadTypes=1%2C2%2C4%2C7%2C8%2C17%2C20&roadClosures=true&bbox=" + (lon - 0.03) + "," + (lat - 0.03) + "," + (lon + 0.03) + "," + (lat + 0.03) + "&language=" + I18n.locale;
        console.debug('wme-sabbath-closures: checkClosure() for segment: ' + segmentID + '...');
        GM_xmlhttpRequest ({
            url: urlVal,
            responseType: 'json',
            method: "GET",
            onload: function (data) {
                if (data.status === 200) {
                    console.debug('wme-sabbath-closures: checkClosure() returned 200 for segment: ' + segmentID + '.');
                    let toDeleteClosuresFromSegments = [];
                    if (data.response['roadClosures']) {
                        // loop existing road closures:
                        data.response['roadClosures'].objects.forEach(val => {
                            // if there is an 'active' road closures, for a segment which is part of Sabbath script
                            if (allSegmentIDs.includes(val.segID) && val['closureStatus'] !== "FINISHED") {
                                if (typeof WME_sabbath_checkClosuresResult[val.segID] === 'undefined') {
                                    WME_sabbath_checkClosuresResult[val.segID] = [];
                                }
                                console.debug('wme-sabbath-closures: checkClosure() found closure for segment: ' + val.segID + '. Closure ID: ' + val.id);
                                // save existing closures
                                // by this script
                                if (val.reason === WME_sabbath_reason) {
                                    let res = {segment: segment, closureID: val.id}
                                    WME_sabbath_checkClosuresResult[val.segID].push(res);
                                    toDeleteClosuresFromSegments.push({segmentID:val.segID, closureID: val.id});
                                } else {
                                    // not by this script
                                    if (typeof WME_sabbath_existingClosures[val.segID] === 'undefined') {
                                        WME_sabbath_existingClosures[val.segID] = [];
                                    }
                                    let theSegment = WME_sabbath_segmentsAsJsonArray.find(seg => getSegmentID(seg) === val.segID);
                                    WME_sabbath_existingClosures[val.segID].push(theSegment);
                                }
                            }
                        });
                    }
                    if (checkAndDelete) {
                        doDeleteClosures(toDeleteClosuresFromSegments);
                    }
                    data.response.segments.objects.forEach(val => {
                        // save existing restrictions
                        if (allSegmentIDs.includes(val.id)) {
                            if (typeof WME_sabbath_checkClosuresResult[val.id] === 'undefined') {
                                WME_sabbath_checkClosuresResult[val.id] = [];
                            }
                            if (segmentID !== val.id && !processedSegmentIDs.has(val.id)) {
                                console.debug('wme-sabbath-closures: checkClosure() found a new additional segment: ' + val.id + '.');
                                processedSegmentIDs.add(val.id);
                            } else if (segmentID === val.id) {
                                segmentFound = true;
                                console.debug('wme-sabbath-closures: checkClosure() found the planned segment: ' + val.id + '.');
                            }
                            //WME_sabbath_existingRestrictions[val.id] = {fwdRestrictions:val.fwdRestrictions,revRestrictions:val.revRestrictions};
                            WME_sabbath_existingRestrictions[val.id] = val.restrictions;
                        }
                    });
                    if (!segmentFound) {
                        console.warn('wme-sabbath-closures: checkClosure() for segment: ' + segmentID + ' not found!');
                        let res = {segment: segment, notFound: true};
                        WME_sabbath_checkClosuresResult[segmentID] = [res];
                    }
                    updateResultUI4checkClosure();
                } else {
                    console.warn('wme-sabbath-closures: checkClosure() for segment: ' + segmentID + ' returned ' + data.status + "!");
                    if (typeof WME_sabbath_requestErrors[data.status] === 'undefined') {
                        WME_sabbath_requestErrors[data.status] = 1;
                    } else {
                        WME_sabbath_requestErrors[data.status] = WME_sabbath_requestErrors[data.status] + 1;
                    }
                    console.error('wme-sabbath-closures: error getting closure status for segment: ' + segmentID + '. Response:\n' + JSON.stringify(data.response));
                }
            }// on load
        });
    }

    function doDeleteClosures(segments) {
        if (typeof segments === 'undefined' || segments.length === 0) {
            return;//nothing to do
        }
        let segmentsIDs = segments.map(s => s.segmentID);
        console.debug('wme-sabbath-closures: doDeleteClosures() for segments: ' + segmentsIDs + '...');
        let subActions = [];
        for (let i = 0; i < segments.length; i++) {
            let subAction = {
                _objectType: "roadClosure", action: "DELETE", attributes: {
                    id: "" + segments[i].closureID,
                    segID: segments[i].segmentID,
                }
            };
            subActions.push(subAction);
        }
        let payload = {
            actions:
                {
                    name: "CompositeAction",
                    _subActions: [{
                        name: "MultiAction",
                        _subActions: subActions
                    }
                    ]
                }
        };
        let urlVal = "https://" + document.location.host + W['Config'].paths.features + "?language=" + I18n.locale + "&bbox=0%2C0%2C0%2C0";
        if (typeof WME_sabbath_checkClosuresResult.numOfSuccessDeletions === 'undefined') {
            WME_sabbath_checkClosuresResult.numOfSuccessDeletions = 0;
            WME_sabbath_checkClosuresResult.numOfPartialDeletions = 0;
        }
        GM_xmlhttpRequest ({
            method: "POST",
            url: urlVal,
            headers: {
                "X-CSRF-Token": WME_sabbath_csrfToken,
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01"
            },
            responseType: 'json',
            data: JSON.stringify(payload),
            contentType: "application/json; charset=UTF-8",
            onload: function (data) {
                if (data.status === 200) {
                    console.debug('wme-sabbath-closures: doDeleteClosures() for segments: ' + segmentsIDs + ' returned 200.');
                    segmentsIDs.forEach(segmentID => {
                        if (data.response.segments[segmentID]['hasClosures']) {
                            console.error('wme-sabbath-closures: failed to remove closures for segment ' + data.response.segments[segmentID].id);
                            WME_sabbath_checkClosuresResult.numOfPartialDeletions++;
                        } else {
                            WME_sabbath_checkClosuresResult.numOfSuccessDeletions++;
                        }
                    });
                    updateResultUI4checkClosure();
                } else {
                    console.error('wme-sabbath-closures: doDeleteClosures() for segments: ' + segmentsIDs + ' returned ' + data.status + "!\n" + JSON.stringify(data.response, null, 4));
                }
            }
        });
    }

    function updateResultUI4checkClosure() {
        let totalCheckedSegments = 0;
        let segmentsWithClosure = [];
        let segmentsNotFound = [];
        let addClosureFlow = typeof WME_sabbath_checkClosuresResult.numOfAddSuccess !== 'undefined';
        let deleteClosureFlow = typeof WME_sabbath_checkClosuresResult.numOfSuccessDeletions !== 'undefined';
        for (let key in WME_sabbath_checkClosuresResult) {
            if (WME_sabbath_checkClosuresResult.hasOwnProperty(key) && typeof WME_sabbath_checkClosuresResult[key] !== 'number') { // skip the success counter
                totalCheckedSegments++;
                let firstProp = WME_sabbath_checkClosuresResult[key];
                if (firstProp.length > 0) {
                    if (firstProp[0].notFound) {
                        segmentsNotFound.push(firstProp[0].segment);
                    } else {
                        segmentsWithClosure.push(WME_sabbath_checkClosuresResult[key][0].segment);
                    }
                } else if (WME_sabbath_existingClosures[key] && WME_sabbath_existingClosures[key].length > 0) {
                    segmentsWithClosure.push(WME_sabbath_existingClosures[key][0]);
                }
            }
        }
        let resultLabel = jQuery("#result_label");
        resultLabel.empty();
        if (!addClosureFlow && !deleteClosureFlow) {
            let b1 = document.createElement("b");
            b1.innerText = totalCheckedSegments.toString();
            resultLabel.append(b1, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e0\u05d1\u05d3\u05e7\u05d5"), document.createElement("br"));
            let b2 = document.createElement("b");
            b2.innerText = segmentsWithClosure.length.toString();
            resultLabel.append(b2, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e2\u05dd \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea "));
            // (segmentsWithClosure.length == 0 ? '' : '(' + segments2html(segmentsWithClosure) + ')') + '<br/>';
            if (segmentsWithClosure.length > 0) {
                resultLabel.append(document.createTextNode("("));
                resultLabel.append(segments2html(segmentsWithClosure));
                resultLabel.append(document.createTextNode(")"));
            }
            resultLabel.append(document.createElement("br"));
            if (segmentsNotFound.length > 0) {
                let b3 = document.createElement("b");
                b3.innerText = segmentsNotFound.length.toString();
                let msg = segmentsNotFound.length.toString() + " \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 ";
                resultLabel.append(b3, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05dc\u05d0 \u05e0\u05de\u05e6\u05d0\u05d5 "));
                if (segmentsNotFound.length !== 0) {
                    resultLabel.append(document.createTextNode("("));
                    resultLabel.append(segments2html(segmentsNotFound));
                    resultLabel.append(document.createTextNode(")"));
                }
                resultLabel.append(document.createElement("br"));
                setErrorAndDisable(msg);
            }
        }
        // GM_xmlhttpRequest errors
        if (WME_sabbath_requestErrors.length > 0) {
            for (let key in WME_sabbath_requestErrors) {
                if (WME_sabbath_requestErrors.hasOwnProperty(key)) {
                    resultLabel.append(document.createTextNode('Status Error: ' + key + ' '));
                    let b4 = document.createElement("b");
                    b4.innerText = WME_sabbath_requestErrors[key] + ' times';
                    resultLabel.append(b4, document.createElement("br"));
                }
            }
        }
        // delete closure flow
        if (deleteClosureFlow) {
            let b5 = document.createElement("b");
            b5.innerText = WME_sabbath_checkClosuresResult.numOfSuccessDeletions;
            resultLabel.append(b5, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05e0\u05de\u05d7\u05e7\u05d5 \u05e2\u05d1\u05d5\u05e8\u05dd \u05d4\u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4 "), document.createElement("br"));
            if (WME_sabbath_checkClosuresResult.numOfPartialDeletions > 0) {
                let b6 = document.createElement("b");
                b6.innerText = WME_sabbath_checkClosuresResult.numOfPartialDeletions;
                let b7 = document.createElement("b");
                b7.style.color = "red";
                b7.innerText = "\u05ea\u05e7\u05dc\u05d4 \u05d1\u05e1\u05e7\u05e8\u05d9\u05e4\u05d8\u002e \u05e0\u05e1\u05d4 \u05dc\u05de\u05d7\u05d5\u05e7 \u05e9\u05d5\u05d1\u002e"
                resultLabel.append(b6, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05d1\u05d4\u05dd \u05dc\u05d0 \u05e0\u05de\u05d7\u05e7\u05d5 \u05db\u05dc \u05d4\u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u0028\u05dc\u05d0 \u05ea\u05e7\u05d9\u05df\u0029\u002e ", b7, document.createElement("br")));
            }
            resultLabel.append(getRefreshHrefA());
        }
        // add closure flow
        if (addClosureFlow) {
            let b8 = document.createElement("b");
            b8.innerText = WME_sabbath_checkClosuresResult.numOfAddSuccess;
            resultLabel.append(b8, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05e0\u05d5\u05e1\u05e4\u05d5 \u05e2\u05d1\u05d5\u05e8\u05dd \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u05d1\u05d4\u05e6\u05dc\u05d7\u05d4 "), document.createElement("br"));
            if (WME_sabbath_checkClosuresResult.numOfAddFail > 0) {
                let b9 = document.createElement("b");
                b9.innerText =  WME_sabbath_checkClosuresResult.numOfAddFail;
                let b10 = document.createElement("b");
                b10.style.color = "red";
                b10.innerText = "\u05ea\u05e7\u05dc\u05d4 \u05d1\u05e1\u05e7\u05e8\u05d9\u05e4\u05d8\u002e \u05e0\u05e1\u05d4 \u05dc\u05de\u05d7\u05d5\u05e7 \u05e7\u05d5\u05d3\u05dd \u05d5\u05dc\u05d4\u05d5\u05e1\u05d9\u05e3 \u05e9\u05d5\u05d1\u002e"
                resultLabel.append(b9, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05d1\u05d4\u05dd \u05dc\u05d0 \u05e0\u05d5\u05e1\u05e4\u05d5 \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u0028\u05dc\u05d0 \u05ea\u05e7\u05d9\u05df\u0029\u002e "), b10, document.createElement("br"));
            }
            if (WME_sabbath_checkClosuresResult.numOfAddAlreadyExists > 0) {
                let b11 = document.createElement("b");
                b11.innerText = WME_sabbath_checkClosuresResult.numOfAddAlreadyExists;
                resultLabel.append(b11, document.createTextNode(" \u05de\u05e7\u05d8\u05e2\u05d9\u05dd \u05e9\u05d1\u05d4\u05dd \u05db\u05d1\u05e8 \u05e7\u05d9\u05d9\u05de\u05d5\u05ea \u05e1\u05d2\u05d9\u05e8\u05d5\u05ea \u05d1\u05d6\u05de\u05e0\u05d9\u05dd \u05d4\u05e0\u0022\u05dc\u002e "), document.createElement("br"));
            }
            resultLabel.append(getRefreshHrefA());
        }
    }

    /*
    * Returns a date object (only times matters) with Jerusalem Sabbath time.
    * Using hardcoded json file with Jerusalem Sabbath time per calendar week
    */
    function getJerusalemStartTime() {
        let result = WME_sabbath_jerusalemTimesAsJson['week' + getWeek()];
        console.debug("wme-sabbath-closures: today Jerusalem time: " + result);
        let hours = parseInt(result.substring(0, 2));
        if (WME_sabbath_daylightSavingTime) {
            hours++;
        }
        let minutes = parseInt(result.substring(3, 5));
        let today = new Date();
        today.setHours(hours);
        today.setMinutes(minutes);
        return today;
    }

    /*
    * Gets a segment ID (as int) from segment JSON object
    */
    function getSegmentID(segment) {
        let permalink = segment.permalink;
        return parseInt(getQueryParam(permalink, 'segments'));
    }

    function getQueryParam(url, key) {
        let regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
        let result = regex.exec(url);
        if (result && result.length >= 2) {
            return result[1];
        } else {
            console.error("wme-sabbath-closures: Failed to get query param '" + key + "' from url: " + url);
            return -1;
        }
    }

    /*
    * Returns the week number January 1st - 1 etc. (unlike getISOWeek())
    */
    function getWeek(date = new Date()) {
        let utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        utcDate.setUTCDate(utcDate.getUTCDate() - utcDate.getUTCDay());
        let yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
        let weekNumber = Math.ceil((((utcDate - yearStart) / 86400000) + 1) / 7);
        // adds leading 0 when needed
        return weekNumber < 10 ? '0' + weekNumber : '' + weekNumber;
    }

    /*
    * Returns whether we are currently day within Daylight Saving Time
    */
    function initDaylightSavingTime() {
        let today = new Date();
        let curMonth = today.getMonth();
        // TODO: can be improved (see Wikipedia on Israel daylight saving time)
        return curMonth >= 3 && curMonth <= 9;
    }

    /*
    * converts a date to string: hh:mm
    */
    function toHoursMinutes(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        return (hours < 10 ? '0' + hours : '' + hours) + ':' + (minutes < 10 ? '0' + minutes : '' + minutes);
    }

    /*
    * Returns the next Friday in iso date format (e.g. 2015-12-18)
    */
    function getNextFriday() {
        return getNextXDay(5);
    }

    /*
    * Returns the next Sabbath in iso date format (e.g. 2015-12-19)
    */
    function getNextSaturday() {
        return getNextXDay(6);
    }

    function getNextXDay(dayVal) {
        let date = new Date();
        let day = date.getDay();
        let nextDay = dayVal - day;
        // handle negative
        if (nextDay < 0) nextDay += 7;
        date.setDate(date.getDate() + nextDay);
        let month = date.getMonth() + 1;
        let dayInMonth = date.getDate();
        return date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (dayInMonth < 10 ? '0' + dayInMonth : dayInMonth);
    }

    /*
    * Returns the number of minutes we should start/end the closure before/after sabbath starts/ends
    */
    function getMinutesMargin() {
        // TODO add logic/user input
        return 5;
    }

    /*
    * Returns whether the segment should get Jerusalem closer hours or not
    */
    function getMinutesOffset(likeCity) {
        try {
            let city = WME_sabbath_citiesAsJson[likeCity];
            if (typeof city !== 'undefined') {
                return parseInt(city.offset);
            }
        } catch (e) {
            console.error('wme-sabbath-closures: failed to get time offset for city: ' + likeCity);
            return 0;
        }
    }

    /*
    * Gets a string in format hh:mm set the hours by given offset and returns a string in hh:mm format
    */
    function getWithTimeOffset(curString, hourOffset, minuteOffset) {
        let hours = parseInt(curString.substring(0, 2)) + hourOffset;
        let minutes = parseInt(curString.substring(3, 5)) + minuteOffset;
        let date = new Date();
        date.setHours(hours, minutes);
        hours = date.getHours();
        minutes = date.getMinutes();
        return (hours < 10 ? '0' + hours : '' + hours) + ':' + (minutes < 10 ? '0' + minutes : '' + minutes);
    }

    function initAllJsonFiles() {
        console.debug('wme-sabbath-closures: initAllJsonFiles()');
        readGitHubJsonFile("https://raw.githubusercontent.com/melameg/public-resources/master/wme-sabbath-closures/WME_sabbath.Segments.json", function (val) {
            WME_sabbath_segmentsAsJsonArray = hardcodedMode?WME_sabbath_segmentsAsJsonArray_hardcoded:val;
            WME_sabbath_segmentsAsIDsArray = WME_sabbath_segmentsAsJsonArray.map(it => getSegmentID(it));
            readGitHubJsonFile("https://raw.githubusercontent.com/melameg/public-resources/master/wme-sabbath-closures/WME_sabbath.RevertSegments.json", function (val) {
                WME_sabbath_revertedSegmentsAsJsonArray = hardcodedMode?WME_sabbath_revertedSegmentsAsJsonArray_hardcoded:val;
                readGitHubJsonFile("https://raw.githubusercontent.com/melameg/public-resources/master/wme-sabbath-closures/WME_sabbath.HolidaysSegments.json", function (val) {
                    WME_sabbath_holidaysSegmentsAsJsonArray = hardcodedMode?WME_sabbath_holidaysSegmentsAsJsonArray_hardcoded:val;
                    readGitHubJsonFile("https://raw.githubusercontent.com/melameg/public-resources/master/wme-sabbath-closures/WME_sabbath.JerusalemTimePerWeek.json", function (val) {
                        WME_sabbath_jerusalemTimesAsJson = val;
                        readGitHubJsonFile("https://raw.githubusercontent.com/melameg/public-resources/master/wme-sabbath-closures/WME_sabbath.Cities.json", function (val) {
                            WME_sabbath_citiesAsJson = val;
                            if (typeof W !== 'undefined' && W['userscripts']?.['state']?.['isInitialized']) {
                                afterWmeInitialized();
                            } else {
                                document.addEventListener("wme-initialized", afterWmeInitialized, {
                                    once: true,
                                });
                            }
                        });
                    });
                });
            });
        });
    }

    function readGitHubJsonFile(fileURL, cb) {
        console.debug('wme-sabbath-closures: readGitHubFile() for url: ' + fileURL);
        GM_xmlhttpRequest ({
            method: "GET",
            url: fileURL,
            responseType: "json",
            onload: function (responseObj) {
                if (responseObj && responseObj.status === 200) {
                    console.debug('wme-sabbath-closures: readGitHubFile() done for url: ' + fileURL);
                    cb(responseObj.response);
                } else {
                    console.error('wme-sabbath-closures: readGitHubFile() failed. got response with status: ' + responseObj.status);
                }
            }
        });
    }

    function removeDuplicateSegments(orgArray) {
        let key = "permalink";
        const seen = {};
        return orgArray.filter((item) => {
            const keyValue = key ? item[key] : JSON.stringify(item);
            return seen.hasOwnProperty(keyValue) ? false : (seen[keyValue] = true);
        });
    }

    initAllJsonFiles();


}.call(this));