// ==UserScript==
// @name         OL: showTransfermarketPlayerViewLastTransferMoney
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zeigt den letzten Transferbetrag eines Spielers am TM an, sofern einer vorhanden ist
// @author       König von Weiden
// @match        https://www.onlineliga.de/
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442877/OL%3A%20showTransfermarketPlayerViewLastTransferMoney.user.js
// @updateURL https://update.greasyfork.org/scripts/442877/OL%3A%20showTransfermarketPlayerViewLastTransferMoney.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        const timeInterval = 1000;
        let currentTransferMoney;
        let interval = setInterval(waitForKeyElement, timeInterval);

        async function waitForKeyElement(){
            if($("#playerView .player-injury-wrapper").length==1 && $(".ol-last-transfer-money").length==0){
                currentTransferMoney = parseInt($(".bid-form .row.text-left.hidden-xs .col-md-4.col-sm-4.col-xs-4.text-center.padding-top-20 b.strong-black").eq(1).text().trim().replace(/\./g,'').match(/[0-9]+/g)[0]);
                let playerID = parseInt($("span.player-steckbrief").eq(0).attr("onclick").match(/[0-9]+/g));
                getPlayerTransferMoney(playerID);
            }
        }

        function getPlayerTransferMoney(playerID){
            let link = "/player/transferhistory?playerId="+playerID;
            let playerData = $.ajax({type: "GET", url: link, async: false}).responseText;
            let transferMoney = $("<div>" + playerData + "</div>").find(".hidden-lg.hidden-md.hidden-sm.col-xs-10.text-right.transferhistory-former-team").eq(0).text().trim();
            if(transferMoney==""){
            }
            else{
                let transferMoneyInt = parseInt(transferMoney.replace(/\./g,'').match(/[0-9]+/g)[0]);
                let fontColor;
                if(transferMoneyInt>currentTransferMoney){
                    fontColor = "#63bf7c";
                }
                else{
                    fontColor = "#f8696b";
                }
                $(".bid-form .row.text-left.hidden-xs .col-md-4.col-sm-4.col-xs-4.text-center.padding-top-20 b.strong-black").eq(1).after(
                    "<br><b class=\"font-roboto transfer-player-overview-font-small ol-last-transfer-money\">"+transferMoney+"</b>"
                );
                $(".font-roboto.transfer-player-overview-font-small.ol-last-transfer-money").attr("style","color:"+fontColor+";");
            }
        }
    });
})();