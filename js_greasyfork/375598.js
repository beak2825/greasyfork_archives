// ==UserScript==
// @name         Horizon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://horizon.mcgill.ca/pban1/twbkwbis.P_WWWLogin
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375598/Horizon.user.js
// @updateURL https://update.greasyfork.org/scripts/375598/Horizon.meta.js
// ==/UserScript==

// @require http://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==
function test() {

var name = document.getElementById('mcg_un');
    //ENTER YOUR EMAIL HERE
    name.value = 'first.last@mail.mcgill.ca';
    console.log(name.value);
   // stuff.click();
var pass = document.getElementById('mcg_pw');
    //ENTER YOUR PASSWORD HERE
    pass.value = 'PASSWORD';
    console.log(pass.value);
    document.getElementById('mcg_un_submit').click();



}

(function() {
    'use strict';
 //   setTimeout(test, 1000);
    test();

})();