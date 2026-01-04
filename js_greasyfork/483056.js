// ==UserScript==
// @name        全托管采购建议
// @namespace   Violentmonkey Scripts
// @license MIT
//
// @match       https://www.dianxiaomi.com/purchasingProposal/index.htm*
// @match       https://www.dianxiaomi.com/dxmPurchasingNote/waitPayIndex.htm*
// @grant GM_xmlhttpRequest
// @require     https://fastly.jsdelivr.net/npm/dayjs@1.10.7
// @require     https://www.dianxiaomi.com/static/js/warehouse/warehouseProduct.js?v=68.86
// @version     0.1.3
//
// @author      -
// @description 2023/12/21 10:27:01
// @downloadURL https://update.greasyfork.org/scripts/483056/%E5%85%A8%E6%89%98%E7%AE%A1%E9%87%87%E8%B4%AD%E5%BB%BA%E8%AE%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/483056/%E5%85%A8%E6%89%98%E7%AE%A1%E9%87%87%E8%B4%AD%E5%BB%BA%E8%AE%AE.meta.js
// ==/UserScript==

//通用函数
//=============================
const getAllpages = async function(mode='g',url,data){  //获取全部页
  var pageList = [];
  if (!Object.keys(data).includes("pageNo")){
    return
  }
  if (mode === 'g'){
    url = [url,decodeFormData(data)].join("?");
    var page = await new Promise((resolve)=>{
      GM_xmlhttpRequest({
        method:"GET",
        url: url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(response) {
          let rt = response.responseText;
          resolve(rt);
        }
      })
    });
    pageList.push(page);
    var totalPages = parseInt($(page).find("#totalPage").attr('value'));
    if(!totalPages){
      totalPages = parseInt($(page).siblings("input#totalPage").attr("value"));
    }
    if(totalPages > 1){
      for (i = 2;i < totalPages + 1;i++){
        data['pageNo'] = i;
        url = [url,decodeFormData(data)].join("?");
        var page = await new Promise((resolve)=>{
          GM_xmlhttpRequest({
            method:"GET",
            url: url,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            onload: function(response) {
              let rt = response.responseText;
              resolve(rt);
            }
          })
        });
        pageList.push(page);
      }
    }
  }else if (mode === 'p'){
    var page = await new Promise((resolve)=>{
      GM_xmlhttpRequest({
        method:"POST",
        url: url,
        data: decodeFormData(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(response) {
          let rt = response.responseText;
          resolve(rt);
        }
      })
    });
    pageList.push(page);
    var totalPages = parseInt($(page).find("#totalPage").attr('value'));
    if(!totalPages){
      totalPages = parseInt($(page).siblings("input#totalPage").attr("value"));
    }
    if(totalPages > 1){
      for (i = 2;i < totalPages + 1;i++){
        data['pageNo'] = i;
        var page = await new Promise((resolve)=>{
          GM_xmlhttpRequest({
            method:"POST",
            url: url,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            data:decodeFormData(data),
            onload: function(response) {
              let rt = response.responseText;
              resolve(rt);
            }
          })
        });
        pageList.push(page);
      }
    }
  }
  return pageList;
}
const decodeFormData = function(rawData){ //编码表单数据
  var data = [];
  for(var key in rawData){
    data.push(`${key}=${rawData[key]}`);
  }
  return data.join("&");
}
const mergeThatTab = function(tablist=[]){  //并集表格
  var tmpTable = {};
  tablist.map(function(tab){
    for (var key of Object.keys(tab)){
      if (tmpTable[key] === undefined){
        tmpTable[key] = tab[key];
      }else{
        tmpTable[key] += tab[key];
      }
    }
  })
  return tmpTable;
}
const getOrdersDetail = async function (packageIds){
  var _r = {};
  var taskList =[];
  var url = "https://www.dianxiaomi.com/package/detail.htm";

  for(packageId of packageIds){
    var data = {
      packageId: packageId,
      history: ""
    }
    taskList.push(new Promise((resolve) => {
      GM_xmlhttpRequest({
        method:"POST",
        url: url,
        data: decodeFormData(data),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(response) {
          let p = $(response.responseText);
          p.find(".orderInfo tr.pairProInfoBox").each(function() {
            var realSkU = $(this).children("td:eq(4)").text().trim().split(" x ")[0];
            var qty = +$(this).find("table.pairProInfo span.pairProInfoSku > span").text();
            if(Object.keys(_r).includes(realSkU)){
              _r[realSkU] += qty;
            }else{
              _r[realSkU] = qty;
            }
          })
          resolve();
        }
      })
    }));
  }
  await Promise.all(taskList);
  return _r;
}
// const differenceSetThatTab = function(mainTable,subTable=[]){ //差集表格
//   var tmpMainTalb = JSON.parse(JSON.stringify(mainTable));
//   subTable.map(function(tab){
//     for (var key of Object.keys(tab)){
//       if(tmpMainTalb[key] !== undefined){
//         tmpMainTalb[key] -= tab[key];
//       }
//     }
//   })
//   return tmpMainTalb;
// }
//=============================

//功能性函数
//=============================
const getSaleList = async function(days = 0){ //从订单处理中获取销量
  // 有货的订单
  var data = {
    'pageNo': 1,
    'pageSize': 300,
    'shopId': -1,
    'state': 'allocated_has',
    'platform': 'aliChoice',
    'isSearch': 0,
    'searchType': 'orderId',
    'authId': -1,
    'startTime': '',
    'endTime': '',
    'country': '',
    'orderField': 'order_pay_time',
    'isVoided': 0,
    'isRemoved': 0,
    'ruleId': -1,
    'sysRule': '',
    'applyType': '',
    'applyStatus': '',
    'printJh': -1,
    'printMd': -1,
    'commitPlatform': '',
    'productStatus': '',
    'jhComment': -1,
    'storageId': 0,
    'isOversea': -1,
    'isFree': 0,
    'isBatch': 0,
    'history': '',
    'custom': -1,
    'timeOut': 0,
    'refundStatus': 0,
    'buyerAccount': '',
    'forbiddenStatus': -1,
    'forbiddenReason': 0,
    'behindTrack': -1,
    'orderId': '',
  }

  var pageList = await getAllpages('g','https://www.dianxiaomi.com/package/list.htm',data);
  var packIds = [];
  for (page of pageList){
    packIds = packIds.concat($(page).find("#orderIdsStr").attr("value").split(";"))
  }
  let allocated_has =await getOrdersDetail(packIds);
  // 缺货的订单
  data['state'] = 'allocated_out';
  var pageList = await getAllpages('g','https://www.dianxiaomi.com/package/list.htm',data);
  packIds = [];
  for (page of pageList){
    packIds = packIds.concat($(page).find("#orderIdsStr").attr("value").split(";"))
  }
  let allocated_out =await getOrdersDetail(packIds);
  // 发货成功里指定范围的订单
  data['state'] = 'shipped',
      data['isSearch'] = 1,
      data['startTime'] = new dayjs().subtract(days,'days').format('YYYY-MM-DD'),
      data['endTime'] = new dayjs().format('YYYY-MM-DD'),
      data['orderField'] = 'shipped_time',
      data['commitPlatform'] = 'success',
      data['isFree'] = -1,
      data['isBatch'] = -1;
  packIds = [];
  var pageList = await getAllpages('g','https://www.dianxiaomi.com/package/list.htm',data);
  for (page of pageList){
    packIds = packIds.concat($(page).find("#orderIdsStr").attr("value").split(";"))
  }
  let shipped = await getOrdersDetail(packIds);
  // 并集为一个表，来表示为所指范围的销售量
  var centerTab = mergeThatTab([allocated_has,allocated_out,shipped]);
  return centerTab;
}
const getStockData = async function(skus){  //获取产品库存
  var url = "https://www.dianxiaomi.com/warehouseProduct/pageList.htm"
  var data = {
    'zoneType': 0,
    'pageNo': 1,
    'pageSize': 300,
    'searchType': 1,
    'searchValue': encodeURIComponent(skus.join()),
    'productSearchType': 1,
    'warehouseId': '6162134',
    'isTransit': '',
    'orderBy': 1,
    'orderByVal': 1,
    'fullCid': '',
    'groupOrNot': '',
    'priceMin': '',
    'priceMax': '',
    'stockMin': '',
    'stockMax': '',
    'availableMin': '',
    'availableMax': '',
    'safeMin': '',
    'safeMax': '',
    'onPassMin': '',
    'onPassMax': '',
    'lockMin': '',
    'lockMax': '',
    'productStatus': -1,
  }
  var pageList = await getAllpages('p',url,data);
  var stockData = {};
  for(var page of pageList){
    $(page).find("table.in-table tr.content").map(function(){
      var sku = $(this).find("span.productSku").text();
      var productID = $(this).find("input[iptid='selectSingle']").attr("data-proid");
      var id = $(this).find("input[iptid='selectSingle']").attr("value");
      var imageUrl = $(this).find("div.imgDivIn img.imgCss").attr("src");
      var linksNode = $(this).find("div.imgDivIn").siblings("div");
      if(linksNode.length === 0 ){
        linksNode = $(this).find("div.imgDivIn").siblings("p");
      }
      linksNode = linksNode.prop("outerHTML");
      var title = $(this).find("p.name").attr("title");
      var stock = $(this).find(`tr[data-id='${id}']`).prop("outerHTML");
      stockData[sku] = {
        id: productID,
        stockId: id,
        stock: stock,
        title: title,
        linksNode: linksNode,
        imageUrl: imageUrl,
      };
    });
  }
  return stockData;
}
const getSupplier = async function(ids){ //获取采购商信息
  var ids2 = [];
  for (var id of ids){
    if (id !== undefined){
      ids2.push(id);
    }
  }
  var url = "https://www.dianxiaomi.com/dxmPurchasePlan/addDxmProduct.htm";
  data = {
    "ids":encodeURIComponent(ids2.join())
  }
  pageData = await new Promise((resolve)=>{
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      data: decodeFormData(data),
      onload: function(response) {
        let rt = response.responseText;
        resolve(rt);
      }
    })
  });
  var objList = {};
  var warehouseListPlatId = {}
  for(var item of JSON.parse($(pageData).find("span#warehouseListPlatId").text())){
    warehouseListPlatId[item.id] = item;
  }
  var supplierListPlatId = JSON.parse($(pageData).find("span#supplierListPlatId").text());
  $(pageData).siblings("tr.purchasePlanTr").map(function(){
    var productId = $(this).attr("id");
    var supplierId = $(this).find("div.supplierLocation").attr("data-origin");
    var warehouseId = $(this).find("div.warehouseLocationTip").attr("data-origin");
    if(warehouseId === undefined && Object.keys(warehouseListPlatId).length === 1){
      warehouseId = Object.keys(warehouseListPlatId)[0];
    }
    objList[productId] = {
      supplierId: supplierId,
      supplierObj: supplierListPlatId[supplierId],
      warehouseId: warehouseId,
      warehouseObj: warehouseListPlatId[warehouseId]
    }
  })

  return objList
}
const addPurchasePlan = async function(products){ //添加到采购计划
  var url = "https://www.dianxiaomi.com/dxmPurchasePlan/addPurchasePlan.json";
  var plans = [];
  for (product of products){
    var obj ={
      "productId": product.productId,
      "purchasePlanNumber": product.productNumb,
      "warehouseId": product.warehouseId,
      "supplierId": product.supplierId
    }
    plans.push(obj)
  }
  var data = {
    "dxmPurchasePlans":JSON.stringify(plans)
  }
  var res = await new Promise((resolve)=>{
    GM_xmlhttpRequest({
      method:"POST",
      url:url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      data:decodeFormData(data),
      onload:function(response) {
        let rt = response.responseText;
        resolve(rt);
      }
    });
  })
  getPlanSumNumBer();
  return JSON.parse(res);
}
//=============================
//主函数
//=============================
const setScence = function(){ //设置场景
  $("#beihuo").hide();
  $("#alibaba").addClass("hide");
  $("#allClassification").hide();
  $("#description").addClass("myj-hide");
  $("#alibabaConfig").addClass("hide");
  $("#purchasingProposalPart").addClass("myj-hide");
  $("#goodsContent").hide();
  $("#purchasingShortageList").hide();
  $("#alibabaGoodsContent").hide();
  $("#purchasingOrNoPurchasing").hide();
  $("#pageList").html(`
  <input type="hidden" id="pageNo" name="pageNo" value="1">
  <input type="hidden" id="totalPage" name="totalPage" value="1">
  <input type="hidden" id="pageSize" name="pageSize" value="100">
  <input type="hidden" id="totalSize" name="totalSize" value="0">
  `);

  $("#aliChoice").remove();
  var aliChoice = $(`
  <div class="col-xs-12 border3 p0" id="aliChoice">
      <div role="tabpanel" class="tab-pane active col-xs-12 pBottom10">
        <div class="col-xs-12 p0 pTop5">
          <div class="col-xs-12 p0">
            <div class="col-xs-1 w80 p0 pTop10">搜索类型：</div>
            <div class="col-xs-10 pTop10 p-left0 searchType">
              <a href="javascript:" class="mRight20 myj-aFocus myj-active">产品SKU</a>
              <a href="javascript:" class="mRight20 myj-aFocus">产品名称</a>
            </div>
          </div>
          <form class="doNotSubmit">
            <div class="col-xs-12 p0 mTop10">
              <div class="col-xs-1 w80 p0 pTop10">搜索内容：</div>
              <div class="col-xs-4 minW345 pRight10 p-left0" style="min-width: 485px;">
                <input id="searchValueNo" type="text" class="form-control" cid="searchValueInput">
              </div>
              <div class="minW100">
                <button id="btnSearchNo" type="submit" cid="searchValueInputToSubmit" class="button btn-determine m-left10">搜索</button>
              </div>
            </div>
          </form>
          <div class="pTop10">
            <span class="w80 p0 pTop10 lHeight24 inline-block">排序：</span>
            <span class="pTop10 lHeight24 p-left0" id="sortType">
              <a href="javascript:" class="mRight20 myj-aFocus myj-active">按采购建议&nbsp;
                <span class="mRight5 myjCaretDown" style="margin-top: -2px;"></span>
              </a>
            </span>
          </div>
          <div>
            <span class="w80 p0 pTop10 lHeight24 inline-block">筛选：</span>
            <span class="pTop10 lHeight24 p-left0" id="filter">
              <a href="javascript:" class="mRight20 myj-aFocus" value="all">全部&nbsp;</a>
              <a href="javascript:" class="mRight20 myj-aFocus myj-active" value="onlyHasNumb">仅显示建议数>0&nbsp;</a>
            </span>
          </div>
        </div>
      </div>
  </div>
  `);
  aliChoice.find("#filter a").on("click",function(){
    $(this).closest('#filter').find('a').removeClass('myj-active');
    $(this).addClass('myj-active');
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  })
  aliChoice.find("#btnSearchNo").on("click",function(){
    $("#aliChoice #searchValueNo").attr("value",$("#aliChoice #searchValueNo").prop("value"));
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  })
  aliChoice.find(".searchType a").on("click",function(){
    $(this).closest('div.searchType').find('a').removeClass('myj-active');
    $(this).addClass('myj-active');
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  })
  aliChoice.find("#sortType a").on("click",function(){
    $(this).addClass("myj-active");
    if($(this).find("span").hasClass("myjCaretDown")){
      $(this).find("span").removeClass("myjCaretDown");
      $(this).find("span").addClass("myjCaretUp");
    }else{
      $(this).find("span").addClass("myjCaretDown");
      $(this).find("span").removeClass("myjCaretUp");
    }
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  })
  $("div#aliChoiceGoodsContent").remove();
  $("#alibabaConfig").after(aliChoice);
  var aliChoiceGoodesContent = $(`<div class="col-xs-12 p0 ceilingType relative" id="aliChoiceGoodsContent"></div>`);
  var tableHead = $(`
  <thead class="border-right0 border-left3 border-top1">
    <tr class="text-center">
      <th class="w35 maxw30" style="width: 20px; min-width: 20px; max-width: 20px;">
        <label>
          <input id="aliChoiceSelectAll" type="checkbox" value="" class="expand_scope">
        </label>
      </th>
      <th class="gray-b minW410" style="width: 410px; min-width: 410px; max-width: 410px;">商品信息</th>
      <th class="gray-b minW300" style="width: 300px; min-width: 300px; max-width: 300px;">
        <table class="w-full">
          <thead>
            <tr class="gray-b in-first">
              <th class="f-center" colspan="5" style="border-right:0px">库存情况</th>
            </tr>
            <tr class="gray-b flex">
              <th class="minW60 f-right flex-1 f-center">在途
                <i class="attach-icons gray-c md-18 normal pointer" data-toggle="popover" data-trigger="hover" data-html="true" data-placement="bottom" data-content="<span class='inline-block w210 f13 gray-c'>在途数量 = 采购/加工在途 + 库内在途 + 调拨在途</span>" data-original-title="" title="">help_outline</i>
              </th>
              <th class="minW60 f-right flex-1 f-center">未发
                <i class="attach-icons gray-c md-18 normal pointer" data-toggle="popover" data-trigger="hover" data-html="true" data-placement="bottom" data-content="<span class='inline-block w210 f13 gray-c'>自发货订单还未发货的商品数，未发=待审核 + 待处理 + 运单号申请 + 待打单</span>" data-original-title="" title="">help_outline</i>
              </th>
              <th class="minW60 f-right flex-1 f-center preSaleTh">预售
                <i class="attach-icons gray-c md-18 normal pointer" data-toggle="popover" data-trigger="hover" data-html="true" data-placement="bottom" data-content="<span class='inline-block w300 f13 gray-c'>预售：它是订单商品SKU预售数量，即订单待打单，已占用库存数。</span>" data-original-title="" title="">help_outline</i>
              </th>
              <th class="p-top10 minW60 f-right flex-1 f-center">可用</th>
              <th class="p-top10 minW60 f-right gray-c flex-1 f-center" style="border-right:0px">总量</th>
            </tr>
          </thead>
        </table>
      </th>
      <th class="gray-b minW100" style="width: 100px; min-width: 100px; max-width: 100px;">
        <span class="pointer f-under" data-trigger="hover" data-placement="top" data-toggle="popover" data-html="true" data-content="订单量：它是过去5天的订单所需SKU总数" data-original-title="" title="">5日订单量</span>
      </th>
      <th class="gray-b minW100" style="width: 100px; min-width: 100px; max-width: 100px;">
        <div class="ghs-bubble hover-prompt hoverPrompt ghs-hover-prompt p-bottom0 p-top0" data-type="1">
          <span class="pointer f-under">建议数量</span><br/>[采购数量]
          <div class="ghs-word-box ghsWordBox com-block" style="top: -148px;left: -190px;">
            <div class="whiteBar"></div>
            <div class="word-in wordbox scroll-bar">
              <div class="p15 p-left10 p-right10">
                <p class="m-bottom5">
                  <span class="gray-c">建议数量 = （5日订单量平均值 x 安全天数）-（在途 + 可用库存）</span>
                </p>
                <p class="m-bottom5">
                  <span class="gray-b">订单量 = 待审核 + 待处理 + 未发货所有订单</span>
                </p>
                <p class="m-bottom5">
                  <span class="gray-b">在途 = 采购在途 + 调拨在途</span>
                </p>
              </div>
            </div>
            <div class="ghs-triangle"></div>
          </div>
        </div>
      </th>
      <th class="gray-b min-w100" style="width: 100px; min-width: 100px; max-width: 100px;">操作</th>
    </tr>
  </thead>`);
  tableHead.find("#aliChoiceSelectAll").on("change",function(){
    $("input#aliChoiceSelectAll").prop("checked",$(this).prop("checked"));
    $("#aliChoiceGoodsContent table.purchasingAdvice tbody tr.content:visible input[name='productBoxs']").prop("checked",$(this).prop("checked"));
  });
  var MyTable = $(`<table class="myj-table purchasingAdvice borderTopNo"></table>`);
  MyTable.append(tableHead);
  var scrollHead =  MyTable.clone(true);
  scrollHead.css("width","80%");
  scrollHead.css("position","fixed");
  scrollHead.css("top","0")
  scrollHead.hide();
  MyTable.append($('<tbody></tbody>'));
  aliChoiceGoodesContent.append(MyTable);
  $("#pageList").append(aliChoiceGoodesContent);
  tableHead.find("*.pointer").popover();
  scrollHead.find("*.pointer").popover();
  aliChoiceGoodesContent.append(scrollHead);
  $(document).scroll(function() {
    var top = MyTable.offset().top;
    if($(this).scrollTop() >= top){
      scrollHead.show();
    }else{
      scrollHead.hide();
    }
  });
  $("#upPage").html(`<li><a title=""><span style="color:#444444;">每页</span>&nbsp;&nbsp;<select name="pageselct" style="cursor: pointer;margin-top:-1px;"><option value="30">30条</option><option value="50">50条</option><option selected="selected" value="100">100条</option><option value="300">300条</option></select>&nbsp;<span style="color:#444444;"></span></a></li><li class="xianshipage"><span id="cursor" style="cursor: default; color: rgb(68, 68, 68); border: 0px;" title="">第0-0条，共0条</span></li><li class="disabled"><a title="第一页" style="border-bottom-left-radius: 2px; border-top-left-radius: 2px;">&lt;&lt;</a></li><li class="disabled"><a title="上一页">&lt;</a></li><li class="disabled"><a title="下一页">&gt;</a></li><li class="disabled"><a title="最后一页">&gt;&gt;</a></li><li><a title="第1/1页">1/1</a></li>`);
  $("#downPage").html(`<li><a title=""><span style="color:#444444;">每页</span>&nbsp;&nbsp;<select name="pageselct" style="cursor: pointer;margin-top:-1px;"><option value="30">30条</option><option value="50">50条</option><option selected="selected" value="100">100条</option><option value="300">300条</option></select>&nbsp;<span style="color:#444444;"></span></a></li><li class="xianshipage"><span id="cursor" style="cursor: default; color: rgb(68, 68, 68); border: 0px;" title="">第0-0条，共0条</span></li><li class="disabled"><a title="第一页" style="border-bottom-left-radius: 2px; border-top-left-radius: 2px;">&lt;&lt;</a></li><li class="disabled"><a title="上一页">&lt;</a></li><li class="disabled"><a title="下一页">&gt;</a></li><li class="disabled"><a title="最后一页">&gt;&gt;</a></li><li><a title="第1/1页">1/1</a></li>`);
  $("#upPage select[name='pageselct'],#downPage select[name='pageselct']").on("change",function(){
    $("#pageSize").val($(this).val());
    $("#downPage select[name='pageselct']").val($(this).val());
    $("#upPage select[name='pageselct']").val($(this).val());
    $("#pageNo").val(1);
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  });
  $("#upPage a[title='上一页'],#downPage a[title='上一页']").on("click",function(){
    var pageNo = parseInt($("#pageNo").val());
    pageNo = pageNo-1 <= 0? 1:pageNo-1;
    $("#pageNo").val(pageNo);
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  });
  $("#upPage a[title='第一页'],#downPage a[title='第一页']").on("click",function(){
    $("#pageNo").val(1);
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  });
  $("#upPage a[title='下一页'],#downPage a[title='下一页']").on("click",function(){
    var pageNo = parseInt($("#pageNo").val());
    var totalPage = parseInt($("#totalPage").val());
    pageNo = pageNo + 1>totalPage?totalPage:pageNo+1;
    $("#pageNo").val(pageNo);
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  })
  $("#upPage a[title='最后一页'],#downPage a[title='最后一页']").on("click",function(){
    var totalPage = parseInt($("#totalPage").val());
    $("#pageNo").val(totalPage);
    $('#loading').modal('show');
    refreshData();
    $('#loading').modal('hide');
  })
  $("#pageNo").val(1);
}


