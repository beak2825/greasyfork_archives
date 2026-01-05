// ==UserScript==
// @name       daojia
// @namespace  http://blog.bliver.me
// @version    0.1
// @description  到家菜单页格式
// @match      http://*.daojia.com.cn/rest/*
// @copyright  2015, bliver
// @downloadURL https://update.greasyfork.org/scripts/11526/daojia.user.js
// @updateURL https://update.greasyfork.org/scripts/11526/daojia.meta.js
// ==/UserScript==

$(function() {
    $(".list_left").prepend('<div class="getinfomation"><button>获取菜单信息</button></div><div><textarea class="infoarea" rows="20" style="width:90%"></textarea></div>');
    $(".list_left .getinfomation").click(function() {
        $(".infoarea").val('');
        var infotext='';
        $(".list_left").find(".hottest_dishes").each(function(index, element) {
        	var ftypename=$.trim($(this).find(".hottest_dishes_title").text());
            infotext+="\n#"+ftypename+"\n";
            $(this).find("tr").each(function(){
            	var fname=$(this).find(".td_one a,.td_one1 a").text();
                var fprice=$(this).find(".td_two").text();
                infotext+=$.trim(fname).replace(/\s+/g,"")+" "+$.trim(fprice.substring(0, fprice.lastIndexOf("."))).replace(/\s+/g,"");
                if($.trim(infotext)!==''){infotext+="\n";}
            });
        });
        $(".infoarea").val(infotext);
    });
});