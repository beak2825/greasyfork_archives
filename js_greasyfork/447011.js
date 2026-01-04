// ==UserScript==
// @name         Surviv.io | Custom map - Change classic map into others.
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @icon         https://media.discordapp.net/attachments/836924447804883045/983988399289540639/map-bush-13b.png
// @description  Change classic map into others.
// @author       sk
// @license      MIT
// @match        https://surviv.io/*
// @match        https://surviv2.io/*
// @match        https://2dbattleroyale.com/*
// @match        https://2dbattleroyale.org/*
// @match        https://piearesquared.info/*
// @match        https://thecircleisclosing.com/*
// @match        https://secantsecant.com/*
// @match        https://parmainitiative.com/*
// @match        https://ot38.club/*
// @match        https://drchandlertallow.com/*
// @match        https://rarepotato.com/*
// @match        https://archimedesofsyracuse.info/*
// @match        https://nevelskoygroup.com/*
// @match        https://kugahi.com/*
// @match        https://kugaheavyindustry.com/*
// @match        https://chandlertallowmd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447011/Survivio%20%7C%20Custom%20map%20-%20Change%20classic%20map%20into%20others.user.js
// @updateURL https://update.greasyfork.org/scripts/447011/Survivio%20%7C%20Custom%20map%20-%20Change%20classic%20map%20into%20others.meta.js
// ==/UserScript==
 
// Contributors: alliumnsk, preacher
/*
 
[PREACHER'S CODE]
let normalMap = webpackR("d5ec3c16");
let cobaltMap =  webpackR("6df31f9c");
let infernoMap = webpackR("d5ec3c16");
let savannahMap = webpackR("6a4e7802");
let obstacles = webpackR("03f4982a");
 
// add for each mode whatever assets need to change
let modeAssets = {
    savannah: {
        tree_01: 'map-tree-03sv.img',
        stone_01: 'map-stone-01.img',
        crate_01: 'map-crate-01.img',
        crate_02: 'map-crate-02sv.img',
    },
    colbat: {
        tree_01: 'map-tree-03cb.img',
        stone_01: 'map-stone-01cb.img',
        crate_01: 'map-crate-01.img',
        crate_02: 'map-crate-02.img',
    }
}
 
 
function applyMap(map, assets) {
    normalMap.biome = {...map.biome}
    obstacles.tree_01.img.sprite = imgToUrl(assets.tree_01)
    obstacles.stone_01.img.sprite = imgToUrl(assets.stone_01)
    obstacles.crate_01.img.sprite = imgToUrl(assets.crate_01)
    obstacles.crate_02.img.sprite = imgToUrl(assets.crate_02)
 
}
 
function imgToUrl(img) {
    return `https://surviv.io/img/map/${img.slice(0, -4)}.svg`
}
*/
window.webpackR;
var func = {
    webpack_inject: (w, e, get) => {
        window.webpackR = get.bind(this)
    },
};
if (typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject"],
        func,
        [["webpack_inject"]]
    ]);
}
let x = webpackR
let classicMap = x("d5ec3c16"), //0
    desertMap = x("ef7c973f"), //1
    woodsMap = x("45f86a38"), //2
    factionMap = x("903f46c9"), //3
    savannahMap = x("6a4e7802"), //5
    halloweenMap = x("9d3c0d8b"), //6
    cobaltMap = x("6df31f9c"), //7
    snowMap = x("4e269062"), //8
    valentineMap = x("eaa3b3bf"), //9
    stPatrickMap = x("781b6146"), //10
    mayFourthMap = x("b47bd76c"), //13
    beachMap = x("7565b14b"), //16
    contactMap = x("89933e10"), //17
    infernoMap = x("28e7ad85"), //18
    obstacles = x("03f4982a"),
    throwable = x("035f2ecb");
 
