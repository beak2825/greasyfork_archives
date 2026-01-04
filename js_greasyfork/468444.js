// ==UserScript==
// @name         wwwgpt
// @version      1.0
// @description  Adds GPT to every website
// @author       underscore#5239
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      openai.com
// @license      MIT
// @namespace    underscore
// @downloadURL https://update.greasyfork.org/scripts/468444/wwwgpt.user.js
// @updateURL https://update.greasyfork.org/scripts/468444/wwwgpt.meta.js
// ==/UserScript==

function setup() {
    var key = window.prompt("Enter OpenAI APi key");
    var endpoint = window.prompt("Enter APi Endpoint. Use an empty value for default endpoint");
    if (endpoint == null) {
        GM_setValue("endpoint", "https://api.openai.com/v1");

    }
    else if (endpoint == "") {
        GM_setValue("endpoint", "https://api.openai.com/v1");
    }
    else {
        GM_setValue("endpoint", endpoint);
    }
    GM_setValue("key", key);

}

function addButton(element) {
    var button = document.createElement('button');
    button.innerHTML = 'Modify Text';
    button.onclick = function() {
        var p = window.prompt("Enter instructions to modify text");
        if (p == null) {
                return;
        }
        var m = `Text: ${element.value}\nInstructions: ${p}`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GM_getValue("key")}`
        };

        const data = JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: "system", content: "You are an AI that edits text, youll recieve text and youll reply with only the modified text, according to the instructions" }, { role: 'user', content: m }]
        });

        GM_xmlhttpRequest({
            method: 'POST',
            url: GM_getValue("endpoint") + "/chat/completions",
            headers: headers,
            data: data,
            onload: function (response) {
                const result = JSON.parse(response.responseText);
                element.value = result["choices"][0]["message"]["content"];
            },
            onerror: function (error) {
                window.alert('Error: ' + error);
            }
        });
    };
    element.parentNode.insertBefore(button, element.nextSibling);
}

function init() {
    var inputsAndTextareas = document.querySelectorAll('input, textarea');
    for (var i = 0; i < inputsAndTextareas.length; i++) {
        addButton(inputsAndTextareas[i]);
    }
}

var key = GM_getValue("key", null);
var endpoint = GM_getValue("endpoint", null);

if (key == null) {
    setup();
    key = GM_getValue("key");
    endpoint = GM_getValue("endpoint");
}

init();

var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.addedNodes.length > 0) {
            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i];
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
                        addButton(node);
                    } else {
                        var inputsAndTextareas = node.querySelectorAll('input, textarea');
                        for (var j = 0; j < inputsAndTextareas.length; j++) {
                            addButton(inputsAndTextareas[j]);
                        }
                    }
                }
            }
        }
    });
});

observer.observe(document.documentElement, { childList: true, subtree: true });