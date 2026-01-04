// ==UserScript==
// @name         收起 Felo Search 侧边栏
// @namespace    http://tampermonkey.net/
// @version      0.5
// @icon         https://www.google.com/s2/favicons?sz=64&domain=felo.ai
// @description  启动 Felo Search 后自动收起侧边栏
// @author       Jing Wang
// @contact      yuzhounh@163.com
// @license      GPL-3.0
// @match        https://felo.ai/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511325/%E6%94%B6%E8%B5%B7%20Felo%20Search%20%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/511325/%E6%94%B6%E8%B5%B7%20Felo%20Search%20%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to click the sidebar toggle button
    function closeSidebar() {
        const sidebarToggle = document.querySelector('section.hidden.md\\:block.cursor-pointer');
        if (sidebarToggle) {
            sidebarToggle.click();
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', closeSidebar);

    // // Also run the function periodically in case the button is added dynamically
    // setInterval(closeSidebar, 2000);
})();