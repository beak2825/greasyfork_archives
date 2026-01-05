// ==UserScript==
// @name        nixbot
// @namespace   nixbot
// @include     https://just-dice.com/*
// @description Adds a martingale bot to just-dice.com
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23909/nixbot.user.js
// @updateURL https://update.greasyfork.org/scripts/23909/nixbot.meta.js
// ==/UserScript==
//Copyright (C) 2013  CriticalNix
//
//This program is free software; you can redistribute it and/or
//modify it under the terms of the GNU General Public License
//version 2.
//
//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//GNU General Public License for more details.
//
//A full copy of the GNU General Public License, version 2 can be found here. http://www.gnu.org/licenses/gpl-2.0.html
//-------------------------------------------------------------------
var winning = 2; // 1 = winning 0 = losing
var round_length = 0; // holds the amount of times we can multiply.
var running = 0; //running 1 is working.
var run_round = 0;
var betting = 0; //1 = making bet.
var start_balance = 0;
var balance = 0;
var start_values_check = 0;
var betid = 0;
var last_betid = 0;
var last_betid2 = 0;
var version_c = "3.0.5";
var heartbeat_bpm = 100; //this is the bots ticker if for some reason the site temp bans  for spam betting lower this to 125
var bet_data = [];
var arr_bets = [];
var ev_data = [];
var current_time = 1;
var start_time = 0;
var start_bet = 0;
var current_bet = 0;
var won = 0;
var lost = 0;
var win1 = 0;
var lose1 = 0;
var steps = 0;
var reset_steps = 0;
var max_win = 0;
var max_loss = 0;
var marti_limit = 0;
var betid_check = 0;
var reset_bet = 0;
var start_bal = 0;
var first_run = 0;
var current_profit = 0;
var hi_lo;
var randomizer_count = 0;
var randomizing = 0;
var cpr;
var site = 2;
var ddt = "Doge-Dice.com";
var jdt = "Just-Dice.com";
var delay_bet = 1000;
var reset_check = 0;
var win_ratio = 0;
var profit_lock_a = 0;
var flot = "https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.js";


var dep = [];

//window.location.reload(true);
//-------------------------------------- Heart and possibly soul of the bot. Everything is called from here.
function heart_beat() {

    gui();
    footer();
    cpr = !cpr;
    includeJS(flot);

    console.log(' Started ' + gets_date() + ' Heartbeat:' + heartbeat_bpm + '\n' + '\n');

    setInterval(function() {
        if (cpr) {
            value_grip();
            results();
            stats_update();
            total_check();
            Martingale();
        }
    }, heartbeat_bpm);
}

function includeJS(jsFile) {
    $('head').append($('<script>').attr('type', 'text/javascript').attr('src', jsFile));
}

//-------------------------------------- determine if we are on just-dice or doge-dice
function which_site() {

    var dd = $('div.header').text();


    if (dd == ddt) {
        site = 1;

    } else {
        site = 0;
    }
    console.log('we are on the ' + site + "-dice site" + "\n");
}

//-------------------------------------- increments max loss and max win display 
function max_loss_streak() { // longest loss streak
    $("#maxLossInput").css("color", "red");
    if (lose1 > max_loss) {
        max_loss++;
        $("#maxLossInput").val(max_loss);
    } else {
        // nothing here move along XD
    }
}

function max_win_streak() { //longest win streak
    $("#maxWinInput").css("color", "green");
    if (win1 > max_win) {
        max_win++;
        $("#maxWinInput").val(max_win);
    } else {
        // nothing here move along XD
    }
}

function stop_bank() {
    if ($('#profit_stop_check').prop('checked')) {
        var bal_checked = parseFloat($("#pct_balance").val());
        var stop_bank = parseFloat($("#stop_bank").val());
        if (bal_checked >= stop_bank) {
            running = 0;

        }
    }
}

function profit_lock() {
    if ($('#profit_lock').prop('checked')) {
        var bal_checked = parseFloat($("#pct_balance").val()); //profit_lock_val
        var profit_lock_val = parseFloat($("#profit_lock_val").val());
        var checky_bal = bal_checked - profit_lock_val;

        if (current_profit >= profit_lock_val && profit_lock_a == 0) {
            profit_lock_a = 1;
            console.log('profit lock active');
        }

        if (checky_bal <= 0 && profit_lock_a == 1) {
            running = 0;
            console.log('reached bottom');
        }
    }
}

//-------------------------------------- Randomizer function.
function randomizer() {
    if ($('#randomizer_check').prop('checked') && randomizer_count >= 12) {
        randomizer_count = 0;
        randomizing = 1;
        $("button#a_random").click();
        running = 0;
        setTimeout(function() {
            $("button.seed_button").click();
            running = 1;
            randomizing = 0;
        }, 1000);
    }
}

