// ==UserScript==
// @name    星柚助手
// @version 20251230001
// @description  杭州星柚--星柚综合业务平台 Chrome浏览器插件 对外系统扩展插件；
// @author      沉香
// @home-url     http://ihzxy.com
// @supportURL   http://ihzxy.com
// @namespace    http://ihzxy.com
// @connect     www.lliuliangjia.com
// @connect     lliuliangjia.com
// @connect     ihzxy.com
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_download
// @grant       GM_addStyle
// @grant       GM_openInTab
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @license      MIT
// @date        2019-10-01
// @modified     2024-04-22
// @match       https://www.2haohr.com/*
// @match       https://2haohr.com/*
// @match        https://team.qq.com/*
// @match        https://agentseller.temu.com/*
// @match        https://seller.kuajingmaihuo.com/*
// @match        https://www.jeoms.com/*
// @match        https://www.mabangerp.com/*
// @match        https://yunbi-public.mabangerp.com/*
// @match        https://liveplatform.taobao.com/restful/index/data/transaction
// @match        https://buyin.jinritemai.com/dashboard/live/*
// @match        https://pim.leycloud.com/product/*
// @match        https://pdc-portal.vip.com/*
// @match        https://pos.dianplus.cn/*
// @require  http://code.jquery.com/jquery-3.7.1.min.js
// @require  https://unpkg.com/coco-message/coco-message.min.js
// @require  https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js
// @resource bootstrapCSS https://oss.ihzxy.com/program/web/css/bootstrap.css
// @run-at      document-end
// @namespace undefined
// @downloadURL https://update.greasyfork.org/scripts/393512/%E6%98%9F%E6%9F%9A%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/393512/%E6%98%9F%E6%9F%9A%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    var window_url = window.location.href;
    // 保存原始的XMLHttpRequest.open方法
    var originalOpen = XMLHttpRequest.prototype.open;
    var website_host = window.location.host;
    if (website_host.indexOf("dianplus.cn") === -1) {
        GM_addStyle(GM_getResourceText("bootstrapCSS"));
    }
    GM_addStyle(".popover{display: inline-table; } ul{padding-left:0px !important;} th,td{text-align: center;} .stockContnet thead tr th{color: #fff !important;background-color: #4f8edc !important;} .greenText{color:#27c24c;} .redText{color:#f05050;} .grayText{color:#c3c3c3;} .popover-body{padding: 12px;} .stockContnet td,th{padding:3px !important;}} a{text-decoration:none !important;} .w_500{width:500px;} .w_400{width:400px;} .w_300{width:300px;} .el-button--small, .el-button--small.is-round {padding: 3px 15px;} .deliverGoodsList-content .deliverGoodsList-tabs .tabBox .tab-picture{min-height: auto !important;} .el-button+.el-button{margin-left:0px;} .deliverGoodsList-tabs{margin-left:10px !important;} .deliverGoodsList-content{	padding-top: 0px !important;padding-bottom: 64px !important;} .choiceList-content,.tabBox{border:0px !important;padding: 0 4px 0px 0px !important;} .choiceList-content .el-tabs{margin-left: -32px !important;} .choice-search,.deliverGoodsList-search{margin: 0px !important;} .choice-btns,.deliverGoodsList-btns{margin: 0px !important;} .tabBox .tab-picture div:last-child p{height:17px !important;}");
    // Your code here...
    var Config = {
        AjaxAPI: "https://www.lliuliangjia.com:10001/index.ashx", TablePageSize: function () {
            return 10;
        }, ContentType: "application/x-www-form-urlencoded; charset=UTF-8",
    };
    var Ajax = {
        Get: function (data, callback) {
            var url = Config.AjaxAPI + "?r=1";
            if (data != null) {
                $.each(data, function (m, n) {
                    url += "&" + m + "=" + n;
                });
            }
            GM_xmlhttpRequest({
                method: "GET", url: url, headers: { "Content-Type": Config.ContentType }, onload: function (response) {
                    var status = response.status;
                    if (status == 200 || status == "200") {
                        if (callback) {
                            callback(response.responseText);
                        }
                    } else if (status === 4 && status !== 200) {
                        alert("查询失败，请重试 " + status);
                    }
                },
            });
        }, Post: function (data, callback) {
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
                    if (status == 200 || status == "200") {
                        if (callback) {
                            callback(response.responseText);
                        }
                    } else if (status === 4 && status !== 200) {
                        alert("查询失败，请重试 " + status);
                    }
                },
            });
        }, AjaxPost: function (data, headers, callback) {
            var url = Config.AjaxAPI;
            $.ajax({
                url: url,
                data: JSON.stringify(data),
                dataType: "json",
                type: "POST",
                headers: headers,
                contentType: Config.ContentType,
                success: function (html) {
                    if (callback) {
                        callback(html);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(errorThrown);
                },
            });
        },
    };

    //2 号人事部解析
    var HaoHrFunctions = {
        Init: function () {
            HaoHrFunctions.GetLoginToken();
        }, GetLoginToken: function () {
            var token = Tools.GetQueryString("token");
            if (token != null && token.length > 0) {
                var tokenData = JSON.stringify({ token: token, account: "" });
                document.cookie = "accesstoken=" + encodeURIComponent(tokenData) + ";domain=.2haohr.com; path=/";
                window.location.href = "https://2haohr.com/desk";
            }
        },
    };

    //电脑管家
    var TeamQQ = {
        Init: function () {
            var r_box = '<div id="xybutton" style="margin-top: 3px;color: #e5d64f;font-weight: bold;height: 42px;display: flex;width: 140px;border: 0px;border-radius: 20px;cursor: pointer;font-size: 16px;position: absolute;z-index: 999;top: 0;right: 280px;justify-content: center;align-items: center;">抓取数据</div>';
            document.body.insertAdjacentHTML("beforeend", r_box);
            $("#xybutton").click(function () {
                var cookies = document.cookie;

                $.ajax({
                    url: "https://lliuliangjia.com:10001/index.ashx?type=XY.HR.HaoHr.GetComputerButlerTokenService", // 请求的URL
                    method: "POST", // 请求方法，可以是GET、POST等
                    data: { token: cookies }, // 发送到服务器的数据
                })
                    .done(function (response) {
                        // 成功回调
                        console.log("Ajax请求成功，响应为:", response);
                        alert(JSON.parse(response).ReturnMsg);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // 失败回调
                        console.log("Ajax请求失败: ", textStatus);
                    });
            });
        },
    };

    //拼多多 temu
    var Temu = {
        Init: function () {
            var body = document.body;
            Temu.ShowHideNoticeBtn();
            Temu.BindStockView();
        }, //每秒监测页面是不是有弹窗，有的话就增加隐藏全部弹窗的按钮
        ShowHideNoticeBtn() {
            // 设置一个定时器，每1秒调用一次
            setInterval(function () {
                var modals = document.querySelectorAll('[data-testid="beast-core-modal-body"]');
                if (modals.length <= 0) {
                    modals = document.querySelectorAll('[data-testid=""]');
                }
                modals.forEach((modal) => {
                    if (!modal.querySelector(".xyCloseAllbutton")) {
                        var closeDiv = document.createElement("span");
                        var html = '<div class="xyCloseAllbutton" style="color:red;background: #e5d64f;font-weight: bold;height: 32px;display: flex;width: 90px;border: 0px;border-radius: 4px;cursor: pointer;font-size: 13px;position: absolute;z-index: 999;top: 8px;right: 20px;justify-content: center;align-items: center;">关闭全部</div>';
                        closeDiv.innerHTML = html;
                        modal.appendChild(closeDiv);
                        $(".xyCloseAllbutton").unbind();
                        $(".xyCloseAllbutton").click(function () {
                            Temu.HideAllNotice();
                        });
                    }
                });
            }, 1000); // 1000毫秒 = 1秒
        }, //隐藏全部烦人的弹窗提示
        HideAllNotice: function () {
            // 选择所有具有 data-testid="beast-core-modal-mask" 的元素
            var masks = document.querySelectorAll('[data-testid="beast-core-modal-mask"]');
            if (masks.length <= 0) {
                masks = document.querySelectorAll('[data-testid=""]');
            }
            // 选择所有具有 data-testid="beast-core-modal" 的元素
            var modals = document.querySelectorAll('[data-testid="beast-core-modal"]');
            if (modals.length <= 0) {
                modals = document.querySelectorAll('[data-testid=""]');
            }
            // 遍历这些元素并隐藏它们
            masks.forEach((mask) => {
                mask.style.display = "none";
            });

            modals.forEach((modal) => {
                modal.style.display = "none";
            });
        }, //查找页面可能是 spu skc sku的元素，并绑定显示库存的按钮
        BindStockView: function () {
            setInterval(function () {
                var allDivs = [];
                var findSignText = ["SKC货号", "SKC 货号", "SKU货号", "SKU 货号", "货号",];
                // var findSignText = ["货号"];
                $.each(findSignText, function (m, n) {
                    allDivs = allDivs.concat(Tools.FindDivByText(n));
                });
                allDivs.forEach((div) => {
                    // 获取目标div后面的同级div
                    // const nextDiv = div.nextElementSibling;
                    // if (nextDiv && nextDiv.tagName.toLowerCase() === 'div') {
                    if (!div.querySelector(".xyStockView")) {
                        var newSpan = document.createElement("span");
                        // 为新的 li 元素设置一些内容
                        var html = "";
                        var text = "";
                        var divText = div.innerText;
                        if (divText.indexOf(":") != -1 || divText.indexOf("：") != -1) {
                            text = divText.split(":")[1];
                            if (text == null || text.length == 0) {
                                text = divText.split("：")[1];
                            }
                        }
                        text = text.trimStart().trimEnd();
                        if (text != null && text.length > 0) {
                            html += "<span data-toggle='popover' data-text='" + text + "' class='xyStockView' style='color:white;background:#e5d64f;width: 18px;height: 18px;font-size: 10px;border-radius: 10px;display: inline-flex;line-height: 10px;justify-content: center;align-items: center;cursor:pointer;'>库</span>";
                            newSpan.innerHTML = html;
                            // div.nextElementSibling.appendChild(newSpan);
                            div.appendChild(newSpan);
                            //因为是定时器循环绑定的，导致 popover  shown.bs.popover 都会被注册多次，所以要先 unbind 全部的事件
                            $(".xyStockView").unbind();

                            $(".xyStockView").popover({
                                title: text + " 库存明细",
                                trigger: "hover",
                                html: true,
                                content: "<div class='w_500' id='stockContnet_" + text + "'></div>",
                            });

                            $(".xyStockView").on("show.bs.popover", function () {
                                // 保存对当前元素的引用
                                var currentElement = $(this);
                                var stockHtml = "";
                                Config.AjaxAPI = "https://www.lliuliangjia.com:10001/index.ashx?type=XY.BPF.Service.GetOmsInventoryInfoService&code=" + currentElement.data("text");
                                var data = {};
                                var total = 0;

                                Ajax.AjaxPost(data, null, function (res) {
                                    var colors = [];
                                    var sizes = [];
                                    $.each(res.Data, function (m, n) {
                                        var colorStr = n.skuName.split(";")[0];
                                        var sizeStr = n.skuName.split(";")[1];
                                        if (colors.indexOf(colorStr) == -1) {
                                            colors.push(colorStr);
                                        }
                                        if (sizes.indexOf(sizeStr) == -1) {
                                            sizes.push(sizeStr);
                                        }
                                    });

                                    var stockContent = "";
                                    stockContent += "<div>";

                                    stockContent += "<div style='text-align: right;margin-right: 4px;margin-bottom: 2px;'>";
                                    stockContent += "<span class='greenText'>共享仓</span> <span class='grayText'>/</span> <span class='redText'>销退仓</span>";
                                    stockContent += "</div>";

                                    stockContent += "<div>";

                                    stockContent += "<table class='stockContnet table table-vcenter  table-hover table-condensed table-bordered  dataTable no-footer'>";
                                    stockContent += "<thead>";
                                    stockContent += "<tr>";
                                    stockContent += "<th rowspan='2'></th>";
                                    stockContent += "<th colspan='" + colors.length + "'>宇隆</th>";
                                    stockContent += "<th colspan='" + colors.length + "'>义乌</th>";
                                    stockContent += "</tr>";

                                    stockContent += "<tr>";
                                    $.each(colors, function (m, color) {
                                        stockContent += "<th>" + color + "</th>";
                                    });
                                    $.each(colors, function (m, color) {
                                        stockContent += "<th>" + color + "</th>";
                                    });
                                    stockContent += "</tr>";
                                    stockContent += "</thead>";

                                    stockContent += "<tbody>";
                                    $.each(sizes, function (m, size) {
                                        stockContent += "<tr>";
                                        stockContent += "<td>" + size + "</td>";
                                        $.each(colors, function (m, color) {
                                            var greenQty = 0;
                                            var redQty = 0;
                                            $.each(res.Data, function (m, n) {
                                                if (n.skuName == color + ";" + size) {
                                                    if (n.virtualWarehouseName == "宇隆新仓-共享") {
                                                        greenQty = n.saleable;
                                                    }
                                                    if (n.virtualWarehouseName == "宇隆销退仓-共享") {
                                                        redQty = n.saleable;
                                                    }
                                                }
                                            });
                                            stockContent += "<td><span class='greenText'>" + (greenQty == 0 ? "-" : greenQty) + "</span> <span class='grayText'>/</span> <span class='redText'>" + (redQty == 0 ? "-" : redQty) + "</span></td>";
                                        });
                                        $.each(colors, function (m, color) {
                                            var greenQty = 0;
                                            var redQty = 0;
                                            $.each(res.Data, function (m, n) {
                                                if (n.skuName == color + ";" + size) {
                                                    if (n.virtualWarehouseName == "义乌仓库-共享") {
                                                        greenQty = n.saleable;
                                                    }
                                                    if (n.virtualWarehouseName == "义乌销退仓-共享") {
                                                        redQty = n.saleable;
                                                    }
                                                }
                                            });
                                            stockContent += "<td><span class='greenText'>" + (greenQty == 0 ? "-" : greenQty) + "</span> <span class='grayText'>/</span> <span class='redText'>" + (redQty == 0 ? "-" : redQty) + "</span></td>";
                                        });
                                        stockContent += "</tr>";
                                    });
                                    stockContent += "</tbody>";

                                    stockContent += "</table>";

                                    stockContent += "</div>";

                                    stockContent += "</div>";
                                    $("#stockContnet_" + currentElement.data("text")).html(stockContent);
                                    //更新位置
                                    currentElement.popover("update");
                                });
                            });
                        }
                    }
                    // }
                });
            }, 1000); //
        }
    };

    //巨益 OMS
    var JeOms = {
        SkuInfo: [], Init: function () {
            JeOms.ListenPage();
        }, ListenPage: function () {
            var authorization = "";
            var requestUrl = "";
            var requestMethod = "";
            // 保存原始的XMLHttpRequest.setRequestHeader方法
            const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

            // 重写XMLHttpRequest.setRequestHeader方法
            XMLHttpRequest.prototype.setRequestHeader = function (header, value) {
                if (header == "Authorization") {
                    authorization = value;
                }
                // 调用原始的setRequestHeader方法来实际设置请求头
                originalSetRequestHeader.call(this, header, value);
            };

            // 保存原始的XMLHttpRequest.open方法
            const originalOpen = XMLHttpRequest.prototype.open;

            // 重写XMLHttpRequest.open方法
            XMLHttpRequest.prototype.open = function (method, url) {
                requestUrl = url;
                requestMethod = method;
                // 调用原始的open方法
                originalOpen.apply(this, arguments);
            };

            // 重写XMLHttpRequest.prototype.send
            const originalSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function (data) {
                var xhr = this;
                // 检查请求方法是否为GET
                if (requestMethod.toUpperCase() === "GET") {
                    console.log("GET请求拦截:", requestUrl);
                    if (requestUrl.indexOf("/web/api/base/expressAbnormalCause") != -1) {
                        //b2c 快递签收
                        const regex = /expressAbnormalCause\/([^\/]+)\/getByExpress/;
                        const match = regex.exec(requestUrl);
                        if (match) {
                            const kuaidiCode = match[1];
                            console.log("获取到当前扫描的快递单号:", kuaidiCode);
                        } else {
                            alert("未找到准确的快递单号！");
                        }
                    }
                    if (requestUrl.indexOf("/web/api/trade/return/type/EXPRESS_NO/keyWord") != -1) {

                        //b2c 退货扫描
                        const regex = /keyWord\/([^\/]+)/;
                        const match = regex.exec(requestUrl);
                        if (match) {
                            const kuaidiCode = match[1];
                            console.log("获取到当前扫描的快递单号:", kuaidiCode);
                        }

                        xhr.addEventListener("readystatechange", function () {
                            if (xhr.readyState === XMLHttpRequest.DONE && requestUrl.indexOf("/web/api/trade/return/type/EXPRESS_NO/keyWord") != -1) {
                                JeOms.SkuInfo = [];

                                // 请求完成，获取返回的数据
                                var responseData = xhr.responseText;
                                //在扫描完快递单号之后，立即获取返回数据中的 skuCode ，然后调用 DealOutOfStock 方法，获取具体的标签
                                var data = JSON.parse(responseData).data;

                                // debugger;
                                var skuCodes = [];
                                console.log(data.productSkus)
                                //先把所有的 skuCode 放到数组中
                                $.each(data.productSkus, function () {
                                    //验证去重
                                    if (skuCodes.indexOf(this.barcode) == -1) {
                                        skuCodes.push(this.barcode);
                                        console.log(this.barcode)
                                    }
                                });
                                // 监听 readystatechange 事件
                                $('input[placeholder="商品扫描: 规格编码/条码/唯一码"]')
                                    .on("keydown", function (event) {
                                        // 检查按下的键是否是回车键（keyCode 为 13）
                                        if (event.which === 13) {
                                            console.log("扫描了 SKU: " + $(this).val());
                                            var skuCode = $(this).val();
                                            if (skuCode != null && skuCode.length > 0) {
                                                if (JeOms.SkuInfo[skuCode] != null) {
                                                    JeOms.PlayAudio(JeOms.SkuInfo[skuCode]);
                                                }
                                            }
                                        }
                                    });
                                //循环 skucodes 检查退货原因
                                $.each(skuCodes, function (m, n) {
                                    $.each(data.refundApplyOrders, function (a, b) {
                                        $.each(b.details, function (x, y) {
                                            if (n == y.inSkuCode) {
                                                if (JeOms.CheckReturnReason(b.reason)) {
                                                    JeOms.AddToSkuInfo(n, "问题");
                                                } else {
                                                    $.ajax({
                                                        url: "https://lliuliangjia.com:10001/index.ashx?type=XY.PM.CommodityInfo.CheckGoods&Code=" + n, // 请求的URL
                                                        method: "POST", // 请求方法，可以是GET、POST等
                                                    })
                                                        .done(function (response) {
                                                            // 成功回调
                                                            console.log("Ajax请求成功，响应为:", response);
                                                            JeOms.AddToSkuInfo(n, JSON.parse(response).Data);
                                                            JeOms.PlayAudio(JeOms.SkuInfo[n]);
                                                        })
                                                        .fail(function (jqXHR, textStatus, errorThrown) {
                                                            // 失败回调
                                                            console.log("Ajax请求失败: ", textStatus);
                                                        });
                                                }
                                            }
                                        })
                                    });
                                });
                                JeOms.BindReturnSignToPage();
                            }
                        });
                    }
                } else if (requestMethod.toUpperCase() === "POST") {
                    if (requestUrl.indexOf("/api/vip/return/codeOrBarCode") != -1) {
                        // 唯品三退签收
                        xhr.addEventListener("readystatechange", function () {
                            if (xhr.readyState === XMLHttpRequest.DONE && requestUrl.indexOf("/api/vip/return/codeOrBarCode") != -1) {
                                JeOms.SkuInfo = [];
                                // 请求完成，获取返回的数据
                                var responseData = xhr.responseText;
                                //在扫描完快递单号之后，立即获取返回数据中的 skuCode ，然后调用 DealOutOfStock 方法，获取具体的标签
                                var data = JSON.parse(responseData).data;
                                $.ajax({
                                    url: "https://lliuliangjia.com:10001/index.ashx?type=XY.PM.CommodityInfo.CheckGoods&Code=" + data.barcode, // 请求的URL
                                    method: "POST", // 请求方法，可以是GET、POST等
                                })
                                    .done(function (response) {
                                        // 成功回调
                                        console.log("Ajax请求成功，响应为:", response);
                                        JeOms.AddToSkuInfo(data.barcode, JSON.parse(response).Data);
                                        JeOms.PlayAudio(JeOms.SkuInfo[data.barcode]);
                                        if ($(".mx-2").length > 0) {
                                            $.each($(".mx-2"), function (m, n) {
                                                if ($(n).text().indexOf("商品标记") != -1) {
                                                    $(n).html('商品标记：<span style="color:red">' + JeOms.SkuInfo[data.barcode] + "</span>");
                                                }
                                            });
                                        }
                                    })
                                    .fail(function (jqXHR, textStatus, errorThrown) {
                                        // 失败回调
                                        console.log("Ajax请求失败: ", textStatus);
                                    });
                            }
                        });
                    }
                }
                // 继续执行原始的send方法
                return originalSend.apply(this, arguments);
            };
        }, PlayAudio: function (type) {
            Tools.PlayAudio(`https://oss.ihzxy.com/audio/${type}.wav`);
        }, CheckReturnReason: function (reason) {
            var reasonSign = ["配件", "破损", "污渍", "质量", "瑕疵", "开线", "变形"];
            var isNeedNotice = false;
            for (var i = 0; i < reasonSign.length; i++) {
                if (reason.indexOf(reasonSign[i]) !== -1) {
                    isNeedNotice = true;
                    break; // 如果找到匹配项，就不需要继续循环
                }
            }
            return isNeedNotice;
        }, AddToSkuInfo: function (skuCode, type) {
            JeOms.SkuInfo[skuCode] = type;
        }, BindReturnSignToPage: function () {
            setInterval(function () {
                if ($(".leading-5").length > 0) {
                    $.each($(".leading-5"), function (m, n) {
                        var allDivs = $(n).find("div");
                        var signDiv;
                        var skuCode;
                        console.log(allDivs)
                        $.each(allDivs, function (a, b) {
                            if ($(b).text().indexOf("商品标记") != -1) {
                                signDiv = b;
                            }

                            if ($(b).text().indexOf("规格编码") != -1) {
                                skuCode = $(b).text().split("：")[1];
                            }
                        });
                        $(signDiv).find("span").text(JeOms.SkuInfo[skuCode]);
                    });
                }
            }, 1000); // 1000毫秒 = 1秒
        },
    };

    //马帮ERP
    var MaBangErp = {
        Init: function () {

        }, DealCorsPage: function () {
            // 提取哈希部分（从'#'开始）
            setInterval(function () {
                if (window_url.indexOf("deliverGoodsList") != -1) {

                    if (!document.querySelector(".xyButton")) {
                        if ($(".btn-leftBox").length > 0) {
                            // $('.el-table__header-wrapper').find('table').find('col').each(function (m, n) {
                            //     console.log(n);
                            //     console.log($(n).attr("name"));
                            // });

                            $(".btn-leftBox").prepend("<a id='xyButton_exportData' class='btn xyButton' style='background-color: #e5d64f;color: #fff;height: 30px;display: block;width: 78px;border: 0px;cursor: pointer;font-size: 13px;padding: 6px 0px;border-radius: 0px;'>导出发货数据</a><a id='xyButton_createOrder' class='btn xyButton' style='background-color: #e54f4f;color: #fff;height: 30px;display: block;width: 68px;border: 0px;cursor: pointer;font-size: 13px;padding: 6px 0px;border-radius: 0px;margin-left:6px;'>一键推单</a>");
                            $(".el-alert").css("display", "none");

                            $("#xyButton_exportData").popover({
                                title: "导出发货数据",
                                trigger: "hover",
                                html: true,
                                content: "<div class='w_400'>点击 “导出发货数据” 按钮之后,系统会自动导出今天的发货数据(不包含已经回写快递单号的)，2分钟内推送到你的企业微信，如未收到请重试或者联系IT部</div>",
                            });

                            $("#xyButton_createOrder").popover({
                                title: "一键推单",
                                trigger: "hover",
                                html: true,
                                content: "<div class='w_300'>点击 “一键推单” 按钮之后，系统将按照您勾选的单据<span class='text-danger'>自动生成 OMS 销售订单</span>，并自动按照已锁仓库存和收货地址等进行<span class='text-danger'>拆单</span>。待仓库真实发货之后，系统将自动<span class='text-danger'>按照仓库发货信息，回传快递单号到马帮ERP,并自动标记装箱发货</span>。发货完成之后将同步推送消息到 <span class='greenText'>【多多跨境商品调拨沟通群】！</div>",
                            });

                            $("#xyButton_exportData").click(function () {
                                MaBangErp.ExportData();
                            });
                            $("#xyButton_createOrder").click(function () {
                                MaBangErp.CreateOrder();
                            });
                        }
                    }
                }
                if (window_url.indexOf("choiceList") != -1) {

                    if (!document.querySelector(".xyButton")) {
                        if ($(".btn-leftBox").length > 0) {
                            $(".btn-leftBox").prepend("<a id='xyButton_choiceCreateOrder' class='btn xyButton' style='background-color: #e54f4f;color: #fff;height: 30px;display: block;width: 68px;border: 0px;cursor: pointer;font-size: 13px;padding: 6px 0px;border-radius: 0px;margin-left:6px;'>生成发货单</a><a id='xyButton_autoChoiceCreateOrder' class='btn xyButton' style='background-color: #1aadb0;color: #fff;height: 30px;display: block;width: 98px;border: 0px;cursor: pointer;font-size: 13px;padding: 6px 0px;border-radius: 0px;margin-left:6px;'>自动生成发货单</a>");
                            $(".el-alert").css("display", "none");

                            $("#xyButton_choiceCreateOrder").popover({
                                title: "生成发货单",
                                trigger: "hover",
                                html: true,
                                content: "<div class='w_300'>点击 “生成发货单” 按钮之后，系统将按照您勾选的单据<span class='text-danger'>自动锁定OMS库存，并且按实际库存情况修改数量</span></div>",
                            });
                            $("#xyButton_autoChoiceCreateOrder").popover({
                                title: "自动生成发货单",
                                trigger: "hover",
                                html: true,
                                content: "<div class='w_300'>点击 “自动生成发货单” 按钮之后，系统自动将可加入发货台的备货单加入发货台，因火爆等原因不一定能全部加入，执行时间按备货单数量增加，执行完成将会发送消息至企业微信</span></div>",
                            });
                            $("#xyButton_choiceCreateOrder").click(function () {
                                MaBangErp.ChoiceCreateOrder();
                            });
                            $("#xyButton_autoChoiceCreateOrder").click(function () {
                                MaBangErp.AutoChoiceCreateOrder();
                            });
                        }
                    }
                    MaBangErp.BindStockView();
                }
            }, 1000); // 1000毫秒 = 1秒
            setInterval(function () {
                if (window_url.indexOf("deliverGoodsList") != -1) {
                    const re = /WB\d{12,13}/;
                    var batchCodes = [];
                    $.each($(".product-content"), function (m, n) {
                        if ($(n).text() != null && $(n).text().indexOf("备货单号") != -1) {
                            var m = $(n).text().match(re);
                            console.log($(n).text())
                            console.log(m)
                            console.log('------------')
                            if (m) {
                                batchCodes.push(m[0]);
                            }
                        }
                    });
                    $.ajax({
                        url: "https://lliuliangjia.com:10001/index.ashx?type=XY.BPF.MaBangErp.GetAllotWarehouse", // 请求的URL
                        method: "POST", data: JSON.stringify({
                            codes: batchCodes,
                        }),
                    })
                        .done(function (response) {
                            // 成功回调
                            //console.log("Ajax请求成功，响应为:", response);
                            var resultJson = JSON.parse(response);
                            $.each($(".product-content"), function (m, n) {
                                if ($(n).text() != null && $(n).text().indexOf("备货单号") != -1) {
                                    if ($(n).siblings().hasClass('omsWareHosueXy')) {
                                        $(n).siblings('.omsWareHosueXy')[0].remove();
                                    }
                                    var m = $(n).text().match(re);
                                    if (m) {
                                        var code = m[0];
                                        var data = resultJson.Data.filter(user => user.MbBatchNo == code);
                                        if (data != null && data.length > 0) {
                                            var wareHouseName = data[0].OmsVirtualWarehouseId == "16764101651785728" ? "义乌" : "宇隆";
                                            var hasOmsCode = data[0].OmsCode == "" || data[0].OmsCode == null ? "green" : "red";
                                            $(n).parent().append("<span class='omsWareHosueXy el-tag el-tag--mini el-tag--light' style='color:" + hasOmsCode + "'>" + wareHouseName + "</span>");
                                        }
                                    }
                                }
                            });
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            // 失败回调
                            console.log("Ajax请求失败: ", textStatus);
                        });
                }
            }, 3000); // 1000毫秒 = 1秒
        }, DisplayCode: "", AutoChoiceCreateOrder: function () {
            if (confirm("是否自动加入发货单，系统自动将可加入发货台的备货单加入发货单，因火爆等原因不一定能全部加入，执行时间按备货单数量增加，预计5-10分钟，执行完成将会发送消息至企业微信")) {
                var token = sessionStorage.getItem('authorization');
                var employeeId = sessionStorage.getItem('employeeId');
                $.ajax({
                    url: "https://lliuliangjia.com:10001/index.ashx?type=XY.BPF.MaBangErp.AutoCreateDeliveryOrder", // 请求的URL
                    method: "POST", // 请求方法，可以是GET、POST等
                    data: JSON.stringify({
                        token: token, employeeId: employeeId
                    }),
                })
                    .done(function (response) {
                        // 成功回调
                        console.log("Ajax请求成功，响应为:", response);
                        alert(JSON.parse(response).ReturnMsg);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // 失败回调
                        console.log("Ajax请求失败: ", textStatus);
                    });
                cocoMessage.success("已开始执行，请等待！", 3000);
            }
        }, ExportData: function () {
            if (confirm("是否提交导出申请")) {
                var token = sessionStorage.getItem('authorization');
                var employeeId = sessionStorage.getItem('employeeId');
                //点击了导出数据的按钮
                $.ajax({
                    url: "https://lliuliangjia.com:10001/index.ashx?type=XY.BPF.MaBangErp.ExportData", // 请求的URL
                    method: "POST", // 请求方法，可以是GET、POST等
                    data: JSON.stringify({
                        token: token, employeeId: employeeId
                    }),
                })
                    .done(function (response) {
                        // 成功回调
                        console.log("Ajax请求成功，响应为:", response);
                        alert(JSON.parse(response).ReturnMsg);
                    })
                    .fail(function (jqXHR, textStatus, errorThrown) {
                        // 失败回调
                        console.log("Ajax请求失败: ", textStatus);
                    });
                cocoMessage.success("已提交，请等待！", 3000);
            }
        }, ChoiceCreateOrder: function () {
            if (confirm("是否提交")) {
                cocoMessage.success("提交了！", 3000);
                //点击了创建发货单的按钮
                var checkBox = $(".el-table__body .el-checkbox .is-checked");
                if (checkBox.length == 0) {
                    cocoMessage.error("请勾选至少一个备货单！", 3000);
                    return false;
                } else {
                    var codes = [];
                    $.each(checkBox, function (m, n) {
                        var nSPan = $(n).parents("tr").find("p");
                        $.each(nSPan, function (x, y) {
                            var spanText = $(y).text();
                            if (spanText != null && spanText.indexOf("备货单号: ") == 0) {
                                if (codes.indexOf(spanText.replace("备货单号: ", "")) == -1) {
                                    codes.push(spanText.replace("备货单号: ", ""));
                                }
                            }
                        });
                    });
                    $.ajax({
                        url: "https://lliuliangjia.com:10001/index.ashx?type=XY.BPF.MaBangErp.CreateDeliveryOrder", // 请求的URL
                        method: "POST", data: JSON.stringify({
                            codes: codes,
                        }),
                    })
                        .done(function (response) {
                            // 成功回调
                            console.log("Ajax请求成功，响应为:", response);
                            alert(JSON.parse(response).ReturnMsg);
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            // 失败回调
                            console.log("Ajax请求失败: ", textStatus);
                        });
                }
            }
        }, CreateOrder: function () {
            if (confirm("是否创建oms订单")) {
                //点击了一键推单的按钮
                var checkBox = $(".el-table__body .el-checkbox .is-checked");
                if (checkBox.length == 0) {
                    cocoMessage.error("请勾选至少一个发货单！", 3000);
                    return false;
                } else {
                    var codes = [];
                    $.each(checkBox, function (m, n) {
                        var nSPan = $(n).parents("tr").find("span");
                        $.each(nSPan, function (x, y) {
                            var spanText = $(y).text();
                            if (spanText != null && spanText.indexOf("FH") == 0) {
                                if (codes.indexOf(spanText) == -1) {
                                    codes.push(spanText);
                                }
                            }
                        });
                    });
                    var employeeId = sessionStorage.getItem('employeeId');
                    $.ajax({
                        url: "https://lliuliangjia.com:10001/index.ashx?type=XY.BPF.MaBangErp.CreateOrder", // 请求的URL
                        method: "POST", data: JSON.stringify({
                            codes: codes, employeeId: employeeId
                        }),
                    })
                        .done(function (response) {
                            // 成功回调
                            console.log("Ajax请求成功，响应为:", response);
                            alert(JSON.parse(response).ReturnMsg);
                        })
                        .fail(function (jqXHR, textStatus, errorThrown) {
                            // 失败回调
                            console.log("Ajax请求失败: ", textStatus);
                        });
                }
            }
        }, //查找页面可能是 spu skc sku的元素，并绑定显示库存的按钮
        BindStockView: function () {
            var allDivs = [];
            var findSignText = ["SKU货号", "SKU 货号",];
            // var findSignText = ["货号"];
            $.each(findSignText, function (m, n) {
                allDivs = allDivs.concat(Tools.FindDivByText(n));
            });
            allDivs.forEach((div) => {
                // 获取目标div后面的同级div
                // const nextDiv = div.nextElementSibling;
                // if (nextDiv && nextDiv.tagName.toLowerCase() === 'div') {
                if (!div.querySelector(".xyStockView")) {
                    var newSpan = document.createElement("span");
                    // 为新的 li 元素设置一些内容
                    var html = "";
                    var text = "";
                    var divText = div.innerText;
                    if (divText.indexOf(":") != -1 || divText.indexOf("：") != -1) {
                        text = divText.split(":")[1];
                        if (text == null || text.length == 0) {
                            text = divText.split("：")[1];
                        }
                    }
                    text = text.trimStart().trimEnd();
                    if (text != null && text.length > 0) {
                        html += "<span data-toggle='popover' data-text='" + text + "' class='xyStockView' style='color:white;background:#e5d64f;width: 18px;height: 18px;font-size: 10px;border-radius: 10px;display: inline-flex;line-height: 10px;justify-content: center;align-items: center;cursor:pointer;'>库</span>";
                        newSpan.innerHTML = html;
                        // div.nextElementSibling.appendChild(newSpan);
                        div.appendChild(newSpan);
                        //因为是定时器循环绑定的，导致 popover  shown.bs.popover 都会被注册多次，所以要先 unbind 全部的事件
                        $(".xyStockView").unbind();

                        $(".xyStockView").popover({
                            title: function () {
                                return MaBangErp.DisplayCode;
                            },
                            trigger: "hover",
                            html: true,
                            content: "<div class='w_500' id='stockContnet_" + text + "'></div>",
                        });

                        $(".xyStockView").on("show.bs.popover", function () {
                            // 保存对当前元素的引用
                            var currentElement = $(this);
                            var stockHtml = "";
                            var code = currentElement.parent().siblings("span").text().trim();
                            $.each(findSignText, function (m, n) {
                                code = code.replace(n, "").replace(":", "").replace("：", "").replace(" ", "");
                            });
                            MaBangErp.DisplayCode = code;
                            Config.AjaxAPI = "https://www.lliuliangjia.com:10001/index.ashx?type=XY.BPF.Service.GetOmsInventoryInfoService&code=" + code;
                            var data = {};
                            var total = 0;

                            Ajax.AjaxPost(data, null, function (res) {
                                var colors = [];
                                var sizes = [];
                                $.each(res.Data, function (m, n) {
                                    var colorStr = n.skuName.split(";")[0];
                                    var sizeStr = n.skuName.split(";")[1];
                                    if (colors.indexOf(colorStr) == -1) {
                                        colors.push(colorStr);
                                    }
                                    if (sizes.indexOf(sizeStr) == -1) {
                                        sizes.push(sizeStr);
                                    }
                                });

                                var stockContent = "";
                                stockContent += "<div>";

                                stockContent += "<div style='text-align: right;margin-right: 4px;margin-bottom: 2px;'>";
                                stockContent += "<span class='greenText'>共享仓</span> <span class='grayText'>/</span> <span class='redText'>销退仓</span>";
                                stockContent += "</div>";

                                stockContent += "<div>";

                                stockContent += "<table class='stockContnet table table-vcenter  table-hover table-condensed table-bordered  dataTable no-footer'>";
                                stockContent += "<thead>";
                                stockContent += "<tr>";
                                stockContent += "<th rowspan='2'></th>";
                                stockContent += "<th colspan='" + colors.length + "'>宇隆</th>";
                                stockContent += "<th colspan='" + colors.length + "'>义乌</th>";
                                stockContent += "</tr>";

                                stockContent += "<tr>";
                                $.each(colors, function (m, color) {
                                    stockContent += "<th>" + color + "</th>";
                                });
                                $.each(colors, function (m, color) {
                                    stockContent += "<th>" + color + "</th>";
                                });
                                stockContent += "</tr>";
                                stockContent += "</thead>";

                                stockContent += "<tbody>";
                                $.each(sizes, function (m, size) {
                                    stockContent += "<tr>";
                                    stockContent += "<td>" + size + "</td>";
                                    $.each(colors, function (m, color) {
                                        var greenQty = 0;
                                        var redQty = 0;
                                        $.each(res.Data, function (m, n) {
                                            if (n.skuName == color + ";" + size) {
                                                if (n.virtualWarehouseName == "宇隆新仓-共享") {
                                                    greenQty = n.saleable;
                                                }
                                                if (n.virtualWarehouseName == "宇隆销退仓-共享") {
                                                    redQty = n.saleable;
                                                }
                                            }
                                        });
                                        stockContent += "<td><span class='greenText'>" + (greenQty == 0 ? "-" : greenQty) + "</span> <span class='grayText'>/</span> <span class='redText'>" + (redQty == 0 ? "-" : redQty) + "</span></td>";
                                    });
                                    $.each(colors, function (m, color) {
                                        var greenQty = 0;
                                        var redQty = 0;
                                        $.each(res.Data, function (m, n) {
                                            if (n.skuName == color + ";" + size) {
                                                if (n.virtualWarehouseName == "义乌仓库-共享") {
                                                    greenQty = n.saleable;
                                                }
                                                if (n.virtualWarehouseName == "义乌销退仓-共享") {
                                                    redQty = n.saleable;
                                                }
                                            }
                                        });
                                        stockContent += "<td><span class='greenText'>" + (greenQty == 0 ? "-" : greenQty) + "</span> <span class='grayText'>/</span> <span class='redText'>" + (redQty == 0 ? "-" : redQty) + "</span></td>";
                                    });
                                    stockContent += "</tr>";
                                });
                                stockContent += "</tbody>";

                                stockContent += "</table>";

                                stockContent += "</div>";

                                stockContent += "</div>";
                                $("#stockContnet_" + currentElement.data("text")).html(stockContent);
                                //更新位置
                                currentElement.popover("update");
                            });
                        });
                    }
                }
                // }
            });
        },
    };

    // 淘宝直播
    var TBLiving = {
        Init: function () {
            TBLiving.ListenPage();
        }, ListenPage: function () {
            $.ajax({
                url: "https://h5api.m.taobao.com/h5/mtop.taobao.wireless.amp.imba.session.conversationids.list/1.0/?jsv=2.6.2&appKey=12574478&t=1716533912063&sign=5482b0f7fe07dd7f134925a5e99de58c&api=mtop.taobao.wireless.amp.imba.session.conversationids.list&v=1.0&preventFallback=true&type=jsonp&dataType=jsonp&callback=mtopjsonp29&data=%7B%22accessKey%22%3A%22taolive-host-h5%22%2C%22accessToken%22%3A%22taolive-host-h5-secret%22%2C%22conversationIds%22%3A%22%5B%5C%221005_PU_1512629677266_276811515%233_276811515%233%5C%22%2C%5C%221005_PU_1661914475664_276811515%233_276811515%233%5C%22%5D%22%7D",
                method: "Get", // 请求方法，可以是GET、POST等
                headers: {
                    Cookies: document.cookie
                },
            })
                .done(function (res) {
                    console.log(res)
                })
                .fail(function (jqXHR, textStatus, errorThrown) {
                    // 失败回调
                    console.log("Ajax请求失败: ", textStatus);
                });
        }
    };

    //抖音
    var JinRiTouTiao = {
        IsTask: false, Task: null, text1: "取消讲解", text2: "讲解", // text1: "取消主推",
        // text2: "主推",
        Init: function () {
            setInterval(function () {
                JinRiTouTiao.ListenPage();
            }, 1000); // 1000毫秒 = 1秒
        }, ListenPage: function () {
            // 检查页面上是否已经存在音频元素
            var xyDiv = document.getElementById("xyDiv");
            if (!xyDiv) {
                xyDiv = document.createElement("span");
                // var html = '<div class="xyCloseAllbutton" style="color:red;background: #e5d64f;font-weight: bold;height: 32px;display: flex;width: 90px;border: 0px;border-radius: 4px;cursor: pointer;font-size: 13px;position: absolute;z-index: 999;top: 8px;right: 20px;justify-content: center;align-items: center;">关闭全部</div>';
                var html = '';
                html += '<div id="xyDiv" style="position: absolute;	top: 25vh;right: 0;display: flex;justify-content: center;flex-direction: column;width: 80px;padding: 16px 10px 16px 10px;background: #ffffff;border-top-left-radius: 10px;border-bottom-left-radius: 10px;border: 1px solid #1966ff;align-items: center;">';
                html += '<input id="xyTaskTime" placeholder="间隔秒数" style="font-size: 12px;text-align: center;border: 1px solid #1966ff;	height: 30px;width: 100%;" value="10"/>';
                html += '<span id="xyTaskCount" style="line-height: 36px;color: #e5d64f;	font-weight: bold;font-size: 21px;">0</span>';
                html += '<button id="xyTaskBtn" style="border:0px;background:#1966ff;color:#fff;width: 100%;">开始</button>';
                html += '</div>';
                xyDiv.innerHTML = html;
                // 如果不存在，则创建一个新的<audio>元素并添加到页面上
                document.body.appendChild(xyDiv);
                $("#xyTaskBtn").click(function () {
                    if (JinRiTouTiao.IsTask) {
                        JinRiTouTiao.EndTask();
                        $("#xyTaskBtn").text("开始");
                    } else {
                        if ($("#xyTaskTime").val() == "") {
                            alert("请先设置间隔秒数！");
                            return;
                        }
                        $("#xyTaskBtn").text("停止");
                        $("#xyTaskCount").text(0);
                        JinRiTouTiao.StartTask();
                        JinRiTouTiao.Task = setInterval(function () {
                            JinRiTouTiao.StartTask();
                        }, parseInt($("#xyTaskTime").val()) * 1000);
                    }
                });
            }
        }, StartTask: function () {
            JinRiTouTiao.IsTask = true;
            var elements = $('div[class*="goodsItem"]');
            var parentEle;
            var sleep = 50;
            if (elements.length > 0) {
                var btn1 = $(elements).find("button:contains('" + JinRiTouTiao.text1 + "')");
                if (btn1.length > 0) {
                    parentEle = $(btn1).parents('div[class*="goodsItem"]')
                    var mainBtn = btn1[0];
                    mainBtn.click();
                    sleep = 1000;
                }
                setTimeout(function () {
                    var btn2 = $(parentEle).find("button:contains('" + JinRiTouTiao.text2 + "')");
                    if (btn2.length > 0) {
                        var mainBtn2 = btn2[0];
                        mainBtn2.click();
                    }
                }, sleep);
            }
            $("#xyTaskCount").text(parseInt($("#xyTaskCount").text()) + 1);
        }, EndTask: function () {
            JinRiTouTiao.IsTask = false;
            clearInterval(JinRiTouTiao.Task);
            var elements = $('div[class*="goodsItem"]');
            if (elements.length > 0) {
                var topElements = elements[0];
                var btn1 = $(topElements).find("button:contains('" + JinRiTouTiao.text1 + "')");
                if (btn1.length > 0) {
                    var mainBtn = btn1[0];
                    mainBtn.click();
                }
            }
        }
    };

    //凌云PIM
    var PIM = {
        Init: function () {
            console.log(window_url)
            if (window_url.indexOf("product/workbench/edit") != -1 || window_url.indexOf("product/workbench/empty") != -1) {
                PIM.DisplayBtn();
            }
            PIM.SelectCate();
        }, IsAutoIng: false, PimPropDatas: [],
        InitPimPropDatas: function (data) {
            PIM.PimPropDatas = [];
            var jsonText = data.rules.filter(item => item.id == "goodsProp");
            // 唯品会属性
            for (const item of jsonText[0].data.filter(item => item.id == "commonGoodsProp" || item.id == "PLATFORM_PROP_7" || item.id == "PLATFORM_PROP_2" || item.id == "PLATFORM_PROP_6")) {
                for (const itemProp of item.data) {
                    console.log(itemProp.options, itemProp.name)
                    if (itemProp.options == undefined && PIM.defaultElementList.indexOf(item.id + "-" + itemProp.uniqueNick) == -1 && PIM.hiddenElementList.indexOf(item.id + "-" + itemProp.uniqueNick) == -1 && (itemProp.subType == "SINGLECHECK" || itemProp.subType == "TWOSTAGEPOPUP" || itemProp.subType == "MULTISELECT")) {
                        PIM.PimPropDatas.push({
                            name: itemProp.name,
                            id: item.id + "-" + itemProp.uniqueNick,
                            values: itemProp.optionList.map(t => t.name).join('、')
                        });
                    }
                }
            }
            console.log(PIM.PimPropDatas);
        },
        // 选中最合适的下拉
        SelectLi: function (lis, value) {
            function similarity(s, t) {
                s = (s || '').trim();
                t = (t || '').trim();

                if (!s || !t) return 0;

                // 公共子串长度
                let common = 0;
                for (let i = 0; i < s.length; i++) {
                    for (let j = 0; j < t.length; j++) {
                        let k = 0;
                        while (i + k < s.length && j + k < t.length && s[i + k] === t[j + k]) {
                            k++;
                        }
                        common = Math.max(common, k);
                    }
                }

                // Jaccard 相似度（简化版）
                let setS = new Set(s.split(''));
                let setT = new Set(t.split(''));
                let intersection = new Set([...setS].filter(x => setT.has(x))).size;
                let union = new Set([...setS, ...setT]).size;

                let jaccard = intersection / union;

                // 最终分数：公共子串比例 + jaccard + 长度接近度
                let lenScore = 1 / (1 + Math.abs(s.length - t.length));
                return (common / Math.max(s.length, t.length) + jaccard + lenScore) / 3;
            }

            // 找到最匹配的 li
            function findBestMatch(lis, target) {
                target = target.trim();
                let bestLi = null;
                let bestScore = -1;

                lis.forEach(li => {
                    let text = li.innerText.trim();
                    let score = similarity(text, target);
                    if (score > bestScore) {
                        bestScore = score;
                        bestLi = li;
                    }
                });

                return bestLi;
            }
            var best = findBestMatch(lis, value);
            console.log(best)
            if (best) best.click();
        },
        Click: function (index, responeData) {
            try {
                console.log(responeData.Output.length, index)
                if (responeData.Output.length <= index) {
                    for (const right of document.querySelectorAll('.pmdm-popover-placement-rightTop')) {
                        right.style.display = 'none'; // 隐藏元素
                    }
                    for (const right of document.querySelectorAll('.pmdm-popover-placement-leftTop')) {
                        right.style.display = 'none'; // 隐藏元素
                    }
                    for (const right of document.querySelectorAll('.pmdm-select-dropdown-placement-bottomLeft')) {
                        right.style.display = 'none'; // 隐藏元素
                    }
                    for (const right of document.querySelectorAll('.pmdm-select-dropdown-placement-bottomRight')) {
                        right.style.display = 'none'; // 隐藏元素
                    }
                    for (const right of document.querySelectorAll('.pmdm-popover-placement-rightBottom')) {
                        right.style.display = 'none'; // 隐藏元素
                    }
                    for (const right of document.querySelectorAll('.pmdm-popover-placement-leftBottom')) {
                        right.style.display = 'none'; // 隐藏元素
                    }
                    return;
                }
                var isDeal = true;
                // 点击
                if (document.getElementById(responeData.Output[index].Id) != null) {
                    var clickElement = document.getElementById(responeData.Output[index].Id).querySelector('div[role="combobox"]');
                    if (clickElement != null) {

                        let target = clickElement.querySelector('.pmdm-select-selection-selected-value');
                        let targetMult = clickElement.querySelector('.pmdm-select-selection__choice');
                        let targetTitle = target ? (target.innerText || '').trim() : '';
                        // 有选中元素的就不执行了
                        if (!target && !targetMult) {
                            clickElement.click();
                        }
                        else if (target && targetTitle == '') {
                            clickElement.click();
                        }
                        else {
                            isDeal = false;
                        }
                    }
                    else {
                        // id 以 myInput 开头
                        let inputEl = document.querySelector('input[id^="' + responeData.Output[index].Id + '"]');
                        if ("PLATFORM_PROP_6-km_after_sales_information" == responeData.Output[index].Id) {
                            inputEl = document.getElementById(responeData.Output[index].Id).querySelector('input[class^="pmdm-input"]');
                        }
                        // id 包含 myInput
                        let textareaEl = document.querySelector('textarea[id*="' + responeData.Output[index].Id + '"]');
                        if (inputEl && !(inputEl.value && inputEl.value.trim() !== "")) {
                            inputEl.dispatchEvent(new Event('focus', {
                                bubbles: true, cancelable: true, composed: true
                            }));
                            inputEl.value = responeData.Output[index].PropValue;
                            inputEl.dispatchEvent(new Event('input', {
                                bubbles: true, cancelable: true, composed: true
                            }));
                            inputEl.dispatchEvent(new Event('blur', {
                                bubbles: true, cancelable: true, composed: true
                            }));
                        }
                        if (inputEl && responeData.Output[index].Id == 'PLATFORM_PROP_6-km_core_description') {
                            var errorMsg = "";
                            if (inputEl.value.length > 150) {
                                errorMsg = '字符数大于150，当前' + inputEl.value.length + '字。';
                            }
                            let foriegnWords = new RegExp("最|最佳|最具|最赚|最优|最优秀|最好|最大|最大程度|最高|最高级|最高档|最侈|最低|最低级|最低价|最便宜|时尚最低价|最流行|最受欢迎|最时尚|最聚拢|最符合|最舒适|最先|最先进|最先进科学|最新|最新科技|最新科学|最新技术|最先进加工工艺|第一|中国第一|全国第一|全网第一|销量第一|排名第一|第一品牌|行业第一|NO.1|TOP.1|仅此一家|仅此一次|唯一|独一无二|一流|全国|世界|国家级|全球级|宇宙级|世界级|极品|极佳|绝佳|绝对|极致|顶级|顶尖|尖端|顶级工艺|顶级享受|终极|首个|首选|全球首发|首家|全网首发|首款|首家|独家|独家配方|全国销量冠军|国家级产品|国家领导人|填补国内空白|世界领先|行业领先|领先上市|世界|大品牌|领袖品牌|创领品牌|领导品牌|领导者|缔造者|王者|问鼎|至尊|巅峰|之王|性价比之王|顶级工艺|王牌|销量冠军|绝无仅有|前无古人|史无前例|万能|绝对|永久|无敌");
                            //str中存在foriegnWords中的关键字时，返回命中的关键字
                            if (foriegnWords.test(inputEl.value)) {
                                if (foriegnWords.exec(inputEl.value) != null) {
                                    errorMsg += "包含违禁词：" + foriegnWords.exec(inputEl.value)[0];
                                }
                            }
                            console.log(inputEl.value.length + errorMsg);
                            if (errorMsg != '') {
                                try {
                                    inputEl.style.border = '1px solid #ff4d4f';
                                    inputEl.style.borderColor = '#ff4d4f';
                                    inputEl.style.outline = 'none';
                                    var parent = inputEl.parentElement || inputEl.closest('div');
                                    if (parent) {
                                        var warn = parent.querySelector('.xy-input-warn');
                                        if (!warn) {
                                            warn = document.createElement('div');
                                            warn.className = 'xy-input-warn';
                                            warn.style.color = '#ff4d4f';
                                            warn.style.fontSize = '12px';
                                            warn.style.marginTop = '4px';
                                            parent.appendChild(warn);
                                        }
                                        warn.textContent = errorMsg;
                                    }
                                } catch (e) { }
                            } else {
                                try {
                                    var parent = inputEl.parentElement || inputEl.closest('div');
                                    if (parent) {
                                        var warn = parent.querySelector('.xy-input-warn');
                                        if (warn) { parent.removeChild(warn); }
                                    }
                                } catch (e) { }
                            }
                        }
                        if (textareaEl && !(textareaEl.value && textareaEl.value.trim() !== "")) {
                            textareaEl.dispatchEvent(new Event('focus', {
                                bubbles: true, cancelable: true, composed: true
                            }));
                            textareaEl.value = responeData.Output[index].PropValue;
                            textareaEl.dispatchEvent(new Event('input', {
                                bubbles: true, cancelable: true, composed: true
                            }));
                            textareaEl.dispatchEvent(new Event('blur', {
                                bubbles: true, cancelable: true, composed: true
                            }));
                        }
                    }
                }
                setTimeout(function () {
                    PIM.ClickLi(clickElement, index, responeData, isDeal);
                }, 150);
            } catch {
                PIM.UnLoading();
                PIM.IsAutoIng = false;
            }
        }, ClickLi: function (clickElement, index, responeData, isDeal) {
            try {
                // 点击
                if (clickElement != null && isDeal) {
                    var uid = clickElement.getAttribute("aria-controls");
                    const parent = document.getElementById(uid);
                    var matchingLis = Array.from(parent.querySelectorAll('li')).filter(li => li.innerText.indexOf(responeData.Output[index].PropValue) != -1);
                    // 如果点的是面料俗称，会触发联动需要处理单独处理
                    if (responeData.Output[index].Id == "PLATFORM_PROP_2-km_fabric" || responeData.Output[index].Id == "PLATFORM_PROP_7-349" || responeData.Output[index].Id == "PLATFORM_PROP_7-317" || responeData.Output[index].Id == "PLATFORM_PROP_7-3292") {
                        if (parent) {
                            var lis = Array.from(parent.querySelectorAll('li'));
                            PIM.SelectLi(lis, responeData.Output[index].PropValue);
                        }
                    }
                    // 成分含量
                    else if (responeData.Output[index].Id == "PLATFORM_PROP_7-396") {
                        if (matchingLis.length <= 0) {
                            if (parent.querySelectorAll('li').length == 1) {
                                matchingLis = parent.querySelectorAll('li');
                            } else {
                                for (var liIndex in parent.querySelectorAll('li')) {
                                    var li = parent.querySelectorAll('li')[liIndex];
                                    var prec = parseFloat(responeData.Output[index].PropValue);
                                    if (!li.innerText) {
                                        continue;
                                    }
                                    const numbers = li.innerText.match(/\d+/g);
                                    if (numbers.length == 1 && numbers[0] == 100 && numbers[0] == prec) {
                                        matchingLis.push(li);
                                        break;
                                    } else if (numbers.length == 1 && numbers[0] == 30 && numbers[0] >= prec) {
                                        matchingLis.push(li);
                                        break;
                                    } else if (numbers.length == 2 && numbers[0] <= prec && numbers[1] >= prec) {
                                        matchingLis.push(li);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    if (matchingLis.length > 0) {
                        // 触发事件
                        matchingLis[0].click();
                    }
                }
                setTimeout(function () {
                    PIM.Click(++index, responeData);
                }, 300);
            } catch (err) {
                console.log(err)
                PIM.UnLoading();
                PIM.IsAutoIng = false;
            }
        }, Loading: function () {
            $("#xyPimStartBtn").val('执行中..');
            $("#xyPimStartBtn").text('执行中..');
        }, UnLoading: function () {
            $("#xyPimStartBtn").val('开始');
            $("#xyPimStartBtn").text('开始');
        },
        // 监听选择正确类型
        SelectCate: function () {
            Tools.AddFetchListener("https://api.kuaimai.com/router?m=pmdm.xingyou.erp.product.get", function (text) {
                if ((JSON.parse(text)).data.catName == "女装>>女上装>>女式外套") {
                    setTimeout(function () {
                        document.querySelectorAll('.workbench-category__nav-item span')
                            .forEach(span => {
                                if (span.textContent.trim() === '短外套') {
                                    let parent = span.closest('.workbench-category__nav-item-wrapper');
                                    if (parent) parent.click(); // 点击父元素
                                }
                            });
                    }, 500);
                }
                if ((JSON.parse(text)).data.catName == "女装>>女下装>>女式休闲裤") {
                    setTimeout(function () {
                        document.querySelectorAll('.workbench-category__nav-item span')
                            .forEach(span => {
                                if (span.textContent.trim() === '裤子') {
                                    let parent = span.closest('.workbench-category__nav-item-wrapper');
                                    if (parent) parent.click(); // 点击父元素
                                    setTimeout(function () {
                                        document.querySelectorAll('.workbench-category__nav-item span')
                                            .forEach(span => {
                                                if (span.textContent.trim() === '休闲裤') {
                                                    let parent = span.closest('.workbench-category__nav-item-wrapper');
                                                    if (parent) parent.click(); // 点击父元素
                                                }
                                            });
                                    }, 500);
                                }
                            });
                    }, 500);
                }
                console.log((JSON.parse(text)).data.catName)
                if ((JSON.parse(text)).data.catName == "女装>>女下装>>女式牛仔裤") {
                    setTimeout(function () {
                        document.querySelectorAll('.workbench-category__nav-item span')
                            .forEach(span => {
                                if (span.textContent.trim() === '裤子') {
                                    let parent = span.closest('.workbench-category__nav-item-wrapper');
                                    if (parent) parent.click(); // 点击父元素
                                    setTimeout(function () {
                                        document.querySelectorAll('.workbench-category__nav-item span')
                                            .forEach(span => {
                                                if (span.textContent.trim() === '牛仔裤') {
                                                    let parent = span.closest('.workbench-category__nav-item-wrapper');
                                                    if (parent) parent.click(); // 点击父元素
                                                }
                                            });
                                    }, 500);
                                }
                            });
                    }, 500);
                }
            });
        },
        // 显示按钮
        DisplayBtn: function () {
            // 第一次编辑得监听
            Tools.AddFetchListener("https://api.kuaimai.com/router?m=pmdm.xingyou.erp.product.prop.get", function (text) {
                var jsonText = (JSON.parse(text));
                PIM.InitPimPropDatas(jsonText);
            });
            // 已经编辑过得监听
            Tools.AddFetchListener("https://api.kuaimai.com/router?m=pmdm.multi.sysForm.view.gzip", function (text) {
                var jsonText = (JSON.parse(text)).data;
                async function decodeGzipBase64(base64Str) {
                    // 1. Base64 转 Uint8Array
                    const binaryString = atob(base64Str);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }

                    // 2. 使用 DecompressionStream 解压 gzip
                    const ds = new DecompressionStream("gzip");
                    const decompressedStream = new Response(
                        new Blob([bytes]).stream().pipeThrough(ds)
                    );

                    // 3. 转回字符串
                    const text = await decompressedStream.text();
                    return text;
                }

                decodeGzipBase64(jsonText).then(result => {
                    var jsonText = (JSON.parse(result));
                    PIM.InitPimPropDatas(jsonText);
                });

            });
            Tools.AddFetchListener("https://api.kuaimai.com/router?m=pmdm.link.form.view.gzip", function (text) {
                var jsonText = (JSON.parse(text)).data;
                async function decodeGzipBase64(base64Str) {
                    // 1. Base64 转 Uint8Array
                    const binaryString = atob(base64Str);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }

                    // 2. 使用 DecompressionStream 解压 gzip
                    const ds = new DecompressionStream("gzip");
                    const decompressedStream = new Response(
                        new Blob([bytes]).stream().pipeThrough(ds)
                    );

                    // 3. 转回字符串
                    const text = await decompressedStream.text();
                    return text;
                }

                decodeGzipBase64(jsonText).then(result => {
                    var jsonText = (JSON.parse(result));
                    PIM.InitPimPropDatas(jsonText);
                });

            });
            Tools.AddFetchListener("https://api.kuaimai.com/router?m=pmdm.product.get", function (text) {
                var code = (JSON.parse(text)).data[0].itemNum;
                $.ajax({
                    url: "https://www.lliuliangjia.com:10001/index.ashx?type=XY.PM.Platform.CozeDistributionAttributeGenServer&isCoze=1&code=" + code, // 请求的URL
                    method: "POST", // 请求方法，可以是GET、POST等
                    data: JSON.stringify(PIM.PimPropDatas), // 发送到服务器的数据
                })
                    .done(function (res) {
                        var repsonse = JSON.parse(res);
                        if (repsonse.ReturnCode == 0) {
                            PIM.Click(0, repsonse.Data);
                            $('#xyPimDiv').css("width", "280px");
                            $('#xyPimDiv').css("height", "500px");
                            $("#codeImg").parent().css("margin-bottom", "50px");
                            $('#codeImg').attr("src", "https://oss-scm.ihzxy.com/MagicImg/" + code + ".jpg");
                            $('#compent').text(repsonse.Datas.Composition);
                            $('#xytitle').text(repsonse.Datas.Title);
                            $("#codeImg").parent().css("display", "inline");

                            // 为图片添加点击查看大图功能
                            $("#codeImg").off('click').on('click', function () {
                                var imgSrc = $(this).attr('src');
                                $('#xyViewerImg').attr('src', imgSrc);
                                $('#xyImageViewer').show();
                            });

                            // 点击图片查看器背景关闭
                            $('#xyImageViewer').off('click').on('click', function (e) {
                                if (e.target === this) {
                                    $(this).hide();
                                }
                            });
                        }
                    })
            });
            // 检查页面上是否存在浮窗按钮
            var xyDiv = document.getElementById("xyPimDiv");
            if (!xyDiv) {
                xyDiv = document.createElement("span");
                // var html = '<div class="xyCloseAllbutton" style="color:red;background: #e5d64f;font-weight: bold;height: 32px;display: flex;width: 90px;border: 0px;border-radius: 4px;cursor: pointer;font-size: 13px;position: absolute;z-index: 999;top: 8px;right: 20px;justify-content: center;align-items: center;">关闭全部</div>';
                var html = '';
                html += '<div id="xyPimDiv" style="z-index:999;position: absolute;	top: 25vh;right: 0;display: flex;justify-content: center;flex-direction: column;width: 80px;padding: 16px 10px 16px 10px;background: #ffffff;border-top-left-radius: 10px;border-bottom-left-radius: 10px;border: 1px solid #1966ff;align-items: center;">';
                html += "<div style='display:none;text-align: center;'><img id='codeImg' style='width:200px;cursor:pointer;' title='点击查看大图'><div id='xytitle' style='margin-bottom:10px;'></div><div id='compent'></div></div>";
                html += '<button id="xyPimStartBtn" style="border:0px;background:#1966ff;color:#fff;width: 100%;margin-bottom:5px;">开始</button>';
                html += '<button id="xyPimToggleBtn" style="border:0px;background:#e5d64f;color:#fff;width: 100%;font-size:12px;">显示元素</button>';
                html += '<div id="xyPimTitleSwitch" style="width:100%;margin-top:6px;text-align:center;color:#333;font-size:12px;">';
                html += '<span style="display:block;margin-bottom:4px;">标题前缀</span>';
                html += '<label style="margin-right:8px;cursor:pointer;">';
                html += '<input type="radio" name="xyTitleSwitch" value="1" checked onchange="(function(el){try{var k=\'xyShouldModifyTitle\';var f=(el.value===\'1\');localStorage.setItem(k,f?\'1\':\'0\');window.xyShouldModifyTitle=f;}catch(e){}})(this)"> 开';
                html += '</label>';
                html += '<label style="cursor:pointer;">';
                html += '<input type="radio" name="xyTitleSwitch" value="0" onchange="(function(el){try{var k=\'xyShouldModifyTitle\';var f=(el.value===\'1\');localStorage.setItem(k,f?\'1\':\'0\');window.xyShouldModifyTitle=f;}catch(e){}})(this)"> 关';
                html += '</label>';
                html += '</div>';
                html += '</div>';
                // 添加图片查看器
                html += '<div id="xyImageViewer" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:9999;cursor:pointer;">';
                html += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:90%;max-height:90%;">';
                html += '<img id="xyViewerImg" style="max-width:100%;max-height:100%;object-fit:contain;" />';
                html += '</div>';
                html += '<div style="position:absolute;top:20px;right:20px;color:white;font-size:30px;cursor:pointer;" onclick="document.getElementById(\'xyImageViewer\').style.display=\'none\';">×</div>';
                html += '</div>';
                xyDiv.innerHTML = html;
                // 如果不存在，则创建一个新的元素并添加到页面上
                document.body.appendChild(xyDiv);
                if (localStorage.getItem('xyShouldModifyTitle') == '1') {
                    document.querySelector('input[name="xyTitleSwitch"][value="1"]').checked = true;
                }
                else {
                    document.querySelector('input[name="xyTitleSwitch"][value="0"]').checked = true;
                }
                $("#xyPimStartBtn").click(function () {
                    if (PIM.IsAutoIng) {
                        cocoMessage.error("正在进行中请勿重复点击！", 3000);
                    } else {
                        PIM.hiddenElement();
                        PIM.Loading();
                        PIM.IsAutoIng = true;
                        try {
                            // 获取货号
                            var code = document.querySelector('#baseProp-km_item_number input').value;
                            $.ajax({
                                url: "https://www.lliuliangjia.com:10001/index.ashx?type=XY.PM.Platform.CozeDistributionAttributeGenServer&code=" + code, // 请求的URL
                                method: "POST", // 请求方法，可以是GET、POST等
                                data: JSON.stringify(PIM.PimPropDatas), // 发送到服务器的数据
                            })
                                .done(function (res) {
                                    var repsonse = JSON.parse(res);
                                    if (repsonse.ReturnCode == 0) {
                                        // 处理尺码表
                                        if (repsonse.Datas.Size) {
                                            PIM.DealSizeTable(repsonse.Datas.Size);
                                        }
                                        PIM.Click(0, repsonse.Data);
                                        $('#xyPimDiv').css("width", "280px");
                                        $('#xyPimDiv').css("height", "500px");
                                        $("#codeImg").parent().css("margin-bottom", "50px");
                                        $('#codeImg').attr("src", "https://oss-scm.ihzxy.com/MagicImg/" + code + ".jpg");
                                        $('#compent').text(repsonse.Datas.Composition);
                                        $('#xytitle').text(repsonse.Datas.Title);
                                        $("#codeImg").parent().css("display", "inline");

                                        // 为图片添加点击查看大图功能
                                        $("#codeImg").off('click').on('click', function () {
                                            var imgSrc = $(this).attr('src');
                                            $('#xyViewerImg').attr('src', imgSrc);
                                            $('#xyImageViewer').show();
                                        });

                                        // 点击图片查看器背景关闭
                                        $('#xyImageViewer').off('click').on('click', function (e) {
                                            if (e.target === this) {
                                                $(this).hide();
                                            }
                                        });

                                        // 添加市场价
                                        const inputs = document.querySelectorAll('#SKUTABLE input[placeholder*="市场价"]');
                                        inputs.forEach(input => {
                                            // 获取同一个tr内的唯品会条码input的值
                                            const currentTr = input.closest('tr');
                                            if (currentTr && !input.value) {
                                                const vipCodeInput = currentTr.querySelector('input[placeholder*="唯品会条码"]');
                                                if (vipCodeInput && vipCodeInput.value) {
                                                    // 在repsonse.Datas.SkuPrices中查找相同SkuCode的TagPrice
                                                    const skuCode = vipCodeInput.value;
                                                    const skuPrice = repsonse.Datas.SkuPrices.find(item => item.SkuCode === skuCode);
                                                    console.log(skuPrice);
                                                    if (skuPrice && skuPrice.TagPrice) {
                                                        input.value = skuPrice.TagPrice;
                                                    }
                                                }
                                                let ev = new Event('input');
                                                input.dispatchEvent(ev);
                                            }
                                        });
                                        // 添加零售价
                                        var retailPriceElement = document.querySelector("#saleProp-km_retail_price input");
                                        if (retailPriceElement) {
                                            retailPriceElement.value = repsonse.Datas.RetailPrice;
                                            let ev = new Event('input');
                                            retailPriceElement.dispatchEvent(ev);
                                        }
                                        // 特殊处理：淘宝面料成分， 可能字段不一样
                                        var container = document.getElementById("PLATFORM_PROP_2-km_meterial_composition");
                                        PIM.SelectMt(container, repsonse.Data.Components || []);
                                        var container = document.getElementById("PLATFORM_PROP_2-PMDM_TB_149422948");
                                        PIM.SelectMt(container, repsonse.Data.Components || []);

                                        // 京东成分 ， 可能字段不一样
                                        var container = document.getElementById("PLATFORM_PROP_4-km_jd_material");
                                        PIM.SelectMt(container, repsonse.Data.Components || []);
                                        var container = document.getElementById("PLATFORM_PROP_4-83028");
                                        PIM.SelectMt(container, repsonse.Data.Components || []);

                                    } else {
                                        cocoMessage.error("执行报错！", 3000);
                                    }
                                    PIM.UnLoading("xyPimStartBtn");
                                    PIM.IsAutoIng = false;
                                })
                                .fail(function (jqXHR, textStatus, errorThrown) {
                                    // 失败回调
                                    console.log("Ajax请求失败: ", textStatus);
                                });

                            var titlePrifx = "IHIMI/海谧";
                            if (code[0] == "M") {
                                titlePrifx = "MOHO&MO沫晗依美";
                            } else if (code[0] == "X") {
                                titlePrifx = "XWI欣未";
                            }
                            // 修改标题（localStorage 开关）
                            if (localStorage.getItem('xyShouldModifyTitle') == '1' && document.querySelector('#baseProp-km_title input').value.indexOf(titlePrifx) == -1) {
                                document.querySelector('#baseProp-km_title input').value = titlePrifx + document.querySelector('#baseProp-km_title input').value;
                                let ev = new Event('input');
                                document.querySelector('#baseProp-km_title input').dispatchEvent(ev);
                            }

                            // 添加商家编码
                            var codeElement = document.querySelector("#PLATFORM_PROP_7-outerGoodsId input");
                            if (codeElement != null && codeElement.value.indexOf(code) == -1) {
                                codeElement.dispatchEvent(new Event('focus', {
                                    bubbles: true, cancelable: true, composed: true
                                }));
                                codeElement.value = code;
                                codeElement.dispatchEvent(new Event('input', {
                                    bubbles: true, cancelable: true, composed: true
                                }));
                                codeElement.dispatchEvent(new Event('blur', {
                                    bubbles: true, cancelable: true, composed: true
                                }));
                            }
                            // 添加商品货号
                            var codeElement1 = document.querySelector("#PLATFORM_PROP_7-2119 input");
                            if (codeElement1 != null && codeElement1.value.indexOf(code) == -1) {
                                codeElement1.dispatchEvent(new Event('focus', {
                                    bubbles: true, cancelable: true, composed: true
                                }));
                                codeElement1.value = code;
                                codeElement1.dispatchEvent(new Event('input', {
                                    bubbles: true, cancelable: true, composed: true
                                }));
                                codeElement1.dispatchEvent(new Event('blur', {
                                    bubbles: true, cancelable: true, composed: true
                                }));
                            }
                            // 点击详情页属性禁用radio
                            var detailPropRadios = document.querySelectorAll('#detailPageProp-km_detail_page_properties input[type="radio"][value="0"]');
                            for (var i = 0; i < detailPropRadios.length; i++) {
                                detailPropRadios[i].click();
                            }
                            // 修改唯品会条码和唯品会货号
                            const vipCodeInputs = document.querySelectorAll('#SKUTABLE input[placeholder*="唯品会条码"]');
                            vipCodeInputs.forEach(input => {
                                // 获取当前input所在的tr
                                const currentTr = input.closest('tr');
                                if (currentTr) {
                                    // 在当前tr中查找placeholder包含"商家编码"的input
                                    const merchantCodeInput = currentTr.querySelector('input[placeholder*="商家编码"]');
                                    if (merchantCodeInput && merchantCodeInput.value) {
                                        // 使用商家编码的值作为唯品会条码
                                        input.value = merchantCodeInput.value;
                                    }
                                }
                                let ev = new Event('input');
                                input.dispatchEvent(ev);
                            });

                            // 处理唯品会货号 - 由于在rowspan的td中，需要通过表格行索引来匹配
                            const vipSkuInputs = document.querySelectorAll('#SKUTABLE input[placeholder*="唯品会货号"]');

                            // 为每个唯品会货号input找到对应tr中的商家编码
                            vipSkuInputs.forEach(vipSkuInput => {
                                // 获取当前input所在的tr
                                const currentTr = vipSkuInput.closest('tr');
                                if (currentTr) {
                                    // 在当前tr中查找placeholder包含"商家编码"的input
                                    const merchantCodeInput = currentTr.querySelector('input[placeholder*="唯品会条码"]');
                                    if (merchantCodeInput && merchantCodeInput.value) {
                                        // 使用商家编码的值作为唯品会货号
                                        vipSkuInput.value = merchantCodeInput.value.substring(0, 11);
                                        let ev = new Event('input');
                                        vipSkuInput.dispatchEvent(ev);
                                    }
                                }
                            });

                        } catch (err) {
                            console.log(err)
                            PIM.UnLoading();
                            PIM.IsAutoIng = false;
                        }
                    }
                });

                // 添加显示隐藏元素按钮的事件处理
                $("#xyPimToggleBtn").click(function () {
                    var btnText = $(this).text();
                    if (btnText === "显示元素") {
                        PIM.dispDefaultElement();
                        $(this).text("隐藏元素");
                        $(this).css("background", "#f05050");
                    } else {
                        PIM.hiddenElement();
                        $(this).text("显示元素");
                        $(this).css("background", "#e5d64f");
                    }
                });
            }
        },
        hiddenElementList: [
            'PLATFORM_PROP_6-COMMEND_SIZE_TABLE', 'PLATFORM_PROP_2-km_freight_charging_method', 'PLATFORM_PROP_2-PMDM_TB_568291254', 'PLATFORM_PROP_2-km_applicable_object', 'PLATFORM_PROP_2-PMDM_TB_TB_DELIVERY_TIME', 'PLATFORM_PROP_2-PMDM_TB_229183516', 'PLATFORM_PROP_6-118', 'PLATFORM_PROP_2-km_launch_time', 'PLATFORM_PROP_2-PMDM_TB_344943689', 'PLATFORM_PROP_6-2992', 'PLATFORM_PROP_6-km_length_vph', 'PLATFORM_PROP_6-km_width_vph', 'PLATFORM_PROP_6-km_height_vph', 'PLATFORM_PROP_6-km_wph_Weight', 'PLATFORM_PROP_6-km_gross_weight'
        ],
        defaultElementList: ['PLATFORM_PROP_4-km_packing_list', 'PLATFORM_PROP_4-118901', 'PLATFORM_PROP_4-JD_MODEL', 'PLATFORM_PROP_4-wareBigSmallModel', 'PLATFORM_PROP_4-km_place', 'PLATFORM_PROP_4-km_  gross_weight_of_goods_(kg)', 'PLATFORM_PROP_4-km_delivery', 'PLATFORM_PROP_4-km_payment_restrictions_jd', 'PLATFORM_PROP_4-km_same_in_shopping_mall', 'PLATFORM_PROP_4-km_to_block_corporate_transfers', 'PLATFORM_PROP_4-km_from_the_store_from_the_store', 'PLATFORM_PROP_4-km_invoice_type', 'PLATFORM_PROP_4-km_up_time', 'PLATFORM_PROP_4-km_off_time', 'PLATFORM_PROP_4-km_after_sale_service', 'PLATFORM_PROP_4-km_return_without_reason', 'PLATFORM_PROP_4-km_packing_length', 'PLATFORM_PROP_4-km_package_width', 'PLATFORM_PROP_4-km_packaging_high', 'PLATFORM_PROP_2-PMDM_TB_568267606', 'PLATFORM_PROP_2-PMDM_TB_size_model_try', 'PLATFORM_PROP_2-PMDM_TB_SITE_SIZE_TABLE', 'PLATFORM_PROP_4-km_jd_upc_codes', 'commonGoodsProp-km_product_type', 'commonGoodsProp-km_kl_place', 'PLATFORM_PROP_2-PMDM_TB_568246352', 'PLATFORM_PROP_2-PMDM_TB_568170480', 'PLATFORM_PROP_7-km_second_hang_goods', 'PLATFORM_PROP_7-km_full_discount', 'PLATFORM_PROP_7-km_pdd_Weight', 'PLATFORM_PROP_7-km_supports_a_fake_one_to_ten', 'PLATFORM_PROP_2-km_logistics_size/weight', 'PLATFORM_PROP_2-PMDM_TB_DELIVERY_TIMESET_BY_SKU', 'PLATFORM_PROP_2-PMDM_TB_DELIVERY_TIME_TYPE', 'PLATFORM_PROP_2-PMDM_TB_21299', 'PLATFORM_PROP_2-km_inventory_type', 'PLATFORM_PROP_2-km_tm_returns_promise', 'PLATFORM_PROP_2-km_repairment_guarantee', 'PLATFORM_PROP_2-km_fapiao', 'commonGoodsProp-km_type_of_reduction', 'PLATFORM_PROP_6-2266', 'PLATFORM_PROP_6-km_is_huge', 'PLATFORM_PROP_6-km_is_valuable', 'PLATFORM_PROP_6-km_whether_anti-counterfeiting_mark', 'PLATFORM_PROP_6-km_buying_hot_spots', 'PLATFORM_PROP_6-km_is_fragile_product', 'PLATFORM_PROP_6-2006', 'PLATFORM_PROP_6-2973'],
        // 隐藏不需要的元素
        hiddenElement: function () {
            PIM.hiddenElementList.forEach(function (elementId) {
                var el = document.getElementById(elementId);
                if (el && el.tagName.toLowerCase() == 'div') {
                    el.style.display = 'none';
                }
            });
            PIM.defaultElementList.forEach(function (elementId) {
                var el = document.getElementById(elementId);
                if (el && el.tagName.toLowerCase() == 'div') {
                    el.style.display = 'none';
                }
            });
        },
        dispDefaultElement: function () {
            PIM.defaultElementList.forEach(function (elementId) {
                var el = document.getElementById(elementId);
                if (el && el.tagName.toLowerCase() == 'div') {
                    el.style.display = '';
                }
            });
            // 尺码表赋值
        },
        DealSizeTable: function (datas) {
            // 获取部位名称（列）
            let headerInputs = document.querySelectorAll(
                '#saleProp-km_sizetable_vip .size-table__container .header_row input'
            );
            let values = Array.from(headerInputs).map(input => (input.value || '').trim());
            // 获取尺码名称（行）
            let sizeInputs = document.querySelectorAll(
                '#saleProp-km_sizetable_vip .size-table__container .body_row  .cell_border_left input'
            );
            let sizeValues = Array.from(sizeInputs).map(input => (input.value || '').trim());
            // 所有数据行
            let rows = document.querySelectorAll('#saleProp-km_sizetable_vip .size-table__container .body_row');
            // 列索引映射：PomName -> 列下标
            let pomIndexMap = {};
            values.forEach((v, i) => { if (v) pomIndexMap[v] = i; });
            // 按数据写入对应单元格
            (datas || []).forEach(item => {
                if (!item) return;
                let pomName = (item.PomName || '').trim();
                let itemName = (item.ItemName || '').trim();
                let cellValue = item.SizeData;
                let colIdx = pomIndexMap.hasOwnProperty(pomName) ? pomIndexMap[pomName] : -1;
                let rowIdx = sizeValues.indexOf(itemName);
                if (colIdx < 0 || rowIdx < 0 || rowIdx >= rows.length) return;
                let row = rows[rowIdx];
                let cells = row.querySelectorAll('.cell input');
                let target = cells[colIdx];
                if (target && (!target.value || target.value.trim() === "")) {
                    target.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true, composed: true }));
                    target.value = cellValue;
                    target.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
                    target.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true, composed: true }));
                }
            });
            // 所有单元格空的填为 “/”
            rows.forEach(function (row) {
                let allCells = row.querySelectorAll('.cell input');
                allCells.forEach(function (input) {
                    if (!input || (input.value && input.value.trim() !== "")) return;
                    input.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true, composed: true }));
                    input.value = '/';
                    input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
                    input.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true, composed: true }));
                });
            });
        },
        // 选择材质
        SelectMt: function (container, components) {
            if (container) {
                // 检查是否存在 material-form-item 元素，如果存在则不执行
                if (container.querySelector('.pmdm-select-selection-selected-value')) {
                    return;
                }
                var i = 0;
                var clikcMtComp = function (container, components) {
                    // 先确保新增出与 components 数量相同的下拉框
                    var targetCount = components.length;
                    var tryAdd = 0;
                    function ensureCombos() {
                        var count = container.querySelectorAll('div[role="combobox"]').length;
                        var btn = container.querySelector('button[class*="pmdm-btn-primary"]');
                        if (count < targetCount && btn) {
                            btn.click();
                            if (tryAdd++ < 50) {
                                return setTimeout(ensureCombos, 120);
                            }
                        }
                        // 开始逐项选择
                        selectAt(0);
                    }
                    function selectAt(index) {
                        if (index >= components.length) {
                            return;
                        }
                        var triesCombo = 0;
                        (function waitCombo() {
                            var combos = container.querySelectorAll('div[role="combobox"]');
                            var combo = combos[index] || null;
                            if (!combo) {
                                if (triesCombo++ < 50) return setTimeout(waitCombo, 100);
                                return;
                            }
                            combo.click();
                            var triesList = 0;
                            (function waitList() {
                                var uid = combo.getAttribute('aria-controls');
                                var parent = uid ? document.getElementById(uid) : null;
                                if (!parent) {
                                    if (triesList++ < 50) return setTimeout(waitList, 100);
                                    return;
                                }
                                var componentText = components[index].Component;
                                var lis = Array.from(parent.querySelectorAll('li'));
                                var trimmedTarget = (componentText || '').trim();
                                // 1) 精确匹配
                                var exactLi = lis.find(function (li) { return li.innerText.trim() === trimmedTarget; });
                                var selected = false;
                                if (exactLi) {
                                    exactLi.click();
                                    selected = true;
                                } else {
                                    // 2) 括号中精确匹配：()、（） 、[]、【】
                                    var parenLi = null;
                                    for (var k = 0; k < lis.length && !parenLi; k++) {
                                        var t = lis[k].innerText || '';
                                        var patterns = [/\(([^)]+)\)/g, /（([^）]+)）/g, /\[([^\]]+)\]/g, /【([^】]+)】/g];
                                        for (var p = 0; p < patterns.length && !parenLi; p++) {
                                            var m;
                                            while ((m = patterns[p].exec(t)) !== null) {
                                                if ((m[1] || '').trim() === trimmedTarget) { parenLi = lis[k]; break; }
                                            }
                                        }
                                    }
                                    if (parenLi) {
                                        parenLi.click();
                                        selected = true;
                                    } else {
                                        // 3) 包含匹配：在包含的候选中按"匹配度"评分选择最佳
                                        var candidates = lis.filter(function (li) { return (li.innerText || '').indexOf(componentText) != -1; });
                                        if (candidates.length > 0) {
                                            var best = candidates.reduce(function (prev, cur) {
                                                var prevText = (prev.innerText || '').trim();
                                                var curText = (cur.innerText || '').trim();
                                                var t = trimmedTarget;
                                                function scoreOf(s) {
                                                    var score = 0;
                                                    if (s.indexOf(t) !== -1) {
                                                        if (s.indexOf(t) === 0) score += 2; // 前缀更优
                                                        if (s.lastIndexOf(t) === s.length - t.length) score += 1; // 后缀次之
                                                        // 长度越接近分越高
                                                        score += 1 / (1 + Math.abs(s.length - t.length));
                                                    }
                                                    return score;
                                                }
                                                var sp = scoreOf(prevText);
                                                var sc = scoreOf(curText);
                                                if (sc > sp) return cur;
                                                if (sc < sp) return prev;
                                                // 打平时更短更接近目标
                                                return curText.length < prevText.length ? cur : prev;
                                            }, candidates[0]);
                                            best.click();
                                            selected = true;
                                        } else {
                                            var others = lis.filter(function (li) { return (li.innerText || '').indexOf('其它') != -1; });
                                            if (others.length > 0) {
                                                others[0].click();
                                                selected = true;
                                            } else if (lis.length > 0) {
                                                lis[0].click();
                                                selected = true;
                                            }
                                        }
                                    }
                                }
                                // 选中后填入对应含量输入框
                                if (selected) {
                                    setTimeout(function () {
                                        var inputs = container.querySelectorAll('input[placeholder*="请输入含量"]');
                                        var vInput = inputs[index] || null;
                                        if (vInput) {
                                            vInput.dispatchEvent(new Event('focus', { bubbles: true, cancelable: true, composed: true }));
                                            vInput.value = components[index].Value.replace('%', '');
                                            vInput.dispatchEvent(new Event('input', { bubbles: true, cancelable: true, composed: true }));
                                            vInput.dispatchEvent(new Event('blur', { bubbles: true, cancelable: true, composed: true }));
                                        }
                                        setTimeout(function () { selectAt(index + 1); }, 100);
                                    }, 50);
                                } else {
                                    setTimeout(function () { selectAt(index + 1); }, 150);
                                }
                                setTimeout(function () { selectAt(index + 1); }, 150);
                            })();
                        })();
                    }
                    ensureCombos();
                }
                setTimeout(function () { clikcMtComp(container, components); }, 150);
            }
        }
    };

    //唯品会
    var VIP = {
        Init: function () {
            console.log('初始化' + window_url)
            if (window_url.indexOf("admin#/product/edit") != -1) {
                VIP.DisplayBtn();
                console.log('进来了')
            }
        }, // 显示按钮
        DisplayBtn: function () {
            // 检查页面上是否存在浮窗按钮
            var xyDiv = document.getElementById("xyPimDiv");
            if (!xyDiv) {
                xyDiv = document.createElement("span");
                // var html = '<div class="xyCloseAllbutton" style="color:red;background: #e5d64f;font-weight: bold;height: 32px;display: flex;width: 90px;border: 0px;border-radius: 4px;cursor: pointer;font-size: 13px;position: absolute;z-index: 999;top: 8px;right: 20px;justify-content: center;align-items: center;">关闭全部</div>';
                var html = '';
                html += '<div id="xyPimDiv" style="position: absolute;	top: 25vh;right: 0;display: flex;justify-content: center;flex-direction: column;width: 80px;padding: 16px 10px 16px 10px;background: #ffffff;border-top-left-radius: 10px;border-bottom-left-radius: 10px;border: 1px solid #1966ff;align-items: center;">';
                html += "<div style='display:none;text-align: center;'><img id='codeImg' style='width:200px;'><div id='xytitle' style='margin-bottom:10px;'></div><div id='compent'></div></div>";
                html += '<button id="xyPimStartBtn" style="border:0px;background:#1966ff;color:#fff;width: 100%;">开始</button>';
                html += '</div>';
                xyDiv.innerHTML = html;
                // 如果不存在，则创建一个新的元素并添加到页面上
                document.body.appendChild(xyDiv);
                $("#xyPimStartBtn").click(function () {
                    function findElementByClass(root, className) {
                        if (root.$el.classList && root.$el.classList.contains(className)) {
                            return root;
                        }
                        for (const child of root.$children) {
                            const found = findElementByClass(child, className);
                            if (found) return found;
                        }
                        return null;
                    }

                    const target = findElementByClass(document.querySelector('#app').__vue__, 'header-btn');
                    console.log('xingyou:');
                    target.$el.click()
                    $(findElementByClass(document.querySelector('#app').__vue__, 'multiple-select-box')).find('.el-select__input').click()
                });
            }
        }
    };

    //店家系统
    var DianPlus = {
        Init: function () {
            console.log('初始化' + window_url)
            if (window_url.indexOf("module=603&menu=60308") != -1) {
                //每秒检测，页面包含center_content，但是不包含.adContents，则执行ChangePosScreen
                setInterval(function () {
                    if (($(".center_content").length > 0 && $(".adContents").length == 0) || $(".center_content").length == 0) {
                        DianPlus.ChangePosScreen();
                    }
                }, 1000)
            }
            if (window_url.indexOf("module=601&menu=60105") != -1) {
                setTimeout(function () {
                    DianPlus.ChangePos();
                }, 3000)
            }
        }, ChangePos: function () {
            //在 .fast-link 最后追加 a 标签，打开新浏览器，跳转到https://pos.dianplus.cn/?module=603&menu=60308#/
            $('.fast-link').append('<a style="color:#000;border-color: red;" target="_blank"' + ' href="https://pos.dianplus.cn/?module=603&menu=60308#/">打开副屏</a>');
        }, ChangePosScreen: function () {
            //移除 $("#dj-menu-content") 的同级元素
            $("#dj-menu-content").siblings().remove();
            //设置 $("#dj-menu-content") 的inset 是 0
            $("#dj-menu-content").css("inset", "0");
            //设置.leftContent 的 height 是 100%，margin-top 和 margin-bottom 是 0，宽度是 30%
            $(".leftContent").css({
                "height": "100%", "margin-top": "0px", "margin-bottom": "0px", "border-radius": "0px", "width": "30%"
            });
            //设置 .rightContent 的 border-left 是 2px solid #666666，左上角和左小角的border-radius 是 0，右上角和右下角的圆角是 20px，宽度是 20%
            $(".rightContent").css({
                "border": "0px",
                "border-left": "2px dotted #666666",
                "border-top-left-radius": "0",
                "border-bottom-left-radius": "0",
                "border-top-right-radius": "20px",
                "border-bottom-right-radius": "20px",
                "width": "20%"
            });
            //在 .leftContent 前面增加一个自定义的 .adContent 的 div，宽度是 50%，高度是 100%，左上角和左小角的border-radius 是 20px，右上角和右下角的圆角是 0px
            $(".adContents").remove();
            $(".leftContent").before("<div class='adContents'></div>");
            $(".adContents").css({
                "height": "100%", "border-radius": "20px 0px 0px 20px", "width": "50%", "background": "#fff"
            })

            //.center_content 的 display:flex
            $(".center_content").css({
                "display": "flex",
            })

            //.dianjia 隐藏
            $(".dianjia").css({
                "display": "none"
            })

            //.titlelayout 隐藏
            $(".titlelayout").css({
                "display": "none"
            })

            //.welcome 隐藏
            $(".welcome").css({
                "display": "none"
            })

            //.titlelayout 同级的上一个 img,设置宽度为 100px,高度为自动
            $(".titlelayout").prev("img").css({
                "width": "100px", "height": "auto"
            })

            //.ant-table-thead > tr > th 的text-align: center;
            $(".ant-table-thead > tr > th").css({
                "text-align": "center"
            })

            //td 的 text-align: center !important;
            $("td").css({
                "text-align": "center"
            })

            //给 .adContents 设置内容是一个图片轮播, 5s 切换一张图片，根据图片数组 carouselImages 来轮播图片
            // 1. 定义参数
            var localData = JSON.parse(window.localStorage.getItem("extScreenData"));
            var entId = localData.orderOption.perferSetOption.entId;
            var storageId = localData.orderOption.perferSetOption.storageId;
            var carouselImages = [];

            // 2. 发送POST请求获取图片数据
            $.ajax({
                url: "/rs/corp/vicescreenconfig/get_by_storageId.do", type: "POST", data: {
                    entId: entId, storageId: storageId
                }, xhrFields: {
                    withCredentials: true // 携带cookie
                }, success: function (res) {
                    if (res && res.resultObject && res.resultObject.imgConfigs) {
                        carouselImages = JSON.parse(res.resultObject.imgConfigs);
                        // 1. 插入两个img标签用于横向滚动切换
                        $(".adContents").html('<div class="carouselWrap" style="position:relative;width:100%;height:100%;overflow:hidden;border-radius:20px 0 0 20px;">' + '<img id="carouselImg1" style="position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;transition:left 0.5s;" />' + '<img id="carouselImg2" style="position:absolute;top:0;left:100%;width:100%;height:100%;object-fit:cover;transition:left 0.5s;" />' + '</div>');
                        $("#carouselImg1").attr("src", carouselImages[0].imgUrl);
                        var currentIndex = 0;
                        var nextIndex = 1;
                        var total = carouselImages.length;
                        var showingFirst = true; // 当前显示的是1号img
                        setInterval(function () {
                            nextIndex = (currentIndex + 1) % total;
                            if (showingFirst) {
                                $("#carouselImg2").attr("src", carouselImages[nextIndex].imgUrl).css("left", "100%");
                                $("#carouselImg1").css("left", "-100%");
                                $("#carouselImg2").css("left", "0");
                            } else {
                                $("#carouselImg1").attr("src", carouselImages[nextIndex].imgUrl).css("left", "100%");
                                $("#carouselImg2").css("left", "-100%");
                                $("#carouselImg1").css("left", "0");
                            }
                            setTimeout(function () {
                                if (showingFirst) {
                                    // 先移除transition，重置left后再恢复
                                    $("#carouselImg1").css("transition", "none").css("left", "100%");
                                    // 强制reflow，确保transition移除生效
                                    void $("#carouselImg1")[0].offsetWidth;
                                    $("#carouselImg1").css("transition", "left 0.5s");
                                } else {
                                    $("#carouselImg2").css("transition", "none").css("left", "100%");
                                    void $("#carouselImg2")[0].offsetWidth;
                                    $("#carouselImg2").css("transition", "left 0.5s");
                                }
                                currentIndex = nextIndex;
                                showingFirst = !showingFirst;
                            }, 500);
                        }, 5000);
                    }
                }, error: function (xhr, status, error) {
                    console.log(error);
                }
            });


            //每秒轮询 $(".vip").text() 如果内容是暂无会员信息，则把.vip 的内容设置为入会的微信服务号二维码图片
            $(".vip").append("<div class='vipImg' style='text-align: center;'></div>");
            setInterval(function () {
                if ($(".vip").text() == "暂无会员信息" || $(".vip").text() == "") {
                    if ($(".vipImg").find("img").length == 0) {
                        $(".vipImg").html("<img" + " src='https://img.dianplus.cn/vpc/13821/gh_d89f67af4619/pubqrcode/gh_d89f67af46191750661082101.png' style='width:80%;height:auto;' />");
                        $(".vip").find("p").remove();
                    }
                }
                //如果内容里面出现 好物考拉会员 则移除二维码图片.vipImg
                if ($(".vip").text().indexOf("好物考拉会员") > -1) {
                    $(".vipImg").empty();
                }
            }, 1000)
        }
    };

    //工具类
    var Tools = {
        AddFetchListener: function (listenUrl, callBack) {
            // 拦截 fetch
            const originalFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = function (...args) {
                const requestUrl = args[0] instanceof Request ? args[0].url : args[0];
                if (requestUrl.includes(listenUrl)) {
                    return originalFetch.apply(this, args).then(response => {
                        const clonedResponse = response.clone();
                        clonedResponse.text().then(text => {
                            callBack(text);
                        }).catch(err => {
                            console.error('Error reading response:', err);
                        });
                        return response;
                    }).catch(err => {
                        console.error('Fetch request failed:', err);
                        throw err;
                    });
                }
                return originalFetch.apply(this, args);
            };
        }, //随机排序
        Fn: function (n) {
            var array = new Array();
            for (var i = 0; i < n; i++) {
                var rnd = Math.floor(Math.random() * n);
                if (Tools.IsIncluded(rnd, array)) {
                    i--;
                } else {
                    array.push(rnd);
                }
            }
            return array;
        }, IsIncluded: function (element, array) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] == element) {
                    return true;
                }
            }
            return false;
        }, GetQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }, GetCookie: function (name) {
            // 将 document.cookie 字符串按分号分割成数组
            var cookies = document.cookie.split("; ");
            var cookie;

            // 遍历 cookies 数组，查找指定名称的 cookie
            for (var i = 0; i < cookies.length; i++) {
                cookie = cookies[i];
                // 当找到匹配项时，使用等号分割获取值
                while (cookie.charAt(0) === " ") {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(name + "=") === 0) {
                    // 解码 cookie 值（如果之前进行了编码）
                    return decodeURIComponent(cookie.substring(name.length + 1, cookie.length));
                }
            }
            return ""; // 如果没有找到 cookie，则返回空字符串
        }, //根据文本，找到内容是这个文本的 div
        FindDivByText: function (text) {
            // 获取页面上所有的 div 元素
            const allDivs = document.querySelectorAll("div");
            const allPs = document.querySelectorAll("p");

            // 定义一个数组来保存包含特定文本的 div 元素
            const divs = [];

            // 遍历所有的 div 元素并检查它们的文本内容
            allDivs.forEach((div) => {
                // 获取 div 的文本内容
                const textContent = div.innerText;
                // 检查文本内容是否包含 "SKU货号："

                if (div.querySelectorAll("div").length == 0 && textContent.indexOf(text) == 0) {
                    divs.push(div);
                }
            });
            allPs.forEach((div) => {
                // 获取 div 的文本内容
                const textContent = div.innerText;
                // 检查文本内容是否包含 "SKU货号："

                if (textContent.indexOf(text) == 0) {
                    divs.push(div);
                }
            });
            return divs;
        }, PlayAudio: function (audioUrl) {
            // 检查页面上是否已经存在音频元素
            // 检查页面上是否已经存在音频元素
            var audioElement = document.getElementById("xyAudio");
            if (!audioElement) {
                // 如果不存在，则创建一个新的<audio>元素并添加到页面上
                audioElement = document.createElement("audio");
                audioElement.id = "xyAudio";
                document.body.appendChild(audioElement);
            }

            // 设置音频源后，先暂停并重置当前音频
            if (!audioElement.paused) {
                audioElement.pause();  // 暂停当前音频
                audioElement.currentTime = 0;  // 重置播放进度
            }

            // 设置新的音频源
            audioElement.src = audioUrl;

            // 在设置完 src 后加载音频，确保音频准备好播放
            audioElement.load();

            // 你可以选择保留 autoplay 或直接调用 play()
            //audioElement.autoplay = true; // 设置自动播放
            audioElement.loop = false; // 设置循环播放，可选
            audioElement.volume = 1; // 设置音量，可选

            // 播放音频
            audioElement.play().catch(function (error) {
                console.error("播放音频时出错:", error);
            });
        }, Init: function () {
            switch (website_host) {
                case "www.2haohr.com":
                case "2haohr.com":
                    HaoHrFunctions.Init();
                    break;
                case "team.qq.com":
                    TeamQQ.Init();
                    break;
                case "www.jeoms.com":
                    JeOms.Init();
                    break;
                case "agentseller.temu.com":
                    Temu.Init();
                    break;
                case "seller.kuajingmaihuo.com":
                    Temu.Init();
                    break;
                case "www.mabangerp.com":
                    MaBangErp.Init();
                    break;
                case "yunbi-public.mabangerp.com":
                    MaBangErp.DealCorsPage();
                    break;
                case "liveplatform.taobao.com":
                    TBLiving.Init();
                    break;
                case "buyin.jinritemai.com":
                    JinRiTouTiao.Init();
                    break;
                case "pim.leycloud.com":
                    PIM.Init();
                    break;
                case "pdc-portal.vip.com":
                    VIP.Init();
                    break;
                case "pos.dianplus.cn":
                    DianPlus.Init();
                    break;
            }
        },
    };

    Tools.Init();
})();