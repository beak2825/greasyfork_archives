// ==UserScript==
// @name         SURVIVIO CUSTOMS MAPS!
// @namespace    https://github.com/notKaiAnderson/
// @version      0.1
// @description  try to take over the world!
// @author       armaxer
// @match        *://surviv.io/*
// @grant        none
// @icon         https://i.imgur.com/sr7Dfqh.png
// @downloadURL https://update.greasyfork.org/scripts/394366/SURVIVIO%20CUSTOMS%20MAPS%21.user.js
// @updateURL https://update.greasyfork.org/scripts/394366/SURVIVIO%20CUSTOMS%20MAPS%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

var left = document.querySelector('#ad-block-left');
left.innerHTML = `<div class="container">
  <div class="header">
    <h2>Select map</h2>
  </div>
  <div class="skins">
    <div class="skin normalmap">
      <img src="https://i.imgur.com/xB2vbaR.png" alt="" class="skin-img" />
      <h4 class="skin-name">Normal Map</h4>
    </div>
    <div class="skin mapcobalt">
      <img src="https://i.imgur.com/9BUv05j.png" alt="" class="skin-img" />
      <h4 class="skin-name">Map Cobalt</h4>
    </div>
    <div class="skin desertmap">
      <img src="https://i.imgur.com/f410XOg.png" alt="" class="skin-img" />
      <h4 class="skin-name">Desert Map</h4>
    </div>
    <div class="skin spookymap">
      <img src="https://i.imgur.com/orsTb9S.png" alt="" class="skin-img" />
      <h4 class="skin-name">Halloween Map</h4>
    </div>

    <div class="skin fanctionmap">
      <img src="https://i.imgur.com/n2XHuMb.png" alt="" class="skin-img" />
      <h4 class="skin-name">50v50 Map</h4>
    </div>
    <div class="skin savannahmap">
      <img src="https://i.imgur.com/spGZ26Q.png" alt="" class="skin-img" />
      <h4 class="skin-name">Savannah Map</h4>
    </div>
    <div class="skin woodsmap">
      <img src="https://i.imgur.com/VJJ7e28.png" alt="" class="skin-img" />
      <h4 class="skin-name">Woods Map</h4>
    </div>
     <div class="skin springmap">
     <img src="https://i.imgur.com/gYSwFG2.png" alt="" class"skin-img" />
     <h4 class="skin-name">Autumn Map</h4>
  </div>
</div>
`

var container = document.querySelector('.container');
container.setAttribute("style", "width: 100%; overflow-y: scroll; height: 100%;text-align: center;");

var skins = document.querySelector('.skins');
skins.setAttribute("style", "display: flex; flex-wrap: wrap;");

left.setAttribute("style", "height: 325px; box-sizing: border-box;");

var skin = document.querySelectorAll('.skin');
skin.forEach(item => {item.setAttribute("style", "flex-grow: 1; flex-basis: 50%; cursor: pointer;")})




function mapcobalt() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0x443D3A ;
xx.biome.colors.grass= 0x4D5A68 ;
xx.biome.colors.underground= 0x1B0D03 ;
xx.biome.colors.riverbank= 0x653313 ;
xx.biome.colors.water= 0x003571 ;
xx.biome.colors.background= 0x020E18 ;
}

function normalmap() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0xcdb35b ;
xx.biome.colors.grass= 0x80af49 ;
xx.biome.colors.underground= 0x1b0d03 ;
xx.biome.colors.water= 0x3282ab ;
xx.biome.colors.riverbank= 0x905e24 ;
}

function desertmap() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0xc9843a ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.grass= 0xdfa757 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.underground= 0x3d0d03 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.water= 0x8a9b4e ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.riverbank= 0xb25e24 ;

}

function spookymap() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0x64410e ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.grass= 0x212404 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.underground= 0x120801 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.water= 0x280000 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.riverbank= 0x3c1b05 ;
}

function aquaticAvenger() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0xCB7132 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.grass= 0xB4B02E ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.underground= 0x3D0D03 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.water= 0x41A4AA ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.riverbank= 0x653313 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.background= 0x1C5B5F ;

}

function factionmap() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0x8e5632 ;
xx.biome.colors.grass= 0x4e6128 ;
xx.biome.colors.underground= 0x1b0d03 ;
xx.biome.colors.water= 0x071B36 ;
xx.biome.colors.riverbank= 0x653313 ;

}

function springmap() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0xefb35b ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.grass= 0x8e832a ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.underground= 0x1b0d03 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.water= 0x3282ab ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.riverbank= 0x77360b ;

}


// woods map

function woodsmap () {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0xf4ae48 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.grass= 0x5c910a ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.underground= 0x1b0d03 ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.water= 0x3282ab ;
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.riverbank= 0x8a8a8a ;
}


skin.forEach(function (item) {
        item.addEventListener('click', function () {

            if (item.className == "skin mapcobalt") {
                mapcobalt();
            }
            if (item.className == "skin normalmap") {
                normalmap();
            }
            if (item.className == "skin desertmap") {
                desertmap();
            }
            if (item.className == "skin spookymap") {
                spookymap();
            }
            if (item.className == "skin savannahmap") {
                aquaticAvenger();
            }
            if (item.className == "skin fanctionmap") {
                factionmap();
            }
            if (item.className == "skin woodsmap") {
                woodsmap();
            }
            if (item.className == "skin springmap") {
                springmap();
            }
        });
    });
})();