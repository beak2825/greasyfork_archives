// ==UserScript==
// @name         Party link Copier (Outdated) - Diep.io
// @version      1.1.2
// @description  (Outdated) [ Press Ctrl + C to copy link ] Gets and logs the party link to the console, this script is mostly a heavily modified and stripped down version of DiepTool
// @author       Cazka, diep.io#7444 and CX's code, modified by Excigma to carry out a different function
// @namespace    https://greasyfork.org/users/416480
// @match        https://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406662/Party%20link%20Copier%20%28Outdated%29%20-%20Diepio.user.js
// @updateURL https://update.greasyfork.org/scripts/406662/Party%20link%20Copier%20%28Outdated%29%20-%20Diepio.meta.js
// ==/UserScript==

// Note: This will/may not work with other scripts that hijack the websocket.

// Most of this script is from other sources, and is NOT written by me. They are marked.
// My own code is minimal, as I said MOST of the script is from other people's work.
// This is mostly just reusing other people's code and changing/simplifying it for another purpose.


// What changed?
// [1.1.2] Script no longer works, and perhaps will never work. Ever again.
// [1.1.1] Fixed copying the link for party (It would copy the party link for the server, not your team)
// [1.1.0] Fixed script copying the 2tdm/4tdm link when you play 2tdm/4tdm, and move to ffa
//       - Trigger "Copy Party Link" button for all gamemodes
//       - Credits to diep.io#7444, and his praiseYOGA! script for the above.
// [1.0.1] Add more comments and credits, fixed not connecting.
// [1.0.0] Initial release


(function () {
    'use strict';

    // Set the hotkey for copying the link
    // Ctrl + TheKeyBelow
    const KEY_COPY = "c"




    // Most of this script's code is from (an older version of) DiepTool, written by Cazka
    // unless marked otherwise

    // It can be found here: https://greasyfork.org/en/scripts/401910-diep-io-tool

    const wsInstances = new Set()

    // Lines of code written by Excigma
    let partyLink;
    let serverURL;
    // End lines of code written by Excigma



    // Written by Excigma
    document.addEventListener("keydown", (event) => {
        // If you don't want to press Ctrl, and only want to press 1 key, say f
        // Remove && event.ctrlKey
        // Set KEY_COPY to f

        if (event.key.toLowerCase() == KEY_COPY && event.ctrlKey) {
            copy(partyLink)
            console.log(`Party link: ${partyLink}`)
        }
    })


    // Cazka's code from DiepTool
    window.WebSocket.prototype._send = window.WebSocket.prototype.send
    window.WebSocket.prototype.send = function (data) {
        this._send(data)

        // Still Cazka's code from DiepTool
        if (this.url.match(/s.m28n.net/)) {
            if (!wsInstances.has(this)) {
                wsInstances.add(this)

                // Still Cazka's code from DiepTool
                this._onmessage = this.onmessage
                this.onmessage = function (event) {
                    this._onmessage(event)

                    // Still Cazka's code from DiepTool
                    const data = new Uint8Array(event.data)

                    // The next line is from diep.io#7444's praiseYOGA! script.
                    if (data[0] == 4 && serverURL !== this.url) this.onmessage({data: [6]})
                    else if (data[0] == 6) {
                        serverURL = this.url

                        let party = ''
                        for (let i = 1; i < data.byteLength; i++) {
                            let byte = data[i].toString(16).split('')
                            if (byte.length === 1) {
                                party += (byte[0] + '0')
                            } else {
                                party += (byte[1] + byte[0])
                            }
                        }


                        // Lines of code written by Excigma
                        partyLink = getLink(this.url, party)
                        console.log(`Party: ${party}`)
                        console.log(`Server URL: ${this.url}`)
                        console.log(`Server link: ${getLink(this.url)}`)
                        console.log(`Party link: ${partyLink}`)
                        // End lines of code written by Excigma
                    }
                    // ...Other code irrelevant for the function of this script has been removed/shortened
                }
            }
        }
    }
    // End of code from DiepTool

    // This is found from DiepSocket, also written by Cazka

    // This code resembles code by CX though may not be
    // The code carries out the same functions so maybe closely resemble other people's code, even different people have written it
    // Similar code: https://github.com/cx88/diepssect/blob/master/diep-bot/main.js#L341

    function getLink(wsURL, party = '') {
        const match = wsURL.match(/(?<=wss:\/\/).[0-9a-z]{3}(?=.s.m28n.net\/)|^[0-9a-z]{4}$/)
        if (!match) throw new Error('Invalid wsURL: wrong format:', wsURL)
        let serverid = match[0]
        const link = 'https://diep.io/#'
        serverid = serverid
            .split('')
            .map(char =>
                 char
                 .charCodeAt(0)
                 .toString(16)
                 .split('')
                 .reverse()
                 .join('')
                )
            .join('')
        return link + (serverid + '00' + party).toUpperCase()
    }


    // I'm honestly tired, I know I can do this myself but why when I have stackoverflow..
    // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript

    function copy(text) {
        let textArea = document.createElement("textarea");
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch(er) {
            // ahah get it?
            // This should never happen though
        }

        document.body.removeChild(textArea);
    }
})();