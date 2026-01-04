// ==UserScript==
// @name         Neopets: Default neomail reply
// @namespace    http://clraik.com/forum/showthread.php?61799
// @version      0.2
// @description  Adds default neomail replies into your Neomail.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/neomessages.phtml?type=send&recipient=*&reply_message_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32864/Neopets%3A%20Default%20neomail%20reply.user.js
// @updateURL https://update.greasyfork.org/scripts/32864/Neopets%3A%20Default%20neomail%20reply.meta.js
// ==/UserScript==

// change the following phrases to whatever you want

var text1 = "No thank you. Good luck though.";
var text2 = "No thanks. Thanks for offering.";
var text3 = "NTY GLT";

var para = document.createElement("p");
document.getElementsByClassName("content")[0].getElementsByTagName("form")[0].appendChild(para);
para.innerHTML = '<div style="background:#C8E3FF;padding:10px 5px;border:1px solid #000"><input type="radio" id="nty1"> ' + text1 + '<br><input type="radio" id="nty2"> ' + text2 + '<br><input type="radio" id="nty3"> ' + text3 + '</div>';

$('#nty1').change(function(){
    var c = this.checked;
    $('#message_body').val(text1);
$('#nty2').attr('checked', false);
$('#nty3').attr('checked', false);
});
$('#nty2').change(function(){
    var c = this.checked;
    $('#message_body').val(text2);
$('#nty1').attr('checked', false);
$('#nty3').attr('checked', false);
});
$('#nty3').change(function(){
    var c = this.checked;
    $('#message_body').val(text3);
$('#nty1').attr('checked', false);
$('#nty2').attr('checked', false);
});