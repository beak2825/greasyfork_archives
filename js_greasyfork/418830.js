// ==UserScript==
// @name         Omegle "helper"
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.omegle.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418830/Omegle%20%22helper%22.user.js
// @updateURL https://update.greasyfork.org/scripts/418830/Omegle%20%22helper%22.meta.js
// ==/UserScript==

(function() {
    var input = document.createElement("input");
    input.type = "checkbox"
    input.id="hackerbox";
    input.checked=true;
    input.style.position = "absolute";
    input.style.left = '50%';
    input.style.top = '50%';



    var enabled = false;
    var lastrealmsg = "";
    var endt = 0;
    function recvmsg(msg){
        //making sure they are not a dude lol
        if(msg=="m"||msg=="M"||msg.toLowerCase().match(new RegExp("m[0-9]"))!=null){
            console.log("ITS A MAN LOL");
            setTimeout(function(){
             stop();
            }, 1000)
        } else //now we make sure they aint a bot (if they say kik)
        if(msg.toLowerCase().includes("kik")||msg.toLowerCase().includes("klk")||msg.toLowerCase().includes("sell")){
            console.log("ITS A BOT LOL");
              setTimeout(function(){
             stop();
            }, 1000)
        } else{
            lastrealmsg = msg;

            endt = Date.now()+(1000*30);
        }
    }


    function onnewchat(){
        endt = Date.now()+(1000*10);
        lastrealmsg="";

        //Auto write "m15"
        setTimeout(function(){
            writemsg("m15");
        }, 800)
    }







    function ischatting(){
        return document.getElementsByClassName("logwrapper").length>0;
    }
    function writemsg(msg){
        document.getElementsByClassName("chatmsg")[0].value = msg;
        setTimeout(function(){
            document.getElementsByClassName("sendbtn")[0].click()
        }, 800)

    }
    function next(){
      var e=document.getElementsByClassName("disconnectbtn")[0];
        if(e.innerText=="New\nEsc"){
            e.click();
        }
    }
    function stop(){
        var e=document.getElementsByClassName("disconnectbtn")[0];
        if(e.innerText=="Stop\nEsc"){
            e.click();
        }
        if(e.innerText=="Really?\nEsc"){
            e.click();
        }
    }

    var last = 2;
    var lastmsg = "";
    function checkfornext(){
        //Checking for new chat
        var len = document.getElementsByClassName("logitem").length
        if(len == 1&& len < last){
           lastmsg="";
            onnewchat();
        }
        //Checking for new message
        var msg = document.getElementsByClassName("logitem")[len-1].innerText;
        if(msg!=lastmsg){
            if(msg.toLowerCase().includes("stranger")&&!msg.includes("You're now chatting with a random stranger.")&&!msg.toLowerCase().includes("...")){
                recvmsg(msg.replace("Stranger: ",""));
            }
        }
        if(Date.now()>=endt){
            console.log("TOO SLOW");
            stop();
        }
        lastmsg = msg;
        last = len;
    }

setInterval(function(){
    if(ischatting()&&enabled){
       next();
       checkfornext();
    }
    enabled = input.checked;
    if(document.getElementById("hackerbox")==null&&ischatting()){
        document.getElementsByClassName("logwrapper")[0].appendChild(input);
    }
}, 50)
})();