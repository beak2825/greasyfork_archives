// ==UserScript==
// @name         Keylol恢复旧版用户组勋章
// @namespace    keylol
// @version      0.1
// @description  恢复keylol论坛旧版用户组样式，移除勋章展位限制，参考：https://keylol.com/t652563-1-1
// @author       FlyNine
// @match        *://keylol.com/*
// @grant        GM_addStyle
// @icon         https://keylol.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/464994/Keylol%E6%81%A2%E5%A4%8D%E6%97%A7%E7%89%88%E7%94%A8%E6%88%B7%E7%BB%84%E5%8B%8B%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/464994/Keylol%E6%81%A2%E5%A4%8D%E6%97%A7%E7%89%88%E7%94%A8%E6%88%B7%E7%BB%84%E5%8B%8B%E7%AB%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
		.usergroup {
			display: inline-block;
		}

		.usergroup img {
			display: none;
		}

		/* 预备会员 */
		.usergroup[id$="_30"]::after {
			content: url(https://keylol.com/data/attachment/common/34/common_30_usergroup_icon.jpg);
		}

		/* 初阶会员 */
		.usergroup[id$="_31"]::after {
			content: url(https://keylol.com/data/attachment/common/c1/common_31_usergroup_icon.jpg);
		}

		/* 进阶会员 */
		.usergroup[id$="_32"]::after {
			content: url(https://keylol.com/data/attachment/common/63/common_32_usergroup_icon.jpg);
		}

		/* 高阶会员 */
		.usergroup[id$="_33"]::after {
			content: url(https://keylol.com/data/attachment/common/18/common_33_usergroup_icon.jpg);
		}

		/* 精锐会员 */
		.usergroup[id$="_34"]::after {
			content: url(https://keylol.com/data/attachment/common/e3/common_34_usergroup_icon.jpg);
		}

		/* 支柱会员 */
		.usergroup[id$="_35"]::after {
			content: url(https://keylol.com/data/attachment/common/1c/common_35_usergroup_icon.jpg);
		}

		/* 核心会员 */
		.usergroup[id$="_36"]::after {
			content: url(https://keylol.com/data/attachment/common/19/common_36_usergroup_icon.jpg);
		}

		/* 旗舰会员 */
		.usergroup[id$="_37"]::after {
			content: url(https://keylol.com/data/attachment/common/a5/common_37_usergroup_icon.jpg);
		}

		/* 毕业会员 */
		.usergroup[id$="_51"]::after {
			content: url(https://keylol.com/data/attachment/common/28/common_51_usergroup_icon.png);
		}

		/* 绿光作者 */
		.usergroup[id$="_46"]::after {
			content: url(https://keylol.com/data/attachment/common/d9/common_46_usergroup_icon.png);
		}

		/* 认证发行商 */
		.usergroup[id$="_49"]::after {
			content: url(https://keylol.com/data/attachment/common/f4/common_49_usergroup_icon.png);
		}

		/* 平台开发者 */
		.usergroup[id$="_47"]::after {
			content: url(https://keylol.com/data/attachment/common/67/common_47_usergroup_icon.png);
		}

		/* 论坛贵宾 */
		.usergroup[id$="_16"]::after {
			content: url(https://keylol.com/data/attachment/common/c7/common_16_usergroup_icon.png);
		}

		/* 实习版主 */
		.usergroup[id$="_24"]::after {
			content: url(https://keylol.com/data/attachment/common/1f/common_24_usergroup_icon.png);
		}

		/* 版主 */
		.usergroup[id$="_3"]::after {
			content: url(https://keylol.com/data/attachment/common/ec/common_3_usergroup_icon.jpg);
		}

		/* 超级版主 */
		.usergroup[id$="_2"]::after {
			content: url(https://keylol.com/data/attachment/common/c8/common_2_usergroup_icon.png);
		}

		/* 群组维护 */
		.usergroup[id$="_25"]::after {
			content: url(https://keylol.com/data/attachment/common/8e/common_25_usergroup_icon.jpg);
		}

		/* 研发支持 */
		.usergroup[id$="_50"]::after {
			content: url(https://keylol.com/data/attachment/common/c0/common_50_usergroup_icon.png);
		}

		/* 管理员 */
		.usergroup[id$="_1"]::after {
			content: url(https://keylol.com/data/attachment/common/c4/common_1_usergroup_icon.jpg);
		}

		/* 无档案用户 */
		.usergroup[id$="_7"]::after {
			content: url(https://keylol.com/data/attachment/common/8f/common_7_usergroup_icon.png);
		}

		/* 待验证用户 */
		.usergroup[id$="_8"]::after {
			content: url(https://keylol.com/data/attachment/common/c9/common_8_usergroup_icon.png);
		}

		/* 权限封禁 */
		.usergroup[id$="_4"]::after {
			content: url(https://keylol.com/data/attachment/common/a8/common_4_usergroup_icon.jpg);
		}

		/* 积分封禁 */
		.usergroup[id$="_52"]::after {
			content: url(https://keylol.com/data/attachment/common/9a/common_52_usergroup_icon.png);
		}

		/* 移除勋章展位限制 */
		.md_ctrl.limit-1, .md_ctrl.limit-2, .md_ctrl.limit-3 {
			height: auto;
		}

    `);
})();
