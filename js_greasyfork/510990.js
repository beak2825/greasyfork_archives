// ==UserScript==
// @name         京东快速下单
// @namespace    http://tampermonkey.net/
// @description  qq806350554
// @version      3.1
// @license     qq806350554
// @description  作者qq806350554
// @author       You
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.6.1.js
// @match       https://cart.jd.com/cart_index
// @match       https://pay.jd.com/d/cashier-support/finishPage/*
// @match       https://cart.jd.com/addToCart.html?*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/510990/%E4%BA%AC%E4%B8%9C%E5%BF%AB%E9%80%9F%E4%B8%8B%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/510990/%E4%BA%AC%E4%B8%9C%E5%BF%AB%E9%80%9F%E4%B8%8B%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.location.href.indexOf(`cart.jd.com/addToCart.html`)>=0){
        window.open("https://cart.jd.com/cart_index#none", "_self");
}

     if(window.location.href.indexOf(`pay.jd.com/d/cashier-support/finishPage/`)>=0){
        window.open("https://cart.jd.com/cart_index", "_self");
}





    var dingshi=setInterval(
        function(){
            if($(".item-seleted").length>0){
                console.log(1111)
                setTimeout(function(){ $('.common-submit-btn')[0].click()
                                     console.log('点击')
                                     },1000)
                clearInterval(dingshi)
            }

        }
        ,500)
    // Your code here...
    var dddd=`
#xundian{
    position: fixed;
    top: 10%;
    right: 10%;
    z-index: 999;
}
#xundian_textarea {
    display: block;
    height: 100px;
    width: 115px;
}
#queding{
width: 115px;
}
div#url_div {
    border: 1px solid #ccc;
    border-radius: 5px;

    background: #f7f7f7;
}
.shoutu_down {
    color: #fff;
    background-color: #999c98;
    border: 1px solid #999c98;
    font-size: 13px;
    position: absolute;
    line-height: 20px;
    text-align: center;
    border-radius: 0 5px 0 px;
    border-radius: 0px 5px 5px 0px;
    width: 64px;
    height: 22px;
    top: 0px;
    display: block;
    right: -66px;
    cursor: pointer;
}
a.url_li:hover {
    background: #a7a096;
    color: #fff;
}
a.url_li {
    display: block;
    padding-left: 5px;
    /* background-color: #f3f3f333; */
    color: #666;
    text-align: left;
    line-height: 24px;
    font-size: 12px;
    border-bottom: 1px solid #fff;
}

`
        var style = document.createElement("style");
        style.type = "text/css";
        var text = document.createTextNode(dddd);
        style.appendChild(text);
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    // 添加css结束


    $("html").append(`<div id='xundian'>
<textarea id='xundian_textarea' o>`+localStorage[ 'sku' ]+`</textarea>
</div>`)
    $("#xundian").append(`<div id='url_div'></idv>`)
    //$('#xundian').click(function(){alert(3)})
    $("#xundian_textarea").bind('input propertychange',function(){
       localStorage[ 'sku' ]=$("#xundian_textarea").val()
         bianli()
    })
//     $('#queding').click(function(){
//         localStorage[ 'sku' ]=$("#xundian_textarea").val()

//          bianli()
//     })
     bianli()
    function bianli(){

        $(".url_li").remove()
        var str=$("#xundian_textarea").val().replace(" ","").trim()
        str=$.trim(str);
        var arr =str.split('\n')
        for(var i=0;i<arr.length;i++){
            $("#url_div").append(`<span style="display: block;position: relative;"><a class='url_li' id='`+$.trim(arr[i])+`' href="https://cart.jd.com/gate.action?pid=`+ $.trim(arr[i])+`&pcount=1&ptype=1">`+$.trim(arr[i])+`</a></span>`)
       
        }
        $("#"+localStorage[ 'sku_click' ]+"").css('background','#999c98')
           // $("#"+localStorage[ 'sku_click' ]+"").parent().append(`<span class='shoutu_down' name=`+localStorage[ 'sku_click' ]+`>首图下载</span>`)

    }

    //     下载按钮点击
    $(".shoutu_down").click(function(){
        let u_lujing=$("ul.lh li:first img").attr('src').replace("/n5/","/n12/").replace(".avif","")
      // alert( u_lujing)
        GM_download(u_lujing,$(this).attr("name")+'.jpg')
        ///alert($(this).attr("name"))
    })
    //     复制到剪切板
    function copyToClipboard(s) {
            if (window.clipboardData) {
                window.clipboardData.setData('text', s);
            } else {
                (function(s) {
                    document.oncopy = function(e) {
                        e.clipboardData.setData('text', s);
                        e.preventDefault();
                        document.oncopy = null;
                    }
                })(s);
                document.execCommand('Copy');
            }
        }
    $(".url_li").click(function(){
      //  alert(this.id)
        localStorage[ 'sku_click' ]=this.id

       // alert($(this).parent())
        copyToClipboard(this.id)

    })
})();