//-------------------------------------- Unused for now but will be used in future updates.
function randomString(length) {
    var chars = "0123456789";
    var string_length = length;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

//--------------------------------------- Local storage functions
function clearItem(key, value) {
    //console.log("Removing [" + key + ":" + value + "]");
    window.localStorage.removeItem(key);
}

function setItem(key, value) {
    //console.log("Storing [" + key + ":" + value + "]");
    window.localStorage.removeItem(key);
    window.localStorage.setItem(key, value);
    //console.log("Return from setItem" + key + ":" + value);
}

function getItem(key) {
    var value;
    //console.log('Retrieving key [' + key + ']');
    value = window.localStorage.getItem(key);
    //console.log("Returning value: " + value);
    return value;
}

//--------------------------------------- store and load functions
function loads() {
    var l1 = getItem('limiter');
    var m1 = getItem('multiplier');
    var r1 = getItem('reset_step');
    var r2 = getItem('reset_value');
    var s1 = getItem('stop_bank');

    $('#limiter').val(l1);
    $('#multiplier').val(m1);
    $('#reset_step').val(r1);
    $('#reset_value').val(r2);
    $('#stop_bank').val(s1);

}

function saves() {

    var limiters = parseFloat($("#limiter").val());
    var multipliers = parseFloat($("#multiplier").val());
    var reset_steps = parseFloat($("#reset_step").val());
    var reset_values = parseFloat($("#reset_value").val());
    var stop_banks = parseFloat($("#stop_bank").val());
    setItem('limiter', limiters);
    setItem('multiplier', multipliers);
    setItem('reset_step', reset_steps);
    setItem('reset_value', reset_values);
    setItem('stop_bank', stop_banks);

}


//--------------------------------------- Used to reset stats
function reset_stats() {

    //setTimeout(function(){ $("#a_hi").trigger('click') },delay_bet);
    reset_check = 1;
    start_balance = parseFloat($("#pct_balance").val());
    won = 0;
    win1 = 0;
    lose1 = 0;
    steps = 0;
    run_round = 0;
    lost = 0;
    max_win = 0;
    $("#maxWinInput").val(max_win);
    max_loss = 0;
    $("#maxLossInput").val(max_loss);
    cBust3 = 0;
    stats_update();
    reset_check = 0;
    var bet_data = [];
    var arr_bets = [];
    var ev_data = [];
    update_graphs();
}



//-------------------------------------- gathers results and increments counters
function results() {
    var results2 = $("div#me .results")[0];
    var result = $(results2).children()[0];
    var betid = $($(result).children(".betid")).text();
    balance = parseFloat($("#pct_balance").val());

    if (betid != last_betid) {
        last_betid = betid;

        max_loss_streak();
        max_win_streak();
        stop_bank();
        profit_lock();

        var win = ($($(result).children(".profit")).text()[0] == "+");
        //console.log('win:' + win + '\n');
        if (win) {
            won++;
            win1++;
            depth(lose1);
            lose1 = 0;
            steps = 0;
            reset_steps = 0;
            winning = 1;
            run_round++;
            betting = 0;
            if ($('#stopwin_check').prop('checked')) { // checks to see if stop on win is checked
                running = 0;
            }
            update_graphs();
            play_sound1();
            popArray();
            randomizer_count++;

        } else {
            win1 = 0;
            lose1++;
            steps++;
            reset_steps++;
            lost++;
            winning = 0;
            run_round++;
            hi_lo = !hi_lo;
            betting = 0;
            update_graphs();
            play_sound2();
            popArray();
            randomizer_count++;
            if (first_run === 0) {
                lose1--;
                steps--;
                run_round--;
                lost--;
                first_run = 1;
            }

        }

    }

}

//-------------------------------------- Invest function
function invest(value) {

    var invest_send = $('<button id="invest_all" style="width:80px;margin-right:10px;border:1px solid" onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("invest", csrf, "all", ' + value + ');\'></button>');

    $($footer).append(invest_send);
    $("#invest_all").trigger('click');
    invest_send.remove();

    console.log('invested:' + value + '\n');

}

//-------------------------------------- probability and stat's update
function stats_update() {
    //probability
    var ccbust1 = parseFloat($("#pct_chance").val());
    var ccbust2 = parseFloat($("#limiter").val());
    var cBust3 = 0;
    var results = $("div#me .results")[0];
    var result = $(results).children()[0];
    var betid = $($(result).children(".betid")).text();
    balance = parseFloat($("#pct_balance").val());


    cBust1 = 1 - ccbust1 / 100;
    cBust2 = Math.pow(cBust1, ccbust2) * 100;

    if (cBust3 != cBust2) {
        cBust3 = cBust2;

        scientific(cBust2);

        $("#probability").val(cBust2.toFixed(10));
    }

    $("#ebank").val(balance);

    //betsInput ---total bets
    $("#betsInput").val(run_round);

    //current loss length
    $("#c_loss").val(lose1);

    //profitInput ---profit  -- start_bal


    if (betid != last_betid2 || reset_check == 1) {
        last_betid2 = betid;
        current_profit = balance - start_balance;
        $("#profitInput").val(current_profit.toFixed(8));
    }

    win_ratio = ((won / run_round) * 100);
    if (isNaN(win_ratio)) {
        win_ratio = 0;
    }
    if (win_ratio !== 0) {
        win_ratio = win_ratio - ccbust1;
    }

    $("#percentWonInput").val(win_ratio.toFixed(8));

    if ($("#reconnect").is(':visible')) { //Thanks 'eltopo' prevents user timeout.
        $("#reconnect").click();
    }
}

//-------------------------------------- Populates bet array with information then offers to save on bust
function save_to_file() {
    window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024, function(fs) {
        fs.root.getFile('open-with-notepad.bin', {
            create: true
        }, function(fileEntry) {
            fileEntry.createWriter(function(fileWriter) {

                var blob = new Blob([arr_bets]);

                fileWriter.addEventListener("writeend", function() {
                    // navigate to file, will download
                    location.href = fileEntry.toURL();
                }, false);

                fileWriter.write(blob);
            }, function() {});
        }, function() {});
    }, function() {});
}


function popArray() { //populate bet array

    if ($('#bet_logging').prop('checked')) {
        var results = $("div#me .results")[0];
        var result = $(results).children()[0];
        var betid = $($(result).children(".betid")).text();
        var c_balance = parseFloat($("#pct_balance").val());
        var c_chance = parseFloat($("#pct_chance").val());
        var arr_bet = parseFloat($("#pct_bet").val());

        arr_bets.push('\n');
        arr_bets.push(gets_date() + '   ');
        arr_bets.push('Bet number:' + run_round + '   ');
        arr_bets.push('betid:' + betid + '   ');
        arr_bet1 = scientific(arr_bet);
        arr_bet2 = parseFloat(arr_bet1).toFixed(8);
        arr_bets.push('bet amount:' + arr_bet2 + '   ');
        arr_bets.push('Balance:' + c_balance + '   ');
        arr_profit = scientific(current_profit);
        arr_profit2 = parseFloat(arr_profit).toFixed(8);
        arr_bets.push('profit:' + arr_profit2 + '   ');
        arr_bets.push('chance:' + c_chance + '   |');
    }

}

