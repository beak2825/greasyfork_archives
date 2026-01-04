// ==UserScript==
// @name        Better 2048
// @namespace   Violentmonkey Scripts
// @match       https://2048verse.com/*
// @match       https://2048masters.com/*
// @grant       none
// @version     1.4
// @author      -
// @description 7/5/2022, 6:23:30 PM
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/518874/Better%202048.user.js
// @updateURL https://update.greasyfork.org/scripts/518874/Better%202048.meta.js
// ==/UserScript==


    GM_registerMenuCommand("Set 2048 League lowest score", function() {
        var lowScore = prompt("Set 2048 League lowest score");
        if (lowScore == '') {
          var lowScore = 'yourmother'
        }
        if (lowScore *  0 != 0) {
          var lowScore = 'yourmother'
        }
        localStorage.setItem("lowestScore", lowScore);
        location.reload();
    });





    window.addEventListener('load', function () {

      var url = window.location.hostname;

      if (url == '2048verse.com') {


        function main() {
          setTimeout(function(){
          if (document.getElementsByClassName('tile-4').length < 2 && (document.getElementById('timer').innerText == '0.000')) {
            if (true) {
              localStorage.confRestart = "0";
               document.getElementsByClassName('restart-button')[0].click();
            }
            main();
          } else {
            wait()
          }
          },0)
        }

        function wait() {
          setTimeout(function(){
          if (!(document.getElementById('timer').innerText == '0.000')) {
            wait();
          } else {
            main();
          }
          },10)
        }

          function main2() {
          setTimeout(function(){
          if (localStorage.getItem("lowestScore") == 'yourmother') {

          } else if (localStorage.getItem("lowestScore")){
            if (document.getElementById('scoreNum') && (parseInt(document.getElementById('scoreNum').innerText) > localStorage.getItem("lowestScore"))) {
            if (getCookie('togFour') == '1') {
              localStorage.confRestart = "0";
              document.getElementsByClassName('restart-button')[0].click();
            }
            }
          } else {
            if (document.getElementById('scoreNum') && (parseInt(document.getElementById('scoreNum').innerText) > 8)) {
            if (true) {
              localStorage.confRestart = "0";
              document.getElementsByClassName('restart-button')[0].click();
            }
          }
          }

          main2();
          },10)
        }

        function wait2() {
          setTimeout(function(){
          if (!(document.getElementById('timer').innerText == '0.000')) {
            wait2();
          } else {
            main2();
          }
          },10)
        }



        wait();
        wait2();

        waitScreen();

        function waitScreen() {
          setTimeout(function(){
          if (Array.from(document.querySelectorAll('#modal span')).length != 7) {
              waitScreen();
            } else {
              loadSwitch();
          }
          },10)
        }

        function loadSwitch() {
          if (true) {
            Array.from(document.querySelectorAll('#modal span'))[5].insertAdjacentHTML('afterend', '<span style="position:relative;left:350px;bottom:370px"><h3><strong>Lowest Score</strong></h3><label class="switch"><input type="checkbox" id="togFou" onchange="if (document.getElementById(`togFou`).checked){document.cookie=`togFour=1;expires=Wed, 18 Dec 2026 12:00:00 GMT`} else {document.cookie=`togFour=0;expires=Wed, 18 Dec 2026 12:00:00 GMT`}" checked=""><span class="slider"></span></label></span>');
          } else {
            Array.from(document.querySelectorAll('#modal span'))[5].insertAdjacentHTML('afterend', '<span style="position:relative;left:350px;bottom:370px"><h3><strong>Lowest Score</strong></h3><label class="switch"><input type="checkbox" id="togFou" onchange="if (document.getElementById(`togFou`).checked){document.cookie=`togFour=1;expires=Wed, 18 Dec 2026 12:00:00 GMT`} else {document.cookie=`togFour=0;expires=Wed, 18 Dec 2026 12:00:00 GMT`}" unchecked=""><span class="slider"></span></label></span>');
          }

          waitScreen();
        }



        function getCookie(name) {
return true;
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop().split(';').shift();
        }

      }

      if (url == '2048masters.com') {

        var resBut = document.getElementById('restart-button')
        if (resBut) {
          resBut.onclick = function() {location.reload()}
        }

        document.addEventListener("keypress", function(event) {
          if (event.key == 'r') {
            document.getElementById('restart-button').click();
          }
        });

        function loop2() {
          setTimeout(function() {
          if (document.getElementsByClassName('keep-playing-button').length > 0) {
            document.getElementsByClassName('keep-playing-button')[0].click();
          }
          loop2();
        },10)
        }

        loop2();


      }
    })

