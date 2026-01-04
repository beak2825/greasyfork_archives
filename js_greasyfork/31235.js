// ==UserScript==
// @name         Warbase (Leader)
// @namespace    Warbase
// @version      0.1.5
// @description  Provides leadership warbase functions
// @include      *.torn.com/factions.php?step=your*
// @include      *.torn.com/factions.php?step=profile&ID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31235/Warbase%20%28Leader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/31235/Warbase%20%28Leader%29.meta.js
// ==/UserScript==

// TODO: Get existing bonus status

(function() {
    'use strict';
    
    // Adds an error notification at the top of a page.
    // @param errorString string the notification text (or HTML) to put at the top of the page
    var AddErrorNotification = function(errorString) {
        $('div.content-wrapper')
            .prepend($('<div class="m-top10" id="display-request-state">')
                     .append($('<div class="info-msg-cont red border-round">')
                             .append($('<div class="info-msg border-round">')
                                     .append($('<i class="info-icon"></i>'))
                                     .append($('<div class="delimiter">')
                                             .append($('<div class="msg right-round">')
                                                     .append($('<div class="change-logger">')
                                                             .append($('<p>' + errorString + '</p>')))))))
                     .append($('<hr class="delimiter-999 m-top10 m-bottom10">')));
    };
    

    try {
        var kServerWarbaseUrl = 'https://lt.relentless.pw/data/war.php';
        
        
        // Adds an info notification at the top of a page if it isn't already there or updates the message if it is.
        // @param infoString string the notification text (or HTML) to put at the top of the page
        var AddOrUpdateInfoNotification = function(infoString) {
            var infoMessage = $('#warbaseinfomessage');
            if (infoMessage.length === 0) {
                infoMessage = $('<p id="warbaseinfomessage">');
                $('div.content-wrapper')
                    .prepend($('<div class="m-top10">')
                             .append($('<div class="info-msg-cont green border-round">')
                                     .append($('<div class="info-msg border-round">')
                                             .append($('<i class="info-icon"></i>'))
                                             .append($('<div class="delimiter">')
                                                     .append($('<div class="msg right-round">')
                                                             .append($('<div class="change-logger">')
                                                                     .append(infoMessage))))))
                             .append($('<hr class="delimiter-999 m-top10 m-bottom10">')));
            }
            
            infoMessage.html(infoString);
        };

        // Sends a leadership contorl request to the server.
        // @param data Object the request to send to the server, generally including factionId and one or more other options
        // @param factionIdList Array the list of faction ids in the warbase, if known
        // @param callback function if provided, a function to be called after the request has been sent to the server and a response has been received;
        //   takes the response as its only parameter
        var SendRequestToServerWithResponse = function(data, factionIdList, callback = undefined) {
            var url = kServerWarbaseUrl;
            if (factionIdList !== undefined && factionIdList.length > 0) {
                url += '?factions=' + factionIdList;
            }
            
            $.ajax({
                url: url,
                type: 'POST',
                data: data
            }).done(function(response) {
                console.debug('Warbase Leader: Request sent, response was:', response);
                try {
                    if (!callback) {
                        return;
                    }
                    callback(response);
                } catch (error) {
                    console.error('Warbase Leader: SendRequestToServerWithResponse: ', error);
                    AddErrorNotification('Warbase (Leader) script error: ' + error);
                }
            }).error(function(response) {
                console.error('Warbase Leader: Failed to send request to the server.', response);
                AddErrorNotification('Warbase (Leader) script error: Failed to send request to the server.');
            });
        };
                
        
        // Gets the ids of all the factions in the warbase.
        // @returns an array of ids of enemy factions
        var GetWarbaseFactionIdListFromPage = function() {
            var factionIdList = Array();
            
            var warbaseUl = $('ul.f-war-list > li[warid]');
            warbaseUl.each(function(index, node) {
                var factionId = $(node).find('div.info > div.name.bold > a').attr('href').match(/&ID=(\d+)/)[1];
                factionIdList[factionIdList.length] = factionId;
            });
            
            return factionIdList;
        };
        
        
        

        
        // Adds the header for individual enemy faction leadership options.
        // @param conventionalWarNode jQuery the node from conventional wars to which the faction leadership options panel should be prepended
        var AddFactionOptionsHeader = function(conventionalWarNode) {
            if ($('#optionspanel').length !== 0) {
                return;
            }
            
            // TODO: Get existing bonus status
            
            var factionId = parseInt(window.location.search.match(/step=profile&ID=(\d+)/)[1]);
            
            var SendSetBonusRequest = function() {
                console.debug('Warbase Leader: Requesting faction id ' + factionId + ' be set to bonus.');
                UpdateServerWithBonusStatus(factionId, true);
            };
            var SendClearBonusRequest = function() {
                console.debug('Warbase Leader: Requesting faction id ' + factionId + ' be cleared as bonus.');
                UpdateServerWithBonusStatus(factionId, false);
            };
            
            var optionsPanelDiv = $('<div id="optionspanel" class="bottom-round" style="padding: 10px 16px; margin: 10px 0; background-color: #f2f2f2;">');
            optionsPanelDiv.append('<div class="bold" style="">Warbase leadership options:</div>');
            
            var bonusWrapDiv = $('<div class="action-wrap action p10" style="padding: 10px 0 0 0;">');
            var setBonusButton = $('<span class="apply btn-wrap silver c-pointer" style="margin-right: 10px;"><span class="btn" role="button" style="padding: 0 15px 0 10px;">SET BONUS</span></span>');
            setBonusButton.click(SendSetBonusRequest);
            var clearBonusButton = $('<span class="apply btn-wrap silver c-pointer" style="margin-right: 10px;"><span class="btn" role="button" style="padding: 0 15px 0 10px;">CLEAR BONUS</span></span>');
            clearBonusButton.click(SendClearBonusRequest);
            
            bonusWrapDiv.append(setBonusButton).append(clearBonusButton);
            optionsPanelDiv.append(bonusWrapDiv);
            conventionalWarNode.prepend(optionsPanelDiv);
            
            // Separate from the main faction header.
            conventionalWarNode.prepend('<hr class="delimiter-999 m-top10">');
        };

        
        // Sends a message to the server telling it the new bonus status of the current faction.
        // @param factionId int the id of the faction to update
        // @param isBonus bool the new bonus status of the faction
        var UpdateServerWithBonusStatus = function(factionId, isBonus) {
            var bonusData = { factionId: factionId, isBonus: isBonus };
            AddOrUpdateInfoNotification('Sending request to ' + (isBonus ? 'set' : 'clear') + ' this faction as bonus.');
            SendRequestToServerWithResponse(bonusData, Array(), function() {
                AddOrUpdateInfoNotification('Faction ' + (isBonus ? 'set' : 'cleared') + ' as bonus.');
            });
        };
        
        
        // *** Declarations complete; begin main procedure.
        
        $.ajaxSetup({ cache: false });
        
        if (window.location.search.indexOf('?step=profile&ID=') !== -1) {
            // We are on a faction profile page; send this data to the server.
            var conventionalWarNode = $('.faction-respect-wars-wp');
            if (conventionalWarNode.length === 0) {
                throw 'Could not find faction war header.';
            }
            
            AddFactionOptionsHeader(conventionalWarNode);
        }
        
        // TODO: Any other leader-only functions
        
    } catch (error) {
        console.error('Warbase Leader: ', error);
        AddErrorNotification('Warbase (Leader) script error: ' + error);
    }
})();