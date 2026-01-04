// ==UserScript==
// @name         Super Mobs Alert
// @namespace    http://tampermonkey.net/
// @version      11.2
// @description  Show spawn timer, sharing another players. Work In Progress https://discord.gg/2f5aZupe9B Dont use your real discrod you can banned
// @author       @jmatg1
// @license MIT
// @match        https://florr.io
// @icon         https://www.google.com/s2/favicons?sz=64&domain=florr.io
// @grant        none
// @require            https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/465457/Super%20Mobs%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/465457/Super%20Mobs%20Alert.meta.js
// ==/UserScript==
const VERSION = "11.2";
try {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', "https://greasyfork.org/ru/scripts/465457.json");
    xhr.send();

    xhr.onload = function() {
        let obj = JSON.parse(xhr.response)
        if (obj.version !== VERSION){
            window.alert('New Version: https://github.com/jmatg1/florr-io-spawn-alert/raw/main/spawn-alert.user.js')
        } else {

       alert('New Version: https://github.com/jmatg1/florr-io-spawn-alert/raw/main/spawn-alert.user.js')
}
    };
} catch (e){}
return;
