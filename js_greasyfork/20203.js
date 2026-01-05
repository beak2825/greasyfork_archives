// ==UserScript==
// @name         Transformania Time Main Page Remake
// @namespace   http://steamcommunity.com/id/siggo/
// @version      1.0.6
// @description  Reshapes, restyles the Transformania Time main page a bit.
// @author       Prios
// @match        https://www.transformaniatime.com/
// @match        https://test.transformaniatime.com/
// @copyright 2019, Prios (https://openuserjs.org/users/Prios)
// @grant        none
// @license      MIT
// jshint multistr: true
// @downloadURL https://update.greasyfork.org/scripts/472513/Transformania%20Time%20Main%20Page%20Remake.user.js
// @updateURL https://update.greasyfork.org/scripts/472513/Transformania%20Time%20Main%20Page%20Remake.meta.js
// ==/UserScript==

// PROBLEM: Browser widths between 1200px and 1400px look terrible. All things considered, best to let the components on the left shrink a little.

/*
function linkifyLogEntries( i ) {

  var logActionsMatch = /\b([\wü]*)(?: '?.*')?( .*?)(?: entered from | left toward | cleansed here\.| meditated here\.| searched here\.| cast | dropped | picked up | threw a | shouted |, a | tamed | released a | consumed a )/;
  var logSubject = $( this ).text().match(logActionsMatch); // [1] is first name, [2] is anything beyond the quote-designated nickname (if any) but before the matched action

  if ( logSubject !== null ) {
        logSubject = logSubject.slice(1).join(''); // squash the two subgroups together
    // if ( ( logSubject != 'You' )) {
      $(this).wrapInner('<a style="font-weight:normal;color:inherit !important;" href="https://www.transformaniatime.com/PvP/LookAtPlayerItem?vicname=' + logSubject + '"></a>');
    // }
  }
  if ( i >= 300 ) { return false; }
}
*/

function pseudoShoutClass() { // just simulates a:hover color:black, a color:white
    var $this = $(this);
    var whichEvent = event.type;
    if (whichEvent === 'mouseover') {
        $this.attr('style', $this.attr('style').replace('white', 'black')); // Using .attr because .css doesn't support !important
    }
    else if (whichEvent === 'mouseout') {
        $this.attr('style', $this.attr('style').replace('black', 'white'));
    }
}

// constructor
// storage: key used by TfT to store the setting in localStorage; required
// span: the span tag itself as a jquery object; required
// friendlyName: string, the public 'end user' name for the setting; required
// switches: an object with 'true' and 'false' key entries, and corresponding span tag display text as paired values; optional, uses 'ON' and 'OFF' as default
function DynamicMenuItem(storage, span, friendlyName, switches) {
    this.storageKey = storage;
    this.$spanJQO = span;
    this.myFriendlyName = friendlyName;
    this.switchSettings = switches || {
        'true': 'ON',
        'false': 'OFF'
    };
    this.updateSpan = function () {
        var curSetting = localStorage.getItem(this.storageKey) || 'false';
        this.$spanJQO.html(this.switchSettings[curSetting]);
    };
    this.alertStatus = function () {
        var curSetting = localStorage.getItem(this.storageKey) || 'false';
        alert(this.myFriendlyName + ' now ' + this.switchSettings[curSetting] + '!');
    };
    this.flipSwitch = function () {
        var locStoKey = this.storageKey;
        var curSetting = localStorage.getItem(locStoKey) || 'false';
        if (curSetting === 'false') { // this setting is stored as a string in localStorage by TfT
            localStorage.setItem(locStoKey, 'true');
        }
        else {
            localStorage.setItem(locStoKey, 'false');
        }
        this.updateSpan();
        this.alertStatus(); // curSetting will be determined all over again twice but that's okay, this isn't really a super time sensitive operation
        // Plus we'll find out if .setItem did something unexpected, instead of assuming it worked exactly as desired
    };
    this.updateSpan(); // initialize
}

