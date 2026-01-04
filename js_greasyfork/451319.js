// ==UserScript==
// @name         Auto Clicke
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Auto Clicker for Browsers!!
// @author       084m4_Pri5m
// @match        *://*/*
// @grant        none
// @icon         none
// @license                  MIT
// @downloadURL https://update.greasyfork.org/scripts/451319/Auto%20Clicke.user.js
// @updateURL https://update.greasyfork.org/scripts/451319/Auto%20Clicke.meta.js
// ==/UserScript==

var ttnode;
var ans,ans2,num,num1,num2 = "";
var numsel = 1;
var operator = "";

document.addEventListener('keyup',function(evt){
    if(evt.keyCode==89||evt.keyCode==81||evt.keyCode==87||evt.keyCode==73||evt.keyCode==85){ start(1)
    }});

document.addEventListener('keyup',function(evt){
    if(evt.keyCode==69){ start(prompt("Repeat"));
    }});

function click(x, y){
    let ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });

    let el = document.elementFromPoint(x, y);
    el.dispatchEvent(ev);
}

function start(repeat) {
    for (let i = 0; i < repeat; i++) {
    ans = num = num1 = num2 = ans2 = "";
    operator = "";
    numsel = 1;
    ttnode = document.querySelectorAll(".notranslate")[10].textContent;
    ttnode = ttnode.split(" ").join("")
    for (let i = 0; i < ttnode.length; i++) {
        if ((!isNaN(ttnode[i]))&&numsel==1) {
            num1 += ttnode[i]
        } else if (ttnode[i]=="×"|"÷") {
            operator = ttnode[i]
            numsel = 2
        } else if ((ttnode[i])==0|1|2|3|4|5|6|7|8|9&&numsel==2) {
             num2 += ttnode[i]
        } else {operator = ttnode[i]
                numsel = 2 }
    }
        if (operator=="×") {
            ans = num1 * num2
        } else {
            ans = num1 / num2
        }
    ans = ans.toString();
    for (let i = 0; i < ans.length; i++) {
        if ((ans[i])==1) {
            click(220,420) }
        else if ((ans[i])==2) {
            click(420,420) }
        else if ((ans[i])==3) {
            click(620,420) }
        else if ((ans[i])==4) {
            click(220,360) }
        else if ((ans[i])==5) {
            click(420,360) }
        else if ((ans[i])==6) {
            click(620,360) }
        else if ((ans[i])==7) {
            click(220,300) }
        else if ((ans[i])==8) {
            click(420,300) }
        else if ((ans[i])==9) {
            click(620,300) }
        else if ((ans[i])==0) {
            click(420,470) }
} click(620,470) } }

var abcde = ""
var abcd = 0
document.addEventListener('keydown',function(evt){
    if (abcd==1) {
    abcde=abcde+evt.key
    abcde=abcde.split("Shift").join("")
    abcde=abcde.split("Space").join("")
    abcde=abcde.split("CapsLock").join("")
    abcde=abcde.split("Tab").join("")
    abcde=abcde.split("Control").join("")
    abcde=abcde.split("Alt").join("")
    abcde=abcde.split("ArrowLeft").join("")
    abcde=abcde.split("ArrowUp").join("")
    abcde=abcde.split("ArrowDown").join("")
    abcde=abcde.split("ArrowRight").join("")
    document.querySelector("title").innerHTML=abcde
    }
    if (evt.key=="End") {
        abcd=1
    }
});
