// ==UserScript==
// @name         E-Shipping Dashbord
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  E-Shipping优化
// @author       Tang Yanji
// @match        http://*/XMII/CM/SC_COMPONENTS/DASHBOARD/E-SHIPPING/E-ShippingSelection.irpt*
// @match        https://*/XMII/CM/SC_COMPONENTS/DASHBOARD/E-SHIPPING/E-ShippingSelection.irpt*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491446/E-Shipping%20Dashbord.user.js
// @updateURL https://update.greasyfork.org/scripts/491446/E-Shipping%20Dashbord.meta.js
// ==/UserScript==

var refreshInterval = 4; //刷新间隔小时
var OverViewTableRowHeight = 40; //表格行高
var fontsize = "16px";   //字体大小
var intervalRefDetail;
var scripts = document.head.getElementsByTagName("script")
for (var index = 0; index < scripts.length; index++) {
    var element = scripts[index]
    if (/Deliveries(?:Details|Overview)/.test(element.src)) {
        document.head.removeChild(element)
        console.log(element.src)
        index = -1
    }
}

const Materials = [
    '1520802X',
    '1520814X',
    '1489118X',
    '1227055X',
    '2167505X',
    '2167498X',
    '2167506X',
    '2167538X'
  ];

const MaterialMap = Materials.reduce((acc, item, index) => {
    acc[item] = index + 1;
    return acc;
}, {});


var colSort = [
    "OD_shNumber",
    "OD_tpa",
    "OD_otbDel",
    "OD_customer",
    "OD_customerName",
    "OD_startPrep",
    "OD_endPrep",
    "OD_loadDate",
    "OD_departure",
    "OD_delTime",
    "OD_loadStatus",
    "OD_odStatus",
    "OD_prep",
    "OD_lines",
    "OD_nokLines",
    "OD_missingWK",
    "OD_WKLate",
    "TPA_shNumber",
    "TPA_lines",
    "TPA_loadStatus",
    "TPA_delTime",
    "TPA_nokLines",
    "TPA_missingWK",
    "TPA_WK_late"
]

var translate = {
    'OD_shNumber': "Shipment",
    'OD_tpa': "TPA代码",
    'OD_otbDel': "外向交货单",
    'OD_customer': "客户代码",
    'OD_customerName': "客户名称",
    'OD_startPrep': "开始备货",
    'OD_endPrep': "结束备货",
    'OD_loadDate': "装载时间",
    'OD_departure': "出发时间",
    'OD_delTime': "交货时间",
    'OD_loadStatus': "装载状态",
    'OD_odStatus': "交货单状态",
    'OD_prep': "进度",
    'OD_lines': "行数",
    'OD_nokLines': "不良行数",
    // 'OD_missingWK': "缺失工作",
    // 'OD_WKLate': "工作延迟",
    'TPA_shNumber': "TPA装运号",
    'TPA_lines': "TPA行数",
    // 'TPA_loadStatus': "TPA装运状态",
    // 'TPA_delTime': "TPA交货时间",
    // 'TPA_nokLines': "TPA不良行数",
    // 'TPA_missingWK': "TPA缺失工作",
    // 'TPA_WK_late': "TPA工作延迟",
    'DeliveriesDetailPage--CustomerCode': '客户代码',
    'DeliveriesDetailPage--CustomerDescription': '客户名称',
    'DeliveriesDetailPage--Lines': '行数',
    'DeliveriesDetailPage--EndOfPreparation': '备货结束',
    'DeliveriesDetailPage--TruckLoadDep': '卡车装货时间 / 卡车离开时间',
    'DeliveriesDetailPage--HUToDeliver': '交货单HU',
    'DeliveriesDetailPage--HUPicked': '交货单拣配HU',
    'DeliveriesDetailPage--RemainingHU': '交货单剩余HU',
    'DeliveriesDetailPage--PickedHU': '拣配进度',
    'DeliveriesDetailPage--SHIPMENT': 'Shipment',
    'DeliveriesDetailPage--OUTBOUNDDELIVERY': '外向交货单',
    'DeliveriesDetailPage--LINE': '行号',
    'DeliveriesDetailPage--PART_NUMBER': '零件号',
    'DeliveriesDetailPage--DESCRIPTION': '描述',
    'DeliveriesDetailPage--HU_TOTAL': '零件HU',
    'DeliveriesDetailPage--HU_PICKED': '拣配HU',
    'DeliveriesDetailPage--REMAINING_HU': '剩余零件',
    'DeliveriesDetailPage--PICKED_HU': '进度',
    // 'DeliveriesDetailPage--missingWK': '缺少的WK',
    // 'DeliveriesDetailPage--WK_late': '延迟的WK'
};
// 定义要插入的 CSS 规则
const cssRules = `
    .qrcode {
        visibility: visible;
        width: auto;
        background-color: #fff;
        text-align: center;
        border: 1px solid #ccc;
        border-radius: 6px;
        position: absolute;
        padding: 10px;
        z-index: 1;
        transform: translateX(-50%);
    }

    /*窗口尺寸*/
    .windowsize {
            position: fixed;
            opacity: 0;
            transition: opacity 2s ease-out;
            top: 2px;
            right: 4px;
            width: 120px;
            height: 18px;
            text-align: right;
            z-index: 1000;
        }
    .hiddenElement {
        position: fixed;
        animation-name: hiddenElement;
        animation-duration: 2s;
        animation-timing-function: ease;
        animation-fill-mode: forwards;
    }
    @keyframes hiddenElement {
        from {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }
    .displayElement {
        position: fixed;
        animation-name: displayElement;
        animation-duration: 0.3s;
        animation-timing-function: ease;
        animation-fill-mode: forwards;
    }
    @keyframes displayElement {
        from {
            opacity: 0;
        }

        to {
            opacity: 1;
        }
    }

    /*按钮初始位置*/
    .outside {
        right: 700px;
    }
    .moveRight {
        position: relative;
        animation-name: moveRight;
        animation-duration: 2s;
        animation-timing-function: ease;
        animation-fill-mode: forwards;
    }
    @keyframes moveRight {
        from {
            transform: translateX(0px);
            opacity: 0;
        }

        to {
            transform: translateX(700px);
            opacity: 1;
        }
    }
    .moveLeft {
        position: relative;
        animation-name: moveLeft;
        animation-duration: 2s;
        animation-timing-function: ease;
        animation-fill-mode: forwards;
    }
    @keyframes moveLeft {
        from {
            transform: translateX(700px);
            opacity: 1;
        }

        to {
            transform: translateX(0px);
            opacity: 0;
        }
    }

    /* 图标旋转 */
    @keyframes rotateLeft {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(180deg);
        }
    }
    @keyframes rotateRight {
        from {
            transform: rotate(180deg);
        }

        to {
            transform: rotate(0deg);
        }
    }/*出*/
    .rotateLeft {
        transform: rotate(0deg);
        animation: rotateLeft 0.5s linear forwards;
        animation-delay:1.5s;
    }/*入*/
    .rotateRight {
        transform: rotate(180deg);
        animation: rotateRight 0.5s linear forwards;
        animation-delay:1s;
    }
    .hiddenBtn {
        width: 140px !important;
        position: relative !important;
        left: 0px ;
        z-index: 4 !important;
        opacity: 1 !important;
        color: white !important;
        background: white !important;
        border: 0 !important;
        cursor: default !important;
        outline: none !important;
    }
    .optionBtn{
        z-index:100;
    }
`;
// QrCode库URL
const QRCodeUrl = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.js"

