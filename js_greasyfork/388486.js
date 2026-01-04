// ==UserScript==
// @name         批量阿里妈妈搜索是否加入内容商品库
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       easn_xi
// @match        https://pub.alimama.com/promo/search/index.htm?fn=search&q=*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388486/%E6%89%B9%E9%87%8F%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88%E6%90%9C%E7%B4%A2%E6%98%AF%E5%90%A6%E5%8A%A0%E5%85%A5%E5%86%85%E5%AE%B9%E5%95%86%E5%93%81%E5%BA%93.user.js
// @updateURL https://update.greasyfork.org/scripts/388486/%E6%89%B9%E9%87%8F%E9%98%BF%E9%87%8C%E5%A6%88%E5%A6%88%E6%90%9C%E7%B4%A2%E6%98%AF%E5%90%A6%E5%8A%A0%E5%85%A5%E5%86%85%E5%AE%B9%E5%95%86%E5%93%81%E5%BA%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log($("#J_item_list div div span:nth-child(2) div div .box-content a").css("color","#66CD00"));
   var mytoken = $.cookie('_tb_token_');
   var num = 0;
setTimeout(
    function(){
        num = $('[mxv="products"]').length +1 ;
        for(var noid=1;noid<num;noid++){

            var sp = $("#J_item_list div div span:nth-child(" + noid + ") div div div div span a").attr("mx-click");
            var itemid=sp.substring(sp.indexOf("\'")+1,sp.indexOf("\',"));
            var thisurl = "https://pub.alimama.com/other/contentitem/detail.json?t="+(new Date()).valueOf()+"&_tb_token_="+ $.cookie('_tb_token_') +"&itemId="+itemid;

            $.ajax({
                url:thisurl,
                async:false,
                success:function(result){
                    console.log(result.data.reason);
                    if(result.data.status == 1){
                        console.log(noid);
                        $("#J_item_list div div span:nth-child("+ noid +") div div .box-content a").css("color","transparent");
                        $("#J_item_list div div span:nth-child("+ noid +") div div .box-content a").css("font-weight","900");
                        $("#J_item_list div div span:nth-child("+ noid +") div div .box-content a").css("background","linear-gradient(-90deg,#228B22 0%, #f9d423 100%)");
                        $("#J_item_list div div span:nth-child("+ noid +") div div .box-content a").css("-webkit-background-clip","text");
                    }
                }
            });
        }
        showTips( "解析完成!渐变色为[内容库商品]", 200, 3 );
    },3000);

//contetn为要显示的内容
//height为离窗口顶部的距离
//time为多少秒后关闭的时间，单位为秒
function showTips( content, height, time ){
    //窗口的宽度
  var windowWidth  = $(window).width();
  var tipsDiv = '<div class="tipsClass">' + content + '</div>';
  $( 'body' ).append( tipsDiv );
  $( 'div.tipsClass' ).css({
      'top'       :  ( $(window).height() / 2 ) - 100/2 + ($(window).scrollTop()*2) + 'px',
      'left'      : ( windowWidth / 2 ) - 350/2 + 'px',
      'position'  : 'absolute',
      'padding'   : '3px 5px',
      'background': '#e65c00',
      'font-size' : 18 + 'px',
      'margin'    : '0 auto',
      'text-align': 'center',
      'width'     : '350px',
      'height'    : '100px',
      'line-height': '100px',
      'color'     : '#fff',
      'opacity'   : '0.9',
      'white-space':'normal',
      'word-wrap': 'break-word',
      'word-break': 'break-all',
      'overflow': 'hidden'
  }).show();
  setTimeout( function(){$( 'div.tipsClass' ).fadeOut();}, ( time * 1000 ) );
}

//setTimeout('for(var noid=1;noid<61;noid++){var sp = $("#J_item_list div div span:nth-child(" + noid + ") div div div div span a").attr("mx-click");var itemid=sp.substring(sp.indexOf("\'")+1,sp.indexOf("\',"));$.get("https://pub.alimama.com/other/contentitem/detail.json?t="+(new Date()).valueOf()+"&_tb_token_="+ $.cookie(\'_tb_token_\') +"&itemId="+itemid, function(result){ if(result.data.reason == 1){$("#J_item_list div div span:nth-child("+ noid +") div div .box-content a").css("color","#66CD00");}});}',8000);
    // Your code here...
})();