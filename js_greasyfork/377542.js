// ==UserScript==
// @name Auto Dodge
// @description Set dodge Time and Auto Dodge
// @author Lotus Confort
// @version 1.1.5
// @date 21-11-2017
// @namespace Lotus Confort - Based on FunnyPocketBook'script
// @include https://*/game.php?screen=place&try=confirm&type=all&report_id=*
// @downloadURL https://update.greasyfork.org/scripts/377542/Auto%20Dodge.user.js
// @updateURL https://update.greasyfork.org/scripts/377542/Auto%20Dodge.meta.js
// ==/UserScript==

(function () {
    'use strict';

var url = document.location.href;
var searchUrl = new URLSearchParams(url);

if (searchUrl.has("d")){dodgeLaunch()}else{dodgeCreate()};

function dodgeLaunch(){
    document.getElementById("troop_confirm_go").click();
};

function dodgeCreate() { // Add new table row for offset
    window.offsetTr = document.createElement("tr");
    window.offsetTd = document.createElement("td");
    var arrTimeNow = document.getElementById("date_arrival");
    window.offsetTr.appendChild(window.offsetTd); // Append td to tr
    arrTimeNow.parentNode.parentNode.insertBefore(window.offsetTr, arrTimeNow.parentNode[1]);
    window.offsetTd.innerHTML = "Offset: ";
    window.offsetTd.setAttribute("colspan", "2");
    window.offsetTd.setAttribute("id", "offset");

    // Set Offset
    var pEle = document.getElementById("offset"); // Button comes after this element
    var inputOffset = document.createElement("input");
    inputOffset.setAttribute("id", "inputOffset");
    inputOffset.setAttribute("type", "text");
    inputOffset.setAttribute("style", "font-size:15px;")
    var callOffset1 = localStorage.getItem("saveOffset");
    if (callOffset1 !== null) {
        var offsetInput = localStorage.getItem("saveOffset");
    } else {
        var offsetInput = "15";
    }
    inputOffset.setAttribute("value", offsetInput);
    inputOffset.setAttribute("style", "margin-top:10px; width:50px;");
    pEle.appendChild(inputOffset, pEle.nextElementSibling);

    // Create "Set Offset" button
    var parentSetOffset = document.getElementById("inputOffset"); // Button comes after this element
    var buttonOffset = document.createElement("a"); // Create button called buttonOffset as a link because any button causes the attack to launch
    buttonOffset.setAttribute("id", "buttonOffset"); // Set ID of buttonOffset
    buttonOffset.setAttribute("class", "btn");
    buttonOffset.setAttribute("style", "cursor:pointer;"); // Set cursor to pointer
    parentSetOffset.parentNode.insertBefore(buttonOffset, parentSetOffset.nextElementSibling); // Place buttonOffset after parentSetOffset
    var text = document.createTextNode("Set Offset"); // buttonOffset has this text
    buttonOffset.appendChild(text); // Append text to buttonOffset

    buttonOffset.onclick = function () {
        "use strict";
        var saveOffset = document.getElementById("inputOffset").value;
        localStorage.setItem("saveOffset", saveOffset);
        var callOffset = localStorage.getItem("saveOffset");
        console.log(callOffset);
    };

    // Add new table row for dodge time
    window.showDodgeTimeTr = document.createElement("tr");
    window.showDodgeTimeTd = document.createElement("td");
    var arrTimeNow = document.getElementById("date_arrival");
    window.showDodgeTimeTr.appendChild(window.showDodgeTimeTd); // Append td to tr
    arrTimeNow.parentNode.parentNode.insertBefore(window.showDodgeTimeTd, arrTimeNow.parentNode[1]);
    window.showDodgeTimeTd.innerHTML = "Indiquer l'heure du dodge : ";
    window.showDodgeTimeTd.setAttribute("colspan", "2");
    window.showDodgeTimeTd.setAttribute("id", "showDodgeTime");

    // Create "Set Arrival Time" button
    var pEle = document.getElementById("showDodgeTime"); // Button comes after this element
    var para = document.createElement("p"); // Create new paragraph
    para.setAttribute("style", "width:100%");
    var btn = document.createElement("a"); // Create button called btn as a link because any button causes the attack to launch
    btn.setAttribute("id", "arrTime"); // Set ID of btn
    btn.setAttribute("class", "btn");
    btn.setAttribute("style", "cursor:pointer;"); // Set cursor to pointer
    pEle.parentNode.insertBefore(para, pEle.nextElementSibling); // Place para after pEle
    para.parentNode.parentNode.appendChild(btn); // Set the paragraph after the table
    var t = document.createTextNode("Set dodge time"); // btn has this text
    btn.appendChild(t); // Append text to btn

    // Create input for time
    var defaultTime = document.getElementById("serverTime").textContent;
    var parentInput = document.getElementById("showDodgeTime"); // Button comes after this element
    var inputTime = document.createElement("input");
    inputTime.setAttribute("id", "inputTime");
    inputTime.setAttribute("type", "text");
    inputTime.setAttribute("value", defaultTime);
    inputTime.setAttribute("style", "margin-top:10px; width:80px;font-size:15px;");
    parentInput.appendChild(inputTime, parentInput.nextElementSibling);

    // Create input for MS
    var parentInputMs = document.getElementById("showDodgeTime"); // Button comes after this element
    var inputTimeMs = document.createElement("input");
    inputTimeMs.setAttribute("id", "inputTimeMs");
    inputTimeMs.setAttribute("type", "text");
    inputTimeMs.setAttribute("value", "100");
    inputTimeMs.setAttribute("style", "margin-top:10px; width:30px;font-size:15px;");
    parentInputMs.appendChild(inputTimeMs, parentInputMs.nextElementSibling);

    window.setArrTimeTr = document.createElement("tr");
    window.setArrTimeTd = document.createElement("td");

    //définir les valeurs pour Dodge :
    /* var troupes = [0,0,0,0,0,0,0,0,0,0,0,0];
     var allInputs = document.getElementsByTagName('input');
     if (allInputs.type == 'hidden'){allInputs.type == 'show'}else(alert('problème'));



     var $tableau_unite = $("#place_confirm_units tr:eq(2)");
     $tableau_unite.find('td').each(function (index, element) {

     });
     var line = $("#place_confirm_units tr:eq(2)").clone();
     var nb_line = $("#place_confirm_units tr").length;

     $(line).find("td input").each(function (index) {
         var input = $(line).find("td input")[index];
         var id = $(input).attr("id");
         $($(line).find("td input")[index]).attr('id', id + nb_line);
     });



     $("#place_confirm_units").append(line);*/

    btn.onclick = function () {
        "use strict";
        var delayTime = parseInt(localStorage.getItem("saveOffset"));
        var intervalTime = 30; // Set interval in ms
        var urldodge = document.location.href;
        var i = 0;

        console.log("delayTime: " + delayTime);



        // Add new table row for the set arrival time
        var arrTimeNow = document.getElementById("date_arrival");
        window.setArrTimeTr.appendChild(window.setArrTimeTd); // Append td to tr
        arrTimeNow.parentNode.parentNode.insertBefore(window.setArrTimeTr, arrTimeNow.parentNode[1]);
        window.setArrTimeTd.innerHTML = "Dodge pour : " + document.getElementById("inputTime").value + ":" + document.getElementById("inputTimeMs").value + ", latence : " + delayTime + " ms";
        window.setArrTimeTd.setAttribute("colspan", "2");
        window.setArrTimeTd.setAttribute("id", "setArrTime");

        var arrivalTime = document.getElementById("inputTime").value;
        var arrivalTimeMs = parseInt(document.getElementById("inputTimeMs").value);
        var totalDelay;
        if (arrivalTimeMs - delayTime <= 0) {
            totalDelay = arrivalTimeMs;
        } else {
            totalDelay = arrivalTimeMs - delayTime;
        }
        console.log("totalDelay: " + totalDelay);

        setInterval(function retime() {
            //	setInterval(function arrival() {
            window.arrival = document.getElementById("serverTime").textContent;
            //	}, 100);
            if (window.arrival.slice(-8) === arrivalTime) {
                setTimeout(function () {
                    if (i == 0) {
                        window.location.href = urldodge + '&d=1';
                        i++;
                    }
                }, totalDelay);
            }
        }, intervalTime);
    };
};

})();