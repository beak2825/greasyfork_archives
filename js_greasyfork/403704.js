// ==UserScript==
// @name         美团商家流量导出Excel
// @namespace    http://tampermonkey.net/
// @version      0.1.17
// @description  Final Update
// @author       yhpl-pgq
// @match        https://shangoue.meituan.com/*
// @require      http://cdn.staticfile.org/xlsx/0.16.1/xlsx.mini.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/403704/%E7%BE%8E%E5%9B%A2%E5%95%86%E5%AE%B6%E6%B5%81%E9%87%8F%E5%AF%BC%E5%87%BAExcel.user.js
// @updateURL https://update.greasyfork.org/scripts/403704/%E7%BE%8E%E5%9B%A2%E5%95%86%E5%AE%B6%E6%B5%81%E9%87%8F%E5%AF%BC%E5%87%BAExcel.meta.js
// ==/UserScript==

var xmlExportContent = {traffic:[], source:[]};
var yhplHTTPCount = 0;
const EXCEL_TYPE_STORE_DETAIL = 0;
const EXCEL_TYPE_STORE_COMMENT = 1;
const EXCEL_TYPE_STORE_SEARCH_WORD_ZONE = 2;
const EXCEL_TYPE_STORE_PROMOTION = 3;
const EXCEL_TYPE_STORE_GOODS = 4;
const EXCEL_TYPE_STORE_SEARCH_WORD_STORE = 5;

const SEARCH_WORD_ROW = 30;
const SEARCH_WORD_ZONE_API_COUNT = 2;
const SEARCH_WORD_STORE_API_COUNT = 3;
var yhpl_acct_id = "";
(function() {
    'use strict';
    yhplHTTPCount = 0;
    addButton();
    console.log('enter')
})();

function addButton(){
    var headerLeft = $("#reload-page")[0];
    var header = headerLeft.parentElement;
    var button = document.createElement('BUTTON');
    button.innerText = "我是小可爱";
    button.onclick = ()=>{getStore(EXCEL_TYPE_STORE_DETAIL)};
    button.id = getButtonIdByType(EXCEL_TYPE_STORE_DETAIL);
    header.appendChild(button);

    var buttonComment = document.createElement('BUTTON');
    buttonComment.innerText = "评论分析";
    buttonComment.onclick = ()=>{getStore(EXCEL_TYPE_STORE_COMMENT)};
    console.log('EXCEL_TYPE_STORE_COMMENT:'+EXCEL_TYPE_STORE_COMMENT);
    buttonComment.id = getButtonIdByType(EXCEL_TYPE_STORE_COMMENT);
    header.appendChild(buttonComment);

    appendButton(header, EXCEL_TYPE_STORE_SEARCH_WORD_ZONE, '商圈热词分析(慎点)');
    appendButton(header, EXCEL_TYPE_STORE_SEARCH_WORD_STORE, '店铺热词分析(慎点)');
    appendButton(header, EXCEL_TYPE_STORE_PROMOTION, '营销分析');
    appendButton(header, EXCEL_TYPE_STORE_GOODS, '商品分析');

    //var div = $("pull-right")[0];
    //div.style.display="none";

    //document.getElementsByClassName('pull-right')[0].style.display = 'none'
}
function appendButton(parent, type, text){
    var bt = document.createElement('BUTTON');
    bt.innerText = text;
    bt.onclick = ()=>{getStore(type)};
    bt.id = getButtonIdByType(type);
    parent.appendChild(bt);
}
function getButtonIdByType(type){
    switch (type){
        case EXCEL_TYPE_STORE_DETAIL:
            return 'yhplExport';
        case EXCEL_TYPE_STORE_COMMENT:
            return 'yhplComment';
        case EXCEL_TYPE_STORE_SEARCH_WORD_ZONE:
            return 'yhplSearchZone';
        case EXCEL_TYPE_STORE_SEARCH_WORD_STORE:
            return 'yhplSearchStore';
        case EXCEL_TYPE_STORE_PROMOTION:
            return 'yhplPromotion';
        case EXCEL_TYPE_STORE_GOODS:
            return 'yhplGoods';
        default:
            return 'yhpl';
    }
}
function onStoreSuccess(type, node){
    var code = node.code
    window.node = node;
    console.log('onSuccess, code:'+code);
    if (!yhpl_acct_id || yhpl_acct_id.length <= 0){
        var left = document.cookie.indexOf('acctId=');
        var right = document.cookie.indexOf(';', left);
        yhpl_acct_id = document.cookie.substring(left + 7, right);
    }
    if (yhpl_acct_id.length <= 0){

        console.log('yhpl_acct_id is invalidate');
        return;
    }
    if (code == 0){
        var data = node.data;
        //   data = data.slice(0, 1);
        // data[0].id = '8346785';
        switch (type){
            case EXCEL_TYPE_STORE_DETAIL:
                // data = data.slice(0, 1);
                // data[0].id = '8346785';
                onStoreSuccessTypeDetail(data);
                break;
            case EXCEL_TYPE_STORE_COMMENT:{
                data = data.slice(1, data.length);
                onStoreSuccessTypeComment(data);
                break;
            }
            case EXCEL_TYPE_STORE_SEARCH_WORD_ZONE:{
                data = data.slice(1, data.length);
                //data = data.slice(1, 2);
                //data[0].id = '8346785';
                onStoreSuccessTypeSearchWordZone(data);
                break;
            }
            case EXCEL_TYPE_STORE_SEARCH_WORD_STORE:{
                data = data.slice(1, data.length);
                onStoreSuccessTypeSearchWordStore(data);
                break;
            }
            case EXCEL_TYPE_STORE_PROMOTION:{
                data = data.slice(1, data.length);
                //data = data.slice(1, 2);
                //data[0].id = '8346785';
                onStoreSuccessTypePromotion(data);
                break;
            }
            case EXCEL_TYPE_STORE_GOODS:{
                // data = data.slice(1, data.length);
                //data = data.slice(1, 2);
                //data[0].id = '8346785';
                data = data.slice(1, data.length);
                onStoreSuccessTypeGoods(data);
                break;
            }
            default:
                console.log("未处理的type:"+type);
                break;
        }

    }
}

