// ==UserScript==
// @name         Faction Page Attack Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Attack button
// @author       MeRocks
// @match        https://www.torn.com/factions.php?step=profile*
// @downloadURL https://update.greasyfork.org/scripts/396416/Faction%20Page%20Attack%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/396416/Faction%20Page%20Attack%20Button.meta.js
// ==/UserScript==

//gets list of members
    const memberList = document.querySelectorAll('div.member.icons');


    for(const member of memberList) {
       var test = member.childNodes;
        var profileLinkElem = (test[4].childNodes)[1]; 
        var profileLink = profileLinkElem.href; //link to player profile
        var profileId = profileLink.substr(profileLink.indexOf("=") + 1); //gets player id

        var newNode = document.createElement('a'); //creates attack button
        newNode.setAttribute('href',"/loader.php?sid=attack&user2ID="+profileId);
        newNode.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;Attack";
        newNode.setAttribute("style", "color: red;vertical-align: middle;margin-left:10px");

        profileLinkElem.after(newNode);

    }

