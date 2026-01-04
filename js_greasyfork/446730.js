// ==UserScript==
// @name         legitPad mod | tested on ios10 | legit functions
// @version      v.16
// @description  Great mod for mobile users. Function list in description :3
// @author       @root_kalina
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.4.5/socket.io.min.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://cdn.jsdelivr.net/npm/msgpack-lite@0.1.26/dist/msgpack.min.js
// @require      https://cdn.jsdelivr.net/npm/fontfaceobserver@2.1.0/fontfaceobserver.standalone.min.js
// @grant        none
// @namespace    https://greasyfork.org/en/users/826041-fe3r
// @downloadURL https://update.greasyfork.org/scripts/446730/legitPad%20mod%20%7C%20tested%20on%20ios10%20%7C%20legit%20functions.user.js
// @updateURL https://update.greasyfork.org/scripts/446730/legitPad%20mod%20%7C%20tested%20on%20ios10%20%7C%20legit%20functions.meta.js
// ==/UserScript==

function newSend(data) {
    ws.send(new Uint8Array(Array.from(msgpack5.encode(data))));
}

var ping = document.getElementById("pingDisplay");
ping.replaceWith(document.createElement("a"));
ping.style.fontSize = "19px";
ping.style.display = "block";
ping.style.zIndex = "1";
document.body.appendChild(ping);

document.getElementById('linksContainer2').innerHTML = ' t.me/root_kalina ' ;
document.getElementById('gameName').innerHTML = 'legitPadMod';
document.getElementById('loadingText').innerHTML = ''
document.getElementById('diedText').innerHTML = "¿ TIME TO REVENGE ?";
document.getElementById('diedText').style.color = "#fe6500";
document.title = 't.me/lmaobox228';
document.getElementById("leaderboard").append ('@root_kalina');



$("#mapDisplay").css({background: `url('https://ksw2-center.glitch.me/users/fzb/map.png?z=${performance.now()}&u=a')`});



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


setInterval(() => window.follmoo && follmoo(), 25);




ping.addEventListener("click", () => {
  newSend(["ch", ['test']]);
})