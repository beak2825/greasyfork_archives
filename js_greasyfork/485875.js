// ==UserScript==
// @name         ERP订单快递号更新[外网通用版]
// @namespace    https://www.erp321.com/
// @version      3.2
// @description  JST ERP订单快递号更新
// @author       TC 技术部
// @include      /^https://w{1,3}.erp321.com/app/wms/express/expresssetter.aspx
// @grant        unsafeWindow
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      https://code.jquery.com/jquery-1.8.1.min.js
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/layer/3.5.1/layer.min.js
// @resource layercss https://cdn.staticfile.net/layer/3.5.1/theme/default/layer.min.css
// @connect      120.224.67.142
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485875/ERP%E8%AE%A2%E5%8D%95%E5%BF%AB%E9%80%92%E5%8F%B7%E6%9B%B4%E6%96%B0%5B%E5%A4%96%E7%BD%91%E9%80%9A%E7%94%A8%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/485875/ERP%E8%AE%A2%E5%8D%95%E5%BF%AB%E9%80%92%E5%8F%B7%E6%9B%B4%E6%96%B0%5B%E5%A4%96%E7%BD%91%E9%80%9A%E7%94%A8%E7%89%88%5D.meta.js
// ==/UserScript==

/*******************更新记录begin*******************
【2024.09.05】 更新 v3.2
新增可选多个更新地址
【2024.08.30】 更新 v3.1
修改快递号识别由正则识别改为快递号列识别
【2024.04.23】 更新 v3.0
修复分仓账户获取内部订单号错误
【2024.04.09】 更新 v2.9
传入参数新加 商品信息 接口换到post_erp_up_20240413
【2024.03.21】 更新 v2.8
layui引用地址失败，导致的点击按钮layui弹窗没反应
重新修改 layui 引用地址
 【2024.01.28】 更新 v2.6
 新增 更新订单进度显示，更新失败可以单条更新
 【2024.01.10】 更新 v2.5
 修改 页面元素变化导致的数据获取异常（行号 170~175）
 【2023.07.07】 更新 v2.2+2.3
 新增 用户名和用户ID 获取，
 修改 更新接口链接，链接加入参数用户名和用户ID
 修改 显示版本号，和返回的message和响应错误
 【2023.06.26】 更新 v2.1
 修改 快递号识别正则 （代码152行）
 【2023.05.17】 更新 v2.0
  修正：1>取消使用内网更新
        2>添加 appId 匹配校验
        3>添加"重新加载"功能
【2023.05.11】 更新 v1.8
 修正：1> 实时识别当前订单信息
       2> 对快递号进行识别校验
 【2023.05.10】 更新 v1.7
 修正：动态获取电子面单。
  2023.05.10】 更新 v1.6
 修正：更改请求，识别订单信息不更新问题。
 【2022.2.14】 更新 v1.5
 修正：列错误了，订单和快递号往后移动一列。
  【2022.8.17】 更新 v1.4
 修正：只能获取第一页面数据，无法获取其他线路的订单和快递号。
  【2022.7.26】 更新 v1.3
 修正：昨天刚更换版本，使用者反馈丢失订单，经检查发现erp页面订单列表是随着浏览器变化的。
 【2022.7.25】 更新 v1.2
 修正：昨天还正常，第二天显示订单数据获取失败，原来是erp页面更新了。
 【2022.7.13】 更新 v1.1
 更新：创建版本的按钮不明显，按钮更新醒目的红色
 【2022.7.01】 创建 v1.0
 ********************更新记录end********************/

var appId;
var userID;
var userName;
window.onload = function() {
    appId = document.querySelector("#authorize_co_id").getAttribute("value");
    //var userInfos = window.parent.document.querySelector("body > script:nth-child(10)");
    //20230707 用户名用户ID 获取
    var scriptnodes =window.parent.document.querySelectorAll("body > script");
    //console.log(scriptnodes);
    if(scriptnodes != null){
        for (var n = 0; n < scriptnodes.length; n++){
            if(scriptnodes[n].innerText.indexOf('客户信息 客服系统专用')!=-1){
                var dataInnerText=scriptnodes[n].innerText;
                var uiArr =dataInnerText.split('\n');
                if (uiArr.length > 13){
                    var userData = uiArr[13];
                    var userJsonData = JSON.parse(userData.substring(userData.indexOf('{'), userData.lastIndexOf('}') + 1));
                    userName= userJsonData.userName;
                    userID = userJsonData.userID
                    if (appId == undefined) {
                        appId = userJsonData.companyID;
                    }
                }else{
                    alert("未获取到ERP用户，请刷新");
                }
            }
        }
    }else{
        alert("未获取到ERP用户，请刷新");
    }
    addButtonByCheckResult();
}

