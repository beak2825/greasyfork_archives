// ==UserScript==
// @name         Chia Se Nhac (CSN) - Download On Click
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open download page directly when clicking on link
// @author       You
// @match        http://*.chiasenhac.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29733/Chia%20Se%20Nhac%20%28CSN%29%20-%20Download%20On%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/29733/Chia%20Se%20Nhac%20%28CSN%29%20-%20Download%20On%20Click.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $('.musictitle').click(function(e) {
            e.stopPropagation();
            e.preventDefault();

            window.open(e.target.href.replace(".html", "_download.html"),'_blank');
        });
    });
})();