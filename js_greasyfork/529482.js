// ==UserScript==
// @name         TalkMED删除侧边栏
// @namespace    https://meeting.talkmed.com
// @version      0.1
// @description  用于删除Talkmed侧边栏，只显示视频区域
// @author       anduloo@gmail.com
// @match        *://meeting.talkmed.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529482/TalkMED%E5%88%A0%E9%99%A4%E4%BE%A7%E8%BE%B9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529482/TalkMED%E5%88%A0%E9%99%A4%E4%BE%A7%E8%BE%B9%E6%A0%8F.meta.js
// ==/UserScript==
GM_addStyle ( `
.flexcolum.right
{
           display:none
           }
` );