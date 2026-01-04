// ==UserScript==
// @name         试客巴批量申请
// @namespace    http://ziyuand.cn/
// @version      0.6
// @description  试客巴批量自动申请
// @author       SHERWIN
// @match        https://wx.shike8888.com/activity/goExpertSort*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416745/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%89%B9%E9%87%8F%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/416745/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%89%B9%E9%87%8F%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
   // $('title').after('<script src=" https://static-h5r-alicnd.shike8888.com/js/clipboard.min.js"></script>')
    getlist(0);
    $('.header_nav').append('<p style="width:80px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="shenqin" >批量申请</p>');
    $('#shenqin').on("tap",function(event){
        getid();
    });
    console.log('点击批量申请开始设置ID');
    var goodsid='';
    function getid(){

        goodsid=prompt("请输入商品ID(例：123,456,789)逗号为英文：");

        if(goodsid.text==""){
            getid();
            console.log('请输入商品id');

        }else{
            var numList = goodsid.split(',');
            console.log(numList);
            console.log(numList.length);
            for(var i=0;i<=numList.length;i++){
                shenqin(numList[i]);

            }
        }
    };



    function shenqin(act_id){
        //console.log(act_id);
        var data = {act_id:act_id,type:"2"};
        $.toAjax({
            url:"/apply/insertNewApply",
            data:data,
            type:"post",
            success:function (data) {
                if (data.code == 1) {
                    //window.location.href="/apply/applySuccess?applyId="+data.applyId;
                    console.log('商品ID:'+act_id+' 申请成功！');
                }else{
                    console.log('商品ID:'+act_id+' '+data.msg);
                }
            }
        });

    }
    var isfreegoods='';
    function getlist(category){

        $.toAjax({
            url:"/activity/expertSort",
            data:{category: category,shop_type: 0,yf_type: 0,sy_type: 0,sp_type: 0,order: 0,classes:0,type: 0,page:'1',size:300},
            type:'post',
            success:function (res) {
                if (res.code == 1){
                    var len=res.data.length;
                    for(var j in res.data){
                        var product_name=res.data[j]['product_name'];
                        var act_id=res.data[j]['act_id'];
                        var margin=res.data[j]['margin'];
                        var freetype=res.data[j]['privilege_mark'];
                        if(freetype=='2'||freetype=='3'){
                            isfreegoods='  【免手续费】';

                        }else{

                            isfreegoods='';

                        };
                        //console.log(res);
                        console.log(j+"产品名称："+product_name+"  活动id："+act_id+"；价格："+margin+isfreegoods);
                    }
                }
            },
            error:function (err) {
            }
        });}

    $('.category').on("tap",function(event){

        var categorys = $(this).attr('data-category');
        console.clear();
        console.log('以下为分类全部列表');
        getlist(categorys);
    });






})();