$(function () {

    // var startTime = Date.now();
    'use strict';

    // ACTION BUTTONS - DETACH, AND CANCEL SCRIPT IF NOT PRESENT
    var $playerActions = $('#playerActionBox').detach(); // The original action buttons
    if ($playerActions.length === 0) return; // Stop the script right here if we're not on the right kind of page

    // MAJOR COMPONENT EXTRACTION

    var $tftSite = $('body').detach(); // Detaching the page to avoid making lots of updates to the DOM itself. Counterintuitively, it's fastest and least intensive to do .finds() from here, when possible.
    var $siteTop = $tftSite.find('#siteTop'); // everything in the body except the footer
    var $siteFooter = $tftSite.find('footer'); // footer tag inside a container-class div

    // SUBCOMPONENT VARIABLES

    var $settingsWrenchListitem = $tftSite.find('.glyphicon-wrench').parent().parent();
    var $newSettingsMenu = $('<li id="settingsMenuItem" class="dropdown">\
<a id="settingsMenuAnchor" href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Settings <span class="caret"></span></a>\
<ul id="settingsMenuList" class="dropdown-menu">\
<li><a id="settingsTurnAudio" href="#">Turn Alerts are <span id="dynTurnSpan">UNKNOWN (error!)</span></a></li>\
<li><a id="settingsAttackAudio" href="#">Attack Alerts are <span id="dynAttackSpan">UNKNOWN (error!)</span></a></li>\
<li><a id="settingsMsgAudio" href="#">Message Alerts are <span id="dynMsgSpan">UNKNOWN (error!)</span></a></li>\
<li><a id="settingsPopups" href="#">Popup Notifications are <span id="dynPopSpan">UNKNOWN (error!)</span></a></li>\
<li><a id="settingsBioItem" href="/Settings/SetBio">Update Bio</a></li>\
<li><a id="settingsBlacklistItem" href="/Settings/MyBlacklistEntries">Manage Blacklist</a></li>\
<li><a id="settingsReserveNameItem" href="/PvP/ReserveName">Reserve Name</a></li>\
<li><a id="settingsNicknameItem" href="/Settings/SetNickname">Set your Nickname</a></li>\
<li><a id="settingsFullPageItem" href="/Settings/Settings">More Settings...</a></li>\
</ul>\
</li>'); // ids make finding these elements much faster

    var $specialBox = $tftSite.find('.specialBox'); // stats on people playing, boss announcements, chaos round announcement

    var $containerInner = $tftSite.find('.containerInner'); //  Area with: Avatar info, self portrait, stat bars, action buttons, movement grid, area description

    var $innerRows = $containerInner.find('.row'); // Row two starts before the movement grid, row one ends before the action buttons (action buttons are not in a row)
    var $frontOuters = $tftSite.find('.frontOuter'); // the three columns in first row, avatar info/portrait/stat bars
    var $avatarText = $tftSite.find('.avatarText'); // First column's single child, Name/Form/Covenant avatar info box
    var $actionCounts = $frontOuters.find('.avatarCount').slice(0, 2); // first and second, this is number/max of attacks and restorations

    var $allIcons = $tftSite.find('.col-sm-12').find('.icon'); // The attack, meditation, and money icons
    var $attackIcon = $tftSite.find('.icon-timesattacking');
    var $recoverIcon = $tftSite.find('.icon-cleansemeditate');
    var $moneyIcon = $tftSite.find('.icon-money');

    var $moveGrid = $tftSite.find('.tableLines'); // Movement grid
    var $moveGridCells = $moveGrid.find('td');

    var $knownSpells = $tftSite.find('.knownspells'); // spells known in this area

    var $covController = $tftSite.find('.covController'); // The sentence stating which covenant has enchanted the area

    var $activityLog = $tftSite.find('#RecentActivityLog'); // Original log of room's events, just above footer
    var $activityLogWide; // Widescreen-only clone to place on right side -- cloned later, after some alterations to original

    var $lindellaLatest = $activityLog.find('li:contains(Lindella the Soul Vendor )').first();
    var $wuffieLatest = $activityLog.find('li:contains(Wüffie the Soul Pet Vendor )').first();
    var lindellaTrail;
    var wuffieTrail;

    // UTILITY VARIABLES

    var selfLookURL = $tftSite.find('a:contains(Look at Yourself)').attr('href');

    var busStop = $tftSite.find('.bus').length; // 1/true if at a bus stop, 0/false if not
    var covSafeground = $tftSite.find('.covSafeground').length; // 1/true if a safeground, 0/false if not

    var barButtonsData = [{
        'target': 'Cleanse',
        'text': '',
        'isBlocked': false
    },
                          {
                              'target': 'Meditate',
                              'text': '',
                              'isBlocked': false
                          },
                          {
                              'target': 'Search',
                              'text': '',
                              'isBlocked': false
                          }
                         ];

    // creating objects associated with the on/off settings menu items, for setting and updating them
    var switchTurnSound = new DynamicMenuItem('play_updateSoundEnabled', $newSettingsMenu.find('#dynTurnSpan'), 'Audible Turn Alerts');
    var switchAttackSound = new DynamicMenuItem('play_AttackSoundEnabled', $newSettingsMenu.find('#dynAttackSpan'), 'Audible Attack Alerts');
    var switchMsgSound = new DynamicMenuItem('play_MessageSoundEnabled', $newSettingsMenu.find('#dynMsgSpan'), 'Audible Message Alerts');
    var switchPopups = new DynamicMenuItem('play_html5PushEnabled', $newSettingsMenu.find('#dynPopSpan'), 'HTML5 Popup Notifications');

    // -----------
    // MAIN SCRIPT

    // attaching click listeners to dynamic settings menu items
    $newSettingsMenu.find('#settingsTurnAudio').click(function () {
        switchTurnSound.flipSwitch();
        playUpdateSound = localStorage.getItem(switchTurnSound.storageKey) === 'true'; // converting the 'true' or 'false' string into a real boolean
    });
    $newSettingsMenu.find('#settingsAttackAudio').click(function () {
        switchAttackSound.flipSwitch();
        playAttackSound = localStorage.getItem(switchAttackSound.storageKey) === 'true';
    });
    $newSettingsMenu.find('#settingsMsgAudio').click(function () {
        switchMsgSound.flipSwitch();
        playMessageSound = localStorage.getItem(switchMsgSound.storageKey) === 'true';
    });
    $newSettingsMenu.find('#settingsPopups').click(function () {
        switchPopups.flipSwitch();
        notificationsEnabled = localStorage.getItem(switchPopups.storageKey) === 'true';
    });

    // Replacing the wrench with the new settings menu
    $settingsWrenchListitem.replaceWith($newSettingsMenu);

    // populate barButtonsData[0-2].text with actionButton texts
    $playerActions.find('.actionButton').each(function (i) {
        barButtonsData[i].text = $(this).text();
    });

    // Checking whether player has insufficient AP for these actions
    if ((cleanseCost > ap) || (playerMana < 3.0)) {
        barButtonsData[0].isBlocked = true;
    }
    if (meditateCost > ap) {
        barButtonsData[1].isBlocked = true;
    }
    if (searchCost > ap) {
        barButtonsData[2].isBlocked = true;
    }

    // General Activity Log alterations
    if ($lindellaLatest.length) { // if Lindella has at least one log entry
        $lindellaLatest.css({
            'color': 'cyan'
        });
        lindellaTrail = $lindellaLatest.text();
        if (lindellaTrail.includes(" left toward ")) { // check that it's a leaving entry
            lindellaTrail = lindellaTrail.match(/Lindella the Soul Vendor left toward (.*)\n/)[1]; // Now make it just the location she's leaving towards
        }
        else {
            lindellaTrail = null;
        }
        // alert('lindellaTrail is ' + lindellaTrail);
    }

    if ($wuffieLatest.length) { // if Wüffie has at least one log entry
        $wuffieLatest.css({
            'color': 'deeppink'
        });
        wuffieTrail = $wuffieLatest.text();
        if (wuffieTrail.includes(" left toward ")) { // check that it's a leaving entry
            wuffieTrail = wuffieTrail.match(/Wüffie the Soul Pet Vendor left toward (.*)\n/)[1]; // Now make it just the location she's leaving towards
        }
        else {
            wuffieTrail = null;
        }
        // alert('wuffieTrail is ' + wuffieTrail);
    }

    // $activityLog.find('li').each( linkifyLogEntries );

    $activityLogWide = $activityLog.clone();

    // Activity Log alterations (original only, post-cloning)
    $activityLog
        .addClass('hidden-lg');

    // Activity Log alterations (sidebar only)
    $activityLogWide
        .attr('id', 'RecentActivityLogSide') // giving the clone a unique ID, unfortunately this removes the id-targeted style rules and forces me to re-add them with the .css method
        .addClass('visible-lg-block') // Bootstrap class thingy that makes this only show up when the page is at least 1200px wide.
        .css({
        'background': '#C2A9AF',
        'text-align': 'justify',
        'overflow-y': 'scroll',
        'padding': 10,
        'width': '31%',
        'position': 'fixed',
        'resize': 'none',
        'height': 'initial',
        'top': 15,
        'bottom': 15
    }) // the 31% width is a kludge.
    ;

    // $specialBox
    //  .css({'font-size': 'small'})
    // ;

    $siteFooter
        .unwrap() // stripping the footer's container div, footer will be moved into another container later
    ;

    $tftSite.find('.offlinePlayersWrapperBG') // this is the inventory row
        .css({
        'border-bottom': 0,
        'background': '#ebe8e0'
    });

    /*
  $tftSite.find('.formerPlayer') // links to player profiles of ground items
    .wrap(function() {
      var $this = $(this);
      var victimName = $this.text().slice(10, -1);
      return ('<a href="https://www.transformaniatime.com/PvP/LookAtPlayerItem?vicname=' + victimName + '">');
    })
  ;
  */

    $actionCounts
        .each(function (i) {
        var $this = $(this);
        if ($this.text() === ' 3 / 3') {
            $this.css({
                'color': 'red',
                'font-weight': 'bold'
            }); // warning when tapped out on limited-per-turn actions
            if (i === 1) { // if it's the second one, i.e. recoveries. Kind of confusing and clunky.
                barButtonsData[0].isBlocked = true; // blocking both cleansing and meditation
                barButtonsData[1].isBlocked = true;
            }
        }
    })
        .css({
        'font-size': 'larger'
    });

    $allIcons
        .css({
        'font-size': 'x-large'
    })
        .removeClass();

    $attackIcon
        .html('⚔️');

    $recoverIcon
        .html('🔮');

    $moneyIcon
        .html('💰');

    // preventing style rule freakout
    $containerInner
        .css({
        'background': '#ebe8e0'
    });

    // gross rearrangement of page layout -- this unfortunately causes a marked visual 'jump' once the page is reattached
    $siteTop
        .attr('class', 'container-fluid')

        .children()

        .wrapAll('<div class="col-lg-8">') // wrap the ENTIRE existing contents in new column
        .parent() // traverse to newly-made column
        .wrap('<div class="row">') // wrap the new column in a new row
        .append($specialBox)
        .append($siteFooter) // move footer to bottom of column

        .after('<div class="col-lg-4">') // add another column to the row
        .next() // traverse to newly-made column
        .append($activityLogWide) // add side-log to the new column

    ;

    $moveGrid // direct alteration before moving to new spot
        .css({
        'width': 'inherit',
        'height': 'inherit',
        'box-shadow': '-5px 5px 5px gray',
        'table-layout': 'fixed'
    })

        .find('td')
        .css({
        'font-size': 12,
    })
        .end()

        .find('tr')
        .css({
        'height': '33%'
    })

        .find('a')
        .css({
        'display': 'table',
        'width': '100%',
        'height': '100%'
    }) // expands the anchor to fill the cell; this requires removing the display:table-cell property, which unfortunately messes up the text's vertical alignment
        .append(function () { // moves the anchor's text to a newly-created nested div element which itself has display:table-cell, fixing the vertical alignment
        var $myText = $(this).text();
        $(this).text('');
        return '<div style="display: table-cell; vertical-align: middle">' + $myText + '</div>';
    })
        .end()

        .find('div:contains(' + wuffieTrail + ')') // if wuffieTrail is null, this finds nothing and nothing happens
        .each(function () {
        // alert('text is ' + $(this).text());
        if ($(this).text() === wuffieTrail) { // ensures a precise match, not just containing
            $(this).css({
                'color': 'deeppink'
            });
            return false; // stops looping
        }
    })

        .end()

        .find('div:contains(' + lindellaTrail + ')') // if lindellaTrail is null, this finds nothing and nothing happens
    // will overwrite Wuffie's highlighting if they both coincide. A little wasteful
        .each(function () {
        // alert('text is ' + $(this).text());
        if ($(this).text() === lindellaTrail) { // ensures a precise match, not just containing
            $(this).css({
                'color': 'cyan'
            });
            return false; // stops looping
        }
    })
        .end();

    $moveGridCells // this part is a little repetitious, but not too much so, and the individual parts might change in the future

        .eq(8) // ninth cell
        .css({
        'background': '#A16969'
    })

        .append('<a href="/pvp/EnchantLocation" style="font-weight: bold; font-size: larger; position: initial; color: white !important">Enchant</a>') // I don't have a better alternative than !important here unfortunately
        .find('a') // selects just-created anchor
        .hover(pseudoShoutClass)
        .end()

        .end()

        .eq(2) // third cell
        .css({
        'background': '#A16969'
    })

        .append('<a href="/pvp/shout" class="shout" style="font-weight: bold; font-size: larger; position: initial; color: white !important">Shout</a>')
        .find('a') // selects just-created anchor
        .hover(pseudoShoutClass)
        .end()

        .end()

        .eq(6) // seventh cell
        .css({
        'background': '#A16969'
    })

        .append($knownSpells.html()) // simply sticks the html for $knownSpells into the cell unmodified
    ;

    if (busStop) {
        $moveGridCells

            .eq(0)
            .css({
            'background': '#A16969'
        })

            .append('<a href="/pvp/Bus" style="font-weight: bold; font-size: larger; position: initial; color: white !important">Take Bus</a>')
            .find('a') // selects just-created anchor
            .hover(pseudoShoutClass);
    }

    $avatarText // direct alteration before moving
        .css({
        'margin-bottom': 10,
        'display': 'inline-block'
    });

    $innerRows.eq(0) // Row with player portrait and stats
        .css({
        'margin-bottom': 20,
        'height': 301
    })

        .find($frontOuters) // the three columns
        .css({
        'border': 0,
        'height': 301
    })

        .eq(0) // left column, original location of player name and form name, new location of moveGrid
        .css({
        'width': 301
    })
        .prepend($moveGrid) // moves it from its original location, already has shadow set
        .end()

        .eq(1) // center column, location of player portrait
        .css({
        'width': 301
    })

        .find('.portraitFront')
        .css({
        'border': 0,
        'width': 'inherit',
        'height': 'inherit',
        'box-shadow': '1px 5px 5px gray'
    })
        .wrap('<a href="' + selfLookURL + '" style="font-weight: normal; width: inherit; height: inherit"></a>')
        .end()

        .end()

        .eq(2) // right column, location of player stats

        .find('.avatarBars')
        .css({
        'background': '#d9d9d9',
        'box-shadow': '5px 5px 5px gray'
    })
        .prepend($avatarText) // pulled over here from left column

        .find('.barWrapper') // 'backgrounds' of the bars, empty bars
        .css({
        'height': 35
    })

        .find('.barText') // what it says on the tin
        .css({
        'line-height': '35px'
    })
        .each(function (i) { // this will break if the order of the vital stat bars is changed
        var $this = $(this);
        $this
            .wrap('<a href="/PvP/' + barButtonsData[i].target + '" style="font-weight: normal"></a>') // inherits .barWrapper size
            .hover(
            function () {
                $this // mouseenter
                    .data('initialText', $this.text())
                    .text(barButtonsData[i].text)
                    .css({
                    'color': '#e4e0d4',
                    'font-weight': 'bold'
                });
                if (barButtonsData[i].isBlocked && (secondsToUpdate > 0)) {
                    $this
                        .css({
                        'text-decoration': 'line-through'
                    })
                        .parent()
                        .attr('href', null);
                }
            },
            function () {
                $this // mouseleave
                    .text($this.data('initialText'))
                    .css({
                    'color': '',
                    'font-weight': '',
                    'text-decoration': ''
                })
                    .parent()
                    .attr('href', '/PvP/' + barButtonsData[i].target);
            });
    })
        .end()

        .find('.barData') // 'fullness' of bars, widths are percentages of bar wrappers
        .css({
        'height': 'inherit'
    })

        .filter('.barWP') // possibly I should be doing this with an array-like object instead?
        .css({
        'background': 'linear-gradient(red, darkred)'
    })
        .end()

        .filter('.barMP')
        .css({
        'background': 'linear-gradient(blue, darkblue)'
    })
        .end()

        .filter('.barAP')
        .css({
        'background': 'linear-gradient(orange, darkorange)'
    })
        .end()

        .end()

        .end()

        .find('.avatarXPAmt')
        .css({
        'background': 'linear-gradient(violet, purple)'
    })
        .wrap('<a href="/PvP/MyPerks"></a>') // inherits size from .avatarXPWrapper
    ;

    $innerRows.eq(1) // second row, with now-empty movegrid column and room description

        .find('.col-md-4') // former movegrid column
        .remove()
        .end()

        .find('.covenDescription') // room description and title
        .removeClass('col-md-8');

    if (covSafeground) {

        $covController

            .css({
            'color': '#a13d2d'
        })

            .contents()

            .first() // The text that says 'Enchanted by the '
            .replaceWith('SAFEGROUND for the ');
    }

    // Finally update the real site with the changes
    $('head').after($tftSite);

    // console.log(Date.now() - startTime);

});
