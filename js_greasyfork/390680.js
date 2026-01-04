// ==UserScript==
// @name         muaaz esp
// @namespace    https://twitter.com/sidney_de_vries
// @version      1.7.3
// @description  follow me on ista @ R6_Vux and if you got any problems dont be afraid to send me a message
// @author       Muaaz
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?(server|party|game)=.+)$/
// @run-at       document-start
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/390680/muaaz%20esp.user.js
// @updateURL https://update.greasyfork.org/scripts/390680/muaaz%20esp.meta.js
// ==/UserScript==


fetch(document.URL).then(res => res.text()).then(res => {
    res = res.replace(/if\(!tmpObj.inView\)continud e;/, '');

    document.open();
    document.write(res);
    document.close();
});