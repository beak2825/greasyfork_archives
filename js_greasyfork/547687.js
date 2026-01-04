// ==UserScript==
// @name         屏蔽知乎硕大无比的标题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  辣么大的标题摆在那，在看啥谁来都能看到-0-
// @author       You
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/547687/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%A1%95%E5%A4%A7%E6%97%A0%E6%AF%94%E7%9A%84%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/547687/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%A1%95%E5%A4%A7%E6%97%A0%E6%AF%94%E7%9A%84%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

/*
0.2 20250829
- 加入专栏屏蔽标题功能。
0.1
- 完成基础功能。
*/

(function() {
	'use strict';
	var h1_tags=document.getElementsByTagName("h1");
	for(var i=0; i<h1_tags.length; i++){
		if(h1_tags[i].getAttribute("class")=='QuestionHeader-title'){
			h1_tags[i].style.display='none';
			console.log('已屏蔽知乎硕大无比的标题！');
		}
	}
    $(`.AppHeader-zhihuLogo`).next(`div`).css(`display`,`none`);
})();