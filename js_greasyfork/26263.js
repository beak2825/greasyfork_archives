// ==UserScript==
// @name         Laser for vertix
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  laser
// @author       stranger3003
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26263/Laser%20for%20vertix.user.js
// @updateURL https://update.greasyfork.org/scripts/26263/Laser%20for%20vertix.meta.js
// ==/UserScript==

 var flagSprites = []
  , clutterSprites = []
  , cachedWalls = []
  , floorSprites = []
  , cachedFloors = []
  , sideWalkSprite = null
  , lightSprite = null
  , ambientSprites = []
  , wallSpritesSeg = []
  , particleSprites = []
  , weaponSpriteSheet = []
  , bulletSprites = []
  , cachedShadows = []
  , cachedWeaponSprites = []
  , wallSprite = null
  , darkFillerSprite = null
  , healthPackSprite = null
  , lootCrateSprite = null
  , weaponWidth = 1000
  , weaponHeight = 1000;