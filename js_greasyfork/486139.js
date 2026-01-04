// ==UserScript==
// @name         TEST SCRIPTORMAN 
// @description  NEEDS CODE INJECTOR TO RUN- https://greasyfork.org/en/scripts/446636-code-injector-starblast-io
// @version      1.2
// @author       M4tr1x
// @license      MIT
// @namespace    https://greasyfork.org/en/users/926687-m4tr1x
// @match        https://starblast.io/
// @icon       https://cdn.upload.systems/uploads/pMm90TX9.png
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486139/TEST%20SCRIPTORMAN.user.js
// @updateURL https://update.greasyfork.org/scripts/486139/TEST%20SCRIPTORMAN.meta.js
// ==/UserScript==



const modName = "M-Client";
 
const log = (msg) => console.log(`%c[${modName}] ${msg}`, "color: #FF00A6");
 
function injector(sbCode) {
  let src = sbCode;
  let prevSrc = src;
  
  function checkSrcChange() {
    if (src == prevSrc) throw new Error("replace did not work");
    prevSrc = src;
  }

//const regex = /mousewheel".*{\s.*{/;

//let idx = src.search(regex);
//let end_brace_idx = src.indexOf('}', idx);
//alert(end_brace_idx);

//"DOMMouseScroll\", function(t) { return function(e) {"

//src = src.replace(regex, "mousewheel\", function(t) { return function(e) { if (e.deltaY > 0) console.log(\"down\"); else console.log(\"up\"); ");
//console.log(src);
//checkSrcChange()


//this.OllII.position.z = 70, this.welcome)) return this.OllII.position.z = 140
//WHERE U STOPPED OFF
// src = src.replace("length: [35],","length: [65],")
// checkSrcChange()

//FOV HACK
// src = src.replace(".position.z=70,this.welcome",".position.z=125,this.welcome")
// checkSrcChange()
/*
src = src.replace("linear-gradient(135deg, hsla(200, 30%, 10%, 1) 0, hsla(200, 30%, 30%, 1) 150%)","linear-gradient(135deg, hsla(200, 30%, 10%, 1) 0, hsl(0deg 100% 50%) 150%)")
 checkSrcChange()


 src = src.replace("linear-gradient(-45deg, hsla(200, 50%, 10%, .5) 0, hsla(200, 50%, 50%, .15) 100%)","linear-gradient(-45deg, hsla(200, 50%, 10%, .5) 0, hsl(0deg 100% 50% / 62%) 100%)")
 checkSrcChange()

src = src.replace("radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsla(200, 100%, 80%, .5) 150%)","radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsl(0deg 100% 50%) 150%)")
 checkSrcChange()

src = src.replace("radial-gradient(ellipse at center, hsla(20, 50%, 0%, 1) 0, hsla(20, 100%, 80%, .5) 150%)","radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsl(0deg 100% 50%) 150%)")
 checkSrcChange()

src = src.replace("radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsla(200, 100%, 70%, .5) 150%)","radial-gradient(ellipse at center, hsla(200, 50%, 0%, 1) 0, hsl(0deg 100% 50%) 150%)")
 checkSrcChange()

//src = src.replace("hsla(200, 80%, 100%, .8)","hsl(0deg 100% 50% / 80%)")
 //checkSrcChange()

src = src.replace("https://starblast.data.neuronality.com/img/starblast_io_logo.svg?3","https://raw.githubusercontent.com/PixelMelt/FVClient/main/revised.png?token=GHSAT0AAAAAABYC32HI6KXXXDRXPSHI2VBKYYVJUHA")
checkSrcChange()
*/
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
