// ==UserScript==
// @name         试客巴收藏夹ID列表
// @namespace    http://ziyuand.cn
// @version      1.2
// @description  收藏夹ID列表
// @author       You
// @match        https://wx.shike8888.com/collect/collectGoods
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418640/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%94%B6%E8%97%8F%E5%A4%B9ID%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/418640/%E8%AF%95%E5%AE%A2%E5%B7%B4%E6%94%B6%E8%97%8F%E5%A4%B9ID%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //黑名单列表UEL判断
  var url;
        $.post('https://wx.shike8888.com/userInfo/findUserInfo',function(res){
            var azhan_phone=new Array('18695726268','15306971757','15959071059','15959071069','16621102036');
        var jun_pjone="17317351556";
            for(var p in azhan_phone){
                //console.log(azhan_phone[p])
            if(res.data.user['phone']==azhan_phone[p]){
                url="https://jx.ziyuand.cn/blacklist/blacklist.php?whois=azhan&jsoncallback=?";
            } else if(res.data.user['phone']==jun_pjone){
                url="https://jx.ziyuand.cn/blacklist/blacklist.php?whois=jun&jsoncallback=?";
            }
            else
            {
                url="https://jx.ziyuand.cn/blacklist/blacklist.php?whois=king&jsoncallback=?";
            }}
        },'json')



   //获取收藏夹列表
var list,oldlist;
 mui.ajax("https://wx.shike8888.com/collect/getCollectGoods", {

	        dataType: "json",
	        type: "post",
	        async: false,
	        success: function(data) {
	            if (data.code == 1) {
                   // $('#collectBtn').html('<i class="iconfont icon-shoucang1"></i><span>收藏</span>');
for(var i in data.data1){
list=data.data1[i]['act_id']+','+list;

}
for(var s in data.data2){
oldlist=data.data2[s]['act_id']+','+oldlist;

}
console.log('进行中活动');
console.log(list);
 //$('.header').before('进行中活动');
//$('.header').before('<b class"a_active">'+list+'</b>');
console.log('已下线活动');
//$('.header').before('已下线活动');
console.log(oldlist);
//$('.header').before(oldlist);
	            } else {
	                //mui.alert(data.msg)
	            }
	        }

	    });





var moshi,goodsids,goodsidslist,s,word,keywords,k;
    //$('#fenleizhuangtai').before('<br><p style="width:200px;height:30px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:30px;"id="shoucang" >批量添加收藏(黑名单)</p>');
    $('.header').before('<br><p style="width:200px;height:30px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:30px;"id="shoucang" >批量添加收藏(黑名单)</p><br>');

 $('#shoucang').on("tap",function(event){
     moshi=prompt("模式（默认为添加收藏，1为取消收藏，2关键字添加收藏，3关键字取消收藏）");
     if(moshi!==''&&moshi=='1'){
      goodsids=prompt("输入商品ID：");
      goodsidslist = goodsids.split(',');
       for(s in goodsidslist)  {
       uncollectGoods(goodsidslist[s]);
       }
     }else if(moshi!==''&&moshi=='2'){
     
          get_blacklist();

     }else if(moshi!==''&&moshi=='3'){
     word=prompt("输入关键字：");
          for( s in keywords){
             serach(keywords[s],moshi);
         }


     //serach(word,moshi);
     }else{
      goodsids=prompt("输入商品ID：");
      goodsidslist = goodsids.split(',');
       for(s in goodsidslist)  {
       corcernGoods(goodsidslist[s]);
       }
     }
});
//获取黑名单
function get_blacklist(){
        $.getJSON(url, function(data) {
            console.log(data);
            // $('#nav2').append(data);

            //word='大红灯笼，美白，法式刘海，消防卡，灭烟沙，原液，钥匙扣，纸巾2包，游泳耳塞，玻尿酸，精油，超薄电镀，水杨酸，膏药，美发，海绵口罩，包头巾，发抓，美瞳，护手霜，强光，狗，输液，儿童卫衣，T5灯管，皱纹，儿童圆领时尚，花结，培养孩子自律，发带，瑜伽环，儿童优质上衣，家用小垃圾桶，宠物，宿便，红绳，艾草，晾衣架【10个】，染发，搓脚板，太岁，中药，调理，减肥茶，贴，车载，养生茶，发卡，加赏，奖励，精华，精油，黑眼圈，耳夹，耳环，耳挂，耳骨夹，耳钉，耳线，戒，手动剃须刀，管道除臭剂，晾衣绳，擦车毛巾，后备箱垫，手机壳，干花，运动服套装，一次性抹布，茶叶罐，流行色，口红，红围巾，警察，儿童舒适上衣，强光，染发，笛，照片夹，输液报警器，泳裤，泳镜，儿童游泳，香薰，积分卡，红绳，作业，水写，数学';


            word=data[0];
            keywords=word.split('，');
            moshi=keywords.length;
            for( k in keywords){
                // console.log(keywords[k]);
                serach(keywords[k],2);
            }
        });
    }

    // 关注商品
