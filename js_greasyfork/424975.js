// ==UserScript==
// @name         FreeFaucet Soundman AutoROLL Bot
// @namespace    https://greasyfork.org/en/users/689247-soundman
// @version      0.8
// @description  AutoRoll Script for FreeCardano.com-freebitcoin.io-freenem.com-coinfaucet.io-freesteam.io-freetether.com-freeusdcoin.com-freebinancecoin.com-freeethereum.com-free-tron.com-freedash.io-freechainlink.io-freeneo.io-free-ltc.com-free-doge.com
// @author       Soundman
// @match        https://freecardano.com/free
// @match        https://freebitcoin.io/free
// @match        https://freenem.com/free
// @match        https://coinfaucet.io/free
// @match        https://freesteam.io/free
// @match        https://freetether.com/free
// @match        https://freeusdcoin.com/free
// @match        https://freebinancecoin.com/free
// @match        https://freeethereum.com/free
// @match        https://free-tron.com/free
// @match        https://freedash.io/free
// @match        https://freechainlink.io/free
// @match        https://freeneo.io/free
// @match        https://free-ltc.com/free
// @match        https://free-doge.com/free
// @grant        none
// @create       2021-01-07
// @note         2021-01-20-Ver. 0.7 Added info on InfoPanel
// @note         2021-01-18-Ver. 0.6 Bugfix
// @note         2021-01-18-Ver. 0.5 Added info panel and cookies
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424975/FreeFaucet%20Soundman%20AutoROLL%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/424975/FreeFaucet%20Soundman%20AutoROLL%20Bot.meta.js
// ==/UserScript==

var LOG_LEVEL=1;
var script_version = GM_info.script.version;
var currency="";
var total_executions = getCookie("executions");
var winning = getCookie("winning");
var last_win = getCookie("last_win");

if (! (total_executions > 0)) total_executions = 0;
if (! (winning > 0)) winning = 0;
if (! (last_win > 0)) last_win = 0;

// CONFIG //
var UPDATE_TITLE = true; //Show time remaining for next roll in the browser tab

// END CONFIG //

var title;

(function() {
    'use strict';

    var minuti;
    var secondi;
    var t;
    title=document.title;

    console.log("%c[Debug] GetCurrency", 'color: grey');
    currency=getCurrency();


        // wait 5 seconds to get the page loaded. Needed by some single board computer
        setTimeout(function() {
            t=missingTime();
            InfoPanel();
        },5000)

        //Now wait 10 seconds to get the missing time loaded.
        setTimeout(function() {
            if (t[0]==0 && t[1]==0){
                //time is past calling roll with random time from 1 to 10 seconds
                var rnd=random(1000,10000);
                console.log("%c[Debug] Calling Roll with rnd: "+rnd, 'color: grey');
                setTimeout(function() {Roll();},rnd)
            } else{
                //time is not past, reload the page at the end of timer
                var tt=0;
                tt=t[0]*60*1000;
                tt=tt+(t[1]*1000)+3000;

                console.log("%c[Debug] Calling reload with rnd: "+tt, 'color: grey');

                setTimeout(function() {
                    reload();
                }, tt);

                if (UPDATE_TITLE){
                    setInterval(function(){
                        var tt=missingTime();
                        document.title=tt[0] + "m:" + tt[1] + "s " + title;
                    }, 1000);
                }

            }
        },10000)


 })();


