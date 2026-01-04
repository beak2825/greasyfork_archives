// ==UserScript==
// @name         WME Closures - Florida Highway Selector
// @namespace    https://greasyfork.org/en/users/107283-will-danner-willdanneriv-3
// @version      0.1
// @description  To allow quick selection of highways for road closures.
// @author       willdanneriv
// @include     https://www.waze.com/*editor/*
// @include     https://editor-beta.waze.com/*
// @exclude     https://www.waze.com/*user/editor/*
// @grant        none
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/31944/WME%20Closures%20-%20Florida%20Highway%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/31944/WME%20Closures%20-%20Florida%20Highway%20Selector.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */

var WMECFHSName = GM_info.script.name;
var WMECFHSVersion = GM_info.script.version;

console.log(WMECFHSName + WMECFHSVersion + " is running");

(function() {
    'use strict';

    function bootstrap(tries) {
        tries = tries || 1;

        if (window.W &&
            window.W.map &&
            window.W.model &&
            window.W.loginManager.user &&
            $ && window.jscolor) {
            init();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    function test(){

        // for(var key in highwaysTypes) {
        //    $('#CFHSHighway')
        //        .append($("<option></option>")
        //                .attr("value",key)
        //                .text(key)
        //               );
        //}
        //populateHighways('#CFHSHighway');

        console.log("WMECFHS... populating highways");

        //changes the options of the select tag for types when a new option is selected in the category select tag.
        // $(document).ready(function() {
        //    $('#CFHSHighway').change(function(){
        //        populateExits(this);
        //    });
        // });

        // function populateExits(elm) {
        //    var highway = $(elm).find("option:selected").attr('value');
        //    var exits = highwayTypes[highway].split(",");
        //    $('#CFHSExits')
        //        .append($("<option></option>")
        //                .attr("value",exits[i])
        //                .text(exits[i])
        //               );
        // }
        console.log("WMECFHS... populating exits");
    }

    function init(){

        var highwaysTypes = { "I4": "Exit 1 - Some Road, Exit 2 - Some Road, Exit 5 - Some Road", "I95": "Exit 87 - Some Road, Exit 99 - Some Road, Exit 145 - Some Road" };

        var $section = $("<div>", {style:"padding:8px 16px", id:"CFHS"});
        $section.html([
            '<p>',
            '<h4>Highway</h4>',
            '</p>',
            '<select id="CFHSHighway" name="CFHSHighway"></select>',
            '<p>',
            '<h4>Exit</h4>',
            '</p>',
            '<select id="CFHSExits" name="CFHSExits"></select></span></div>'
        ].join(' '));
        new WazeWrap.Interface.Tab('CFHS', $section.html(), test);
    }

})();