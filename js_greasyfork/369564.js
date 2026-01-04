// ==UserScript==
// @name         bulbapedia pkmn img dumper
// @version      0.1
// @description  Download bulbapedia pkmn img
// @author       Zeper
// @match        https://bulbapedia.bulbagarden.net/wiki/*_(Pok%C3%A9mon)
// @exclude      https://bulbapedia.bulbagarden.net/wiki/Zeraora_(Pok%C3%A9mon)
// @grant GM_download
// @namespace https://greasyfork.org/users/191481
// @downloadURL https://update.greasyfork.org/scripts/369564/bulbapedia%20pkmn%20img%20dumper.user.js
// @updateURL https://update.greasyfork.org/scripts/369564/bulbapedia%20pkmn%20img%20dumper.meta.js
// ==/UserScript==


var nextpkmnurl = document.getElementById("mw-content-text").getElementsByTagName("table")[0].getElementsByTagName("table")[2].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[1].getElementsByTagName("a")[0].href;
var pkmnimgurl = document.getElementById("mw-content-text").getElementsByTagName("table")[4].getElementsByTagName("tbody")[1].getElementsByTagName("tr")[2].getElementsByTagName("table")[0].getElementsByTagName("tr")[0].getElementsByTagName("a")[0].getElementsByTagName("img")[0].src;
var pkmnfilename = pkmnimgurl.substr(pkmnimgurl.lastIndexOf('/')+ 1).replace("250px-","");
var downloadbtn = document.getElementById("mw-content-text").getElementsByTagName("table")[4].getElementsByTagName("tbody")[1].getElementsByTagName("tr")[2].getElementsByTagName("table")[0].getElementsByTagName("tr")[0].getElementsByTagName("a")[0];
var evt = document.createEvent('MouseEvents');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dump() {
    GM_download(pkmnimgurl, pkmnfilename);
    await sleep(1000);
    window.location.href = nextpkmnurl;
}

dump();