//1080P显示变大
var screen = window.screen.width + "*" + window.screen.height
switch (screen) {
    case "1920*1080":
        fontsize = "20px"
        OverViewTableRowHeight = 50;
        break;
}

//定时刷新
intervalReload = setInterval(function () {
    window.location.reload()
}, refreshInterval * 60 * 60 * 1000)

//加载外部资源 xml2json
jQuery.sap.registerModulePath("global", "/XMII/CM/SC_COMPONENTS/DASHBOARD/ERECEIVING/js/");
jQuery.sap.require("global.xml2json");

// 将 CSS 规则添加到 Head 元素中
const styleElement = document.createElement('style');
styleElement.innerHTML = cssRules;
document.head.appendChild(styleElement);

// 将QRCode库加载到Head
const scriptElement = document.createElement('script');
scriptElement.src = QRCodeUrl
document.head.appendChild(scriptElement);


document.getElementsByTagName('html')[0].style.fontSize = fontsize;
// // 禁止鼠标右键菜单显示
// document.addEventListener("contextmenu", function (event) {
//     event.preventDefault(); // 取消事件的默认行为，阻止右键菜单的显示
// });

//窗口右上角显示窗口大小比例
var resizeTimer = ""
var span = document.createElement("span")
span.classList.add("windowsize")
span.id = "windowsize"
document.body.appendChild(span)
window.addEventListener('resize', function () {
    // 获取新的窗口尺寸
    const width = Math.floor(window.innerWidth / window.screen.width * 100);
    const height = Math.floor(window.innerHeight / window.screen.height * 100);
    var elem = document.getElementById("windowsize")
    elem.textContent = `${width}% x ${height}%`
    elem.classList.remove("hiddenElement")
    elem.classList.add("displayElement")
    // 清除之前的计时器
    resizeTimer = setTimeout(function () {
        elem.classList.remove("displayElement")
        elem.classList.add("hiddenElement")
        clearTimeout(resizeTimer);
    }, 2000);
});


//初始界面预选“初始、处理中、已拣配...”
var date = new Date();
var newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7);
_this.byId("sdf").setDateValue(newDate);
_this.byId("initialCkB").setSelected(true)
_this.byId("inProgressCkB").setSelected(true)
_this.byId("pickClosedCkB").setSelected(true)
_this.byId("errorCkB").setSelected(true)


