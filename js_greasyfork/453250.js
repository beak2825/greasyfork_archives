// ==UserScript==
// @name         k8s下载文件
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  下载K8s中文件
// @author       五十八家
// @match        https://kuboard.dev.htairline.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=htairline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453250/k8s%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/453250/k8s%E4%B8%8B%E8%BD%BD%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.gardActionRequiresLicenseId = setInterval(function () {
    var oldNew = KuboardLicenseUtil.gardActionRequiresLicense;
    KuboardLicenseUtil.gardActionRequiresLicense = function () {
        if (arguments.length >= 2 && arguments[1].indexOf("收费") !== -1) {
            return arguments[2]();
        } else {
            return oldNew(...arguments)
        }
    }
    console.log("k8s下载方法替换完毕");
    clearInterval(window.gardActionRequiresLicenseId);
}, 1000)

window.hasGrantId = setInterval(function () {
    KuboardLicenseUtil.hasGrant = function () {return true}
    console.log("k8s判断方法替换完毕");
    clearInterval(window.hasGrantId);
}, 1000)

})();