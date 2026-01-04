// ==UserScript==
// @name         京华云采加购物车脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  京华云采加购物车脚本,批量添加商品到购物车中
// @author       You
// @include      *://mkt-bjzc.zhongcy.com/*
// @match        *://mkt-bjzc.zhongcy.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/434966/%E4%BA%AC%E5%8D%8E%E4%BA%91%E9%87%87%E5%8A%A0%E8%B4%AD%E7%89%A9%E8%BD%A6%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434966/%E4%BA%AC%E5%8D%8E%E4%BA%91%E9%87%87%E5%8A%A0%E8%B4%AD%E7%89%A9%E8%BD%A6%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



(function() {
    'use strict';
    //debugger;
    var baseUrl = "http://wap.zsemall.com:8010";




    var q = {}; // 工具方法，这个下面的方法不涉及业务，不用去管他
    var t = {}; // 业务方法

    q.getCookie = function(k) {
        var tmp = $.cookie(k);
        if(!tmp) tmp="";
        return  tmp;
    }
    q.setCookie = function(k, d, t) {
        var expiresDate= new Date();
        expiresDate.setTime(expiresDate.getTime() + (60*1000*t));
        $.cookie(k, d, { expires: expiresDate });
    }
    q.getConfig = function() {
        return JSON.parse(localStorage.getItem("jdcloud"));
    }
    q.getToken = function() {
        var token = "";
        token = q.getCookie("access_token");
        if(!token) {
            // 从本地缓存中拿toKen
            var jdc = q.getConfig;
            if(jdc && jdc.token) token = jdc.token;
        }
        return token;
    }
    // 带token的post请求
    q.reqPost = function(cUrl, dJson, success) {
        $.ajax({url:cUrl,type:"POST",data:q.json2get(dJson),contentType:"application/x-www-form-urlencoded; charset=utf-8",
                success: success,
                error: function(t) {
                    success({
                        code: t.status,
                        msg: t.statusText
                    })
                },
                beforeSend: function(v) {
					v.setRequestHeader("Authorization", q.getToken());
			}});
    }
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


    // 业务
    t.onSuccess = function() {
        $("#baiduwenku_helper_copyall_btn").attr('disabled',false);
    }

    // 获取用户信息
    t.userInfo = null;
    // 判断用户是否登陆&获取用户信息
    t.gerUserInfo = function(fn) {
        var cUrl = "http://mkt-bjzc.zhongcy.com/proxy/platform/platform/user/getUserInfo";
        var dJson = {"platform": 20};
        q.reqPost(cUrl, dJson,
                function(r){
                    if(r.code == 0) {
                        t.userInfo = r.data;
                        if(fn) fn();
                    } else {
                        t.onSuccess();
                        alert("用户未登录！");
                    }
                });

    }


    //
    t.getAddressId = function(fn) {
        t.addressId = 275;
        var cUrl = "http://mkt-bjzc.zhongcy.com/proxy/platform/buyer/address/queryBuyerAddressListByBuyer?";

        //var platformId = q.getConfig()["platformId"] || 20;
        var accountId =  q.getConfig()["accountId"] || 123456789;
        var accountName =  q.getConfig()["accountName"] || "DEFAULTERS";


        // cUrl+"addressId=275&platformId=20&accountId=100001115&sourceType=90&organeId=2"
        $.ajax({url:cUrl+"addressType=1&platformId=20&accountId="+accountName,type:"GET",data:{},contentType:"application/json; charset=utf-8",
                success: function(data, status) {
                    if(data.code == 0 && data.data && data.data.length > 0) {
                        t.addressId = data.data[0].id;
                    }
                    if(fn) fn();
                },
                error: function() {
                    t.onSuccess();
                    alert("购物车商品数量查询失败！");
                },
                beforeSend: function(v) {
                    v.setRequestHeader("Authorization", q.getToken());
                }});
    }

    //查看购物差商品数量
    t.getCardNum = function(fn) {
        t.cartNum = -1;
        var cUrl = "http://mkt-bjzc.zhongcy.com/proxy/trade-service/mall/cart/queryCart?";
        //$.get(cUrl+"addressId=275&platformId=20&accountId=100001115&sourceType=90&organeId=2",function(data,status){
        //   if(data.code == 0) {
        //       t.cartNum = data.data.categoryNum;
        //   }
        //   if(fn) fn();
        //});

        //var platformId = q.getConfig()["platformId"] || 20;
        var accountId =  q.getConfig()["accountId"] || 123456789;
        var accountName =  q.getConfig()["accountName"] || "DEFAULTERS";
        //var sourceType =  _options.SOURCE_TYPE;
        var organizeId =  q.getConfig()["orgId"] || "181";

        // cUrl+"addressId=275&platformId=20&accountId=100001115&sourceType=90&organeId=2"
        $.ajax({url:cUrl+"addressId="+t.addressId +"&platformId=20&accountId="+accountName+"&sourceType="+t.sourceType+"&organeId="+organizeId,type:"GET",data:{},contentType:"application/json; charset=utf-8",
                success: function(data, status) {
                    if(data.code == 0) {
                        t.cartNum = data.data.categoryNum;
                    }
                    if(fn) fn();
                },
                error: function() {
                    t.onSuccess();
                    alert("购物车商品数量查询失败！");
                },
                beforeSend: function(v) {
                    v.setRequestHeader("Authorization", q.getToken());
                }});
    }

    // 加入购物车
    t.addCart = function(i) {
        // 结果反馈
        if(!t.proInfo || i >= t.proInfo.length) {
            // 商品加入购物车完毕，执行通知等收尾程序
            var reStr = "";
            for(var x=0;x<t.proInfo.length;x++){
                if(!t.proInfo[x].success) {
                    reStr += t.proInfo[x].product_name + "("+ t.proInfo[x].sku_id +")\n"
                }
            }

            if(reStr) {
                alert("部分商品添加失败：\n" + reStr);
            } else {
                alert("商品添加成功，请刷新购物车页面！");
            }
            console.log(t.proInfo);
            t.onSuccess();
            return;
        }

        var data = [];
        data[0] = {};
        data[0].skuId = Number(t.proInfo[i].sku_id);
        data[0].shopId = 28;
        data[0].skuNum = t.proInfo[i].sku_num;

        var cUrl = "http://mkt-bjzc.zhongcy.com/proxy/trade-service/mall/cart/addCart";
        //{"skuSaleNumJson": [{"skuId":1126326,"skuNum":1,"shopId":28}],"accountId":4171,"platformId":20,"organizeId":78,"sourceType":90}
        //var dJson = {"skuSaleNumJson": [{"skuId":1126326,"skuNum":1,"shopId":28}],"accountId":4171,"platformId":20,"organizeId":78,"sourceType":90};
        //var dJson = {"skuSaleNumJson": [],"accountId":4171,"platformId":20,"organizeId":78,"sourceType":90};
        var dJson = {"skuSaleNumJson": [],"accountId":4171,"platformId":20,"organizeId":78,"sourceType":t.sourceType};
        dJson.organizeId = t.userInfo.orgId;
        dJson.accountId = t.userInfo.accountId;
        dJson.skuSaleNumJson = encodeURIComponent(JSON.stringify(data));

        console.log(dJson);
        q.reqPost(cUrl, dJson,
                function(r){
                    if(r.code == 0) {
                        t.proInfo[i].success = true;
                    } else {
                        t.proInfo[i].success = false;
                        t.proInfo[i].msg = r.msg;
                        if(r.message) {
                            t.proInfo[i].msg += r.message;
                        }
                    }
                    t.addCart(i+1);
                });
        //$.ajax({url:cUrl,type:"POST",data:JSON.stringify(dJson),contentType:"application/json; charset=utf-8",success: function(result){
        //alert("加入购物车");
        //},error: function(){alert("异常");}});
    }

    t.getProInfo = function() {
        var orderNo = $("#baiduwenku_helper_download_ipt").val();
        if(!orderNo || orderNo.split("#").length != 2) {
            alert("请输入正确批次编号！");
            t.onSuccess();
            return;
        }

        var sp = orderNo.split("#");
        var caseNo = sp[0];
        var index = sp[1];

        //t.proInfo = [];
        //var arr1 = orderNo.split(";");
        //for(var i=0;i<arr1.length;i++) {
        //    var arr2 = arr1[i].split("&");
        //    t.proInfo[i] = {};
        //    t.proInfo[i].skuId = parseInt(arr2[0]);
        //    t.proInfo[i].shopId = 28;
        //    t.proInfo[i].skuNum = parseInt(arr2[1]);
        //}

        var urla = baseUrl+"/mallApi/jc/getBatch";
        $.ajax({url:urla+"?caseId="+caseNo+"&index="+index,
                type:"GET",data:{},contentType:"application/json; charset=utf-8",
                success: function(data,status){
                    if(status == "success" && data.success) {
                        t.proInfo = data.data.caseList;
                        t.sourceType = data.data.sourceType;
                        console.log(data);

                        t.getCardNum(function(){
                            // 判断数量
                            if(t.cartNum < 0 || t.cartNum + t.proInfo.length > 60) {
                                alert("购物车空间不足，请先清空购物车！");
                                t.onSuccess();
                                return;
                            }
                            t.addCart(0);
                        });
                    } else {
                        alert("数据查询失败！" + data.msg);
                        t.onSuccess();
                    }
                },
                error: function() {
                    alert("服务器连接失败！");
                    t.onSuccess();
                }});
    }


    // 添加事件
    var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:150px;right:0px;'>"+
						"<div style='font-size:12px;color:#FFF;background-color:#25AE84;'><input id='baiduwenku_helper_download_ipt' style='height:24px' type='text' value=''></div>"+
						"<div><button id='baiduwenku_helper_copyall_btn' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:#FE8A23;width: 100%;'>加入购物车</button></div>"+
                        //"<div id='baiduwenku_helper_copyall_btn1' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:blue;'>清空购物车</div>"+
                        //"<div id='baiduwenku_helper_copyall_btn2' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:green;'>是否已登陆</div>"+
                        //"<div id='baiduwenku_helper_copyall_btn3' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:red;'>购物车商品数量</div>"+
                        //"<div id='baiduwenku_helper_copyall_btn4' style='font-size:12px;padding:8px 2px;color:#FFF;background-color:black;'>获取商品sku</div>"+
				 	 "</div>";
	$("body").append(topBox);


    // 1 加入购物车
    $("body").on("click","#baiduwenku_helper_copyall_btn",function(){
        $("#baiduwenku_helper_copyall_btn").attr('disabled',true);
        // var orderNo = $("#baiduwenku_helper_download_ipt").val();
        
        if(confirm('请将购物车商品清空，已存在购物车中的商品，可能存在商品加入失败或购买数量错误。\n 确认现在开始加入商品？')) {
            //t.getProInfo();
            t.gerUserInfo(function(){t.getAddressId(t.getProInfo)});
        } else {
            t.onSuccess();
        }
    });
})();