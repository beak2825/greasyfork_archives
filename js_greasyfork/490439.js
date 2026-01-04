// ==UserScript==
// @name         万达图书系统扩展集合线上
// @require    https://code.jquery.com/jquery-2.1.1.min.js
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  万达图书系统扩展集合线上描述
// @author       You
// @match        *://book.kongfz.com/*
// @match        *://item.kongfz.com/*
// @match        *://shop.kongfz.com/*
// @match        *://search.kongfz.com/*
// @match        *://*.kongfz.cn/*
// @match        *://*.997788.com/*
// @match        *://*.7788.com/*
// @match        *://qn.taobao.com/home.htm/trade-platform/tp/detail*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490439/%E4%B8%87%E8%BE%BE%E5%9B%BE%E4%B9%A6%E7%B3%BB%E7%BB%9F%E6%89%A9%E5%B1%95%E9%9B%86%E5%90%88%E7%BA%BF%E4%B8%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/490439/%E4%B8%87%E8%BE%BE%E5%9B%BE%E4%B9%A6%E7%B3%BB%E7%BB%9F%E6%89%A9%E5%B1%95%E9%9B%86%E5%90%88%E7%BA%BF%E4%B8%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var baseUrl = "https://wanda.xiaozhuaizhuai.top/0d7e3264";
    //baseUrl = "http://localhost:8025";
    var webBaseUrl = "https://wanda.xiaozhuaizhuai.top/490f1dcc";
    //webBaseUrl = "http://localhost:9091";
    var extendHtmlKey = "extendHtml";
   
      init();
       async function init(){

        let newDOMContentLoadedStr =
        `
        <script>
        var newDOMContentLoadedPromise = new Promise(resolve => {
        console.log('222222222');
	    window.addEventListener('load', function() {
	        console.log('DOM 已经加载完成');
	        resolve(1)
		    //在这里放置你的代码
	    })
        })
        function newDOMContentLoaded(){
            return newDOMContentLoadedPromise;
        }
        </script>
        `
        $('body').append(newDOMContentLoadedStr)

        let extendHtml = localStorage.getItem(extendHtmlKey);
        //console.log(extendHtml)
        if(extendHtml){
            $('body').append(extendHtml);
        }
        getTampermonkeyExtend().then((res)=>{
            //console.log(res)
            localStorage.setItem(extendHtmlKey, res);
            if(!extendHtml){
                $('body').append(res);
            }else{
                if(extendHtml != res){
                    window.location.reload();
                }
            }
        })
    }

    function getTampermonkeyExtend() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'get',
                //url: baseUrl + '/booksystem/public/getTampermonkeyExtend',
                url: 'https://wanda.xiaozhuaizhuai.top/static/tampermonkeyExtend.html?_t='+Date.now(),
                headers: {
                    //'Authorization':Authorization
                },
                //data: {name: 'Rebecca'},
                //dataType: 'json',
                success: function (res) {
                    resolve(res)
                },
                error: function (err) {
                    console.log(err)
                    alert("获取油猴脚本失败：" + err);
                    reject(err)
                }
            });
        })

    }

})();