// ==UserScript==
// @name           LandGrab: enhanced mouseovers
// @namespace      landgrab_enh_mouseovers
// @description    Enhances LandGrab's mouse-over functionality
// @include        http://landgrab.net/landgrab/ViewBoard
// @include        http://landgrab.net/landgrab/RealtimeBoard
// @version        1.0.3
// @downloadURL https://update.greasyfork.org/scripts/407809/LandGrab%3A%20enhanced%20mouseovers.user.js
// @updateURL https://update.greasyfork.org/scripts/407809/LandGrab%3A%20enhanced%20mouseovers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('disable_overs').parentNode.setAttribute('title', 'Show Borders\n<shift key> Show Continents\n<ctrl key> Show player Territories');

    addGlobalStyle('#cp_territory_info { margin: 20px; border-width: 10px; border-style: ridge; border-color: rgb(135, 73, 36) }');

    // Create a div for displaying our territory info
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', 'cp_territory_info');
    newDiv.style.visibility='hidden';
    document.getElementById('control_panel_div').appendChild(newDiv);

    // Hijack the onmouseover and onmouseleave events for the map
    var allAreas = document.getElementById('terrmap').querySelectorAll("area")
    for (let ele of allAreas) {
    	ele.onmouseover = tOverEnhanced;
    }

    // This reproduces the tOver function with our enhancements
    function tOverEnhanced(event) {
        var ele = event.currentTarget;
        document.getElementById('terrmap').setAttribute("g_latestArea","" + ele.getAttribute('terrid'));

        // The overs variable is not set on page load for Firefox for some reason.
        if (document.getElementById('disable_overs').checked) {
            tPopupEnhanced(ele.getAttribute('terrid'), event);
        }
    };

    // This reproduces the tPopup function with our enhancements
    function tPopupEnhanced(terrId, event) {
        var windowScope = unsafeWindow;

        var _ba = windowScope.terrToContMap.get(terrId);
        var _bb = windowScope.continents[""+_ba];
        var _bc = windowScope.armyOwnerHashtable.get(terrId);
        var _bd = windowScope.players[""+_bc];
        var _be = windowScope.territories[""+terrId];

        var sb = [];
        sb[sb.length] = "<TABLE style='border: 0x solid black; width: 100%'>";
        sb[sb.length] = "<TR style='background-color: " + _be.ccd +"; color: " + _be.tttc + "'><TD>";
        sb[sb.length] = "<SPAN style='font: bold 20px Arial, sans-serif;'>" + _be.name + "</SPAN>";
        sb[sb.length] = "</TD></TR>";
        sb[sb.length] = "<TR style='background-color: " + _be.ccl + "; color: " + "black" + "'><TD>";
        sb[sb.length] = "<SPAN style='font: bold 16px Arial, sans-serif;'>";
        sb[sb.length] = _bb.name;
        sb[sb.length] = "(";
        sb[sb.length] = _bb.value;
        sb[sb.length] = ")</SPAN><BR>Owner: ";
        if(_bd != null && typeof _bd != "undefined") {
            sb[sb.length]=_bd.name;
        }
        else {
            if (windowScope.beanFogOfWar) {
                sb[sb.length] = "unknown";
            }
            else {
                sb[sb.length] = "no one (yet)";
            }
        }

        sb[sb.length] = "<br>Armies: ";
        sb[sb.length] = windowScope.getCurrentArmies(terrId, _be.armies);
        if (windowScope.beanUsingTerritoryAreas) {
            sb[sb.length] = "<br>Area: ";
            sb[sb.length] = _be.area;
        }

        if (_be.fortress&&!_be.capitol) {
            sb[sb.length]="<br><img width=15 height=15 src='images/fortress.png'> (Fortress)";
        }

        if(_be.capitol) {
            sb[sb.length]="<br><img width=14 height=15 src='images/capitol.png'> (Capitol)";
        }

        if (_be.leader) {
            sb[sb.length]="<br><img width=15 height=15 src='images/leader.png'> (Leader)";
        }

        if (_be.card != -1) {
            sb[sb.length]="<br><img width=15 height=15 src='images/cards/card_";
            sb[sb.length]=_be.card;
            sb[sb.length]=".png'> (Card Owned)";
        }

        sb[sb.length] = "</TD></TR></TABLE>";

        var msg=sb.join("");
        document.getElementById('cp_territory_info').style.visibility='visible';
        document.getElementById('cp_territory_info').innerHTML = msg

        if (typeof windowScope.attack_from_id == 'undefined' || windowScope.attack_from_id < 0) {
            if (event.shiftKey) {
                windowScope.highlightContTerrs(_ba);
            }
            else if (event.ctrlKey) {
                windowScope.highlightTerrsForPlayer(_bc, false);
            }
            else {
                windowScope.borderShow(terrId);
            }
        }
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }

})();


