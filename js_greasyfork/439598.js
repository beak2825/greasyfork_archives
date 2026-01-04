// ==UserScript==
// @name         Leaderboard in not dumb place
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  urmom
// @author       b to the m to the n
// @match        https://www.speedrun.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @icon         https://www.google.com/s2/favicons?domain=speedrun.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439598/Leaderboard%20in%20not%20dumb%20place.user.js
// @updateURL https://update.greasyfork.org/scripts/439598/Leaderboard%20in%20not%20dumb%20place.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if ($('#leaderboard-dropdown').length == 0)
        return;

    let init = false;
    let addLeaderboard = function(content) {
        let lbPosition = GM_config.get('Position');
        if (lbPosition < 0) lbPosition = 0;
        if (lbPosition >= elements.length)
            $('#widget').append(content);
        else
            $(content).insertBefore(elements[lbPosition]);
        $('#leaderboard-dropdown').remove();

        if (!init) {
            $('#bmnLbSettings').click(function() {
                GM_config.open();
            });
            init = true;
        }


        var lbMaxHeight = GM_config.get('MaxHeight');
        $('#bmnLbList').css({
            'overflow': 'auto',
            'max-height': lbMaxHeight
        });
    };

    let elements = $('#widget').children('.widget-container, [component-name]');
    GM_config.init(
        {
            'id': 'SRDCLeaderboardList', // The id used for this instance of GM_config
            'title': 'Leaderboard in not dumb place',
            'fields': // Fields object
            {
                'Position':
                {
                    'label': 'Position Below<br><span style="font-weight:normal"><b>0</b>: above Game Stats, <b>1</b>: Game Stats, <b>2</b>: Latest News, <b>3</b>: Recent Runs, <b>4</b>: Recent Threads, <b>5</b>: Moderators.',
                    'type': 'int',
                    'min': 0,
                    'max': elements.length
                },
                'MaxHeight': // This is the id of the field
                {
                    'label': 'Max Height of the list<br><span style="font-weight:normal">Must be a valid CSS length, e.g. <b>500px</b> (500 pixels), <b>90vh</b> (90% of the browser\'s vertical height)</span>', // Appears next to field
                    'type': 'text', // Makes this setting a text field
                    'default': '75vh' // Default value if user doesn't change it
                }
            },
             'events': // Callback functions object
            {
                'init': function() { null },
                'open': function() { null },
                'save': function() {
                    addLeaderboard( $('#bmnLbLeaderboards') );
                },
                'close': function() { null },
                'reset': function() { null }
            }
        });

    addLeaderboard( $('<div id="bmnLbLeaderboards" class="widget-container"><div class="widget-header"><div class="widget-title color-text">Leaderboards<span id="bmnLbSettings" style="float:right; cursor:pointer; font-size:130%; margin-top:-5px">⚙</span></div></div><div id="bmnLbList" class="widget-body">' + $('#leaderboard-dropdown-menu').html() + '</div></div>') );
})();