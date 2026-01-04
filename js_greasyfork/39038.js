// ==UserScript==
// @name         Enhance绅士漫画
// @namespace    Enhance-绅士漫画-heroboy
// @description  加强一下 绅士漫画 网站的体验
// @author       heroboy
// @version      0.3
// @match        https://www.wnacg.net/*
// @match        https://www.wnacg.com/*
// @match        https://www.wnacg.org/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/39038/Enhance%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/39038/Enhance%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var style = `
    .title{
        white-space:normal!important;
    }
`;
	var $ = unsafeWindow.$;
	var styleNode = document.createElement('style');
	styleNode.appendChild(document.createTextNode(style));
	document.head.appendChild(styleNode);

	//add button
	var buttonNode = $("<button id='to_slide_button' style='width:300px;height:50px;font-size:20px;'>To Slide</button>");
	$('.asTBcell.uwconn').prepend($("<br/>")).prepend(buttonNode);
	if (buttonNode[0])
	{
		buttonNode[0].addEventListener('click',function(){
            if (/\/photos-index-aid-.*\.html/i.exec(location.pathname))
			{
				location.pathname = location.pathname.replace('index','slide');
			}
		});
	}
        //
        $('.gallary_item a').attr('target','_blank')
})();