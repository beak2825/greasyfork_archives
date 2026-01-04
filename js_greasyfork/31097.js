// ==UserScript==
// @name         Warbase
// @namespace    Warbase
// @version      1.2.0.4
// @description  Displays the faction warbase in an easy-to-use fashion
// @include      *.torn.com/factions.php?step=your*
// @include      *.torn.com/factions.php?step=profile&ID=*
// @include      *.torn.com/profiles.php?XID=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31097/Warbase.user.js
// @updateURL https://update.greasyfork.org/scripts/31097/Warbase.meta.js
// ==/UserScript==

// TODO: Tag players in faction tab display
// TODO: On mutation, also report all war stats to the server
// TODO: Send data to server on target defeat
// TODO: Send data to server on player profile load
// TODO: Make less ugly
// TODO: Also update player data when receiving a response after clicking a faction in the WB
// TODO: Hospital time in display?
// TODO: Faction-id'd level holders, or unnecessary now we have xanax/refills?

(function() {
    'use strict';
    
    // Adds an error notification at the top of a page.
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
        
        var kDefeatedFactionBackgroundColor = 'darkgray';
        var kDefeatedFactionTargetBackgroundColor = 'lightgray';
        var kBonusFactionBackgroundColor = 'gold';
        var kBonusFactionTargetBackgroundColor = 'lightyellow';
        var kNormalFactionBackgroundColor = '#F2F2F2';
        
        
        // Reports data received from Torn to the server.
        // @param data string/Object the data received from the server, generally HTML, that the server is expecting to receive
        // @param factionIdList Array the list of faction ids in the warbase
        // @param callback function if provided, a function to be called after the data has been sent to the server and a response has been received;
        //   takes the response as the first parameter, the jQuery conventional "respect wars" parent node as the second parameter, and
        //   a list of faction ids whose display is to be updated if it was provided
        // @param factionIdDisplaysToUpdate Array an optional list of faction ids in the current warbase display that should have their information
        //   updated by the callback function
        var ReportDataToServerWithResponse = function(data, factionIdList, callback = undefined, factionIdDisplaysToUpdate = null) {
            console.debug('Warbase: Sending faction data to the server.', data);
            var url = kServerWarbaseUrl;
            if (factionIdList !== undefined && factionIdList.length > 0) {
                url += '?factions=' + factionIdList;
            }
            
            $.ajax({
                url: url,
                type: 'POST',
                data: data
            }).done(function(response) {
                console.debug('Warbase: Faction data sent, received response:', response);
                try {
                    if (!callback) {
                        return;
                    }
                    callback(response, $('.faction-respect-wars-wp'), factionIdDisplaysToUpdate);
                } catch (error) {
                    console.error('Warbase: ReportDataToServerWithResponse:', error);
                    AddErrorNotification('Warbase script error: ' + error);
                }
            }).error(function(response) {
                console.error('Warbase: Failed to send faction data to the server.', response);
                AddErrorNotification('Warbase script error: Failed to send faction data to the server.');
            });
        };
                
        
        // Given incoming XHR data, reports up-to-date faction info to the server.
        var ReportIncomingFactionInfoToServer = function(event, jqxhr, settings, data) {
            try {
                if (settings.url.indexOf("getChainWarData") === -1) {
                    return;
                }
                console.debug("Warbase: event:", event);
                console.debug("Warbase: jqxhr:", jqxhr);
                console.debug("Warbase: settings:", settings);
                console.debug("Warbase: data:", data.substring(0, 250) + " ...");
                
                var warIdMatch = settings.url.match(/&warID=(\d+)/);
                var warId;
                if (warIdMatch) {
                    warId = parseInt(warIdMatch[1]);
                }

                var incomingFactionData = GetReportableEnemyFactionFromHtml(data, warId);
                ReportDataToServerWithResponse(incomingFactionData, GetWarbaseFactionIdListFromPage(), UpdateWarbaseFromServerResponse, [ incomingFactionData.factionId ] );
            } catch (error) {
                console.error('Warbase: ReportIncomingFactionInfoToServer:', error);
                AddErrorNotification('Warbase script error: ' + error);
            }
        };
        
        
        // Checks to see if a click event was outside of any open tag menus and, if so, closes them.
        var CloseVisibleTagMenusClickEvent = function(event) {
            try {
                if (!$(event.target).closest('div.tagform:visible').length) {
                    var visibleTagForms = $('div.tagform:visible');
                    var clickedTagButtonParent = $(event.target).closest('.tagbutton').parent();
                    visibleTagForms.each(function(index, node) {
                        if (clickedTagButtonParent.length === 0 || !$.contains(clickedTagButtonParent[0], node)) {
                            $(node).hide();
                        }
                    });
                }
            } catch (error) {
                console.error('Warbase: CloseVisibleTagMenusClickEvent:', error);
                AddErrorNotification('Warbase script error: ' + error);
            }
        };
        
        
        // Represents a single player in an enemy faction.
        class Target {
            // Constructs a target.
            // @param playerId int the id of the target
            // @param playerName string the name of the target
            // @param level int the level of the player
            // @param statTotal int the total stats of the player if known; -1 if not known
            // @param xanax int the total xanax taken by the player if known; -1 if not known
            // @param refills int the total refills used by the player if known; -1 if not known
            // @param onlineStatus string one of the following values: 'Online', 'Idle', 'Offline'
            // @param attackableStatus string one of the following values:
            //   'Okay', 'Hospital', 'Traveling', 'Jail', 'Federal'
            constructor(playerId, playerName, level, statTotal, xanax, refills, onlineStatus, attackableStatus) {
                this.playerId = playerId;
                this.playerName = playerName;
                this.level = level;
                this.statTotal = statTotal;
                this.xanax = xanax;
                this.refills = refills;
                this.onlineStatus = onlineStatus;
                this.attackableStatus = attackableStatus;
                
                if (onlineStatus == 'Online') {
                    this.onlineStatusIcon = 'icon1';
                } else if (onlineStatus == 'Idle') {
                    this.onlineStatusIcon = 'icon62';
                } else if (onlineStatus == 'Offline') {
                    this.onlineStatusIcon = 'icon2';
                } else {
                    if (this.onlineStatus) {
                        console.error('Warbase: For target ' + playerName + ' [' + playerId + ']: online status "' + onlineStatus + '" is not a known status.');
                    }
                    this.onlineStatusIcon = undefined;
                }
                
                if (attackableStatus && attackableStatus != 'Okay' && attackableStatus != 'Hospital' && attackableStatus != 'Jail' && attackableStatus != 'Traveling' && attackableStatus != 'Federal') {
                    console.error('Warbase: For target ' + playerName + ' [' + playerId + ']: attackable status "' + attackableStatus + '" is not a known status.');
                }
            }
            
            
            // Gets a string representing the player's stats if known or a string indicating that it is not known.
            // @return an abbreviated string representing the player's stats
            GetStatsDisplayString() {
                var fractionalDigits = 1;
                if (this.statTotal <= 0 || !$.isNumeric(this.statTotal)) {
                    return '?';
                }
                
                var roundedValue;
                var suffix = '';
                
                if (this.statTotal < 1000) {
                    roundedValue = Math.round(this.statTotal);
                } else if (this.statTotal < 1000000) {
                    roundedValue = Math.round(this.statTotal / 100) / 10;
                    suffix = 'k';
                } else if (this.statTotal < 1000000000) {
                    roundedValue = Math.round(this.statTotal / 100000) / 10;
                    suffix = 'm';
                } else if (this.statTotal < 1000000000000) {
                    roundedValue = Math.round(this.statTotal / 100000000) / 10;
                    suffix = 'b';
                } else if (this.statTotal < 1000000000000000) {
                    roundedValue = Math.round(this.statTotal / 100000000000) / 10;
                    suffix = 't';
                } else {
                    // Something will have to be done if we get people passing the quadrillions of stats...
                    roundedValue = Math.round(this.statTotal / 100000000000000) / 10;
                    suffix = 'q';
                }
                
                return roundedValue.toLocaleString('EN', { minimumFractionDigits: fractionalDigits, maximumFractionDigits: fractionalDigits}) + suffix;
            }
            
            
            // Gets a string with the target's status or a link to the attack page if the target is okay.
            // @return an HTML span or link with status/attack
            GetAttackableStatusHtml() {
                if (this.attackableStatus == 'Hospital' || this.attackableStatus == 'Jail' || this.attackableStatus == 'Traveling' ||
                    this.attackableStatus == 'Federal') {
                    return '<span class="t-red">' + this.attackableStatus + '</span>';
                }
                return '<a class="t-blue bold" href="/loader2.php?sid=getInAttack&user2ID=' + this.playerId + '">Attack</a>';
            }
            

            // Adds this target to the end of the member list.
            // @param memberList jQuery the ul node for the member list of this target's faction
            // @param isBonus bool whether or not this target is in a faction that is currently marked as bonus
            // @param existingEnemyTag EnemyTag the existing tag for this target; null if there isn't one
            AddTargetToMemberList(memberList, isBonus, isDefeated, existingEnemyTag) {
                var targetNode = $('<li class="target" style="padding: 4px 10px 0px 10px; height: 16px; background-color: ' +
                                   (isDefeated ? 'lightgray' : isBonus ? 'lightyellow' : '#f2f2f2') + '; border-top: 1px solid #FFF; border-bottom: 1px solid #CCC;">');
                
                var onlineStatusIconDiv = $('<div class="member icons" style="float: left; width: 16px; margin-top: -1px;">');
                var statusIcon;
                if (this.onlineStatusIcon === undefined || this.onlineStatusIcon === null) {
                    statusIcon = $('<span class="bold" style="font-size: 12px;">&nbsp;</span>'); // Show nothing for now.
                } else {
                    statusIcon = $('<ul id="iconTray" class="med singleicon">' +
                                  '<li id="' + this.onlineStatusIcon + '" class="iconShow" title="<b>' + this.onlineStatus + '</b>"></li>' +
                                  '</ul>');
                }
                onlineStatusIconDiv.append(statusIcon);
                targetNode.append(onlineStatusIconDiv);
                
                var playerLink = $('<a class="t-blue" href="/profiles.php?XID=' + this.playerId + '">');
                var noteText = $('<span style="display: none; font-weight: 100;">&nbsp;(note)</span>');
                targetNode.append($('<div class="bold" style="width: 280px; float: left;">').append(playerLink.append(this.playerName + ' [' + this.playerId + ']')).append(noteText));
                targetNode.append('<div style="width: 66px; padding-right: 20px; float: left;">Level: <div style="float: right;">' +
                                  this.level + '</div></div>');
                targetNode.append('<div style="width: 90px; padding-right: 20px; float: left;">Stats: <div style="float: right;">' +
                                  this.GetStatsDisplayString() + '</div></div>');
                targetNode.append('<div style="width: 68px; padding-right: 20px; float: left;">Xan: <div style="float: right;">' +
                                  (this.xanax !== undefined && this.xanax >= 0 ? this.xanax : '?') + '</div></div>');
                targetNode.append('<div style="width: 64px; padding-right: 20px; float: left;">Ref: <div style="float: right;">' +
                                  (this.refills !== undefined && this.refills >= 0 ? this.refills : '?') + '</div></div>');
                targetNode.append('<div style="float: left;">' + this.GetAttackableStatusHtml() + '</div>');
                
                var tagButton = $('<a class="tagbutton t-blue bold" href="javascript:void(0)">Tag</a>');
                var tagForm = $('<div class="tagform" style="width: 270px; height: 75px; position: absolute; right: -11px; top: 19px; z-index: 100; display: none; ' +
                                'background-color: #f2f2f2; border: 2px solid #888; border-radius: 3px;">');
                tagButton.click(function() {
                    try {
                        if (tagForm.css('display') == 'none') {
                            tagForm.css('display', 'block');
                        } else {
                            tagForm.css('display', 'none');
                        }
                    } catch (error) {
                        console.error('Warbase: Tag menu:', error);
                        AddErrorNotification('Warbase script error: ' + error);
                    }
                });
                var tagTextInput = $('<input style="width: 100%;" type="text">');
                var tagDifficultySelect = $('<select>');
                tagDifficultySelect
                    .append('<option value="" selected>No tag</option>')
                    .append('<option value="' + possibleTargetColor + '">Possible target</option>')
                    .append('<option value="' + veryEasyTargetColor + '">Very easy</option>')
                    .append('<option value="' + easyTargetColor + '">Easy</option>')
                    .append('<option value="' + mediumTargetColor + '">Medium</option>')
                    .append('<option value="' + hardTargetColor + '">Hard</option>')
                    .append('<option value="' + veryHardTargetColor + '">Very hard</option>')
                    .append('<option value="' + levelHolderTargetColor + '">Level holder</option>')
                    .append('<option value="' + fluffyTargetColor + '">Extra-fluffy</option>')
                    .append('<option value="' + stalemateTargetColor + '">Stalemate</option>');
                var tagFormCloseButton = $('<a class="t-blue bold" href="javascript:void(0)">Close</a>');
                tagFormCloseButton.click(function() {
                    try {
                        tagForm.css('display', 'none');
                    } catch (error) {
                        console.error('Warbase: Tag menu close:', error);
                        AddErrorNotification('Warbase script error: ' + error);
                    }
                });
                
                var playerId = this.playerId;  // Make this variable available to the UpdateTags function.
                var UpdateTags = function() {
                    var newTag = new EnemyTag(playerId, tagTextInput.val(), tagDifficultySelect.val());
                    var enemyTagList = GetEnemyTagListFromLocalStorage();
                    
                    var tagFound = false;
                    for (var i = 0; i < enemyTagList.tags.length && !tagFound; ++i) {
                        if (enemyTagList.tags[i].playerId === newTag.playerId) {
                            enemyTagList.tags[i] = newTag;
                            tagFound = true;
                        }
                    }
                    if (!tagFound) {
                        enemyTagList.tags[enemyTagList.tags.length] = newTag;
                    }

                    WriteEnemyTagListToLocalStorage(enemyTagList);
                };
                
                var TagTextChange = function(storeTags = true) {
                    try {
                        if (this.value.length === 0) {
                            playerLink.parent().removeAttr('title');
                            noteText.css('display', 'none');
                        } else {
                            playerLink.parent().attr('title', '<b>' + this.value + '</b>');
                            noteText.css('display', 'inline-block');
                        }
                        if (storeTags) {
                            UpdateTags();
                        }
                    } catch (error) {
                        console.error('Warbase: Tag text:', error);
                        AddErrorNotification('Warbase script error: ' + error);
                    }
                };
                tagTextInput.change(TagTextChange);
                tagTextInput.keyup(TagTextChange);
                
                var TagDifficultyChange = function(storeTags = true) {
                    try {
                        targetNode.css('background-color', this.value);
                        if (storeTags) {
                            UpdateTags();
                        }
                    } catch (error) {
                        console.error('Warbase: Tag difficulty:', error);
                        AddErrorNotification('Warbase script error: ' + error);
                    }
                };
                tagDifficultySelect.change(TagDifficultyChange);
                
                if (existingEnemyTag) {
                    tagTextInput.val(existingEnemyTag.tagText);
                    tagTextInput.trigger('change');
                    tagDifficultySelect.val(existingEnemyTag.tagColor);
                    tagDifficultySelect.trigger('change');
                    // TODO: What if it's not in the select??
                }
                
                targetNode.append($('<div targetid="' + this.playerId + '" style="float: right; position: relative;">').append(tagButton)
                                  .append(tagForm.append($('<div style="padding: 4px 10px 4px 6px;">').append('<span style="float: left; padding: 1px 6px 0 0;">Text:</span>')
                                                         .append($('<span style="display: block; overflow: hidden;">').append(tagTextInput)))
                                          .append($('<div style="padding: 4px 10px 4px 6px;">').append('<span style="float: left; padding: 2px 6px 0 0;">Difficulty:</span>')
                                                         .append(tagDifficultySelect))
                                          .append($('<div style="padding: 5px 0 0 6px;">').append(tagFormCloseButton))));
                // TODO: Add custom color/difficulty
                
                targetNode.append('<div class="clear"/>');
                memberList.append(targetNode);
            }
            
            
            // Gets whether this target should be hidden based on the given filter.
            // @param filter WarbaseFilter the active filter
            // @param isBonus bool whether this target's faction is currently a bonus faction
            // @param playerLevel int the level of the script user
            // @param isLevelHolder bool whether this player has been tagged as a level holder
            IsTargetHiddenByFilter(filter, isBonus, playerLevel, isLevelHolder) {
                // Always show online filter is top precedence.
                if (filter.showOnline && this.onlineStatus == 'Online') {
                    return false;
                }
                
                // Un-attackable filters are next precedence.
                if ((filter.hideTraveling && this.attackableStatus == 'Traveling') ||
                   (filter.hideFederal && this.attackableStatus == 'Federal') ||
                   (filter.hideHospital && this.attackableStatus == 'Hospital')) {
                    return true;
                }
                
                // Bonus and level holder supercedes any difficulty-related filters.
                if (isBonus || (filter.showLevelHolders && isLevelHolder)) {
                    return false;
                }
                
                // Difficulty filters are lowest precedence.
                if ((filter.hideLevelRange !== null && Math.abs(this.level - playerLevel) > filter.hideLevelRange) ||
                    (filter.hideXanaxRange !== null && this.xanax > filter.hideXanaxRange) ||
                    (filter.hideRefillRange !== null && this.refills > filter.hideRefillRange)) {
                    return true;
                }
            }
        }
        
        
        // Represents a single enemy faction in the warbase.
        class EnemyFaction {
            // Constructs an enemy faction.
            // @param factionId int the id of the enemy faction
            // @param warId in the id of the war against this faction if known, null or undefined otherwise
            // @param factionName string the name of this faction
            // @param ourRespect int the respect we have earned in the current war against the enemy faction
            // @param enemyRespect int the respect the enemy faction has earned in the current war
            // @param ourPercentControl double the percentage of control we have against the enemy in the current war
            // @param respectToWin int the additional respect we would need to win the current war assuming the enemy gained no more
            // @param isRankedWar bool whether the war with this faction is a ranked war
            // @param isBonus bool whether this faction has been selected specifically for bonus hits
            // @param isDefeated bool whether this faction has already been defeated
            constructor(factionId, warId, factionName, ourRespect, enemyRespect, ourPercentControl, respectToWin, isRankedWar, isBonus, isDefeated) {
                this.factionId = factionId;
                this.warId = warId;
                this.factionName = factionName;
                this.ourRespect = ourRespect;
                this.enemyRespect = enemyRespect;
                this.ourPercentControl = ourPercentControl;
                this.respectToWin = respectToWin;
                this.isRankedWar = isRankedWar;
                this.isBonus = isBonus;
                this.isDefeated = isDefeated;
                this.targets = Array();
            }
            
            // Adds a target to the end of the list of targets in this faction.
            // @param target Target a player target in the enemy faction
            AddTarget(target) {
                if ($.isNumeric(target.level)) {
                    for (var i = 0; i < this.targets.length; ++i) {
                        if ($.isNumeric(this.targets[i].level) && target.level > this.targets[i].level) {
                            this.targets.splice(i, 0, target);
                            return;
                        }
                    }
                }
                this.targets[this.targets.length] = target;
            }
            
            // Gets an enemy target in the faction by id.
            // @param playerId int the id of the target in the warbase
            // @returns a Target matching the playerId if found, undefined otherwise
            GetTargetById(playerId) {
                for (var i = 0; i < this.targets.length; ++i) {
                    if (this.targets[i].playerId === playerId) {
                        // Make sure the result is actually a Target object.
                        var target = this.targets[i];
                        Object.setPrototypeOf(target, Target.prototype);
                        return target;
                    }
                }
                return undefined;
            }
            
            // Adds this faction to the conventional faction war section.
            // @param conventionalWarNode jQuery the "respect wars" parent node
            AddEnemyFactionToParentNode(conventionalWarNode) {
                var factionHeaderDiv = $('<div id="faction' + this.factionId + '" class="faction" style="padding: 10px 16px 22px 16px; background-color: ' +
                                         (this.isDefeated ? kDefeatedFactionBackgroundColor : this.isBonus ? kBonusFactionBackgroundColor : kNormalFactionBackgroundColor) + ';">');
                this.SetEnemyFactionHeaderNode(factionHeaderDiv);
                conventionalWarNode.append(factionHeaderDiv);
                
                var memberList = $('<ul id="membersfaction' + this.factionId + '" class="member-list bottom-round" ' +
                                   'style="margin-bottom: 8px; background-color: ' +
                                   (this.isDefeated ? kDefeatedFactionTargetBackgroundColor : this.isBonus ? kBonusFactionTargetBackgroundColor : kNormalFactionBackgroundColor) + '">');
                conventionalWarNode.append(memberList);
            }
            
            
            SetEnemyFactionHeaderNode(factionHeaderDiv) {
                factionHeaderDiv.append('<div class="bold" style="font-size: 15px; padding-bottom: 4px;">' +
                                        '<a class="t-blue" href="factions.php?step=profile&ID=' + this.factionId + '">' +
                                        this.factionName + '</a>' + (this.isRankedWar ? ' (Ranked war)' : '') +
                                        (this.isBonus ? ' (Bonus faction)' : '') + (this.isDefeated ? ' (Defeated)' : '') + '</div>');
                if (this.ourRespect !== undefined && this.ourRespect !== null) {
                    factionHeaderDiv.append('<div class="bold" style="float: left; width: 120px;"><span class="t-green">Our respect: ' + this.ourRespect + '</span></div>');
                }
                if (this.enemyRespect !== undefined && this.enemyRespect !== null) {
                    factionHeaderDiv.append('<div class="bold" style="float: left; width: 120px;"><span class="t-red">Their respect: ' + this.enemyRespect + '</span></div>');
                }
                
                var ourPercentControlString;
                if (this.ourPercentControl !== undefined && this.ourPercentControl !== null) {
                    ourPercentControlString = this.ourPercentControl + '% control';
                }
                if (this.respectToWin !== undefined && this.respectToWin !== null) {
                    factionHeaderDiv.append('<div class="bold" style="float: left;"><span class="">Respect to win: ' + this.respectToWin +
                                            (ourPercentControlString !== undefined && ourPercentControlString.length > 0 ? ' (' + ourPercentControlString + ')' : '') +
                                            '</span></div>');
                } else if (ourPercentControlString !== undefined && ourPercentControlString.length > 0) {
                    factionHeaderDiv.append('<div class="bold" style="float: left;"><span class="">' + ourPercentControlString + '</span></div>');
                }
            }
            
            
            // Creates the HTML faction member list based on the current filter, clearing the data if the list has already been populated.
            // @param filter WarbaseFilter the current, active warbase filter
            // @param playerLevel int the level of the script user
            // @param enemyTagList EnemyTagList a list of all tagged targets
            // @returns an object with the number of targets that were added (numTargetsAdded) and the number that had attackable status
            //   'Okay' (numTargetsOkay)
            DisplayFactionMemberList(filter, playerLevel, enemyTagList) {
                var memberList = $('#membersfaction' + this.factionId);
                memberList.empty();
                var numTargetsAdded = 0;
                var numTargetsOkay = 0;
                var isBonus = this.isBonus;
                var isDefeated = this.isDefeated;
                $.each(this.targets, function(index, target) {
                    var playerId = target.playerId;
                    var existingTag = null;
                    for (var i = 0; i < enemyTagList.tags.length && existingTag === null; ++i) {
                        if (enemyTagList.tags[i].playerId === playerId) {
                            existingTag = enemyTagList.tags[i];
                        }
                    }
                    if (!target.IsTargetHiddenByFilter(filter, isBonus, playerLevel, existingTag ? existingTag.tagColor == levelHolderTargetColor : false)) {
                        target.AddTargetToMemberList(memberList, isBonus, isDefeated, existingTag);
                        ++numTargetsAdded;
                    }
                    if (target.attackableStatus == 'Okay') {
                        ++numTargetsOkay;
                    }
                });
                return {numTargetsAdded: numTargetsAdded, numTargetsOkay: numTargetsOkay};
            }
            
            
            // Sets the background color of this faction's main tab at the top of the warbase if the war id is known.
            SetTabHighlightColor() {
                if (this.warId === undefined || this.warId === null) {
                    // Maybe we could do something with faction id instead, but it's cumbersome and maybe not necessary.
                    console.error('Warbase: Cannot set tab color for ' + this.factionName + ' because warId is unknown.');
                    return;
                }
                
                var factionTab = $('li[warid="' + this.warId + '"]');
                if (factionTab.length === 0) {
                    console.error('Warbase: Couldn\'t find faction tab for ' + this.factionName + ' with war id ' + warId + '.');
                    return;
                }
                
                factionTab.css('background-color', this.isDefeated ? kDefeatedFactionBackgroundColor :  this.isBonus ? kBonusFactionBackgroundColor : kNormalFactionBackgroundColor);
            }
            
            
            // Updates an existing faction display on the page.
            // @param filter WarbaseFilter the current, active warbase filter
            UpdateExistingDisplay(filter) {
                console.debug('Updating display for faction ' + this.factionName + '.');
                
                this.SetTabHighlightColor();
                
                var factionHeaderDiv = $('#faction' + this.factionId);
                factionHeaderDiv.empty();
                this.SetEnemyFactionHeaderNode(factionHeaderDiv);
                
                // TODO: Update faction member list.
                // Need to pass in playerLevel and enemyTagList
                // Also need to update statistics (how?...)
                //this.DisplayFactionMemberList(filter, playerLevel, enemyTagList);
            }
        }
        
            
        // Represents the entire warbase in its last-known state.
        class Warbase {
            constructor() {
                this.enemyFactions = Array();
            }
            
            
            // Gets an enemy faction in the warbase by id.
            // @param factionId int the id of the faction in the warbase
            // @returns an EnemyFaction matching the factionId if found, undefined otherwise
            GetFactionById(factionId) {
                for (var i = 0; i < this.enemyFactions.length; ++i) {
                    if (this.enemyFactions[i].factionId === factionId) {
                        // Make sure the result is actually an EnemyFaction object.
                        var enemyFaction = this.enemyFactions[i];
                        Object.setPrototypeOf(enemyFaction, EnemyFaction.prototype);
                        return enemyFaction;
                    }
                }
                return undefined;
            }
            
            
            // Updates the warbase with info about an enemy faction, either by replacing the
            // previous data from the same faction if it already is in the warbase or by
            // adding the incoming data.
            // @param enemyFaction EnemyFaction the enemy faction to add/update in the warbase
            AddOrReplaceEnemyFaction(enemyFaction) {
                for (var i = 0; i < this.enemyFactions.length; ++i) {
                    if (this.enemyFactions[i].factionId == enemyFaction.factionId) {
                        console.debug('Warbase: Replacing enemy faction ' + this.enemyFactions[i].factionName +
                                      ' with a newer version.');
                        this.enemyFactions[i] = enemyFaction;
                        return;
                    }
                }
                console.debug('Warbase: Adding enemy faction ' + enemyFaction.factionName + ' to the warbase.');
                this.enemyFactions[this.enemyFactions.length] = enemyFaction;
            }
            
            
            // Adds the warbase to the conventional faction war section.
            // @param conventionalWarNode jQuery the "respect wars" parent node
            // @param filter WarbaseFilter the current, active warbase filter
            // @param enemyTagList EnemyTagList a list of all tagged targets
            AddWarbaseToPage(conventionalWarNode, filter, enemyTagList) {
                var orderedFactionList;
                if (!filter.orderByBonus) {
                    orderedFactionList = this.enemyFactions;
                } else {
                    orderedFactionList = Array();
                    $.each(this.enemyFactions, function(index, enemyFaction) {
                        for (var i = 0; i < orderedFactionList.length; ++i) {
                            if (((enemyFaction.isBonus && !enemyFaction.isDefeated) && (!orderedFactionList[i].isBonus || orderedFactionList[i].isDefeated)) ||
                                (!enemyFaction.isBonus && !enemyFaction.isDefeated && orderedFactionList[i].isDefeated)) {
                                orderedFactionList.splice(i, 0, enemyFaction);
                                return;
                            }
                        }
                        orderedFactionList[orderedFactionList.length] = enemyFaction;
                    });
                }
                
                var totalNumberOfTargets = 0;
                var totalNumberOfVisibleTargets = 0;
                var totalNumberOfOkayTargets = 0;
                var playerLevel = GetPlayerLevel();
                $.each(orderedFactionList, function(index, enemyFaction) {
                    enemyFaction.AddEnemyFactionToParentNode(conventionalWarNode);
                    enemyFaction.SetTabHighlightColor();
                    
                    totalNumberOfTargets += enemyFaction.targets.length;
                    var targetStatistics = enemyFaction.DisplayFactionMemberList(filter, playerLevel, enemyTagList);
                    totalNumberOfVisibleTargets += targetStatistics.numTargetsAdded;
                    totalNumberOfOkayTargets += targetStatistics.numTargetsOkay;
                });
                
                UpdateTargetStats(totalNumberOfTargets, totalNumberOfVisibleTargets, totalNumberOfOkayTargets);
            }
            
            
            // Updates existing faction displays instead of recreating the whole warbase on the page.
            // @param filter WarbaseFilter the current, active warbase filter
            UpdateOnlyExistingFactions(filter) {
                $.each(this.enemyFactions, function(index, enemyFaction) {
                    enemyFaction.UpdateExistingDisplay(filter);
                });
            }

            
            // Updates the faction target display based on the current filter.
            // @param filter WarbaseFilter the current, active warbase filter
            // @param enemyTagList EnemyTagList a list of all tagged targets
            UpdateTargetDisplay(filter, enemyTagList) {
                var totalNumberOfTargets = 0;
                var totalNumberOfVisibleTargets = 0;
                var totalNumberOfOkayTargets = 0;
                var playerLevel = GetPlayerLevel();
                for (var i = 0; i < this.enemyFactions.length; ++i) {
                    totalNumberOfTargets += this.enemyFactions[i].targets.length;
                    var targetStatistics = this.enemyFactions[i].DisplayFactionMemberList(filter, playerLevel, enemyTagList);
                    totalNumberOfVisibleTargets += targetStatistics.numTargetsAdded;
                    totalNumberOfOkayTargets += targetStatistics.numTargetsOkay;
                }
                
                UpdateTargetStats(totalNumberOfTargets, totalNumberOfVisibleTargets, totalNumberOfOkayTargets);
            }
            
            
            // Stores target information in localStorage for use by other functions.
            CacheInLocalStorage() {
                localStorage.warbaseCache = JSON.stringify(this);
            }
        }
        
        
        // Represents the player's warbase filter method of choice.
        class WarbaseFilter {
            constructor() {
                this.showOnline = true;
                this.showLevelHolders = true;
                this.hideTraveling = true;
                this.hideFederal = true;
                this.hideHospital = true;
                this.hideLevelRange = false;
                this.hideXanaxRange = false;
                this.hideRefillRange = false;
                this.orderByBonus = false;
            }
        }
        
        
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
        
        
        // Gets the current warbase from the server and then displays it below the existing wars on the page.
        // @param conventionalWarNode jQuery the "respect wars" parent node
        var LoadAndDisplayInitialWarbase = function(conventionalWarNode) {
            var factionIdList = GetWarbaseFactionIdListFromPage();
            if (factionIdList.length === 0) {
                console.debug('Warbase: No enemy factions in the warbase.');
                return;
            }
            
            console.debug('Querying server for faction ids: ' + factionIdList);
            var url = kServerWarbaseUrl + '?factions=' + factionIdList;
            $.ajax({
                url: url,
                type: "GET"
            }).done(function(response) {
                try {
                    console.debug('Warbase: Server data:', response);
                    UpdateWarbaseFromServerResponse(response, conventionalWarNode);
                } catch (error) {
                    console.error('Warbase: LoadAndDisplayInitialWarbase:', error);
                    AddErrorNotification('Warbase script error: ' + error);
                }
            }).error(function(response) {
                console.error('Warbase: Error getting warbase info from the server.');
                console.error(response);
                AddErrorNotification('Warbase script error: Couldn\'t get warbase info from server.');
            });
        };
        
        
        // Creates the warbase on the main faction page (step=your[#/tab=main]).
        var ObserveWarbaseMutation = function() {
            console.debug('Warbase: Attempting to display on page ' + window.location.pathname + window.location.search);
            
            var factionMain = $('#faction-main');
            if (factionMain.length === 0) {
                throw 'No faction element could be found in the page.';
            }
            
            var observer = new MutationObserver(function(mutations) {
                try {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].classList.contains('faction-respect-wars-wp')) {
                            console.debug('Warbase: Faction main page loaded.');
                            console.debug(mutation.addedNodes[0]);
                            
                            var conventionalWarNode = $(mutation.addedNodes[0]);
                            ObserveFactionMutation(conventionalWarNode.find('ul.f-war-list'));
                            LoadAndDisplayInitialWarbase(conventionalWarNode);
                        } else {
                            console.debug('Warbase: The faction page has mutated but the warbase hasn\'t loaded yet or it has been removed.');
                        }
                    });
                } catch (error) {
                    console.error('Warbase: ObserveWarbaseMutation:', error);
                    AddErrorNotification('Warbase script error: ' + error);
                }
            });
            observer.observe(factionMain[0], { attributes: true, childList: true, characterData: true });
        };
        
        
        // Observes mutations of individual factions in the Torn version of the warbase.
        var ObserveFactionMutation = function(factionNodes) {
            var observer = new MutationObserver(function(mutations) {
                try {
                    mutations.forEach(function(mutation) {
                        if (mutation.addedNodes.length > 0 && $(mutation.addedNodes[0]).hasClass('descriptions')) {
                            console.debug('Warbase: Received faction data.');
                            console.debug(mutation.addedNodes[0]);
                            var receivedWarData = $(mutation.addedNodes[0]);
                            var factionLinks = receivedWarData.find('a[href*="step=profile&ID="]');
                            if (factionLinks.size() === 0) {
                                // There seem to be multiple mutations. Maybe this happens before the data is really stored?..
                                return;
                            }
                            
                            var enemyTargetList = receivedWarData.find('ul.member-list');
                            
                            var enemyFaction;
                            var cachedWarbase;
                            if (localStorage.warbaseCache !== undefined) {
                                cachedWarbase = Object.setPrototypeOf(JSON.parse(localStorage.warbaseCache), Warbase.prototype);
                                var factionIdMatch = factionLinks.attr('href').match(/step=profile&ID=([0-9]+)/);
                                if (factionIdMatch) {
                                    var factionId = parseInt(factionIdMatch[1]);
                                    enemyFaction = cachedWarbase.GetFactionById(factionId);
                                    if (!enemyFaction) {
                                        console.error('Warbase: ObserveFactionMutation: Couldn\'t find faction id ' + factionId + ' in cached data; not all warbase enhancements will be shown.');
                                    }
                                } else {
                                    console.error('Warbase: ObserveFactionMutation: Couldn\'t find faction id for incoming data; not all warbase enhancements will be shown.');
                                }
                            } else {
                                console.error('Warbase: ObserveFactionMutation: Couldn\'t load cached warbase data; not all warbase enhancements will be shown.');
                            }
                            
                            AddDataToReceivedFactionTargets(enemyTargetList, enemyFaction, GetEnemyTagListFromLocalStorage(), false);
                        }
                    });
                } catch (error) {
                    console.error('Warbase: ObserveFactionMutation:', error);
                    AddErrorNotification('Warbase script error: ' + error);
                }
            });
            factionNodes.each(function(index, node) {
                observer.observe(node, { attributes: true, childList: true, characterData: true });
            });
        };
        
        
        // Adds to to the faction member list in the Torn version of the warbase.
        // Includes tagging, xanax, and refills.
        // @param memberList jQuery the faction member list node
        // @param enemyFaction EnemyFaction known data regarding the enemy faction to which the targets belong
        // @param enemyTagList EnemyTagList a list of all tagged targets
        // @param isFactionProfilePage bool whether this is a faction's main profile page (different format), rather than just a section of targets in the warbase
        var AddDataToReceivedFactionTargets = function(memberList, enemyFaction, enemyTagList, isFactionProfilePage) {
            // To save space, remove unnecessary icons.
            // Includes: gender, married, faction, bazaar.
            memberList.find('li#icon6,li#icon7,li#icon8,li#icon9,li#icon35').hide();
            
            memberList.children().each(function(index, node) {
                try {
                    var playerIdLink = $(node).find('a.user.name');
                    if (playerIdLink.length === 0) {
                        console.error('Warbase: Couldn\'t find player id link in HTML list element.');
                        return;
                    }
                    var playerIdMatch = playerIdLink.attr("href").match(/profiles\.php\?XID=(\d+)/);
                    if (!playerIdMatch) {
                        console.error('Warbase: Couldn\'t find player id in "' + playerIdLink.attr("href") + '".');
                        return;
                    }
                    var playerId = parseInt(playerIdMatch[1]);
                    
                    // Tag enemies.
                    var isEnemyTagged = false;
                    for (var i = 0; i < enemyTagList.tags.length && !isEnemyTagged; ++i) {
                        if (enemyTagList.tags[i].playerId === playerId) {
                            $(node).css('background-color', enemyTagList.tags[i].tagColor);
                            isEnemyTagged = true;
                        }
                    }

                    var memberIconsDiv = $(node).find('div.member-icons.icons');
                    memberIconsDiv.css('width', isFactionProfilePage ? '105px' : '130px');

                    var columnStyleText = 'height: 33px; line-height: 33px; float: left; border-left: 1px solid #FFF; border-right: 1px solid #CCC; text-align: right; padding-right: 10px;';

                    var xanaxDiv = $('<div style="' + columnStyleText + ' width: 64px;">');
                    var refillDiv = $('<div style="' + columnStyleText + ' width: 64px;">');
                    memberIconsDiv.after(refillDiv);
                    memberIconsDiv.after(xanaxDiv);

                    if (!enemyFaction) {
                        // We don't have the information to continue.
                        return;
                    }
                    var target = enemyFaction.GetTargetById(playerId);
                    if (!target) {
                        // We don't have the information to continue.
                        console.error('Warbase: AddXanaxAndRefillsToReceivedFactionTargets: Couldn\'t find player id ' + playerId + ' in cached data; not all warbase enhancements will be shown.');
                        return;
                    }
                    
                    if (target.xanax !== undefined) {
                        xanaxDiv.text('Xan: ' + target.xanax.toLocaleString('en-US'));
                    }
                    if (target.refills !== undefined) {
                        refillDiv.text('Ref: ' + target.refills.toLocaleString('en-US'));
                    }
                } catch (error) {
                    console.error('Warbase: AddXanaxAndRefillsToReceivedFactionTargets:', error);
                    AddErrorNotification('Warbase script error: ' + error);
                }
            });
        };
        
                
        // Tags a player on their own profile page.
        // @param playerId int the id of the player whose profile we're viewing
        // @param playerProfileContainer jQuery the action section of the player's profile
        // @param enemyTagList EnemyTagList a list of all tagged targets
        var TagPlayerProfile = function(playerId, playerProfileContainer, enemyTagList) {
            var enemyTag;
            for (var i = 0; i < enemyTagList.tags.length && enemyTag === undefined; ++i) {
                if (enemyTagList.tags[i].playerId === playerId) {
                    enemyTag = enemyTagList.tags[i];
                }
            }
            
            if (enemyTag !== undefined) {
                playerProfileContainer.css('background-color', enemyTag.tagColor);
            }
            
            // TODO: Add ability to update tag.
            // TODO: Add tag notes.
        };
        
        
        // Refreshes the warbase from the server.
        var RefreshWarbase = function() {
            $('div.faction').remove();
            $('ul.member-list').remove();
            LoadAndDisplayInitialWarbase($('.faction-respect-wars-wp'));
        };
        
        
        // Gets an object representing an enemy faction in a format that is reportable to the server.
        // @param factionHtml string an HTML string containing faction and member information received on the local page
        // @param warId int the unique id for this individual war
        // @returns an object with all the fields in the EnemyFaction class, where known
        var GetReportableEnemyFactionFromHtml = function(factionHtml, warId) {
            var parsedHtml = $($.parseHTML(factionHtml));
            console.debug('Parsed HTML:', parsedHtml);
            
            var enemyFaction = {};
            
            var factionIdLink = parsedHtml.find('a[href*="factions.php?step=profile&ID="]');
            if (factionIdLink.length === 0) {
                throw 'Couldn\'t find faction id in reported HTML.';
            }
            var factionIdMatch = factionIdLink.attr("href").match(/factions\.php\?step=profile&ID=(\d+)/);
            if (!factionIdMatch) {
                throw 'Couldn\'t find enemy faction id in "' + factionIdLink .attr("href") + '".';
            }
            var factionId = factionIdMatch[1];
            enemyFaction.factionId = parseInt(factionId);

            if (warId !== undefined) {
                enemyFaction.warId = warId;
            }
            
            var respectDiv = parsedHtml.find('.f-progress > .respect');
            var ourRespectMatch = respectDiv.find('span.t-green').text().replace(/,/g, "").match(/(\d+) respect/);
            if (ourRespectMatch) {
                enemyFaction.ourRespect = parseInt(ourRespectMatch[1]);
            } else {
                console.error('Warbase: Couldn\'t parse our respect from reported HTML for faction id ' + factionId + '.');
            }
            var enemyRespectMatch = respectDiv.find('span.t-red').text().replace(/,/g, "").match(/(\d+) respect/);
            if (enemyRespectMatch) {
                enemyFaction.enemyRespect = parseInt(enemyRespectMatch[1]);
            } else {
                console.error('Warbase: Couldn\'t parse enemy respect from reported HTML for faction id ' + factionId + '.');
            }
            
            var ourPercentControlText = parsedHtml.find('div.progress-cont.pos').attr('title');
            enemyFaction.ourPercentControl = parseFloat(ourPercentControlText.slice(0, -1));
            enemyFaction.isDefeated = ourPercentControlText == '100%';
            
            var rankedWarDiv = parsedHtml.find('div.f-left > div.cont > div.t-green');
            if (rankedWarDiv.length > 0 && rankedWarDiv.text().match(/ rank /)) {
                enemyFaction.isRankedWar = true;
            }

            var memberList = parsedHtml.find('ul.member-list');
            if (memberList.length === 0) {
                console.error('Warbase: Couldn\'t find target list from reported HTML for faction id ' + factionId + '.');
            }
            enemyFaction.targets = GetReportableTargetsFromJquery(memberList);
            
            return enemyFaction;
        };
        
        
        // Gets a list of targets from the faction jQuery member list.
        // @param memberList jQuery the parent ul member list containing all the faction targets
        // @returns an Array of Target objects as defined by the member list
        var GetReportableTargetsFromJquery = function(memberList) {
            var targets = Array();
            
            memberList.children().each(function(index, node) {
                var playerNode = $(node);
                
                var target = {};
                
                var playerIdLink = playerNode.find('a.user.name');
                if (playerIdLink.length === 0) {
                    console.error('Warbase: Couldn\'t find player id link in HTML list element.');
                    return;
                }
                var playerIdMatch = playerIdLink.attr("href").match(/profiles\.php\?XID=(\d+)/);
                if (!playerIdMatch) {
                    console.error('Warbase: Couldn\'t find player id in "' + playerIdLink.attr("href") + '".');
                    return;
                }
                var playerId = playerIdMatch[1];
                try {
                    target.playerId = parseInt(playerId);

                    var onlineStatusElement = playerNode.find('div.member.icons > ul.singleicon > li');
                    if (onlineStatusElement.length === 0) {
                        console.error('Warbase: Couldn\'t find player online status element in HTML list element.');
                    } else {
                        target.onlineStatus = $.parseHTML(onlineStatusElement.attr('title'))[0].textContent;
                    }
                    
                    target.attackableStatus = playerNode.find('div.status > :last-child').text().trim();

                    var hospitalIcon = playerNode.find('#icon15');
                    if (hospitalIcon.length > 0) {
                        try {
                            var hospitalIconHtml = $.parseHTML(hospitalIcon.attr('title'));
                            // TODO: Look more specifically for the span.timer element; jQuery not working with a flat array it seems.
                            var hospitalTimeSpan = $(hospitalIconHtml[hospitalIconHtml.length - 2]);
                            target.hospitalTimeSeconds = parseInt(hospitalTimeSpan.attr('data-time'));
                        } catch (error) {
                            if (target.attackableStatus === 'Hospital') {
                                console.error('Warbase: Couldn\'t find hospital time for hospitalized player id ' + playerId + ':', error);
                            }
                        }
                    }
                    
                    targets[targets.length] = target;
                } catch (error) {
                    console.error('Warbase: Error parsing data for player id ' + playerId + ':', error);
                }
            });
            
            return targets;
        };
        
        
        // Updates the displayed warbase based on a response from the server.
        // @param response Array a list of factions with their members
        // @param conventionalWarNode jQuery the "respect wars" parent node
        // @param factionIdsToUpdate Array a list of enemy faction ids whose display is to be updated by this function; ids not
        //   in the list will not be updated; a null list means the warbase will be replaced by all factions in the response
        var UpdateWarbaseFromServerResponse = function(response, conventionalWarNode, factionIdsToUpdate = null) {
            var warbase = new Warbase();
            
            $.each(response, function(index, factionResponse) {
                if (factionResponse.factionId === undefined) {
                    console.error('Warbase: Could not parse faction id, skipping faction data.');
                    console.error(factionResponse);
                    return;
                }
                var factionId = factionResponse.factionId;
                if (typeof factionId === 'string') {
                    factionId = parseInt(factionId);
                }
                if (factionIdsToUpdate) {
                    // We have been given an explicit list of factions to update; only update this one if it's in that list.
                    var skipFaction = true;
                    for (var i = 0; i < factionIdsToUpdate.length && skipFaction; ++i) {
                        if (factionIdsToUpdate[i] == factionId) {
                            skipFaction = false;
                        }
                    }
                    if (skipFaction) {
                        return;
                    }
                }
                
                if (factionResponse.debug !== undefined && factionResponse.debug !== null) {
                    console.debug('Warbase: Faction id ' + factionId + ':', factionResponse.debug);
                }
                if (factionResponse.factionName === undefined) {
                    console.error('Warbase: Could not parse faction name, skipping data for faction id ' + factionId + '.');
                    console.error(factionResponse);
                    return;
                }
                var factionName = factionResponse.factionName;
                if (factionResponse.targets === undefined) {
                    console.error('Warbase: Could not parse targets, skipping data for faction ' + factionName + ' [' + factionId + '].');
                    console.error(factionResponse);
                    return;
                }
                
                var warId = (factionResponse.warId !== undefined && factionResponse.warId !== null ? factionResponse.warId : undefined);
                var ourRespect = (factionResponse.ourRespect !== undefined && factionResponse.ourRespect !== null ? factionResponse.ourRespect : undefined);
                var enemyRespect = (factionResponse.enemyRespect !== undefined && factionResponse.enemyRespect !== null ? factionResponse.enemyRespect : undefined);
                var ourPercentControl = (factionResponse.ourPercentControl !== undefined && factionResponse.ourPercentControl !== null ? factionResponse.ourPercentControl : undefined);
                var respectToWin = (factionResponse.respectToWin !== undefined && factionResponse.respectToWin !== null ? factionResponse.respectToWin : undefined);
                var isRankedWar = (factionResponse.isRankedWar !== undefined && factionResponse.isRankedWar !== null ? factionResponse.isRankedWar : false);
                var isBonus = (factionResponse.isBonus !== undefined && factionResponse.isBonus !== null ? factionResponse.isBonus : false);
                var isDefeated = (factionResponse.isDefeated !== undefined && factionResponse.isDefeated !== null ? factionResponse.isDefeated : false);
                
                var enemyFaction = new EnemyFaction(factionId, warId, factionName, ourRespect, enemyRespect, ourPercentControl, respectToWin, isRankedWar, isBonus, isDefeated);
                
                $.each(factionResponse.targets, function(index, targetResponse) {
                    if (targetResponse.playerId === undefined) {
                        console.error('Warbase: Could not parse player id, skipping.');
                        console.error(targetResponse);
                        return;
                    }
                    var playerId = targetResponse.playerId;
                    if (targetResponse.playerName === undefined) {
                        console.error('Warbase: Could not parse player name, skipping data for player id ' + playerId + '.');
                        console.error(targetResponse);
                        return;
                    }
                    var playerName = targetResponse.playerName;
                    
                    var level = (targetResponse.level !== undefined && targetResponse.level !== null ? targetResponse.level : undefined);
                    var statTotal = (targetResponse.statTotal !== undefined && targetResponse.statTotal !== null ? targetResponse.statTotal : undefined);
                    var xanax = (targetResponse.xanax !== undefined && targetResponse.xanax !== null ? targetResponse.xanax : undefined);
                    var refills = (targetResponse.refills !== undefined && targetResponse.refills !== null ? targetResponse.refills : undefined);
                    var onlineStatus = (targetResponse.onlineStatus !== undefined && targetResponse.onlineStatus !== null ? targetResponse.onlineStatus : undefined);
                    var attackableStatus = (targetResponse.attackableStatus !== undefined && targetResponse.attackableStatus !== null ? targetResponse.attackableStatus : undefined);
                    
                    enemyFaction.AddTarget(new Target(playerId, playerName, level, statTotal, xanax, refills, onlineStatus, attackableStatus));
                });
                
                console.debug('Warbase: ' + (factionIdsToUpdate ? 'Updating' : 'Adding') + ' faction: ' + factionName + ' [' + factionId + ']', enemyFaction);
                warbase.AddOrReplaceEnemyFaction(enemyFaction);
            });
            
            if (warbase.enemyFactions.length === 0) {
                // Just quit on no data; we might not be at war or the WB could be out of sync.
                return;
            }
            
            var filter = GetFilterFromLocalStorage();
            
            if (factionIdsToUpdate) {
                warbase.UpdateOnlyExistingFactions(filter);
                return;
            }
            
            if ($('#warbaseheader').length === 0) {
                AddWarbaseHeader(conventionalWarNode);
                AddFilterPanel(warbase, filter);
            } else {
                $('div.faction').remove();
                $('ul.member-list').remove();
            }
            
            warbase.AddWarbaseToPage(conventionalWarNode, filter, GetEnemyTagListFromLocalStorage());
            if (localStorage.warbaseIsVisible !== undefined && JSON.parse(localStorage.warbaseIsVisible) === false) {
                ToggleWarbase(false);
            }
            
            warbase.CacheInLocalStorage();
        };

        
        // Toggles the visibility of the warbase.
        // @param updateLocalStorage bool whether to update the player's preference of warbase visibility in local storage, default true
        var ToggleWarbase = function(updateLocalStorage = true) {
            if ($('#togglewarbase').text() == 'WARBASE (CLICK TO HIDE)') {
                $('#togglewarbase').text('WARBASE (CLICK TO SHOW)');
                $('#filterpanel').css('display', 'none');
                $('div.faction').css('display', 'none');
                $('ul.member-list').css('display', 'none');
                if (updateLocalStorage) {
                    localStorage.warbaseIsVisible = JSON.stringify(false);
                }
            } else {
                $('#togglewarbase').text('WARBASE (CLICK TO HIDE)');
                $('#filterpanel').css('display', 'block');
                $('div.faction').css('display', 'block');
                $('ul.member-list').css('display', 'block');
                if (updateLocalStorage) {
                    localStorage.warbaseIsVisible = JSON.stringify(true);
                }
            }
        };
        
        
        // Adds the header for the warbase to the page unless it's already there.
        var AddWarbaseHeader = function(conventionalWarNode) {
            if ($('#warbaseheader').length !== 0) {
                return;
            }
            var warbaseHeaderDiv = $('<div id="warbaseheader" class="f-msg red m-top10">');
            warbaseHeaderDiv.append('<div class="l">');
            warbaseHeaderDiv.append('<div class="r">');
            warbaseHeaderDiv.append('<div id="togglewarbase" class="title" style="cursor: pointer;">WARBASE (CLICK TO HIDE)</div>').click(ToggleWarbase);
            conventionalWarNode.find('.f-war-list').after(warbaseHeaderDiv);
        };
        
        
        // Adds the filter panel for the warbase to the page unless it's already there.
        // @param warbase Warbase the current warbase
        // @param filter WarbaseFilter the current, active warbase filter
        var AddFilterPanel = function(warbase, filter) {
            if ($('#filterpanel').length !== 0) {
                return;
            }
            
            var UpdateTargetFilter = function() {
                try {
                    var filter = GetFilterFromLocalStorage();
                    filter.showOnline = onlineFilterCheckbox[0].checked;
                    filter.showLevelHolders = levelHolderFilterCheckbox[0].checked;
                    
                    filter.hideTraveling = travelingFilterCheckbox[0].checked;
                    filter.hideFederal = federalFilterCheckbox[0].checked;
                    filter.hideHospital = hospitalFilterCheckbox[0].checked;
                    
                    if (isNaN(levelFilterTextField.val())) {
                        filter.hideLevelRange = null;
                    } else {
                        filter.hideLevelRange = parseInt(levelFilterTextField.val());
                    }
                    if (isNaN(xanaxFilterTextField.val())) {
                        filter.hideXanaxRange = null;
                    } else {
                        filter.hideXanaxRange = parseInt(xanaxFilterTextField.val());
                    }
                    if (isNaN(refillFilterTextField.val())) {
                        filter.hideRefillRange = null;
                    } else {
                        filter.hideRefillRange = parseInt(refillFilterTextField.val());
                    }
                    
                    WriteFilterToLocalStorage(filter);
                    
                    warbase.UpdateTargetDisplay(filter, GetEnemyTagListFromLocalStorage());
                } catch (error) {
                    console.error('Warbase: UpdateTargetFilter:', error);
                    AddErrorNotification('Warbase script error: ' + error);
                }
            };
            
            var UpdateOrderFilter = function() {
                try {
                    var filter = GetFilterFromLocalStorage();
                    filter.orderByBonus = bonusOrderCheckbox[0].checked;
                    
                    WriteFilterToLocalStorage(filter);
                    
                    $('div.faction').remove();
                    $('ul.member-list').remove();
                    warbase.AddWarbaseToPage($('.faction-respect-wars-wp'), filter, GetEnemyTagListFromLocalStorage());
                } catch (error) {
                    console.error('Warbase: UpdateOrderFilter:', error);
                    AddErrorNotification('Warbase script error: ' + error);
                }
            };
            
            var onlineFilterCheckbox = $('<input>', {type: 'checkbox', style: 'margin-left: 4px; vertical-align: bottom; position: relative; top: 0; *overflow: hidden;'})
                .on('change', UpdateTargetFilter);
            onlineFilterCheckbox[0].checked = filter.showOnline;
            var onlineFilterElement = $('<label>', {text: 'online'}).prepend(onlineFilterCheckbox);
            var levelHolderFilterCheckbox = $('<input>', {type: 'checkbox', style: 'margin-left: 4px; vertical-align: bottom; position: relative; top: 0; *overflow: hidden;'})
                .on('change', UpdateTargetFilter);
            levelHolderFilterCheckbox[0].checked = filter.showLevelHolders;
            var levelHolderFilterElement = $('<label>', {text: 'level holders'}).prepend(levelHolderFilterCheckbox);
            
            var travelingFilterCheckbox = $('<input>', {type: 'checkbox', style: 'margin-left: 4px; vertical-align: bottom; position: relative; top: -1px; *overflow: hidden;'})
                .on('change', UpdateTargetFilter);
            travelingFilterCheckbox[0].checked = filter.hideTraveling;
            var travelingFilterElement = $('<label>', {text: 'traveling'}).prepend(travelingFilterCheckbox);
            var federalFilterCheckbox = $('<input>', {type: 'checkbox', style: 'margin-left: 4px; vertical-align: bottom; position: relative; top: -1px; *overflow: hidden;'})
                .on('change', UpdateTargetFilter);
            federalFilterCheckbox[0].checked = filter.hideFederal;
            var federalFilterElement = $('<label>', {text: 'federal'}).prepend(federalFilterCheckbox);
            var hospitalFilterCheckbox = $('<input>', {type: 'checkbox', style: 'margin-left: 4px; vertical-align: bottom; position: relative; top: -1px; *overflow: hidden;'})
                .on('change', UpdateTargetFilter);
            hospitalFilterCheckbox[0].checked = filter.hideHospital;
            var hospitalFilterElement = $('<label>', {text: 'hospital'}).prepend(hospitalFilterCheckbox);
            
            var levelFilterTextField = $('<input>', {type: 'number', step: '5', min: '0', max: '99', style: 'width: 35px'})
                .on('change', UpdateTargetFilter);
            levelFilterTextField.val(filter.hideLevelRange);
            var levelFilterElement = $('<label>', {text: 'more than '}).append(levelFilterTextField).append(' levels above/below mine');
            var xanaxFilterTextField = $('<input>', {type: 'number', step: '100', min: '0', style: 'width: 45px'})
                .on('change', UpdateTargetFilter);
            xanaxFilterTextField.val(filter.hideXanaxRange);
            var xanaxFilterElement = $('<label>', {text: 'more than '}).append(xanaxFilterTextField).append(' xanax taken');
            var refillFilterTextField = $('<input>', {type: 'number', step: '50', min: '0', style: 'width: 45px'})
                .on('change', UpdateTargetFilter);
            refillFilterTextField.val(filter.hideRefillRange);
            var refillFilterElement = $('<label>', {text: 'more than '}).append(refillFilterTextField).append(' refills used');
            
            var bonusOrderCheckbox = $('<input>', {type: 'checkbox', style: 'margin-left: 4px; vertical-align: bottom; position: relative; top: 0; *overflow: hidden;'})
                .on('change', UpdateOrderFilter);
            bonusOrderCheckbox[0].checked = filter.orderByBonus;
            var bonusOrderElement = $('<label>', {text: 'bonus/defeated'}).prepend(bonusOrderCheckbox);
            
            var filterPanelDiv = $('<div id="filterpanel" class="bottom-round" ' +
                                   'style="padding: 10px 16px; margin-bottom: 8px; background-color: #f2f2f2;">');
            var enemiesVisibleDiv = $('<div style="padding-bottom: 6px;">');
            enemiesVisibleDiv.append('<span id="enemiesvisible">?</span>');
            enemiesVisibleDiv.append('&nbsp;out of&nbsp;');
            enemiesVisibleDiv.append('<span id="totalenemies">?</span>');
            enemiesVisibleDiv.append('&nbsp;enemies are visible;&nbsp;');
            enemiesVisibleDiv.append('<span id="enemiesokay">?</span>');
            enemiesVisibleDiv.append('&nbsp;are okay.&nbsp;');
            enemiesVisibleDiv.append('<a class="t-blue bold" style="padding-left: 10px;" href="javascript:void(0)">REFRESH WARBASE</a>')
                .click(RefreshWarbase);
            filterPanelDiv.append(enemiesVisibleDiv);
            filterPanelDiv.append('<div class="bold" style="padding-bottom: 6px;">Filter options:</div>');
            
            filterPanelDiv.append($('<div style="padding-bottom: 5px;">')
                                  .append('Always show enemies:')
                                  .append(onlineFilterElement)
                                  .append(levelHolderFilterElement));
            
            filterPanelDiv.append($('<div style="padding-bottom: 5px;">')
                                  .append('Hide enemies:')
                                  .append(travelingFilterElement).append(',&nbsp;')
                                  .append(federalFilterElement).append(',&nbsp;')
                                  .append(hospitalFilterElement).append(',&nbsp;')
                                  .append(levelFilterElement).append(',<br>&nbsp;&nbsp;&nbsp;&nbsp;')
                                  .append(xanaxFilterElement).append(',&nbsp;')
                                  .append(refillFilterElement));
            
            filterPanelDiv.append($('<div>')
                                  .append('Order by:')
                                  .append(bonusOrderElement));
            
            $('#warbaseheader').after(filterPanelDiv);
        };
        
        
        // Gets the current active warbase filter from local storage.
        var GetFilterFromLocalStorage = function() {
            var warbaseFilter = (localStorage.warbaseFilter !== undefined ? JSON.parse(localStorage.warbaseFilter) : new WarbaseFilter());
            return warbaseFilter;
        };
        
        // Writes a warbase filter to local storage.
        var WriteFilterToLocalStorage = function(filter) {
            localStorage.warbaseFilter = JSON.stringify(filter);
        };

        
        // Gets the player's (script user's) current level from the page.
        // @returns int the level of the player running the script
        var GetPlayerLevel = function() {
            return parseInt($('div.menu-info-row > div.level').first().text().trim());
        };
        
        
        // Updates the display of target statistics on the filter panel.
        // @param totalNumberOfTargets int the total number of targets in the warbase
        // @param totalNumberOfVisibleTargets int the total number of targets in the warbase that are not hidden
        // @param totalNumberOfOkayTargets int the total number of targets in the warbase with attackable status 'Okay'
        var UpdateTargetStats = function(totalNumberOfTargets, totalNumberOfVisibleTargets, totalNumberOfOkayTargets) {
            $('#enemiesvisible').text(totalNumberOfVisibleTargets);
            $('#totalenemies').text(totalNumberOfTargets);
            $('#enemiesokay').text(totalNumberOfOkayTargets);
        };
        
        
        // An individual user-defined enemy tag.
        class EnemyTag {
            // @param playerId int the id of the player this tag describes
            // @param tagText string the human-readable text of the tag
            // @param tagColor string the HTML color of the tag
            constructor(playerId, tagText, tagColor) {
                this.playerId = playerId;
                this.tagText = tagText;
                this.tagColor = tagColor;
            }
        }
        
        
        // A list of all the enemy tags.
        class EnemyTagList {
            constructor() {
                this.tags = Array();
            }
        }
        
        
        // Color strings for the various possible tags, which is also the value persisted to local storage.
        const possibleTargetColor = '#FAFAFA';
        const veryEasyTargetColor = '#BBFFBB';
        const easyTargetColor = '#55FF55';
        const mediumTargetColor = '#EEBB55';
        const hardTargetColor = '#DD8833';
        const veryHardTargetColor = '#DD3333';
        const levelHolderTargetColor = '#88AAEE';
        const fluffyTargetColor = '#FFBBBB';
        const stalemateTargetColor = '#CC6666';

        
        // Gets an EnemyTagList constructed from all tags in local storage.
        var GetEnemyTagListFromLocalStorage = function() {
            return localStorage.warbaseTags !== undefined ? JSON.parse(localStorage.warbaseTags) : new EnemyTagList();
        };

        
        // Writes an enemy tag list to local storage.
        var WriteEnemyTagListToLocalStorage = function(enemyTagList) {
            localStorage.warbaseTags = JSON.stringify(enemyTagList);
        };
        
        
        
        
        // *** Declarations complete; begin main procedure.
        
        $.ajaxSetup({ cache: false });
        
        if (window.location.search.indexOf('?step=profile&ID=') !== -1) {
            // We are on a faction profile page; send this data to the server.
            var factionData = {};
            
            var factionIdMatch = window.location.search.match(/step=profile&ID=(\d+)/);
            if (!factionIdMatch) {
                throw 'Couldn\'t find faction id in URL.';
            }
            factionData.factionId = parseInt(factionIdMatch[1]);
            
            var memberList = $('ul.member-list');
            if (memberList.length === 0) {
                throw 'Could not find faction member list.';
            }
            factionData.targets = GetReportableTargetsFromJquery(memberList);
            
            ReportDataToServerWithResponse(factionData, Array());
            
            var cachedWarbase;
            if (localStorage.warbaseCache !== undefined) {
                cachedWarbase = Object.setPrototypeOf(JSON.parse(localStorage.warbaseCache), Warbase.prototype);
                var enemyFaction = cachedWarbase.GetFactionById(factionData.factionId);
                if (!enemyFaction) {
                    console.error('Warbase: Couldn\'t find faction id ' + factionId + ' in cached data; not all warbase enhancements will be shown.');
                }
            } else {
                console.error('Warbase: Couldn\'t load cached warbase data; not all warbase enhancements will be shown.');
            }
            AddDataToReceivedFactionTargets($('ul.member-list'), enemyFaction, GetEnemyTagListFromLocalStorage(), true);

            return;
        }
        
        if (window.location.pathname.indexOf('/profiles.php') !== -1 && window.location.search.indexOf('?XID=') !== -1) {
            // We are on a player profile page; TODO: send this data to the server.
            var playerData = {};
            
            var playerIdMatch = window.location.search.match(/XID=(\d+)/);
            if (!playerIdMatch) {
                throw 'Couldn\'t find player id in URL.';
            }
            playerData.playerId = parseInt(playerIdMatch[1]);
            
            var playerProfileContainer = $('div.profile-action > div.profile-container');
            TagPlayerProfile(playerData.playerId, playerProfileContainer, GetEnemyTagListFromLocalStorage());
            
            return;
        }
        
        // Wait for incoming faction XHR data.
        $(document).ajaxSuccess(ReportIncomingFactionInfoToServer);
        // Register a listener for click events in case there are open dialogs.
        $(document).click(CloseVisibleTagMenusClickEvent);
        // Watch for the page's warbase section to appear.
        ObserveWarbaseMutation();
        
    } catch (error) {
        console.error('Warbase:', error);
        AddErrorNotification('Warbase script error: ' + error);
    }
})();