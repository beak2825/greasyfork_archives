// ==UserScript==
// @name         Workflowy網頁版 - 屏蔽超過額度彈窗
// @version      1.0.1
// @description  屏蔽超過額度彈窗與狀態條
// @author       干旱受音
// @match        https://workflowy.com/*
// @license      GNU GPLv3
// @icon         https://workflowy.com/media/i/favicon.ico
// @run-at       document-end
// @namespace    https://greasyfork.org/zh-TW/users/1326845
// @downloadURL https://update.greasyfork.org/scripts/513351/Workflowy%E7%B6%B2%E9%A0%81%E7%89%88%20-%20%E5%B1%8F%E8%94%BD%E8%B6%85%E9%81%8E%E9%A1%8D%E5%BA%A6%E5%BD%88%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/513351/Workflowy%E7%B6%B2%E9%A0%81%E7%89%88%20-%20%E5%B1%8F%E8%94%BD%E8%B6%85%E9%81%8E%E9%A1%8D%E5%BA%A6%E5%BD%88%E7%AA%97.meta.js
// ==/UserScript==

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML =
`
/* structure
  modal
   - mask
   - ad_box
*/

/* ad_box */
.dialog-box._11df0os.p-2xl {
    
}

/* mask */ /* selector syntax： A:has(B) B */
._1uv3mw5:has(.dialog-box._11df0os.p-2xl) ._13gp8a  {
    display: none !important;
}

/* modal */ /* selector syntax： A:has(B) */
._1uv3mw5:has(.dialog-box._11df0os.p-2xl) {
    position: static !important;
}

/* status */
._1q5f458 {
    display: none !important;
}
`;

document.head.appendChild(style);