// ==UserScript==
// @name         習下元上
// @namespace    https://greasyfork.org/zh-TW/users/461233-jack850628
// @version      1.1.230228
// @description  在 https://popxi.click/ 中來個 習下元上
// @author       jack850628
// @match        https://web.archive.org/web/*/https://popxi.click/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431309/%E7%BF%92%E4%B8%8B%E5%85%83%E4%B8%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/431309/%E7%BF%92%E4%B8%8B%E5%85%83%E4%B8%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styleBlocks = document.getElementsByTagName('link')[0];
    var style = document.createElement('style');
    style.innerHTML = `
        #xi-down{
            position: fixed;
            top: 62px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 25px;
            background-color: #CD0000;
            color: #FFD700;
        }
    `;
    styleBlocks.parentNode.insertBefore(style, styleBlocks);
    var button = document.createElement('button');
    button.innerText = '🟊習下元上🟊';
    button.addEventListener('pointerdown', function(e){
        e.stopPropagation();
        var scriptBlocks = document.getElementsByTagName('script')[0];
        var script = document.createElement('script');
        script.src="https://xi-down-yuan-up.myonedriveindex.workers.dev/";
        scriptBlocks.parentNode.insertBefore(script, scriptBlocks);
        e.target.hidden = true;
    });
    button.id = 'xi-down';
    document.body.append(button);
})();