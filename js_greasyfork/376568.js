// ==UserScript==
// @name         BL R9.75 Slots Manager
// @namespace    Bootleggers R9.75
// @version      0.0.2
// @description  Maintain low casino wealth status by depositing or withdrawing money as needed
// @author       24/BD
// @include      https://www.bootleggers.us/slot*
// @require      https://code.jquery.com/jquery-3.3.1.js
// @update       https://greasyfork.org/scripts/376568-bl-r9-75-slots-manager/code/BL%20R975%20Slots%20Manager.user.js
// @downloadURL https://update.greasyfork.org/scripts/376568/BL%20R975%20Slots%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/376568/BL%20R975%20Slots%20Manager.meta.js
// ==/UserScript==

$(document).ready(function() {
    var moneyLowest = 17000000;//Lower wealth status + 3x max bet
    var moneyHighest = 26999999;//Higher wealth status - 3x max bet
    var moneyOnHand = Math.floor((moneyLowest + 26999999)/2);
    var yourName = localStorage.getItem("yourName") != null ? localStorage.getItem("yourName") : false;

    if (window.location.href == "https://www.bootleggers.us/slotscript") {
        document.title = yourName + " | RT Script";
        $("body").css({"margin": "0"});
        var rtFrame = document.createElement("iframe");
        rtFrame.width = "100%";
        rtFrame.height = "100%";
        rtFrame.style.position = "absolute";
        rtFrame.src = "https://www.bootleggers.us/slot.php";
        $("body").children().remove();
        $("body").append(rtFrame);
        $("iframe").css({"border-width":"0px"});
        setTimeout(function() {
            window.location.href = "https://www.bootleggers.us/slotscript";
        }, 5000);
    } else if (window.location.href == "https://www.bootleggers.us/slot.php") {
        var tableType;
        for (var i = 1; i <= 5; i++) {
            if ($("#panel" + i)[0]) {
                tableType = $("#panel" + i).find("td.header")[0].textContent;
                var rtPanel = tableType.includes("Slots") ? document.getElementById("panel" + i) : null;
            } else {
                break;
            }
        }
        var rtMoney = rtPanel ? rtPanel.getElementsByTagName('span')[0].innerText.replace(/,/g, '').slice(1) : null;
        var maxBet = rtPanel ? rtPanel.getElementsByTagName('input')[0].value : null;
        var withRadio = rtPanel ? rtPanel.getElementsByTagName('label')[1] : null;
        var depRadio = rtPanel ? rtPanel.getElementsByTagName('label')[2] : null;
        var moneyInput = rtPanel ? rtPanel.getElementsByTagName('input')[2] : null;
        var updateBut = rtPanel ? rtPanel.querySelectorAll('[type="submit"]')[0] : null;
        var inJail = $(".insideTables > table > tbody > tr > td > .countdown-timeleft")[0];
        var scriptCheck = $(".g-recaptcha")[0] == null ? false : true;

        function loadBJ(){
            window.location.href = '/slot.php'};



        if ((scriptCheck) || (inJail)) {
            //setTimeout(loadBJ, 5000);
            //console.log("Reloading blackjack in: 5");
        } else {
            if (rtMoney > moneyHighest) {

                moneyInput.value = rtMoney - moneyOnHand;
                withRadio.click();
                updateBut.click();


            } else if (rtMoney <= moneyLowest){
                moneyInput.value = moneyOnHand - rtMoney;
                depRadio.click();
                updateBut.click();
            } else {
                //setTimeout(loadBJ, 5000);
                //console.log("Reloading blackjack in: 5");
            }
        }
    }
});