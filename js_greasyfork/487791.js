// ==UserScript==
// @name        Auto Edit for Dianxiaomi_ShopeeStore
// @namespace   Violentmonkey Scripts
// @match       https://www.dianxiaomi.com/shopeeGlobalProduct/edit.htm
// @grant       GM_xmlhttpRequest
// @license     MIT
// @grant       none
// @version     1.0.1
// @author      -
// @description 2023/11/22 10:43:09
// @downloadURL https://update.greasyfork.org/scripts/487791/Auto%20Edit%20for%20Dianxiaomi_ShopeeStore.user.js
// @updateURL https://update.greasyfork.org/scripts/487791/Auto%20Edit%20for%20Dianxiaomi_ShopeeStore.meta.js
// ==/UserScript==

const gotNewPrice = function(price){
  C16 = price*0.6;
  var weight = $("#proWeight").val()*1000;
  E16 = 4.15+(weight-10)*0.015;
  F16 = (C16+E16) * 0.06;
  G16 = (E16+C16) * 0.05;
  H16 = (C16+E16+F16+G16) * 1.4 - 3.5;
  I16 = H16 * 0.92;
  J16 = H16 * 0.88;
  newPrice = H16 * 0.214;
  return newPrice;
}
function copy(node,context) {
  let transfer = document.createElement("textarea");
  node.appendChild(transfer);
  transfer.value = context;
  transfer.focus();
  transfer.select();
  if (document.execCommand('copy')){
    document.execCommand('copy');
  }
  transfer.blur();
  node.removeChild(transfer);
}
$.each($(".sellingPriceResultCiteToAllProductSKU.priceRateSwitchIpt.sameVarinatIpt"),function(i,val){
  var gotPriceBnt = $("<a></a>");
  gotPriceBnt.append("通过公式处理");
  gotPriceBnt.attr("href","javascript:;");
  gotPriceBnt.on("click",function(){
    $(val).val(gotNewPrice($(val).val()).toFixed(2));
    $(val).trigger("input");
  });
  $(val).parent().parent().removeClass("minW170");
  $(val).parent().parent().addClass("minW270");
  $(val).parent().parent().append(gotPriceBnt);
});
(function(){
  let _dialog = $(`
    <div class="modal in-modal" id="addFastContent" tabindex="-1" role="dialog" aria-hidden="true" data-backdrop="static" data-keyboard="false" style="display: none; z-index: 3008;">
        <div class="modal-dialog w800">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" onclick="SHOPEE_GLOBAL.basicsFn.handlePublishToShopModalHide();" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                    <h4 class="modal-title">添加新的快捷语句</h4>
                </div>
                <div class="modal-body">
                  <textarea class="form-control" rows="6" style="max-width:770px" placeholder="请在此填写快速输入的内容"></textarea>
                </div>
                <div class="modal-footer">
                  <button class="button btn-determine" type="button">确定</button>
                  <button class="button btn-gray m-left10" onclick="SHOPEE_GLOBAL.basicsFn.handlePublishToShopModalHide();$('#addFastContent').find('textarea').val('');" type="button" data-dismiss="modal">取消</button>
                </div>
            </div>
        </div>
    </div>
  `);
  _dialog.find(".btn-determine").on("click",function(){
    let fastContents = localStorage['fastContents'];
    fastContents = JSON.parse(fastContents);
    fastContents.push(_dialog.find("textarea").val());
    localStorage['fastContents'] = JSON.stringify(fastContents);
    _dialog.find("textarea").val="";
    $("#addFastContent").modal('hide');
    $('#addFastContent').find("textarea").val("");
    updateFastContentsCard();
  });
  $("body").append(_dialog);
})();
(function(){
  var gotPriceBnt = $("<a></a>");
  gotPriceBnt.append("通过公式处理");
  gotPriceBnt.attr("href","javascript:;");
  gotPriceBnt.on("click",function(){
    $("#proPrice").val(gotNewPrice($("#proPrice").val()).toFixed(2));
    $("#proPrice").trigger("input");
  });
  $("#proPrice").parent().append(gotPriceBnt);
})();
(function(){
  $("#autoPublishToShop").click();
  $('#publishToShopModal').modal('hide');
  setTimeout(function(){
    $('.allPlatformShopBox :input[name="ShopeeAllSite"]').each(function(i,val){
      $(val).trigger("click");
    });
    SHOPEE_GLOBAL.basicsFn.selectPublishShops();
  },400);
})();

