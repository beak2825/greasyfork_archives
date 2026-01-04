// ==UserScript==
// @name         Hordes.io Auto Loot
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  another auto loot for hordes.io
// @author       Anonymous
// @match        https://hordes.io/play
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at       document-start
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/441588/Hordesio%20Auto%20Loot.user.js
// @updateURL https://update.greasyfork.org/scripts/441588/Hordesio%20Auto%20Loot.meta.js
// ==/UserScript==

document.write();

fetch('https://hordes.io/play')
    .then(d => d.text())
    .then(async html => {
    const element = html.match(/<script.*?client\.js.*?><\/script>/)[0]
    const url = element.match(/src="(.*?)"/)[1]
    html = html.replace(element, `<script>let _t=origin;delete origin;eval(_t)</script>`)

    let origin = await (fetch(url).then(d => d.text()))

    const codeReplacement = [
        ["Ro=t=>{ko=t}", "Ro=t=>{ko=window.game=t}"],
        ["En={}", "En=window.gameSettings={}"],
        ["fp=t=>{", "fp=window.changeUITarget=t=>{"],
    ];

    for (let i = 0; i < codeReplacement.length; i++) {
        if (origin.indexOf(codeReplacement[i][0]) < 0) {
            console.log(codeReplacement[i]);
            alert('Press Loot: incompatible client!, pls uninstall this mod');
            console.error('Press Loot: incompatible client!, pls uninstall this mod');
            return;
        }
        origin = origin.replace(codeReplacement[i][0],codeReplacement[i][1]);
    }

    origin = origin.replace("Ro=t=>{ko=t}", "Ro=t=>{ko=window.game=t}")
    origin = origin.replace()
    origin = origin.replace()

    window.loadLootingConfig = () => {
        let persistedConfig = window.localStorage.getItem('lootingConfig');
        if (!persistedConfig) {
            window.localStorage.setItem('lootingConfig', JSON.stringify(window.lootingConfig));
        }
        else {
            Object.assign(window.lootingConfig, JSON.parse(persistedConfig));
        }
    }

    window.saveLootingConfig = () => {
        window.localStorage.setItem('lootingConfig', JSON.stringify(window.lootingConfig));
    }


    window.lootingConfig = {
        key: 'shift2',
        minMiscTier: 4,
        minBookTier: 5,
    };
    window.loadLootingConfig();
    window.saveLootingConfig();

    window.doLooting = () => {
        const picks = window.game?.entities.array.filter(t => t.canBePickedUpBy?.(window.game.player)
                                                         && !window.gameSettings?.itemTypeFilter.toLowerCase().replace(/\s/g, "").split(",").includes(t.droptype)
                                                         && (
            t.droptype === "gold"
            || t.droptype == "rune"
            || (t.droptype == "misc" && t.tier >= window.lootingConfig.minMiscTier)
            || (t.droptype == "book" && t.name.includes("Lv. " + window.lootingConfig.minBookTier))
            || (!['gold', 'rune', 'book', 'misc'].includes(t.droptype) && t.quality >= window.gameSettings?.itemQualityFilter)
        )) || [];

        if (!picks?.length){
            return;
        }
        const a = picks.pop();
        window.changeUITarget?.(a.id);
    }

    window.origin = origin
    document.open().write(html)

    document.addEventListener("keydown", e => {
        const keyId = `${e.key}${e.location}`.toLowerCase();
        if (e.key.toLowerCase() === window.lootingConfig?.key.toLowerCase()
            || keyId === window.lootingConfig?.key.toLowerCase()) {
            window.doLooting?.();
        }
    }, !1);

    document.close()
});


