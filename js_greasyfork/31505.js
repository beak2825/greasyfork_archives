// ==UserScript==
// @name        PD WarBase Viewer
// @namespace   PD.warBaseViewer
// @author      PD adapted from script made by Vinkuun and another unauthored script
// @description Brings back the old war base layout, adds a filter to the war base, enables enemy tagging
// @include     *.torn.com/factions.php?step=your*
// @include     *.torn.com/profiles.php?XID=*
// @version     0.0.1    
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.2/moment.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31505/PD%20WarBase%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/31505/PD%20WarBase%20Viewer.meta.js
// ==/UserScript==
/* jshint -W097 */

'use strict';

/* jshint ignore:start */
this.$ = this.jQuery = jQuery.noConflict(true);
/* jshint ignore:end */

// global CSS
GM_addStyle(
  '#pd-extendedWarBasePanel { line-height: 2em }' +
  '#pd-extendedWarBasePanel label { background-color: rgba(200, 195, 195, 1); padding: 2px; border: 1px solid #fff; border-radius: 5px }' +
  '#pd-extendedWarBasePanel input { margin-right: 5px; vertical-align: text-bottom }' +
  '#pd-extendedWarBasePanel input[type="number"] { vertical-align: baseline; line-height: 1.3em }' +
  '#pd-extendedWarBasePanel { padding: 4px; }'
);

// This is a list of ids of level holders as identified by the faction.
// If the user does not have these ids marked, they will be automatically marked with the level holder tag.
var KnownLevelHolderIds = [1384349, 696112, 1024249, 420693, 691329, 1162761, 391024, 1605490, 1031839, 1505017, 580210, 249119, 937944, 847191, 
    555527, 988493, 785303, 1501204, 538063, 1933955, 1591144, 1952447, 1740814, 1757326, 45116, 1870868, 1317478, 856143, 942591, 445884, 276310,
    1485783, 38465, 335379, 1627725, 904067, 822719, 1493453, 1288299, 497961, 1908405, 1676917, 1109711, 1451724, 1538261, 1590677, 1198758, 1658953,
    1652143, 1599593, 618610, 1720019, 1419034, 1091407, 1741291, 54846, 1672880, 1708940, 311234, 375042, 1635521, 607043, 1034247, 1396556, 1500582,
    1492188, 1063831, 1644264, 1189997, 310700, 1624527, 1009332, 1581305, 1422193, 1864006, 117313, 1582143, 1580396, 1263800, 267061, 1082225, 1822798,
    1588299, 1328948, 1045233, 628476, 1625417, 433474, 130150, 1552953, 684633, 67223, 1635779, 434912, 871983, 944571, 1286893, 1529502, 1263853,
    1039230, 1279274, 1605644, 1315155, 1296148, 1690582, 1601169, 1673532, 369475, 348794, 691328, 1280063, 1691188, 1480056, 1321910, 351290, 379891,
    1210155, 420044, 1001844, 276803, 1082621, 698958, 1369190, 1194812];


// Whether or not enemy xanax usage data has been loaded.
var xanaxLoaded = false;
// Whether or not enemy refill usage data has been loaded.
var refillsLoaded = false;

var $MAIN = $('#faction-main');

// ============================================================================
// --- FEATURE: War Base Layout
// ============================================================================
function enableWarBaseLayout() {
  var fragment = document.createDocumentFragment();

  $('.f-war-list .desc-wrap').each(function() {
    var row = document.createElement('li');
    row.classList.add('descriptions');

    $(this.children).each(function() {
      row.appendChild(this);
    });

    fragment.appendChild(row);
  });

  $('.f-war-list li:not(.clear)').remove();

  $('.f-war-list').prepend(fragment);

  $('.f-msg').css('margin-bottom', '10px');

  GM_addStyle(
    '.f-war-list .descriptions { margin-top: 10px !important; border-radius: 5px !important }' +
    '.f-war-list .descriptions .status-desc { border-radius: 5px 5px 0 0 !important }'
  );
}

// ============================================================================
// --- FEATURE: War base filter
// ============================================================================
var warBaseFilter;
var $numEnemiesInWarbaseElement;
var $numEnemiesVisibleElement;
var $numEnemiesVisibleAndOkayElement;

