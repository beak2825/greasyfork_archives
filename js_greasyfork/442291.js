// ==UserScript==
// @name         人力-測試機&正式機-需工單列表-媒合按扭
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  需工單列表-媒合按扭
// @author       hander
// @match        http://localhost:30942/WorkApplications/Manage
// @match        https://lcahr.lingcheng.tw/TalentMatchBox/WorkApplications/Manage
// @match        https://lcahr.lingcheng.tw/TalentMatch/WorkApplications/Manage
// @match        https://ahr.coa.gov.tw/TalentMatch/WorkApplications/Manage
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442291/%E4%BA%BA%E5%8A%9B-%E6%B8%AC%E8%A9%A6%E6%A9%9F%E6%AD%A3%E5%BC%8F%E6%A9%9F-%E9%9C%80%E5%B7%A5%E5%96%AE%E5%88%97%E8%A1%A8-%E5%AA%92%E5%90%88%E6%8C%89%E6%89%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/442291/%E4%BA%BA%E5%8A%9B-%E6%B8%AC%E8%A9%A6%E6%A9%9F%E6%AD%A3%E5%BC%8F%E6%A9%9F-%E9%9C%80%E5%B7%A5%E5%96%AE%E5%88%97%E8%A1%A8-%E5%AA%92%E5%90%88%E6%8C%89%E6%89%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(showMatchWorkAppBtn, 1000);

    function showMatchWorkAppBtn() {
        let $btns = $(".btn-match-work-app");
        if ($btns.length > 0) {
            $btns.show();
        }
    }

})();