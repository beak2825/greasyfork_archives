// ==UserScript==
// @name         Open In Calc (MyMathLab / Pearson)
// @namespace    https://www.mattrangel.net
// @version      0.1
// @description  Converts the accessibility text of equation to plain text then opens it in WolfRamAlpha
// @author       Matt
// @match        https://xlitemprod.pearsoncmg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pearson.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455002/Open%20In%20Calc%20%28MyMathLab%20%20Pearson%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455002/Open%20In%20Calc%20%28MyMathLab%20%20Pearson%29.meta.js
// ==/UserScript==
const rlist = [["Upper", ""],["equals","="],["left parenthesis ","("],["plus","+"],["StartFraction","("],["Over",")/("],["EndFraction",")"],[" right parenthesis",")"],[" Superscript ","^"],[" squared","^2"],["minus","-"],[" cubed","^3"],["negative ","-"],["times","*"],["less than or ","<"],["less than","<"],["greater than or ",">"],["greater than",">"],[" Subscript ","_"],["Baseline",""],["StartRoot","sqrt("],["EndRoot",")"]];
var txt = "";
function doc_keyUp(e) {
    //Tilde - Opens text in WolfRamAlpha
    if (e.key == "`") {
        txt = document.getElementsByClassName("eqAccessibleLabel")[0].innerText;
        for (let i = 0; i < rlist.length; i++) {
            txt = txt.replaceAll(rlist[i][0],rlist[i][1]);
        }
        var wra_link = ("https://www.wolframalpha.com/input?i=" + encodeURIComponent(txt));
        window.open(wra_link, "_blank");
    }
    //F2 - Copies text to clipboard for troubleshooting
    else if (e.key =="F2") {
        var lst = document.getElementsByClassName("eqAccessibleLabel");
        txt = "";
        for (let i = 0; i < lst.length; i++) {
            txt += (lst[i].innerText + " ");
        }
        for (let i = 0; i < rlist.length; i++) {
            txt = txt.replaceAll(rlist[i][0],rlist[i][1]);
        }
        navigator.clipboard.writeText(txt);
    }
}

document.addEventListener('keyup', doc_keyUp, false);