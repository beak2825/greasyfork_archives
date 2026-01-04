// ==UserScript==
// @name			TFS2018 Taskboard
// @description		Enhances TaskBoard pages for TFS
// @namespace		COMDSPDSA
// @author			Dan Overlander
// @license			none
// @version			9.3
// @include			*/tfs/*/TaskBoard*
// @include			*/tfs2/*/TaskBoard*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/40973/TFS2018%20Taskboard.user.js
// @updateURL https://update.greasyfork.org/scripts/40973/TFS2018%20Taskboard.meta.js
// ==/UserScript==

// Since v09.2: Removes Tamper Global script dependency.
// Since v09.1: moving out setTamperIcon
// Since v09.0: Fixed bug that would constantly select people menu when people list is empty
// Since v08.0: Compressed and moved card tags. Initial; will need more TLC. Reduced font size for card assigned-to names
// Since v07.0: Added the ctrl-space "show my tasks" link back in.  I liked that.  Made it work even when "I" am already selected.  Made it open any rows assigned to me that don't have my tasks beneath them. Swapped burndown & collapseAll keys.  Keyboard shortcuts given a menu.
// Since v06.0: Merged tamperperson selection back to where it belongs, the natural TFS select-person menu
// Since v05.0: Fixed tamperperson display bug and other quickFilter selection bugs
// Since v04.0: Removed Expand/Collapse since that is now built in
// Since v03.0: Clicking Tamperperson clears quickFilter selection
// Since v02.0: FIXED the go-to-user and other defects
// Since v01.0: Repaired go-to-user keys and functions. needs more work.
// Since v00.0: Initial

