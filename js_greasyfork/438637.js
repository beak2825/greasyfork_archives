// ==UserScript==
// @name         1v1.www v2
// @version      0.0000000000.1
// @description  1v1.LOL hack script - infinite ammmo, infinite armor, rapid fire
// @author       nekocell
// @namespace    https://greasyfork.org/ja/users/762895-nekocell
// @match        https://sites.google.com/site/unblockedgameswtf/1v1-lol
// @icon         https://www.google.com/s2/favicons?domain=1v1.lol
// @require      https://greasyfork.org/scripts/436749-wasm-patcher/code/wasm_patcher.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438637/1v1www%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/438637/1v1www%20v2.meta.js
// ==/UserScript==
 
/* decrease ammo
end
get_local 1
get_local 1
i32.load align=2 offset=32
i32.const 1
i32.sub //
i32.store align=2 offset=32
i32.const 6646660
*/
 
/* set time when shoot
  f32.load align=2 offset=28
  f32.store align=2 offset=16 //
  br 2
end
get_local 0
i32.const 127
i32.store align=2 offset=8
*/
 
/* set armor point when hit
i32.load align=2 offset=136
get_local 1
i32.sub
i32.store align=2 offset=136
else
get_local 0
get_local 0
i32.load align=2 offset=140
get_local 1
i32.sub //
i32.store align=2 offset=140
*/
 
const Log = function(msg) {
    console.log("1v1.www : " + msg);
};
 
const wasm = WebAssembly;
const oldInstantiate = wasm.instantiate;
 
wasm.instantiate = async function(bufferSource, importObject) {
    Log("WebAssembly.instantiate() intercepted!!");
 
    const patcher = new WasmPatcher(bufferSource);
 
    patcher.aobPatchEntry({
        scan: 'B 20 1 20 1 28 ? ? 41 1 [ 6B ] 36 ? ? 41 84 D7 95 3',
        code: [
            OP.drop,
        ],
        onsuccess: () => Log('Infinite Ammo')
    });
 
    patcher.aobPatchEntry({
        scan: '2A ? ? | 38 ? ? C 2 B 20 0',
        code: [
            OP.drop,
            OP.f32.const, VAR.f32(0)
        ],
        onsuccess: () => Log('Rapid Fire')
    });
 
    patcher.aobPatchEntry({
        scan: '5 20 0 20 0 28 ? ? ? 20 1 [ 6B ] 36 ? ? ?',
        code: [
            OP.drop,
        ],
        onsuccess: () => Log('Infinite Armor')
    });
 
    return oldInstantiate(patcher.patch(), importObject);
};