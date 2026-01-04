// ==UserScript==
// @name         淘宝工作辅助
// @namespace    http://tampermonkey.net/
// @version      20250416
// @description  在淘宝后台自动打开隐私信息，复制已售出的宝贝。根据价格分类显示不同和颜色，0库存红字显示，一键复制0库存颜色分类名称。淘宝详情页面颜色分类有图片的时候显示文字，并给子账号新增编辑按钮，快速复制当前选择的SKU信息。
// @author       kinrt
// @include      https://*.taobao.com/*
// @include      https://*.tmall.com/*
// @include      https://*.1688.com/*
// @include      https://*.cainiao.com/*
// @include      https://*.jinritemai.com/*
// @include      https://*.erp321.com/*
// @include      https://*.alicdn.com/*

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @connect      oapi.dingtalk.com
// @downloadURL https://update.greasyfork.org/scripts/439061/%E6%B7%98%E5%AE%9D%E5%B7%A5%E4%BD%9C%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/439061/%E6%B7%98%E5%AE%9D%E5%B7%A5%E4%BD%9C%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

// https://greasyfork.org/zh-CN/scripts/439061/versions/new

// 全局日志等级，默认为 10（debug）
let debugLevel = 20;

// 日志等级常量
const LOG_LEVELS = {
    DEBUG: 10,
    INFO: 20,
    WARN: 30,
    ERROR: 40,
    OFF: 100  // 关闭所有日志
};

// debug 函数
function debug(data, level = LOG_LEVELS.INFO) {
    // 如果当前日志等级高于传入的日志等级，则不打印
    if (level < debugLevel) {
        return;
    }

    // 获取当前时间戳（时分秒）
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // 根据日志等级设置日志前缀
    let logPrefix;
    switch (level) {
        case LOG_LEVELS.DEBUG:
            logPrefix = "DEBUG";
            break;
        case LOG_LEVELS.INFO:
            logPrefix = "INFO";
            break;
        case LOG_LEVELS.WARN:
            logPrefix = "WARN";
            break;
        case LOG_LEVELS.ERROR:
            logPrefix = "ERROR";
            break;
        default:
            logPrefix = "UNKNOWN";
    }

    // 格式化数据
    let formattedData;
    if (data === undefined) {
        formattedData = "No data provided.";
    } else if (typeof data === "object" && data !== null) {
        try {
            formattedData = JSON.stringify(data, null, 2);
        } catch (e) {
            formattedData = data.toString();
        }
    } else {
        formattedData = String(data);
    }

    // 打印日志
    console.groupCollapsed(`[${timestamp}] UserScript [${logPrefix}]`);
    console.trace(); // 打印调用栈
    console.log("Data:");
    console.log(formattedData);
    console.groupEnd();
}

var colorList = Array();
function getColor(index, num) {
    if (colorList.length == 0) {
        // var hex = new Array('33', '66', '99', 'cc');
        var hex = new Array('55', '99', 'DD');
        for (var i = 0; i < hex.length; i++) {
            for (var j = 0; j < hex.length; j++) {
                for (var k = 0; k < hex.length; k++) {
                    if (i != j || j != k || i != k) {
                        colorList.push(hex[j] + hex[k] + hex[i]);
                    }
                }
            }
        }
    }
    return "#" + colorList[parseInt(index / num * colorList.length)];
}

function sizeof(str) {
    var total = 0;
    var charCode, i, len;
    for (i = 0, len = str.length; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode <= 255) {
            total += 1;
        } else {
            total += 2;
        }
    }
    return total;
}

function toTable(data) {
    var dataStr = "<table>\n";
    for (var rowi = 0; rowi < data.length; rowi++) {
        dataStr += "<tr>\n  ";
        for (var coli = 0; coli < data[rowi].length; coli++) {
            var tmp = String(data[rowi][coli]).replace('"', '""');
            if (tmp.indexOf(",") >= 0 || tmp.indexOf('"') >= 0 || tmp.indexOf("\n") >= 0 || tmp.indexOf("\t") >= 0) {
                tmp = '"' + tmp + '"';
            }
            dataStr += "<td>" + tmp + "</td>";
        }
        dataStr += "</tr>\n";
    }
    dataStr += "</table>\n";
    return dataStr;
}

function insetrCopy(insetrCss, getData, displayText) {
    runCopy = function () {
        copyStr = getData();
        if (copyStr) {
            GM_setClipboard(copyStr);
            logPrint("复制成功");
        }
    }
    var html = '<button class="btn btn-info btn-sm">' + displayText + '</button>';
    insetrHtml(insetrCss, html, runCopy);
}

function insetrHtml(insetrCss, html, fun) {
    logPrint("插入到：" + insetrCss, 10);
    var kkHtml = document.createElement("kkHtml");
    kkHtml.innerHTML = html;
    if (fun != null) {
        kkHtml.addEventListener("click", fun);
    }
    var intervalId = setInterval(function () {
        if (insetrCss == "body") {
            var insetrNode = document.getElementsByTagName("body")[0];
        } else {
            var insetrNode = document.querySelector(insetrCss);
        }
        if (insetrNode != null) {
            insetrNode.appendChild(kkHtml);
            clearInterval(intervalId);
        }
    }, 1000)
}

function sendMsg(data) {
    var TextMsg = "{'msgtype': 'text','text': {'content': 'textMsg'}}";
    TextMsg = TextMsg.replace("textMsg", data);
    GM_xmlhttpRequest({
        method: "POST",
        url: globalUserData["url"],
        data: TextMsg,
        headers: {
            "Content-Type": "application/json ;charset=gbk "
        },
        onload: function (response) {
            debug(response.responseText, 20)
        }
    });
}

function logPrint(logStr, level = 20, autoClose = 3) {
    debug(logStr, level);
    if(level < debugLevel){
        return 0;
    }
    var div = document.getElementById("logPrint")
    if (div == null) {
        div = document.createElement("div");
        div.id = "logPrint";
        div.className = "container";
    } else {
        div.style.left = "50%";
    }
    if (level == 10) {
        div.className = "alert alert-success alert-dismissible";
    } else if (level == 20) {
        div.className = "alert alert-info alert-dismissible";
    } else if (level == 30) {
        div.className = "alert alert-warning alert-dismissible";
    } else if (level == 40) {
        div.className = "alert alert-danger alert-dismissible";
    } else {
        div.className = "alert alert-primary alert-dismissible";
    }
    div.innerHTML = '<button onclick="this.parentNode.remove()" type="button" class="close" data-dismiss="alert">&times;</button>' + logStr;
    document.body.append(div);
    div.style.left = (div.offsetLeft - div.offsetWidth / 2) + "px";
    if (autoClose) {
        setTimeout(function () { div.style = "top:100%; opacity:0; transition: all 0.3s;"; }, autoClose * 1000);
        setTimeout(function () { div.remove(); }, autoClose * 1000 + 300);
    }
}

function getSkuCode(skuName) {
    try {
        var skuCode = /[A-Z][1-9]{1}[0-9]{3,4}/.exec(skuName)[0];
    }
    catch (e) {
        skuCode = "";
    }
    return skuCode;
}

function getElementTop(el) {
    var actualTop = el.offsetTop;
    var current = el.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}

