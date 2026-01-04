// ==UserScript==
// @name         退款管理列表导出
// @namespace    https://gywl.com/RefundOrdersExport
// @version      1.0.1
// @description  “退款管理列表导出”。导出的项目包括订单编号、退款编号、申请时间、店铺名称、商品名称、退款金额、退款状态、服务类型，导出的数据为excel文件。
// @author       liuyj
// @match        https://refund2.taobao.com/dispute/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495920/%E9%80%80%E6%AC%BE%E7%AE%A1%E7%90%86%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495920/%E9%80%80%E6%AC%BE%E7%AE%A1%E7%90%86%E5%88%97%E8%A1%A8%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

var orderList = {};//全部订单列表

//通知气泡默认属性
function createToast() {
    let Toast = document.createElement("div");
    let ToastText = document.createTextNode("通知气泡");

    Toast.id = "Toast";
    Toast.style.visibility = "hidden";
    Toast.style.position = "fixed";
    Toast.style.bottom = "0px";
    Toast.style.fontSize = "17px";
    Toast.style.minWidth = "200px";
    Toast.style.backgroundColor = "#4CAF50";
    Toast.style.color = "white";
    Toast.style.textAlign = "center";
    Toast.style.borderRadius = "10px";
    Toast.style.padding = "10px";
    Toast.style.zIndex = 1;
    Toast.style.right = "1%";

    Toast.appendChild(ToastText);
    var elements = document.getElementsByClassName("grid-c2");
    elements[0].appendChild(Toast);
}

//调用通知气泡
function Toast(toastTextContent, alwaysShow = false) {
    let Toast = document.getElementById("Toast");

    Toast.style.visibility = "visible";
    Toast.textContent = toastTextContent;

    if (alwaysShow === false) {
        setTimeout(function () {
            Toast.style.visibility = "hidden";
        }, 3000);
    }
}


//按钮默认属性
function addButton(element, onclickFunc, text = "按钮", id, width = "120px", height = "30px") {
    const button = document.createElement("input");

    button.id = id;
    button.type = "button";
    button.value = text;
    button.style.height = height;
    button.style.width = width;
    button.style.align = "center";
    button.style.marginLeft = "15px";
    button.style.color = "#312222";
    button.style.background = "#f5f5f5";
    button.style.border = "1px solid #bfbfbf";
    button.style.fontSize = "12px";
    button.style.cursor = "pointer";
    button.onclick = function () {
        onclickFunc();
    };
    element.appendChild(button);
}

//在退款管理数据页面添加控件
const orderListPage = /(http|https):\/\/refund2\.taobao.*?\/dispute/g;
if (orderListPage.exec(document.URL)) {
    const orderListMain = document.getElementById("searchConditions_2@7");
    const userMain = document.createElement("div");
    const userMainList = document.createElement("ul");
    const userMainListRow3 = document.createElement("li");
    userMain.id = "userMain";
    userMainList.id = "userMainList";
    userMainListRow3.id = "userMainListRow3";
    orderListMain.insertBefore(userMain, orderListMain.childNodes[1]);
    userMain.appendChild(userMainList);
    userMainList.appendChild(userMainListRow3);
    createToast();
    addButton(userMainListRow3, exportOrdersList, "导出退款单数据", "exportOrdersList");
    setElementStyle();
    console.info("在退款管理数据页面添加按钮!");
}

function setElementStyle() {
    const userMain = document.getElementById("userMain"); 
    const userMainList = document.getElementById("userMainList");    
    const userMainListRow3 = document.getElementById("userMainListRow3");
    userMain.style.height = "32px";
    userMain.style.weight = "200px";
    userMain.style.float = "right";
    userMainList.style.marginLeft = "-20px";
    userMainListRow3.style.marginBottom = "20px";
}

