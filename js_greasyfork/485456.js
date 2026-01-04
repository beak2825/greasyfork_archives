// ==UserScript==
// @name         1Starblast.io send five emotes
// @description  A mod to let you use 5 emotes on starblast.io
// @version      0.1
// @author       M4tr1x
// @license      MIT
// @namespace    https://greasyfork.org/en/users/226344
// @match        https://starblast.io/
// @icon         https://cdn.upload.systems/uploads/DDPfEofl.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485456/1Starblastio%20send%20five%20emotes.user.js
// @updateURL https://update.greasyfork.org/scripts/485456/1Starblastio%20send%20five%20emotes.meta.js
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
  // Add sus
  src = src.replace(".say(this.phrase),this.phrase.length>=4&&this.hide(),Math.random()<.01)return", ".say(this.phrase),this.phrase.length>=5&&this.hide(),Math.random()<.01)return");
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