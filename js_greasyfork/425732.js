// ==UserScript==
// @name         </> Kurt & Java Kapasite
// @namespace    http://tampermonkey.net/
// @version      24.5
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/425732/%3C%3E%20Kurt%20%20Java%20Kapasite.user.js
// @updateURL https://update.greasyfork.org/scripts/425732/%3C%3E%20Kurt%20%20Java%20Kapasite.meta.js
// ==/UserScript==

const entirePop = document.getElementsByClassName("hud-intro-wrapper")[0].children[1];
const request = new XMLHttpRequest();
request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        let data = JSON.parse(request.responseText);
        entirePop.innerHTML = `Şuan Oyundaki İnsanlar: ${data.players} / ${(data.players / data.capacity * 100).toFixed(2)}%`;
        let servers = ["US East", "US West", "Europe", "Asia", "Australia", "South America"];
        for (let i in servers) {
            game.ui.components.Intro.serverElem.children[i].setAttribute("label", `${servers[i]}: Kapasite: ${data.regions[servers[i]].players}`);
        }
    }
};
request.open("GET", "http://zombs.io/capacity", true);
request.send();