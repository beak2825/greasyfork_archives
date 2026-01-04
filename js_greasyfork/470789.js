// ==UserScript==
// @name         NewBing多模态模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable NewBing multimodal mode!
// @author       PearNo
// @license      MIT
// @match        https://www.bing.com/search?*
// @icon         https://www.bing.com/rp/SOP97zQpFD4pG6teqCTC-c4LEgE.svg
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/470789/NewBing%E5%A4%9A%E6%A8%A1%E6%80%81%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/470789/NewBing%E5%A4%9A%E6%A8%A1%E6%80%81%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

try {
    _w["_sydConvConfig"].sydOptionSets += ",iycapbing,iyxapbing";
    _w["_sydConvConfig"].enableVisualSearch = true;
} catch (err) {
    console.log('代码执行失败: ', err);
}