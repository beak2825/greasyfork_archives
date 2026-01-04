// ==UserScript==
// @name     Seterra map hack - polish
// @description     Jest to kod który rozwiązuje sam większość quizów na https://www.geoguessr.com/seterra/pl. UWAGA!! Kod działa tylko w polskiej wersji językowej. Kliknij _/- potem +/=
// @author   Ugefen
// @version  1.2
// @grant    none
// @match    https://www.geoguessr.com/seterra/pl/vgp/*
// @match    https://www.geoguessr.com/pl/vgp/*
// @match    https://www.geoguessr.com/seterra/vgp/*
// @license  MIT
// @namespace https://greasyfork.org/users/1078504
// @downloadURL https://update.greasyfork.org/scripts/466253/Seterra%20map%20hack%20-%20polish.user.js
// @updateURL https://update.greasyfork.org/scripts/466253/Seterra%20map%20hack%20-%20polish.meta.js
// ==/UserScript==


let now = 0;
let el1;
let max;
let speed;
function loopAnswering(){
	if(now<max){
el1 = document.querySelector('[data-qText="'+document.getElementById('currQuestion').innerHTML.slice(11,document.getElementById('currQuestion').innerHTML.length)+'"]  ');
unsafeWindow.checkQuestion(el1, true);
now++;
	setTimeout(loopAnswering,speed);
}
}
document.addEventListener("keydown",checkKeyCheat,false);
function checkKeyCheat(e){
if(e.keyCode==61){
   loopAnswering();
}
if(e.keyCode==173){
	max= prompt("Ilość elementów (Napisane jest w nawiasie obok wszystkich krajów po wejściu do quizu z mapy)");
speed= prompt("Prędkość (Im mniejsza tym szybciej rozwiązuje, standardowo 500)");
}

} 

