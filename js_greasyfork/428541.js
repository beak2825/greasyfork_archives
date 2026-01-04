// ==UserScript==
// @name         综合素质评价云平台移除重置密码
// @namespace    http://czpj.yqedu.cn/resetpassword
// @version      0.1
// @description  移除综合素质评价云平台的重置密码弹窗
// @author       Houtarchat
// @match        https://czpj.yqedu.cn/eedu_base/r_index.do*
// @icon         https://czpj.yqedu.cn/eedu_base/images/lg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428541/%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%E4%BA%91%E5%B9%B3%E5%8F%B0%E7%A7%BB%E9%99%A4%E9%87%8D%E7%BD%AE%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/428541/%E7%BB%BC%E5%90%88%E7%B4%A0%E8%B4%A8%E8%AF%84%E4%BB%B7%E4%BA%91%E5%B9%B3%E5%8F%B0%E7%A7%BB%E9%99%A4%E9%87%8D%E7%BD%AE%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

/* jshint esversion: 10 */

(async function() {
	'use strict';

	while (true) {
	try {
		document.querySelector("#mini-22").remove();
		document.querySelector("#__modalmini-22").remove();
		return;
	} catch {
		await new Promise(r => setTimeout(r, 1));
	}
	try {
		document.querySelector("#myDlg_m_d_uid1").remove();
        document.querySelector("body > div.full_bg_mask").remove();
		return;
	} catch {
		await new Promise(r => setTimeout(r, 1));
	}
}
})();