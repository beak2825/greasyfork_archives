// ==UserScript==
// @name         日本疫苗自动寻找可预约地址(自动刷新)
// @namespace    No
// @version      0.1
// @description  No
// @author       SONG.H
// @match        https://vaccines.sciseed.jp/*/department/search*
// @icon         https://www.google.com/s2/favicons?domain=sciseed.jp
// @grant        none
// @require https://cdn.bootcdn.net/ajax/libs/sweetalert/2.1.2/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/430961/%E6%97%A5%E6%9C%AC%E7%96%AB%E8%8B%97%E8%87%AA%E5%8A%A8%E5%AF%BB%E6%89%BE%E5%8F%AF%E9%A2%84%E7%BA%A6%E5%9C%B0%E5%9D%80%28%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/430961/%E6%97%A5%E6%9C%AC%E7%96%AB%E8%8B%97%E8%87%AA%E5%8A%A8%E5%AF%BB%E6%89%BE%E5%8F%AF%E9%A2%84%E7%BA%A6%E5%9C%B0%E5%9D%80%28%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
   window.onload = function () {
        let interVal = setInterval(function () {
            let el = document.querySelector(".available-true");
            if (el) {
                clearInterval(interVal);
                swal("进入可预约地址", {
                    buttons: false,
                    timer: 0,
                });
                el.click();
            } else {
                swal("无可预约选项，重新载入页面中", {
                    buttons: false,
                    timer: 0,
                });
                location.reload();
            }
        }, 1500);
    }
})();