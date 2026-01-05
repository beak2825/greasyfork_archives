// ==UserScript==
// @name        nba.com Box Score Layout Tweak 
// @namespace   boxscorelayout
// @author      balack_omamba
// @description Slight tweaks to make nba.com's box score pages easier to look at.
// @include     http://www.nba.com/games/*
// @exclude     http://stats.nba.com/
// @version     3.0
// @grant       none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js


// @downloadURL https://update.greasyfork.org/scripts/23866/nbacom%20Box%20Score%20Layout%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/23866/nbacom%20Box%20Score%20Layout%20Tweak.meta.js
// ==/UserScript==

//waitForKeyElements from https://gist.github.com/BrockA/2625891
//Used to detect AJAXed content (sidebar links).
//Not using @require for this in case it breaks or gets updated to do something malicious.
//No offense to the writers. Just being cautious.
function waitForKeyElements(selectorTxt, /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
bWaitOnce, /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
iframeSelector /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes,
    btargetsFound;
    if (typeof iframeSelector == 'undefined')
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents().find(selectorTxt);
    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
                are new.
            */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;
            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    }
    else {
        btargetsFound = false;
    } //--- Get the timer-control variable for this selector.

    var controlObj = waitForKeyElements.controlObj || {
    };
    var controlKey = selectorTxt.replace(/[^\w]/g, '_');
    var timeControl = controlObj[controlKey];
    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector
                );
            }, 300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}


//Beginning of the script
//Wait for sidebar links to load in and append "#/boxscore" to each of them
waitForKeyElements('.score-tile-wrapper', addToLinks, false); //keep scanning for new links
// waitForKeyElements('.button-right', initPaneButtons, true);
// waitForKeyElements('.boxscore__table--row', initTable, false);

function addToLinks(jNode) {
    var newLink = jNode.attr('href');
    newLink += '#/boxscore';
    jNode.attr('href', newLink);
    $('.score-tile-wrapper').css('display', 'inline');
}
var toggleBtn = document.createElement('input');
var toggleVid = document.createElement('input');
// var statsBtn = document.createElement('input');
var newItem = document.createElement('li'); //add them to the menu bar in a list item
var isDefault = true;
var switched = false;
var headerSet = false;
var boxWidth = 400;

// waitForKeyElements("button > span:contains('Box Score')", function () {
//     $("button > span:contains('Box Score')").parent().addClass("bsBtn");
//     document.getElementsByClassName('bsBtn')[0].addEventListener('click', function () {
//         if (!$('.row__boxscore--player.name').parents('tbody').length) {
//             setTimeout(function () {
//                 waitForKeyElements('.button-right', initPaneButtons, true);
//                 isDefault = true;
//                 switched = false;
//                 clickPane();
//             }, 1000);
//         }
//     }, true);
// });

// function clickPane() {
//     if (!isDefault) {
//         toggleStats();
//         window.setTimeout(function(){ }, 600);
//         headerSet = false;
//     }
// }

// function initPaneButtons() {
//     document.getElementsByClassName('button-right')[0].addEventListener('click', clickPane, false);
//     document.getElementsByClassName('button-left')[0].addEventListener('click', clickPane, false);
// }

// function initTable(jNode) {
//     if (!headerSet) {
//         var headers = document.getElementsByClassName('boxscore__table--row-top');
//         assignTags(headers[0]);
//         headerSet  = true;
//     }
//     assignTags(jNode);
//     assignTags('tfoot');
// }

function startPolling() {
    var handle = window.setInterval(function () {
        var w = window.innerWidth;
        var element = $('#main_sidebar');
        if (element.css("display") == "none") {
            $('#content').css('padding-left', '0px');
            if (w > 786 && w < 1024) {
                $('.scroll').css('margin-left', w / 2 - boxWidth + 'px');
                window.clearInterval(handle);
            }
            else if ((w >= 1024 || w <= 786) && !isDefault) {
                $('.scroll').css('margin-left', w / 2 - boxWidth + 'px');
                window.clearInterval(handle);
            }
            window.clearInterval(handle);
        }
        else {
            if (w >= 736 && w < 1100) {
                $('.scroll').css('margin-left', '0px');
                if (!isDefault)
                    $('.scroll').css('margin-left', w * 0.38 - boxWidth + 'px');
                $('#content').css('padding-left', '320px');
                window.clearInterval(handle);
            }
            else if (w < 736) {
                $('#content').css('padding-left', '0px');
                $('.scroll').css('margin-left', 0 + 'px');
                if (!isDefault) {
                    if (w > 640) {
                        $('.scroll').css('margin-left', w - w * 0.90 + 'px');
                    }
                    else {
                        if (w < 591)
                            $('.scroll').css('margin-left', 0 + 'px');
                        else
                            $('.scroll').css('margin-left', w * 0.50 - w * 0.46 + 'px');
                    }
                }

                window.clearInterval(handle);
            }
            else if (w > 1366) {
                $('#content').css('padding-left', '320px');
                if (!isDefault)
                    $('.scroll').css('margin-left', 1366 * 0.38 - boxWidth + 'px');
                window.clearInterval(handle);
            }
            else {
                $('#content').css('padding-left', '320px');
                if (!isDefault)
                    $('.scroll').css('margin-left', w * 0.38 - boxWidth + 'px');
                window.clearInterval(handle);
            }
            window.clearInterval(handle);

        }

    }, 500);
}

