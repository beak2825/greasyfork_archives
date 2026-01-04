// ==UserScript==
// @name         ez pound transfer
// @namespace    ezpoundtransfer
// @version      0.5
// @description  title
// @author       You
// @match        http://www.neopets.com/pound/transfer.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35875/ez%20pound%20transfer.user.js
// @updateURL https://update.greasyfork.org/scripts/35875/ez%20pound%20transfer.meta.js
// ==/UserScript==

var nameList = [];
var currentUserElement;
var currentIndex = 0;

$('document').ready(function(){
  console.log("Document ready");
  //$('#exchange_submit').after('<br><br><br><form action="transfer_confirm.phtml" method="post"><input name="user" value="makewaysuperstar" type="hidden"><input name="pet_name" value="Corgarde" type="hidden"><input name="confirm" value="0" type="hidden"><input name="_ref_ck" value="cf55f4621985ffc89659c8efb0ea6689" type="hidden"><input value="Go" type="submit"></form>');
  $('#bxwrap').after('<br><br>Username: <input id="npt_username" type="text"> <button id="npt_go">Go</button><br><br><div id="npt_results" style="height: 220px;"></div><br><br><div id="npt_controls"><button id="npt_prev_user"><</button>&nbsp;&nbsp;&nbsp;&nbsp;<button id="npt_get_pets">Get pets</button>&nbsp;&nbsp;&nbsp;&nbsp;<button id="npt_next_user">></button></div><br><span id="npt_current_user">None</span><br><br><button id="npt_jump_position">Jump to position</button> <button id="npt_jump_user">Jump to user</button><br><br><textarea id="npt_names_text" style="width: 790px; height: 105px;"></textarea><br><button id="npt_process_list">Process text</button>');
  console.log("Page modified");
  $('#npt_go').click(function(){search("");});
  $('#npt_process_list').click(function(){processList();});
  $('#npt_prev_user').click(function(){prevUser();});
  $('#npt_next_user').click(function(){nextUser();});
  $('#npt_get_pets').click(function(){getCurrentUserPets();});
  $('#npt_jump_position').click(function(){jumpToPosition();});
  $('#npt_jump_user').click(function(){jumpToUser();});
  console.log("Click events bound");
  currentUserElement = $('#npt_current_user');
  if (localStorage.getItem("namelist_current")) {
    console.log("Loading namelist_current");
    currentIndex = localStorage.getItem("namelist_current");
    console.log("Loaded namelist_current");
  }
  if (localStorage.getItem("namelist")) {
    console.log("Loading namelist");
    nameList = JSON.parse(localStorage.getItem("namelist"));
    if (currentIndex >= nameList.length) {
      currentIndex = 0;
    }
    console.log("Loaded namelist");
    updateCurrentUser();
  }
  console.log("Complete");
});

function jumpToPosition() {
  var jumpPosition = prompt("Enter the position plz");
  jumpPosition = parseInt(jumpPosition.trim());
  if (nameList[jumpPosition] != null) {
    currentIndex = jumpPosition - 1;
    updateCurrentUser();
  }
}

function jumpToUser() {
  var jumpUser = prompt("Enter a user ok");
  jumpUser = jumpUser.trim();
  if (nameList.indexOf(jumpUser) !== -1) {
    currentIndex = nameList.indexOf(jumpUser);
    updateCurrentUser();
  }
}

function search(searchUser) {
  //alert(searchUser);
  var username = "";
  if (searchUser == "") {
    username = $('#npt_username').val().trim();
  } else {
    username = searchUser;
  }
  //alert(username);
  var petInfo = $('.transfer_pet_form')[0];
  var petName = $('input[name="pet_name"]', petInfo).val();
  var petRef = $('input[name="_ref_ck"]', petInfo).val();
  //alert(petName);
  //alert(petRef);
  $.ajax({
    url: "http://www.neopets.com/pound/transfer_confirm.phtml",
    data: {
      user: username,
      pet_name: petName,
      confirm: '0',
      _ref_ck: petRef,
    },
    type: "POST",
  }).error(function(){
    alert("An error occurred while fetching data");
    return;
  }).success(function(data){
    //alert(data);
    if ($('#neopet_exchange', data).length > 0) {
      $('#npt_results').html('<b><a href="http://www.neopets.com/userlookup.phtml?user=' + username + '">' + username + '</a></b>\'s neopets:<br>');
      var allPets = $('#neopet_exchange > form > table > tbody > tr > td', data);
      var cutoffOne = 20000;
      var cutoffTwo = 100000;
      for (var i = 0; i < allPets.length; i++) {
        //alert($(allPets[i]).text());
        var cost = parseInt($('> b:last-of-type', allPets[i]).text().replace(",","").replace(" NP",""));
        var costString = cost.toLocaleString() + " NP";
        if (cost >= cutoffOne && cost < cutoffTwo) {
          costString = '<b>' + costString + '</b>';
        } else if (cost >= cutoffTwo) {
          costString = '<b style="color: red;">' + costString + '</b>';
        }
        var petNameColour = "";
        if ($('> a > b', allPets[i]).text().includes("-") || $('> a > b', allPets[i]).text().includes(".") || $('> a > b', allPets[i]).text().includes(" ")) {
          petNameColour = "red";
        }
        $('#npt_results').append('<div style="float: left; margin: 20px;"><a href="http://www.neopets.com/petlookup.phtml?pet=' + $('> a > b', allPets[i]).text() + '" style="color: ' + petNameColour + ';"><img src="http://pets.neopets.com/cpn/' + encodeURI($('> a > b', allPets[i]).text()) + '/1/2.png"><br><b>' + $('> a > b', allPets[i]).text() + '</a></b><br>' + costString + '</div>');
      }
    } else {
      alert("Account doesn't exist or have pets or something");
    }
  });
}

function getCurrentUserPets() {
  search(nameList[currentIndex]);
  nextUser();
}

function processList() {
  nameList = [];

  textLines = $('#npt_names_text').val().split(/\r?\n/);

  for (var i = 0; i < textLines.length; i++) {
    var lineText = textLines[i].trim().split(' ')[0].split('\t')[0];
    if (lineText != "" && nameList.indexOf(lineText) === -1) {
      nameList.push(lineText);
    }
  }
  nameList.sort()
  //alert(nameList);
  localStorage.setItem("namelist", JSON.stringify(nameList));
  currentIndex = 0;
  updateCurrentUser();
}

function updateCurrentUser() {
  console.log("Updating current user");
  $(currentUserElement).text(+currentIndex+1 + "/" + nameList.length + " - " + nameList[currentIndex]);
  console.log("Updated current user");
}

function nextUser() {
  currentIndex++;
  if (currentIndex >= nameList.length) {
    currentIndex = 0;
  }
  updateCurrentUser();
  localStorage.setItem("namelist_current", currentIndex);
}

function prevUser() {
  currentIndex--;
  if (currentIndex < 0) {
    currentIndex = nameList.length - 1;
  }
  if (currentIndex < 0) {
    currentIndex = 0;
  }
  updateCurrentUser();
  localStorage.setItem("namelist_current", currentIndex);
}








