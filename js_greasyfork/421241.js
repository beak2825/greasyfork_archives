// ==UserScript==
// @name         匿名山修改版
// @namespace    https://gitee.com/huelse/nms
// @version      0.2 修改版
// @description  匿名山修改（修改自THENDING）
// @author       小荣 (原作者THENDING)
// @include      *://nms.*/*.html
// @include      *://nms.*
// @match        *://nms.*/*.html
// @license      GPL License
// @password     zjh.wtf
// @downloadURL https://update.greasyfork.org/scripts/421241/%E5%8C%BF%E5%90%8D%E5%B1%B1%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/421241/%E5%8C%BF%E5%90%8D%E5%B1%B1%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function () {
		var code = $('#post_content').find('p').text().split('：')[2];
        $('#password_key').val(code);
        $('#password_key').next().click();
        document.body.innerHTML = document.body.innerHTML.replace(/http:/g, 'https:');
	});
})();