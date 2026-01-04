// ==UserScript==
// @name            freebitco.in autoplayer V2.1.3-Develpment
// @namespace       https://openuserjs.org/users/jessonfoo
// @author          jessonfoo
// @description     autoplay tool for freebitcoin.com / freedoge.coin
// @version         2.1.3-DEV
// @match           https://freebitco.in/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/473607/freebitcoin%20autoplayer%20V213-Develpment.user.js
// @updateURL https://update.greasyfork.org/scripts/473607/freebitcoin%20autoplayer%20V213-Develpment.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var betMin = "0.00000001",
        gMult = 3.00;


    function createCSS() {
        var head = document.head || document.getElementsByTagName('head')[0];
        var warn = document.createElement('style');
        warn.innerHTML = "#align_right,#align_left,#clocktimestart{text-align:center}#popBet{background:#606060;border:1pxsolid;border-radius:10px;position:relative;padding:13px;margin:5px}#xclosed{position:absolute;border-radius:40%;font-size:16px;color:#787878;cursor:pointer;font-weight:700;padding:10px 10px;top:0;right:0;}#align_left{color:#d6f83d;border:0;margin:10px;}.h5atas{color:#d6ff5c;border-bottom:1pxsolid;background:#606060;border-radius:-20px;padding-bottom:5px;margin-top:0}.ptab{color:#d6ff5c;font-size:12px;-webkit-transition:all1sease;-moz-transition:all1sease;-o-transition:all1sease;-ms-transition:all1sease}#start{margin:10px;width:90px}#stop{width:90px;color:#ff3893;}#clocktimestart{border-radius:50%;font-weight:700;border:5pxsolid;background:#ff3893;text-shadow:5px5px3px#000;display:block;margin:0auto;width:100px;height:100px;font-size:50px;padding-top:18px;box-shadow:0010px#000inset}";
        head.appendChild(warn);
    }

    function btc() {
        var newDiv1 = document.createElement("div");
        newDiv1.setAttribute("id", "popBet");
        newDiv1.innerHTML = `<span id="xclosed">X</span>
            <div id="align_left">

            <div class="h5atas" style="display: block; width: 100%; padding: .375rem .75rem 0; font-size: 1rem; line-height: 1.5; color: #495057; background-color: #999999; background-clip: padding-box; border: 1px solid #ced4da; border-radius: .25rem; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out; ">
                Target Profit
                <input type="number" id="target" name="stopGain" placeholder="1500" value=500 class="input field">
                <input type="checkbox" name="repeat" id="repeat-target">
                    Repeat & Double Target
            </div>

            <h5 style="color:#ccc">Start Balance: <span id="opening_balance">0.00000000</span></h5>

            <span id="start_balance" style="display:none !important;"></span>
            <h5 style="color:#fff">Current Balance : <span id="end_balance"></span></h5>

            <hr/>

            <h5 style="color:#bfe05d">Active Bet: <span id="min_bet">${betMin}</span></h5>

            <h5 style="color:#00a5ff">Series Balance: <span id="profit">0.00000000</span></h5>

            <span  style="display:none !important;" id="netBalance">0.00000000</span>

            <p class="ptab">Net Gain: <span id="net_balance">0.00000000</span></p>

            <div id="align_left">

            <button id="start" class="button tiny success">START</button>

            <button id="stop" class="button tiny success">STOP</button>

            <br/>

            <div class="container" style="display:flex">

            <button style="display:inline-flex;float:left;margin:20px;" class="button tiny"  id="toggleParameters">Toggle Settings</button> 
            <button style="display:inline-flex;float:right;margin:20px;" class="button tiny alert" id="toggleJackpot">Toggle Jackpot</button> 

            </div> 

            <div class="container betParameters" id="betParams"> 
            <div class="container">  <br><p style="color:#bfe05d">Bet Unit Size: <span id="mult-display">${gMult}</span></p>
            <input style="display:inline-block;margin:5px;" type="number" step="0.05" id="gzn-mult" value="${gMult}" ></input>
            </div> 
            <div style="display:block"> 
            <br><p style="color:#bfe05d">Bet Unit Size: <span id="unit_size">${betMin}</span></p>
            <input style="display:inline-block;margin:5px;" type="number" step="1" id="bet-size" value="5" ></input> 
            </div> 
            </div> 

            </div>`;
        document.getElementById('double_your_btc_right_section').firstChild.style.display = "none";
        document.getElementById("double_your_btc_right_section").appendChild(newDiv1);
        document.getElementById('double_your_btc_right_section').scrollIntoView();
        function satoshiToBTC(sat){
            return Number(sat + 'e-8').toFixed(8);
        }

        /*EventListener*/
        function eventAdd(e, eventName, handler) {
            if (e.addEventListener) e.addEventListener(eventName, handler, false);
            else e.attachEvent('on' + eventName, handler);
        }

        /* Close  */
        eventAdd(document.getElementById('xclosed'), 'click', function () {
            document.getElementById('double_your_btc_right_section').firstChild.style.display = "block";
            document.getElementById('xclosed').parentNode.remove();
        });

        $('#bet-size').on('change',function(el) {
            betMin = satoshiToBTC(document.getElementById('bet-size').value);
            document.getElementById('unit_size').textContent = betMin;
            document.getElementById('min_bet').textContent = betMin;
            document.getElementById('double_your_btc_stake').value = betMin;
        });
        $('#gzn-mult').on('change',function(el) {
            gMult = Number($('#gzn-mult').val());

            document.getElementById('mult-display').textContent = gMult;
            $('#double_your_btc_payout_multiplier').val(gMult);
        });
        /* reset */
        function reset() {
            document.getElementById("profit").style.color = "#00a5ff";
            //   document.getElementById("netBalance").textContent = "0.00000000";
            document.getElementById("profit").textContent = "0.00000000";
            document.getElementById('start_balance').textContent = document.getElementById('balance').textContent;
            //
            document.getElementById('end_balance').textContent = document.getElementById('balance').textContent;
            document.getElementById('double_your_btc_min').click();
            document.getElementById('double_your_btc_payout_multiplier').value = fgMult;
            document.getElementById('min_bet').textContent = document.getElementById('double_your_btc_stake').value = betMin;
        }

        reset();
        document.getElementById('opening_balance').textContent = document.getElementById('balance').textContent;
        eventAdd(document.getElementById('toggleParameters'), 'click', function () {
            return document.getElementById('betParams').hidden = !document.getElementById('betParams').hidden;
        });

        /* warn Profit */
        function warn() {
            var wtab = Number(document.getElementById("profit").innerHTML);
            if (wtab < 0) {
                document.getElementById("profit").style.color = "#ff3893";
            }
            else document.getElementById("profit").style.color = "#bfe05d";
        }

        /* randomize */
        function betRandom(multiplier) {
            var guess = Math.floor((Math.random() * 3) - 1);

            if (guess > 0) {
                document.getElementById("double_your_btc_bet_hi_button").click();
            }
            else {
                document.getElementById("double_your_btc_bet_lo_button").click();
            }



        }

        /* Bet */
        var nextBet;
        eventAdd(document.getElementById('start'), 'click', function () {
            /*Time Counter*/
            var countDiv = document.createElement("div");
            countDiv.setAttribute("id", "clocktimestart");
            countDiv.setAttribute("style", "display:none;");
            document.getElementById("double_your_btc_middle_section").appendChild(countDiv);



            var balance = document.getElementById('balance').innerHTML;
            var netBalance = document.getElementById('netBalance').innerHTML;

            if (Number(balance) <= Number(netBalance)) {
                clearInterval(nextBet);
            }
            nextBet = setInterval(function () {
                var min_win = betMin;
                var min_raise = Number(betMin);
                var unit = Number(betMin);
                var doubleDown = Number(unit * 2).toFixed(8);
                warn();

                setTimeout(function(){
                    var startBalance = document.getElementById('start_balance').innerHTML;
                    var balance = document.getElementById('balance').innerHTML;
                    var change = Number(Number(balance) - Number(startBalance)).toFixed(8);
                    document.getElementById('end_balance').textContent = balance;
                    var netBalance = document.getElementById('netBalance').innerHTML;
                    var idmin_bet = document.getElementById('min_bet');
                    var netChange = Number(Number(change) + Number(netBalance)).toFixed(8);
                    var maxBet = (Number(document.getElementById('end_balance').textContent) * 0.03);
                    var currentStake = Number(document.getElementById('double_your_btc_stake').value);
                    var winElement = document.getElementById('double_your_btc_bet_win');

                    document.getElementById("profit").textContent = change;
                    document.getElementById('end_balance').textContent = balance;
                    if(Number(change) > 0 ){
                        document.getElementById('end_balance').style.color = "#bfe05d";
                    }else{
                        document.getElementById('end_balance').style.color = "#ff3893";
                    }
                    if (Number(change) >= Number(min_win)) {
                        document.getElementById('net_balance').textContent = Number(document.getElementById('net_balance').textContent + netChange).toFixed(8);
                        document.getElementById('net_balance').style["font-size"] = "24px";
                        document.getElementById('start_balance').textContent = balance;
                        document.getElementById('end_balance').textContent = balance;
                        if (winElement.innerText != "") {
                            var nextBet = currentStake;
                            if ((nextBet + unit) > (nextBet *= 1.25)) {
                                nextBet += min_raise;
                            } else {
                                nextBet *= 1.25;

                            }
                            document.getElementById('double_your_btc_stake').value = nextBet.toFixed(8);
                        }
                        idmin_bet.textContent = document.getElementById('double_your_btc_stake').value = betMin;
                        document.getElementById('double_your_btc_stake').value = betMin;
                        idmin_bet.textContent = document.getElementById('double_your_btc_stake').value;
                        idmin_bet.style.color = "#bfe05d";
                    }
                    else if (Number(change) < min_win) {


                        maxBet = (Number(document.getElementById('end_balance').textContent) * 0.03);
                        currentStake = Number(document.getElementById('double_your_btc_stake').value);
                        document.getElementById("profit").style.color = "#ff3893";
                        if (winElement.innerText != "") {
                            nextBet = currentStake;
                            if ((nextBet + min_raise) > (nextBet *= 1.185)) {
                                nextBet += min_raise;
                            } else {
                                nextBet *= 1.185;

                            }
                            document.getElementById('double_your_btc_stake').value = nextBet.toFixed(8);
                        }
                        idmin_bet.textContent = document.getElementById('double_your_btc_stake').value;
                        idmin_bet.style.color = "#ff3893";
                    }
                    else {
                        document.getElementById('end_balance').style.color = "#bfe05d";
                        document.getElementById("profit").style.color = "#bfe05d";
                        document.getElementById('double_your_btc_min').click();
                        document.getElementById('double_your_btc_stake').value = betMin;
                        idmin_bet.textContent = document.getElementById('double_your_btc_stake').value = betMin;

                        idmin_bet.style.color = "#bfe05d";
                    }
                    if(
                        (
                            Number(document.getElementById('opening_balance').innerText) >= Number(document.getElementById('end_balance').innerText))
                        &&
                        (Number(document.getElementById('end_balance').innerText) >= (Number(document.getElementById('target').value))
                        ) ||  Number(document.getElementById('netBalance').innerText)*100000000 >= Number(document.getElementById('target').value)) {
                        document.getElementById('stop').click();

                        if(document.getElementById('repeat-target').checked && (Number(document.getElementById('time_remaining').innerText.split(/\D/g)[0]) > 6)) {
                            setTimeout(function(){ return document.getElementById('start').click();},2500);
                        }
                        return reset();
                    }else{
                        return betRandom();
                    }
                },150);

            }, 300);
        });

        eventAdd(document.getElementById('toggleJackpot'), 'click', function () {
            var toggle = $(".play_jackpot:checkbox[value='1']").prop('checked');
            $(".play_jackpot:checkbox[value='1']").prop('checked',!toggle);
        });
        /*Stop Bet*/
        eventAdd(document.getElementById('stop'), 'click', function () {
            clearInterval(nextBet);
        });
    }

    if (document.getElementById('double_your_btc_right_section') !== null) {
        createCSS();
        btc();
    }
})();

if(typeof jQuery =='undefined') {
    var headTag = document.getElementsByTagName("head")[0];
    var jqTag = document.createElement('script');
    jqTag.type = 'text/javascript';
    jqTag.src = 'https://code.jquery.com/jquery-1.9.1.min.js';
    jqTag.onload = function(){
        if (document.getElementById('double_your_btc_right_section') !== null) {
            createCSS();
            btc();
        }
    };
    headTag.appendChild(jqTag);
} else {
    $(document).ready(function () {
        setInterval(function () {
            if ($('#free_play_form_button').is(':visible')) {
                $('#free_play_form_button').trigger('click');
            }
        }, 5000);
    });
}
