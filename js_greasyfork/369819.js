// ==UserScript==
// @name         ThienDia Search
// @version      1.100
// @description  Thêm nút chèn Signcode vào ThienDia
// @match        https://thiendia.com/*
// @grant 	 GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @namespace https://greasyfork.org/users/192939
// @downloadURL https://update.greasyfork.org/scripts/369819/ThienDia%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/369819/ThienDia%20Search.meta.js
// ==/UserScript==


function themSign(){
    var iframe = document.getElementById('QuickSearch');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var str = innerDoc.getElementByClassName("textCtrl").value;
    document.getElementByClassName("textCtrl" ).value = str;
    document.getElementByClassName("textCtrl" ).value += " 123test123";
}
themSign();

