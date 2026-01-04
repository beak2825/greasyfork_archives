// ==UserScript==
// @connect      https://thenextlist.net/includes/DEVreviveMe.php
// @connect *
// @name         THE DEV REVIVE
// @namespace    http://tampermonkey.net/
// @version      4.5.5
// @description  Ask for a revive
// @author       Vaaaz [2077492]
// @match        https://www.torn.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420093/THE%20DEV%20REVIVE.user.js
// @updateURL https://update.greasyfork.org/scripts/420093/THE%20DEV%20REVIVE.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // When document fully loaded
    $(window).load(function(e) {

    // Get cookie content
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

    // Player Informations
    var vPlayerName = document.getElementById('websocketConnectionData').innerHTML;
    vPlayerName = vPlayerName.slice(vPlayerName.indexOf('"playername":"'), (vPlayerName.length)-1);
    vPlayerName = vPlayerName.slice(vPlayerName.indexOf(':')+2,(vPlayerName.length)-1);

    var vPlayerID = document.getElementById('websocketConnectionData').innerHTML;
    vPlayerID = vPlayerID.slice(vPlayerID.indexOf('"userID":"'),vPlayerID.indexOf('"timestamp"'));
    vPlayerID = vPlayerID.slice(vPlayerID.indexOf(':')+2,(vPlayerID.length)-2);

    // Torn Locations
    var tornLocations = ["Mexico","Cayman Islands","Canada","Hawaii","United Kingdom","Argentina","Switzerland","Japan","China","United Arab Emirated","South Africa"];

    // Check if im in Torn City - CHECK LATER
    if(tornLocations.includes(document.getElementById('tcLogo').title)) {
        // Traveling or not in Torn
        console.log("TNR - Not in Torn.");
    } else {
      console.log("TNR - Creating Revive Button");
      CreateButton();
    }

    function CreateButton() {
        // Create Revive Me button
        var reviveButton = document.createElement('button');
        reviveButton.id = 'DEVReviveButtonID';
        // Append button Mobile or PC
        if (window.matchMedia("(max-width: 640px)").matches) { // MOBILE
          reviveButton.innerHTML = '<img id="testingSomething" style="margin-right: 5px; vertical-align: bottom;"src="http://thenextlist.net/images/TNL.png" width="19" height="19";">';
          document.getElementsByClassName('content-title-links')[0].appendChild(reviveButton);
          // ReviveButton CSS
          GM_addStyle(" #DEVReviveButtonID { color: #7F7F7F; font-family: Arial; font-size: 12px; cursor: pointer; background-color: none; margin: 0; padding: 0; vertical-align: top;}");
          GM_addStyle(" #DEVReviveButtonID { margin-top: -8px; float: right; vertical-align: baseline; padding-left: 4px;}");
        } else { // PC
          reviveButton.innerHTML = '<img style="margin-right: 5px; vertical-align: bottom;"src="http://thenextlist.net/images/reviveIcon.svg" width="14" height="14";">Revive Me<p id="DEVreviveToolTip">Ask for a Revive</p>';
          document.getElementsByClassName('content-title-links')[0].appendChild(reviveButton);
          // ReviveButton CSS
          GM_addStyle(" #DEVReviveButtonID { color: #7F7F7F; font-family: Arial; font-size: 12px; cursor: pointer; background-color: none; margin: 0; padding: 0; vertical-align: top;}");
          GM_addStyle(" #DEVReviveButtonID { margin-top: 5px; float: right; vertical-align: top; margin-right: 10px;}");
        }

        // Tooltip CSS
        GM_addStyle(" #DEVreviveToolTip { visibility: hidden; position: absolute; z-index: 1; bottom: 150%; left: 50%; margin-left: -60px; margin-bottom: 2px;}");
        GM_addStyle(" #DEVreviveToolTip { background: rgb(242, 242, 242); color: #333; padding: 8px; border-radius: 3px; opacity: 1; width: 110px;}");
        GM_addStyle(" #DEVreviveToolTip { box-shadow: rgba(0, 0, 0, 0.3) 0px 0px 8px; font-size: 12px; opacity: 1;}");
        // Tooltip arrow
        GM_addStyle(' #DEVreviveToolTip::after { position: absolute; content: ""; z-index: 60; left: 50%; margin-left: -10px; }');
        GM_addStyle(' #DEVreviveToolTip::after { border-left: 8px solid transparent; border-right: 8px solid transparent; bottom: -10px; border-top: 10px solid rgb(242, 242, 242); }');
        // ReviveButton CSS:hover
        GM_addStyle(" #DEVReviveButtonID:hover #DEVreviveToolTip { visibility: visible;}");
        GM_addStyle(" #DEVReviveButtonID:hover { color: black;}");

      // Button function
      document.getElementById("DEVReviveButtonID").addEventListener("click", function(){
        // Check if the player is hosp
        if (document.getElementsByClassName('icon15___9suOW').length == 1) { // YES - Hosp
          // Confirm the Revive request
          if (confirm('Are you sure you want to ask for a revive?')) { // YES - Confirm
            console.log('Sending Revive Request for ' + vPlayerName + '[' + vPlayerID + ']');
            // Send Request
            GM.xmlHttpRequest({
              method: "POST",
              url: "https://www.thenextlist.net/includes/DEVreviveMe.php",
              data: "playerName=" + vPlayerName + "&playerID=" + vPlayerID,
              headers: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              onload: function(response) {
                alert(response.responseText);
              }
           });
         } else { // NO - Confirm
            console.log('Revive Request Cancelled.');
          }
        } else { // NO - Hosp
          alert('Revive Request Denied : You are not in the hospital.');
        }
    });
    }
   });
})();
