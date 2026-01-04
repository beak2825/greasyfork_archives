// ==UserScript==
// @name         Netmozi.com login
// @namespace    https://netmozi.com/login
// @version      19.03.15
// @description  Netmozi login script.
// @author       NMyy
// @match        *://netmozi.com/login
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375049/Netmozicom%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/375049/Netmozicom%20login.meta.js
// ==/UserScript==

var USER = 'XXX'; //set user
var PASS = 'XXX'; //set password

$(document).ready(function() {
    var loginok = document.body.innerHTML.toString().indexOf('Kilépés') != -1;

function sleep(seconds){
    var waitUntil = new Date().getTime() + seconds*1000;
    while(new Date().getTime() < waitUntil) true;
}

    //Ha a login oldalon vagyunk
    if (window.location.href.indexOf("login") != -1)
    {
            if (!loginok) //és még nem vagyunk bejelentkezve
            {
              let usernameElem = document.getElementById('inputName');
              usernameElem.value = USER;
              let passwordElem = document.getElementById('inputPassword');
              passwordElem.value = PASS;
              document.getElementById("loginForm").submit();
              sleep(1);
              window.location.href = 'https://netmozi.com/?page=&order=1&bookmarks=0&search=&genre=&type=1&year_from=&year_to=&language=1&rating_from=0&rating_to=10&quality=&first_letter=&actor=&character=';
            }
            else //már be vagyunk jelentkezve
            {
               window.location.href = 'https://netmozi.com/?page=&order=1&bookmarks=0&search=&genre=&type=1&year_from=&year_to=&language=1&rating_from=0&rating_to=10&quality=&first_letter=&actor=&character=';

            }
    }

});
