// ==UserScript== 
// @name          TagPro Tile Pattern
// @namespace     http://www.reddit.com/u/snaps_/
// @description   Tints every other floor tile a slightly different shade.| Greasemonkey 4.1: ✕ Tampermonkey 4.4: ✔ 
// @include       http://tagpro-*.koalabeast.com:* 
// @include       http://tangent.jukejuice.com:* 
// @include       http://tagpro-test.koalabeast.com/game
// @include       http://*.newcompte.fr:* 
// @license       GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html 
// @author        snaps
// @version       0.1.2
// @downloadURL https://update.greasyfork.org/scripts/25215/TagPro%20Tile%20Pattern.user.js
// @updateURL https://update.greasyfork.org/scripts/25215/TagPro%20Tile%20Pattern.meta.js
// ==/UserScript==

/* User-Defined Variables */

// The color to tint the floor tiles.
var TINT_COLOR = "#663300";

// How much to tint the floor tiles. Should be a number from 0 to 1.
// In practice try values from 0.05 to 1 in increments of .2 to start,
// then smaller amounts to hone in on what you like.
var OPACITY = 0.05;

/* End of User-Defined Variables */


/**
 * Executes `fn` when the relevant parts of the `tagpro` object have
 * been initialized.
 * @param {Function} fn - The function to execute.
 */
function waitForInitialized(fn) {
  if (!tagpro || !tagpro.tiles || !tagpro.tiles.draw || !tagpro.renderer) {
    setTimeout(function() {
      waitForInitialized(fn);
    }, 10);
  } else {
    // Only override if we load early enough.
    if (!tagpro.renderer.layers.backgroundDrawn) {
      fn();
    }
  }
}

waitForInitialized(function() {
  var stdDraw = tagpro.tiles.draw;
  // ids of the tiles we're interested in changing.
  var floorTiles = [2, 11, 12, 17, 18];
  var prefix = "__tinted__";

  /**
   * Set tint of a given canvas element.
   * @param {HTMLElement} image - Canvas element holding the image to tint.
   * @param {string} [color="#000000"] - Color string to tint the tiles, like "#FF0000".
   * @param {number} [opacity="0.01"] - How much to preserve the original image.
   */
  var setTint = function(image, color, opacity) {
    // Adapted from: http://stackoverflow.com/a/4231508/1698058
    var tint = document.createElement("canvas");
    tint.width = image.width;
    tint.height = image.height;

    var tintCtx = tint.getContext("2d");
    tintCtx.fillStyle = color || "#000000";
    tintCtx.fillRect(0, 0, tint.width, tint.height);
    tintCtx.globalCompositeOperation = "destination-atop";
    tintCtx.drawImage(image, 0, 0);

    var imageCtx = image.getContext("2d");
    imageCtx.globalAlpha = opacity || 0.01;
    imageCtx.drawImage(tint, 0, 0);
  }

  /**
   * Creates the tinted texture for the tile of the given id and sets
   * the relevant values such that the returned value will function in
   * the original `tagpro.tiles.draw` function.
   * @param {(number|string)} tileId - The original id of the tile to set information for.
   * @return {string} - The new id to use for the tile.
   */
  var setTintedTexture = function(tileId) {
    var originalTileId = tileId;
    tileId = prefix + originalTileId;
    if (!tagpro.tiles[tileId] || !PIXI.TextureCache[tileId]) {
      var tile = tagpro.tiles[originalTileId];
      tagpro.tiles[tileId] = tile;

      var spread = tile.spread || 0;
      var elt = document.createElement("canvas");
      elt.width = tile.size || 40;
      elt.height = tile.size || 40;

      var ctx = elt.getContext("2d");
      var sx = tile.x * 40 - spread;
      var sy = tile.y * 40 - spread;
      var size = (tile.size || 40) + spread * 2;
      ctx.drawImage(tagpro.tiles.image, sx, sy, size, size, 0, 0, size, size);
      setTint(elt, TINT_COLOR, OPACITY);
      PIXI.TextureCache[tileId] = PIXI.Texture.fromCanvas(elt);
    }
    return tileId;
  }

  // Override `tagpro.tiles.draw`.
  tagpro.tiles.draw = function() {
    // Only make changes when drawing background tiles.
    if (tagpro.tiles.draw.caller === tagpro.tiles.drawLayers) {
      var loc = arguments[2];
      
      var floorTile = floorTiles.indexOf(arguments[1]) !== -1;
      if (loc && !(typeof arguments[1] == "object") && floorTile) {
        var arrayLoc = {
          x: Math.floor(loc.x / 40),
          y: Math.floor(loc.y / 40)
        };
        if ((arrayLoc.x % 2 == 0 && arrayLoc.y % 2 == 0) ||
            (arrayLoc.x % 2 == 1 && arrayLoc.y % 2 == 1)) {
          arguments[1] = setTintedTexture(arguments[1]);
        }
      }
    }
    return stdDraw.apply(null, arguments);
  }
});
