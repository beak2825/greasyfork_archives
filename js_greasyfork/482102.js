// ==UserScript==
// @name         spreukbot
// @version      1.0.4
// @description  zet auto spreukjes
// @author       Mier
// @include      https://*.grepolis.com/game/*
// @grant        none
// @namespace    https://greasyfork.org/users/983723
// @downloadURL https://update.greasyfork.org/scripts/482102/spreukbot.user.js
// @updateURL https://update.greasyfork.org/scripts/482102/spreukbot.meta.js
// ==/UserScript==

(async function() {
    var sleep = (n) => new Promise((res) => setTimeout(res, n));
    await sleep(2000)
    
    spreukbot = {};

    spreukbot.sb = function(townId) {
        gpAjax.ajaxPost('frontend_bridge', 'execute', {"model_url":"CastedPowers","action_name":"cast","arguments":{"power_id":"town_protection","target_id":townId},"town_id":Game.townId,"nl_init":true});
    };

    spreukbot.narcisme = function(townId) {
        gpAjax.ajaxPost('frontend_bridge', 'execute', {"model_url":"CastedPowers","action_name":"cast","arguments":{"power_id":"narcissism","target_id":townId},"town_id":Game.townId,"nl_init":true})
    }

    spreukbot.pest = function(townId) {
        gpAjax.ajaxPost('frontend_bridge', 'execute', {"model_url":"CastedPowers","action_name":"cast","arguments":{"power_id":"pest","target_id":townId},"town_id":Game.townId,"nl_init":true})
    }

    spreukbot.schicht = function(townId) {
        gpAjax.ajaxPost('frontend_bridge', 'execute', {"model_url":"CastedPowers","action_name":"cast","arguments":{"power_id":"bolt","target_id":townId},"town_id":Game.townId,"nl_init":true})
    }

    var css_roze = {'background': 'fuchsia no-repeat scroll -2px -3px'}

    spreukbot.open_menu = function () {
        GPWindowMgr.Create(GPWindowMgr.TYPE_DIALOG, "narcsb bot");
        spreukbot.window = GPWindowMgr.getOpenFirst(GPWindowMgr.TYPE_DIALOG)
        spreukbot.window.setPosition(['center', 'center']);
        spreukbot.window.setSize(350, 250);

        spreukbot.window.setContent2('<label for="spreuk">spreuk:</label><select name="spreuk" id="spreuk"><option value="narc">narc</option><option value="sb">sb</option><option value="pest">pest</option><option value="schicht">schicht</option></select><br><label for="stadsid">stadsId:</label><input type="text" id="stadsidnarc" name="stadsid"><br><label for="time">oude SB tijd:</label><input type="time" id="timenarc" name="time" step=1><br><button id="submitnarc">toevoegen</button><br><button id="resetnarc">reset</button>');
        spreukbot.submitbutton = document.getElementById("submitnarc");
        spreukbot.submitbutton.onclick = spreukbot.getparams;
        spreukbot.resetbutton = document.getElementById("resetnarc");
        spreukbot.resetbutton.onclick = spreukbot.resetparams;
    }

    spreukbot.getparams = function() {
        spreukbot.time = document.getElementById("timenarc").value;
        spreukbot.townId = document.getElementById("stadsidnarc").value;
        spreukbot.spreuk = document.getElementById("spreuk").value;
        spreukbot.dummydate = new Date()
        spreukbot.dummydate.setHours(spreukbot.time.slice(0,2))
        spreukbot.dummydate.setMinutes(spreukbot.time.slice(3,5))
        spreukbot.dummydate.setSeconds(spreukbot.time.slice(6,8))
    }

    spreukbot.add_menu_button_to_toolbar = function () {
        $('<div class="activity_wrap"><div class="activity narcsb"><div class="divider"></div></div></div>').insertAfter($('.toolbar_activities .middle .activity_wrap:last-child'));

        spreuk_button = $('div .narcsb');

        spreuk_button.css(css_roze);
        spreuk_button.on('click', spreukbot.open_menu);
    }
    
    spreukbot.checktime = function() {
        if (Date.parse(new Date()) == Date.parse(spreukbot.dummydate)) {
            spreukbot.spamspreuk();
            setTimeout(spreukbot.checktime, 1000);
        } else {
            setTimeout(spreukbot.checktime, 50);
        }
    }

    spreukbot.resetparams = function () {
        spreukbot.time = 0;
        spreukbot.townId = "";
        spreukbot.spreuk = "";
    }

    spreukbot.spamspreuk = function () {
        switch (spreukbot.spreuk) {
            case ("narc") :
                spreukbot.narcisme(spreukbot.townId);
                console.log("narcisme");
                break;
            case ("sb") :
                spreukbot.sb(spreukbot.townId);
                console.log("sb");
                break;
            case ("pest") :
                spreukbot.pest(spreukbot.townId);
                console.log("pest");
                break;
            case ("schicht") :
                spreukbot.schicht(spreukbot.townId);
                console.log("schicht");
                break;
        }
    }

    spreukbot.add_menu_button_to_toolbar();
    spreukbot.checktime();
})()