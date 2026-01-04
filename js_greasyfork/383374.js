// ==UserScript==
// @name         Wanikani: Dashboard Level
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Adds level back to the dashboard header
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com/(dashboard)?$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383374/Wanikani%3A%20Dashboard%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/383374/Wanikani%3A%20Dashboard%20Level.meta.js
// ==/UserScript==

(function(wkof) {
    // If wkof is installed, then add settings
    let display_setting = "both";
    if (wkof) {
        wkof.include('Menu,Settings');
        wkof.ready('Menu,Settings')
            .then(load_settings)
            .then(retrieve_settings)
            .then(install_menu)
            .then(display);
    }
    else display();

    // Do the stuff
    function display() {
        // Don't do anything if there's no header
        let header = document.getElementsByClassName('global-header')[0];
        if (!header) return;
        // Find user info
        let level = document.getElementsByClassName('user-summary__attribute')[0].children[0].href.split('/level/')[1];
        let subscription = document.getElementsByClassName('user-summary__attribute')[1].children[0].innerHTML.trim().toLowerCase();
        if (level==60) subscription = "gold";
        // Display
        if (display_setting=="forum" || display_setting=="both") add_forum_level(header, level, subscription);
        if (display_setting=="traditional" || display_setting=="both") add_regular_level(level);
    }

    // Adds the forum type level display
    function add_forum_level(header, level, sub) {
        header.getElementsByClassName('sitemap__section-header--account')[0].insertAdjacentHTML('beforebegin', '<div id="dashboard-level" class="'+sub+'"><span>'+level+'</span></div>');
        document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
<style id="DashboardLevelCSS-forum">
#dashboard-level {
    width: 19px;
    height: 19px;
    z-index: 1;
    position: absolute;
    right: 5px;
    transform: translateX(50%);
    bottom: -10px;
    border-radius: 100%;
    text-align: center;
    background-color: #f1f3f5;
}
#dashboard-level.recurring {background-color: #80d5ff;}
#dashboard-level.lifetime {background-color: #d580ff;}
#dashboard-level.gold {background-color: #fbc042;}
#dashboard-level > span {
    color: rgb(240, 240, 240) !important;
    text-shadow: 1px 1px rgba(42, 42, 42, 0.5) !important;
    font-size: 12px;
    font-weight: bold;
    display: block;
}
</style>`);
    }

    // Adds the traditional level display
    function add_regular_level(level) {
        let levels_btn = document.querySelector('.sitemap__section-header[aria-controls="sitemap__levels"]:not(.sitemap__section-header--help)');
        levels_btn.children.forEach(span=>{span.insertAdjacentHTML('afterBegin', '<span class="dashboard-level">'+level+'</span>');});
        document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
<style id="DashboardLevelCSS-traditional">
.sitemap__section-header[aria-controls="sitemap__levels"]:not(.sitemap__section-header--help) {
    overflow: visible;
    border-color: rgba(0,0,0,0.1);
    padding-left: 0;
    border-left: none;
    margin-left: -8px;
    margin-right: 8px;
}
.dashboard-level {
    display: inline-block;
    background-color: #a0f;
    color: #fff;
    text-shadow: 0 -1px 0 rgba(0,0,0,0.3);
    font-weight: 700;
    font-size: 0.75rem;
    padding: 1px 8px 0 8px;
    margin-right: 12px;
    border-radius: 4px 0 0 4px;
    line-height: 31px;
    float: left;
    min-widht: 16px;
}
#level-duration {
    margin-bottom: -3px;
    margin-top: 10px !important;
}
</style>`);
    }

    // Load WKOF settings
    function load_settings() {
        let defaults = {display: "both",};
        return wkof.Settings.load('dashboard_level', defaults);
    }

    // Updates the global setting variable
    function retrieve_settings() {
        display_setting = wkof.settings.dashboard_level.display;
    }

    // Add settings to the menu
    function install_menu() {
        var config = {
            name: 'dashboard_level',
            submenu: 'Settings',
            title: 'Dashboard Level',
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }

    // Define settings menu layout
    function open_settings(items) {
        var config = {
            script_id: 'dashboard_level',
            title: 'Dashboard Level',
            content: {
                display: {
                    type: 'list',
                    label: 'Display',
                    default: 'both',
                    hover_tip: 'Select how you want the level to display',
                    size: 3,
                    content: {
                        both: "Both",
                        traditional: "Like lesson and review counts",
                        forum: "Like on the forum",
                    },
                },
            },
        }
        let dialog = new wkof.Settings(config);
        dialog.open();
    }
})(window.wkof);