// ==UserScript==
// @name         Tập trung VioEdu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Có thể nhắc nhở bạn bất cứ lúc nào, bất cứ nơi đâu.
// @author       Vui VioEdu
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454922/T%E1%BA%ADp%20trung%20VioEdu.user.js
// @updateURL https://update.greasyfork.org/scripts/454922/T%E1%BA%ADp%20trung%20VioEdu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sitename = window.location.hostname
    if (sitename != "vio.edu.vn") {
        alert("Đừng có mất tập trung, ba mẹ la đấy!");
        confirm(`Hãy tập trung làm nhiệm vụ lại vào VioEdu nhé! Đừng vào ${sitename} khi chưa xong nhiệm vụ nha!`);
        window.open("https://vio.edu.vn/skill-list/", "_self");
    }
})();