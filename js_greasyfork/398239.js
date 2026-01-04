// ==UserScript==
// @name         Surviv.io play 50v50 on normal map
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ban me for creating cheats :(
// @author       d-armax#4202 (discord)
// @match        https://surviv.io/
// @match        http://surviv.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398239/Survivio%20play%2050v50%20on%20normal%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/398239/Survivio%20play%2050v50%20on%20normal%20map.meta.js
// ==/UserScript==

(function() {
    'use strict';

var mapId = webpackJsonp([], null, ["903f46c9"]);
mapId.biome.colors.beach = 0xcdb35b;
mapId.biome.colors.grass = 0x80af49;
mapId.biome.colors.underground = 0x1b0d03;
mapId.biome.colors.water = 0x3282ab;
mapId.biome.colors.riverbank = 0x905e24;
mapId.biome.colors.playerGhillie = 0x83af50;
    mapId.biome.colors.background = 0x20536E;

// Obstacles Changer
var obstacles = webpackJsonp([], null, ["03f4982a"]);

obstacles.tree_08f.img.sprite = "https://surviv.io/img/map/map-tree-03.svg"

obstacles.stone_01.img.sprite = "https://surviv.io/img/map/map-stone-01.svg"
obstacles.stone_03f.img.sprite = "https://surviv.io/img/map/map-stone-03.svg"
obstacles.stone_04.img.sprite = "https://surviv.io/img/map/map-stone-04.svg"

obstacles.airdrop_crate_01.img.sprite = "https://surviv.io/img/map/map-airdrop-01.svg"
obstacles.airdrop_crate_02.img.sprite = "https://surviv.io/img/map/map-airdrop-02.svg"

obstacles.bush_01f.img.sprite = "https://surviv.io/img/map/map-bush-01.svg"
obstacles.bush_04.img.sprite = "https://surviv.io/img/map/map-bush-04.svg"
obstacles.bush_07.img.sprite = "https://surviv.io/img/map/map-bush-07.svg"

obstacles.tree_08f.img.scale = 0.69

// Tree color on mini map
var MapNub = webpackJsonp([], null, ["03f4982a"]);
MapNub.tree_08f.map.color = 0x42552F
})();