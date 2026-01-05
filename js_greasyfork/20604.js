// ==UserScript==
// @version         1.0.1
// @name Visible Password
// @description Visible password on password field
// @include *
// @icon https://addons.opera.com/media/extensions/55/151155/1.0.0-rev1/icons/icon_64x64.png
// @namespace https://greasyfork.org/users/49201
// @downloadURL https://update.greasyfork.org/scripts/20604/Visible%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/20604/Visible%20Password.meta.js
// ==/UserScript==

var KEY_ENTER = 13;
var inputs = document.querySelectorAll('input[type=password]');

function insec(i){
    function hidePassword()
    {
        inputs[i].type = 'password';
    }
    function showPassword()
    {
        inputs[i].type = 'text';
    }
    function onBeforeSubmit(e)
    {
        if (e.keyCode === KEY_ENTER) hidePassword();
    }
    inputs[i].addEventListener('focus', showPassword);
    inputs[i].addEventListener('blur', hidePassword);
    inputs[i].addEventListener('keydown', onBeforeSubmit);
}

for
    (var i = 0;
     i < inputs.length;
     i++)
    insec(i);