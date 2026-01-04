// ==UserScript==
// @name         库存页面工具合集
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  获取当前页面Asin；一键下架；获取各asin的信息（购物车、品牌）；定时下架；上架；
// @author       zhanc
// @match        https://sellercentral.amazon.co.uk/inventory*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @connect      *
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469015/%E5%BA%93%E5%AD%98%E9%A1%B5%E9%9D%A2%E5%B7%A5%E5%85%B7%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/469015/%E5%BA%93%E5%AD%98%E9%A1%B5%E9%9D%A2%E5%B7%A5%E5%85%B7%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

//防止与原页面的jquery冲突
this.$ = this.jQuery = jQuery.noConflict(true);
(async function () {
    'use strict';
    var amz_host = "http://www.zhanc.fun:8091"
    var timing_Remove = "07:00:00";
    var shopName = await getShopName();
    var ignoreList = await getIgnoreList(shopName);

    //获取店名
    function getShopName() {
        return new Promise(res => {
            let a = setInterval(() => {
                if (document.querySelector("#partner-switcher > button > span > b") != null) {
                    res(document.querySelector("#partner-switcher > button > span > b").innerText.trim());
                    clearInterval(a);
                }
            }, 500);
        })

    }


    //获取铺货ASIN
    function getIgnoreList(shop_name) {
        return new Promise(ret => {
            GM_xmlhttpRequest({
                method: "GET",
                url: amz_host + '/ignoreAsin/list?shopName=' + shop_name,
                data: "",
                onload: function (res) {
                    var resp = JSON.parse(res.response);
                    var result = null
                    if (resp.totalElements > 0) {
                        var entity = resp.content[0];
                        console.log("成功获取铺货ASIN");
                        result = entity.asinList;
                    } else {
                        alert("未查询到该店铺下的铺货asin");
                    }
                    ret(result);
                }
            });
        });
    }

    $("body").append('<div id="dg" style="z-index: 99999999; position: fixed ! important; right: 0px; top: 0px;">' +
        '<table width=""100% style="position: absolute; width:260px; right: 0px; top: 0px;">' +
        '<button type="button" id="getAllAsin">获取当前页面ASIN</button>' +
        '<button type="button" id="timingRemove" disabled>定时下架</button>' +
        '<button type="button" id="saveCurrentStat">保存当前上架</button>' +
        '<button type="button" id="upShelf">上架</button>' +
        '<button type="button" id="setBtn">一键设0库存</button>' +
        '<button type="button" id="getFB">获取信息</button>' +
        '</table></div>');

    $("#getAllAsin").click(function () {
        var arr = $("div[data-column='asin'] > div > span");
        var asinList = ""
        for (let i = 0; i < arr.length; i++) {
            asinList += arr[i].innerText + ",";
        }
        asinList = asinList.substring(0, asinList.length - 1);
        console.log("共" + arr.length + "个ASIN")
        GM_setClipboard(asinList)
    })

    //定时下架
    $("#timingRemove").click(function () {

        var t = prompt("请输入定时：(格式为：hh:mm:ss)(取消请直接刷新页面)", "");
        timing_Remove = t;
        console.log("下架定时：" + timing_Remove);
        document.querySelector("#timingRemove").innerText = document.querySelector("#timingRemove").innerText + "(" + timing_Remove + ")";
        let tm = setInterval(() => {
            console.log('当前：%d:%d:%d', new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
            let nowtime = p(new Date().getHours()) + ':' + p(new Date().getMinutes()) + ':' + p(new Date().getSeconds())
            if (nowtime == timing_Remove) {
                $("#setBtn").click();
                clearInterval(tm);
                let tm2 = setInterval(() => {
                    var save_all_btn = document.querySelector("#saveall > span > span");
                    if (save_all_btn.className.indexOf("disabled") == -1) {
                        save_all_btn.click();
                        clearInterval(tm2);
                    }
                    console.log("等待保存按键...")
                }, 1000);
            }
        }, 1000);


    })

    function p(num) {
        return num < 10 ? '0' + num : num
    }

    //保存当前上架内容
    $("#saveCurrentStat").click(async function () {
        if (!confirm("是否保存当前上架内容？")) {
            return;
        }
        // for (let index = 0; index < 11; index++) {
        //     //获取当前页数index
        //     var page_index = 1; //默认为第一页
        //     var current_url = window.location.href;
        //     if (current_url.indexOf("pagination:") != -1) {
        //         var t = current_url.split("pagination:")[1];
        //         t = t.replace(";", "");
        //         page_index = parseInt(t);
        //     }
        //     console.log(page_index);
        //     document.querySelector("#myitable-pagination > ul > li.a-last > a").click()
        //     var tick = setInterval(function () {
        //         var block = document.querySelector(".mt-loading-overlay");
        //         var attr = block.getAttribute("style");
        //         if (attr.indexOf("none") != -1) {
        //             clearInterval(tick);
        //         }
        //     }, 300);
        // }

        //获取页数
        //var page_count = document.querySelector(".mt-totalpagecount").innerText.split(" ")[1];
        //获取当前页数index
        var page_index = 1; //默认为第一页
        var current_url = window.location.href;
        if (current_url.indexOf("pagination:") != -1) {
            var t = current_url.split("pagination:")[1];
            t = t.replace(";", "");
            page_index = parseInt(t);
        }




        //获取上架内容
        var upshelf_asin_list = []
        var upshelf_content = {}
        var trList = $("table.a-bordered.a-horizontal-stripes.mt-table tbody")[0].children;
        for (let i = 1; i < trList.length; i++) {   //跳过第一条tr（表头）
            var id = trList[i].id;   //获取该行id
            try {
                var asin_str = $("#" + id + "-title-asin > div > span")[0].innerText;    //获取asin
                if (ignoreList.indexOf(asin_str) == -1) {
                    upshelf_asin_list.push(asin_str);
                    var quantity = $("#" + id + "-quantity-quantity > div > span > input")[0].value;    //获取数量
                    upshelf_content[asin_str] = quantity;
                }
                //var now_price = $("#" + id + "-price-price > div > span > input")[0].value;    //获取价格
                if (parseInt(quantity) == 0) {
                    continue
                }
            } catch (error) {
                trList[i].setAttribute("style","background:#fff0f0")
                alert("获取页面元素出错（出错行已标记），请稍后重新尝试...")
            }

        }

        if (upshelf_asin_list.length == 0) {
            alert("当前没有上架的商品......");
        } else {
            var final_dict = {}
            final_dict[("upshelf_asin_list" + page_index)] = upshelf_asin_list;
            final_dict[("upshelf_content" + page_index)] = upshelf_content;
            var save_result = await setCurrentUpshelf(final_dict, page_index);
            if (save_result == "true")
                console.log("保存成功!");
            else
                alert("保存失败，请联系管理员...");

        }

    })

    //保存当前上架内容至服务器
    function setCurrentUpshelf(asin_dict, page_index) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST",
                url: amz_host + '/upshelfAsin/add',
                data: "shopName=" + (shopName + page_index) + "&asinDict=" + JSON.stringify(asin_dict),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
                },
                onload: function (resp) {
                    resolve(resp.response);
                }
            });
        })
    }

    //从服务器获取上架内容
    function getCurrentUpshelf(page_index) {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: amz_host + '/upshelfAsin/find/' + (shopName + page_index),
                data: "",
                onload: function (resp) {
                    resolve(resp.response);
                }
            });
        })
    }


    //一键上架
    $("#upShelf").click(async function () {
        //获取当前页数index
        var page_index = 1; //默认为第一页
        var current_url = window.location.href;
        if (current_url.indexOf("pagination:") != -1) {
            var t = current_url.split("pagination:")[1];
            t = t.replace(";", "");
            page_index = parseInt(t);
        }

        //var set_quantity = prompt("请要输入上架数量：");
        var upshelf_dict = JSON.parse(await getCurrentUpshelf(page_index));
        var upshelf_asin_list = upshelf_dict["upshelf_asin_list" + page_index].toString().split(",");
        var upshelf_content = upshelf_dict["upshelf_content" + page_index];

        var trList = $("table.a-bordered.a-horizontal-stripes.mt-table tbody")[0].children;
        for (let i = 1; i < trList.length; i++) {   //跳过第一条tr（表头）
            var id = trList[i].id;   //获取该行id
            var asin_str = $("#" + id + "-title-asin > div > span")[0].innerText;    //获取asin
            if (upshelf_asin_list.indexOf(asin_str) != -1) {
                var el = $("#" + id + "-quantity-quantity > div > span > input")[0];
                var lastValue = el.value;
                el.value = upshelf_content[asin_str];
                let event = new Event("keyup", { bubbles: true });
                event.simulated = true;
                let tracker = el._valueTracker;
                if (tracker) {
                    tracker.setValue(lastValue);
                }
                el.dispatchEvent(event);
            }
        }
    });

    //一键库存设0
    $("#setBtn").click(function () {
        var trList = $("table.a-bordered.a-horizontal-stripes.mt-table tbody")[0].children;
        for (let i = 1; i < trList.length; i++) {   //跳过第一条tr（表头）
            var id = trList[i].id;   //获取该行id
            var asin_str = $("#" + id + "-title-asin > div > span")[0].innerText;    //获取asin
            if (ignoreList.indexOf(asin_str) == -1) {
                var el = $("#" + id + "-quantity-quantity > div > span > input")[0];
                var lastValue = el.value;
                el.value = 0;
                let event = new Event("keyup", { bubbles: true });
                event.simulated = true;
                let tracker = el._valueTracker;
                if (tracker) {
                    tracker.setValue(lastValue);
                }
                el.dispatchEvent(event);
            }
        }
    });


    //获取信息
    $("#getFB").click(async function () {
        var isBrand = false;
        if (confirm("是否需要获取品牌？（获取品牌时间较久）")) {
            isBrand = true;
        }
        var trList = $("table.a-bordered.a-horizontal-stripes.mt-table tbody")[0].children;
        for (let i = 1; i < trList.length; i++) {   //跳过第一条tr（表头）
            var id = trList[i].id;   //获取该行id
            var asin_str = $("#" + id + "-title-asin > div > span")[0].innerText;    //获取asin
            if (ignoreList.indexOf(asin_str) == -1) {
                let df = "";
                if (isBrand) {
                    df = await getDispatchFrom(asin_str);
                } else {
                    df = await getDispatchFromNoBrand(asin_str);
                }
                var arr = df.split("|");
                let disp_from = arr[0];
                let seller = arr[1];
                if (seller.indexOf(shopName) == -1) {
                    seller = "<span style='color:orange'>" + seller + "</span>";
                }
                let seller_count = arr[2];
                let cart_price = arr[3];
                let delivery_time = arr[4];
                let seller_info = arr[5];
                let final_str = "";
                if (isBrand) {
                    let brand = arr[6];
                    final_str = "<br><hr style='margin:0 auto'>" + "发货：" + disp_from + " <span title='" + seller_info + "'>[" + seller_count + "]</span><br>"
                        + "卖家：" + seller + "<br>"
                        + "品牌：" + brand + "<br>"
                        + "购物车价格：" + cart_price + "<br>"
                        + "预计送达时间：" + delivery_time + "<br><br>";
                } else {
                    final_str = "<br><hr style='margin:0 auto'>" + "发货：" + disp_from + " <span title='" + seller_info + "'>[" + seller_count + "]</span><br>"
                        + "卖家：" + seller + "<br>"
                        + "购物车价格：" + cart_price + "<br>"
                        + "预计送达时间：" + delivery_time + "<br><br>";
                }
                $("#" + id + "-title-asin > div").append(final_str);
                //购物车价格
                $("#" + id + "-price-shipping_template").append("<p style='margin-bottom:2px'>购物车价格:" + cart_price + "</p>")
            }
        }
    })



    //获取信息
    function getDispatchFrom(asin) {
        return new Promise(res => {
            GM_xmlhttpRequest({
                method: "GET",
                url: 'https://www.amazon.co.uk/dp/' + asin + '/ref=olp-opf-redir?aod=1&ie=UTF8&condition=NEW',
                //url: 'https://www.amazon.co.uk/gp/product/ajax/ref=auto_load_aod?asin=' + asin + '&pc=dp&experienceId=aodAjaxMain',
                data: '',
                onload: function (resp) {
                    //console.log(resp);
                    var parser = new DOMParser();
                    var page = parser.parseFromString(resp.responseText, "text/html");
                    //发货
                    var dispatch_from = "";
                    try {
                        dispatch_from = page.querySelector("#tabular-buybox > div.tabular-buybox-container > div:nth-child(4) > div > span").innerText.trim();
                    } catch (error) {
                        dispatch_from = "未查询到发货方式";
                    }

                    //当前卖家
                    var seller = "";
                    try {
                        seller = page.querySelector("#sellerProfileTriggerId").innerText;
                    } catch (error) {
                        seller = "未查询到卖家";
                    }

                    //购物车价格
                    let cart_price = "";
                    try {
                        cart_price = page.querySelector("#twister-plus-price-data-price-unit").value + page.querySelector("#twister-plus-price-data-price").value;
                    } catch (error) {
                        cart_price = "未查询到购物车价格";
                    }

                    //预计送达时间
                    let delivery_time = "";
                    try {
                        delivery_time = page.querySelector("#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE > span > span").innerText;
                    } catch (error) {
                        delivery_time = "未查询到预计送达时间";
                    }

                    //品牌
                    let brand = "";
                    try {
                        brand = page.querySelector("#bylineInfo").innerText.trim();
                        if (brand.indexOf('Visit the ') != -1) {
                            brand = brand.replace('Visit the', '');
                            brand = brand.replace(' Store', '');
                        } else {
                            brand = brand.split(':')[1].trim();
                        }
                    } catch (error) {
                        brand = "未查询到品牌";
                    }

                    //获取跟卖数量
                    let seller_count = 0;
                    try {
                        var seller_str = page.querySelector("#olpLinkWidget_feature_div > div.a-section.olp-link-widget > span > a > div > div > span:nth-child(1)").innerText;
                        seller_count = seller_str.slice(seller_str.indexOf("(") + 1, seller_str.indexOf(")"));
                    } catch (error) {
                        seller_count = 0;
                    }

                    //获取跟卖详情（名字+价格）
                    let seller_info = "";
                    try {
                        var info_list = page.querySelectorAll("#aod-offer-list>div");
                        info_list.forEach(info => {
                            let info_price = info.querySelector(".a-offscreen").innerText;
                            let info_dispatchfrom = info.querySelector("span[class='a-size-small a-color-base']").innerText;
                            seller_info += (info_dispatchfrom + "&nbsp;" + info_price + "&#10;")
                        });
                    } catch (error) {
                        seller_info = "";
                    }

                    var final_res = dispatch_from + "|" + seller + "|" + seller_count + "|" + cart_price + "|" + delivery_time + "|" + seller_info + "|" + brand;
                    res(final_res);

                }
            });
        })
    }

    //获取信息（不含品牌）
    function getDispatchFromNoBrand(asin) {
        return new Promise(res => {
            GM_xmlhttpRequest({
                method: "GET",
                url: 'https://www.amazon.co.uk/gp/product/ajax/ref=auto_load_aod?asin=' + asin + '&pc=dp&experienceId=aodAjaxMain',
                data: '',
                onload: function (resp) {
                    //console.log(resp);
                    var parser = new DOMParser();
                    var page = parser.parseFromString(resp.responseText, "text/html");
                    //发货
                    var dispatch_from = "";
                    try {
                        dispatch_from = page.querySelector("#aod-offer-shipsFrom > div > div > div.a-fixed-left-grid-col.a-col-right > span").innerText.trim();
                    } catch (error) {
                        dispatch_from = "未查询到发货方式";
                    }

                    //当前卖家
                    var seller = "";
                    try {
                        seller = page.querySelector("#aod-offer-soldBy > div > div > div.a-fixed-left-grid-col.a-col-right > a").innerText;
                    } catch (error) {
                        seller = "未查询到卖家";
                    }

                    //购物车价格
                    let cart_price = "";
                    try {
                        //有些异常页面用这个
                        //cart_price = page.querySelector("#aod-price-0 > span > span.a-offscreen").innerText;
                        cart_price = page.querySelector("#aod-price-0 > div > span > span.a-offscreen").innerText;
                        let delivery = page.querySelector("#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE > span").innerText;
                        cart_price = cart_price + " + " + delivery.split("delivery ")[0] + "delivery";
                    } catch (error) {
                        cart_price = "未查询到购物车价格";
                    }

                    //预计送达时间
                    let delivery_time = "";
                    try {
                        delivery_time = page.querySelector("#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE > span > span").innerText;
                    } catch (error) {
                        delivery_time = "未查询到预计送达时间";
                    }

                    //获取跟卖数量
                    let seller_count = 0;
                    try {
                        var seller_str = page.querySelector("#aod-filter-offer-count-string").innerText.trim();
                        if (!isNaN(seller_str.charAt(0))) {   //如果第一位是数字
                            seller_count = seller_str.split(' ')[0];
                        } else {
                            seller_count = 0;
                        }
                    } catch (error) {
                        seller_count = 0;
                    }

                    //获取跟卖详情（名字+价格）
                    let seller_info = "";
                    try {
                        var info_list = page.querySelectorAll("#aod-offer-list>div");
                        info_list.forEach(info => {
                            let info_new = info.querySelector("#aod-offer-heading").innerText.trim();
                            if (info_new == "New") {
                                let info_price = info.querySelector(".a-offscreen").innerText;
                                let info_dispatchfrom = info.querySelector("span[class='a-size-small a-color-base']").innerText;
                                seller_info += (info_dispatchfrom + "&nbsp;" + info_price + "&#10;")
                            }
                        });
                    } catch (error) {
                        seller_info = "";
                    }

                    var final_res = dispatch_from + "|" + seller + "|" + seller_count + "|" + cart_price + "|" + delivery_time + "|" + seller_info;
                    res(final_res);

                }
            });
        })
    }



})();