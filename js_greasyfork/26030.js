// ==UserScript==
// @name         Awbarre
// @namespace    http://flowbooks.fr/
// @version      3
// @description  n userscript vraiment leger pour justifier les données des sites d'infos français et d'augmenter un peu la taille de lecture.
// @author       Antoine Tagah
// @include      http://*.awbarre.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26030/Awbarre.user.js
// @updateURL https://update.greasyfork.org/scripts/26030/Awbarre.meta.js
// ==/UserScript==

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

setTimeout(function(){
   window.location.reload(1);
}, getRandomArbitrary(2000, 15000));

var myString = document.body.innerHTML;
var result = myString.indexOf('http://www.awbarre.com/gold/puzzle_clic.php?z=');
if(result > 1){
var end = result + 65;


window.open(myString.substring(result,end),"Puzzle","directories=no,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no,left=100,top=100,width=520,height=420");
}