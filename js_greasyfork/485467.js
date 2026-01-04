// ==UserScript==
// @name         bypass team lock
// @description  code injector- https://greasyfork.org/en/scripts/446636-code-injector-starblast-io
// @version      1.2
// @author       M4tr1x
// @license      MIT
// @namespace    https://greasyfork.org/en/users/926687-m4tr1x
// @match        https://starblast.io/
// @icon       https://cdn.upload.systems/uploads/pMm90TX9.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485467/bypass%20team%20lock.user.js
// @updateURL https://update.greasyfork.org/scripts/485467/bypass%20team%20lock.meta.js
// ==/UserScript==


const modName = "SendFiveEmotes";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FFF700");
 
function injector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
 
  function checkSrcChange() {
    if (src == prevSrc) throw new Error("src didn't change");
    prevSrc = src;
  }
    src = src.replace(/\s*&&\s*this\.team\.open/g, '');
    checkSrcChange();
log(`Mod injected`);
  return src;
}
 
if (!window.sbCodeInjectors) window.sbCodeInjectors = [];
window.sbCodeInjectors.push((sbCode) => {
  try {
    return injector(sbCode);
  } catch (error) {
    alert(`${modName} failed to load; error:` + error);
    throw error;
  }
});
log(`Mod loaded`);
  