function publishPage() {
    // 延迟1000毫秒运行一次
    // 点击提交自动复制URL地址
    // 修改预览SKU图片尺寸
    // GM_addStyle("div.tm-sku-cell-text.has-img{overflow: hidden; height: 18px;}");
    GM_addStyle("div.next-dialog.next-overlay-inner.sell-o-sort-dialog{max-width: 1200px !important; width: 1200px !important;}");  // 排序窗口宽度
    GM_addStyle("div.sell-o-addon-content{width: 1200px !important;}");  // 颜色分类宽度
    GM_addStyle("span.sell-o-input.color-item-remark{width: 65px !important;}"); // 备注
    GM_addStyle("div.sell-sku-cell-newColorSelect.long-text{width: 150px !important;}"); //颜色分类名称
    GM_addStyle("div.sell-sku-cell-newColorSelect.has-img span{display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;text-overflow: ellipsis;}"); //SKU库存位置名称
    GM_addStyle("div#images-v2-media-popup-content{position: fixed !important; top: 20px !important; left: 20px !important;}")  // 固定更新SKU图片弹窗位置

    var css = {};
    css["商品销售规格"] = "table.sell-sku-inner-table-new.sell-sku-body-table tr";
    css["商品销售规格标题栏"] = "div.sell-sku-thead.sell-sku-div-head > div.sell-sku-head-cell";
    css["原先的商品销售规格"] = "#struct-oldsku tbody tr";
    css["原先的商品销售规格标题栏"] = "#struct-oldsku thead th";
    css["商品销售规格模块"] = "#struct-sku div.ver-scroll-wrap";
    css["排序对象"] = "div.sort-area span.sell-sort-item";
    css["颜色分类"] = "ul.sell-color-item-container li.has-upload-img > div.sell-color-item-wrap";
    css["颜色分类SKU名称"] = "div.input-with-warning input";
    css["提交按钮"] = "button[_id=button-submit]";
    var skuDict = {};
    var interval = 200;
    var publish = new Object();
    var skuitems = document.querySelectorAll(css["颜色分类"]);
    var skuItemHeight = document.querySelector(css["商品销售规格"]).offsetHeight * skuitems.length;
    var sale = 1;
    publish.load = function () {
        // 加载SKU，调整商品销售规格显示尺寸
        if (document.querySelector(css["原先的商品销售规格"]) == null) {
            logPrint("找不到原先的商品销售规格，停止自动加载SKU。");
            return;
        }
        var skuNode = document.querySelector(css["商品销售规格模块"]);
        var addHeight = skuNode.offsetHeight;
        if (skuNode != null) {
            skuDict["原先的商品销售规格"] = {};
            getOldData();
            skuDict["商品销售规格"] = {};
            skuDict["查找SKU"] = {};
            skuNode.scrollTo(0, 0)
            var intervalIdScroll = scrollSKU();
            // X秒钟加载不完成，停止等待
            setTimeout(function () {
                var skuNode = document.querySelector(css["商品销售规格模块"]);
                var skuNum = Object.keys(skuDict["商品销售规格"]).length;
                if (skuNum < skuitems.length) {
                    logPrint("加载SKU出现错误，将自动刷新。", 40);
                    location.reload();
                }
                else {
                    logPrint("加载所有SKU成功。");
                    clearInterval(intervalIdScroll);
                    var top = getElementTop(skuitems[0]) - 100;
                    window.scrollTo(0, top);
                    var html = '<button id="submitSKU" type="button" class="next-btn next-large next-btn-primary"><span class="next-btn-helper">检查并提交</span></button>'
                    insetrHtml("#struct-buttons", html, submitSKU);
                    publish.getDat0SKU();
                    setInterval(function () {
                        getData();
                        setData();
                    }, interval * 3);
                }
            }, skuItemHeight / addHeight * interval * 3);
        }
    }

    function scrollSKU() {
        var skuNode = document.querySelector(css["商品销售规格模块"]);
        var skuitems = document.querySelectorAll(css["颜色分类"]);
        var addHeight = skuNode.offsetHeight;
        skuNode.scrollTo(0, 0)
        logPrint("自动滚动加载商品销售规格数据");
        var intervalId = setInterval(function () {
            window.scrollTo(0, getElementTop(skuNode) - 100);
            getData();
            var skuNum = Object.keys(skuDict["商品销售规格"]).length;
            logPrint("自动滚动加载SKU数量：" + skuNum);
            if (skuNum < skuitems.length) {
                // 下拉滚动
                skuNode.scrollTo(0, skuNode.scrollTop + addHeight);
            } else {
                if (skuNode.scrollTop > 10) {
                    // 上拉滚动
                    skuNode.scrollTo(0, skuNode.scrollTop - addHeight * 3);
                }
            }
            // 如果加载过程错误，自动刷新页面
        }, interval);
        return intervalId;
    }

    function submitSKU() {
        skuDict["商品销售规格"] = {};
        var skuNode = document.querySelector(css["商品销售规格模块"]);
        var addHeight = skuNode.offsetHeight;
        skuNode.scrollTo(0, 0)
        var intervalId = scrollSKU();
        // X秒钟加载不完成，停止等待
        setTimeout(function () {
            clearInterval(intervalId);
            if (comparedSKU()) {
                var submitObj = document.querySelector(css["提交按钮"]);
                submitObj.addEventListener("click", copyURL);
                submitObj.click();
            }
        }, skuItemHeight / addHeight * interval * 3);

    }

    // 提交时，统计SKU修改情况
    function comparedSKU() {
        var delSKU = "删除：\n";
        for (var skuName in skuDict["原先的商品销售规格"]) {
            if (!skuDict["商品销售规格"].hasOwnProperty(skuName)) {
                delSKU += skuName + ", " + skuDict["原先的商品销售规格"][skuName]["库存"] + ", " + skuDict["原先的商品销售规格"][skuName]["价格"] + "\n"
            }
        }
        var addSKU = "新增：\n";
        var numSKU = "修改库存：\n";
        var addSKU0 = "\n以下新增SKU库存为0，请注意！\n";
        var addSKUImg = "\n以下新增SKU疑似未替换图片，请注意！\n";
        for (var skuName in skuDict["商品销售规格"]) {
            if (!skuDict["原先的商品销售规格"].hasOwnProperty(skuName)) {
                addSKU += skuName + ", " + skuDict["商品销售规格"][skuName]["库存"] + ", " + skuDict["商品销售规格"][skuName]["价格"] + "\n"
                // 是否加库存
                if (skuDict["商品销售规格"][skuName]["库存"] == 0) addSKU0 += skuName + "\n";
                // 是否替换图片
                if (!skuDict["上传图片"].hasOwnProperty(getSkuCode(skuName))) addSKUImg += skuName + "\n";
            } else {
                if (skuDict["商品销售规格"][skuName]["库存"] != skuDict["原先的商品销售规格"][skuName]["库存"]) {
                    numSKU += skuName + ", " + skuDict["原先的商品销售规格"][skuName]["库存"] + ">>" + skuDict["商品销售规格"][skuName]["库存"] + "\n"
                }
            }
        }
        var itemID = window.location.href.match(/(?<=id=)\d{11,13}/);
        var data = globalUserData["user"] + "修改商品：https://detail.tmall.com/item.htm?id=" + itemID + "\n"
        if (delSKU != "删除：\n") data += delSKU;
        if (addSKU != "新增：\n") data += addSKU;
        if (numSKU != "修改库存：\n") data += numSKU;
        if (addSKU0 != "\n以下新增SKU库存为0，请注意！\n") {
            var skuitems = document.querySelectorAll(css["商品销售规格"]);
            [name, pic, num] = getColIndex(css["商品销售规格标题栏"]);
            if (skuitems[0].childNodes[num].querySelector("input").getAttribute("disabled") != "") {
                var r = confirm(addSKU0);
                if (r == false) {
                    logPrint("提交操作被取消");
                    return false;
                }
            }
            data += addSKU0;
        }
        if (addSKUImg != "\n以下新增SKU疑似未替换图片，请注意！\n") {
            var r = confirm(addSKUImg);
            if (r == false) {
                logPrint("提交操作被取消");
                return false;
            }
            data += addSKUImg;
        }
        sendMsg(data);
        return true;
    }

    function copyURL() {
        debug("copyURL");
        var copyStr = window.location.href;
        GM_setClipboard(copyStr);
    }

    function updateImg() {
        // 自动复制商品编码，点击上传图片替换按钮
        var upImg = this.parentNode.parentNode.parentNode.querySelector("div.sell-color-option-image-upload div.image-empty");
        if (upImg != null) {
            upImg.click();
        } else {
            var intervalId = setInterval(function () {
                var upImg = document.querySelector("ul.sell-component-image-v2-media-operator > li:nth-child(1) span > div");
                if (upImg != null) {
                    upImg.click();
                    clearInterval(intervalId);
                }
            }, interval);
            setTimeout(function () {
                clearInterval(intervalId);
            }, 3000);
        }
        sku = getSkuCode(window.getSelection().toString());
        if (sku != "") {
            logPrint("上传：" + sku, 20, 5);
            skuDict["上传图片"][sku] = 1;
        }
    }

    // 获取SKU价格数量所在列位置
    function getColIndex(nodeObj) {
        var skuHead = document.querySelectorAll(nodeObj);
        for (var i = 0; i < skuHead.length; i++) {
            var text = skuHead[i].innerText;
            if (text.indexOf("颜色分类") != -1) {
                var name = i;
            } else if (text.indexOf("价格") != -1) {
                var pic = i;
            } else if (text.indexOf("数量") != -1) {
                var num = i;
                break;
            }
        }
        return ([name, pic, num])
    }

    function getOldData() {
        // 统计原先SKU的价格和库存
        var skuitemsOld = document.querySelectorAll(css["原先的商品销售规格"]);
        [name, pic, num] = getColIndex(css["原先的商品销售规格标题栏"]);
        for (var i = 0; i < skuitemsOld.length; i++) {
            var td = skuitemsOld[i].childNodes;
            var skuPic = parseInt(td[pic].innerText) + ""
            if (skuPic.charAt(skuPic.length - 1) != "9") {
                sale = 0.7;
                break;
            }
        }
        for (var i = 0; i < skuitemsOld.length; i++) {
            var td = skuitemsOld[i].childNodes;
            var skuName = td[name].innerText;
            var skuPic = parseInt(parseInt(td[pic].innerText) * sale)
            skuDict["原先的商品销售规格"][skuName] = { "价格": skuPic, "库存": parseInt(td[num].innerText) };
        }
    }
    function getData() {
        var skuitems = document.querySelectorAll(css["商品销售规格"]);
        [name, pic, num] = getColIndex(css["商品销售规格标题栏"]);
        for (var i = 0; i < skuitems.length; i++) {
            var td = skuitems[i].childNodes;
            var skuName = td[name].querySelector("span").getAttribute("title")
            var skuPic = parseInt(parseInt(td[pic].querySelector("input").value) * sale)
            skuDict["商品销售规格"][skuName] = { "价格": skuPic, "库存": parseInt(td[num].querySelector("input").value) };
            if (!skuDict["原先的商品销售规格"].hasOwnProperty(skuName)) {
                td[1].style.cssText = td[1].style.cssText + " background-color: #d1ecf1;";
            }
            try {
                if (td[num].querySelector("input").value == "0") {
                    td[num].querySelector("input").style.cssText = stylewarn;
                }
                else {
                    td[num].querySelector("input").style.cssText = "color:inherit";
                }
            }
            catch (e) {
                if (td[num].innerText == "0") {
                    td[num].style.cssText = stylewarn;
                }
                else {
                    td[num].style.cssText = "color:inherit";
                }
            }
        }
    }

    publish.getDat0SKU = function () {
        // 整理0库存sku数据
        var skuList = [];
        for (skuName in skuDict["商品销售规格"]) {
            if (skuDict["商品销售规格"][skuName]["库存"] == "0") {
                skuList.push([getSkuCode(skuName)]);
            }
        }
        GM_setClipboard(toTable(skuList));
        logPrint("复制成功");
    }

    publish.getDat01SKU = function () {
        // 将01库存数据转为表格
        var skuList = [];
        for (skuName in skuDict["商品销售规格"]) {
            if (skuDict["商品销售规格"][skuName]["库存"] == "0" || skuDict["商品销售规格"][skuName]["库存"] == "1") {
                skuList.push([getSkuCode(skuName)]);
            }
        }
        GM_setClipboard(toTable(skuList));
        logPrint("复制成功");
    }

    publish.findSKU = function () {
        // 查找SKU
        var person = prompt("请输入多个SKU");
        skuDict["查找SKU"] = {};
        if (person != null && person != "") {
            var regex = /[A-Z]{0,1}[0-9]{5}/g;
            while ((skuCode = regex.exec(person)) !== null) {
                skuDict["查找SKU"][skuCode[0]] = 1;
            }
        }
    }

    function setData() {
        // 统计SKU价格分组
        groupsDict = [];
        for (skuName in skuDict["商品销售规格"]) {
            var groups = skuDict["商品销售规格"][skuName]["价格"];
            skuDict["商品销售规格"][skuName]["分组"] = groups;
            if (groups in groupsDict) {
                groupsDict[groups] += 1;
            } else {
                groupsDict[groups] = 1;
            }
        }
        var groupsArr = Object.keys(groupsDict).sort();
        // 给颜色分类加入价格和库存 给替换图片添加自动点击动作
        skuDict["上传图片"] = {};
        skuitems = document.querySelectorAll(css["颜色分类"]);
        for (i = 0; i < skuitems.length; i++) {
            try {
                var skuName = skuitems[i].querySelector(css["颜色分类SKU名称"]).value;
                var skuCode = getSkuCode(skuName);
                var inputNode = skuitems[i].querySelector("span.next-input");
                if (skuName in skuDict["商品销售规格"]) {
                    // 如果已经统计到了库存和价格，显示到颜色分类中
                    var color = getColor(groupsArr.indexOf(skuDict["商品销售规格"][skuName]["分组"] + ""), groupsArr.length);
                    inputNode.style.cssText = "border: 3px solid " + color + "; ";
                    if (skuitems[i].querySelector("userScriptData") == null) {
                        var userScriptData = document.createElement("userScriptData");
                        userScriptData.style.cssText = "width: 75px;";
                        skuitems[i].appendChild(userScriptData)
                    }
                    skuitems[i].querySelector("userScriptData").innerHTML = "&nbsp;&nbsp;&nbsp; ￥" + skuDict["商品销售规格"][skuName]["价格"] + "  " + skuDict["商品销售规格"][skuName]["库存"];
                    if (skuDict["商品销售规格"][skuName]["库存"] == "0") {
                        skuitems[i].querySelector("userScriptData").style.cssText = "width: 75px; " + stylewarn;
                    } else {
                        skuitems[i].querySelector("userScriptData").style.cssText = "width: 75px;";
                    }
                }
                if (skuCode in skuDict["查找SKU"]) {
                    // 如果是查找的SKU，显示红色背景
                    inputNode.style.cssText = inputNode.style.cssText + " background-color: #ffc107;";
                }
                if (!skuDict["原先的商品销售规格"].hasOwnProperty(skuName)) {
                    inputNode.style.cssText = inputNode.style.cssText + " background-color: #d1ecf1;";
                }
            }
            catch (err) { i }
            var input = skuitems[i].querySelector("div.input-with-warning.color-sub-items input");
            skuCode = getSkuCode(input.value);
            if (!skuDict["上传图片"].hasOwnProperty(skuCode)) {
                skuDict["上传图片"][skuCode] = 0;
                input.ondblclick = updateImg;
                input.addEventListener("change", updateImg);
            }
        }
        // 给排序信息加入价格和库存
        skuitems = document.querySelectorAll(css["排序对象"]);
        for (i = 0; i < skuitems.length; i++) {
            var skuName = skuitems[i].innerText;
            if (skuName in skuDict["商品销售规格"]) {
                var color = getColor(groupsArr.indexOf(skuDict["商品销售规格"][skuName]["分组"] + ""), groupsArr.length);
                skuitems[i].style.cssText = "border: 3px solid " + color + "; ";
                if (!skuDict["原先的商品销售规格"].hasOwnProperty(skuName)) {
                    skuitems[i].style.cssText = skuitems[i].style.cssText + " background-color: #d1ecf1;";
                }
                skuitems[i].innerText = skuName + " ￥" + skuDict["商品销售规格"][skuName]["价格"] + "  " + skuDict["商品销售规格"][skuName]["库存"];
                if (skuDict["商品销售规格"][skuName]["库存"] == "0") {
                    skuitems[i].style.cssText += "color: red; ";
                }
            }
        }
    }
    publish.load();
    return (publish);
}

