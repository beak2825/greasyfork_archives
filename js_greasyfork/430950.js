// ==UserScript==
// @name               YesPlease
// @name:de            YesPlease
// @name:en            YesPlease
// @namespace          sun/userscripts
// @version            1.0.18
// @description        A (not yet) drop-in replacement for the No, thanks. extension.
// @description:de     (Noch k)ein Ersatz für die No, thanks.-Browsererweiterung.
// @description:en     A (not yet) drop-in replacement for the No, thanks. extension.
// @compatible         chrome
// @compatible         edge
// @compatible         firefox
// @compatible         opera
// @compatible         safari
// @homepageURL        https://forgejo.sny.sh/sun/userscripts
// @supportURL         https://forgejo.sny.sh/sun/userscripts/issues
// @contributionURL    https://liberapay.com/sun
// @contributionAmount €1.00
// @author             Sunny <sunny@sny.sh>
// @include            *://*/*
// @match              *://*/*
// @connect            no-thanks-extension.com
// @connect            *
// @run-at             document-end
// @inject-into        auto
// @grant              GM.addStyle
// @grant              GM_addStyle
// @grant              GM.getValue
// @grant              GM_getValue
// @grant              GM.openInTab
// @grant              GM_openInTab
// @grant              GM.registerMenuCommand
// @grant              GM_registerMenuCommand
// @grant              GM.setValue
// @grant              GM_setValue
// @grant              GM.xmlHttpRequest
// @grant              GM_xmlhttpRequest
// @noframes
// @require            https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @icon               https://forgejo.sny.sh/sun/userscripts/raw/branch/main/icons/YesPlease.png
// @copyright          2021-present, Sunny (https://sny.sh/)
// @license            Hippocratic License; https://forgejo.sny.sh/sun/userscripts/src/branch/main/LICENSE.md
// @downloadURL https://update.greasyfork.org/scripts/430950/YesPlease.user.js
// @updateURL https://update.greasyfork.org/scripts/430950/YesPlease.meta.js
// ==/UserScript==

