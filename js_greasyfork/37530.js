// ==UserScript==
// @name         Cook Every Fish
// @description  Rakky's Talibri Enhancer
// @namespace    https://talibri.com/
// @version      0.5.1
// @author       Rakky
// @match        http*://talibri.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37530/Cook%20Every%20Fish.user.js
// @updateURL https://update.greasyfork.org/scripts/37530/Cook%20Every%20Fish.meta.js
// ==/UserScript==

// This is my first ever script!
// Based on Pendoria+ and PendoriaQoL scripts.
// They helped me a lot.

// Changelog for 0.5.1
// -Bugfix: Now parses correctly when you gather extra items due to equipment bonuses.

// Changelog for 0.5.0
// -Changed the way I name my versions. This is now v0.5.0 instead of v0.0.5.
// -Added data tracking for Gathering. (Crafting data is coming soon.)
// -Now parses the gathering popup for all the information. (Crafting will get this soon too!)
// -Fixed some bad logic in my progress bar code.
// -Limited how often the data updates so it's not so hard on the cpu. holy cow.

$(function() {
    // Change these const variables to suit your needs. #'s = number of actions
    // In the future I'll make a proper UI for this.
    const LOW_ACTIONS = 100;
    const VERY_LOW_ACTIONS = 15;
    const LOW_ACTIONS_AUDIO_WARNING = 15;
    const LOW_ACTIONS_SOUND = new Audio("https://soundbible.com/grab.php?id=1424&type=mp3");

    function incrementActions(){
        let actions = localStorage.getItem("rakkyAction");
        actions++;
        localStorage.setItem("rakkyAction", actions);
    }
    function updateActionsCounter(){
        $('td[class="row-1 column-1"]').text("Actions: " + localStorage.getItem("rakkyAction"));
    }
    function resetActions(){
        localStorage.setItem("rakkyAction", 0);
        let data = {
            "actions": {
                "total" : 0,
                "successful": 0
            },
            "material": undefined,
            "quantity": {
                "inventory": 0,
                "total": 0,
                "last": 0
            },
            "mastery": {
                "current": 0,
                "toNext": 0
            },
            "experience": {
                "total": 0,
                "last": 0
            }
        };
        localStorage.setItem("gatheringData", JSON.stringify(data));
        updateActionsCounter();
    }

    function parseMatsQuantity(){
        let mats = [];
        let elements = $('div[class~=ingredients]:not([style*="display: none"]) .input-group button span');
        elements.each( function(index, obj){
            mats.push($(this).text());
        });
        return mats;
    }
    function updateMatsQuantity(mats){
        localStorage.setItem("rakkyMats", mats.toString());
    }
    function getMatsQuantity(){
        let mats = localStorage.getItem("rakkyMats").split(",");
        return mats;
    }

    function updateMatsUsedPerAction(mats){
        localStorage.setItem("rakkyMatsUsedPerAction", mats.toString());
    }
    function getMatsUsedPerAction(){
        let mats = localStorage.getItem("rakkyMatsUsedPerAction").split(",");
        return mats;
    }

    let newHtml = '';
    function formatMatsHtml(mats){
        newHtml = "";
        let matsUsedPerAction = getMatsUsedPerAction();
        for(let i=0; i<mats.length; i++){
            let remainingActions = Math.floor(mats[i]/matsUsedPerAction[i]);
            newHtml = newHtml + '<span style="color: ';
            if(remainingActions < LOW_ACTIONS && remainingActions > VERY_LOW_ACTIONS){
                newHtml = newHtml + 'orange">';
            }else if(remainingActions <= VERY_LOW_ACTIONS){
                newHtml = newHtml + 'red">';
            }else{
                newHtml = newHtml + 'green">';
            }
            if(mats[i] === 0){remainingActions = 0;}
            newHtml = newHtml + mats[i] + " (" + remainingActions + ")" + "</span>";

            if(i < mats.length - 1){
                newHtml = newHtml + " / ";
            }
        }
    }

    // If user doesn't have craft page open, then we just have to estimate it but subtracting
    // mat costs from the last seen mat numbers.
    // May not be accurate if market orders have gone through.
    function subtractMatsUsedInAction(){
        let mats = getMatsQuantity();
        let matsUsedPerAction = getMatsUsedPerAction();
        for(let i = 0; i < mats.length; i++){
            mats[i] -= matsUsedPerAction[i];
        }
        updateMatsQuantity(mats);
    }

    function getActionsRemaining(){
        let mats = getMatsQuantity();
        let matsUsedPerAction = getMatsUsedPerAction();
        let actionsRemaining = Number.MAX_VALUE;
        for(let i = 0; i < mats.length; i++){
            let remaining = mats[i] / matsUsedPerAction[i];
            if ( remaining < actionsRemaining){
                actionsRemaining = remaining;
            }
        }
        return Math.floor(actionsRemaining);
    }
    function pingIfLow(){
        let mats = localStorage.getItem("rakkyMats").split(",");
        let actionsRemaining = getActionsRemaining();

        if(actionsRemaining < LOW_ACTIONS_AUDIO_WARNING){
            LOW_ACTIONS_SOUND.play();
        }
    }

    // Create the html for displaying the actions, mats, etc.
    // Still need to work on Crafting.
    function createDisplay(){
        let html = "";
        html += '<div id="user-stat-actions" style="flex-wrap: wrap; position: relative; display: flex; width: 100%; height: 65px;">';
        html += '<div id="progressBarContainer" style="width: 50%; position: absolute; background-color: lightgray; display: flex; height: 33%;">';
        html += '<div id="progressBar" style="background-color: lightgreen; flex-direction: column; width: 0%;"></div></div>';
        html += '<div style="padding-left: 5px; padding-top: 2px; flex-shrink: 0; position: relative; width: 100%; height: 33%;">';
        html += '<table style="table-layout: fixed; width: 100%";>';
        html += '<tr><td class="row-1 column-1" style="width: 25%"></td><td class="row-1 column-2" style=""></td><td class="row-1 column-3" style="width: 25%"></td><td class="row-1 column-4" style="width: 25%"></td></tr>';
        html += '<tr><td class="row-2 column-1" colspan="2" style="width: 25%"></td><td class="row-2 column-2" style=""></td><td class="row-2 column-3" style="width: 25%"></td></tr>';
        html += '<tr><td class="row-3 column-1" style=width: 25%""></td><td class="row-3 column-2" style=""></td><td class="row-3 column-3" style="width: 25%"></td><td class="row-3 column-4" style="width: 25%"></td></tr>';
        html += '</table>';
        html += '</div></div>';
        $('.user-stat-line').append(html);
    }
    function updateMatsCounter(){
        formatMatsHtml(getMatsQuantity());
        $('td[class="row-2 column-1"]').html(newHtml);
        $('td[class="row-1 column-2"]').html("");
        $('td[class="row-1 column-3"]').html("");
        $('td[class="row-1 column-4"]').html("");
        $('td[class="row-2 column-2"]').html("");
        $('td[class="row-2 column-3"]').html("");
        $('td[class="row-3 column-1"]').html("");
        $('td[class="row-3 column-2"]').html("");
        $('td[class="row-3 column-3"]').html("");
        $('td[class="row-3 column-4"]').html("");
    }

    // These are old functions I copy pasted from an old spreadsheet I made. I'll fix them up later.
    function convertTo24_60_60_format(oldFormat){
        var time = [0,0,0,0];
        time[3] = oldFormat[3] % 60;
        oldFormat[2] += Math.floor(oldFormat[3]/60);
        time[2] = oldFormat[2] % 60;
        oldFormat[1] += Math.floor(oldFormat[2]/60);
        time[1] = oldFormat[1] % 24;
        oldFormat[0] += Math.floor(oldFormat[1]/24);
        time[0] = oldFormat[0];

        return time;
    }
    function toTimeString(time){
        var timeString = "";
        var units = ["d", "h", "m", "s"];
        for(var i = 0; i < 4; i++){
            if(time[i] !== 0){
                timeString = timeString + time[i] + units[i] + " ";
            }
        }

        return timeString;
    }
    function convertToDuration(days, hours, minutes, seconds){
        var time = [];
        time[0] = Math.floor(days);
        hours += (days - time[0])*24;
        time[1] = Math.floor(hours);
        minutes += (hours - time[1])*60;
        time[2] = Math.floor(minutes);
        seconds += (minutes - time[2])*60;
        time[3] = Math.floor(seconds);

        time = convertTo24_60_60_format(time);
        return toTimeString(time);
    }

    function updateGatheringCounter(){
        let data = getGatheringData();

        $('td[class="row-1 column-1"]').html("<strong>Actions: </strong>" + data.actions.total);
        let successChance = 0;
        if(data.actions.total > 0){ successChance = data.actions.successful/data.actions.total*100; }
        $('td[class="row-1 column-2"]').html("<strong>Successful: </strong>" + data.actions.successful + " (" + successChance.toLocaleString(undefined, {maximumSignificantDigits: 4}) + "%)");
        let material = data.material;
        if(!material){ material = "Nothing"; }
        $('td[class="row-2 column-1"]').html("<strong>Harvesting: </strong>" + material);
        $('td[class="row-3 column-1"]').html("<strong>In Inventory: </strong>" + data.quantity.inventory.toLocaleString() + " (+" + data.quantity.last.toLocaleString() + ")");
        let average = 0;
        if(data.actions.total > 0){ average = data.quantity.total/data.actions.total; }
        $('td[class="row-3 column-2"]').html("<strong>Average: </strong>" + average.toLocaleString(undefined, {maximumSignificantDigits: 4}));
        $('td[class="row-1 column-3"]').html("<strong>Mastery: </strong>" + data.mastery.current.toLocaleString() + " / " + data.mastery.toNext.toLocaleString());
        let actionsToNextMastery = data.mastery.toNext - data.mastery.current;
        let timeToNextMastery = "Forever";
        if(successChance > 0){
            timeToNextMastery = convertToDuration(0,0,0,actionsToNextMastery * 5 / (successChance/100));
        }
        $('td[class="row-1 column-4"]').html("<strong>To Next: </strong>" + timeToNextMastery);
        $('td[class="row-2 column-2"]').html("<strong>Exp: </strong>" + data.experience.total.toLocaleString() + " (+" + data.experience.last.toLocaleString() + ")");
        let avgExp = 0;
        if(data.actions.total > 0){ avgExp = data.experience.total/data.actions.total; }
        $('td[class="row-2 column-3"]').html("<strong>Average: </strong>" + avgExp.toLocaleString(undefined, {maximumSignificantDigits: 4}));
    }

    let inProgress = false;
    function updateProgressBar(){
        let timestamp = Date.now();
        let start = parseInt(localStorage.getItem('rakkyStartTime'));
        let progress = timestamp - start;
        $('#progressBar')[0].style.width = progress / 5000 * 100 + '%';
        if(progress < 5000){
            setTimeout(function(){ window.requestAnimationFrame(updateProgressBar); }, 1000/30); // updates at 30 fps
        }else{
            $('#progressBar')[0].style.width = '0%';
            inProgress = false;
        }
    }
    function updateDisplay(){
        let start = parseInt(localStorage.getItem('rakkyStartTime'));
        if(!inProgress && (Date.now() - start) < 5000){
            window.requestAnimationFrame(updateProgressBar);
        }
        if(localStorage.getItem("actionType") == "Gathering"){
            updateGatheringCounter();
        }else{
            updateActionsCounter();
            updateMatsCounter();
        }
        setTimeout(function(){ window.requestAnimationFrame(updateDisplay); }, 1000/5); // updates at 5 fps
    }
    function parseMatCosts(divIngredients){
        let numberOfIngredients = divIngredients.children('div.input-group').length;

        let matCosts = [];
        divIngredients.children('div.input-group').each( function(index, obj){
            // note: $(this) is referring to a different object than the one above while in this scope.
            let spanText = $(this).text().split(" ");
            matCosts.push(parseInt(spanText[0]));
        });
        return matCosts;
    }

    function removeNavBarIcons(){
        $('.user-stat-line').children().remove();
    }

    function startProgressBar(){
        localStorage.setItem("rakkyStartTime", Date.now());
        window.requestAnimationFrame(updateProgressBar);
    }

    // Parsing the Gathering popup
    function getGatheringData(){
        let data = localStorage.getItem("gatheringData");
        if(data){
            data = JSON.parse(data);
            data.actions.total = parseInt(data.actions.total);
            data.actions.successful = parseInt(data.actions.successful);
            data.quantity.total = parseInt(data.quantity.total);
            data.quantity.last = parseInt(data.quantity.last);
            data.mastery.current = parseInt(data.mastery.current);
            data.mastery.toNext = parseInt(data.mastery.toNext);
            data.experience.total = parseInt(data.experience.total);
            data.experience.last = parseInt(data.experience.last);
        }else{
            data = undefined;
        }
        return data;
    }
    function parseForMaterialName(text){
        let spanStart = text.indexOf('<span', text.indexOf('successfully gathered'));
        let spanEnd = text.indexOf('>', spanStart);
        let endSpanStart = text.indexOf('<', spanEnd);
        let materialType = text.substring(spanEnd + 1, endSpanStart);
        return materialType;
    }
    function parseForMaterialNameOnFailure(text){
        let searchTerm = 'You failed to gather ';
        let searchTermIndex = text.indexOf(searchTerm);

        if(searchTermIndex < 0){ return undefined; }else{
            let start = searchTermIndex + searchTerm.length;
            let end = text.indexOf('.', start);
            let amount = text.substring(start, end);
            return amount;
        }
    }
    function parseForQuantityGathered(text){
        let searchTerm = 'successfully gathered ';
        let searchTermIndex = text.indexOf(searchTerm);

        if(searchTermIndex < 0){ return undefined; }else{
            let start = searchTermIndex + searchTerm.length;
            let end = text.indexOf(' <', start);
            let amount = text.substring(start, end);
            return amount;
        }
    }
    function parseForQuantityTotal(text){
        let searchTerm = 'You now have ';
        let searchTermIndex = text.indexOf(searchTerm);

        if(searchTermIndex < 0){ return undefined; }else{
            let start = searchTermIndex + searchTerm.length;
            let end = text.indexOf('.', start);
            let amount = text.substring(start, end);
            return amount;
        }
    }
    function parseForMastery(text){
        let searchTerm = 'Mastery Progress: ';
        let searchTermIndex = text.indexOf(searchTerm);

        if(searchTermIndex < 0){ return undefined; }else{
            let start = searchTermIndex + searchTerm.length;
            let end = text.indexOf('\\n', start);
            let masteryText = text.substring(start, end);
            let mastery = masteryText.split('/');
            return mastery;
        }
    }
    function parseForExperience(text){
        let searchTerm = 'You gained ';
        let searchTermIndex = text.indexOf(searchTerm, text.indexOf('successfully gathered'));

        if(searchTermIndex < 0){ return undefined; }else{
            let start = searchTermIndex + searchTerm.length;
            let end = text.indexOf(' experience!', start);
            let amountText = text.substring(start, end);
            let amountArray = amountText.split(',');
            amountText = '';
            for(let i = 0; i < amountArray.length; i++){
                amountText = amountText + amountArray[i];
            }
            let amount = amountText;
            return amount;
        }
    }
    function parseGatheringPopup(responseText){
        let data = {
            "isSuccessful": undefined,
            "mastery": {
                "current": undefined,
                "toNext": undefined
            },
            "experience": undefined,
            "material": undefined,
            "quantity": {
                "total": undefined,
                "last": undefined
            }
        };

        let text = responseText;

        let mastery = parseForMastery(text);
        if(mastery){
            data.mastery.current = parseInt(mastery[0]);
            data.mastery.toNext = parseInt(mastery[1]);
        }

        let experience= parseForExperience(text);
        if(experience){ data.experience = parseInt(experience); }

        if(text.indexOf("failed") > 0){
            data.isSuccessful = false;

            let material = parseForMaterialNameOnFailure(text);
            if(material){ data.material = material; }
        }else{
            data.isSuccessful = true;

            let material = parseForMaterialName(text);
            if(material){ data.material = material; }

            let total = parseForQuantityTotal(text);
            if(total){ data.quantity.total = parseInt(total); }

            let last = parseForQuantityGathered(text);
            if(last){ data.quantity.last = parseInt(last); }
        }
        return data;
    }
    function updateGatheringData(popup){
        /* popup = {
            "isSuccessful" : undefined,
            "mastery": {
                "current": undefined,
                "toNext": undefined
            },
            "experience": undefined,
            "material": undefined,
            "quantity": {
                "total": undefined,
                "last": undefined
            }
            };*/
        /* data = {
            "actions": {
                "total" : 0,
                "successful": 0
            },
            "material": undefined,
            "quantity": {
                "inventory": 0,
                "total": 0,
                "last": 0
            },
            "mastery": {
                "current": 0,
                "toNext": 0
            },
            "experience": {
                "total": 0,
                "last": 0
            }; */
        let data = getGatheringData();

        data.actions.total++;
        if(popup.isSuccessful){
            data.actions.successful++;
            data.quantity.inventory = popup.quantity.total;
            data.quantity.total = data.quantity.total + popup.quantity.last;
            data.quantity.last = popup.quantity.last;
        }
        data.material = popup.material;
        data.mastery.current = popup.mastery.current;
        data.mastery.toNext = popup.mastery.toNext;
        data.experience.total = data.experience.total + popup.experience;
        data.experience.last = popup.experience;

        localStorage.setItem("gatheringData", JSON.stringify(data));
    }

    function init(){
        let actions = localStorage.getItem("rakkyAction");
        let activeMats = localStorage.getItem("rakkyMats");
        let matsUsedPerAction = localStorage.getItem("rakkyMatsUsedPerAction");
        let startTime = localStorage.getItem("rakkyStartTime");
        let gatheringData = localStorage.getItem("gatheringData");
        let actionType = localStorage.getItem("actionType");

        if(!actions){ localStorage.setItem("rakkyAction", 0); }
        if(!activeMats){ localStorage.setItem("rakkyMats", 0); }
        if(!matsUsedPerAction){ localStorage.setItem("rakkyMatsUsedPerAction", 1); }
        if(!startTime){ localStorage.setItem("rakkyStartTime", 0); }
        if(!gatheringData){
            let data = {
                "actions": {
                    "total" : 0,
                    "successful": 0
                },
                "material": undefined,
                "quantity": {
                    "inventory": 0,
                    "total": 0,
                    "last": 0
                },
                "mastery": {
                    "current": 0,
                    "toNext": 0
                },
                "experience": {
                    "total": 0,
                    "last": 0
                }
            };
            localStorage.setItem("gatheringData", JSON.stringify(data));
        }

        removeNavBarIcons();
        if($('#user-stat-actions').length === 0){
            createDisplay();
            updateDisplay();
        }

        let selector = 'div[class~=recipe-requirements]';
        $(selector).on("click", 'ul.dropdown-menu', function(){
            let divIngredients = $(this).closest('div[class~=ingredients]');

            localStorage.setItem("actionType", "Crafting");
            updateMatsUsedPerAction(parseMatCosts(divIngredients));
            updateMatsQuantity(parseMatsQuantity());
            updateMatsCounter();
        });

        // When user clicks the actions display
        $(document).on("click", '#user-stat-actions', resetActions);
    }

    function ajaxCraft(){
        localStorage.setItem("actionType", "Crafting");
        startProgressBar();
        incrementActions();
        updateActionsCounter();

        // Estimate mat quantity if not on craft page. Otherwise, use the craft page's mat numbers.
        if($('div[class~=ingredients]:not([style*="display: none"]) .input-group button span').length === 0){
            subtractMatsUsedInAction();
        } else {
            updateMatsQuantity(parseMatsQuantity());
        }
        updateMatsCounter();

        pingIfLow();
    }
    function ajaxGather(e, xhr, settings){
        if(xhr.responseText.indexOf("tooltip") > 0){
            localStorage.setItem("actionType", "Gathering");

            let popup = parseGatheringPopup(xhr.responseText);
            let data = getGatheringData();
            if (popup.material != data.material){
                data = {
                    "actions": {
                        "total" : 0,
                        "successful": 0
                    },
                    "material": undefined,
                    "quantity": {
                        "inventory": 0,
                        "total": 0,
                        "last": 0
                    },
                    "mastery": {
                        "current": 0,
                        "toNext": 0
                    },
                    "experience": {
                        "total": 0,
                        "last": 0
                    }
                };
                localStorage.setItem("gatheringData", JSON.stringify(data));
            }
            startProgressBar();
            updateGatheringData(popup);
        }
    }

    const AJAX_CALLBACKS = {
        '/craft': ajaxCraft,
        '/skills/1/start_gathering.js': ajaxGather, // Mining
        '/skills/2/start_gathering.js': ajaxGather, // Woodcutting
        '/skills/3/start_gathering.js': ajaxGather, // Fishing
        '/skills/4/start_gathering.js': ajaxGather, // Botany
    };

    // ****-Script Begin-****

    // Detecting when a new page is loaded and initializing my UI elements.
    // It's a little bit wonky because apparently Talibri uses
    // something called turbolinks which doesn't work like normal page loads.
    $(document).ready(function(){
        $(window).trigger("load");
    });
    $(window).on("load turbolinks:load", function(){
        init();
        console.log("Cook Every Fish loaded!");
    });

    $(document).ajaxError(function(){
        console.log("Error!");
    });

    // When an action is performed.
    $(document).ajaxComplete(function(e, xhr, settings){
        // Figure out which action is being done, to run the appropriate method.
        if (!settings.url || !(settings.url in AJAX_CALLBACKS)) {
            return;
        }
        AJAX_CALLBACKS[settings.url](e, xhr, settings);
    });

    // Update the display
    window.requestAnimationFrame(updateDisplay);
});

