//添加按钮
async function addButtonByCheckResult() {
    GM_notification({
        timeout: 5000,
        text: '请等待页面加载完成后，再获取订单号和快递号！'
    });
    //页面加载完成后 再页面上添加 按钮元素【获取订单号和快递号】
    var mainNode = document.querySelector('#form2>div.full.padding_left_bar>table>tbody>tr>td:nth-child(2)>div>div.top_toolbar>ul');
    var lvdanButtonHtml3 ="<button id='GetOrderAndExpressButton' class='btn_2' type='button' style='order:-1; outline:none;margin:2px 0px 0px 2px;padding-left:4px;padding-right:6px;background-color: #19BCFA;'>【"+userName+"】同步到内部系统"+GM_info.script.version+"</button>";
    $(mainNode).append(lvdanButtonHtml3);
    $(mainNode).on("click", "#GetOrderAndExpressButton", function() {
        GetOrderAndExpressNumMethod();
    })
    document.querySelector("#_jt_reload").click();
}
//获取订单号快递号
var dataHtml;
function GetOrderAndExpressNumMethod() {
    if (dataHtml == undefined){
        dataHtml = initTableData();
        if(dataHtml == undefined)
        {
            layer.open({
                content: '订单数据获取失败！'
            });
        }else{
            commonShow();
        }
    }else{
        commonShow();
    }
    //监听事件
    $(document).on("click", ".reUp", function () {
        //console.log(this);
        common_reUp(this);
    });
    if(!address)
    {
        address=$("input[name='rd_address']:checked").val();
    }
    $("input[type='radio'][name='rd_address']").change(function() {
        address= $(this).val();
    });
}
function commonShow(){
    layer.open({
        type: 1,
        title: '同步快递号到内部系统 v' + GM_info.script.version + ' - by：TC技术部',
        area: ['1000px', '520px'],
        id: 'OpOrders',
        shade: [0.5, '#FFF'],
        content: dataHtml,
        success: function(index, layero) {
            $("#buttonDiv").on("click", '#btnOpOrder', function() {
                //console.log("000");
                OpOrderDataResult();
            });
        },
        cancel: function (index, layero) {
            if(document.querySelector("#OpOrders")!=null){
                dataHtml=document.querySelector("#OpOrders").innerHTML;
            }
            layer.close(index);
        }
    });
}
var OrderData;
//数据集合
//var list;
//表格数据初始化
function initTableData() {
    OrderData = [];
    //console.log(document.querySelector("#_jt_body_list > div > div.rowsSite > div.rowList").childElementCount);
    //var nodes = document.querySelector('#_jt_body_list > div > div.rowsSite > div.rowList').childNodes;
    var nodesEle = document.querySelector('#_jt_body_list > div > div.rowsSite > div.rowList');
    if(nodesEle==null){
        nodesEle=document.querySelector("#_jt_body_list");
    }
    var nodes=nodesEle.childNodes;
    var expressNumColEle=document.querySelector("#_jt_row_head_list > div:nth-child(9)");
    if(expressNumColEle)
    {
        if(expressNumColEle.innerText.indexOf("快递单号")!=-1)
        {
            for (var n = 0; n < nodes.length; n++) {
                var id = nodes[n].querySelector("div:nth-child(1)").innerText;
                var expressNum = nodes[n].querySelector("div:nth-child(9)").innerText;
                var skus= nodes[n].querySelector("div:nth-child(13)").innerText;
                var innerOrderNum = nodes[n].querySelector("div:nth-child(4)").innerText;
                if(nodes[n].querySelector("div:nth-child(4)").style.display=="none")
                {
                    innerOrderNum= nodes[n].querySelector("div:nth-child(3)").innerText;
                }
                //#_jt_body_list > div > div.rowsSite > div.rowList > div:nth-child(3) > div._jt_cell._jt_ch.btn.cell_o_id
                var onlineOrder = nodes[n].querySelector("div:nth-child(5)").innerText;
                var order = new Object();
                order.id = id;
                order.inOrderNum = innerOrderNum;
                order.orderNum = onlineOrder;
                order.expressNum = expressNum;
                order.skus = skus;
                OrderData.push(order);
                // console.log("编号："+id+'，订单号：'+onlineOrder+"，快递号："+expressNum);
            }
        }
    }

    var html;
    if (OrderData.length > 0) {
        html ="<div id='buttonDiv'><button id='btnOpOrder' type='button' class='btn_2' style='outline:none;margin:2px 12px 2px 0px;background-color: #19BCFA;'>【"+userName+"】点击更新单号到内部系统</button>"+
            "<input type='radio' name='rd_address' style='margin:2px 3px 2px 2px' value='http://120.224.67.142:888/www8/api/post_erp_up_20240413.php' id='rd_address1' checked>"+
            "<label for='rd_address1' style='cursor:pointer;font-size: 14px;font-weight:bold;'>接口1</label>"+
            "<input type='radio' name='rd_address' style='margin:2px 3px 2px 10px' value='http://36.mychaces.cc:8088/post_erp_up_20240413.php' id='rd_address2'>"+
            "<label for='rd_address2' style='cursor:pointer;font-size: 14px;font-weight:bold;'>接口2</label>"+
            "<div style='float:right;margin: 6px;color:red;font-weight:bold;'>Tips：建议订单数量控制在100条以内</div></div>"+
            "<div class='layui-form'><table id='datatable' class='pure-table'><thead><tr><th width='80px'>序号</th><th width='130px'>内部订单号</th><th width='160px'>订单号</th><th width='160px'>快递号</th><th width='250px'>更新状态</th></tr></thead><tbody>";
        for (var i = 0; i < OrderData.length; i++) {
            html += '<tr><td class="one">' + (i + 1) + '</td><td class="two">' + OrderData[i].inOrderNum +
                '</td><td class="three">' + OrderData[i].orderNum + '</td><td class="four">' + OrderData[i].expressNum +
                '<span style="display:none">'+OrderData[i].skus+'</span></td><td class="five"></td></tr>';
        }
        html +="</tbody></table></div><div style='padding:8px;font-size:12px'>共计 " + OrderData.length + " 条订单</div>";
    }
    return html;
}