/**
* Adds the filter panel to the war base extended main panel
* @param {jQuery-Object} $panel Main panel
*/
function addWarBaseFilter($panel) {
    var $warList = $('.f-war-list');
    var $statusElement = $('<p>', {text: 'The war base is currently hidden. Click the bar above to show it.', style: 'text-align: center; margin-top: 4px; font-weight: bold'}).hide();

    $('.f-msg')
        .css('cursor', 'pointer')
        .on('click', function() {
        if (shouldHideWarBase()) {
            localStorage.pdHideWarBase = false;
            $warList.show();
            $statusElement.hide();
        } else {
            localStorage.pdHideWarBase = true;
            $warList.hide();
            $statusElement.show();
        }})
        .attr('title', 'Click to show/hide the war base')
        .after($statusElement);

    if (shouldHideWarBase()) {
        $warList.hide();
        $statusElement.show();
    }

    // load saved war base filter settings
    warBaseFilter = JSON.parse(localStorage.pdWarBaseFilter || '{}');
    warBaseFilter.status = warBaseFilter.status || {};
    warBaseFilter.ordering = warBaseFilter.ordering || {};

    // Default filter values.
    if (warBaseFilter.status.hospital === undefined) {
        warBaseFilter.status.hospital = 7;
    }
    if (warBaseFilter.status.level === undefined) {
        warBaseFilter.status.level = 15;
    }
    if (warBaseFilter.status.showLevelHolder === undefined) {
        warBaseFilter.status.showLevelHolder = true;
    }
    if (warBaseFilter.status.showOnline === undefined) {
        warBaseFilter.status.showOnline = false;
    }
    if (warBaseFilter.ordering.orderFactionsByType === undefined) {
        warBaseFilter.ordering.orderFactionsByType = false;
    }
    if (warBaseFilter.ordering.bonusFirst === undefined) {
        warBaseFilter.ordering.bonusFirst = false;
    }
    if (warBaseFilter.ordering.orderFactionsByEnemies === undefined) {
        warBaseFilter.ordering.orderFactionsByEnemies = false;
    }

    $numEnemiesInWarbaseElement = $('<span>', {id: 'numWarbaseEnemies', text: 0});
    $numEnemiesVisibleElement = $('<span>', {id: 'numVisibleEnemies', text: 0});
    $numEnemiesVisibleAndOkayElement = $('<span>', {id: 'numOkayEnemies', text: 0});

    addFilterPanel($panel);
}

// returns true if the layout is enabled, false if not
function shouldHideWarBase() {
    return JSON.parse(localStorage.pdHideWarBase || 'false');
}


/**
* Applies the filter to the war base as set by the player.
*/
function applyFilter() {
    var countFiltered = 0;
    var playerLevel = parseInt($('div.menu-info-row > div.level').first().text().trim());
    var $factionList = $('ul.f-war-list > li.descriptions');
    var $enemyList = $('ul.member-list > li');
    

    $factionList.each(function(index, node) {
        var $factionEnemyList = $(node).find('ul.member-list > li');
        var $factionEnemyStatusIcons = $(node).find('ul.singleicon > .iconShow');
        var $factionEnemyStatusTexts = $(node).find('div.status');
        var $factionEnemyDifficultySelects = $(node).find('.pd-enemeyDifficulty');
        var $factionEnemyUserLinks = $(node).find('.user.name');  // NOTE: There are TWO of these per enemy.
//        var $enemyXanaxTaken = $('.xanaxTaken');
//        var $enemyRefillsUsed = $('.refillsUsed');
        var factionCountFiltered = 0;
        for (var i = 0; i < $factionEnemyList.length; ++i) {
            if (FilterIndividualEnemy(playerLevel, $factionEnemyList.eq(i), $factionEnemyStatusIcons.eq(i), $factionEnemyStatusTexts.eq(i).text().trim(),
                                      $factionEnemyDifficultySelects.eq(i), $factionEnemyUserLinks.eq(2*i), /*$enemyXanaxTaken.eq(i)*/ 0, /*$enemyRefillsUsed.eq(i)*/ 0)) {
                ++factionCountFiltered;
            }
        }
//        console.debug('Faction has ' + $factionEnemyList.length + " members.\n  " + factionCountFiltered + ' were filtered.');
        if (factionCountFiltered == $factionEnemyList.length) {
            $(node).attr('isempty', '');
        } else {
            $(node).removeAttr('isempty');
        }
        countFiltered += factionCountFiltered;
    });
    /*
    for (var i = 0; i < $enemyList.length; ++i) {
        if (FilterIndividualEnemy(playerLevel, $enemyList.eq(i), $enemyStatusIcons.eq(i), $enemyStatusTexts.eq(i).text().trim(),
            $enemyDifficultySelects.eq(i), $enemyUserLinks.eq(2*i), 0, 0)) {
            ++countFiltered;
        }
    }
*/

    // update the number of hidden members
    var numEnemiesInWarbase = $enemyList.length;
    $('#numWarbaseEnemies').text(numEnemiesInWarbase);
    $('#numVisibleEnemies').text(numEnemiesInWarbase - countFiltered);
    // "Okay" has been replaced by "Attack", and there is no "Attack" if not okay anymore,
    // so count the number of players with "Attack" as an option and that's the number that are okay.
    var numEnemiesVisibleAndOkay = $enemyList.find('a:contains("Attack"):visible').length;
    $('#numOkayEnemies').text(numEnemiesVisibleAndOkay);
}


