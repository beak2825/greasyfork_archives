// ==UserScript==
// @name         Show entire conversation for PnW
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds an option to enable/disable scrolling through messages. Makes it very easy to send screenshots of conversations.
// @author       RandomNoobster
// @match        https://politicsandwar.com/inbox/message/id=*
// @icon         https://politicsandwar.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440309/Show%20entire%20conversation%20for%20PnW.user.js
// @updateURL https://update.greasyfork.org/scripts/440309/Show%20entire%20conversation%20for%20PnW.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let div = document.querySelectorAll('#rightcolumn div')[2];
    div.style.height = "100%";

    let p = document.querySelectorAll('#rightcolumn > p .btn-default')[0].parentNode;
    let newButton = document.createElement('label');
    newButton.innerHTML = "Enable scrolling:";
    newButton.style.paddingLeft = "10px";

    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.style.marginLeft = "4px";
    checkbox.onchange = function checkScrolling () {
        if (checkbox.checked){
            div.style.height = "350px";
            setCookie("enableScrolling", true);
        }
        else {
            div.style.height = "100%";
            setCookie("enableScrolling", false);
        }
    };

    let enableScrolling = getCookie("enableScrolling");
    if (enableScrolling == "true") {
        checkbox.checked = true;
        div.style.height = "350px";
    }
    else if (enableScrolling == "false"){
        checkbox.checked = false;
        div.style.height = "100%";
    }
    else {
        setCookie("enableScrolling", true);
    }

    newButton.appendChild(checkbox);
    p.appendChild(newButton);

    function setCookie(cname, cvalue) {
        const d = new Date();
        d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
})();