function onStoreSuccessTypeDetail(stores){
    var length = stores.length;
    var totalRequestSize = length * 2;
    for(var poi = 0; poi < length; poi++){
        var child = stores[poi];
        console.log(child.poiName+"," +child.id);
        getStoreDetail(poi * 2, totalRequestSize, child.id, child.poiName);
        getStoreTrafficSource(poi * 2 + 1, totalRequestSize, child.id, child.poiName);
        yhplSleep();
    }
}
function onStoreSuccessTypeComment(stores){
    var length = stores.length;
    var totalRequestSize = length * 2;
    for(var poi = 0; poi < length; poi++){
        var child = stores[poi];
        var storeIndex = poi * 5 + 1;
        for (var i = 0; i<5; i++){
            var commentRow = [];
            commentRow.push(getStoreName(child.poiName, child.id));
            xmlExportContent.comment[storeIndex + i] = commentRow;
        }
        console.log(child.poiName+"," +child.id);
        getComment(poi * 2, totalRequestSize, child.id, child.poiName);
        getCommentSKUList(poi * 2 + 1, totalRequestSize, child.id, child.poiName);
        yhplSleep();
    }
}
/**
* 商圈搜索词
*/
function onStoreSuccessTypeSearchWordZone(stores){
    var length = stores.length;
    var totalRequestSize = length * SEARCH_WORD_ZONE_API_COUNT;
    for(var poi = 0; poi < length; poi++){
        var child = stores[poi];
        var storeIndex = poi * SEARCH_WORD_ROW + 1;
        for (var i = 0; i<SEARCH_WORD_ROW; i++){
            var row = [];
            row.push(getStoreName(child.poiName, child.id));
            xmlExportContent.searchAllZone[storeIndex + i] = row;
            xmlExportContent.searchMyZone[storeIndex + i] = row.concat();
        }
        console.log(child.poiName+"," +child.id);
        var offset = poi * SEARCH_WORD_ZONE_API_COUNT;
       // getSearchWord(offset, totalRequestSize, child.id, child.poiName, true, true);//全部商圈7天环比
       // getSearchWord(offset + 1, totalRequestSize, child.id, child.poiName, true, false);//全部商圈昨天环比
       // getSearchWord(offset + 2, totalRequestSize, child.id, child.poiName, false, true);//我的商圈7天环比
       // getSearchWord(offset + 3, totalRequestSize, child.id, child.poiName, false, false);//我的商圈昨天环比

        getSearchWord(offset + 0, totalRequestSize, child.id, child.poiName, false, true);//我的商圈7天环比
        getSearchWord(offset + 1, totalRequestSize, child.id, child.poiName, false, false);//我的商圈昨天环比
        yhplSleep();
    }
}

/**
* 本店TOP30搜索词
*/
function onStoreSuccessTypeSearchWordStore(stores){
    var length = stores.length;
    var totalRequestSize = length * SEARCH_WORD_STORE_API_COUNT;
    for(var poi = 0; poi < length; poi++){
        var child = stores[poi];
        var storeIndex = poi * SEARCH_WORD_ROW + 1;
        for (var i = 0; i<SEARCH_WORD_ROW; i++){
            var row = [];
            row.push(getStoreName(child.poiName, child.id));
            xmlExportContent.searchMyStoreClick[storeIndex + i] = row.concat();
            xmlExportContent.searchMyStoreOrder[storeIndex + i] = row.concat();
            xmlExportContent.searchMyStoreExpose[storeIndex + i] = row.concat();
        }
        console.log(child.poiName+"," +child.id);
        var offset = poi * SEARCH_WORD_STORE_API_COUNT;
        getStoreSearchWord(offset + 0, totalRequestSize, child.id, child.poiName, 1);//本店TOP30-曝光
        getStoreSearchWord(offset + 1, totalRequestSize, child.id, child.poiName, 2);//本店TOP30-点击排行
        getStoreSearchWord(offset + 2, totalRequestSize, child.id, child.poiName, 3);//本店TOP30-成单排行
        yhplSleep();
    }
}

function onStoreSuccessTypePromotion(stores){
    var length = stores.length;
    var totalRequestSize = length * 2;
    for(var poi = 0; poi < length; poi++){
        var child = stores[poi];
        console.log(child.poiName+"," +child.id);
        getPromotionSummary(poi * 2, totalRequestSize, child.id, child.poiName);
        getPromotionDetail(poi * 2 + 1, totalRequestSize, child.id, child.poiName);
        yhplSleep();
    }
}

