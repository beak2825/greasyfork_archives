// ==UserScript==
// @name         [銷售POS] 自動選擇xfit418永和店 v1.1
// @namespace    https://www.facebook.com/airlife917339
// @version      1.1
// @description  feel free to donate BTC: 1xb8F4x76ptN2H9MUAhZjvofKw2im1sdq
// @author       Kevin Chang
// @license      airlife917339
// @match        http://118.163.219.211:171/x-fit/login.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444639/%5B%E9%8A%B7%E5%94%AEPOS%5D%20%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87xfit418%E6%B0%B8%E5%92%8C%E5%BA%97%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/444639/%5B%E9%8A%B7%E5%94%AEPOS%5D%20%E8%87%AA%E5%8B%95%E9%81%B8%E6%93%87xfit418%E6%B0%B8%E5%92%8C%E5%BA%97%20v11.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 自動選擇xfit418永和店
    document.querySelector("select#jumpMenu2")[3].selected = 'selected';

})();