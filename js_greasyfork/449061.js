// ==UserScript==
// @name          RGB Health + Anti Ad
// @version       1.0
// @description  Makes team members (and yourself) have color-changing health bars! Client-side only, others cannot see it.
// @author        Lightbulb & Sakupen
// @match        *://*.moomoo.io/*
// @grant        none
// @namespace https://greasyfork.org/users/721571
// @downloadURL https://update.greasyfork.org/scripts/449061/RGB%20Health%20%2B%20Anti%20Ad.user.js
// @updateURL https://update.greasyfork.org/scripts/449061/RGB%20Health%20%2B%20Anti%20Ad.meta.js
// ==/UserScript==

let hue = 0;

let replaceInterval = setInterval(() => {
if (CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
  clearInterval(replaceInterval);
}}, 10);

function changeHue() {
  hue += Math.random() * 3;
}

setInterval(changeHue, 10);

document.getElementById("enterGame").innerHTML = "kill 'em!"
document.getElementById("enterGame").style.backgroundColor = "#000000";
document.getElementById("enterGame").style.color = "#ebebeb";
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = '<a href = "https://t.me/root_kalina">Mod Author</a>' ;
document.getElementById('gameName').innerHTML = 'XD MOD';
document.getElementById('gameName').style.color = "#000000";
document.getElementById('loadingText').innerHTML = ' '
document.getElementById('diedText').innerHTML = "";
document.getElementById('diedText').style.color = "#fe3200";
document.title = 'why bad';
document.getElementById("leaderboard").prepend ('Noob');
$("#ot-sdk-btn-floating").hide();

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