function onStoreSuccessTypeGoods(stores){
    var length = stores.length;
    var totalRequestSize = length * 4;
    for(var poi = 0; poi < length; poi++){
        var child = stores[poi];
        console.log(child.poiName+"," +child.id);
        getGoodsSummary(poi * 4, totalRequestSize, child.id, child.poiName);//商品概览
        getGoodsHotSale(poi * 4 + 1, totalRequestSize, child.id, child.poiName, 'productOriginalAmt');//销售额
        getGoodsHotSale(poi * 4 + 1, totalRequestSize, child.id, child.poiName, 'productCnt');//销量
        getGoodsHotSale(poi * 4 + 3, totalRequestSize, child.id, child.poiName, 'isNew');//新品
        yhplSleep();
    }
}
async function yhplSleep() {
    await sleep(200)
    //  console.log('yhplSleep end!')
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


function onStoreError(type, e){
    console.log(e);
    console.log('onError');
}
function getStore(type){
    console.log('getStore enter type: '+type);
    switch (type){
        case EXCEL_TYPE_STORE_DETAIL:{
            xmlExportContent = {traffic:[], source:[]};
            xmlExportContent.traffic.push(['店铺名字', '指标名称', '当前', '7日对比', '行业对比'])
            xmlExportContent.source.push(['店铺名字', '指标名称', '曝光人数', '搜索', '商家列表', '订单页', '其他', '活动专区', '为你优选'])
            break;
        }
        case EXCEL_TYPE_STORE_COMMENT: {
            xmlExportContent = {comment:[], source:[]};
            xmlExportContent.comment.push(['店铺名字', '商家评分', '质量评分', '包装评分', '配送满意度', '平均配送时长',
                                           '评价榜', '好评榜-商品名称', '好评榜-赞', '好评榜-销量','好评榜-图片', '差评榜-商品名称', '差评榜-踩', '差评榜-销量','差评榜-图片'])
            break;
        }
        case EXCEL_TYPE_STORE_SEARCH_WORD_ZONE: {
            xmlExportContent = {searchAllZone:[], searchMyZone:[]};
            xmlExportContent.searchAllZone.push(['店铺名字', '排名', '搜索词', '搜索次数', '搜索次数前7日', '搜索次数环比', '搜索词(昨日)', '搜索次数(昨日)','搜索次数前日', '搜索次数环比(昨日)']);
            xmlExportContent.searchMyZone.push(['店铺名字', '排名', '搜索词', '搜索次数', '搜索次数前7日', '搜索次数环比', '搜索词(昨日)', '搜索次数(昨日)','搜索次数前日', '搜索次数环比(昨日)']);
            break;
        }
        case EXCEL_TYPE_STORE_SEARCH_WORD_STORE: {
            xmlExportContent = {searchMyStoreExpose:[], searchMyStoreClick:[], searchMyStoreOrder:[]};
            xmlExportContent.searchMyStoreExpose.push(['店铺名字', '排名', '搜索词', '成单量', '点击次数', '曝光', '平均排名']);
            xmlExportContent.searchMyStoreClick.push(['店铺名字', '排名', '搜索词', '成单量', '点击次数', '曝光', '平均排名']);
            xmlExportContent.searchMyStoreOrder.push(['店铺名字', '排名', '搜索词', '成单量', '点击次数', '曝光', '平均排名']);
            break;
        }
        case EXCEL_TYPE_STORE_PROMOTION: {
            xmlExportContent = {promotionSummary:[], promotionDetail:[]};
            xmlExportContent.promotionSummary.push(['店铺名字', '活动营业总额(元)', '总额-环比', '总额-环比增长率', '总额-商圈同行均值(元)',
                                                    '活动订单数', '订单-环比', '订单-环比增长率', '订单-商圈同行均值',
                                                    '活动成本(元)', '成本-环比', '成本-环比增长率', '成本-商圈同行均值(元)',
                                                    '商家补贴金额(元)', '商补-环比', '商补-环比增长率', '商补-商圈同行均值(元)',
                                                    '平台补贴金额(元)', '平补-环比', '平补-环比增长率', '平补-商圈同行均值(元)',
                                                    '投入产出比', '产出-环比', '产出-环比增长率', '产出-商圈同行均值']);
            xmlExportContent.promotionDetail.push(['店铺名字', '活动类型', '活动营业总额(元)', '活动订单数', '活动成本(元)', '商家补贴金额(元)', '平台补贴金额(元)', '投入产出比']);
            break;
        }
        case EXCEL_TYPE_STORE_GOODS: {
            xmlExportContent = {goodsSummary:[], goodsSaleAmt:[], goodsSaleCnt:[], goodsSaleNew:[]};
            xmlExportContent.goodsSummary.push(['店铺名字', '在售-商品数(件)', '在售-环比', '在售-环比增长率', '在售-商圈同行均值',
                                                '可售-商品数(件)', '可售-环比', '可售-环比增长率', '可售-商圈同行均值',
                                                '售罄率', '售罄率-环比', '售罄率-环比增长率', '售罄率-商圈同行均值',
                                                '下架-商品数(件)', '下架-环比', '下架-环比增长率', '下架-商圈同行均值',
                                                '在售曝光率', '在售曝光-环比', '在售曝光-环比增长率', '在售曝光-商圈同行均值',
                                                '在售动销率', '在售动销-环比', '在售动销-环比增长率', '在售动销-商圈同行均值']);
            var colName = ['店铺名字', '商品名称','商品条形码','原价销售额','实际销售额','销量','好评度'];
            xmlExportContent.goodsSaleAmt.push(colName);
            xmlExportContent.goodsSaleCnt.push(colName);
            xmlExportContent.goodsSaleNew.push(colName);
            break;
        }
        default : {
            console.log("未处理的type");
            return;
        }

    }
    yhplHTTPCount = 0;
    var URL_STORE = 'https://shangoue.meituan.com/api/poi/poiList';
    $.ajax({
        type: "POST",
        url: URL_STORE,
        data: '',
        success: (node) => {onStoreSuccess(type, node)},
        error:(e) => onStoreError(type, e),
        dataType: 'json'
    });
}
function onStoreDetailSuccess(step, total, text, storeID, storeName){
    console.log('onStoreDetailSuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_DETAIL, step, total);
        return;
    }
    var code = node.code
    console.log('onSuccess, code:'+code+",step:"+step);
    if (code == 0){
        var data = node.data;
        var storeDetailRows = [];
        if (data != null) {
            var length = data.length;
            for(var index = 0; index < length; index++){
                var child = data[index];
                var indexStr = child.index;
                var indexParsed = acceptDataNode(indexStr);
                var indexInt = getTrafficIndexAsInt(indexStr);
                if (indexParsed.length > 0 && indexInt >= 0){
                    var current = child.current;
                    var ring = child.ring;
                    var peer= child.peer;
                    if (peer== null && ring == null && peer == null) {
                        continue;
                    }
                    var storeDetailRow = [];
                    storeDetailRow.push(getStoreName(storeName, storeID));
                    storeDetailRow.push(indexParsed);
                    storeDetailRow.push(appendDateSuffix(indexStr, current));
                    storeDetailRow.push(appendDateSuffix(indexStr, ring));
                    storeDetailRow.push(appendDateSuffix(indexStr, peer));
                    storeDetailRows[indexInt] = storeDetailRow;
                    // console.log(child.index+"," +child.current);
                }
            }
            var rows = storeDetailRows.length;
            for(var rowIndex = 0; rowIndex < rows; rowIndex++){
                var row = storeDetailRows[rowIndex];
                if(row == null){
                    continue;
                }
                xmlExportContent.traffic.push(row);
            }
        } else {
            console.log('数据获取失败:'+storeID);
        }
    } else {
        console.log('数据获取失败:'+storeID+",code:"+code);
    }
    showProgress(EXCEL_TYPE_STORE_DETAIL, step, total);
}
function getStoreName(storeName, storeID){
    if (storeID > 0){
        return (storeName+"("+storeID+")");
    } else {
        return storeName;
    }
}
function onStoreTrafficSourceSuccess(step, total, text, storeID, storeName){
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_DETAIL, step, total);
        return;
    }
    var code = node.code
    //console.log('onSuccess, code:'+code);
    if (code != 0) {
        console.log('流量来源数据获取失败#1:'+storeID);
        showProgress(EXCEL_TYPE_STORE_DETAIL, step, total);
        return;
    }
    var data = node.data;
    if(data == null) {
        console.log('流量来源数据获取失败#2:'+storeID+",step:"+step);
        showProgress(EXCEL_TYPE_STORE_DETAIL, step, total);
        return;
    }
    var detail = data.detail;
    if (detail == null) {
        console.log('流量来源数据获取失败#3:'+storeID);
        showProgress(EXCEL_TYPE_STORE_DETAIL, step, total);
        return;
    }
    var storeTrafficSourceRows = ['未知', '曝光来源', 0, 0, 0, 0, 0, 0, 0];
    var storeNameWithId = getStoreName(storeName, storeID);
    storeTrafficSourceRows[0] = storeNameWithId;
    var storeTrafficSourceRowsRing = storeTrafficSourceRows.slice();
    storeTrafficSourceRowsRing[1] = '曝光来源前7日';
    var storeTrafficSourceRowsRingRate = storeTrafficSourceRows.slice();
    storeTrafficSourceRowsRingRate[1] = '曝光来源环比';
    var storeTrafficSourceRowsPeer = storeTrafficSourceRows.slice();
    storeTrafficSourceRowsPeer[1] = '商圈'
    storeTrafficSourceRows[2] = data.current;
    storeTrafficSourceRowsRing[2] = data.ring;
    storeTrafficSourceRowsRingRate[2] = getRateString(data.ringRate);
    storeTrafficSourceRowsPeer[2] = data.peer;
    var length = detail.length;
    for(var index = 0; index < length; index++){
        var child = detail[index];
        var indexStr = child.index;
        var indexParsed = getIndexAsInt(indexStr);
        if (indexParsed>=0){
            storeTrafficSourceRows[indexParsed + 3] = child.current;
            storeTrafficSourceRowsRing[indexParsed + 3] = child.ring;
            storeTrafficSourceRowsRingRate[indexParsed + 3] = getRateString(child.ringRate);
            storeTrafficSourceRowsPeer[indexParsed + 3] = child.peer;
        }
    }
    xmlExportContent.source.push(storeTrafficSourceRows);
    xmlExportContent.source.push(storeTrafficSourceRowsPeer);
    xmlExportContent.source.push(storeTrafficSourceRowsRing);
    xmlExportContent.source.push(storeTrafficSourceRowsRingRate);
    showProgress(EXCEL_TYPE_STORE_DETAIL, step, total);
}
function getRateString(rate){
    if (!rate){
        return "";
    }
    if(rate == 'null'){
        return "";
    }
    return rate+"%";
}