function sellItemsPage() {
    // 新出售中的宝贝
    var css = {};
    css["出售中宝贝"] = "tr.next-table-row.row-with-config-list"
    css["宝贝ID"] = "div.sell-manage-component-desc span.product-desc-span:nth-child(2)"
    css["编码"] = "div.sell-manage-component-desc span.product-desc-span:nth-child(3)"
    css["图片"] = "div.sell-manage-component-desc img.product-desc-extend-image"
    css["创建时间"] = "td[label=创建时间] div.product-desc-span:nth-child(1)"
    css["图标"] = "div.sell-manage-component-desc div.mc-tag-list-wrap"
    // 添加查看数据链接
    var intervalId = setInterval(function () {
        try {
            if (document.querySelector(css["图标"]).innerHTML.indexOf("SYCM") < 0) {
                var item = document.querySelectorAll(css["出售中宝贝"]);
                var itemDict = {};
                for (i = 0; i < item.length; i++) {
                    var itemID = item[i].querySelector(css["宝贝ID"]).innerText.slice(3, 18);
                    var image = item[i].querySelector(css["图片"]);
                    var code = item[i].querySelector(css["编码"]);
                    var time = item[i].querySelector(css["创建时间"]);
                    var itemIco = item[i].querySelector(css["图标"]);
                    itemDict[itemID] = {};
                    itemDict[itemID]["ID"] = itemID
                    try {
                        itemDict[itemID]["编码"] = code.innerText.slice(3, 18);
                    }
                    catch {
                        itemDict[itemID]["编码"] =  "";
                    }
                    itemDict[itemID]["图片"] = "https:" + image.getAttribute("src").split(".jpg")[0] + ".jpg";
                    itemDict[itemID]["时间"] = time.innerText.replace(/-/g, "/",).replace(/ \S+/, "");
                    var dmp = "&nbsp;&nbsp;<a target='_blank' class='table-hover-show' href='https://dmp.taobao.com/index_new.html?#!/items/overview/item/cold-boot?period=7&itemId=" + itemID + "'>DMP</a>";
                    var sycm = "&nbsp;&nbsp;<a target='_blank' class='table-hover-show' href='https://sycm.taobao.com/cc/item_archives?activeKey=sale&dateType=recent7&itemId=" + itemID + "'>SYCM</a>";
                    var sousuo = "&nbsp;&nbsp;<a target='_blank' class='table-hover-show' href='https://sycm.taobao.com/flow/monitor/itemsourcedetail?belong=all&childPageType=se_keyword&dateType=recent30&device=2&jumpCalcModel=holoTree&pPageId=30&pageId=23.s1150&pageLevel=2&pageName=%E6%89%8B%E6%B7%98%E6%90%9C%E7%B4%A2&itemId=" + itemID + "'>搜索来源</a>";
                    var copyStr = "&nbsp;&nbsp;<a class='copyStr table-hover-show' href='javascript:void(0);' itemID='" + itemID + "'>复制</a>";
                    itemIco.innerHTML = itemIco.innerHTML + sycm + sousuo + dmp + copyStr;
                    itemIco.querySelector("a.copyStr").addEventListener("click", function(event) {
                        const target = event.target;
                        itemID = target.getAttribute("itemID");
                        data = itemDict[itemID]["ID"] + "\t" +itemDict[itemID]["时间"] + "\t" +itemDict[itemID]["编码"] + "\t" +itemDict[itemID]["图片"]
                        GM_setClipboard(data);
                        logPrint("复制成功:" + data);
                    });

                }
            }
        } catch {
            ;
        }
    }, 500);
}

