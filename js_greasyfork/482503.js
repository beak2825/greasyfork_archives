// ==UserScript==
// @name        增强型视图 - 十一式
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       https://www.dianxiaomi.com/purchasingProposal/index.htm
// @match       https://www.dianxiaomi.com/dxmPurchasingNote/waitPayIndex.htm
// @icon        https://www.voidtools.com/favicon.ico
// @grant GM_xmlhttpRequest
// @require     https://fastly.jsdelivr.net/npm/dayjs@1.10.7
// @version     0.0.1
// @author      -
// @description 2023/12/16 00:20:17



// @downloadURL https://update.greasyfork.org/scripts/482503/%E5%A2%9E%E5%BC%BA%E5%9E%8B%E8%A7%86%E5%9B%BE%20-%20%E5%8D%81%E4%B8%80%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/482503/%E5%A2%9E%E5%BC%BA%E5%9E%8B%E8%A7%86%E5%9B%BE%20-%20%E5%8D%81%E4%B8%80%E5%BC%8F.meta.js
// ==/UserScript==
const decodeFormData = function(rawData){
  var data = [];
  for(var key in rawData){
    data.push(`${key}=${rawData[key]}`);
  }
  return data.join("&");
}
const getTableData = async function(){
  var todayDate = new dayjs().format('YYYY-MM-DD');
  var beforeFiveDay = new dayjs().subtract(5,'days').format('YYYY-MM-DD');

  //现在开始获取销量统计的数据
  // https://www.dianxiaomi.com/stat/product/statSalesPageList.htm
  //========================
  var pageList = [];
  var data = {
    'shopIds': ',4878585',
    'shopGroupId':'',
    'beginDate': beforeFiveDay,
    'endDate': todayDate,
    'searchType': 'productName',
    'searchValue':'',
    'sortType': 'salesCount',
    'isDesc': 1,
    'pageNo': 1,
    'totalSize':'',
    'pageSize': 100
  };
  pageData = await new Promise((resolve)=>{
    GM_xmlhttpRequest({
      method: "POST",
      url: "https://www.dianxiaomi.com/stat/product/statSalesPageList.htm",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: decodeFormData(data),
      onload: function(response) {
        let rt = response.responseText;
        resolve(rt);
      }
    })
  });
  pageList.push(pageData);
  var totalPages = parseInt($(pageData).find("#totalPage").attr('value'));
  if (totalPages > 1){
    for (i=2;i<totalPages+1;i++){
      data['pageNo'] = i;
      pageData = await new Promise((resolve)=>{
        GM_xmlhttpRequest({
          method: "POST",
          url: "https://www.dianxiaomi.com/stat/product/statSalesPageList.htm",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: decodeFormData(data),
          onload: function(response) {
            let rt = response.responseText;
            resolve(rt);
          }
        })
      });
      pageList.push(pageData);
    }
  }
  //page收集完成，开始分析
  var saleData = [];
  for(var page of pageList){
    $(page).find("table.in-table#moneyCny tr.content").map(function(){
      var obj = {
        sku:undefined,
        saleCount5d:undefined,
      }
      obj.sku = $(this).find("td:nth-child(4)").text();
      obj.saleCount5d = parseInt($(this).find("td:nth-child(7)").text());
      saleData.push(obj);
    });
  }

  //现在开始获取仓库清单的数据
  // https://www.dianxiaomi.com/warehouseProduct/pageList.htm
  //========================
  data = {
    'zoneType': 0,
    'pageNo': 1,
    'pageSize': 300,
    'searchType': 1,
    'searchValue': encodeURIComponent(saleData.map(function(val){return val.sku}).join(',')),
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
  pageList = [];

  pageData = await new Promise((resolve)=>{
    GM_xmlhttpRequest({
      method:"POST",
      url:"https://www.dianxiaomi.com/warehouseProduct/pageList.htm",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:decodeFormData(data),
      onload:function(response) {
        let rt = response.responseText;
        resolve(rt);
      }
    })
  });
  pageList.push(pageData);
  var totalPages = parseInt($(pageData).siblings("input#totalPage").attr("value"));
  if(totalPages > 1 && data['searchValue'] !==''){
    for(i=2;i<totalPages+1;i++){
      data['pageNo'] = i;
      pageData = await new Promise((resolve)=>{
        GM_xmlhttpRequest({
          method:"POST",
          url:"https://www.dianxiaomi.com/warehouseProduct/pageList.htm",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data:decodeFormData(data),
          onload:function(response) {
            let rt = response.responseText;
            resolve(rt);
          }
        })
      });
      pageList.push(pageData);
    }
  }
  //page收集完成，开始分析
  var stockData = {};
  for(var page of pageList){
    $(page).find("table.in-table tr.content").map(function(){
      var sku = $(this).find("span.productSku").text();
      var title = $(this).find("p.name").attr("title");
      var imageUrl = $(this).find("div.imgDivIn img.imgCss").attr("src");
      var productID = $(this).find("input[iptid='selectSingle']").attr("value");
      var usable = $(this).find(`tr[data-id='${productID}'] td:nth-child(5) span.pointer`).text();
      productID = $(this).find("a.limingcentUrlpic").attr("href").split('=')[1];
      var link = $(this).find("div.imgDivIn").siblings("p").find("a").attr("href");
      stockData[sku] = {
        title: title,
        imageUrl: imageUrl,
        usable: parseInt(usable),
        productID: productID,
        link: link,
      };
    });
  }

  //现在开始获取当日销售的数据
  // https://www.dianxiaomi.com/package/list.htm
  //========================
  data = {
    "pageNo":1,
    "pageSize":300,
    "shopId":-1,
    "state":"paid",
    "authId":-1,
    "country":"",
    "platform":"aliChoice",
    "isSearch":0,
    "startTime":"",
    "endTime":"",
    "orderField":"order_pay_time",
    "isVoided":0,
    "isRemoved":0,
    "ruleId":-1,
    "sysRule":"",
    "applyType":"",
    "applyStatus":"",
    "printJh":-1,
    "printMd":-1,
    "commitPlatform":"",
    "productStatus":"",
    "jhComment":-1,
    "storageId":0,
    "history":"",
    "custom":-1,
    "isOversea":-1,
    "timeOut":0,
    "refundStatus":0,
    "forbiddenStatus":-1,
    "forbiddenReason":0,
    "behindTrack":-1
  }
  var url = "https://www.dianxiaomi.com/package/list.htm?"+decodeFormData(data);
  pageList = [];
  pageData = await new Promise((resolve)=>{
    GM_xmlhttpRequest({
      method:"GET",
      url:url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload:function(response) {
        let rt = response.responseText;
        resolve(rt);
      }
    })
  });
  pageList.push(pageData);
  totalPages = $(pageData).find("input#totalPage").attr("value");
  if(totalPages > 1){
    for(i=2;i<totalPages+1;i++){
      data['pageNo'] = i;
      var url = "https://www.dianxiaomi.com/package/list.htm?"+decodeFormData(data);
      pageData = await new Promise((resolve)=>{
        GM_xmlhttpRequest({
          method:"GET",
          url:url,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          onload:function(response) {
            let rt = response.responseText;
            resolve(rt);
          }
        })
      });
      pageList.push(pageData);
    }
  }
  //page收集完成，开始分析
  var td_saleData = {};
  for(page of pageList){
    $(page).find("#orderListTable tr[data-platform='aliChoice']").map(function(){
      td_saleData[$(this).find('a.pairProInfoSku').text()] = parseInt($(this).find("p.limingcentUrlpicson span").text());
    });
  }

  //现在开始映射数据，得到表格数据
  //========================
  var tableData = [];
  for(var item of saleData){
    var obj = {
      sku:item.sku,
      productID:stockData[item.sku].productID,
      title:stockData[item.sku].title,
      link:stockData[item.sku].link,
      imageUrl:stockData[item.sku].imageUrl,
      stockCount:stockData[item.sku].usable,
      td_saleCount:td_saleData[item.sku],
      saleCount:item.saleCount5d,
      saleAverage:item.saleCount5d / 5 > parseInt(item.saleCount5d / 5)?parseInt(item.saleCount5d / 5) + 1 : item.saleCount5d / 5,
    }
    tableData.push(obj);
  }
  return tableData;
}
const getSupplier = async function(id){
  var url = "https://www.dianxiaomi.com/dxmPurchasePlan/addDxmProduct.htm";
  data = {
    "ids":id
  }
  pageData = await new Promise((resolve)=>{
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: decodeFormData(data),
      onload: function(response) {
        let rt = response.responseText;
        resolve(rt);
      }
    })
  });
  var supplierId = $(pageData).find("div.supplierLocation").attr("data-origin");
  var warehouseId = $(pageData).find("div.warehouseLocationTip").attr("data-origin");
  var warehouseListPlatId = JSON.parse(decodeURIComponent($(pageData).find("span#warehouseListPlatId").text()));
  if(warehouseId === undefined && warehouseListPlatId.length === 1){
    warehouseId = warehouseListPlatId[0].idStr;
  }
  var obj = {
    supplierId:supplierId,
    warehouseId:warehouseId
  }
  return obj
}
const addPurchasePlan = async function(productId,productNumb,warehouseId,supplierId){
  var url = "https://www.dianxiaomi.com/dxmPurchasePlan/addPurchasePlan.json";
  var data = {
    "dxmPurchasePlans":JSON.stringify([{"productId":productId,"purchasePlanNumber":productNumb,"warehouseId":warehouseId,"supplierId":supplierId}])
  }
  var res = await new Promise((resolve)=>{
    GM_xmlhttpRequest({
      method:"POST",
      url:url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:decodeFormData(data),
      onload:function(response) {
        let rt = response.responseText;
        resolve(rt);
      }
    });
  })
  return JSON.parse(res);
}
const deletePurchasePlan = async function(pid){
  var url = "https://www.dianxiaomi.com/dxmPurchasePlan/deletePurchasePlan.json";
  var data = {
    "purchaseIds":pid
  }
  GM_xmlhttpRequest({
      method:"POST",
      url:url,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:decodeFormData(data),
      onload:function(response) {
        var resultCode = JSON.parse(response.responseText).code;
        if (resultCode === 1){
          $.fn.message({type : 'success', msg : '删除采购计划成功'});
        }else{
          $.fn.message({type : 'error', msg : '删除采购计划失败'});
        }
      }
    });
}
var flyIntoShopCart = function(obj, e){
  var event = e || window.event;
  var offset = $('#rightAnchorEnd').offset(),
      flyer = $('<img class="ctr-flyer" src="//www.dianxiaomi.com/static/img/kong.png"/>'),
      src;

  src = $(obj).closest('tr').find('.imgDivIn .imgCss').data('original');
  if(src != '') flyer.attr('src', src);

  flyer.fly({
    start: {
      left: e.clientX,
      top: e.clientY - 30
    },
    end: {
      left: offset.left,
      top: 180,
      width: 0,
      height: 0
    }
  });
} //加入图片飞入购物车
const initData = async function(){
  $("#loading").modal("show");
  var crumbs = $('<div class="col-xs-12 p0 myj-crumbs-box"><div class="col-xs-12 p0"><div id="categoryNav" class="col-xs-12 myj-crumbs"><span>当前位置：</span><span>采购 </span><span style="font-family:simsun">&gt;</span> 生成采购单</div></div></div>')
  $("#myTabContentOne").append(crumbs);
  var t_table = $('<table class="myj-table purchasePageListTable col-xs-10  mTop10"></table>');
  var t_th = $('<thead></thead>');
  var titleLable = ['商品编码','可用库存','当日销售','以往五日销量','以往五日平均销量','建议数量<br><span style="text-decoration:underline">采购数量','操作'];
  var t_tmpTr = $('<tr></tr>');
  for(var lable of titleLable){
    var t_tmpTh = $(`<th>${lable}</th>`);
    t_tmpTr.append(t_tmpTh);
  }
  t_th.append(t_tmpTr);
  t_table.append(t_th);
  var t_tbody = $('<tbody></tbody>');
  var tableData = await getTableData();
  for(tr_data of tableData){
    var t_tr = $('<tr class="proposal content" value data-trname="contentTr"></tr>');
    var t_td = $('<td class="proposalInfo w360 minW410"></td>');
    var t_td_tPic = $(`<td class="imgDivOutTd" style="width:64px"><div class="imgDivOut" style="margin-right:0px;"><div class="imgDivIn epz_out" data-name="无"><img class="imgCss lazy" data-original="${tr_data.imageUrl}" src="${tr_data.imageUrl}" style="display: block;"><div class="pz_o" style="width: 320px; top: auto; bottom: 0px;"><div class="pz_po"><div class="pz_at"></div><div class="pz_img_o" style="width: 300px; height: 300px;"><img src="${tr_data.imageUrl}" data-src="${tr_data.imageUrl}" referrerpolicy="no-referrer"></div></div></div></div></div></td>`);
    var link_p = $(`<p class="m0"></p>`);
    if (/https:\/\/detail.1688.com/g.test(tr_data.link)){
      link_p.append(`<a class="details_imgTila" href="javascript:" data-url="${tr_data.link}" onclick="purchasing.redirectUrl(this);">1688</a>`);
    }
    t_td_tPic.append(link_p);
    var t_td_tTit = $(`<td class="imgDivTitleTd p-left5" style="text-align:left;width:100%"><div><span class="f-blue pointer limingcentUrlpic" onclick="window.open('dxmCommodityProduct/index.htm?id=${tr_data.productID}','_blank');">${tr_data.sku}</span></div><div class="gray-c no-new-line2"><span>${tr_data.title}</span></div></td>`)
    t_td.append(t_td_tPic);
    t_td.append(t_td_tTit);
    t_tr.append(t_td);

    t_td = $(`<td class="gray-c minW40"><span>${tr_data.stockCount}</span></td>`);
    t_tr.append(t_td);

    t_td = $(`<td class="gray-c minW40"><span value='${tr_data.td_saleCount}' >${tr_data.td_saleCount}</span></td>`);
    if (t_td.attr('value') === undefined){
      t_td.find("span").text("无");
    }
    t_tr.append(t_td);

    t_td = $(`<td class="gray-c minW40"><span>${tr_data.saleCount}</span></td>`);
    t_tr.append(t_td);

    t_td = $(`<td class="gray-c minW40"><span>${tr_data.saleAverage}</span></td>`);
    t_tr.append(t_td);

    //这里是求出最终的结果
    //============================================
    t_td = $(`<td style='font-weight:normal' p-value class='minW100'></td>`);
    var p_buyNumb = (tr_data.stockCount - (tr_data.td_saleCount === undefined ? 0:tr_data.td_saleCount)) >= tr_data.saleAverage * 3 ? 0:tr_data.saleAverage * 3 - (tr_data.stockCount - (tr_data.td_saleCount === undefined ? 0:tr_data.td_saleCount));
    if (p_buyNumb > 0){
      t_td.addClass("fRed");
      t_td.css("font-weight","bold");
    }
    var buyNumb = p_buyNumb;
    t_td.append($(`<span>建议数量：${buyNumb}</span><br>`));
    t_td.attr("p-value",buyNumb);
    var buyNumb_lay = $(`<input maxlength='7' class='buyNumb' oninput = '
                                                      clearMistakeNumber(this);
                                                      if(parseInt($(this).val()) < 1){
                                                        $(this).parent().removeClass("fRed");
                                                        $(this).parent().css("font-weight","normal");
                                                      }else{
                                                        $(this).parent().addClass("fRed");
                                                        $(this).parent().css("font-weight","bold");
                                                      }'
                                              onblur = '
                                                      if($(this).val() === ""){
                                                        $(this).val(0);
                                                        $(this).trigger("input");
                                                      }
    '/>`);
    buyNumb_lay.css("width","58px");
    buyNumb_lay.css("padding-left","2px");
    buyNumb_lay.val(buyNumb);
    t_td.append(buyNumb_lay);
    t_td.append($(`<i class="glyphicon glyphicon-refresh" style="color:#428bca; margin-left:2px; font-size: 10px;" onclick="$(this).siblings('input').val($(this).siblings('span').text());$(this).siblings('input').trigger('input')"></i>`))
    t_tr.append(t_td);
    //============================================

    t_td = $(`<td class='gray-c minW100'></td>`);
    var b_joinPlans = $(`<a href="javascript:;" data-id="${tr_data.productID}" pid data-type="0">加入计划</a>`);
    b_joinPlans.on("click",async function(event){
      if($(this).attr("data-type") === '0'){
        $(this).attr("data-type",'1');
        flyIntoShopCart(this,event);
        var supplierInfo = await getSupplier($(this).attr("data-id"));
        var buyNamb = $(this).parent().parent().find('input.buyNumb').val();
        var res =  await addPurchasePlan($(this).attr("data-id"),parseInt(buyNamb),supplierInfo.warehouseId,supplierInfo.supplierId);
        $(this).attr("pid",res.data[0]);
        $(this).text("已选择");
        $(this).css("color","green");
      }else if ($(this).attr("data-type") === '1'){
        $(this).attr("data-type",'0');
        await deletePurchasePlan($(this).attr("pid"));
        $(this).text("加入计划");
        $(this).css("color","");
        setTimeout(PURCHASEPLAN.getPlanSumNumBer(),1000);
      }
      PURCHASEPLAN.getPlanSumNumBer();
    });
    t_td.append(b_joinPlans);
    t_tr.append(t_td);
    t_tbody.append(t_tr);
  }
  t_table.append(t_tbody);
  var form = $(`
  <div class="tab-content col-xs-12 p0" show="yesPurchasingId">
    <div class="col-xs-12 pBottom10">
      <div class="col-xs-1 w80 p0 pTop10 lHeight24">排序：</div>
      <div class="col-xs-10 pTop10 lHeight24 p-left0" id="pxDivId">
        <a href="javascript:" class="mRight10 myj-aFocus" index='0'>按可用库存&nbsp;
            <span class="mRight5" style="margin-top: -2px;"></span>
        </a>
        <a href="javascript:" class="mRight10 myj-aFocus" index='1'>按五日平均&nbsp;
            <span class="mRight5" style="margin-top: -2px;"></span>
        </a>
        <a href="javascript:" class="mRight10 myj-aFocus" index='2'>按采购建议&nbsp;
            <span class="mRight5" style="margin-top: -2px;"></span>
        </a>
      </div>
    </div>
  </div>`);
  form.find("a[index='0']").on("click",function(){
    $("div#pxDivId a").removeClass("myj-active");
    $(this).siblings('a').children('span').removeClass("myjCaretUp");
    $(this).siblings('a').children('span').removeClass("myjCaretDown");
    $(this).addClass("myj-active");
    var status = "down";
    if ($(this).find('span').hasClass("myjCaretDown")){
      var status = "up";
    }
    var bak_tr = $("table.purchasePageListTable > tbody > tr.content").map(function(){return $(this)});
    $("table.purchasePageListTable > tbody").empty();
    if(status === "down"){
      bak_tr.sort(function(a,b){
        return parseInt(b.children().eq(1).text()) - parseInt(a.children().eq(1).text());
      }).map(function(){
        $("table.purchasePageListTable > tbody").append($(this));
      })
      $(this).children('span').removeClass("myjCaretUp");
      $(this).children('span').addClass("myjCaretDown");
    }else if(status === "up"){
      bak_tr.sort(function(a,b){
        return parseInt(a.children().eq(1).text()) - parseInt(b.children().eq(1).text());
      }).map(function(){
        $("table.purchasePageListTable > tbody").append($(this));
      });
      $(this).children('span').removeClass("myjCaretDown");
      $(this).children('span').addClass("myjCaretUp");
    }
  });
  form.find("a[index='1']").on("click",function(){
    $("div#pxDivId a").removeClass("myj-active");
    $(this).siblings('a').children('span').removeClass("myjCaretUp");
    $(this).siblings('a').children('span').removeClass("myjCaretDown");
    $(this).addClass("myj-active");
    var status = "down";
    if ($(this).find('span').hasClass("myjCaretDown")){
      var status = "up";
    }
    var bak_tr = $("table.purchasePageListTable > tbody > tr.content").map(function(){return $(this)});
    $("table.purchasePageListTable > tbody").empty();
    if(status === "down"){
      bak_tr.sort(function(a,b){
        return parseInt(b.children().eq(4).text()) - parseInt(a.children().eq(4).text());
      }).map(function(){
        $("table.purchasePageListTable > tbody").append($(this));
      })
      $(this).children('span').removeClass("myjCaretUp");
      $(this).children('span').addClass("myjCaretDown");
    }else if(status === "up"){
      bak_tr.sort(function(a,b){
        return parseInt(a.children().eq(4).text()) - parseInt(b.children().eq(4).text());
      }).map(function(){
        $("table.purchasePageListTable > tbody").append($(this));
      });
      $(this).children('span').removeClass("myjCaretDown");
      $(this).children('span').addClass("myjCaretUp");
    }
  });
  form.find("a[index='2']").on("click",function(){
    $("div#pxDivId a").removeClass("myj-active");
    $(this).siblings('a').children('span').removeClass("myjCaretUp");
    $(this).siblings('a').children('span').removeClass("myjCaretDown");
    $(this).addClass("myj-active");
    var status = "down";
    if ($(this).find('span').hasClass("myjCaretDown")){
      var status = "up";
    }
    var bak_tr = $("table.purchasePageListTable > tbody > tr.content").map(function(){return $(this)});
    $("table.purchasePageListTable > tbody").empty();
    if(status === "down"){
      bak_tr.sort(function(a,b){
        return parseInt(b.find("td[p-value]").attr('p-value')) - parseInt(a.find("td[p-value]").attr('p-value'));
      }).map(function(){
        $("table.purchasePageListTable > tbody").append($(this));
      })
      $(this).children('span').removeClass("myjCaretUp");
      $(this).children('span').addClass("myjCaretDown");
    }else if(status === "up"){
      bak_tr.sort(function(a,b){
        return parseInt(a.find("td[p-value]").attr('p-value')) - parseInt(b.find("td[p-value]").attr('p-value'));
      }).map(function(){
        $("table.purchasePageListTable > tbody").append($(this));
      });
      $(this).children('span').removeClass("myjCaretDown");
      $(this).children('span').addClass("myjCaretUp");
    }
  });
  $("#myTabContentOne").append(form);
  $("#myTabContentOne").append(t_table);
  $("#myTabContentOne").append($(`<input type="hidden" id="deletePurchaseId">`));
  $("#myTabContentOne").append($(`<input type="hidden" id="fromWay" value="">`));
  $("#myTabContentOne").append($('<script type="text/javascript" src="/static/js/purchasePlan.js?v=vh72.03"></script>'));
  $("#myTabContentOne").append($('<script type="text/javascript" src="/static/js/purchasing.js?v=mi72.07"></script>'));

  //处理右侧的小部件
  $("#rightAnchor").remove();
  var rightAnchor = $(`<div class="right-anchor pur-advice rightAnchor" id="rightAnchor"><a class="anchor" href="javascript:" onclick="PURCHASEPLAN.cartList();"><i class="attach-icons m-bottom5 f24" id="rightAnchorEnd"></i><span class="anchor-con">采购计划</span><span class="right-anchor-num m-top5" id="gwcNum">0</span></a></div>`);
  var rightAnchor_div = $(`<div class="right-fixed-action rightFixedAction" id="rightFixedAction"><div class="right-fixed-list"><div class="list-top"><label class="m-left10 f-left m-top5"><input id="selectAllShoppingCat" class="m-right5" type="checkbox"/>全选</label><a class="list-top-con" href="javascript:" onclick="PURCHASEPLAN.toPurchasingPlanPage(false)">全屏查看</a></div><div class="list-body"><div class="list-body-cover planCoverLoaing"></div><div class="list-body-in planCtrList myj-hide"></div></div><div class="list-foot f-center"><div class="clear-fix pur-plan-page-con"><span class="pull-left">已选：<span class="f16 f-orange" id="planNumberSumForShoppingCat"></span> 件</span><span class="pull-right f-orange">￥<span id="totalPriceForShoppingCat">0.0</span></span></div><button class="button pur-plan-page-btn purPlanPageBtn" id="toPurchasingPlan" type="button" onclick="PURCHASEPLAN.toPurchasingPlanPage(true);" disabled>生成采购单&nbsp;<span class="simsun">&gt;</span></button></div><div class="purchase-plan-hide-box purchasePlanHideBox"><span class="purchase-plan-hide-arrows purchasePlanHideBox"></span></div></div></div>`);
  $("#myTabContentOne").append(rightAnchor);
  $("#myTabContentOne").append(rightAnchor_div);
  $(function(){
    $(document).click(function (e) {
        if (!e)  var e = window.event;//获取事件点击元素
        var targ = e.target;//获取元素名称
        var dropObjA = $(targ).closest('.rightFixedAction');
        var dropObjB = $(targ).closest('.rightAnchor');
        if (!dropObjA.hasClass('rightFixedAction') && !dropObjB.hasClass('rightAnchor') &&
            !$(targ).hasClass('rightAnchor') || $(targ).hasClass('purchasePlanHideBox')){
            rightActionHidePlan();
        }
    });
    $('.hideThis').click(function(){
        rightActionHidePlan();
    });
    $('.anchor').click(function(){
        var rightAnchor = $('.rightAnchor');
        rightActionShowPlan();
    });
  });
  PURCHASEPLAN.getPlanSumNumBer();
  var rightActionHidePlan = function(){
    //隐藏侧边栏
    $('#rightFixedAction').animate({
        right:'-290px',opacity:'hide'
    },500);
    $('#rightAnchor').animate({
        right:'0',opacity:'show'
    },500);
  };
  var rightActionShowPlan = function(){
    //显示侧边栏
    $('#rightFixedAction').animate({
        right:'0',opacity:'show'
    },400);
    $('#rightAnchor').animate({
        right:'-40px',opacity:'hide'
    },500);
  };

  // $("#myTabContentOne").append(codeEditor);
  $("#loading").modal("hide");
}

window.onload = async function(){
  await new Promise((r)=>{
    setTimeout(function(){
      var t_title = $("<li class='liBorder bgColor5 tit1'><span class='txt mLeft12'><b>采购单生成</b></span></li>");
      var b_editor = $("<li class='tabA liMousover liBorder'><span class='txt' style='user-select:none;margin-left:22px'>全托管采购建议</span></li>");
      b_editor.on("click",async function(){
        $('#liOne').find('.treeBackgrounda').removeClass('treeBackgrounda');
        $('#liTwo').find('.treeBackgrounda').removeClass('treeBackgrounda');
        $(this).addClass('treeBackgrounda');
        $("#myTabContentOne").empty();
        await initData();
      });
      $("#proposalAndPurchase").append(t_title);
      $("#proposalAndPurchase").append(b_editor);
    },1000);
  });
}();