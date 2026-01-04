// ==UserScript==
// @name         1v1lol
// @version      0.1
// @description  1v1.LOL hack script - infinite ammo, infinite armor, rapid fire
// @author       ;)
// @namespace    https://greasyfork.org/ja/users/762895-nekocell
// @match        *://1v1.lol/*
// @icon         https://www.google.com/s2/favicons?domain=1v1.lol
// @connect      raw.githubusercontent.com
// @require      https://greasyfork.org/scripts/431787-gm-fetch-nekocell/code/GM_fetch%20-%20nekocell.js?version=966477
// @require      https://greasyfork.org/scripts/431788-fixedwailloader/code/FixedWailLoader.js?version=966480
// @require      https://greasyfork.org/scripts/431845-nekoutil/code/NekoUtil.js?version=966813
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487769/1v1lol.user.js
// @updateURL https://update.greasyfork.org/scripts/487769/1v1lol.meta.js
// ==/UserScript==
 
const wasm = WebAssembly;
 
const oldInstantiate = wasm.instantiate;

wasm.instantiate = async function(bufferSource, importObject) {
  console.log("1v1.www : WebAssembly.instantiate() intercepted!!");
 
  await FixedWailLoader.load();
 
  const wail = new WailParser(bufferSource);
 
  const infiniteAmmoFuncIndex = wail.getFunctionIndex(36865);
  const infiniteArmorFuncIndex = wail.getFunctionIndex(36774);
  const rapidFireFuncIndex = wail.getFunctionIndex(36902);
 
  wail.addCodeElementParser(infiniteAmmoFuncIndex, param => {
    return param.bytes.replace([40, 2, 32, 65, 1, 107, 54, 2, 32], [40, 2, 32, 65, 1, 26, 54, 2, 32]);
  });
 
  wail.addCodeElementParser(infiniteArmorFuncIndex, param => {
    return param.bytes.replace([40, 2, 104, 32, 1, 107, 54, 2, 104], [40, 2, 104, 32, 1, 26, 54, 2, 104]);
  });
 
  wail.addCodeElementParser(rapidFireFuncIndex, param => {
    return param.bytes.replace([42, 2, 28, 56, 2, 16], [42, 2, 28, 26, 67, 0, 0, 0, 0, 56, 2, 16])
  });
 
  wail.load(bufferSource);
  wail.parse();
 
  return oldInstantiate(wail.write(), importObject);
};