// ==UserScript==
// @name         Instagram follow
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371123/Instagram%20follow.user.js
// @updateURL https://update.greasyfork.org/scripts/371123/Instagram%20follow.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
    'use strict';
    var c = document.getElementsByClassName('Kj7h1');
    var g = document.createElement('input');
    g.setAttribute('type','file');
    g.setAttribute('id','file-input');
    c[0].appendChild(g);
    var wdiv = document.createElement('div');
    var w = document.createElement('input');
    wdiv.appendChild(w);
    wdiv.appendChild(document.createTextNode("Wait Time in Milliseconds"));
    w.setAttribute('type','number');
    w.setAttribute('id','wait');
    c[0].appendChild(wdiv);
    var b = document.createElement('button');
    b.setAttribute('id','start');
    b.appendChild(document.createTextNode('start'));
    c[0].appendChild(b);
    var wait = 90000;
    var txt = "";

    document.getElementById('file-input').addEventListener('change', readSingleFile, false);
    document.getElementById('wait').addEventListener('change', changewait, false);
    document.getElementById('start').addEventListener("click", Follow, false);

    function Follow(){
        document.getElementsByClassName('zV_Nj')[0].click();
        var arr = txt.split(" ");
        var Liste = document.getElementsByClassName("NroHT");
        var i0 = 0;
        var timeOut = 1000;
        window.setInterval(function () {
            if (i0 >= Liste.length){
                console.log("jetzt ists zuende");
                return;
            }

            if (!Liste[i0].getElementsByClassName("L3NKy")[0].classList.contains("_8A5w5")&&
				!arr.includes(Liste[i0].getElementsByClassName("zsYNt")[0].getAttribute('title'))) {
        //Liste[i0].getElementsByClassName("L3NKy")[0].click();
                console.log('follow');
            }else{
                console.log('old follow');
                i0++;
                return;
            }
            i0++;
        }, wait);}

        function changewait(e) {
            console.log(e.target.value);
            wait = e.target.value;
        }

    function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    console.log(contents);
    txt = contents;
  };
  reader.readAsText(file);
}

function displayContents(contents) {
  var element = document.getElementById('file-content');
  element.textContent = contents;
}
},1000)})();