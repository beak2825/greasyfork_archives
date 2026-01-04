// ==UserScript==
// @name         Grarrl Keno Autoplayer
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      1.1
// @description  Autoplay Grarrl Keno on Neopets
// @author       RealisticError
// @match        http://www.neopets.com/prehistoric/keno.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371962/Grarrl%20Keno%20Autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/371962/Grarrl%20Keno%20Autoplayer.meta.js
// ==/UserScript==

//To change your time values: Math.floor((Math.random() * ((MAXTime - MINTime) + 1)) + MINTime);
var x = Math.floor((Math.random() * (1200 - 900) + 1) + 900); //1000 = 1 second
//If you want "alertWin" to function correctly replace the line above with the following : var x = Math.floor((Math.random() * (7500 - 6500) + 1) + 6500); //1000 = 1 second
function timeout() {	//timeout function
    'use strict';

    //Variables for setting up the game
    var ValueToBet = '10';                                   //Enter the amount you'd like to bet here
    // **Only need to insert numbers if "useQuickpick" is set to false
    var numbersToBet = [];                                   //Enter 10 or less numbers between 1 and 80 eg. [1,2,3,4,5]
    var useQuickpick = true;
    var quickpickNumberToBet = 10;                           //use this variable to set how many numbers you want the quickpick button to choose. default: 10;
    var tryForAvatar = true;
    var alertWin = false;                                    //Set this to true if you would like to be alerted everytime you win.
    var alertWinThreshold = 0;                            //Set this to 0 to alert EVERY win!



    if($('[classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"]').length === 0) {
        //Internal variables
        var quickpickButton = $('#content > table > tbody > tr > td.content > form > center > input[type="button"]:nth-child(5)');
        var betInput = $("#content > table > tbody > tr > td.content > form > center > input[type='text']:nth-child(2)");
        var hatchThoseEggs = $('#content > table > tbody > tr > td.content > form > center > input[type="submit"]:nth-child(3)');
        var maxbetValue = $('.content > p:nth-child(4) > b:nth-child(1)').text().replace(/\D/g,'');

        if(numbersToBet.length === 0 && useQuickpick === false) {

            var enableQuickpick = confirm("You must either enable 'useQuickpick' or enter numbers into 'NumbersToBet' Click OK to enable quickpick.");

            if(enableQuickpick) { useQuickpick = true};
        }


        var startKeno = function() {

            betInput.val(parseInt(ValueToBet) > maxbetValue ? maxbetValue : ValueToBet);

            if(useQuickpick) {

                quickpickButton.attr("onclick", "random_eggs(" + (quickpickNumberToBet > 10? 10 : quickpickNumberToBet) + ")");

                quickpickButton.click();
            } else {

                set_random_boxes(numbersToBet.slice(0, 10));

            }

            if(parseInt($('#npanchor')[0].innerText.replace(/,/g, '')) < parseInt(ValueToBet)) {
                alert('You need more Neopoints to play!');

            } else{
                hatchThoseEggs.click();

            }
        }

        startKeno();

    } else {

        if($('body:contains("You are now eligible to use")').length !== 0 && tryForAvatar) {

            alert("Congratulations, you got the Grarrl Keno avatar!!");

        } else if($('#prize_result:contains("Neopoints")').length !== 0 && alertWin) {
            var continueRefreshing;

            if($('#prize_result > font > b').text() > alertWinThreshold) {
                continueRefreshing = confirm("Congratulations, you won" + $('#prize_result > font > b').text() + "!!\n Click OK to continue autoplaying, or cancel to stop");
            } else if(alertWinThreshold === 0) {
                continueRefreshing =  confirm("Congratulations, you won" + $('#prize_result > font > b').text() + "!!\n Click OK to continue autoplaying, or cancel to stop");
            }
            if(continueRefreshing) { window.location.reload(); }
        } else {
            if(parseInt($('#npanchor')[0].innerText.replace(/,/g, '')) <= parseInt(ValueToBet)) {
                alert('You need more Neopoints to play!');

            } else {
            window.location.reload();
            }
        }
    }
}


window.setTimeout(timeout, x)