// ==UserScript==
// @name         淘宝买家订单数据导出
// @namespace    https://gywl.com/TaobaoOrdersExport
// @version      1.0.3
// @description  “淘宝买家订单数据导出”。导出的项目包括订单编号、下单日期、店铺名称、商品名称、单价、数量、退款状态、订单实付款、订单交易状态，导出的订单数据为CSV文件。
// @author       liuyj
// @match        https://buyertrade.taobao.com/trade/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js
// @require      https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495642/%E6%B7%98%E5%AE%9D%E4%B9%B0%E5%AE%B6%E8%AE%A2%E5%8D%95%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/495642/%E6%B7%98%E5%AE%9D%E4%B9%B0%E5%AE%B6%E8%AE%A2%E5%8D%95%E6%95%B0%E6%8D%AE%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

var orderList = {};//全部订单列表
var ProductNameBlackList = ["保险服务", "增值服务", "买家秀"];

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
    document.getElementById("page").appendChild(Toast);
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
    button.onclick = function () {
        onclickFunc();
    };
    element.appendChild(button);
}

//在订单数据页面添加控件
const orderListPage = /(http|https):\/\/buyertrade\.taobao.*?\/trade/g;
if (orderListPage.exec(document.URL)) {
    const orderListMain = document.getElementById("J_bought_main");
    const userMain = document.createElement("div");
    const userMainList = document.createElement("ul");
    const userMainListRow3 = document.createElement("li");

    userMain.id = "userMain";
    userMainList.id = "userMainList";  
    userMainListRow3.id = "userMainListRow3";

    orderListMain.insertBefore(userMain, orderListMain.childNodes[0]);    
    userMain.appendChild(userMainList);    
    userMainList.appendChild(userMainListRow3);
    
    createToast(); 

    //addButton(userMainListRow3, cleanOrdersList, "清空订单数据", "cleanOrdersList");
    addButton(userMainListRow3, exportOrdersList, "导出订单数据", "exportOrdersList");
    //addButton(userMainListRow3, addCurrentPageOrdersToList, "添加本页订单", "addOrdersList");

    //document.getElementById("exportOrdersList").disabled = true;
    //document.getElementById("exportOrdersList").style.opacity = 0.6;
    //document.getElementById("cleanOrdersList").disabled = true;
    //document.getElementById("cleanOrdersList").style.opacity = 0.6;
    setElementStyle();
    console.info("在订单数据页面添加按钮!");
}

function setElementStyle() {
    const userMain = document.getElementById("userMain");
    //const userMainText = document.getElementById("userMainText");
    const userMainList = document.getElementById("userMainList");
    const userMainListRow1List = document.getElementById("userMainListRow1List");    
    const userMainListRow3 = document.getElementById("userMainListRow3");
    userMain.style.height = "35px";
    userMainList.style.float = "left";
    userMainList.style.width = "600px";
    //userMainList.style.marginTop = "20px";
    userMainList.style.marginLeft = "-20px";
    userMainListRow3.style.marginBottom = "20px";
}

//重置按钮状态
function ResetButtonStatus() {
    //document.getElementById("addOrdersList").style.background = "#409EFF";
    document.getElementById("tp-bought-root").removeEventListener("click", ResetButtonStatus);
}

