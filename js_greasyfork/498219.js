// ==UserScript==
// @name         immediate working offline
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.3
// @description  immediate4
// @author       You
// @match        https://max.niceincontact.com/index*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498219/immediate%20working%20offline.user.js
// @updateURL https://update.greasyfork.org/scripts/498219/immediate%20working%20offline.meta.js
// ==/UserScript==

hf=document.getElementsByClassName("state-item-template");
 //   hf[2].click();
  //  hf[11].click();
     var now = new Date();
     var hf=document.getElementsByClassName("state-item-template");

    function refreshAt(hours, minutes, seconds) {
    var now = new Date();
    var then = new Date();

    if(now.getHours() > hours ||
        (now.getHours() == hours && now.getMinutes() > minutes) ||
        now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);

    var timeout = (then.getTime() - now.getTime());
    setTimeout(function() { console.log("reloading");
                           window.onbeforeunload = null;
                        window.location.reload();}, timeout);
}

    function clickOffline(hours, minutes, seconds) {
    var now = new Date();
    var then = new Date();

    if(now.getHours() > hours ||
        (now.getHours() == hours && now.getMinutes() > minutes) ||
        now.getHours() == hours && now.getMinutes() == minutes && now.getSeconds() >= seconds) {
        then.setDate(now.getDate() + 1);
    }
    then.setHours(hours);
    then.setMinutes(minutes);
    then.setSeconds(seconds);

    var timeout = (then.getTime() - now.getTime());
    setTimeout(function() { console.log("clicking working offline");
                           //document.getElementById("swapCheckbox").click();
                           document.getElementsByClassName("toggle-leg-button")[0].click();
                          document.getElementsByClassName("state")[0].click();
                           //document.getElementsByClassName("state")[0].click();
                          }, 25000);
        //document.getElementsByClassName("state")[0].click();
}
    //refreshAt(8,3,0);
    clickOffline(8,10,0);

    /*var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 17, 0, 0) - now;
    if (millisTill10 < 0) {
        millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
    }
    setTimeout(function(){
    var hf=document.getElementsByClassName("state-item-template");
    //hf[2].click();
    setTimeout(function(){hf[11].click();}, 6000);
    }, millisTill10);*/
    //setTimeout(function(){var hf=document.getElementsByClassName("state-item-template");
    //hf[11].click();}, 2000);