// ==UserScript==
// @name Add Meroshare Id
// @description Adds an id of selectDP to the select element in meroshare
// @match https://meroshare.cdsc.com.np/#/login
// @version 0.0.1.20230727120801
// @namespace https://greasyfork.org/users/1137107
// @downloadURL https://update.greasyfork.org/scripts/471840/Add%20Meroshare%20Id.user.js
// @updateURL https://update.greasyfork.org/scripts/471840/Add%20Meroshare%20Id.meta.js
// ==/UserScript==


var intv = setInterval(function addIdtoSelect() {
    let element = document.getElementsByClassName("select2-hidden-accessible")[0];
    if (element){
        clearInterval(intv);
        element.id = 'selectDP';
    }
}, 100)
