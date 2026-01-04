// ==UserScript==
// @name Ren minimap viewport, ren upgrades, predict movement
// @description V - ren_minimap_viewport enable/disable, B - ren_upgrades disable/enable, N - net_predict_movement disable/enable
// @author Nimdac#0648
// @namespace https://greasyfork.org/users/668919
// @version 1.1
// @match *://diep.io/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/411776/Ren%20minimap%20viewport%2C%20ren%20upgrades%2C%20predict%20movement.user.js
// @updateURL https://update.greasyfork.org/scripts/411776/Ren%20minimap%20viewport%2C%20ren%20upgrades%2C%20predict%20movement.meta.js
// ==/UserScript==
f={66:'ren_upgrades',78:'net_predict_movement',86:'ren_minimap_viewport',KeyV:1},addEventListener('keyup',e=>(k=e.keyCode)&&f[k]&&input.set_convar(f[k],!(f[e.code]^=1)))