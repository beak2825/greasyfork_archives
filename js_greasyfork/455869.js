// ==UserScript==
// @name         FreeBitcoinStats
// @version      1.01
// @description  feel free to donate: 3Q5QzL6iZHyDPTpLYaNhDA2UhRUTxf8D4t
// @license      MIT
// @author       Derko
// @match        https://freebitco.in/#
// @grant        none
// @namespace    https://greasyfork.org/users/229236-derko
// @downloadURL https://update.greasyfork.org/scripts/455869/FreeBitcoinStats.user.js
// @updateURL https://update.greasyfork.org/scripts/455869/FreeBitcoinStats.meta.js
// ==/UserScript==


(function () {
    'use strict';

    var body = $('body');
    var points = {};
    //
    var gamer_version = GM_info.script.version;
    var gamer_email = $("#contact_form_email").val();
    var gamer_withdraw_btc_address = $("#edit_profile_form_btc_address").val();
    //console.log("e-mail: " + gamer_email + "");
    //console.log("withdraw btc: " + gamer_withdraw_btc_address + "");
    var btc_avail = $("#balance").text();
    var bonus_account_balance = "0.00000000";
    var bonus_msg = $('.dep_bonus_max:eq(0)').text();

    //config variables
    var WALK = false; //dali da zalupva linkovete
    var PLAY = false; //dali vaobshte da klika
    var TPA = 1;
    var OPA = 1; //off
    var DPA = 1; //def
    var EPA = 0; //elites
    //
    var _random = 0; //kolko sekundi da chaka predi da izbere drug link
    var _relax = 0; //kolko sekundi da pochiva
    var _sci = 0; //poseshtenija na linka
    var _army = 0; //poseshtenija na linka
    var _build = 0; //poseshtenija na linka
    //
    var SCI = [];
    var land = 400;
    var runes = 0;
    //
    var autowithdraw = false;
    //
    var last_task_id = 0;
    var capctha_errors = 0;
    var btc_before_bet = -123;
    //
    var minutes_left = 60;
    var seconds_left = 60;
    //
    var myCounter = -1;
    //
    $('<div id="tools" style="z-index: 99;width: 100%;position: fixed;top: 0px;left: 0;margin: 0 auto;background-color: gray;text-align:right;float:right;">\n\
<span id="greasyfork"                  style="margin: 2px; color: black; " ><a href="https://greasyfork.org/en/scripts/424172-betmanager" target="_blank">BetManager</a></span>\n\
<span id="gamer_play_status"           style="margin: 2px; background-color: coral; " > </span>\n\
<span id="gamer_bonus_account_balance" style="margin: 2px; background-color: rgb(51, 255, 51); " >bonus </span>\n\
<span id="gamer_btc_avail"             style="margin: 2px; background-color: lightblue; bold; display: none; " >btc_avail</span>\n\
<span id="gamer_email"                 style="margin: 2px; color: darkred; " >e-mail</span>\n\
<span id="gamer_version"               style="margin: 2px; background-color: coral; " >ver. </span>\n\
</div>').prependTo('body');

    $('<div id="config_container" style="z-index: 99;width: 100%;position: fixed;top: 15px;left: 0;margin: 0 auto;text-align:right;float:right;">\n\
<div id="config" style="width: 25%; margin: 0px; background-color: silver; text-align:left; float:right; " >\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " >OPA: <select name="opa" id="opa" onchange="onClick_3PA()"><option value="0" selected="selected">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " >DPA: <select name="dpa" id="dpa" onchange="onClick_3PA()"><option value="0" selected="selected">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " >TPA: <select name="tpa" id="tpa" onchange="onClick_3PA()"><option value="1" selected="selected">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option></select></span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickCB()" id="CB1" /> walk</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickCB()" id="CB2" /> play</span>\n\
<p ondblclick="onDblClickP()" style="color: blue; margin-top: 0px; margin-bottom: 0px; ">DblClk to hide</p>\n\
<!--<p ondblclick="onDblClickX()" style="color: red;  ">CLEAR depositmode</p>-->\n\
<script>\n\
function onClick_3PA(){\n\
    var e = document.getElementById("opa");\n\
    var newOPA = e.options[e.selectedIndex].value;\n\
    console.log("newOPA: " + newOPA);\n\
    OPA = e.options[e.selectedIndex].value;\n\
    \n\
    var e = document.getElementById("dpa");\n\
    var newDPA = e.options[e.selectedIndex].value;\n\
    console.log("newDPA: " + newDPA);\n\
    OPA = e.options[e.selectedIndex].value;\n\
    \n\
    var e = document.getElementById("tpa");\n\
    var newTPA = e.options[e.selectedIndex].value;\n\
    console.log("newTPA: " + newTPA);\n\
    TPA = e.options[e.selectedIndex].value;\n\
    \n\
    var       cfg = document.getElementById("config");\n\
    cfg.style.backgroundColor = "crimson";\n\
}\n\
function onClickSCI(){\n\
    var       cfg = document.getElementById("config2");\n\
    cfg.style.backgroundColor = "crimson";\n\
}\n\
function onClickCB(){\n\
    var       cfg = document.getElementById("config");\n\
    cfg.style.backgroundColor = "crimson";\n\
}\n\
function onDblClickP(){\n\
    var x = document.getElementById("config_container");\n\
    x.style.display = "none";\n\
}\n\
function onDblClickRelax(){\n\
    _relax = -1;\n\
    localStorage.setItem("Gamer._relax", _relax);\n\
    console.log("RESET relax seconds!");\n\
    //\n\
    _sci = 0;\n\
    localStorage.setItem("Gamer._sci", _sci);\n\
    _army = 0;\n\
    localStorage.setItem("Gamer._army", _army);\n\
    _build = 0;\n\
    localStorage.setItem("Gamer._build", _build);\n\
    //window.location.reload(true);\n\
}\n\
function onDblClickX(){\n\
    // alert("Vnimavai!!!");\n\
    document.cookie = "FreeBTC_Gamer.deposit_mode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";\n\
    window.location.reload(true);\n\
}\n\
</script>\n\
</div>\n\
<div id="config2" style="width: 45%; margin: 0px; background-color: DarkOliveGreen; text-align:left; float:right; " >\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_0" />Alchemy</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_1" />Tools</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_2" />Housing	</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_3" />Production</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_4" />Bookkeeping</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_5" />Artisan</span>\n\
<\p>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_6" />Strategy</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_7" />Siege</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_8" />Tactics</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_9" />Valor</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_10" />Heroism</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_11" />Resilience</span>\n\
<\p>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_12" />Crime</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_13" />Channeling</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_14" />Shielding</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_15" />Cunning</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_16" />Sorcery</span>\n\
<span style="text-align:left; margin-left: 1px; margin-top: 0px; margin-bottom: 0px; " ><input type="checkbox" onclick="onClickSCI()" id="SCI_17" />Invocation</span>\n\
</div>\n\
<div id="status" style="width: 10%; margin: 0px; background-color: orange; text-align:left; float:right; font-family: fixedsys, monospace; " >\n\
<p ondblclick="onDblClickRelax()" style="text-align:center; margin-left: 10px; " ><span>relax time</span><input style="width: 70%; " id="relax_seconds" /> </inpu>\n\
</div>\n\
<div id="random" style="width: 10%; margin: 0px; background-color: orange; text-align:left; float:right; font-family: fixedsys, monospace; " >\n\
<p               style="text-align:center; margin-left: 10px; " ><span>random time</span><input style="width: 70%; " id="random_seconds" /> </inpu>\n\
</div>\n\
</div>').prependTo('body');
    //
    //

function secondsTimeSpanToHMS(s) {
  var h = Math.floor(s / 3600); //Get whole hours
  s -= h * 3600;
  var m = Math.floor(s / 60); //Get remaining minutes
  s -= m * 60;
  return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
}

    function showBar() {
        //console.log("showBar()"); //logva vsjaka sekunda!!!
        $("#header").css("display", "none");
        //$("#ircchat").css("display", "none");
        //maham reklamite na google :)
        //$('#right-column').hide();
        $('#right-column').remove();
        //relax ticking
        _relax = localStorage.getItem('Gamer._relax');
        if (Number(_relax) < 0) {
            _relax = 7;
        }
        if (Number(_relax) > 0) {
            _relax = Number(_relax - 1);
            localStorage.setItem('Gamer._relax', _relax);
            if (Number(_relax) <= 0) {
                //start working!
                _sci = 0;
                localStorage.setItem('Gamer._sci', _sci);
                _army = 0;
                localStorage.setItem('Gamer._army', _army);
                _build = 0;
                localStorage.setItem('Gamer._build', _build);
                //
                console.log("start working!");
            }
        }
        //$("#relax_seconds").val(_relax);
        var _str = secondsTimeSpanToHMS(_relax);
        $("#relax_seconds").val(_str);
        //random ticking
        if (Number(_random) > 0) {
            _random = Number(_random - 1);
            localStorage.setItem('Gamer._random', _random);
        }
        _str = secondsTimeSpanToHMS(_random);
        $("#random_seconds").val(_str);
    }
    showBar();
    setInterval(showBar, 1000);


    function Kernel() {
        if ( $('.introjs-skipbutton').is(':visible')) {
            console.log("introjs-skipbutton");
            $(".introjs-skipbutton")[0].click();
        }
        if ( $('#signInForm').is(':visible')) {
            console.log("signInForm");
            $("#signInForm").submit();
        }
        if ((Number(_sci) >= 1) && (Number(_army) >= 1) && (Number(_build) >= 1) && (Number(_relax) <= 0)) {
            var min = 6 * 60 * 60; //6 chassa
            var max = 9 * 60 * 60; //devet chasa
            var random = Math.floor(Math.random() * (max - min + 1)) + min;
            _relax = random;
            localStorage.setItem('Gamer._relax', _relax);
            console.log("relax seconds: " + _relax);
        } else {
            console.log("waiting... _sci:" + _sci + ", _army:" + _army + "_relax:" + _relax);
        }
if ((PLAY === true) && (Number(_relax) <= 0)) {
    console.log("PLAY: enabled");
        //
        var dt = new Date();
        var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        //console.log(time);
        //
        $("h2").contents().each(function( index ) {
            //console.log( index + ": " + $( this ).text() );
            var strng = $( this ).text();
            var incStr = strng.includes("next tick:");
            //console.log(incStr);
            if (incStr === true) {
                //console.log("here!");
                console.log( index + ": " + $( this ).text() );
                var array = strng.split(' ');
                console.info(array);
                var title = array[7];
                console.log(title);
                if (title === "minutes)" ) {
                    console.log(array[7] + ": " + array[6]);
                }
                //
            }
        });
        //
        var url = $(location).attr('href');
        if (url == "https://utopia-game.com/wol/game/train_army" && $('.two-column-stats').is(':visible')) {
            //
            if (Number(_build) < 1) {
                console.log("build first!");
                var url_build = "https://utopia-game.com/wol/game/build";
                window.location.replace(url_build);
            }
            _army = Number(_army) + 1;
            localStorage.setItem('Gamer._army', _army);
            console.log("new _army: " + _army);
            //
            console.log("two-column-stats");
            //
            $('#resource-bar  > tbody  > tr > th').each(function(index, tr) {
                //console.log("neshto: " + index);
                if (index == 3) {
                    //console.log($(this));
                    runes = +($(this).html());
                    console.log("Runes: " + runes);
                }
                if (index == 5) {
                    //console.log($(this));
                    land = +($(this).html());
                    console.log("Land: " + land);
                }
            });
            //
            var solds = 0;
            var _td = 0;
            $('.two-column-stats  > tbody  > tr').each(function(index, th) {
                //console.log(index);
                if (index == 1) {
                    //console.log($(this));
                    _td = $(this).find("td").eq(1).text();
                    _td = _td.replace(',', '');
                    //
                    console.log("_td: " + _td);
                    if (Number(solds) >= 0) {
                        solds = Number(_td);
                    }
                }
            });
                    if (Number(solds) >= 0) {
                        console.log("solds to train: " + _td);
                        //training table
                        //$( "table:eq(3)" ).hide();
                        $('table:eq(3)  > tbody  > tr').each(function(index, th) {
                            //console.log("index: " + index);
                            if (index == 3) { //Thieves row
                                //console.log($(this));
                                var t_own      = Number($(this).find("td").eq(0).text());
                                var t_training = Number($(this).find("td").eq(1).text());
                                var t_max      = Number($(this).find("td").eq(3).text());
                                console.log("t_own     : " + t_own);
                                console.log("t_training: " + t_training);
                                console.log("t_max     : " + t_max);
                                var t_target = Number(TPA * land);
                                var t_have = Number(t_own + t_training);
                                console.log("t_have: " + t_have + ", t_target: " + t_target);
                                if ((Number(solds) >= 1) && (t_target > t_have) ) {
                                    var t_train = Number(t_target - t_have);
                                    console.log("train " + t_train + " thieves.");
                                    $('#id_unit-quantity_3').val(t_train);
                                    //btnTrain
                                    $("#btnTrain").click(); //!!!
                                }
                            }
                        });
                        //off/def
                        $("#id_unit-quantity_1").next().click();
                        var _max = Number($("#id_unit-quantity_1").val());
                        //_max = 10;
                        console.log("_max: " + _max);
                        var ODPA = Number(OPA + DPA);
                        console.log("ODPA: " + ODPA);
                        if (_max >= ODPA){
                            var _base = Math.trunc(_max / ODPA);
                            console.log("train!: 1x " + _base);
                            $("#id_unit-quantity_0").val(_base * OPA); //atakeri
                            $("#id_unit-quantity_1").val(_base * DPA); //defenderi
                            //btnTrain
                            $("#btnTrain").click(); //!!!
                        }
                    }

        } else if (url == "https://utopia-game.com/wol/game/science" ) {
            //
            _sci = Number(_sci) + 1;
            localStorage.setItem('Gamer._sci', _sci);
            console.log("new _sci: " + _sci);
            //
            var _max1 = 100;
            var _max2 = 100;
            var _max3 = 100;
            //
            if ($("#id_quantity_0").next().is(":visible") ) {
                $("#id_quantity_0").next().click();
                _max1 = $("#id_quantity_0").val();
                $('#id_quantity_0').val(0);
            }
            console.log("Economy: " + _max1 + " books");
            //
            if ($("#id_quantity_6").next().is(":visible") ) {
                $("#id_quantity_6").next().click();
                _max2 = $("#id_quantity_6").val();
                $('#id_quantity_6').val(0);
            }
            console.log("Military: " + _max2 + " books");
            //
            if ($("#id_quantity_12").next().is(":visible") ) {
                $("#id_quantity_12").next().click();
                _max3 = $("#id_quantity_12").val();
                $('#id_quantity_12').val(0);
            }
            console.log("Arcane Arts: " + _max3 + " books");
            //
            var cnt1 = 0;
            if (Number(_max1) > 0){
                for (let count = 0; count <= 5; count++) {
                    if (SCI[count] > 0) {
                        cnt1++;
                    }
                }
                _max1 = Math.floor(_max1 / cnt1);
                console.log("cnt1: " + cnt1 + ", max1: " + _max1);
                for (let count = 0; count <= 5; count++) {
                    if (SCI[count] > 0) {
                        $('#id_quantity_'+count).val(_max1);
                    }
                }
                //
            }
            //
            var cnt2 = 0;
            if (Number(_max2) > 0){
                for (let count = 6; count <= 11; count++) {
                    if (SCI[count] > 0) {
                        cnt2++;
                    }
                }
                _max2 = Math.floor(_max2 / cnt2);
                console.log("cnt2: " + cnt2 + ", max2: " + _max2);
                for (let count = 6; count <= 11; count++) {
                    if (SCI[count] > 0) {
                        $('#id_quantity_'+count).val(_max2);
                    }
                }
                //
            }
            //
            var cnt3 = 0;
            if (Number(_max3) > 0){
                for (let count = 12; count <= 17; count++) {
                    if (SCI[count] > 0) {
                        cnt3++;
                    }
                }
                _max3 = Math.floor(_max3 / cnt3);
                console.log("cnt3: " + cnt3 + ", max3: " + _max3);
                for (let count = 12; count <= 17; count++) {
                    if (SCI[count] > 0) {
                        $('#id_quantity_'+count).val(_max3);
                    }
                }
                //
            }
            if ((Number(_max1) > 0) | (Number(_max2) > 0) | (Number(_max3) > 0)) {
                console.log("Learn.");
                $('input[name="allocate"]').closest("form").submit();
                //$('html, body').animate({scrollTop: $("#content-area").offset().top + 0}, 1000);
            } else {
                console.log("no books to learn.");
            }
        } else if (url == "https://utopia-game.com/wol/game/build" ) {
            $("#hideshow").click(); //
            $("#loadbuild").click(); //
            $("#fillin").click(); //
            $("span").addClass("checked"); //speed build / double price
            //
            _build = Number(_build) + 1;
            localStorage.setItem('Gamer._build', _build);
            console.log("new _build: " + _build);
            if (Number(_build) <= 2) {
                  $('input[name="build"]').closest("form").submit();
                }
            //$('input[name="build"]').closest("form").submit();
        } else {
            //console.log("url: " + url);
        }
}  else { //PLAY
    console.log("PLAY: disabled");
}
    }
    Kernel();
    setInterval(Kernel, 15000);


    function CountDown(seconds){
        console.log("seconds left: " + seconds);
        $("#throne-monarch-message h2").text(seconds);
        if (Number(seconds) > 0) {
            setTimeout(CountDown(seconds-1), 1 * 1000); //ednokratno SLED edna sekunda
        }
    }

    //var min = 1 * 60; //edna munita
    //var max = 2 * 60; //dve minuti
    var min = 1 * 30; //30 sekundi
    var max = 2 * 30; //60 sekundi
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log("random seconds: " + random);
    function Walk() {
        var dt = new Date();
        //var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
        //console.log(time);
        if ( dt.getMinutes()>1 && dt.getMinutes()<59 ) {
            console.log("Time is perfect, checking walk AND relax status...");
            if ((WALK === true) && (Number(_relax) <= 0)) {
                //walk is enabled, so I can reload the page :)
                var links = ["https://utopia-game.com/wol/game/kingdom_details",
                             "https://utopia-game.com/wol/game/science",
                             "https://utopia-game.com/wol/game/train_army",
                             "https://utopia-game.com/wol/game/build",
                             "https://utopia-game.com/wol/game/council_state",
                             "https://utopia-game.com/wol/game/council_military",
                             "https://utopia-game.com/wol/game/throne",
                              "https://utopia-game.com/wol/game/province_news"
                            ];
                //for (var i = 0; i < links.length; i++) {
                //    console.log(links[i]);
                //}
                var _min = 0;
                var _max = links.length-1;
                var _random_ = Math.floor(Math.random() * (_max - _min + 1)) + _min;
                var url = links[_random_];
                console.log("jump to: " + url);
                window.location.replace(url);
                //
            } else {
                console.log("Can't walk! ");
            }
        } else {
            console.log("reload is forbidden");
        }

        random = Math.floor(Math.random() * (max - min + 1)) + min;
        _random = random;
        localStorage.setItem('Gamer._random', _random);
        console.log("random seconds: " + random);
        setTimeout(Walk, random * 1000); //ednokratno SLED random sekundi
        //
    }
    //CountDown(random);
    _random = random;
    localStorage.setItem('Gamer._random', _random);
    console.log("random seconds: " + random);
    setTimeout(Walk, random * 1000); //ednokratno SLED random sekundi


    function myLoadConfig() {
        //
        if (localStorage.getItem('Gamer._random') !== null) {
            _random = localStorage.getItem('Gamer._random');
        } else {
            localStorage.setItem('Gamer._random', _random);
        }
        //
        if (localStorage.getItem('Gamer._relax') !== null) {
            _relax = localStorage.getItem('Gamer._relax');
        } else {
            localStorage.setItem('Gamer._relax', _relax);
        }
        console.log("config _relax: " + _relax);
        //
        if (localStorage.getItem('Gamer._sci') !== null) {
            _sci = localStorage.getItem('Gamer._sci');
        } else {
            localStorage.setItem('Gamer._sci', _sci);
        }
        console.log("config _sci: " + _sci);
        //
        if (localStorage.getItem('Gamer._army') !== null) {
            _army = localStorage.getItem('Gamer._army');
        } else {
            localStorage.setItem('Gamer._army', _army);
        }
        console.log("config _army: " + _army);
        //
        if (localStorage.getItem('Gamer._build') !== null) {
            _build = localStorage.getItem('Gamer._build');
        } else {
            localStorage.setItem('Gamer._build', _build);
        }
        //
        //
        if (localStorage.getItem('Gamer.WALK') !== null) {
            WALK = (localStorage.getItem('Gamer.WALK') == 1 ? true : false);
        } else {
            localStorage.setItem('Gamer.WALK', 0);
        }
        console.log("WALK: " + WALK);
        $('#CB1').prop('checked', WALK);
        //
        if (localStorage.getItem('Gamer.PLAY') !== null) {
            PLAY = (localStorage.getItem('Gamer.PLAY') == 1 ? true : false);
        } else {
            localStorage.setItem('Gamer.PLAY', 0);
        }
        console.log("PLAY: " + PLAY);
        $('#CB2').prop('checked', PLAY);
        //
        if (localStorage.getItem('Gamer.TPA') !== null) {
            TPA = localStorage.getItem('Gamer.TPA');
        } else {
            localStorage.setItem('Gamer.TPA', TPA);
        }
        $('#tpa').val(TPA);
        console.log("config TPA: " + TPA);
        //
        if (localStorage.getItem('Gamer.OPA') !== null) {
            OPA = Number(localStorage.getItem('Gamer.OPA'));
        } else {
            localStorage.setItem('Gamer.OPA', OPA);
        }
        $('#opa').val(OPA);
        console.log("config OPA: " + OPA);
        //
        if (localStorage.getItem('Gamer.DPA') !== null) {
            DPA = Number(localStorage.getItem('Gamer.DPA'));
        } else {
            localStorage.setItem('Gamer.DPA', DPA);
        }
        $('#dpa').val(DPA);
        console.log("config DPA: " + DPA);
        //
        if (localStorage.getItem('Gamer.last_task_id') !== null) {
            last_task_id = localStorage.getItem('Gamer.last_task_id');
        } else {
            localStorage.setItem('Gamer.last_task_id', 0);
            last_task_id = 0;
        }
        console.log("last_task_id: " + last_task_id);
        //
        for (let count = 0; count <= 17; count++) {
            if (localStorage.getItem('Gamer.SCI'+count) !== null) {
                SCI[count] = localStorage.getItem('Gamer.SCI'+count);
                //console.log("load SCI" + count + ": " + SCI[count]);
                //
                var checked = (localStorage.getItem('Gamer.SCI'+count) == 1 ? true : false);
                $('#SCI_'+count).prop('checked', checked);
            } else {
                SCI[count] = 0;
                localStorage.setItem('Gamer.SCI'+count, SCI[count]);
                console.log("create SCI" + count + ": " + SCI[count]);
            }
            //console.log("SCI" + count + ": " + SCI[count]);
        }
    }
    myLoadConfig();


    function myCheckConfigChange() {
        if ($("#config").css('background-color') == "rgb(220, 20, 60)") {//"crimson"
            $('#config').css('background-color', 'silver');
            //
            var checked1 = $('#CB1').is(":checked");
            console.log("CB1: " + checked1);
            localStorage.setItem('Gamer.WALK', (checked1 ? 1 : 0));
            //
            var checked2 = $('#CB2').is(":checked");
            console.log("CB2: " + checked2);
            localStorage.setItem('Gamer.PLAY', (checked2 ? 1 : 0));
            //
            var e = document.getElementById("tpa");
            var newTPA = e.options[e.selectedIndex].value;
            TPA = newTPA;
            localStorage.setItem('Gamer.TPA', newTPA);
            console.log("newTPA: " + TPA);
            //
            e = document.getElementById("opa");
            var newOPA = e.options[e.selectedIndex].value;
            OPA = newOPA;
            localStorage.setItem('Gamer.OPA', newOPA);
            console.log("newOPA: " + OPA);
            //
            e = document.getElementById("dpa");
            var newDPA = e.options[e.selectedIndex].value;
            DPA = newDPA;
            localStorage.setItem('Gamer.DPA', newDPA);
            console.log("newDPA: " + DPA);
            //
            //vednaga reloadvam konfiguracijata
            myLoadConfig();
        }
        if ($("#config2").css('background-color') == "rgb(220, 20, 60)") {//"crimson"
            $('#config2').css('background-color', 'DarkOliveGreen');
            //
            for (let count = 0; count <= 17; count++) {
                var checked = $('#SCI_'+count).is(":checked");
                SCI[count] = (checked ? 1 : 0);
                localStorage.setItem('Gamer.SCI'+count, (checked ? 1 : 0));
                console.log("newsSCI" + count + ": " + SCI[count]);
            }
            //vednaga reloadvam konfiguracijata
            myLoadConfig();
        }
    }
    var callCheckConfigChange = setInterval(myCheckConfigChange, 3 * 1000);


    $("#gamer_version").text("ver. " + gamer_version);
    $("#gamer_email").html("" + gamer_email + "");


    //var reward = {};
    //
    //setTimeout(reward.select, 1000);
    //setInterval(reward.select, 60 * 1000);
    //
})();