function inventoryEdit() {
    // 出售中修改库存
    var css = {};
    css["商品ID"] = "div.inventory-item-info div.info-item span.info-detail > span"
    css["编辑库存或价格标题"] = "div.inventory-drawer-header > div.title"
    css["编辑库存或价格商品名称"] = "div.content > div.title"
    css["编辑库存或价格"] = "div#inventory-manage-fluid-layout-wrap div.next-table-body tr"
    css["标题栏"] = "div#inventory-manage-fluid-layout-wrap div.next-table-header-inner th"
    css["编辑库存或价格提交按钮"] = "div.inventory-editor-drawer-footer.position-fixed button:nth-child(1)"
    css["编辑库存或价格取消按钮"] = "div.inventory-editor-drawer-footer.position-fixed button:nth-child(2)"
    css["编辑库存或价格关闭按钮"] = "div.inventory-drawer-header i.next-icon.next-medium"

    // 延迟清除数据，防止关闭前获取到旧数据。
    function cancelF() {
        debug("关闭");
        skuDict = {};
        allSKU = [];
        document.querySelector(css["编辑库存或价格取消按钮"]).click();
    }
    function submitF() {
        debug("提交");
        document.querySelector(css["编辑库存或价格标题"]).click();
        var title = document.querySelector(css["编辑库存或价格标题"]).innerText;
        var itemId = document.querySelector(css["商品ID"]).innerText;
        logPrint(title + " " + itemId);
        getSkuDate();
        var editSKU = "";
        for (skuName in skuDict) {
            if (skuDict[skuName]["库存增减数量"] != "") {
                editSKU += skuName + "：" + skuDict[skuName]["库存增减"] + skuDict[skuName]["库存增减数量"] + ">>" + skuDict[skuName]["改后可售库存"] + "\n"
            }
        }
        if (editSKU != "") {
            var data = globalUserData["user"] + title + "：https://detail.tmall.com/item.htm?id=" + itemId + "\n" + editSKU;
            debug(data);
            sendMsg(data);
        }
        setTimeout(cancelF, 2000);
    }
    var skuDict = {};
    var allSKU = [];
    function getSkuDate() {
        // 多次运行，第一次获取到值后不重复运行
        var header = document.querySelectorAll(css["标题栏"]);
        var headerDict = {};
        for (i = 0; i < header.length; i++) {
            headerDict[header[i].innerText] = i
        }
        var allSKU = document.querySelectorAll(css["编辑库存或价格"]);
        if (allSKU.length > 0) {
            try {
                for (i = 0; i < allSKU.length; i++) {
                    tds = allSKU[i].querySelectorAll("td");
                    var skuName = tds[headerDict["sku名称"]].querySelector("span.sku-name").innerText;
                    logPrint("读取：" + skuName, 10)
                    skuDict[skuName] = {};
                    skuDict[skuName]["库存增减"] = tds[headerDict["库存增减"]].querySelector("div.checked-button").innerText;
                    skuDict[skuName]["库存增减数量"] = tds[headerDict["库存增减"]].querySelector("input").value;
                    skuDict[skuName]["预扣库存"] = tds[headerDict["预扣库存"]].innerText;
                    skuDict[skuName]["总库存"] = tds[headerDict["sku名称"]].querySelector("div.total-quantity").innerText.replace("总可售库存: ", "");
                    var skuObj = tds[headerDict["改后可售库存"]].querySelector("input");
                    skuDict[skuName]["改后可售库存"] = skuObj.value;
                    if (skuDict[skuName]["总库存"] == "0" && skuDict[skuName]["预扣库存"] == "0") {
                        skuObj.style.cssText = stylewarn;
                    }
                }
                document.querySelector(css["编辑库存或价格提交按钮"]).addEventListener("click", submitF);
                document.querySelector(css["编辑库存或价格取消按钮"]).addEventListener("click", cancelF);
                document.querySelector(css["编辑库存或价格关闭按钮"]).addEventListener("click", cancelF);
            }
            catch (e) {
                ;
            }
        }
    }
    setInterval(getSkuDate, 300);
}

function sycmPage() {
    var countElement;
    setInterval(function () {
        if (document.querySelector("div.op-cc-item-title-analyse-area") != null) {
            if (document.querySelector("div.op-cc-item-title-analyse-area > count") == null) {
                countElement = document.createElement("count");
                document.querySelector("div.op-cc-item-title-analyse-area").appendChild(countElement);
                countElement.style.cssText = "display: block;float: right;padding: 3px;"
                countElement.title = "当前标题字符长度"
            }
            var title = document.querySelector("div.op-cc-item-title-analyse-area > div.ui-sortable").innerText.replace(/\n/g, "");
            var titleCount = sizeof(title);
            countElement.innerHTML = titleCount;
            if (titleCount > 60) {
                countElement.style.background = "#f99"
            } else {
                countElement.style.background = "#9f9"
            }
        }

    }, 200);
}

function getDataTrade() {
    // 新已卖出的宝贝
    var css = {};
    css["订单"] = "table.next-table-row";
    css["订单号"] = "div[class*=sold_table-header-box]";
    css["创建时间"] = "span[class*=sold_create-time]";
    css["买家账号"] = "span[class*=sold_ww-box]";
    css["商品"] = "tr~tr";
    css["颜色分类"] = "div[class*=sold_sku-desc]";
    css["商家编码"] = "div[class*=sold_extra-desc]";
    css["商品状态"] = "td:nth-child(4) div";
    css["订单状态"] = "div[class*=sold_status-item-box] div";
    var data = [];
    var orders = document.querySelectorAll(css["订单"]);
    for (var i = 0; i < orders.length; i++) {
        var tradeDict = {};
        tradeDict["订单状态"] = orders[i].querySelector(css["订单状态"]).innerText;
        // if(tradeDict["订单状态"] == "等待买家付款") continue;
        tradeDict["订单号"] = orders[i].querySelector(css["订单号"]).innerText.match(/订单号：\d{18,21}/);
        tradeDict["创建时间"] = orders[i].querySelector(css["创建时间"]).innerText;
        tradeDict["买家账号"] = orders[i].querySelector(css["买家账号"]).innerText;
        tradeDict["创建时间"] = tradeDict["创建时间"].replace("创建时间：", "");
        tradeDict["订单状态"] = tradeDict["订单状态"].replace("\n补发货", "")
        tradeDict["订单号"] += " " + tradeDict["订单状态"];
        if (tradeDict["订单状态"] == "买家已付款" || tradeDict["订单状态"] == "卖家已发货" || tradeDict["订单状态"] == "交易成功") {
            tradeDict["订单状态"] = "售出";
        } else {
            tradeDict["订单状态"] = "_其他";
        }
        // 一个订单，多个商品，多个SKU
        var items = orders[i].querySelectorAll(css["商品"]);
        for (var ii = 0; ii < items.length; ii++) {
            if (items[ii].querySelector(css["商品状态"]).innerText == "退款成功") {
                tradeDict["订单号和商品状态"] = tradeDict["订单号"] + " 退款成功";
                tradeDict["商品状态"] = "_其他";
            } else {
                tradeDict["订单号和商品状态"] = tradeDict["订单号"];
                tradeDict["商品状态"] = tradeDict["订单状态"];
            }
            try {
                tradeDict["颜色分类"] = items[ii].querySelector(css["颜色分类"]).innerText;
            }
            catch (e) {
                tradeDict["颜色分类"] = "";
            }
            try {
                tradeDict["商家编码"] = items[ii].querySelector(css["商家编码"]).innerText;
            }
            catch (e) {
                tradeDict["商家编码"] = "";
            }
            if (tradeDict["颜色分类"].indexOf("联系客服") !== -1) {
                tradeDict["商品编码"] = "联系客服 确定编号"
            } else {
                tradeDict["商品编码"] = getSkuCode(tradeDict["颜色分类"] + tradeDict["商家编码"]);
            }
            if (tradeDict["商品编码"] != "") {
                data.unshift([tradeDict["商品编码"], tradeDict["创建时间"], tradeDict["商品状态"], tradeDict["订单号和商品状态"]]);
            }
        }
    }
    GM_setClipboard(toTable(data));
    logPrint("复制成功");
};

