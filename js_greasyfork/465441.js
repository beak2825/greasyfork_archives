// ==UserScript==
// @name         PT低分享率自动下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  低分享率时下载种子自动选中【我会提高分享率的】，并自动点击下载
// @author       shareit
// @match        https://*/*
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @compatible   Chrome
// @compatible   Firefox
// @compatible   Edge
// @compatible   Safari
// @compatible   Opera
// @compatible   UC
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465441/PT%E4%BD%8E%E5%88%86%E4%BA%AB%E7%8E%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/465441/PT%E4%BD%8E%E5%88%86%E4%BA%AB%E7%8E%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }


  setTimeout(function () {
    var checkbox = document.getElementById("letmedown");//
    if(checkbox && !check.checked){
        //checkbox.checked = true;
        checkbox.click();
        console.log("选中【我会提高分享率的】");

        sleep(500).then(() => {
            document.getElementById("continuedownload").click();
            console.log("点击【继续下载】");
        });
    }


  }, 500);
})();

