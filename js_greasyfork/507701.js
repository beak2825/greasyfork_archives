// ==UserScript==
// @name         XP  Involker
// @namespace    https://greasyfork.org/en/scripts/507701-xp-involker
// @version      1.75
// @description  XP Free
// @author       MrBonkeiro
// @match        https://bonk.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507701/XP%20%20Involker.user.js
// @updateURL https://update.greasyfork.org/scripts/507701/XP%20%20Involker.meta.js
// ==/UserScript==

function getBonk() {
    const iframe = document.getElementById('maingameframe');
    if (!iframe) {
        console.error('[MrMenu] Iframe not found');
        return null;
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc) {
        console.error('[MrMenu] Iframe document not found');
        return null;
    }

    return iframeDoc;
}

function addHTML(htmlString, selector, beforeSelector = null)
{
    const bonkDoc = getBonk();
    const targetElement = bonkDoc.querySelector(selector);
    if (!targetElement) { return; }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const newElements = Array.from(doc.body.childNodes);

    if (beforeSelector) {
        const beforeElement = bonkDoc.querySelector(beforeSelector);
        if (!beforeElement) { return; }
        newElements.forEach(node => {
            beforeElement.parentNode.insertBefore(node, beforeElement);
        });
    } else {
        newElements.forEach(node => {
            targetElement.appendChild(node);
        });
    }
}
function isRoom() {
    const bonkDoc = getBonk();
    if (!bonkDoc) return false;

    const element = bonkDoc.getElementById('gamerenderer');
    if (element) {
        return window.getComputedStyle(element).visibility === 'inherit';
    }

    return false;
}

function Init() {
  
    addHTML(`<div style="background-color: #1f1f1f; display: flex; position: absolute; top: 50%; left: 50%; width: 85%; height: 85%; transform: translate(-50%, -50%); flex-direction: column; align-items: flex-start; padding: 10px;">
    <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <img src="https://bonk.io/graphics/flags/us.png" alt="Imagem 1" style="width: 40px; height: 32px;">
        <label style="color: white; margin-left: 10px;">Download new version XP Involker no MrMenu and remove XP Involker old</label>
    </div>
    <div style="display: flex; align-items: center; margin-bottom: 10px;">
        <img src="https://bonk.io/graphics/flags/br.png" alt="Imagem 2" style="width: 40px; height: 32px;">
        <label style="color: white; margin-left: 10px;">Baixe nova versão do XP Involker in MrMenu e remova está versão velha do XP Involker</label>
    </div>
    <div style="margin-top: 10px;">
        <a href="https://greasyfork.org/en/scripts/504571-mrmenu/code" target="_blank" style="color: white; text-decoration: none;">Download</a>
    </div>
</div>
`, '#bonkiocontainer');
    let getWS;
    let timer = null;
    let deletePressed = false;

    function XP()
    {
         if (isRoom && getWS != null) { getWS.send('42[38]');}

    }

    function handleDeleteKey(event) {
      if (event.key === "Delete"|| event.key === "L" || event.key === "l") {
        if (!deletePressed) {
          deletePressed = true;
          timer = setInterval(XP, 6000);
          getBonk().getElementById('xpbarfill').style.backgroundColor = 'lightgreen';
        } else {
          clearInterval(timer);
          deletePressed = false;
          getBonk().getElementById('xpbarfill').style.backgroundColor = '#473aaf';

        }
      }
    }

    getBonk().addEventListener("keydown", handleDeleteKey);

    const originalSend = getBonk().defaultView.WebSocket.prototype.send;
    getBonk().defaultView.WebSocket.prototype.send = function (...args) {
        if (this.url.includes('socket.io')) {
            getWS = this;

            const originalOnMessage = this.onmessage;
            this.onmessage = function (msg) {
                return originalOnMessage.call(this, msg);
            };

            const originalOnClose = this.onclose;
            this.onclose = function () {
                getWS = null;
                return originalOnClose.call(this);
            };
        }

        return originalSend.apply(this, args);
    };
}

function ScriptInjector(f) {
    if (window.location === window.parent.location) {
        if (document.readyState === 'complete') {
            setTimeout(f, 1200);
        } else {
            document.addEventListener('readystatechange', function () {
                setTimeout(f, 3500);
            });
        }
    }
}


ScriptInjector(Init);