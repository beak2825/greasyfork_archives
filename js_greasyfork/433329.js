// ==UserScript==
// @name     Airss CORS Bypass
// @version  1
// @grant GM.xmlHttpRequest
// @include  https://airss.roastidio.us/*
// @connect  *
// @namespace iwalton.com
// @description Allow airss to fetch any RSS feed.
// @license  MIT; https://spdx.org/licenses/MIT.html#licenseText
// @downloadURL https://update.greasyfork.org/scripts/433329/Airss%20CORS%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/433329/Airss%20CORS%20Bypass.meta.js
// ==/UserScript==

function messageHandler(event) {
    let message;
    try {
        message = JSON.parse(event.data);
    } catch(_) {
        return;
    }
    if (message.eventName != "gm_xhr_send") return;
    GM.xmlHttpRequest({
        method: 'GET',
        url: message.url,
        onload: function (result) {
            window.postMessage(JSON.stringify({
                success: true,
                eventName: "gm_xhr_recv",
                response: result.responseText,
                headers: result.responseHeaders,
                id: message.id
            }), "*");
        },
        onerror: function (error) {
            console.error("GM request Failed for URL " + message.url + " with " + error);
            window.postMessage(JSON.stringify({
                success: false,
                eventName: "gm_xhr_recv",
                id: message.id
            }), "*");
        }
    });
}

window.addEventListener("message", messageHandler, false);

function main () {
    const realFetch = window.fetch;
  
    window.gmpx_eventHandlers = {};
    window.gmpx_id = 0;
    function gmpx_messageHandler(event) {
        let message;
        try {
            message = JSON.parse(event.data);
        } catch(_) {
            return;
        }
        if (message.eventName != "gm_xhr_recv") return;
        window.gmpx_eventHandlers[message.id](message);
        window.gmpx_eventHandlers[message.id] = undefined;
    }
    window.addEventListener("message", gmpx_messageHandler, false);

    function InsensitiveMap() {
        this.map = new Map();
        this.set = (key, value) => this.map.set(key.toLowerCase(), value);
        this.get = (key) => this.map.get(key.toLowerCase());
        this.has = (key) => this.map.has(key.toLowerCase());
    }
  
    window.fetch = (path, options) => {
        return new Promise((resolve, reject) => {
            realFetch(path, options)
            .then(response => resolve(response))
            .catch(error => {
                const id = window.gmpx_id++;
                window.gmpx_eventHandlers[id] = function(result) {
                  if (result.success) {
                      const arr = result.headers.trim().split(/[\r\n]+/);
                      const headerMap = new InsensitiveMap();
                      arr.forEach(function (line) {
                        const parts = line.split(': ');
                        const header = parts.shift();
                        const value = parts.join(': ');
                        headerMap.set(header, value);
                      });
                      resolve({
                          status: 200,
                          ok: true,
                          text: () => Promise.resolve(result.response),
                          json: () => Promise.resolve(JSON.parse(result.response)),
                          headers: headerMap
                      });
                  } else {
                      reject(error);
                  }
                };
                window.postMessage(JSON.stringify({
                  eventName: "gm_xhr_send",
                  url: path,
                  id: id
                }), "*");
            });
        });
    }
}

// From https://stackoverflow.com/questions/2303147/
var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
