// ==UserScript==
// @name        Tieba No Draft
// @description 去除贴吧自动保存草稿功能
// @author      feng_zilong@163.com
// @include     http://tieba.baidu.com/*
// @version     1
// @grant       none
// @namespace https://greasyfork.org/users/1438
// @downloadURL https://update.greasyfork.org/scripts/4969/Tieba%20No%20Draft.user.js
// @updateURL https://update.greasyfork.org/scripts/4969/Tieba%20No%20Draft.meta.js
// ==/UserScript==
var originFireEvent = UE.EventBase.prototype.fireEvent;
UE.EventBase.prototype.fireEvent = function(){
	if(arguments[0] === 'contentchange'){
		return;
	}

	originFireEvent.apply(this, arguments);
}
