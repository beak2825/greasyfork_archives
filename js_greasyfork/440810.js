// ==UserScript==
// @name         西瓜运营数据小工具
// @namespace    https://www.renaren.com/
// @version      0.1
// @description  用于导出西瓜视频数据
// @author       mountainguan
// @match        https://studio.ixigua.com/data
// @icon         https://sf1-cdn-tos.douyinstatic.com/obj/eden-cn/lpqpflo/ixigua_favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_downloads
// @license      None
// @downloadURL https://update.greasyfork.org/scripts/440810/%E8%A5%BF%E7%93%9C%E8%BF%90%E8%90%A5%E6%95%B0%E6%8D%AE%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/440810/%E8%A5%BF%E7%93%9C%E8%BF%90%E8%90%A5%E6%95%B0%E6%8D%AE%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var saveTxt = function (data,filename='导出') {
        var FileName = filename+'.csv';
        var Content = data; // 文本内容

        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(Content));
        element.setAttribute('download', FileName);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    var lastDateStr = function () {
        let nowDate = new Date(new Date()-24*60*60*1000);
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1):nowDate.getMonth() + 1;
        let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        let dateStr = year + "-" + month + "-" + day;
        return dateStr;
    };

    //导出全部运营数据
    var getTotalDisplayExportData = function() {
        var eleCsvData = [];
        eleCsvData.push("日期,总播放量,粉丝播放量");
        var url = "https://studio.ixigua.com/api/data/data_trend_v2?params=%7B%22startDate%22%3A%222016-03-09%22%2C%22endDate%22%3A%22"+lastDateStr()+"%22%2C%22timeRangeType%22%3A0%2C%22metricList%22%3A%5B1%2C16%5D%7D";
        //console.log(url)
        var target = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44",
                "Host": "studio.ixigua.com"
            },
            onload: function(response){
                console.log("请求成功");
                var jsonObj = eval('(' + response.responseText + ')');

                for(var o in jsonObj.data.CreatorDataTrends[0]['Details']){
                    var _ele = jsonObj.data.CreatorDataTrends[0]['Details'][o];
                    eleCsvData.push(jsonObj.data.dates[o]+','+_ele.TotalCount+','+_ele.FansCount);
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
        setTimeout(function () {
            var eleDataStr = eleCsvData.join("\r\n");
            saveTxt(eleDataStr,'西瓜每日播放量数据'+lastDateStr());
        }, 1000);
    };

    var getTotalCommentExportData = function() {
        var eleCsvData = [];
        eleCsvData.push("日期,总评论量,粉丝评论量");
        var url = "https://studio.ixigua.com/api/data/data_trend_v2?params=%7B%22startDate%22%3A%222016-03-09%22%2C%22endDate%22%3A%22"+lastDateStr()+"%22%2C%22timeRangeType%22%3A0%2C%22metricList%22%3A%5B3%2C16%5D%7D";
        //console.log(url)
        var target = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44",
                "Host": "studio.ixigua.com"
            },
            onload: function(response){
                console.log("请求成功");
                var jsonObj = eval('(' + response.responseText + ')');

                for(var o in jsonObj.data.CreatorDataTrends[0]['Details']){
                    var _ele = jsonObj.data.CreatorDataTrends[0]['Details'][o];
                    eleCsvData.push(jsonObj.data.dates[o]+','+_ele.TotalCount+','+_ele.FansCount);
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
        setTimeout(function () {
            var eleDataStr = eleCsvData.join("\r\n");
            saveTxt(eleDataStr,'西瓜每日评论数据'+lastDateStr());
        }, 1000);
    };


    var getTotalFansExportData = function() {
        var eleCsvData = [];
        eleCsvData.push("日期,粉丝量,粉丝异动量");
        var url = "https://studio.ixigua.com/api/data/data_trend_v2?params=%7B%22startDate%22%3A%222016-03-09%22%2C%22endDate%22%3A%22"+lastDateStr()+"%22%2C%22timeRangeType%22%3A0%2C%22metricList%22%3A%5B6%2C16%5D%7D";
        //console.log(url)
        var target = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44",
                "Host": "studio.ixigua.com"
            },
            onload: function(response){
                console.log("请求成功");
                var jsonObj = eval('(' + response.responseText + ')');

                var lastDayCount = jsonObj.data.CreatorDataTrends[0]['Details'][0].TotalCount;
                for(var o in jsonObj.data.CreatorDataTrends[0]['Details']){
                    var _ele = jsonObj.data.CreatorDataTrends[0]['Details'][o];
                    eleCsvData.push(jsonObj.data.dates[o]+','+_ele.TotalCount+','+(_ele.TotalCount - lastDayCount));
                    lastDayCount = _ele.TotalCount;
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
        setTimeout(function () {
            var eleDataStr = eleCsvData.join("\r\n");
            saveTxt(eleDataStr,'西瓜每日粉丝数据'+lastDateStr());
        }, 1000);
    };

    var drawTotalDisplayExportBtn = function() {
        let insertElement=document.createElement("BUTTON");
        let t=document.createTextNode("播放量数据");
        insertElement.appendChild(t);
        insertElement.setAttribute('class',"byte-btn byte-btn-primary byte-btn-size-small byte-btn-shape-square");
        insertElement.style = "margin-left:10px;";
        insertElement.onclick = function () {
            getTotalDisplayExportData();
        };
        document.querySelector('.data-module-card__title').appendChild(insertElement);
    };

    var drawTotalCommentExportBtn = function() {
        let insertElement=document.createElement("BUTTON");
        let t=document.createTextNode("评论数数据");
        insertElement.appendChild(t);
        insertElement.setAttribute('class',"byte-btn byte-btn-primary byte-btn-size-small byte-btn-shape-square");
        insertElement.style = "margin-left:10px;";
        insertElement.onclick = function () {
            getTotalCommentExportData();
        };
        document.querySelector('.data-module-card__title').appendChild(insertElement);
    };

    var drawTotalFansExportBtn = function() {
        let insertElement=document.createElement("BUTTON");
        let t=document.createTextNode("粉丝数据");
        insertElement.appendChild(t);
        insertElement.setAttribute('class',"byte-btn byte-btn-primary byte-btn-size-small byte-btn-shape-square");
        insertElement.style = "margin-left:10px;";
        insertElement.onclick = function () {
            getTotalFansExportData();
        };
        document.querySelector('.data-module-card__title').appendChild(insertElement);
    };

    setTimeout(function () {
        drawTotalDisplayExportBtn();
        drawTotalCommentExportBtn();
        drawTotalFansExportBtn();
    }, 1000);
})();