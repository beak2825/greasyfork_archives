
// ==UserScript==
// @name         复制百度文库
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Jachin
// @match        http*://wenku.baidu.com/view/*
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      *
// @require      https://greasyfork.org/scripts/420118-cycle/code/Cycle.js
// @require      https://greasyfork.org/scripts/420119-utils-lib/code/Utils-lib.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/420076/%E5%A4%8D%E5%88%B6%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/420076/%E5%A4%8D%E5%88%B6%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93.meta.js
// ==/UserScript==

unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
unsafeWindow.GM_setClipboard = GM_setClipboard;

function exportObj(obj){
    let out = document.title.replace(/\||<|>|\?|\*|:|\/|\\|"|\n/g, ' ') + ".json";
    let data = JSON.stringify(JSON.decycle(obj), null, 4);
    exportRaw(out, data);
}

utils.exportObj = exportObj;
utils.$ = $;

unsafeWindow.$1 = $;
unsafeWindow.utils = utils;

(function() {
    'use strict';
    GM_registerMenuCommand(`Copy`, function(){
        let obj = $1("#reader-container")
        let out = obj.text();
        console.log(out)
        GM_setClipboard(out)
        utils.exportRaw(document.title+".txt", out)
    });
})();
