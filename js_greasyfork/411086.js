// ==UserScript==
// @name  Diep.io Home Console Commands list
// @description press that button on top left. r to hide
// @version  1.3
// @include  http://diep.io/*
// @connect  diep.io
// @author xeron
// @namespace    *://diep.io/
// @match        *://diep.io/
//@require       https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/411086/Diepio%20Home%20Console%20Commands%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/411086/Diepio%20Home%20Console%20Commands%20list.meta.js
// ==/UserScript==
  var mbtn = document.createElement("button");
  document.body.appendChild(mbtn);
  mbtn.innerHTML = "<b>Click to show,<br> r to hide</b>";
   mbtn.style.backgroundColor = "red";
   mbtn.style.position = "absolute";
   mbtn.style.height = "36px";

  var btn1 = document.createElement("button");
  document.body.appendChild(btn1);
  btn1.innerHTML = "Net prediction movements";
  btn1.style.backgroundColor = "yellow";
  btn1.style.position = "absolute";
  btn1.style.top = "55px";
  btn1.style.left = "0px";
  btn1.style.height = "36px";
  btn1.style.width = "105px";

var btn2 = document.createElement("button");
  document.body.appendChild(btn2);
  btn2.innerHTML = "render ui";
  btn2.style.backgroundColor = "powderblue";
  btn2.style.position = "absolute";
  btn2.style.top = "88px";
  btn2.style.left = "0px";
  btn2.style.height = "36px";
  btn2.style.width = "105px";

var btn3 = document.createElement("button");
  document.body.appendChild(btn3);
  btn3.innerHTML = "render upgrades table";
  btn3.style.backgroundColor = "lightgreen";
  btn3.style.position = "absolute";
  btn3.style.top = "122px";
  btn3.style.left = "0px";
  btn3.style.height = "36px";
  btn3.style.width = "105px";

var btn4 = document.createElement("button");
  document.body.appendChild(btn4);
  btn4.innerHTML = "render stats table";
  btn4.style.backgroundColor = "aquamarine";
  btn4.style.position = "absolute";
  btn4.style.top = "156px";
  btn4.style.left = "0px";
  btn4.style.height = "36px";
  btn4.style.width = "105px";

$(btn4).hide();
   $(btn3).hide();
   $(btn2).hide();
  $(btn1).hide();
mbtn.onclick = function() {
    $(btn1).toggle();
    $(btn2).toggle();
    $(btn3).toggle();
    $(btn4).toggle();
  }

  var predict = false;
  btn1.onclick = function() {
    input.set_convar("net_predict_movement", predict);
     if(predict) {
         predict = false
     } else {
         predict = true;
     }
  }
  var ui = false;
  var upgrade = false;
  var stat = false;
  btn2.onclick = function() {
    input.set_convar("ren_ui", ui);
    if(ui == false) {
       ui = true;
       } else {
       ui = false
       }
  }
  btn3.onclick = function() {
    input.set_convar("ren_upgrades", upgrade);
    if(upgrade == false) {
       upgrade = true;
       } else {
       upgrade = false
       }
  }
    btn4.onclick = function() {
    input.set_convar("ren_stats", stat);
    if(stat == false) {
       stat = true;
       } else {
       stat = false
       }
  }
  window.addEventListener("keyup", function(e){
    if (e.key == "r") {
    $(mbtn).toggle();
    $(btn1).hide();
    $(btn2).hide();
    $(btn3).hide();
    $(btn4).hide();
    }
  });