// ==UserScript==
// @name         1v1.www v2
// @version      0.4
// @description  1v1.LOL hack script - infinite ammmo, infinite armor, rapid fire, [free fly]
// @author       nekocell
// @namespace    https://greasyfork.org/ja/users/762895-nekocell
// @match        https://1v1.lol/*
// @icon         https://www.google.com/s2/favicons?domain=1v1.lol
// @require      https://greasyfork.org/scripts/436749-wasm-patcher/code/wasm_patcher.js
// @downloadURL https://update.greasyfork.org/scripts/450329/1v1www%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/450329/1v1www%20v2.meta.js
// ==/UserScript==
 
const Log = function(msg) {
    console.log("1v1.www : " + msg);
};
 
const wasm = WebAssembly;
const oldInstantiate = wasm.instantiate; //
 
wasm.instantiate = async function(bufferSource, importObject) {
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
 
    if(new URLSearchParams( window.location.search ).get('TU9SRUhBQ0tT') === 'true') {
 
        alert('[FreeFly] is added');
 
        const pressSpaceKeyIndex = patcher.addGlobalVariableEntry({
            type: 'u32',
            value: 0,
            mutability: true,
            exportName: 'PRESS_SPACE_KEY'
        });
 
        patcher.aobPatchEntry({
            scan: '4 40 20 B 20 1D 38 2 0 20 F 20 1E [ 38 2 0 ]',
            code: [
                OP.global.get, pressSpaceKeyIndex,
                OP.i32.const, VAR.s32(1),
                OP.i32.eq,
                OP.if,
                    OP.local.get, VAR.u32(15),
                    OP.f32.const, VAR.f32(2.5),
                    OP.f32.store, VAR.u32(2), VAR.u32(0),
                OP.end
            ],
            onsuccess: () => Log('Free Fly (offline)')
        });
 
        patcher.aobPatchEntry({
            scan: '4 40 20 6 21 3 B 20 1A 20 21 38 2 0 20 F 20 22 [ 38 2 0 ]',
            code: [
                OP.drop,
                OP.drop,
                OP.global.get, pressSpaceKeyIndex,
                OP.i32.const, VAR.s32(1),
                OP.i32.eq,
                OP.if,
                    OP.local.get, VAR.u32(15),
                    OP.f32.const, VAR.f32(2.5),
                    OP.f32.store, VAR.u32(2), VAR.u32(0),
                OP.end
            ],
            onsuccess: () => Log('Free Fly (online)')
        });
    }
 
    const result = await oldInstantiate(patcher.patch(), importObject);
 
    if(new URLSearchParams( window.location.search ).get('TU9SRUhBQ0tT') === 'true') {
        const exports = result.instance.exports;
 
        const pressSpaceKey = exports.PRESS_SPACE_KEY;
 
        document.addEventListener('keydown', evt => evt.code === 'Space' && (pressSpaceKey.value = 1));
        document.addEventListener('keyup', evt => evt.code === 'Space' && (pressSpaceKey.value = 0));
 
        localStorage.removeItem('TU9SRUhBQ0tT');
    }
 
    return result;
};
 
if(new URLSearchParams( window.location.search ).get('TU9SRUhBQ0tT') === 'true') return;
 
const $moreHacks = document.createElement('a');
const $ads = document.querySelector('ads');
$moreHacks.innerText = 'Click to get more hacks! (FreeFly)';
$moreHacks.style.display = 'flex';
$moreHacks.style.position = 'absolute';
$moreHacks.style.zIndex = '50';
$moreHacks.style.color = 'red';
$moreHacks.style.backgroundColor = 'yellow';
$moreHacks.style.cursor = 'pointer';
document.body.prepend($moreHacks);
 
$moreHacks.onclick = function() {
    localStorage.setItem('TU9SRUhBQ0tT', true);
    location.href = 'https://ouo.io/hHxbxs1';
};