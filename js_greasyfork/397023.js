// ==UserScript==
// @name         Animated Skins
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes skins every 0.1 second [Multiple Skins suppoorted].
// @author       Tsukuru
// @match        balz.io/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397023/Animated%20Skins.user.js
// @updateURL https://update.greasyfork.org/scripts/397023/Animated%20Skins.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
let paused = true;
function keydown() {
    if (event.keyCode == 49) {
        paused = !paused;
        skins = ["https://i.imgur.com/zTyW83F.png", "https://i.imgur.com/q7vAW5P.png", "https://i.imgur.com/r5Nousn.png", "https://i.imgur.com/bGWMP0T.png"];
    }
    if (event.keyCode == 50) {
        paused = !paused;
        skins = ["https://i.imgur.com/iuGhTAE.png", "https://i.imgur.com/ZyaZm1q.png", "https://i.imgur.com/oe5sg5u.png", "https://i.imgur.com/xpljBXx.png", "https://i.imgur.com/ruYY5RA.png", "https://i.imgur.com/YdFP5xJ.png", "https://i.imgur.com/UOwWwoi.png", "https://i.imgur.com/YFieTQJ.png", "https://i.imgur.com/ondlhiw.png"];
    }
    if (event.keyCode == 51) {
        paused = !paused;
        skins = ["https://i.imgur.com/ERc6aiB.png", "https://i.imgur.com/NdP6ypc.png", "https://i.imgur.com/KnzeDhB.png", "https://i.imgur.com/VW6scEK.png", "https://i.imgur.com/FTUTHxj.png", "https://i.imgur.com/ouFNOip.png", "https://i.imgur.com/Uw8waRB.png", "https://i.imgur.com/5Ej0kcd.png", "https://i.imgur.com/rSmmW0y.png"];
    }
    if (event.keyCode == 52) {
        paused = !paused;
        skins = ["https://i.imgur.com/Fkq9bhU.png", "https://i.imgur.com/9b7ijcg.png", "https://i.imgur.com/c1VbpXn.png", "https://i.imgur.com/5kmecgk.png", "https://i.imgur.com/bYsazN5.png", "https://i.imgur.com/3b696w2.png", "https://i.imgur.com/foG2upl.png", "https://i.imgur.com/a83ubx3.png"];
    }
    if (event.keyCode == 53) {
        paused = !paused;
        skins = ["https://i.imgur.com/uKyfoXJ.png", "https://i.imgur.com/uKyfoXJ.png", "https://i.imgur.com/SXsjD7h.png", "https://i.imgur.com/SXsjD7h.png"];
    }
    if (event.keyCode == 54) {
        paused = !paused;
        skins = ["https://i.imgur.com/sipqk56.png", "https://i.imgur.com/622NU9g.png", "https://i.imgur.com/qxk1LXz.png", "https://i.imgur.com/xdbHFwB.png", "https://i.imgur.com/SFhUmBL.png", "https://i.imgur.com/9b7nnJT.png", "https://i.imgur.com/Wmk0dCt.png", "https://i.imgur.com/drf5nYG.png", "https://i.imgur.com/3680QzG.png"];
    }
    if (event.keyCode == 55) {
        paused = !paused;
        skins = ["https://i.imgur.com/HfYtQeo.png", "https://i.imgur.com/QHqlQpl.png", "https://i.imgur.com/MEHYnHP.png", "https://i.imgur.com/mOrBybM.png", "https://i.imgur.com/8PGcRQ8.png", "https://i.imgur.com/CcUQcUI.png", "https://i.imgur.com/sdjYua0.png"];
    }
};
setTimeout(function() {
    
    let owo = this["d85rd"],
        index = 0;
    setInterval(async function() {
        if (!paused) {
            index ++;
            index = index % skins.length;
            owo.updateSkin(skins[index]);
            owo.play();
            if (~$(".sc-htpNat.vbTr").html().indexOf("Would you like to use")) $(".sc-htpNat.vbTr").css("display", "none");
            else $(".sc-htpNat.vbTr").css("display", "flex");
        }
    }, 100);
}, 1000);
