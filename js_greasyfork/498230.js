// ==UserScript==
// @name         显示阿里万象召唤人工客服按钮
// @namespace    http://tampermonkey.net/
// @version      2024-06-18
// @description  显示隐藏的列表项：召唤人工客服按钮
// @author       You
// @match        https://everyhelp.taobao.com/screen/home.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/498230/%E6%98%BE%E7%A4%BA%E9%98%BF%E9%87%8C%E4%B8%87%E8%B1%A1%E5%8F%AC%E5%94%A4%E4%BA%BA%E5%B7%A5%E5%AE%A2%E6%9C%8D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/498230/%E6%98%BE%E7%A4%BA%E9%98%BF%E9%87%8C%E4%B8%87%E8%B1%A1%E5%8F%AC%E5%94%A4%E4%BA%BA%E5%B7%A5%E5%AE%A2%E6%9C%8D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to search for the <li> tag and modify its display property
    function showHiddenListItem() {
        // Get all <li> tags on the page
        const listItems = document.querySelectorAll('li');

        // Iterate through each <li> tag
        listItems.forEach(li => {
            // Check if the <li> tag contains the specific substring
            if (li.innerHTML.includes('召唤人工客服')) {
                // Modify the CSS to display the <li> tag
                li.style.setProperty('display','inline-flex','important');
            }
        });
    }

    // Run the function after the page has loaded
    window.addEventListener('load', showHiddenListItem);

})();