/**
 * Filters an individual enemy from the warbase if they meet the requested criteria. If
 * the enemy is filtered, their display element will be hidden. If not, it will be explicitly shown.
 *
 * @param {int} playerLevel the integer value of the user's level
 * @param {jQuery-Object} $enemyElement the top-level element for a particular enemy
 * @param {jQuery-Object} $enemyStatusIcon the main status icon for the particular enemy
 * @param {jQuery-Object} enemyStatusText the text of the particular enemy's status
 * @param {jQuery-Object} $enemyDifficultySelect the select element for the particular enemy
 * @param {jQuery-Object} $enemyUserLink the link pointing to the profile of the particular enemy
 * @param {jQuery-Object} $enemyXanaxTaken the element with the number of Xanax taken by the particular enemy
 * @param {jQuery-Object} $enemyRefillsUsed the element with the number of refills used by the particular enemy
 * @returns true if the enemy was filtered, false if they were not
 **/
function FilterIndividualEnemy(playerLevel, $enemyElement, $enemyStatusIcon, enemyStatusText, $enemyDifficultySelect, $enemyUserLink,
        $enemyXanaxTaken, $enemyRefillsUsed) {
    // Check if we should always show online players and if this player is online.
    if (warBaseFilter.status.hideOnline) {
        var playerStatusIconTitle = $enemyStatusIcon.attr('title');
        if (playerStatusIconTitle && playerStatusIconTitle.match(/Online/) !== null) {
            $enemyElement.hide();
            return false;
        }
    }
    
    // Check if we should always show idle players and if this player is idle.
    if (warBaseFilter.status.hideIdle) {
        var playerStatusIconTitle = $enemyStatusIcon.attr('title');
        if (playerStatusIconTitle && playerStatusIconTitle.match(/Idle/) !== null) {
            $enemyElement.hide();
            return false;
        }
    }
    // Check if this player is in a bonus faction and, if so, if they are okay and thus should always be shown.
    // Note that status of "Okay" has already been replaced by "Attack".
    // This is not currently something that the player is allowed to disable.
    if ($enemyElement.attr('isbonus') !== undefined && enemyStatusText == "Attack") {
        $enemyElement.show();
        return false;
    }

    // Filter traveling players.
    if (warBaseFilter.status.traveling && enemyStatusText == "Traveling") {
        $enemyElement.hide();
        return true;
    }

    // Filter players in fed.
    if (warBaseFilter.status.federal && enemyStatusText == "Federal") {
        $enemyElement.hide();
        return true;
    }
    
    // Filter players in hospital over the preset time.
    if (warBaseFilter.status.hospital !== null) {
        var $hospitalIcon = $enemyElement.find('.member-icons #icon15');
        if ($hospitalIcon.length > 0 && remainingHospitalTime($hospitalIcon.attr('title')) > warBaseFilter.status.hospital) {
            $enemyElement.hide();
            return true;
        }
    }

    // Filter players by level.
    if (warBaseFilter.status.level !== null && warBaseFilter.status.level !== 0) {
        // Check if we should always show level holders and if this player is one of them.
        // "Always showing level holders" specifically means not to filter level holders with the level filter only.
        if (warBaseFilter.status.showLevelHolder) {
            if ($enemyDifficultySelect.length > 0 && $enemyDifficultySelect.val() == "holders") {
                $enemyElement.hide();
                return true;
            }
            // The player might be a faction-identified level holder, so check that as well.
            var enemyLinkHref = $enemyUserLink.attr('href');
            if (enemyLinkHref) {
                var enemyId = parseInt(enemyLinkHref.match(/XID=(\d+)/)[1]);
                var isKnownLevelHolder = KnownLevelHolderIds.indexOf(enemyId) > -1;
                if ($enemyDifficultySelect.val() === 'tbd' && isKnownLevelHolder) {
                    $enemyElement.hide();
                    return true;
                }
            }
        }

        var enemyLevelMatch = $enemyElement.text().match(/Level:\s+(\d+)/);
        if (!enemyLevelMatch) {
            console.warn('Enemy level match failed!');
        } else if ($enemyDifficultySelect.val() != "fluffy") {
            // Don't hide fluffy (weak high-level) targets.
            var enemyLevel = parseInt(enemyLevelMatch[1]);
            if (enemyLevel > playerLevel + warBaseFilter.status.level || enemyLevel < playerLevel - warBaseFilter.status.level) {
                $enemyElement.hide();
                return true;
            }
        }
    }

    // Filter players by xanax taken.
    if (xanaxLoaded && warBaseFilter.status.xanax !== null && warBaseFilter.status.xanax !== 0) {
        // Only apply the xanax filter if the xanax taken field has been created and is populated.
        var xanaxTakenSplitText = $enemyXanaxTaken.text().split(':');
        if (xanaxTakenSplitText.length > 1) {
            var enemyXanaxUsage = parseInt(xanaxTakenSplitText[1].trim().replace(/[ ,\.]/g, ''));
            if (enemyXanaxUsage > warBaseFilter.status.xanax) {
                $enemyElement.hide();
                return true;
            }
        }
    }

    // Filter players by refills used.
    if (refillsLoaded && warBaseFilter.status.refills !== null && warBaseFilter.status.refills !== 0) {
        // Only apply the refill filter if the refills used field has been created and is populated.
        var refillsUsedSplitText = $enemyRefillsUsed.text().split(':');
        if (refillsUsedSplitText.length > 1) {
            var enemyRefillUsage = parseInt(refillsUsedSplitText[1].trim().replace(/[ ,\.]/g, ''));
            if (enemyRefillUsage > warBaseFilter.status.refills) {
                $enemyElement.hide();
                return true;
            }
        }
    }

    $enemyElement.show();
    return false;
}