//数据转为csv文本文件
function toCsv(header, data, filename) {
    let rows = "";
    let row = header.join(",");
    rows += row + "\n";

    _.forEach(data, (value) => {
        rows += value.join(",") + "\n";
    });

    let blob = new Blob(["\ufeff" + rows], { type: "text/csv;charset=utf-8;" });
    let encodedUrl = URL.createObjectURL(blob);
    let url = document.createElement("a");
    url.setAttribute("href", encodedUrl);
    url.setAttribute("download", filename + ".csv");
    document.body.appendChild(url);
    url.click();
}
//数据转为excel文件
function toExcel(data,filename){
    //const header = ["订单号","物流公司","快递单号", "商品名称", "数量","商品单价","运费","实付款",  "店铺名称", "交易状态","下单日间"];
    const tableField = ['orderId','expressName','expressId','productName','num', 'price', 'freight','payFee', 'shopName', 'orderState','orderDate'];
    const tableHeader = {orderId: '订单号', orderDate: '下单日期', shopName: '店铺名称', productName: '商品名称', price: '单价',num:'数量',refundState:'退款状态',freight:'运费',payFee:'实付款',expressId:'快递单号',expressName:'物流公司',orderState:'交易状态'};
    var array = [];
    //Toast("正在导出Excel文件...", true);
    //循环构造json数组
    _.forEach(data, (value, key) => {
        //console.log("data="+value);
        var obj = {}; //定义一个json对象
        obj.orderId = value[0];
        obj.orderDate = value[1];
        obj.shopName = value[2];
        obj.productName = value[3];
        obj.price = value[4];
        obj.num = value[5];
        obj.refundState = value[6];
        obj.freight = value[7];
        obj.payFee = value[8];
        obj.expressId = value[9];
        obj.expressName = value[10];
        obj.orderState = value[11];
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
    const mainOrders = document.getElementsByClassName("js-order-container");
    const paginationDisabled=document.querySelector("li.pagination-disabled.pagination-next");
    console.log("paginationDisabled="+paginationDisabled);
    //Toast("正在处理本页数据...", true);
    if(paginationDisabled){
        //Toast("正在处理最后一页数据...", true);
        console.log("最后一页");
        nextFlag=false;
    }
    //var isEnableSnapProductName = document.getElementById("SnapProductNameStatus").checked;
    var isEnableSnapProductName =false;
    //document.getElementById("addOrdersList").style.background = "#ff9800";

    currentPageOrdersData = {};

    //遍历每条订单记录
    for (let order of mainOrders) {
        let items = await processOrderList(order);

        if (!items) {
            continue;
        }

        _.forEach(items, (value, key) => {
            orderList[key] = value;
            if (isEnableSnapProductName === false) {
                currentPageOrdersData[key] = value;
            }
        });

        //break; //TODO:测试单条订单记录
    }

    if (isEnableSnapProductName === false) {
        //document.getElementById("addOrdersList").style.background = "#4CAF50";

        document.getElementById("tp-bought-root").addEventListener("click", ResetButtonStatus);

        Toast("添加 " + Object.keys(currentPageOrdersData).length + " 条订单,已添加 " + Object.keys(orderList).length + " 条订单。");
        console.info("添加 " + Object.keys(currentPageOrdersData).length + " 条订单,已添加 " + Object.keys(orderList).length + " 条订单。");

        console.info("本页订单数据:");
        console.info(currentPageOrdersData);
    }
    console.log("nextFlag="+nextFlag);
    if(nextFlag){
        console.log("有下一页。。。");
        document.getElementsByClassName("pagination-next")[0].click();
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
    }
}

const header = ["订单编号", "下单日期", "店铺名称", "商品名称", "单价", "数量", "退款状态","运费", "实付款","快递单号","物流公司", "交易状态"];
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
    //点击弹出开始时间窗-不弹出抓不到值
    //document.querySelector("#tp-bought-root > form > div.more-part > div:nth-child(1) > div.search-mod__col___3ytvL.search-mod__col2___24ptm > input:nth-child(2)").click();
    //var startTime=document.querySelector(".rc-calendar-input").getAttribute("value")
    //console.log("startTime="+startTime);
    //按钮不可点击，防止重复点击
    document.getElementById("exportOrdersList").disabled = true;
    document.getElementById("exportOrdersList").style.opacity = 1;
    // 先获取当前页面的，有下一页就获取下一页，直到没有下一页。
    await addCurrentPageOrdersToList()
    /**
    while (nextFlag) {
        document.getElementsByClassName("pagination-next")[0].click();
        // 延迟执行
        setTimeout(async function() {
            await addCurrentPageOrdersToList();
        }, 3000);
    }*/
    //toCsv(header, orderList, filename);
}
// setTimeout
let sleep = function (fun, time) {
    setTimeout(() => {
        fun();
    }, time);
}
//清空订单数据
function cleanOrdersList() {
    let count = Object.keys(orderList).length;
    orderList = {};

    Toast("清空了: " + count + " 条订单数据!");
    console.info("清空了: " + count + " 条订单数据!");
    
}


var orderDataIndexListCount = 0;
var orderDataIndexList = [];
var getSnapShotProductNameCount = 0;
var orderListSnapShotProductName = {};
//获取快照商品名称
function getSnapShotProductName(snapShotUrl, orderDataIndex) {
    var orderDataItemIndex = 14;
    var randomTimeout = 0;
    var isenableDelay = document.getElementById("DelayStatus").checked;
    if (isenableDelay === true) {
        let min = 1000; //毫秒
        let max = 3000; //毫秒
        randomTimeout = Math.round(Math.random() * (max - min)) + min;
    }

    orderDataIndexList[orderDataIndexListCount] = orderDataIndex;
    orderDataIndexListCount++;

    Toast("正在获取快照商品名称...", true);
    console.info("正在获取快照商品名称...");

    setTimeout(function () {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                orderListSnapShotProductName[orderDataIndex] = this.responseText.match(/<title>(.*)<\/title>/)[1];

                getSnapShotProductNameCount--;
                //console.info("快照商品名称:" + orderListSnapShotProductName[orderDataIndex]);

                if (getSnapShotProductNameCount === 0) {
                    //document.getElementById("addOrdersList").style.background = "#4CAF50";

                    document.getElementById("tp-bought-root").addEventListener("click", ResetButtonStatus);

                    let element = document.createElement("span");
                    _.forEach(orderListSnapShotProductName, (value, index) => {
                        element.innerHTML = value;
                        element.innerHTML = element.innerHTML.replace(/&amp;([a-zA-Z]*)/g, "&$1");
                        element.innerHTML = element.innerHTML.replace(/,/g, "，");

                        orderListSnapShotProductName[index] = element.innerText;
                        orderList[index][orderDataItemIndex] = orderListSnapShotProductName[index];
                    });
                    element.remove();

                    _.forEach(orderDataIndexList, (value) => {
                        currentPageOrdersData[value] = orderList[value];
                    });

                    orderDataIndexListCount = 0;
                    orderDataIndexList = [];

                    Toast("添加 " + Object.keys(currentPageOrdersData).length + " 条订单,已添加 " + Object.keys(orderList).length + " 条订单。");
                    console.info("添加 " + Object.keys(currentPageOrdersData).length + " 条订单,已添加 " + Object.keys(orderList).length + " 条订单。");

                    console.info("本页订单数据:");
                    console.info(currentPageOrdersData);
                }
            }
        };
        xhttp.open("GET", snapShotUrl);
        xhttp.send();
    }, randomTimeout);
}

