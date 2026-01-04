// ==UserScript==
// @name         ChatGPT Rate Limit - Backend
// @namespace    http://terase.cn
// @license      MIT
// @version      4.1
// @description  A tool to know your ChatGPT Rate Limit.
// @author       Terrasse
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @connect      oai-rl.terase.cn
// @connect      ip.sb
// @sandbox      DOM
// @downloadURL https://update.greasyfork.org/scripts/523365/ChatGPT%20Rate%20Limit%20-%20Backend.user.js
// @updateURL https://update.greasyfork.org/scripts/523365/ChatGPT%20Rate%20Limit%20-%20Backend.meta.js
// ==/UserScript==

(function() {
    'use strict';

var api_url = localStorage.getItem('oairl_api_url');
var api_key = localStorage.getItem('oairl_api_key');

if (!api_url || !api_url.startsWith('https')) {
    api_url = prompt('Please enter [ChatGPT Rate Limit] API URL');
    localStorage.setItem('oairl_api_url', api_url);
}

if (!api_key || !/^[A-Za-z0-9]{32}$/.test(api_key)) {
    api_key = prompt('Please enter [ChatGPT Rate Limit] API Key (32 characters)');
    localStorage.setItem('oairl_api_key', api_key);
}

function requestAPI(model, method, onload) {
    var api = `${api_url}?model=${model}`;
    GM.xmlHttpRequest({
        method: method,
        url: api,
        headers: {
            "Authorization": "Bearer " + api_key
        },
        onload: onload
    });
}

function updateStatus(model, opposite) {
    requestAPI(model, "GET", function(response) {
        if (response.status === 200) {
            // console.log("GET success: " + response.responseText);
            var remain = JSON.parse(response.responseText).remain;
            opposite.postMessage({ model: model, type: "status", remain: remain }, window.location.origin);
        } else {
            console.log(`GET Error: ${response.status} ${response.responseText}`, response);
        }
    });
}

function receiveMessage(event) { // Accept: type="put" or "get"
    if (event.origin !== window.location.origin) return;
    if (event.data.type !== "put" && event.data.type !== "get") return;
    // console.log('ISOLATED_WORLD 收到消息:', event.data);

    var msg = event.data;
    if (msg.type == "put") {
        requestAPI(msg.model, "PUT", function(response) {
            if (response.status === 200) {
                // console.log("PUT success: " + response.responseText);
                updateStatus(msg.model, event.source);
            } else {
                console.log(`PUT Error: ${response.status} ${response.responseText}`, response);
            }
        });
    } else if (msg.type == "get") {
        updateStatus(msg.model, event.source);
    } else {
        console.log(`Unknown message type from fontend: ${msg.type}, msg: ${msg}, event: ${event}`, event);
    }
}

window.addEventListener('message', receiveMessage, false);

var resetKeyCounter = 0;
var lastClickTime = 0;
function resetKey() {
    var now = Date.now();
    if (now - lastClickTime > 1000) {
        resetKeyCounter = 0;
    }
    lastClickTime = now;

    if (++resetKeyCounter % 5) return; // click 5 times in quick succession
    if (!confirm('Are you sure to reset the API URL and Key?')) return;

    localStorage.removeItem('oairl_api_url');
    localStorage.removeItem('oairl_api_key');
    location.reload();
}

window.addEventListener('click', function(event) {
  if (event.target && event.target.id == 'crl_bar') {
    resetKey();
  }
});

// ================ Proxy Protect ================

function parseIPv4(ip) {
  const parts = ip.split(".");
  if (parts.length !== 4) return null;

  let n = 0;
  for (const p of parts) {
    if (p === "" || !/^\d+$/.test(p)) return null;
    const v = Number(p);
    if (v < 0 || v > 255) return null;
    n = (n << 8) | v;
  }
  return n >>> 0;
}

function isIPv4InCIDR(ip, cidr) {
  const [baseStr, prefixStr] = cidr.split("/");
  if (!baseStr || prefixStr == null) return false;

  const base = parseIPv4(baseStr);
  const addr = parseIPv4(ip);
  const prefix = Number(prefixStr);

  if (base == null || addr == null) return false;
  if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) return false;

  const mask = prefix === 0 ? 0 : ((0xffffffff << (32 - prefix)) >>> 0);
  return ((addr & mask) >>> 0) === ((base & mask) >>> 0);
}

const allowedCIDR = [
    '47.148.0.0/16',
    '47.159.0.0/16',
];
var current_ip = '';
var warning_displayed = false;

function checkAllowed(ip) {
    for (const cidr of allowedCIDR) {
        if (isIPv4InCIDR(ip, cidr)) {
            return true;
        }
    }
    return false;
}

function checkIP() {
    GM.xmlHttpRequest({
        url: 'https://api.ip.sb/ip',
        onload: function(response) {
            current_ip = response.responseText.trim();
            var is_allowed = checkAllowed(current_ip);
            if (!is_allowed) {
                console.log(`IP ${current_ip} is not allowed`);
                if (!warning_displayed) {
                    warning_displayed = true;
                    alert(`Your IP ${current_ip} is not recommended.`);
                }
                return;
            }
            console.log(`IP ${current_ip} is allowed`);
        }
    });
}

checkIP();
setInterval(checkIP, 60000); // 1min

})();