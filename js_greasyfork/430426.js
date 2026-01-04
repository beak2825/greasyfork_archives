// ==UserScript==
// @name         枝江反诈骗
// @namespace    https://space.bilibili.com/2649561
// @version      1.3
// @description  Show titles according to BVs.
// @author       Sela
// @include      https://*.bilibili.com/*
// @exclude      https://manga.bilibili.com/eden/bilibili-nav-panel.html
// @exclude      https://live.bilibili.com/blackboard/dropdown-menu.html
// @exclude      https://www.bilibili.com/page-proxy/game-nav.html
// @exclude      https://t.bilibili.com/pages/nav/index_new*
// @exclude      https://message.bilibili.com/*
// @icon         https://tse1-mm.cn.bing.net/th/id/OIP-C.D0J8yk3gtsBUFSYLpv90YwHaHa?pid=ImgDet&rs=1
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/430426/%E6%9E%9D%E6%B1%9F%E5%8F%8D%E8%AF%88%E9%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/430426/%E6%9E%9D%E6%B1%9F%E5%8F%8D%E8%AF%88%E9%AA%97.meta.js
// ==/UserScript==

(function() {
    var mybutton,beasetag;
    mybutton = document.createElement("div");
    beasetag = document.querySelector("body");
    beasetag.appendChild(mybutton);
    mybutton.innerHTML = "反诈骗";
    mybutton.style = "position:fixed;bottom:15px;right:15px;width:60px;height:60px;background:black;opacity:0.5;color:white;text-align:center;line-height:60px;cursor:pointer;";
    var reg = /b23.tv\/[0-9a-zA-Z]{6}/;
    $(mybutton).click(function(){
        //运行
        $('a').each(function(){
            var temp = $(this).text();
            if(reg.test(temp)){
                var href = reg.exec($(this).text());
                var title = setTitle(href);
                if(title.length > 1){
                    $(this).text(title);
                }
            }
        });
    })

    function setTitle(href){
        //获取标题
        var bv = getBv(href);
        var u = 'https://api.bilibili.com/x/web-interface/view?bvid=' + bv;
        var title = '';
        $.ajax({url:u,
                async:false,
                success:function(result){
                    var text = JSON.stringify(result)
                    title = getTitle(text);
                }});
        return title;
    }
    function getTitle(t){
        var reg = /"title":"(.+)","pubdate"/;
        if (reg.test(t)){
            var title = reg.exec(t);
            return title[1];
        }
    }
    function getBv(href){
        //获取bv号
        //接口来自https://res.abeim.cn/api/dwz_longurl/doc.php
        var tool = 'https://res.abeim.cn/api-dwz_longurl?url=http://';
        var reg = /video\/(.+)\?/;
        var bv = '';
        $.ajax({url:tool+href,
                async:false,
                success:function(result){
                    var text = JSON.stringify(result);
                    var temp = reg.exec(text)[1];
                    bv = temp;
                }})
        return bv;
    }
})();