(function(){
  $(".imgShow >> .tuiImageEditorBox").find("img").each(function() {
    let imageSrc = $(this).attr("src").split("/");
    let fileBlock = imageSrc.splice(-1)[0];
    if(fileBlock.split("?").length > 1){
      fileBlock = fileBlock.split("?").slice(0,-1).join("?");
      $(this).attr("src",imageSrc.join("/")+"/"+fileBlock);
      $(this).attr("rel",imageSrc.join("/")+"/"+fileBlock);
    }
  });
})();
const toFormData = function(obj){
  let FromDataString = [];
  $.each(obj,function(key,val){
    FromDataString.push(`${key}=${val}`);
  });
  return FromDataString.join("&");
}
class WaitForRequest{
  get(url){
    return new Promise(res=>{
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        onload:(response)=>{
          res($(response.responseText));
        }
      });
    });
  }
  post(url,data=undefined){
    return new Promise(res =>{
      if(data !== undefined){
        GM_xmlhttpRequest({
          method: 'POST',
          url: url,
          data: data,
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
          onload:(response)=>{
            res($(response.responseText));
          }
        });
      }
      else{
        GM_xmlhttpRequest({
          method: 'POST',
          url: url,
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
          onload:(response)=>{
            res($(response.responseText));
          }
        });
      }
    });
  }
}

const gotRawDataId =async function(skuList){
  let dataVal = {
    "pageNo": 1,
    "pageSize": 100,
    "shopId": -1,
    "groupId": "",
    "shopGroupId": "",
    "productStatusType": "onSelling",
    "dxmState": "online",
    "dxmOfflineState": "",
    "searchType": 1,
    "searchValue": encodeURIComponent(skuList.join(',')),
    "sortName": "",
    "sortValue": "",
    "advancedSearch": "",
    "priceLift": "",
    "priceRight": "",
    "quantityLift": "",
    "quantityRight": "",
    "deliveryTimeLift": "",
    "deliveryTimeRight": "",
    "grossWeightLift": "",
    "grossWeightRight": "",
    "productCategory": "",
    "freightTemplateId": "",
    "timeLift": "",
    "timeRight": "",
    "advancedTime": 1,
    "shelvesKinds": -1,
    "motorState": 0,
    "hasVideo": "",
    "productType": "",
    "aeopNationalQuoteConfiguration": -1,
    "commentType": 0,
    "commentContent": "",
    "sourceUrl": ""
  }
  if(skuList.length === 0){
    dataVal['searchType'] = 0;
    dataVal['searchValue'] = $("#productTitle").val();
  }
  var taskListLabel = ['onSelling','draft-box','offline','auditing','editingRequired','doubtdelete'];
  var taskList = (function(){
    var tmpList =[];
    for(var key of taskListLabel){
      dataVal['productStatusType'] = key;
      tmpList.push(
        new Promise((r)=>{
          GM_xmlhttpRequest({
            method: 'POST',
            url: "https://www.dianxiaomi.com/smtProduct/pageList.htm",
            data: toFormData(dataVal),
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            onload: function(response) {
              r(response.responseText);
            }
          });
        })
      );
    }
    return tmpList;
  })();
  var pageList = await Promise.all(taskList);
  taskList = null;
  var productMap = {};
  for(i = 0; i < taskListLabel.length; i++){
    productMap[taskListLabel[i]] = $(pageList[i]).find("table[cid='productList'] tr[class='content']");
  }
  var trueMap = [];
  for(var key in productMap){
    $.each(productMap[key],function(index,value){
      var tmpList = [];
       $(value).find("br + span.limingcentUrlpic").each(function(){
         tmpList.push($(this).text());
       });
      var isOK = true;
      for(my_sku of skuList){
        if (!tmpList.includes(my_sku)){
          isOK = false;
          break;
        }
      }
      if(isOK){
        trueMap.push($(value).attr("data-id"));
      }
   });
  }
  return trueMap;
}
async function getProductDetail(productId){
  var page = await new Promise((r)=>{
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://www.dianxiaomi.com/smtProduct/edit.htm?id=${productId}`,
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      onload: function(response) {
        var html = $(response.responseText);
        var detailData = html.find("#detailOldData").attr("value");
        r(detailData);
      }
    })
  });
  return page;
}

var tabBody = $("div.productModule > div.onlineProductInfo > table > tbody");
sku_ibs = $("input[id='parentSku'],input[name='variationSku']");
productID = [];
$.each(sku_ibs,function(i,val){
  if ($(val).val() !== ""){
    productID.push($(val).val());
  }
});

