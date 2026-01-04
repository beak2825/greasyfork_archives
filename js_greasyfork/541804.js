// ==UserScript==
// @name         [银河奶牛] 怪物娘化 / MWI-MonsterFeminization
// @name:en      MWI-MonsterFeminization
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  怪物娘化
// @description:en  MonsterFeminization
// @author       XIxixi297
// @license      CC-BY-NC-SA-4.0
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @resource     monsterData https://raw.githubusercontent.com/CYR2077/MWI-MonsterFeminization/refs/heads/main/resource/monster-data.json
// @grant        GM_getResourceText
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541804/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%20%E6%80%AA%E7%89%A9%E5%A8%98%E5%8C%96%20%20MWI-MonsterFeminization.user.js
// @updateURL https://update.greasyfork.org/scripts/541804/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%20%E6%80%AA%E7%89%A9%E5%A8%98%E5%8C%96%20%20MWI-MonsterFeminization.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const monsterNames = [
        "fly", "rat", "skunk", "porcupine", "slimy", "frog", "snake", "swampy",
        "alligator", "sea_snail", "crab", "aquahorse", "nom_nom", "turtle",
        "jungle_sprite", "myconid", "treant", "centaur_archer", "gobo_stabby",
        "gobo_slashy", "gobo_smashy", "gobo_shooty", "gobo_boomy", "eye",
        "eyes", "veyes", "novice_sorcerer", "ice_sorcerer", "flame_sorcerer",
        "elementalist", "gummy_bear", "panda", "black_bear", "grizzly_bear",
        "polar_bear", "magnetic_golem", "stalactite_golem", "granite_golem",
        "zombie", "vampire", "werewolf", "abyssal_imp", "soul_hunter",
        "infernal_warlock", "giant_shoebill", "marine_huntress", "luna_empress",
        "gobo_chieftain", "the_watcher", "chronofrost_sorcerer", "red_panda",
        "crystal_colossus", "dusk_revenant", "demonic_overlord",
        "butterjerry", "jackalope", "dodocamel", "manticore", "griffin",
        "rabid_rabbit", "zombie_bear", "acrobat", "juggler", "magician",
        "deranged_jester", "enchanted_pawn", "enchanted_knight", "enchanted_bishop",
        "enchanted_rook", "enchanted_queen", "enchanted_king", "squawker",
        "anchor_shark", "brine_marksman", "tidal_conjuror", "captain_fishhook", "the_kraken"
    ];
 
    const blobCache = new Map();
    let ready = false;
 
    // 立即隐藏原图标
    function hideOriginals() {
        const style = document.createElement('style');
        style.textContent = 'use[href*="combat_monsters_sprite.75d964d1.svg#"]{opacity:0!important}';
        (document.head || document.documentElement).appendChild(style);
    }
 
    // 预加载数据
    async function loadData() {
        try {
            const data = JSON.parse(await GM_getResourceText('monsterData'));
            for (const [name, base64] of Object.entries(data)) {
                if (monsterNames.includes(name) && base64) {
                    const [, b64data] = base64.split(',');
                    const bytes = new Uint8Array(atob(b64data).split('').map(c => c.charCodeAt(0)));
                    const blob = new Blob([bytes], { type: 'image/png' });
                    blobCache.set(name, URL.createObjectURL(blob));
                }
            }
            hideOriginals();
            ready = true;
            replace();
        } catch (e) {
            console.error('❌ 数据加载失败:', e);
        }
    }
 
    // 替换图标
    function replace() {
        if (!ready) return;
 
        document.querySelectorAll('use[href*="combat_monsters_sprite.75d964d1.svg#"]').forEach(use => {
            const match = use.getAttribute('href').match(/#(.+)$/);
            if (!match) return;
 
            const name = match[1];
 
            const url = blobCache.get(name);
            if (!url) return;
 
            const svg = use.closest('svg');
            if (!svg) return;
 
            const img = use.parentNode.querySelector("image");
            if(!img) {
                const newImg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
                Array.from(use.attributes).forEach(attr => {
                    if (attr.name !== 'href' && attr.name !== 'style') newImg.setAttribute(attr.name, attr.value);
                });
 
                newImg.setAttribute('href', url);
                newImg.setAttribute('width', '100%');
                newImg.setAttribute('height', '100%');
                newImg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                use.parentNode.insertBefore(newImg, use);
                use.style.display = 'none';
            } else {
                img.setAttribute('href', url);
            }
 
            use.setAttribute('href', '');
        });
    }
 
    // 初始化
    loadData();
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', async () => {
            new MutationObserver(replace).observe(document.body, { childList: true, subtree: true });
        });
    } else {
        new MutationObserver(replace).observe(document.body, { childList: true, subtree: true });
    }
})();