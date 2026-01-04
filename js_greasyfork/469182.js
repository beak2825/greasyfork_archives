// ==UserScript==
// @name         bilibili视频比例自动切换4:3
// @namespace    http://tampermonkey.net/
// @version      0079
// @description  jetjiandcyy
// @author       dcyy
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/469182/bilibili%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A24%3A3.user.js
// @updateURL https://update.greasyfork.org/scripts/469182/bilibili%E8%A7%86%E9%A2%91%E6%AF%94%E4%BE%8B%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A24%3A3.meta.js
// ==/UserScript==

(function() {
    setInterval(()=>{document.getElementsByClassName("bui-radio-input")[3].click()},100);
    // Your code here...
})();