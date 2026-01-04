// ==UserScript==
// @name         m-team imdb分数查询优化及页面美化
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  mteam 电影板块, 根据 imdb 分数高亮颜色
// @match        https://kp.m-team.cc/*
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @connect      *
// @license MIT
// @run-at document-end
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456498/m-team%20imdb%E5%88%86%E6%95%B0%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96%E5%8F%8A%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/456498/m-team%20imdb%E5%88%86%E6%95%B0%E6%9F%A5%E8%AF%A2%E4%BC%98%E5%8C%96%E5%8F%8A%E9%A1%B5%E9%9D%A2%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==
// 对使用GM_xmlhttpRequest返回的html文本进行处理并返回DOM树

if (typeof GM_xmlhttpRequest === "undefined") {
    alert("不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey");
    return;
}
function page_parser(responseText) {
    // 替换一些信息防止图片和页面脚本的加载，同时可能加快页面解析速度
    // responseText = responseText.replace(/s+src=/ig, ' data-src='); // 图片，部分外源脚本
    // responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, ''); //页面脚本
    return (new DOMParser()).parseFromString(responseText, 'text/html');
}

function getDoc(url, meta, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (responseDetail) {
            if (responseDetail.status === 200) {
                let doc = page_parser(responseDetail.responseText);
                callback(doc, responseDetail, meta);
            }
        }
    });
}

function parseLdJson (raw) {
    return JSON.parse(raw.replace(/\n/ig,''));
}

function getJSON(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'Accept': 'application/json'
        },
        onload: function (response) {
            if (response.status >= 200 && response.status < 400) {
                callback(JSON.parse(response.responseText), url);
            } else {
                callback(false, url);
            }
        }
    });
}

//此处可自行编辑不同分数下的颜色，颜色名称可百度“JavaScript颜色表”
function setColor($el,score){
    var color;
    if(score>=8) color = "MediumVioletRed";
    else if (score >= 6) color ="DarkGreen";
    else if (score >= 5) color = "DarkSlateGray";
    else if (score >= 0.1) color = "gray";
    else color ="black";

    $el.css("color", color);
    if(score>=0) $el.html(score);
    else if($el.html()=="N/A")$el.html("N/A")
    var p = $el.parents(".torrentname");
    p.find("b").css("color",color)
    p.css("color",color);
}

(function($) {
    'use strict';
    try {
    console.log("m-team imdb分数查询优化及页面美化 脚本启动");
    var imdb_test = /imdb\.com/
    var links = $(".embedded a").filter(function (link) { return imdb_test.test($(this).attr("href")) });
    $(links).each( function(){
        var $el = $(this);
        $el.css("font-size","12pt")
        var score;
        if($el.text()>0){
            setColor($el,$el.text());
        }else{
            var imdb_link=($(this)["0"]["href"]);
            if(imdb_link.search("tt0")!=-1){
                imdb_link=imdb_link.replace(/tt0/,"tt");
                $el.attr("href",imdb_link);
                $el.attr("target","_blank");
            }
            getDoc(imdb_link, null, function (doc) {
              let ld_json_imdb;
              try {
                        ld_json_imdb = parseLdJson($('head > script[type="application/ld+json"]', doc).text());
                        score=ld_json_imdb["aggregateRating"]["ratingValue"];
                        setColor($el,score);
              }catch(e){console.log(e);}
        });
        }

    });
    } catch(e){
    GM_log(e)
    }

})(jQuery);808080

