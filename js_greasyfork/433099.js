// ==UserScript==
// @name         StockLei
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the stock world!
// @author       kevin.ql
// @match        http://guba.eastmoney.com/list*
// @icon         https://p0.meituan.net/travelcube/9215d23b78ead652745defc43dbf7ecc3238.png?domain=eastmoney.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/433099/StockLei.user.js
// @updateURL https://update.greasyfork.org/scripts/433099/StockLei.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const padTo2 = (val) => `${val}`.length === 2 ? val : `0${val}`

    const m = padTo2(new Date().getMonth() + 1)
    const d = padTo2(new Date().getDate())
    
    const curDateText = `${m}-${d}`
    

    $('.articleh').each((idx,e) => {
        const dateText = $(e).children('span.l5.a5').text()
        const commentText = $(e).children('span.l2.a2').text()
        if (dateText.indexOf(curDateText) === -1 || commentText < 5) {
            $(e).hide()
        }
    })
})();