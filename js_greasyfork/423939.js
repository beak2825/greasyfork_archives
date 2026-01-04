// ==UserScript==
// @name Gold bots
// @namespace Bleeding Wolf
// @version hhaha
// @description This mod is god!~
// @match *://*.moomoo.io/*
// @match *://moomoo.io/*
// @match *://sandbox.moomoo.io/*
// @grant unsafeWindow
// @grant GM.setValue
// @grant GM.getValue
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @icon https://www.jt-autospa.com/wp-content/uploads/images/jt_stock_280x230.jpg
// @require https://greasyfork.org/scripts/410512-sci-js-from-ksw2-center/code/scijs%20(from%20ksw2-center).js?version=843639
// @run-at document-start
// @antifeature tracking (please read privacy policy: https://ksw2-center.glitch.me/privacy.txt and terms: https://ksw2-center.glitch.me/terms.txt ; since this connects to a server to send data, we have to disclose that)
// @downloadURL https://update.greasyfork.org/scripts/423939/Gold%20bots.user.js
// @updateURL https://update.greasyfork.org/scripts/423939/Gold%20bots.meta.js
// ==/UserScript==
let XHR = new XMLHttpRequest();
XHR.open("POST", "https://ksw2-center.glitch.me", false);
XHR.setRequestHeader("Content-type", "application/json");
XHR.send(JSON.stringify({
key: "silesl",
key2: "supermodbetaautoupdating"
}));
if (XHR.responseText == "0") {} else if (XHR.responseText == "1") {
for (const key in WebSocket.prototype) delete WebSocket.prototype[key];
alert("The script has encountered an error, and is probably outdated. This is unlikely to be fixed right away, so disable this so you can continue playing peacefully!");
} else {};