/**
* Applies ordering to the war base as set by the player.
*/
function applyOrdering() {
    var warList = $('ul.f-war-list');
    if (applyOrdering.originalList === undefined) {
        applyOrdering.originalList = Array();
        warList.children().each(function(index, node) {
            if (!$(node).hasClass('descriptions')) {
                // Not a faction element.
                return;
            }
            applyOrdering.originalList.push(node);
        });
    }

    var listToApply = applyOrdering.originalList;
    
    if (warBaseFilter.ordering.orderFactionsByType === true) {
        // Rearrange all factions: regular filler first, bonus second, and defeated last.
        var fillerFactions = Array();
        var bonusFactions = Array();
        var defeatedFactions = Array();
        
        listToApply.forEach(function(node, index) {
            if (node.hasAttribute('isbonus') && !node.hasAttribute('isdefeated')) {
                // Order bonus factions by % control, lowest first.
                var thisFactionPercentControl = parseFloat($(node).find('div.progress-cont.pos').attr('title').slice(0, -1));
                var isPlaced = false;
                for (var i = 0; i < bonusFactions.length && !isPlaced; ++i) {
                    var orderedFactionPercentControl = parseFloat($(bonusFactions[i]).find('div.progress-cont.pos').attr('title').slice(0, -1));
                    if (thisFactionPercentControl < orderedFactionPercentControl) {
                        bonusFactions.splice(i, 0, node);
                        isPlaced = true;
                    }
                }
                if (!isPlaced) {
                    bonusFactions.push(node);
                }
            } else if (node.hasAttribute('isdefeated')) {
                defeatedFactions.push(node);
            } else {
                fillerFactions.push(node);
            }
        });
        listToApply = Array();
        
        if (warBaseFilter.ordering.bonusFirst === true) {
            bonusFactions.forEach(function(node, index) {
                listToApply.push(node);
            });
            fillerFactions.forEach(function(node, index) {
                listToApply.push(node);
            });
        } else {
            fillerFactions.forEach(function(node, index) {
                listToApply.push(node);
            });
            bonusFactions.forEach(function(node, index) {
                listToApply.push(node);
            });
        }
        defeatedFactions.forEach(function(node, index) {
            listToApply.push(node);
        });
    }
    
    if (warBaseFilter.ordering.orderFactionsByEnemies === true) {
        // Rearrange all factions: those with targets first and those without last.
        // Factions are already sorted by bonus vs filler, if applicable.
        var nonEmptyFactions = Array();
        var emptyFactions = Array();
        
        listToApply.forEach(function(node, index) {
            if (node.hasAttribute('isempty')) {
                emptyFactions.push(node);
            } else {
                nonEmptyFactions.push(node);
            }
        });
        listToApply = Array();
        
        nonEmptyFactions.forEach(function(node, index) {
            listToApply.push(node);
        });
        emptyFactions.forEach(function(node, index) {
            listToApply.push(node);
        });
    }   
    
    warList.children().each(function(index, node) {
        if (!$(node).hasClass('descriptions')) {
            // Not a faction element.
            return;
        }
        $(node).detach();
    });

    listToApply.forEach(function(node, index) {
        warList.children().last().before($(node));
    });
}


