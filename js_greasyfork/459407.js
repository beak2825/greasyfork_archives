// ==UserScript==
// @name         Compose Help
// @license GNU GPLv3
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  compose assist from ai-compose
// @author       You
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant         GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/459407/Compose%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/459407/Compose%20Help.meta.js
// ==/UserScript==

const myHeaders = new Headers();
myHeaders.append("authority", "us-central1-compose-301318.cloudfunctions.net");
myHeaders.append("accept", "*/*");
myHeaders.append("accept-language", "ru-RU,ru;q=0.9,en;q=0.8,en-US;q=0.7,la;q=0.6,uk;q=0.5");
myHeaders.append("content-type", "application/json");
myHeaders.append("origin", "https://mail.google.com");
myHeaders.append("referer", "https://mail.google.com/");
myHeaders.append("sec-ch-ua", "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"");
myHeaders.append("sec-ch-ua-arch", "\"x86\"");
myHeaders.append("sec-ch-ua-bitness", "\"64\"");
myHeaders.append("sec-ch-ua-full-version", "\"109.0.5414.120\"");
myHeaders.append("sec-ch-ua-full-version-list", "\"Not_A Brand\";v=\"99.0.0.0\", \"Google Chrome\";v=\"109.0.5414.120\", \"Chromium\";v=\"109.0.5414.120\"");
myHeaders.append("sec-ch-ua-mobile", "?0");
myHeaders.append("sec-ch-ua-model", "");
myHeaders.append("sec-ch-ua-platform", "\"Windows\"");
myHeaders.append("sec-ch-ua-platform-version", "\"14.0.0\"");
myHeaders.append("sec-ch-ua-wow64", "?0");
myHeaders.append("sec-fetch-dest", "empty");
myHeaders.append("sec-fetch-mode", "cors");
myHeaders.append("sec-fetch-site", "cross-site");
myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36");


// @require     file://E:/projects/extensions/composeai/compose.js

(function () {
    'use strict';
    console.log("local file")
    let pastedContainer = false;
    let composeResult=""
// add event listener for key f
    document.addEventListener('keydown', function (event) {
        if (event.key == 'v' && event.altKey) {
            var selection = getSelectionText()
            addPopup()
        }
    }
    )
    // add event listener for drag end if there is selected text
    document.addEventListener('mouseup', function (event) {
        var selection = getSelectionText()
        if (selection) {
            moveContainer(tuneCoords(getSelectedTextCoords()))
            showContainer()
        }
        else {
            hideContainer()
        }
    }
    )

    document.addEventListener('mousedown', function () {
        if(pastedContainer) return
        createPopupContainer();
        pastedContainer = true;
    })
})();
function getSelectedTextCoords() {
    var sel = window.getSelection();
    if (sel.rangeCount) {
        var range = sel.getRangeAt(0);
        var rect = range.getBoundingClientRect();
        return {
            x: rect.left + window.scrollX,
            y: rect.top + window.scrollY,
            width: rect.width,
            height: rect.height
        };

    }
    return null;
}

function getSelectionNode() {
    var node = null;
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode) {
                node = range.commonAncestorContainer.parentNode;
            } else {
                node = range.commonAncestorContainer;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        node = sel.createRange().parentElement();
    }
    return node;
}

function getSelectionText() {
    return window.getSelection().toString()
}



function addButton(node, text, handler) {
    var button = document.createElement("button");
    button.innerHTML = text;
    button.style.border = '1px solid black';
    button.style.borderRadius = '5px';
    button.style.padding = '3px 5px';
    button.style.color = "black";
    button.addEventListener("click", handler);
    node.appendChild(button);
}

async function get( type,resultNode) {



    const raw = JSON.stringify({
        "data": {
            "name": "quick-reply-"+type,
            "params": {
                "original_email": getSelectionText()
            },
            "client": "compose-ai"
        }
    });

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    resultNode.innerHTML="Loading..."

    GM_xmlhttpRequest({
        method: 'POST',
        headers: myHeaders,
        data: raw,
        redirect: 'follow',
        // method: "GET",
        url: "https://us-central1-compose-301318.cloudfunctions.net/renderTemplate",
        headers: {
          "Content-Type": "application/json"
        },
        onload: function (response) {
            resultNode.innerHTML=JSON.parse(response.responseText).result
        }
      });


}

function createPopupContainer() {
    const popupContainer = document.createElement("div");
    popupContainer.className = "popup-container";
    popupContainer.id="popup-container";
    popupContainer.style.position = "absolute";
    popupContainer.style.background = "white";
    popupContainer.style.zIndex = 2147483647;
    popupContainer.style.left = "0px";
    popupContainer.style.top = "0px";
    popupContainer.style.width = "100px";
    popupContainer.style.height = "100px";
    popupContainer.style.color = "black";

    const resultNode = document.createElement("textarea");
    resultNode.innerHTML = "result";
    resultNode.id = "compose-result-area";
    resultNode.style.width = "100%";
    resultNode.style.height = "100px";
    popupContainer.appendChild(resultNode);

    // addButton(popupContainer, "Close", hideContainer);
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";

    buttonsContainer.style.display = "flex";
    buttonsContainer.style.justifyContent = "space-between";

    popupContainer.appendChild(buttonsContainer);

    addButton(buttonsContainer, "Yes", ()=>get("yes",resultNode));
    addButton(buttonsContainer, "No", ()=>get("no",resultNode));
    addButton(buttonsContainer, "Thanks", () => get("thanks", resultNode));
    addButton(buttonsContainer, "Copy", () => {
        const resultArea = document.getElementById("compose-result-area");
        resultArea.select();
        document.execCommand("copy");
    });


document.body.appendChild(popupContainer)
}

function moveContainer({
    x = 0,
    y = 0,
    width = 100,
    height=100
}) {

    const popupContainer = document.getElementById("popup-container");
    popupContainer.style.left = x + "px";
    popupContainer.style.top = y + "px";
    popupContainer.style.width = width + "px";
    popupContainer.style.height = "160px";
    popupContainer.style.minWidth = 'fit-content';

}
function showContainer() {
    const popupContainer = document.getElementById("popup-container");
    popupContainer.style.display = "block";
}
function hideContainer() {
    const popupContainer = document.getElementById("popup-container");
    popupContainer.style.display = "none";
}


// function that will tune coords for container with hight 160px in wievport
function tuneCoords(coords) {
    if (coords.y + 160 > window.innerHeight) {
        coords.y = coords.y - 160
    }
    return coords
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}