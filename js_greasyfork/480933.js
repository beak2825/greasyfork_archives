// ==UserScript==
// @name         内蒙古自治区预决算公开平台
// @namespace    http://tampermonkey.net/
// @version      2024-08-28
// @description  复制文件全称到剪贴版
// @author       AN drew
// @match        *://czt.nmg.gov.cn/yjs/business/page/index*
// @match        *://czt.nmg.gov.cn/yjs/business/page/content*
// @match        *://202.99.230.232/yjs/business/page/index*
// @match        *://202.99.230.232/yjs/business/page/content*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/480933/%E5%86%85%E8%92%99%E5%8F%A4%E8%87%AA%E6%B2%BB%E5%8C%BA%E9%A2%84%E5%86%B3%E7%AE%97%E5%85%AC%E5%BC%80%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/480933/%E5%86%85%E8%92%99%E5%8F%A4%E8%87%AA%E6%B2%BB%E5%8C%BA%E9%A2%84%E5%86%B3%E7%AE%97%E5%85%AC%E5%BC%80%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.href.indexOf('content') > -1)
    {
        let t=setInterval(function(){
            if($('.article-title').text()!=undefined && $('.article-title').text()!="")
            {
                $('.file-basic').click(function(){
                    let name=$('.article-title').text();
                    let title=$(this).find('.download-btn').attr('title');
                    GM_setClipboard(name+title)
                })
                clearInterval(t);
            }
        },100);
    }
    else if(window.location.href.indexOf('index') > -1)
    {
        if(window.location.href.indexOf('cityCode') > -1) //盟市
        {
            GM_addStyle(`
				.container{
					width:1600px!important;
				}
				.department-list li{
					width: 639px!important;
				}
				.department-list li:nth-of-type(2n){
					margin-left:100px!important;
				}
				.department-list li .department-name{
					width:435px!important;
				}
				#backtotop{
					right:62.5px!important;
				}
			`)
        }
        else //自治区
        {
            GM_addStyle(`
				.container{
				  width:1600px!important;
				}
				.department-list li{
				  width: 739px!important;
				}
				.department-list li .department-name{
				  width:535px!important;
				}
				#backtotop{
				  right:62.5px!important;
				}
			`)
        }
        setInterval(function(){
            $('.department-name').each(function(){
                if(!$(this).hasClass('done'))
                {
                    if($(this).text().indexOf('...') > -1)
                    {
                        $(this).text($(this).attr('title'));
                        $(this).attr('alt', $(this).attr('title'));
                        $(this).addClass('done');
                    }
                }
            })
        }, 1000)

    }
})();