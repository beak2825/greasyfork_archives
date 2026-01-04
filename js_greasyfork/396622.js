// ==UserScript==
// @name         HideAndSeek BROFIST.io HACK | By H336
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Doesn't work! 
// @author       H336
// @match        http://brofist.io/modes/hideAndSeek/c/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396622/HideAndSeek%20BROFISTio%20HACK%20%7C%20By%20H336.user.js
// @updateURL https://update.greasyfork.org/scripts/396622/HideAndSeek%20BROFISTio%20HACK%20%7C%20By%20H336.meta.js
// ==/UserScript==

(function() {
    'use strict';
onkeydown = e => (e.keyCode == 33 && tweenObjects.map(x => x.p.body.world.gravity[1] = 9.7),
e.keyCode == 34 && tweenObjects.map(x => (
    x.ntAlpha = x.ntAlpha || x.refP.getAlpha(),
    x.refP.setAlpha(.2)
)), 1);
onkeyup = e => (e.keyCode == 33 && tweenObjects.map(x => x.p.body.world.gravity[1] = -9.7),
e.keyCode == 34 && tweenObjects.map(x => x.refP.setAlpha(x.ntAlpha)), 1);
})();