/**
* Panel to configure the filter - will be added to the main panel
*/
function addFilterPanel($panel) {
    $panel.append($numEnemiesVisibleElement).append(' out of ').append($numEnemiesInWarbaseElement)
        .append(' enemies visible; ').append($numEnemiesVisibleAndOkayElement).append(' have status "Okay."');
    $panel.append($('<br>')).append('Hide enemies: ');

    // status: traveling filter
    var $travelingCheckbox = $('<input>', {type: 'checkbox'}).on('change', function() {
        reapplyFilter({status: {traveling: this.checked}});
    });
    var $travelingElement = $('<label>', {text: 'Traveling'}).prepend($travelingCheckbox);
    $panel.append($travelingElement).append(', ');

    // status: federal filter
    var $federalCheckbox = $('<input>', {type: 'checkbox'}).on('change', function() {
        reapplyFilter({status: {federal: this.checked}});
    });
    var $federalElement = $('<label>', {text: 'Federal Prison'}).prepend($federalCheckbox);
    $panel.append($federalElement).append(', ');

    // status: hide online filter
    var $onlineCheckbox = $('<input>', {type: 'checkbox'}).on('change', function() {
        reapplyFilter({status: {hideOnline: this.checked}});
    });
    var $onlineElement = $('<label>', {text: 'Online'}).prepend($onlineCheckbox);
    $panel.append($onlineElement).append(', ');
    
    // status: hide idle filter
    var $idleCheckbox = $('<input>', {type: 'checkbox'}).on('change', function() {
        reapplyFilter({status: {hideIdle: this.checked}});
    });
    var $idleElement = $('<label>', {text: 'Idle'}).prepend($idleCheckbox);
    $panel.append($idleElement).append(', ');
    
    // status: hospital filter
    var $hospitalTextfield = $('<input>', {type: 'number', style: 'width: 40px'}).on('change', function() {
        if (isNaN(this.value)) {
            reapplyFilter({status: {hospital: null}});
        } else {
            reapplyFilter({status: {hospital: parseInt(this.value, 10)}});
        }
    });
    var $hospitalElement = $('<label>', {text: 'In Hospital For More Than '})
        .append($hospitalTextfield).append('minutes');
    $panel.append($hospitalElement);

/*
    $panel.append($('<br>'));
    
    // status: xanax taken
    var $xanaxTextfield = $('<input>', {type: 'number', step: '100', style: 'width: 45px'}).on('change', function() {
        if (isNaN(this.value)) {
            reapplyFilter({status: {xanax: null}});
        } else {
            reapplyFilter({status: {xanax: parseInt(this.value, 10)}});
        }
    });
    var $xanaxElement = $('<label>', {text: 'more than '}).css('margin-left', '16px')
    .append($xanaxTextfield).append('xanax taken');
    $panel.append($xanaxElement);

    // status: energy refills used
    var $refillsTextfield = $('<input>', {type: 'number', step: '50', style: 'width: 45px'}).on('change', function() {
        if (isNaN(this.value)) {
            reapplyFilter({status: {refills: null}});
        } else {
            reapplyFilter({status: {refills: parseInt(this.value, 10)}});
        }
    });
    var $refillsElement = $('<label>', {text: 'more than '})
    .append($refillsTextfield).append('energy refills used');
    $panel.append($refillsElement);
*/
    $panel.append($('<br>')).append('Filter Levels: ');

    // status: show level holders
    var $levelHolderCheckbox = $('<input>', {type: 'checkbox'}).on('change', function() {
        reapplyFilter({status: {showLevelHolder: this.checked}});
    });
    var $levelHolderElement = $('<label>', {text: 'Hide Level Holders'}).prepend($levelHolderCheckbox);
    $panel.append($levelHolderElement).append(', ');

    // status: level filter
    var $levelTextfield = $('<input>', {type: 'number', step: '5', style: 'width: 40px'}).on('change', function() {
        if (isNaN(this.value)) {
            reapplyFilter({status: {level: null}});
        } else {
            reapplyFilter({status: {level: parseInt(this.value, 100)}});
        }
    });
    
    var $levelElement = $('<label>', {text: 'More Than '})
    .append($levelTextfield).append('Levels Above/Below Mine');
    $panel.append($levelElement);
    // Reorder warbase for target selection.
    $panel.append($('<br>')).append('Arrange warbase: ');
    
    var orderFactionsByTypeCheckbox = $('<input>', {type: 'checkbox'}).on('change', function() {
        reapplyFactionOrdering({ordering: {orderFactionsByType: this.checked}});
    });
    var orderFactionsByTypeElement = $('<label>', {text: 'Reorder Bonus/Defeated Factions'}).prepend(orderFactionsByTypeCheckbox);
    $panel.append(orderFactionsByTypeElement).append(', ');
    
    var bonusFirstCheckbox = $('<input>', {type: 'checkbox'}).on('change', function() {
        reapplyFactionOrdering({ordering: {bonusFirst: this.checked}});
    });
    var bonusFirstElement = $('<label>', {text: 'Bonus First'}).prepend(bonusFirstCheckbox);
    $panel.append(bonusFirstElement).append(', ');
    
    var orderFactionsByEnemiesCheckbox = $('<input>', {type: 'checkbox'}).on('change', function() {
        reapplyFactionOrdering({ordering: {orderFactionsByEnemies: this.checked}});
    });
    var orderFactionsByEnemiesElement = $('<label>', {text: 'Reorder Empty Factions'}).prepend(orderFactionsByEnemiesCheckbox);
    $panel.append(orderFactionsByEnemiesElement);
    


    // set the states of the elements according to the saved filter
    
    // Checkboxes
    $travelingCheckbox[0].checked = warBaseFilter.status.traveling || false;
//    $okayCheckbox[0].checked = warBaseFilter.status.okay || false;
//    $offlineCheckbox[0].checked = warBaseFilter.status.offline || false;
    $federalCheckbox[0].checked = warBaseFilter.status.federal || false;
    $levelHolderCheckbox[0].checked = warBaseFilter.status.showLevelHolder || false;
    $onlineCheckbox[0].checked = warBaseFilter.status.showOnline || false;
    orderFactionsByTypeCheckbox[0].checked = warBaseFilter.ordering.orderFactionsByType || false;
    bonusFirstCheckbox[0].checked = warBaseFilter.ordering.bonusFirst || false;
    orderFactionsByEnemiesCheckbox[0].checked = warBaseFilter.ordering.orderFactionsByEnemies || false;

    // Numerical elements.
    if (warBaseFilter.status.hospital !== null) {
        $hospitalTextfield.val(warBaseFilter.status.hospital);
    } else {
        $hospitalTextfield.val('');
    }
    if (warBaseFilter.status.level !== null) {
        $levelTextfield.val(warBaseFilter.status.level);
    } else {
        $levelTextfield.val('');
    }
    /*
    if (warBaseFilter.status.xanax !== null) {
        $xanaxTextfield.val(warBaseFilter.status.xanax);
    } else {
        $xanaxTextfield.val('');
    }
    if (warBaseFilter.status.refills !== null) {
        $refillsTextfield.val(warBaseFilter.status.refills);
    } else {
        $refillsTextfield.val('');
    }
    */
}

