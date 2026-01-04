// ==UserScript==
// @name         Brush Packs for ParticleShop - bundles
// @namespace    http://tampermonkey.net/
// @version      2023.7.24
// @description  What brushes are found in bundles, volumes and packs.
// @author       Radim
// @match        https://www.painterartist.com/en/product/particleshop/brushes/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=painterartist.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471613/Brush%20Packs%20for%20ParticleShop%20-%20bundles.user.js
// @updateURL https://update.greasyfork.org/scripts/471613/Brush%20Packs%20for%20ParticleShop%20-%20bundles.meta.js
// ==/UserScript==
/* eslint-disable */

(function() {
  'use strict';

var packages = [
  /* 0 */ "none",
  /* 1 */ "ParticleShop Ultimate Bundle Volume 2",
  /* 2 */ "ParticleShop Ultimate Bundle Volume 3",
  /* 3 */ "Photo Editors Starter Pack",
  /* 4 */ "Ultimate Brush Pack Bundle"
];

var brushes = [
 { "brush": "Gestural Illustration", "in_packages": "0" },
 { "brush": "Chunky Paint", "in_packages": "0" },
 { "brush": "Celebration", "in_packages": "0" },
 { "brush": "Bristly", "in_packages": "0" },
 { "brush": "Abstract", "in_packages": "2" },
 { "brush": "Perfect Pets", "in_packages": "2" },
 { "brush": "Scribbles", "in_packages": "2" },
 { "brush": "Sketch", "in_packages": "2" },
 { "brush": "Starry Night", "in_packages": "2" },
 { "brush": "Sunny Rays", "in_packages": "2" },
 { "brush": "Translucent", "in_packages": "2" },
 { "brush": "Microbes", "in_packages": "2" },
 { "brush": "Secret Garden", "in_packages": "2" },
 { "brush": "Lightning Strikes", "in_packages": "2" },
 { "brush": "Alien", "in_packages": "2" },
 { "brush": "Concept Art", "in_packages": "2" },
 { "brush": "Animation", "in_packages": "2" },
 { "brush": "Feather", "in_packages": "1" },
 { "brush": "Floral", "in_packages": "1" },
 { "brush": "Coral Reef", "in_packages": "1" },
 { "brush": "All That Glitters", "in_packages": "1" },
 { "brush": "Fluid", "in_packages": "1" },
 { "brush": "Organic", "in_packages": "1" },
 { "brush": "Slow Motion", "in_packages": "1" },
 { "brush": "Rust & Patina", "in_packages": "1" },
 { "brush": "Sand & Soil", "in_packages": "1" },
 { "brush": "Trees & Foliage", "in_packages": "1" },
 { "brush": "Chaos", "in_packages": "1" },
 { "brush": "Urban", "in_packages": "1" },
 { "brush": "Neon Lights", "in_packages": "1" },
 { "brush": "Pointillism", "in_packages": "1" },
 { "brush": "Halloween", "in_packages": "4" },
 { "brush": "Majestic Animals", "in_packages": "4" },
 { "brush": "Rock", "in_packages": "4" },
 { "brush": "Tide", "in_packages": "4" },
 { "brush": "Faces", "in_packages": "4" },
 { "brush": "Spring", "in_packages": "4" },
 { "brush": "Wilderness", "in_packages": "4" },
 { "brush": "Wizard", "in_packages": "4" },
 { "brush": "Blend", "in_packages": "3,4" },
 { "brush": "Creepers", "in_packages": "4" },
 { "brush": "Expressive", "in_packages": "4" },
 { "brush": "Grunge", "in_packages": "3,4" },
 { "brush": "Impression", "in_packages": "4" },
 { "brush": "Nature", "in_packages": "4" },
 { "brush": "Winter", "in_packages": "4" },
 { "brush": "Particle Crawlers", "in_packages": "4" },
 { "brush": "Combustion", "in_packages": "4" },
 { "brush": "Atmosphere", "in_packages": "4" },
 { "brush": "Fantasy", "in_packages": "4" },
 { "brush": "Graphic Impact", "in_packages": "4" },
 { "brush": "Wedding", "in_packages": "4" },
 { "brush": "Dust & Debris", "in_packages": "4" },
 { "brush": "Fabric Fantasy", "in_packages": "4" },
 { "brush": "Fine Art", "in_packages": "4" },
 { "brush": "Flame", "in_packages": "4" },
 { "brush": "Fur", "in_packages": "4" },
 { "brush": "Hair", "in_packages": "4" },
 { "brush": "Light it Up", "in_packages": "3,4" },
 { "brush": "Smoke & Steam", "in_packages": "3,4" },
 { "brush": "Spaced Out", "in_packages": "4" },
 { "brush": "Storm", "in_packages": "4" },
 { "brush": "Superhero", "in_packages": "4" }
];

$(function () {
  setInterval(() => {
    $('div[class="caption"]').each(function( index ) {
      var name = $(this).find('span[class="name"]').text().trim();
      var idx = brushes.findIndex((br) => br.brush == name);
      if(idx != -1) {
        var pkg = $(this).find('span[class="packages"]');
        if( pkg.length == 0 ) {
          var all_pkgs = brushes[idx].in_packages.split(',');
          var pkgs = "";
          for(var i=0; i<all_pkgs.length; i++) {
            if(pkgs.length)
              pkgs += ", " + packages[ all_pkgs[i] ];
            else
              pkgs = packages[ all_pkgs[i] ];
          }
          $(this).append( '<span class="packages"><span style="color:#CC404A;">Package: </span>'+pkgs+'</span>' );
        }
      }
    });
  }, 500);
});

})();