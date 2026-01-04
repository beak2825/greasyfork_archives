// ==UserScript==
// @name        Eval Script
// @namespace   Wolfy0615
// @match       https://mppclone.com/*
// @match       https://multiplayerpiano.com/*
// @grant       none
// @version     1.4
// @author      Wolfy0615
// @require     https://greasyfork.org/scripts/450595-utilinspectforbrowser/code/UtilInspectForBrowser.js
// @description 8/28/2022, 8:19:50 PM
// @downloadURL https://update.greasyfork.org/scripts/452418/Eval%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/452418/Eval%20Script.meta.js
// ==/UserScript==

function handleMessage(msg) {
    let client = MPP.client;
    let token = localStorage.token;
    if (client) {
        if (msg.a.startsWith("<>") && msg.p._id == client.getOwnParticipant()._id) {
            try {
                let localStorage = {};
                window.localStorage = {};
                let evaled = eval(msg.a.substring(1).trim());
                client.sendArray([{
                    m: 'a',
                    message: `✔woohoo it worked ${typeof evaled} ${window.inspect(evaled)}`.substring(0, 512).replaceAll(token, "[REDACTED]").replaceAll("\n", " ")
                }])
            } catch (err) {
                if (err) {
                    client.sendArray([{
                        m: 'a',
                        message: `lmao didnt work ${typeof err} ${err}`
                    }]);
                }
            }
        }
    }
}
 
function init() {
    MPP.client.on("a", msg => { handleMessage(msg); });
}
 
const checkInterval = setInterval(() => {
    if (window.MPP) {
        clearInterval(checkInterval);
        init();
    }
}, 200);