//数据转为excel文件
function toExcel(data,filename){
    const tableField = ['orderId','refundId','shopName','productName', 'refundAmt', 'applyTime','serviceType', 'refundState'];
    const tableHeader = {orderId: '订单号', refundId: '退款编号', shopName: '店铺名称', productName: '商品名称', refundAmt: '退款金额',applyTime:'申请时间',serviceType:'服务类型',refundState:'退款状态'};
    var array = [];
    //Toast("正在导出Excel文件...", true);
    //循环构造json数组
    _.forEach(data, (value, key) => {
        //console.log("data="+value);
        var obj = {}; //定义一个json对象
        obj.orderId = value[0];
        obj.refundId = value[1];
        obj.shopName = value[2];
        obj.productName = value[3];
        obj.refundAmt = value[4];
        obj.applyTime = value[5];
        obj.serviceType = value[6];
        obj.refundState = value[7];
        array.push(obj); //将json数据填入数组
    })
    const obj = {
              header: tableHeader,
              data: array,
              key: tableField,
              title: '',
              filename: filename,
              autoWidth: true
          }
    exportJsonToExcel(obj)
}
var nextFlag=true;//是否有下一页
var currentPageOrdersData = {};
//添加本页订单数据
async function addCurrentPageOrdersToList() {
    const mainOrders = document.getElementById("bottomContainer_1");
    const paginationDisabled=document.querySelector("li.rc-pagination-disabled.rc-pagination-next");
    const listPagination_1=document.querySelector("#listPagination_1");
    console.log("paginationDisabled="+paginationDisabled);
    console.log("listPagination_1="+listPagination_1);
    //Toast("正在处理本页数据...", true);
    if(paginationDisabled){
        //Toast("正在处理最后一页数据...", true);
        console.log("最后一页");
        nextFlag=false;
    }
    //判断是否有分页栏，没有则表示只有一页
    if(!listPagination_1){
        console.log("没有分页栏");
        nextFlag=false;
    }
    var isEnableSnapProductName =false;
    currentPageOrdersData = {};
  
    var orderIdQuery = null;
    var refundIdQuery = null;
    var shopNameQuery = null;
    var productNameQuery = null;
    var refundAmtQuery = null;
    var applyTimeQuery = null;
    var serviceTypeQuery = null;
    var refundStateQuery = null;
    //循环获取每条退款单记录
    for(let i=4;i<=42;i+= 2){
        let orderData = {};
        orderIdQuery = mainOrders.querySelector("em[data-reactid='.0.$root_1.1:$rootContainer_1.$bottomContainer_1.$disputeListGrid_" + i +  "@1.0.$0.2.0.0']");
        refundIdQuery = mainOrders.querySelector("em[data-reactid='.0.$root_1.1:$rootContainer_1.$bottomContainer_1.$disputeListGrid_" + i +  "@1.0.$1.2.0.0']");
        shopNameQuery = mainOrders.querySelector("div[data-reactid='.0.$root_1.1:$rootContainer_1.$bottomContainer_1.$disputeListGrid_" + i +  "@1.1.1.0.0']");
        productNameQuery = mainOrders.querySelector("p[data-reactid='.0.$root_1.1:$rootContainer_1.$bottomContainer_1.$disputeListGrid_" + i +  "@2.0.1']");
        refundAmtQuery = mainOrders.querySelector("span[data-reactid='.0.$root_1.1:$rootContainer_1.$bottomContainer_1.$disputeListGrid_" + i +  "@2.1:$0.0.1']");
        applyTimeQuery = mainOrders.querySelector("span[data-reactid='.0.$root_1.1:$rootContainer_1.$bottomContainer_1.$disputeListGrid_" + i +  "@2.1:$1.0.1']");
        serviceTypeQuery = mainOrders.querySelector("span[data-reactid='.0.$root_1.1:$rootContainer_1.$bottomContainer_1.$disputeListGrid_" + i +  "@2.1:$2.0.1']");
        refundStateQuery = mainOrders.querySelector("span[data-reactid='.0.$root_1.1:$rootContainer_1.$bottomContainer_1.$disputeListGrid_" + i +  "@2.1:$3.0.1']");
        var orderId = orderIdQuery === null ? "" : orderIdQuery.textContent;
        var refundId = refundIdQuery === null ? "" : refundIdQuery.textContent;
        var shopName = shopNameQuery === null ? "" : shopNameQuery.textContent;
        var productName = productNameQuery === null ? "" : productNameQuery.textContent;
        var refundAmt = refundAmtQuery === null ? "" : refundAmtQuery.textContent.replace("￥","");
        var applyTime = applyTimeQuery === null ? "" : applyTimeQuery.textContent;
        var serviceType = serviceTypeQuery === null ? "" : serviceTypeQuery.textContent;
        var refundState = refundStateQuery === null ? "" : refundStateQuery.textContent;
        console.log("orderId="+orderId+",refundId="+refundId+",shopName="+shopName+",productName="+productName+",refundAmt="+refundAmt+",applyTime="+applyTime+",serviceType="+serviceType+",refundState="+refundState);
        if(!refundIdQuery){
            continue;
        }
        currentPageOrdersData[refundId] = [
                orderId,
                refundId,
                shopName,
                productName,
                refundAmt,
                applyTime,
                serviceType,
                refundState
            ];
        orderList[refundId] = currentPageOrdersData[refundId];
    }

    Toast("添加 " + Object.keys(currentPageOrdersData).length + " 条退款单,已添加 " + Object.keys(orderList).length + " 条退款单。");
    console.info("添加 " + Object.keys(currentPageOrdersData).length + " 条退款单,已添加 " + Object.keys(orderList).length + " 条退款单。");
    console.info("本页退款单数据:");
    console.info(currentPageOrdersData);
    
    console.log("nextFlag="+nextFlag);
    if(nextFlag){
        console.log("有下一页。。。");
        document.getElementsByClassName("rc-pagination-next")[0].click();
        // 延迟执行
        setTimeout(async function() {
            await addCurrentPageOrdersToList();
        }, 3000);
    }else{
        //最后一页
        //toCsv(header, orderList, filename);
        nextFlag=true;
        toExcel(orderList, filename);
        document.getElementById("exportOrdersList").disabled = false;
        document.getElementById("exportOrdersList").style.opacity = 1;
        document.getElementById("exportOrdersList").style.background = "#f5f5f5";
        document.getElementById("exportOrdersList").style.color = "#312222";
        document.getElementById("exportOrdersList").style.cursor = "pointer";
    }
}

