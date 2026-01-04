// ==UserScript==
// @name        app活动页&预览功能
// @namespace   Violentmonkey Scripts
// @match       http://cms.ds.gome.com.cn/gome-mobile-web/preview_page/preview.do
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @grant       none
// @version     1.0
// @author      -
// @description 2020/7/13 下午4:05:53
// @downloadURL https://update.greasyfork.org/scripts/412059/app%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/412059/app%E6%B4%BB%E5%8A%A8%E9%A1%B5%E9%A2%84%E8%A7%88%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
    $("#download-app-nav").hide()
$("#wap_address").css({
      'position': 'fixed',
    'top': 0,
    'z-index': 9999,
    'width': '100%'
})
function getDes(_tempCode, _pageTempId, _pageKey) {
    $.ajax({
        url: '//cms.ds.gome.com.cn/gome-mobile-web/display/process.do',
        // url: 'http://cms.ds.gome.com.cn/gome-mobile-web/display/process.do?tempCode=customTemplet&pageTempId=4481864&pageKey=saleJieXo2SWM',
        type: 'post',
        cors: 'Y',
        data: {
            tempCode: _tempCode,
            pageTempId: _pageTempId,
            pageKey: _pageKey,
        },
        success: function (result) {
            // console.log(result);
            var Obj = $("<code></code>").append($(result));//包装数据
            //(需要获取的对应块（如class='aa')
            var $html = $("#htmlContentArea", Obj);
            // console.log($html.html());
            //获取对应块中的内容  转义< 符合 >
            var value = $html.html().replace(/&lt;/g, '<');
            //获得内容可以用append插入对应的div中，也可以用html（value）直接添加
            var value1 = value.replace(/&gt;/g, '>')
            // console.log(value1)
            $('[templetid="' + _pageTempId + '"]').html('');
          setTimeout(function () {
$('[templetid="' + _pageTempId + '"]').append(value1);
        }, 2000)
            // $('[templetid="' + _pageTempId + '"]').html('').append(value1)
            // $('[templetid="' + _pageTempId + '"]').find(".custom").append(value1)
        }
    });
}
// getDes('customTemplet', '4474370', 'saleBeautifulLife')

function wangyongjie() {
    $("#download-app-nav").hide()
  
  
    var myKey = window.cmsV.pageInfo.shareUrl;
    var myCustom = $(".custom-ued");
    for (var i = 0; i < myCustom.length; i++) {
        var myCustomId = myCustom.eq(i).attr("templetid");
        getDes('userCustomTemplet', myCustomId, myKey)
        getDes('customTemplet', myCustomId, myKey)
    }
  
  var myData = window.cmsV.templetList;
        var skuDom = $(".goods-ued");
        for (var i = 0; i < myData.length; i++) {
            for (var j = 0; j < skuDom.length; j++) {
                if (skuDom.eq(j).attr("templetid") == myData[i].templetId) {
                    // console.log(myData[i].goodsTemplet.goodsList[j].promoWord)                
                    // console.log(myData[i].goodsTemplet)                
                    // skuDom.eq(j).find('.promotion').html(myData[i].goodsTemplet.goodsList[k].promoWord);
                    var sLe = myData[i].goodsTemplet.goodsList;
                    for (var k = 0; k < sLe.length; k++) {
                        // console.log(myData[i].goodsTemplet.goodsList[k].promoWord)
                        skuDom.eq(j).find('.promotion').eq(k).html(sLe[k].promoWord);
                    }
                }
            }
        }
  
  
}

$(".ellipsis").click(function () {
    wangyongjie()
})