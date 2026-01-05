// ==UserScript==
// @name        WaniKanify
// @namespace   wanikani
// @description Firefox version of chedkid's excellent Chrome app
// @include     *
// @version     1.4.0
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/4719/WaniKanify.user.js
// @updateURL https://update.greasyfork.org/scripts/4719/WaniKanify.meta.js
// ==/UserScript==

// Current format version of the vocab database
var FORMAT_VER = 2;

// Lock to ensure only one download at once
var downloading = false;

/* Main */
window.addEventListener ("load", function () {

    GM_registerMenuCommand("Wanikanify: Run", tryRun);
    GM_registerMenuCommand("Wanikanify: Refresh vocabulary", tryRefreshVocabulary);
    GM_registerMenuCommand("Wanikanify: Enable auto-run", promptAutoRun);
    GM_registerMenuCommand("Wanikanify: Set API key", promptApiKey);

    if (GM_getValue("autoRun") == 1)
        run(false);

}, false);

/**
 * User interface
 */

/* Run script */
function tryRun() {
    var apiKey = getApiKey();
    if (apiKey != undefined)
        run(false);
}

/* Refresh vocabulary */
function tryRefreshVocabulary() {
    var apiKey = getApiKey();
    if (apiKey != undefined)
        downloadVocab();
}

/* Specifiy whether to run automatically */
function promptAutoRun() {
    var autoRun = parseInt(window.prompt("Enter 1 to enable auto-run and 0 to disable", GM_getValue("autoRun") ? 1 : 0));
    GM_setValue("autoRun", autoRun);
}

/* Specify the WaniKani API key */
function promptApiKey() {
    var apiKey;

    while (true) {
        apiKey = GM_getValue("apiKey");
        apiKey = window.prompt("Please enter your API key", apiKey ? apiKey : "");

        if (apiKey && !/^[a-fA-F0-9]{32}$/.test(apiKey))
            alert("That was not a valid API key, please try again");
        else
            break;
    }

    GM_setValue("apiKey", apiKey);
    GM_setValue("mustRefresh", 1);
}

/**
 * Runtime code
 */

function getApiKey() {
    var apiKey = GM_getValue("apiKey");

    if (apiKey == undefined)
        promptApiKey();

    return apiKey;
}

function run(refreshFirst) {
    // Ignore current vocab download
    downloading = false;

    // Get the current timestamp (in minutes)
    var currentTime = Math.floor(new Date().getTime() / 60000);

    // Get the time and the vocab format from when the vocab list was last refreshed
    var refreshTime = GM_getValue("refreshTime");
    var refreshFormat = GM_getValue("formatVer");

    // Hotfix: Allow script to enforce refresh
    var mustRefresh = GM_getValue("mustRefresh") == 1;
    GM_setValue("mustRefresh", 0);

    // See if we should to refresh. If a week has passed, it's probably a good idea anyway
    var shouldRefresh = mustRefresh || refreshFirst || (GM_getValue("vocab", "") == "") || (refreshFormat != FORMAT_VER)
    || (refreshTime == undefined) || (currentTime - refreshTime >= 10080);

    // No refresh needed, simply replace vocab...
    if (!shouldRefresh)
        replaceVocab();
    // Update vocab list if last refresh was too long ago (and replace afterwards), or old version
    else
        downloadVocab(true);
}

