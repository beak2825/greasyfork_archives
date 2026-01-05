// ==UserScript==
// @name         👻 Smart OmegleBOT
// @namespace    https://www.omegle.com
// @version      5.54370
// @description  .......
// @author       543543tet4356
// @match        https://www.omegle.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/383554-messagebot-js/code/MessageBot%20JS.js?version=711323
// @require      https://greasyfork.org/scripts/384000-anti-captcha-js/code/Anti-captcha%20JS.js
// @downloadURL https://update.greasyfork.org/scripts/24438/%F0%9F%91%BB%20Smart%20OmegleBOT.user.js
// @updateURL https://update.greasyfork.org/scripts/24438/%F0%9F%91%BB%20Smart%20OmegleBOT.meta.js
// ==/UserScript==

var googleCaptcha = false;

(function() {
    'use strict';

messageUser('b0');

var bot = {
username:_username,
message: _message1,
message2:_message2,
message3:_message3,
message4:_message4,
message5:_message5,
reach:0,
reTimer:0,

interval:3000,


check: function(){
// Random Tracks for omegle
var getRandomTrack = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 8; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}


var randValue = getRandomTrack();
var newUsername = bot.username;

                if(!bot.init){
                        bot.sent = false;
                        bot.timer = null;
                        bot.ready = true;
                        logo.innerHTML = `<h2 style="font-weight:400; margin-top: 0px;">👻 Smart OMB.<font color=#98C600>js</font><br/>
                                <small class ="captc">solver: <span style="color:#c600ff">${googleCaptcha}</span></small><small>
                                <small></font></h2>`;
                        //sharebuttons.remove();
                        tagline.innerHTML = `<span style="font-weight:400;position: relative; left:-150px"></font><br/>
                                <small class ="captc"></small><small>
                                <small>Traffic: <font color=#00DC7E> ${bot.reach} </font></span>`;

                        introtext.innerHTML = "";
                        monitoringnotice.innerHTML = "<div onkeyup='bot.message = this.value' style='font-size:12pt;'><center>(1)"
                            + bot.message + "<br />(2)"
                            + bot.message2+ "<br />(3)"
                            + bot.message3+ _username+ "<br />(4)"
                            + bot.message4+ "<br />(5)"
                            + bot.message5+ "</center></div>";
                        mobilesitenote.innerHTML = "";
                        feedback.innerHTML = "";
                        bot.captcha = false;
                        chattypeheaderrow.remove();
                        topterms.innerHTML = `<h1>Press the "1" to active the Recaptcha Solver<br>Press "ENTER" to start running this BOT</h1>`;
                        chattypes.getElementsByTagName("tr")[1].remove();
                        bot.init = true;
                        setTimeout(bot.check,bot.interval);

                }else{
                        if(bot.ready){
                                var m = 0;
                                if($("textbtn")) m=0; // pag principal


                            // NEW - avoid the slow connection to the server
                            if(document.getElementsByClassName("statuslog")[0]){
                                    var t = document.getElementsByClassName("statuslog")[0];

                                try{

                                    if( t.innerHTML=="Looking for someone you can chat with..." || t.innerHTML=="Connecting to server..."){
                                        console.log('Timer '+bot.reTimer++);
                                    }
                                    else{
                                        console.log('Timer '+bot.reTimer--);

                                    }

                                    if (bot.reTimer === 20) {
                                        document.getElementsByClassName("disconnectbtn")[0].click();
                                        document.getElementsByClassName("disconnectbtn")[0].click();
                                        bot.reTimer =0;
                                    }
                                    if (bot.reTimer <= 0) {
                                        bot.reTimer = 0;
                                    }
                                } catch (e) {}
                            }
                            // END update

                                if(document.getElementsByClassName("statuslog")[0]){
                                        var t = document.getElementsByClassName("statuslog")[0];
                                        try{
                                            if( t.innerHTML=="Looking for someone you can chat with..." ) m = 2;
                                        } catch (e) {}
                                        if( t.innerHTML=="You're now chatting with a random stranger. Say hi!" ) m = 1;
                                }
                                if(document.getElementsByClassName("newchatbtnwrapper")[0]) m = 3;

                                try{
                                if(document.getElementsByClassName("logitem")[0].getElementsByTagName("iframe")[0]) m = 4;
                                }catch(e){}

                                if(m===0){
                                        document.title = " (" + m + ") " + "At Home.";

                                }
                                if(m==1){
                                        document.title = " (" + m + ") " + "Chatting...";
                                        if(!bot.sent){

                                            //document.cookie = '__utmc='+'2'+randValue;
                                            //document.cookie = '__utmb='+'2'+randValue+'.0.8.1558615478391';
                                            //document.cookie = '__utma='+'2'+randValue+'736565632.1558541735.157611735.1558651745.1';

                                                document.getElementsByClassName("chatmsg")[0].value = bot.message;
                                                document.getElementsByClassName("sendbtn")[0].click();

                                                document.getElementsByClassName("chatmsg")[0].value = bot.message2;
                                                document.getElementsByClassName("sendbtn")[0].click();

                                                document.getElementsByClassName("chatmsg")[0].value = bot.message3;
                                                document.getElementsByClassName("sendbtn")[0].click();

                                                document.getElementsByClassName("chatmsg")[0].value = bot.message4+newUsername;
                                                document.getElementsByClassName("sendbtn")[0].click();

                                                document.getElementsByClassName("chatmsg")[0].value = bot.message5 + randValue;
                                                document.getElementsByClassName("sendbtn")[0].click();

                                                document.getElementsByClassName("disconnectbtn")[0].click();
                                                bot.reach++;
                                                bot.sent = true;
                                        }else{
                                                document.getElementsByClassName("disconnectbtn")[0].click();
                                                bot.sent = false;
                                        }
                                }
                                if(m==2){
                                        document.title = " (" + m + ") " + "Searching...";


                                        bot.captcha = false;
                                }
                                if(m==3){
                                        document.title = " (" + m + ") " + "Disconnected.";
                                        document.getElementsByClassName("newchatbtnwrapper")[0].getElementsByTagName("img")[0].click();
                                }
                                if(m==4){

                                    // DISABLED for no captcha solver
                                    // ======
                                    if ( googleCaptcha == false )
                                    {
                                        // ..
                                        document.getElementsByClassName("logitem")[0].outerHTML = "";

                                        setTimeout(function(){
                                            document.getElementsByClassName("disconnectbtn")[0].click();
                                            document.getElementsByClassName("disconnectbtn")[0].click();
                                        },12000);
                                        // ..
                                    }
                                    // ======
                                    document.title = " (" + m + ") " + "CAPTCHA!";
                                    if(!bot.captcha){

                                        bot.captcha = true;
                                        //alert('Debes ingresar el captcha, luego el script seguirá automáticamente!');

                                    }
                                }
                        tagline.innerHTML = `<span style="font-weight:400;position: relative; left:-150px"></font><br/>
                                <small class ="captc"></small><small>
                                <small>Traffic: <font color=#00DC7E> ${bot.reach} </font></span>`;
                        }
                        setTimeout(bot.check,bot.interval);
                }
        }
};
bot.check();})();
//============================================================================
// Keyboard system for: anticaptcha and to run this bot
//============================================================================
// press '1' to active the anti-captcha
// press 'ENTER' to start the bot
// ...
document.addEventListener('keypress', function(e)
{
    // ...
    if(e.key == '1') // PRESS "THE BUTTON 1" TO ACTIVE
    {
        Anti_captcha();
        googleCaptcha = true;
        document.getElementsByClassName('captc')[0].innerHTML = "solver: <span style='color:#00DC7E'>"+googleCaptcha+"</span>";
        console.log('var googleCaptcha: '+googleCaptcha);
        e.preventDefault();
    }
    // ...
    if(e.key == 'Enter') // PRESS "THE BUTTON ENTER" TO ACTIVE
    {
        document.getElementById("textbtn").click();
        document.cookie = 'botExe=true';
        e.preventDefault();
    }
});
// ...
var start_bot = (document.cookie.match(/^(?:.*;)?\s*botExe\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1];
if( start_bot ){ document.getElementById("textbtn").click(); }
//============================================================================
//============================================================================