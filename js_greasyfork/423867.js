// ==UserScript==
// @name        Float Hack Brofist Sandbox
// @namespace   Float Hack Brofist Sandbox
// @include     http://brofist.io/modes/sandbox/c/index.html
// @version     1
// @description for GDL: pg up for hover pg dn for see through
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/423867/Float%20Hack%20Brofist%20Sandbox.user.js
// @updateURL https://update.greasyfork.org/scripts/423867/Float%20Hack%20Brofist%20Sandbox.meta.js
// ==/UserScript==
onkeydown = e => (e.keyCode == 33 && tweenObjects.map(x => x.p.body.world.gravity[1] = 9.7),
e.keyCode == 34 && tweenObjects.map(x => (
    x.ntAlpha = x.ntAlpha || x.refP.getAlpha(),
    x.refP.setAlpha(.2)
)), 1);
onkeyup = e => (e.keyCode == 33 && tweenObjects.map(x => x.p.body.world.gravity[1] = -9.7),
e.keyCode == 34 && tweenObjects.map(x => x.refP.setAlpha(x.ntAlpha)), 1);