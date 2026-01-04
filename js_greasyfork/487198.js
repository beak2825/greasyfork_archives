// ==UserScript==
// @name         ATCAddon for GEOFS
// @namespace    http://tampermonkey.net/
// @version      2024-02-13
// @description  try to take over the world!
// @author       You
// @match        https://www.geo-fs.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487198/ATCAddon%20for%20GEOFS.user.js
// @updateURL https://update.greasyfork.org/scripts/487198/ATCAddon%20for%20GEOFS.meta.js
// ==/UserScript==

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

if(window.location.pathname === "/pages/map.php") {

    window.ATCADDON = {};

    window.ATCADDON.chat = [];

    function toElement(string) {
        var div = document.createElement('div');
        div.innerHTML = string.trim();
        return div.firstChild;
    }

    async function updateATC() {
        var b = Date.now();
        multiplayer.lastRequestTime = b;
        var g = {
            acid: geofs.userRecord.id,
            sid: geofs.userRecord.sessionId,
            id: multiplayer.myId,
            ac: 1,
            co: [33.936952715460784,-118.38498159830658,45.20037842951751,141.2313037411972,-15,0],
            ve: [0,-1.4210854715202004e-17,9.835858350015769e-11,0,0,0],
            st: {gr: true, as: 0},
            ti: multiplayer.getServerTime(),
            m: multiplayer.chatMessage,
            ci: multiplayer.chatMessageId
        };
        multiplayer.chatMessage && (multiplayer.chatMessage = "");
        multiplayer.lastRequest = await geofs.ajax.post(geofs.multiplayerHost + "/update", g, multiplayer.updateCallback, multiplayer.errorCallback)

        window.ATCADDON.chat = [...ATCADDON.chat, ...multiplayer.lastRequest.chatMessages];
        multiplayer.lastRequest.chatMessages.forEach(e => {

            const box = document.getElementById("atc-box");
            var checkmsg = decodeURIComponent(e.msg).match(/(?<=\[)(?:1[1-3]\d\.\d{1,3})(?=\])/);

            if(e.acid == geofs.userRecord.id){

                box.insertAdjacentElement("afterbegin", toElement('<div class="chat-msg-self" style="color: #06F;">'+`<b>${
                    decodeURIComponent(e.cs)
                }:</b> ${
                    decodeURIComponent(e.msg).replace(/(?:\[1[1-3]\d\.\d{1,3}\])/g, "")
                }`+'<br></div>'));

            } else if(checkmsg && checkmsg[0]==window.ATCADDON.frequency) {

                box.insertAdjacentElement("afterbegin", toElement('<div class="chat-msg-self" style="color: #F70;">'+`<b>${
                    decodeURIComponent(e.cs)
                }:</b> ${
                    decodeURIComponent(e.msg).replace(/(?:\[1[1-3]\d\.\d{1,3}\])/g, "")
                }`+'<br></div>'));

            } else if(e.acid !=898455 && (document.querySelector("#atc-only").checked)==false) {

                box.insertAdjacentElement("afterbegin", toElement('<div class="chat-msg-other">'+`<b>${
                    decodeURIComponent(e.cs)
                }:</b> ${
                    decodeURIComponent(e.msg).replace(/(?:\[1[1-3]\d\.\d{1,3}\])/g, "")
                }`+'<br></div>'));
            }

        });
    }

    async function runUpdates() {

        while(true) {

            await updateATC();
            await sleep(1000);

        }

    }

    function initATCADDON() {

        geofs.map.toggleATCMode();

        const ATCBox = document.createElement("div");
        const ATCForm = document.createElement("form");
        const ATCInput = document.createElement("input");
        const ATCFreq = document.createElement("input");
        const ATCOnly = document.createElement("div");
        ATCBox.setAttribute("id","atc-box");
        ATCBox.setAttribute("style", `

            position: absolute;
            top: 170px;
            left: 10px;
            z-index: 1000;
            font-weight: normal;
            overflow: hidden;
            text-align: left;
            color: #DDD;
            font-family: Arial, sans-serif;
            font-size: 12px;
            padding: 0px 0px;
            padding-left: 5px;
            line-height: 29px;
            background-color: #0000007F;
            border: 1px solid rgb(169, 187, 223);
            width: 40%;
            height: 75%;
            box-shadow: 0px 5px 30px #666;

        `);
        ATCForm.setAttribute("id","atc-form");
        ATCInput.setAttribute("id","atc-input");
        ATCInput.setAttribute("style", `

            position: absolute;
            top: 130px;
            left: 10px;
            z-index: 1000;
            font-weight: bold;
            overflow: hidden;
            text-align: left;
            color: #DDD;
            font-family: Arial, sans-serif;
            font-size: 12px;
            padding: 0px 0px;
            padding-left: 5px;
            line-height: 29px;
            background-color: #0000007F;
            border: 1px solid rgb(169, 187, 223);
            width: 40%;
            height: 30px;
            box-shadow: 0px 5px 30px #666;

        `);
        ATCInput.setAttribute("placeholder", "Send Message...");
        ATCFreq.setAttribute("id","atc-frequency");
        ATCFreq.setAttribute("style", `

            position: absolute;
            top: 90px;
            left: 50px;
            z-index: 1000;
            font-weight: bold;
            overflow: hidden;
            text-align: left;
            color: #DDD;
            font-family: Arial, sans-serif;
            font-size: 12px;
            padding: 0px 0px;
            padding-left: 5px;
            line-height: 29px;
            background-color: #0000007F;
            border: 1px solid rgb(169, 187, 223);
            width: 15%;
            height: 30px;
            box-shadow: 0px 5px 30px #666;

        `);
        ATCFreq.setAttribute("placeholder", "Frequency");
        ATCFreq.setAttribute("type", "number");
        ATCFreq.setAttribute("min", "118");
        ATCFreq.setAttribute("max", "137");
        ATCFreq.setAttribute("step", "0.001");
        ATCOnly.setAttribute("style", `

            position: absolute;
            top: 90px;
            left: 10px;
            z-index: 1000;
            font-weight: bold;
            overflow: hidden;
            text-align: left;
            color: #DDD;
            font-family: Arial, sans-serif;
            font-size: 12px;
            padding: 0px 0px;
            line-height: 29px;
            background-color: #0000007F;
            border: 1px solid rgb(169, 187, 223);
            width: 30px;
            height: 30px;
            box-shadow: 0px 5px 30px #666;

        `);
        ATCOnly.innerHTML = `<input id="atc-only" type="checkbox" style="width:75%;height:75%;position:relative;">`;
        ATCForm.appendChild(ATCInput);
        document.body.appendChild(ATCBox);
        document.body.appendChild(ATCForm);
        document.body.appendChild(ATCFreq);
        document.body.appendChild(ATCOnly);

        ATCForm.addEventListener("submit", (e)=>{
            e.preventDefault();
            const input = document.getElementById("atc-input");
            const frequency = document.getElementById("atc-frequency");
            window.ATCADDON.frequency = frequency.value;
            if(window.ATCADDON.frequency && /(?:1[1-3]\d\.\d{1,3})/.test(window.ATCADDON.frequency)) {
                multiplayer.setChatMessage(input.value + ` [${window.ATCADDON.frequency}]`);
            } else {
                multiplayer.setChatMessage(input.value);
            }
            input.value = "";
        });

        runUpdates();

    }

    initATCADDON();
} else if(window.location.pathname === "/geofs.php") {

        const topbar = document.querySelector(".geofs-ui-top");

        const frequency = document.createElement("div");
        frequency.setAttribute("class", "atcaddon-frequency");
        frequency.setAttribute("style", `

            opacity: 0.5;
            margin-top: 5px;
            white-space: nowrap;
            display: flex;

        `);
        frequency.innerHTML = `

            <input id="Frequency" type="number" min="118" max="137" step="0.001" style="left: 10px; top: 0px; border: 1px solid #888;background-color: #000;box-shadow: 0px 0px 5px #000;cursor: pointer !important;width: 90px;height: 25px;border-radius: 15px;outline: none;line-height: 27px;white-space: nowrap; color: white; padding: 5px, 0px;" placeholder="Input Frequency">

        `;

        topbar.appendChild(frequency);

        const stylesheet = document.createElement("style");
        stylesheet.innerHTML = `
            .geofs-chat-message .label.atc {
                color: rgb(255,128,0);
                cursor: auto;
            }
        `;
        document.head.appendChild(stylesheet);

        (async()=>{

            await sleep(5000);

            ui.chat.publish = function(a) {
                var b = decodeURIComponent(a.msg);
                var checkmsg = b.match(/(?<=\[)(?:1[1-3]\d\.\d{1,3})(?=\])/);
                var check = (checkmsg && checkmsg[0]==`${document.querySelector("#Frequency").value}`);
                if (geofs.preferences.chat && (check || !document.querySelector("#Frequency").value)) {
                    ui.chat.$container = ui.chat.$container || $(".geofs-chat-messages");
                    var c = "";
                    check && (c = "atc")
                    b=b.replace(/(?:\[1[1-3]\d\.\d{1,3}\])/g, "")
                    a.acid == geofs.userRecord.id && (c = "myself");
                    ui.chat.$container.prepend('<div class="geofs-chat-message ' + a.cls + '"><b class="label ' + c + '" data-player="' + a.uid + '" acid="' + a.acid + '" callsign="' + a.cs + '">' + a.cs + ":</b> " + b + "</div>");
                    ui.chat.$container.find(".geofs-chat-message").each(function(d, e) {
                        $(e).css("opacity", (ui.chat.maxNumberMessages - d) / ui.chat.maxNumberMessages)
                    }).eq(ui.chat.maxNumberMessages).remove()
                }
            }

            multiplayer.setChatMessage = function(a) {
                const freq = document.querySelector("#Frequency").value;
                if(freq && /(?:1[1-3]\d\.\d{1,3})/.test(freq)) {
                    multiplayer.chatMessage = a + ` [${freq}]`;
                } else {
                    multiplayer.chatMessage = a;
                }
            }

        })();

}