// add for each mode whatever assets need to change
let modeAssets = {
    classic: {tree_01: {img: {sprite: "map-tree-03.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 4083758}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-03.img",residue: "map-stone-res-02.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-01.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 24320}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-07.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 24320}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    desert: {tree_01: {img: {sprite: "map-tree-06.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 7700520}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01b.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-03b.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-18.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 12867840}},bush_01: {img: {sprite: "map-bush-05.img",residue: "map-bush-res-05.img",scale: 0.5},map: {color: 6971965}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-05.img",residue: "map-bush-res-05.img",scale: 0.5},map: {color: 6971965}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    woods: {tree_01: {img: {sprite: "map-tree-07.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 5199637}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-03.img",residue: "map-stone-res-02.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-19.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 4500224}},bush_01: {img: {sprite: "map-bush-01.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 6971965}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-06.img",residue: "map-bush-res-06.img",scale: 0.5},map: {color: 6971965}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    faction: {tree_01: {img: {sprite: "map-tree-08f.img",residue: "map-tree-res-01.img",scale: 0.35},map: {color: 995844}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 8224125}},stone_03: {img: {sprite: "map-stone-03f.img",residue: "map-stone-res-02f.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02f.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 13369344}},bush_01: {img: {sprite: "map-bush-01f.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 1793032}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-01f.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 1793032}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    savannah: {tree_01: {img: {sprite: "map-tree-03sv.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 4411673}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-03.img",residue: "map-stone-res-02.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-21.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 18799}},bush_01: {img: {sprite: "map-bush-01sv.img",residue: "map-bush-res-01sv.img",scale: 0.5},map: {color: 7569455}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-01sv.img",residue: "map-bush-res-01sv.img",scale: 0.5},map: {color: 24320}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    halloween: {tree_01: {img: {sprite: "map-tree-07.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 5199637}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.9},map: {color: 11776947}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-01.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 6971965}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-06.img",residue: "map-bush-res-06.img",scale: 0.5},map: {color: 6971965}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-02.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-02.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-02.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-02.svg"}}},
    cobalt: {tree_01: {img: {sprite: "map-tree-03cb.img",residue: "map-tree-res-01.img",scale: 1},map: {color: 2900834}},stone_01: {img: {sprite: "map-stone-01cb.img",residue: "map-stone-res-01cb.img",scale: 0.4},map: {color: 10265256}},stone_03: {img: {sprite: "map-stone-03cb.img",residue: "map-stone-res-02cb.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-01cb.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 2518873}},bush_04: {img: {sprite: "map-bush-04cb.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 2784099}},bush_07: {img: {sprite: "map-bush-01cb.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 2518873}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    snow: {tree_01: {img: {sprite: "map-tree-10.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 7571807}},stone_01: {img: {sprite: "map-stone-01x.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 6052956}},stone_03: {img: {sprite: "map-stone-03x.img",residue: "map-stone-res-02x.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01x.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02a.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-01x.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 4545840}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-07x.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 24320}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    valentine: {tree_01: {img: {sprite: "map-tree-13.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 4083758}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-03.img",residue: "map-stone-res-02.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02b.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-01.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 24320}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "bush-rose.img",residue: "bush-res-rose.img",scale: 0.5},map: {color: 24320}},frag: {lootImg: {sprite: "loot-throwable-heart.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-03.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-03.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-03.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part-03.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    stPatrick: {tree_01: {img: {sprite: "map-tree-14.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 1980462}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-08.img",residue: "map-stone-res-08.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-09a.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 24320}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-09a.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 24320}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    mayFourth: {tree_01: {img: {sprite: "map-tree-16.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 4272231}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-09.img",residue: "map-stone-res-09.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-24.img",residue: "map-crate-24-res.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-23.img",residue: "map-crate-23-res.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-11.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 113393}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-07.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 24320}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    beach: {tree_01: {img: {sprite: "map-tree-18.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 3050805}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-03.img",residue: "map-stone-res-02.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-12.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 3959104}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-07.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 24320}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    contact: {tree_01: {img: {sprite: "map-tree-19.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 2367516}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-11.img",residue: "map-stone-res-11.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-crate-02.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-13.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 2367516}},bush_04: {img: {sprite: "map-bush-13b.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 2367516}},bush_07: {img: {sprite: "map-bush-13c.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 2367516}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
    inferno: {tree_01: {img: {sprite: "map-tree-20.img",residue: "map-tree-res-01.img",scale: 0.7},map: {color: 6905681}},stone_01: {img: {sprite: "map-stone-01.img",residue: "map-stone-res-01.img",scale: 0.4},map: {color: 11776947}},stone_03: {img: {sprite: "map-stone-12.img",residue: "map-stone-res-02.img",scale: 0.4},map: {color: 5197647}},crate_01: {img: {sprite: "map-crate-01.img",residue: "map-crate-res-01.img",scale: 0.5},map: {color: 6697728}},crate_02: {img: {sprite: "map-pyre-01.img",residue: "map-crate-pyre-res.img",scale: 0.5},map: {color: 6697728}},bush_01: {img: {sprite: "map-bush-14b.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 6905681}},bush_04: {img: {sprite: "map-bush-04.img",residue: "map-bush-res-04.img",scale: 0.5},map: {color: 24320}},bush_07: {img: {sprite: "map-bush-14a.img",residue: "map-bush-res-01.img",scale: 0.5},map: {color: 6905681}},frag: {lootImg: {sprite: "loot-throwable-frag.img",},worldImg: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-nolever-01.svg',},handImg: {equip: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-01.svg',},},cook: {right: {sprite: 'https://surviv.io/img/proj/proj-frag-nopin-01.svg',},left: {sprite: 'https://surviv.io/img/proj/proj-frag-pin-part.svg',}},},},mirv_mini: {worldImg: {sprite: "https://surviv.io/img/proj/proj-mirv-mini-01.svg"}}},
}
 
function applyMap(map, assets) {
    classicMap.biome = {...map.biome}
    classicMap.desc = {...map.desc}
 
    obstacles.tree_01.img.sprite = imgToUrl(assets.tree_01.img.sprite)
    obstacles.stone_01.img.sprite = imgToUrl(assets.stone_01.img.sprite)
    obstacles.stone_03.img.sprite = imgToUrl(assets.stone_03.img.sprite)
    obstacles.crate_01.img.sprite = imgToUrl(assets.crate_01.img.sprite)
    obstacles.crate_02.img.sprite = imgToUrl(assets.crate_02.img.sprite)
    obstacles.bush_01.img.sprite = imgToUrl(assets.bush_01.img.sprite)
    obstacles.bush_04.img.sprite = imgToUrl(assets.bush_04.img.sprite)
    obstacles.bush_07.img.sprite = imgToUrl(assets.bush_07.img.sprite)
 
    obstacles.tree_01.img.residue = imgToUrl(assets.tree_01.img.residue)
    obstacles.stone_01.img.residue = imgToUrl(assets.stone_01.img.residue)
    obstacles.stone_03.img.residue = imgToUrl(assets.stone_03.img.residue)
    obstacles.crate_01.img.residue = imgToUrl(assets.crate_01.img.residue)
    obstacles.crate_02.img.residue = imgToUrl(assets.crate_02.img.residue)
    obstacles.bush_01.img.residue = imgToUrl(assets.bush_01.img.residue)
    obstacles.bush_04.img.residue = imgToUrl(assets.bush_04.img.residue)
    obstacles.bush_07.img.residue = imgToUrl(assets.bush_07.img.residue)
 
    obstacles.tree_01.img.scale = assets.tree_01.img.scale
    obstacles.stone_01.img.scale = assets.stone_01.img.scale
    obstacles.stone_03.img.scale = assets.stone_03.img.scale
    obstacles.crate_01.img.scale = assets.crate_01.img.scale
    obstacles.crate_02.img.scale = assets.crate_02.img.scale
    obstacles.bush_01.img.scale = assets.bush_01.img.scale
    obstacles.bush_04.img.scale = assets.bush_04.img.scale
    obstacles.bush_07.img.scale = assets.bush_07.img.scale
 
    obstacles.tree_01.map.color = assets.tree_01.map.color
    obstacles.stone_01.map.color = assets.stone_01.map.color
    obstacles.stone_03.map.color = assets.stone_03.map.color
    obstacles.crate_01.map.color = assets.crate_01.map.color
    obstacles.crate_02.map.color = assets.crate_02.map.color
    obstacles.bush_01.map.color = assets.bush_01.map.color
    obstacles.bush_04.map.color = assets.bush_04.map.color
    obstacles.bush_07.map.color = assets.bush_07.map.color
 
    throwable.frag.lootImg.sprite = assets.frag.lootImg.sprite
    throwable.frag.worldImg.sprite = assets.frag.worldImg.sprite
    throwable.frag.handImg.equip.right.sprite = assets.frag.handImg.equip.right.sprite
    throwable.frag.handImg.cook.right.sprite = assets.frag.handImg.cook.right.sprite
    throwable.frag.handImg.cook.left.sprite = assets.frag.handImg.cook.left.sprite
 
    throwable.mirv_mini.worldImg.sprite = assets.mirv_mini.worldImg.sprite
}
function imgToUrl(img) {
    return `https://surviv.io/img/map/${img.slice(0, -4)}.svg`
}
 
document.getElementById('background').style = "background-image:url('https://samerkizi.000webhostapp.com/img/re-classic.png')!important; filter:brightness(80%)"
document.getElementById('free-gp-offer').style = "padding:40px;height:auto;"
document.getElementById('free-gp-offer').querySelector('.pass-xp-buy-btn').remove();
document.getElementById('free-gp-offer').querySelector('.btn-offerwall-container').remove();
var changeMapButton = document.createElement('select');
changeMapButton.id = 'changeMapButton'
changeMapButton.style = `
    color: #fff;
    cursor: pointer;
    text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
    font-weight: 700;
    width: 100%;
    border: none;
    border-radius: 5px;
    padding: 12px 20px;
    font-size: 18px;
    background-color: #83af50;
    `
changeMapButton.onchange = function() {
    document.getElementById('0').click()
    var y = document.getElementById("changeMapButton").value
    if (y === "classic") {
        classicMap.biome = {"colors": {"background": 2118510,"water": 3310251,"waterRipple": 11792639,"beach": 13480795,"riverbank": 9461284,"grass": 8433481,"underground": 1772803,"playerSubmerge": 2854052,"playerGhillie": 8630096},"valueAdjust": 1,"sound": {"riverShore": "sand"},"particles": {"camera": ""},"tracerColors": {},"airdrop": {"planeImg": "map-plane-01.img","planeSound": "plane_01","airdropImg": "map-chute-01.img"}};
        classicMap.desc = {"name": "Normal","icon": "img/gui/emote.svg","buttonCss": "","buttonText": "index-play-mode-main"}
        applyMap(classicMap, modeAssets.classic)
        document.getElementById('background').style = "background-image:url('https://samerkizi.000webhostapp.com/img/re-classic.png')!important; filter:brightness(80%)"
        document.getElementById('changeMapButton').style = `
            color: #fff;
            cursor: pointer;
            text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
            font-weight: 700;
            width: 100%;
            border: none;
            border-radius: 5px;
            padding: 12px 20px;
            font-size: 22px;
            background-color: #83af50;
            `
    } else if (y === "desert") {
        applyMap(desertMap, modeAssets.desert)
        document.getElementById('background').style = "background-image:url('https://samerkizi.000webhostapp.com/img/desert-01.png')!important; filter:brightness(80%)"
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: desert-pulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "woods") {
        applyMap(woodsMap, modeAssets.woods)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: woods-pulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "faction") {
        applyMap(factionMap, modeAssets.faction)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: faction-pulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "savannah") {
        applyMap(savannahMap, modeAssets.savannah)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: savannah-pulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "halloween") {
        applyMap(halloweenMap, modeAssets.halloween)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: bloodPulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "cobalt") {
        applyMap(cobaltMap, modeAssets.cobalt)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: cobaltPulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "snow") {
        applyMap(snowMap, modeAssets.snow)
        document.getElementById('background').style = "background-image:url('https://samerkizi.000webhostapp.com/img/re-winter.png')!important; filter:brightness(80%)"
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: winterPulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "valentine") {
        applyMap(valentineMap, modeAssets.valentine)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: valentinePulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "stPatrick") {
        applyMap(stPatrickMap, modeAssets.stPatrick)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: stPatrickPulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "mayFourth") {
        applyMap(mayFourthMap, modeAssets.mayFourth)
        document.getElementById('changeMapButton').style = `
          background-color: #01baf1!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "beach") {
        applyMap(beachMap, modeAssets.beach)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: beach-pulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "contact") {
        applyMap(contactMap, modeAssets.contact)
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: contact-pulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    } else if (y === "inferno") {
        applyMap(infernoMap, modeAssets.inferno)
        document.getElementById('background').style = "background-image:url('https://samerkizi.000webhostapp.com/img/inferno-01.png')!important; filter:brightness(80%)"
        document.getElementById('changeMapButton').style = `
          -webkit-animation-name: infernoPulse;
          -webkit-animation-iteration-count: infinite;
          -webkit-animation-duration: 4s!important;
 
          color: #fff;
          cursor: pointer;
          text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
          font-weight: 700;
          width: 100%;
          border: none;
          border-radius: 5px;
          padding: 12px 20px;
          font-size: 22px;
          `
    }
}
changeMapButton.innerHTML =
    `<option value="classic">Classic</option>
    <option value="desert">Desert</option>
    <option value="woods">Woods</option>
    <option value="faction">50v50</option>
    <option value="savannah">Savannah</option>
    <option value="halloween">Halloween</option>
    <option value="cobalt">Cobalt</option>
    <option value="snow">Snow</option>
    <option value="valentine">Valentine</option>
    <option value="stPatrick">Saint Patrick</option>
    <option value="mayFourth">May 4th</option>
    <option value="beach">Beach</option>
    <option value="contact">Contact</option>
    <option value="inferno">Inferno</option>`
document.getElementById('free-gp-offer').appendChild(changeMapButton);
 
setInterval(function () {
    document.getElementById('1').onclick = function() {
        document.getElementById("changeMapButton").value = "classic"
        webpackR('d5ec3c16').biome = {"colors": {"background": 2118510,"water": 3310251,"waterRipple": 11792639,"beach": 13480795,"riverbank": 9461284,"grass": 8433481,"underground": 1772803,"playerSubmerge": 2854052,"playerGhillie": 8630096},"valueAdjust": 1,"sound": {"riverShore": "sand"},"particles": {"camera": ""},"tracerColors": {},"airdrop": {"planeImg": "map-plane-01.img","planeSound": "plane_01","airdropImg": "map-chute-01.img"}};
        webpackR('d5ec3c16').desc = {"name": "Normal","icon": "img/gui/emote.svg","buttonCss": "","buttonText": "index-play-mode-main"}
 
        function applyMap(map, assets) {
            classicMap.biome = {...map.biome}
            classicMap.desc = {...map.desc}
 
            obstacles.tree_01.img.sprite = imgToUrl(assets.tree_01.img.sprite)
            obstacles.stone_01.img.sprite = imgToUrl(assets.stone_01.img.sprite)
            obstacles.stone_03.img.sprite = imgToUrl(assets.stone_03.img.sprite)
            obstacles.crate_01.img.sprite = imgToUrl(assets.crate_01.img.sprite)
            obstacles.crate_02.img.sprite = imgToUrl(assets.crate_02.img.sprite)
            obstacles.bush_01.img.sprite = imgToUrl(assets.bush_01.img.sprite)
            obstacles.bush_04.img.sprite = imgToUrl(assets.bush_04.img.sprite)
            obstacles.bush_07.img.sprite = imgToUrl(assets.bush_07.img.sprite)
 
            obstacles.tree_01.img.residue = imgToUrl(assets.tree_01.img.residue)
            obstacles.stone_01.img.residue = imgToUrl(assets.stone_01.img.residue)
            obstacles.stone_03.img.residue = imgToUrl(assets.stone_03.img.residue)
            obstacles.crate_01.img.residue = imgToUrl(assets.crate_01.img.residue)
            obstacles.crate_02.img.residue = imgToUrl(assets.crate_02.img.residue)
            obstacles.bush_01.img.residue = imgToUrl(assets.bush_01.img.residue)
            obstacles.bush_04.img.residue = imgToUrl(assets.bush_04.img.residue)
            obstacles.bush_07.img.residue = imgToUrl(assets.bush_07.img.residue)
 
            obstacles.tree_01.img.scale = assets.tree_01.img.scale
            obstacles.stone_01.img.scale = assets.stone_01.img.scale
            obstacles.stone_03.img.scale = assets.stone_03.img.scale
            obstacles.crate_01.img.scale = assets.crate_01.img.scale
            obstacles.crate_02.img.scale = assets.crate_02.img.scale
            obstacles.bush_01.img.scale = assets.bush_01.img.scale
            obstacles.bush_04.img.scale = assets.bush_04.img.scale
            obstacles.bush_07.img.scale = assets.bush_07.img.scale
 
            obstacles.tree_01.map.color = assets.tree_01.map.color
            obstacles.stone_01.map.color = assets.stone_01.map.color
            obstacles.stone_03.map.color = assets.stone_03.map.color
            obstacles.crate_01.map.color = assets.crate_01.map.color
            obstacles.crate_02.map.color = assets.crate_02.map.color
            obstacles.bush_01.map.color = assets.bush_01.map.color
            obstacles.bush_04.map.color = assets.bush_04.map.color
            obstacles.bush_07.map.color = assets.bush_07.map.color
 
            throwable.frag.lootImg.sprite = assets.frag.lootImg.sprite
            throwable.frag.worldImg.sprite = assets.frag.worldImg.sprite
            throwable.frag.handImg.equip.right.sprite = assets.frag.handImg.equip.right.sprite
            throwable.frag.handImg.cook.right.sprite = assets.frag.handImg.cook.right.sprite
            throwable.frag.handImg.cook.left.sprite = assets.frag.handImg.cook.left.sprite
 
            throwable.mirv_mini.worldImg.sprite = assets.mirv_mini.worldImg.sprite
        }
        function imgToUrl(img) {
            return `https://surviv.io/img/map/${img.slice(0, -4)}.svg`
        }
        applyMap(savannahMap, modeAssets.savannah)
        document.getElementById('background').style = "background-image:url('https://samerkizi.000webhostapp.com/img/re-classic.png')!important; filter:brightness(80%)"
        document.getElementById('changeMapButton').style = `
            color: #fff;
            cursor: pointer;
            text-shadow: rgb(0 0 0 / 50%) 0px 1px 2px;
            font-weight: 700;
            width: 100%;
            border: none;
            border-radius: 5px;
            padding: 12px 20px;
            font-size: 22px;
            background-color: #83af50;
            `
    }
},0)