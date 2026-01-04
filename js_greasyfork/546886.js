// ==UserScript==
// @name         [buyi] 油猴文档美化
// @namespace    buyi
// @version      1.0.0
// @description  美化油猴文档界面
// @author       buyi
// @match        https://www.tampermonkey.net/documentation.php*
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wgARCAAgACADAREAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAABgcJCAX/xAAZAQACAwEAAAAAAAAAAAAAAAACBQEDBAD/2gAMAwEAAhADEAAAAKox09suonov3EyW8eJlkoet0SoK5QLYeyQtZaSAzG+oUkVUecgnmJkY/wD/xAArEAABBAIBAwIEBwAAAAAAAAABAgMEBQYREgAHIQgyExQiQRYjMTNhcZL/2gAIAQEAAT8A/Qfx16qPVNn9n3nd7VYO/ZQKTH3A3NagLLT9g+ByWXXR7GUAgEf669LPfDJIWS10W7v7OfjWYzDGrkWDqnVsSeXA/DKySEcykbB4nn0NdZS3ZO0UlirSlTro4LBdU0S2feEqAJSojYB14J312SnY1A78X+HX2Mxp9c3Kky48uS1zkQnWljiHSCQpBGwdE7Urq1po+R9z4U3FKG0YRVWDaoLiJX7k08EpZYjAkMsAhK1khO/JA2dhgq4Dn7gBv+/v1MzdJVkdLLlLkEuSURULSWikp0kthST9SdEqGwD4IO+se7MPzvVo9axWJq66/rX7OUtDgQWlIAQ6gJ3pQLgbA2D09h6aZxOYUTsBqM0pMpaUOH5lggJC1ggbUCEaUkkaBUR9wTbZDN7hU7cKyDFY7XF5xjjsPnkdkedA64kHz467zU7+KtyMpoWQs2khBkoUdBLyUkBST9gsDRB8A6PVIxUHJIfcKVfR6idJhOQ5kF+SlXNkLUtooJIKFpUSokDyDojwCMkvKyNi70urtYVlZKKPhwoz4W4tkn8xR47I+gqJ2B4BJ67Lz7TJ3vxBbOJcciwUREKSkgJHI6HnzvQ2T1//xAAeEQACAgICAwAAAAAAAAAAAAABAgADBBESIRMUQf/aAAgBAgEBPwDQEyLQomPdswHcIJmYpmIkUaEV+exL6zYCkpx2pHKNa/mVRMpvX7ETvTxw4Gphlrbix+T/xAAfEQACAgICAwEAAAAAAAAAAAABAgADBDESExEhQQX/2gAIAQMBAT8AGpioxMyKVI5zcT1Pzip3M26pR1qJo+pxmNf0NyGpflJc3H7FqToZjuYdQywUjL1+ajKuJbz9maq00BRsz//Z
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546886/%5Bbuyi%5D%20%E6%B2%B9%E7%8C%B4%E6%96%87%E6%A1%A3%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546886/%5Bbuyi%5D%20%E6%B2%B9%E7%8C%B4%E6%96%87%E6%A1%A3%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() { 
    'use strict';

    // 复制目录
    var toc = document.querySelector('#toc');
    var tocClone = toc.cloneNode(true);
    tocClone.id = 'toc-clone';
    document.querySelector('#top > div.row.content').appendChild(tocClone);

    var style = document.createElement('style');
    style.textContent = `
    #toc-clone {
        position: fixed;
        top: 160px;
        left: 0;
        width: calc(100vw / 2 - 470px - 20px);
        height: calc(100vh - 200px);
        margin-left: 10px;
        padding-left: 10px;
        padding-right: 10px;
        box-sizing: border-box;
        border: 1px solid;
        z-index: 9999;
        overflow-y: scroll;
    }
    #toc-clone a {
        word-wrap: break-word;
    }
    `
    document.body.append(style);
})();