// ==UserScript==
// @name         Customs Map Survivio
// @namespace    https://github.com/notKaiAnderson/
// @version      0.2
// @description  try to take over the world!
// @author       armaxer
// @match        *://surviv.io/*
// @grant        none
// @icon         https://i.imgur.com/sr7Dfqh.png
// @downloadURL https://update.greasyfork.org/scripts/394376/Customs%20Map%20Survivio.user.js
// @updateURL https://update.greasyfork.org/scripts/394376/Customs%20Map%20Survivio.meta.js
// ==/UserScript==

(function() {
    'use strict';

var left = document.querySelector('#ad-block-left');
left.innerHTML = `<div class="wrapper">
  <div class="header">
    <h2>Select map</h2>
  </div>
  <div class="maps">
    <div class="map normalmap">
      <img src="https://i.imgur.com/xB2vbaR.png" alt="" class="map-img" />
      <h4 class="map-name">Normal Map</h4>
    </div>
    <div class="map mapcobalt">
      <img src="https://i.imgur.com/9BUv05j.png" alt="" class="map-img" />
      <h4 class="map-name">Map Cobalt</h4>
    </div>
    <div class="map desertmap">
      <img src="https://i.imgur.com/f410XOg.png" alt="" class="map-img" />
      <h4 class="map-name">Desert Map</h4>
    </div>
    <div class="map spookymap">
      <img src="https://i.imgur.com/orsTb9S.png" alt="" class="map-img" />
      <h4 class="map-name">Halloween Map</h4>
    </div>
    <div class="map fanctionmap">
      <img src="https://i.imgur.com/n2XHuMb.png" alt="" class="map-img" />
      <h4 class="map-name">50v50 Map</h4>
    </div>
    <div class="map savannahmap">
      <img src="https://i.imgur.com/spGZ26Q.png" alt="" class="map-img" />
      <h4 class="map-name">Savannah Map</h4>
    </div>
     <div class="map springmap">
     <img src="https://i.imgur.com/gYSwFG2.png" alt="" class"map-img" />
     <h4 class="map-name">Autumn Map</h4>
    </div>
     <div class="map snowmap">
     <img src="https://i.imgur.com/DDOkX2e.png" alt="" class"map-img />
     <h4 class="map-name">Winter Map</h4>
  </div>
  <div class="map woodsmap">
    <img src="https://i.imgur.com/VJJ7e28.png" alt="" class="map-img" />
    <h4 class="map-name">Woods Map</h4>
  </div>
  </div>
`;

var wrapper = document.querySelector('.wrapper');
wrapper.setAttribute("style", "width: 100%; overflow-y: scroll; height: 100%;text-align: center; box-sizing: border-box;" );

var maps = document.querySelector('.maps');
maps.setAttribute("style", "display: flex; flex-wrap: wrap; box-sizing: border-box;");

left.setAttribute("style", "height: 325px; box-sizing: border-box;");

var map = document.querySelectorAll('.map');
map.forEach(item => {item.setAttribute("style", "flex-grow: 1; flex-basis: 25%; cursor: pointer; box-sizing: border-box;")})

function addStyleString(str) {
  var node = document.createElement('style');
  node.innerHTML = str;
  document.body.appendChild(node);
}
addStyleString('.active { color: green; border: 2px solid #668e38;  }');


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
xx.biome.colors.grass= 0xdfa757 ;
xx.biome.colors.underground= 0x3d0d03 ;
xx.biome.colors.riverbank= 0xb25e24 ;
xx.biome.colors.water= 0x8a9b4e ;

}

function spookymap() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0x64410e ;
xx.biome.colors.grass= 0x212404 ;
xx.biome.colors.underground= 0x120801 ;
xx.biome.colors.water= 0x280000 ;
xx.biome.colors.riverbank= 0x3c1b05 ;
}

function aquaticAvenger() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0xCB7132 ;
xx.biome.colors.grass= 0xB4B02E ;
xx.biome.colors.underground= 0x3D0D03 ;
xx.biome.colors.water= 0x41A4AA ;
xx.biome.colors.riverbank= 0x653313 ;
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
xx.biome.colors.grass= 0x8e832a ;
xx.biome.colors.underground= 0x1b0d03 ;
xx.biome.colors.water= 0x3282ab ;
xx.biome.colors.riverbank= 0x77360b ;

}
function snowmap() {
var xx = webpackJsonp([],null,["d5ec3c16"]);
xx.biome.colors.beach= 0xcdb35b ;
xx.biome.colors.grass= 0xbdbdbd ;
xx.biome.colors.underground= 0x1b0d03 ;
xx.biome.colors.water= 0x0c4d51 ;
xx.biome.colors.riverbank= 0x905e24 ;
}



// woods map

function woodsmap () {
  var xx = webpackJsonp([],null,["d5ec3c16"]);
  xx.biome.colors.beach= 0xf4ae48 ;
  xx.biome.colors.grass= 0x5c910a ;
  xx.biome.colors.underground= 0x1b0d03 ;
  xx.biome.colors.water= 0x3282ab ;
  xx.biome.colors.riverbank= 0x8a8a8a ;
}


function removeBorder() {
  map.forEach(item => { item.classList.remove('active') })
}

map.forEach(function (item) {
        var background = document.querySelector('#background');
        item.addEventListener('click', function () {

            if (item.className == "map mapcobalt") {
                mapcobalt();
                removeBorder();
                item.className += " active";
            }
            if (item.className == "map normalmap") {
                normalmap();
                removeBorder();
                item.className += " active";
            }
            if (item.className == "map desertmap") {
                desertmap();
                removeBorder();
                item.className += " active";
            }
            if (item.className == "map spookymap") {
                background.style.backgroundImage = "url('https://i.imgur.com/u5jH3co.png')";
                spookymap();
                removeBorder();
                item.className += " active";
            }
            if (item.className == "map savannahmap") {
                aquaticAvenger();
                removeBorder();
                item.className += " active";
            }
            if (item.className == "map fanctionmap") {
                factionmap();
                removeBorder();
                item.className += " active";
            }
            if (item.className == "map woodsmap") {
                woodsmap();
                removeBorder();
                item.className += " active";
            }
            if (item.className == "map snowmap") {
                snowmap();
                removeBorder();
                item.className += " active";
            }
            if (item.className == "map springmap") {
                springmap();
                removeBorder();
                item.className += " active";
            }
        });
    });
})();