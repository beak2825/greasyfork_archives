// ==UserScript==
// @name         Surviv.io Halloween Grenades
// @namespace    customSurvivGrenades
// @version      0.11
// @description  Change grenades in surviv.io to be pumpkin-styled, as it should have been from 2018 and 2019. Affects all modes.
// @author       Garlic
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
// @icon         https://surviv.io/img/particles/part-frag-pin-02.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434607/Survivio%20Halloween%20Grenades.user.js
// @updateURL https://update.greasyfork.org/scripts/434607/Survivio%20Halloween%20Grenades.meta.js
// ==/UserScript==

(function() {
    'use strict';
var arr=[
"proj-frag-pin-01.img","https://surviv.io/img/proj/proj-frag-pin-02.svg",
"proj-frag-nopin-01.img","https://surviv.io/img/proj/proj-frag-nopin-02.svg",
"proj-frag-nopin-nolever-01.img","https://surviv.io/img/proj/proj-frag-nopin-nolever-02.svg",
"part-frag-burst-01.img","https://surviv.io/img/particles/part-frag-burst-02.svg",
"proj-mirv-mini-01.img","https://surviv.io/img/proj/proj-mirv-mini-02.svg"
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