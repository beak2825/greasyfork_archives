// ==UserScript==
// @name         Xero Move Sus Actions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mass move sus actions
// @author       Swaight
// @match        https://xero.gg/neocortex/action/suspicious*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/422557/Xero%20Move%20Sus%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/422557/Xero%20Move%20Sus%20Actions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var inputsDiv = document.createElement("div");
    inputsDiv.className = "form-inline";
    inputsDiv.style.float = "right";

    var btn = document.createElement("BUTTON");
    btn.innerHTML = "Move all to False Positive";
    btn.className = "btn btn-primary";
    inputsDiv.appendChild(btn);

    btn.onclick = function(){
        $("a.editable.editable-click").each(function( index ) {
            post(this.attributes[4].value);
        });

        function post(id){
            $.post( "https://xero.gg/neocortex/post/action/suspicious/editable", { name: "status", value: "3", pk: id } );
        }
    };

    $(".btn-group, .btn-group-sm").after(inputsDiv);
})();