//正式使用 url
var address;
var url;
async function OpOrderDataResult() {
    var url;
    var resultHtml;
    for (var i = 0; i < OrderData.length; i++) {
        document.querySelector("#datatable > tbody > tr:nth-child("+(i+1)+") > td.five").innerHTML ="";
    }
    for (var o = 0; o < OrderData.length; o++) {
        //正式使用 url
        //url = 'http://120.224.67.142:888/www8/api/post_erp_up_20240413.php?appid=' + appId +'&appkey=112233445566&userName='+userName+'&userID='+userID;
        url= address+'?appid=' + appId +'&appkey=112233445566&userName='+userName+'&userID='+userID;
        await request_order(url, OrderData[o].inOrderNum, OrderData[o].orderNum, OrderData[o].expressNum,OrderData[o].skus).then((res)=>{
            if(res.message!=undefined){
                if(res.message.indexOf('成功')!=-1){
                    resultHtml="<span style='color:green;font-weight:bold'>"+res.message+"</span>";
                }else{
                    resultHtml="<span style='color:red;font-weight:bold'>"+res.message+"</span>&nbsp;&nbsp;&nbsp;<a style='cursor:pointer' class='reUp'>重试</a>";
                }
                document.querySelector("#datatable > tbody > tr:nth-child("+(o+1)+") > td.five").innerHTML =resultHtml;
                if(document.querySelector("#OpOrders")!=null){
                    dataHtml=document.querySelector("#OpOrders").innerHTML;
                }
            }
        })
    }
}

