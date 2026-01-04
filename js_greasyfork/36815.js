// ==UserScript==
// @name         GBF Damage Logger
// @version      0.0.2
// @description  Captures damage numbers and log it to the console
// @match        http://game.granbluefantasy.jp/
// @grant        unsafeWindow
// @run-at       document-start
// @namespace    https://greasyfork.org/users/18331
// @downloadURL https://update.greasyfork.org/scripts/36815/GBF%20Damage%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/36815/GBF%20Damage%20Logger.meta.js
// ==/UserScript==
const DEBUG = false;
const elementMap = ['plain', 'fire', 'water', 'earth', 'wind', 'light', 'dark'];

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

// source: https://stackoverflow.com/a/2901298
const commaify = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const log = (...args) => {
    if (!DEBUG) return;
    console.debug("GDL", ...args);
};

const logStore = msg => {
    const storedLogs = tryParseJSON(localStorage.gdl);

    if (storedLogs) {
        storedLogs.push(msg);
        localStorage.gdl = JSON.stringify(storedLogs);
    } else {
        localStorage.gdl = JSON.stringify([msg]);
    }
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

    const damageScenarios = res.scenario.filter(s => s.cmd === "damage");
    const attackScenarios = res.scenario.filter(s => s.cmd === "attack");
    if (!damageScenarios || !attackScenarios) return;
    log("»»» FOUND MATCHING SCENARIO(S)");

    damageScenarios.forEach(s => {
        const { to, list } = s;
        const mainColor = s.color;

        list.forEach(i => {
            const { pos, value } = i;
            const color = i.color ? i.color : mainColor;
            const element = elementMap[color];
            let message = "";

            if ( to === "boss" ) {
                message = `${commaify(value)} ${element} damage dealt to enemy ${pos}`;
            } else {
                message = `${commaify(value)} ${element} damage dealt to player ${pos}`;
            }

            console.info(message);
            logStore(message);
        });
    });

    attackScenarios.forEach(s => {
        const { damage } = s;
        const sourcePos = s.pos;
        const mainColr = s.color;

        damage.forEach(d => {
            d.forEach(dd => {
                const { from, value, concurrent_attack_count } = dd;
                const color = dd.color ? dd.color : mainColor;
                const targetPos = dd.pos;
                const element = elementMap[color];
                const echo = (concurrent_attack_count > 0) ? " echo" : "";
                const message = `Character ${sourcePos} dealt ${commaify(value)} ${element}${echo} damage to enemy ${targetPos}`;

                console.info(message);
                logStore(message);
            });
        });
    });
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
