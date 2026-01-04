// ==UserScript==
// @name         百度首页，搜索2019以后的百度知道回答
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  搜索2019以后的
// @author       You
// @require	     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match        *://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388120/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%EF%BC%8C%E6%90%9C%E7%B4%A22019%E4%BB%A5%E5%90%8E%E7%9A%84%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/388120/%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5%EF%BC%8C%E6%90%9C%E7%B4%A22019%E4%BB%A5%E5%90%8E%E7%9A%84%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

jQuery.noConflict();
jQuery(function(){
    jQuery(".s_form_wrapper").append(`<button id="my-search" value="百度一下" style="font-size:20px;margin-left: 20px;margin-top:10px;">搜索</button>`);

    var paramsToSearchUrl = (word, pn, startTime, endTime) => {
        /*
        JSON.stringify('wd=%E7%AC%AC%E4%BA%94%E4%BA%BA%E6%A0%BC&pn=10&oq=%E7%AC%AC%E4%BA%94%E4%BA%BA%E6%A0%BC&ct=2097152&ie=utf-8&si=jingyan.baidu.com&rsv_idx=1&rsv_pq=822fa42900038620&rsv_t=6c4dOj7hutO0DbBLzqLSvERKWYymTrJUiJ82cE31aQYtFw6k3fEzWFhZw0E&gpc=stf%3D1522512000%2C1523635198%7Cstftype%3D2&tfflag=1'.split('&').map(e=>{return {key:e.split('=')[0],value:e.split('=')[1]}}))
        */

        //
        var paramsStr = [{
            "key": "wd",
            "value": encodeURIComponent(word)
        }, {
            "key": "pn",
            "value": pn
        }, {
            "key": "si",
            "value": "zhidao.baidu.com"
        }, {
            "key": "gpc",
            "value": `stf%3D${new Date(startTime).valueOf() / 1000 | 0}%2C${new Date(endTime).valueOf() / 1000 | 0}%7Cstftype%3D1`
        },
            {
                "key": "ct",
                "value": "2097152"
            }
        ].map(e => e.key + '=' + e.value).join('&');

        var result = 'https://www.baidu.com/s?' + paramsStr;
        return result;
    };

    jQuery("#my-search").click(function(e){
        if(e.preventDefault){
            e.preventDefault();
        }else{
            window.event.returnValue == false;
        }
        let now = new Date();
        let nowStamp = now.valueOf();

        new Date().toLocaleDateString().replace(/\//g, '-');

        window.open(paramsToSearchUrl(jQuery("#kw").val().trim(), 0, new Date('2019-1-1').valueOf(), nowStamp));
    });
});