function appendDateSuffix(index, val){
    if (val == null){
        return "";
    }
    if (index.indexOf('RATE')>=0){
        val = val + "%";
    }
    return val;
}

function acceptDataNode(index) {
    switch (index){
        case "FLOW_POI_EXPOSE_UV":
            return "曝光人数";
        case "FLOW_POI_EXPOSE_PV":
            return "曝光次数";
        case "FLOW_WEIGHTED_AVG_RANKING":
            return "平均排名";
        case "FLOW_HOME_PAGE_EXPOSE_RATE":
            return "入店转化率";
        case "FLOW_HOME_PAGE_UV":
            return "入店人数";
        case "FLOW_HOME_PAGE_PV":
            return "入店次数";
        case "FLOW_HOME_PAGE_DURATION":
            return "入店访问时长";
        case "FLOW_SUBMITTED_HOME_PAGE_RATE":
            return "下单转化率";
        case "FLOW_SUBMITTED_UV":
            return "下单人数";
        case "FLOW_SUBMITTED_PV":
            return "下单次数";
        case "FLOW_SUBMITTED_ACTUAL_AMT":
            return "下单金额";
        case "FLOW_PAY_UV":
            return "支付人数";
        case "FLOW_PAY_ACTUAL_AMT":
            return "支付金额";
        case "FLOW_PAY_SUBMITTED_RATE":
            return "支付转化率";
        case "poiCommentScore":
            return "商家评分";
        case "goodCommentDeliveryRate":
            return "配送满意度";
        case "packingScore":
            return "包装评分";
        case "qualityScore":
            return "质量评分";
        case "avgDeliveryDuration":
            return "平均配送时长";
        default:
            return index;
    }
}

function getTrafficIndexAsInt(index) {
    switch (index){
        case "FLOW_POI_EXPOSE_UV":
            return 0;
        case "FLOW_POI_EXPOSE_PV":
            return 1;
        case "FLOW_WEIGHTED_AVG_RANKING":
            return 2;
        case "FLOW_HOME_PAGE_EXPOSE_RATE":
            return 3;
        case "FLOW_HOME_PAGE_UV":
            return 4;
        case "FLOW_HOME_PAGE_PV":
            return 5;
        case "FLOW_HOME_PAGE_DURATION":
            return 6;
        case "FLOW_SUBMITTED_HOME_PAGE_RATE":
            return 7;
        case "FLOW_SUBMITTED_UV":
            return 8;
        case "FLOW_SUBMITTED_PV":
            return 9;
        case "FLOW_SUBMITTED_ACTUAL_AMT":
            return 10;
        case "FLOW_PAY_UV":
            return 11;
        case "FLOW_PAY_ACTUAL_AMT":
            return 12;
        case "FLOW_PAY_SUBMITTED_RATE":
            return 13;
        default:
            return -1;
    }
}
function getIndexAsInt(index){
    switch (index){
        case "FLOW_SOURCE_FROM_SEARCH":
            return 0;
        case "FLOW_SOURCE_FROM_POI_LIST":
            return 1;
        case "FLOW_SOURCE_FROM_ORDER_PAGE":
            return 2;
        case "FLOW_SOURCE_FROM_OTHER":
            return 3;
        case "FLOW_SOURCE_FROM_ACT_AREA":
            return 4;
        case "FLOW_SOURCE_FROM_SELECTED":
            return 5;
        default:
            return -1;
    }
}
function getCommentIndex(index){
    switch(index){
        case "poiCommentScore"://商家评分
            return 0;
        case "qualityScore"://质量评分
            return 1;
        case "packingScore"://包装评分
            return 2;
        case "goodCommentDeliveryRate"://配送满意度
            return 3;
        case "avgDeliveryDuration"://平均配送时长
            return 4;
        default:
            return -1;
    }
}

function getGoodsSummaryIndex(index){
    switch (index){
        case "onSale"://在售
            return 0;
        case "ableSale"://可售
            return 4;
        case "sellOutRate"://售罄率
            return 8;
        case "offShelfNum"://下架商品数
            return 12;
        case "ableSaleExposuredRate"://可售商品曝光率
            return 16;
        case "dynamicRate"://动销率
            return 20;
        default:
            return -1;
    }
}

function getPromotionSummaryIndex(index){
    switch (index){
        case "campaignSale"://活动营业总额
            return 0;
        case "campaignOrders"://活动订单量
            return 4;
        case "campaignCost"://活动成本
            return 8;
        case "poiSubsidyAmount"://商补
            return 12;
        case "platformSubsidyAmount"://平补
            return 16;
        case "campaignEffect"://活动效果
            return 20;
        default:
            return -1;
    }
}

