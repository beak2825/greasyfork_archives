// ==UserScript==
// @name         Anshex Better
// @namespace    https://greasyfork.org/
// @version      2024-01-02
// @description  Modify Anshex listings to display price per prim, and price per month.
// @author       Tokeli
// @match        https://www.anshex.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anshex.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489514/Anshex%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/489514/Anshex%20Better.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}



(function() {
    'use strict';
    addGlobalStyle('.spanner { display: inline-block; line-height: 1.5; }');

    const containers = document.querySelectorAll(".saleland_listR_dd");

    containers.forEach((doc) => {
        const prims = doc.querySelector(".listWid03");
        const costContainer = doc.querySelector(".listWid04");
        prims.classList.add("spanner");
        costContainer.classList.add("spanner");
        var cost = costContainer;
        if(cost.children.length > 0) cost = costContainer.children[0];
        var costText = cost.innerText.replace(/\d+% off!/, "");
        const ppp = (Number(costText) / Number(prims.innerText)).toPrecision(2);
        const monthly = Number(costText) * 4;
        const usd = (monthly / 245).toPrecision(4);
        const pppContainer = document.createElement("b");
        pppContainer.append(" \n"+ppp + " PP");
        var color = "red";
        if(ppp < 0.5) color = "green";
        else if(ppp < 1.0) color = "yellow";
        else if(ppp < 1.5) color = "orange";
        pppContainer.style.color = color;
        prims.innerText += "\n";
        prims.appendChild(pppContainer);
        //prims.innerHtml = prims.Innertext+"\n<b style=\"color:"+color+"\">" + ppp + " PP</b>";
        cost.innerText += "\n" + monthly + " PM\n$"+usd;
    });
    // Your code here...
})();