var fastContent = $(`<tr id='tool1'>
  <td class='v-top'></td>
  <td>
    <div class='form-component w800 fastContent' style="height:auto">
      <div style="height:100px" class="fastContentCards">
      </div>
      <hr style="margin:6.5px 0">
      <div>
        <a class="fr" href="javascript:;">添加新的快捷语句</a>
      </div>
    </div>
  </td>
</tr>`);
fastContent.find('a').on("click",function(){
  $("#addFastContent").modal("show");
});
tabBody.append(fastContent);
const updateFastContentsCard = function(){
  if(localStorage['fastContents'] === undefined){
    localStorage['fastContents'] = "[]";
  }
  $(".fastContentCards").empty();
  $(JSON.parse(localStorage['fastContents'])).each(function(index,val){
    let card =
    $(`
      <label class="w230" style="padding:5px">
      <p style="height:65px;display:block;overflow-y: hidden;" data-toggle="popover" data-trigger="hover" data-placement="top" data-html="true" value="${val}" data-content="${val.replace(new RegExp("\n", "gm"), '<br/>')}"data-original-title="" title="">
        ${val.replace(new RegExp("\n", "gm"), '<br/>')}
      </p>
      <hr style="margin:6.5px 0">
      <a href="javascript:;" index=${index} type="del" class="fRed">删除</a>
      </label>
    `);
    card.find("p[data-toggle='popover']").popover();
    card.find("p[data-toggle='popover']").on("click",function(){
      copy(this,$(this).attr("value"));
    });
    card.find("a[type='del']").on("click",function(){
      let fastContents = JSON.parse(localStorage['fastContents']);
      fastContents.splice(+$(this).attr("index"),1);
      localStorage['fastContents'] = JSON.stringify(fastContents);
      updateFastContentsCard();
    });
    $(".fastContentCards").append(card);
  })
};
var previewTr = $("<tr id='my_diyDom'><td class='v-top'>原始数据描述：</td><td id='raw_Data'><iframe class='form-component m-h300 w800 rawDetail'></iframe></td></tr>");
tabBody.append(previewTr);

(async function(){
  var trueId = await gotRawDataId(productID);
  updateFastContentsCard();
  var detail = await getProductDetail(trueId[0]);
  $("iframe.rawDetail").contents().find("body").append(detail);
  $("#img_show > #myj-drop > .tuiImageEditorBox").each(function(){
    var imgUrl = $(this).find("input[name='selectedImg']").attr("value");
    imgUrl = imgUrl.replace("https://ae02.alicdn.com/","https://ae01.alicdn.com/")
    if($(this).find("input[name='selectedImg']").is(":checked") && detail.includes(imgUrl)){
      $(this).find("input[name='selectedImg']").prop('checked', false);
    }
  });
  var setDefaultCategory = $(`
  <div class="mRight10 dropdown btn-dropdown">
    <button class="mLeft10 button btn-determine" data-toggle="dropdown" type="button">设为默认分类<i class="iconfont icon_down"></i></button>
  </div>`);
  var setDefaultCategoryDropMenuList = $(`
  <ul class="mLeft10 dropdown-menu menu" role="menu">
    <li>
      <a href="javascript:;" class="clearDefaultCategory" role="menuitem">清除默认值</a>
    </li>
  </ul>
  `);
  setDefaultCategory.find("button").on("click",function(){
    localStorage['shopeeGlobalProductDefaultCategory'] = $("#categoryHistoryId").val();
  });
  setDefaultCategoryDropMenuList.find("a.clearDefaultCategory").on("click",function(){
    localStorage['shopeeGlobalProductDefaultCategory'] = "";
  })
  setDefaultCategory.append(setDefaultCategoryDropMenuList);
  $("button.categoryModalShow").after(setDefaultCategory);
})();
window.onload = setTimeout(function(){
  $("#choseAllShopLogistics").trigger("click");
  if(localStorage['shopeeGlobalProductDefaultCategory'] !== "" && localStorage['shopeeGlobalProductDefaultCategory'] != undefined){
    $("#categoryHistoryId").val(localStorage['shopeeGlobalProductDefaultCategory']);
    $("#categoryHistoryId").trigger("change")
  }else{
    localStorage['shopeeGlobalProductDefaultCategory'] = "";
  }
},1000);
