// ==UserScript==
// @name          ArtemisQuickSelectorForSb
// @namespace    http://XX.net/
// @version      0.1
// @description  quick select artemis db
// @author       You
// @match        http://dba-sb-prod.coreop.net/Developer/Query

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393586/ArtemisQuickSelectorForSb.user.js
// @updateURL https://update.greasyfork.org/scripts/393586/ArtemisQuickSelectorForSb.meta.js
// ==/UserScript==

  (function() {
    'use strict';

       function changeDB ( dbName) {
var myselect=document.getElementById("Database")
myselect.options[0]=new Option(dbName,dbName)
myselect.options[0].selected = true;
            $('#Database').trigger('change');
}

        var gma = '<span class="GMa btn btn-primary" >PlutoGM-a13</span> <span class="GMb btn btn-primary" >PlutoGM-b13</span>  <span class="sboa btn btn-primary" >sbo2019-a13</span> <span class="sbob btn btn-primary" >sbo2019-b13</span> <span class="gb btn btn-primary" >GamesBetDB b10</span>';
var new_elem = document.createElement('div');
new_elem.innerHTML = gma;
  document.getElementsByClassName("PageHeader")[0].appendChild(new_elem);

      var GMa = document.querySelector (".GMa");
if (GMa) {
    GMa.addEventListener ("click", function(){
    changeDB('PlutoRepGM (maia-a13)');} , false);
}
       var GMb = document.querySelector (".GMb");
if (GMb) {
    GMb.addEventListener ("click", function(){
    changeDB('PlutoRepGM (maia-b13)');} , false);
}
       var sboa = document.querySelector (".sboa");
if (sboa) {
    sboa.addEventListener ("click", function(){
    changeDB('sbo2019 (maia-a13)');} , false);
}
     var sbob = document.querySelector (".sbob");
if (sbob) {
    sbob.addEventListener ("click", function(){
    changeDB('sbo2019 (maia-b13)');} , false);
}

          var gb = document.querySelector (".gb");
if (gb) {
    gb.addEventListener ("click", function(){
    changeDB('GamesBetDB (maia-b10)');} , false);
}



})();
