// ==UserScript==
// @name         Chaoxing Prevent Video Pause
// @namespace    http://your-namespace.com
// @version      1.1
// @description  Test overriding addEventListener to block certain events from being added to the page.
// @author       Your Name
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy?*
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/508967/Chaoxing%20Prevent%20Video%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/508967/Chaoxing%20Prevent%20Video%20Pause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 阻止页面添加特定事件的监听器
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (['visibilitychange', 'mouseleave', 'mouseout', 'blur'].includes(type)) {
            console.log(`Blocked adding event listener for ${type}`);
            return; // 不添加这些监听器
        }
        return originalAddEventListener.apply(this, arguments);
    };

    console.log('Overridden addEventListener to block specific events.');
})();