(function() {
    'use strict';

    const TIMEOUT = 500;
    var global = {
        triggerElement: '.menu-icon',
        scriptName: 'TFS2018 TaskBoard',
        selectedPerson: undefined,
        isMouseMoved: false,
        areClassesAdded: false,
        areKeysAdded: false,
        areRowsCollapsed: false,
        groups: [],
        people: [],
        isPeopleEmpty: false
    },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.addClasses();
                    tm.addClasses();
                    tm.setTamperIcon(global.scriptName);
                    page.getInfo();
                    page.adjustTileTitles();
                    page.adjustTileTags();
                    page.addRowIdLinks();
                    page.setControls();
                    page.addMenuLinks();
                    page.enhanceExistingClicks();
                }, TIMEOUT);
            },
            addClasses: function () {
                if (!global.areClassesAdded) {
                    global.areClassesAdded = true;

                    // Adjust overall tiles
                    tm.addGlobalStyle('.tbTile { width: 100%; }');
                    tm.addGlobalStyle('.tbTile, .id-title-container, .tbTile .container { margin: 1px; }');

                    tm.addGlobalStyle('.tbTile .id-title-container {margin: 0px 6px; padding: 0px; min-height:52px;}');
                    tm.addGlobalStyle('.tbTile .title {line-height:10px;}');

                    // Adjust overall tiles but not row tbTiles
                    tm.addGlobalStyle('.tbTileContent { width:50% !important; float:left; height:85px; }');
                    tm.addGlobalStyle('.taskboard-parent .tbTileContent { width:100% !important; float:inherit; height:inherit; }');
                    tm.addGlobalStyle('.card-context-menu { position: relative; top: -82px; left: 124px; }');

                    // Change cell padding/margin
                    tm.addGlobalStyle('.taskboard-cell { padding:0px; border-bottom:solid 1px #fff; border-left:solid 2px #fff; }');
                    tm.addGlobalStyle('.tbPivotItem { margin-bottom:0px; }');
                    tm.addGlobalStyle('.taskboard-row-summary .taskboard-expander { padding-top:5px; }');

                    // ID Link decoration
                    tm.addGlobalStyle('.tmIdLink, .tmIdLinkCollapsed { border-bottom:1px dotted black }');

                    // Tag padding and margin
                    tm.addGlobalStyle('.tags.field-container: { padding-right: 0px !important; margin-top: 0px !important; margin-bottom: 2px !important; } .tags.field-container .tags-items-container ul>li: { margin-bottom: 0px !important; } .tag-container: { border: 0px solid #FFFFFF !important; padding-top: 0px !important; padding-bottom: 0px !important; } .tag-box { padding: 1px !important; font-size: 9px !important; }');
                    $('.tags-items-container').css('line-height', '15px');

                    // Make selected tiles more prominent
                    tm.addGlobalStyle('.tbTileContent { background-color: #FFFDE0 !important; }');
                    tm.addGlobalStyle('.taskboard-parent .tbTileContent { background-color: #FFF !important; }');

                    // Add rollover states for row background
                    tm.addGlobalStyle('.taskboard-row:hover, .taskboard-row-summary:hover { background:cornsilk; }');

                    // fixing taskboard header title alignment
                    tm.addGlobalStyle('#taskboard-table-header .taskboard-cell { text-align:right; }');
                    tm.addGlobalStyle('#taskboard-table-header .taskboard-row:hover { background:inherit; }');

                    // tfs icons
                    tm.addGlobalStyle('.tfs-icon-arrow-left { position:relative; top:7px; background-position:-4656px -16px !important; margin-left:2px; }');
                    tm.addGlobalStyle('.tfs-icon-arrow-rite { position:relative; top:7px; background-position:-5263px -16px !important; margin-left:2px; }');
                    tm.addGlobalStyle('.tfs-icon-arrow-help { position:relative; top:7px; background-position:-6609px -16px !important; margin-left:2px; }');
                    tm.addGlobalStyle('.tfs-icon-arrow-clip { position:relative; top:-2px; background-position:-5329px -16px !important; margin-left:2px; }');

                    // keyboard shortcut class
                    tm.addGlobalStyle('kbd { background-color:#fcfcfc; border:solid 1px #ccc; border-bottom-color:#bbb; border-radius:3px; box-shadow:inset 0 -1px 0 #bbb; color:#555; display:inline-block; font-family:"Pragmata Pro","Liberation Mono","Source Code Pro","Droid Sans","Envy Code R",Consolas,Menlo,monospace!important; font-size:65%; line-height:1em; padding:3px 5px; vertical-align:middle }'); /* credit: https://damieng.com/ */
                    tm.addGlobalStyle('.shortCut { width:10% !important; }');

                    // card assigned-to names
                    tm.addGlobalStyle('.ui-droppable .identity-picker-resolved-class { font-size:0.75em; }');

                }
            },
            getInfo: function() {
                if (global.people.length === 0 && !global.isPeopleEmpty) {
                    $('.person-filter span').click();
                    setTimeout(function() {
                        $('.person-filter ul [role="menu"] .menu-item').each(function(index) {
                            if ($(this).attr('command') !== 'All' && $(this).attr('command') !== 'Unassigned') {
                                global.people.push($(this).attr('command'));
                            }
                        });
                        if (global.people.length === 0) {
                            global.isPeopleEmpty = true;
                        }
                        global.people = _.sortBy(_.uniq(global.people,false,function(i){
                            return i;
                        }));
                    }, TIMEOUT);

                    setTimeout(function() {
                        $('.person-filter ul').remove();
                    }, TIMEOUT*2);
                }

                if (global.groups.length === 0) {
                    $('.group-filter span').click();
                    setTimeout(function() {
                        $('.group-filter ul [role="menu"] .menu-item').each(function(index) {
                            global.groups.push($(this).find('[role="button"]').text());
                        });
                        global.groups = _.sortBy(_.uniq(global.groups,false,function(i){
                            return i;
                        }));
                    }, TIMEOUT);

                    setTimeout(function() {
                        $('.group-filter ul').remove();

                        //hacky; shouldn't belong here, but whatevs:
                        setTimeout(function() { goReset(); }, TIMEOUT);

                    }, TIMEOUT*2);
                }
            },
            adjustTileTitles: function () {
                // Adds ID links and shrinks title text if too long
                var links = $('.id-title-container .id');
                $( links ).each(function( index ) {
                    var thisText = $(this).text().trim();
                    if ($(this).prop('title').indexOf(thisText) < 0) {
                        $(this).prop('title', thisText);

                        if ($(this).next().text().length > 60) {
                            $(this).parent().css({'line-height': '.95em', 'font-size': '0.71em'});
                            $(this).css({'padding-top': '4px'});
                        }
                        if ($(this).next().text().length < 90) {
                            $(this).parent().css({'font-size': '0.91em'});
                        }

                        $(this).html('<span class="tmIdLink" id="id-' + thisText + '" title="' + thisText + '">' + thisText + '</span> ');
                    }
                });
            },
            adjustTileTags: function () {
                var tags = $('.ui-droppable .tags-items-container .tag-box');
                $('.ui-droppable .tags-items-container').css({'top': '-30px', 'position': 'relative', 'text-align': 'right'});
                $( tags ).each(function( index ) {
                    var thisText = $(this).text().trim();
                    if ($(this).prop('title').indexOf(thisText) < 0) {
                        $(this).html('<span class="icon icon-tfs-build-status-header tfs-icon-arrow-clip fingery" title="' + thisText + '"></span>');
                    }
                });
            },
            addRowIdLinks: function () {
                var justId,
                    thisIdLink,
                    unexpandedRow,
                    toDisplay,
                    requirements = $('.parentTbTile');

                $(requirements).each(function( index ) {
                    toDisplay = $(this).text();
                    justId = $(this).attr('id').replace('tile-', '');
                    if(justId !== undefined && parseInt(justId) > 0) {
                        thisIdLink = '<span class="tmIdLink" id="id-' + justId + '" style="unused:right;" title="' + justId + '">' + justId + '</span> ';
                        if (toDisplay.indexOf(justId) === -1) {
                            $(this).find('.title').prepend(thisIdLink);
                        }
                        unexpandedRow = $(this).parent().parent().next().find('.witTitle').parent().parent();
                        if (unexpandedRow.text().indexOf(justId) === -1) {
                            unexpandedRow.prepend(thisIdLink.replace('unused', 'float').replace('tmIdLink', 'tmIdLinkCollapsed').replace('id-', 'id2-'));
                        }
                    }
                });
            },
            addMenuLinks: function () {
                if ($('.tfs-icon-arrow-left').length === 0) {
                    clickExpand();
                    clickExpand();

                    $('.filters').append('<span class="icon icon-tfs-build-status-header tfs-icon-arrow-left fingery" title="Cycle up: ALT-8"></span>');
                    $('.filters').append('<span class="icon icon-tfs-build-status-header tfs-icon-arrow-rite fingery" title="Cycle down: ALT-2"></span>');
                    $('.filters').append('<span class="icon icon-tfs-build-status-header tfs-icon-arrow-help fingery" title="Show Shortcuts: CTRL-BACKSPACE"></span>');

                    $('.tfs-icon-arrow-left').mouseup(function clickIdLink (e) {
                        cycleRow('prev');
                    });

                    $('.tfs-icon-arrow-rite').mouseup(function clickIdLink (e) {
                        cycleRow('next');
                    });

                    $('.tfs-icon-arrow-help').mouseup(function clickIdLink (e) {
                        showShortcuts('next');
                    });
                }
            },
            enhanceExistingClicks: function () {
                $('.menu-item').on('click', function () { page.clearQuickFilter(); });
                $('.expand-collapse-button').on('click', function () { page.clearQuickFilter(); });
                $('.toggle-button').on('click', function () { // weird slightly-too-large table fix when collapsing Backlog Explorer
                    if($('.toggle-button .collapsed').length > 0) {
                        $('#taskboard-table-body').css('width', ($(window).width() - 53) + 'px');
                    }
                });
            },
            setControls: function () {
                if (!global.areKeysAdded) {
                    global.areKeysAdded = true;

                    $(document).unbind('keyup');

                    $(document).keyup(function(e) {
                        if (e.keyCode == 96 && e.altKey) { cycleRow(); } // Keypad 0
                        if (e.keyCode == 32 && e.ctrlKey) { cycleRow(); } // Ctrl-Space
                        if (e.keyCode == 101 && e.altKey) { goGroup(); } // Keypad 5
                        if (e.keyCode == 104 && e.altKey) { cycleRow('prev'); } // Keypad 8 (Up)
                        if (e.keyCode == 98 && e.altKey) { cycleRow('next'); } // Keypad 2 (Down)
                        if (e.keyCode == 103 && e.altKey) { goReset(); } // Keypad 7
                        if (e.keyCode == 109 && e.altKey) { clickCollapse(); } // Keypad Subtract
                        if (e.keyCode == 107 && e.altKey) { clickExpand(); } // Keypad Plus
                        if (e.keyCode == 13 && e.altKey) { toggleBurndown(); } // Enter
                        if (e.keyCode == 8 && e.ctrlKey) { showShortcuts(); } // Backspace
                    });
                }
                $('.tmIdLink').unbind('mouseup');
                $('.tmIdLink').mouseup(function clickIdLink (e) {
                    if( e.which === 1 || e.which === 3 ) { // {1:left, 3:right, 2:middle}
                        var textToCopy = $(this).attr('title');
                        tm.copyTextToClipboard(textToCopy);
                        utils.selectText('id-' + textToCopy);
                    }
                });
                $('.tmIdLinkCollapsed').unbind('mouseup');
                $('.tmIdLinkCollapsed').mouseup(function clickIdLink (e) {
                    if( e.which === 1 || e.which === 3 ) { // {1:left, 3:right, 2:middle}
                        var textToCopy = $(this).attr('title');
                        tm.copyTextToClipboard(textToCopy);
                        utils.selectText('id2-' + textToCopy);
                    }
                });
            },
            clearQuickFilter: function () {
                $('.tamperperson').remove();
            }
        },
        utils = {
            selectText: function (element) {
                var range,
                    doc = document,
                    text = doc.getElementById(element);

                if (doc.body.createTextRange) { // ms
                    range = doc.body.createTextRange();
                    range.moveToElementText(text);
                    range.select();
                } else if (window.getSelection) { // moz, opera, webkit
                    var selection = window.getSelection();
                    range = doc.createRange();
                    range.selectNodeContents(text);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        };


    /*
     * Global functions
     */

    function showShortcuts() {
        //ALT-0 / Ctrl-Space = you, ALT-5 = groups, ALT-7 = reset. ALT-Minus = collapse. ALT-Plus = expand. ALT-Enter = burndown
        var modalId = 'keyboardKeys',
            modalBody = '    <div class="popupDetailTitle shortCut"><kbd>CTRL</kbd><kbd>Space</kbd></div>      <div class="popupDetailContent">Show your WorkItems</div>'+
            '    <div class="popupDetailTitle shortCut"><kbd>ALT</kbd><kbd>Keypad 0</kbd></div>    <div class="popupDetailContent">Show your WorkItems</div>'+
            '    <div class="popupDetailTitle shortCut"><kbd>ALT</kbd><kbd>Keypad 8</kbd></div>    <div class="popupDetailContent">Show previous person</div>'+
            '    <div class="popupDetailTitle shortCut"><kbd>ALT</kbd><kbd>Keypad 2</kbd></div>    <div class="popupDetailContent">Show next person</div>'+
            '    <div class="popupDetailTitle shortCut"><kbd>ALT</kbd><kbd>Keypad 7</kbd></div>    <div class="popupDetailContent">Show expanded people view</div>'+
            '    <div class="popupDetailTitle shortCut"><kbd>ALT</kbd><kbd>Keypad Plus</kbd></div> <div class="popupDetailContent">Show expanded view</div>'+
            '    <div class="popupDetailTitle shortCut"><kbd>ALT</kbd><kbd>Keypad Minus</kbd></div><div class="popupDetailContent">Show collapsed view</div>'+
            '    <div class="popupDetailTitle shortCut"><kbd>ALT</kbd><kbd>Keypad 5</kbd></div>    <div class="popupDetailContent">Toggle Group View</div>'+
            '    <div class="popupDetailTitle shortCut"><kbd>ALT</kbd><kbd>Enter</kbd></div>       <div class="popupDetailContent">Toggle Burndown view</div>';
        tm.showModal(modalId, modalBody);
    }

    function clickExpand() {
        page.clearQuickFilter();
        global.areRowsCollapsed = false;
        $('.taskboard-row').each(function (index) {
            if (index > 0 && $(this).css('display') !== 'none') {
                $(this).find('button').click();
            }
        });

    }

    function clickCollapse() {
        page.clearQuickFilter();
        global.areRowsCollapsed = true;
        $('.taskboard-row').each(function (index) {
            if (index > 0 && $(this).css('display') === 'none') {
                $(this).find('button').click();
            }
        });
    }

    function cycleRow (intention) {
        var foundIndex = 0,
            skipToMe = (intention === 'next' || intention === 'prev') ? false : true,
            thisRowPerson,
            startIndex,
            substrLength;

        global.selectedPerson = $('.person-filter .selected').eq(0).find('span').text();

        if (skipToMe) {
            // profile-menu-name is from TFS, it says who is logged in.
            global.selectedPerson = $('.profile').attr('aria-label');
            global.selectedPerson = global.selectedPerson.substr(0, global.selectedPerson.indexOf('(')-1);
        }

        // set global.selectedPerson if undefined
        if (global.selectedPerson === undefined) {
            if (skipToMe !== true) {
                if (intention === 'next') {
                    global.selectedPerson = global.people[global.people.length - 1];
                } else {
                    global.selectedPerson = global.people[0];
                }
            }
        }

        clickCollapse();

        if (skipToMe === false) {
            // find target person based on intention
            if (intention === 'next') {
                if (global.selectedPerson === global.people[global.people.length - 1]){
                    global.selectedPerson = global.people[0];
                } else {
                    global.selectedPerson = global.people[global.people.indexOf(global.selectedPerson) + 1];
                }
            } else {
                if (global.selectedPerson === global.people[0]){
                    global.selectedPerson = global.people[global.people.length - 1];
                } else {
                    global.selectedPerson = global.people[global.people.indexOf(global.selectedPerson) - 1];
                }
            }
        }

        $('.person-filter span').click();
        setTimeout(function() {
            $('.menu-item [command="' + global.selectedPerson + '"]').click();
        }, TIMEOUT);
        setTimeout(function() {
            $('.taskboard-parent .identity-picker-resolved-name:contains("' + global.selectedPerson  + '")').each(function(index) {
                if ($(this).closest('.taskboard-row').css('display') === 'none') {
                    $(this).closest('.taskboard-row').find('button').click();
                }
            });
        }, TIMEOUT * 2);

    }

    function goGroup () {
        var thisGroup;
        $('.group-filter span').click();
        thisGroup = $('.group-filter .selected').eq(0).find('span').text();
        setTimeout(function() {
            $('.group-filter .sub-menu li').each(function(index) {
                if($(this).find('[role="button"]').text() !== thisGroup) {
                    $(this).click();
                }
            });
        }, TIMEOUT);
    }

    function goReset() {
        global.selectedPerson = undefined;
        $('.group-filter span').click();
        setTimeout(function() {
            $('.group-filter .sub-menu li').eq(1).click();

            $('.person-filter span').click();
            setTimeout(function() {
                $('.person-filter ul [role="menu"] .menu-item').eq(0).click();
            }, TIMEOUT);

        }, TIMEOUT);
    }

    function toggleBurndown() {
        if (!$('.large-chart-container').is(":visible")) {$('.burndown-chart img.clickable').click();} else { $('.ui-dialog .ui-button').click(); }
    }

    function initScript () {
        tm.getContainer({
            'el': global.triggerElement,
            'max': 100,
            'spd': 1000
        }).then(function($container){
            page.initialize();
        });
    }

    initScript();

    $(document).mousemove(function(e) {
        if (!global.isMouseMoved) {
            global.isMouseMoved = true;
            setTimeout(function() {
                global.isMouseMoved = false;
            }, TIMEOUT * 2);
            initScript();
        }
    });

})();