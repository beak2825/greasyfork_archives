// ==UserScript==
// @name       WaniKani Item Lock State Annotator
// @namespace   irrelephant
// @description Show lock/unlock state in the WaniKani search result. Unlike the default behaviour, an item for which no lessons have been done yet will still be displayed as "locked". Inspired by WaniKani Item Annotator by jeshuamorrissey and mempo.
// @author     irrelephant
// @version    1.0.5
// @include https://www.wanikani.com*
// @include https://www.wanikani.com/dashboard*
// @include https://www.wanikani.com/account*
// @include http://www.wanikani.com/radical*
// @include http://www.wanikani.com/kanji*
// @include http://www.wanikani.com/vocabulary*
// @include http://www.wanikani.com/account*
// @include https://www.wanikani.com/radical*
// @include https://www.wanikani.com/kanji*
// @include https://www.wanikani.com/vocabulary*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34773/WaniKani%20Item%20Lock%20State%20Annotator.user.js
// @updateURL https://update.greasyfork.org/scripts/34773/WaniKani%20Item%20Lock%20State%20Annotator.meta.js
// ==/UserScript==

/* #### API ACCESS ####################################################################*/
function retrieveAPIkey() {
    var apiKey = document.getElementById('user_api_key').value;
    alert('API key was set to: ' + apiKey);
    if (apiKey) {
        return apiKey;
    }
}

function apiURL(target) {
    return 'https://www.wanikani.com/api/user/' + apiKey + '/' + target;
}

/* #### API ACCESS ####################################################################*/
function retrieveAPIkey() {
    var apiKey = document.getElementById('user_api_key').value;
    alert('API key was set to: ' + apiKey);
    if (apiKey) {
        return apiKey;
    }
}

function apiURL(target) {
    return 'https://www.wanikani.com/api/user/' + apiKey + '/' + target;
}

var apiKey = $.jStorage.get('WSRA_apiKey');

if (apiKey === null || apiKey==="undefined") { //not initialized yet
    console.log('#### no apiKey found');

    if (window.location.href.indexOf('account') != -1) {
        apiKey = "" + retrieveAPIkey();
        console.log('@@@@@' + apiKey);
        $.jStorage.set('WSRA_apiKey', apiKey);
    } else {
        var okcancel = confirm('WaniKani Search Result Annotator has no API key entered.\nPlease press OK to go to your settings page and retrieve your API key.');
        if (okcancel == true) {
            window.location = 'https://www.wanikani.com/settings/account';
            return;
        }
    }
}

console.log('#### apiKey is: ' + apiKey);

/* #### SEARCH RESULT OBSERVATION #####################################################*/
// observes changes to search result list on demand
var searchResultObserver = new MutationObserver(annotateItemList);

//listen for new searches
$("#query").on('keyup', function (e) {
    if (e.keyCode == 13) {
        //user has pressed enter in the search form: listen for a change in the search result div so that we can update the search result
        try {
            startSearchResultObservation();
        } catch (e) {
            console.log('an error occurred while running startSearchResultObservation');
        }
    }
});

function startSearchResultObservation() {
    searchResultObserver.observe($('.search-results')[0], {
        subtree: true,
        childList: true,
        attributes: false
    });
}

function stopSearchResultObservation() {
    // Stop observing changes
    searchResultObserver.disconnect();

    // Empty the queue of records
    searchResultObserver.takeRecords();
}

/* #### SEARCH RESULT ANNOTATION ######################################################*/
function annotateItemList() {
    console.log('#### search result change was detected, going to run WaniKani Search Result Annotator');

    //we already recognized a change, no need to keep observing the search result for now
    stopSearchResultObservation();

    loadAndAnnotateItems('radicals');
    loadAndAnnotateItems('kanji');
    loadAndAnnotateItems('vocabulary');
}


function loadAndAnnotateItems(target) {
    console.log('@@@ loading data for: ' + target);

    // Load the API data.
    $.get(apiURL(target), function (xhr) {
        // Build up an item mapping from Kanji --> Information
        var itemMapping = {};

        // Get the actual request information. If the target is vocabulary, for some reason
        // we have to got an additional level into 'request_information.general'. This is
        // probably to account for specialised vocab which will be added later.
        var information = xhr.requested_information;
        if (target === 'vocabulary') {
            information = information.general;
        }

        for (var i in information) {
            var item = information[i];

            // Extract the character (Kanji) from the item.
            var character = item.character;

            // If we are looking at radicals, use the meaning instead (convert the meaning to
            // the 'user friendly' format).
            if (target === 'radicals') {
                character = item.meaning.toLowerCase();
            }

            // Get the SRS level from the item. The 'user_specific' object will be `null` if the item
            // hasn't been unlocked yet. In this case, just set the SRS level to `null`.
            var srs = null;
            if (item.user_specific) {
                srs = item.user_specific.srs;
            }

            // Build the mapping for this character.
            itemMapping[character] = {
                'srs': srs
            };
        }

        // Actually do stuff with this mapping.
        annotateItems(itemMapping, target);
    });
}

/**
 * Annotate the elements (show locked/unlocked state and SRS level). Takes as input information from
 * the WK API as a mapping from Japanese Element --> Object. In this case, the
 * object need only contain the SRS level of the element.
 */
function annotateItems(itemMapping, target) {
    var elements = $('.character-item');

    var i = 0;
    for (i = 0; i < elements.size(); i++) {
        var element = elements[i];

        //if the element doesn't match the target type: ignore it
        //use only start of the target string because of "radicals" vs "radical"
        if (element.className.indexOf(target.substr(0, 4))<0) {
            continue;
        }

        // The japanese value to look up in the item mapping is the text of this element.
        var japanese = element.querySelector('.character').textContent;
        if(japanese){
            japanese = japanese.trim();
        }

        // If we happen to be looking at radicals, some of them use pictures instead. It is
        // simpler to use the radical meaning in this case (as there is only one meaning).
        // The meaning is stored in the last list element within the element (for some reason
        // there is a &nbsp; list element first).
        if (target === 'radicals') {
            var radicalLink = element.querySelector('a').getAttribute('href');
            japanese = radicalLink.slice(radicalLink.lastIndexOf('/') + 1);
        }

        var itemInfo = itemMapping[japanese];

        //mark as locked if there is no SRS level yet
        if (typeof itemInfo == "undefined" || typeof itemInfo.srs !== "string") {
            $(element).addClass("locked");
        }
    }
}

//Run once immediately after startup for radical, kanji and vocabulary listings
annotateItemList();