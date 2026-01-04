// ==UserScript==
// @connect      https://thenextlist.net/includes/API_TheNextTracker.php
// @connect *
// @name         The Next Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Track Tammy to hosp 24/7
// @author       Vaaaz [2077492]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422052/The%20Next%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/422052/The%20Next%20Tracker.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // When document fully loaded
    $(window).load(function(e) {
      var x;
      function setCookie(cname, cvalue, exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          var expires = "expires="+d.toUTCString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        function checkCookie() {
            var user = getCookie("apiKeyTheNextTracker");
            if (user != "") {
                console.log("TNT - API OK");
            } else {
                user = prompt("Please enter your API:", "");
                GM.xmlHttpRequest({
                  method: "POST",
                  url: "https://thenextlist.net/includes/checkValidApi.php",
                  data: "testingAPI=" + user,
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  onload: function(response) {
                    if (response.responseText == "No") {
                      setCookie("apiKeyTheNextTracker", user, 365);
                    } else {
                      alert("Please enter valid API.");
                    }
                  }
               });
            }
        }

        function hospTimer(timestamp) {
          var countDownDate = new Date(timestamp * 1000);
          // Update the count down every 1 second
          x = setInterval(function() {
            if (status == "Okay") {
              clearInterval(x);
              trackerElementP.innerHTML = "Okay";
              trackerElementP.style.color = "green";
              trackerElementP.style.fontWeight = "bold";
            }

            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the result
            if (hours > 0) {
              trackerElementP.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
            } else if (minutes > 0) {
              trackerElementP.innerHTML = minutes + "m " + seconds + "s ";
            } else {
              trackerElementP.innerHTML = seconds + "s ";
            }


            // If the count down is finished, write some text
            if (distance < 0) {
              // Tracker CSS
              clearInterval(x);
              trackerElementP.innerHTML = "Okay";
              trackerElementP.style.color = "green";
              trackerElementP.style.fontWeight = "bold";
            }
          }, 1000);
        }

        function checkStatus(status) {
          if (status == "Online") {
            document.getElementById("trackerStatusImgID").src ="https://thenextlist.net/images/TNL_Online.png";
          } else if (status == "Idle") {
            document.getElementById("trackerStatusImgID").src ="https://thenextlist.net/images/TNL_Idle.png";
          } else {
            document.getElementById("trackerStatusImgID").src ="https://thenextlist.net/images/TNL_Offline.png";
          }
        }

      checkCookie();

      var apiKey = getCookie("apiKeyTheNextTracker");
      var url = 'https://api.torn.com/user/2074765?selections=&key=' + apiKey;
      var timerResponse;
      var statusResponse;

      // Create DIV tracker element
      var trackerElementDIV = document.createElement('div');
      trackerElementDIV.id = 'IDtrackerElementDIV';
      trackerElementDIV.className = 'classTrackerElement';
      document.getElementsByClassName('content___2-KPP')[0].appendChild(trackerElementDIV);

      // Create P2 element
      var trackerElementP2 = document.createElement('p');
      trackerElementP2.id = 'IDtrackerElementP2';
      document.getElementsByClassName('classTrackerElement')[0].appendChild(trackerElementP2);
      trackerElementP2.innerHTML = '<img id="trackerStatusImgID" style="margin-right: 5px; width:10px; height: 10px;" src="https://thenextlist.net/images/TNL_Offline.png"> <a href="https://www.torn.com/profiles.php?XID=2074765" target="_blank">Tammy : </a>';

      // Create P element
      var trackerElementP = document.createElement('p');
      trackerElementP.id = 'IDtrackerElementP';
      document.getElementsByClassName('classTrackerElement')[0].appendChild(trackerElementP);
      trackerElementP.innerHTML = "Checking...";

      GM_addStyle(" #IDtrackerElementP { display: inline;}");
      GM_addStyle(" #IDtrackerElementP2 { display: inline; font-weight: bold;}");
      GM_addStyle(" #IDtrackerElementP2 a { text-decoration: none; color: black;}");

      GM.xmlHttpRequest({
        method: "POST",
        url: "https://thenextlist.net/includes/API_TheNextTracker.php",
        data: "apiKey=" + apiKey,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
          if (response.responseText.startsWith("Okay")) {
            trackerElementP.innerHTML = "Okay";
            trackerElementP.style.color = "green";
            trackerElementP.style.fontWeight = "bold";
            statusResponse = response.responseText.slice((response.responseText.indexOf('Online=')+7),response.responseText.length);
            clearInterval(x);
            checkStatus(statusResponse);
          } else {
            trackerElementP.style.color = "red";
            trackerElementP.style.fontWeight = "unset";
            timerResponse = response.responseText.slice((response.responseText.indexOf('Time=')+5), response.responseText.indexOf('.Online'));
            statusResponse = response.responseText.slice((response.responseText.indexOf('Online=')+7),response.responseText.length);
            hospTimer(timerResponse);
            checkStatus(statusResponse);
          }
        }
     });
       var getHerTimmer = setInterval(function() {
         console.log("TNT - Checking Tammy...");
         GM.xmlHttpRequest({
           method: "POST",
           url: "https://thenextlist.net/includes/API_TheNextTracker.php",
           data: "apiKey=" + apiKey,
           headers: {
             "Content-Type": "application/x-www-form-urlencoded"
           },
           onload: function(response) {
             if (response.responseText.startsWith("Okay")) {
               trackerElementP.innerHTML = "Okay";
               trackerElementP.style.color = "green";
               trackerElementP.style.fontWeight = "bold";
               statusResponse = response.responseText.slice((response.responseText.indexOf('Online=')+7),response.responseText.length);
               clearInterval(x);
               checkStatus(statusResponse);
             } else {
               trackerElementP.style.color = "red";
               trackerElementP.style.fontWeight = "unset";
               timerResponse = response.responseText.slice((response.responseText.indexOf('Time=')+5), response.responseText.indexOf('.Online'));
               statusResponse = response.responseText.slice((response.responseText.indexOf('Online=')+7),response.responseText.length);
               hospTimer(timerResponse);
               checkStatus(statusResponse);
             }
           }
        });
       }, 15000);
   });
})();