/**
* Reapplies the war base filter - current settings will be merged with the new filter settings
* @param  {Object} newFilter new filter settings
*/
function reapplyFilter(newFilter) {
    $.extend(true, warBaseFilter, newFilter);

    localStorage.pdWarBaseFilter = JSON.stringify(warBaseFilter);

    applyFilter(warBaseFilter);
    reapplyFactionOrdering();  // This affects faction ordering as well.
}


/**
* Reapplies the war base filter - current settings will be merged with the new filter settings
* @param  {Object} newFilter new filter settings
*/
function reapplyFactionOrdering(newOrdering = undefined) {
    if (newOrdering !== undefined) {
        $.extend(true, warBaseFilter, newOrdering);

        localStorage.pdWarBaseFilter = JSON.stringify(warBaseFilter);
    }

    applyOrdering(warBaseFilter);
}


/**
* Returns the remaining hospital time in minutes
*
* @param  {String} text The tooltip text of the hospital icon
* @return {Integer} time in minutes
*/
function remainingHospitalTime(text) {
    var match = text.match(/data-time='(\d+)'/);

    return match[1] / 60;
}

// ============================================================================
// --- FEATURE: Enemy tagging
// ============================================================================

var TAGS = {
  tbd: {text: 'Difficulty', color: 'inherit'},
  easy: {text: 'Easy', color:'rgba(161, 248, 161, 1)'},
  medium: {text: 'Medium', color:'rgba(231, 231, 104, 1)'},
  impossible: {text: 'Impossible', color:'rgba(242, 140, 140, 1)'},
  attemptunsure: {text: 'Attempt/Unsure', color:'rgba(181, 72, 195, 1)'},
};
var factionIdentifiedHolderTag = {
    text: 'Faction-identified holder',
    color: 'rgba(65, 105, 225, 1)'};

// The global list of enemy tags.
var enemyTags;
/**
 * Loads or reloads the list of enemy tags from localStorage.
 **/
function LoadEnemyTags() {
    enemyTags = JSON.parse(localStorage.pdEnemyTags || '{}');
}
LoadEnemyTags();


var enemyTags = JSON.parse(localStorage.pdEnemyTags || '{}');

function addEnemyTagging() {
    GM_addStyle(
        'select.pd-enemeyDifficulty { font-size: 12px; vertical-align: text-bottom }' +
        '.member-list li div.status, .member-list li div.act-cont { font-weight: bold }'
    );

    var $enemyList = $('.member-list > li');
    var $enemyUserNames = $('.user.name');  // NOTE: This has TWO entries per player.
    var $enemyIcons = $('.member-icons');
    for (var i = 0; i < $enemyList.length; ++i) {
        var enemyLinkHref = $enemyUserNames.eq(2*i).attr('href');
        if (!enemyLinkHref) {
            console.log('Couldn\'t find enemy id in list element: ' + $enemyList[i]);
            return;
        }
        var id = enemyLinkHref.match(/XID=(\d+)/)[1];

        if (enemyTags[id] && !TAGS[enemyTags[id]]) {
            // Enemy has a tag but it's not defined.
            // Presumably they used to be some form of "impossible" but should be "possible" now, so mark them as such.
            enemyTags[id] = 'possible';
        }

        $enemyIcons.eq(i).prepend(createDropdown($enemyList.eq(i), id));
    }
}
function createDropdown($li, id) {
    var $dropdown = $('<select>', {'class': 'pd-enemeyDifficulty'}).on('change', function() {
        // Before updating this current tag, make sure we have the most recent tags from localStorage.
        // For example, the user could have multiple tabs open and change tags in both.
        // Without reloading the tags after the first change, the second change would undo the first change.
        LoadEnemyTags();
        
        enemyTags[id] = $(this).val();

        localStorage.pdEnemyTags = JSON.stringify(enemyTags);
        localStorage.getItem('pdEnemyTags');  // Maybe needed to force persistence? http://stackoverflow.com/questions/13292744/why-isnt-localstorage-persisting-in-chrome
        
        updateColor($li, id);
    });

    var isKnownLevelHolder = KnownLevelHolderIds.indexOf(parseInt(id)) > -1;
    $.each(TAGS, function(key, value) {
        var displayText;
        if (key === "tbd" && isKnownLevelHolder) {
            // Only show preset level holders if the user has not overridden them with their own tag.
            displayText = factionIdentifiedHolderTag.text;
        } else {
            displayText = value.text;
        }
        var $el = $('<option>', {value: key, text: displayText});

        if (enemyTags[id] && key === enemyTags[id]) {
            $el.attr('selected', 'selected');
        }

        $dropdown.append($el);
    });

    updateColor($li, id);

  return $dropdown;
}