function common_reUp(current){
    if(current.parentNode!=null){
        var currentNode=current.parentNode.parentNode;
        var html;
        var o_id=currentNode.querySelector("td.two").textContent;
        var so_id=currentNode.querySelector("td.three").textContent;
        var l_id=currentNode.querySelector("td.four").childNodes[0].textContent;
        var skus=currentNode.querySelector("td.four").childNodes[1].textContent;
        //正式 20240413
        //url = 'http://120.224.67.142:888/www8/api/post_erp_up_20240413.php?appid=' + appId +'&appkey=112233445566&userName='+userName+'&userID='+userID;
        url = address+'?appid=' + appId +'&appkey=112233445566&userName='+userName+'&userID='+userID;
        currentNode.querySelector("td.five").innerHTML="";
        request_order(url, o_id, so_id,l_id,skus).then((res)=>{
            if(res.message!=undefined){
                if(res.message.indexOf('成功')!=-1){
                    html="<span style='color:green;font-weight:bold'>"+res.message+"</span>";
                }else{
                    html="<span style='color:red;font-weight:bold'>"+res.message+"</span>&nbsp;&nbsp;&nbsp;<a style='cursor:pointer' class='reUp'>重试</a>";
                }
                currentNode.querySelector("td.five").innerHTML=html;
                if(document.querySelector("#OpOrders")!=null){
                    dataHtml=document.querySelector("#OpOrders").innerHTML;
                }
            }
        });
    }
}


//订单数据处理
function request_order(url, oid, soid, lid,skus){
    return new Promise((res) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: 'o_id=' + oid + '&dingdan=' + soid + '&kuaidihao=' + lid+'&skus='+skus,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload:(r)=>{
                // console.log(JSON.parse(r.response));
                res(JSON.parse(r.response));
            }
        });
    })
}

addXMLRequestCallback(function(xhr) {
    xhr.addEventListener("load", function() {
        //console.log(xhr.responseURL);
        if (xhr.responseURL.indexOf('LoadDataToJSON') != -1) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                document.querySelector("#_jt_body").style.height = "13100px";
                document.querySelector("#_jt_row_foot").style.width = '88%';
                document.querySelector("#_jt_row_foot").style.position = 'fixed';
                dataHtml=undefined;
            }
        }
    });
});

function addXMLRequestCallback(callback) {
    var oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            oldSend.apply(this, arguments);
        }
    }
}

GM_addStyle(GM_getResourceText("layercss"));
GM_addStyle(`
    .layui-layer-loading .layui-layer-loading1 {
       background: url(https://www.layuicdn.com/layui/css/modules/layer/default/loading-1.gif) no-repeat;
    }
    .layui-layer-ico{
       background: url(https://www.layuicdn.com/layer/theme/default/icon.png) no-repeat;
    }
    #GetOrderAndExpressButton:active {
      transform: translateY(1px);
    }
    #btnOpOrder:active {
      transform: translateY(1px);
    }
    #datatable {
	   border-collapse: collapse; /* IE7 and lower */
	   border-spacing: 0;
	   -webkit-box-shadow: 0 1px 1px #ccc;
       -moz-box-shadow: 0 1px 1px #ccc;
       box-shadow: 0 1px 1px #ccc;
    }

    #datatable tr:hover {
       background: #fbf8e9;
       -o-transition: all 0.1s ease-in-out;
       -webkit-transition: all 0.1s ease-in-out;
       -moz-transition: all 0.1s ease-in-out;
       -ms-transition: all 0.1s ease-in-out;
       transition: all 0.1s ease-in-out;
    }
    #datatable td, #datatable th {
    border-left: 1px dotted #ccc;
    border-bottom: 1px dotted #ccc;
    padding: 10px;
    text-align:center;
    }
    #datatable th {
        background-color: #FAFAFA;
    	border-top: 1px solid #DDD;
    }
    #datatable td:first-child, #datatable th:first-child {
        border-left: none;
    }
    #datatable {
        width: 100%;
        font-family: '微软雅黑';
        font-size: 14px;
        color: #444;
    }
    span.span_result{
        font-family: '微软雅黑';
        font-size: 14px;
        color: #444;
    }
    #datatable td.one{
	    width: 104px;
    }
    #datatable td.two{
	  width: 166px;
    }
    #datatable td.three{
	  width:205px
    }
    #datatable td.four{
	   width:205px
    }
    #datatable tbody {
        height:370px;
        display: block;
    	overflow-y: scroll;
    }
     #datatable thead,
     #datatable tbody tr {
         display: table;
         width: 100%;
         table-layout: fixed; /**表格列的宽度由表格宽度决定，不由内容决定*/
         text-align: center;
     }
     span.span_result{
       margin:8px 0px 0px 8px;
     }
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar{
        width: 8px;
        height: 16px;
        background-color: #F5F5F5;
    }
    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track{
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
        border-radius: 6px;
        background-color: #F5F5F5;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb{
        border-radius: 6px;
        -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
        background-color: #BABABA;
    }
    `);