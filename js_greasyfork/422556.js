// ==UserScript==
// @name         Xero EzBan
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Mass ban users in hwid lookup
// @author       Swaight
// @match        https://xero.gg/neocortex/lookup/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422556/Xero%20EzBan.user.js
// @updateURL https://update.greasyfork.org/scripts/422556/Xero%20EzBan.meta.js
// ==/UserScript==

(function() {
    'use strict';



$(".table-responsive table.table tbody tr").each(function( index ) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Execute";
    btn.className = "btn btn-danger btn-mini text-bold";
    btn.style.position = "absolute";
    btn.style.right = "35px";
    btn.setAttribute("data", $(this)[0].childNodes[3].innerText);
    btn.onclick = function(){
        var banTypeSelect = document.getElementById("banType");
        var banType = banTypeSelect.options[banTypeSelect.selectedIndex].value;

        var durationTypeSelect = document.getElementById("durationType");
        var durationType = durationTypeSelect.options[durationTypeSelect.selectedIndex].value;

        var banUnbanSelect = document.getElementById("banUnban");
        var banUnbanType = banUnbanSelect.options[banUnbanSelect.selectedIndex].value;

        if(banUnbanType == 'ban'){
            Ban($(this).attr("data"), banType, $("#durationInput").val(), durationType, $("#reasonInput").val(), $("#ticketInput").val(), $(this)[0]);
        }
        else{
            Unban($(this).attr("data"), banType, $("#reasonInput").val(), $("#ticketInput").val(), $(this)[0]);
        }
      };
    
    $(this)[0].childNodes[7].append(btn);
  });

  function Ban(accountId, type, duration, durationType, internalReason, ticketId, responseElem){
    $.post("https://xero.gg/neocortex/post/player/ban", { id: accountId, type: type, duration: duration, durationType: durationType, internalReason: internalReason, ticketId: ticketId } , function(data) {
        var responseMsg = document.createElement("text");
        if(data.success == true){
            responseMsg.innerText = "Successfully banned.";
            responseMsg.style.color = "green";
        }
        else{
            responseMsg.innerText = data.text;
            responseMsg.style.color = "red";
        }

        responseMsg.style.float = "right";
        responseElem.parentNode.parentNode.childNodes[5].append(responseMsg);
      });
}

function Unban(accountId, type, internalReason, ticketId, responseElem){
    $.post("https://xero.gg/neocortex/post/player/unban", { id: accountId, type: type, internalReason: internalReason, ticketId: ticketId } , function(data) {
        var responseMsg = document.createElement("text");
        if(data.success == true){
            responseMsg.innerText = "Successfully unbanned.";
            responseMsg.style.color = "green";
        }
        else{
            responseMsg.innerText = data.text;
            responseMsg.style.color = "red";
        }

        responseMsg.style.float = "right";
        responseElem.parentNode.parentNode.childNodes[5].append(responseMsg);
      });
}

var inputsDiv = document.createElement("div");
inputsDiv.className = "form-inline";
inputsDiv.style.float = "right";

var banUnbanDiv = document.createElement("div");
banUnbanDiv.className = "form-group mb-2";
inputsDiv.appendChild(banUnbanDiv);

var banUnbanSelectList = document.createElement("select");
banUnbanSelectList.id = "banUnban";
banUnbanSelectList.className = "form-control";
banUnbanSelectList.style.height = "auto";
banUnbanSelectList.style.padding = "3px";
banUnbanSelectList.style.margin = "2px";
banUnbanDiv.appendChild(banUnbanSelectList);

var banTypeDiv = document.createElement("div");
banTypeDiv.className = "form-group mb-2";
inputsDiv.appendChild(banTypeDiv);

var banTypeSelectList = document.createElement("select");
banTypeSelectList.id = "banType";
banTypeSelectList.className = "form-control";
banTypeSelectList.style.height = "auto";
banTypeSelectList.style.padding = "3px";
banTypeSelectList.style.margin = "2px";
banTypeDiv.appendChild(banTypeSelectList);

var durationDiv = document.createElement("div");
durationDiv.className = "form-group mb-2";
inputsDiv.appendChild(durationDiv);

var durationInput = document.createElement("input");
durationInput.id = "durationInput";
durationInput.className = "form-control";
durationInput.style.height = "auto";
durationInput.style.padding = "3px";
durationInput.style.width = "75px";
durationInput.style.margin = "2px";
durationInput.placeholder = "Duration";
durationDiv.appendChild(durationInput);

var durationTypeDiv = document.createElement("div");
durationTypeDiv.className = "form-group mb-2";
inputsDiv.appendChild(durationTypeDiv);

var durationTypeSelectList = document.createElement("select");
durationTypeSelectList.id = "durationType";
durationTypeSelectList.className = "form-control";
durationTypeSelectList.style.height = "auto";
durationTypeSelectList.style.padding = "3px";
durationTypeSelectList.style.margin = "2px";
durationTypeDiv.appendChild(durationTypeSelectList);

var reasonDiv = document.createElement("div");
reasonDiv.className = "form-group mb-2";
inputsDiv.appendChild(reasonDiv);

var reasonInput = document.createElement("input");
reasonInput.id = "reasonInput";
reasonInput.className = "form-control";
reasonInput.style.height = "auto";
reasonInput.style.padding = "3px";
reasonInput.style.width = "280px";
reasonInput.style.margin = "2px";
reasonInput.placeholder = "Reason - At least 6 characters";
reasonDiv.appendChild(reasonInput);

var ticketDiv = document.createElement("div");
ticketDiv.className = "form-group mb-2";
inputsDiv.appendChild(ticketDiv);

var ticketInput = document.createElement("input");
ticketInput.id = "ticketInput";
ticketInput.className = "form-control";
ticketInput.style.height = "auto";
ticketInput.style.padding = "3px";
ticketInput.style.width = "75px";
ticketInput.style.margin = "2px";
ticketInput.placeholder = "Ticket ID";
ticketDiv.appendChild(ticketInput);

var banTypes = [
    { name: '--', value: '-' },
    { name: 'Website', value: 'website' },
    { name: 'Game', value: 'game' },
    { name: 'Chat', value: 'chat' },
    { name: 'Event', value: 'event' },
    { name: 'Newsfeed', value: 'newsfeed' }
];

var durationTypes = [
    { name: '--', value: '-' },
    { name: 'Minutes', value: 'minute' },
    { name: 'Hours', value: 'hour' },
    { name: 'Days', value: 'day' },
    { name: 'Weeks', value: 'week' },
    { name: 'Months', value: 'month' },
    { name: 'Permanent', value: 'perm' }
];

var banUnbanTypes = [
    { name: 'Ban', value: 'ban' },
    { name: 'Unban', value: 'unban' }
];

for (var i = 0; i < banUnbanTypes.length; i++) {
    var option = document.createElement("option");
    option.value = banUnbanTypes[i].value;
    option.text = banUnbanTypes[i].name;
    banUnbanSelectList.appendChild(option);
}

for (var i = 0; i < banTypes.length; i++) {
    var option = document.createElement("option");
    option.value = banTypes[i].value;
    option.text = banTypes[i].name;
    banTypeSelectList.appendChild(option);
}

for (var i = 0; i < durationTypes.length; i++) {
    var option = document.createElement("option");
    option.value = durationTypes[i].value;
    option.text = durationTypes[i].name;
    durationTypeSelectList.appendChild(option);
}

$("#neocortex-content h4").after(inputsDiv);
})();