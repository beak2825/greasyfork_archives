// ==UserScript==
// @name         Steam小红车解除锁区
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Steam解除锁区
// @description  try to take over the world!
// @author       初唐四杰
// @match        https://store.steampowered.com/account/preferences/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474194/Steam%E5%B0%8F%E7%BA%A2%E8%BD%A6%E8%A7%A3%E9%99%A4%E9%94%81%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/474194/Steam%E5%B0%8F%E7%BA%A2%E8%BD%A6%E8%A7%A3%E9%99%A4%E9%94%81%E5%8C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有具有特定class名称的元素
    var g1 = document.getElementsByClassName("preference_row account_setting_not_customer_facing ");
    /*g1[0].innerHTML = `<div class="store_pref_desc">
		<label class="account_manage_checkbox">
			被屏蔽内容1&nbsp;
		</label>
		<span class="account_setting_parenthetical">
			被屏蔽内容1
			<br>
			<a href="javascript:ViewTitlesWithDescriptors( 4 );">查看示例产品 </a>
		</span>
	</div>
	<div class="store_pref_col">
		<input type="checkbox" id="descriptor_4_store" class="content_descriptor_checkbox store" value="4">
	</div>
	<div class="community_pref_col">
		<input type="checkbox" id="descriptor_4_community" class="content_descriptor_checkbox community" value="4">
	</div>`;*/
    g1[0].className = "preference_row ";
    /*g1[0].innerHTML = `<div class="store_pref_desc">
		<label class="account_manage_checkbox">
			被屏蔽内容2&nbsp;
		</label>
		<span class="account_setting_parenthetical">
			被屏蔽内容2
			<br>
			<a href="javascript:ViewTitlesWithDescriptors( 3 );">查看示例产品 </a>
		</span>
	</div>
	<div class="store_pref_col">
		<input type="checkbox" id="descriptor_3_store" class="content_descriptor_checkbox store" value="3">
	</div>
	<div class="community_pref_col">
		<input type="checkbox" id="descriptor_3_community" class="content_descriptor_checkbox community" value="3">
	</div>`;*/
    g1[0].className = "preference_row ";


 
})();