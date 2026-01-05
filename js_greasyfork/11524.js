// ==UserScript==
// @name       diancai360
// @namespace  http://blog.bliver.me
// @version    0.1
// @description  点菜360菜单页格式
// @match      http://www.diancai360.com/shop/*
// @copyright  2015, bliver
// @downloadURL https://update.greasyfork.org/scripts/11524/diancai360.user.js
// @updateURL https://update.greasyfork.org/scripts/11524/diancai360.meta.js
// ==/UserScript==
$(function() {
    $("#res_content_fullscreen").append('<div class="getinfomation"><button>获取菜单信息</button></div><div><textarea class="infoarea" rows="20" style="width:90%"></textarea></div>');
    $("#res_content_fullscreen .getinfomation").click(function() {
        $(".infoarea").val('');
        var infotext='';
        $.each($("#main .img_main"),function(){
            //console.log($(this).text());
            var ftypename=$.trim($(this).find("h4 a").text());
            infotext+="\n#"+ftypename+"\n";
            $.each($(this).find(".item_t"),function(){
                //console.log($(this));
                var fname=$(this).find('.name').text(), fprice=$(this).find('.price').text();
                infotext+=$.trim(fname).replace(/\s+/g,"")+" "+$.trim(fprice).replace('￥','').replace(/\s+/g,"");
                if($.trim(infotext)!==''){infotext+="\n";}
            });
        });
        $(".infoarea").val(infotext);
    });
});
