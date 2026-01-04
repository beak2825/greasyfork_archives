// ==UserScript==
// @name         京华云彩商品选择脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  京华云彩商品选择脚本,是一个选择商品的脚本，内部使用
// @author       You
// @match        http://mkt-bjzc.zhongcy.com/mall-view/store/search?sid=4
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/434965/%E4%BA%AC%E5%8D%8E%E4%BA%91%E5%BD%A9%E5%95%86%E5%93%81%E9%80%89%E6%8B%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434965/%E4%BA%AC%E5%8D%8E%E4%BA%91%E5%BD%A9%E5%95%86%E5%93%81%E9%80%89%E6%8B%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var baseUrl = "http://wap.zsemall.com:8010";




    //debugger;
    var q = {};
    q.json2get = function(sstr) {
        sstr = JSON.stringify(sstr);
        sstr = sstr.replace(/\t/g,"");
		sstr = sstr.replace(/\"/g,"").replace("{","").replace("}","").replace(",","&").replace(":","=");
		sstr = sstr.replace(/\"/g,"").replace(/{/g,"").replace(/}/g,"").replace(/,/g,"&").replace(/:/g,"=");
		return sstr;
    }
    q.get2json = function(sstr) {
        sstr = sstr.replace(/&/g,'","').replace(/=/g,'":"');
		sstr= '{"'+sstr+'"}';
        return sstr;
    }

    var getCookie = function() {
        var tmp = $.cookie('tpiao19999911');
        if(!tmp) tmp="";
        return  tmp;
    }

    var setCookie = function() {
        var d = $("#baiduwenku_helper_download_inp").val();
        if(!d) d="";
        var expiresDate= new Date();
        expiresDate.setTime(expiresDate.getTime() + (60*1000*30));
        $.cookie('tpiao19999911', d, { expires: expiresDate });
    }

    $("body").on("click",".addbus_helper_copyall_btn",function(){
        var d = $("#baiduwenku_helper_download_inp").val();
        if(!d) {
            alert("请填写订单号！");
            return;
        }
        setCookie();
        //{"cid":30012,
        //"shopId":28,
        //"skuName":"广博（GuangBo） 8K绒面荣誉证书外壳附带内芯10本装 ZZS6686-2",
        //"skuImage":"http://www.zsemall.com/upload/product/20210531/74c187e3-35ec-496c-9e94-3d50b60d7e2d.png",
        //"skuId":1031532}
        //http://mkt-bjzc.zhongcy.cn/mall-view/product/detail?skuid=1031532
        var jstr = $(this).parent().parent().children()[0].dataset.value;
        var djson = eval('(' + jstr + ')');
        console.log(jstr);
        var skuNum = $(this).parent().children()[0].value;
        if(!skuNum || isNaN(skuNum) || skuNum <= 0) {
            alert("请正确填写数量！");
            return;
        }

        var urla = baseUrl+"/mallApi/jc/addPro";
        //$.get(urla+"?caseId="+d+"&cid="+djson.cid+"&skuNum="+skuNum+ "&skuName="+djson.skuName+ "&skuImage="+djson.skuImage+ "&skuId="+djson.skuId,function(data,status){
        //    if(status == "success" && data.success) {
        //        alert("加入成功！");
        //    } else {
        //        alert("加入失败，" + data.msg);
        //    }
        //});
        var skuNameStr = djson.skuName.replaceAll("%","");
        skuNameStr = skuNameStr.replaceAll("_","");
        $.ajax({url:urla+"?caseId="+d+"&cid="+djson.cid+"&skuNum="+skuNum+ "&skuName="+ skuNameStr + "&skuImage="+djson.skuImage+ "&skuId="+djson.skuId
                ,type:"GET",data:{},contentType:"application/json; charset=utf-8",
                success: function(data,status){
                    if(status == "success" && data.success) {
                        alert("加入成功！");
                    } else {
                        alert("加入失败，" + data.msg);
                    }
                },
                error: function() {
                    alert("服务器连接失败！");
                }});
    });



    var addTimeouot = function() {
        // 给商品添加按钮
        setInterval(function(){
            //$(".pd-button").append("<div><button class='addbus_helper_copyall_btn'>加入到购物车</button></div>");
            var btn = $(".pd-button");
            var tmp;
            if(btn && $(".layui-tab-title>.layui-this:contains('网上超市')") && $(".layui-tab-title>.layui-this:contains('网上超市')").length>0) {
                for(var i=0;i<btn.length;i++){
                    if(btn[i].children.length == 2) {
                        tmp = $(btn[i]).append("<div><input style='width:48px;margin-right:2px' type='number' value='1'><button style='margin-top:3px' class='addbus_helper_copyall_btn'>加入到购物车</button></div>");
                        //tmp.on("click",".addbus_helper_copyall_btn",function(){
                        //    alert("ok");
                        //});
                    }
                }
            }
        }, 3000);
    }

    // 订单号标签
    var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:150px;left:0px;'>"+
                        //"<div id='baiduwenku_helper_copyall_btn' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#FE8A23;'>订单号</div>"+
						"<div style='font-size:12px;color:#FFF;background-color:#25AE84;'>订单号<input type='text' style='height:28px' id='baiduwenku_helper_download_inp' value='"+getCookie()+"'></div>"+
                        //"<div id='baiduwenku_helper_download3' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#25AE84;'>测试</div>"+
				 "</div>";


    // 网上超市页面
    if(location.href.match(/mkt-bjzc.zhongcy\.com\/mall-view\/store\/search\?sid\=4/)) {
        $("body").append(topBox);
        addTimeouot();
    }


    //$("body").on("click","#baiduwenku_helper_download3",function(){
    //    alert(location.href);
    //});


})();