function toggleSideBar() {
    $('#main_sidebar').toggle('show');
    startPolling();
}
with (toggleBtn) {
    setAttribute('value', 'Links');
    setAttribute('type', 'button');
}
newItem.appendChild(toggleBtn);
newItem.className = 'nba-nav__container--center-menu-item';
newItem.setAttribute('role', 'menuitem');

if ((window.location.href.toLowerCase().indexOf('nba.com/games') >= 0)) {
    function toggleGameVideo() {
        $('game-video').toggle('show');
    }
    with (toggleVid) {
        setAttribute('value', 'Feed');
        setAttribute('type', 'button');
    }
    // with (statsBtn) {
    //     setAttribute('value', 'Mini');
    //     setAttribute('type', 'button');
    // }
    newItem.appendChild(toggleVid);
    // newItem.appendChild(statsBtn);
    // statsBtn.addEventListener('click', toggleStats, false);
    toggleVid.addEventListener('click', toggleGameVideo, false);
}
var topMenu = document.getElementsByClassName('nba-nav__container--center-menu');
topMenu[0].insertBefore(newItem, topMenu[0].childNodes[0]);
toggleBtn.addEventListener('click', toggleSideBar, false);

//Hide and resize elements once page has more or less finished loading
window.addEventListener('load', Greasemonkey_main, false);
function Greasemonkey_main() {
    //Misc space wasters
    $('.nba-nav-header').css('margin', '0');
    $('#main').css('paddingTop', '54px');
    $('.nba-nav').css('padding', '0');
    $('#block-homepagefooter').parent().css('display', 'none');
    $('#ad_bnr_atf_01').parent().css('display', 'none');
    $('.desktop-only.stretch.light-gray.nba-ad-container').css('display', 'none');
    //Top of the sidebar
    $('.scoreboard_tabs.expanded.menu').css('display', 'none');
    $('.nba_bottom_scoreboard--wrapper').css('paddingTop', '54px');
    //Hide video feed by default
    $('game-video').hide('show');
    //Left side top menu adjustment
    $('.nba-nav__account').css('max-width', '200px');
    $('.nba-nav__tickets').css('width', '65px');
    $('.nba-nav__tickets').css('margin', '2px 25px 0 10px');
    //Right side top menu - resized so everything fits at full width
    $('.nba-nav__container--center.nba-nav__container').css('font-size', '15px');
    $('.nba-nav__container--center.nba-nav__container').css('width', '50%');
    resizeAction();
}//Scale and change interface when window is resized