(() => {
  GM_config.init({
    id: "options",
    title: "YesPlease",
    fields: {
      host: {
        label: "Extension host",
        section: ["Access", "Configure access to the extension server"],
        type: "text",
        title: "Base URL of the host to send requests to when updating rules",
        default: "https://www.no-thanks-extension.com",
      },
      hash: {
        label: "Subscription hash",
        type: "text",
        title:
          "Valid subscription identifier, required when using the official host",
        size: 64,
        default:
          "abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstuvwxyz12",
      },
      "group-newsletter": {
        label: "Newsletter pop-ups",
        section: ["Groups", "Choose which element groups to hide"],
        type: "checkbox",
        title: "Block and auto-close all kinds of newsletter pop-ups",
        default: true,
      },
      "group-chat": {
        label: "Chat boxes",
        type: "checkbox",
        title: "Block chat, feedback and contact boxes in the corner",
        default: true,
      },
      "group-app": {
        label: "'Install our app' boxes",
        type: "checkbox",
        title: "Block 'Install our app' boxes and toolbars",
        default: true,
      },
      "group-push": {
        label: "Notification pop-ups",
        type: "checkbox",
        title: "Block 'Allow notifications' pop-ups",
        default: true,
      },
      "group-location": {
        label: "Location requests",
        type: "checkbox",
        title: "Block 'Allow us to know your location' requests",
        default: true,
      },
      "group-survey": {
        label: "Survey pop-ups",
        type: "checkbox",
        title: "Block and auto-close all kinds of surveys and opinion pop-ups",
        default: true,
      },
      "group-rating": {
        label: "Website ratings",
        type: "checkbox",
        title:
          "Block website ratings, 'website protected by...' and similar boxes",
        default: true,
      },
      "group-translation": {
        label: "Translation toolbars",
        type: "checkbox",
        title: "Block toolbars offering website translation",
        default: true,
      },
      "group-top": {
        label: "'Scroll to top' buttons",
        type: "checkbox",
        title: "Block 'Scroll to top' buttons",
        default: true,
      },
      "group-signup": {
        label: "Sign-up prompts",
        type: "checkbox",
        title: "Block big 'Login / Register' pop-ups",
        default: true,
      },
      "group-video": {
        label: "Video boxes",
        type: "checkbox",
        title: "Block video boxes in the corner",
        default: true,
      },
      "group-subscribe": {
        label: "Subscription boxes",
        type: "checkbox",
        title: "Block 'Pay' and 'Subscribe' boxes offering premium services",
        default: true,
      },
      "group-suggestion": {
        label: "Suggestion pop-ups",
        type: "checkbox",
        title:
          "Block pop-ups offering shopping, reading and similar suggestions",
        default: true,
      },
      "group-iam18": {
        label: "Age confirmations",
        type: "checkbox",
        title:
          "Automatically confirm you are 18+ years old when needed, if you really are",
        default: false,
      },
      version: {
        label: "Rules version",
        section: ["Metadata", "Information about the current rules file"],
        type: "text",
        title:
          "Version of the currently cached rules file, will be updated automatically",
        size: 7,
        default: "0.0.0.0",
      },
      rules: {
        label: "Extension rules",
        type: "textarea",
        title: "Currently cached rules file, changes may be overwritten",
        default: "{}",
      },
      timestamp: {
        label: "Last update",
        type: "int",
        title: "Timestamp of the last rule file update check",
        default: 0,
      },
      update: {
        label: "Update interval",
        section: ["Miscellaneous", "Other userscript-related preferences"],
        type: "int",
        title:
          "Interval in milliseconds in which to automatically check for updates",
        default: 86400000,
      },
      notify: {
        label: "Send notifications",
        type: "select",
        title: "Whether to send notifications when updating rules",
        options: ["Always", "Only manual updates", "Never"],
        default: "Only manual updates",
      },
    },
    events: {
      init,
    },
  });

  GM.registerMenuCommand("Report issue on this page", () => {
    GM.openInTab(
      `https://www.no-thanks-extension.com/report/problem/on/${encodeURIComponent(encodeURIComponent(location.href))}`,
      {
        active: true,
      },
    );
  });

  GM.registerMenuCommand("Userscript options", () => {
    GM_config.open();
  });

  GM.registerMenuCommand("Manual update", () => {
    request(true);
  });

  GM.registerMenuCommand("Visit homepage", () => {
    GM.openInTab("https://www.no-thanks-extension.com/", {
      active: true,
    });
  });

  function init() {
    if (
      GM_config.get("update") &&
      Date.now() - GM_config.get("update") > GM_config.get("timestamp")
    )
      request();

    const groups = JSON.parse(GM_config.get("rules"));
    for (const group in groups) {
      if (GM_config.get(`group-${group}`)) {
        for (const css in groups[group].css) {
          if (css === "common" || css === location.hostname) {
            GM.addStyle(groups[group].css[css]);
          }
        }
        for (const _js in groups[group].js) {
          // groups[group].js[js]
        }
        for (const _block in groups[group].block) {
          // groups[group].block[block]
        }
      }
    }
  }

  function request(manual) {
    GM.xmlHttpRequest({
      method: "GET",
      url: `${GM_config.get("host")}/api/get`,
      headers: {
        "nothanks-hash": GM_config.get("hash"),
        "nothanks-version": GM_config.get("version"),
      },
      onload: (response) => {
        GM_config.set("timestamp", Date.now());

        switch (response.responseText) {
          case "UP_TO_DATE":
            notify(manual, "Blocking rules are already up to date.");
            break;
          case "INVALID":
            notify(manual, "Please renew your subscription.");
            break;
          case "EXPIRED":
            notify(
              manual,
              "Your subscription has expired. To subscribe again, please follow the 'Subscribe' link in the extension menu.",
            );
            break;
          default:
            GM_config.set(
              "version",
              JSON.parse(response.responseText).info.version,
            );
            GM_config.set(
              "rules",
              JSON.stringify(JSON.parse(response.responseText).rules),
            );
            GM_config.write();
            notify(
              manual,
              `Blocking rules have just been updated to version ${GM_config.get("version")}.`,
            );
        }
      },
    });
  }

  function notify(manual, message) {
    if (manual) {
      if (
        GM_config.get("notify") === "Always" ||
        GM_config.get("notify") === "Only manual updates"
      )
        alert(message);
    } else {
      if (GM_config.get("notify") === "Always") alert(message);
    }
  }
})();
