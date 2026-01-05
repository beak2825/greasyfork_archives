// ==UserScript==
// @name         By MЗƓΛ（ＢＯＴ）™ (2)
// @namespace    мЗgαвoт.gα
// @version      v1.0
// @description  https://www.youtube.com/channel/UC5kxL90Rk97T2jblmjX_4kQ   Beni izle..!
// @author       http://m3gabot.ga/
// @match        http://agar.red/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28960/By%20M%D0%97%C6%93%CE%9B%EF%BC%88%EF%BC%A2%EF%BC%AF%EF%BC%B4%EF%BC%89%E2%84%A2%20%282%29.user.js
// @updateURL https://update.greasyfork.org/scripts/28960/By%20M%D0%97%C6%93%CE%9B%EF%BC%88%EF%BC%A2%EF%BC%AF%EF%BC%B4%EF%BC%89%E2%84%A2%20%282%29.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Dingus = false;
var imlost = 25;
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>E</b> to Tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>Z</b> to Triplesplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>D</b> to Doublesplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_d'> Press <b>R</b> to Popsplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Press and hold <b>W</b> for macro feed</span></span></center>";
load();
function load() {
    if (document.getElementById("overlays").style.display!="none") {
        document.getElementById("settings").style.display = "block";
        if (document.getElementById('showMass').checked) {document.getElementById('showMass').click();}
        document.getElementById('showMass').click();
        if (document.getElementById('darkTheme').checked) {document.getElementById('darkTheme').click();}
        document.getElementById('darkTheme').click();
        // Don't switch the code becauce the script will not work !
    } else {
        setTimeout(load, 100);
    }
}
function keydown(event) {
    if (event.keyCode == 87) { //W
        Feed = true;
        setTimeout(fukherriteindapussie, imlost);
    } // Tricksplit
    if (event.keyCode == 70) { //F
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
        setTimeout(ilikedick, imlost*3);
    } // Triplesplit
    if (event.keyCode == 90) { //Z
        ilikedick();
        setTimeout(ilikedick, imlost);
        setTimeout(ilikedick, imlost*2);
    } // Doublesplit
    if (event.keyCode == 89) { //Y
        ilikedick();
        setTimeout(ilikedick, imlost);
    } // PopSplit
    if (event.keyCode == 71) { //G
        ilikedick();
        setTimeout(ilikedick, imlost*5.23281904315409314341823740702375023598326528936579425692465982465982465982465984265924569237459246592645924659426529465924865823465923865982365982359832);
    }
} // When Player Lets Go Of W, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 87) {
        Feed = false;
    }
    if (event.keyCode == 79) {
        Dingus = false;
    }
}
// Feed Macro With W
function fukherriteindapussie() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(fukherriteindapussie, imlost);
    }
}
function ilikedick() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}