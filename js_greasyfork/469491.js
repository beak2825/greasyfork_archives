// ==UserScript==
// @name         CUG研究生系统自动评价
// @namespace    http://your-namespace.com
// @version      2.0
// @description  在教务系统的教师评价界面，自动填写全部下拉菜单为很好
// @match        https://epo.cug.edu.cn/Gstudent/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/469491/CUG%E7%A0%94%E7%A9%B6%E7%94%9F%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/469491/CUG%E7%A0%94%E7%A9%B6%E7%94%9F%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to select the "很好" option
    function selectRatingOption() {
        var dropdowns = document.querySelectorAll('select[id^="ctl00_contentParent_dgData"]');
        for (var i = 0; i < dropdowns.length; i++) {
            var dropdown = dropdowns[i];
            dropdown.value = "90"; // Select the "很好" option (value="90")
        }
    }

    // Wait for the table to load, then select the rating option
    var observer = new MutationObserver(function(mutations) {
        var table = document.getElementById('ctl00_contentParent_dgData');
        if (table) {
            selectRatingOption();
            observer.disconnect();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();