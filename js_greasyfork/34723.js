// ==UserScript==
// @name         Kylin OA Chrome BUG 修复助手
// @namespace    http://tampermonkey.net/
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version      0.1
// @description  蛋疼的 OA BUG，没有人管就自己修复，无 Fuck 说
// @author       JackieLiu
// @match        *://oa.kylinos.cn:5677/jsoa/InformationAction.do*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34723/Kylin%20OA%20Chrome%20BUG%20%E4%BF%AE%E5%A4%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/34723/Kylin%20OA%20Chrome%20BUG%20%E4%BF%AE%E5%A4%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$("#menuTable").removeAttr("height");