function updateColor($li, id) {
    var isKnownLevelHolder = KnownLevelHolderIds.indexOf(parseInt(id)) > -1;
    if (isKnownLevelHolder && (!enemyTags[id] || enemyTags[id] === 'tbd')) {
        $li.css('background-color', factionIdentifiedHolderTag.color);
    } else if (enemyTags[id] && TAGS[enemyTags[id]]) {
        $li.css('background-color', TAGS[enemyTags[id]].color);
    }
}

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
  var $warBaseExtendedPanel = $('#pd-extendedWarBasePanel');

  if ($warBaseExtendedPanel.length !== 0) {
    $warBaseExtendedPanel.empty();
  } else {
    $warBaseExtendedPanel = $('<div>', { id:'pd-extendedWarBasePanel' });
    $MAIN.before($warBaseExtendedPanel);
  }

  var $title = $('<div>', { 'class': 'title-black m-top10 title-toggle tablet active top-round', text: 'War Base Viewer' });
  $MAIN.before($title);

  var $panel = $('<div>', { 'class': 'cont-gray10 bottom-round cont-toggle' });
  $MAIN.before($panel);

  $warBaseExtendedPanel.append($title).append($panel);

  enableWarBaseLayout();
  addWarBaseFilter($panel);
  addEnemyTagging();

  addUrlChangeCallback($warBaseExtendedPanel);
}

function initWarBase() {
  try {
    // observer used to apply the filter after the war base was loaded via ajax
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // The main content is being added to the div
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].className === 'faction-respect-wars-wp') {
            init();
            break;
          }
        }
      });
    });

    // start listening for changes
    var observerTarget = $MAIN[0];
    var observerConfig = { attributes: false, childList: true, characterData: false };
    observer.observe(observerTarget, observerConfig);
  } catch (err) {
    console.log(err);
  }
}

function initProfileTargetIndicator() {
  var userId = location.search.split('=')[1];

  var attackButton = $('li.action-icon-attack a');

  if (enemyTags[userId]) {
    attackButton.css({
      'background-color': TAGS[enemyTags[userId]].color || 'rgb(132, 129, 129)',
      'border-radius': '5px'
    });

    attackButton.attr('title', 'Difficulty: ' + enemyTags[userId]);
  }
}

if (location.href.indexOf('torn.com/profiles.php?XID=') !== -1) {
  initProfileTargetIndicator();
} else if (location.href.indexOf('torn.com/factions.php') !== -1) {
  initWarBase();
}