/**
 * 修改刷新间隔
*/
setInterval(function () {
    //判断页面是否隐藏
    if (!sap.ui.getCore().byId("mainPageView--DeliveriesOverviewPage").hasStyleClass("sapMNavItemHidden")) {
        _thisOD.refreshOverview();
    }
    //判断页面是否隐藏
    if (!sap.ui.getCore().byId("mainPageView--DeliveriesDetailPage").hasStyleClass("sapMNavItemHidden")) {
        _thisDTL.refreshDetails();
    }
}, 60 * 1000);


//DeliveriesOverview onAfterRendering函数,Control加载完成后需要做的事情
OverViewController_injectFunction = function (oEvent) {
    var oBusy = new sap.m.BusyDialog({
        text: "Loading",
    })


    //修改table
    //重新设置mouldDetailTableIDTable行数
    var OVTable = sap.ui.getCore().byId("DeliveriesOverviewPage--mouldDetailTableID")
    OVTable.setRowHeight(OverViewTableRowHeight);
    OVTable.setEnableColumnReordering(false)                //禁止拖动
    OVTable.setEnableCustomFilter(true)                     //禁止过滤

    //column排序 按顺序插入数组，按顺序创建column写入table
    var aColumns = Array()
    colSort.forEach(function (columnId) {
        var column = _thisOD.getView().byId(columnId)
        if (column) {
            if (translate[columnId]) {
                column.getLabel().setText(translate[columnId])        //翻译
            }
            column.getLabel().setDesign("Bold")             //加粗
            column.setSortProperty(null)                    //禁止排序
            aColumns.push(column)
        }
    })
    OVTable.removeAllColumns();
    aColumns.forEach(function (oColumn) {
        OVTable.addColumn(oColumn);
    });

    // 调整位置
    // table.insertColumn(column, 1);
    //table防抖
    var tableCellClickFunction = OVTable.mEventRegistry.cellClick[0].fFunction
    OVTable.mEventRegistry.cellClick[0].fFunction = function (oEvent) {
        //点击空行不处理
        var rowPath = oEvent.getParameter("rowBindingContext")
        if (!rowPath) {
            return
        }
        //使用busyDialog处理防抖
        oBusy.open()
        setTimeout(() => {
            oBusy.close()
        }, 300);
        //执行原来的onclick
        tableCellClickFunction(oEvent)
    }

    isHidded = false


    var url = "";
    if (_thisOD.isME == "1") {
        url = "/XMII/Illuminator?QueryTemplate=SC_ME/SHIPMENT/DASHBOARDS/E_SHIPPING/SELECT_DELIVERY_OVERVIEW_NEO&Content-Type=text/json";
    } else {
        url = "/XMII/Illuminator?QueryTemplate=SC_COMPONENTS/DASHBOARD/E_SHIPPING/QUERY/SELECT_DELIVERY_OVERVIEW&Content-Type=text/json";
    }
    ExpirationModel = new sap.ui.model.json.JSONModel()
    var dateFormat = sap.ui.core.format.DateFormat.getInstance({ pattern: "yyyy-MM-ddTHH:mm:ss" });
    var fromDate = dateFormat.parse(filterModel.getData().SHIPPING_DATE_FROM)
    var fromDateString = dateFormat.format(new Date(fromDate.setDate(fromDate.getDate() - 30)))
    var parameters = {
        "Param.1": filterModel.getData().PLANT,
        "Param.2": filterModel.getData().LOADING_DATE_FROM,
        "Param.3": filterModel.getData().LOADING_DATE_TO,
        "Param.4": fromDateString,
        "Param.5": filterModel.getData().SHIPPING_DATE_FROM,//截止日期，因为要查看历史数据，所有使用的ShipFrom日期
        "Param.6": filterModel.getData().DELIVERY_DATE_FROM,
        "Param.7": filterModel.getData().DELIVERY_DATE_TO,
        "Param.8": filterModel.getData().OUTBOUND_DELIVERY_FROM,
        "Param.9": filterModel.getData().GV == true ? filterModel.getData().GV_CUSTOMER : filterModel.getData().CUSTOMER,
        "Param.10": filterModel.getData().GV == true ? filterModel.getData().GV_TPA_CODE_FROM : filterModel.getData().TPA_CODE_FROM,
        "Param.11": filterModel.getData().DOCK_CODE_FROM,
        "Param.12": filterModel.getData().EXTERNAL_DEL,
        "Param.13": filterModel.getData().SHIPPING_POINT,
        "Param.14": filterModel.getData().MATERIAL,
        "Param.15": filterModel.getData().STATUS,
        "Param.16": filterModel.getData().NUMBER_OD,
        "Param.17": filterModel.getData().RFID_STATUS,
        "Param.18": filterModel.getData().OUTBOUND_DELIVERY_TO,
        "Param.19": filterModel.getData().GV == true ? filterModel.getData().GV_TPA_CODE_TO : filterModel.getData().TPA_CODE_TO,
        "Param.20": filterModel.getData().DOCK_CODE_TO
    };
    ExpirationModel.attachRequestCompleted(null, fnRequestCompleted);
    ExpirationModel.loadData(url, parameters, true, "POST")
    var fnRequestCompleted = function () {
        var json = ExpirationModel.getData()
    }
    var expirationLinkFn = function () {
        alert("Nothing...")
    }

}

