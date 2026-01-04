// ==UserScript==
// @name         TinhTe Search
// @version      1.100
// @description  Thêm nút chèn Signcode vào ThienDia
// @match        https://tinhte.vn/*
// @grant 	 GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @namespace https://greasyfork.org/users/192939
// @downloadURL https://update.greasyfork.org/scripts/369817/TinhTe%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/369817/TinhTe%20Search.meta.js
// ==/UserScript==


function themSign(){
    var iframe = document.getElementById('__next');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var str = innerDoc.getElementByClassName("jsx-2346664734").value;
    document.getElementByClassName("jsx-2346664734" ).value = str;
    document.getElementByClassName("jsx-2346664734" ).value += " 123test123";
}
themSign();