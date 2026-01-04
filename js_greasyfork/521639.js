// ==UserScript==
// @name         Blob.io - Unfriend, for web 2.0!
// @namespace    https://discord.gg/N8cAjjJNmz
// @version      2024-11-22
// @description  so stupid
// @author       d123450789
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js
// @match        *://blobgame.io/*
// @icon         https://cdn.discordapp.com/icons/1286168636586987580/57b3fc6cff46194b5af46da57bf4088a.webp?size=240
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521639/Blobio%20-%20Unfriend%2C%20for%20web%2020%21.user.js
// @updateURL https://update.greasyfork.org/scripts/521639/Blobio%20-%20Unfriend%2C%20for%20web%2020%21.meta.js
// ==/UserScript==

(function () {
  'use strict';
  //alert("this will be automatically updated with more features!")
  var token = localStorage.getItem('access-token')

  function showFriends() {
    var my_div = document.querySelector("#modal > app-friend > div.header > div.center");
    my_div.innerHTML = my_div.innerHTML + '<input id="inputFriendID" type="text">';
    my_div.innerHTML = my_div.innerHTML + '<button id="clickedUnfriend" type="button">Unfriend!</button>';

    //my_div.innerHTML = my_div.innerHTML + '<input id="inputFriendIDADD" type="text">';
    //   my_div.innerHTML = my_div.innerHTML + '<button id="clickedAddFriend" type="button">Add friend!</button>';

    console.log("opened friends")

    document.getElementById('clickedUnfriend').addEventListener('click', sendRequest);

  }

  function sendRequest() {
    var personID = document.getElementById('inputFriendID');

    if (document.getElementById('inputFriendID').value === '') {
      alert("Enter a valid ID!");
      return
    } else

      $.ajax({
        type: "POST",
        url: "https://api.blobgame.io:988/api/users/setRelation/",
        data: {
          "api_ver": "4.7",
          "pl": "1",
          "status": "2",
          "target_id": personID.value,
          "token": token
        },
        success: function (data) {
          console.log(data);
          alert("Unfriended, " + personID.value + "!")

          //alert(data)
        },
        //dataType: "text"
      });

  }
  const bro = document.querySelector("body > app-root > app-main > div.wrapper > header > div.right > button.friends.icon-button").addEventListener("click", showFriends);

})();