// ==UserScript==
// @name        LevelUp Celebrator
// @namespace   bladepoint
// @author      bladepoint
// @description Displays a celebratory image on level-up
// @version     0.5.0
// @include     https://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/
// @copyright   2019+, Bennett Buckley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/383381/LevelUp%20Celebrator.user.js
// @updateURL https://update.greasyfork.org/scripts/383381/LevelUp%20Celebrator.meta.js
// ==/UserScript==

window.levelup = {};

(function (gobj) {

    /* global $, wkof */

    //===================================================================
    // Initialization of the Wanikani Open Framework.
    //-------------------------------------------------------------------
    var script_name = 'LevelUp Celebrator';
    var wkof_version_needed = '1.0.27'; //TODO
    if (!window.wkof) {
        if (confirm(script_name + ' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    if (wkof.version.compare_to(wkof_version_needed) === 'older') {
        if (confirm(script_name + ' requires Wanikani Open Framework version ' + wkof_version_needed + '.\nDo you want to be forwarded to the update page?')) {
            window.location.href = 'https://greasyfork.org/en/scripts/38582-wanikani-open-framework';
        }
        return;
    }

    wkof.include('Apiv2,Menu,Settings');
    wkof.ready('document,Apiv2,ItemData,Menu,Settings').then(load_settings).then(getSubjectCount).then(startup);

    //===================================================================
    //Utilities
    //-------------------------------------------------------------------
    function nextMilestone(currentValue) {
        return Math.min(currentValue - (currentValue % settings.milestoneInterval) + settings.milestoneInterval, maxSubjects);
    }

    function milestoneString(number, state){
        var s = `${number} turtles ${state}!<br/>Congratulations!`;
        return s.replace("1 turtles", "First turtle").replace(maxSubjects, "All");
    }

    //===================================================================
    // Global variables
    //-------------------------------------------------------------------
    var settings,
    settings_dialog,
    maxSubjects;

    //========================================================================
    // Load the script settings.
    //-------------------------------------------------------------------
    function load_settings() {
        var defaults = {
            imageLink: "https://i.imgur.com/dHY8Ov6.gif",
            levelUpText: "You leveled up!<br/>Congratulations!",
            nextLevel: 2,
            nextGuru: 1,
            nextMaster: 1,
            nextEnlighten: 1,
            nextBurn: 1,
            milestoneInterval: 500,
            display: "all",
            levelOnly: false
        };
        return wkof.Settings.load('levelup', defaults).then(function (data) {
            settings = wkof.settings.levelup;
        });
    }

    //========================================================================
    // Open the settings dialog
    //-------------------------------------------------------------------
    function open_settings() {
        function preview(){
            renderCongratulations();
        };

        var config = {
            script_id: 'levelup',
            title: 'LevelUp Celebrator',
            content: {
                tabs: {
                    type: "tabset",
                    content: {
                        display: {
                            type: "page",
                            label: "Display",
                            hover_tip: "Update display settings",
                            content: {
                                preview: {
                                    type: "button",
                                    label: "Preview",
                                    on_click: preview
                                },
                                imageLink: {
                                    type: "text",
                                    label: "Image URL"
                                },
                                levelUpText: {
                                    type: "text",
                                    label: "Level-up text"
                                },
                                display: {
                                    type: "dropdown",
                                    label: "Simultaneous congratulations",
                                    content: {
                                        all: "All available",
                                        one: "One at a time"
                                    }
                                },
                                levelOnly: {
                                    type: "checkbox",
                                    label: "Notify on level-up only"
                                }
                            }
                        }
                    }
                }
            }
        };
        var settings_dialog = new wkof.Settings(config);
        settings_dialog.open();
    }

    //========================================================================
    // Startup
    //-------------------------------------------------------------------
    function startup() {
        install_css();
        install_menu_link();
        var done = false;

        if (!settings.levelOnly) {
            var milestones = displayMilestones();
            console.log(`rendering ${milestones.length} milestones`);
            $.each(milestones, function (index, value) {
                renderCongratulations(value);
            });
            done = settings.display != "all" && milestones.length;
        }
        if (!done) {
            wkof.Apiv2.fetch_endpoint("user")
            .then(function (data) {
                var level = data.data.level;

                if (level >= settings.nextLevel) {
                    console.log("level trigger");
                    renderCongratulations();
                    settings.nextLevel = level + 1;
                    wkof.Settings.save("levelup");
                }
            });
        }
        wkof.Settings.save("levelup");
    }

    function getSubjectCount() {
        return wkof.ItemData.get_items().then(function (data) {
            maxSubjects = data.length;
            console.log(`maximum subjects: ${maxSubjects}`);
        });
    }

    function displayMilestones() {
        var burned = parseInt($("#burned span").text());
        var enlightened = parseInt($("#enlightened span").text()) + burned;
        var master = parseInt($("#master span").text()) + enlightened;
        var guru = parseInt($("#guru span").text()) + master;
        var done = false;
        var ret = [];

        if (burned >= settings.nextBurn) {
            console.log("burn trigger");
            ret.push(milestoneString(settings.nextBurn, "Burned"));
            done = settings.display != "all";
            settings.nextBurn = nextMilestone(burned);
        }
        if (!done && enlightened >= settings.nextEnlighten) {
            console.log("enlighten trigger");
            ret.push(milestoneString(settings.nextEnlighten, "Enlightened"));
            done = settings.display != "all";
            settings.nextEnlighten = nextMilestone(enlightened);
        }
        if (!done && master >= settings.nextMaster) {
            console.log("master trigger");
            ret.push(milestoneString(settings.nextMaster, "Mastered"));
            done = settings.display != "all";
            settings.nextMaster = nextMilestone(master);
        }
        if (!done && guru >= settings.nextGuru) {
            console.log("guru trigger");
            ret.push(milestoneString(settings.nextGuru, "Guru'd"));
            done = settings.display != "all";
            settings.nextGuru = nextMilestone(guru);
        }

        return ret;
    }

    function renderCongratulations(html) {
        var congratsElements = $(levelup_html);

        html = "<br/>" + (html ? html : settings.levelUpText);

        congratsElements.find("img").attr("src", settings.imageLink);
        congratsElements.find(".text").html(html);
        $(".dashboard .container").prepend(congratsElements);
    }

    window.levelup.test = renderCongratulations;

    //===================================================================
    // Install a link to the settings in the menu.
    //-------------------------------------------------------------------
    function install_menu_link() {
        wkof.Menu.insert_script_link({
            name: 'levelup',
            submenu: 'Settings',
            title: 'LevelUp Celebrator',
            on_click: open_settings
        });
    }

    //===================================================================
    // Top-level HTML for the script.
    //-------------------------------------------------------------------
    var levelup_html =
        '<div class="levelup row">' +
        '  <div class="span8"><img/></div>' +
        '  <div class="span4"><p class="text"></p></div>' +
        '</div>';

    //===================================================================
    // Install the style sheet for the script.
    //-------------------------------------------------------------------
    function install_css() {
        var levelup_css =
            ".levelup img {display: block; margin: 0 auto;}" +
            ".levelup .text {font-size:300%; text-align: center;}" +
            ".levelup {margin-bottom: 20px;}" +
            ".levelup:first-of-type {margin-top: -20px;}";

        $('head').append('<style>' + levelup_css + '</style>');
    }

})(window.levelup);
