// ==UserScript==
// @name         GoCoinBot
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  Terry
// @author       Terry
// @match        https://csgodicegame.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14847/GoCoinBot.user.js
// @updateURL https://update.greasyfork.org/scripts/14847/GoCoinBot.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

////////////////////////////////////////////////////////////////////////////////////

document.title = "Terry's Betting Bot v4.8";

var cn = confirm('Do you want to use Terry\'s Betting Bot v4.8?');

if (cn === true) {
    var textw = document.getElementById('goCoins').innerText;
    var numtextonly = Number(textw.replace(/[^0-9.]/g,""));
    var pct = prompt("How GoCoins do you want the bot to not bet more than? If nothing is inputed, the bot can bet max.");
    if (pct === null||pct === "") {
        pct = 999999;
    };
    var halir = prompt("How much times do you want the bot to get a loss by betting nothing in a row in order to put in real GoCoins? Automatically set to 2 if nothing is inputed.")
    if (halir === null||halir === "") {
        halir = 2;
    };
    setTimeout(function (){
        var eeexeee = document.getElementById('goCoins').innerText;
        var startinggc = Number(eeexeee.replace(/[^0-9.]/g,""));
        var gcnow = Number(eeexeee.replace(/[^0-9.]/g,""));
        var diffn = gcnow-startinggc;
        $('#rollForm').prepend(
            '<div class="panel panel-default" style="border: 1px solid; color: #333">'+
            '<div class="panel-heading">'+
            '<div align="center">Terry\'s Betting Bot v4.8 \(ง◥▶ ͟ل͜◀◤\)ง</div>'+
            '<div class="panel-body">'+
            '<div align="center"; style="font-size:20px; color: #2ecc71">Recommended minimum bet: <span style="color: #ecf0f1;">' +(Number(eeexeee.replace(/[^0-9.]/g,""))/100).toFixed(2) +' \(1/100 of your GoCoins\)</span></div>'+
            '<div align="center"; style="font-size:20px; color: #3498db">Recommended payout: <span style="color: #ecf0f1;">2.00x</span></div>'+
            '<div align="center"; style="font-size:20px; color: #9b59b6"; id="totalp">Total profit: <span style="color: #ecf0f1;">' +diffn +'</span></div>'+
            '<div align="center"; style="font-size:20px; color: #f1c40f";">The bot is coded to not bet over <span style="color: #e74c3c;">' +pct +'</span> GoCoins.</div>'+
            '<div align="center"; style="font-size:20px; color: #C5EFF7";">The bot has to bet nothing and lose <span style="color: #e74c3c;">' +halir +'</span> times in a row in order to bet real GoCoins.</div>'+
            '<div align="center"; style="font-size:20px; color: #F2417F";">*REFRESH YOUR PAGE IF ANYTHING OUT OF THE ORDINARY HAPPENS*</div>'+
            '<form align="center";"><input type=button value="Refresh" onClick="history.go()"></form>'+
            '<div align="center"; style="font-size:20px; color: #1abc9c";><a href="https://steamcommunity.com/tradeoffer/new/?partner=213307381&token=pnZxQQ87" target="_blank";><u>Please consider donating skins to Terry for making this bot!</u></a></div>'
        );

        var payout = prompt('What do you want your payout to be? It will become 2.00 if nothing is inputed.');
        if (payout === null||payout === "") {
            payout = 2;
        };

        function checksettings(p) {
            document.getElementById('oddsPayout').click();
            document.getElementById('oddsInput').value = p;
            document.getElementById('bet').click();
        }

        checksettings(payout);

        console.log("payout:" +payout);

        var minb = prompt("What is your minimum bet? If you messed up your minimum bet, please refresh your page right away.");

        console.log("min bet:" +minb);

        function winorlose() {
            var ee = document.getElementById('myBetsTable').firstChild.children[1].className;
            if (ee === "success") {
                return true;
            } else if (ee === "danger") {
                return false;
            }     
        }

        var lwor;
        var round = 0;
        var zl = 0;

        var db = false;

        function botting() {
            db = true;
            if (zl < halir) {
                var betv = document.getElementById('bet');
                betv.value = 0;
                var rdi = document.getElementById('roll');
                rdi.click();
                setTimeout(function () {
                    var didiwin = winorlose();
                    if (didiwin === false) {
                        zl = zl + 1;
                        console.log('round ' +round +': lost');
                        rdi.click();
                    } else if (didiwin === true) {
                        zl = 0;
                        console.log('round ' +round +': won');
                        rdi.click();
                    }
                }, 1000);   
            } else {
                if (round !== 0) {
                    var xixxxxx = document.getElementById('myBetsTable').firstChild.children[1].children[2].innerText;
                    var aygb = Number(xixxxxx.replace(/[^0-9.]/g,""))*2
                    var iiiiiiii = document.getElementById('goCoins').innerText;
                    var gc = Number(iiiiiiii.replace(/[^0-9.]/g,""));
                    if (lwor != false) {
                        round = round + 1;
                        var betv = document.getElementById('bet');
                        lwor = true
                        betv.value = minb;
                        var rdi = document.getElementById('roll');
                        rdi.click();
                        setTimeout(function () {
                            var didiwin = winorlose();
                            if (didiwin === false) {
                                zl = zl + 1;
                                console.log('round ' +round +': lost');
                                rdi.click();
                                lwor = false;
                            } else if (didiwin === true) {
                                zl = 0;
                                console.log('round ' +round +': won');
                                rdi.click();
                                lwor = true;
                            }
                        }, 1000);
                    } else if (lwor == false) {
                        if (aygb <= pct) {
                            round = round + 1;
                            var betv = document.getElementById('bet');
                            var xix = document.getElementById('myBetsTable').firstChild.children[1].children[2].innerText
                            betv.value = Number(xix.replace(/[^0-9.]/g,""))*2
                            console.log("Previous roll was a loss, betting: " +betv.value*2 +(" (" +betv.value +"*2=" +betv.value*2) +")")
                            var rdi = document.getElementById('roll');
                            rdi.click();
                            setTimeout(function () {
                                var didiwin = winorlose();
                                if (didiwin === false) {
                                    zl = zl + 1;
                                    console.log('round ' +round +': lost');
                                    rdi.click();
                                    lwor = false;
                                } else if (didiwin === true) {
                                    zl = 0;
                                    console.log('round ' +round +': won');
                                    rdi.click();
                                    lwor = true;
                                }
                            }, 1000);
                        } else if (aygb > pct) {
                            round = round + 1;
                            var betv = document.getElementById('bet');
                            betv.value = minb;
                            console.log('Betting too much! Restarting...')
                            var rdi = document.getElementById('roll');
                            rdi.click();
                            setTimeout(function () {
                                var didiwin = winorlose();
                                if (didiwin === false) {
                                    zl = zl + 1;
                                    console.log('round ' +round +': lost');
                                    rdi.click();
                                    lwor = false;
                                } else if (didiwin === true) {
                                    zl = 0;
                                    console.log('round ' +round +': won');
                                    rdi.click();
                                    lwor = true;
                                }
                            }, 1000);
                        };
                    };
                } else if (round === 0) {
                    round = round + 1;
                    var betv = document.getElementById('bet');
                    lwor = true
                    betv.value = minb;
                    var rdi = document.getElementById('roll');
                    rdi.click();
                    setTimeout(function () {
                        var didiwin = winorlose();
                        if (didiwin === false) {
                            zl = zl + 1;
                            console.log('round ' +round +': lost');
                            rdi.click();
                            lwor = false;
                        } else if (didiwin === true) {
                            zl = 0;
                            console.log('round ' +round +': won');
                            rdi.click();
                            lwor = true;
                        }
                    }, 1000);   
                };
            };
            db = false;
        }

        setInterval(function () {
            if (db === false) {
                botting()
            } else {
                console.log("still running botting function, try again in 1.3 sec(s)")
            }
        }
            , 1300);


        setInterval(function () {
            var textwx = document.getElementById('goCoins').innerText;
            var rncash = Number(textwx.replace(/[^0-9.]/g,""));
            var ccx = (rncash-numtextonly).toFixed(2);
            document.getElementById("totalp").innerHTML = 'Total profit: <span style="color: #ecf0f1;">' +ccx +'</span>';
        }, 1201)

    }, 605)
}
