// ==UserScript==
// @name         Wanikani: Level Duration 2
// @namespace    Wanikani: Level Duration
// @version      2.8.1
// @description  Displays the number of days you have spent on the current level.
// @author       Kumirei
// @include      /^https://(www|preview).wanikani.com*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41084/Wanikani%3A%20Level%20Duration%202.user.js
// @updateURL https://update.greasyfork.org/scripts/41084/Wanikani%3A%20Level%20Duration%202.meta.js
// ==/UserScript==
/*jshint esversion: 8 */

(function(wkof) {
    let header = document.getElementsByClassName('global-header')[0];
    if (!header) return;

    // Make sure that WKOF is installed
    var script_name = 'Level Duration';
    if (!window.wkof) {
        if (confirm(script_name+' requires Wanikani Open Framework.\nDo you want to be forwarded to the installation instructions?')) {
            window.location.href = 'https://community.wanikani.com/t/instructions-installing-wanikani-open-framework/28549';
        }
        return;
    }
    // If it is installed run the script
    else {
        wkof.include('Menu,Settings,Apiv2');
        wkof.ready('Menu,Settings,Apiv2')
            .then(load_settings)
            .then(install_menu)
            .then(install_css)
            .then(fetch_date)
            .then(install_display);
    }

    let date, level_duration;

    //------------------------------------------------------//
    //--------------------SET UP IN WKOF--------------------//
    //------------------------------------------------------//

    function load_settings() {
        var defaults = {
            format: "long",
        };
        return wkof.Settings.load('level_duration', defaults);
    }

    function install_menu() {
        var config = {
            name: 'level_duration_settings',
            submenu: 'Settings',
            title: 'Level Duration',
            on_click: open_settings
        };
        wkof.Menu.insert_script_link(config);
    }

    function open_settings(items) {
        var config = {
            script_id: 'level_duration',
            title: 'Level Duration',
            on_save: update_display,
            content: {
                format: {
                    type: 'list',
                    label: 'Format',
                    default: 'long',
                    hover_tip: 'Select how you want the duration to display',
                    size: 6,
                    content: {
                        long: format_date('long'),
                        decimal_long: format_date('decimal_long'),
                        decimal: format_date('decimal'),
                        short: format_date('short'),
                        japanese: format_date('japanese'),
                        japanese_custom: format_date('japanese_custom') + ' (FangSong font)',
                    },
                },
            },
        };
        let dialog = new wkof.Settings(config);
        dialog.open();
    }

    //------------------------------------------------------//
    //----------------------RUN SCRIPT----------------------//
    //------------------------------------------------------//

    function install_css() {
        document.getElementsByTagName('head')[0].insertAdjacentHTML('beforeend', `
<style id="LevelDurationCSS">
    .global-header {padding-bottom: 14px;}
    #level-duration {
        color: #999 !important;
        text-shadow: 0 1px 0 #ffffff;
        font-size: 14px;
        margin-top: 4px;
        line-height: 0;
        text-align: center;
    }
    #level-duration-old {
        text-align: center;
        color: #999 !important;
        font-family: "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
        text-shadow: 0 1px 0 #ffffff;
        margin-top: -2px;
    }
    #level-duration.japanese_custom,
    #wkof_ds #level_duration_format option[name="japanese_custom"] {
        font-family: FangSong;
    }
</style>
`);
    }

    // Fetch the level's unlock date
    function fetch_date() {
        return wkof.Apiv2.fetch_endpoint('/level_progressions').then(data => {date = data.data.pop().data.unlocked_at;});
    }

    // Installs the display element and set it up to update every 15 minutes
    function install_display() {
        level_duration = document.createElement('div');
        level_duration.id = 'level-duration';
        level_duration.innerHTML = '<span></span>';
        update_display(level_duration, date);
        let target = document.querySelector('.sitemap .sitemap__section-header[aria-controls="sitemap__levels"').parentElement;
        let old_target = document.querySelector('.dropdown.levels');
        if (old_target) { // Support for old header script
            level_duration.id = 'level-duration-old';
            target = old_target;
        }
        target.append(level_duration);
        setInterval(update_display, 1000*60*15); // Update every 15 minutes
    }

    // Clears the element and inserts new info
    function update_display() {
        let text = format_date();
        level_duration.children[0].innerText = text;
        level_duration.className = wkof.settings.level_duration.format;
    }

    // Returns the date in the user's preferred format
    function format_date(format) {
        let msday = 1000*60*60*24;
        let diff = Date.now()-Date.parse(date);
        let days = Math.floor(diff/msday);
        let hours = Math.floor(diff/msday*24%24);
        let day_text, hour_text = '';
        switch (format || wkof.settings.level_duration.format) {
            case ('long'):
                day_text = days + ' day'+(days==1?'':'s');
                hour_text = ' ' + hours + ' hour'+(hours==1?'':'s');
                if (days >= 100) hour_text = ''; // Otherwise the text gets too long
                break;
            case ('decimal_long'):
                day_text = (days+hours/24).toFixed(1) + ' days on level';
                break;
            case ('decimal'):
                day_text = (days+hours/24).toFixed(1) + ' days';
                break;
            case ('short'):
                day_text = days + 'd';
                hour_text = ' ' + hours + 'h';
                break;
            case ('japanese'):
                day_text = days + '日';
                hour_text = hours + '時';
                break;
            case ('japanese_custom'):
                day_text = days + '日';
                hour_text = hours + '時';
                break;
        }
        return day_text + hour_text;
    }
})(window.wkof);
