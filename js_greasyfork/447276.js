// ==UserScript==
// @name         Discord Paste Links without Embeds
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Wraps URLs with angle brackets (<https://example.com>) when pasting into discord to avoid link embeds
// @author       Samathingamajig
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447276/Discord%20Paste%20Links%20without%20Embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/447276/Discord%20Paste%20Links%20without%20Embeds.meta.js
// ==/UserScript==

(async () => {
  "use strict";

  // Config for the script
  // NOTE: Changes are only re-evaluated when discord is completely refreshed, and are lost upon updates to the userscript
  const CONFIG = {
    replaceStandaloneLinks: true, // will affect "https://stackoverflow.com", but not "check out https://stackoverflow.com"; can be true or false; default: true
    replaceLinksInMessage: true, // will affect "check out https://stackoverflow.com", but not "https://stackoverflow.com"; can be true or false; default: true
    linkRegexProvider: "discord", // discord doesn't parse links perfectly on the frontend; can be "discord" or "custom"; default: "discord"
    ignoreCaseInLink: true, // discord doesn't treat HTTPS as a valid link, unless you wrap in <>; can be false or true; default true
  };

  if ([CONFIG.replaceStandaloneLinks, CONFIG.replaceLinksInMessage].every((bool) => bool === false)) return;

  const linkRegexBase = () =>
    CONFIG.linkRegexProvider.toLowerCase() === "discord"
      ? /((?:https?|steam):\/\/[^\s<]+[^<.,:;"'\]\s])/
      : /((?:(?:https?|ftp|steam):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?)/;
  const linkRegexSingle = () => new RegExp("^" + linkRegexBase().source + "$", CONFIG.ignoreCaseInLink ? "i" : "");
  const linkRegexGlobal = () => new RegExp(linkRegexBase(), "g" + (CONFIG.ignoreCaseInLink ? "i" : ""));

  const pasteEventListener = (event) => {
    if (["textarea", "br"].includes(event.target.nodeName.toLowerCase())) return;
    if (event.target.nodeName.toLowerCase() === "input" && !event.target.ariaLabel?.startsWith("Message @")) return;

    const paste = event.clipboardData?.getData("text");
    if (!paste || paste.length === 0) return;
    const oldGetData = event.clipboardData?.getData;
    const newGetData = (textReturn) => (format) => {
      switch (format.toLowerCase()) {
        case "text":
        case "text/plain":
          return textReturn;
        default:
          return oldGetData(format);
      }
    };

    const isLink = linkRegexSingle().test(paste);
    let message = paste;
    if (isLink && CONFIG.replaceStandaloneLinks) {
      message = `<${paste}>`;
    } else if (!isLink && CONFIG.replaceLinksInMessage) {
      message = paste.replaceAll(linkRegexGlobal(), "<$1>");
    }

    if (event.target.nodeName.toLowerCase() === "input") {
      event.target.value =
        event.target.value.slice(0, event.target.selectionStart) +
        message +
        event.target.value.slice(event.target.selectionEnd);
      event.target.setSelectionRange(
        event.target.selectionStart + message.length,
        event.target.selectionStart + message.length,
      );
      event.preventDefault();
    } else {
      event.clipboardData.getData = newGetData(message);
    }
  };

  document.body.addEventListener("paste", pasteEventListener, true);
})();
