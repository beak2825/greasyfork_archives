

// ==UserScript==
// @name         Youtube Bot Mobile Substrate Fix
// @namespace    http://youtube-bot.net
// @version      1.2
// @description  A YouTube ad skipper for mobile + src
// @author       0
// @include      http://en*
// @include      https://en*
// @include      en*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29064/Youtube%20Bot%20Mobile%20Substrate%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/29064/Youtube%20Bot%20Mobile%20Substrate%20Fix.meta.js
// ==/UserScript==


setTimeout (function ytm(){

$.getJSON("http://engageme.tv/token.php" , function (result) {    
    var token = result['token'];
    var createdAt = result['created_at'];
     var clk = getQueryVariable("click");
var timeout = Math.floor(Math.random() * 102000) + 84000;
    console.log("initiating..");
    setTimeout( function(){
        $.ajax({
            url: "http://adscendmedia.com/watchn.php?adv=104&key=b0072b907c&sid=" + clk,
            method: "GET",
            beforeSend: function(e) {
                e.setRequestHeader("token", token), e.setRequestHeader("tokenCreatedAt", createdAt);
            },
            success: function(e) {
                if (1 == e) {
                   
                    console.log("SUCCESS");
                } else console.log("400!");
            }
        });
}, timeout);

});
}, 47000);

setInterval ( function rfp() {
window.location.reload(true);
}, 150000);



function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}



document.getElementById('nowplaying').innerHTML = "Mobile Substrate Fix Activated Debug!";

setInterval ( function pauser() {
jwplayer().stop();
jwplayer().pause();
}, 5500);