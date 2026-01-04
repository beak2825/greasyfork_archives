// ==UserScript==
// @name         试客巴一键申请
// @namespace    http://ziyuandcn
// @version      2.8
// @description  按品类一键申请
// @author       SHERWIN
// @match        *.shike8888.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416955/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%B8%80%E9%94%AE%E7%94%B3%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/416955/%E8%AF%95%E5%AE%A2%E5%B7%B4%E4%B8%80%E9%94%AE%E7%94%B3%E8%AF%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //$('#nav2').append('<p style="width:200px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="yijian" >一键申请</p><br><p style="width:200px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="apply_again" >一键再次申请</p>');
    $('<span id="yijian"><img src="https://static-image-user-cdn.shike8888.com/s/20210122/d11d90496cb9b2ac71f71df8aeb1b8a5.png"></span ><br><span style="color:#ff366f">一键申请</span>').replaceAll("#nav2 li:eq(1) a");
    // $('<span id="apply_again"><img src="https://static-image-user-cdn.shike8888.com/s/20210122/53fe6bf6b65eba023ca41ac61b954395.png"></span ><br><span style="color:#ff366f">一键再次申请</span>').replaceAll("#nav2 li:eq(2) a");
    //$('.mui-scroll').before();
   // $('.ad_space').after('<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">一键申请输出面板</a><div class="mui-collapse-content" id="apply_shuchu"></div></li></ul>')
    $('#yijianshenqin').on("tap",function(event){
        shenqin();
    });
    $('#guideAppBox').on("tap",function(event){
           //$('#shuchu').append('<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">一件申请输出面板</a><div class="mui-collapse-content" id="apply_shuchu"></div></li></ul>');
        $('.ad_space').after('<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">一键申请输出面板</a><div class="mui-collapse-content" id="apply_shuchu"></div></li></ul>');
        typegetID(0);
    });
    var category='';
    var shenqintype='';
    var guolv='';
    var soword='';
    var blackword='';
    var product_name='';
    var products_name='';
    var act_id='';
    var len;
    $('#yijian').on("tap",function(event){
          // $('#shuchu').append('<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">一件申请输出面板</a><div class="mui-collapse-content" id="apply_shuchu"></div></li></ul>');
        $('.ad_space').after('<ul class="mui-table-view"><li class="mui-table-view-cell mui-collapse"><a class="mui-navigate-right" href="#">一键申请输出面板</a><div class="mui-collapse-content" id="apply_shuchu"></div></li></ul>')
        shenqintype=prompt("请输入申请模式，1按品类申请，2关键字申请，3收藏夹黑名单模式");
        if(shenqintype!==''&& shenqintype=='1'){
            category=prompt("请输入分类id，0全部，时尚女装1，精品男装2，护肤美妆3，鞋类箱包4，居家生活5，数码电器6，母婴儿童7，户外运动8，食品酒水9，其他试用10，家居服饰36，珠宝配饰37，家装建材38，汽车用品39");
            if(category!==''){
                guolv=prompt("请选择是否过滤商品，默认不过滤，1过滤");

                if(guolv!==''&&guolv=='1'){
                    guolvgoods(category);

                }else{
                    typegetID(category);
                }
            }
        }else if(shenqintype!==''&& shenqintype=='2'){
            soword=prompt("请输入关键词");
            serach(soword);
        }else if(shenqintype!==''&& shenqintype=='3'){

            Collect();
        }




        // balckgoods=prompt("请输入黑名单商品，如：一洗黑,养生(以英文逗号分隔)");


    });
    //按分类获取ID
    function typegetID(category){
        twice_shenqin();
        $.toAjax({
            url:"/activity/expertSort",
            data:{category: category,shop_type: 0,yf_type: 0,sy_type: 0,sp_type: 0,order: 0,classes: 1,type: 0,page:'1',size:300},
            success:function (res) {
                //res_typegetID(res);
                if (res.code == 1){
                    //len=res.data.length;
                    for(var j in res.data){
                        shenqin(res.data[j]['act_id'],res.data[j]['product_name'],j);
                    }
                };

            },
            error:function (err) {
            }
        });
    };

    var blackwordList = '';
    //过滤程序
    function guolvgoods(category){

        blackword=prompt("请输入过滤商品关键词，可以多个，用逗号分隔");
        if(blackword==''){
            blackword='预约，照片夹子，笛，贴，加赏，赏，黑茶灰，发，一洗黑，染发，披萨盘，鞋胶，绿板，耳钉，耳挂，耳环，手动剃须刀，围巾，肾宝，中药，养生茶，调理，汽车后备箱，减肥，生姜，儿童卫衣，月经，美白淡斑，手机壳，钢化膜，摆件铁艺，狗狗，宠物，置物，儿童舒适上衣，雪莲贴，铁罐，猫砂，云南中药，福袋，学生钢笔，剪纸，车载，女童内裤，儿童圆领时尚卫衣，警察玩具，儿童内裤，运动服套装，充电头灯，彩铃，输液，灭烟，搓脚板，打底裤，熬夜，双杆'
        }
        blackwordList = blackword.split('，');
        var result='',product_name='';
        $.toAjax({
            url:"/activity/expertSort",
            data:{category: category,shop_type: 0,yf_type: 0,sy_type: 0,sp_type: 0,order: 0,classes: 1,type: 0,page:'1',size:300},
            success:function (res) {
                result=res.data.length;
                //shuzu=res;
                console.log('数组长度；'+result);
                for(var i=0;i<=result;i++){
                    // console.log(i);

                    //console.log('关键词数组长度：'+blackwordList.length);
                    for(var k=0;k<blackwordList.length;k++){
                        if(((res.data[i] && res.data[i]['product_name']) ||'').indexOf(blackwordList[k]) <= 0 ) {
                            //console.log(res[i]+' 中包含字符串');
                            // blackword.push(act_id)
                            //console.log(res[i]);
                            // console.log(res.data[i]['product_name']+' 中不包含字符串 '+blackwordList[k]);
                            //shenqin(act_id,product_name);
                            //console.log(k+'不匹配');
                        }else{

                            console.log('商品：'+res.data[i]['product_name']+' 中包含过滤词'+blackwordList[k]+'【取消申请！】');
                            //$('#nav2').append('<p style="text-align:center;">商品：'+res.data[i]['product_name']+' 中包含过滤词'+blackwordList[k]+'【取消申请！】'+'</p>');
                             $('#apply_shuchu').append('<p style="text-align:center;">商品：'+res.data[i]['product_name']+' 中包含过滤词'+blackwordList[k]+'【取消申请！】'+'</p>');
                            //var local = $.inArray(res.data[i]['act_id'],res.data); //根据元素值查找下标，不存在返回-1
                            res.data.splice(i,1);//根据下标删除一个元素   1表示删除一个元素
                            // console.log(local);
                        }
                    }
                };
                console.log(res.data.length);
                console.log(res);
                for(var s in res.data ){

                    //console.log(res.data[s]['act_id']+res.data[s]['product_name']);
                    shenqin(res.data[s]['act_id'],res.data[s]['product_name'],s)
                }
            },
            error:function (err) {
            }
        });



    };
    //申请程序
    function shenqin(act_id,products_name,s){
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
                       // $('#nav2').append('<p style="text-align:center;">'+s+' '+products_name+'【申请成功！】</p>');
                          $('#apply_shuchu').append('<p style="text-align:center;">'+s+' '+products_name+'【申请成功！】</p>');
                    }else{
                        console.log(s+' 商品:'+products_name+' ID:'+act_id+' '+data.msg);
                      //  $('#nav2').append('<p style="text-align:center;">'+s+' '+products_name+' '+data.msg+'</p>');
                        $('#apply_shuchu').append('<p style="text-align:center;">'+s+' '+products_name+' '+data.msg+'</p>');
                    }
                }
            });
        }, 300*s);
    };
    //奖励领取程序
    function get_reward(){
        $.ajax('/dailyTask/receiveRewards', {
            data:{type:2},
            dataType: 'json',
            type: 'post',
            success:function(ret){
                if(ret.code == 1){
                   // $('#nav2').append('<p style="text-align:center; color:red;">恭喜获得<span>'+ret.data+'</span>夺宝币</p>');
                      $('#apply_shuchu').append('<p style="text-align:center; color:red;">恭喜获得<span>'+ret.data+'</span>夺宝币</p>');
                    drawLottery();
                }
            }
        });}
    //按关键字搜索程序
    function serach(str){
        mui.ajax({
            url:'/activity/findKeyword?str='+str,
            dataType:'json',
            type:'post',
            success:function(ret){
                if(ret.code == 1){
                    console.log(ret.data.list);
                    var len=ret.data.list.length;
                    for(var i=0;i<=len;i++){
                        act_id=ret.data.list[i]['act_id'];
                        product_name=ret.data.list[i]['product_name'];
                        shenqin(act_id,product_name);
                    }
                }else{
                    console.log('暂无此类可试用商品!!!');
                    $('#nav2').append('<p style="text-align:center;">暂无此类可试用商品!!!</p>');
                     $('#apply_shuchu').append('<p style="text-align:center;">暂无此类可试用商品!!!</p>');
                }
            }
        })

    }
    //抽奖程序
    function drawLottery(){
        //先判断是否有抽奖次数，防止扣币
        $.toAjax({
            url:"https://wx.shike8888.com/dailyTask/getDailyTask",
            type:"post",
            success:function (data) {
                //console.log(data.data['lottery_count']);
                var lottery_count=data.data['lottery_count'];
                if(lottery_count>0){
                    //执行抽奖
                    $.ajax('/dailyTask/drawLottery', {
                        dataType: 'json',
                        type: 'get',
                        success:function(ret){
                            if(ret.code == 1){
                                var stopwz = ret.data;
                                //console.log(stopwz);
                                switch (stopwz) {
                                    case 0:
                                        $('#apply_shuchu').append('<p style="text-align:center; color:#fe6d47;">抽奖获得:<span>【7天巴粉】</span></p>');
                                        break;
                                    case 1:
                                        $('#apply_shuchu').append('<p style="text-align:center; color:#fe6d47;">抽奖获得:<span>【10元免手续费】</span></p>');
                                        break;
                                    case 2:
                                        $('#apply_shuchu').append('<p style="text-align:center; color:#fe6d47;">抽奖获得:<span>【20元必中券】</span></p>');
                                        break;
                                    case 3:
                                        $('#apply_shuchu').append('<p style="text-align:center; color:#fe6d47;">抽奖获得:<span>【7天会员】</span></p>');
                                        break;
                                    case 4:
                                        $('#apply_shuchu').append('<p style="text-align:center; color:#fe6d47;">抽奖获得:<span>【1个夺宝币】</span></p>');
                                        break;
                                    case 5:
                                        $('#apply_shuchu').append('<p style="text-align:center; color:#fe6d47;">抽奖获得:<span>【谢谢参与】</span></p>');
                                        break;
                                    case 6:
                                        $('#apply_shuchu').append('<p style="text-align:center; color:#fe6d47;">抽奖获得:<span>【3个夺宝币】</span></p>');
                                        break;
                                    default:
                                        $('#apply_shuchu').append('<p style="text-align:center; color:#fe6d47;">抽奖获得:<span>【5个夺宝币】</span></p>');
                                        break;};
                                return false;
                            }else{
                                //alertBox.modalBox(['确定'],null,'<p style="text-align:center;">'+ret.msg+'</p>');
                                return false;
                            }
                        }
                    });



                }
            }
        });

    };
    //------------------------------------二次申请----------------------------------
    var isfreegoods='';

    $('#apply_again').on("tap",function(event){
        twice_shenqin();
    });
    function twice_shenqin(){
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
                    for(var i in res.data.list){
                        var freetype=goodslists[i]['privilege_mark'];
                        if(freetype=='2'||freetype=='3'){
                            isfreegoods='  【免手续费】';
                        }else{
                            isfreegoods='';};

                        // console.log('商品ID：'+goodslists[i]['act_id']+'  名称：'+goodslists[i]['product_name']+'  价格：'+goodslists[i]['margin']+isfreegoods);
                        applys(goodslists[i]['apply_id'],goodslists[i]['act_id'],goodslists[i]['product_name']);
                        //isCollectGoods(goodslists[i]['act_id'],goodslists[i]['product_name'],i,goodslists[i]['apply_id'])

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
                    $('#apply_shuchu').append('<p style="text-align:center;"> '+products_name+'【提交申请成功!】</p>');

                    mui.toast('商品:'+products_name+'提交申请成功!',{ duration:'short', type:'div' })
                    //  mui.alert(goodsid+'提交申请成功!');
                }else{
                    console.log('商品'+products_name+' ID:'+goodsid+'提交申请失败!');
                    mui.toast('商品'+products_name+' ID:'+goodsid+'提交申请失败!',{ duration:'short', type:'div' })
                    $('#apply_shuchu').append('<p style="text-align:center;">'+products_name+'提交申请失败!</p>');
                    // mui.alert(goodsid+'提交申请成功!');
                }
            }
        });

    }

    //------------------------------------收藏夹黑名单申请----------------------------------

    function isCollectGoods(act_id,products_name,s,apply_id){
        $.post('https://wx.shike8888.com/collect/isConcern?act_id='+act_id,function(res){
            if(res.code=='1'){
                //console.log('已收藏');
                console.log(s+'ID：'+act_id+'名称：'+products_name+'【黑名单跳过申请】');
                mui.toast(s+'ID：'+act_id+'名称：'+products_name+'【黑名单跳过申请】');
                $('#apply_shuchu').append('<p style="text-align:center;">'+s+' '+products_name+'【黑名单】</p>');
            }else if(res.code=='0'){
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
    //获取收藏夹列表
    function Collect(){
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


})();