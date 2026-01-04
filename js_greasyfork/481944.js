// ==UserScript==
// @name         Status Text Changer
// @description  Change your discord status text every 5 secounds in a loop (Works as of 12/11/2023)
// @author       Dottto
// @match        https://discord.com/*
// @version       1.0
// @icon         https://cdn.glitch.global/d951fdf6-dc48-44b1-9653-d75b3dce6eed/DotPFP.png
// @namespace https://greasyfork.org/users/845356
// @downloadURL https://update.greasyfork.org/scripts/481944/Status%20Text%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/481944/Status%20Text%20Changer.meta.js
// ==/UserScript==

const LoopSpeed = 5000, // milliseconds
      LoopStatusIcon = false,
      StatusTexts = [
          "Dot is Hot",
          "Dot can code?",
          "Is this changing or are u crazy?",
          "Dot!?",
          "Is that a Dot?",
          "Who tf is this Dot guy?",
          "Dot; WOW",
          "Im board- with Dot!",
          "Dot the bot is hot..",
      ];

function ChangeStatus(index, i) {
    const token = eval("(webpackChunkdiscord_app.push([[``],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()"),
          text = StatusTexts[index],
          statusType = ["online", "idle", "invisible", "dnd"][LoopStatusIcon ? i : 3],
          json = {"custom_status": {"text": text}};

    if (LoopStatusIcon) {
        json.status = statusType;
    }

    fetch("https://discord.com/api/v9/users/@me/settings", {
        "headers": {
            "accept": "*/*",
            "authorization": token,
            "content-type": "application/json",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
        },
        "referrer": window.location.href,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify(json),
        "method": "PATCH",
        "mode": "cors",
        "credentials": "include"
    }).then((response) => {
        return response.ok;
    });
}

let i = [0, 0];
setInterval(() => {
    if (i[0] >= StatusTexts.length) i[0] = 0
    if (i[1] >= 4) i[1] = 0;

    ChangeStatus(i[0], i[1]);
    i[0]++, i[1]++;
}, LoopSpeed);