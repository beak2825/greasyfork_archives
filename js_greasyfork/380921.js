(function() {
    $(document).ready(function() {
        var location = window.location.host;
        var name;
        var html
        if(location.indexOf("item.taobao.com")>=0){
            name = $('.tb-main-title').text();
            name = $.trim(name).substring(0,9); //取商品标题前10个字符
            html = '<div class="tb-btn-buy" style="padding-top:10px;"><a href="http://sheng.abangtv.top/index.php?r=l&kw='+ encodeURI(name) + '" target="_blank">领取商品优惠券</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="http://sheng.abangtv.top/" target="_blank">获取更多优惠产品</a></div>';
            $('.tb-action').append(html);
        }else if(location.indexOf("detail.tmall") >= 0){
            name = $('meta[name=keywords]').attr('content');
            name = $.trim(name).substring(0,9);
            html = '<div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="http://sheng.abangtv.top/index.php?r=l&kw='+ encodeURI(name) + '" target="_blank">领取商品优惠券</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="http://sheng.abangtv.top/" target="_blank">获取更多优惠产品</a></div>';
            $('.tb-action').append(html);
        }else if(location.indexOf("s.taobao.com")>=0){
            $.each($(".pic"),function(index){
                if(index != -1){
                    var id = $(this).find("a").attr("data-nid");
                    name = $.trim($(this).parents(".item").find(".row-2").text());
                    name = $.trim(name).substring(0,9);
                    //alert(index + ":" + name);
                    $(this).parents(".item").find(".g_price").append('<a href="http://sheng.abangtv.top/index.php?r=l&kw=' + encodeURI(name) + ' " target="_blank"><em style="font-size:15px;color:red;border-style:solid;border-width:2px;padding:3px;"><strong>领取优惠券</strong></em></a>');
                }
             });
        }else if(location.indexOf("list.tmall.com")>=0){

            $(".productTitle").each(function(){
                name = $(this).children("a").attr("title");
                name = $.trim(name).substring(0,9);
                $(this).prev().append('<a href="http://sheng.abangtv.top/index.php?r=l&kw=' + encodeURI(name) + '" target="_blank" ><em style="font-size:12px;color:red;border-style:solid;border-width:1px;padding-bottom:6px;height:20px;"><strong>领取优惠券</strong></em></a>');
            });


        }else if(location.indexOf("ai.taobao.com")>=0){
            $(".title").each(function(){
                name = $(this).children("a:first").text();
                name = name.substring(0,9);
                $(this).after('<div style="margin-left:12px;"><a href="http://sheng.abangtv.top/index.php?r=l&kw=' + encodeURI(name.replace(/(^\s*)|(\s*$)/g, "")) + '" target="_blank" ><em style="font-size:12px;color:red;border-style:solid;border-width:1px;padding-bottom:6px;height:20px;"><strong>领取优惠券</strong></em></a><div>');
	    });
        }
    });

})();