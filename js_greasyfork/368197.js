// ==UserScript==
// @name			TFS Query
// @description		Enhances Query pages for TFS
// @namespace		COMDSPDSA
// @author			Dan Overlander
// @license			none
// @version			3.5
// @include			*/tfs/*
// @include			*/tfs2/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=737902
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/368197/TFS%20Query.user.js
// @updateURL https://update.greasyfork.org/scripts/368197/TFS%20Query.meta.js
// ==/UserScript==

// Since v03.4: Tamperlibrary link updated. TEMPORARILY removing the first-column popup thing; it's linking too much.
// Since v03.3: Removes Tamper Global script dependency.
// Since v03.2: Tamperlibrary link updated.
// Since v03.1: Adds back in the first-column popup link of old. Added system to send technical notes to UI. Adjusted sprint capacity to take up less vertical space
// Since v03.0: Bug fixes related to prefs saving/loading issues (from moving out tamper stuff)
// Since v02: moving out setTamperIcon
// Since v01: Renamed helpery class to script-specific name, to differentiate from other scripts
// Since v00: Initial

(function() {
    'use strict';

    const TIMEOUT = 500;
    var toggle = {
            isMouseMoved: false,
            areClassesAdded: false
        },
        global = {
            triggerElement: '.menu-icon',
            scriptName: 'TFS Query',
            prefsName: 'queryPrefs',
            prefs: {}
        },
        page = {
            initialize: function() {
                setTimeout(function () {
                    page.setPrefs();
                    page.addClasses();
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    tm.checkNotes(global);
                    page.enhanceGrid();
                    page.dimRows();
                }, TIMEOUT);
            },
            setPrefs: function() {
                global.prefs = GM_getValue(global.prefsName) != null ? JSON.parse(GM_getValue(global.prefsName)) : {};
                global.prefs.blocking = global.prefs.blocking != null ? global.prefs.blocking : 'rgba(255,0,0,.1)';
                global.prefs.fontSize = global.prefs.fontSize != null ? global.prefs.fontSize : '.8em';
                global.prefs.grid = global.prefs.grid != null ? global.prefs.grid : {
                    sev1: 'red',
                    sev2: '#b26b00',
                    sev3: '#000000',
                    sev4: '#999999'
                };
                global.prefs.dim = global.prefs.dim != null ? global.prefs.dim : 'true';
                global.prefs.dimmables = global.prefs.dimmables != null ? global.prefs.dimmables : 'Closed, Deployed, Testing, Need More Information, Rejected, E2E';
            },
            addClasses: function() {
                if (!toggle.areClassesAdded) {
                    toggle.areClassesAdded = true;

                    tm.addGlobalStyle('.grid-cell { font-size: ' + global.prefs.fontSize + '; }');

                    tm.addGlobalStyle('.tfs-icon-arrow-help { background-position:-6609px -16px !important; margin-left:2px; }');

                    // reduce vertical space of sprint capacity list
                    tm.addGlobalStyle('.progress-text { position:relative; top:-18px; margin-bottom:-20px; }');

                }
            },
            enhanceGrid: function() {
                if (global.prefs.grid != null) {
                    $(".grid-row:contains('Sev 1')").css('color', global.prefs.grid.sev1); $(".grid-row:contains('Sev 1') a").css('color', global.prefs.grid.sev1);
                    $(".grid-row:contains('Sev 2')").css('color', global.prefs.grid.sev2); $(".grid-row:contains('Sev 2') a").css('color', global.prefs.grid.sev2);
                    $(".grid-row:contains('Sev 3')").css('color', global.prefs.grid.sev3); $(".grid-row:contains('Sev 3') a").css('color', global.prefs.grid.sev3);
                    $(".grid-row:contains('Sev 4')").css('color', global.prefs.grid.sev4); $(".grid-row:contains('Sev 4') a").css('color', global.prefs.grid.sev4);
                }
                $(".grid-row > .grid-cell:contains('Yes')").css({'font-weight': 'bold', 'background': 'linear-gradient(rgba(255,255,255,0), ' + global.prefs.blocking});
//                 $('.grid-row').each(function(row) {
//                     $(this).find('.grid-cell').eq(0)
//                         .css('text-decoration', 'underline')
//                         .addClass('fingery')
//                         .unbind('mouseup')
//                         .on('mouseup', function() { utils.togglePopup($(this).parent()); });
//                 });
            },
            dimRows: function() {
                if (global.prefs.dim === 'true') {
                    utils.toggleDims();
                }
            }
        },
        utils = {
            toggleDims: function () {
                if ($('span:contains("Save query")').length === 0) {
                    return;
                }
                var dimmables = global.prefs.dimmables.replace(/, */g, ',').split(','),
                    indexReason = _.findIndex($('.grid-header-column'), function(headerItem) { return headerItem.innerText === 'Reason'; }),
                    indexState = _.findIndex($('.grid-header-column'), function(headerItem) { return headerItem.innerText === 'State'; }),
                    myOpacity = global.prefs.dim ? '.2' : '1',
                    myWeight = global.prefs.dim ? 'bold' : 'inherit';

                if (indexReason === -1 || indexState === -1) {
                    tm.addNote(global, 'Either Reason or State columns are missing; dimming method may be disabled');
                }

                $('.grid-row').each(function (row) {
                    if (indexReason > 0) {
                        $(this).find('.grid-cell').eq(indexReason).addClass('cellReason');
                    }
                    if (indexState > 0) {
                        $(this).find('.grid-cell').eq(indexState).addClass('cellState');
                    }
                });

                $('.work-items-tabs a[title="Set focus on work items that still need development work"]').css('font-weight', myWeight);
                _.each(dimmables, function(dimmable) {
                    $('.cellState:contains(' + dimmable + ')').closest('.grid-row').css('opacity', myOpacity);
                    $('.workitem-state-value:contains(' + dimmable + ')').closest('.grid-row').css('opacity', myOpacity);
                });
            },
            togglePopup: function(thisRow) {
                var popupRows = '';
                $.each($(thisRow).find('.grid-cell'), function(iter, thisCell) {
                    popupRows += '<div class="popupDetailTitle">' + $('.grid-header').find('.grid-header-column').eq(iter).text() + ':</div><div class="popupDetailContent">' + $(thisCell).html().replace(/q>/gi, 'p>') + '</div>';
                });
                tm.showModal('popupDetailWindow', popupRows);
            }
        };


    /*
     * Global functions
     */


    function initScript() {
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