function getDYorder() {
    // 获取抖店订单管理数据
    var css = {};
    css["tr"] = "div.auxo-table-content tr.auxo-table-row"
    css["订单号"] = "span[class*=index_text__]:nth-child(1)";
    css["下单时间"] = "span[class*=index_text__]:nth-child(2)";

    css["买家账号"] = "span[class*=sold_ww-box]";
    css["商品"] = "div[class*=style_productItem]";
    css["属性"] = "div[class*=style_property__";
    css["商品状态"] = "td:nth-child(7) div";
    css["商家备注"] = "div[class*=index_content__]";
    css["订单状态"] = "td:nth-child(7) div";
    var oldOrders = ""
    var data = [];
    var tradeDict = {};
    var tr = document.querySelectorAll(css["tr"]);
    for (var i = 0; i < tr.length; i++) {
        var data_row_key = tr[i].getAttribute("data-row-key");
        if (data_row_key.includes("child")) {
            // 这是子订单
            if (tr[i].querySelector(css["订单状态"]) != null) {
                tradeDict["订单状态"] = tr[i].querySelector(css["订单状态"]).innerText;
                if (tradeDict["订单状态"] == "待发货" || tradeDict["订单状态"] == "卖家已发货" || tradeDict["订单状态"] == "交易成功") {
                    tradeDict["订单状态"] = "售出";
                } else {
                    tradeDict["订单状态"] = "_其他";
                }
            }
            try {
                var property = tr[i].querySelectorAll(css["属性"]);
                tradeDict["颜色分类"] = "";
                for (var pi = 0; pi < property.length; pi++) {
                    tradeDict["颜色分类"] += property[pi].innerText;
                }
                tradeDict["商品编码"] = getSkuCode(tradeDict["颜色分类"]);
            }
            catch (e) {
                tradeDict["商家编码"] = "";
            }
            if (tradeDict["商品编码"] != "") {
                data.unshift([tradeDict["商品编码"], tradeDict["下单时间"], tradeDict["订单状态"], "DYD" + tradeDict["订单号"]]);
            }
        } else {
            tradeDict["订单号"] = data_row_key;
            if (oldOrders == tradeDict["订单号"]) {
                // 这是备注部分
                tradeDict["商家备注"] = tr[i].querySelector(css["商家备注"]).innerText;
            } else {
                // 这是订单号部分
                var tradeDict = {};  // 初始化订单数据
                tradeDict["订单号"] = tr[i].getAttribute("data-row-key");
                tradeDict["下单时间"] = tr[i].querySelector(css["下单时间"]).innerText;
                tradeDict["下单时间"] = tradeDict["下单时间"].replace("下单时间 ", "");
                oldOrders = tradeDict["订单号"];
            }
        }
    }
    GM_setClipboard(toTable(data));
    logPrint("复制成功");
};

