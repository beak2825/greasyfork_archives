// ==UserScript==
// @name        Kahoot Namerator and Name Length Bypass
// @author      slither
// @version     2.3.0
// @license     MIT
// @description Bypasses kahoot nickname generator as well as the maximum name length
// @match       https://kahoot.it/*
// @grant       none
// @run-at      document-start
// @namespace   https://greasyfork.org/users/964173
// @downloadURL https://update.greasyfork.org/scripts/452123/Kahoot%20Namerator%20and%20Name%20Length%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/452123/Kahoot%20Namerator%20and%20Name%20Length%20Bypass.meta.js
// ==/UserScript==

let nick = "";

const nativeSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function() {
    const oldCallback = this.onreadystatechange;

    this.onreadystatechange = function() {
        if (this.readyState === 4) {
            try {
                const response = JSON.parse(this.responseText);

                if (response.namerator === true)
                    response.namerator = false;

                Object.defineProperty(this, "responseText",{
                    writable: false,
                    configurable: true,
                    value: JSON.stringify(response)
                });
            } catch (e) {
                console.error(e);
            }
        }

        if (oldCallback)
            return oldCallback.apply(this, arguments);
    };

    return nativeSend.apply(this, arguments);
};

const nativeWebSocket = window.WebSocket;
window.WebSocket = function() {
    const ws = new nativeWebSocket(...arguments);
    const nativeSend = ws.send;

    ws.send = function() {
        const interceptedMessage = JSON.parse(arguments[0]);

        if (interceptedMessage[0] && interceptedMessage[0].data) {
            if (JSON.parse(interceptedMessage[0].data.content).usingNamerator === false)
                interceptedMessage[0].data.content = JSON.stringify({ ...JSON.parse(interceptedMessage[0].data.content), usingNamerator: true });

            if (nick && interceptedMessage[0].data.name) {
                interceptedMessage[0].data.name = nick;
                nick = "";
            }
        }

        return nativeSend.apply(this, [JSON.stringify(interceptedMessage)]);
    };

    return ws;
};

const nativePushState = history.pushState;
history.pushState = function() {
    const ret = nativePushState.apply(history, arguments);

    if (location.href.includes("kahoot.it/join")) {
        const observer = new MutationObserver(function() {
            if (document.getElementById("nickname")) {
                const input = document.createElement("input");
                const nickname = document.getElementById("nickname");
                const reactProps = Object.keys(nickname).find(v => v.includes("__reactProps"));
                input.className = nickname.className;
                input.type = "text";
                input.placeholder = "Nickname";
                nickname.replaceWith(input);

                input.nextElementSibling.addEventListener("click", function() {
                    nick = input.value;
                    nickname[reactProps].onChange({ target: { value: nick.slice(0, 15) } });
                });

                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    return ret;
};