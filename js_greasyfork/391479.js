// ==UserScript==
// @name         DownLoad Market History Record
// @namespace    local.CR
// @version      1.1.0
// @description  Generate XLSX  File From Steam Market History Page
// @author       CharRun
// @match        https://steamcommunity.com/market/*
//// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.1/shim.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.15.1/xlsx.full.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/391479/DownLoad%20Market%20History%20Record.user.js
// @updateURL https://update.greasyfork.org/scripts/391479/DownLoad%20Market%20History%20Record.meta.js
// ==/UserScript==

"use strict";
/// <reference path="../node_modules/@types/tampermonkey" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
(function () {
    var controlTabs = document.querySelector(".market_tab_well_tabs");
    if (!g_steamID || !controlTabs) {
        console.log("g_steamID:", g_steamID);
        console.log("controlTabs:", controlTabs);
        return;
    }
    var dialog;
    var exportType = 0;
    var exportLink = document.createElement("a");
    var typeSelect = document.createElement("select");
    exportLink.className = "market_tab_well_tab market_tab_well_tab_inactive";
    exportLink.innerHTML = "<span class=\"market_tab_well_tab_contents\">\u5BFC\u51FA <select></select> \u8BB0\u5F55</span>";
    typeSelect.innerHTML = "<option value=\"0\">\u5168\u90E8\u4EA4\u6613</option><option value=\"1\">\u6302\u5355\u6E05\u5355</option><option value=\"2\">\u5386\u53F2\u4EA4\u6613</option>";
    typeSelect.onchange = function () { return (exportType = parseInt(typeSelect.value)); };
    typeSelect.onclick = function (e) { return e.stopPropagation(); };
    var parent = exportLink.querySelector("span");
    parent.replaceChild(typeSelect, exportLink.querySelector("select"));
    exportLink.onclick = function () { return export2XLSX(exportType); };
    controlTabs.appendChild(exportLink);
    function export2XLSX(type) {
        return __awaiter(this, void 0, void 0, function () {
            var current, total, currentTitle, listings, history, updateProgress, _a, sheetArray, wb;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (dialog) {
                            return [2 /*return*/];
                        }
                        current = 0;
                        total = 1;
                        currentTitle = "";
                        listings = [];
                        history = [];
                        dialog = CreateBlockingWaitDialog("\u6B63\u5728\u51C6\u5907EXCEL\u8868\u683C", "\u83B7\u53D6" + currentTitle + " \u4E2D " + 0.0 + "% Total:" + current + "/" + total);
                        updateProgress = function (progress) {
                            dialog.body("\u83B7\u53D6" + currentTitle + " \u4E2D " + (progress || "N/A") + "% Total:" + current + "/" + total);
                        };
                        _a = type;
                        switch (_a) {
                            case 0: return [3 /*break*/, 1];
                            case 1: return [3 /*break*/, 2];
                            case 2: return [3 /*break*/, 4];
                        }
                        return [3 /*break*/, 6];
                    case 1:
                        total = 2;
                        _b.label = 2;
                    case 2:
                        current++;
                        currentTitle = "挂单清单";
                        updateProgress();
                        return [4 /*yield*/, getAOAData(1, updateProgress)];
                    case 3:
                        listings = _b.sent();
                        if (type != 0) {
                            return [3 /*break*/, 6];
                        }
                        _b.label = 4;
                    case 4:
                        current++;
                        currentTitle = "历史交易";
                        updateProgress();
                        return [4 /*yield*/, getAOAData(2, updateProgress)];
                    case 5:
                        history = _b.sent();
                        return [3 /*break*/, 6];
                    case 6:
                        dialog && dialog.Dismiss();
                        dialog = null;
                        sheetArray = [];
                        if (!listings.length && !history.length) {
                            ShowConfirmDialog("下载数据表格", "获取记录出错，记录空", "确定");
                            return [2 /*return*/];
                        }
                        if (listings.length) {
                            sheetArray.push({
                                sheet: aoa2sheet(listings, "\u7528\u6237:" + g_steamID + "-\u4EA4\u6613\u5E02\u573A\u6302\u5355\u8BB0\u5F55-\u5BFC\u51FA\u65E5\u671F:" + new Date().toLocaleString()),
                                name: "挂单记录"
                            });
                        }
                        if (history.length) {
                            sheetArray.push({
                                sheet: aoa2sheet(history, "\u7528\u6237:" + g_steamID + "-\u4EA4\u6613\u5E02\u573A\u5386\u53F2\u8BB0\u5F55-\u5BFC\u51FA\u65E5\u671F:" + new Date().toLocaleString()),
                                name: "历史记录"
                            });
                        }
                        wb = sheet2WorkBookData(sheetArray);
                        ShowConfirmDialog("下载数据表格", "\u7528\u6237:" + g_steamID + "-\u4EA4\u6613\u5E02\u573A\u5386\u53F2\u8BB0\u5F55.xlsx", "下载", "取消").done(function () {
                            createDownloadStuffAndStartDownload(wb, "\u7528\u6237:" + g_steamID + "-\u4EA4\u6613\u5E02\u573A\u5386\u53F2\u8BB0\u5F55.xlsx");
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    function getAOAData(type, update) {
        return __awaiter(this, void 0, void 0, function () {
            var aoa, start, total, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        aoa = [];
                        start = 0;
                        total = 1000;
                        success = true;
                        _a.label = 1;
                    case 1: return [4 /*yield*/, getMarketData(type, start).then(function (res) {
                            var jsonData = {};
                            try {
                                jsonData = JSON.parse(res.responseText);
                            }
                            catch (e) {
                                jsonData.success = false;
                            }
                            if (!jsonData.success) {
                                console.log("COLLECT DATA ERROR");
                                success = false;
                                dialog && dialog.Dismiss();
                                dialog = null;
                                ShowAlertDialog("交易市场历史记录", "获取历史交易数据失败", "确定");
                                return;
                            }
                            start += jsonData.pagesize;
                            total = jsonData.total_count;
                            aoa = aoa.concat(_handleTableData(jsonData, type));
                            var percent = Number((start / total) * 100).toFixed(2);
                            update && update(percent);
                        }, console.log)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (start < total && success) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4:
                        if (!success) {
                            aoa = [];
                        }
                        console.log(aoa);
                        return [2 /*return*/, aoa];
                }
            });
        });
    }
    function getMarketData(type, start) {
        return new Promise(function (res, rej) {
            var url;
            if (type == 1) {
                url = "https://steamcommunity.com/market/mylistings?count=100&start=" + (start ? start : 0);
            }
            else {
                url = "https://steamcommunity.com/market/myhistory/render/?query=&count=100&start=" + (start ? start : 0);
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: res,
                onerror: rej
            });
        });
    }
    function _handleTableData(data, type) {
        var recode = document.createElement("body");
        var regexp = /CreateItemHoverFromContainer\([\s\S]*?,(?<eid>[\s\S]*?),(?<appid>[\s\S]*?),(?<contextid>[\s\S]*?),(?<classid>[\s\S]*?),(?<instanceid>[\s\S]*?)\);/gi;
        recode.innerHTML = data.results_html;
        var assets = data.assets;
        var assetsChart = {};
        var t;
        while ((t = regexp.exec(data.hovers))) {
            var eid = t[1].trim().replace(/^'|'$/gi, "");
            var appid = t[2].trim().replace(/^'|'$/gi, "");
            var classid = t[4].trim().replace(/^'|'$/gi, "");
            var contextid = t[3].trim().replace(/^'|'$/gi, "");
            var instanceid = t[5].trim().replace(/^'|'$/gi, "");
            assetsChart[eid] = { appid: appid, classid: classid, contextid: contextid, instanceid: instanceid };
        }
        var getAsset = function (id, name) {
            var e = assetsChart[id];
            var asset;
            try {
                asset = assets[e.appid][e.contextid][e.classid];
            }
            catch (e) {
                //stupid design no match
                var deep_1 = function (obj, key, value) {
                    if (obj[key] && obj[key] == value) {
                        return obj;
                    }
                    else {
                        var keys = Object.keys(obj);
                        for (var i = 0; i < keys.length; i++) {
                            var _obj = obj[keys[i]];
                            if (Object.prototype.toString.call(_obj) === "[object Object]") {
                                var res = deep_1(_obj, key, value);
                                if (res[key] == value) {
                                    return res;
                                }
                            }
                        }
                        return {};
                    }
                };
                asset = deep_1(assets, "name", name);
            }
            return asset;
        };
        var aoa = []; //array[]
        //let array = Array(19).fill(null);
        //array[0] itemName
        //array[1] itemType
        //array[2] tradeCurrency
        //array[3] unitPrice
        //array[4] tradeQTY
        //array[5] totalPrice
        //array[6] tradeType
        //array[7] tradeUserName
        //array[8] tradeUserLink
        //array[9] listedDate
        //array[10] actedDate
        //array[11] itemAppId
        //array[12]  itemClassId
        //array[13] itemContextId
        //array[14] itemInstanceId
        //array[15] itemMarketFeeApp
        //array[16] itemMarketHashName
        //array[17] itemUnownedContextId
        //array[18] itemUnownedId
        if (type === 1) {
            var sellRows = recode.querySelectorAll(".my_listing_section:first-child .market_listing_row");
            var orderRows = recode.querySelectorAll(".my_listing_section:last-child .market_listing_row");
            for (var i = 0; i < sellRows.length; i++) {
                var array = Array(19).fill("N/A");
                var row = sellRows[i];
                var rId = row.querySelector("span.market_listing_item_name") ||
                    row.querySelector("img.market_listing_item_img") || { id: "null" };
                var id = rId.id;
                var tradeType = "SellListings";
                var name_1 = (row.querySelector(".market_listing_item_name")).innerText.trim();
                var listedDate = (row.querySelector(".market_listing_listed_date")).innerText.trim();
                var priceText = (row.querySelector(".market_listing_price span span:last-child")).innerText
                    .replace(/[\(\)]/gi, "")
                    .trim();
                var priceString = priceText.replace(/[^0-9\.]/g, "") || "0";
                var tradeCurrency = priceText.replace(priceString, "").trim() || null;
                var unitPrice = parseFloat(priceString);
                var asset = getAsset(id, name_1);
                array[0] = asset.name || name_1 || null;
                array[1] = asset.type || null;
                array[2] = tradeCurrency || null;
                array[3] = unitPrice || null;
                array[4] = 1 || null;
                array[5] = unitPrice || null;
                array[6] = tradeType || null;
                array[7] = null;
                array[8] = null;
                array[9] = listedDate || null;
                array[10] = null;
                array[11] = asset.appid || null;
                array[12] = asset.classid || null;
                array[13] = asset.contextid || null;
                array[14] = asset.instanceid || null;
                array[15] = asset.market_fee_app || null;
                array[16] = asset.market_hash_name || null;
                array[17] = asset.unowned_contextid || null;
                array[18] = asset.unowned_id || null;
                aoa.push(array);
            }
            for (var i = 0; i < orderRows.length; i++) {
                var array = Array(19).fill("N/A");
                var row = orderRows[i];
                var rId = row.querySelector("span.market_listing_item_name") ||
                    row.querySelector("img.market_listing_item_img") || { id: "null" };
                var id = rId.id;
                var tradeType = "OrderListings";
                var name_2 = (row.querySelector(".market_listing_item_name")).innerText.trim();
                var priceText = ((row.querySelector(".market_listing_price ").lastChild).nodeValue).trim();
                var priceString = priceText.replace(/[^0-9\.]/g, "") || "0";
                var tradeCurrency = priceText.replace(priceString, "").trim() || null;
                var unitPrice = parseFloat(priceString);
                var tradeQTYString = (row.querySelectorAll(".market_listing_price")[1]).innerText.trim();
                var tradeQTY = parseInt(tradeQTYString);
                var totalPrice = unitPrice * tradeQTY;
                var asset = getAsset(id, name_2);
                array[0] = asset.name || name_2 || null;
                array[1] = asset.type || null;
                array[2] = tradeCurrency || null;
                array[3] = unitPrice || null;
                array[4] = tradeQTY || null;
                array[5] = totalPrice || null;
                array[6] = tradeType || null;
                array[7] = null;
                array[8] = null;
                array[9] = null;
                array[10] = null;
                array[11] = asset.appid || null;
                array[12] = asset.classid || null;
                array[13] = asset.contextid || null;
                array[14] = asset.instanceid || null;
                array[15] = asset.market_fee_app || null;
                array[16] = asset.market_hash_name || null;
                array[17] = asset.unowned_contextid || null;
                array[18] = asset.unowned_id || null;
                aoa.push(array);
            }
        }
        else if (type === 2) {
            console.log(aoa);
            var rows = recode.querySelectorAll(".market_listing_row.market_recent_listing_row");
            for (var i = 0; i < rows.length; i++) {
                var array = Array(19).fill("N/A");
                var row = rows[i];
                var rId = row.querySelector("span.market_listing_item_name") ||
                    row.querySelector("img.market_listing_item_img") || { id: "null" };
                var id = rId.id;
                var name_3 = (row.querySelector(".market_listing_item_name")).innerText.trim();
                var priceText = (row.querySelector(".market_listing_price")).innerText.trim();
                var priceString = priceText.replace(/[^0-9\.]/g, "") || "0";
                var tradeCurrency = priceText.replace(priceString, "").trim() || null;
                var unitPrice = parseFloat(priceString);
                var tradeUser = row.querySelector("div.market_listing_right_cell.market_listing_whoactedwith > span > span > a");
                var tradeUserLink = void 0;
                var tradeUserName = void 0;
                if (tradeUser) {
                    tradeUserLink = tradeUser.href;
                    tradeUserName = tradeUser.children[0].title;
                }
                var type_1 = (row.querySelector(".market_listing_gainorloss")).innerText.trim();
                var tradeType = type_1 == "+" ? "Buy" : type_1 == "-" ? "Sell" : "Revoke";
                var listedDate = (row.querySelector(".market_listing_listed_date")).innerText.trim();
                var actedDate = (row.querySelectorAll(".market_listing_listed_date")[1]).innerText.trim();
                var asset = getAsset(id, name_3);
                array[0] = asset.name || name_3 || null;
                array[1] = asset.type || null;
                array[2] = tradeCurrency || null;
                array[3] = unitPrice || null;
                array[4] = 1 || null;
                array[5] = unitPrice || null;
                array[6] = tradeType || null;
                array[7] = tradeUserName || null;
                array[8] = tradeUserLink || null;
                array[9] = listedDate || null;
                array[10] = actedDate || null;
                array[11] = asset.appid || null;
                array[12] = asset.classid || null;
                array[13] = asset.contextid || null;
                array[14] = asset.instanceid || null;
                array[15] = asset.market_fee_app || null;
                array[16] = asset.market_hash_name || null;
                array[17] = asset.unowned_contextid || null;
                array[18] = asset.unowned_id || null;
                aoa.push(array);
            }
        }
        return aoa;
    }
    function sheet2WorkBookData(sheets) {
        var workbook = {
            SheetNames: [],
            Sheets: {}
        };
        console.log(sheets);
        sheets.forEach(function (val, index) {
            var name = val.name || "sheet" + index;
            name = workbook.SheetNames.indexOf(name) > -1 ? name + "(1)" : name;
            workbook.SheetNames.push(name);
            workbook.Sheets[name] = val.sheet;
        });
        var wOpts = {
            bookType: "xlsx",
            bookSST: false,
            type: "binary"
        };
        return XLSX.write(workbook, wOpts);
    }
    function createDownloadStuffAndStartDownload(workBookData, filename) {
        var stringToArrayBuffer = function (str) {
            var buffer = new ArrayBuffer(str.length);
            var v = new Uint8Array(buffer);
            for (var i = 0; i != str.length; ++i)
                v[i] = str.charCodeAt(i) & 0xff;
            return buffer;
        };
        var blob = new Blob([stringToArrayBuffer(workBookData)], {
            type: "application/octet-stream"
        });
        var url = URL.createObjectURL(blob);
        var downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = filename || "Steam";
        var event;
        if (window.MouseEvent) {
            event = new MouseEvent("click");
        }
        else {
            event = document.createEvent("MouseEvents");
            event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        downloadLink.dispatchEvent(event);
    }
    function CreateBlockingWaitDialog(title, body) {
        if (title === void 0) { title = ""; }
        if (body === void 0) { body = ""; }
        var _this = ShowBlockingWaitDialog(title, body);
        _this.title = function (s) {
            return (_this.m_$Content[0].querySelector(".newmodal_header_border .title_text").innerText = s);
        };
        _this.body = function (s) {
            return (_this.m_$Content[0].querySelector(".newmodal_content .waiting_dialog_throbber").nextSibling.textContent = s);
        };
        return _this;
    }
    function aoa2sheet(aoa, t) {
        var offset = 0;
        var title = [t || "Steam Market Recode Export"];
        var Subtitle = [
            "This tool is not affiliated with Valve or Steam!. Powered by JS-XLSX. Create by CharRun"
        ];
        var Warning = ["导出数据仅供参考，以Steam Market 官方数据为准"];
        var blank = [];
        var header = [title, Subtitle, Warning, blank];
        offset += 4;
        var construct = {};
        var _offset = 0;
        for (var i = 0; i < aoa.length; i++) {
            var type = aoa[i][6];
            var currency = aoa[i][2];
            if (!currency || type == "Revoke")
                continue;
            if (construct[type]) {
                if (construct[type].indexOf(currency) < 0) {
                    construct[type].push(currency);
                }
            }
            else {
                construct[type] = [currency];
            }
            _offset = construct[type].length > _offset ? construct[type].length : _offset;
        }
        var types = Object.keys(construct);
        var typeRow = ["Trade Type", null];
        var currenciesRow = [null, null];
        types.forEach(function (val) {
            typeRow.push(val, null, null);
            currenciesRow.push(null, "currency", "Total Price");
        });
        header.push(typeRow, currenciesRow);
        offset += 2;
        var startRow = offset + 1;
        offset += _offset;
        header.push([], []);
        header.push([
            "itemName",
            "itemType",
            "tradeCurrency",
            "unitPrice",
            "tradeQTY",
            "totalPrice",
            "tradeType",
            "tradeUserName",
            "tradeUserLink",
            "listedDate",
            "actedDate",
            "itemAppId",
            "itemClassId",
            "itemInstanceId",
            "itemMarketFeeApp",
            "itemMarketHashName",
            "itemUnownedContextId",
            "itemUnownedId"
        ]);
        offset += 3;
        header = header.concat(aoa);
        var sheet = XLSX.utils.aoa_to_sheet(header);
        sheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }];
        sheet["!merges"] = [{ s: { r: 1, c: 0 }, e: { r: 1, c: 17 } }];
        sheet["!merges"] = [{ s: { r: 2, c: 0 }, e: { r: 2, c: 17 } }];
        var _loop_1 = function (i) {
            var rB = 0;
            types.forEach(function (val) {
                rB += 3;
                var curr = construct[val][i];
                if (!curr) {
                    return;
                }
                var curP = String.fromCharCode(65 + rB) + startRow;
                var tolP = String.fromCharCode(66 + rB) + startRow;
                sheet[curP] = { t: "s", v: curr };
                sheet[tolP] = {
                    t: "n",
                    f: "SUMIFS(F" + offset + ":F" + (offset + aoa.length - 1) + ",C" + offset + ":C" + (offset +
                        aoa.length -
                        1) + "," + curP + ",G" + offset + ":G" + (offset + aoa.length - 1) + ",\"" + val + "\")"
                };
            });
        };
        for (var i = 0; i < _offset; i++) {
            _loop_1(i);
        }
        return sheet;
    }
})();
