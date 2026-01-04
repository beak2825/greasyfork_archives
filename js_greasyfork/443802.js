// ==UserScript==
// @name         WaniKani Resurrect Manager
// @namespace    rwesterhof
// @version      1.1
// @description  Utility to mass resurrect and reburn items
// @include      /^https:\/\/(www|preview)\.wanikani\.com\/(radicals|kanji|vocabulary)/
// @run-at       document-end
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/443802/WaniKani%20Resurrect%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/443802/WaniKani%20Resurrect%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* global $, wkof */

    wkof.include('Settings,ItemData');
    wkof.ready('Settings').then(init_constants).then(add_css).then(installButton);

    //===== CONSTANTS
    var userLevel;
    const actions = [ "-", '/resurrect', '/burn' ];
    const actionLabels = [ "None", 'Resurrect', 'Reburn' ];
    const baseUri = "/assignments/";
    const itemTypes = [ 'Radicals', 'Kanji', 'Vocabulary' ];
    const itemFilterTypes = [ 'radical', 'kanji', 'vocabulary' ];
    const levelGroups = [ 'Pleasant', 'Painful', 'Death', 'Hell', 'Paradise', 'Reality' ];
    const settings = {
        action: '0',
        minSrs: null,
        types: [],
        levels: []
    };

    function init_constants() {
        userLevel = $('li.user-summary__attribute a')[0].href.split('/level/')[1];
    }

    //===== ADD ENTRYPOINT TO PAGE
    function installButton() {
        // install icon
        var rmButton = '<button id="resurrectManager" onclick="manageResurrection()" title="Resurrect Manager" class="iconButton" style="float:right;"><i class="fa fa-fire"></i></button>';
        $('aside.subject-legend').prepend(rmButton);
    }

    //====== CONFIGURATION
    function getSelectedTypes() {
        return settings.types.map((value, index) => { return { type: index, selected: value }; }).filter(item => item.selected).map(item => itemFilterTypes[item.type]);
    }
    function getSelectedLevels() {
        return settings.levels.map((value, index) => { return { level: index, selected: value }; }).filter(item => item.selected).map(item => item.level);
    }
    function getMinSrs() {
        if (settings.action == '2') {
            return settings.minSrs;
        }
        // no meaning for anything other than Reburn
        return null;
    }

    //======== CHECK PRIORS AND PROCESS THE ACTION
    function calculateAndExecute() {
        if (settings.action == '0') {
            console.log("No action selected");
            return;
        }
        var selectedTypes = getSelectedTypes();
        if (selectedTypes.length == 0) {
            console.log("No types selected");
            return;
        }
        var selectedLevels = getSelectedLevels();
        if (selectedLevels.length == 0) {
            console.log("No levels selected");
            return;
        }

        wkof.ready('ItemData').then(fetchItems).then(calculate).then(executeAction);
    }

    //======== PROCESS THE ACTION
    var progressData = [];
    var forceWkOfUpdate = false;
    function executeAction(itemsToProcess) {

        var actionIndex = settings.action;
        var progressIndex = progressData.length;
        var authToken = $('meta[name="csrf-param"]')[0].content;
        var authTokenValue = $('meta[name="csrf-token"]')[0].content;

        progressData[progressIndex] = {
            name: 'resurrect_manager_progress',
            label: actionLabels[actionIndex],
            value: 0,
            max: itemsToProcess.itemIds.length,
            actionIndex: actionIndex,
            authToken: authToken,
            authTokenValue: authTokenValue,
            failed :0
        };
        wkof.Progress.update(progressData[index]);


        const request_delay = 200; //ms
        var index = 0;

        itemsToProcess.itemIds.map(itemId => {
            setTimeout("window.resurrect_manager_actionItem(" + itemId + ", " + progressIndex + ")", index * request_delay);
            index++;
        });
        forceWkOfUpdate = true;
    }

    //======== DELAYED PROCESSING
    function actionItem(itemId, progressIndex) {
        postUpdate(baseUri + itemId + actions[progressData[progressIndex].actionIndex], progressData[progressIndex].authToken, progressData[progressIndex].authTokenValue).then(processActionResult, failActionResult);

        //===================
        function processActionResult(html) {
            progressData[progressIndex].value += 1;
            wkof.Progress.update(progressData[progressIndex]);
            if (progressData[progressIndex].value == progressData[progressIndex].max) {
                console.log(progressData[progressIndex].label + " " + progressData[progressIndex].max + " items complete. Failed " + progressData[progressIndex].failed + " items.");
            }
        }
        function failActionResult(reason) {
            console.log(progressData[progressIndex].label + " of " + itemId + " failed: " + reason);
            progressData[progressIndex].value += 1;
            progressData[progressIndex].failed += 1;
            wkof.Progress.update(progressData[progressIndex]);
            if (progressData[progressIndex].value == progressData[progressIndex].max) {
                console.log(progressData[progressIndex].label + " " + progressData[progressIndex].max + " items complete. Failed " + progressData[progressIndex].failed + " items.");
            }
        }
    }
    window.resurrect_manager_actionItem=actionItem;

    //======== FIRE THE HTML REQUEST
    function promise(){var a,b,c=new Promise(function(d,e){a=d;b=e;});c.resolve=a;c.reject=b;return c;}
	function postUpdate(url, authToken, authTokenValue) {
		var update_promise = promise();

        var request = new XMLHttpRequest();
        request.onreadystatechange = process_result;
        request.open('POST', url, true);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send("_method=put&"+authToken+"="+ authTokenValue);
        return update_promise;

		function process_result(event){
			if (event.target.readyState !== 4) return;
			if (event.target.status >= 400 || event.target.status === 0) {
                return update_promise.reject(event.target.status);
            }
            update_promise.resolve(event.target.response);
		}
	}

    //======== CALCULATE IMPACT OF CHOICES AND DISPLAY ON BUTTON
    function displayCounts() {
        wkof.ready('ItemData').then(fetchItems).then(calculate).then((itemsToProcess) => {
            $('button.setting[name="calculateButton"]').html("Found " + itemsToProcess.itemIds.length + " items - Recount");
        });
    }

    //======== WKOF ITEM RETRIEVAL
    function fetchItems() {
        var selectedTypes = getSelectedTypes().join(",");
        var selectedLevels = getSelectedLevels().join(",");
//        console.log("Finding " + selectedTypes + " items from levels " + selectedLevels + " for action " + actions[settings.action]);

        var config = {
            wk_items: {
                options: { assignments: true },
			    filters: {
                    have_burned: true,
                    level: selectedLevels,
                    item_type: selectedTypes
                }
			}
		};

        var minSrs = getMinSrs();
        if ((minSrs) && (minSrs != '0')) {
            config.wk_items.filters.srs = minSrs;
        }

        // we force update after an action because the 60s wait can mess with expected counts
		var promise = wkof.ItemData.get_items(config, { force_update: forceWkOfUpdate });
        forceWkOfUpdate = false;
        return promise;
    }

    //======== POST PROCESSING OF ITEM RETRIEVAL - CREATE LIST OF IDS TO ACTION
    function calculate(items) {
        window.tempVar = items;
        var result = {
            itemIds: []
        };
        items.map(item => {
            if (   ((settings.action == '2') && (item.assignments.resurrected_at != null))
                || ((settings.action == '1') && (item.assignments.resurrected_at == null))
               ) {
                result.itemIds.push(item.id)
            }
        });
//        console.log("Found " + result.itemIds.length + " items");
        return result;
    }

    // Load settings and set them to blank
    function blank_settings() {
        settings.action = '0';
        settings.minSrs = null,
        settings.types = [];
        settings.levels = [];
    }

    // Opens the manager
    function manageResurrection() {
        blank_settings();

        var config = {
            script_id: 'resurrect_manager',
            title: 'Resurrect Manager',
            on_save: calculateAndExecute,
            content: {
                resurrectPage: {
                    type: 'page',
                    label: 'Manager',
                    hover_tip: 'Choose action, type and levels and click Calculate',
                    content: {
                        resurrectOptions: {
                            type: 'group',
                            label: 'Options',
                            content: {
                                action: {
                                    type: 'dropdown',
                                    label: 'Action',
                                    hover_tip: 'Choose whether to resurrect or reburn',
                                    default: '0',
                                    no_save: true,
                                    on_change: triggerActionChange,
                                    content: {
                                        0: 'none',
                                        1: 'Resurrect',
                                        2: 'Reburn'
                                    }
                                },
                                minSrs: {
                                    type: 'dropdown',
                                    label: '',
                                    hover_tip: 'Limit reburns to items that have reached at least srs stage',
                                    default: '0',
                                    no_save: true,
                                    on_change: triggerMinSrsChange,
                                    content: {
                                        '0'             : 'Always',
                                        '2,3,4,5,6,7,8' : "When at least Apprentice II",
                                        '5,6,7,8'       : 'When at least Guru',
                                        '7,8'           : 'When at least Master',
                                        '8'             : 'When Enlightened'
                                    }
                                },
                                typeButton: {
                                    type: 'button',
                                    on_change: triggerTypeChange
                                },
                                types: {
                                    type: 'html',
                                    wrapper: 'row',
                                    hover_tip: 'Choose which types to act on'
                                },
                                calculateButton: {
                                    type: 'button',
                                    text: 'Count items',
                                    on_click: displayCounts
                                }
                            }
                        },
                        levels: {
                            type: 'group',
                            label: 'Levels',
                            content: {
                                levelButton: {
                                    type: 'button',
                                    on_change: triggerLevelChange
                                },
                                levelBoxes: {
                                    type: 'html',
                                    wrapper: 'row',
                                    hover_tip: 'Choose which levels to act on'
                                }
                            }
                        }
                    }
                }
            }
        };

        var selectedTypes = config.content.resurrectPage.content.resurrectOptions.content.types;
        selectedTypes.html = '<table width="100%"><tr>';
        for (var index in itemTypes) {
            selectedTypes.html += '<td><input type="checkbox" class="setting" id="resurrect_manager_types_' + index + '" name="typeButton" /><span style="margin-left:5%;">' + itemTypes[index] + '</span></td>';
        }
        selectedTypes.html += '</tr></table>';

        var levelBoxes = config.content.resurrectPage.content.levels.content.levelBoxes;
        levelBoxes.html = '<table width="100%"><thead><tr>';
        for (var levelGroup in levelGroups) {
            levelBoxes.html += '<th style="width:16%;height:2em;text-align:left;">' + levelGroups[levelGroup] + '</th>';
        }
        levelBoxes.html += '</tr></thead><tbody>';
        for (var ones = 0; ones <= 9; ones++) {
            levelBoxes.html += '<tr>';
            for (var tens = 0; tens <= 5; tens++) {
                levelBoxes.html += '<td>';
                var processing = 10*tens + ones + 1;
                if (processing <= userLevel) {
                    levelBoxes.html += '<input type="checkbox" class="setting" id="resurrect_manager_levels_' + processing + '" name="levelButton" /><span style="display:inline-block;width:30%;text-align:right;">' + processing + '</span>';
                }
                levelBoxes.html += '</td>';
            }
            levelBoxes.html += '</tr>';
        }
        levelBoxes.html += "</tbody></table>";

        var dialog = new wkof.Settings(config);
        dialog.refresh();
        dialog.open();
    }
    window.manageResurrection = manageResurrection;

    //======== CSS TO ENFORCE DISPLAY OF OPTIONS DIALOG
    function add_css() {
        $('head').append(
            `<style id="resurrect_manager_css">
                 #wkof_ds .wkof_settings button.setting[name="typeButton"],
                 #wkof_ds .wkof_settings button.setting[name="levelButton"],
                 #wkof_ds .wkof_settings select.setting[name='minSrs'],
                 #wkof_ds .wkof_settings label[for="resurrect_manager_minSrs"] {
                     display:none;
                 }
             </style>`);
    }

    //======== OPTION UPDATES
    function triggerActionChange(name, value, item) {
        settings.action = value;
        $('#wkof_ds .wkof_settings label[for="resurrect_manager_minSrs"').css('display', (settings.action == '2') ? 'inline-block' : 'none');
        $('#wkof_ds .wkof_settings select.setting[name="minSrs"]').css('display', (settings.action == '2') ? 'inline-block' : 'none');
    }

    function triggerMinSrsChange(name, value, item) {
        settings.minSrs = value;
    }

    function triggerTypeChange(name, value, item) {
        var elem = $(event.currentTarget);
        var idComponents = elem.attr('id').split("_");
        settings.types[idComponents[idComponents.length-1]] = elem.is(":checked");
    }

    function triggerLevelChange(name, value, item) {
        var elem = $(event.currentTarget);
        var idComponents = elem.attr('id').split("_");
        settings.levels[idComponents[idComponents.length-1]] = elem.is(":checked");
    }
})();