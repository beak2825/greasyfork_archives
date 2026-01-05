// ==UserScript==
// @name			TFS Taskboard Filters
// @description		Adds coloring and filtering functions for TFS2015-16
// @namespace		COMDSPDSA
// @author			Dan Overlander
// @license			none
// @version			9
// @include			*/tfs/*/TaskBoard*
// @include			*/tfs2/*/TaskBoard*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/23119/TFS%20Taskboard%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/23119/TFS%20Taskboard%20Filters.meta.js
// ==/UserScript==

// Since v08: Removes Tamper Global script dependency.
// Since v07: Tamperlibary link updated
// Since v06: moving out setTamperIcon
// Since v05: scriptName bug fixed.
// Since v04: updates for TFS2018
// Since v03: updating tm support library
// Since v02: Adds total remaining hours to top of screen
//            missing } on an addGlobalStyle call

(function() {
    'use strict';

    var TIMEOUT = 750,
        colors = {
            bug: 'FF3300',
            test: 'FF9D00',
            analysis: '12A59C',
            development: '9933FF'
        },
        global = {
            ids: {
                scriptName: 'TFS Taskboard Filters',
                prefsName: 'taskboardFiltersPrefs'
            },
            prefs: {},
            handlePrefsLocally: true,
            isMouseMoved: false,
            triggerElement: '.id-title-container'
        },
        toggle = {
            isResetting: false,
            areClassesAdded: false,
            areButtonsAdded: false
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.addClasses();
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    page.tagTiles();
                }, TIMEOUT);
            },
            addClasses: function () {
                if (!toggle.areClassesAdded) {
                    toggle.areClassesAdded = true;

                    // border shading for tbTiles
                    tm.addGlobalStyle('.witTypeBug { border-left:0px !important; backgroundremoved:#FFCBBE !important; }');
                    tm.addGlobalStyle('.witTypeBug .tbTileContent {border-left: 5px solid #' + colors.bug + ' !important');
                    tm.addGlobalStyle('.witTypeTest { border-left:0px !important; backgroundremoved:#FFE5CC !important; }');
                    tm.addGlobalStyle('.witTypeTest .tbTileContent {border-left: 5px solid #' + colors.test + ' !important;');
                    tm.addGlobalStyle('.witTypeAnalysis { border-left:0px !important; backgroundremoved:#90DAD5 !important; }');
                    tm.addGlobalStyle('.witTypeAnalysis .tbTileContent {border-left: 5px solid #' + colors.analysis + ' !important;');
                    tm.addGlobalStyle('.witTypeDevelopment { border-left:0px !important; backgroundremoved:#E3C7FF !important; }');
                    tm.addGlobalStyle('.witTypeDevelopment .tbTileContent {border-left: 5px solid #' + colors.development + ' !important; }');

                    // top-level buttons
                    tm.addGlobalStyle('.taskFilters a { color: black; margin-left:2em; padding: .1em .8em; border-radius: 5px; font-size: .9em; }');
                    tm.addGlobalStyle('.taskFilters a:hover { color:inherit; text-decoration:inherit; }');
                    tm.addGlobalStyle('.taskFilters a.Development { background: #9933FF; }');
                    tm.addGlobalStyle('.taskFilters a.Analysis { background: #12A59C; }');
                    tm.addGlobalStyle('.taskFilters a.Testing { background: #FF9D00; }');
                    tm.addGlobalStyle('.taskFilters a.Bugs { background: #FF3300; }');
                    tm.addGlobalStyle('.taskFilters a.Total:hover { text-decoration: none; cursor: default; }');
                    tm.addGlobalStyle('.taskFilters a.off { opacity:0.4; }');
                }
            },
            tagTiles: function () {
                var $taskFilters = $('.taskFilters');

                if ($taskFilters.length === 0)
                {
                    $taskFilters = $('<span class="taskFilters" />');
                    $('#iteration-board-title-id').append($taskFilters);

                    $taskFilters.empty();

                    var filterTasks = function() {
                        var taskType = $(this).data('taskType');
                        $(this).toggleClass('off');
                        $('.' + taskType).toggle();
                    };

                    $taskFilters.append($('<a title="Remaining hours assigned to existing development tasks" />')
                                        .addClass('Development')
                                        .data('taskType', 'witTypeDevelopment')
                                        .append('Tasks')
                                        .click(filterTasks));

                    $taskFilters.append($('<a title="case insensitive: BUG-, BUG -, Defect, [B], [D]" />')
                                        .addClass('Bugs')
                                        .data('taskType', 'witTypeBug')
                                        .append('Defects')
                                        .click(filterTasks));

                    $taskFilters.append($('<a title="case insensitive: Analysis, Analyze, Analyse, Discovery, SPIKE-, [A], [S]." />')
                                        .addClass('Analysis')
                                        .data('taskType', 'witTypeAnalysis')
                                        .append('Analysis')
                                        .click(filterTasks));

                    $taskFilters.append($('<a title="case insensitive: Test, [T]" />')
                                        .addClass('Testing')
                                        .data('taskType', 'witTypeTest')
                                        .append('Testing')
                                        .click(filterTasks));

                    $taskFilters.append('<a class="Total">Total</a>');
                }



                var devWorkRemaining = 0;
                var analysisWorkRemaining = 0;
                var testingWorkRemaining = 0;
                var bugWorkRemaining = 0;

                $(".ui-droppable .tbTile").each(function() {
                    var $this = $(this);
                    var $title = $('.title', this);
                    var $content = $('.tbTileContent', this);

                    var titleText = $title.text();
                    var assignedTo = $('.assignedTo', this).text();
                    var workRemaining = $('.witRemainingWork', this).text().replace(' h', '') * 1;

                    if (tm.isTagIn(titleText, ['[T]', 'test', 'SDET', 'TEST-', 'TEST - '])) {
                        $this.addClass('witTypeTest');
                        testingWorkRemaining += workRemaining;
                    } else if(tm.isTagIn(titleText, ['[S]', '[A]', 'SPIKE-', 'SPIKE -', 'discovery', 'analyse', 'analyze', 'analysis'])) {
                        $this.addClass('witTypeAnalysis');
                        analysisWorkRemaining += workRemaining;
                    } else if(tm.isTagIn(titleText, ['defect', '[D]', '[B]', 'BUG-', 'BUG - '])) {
                        $this.addClass('witTypeBug');
                        bugWorkRemaining += workRemaining;
                    } else {
                        $this.addClass('witTypeDevelopment');
                        devWorkRemaining += workRemaining;
                    }

                    //if (assignedTo == tfsContext.currentUser) {
                    //    $this.addClass('witMyWork');
                    //}
                });

                $('.devWorkRemaining').remove();
                $('.analysisWorkRemaining').remove();
                $('.testingWorkRemaining').remove();
                $('.bugWorkRemaining').remove();
                $('.totalWorkRemaining').remove();

                $('a.Development').append(' <span class="devWorkRemaining">[' + devWorkRemaining + ']</span>');
                $('a.Analysis').append(' <span class="analysisWorkRemaining">[' + analysisWorkRemaining + ']</span>');
                $('a.Testing').append(' <span class="testingWorkRemaining">[' + testingWorkRemaining + ']</span>');
                $('a.Bugs').append(' <span class="bugWorkRemaining">[' + bugWorkRemaining + ']</span>');
                $('a.Total').append(' <span class="totalWorkRemaining">[' + (devWorkRemaining + analysisWorkRemaining + testingWorkRemaining + bugWorkRemaining) + ']</span>');
            }
        };

    /*
     * Global functions
     */

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