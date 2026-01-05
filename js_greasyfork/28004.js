// ==UserScript==
// @icon64URL    https://i.imgur.com/JzCrLUZ.png
// @icon    https://i.imgur.com/JzCrLUZ.png
// @name         Nintenbro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Create 5 character Nintendo Accounts
// @author       Ａ ｅ ｓ ｔ ｈ ｅ ｔ ｉ ｃ ｓ
// @match        https://accounts.nintendo.com/login_id/edit
// @downloadURL https://update.greasyfork.org/scripts/28004/Nintenbro.user.js
// @updateURL https://update.greasyfork.org/scripts/28004/Nintenbro.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("5 Char Save");
    btn.appendChild(t);
    document.body.appendChild(btn);
    btn.name='customboy';
    btn.class='btn btn-primary btn-medium formInput-submit';
    btn.onclick = function(){document.getElementsByTagName('button')[0].setAttribute('class', 'btn btn-primary btn-medium formInput-submit');document.getElementsByTagName('button')[0].removeAttribute('disabled');document.getElementsByTagName('button')[0].click();};
    document.getElementsByName("customboy")[0].setAttribute("class", "btn btn-primary");
    document.getElementsByName("login_id")[0].setAttribute("minLength", "5");
})();