//-------------------------------------- Show version in footer
function footer() {
    $footer = $('<div style="position:fixed;bottom:0px;background-color:White;">v' + version_c + '</div>');
    $("body").append($footer);
}

//-------------------------------------- Grabs single instance values
function value_grip() {
    if (start_values_check === 0) {
        start_balance = parseFloat($("#pct_balance").val());
        if (isNaN(start_balance)) {
            console.log('start_balance ...Loading' + '\n');
        } else if (start_balance > 0.00000001) {
            start_values_check = 1;
            console.log('start balance found: ' + start_balance + '\n');
        }
    }

}

//-------------------------------------- Martingale Function
function Martingale() {
    // pass bet value here bet_click(bet_value)
    if (running == 1) {
        if (winning === 1 && betting === 0) {

            randomizer();
            bet_click(reset_bet);

        } else if (winning === 0 && betting === 0) {

            var new_bet = parseFloat($("#pct_bet").val() * $multiplierInput.val());

            randomizer();
            bet_click(new_bet);

        } else {

            //console.log('martingale else');
        }
    }
}

//-------------------------------------- bets from a value passed to it if it has not reached step limiter. Also switch on loss and random hi lo
function bet_click(bet_value) {
    var rndhilo = Math.random() < 0.5 ? 1 : 0;
    var marti_limit = parseFloat($("#limiter").val());
    var marti_reset_value = parseFloat($("#reset_value").val()); //value to reset to
    var marti_reset_step = parseFloat($("#reset_step").val()); //step number to reset to
    var balance_check_1 = parseFloat($("#pct_balance").val());
    var x = $("#step_option").val()

    delay_bet = parseFloat($("#bot_delay_length").val());       

    if (reset_steps == (marti_reset_step - 1) && steps < marti_limit && betting === 0 && running == 1 && $('#resetL_check').prop('checked')) {

        reset_steps = 0;

        if ($('#switch_loss_check').prop('checked') && betting === 0 && running == 1) {
            if (hi_lo) {
                betting = 1;
                var bet = bet_value * marti_reset_value;
                bet = scientific(bet);
                $("#pct_bet").val(bet);

                setTimeout(function() {
                    if (bet > balance_check_1) {
                        bust();
                    } else {
                        $("#a_hi").trigger('click');
                    }
                }, delay_bet);

            } else {
                betting = 1;
                var bet = bet_value * marti_reset_value;
                bet = scientific(bet);
                $("#pct_bet").val(bet);

                setTimeout(function() {
                    if (bet > balance_check_1) {
                        bust();
                    } else {
                        $("#a_lo").trigger('click');
                    }
                }, delay_bet);
            }
        } else if ($('#rstep_opts').prop('checked') && steps < marti_limit && betting === 0 && running == 1) { //rstep_opts
            if (hi_lo) {
                betting = 1;

                var step_option_num = parseFloat($("#option_loss").val());

                if ($('#step_option option:selected').val() == 1) {

                    var bet = (bet_value * marti_reset_value) + step_option_num;
                    bet = scientific(bet);
                    console.log('new bet: ' + bet + ' added: ' + step_option_num);
                    $("#pct_bet").val(bet);

                } else if ($('#step_option option:selected').val() == 2) {

                    var bet = (bet_value * marti_reset_value) - step_option_num;
                    bet = scientific(bet);
                    if (bet < 0) {
                        console.log('Preventing negative number:: bet set to minimum');
                        bet = 0.00000001;
                    }
                    console.log('new bet: ' + bet + ' minus: ' + step_option_num);
                    $("#pct_bet").val(bet);

                }
                setTimeout(function() {
                    if (bet > balance_check_1) {
                        bust();
                    } else {
                        $("#a_hi").trigger('click');
                    }
                }, delay_bet);

            } else {
                betting = 1;
                var step_option_num = parseFloat($("#option_loss").val());

                if ($('#step_option option:selected').val() == 1) {

                    var bet = (bet_value * marti_reset_value) + step_option_num;
                    bet = scientific(bet);
                    console.log('new bet: ' + bet + ' added: ' + step_option_num);
                    $("#pct_bet").val(bet);

                } else if ($('#step_option option:selected').val() == 2) {

                    var bet = (bet_value * marti_reset_value) - step_option_num;
                    bet = scientific(bet);
                    if (bet < 0) {
                        console.log('Preventing negative number:: bet set to minimum');
                        bet = 0.00000001;
                    }
                    console.log('new bet: ' + bet + ' minus: ' + step_option_num);
                    $("#pct_bet").val(bet);

                }

                setTimeout(function() {
                    if (bet > balance_check_1) {
                        bust();
                    } else {
                        $("#a_lo").trigger('click');
                    }
                }, delay_bet);
            }
        } else {

            betting = 1;
            var bet = bet_value * marti_reset_value;
            bet = scientific(bet);
            $("#pct_bet").val(bet);

            setTimeout(function() {
                if (bet > balance_check_1) {
                    bust();
                } else {
                    $("#a_hi").trigger('click');
                }
            }, delay_bet);
        }
    } else if (steps < marti_limit && betting === 0 && running == 1) {
        if ($('#switch_loss_check').prop('checked')) {
            if (hi_lo) {
                betting = 1;
                bet_value = scientific(bet_value);
                $("#pct_bet").val(bet_value);
                setTimeout(function() {
                    if (bet > balance_check_1) {
                        bust();
                    } else {
                        $("#a_hi").trigger('click');
                    }
                }, delay_bet);

            } else {
                betting = 1;
                bet_value = scientific(bet_value);
                $("#pct_bet").val(bet_value);
                setTimeout(function() {
                    if (bet > balance_check_1) {
                        bust();
                    } else {
                        $("#a_lo").trigger('click');
                    }
                }, delay_bet);
            }
        } else {

            betting = 1;
            bet_value = scientific(bet_value);
            $("#pct_bet").val(bet_value);

            setTimeout(function() {
                if (bet > balance_check_1) {
                    bust();
                } else {
                    $("#a_hi").trigger('click');
                }
            }, delay_bet);
        }
    } else if (randomizing == 1) {
        console.log('Randomizing Please wait....');
    } else {
        bust();
    }
}

