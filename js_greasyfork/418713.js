// ==UserScript==
// @name         ProtonMail Beta
// @version      1.2
// @author       openpaige
// @description  A basic userscript to automatically switch to ProtonMail's beta subdomain by redirecting mail.protonmail.com to beta.protonmail.com.
// @icon         https://gitlab.com/openpaige-user-scripts/protonmail-beta/-/raw/master/media/protonmail-sign-dark.png
// @match        *://mail.protonmail.com/*
// @run-at       document-start
// @namespace https://greasyfork.org/users/668007
// @downloadURL https://update.greasyfork.org/scripts/418713/ProtonMail%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/418713/ProtonMail%20Beta.meta.js
// ==/UserScript==

function checkURL(url){
    return !!url.match(/^(|http(s?):\/\/)(|mail.)protonmail.com(\/.*|$)/gim);
}

function newURL(url){
    return 'https://beta.protonmail.com' + url.split('protonmail.com').pop();
}

if(checkURL(window.location.href)){window.location.assign(newURL(window.location.href));}