//DeliveriesDetail onAfterRendering函数,Control加载完成后需要做的事情
DetailViewController_injectFunction = function (oEvent) {
    if (sap.ui.getCore().byId("OD_Seg")) {
        return
    }
    /**
     * 在ModifyPicking接口获取QTY
     * 插入数量
     * 修改过账按钮
     * 插入二维码
    */

    bodyDetailsXmlModel = new sap.ui.model.xml.XMLModel();
    var loadDeliveryQty = function () {
        //1545工厂需要排序显示物料
        if ($Faurecia.miiUserData.plant == '1545'){
            tmp_json = bodyDetailsModel.getData()
            tmp_json['Rowsets']['Rowset'][0]['Row'].forEach((item)=>{
                if (MaterialMap[item.PART_NUMBER]){
                    item.LINE = MaterialMap[item.PART_NUMBER] * 10
                }
            })
            tmp_json['Rowsets']['Rowset'][0]['Row'].sort((a, b) => a.LINE - b.LINE);
            bodyDetailsModel.setData(tmp_json)
        }

        if (sap.ui.getCore().byId("mainPageView--DeliveriesDetailPage").hasStyleClass("sapMNavItemHidden")){
            //防止Detail页面隐藏后继续请求数量及创建二维码
            return
        }
        var url3 = servername + '/Runner'
        var parameters3 = {
            "Transaction": "SHIPMENT/SHP_b/Transaction/ModifyPicking",
            "ODNumber": detailsModel.getData().OUTBOUND_DEL,
            "plant": detailsModel.getData().PLANT,
            "ActionType": "Initial",
            "OutputParameter": "ItemInfosXML",
            "Content-Type": " text/xml"
        }
        bodyDetailsXmlModel.loadData(url3, parameters3, false, "GET");
    }
    var expandQty2Model = function () {
        var json = $.xml2json(bodyDetailsXmlModel.getData())
        var targetJson = bodyDetailsModel.getData();
        if (!Array.isArray(json.Rowset[1].Row)) {
            targetJson.Rowsets.Rowset[0].Row[0].QTY = json.Rowset[1].Row.QTY_MII
            targetJson.Rowsets.Rowset[0].Row[0].SEBANGO = json.Rowset[1].Row.SEBANGO
            targetJson.Rowsets.Rowset[0].Row[0].HU_PICKED = json.Rowset[1].Row.HU_PICKED
        } else {
            json.Rowset[1].Row.forEach(function (row) {
                var partNumber = row.PARTS;
                for (var i = 0; i < targetJson.Rowsets.Rowset[0].Row.length; i++) {
                    if (targetJson.Rowsets.Rowset[0].Row[i].PART_NUMBER == partNumber) {
                        targetJson.Rowsets.Rowset[0].Row[i].QTY = row.QTY_MII
                        targetJson.Rowsets.Rowset[0].Row[i].SEBANGO = row.SEBANGO
                        targetJson.Rowsets.Rowset[0].Row[i].QTY_PICKED = row.QTY_PICKED
                    }
                }
            });
        }
        bodyDetailsModel.setData(targetJson)

        var intervalEnableBtn = setInterval(() => {
            if (sap.ui.getCore().byId("headerDeliveriesDetailPage--POST_DELIVERY")) {
                sap.ui.getCore().byId("headerDeliveriesDetailPage--POST_DELIVERY").setEnabled(json.Rowset[0].Row.HD_STATUS == 'PICKCLOSED')
                if (sap.ui.getCore().byId("headerDeliveriesDetailPage--barID").getVisible()) {
                    sap.ui.getCore().byId("headerDeliveriesDetailPage--POST_DELIVERY").addStyleClass("sapUiLargeMarginTop")
                }
                clearInterval(intervalEnableBtn)
            }
        }, 100);

        /**
         * V21版本中返回按钮不会注销Controller
         * 出现QRCode残留问题，需要在刷新数据时检查QRCode是否一致
        */
        //添加二维码
        var intervalInstertQRCode = setInterval(() => {
            //QrCode是否存在
            var outboundNub = detailsModel.getData().OUTBOUND_DEL
            var qrelement = document.getElementById('QRCode')
            if (qrelement) {
                if (qrelement.title != detailsModel.getData().OUTBOUND_DEL) {
                    qrelement.parentNode.removeChild(qrelement)
                } else {
                    console.log("Qrcode 内容相同")
                    clearInterval(intervalInstertQRCode)
                    return
                }
            }
            //创建二维码，显示二维码
            var detailTable = sap.ui.getCore().byId("DeliveriesDetailPage--DeliveryDetailTable")
            var element = document.getElementById(detailTable.getRows()[0].getCells()[0].getId()).parentNode.parentNode
            var QRelement = document.createElement('span')
            QRelement.id = 'QRCode'
            new QRCode(QRelement, {
                text: outboundNub,
                width: 120,
                height: 120
            });
            QRelement.classList.add("qrcode");
            element.appendChild(QRelement)
            console.log("Created QRCode!")
            clearInterval(intervalInstertQRCode)
        }, 100);
        console.log(bodyDetailsModel.getData())
        _thisDTL.showMessageToast("外向交货单" + detailsModel.getData().OUTBOUND_DEL + "加载完成", "SUCCESS");

    }
    bodyDetailsModel.attachRequestCompleted(null, loadDeliveryQty)
    bodyDetailsXmlModel.attachRequestCompleted(null, expandQty2Model)



    /**
     * 处理表格
     */
    //隐藏ShipmentColumn
    sap.ui.getCore().byId('DeliveriesDetailPage--SHIPMENT').setVisible(false)
    //设置拣配进度宽度4rem
    sap.ui.getCore().byId("DeliveriesDetailPage--PICKED_HU").setWidth("4rem")
    //零件号加粗(使用Andon-DISPLAYNAME-label)
    var partNumberCol = sap.ui.getCore().byId("DeliveriesDetailPage--PART_NUMBER")
    partNumberCol.setTemplate(partNumberCol.getTemplate().addStyleClass("Andon-DISPLAYNAME-label"))
    //设置零件描述最大行数为2行
    var descColumn = sap.ui.getCore().byId("DeliveriesDetailPage--DESCRIPTION")
    descColumn.setTemplate(descColumn.getTemplate().setMaxLines(2))
    //更新外向交货单列的Template，只显示第一行信息。
    //当显示信息是空字符串时二维码将不显示！
    sap.ui.getCore().byId("DeliveriesDetailPage--OUTBOUNDDELIVERY").setTemplate(
        new sap.m.Label({
            text: {
                path: "bodyDetailsModel>OUTBOUNDDELIVERY",
                formatter: "local.customFormatter.formatNumericValue",
                design: sap.m.LabelDesign.Bold,
            },
            visible: {
                parts: [
                    { path: "bodyDetailsModel>LINE" }, // 当前行的 LINE 值
                    { path: "bodyDetailsModel>/Rowsets/Rowset/0/Row/0/LINE" } // 第一行的 LINE 值
                ],
                formatter: function(currentLine, firstLine) {
                    return currentLine === firstLine; // 只在当前行的 LINE 值与第一行一致时可见
                }
            },
            wrapping: true,
        })
    )

    //更新剩余HC数量为剩余拣配零件数量
    sap.ui.getCore().byId("DeliveriesDetailPage--REMAINING_HU").setTemplate(
        new sap.m.Label({
            text: {
                parts: [
                    { path: "bodyDetailsModel>QTY" },
                    { path: "bodyDetailsModel>QTY_PICKED" }
                ],
                formatter: function(targetQty, pickedQty) {
                    return targetQty - pickedQty;
                },
                design: sap.m.LabelDesign.Bold,
            },
            wrapping: true,
        })
    )

    // //更新进度条数据源为拣配零件数量
    // sap.ui.getCore().byId("DeliveriesDetailPage--PICKED_HU").setTemplate(
        // new sap.m.ProgressIndicator({
        //     percentValue: {
        //         parts: [
        //             { path: 'bodyDetailsModel>END_OF_PREP' },
        //             { path: 'bodyDetailsModel>QTY' },
        //             { path: 'bodyDetailsModel>QTY_PICKED' }
        //         ],
        //         formatter: function(date, a, b) {
        //             if (date != null && a != null && b != null) {
        //                 if (a != 0) {
        //                     if (date != "TimeUnavailable") {
        //                         var currentDate = new Date();

        //                         var m = date.slice(0, 2);
        //                         var d = date.slice(3, 5);
        //                         var y = date.slice(6, 10);
        //                         var h = date.slice(11, 13);
        //                         var min = date.slice(14, 16);
        //                         var s = date.slice(17, 19);

        //                         var dateD = new Date(y,m - 1,d,h,min,s);

        //                         var dateDiff = currentDate.getTime() - dateD.getTime();
        //                         if (b == 0 && dateDiff > 0) {
        //                             return 100;
        //                         } else {
        //                             return (b * 100) / a;
        //                         }
        //                     } else {
        //                         return (b * 100) / a;
        //                     }

        //                 } else {
        //                     return 0;
        //                 }
        //             }

        //         }
        //     },
        //     showValue: true,
        //     displayValue: {
        //         parts: [
        //             { path: 'bodyDetailsModel>QTY' },
        //             { path: 'bodyDetailsModel>QTY_PICKED' }
        //         ],
        //         formatter:function(a, b) {
        //             if (a != null && b != null) {
        //                 if (a != 0)
        //                     return Math.round(((b * 100) / a) * 10) / 10 + "%";
        //                 else
        //                     return "NA";
        //             }
        //         }
        //     },
        //     state: {
        //         parts: [
        //             { path: 'bodyDetailsModel>QTY' },
        //             { path: 'bodyDetailsModel>QTY_PICKED' },
        //             { path: 'bodyDetailsModel>END_OF_PREP' }
        //         ],
        //         formatter: function(a, b, eop) {
        //             var prc;
        //             if (a != null && b != null && eop != null) {
        //                 prc = (b * 100) / a;

        //                 if (prc == 100) {
        //                     return "Success";
        //                 } else if (prc != 0 && prc < 100 && eop != "TimeUnavailable") {
        //                     var currentDate = new Date();

        //                     var m = eop.slice(0, 2);
        //                     var d = eop.slice(3, 5);
        //                     var y = eop.slice(6, 10);
        //                     var h = eop.slice(11, 13);
        //                     var min = eop.slice(14, 16);
        //                     var s = eop.slice(17, 19);

        //                     var eopD = new Date(y,m - 1,d,h,min,s);

        //                     var diff = eopD.getTime() - currentDate.getTime();

        //                     if (diff >= 0) {
        //                         return "Warning";
        //                         //should be yellow
        //                     } else {
        //                         return "Error";
        //                         //should be red
        //                     }

        //                 } else if (prc != 0 && prc < 100) {
        //                     return "Warning";
        //                     // should be yellow
        //                 } else {
        //                     return "Error";
        //                 }
        //             }

        //         }
        //     }
        // })
    // )

    var headerTable = sap.ui.getCore().byId("DeliveriesDetailPage--DeliveryHeaderTable")
    var detailTable = sap.ui.getCore().byId("DeliveriesDetailPage--DeliveryDetailTable")
    //取消detailTable的cellclick
    detailTable.mEventRegistry.cellClick[0].fFunction = function (oEvent) { }
    //取消排序，筛选，翻译
    headerTable.getColumns().forEach(function (column) {
        if (translate[column.sId]) {
            column.getLabel().setText(translate[column.sId])        //翻译
        }
        column.setSortProperty(null)
        column.setFilterProperty(null)
    })
    //取消排序，筛选，翻译
    detailTable.getColumns().forEach(function (column) {
        if (translate[column.sId]) {
            column.getLabel().setText(translate[column.sId])        //翻译
        }
        column.setSortProperty(null)
        column.setFilterProperty(null)
    })
    //插入Sebango
    var segango = new sap.ui.table.Column({
        id: "OD_Seg",
        name: "OD_Seg",
        width: "4rem",
        hAlign: sap.ui.core.HorizontalAlign.Center,
        label: new sap.m.Label({
            text: "Sebango",
            design: sap.m.LabelDesign.Bold,
        }).addStyleClass("myLabel2"),

        template: new sap.m.Label({
            text: {
                path: "bodyDetailsModel>SEBANGO",
                formatter: "local.customFormatter.formatNumericValue",
                design: sap.m.LabelDesign.Bold,
            },
        }).addStyleClass("Andon-DISPLAYNAME-label")
    });
    //插入Quantity
    var quantity = new sap.ui.table.Column({
        id: "OD_Qty",
        name: "OD_Qty",
        width: "4rem",
        hAlign: sap.ui.core.HorizontalAlign.Center,
        label: new sap.m.Label({
            text: "零件个数",
            design: sap.m.LabelDesign.Bold,
        }).addStyleClass("myLabel2"),

        template: new sap.m.Label({
            text: {
                path: "bodyDetailsModel>QTY",
                formatter: "local.customFormatter.formatNumericValue",
                design: sap.m.LabelDesign.Bold,
            },
        }).addStyleClass("Andon-DISPLAYNAME-label")
    });
    detailTable.insertColumn(segango, 5)
    detailTable.insertColumn(quantity, 6)



    /**
     * 修改Header布局
    */
    setTimeout(() => {
        sap.ui.getCore().byId("headerDeliveriesDetailPage--flexBoxID").getItems()[0].getItems()[1].setHeight("auto")
        sap.ui.getCore().byId("headerDeliveriesDetailPage--textID").setWidth("30rem")
        sap.ui.getCore().byId("headerDeliveriesDetailPage--barID").setHeight("auto")
        // sap.ui.getCore().byId("headerDeliveriesDetailPage--barID").addStyleClass("sapUiLargeMarginTop")
    }, 1000);



    /**
     * 添加过账按钮
    */
    setTimeout(() => {
        var refresh = sap.ui.getCore().byId("headerDeliveriesDetailPage--REFRESH")
        refresh.oParent.insertItem(
            new sap.m.Button('headerDeliveriesDetailPage--POST_DELIVERY', {
                enabled: false,
                icon: 'sap-icon://collapse-group',
                type: sap.m.ButtonType.Emphasized,
                iconDensityAware: true,
                press: deliveryPostPress,
                text: "过账交货单",
            }).addStyleClass("rsizeStpBtn sapUiLargeTopBegin sapUiTinyMarginBegin"),
            2)
    }, 2000);



    /**
     * 处理交货单过账
    */
    var deliveryPostPress = function () {
        var oDialog = new sap.m.Dialog({
            title: "确认对话框",
            content: [
                new sap.m.Text({
                    text: "请确认是否过账外向交货单！"
                })
            ],
            buttons: [
                new sap.m.Button({
                    text: "确定",
                    type: sap.m.ButtonType.Emphasized,
                    press: function () {
                        updateinfo()
                        getshippt()
                        getASNFlag()
                        postdeliveryinfo()
                        oDialog.close();
                    }
                }),
                new sap.m.Button({
                    text: "取消",
                    type: sap.m.ButtonType.Reject,
                    press: function () {
                        oDialog.close();
                    }
                })
            ]
        });
        var shippt = ""
        var ASNflag = "undefined"
        // 打开对话框
        oDialog.open();
        var updateinfo = function () {
            var requestUrl = servername + "/Runner?Transaction=SHIPMENT/SHP_e/Transaction/MassSaveAdditionalData";
            var requestData = {
                "Plant": $Faurecia.miiUserData.plant,
                "ODNumberList": bodyDetailsModel.getProperty("/Rowsets/Rowset/0/Row/0/OUTBOUNDDELIVERY"),
                "trailer": "",
                "meansOfTransp": "0001",
                "noASN": "0",
                "noPostOnSAP": "0",
                "meansOfTranspLbl": "TRUCK",
                "CompleteBy": " ",
                "OutputParameter": "Result",
                "Content-Type": "text/xml"
            }
            jQuery.ajax({
                url: requestUrl,
                type: "GET",
                async: false,
                data: requestData,
                success:function (response) {
                    console.log(response)
                },
                error: function (xhr, status, error) {
                    console.error("updateinfo请求失败", status, error);
                }
            });
        }
        var postdeliveryinfo = function () {
            var oBusy = new sap.m.BusyDialog({
                text: "正在提交过账信息",
            })
            var requestUrl = servername + "/Runner?Transaction=SHIPMENT/SHP_e/Transaction/Mass_PrintDeliveryNote_And_SendtoSAP";
            var requestData = {
                "ODNumberList": bodyDetailsModel.getProperty("/Rowsets/Rowset/0/Row/0/OUTBOUNDDELIVERY"),
                "CustCode": headerDetailsModel.getProperty("/Rowsets/Rowset/0/Row/0/CUSTOMER_CODE"),
                "UserID": $Faurecia.miiUserData.IllumLoginName,
                "Plant": $Faurecia.miiUserData.plant,
                "workcenterId": $Faurecia.miiUserData.workcenter,
                "PrintOnly": "0",
                "ASNbyMII": ASNflag,
                "OutputParameter": "ResultMessage"
            };
            if(ASNflag != 'undefined'){
                _thisDTL.showMessageToast("工厂设置了ASNflag,过账方法未经测试，请TEAMS联系【TANG YANJI】测试处理","ERROR")
                return
            }
            if (!requestData.workcenterId) {
                _thisDTL.showMessageToast("登录用户工作中心不能是空，请检查账号是否正确！", "ERROR")
                return
            }
            jQuery.ajax({
                url: requestUrl,
                type: "GET",
                async: true,
                data: requestData,
                beforeSend: function () {
                    oBusy.open()
                },
                success: function (response) {
                    var json = $.xml2json(response)
                    message = json.Rowset.Row.ResultMessage
                    msgToBePrint(message, requestData.ASNbyMII)
                    oBusy.close()
                    _thisDTL.showMessageToast("外向交货单：" + requestData.ODNumberList + "过账信息提交成功！", "SUCCESS")
                    sap.ui.getCore().byId("mainPageView--MainApp").to("mainPageView--DeliveriesOverviewPage");
                    _thisOD.refreshOverview();
                },
                error: function (xhr, status, error) {
                    oBusy.close()
                    console.error("POST请求失败", status, error);
                    _thisDTL.showMessageToast("外向交货单：" + requestData.ODNumberList + "网络异常！无法提交信息！", "ERROR")
                }
            });
        }
        var getshippt = function () {
            var requestUrl = servername + "/Illuminator?QueryTemplate=SHIPMENT/SHP_e/Query/SELECT_OD_ADDITIONAL_DATA";
            var requestData = {
                "Param.1": bodyDetailsModel.getProperty("/Rowsets/Rowset/0/Row/0/OUTBOUNDDELIVERY"),
                "Content-Type": "text/json"
            }
            jQuery.ajax({
                url: requestUrl,
                type: "GET",
                async: false,
                data: requestData,
                success: function (response) {
                    shippt = response.Rowsets.Rowset[0].Row[0].SHIPPING_POINT
                    console.log(shippt)
                },
                error: function (xhr, status, error) {
                    console.error("shippt请求失败", status, error);
                }
            });
        }
        var getASNFlag = function () {
            var requestUrl = servername + "/Illuminator?QueryTemplate=SHIPMENT/SHP_e/Query/SELECT_FLAGS_FROM_CONFIG_ASN";
            var requestData = {
                "Param.1": headerDetailsModel.getProperty("/Rowsets/Rowset/0/Row/0/CUSTOMER_CODE"),
                "Param.2": shippt,
                "Content-Type": "text/xml"
            }
            jQuery.ajax({
                url: requestUrl,
                type: "GET",
                async: false,
                data: requestData,
                success: function (response) {
                    try {
                        ASNflag = response.getElementsByTagName("ASN_BY_MII")[0].firstChild.nodeValue;
                    } catch (e) {
                    }
                    console.log(ASNflag)
                },
                error: function (xhr, status, error) {
                    console.error("shippt请求失败", status, error);
                }
            });
        }
    }



    /**
     * 显示信息窗口
    */
    _thisDTL.showMessageToast = function (message, type) {
        sap.m.MessageToast.show(message, {
            duration: 5000,
            width: "40em"
        });
        var oMessageToastDOM = $('#sap-ui-static').parent().find('.sapMMessageToast');
        oMessageToastDOM.css('color', '#000000 ');
        switch (type) {
            case "SUCCESS":
                oMessageToastDOM.css('background-color', '#00DA00');
                break;
            case "WARNING":
                oMessageToastDOM.css('background-color', '#FFFF00');
                break;
            case "ERROR":
                oMessageToastDOM.css('background-color', '#FF0000');
                break;
            default:
                return;
        }
    }
}



