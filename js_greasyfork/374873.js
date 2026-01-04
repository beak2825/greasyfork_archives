// ==UserScript==
// @name            WME URComments CustomGSheets
// @description     This script is for Custom Comments, that are loaded from a Google Sheets backend, to be used with the script URComments.
// @namespace       dBsooner
// @grant           none
// @grant           GM_info
// @version         2018.11.19.01
// @match           https://editor-beta.waze.com/*editor*
// @match           https://beta.waze.com/*editor*
// @match           https://www.waze.com/*editor*
// @author          Daniel Beames (dBsooner)
// @license         MIT/BSD/X11
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAwCAYAAACFUvPfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQyQjZDNjdEODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjQyQjZDNjdFODYzODExRTRBRDY0Q0I2QjA1MjU4N0EyIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NDJCNkM2N0I4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDJCNkM2N0M4NjM4MTFFNEFENjRDQjZCMDUyNTg3QTIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6++Bk8AAANOElEQVR42tRZ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

// @downloadURL https://update.greasyfork.org/scripts/374873/WME%20URComments%20CustomGSheets.user.js
// @updateURL https://update.greasyfork.org/scripts/374873/WME%20URComments%20CustomGSheets.meta.js
// ==/UserScript==
/* Changelog
 * 2018.11.19.01 - Initial release. - dBsooner
 */

/* This script must be used in conjuction with an associated Google Sheets spreadsheet with "publish to web" enabled for the "script output (do not edit)" tab.
 *
 * This template script uses the following Google Sheet: https://docs.google.com/spreadsheets/d/1cnT1Pb9L6fwz-dGHQaiM__eBkHyfDqPI3lYbjemkvjc/edit?usp=sharing
 * The above google sheet includes all comments from standard "Custom URComments" template.
 *
 * If you would like to use this and customize the responses for yourself, you will need to copy the above sheet, enable publsihing to web for the script output tab,
 * and update the JSON_URL variable below.
 *
 * If you would like to use a modified version of this for use in the list selection from within URComments for something other than "CustomGSheets", you will need
 * to get with rickzabel to add a ListName for you. The name he gives you needs to be placed in the ListName variable below.
 *
 * Thank you! - dBsooner
 *
 */

/* global $ */
/* global GM_info */

