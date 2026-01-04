// ==UserScript==
// @name         CookData 数据酷客实训，允许复制内容
// @namespace    ipid
// @version      0.1.2
// @description  允许复制课程左边的文字
// @author       ipid
// @match        *://zhsx.cookdata.cn/course/mission/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387036/CookData%20%E6%95%B0%E6%8D%AE%E9%85%B7%E5%AE%A2%E5%AE%9E%E8%AE%AD%EF%BC%8C%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/387036/CookData%20%E6%95%B0%E6%8D%AE%E9%85%B7%E5%AE%A2%E5%AE%9E%E8%AE%AD%EF%BC%8C%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let content = document.querySelector(".lecture-content-wrapper") || document.querySelector(".left-part")
    if (!content) {
        return
    }

    content.contentEditable = true

    let ctrlClicking = false
    const ctrlKey = 17, cmdKey = 91, cKey = 67

    content.addEventListener("keydown", function (e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
            ctrlClicking = true
            return
        } else if (ctrlClicking && e.keyCode == cKey) {
            return
        }

        e.preventDefault()
        e.stopPropagation()
    })

    content.addEventListener("keyup", function (e) {
        if (e.keyCode == ctrlKey || e.keyCode == cmdKey) {
            ctrlClicking = false
            return
        }

        e.preventDefault()
        e.stopPropagation()
    })
})();
