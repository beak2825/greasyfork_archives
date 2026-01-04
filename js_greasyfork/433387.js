// ==UserScript==
// @name         BRI_Auto_AUX
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automate your aux with the given Options.
// @author       bprasada
// @match        https://nautilus-na.amazon-corp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433387/BRI_Auto_AUX.user.js
// @updateURL https://update.greasyfork.org/scripts/433387/BRI_Auto_AUX.meta.js
// ==/UserScript==
window.onload = function(){
    let PreText = document.getElementById("navbar");
    let p = PreText;
    console.log(p);
    let btn = document.createElement("button")
    btn.innerHTML = "Break-Avail"
    p.insertAdjacentElement("beforeend", btn);
    btn.onclick = function(){
        let a = document.getElementsByClassName('Text')[1]
        a.id = "break.button"
        let b = document.getElementsByClassName('Text')[0]
        b.id = "available.button"
        document.getElementById('break.button').click();
        function delayedFunction() {
            document.getElementById('available.button').click();
        }
        let timer = setTimeout(delayedFunction, 1800000);
    }
    let btn1 = document.createElement("button")
    btn1.innerHTML = "Lunch-Avail"
    p.insertAdjacentElement("beforeend", btn1);
    btn1.onclick = function(){
        let c = document.getElementsByClassName('Text')[3]
        c.id = "Lunch.button"
        let d = document.getElementsByClassName('Text')[0]
        d.id = "Available.button"
        document.getElementById('Lunch.button').click();
        function delayedFunction() {
            document.getElementById('Available.button').click();
        }
        let timer = setTimeout(delayedFunction, 1800000);
    }
    let btn2 = document.createElement("button")
    btn2.innerHTML = "Break-Lunch-Avail"
    p.insertAdjacentElement("beforeend", btn2);
    btn2.onclick = function(){
        let e = document.getElementsByClassName('Text')[1]
        e.id = "Break.button"
        let f = document.getElementsByClassName('Text')[3]
        f.id = "Lunch.button"
        let g = document.getElementsByClassName('Text')[0]
        g.id = "Avail.button"
        document.getElementById('Break.button').click();
        function delayedFunction() {
            document.getElementById('Lunch.button').click();
        }
        let timer = setTimeout(delayedFunction, 1800000);
        function delayedFunction2() {
            document.getElementById('Avail.button').click();
        }
        let timer2 = setTimeout(delayedFunction2, 3600000);
    }
};