function getPromotionSummaryCurrentField(index){
    switch (index){
        case "campaignSale"://活动营业总额
            return 'campaignSaleAmount';
        case "campaignOrders"://活动订单量
            return 'campaignOrdersNum';
        case "campaignCost"://活动成本
            return 'campaignCostAmount';
        case "poiSubsidyAmount"://商补
            return 'poiSubsidyAmount';
        case "platformSubsidyAmount"://平补
            return 'platformSubsidyAmount';
        case "campaignEffect"://活动效果
            return 'campaignEffectPercent';
        default:
            return null;
    }
}

function getPromotionSummaryRingField(index){
    switch (index){
        case "campaignSale"://活动营业总额
            return 'campaignRingRatioSaleAmount';
        case "campaignOrders"://活动订单量
            return 'campaignRingRatioOrdersNum';
        case "campaignCost"://活动成本
            return 'campaignRingRatioCostAmount';
        case "poiSubsidyAmount"://商补
            return 'ringValue';
        case "platformSubsidyAmount"://平补
            return 'ringValue';
        case "campaignEffect"://活动效果
            return 'campaignRingPercent';//暂缺
        default:
            return null;
    }
}
function getPromotionSummaryRingRateField(index){
    switch (index){
        case "campaignSale"://活动营业总额
            return 'campaignRingRatioPercent';
        case "campaignOrders"://活动订单量
            return 'campaignRingRatioPercent';
        case "campaignCost"://活动成本
            return 'campaignRingRatioPercent';
        case "poiSubsidyAmount"://商补
            return 'ringRate';
        case "platformSubsidyAmount"://平补
            return 'ringRate';
        case "campaignEffect"://活动效果
            return 'campaignRingRatioPercent';
        default:
            return null;
    }
}
function getPromotionSummaryPeerField(index){
    switch (index){
        case "campaignSale"://活动营业总额
            return 'peerComparisonValue';
        case "campaignOrders"://活动订单量
            return 'peerComparisonValue';
        case "campaignCost"://活动成本
            return 'peerComparisonValue';
        case "poiSubsidyAmount"://商补
            return 'peerValue';
        case "platformSubsidyAmount"://平补
            return 'peerValue';
        case "campaignEffect"://活动效果
            return 'peerComparisonValue';
        default:
            return null;
    }
}

