// ==UserScript==
// @name         Return every book to Overdrive
// @version      0.2
// @description  Return every book to Overdrive.
// @match        http://*.overdrive.com/*account/loans
// @match        https://*.overdrive.com/*account/loans
// @namespace https://greasyfork.org/users/179486
// @downloadURL https://update.greasyfork.org/scripts/402911/Return%20every%20book%20to%20Overdrive.user.js
// @updateURL https://update.greasyfork.org/scripts/402911/Return%20every%20book%20to%20Overdrive.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var arr = Object.keys(unsafeWindow.OverDrive.mediaItems || {});
    if(arr.length > 0){createButton();}
    function returnAll(){
        var ids = Object.keys(unsafeWindow.OverDrive.mediaItems);
        ids.forEach(id => setTimeout(() => unsafeWindow.ajax.returnTitle(id), 100+Math.random()*100));
    }
    function createButton(){
        var button = document.createElement("button");
        button.innerHTML = "Return all";
        var br = document.createElement("br");
        var buttonplace = document.getElementsByClassName("AccountLimitText")[0];
        buttonplace.appendChild(br);
        buttonplace.appendChild(button);
        button.addEventListener ("click", function() {
            returnAll();
        });
    }


})();
