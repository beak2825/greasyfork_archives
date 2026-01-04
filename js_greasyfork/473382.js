// ==UserScript==
// @name         get QR from Loglevel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  It will generate a button that will add the QR code for each person in the table.
// @author       penavari
// @match        https://www.loglevel.com/aticgo/US/gateway_amazon_roc_new.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/473382/get%20QR%20from%20Loglevel.user.js
// @updateURL https://update.greasyfork.org/scripts/473382/get%20QR%20from%20Loglevel.meta.js
// ==/UserScript==

var updateQRCodeButtons = function(){
    // Get table
    var table = document.querySelectorAll('#mainTable > tbody')[0]
    // Get each row
    for (var row of table.children) {

    var stringFromFunction = '' + row.querySelector('.sorting_2').onclick
    console.log(row)
    var split = stringFromFunction.split("'")
    var uID = split[1];
    var uKey = split[3];
    console.log(uID + " " + uKey)

    var img = document.createElement ('img');
    img.setAttribute('src', `https://api.qrserver.com/v1/create-qr-code/?data=[https%3A%2F%2Floglevel.com%2Faticgo%2Fpdf_AuthCard.html%3FuKey%3D${uKey}%26uID%3D${uID}]`)
    var sixthChild = row.children[6];
    sixthChild.innerHTML = "";
    sixthChild.appendChild(img);
    }
}



$(document).ready(function() { //When document has loaded

var zNode = document.createElement ('div');
zNode.innerHTML = '<button id="qr" type="button"> Update QR code!</button>';
zNode.setAttribute ('id', 'qrButtonContainer');
document.getElementsByTagName("div")[0].appendChild (zNode);
//document.body.appendChild (zNode);
  //--- Activate the newly added button.
document.getElementById("qr").addEventListener (
    "click", updateQRCodeButtons, false
);



});