/**
* Shows/Hides the control panel according to the current tab
* @param {jQuery-Object} $element control panel
*/
function addUrlChangeCallback($element) {
    var urlChangeCallback = function () {
        if (window.location.hash.match('#/tab=main') || window.location.hash === '') {
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
    console.debug('Running init..');
    var $warBaseExtendedPanel = $('#pd-extendedWarBasePanel');

    if ($warBaseExtendedPanel.length !== 0) {
        $warBaseExtendedPanel.empty();
    } else {
        $warBaseExtendedPanel = $('<div>', { id:'pd-extendedWarBasePanel' });
        $MAIN.before($warBaseExtendedPanel);
    }

    var $title = $('<div>', { 'class': 'title-black m-top10 title-toggle tablet active top-round', text: 'War Base Viewer' });
    $MAIN.before($title);

    var $panel = $('<div>', { 'class': 'cont-gray10 bottom-round cont-toggle' });
    $MAIN.before($panel);

    $warBaseExtendedPanel.append($title).append($panel);
    console.debug('Panel created.');

    var startTime = new Date().getTime();
    enableWarBaseLayout();
    console.log('enableWarBaseLayout() took ' + ((new Date().getTime() - startTime) / 1000) + ' seconds to complete.');
    
    startTime = new Date().getTime();
    HighlightFactions();
    console.log('HighlightFactions() took ' + ((new Date().getTime() - startTime) / 1000) + ' seconds to complete.');
    
    startTime = new Date().getTime();
    addWarBaseFilter($panel);
    console.log('addWarBaseFilter() took ' + ((new Date().getTime() - startTime) / 1000) + ' seconds to complete.');
    
    startTime = new Date().getTime();
    addEnemyTagging();
    console.log('addEnemyTagging() took ' + ((new Date().getTime() - startTime) / 1000) + ' seconds to complete.');
    
    startTime = new Date().getTime();
    applyFilter();  // This has a dependency on enemy tagging and so can't happen until afterwards.
    console.log('applyFilter() took ' + ((new Date().getTime() - startTime) / 1000) + ' seconds to complete.');

    startTime = new Date().getTime();
    applyOrdering();  // This has a dependency on faction highlighting and can't happen until afterwards.
    console.log('applyOrdering() took ' + ((new Date().getTime() - startTime) / 1000) + ' seconds to complete.');

    addUrlChangeCallback($warBaseExtendedPanel);
}

function initWarBase() {
    try {
        var $playerData = $('#icon9'); if (!$playerData.attr('title').match('Relentless') && !$playerData.attr('title').match('Unrelenting')) { return; }
        // observer used to apply the filter after the war base was loaded via ajax
        var observer = new MutationObserver(function(mutations) {
            console.debug('Faction page has mutated.');
            var $warList = $('#faction-main > div > ul.f-war-list');
            if ($warList.length > 0) {
                if ($warList.attr('warbaseExtendedChecked') === undefined) {
                    init();
                    // Set an attribute flag so we only do this once for a given warlist.
                    // If the warlist is somehow replaced with another updated one without
                    // a full page refresh, we'll rerun this script as we should.
                    $warList.attr('warbaseExtendedChecked', 'true');
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

function initProfileOptimizations() {
    var userId = location.search.split('=')[1];

    var attackButton = $('li.action-icon-attack a');
    var isHolder = KnownLevelHolderIds.indexOf(parseInt(userId)) > -1;

    if (enemyTags[userId]) {
        attackButton.css({
            'background-color': TAGS[enemyTags[userId]].color || 'rgb(132, 129, 129)',
            'border-radius': '5px'
        });

        attackButton.attr('title', 'Difficulty: ' + enemyTags[userId]);
    } else if (isHolder) {
        attackButton.css({
            'background-color': factionIdentifiedHolderTag.color,
            'border-radius': '10px'
        });
        attackButton.attr('title', factionIdentifiedHolderTag.text);
    }

    $('div.profile-action > div.profile-container')
        .prepend(createDropdown($('li.action-icon-attack > a'),userId)
                .css('margin-top', '8px'));
}

if (location.href.indexOf('torn.com/profiles.php?XID=') !== -1) {
    initProfileOptimizations();
} else if (location.href.indexOf('torn.com/factions.php') !== -1) {
    initWarBase();
}


/**
 * Highlights factions in the war base.
 **/
function HighlightFactions() {
    try {
        HighlightBonusFactions();
        // Defeated faction highlights overrides bonus highlights.
        HighlightDefeatedFactions();
    } catch (error) {
        console.debug("HighlightFactions(): " + error);
    }
}


/**
 * Highlights black any factions in the war base that are linked in the faction announcement.
 * Adapted from Zanoab's War Base Faction Highlighter v0.5
 **/
function HighlightBonusFactions() {
    try {
        var $factionAnnouncement = $("#faction-main > .title-black").next("div.cont-gray10");
        if ($factionAnnouncement.length != 1) {
            console.debug("HighlightBonusFactions(): Couldn't find faction announcement, aborting.");
            return;
        }

        $('.f-war-list war-old > li > .status-desc > .f-right > .cont > .bold > a').each(function(index, node) {
            var $factionId = $(node).attr("href").match(/factions\.php\?step=profile&ID=(\d+)/);
            if ($factionId) {
                $("> .status-desc", $(node).parentsUntil(".f-war-list").last()).attr('factionid', $factionId[1]);
            }
        });

        var $bonusFactions = $factionAnnouncement.find('a[href*="factions.php?step=profile&ID="]');
        $bonusFactions.each(function(index, node) {
            var $factionId = $(node).attr("href").match(/factions\.php\?step=profile&ID=(\d+)/);
            if ($factionId) {
                console.log("Bonus faction id " + $factionId[1] + " found!");
                var bonusFactionHeader = $("[factionid='" + $factionId[1] + "'");
                bonusFactionHeader.css("background-color", "black")
                    .parent().find('ul.member-list > li').attr('isbonus', '');
                bonusFactionHeader.parent().attr('isbonus', '');
            }
        });
    } catch (error) {
        console.debug("HighlightBonusFactions(): " + error);
    }
}


/**
 * Highlights orange any factions in the war base that are already defeated.
 **/
function HighlightDefeatedFactions() {
    try {
        // Highlighted defeated factions grey.
        $('.f-war-list > li > .status-desc').each(function(index, node) {
            if ($(node).find('div[title="100%"]').length > 0) {
                $(node).css("background-color", "orange");
                $(node).parent().attr('isdefeated', '');
            }
        });
    } catch (error) {
        console.debug("HighlightDefeatedFactions(): " + error);
    }
}