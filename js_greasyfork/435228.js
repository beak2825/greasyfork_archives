// ==UserScript==
// @name         Survivio Looker by VNBPM
// @namespace    https://greasyfork.org/scripts/434290-survivio-mods-by-vnbpm/code/Survivio%20Mods%20by%20VNBPM.user.js
// @version      1.4.3.6
// @icon         https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/icons/icon-v1.png
// @description  Reupload and no match to other sites more
// @author       VNBPM on YT
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
// @downloadURL https://update.greasyfork.org/scripts/435228/Survivio%20Looker%20by%20VNBPM.user.js
// @updateURL https://update.greasyfork.org/scripts/435228/Survivio%20Looker%20by%20VNBPM.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
var arr=[

"map-brush-01sv.img","https://raw.githubusercontent.com/iBLiSSIN/images/main/brush/brush_01.png",

"map-brush-02sv.img","https://raw.githubusercontent.com/iBLiSSIN/images/main/brush/brush_02.png",

"","",

"","",

"","",

"","",

"","",

"","",

"","",

"","",

"","",

"","",

"","",
"part-smoke-01.img","https://raw.githubusercontent.com/iBLiSSIN/archive/main/D44A5289-1FF3-4FC1-B085-6925FCD52C2E.png",
"part-smoke-02.img","https://raw.githubusercontent.com/iBLiSSIN/archive/main/D44A5289-1FF3-4FC1-B085-6925FCD52C2E.png",
"part-smoke-03.img","https://raw.githubusercontent.com/iBLiSSIN/archive/main/D44A5289-1FF3-4FC1-B085-6925FCD52C2E.png",
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