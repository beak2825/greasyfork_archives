// ==UserScript==
// @name        Warbase Summary
// @namespace   warbaseSummary
// @description Calculates and displays the respect to win against each enemy faction
// @include     *.torn.com/factions.php?step=your*
// @exclude     *.torn.com/factions.php?step=your#/tab=info
// @include     *.torn.com/profiles.php?XID=*
// @version     1.2.2
// @require     http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/14136/Warbase%20Summary.user.js
// @updateURL https://update.greasyfork.org/scripts/14136/Warbase%20Summary.meta.js
// ==/UserScript==

'use strict';

this.$ = this.jQuery = jQuery.noConflict(true);

// global CSS
GM_addStyle(
  '#warBaseRespectPanel { line-height: 2em }' +
  '#warBaseRespectPanel { padding: 4px; }'
);

var $MAIN = $('#faction-main');

// ============================================================================
// --- MAIN
// ============================================================================

/**
 * Shows/Hides the control panel according to the current tab
 * @param {jQuery-Object} $element control panel
 */
function addUrlChangeCallback($element) {
  var urlChangeCallback = function () {
    if (window.location.hash === '#/tab=main' || window.location.hash === '') {
      $element.show();
    } else {
      $element.hide();
    }
  };

  // call it one time to show/hide the panel after the page has been loaded
  urlChangeCallback();

  // listen to a hash change
  window.onhashchange = urlChangeCallback;
}

/**
 * Initialises the script's features
 */
function init() {
    var $warBaseRespectPanel = $('#warBaseRespectPanel');

    if (GetEnemyFactionListElements().length == 0) {
        $warBaseRespectPanel.empty();
        $warBaseRespectPanel.hide();
        console.log('No enemy factions in warbase; no warbase summary will be displayed.');
        return;
    }
    
    if ($warBaseRespectPanel.length !== 0) {
        $warBaseRespectPanel.empty();
    } else {
        $warBaseRespectPanel = $('<div>', { id:'warBaseRespectPanel' });
        $MAIN.before($warBaseRespectPanel);
    }

    var $title = $('<div>', { 'class': 'title-black m-top10 title-toggle tablet active top-round', text: 'Warbase Summary' });
    $MAIN.before($title);

    var $panel = $('<div>', { 'class': 'cont-gray10 bottom-round cont-toggle' });
    $MAIN.before($panel);

    $warBaseRespectPanel.append($title).append($panel);

    showRespectNeededToWin($panel);

    addUrlChangeCallback($warBaseRespectPanel);
}

function initWarBase() {
    try {
        // observer used to apply the filter after the war base was loaded via ajax
        var observer = new MutationObserver(function(mutations) {
            var $warList = $('#faction-main > div > ul.f-war-list');
            if ($warList.length > 0) {
                if ($warList.attr('warbaseSummaryChecked') === undefined) {
                    init();
                    // Set an attribute flag so we only do this once for a given warlist.
                    // If the warlist is somehow replaced with another updated one without
                    // a full page refresh, we'll rerun this script as we should.
                    $warList.attr('warbaseSummaryChecked', 'true');
                }
            }
        });

        // start listening for changes
        var observerTarget = $MAIN[0];
        var observerConfig = { attributes: false, childList: true, characterData: false };
        observer.observe(observerTarget, observerConfig);
    } catch (err) {
        console.log(err);
    }
}

initWarBase();


function GetEnemyFactionListElements() {
    return $('ul.f-war-list > li:not(.clear)');
}


/**
 * Calculates and displays the respect needed for the user's faction to win.
 */
