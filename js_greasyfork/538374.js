// ==UserScript==
// @name        Copilot Continue
// @namespace   https://snomiao.com
// @match       *://*/*
// @grant       none
// @version     1.2.10
// @author      snomiao
// @description Auto-clicks the "Continue" button when GitHub Copilot gets stuck
// @homepage    https://github.com/snomiao/copilot-continue.user.js
// @supportURL  https://github.com/snomiao/copilot-continue.user.js/issues
// @license     MIT
// @compatible  chrome
// @compatible  firefox
// @compatible  edge
// @compatible  opera
// @downloadURL https://update.greasyfork.org/scripts/538374/Copilot%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/538374/Copilot%20Continue.meta.js
// ==/UserScript==

/*
 * Copilot Continue - A userscript to automatically continue GitHub Copilot
 *
 * This script automatically clicks the "Continue" button when GitHub Copilot
 * shows interruption messages like:
 * - "Copilot has been working on this problem for a while"
 * - "Run command in the terminal"
 * - "Allow task run?"
 *
 * The script runs in VS Code web environments and checks for interruptions every second.
 *
 * Notes for Copilot: dont forget to bump version number in the header when you modify this script.
 */

const actionMatchers = {
  clickContinue: [
    /^Copilot has been working on this problem for a while/,
    /^Run command in terminal/,
    /^Run command `.*`\?/,
    /^Run command in background terminal/,
    /^Continue to iterate\?/,
    /^Allow task run\?/,
    /^Allow test run\?/,
  ],
  clickAllow: [
    /^Run .*? command\?/,
  ],
  clickGrant: [
    /^To get more relevant Copilot Chat results, we need permission to read the contents of your repository on GitHub./,
  ],
  clickTryAgain: [
    /^The model unexpectedly did not return a response, which may indicate a service issue. Please report a bug./,
    /^Sorry, your request failed. Please try again./,
    /^Sorry, no response was returned./
  ],
  clickRetryIcon: [/^Language model unavailable/, /^Copilot setup failed/],
};

const actions = {
  default: () =>
    console.warn("No action matched. Please check the action matchers."),
  refresh: () => (location.reload()),
  clickRetryIcon: () => $$('a[aria-label="Retry"]').findLast(Boolean)?.click(),
  clickContinue: () =>
    $$("a.monaco-button").findLast(textEq("Continue"))?.click(),
  clickAllow: () =>
    $$("a.monaco-button").findLast(textEq("Allow"))?.click(),
  clickGrant: () =>
    $$("a.monaco-button").findLast(textEq("Grant"))?.click(),
  clickTryAgain: (
    (tryAgainCount = 0) =>
      () => {
        if (tryAgainCount >= 3) return (location.reload());
        const btn = $$("a.monaco-button").findLast(textEq("Try Again"));
        if (!btn) return;
        btn.click();
        tryAgainCount++;
      }
  )(),
};

function textEq(content) {
  return (e) => e.textContent === content;
}
const enable = !!document.querySelector("meta#vscode-workbench-auth-session");

// Prevent double execution if loaded both as userscript and extension
if (enable && !globalThis.copilotContinueLoaded) {
  main();
  globalThis.copilotContinueLoaded = true;
}

function main() {
  const clear = useInterval(() => loop(), 1e3);
  return () => clear();
}
function loop() {
  const text = $$("div.rendered-markdown")
    .map((e) => e.innerText)
    .flatMap((e) => (e ? [e] : [])) // empty filter
    .map((e) => e.replace(/\s+/g, " "))
    .map((e) => e.trim())

  Object.entries(actionMatchers).find(([action, matchers]) => {
    if (text.some((s) => matchers.some((m) => s.match(m)))) {
      (actions[action] || actions.default)?.();
      return true;
    }
  });
}

function $$(sel) {
  return [...document.querySelectorAll(sel)];
}

function useInterval(...args) {
  const id = setInterval(...args);
  return () => clearInterval(id);
}
