// ==UserScript==
// @name         WME Display Object History
// @namespace    https://greasyfork.org/users/32336-joyriding
// @version      2021.07.08.01
// @description  Displays the available history of objects not shown in native WME
// @author       Joyriding
// @include      https://beta.waze.com/*
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428106/WME%20Display%20Object%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/428106/WME%20Display%20Object%20History.meta.js
// ==/UserScript==

/* global W */
/* global OpenLayers */
/* global I18n */
/* global $ */
/* global WazeWrap */
/* global require */
/* global google */
/* global Backbone */

(function() {
    'use strict';

    var settings = {};
    var _wmeDohFeatureLayer;
    var _wmeDohMarkerLayer;

    var projection=new OpenLayers.Projection("EPSG:900913");
    var displayProjection=new OpenLayers.Projection("EPSG:4326");

    const DAY_MS = 1000 * 60 * 60 * 24;
    const WEEK_MS = DAY_MS * 7;

    function bootstrap(tries) {
        tries = tries || 1;

        if (W && W.map &&
            W.model && W.loginManager.user &&
            WazeWrap.Ready && $ ) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    function init()
    {
        console.log('D\'OH: init begin');

        let updateDesc = `<style>#wmeDohUpdate > li {margin-top:6px;margin-left: -22px;}</style>

        <ul id='wmeDohUpdate'>
        <li>Fixed Street history display in beta.</li>
        </ul>

        <span style='color:red'>Reminder that this is an SM+ script!</span>`;
 
        WazeWrap.Interface.ShowScriptUpdate("Display Object History", GM_info.script.version, updateDesc);
 

        var $section = $('<div id="wmeDohPanel">');
        $section.html(
            '<div id="wmeDohHead">',

            '</div>'
        );

        var $navTabs = $('<ul id="wmeDohSubTabs" class="nav nav-tabs"><li class="active"><a data-toggle="tab" href="#wmeDohTabFind">Find</a></li>' +
                         '<li><a data-toggle="tab" href="#wmeDohTabSettings"><span class="fa fa-gear"></span></a></li></ul>');
        var $tabContent = $('<div class="tab-content" style="padding:5px;">');
        var $dohTabFind = $('<div id="wmeDohTabFind" class="tab-pane active">');
        $dohTabFind.append([
            '<h4 style="margin-top:0px;">Display Object History</h4>',
            '<h6 style="margin-top:0px;">' + GM_info.script.version + '</h6>'
        ].join(' '));

        var $dohTabSettings = $('<div id="wmeDohTabSettings" class="tab-pane">');
        $dohTabSettings.append([
            '<h4>Settings</h4>',
            '<div id="wmeDohSettings">',
            '<div class="controls-container" style="padding-top: 2px;">Rate Limit Delay: <input type="text" id="wmeDohRateLimitDelay" ><label for="wmeDohRateLimitDelay"></label></div>',
            '</div>'
        ].join(' '));

        $('#wmeDohTabSettings').append('div').append('Reset Settings');

        $tabContent.append($dohTabFind,$dohTabSettings);
        $section.append($navTabs, $tabContent);
        $section.append(getStyle());

        new WazeWrap.Interface.Tab('D\'OH', $section.html(), initializeSettings);

        W.selectionManager.events.register("selectionchanged", null, objectSelected);


        console.log('D\'OH: init end');
        
        if (WazeWrap.hasSelectedFeatures())
        { 
            objectSelected();
        }
    }

    function initializeSettings()
    {
        loadSettings();
        //setChecked('wmeDohIncludeSelf', settings.IncludeSelf);
    

        //   if(settings.Enabled)
        //      W.selectionManager.events.register("selectionchanged", null, drawSelection);

        $('.wmeDohSettingsCheckbox').change(function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = this.checked;
            saveSettings();
            if(this.checked)
            {
                //   W.selectionManager.events.register("selectionchanged", null, drawSelection);
                //   processVenues(W.model.venues.getObjectArray());
            }
            else
            {
                //  W.selectionManager.events.unregister("selectionchanged", null, drawSelection);
                //   wmeDohSelectedLayer.removeAllFeatures();
                // processVenues(W.model.venues.getObjectArray());
            }
        });


        $('.wmeDohSettingsText').on('input propertychange paste', function() {
            var settingName = $(this)[0].id.substr(6);
            settings[settingName] = parseInt($(this).val());
            saveSettings();

            //W.selectionManager.events.unregister("selectionchanged", null, drawSelection);
            //processVenues(W.model.venues.getObjectArray());
        });


    }

    function objectSelected() {
        if(WazeWrap.hasSelectedFeatures())
        {
            let selectedModel = WazeWrap.getSelectedFeatures()[0].model;
            switch (selectedModel.type) {
                case "segment":
                    objectHandlerStreet(selectedModel, selectedModel.type);
                    break;
                case "node":
                    objectHandlerNode(selectedModel, selectedModel.type);
                    break;
                case "camera":
                    objectHandlerCamera(selectedModel, selectedModel.type);
                    break;
                case "bigJunction":
                    objectHandlerBigJunction(selectedModel, selectedModel.type);
                    break;
                case "mapComment":
                    objectHandlerMapComment(selectedModel, selectedModel.type);
                    break;
            }
        }
    }

    async function objectHandlerStreet(model, objectType) {
        objectType = "street";
        let attr = model.attributes;
        let historyType = "Street";
        let historyName;

        let objectIDs = [ attr.primaryStreetID ];
        if (attr.streetIDs != null) {
            attr.streetIDs.forEach(function(streetID) {
                objectIDs.push(streetID);
            });
        }

        objectIDs.forEach(function(objectID) {

            if (objectID != null) {
                let streetName = WazeWrap.Model.getStreetName(objectID);
                if (streetName == null || streetName == "") {
                    streetName = "No street";
                }
                let cityName = WazeWrap.Model.getCityName(objectID);
                if (cityName == null || cityName == "") {
                    cityName = "No city";
                }
                historyName = ` (${streetName}, ${cityName})`
                
                //console.log(attr);
                $('#segment-edit-general').append(buildHistoryContainer(objectType, objectID, historyType, historyName));
            }
        });
    }

    async function objectHandlerNode(model, objectType) {
        let attr = model.attributes;
        let objectID = attr.id;
        let historyType = "Node";
        let historyName = "";
        
        //console.log(attr);
        
        $('#edit-panel > div > div > div > div.tab-content').append(buildHistoryContainer(objectType, objectID, historyType, historyName));
    }

    async function objectHandlerCamera(model, objectType) {
        let attr = model.attributes;
        let objectID = attr.id;
        let historyType = "Camera";
        let historyName = "";
        
        $('#edit-panel > div > div > div > div.tab-content').append(buildHistoryContainer(objectType, objectID, historyType, historyName));
    }

    async function objectHandlerBigJunction(model, objectType) {
        let attr = model.attributes;
        let objectID = attr.id;
        let historyType = "Junction Box";
        let historyName = "";
        
        $('#edit-panel > div > div > div > div.tab-content').append(buildHistoryContainer(objectType, objectID, historyType, historyName));
    }

    async function objectHandlerMapComment(model, objectType) {
        let attr = model.attributes;
        let objectID = attr.id;
        let historyType = "Map Comment";
        let historyName = "";
        
        $('#edit-panel > div').append(buildHistoryContainer(objectType, objectID, historyType, historyName));
    }

    function buildHistoryContainer(objectType, objectID, historyType, historyName) {

        let $loadingHistory = 
                 $(`<div class="loadingHistory">`)
                    .append($(`<div class="fa-spin spinner">`));

        let $transactionList = $('<ul id="wmeDohTransactionList">');

        let $container = $(`<div class="elementHistoryContainer wmeDohElementHistoryContainer" data-object-id="${objectID}">`)
                    .append($('<div class="toggleHistory">')
                        .append($(`<div class="showHistory">View ${historyType} History${historyName}</div>`))
                        .append($(`<div class="hideHistory wmeDohHidden">Hide ${historyType} History${historyName}</div>`))
                    )
                    .append($('<div class="wmeDohHistoryContent wmeDohHidden">')
                            .append($('<div class="transactions">')
                                    .append($transactionList)
                                   )
                             .append($loadingHistory)
                           );
        let $content = $container.find('.wmeDohHistoryContent'); 
        let $historyElemnent = $container.find('.toggleHistory');
        
        $historyElemnent.click(async function() { 
            toggleHistory($historyElemnent, $content); 

            if (!$loadingHistory.hasClass("wmeDohHidden")) {
                let elementHistory = await getElementHistory(objectType, objectID, null);
                await displayElementHistory(objectType, objectID, historyName, elementHistory, $transactionList);
                $loadingHistory.addClass("wmeDohHidden");
            }
        });

        return $container;
    }

    async function getElementHistory(type, id, nextTransactionDate) {
        let jsonData;
            try {
                jsonData = await W.controller.descartesClient.getElementHistory(type,id,nextTransactionDate);
            }
            catch (error) {
                console.log(error);
            }
            if (jsonData && (jsonData.error === undefined) )
                return jsonData;
    }

    async function displayElementHistory(type, objectID, title, elementHistory, $transactionList) {
        
        let $output;

        elementHistory.transactions.objects.forEach(function (transaction) {
            transaction = transaction.attributes;
            let username;
            let profileUrl;
            elementHistory.users.objects.forEach(function(user) {
                // TODO: Clean up username lookup. Check to see how deleted users are handled.
                if (user.id === transaction.userID) {
                    username = `${user.userName}(${user.rank + 1})`; 
                    profileUrl = `https://www.waze.com/user/editor/${user.userName}`;
                }
            });
            let date = timeConverter(transaction.date);
            
           // console.log(`Transaction: ${username} ${date}`)
            let actions = displayActions(type, transaction);

            $transactionList
             .append($(`<li class="wmeDoh-element-history-item wmeDoh-tx-has-content closed" data-transaction-i-d="${transaction.transactionID}">`)
                .append($('<div class="wmeDoh-tx-header">')
                .append($('<div class="wmeDoh-tx-summary">')
                    .append($(`<div class="tx-author-date">${date} by <a target="_blank" href="${profileUrl}" rel="noopener noreferrer">${username}<a/></div>`))
                    .append($('<div class="tx-preview">')
                        .append($('<div>' + actions.description + '</div>'))
                    )
                )
                .append($('<div class="flex-noshrink wmeDoh-tx-toggle-closed">'))
            )
                .append($(`<div class="wmeDoh-tx-content">`)
                    .append($(`<div class="main-object-region tx-changes">`)
                        .append($(`<ul>`)
                            .append($('<span>')
                                .append($('<li class="tx-changed-attribute ca-visual">')
                                    .append($('<div class="ca-preview">').append($('<span>')
                                        .append(actions.output)
                                    
                                    ))
                                )
                            )
                        )
                )
                )
            
            );

            let tx = $(`li[data-transaction-i-d='${transaction.transactionID}']`);
            tx.click (function () {
                toggleDetailsDropDown(tx);
            });

        });

        if (elementHistory.transactions.nextTransaction != null) {
            let $loadingHistory = 
                 $(`<div class="loadingHistory wmeDohHidden">`)
                    .append($(`<div class="fa-spin spinner">`));
                    
            let $nextTransactionButton  =
                $(`<div class="loadMoreContainer">`)
                    .append($(`<div class="btn btn-block btn-default loadMoreHistory">Load more</div>`))
                    .append($(`<div class="history-message historyError wmeDohHidden">There was an error trying to load the history</div>`))        

            $transactionList.append($loadingHistory).append($nextTransactionButton);
            
            let $loadMoreBtn = $nextTransactionButton.find('.loadMoreHistory');
            $loadMoreBtn.click(async function() { 
                $loadingHistory.removeClass("wmeDohHidden");
                let elementHistoryMore = await getElementHistory(type, objectID, elementHistory.transactions.nextTransaction);
                await displayElementHistory(type, objectID, title, elementHistoryMore, $transactionList);
                $loadingHistory.addClass("wmeDohHidden");
                // TODO: Show error message
                $nextTransactionButton.addClass("wmeDohHidden");
            });
        }       
    }

    function displayActions(type, transaction) {
        let actions = {
            description: null,
            output: null,
            flagShield: false
        };

        let actionCount = 0;
        let allActions = [];

        transaction.objects.forEach(function(action) {
            action = action.attributes;
            actionCount++;

            let changes 
            switch (action.actionType) {
                case 'UPDATE':
                    changes = getActionPropertiesUpdate(action.objectType, action.oldValue, action.newValue);
                    break;
                case 'ADD':
                    changes = getActionPropertiesAdd(action.objectType, action.newValue);
                    break;
                case 'DELETE':
                    changes = getActionPropertiesDelete(action.objectType, action.oldValue);
                    break;
            }

            allActions.push(changes.propertyChanges.join("<br />"));
            actions.description = changes.description;
            if (changes.flagShield == true) {
                actions.flagShield = changes.flagShield;
            }
            
        });
        
        actions.output = allActions.join("<hr />");
        if (actionCount > 1) {
            actions.description = "";
            if (actions.flagShield) {
                actions.description += "Shield changes<br />"
            }
            actions.description += "Multiple changes";
            
        }
        return actions;
    }

    function getActionPropertiesAdd(type, newValue) {
        
        let changes = {
            description: null,
            propertyChanges: null,
            flagShield: false
        }

        let propertyChanges = [];

        for (var prop in newValue) {
            propertyChanges.push(`<span class="tx-changed-ro">Added ${prop}: ${getSpecialProperty(type, prop, newValue[prop])}</span>`)
        }

        let uniqueActions;
        switch (type) {
            case "street":
                uniqueActions = getUniqueActionStreet(type, null, newValue);
                changes.description = uniqueActions.description;
                changes.flagShield = uniqueActions.flagShield;
                if (uniqueActions.output != null) {
                    propertyChanges.push(uniqueActions.output);
                }
                break;
            case "segmentStreet":
                changes.description = "Street Name added to segment";
                break;
            default:
                changes.description = `${type} added`;
        }

        changes.propertyChanges = propertyChanges;
        return changes;
    }

    function getActionPropertiesDelete(type, oldValue) {
        
        let changes = {
            description: null,
            propertyChanges: null,
            flagShield: false
        }

        let propertyChanges = [];

        for (var prop in oldValue) {
            propertyChanges.push(`<span class="tx-changed-ro">Removed ${prop}: ${getSpecialProperty(type, prop, oldValue[prop])}</span>`)
        }

        let uniqueActions;
        switch (type) {
            case "street":
                uniqueActions = getUniqueActionStreet(type, oldValue, null);
                changes.description = uniqueActions.description;
                changes.flagShield = uniqueActions.flagShield;
                if (uniqueActions.output != null) {
                    propertyChanges.push(uniqueActions.output);
                }
                break;
            case "segmentStreet":
                changes.description = "Street Name removed from segment";
                break;
            default:
                changes.description = `${type} deleted`;
        }

        changes.propertyChanges = propertyChanges;
        return changes;
    }

    function getActionPropertiesUpdate(type, oldValue, newValue) {
        
        let changes = {
            description: null,
            propertyChanges: null,
            flagShield: false
        }

        let propertyChanges = [];

        for (var prop in newValue) {
            //console.log(`${prop}: ${oldValue[prop]} > ${newValue[prop]}` );
            if (oldValue[prop] == null & newValue[prop] != null) {
                //added
                propertyChanges.push(`<span class="tx-changed-ro">Added ${prop}: ${getSpecialProperty(type, prop, newValue[prop])}</span>`)
            } else if (oldValue[prop] != null & newValue[prop] == null) {
                //removed
                propertyChanges.push(`<span class="tx-changed-ro">Removed ${prop}: ${getSpecialProperty(type, prop, oldValue[prop])}</span>`)
            } else if (oldValue[prop] != null & newValue[prop] != null) {
                //updated
                propertyChanges.push(`<span class="tx-changed-ro">Updated ${prop}: ${getSpecialProperty(type, prop, oldValue[prop])} to ${getSpecialProperty(type, prop, newValue[prop])}</span>`)
            } 
        }

        let uniqueActions;
        switch (type) {
            case "street":
                uniqueActions = getUniqueActionStreet(type, oldValue, newValue);
                changes.description = uniqueActions.description;
                changes.flagShield = uniqueActions.flagShield;
                if (uniqueActions.output != null) {
                    propertyChanges.push(uniqueActions.output);
                }
                break;
            case "segmentStreet":
                changes.description = "Name assigned to segment";
                break;
            default:
                changes.description = `${type} updated`;
        }

        changes.propertyChanges = propertyChanges;
        return changes;
    }

    function getUniqueActionStreet(type, oldValue, newValue) {
        let oldEmpty, newEmpty, added, deleted, unchanged, updated = false;
        let signChange = null;

        let actions = {
            description: null,
            output: null,
            flagShield: false
        };

        let oldShield
        if (oldValue != null) {
            oldShield = getShieldImgAndDirection(oldValue);
        }
        let newShield
        if (newValue != null) {
            newShield = getShieldImgAndDirection(newValue);
        }
        
        if (oldValue?.signType == null & oldValue?.signText == null & newValue?.signType != null & newValue.signText != null) {
            actions.description = "Added Shield";
            actions.flagShield = true;
        } else if (oldValue?.signType != null & oldValue?.signText != null & newValue?.signType == null & newValue.signText == null) {
            actions.description = "Removed Shield";
            actions.flagShield = true;
        } else {
            actions.description = "Updated Shield";
            actions.flagShield = true;
        }

        if (oldValue?.signType == null & newValue?.signType != null) {
            actions.output = `<span class="tx-changed-ro">Added ${newShield}</span>`;
            actions.flagShield = true;
        } else if (oldValue?.signType != null & newValue?.signType == null) {
            actions.output = `<span class="tx-changed-ro">Removed ${oldShield}</span>`;
            actions.flagShield = true;
        } else if (oldValue?.signType != null & newValue?.signType != null) {
            actions.output = `<span class="tx-changed-ro">Updated ${oldShield} to ${newShield}</span>`;
            actions.flagShield = true;
        } 

        return actions;
    }

    function getSpecialProperty(type, property, value) {
        switch(property) {
            case "rank":
            case "lockRank":
                if (value != null) {
                    value++;
                }
                break;
        }

        return value;
    }

    function getShieldImgAndDirection(value) {
        if (value?.signType) {
            if (value.direction == undefined) {
                value.direction = "";
            }
        }
        return `${getShieldRenderImg(value.signType, value.signText)} ${value.direction}`;
    }

    function getShieldRenderUrl(signType, signText) {
        let url = `https://renderer-am.waze.com/renderer/v1/signs/${signType}`;
        if (signText != undefined) {
            url += `?text=${signText}`;
        }
        return url;
    }

    function getShieldRenderImg(signType, signText) {
        if (signType == undefined) {
            return signText;
        } else {
            return `<img class="sign-image" src="${getShieldRenderUrl(signType, signText)}" />`;
        }
    }


    function saveSettings() {
        if (localStorage) {
            var localsettings = {
                Enabled: settings.Enabled
            };

            localStorage.setItem("wmeDoh_Settings", JSON.stringify(localsettings));
        }
    }

    function loadSettings() {
        var loadedSettings = $.parseJSON(localStorage.getItem("wmeDoh_Settings"));
        var defaultSettings = {
            Enabled: true
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop))
                settings[prop] = defaultSettings[prop];
        }

    }

    function prepareTab() {
        let tabs = document.getElementById('user-tabs');
        let items = tabs.getElementsByTagName('li');
        for (var i = 0; i < items.length; ++i) {
            let a = items[i].getElementsByTagName('a')[0]
            if (a.href.includes('sidepanel-doh')) {
                a.id = "wmeDhoTab";
                a.innerHTML = 'D\'OH';
            }
        }
    }

    function selectTab() {
        let tabs = document.getElementById('user-tabs');
        let items = tabs.getElementsByTagName('li');
        for (var i = 0; i < items.length; ++i) {
            let a = items[i].getElementsByTagName('a')[0]
            if (a.href.includes('sidepanel-doh')) {
                items[i].getElementsByTagName('a')[0].click();
            }
        }
    }

    function toggleDetailsDropDown($element) {
        if ($element.hasClass('closed')) {
            $element.removeClass('closed');
        } else {
            $element.addClass('closed');
        }
    }

    function toggleHistory($element, $content) {
        let showHistory = $element.find('.showHistory');
        let hideHistory = $element.find('.hideHistory');

        if (showHistory.hasClass('wmeDohHidden')){
            showHistory.removeClass('wmeDohHidden');
            hideHistory.addClass('wmeDohHidden');
            $content.addClass('wmeDohHidden');
        } else {
            showHistory.addClass('wmeDohHidden');
            hideHistory.removeClass('wmeDohHidden');
            $content.removeClass('wmeDohHidden');
        }
    }

    function dateToUuid(inputDate) {
        let timestamp = parseInt(new Date(inputDate).getTime());
        // uuid = "a02102cd-19df-11e9-bd87-1201fde9baf6"
        // timestamp = 1547678386643;
        let a = timestamp * 10000;
        let b = a + 122192928000000000;
        let c = b.toString(16);
        //if (c.length % 2) {
        //   c = '0' + c;
        //}
        let d = c.substring(7) + '-' + c.substring(3,7) + '-1' + c.substring(0,3) + '-bd87-1201fde9baf6';

        return d;
    }

    function get_time_int(uuid_str) {
        var uuid_arr = uuid_str.split( '-' ),
            time_str = [
                uuid_arr[ 2 ].substring( 1 ),
                uuid_arr[ 1 ],
                uuid_arr[ 0 ]
            ].join( '' );
        return parseInt( time_str, 16 );
    };

    function uuidToUnixTime(uuid_str) {
        var int_time = get_time_int( uuid_str ) - 122192928000000000,
            int_millisec = Math.floor( int_time / 10000 );
        return int_millisec;
    };

    function uuidToDate(uuid_str) {
        var int_time = get_time_int( uuid_str ) - 122192928000000000,
            int_millisec = Math.floor( int_time / 10000 );
        //return new Date( int_millisec );
        return timeConverter(int_millisec);
    };

    function formatCurrentDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd;
        }

        if (mm < 10) {
            mm = '0' + mm;
        }

        return yyyy + '-' + mm + '-' + dd;
    }

    function timeConverter(UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        if (date.toString().length == 1) {
            date = "0" + date;
        }
        var hour = a.getHours();
        if (hour.toString().length == 1) {
            hour = "0" + hour;
        }
        var min = a.getMinutes();
        if (min.toString().length == 1) {
            min = "0" + min;
        }
        var sec = a.getSeconds();
        if (sec.toString().length == 1) {
            sec = "0" + sec;
        }
        //Dec 08, 2018
        var time = month + ' ' + date + ', ' + year + ' ' + hour + ':' + min;
        return time;
    }

    function timeConverterNoTime(UNIX_timestamp){
        var a = new Date(UNIX_timestamp);
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        if (date.toString().length == 1) {
            date = "0" + date;
        }
        var hour = a.getHours();
        if (hour.toString().length == 1) {
            hour = "0" + hour;
        }
        var min = a.getMinutes();
        if (min.toString().length == 1) {
            min = "0" + min;
        }
        var sec = a.getSeconds();
        if (sec.toString().length == 1) {
            sec = "0" + sec;
        }
        //Dec 08, 2018
        var time = month + ' ' + date + ', ' + year;
        return time;
    }

    async function wait(ms) {
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    }

    function getStyle() {
        var $style = $("<style>");
        $style.html([
            `<style>
            #wmeDohStatusDate { margin-top:10px;margin-bottom:10px; }
            .spinner-disable { opacity: 0; }
            .wmeDohFormInputLabel { display:inline-block;margin-right:10px;}
            .wmeDohFormInput { display:inline-block; width:150px;}
            .wmeDohButtonArea {margin-top:10px;margin-bottom:10px; }
            .wmeDohGoogleBtn { margin-top:10px;margin-bottom:10px; }
            .wmeDohRecreate a { color: #b5b5b5; cursor: pointer; text-decoration:none;}
            .wmeDohRecreate a:hover { text-decoration:underline; }
            .wmeDohResultDetail { position: relative; }
            .wmeDohDetailControls {position: absolute;right: 17px;top: 10px;}
            .wmeDohFlag a { text-decoration: none; }
            .wmeDohFlag { cursor:pointer; opacity:0.2; margin-right:5px;}
            .wmeDohFlag:hover { color:red; opacity:.75}
            .wmeDohFlag.flagged { color: red; opacity:1}
            .wmeDohHistoryContent { padding-left: 14px;padding-right: 14px; }
            .wmeDoh-element-history-item:not(:last-child) { margin-bottom: 5px; }
            .wmeDoh-element-history-item.closed .wmeDoh-tx-header {border-radius: 2px;background: #ededed;}
            .wmeDoh-element-history-item.closed .wmeDoh-tx-header:hover {background: rgba(255, 255, 255, 0.5);}
            .wmeDoh-element-history-item .wmeDoh-tx-header {display: flex;flex-direction: row; justify-content: space-between;padding: 10px;border: 1px solid #e4e4e4;border-radius: 2px 2px 0px 0px;font-size: 11px;color: #687077;line-height: 14px;background: white;transition: all 0.3s;cursor: pointer;}
            .wmeDoh-element-history-item .wmeDoh-tx-content {display: block;padding: 10px;padding-left: 22px; background-color: white;border: 1px solid #e4e4e4;border-top: none; font-size: 11px;}
            .wmeDoh-element-history-item.closed .wmeDoh-tx-content {display: none;}
            .wmeDoh-element-history-item.wmeDoh-tx-has-related .wmeDoh-tx-changed-attribute:last-child {margin-bottom: 10px;}
            .wmeDoh-element-history-item.wmeDoh-tx-has-related .wmeDoh-tx-changed-attribute:last-child { margin-bottom: 10px;}
            .wmeDoh-element-history-item .tx-toggle-closed {width: 30px;height: 30px;text-align: center;}
            .wmeDoh-element-history-item:not(.tx-has-content) .tx-content, .element-history-item:not(.tx-has-content) .tx-toggle-closed {display: none;}
            .wmeDoh-element-history-item .tx-toggle-closed {width: 30px;height: 30px;text-align: center;}
            .wmeDoh-element-history-item.closed .wmeDoh-tx-toggle-closed::after { content: "\\F107";top: 8px;}
            .wmeDoh-element-history-item .wmeDoh-tx-toggle-closed::after {display: inline-block;font: normal normal normal 14px/1 FontAwesome;font-size: inherit;text-rendering: auto;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;color: #3d3d3d;display: block;position: relative;top: 8px;content: "\\F106";font-size: 19px;}
            .historySummaryItem { margin-left:10px; color:#a7a7a7; }
            .historySummaryItem a, .historySummaryItem a:visited { color:#a7a7a7; }
            .wmeDoh-place-delete { filter: saturate(17) hue-rotate(65deg); }
            .wmeDoh-place-delete:hover { filter: brightness(110%) saturate(17) hue-rotate(65deg) !important; }
            .wmeDoh-place-delete:after {
            border-top: 3px solid #ffffff;
            width: 69%;
            height: 49%;
            position: absolute;
            bottom: 6px;
            left: 8px;
            content: "";
            transform: rotate(-45deg);
            }
            #wmeDohSubTabs, .wmeDohFlag { display: none!important; }
            .wmeDohResultTypeVenue { opacity:0.5; margin-left:-3px;margin-right:5px;position:relative;top:3px; + styleElements.resultTypeVenueStyle + }
            .wmeDohResultTypeCamera { opacity:0.5; margin-left:-3px;margin-right:5px;position:relative;top:3px; + styleElements.resultTypeCameraStyle + }
            .wmeDohResultTypeArea { opacity:0.5; margin-left:-3px;margin-right:5px;position:relative;top:10px; + styleElements.resultTypeAreaStyle + }
            // .wmeDohResultTypeResidential { opacity:0.65; margin-left:-3px;margin-right:5px;position:relative;top:4px; + styleElements.resultTypeResidentialNew + }
            // .wmeDohResultTypeParking { opacity:0.65; margin-left:-1px;margin-right:3px;margin-bottom:6px;position:relative;top:4px;filter: saturate(0%); + styleElements.resultTypeParkingNew + }
            .wmeDohResultTypeResidential { filter:invert(.35); margin-left:-11px;margin-right:-1px;position:relative;top:-6px; + styleElements.resultTypeResidentialNew + }
            .wmeDohResultTypeParking { filter:invert(.35); margin-left:-11px;margin-right:-1px;position:relative;top:-6px; + styleElements.resultTypeParkingNew + }
            .wmeDohResultDeletedNewPlace:after { position:relative;content:"+";color:black;font-size:17px;font-weight:900;text-shadow: 0px 0px 2px white;top:7px;left:8px; }
            .wmeDohResultDeletedNewPlaceAlt:after { position:relative;content:"+";color:black;font-size:17px;font-weight:900;top:14px;left:20px; }
            .wmeDohResultDeletedFromRequest:after { position:relative;content:"\\002b06";color:black;font-size:13px;font-weight:900;text-shadow: 0px 0px 3px white;top:7px;left:8px; }
            .wmeDohResultDeletedFromRequestAlt:after { position:relative;content:"\\002b06";color:black;font-size:13px;font-weight:900;top:14px;left:20px;opacity: .8; }


            .wmeDohIconFilter { transform:rotate(90deg);margin-left:-1px;margin-right:3px;margin-bottom:6px;position:relative;top:4px;filter: saturate(0%); + styleElements.iconFilter + }
            //.wmeDohIconFilterInline { font-size:15px;margin-top:5px; }
            .wmeDohIconFilterInline:before { transform:rotate(90deg);filter:saturate(0%);content:"";position:relative;display:inline-block;top:3px;margin-right:10px; + styleElements.iconFilter + }
            .wmeDohScanAttributesDropdown { font-size:15px;margin-top:5px; }
            .wmeDohScanAttributesLabel { margin-left:10px; }
            #wmeDohStatusUsersList > li { margin-bottom:10px }
            .wmeDohStatusUserDates { width:200px; }
            .wmeDohStatusUserLatest { float:left; }
            .wmeDohStatusUserEarliest { float:right; }
            .wmeDohProgress {width:200px;height:5px;border:1px solid gray;border-radius:3px; }
            #wmeDohScanStatusHeader .wmeDohProgress { margin-top: 5px;margin-left: 27px; }
            .wmeDohComplete { width:0%;height:4px;background-color:#5a7990; }
            .wmeDohProgressIcon { transform: scale(1.3,-1) rotate(90deg); }
            .wmeDohDropdownHeader { width: 80%; }
            #wmeDohStatusSummary { margin-bottom:10px; }
            .wmeDohHistorySummaryList > li { margin-bottom:2px; }
            .wmeDohHidden { display:none }
            </style>`
        ].join(' '));
        return $style;
    }

    bootstrap();
})();

