// ==UserScript==
// @name         VRChat Date Joined
// @namespace    https://x.com/Shion_BFV
// @version      2024-08-19
// @description  VRChatを始めた日を見れる
// @author       Hinata
// @match        https://vrchat.com/home/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vrchat.com
// @grant        GM.xmlHttpRequest
// @license      WTFPL
// @homepageURL  https://greasyfork.org/ja/scripts/504378-vrchat-date-joined
// @downloadURL https://update.greasyfork.org/scripts/504378/VRChat%20Date%20Joined.user.js
// @updateURL https://update.greasyfork.org/scripts/504378/VRChat%20Date%20Joined.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var id = location.href.replace('https://vrchat.com/home/user/', '');
    var parsedResponce;
    GM.xmlHttpRequest({
        method: 'GET',
        url: 'https://vrchat.com/api/1/users/' + id,
        onload: function (response) {
            console.log("got response.");
            const obj = JSON.parse(response.responseText);
            console.log(obj["date_joined"]);
            addCopyButton("VRChatを始めた日 " + obj["date_joined"]);

        }
    });

	function addCopyButton(text) {
		const button = document.createElement("button");
		button.innerText = text;
		button.classList.add("date_joined");
		button.style.background = "transparent";
		button.style.color = '#ffffff';
		button.style.borderRadius = '0px';
		button.style.padding = '10px 15px';
		button.style.border = 'none';
		button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
		button.style.cursor = 'pointer';
		button.style.position = 'fixed';
		button.style.top = '60px';
		button.style.left = '0px';
		button.style.zIndex = '1000';
		document.body.appendChild(button);
	}
})();