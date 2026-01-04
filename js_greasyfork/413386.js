// ==UserScript==
// @name         vehikill chat+
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  speak full sentences in vehikill.io
// @author       someone
// @match        *://play.vehikill.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413386/vehikill%20chat%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/413386/vehikill%20chat%2B.meta.js
// ==/UserScript==
/*
CONTROLS:
enter: next message
shift+enter: previous message
*/
(function() {
    var interval=100;
    var shift=false;
    var msgnumber = 0;
    var levalue = 0;
    var oname="hacker";
    var mood1=["hello","hi","howdy","sorry","goodbye","bye","whoops","buttsecks","the potato",oname];
    var mood2=["winner","u loose","XD","superpro","gotem"];
    var mood3=["🌑","🌒","🌓","🌔","🌔","🌕","🌖","🌗","🌘"];
    var message=[mood1,mood2,mood3];
//put messagees here  ^
    function applymsg(word){
        document.getElementsByName("peerName")[0].value = word;
        document.getElementsByName("peerName")[0].focus();
        document.getElementsByName("peerName")[0].focus();
        void(0);
        document.getElementsByName("peerName")[0].blur();
        document.getElementsByName("peerName")[0].blur();
    }
    function chat(msg,ary){
        if(levalue==2){
            for(let i=0;i<ary.length;i++){//this is for a message array. it scrolls through it once.
                setTimeout(function(){applymsg(ary[i]);},i*interval);
            }
            setTimeout(function(){applymsg(ary[0]);},ary.length*interval);
        }else{
            applymsg(msg);
        }
    }
    document.addEventListener("keydown", function(event) {
        if(event.keyCode==16){
            shift=true;
        }
    });
    document.addEventListener("keyup", function(event) {
        if(event.keyCode==16){
            shift=false;
        }
    });
    document.addEventListener("keypress", function(event) {
        if(event.keyCode==82||event.keyCode==69){
            levalue++;
            if(levalue>message.length-1){
                levalue=0;
            }
        }
        if(event.keyCode==13){
            if(shift){
                msgnumber--;
            }else{
                msgnumber++;
            }
            if(msgnumber<0){
                msgnumber=message[levalue].length-1;
            }else if(msgnumber>message[levalue].length-1){
                msgnumber=0;
            }
            if(levalue==2){
                chat(null,message[levalue]);
            }else{
                chat(message[levalue][msgnumber]);
            }
        }
    });
})();