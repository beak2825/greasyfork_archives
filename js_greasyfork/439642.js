// ==UserScript==
// @name         Steam Group Joiner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Join Steam Groups
// @author       Floyd CF
// @include      https://steamcommunity.com/groups/*
// @match        https://steamcommunity.com/search/*
// @icon         https://media.giphy.com/media/UrVpkWKzCRXg59L4Sp/giphy.gif
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439642/Steam%20Group%20Joiner.user.js
// @updateURL https://update.greasyfork.org/scripts/439642/Steam%20Group%20Joiner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function() {
    CommunitySearch.NextPage()}, 15000);
    window.focus();

    setTimeout(function() {
        document.location.reload(true)
        window.focus();}, 17000);

    setTimeout(function() {
        //Opening the group tabs
        let groups = document.getElementsByClassName('searchPersonaInfo');

        let linkArray = [];

        for (let i = 0; i < groups.length; i++) {
            linkArray.push(groups[i].childNodes[1].firstElementChild.href);
            //console.log(linkArray[i]);
        }

        for (let j = 0; j < groups.length; j++) {
            window.open(linkArray[j]);

        }
    }, 3000);

    //Joining the group and checking if the button is still there
    //(if it isn't it means we joined the group and we close the page)
    function checkFlag() {
        if(document.getElementsByClassName('btn_green_white_innerfade btn_medium').length === 2) {
            javascript:document.forms['join_group_form'].submit();
            window.setTimeout(checkFlag, 300);
        } else {
            window.close();
        }
    }
    checkFlag();

})();