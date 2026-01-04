// ==UserScript==
// @name         [buyi] 广告拦截
// @namespace    buyi
// @version      1.0.0
// @description  拦截广告弹窗
// @author       buyi
// @match        *.caigle.org/*/*
// @match        www.caigle.org
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wgARCAAgACADAREAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAABgcJCAX/xAAZAQACAwEAAAAAAAAAAAAAAAACBQEDBAD/2gAMAwEAAhADEAAAAKox09suonov3EyW8eJlkoet0SoK5QLYeyQtZaSAzG+oUkVUecgnmJkY/wD/xAArEAABBAIBAwIEBwAAAAAAAAABAgMEBQYREgAHIQgyExQiQRYjMTNhcZL/2gAIAQEAAT8A/Qfx16qPVNn9n3nd7VYO/ZQKTH3A3NagLLT9g+ByWXXR7GUAgEf669LPfDJIWS10W7v7OfjWYzDGrkWDqnVsSeXA/DKySEcykbB4nn0NdZS3ZO0UlirSlTro4LBdU0S2feEqAJSojYB14J312SnY1A78X+HX2Mxp9c3Kky48uS1zkQnWljiHSCQpBGwdE7Urq1po+R9z4U3FKG0YRVWDaoLiJX7k08EpZYjAkMsAhK1khO/JA2dhgq4Dn7gBv+/v1MzdJVkdLLlLkEuSURULSWikp0kthST9SdEqGwD4IO+se7MPzvVo9axWJq66/rX7OUtDgQWlIAQ6gJ3pQLgbA2D09h6aZxOYUTsBqM0pMpaUOH5lggJC1ggbUCEaUkkaBUR9wTbZDN7hU7cKyDFY7XF5xjjsPnkdkedA64kHz467zU7+KtyMpoWQs2khBkoUdBLyUkBST9gsDRB8A6PVIxUHJIfcKVfR6idJhOQ5kF+SlXNkLUtooJIKFpUSokDyDojwCMkvKyNi70urtYVlZKKPhwoz4W4tkn8xR47I+gqJ2B4BJ67Lz7TJ3vxBbOJcciwUREKSkgJHI6HnzvQ2T1//xAAeEQACAgICAwAAAAAAAAAAAAABAgADBBESIRMUQf/aAAgBAgEBPwDQEyLQomPdswHcIJmYpmIkUaEV+exL6zYCkpx2pHKNa/mVRMpvX7ETvTxw4Gphlrbix+T/xAAfEQACAgICAwEAAAAAAAAAAAABAgADBDESExEhQQX/2gAIAQMBAT8AGpioxMyKVI5zcT1Pzip3M26pR1qJo+pxmNf0NyGpflJc3H7FqToZjuYdQywUjL1+ajKuJbz9maq00BRsz//Z
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546888/%5Bbuyi%5D%20%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/546888/%5Bbuyi%5D%20%E5%B9%BF%E5%91%8A%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() { 
    'use strict';

    // 拦截拷贝漫画 https://www.caigle.org 广告弹窗
    document.querySelector('.H-display-block').click();
})();