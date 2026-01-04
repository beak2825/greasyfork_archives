// ==UserScript==
// @name         Starblast.io auto gg
// @description  Auto gg for starblast.io
// @version      0.1
// @author       Pixelmelt
// @license      MIT
// @namespace    https://greasyfork.org/en/users/226344
// @match        https://starblast.io/
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446683/Starblastio%20auto%20gg.user.js
// @updateURL https://update.greasyfork.org/scripts/446683/Starblastio%20auto%20gg.meta.js
// ==/UserScript==
 
const modName = "AutoGG";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #6800FF");
function injector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
  function checkSrcChange() {
    if (src == prevSrc) throw new Error("src didn't change");
    prevSrc = src;
  }
  class foo{bar(){let x = Object.values(window.module.exports.settings).find(v => v.mode); let y = Object.values(x).find(v => v.socket).socket; y.send(JSON.stringify({name: "say",data: `G`}));};};
  var gg = new foo()
  window.gg = new foo()
  src = src.replace(`w === this.lO1Ol.Ol001.status.id && (this.lO1Ol.Ol001.status.kills++, T = this.lO1Ol.names.get(U)`,`w === this.lO1Ol.Ol001.status.id && (this.lO1Ol.Ol001.status.kills++, gg.bar(), T = this.lO1Ol.names.get(U)`);
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