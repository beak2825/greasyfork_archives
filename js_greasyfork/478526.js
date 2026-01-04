// ==UserScript==
// @name         坦克世界特惠商城历史订单汇总
// @namespace    wot-order-list
// @version      1.0.4
// @description  访问https://shop.wot.360.cn/orderlist.html即可查看历史消费记录、送礼记录、收礼记录
// @author       Eruru
// @match        https://shop.wot.360.cn/orderlist.html
// @icon         https://shop.wot.360.cn/favicon.ico
// @require      https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.3.2/html2canvas.min.js
// @grant        none
// @license      MPL
 
// @downloadURL https://update.greasyfork.org/scripts/478526/%E5%9D%A6%E5%85%8B%E4%B8%96%E7%95%8C%E7%89%B9%E6%83%A0%E5%95%86%E5%9F%8E%E5%8E%86%E5%8F%B2%E8%AE%A2%E5%8D%95%E6%B1%87%E6%80%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/478526/%E5%9D%A6%E5%85%8B%E4%B8%96%E7%95%8C%E7%89%B9%E6%83%A0%E5%95%86%E5%9F%8E%E5%8E%86%E5%8F%B2%E8%AE%A2%E5%8D%95%E6%B1%87%E6%80%BB.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    var ids = ["shop-summary", "shop-summary-gift", "shop-summary-receive-gift"];
    $(".summary-table").remove ();
    $(".header").after ($("<table class='summary-table header' style='width: 1204px; margin: 0 auto;'><tr><td class='summary-table-placeholder'></td></tr></table>"));
    var panelElement = $(".summary-table-placeholder");
    for (var i =0;i<ids.length;i++) {
        panelElement.append ("<div class='"+ids[i]+"' style='margin-top: 30px;'></div>");
    }
    $.get("https://shop.wot.360.cn/api/order/list?game_id=1&ct=all&pn=1&ps=9999", function (response) {
        displayOrderList(ids[0], "消费记录", true, response);
    });
    $.get("https://shop.wot.360.cn/api/gift/sends?game_id=1&ct=undefined&pn=1&ps=9999", function (response) {
        displayOrderList(ids[1], "送礼记录", false, response);
    });
    $.get("https://shop.wot.360.cn/api/gift/receiver?game_id=1&ct=all&pn=1&ps=9999", function (response) {
        displayOrderList(ids[2], "收礼记录", false, response);
    });
 
    function displayOrderList(id, title, isPop, response) {
        var items = response.data.list;
        var currentSummary = new Summary();
        var summary = new Summary();

        var snapshootBtn = isPop ? `<a class="summary-snapshoot-btn" style="padding: 0 15px;">存为截图</a>` : ''
        var slotRight = `<div style="position: absolute;top: 0;right: 0;color: cornflowerblue;bottom: 0;cursor: pointer;user-select: none;">${snapshootBtn}<a class="${id}-spread-btn" style="padding: 0 15px;">收起</a></div>`

        var text = "<table border='1' style='width: 100%;'>";
        text += "<tr align='center' style='color: #f26402;position: relative;''><td colspan='4'>" + title + slotRight + "</td></tr>"
        text += "<tr align='center' style='color: #f26402;'><td width='60px'>序号</td><td>商品</td><td width='100px'>价格</td><td width='220px'>时间</td></tr>";
        var unknownTypes = [];
        var unknownStatus = [];
        for (var i = 0; i < items.length; i++) {
            var type = items[i]["type"];
            switch (type) {
                case "pop":
                case "subscribe":
                    if (!isPop) {
                        continue;
                    }
                    break;
                case "gift":
                    if (isPop) {
                        continue;
                    }
                    break;
                default:
                    if (unknownTypes.indexOf (type) == -1) {
                        unknownTypes.push (type);
                    }
                    break;
            }
            var status = items[i]["status"];
            switch (status) {
                case "SUCCESS":
                case "DELIVER_SUCC":
                    break;
                default:
                    if (unknownStatus.indexOf (status) == -1) {
                        unknownStatus.push (status);
                    }
                    break;
            }
            var date = new Date(items[i]["create_time"]);
            if (i == 0) {
                currentSummary.year = date.getFullYear();
            }
            if (currentSummary.year != date.getFullYear()) {
                text += summaryToHtml(currentSummary);
                currentSummary = new Summary();
                currentSummary.year = date.getFullYear();
            }
            var goods = items[i]["goods"];
            var price = parseFloat(goods["price"]);
            var name = goods["name"];
            var packageContents = goods["package_content"];
            var count = items[i]["goods_count"];
            if (packageContents != null && packageContents.length > 0) {
                name += " ( " + packageContents.map(item => item["content"]).join("、") + " )";
            }
            if (count > 1) {
                name += " *" + count;
            }
            currentSummary.count++;
            currentSummary.price += price;
            summary.count++;
            summary.price += price;
            text += `<tr align='center' class='${id}-record'>`;
            text += "<td>" + (i + 1) + "</td>";
            text += "<td>" + name + "</td>";
            text += "<td>" + price + " 元</td>";
            text += "<td>" + dateToString(date) + "</td>";
            text += "</tr>";
        }
        if (items.length > 0) {
            text += summaryToHtml(currentSummary);
        }
        text += summaryToHtml(summary);
        text += "</table>";
        $("." + id).append(text);
        var debugText = "";
        if (unknownTypes.length > 0) {
            debugText += "未知的Types: " + unknownTypes.join ("、");
        }
        if (unknownStatus.length > 0) {
            if (debugText.length > 0) {
                debugText += "\r\n";
            }
            debugText += "未知的Status: " + unknownStatus.join ("、");
        }
        if (debugText.length > 0) {
            debugText = id + " 信息:\r\n" + debugText;
            alert (debugText);
        }

        $(`.${id}-spread-btn`).on("click", function () {
            spreadTable(id);
        });
        $('.summary-snapshoot-btn').on("click", function () {
            snapshootTable(id);
        });
    
    }
 
    function dateToString(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        return year + "年" + month + "月" + day + "日 " + hours + "时" + minutes + "分" + seconds + "秒";
    }
 
    function summaryToHtml(summary) {
        return "<tr align='center' style='color: #f26402;'><td>" + (summary.year == 0 ? "至今" : summary.year + "年") + "</td><td>共 " + summary.count + " 份订单</td><td colspan='2'>共 " + summary.price.toFixed(2) + " 元</td></tr>";
    }
 
    function Summary() {
        this.year = 0;
        this.count = 0;
        this.price = 0.0;
    }
 
    function spreadTable(id) {
        let btn = document.querySelector(`.${id}-spread-btn`);
        if (btn.innerText == '展开') {
            btn.innerText = '收起';
            document.querySelectorAll(`.${id}-record`).forEach(item => {
                item.style.display = 'table-row';
            })
        } else {
            btn.innerText = '展开';
            document.querySelectorAll(`.${id}-record`).forEach(item => {
                item.style.display = 'none';
            })
        }
    }
 
    function snapshootTable(id) {
        var getPixelRatio = function (context) { // 获取设备的PixelRatio
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 0.5;
            return (window.devicePixelRatio || 0.5) / backingStore;
        };
        //生成的图片名称
        var imgName = `360消费记录-${dateToString(new Date())}.jpg`;
        var shareContent = document.querySelector(".summary-table.header");
        var width = shareContent.offsetWidth;
        var height = shareContent.offsetHeight;
        var canvas = document.createElement("canvas");
        var context = canvas.getContext('2d');
        var scale = getPixelRatio(context); //将canvas的容器扩大PixelRatio倍，再将画布缩放，将图像放大PixelRatio倍。
        canvas.width = width * scale;
        canvas.height = height * scale;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
 
        var opts = {
            scale: scale,
            logging: true,
            useCORS: true,
            canvas: canvas,
            width: width,
            height: height,
            backgroudColor: '#232323',
            dpi: window.devicePixelRatio
        };
        html2canvas(shareContent, opts).then(function (canvas) {
            context.imageSmoothingEnabled = false;
            context.webkitImageSmoothingEnabled = false;
            context.msImageSmoothingEnabled = false;
            context.imageSmoothingEnabled = false;
            var dataUrl = canvas.toDataURL('image/jpeg', 1.0);
            dataURIToBlob(imgName, dataUrl, callback);
        });
 
        
        var dataURIToBlob =  function (imgName, dataURI, callback) {
            var binStr = atob(dataURI.split(',')[1]),
                len = binStr.length,
                arr = new Uint8Array(len);
 
            for (var i = 0; i < len; i++) {
                arr[i] = binStr.charCodeAt(i);
            }
 
            callback(imgName, new Blob([arr]));
        }
 
        var callback = function (imgName, blob) {
            var triggerDownload = $("<a>").attr("href", URL.createObjectURL(blob)).attr("download", imgName).appendTo("body").on("click", function () {
                if (navigator.msSaveBlob) {
                    return navigator.msSaveBlob(blob, imgName);
                }
            });
            triggerDownload[0].click();
            triggerDownload.remove();
        };
 
    }

})();