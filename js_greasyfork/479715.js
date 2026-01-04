// ==UserScript==
// @name         HNIE xggl pickdate hack
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  HNIE xggl pickdate hack测试
// @author       You
// @include        http://xggl.hnie.edu.cn/wap/menu/student/leave/apply_stu/_child_/edit*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hnie.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479715/HNIE%20xggl%20pickdate%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/479715/HNIE%20xggl%20pickdate%20hack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    SFWapPicker.datetime("kssj", dateTimeChange, {
				beginDate:DateUtil.getDate(-90, null),
				endDate: DateUtil.getDate(90, null)
			});
    SFWapPicker.datetime("jssj", dateTimeChange, {
				beginDate:DateUtil.getDate(-90, null),
				endDate: DateUtil.getDate(365, null)
			});
    // Your code here...
})();