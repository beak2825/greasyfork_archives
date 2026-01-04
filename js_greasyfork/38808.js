// ==UserScript==
// @name         Bookie Alert
// @namespace    https://www.torn.com/profiles.php?XID=2063442
// @version      0.1.1
// @description  Add an alert to Bookie page if there is a bet which closes in less than 24h
// @author       dgumf
// @match        *.torn.com/bookie.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38808/Bookie%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/38808/Bookie%20Alert.meta.js
// ==/UserScript==

var debug = true;
var initialTimeout = 500;
var interval = 2000;

setTimeout(handleBets, initialTimeout);
setInterval(handleBets, interval);

function handleBets () {

    log_debug('in > handleBets');

    var jNode = $('#back');

    var greenItem;
    var countDown;

    // console.log(jNode.text());
    var backText = jNode.text();

    if (backText == 'Back'){
        log_debug('single bet page');
        greenItem = $('li.bg-green');
        //console.log(greenItem);
        if (greenItem.html()){
            countDown = $('.hasCountdown');
        }
    }
    else if (backText == 'Back to Casino'){
        log_debug('all bets page');
        greenItem = $('li.bg-green').eq(0);
        //console.log(greenItem);
        if (greenItem.html()){
            countDown = greenItem.find('span.hasCountdown');
        }
    }
    else {
        log_debug('No Back button yet');
    }

    var vl;
    if (countDown){
        vl = countDown.text();
    }

    log_debug(vl);

    var infoBox = $('div.right-round');

    if (vl && vl.length > 0 && (vl.indexOf('d') == -1 || vl.indexOf(' 0d') > 0) ){
        $('.dgumf').remove();
        var addedAlert = '<div class="info-msg border-round dgumf" style="background-color: #ff5050"><i class="info-icon"></i><div class="delimiter"><div class="msg right-round">You have a bet which locks in less than 24 hours: ' + vl + '</div></div></div>';
        infoBox.append(addedAlert);
        greenItem.attr("style", "background-color: #ff5050");
    }
}

function log_debug(message){
    if (debug){
        console.log('[DEBUG] ' + message);
    }
}

function log_info(message){
    console.log('[INFO] ' + message);
}
