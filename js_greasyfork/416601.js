// ==UserScript==
// @name         试客巴领取页获取店名
// @namespace    http://ziyuand.cn/
// @version      2.4
// @description  控制台输出店名
// @author       SHERWIN
// @match        *.shike8888.com/tryUse/*
// @run-at 		 document-end
// @grant    	 unsafeWindow
//@require       https://cdn.bootcss.com/jquery.qrcode/1.0/jquery.qrcode.min.js
// @downloadURL https://update.greasyfork.org/scripts/416601/%E8%AF%95%E5%AE%A2%E5%B7%B4%E9%A2%86%E5%8F%96%E9%A1%B5%E8%8E%B7%E5%8F%96%E5%BA%97%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/416601/%E8%AF%95%E5%AE%A2%E5%B7%B4%E9%A2%86%E5%8F%96%E9%A1%B5%E8%8E%B7%E5%8F%96%E5%BA%97%E5%90%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('#is_fans').val('1');
     $('#privilege_mark').val('3');
    var product_link='';
    var aid='';
    if (aid == ""){
        aid=getUrlParam('aid');
    }
    var keywordnum,shopname;

    var ids=getUrlParam('id');

    $('.shike_mustSee_modal').remove();
    $.post('https://wx.shike8888.com/apply/searchInfo?aid='+aid,function(ret){
        //商品列表
        var dataList = ret.data;



        shopname=dataList[0]['shopname'];


        $('.fontOut_goods:first').append('<p style="font-size: 0.3rem;color:#f10180;text-align:center;" >'+'店铺完整名称：<b id="shopname";>'+shopname+"</b></p></br>");
        $('#taobao-info').append('<br><p style="font-size: 0.3rem;color:#f10180;text-align:center;" >'+'店铺完整名称：<b id="shopname";>'+shopname+"</b></p></br>");
        copy('shopname');
        for(var i=0;i<dataList.length;i++){
            // product_link=gettblink(aid);

            console.log('店铺完整名称：'+dataList[i]['shopname']+' 关键词'+i+'：'+dataList[i]['keywords']);

            console.log('下单链接：'+product_link);
            //$('.fontOut_goods:first').append('<p style="font-size: 0.3rem;color:#f10180;text-align:left;"id="keyword";>'+' 关键词'+i+'：'+dataList[i]['keywords']+"</p>");
            $('#keyword').after('<p>关键词'+i+': <b id="keyword'+i+'";>'+dataList[i]['keywords']+'</b></p>');
            keywordnum='keyword'+i;
            copy(keywordnum);
        }
        $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(res){
            $('#keyword').after('<p>下单链接：</p><p id="goodslink" style="z-index:999">'+res.activityDto['product_link']+'</p>');

            $('#keyword').after('<div id="qrcode"><a href="'+res.activityDto['product_link']+'"></a></div>');
            jQuery('#qrcode').qrcode({
                render: "canvas", //也可以替换为table
                width: 100,
                height: 100,
                text: res.activityDto['product_link']
            });
            copy('goodslink');
            product_link=res.activityDto['product_link'];
            console.log(product_link);
            $('#keyword').after('<br><p class="copy_keyword" id="copy_kw_btn"><input type="button" value="复制关键词"></p>');
            $('#qrcode').after('<a id="tiaozhuan" style="font-size:0.4rem;color:#f10180;z-index:999;" href="'+res.activityDto['product_link']+'" target="_blank"><b>【点我打开链接】</b></a>');
            $('.img_help a').attr('href',product_link);
            $('.img_help img').attr('src',"https://static-image-user-cdn.shike8888.com/s/20210303/6e572a7dc1f5b5506e52f9ae2572b78c.png");

            $("#tiaozhuan").off().on('tap',function(){
                console.log(this);
                window.location.href=product_link;

            });
              $(".img_help").off().on('tap',function(){

                window.location.href=product_link;

            });

        },'json');


    },'json');
    function copy(keyword){
        var clipboard = new Clipboard('#'+keyword, {
            text: function() {
                return $('#'+keyword).html();
            }
        });

        clipboard.on('success', function(e) {
            mui.alert("复制成功");

        });

        clipboard.on('error', function(e) {
            mui.alert('请选择“拷贝”进行复制!');
        });


    }


    //移除按钮disable元素，替换class为active
    $('#confirm').removeAttr("disabled");
    $('#confirm').attr("class","active");
    //添加跳转下单页按钮
    //    var url=window.location.search;
    //   var urls="https://wx.shike8888.com/tryUse/get_fourStep";
    //  $('.header_nav').append('<a style="margin:10px;color:white;background-color:red;" href="'+urls+url+'">跳转下单页</a>');

    //添加跳转下单页按钮
    $('.pothook:first').append('<p style="width:120px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="xiadan" >跳转下单页</p>');
    $('.step:first').append('<p style="width:120px;height:40px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:40px;"id="xiadan" >跳转下单页</p>');
    $('#xiadan').on("tap",function(event){
        var url=window.location.search;
        var urls="https://wx.shike8888.com/tryUse/get_fourStep";
        window.location.href = urls+url;
    });

    function gettblink(aid){

        $.post('https://wx.shike8888.com/activity/getBaseDetail?act_id='+aid,function(ret){
            return(ret.activityDto['product_link']);

        });


    }
    //get参数获取程序
    function getUrlParam (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }


    $('.matter_content:last').append('<p style="width:120px;height:30px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:30px;"id="tijiaopinjia" >提前提交评价</p><br>');
    $('.matter_content:last').append('<p style="width:120px;height:30px;margin:0 auto;color:white;background-color:red; z-index:999;text-align:center;line-height:30px;"id="tijiaojietu" >提前提交截图</p>');
    //提前提交评价

    $("#tijiaopinjia").off().on('tap',function(){
        var msg = "确认提交评价？\n\n请确认！";
        if (confirm(msg)==true){
            var data={};
            data.order_id=ids;
            if(is_pic_text){
                data.comment_detail = $("#comment_detail").val()
            }
            //data.status=2;
            if(is_pic){
                data.shaidan1_img = $("#shaidan1_img").val()
                data.shaidan2_img = $("#shaidan2_img").val()
                data.shaidan3_img = $("#shaidan3_img").val()
                data.shaidan4_img = $("#shaidan4_img").val()
                data.shaidan5_img = $("#shaidan5_img").val()
                if($("#shaidan6_img").length > 0){
                    data.shaidan6_img = $("#shaidan6_img").val()
                }
            }
            if(is_comment){
                data.add_comment_detail = $("#add_comment_detail").val()//追评内容
            }
            if(is_ve){
                data.vedio_link = $(".video_item").find("video").attr("src")//视频
            }
            mui.ajax('/tryUse/updateSorder',{
                data:data,
                dataType:'json',
                type:'post',
                success:function(ret){
                    if (ret.code==1) {
                        window.location.href = '/tryUse/tryManage'

                    }else {
                        mui.alert(ret.msg);
                    }
                },
                error:function(){
                    mui.alert('数据提交失败！');
                }
            });
        }else{
            return false;
        }
    });
    //提前提交截图
    $("#tijiaojietu").off().on('tap',function(){
        var msg = "确定提交评价截图？\n\n请确认！";
        if (confirm(msg)==true){
            mui.ajax('/tryUse/updateSorder',{
                data:{order_id:ids,comment_img:$("#comment_img").val()},
                dataType:'json',
                type:'post',
                success:function(ret){

                    if (ret.code==1) {
                        window.location.href = '/tryUse/tryManage'
                    }else {
                        mui.alert(ret.msg);
                    }
                }
            });
        }else{
            return false;
        }

    });



})();