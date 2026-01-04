// ==UserScript==
// @name         Udemy Notifications Enhanced
// @namespace    https://github.com/lundeen-bryan
// @author       lundeen-bryan
// @version      1.0.1
// @description  Enhances the Udemy notification area to show more and make the buttons more accessible.
// @match        https://www.udemy.com/user/view-notifications/
// @icon         tbd
// @homepage     tbd
// @license      MIT
// @run-at       document-end
// @noframes     n/a
// @unwrap       n/a
// @downloadURL https://update.greasyfork.org/scripts/486876/Udemy%20Notifications%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/486876/Udemy%20Notifications%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = `
    /* Your CSS goes here */
    /* Make main container flexible and stack children vertically */
    [data-testid="notification-tab-pane-student"] {
        display: flex;
        flex-direction: column;
    }
    /* Move notification list to end
    *  Make text wide enough to fill
    *  the width of the screen. */
    .activity-notifications-module--notification-list--3I_hF {
        order: 3;
        width: 220%;
        margin: 0 auto;
        max-width: 1500px;
    }
    /* Move 'load more' and 'mark all as read' to start */
    .activity-notifications-module--load-more-row--3_jVO, .activity-notifications-module--footer--3bQw7 {
        order: 1;
    }
    /* Align 'load more' contents to left */
    .activity-notifications-module--load-more-row--3_jVO {
        justify-content: left;
    }
    .activity-notification-module--notification-info--3Yr2y {
        height: 170px;
    }
    /* create CRLF after title then, normal font for the body text */
    span[data-purpose="safely-set-inner-html:activity-notification:notification-template"] span.subject::before {
      content: "\\A";
      white-space: pre;
    }
    .subject {
      font-weight: normal;
    }
    /* Text area for message body */
    .item-card-module--item-card-title--S729p{
      height: 250px;
    }
    /* move the msg body down a little to reveal the time posted */
    .item-card-module--item-card-title--S729p{
     padding-top: 5px;
    }
    /* increase msg vertical scroll area */
    .activity-notifications-module--notification-list--3I_hF{
      max-height:300rem
    }
    /* size of the card area where messages are shown */
    .activity-notification-module--card-container--3C8QZ {
      height: 300px
    }
    `;

    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    document.head.appendChild(style);
})();