function InfoPanel(){
    var Panel='';
    var CSS='';
    CSS = '<style> #script_output {background: rgb(0, 47, 47); border: 2px groove #09ff00; margin-bottom: 1em;} ';
    CSS += '#script_output .script_output {color: white; font-weight:normal; font-size: 1em} ';
//     CSS += '#script_output_title_msg {font-size: 1em; color: orange; text-align: right; position:absolute; left:0; top:0.5em;} ';
    CSS += '#script_output_title_msg {font-size: 1em; color: white; text-align: left;} ';
    CSS += '#script_output_title_msg span {line-height:1.5em;} ';
    CSS += '#script_output_title_msg_num {font-size: 1em; color: rgb(0,255,127); text-align: left;} ';
    CSS += 'a {text-decoration:none;} ';
    CSS += '</style>';

    Panel = '<div class="center free_play_bonus_box_large" id="script_output">';
    Panel += '<div style="position:relative; width: 100%"><p id="script_output_title" style="color: rgb(0,255,127); font-weight:bold; text-align: center;">FreeFaucet AutoROLL v.'+script_version+'</p>';
    Panel += '<div id="script_output_title_msg">';
    Panel += '<span id="script_output_title_msg_executions" style="color:white;">Executions: <span id="script_output_title_msg_num" class="true bold">'+total_executions+'</span></span><br>';
    Panel += '<span id="script_output_title_msg_Currency" style="color:white;">Currency: <span id="script_output_title_msg_num" class="true bold">'+currency+'</span></span><br>';
    Panel += '<span id="script_output_title_msg_Win" style="color:white;">Script Total Win: <span id="script_output_title_msg_num" class="true bold">'+winning+'</span></span><br>';
    Panel += '<span id="script_output_title_msg_LastWin" style="color:white;">Script Last Win: <span id="script_output_title_msg_num" class="true bold">'+last_win+'</span></span><br>';

    Panel += '</div></div>';
    Panel += '<p class="script_output" id="script_output_msg_1"></p>';
    Panel += '<p class="script_output" id="script_output_msg_2"></p>';
    Panel += '<p class="script_output" id="script_output_msg_3" style="color:grey; font-size:0.8em; line-height:0.8em; font-family: console; ">Script Home Page: <a href="https://greasyfork.org/it/scripts/419810-freefaucet-autoroll" target="_blank">Home Page</a></p>';
    Panel += '<p class="script_output" id="script_output_msg_4" style="color:grey; font-size:1em; line-height:1em; font-family: console; "> This Script also work with <a href="https://free-doge.com/?ref=32013" target="_blank">free-doge.com</a> - <a href="https://freecardano.com/?ref=263024" target="_blank">freecardano.com</a> - <a href="https://freebitcoin.io/?ref=339159" target="_blank">freebitcoin.io</a> - <a href="https://freenem.com/?ref=261095" target="_blank">freenem.com</a> - <a href="https://coinfaucet.io/?ref=694525" target="_blank">coinfaucet.io</a> - <a href="https://freesteam.io/?ref=90790" target="_blank">freesteam.io</a> - <a href="https://freetether.com/?ref=130741" target="_blank">freetether.com</a> - <a href="https://freeusdcoin.com/?ref=69982" target="_blank">freeusdcoin.com</a> - <a href="https://freebinancecoin.com/?ref=88852" target="_blank">freebinancecoin.com</a> - <a href="https://freeethereum.com/?ref=62968" target="_blank">freeethereum.com</a> - <a href="https://free-tron.com/?ref=128556" target="_blank">free-tron.com</a> - <a href="https://freedash.io/?ref=51080" target="_blank">freedash.io</a> - <a href="https://freechainlink.io/?ref=44985" target="_blank">freechainlink.io</a> - <a href="https://freeneo.io/?ref=" target=36724"_blank">freeneo.io</a> - <a href="https://free-ltc.com/?ref=19932" target="_blank">free-ltc.com</a></p>';
    Panel += '<p class="script_output" id="script_output_msg_4" style="color:grey; font-size:0.8em; line-height:0.8em; font-family: console; "> Donations are welcome, BTC addr: 3G5p78zeNaMKPndTfgXGW9swu5JcFqLMgQ - ©️ soundman 2021</p>';
    Panel += '</div> ';

    var ss=document.createElement('div');
    ss.innerHTML=CSS+Panel;
    //console.log(ss.innerHTML);
    document.getElementsByClassName("free")[0].prepend(ss);
}

function getCurrency(){
    return document.getElementsByClassName("navbar-coins bg-1")[0].innerText.split(" ")[1];
}

function getResult(){
    console.log("%c[Debug] getResult!!", 'color: grey');
    var a= document.getElementsByClassName("result")[0].innerText.split(" ")[3];
    console.log("%c[Debug] result: " + a, 'color: grey');
    last_win = parseFloat(a);
    winning =parseFloat(winning) + parseFloat(last_win);
    setCookie('winning', winning.toFixed(8), 7);
    setCookie('last_win', last_win.toFixed(8), 7);
}

function random(min,max){
   return min + (max - min) * Math.random();
}

function reload(){
    location.reload();
}

function Roll(){
    console.log("%c[Debug] ROLL!!", 'color: grey');
    if (document.getElementsByClassName("main-button-2 roll-button bg-2")[0].parentElement.style.display!="none"){
        document.getElementsByClassName("main-button-2 roll-button bg-2")[0].click()
        total_executions++;
        setCookie('executions', total_executions, 7);
    }

    setTimeout(function(){ getResult(); }, 8000);

    var rnd=random(10000,20000);
        setTimeout(function(){ location.reload(); }, rnd);
        console.log("%c[Debug] Reload in " + rnd , 'color: grey');
}

function missingTime () {
    var minuti="";
    minuti=document.getElementsByClassName("timeout-container")[0].getElementsByClassName("minutes")[0].getElementsByClassName("digits")[0].innerText
    var secondi="";
    secondi=document.getElementsByClassName("timeout-container")[0].getElementsByClassName("seconds")[0].getElementsByClassName("digits")[0].innerText
    if (LOG_LEVEL==0) console.log("%c[Debug] [missingTime]: "+minuti +":"+secondi , 'color: grey');
    //console.log("%c[Debug] [missingTime] string secondi: "+secondi, 'color: grey');
    if (minuti != "" && secondi!="" ){
        return [minuti,secondi];
    }
    else{return [0,0];}
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  console.log("%c[Debug] [setCookie]: "+cname +":"+cvalue , 'color: grey');
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