var express = "";
//获取物流信息
function getLogistic(id) {
    return new Promise((resolve, reject) => {
        var randomTimeout = 0;
        var isenableDelay = true;
        var url="https://buyertrade.taobao.com/trade/json/transit_step.do?bizOrderId="+id;
        if (isenableDelay === true) {
            let min = 200; //毫秒
            let max = 2000; //毫秒
            randomTimeout = Math.round(Math.random() * (max - min)) + min;
        }
        Toast("正在获取物流信息...", true);
        console.info("正在获取物流信息...");
        setTimeout(function () {
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    express = this.responseText;
                    console.log("express="+express);
                    if(express.trim()==""){
                        console.log("物流信息异常");
                        //物流信息异常，返回空
                        resolve("'',''");
                        return;
                    }
                    const jsonObject = JSON.parse(express);
                    console.log("expressId="+jsonObject["expressId"]);
                    console.log("expressName="+jsonObject["expressName"]);
                    var tmp=jsonObject["expressId"]+","+jsonObject["expressName"];
                    resolve(tmp);
                }
            };
            xhttp.open("GET", url);
            xhttp.send();
        }, randomTimeout);
    });
}
//处理订单数据
async function processOrderList(order) {
    let orderData = {};
    let textContent = order.textContent;
    let pattern = /(\d{4}-\d{2}-\d{2})订单号: ()/;
    let isExist = pattern.exec(textContent);

    if (!isExist) {
        console.info("暂未发现订单！");
    } else {
        const date = isExist[1];
        const id = order.querySelector("div[data-id]").getAttribute("data-id");

        var index = 0;

        var ShopNameQuery = null;
        var picUrlQuery = null;
        var ProductUrlQuery = null;
        var ProductNameQuery = null;
        var snapshotUrlQuery = null;
        var SKUNameQuery = null;
        var RealPriceQuery = null;
        var countQuery = null;
        var refundQuery = null;
        var actualFeeQuery = null;//实付
        var freightQuery=null;//运费
        var statusQuery = null;
        var DetailUrlQuery1 = null;
        var DetailUrlQuery2 = null;

        while (true) {
            if (index === 0) {
                ShopNameQuery = order.querySelector("a[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:0.0.1.0.1']");
                actualFeeQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$4.0.0.2.0.1']");
                freightQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$4.0.1:$0.1']");
                statusQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$5.0.0.0']");
                DetailUrlQuery1 = order.querySelector("a[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$5.0.1.$0.0']");
                DetailUrlQuery2 = order.querySelector("a[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$5.0.1.$1.0']");
            }

            picUrlQuery = order.querySelector("img[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$0.0.0.0.0']");
            ProductUrlQuery = order.querySelector("a[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$0.0.1.0.0']");
            ProductNameQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$0.0.1.0.0.1']");
            snapshotUrlQuery = order.querySelector("a[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$0.0.1.0.1']");
            SKUNameQuery = order.querySelector("p[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$0.0.1.1']");
            RealPriceQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$1.0.1.1']");
            countQuery = order.querySelector("p[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$2.0.0']");
            refundQuery = order.querySelector("span[data-reactid='.0.7:$order-" + id + ".$" + id + ".0.1:1:0.$" + index + ".$3.0.$0.0.$text']");

            index++;
            let orderDataIndex = id + index;

            if (ProductNameQuery === null) {
                break;
            }

            //过滤黑名单项：如"保险服务"、"增值服务"、"买家秀"等;
            //var isEnableBlackList = document.getElementById("BlackListStatus").checked;
            var isEnableBlackList =true;
            if (isEnableBlackList === true && ProductNameBlackList.length > 0) {
                var searchResult = null;

                for (let item of ProductNameBlackList) {
                    searchResult = ProductNameQuery.textContent.search(item);
                    if (searchResult > -1) {
                        break;
                    }
                }

                if (searchResult > -1) {
                    continue;
                }
            }

            //修复淘宝订单页面中的字符实体显示错误和英文逗号导致的CSV导入Excel后数据错行；
            ProductNameQuery.innerHTML = ProductNameQuery.innerHTML.replace(/&amp;([a-zA-Z]*)/g, "&$1");
            ProductNameQuery.innerHTML = ProductNameQuery.innerHTML.replace(/,/g, "，");
            if (SKUNameQuery !== null) {
                SKUNameQuery.innerHTML = SKUNameQuery.innerHTML.replace(/&amp;([a-zA-Z]*).*?：/g, "&$1;");
                SKUNameQuery.innerHTML = SKUNameQuery.innerHTML.replace(/,/g, "，");
            }
            //订单号加\t解决excel显示问题
            var orderInfoId = id.toString()+"\t";

            var orderInfoDate = date;
            var sellerInfoShopName = ShopNameQuery === null ? "" : ShopNameQuery.innerText;
            var subOrdersIteminfoPicUrl = picUrlQuery === null ? "" : picUrlQuery.src;
            var subOrdersIteminfoProductUrl = ProductUrlQuery === null ? "" : ProductUrlQuery.href;
            var subOrdersIteminfoProductName = ProductNameQuery.textContent;
            var subOrdersIteminfoSnapUrl = snapshotUrlQuery === null ? "" : snapshotUrlQuery.href;
            var subOrdersIteminfoSKUName = SKUNameQuery === null ? "" : SKUNameQuery.innerText;
            var subOrdersPriceinfoRealPrice = RealPriceQuery === null ? "" : RealPriceQuery.textContent;
            var subOrdersQuantityCount = countQuery === null ? "" : countQuery.textContent;
            var subOrdersRefund = refundQuery === null ? "" : refundQuery.innerText === "查看退款" ? "退款" : "";
            var payInfoActualFee = actualFeeQuery === null ? "" : actualFeeQuery.textContent;
            var freight=freightQuery === null ? "" : freightQuery.textContent;
            var statusInfoStatus = statusQuery === null ? "" : statusQuery.textContent;
            var statusInfoDetailUrl = DetailUrlQuery1 === null ? (DetailUrlQuery2 === null ? "" : DetailUrlQuery2.href) : DetailUrlQuery1.href;

            var subOrdersSnapshotProductName = null;

            //获取快照商品名称
            //var isEnableSnapProductName = document.getElementById("SnapProductNameStatus").checked;
            var isEnableSnapProductName = false;
            if (isEnableSnapProductName === true) {
                getSnapShotProductNameCount++;
                //getSnapShotProductName(subOrdersIteminfoSnapUrl, orderDataIndex);
            } else {
                subOrdersSnapshotProductName = "";
            }
            //获取物流信息
            var express="";
            var expressId="";//快递单号
            var expressName="";//快递公司名称
            var viewLogistic=order.querySelector("#viewLogistic");
            if(viewLogistic!=null && viewLogistic.hasAttribute("action") && index==1){
                // 检查<a>标签是否有action属性，有表示可以显示物流环节
                console.log(id+"有action属性");                
                express=await getLogistic(id);
                console.log("express="+express);
                let expressArray=express.split(",");
                expressId=expressArray[0]+"\t";
                expressName=expressArray[1];
            }

            //精简数据
            subOrdersIteminfoProductUrl = subOrdersIteminfoProductUrl.replace(/&_u=\w*/, "");
            subOrdersIteminfoPicUrl = subOrdersIteminfoPicUrl.replace(/_80x80.(jpg|png)/, "");
            subOrdersIteminfoSnapUrl = subOrdersIteminfoSnapUrl.replace(/&snapShot=true/, "");
            subOrdersIteminfoSKUName = subOrdersIteminfoSKUName.replace(/颜色分类：?/, "");

            orderData[orderDataIndex] = [
                orderInfoId,
                orderInfoDate,
                sellerInfoShopName,
                subOrdersIteminfoProductName,
                //subOrdersIteminfoSKUName,
                //subOrdersIteminfoPicUrl,
                //subOrdersIteminfoProductUrl,
                //subOrdersIteminfoSnapUrl,
                subOrdersPriceinfoRealPrice,
                subOrdersQuantityCount,
                subOrdersRefund,
                freight,
                payInfoActualFee,
                expressId,
                expressName,
                statusInfoStatus,
                //statusInfoDetailUrl,
                //subOrdersSnapshotProductName,
            ];
        }
    }
    return orderData;
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

