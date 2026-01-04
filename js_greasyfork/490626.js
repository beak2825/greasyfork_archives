
// ==UserScript==
// @name         крутой 
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Doesn't work!
// @author       H336
// @match        http://brofist.io/modes/sandbox/c/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490626/%D0%BA%D1%80%D1%83%D1%82%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/490626/%D0%BA%D1%80%D1%83%D1%82%D0%BE%D0%B9.meta.js
// ==/UserScript==
addEventListener("mousewheel", e => {
    tweenObjects.map(x => {
        try {
            x.refP.g.parent.parent.mid.children[0].ref.p.velocity[1] = -Math.sign(e.deltaY) * 15
        } catch(e) {}
    })
});