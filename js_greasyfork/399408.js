// ==UserScript==
// @name         EditOutside
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  無法進入推文時直接進行內文編輯
// @author       MirukuTEA
// @include      https://kater.me/*
// @exclude      https://kater.me/api/*
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/399408/EditOutside.user.js
// @updateURL https://update.greasyfork.org/scripts/399408/EditOutside.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_registerMenuCommand("編輯", function () {
        Apply();
    });
})();

function Apply() {
    let 編輯內容 = "測試";
    let 文章編號 = "634801";

    let dataObj = {
        "data": {
            "attributes": {
                "content": 編輯內容
            }
        }
    };

    let option = {
        body: JSON.stringify(dataObj),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'x-csrf-token': app.session.csrfToken,
            'x-http-method-override': 'PATCH'
        },
        method: 'POST'
    }

    fetch(`https://kater.me/api/posts/${文章編號}`, option).then(function (response) {
        let status = response.status;
        if (status == 200) {
            console.log("成功編輯");
            location.reload(true);
        } else {
            console.log("錯誤");
        }
    });
}