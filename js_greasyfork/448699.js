// ==UserScript==
// @name           升学 E 网通 (EWT360) 心晴FM 播放速率 16
// @name:en        EWT XINLI FM Playback Rate 16
// @namespace      https://ewt.houtar.eu.org/fm
// @version        1.0.0
// @description    此脚本强制将 EWT 心晴FM 播放速率更改为 16。当您需要运行它时，请在浏览器上下文菜单中单击它。
// @description:en This script forces the EWT XINLI FM playback rate to 16. When you need to run it, click it in the browser context menu.
// @author         Houtar
// @match          http://xinli.ewt360.com/Fm*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=ewt360.com
// @grant          none
// @license        GNU General Public License
// @run-at         context-menu
// @downloadURL https://update.greasyfork.org/scripts/448699/%E5%8D%87%E5%AD%A6%20E%20%E7%BD%91%E9%80%9A%20%28EWT360%29%20%E5%BF%83%E6%99%B4FM%20%E6%92%AD%E6%94%BE%E9%80%9F%E7%8E%87%2016.user.js
// @updateURL https://update.greasyfork.org/scripts/448699/%E5%8D%87%E5%AD%A6%20E%20%E7%BD%91%E9%80%9A%20%28EWT360%29%20%E5%BF%83%E6%99%B4FM%20%E6%92%AD%E6%94%BE%E9%80%9F%E7%8E%87%2016.meta.js
// ==/UserScript==

(function() {
    "use strict";

    var scriptText =
        '\nfor (var i = 0; i < 1000; i++) {\n  document.getElementsByTagName("audio")[0].playbackRate = 16;\n  await (function (time) {\n    return new Promise(function (resolve) {\n      return setTimeout(resolve, time);\n    });\n  })(200);\n}\n';
    var newScript = document.createElement("script");
    var inlineScript = document.createTextNode(scriptText);
    newScript.appendChild(inlineScript);
    newScript.type = 'module';
    document.body.appendChild(newScript);

})();