// ==UserScript==
// @name         Evolve(进化)自动采集
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  try to take over the world!
// @author       yoyo
// @match        https://tmvictor.github.io/Evolve-Scripting-Edition/
// @match        https://wdjwxh.github.io/Evolve-Scripting-Edition/
// @match        https://wdjwxh.gitee.io/evolve-scripting-edition/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/405850/Evolve%28%E8%BF%9B%E5%8C%96%29%E8%87%AA%E5%8A%A8%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/405850/Evolve%28%E8%BF%9B%E5%8C%96%29%E8%87%AA%E5%8A%A8%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    console.log('开始执行进化自动点击脚本...');

    // 点击间隔，单位毫秒
    var timeout = 2;

    window.setInterval(function() {

        $("#city-food").children("a")[0].click();
        $("#city-lumber").children("a")[0].click();
        $("#city-stone").children("a")[0].click();
    }, timeout);
})();