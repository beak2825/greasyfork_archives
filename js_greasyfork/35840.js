// ==UserScript==
// @name         GBF Victory Skip
// @version      0.0.1
// @description  Redirects to reward page when win scenario is detected
// @match        http://game.granbluefantasy.jp/
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/18331
// @downloadURL https://update.greasyfork.org/scripts/35840/GBF%20Victory%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/35840/GBF%20Victory%20Skip.meta.js
// ==/UserScript==
const DEBUG = false;

const tryParseJSON = text => {
    let json;
    try {
        json = JSON.parse(text);
    } catch (e) {
        if (e instanceof SyntaxError) {
            return text;
        }
        throw e;
    }
    return json;
};

const log = (...args) => {
    if (!DEBUG) return;
    console.debug("GVS", ...args);
};

const customLoad = (xhr, ...args) => {
    // ex:
    // http://game.granbluefantasy.jp/rest/multiraid/ability_result.json
    const url = new URL(xhr.responseURL);
    const req = tryParseJSON(args[0]);
    const res = tryParseJSON(xhr.response);

    if (url.pathname.indexOf('.json') < 0) return;
    if (url.pathname.indexOf('/rest') < 0) return;
    log("» FOUND MATCHING REQUEST");

    if (!res.scenario) return;
    log("»» FOUND SCENARIO", res.scenario);

    const win = res.scenario.find(s => s.cmd === "win");
    if (win) {
        log("»»» DETECTED WIN CONDITION", win);
        const raidId = win.raid_id;                            // Contains the next raid id if it's not the last round
        const isLastRaid = !!win.is_last_raid;

        log("»»»» CURRENT_URL ", location.href.toString());
        const redirectURL = (isLastRaid) ?
              location.href.toString().replace("raid", "result") :
              location.href.toString().replace(/\d{3,10}/, raidId);
        log("»»»»» REDIRECT_URL", redirectURL);

        location.href = redirectURL;
    }
};

const origSend = unsafeWindow.XMLHttpRequest.prototype.send;
unsafeWindow.XMLHttpRequest.prototype.send = function (...args) {
    this.addEventListener('load', () => {
        if (this.status === 200) {
            customLoad(this, args);
        }
    });
    origSend.apply(this, args);
};