function downloadVocab(runAfter, wasManual) {
    if (downloading) {
        console.log("Attempted to download WaniKani data while already downloading");
        return;
    }

    var apiKey = GM_getValue("apiKey");
    if (apiKey == undefined)
        return;

    console.log("Downloading new vocab data...");
    downloading = true;

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.wanikani.com/api/v1.2/user/" + apiKey + "/vocabulary/",
        onerror: function (response) {
            alert("Error while downloading WaniKani data. Please try again later.");
            downloading = false;
        },
        onload: function (response) {
            var json;

            try {
                json = JSON.parse(response.responseText);
            } catch (e) {
                alert("Unable to process WaniKani data. Please try again later.", e);
            }

            if (json) {
                if ("error" in json) {
                    alert("Error from WaniKani: " + json.error.message);
                    downloading = false;
                    return;
                }

                GM_setValue("refreshTime", Math.floor(new Date().getTime() / 60000));

                // Create the vocab map that will be stored
                var vocabMap = {};
                // Loop through all received words
                var vocabList = json.requested_information.general;

                for (var i in vocabList) {
                    var vocab = vocabList[i];

                    // Skip words not yet learned
                    if (!vocab.user_specific)
                        continue;

                    // Split multiple spellings
                    var meanings = vocab.meaning.split(", ");

                    // Conjugate verbs
                    var conjugations = [];
                    for (var m in meanings) {
                        var word = meanings[m];

                        // If a verb...
                        if (/^to /.test(word))
                        {
                            // Remove leading 'to'
                            meanings[m] = word.substr(3);

                            // Remove 'e' suffix for conjugations
                            if (word.slice(-1) == "e")
                                word = word.slice(0, -1);

                            if (!/ /.test(word))
                                conjugations.push(word + "ed", word + "es", word + "en", word + "es", word + "s", word + "ing");
                        }

                        // Not a verb, try plural
                        else if (word.length >= 3 && word.slice(-1) != "s")
                            conjugations.push(word + "s");
                    }
                    meanings.push.apply(meanings, conjugations);

                    // After updating the meanings,
                    for (var m in meanings) {
                        vocabMap[meanings[m]] = vocab.character;
                    }
                }

                String.prototype.hashCode = function() {
                    var hash = 0, i, char;
                    if (this.length == 0) return hash;
                    for (i = 0, l = this.length; i < l; i++) {
                        char  = this.charCodeAt(i);
                        hash  = ((hash<<5)-hash)+char;
                        hash |= 0; // Convert to 32bit integer
                    }
                    return hash;
                };

                // Update the new vocab list in the storage
                vocabJson = JSON.stringify(vocabMap);
                GM_setValue("vocab", vocabJson);
                if(!runAfter) {
                    if (vocabJson.hashCode() != GM_getValue("vocabHash")) {
                        alert("Successfully updated vocab!");
                        GM_setValue("vocabHash", vocabJson.hashCode());
                    }
                    // Only inform the user that the vocab is up to date if he manually requested to update it
                    else {
                        alert("Vocab already up to date");
                    }
                }
                GM_setValue("formatVer", FORMAT_VER);

                // Unlock download lock
                downloading = false;

                // If wanted, immediately run the script
                if (runAfter)
                    replaceVocab(vocabMap);
            }
        }
    });
}

function replaceVocab(vocabMap) {
    // No vocab map given, try to parse from stored JSON
    if (!vocabMap) {
        try {
            vocabMap = JSON.parse(GM_getValue("vocab"), {});
            if (!vocabMap || (vocabMap && jQuery.isEmptyObject(vocabMap)))
                throw 1;
        } catch (e) {
            alert("Error while parsing the vocab list; deleting it now. Please try again.");
            GM_setValue("vocab", "");
            return;
        }
    }

    console.log(vocabMap);
    console.log("Replacing vocab...");

    var replaceCallback = function(str) {
        if (vocabMap.hasOwnProperty(str.toLowerCase())) {
            var translation = vocabMap[str.toLowerCase()];
            return '<span class="wanikanified" title="' + str + '" data-en="' + str + '" data-jp="' + translation +
                '" onClick="var t = this.getAttribute(\'title\'); this.setAttribute(\'title\', this.innerHTML); this.innerHTML = t;">' + translation + '<\/span>';
        }

        // Couldn't replace anything, leave as is
        return str;
    };

    var nodes = $("body *:not(noscript):not(script):not(style)");

    // Very naive attempt at replacing vocab consisting of multiple words first
    nodes.replaceText(/\b(\S+?\s+\S+?\s+\S+?\s+\S+?)\b/g, replaceCallback);
    nodes.replaceText(/\b(\S+?\s+\S+?\s+\S+?)\b/g, replaceCallback);
    nodes.replaceText(/\b(\S+?\s+\S+?)\b/g, replaceCallback);
    nodes.replaceText(/\b(\S+?)\b/g, replaceCallback);

    console.log("Vocab replaced!"); 
}

/*
 * jQuery replaceText - v1.1 - 11/21/2009
 * http://benalman.com/projects/jquery-replacetext-plugin/
 * 
 * Copyright (c) 2009 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($){$.fn.replaceText=function(b,a,c){return this.each(function(){var f=this.firstChild,g,e,d=[];if(f){do{if(f.nodeType===3){g=f.nodeValue;e=g.replace(b,a);if(e!==g){if(!c&&/</.test(e)){$(f).before(e);d.push(f)}else{f.nodeValue=e}}}}while(f=f.nextSibling)}d.length&&$(d).remove()})}})(jQuery);
