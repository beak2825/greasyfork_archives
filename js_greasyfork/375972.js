// ==/UserScript==
    (function() {
    var location = window.location.host;
	var num = -1;
    if(location.indexOf("item.taobao.com")>=0){
		num = 0;
	}else if(location.indexOf("detail.tmall") != -1){
		num = 1;
	}else if(location.indexOf("s.taobao.com") != -1){
		num = 2;
	}else if(location.indexOf("list.tmall.com") != -1){
		num = 3;
	}else if(location.indexOf("ai.taobao.com") != -1){
        num = 4;
    }else if(location.indexOf("list.tmall.hk") != -1){
        num = 5;
    }else if(location.indexOf("chaoshi.tmall.com") != -1){
        num = -1;
    }
        //alert(num)
        if(num != -1){
setInterval(function(){
		getTaoBao(num);
},500);
        }
    })();

     function getTaoBao(num){
        var name;
        var html;
		switch(num){
						  case 0:
                          if($('.tb-main-title').hasClass("jia")){
                          }else{
                          $('.tb-main-title').addClass("jia");
                              name = $('.tb-main-title').text();
                              html = '<div class="tb-btn-buy" style="padding-top:10px;"><a href="http://www.meilize.cn/0jd/index.php?r=searchlist&kwd='+ encodeURI($.trim(name))  + '&type=1" target="_blank">领取超级优惠券</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="http://www.meilize.cn/m1.html" target="_blank">更多大额优惠券</a></div><div class="tb-btn-buy" style="padding-top:10px;"><a href="#" id="111">领取支付宝红包</a></div><div class="tb-btn-add" style="padding-top:10px;"><a href="#" id="112">自用省钱分享赚钱</a></div>';
                              $('.tb-action').append(html);
                              $("#112").click(function(){window.open('http://www.meilize.cn/img/app01.jpg', 'choujiang', 'height=650, width=700, top=200, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')});
                              $("#111").click(function(){window.open('http://www.meilize.cn/img/hb.jpg', 'zhifubao', 'height=650, width=700, top=200, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')});
                              }
						  break;
						  case 1:
                          if($('meta[name=keywords]').hasClass("jia")){
                          }else{
                          $('meta[name=keywords]').addClass("jia");
                             name = $('meta[name=keywords]').attr('content');
                             html = '<div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="http://www.meilize.cn/0jd/index.php?r=searchlist&kwd='+ encodeURI($.trim(name))  + '&type=1" target="_blank">领取超级优惠券</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="http://www.meilize.cn/m1.html" target="_blank">更多大额优惠券</a></div><div class="tb-btn-buy tb-btn-sku" style="padding-top:10px;"><a href="#" id="111">领取支付宝红包</a></div><div class="tb-btn-basket tb-btn-sku" style="padding-top:10px;"><a href="#" id="112">自用省钱分享赚钱</a></div>';
                             $('.tb-action').append(html);
                             $("#112").click(function(){window.open('http://www.meilize.cn/img/app01.jpg', 'choujiang', 'height=650, width=700, top=200, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')});
                              $("#111").click(function(){window.open('http://www.meilize.cn/img/hb.jpg', 'zhifubao', 'height=650, width=700, top=200, left=500, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')});
                               }
						  break;
						  case 2:
		for(var i=0;i<$(".price").length;i++){
            if($(".price").eq(i).hasClass("jia")){
                          }else{
                              $(".price").eq(i).addClass("jia");
			if($(".J_U2IStat .img").eq(i).attr("alt")){
				$(".price").eq(i).append("<a href='http://www.meilize.cn/0jd/index.php?r=searchlist&kwd="+encodeURI($(".J_U2IStat .img").eq(i).attr("alt"))+"&type=1' target='_blank'><strong style='border-left:2px solid;padding-left:4px;font-size:16px;'>领取超级优惠券</strong></a>")
			}else{
				$(".price").eq(i).append("<a href='http://www.meilize.cn/0jd/index.php?r=searchlist&kwd="+encodeURI($(".J_ItemPic").eq(i).attr("alt"))+"&type=1' target='_blank'><strong style='border-left:2px solid;padding-left:4px;font-size:16px;'>领取超级优惠券</strong></a>")
            }
			}
		}
						  break;
						  case 3:
                          if($(".productPrice")){
			for(var q=0;q<$(".productPrice").length;q++){
                if($(".productPrice").eq(q).hasClass("jia")){

		                       }else{
			                       $(".productPrice").eq(q).addClass("jia");
				$(".productPrice").eq(q).append("<a href='http://www.meilize.cn/0jd/index.php?r=searchlist&kwd="+encodeURI($(".productTitle a").eq(q).text())+"&type=1'  target='_blank'><em style='border-left:2px solid;height:17px;line-height:20px;padding:4px;margin-left:4px;font-size:18px;'>领取超级优惠券</em></a>")
			}
            }
		}
		for(var j=0;j<$(".ui-price").length;j++){
            if($(".ui-price").eq(j).hasClass("jia")){
		                       }else{
			                       $(".ui-price").eq(j).addClass("jia");
				$(".ui-price").eq(j).append("<a href='http://www.meilize.cn/0jd/index.php?r=searchlist&kwd="+encodeURI($(".product-title a").eq(j).text())+"&type=1'  target='_blank'><span style='border-left:2px solid;height:10px;line-height:13px;padding:4px;margin-left:4px;font-size:13px;'>领取超级优惠券</span</a>")
                               }
        }
						  break;
                          case 4:
                          $(".title").each(function(){
		                       if($(this).hasClass("jia")){

		                       }else{
			                       $(this).addClass("jia");
                                   name = $(this).children("a:first").text();
                                   $(this).after("<a href='http://www.meilize.cn/0jd/index.php?r=searchlist&kwd="+encodeURI($.trim(name))+"&type=1'  target='_blank'><em style='border-left:2px solid;height:17px;line-height:20px;padding:4px;margin-left:4px;font-size:14px;color:#7d41df;'>领取超级优惠券</em></a>");

                               }
	                            });
                          break;
						  case 5:
		if($(".productPrice")){
			for(var e=0;e<$(".productPrice").length;e++){
                if($(".productPrice").eq(e).hasClass("jia")){
                          }else{
                              $(".productPrice").eq(e).addClass("jia");
				$(".productPrice").eq(e).append("<a href='http://www.meilize.cn/0jd/index.php?r=searchlist&kwd="+encodeURI($(".productTitle a").eq(e).text())+"&type=1'  target='_blank'><em style='border-left:2px solid;height:17px;line-height:20px;padding:4px;margin-left:4px;font-size:14px;color:#7d41df;'>领取超级优惠券</em></a>")
			}
            }
		}
		for(var w=0;w<$(".ui-price").length;w++){
            if($(".ui-price").eq(w).hasClass("jia")){
                          }else{
                              $(".ui-price").eq(w).addClass("jia");
				$(".ui-price").eq(w).append("<a href='http://www.meilize.cn/0jd/index.php?r=searchlist&kwd="+encodeURI($(".product-title a").eq(w).text())+"&type=1'  target='_blank'><span style='border-left:2px solid;height:10px;line-height:13px;padding:4px;margin-left:4px;font-size:13px;color:#7d41df;'>领取超级优惠券</span></a>")
		}
        }
						  break;
            case 6:
                //if($(".wrap").length == 0) break;
                //alert($(".wrap"));
                break;
					  }
    }