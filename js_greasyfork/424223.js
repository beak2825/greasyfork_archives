// ==UserScript==
// @name        Buttons UI
// @namespace   Violentmonkey Scripts
// @match       https://itsm.services.sap/*
// @match       https://sap.service-now.com/*
// @match       https://test.itsm.services.sap/*
// @grant       none
// @version     1.0.4
// @author      I843865 & I531018
// @description 1/20/2021, 4:04:08 PM
// @run-at      document-start      
// @downloadURL https://update.greasyfork.org/scripts/424223/Buttons%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/424223/Buttons%20UI.meta.js
// ==/UserScript==
   
   
   
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
   
function pollDOM() {
  
  
  var list2 = null;
  //console.log(document.getElementsByClassName('list2_body'));

  if(document.getElementById("gsft_main") == null){
    
    list2 = document.getElementsByClassName('list2_body');
  }else{
    list2 = document.getElementById("gsft_main").contentWindow.document.getElementsByClassName('list2_body');
  }

  var arr = Array.from(list2); // Array of reports
  //console.log(list2);

  if (arr.length != 0) {

    for(var n = 0; n < arr.length; ++n){ // Loops through every report of dashboard
      var lista = Array.from(arr[n].childNodes);
      // console.log(lista);


      for (var i = 0; i < lista.length; ++i) { // Loop through every report item 

        var btn = document.createElement("BUTTON");   // Create a <button> element
        btn.innerHTML = "AW";
        btn.classList.add('AW');
        btn.id = 'btn' + i;



        var son = lista[i];
        if(son.getElementsByClassName('list_decoration_cell').length <= 0 ) // Check to prevent crashes
          break;
        //console.log("son - na parte do link");
        //console.log(son.getElementsByClassName('linked formlink'));

        // var arr2 = son.getElementsByClassName('linked formlink');
        var arr2 = son.getElementsByClassName('list_decoration_cell').item(1).childNodes[0]; // New element filter
        if (arr2 != undefined) { // Is not an array anymore
          var wil;

          wil = arr2.href;
          //console.log(wil);

          var sid = wil.substr(60, 32);

          //var url = wil.href.toString();
          //console.log(url);
          //var sid = url.substr(62,32);

          btn.onclick = function () {
            
            var number = this.id;
            var interation = number.substr(3, number.length - 3);

            var now = lista[interation];
            var end = now.getElementsByClassName('list_decoration_cell'); // Adapting to the previous select
            if(end.length > 0 ){ // Check to prevent crashes
              //console.log(now);
              //console.log("sysid");
              var href = end.item(1).childNodes[0].href; // Adapting to the new element structure

              var number2 = href.lastIndexOf("sys_id=") + 7;

              var sid = href.substr(number2, 32);
              if (href.search('sn_customerservice_case.do') == -1) {
                  var xhttp = new XMLHttpRequest();
                  xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                      var text = this.responseText;
                      var number = text.lastIndexOf("NOW.sysId")  + 13; 
                      //console.log(number);
                      //console.log(text.substr(number,32));
                      window.open('https://itsm.services.sap/now/workspace/agent/record/sn_customerservice_case/' + text.substr(number,32));

                    }
                  };

                  xhttp.open("GET", end[0].href, true);
                  xhttp.send();
                } 
                else {
                  window.open('https://itsm.services.sap/now/workspace/agent/record/sn_customerservice_case/' + sid);
                }
            }
          };

          //btn.onclick = 'window.open(\'https://itsm.services.sap/now/workspace/agent/record/sn_customerservice_case/' + sid;


          //console.log(son.childNodes[2].class);
          if (son.childNodes[1].lastChild.innerHTML != 'AW') {
            son.childNodes[1].appendChild(btn);
          }
          //console.log(son.childNodes[2].lastChild.innerHTML);
        }
      }
  
    }
    


  } else {
    setTimeout(pollDOM, 300);
    //console.log("not now1"); // try again in 300 milliseconds
  }
}


var url_antiga = null;

function checkURL() {

  pollDOM();
  setTimeout(checkURL, 300);

}

checkURL();
  
/******/ })()

 
 