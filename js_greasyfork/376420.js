// ==UserScript==
// @name     淘宝修改页面
// @namespace  自用
// @author    火柴人
// @version    1.8
// @description  自用淘宝修改，1.2添加自动好评,1.3添加自动编辑手机页面，1.5，一键编辑完；1.6，评价完后自动关闭页面；1.7，优化发货界面，发货后自动关闭发货页面；1.8增加新的页面自动发货
// @require        http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @include        *//item.publish.taobao.com/sell/publish.htm*
// @include        *//sell.xiangqing.taobao.com/*
// @include        *//rate.taobao.com/remarkBuyer*
// @include        *//wuliu.taobao.com/user*
// @include        *trade.taobao.com/trade/itemlist/list_sold_items.htm*tabCode=waitRate*
// @include        https://item.taobao.com/item.htm?id=582386383596
// @include        https://item.taobao.com/item.htm?id=639776674734
// @grant          GM_setValue
// @grant          GM_getValue
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/376420/%E6%B7%98%E5%AE%9D%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/376420/%E6%B7%98%E5%AE%9D%E4%BF%AE%E6%94%B9%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    var pageId = "639776674734";//2021.1.02
    console.log("------");
    console.log(window.location.href == ("https://item.taobao.com/item.htm?id="+pageId) && GM_getValue("page") == "1");
    var isdebug = true;
    var debug = isdebug ? console.log.bind(console) : function () {
    };
    if (location.host.indexOf("rate.taobao.com") >= 0) {
        debug("i am in rate");
        // rate 页面
        $(".good-rate").click();
        //document.getElementById("rateListForm").submit();
        setTimeout(function(){
            $.ajax({
                //几个参数需要注意一下
                type: "POST",//方法类型
                dataType: "json",//预期服务器返回的数据类型
                url: "/remarkBuyer.htm" ,//url
                data: $('#rateListForm').serialize(),
                success: function (result) {
                    console.log(result);//打印服务端返回的数据(调试用)
                    if (result.resultCode == 200) {
                        alert("SUCCESS");
                    }
                    ;
                },
                error : function() {
                    window.close();
                }
            });
        }, 2000);
    }else if(location.host.indexOf("wuliu.taobao.com") >= 0){
        //document.orderForm.submit();
        var btn = $("[id='logis:noLogis']");
        if(btn.length>0){
            $("[id='logis:noLogis']").click();
            //window.close();
            setTimeout(function(){
                window.close();
            }, 200);
        }else{
            setTimeout(function(){
                $.ajax({
                    //几个参数需要注意一下
                    type: "POST",//方法类型
                    dataType: "json",//预期服务器返回的数据类型
                    url: window.location.href.substring(24) ,//url
                    data: $('#orderForm').serialize(),
                    success: function (result) {
                        console.log(result);//打印服务端返回的数据(调试用)
                        if (result.resultCode == 200) {
                            alert("SUCCESS");
                        }
                        ;
                    },
                    error : function() {
                        window.close();
                    }
                });
            }, 2000);
        }
    }else if (location.host.indexOf("item.publish.taobao.com") >= 0 || location.host.indexOf("trade.taobao.com") >= 0) {
        debug("i am in item");
        // 商品编辑页
        var buttonType = {
            "display": "block",
            "margin-bottom": "10px"
        };
        var buttonGroup = '<div style="position: fixed;top:200px;right: 300px;"><textarea id="tta"></textarea><button class="btn-change-place">-----登录-----</button><button class="btn-mobile-change">手机修改</button><button class="btn-rate">-----评价-----</button></div>';
        $("body").append(buttonGroup);
        $(".btn-change-place").css(buttonType);
        $(".btn-change-place").on("click", function () {
            var aa = $("#tta").val();
            ckbtn = $("#cke_16");
            sbbtn = $("#button-submit");
            ckbtn.click();
            $("#cke_1_contents").find("textarea").val(aa);
            GM_setValue("page", "1");
            setTimeout('ckbtn.click();', 300);//源码按钮
            setTimeout('sbbtn.click();', 3000);//提交按钮？？有效??有的

        });

        /*$(".btn-change-place2").on("click", function () {
            var j = {
                catId:"126604009",
                itemId:"563162633309",
				jsonBody: '{"auctionType":"b","sevenDayDefaultValue":2,"location":{"prov":"广东","city":"广州"},"taobaoMarketTransform":null,"taobaoMarketClean":null,"commitType":null,"snapshotId":null,"showDraft":1,"dbDraftId":null,"draftIdKey":null,"skyLightRule":null,"foodSecuritySubmit":null,"ifdWarningSubmit":false,"fakeCreditSubmit":false,"userId":275766104,"catId":126604009,"id":563162633309,"stuffStatus":{"value":5},"price":"7.00","quantity":"95","sku":[{"skuStock":95,"skuPrice":"7.00","sourceSkuId":null,"skuId":3711025910821,"props":[{"name":"p-30182","value":5728564,"text":"标准版","label":"游戏版本"},{"name":"p-122216883","value":27889,"text":"简体中文","label":"语种分类"}],"action":{"selected":true},"readonlyFields":[],"salePropKey":"30182-5728564_122216883-27889"}],"shopcat":[1362712056],"descType":{"value":0},"desc":"<p style=\"color: #000000;\"><strong>语言：中文</strong></p>\n\n<p style=\"color: #000000;\"><strong>游戏容量：3535M</strong></p>\n\n<p style=\"color: #000000;\"><strong>商品押金：100元</strong></p>\n\n<p style=\"color: #000000;\"><strong>商品标价：7天7元</strong></p>\n\n<p style=\"color: #000000;\"><strong>超期费用：按每天1元计算</strong></p>\n\n<p style=\"color: #000000;\"><strong>租期计算：拍下当天不计租期，从第二天开始算租期</strong></p>\n\n<p style=\"color: #000000;\"><strong><img align=\"absmiddle\" src=\"https://img.alicdn.com/imgextra/i3/275766104/TB2P9mqjMDD8KJjy0FdXXcjvXXa_!!275766104.jpg\" /><img align=\"absmiddle\" src=\"https://img.alicdn.com/imgextra/i4/275766104/TB2_X0jjRDH8KJjSszcXXbDTFXa_!!275766104.jpg\" /><img align=\"absmiddle\" src=\"https://img.alicdn.com/imgextra/i2/275766104/TB2dmH4ikfb_uJjSsrbXXb6bVXa_!!275766104.jpg\" /><img align=\"absmiddle\" src=\"https://img.alicdn.com/imgextra/i4/275766104/TB2zO5ajIbI8KJjy1zdXXbe1VXa_!!275766104.jpg\" /> </strong></p>\n","outerId":"","sevenDayNotSupport":1,"startTime":{"type":0,"shelfTime":1514008618000},"video":[],"subStock":{"value":0},"tbExtractWay":{"value":["2"],"template":"8915349160"},"vipDiscount":{"value":-1},"wirelessDescType":{"value":0},"wirelessDesc":[{"type":"text","value":"语言：中文"},{"type":"text","value":"游戏容量：353M"},{"type":"text","value":"商品押金：100元"},{"type":"text","value":"商品标价：7天7元"},{"type":"text","value":"超期费用：按每天1元计算"},{"type":"text","value":"租期计算：拍下当天不计租期，从第二天开始算租期"},{"type":"image","value":"https://img.alicdn.com/imgextra/i3/275766104/TB2P9mqjMDD8KJjy0FdXXcjvXXa_!!275766104.jpg","size":95469},{"type":"image","value":"https://img.alicdn.com/imgextra/i4/275766104/TB2_X0jjRDH8KJjSszcXXbDTFXa_!!275766104.jpg","size":65707},{"type":"image","value":"https://img.alicdn.com/imgextra/i2/275766104/TB2dmH4ikfb_uJjSsrbXXb6bVXa_!!275766104.jpg","size":60133},{"type":"image","value":"https://img.alicdn.com/imgextra/i4/275766104/TB2zO5ajIbI8KJjy1zdXXbe1VXa_!!275766104.jpg","size":68576}],"globalStock":{"value":"globalStock_0"},"paymentMode":{"value":"buyNow"},"imageVideo":[{"itemId":563162633309,"interactiveId":0}],"imageVideoType":{"value":0},"saleProp":{"p-30182":[{"value":5728564,"text":"标准版"}],"p-122216883":[{"value":27889,"text":"简体中文"}]},"catProp":{"p-122216578":{"value":327195002,"text":"Nitendo Eshop"},"p-165336971":{"value":339517241,"text":"账号注册\\备份"}},"title":"SWITCH游戏 NS游戏 中文 沙漠老鼠团 数字版 出租 租赁 游戏","images":[{"url":"//img.alicdn.com/imgextra/i3/275766104/TB20Wx7jMvD8KJjy0FlXXagBFXa_!!275766104.jpg"},{"url":"//img.alicdn.com/imgextra/i3/275766104/TB2P9mqjMDD8KJjy0FdXXcjvXXa_!!275766104.jpg"},{"url":"//img.alicdn.com/imgextra/i4/275766104/TB2_X0jjRDH8KJjSszcXXbDTFXa_!!275766104.jpg"},{"url":"//img.alicdn.com/imgextra/i2/275766104/TB2dmH4ikfb_uJjSsrbXXb6bVXa_!!275766104.jpg"},{"url":"//img.alicdn.com/imgextra/i4/275766104/TB2zO5ajIbI8KJjy1zdXXbe1VXa_!!275766104.jpg"}]}'
            }
			$.ajax({
			  type: 'POST',
			  url: "/sell/submit.htm",
			  data: j,
			  success: function(data){
				  console.info(data);
			  }
			});
        });*/

        $(".btn-mobile-change").on("click", function () {
            changeMob();
        });
        $(".btn-rate").on("click", function () {
            $("[name='orderid']").each(function(){
                window.open("https://rate.taobao.com/remarkBuyer.jhtml?tradeID="+$(this).val());
            });
        });
        //如果回来了编辑页面，调用手机端编辑方法
        if (GM_getValue("page") == "1") {
            GM_setValue("page", "0");
            $(".btn-mobile-change").click();
        }
    } else if (location.host.indexOf("sell.xiangqing.taobao.com") >= 0) {
        debug("i am in sell.xiangqing");
        // 商品详情编辑-导入页面-iframe中
        if ($(".sitenav .header-left").length > 0) {
            // 执行移动到“”导入“”-》下拉
            debug("move to 导入 list show");
            var curCheck = ".next-btn-text";
            safeWaitFunc(curCheck, function () {
                var evObj;
                var toObj = document.querySelector(curCheck); // 到“导入”按钮上
                evObj = document.createEvent('MouseEvents');
                evObj.initMouseEvent('mouseout', true, true, unsafeWindow, 1, 0, 0, 0, 0, false, false, false, false, 0, toObj);
                document.dispatchEvent(evObj);
                curCheck = ".next-menu-content .next-menu-submenu-item-popup.follow .next-menu-submenu-title";
                safeWaitFunc(curCheck, function () {
                    // 执行移动到“”导入详情“”-》下拉
                    debug("move to 导入详情 list2 show");
                    var evObj;
                    var toObj = document.querySelector(curCheck); // 到“导入详情”按钮上
                    evObj = document.createEvent('MouseEvents');
                    evObj.initMouseEvent('mouseout', true, true, unsafeWindow, 1, 0, 0, 0, 0, false, false, false, false, 0, toObj);
                    document.dispatchEvent(evObj);
                    curCheck = ".next-menu-content .next-menu-submenu-item-popup.follow .next-menu-wrapper li:nth-child(2)";
                    safeWaitFunc(curCheck, function () {
                        // 点击电脑导入按钮
                        debug("Click 电脑导入");
                        var toObj = document.querySelector(curCheck); // 到“导入电脑详情”按钮上
                        toObj.click();
                        curCheck = ".wdeDialog-content li:first-child";
                        safeWaitFunc(curCheck, function () {
                            nextClick(curCheck);
                        });
                    });
                });
            });
        } else {
            debug("按钮还未加载");
        }
    } else if (window.location.href == ("https://item.taobao.com/item.htm?id="+pageId) && GM_getValue("page") == "1") {
        //如果查看页面检查page是1，就跳回编辑页面
        window.location.href = "https://item.publish.taobao.com/sell/publish.htm?itemId="+pageId;
    }

    function changeMob(force) {
        // 点击编辑进入编辑模式，然后跳转页面，GM等待页面的监察然后执行，同时这里启动线程等待编辑页面结束，然后回来后提交数据
        GM_setValue("pageFlag", "start");
        window.scrollBy(0, 300);
        $(".sell-mobile-detail-header-edit-btn").click();
        debug("等待其他处理运行");
        setTimeout(function () {
            var tt = setInterval(function () {
                debug(GM_getValue("pageFlag", "start"));
                if (GM_getValue("pageFlag", "start") == "end") {
                    debug("完整提交结束");
                    $("#button-submit").click(); // 这里没有执行吗？好像是
                    clearInterval(tt);
                }
            }, 200);
        }, 500);
    }

    function nextClick(curCheck) {
        // 点击选择全图模式
        debug("Click 全图模式");
        var toObj = document.querySelector(curCheck);
        toObj.click();
        setTimeout(function () {
            // 按钮提交第一次
            debug("Click 首次提交");
            var toObj = document.querySelector(".next-dialog button.next-btn-primary");
            toObj.click();
            curCheck = ".next-dialog button.next-btn-primary";
            safeWaitFunc(curCheck, function () {
                // 点击确认按钮，表示完成
                var toObj = document.querySelector(curCheck);
                toObj.click();
                curCheck = ".header-tab:contains('完成编辑')";
                safeWaitFunc(curCheck, function () {
                    // 返回回来准备提交数据
                    $(curCheck).click();
                    unsafeWindow.onbeforeunload = function(){
                        GM_setValue("pageFlag", "end");
                    };
                    window.onbeforeunload = function(){
                        GM_setValue("pageFlag", "end");
                    };
                    unsafeWindow.onunload = function(){
                        GM_setValue("pageFlag", "end");
                    };
                    window.onunload = function(){
                        GM_setValue("pageFlag", "end");
                    };
                });
            });
        }, 50);
    }

    function safeWaitFunc(waitSelector, funcBody) {
        var tt = setInterval(function () {
            console.info($(waitSelector));
            if ($(waitSelector).length > 0) {
                clearInterval(tt);
                funcBody();
            }
        }, 20);
    }
})();
