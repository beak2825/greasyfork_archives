// ==UserScript==
// @name         Path of Exile (PoE) - Find More Active Traders via Language
// @namespace    https://github.com/anonusername/TamperGreaseMonkeyScripts
// @version      1.4.3
// @description  Get better results from PoE trade by color coding non-English speakers in GREEN who will most likely be available to trade. English speakers will be in RED
// @author       EVIL Gibson (@EVILGibsonSA)
// @match        https://www.pathofexile.com/trade/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/anonusername/TamperGreaseMonkeyScripts/issues
// @downloadURL https://update.greasyfork.org/scripts/494601/Path%20of%20Exile%20%28PoE%29%20-%20Find%20More%20Active%20Traders%20via%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/494601/Path%20of%20Exile%20%28PoE%29%20-%20Find%20More%20Active%20Traders%20via%20Language.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const logging = false;
    const EnglishColor = "darkred";
    const NonEnglishColor = "darkgreen";

    function log(message) {
        if(logging){
        console.log(message);
        }
    }
// Function to process the response data from the correct XHR requests to
// change the CSS background color of the names according to their language
  
    function processListedResponse(responseData) {
        //Figure out and change the color names in Listed for the leftmost view (see screenshot)
        $(".row .profile-link").each(function () {
            // Get the ID of the row
            var rowID = $(this).closest(".row").data("id");

            // Create a Map to store id and color
            var ColorID = new Map();

            // Iterate through each item in the "result" array
            responseData.result.forEach(function (item) {
                // Check if the item has the "listing" property and "whisper" within it.
                if (item.listing && item.listing.whisper) {
                    // Regular expression to check to see if the whisper text contains English
                    var pattern = /listed for/i;
                    if (pattern.test(item.listing.whisper)) {
                        ColorID.set(item.id, EnglishColor);
                    } else {
                        ColorID.set(item.id, NonEnglishColor);
                    }
                }
            });

            // Check if the rowID exists in the ColorID map
            if (ColorID.has(rowID)) {
                // Get the color corresponding to the rowID from the ColorID map
                var color = ColorID.get(rowID);

                // Set the background color of the profile link class which contains the name
                $(this).css("background-color", color);
            }
        });
				
      
        //For the other views in Listed trade that uses the class "character-name" instead (compact and two colum views)
        $(".row .character-name").each(function () {
            // Get the ID of the row
            var rowID = $(this).closest(".row").data("id");

            // Create a Map to store id and color
            var ColorID = new Map();

            // Iterate through each item in the "result" array
            responseData.result.forEach(function (item) {
                // Check if the item has the "listing" property and "whisper" within it.
                if (item.listing && item.listing.whisper) {
                    // Regular expression to check to see if the whisper text contains English
                    var pattern = /listed for/i;
                    if (pattern.test(item.listing.whisper)) {
                        ColorID.set(item.id, EnglishColor);
                    } else {
                        ColorID.set(item.id, NonEnglishColor);
                    }
                }
            });

            // Check if the rowID exists in the ColorID map
            if (ColorID.has(rowID)) {
                // Get the color corresponding to the rowID from the ColorID map
                var langColor = ColorID.get(rowID);

                // Set the background color of the character name class which contains the name
                $(this).css({"background-color": langColor, "font-weight": "bold", "color": "brightyellow"});

            }
        });      
      
    }
//PoE "Search Listed Items" TRADE SECTION
// We can use the response to find out who and who doesn't speak English.
// In other words, find players who actually might actually trade with you (!!!)

// PoE trade does not populate the "Direct Whisper" button with the whisper text
// until you push it.

    function handleFetchRequests() {
        log("Handling fetch requests...");
        var currentUniqueID = null;

        var observer = new PerformanceObserver(function(list) {
            list.getEntries().forEach(function(entry) {
                if (entry.name.includes('/api/trade/fetch/')) {
                    var url = entry.name;
                    var uniqueID = url.split('/').pop().split('?')[0];
                    if (uniqueID !== currentUniqueID) {
                        currentUniqueID = uniqueID;
                        log('Network request:', url);
                        log('UniqueID:', uniqueID);
                        fetch(url, { headers: { 'Content-Type': 'application/json' } })
                            .then(response => response.json())
                            .then(json => {
                                if (json && json.result && Array.isArray(json.result)) {
                                    processListedResponse(json);
                                } else {
                                    log('Invalid response data:', json);
                                }
                            })
                            .catch(error => {
                                log('Error fetching response:', error);
                            });
                    } else {
                        log('Skipping duplicate fetch request with the same unique ID:', uniqueID);
                    }
                }
            });
        });

        observer.observe({ entryTypes: ['resource'] });
    }

//PoE "Bulk Item Exchange" SECTION
//Note, you cannot just go by flag icon.  There are non-English speakers
// in countries that mainly speak English. Holy ****!
// <img>Eric_Wareheim_mind_explosion.gif</img>  
  
    function observeDOM() {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    handleXHR();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

// Find flag containers and set background color based on the presence of 'en' class.
// If so, color English speakers with darkred and non-English speakers with darkgreen
  
    function handleXHR() {
        $(".flag").each(function () {
            if ($(this).hasClass("en")) {
                $(this).closest(".profile-link").css("background-color", EnglishColor);
            } else {
                $(this).closest(".profile-link").css("background-color", NonEnglishColor);
            }
        });
    }

    // Call the function to start handling fetch requests for Listed Items trade
    handleFetchRequests();

    // Call the function to observe DOM changes for Bulk Trade exchange
    observeDOM();
})(jQuery);
