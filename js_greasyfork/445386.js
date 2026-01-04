// ==UserScript==
// @name         挖掘机世界
// @namespace    https://play.diggersworld.io/
// @version      0.1
// @description  挖掘机世界全自动脚本
// @author       Jupiter
// @match        https://play.diggersworld.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diggersworld.io
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445386/%E6%8C%96%E6%8E%98%E6%9C%BA%E4%B8%96%E7%95%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/445386/%E6%8C%96%E6%8E%98%E6%9C%BA%E4%B8%96%E7%95%8C.meta.js
// ==/UserScript==

(function() {

    window.loadScript = function () {
        const script = document.createElement('script');
        script.src = 'https://uxpinchina.com/wax-script/diggerswgame.js';
        //script.src = 'http://localhost:8000/diggerswgame.js';
        document.body.append(script);

        script.onload = function () {
            window.setGameName('diggerswgame');
            window.appendiFrame('tools','diggerswgame');
        }
    };

    window.loadScript();

})();