function bust() {
    log_message('***limit reached***');
    console.log('***limit reached***');
    steps = 0;
    running = 0;
    $("#pct_bet").val(reset_bet);
    play_sound3();
}

//-------------------------Looks at bet depth and passes it to array ready for bar chart.
function depth(x) {
    if (!dep[x]) {
        dep[x] = 1;
    } else {
        dep[x]++;
    }
}

//-------------------------------------- Graphing functions
function generate_graph() {
    var res = [];
    var gb = parseFloat($("#graph_length").val());
    for (var i = 0; i < bet_data.length; ++i) {
        if (res.length >= gb) {
            while (res.length > gb) {
                res.shift();
            }

            res.push([i, bet_data[i]]);

        } else {
            res.push([i, bet_data[i]]);
        }
    }

    return res;
}

function generate_ev_graph() {
    var res = [];
    var gb = parseFloat($("#graph_length").val());
    for (var i = 0; i < ev_data.length; ++i) {
        if (res.length >= gb) {
            while (res.length > gb) {
                res.shift();
            }

            res.push([i, ev_data[i]]);

        } else {
            res.push([i, ev_data[i]]);
        }
    }

    return res;
}

function generate_bar_graph() {
    var res = [];
    for (var i = 0; i < dep.length; ++i) {

        res.push([i, dep[i]]);

    }

    return res;
}

function update_graphs() {
    var g_bal = $('#pct_balance').val();
    var ev_data1 = $("#percentWonInput").val();

    ev_data.push(ev_data1);
    bet_data.push(g_bal);

    var data1 = generate_graph();
    var data2 = generate_ev_graph();

    var data = [{
        data: data1,
        label: "profit",
        yaxis: 1,
        color: 'green',
        lines: {
            show: true
        }
    }, {
        data: data2,
        label: "EV",
        yaxis: 2,
        color: 'red',
        lines: {
            show: true
        }
    }];

    var options = {
        legend: {
            position: "nw",
            noColumns: 2,
            container: $("#chartLegend")
        },
        yaxes: [{

        }, {
            position: "right"
        }]
    };

    var plotb = $.plot("#g_placeholder2", [generate_bar_graph()], {
        series: {
            color: '#cdffcc'
        },
        bars: {
            show: true
        },
        yaxis: {},
        xaxis: {}
    });

    var plot2 = $.plot("#g_placeholder", data, options);

    plotb.setData([generate_bar_graph()]);

    plotb.setupGrid();
    plotb.draw();

}

//---------------------------------------------------------------------------- builds user interface

