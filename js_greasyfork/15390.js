// ==UserScript==
// @name         NeoBux Auto PTC
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  A script that assists the user in viewing Neobux's PTC ads
// @author       YouKnowNothing
// @match        https://www.neobux.com/m/v/?vl=*
// @match        http://www.neobux.com/v/?a=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15390/NeoBux%20Auto%20PTC.user.js
// @updateURL https://update.greasyfork.org/scripts/15390/NeoBux%20Auto%20PTC.meta.js
// ==/UserScript==

// ------------------ Part I ----------------- //
if (window.location.href.split("/?vl=").length > 1){
    counter = 0;
    function Move(counter){
        $("#tl .mbxm").eq(counter).find("table[onclick]").mousemove();
    }
    window.click = function(counter){
        //console.log("COUNTER "+counter+" FOUND, CLICKING...");
        $("#tl .mbxm").eq(counter-1).find("table[onclick]").mouseout();
        $("#tl .mbxm").eq(counter).find("table[onclick]").mouseover().click();
        interval = setInterval(Move, 10, counter);
        setTimeout(function(){
            clearInterval(interval);
            $("#tl img[src*='dot']").eq(counter)[0].click();
        }, 2000, interval);
    };
    window.Next = function(){
        //console.log("STARTED CHECKING COUNTER "+counter);
        wait = 35000;
        if ($("#tl .mbxm").eq(counter).find("div[class='ad0']").length === 0){
            $("#tl .mbxm").eq(counter).addClass("abds").css("borderColor", "#666");

            window.click(counter);
            $("#tl .mbxm").eq(counter).removeClass("abds").css("borderColor", "#ccc");

        } else {
            //console.log("COUNTER "+counter+" NOT FOUND, SKIPPING...");
            wait = 0;
        }
        if (window.counter < 55) setTimeout(Next, wait);
        counter += 1;
    };
    setTimeout(function(){
        window.Next();
    }, 1000);
    
// ------------------ Part II ---------------- //
} else if (window.location.href.split("/?a=").length > 1){
    $("body").attr("onbeforeunload", "document.write('closing window...')");
    setInterval(function(){
        if ($("#o1").css("display") !== "none"){
            console.log("closing");
            window.close();
        }
    }, 1000);
}