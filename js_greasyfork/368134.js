// ==UserScript==
// @name			知乎优化
// @namespace		http://www.zhihu.com
// @version			0.21
// @description		- 把知乎回答/知乎专栏的编辑/发布时间放到前面，方便查看。
// @homepage		http://www.greasyfork.org/users/89556
// @iconURL			https://static.zhihu.com/heifetz/favicon.ico
// @author          Richard_He
// @license         MIT
// @match           https://www.zhihu.com/question/*
// @match           https://zhuanlan.zhihu.com/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/368134/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/368134/%E7%9F%A5%E4%B9%8E%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
		var d = document;
	    var url1 = window.location.origin;
	    var editTime;
	    if(url1=="https://zhuanlan.zhihu.com")
		{
		    editTime = d.querySelector('.ContentItem-time').innerText;
			d.querySelector('.Voters>button').innerHTML += ("  ")+editTime;
		}
		else
		{
			var content,answerCount,tmpCount,pcont;
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
		}
})();