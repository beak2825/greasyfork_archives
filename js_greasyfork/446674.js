// ==UserScript==
// @name         Starblast.io Scroll ECP
// @description  A mod that lets you scroll through starblast.io badges
// @version      0.1
// @author       Pixelmelt
// @license      MIT
// @namespace    https://greasyfork.org/en/users/226344
// @match        https://starblast.io/
// @icon         https://cdn.upload.systems/uploads/DDPfEofl.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446674/Starblastio%20Scroll%20ECP.user.js
// @updateURL https://update.greasyfork.org/scripts/446674/Starblastio%20Scroll%20ECP.meta.js
// ==/UserScript==
 
const modName = "ScrollECP";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #CB996A");
 
function injector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
 
  class scrollECP{bar(){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td.ecpverifiedlogo.frozenbg").addEventListener("wheel",(e)=>{if(e.deltaY<1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-right").click()}else if(e.deltaY>1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-left").click()};e.stopPropagation()});document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > div").addEventListener("wheel",(e)=>{if(e.deltaY<1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-right").click()}else if(e.deltaY>1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(1) > i.fa.fa-caret-left").click()};e.stopPropagation()});document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td.shippreview.frozenbg").addEventListener("wheel",(e)=>{if(e.deltaY<1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-right").click()}else if(e.deltaY>1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-left").click()};e.stopPropagation()});document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > div").addEventListener("wheel",(e)=>{if(e.deltaY<1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-right").click()}else if(e.deltaY>1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(2) > i.fa.fa-caret-left").click()};e.stopPropagation()});document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > div").addEventListener("wheel",(e)=>{if(e.deltaY<1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > i.fa.fa-caret-right").click()}else if(e.deltaY>1){document.querySelector("body > div.modal > div.modalbody > div > table > tbody > tr > td:nth-child(2) > div:nth-child(3) > i.fa.fa-caret-left").click()};e.stopPropagation()});}};
  var scrollus = new scrollECP()
  window.scrollus = new scrollECP()
 
  function checkSrcChange() {
    if (src == prevSrc) throw new Error("src didn't change");
    prevSrc = src;
  }
  // Add sus
  src = src.replace(/\(\), this.showModal\("donate"\)/g,`(), this.showModal("donate"), scrollus.bar()`);
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