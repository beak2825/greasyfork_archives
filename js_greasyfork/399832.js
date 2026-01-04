// JavaScript source code
// ==UserScript==
// @name    星柚助手-奈何
// @version 20200403004
// @description  杭州星柚--星柚综合业务平台 Chrome浏览器插件 对外系统扩展插件；
// @description  支持页面元素隐藏等扩展功能，禁止外传；
// @description  2020-04-07 新增拼多多营销中心报名记录列表抓取并自动上传
// @author      陈彪
// @home-url     http://www.lliuliangjia.com:10000/
// @supportURL   http://www.lliuliangjia.com:10000/
// @namespace    http://www.lliuliangjia.com:10000/
// @connect     www.lliuliangjia.com
// @connect     192.168.3.55
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_download
// @grant       GM_addStyle
// @grant       GM_openInTab
// @license      MIT
// @date        2019-10-01
// @modified     2020-03-28
// @match       http://scm.ihzxy.com/*
// @match       https://mms.pinduoduo.com/*
// @match       http://www.lliuliangjia.com:10000/*
// @match       http://192.168.3.55:10000/*
// @require     https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js

// @run-at      document-end
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @namespace undefined
// @downloadURL https://update.greasyfork.org/scripts/399832/%E6%98%9F%E6%9F%9A%E5%8A%A9%E6%89%8B-%E5%A5%88%E4%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/399832/%E6%98%9F%E6%9F%9A%E5%8A%A9%E6%89%8B-%E5%A5%88%E4%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var window_url = window.location.href;
    var website_host = window.location.host;
    // Your code here...
    var Config = {
        AjaxAPI: "https://www.lliuliangjia.com:10001/index.ashx",
        TablePageSize: function () {
            return 10
        },
        ContentType: "application/x-www-form-urlencoded; charset=UTF-8"
    }
    //http://www.lliuliangjia.com:10000/script/xdate.js
    var Ajax = {
        Get: function (data, callback) {
            var url = Config.AjaxAPI + "?r=1";
            //拼接请求的字符串
            if (data != null) {
                $.each(data, function (m, n) {
                    url += "&" + m + "=" + n;
                });
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "Content-Type": Config.ContentType },
                onload: function (response) {
                    var status = response.status;
                    if (status == 200 || status == '200') {
                        if (callback) {
                            callback(response.responseText);
                        }
                    } else if (status === 4 && status !== 200) {
                        alert("查询失败，请重试 " + status);
                    }
                }
            });
        },
        Post: function (data, callback) {
            var dataText = "";
            if (data != null) {
                $.each(data, function (m, n) {
                    if (dataText == "") {
                        dataText += m + "=" + JSON.stringify(n);
                    } else {
                        dataText += "&" + m + "=" + JSON.stringify(n);
                    }
                });
            }
            var url = Config.AjaxAPI;
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                dataType: "json",
                data: dataText,
                headers: { "Content-Type": Config.ContentType },
                onload: function (response) {
                    var status = response.status;
                    if (status == 200 || status == '200') {
                        if (callback) {
                            callback(response.responseText);
                        }
                    } else if (status === 4 && status !== 200) {
                        alert("查询失败，请重试 " + status);
                    }
                }
            });
        },
        AjaxPost: function (data, callback) {
            var url = Config.AjaxAPI;
            $.ajax({
                url: url,
                data: JSON.stringify(data),
                dataType: "json",
                "type": "POST",
                "contentType": Config.ContentType,
                "success": function (html) {
                    if (callback) {
                        callback(html);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                }
            });
        }
    }

    //BPF解析
    var BpfAnalysis = {};
    //SCM解析
    var ScmAnalysis = {};
    //拼多多解析
    var PddAnalysis = {};
    //工具类
    var Tools = {};
    //随机排序
    Tools.Fn = function (n) {
        var array = new Array();
        for (var i = 0; i < n; i++) {
            var rnd = Math.floor(Math.random() * (n));
            if (Tools.IsIncluded(rnd, array)) {
                i--;
            }
            else {
                array.push(rnd);
            }
        }
        return array;
    }
    Tools.IsIncluded = function (element, array) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i] == element) {
                return true;
            }
        }
        return false;
    }

    PddAnalysis.NeedData = [];
    PddAnalysis.NeedTitleData = [];
    ScmAnalysis.GenericClassData = null;
    ScmAnalysis.TempGenericClassData = null;
    ScmAnalysis.GetGenericClassData = function (callback) {
        if (window_url.indexOf("scm.ihzxy.com") == -1 || website_host != "scm.ihzxy.com") {
            return;
        }
        //iframe中不再执行，可以跳过自有系统里面的iframe嵌套验证
        if (window.top != window.self) {
            return;
        }
        Ajax.Get({
            type: "XY.SCM.ChromePlug.GenericClass"
        }, function (res) {
            var returnData = JSON.parse(res);
            if (returnData.ReturnCode == 0) {
                ScmAnalysis.GenericClassData = returnData.Data;
                if (callback) {
                    callback();
                }
            } else {
                alert("星柚数据加载失败，请联系IT");
            }
        });
    };
    ScmAnalysis.ModifyPage = function () {
        var li = $(".uf-mutitab").find("li.active");
        var tabId = $(li).data("tabid");
        var tabName = $($(li).find("lable")[0]).text();
        var iframe = document.getElementsByClassName("uf-iframe");
        if (iframe.length >= 1) {
            //绑定iframe的加载完成事件
            iframe[iframe.length - 1].onload = function () {
                ScmAnalysis.BindSpecialContent(tabId);
                $.each(ScmAnalysis.GenericClassData,
                    function (m, n) {
                        if (n.Name == "SCM标签页") {
                            //1.先找出最外层的SCM相关属性
                            if (n.ChildList.length > 0) {
                                $.each(n.ChildList,
                                    function (x, y) {
                                        if (y.Extra1 == tabId) {
                                            //2.再找出当前页面的标签
                                            if (y.ChildList.length > 0) {
                                                $.each(y.ChildList,
                                                    function (a, b) {
                                                        //3.循环处理这个标签页下面的每一种请求
                                                        if (b.ChildList.length > 0) {
                                                            switch (b.Name) {
                                                                case "隐藏元素":
                                                                    ScmAnalysis.HideElementsByData(b.ChildList, tabId);
                                                                    break;
                                                                case "提交验证":
                                                                    ScmAnalysis.CheckSubmitByData(b.ChildList, tabId);
                                                                    break;
                                                                case "默认值":
                                                                    ScmAnalysis.DefaultValueByData(b.ChildList, tabId);
                                                                    break;
                                                                case "添加样式":
                                                                    ScmAnalysis.AddClassElementsByData(b.ChildList, tabId);
                                                                case "特殊模块":
                                                                    ScmAnalysis.SpecialElementsByData(b.ChildList, tabId);
                                                                    break;
                                                                default:
                                                                    break;
                                                            }
                                                        }
                                                    });
                                            }
                                        }
                                    });
                            }
                        }
                    });
                Msg.hide(_ufTabMask);
            };
        }
    };
    ScmAnalysis.HideElementsByData = function (data, tabId) {
        var con = $("#uftab-" + tabId).find("iframe").contents();
        $.each(data,
            function (m, n) {
                con.find("#" + n.Extra1).parents("." + n.Extra2).prev().hide();
                con.find("#" + n.Extra1).parents("." + n.Extra2).hide();
            });
    };
    ScmAnalysis.AddClassElementsByData = function (data, tabId) {
        var con = $("#uftab-" + tabId).find("iframe").contents();
        $.each(data,
            function (m, n) {
                con.find("#" + n.Name).parents("." + n.Extra1).removeClass(n.Extra1).addClass(n.Extra2);
            });
    };
    ScmAnalysis.DefaultValueByData = function (data, tabId) {
        var con = $("#uftab-" + tabId).find("iframe").contents();
        $.each(data,
            function (m, n) {
                con.find("#" + n.Extra1).val(n.Extra2);
            });
    };
    ScmAnalysis.CheckSubmitByData = function (data, tabId) {
        var con = $("#uftab-" + tabId).find("iframe").contents();
        $.each(data,
            function (m, n) {
                var btn = con.find("[data-amid='" + n.Extra1 + "']")[0];
                var fn = btn.onclick;
                if (fn) {
                    btn.onclick = function () {
                        if (con.find("#" + n.Extra2).val() == null || con.find("#" + n.Extra2).val() == "") {
                            alert("【星柚验证】请填写 " + n.Name);
                            return;
                        } else {
                            fn();
                        }
                    }
                }
            });
    };
    ScmAnalysis.SpecialElementsByData = function (data, tabId) {
        $.each(data,
            function (m, n) {
                switch (n.Name) {
                    case "标题热搜":
                        ScmAnalysis.BindSpecialContent(n.ChildList, tabId);
                        break;
                    default:
                        break;
                }
            });
    };
    ScmAnalysis.BindSpecialContent = function (data, tabId) {
        var con = $("#uftab-" + tabId).find("iframe").contents();
        switch (tabId) {
            case "modifySampleClothing":
                var titleHtml = "";
                titleHtml += '<div class="form-group basicGroup">';
                titleHtml +=
                    '<label class="control-label col-sm-2 lbnlp">热搜标题<br><a style="color:Red;cursor:pointer;" class="xy_specialGetHotWord" data-tabId="' +
                    tabId +
                    '" >点击获取热搜词</a></label>';
                titleHtml += '<div class="col-sm-10" id="xy_specialGetHotWordDiv">';
                titleHtml += '</div>';
                titleHtml += '</div>';
                ScmAnalysis.TempGenericClassData = data;
                con.find("#SmName").parents(".form-group").before(titleHtml);
                con.find(".xy_specialGetHotWord").on("click", ScmAnalysis.SpecialGetHotWordClick);
                break;
            case "modifyProduct":
                var titleHtml = "";

                titleHtml += '<div class="form-group basicGroup">';
                titleHtml +=
                    '<label class="control-label col-sm-2 lbnlp">热搜标题<br><a style="color:Red;cursor:pointer;" class="xy_specialGetHotWord" data-tabId="' +
                    tabId +
                    '" >点击获取热搜词</a></label>';
                titleHtml += '<div class="col-sm-10" id="xy_specialGetHotWordDiv">';
                titleHtml += '</div>';
                titleHtml += '</div>';
                ScmAnalysis.TempGenericClassData = data;
                con.find("#Name").parents(".form-group").before(titleHtml);
                con.find(".xy_specialGetHotWord").on("click", ScmAnalysis.SpecialGetHotWordClick);
                break;
            default:
                break;
        }
    };
    ScmAnalysis.SpecialGetHotWordClick = function () {
        var tabId = $(this).attr("data-tabId");
        var con = $("#uftab-" + tabId).find("iframe").contents();
        var ctgId = con.find("#CtgId").val();
        var seasonId = con.find("#SeasonId").val();
        var titleHtml = "";
        if (ctgId == "" || ctgId == null || seasonId == "" || seasonId == null) {
            alert("请先选择分类和季节");
            return;
        }
        var tempData = new Array();
        $.each(ScmAnalysis.TempGenericClassData, function (m, n) {
            if (n.Extra1.toUpperCase() == ctgId.toUpperCase() && n.Extra3.toUpperCase() == seasonId.toUpperCase()) {
                tempData.push(n);

            }
        });
        if (tempData.length >= 10) {
            for (var i = 0; i < 10; i++) {
                var n = tempData[i];
                titleHtml += '<button class="xy_specialBtn" data-btntype="pdttitle" data-tabId="' + tabId + '"   data-btnvalue="' + n.Name + '"  style="margin:2px;" type="button" class="btn btn-default btn-xs">' + (i + 1) + "." + n.Name + '</button>';
            }
            //10后面的随机排序，每次都不一样
            var number = Tools.Fn(tempData.length - 10);
            for (var i = 0; i < number.length; i++) {
                var n = tempData[number[i] + 10];
                titleHtml += '<button class="xy_specialBtn" data-btntype="pdttitle" data-tabId="' + tabId + '"   data-btnvalue="' + n.Name + '"  style="margin:2px;" type="button" class="btn btn-default btn-xs">' + (number[i] + 10) + "." + n.Name + '</button>';
            }
        }
        con.find("#xy_specialGetHotWordDiv").empty();
        con.find("#xy_specialGetHotWordDiv").append(titleHtml);
        con.find(".xy_specialBtn").on("click", ScmAnalysis.SpecialBtnClick);
    };
    ScmAnalysis.SpecialBtnClick = function () {
        var type = $(this).attr("data-btntype");
        var value = $(this).attr("data-btnvalue");
        var tabId = $(this).attr("data-tabId");
        var con = $("#uftab-" + tabId).find("iframe").contents();
        switch (tabId) {
            case "modifySampleClothing":
                switch (type) {
                    case "pdttitle":
                        var lastVal = con.find("#SmName").val();
                        con.find("#SmName").val(lastVal + value);
                        con.find("#NameCount").text((lastVal + value).length);
                        break;
                    default:
                        break;
                }
                break;
            case "modifyProduct":
                switch (type) {
                    case "pdttitle":
                        var lastVal = con.find("#Name").val();
                        con.find("#Name").val(lastVal + value);
                        con.find("#NameCount").text((lastVal + value).length);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

    };
    PddAnalysis.GetGoodsListClick = function () {
        if (confirm("点击  确定  开始处理数据，系统提示处理完成之前请勿关闭该页面，否则会造成数据缺失！")) {
            $("#xy_getGoodsList").attr("disabled", "disabled");
            $("#xy_getGoodsList").text("处理中。。");
            $("#xy_getGoodsList").css("background-color", "#dedccc");
            $("#xy_getGoodsList").css("border", "1px solid red");
            Config.AjaxAPI = "https://mms.pinduoduo.com/vodka/v2/mms/query/display/mall/goodsList";
            Config.ContentType = "application/json; charset=utf-8";
            //先根据第一页第一条获取出来总数据条数
            var data = { "page": 1, "size": 1, "is_onsale": 1, "sold_out": 0 };
            var total = 0;
            Ajax.AjaxPost(data, function (res) {
                var pageSize = 100;
                total = res.result.total;
                console.log(total);
                var pageCount = Math.ceil(total / pageSize);
                //获取出来总条数之后再分页去获取每页的编号，货号，3个价格，累计销量，30日销量
                PddAnalysis.GetGoodsListData(1, pageSize, pageCount, total);
            });
        }
    };
    PddAnalysis.GetGoodsListData = function (pageNo, pageSize, sumPage, total) {
        var shopName = $($(".user-name").find(".name")[0]).text();
        var shopId = $($(".user-name").find(".id")[0]).text();
        $("#xy_getGoodsList").text("处理：" + pageNo + "/" + sumPage);
        //         if (pageNo == sumPage) {
        //             pageSize = total - ((pageNo - 1) * pageSize);
        //         }
        Config.AjaxAPI = "https://mms.pinduoduo.com/vodka/v2/mms/query/display/mall/goodsList";
        Config.ContentType = "application/json; charset=utf-8";
        var data = { "page": pageNo, "size": pageSize, "is_onsale": 1, "sold_out": 0 };
        Ajax.AjaxPost(data, function (r) {
            $.each(r.result.goods_list, function (m, n) {
                var sku_group_price = 0;
                var sku_price = 0;
                var origin_sku_group_price = 0;
                if (n.sku_group_price.length > 1) {
                    sku_group_price = n.sku_group_price[0];
                }
                if (n.sku_price.length > 1) {
                    sku_price = n.sku_price[0];
                }
                if (n.origin_sku_group_price.length > 1) {
                    origin_sku_group_price = n.origin_sku_group_price[0];
                }
                PddAnalysis.NeedData.push({
                    "shopName": shopName,
                    "shopId": shopId,
                    "id": n.id,
                    "out_goods_sn": n.out_goods_sn,
                    "sku_group_price": sku_group_price,
                    "sku_price": sku_price,
                    "origin_sku_group_price": origin_sku_group_price,
                    "sold_quantity": n.sold_quantity,
                    "sold_quantity_for_thirty_days": n.sold_quantity_for_thirty_days,
                    "quantity": n.quantity,
                    "is_onsale": n.is_onsale,
                    "fav_cnt": n.fav_cnt,
                    "goods_name": "",
                    "created_at": n.created_at
                });
                PddAnalysis.NeedTitleData.push({
                    "shopId": shopId,
                    "id": n.id,
                    "goods_name": n.goods_name
                });
            });
            if (pageNo < sumPage) {
                PddAnalysis.GetGoodsListData(pageNo + 1, pageSize, sumPage, total);
            }
            if (pageNo == sumPage) {
                $("#xy_getGoodsList").text("上传数据中...");
                PddAnalysis.SubmitGoodsList();
            }
            //console.log(needData);
        });
    };
    PddAnalysis.SubmitGoodsList = function () {
        //获取的数据POST到系统，再插入数据库
        Config.AjaxAPI = "http://www.lliuliangjia.com:10000/index.ashx?type=XY.SCM.ChromePlug.AddPddGoodsList";
        Config.ContentType = "application/x-www-form-urlencoded; charset=UTF-8"
        Ajax.Post({ "data": PddAnalysis.NeedData }, function (res) {
            //console.log(res);
            var rst = JSON.parse(res);
            if (rst.ReturnCode == 0) {
                $("#xy_getGoodsList").removeAttr("disabled");
                $("#xy_getGoodsList").text("BPF");
                $("#xy_getGoodsList").css("background-color", "#e5d64f");
                $("#xy_getGoodsList").css("border", "none");
                alert("数据处理完成！请登录星柚系统查看");

                //$("#xy_getGoodsList").text("更新标题");
                //PddAnalysis.SubmitGoodsTitleList();
            } else {
                alert("系统错误，请联系开发！" + rst.ReturnMsg);
            }
        });
    };
    PddAnalysis.SubmitGoodsTitleList = function () {
        //获取的数据POST到系统，再插入数据库
        Config.AjaxAPI = "http://www.lliuliangjia.com:10000/index.ashx?type=XY.SCM.ChromePlug.UpdatePddGoodsTitleList";
        Config.ContentType = "application/x-www-form-urlencoded; charset=UTF-8"
        Ajax.Post({ "data": PddAnalysis.NeedTitleData }, function (res) {
            //console.log(res);
            var rst = JSON.parse(res);
            if (rst.ReturnCode == 0) {
                $("#xy_getGoodsList").removeAttr("disabled");
                $("#xy_getGoodsList").text("BPF");
                $("#xy_getGoodsList").css("background-color", "#e5d64f");
                $("#xy_getGoodsList").css("border", "none");
                alert("数据处理完成！请登录星柚系统查看");
            } else {
                alert("系统错误，请联系开发！" + rst.ReturnMsg);
            }
        });
    };
    PddAnalysis.GetMmsChaClick = function () {
        //var now = new XDate().toString("yyyy-MM-dd");
        //var lastMonthFirstDay = new XDate(now).addMonths(-1).setDate(1).toString("yyyy-MM-dd");
        //var lastMonthFinalDay = new XDate(now).setDate(1).addDays(-1).toString("yyyy-MM-dd");
        //var nowMonthFirstDay = new XDate(now).setDate(1).toString("yyyy-MM-dd");
        //var nowMonthSub2Day = new XDate(now).addDays(-3).toString("yyyy-MM-dd");
        //var nowMonthNowDay = new XDate(now).addDays(-1).toString("yyyy-MM-dd");
        //var mode = prompt("请在下方输入数据下载模式！\n1.上个月全月数据(" + lastMonthFirstDay + "~" + lastMonthFinalDay + ")\n2.当月数据-2天前(" + nowMonthFirstDay + "~" + nowMonthSub2Day + ")\n3.当月数据(" + nowMonthFirstDay + "~" + nowMonthNowDay + ")", "")
        //if (mode != null && mode != "") {
        //    alert(new XDate());
        //    //$("#xy_getMmsChat").attr("disabled", "disabled");
        //    //$("#xy_getMmsChat").text("处理中。。");
        //    //$("#xy_getMmsChat").css("background-color", "#dedccc");
        //    //$("#xy_getMmsChat").css("border", "1px solid red");
        //    //Config.AjaxAPI = "https://mms.pinduoduo.com/chats/csReportDetail?starttime=1585065600&endtime=1585065600";
        //    //Config.ContentType = "application/json; charset=utf-8";
        //    //这个请求现在是不用分页的
        //    //var data = { "page": 1, "size": 1, "is_onsale": 1, "sold_out": 0 };
        //    //var total = 0;
        //    //Ajax.AjaxPost(data, function (res) {
        //    //    var pageSize = 100;
        //    //    total = res.result.total;
        //    //    console.log(total);
        //    //    var pageCount = Math.ceil(total / pageSize);
        //    //    //获取出来总条数之后再分页去获取每页的编号，货号，3个价格，累计销量，30日销量
        //    //    PddAnalysis.GetGoodsListData(1, pageSize, pageCount, total);
        //    //});
        //}
    };

    ScmAnalysis.init = function () {
        ScmAnalysis.GetGenericClassData(function () {
            //监听顶部菜单栏的增加事件，减少不触发
            $(".ufxbox").bind("DOMNodeInserted", ScmAnalysis.ModifyPage);
        });
    };
    BpfAnalysis.init = function () {
        if (window_url.indexOf("www.lliuliangjia.com") == -1 &&
            website_host != "www.lliuliangjia.com" &&
            window_url.indexOf("192.168.3.55") == -1 &&
            website_host != "192.168.3.55") {
            return;
        }
        if (window.top != window.self) {
            return;
        }
        $(".brand-logo").append("<span class='hide' id='ChromePlug'>1</span>");
    };
    PddAnalysis.init = function () {
        if (window_url.indexOf("mms.pinduoduo.com/goods/goods_list") == -1 && window_url.indexOf("mms.pinduoduo.com/mms-chat/overview/merchant") == -1 && window_url.indexOf("mms.pinduoduo.com/act/register_record") == -1) {
            return;
        }
        //iframe中不再执行，可以跳过自有系统里面的iframe嵌套验证
        if (window.top != window.self) {
            return;
        }
        if (window_url.indexOf("mms.pinduoduo.com/goods/goods_list") != -1) {
            $("#root").bind("DOMNodeInserted", function () {
                if ($("#XyDiv").html() != null) {
                    $("#root").unbind();
                } else {
                    var html = '<div id="XyDiv"><div class="" style="margin-left:15px;"><div class="Badge_container_290"><a><button id="xy_getGoodsList" data-testid="beast-core-button" class="BTN_outerWrapper_290 BTN_gray_290 BTN_medium_290 BTN_outerWrapperBtn_290" type="button" style="background-color: #e5d64f;"><span>BPF</span></button></a></div></div></div>';
                    $(".batch-set-size-container").after(html);
                    var con = $("#root").contents();
                    con.find("#xy_getGoodsList").on("click", PddAnalysis.GetGoodsListClick);
                }
            });
        }
        if (window_url.indexOf("mms.pinduoduo.com/mms-chat/overview/merchant") != -1) {
            $("#root").bind("DOMNodeInserted", function () {
                if ($("#XyDiv").html() != null) {
                    $("#root").unbind();
                } else {
                    var html = '<div id="XyDiv"><a id="xy_getMmsChat" style="margin-left: 20px;background-color: #e5d64f;    width: 91px;height: 28px;text-align: center;line-height: 28px;border-radius: 3px;border: 1px solid #19e;font-size: 14px;cursor: pointer;color: black;display: block;" class="">BPF</a> </div>';
                    $(".pdd-btn-download").before(html);
                    var con = $("#root").contents();
                    con.find("#xy_getMmsChat").on("click", PddAnalysis.GetMmsChaClick);
                }
            });
        }

        if (window_url.indexOf("mms.pinduoduo.com/act/register_record") != -1) {
            $("#root").bind("DOMNodeInserted", function () {
                if ($("#XyDiv").html() != null) {
                    $("#root").unbind();
                } else {
                    var html = '<div id="XyDiv"><a id="xy_getRegisterRecord" style="margin-left: 20px;background-color: #e5d64f;    width: 91px;height: 28px;text-align: center;line-height: 28px;border-radius: 3px;border: 1px solid #19e;font-size: 14px;cursor: pointer;color: black;display: block;" class="">BPF</a> </div>';
                    $(".pdd-btn-download").before(html);
                    var con = $("#root").contents();
                    con.find("#xy_getRegisterRecord").on("click", PddAnalysis.GetMmsChaClick);
                }
            });
        }
    };


    //SCM部分初始化执行
    ScmAnalysis.init();
    //BPF部分初始化执行
    BpfAnalysis.init();
    //拼多多部分初始化执行
    PddAnalysis.init();
})();