/**
 * 插入onAfterRendering生命周期
*/
var script = document.createElement("script");
$.get('/XMII/CM/SC_COMPONENTS/DASHBOARD/E-SHIPPING/DeliveriesOverview.controller.js.irpt', function (data) {
    var modifiedData = data.replace(/sap.ui.controller\("DeliveriesOverview",\s*{/, 'sap.ui.controller("DeliveriesOverview",{\n\t\t\t onAfterRendering: OverViewController_injectFunction,');
    script.textContent = modifiedData;
    document.head.appendChild(script);
});



/**
 * 插入onAfterRendering生命周期
*/
var script2 = document.createElement("script")
$.get('/XMII/CM/SC_COMPONENTS/DASHBOARD/E-SHIPPING/DeliveriesDetails.controller.js.irpt', function (data) {
    script2.innerHTML = data.replace(/sap.ui.controller\("DeliveriesDetail",\s*{/, `sap.ui.controller("DeliveriesDetail",{\n\t\t\t onAfterRendering: DetailViewController_injectFunction,`);
    document.head.appendChild(script2);
})


msgToBePrint = function (mes, ASNflag) {
    var odNb = "";
    var errorMessagePrint = "";
    var errorMessageASN = "";
    var errorMessageSAP = "";
    var errMsg = "";
    var msgToBePrint = "";
    var nbPrintSuccess = 0;
    if (mes.search("/") != -1) { // Split Message by ODs
        try {
            ODs = mes.split("/");
            for (var i = 0; i < ODs.length; i++) {
                if (ODs[i] != "") {
                    // Split Message by Type
                    if (ODs[i].search(/kk+/) != -1) {
                        DelNoteResult = ODs[i].split("kk");
                        odNb = DelNoteResult[0]; //OD number
                        errorMessagePrint = DelNoteResult[1];
                        errorMessageASN = DelNoteResult[2];
                        errorMessageSAP = DelNoteResult[3];
                        if (errorMessagePrint != "---" && errorMessagePrint != "") {
                            switch (errorMessagePrint) {
                                case "WrongStatus":
                                    errMsg = odNb + ": " + "单据状态不正确，请检查外向交货单";
                                    break;
                                case "NoTemplate":
                                    errMsg = odNb + ": " + "没有模版";
                                    break;
                                case "NoPrinterFound":
                                    errMsg = odNb + ": " + "未找到打印机";
                                    break;
                                case "FusionError":
                                    errMsg = odNb + ": " + "交货单打印出错";
                                    break;
                                case "PrintSuccess":
                                    errMsg = odNb + ": " + "到货通知打印成功";
                                    nbPrintSuccess++;
                                    break;
                                default:
                                    errMsg = errorMessagePrint;
                            }
                        }
                        if (errorMessagePrint == "PrintSuccess") {
                            // Check on Error ASN
                            if (errorMessageASN != "PrintOnly" && errorMessageASN != "NotFirstTime") {
                                if (errorMessageASN == "ASN_ERROR") {
                                    errMsg += "-" + "发现ASN错误，请检查详细错误日志";
                                } else {
                                    if (errorMessageASN != "ALREADYSENT") {
                                        errMsg += "-" + "ASN_成功生成";
                                    }
                                }
                            }
                            // Check ON Message SAP
                            if (errorMessageSAP != "PrintOnly" && errorMessageSAP != "NotFirstTime") {
                                if (errorMessageSAP != "ALREADYSENT") {
                                    errMsg += "-" + "发运验证成功";

                                    if (errorMessageASN != "ASN_ERROR") {
                                        if (ASNflag == 1) {
                                            msgSuccess = "ASNSAP";
                                        } else {
                                            msgSuccess = "SAP";
                                        }
                                    }
                                }
                            } else {
                                if (errorMessageSAP != "ALREADYSENT") {
                                    errMsg += "-" + "发运验证成功";

                                    if (errorMessageASN != "ASN_ERROR") {
                                        msgSuccess = "true";
                                    }
                                }
                            }
                        }

                    }
                }
                msgToBePrint += errMsg.replace(new RegExp("(<br/>)", "g"), "\n") + "\n";
            }
            console.log(msgToBePrint)
            return msgToBePrint
        } catch (e) { }

    }
}