// ==UserScript==
// @name         ClubSpot Scoring Fixer
// @namespace    http://tampermonkey.net/
// @version      20240724
// @description  This is a script to make *TheClubSpot* tolerable for scoring handicap races.
// @license      GNU GPLv3
// @author       Charley Rathkopf
// @match        https://theclubspot.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @  require file://C:\_dev\TamperMonkey\ClubSpot_Scoring\bundle.js
// @downloadURL https://update.greasyfork.org/scripts/501692/ClubSpot%20Scoring%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/501692/ClubSpot%20Scoring%20Fixer.meta.js
// ==/UserScript==
"use strict";
// SettingsBase.ts
class SettingsBase {
    constructor() {
        this.onChange = () => { };
        // keep this in case we need to clear out old settings
        this.lastSettingsChange = null;
    }
}
// RaceDetailsSettings.ts
/// <reference path="SettingsBase.ts" />
class RaceDetailsSettings extends SettingsBase {
    constructor() {
        super(...arguments);
        this._addPlusNPushed = false;
        this._initalStartTimeOnEvenMinutes = true;
        this._startOffsetMinutes = 5;
    }
    set startOffsetMinutes(value) {
        if (this._startOffsetMinutes == value) {
            return;
        }
        this._startOffsetMinutes = value;
        this.onChange();
    }
    get startOffsetMinutes() {
        return this._startOffsetMinutes;
    }
    set lastStartAddedTime(value) {
        if (this._lastStartAddedTime == value) {
            return;
        }
        this._lastStartAddedTime = value;
        this.onChange();
    }
    get lastStartAddedTime() {
        return new Date(this._lastStartAddedTime);
    }
    setPlusNPushed() {
        this.addPlusNPushed = true;
    }
    clearPlusNPushed() {
        this.addPlusNPushed = false;
    }
    set addPlusNPushed(value) {
        if (this._addPlusNPushed == value) {
            return;
        }
        this._addPlusNPushed = value;
        this.onChange();
    }
    get addPlusNPushed() {
        return this._addPlusNPushed;
    }
    set initalStartTimeOnEvenMinutes(value) {
        if (this._initalStartTimeOnEvenMinutes == value) {
            return;
        }
        this._initalStartTimeOnEvenMinutes = value;
        this.onChange();
    }
    get initalStartTimeOnEvenMinutes() {
        return this._initalStartTimeOnEvenMinutes;
    }
}
// EditStartsPage.ts
/// <reference path="RaceDetailsSettings.ts" />
class EditStartsPage {
    static create(document) {
        const regexPattern = /^https?:\/\/theclubspot.com\/dashboard\/regatta\/[^\/]+\/edit-start\/?$/;
        if (!regexPattern.test(document.URL)) {
            return null;
        }
        return new EditStartsPage(document);
    }
    constructor(document) {
        this.document = document;
        this.SEARCH_INTERVAL = 200;
        this.settingsStorage = new LocalStorageHandler(RaceDetailsSettings);
        this.settings = this.settingsStorage.getSettings();
        // now we need to get the race info and all the starts
        // get the last of the starts
        // and add 5 minutes to the time
        // change of plans. do the above steps in the RaceDetailsPage StartsTab when the new race is added.
        // and then edit this start, watching for the edit window
        // when the edit window appears, we need to change the date and time to be 5 minutes from last start
        // but only if we haven't already set the time for this start.
        // so we need a setting that says if we have edited the start.
    }n
}
// EntryListPage.ts
class EntryListPage {
    static create(document) {
        // const regexPattern = /^https?:\/\/theclubspot.com\/dashboard\/regatta\/[^/]+\/(entry-list\/?)?$/;
        // if (!regexPattern.test(document.URL)) {
        //     return null;
        // }
        return new EntryListPage(document);
    }
    constructor(document) {
        this.SEARCH_INTERVAL = 500;
        this.table = undefined;
        this.tableChangedObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    this.tableChangedObserver.disconnect();
                    this.RaiseTablesChangedEvent();
                }
            }
        });
        this.document = document;
        this.searchForTable();
    }
    applyBackgroundColor(row) {
        row.style.backgroundColor = 'mistyrose';
    }
    searchForTable() {
        this.tableSearchTimer = setInterval(() => {
            this.findTable();
        }, this.SEARCH_INTERVAL);
        this.findTable();
    }
    onTableFound(table) {
        const tableRows = table.querySelectorAll('tr');
        if (tableRows.length > 1) {
            if (this.tableSearchTimer) {
                clearInterval(this.tableSearchTimer);
            }
            tableRows.forEach((row) => {
                var _a;
                if ((_a = row.textContent) === null || _a === void 0 ? void 0 : _a.includes('CYC')) {
                    this.applyBackgroundColor(row);
                }
            });
            const tableParentDiv = table.closest('div.view.view_entry-list.active');
            if (tableParentDiv) {
                this.EnableTableChangedEvent(tableParentDiv);
                // }
            }
        }
    }
    findTable() {
        const allDivs = this.document.querySelectorAll('div.standardCardBody.scrollable.noPadding.fff');
        allDivs.forEach((div) => {
            const precedingDiv = div.previousElementSibling;
            if (precedingDiv && precedingDiv.tagName === 'DIV') {
                let h3 = precedingDiv.querySelector('h3');
                if (h3 && h3.textContent.includes('Entry list')) {
                    let table = div.querySelector('table');
                    if (table) {
                        this.table = table;
                        this.onTableFound(table);
                        return;
                    }
                }
            }
        });
    }
    ;
    EnableTableChangedEvent(tableParent) {
        if (tableParent) {
            this.AddDivWatcher(tableParent);
        }
        else {
            this.tableChangedObserver.disconnect();
        }
    }
    AddDivWatcher(tableParent) {
        this.tableChangedObserver.disconnect();
        this.tableChangedObserver.observe(tableParent, { childList: true, subtree: true });
    }
    RaiseTablesChangedEvent() {
        if (!this.table) {
            return;
        }
        // this.TableChangedEvent?.(this.table);
        this.searchForTable();
    }
}
// RaceDetailsPage.ts
// this page should be refactored to use the new div visible pattern.
class RaceDetailsPage {
    static create(document) {
        // const regexPattern
        //     = /^https?:\/\/theclubspot.com\/dashboard\/regatta\/[^\/]+\/race-details\/[^\/]+(\/(starts|race-settings|assignments))?\/?$/;
        // if (!regexPattern.test(document.URL)) {
        //     return null;
        // }
        return new RaceDetailsPage(document);
    }
    constructor(document) {
        this.document = document;
        this.SEARCH_INTERVAL = 200;
        this.lastRowCount = 0;
        // private startsTableVisible: boolean = false;
        this.editStartsVisible = false;
        this.raceDetailsVisible = false;
        this.inAddPlusNButton = false;
        this.settingsStorage = new LocalStorageHandler(RaceDetailsSettings);
        this.settings = this.settingsStorage.getSettings();
        // mutation observer doesn't do it.
        // will need to just check the number of rows in the table
        // wait 500 ms before starting to look for table changes
        setTimeout(() => {
            this.watchForTabChanges();
        }, 500);
    }
    watchForTabChanges() {
        setInterval(() => {
            const regexPatternStarts = /^https?:\/\/theclubspot.com\/dashboard\/regatta\/[^\/]+\/race-details\/[^\/]+(\/starts)\/?$/;
            const regexPatternEditStart = /^https?:\/\/theclubspot.com\/dashboard\/regatta\/[^\/]+\/(\/edit-start)\/?$/;
            const regexPatternRaceSettings = /^https?:\/\/theclubspot.com\/dashboard\/regatta\/[^\/]+\/race-details\/[^\/]+(\/race-settings)?\/?$/;
            if (regexPatternStarts.test(this.document.URL)) {
                // this.startsTableVisible = true;
                const table = this.document.querySelector('.view_starts table.tableInsert');
                const rowCount = table === null || table === void 0 ? void 0 : table.querySelectorAll('tr').length;
                if (!!rowCount) {
                    if (rowCount > 1) {
                        this.addPlusNButtonIfNeeded();
                    }
                    if (rowCount !== this.lastRowCount) {
                        if (this.lastRowCount && rowCount > this.lastRowCount) {
                            this.onStartAdded(table.rows[rowCount - 1]);
                        }
                        this.lastRowCount = rowCount;
                    }
                }
            }
            else if (regexPatternEditStart.test(this.document.URL)) {
                if (!this.editStartsVisible) {
                    this.onEditStartsBecameVisible();
                }
                this.editStartsVisible = true;
            }
            else if (regexPatternRaceSettings.test(this.document.URL)) {
                if (!this.raceDetailsVisible) {
                    this.onRaceDetailsBecameVisible();
                    this.raceDetailsVisible = true;
                }
            }
            else {
                // this.startsTableVisible = false;
            }
        }, this.SEARCH_INTERVAL);
    }
    addPlusNButtonIfNeeded() {
        if (this.inAddPlusNButton) {
            return;
        }
        this.inAddPlusNButton = true;
        try {
            // Get the footer element
            const footer = document.querySelector('.view_starts .standardCardFooter');
            if (!footer) {
                return;
            }
            // Check if the button already exists
            const existingButton = footer.querySelector('a.addPlusNButton');
            if (existingButton) {
                return; // The button already exists, so we don't need to add it
            }
            // Create a new button
            const newButton = document.createElement('a');
            newButton.innerHTML = `new start +<input type="number" value="${this.settings.startOffsetMinutes}"`
                + `min = "0" step = "1" style = "width: 30px;" > minutes`;
            newButton.classList.add('cardFooterLink', 'addPlusNButton', 'smallerMarginRight');
            newButton.onclick = (event) => {
                if (event.target instanceof HTMLInputElement) {
                    event.stopPropagation();
                }
                else {
                    this.tappedAddStartPlusN();
                }
            };
            // Add an event listener to the input element
            const input = newButton.querySelector('input');
            if (input) {
                input.addEventListener('input', (event) => {
                    event.stopPropagation();
                    this.settings.startOffsetMinutes = parseInt(input.value, 10);
                });
            }
            // Insert the new button before the "+ new start" button
            const addStartButton = footer.querySelector('a[onclick="tappedAddStart();"]');
            footer.insertBefore(newButton, addStartButton);
        }
        catch (error) {
            console.error('Error adding "new start + N minutes" button:', error);
        }
        finally {
            this.inAddPlusNButton = false;
        }
    }
    tappedAddStartPlusN() {
        this.settings.setPlusNPushed();
        if (window.tappedAddStart) {
            window.tappedAddStart();
        }
    }
    onRaceDetailsBecameVisible() {
        // noop
    }
    onEditStartsBecameVisible() {
        if (this.settings.lastStartAddedTime.getTime() - new Date().getTime() < 1000) {
            const link = Array.from(document.querySelectorAll('.standardCardFooter .cardFooterLink'))
                .find(anchor => { var _a; return (_a = anchor.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes('edit'); });
            if (link) {
                link.click();
            }
        }
    }
    onStartAdded(tr) {
        if (this.settings.addPlusNPushed) {
            this.settings.clearPlusNPushed();
            this.makeNewStartNMinutesAfterLastStart();
            return;
        }
        if (this.settings.initalStartTimeOnEvenMinutes) {
            this.makeStartTimeEvenMinutes();
        }
    }
    getStartObjects() {
        const raceObject = $(document.body).data("raceObject");
        return raceObject === null || raceObject === void 0 ? void 0 : raceObject.get("starts");
    }
    makeNewStartNMinutesAfterLastStart() {
        const startObjects = this.getStartObjects();
        const N = this.settings.startOffsetMinutes;
        if (!startObjects || startObjects.length < 2) {
            console.log(`No previous start to add ${this.settings.startOffsetMinutes} minutes to.`);
            return;
        }
        const previousStart = startObjects[startObjects.length - 2];
        const previousStartTime = new Date(previousStart.get("startTime"));
        const newStart = startObjects[startObjects.length - 1];
        const newStartTime = new Date(previousStartTime.getTime() + this.settings.startOffsetMinutes * 60000);
        this.setStartTime(newStart, newStartTime);
    }
    makeStartTimeEvenMinutes() {
        const startObjects = this.getStartObjects();
        if (!startObjects || startObjects.length < 1) {
            return;
        }
        const newStart = startObjects[startObjects.length - 1];
        const newStartTime = new Date(newStart.get("startTime"));
        newStartTime.setSeconds(0);
        this.setStartTime(newStart, newStartTime);
    }
    setStartTime(newStart, newStartTime) {
        newStart.set("startTime", newStartTime);
        newStart.save().then(() => {
            // I definitly do need to reload the starts.
            window.clearStarts();
            window.loadStarts();
        });
    }
}
// RaceDetailsPage.ts
class RacesPage {
    static create(document) {
        // const regexPattern = /^https?:\/\/theclubspot.com\/dashboard\/regatta\/[^\/]+\/scoring\/races\/?$/;
        // if (!regexPattern.test(document.URL)) {
        //     return null;
        // }
        return new RacesPage(document);
    }
    constructor(document) {
        this.document = document;
        this.SEARCH_INTERVAL = 200;
        this.lastRowCount = 0;
        // start watching for a new race to be created,
        // when it is, open the race page and then click edit
        const table = this.document.querySelector('.view_races table.tableInsert');
        setInterval(() => {
            const rowCount = table === null || table === void 0 ? void 0 : table.querySelectorAll('tr').length;
            if (!!rowCount) {
                if (rowCount !== this.lastRowCount) {
                    if (rowCount > 1 && this.lastRowCount && rowCount - this.lastRowCount === 1) {
                        this.onRaceAdded(table.rows[rowCount - 1]);
                    }
                    this.lastRowCount = rowCount;
                }
            }
        }, this.SEARCH_INTERVAL);
    }
    onRaceAdded(raceRow) {
        // check if nickname is set, and if not, set it to R# (MM/DD)
        const raceObject = $(raceRow).data("raceObject");
        if (!raceObject) {
            return;
        }
        let nickname = raceObject.get("nickname");
        if (nickname) {
            return;
        }
        const raceNumber = raceObject.get("number");
        const date = new Date();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        nickname = `R${raceNumber} (${month}/${day})`;
        raceObject.set("nickname", nickname);
        // now need to save the race object
        var promise = window.Parse.Promise.as();
        promise.then(() => {
            raceObject.save();
        });
    }
}
// RegattaPage.ts
class RegattaPage {
    static create(document) {
        const regexPattern = /^https?:\/\/theclubspot.com\/dashboard\/regatta\/[^/]+\/?/;
        if (!regexPattern.test(document.URL)) {
            return null;
        }
        return new RegattaPage(document);
    }
    constructor(document) {
        // discovered just one page loaded for regatta,
        // and different divs activated
        // so, create the classes for the subpages (i.e. divs)
        // when the divs are activated.
        this.document = document;
        // find the div with class 'contentBlock' inside of
        // thi div with class 'standardContentZone'
        const contentBlock = this.document.querySelector('.standardContentZone .contentBlock');
        // And then watch for the specif divs to be activated
        // this would cause lazy loading, but the mutation observer doesn't
        // seem to be working. so not tlazy loading, loading all at once.
        // for example the div with class view_entry-list.
        const divEntryList = contentBlock === null || contentBlock === void 0 ? void 0 : contentBlock.querySelector('.view_entry-list');
        if (divEntryList) {
            EntryListPage.create(this.document);
            // let entryListPage = EntryListPage.create(this.document);
            // this.createDivActiveObserver(divEntryList, (active) => {
            //     if (active) {
            //         if (!entryListPage) {
            //             entryListPage = EntryListPage.create(this.document);
            //         }
            //     }
            // });
        }
        else {
            console.error('No div with class view_entry-list found');
        }
        const divRaces = contentBlock === null || contentBlock === void 0 ? void 0 : contentBlock.querySelector('.view_scoring .view_races');
        if (divRaces) {
            RacesPage.create(this.document);
        }
        else {
            console.error('No div with class view_scoring view_races found');
        }
        const divRaceDetails = contentBlock === null || contentBlock === void 0 ? void 0 : contentBlock.querySelector('.view_race-details');
        if (divRaceDetails) {
            RaceDetailsPage.create(this.document);
        }
        else {
            console.error('No div with class view_scoring view_race-details found');
        }
    }
    createDivActiveObserver(div, callback) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (div.classList.contains('active')) {
                        callback(true);
                    }
                    else {
                        callback(false);
                    }
                }
            }
        });
        observer.observe(div, { attributes: true });
        if (div.classList.contains('active')) {
            callback(true);
        }
        else {
            callback(false);
        }
    }
}
// ScoringPanelPage.ts
class ScoringPanelPage {
    get settings() {
        if (!this._settings) {
            throw new Error('Settings not initialized');
        }
        return this._settings;
    }
    get uiManipulator() {
        if (!this._uiManipulator) {
            throw new Error('UIManipulator not initialized');
        }
        return this._uiManipulator;
    }
    static create(document) {
        const regexPattern = /^https?:\/\/theclubspot.com\/scoring\/[^\/]+\/?$/;
        if (!regexPattern.test(document.URL)) {
            return null;
        }
        return new ScoringPanelPage(document);
    }
    constructor(document) {
        this.document = document;
        this.SEARCH_INTERVAL = 200;
        this._settings = null;
        this.isFinishTimeInputVisible = false;
        this._uiManipulator = null;
        this.scoredRowCount = 0;
        this.scoredRowsKeys = new Set();
        this.onFinishTimeDivVisibleChange = (visible) => {
            if (visible) {
                this.modifyFinishWindow();
            }
            else {
                this.searchField.focus();
            }
        };
        // get the regatta ID, and use that as the storage key for the layout settings,
        // but need Race ID for the finish time settings.
        let regattaObject = this.regattaObject;
        // sometimes this isn't loaded yet, in that case wait 100 ms and try again
        const completeConstructor = () => {
            if (!regattaObject) {
                setTimeout(() => {
                    regattaObject = this.regattaObject;
                    completeConstructor();
                }, 100);
                return;
            }
            const regattaId = regattaObject.id;
            const settingsStorage = new LocalStorageHandler(ScoringPanelSettings, regattaId);
            this._settings = settingsStorage.getSettings();
        //    this.putRegattaBannerOnPage();
            this.watchForFinishTimeDivVisibleChanges('#overlay_finish-time');
            this._uiManipulator = new UIManipulator(document);
            this.modifyReturnMarkupForScoreRowFunction();
            this.modifyScoredHeaderForReordering();
            this.setupHighlighting();
        };
        completeConstructor();
    }
    // ----------------- Highlight Results Rows -----------------
    setupHighlighting() {
        this.uiManipulator.addStyles('div.table-view-row.pointer.charley-active', { background: 'yellow' }); // add a style to the table rows to make them easier to see
        // const unscoredDiv = this.document.querySelector('view_score wrap_unscored') as HTMLDivElement;
        if (!this.scoredDiv || !this.searchField) {
            // retry in 100 ms
            setTimeout(() => this.setupHighlighting(), 100);
            return;
        }
        //if tab hit in searchField, then select first row of scoredRows
        this.searchField.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                const firstRow = this.scoredRows[0];
                if (firstRow) {
                    firstRow.focus();
                    // for some reason, the second row is getting the event
                    this.highlightOneDiv(firstRow);
                    setTimeout(() => {
                        if (firstRow) {
                            firstRow.focus();
                        }
                    }, 50);
                }
            }
        });
        // wrap the results div in its own scrollable div
        // these aren't working. probably because of the flex layout
        // this.uiManipulator.addStyles('div.view_score .wrap_unscored', { 'overflow-x': 'auto' });
        // this.uiManipulator.addStyles('div.view_score .wrap_scored', { overflow: 'auto' });
        // scroll the results div so that the focused div is in view
        // watch the container div for addition of rows and call rowAdded method with new div when added
        // this method should add the class charley-active to the new div and add event handlers for keyboard up and down arrow keys
        // again, I'm not having luck with mution observer, so I will just poll for changes.
        setInterval(() => {
            const rows = this.scoredRows;
            const newRowCount = rows.length;
            if (newRowCount !== this.scoredRowCount) {
                // we should check the focus index of the search field, and set the focus index of the first row to that value + 1
                let tabIndex = this.searchField.tabIndex + 1;
                this.scoredRowCount = newRowCount;
                // find the new rows and add the event listeners
                const newKeys = new Set();
                rows.forEach((row) => {
                    row.tabIndex = tabIndex++;
                    // find the class of the row that starts with "scoreRow"
                    // the key is the string between the _
                    const keyClass = Array.from(row.classList).find(cls => cls.startsWith('scoreRow_'));
                    if (!keyClass) {
                        return;
                    }
                    const key = keyClass.split('_')[1];
                    newKeys.add(key);
                    if (this.scoredRowsKeys.has(key)) {
                        return;
                    }
                    this.scoredRowsKeys.add(key);
                    this.highlightOneDiv(row);
                    row.addEventListener('keydown', (event) => {
                        if (event.key === 'ArrowDown') {
                            // event.stopPropagation();
                            // event.stopImmediatePropagation();
                            event.preventDefault();
                            const nextRow = row.nextElementSibling;
                            if (nextRow) {
                                nextRow.focus();
                                this.scrollResultsDivToRow(nextRow);
                            }
                        }
                        else if (event.key === 'ArrowUp') {
                            // event.stopPropagation();
                            // event.stopImmediatePropagation();
                            event.preventDefault();
                            const previousRow = row.previousElementSibling;
                            if (previousRow) {
                                previousRow.focus();
                                this.scrollResultsDivToRow(previousRow);
                            }
                        }
                        else if (event.key === 'Tab' && event.shiftKey) {
                            this.searchField.focus();
                            row.classList.remove('charley-active');
                        }
                    });
                    row.addEventListener('focusin', (event) => {
                        this.highlightOneDiv(row);
                    });
                });
                this.scoredRowsKeys.forEach(key => {
                    if (!newKeys.has(key)) {
                        this.scoredRowsKeys.delete(key);
                    }
                });
            }
        }, this.SEARCH_INTERVAL);
        // watch the container div for removal of rows and call rowRemoved method with removed div when removed
        // this method should select the previous row if the selected row had class charley-active
        // not going to worry about this for now 05-06-2024:1638
    }
    get scoredDiv() {
        return this.document.querySelector('.view_score .wrap_scored');
    }
    get scoredRows() {
        return this.scoredDiv.querySelectorAll('.table-view-row.scoreRow');
    }
    highlightOneDiv(addedDiv) {
        const selectedRow = this.findSelectedRow();
        if (selectedRow) {
            selectedRow.classList.remove('charley-active');
        }
        addedDiv.classList.add('charley-active');
    }
    findSelectedRow() {
        const scoredDiv = this.document.querySelector('.view_score .wrap_scored');
        const selectedRow = scoredDiv === null || scoredDiv === void 0 ? void 0 : scoredDiv.querySelector('.charley-active');
        return selectedRow;
    }
    scrollResultsDivToRow(row) {
        const contentBlock = this.document.querySelector('div.contentBlock');
        if (!row || !contentBlock) {
            return;
        }
        const rect = row.getBoundingClientRect();
        if (rect.top < 110) {
            contentBlock.scrollTop -= 110 - rect.top;
        }
    }
    // ----------------- Regatta Banner -----------------
    putRegattaBannerOnPage() {
        const regattaObject = this.regattaObject;
        const raceObject = this.raceObject;
        if (!regattaObject || !raceObject) {
            // retry in 500 ms
            setTimeout(() => this.putRegattaBannerOnPage(), 500);
            return;
        }
        const regattaName = regattaObject.get('name');
        const starts = raceObject.get('starts');
        let raceDate = regattaObject.get('startDate');
        if (starts && starts.length) {
            raceDate = starts[0].get('startTime');
        }
        // get the race date in the local time zone
        const localDate = new Date(raceDate);
        const raceDateString = localDate.toLocaleDateString();
        let raceName = raceObject.get('nickname') || `R${raceObject.get('raceNumber')}`;
        // create the header text to be the regatta name, followed by the race name and date.
        const headerText = `${regattaName} - ${raceName} (${raceDateString})`;
        const header = this.document.createElement('h1');
        header.textContent = headerText;
        header.style.fontWeight = 'bold';
        header.style.backgroundColor = 'blue';
        header.style.textAlign = 'center';
        header.style.color = 'white';
        header.textContent = headerText;
        header.style.fontWeight = 'bold';
        header.style.backgroundColor = 'blue';
        header.style.textAlign = 'center';
        header.style.width = '100%';
        const contentZoneHeaderFlexGrow = this.document.querySelector('.contentZoneHeader .flexGrowOne');
        if (contentZoneHeaderFlexGrow) {
            contentZoneHeaderFlexGrow.appendChild(header);
        }
    }
    get raceObject() {
        return $(document.body).data('raceObject');
    }
    get regattaObject() {
        return $(document.body).data('regattaObject');
    }
    // ----------------- Modify Finishing Window ------------------
    modifyFinishWindow() {
        this.setEnabledInputStyles();
        this.setDateInputsEnabledState(this.settings.enableDateInput);
        this.fixDateInputs();
        this.fixTimeInputs();
        this.replaceDivAfterH3WithDateSwitch();
        this.hideScoreInputTypeSelector();
        this.addInputEventHandlerOnDateToSaveDate();
    }
    setEnabledInputStyles() {
        this.disableInputColor = 'lightgray';
        this.enabledInputColor = this.getDateInputs()[0].style.color;
    }
    setDateInputsEnabledState(enabled) {
        const dateInputs = this.getDateInputs();
        if (this.lastFinishDateUsed) {
            const date = new Date(this.lastFinishDateUsed);
            dateInputs[0].value = (date.getMonth() + 1).toString().padStart(2, '0');
            dateInputs[1].value = date.getDate().toString().padStart(2, '0');
            dateInputs[2].value = date.getFullYear().toString();
            // dispatch an event so vue can pick up the change
            const event = new Event("input", { bubbles: true });
            dateInputs.forEach(input => input.dispatchEvent(event));
        }
        else {
            this.saveLastDateUsed();
        }
        this.settings.enableDateInput = enabled;
        dateInputs.forEach(input => {
            if (enabled) {
                input.style.color = this.enabledInputColor;
                input.disabled = false;
            }
            else {
                input.style.color = this.disableInputColor;
                input.disabled = true;
            }
        });
        if (enabled) {
            dateInputs[0].focus();
            dateInputs[0].select();
        }
        else { // disabled
            const timeInput = this.getTimeInputs()[0];
            timeInput.focus();
            timeInput.select();
        }
    }
    getDateInputs() {
        return this.document.querySelectorAll('.dateInput.flexGrowOne.flexNoWrap.smallerMarginTop:first-of-type input.required');
    }
    getTimeInputs() {
        return this.document.querySelectorAll('.dateInput.flexGrowOne.flexNoWrap.smallerMarginTop:last-of-type input.required');
    }
    fixDateInputs() {
        this.fixInputsToAutoAdvance(this.getDateInputs(), true);
    }
    fixTimeInputs() {
        this.fixInputsToAutoAdvance(this.getTimeInputs());
    }
    fixInputsToAutoAdvance(inputs, isDate = false) {
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                const currentIndex = Array.from(inputs).indexOf(input);
                const nextInput = inputs[currentIndex + 1] || inputs[0];
                if (isDate && currentIndex === 2) {
                    if (input.value.length === 4) {
                        const timeInputs = this.getTimeInputs();
                        timeInputs[0].focus();
                        timeInputs[0].select();
                    }
                    return;
                }
                if (input.value.length === 2) {
                    nextInput.focus();
                    nextInput.select();
                }
            });
        });
    }
    replaceDivAfterH3WithDateSwitch() {
        const div = $("h3:contains('Finish time') ~ .flexGrowOne").get(0);
        if (div) {
            this.createDateToggleDiv(div);
        }
    }
    hideScoreInputTypeSelector() {
        const div = this.document.querySelector('.scoreInputTypeSelector');
        if (div) {
            div.style.display = 'none';
        }
    }
    createDateToggleDiv(div) {
        div = this.uiManipulator.addClassesToDiv(div, 'flexGrowOne', 'tinyPaddingRight');
        div.style.alignSelf = 'center';
        const rightAlignedDiv = this.uiManipulator.createDivWithClass('flexWrapRightAlign', 'tinyPaddingTop');
        // add a div with right alignment
        div.appendChild(rightAlignedDiv);
        let labelDiv = this.document.createElement('div');
        rightAlignedDiv.appendChild(labelDiv);
        labelDiv.outerHTML = '<div class="flexNoWrap"><p class="inline-label noMinWidth">Enable Date</p></div>';
        labelDiv = rightAlignedDiv.querySelector('div');
        labelDiv.appendChild(this.uiManipulator.createTooltip('Turn this switch on to change the finish date.'));
        const toggle = this.uiManipulator.createToggle(this.settings.enableDateInput, () => this.toggleFinishDate(toggle));
        rightAlignedDiv.appendChild(toggle);
        div.appendChild(rightAlignedDiv);
        return div;
    }
    set DateInputsEnabled(enabled) {
        if (this.settings.enableDateInput === enabled) {
            return;
        }
        this.setDateInputsEnabledState(enabled);
    }
    get DateInputsEnabled() {
        return this.settings.enableDateInput;
    }
    // ----------------- Finish Time Div Visibility Changes -----------------
    watchForFinishTimeDivVisibleChanges(selector) {
        setInterval(() => {
            const element = this.document.querySelector(selector);
            const visible = !!element && element.style.display !== 'none';
            if (this.isFinishTimeInputVisible === visible) {
                return;
            }
            else {
                this.isFinishTimeInputVisible = visible;
                this.onFinishTimeDivVisibleChange(visible);
            }
        }, this.SEARCH_INTERVAL);
    }
    get searchField() {
        return this.document.querySelector('.scoring_search_bar.medium-placeholder');
    }
    toggleFinishDate(toggle) {
        this.DateInputsEnabled = !this.settings.enableDateInput;
        this.uiManipulator.setToggleValue(this.settings.enableDateInput, toggle);
    }
    addInputEventHandlerOnDateToSaveDate() {
        const dateInputs = this.getDateInputs();
        dateInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveLastDateUsed();
            });
        });
        this.saveLastDateUsed();
    }
    getDateInputValue() {
        const dateInputs = this.getDateInputs();
        const month = parseInt(dateInputs[0].value);
        const day = parseInt(dateInputs[1].value);
        const year = parseInt(dateInputs[2].value);
        return new Date(year, month - 1, day);
    }
    get lastFinishDateUsed() {
        return this.settings.getLastDateUsedForRace(this.raceObject.id);
    }
    set lastFinishDateUsed(value) {
        this.settings.setLastDateUsedForRace(this.raceObject.id, value);
    }
    saveLastDateUsed() {
        var _a;
        const newDate = this.getDateInputValue();
        if (newDate.getTime() == ((_a = this.lastFinishDateUsed) === null || _a === void 0 ? void 0 : _a.getTime())) {
            return;
        }
        this.settings.setLastDateUsedForRace(this.raceObject.id, newDate);
    }
    // ----------------- Modify Scored Header For Reordering -----------------
    modifyScoredHeaderForReordering() {
        const headerDiv = this.document.querySelector('.wrap_scored .mock-table-header-row');
        if (!headerDiv) {
            // poll waiting for it to be visible
            setTimeout(() => this.modifyScoredHeaderForReordering(), 100);
            return;
        }
        // loop through the child divs and number them so we can track the order later.
        const positionMap = this.settings.resultsColumnOrder;
        const subDivs = Array.from(headerDiv.children);
        let colIndex = 0;
        subDivs.forEach((divElement, index) => {
            var _a;
            if (index < 1) {
                return;
            }
            const div = divElement;
            const position = (_a = positionMap.get(colIndex)) !== null && _a !== void 0 ? _a : colIndex;
            positionMap.set(colIndex, position);
            div.setAttribute('charley-data-index', position.toString());
            div.setAttribute('charley-original-index', colIndex.toString());
            const leftArrow = document.createElement('div');
            leftArrow.classList.add('arrow');
            leftArrow.textContent = '<--';
            leftArrow.style.display = 'inline-block';
            leftArrow.style.cursor = 'pointer'; // Add this line to set the cursor to finger
            leftArrow.addEventListener('click', () => {
                const currentIndex = parseInt(div.getAttribute('charley-data-index') || '0');
                let previousIndex = currentIndex - 1;
                while (previousIndex >= 0) {
                    // now find the div with 'charley-data-index' equal to previousIndex
                    const previousDiv = subDivs.find(div => div.getAttribute('charley-data-index') === previousIndex.toString());
                    this.swapDivDataIndexes(div, previousDiv);
                    if ($(previousDiv).is(':visible')) {
                        break;
                    }
                    previousIndex--;
                }
                this.updateColumnOrder();
            });
            div.insertBefore(leftArrow, div.firstChild);
            const rightArrow = document.createElement('div');
            rightArrow.classList.add('arrow');
            rightArrow.textContent = '-->';
            rightArrow.style.display = 'inline-block';
            rightArrow.style.cursor = 'pointer'; // Add this line to set the cursor to finger
            rightArrow.addEventListener('click', () => {
                const currentIndex = parseInt(div.getAttribute('charley-data-index') || '0');
                let nextIndex = currentIndex + 1;
                while (nextIndex < subDivs.length) {
                    const nextDiv = subDivs.find(div => div.getAttribute('charley-data-index') === nextIndex.toString());
                    this.swapDivDataIndexes(div, nextDiv);
                    if ($(nextDiv).is(':visible')) {
                        break;
                    }
                    nextIndex++;
                }
                this.updateColumnOrder();
            });
            div.appendChild(rightArrow);
            colIndex++;
        });
        this.settings.saveResultsColumnOrder();
        this.positionColumnsInCorrectOrder();
    }
    swapDivDataIndexes(div1, div2) {
        if (!div1.getAttribute('charley-data-index') || !div2.getAttribute('charley-data-index')) {
            return;
        }
        const index1 = parseInt(div1.getAttribute('charley-data-index') || '0');
        const index2 = parseInt(div2.getAttribute('charley-data-index') || '0');
        div1.setAttribute('charley-data-index', index2.toString());
        div2.setAttribute('charley-data-index', index1.toString());
    }
    updateColumnOrder() {
        const headerDiv = this.document.querySelector('.wrap_scored .mock-table-header-row');
        const positionMap = this.settings.resultsColumnOrder;
        const subDivs = Array.from(headerDiv.children);
        subDivs.forEach(div => {
            if (div.getAttribute('charley-data-index')) {
                const currentIndex = parseInt(div.getAttribute('charley-data-index') || '0');
                const originalIndex = parseInt(div.getAttribute('charley-original-index') || '0');
                positionMap.set(originalIndex, currentIndex);
            }
        });
        this.settings.saveResultsColumnOrder();
        this.positionColumnsInCorrectOrder();
    }
    positionColumnsInCorrectOrder() {
        const headerDiv = this.document.querySelector('.wrap_scored .mock-table-header-row');
        const positionMap = this.settings.resultsColumnOrder;
        const subDivs = Array.from(headerDiv.children);
        subDivs.sort((a, b) => this.sortColumns(a, b, positionMap));
        subDivs.forEach(div => headerDiv.appendChild(div));
        const scoreRows = this.document.querySelectorAll('.wrap_scored .table-view-row');
        scoreRows.forEach(row => this.sortColumnsInRow(row, positionMap));
    }
    sortColumns(a, b, positionMap) {
        var _a, _b;
        const aIndex = parseInt(a.getAttribute('charley-original-index') || '-1');
        const bIndex = parseInt(b.getAttribute('charley-original-index') || '-2');
        const aSort = (_a = positionMap.get(aIndex)) !== null && _a !== void 0 ? _a : aIndex;
        const bSort = (_b = positionMap.get(bIndex)) !== null && _b !== void 0 ? _b : bIndex;
        return aSort - bSort;
    }
    sortColumnsInRow(row, positionMap = null) {
        if (!positionMap) {
            positionMap = this.settings.resultsColumnOrder;
        }
        const subDivs = Array.from(row.children);
        // sort the subDivs by the order in the positionMap
        subDivs.sort((a, b) => this.sortColumns(a, b, positionMap));
        // and then re-insert them in the correct order
        subDivs.forEach(div => row.appendChild(div));
        return row;
    }
    modifyReturnMarkupForScoreRowFunction() {
        const oldFunction = window.returnMarkupForScoreRow;
        const oldDateFormat = window.formatStartOrFinishTime;
        const parser = new DOMParser();
        window.returnMarkupForScoreRow = (scoreObject, letterScore_client) => {
            try {
                if (!this.settings.showDateForStartFinish) {
                    window.formatStartOrFinishTime = (date, includeDate) => {
                        // replace the dateFormat function to only show the time
                        const newValue = oldDateFormat(date, false);
                        return newValue;
                    };
                }
                let markup = oldFunction(scoreObject, letterScore_client);
                const doc = parser.parseFromString(markup, 'text/html');
                const parentDiv = doc.querySelector('div');
                const newDiv = this.addIndexesToSubDivs(parentDiv);
                markup = (new XMLSerializer()).serializeToString(newDiv);
                return markup;
            }
            catch (error) {
                console.error('An error occurred:', error);
                // Handle the error or throw it again
                throw error;
            }
            finally {
                window.dateFormatformatStartOrFinishTime = oldDateFormat;
            }
        };
        // at this time we also need to see if there are already any rows generated, and we will need to mark them up too
        const scoreRows = this.document.querySelectorAll('.wrap_scored .table-view-row');
        scoreRows.forEach(row => {
            this.addIndexesToSubDivs(row);
        });
    }
    addIndexesToSubDivs(parentDiv) {
        const subDivs = Array.from(parentDiv.children);
        let colIndex = 0;
        subDivs.forEach((div, index) => {
            if (index < 2) {
                return;
            }
            div.setAttribute('charley-original-index', colIndex.toString());
            colIndex++;
        });
        parentDiv = this.sortColumnsInRow(parentDiv);
        return parentDiv;
    }
}
// ScoringPanelSettings.ts
/*
the next steps:
- make UI element that will toggel the date input
- put appropriate classes on the date input for the setting
- have the date input set the lastDateUsed property.
*/
/// <reference path="SettingsBase.ts" />
class ScoringPanelSettings extends SettingsBase {
    constructor() {
        super(...arguments);
        this._lastDateUsedString = '';
        this._lastDateUsedMap = null;
        this._resultsColumnOrderString = '';
        this._resultsColumnOrder = null;
        this._showDateForStartFinish = false;
        this.onResultsColumnOrderChanged = () => { };
    }
    get enableDateInput() {
        return this._enableDateInput;
    }
    set enableDateInput(value) {
        if (this._enableDateInput === value) {
            return;
        }
        this._enableDateInput = value;
        this.onChange();
    }
    get resultsColumnOrder() {
        // we need to check for the instance of, because deserialization return an empty object.
        if (!this._resultsColumnOrder || !(this._resultsColumnOrder instanceof Map)) {
            this._resultsColumnOrder = LocalStorageHandler.deserializeMap(this._resultsColumnOrderString);
        }
        return this._resultsColumnOrder || new Map();
    }
    set resultsColumnOrder(value) {
        if (JSON.stringify(this._resultsColumnOrder) == JSON.stringify(value)) {
            return;
        }
        this._resultsColumnOrder = value;
    }
    saveResultsColumnOrder() {
        // if (!this._resultsColumnOrder) {
        //     return;
        // }
        this._resultsColumnOrderString = LocalStorageHandler.serializeMap(this.resultsColumnOrder);
        this.onChange();
    }
    get lastDateUsedMap() {
        // we need to check for the instance of, because deserialization return an empty object.
        if (!this._lastDateUsedMap || !(this._lastDateUsedMap instanceof Map)) {
            this._lastDateUsedMap = LocalStorageHandler.deserializeMap(this._lastDateUsedString);
            // deserializing is likely brining in strings but we want date objects.
            if (this._lastDateUsedMap instanceof Map) {
                this._lastDateUsedMap.forEach((value, key) => {
                    if (typeof value === 'string') {
                        this._lastDateUsedMap.set(key, new Date(value));
                    }
                });
            }
        }
        return this._lastDateUsedMap || new Map();
    }
    getLastDateUsedForRace(raceId) {
        return this.lastDateUsedMap.get(raceId) || null;
    }
    setLastDateUsedForRace(raceId, date) {
        this.lastDateUsedMap.set(raceId, date);
        this._lastDateUsedString = LocalStorageHandler.serializeMap(this.lastDateUsedMap);
        this.onChange();
    }
    set showDateForStartFinish(value) {
        if (this._showDateForStartFinish === value) {
            return;
        }
        this._showDateForStartFinish = value;
        this.onChange();
    }
    get showDateForStartFinish() {
        return this._showDateForStartFinish;
    }
}
class UIManipulator {
    constructor(document) {
        this.document = document;
    }
    createDivWithClass(...className) {
        return this.addClassesToDiv(this.document.createElement('div'), ...className);
    }
    addClassesToDiv(div, ...className) {
        className.forEach((name) => {
            div.classList.add(name);
        });
        return div;
    }
    setToggleValue(newValue, toggle) {
        if (newValue) {
            toggle.classList.add('enabled');
        }
        else {
            toggle.classList.remove('enabled');
        }
    }
    createToggle(currentValue, callback) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('toggleWrap', 'ease');
        wrapperDiv.style.marginTop = '0px';
        wrapperDiv.style.marginLeft = '-2px';
        wrapperDiv.style.marginRight = '3px';
        const toggleSlider = document.createElement('div');
        toggleSlider.classList.add('toggleSlider', 'ease');
        wrapperDiv.appendChild(toggleSlider);
        wrapperDiv.addEventListener('click', () => {
            callback();
        });
        this.setToggleValue(currentValue, wrapperDiv);
        return wrapperDiv;
    }
    createTooltip(tooltipText) {
        const tooltipWrapper = document.createElement('div');
        tooltipWrapper.classList.add('tooltipDotWrapper');
        const tooltipDot = document.createElement('div');
        tooltipDot.classList.add('tooltipDot', 'info', 'tooltip');
        const tooltipSpan = document.createElement('span');
        tooltipSpan.classList.add('tooltipText', 'easeFast');
        tooltipSpan.textContent = tooltipText;
        tooltipDot.appendChild(tooltipSpan);
        tooltipWrapper.appendChild(tooltipDot);
        return tooltipWrapper;
    }
    addStyles(selector, styles) {
        const styleElement = this.document.createElement('style');
        styleElement.type = 'text/css';
        styleElement.appendChild(this.document.createTextNode(`${selector} {`));
        Object.keys(styles).forEach((style) => {
            styleElement.appendChild(this.document.createTextNode(`${style}: ${styles[style]};`));
        });
        styleElement.appendChild(this.document.createTextNode('}'));
        this.document.head.appendChild(styleElement);
    }
}
// version.ts
const versionDate = '240507';
const versionMinor = '0';
const fullVersion = `0.1.${versionDate}.${versionMinor}`;
// main_script.ts
/// <reference path="version.ts" />
(function () {
    console.log(`clubspot fix version ${fullVersion} by Charley Rathkopf`);
    let page = null;
    window.addEventListener('load', () => {
        page = ScoringPanelPage.create(document);
        if (page) {
            return;
        }
        page = RegattaPage.create(document);
        if (page) {
            return;
        }
    });
})();
// storage.ts
// Define a class to handle local storage operations
class LocalStorageHandler {
    // Copiolot search term "if i have a generic T in typescript, can I find what type T represents?"
    constructor(TCtor, key = '') {
        this.settingsCtor = TCtor;
        const typeName = TCtor.name;
        if (key) {
            this.localStorageKey = `${typeName}_${key}`;
        }
        else {
            const currentUrl = window.location.href;
            const regex = /https:\/\/theclubspot.com\/(dashboard\/regatta|scoring)\/([^/]+)/;
            const match = regex.exec(currentUrl);
            const raceKey = match ? match[2] : '';
            this.localStorageKey = `${typeName}_${raceKey}`;
        }
    }
    // note that this will not support concurancy. There should only be
    // one instance of a settings for any given key.
    getSettings() {
        const data = this.load();
        let settings = new this.settingsCtor();
        settings = Object.assign(settings, data);
        settings.onChange = () => {
            settings.lastSettingsChange = new Date();
            this.save(settings);
        };
        return settings;
    }
    // Save data to local storage
    save(data) {
        localStorage.setItem(this.localStorageKey, JSON.stringify(data));
    }
    // Retrieve data from local storage
    load() {
        const data = localStorage.getItem(this.localStorageKey);
        let result;
        if (data) {
            result = JSON.parse(data);
        }
        else {
            result = new this.settingsCtor();
        }
        return result;
    }
    static deserializeMap(json) {
        const mapRetriever = (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (value._meta && value._meta.type === "map") {
                    return new Map(value.value);
                }
            }
            return value;
        };
        try {
            return new Map(JSON.parse(json, mapRetriever));
        }
        catch (error) {
            console.error("Error deserializing map:", error);
            return new Map();
        }
    }
    static serializeMap(map) {
        const stringifyReplacer = (key, value) => {
            if (typeof value === "object" && value !== null) {
                if (value instanceof Map) {
                    return {
                        _meta: { type: "map" },
                        value: Array.from(value.entries()),
                    };
                }
            }
            return value;
        };
        return JSON.stringify(map, stringifyReplacer);
    }
}