function resizeAction() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    if (isDefault)
        boxWidth = 400;
    else
        boxWidth = 280;
    $('.nba-nav__account').css('width', w * 0.15 + 'px');
    //Medium window toggles off the sidebar to make space for content
    if (w < 1100 && w >= 736) {
        var size = h - 68;
        if ($('#main_sidebar').is(':visible') == true) {
            $('#main_sidebar').hide();
            $('#content').css('padding-left', '0px')
        }
        if ($('#main').css('display') != 'flex') {
            $('#main').css('display', 'flex');
        }
        if (w < 786) {
            $('.scroll').css('margin-left', '0px');
        }
        if (w > 1023) {
            if ($('.scroll').css('display') != 'table') {
                $('.scroll').css('display', 'table');
                $('.scroll').css('margin-left', '0px');
            }
        }
        else {
            if ($('.scroll').css('display') != 'block') {
                $('.scroll').css('display', 'block');
            }
        }
        $(toggleBtn).show();
        startPolling();
        $('#content').css('height', size + '');
        $('#main_sidebar').css('height', size + '');
        $('.nba_bottom_scoreboard--wrapper').css('height', size - 54 + '');
        $('.nba_bottom_scoreboard--wrapper').css('padding-top', '54px');
        if (!isDefault) {
            $('.scroll').css('display', 'block');
            $('.scroll').css('margin-left', w / 2 - boxWidth + 'px');
        }

    } //Small window size puts the sidebar beneath the box score so remove the button
    else if (w < 736) {
        if ($('#main_sidebar').is(':visible') == false) {
            $('#main_sidebar').show();
        }
        if ($('.scroll').css('display') != 'block') {
            $('.scroll').css('display', 'block');
        }
        if ($('#main').css('display') != 'inline') {
            $('#main').css('display', 'inline');
        }
        $(toggleBtn).hide();
        startPolling();
        $('#content').css('height', '100%');
        $('#main_sidebar').css('height', '100%');
        $('.nba_bottom_scoreboard--wrapper').css('padding-top', '0px');
        $('.nba_bottom_scoreboard--wrapper').css('height', '100%');
        $('#content').css('padding-left', '0px')
        //$('.scroll').css('margin-left', '0px');
    }
        //Max resolution for the site is 1366. Sidebar turned on by default.
    else if (w >= 1100) {
        var size = h - 68;
        if ($('#main_sidebar').is(':visible') == false) {
            $('#main_sidebar').show();
        }
        if ($('#main').css('display') != 'flex') {
            $('#main').css('display', 'flex');
        }
        if ($('.scroll').css('display') != 'table') {
            $('.scroll').css('display', 'table');
            $('.scroll').css('margin-left', '0px');
        }
        $(toggleBtn).show();
        startPolling();
        $('#content').css('height', size + '');
        $('#main_sidebar').css('height', size + '');
        $('.scroll').css('margin-left', '0px');
        $('.nba_bottom_scoreboard--wrapper').css('height', size - 54 + '');
        $('.nba_bottom_scoreboard--wrapper').css('padding-top', '0px');
        if (!isDefault) {
            $('.scroll').css('display', 'block');
            $('.scroll').css('margin-left', w / 2 - boxWidth + 'px');
        }
    }
} //Run the function whenever the window is resized

window.onresize = function (event) {
    resizeAction();
};

function toggleTables() {
    $('.new_table .scroll').toggle('show');
}

function stripText(node) {
    return $(node).contents().filter(function () {
        return this.nodeType == 3;
    }).text();
}

// function printStatline(playerIndex) {
//     var output = '';
//     for (i = 0; i < 20; i++) {
//         output += stats[playerIndex][i];
//     }
//     return output
// }

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[length - 1 - i] = createArray.apply(this, args);
    }

    return arr;
}


// function getTagTitle(tablePos) {
//     switch (tablePos) {
//         case 0:
//             return 'name'
//             break;
//         case 1:
//             return 'pos'
//             break;
//         case 2:
//             return 'min'
//             break;
//         case 3:
//             return 'pts'
//             break;
//         case 4:
//             return 'fgm'
//             break;
//         case 5:
//             return 'fga'
//             break;
//         case 6:
//             return 'fgp'
//             break;
//         case 7:
//             return '3pm'
//             break;
//         case 8:
//             return '3pa'
//             break;
//         case 9:
//             return '3pp'
//             break;
//         case 10:
//             return 'ftm'
//             break;
//         case 11:
//             return 'fta'
//             break;
//         case 12:
//             return 'ftp'
//             break;
//         case 13:
//             return 'oreb'
//             break;
//         case 14:
//             return 'dreb'
//             break;
//         case 15:
//             return 'reb'
//             break;
//         case 16:
//             return 'ast'
//             break;
//         case 17:
//             return 'tov'
//             break;
//         case 18:
//             return 'stl'
//             break;
//         case 19:
//             return 'blk'
//             break;
//         case 20:
//             return 'pf'
//             break;
//         case 21:
//             return 'pm'
//             break;
//         default:
//             return 'null'
//     }
// }

// function assignTags(node) {
//     var row = $(node).children();
//     for (var i = 0; i < 22; i++) {
//         var obj = $(row.get(i));
//         if (!obj.hasClass(getTagTitle(i))) {
//             obj.addClass(getTagTitle(i));
//         }
//     }
// }

// function toggleStats(jNode) {
//     toggleEl('fgp');
//     toggleEl('pm');
//     toggleEl('3pp');
//     toggleEl('dreb');
//     toggleEl('oreb');
//     toggleEl('pos');
//     toggleEl('ftp');
//     isDefault ^= true;
//     if (isDefault)
//         statsBtn.setAttribute('value', 'Mini');
//     else
//         statsBtn.setAttribute('value', 'Full');
//     resizeAction();
// }

function toggleEl(element) {
    $('.' + element).toggle();
}

$(document).ready(resizeAction());