// ==UserScript==
// @name         你才买身份证读取器！
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去除云筑网没有读取器不能录资料的限制。
// @author       阿荧
// @match        https://lw.yzw.cn/MakeWorkerCard/Index
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465626/%E4%BD%A0%E6%89%8D%E4%B9%B0%E8%BA%AB%E4%BB%BD%E8%AF%81%E8%AF%BB%E5%8F%96%E5%99%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/465626/%E4%BD%A0%E6%89%8D%E4%B9%B0%E8%BA%AB%E4%BB%BD%E8%AF%81%E8%AF%BB%E5%8F%96%E5%99%A8%EF%BC%81.meta.js
// ==/UserScript==


$(document).ready(function () {
    /* globals jQuery, $, waitForKeyElements */
  $('#IDCardNumber,#Gender,#Birthday,#issueOrg,#WorkerName,#Nation,#Address,#txtValidBeginDate,#txtValidEndDate,#CardExpDate').removeAttr('readonly disabled');
    })();