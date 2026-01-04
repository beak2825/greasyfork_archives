// ==UserScript==
// @name         Steam group ban
// @namespace    https://greasyfork.org/users/2205
// @version      0.3
// @description  Ban members from group management page
// @author       Rudokhvist
// @match        https://steamcommunity.com/groups/*/membersManage*
// @license      Apache-2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418760/Steam%20group%20ban.user.js
// @updateURL https://update.greasyfork.org/scripts/418760/Steam%20group%20ban.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getPartner(str) {
        if (typeof(BigInt)!=="undefined") {
            return (BigInt(str) % BigInt(4294967296)).toString(); // eslint-disable-line
        } else {
            let result = 0;
            for (let i = 0; i < str.length; i++) {
                result = (result * 10 + Number(str[i])) % 4294967296;
            }
            return result;
        }
    }

    function BanEventHandler(event) {
        Forum_BanOrWarnUser(getPartner(g_strBaseEditURL.split("=")[1]), -1, -1, -1, getPartner(event.target.dataset.steamid), 0); // eslint-disable-line
    }

    function updateButtons(elements){
        let kickbuttons = elements.getElementsByClassName("officerIcon manageMemberAction");
        const regex = /ManageMembers_Kick\(\s*'(\d+)',\s*'(.+)'\s\);/;
        for (let index=0; index<kickbuttons.length; index++) {
            let results = kickbuttons[index].outerHTML.match(regex);
            if (results!==null){
                let buttonDiv = document.createElement("div");
                buttonDiv.setAttribute("class", "manageMemberAction");
                buttonDiv.setAttribute("style", "display: inline-block;background-color: rgba( 0, 0, 0, 0.4 );border-radius: 9px;width: 21px;line-height: 21px;margin-right: 3px;vertical-align: middle;");
                buttonDiv.setAttribute("data-steamid", results[1]);
                buttonDiv.setAttribute("data-username", results[2]);
                buttonDiv.appendChild(document.createTextNode("⛔"));
                let insertedNode = kickbuttons[index].parentElement.insertBefore(buttonDiv, kickbuttons[index]);
                insertedNode.addEventListener("click", BanEventHandler);
            }
        }
    }
    let script = document.createElement("script");
    script.setAttribute("src","https://community.cloudflare.steamstatic.com/public/javascript/forums.js");
    document.head.appendChild(script);
    updateButtons(document.documentElement);

})();