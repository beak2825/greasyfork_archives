// ==UserScript==
// @name         BabyDoge Bot
// @namespace    kiddyearner.com
// @version      2024-05-19
// @description  auto iframe ads
// @author       Script Bot Dev
// @match        https://kiddyearner.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiddyearner.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495690/BabyDoge%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/495690/BabyDoge%20Bot.meta.js
// ==/UserScript==


//remove ads
if(document.querySelector(".buttonad")){
    document.querySelector(".buttonad").remove();
}
if(document.querySelector(".btnad_btn_c")){
    document.querySelector(".btnad_btn_c").remove();
}
if(document.querySelector(".btn_ad_content")){
    document.querySelector(".btn_ad_content").remove();
}
if(document.querySelector(".buttonade")){
    document.querySelector(".buttonade").remove();
}
if(document.querySelector("#HBai_10_Leaderboard_2")){
    document.querySelector("#HBai_10_Leaderboard_2").remove();
}
if(document.querySelector("#wcfloatDiv4")){
    document.querySelector("#wcfloatDiv4").remove();
}
if(document.querySelector("#HBai_3_Anchor_Top")){
    document.querySelector("#HBai_3_Anchor_Top").remove();
}
if(document.querySelector("#HBai_2_Anchor_Bottom")){
    document.querySelector("#HBai_2_Anchor_Bottom").remove();
}
///
if(document.location.href.includes("https://kiddyearner.com/ptc/view/")){
var BOT = setInterval(function(){
    var recaptcha = document.querySelector("#g-recaptcha-response").value;
               if((recaptcha) && recaptcha > ""){
                document.querySelector("#ptcCaptcha > div > div > div.modal-body > form").submit();
                   clearInterval(BOT);
            }
},500);
//setTimeout(function(){ $('#ptcCaptcha').modal('show'); },500);

}

if(document.location.href.includes("https://kiddyearner.com/ptc")){
    if(document.querySelectorAll("button.claim-btn")){
document.querySelectorAll("button.claim-btn")[0].click();
    }
}