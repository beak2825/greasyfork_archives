// ==UserScript==
// @name         TalkMED删除侧边栏
// @namespace    http://Andy.loo
// @version      0.1
// @description  删除TalkMED侧边栏
// @author       Anduloo@gmail.com
// @match        https://meeting.talkmed.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539589/TalkMED%E5%88%A0%E9%99%A4%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/539589/TalkMED%E5%88%A0%E9%99%A4%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==
GM_addStyle ( `
.flexcolum.right
{
           display:none
           }
` );