const header = ["订单编号", "退款编号", "店铺名称", "商品名称", "退款金额", "申请时间","服务类型", "退款状态"];
var filename ="";
//导出订单数据
async function exportOrdersList() {
    //先清空
    orderList = {};

    var dateTime = new Date();
    var dateTimeFullMonth = dateTime.getMonth() + 1;
    var dateTimeFullDay = dateTime.getDate();
    dateTimeFullMonth = dateTimeFullMonth < 10 ? "0" + dateTimeFullMonth : dateTimeFullMonth;
    dateTimeFullDay = dateTimeFullDay < 10 ? "0" + dateTimeFullDay : dateTimeFullDay;
    const dateStr = dateTime.getFullYear() + "-" + dateTimeFullMonth + "-" + dateTimeFullDay;
    const timeStr = dateTime.getHours() + "-" + dateTime.getMinutes() + "-" + dateTime.getSeconds();
    const account=document.querySelector(".site-nav-login-info-nick").innerText;
    filename = account+"_" + dateStr + "_" + timeStr;
    
    //按钮不可点击，防止重复点击
    document.getElementById("exportOrdersList").disabled = true;
    document.getElementById("exportOrdersList").style.opacity = 1;
    document.getElementById("exportOrdersList").style.background = "#fdfdfd";
    document.getElementById("exportOrdersList").style.color = "#cfd9d9";
    document.getElementById("exportOrdersList").style.cursor = "not-allowed";
    // 先获取当前页面的，有下一页就获取下一页，直到没有下一页。
    await addCurrentPageOrdersToList()   
}


// 自动计算col列宽
function auto_width (ws, data) {
  /*set worksheet max width per col*/
  const colWidth = data.map(row => row.map(val => {
    /*if null/undefined*/
    if (val == null) {
      return { 'wch': 10 }
    }
    /*if chinese*/
    else if (val.toString().charCodeAt(0) > 255) {
      return { 'wch': val.toString().length * 2 }
    } else {
      return { 'wch': val.toString().length }
    }
  }))
  /*start in the first row*/
  let result = colWidth[0]
  for (let i = 1; i < colWidth.length; i++) {
    for (let j = 0; j < colWidth[i].length; j++) {
      if (result[j]['wch'] < colWidth[i][j]['wch']) {
        result[j]['wch'] = colWidth[i][j]['wch']
      }
    }
  }
  ws['!cols'] = result
}

// 将json数据转换成数组
function json_to_array (key, jsonData) {
  return jsonData.map(v => key.map(j => {
    return v[j]
  }))
}

/**
 * @param header Object，表头
 * @param data Array，表体数据
 * @param key Array，字段名
 * @param title String，标题（会居中显示），即excel表格第一行
 * @param filename String，文件名
 * @param autoWidth Boolean，是否自动根据key自定义列宽度
 */
const exportJsonToExcel = ({
  header,
  data,
  key,
  title,
  filename,
  autoWidth
}) => {
  const wb = XLSX.utils.book_new()
  if (header) {
    data.unshift(header)
  }
  if (title) {
    data.unshift(title)
  }
  const ws = XLSX.utils.json_to_sheet(data, {
    header: key,
    skipHeader: true
  })
  if (autoWidth) {
    const arr = json_to_array(key, data)
    auto_width(ws, arr)
  }
  XLSX.utils.book_append_sheet(wb, ws, filename)
  XLSX.writeFile(wb, filename + '.xlsx')
}