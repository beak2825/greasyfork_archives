// ==UserScript==
// @name 2B is a MAN
// @namespace Violentmonkey Scripts
// @match https://anekiho.me/chat2/
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant none
// @description 2b is a man
// @version 0.0.1.20190605155622
// @downloadURL https://update.greasyfork.org/scripts/384581/2B%20is%20a%20MAN.user.js
// @updateURL https://update.greasyfork.org/scripts/384581/2B%20is%20a%20MAN.meta.js
// ==/UserScript==
  $("#inputField").on("input", function () {
        var str = '2b';
        var aMan = "(IS A MAN LMAO)";
        var index = $("#inputField").val().toLowerCase().indexOf('2b');
        var filter = $("#inputField").val().toLowerCase().search(aMan.toLowerCase());
        if (index >= 0 && filter <0) {
            var str2 = $("#inputField").val();
            var txt2 = str2.slice(0, index+2) + aMan + " "+ str2.slice(index+2);
          document.getElementById("inputField").value = txt2;
        }       
    });