function corcernGoods(aid,product_name) {
    if(typeof(product_name)=='undefined'){
    product_name='';
    }
    mui.ajax("/collect/cencornGoods", {
        data: { "act_id": aid },
        dataType: "json",
        type: "post",
        async: false,
        success: function(data) {
            if (data.code == 1) {
            	// $('#collectBtn').html('<i class="iconfont icon-shoucang2"></i><span>已收藏</span>');
            	console.log(aid+' '+product_name+'【收藏成功！】');
                  mui.toast(aid+' '+product_name+'【收藏成功！】');
                 $('#shoucang').after("<p style='text-align:center;'>"+aid+' '+product_name+'【收藏成功！】</p>');
            } else {
                mui.toast(product_name+'[已在收藏夹！]');
                 $('#shoucang').after("<p style='text-align:center;'>"+product_name+'[已在收藏夹！]</p>');
                //$('#shoucang').after('【所有包含关键词产品均已收藏】');
            }
        }

    });
}
//取消关注商品
function uncollectGoods(aid,product_name){
   if(typeof(product_name)=='undefined'){
    product_name='';
    }
	 mui.ajax("/collect/cancelConcern", {
	        data: { "act_id": aid },
	        dataType: "json",
	        type: "post",
	        async: false,
	        success: function(data) {
	            if (data.code == 1) {
                   // $('#collectBtn').html('<i class="iconfont icon-shoucang1"></i><span>收藏</span>');
	            	console.log(aid+' '+product_name+'【已取消收藏！】')
                     mui.toast(aid+' '+product_name+'【已取消收藏！】');
	            } else {
	                //mui.alert(data.msg)
	            }
	        }

	    });
}


function serach(str,moshi){
    mui.ajax({
        url:'/activity/findKeyword?str='+str,
        dataType:'json',
        type:'post',
        success:function(ret){
              //console.log(ret);
            if(ret.code == 1){
                //console.log(ret.data.list);
               //var len=ret.data.list.length;
                        for(var i in ret.data.list){
                            if(moshi=='2'){
                               corcernGoods(ret.data.list[i]['act_id'],ret.data.list[i]['product_name']);
                                //mui.toast(ret.data.list[i]['act_id']+'已收藏');
                                      }else if(moshi=='3'){
                           uncollectGoods(ret.data.list[i]['act_id'],ret.data.list[i]['product_name']);
                                //mui.toast(ret.data.list[i]['act_id']+'已取消收藏');
                            }

                        }
            }else{
                console.log('暂无此类可试用商品!!!');
                $('#shoucang').after('<p style="text-align:center;">未搜索到关键词:【'+str+'】的商品</p>');
               //$('#nav2').append('&nbsp;<p>暂无此类可试用商品!!!</p>');
            }
        }
    })

}
    // Your code here...
})();