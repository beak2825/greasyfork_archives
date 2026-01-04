// ==UserScript==
// @name             Secret Message Encoder
// @name:de          Geheime Nachrichten Kodierer
// @namespace        https://sme.luisafk.dev
// @version          1.0.1742244079066
// @description      Encodes a secret message inside another.
// @description:de   Kodiert eine geheime Nachricht in einer anderen.
// @author           LuisAFK
// @match            *://*/*
// @icon             https://sme.luisafk.dev/assets/favicon96.png
// @website          https://sme.luisafk.dev
// @grant            none
// @supportURL       https://github.com/lafkpages/sme/issues
// @run-at           document-idle
// @license          GPLv3
// @downloadURL https://update.greasyfork.org/scripts/465875/Secret%20Message%20Encoder.user.js
// @updateURL https://update.greasyfork.org/scripts/465875/Secret%20Message%20Encoder.meta.js
// ==/UserScript==

(()=>{
// src/shared/encoders.ts
var one = "​";
var zero = "‌";
var oneOne = "‎";
var zeroZero = "‏";
var oneZero = "⁡";
var zeroOne = "⁢";
var zeroZeroZero = "⁣";
var oneOneOne = "⁤";
var secretsRegEx = new RegExp(`[${zeroZeroZero}${oneOneOne}${zeroZero}${oneOne}${zeroOne}${oneZero}${zero}${one}]+`);
function binToString(b) {
  const m = b.match(/[01]{8}/g);
  if (!m) {
    return null;
  }
  let s = "";
  for (const c of m) {
    s += String.fromCodePoint(parseInt(c, 2));
  }
  return s;
}
function secretBinToString(b) {
  b = b.replace(new RegExp(zeroZeroZero, "g"), "000");
  b = b.replace(new RegExp(oneOneOne, "g"), "111");
  b = b.replace(new RegExp(zeroOne, "g"), "01");
  b = b.replace(new RegExp(oneZero, "g"), "10");
  b = b.replace(new RegExp(zeroZero, "g"), "00");
  b = b.replace(new RegExp(oneOne, "g"), "11");
  b = b.replace(new RegExp(zero, "g"), "0");
  b = b.replace(new RegExp(one, "g"), "1");
  return binToString(b);
}
function decodeSecret(s) {
  const b = s.match(secretsRegEx)?.[0];
  if (!b) {
    return null;
  }
  return secretBinToString(b);
}

// src/scriptlet/index.ts
var host = document.createElement("div");
host.id = "sme-inject-toast-host";
var shadow = host.attachShadow({ mode: "closed" });
var div = document.createElement("div");
div.id = "sme-inject-toast";
shadow.appendChild(div);
document.body.appendChild(host);
var style = document.createElement("style");
style.textContent = `
  #sme-inject-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    z-index: 99999;
    background: wheat;
    border: 1px solid black;
    border-radius: 5px;
    transition: transform 0.5s ease-in-out 0s;
    transform: translateY(calc(-100% - 50px));
    white-space: pre-line;
  }

  #sme-inject-toast.show,
  #sme-inject-toast:hover {
    transform: translateY(0px);
  }
`;
shadow.appendChild(style);
document.addEventListener("select", onSelectionChange);
document.addEventListener("selectionchange", onSelectionChange);
function onSelectionChange() {
  let selectedText = window.getSelection()?.toString();
  if (!selectedText) {
    const elm = document.activeElement;
    if (elm instanceof HTMLTextAreaElement || elm instanceof HTMLInputElement) {
      if (elm.selectionStart !== null && elm.selectionEnd !== null) {
        selectedText = elm.value.slice(elm.selectionStart, elm.selectionEnd);
      }
    }
  }
  let decodedSecret = null;
  if (selectedText) {
    try {
      decodedSecret = decodeSecret(selectedText);
    } catch {}
  }
  if (decodedSecret) {
    div.classList.add("show");
    div.textContent = decodedSecret;
  } else {
    div.classList.remove("show");
  }
}

})()
