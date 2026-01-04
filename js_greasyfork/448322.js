// ==UserScript==
// @name         个人脚本
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       hj01857655
// @connect      *
// @match        https://mooc1.chaoxing.com/mycourse/*
// @match        https://stat2-ans.chaoxing.com/study-unusual-monitor/*
// @match        https://stat2-ans.chaoxing.com/keeper/study-monitor/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448322/%E4%B8%AA%E4%BA%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/448322/%E4%B8%AA%E4%BA%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let url = location.pathname;
    console.log(location.pathname);
    if (url == '/study-unusual-monitor/unnormalanalysis') {
        setInterval(function () {
            let revoke = document.getElementsByClassName("revoke-btn");
            if (revoke.length != 0) {
                console.log(revoke);
                let revokes = Array.from(revoke);
                revokes.forEach(function (item) {
                    item.click();
                    document.getElementById("revokeConfirmBtn").click();
                })
            } else {

                let nusual = document.getElementsByClassName("del-nusual");
                if (nusual.length != 0) {
                    console.log(nusual);
                    let nusuals = Array.from(nusual);
                    nusuals.forEach(function (item) {
                        item.click();
                        document.getElementById("delUnnormalConfirm").click();
                    })
                } else {

                }
            }
        }, 1000)





    }


    // Your code here...
})();