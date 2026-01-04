// ==UserScript==
// @name 头条万阅读
// @description 在阅读今日头条文章的时候，看到一些不错的作者，想要看看该作者1万阅读以上的文章。这个小工具可以帮到你，安装完工具，在作者详情页出现1万字样的图片，点击就可筛选一万阅读以上的文章了。
// @namespace http://www.bianbingdang.com/article_detail/146.html
// @match *://www.toutiao.com/c/user/*/*
// @grant none
// @icon data:image/png;base64,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
// @require https://cdn.bootcss.com/jquery/3.4.0/jquery.min.js

// @version 0.0.1.20190418140551
// @downloadURL https://update.greasyfork.org/scripts/381991/%E5%A4%B4%E6%9D%A1%E4%B8%87%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/381991/%E5%A4%B4%E6%9D%A1%E4%B8%87%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

var importCss=document.createElement('link')
importCss.setAttribute("rel","stylesheet")
importCss.setAttribute("href", 'https://cdn.90so.net/layui/2.4.5/css/layui.css')
document.getElementsByTagName("head")[0].appendChild(importCss)



function selectedReadCounts() {
        count = 0;
        var checkTime = setInterval(() => {
            items = jQuery('.item-inner .y-box .y-left').children("a:first-child")
            fitems = jQuery('ul .item')
            items.each(function (index) {
                if (jQuery(this).text().indexOf('万') == -1) {
                    fitems[index].remove()
                    // console.log(jQuery(this).text())
                }
            });
        count ++ 
        console.log(count)
        if(count>=5){
            clearInterval(checkTime)
        }
        }, 500);
    }
  
jQuery(".right").prepend(`<div style="right:151.5px;bottom:100px;position: fixed;">
<button class="layui-btn layui-btn-normal" style="padding: 0 10px" id="selectedReadCountsId" title="筛选1万以上阅读,微信:bianbingdang">1万</button>
</div>`)

jQuery('#selectedReadCountsId').bind('click', function () {
    selectedReadCounts()
})