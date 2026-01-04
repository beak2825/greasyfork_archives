// ==UserScript==
// @name         EventHelper 2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Хелпер
// @author       Sky
// @license      MIT
// @match       https://www.heroeswm.ru/*
// @connect     daily.lordswm.com
// @grant       none
// @include     https://my.lordswm.com/*
// @include     https://www.heroeswm.ru/*
// @downloadURL https://update.greasyfork.org/scripts/543623/EventHelper%202.user.js
// @updateURL https://update.greasyfork.org/scripts/543623/EventHelper%202.meta.js
// ==/UserScript==


async function start() {
    async function saveScript() {
        let response = await fetch("https://daily.lordswm.com/scripts/code/EventHelperV2")
        let scriptText = await response.text()
        let scriptData = {
            script: scriptText,
            time: Date.now()
        }
        set("EventHelper", scriptData)
        return scriptData
    }

    set("EventHelperVersion", "16.0.6")

    let scriptData = get("EventHelper", null)
    if (!scriptData) {
        scriptData = await saveScript()
    }
    let newScript = document.createElement('script');
    newScript.innerHTML = scriptData.script
    document.head.appendChild(newScript);

    if (scriptData.time + 900 * 1000 < Date.now()) {
        saveScript()
    }
}

start()

function get(key, def) {
    let result = JSON.parse(localStorage[key] === undefined ? null : localStorage[key]);
    return result == null ? def : result;

}

function set(key, val) {
    localStorage[key] = JSON.stringify(val);
}