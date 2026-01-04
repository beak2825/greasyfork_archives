// ==UserScript==
// @name         试客巴福利专区破兑换限制
// @namespace    http://ziyuand.cn
// @version      0.7
// @description  福利专区破限制兑换
// @author       SHERWIN
// @match        https://wx.shike8888.com/welfare/welfareExchange
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421041/%E8%AF%95%E5%AE%A2%E5%B7%B4%E7%A6%8F%E5%88%A9%E4%B8%93%E5%8C%BA%E7%A0%B4%E5%85%91%E6%8D%A2%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/421041/%E8%AF%95%E5%AE%A2%E5%B7%B4%E7%A6%8F%E5%88%A9%E4%B8%93%E5%8C%BA%E7%A0%B4%E5%85%91%E6%8D%A2%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('body').after('<script src="https://static-h5r-alicnd.shike8888.com/js/jquery-1.10.2.min.js"></script><script src="https://static-h5r-alicnd.shike8888.com/js/mui.min.js"></script>')




    $('.btn-box').after('<p style="width:200px;height:30px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:30px;"id="duihuan" >强制兑换(无视申请天数)</p>');

    //破解兑换天数限制
    $('#duihuan').on("tap",function(event){
        pojie();
        //console.log('123');
    });

    function pojie(){
        var goodsid=prompt("输入产品ID");
        if(goodsid!=null){
         $.ajax({
            url:"https://wx.shike8888.com/welfare/exchangeWelfareGoods",
            data:{id: goodsid},
            type:"post",
            success:function (data) {

                if (data.code == 1) {
                    //console.log(data.msg);
                    console.log(data);
                    alert("兑换成功"+data);
                }else{
                    console.log(data);
                    alert("兑换失败"+data);

                }
            }
        });
        }else{

        return;
        }



    }
    $('.exchange-ul li a:eq(0)').on("tap",function(event){
        $('b').remove();
        $('.goods-title').after('<b id="goods"></b><b id="kucun"></b>');
        checkgoods(9);

    });
    $('.exchange-ul li a:eq(1)').on("tap",function(event){
        $('b').remove();
        $('.goods-title').after('<b id="goods"></b><b id="kucun"></b>');
        checkgoods(19);
    });
    $('.exchange-ul li a:eq(2)').on("tap",function(event){
        $('b').remove();
        $('.goods-title').after('<b id="goods"></b><b id="kucun"></b>');
        checkgoods(28);
    });

    function checkgoods(day){

        $.ajax("/welfare/getExchangeLists", {
            data: { days:day},
            dataType: "json",
            type: "post",
            async: false,
            success: function(data) {
                if (data.code == 1) {
                    console.log(data);
                    var datas=data.data;
                    for(var i in datas){
                        var yuansu='.goods-item-box:eq('+i+') #goods';
                        //$(yuansu).append('<p>'+datas[i]+'</p>');
                        $('<b id="goods"> 商品ID：'+datas[i]['id']+'</b>').replaceAll(yuansu);
                        var kucun=datas[i]['left_num'];
                        if(kucun==0){
                            kucun="已抢完";
                        }
                        var kucunyuansu='.goods-item-box:eq('+i+') #kucun';
                        $('<b style="color: #f10180;" id="kucun"> 库存：'+kucun+'</b>').replaceAll(kucunyuansu);

                    }
                    $('b').on("tap",function(event){
                        pojie();
                        //console.log('123');
                    });

                } else {
                    console.log("查询失败");
                }
            }

        });
    };

    //获取当前点击元素序号
    function getindex(){

        $(".goods-item-box").on("tap",function(){
            var index=$(".goods-item-box").index(this);
            console.log("当前下标为："+index);   //注意：这里的下标从零开始
            return index;
        });
    }


    // Your code here...
})();