// ==UserScript==
// @name         PTT 显示原始分享率
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  修改 PTT 信息条显示原始分享率
// @author       You
// @match        https://www.pttime.org/
// @match        https://www.pttime.org/*
// @icon         https://www.pttime.org/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476142/PTT%20%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%A7%8B%E5%88%86%E4%BA%AB%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/476142/PTT%20%E6%98%BE%E7%A4%BA%E5%8E%9F%E5%A7%8B%E5%88%86%E4%BA%AB%E7%8E%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.evaluate('//*[@id="info_block"]/tbody/tr[2]/td/div[1]/span[1]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.innerHTML = document.evaluate('//*[@id="info_block"]/tbody/tr[2]/td/div[1]/span[1]',document,null,XPathResult.FIRST_ORDERED_NODE_TYPE,null).singleNodeValue.innerHTML.replace("≥10.00"," " + parseInt(parseFloat(document.evaluate('/html/body/table[2]/tbody/tr/td/table[2]/tbody/tr[2]/td/div[1]/span[2]/text()',document,null,XPathResult.STRING_TYPE,null).stringValue)/parseFloat(document.evaluate('/html/body/table[2]/tbody/tr/td/table[2]/tbody/tr[2]/td/div[1]/span[3]/text()',document,null,XPathResult.STRING_TYPE,null).stringValue)*100)/100.0.toString());
})();