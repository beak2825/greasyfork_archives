// ==UserScript==
// @name         Project Quasar
// @namespace    none
// @version      0.1
// @description  The leading hack for MooMoo.IO!
// @author       Sky X2
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @match        *://mm_beta.moomoo.io/*
// @grant        none
// @license      N/A
// @downloadURL https://update.greasyfork.org/scripts/455224/Project%20Quasar.user.js
// @updateURL https://update.greasyfork.org/scripts/455224/Project%20Quasar.meta.js
// ==/UserScript==   
setInterval(() => window.follmoo && follmoo(), 10);
window.location.native_resolution = true;
var autoreloadloop;
var autoreloadenough = 0;
 
autoreloadloop = setInterval(function () {
    if (autoreloadenough < 200) {
        if (document.getElementById("loadingText").innerHTML == `disconnected<a href="javascript:window.location.href=window.location.href" class="ytLink">reload</a>`) {
            document.title = "Disconnected? Reloading….";
            clearInterval(autoreloadloop);
            setTimeout(function () {document.title = "Moo Moo";}, 1000)
            location.reload();
        }
        autoreloadenough++;
    }
    else if (autoreloadenough >= 300) {
        clearInterval(autoreloadloop);
        document.title = "MOOMOO.IO";
        setTimeout(function () {document.title = "Moo Moo";}, 1000)
    }
}, 50);
 
document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = ' Project Quasar ' ;
document.getElementById('gameName').innerHTML = ' Project Quasar ';
document.getElementById('loadingText').innerHTML = ' Your game is loading... ';
document.getElementById('diedText').innerHTML = "You lost.";
document.getElementById('diedText').style.color = "#aee4ec";
document.title = ' Project Quasar ';
document.getElementById("leaderboard").append ('Project Quasar');
$("#mapDisplay").css({background: `url('https://ksw2-center.glitch.me/users/fzb/map.png?z=${performance.now()}&u=a')`});
document.getElementById("storeHolder").style = "height: 310px; width: 400px;";
document.getElementById("promoImgHolder").remove();
document.querySelector("#pre-content-container").remove(); //ANTI AD
$('#itemInfoHolder').css({'top':'72px',
                          'left':'15px'
                         });
$("#youtuberOf").remove();
$("#adCard").remove();
$("#mobileInstructions").remove();
$("#downloadButtonContainer").remove();
$("#mobileDownloadButtonContainer").remove();
$(".downloadBadge").remove();