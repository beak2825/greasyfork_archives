// ==UserScript==
// @name         获取推文数据小工具
// @namespace    https://greasyfork.org/scripts/435236-%E8%8E%B7%E5%8F%96%E6%8E%A8%E6%96%87%E6%95%B0%E6%8D%AE%E5%B0%8F%E5%B7%A5%E5%85%B7/code/%E8%8E%B7%E5%8F%96%E6%8E%A8%E6%96%87%E6%95%B0%E6%8D%AE%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @version      0.1.1
// @description  目前仅支持:头条，百家号，知乎
// @author       mountainguan
// @match        https://baijiahao.baidu.com/builder/rc/content*
// @match        https://mp.toutiao.com/profile_v4/graphic/articles*
// @match        https://www.zhihu.com/creator/manage/creation/article*
// @icon         https://www.google.com/s2/favicons?domain=renaren.com
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/435236/%E8%8E%B7%E5%8F%96%E6%8E%A8%E6%96%87%E6%95%B0%E6%8D%AE%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/435236/%E8%8E%B7%E5%8F%96%E6%8E%A8%E6%96%87%E6%95%B0%E6%8D%AE%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var getDateStr = function () {
        let nowDate = new Date();
        let year = nowDate.getFullYear();
        let month = nowDate.getMonth() + 1 < 10 ? "0" + (nowDate.getMonth() + 1):nowDate.getMonth() + 1;
        let day = nowDate.getDate() < 10 ? "0" + nowDate.getDate() : nowDate.getDate();
        let dateStr = year + "" + month + "" + day;
        return dateStr;
    };

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

    //知乎数据处理
    var getZhihuExportData = function() {
        var eleCsvData = [];
        var url = "https://www.zhihu.com/api/v4/creators/creations/article?start=0&end=0&limit=100&offset=0&need_co_creation=1";
        var target = GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44",
                "Host": "mp.toutiao.com"
            },
            onload: function(response){
                console.log("请求成功");
                var jsonObj = eval('(' + response.responseText + ')');
                //console.log(jsonObj.data);
                for(var o in jsonObj.data){
                    var _ele = jsonObj.data[o];
                    eleCsvData.push('"'+_ele.data.title+'",'+_ele.reaction.read_count+","+_ele.data.updated_time);
                }
            },
            onerror: function(response){
                console.log("请求失败");
            }
        });
        setTimeout(function () {
            var eleDataStr = eleCsvData.join("\r\n");
            saveTxt(eleDataStr,'知乎文章数据'+getDateStr());
        }, 1000);
    };
    //知乎界面
    var drawZhihuBtn = function() {
        let mainNav = document.querySelector('.Tabs-item--noMeta:last-child');
        mainNav.style = "min-width:200px; width: 40%;";
        let insertElement=document.createElement("BUTTON");
        let t=document.createTextNode("下载推文数据");
        insertElement.appendChild(t);
        insertElement.setAttribute('class',"Button Button--grey Button--withLabel");
        insertElement.style = "flex: auto;margin-right:20px;";
        insertElement.onclick = function () {
            getZhihuExportData();
        };
        document.querySelector('.Tabs').appendChild(insertElement);
    };

    //头条号数据处理
    var getToutiaoExportData = function() {
        var i=2;
        var eleCsvData = [];
        while (i>=1) {
            (function(i){
                var url = "https://mp.toutiao.com/mp/agw/creator_center/list?type=2&status=0&start_cursor=0&end_cursor=0&size=50&mode=2&need_stat=true&page_time=%7B%22index%22%3A"+i+"%2C%22time_stamp%22%3A%220%22%7D";
                var target = GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44",
                        "Host": "mp.toutiao.com"
                    },
                    onload: function(response){
                        console.log("请求成功");
                        var jsonObj = eval('(' + response.responseText + ')');
                        //console.log(jsonObj.contents);
                        for(var o in jsonObj.contents){
                            var _ele = jsonObj.contents[o];
                            eleCsvData.push('"'+_ele.article_attr.title+'",'+_ele.article_stat.counters[0].Count+","+_ele.article_stat.counters[1].Count+","+_ele.article_attr.show_time);
                        }
                    },
                    onerror: function(response){
                        console.log("请求失败");
                    }
                });
             })(i);
            i--;
        }
        setTimeout(function () {
            var eleDataStr = eleCsvData.join("\r\n");
            saveTxt(eleDataStr,'头条号数据'+getDateStr());
        }, 2000);
    };

    //头条号界面
    //https://mp.toutiao.com/mp/agw/creator_center/list?type=2&status=0&start_cursor=0&end_cursor=0&size=50&mode=2&need_stat=true
    var drawToutiaoBtn = function() {
        let mainNav = document.querySelector('.byte-tabs-header');
        mainNav.style = "min-width:850px; width: 90%;";
        let insertElement=document.createElement("BUTTON");
        let t=document.createTextNode("下载推文数据");
        insertElement.appendChild(t);
        insertElement.setAttribute('class',"byte-btn byte-btn-primary byte-btn-size-large byte-btn-shape-square");
        insertElement.style = "flex: auto;";
        insertElement.onclick = function () {
            getToutiaoExportData();
        };
        document.querySelector('.byte-tabs-header-wrapper').appendChild(insertElement);
    };

    //百家号数据处理
    var getBaijiahaoExportData = function() {
        var i=5;
        var eleCsvData = [];
        while (i>=1) {
            (function(i){
                var url = "https://baijiahao.baidu.com/pcui/article/lists?type=news&collection=&currentPage="+i+"&pageSize=20";
                var target = GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 Edg/95.0.1020.44",
                        "Host": "baijiahao.baidu.com"
                    },
                    onload: function(response){
                        console.log("请求成功");
                        var jsonObj = eval('(' + response.responseText + ')');
                        // console.log(jsonObj.data.list);
                        for(var o in jsonObj.data.list){
                            var _ele = jsonObj.data.list[o];
                            eleCsvData.push('"'+_ele.title+'",'+_ele.rec_amount+","+_ele.read_amount+","+_ele.publish_time);
                        }
                    },
                    onerror: function(response){
                        console.log("请求失败");
                    }
                });
             })(i);
            i--;
        }
        setTimeout(function () {
            var eleDataStr = eleCsvData.join("\r\n");
            saveTxt(eleDataStr,'百家号数据'+getDateStr());
        }, 4000);
    };
    //百家号界面
    var drawBaijiahaoBtn = function() {
        let mainNav = document.querySelector('.cheetah-tabs-nav-list');
        mainNav.style = "min-width:900px;width:90%;";
        let insertElement=document.createElement("BUTTON");
        let t=document.createTextNode("下载推文数据");
        insertElement.appendChild(t);
        insertElement.setAttribute('class',"cheetah-btn cheetah-btn-primary");
        insertElement.style = "flex: auto;";
        insertElement.onclick = function () {
            getBaijiahaoExportData();
        };
        document.querySelector('.cheetah-tabs-nav-wrap').appendChild(insertElement);
    };

    //函数主入口
    var main = function() {
        if (document.domain == 'baijiahao.baidu.com') {
            drawBaijiahaoBtn();
        } else if (document.domain == 'mp.toutiao.com') {
            setTimeout(function () {
                drawToutiaoBtn();
            }, 1000);
        } else if (document.domain == 'www.zhihu.com') {
            setTimeout(function () {
                drawZhihuBtn();
            }, 1000);
        }
    };

    main();
})();