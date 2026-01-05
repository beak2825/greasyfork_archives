// ==UserScript==
// @name         Add git clone for github
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给github克隆地址添加克隆命令
// @author       Colin Zeb
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25071/Add%20git%20clone%20for%20github.user.js
// @updateURL https://update.greasyfork.org/scripts/25071/Add%20git%20clone%20for%20github.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clonebtnselector = "#js-repo-pjax-container > div.container.new-discussion-timeline.experiment-repo-nav > div.repository-content > div.file-navigation.in-mid-page > div.select-menu.get-repo-select-menu.js-menu-container.float-right.select-menu-modal-right > button";
    var clonedomselector = '.form-control.input-monospace.input-sm.js-zeroclipboard-target.js-url-field';
    var toggleselector = '.btn-link.btn-change-protocol.js-toggler-target.float-right';
    var btn = document.querySelector(clonebtnselector);
    if (btn) {
        btn.addEventListener('click', function () {
            setTimeout(function () {
                var res = document.querySelectorAll(clonedomselector);
                var toggle = document.querySelectorAll(toggleselector);
                var clonedom = res;
                var addfunck = function (item) {
                    item.value = "git clone " + item.value;
                };
                //clonedom.value = "git clone " + clonedom.value;
                //console.log('a');
                //var changefunc = function () {
                //    setTimeout(function () {
                //        if (!clonedom.value.startsWith('git clone')) {
                //            clonedom.value = "git clone " + clonedom.value;
                //        }

                //    }, 100);
                //};
                //toggle[0].addEventListener("click", changefunc);
                //toggle[1].addEventListener("click", changefunc);
                addfunck(clonedom[0]);
                addfunck(clonedom[1]);
            });
        });
    }


})();