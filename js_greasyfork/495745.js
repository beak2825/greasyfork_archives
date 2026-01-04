// ==UserScript==
// @name         Cellcraft.io - Top Mass
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  ez
// @author       Attack
// @match        https://cellcraft.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @run-at       document-start
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/495745/Cellcraftio%20-%20Top%20Mass.user.js
// @updateURL https://update.greasyfork.org/scripts/495745/Cellcraftio%20-%20Top%20Mass.meta.js
// ==/UserScript==

(() => {
    let topScore = 0;

    const fillText = CanvasRenderingContext2D.prototype.fillText,
          fpsBox = document.getElementById("fpsBox"),
          table = document.createElement("table"),
          tbody = document.createElement("tbody"),
          tr = document.createElement("tr");

    fpsBox.style.display = 'flex';
    fpsBox.appendChild(table);
    table.appendChild(tbody);
    tbody.appendChild(tr);

    const toValue = text => {
        return`${text}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }, refr = () => {
        tr.innerHTML = `<td>Top Mass:</td><td style="font-size: 14px; padding-left: 4px; color: #2d2;">${toValue(topScore)}</td>`;
    }, reset = () => {
        topScore = 0;
        refr();
    }, setserver = window.setserver;
    window.setserver = function(Wss, Title) {
        reset();
        return setserver(Wss, Title);
    };
    refr();

    CanvasRenderingContext2D.prototype.fillText = function(text) {
        const mass = String(text).match(/^Mass: (\d+)$/);

        fillText.apply(this, arguments);
        if(mass != null) {
            if(+mass[1] >= topScore) {
                topScore = +mass[1];
                refr();
            };
        };
    };
})();