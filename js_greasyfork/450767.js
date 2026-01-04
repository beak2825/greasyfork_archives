// ==UserScript==
// @name         xyw登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  111
// @author       You
// @match        http://*/a70.htm

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450767/xyw%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/450767/xyw%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {

    let username = "****";
    let password = "****";

    let set = document.getElementsByClassName("edit_lobo_cell");


    set[1].value = username;
    set[2].value = password;

})();