(function() {
    var URComments_CustomGSheets_ListName = "CustomGSheets";
    var URComments_CustomGSheets_JSON_URL = "https://spreadsheets.google.com/feeds/list/1cnT1Pb9L6fwz-dGHQaiM__eBkHyfDqPI3lYbjemkvjc/7/public/values?alt=json";
    var URComments_CustomGSheets_Name = GM_info.script.name;
    var URComments_CustomGSheets_Version = GM_info.script.version;
    var URComments_CustomGSheets_UpdateMessage = true; // true - alert the user, false - silent update.
    var URComments_CustomGSheets_VersionUpdateNotes = URComments_CustomGSheets_Name + " has been updated to v" + URComments_CustomGSheets_Version;

    if (URComments_CustomGSheets_UpdateMessage) {
        if (localStorage.getItem(URComments_CustomGSheets_Name + "_Version") !== URComments_CustomGSheets_Version) {
            alert(URComments_CustomGSheets_VersionUpdateNotes);
            localStorage.setItem(URComments_CustomGSheets_Name + "_Version", URComments_CustomGSheets_Version);
        }
    }

    const DEBUG = false;
    function log(message) { console.log(URComments_CustomGSheets_Name + ": ", message); }
    function logError(message) { console.error(URComments_CustomGSheets_Name + ": ", message); }
    function logDebug(message) { if (DEBUG) console.debug(URComments_CustomGSheets_Name + ": ", message); }
    function logWarning(message) { console.warn(URComments_CustomGSheets_Name + ": ", message); }

    var parsedCommentsResults = [];
    var parsedDefaultURTypesResults = [];
    var parsedTextAndTooltipsResults = [];
    var parsedUserPromptsResults = [];
    var reminderMsgIdx, closedNotIdentifiedIdx;

    function setURCommentsVars() {
        return new Promise((resolve,reject) => {
            let result = {error:null};
            logDebug("Setting vars");
            window['Urcomments' + URComments_CustomGSheets_ListName + 'def_names'] = [];
            window['Urcomments' + URComments_CustomGSheets_ListName + 'URC_Text'] = [];
            window['Urcomments' + URComments_CustomGSheets_ListName + 'URC_Text_tooltip'] = [];
            window['Urcomments' + URComments_CustomGSheets_ListName + 'URC_USER_PROMPT'] = [];
            window['Urcomments' + URComments_CustomGSheets_ListName + 'URC_URL'] = [];
            parsedDefaultURTypesResults.forEach(parsedResult => {
                window['Urcomments' + URComments_CustomGSheets_ListName + 'def_names'][parsedResult.index] = parsedResult.text;
            });
            parsedTextAndTooltipsResults.forEach(parsedResult => {
                let type;
                if (parsedResult.type === "TOOLTIP") {
                    type = "Text_tooltip";
                } else if (parsedResult.type === "URL") {
                    type = "URL";
                } else if (parsedResult.type === "REPLYINSTRUCTIONS") {
                    type = "ReplyInstructions";
                } else {
                    type = "Text";
                }

                if (type === "ReplyInstructions") {
                    window['Urcomments' + URComments_CustomGSheets_ListName + type] = parsedResult.text;
                } else {
                    window['Urcomments' + URComments_CustomGSheets_ListName + 'URC_' + type][parsedResult.index] = parsedResult.text;
                }
            });
            parsedUserPromptsResults.forEach(parsedResult => {
                window['Urcomments' + URComments_CustomGSheets_ListName + 'URC_USER_PROMPT'][parsedResult.index] = parsedResult.text;
            });
            window['Urcomments' + URComments_CustomGSheets_ListName + 'Array2'] = parsedCommentsResults;
            window['Urcomments' + URComments_CustomGSheets_ListName + 'ReminderPosistion'] = reminderMsgIdx;
            window['Urcomments' + URComments_CustomGSheets_ListName + 'CloseNotIdentifiedPosistion'] = closedNotIdentifiedIdx;
            resolve(result);
        });
    }

    function loadCommentsSpreadsheetAsync() {
        logDebug("Running Async");
        return new Promise((resolve, reject) => {
            $.get({
                url: URComments_CustomGSheets_JSON_URL,
                success: function(data) {
                    let result = {error:null};
                    var defaultURTypeStart = false;
                    var textAndTooltipsStart = false;
                    var userPromptsStart = false;
                    for(let entryIdx = 0; entryIdx < data.feed.entry.length && !result.error; entryIdx++) {
                        let cellValue = data.feed.entry[entryIdx].title.$t;
                        if (cellValue === "Default_UR_Types_Start") {
                            defaultURTypeStart = true;
                            continue;
                        } else if (cellValue === "Text_and_Tooltips_Start") {
                            defaultURTypeStart = false;
                            textAndTooltipsStart = true;
                            continue;
                        } else if (cellValue === "User_Prompts_Start") {
                            defaultURTypeStart = false;
                            textAndTooltipsStart = false;
                            userPromptsStart = true;
                            continue;
                        } else if (cellValue === "End_of_File") {
                            defaultURTypeStart = false;
                            textAndTooltipsStart = false;
                            userPromptsStart = false;
                            continue;
                        }
                        if (entryIdx === 0) {
                            if (URComments_CustomGSheets_Version < cellValue) {
                                result.error = URComments_CustomGSheets_Name + ' must be updated to at least version ' + cellValue + ' before the custom URComments for ' + URComments_CustomGSheets_ListName + ' can be loaded.';
                            }
                        } else if (entryIdx === 1) {
                            // This is the index for the Reminder Comment
                            reminderMsgIdx = parseInt(cellValue);
                        } else if (entryIdx === 2) {
                            // This is the index for the Closed Not Identified Comment
                            closedNotIdentifiedIdx = parseInt(cellValue);
                        } else {
                            // Process rows into array
                            let splitRow = cellValue.split("|");
                            if (defaultURTypeStart) {
                                parsedDefaultURTypesResults.push({'index':splitRow[0], 'text':splitRow[1]});
                            } else if (textAndTooltipsStart) {
                                var index = parseInt(splitRow[0].replace(/^.*(\d\d) - (.*)/i, '$1'));
                                var type = splitRow[0].replace(/^.*(\d\d) - (.*)/i, '$2').toUpperCase();
                                if (((index === "3" || index === "4" || index === "11") && type === "TEXT") ||
                                    ((index === "5" || index === "6" || index === "7" || index === "11" || index === "23" || index === "24") && type === "TOOLTIP")) {
                                    continue;
                                } else {
                                    var text = splitRow[1];
                                    parsedTextAndTooltipsResults.push({'index':index, 'type':type, 'text':text});
                                }
                            } else if (userPromptsStart) {
                                parsedUserPromptsResults.push({'index':splitRow[0], 'text':splitRow[1]});
                            } else {
                                if(splitRow[0] != "REMOVED" && splitRow[1] != "REMOVED" && splitRow[2] != "REMOVED") {
                                    splitRow.forEach(function(val){
                                        parsedCommentsResults.push(val);
                                    });
                                }
                            }
                        }
                    }
                    logDebug("Finished Async");
                    resolve(result);
                },
                error: function() {
                    window['Urcomments' + URComments_CustomGSheets_ListName + 'Array2'] = [ "<br><b><font color=red>ERROR</font></b>", "", "Open", "An error occurred while loading the " + URComments_CustomGSheets_Name + " custom URComments spreadsheet.", "", "Open" ];
                    reject({message: 'An error occurred while loading the ' + URComments_CustomGSheets_Name + ' custom URComments spreadsheet.'});
                }
            });
        });
    }

    async function URC_CustomGSheets_init() {
        let t0 = performance.now();
        var result = await loadCommentsSpreadsheetAsync().catch((err) => {
            let msg;
            if (err && err.message) {
                msg = err.message;
            } else {
                msg = err;
            }
            window['Urcomments' + URComments_CustomGSheets_ListName + 'Array2'] = [ "<br><b><font color=red>ERROR</font></b>", "", "Open", msg, "", "Open" ];
            logError(msg);
        });
        if (typeof result !== 'undefined') {
            if (result.error) {
                logError(result.error);
                window['Urcomments' + URComments_CustomGSheets_ListName + 'Array2'] = [ "<br><b><font color=red>ERROR</font></b>", "", "Open", result.error, "", "Open" ];
            } else {
               var setURCommentsVarResult = await setURCommentsVars().catch((err) => {
                    let msg;
                    if (err & err.message) {
                        msg = err.message;
                    } else {
                        msg = err;
                    }
                    window['Urcomments' + URComments_CustomGSheets_ListName + 'Array2'] = [ "<br><b><font color=red>ERROR</font></b>", "", "Open", msg, "", "Open" ];
                    logError(msg);
                }).then(() => {
                    logDebug('Loaded ' + parsedCommentsResults.length/3 + ' comments and headers and all text and tooltips in ' + Math.round(performance.now() - t0) + ' ms.');
                    log('Initialized.');
                });
                if (typeof setURCommentsVarResult !== 'undefined') {
                    if (setURCommentsVarResult.error) {
                        logError(setURCommentsVarResult.error);
                        window['Urcomments' + URComments_CustomGSheets_ListName + 'Array2'] = [ "<br><b><font color=red>ERROR</font></b>", "", "Open", setURCommentsVarResult.error, "", "Open" ];

                    }
                }
            }
        }
    }

    function URC_CustomGSheets_bootstrap() {
        log('Initializing...');
        URC_CustomGSheets_init();
    }

    URC_CustomGSheets_bootstrap();
})();