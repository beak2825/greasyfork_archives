// ==UserScript==
// @name         智慧树自动填写调查并提交
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *.zhihuishu.com/onlineSchool/teachSurvey/listStuSurvey*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369731/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%B0%83%E6%9F%A5%E5%B9%B6%E6%8F%90%E4%BA%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/369731/%E6%99%BA%E6%85%A7%E6%A0%91%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%B0%83%E6%9F%A5%E5%B9%B6%E6%8F%90%E4%BA%A4.meta.js
// ==/UserScript==

(function() {
    try {
        $('a.fr').click()
        Array.from($('input[type=radio]')).reverse().forEach(item => item.click())
        Array.from($('.ContentEva')).forEach(item => item.value = '非常棒')
        $('.popbtn_yes').click()
        setTimeout(() => {
            $('#close_windowa').click()
        }, 3000)
    } catch(e) {
        console.error(e)
    }
})();