const refreshData = async function(){ //刷新数据
  var pageSize = parseInt($("#pageSize").val());
  var filter = $("#aliChoice #filter .myj-active").attr("value");
  var sort = [$.trim($("#aliChoice #sortType a.myj-active").text()),$("#aliChoice #sortType a.myj-active span").hasClass("myjCaretDown")? "down":"up"];
  var contentTr = $("#aliChoiceGoodsContent table.purchasingAdvice > tbody > tr.content");
  contentTr.show();
  if(sort[0] === "按采购建议"){
    var cacheTrContent =  contentTr.clone(true);
    if(sort[1] === "down"){
      cacheTrContent.sort(function(a,b){
        return parseInt($(b).find(".variantHoverDiv .fee").text()) - parseInt($(a).find(".variantHoverDiv .fee").text())
      })
      $("#aliChoiceGoodsContent table.purchasingAdvice > tbody").empty();
      $("#aliChoiceGoodsContent table.purchasingAdvice > tbody").append(cacheTrContent);
    }else if (sort[1] === "up"){
      cacheTrContent.sort(function(a,b){
        return parseInt($(a).find(".variantHoverDiv .fee").text()) - parseInt($(b).find(".variantHoverDiv .fee").text())
      })
      $("#aliChoiceGoodsContent table.purchasingAdvice > tbody").empty();
      $("#aliChoiceGoodsContent table.purchasingAdvice > tbody").append(cacheTrContent);
    }
    contentTr = $("#aliChoiceGoodsContent table.purchasingAdvice > tbody > tr.content");
  }
  contentTr.find("*.pointer").popover();
  contentTr.find("input[name='productBoxs']").prop("checked",false);
  contentTr.find(".showSelCheckboxNum").hide();
  if (filter === "onlyHasNumb"){
    contentTr = contentTr.map(function(){
      if(parseInt($.trim($(this).find(".variantHoverDiv .fee").text())) > 0){
        return this;
      }else{
        $(this).hide();
      }
    });
  }
  var searchValueNo = $.trim($("#aliChoice #searchValueNo").attr("value"));
  if(searchValueNo !== ""){
    var searchType = $.trim($("#aliChoice .searchType a.myj-active").text());
    switch (searchType) {
      case "产品SKU":
        contentTr = contentTr.map(function(){
          if (searchValueNo === $(this).find("span.sku-content").text()){
            return this
          }else{
            $(this).hide()
          }
        });
        break;
      case "产品名称":
        contentTr = contentTr.map(function(){
          if ($(this).find("span.product_title").text().includes(searchValueNo)){
            return this
          }else{
            $(this).hide()
          }
        });
        break;
      default:
        break;
    }
  }
  var totalSize = contentTr.length;
  var totalPage = totalSize/pageSize > parseInt(totalSize/pageSize)? parseInt(totalSize/pageSize)+1 : totalSize/pageSize;
  var pageNo = parseInt($("#pageNo").val());
  $("#totalSize").val(totalSize);
  $("#totalPage").val(totalPage);
  if(pageNo <= 1){
    $("#upPage a[title='上一页'],#downPage a[title='上一页']").parent().addClass("disabled");
    $("#upPage a[title='第一页'],#downPage a[title='第一页']").parent().addClass("disabled");
  }else{
    $("#upPage a[title='上一页'],#downPage a[title='上一页']").parent().removeClass("disabled");
    $("#upPage a[title='第一页'],#downPage a[title='第一页']").parent().removeClass("disabled");
  }
  if(pageNo >= totalPage){
    $("#upPage a[title='下一页'],#downPage a[title='下一页']").parent().addClass("disabled");
    $("#upPage a[title='最后一页'],#downPage a[title='最后一页']").parent().addClass("disabled");
  }else{
    $("#upPage a[title='下一页'],#downPage a[title='下一页']").parent().removeClass("disabled");
    $("#upPage a[title='最后一页'],#downPage a[title='最后一页']").parent().removeClass("disabled");
  }
  $("li.xianshipage #cursor").text(`第${pageNo * pageSize - pageSize + 1}-${pageNo*pageSize > totalSize? totalSize:pageNo*pageSize}条，共${totalSize}条`);
  $("#upPage a[title='第1/1页']").text(`${pageNo}/${totalPage}`);
  $("#downPage a[title='第1/1页']").text(`${pageNo}/${totalPage}`);
  var start= pageNo * pageSize - pageSize,
      end = pageNo*pageSize > totalSize? totalSize:pageNo*pageSize;
  $.map(contentTr.toArray().slice(0,start),function(val){
    $(val).hide();
  });
  $.map(contentTr.toArray().slice(end,totalSize),function(val){
    $(val).hide();
  })
}
const pushData = async function(){    //获取采购建议
  var fiveDaySaleInfo = await getSaleList(5);
  var stockInfo = await getStockData(Object.keys(fiveDaySaleInfo)); //库存信息
  var supplier = await getSupplier($.map(stockInfo,function(val){return val.id}));
  //公式 ((5天平均的销量 * 3) - (库存-当日销售)) - 待到货
  var objects = {}
  for (var sku in fiveDaySaleInfo){
    if(Object.keys(stockInfo).includes(sku)){
      objects[sku] = {
        id: stockInfo[sku].id,
        stockId: stockInfo[sku].stockId,
        supplierId: supplier[stockInfo[sku].id].supplierId,
        supplierObj: supplier[stockInfo[sku].id].supplierObj,
        warehouseId: supplier[stockInfo[sku].id].warehouseId,
        warehouseObj: supplier[stockInfo[sku].id].warehouseObj,
        linksNode: stockInfo[sku].linksNode,
        imageUrl: stockInfo[sku].imageUrl,
        title: stockInfo[sku].title,
        fiveDaySale: fiveDaySaleInfo[sku],
        stock: stockInfo[sku].stock
      }
    }

  }
  insertToTable(objects);
}
const insertToTable = function(objs){
  for (var sku in objs){
    obj = objs[sku];
    var stockNode = $(obj.stock);
    var fiveDaySaleAvger_i = obj.fiveDaySale/5 > parseInt(obj.fiveDaySale/5)?parseInt(obj.fiveDaySale/5)+1: obj.fiveDaySale/5;
    var stockList = stockNode.find("td").map(function(){
      return parseInt($(this).text().replaceAll("\n","").trim());
    }).toArray()
    stockNode.find("td").eq(0).remove();
    stockNode.find("td").css("border","none");
    stockNode.find("td").addClass("f-center");
    stockNode = stockNode.prop("outerHTML");
    var trData = $(`
    <tr class="proposal content" supplierid="supplierid_${obj.supplierId}" data-type="">
      <td class="expand_scope2 w35 maxW30">
        <input name="productBoxs" type="checkbox" value="${obj.id}" warehouseid="${obj.warehouseId}" supplierid="${obj.supplierId}" onclick="selectProductItem(this)" class="input1">
      </td>
      <td class="proposalInfo  minW410">
        <table class="myj-table-in">
          <tbody>
            <tr>
              <td class="imgDivOutTd">
                <div class="imgDivOut" style="margin-right:0px;">
                  <div class="imgDivIn epz_out" data-name="yuxinuo">
                    <img data-original="${obj.imageUrl}" class="imgCss lazy" referrerpolicy="no-referrer" src="${obj.imageUrl}">
                      <div class="pz_o" style="width: 320px;">
                        <div class="pz_img_o" style="width: 300px; height: 300px;">
                          <img src="" data-src="${obj.imageUrl}" referrerpolicy="no-referrer">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                ${obj.linksNode?obj.linksNode:""}
              </td>
              <td class="imgDivTitleTd p-left5">
                <div>
                  <span class="f-blue pointer limingcentUrlpic sku-content" onclick="window.open('dxmCommodityProduct/index.htm?id=${obj.id}','_blank');">${sku}</span>
                </div>
                <div class="gray-c no-new-line2" style="height:55px"><span class="product_title">${obj.title}</span></div>
                <div>
                  <span class="gray-c inline-block w150 no-new-line">${obj.warehouseObj.name}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </td>
      <td class="p-left0 p-right0 minW300">
        <table class="w-full">
          <tbody>
            ${stockNode}
          </tbody>
        </table>
      </td>
      <td class="w100 gray-c minW100">[${obj.fiveDaySale}] / [${obj.fiveDaySale / 5}]</td>
      <td class="w100 gray-c minW100" data-type="propose">
        <span class="fRed" data-toggle="popover" data-trigger="manual" data-content="" data-html="true" data-template="" data-show="0" data-loaded="1" data-original-title="" title="">${fiveDaySaleAvger_i * 3 - (stockList[1]+stockList[4])}</span>
        <div class="variantHoverDiv">
          <span class="gray-c fee">${fiveDaySaleAvger_i * 3 - (stockList[1]+stockList[4])}</span>
          <a href="javascript:" class="glyphicon glyphicon-edit"></a>
        </div>
      </td>
      <td class="operation minW80">
        <a href="javascript:" data-type="0" onclick="flyIntoShopCart(this,event);" id="addPlanBnt">加入计划</a>
        <div class="dropdown btn-dropdown">
          <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown" type="button" onclick="">更多<i class="iconfont icon_down"></i></a>
          <ul class="dropdown-menu menu" style="left: auto;right: 0;min-width: 80px;display:none" role="menu" aria-labelledby="">
            <li>
              <a href="javascript:">更换供货商</a>
            </li>
          </ul>
        </div>
      </td>
    </tr>`);
    trData.find("input[name='productBoxs']").on("click",function(){
      if($("#aliChoiceGoodsContent table.purchasingAdvice > tbody > tr.content input[name='productBoxs']:checked").length > 0){
        $("#aliChoiceGoodsContent .showSelCheckboxNum").show();
      }else{
        $("#aliChoiceGoodsContent .showSelCheckboxNum").hide();
      }
    })
    trData.find("#addPlanBnt").on("click",async function(){
      var productId = $(this).closest("tr.content").find("input[name='productBoxs']").attr("value");
      var productNumb = parseInt($(this).closest("tr.content").find(".variantHoverDiv .fee").text());
      var warehouseId = $(this).closest("tr.content").find("input[name='productBoxs']").attr("warehouseid");
      var supplierId = $(this).closest("tr.content").find("input[name='productBoxs']").attr("supplierid");
      await addPurchasePlan([{
        productId:productId,
        productNumb:productNumb,
        warehouseId:warehouseId,
        supplierId:supplierId
      }])
    });
    trData.find("div.variantHoverDiv a.glyphicon-edit").on("click",function(){
      var editHtml = $('<div class="variantBotton purchasing m-top5" data-tagName="editRefundFee" >'+
          '<button type="button" class="button btn-determine btn-edit-enter skuEditEnter">保存</button>' +
          '<button type="button" class="button btn-gray btn-edit-restart skuEditRestart">取消</button>'+
          '</div>');
      var iptHtml = $(`<input id="varintUpdateInput" class="varintUpdateInput" autocomplete="off" type="text" maxlength="7" oninput="clearMistakeNumber(this)" value="${$.trim($(this).closest('div.varianthoverdiv').text())}"/><br>`);
      editHtml.prepend(iptHtml);
      $(this).closest('div.variantHoverDiv').after(editHtml);
      editHtml.find("button.skuEditEnter").on("click",function(){
        $(this).closest("tr.content").find(".variantHoverDiv .fee").text(iptHtml.val());
        $('.variantBotton.purchasing').remove();
      });
      editHtml.find("button.skuEditRestart").on("click",function(){
        $('.variantBotton.purchasing').remove();
      });
    });
    $("#aliChoiceGoodsContent table.purchasingAdvice > tbody").append(trData);
  }
}
const initView = async function(){  //初始化视图
  if ($("#liTwo li.tabA").eq(0).hasClass("treeBackgrounda")){
    var btn = $(`<li class="text-center m-left10" id="alichoicePurchasingAdvice"><a href="javascript:"><span>全托管采购建议</span></a></li>`);

    // var dataPool = $(`<input type="hidden" id='dataPool' name='dataPool' value="{}">`);
    // $("body.in-body").append(dataPool);

    btn.on("click",async function(){
      $('#loading').modal('show');
      setScence();
      await pushData();
      $(document).off('mouseover', 'span.showUnbilledOrderDetail')
          .on('mouseover', 'span.showUnbilledOrderDetail', function () {
            var _this = $(this);
            if ($(this).attr('data-content')) return;
            var id = _this.closest('tr').attr('data-id');

            WAREHOUSE_PRODUCT.unBilledOrderInfo(id, _this);
          });
      refreshData();
      $('#loading').modal('hide');
    });
    await new Promise((resolve)=>{
      setTimeout(function(){
        $('ul.proposalTab').append(btn);
        $("ul.proposalTab li").on("click",function(){
          $("ul.proposalTab li").removeClass("active");
          $(this).addClass("active");
        })
        resolve();
      },500);
    })
  }
  $("ul.proposalTab li:not(#alichoicePurchasingAdvice)").on("click",function (){
    $("#aliChoice").addClass("hide");
  })
}
//=============================



window.onload=function(){
  setTimeout(async function(){
    var html = $('#rightPage').get(0);
    const observer_config = {childList: true};
    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(async function(){
      //刷新了页面就定是修改了Tab标签，届时要添加
      observer.disconnect();
      await initView();
      observer.observe(html, observer_config);
    });
    await initView();     //初始化按钮
    observer.observe(html, observer_config);
  },1000)
}()