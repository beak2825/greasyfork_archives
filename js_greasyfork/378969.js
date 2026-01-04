// ==UserScript==
// @name AbyssusAutoLogin
// @description AutoLogin pour Abyssus
// @version  0.3.0
// @grant none
// @match https://*.abyssus.games/*
// @include https://www.abyssus.games/
// @namespace https://greasyfork.org/users/184736
// @downloadURL https://update.greasyfork.org/scripts/378969/AbyssusAutoLogin.user.js
// @updateURL https://update.greasyfork.org/scripts/378969/AbyssusAutoLogin.meta.js
// ==/UserScript==


setTimeout(function(){
    try {

        var pseudoInput = document.getElementById("pseudo");
        var mdpInput = document.getElementById("pass1");

        var pseudo = pseudoInput.value;
        pseudo = getCookie("AutoLogin_pseudo");
        var mdp = mdpInput.value;
        mdp = getCookie("AutoLogin_mdp");

        if (pseudo === "") {
            pseudo = window.prompt("Configuration AutoLogin - pseudo :", "");
            setCookie("AutoLogin_pseudo", pseudo, 7);
        }
        if( mdp === "") {
            mdp = window.prompt("Configuration AutoLogin - mdp :", "");
            setCookie("AutoLogin_mdp", mdp, 7);
        }

        if (pseudoInput.value === ""){
            pseudoInput.value = pseudo;
        }
        if (mdpInput.value === ""){
            mdpInput.value = mdp;
        }
        $('#login').click();
    } catch(e) {}
}, 200);




function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
