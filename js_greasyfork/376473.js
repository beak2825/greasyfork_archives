// ==UserScript==
// @name         BL R9.75 Blackjack Manager
// @namespace    Bootleggers R9.75
// @version      0.0.4
// @description  Maintain low casino wealth status by depositing or withdrawing money as needed
// @author       24/BD
// @include      https://www.bootleggers.us/blackjack*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @update       https://greasyfork.org/scripts/376473-bl-r9-75-blackjack-manager/code/BL%20R975%20Blackjack%20Manager.user.js
// @downloadURL https://update.greasyfork.org/scripts/376473/BL%20R975%20Blackjack%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/376473/BL%20R975%20Blackjack%20Manager.meta.js
// ==/UserScript==

$(document).ready(function() {
    var moneyLowest = 5000000;
    var moneyHighest = 7999999;
    var moneyOnHand = Math.floor((moneyLowest + moneyHighest)/2);

    var yourName = localStorage.getItem("yourName") != null ? localStorage.getItem("yourName") : false;

    if (window.location.href == "https://www.bootleggers.us/blackjackscript") {
        document.title = yourName + " | BJ Script";
        $("body").css({"margin": "0"});
        var bjFrame = document.createElement("iframe");
        bjFrame.width = "100%";
        bjFrame.height = "100%";
        bjFrame.style.position = "absolute";
        bjFrame.src = "https://www.bootleggers.us/blackjack.php";
        $("body").children().remove();
        $("body").append(bjFrame);
        $("iframe").css({"border-width":"0px"});
        setTimeout(function() {
            window.location.href = "https://www.bootleggers.us/blackjackscript";
        }, 5000);
    } else if (window.location.href == "https://www.bootleggers.us/blackjack.php") {
        var bjPanel = document.getElementById('panel1') ? document.getElementById('panel1') : null;
        var bjMoney = bjPanel ? bjPanel.getElementsByTagName('span')[0].innerText.replace(/,/g, '').slice(1) : null;
        var maxBet = bjPanel ? bjPanel.getElementsByTagName('input')[0].value : null;
        var withRadio = bjPanel ? bjPanel.getElementsByTagName('label')[1] : null;
        var depRadio = bjPanel ? bjPanel.getElementsByTagName('label')[2] : null;
        var moneyInput = bjPanel ? bjPanel.getElementsByTagName('input')[2] : null;
        var updateBut = bjPanel ? bjPanel.querySelectorAll('[type="submit"]')[0] : null;
        var inJail = $(".insideTables > table > tbody > tr > td > .countdown-timeleft")[0];
        var scriptCheck = $(".g-recaptcha")[0] == null ? false : true;

        function loadBJ(){
            window.location.href = '/blackjack.php'};



        if ((scriptCheck) || (inJail)) {
            //setTimeout(loadBJ, 5000);
            //console.log("Reloading blackjack in: 5");
        } else {
            if (bjMoney > moneyHighest) {

                moneyInput.value = bjMoney - moneyOnHand;
                withRadio.click();
                updateBut.click();


            } else if (bjMoney <= moneyLowest){
                moneyInput.value = moneyOnHand - bjMoney;
                depRadio.click();
                updateBut.click();
            } else {
                //setTimeout(loadBJ, 5000);
                //console.log("Reloading blackjack in: 5");
            }
        }
    }
});