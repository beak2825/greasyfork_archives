// ==UserScript==
// @name         Krunker earthquake
// @description  creates an earthquake
// @author       chomler
// @namespace    https://greasyfork.org/users/674173
// @version      1.0
// @match        *://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408337/Krunker%20earthquake.user.js
// @updateURL https://update.greasyfork.org/scripts/408337/Krunker%20earthquake.meta.js
// ==/UserScript==

["sin","cos","tan"].map(_=>((_,__)=>{let ___=_[__];_[__]=_=>___(_)+(Math.random()*2-1)/300})(Math, _));
