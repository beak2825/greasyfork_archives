// ==UserScript==
// @name         BT之家 附加豆瓣评分，附件直接下载
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  BT之家 根据指定特征字符内容获取对应相关的豆瓣评分及评论人数，上映日期，源名等信息（如遇到无法显示评分请登录豆瓣，刷新请求过多时豆瓣会禁止抓取数据）；附件点击直接下载；
// @author       zhuzhuyule, skyyearxp
// @match        *://btbtt.co/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/368867/BT%E4%B9%8B%E5%AE%B6%20%E9%99%84%E5%8A%A0%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%EF%BC%8C%E9%99%84%E4%BB%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/368867/BT%E4%B9%8B%E5%AE%B6%20%E9%99%84%E5%8A%A0%E8%B1%86%E7%93%A3%E8%AF%84%E5%88%86%EF%BC%8C%E9%99%84%E4%BB%B6%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //论坛帖子列表插入豆瓣电影评分
    document.querySelectorAll('.subject').forEach( item=>{
        var itm = item.querySelector('.subject_link');
        if (itm != null){
            getMovie(itm, item.innerText);
        }
    });

    //单贴插入豆瓣电影评分
    try
    {
        var item = document.querySelectorAll('.post')[0].querySelectorAll('h2')[0];
        getMovie(item, item.innerText);
    }catch(e){}

    //单贴下载地址直接替换成最终下载地址
    document.querySelectorAll('a[href^="attach-dialog"]').forEach( item=>{
        var dialogUrl = item.href;
        console.log(dialogUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: dialogUrl,
            onload: function(response) {
                if (response.status == 200 ) {
                    var div = document.createElement('div');
                    //var content = response.responseText.replace(/src="[^"]*/,'');
                    //div.innerHTML = content.replace(/"https?:\/\/[^"]*"/g,'""');
                    div.innerHTML = response.responseText;
                    var downUrl = div.querySelector('a[href^="attach-download"]')
                    console.log(downUrl);
                    if (downUrl != null){
                        item.href = downUrl.href;
                    }
                } else {
                    console.log(response.statusText);
                }
            }
        });
    });

    function getMovie(link, name) {
        //name = name.replace(/\[.*/,'');
        // [BT下载][熊出没·变形记][HD-MP4/1.61GB][国语中文字幕][1080P][虾狐精品]

        var pos = name.indexOf('[');
        if (pos==-1) return;
        pos += 1;
        var pos2 = name.indexOf(']',pos);
        var year = name.substr(pos, pos2-pos);

        pos = name.indexOf('下载][');
        if (pos==-1) return;
        pos += 4;
        pos2 = name.indexOf(']',pos);
        name = name.substr(pos, pos2-pos);

        //按 中文名 + 英文名 的节奏砍掉英文名
        pos = name.indexOf(' ');
        if (pos>0){
            name = name.substr(0, pos);
        }
        //按 中文名1/中文名2 的节奏砍掉第二种名字
        pos = name.indexOf('/');
        if (pos>0){
            name = name.substr(0, pos);
        }
        //砍掉 . 后面的名字
        pos = name.indexOf('.');
        if (pos>0){
            name = name.substr(0, pos);
        }

        var requestUrl = 'https://movie.douban.com/j/subject_suggest?q='+name;
        console.log(requestUrl);

        GM_xmlhttpRequest({
            method: "GET",
            url: requestUrl,
            onload: function(response) {
                if (response.status == 200 ) {
                    let json = JSON.parse(response.responseText);
                    console.log(json);

                    var matchYear = false;

                    //先按年份匹配的查询
                    json.forEach(function(item){
                        if (item.type == "movie" && item.title.startsWith(name) && item.year == year )
                        {
                            matchYear = true;
                            getUrl(link,item.title,item.sub_title,item.year,item.url);
                        }
                    });

                    //没有对应年份的则查询全部评价
                    if (!matchYear){
                        json.forEach(function(item){
                            if (item.type == "movie" && item.title.startsWith(name)){
                                getUrl(link,item.title,item.sub_title,item.year,item.url);
                            }
                        });
                    }
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
                    //if (!ratesElement){
                    ratesElement = document.createElement("span");
                    //tdElement.appendChild(ratesElement);
                    insertAfter(ratesElement, link);
                    //}
                    ratesElement.innerHTML = ratesElement.innerHTML + `<a id="${parseInt(count)}" href="${url}" target="_blank" style="background: ${color};font-size: 14px;border-radius: 4px;margin: 0 3px;padding: 1px 4px;color: white;" title="《${title + '》&#10;<'+sub_title+ '>&#10;年份：'+year+ '&#10;评论数：'+count}">${value}</a>`;
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
                        ratesElement.innerHTML = result;
                    }
                } else {
                    // 失败，根据响应码判断失败原因:
                    console.log(response.statusText);
                }
            }
        });
    }

    function insertAfter(newEl, targetEl)
    {
        var parentEl = targetEl.parentNode;

        if(parentEl.lastChild == targetEl)
        {
            parentEl.appendChild(newEl);
        }else
        {
            parentEl.insertBefore(newEl,targetEl.nextSibling);
        }
    }

})();