// ==UserScript==
// @name AutoAttack
// @description Attack if the % is more than x
// @namespace   HPrivakosScripts
// @version 1
// @grant none
// @include https://www.coinbrawl.com/*
// @downloadURL https://update.greasyfork.org/scripts/17871/AutoAttack.user.js
// @updateURL https://update.greasyfork.org/scripts/17871/AutoAttack.meta.js
// ==/UserScript==

setTimeout(check, 500);
function check(){
  var percentage = 50;
  var fighttable = document.getElementsByClassName("table table-bordered fight-table")[0].childNodes[1];
  if(fighttable.childNodes[0] != undefined && fighttable.childNodes[1] != undefined && fighttable.childNodes[2] != undefined && fighttable.childNodes[3] != undefined && fighttable.childNodes[4] != undefined){
    var LaNode0 = fighttable.childNodes[0].childNodes[2].textContent.replace("%", "") * 1;
    var LaNode1 = fighttable.childNodes[1].childNodes[2].textContent.replace("%", "") * 1;
    var LaNode2 = fighttable.childNodes[2].childNodes[2].textContent.replace("%", "") * 1;
    var LaNode3 = fighttable.childNodes[3].childNodes[2].textContent.replace("%", "") * 1;
    var LaNode4 = fighttable.childNodes[4].childNodes[2].textContent.replace("%", "") * 1;
    if(LaNode0 > percentage){console.log("0"); fighttable.childNodes[0].childNodes[4].childNodes[0].click(); setTimeout(reload, 2000); return true;}
    if(LaNode1 > percentage){console.log("1"); fighttable.childNodes[1].childNodes[4].childNodes[0].click(); setTimeout(reload, 2000); return true;}
    if(LaNode2 > percentage){console.log("2"); fighttable.childNodes[2].childNodes[4].childNodes[0].click(); setTimeout(reload, 2000); return true;}
    if(LaNode3 > percentage){console.log("3"); fighttable.childNodes[3].childNodes[4].childNodes[0].click(); setTimeout(reload, 2000); return true;}
    if(LaNode4 > percentage){console.log("4"); fighttable.childNodes[4].childNodes[4].childNodes[0].click(); setTimeout(reload, 2000); return true;}
    else{reload(); console.log("No =(");}
  }
  else{reload(); console.log("No =(");}
}

function reload(){
	location.reload();
}