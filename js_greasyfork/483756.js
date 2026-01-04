// ==UserScript==
// @name         mant扩展集合
// @require    http://code.jquery.com/jquery-2.1.1.min.js
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  mant扩展集合的插件
// @author       You
// @match        *://book.kongfz.com/*
// @match        *://qn.taobao.com/home.htm/trade-platform/tp/detail*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483756/mant%E6%89%A9%E5%B1%95%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/483756/mant%E6%89%A9%E5%B1%95%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var baseUrl = "https://newbooks.propername.cn/0d7e3264";
    //baseUrl = "http://localhost:8083";
    var webBaseUrl = "https://newbooks.propername.cn/490f1dcc";
    //webBaseUrl = "http://localhost:9091";
    var extendHtmlKey = "extendHtml";
    window.onload = function(){
        init();
    }

    async function init(){
        let extendHtml = localStorage.getItem(extendHtmlKey);
        //console.log(extendHtml)
        if(extendHtml){
            $('body').append(extendHtml);
        }
        getTampermonkeyExtend().then((res)=>{
            //console.log(res)
            if (res.code == 200) {
                localStorage.setItem(extendHtmlKey, res.data);
                if(!extendHtml){
                    $('body').append(res.data);
                }else{
                    if(extendHtml != res.data){
                        window.location.reload();
                    }
                }
            } else {
                alert(res.message);
            }
        })
    }

    function getTampermonkeyExtend() {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: 'get',
                url: baseUrl + '/booksystem/public/getTampermonkeyExtend',
                headers: {
                    //'Authorization':Authorization
                },
                //data: {name: 'Rebecca'},
                dataType: 'json',
                success: function (res) {
                    resolve(res)
                },
                error: function (err) {
                    alert("获取油猴脚本失败");
                    reject(err)
                }
            });
        })

    }

})();