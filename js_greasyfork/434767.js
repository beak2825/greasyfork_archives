// ==UserScript==
// @name         新版山大自动评教 2022-6-20
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  偷懒用
// @author       Sakura
// @match        bkzhjx.wh.sdu.edu.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434767/%E6%96%B0%E7%89%88%E5%B1%B1%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%202022-6-20.user.js
// @updateURL https://update.greasyfork.org/scripts/434767/%E6%96%B0%E7%89%88%E5%B1%B1%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%202022-6-20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a = document.querySelectorAll('.icon-radio')
    for(var i = 0; i < 20; i++){
        a[i * 5].click()
    }
    a[102].click()
    a[105].click()
    //document.querySelectorAll('#jynr')[0].innerText = "课程满意，讲课生动，受益良多"
    //document.querySelectorAll('#jynr')[1].innerText = "整体效果满意，因为教学效果很好"
    //document.querySelectorAll('#jynr')[2].innerText = "效果较好"
    document.querySelector("#jynr_4A239FA80F1C4870AF816E09B6599CEC").innerText = "课程满意，讲课生动，受益良多"
    window.scrollTo(0, document.documentElement.clientHeight)


})();