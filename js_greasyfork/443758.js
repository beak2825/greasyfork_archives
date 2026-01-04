// ==UserScript==
// @name         新商盟（chengyingming）
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  新商盟自动添加烟的数据
// @author       You
// @match        https://docs.github.com/en/developers/webhooks-and-events/webhooks/creating-webhooks
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @include      *://gz.xinshangmeng.com/eciop/orderForCC/cgtListForCC*
// @require    https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/443758/%E6%96%B0%E5%95%86%E7%9B%9F%EF%BC%88chengyingming%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/443758/%E6%96%B0%E5%95%86%E7%9B%9F%EF%BC%88chengyingming%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var htmlBox=$(".orderinfo");
    htmlUi();
    document.getElementById("autoHq").addEventListener("click", autoHq);
    document.getElementById("autoTc").addEventListener("click", autoTc);
    document.getElementById("autoQc").addEventListener("click", autoQc);
    var liArray=$("#newul").find('li');
    var len=liArray.length
   
    var htmlHq="<button>自动获取（自动填充数量1）</button>";
    //自动填充
    function autoTc(){
        for(var i=0;i<len;i++){
            var initNum=parseInt($(liArray[i]).find(".cgt-col-qtl-lmt").html());
            initNum = isNaN(initNum) ?0:initNum;
            console.log(initNum);
            if(initNum != 0){
                $(liArray[i]).find("input[name='ord_qty']").val(initNum)
            }
        }

    }
    //自动清楚
    function autoQc(){
        for(var i=0;i<len;i++){
            console.log(i)
            var initNum=parseInt($(liArray[i]).find(".cgt-col-qtl-lmt").html());
            initNum = isNaN(initNum) ?0:initNum;
            console.log(initNum);
            if(initNum == 0){
                $(liArray[i]).css({display:'none'})
            }
        }
    }
    //自动获取
    function autoHq(){
        for(var i=0;i<len;i++){
            var initNum=$(liArray[i]).find("input[name='req_qty']").val();
            if(initNum == 0){
                $(liArray[i]).find("input[name='req_qty']").val(1)
            }
        }
    }
    function htmlUi(){
       htmlBox.append('<input type="button" class="xsm-pribtn" id="autoHq" onClick="autoHq" value="自动获取">');
       htmlBox.append('<input type="button" class="xsm-pribtn" id="autoTc" onClick="autoTc" value="自动填充">');
       htmlBox.append('<input type="button" class="xsm-pribtn" id="autoQc" onClick="autoQc" value="自动清楚">');

    }
    //console.log($("#newul").find('li').find(".xsm-order-list-shuru-input").val())

    // Your code here...
})();