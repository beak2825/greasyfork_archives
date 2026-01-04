// ==UserScript==
// @name         copy_
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  for taobao/tmall
// @author       1486649630@qq.com
// @match        *://item.taobao.com/item.htm*
// @match        *://detail.tmall.com/item.htm*
// @match        *://detail.tmall.hk/hk/item.htm*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434807/copy_.user.js
// @updateURL https://update.greasyfork.org/scripts/434807/copy_.meta.js
// ==/UserScript==
jQuery.noConflict();
(function ($) {
    document.addEventListener("DOMContentLoaded", run);
    function run(){
        setTimeout(go,2000);
    }
    function copyToClipboard(text) {
        const dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    }
    function parseDom(arg) {
        const objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.childNodes;
    }
    function parseActivity(x) {
        const temp = [];
        for (let i = 0; i < x.length; i++) {
            temp.push(x[i].title)
        }
        return temp.join("；");
    }
    function go() {
        let sku = [];
        let itemInfo=[]
        let itemAttrs_list=[];
        let url = window.location.href;
        let col = [];

        if (url.indexOf("item.taobao.com/item.htm") !== -1) {
            const skuInfo = Hub.config.get("sku");
            const skuMap = skuInfo.valItemInfo.skuMap;
            const propertyMemoMap = skuInfo.valItemInfo.propertyMemoMap;
            const originalPrice = g_config.originalPrice;
            const promoData = g_config.promotion.promoData;
            // const stockMap = TB.SKU.userConfig.stockMap;
            const stockMap = g_config.dynStock.sku;
            const collectCount = document.getElementsByClassName("J_FavCount") && document.getElementsByClassName("J_FavCount")[0].textContent.match(/\d+/g) && document.getElementsByClassName("J_FavCount")[0].textContent.match(/\d+/g)[0] || "";
            const reviewsCount = document.getElementsByClassName("J_ReviewsCount") && document.getElementsByClassName("J_ReviewsCount")[0].textContent || "";
            const coupon = parseActivity(g_config.couponActivity.coupon && g_config.couponActivity.coupon.couponList || []);
            const shopProm = parseActivity(g_config.couponActivity && g_config.couponActivity.shopProm || []);
            var itemAttrs=document.querySelector("#attributes").textContent.replaceAll('\t','').split('\n');for (let x = 0; x < itemAttrs.length; x++) {let y=itemAttrs[x].split(':');if(y.length==2){itemAttrs_list.push({itemId: g_config.itemId,"k":y[0].trim(),"v":y[1].trim()})}}
            itemInfo.push({
                shopName: g_config.shopName,
                sellerNickName: g_config.sellerNick,
                itemTitle: g_config.idata.item.title,
                // brand: itemDO.brand,
                // brandId: itemDO.brandId,
                userId:g_config.sellerId,
                rootCatId:g_config.idata.item.rcid,
                categoryId: g_config.idata.item.cid,
                itemId: g_config.itemId,
                reservePrice: originalPrice && originalPrice.def && originalPrice.def.price || "",
                shopUrl: g_config.idata.shop.url,
                // tmShopAges: g_config.tmShopAges,
                // imgVedioID: itemDO.imgVedioID,
                // imgVedioPic: itemDO.imgVedioPic,
                // imgVedioUrl: itemDO.imgVedioUrl,
                collectCount: collectCount,
                reviewsCount: reviewsCount,
                // relate:relate,
                // yudin:yudin,
                // dinjin:dinjin,
                // yudinPrice:yudinPrice
            })
            if(Hub.config.config.sku.sku){
                if(document.getElementsByClassName("J_TSaleProp").length>0){var skuPicHTML = document.getElementsByClassName("J_TSaleProp")[0].innerHTML;
                                                                            var skuPicList = parseDom(skuPicHTML);}else{skuPicList=[]}
                const skuPicDic = [];
                for (let i = 0; i < skuPicList.length; i++) {
                    if (skuPicList[i].dataset === undefined) {
                    } else {
                        skuPicDic[";" + skuPicList[i].dataset.value + ";"] = skuPicList[i].children[0].getAttribute("style") && skuPicList[i].children[0].getAttribute("style").split("(")[1].split(")")[0].split("_30x30")[0] || ""
                    }
                }
                for (let key in skuMap) {
                    sku.push({
                        shopName: g_config.shopName,
                        shopId: g_config.shopId,
                        sellerId: g_config.sellerId,
                        sellerNick: g_config.sellerNick,
                        itemId: g_config.itemId,
                        confirmGoodsCount: g_config.soldQuantity.confirmGoodsCount,
                        soldTotalCount: g_config.soldQuantity.soldTotalCount,
                        categoryId: g_config.idata.item.cid,
                        rootCatId: g_config.idata.item.rcid,
                        itemTitle: g_config.idata.item.title,
                        skuName: propertyMemoMap[key.split(";")[1]],
                        price: skuMap[key].price,
                        originalPrice: originalPrice[key] && originalPrice[key].price || "",
                        promoPrice: promoData[key] && promoData[key][0].price || "",
                        skuId: skuMap[key].skuId,
                        stock: stockMap[key] && stockMap[key].stock || "",
                        stockSellableQuantity: stockMap[key] && stockMap[key].sellableQuantity || "",
                        stockHoldQuantity: stockMap[key] && stockMap[key].holdQuantity || "",
                        pic: skuPicDic[key],
                        shopUrl: g_config.idata.shop.url,
                        collectCount: collectCount,
                        reviewsCount: reviewsCount,
                        coupon: coupon,
                        shopProm: shopProm,
                    })
                }
            };
        } else {
            let shopName = document.querySelector(".slogo-shopname") && document.querySelector(".slogo-shopname").textContent.trim() || "";
            let yudin = document.getElementsByClassName("tb-wrt-num").length>0?document.getElementsByClassName("tb-wrt-num")[0].textContent:"";
            let dinjin = document.getElementsByClassName("tb-wrTuan-deposit").length>0?document.getElementsByClassName("tb-wrTuan-deposit")[0].textContent.split("¥")[1]:"";
            let yudinPrice = document.getElementsByClassName("tb-wrTuan-num").length>0?document.getElementsByClassName("tb-wrTuan-num")[0].textContent.split("¥")[1]:"";
            let yudinAct = document.getElementsByClassName("depositexpand").length>0?document.getElementsByClassName("depositexpand")[0].textContent:"";
            // WTF 一个正则搞了我一晚上
            const skuInfo = document.getElementsByTagName("html")[0].innerHTML.match(/TShop\.Setup\(\s(.*)\s/);
            if (skuInfo[1]) {
                const valItemInfo = JSON.parse(skuInfo[1]) || {};
                const propertyPics = valItemInfo.propertyPics;
                const itemDO = valItemInfo.itemDO;
                const skuMap = valItemInfo.valItemInfo && valItemInfo.valItemInfo.skuMap || "";
                const skuList = valItemInfo.valItemInfo && valItemInfo.valItemInfo.skuList|| "";
                const collectCount = document.getElementById("J_CollectCount").textContent.match(/\d+/g) && document.getElementById("J_CollectCount").textContent.match(/\d+/g)[0];
                const reviewsCount = document.getElementsByClassName("J_ReviewsCount") && document.getElementsByClassName("J_ReviewsCount")[0].textContent || "";
                var relate=document.getElementsByClassName("icon tm-relate-arrow");
                relate=relate&&relate[0]&&relate[0].parentElement.title||"";
                var itemAttrs=document.querySelector("#J_AttrUL") && document.querySelector("#J_AttrUL").textContent.replaceAll('\t','').split('\n') || [];
                for (let x = 0; x < itemAttrs.length; x++) {let y=itemAttrs[x].split(':');if(y.length==2){itemAttrs_list.push({itemId: itemDO.itemId,"k":y[0].trim(),"v":y[1].trim()})}}
                itemInfo.push({
                    shopName: shopName,
                    sellerNickName: decodeURI(itemDO.sellerNickName),
                    itemTitle: itemDO.title,
                    brand: itemDO.brand,
                    brandId: itemDO.brandId,
                    userId: itemDO.userId,
                    rootCatId: itemDO.rootCatId,
                    categoryId: itemDO.categoryId,
                    itemId: itemDO.itemId,
                    reservePrice: itemDO.reservePrice,
                    shopUrl: g_config.shopUrl,
                    tmShopAges: g_config.tmShopAges,
                    imgVedioID: itemDO.imgVedioID,
                    imgVedioPic: itemDO.imgVedioPic,
                    imgVedioUrl: itemDO.imgVedioUrl,
                    collectCount: collectCount,
                    reviewsCount: reviewsCount,
                    relate:relate,
                    yudin:yudin,
                    dinjin:dinjin,
                    yudinPrice:yudinPrice,
                    yudinAct:yudinAct
                })
                if (skuMap && skuList) {
                    for (let key in skuMap) {
                        for (let i = 0; i < skuList.length; i++) {
                            if (skuMap[key].skuId === skuList[i].skuId) {
                                sku.push({
                                    shopName: shopName,
                                    sellerNickName: decodeURI(itemDO.sellerNickName),
                                    itemTitle: itemDO.title,
                                    brand: itemDO.brand,
                                    brandId: itemDO.brandId,
                                    userId: itemDO.userId,
                                    rootCatId: itemDO.rootCatId,
                                    categoryId: itemDO.categoryId,
                                    itemId: itemDO.itemId,
                                    reservePrice: itemDO.reservePrice,
                                    shopUrl: g_config.shopUrl,
                                    tmShopAges: g_config.tmShopAges,
                                    imgVedioID: itemDO.imgVedioID,
                                    imgVedioPic: itemDO.imgVedioPic,
                                    imgVedioUrl: itemDO.imgVedioUrl,
                                    collectCount: collectCount,
                                    reviewsCount: reviewsCount,
                                    relate:relate,
                                    skuId: skuList[i].skuId,
                                    skuName: skuList[i].names,
                                    stock: skuMap[key].stock,
                                    cspuId: skuMap[key].cspuId,
                                    pic: propertyPics && propertyPics[key] && propertyPics[key][0] || "",
                                    price: skuMap[key].price,
                                })
                            }
                        }
                    }
                }
            }
        }
        col = sku&&sku[0]&&Object.keys(sku[0])||[];
        const tb_li = [col.join("\t")];
        for (let i = 0; i < sku.length; i++) {
            let row = [];
            for (let x = 0; x < col.length; x++) {
                const v = sku[i][col[x]];
                if (v === undefined) {
                    row.push("");
                } else {
                    row.push(v);
                }
            }
            tb_li.push(row.join("\t"));
        }
        // copyToClipboard(tb_li.join("\n"));
        var dt;
        if (url.indexOf("item.taobao.com/item.htm") !== -1) {
            dt={"dt":JSON.stringify({'itemInfo':itemInfo,'itemAttrs_list':itemAttrs_list,'sku_taobao':sku}),'tb':'ceshi'}
        }else{
            dt={"dt":JSON.stringify({'itemInfo':itemInfo,'itemAttrs_list':itemAttrs_list,'sku_tmall':sku}),'tb':'ceshi'}
        }
        GM_xmlhttpRequest({
            method: "post",
            async: true,
            url: "http://otab.cn:2222/rcv",
            dataType: "json",
            data: JSON.stringify(dt),
            headers:  {
                "Content-Type": "application/json",
                "accept":"application/json"
            },
            onload: function(response) {
                console.log(response.response)
                if(JSON.parse(response.response).success){
                    document.title='sku已复制 去excle黏贴';}else{
                        document.title='sku已复制 请检查！';}
            }
        });
    }
})(jQuery);