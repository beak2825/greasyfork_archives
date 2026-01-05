// ==UserScript==
// @name         百度网盘md5显示
// @namespace    undefined
// @version      0.3
// @description  在只有一个文件的百度网盘分享页显示文件的md5
// @author       myfreeer
// @license      MIT
// @match        *://pan.baidu.com/s/*
// @match        *://yun.baidu.com/s/*
// @match        *://pan.baidu.com/share/link*
// @match        *://yun.baidu.com/share/link*
// @run-at       body-end
// @downloadURL https://update.greasyfork.org/scripts/24507/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98md5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/24507/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98md5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==
//Compiled by Babel from https://gist.github.com/myfreeer/c4e9a204be4e8846fe8578078c1a8c43
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
    'use strict';

    var elementToInject = document.querySelectorAll('.bd-aside');
    if (typeof yunData !== 'undefined' && !yunData.FILEINFO || typeof yunData !== 'undefined' && yunData.FILEINFO.length < 2 || typeof yunData === 'undefined') {
        var allscript = document.querySelectorAll('script');
        elementToInject = document.querySelectorAll('.slide-show-other-infos');
        //console.log(elementToInject, 'method1');
        var md5arr = [].concat(_toConsumableArray(document.querySelectorAll('script'))).map(function (e) {
            return e.innerHTML && e.innerHTML.match(/\"md5"[: ]+\"([0-9a-fA-F]+)\"/) && e.innerHTML.match(/\"md5"[: ]+\"([0-9a-fA-F]+)\"/)[1];
        }).filter(function (e) {
            return e === 0 || e;
        });
        var md5 = md5arr.length > 0 && md5arr.reduce(function (e) {
            return e;
        });
        if (!md5 && typeof yunData !== 'undefined' && !yunData.FILEINFO && !yunData.FILEINFO[0] && !yunData.FILEINFO[0].md5) md5 = yunData.FILEINFO[0].md5;
        if (md5 && elementToInject && elementToInject[0] && elementToInject[0].appendChild) elementToInject[0].appendChild(document.createTextNode("md5: " + md5));
    } else {
        //console.log(elementToInject, 'method2');
        if (elementToInject.length < 1) elementToInject = document.querySelectorAll('#layoutAside');
        yunData.FILEINFO.map(function (e) {
            return e && e.md5 && e.server_filename && elementToInject && elementToInject[0] && elementToInject[0].appendChild && elementToInject[0].appendChild(document.createTextNode(e.server_filename + " : " + e.md5 + "\n"));
        });
    }
})();