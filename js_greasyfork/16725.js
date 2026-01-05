// ==UserScript==
// @name         MyAnimeList(MAL) - Hover List, Notifications and Profile dropdown
// @version      1.0.8
// @description  Why click on the icons when you can hover?
// @author       Cpt_mathix
// @match        *://myanimelist.net/*
// @exclude      *://myanimelist.net/animelist*
// @exclude      *://myanimelist.net/mangalist*
// @grant        none
// @namespace    https://greasyfork.org/users/16080
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/16725/MyAnimeList%28MAL%29%20-%20Hover%20List%2C%20Notifications%20and%20Profile%20dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/16725/MyAnimeList%28MAL%29%20-%20Hover%20List%2C%20Notifications%20and%20Profile%20dropdown.meta.js
// ==/UserScript==

(function() {
    function hover_list_notifications_profile_dropdown() {
        var load = true;

        var properties = {
            sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)
            interval: 0, // number = milliseconds for onMouseOver polling interval
            over: showInfo, // function = onMouseOver callback (required)
            timeout: 300, // number = milliseconds delay before onMouseOut
            out: hideInfo // function = onMouseOut callback (required)
        };

        $('#header-menu > div.header-menu-unit.header-list').hoverIntent(properties);

        $('#header-menu > div.header-menu-unit.header-notification').hoverIntent(properties);

        $('#header-menu > div.header-menu-unit.header-profile').hoverIntent(properties);

        function showInfo() {
            if ($(this).hasClass('header-notification') && load) {
                $('#header-menu > div.header-menu-unit.header-notification').find('.header-notification-button')[0].click();
                load = false;
            }

            if (! $(this).hasClass('on')) {
                $('.header-list-dropdown').hide();
                $('.header-notification-dropdown').hide();
                $('.header-menu-dropdown').hide();
                $(this).find('.header-list-dropdown').show();
                $(this).find('.header-notification-dropdown').show();
                $(this).find('.header-notification-button').attr("aria-expanded", true);
                $(this).find('.header-menu-dropdown').show();
                $(this).addClass('on');
            }
        }

        function hideInfo() {
            $(this).find('.header-list-dropdown').hide();
            $(this).find('.header-notification-dropdown').hide();
            $(this).find('.header-menu-dropdown').hide();
            $(this).removeClass('on');
        }
    }

    var hoverScript = document.createElement('script');
    hoverScript.appendChild(document.createTextNode('('+ hover_list_notifications_profile_dropdown +')();'));
    (document.body || document.head || document.documentElement).appendChild(hoverScript);
})();