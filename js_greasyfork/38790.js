// ==UserScript==
// @name         豆瓣评分获取器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  根据指定特征字符内容获取对应相关的豆瓣评分及评论人数，上映日期，源名等信息。（未使用豆瓣API）
// @author       zhuzhuyule
// @match        http://www.dygang.net/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/38790/%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%E8%8E%B7%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/38790/%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%E8%8E%B7%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.classlinkclass').forEach( item=>{
        getMovie(item,item.innerText);
    });

    function getMovie(link,name) {
        name = name.replace(/\[.*/,'');
        GM_xmlhttpRequest({
            method: "GET",
            url: 'https://movie.douban.com/j/subject_suggest?q='+name,
            onload: function(response) {
                if (response.status == 200 ) {
                    let json = JSON.parse(response.responseText);
                    console.log(json);
                    json.forEach(function(item){
                        if (item.type == "movie")
                            getUrl(link,item.title,item.sub_title,item.year,item.url);
                    });
                } else {
                    console.log(response.statusText);
                }
            }
        });
    }

    function getUrl(link,title,sub_title,year,url){
        var tdElement = link.parentElement;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status == 200 ) {
                    var div = document.createElement('div');
                    var content = response.responseText.replace(/src="[^"]*/,'');
                    div.innerHTML = content.replace(/"https?:\/\/[^"]*"/g,'""');
                    var value = div.querySelector('strong.ll.rating_num').innerText;
                    var rate;
                    var count;
                    if (value){
                        rate = parseFloat(value);
                        count = div.querySelector('a.rating_people').innerText|| '0';
                    }else{
                        value = '暂无';
                        rate = 0;
                        count = "0";
                    }
                    var color = (rate> 8 ? "#f44336": (rate> 6 ? "#ffc107": "#8bc34a"));
                    var ratesElement = tdElement.querySelector("span");
                    if (!ratesElement){
                        ratesElement = document.createElement("span");
                        tdElement.appendChild(ratesElement);
                    }
                    ratesElement.innerHTML = ratesElement.innerHTML + `<a id="${parseInt(count)}" href="${url}"  style="background: ${color};font-size: 14px;border-radius: 4px;margin: 0 3px;padding: 1px 4px;color: white;" title="《${title + '》&#10;<'+sub_title+ '>&#10;年份：'+year+ '&#10;评论数：'+count}">${value}</a>`;
                    var rates = ratesElement.querySelectorAll('a');
                    if (rates.length > 1){
                        var result = '';
                        var arr = [];
                        rates.forEach(item => {
                            arr.push(item);
                        });
                        arr = arr.sort((a,b)=>{ return parseInt(a.id) < (b.id); });
                        arr.forEach(item => {
                            result = result + item.outerHTML;
                        });
                        ratesElement.innerHTML  = result;
                    }
                } else {
                    // 失败，根据响应码判断失败原因:
                    console.log(response.statusText);
                }
            }
        });
    }
})();