// ==UserScript==
// @name       shbj
// @namespace  http://blog.bliver.me
// @version    0.2
// @description  获取生活半径菜单页的格式
// @match      http://www.shbj.com/b/2/t/*
// @copyright  2015, bliver
// @downloadURL https://update.greasyfork.org/scripts/11523/shbj.user.js
// @updateURL https://update.greasyfork.org/scripts/11523/shbj.meta.js
// ==/UserScript==

function reverse() {
    var str = "";
    var end = this.length - 1;
    for(;end >= 0; end --) {
        str = str + this.charAt(end);
    }
 
    return str;
 
}

String.prototype.reverse = reverse;

$(function() {
    $(".shangJiaLeftMain").prepend('<div class="getinfomation"><button>获取菜单信息</button></div><div><textarea class="infoarea" rows="20" style="width:90%"></textarea></div>');
    $(".shangJiaLeftMain .getinfomation").click(function() {
        $(".infoarea").val('');
        var infotext='';
        $(".shangJiaCaiPinMain").find(".takeawayCategory").each(function(index, element) {
        	var ftypename=$.trim($(this).text());
            infotext+="\n#"+ftypename+"\n";
            $("#categoryDetails").find(".caiPinMain").eq( index + 1 ).find(".caiPinDiv").each(function(){
            	var fname=$(this).find('dd span').text();
                var fprice="";
                $(this).find('.jiaQianMain ul li img').each(function(){
                    var priceSrc = $(this).attr("src");
                    fprice += priceSrc.substr(priceSrc.lastIndexOf("/") + 1, 1);
                });
                infotext+=$.trim(fname).replace(/\s+/g,"")+" "+$.trim(fprice.reverse()).replace(/\s+/g,"");
                if($.trim(infotext)!==''){infotext+="\n";}
            });
        });
        $(".infoarea").val(infotext);
    });
});


