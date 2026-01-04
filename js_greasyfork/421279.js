// ==UserScript==
// @name         R*1 / HvR Attack Assistance
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  Request Attack/Smoke/Tear Gas assistance in R discord from attack screen
// @author       monogamy [2563432]
// @match        https://www.torn.com/loader.php?sid=attack*
// @match        https://www.torn.com/preferences.php*
// @grant        GM_xmlhttpRequest
// @connect      torn.egbt.xyz
// @downloadURL https://update.greasyfork.org/scripts/421279/R%2A1%20%20HvR%20Attack%20Assistance.user.js
// @updateURL https://update.greasyfork.org/scripts/421279/R%2A1%20%20HvR%20Attack%20Assistance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your API Key
    var tornAPI = '';
    // Automatically get API key instead
    const getAPI = true;
    // Are we testing?
    const test = false;

    var helpRequested = false;

    let oldHeader = $( '[class^="appHeaderAttackWrap___"]' )
    let newHeader = oldHeader.clone();
    let newTitle = newHeader.find( 'h4' );
    newHeader.find('[class^="linksContainer___"],[class^="bottomSection___"]').remove();
    newTitle.text("");
    newTitle.append( "HvR Request Assistance: <button id='hvr-help-attack' class='torn-btn'>Attack</button> <button id='hvr-help-smoke' class='torn-btn'>Smoke</button> <button id='hvr-help-tear' class='torn-btn'>Tear Gas</button>" );
    oldHeader.after(newHeader);

    $( "#hvr-help-attack" ).click(function(){
        $(this).text("Attack Requested");
        if (!test) { $(this).removeAttr("id").prop("onclick", null).off("click") }
        helpRequested = true
        requestHelp('attack')
    });
    $( "#hvr-help-smoke" ).click(function(){
        $(this).text("Smoke Requested");
        if (!test) { $(this).removeAttr("id").prop("onclick", null).off("click") }
        helpRequested = true
        requestHelp('smoke')
    });
    $( "#hvr-help-tear" ).click(function(){
        $(this).text("Tear Gas Requested");
        if (!test) { $(this).removeAttr("id").prop("onclick", null).off("click") }
        helpRequested = true
        requestHelp('tear')
    });

    function requestHelp(helpType){
        let sendobj = { 'type': helpType };
        if (test) { sendobj.test = true };
        if (tornAPI) { sendobj.tornAPI = tornAPI };

        sendobj.player_id = Number($('#websocketConnectionData').text().match(/"userID":"(\d+)"/i)[1]);
        sendobj.player_name = $('#websocketConnectionData').text().match(/"playername":"(\w+?)"/i)[1];
        $( '[id^="player-health-value_"]' ).each(function(idx,elem){
            let thisName = $(elem).closest('[class^="topWrap___"]').find('[class^="userName___"]')[0].textContent;
            let thisHealth = elem.textContent;
            if (thisName == sendobj.player_name) {
                sendobj.player_health = thisHealth;
                if (test) { console.log(`me -> ${thisName} ${thisHealth}`) }
            } else {
                sendobj.opponent_name = thisName;
                sendobj.opponent_health = thisHealth;
                if (test) { console.log(`them -> ${thisName} ${thisHealth}`) }
            }
        });
//        sendobj.opponent_id = opponent_id;

        sendobj.curtime = $('span.server-date-time').text();
        sendobj.version = GM_info.script.version
        sendobj.fightlink = $(location).attr("href");

        let linkSlices = sendobj.fightlink.split('=');
        sendobj.opponent_id = Number(linkSlices[linkSlices.length-1]);

        if (test) { console.log(sendobj) };
        send(sendobj);
    }

    function fightOver() {
        let sendobj = { 'type': 'fightOver' };
        if (test) { sendobj.test = true };
        if (tornAPI) { sendobj.tornAPI = tornAPI };

        sendobj.player_id = Number($('#websocketConnectionData').text().match(/"userID":"(\d+)"/i)[1]);
        sendobj.player_name = $('#websocketConnectionData').text().match(/"playername":"(\w+?)"/i)[1];
        sendobj.curtime = $('span.server-date-time').text();
        sendobj.version = GM_info.script.version

        $( '[id^="player-health-value_"]' ).each(function(idx,elem){
            let thisName = $(elem).closest('[class^="topWrap___"]').find('[class^="userName___"]')[0].textContent;
            if (thisName != sendobj.player_name) {
                sendobj.opponent_name = thisName;
            }
        });

        let linkSlices = $(location).attr("href").split('=');
        sendobj.opponent_id = Number(linkSlices[linkSlices.length-1]);

        if (test) { console.log(sendobj) };
        send(sendobj);
    }

    function send(myObject) {
        let url = 'https://torn.egbt.xyz/submit-hvr-help.php';
        if (test) { url = 'https://torn.egbt.xyz/submit-hvr-help-test.php' }

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: JSON.stringify(myObject),
            responseType: 'text',
            onload: function(r) {
                console.log('sendPhp (HTTP ' + r.status + "): " + r.responseText);
            }
        });
    }

    if (localStorage.monogamy_tornAPIkey) { tornAPI = localStorage.monogamy_tornAPIkey }
        else if ( tornAPI ) { localStorage.monogamy_tornAPIkey = tornAPI }
    const tapiCallBack = function(mutationsList, observer) {
        let apiInput = $( '#react-root' ).find('[class^="input___"]')
        if ( apiInput.length && apiInput[0].value.length == 16 ) {
            localStorage.monogamy_tornAPIkey = apiInput[0].value
            tornAPI = localStorage.monogamy_tornAPIkey
            console.log("API Key Find Success")
            tapiObserver.disconnect()
        }
    };
    const tapiObserver = new MutationObserver(tapiCallBack);
    const tapiObserverConfig = { attributes: false, childList: true, subtree: true };
    if (getAPI) { tapiObserver.observe( $( '#react-root' )[0], tapiObserverConfig) }

    const defenderCallBack = function(mutationsList, observer) {
		var i;
        let defBtn = $( '#defender' ).find('[class^="btn___"]')
		for (i = 0; i < defBtn.length; i++) {
			console.log('defBtn: ', defBtn[i].textContent)
            let fightEndStrings = ["leave", "mug", "hosp", "continue"]
            if (fightEndStrings.includes(defBtn[i].textContent.toLowerCase())) {
                console.log("Found ", defBtn[i].textContent.toUpperCase(), " Button")
                defenderObserver.disconnect()
                // send message to discord that this fight is over!
                if ( helpRequested ) { fightOver() }
                return
            }
		}
    };
    const defenderObserver = new MutationObserver(defenderCallBack);
    const defenderObserverConfig = { attributes: false, childList: true, subtree: true };
    defenderObserver.observe( $( '#react-root' )[0], defenderObserverConfig)
})();