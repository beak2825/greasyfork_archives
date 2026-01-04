// ==UserScript==
// @name         DAM - Assist
// @namespace    dekleinekobini.dam.assist
// @version      1.0
// @description  Send an assist request to the DAM discord.
// @author       DeKleineKobini [2114440]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/423858/DAM%20-%20Assist.user.js
// @updateURL https://update.greasyfork.org/scripts/423858/DAM%20-%20Assist.meta.js
// ==/UserScript==

const REQUEST_URL = "http://74.91.23.35:8080/api/assist";

GM_addStyle(`
    h4[class*="title___"] {
        flex: 1;
        display: flex;
        justify-content: space-between;    
        align-items: center;
    }

    #dam-container {
        margin-right: 4px;
    }
    
    .dam-text {
        font-size: 16px;
    }

    .dam-request {
        margin-left: 4px;
        height: 25px;
        background: #ddd;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 16px;
        cursor: pointer;
    }
    
    .dam-request:hover {
        color: #555;
        box-shadow: 0 0 5px #888;
    }
    
    #dam-message {
        position: absolute;
        max-width: 260px;
        display: none;
        font-size: 10px;
        margin-top: -2px;
    }
    
    #dam-message.error {
        display: block;
        color: red;
    }
    
    #dam-message.success {
        display: block;
        color: green;
    }
    
    #dam-message.warning {
        display: block;
        color: orange;
    }
`);

(function () {
    "use strict";

    const container = $("<div id='dam-container'></div>").appendTo("#react-root h4");

    const wrapper = $("<div><span class='dam-text'>Assist: </span></div>").appendTo(container);
    const alertText = $("<span id='dam-message'></span>").appendTo(container);

    for (const amount of [1, 2, 3]) {
        $(`<span class="dam-request">${amount}</span>`).appendTo(wrapper).click(() => requestAssist(amount));
    }

    function requestAssist(amount) {
        const target = new URLSearchParams(location.search).get("user2ID");
        const script = $("script[src*='/js/chat/chat']");
        const requester = `${script.attr("name")} [${script.attr("uid")}]`;

        GM_xmlhttpRequest({
            method: "POST",
            url: REQUEST_URL,
            data: JSON.stringify({target, amount, requester}),
            headers: {"Content-Type": "application/json"},
            onload: (response) => {
                switch (response.status) {
                    case 200:
                        setMessage("success", "Assist requested!");
                        break;
                    case 500:
                        setMessage("error", "Something went wrong.");
                        break;
                    default:
                        setMessage("warning", "Unknown response.");
                        break;
                }
            },
            ontimeout: () => setMessage("error", "Request has timed out."),
            onerror: () => setMessage("error", "Unknown error has occurred when trying to send the data."),
            onabort: () => setMessage("error", "Upon sending the data, the request was canceled.")
        });
    }

    function setMessage(type, message) {
        alertText
            .text(message)
            .attr("class", type);
        setTimeout(() => {
            alertText
                .text("")
                .attr("class", "");
        }, 5000);
    }
})();