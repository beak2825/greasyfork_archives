// ==UserScript==
// @name         Torn Revive Contract
// @namespace    https://tampermonkey.net/
// @version      1.3
// @description  Filter faction member list to only show online and hospitalized
// @author       Marabon
// @match        https://www.torn.com/factions.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397453/Torn%20Revive%20Contract.user.js
// @updateURL https://update.greasyfork.org/scripts/397453/Torn%20Revive%20Contract.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var factioninfowrap = $('.faction-info-wrap').children('.f-war-list');
    var memberlist = factioninfowrap.children('.member-list');
    var storedactive = window.localStorage.getItem('togglereviveactive');
    var active = false;

    if(storedactive == 'true')
    {
        active = true;
    }

    showOnlyRevived();

    factioninfowrap.prepend('<button id="togglerevive" name="togglerevive" type="button">Toggle Revive Only</button>');

    $("#togglerevive").click(toggleRevived);

    function toggleRevived(){
        if(active)
        {
            active = false;
            window.localStorage.setItem('togglereviveactive', 'false');
            console.log('Togglereviveactive set to false');
        }
        else
        {
            active = true;
            window.localStorage.setItem('togglereviveactive', 'true');
            console.log('Togglereviveactive set to true');
        }

        showOnlyRevived();
    }

    function showOnlyRevived(){
        var list = memberlist.children('li');

        list.each(function (index){
            var row = $(this);
            var accwrap = row.children('.acc-wrap');
            var hospreason = accwrap.children('.member-icons').children('ul').children('#icon15').attr('title');
            var status = accwrap.children('.info-wrap').children('.status').children().eq(1).text();
            var hospitalized = false;

            if(typeof hospreason != 'undefined')
            {
                if(~hospreason.indexOf("Hospitalized"))
                {
                    hospitalized = true;
                }
            }

            if(status != 'Hospital' || hospitalized == false)
            {
                if(active)
                {
                    row.attr('style', 'display: none;');
                }
                else
                {
                    row.attr('style', '');
                }
            }
        });

        var factionDesc = $('.faction-description');

        if(active)
        {
            factionDesc.attr('style', 'display: none;');
        }
        else
        {
            factionDesc.attr('style', '');
        }
    }
})();