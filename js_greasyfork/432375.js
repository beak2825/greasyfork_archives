// ==UserScript==
// @name         Tha
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Thaaaaaaaaaaa
// @author      Who
// @match        https://surviv.io
// @match        https://surviv.io/*
// @match        http://surviv.io/?region=na&zone=sfo
// @match        http://surviv.io/?region=na&zone=mia
// @match        http://surviv.io/?region=na&zone=nyc
// @match        http://surviv.io/?region=na&zone=chi
// @match        http://surviv.io/?region=sa&zone=sao
// @match        http://surviv.io/?region=eu&zone=fra
// @match        http://surviv.io/?region=eu&zone=waw
// @match        http://surviv.io/?region=as&zone=sgp
// @match        http://surviv.io/?region=as&zone=nrt
// @match        http://surviv.io/?region=as&zone=hkg
// @match        http://surviv.io/?region=kr&zone=sel
// @match        https://surviv.io/?region=na&zone=sfo
// @match        https://surviv.io/?region=na&zone=mia
// @match        https://surviv.io/?region=na&zone=nyc
// @match        https://surviv.io/?region=na&zone=chi
// @match        https://surviv.io/?region=sa&zone=sao
// @match        https://surviv.io/?region=eu&zone=fra
// @match        https://surviv.io/?region=eu&zone=waw
// @match        https://surviv.io/?region=as&zone=sgp
// @match        https://surviv.io/?region=as&zone=nrt
// @match        https://surviv.io/?region=as&zone=hkg
// @match        https://surviv.io/?region=kr&zone=sel
// @match        https://surviv.io/?region=as&zone=vnm
// @match        http://surviv2.io*
// @match        https://surviv2.io*
// @match        http://2dbattleroyale.com*
// @match        https://2dbattleroyale.com*
// @match        http://2dbattleroyale.org*
// @match        https://2dbattleroyale.org*
// @match        http://piearesquared.info*
// @match        https://piearesquared.info*
// @match        http://thecircleisclosing.com*
// @match        https://thecircleisclosing.com*
// @match        http://archimedesofsyracuse.info*
// @match        https://archimedesofsyracuse.info*
// @match        http://secantsecant.com*
// @match        https://secantsecant.com*
// @match        http://parmainitiative.com*
// @match        https://parmainitiative.com*
// @match        http://nevelskoygroup.com*
// @match        https://nevelskoygroup.com*
// @match        http://kugahi.com*
// @match        https://kugahi.com*
// @match        http://chandlertallowmd.com*
// @match        https://chandlertallowmd.com*
// @match        http://ot38.club*
// @match        https://ot38.club*
// @match        http://kugaheavyindustry.com*
// @match        https://kugaheavyindustry.com*
// @match        http://rarepotato.com*
// @match        https://rarepotato.com*
// @icon        https://www.beretta.com/assets/0/15/DimRegular/m9_listing0011.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432375/Tha.user.js
// @updateURL https://update.greasyfork.org/scripts/432375/Tha.meta.js
// ==/UserScript==

(function() {
    'use strict';
//bom
    PIXI.utils.TextureCache["loot-throwable-frag.img"]=PIXI.utils.TextureCache["face-poo.img"]
     PIXI.utils.TextureCache["proj-frag-pin-01.img"]=PIXI.utils.TextureCache["face-poo.img"]
    PIXI.utils.TextureCache["proj-mirv-pin.img"]=PIXI.utils.TextureCache["emote-trollface.img"]
    PIXI.utils.TextureCache["proj-mirv-mini-01.img"]=PIXI.utils.TextureCache["emote-trollface.img"]
    PIXI.utils.TextureCache["loot-throwable-mirv.img"]=PIXI.utils.TextureCache["emote-trollface.img"]

    PIXI.utils.TextureCache["proj-frag-nopin-nolever-01.img"]=PIXI.utils.TextureCache["face-poo.img"]
    PIXI.utils.TextureCache["proj-mirv-nopin-nolever.img"]=PIXI.utils.TextureCache["emote-trollface.img"]
    PIXI.utils.TextureCache["proj-smoke-nopin-nolever.img"]=PIXI.utils.TextureCache["donut.img"]
    PIXI.utils.TextureCache["proj-bomb-iron-01.img"]=PIXI.utils.TextureCache["emote-trollface.img"]
//death
    PIXI.utils.TextureCache["skull.img"]=PIXI.utils.TextureCache["tombstone.img"]
//skin
    PIXI.utils.TextureCache["player-base-outfitTurkey.img"]=PIXI.utils.TextureCache["player-base-outfitDC.img"]
    PIXI.utils.TextureCache["player-hands-turkey.img"]=PIXI.utils.TextureCache["player-hands-02.img"]
    PIXI.utils.TextureCache["player-back-turkey.img"]=PIXI.utils.TextureCache["player-circle-base-02.img"]
    PIXI.utils.TextureCache["loot-shirt-outfitTurkey.img"]=PIXI.utils.TextureCache["loot-shirt-outfitMod.img"]
// :)
    var lol = ""


var func = {
    webpack_inject2: (w, e, get) => {
        lol = get("03f4982a")
    },
};

if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject2"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject2"],
        func,
        [["webpack_inject2"]]
    ]);
}

Object.keys(lol).forEach(function(key2) {
    if(key2.match(/crate_02/g)) {
        lol[key2].img.sprite ="https://surviv.io/img/map/map-crate-02f.svg"
    } else if(key2.match(/bush_01/g)) {
        lol[key2].img.sprite = "https://surviv.io/img/map/map-bush-08.svg"
    } else if(key2.match(/crate_01/g)) {
        lol[key2].img.sprite = "https://surviv.io/img/map/map-crate-02a.svg"

    } else if(key2.match(/barrel_01/g)) {
        lol[key2].img.sprite = "https://surviv.io/img/emotes/emote-trollface.svg"
    }
})


})();