function getStoreDetail(index, total, storeID, storeName){
    var URL_PREFIX = 'https://waimaieapp.meituan.com/igate/recoanalysis/flowAnalysisV4/recentDays/flowTransformation?acctId='+yhpl_acct_id+'&source=0&recentDays=7';
    var storeParmas = '&cityIds=0&wmPoiId='+storeID;
    var URL_DETAIL = URL_PREFIX + storeParmas
    GM_xmlhttpRequest({
        method: "GET",
        url: URL_DETAIL,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(res){
            console.log('getStoreDetail:'+index);
            //            console.log('getStoreDetail:'+res.status);
            if(res.status === 200){
                //  console.log('成功')
                //console.log(res);
                //              console.log('getStoreDetail:onStoreDetailSuccess');
                onStoreDetailSuccess(index, total, res.response, storeID, storeName);
            }else{
                console.log('失败')
                //console.log(res)
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}

function getStoreTrafficSource(index, total, storeID, storeName){
    var URL_PREFIX = 'https://waimaieapp.meituan.com/igate/recoanalysis/flowAnalysisV4/recentDays/flowTrafficSource?acctId='+yhpl_acct_id+'&source=0&recentDays=7';
    var storeParmas = '&cityIds=0&wmPoiId='+storeID;
    var URL_DETAIL = URL_PREFIX + storeParmas
    GM_xmlhttpRequest({
        method: "GET",
        url: URL_DETAIL,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(res){
            if(res.status === 200){
                onStoreTrafficSourceSuccess(index, total, res.response, storeID, storeName);
            }else{
                console.log(res)
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}

//segment 评价
function getComment(index, total, storeID, storeName){
    var URL_PREFIX = 'https://waimaieapp.meituan.com/igate/recoanalysis/commentAnalysis/scoreAnalysisDetail/recentDays?acctId='+yhpl_acct_id+'&cityId=0&recentDays=30&source=0';
    var storeParmas = '&wmPoiId='+storeID;
    var URL_DETAIL = URL_PREFIX + storeParmas
    GM_xmlhttpRequest({
        method: "GET",
        url: URL_DETAIL,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(res){
            if(res.status === 200){
                onCommentSuccess(index, total, res.response, storeID, storeName);
            }else{
                console.log('失败')
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}

function parseJson(text){
    var node = null;
    try {
        node = JSON.parse(text);
    } catch(e){
        console.log('parseJson error:'+e);
    }
    return node;
}

function onCommentSuccess(step, total, text, storeID, storeName){
    console.log('onCommentSuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_COMMENT, step, total);
        return;
    }
    var code = node.code
    if (code != 0){

        return;
    }
    var data = node.data;
    if (data == null){
        showProgress(EXCEL_TYPE_STORE_COMMENT, step, total);
        return;
    }
    var scoreData = data.scoreData;
    if (scoreData == null){
        showProgress(EXCEL_TYPE_STORE_COMMENT, step, total);
        return;
    }
    var length = scoreData.length;
    var storeIndex = parseInt(step / 2) * 5 + 1;//表头 + 1
    var commentCols = xmlExportContent.comment[storeIndex];
    for(var index = 0; index < length; index++){
        var child = scoreData[index];
        var indexStr = child.index;
        var indexParsed = acceptDataNode(indexStr);
        var indexInt = getCommentIndex(indexStr);
        if (indexParsed.length > 0 && indexInt >= 0){
            var current = child.currentValue;
            var ring = child.ringValue;
            if (current == null) {
                continue;
            }
            commentCols[indexInt + 1] = current;//第一列 店铺名称skip
        }
    }
    //复制到剩余的行
    for(var rowIndex = 1; rowIndex < 5; rowIndex++){
        var row = xmlExportContent.comment[storeIndex + rowIndex];
        for (var col = 0; col < 4; col++) {
            row[col + 1] = commentCols[col + 1];
        }
    }
    showProgress(EXCEL_TYPE_STORE_COMMENT, step, total);
}
function getCommentSKUList(index, total, storeID, storeName){
    var URL_PREFIX = 'https://waimaieapp.meituan.com/igate/recoanalysis/commentAnalysis/commodityRankings/recentDays?acctId='+yhpl_acct_id+'&cityId=0&recentDays=30&source=0';
    var storeParmas = '&wmPoiId='+storeID;
    var URL_DETAIL = URL_PREFIX + storeParmas
    GM_xmlhttpRequest({
        method: "GET",
        url: URL_DETAIL,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(res){
            if(res.status === 200){
                onCommentSKUListSuccess(index, total, res.response, storeID, storeName);
            }else{
                console.log('失败')
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}

function onCommentSKUListSuccess(step, total, text, storeID, storeName){
    console.log('onCommentSKUListSuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_COMMENT, step, total);
        return;
    }
    var code = node.code
    if (code == 0){
        var data = node.data;
        var bad = data.bad;
        var good = data.good;
        if (bad != null || good != null) {
            var storeIndex = parseInt(step / 2) * 5 + 1;
            // var commentCols = xmlExportContent.comment[storeIndex + 1];//表头 + 1
            var offset = 6;
            for(var index = 0; index < 5; index++){
                var commentCols = xmlExportContent.comment[storeIndex + index];
                commentCols[offset] = index + 1;
                appendSKU(commentCols, offset, good[index], true);
                appendSKU(commentCols, offset + 4, bad[index], false);
            }
        } else {
            console.log('数据获取失败:'+storeID);
        }
    } else {
        console.log('数据获取失败:'+storeID+",code:"+code);
    }
    showProgress(EXCEL_TYPE_STORE_COMMENT, step, total);
}
function appendSKU(row, offset, sku, goodOrBad){
    if (!sku){
        return;
    }
    row[offset + 1] = sku.productName;
    row[offset + 2] = goodOrBad ? sku.upCount : sku.downCount;
    row[offset + 3] = sku.salesCount;
    row[offset + 4] = sku.picUrl;
}
//endsegment 评价

//segment 搜索热词
function getSearchWord(step, total, storeID, storeName, allZoneOrMyZone, seventDaysOrYesterday){
    var searchType = seventDaysOrYesterday ? "searchWordRankHot" : "searchWordRankGrow";
    var peerType = allZoneOrMyZone ? 0 : 1;
    var colOffset = seventDaysOrYesterday ? 0 : 4;
    var url = 'https://waimaieapp.meituan.com/igate/recoanalysis/flowAnalysis/searchword/searchWordRank';
    var data = 'acctId='+yhpl_acct_id+'&peerType='+peerType+'&recentDays=7&searchWordType='+searchType+'&source=0&wmPoiId='+storeID;
    GM_xmlhttpRequest({
        method: "POST",
        url: url,
        data: data,
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(res){
            if(res.status === 200){
                onSearchWordSuccess(step, total, res.response, storeID, storeName, allZoneOrMyZone, colOffset);
            }else{
                console.log('失败')
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}
function onSearchWordSuccess(step, total, text, storeID, storeName, allZone, colOffset){
    console.log('onSearchWordSuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_SEARCH_WORD_ZONE, step, total);
        return;
    }
    var code = node.code
    if (code != 0){
        showProgress(EXCEL_TYPE_STORE_SEARCH_WORD_ZONE, step, total);
        return
    }
    var data = node.data;
    if(!data){
        showProgress(EXCEL_TYPE_STORE_SEARCH_WORD_ZONE, step, total);
        return
    }
    var length = data.length;
    length = Math.min(length, SEARCH_WORD_ROW);
    var rowOffset = parseInt(step / SEARCH_WORD_ZONE_API_COUNT) * SEARCH_WORD_ROW + 1;
    for(var index = 0; index < length; index++){
        var commentCols = allZone ? xmlExportContent.searchAllZone[rowOffset + index] : xmlExportContent.searchMyZone[rowOffset + index];
        commentCols[1 + colOffset + 1] = data[index].searchWord;//搜索热词
        var count = data[index].searchCnt;//搜索次数
        var searchCntBefore = data[index].searchCntBefore;//环比
        var diffCnt = data[index].diffCnt;//环比
        commentCols[1 + colOffset + 2] = count;
        if (colOffset == 0){
            commentCols[1 + colOffset] = index + 1;
            commentCols[1 + colOffset + 3] = count - data[index].diffCnt;
        } else{
            commentCols[1 + colOffset + 3] = searchCntBefore;
        }
        commentCols[1 + colOffset + 4] = data[index].amplitude;//比例
    }
    showProgress(EXCEL_TYPE_STORE_SEARCH_WORD_ZONE, step, total);
}
function getStoreSearchWord(step, total, storeID, storeName, randField){
    var d = new Date();
    var now = d.getTime();
    d.setTime(now - 1000*60*60*24 * 7);
    var beginTime = getDateString(d);
    d.setTime(now - 1000*60*60*24 * 1)
    var endTime = getDateString(d);
    var url = 'https://waimaieapp.meituan.com/igate/recoanalysis/flowAnalysis/searchword/ranking?type='+randField
    url = url + '&acctId='+yhpl_acct_id+'&beginTime='+beginTime+'&endTime='+endTime+'&recentDays=7&source=0&topCount=30&wmPoiId='+storeID;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(res){
            if(res.status === 200){
                onStoreSearchWordSuccess(step, total, res.response, storeID, storeName, randField);
            }else{
                console.log('失败')
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}
function onStoreSearchWordSuccess(step, total, text, storeID, storeName, randField){
    console.log('onStoreSearchWordSuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_SEARCH_WORD_STORE, step, total);
        return;
    }
    var code = node.code
    if (code != 0){
        showProgress(EXCEL_TYPE_STORE_SEARCH_WORD_STORE, step, total);
        return
    }
    var data = node.data;
    if(!data){
        showProgress(EXCEL_TYPE_STORE_SEARCH_WORD_STORE, step, total);
        return
    }
    var table = null;
    switch(randField){
        case 1://曝光次数排行
            table = xmlExportContent.searchMyStoreExpose;
            break;
        case 2://点击次数排行
            table = xmlExportContent.searchMyStoreClick;
            break;
        case 3://成单量排行
            table = xmlExportContent.searchMyStoreOrder;
            break;
        default:
            break;
    }

    var length = data.length;
    length = Math.min(length, SEARCH_WORD_ROW);
    var rowOffset = parseInt(step / SEARCH_WORD_STORE_API_COUNT) * SEARCH_WORD_ROW + 1;
    // console.log('step:'+step+',rowOffset:'+rowOffset)
    for(var index = 0; index < length; index++){
        var cols = table[rowOffset + index];
        //cols[0] = getStoreName(storeName, storeID);
        cols[1] = index + 1;
        cols[2] = data[index].searchWord;//搜索热词
        cols[3] = data[index].orderCnt;//单量
        cols[4] = data[index].clickCnt;//点击次数
        cols[5] = data[index].exposureCnt;//曝光
    }
    showProgress(EXCEL_TYPE_STORE_SEARCH_WORD_STORE, step, total);
}
//endsegment 搜索热词
//segment 营销分析
function getDateString(d){
    var beginTime = []
    var month = d.getMonth() + 1;
    var day = d.getDate()
    beginTime[0] = d.getFullYear();
    beginTime[1] = month < 10 ? '0' + month : month;
    beginTime[2] = day < 10 ? '0' + day : day;
    return beginTime.join('');
}
function getFieldString(field){
    return field ? field:'';
}
function getPromotionSummary(step, total, storeID, storeName){
    var d = new Date();
    var now = d.getTime();
    d.setTime(now - 1000*60*60*24 * 7);
    var beginTime = getDateString(d);
    d.setTime(now - 1000*60*60*24 * 1)
    var endTime = getDateString(d);
    var url = 'https://waimaieapp.meituan.com/igate/recoanalysis/marketingAnalysis/single/recentDays?acctId='+yhpl_acct_id+'&beginTime='+beginTime+'&cityId=0&endTime='+endTime;
    url = url + '&recentDays=7&source=0&wmPoiId='+storeID;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(res){
            if(res.status === 200){
                onPromotionSumamrySuccess(step, total, res.response, storeID, storeName);
            }else{
                console.log('失败')
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}
function onPromotionSumamrySuccess(step, total, text, storeID, storeName){
    console.log('onPromotionSumamrySuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
        return;
    }
    var code = node.code
    if (code != 0){
        showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
        return
    }
    var data = node.data;
    if(!data){
        showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
        return
    }
    var details = data.flow;
    if(!details){
        var rowHolder =[];
        rowHolder[0] = getStoreName(storeName, storeID);
        xmlExportContent.promotionSummary.push(rowHolder);
        showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
        return
    }
    var row =[];
    row[0] = getStoreName(storeName, storeID);
    var length = details.length;
    for(var index = 0; index < length; index++){
        var detail = details[index];
        var indexName = detail.index;
        var colOffset = getPromotionSummaryIndex(indexName);

        var currentField = getPromotionSummaryCurrentField(indexName);
        var ringField = getPromotionSummaryRingField(indexName);
        var ringRateField = getPromotionSummaryRingRateField(indexName);
        var peerField = getPromotionSummaryPeerField(indexName);
        if (colOffset < 0 || !currentField){
            continue;
        }
        var current = getFieldString(detail[currentField]);
        if (!current){
            continue;
        }
        var ring = getFieldString(detail[ringField]);
        row[colOffset + 1] = current;
        switch(colOffset){
            case 20://投入产出比
                row[colOffset + 2]= '暂缺';
                break;
            case 8://活动成本
            case 12://商家补贴金额
            case 16://平台补贴金额
                row[colOffset + 2] = current - ring;
                break;
            default:
                row[colOffset + 2] = current + ring;
                break;
        }
        row[colOffset + 3] = getFieldString(detail[ringRateField]) + '%';
        row[colOffset + 4] = getFieldString(detail[peerField]);

    }
    xmlExportContent.promotionSummary.push(row);

    showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
}
function getPromotionDetail(step, total, storeID, storeName){
    var d = new Date();
    var now = d.getTime();
    d.setTime(now - 1000*60*60*24 * 7);
    var beginTime = getDateString(d);
    d.setTime(now - 1000*60*60*24 * 1)
    var endTime = getDateString(d);
    var url = 'https://waimaieapp.meituan.com/igate/recoanalysis/marketingAnalysis/single/recentDays/campaign?acctId='+yhpl_acct_id+'&beginTime='+beginTime+'&cityId=0&endTime='+endTime;
    url = url + '&recentDays=7&source=0&wmPoiId='+storeID;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(res){
            if(res.status === 200){
                onPromotionDetailSuccess(step, total, res.response, storeID, storeName);
            }else{
                console.log('失败')
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}
function onPromotionDetailSuccess(step, total, text, storeID, storeName){
    console.log('onPromotionDetailSuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
        return;
    }
    var code = node.code
    if (code != 0){
        showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
        return
    }
    var data = node.data;
    if(!data){
        showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
        return
    }
    var details = data.campaignDetails;
    if(!details){
        var rowHolder =[];
        rowHolder[0] = getStoreName(storeName, storeID);
        xmlExportContent.promotionDetail.push(rowHolder);
        showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
        return
    }
    var length = details.length;
    for(var index = 0; index < length; index++){
        var row =[];
        var detail = details[index];
        row[0] = getStoreName(storeName, storeID);
        row[1] = detail.campaignTypeName;
        row[2] = detail.campaignSaleAmount;
        row[3] = detail.campaignOrdersNum;
        row[4] = detail.campaignCostAmount;
        row[5] = detail.poiSubsidyAmount;
        row[6] = detail.platformSubsidyAmount;
        row[7] = detail.campaignEffectPercent+'%';
        xmlExportContent.promotionDetail.push(row);
    }
    showProgress(EXCEL_TYPE_STORE_PROMOTION, step, total);
}
//endsegment 营销分析
//segment 商品分析

function getGoodsSummary(step, total, storeID, storeName){
    var d = new Date();
    var now = d.getTime();
    d.setTime(now - 1000*60*60*24 * 7);
    var beginTime = getDateString(d);
    d.setTime(now - 1000*60*60*24 * 1)
    var endTime = getDateString(d);
    var url = 'https://waimaieapp.meituan.com/igate/recoanalysis/commodityAnalysisV4/single/recentDays/summary?acctId='+yhpl_acct_id+'&beginTime='+beginTime+'&cityId=0&endTime='+endTime;
    url = url + '&recentDays=7&source=0&wmPoiId='+storeID;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(res){
            if(res.status === 200){
                onGoodsSummarySuccess(step, total, res.response, storeID, storeName);
            }else{
                console.log('失败')
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}
function onGoodsSummarySuccess(step, total, text, storeID, storeName){
    console.log('onGoodsSummarySuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
        return;
    }
    var code = node.code
    if (code != 0){
        showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
        return
    }
    var data = node.data;
    if(!data){
        showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
        return
    }
    var row =[];
    row[0] = getStoreName(storeName, storeID);
    var length = data.length;
    for(var index = 0; index < length; index++){
        var detail = data[index];
        var colOffset = getGoodsSummaryIndex(detail.index);
        if (colOffset < 0){
            continue;
        }
        row[colOffset + 1] = detail.current;
        row[colOffset + 2] = detail.ring;
        row[colOffset + 3] = detail.ringRate + '%';
        row[colOffset + 4] = detail.peer;

    }
    xmlExportContent.goodsSummary.push(row);
    showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
}


function getGoodsHotSale(step, total, storeID, storeName, randField){
    var d = new Date();
    var now = d.getTime();
    d.setTime(now - 1000*60*60*24 * 7);
    var beginTime = getDateString(d);
    d.setTime(now - 1000*60*60*24 * 1)
    var endTime = getDateString(d);
    var url = 'https://waimaieapp.meituan.com/igate/recoanalysis/commodityAnalysis/single/recentDays/peerTops?acctId='+yhpl_acct_id+'&cityId=0&pageNum=1&pageSize=20&rankField='+randField
    url = url + '&rankType=1&recentDays=7&source=0&wmPoiId='+storeID;
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        data: '',
        headers:  {
            "Referer": "https://waimaieapp.meituan.com/igate/",
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function(res){
            if(res.status === 200){
                onGoodsHotSaleSuccess(step, total, res.response, storeID, storeName, randField);
            }else{
                console.log('失败')
            }
        },
        onerror : function(err){
            console.log('error')
            console.log(err)
        }
    });
}
function onGoodsHotSaleSuccess(step, total, text, storeID, storeName, randField){
    console.log('onGoodsHotSaleSuccess:'+step);
    var node = parseJson(text);
    if (!node){
        showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
        return;
    }
    var code = node.code
    if (code != 0){
        showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
        return
    }
    var data = node.data;
    if(!data){
        showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
        return
    }
    var table = null;
    switch(randField){
        case 'productOriginalAmt'://销售额
            table = xmlExportContent.goodsSaleAmt;
            break;
        case 'productCnt'://销量最高
            table = xmlExportContent.goodsSaleCnt;
            break;
        case 'isNew'://热销新品
            table = xmlExportContent.goodsSaleNew;
            break;
        default:
            break;
    }
    var currentPageData = data.currentPageData;
    if (!currentPageData){
        var rowHolder =[];
        rowHolder[0] = getStoreName(storeName, storeID);
        table.push(rowHolder);
        showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
        return
    }

    var length = currentPageData.length;
    for(var index = 0; index < length; index++){
        var detail = currentPageData[index];
        var row =[];
        row[0] = getStoreName(storeName, storeID);
        row[1] = detail.productName;//名称
        row[2] = detail.upcCode;//商品条形码
        row[3] = detail.productOriginalAmt;//原价销售额
        row[4] = detail.productActualAmt;//实际销售额
        row[5] = detail.productCnt;//销量
        row[6] = detail.upRate + '%';//好评度
        table.push(row);
    }

    showProgress(EXCEL_TYPE_STORE_GOODS, step, total);
}
//endsegment 商品分析

function showProgress(type, step, total){
    yhplHTTPCount = yhplHTTPCount + 1;
    console.log('type:'+type+',total:'+yhplHTTPCount+", index:"+step);
    var id = getButtonIdByType(type);
    console.log('#### : '+id);
    var button = document.getElementById(id);
    //var button = $("#yhplExport")[0];
    button.innerText = "导出进度:"+yhplHTTPCount + "/ "+total;
    //    console.log(xmlExportContent);
    if (yhplHTTPCount >= total){
        button.innerText = "下载Excel";
        exportAsXLS(type, xmlExportContent);
    }
}

//segment excel
function exportAsXLS(type, table){
    switch (type){
        case EXCEL_TYPE_STORE_DETAIL:{
            var sheet = XLSX.utils.aoa_to_sheet(table.traffic);
            var source = XLSX.utils.aoa_to_sheet(table.source);
            openDownloadDialog(sheet2blob([{sheet: sheet,name:'流量分析'},{sheet: source,name:'流量来源'}]), '流量分析.xlsx');
            break;
        }
        case EXCEL_TYPE_STORE_COMMENT:{
            var comment = XLSX.utils.aoa_to_sheet(table.comment);
            // var source = XLSX.utils.aoa_to_sheet(table.source);
            //     openDownloadDialog(sheet2blob([{sheet: sheet,name:'评价分析'},{sheet: source,name:'流量来源'}]),excelName);
            openDownloadDialog(sheet2blob([{sheet: comment,name:'评价分析'}]), '评价分析.xlsx');
            break;
        }
        case EXCEL_TYPE_STORE_SEARCH_WORD_ZONE:{
            openDownloadDialog(sheet2blob([{sheet: XLSX.utils.aoa_to_sheet(table.searchAllZone),name:'全部商圈'},
                                           {sheet: XLSX.utils.aoa_to_sheet(table.searchMyZone),name:'我的商圈'}]), '商圈热词分析.xlsx');
            break;
        }
        case EXCEL_TYPE_STORE_SEARCH_WORD_STORE:{
            openDownloadDialog(sheet2blob([{sheet: XLSX.utils.aoa_to_sheet(table.searchMyStoreExpose),name:'曝光次数排行'},
                                           {sheet: XLSX.utils.aoa_to_sheet(table.searchMyStoreClick),name:'点击次数排行'},
                                           {sheet: XLSX.utils.aoa_to_sheet(table.searchMyStoreOrder),name:'成单量排行'}]), '店铺热词分析.xlsx');
            break;
        }
        case EXCEL_TYPE_STORE_PROMOTION:{
            openDownloadDialog(sheet2blob([{sheet: XLSX.utils.aoa_to_sheet(table.promotionSummary), name:'营销活动总览'},
                                           {sheet: XLSX.utils.aoa_to_sheet(table.promotionDetail), name:'营销活动'},]), '营销分析.xlsx');
            break;
        }
        case EXCEL_TYPE_STORE_GOODS:{
            openDownloadDialog(sheet2blob([{sheet: XLSX.utils.aoa_to_sheet(table.goodsSummary), name:'商品概览'},
                                           {sheet: XLSX.utils.aoa_to_sheet(table.goodsSaleAmt), name:'销售额TOP10'},
                                           {sheet: XLSX.utils.aoa_to_sheet(table.goodsSaleCnt), name:'销量TOP10'},
                                           {sheet: XLSX.utils.aoa_to_sheet(table.goodsSaleNew), name:'热销新品TOP10'}]), '商品分析.xlsx');
            break;
        }
    }

}
function sheet2blob(sheets) {
    var sheetsSize = sheets.length;
    var SheetNames = [];
    var Sheets = {};
    for (var index = 0; index<sheets.length; index++){
        var child = sheets[index];
        var sheetName = child.name || 'sheet'+(index+1);
        SheetNames.push(sheetName);
        var sheet = child.sheet;
        Sheets[sheetName] = sheet;
    }

    var workbook = {
        SheetNames: SheetNames,
        //Sheets: {}
        Sheets: Sheets
    };
    //workbook.Sheets[sheetName] = sheet; // 生成excel的配置项

    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }); // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}
function openDownloadDialog(url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) event = new MouseEvent('click');
    else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}
//eng segment excel
