// ==UserScript==
// @name         Github仓库查看第一次commit
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  注意：按钮需要等待几秒才能加载出来
// @author       AN drew
// @match        https://github.com/*/*/commits*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402250/Github%E4%BB%93%E5%BA%93%E6%9F%A5%E7%9C%8B%E7%AC%AC%E4%B8%80%E6%AC%A1commit.user.js
// @updateURL https://update.greasyfork.org/scripts/402250/Github%E4%BB%93%E5%BA%93%E6%9F%A5%E7%9C%8B%E7%AC%AC%E4%B8%80%E6%AC%A1commit.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var href=window.location.href;
    var home=href.substring(0,href.lastIndexOf("/commits"))

    $.ajax({
        url:home,
        method:'get',
        success:function (res) {
            var nums,num;

            nums = $(res).find(".octicon-history").parent().find("strong");
            num = parseInt(nums.text().replace(",",""));

            var offset;
            if(num%35==0)
            {
                offset=num-35-1;
            }
            else
            {
                offset=num-num%35-1;
            }

            var newer,older;
            if($(".container-lg").length>0)
            {
                newer = $("#js-repo-pjax-container > div.container-lg.clearfix.new-discussion-timeline.p-responsive > div > div.paginate-container > div > a:nth-child(1)");
                older = $("#js-repo-pjax-container > div.container-lg.clearfix.new-discussion-timeline.p-responsive > div > div.paginate-container > div > a:nth-child(2)");
            }
            else
            {
                newer = $("#js-repo-pjax-container > div.container-xl.clearfix.new-discussion-timeline.px-3.px-md-4.px-lg-5 > div > div.paginate-container > div > a:nth-child(1)");
                older = $("#js-repo-pjax-container > div.container-xl.clearfix.new-discussion-timeline.px-3.px-md-4.px-lg-5 > div > div.paginate-container > div > a:nth-child(2)");
            }

            var a;
            if($("button:contains('Older')").length>0) //尾页
                a=newer;
            else
                a=older;
            ;
            var newest = a.clone(true);
            var newest_end = a.attr('href').indexOf("?");
            var newest_href = a.attr('href').substring(0,newest_end);
            newest.attr('href',newest_href);
            newest.text("Newest");
            if($("button:contains('Newer')").length>0) //首页
            {
                newest=$('<button class="btn btn-outline BtnGroup-item" disabled="disabled">Newest</button>')
            }
            a.parent().prepend(newest);

            var oldest = a.clone(true);
            var oldest_end = a.attr('href').indexOf("+");
            var oldest_href = a.attr('href').substring(0,oldest_end)+"+"+offset;
            oldest.attr('href',oldest_href);
            oldest.text("Oldest");
            if($("button:contains('Older')").length>0 ) //尾页
            {
                oldest=$('<button class="btn btn-outline BtnGroup-item" disabled="disabled">Oldeest</button>')
            }
            a.parent().append(oldest);
        }
    })

})();
