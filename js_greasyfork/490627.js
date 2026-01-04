// ==UserScript==
// @name         SkPatcher
// @version      0.2.4
// @description  修改 Skulpt 以添加加载 js 库功能。
// @author       lrs2187
// @license MIT
// @match        *://code.xueersi.com/*
// @match        *://turtle.codemao.cn/*
// @match        *://coding.qq.com/*
// @grant        none
// @run-at       document-start
// @namespace https://code.xueersi.com/
// @downloadURL https://update.greasyfork.org/scripts/490627/SkPatcher.user.js
// @updateURL https://update.greasyfork.org/scripts/490627/SkPatcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var counts = 0;

    function waitForSkulpt() {
        if (typeof window.Sk === 'undefined') {
            counts = counts + 1;
            if (counts >= 60)
            {
                console.log("SkPatcher.waitForSkulpt 一分钟过了 Sk 还没发现，正在取消侦听...");
                return;
            }
            setTimeout(waitForSkulpt, 1000);
        } else {
            console.log("SkPatcher.waitForSkulpt 发现了 Sk 对象！正在注入...");
            injectCustomImport();
        }
    }

    function injectCustomImport() {
        window.Sk.builtins.__import__ = function(lib_url, lib_name) {
            console.log('SkPatcher.__import__ 获取到URL ', lib_url, ' 以及名称 ', lib_name);

            var request = new XMLHttpRequest();
            request.open('GET', lib_url.v, false);
            request.send(null);
            if (request.status === 200) {
                var data = request.responseText;
                console.log("SkPatcher.__import__ 成功加载 " + lib_url.v + "！正在添加库...");

                var file_data = lib_url.v.split(".");
                var type = file_data[file_data.length - 1];
                var file_name = "src/lib/" + lib_name.v + "." + type;
                Sk.builtinFiles.files[file_name] = data;
            } else {
                console.log("SkPatcher.__import__ 无法加载 " + lib_url.v + "");
            }
        }
        console.log("SkPatcher.injectCustomImport 成功添加 __import__ 函数！");
    }

    console.log("SkPatcher 尝试侦听 Sk 对象...");
    waitForSkulpt();
})();