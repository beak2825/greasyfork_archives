// ==UserScript==
// @name         SAG - Copy Info
// @version      0.1
// @description  Adds a copy info button to account generator.
// @author       ziv
// @match        https://accgen.cathook.club/
// @grant       GM_setClipboard
// @run-at document-end
// @namespace https://greasyfork.org/users/392432
// @downloadURL https://update.greasyfork.org/scripts/391649/SAG%20-%20Copy%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/391649/SAG%20-%20Copy%20Info.meta.js
// ==/UserScript==


function copy_info()
{
    var username = document.getElementById('acc_link').getElementsByTagName("strong")[0].textContent;
    var password = document.getElementById('acc_pass').getElementsByTagName("strong")[0].textContent;

    var accCopy = username + (":") + password;


    GM_setClipboard(accCopy);
}

var input=document.createElement("input");
input.type="button";
input.value="Copy Info";
input.onclick = copy_info;
input.setAttribute("style", "font-size:18px; margin-top: 10%; margin:auto; left:0%;");
input.className = "btn btn-primary btn-lg";
document.getElementsByClassName('card-body')[0].appendChild(input);