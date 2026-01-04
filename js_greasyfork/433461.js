// ==UserScript==
// @name        'el-switch' - autohotkey-disabler for luckyfish.io 
// @description  disable hotkeys on luckyfish
// @match        https://luckyfish.io/diceClassic
// @author       Rain_Bot | https://rainbot.ch
// @version      5.2rev7
// @license      Open Source
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/710212
// @downloadURL https://update.greasyfork.org/scripts/433461/%27el-switch%27%20-%20autohotkey-disabler%20for%20luckyfishio.user.js
// @updateURL https://update.greasyfork.org/scripts/433461/%27el-switch%27%20-%20autohotkey-disabler%20for%20luckyfishio.meta.js
// ==/UserScript==

//////////////////////////////////////////////////////////////
// --	☂\(._.\) made with ♥ in Switzerland ((/._.)/☂    -- //
////////////////////////////////////////////////////////////

window.onload = function loadpage() {
    if (document.readyState === 'complete') {
        console.log(document.readyState);
        setTimeout(function() {
            console.log('Open Hotkey Setup-Overlay');
            document.getElementsByClassName("left gameBar_li active")[1].click();
        }, 1234);
        setTimeout(function() {
            console.log('Hotkey Switch "triggered"');
            document.getElementsByClassName("el-switch")[4].click();
        }, 1234);
        setTimeout(function() {
            console.log('Hotkeys ==> "false"');
            document.getElementsByClassName("hotkeys_close iconfont commonAlert_close")[0].click();
            console.log('.');
            console.log('..');
            console.log('...');
            console.log('\nDONE!');
        }, 1234);
        setTimeout(function() {
            console.clear();
        }, 12345);
    }
};