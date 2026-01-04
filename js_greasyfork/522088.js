// ==UserScript==
// @name        扩展功能
// @namespace   None
// @license MIT
// @grant       GM_xmlhttpRequest
// @grant       none
// @version     1.56
// @author      -
// @description 2024/12/28 15:36
// ==/UserScript==

const chunkArray = function (array, chunkSize) {
    let result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}
const decodeData = function (data){
    return $.map(Object.keys(data),function(val){return `${val}=${data[val]? data[val]:''}`}).join("&");
}

var single = $(`
<div class="in-screen-single">
  <div class="title">扩展内容：</div>
  <div class="item">
    <a href="javascript:" class="showOnlyWarehouse">仅显示仓库清单中</a>
  </div>
</div>
`);
single.find(".item > a").on("click",function(){
    if($(this).hasClass("in-active")){
        $(this).removeClass("in-active");
    }else{
        $(this).addClass("in-active");
    }
});



single.find("a.showOnlyWarehouse").on("click",async function(){
    $("#loading").show();
    if(!$(this).hasClass("in-active")){
        $("tr.content").show();
        $(".showOnlyWarehousefingerPrint").remove();
        $("#loading").hide();
        return
    }
    var url = "https://www.dianxiaomi.com/warehouseProduct/pageList.htm";
    var skus_box = [];
    switch($("#platformNam").val()){
        case "smt":
            skus_box = $("tr.content tr[data-productid]").map(function(){
                return $(this).find("td:eq(0) span.limingcentUrlpic:eq(1)")
            });
            break;
        case "shopify":
            skus_box = $("tr.content table.in-table-in .limingcentUrlpic")
            break;
        case "aliChoice":
            skus_box = $("tr.content td.skuTdInfo span.limingcentUrlpic")
            break;
        default:
            return;
    }
    var skus = skus_box.map(function (){return $.trim($(this).text())}).toArray();
    const taskList = $.map(chunkArray(skus,200), function(searchSkus){
        return new Promise((resolve)=>
            GM_xmlhttpRequest({
                url:url,
                method:"POST",
                data:decodeData({
                    zoneType: 0,
                    pageNo: 1,
                    pageSize: 300,
                    searchType: 1,
                    searchValue: searchSkus.join(),
                    productSearchType: 1,
                    warehouseId: '6162134',
                    orderBy: 1,
                    orderByVal: 1
                }),
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload:function(res){
                    resolve($(res.responseText))
                }
            })
        );
    });
    var warehouseMap = {};
    var book = await Promise.all(taskList);
    for(var page of book){
        page.closest("#goodsContent").find("tr.content").map(function (){
            var sku = $.trim($(this).find(".productSku").text());
            warehouseMap[sku] = +$.trim($(this).find(`tr[data-id] td:eq(4)`).text());
        });
    }
    window.warehouseMap = warehouseMap;
    $("tr.content").hide();
    for(var sku_box of skus_box){
        var tr_box = sku_box.closest("tr.content");
        if (Object.keys(warehouseMap).includes(sku_box.text())){
            var sku = $.trim(sku_box.text())
            if (warehouseMap[sku] >= 4) {
                var tag = $(`<button class="button btn-blue mLeft5 showOnlyWarehousefingerPrint" style="height: 21px;line-height: 0.75">充裕(${warehouseMap[sku]})</button>`);
            }else if (warehouseMap[sku] >= 2){
                var tag = $(`<button class="button btn-orange mLeft5 showOnlyWarehousefingerPrint" style="height: 21px;line-height: 0.75">紧张(${warehouseMap[sku]})</button>`);
            }else{
                var tag = $(`<button class="button btn-delete mLeft5 showOnlyWarehousefingerPrint" style="height: 21px;line-height: 0.75">危险(${warehouseMap[sku]})</button>`);
            }
            sku_box.after(tag);
            if(tr_box.is(":hidden")){
                tr_box.show();
            }
        }
    }
    $("#loading").hide();

});