// ==UserScript==
// @name         Starblast.io lowercase name mod
// @description  An mod to let you use a lowercase name in starblast.io
// @version      0.1
// @author       Pixelmelt
// @license      MIT
// @namespace    https://greasyfork.org/en/users/226344
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446673/Starblastio%20lowercase%20name%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/446673/Starblastio%20lowercase%20name%20mod.meta.js
// ==/UserScript==
 
const modName = "LowercaseName";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FF00A6");
 
function injector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
 
  function checkSrcChange() {
    if (src == prevSrc) throw new Error("src didn't change");
    prevSrc = src;
  }
  
  src = src.replace(`e.font = K + "pt Play", e.fillText(r.player_name.toUpperCase(), H,`,`e.font = K + "pt Play", e.fillText(r.player_name, H,`)
  checkSrcChange();
 
  src = src.replace(/text-transform: uppercase;/igm,``)
  checkSrcChange()
 
  src = src.replace(`|| (k = I0O1I.shuffle()[0].toUpperCase()), _ = window.innerHeight,`,`|| (k = I0O1I.shuffle()[0]), _ = window.innerHeight,`)
  checkSrcChange()
 
  src = src.replace(`w.style.display = "block", k = h.value.toUpperCase().substr(0, 16)`,`w.style.display = "block", k = h.value.substr(0, 16)`)
  checkSrcChange()
  
  log(`Mod injected`);
  return src;
}
 
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
window.sbCodeInjectors.push((sbCode) => {
  try {
    return injector(sbCode);
  } catch (error) {
    alert(`${modName} failed to load`);
    throw error;
  }
});
log(`Mod loaded`);