// 查找父元素
function findParentElementWithClass(element, targetClass) {
    while (element && element !== document) {
        if (element.classList && element.classList.contains(targetClass)) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
}

// 查找父元素
function findFirstChildElement(element) {
    while (element && element !== document) {
        var firstChildElement = element.firstElementChild;
        if (firstChildElement) {
            element = firstChildElement;
        } else {
            return element;
        }
    }
    return null;
}

function getERP321() {
    // 采购单
    var css = {};
    css["标题栏"] = "div#_jt_row_head_list div._jt_cell_head";
    css["选择的数据"] = "div#_jt_body_list div._jt_row_current div._jt_ch";
    // 监听鼠标点击事件
    document.addEventListener('click', function(event) {
        const target = event.target;
        const current = findParentElementWithClass(target, '_jt_row_current');
        // 检查点击的元素是否是可以读取的数据
        if (current != null) {
            var itemDict = {};
            var item = document.querySelectorAll(css["选择的数据"]);
            var header = document.querySelectorAll(css["标题栏"]);
            for (var i = 0; i < header.length; i++) {
                headStr = header[i].textContent;
                var firstChildElement = findFirstChildElement(item[i]);
                var tagName = firstChildElement.tagName;
                if (tagName == "IMG") {
                    itemDict[headStr] = firstChildElement.getAttribute("src");
                    itemDict[headStr] = itemDict[headStr].split(".jpg")[0] + ".jpg"
                }
                else if (tagName == "INPUT") {
                    itemDict[headStr] = firstChildElement.value;
                }else{
                    itemDict[headStr] = firstChildElement.textContent;
                }
            }
            if(itemDict.hasOwnProperty("采购单号")){
                // 没有数据就初始化
                if(itemDict["状态"] == "待审核"){
                    // 没有数据就初始化
                    logPrint("选择采购单：" + itemDict["采购单号"] + " 待审核！", 40);
                }else{
                    logPrint("选择采购单：" + itemDict["采购单号"]);
                }
            }else{
                if(itemDict["颜色及规格"].includes(itemDict["商品编码"]) == false){
                    // 没有商品编码的添加
                    itemDict["颜色及规格"] = itemDict["商品编码"] + " " + itemDict["颜色及规格"]
                    logPrint("复制数据：" + itemDict["颜色及规格"] + "——颜色及规格不含商品编码：" + itemDict["商品编码"] + " 建议修改。", 30, 8);
                }else{
                    logPrint("复制数据：" + itemDict["颜色及规格"]);
                }
            }
            setGlobalUserData("ERP321Data", itemDict, 1)
            // logPrint(JSON.stringify(itemDict, null, 2));
            GM_setClipboard(JSON.stringify(getGlobalUserData()["ERP321Data"], null, 2));
        }
    });
};

function getERP321ShangPin() {
    // 商品库存
    var css = {};
    css["标题栏"] = "div.art-loading-wrapper div.art-table-header th";
    css["选择的数据"] = "div.art-loading-wrapper div.art-table-body tr.art-table-row.highlight > td";
    // 监听鼠标点击事件
    document.addEventListener('click', function(event) {
        const target = event.target;
        const highlight = findParentElementWithClass(target, 'highlight');
        // 检查点击的元素是否是商家编码输入框
        if (highlight != null) {
            var itemDict = {};
            var item = document.querySelectorAll(css["选择的数据"]);
            var header = document.querySelectorAll(css["标题栏"]);
            for (var i = 0; i < header.length; i++) {
                headStr = header[i].textContent;
                var firstChildElement = findFirstChildElement(item[i]);
                var tagName = firstChildElement.tagName;
                if (tagName == "IMG") {
                    itemDict[headStr] = firstChildElement.getAttribute("src");
                    itemDict[headStr] = itemDict[headStr].split(".jpg")[0] + ".jpg"
                }
                else if (tagName == "INPUT") {
                    itemDict[headStr] = firstChildElement.value;
                }else{
                    itemDict[headStr] = firstChildElement.textContent;
                }
            }
            if(itemDict["颜色及规格"].includes(itemDict["商品编码"]) == false){
                // 没有商品编码的添加
                logPrint(itemDict["颜色及规格"] + "——颜色及规格不含商品编码：" + itemDict["商品编码"] + " 建议修改。", 30, 8);
                itemDict["颜色及规格"] = itemDict["商品编码"] + " " + itemDict["颜色及规格"]
            }
            GM_setClipboard(JSON.stringify(itemDict, null, 2));
        }
    });
};

function getData1688Trade() {
    var css = {};
    css["1688订单"] = "div#listBox li.order-item.fd-clr";
    css["1688产品"] = "a.productName";
    css["1688订单号"] = "span.order-id";
    css["1688日期"] = "span.date";
    css["1688金额"] = "div.total";
    var data = [];
    var orders = document.querySelectorAll(css["1688订单"]);
    for (var i = 0; i < orders.length; i++) {
        var tradeDict = {};
        tradeDict["日期"] = orders[i].querySelector(css["1688日期"]).innerText;
        tradeDict["途径"] = "阿里巴巴";
        tradeDict["订单号"] = orders[i].querySelector(css["1688订单号"]).innerText;
        tradeDict["产品"] = orders[i].querySelector(css["1688产品"]).innerText;
        tradeDict["金额"] = orders[i].querySelector(css["1688金额"]).innerText;
        tradeDict["金额"] = tradeDict["金额"].replace(",", "");
        data.unshift([tradeDict["日期"], tradeDict["途径"], tradeDict["订单号"], tradeDict["产品"], tradeDict["金额"]]);
    }
    return toTable(data);
};

function makeOrder() {
    // https://market.m.taobao.com/app/cnmerchant/delivery-center/index.html#/home
    var css = {};
    // 菜鸟发货 打单页面
    css["发货订单"] = "div.order_item_container";
    css["复选框"] = "div.main_order_item input.ant-checkbox-input";
    css["锁定"] = "div.main_order_item span.operation_item:nth-child(2)";
    css["SKU模块"] = "div.sku_container";
    css["打印快递单"] = "div[class*=footer_button_option] button[class*=primaryBtn]";
    css["自动发货勾选状态"] = "div.ant-modal-body span.ant-checkbox-checked > input";
    css["自动发货"] = "div.ant-modal-body span.ant-checkbox > input";
    css["取消打印"] = "div.ant-modal-content button.ant-btn.ant-btn-lg";
    css["确认打印"] = "div.ant-modal-content button.ant-btn.ant-btn-primary.ant-btn-lg";
    css["错误内容"] = "div.ant-modal-content div.ant-modal-confirm-content > span";
    css["错误按钮"] = "div.ant-modal-content div.ant-modal-confirm-btns > button.ant-btn-primary";
    css["提示按钮"] = "div.ant-modal-root button.ant-btn.ant-btn-primary";
    var interval = 3000;
    var intervalId = setInterval(function () {
        try {
            document.querySelector(css["提示按钮"]).click();
        }
        catch (e) {
            debug(e)
        }
        var items = document.querySelectorAll(css["发货订单"]);
        var itemDict = {};
        var itemList = [];
        for (var i = 0; i < items.length; i++) {
            if (items[i].querySelector(css["复选框"]) != null) {
                var sku = "";
                var skuObj = items[i].querySelectorAll(css["SKU模块"]);
                for (x in skuObj) {
                    sku += skuObj[x].innerText;
                }
                sku = getSkuCode(sku);
                if (sku == "") { sku = "" + i }
                itemDict[sku] = i;
                itemList.push(sku);
            }
        }
        itemList.sort()
        if (itemList.length > 0) {
            sku = itemList.shift();
            debug("点击" + sku);
            items[itemDict[sku]].querySelector(css["复选框"]).click();
            document.querySelector(css["打印快递单"]).click();
            setTimeout(function () {
                if (null == document.querySelector(css["自动发货勾选状态"])) {
                    document.querySelector(css["自动发货"]).click();
                }
                document.querySelector(css["确认打印"]).click();
            }, 500);
            setTimeout(function () {
                var err = document.querySelector(css["错误按钮"]);
                if (err != null) {
                    sendMsg(document.querySelector(css["错误内容"]).innerText);
                    err.click();
                    setTimeout(function () {
                        document.querySelector(css["取消打印"]).click();
                        items[itemDict[sku]].querySelector(css["锁定"]).click();
                    }, 1500);
                }
            }, 1000);
        } else {
            clearInterval(intervalId);
        }
    }, interval);
}

function waitClick(cssStr, newCssStr, timeOut = 2000) {
    var begin = 0;
    var interval = 200;
    var intervalId = setInterval(function () {
        if (typeof (newCssStr) == 'string') {
            var node = document.querySelector(newCssStr);
        } else {
            var node = newCssStr;
        }
        if (node != null) {
            clearInterval(intervalId);
            return true;
        } else {
            if (typeof (cssStr) == 'string') {
                var node = document.querySelector(cssStr);
            } else {
                var node = cssStr;
            }
            if (node != null) {
                node.click();
            }
        }
        begin += interval;
        if (begin >= timeOut) {
            clearInterval(intervalId);
            return false;
        }
    }, interval)
}

function unshipped() {
    // https://myseller.taobao.com/home.htm/qn-order/unshipped
    var css = {};
    css["th"] = "div.table-medium thead th .forHeaderWidth";
    css["tr"] = "div.table-medium tbody tr.art-table-row";
    css["td"] = "td.art-table-cell";

    css["复选框"] = "td.art-table-cell input";
    css["锁定"] = "i.next-icon-lock.next-icon-alone";
    // css["订单号"] = "td[name=订单号] span";
    // css["商品信息"] = "td[name=商品信息]";
    // css["快递信息"] = "td[name=快递信息]";
    // css["付款时间"] = "td[name=付款时间] > div > div > span";
    css["打印快递单"] = "div[class*=BottomButtons_btn__] > button";
    css["打印成功后自动发货"] = "div[role=dialog] input.next-checkbox-input";
    css["取消打印"] = "div[role=dialog] i.next-icon-close";
    css["开始打印"] = "div[role=dialog] div[class*=PrintDialog_splitButton__] > button";

    css["打印状态"] = "div[role=dialog] div[class*=PrintHandle_title__]";

    css["错误内容"] = "div[class*=PrintingList_common] div[aria-hidden=false] span[class*=PrintingList_ellipsis]";
    css["提示按钮"] = "div.ant-modal-root button.ant-btn.ant-btn-primary";
    css["关闭弹窗"] = "div[class*=activity_remind_modal] div[class*=close]";
    var interval = 2000;
    var intervalId;
    var order;
    var thDict = {};
    var orderDict = {};
    var skuList = [];
    var fun = {};
    var printed = 0;

    fun["获取订单"] = function () {
        // 统计表头数据
        var ths = document.querySelectorAll(css["th"]);
        for (var i = 0; i < ths.length; i++) {
            var thName = ths[i].getAttribute("data-name");
            thDict[thName] = i + 1;
        }

        var items = document.querySelectorAll(css["tr"]);
        for (var i = 0; i < items.length; i++) {
            skuName = items[i].querySelectorAll(css["td"])[thDict["商品信息"]].innerText;
            order = items[i].querySelectorAll(css["td"])[thDict["订单号"]].innerText.trim();
            orderDict[order] = {};
            orderDict[order]["状态"] = "未打印";
            orderDict[order]["商品信息"] = skuName;
            orderDict[order]["SKU"] = getSkuCode(orderDict[order]["商品信息"]);
            if (orderDict[order]["SKU"] == "") { orderDict[order]["SKU"] = "" + i }
            orderDict[order]["快递信息"] = items[i].querySelectorAll(css["td"])[thDict["快递信息"]].innerText;
            skuList.push(orderDict[order]["SKU"]);
            // if (items[i].querySelector(css["锁定"]) != null) {
            //     orderDict[order]["锁定"] = false;
            // } else {
            //     orderDict[order]["锁定"] = true;
            // }
            // if (orderDict[order]["锁定"] == false && orderDict[order]["快递信息"] == '-') {
            //     skuList.push(orderDict[order]["SKU"]);
            // }
        }
        logPrint("找到订单：" + i + "个，即将排序打印。");
        skuList.sort();
    }

    fun["检查订单"] = function () {
        var noSku = true;
        for (order in orderDict) {
            if (orderDict[order]["SKU"] != "") {
                noSku = false;
            }
        }
        if (noSku) {
            logPrint("找不商品编码，自动退出！", 40);
            return false;
        }
    }

    fun["选择订单"] = function () {
        for (order_ in orderDict) {
            if (orderDict[order_]["SKU"] == skuList[0] && orderDict[order_]["状态"] == "未打印") {
                logPrint("选择编号：" + skuList[0] + orderDict[order_]["状态"]);
                order = order_;
                break;
            }
        }
        var items = document.querySelectorAll(css["tr"]);
        for (var i = 0; i < items.length; i++) {
            try {
                if (order == items[i].querySelectorAll(css["td"])[thDict["订单号"]].innerText.trim()) {
                    items[i].querySelector(css["复选框"]).click();
                } else {
                    if (items[i].querySelector(css["复选框"]).getAttribute("aria-checked") == "true") {
                        // 不应该选中的订单，取消选择状态
                        items[i].querySelector(css["复选框"]).click();
                    }
                }
            } catch (error) {
                logPrint("error：" + error);
            }
        }
        if (orderDict[order]["状态"] == "未打印") {
            setTimeout(function () {
                document.querySelector(css["打印快递单"]).click();
            }, interval * 0.1);
            // orderDict[order]["状态"] = "选择订单";
            setTimeout(function () {
                if (document.querySelector(css["开始打印"]) != null) {
                    orderDict[order]["状态"] = "选择订单";
                    logPrint("选择订单：" + order);
                } else {
                    orderDict[order]["状态"] = "未打印";
                }
            }, interval * 0.3);
        }

    }

    fun["确认打印"] = function () {
        if (orderDict[order]["状态"] == "选择订单") {
            var autoConsign = document.querySelector(css["打印成功后自动发货"])
            if (autoConsign != null) {
                // if (autoConsign.getAttribute("aria-checked") == 'true') {
                if (autoConsign.getAttribute("aria-checked") == 'false') {  // 勾选自动发货
                    autoConsign.click();
                }
                document.querySelector(css["开始打印"]).click();
                // orderDict[order]["状态"] = "确认打印";
                setTimeout(function () {
                    if (document.querySelector(css["开始打印"]) == null) {
                        orderDict[order]["状态"] = "确认打印";
                        logPrint("确认打印：" + order);
                    } else {
                        orderDict[order]["状态"] = "选择订单";
                    }
                }, interval * 0.6);
            }
        }
    }

    fun["确认打印状态"] = function () {
        if (orderDict[order]["状态"] == "确认打印") {
            var printRet = document.querySelector(css["打印状态"]);
            if (printRet == null) {
                orderDict[order]["状态"] = "成功"
                printed = printed + 1;
            } else {
                logPrint("打印状态：" + printRet.innerText);
            }
        }
    }

    fun["打印完成"] = function () {
        if (orderDict[order]["状态"] == "成功" || orderDict[order]["状态"] == "失败") {
            sku = skuList.shift();
            if (skuList.length == 0) {
                logPrint(globalUserData["user"] + "批量排序打印订单：" + printed);
                sendMsg(globalUserData["user"] + "批量排序打印订单：" + printed);
                clearInterval(intervalId);
            }
        }
    }

    fun["获取订单"]();
    fun["检查订单"]();
    intervalId = setInterval(function () {
        fun["选择订单"]();
        fun["确认打印"]();
        fun["确认打印状态"]();
        fun["打印完成"]();
    }, interval)
}


function setCampaign() {
    var css = {};
    css["批量设置"] = "div.next-dialog.next-closeable.next-overlay-inner";
    css["价格来源"] = "div#priceSettingMode input";
    css["折扣比例"] = "input#percentage";
    css["减去金额"] = "input#subtractor";
    css["加上金额"] = "input#addend";
    css["是否取整"] = "div#roundMode input";

    var interval = 300;
    var intervalId = setInterval(function () {
        var page = document.querySelector(css["批量设置"]);
        if (page != null) {
            try {
                page.querySelectorAll(css["价格来源"])[0].click();
                page.querySelectorAll(css["是否取整"])[1].click();
            } catch (error) {
                debug(error, 40);
            }
        }
    }, interval);
}

function refund() {
    var css = {};
    css["退款SKU名称"] = "a[class*=cell_sku-desc]";
    setInterval(function () {
        var items = document.querySelectorAll(css["退款SKU名称"]);
        for (var i = 0; i < items.length; i++) {
            outerHTML = items[i].outerHTML;
            if (outerHTML.slice(0, 2) == "<a") {
                items[i].outerHTML = "<b" + outerHTML.slice(2, outerHTML.length - 5) + "</b>"
            }
        }
    }, 300);
}

function openItemLink(URL){
    setInterval(function () {
        var warnning = document.querySelector("div.warnning-text");
        if(warnning != null && warnning.innerText.includes("非本店商品请前往千牛客户端访问")){
            setGlobalUserData("非本店商品访问拦截", true);
        }else{
            if(URL.includes("item.htm?") && getGlobalUserData("非本店商品访问拦截")){
                setGlobalUserData("非本店商品访问拦截", false);
                logPrint("非本店商品访问拦截，使用强制打开模式，谨慎使用。", 30)
                setTimeout(function () {
                    window.location.href = URL + "&b_s_f=sycm";
                }, 450);
            }
        }
    }, 500);
}

function detailItme() {
    // 新详情页
    var itemID = document.getElementById("aliww-click-trigger").getAttribute("data-item");
    function openSYCM() {
        window.open("https://sycm.taobao.com/cc/item_archives?activeKey=sale&dateType=recent7&itemId=" + itemID);
    }
    function openDMP() {
        window.open("https://dmp.taobao.com/index_new.html?#!/items/overview/item/cold-boot?period=7&itemId=" + itemID);
    }
    function openSS() {
        window.open("https://sycm.taobao.com/flow/monitor/itemsourcedetail?belong=all&childPageType=se_keyword&dateType=recent30&device=2&jumpCalcModel=holoTree&pPageId=30&pageId=23.s1150&pageLevel=2&pageName=%E6%89%8B%E6%B7%98%E6%90%9C%E7%B4%A2&itemId=" + itemID);
    }
    function getDataOneSKU() {
        var css = {};
        css["选择的SKU"] = "div[class*=isSelected] span";
        var selected = document.querySelector(css["选择的SKU"]);
        if (selected != null) {
            // copyStr = "选择颜色分类：" + selected + " 这个链接下单：" + window.location.href;
            data = "已经为您选择：" + selected.innerText + "\n点击下面链接进入页面，就可以下单了。" + window.location.href;
            GM_setClipboard(data);
            logPrint("复制成功");
            return data;
        } else {
            logPrint("请选择一个SKU后再使用！", 30)
            return false;
        }
    }

    function getDataAllSKU() {
        var css = {};
        // 商品页面
        css["所有的SKU"] = "div[class*=valueItem] span";
        var data = "";
        var items = document.querySelectorAll(css["所有的SKU"]);
        for (var i = 0; i < items.length; i++) {
            if (items[i].innerText.length > 0) {
                data += items[i].innerText + "\n";
            }
        }
        data = data.substring(0, data.length - 1);
        GM_setClipboard(data);
        logPrint("复制成功");
        return data;
    }

    function copyAttr() {
        // 新详情页
        var data = "";
        data = data + "商品id：" + document.getElementById("aliww-click-trigger").getAttribute("data-item") + "\n";
        var mainPic = document.querySelectorAll("li[class*=thumbnail--] img");
        var mainPic = [].slice.apply(mainPic).slice(-5);
        for (i = 0; i < mainPic.length; i++) {
            data = data + "主图" + (i + 1) + "：" + mainPic[i].getAttribute("src").replace("_q50.jpg_.webp", "") + "\n";
        }
        var Arrts = document.querySelectorAll("div[class*=infoItem--]");
        for (i = 0; i < Arrts.length; i++) {
            var infoItemTitle = Arrts[i].querySelector("div[class*=infoItemTitle--]").innerText;
            var infoItemContent = Arrts[i].querySelector("div[class*=infoItemContent--]").innerText;
            if (infoItemContent != "") {
                data = data + infoItemTitle + ":" + infoItemContent + "\n";
            }
        }
        GM_setClipboard(data);
        logPrint("复制成功");
        return data;
    }
    var tools = ToolsPanel("Tools");
    tools.add("生意参谋", openSYCM, 1)
    tools.add("达摩盘", openDMP, 2)
    tools.add("搜索", openSS, 3)
    tools.add("复制选择的SKU", getDataOneSKU, 4)
    tools.add("复制所有的SKU", getDataAllSKU, 5)
    tools.add("复制其他数据", copyAttr, 6)
}

//添加工具面板
function ToolsPanel(name = "菜单", fun = "") {
    var userScriptToolsPanel = new Object();
    userScriptToolsPanel.name = name;
    userScriptToolsPanel.toolsPanel = document.createElement("div");
    userScriptToolsPanel.style = document.createElement("style");
    userScriptToolsPanel.init = function () {
        this.toolsPanel.innerHTML = '<div class="aside-menu" title="' + name + '">' + name + '</div>';
        this.toolsPanel.id = "userScriptToolsPanel";
        if (document.querySelector("body")) {
            document.body.appendChild(this.toolsPanel);
        } else {
            document.documentElement.appendChild(this.toolsPanel);
        }
        this.style.type = "text/css";
        this.style.innerHTML = `
            #userScriptToolsPanel {
                position: fixed;
                right: 50px;
                z-index: 9999999 !important;
                // top: 350px;
                bottom: 100px;
                width: 150px;
                height: 150px;
                user-select: none;
                opacity: .75;
                font-family: PingFang SC, Microsoft YaHei, Roboto, Helvetica Neue, Helvetica, Tahoma, Arial !important;
            }

            #userScriptToolsPanel .aside-menu {
                position: absolute;
                width: 70px;
                height: 70px;
                border-radius: 50%;
                background: #17a2b8;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                text-align: center;
                line-height: 70px;
                color: #fff;
                font-size: 20px;
                z-index: 1;
                cursor: move;
                overflow: hidden;
            }

            #userScriptToolsPanel .menu-item {
                position: absolute;
                width: 60px;
                height: 60px;
                background-color: #17a2b8;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                padding: 10px 5px;
                text-align: center;
                border-radius: 50%;
                text-decoration: none;
                color: #fff;
                transition: all .5s;
                font-size: 14px;
                box-sizing: border-box;
                overflow: hidden;
                cursor:pointer;
            }

            #userScriptToolsPanel .menu-item:hover {
                background: #a9c734;
            }

            #userScriptToolsPanel:hover {
                opacity: 1;
            }

            #userScriptToolsPanel:hover .aside-menu {
                animation: jello 1s;
            }

            #userScriptToolsPanel:hover .menu1 {
                transform: translate3d(0, -135%, 0);
            }

            #userScriptToolsPanel:hover .menu2 {
                transform: translate3d(-120%, -70%, 0);
            }

            #userScriptToolsPanel:hover .menu3 {
                transform: translate3d(-120%, 70%, 0);
            }

            #userScriptToolsPanel:hover .menu4 {
                transform: translate3d(0, 135%, 0);
            }

            #userScriptToolsPanel:hover .menu5 {
                transform: translate3d(120%, 70%, 0);
            }

            #userScriptToolsPanel:hover .menu6 {
                transform: translate3d(120%, -70%, 0);
            }

            @keyframes jello {
                from,
                11.1%,
                to {
                    transform: none
                }
                22.2% {
                    transform: skewX(-12.5deg) skewY(-12.5deg)
                }
                33.3% {
                    transform: skewX(6.25deg) skewY(6.25deg)
                }
                44.4% {
                    transform: skewX(-3.125deg) skewY(-3.125deg)
                }
                55.5% {
                    transform: skewX(1.5625deg) skewY(1.5625deg)
                }
                66.6% {
                    transform: skewX(-.78125deg) skewY(-.78125deg)
                }
                77.7% {
                    transform: skewX(0.390625deg) skewY(0.390625deg)
                }
                88.8% {
                    transform: skewX(-.1953125deg) skewY(-.1953125deg)
                }
            }
                `;
        this.toolsPanel.appendChild(this.style);
        if (fun != "") this.toolsPanel.querySelector(".aside-menu").setAttribute('style', "cursor:pointer")
        var flag = 0; //标记是拖曳还是点击
        var disX, disY, L, T, starX, starY;
        this.toolsPanel.addEventListener('mousedown', function (e) {
            flag = 1;
            e.preventDefault(); //阻止触摸时页面的滚动，缩放
            disX = e.clientX - this.offsetLeft;
            disY = e.clientY - this.offsetTop;
            //手指按下时的坐标
            starX = e.clientX;
            starY = e.clientY;
            //console.log(disX);
        });
        this.toolsPanel.addEventListener('mousemove', function (e) {
            if (flag > 0) {
                L = e.clientX - disX;
                T = e.clientY - disY;
                if (L < 0) { //限制拖拽的X范围，不能拖出屏幕
                    L = 0;
                } else if (L > document.documentElement.clientWidth - this.offsetWidth + 100) {
                    L = document.documentElement.clientWidth - this.offsetWidth + 100;
                }
                if (T < 0) { //限制拖拽的Y范围，不能拖出屏幕
                    T = 0;
                } else if (T > document.documentElement.clientHeight - this.offsetHeight) {
                    T = document.documentElement.clientHeight - this.offsetHeight;
                }
                this.style.left = L + 'px';
                this.style.top = T + 'px';
                flag = 2;
            }
        });
        this.toolsPanel.addEventListener('mouseup', function (e) {
            if (flag == 1) {
                // 仅点击，未移动
                if (fun != "") fun();
            }
            flag = 0;
        });
    }

    userScriptToolsPanel.init();

    userScriptToolsPanel.add = function (name, fun, index = 1) {
        var tool = document.createElement("a");
        tool.className = "menu-item menu" + index
        tool.innerHTML = name;
        tool.title = name;
        tool.addEventListener("click", fun);
        this.toolsPanel.appendChild(tool);
    }
    return userScriptToolsPanel;
}

var bootstrapcss = `
.alert {
    position: fixed;
    top: 85%;
    left: 50%;
    z-index: 9999999;
    padding: .75rem 1.25rem;
    padding-right: 4rem;
    border: 1px solid transparent;
    border-radius: .25rem;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
    font-size: 1.2rem;
}
.alert-success {
    color: #155724;
    background-color: #d4edda;
    border-color: #c3e6cb;
}
.alert-info {
    color: #0c5460;
    background-color: #d1ecf1;
    border-color: #bee5eb;
}
.alert-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
}
.alert-danger {
    color: #721c24;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}
.alert-primary {
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
}
.alert-dismissible .close {
    position: absolute;
    top: 0;
    right: 0;
    padding: .75rem 1.25rem;
    color: inherit;
}
.btn {
    display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    cursor: pointer;
    background-color: transparent;
    border: 1px solid transparent;
    padding: .375rem .75rem;
    margin: 0 8px 8px 8px;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
}
.btn-group-sm>.btn, .btn-sm {
    padding: .25rem .5rem;
    font-size: .875rem;
    line-height: 1.5;
    border-radius: .2rem;
}
.btn-group-lg>.btn, .btn-lg {
    padding: .5rem 1rem;
    font-size: 1.25rem;
    line-height: 1.5;
    border-radius: .3rem;
}
button.close {
    padding: 0;
    background-color: transparent;
    border: 0;
    cursor: pointer;
    -webkit-appearance: none;
    float: right;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: .5;
}
.btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}
.btn-primary:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
}
.btn-secondary {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
}
.btn-secondary:hover {
    color: #fff;
    background-color: #5a6268;
    border-color: #545b62;
}
.btn-success {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745;
}
.btn-success:hover {
    color: #fff;
    background-color: #218838;
    border-color: #1e7e34;
}
.btn-info {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8;
}
.btn-info:hover {
    color: #fff;
    background-color: #138496;
    border-color: #117a8b;
}
.btn-warning {
    color: #212529;
    background-color: #ffc107;
    border-color: #ffc107;
}
.btn-warning:hover {
    color: #212529;
    background-color: #e0a800;
    border-color: #d39e00;
}
.btn-danger {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545;
}
.btn-danger:hover {
    color: #fff;
    background-color: #c82333;
    border-color: #bd2130;
}
.btn-dark {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40;
}
.btn-dark:hover {
    color: #fff;
    background-color: #23272b;
    border-color: #1d2124;
}
`;
GM_addStyle(bootstrapcss);
var stylewarn = " background-color:#ffc107; color: #212529; font-weight:700; border-radius: 0.25rem; ";

function getGlobalUserData(key=null){
    userScriptName = GM_info.script.name;
    globalUserData = GM_getValue(userScriptName) || {}; // 读取已存储数据
    if(key==null){
        return globalUserData;
    }else{
        return globalUserData[key];
    }

}

function setGlobalUserData(key, value, set=0){
    globalUserData = getGlobalUserData();
    if(set == 0){
        globalUserData[key] = value;
    }else{
        // 字典更新模式
        if(! globalUserData.hasOwnProperty(key)){
            // 没有数据就初始化
            globalUserData[key] = {};
        }
        globalUserData[key] = Object.assign({}, globalUserData[key], value);
    }
    GM_setValue(userScriptName, globalUserData);
}

function init() {
    userScript = GM_info.script.name;
    globalUserData = GM_getValue(userScript) || {}; // 读取已存储数据
    if (!globalUserData.hasOwnProperty("user") || globalUserData["user"] == null || !globalUserData.hasOwnProperty("url") || globalUserData["url"] == null) {
        globalUserData["user"] = prompt("请输入您的名字", "");
        globalUserData["url"] = prompt("请输入通知链接", "");
        var data = "提醒：" + globalUserData["user"] + "注册脚本 " + userScript;
        GM_setValue(userScript, globalUserData);
        sendMsg(data);
    }
    // 双击复制选择的内容
    document.body.ondblclick = function () {
        document.execCommand('copy');
    };
    // 移除生意参谋水印
    setTimeout(function () {
        try {
            document.getElementById("watermark-container").remove();
        } catch (error) {
            ;
        }
    }, 2000);
}

function reinit() {
    userScript = GM_info.script.name;
    GM_setValue(userScript, {});
    init();
}

var globalUserData = {};
init();
GM_registerMenuCommand("重新注册钉钉通知机器人", reinit, "k");
var oldURL = "原来的URL";
setInterval(function () {
    var URL = window.location.href.split("?")[0];
    if (URL == oldURL) return;
    try {
        // 网址变化后，清除工具面板。
        document.getElementById("userScriptToolsPanel").remove();
    } catch (error) {
        ;
    }
    oldURL = URL;
    if (URL.indexOf("https://detail.tmall.com/") != -1 || URL.indexOf("https://item.taobao.com/item.htm") != -1) {
        // 新详情页
        setTimeout(function () {
            detailItme();
        }, 1000);
    }
    if (URL.indexOf("sale/seller/campaign/item.htm") != -1) {
        // 活动报名页面
        setCampaign();
    }
    if (URL.indexOf("https://fahuo.cainiao.com/consigns/order/consign.htm") != -1) {
        // 菜鸟发货
        var cssStr = "div[class*=footer_button_option] > div[class*=button_list]";
        var html = '<div><button type="button" class="ant-btn buttonStyle___K0ulF" style="background-color: #28a745;color: #fff"><div class="text">排序打印</div></button></div>'
        setTimeout(function () {
            insetrHtml(cssStr, html, makeOrder);
            document.querySelector("div[class*=activity_remind_modal] div[class*=close]").click();
        }, 2000);
    }
    if (URL.indexOf(".taobao.com/home.htm/qn-order/unshipped") != -1) {
        // 物流 打单工具
        ToolsPanel("排序打印", unshipped);
    }
    if (URL.indexOf("taobao.com/home.htm/SellManage/") != -1) {
        // 出售中
        setTimeout(sellItemsPage, 2000);
    }
    if (URL.indexOf("taobao.com/qn/inventory/editInventory") != -1) {
        // 出售中修改库存
        inventoryEdit();
    }
    if (URL.indexOf(".taobao.com/home.htm/trade-platform/tp/sold") != -1) {
        // 新复制售出的SKU
        ToolsPanel("复制售出的SKU", getDataTrade);
    }
    if (URL.indexOf("fxg.jinritemai.com/ffa/morder/order/list") != -1) {
        // 复制抖店售出的SKU
        ToolsPanel("复制售出的SKU", getDYorder);
    }
    if (URL.indexOf("taobao.com/home.htm/trade-platform/refund-list") != -1) {
        // 售后页面 SKU名称
        setTimeout(refund, 1000);
    }
    if (URL.indexOf("https://sell.publish.tmall.com/") != -1) {
        // 商品编辑页面
        setTimeout(function () {
            var publish = publishPage();
            var tools = ToolsPanel("Tools");
            tools.add("复制0库存", publish.getDat0SKU, 1)
            tools.add("复制01库存", publish.getDat01SKU, 2)
            tools.add("查找SKU", publish.findSKU, 3)
            tools.add("重新加载SKU", publish.load, 4)
        }, 1000);
    }
    if (URL.indexOf("https://myseller.taobao.com/home.htm/sucai-tu/home") != -1) {
        // 图片空间
        getImageData()
    }
    if (URL.indexOf("https://trade.1688.com/order/buyer_order_list.htm") != -1) {
        // 1688订单
        insetrCopy("#mod-batch-bar", getData1688Trade, "复制订单信息");
    }
    if (URL.indexOf("https://sycm.taobao.com/") != -1) {
        // 生意参谋
        sycmPage();
    }
    if (URL.indexOf("erp321.com") != -1) {
        // 获取ERP数据
        getERP321();
        getERP321ShangPin();
    }
    if (URL.indexOf("https://item.taobao.com/item.htm") != -1 || URL.indexOf("https://detail.tmall.com/item.htm") != -1 || URL.indexOf("https://bixi.alicdn.com/punish/punish") != -1 ) {
        // 打开淘宝商品页面
        openItemLink(window.location.href);
    }
}, 500);