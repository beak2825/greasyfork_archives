// ==UserScript==
// @name         试客巴一键加黑申请
// @namespace    http://ziyuand.cn
// @version      2.4
// @description  批量定时申请
// @author       SHERWIN
// @match        *.shike8888.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/420487/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%B8%80%E9%94%AE%E5%8A%A0%E9%BB%91%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/420487/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%B8%80%E9%94%AE%E5%8A%A0%E9%BB%91%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //去除首页多余广告
    $('<img src="https://static-h5r-alicnd.shike8888.com/images/index/guide-app-img.png" style="width: 7.3rem;margin: 0.1rem;margin-bottom:0;height: 1.2rem;" alt="">').replaceAll("#guideAppBox a");
    // $('').replaceAll("#floating_nav");
    $("#floating_nav").attr('class','');
    //$('#slider').remove();
    $('#newcomerZone').remove();
    $('#tagUserZone').remove();

    //黑名单列表UEL判断
    var url;
    $.post('https://wx.shike8888.com/userInfo/findUserInfo',function(res){
        var azhan_phone=new Array('18695726268','15306971757','15959071059','15959071069','16621102036','17192190789');
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


    $('<span id="jiaheishenqing"><img src="https://static-image-user-cdn.shike8888.com/s/20210122/8fb4662bde5679de6587471039bb1206.png"></span ><br><span style="color:#ff366f">一键加黑申请</span>').replaceAll(".my_tasks:eq(1) a");
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
                //console.log('进行中活动');
                //console.log(list);
                //$('.header').before('进行中活动');
                //$('.header').before('<b class"a_active">'+list+'</b>');
                //console.log('已下线活动');
                //$('.header').before('已下线活动');
                //console.log(oldlist);
                //$('.header').before(oldlist);
            } else {
                //mui.alert(data.msg)
            }
        }

    });





    var moshi,goodsids,goodsidslist,s,word,keywords,k;
    //$('#fenleizhuangtai').before('<br><p style="width:200px;height:30px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:30px;"id="shoucang" >批量添加收藏(黑名单)</p>');

    var  off=false;
    var cishu=1;
    $('#jiaheishenqing').on("tap",function(event){
        //$('#nav2').append("<p style='text-align:center;'>【一键加黑申请开始执行，请稍后】</p>");
        //  moshi=prompt("模式（默认为添加收藏，1为取消收藏，2关键字添加收藏，3关键字取消收藏）");
        //get_blacklist();
        if (cishu%2 == 0){
            //Collect();
            $('').replaceAll("#nav2 p");
            $('#nav2').append("<p style='text-align:center;color:red;'>【申请中，请停留几秒】</p>");

            Collect();
            twice_shenqin();

        }else{
            //get_blacklist();
            $('').replaceAll('#nav2 p')
            $('#nav2').append("<p style='text-align:center;color:red;'>【加黑中，请停留几秒，再次点击按钮开始一键申请】</p>");

            get_blacklist();

        }
        cishu++;
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
                serach(keywords[k]);
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
                    // mui.toast(aid+' '+product_name+'【收藏成功！】');
                    $('#nav2').append("<p style='text-align:center;color:red;'>"+aid+' '+product_name+'【收藏成功！】</p>');
                } else {
                    //mui.toast(product_name+'[已在收藏夹！]');
                    console.log(product_name+'[已在收藏夹！]');
                    $('#nav2').append("<p style='text-align:center;'>"+product_name+'[已在收藏夹！]</p>');
                    //$('#shoucang').after('【所有包含关键词产品均已收藏】');
                }
            }

        });
    }


    //根据关键词搜索商品
    function serach(str){
        // console.log(off);
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
                        corcernGoods(ret.data.list[i]['act_id'],ret.data.list[i]['product_name']);
                        //mui.toast(ret.data.list[i]['act_id']+'已收藏');
                    }

                }else{
                    console.log('暂无此类可试用商品!!!');
                    // $('#nav2').append('<p style="text-align:center;">未搜索到关键词:【'+str+'】的商品</p>');
                    //$('#nav2').append('&nbsp;<p>暂无此类可试用商品!!!</p>');
                }
            }
        })

    }

    //------------------------------------收藏夹黑名单申请----------------------------------
    //黑名单过滤申请程序
    function isCollectGoods(act_id,products_name,s,apply_id){
        //console.log(off);
        $.post('https://wx.shike8888.com/collect/isConcern?act_id='+act_id,function(res){
            if(res.code=='1'){
                //console.log('已收藏');
                console.log(s+'ID：'+act_id+'名称：'+products_name+'【黑名单跳过申请】');
                mui.toast(s+'ID：'+act_id+'名称：'+products_name+'【黑名单跳过申请】');
                //$('#nav2').append('<p style="text-align:center;">'+s+' '+products_name+'【黑名单】</p>');
            }else if(res.code=='0'){

                //shenqin(act_id,products_name,s);
                if(apply_id==1){
                    shenqin(act_id,products_name,s);
                }else{
                    applys(apply_id,act_id,products_name);
                }

                //console.log(s+'商品ID：'+act_id+'名称：'+products_name+'-【申请成功】');
                // mui.toast(s+'商品ID：'+act_id+'名称：'+products_name+'-【申请成功】');
                // $('#nav2').append('<p>'+s+'商品ID：'+act_id+'名称：'+products_name+'-【申请成功】</p>');
            }

        },'json');
    }
    //获取所有商品列表
    function Collect(){
        //console.log(off);
        $.toAjax({
            url:"/activity/expertSort",
            data:{category: 0,shop_type: 0,yf_type: 0,sy_type: 0,sp_type: 0,order: 0,classes: 1,type: 0,page:'1',size:300},
            success:function (res) {
                //res_typegetID(res);
                if (res.code == 1){
                    //len=res.data.length;
                    for(var s in res.data){
                        isCollectGoods(res.data[s]['act_id'],res.data[s]['product_name'],s,1);
                        // console.log(res.data[s]['act_id'],res.data[s]['product_name']);
                    }
                };

            },
            error:function (err) {
            }
        });
    };
    //申请程序
    function shenqin(act_id,products_name,s){
        // console.log(off);
        //console.log(act_id);
        setTimeout(() => {
        var data = {act_id:act_id,type:"2"};
        $.toAjax({
            url:"/apply/insertNewApply",
            data:data,
            type:"post",
            success:function (data) {
                if (data.code == 1) {
                    get_reward();
                    //window.location.href="/apply/applySuccess?applyId="+data.applyId;
                    console.log(s+' 商品:'+products_name+' ID:'+act_id+' 【申请成功！】');
                    $('#nav2').append('<p style="text-align:center;color:red;">'+s+' '+products_name+'【申请成功！】</p>');
                }else{
                    console.log(s+' 商品:'+products_name+' ID:'+act_id+' '+data.msg);
                    $('#nav2').append('<p style="text-align:center;">'+s+' '+products_name+' '+data.msg+'</p>');
                }
            }
        });
}, 300* s);
    };
    //奖励领取程序
    function get_reward(){
    	$.ajax('/dailyTask/receiveRewards', {
		data:{type:2},
		dataType: 'json',
        type: 'post',
        success:function(ret){
        	if(ret.code == 1){

                   $('#nav2').append('<p style="text-align:center;">恭喜获得<span>'+ret.data+'</span>夺宝币</p>');
        	}
        }
	});}

    //------------------------------------二次申请----------------------------------
    var isfreegoods='';
    function twice_shenqin(){
        //console.clear();
        //console.log('已执行二次申请，如无输出则无待申请');
        $('#nav2').append("<p style='text-align:center;color:red;'>【已执行二次申请，如无输出则无待申请】</p>");
        $.toAjax({
            url:"/tryUserManage/myTry/applyList",
            data:{pageNo:1,pageSize: 200,listType:3},
            success:function (res) {
                if (res.code == 1){
                    var goodslists=res.data.list;
                    var len=res.data.list.length;
                    //console.log(len);
                    for(var i in res.data.list){
                        var freetype=goodslists[i]['privilege_mark'];
                        if(freetype=='2'||freetype=='3'){
                            isfreegoods='  【免手续费】';
                        }else{
                            isfreegoods='';};

                        // console.log('商品ID：'+goodslists[i]['act_id']+'  名称：'+goodslists[i]['product_name']+'  价格：'+goodslists[i]['margin']+isfreegoods);
                        //applys(goodslists[i]['apply_id'],goodslists[i]['act_id']);
                        isCollectGoods(goodslists[i]['act_id'],goodslists[i]['product_name'],i,goodslists[i]['apply_id']);

                    };

                };

            },
            error:function (err) {
            }
        });
    };
    function applys(apply_id,goodsid,products_name){
        var data = { apply_id:apply_id,c_product_img:'', c_shop_img:'' }
        mui.ajax('/task/doTask',{
            data:data,
            dataType:'json',
            type:'post',
            success:function(ret){
                if (ret.code == 1) {
                    console.log('商品:'+products_name+' ID:'+goodsid+'提交申请成功!');
                    $('#nav2').append('<p style="text-align:center;color:red;"> '+products_name+'【提交申请成功!】</p>');
                    mui.toast('商品:'+products_name+'提交申请成功!',{ duration:'short', type:'div' })
                    //  mui.alert(goodsid+'提交申请成功!');
                }else{
                    console.log('商品'+products_name+' ID:'+goodsid+'提交申请失败!');
                    mui.toast('商品'+products_name+' ID:'+goodsid+'提交申请失败!',{ duration:'short', type:'div' })
                    $('#nav2').append('<p style="text-align:center;">'+products_name+'提交申请失败!</p>');
                    // mui.alert(goodsid+'提交申请成功!');
                }
            }
        });

    }


})();