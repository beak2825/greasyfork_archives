// ==UserScript==
// @name         试客巴一键再次申请
// @namespace    http://ziyuand.cn
// @version      0.2
// @description  一键再次申请
// @author       You
// @match        https://wx.shike8888.com/tryUse/myTask
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416912/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%B8%80%E9%94%AE%E5%86%8D%E6%AC%A1%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/416912/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%B8%80%E9%94%AE%E5%86%8D%E6%AC%A1%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';


   var isfreegoods='';
$('.classify-box').append('<p style="width:120px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="yijianshenqin" >一键再次申请</p>');
$('.header-title').on("tap",function(event){
         shenqin();
     });
function shenqin(){
console.clear();
console.log('已执行重新申请程序，如报错则没有待重新申请订单');
$.toAjax({
                url:"/tryUserManage/myTry/applyList",
                data:{pageNo:1,pageSize: 200,listType:3},
                success:function (res) {
                    if (res.code == 1){
                        var goodslists=res.data.list;
                        var len=res.data.list.length;
                            //console.log(len);
                          for(var i=0;i<=len;i++){
                            var freetype=goodslists[i]['privilege_mark'];
                            if(freetype=='2'||freetype=='3'){
                                isfreegoods='  【免手续费】';
                             }else{
                               isfreegoods='';};
                          console.log('商品ID：'+goodslists[i]['act_id']+'  名称：'+goodslists[i]['product_name']+'  价格：'+goodslists[i]['margin']+isfreegoods);
                              applys(goodslists[i]['apply_id'],goodslists[i]['act_id']);
};

};

                },
                error:function (err) {
                }
            });
};



function applys(apply_id,goodsid){
    var data = { apply_id:apply_id,c_product_img:'', c_shop_img:'' }
    mui.ajax('/task/doTask',{
					 data:data,
					 dataType:'json',
					 type:'post',
					 success:function(ret){
						 if (ret.code == 1) {
							console.log('商品'+goodsid+'提交申请成功!');
                             //$('.return-money-box').append('<p>商品'+goodsid+'提交申请成功!</p>');
                             mui.toast('商品'+goodsid+'提交申请成功!',{ duration:'short', type:'div' })
                            //  mui.alert(goodsid+'提交申请成功!');
						 }else{
							 console.log('商品'+goodsid+'提交申请失败!');
                              mui.toast('商品'+goodsid+'提交申请失败!',{ duration:'short', type:'div' })
                             // $('.return-money-box').append('<p>商品'+goodsid+'提交申请失败!</p>');
                             // mui.alert(goodsid+'提交申请成功!');
						 }
					 }
				 });

}

})();