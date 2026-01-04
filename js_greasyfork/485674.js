// ==UserScript==
// @name         Radar zoom w/ regex
// @description  An mod to let you use a lowercase name in starblast.io
// @version      0.1
// @author       M4tr1x
// @license      MIT
// @namespace    https://greasyfork.org/en/users/226344
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485674/Radar%20zoom%20w%20regex.user.js
// @updateURL https://update.greasyfork.org/scripts/485674/Radar%20zoom%20w%20regex.meta.js
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
  src = src.replace(/this\.radar_zoom=([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?/g, 'this.radar_zoom=1');
  checkSrcChange();

  
  
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