//-------------------------------------- Opens help html
function basicPopup(url) {
    popupWindow = window.open(url, 'popUpWindow', 'height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

function basicPopup2(url) {
    popupWindow = window.open(url, 'popUpWindow', 'height=620,width=1024,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=no,menubar=no,location=no,directories=no, status=no');
}

function gui() { //

    //-------------------------------------- Invest all and divest all buttons
    $('.button_inner_group:nth(2)').append(      '<button onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("invest", csrf, "all", $("#invest_code").val());\'>invest all<div class="key">N</div></button>').append(      '<button onClick=\'javascript:socket.emit("invest_box", csrf); socket.emit("divest", csrf, "all", $("#divest_code").val());\'>divest all<div class="key">M</div></button>');

    //-------------------------------------- Options
    var $o_row1 = $('<div class="row"/>');

    //sound_check
    $sound_c = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="sound_check" id="sound_check" /> Play sound on win! </font></div>');
    $o_row1.append($sound_c);

    //sound_check2
    $sound_check2 = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="sound_check2" id="sound_check2" /> Play sound on loss! </font></div>');
    $o_row1.append($sound_check2);

    //sound_check3
    $sound_check3 = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="sound_check3" id="sound_check3"  /> Play sound on bust! </font></div>');
    $o_row1.append($sound_check3);

    //stopwin_check
    $swin_c = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="stopwin_check" id="stopwin_check" /> Stop on win</font></div>');

    //smile_check
    $smile_c = $('<div style="margin-right:10px"><font color="white">type !emote in chat to toggle smileys  </font></div>');
    $o_row1.append($smile_c);

    //switch_loss_check
    $switch_loss_check = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="switch_loss_check" id="switch_loss_check" /> switch hi/lo on loss </font></div>');
    $o_row1.append($switch_loss_check);

    //resetL_check
    $reset_loss_safety = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="resetL_check" id="resetL_check" value="checked" /> check to enable reset step </font></div>');
    $o_row1.append($reset_loss_safety);

    //profit_stop_check
    $profit_stop_check = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="profit_stop_check" id="profit_stop_check" /> stop on bank  </font></div>');
    $o_row1.append($profit_stop_check);

    //randomizer_check
    $randomizer_check = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="randomizer_check" id="randomizer_check" /> randomize every 12  </font></div>');
    $o_row1.append($randomizer_check);

    //bet_logging
    $bet_logging = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="bet_logging" id="bet_logging" /> bet logging enabled  </font></div>');
    $o_row1.append($bet_logging);

    //profit_lock
    $profit_lock = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="profit_lock" id="profit_lock" /> Profit lock </font></div>');
    $o_row1.append($profit_lock);

    //profit_lock_val
    $profit_lock_val = $('<div style="margin-left:10px;margin-right:10px"><font color="white"><input style="border:1px solid; border-color: #505050;" id="profit_lock_val" value="0"/> value to lock as profit </font></div>');
    $o_row1.append($profit_lock_val);

    //graph_length
    $graph_length = $('<div style="margin-left:10px;margin-right:10px"><font color="white"><input style="border:1px solid; border-color: #505050;" id="graph_length" value="200"/> max graph length  </font></div>');
    $o_row1.append($graph_length);

    //bot_delay_length
    $bot_delay_length = $('<div style="margin-left:10px;margin-right:10px"><font color="white"><input style="border:1px solid; border-color: #505050;" id="bot_delay_length" value="0"/> bot delay. 1000 = 1 second  </font></div>');
    $o_row1.append($bot_delay_length);

    $optional_lossInput = $('<form style="margin-left:10px;margin-right:10px" action=""><input style="border:1px solid; border-color: #505050;" id="option_loss" value="0"/><select id="step_option" name="step_option"><option value="1">plus</option><option value="2">minus</option></select><font color="white"> R step opts</font></form>'); 
    $o_row1.append($optional_lossInput);

    //rstep_opts
    $rstep_opts = $('<div style="margin-right:10px"><font color="white"><input type="checkbox" value="1" name="rstep_opts" id="rstep_opts" /> Enable R step opts</font></div>');
    $o_row1.append($rstep_opts);

    //-------------------------------------- builds user interface
    $container = $('<div id="chipper" class="container"/>');
    $container2 = $('<div id="chipper2" class="container"/>');

    var $container2 = $('<div id="chipper2" class="container"/>');
    var $button_group = $('<div style="width:99%;border:2px solid; border-color: #525252;" class="button_group"/>');
    var $options_group = $('<div style="border:2px solid; border-color: #505050;" class="button_group"/>');
    $container.append($button_group);
    //$container2.append($options_group)

    var $martingale_button = $('<button class="button_label chance_toggle" style="margin-top:27px;margin-right:0px;height:65px;;width:70px;color:transparent;background-color:transparent;border:none;"></button>');
    $martingale_button.click(function() {
        //-----
        console.log('button clicked');
        //-----
    });

      
    var $run_div = $('<div background-color:rgba(35,35,35,0.5);border:2px solid; border-color: #999999;" class="button_inner_group"/>');

    //-------------------------------------- Outer UI buttons
      
    $run = $('<button id="c_run" style="color:green;margin-bottom:5px;margin-top:5px;margin-right:2px;height:22px">Go</button>');
    $run.click(function() {
        //-----
        //Start function
        //-----
        reset_bet = parseFloat($("#pct_bet").val());
        running = 1;
        console.log('running = 1' + '\n' + 'Start bet:' + scientific(reset_bet));
    });  
    $run_div.append($run);

    $store = $('<button id="c_run" style="color:blue;margin-bottom:5px;margin-top:5px;margin-right:2px;height:22px">Store</button>');
    $store.click(function() {
        //-----
        saves();
        //-----
    });  
    $run_div.append($store); 

    $load = $('<button id="c_run" style="color:blue;margin-bottom:5px;margin-top:5px;margin-right:2px;height:22px">Load</button>');
    $load.click(function() {
        //-----
        loads();
        //-----
    });  
    $run_div.append($load);      
    $Stop = $('<button id="c_stop" style="color:red;margin-bottom:5px;margin-top:5px;height:22px">Stop</button>');  
    $Stop.click(function() {
        //-----
        //Stop function
        //-----
        running = 0;
        console.log('running = 0' + '\n');
        steps = 0;
    });  
    $run_div.append($Stop);

    $reset = $('<button title="Resets stats" style="margin-right:10px;border:1px solid" id="fleft chatbutton" >reset stats</button>');  
    $reset.click(function() {
        //-----
        reset_stats();
        //----- 
    });  
    $container.append($reset);

    $showhidetrigger3 = $('<button title="Toggles bot graph" style="margin-right:10px;border:1px solid" id="showhidetrigger3" href="#">profit/ev</button>'); //toggle hide for graph
      
    $showhidetrigger3.click(function() {
        $('#chipper3').toggle(500);
        //update_graphs();
        $.plot($("#g_placeholder"), [
            []
        ]);
    });  
    $container.append($showhidetrigger3);

    $showhidetrigger3 = $('<button title="Toggles bot depth graph" style="margin-right:10px;border:1px solid" id="showhidetrigger4" href="#">depth</button>'); //toggle hide for graph
      
    $showhidetrigger3.click(function() {
        $('#chipperb4').toggle(500);
        //update_graphs();
        $.plot($("#g_placeholder2"), [
            []
        ]);
    });  
    $container.append($showhidetrigger3);

    $showhidetrigger13 = $('<button title="Toggles bot ev graph" style="margin-right:10px;border:1px solid" id="showhidetrigger4" href="#">ev</button>'); //toggle hide for graph
      
    $showhidetrigger13.click(function() {
        $('#chipperb5').toggle(500);
        //update_graphs();
        $.plot($("#g_placeholder3"), [
            []
        ]);
    });  
    //$container.append($showhidetrigger13);

    $showhidetrigger4 = $('<button title="Toggles bot option gui" style="margin-right:10px;border:1px solid" id="showhidetrigger4" href="#">options</button>'); //toggle hide for options
      
    $showhidetrigger4.click(function() {
        $('#chipper5').toggle(500);
    });  
    $container.append($showhidetrigger4);

    $showhidetrigger5 = $('<button title="Saves betting data" style="margin-right:10px;border:1px solid" id="showhidetrigger5" href="#">save</button>'); //toggle hide for options
      
    $showhidetrigger5.click(function() {
        save_to_file();
    });  
    $container.append($showhidetrigger5);

    $showhidetrigger6 = $('<button title="Much Help" style="margin-right:10px;border:1px solid" id="showhidetrigger6" href="#">HELP</button>'); //Popup help
      
    $showhidetrigger6.click(function() {

        var help_p = "https://googledrive.com/host/0BywRa_utENFgV0ZBNmdVRTJ0a0k/DD.html ";
        basicPopup(help_p);
    });  
    //$container.append($showhidetrigger6);

    $calculator = $('<button title="Much Help" style="margin-right:10px;border:1px solid" id="calculator" href="#">Calculator</button>'); //Popup help
      
    $calculator.click(function() {

        var calc = "http://sci-calc.comlu.com/ ";
        basicPopup2(calc);
    });  
    //$container.append($calculator);

    $stasis = $('<button title="Stops internal functions" style="margin-right:10px;border:1px solid" id="showhidetrigger6" href="#">Cardiology</button>'); //Popup help
      
    $stasis.click(function() {
        cpr = !cpr;
    });  
    $container.append($stasis);
    /*
    $showhidetrigger7 = $('<button title="Much Help" style="margin-right:10px;border:1px solid" id="showhidetrigger6" href="#">HELP</button>'); //Popup help
      $showhidetrigger7.click(function () {
            randomizer();   
    });
      $container.append($showhidetrigger7); 
*/

    //-------------------------------------- Inner UI input boxes
    var $row1a = $('<div class="row"/>'); ////////////////////////////////////// row 1a

      
    var $limiter = $('<p style="border:1px solid; border-color: #505050;" class="llabel">Steps</p>');  
    $limiterInput = $('<input style="border:1px solid; border-color: #505050;" id="limiter" value="100"/>');  
    var $limiterEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">#</p>');  
    $row1a.append($limiter);  
    $row1a.append($limiterInput);  
    $row1a.append($limiterEnd);

    var $row1b = $('<div class="row"/>'); ////////////////////////////////////// row 1b

      
    var $multiplier = $('<p style="border:1px solid; border-color: #505050;" class="llabel">multiplier</p>');  
    $multiplierInput = $('<input style="border:1px solid; border-color: #505050;" id="multiplier" value="1"/>');
    var $multiplierEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">x</p>');  
    $row1b.append($multiplier);  
    $row1b.append($multiplierInput);
    $row1b.append($multiplierEnd);

    var $row1c = $('<div class="row"/>'); ////////////////////////////////////// row 1c

      
    var $required_bank = $('<p style="border:1px solid; border-color: #505050;" class="llabel">required </p>');  
    $required_bankInput = $('<input style="border:1px solid; border-color: #505050;" id="required_bank" class="readonly" value="0"/>');
    var $required_bankEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">Ð</p>');
    var $required_bankEndb = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">€</p>');  
    $row1c.append($required_bank);  
    $row1c.append($required_bankInput);
    if (site == 1) {
        $row1c.append($required_bankEnd);
    } else if (site === 0) {
        $row1c.append($required_bankEndb);
    }

    var $row1d = $('<div class="row"/>'); ////////////////////////////////////// row 1d


    var $reset_step = $('<p style="border:1px solid; border-color: #505050;" class="llabel">reset step</p>');  
    $reset_stepInput = $('<input style="border:1px solid; border-color: #505050;" id="reset_step" value="7"/>');
    var $reset_stepEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">#</p>'); 
    $row1d.append($reset_step);  
    $row1d.append($reset_stepInput);
    $row1d.append($reset_stepEnd);

    var $row1e = $('<div class="row"/>'); ////////////////////////////////////// row 1e


    var $current_loss = $('<p style="border:1px solid; border-color: #505050;" class="llabel">cur loss</p>');  
    $current_lossInput = $('<input style="border:1px solid; border-color: #505050;" id="c_loss" class="readonly" value="0"/>');
    var $current_lossEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">#</p>');  
    $row1e.append($current_loss);  
    $row1e.append($current_lossInput);
    $row1e.append($current_lossEnd);  
    var $row2a = $('<div class="row"/>'); ////////////////////////////////////////////// row 2a

      
    var $maxLoss = $('<p style="border:1px solid; border-color: #505050;" class="llabel">loss streak</p>');  
    $maxLossInput = $('<input style="border:1px solid; border-color: #505050;" id="maxLossInput" class="readonly" value="0"/>');  
    var $maxLossEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">#</p>');  
    $row2a.append($maxLoss);  
    $row2a.append($maxLossInput);  
    $row2a.append($maxLossEnd);

    var $row2b = $('<div class="row"/>'); ////////////////////////////////////////////// row 2b

      
    var $maxWin = $('<p style="border:1px solid; border-color: #505050;" class="llabel">win streak</p>');  
    $maxWinInput = $('<input style="border:1px solid; border-color: #505050;" id="maxWinInput" class="readonly" value="0"/>');
    var $maxWinEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">#</p>');  
    $row2b.append($maxWin);  
    $row2b.append($maxWinInput);
    $row2b.append($maxWinEnd);

    var $row2c = $('<div class="row"/>'); ////////////////////////////////////// row 2c

      
    var $percentWon = $('<p style="border:1px solid; border-color: #505050;" class="llabel">ev</p>');  
    $percentWonInput = $('<input style="border:1px solid; border-color: #505050;" id="percentWonInput" class="readonly" value="0"/>');
    var $percentWonEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">#</p>');  
    $row2c.append($percentWon);  
    $row2c.append($percentWonInput);
    $row2c.append($percentWonEnd);

    var $row2d = $('<div class="row"/>'); ////////////////////////////////////// row 2d

      
    var $reset_value = $('<p style="border:1px solid; border-color: #505050;" class="llabel">reset mult</p>');  
    $reset_valueInput = $('<input style="border:1px solid; border-color: #505050;" id="reset_value" value="2.1"/>');
    var $reset_valueEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">x</p>');
    var $reset_valueEndb = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">x</p>');  
    $row2d.append($reset_value);  
    $row2d.append($reset_valueInput);
    if (site == 1) {
        $row2d.append($reset_valueEnd); //Ð
    } else if (site === 0) {
        $row2d.append($reset_valueEndb); //€
    }


    var $row3a = $('<div class="row"/>'); ///////////////////////////////// row 3a

      
    var $bets = $('<p style="border:1px solid; border-color: #505050;" class="llabel">total bets</p>');  
    $betsInput = $('<input style="border:1px solid; border-color: #505050;" id="betsInput" class="readonly" value="0"/>');  
    var $betsEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">#</p>');  
    $row3a.append($bets);  
    $row3a.append($betsInput);  
    $row3a.append($betsEnd);

    var $row3b = $('<div class="row"/>'); ///////////////////////////////// row 3b

    var $probability = $('<p style="border:1px solid; border-color: #505050;" class="llabel">probability</p>');  
    $probabilityInput = $('<input style="border:1px solid; border-color: #505050;" id="probability" class="readonly" value="0"/>');  
    var $probabilityEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">%</p>');  
    $row3b.append($probability);  
    $row3b.append($probabilityInput);  
    $row3b.append($probabilityEnd);

    var $row3c = $('<div class="row"/>'); ////////////////////////////////////////////// row 3c

      
    var $profit = $('<p style="border:1px solid; border-color: #505050;" class="llabel">profit</p>');  
    $profitInput = $('<input style="border:1px solid; border-color: #505050;" id="profitInput" class="readonly" value="0.00000000"/>');
    var $profitEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">Ð</p>');
    var $profitEndb = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">€</p>');  
    $row3c.append($profit);  
    $row3c.append($profitInput);
    if (site == 1) {
        $row3c.append($profitEnd); //Ð
    } else if (site === 0) {
        $row3c.append($profitEndb); //€
    }

    var $row3d = $('<div class="row"/>'); ////////////////////////////////////////////// row 3d

      
    var $stop_bank = $('<p style="border:1px solid; border-color: #505050;" class="llabel">stop bank</p>');  
    $stop_bankInput = $('<input style="border:1px solid; border-color: #505050;" id="stop_bank" value="0.00000000"/>');
    var $stop_bankEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">Ð</p>');
    var $stop_bankEndb = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">€</p>');  
    $row3d.append($stop_bank);  
    $row3d.append($stop_bankInput);
    if (site == 1) {
        $row3d.append($stop_bankEnd); //Ð
    } else if (site === 0) {
        $row3d.append($stop_bankEndb); //€
    }

    var $row3e = $('<div class="row"/>'); ////////////////////////////////////////////// row 3e

      
    var $ebank = $('<p style="border:1px solid; border-color: #505050;" class="llabel">bank</p>');  
    $ebankInput = $('<input style="border:1px solid; border-color: #505050;" id="ebank" class="readonly" value="0.00000000"/>');
    var $ebankEnd = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">Ð</p>');
    var $ebankEndb = $('<p style="border:1px solid; border-color: #505050;" class="rlabel">€</p>');  
    $row3e.append($ebank);  
    $row3e.append($ebankInput);
    if (site == 1) {
        $row3e.append($ebankEnd); //Ð
    } else if (site === 0) {
        $row3e.append($ebankEndb); //€
    }

    //-------------------------------------- Graph Div
    var $graphDiv = $('<fieldset id="chipper3" style="margin-left:70px;background-color:rgba(35,35,35,0.9);border:2px solid; border-color: #999999;width:700px;height:200px;margin-right:3px" class="graph-container"><div style="padding: 0;width:700px;height:200px;margin-right:0px" id="g_placeholder" class="graph-placeholder"></div>'); //graph holder

    var $legends = $('</br><div id="chartLegend" style="float:right;margin-right:10px;background-color:rgba(35,35,35,0.5);border:2px solid; border-color: #999999;" ></div>');

    var $graphDiv2 = $('<fieldset id="chipperb4" style="margin-left:70px;background-color:rgba(35,35,35,0.9);border:2px solid; border-color: #999999;width:700px;height:100px;margin-right:3px" class="graph-container2"><div style="padding: 0;width:700px;height:100px;margin-right:0px" id="g_placeholder2" class="graph-placeholder2"></div>'); //graph holder

    var $graphDiv3 = $('<fieldset id="chipperb5" style="margin-left:70px;background-color:rgba(35,35,35,0.9);border:2px solid; border-color: #999999;width:700px;height:100px;margin-right:3px" class="graph-container2"><div style="padding: 0;width:700px;height:100px;margin-right:0px" id="g_placeholder3" class="graph-placeholder3"></div>'); //graph holder

    //-------------------------------------- Putting it all together


    var $fieldset4 = $('<fieldset style="margin-left:33px;margin-right:auto;background-color:rgba(35,35,35,0.5);border:2px solid; border-color: #999999;"/>');
    $fieldset4.append($run_div);

    var $fieldset_o = $('<div id="chipper5" style="margin-top:8px;border:2px solid; border-color: #505050;" class="button_group"/>');
    $fieldset_o.append($o_row1);

    var $fieldset = $('<fieldset style="margin-left:50px;margin-right:2px;margin-top:10px;background-color:rgba(35,35,35,0.5);border:2px solid; border-color: #999999;"/>');
    $fieldset.append($row1a);
    $fieldset.append($row1b);
    $fieldset.append($row1c);
    $fieldset.append($row1d);
    $fieldset.append($row1e);

    var $fieldset2 = $('<fieldset style="margin-left:auto;margin-right:2px;margin-top:10px;background-color:rgba(35,35,35,0.5);border:2px solid; border-color: #999999;"/>');
    $fieldset2.append($row2a);
    $fieldset2.append($row2b);
    $fieldset2.append($row2c);
    $fieldset2.append($row2d);
    $fieldset2.append($fieldset4);

    var $fieldset3 = $('<fieldset style="margin-left:auto;margin-right:2px;margin-top:10px;background-color:rgba(35,35,35,0.5);border:2px solid; border-color: #999999;"/>');
    $fieldset3.append($row3a);
    $fieldset3.append($row3b);
    $fieldset3.append($row3c);
    $fieldset3.append($row3d);
    $fieldset3.append($row3e);

    $button_group.append($fieldset);
    $button_group.append($fieldset2);
    $button_group.append($fieldset3);
    //$button_group.append($martingale_button);

    $button_group.append($graphDiv);
    $button_group.append($legends);
    $button_group.append($graphDiv2);
    //$button_group.append($graphDiv3);
    $button_group.append("<div align='center' style='color:white;font-size:10pt;'>Inkha suite V" + version_c + " </div>");
    $container.append($fieldset_o);

    ///////////////////////////////// chat base buttons ////////////////////////////////////////

    var $chat_send = $('div#chat .chatbase:last-child'); //location of chatbase

    var $chat_button_group = $('<div style="width:675px;background-color:#787878 ;border:2px solid; border-color: #505050;" />');

    $button1 = $('<button title="REALLY DONT PRESS" style="width:80px;margin-right:10px;border:1px solid" id="button1" >DO NOT PRESS</button>');  
    $button1.click(function() {
        alert('ok now the world is gonna end... happy?');
    });  
    //$chat_button_group.append($button1);

    //$chat_send.append($chat_button_group);

    /////////////////////////////////////////////////////////////////////////////////////////////////


    //-------------------------------------- Add ui elements to page
    $(".chatstat").append('<a title="Toggles bot gui" id="showhidetrigger" href="#"><font color="blue">Show Bot</font></a>'); //toggles hide for gui
      
    $(".chatstat").append($container); 
    $(".chatstat").append('<div style="clear:left;"/>');

    //-------------------------------------- Hide Graph and options Div
    $(document).ready(function() { // toggle hide function for graph
        $('#chipper3').hide();
        $('#chipperb4').hide();
        //$('#chipperb5').hide();
        $('#chipper5').hide();
    });

    //-------------------------------------- Add toggle for UI
    $(document).ready(function() { // toggle hide function for gui
        $('#chipper').hide();
        $('a#showhidetrigger').click(function() {
            $('#chipper').toggle(500);
        });
    });

}

//-------------------------------------- grabs date in readable format
function gets_date() {
    var now = new Date();
    var strDateTime = [
        [AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"
    ].join(" ");

    function AddZero(num) {
        return (num >= 0 && num < 10) ? "0" + num : num + "";
    }
    return strDateTime;
}

//-------------------------------------- sleep function
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

//-------------------------------------- scientific notation
function scientific(n) {
    n = String(n);
    var info = /([\d\.]+)e-(\d+)/i.exec(n);
    if (!info) {
        return n;
    }

    var num = info[1].replace('.', ''),
        numDecs = info[2] - 1;
    var output = "0.";
    for (var i = 0; i < numDecs; i++) {
        output += "0";
    }
    output += num;

    return output;
}

//-------------------------------------- starts on page load
$(document).ready(function() {

    which_site();
    console.log('Welcome to the Enhancement suite V' + version_c + '');
    log_message('Welcome to the Enhancement suite V' + version_c + '');
    console.log('\n');
    heart_beat();


});

function total_check() { //logic and check if bot has enough bank for martingale

    if ($multiplierInput !== undefined &&   $limiterInput !== undefined)
        if ($.isNumeric($multiplierInput.val()) && $.isNumeric($limiterInput.val()) && $.isNumeric($('#pct_bet').val())) {

            var total = 0;
            var mult = 1;
            var i;
            var res_val = parseFloat($("#reset_value").val()) - 1;
            var res_step = parseFloat($("#reset_step").val());

            if ($('#resetL_check').prop('checked')) {


                for (i = 0; i < $limiterInput.val(); i++) {

                    total += $('#pct_bet').val() * mult;
                    mult *= $multiplierInput.val();           
                }

                var total2 = total * res_val;
                total += total2;
                $("#required_bank").val(total.toFixed(8));

            } else {

                for (i = 0; i < $limiterInput.val(); i++) {
                    total += $('#pct_bet').val() * mult;
                    mult *= $multiplierInput.val();           
                }
                $("#required_bank").val(total.toFixed(8));
            }

            if (total !== 0 && total < $('#pct_balance').val()) {
                // Good to go           
            } else {
                // not enough balance           
            }      
        } else {
            //something is missing      
        }
}

//-------------------------------------- Post message in the log area
function log_message(message) {
    document.querySelector(".log").innerHTML = (message);
    setInterval(function() {
        document.querySelector(".log").innerHTML = " ";
    }, 6000);
}

//-------------------------------------- Win sound
function play_sound1() {
    if ($('#sound_check').prop('checked')) {
        //snd_alert.pause();
        //snd_beep.pause();
        //coin_drop.play();
        //coin_drop.currentTime = 0;
    } else {
        return;
    }
}

//-------------------------------------- Lose sound
function play_sound2() {
    if ($('#sound_check2').prop('checked')) {
        //snd_alert.pause();
        //coin_drop.pause();
        //snd_beep.play();
        //snd_beep.currentTime = 0;
    } else {
        return;
    }
}

//-------------------------------------- Bust sound
function play_sound3() {
    if ($('#sound_check3').prop('checked')) {
        //snd_beep.pause();
        //coin_drop.pause();
        //snd_alert.play();
        //snd_alert.currentTime = 0;
        //alert("Bot has bust !!");
    } else {
        return;
    }
}