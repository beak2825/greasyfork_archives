// ==UserScript==
// @name         Survivio Mods by VNBPM (TEST VERSION)
// @namespace    https://greasyfork.org/scripts/434290-survivio-mods-by-vnbpm/code/Survivio%20Mods%20by%20VNBPM.user.js
// @version      x.x.x
// @icon         https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/icons/icon-v1.png
// @description  All features are add in here before add it to original scripts. Post to test the update version 
// @author       VNBPM on YT
// @license MIT
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435838/Survivio%20Mods%20by%20VNBPM%20%28TEST%20VERSION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435838/Survivio%20Mods%20by%20VNBPM%20%28TEST%20VERSION%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
var cobalt = ""
var faction = ""
var throwables = ""
var skinOutfit = ""
var ceilings = ""
var obstacles2 = ""
var weapons = ""
var func = {
    webpack_inject1: (w, e, get) => {
        cobalt = get("6df31f9c")
        faction = get("903f46c9")
        throwables = get("035f2ecb")
        skinOutfit = get("63d67e9d")
        ceilings = get("03f4982a")
        obstacles2 = get("03f4982a")
        weapons = get("ad1c4e70")
    },
};
if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject1"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject1"],
        func,
        [["webpack_inject1"]]
    ]);
}
Object.keys(cobalt).forEach(function(key) {
    if(key.match(/biome/g)) {
        cobalt[key].colors.grass = 0x8E9BA4;
    }
})
Object.keys(faction).forEach(function(key1) {
    if(key1.match(/biome/g)) {
        faction[key1].colors.grass = 0x609623;
    }
})
Object.keys(throwables).forEach(function(key2) {
    if(key2.match(/mirv_mini/g)) {
    throwables[key2].worldImg.scale = .15
    } else if(key2.match(/frag|mirv|mine/g)) {
    throwables[key2].worldImg.scale = .2
    }
})
Object.keys(skinOutfit).forEach(function(key3) {
    if(key3.match(/outfit/g)) {
        skinOutfit[key3].skinImg.handSprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/EC9ECB3D-E9B9-4222-AA00-16BC414812E5.png";
    }
})
Object.keys(ceilings).forEach(function(key4) {
    if(key4.match(/container_05/g)) return
    if(ceilings[key4].type === "building") {
        for(var ceilImg in ceilings[key4].ceiling.imgs) {
            ceilings[key4].ceiling.imgs[ceilImg].sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/lock/2CD6754F-AE61-4C37-BF0D-131C8841060A.png"
        }
    }
})
Object.keys(obstacles2).forEach(function(key5) {
      if(key6.match(/tree_09/g)) {
        obstacles2[key6].img.sprite = "https://surviv.io/img/map/map-tree-09.svg"
    } else if(key5.match(/tree_01cb/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/tree-cobalt.png";
    } else if(key5.match(/tree_01|tree_06|tree_07/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/tree.png";
    }  else if(key5.match(/tree_10/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/ABFC80E7-7F73-4C58-97FC-B66C3E0C7079.png";
    } else if(key5.match(/tree_08/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/8A60FE2A-FA40-40F7-8573-83765C49B6A2.png";
    } else if(key5.match(/tree_05/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/tree-desert-05.png";
    } else if(key5.match(/tree_05c/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/tree-desert-05c.png";
    } else if(key5.match(/tree_12|tree_13|tree_14/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/tree-savan.png";
    } else if(key5.match(/table/g)) {
        obstacles2[key5].img.position = absolute;
    } else if(key5.match(/brush_01sv/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/brush-01sv.png";
    } else if(key5.match(/brush_02sv/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/brush-02sv.png";
    } else if(key5.match(/stone_01/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/stone/6B848F20-3E2E-4797-A8CB-AE1FF8A022CE.png";
    } else if(key5.match(/stone_03/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/stone/21BE40C0-CD99-4296-BFD5-4921FEC323C0.png";
    } else if(key5.match(/bush_09/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archiveFINAL/main/bush_09.png";
    } else if(key5.match(/bush/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archiveFINAL/main/bush.png";
    } else if(key5.match(/barrel_01/g)) {
        obstacles2[key5].img.sprite = "campfire.img";
    } else if(key5.match(/container_06/g)) {
        obstacles2[key5].map.color = 0xe3e309;
    } else if(key5.match(/tree_03sv/g)) {
        obstacles2[key5].img.sprite = "https://surviv.io/img/map/map-tree-03sv.svg";
        obstacles2[key5].map.color = 0xffffff;
        obstacles2[key5].map.scale = 4;
    } else if(key5.match(/tree_03/g)) {
        obstacles2[key5].img.sprite = "https://surviv.io/img/map/map-tree-03.svg";
        obstacles2[key5].map.color = 0xffffff;
        obstacles2[key5].map.scale = 5;
    } else if(key5.match(/stone_02/g)) {
        obstacles2[key5].map.color = 0x193f82;
        obstacles2[key5].map.scale = 5;
    } else if(key5.match(/stone_04/g)) {
        obstacles2[key5].map.color = 0xeb175a;
        obstacles2[key5].map.scale = 2;
    } else if(key5.match(/stone_05/g)) {
        obstacles2[key5].map.color = 0xeb175a;
        obstacles2[key5].map.scale = 2;
    } else if(key5.match(/bunker_storm_01/g)) {
        obstacles2[key5].map.color = 0xe3e309;
    } else if(key6.match(/tree_04|tree_sv/g)) {
        obstacles2[key6].img.sprite = "https://surviv.io/img/map/map-tree-04.svg";
    } else if(key5.match(/tree/g)) {
        obstacles2[key5].img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/archive/main/tree.png";
    }
})
Object.keys(weapons).forEach(function(key5) {
    if(key5.match(/mp220/g)) {
        weapons[key5].worldImg.scale.x = .85
        weapons[key5].worldImg.scale.y = .85
    }
})
})();
// ==/UserScript==
 
(function() {
    'use strict';
var arr=[
"part-smoke-01.img","https://surviv.io/stats/img/ui/skull.svg",
"part-smoke-02.img","https://surviv.io/stats/img/ui/skull.svg",
"part-smoke-03.img","https://surviv.io/stats/img/ui/skull.svg",
"proj-frag-nopin-nolever-01.img","pineapple.img",
"proj-mirv-nopin-nolever.img","baguette.img",
"proj-mirv-mini-01.img","acorn.img",
"proj-mirv-mini-02.img","acorn.img",
"proj-smoke-nopin-nolever.img","donut.img",
"loot-melee-woodaxe.img","https://surviv.io/img/map/map-piano-01.svg",
"loot-melee-machete-taiga.img","face-poo.img",
"map-building-container-ceiling-05.img","https://surviv.io/img/map/map-building-container-ceiling-05.svg",
"loot-melee-woodaxe-bloody.img","https://surviv.io/img/map/map-piano-01.svg",
"loot-melee-katana.img","https://raw.githubusercontent.com/humphreygaming/surviv-cheat-source/master/src/file/textures/ice_katana.dev.png",
"gun-mp220-01.img","map-toilet-04.img"
];
var triesrem=20;
function doarr() {
    if(PIXI?.utils?.TextureCache[arr[0]]) {
        for(var i=0;i+1 < arr.length; i+=2) {
            PIXI.utils.TextureCache[arr[i]]
            =
            PIXI.Texture.fromImage(arr[i+1]);
        }
        return;
    }
 
    if(triesrem>0)  {
       triesrem--;
        setTimeout(doarr,1000);
    }
}
setTimeout(()=>doarr(),1000);
})();