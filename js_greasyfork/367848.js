// ==UserScript==
// @name			知乎 答主编辑时间提前
// @namespace		http://www.zhihu.com
// @version			0.1
// @description		把回答的编辑或发布时间放到前面，方便查看。
// @homepage		http://www.greasyfork.org/users/89556
// @iconURL			https://www.zhihu.com/favicon.ico
// @author       You
// @match        https://www.zhihu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367848/%E7%9F%A5%E4%B9%8E%20%E7%AD%94%E4%B8%BB%E7%BC%96%E8%BE%91%E6%97%B6%E9%97%B4%E6%8F%90%E5%89%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/367848/%E7%9F%A5%E4%B9%8E%20%E7%AD%94%E4%B8%BB%E7%BC%96%E8%BE%91%E6%97%B6%E9%97%B4%E6%8F%90%E5%89%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
		var d = document;
		var editTime,content,answerCount,tmpCount,pcont;
		answerCount = d.getElementsByClassName('List-item').length;
		tmpCount = 0;
		//避免第一页过长时间等待
		for(var i=0;i<d.getElementsByClassName('ContentItem-time').length;i++)
		{
			editTime = d.getElementsByClassName('ContentItem-time')[i];
			content = d.getElementsByClassName('RichContent-inner')[i];
			pcont = d.getElementsByClassName('RichContent')[i];
			pcont.insertBefore(editTime,content);
		}
		var detectNew = setInterval(function()
		{
			if(d.getElementsByClassName('List-item').length!=tmpCount)
			{
				for(var i=0;i<d.getElementsByClassName('ContentItem-time').length;i++)
				{
					editTime = d.getElementsByClassName('ContentItem-time')[i];
					content = d.getElementsByClassName('RichContent-inner')[i];
					pcont = d.getElementsByClassName('RichContent')[i];
					pcont.insertBefore(editTime,content);
				}
				tmpCount = d.getElementsByClassName('List-item').length;
			}
		},5000);
})();