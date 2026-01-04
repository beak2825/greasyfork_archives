// ==UserScript==
// @name         知乎去广告
// @match        https://www.zhihu.com/*
// @grant        GM_addStyle
// @icon         https://www.zhihu.com/favicon.ico
// @description  去除侧栏
// @version      0.1-230625
// @namespace    https://greasyfork.org/users/1111723
// @downloadURL https://update.greasyfork.org/scripts/469419/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/469419/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

GM_addStyle("'/html[@class='itcauecng']/body/div[@id='root']/div/main[@class='App-main']/div/div[@class='QuestionPage']/div[@class='Question-main']/div[@class='Question-sideColumn Question-sideColumn--sticky css-1qyytj7']'{display:none !important}")