// ==UserScript==
// @name         Retal Watcher
// @namespace    retalWatcher
// @version      0.1.1
// @description  Puts a notifier at the top of the page for available war retals
// @include      *.torn.com/factions.php?step=your
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/26830/Retal%20Watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/26830/Retal%20Watcher.meta.js
// ==/UserScript==
/* jshint -W097 */


(function() {
    'use strict';

    try {
        var factionName = 'Relentless';
        var factionId = 8336;
        var apiKey = GM_getValue("apiKey", "");

        
        /*
         * Creates a banner to ask the player for their API so it can be stored locally.
         */
        var createApiBanner = function() {
            var inputField = "<input id=\"input-api\" type=\"text\" name=\"api\" style=\"border: 3px solid #555; background-color: #f1f1f1;\">";
            // Alert user
            var notifyMessage = "";
            if (GM_getValue("scriptName", "").length > 0) {
                notifyMessage = "Your API key is required for the " + GM_getValue("scriptName", "") + " script&nbsp;&nbsp;";
            } else {
                notifyMessage = "A userScript requires your API key:&nbsp;&nbsp;";
            }
            $(".green").children('div:contains(' + notifyMessage + ')').remove();
            AddNotificationInPage(notifyMessage + inputField);

            var testAPI = "";
            $("#input-api").on("change", function() {
                testAPI = $(this).val();
                GM_setValue("apiKey", testAPI);
                AddNotificationInPage("Your API Key has been set; please refresh the page.");
            });
        };
        
        
        class RetalOpportunity {
            constructor(playerName, playerId, attackEndedTimestamp) {
                this.playerName = playerName;
                this.playerId = playerId;
                this.attackEndedTimestamp = attackEndedTimestamp;
            }
            
            IsSamePlayer(playerId) {
                return this.playerId == playerId;
            }
        }
        

        var AddNotificationInPage = function(notificationHtml) {
            $('div.content-wrapper').prepend('<div class="m-top10" id="display-request-state"><div class="info-msg-cont green border-round"><div class="info-msg border-round">' +
                                             '<i class="info-icon"></i><div class="delimiter"><div class="msg right-round"><div class="change-logger">' +
                                             '<p>' + notificationHtml + '</p>' +
                                             '</div></div></div></div></div><hr class="delimiter-999 m-top10 m-bottom10"></div>');
        };
        
        
        var DisplayRetalOpportunity = function(retalOpportunity) {
            // Retal opportunity ends ten minutes after the attack ends.
            var retalExpirationTimeSeconds = retalOpportunity.attackEndedTimestamp + (10 * 60);
            var retalExpirationDate = new Date(retalExpirationTimeSeconds * 1000);
            var currentTimeSeconds = new Date().getTime() / 1000;
            var remainingTimeSeconds = Math.floor(retalExpirationTimeSeconds - currentTimeSeconds);
            
            if (remainingTimeSeconds < 0) {
                // It is possible we got here if things took long enough.
                return;
            }
            
            var remainingTimeString = ' in ';
            if (remainingTimeSeconds > 60) {
                var remainingTimeMinutes = Math.floor(remainingTimeSeconds / 60);
                remainingTimeString += remainingTimeMinutes + ' minute';
                if (remainingTimeMinutes > 1) {
                    remainingTimeString += 's';
                }
            } else {
                remainingTimeString += remainingTimeSeconds + ' second';
                if (remainingTimeSeconds > 1) {
                    remainingTimeString += 's';
                }
            }
            
            var playerUrl = "profiles.php?XID=" + retalOpportunity.playerId;
//            var playerUrl = "loader2.php?sid=getInAttack&user2ID=" + retalOpportunity.playerId;
            
            var retalMessageHtml = '<a href="' + playerUrl + '" target="_blank">Retal on ' + retalOpportunity.playerName + '</a>' +
                ' (expires' + remainingTimeString + ' at ' + retalExpirationDate.toTimeString().split(' ')[0] + ')';
            
            AddNotificationInPage(retalMessageHtml);
        };


        var FindRetalOpportunities = function(factionName, factionId, apiKey) {
            var apiUrl = 'https://api.torn.com/faction/' + factionId + '?selections=attacks&key=' + apiKey;
            console.debug('Getting faction attacks from: ' + apiUrl);
            $.ajax({
                type: 'GET',
                url: apiUrl,
                crossDomain: true,
            }).done(function(response) {
                try {
                    var retalOpportunities = Array();
                    
                    var currentTimeSeconds = new Date().getTime() / 1000;
                    var tenMinutesAgo = currentTimeSeconds - (10 * 60);
                    var keys = Object.keys(response.attacks);
                    for (var i = keys.length - 1; i >= 0; --i) {
                        // Attacks come in oldest-to-newest; do in reverse for simplicity.
                        var thisAttack = response.attacks[keys[i]];
                        if (thisAttack.timestamp_ended < tenMinutesAgo) {
                            // TODO: Display (and cache) retal opportunities.
                            return;
                        }
                        if (thisAttack.attacker_factionname != factionName && thisAttack.result == "Hospitalize" && thisAttack.attacker_faction !== "") {
                            console.log(thisAttack);
                            var found = false;
                            for (var j = 0; j < retalOpportunities.length && !found; ++j) {
                                if (retalOpportunities[j].IsSamePlayer(thisAttack.attacker_id)) {
                                    found = true;
                                }
                            }
                            if (!found) {
                                console.log('Retal against ' + thisAttack.attacker_name + '!');
                                var retal = new RetalOpportunity(thisAttack.attacker_name, thisAttack.attacker_id, thisAttack.timestamp_ended);
                                retalOpportunities.push(retal);
                                DisplayRetalOpportunity(retal);
                            }
                        }
                    }
                } catch (error) {
                    console.log(error);
                }
            });
        };

        
        // TODO: Display cached retals if this was done in the last 5s instead of calling the API.
//        var retal = new RetalOpportunity('Some Douchebag', 1791283, 1485292430);
//        DisplayRetalOpportunity(retal);
        
        // If not cached, get current data instead.
        FindRetalOpportunities(factionName, factionId, apiKey);
        
        if (apiKey === "") {
            createApiBanner();
            // Player has to refresh the page to try again.
            return;
        }
    } catch (error) {
        console.error(error);
    }

})();