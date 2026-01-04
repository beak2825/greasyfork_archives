// ==UserScript==
// @name          Doubleclick for react
// @description   Adds reaction on double click
// @namespace     https://github.com/magnus-cosmos
// @version       1.5
// @match         https://discord.com/*
// @grant         none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/442449/Doubleclick%20for%20react.user.js
// @updateURL https://update.greasyfork.org/scripts/442449/Doubleclick%20for%20react.meta.js
// ==/UserScript==

const css = `
img {
    user-select: none;
}
`;
const styles = document.createElement("style");
styles.type = "text/css";
if (styles.stylesheet) {
    styles.styleSheet.cssText = css;
} else {
    styles.appendChild(document.createTextNode(css));
}
document.head.appendChild(styles);

function reqUntilOk(url, options) {
    fetch(url, options).then(res => {
       if (!res.ok) {
           reqUntilOk(url, options);
       }
    });
}

(function() {
    'use strict';
    window.localStorage = document.body.appendChild(document.createElement("iframe")).contentWindow.localStorage;
    document.addEventListener("dblclick", function (e) {
        const elClass = e.target.className;
		const isText = elClass.startsWith("embedAuthorName") || elClass.startsWith("embedDescription");
		if (isText) {
			return;
		}
        const messageDiv = e.target.closest("li > [class^=message]");
		if (!messageDiv) {
			return;
        }
        let reaction = "gup:759890567152533526";
        const msgId = messageDiv.querySelector("div[id^='message-accessories']").id.split("-")[2];
        const [_, guildId, channelId] = location.href.match(/channels\/([\w@]+)\/(\d+)/);
        const url = `https://discord.com/api/v9/channels/${channelId}/messages/${msgId}/reactions/${encodeURI(reaction)}/%40me`;
        const options = {
            method: "PUT",
            credentials: "include",
            headers: {
                Authorization: JSON.parse(localStorage.token)
            }
        };
        reqUntilOk(url, options);
    });
})();