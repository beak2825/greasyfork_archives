// ==UserScript==
// @name         Webmail Automation Tools
// @namespace    #1NL Scripts
// @version      0.1
// @description  Tools to automate the webmail website.
// @author       Luiz Menezes
// @match        http://webmail.numberone.com.br/
// @grant        none
// @icon         https://cdn.iconscout.com/icon/free/png-256/mail-1140-830582.png
// @downloadURL https://update.greasyfork.org/scripts/398527/Webmail%20Automation%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/398527/Webmail%20Automation%20Tools.meta.js
// ==/UserScript==

console.log("Webmail Automation Tools - Loaded !");

//Check for login form existance, if exists, fill form and click.
if(document.querySelector('#login_username')) {
    document.querySelector("#login_username").value = "coordenacao.novalima";
    document.querySelector("#secretkey").value = "N1n02019";
    document.querySelector(".submit_bt").click();
    console.log('(SATL) Login found, filled and clicked!')
}else{
    console.log('Login not found!')
}