// ==UserScript==
// @name         采集到新系统
// @require    http://code.jquery.com/jquery-2.1.1.min.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  采集到新系统发布
// @author       You
// @match        *://book.kongfz.com/*/*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460779/%E9%87%87%E9%9B%86%E5%88%B0%E6%96%B0%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/460779/%E9%87%87%E9%9B%86%E5%88%B0%E6%96%B0%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addButton();
    function getBooksC(){
        //$.post('https://newbooks.propername.cn/0d7e3264/booksystem/booksCategory/', {name: 'Rebecca'}, function (resp){
        //  console.log(JSON.parse(resp));
        //});

        $.ajax({
         type: 'POST',
         url: 'https://newbooks.propername.cn/0d7e3264/booksystem/booksCategory/',
         headers:{
             'Authorization':Authorization
         },
         data: {name: 'Rebecca'},
         dataType: 'json',
         success: function (resp){
           console.log(JSON.parse(resp));
         }
       });
    }


    function addButton(){
        let xdButton=$("<button></button>").text("采集到新系统");
        xdButton.attr('id','xdButton');
        xdButton.attr('type','button');
        xdButton.css("position","fixed");
        xdButton.css("top","30%");
        xdButton.css("right","100px");
        xdButton.css("width","100px");
        xdButton.css("padding","8px");
        xdButton.css("background-color","#428bca");
        xdButton.css("border-color","#357ebd");
        xdButton.css("color","#fff");
        xdButton.css("-moz-border-radius","10px");
        xdButton.css("-webkit-border-radius","10px");
        xdButton.css("border-radius","10px");
        xdButton.css("-khtml-border-radius","10px");
        xdButton.css("text-align","center");
        xdButton.css("vertical-align","middle");
        xdButton.css("border","1px solid transparent");
        xdButton.css("font-weight","900");
        xdButton.css("font-size","14px");
        $("body").append(xdButton);
        $('#xdButton').bind("click",collectToNewBooks); //绑定点击事件
    }

    function collectToNewBooks(){
        let url = window.location.href
        const reg = /https:\/\/book\.kongfz\.com\/(\d+)\/(\d+)\/?/
        let result = reg.test(url)
        if (!result) {
            alert("解析孔夫子URL失败")
            return
        }
        let shopId = RegExp.$1
        let itemId = RegExp.$2
        window.open(`https://newbooks.propername.cn/490f1dcc/booksystem/task/singleCollect?shopId=${shopId}&itemId=${itemId}`, "_blank");
    }
})();