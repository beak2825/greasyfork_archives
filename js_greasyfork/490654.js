// ==UserScript==
// @name         Laniservaaja button
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Lisää helposti kappale Laniservaajaan.
// @author       Ziticca
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/490654/Laniservaaja%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/490654/Laniservaaja%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const styles = `
        .lani-servaaja-button {
            position: absolute;
            visibility: hidden;
            top: 1rem;
            left: 10vw;
            border: 1px solid #ff0000;
            background-color: #ffffff;
            color: #ff0000;
            font-size: 2rem;
            font-weight: bold;
            font-family: "Comic Sans";
            line-height: 2rem;
            padding: 8px;
            z-index: 9000000;
            box-shadow: 0 4px 8px 0 rgba(255,0,0,0.2), 0 4px 8px 0 rgba(255,0,0,0.19);
        }
`;
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    if (isTampermonkeyEnabled){
        GM_addStyle(styles);
    }

    let hideButton = false;
    var lSButton = document.createElement("button");
    setInterval(() => {
        if (!unsafeWindow.location.href.includes("watch?v=")) {
            hideButton = true;
            lSButton.style.visibility = "hidden";
        } else {
            hideButton = false;
            lSButton.style.visibility = "visible";
        }
    }, 500);

    lSButton.classList = "lani-servaaja-button";
    lSButton.innerHTML = "Paina tästä jos siltä tuntuu";

    lSButton.addEventListener("click", () => {
        lSButton.innerHTML = "Odotetaan laniservaajaa&#8482;&copy;"
        try {
            GM.xmlHttpRequest({
                method: "PUT",
                url: "http://192.168.100.148:60666/api/add_to_playlist",
                data: unsafeWindow.location.href,
                onload: function(response) {
                    if (response.status === 200) {
                        lSButton.innerHTML = "Laniservaajalle&#8482;&copy; oli OK"
                    } else {
                        lSButton.innerHTML = "Laniservaaja&#8482;&copy; ei tykännyt :("
                    }
                    console.log("Response");
                    console.log(response);
                    setTimeout(() => {
                        lSButton.innerHTML = "Paina tästä jos siltä tuntuu"
                    }, 3000);
                },
                onerror: function(error) {
                    lSButton.innerHTML = "Laniservaaja&#8482;&copy; ei tykännyt :("
                    console.log("Error");
                    console.log(error);
                    setTimeout(() => {
                        lSButton.innerHTML = "Paina tästä jos siltä tuntuu"
                    }, 3000);
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    });
    document.querySelector("body").appendChild(lSButton);
    // Your code here...
})();