function showRespectNeededToWin($panel) {
    var bonusFactionList = GetBonusFactions();
    
    var tableString = '<table style="width: 100%;"><col width="50%"><col width="50%">'
    var i = 0;
    var $enemyFactionListElements = GetEnemyFactionListElements();
    $enemyFactionListElements.each(function() {
        if ($(this).hasClass('inactive')) {
            return;
        }
        
        var $opponentFactionLink = $(this).find('a.t-blue.h');
        var factionId = null;
        var factionIdMatch = $opponentFactionLink.attr("href").match(/factions\.php\?step=profile&ID=(\d+)/);
        if (factionIdMatch) {
            factionId = factionIdMatch[1];
        }
        var opponentFactionName = $opponentFactionLink.first().text();
        
        if (i % 2 == 0) {
            tableString = tableString + '<tr>';
        }
        
        var $factionRespectDiv = $(this).find('div.respect');
        var $factionProgressDiv = $(this).find('div.f-progress');
        var userFactionRespect = parseInt($factionRespectDiv.children().first().text().split(' ')[0].replace(/,/g, ''));
        var opponentFactionRespect = parseInt($factionRespectDiv.children().last().text().split(' ')[0].replace(/,/g, ''));      
        var factionPercentControl = parseFloat($factionProgressDiv.find('.wai').text().split('%')[0]) / 100;
        
        var respectNeededToWin = 0;
        if (factionPercentControl >= 0) {
            if (factionPercentControl < 0.5) {
                respectNeededToWin = Math.ceil((userFactionRespect - opponentFactionRespect) / (2 * (factionPercentControl - 0.5))
                    + (opponentFactionRespect - userFactionRespect));
            } else {
                respectNeededToWin = Math.ceil((userFactionRespect - opponentFactionRespect) / (2 * (factionPercentControl - 0.5))
                    - (userFactionRespect - opponentFactionRespect));
            }
        }

        var $factionMemberList = $(this).find('.member-list > li');
        var factionLevelSum = 0;
        var numberOfMembers = 0;
        $factionMemberList.each(function() {
            if ($(this).find('span:contains("Federal")').length > 0) {
                // Don't count players in fed.
                return;
            }
            var playerLevel = parseInt($(this).text().split(':')[1].trim());
            if (!localStorage.getItem('averageFactionMaxLevel') || playerLevel <= localStorage.getItem('averageFactionMaxLevel')) {
                // The averageFactionMaxLevel is set in the Torn Faction Average Level Calculator script.
                // Or it can be set by hand in the console, e.g.: localStorage.setItem('averageFactionMaxLevel', 100);
                factionLevelSum += playerLevel;
                ++numberOfMembers;
            }
        });
        var estimatedDaysToVictory = 0;
        if (factionLevelSum > 0) {
            estimatedDaysToVictory = (respectNeededToWin * 80) / (factionLevelSum * 24);
        }
                                      
        var paddingBottomString = '';
        if (i < $enemyFactionListElements.size() - 2 + ($enemyFactionListElements.size() % 2)) {
            paddingBottomString = ' padding-bottom: 5px;';
        }
        
        var bonusStyleString = '';
        bonusFactionList.forEach(function(bonusFactionId) {
            if (factionId == bonusFactionId) {
                bonusStyleString = ' style="background-color: yellow;"';
            }
        });
        
        var estimatedDaysToVictoryString = '';
        if (factionPercentControl <= 0) {
            estimatedDaysToVictoryString = ' (lost)';
        } if (respectNeededToWin <= 0) {
            estimatedDaysToVictoryString = ' (defeated)';
        } else if (factionLevelSum > 0) {
            estimatedDaysToVictoryString = ' (~' + (estimatedDaysToVictory).toFixed(1) + ' days)';
        } else if (numberOfMembers == 0) {
            estimatedDaysToVictoryString = ' (forever)';
        } else {
            estimatedDaysToVictoryString = ' (unknown)';
        }
        tableString = tableString + '<td class="bold" style="width: 50%;' + paddingBottomString + '"><span' + bonusStyleString + '>Respect to defeat '
            + $opponentFactionLink[0].outerHTML + ': <span class="t-green">' + respectNeededToWin + '</span>' + estimatedDaysToVictoryString + '</td>';
        console.log('Your faction respect: ' + userFactionRespect + ', for ' + opponentFactionName + ': ' + opponentFactionRespect
            + ', your percent control: ' + (factionPercentControl * 100) + '%, respect to win: ' + respectNeededToWin
            + (bonusStyleString.length > 0 ? ' (bonus)' : '') + '.');
        if (i % 2 == 1 || i == $enemyFactionListElements.size() - 1) {
            tableString = tableString + '</tr>';
        }
        ++i;
    });
    tableString = tableString + '</table>';
    $panel.append(tableString);
}


/**
 * Gets a list of bonus factions to which there are links in the faction announcement.
 * Adapted from Zanoab's War Base Faction Highlighter v0.5.
 *
 * @returns an array of faction ids that are identified as bonus factions, i.e.: there
 * is a link to them in the faction announcement
 **/
function GetBonusFactions() {
    try {
        var $factionAnnouncement = $("#faction-main > .title-black").next("div.cont-gray10");
        if ($factionAnnouncement.length != 1) {
            console.error("GetBonusFactions(): Couldn't find faction announcement, aborting.");
            return [];
        }

        var bonusFactionList = [];
        var $bonusFactions = $factionAnnouncement.find('a[href*="factions.php?step=profile&ID="]');
        $bonusFactions.each(function(index, node) {
            var factionIdMatch = $(node).attr("href").match(/factions\.php\?step=profile&ID=(\d+)/);
            if (factionIdMatch) {
                bonusFactionList.push(factionIdMatch[1]);
            }
        });

        return bonusFactionList;
    } catch (error) {
        console.error("GetBonusFactions(): " + error);
    }
    return [];
}
