// ==UserScript==
// @name         易物流批量查询
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  功能介绍：支持EIR批量查询
// @author       You
// @match        https://www.156yt.cn/*
// @require      https://cdn.staticfile.org/jquery/3.5.0/jquery.min.js
// @run-at       document-body
// @grant        unsafeWindow
// @license      No license
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/432546/%E6%98%93%E7%89%A9%E6%B5%81%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/432546/%E6%98%93%E7%89%A9%E6%B5%81%E6%89%B9%E9%87%8F%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==
(function (){
    var confirm=function(){return 1}
    $("body").append('<div style="z-index:999;position: fixed; bottom: 20px; left: calc(50% - 100px);"><input id="orderNo" type="text" style="background:#fff;border:1px solid #bbb" width="100px" height="25px"/><a style="margin-left:10px;color:#000;" href="javascript:void(0);" id="query">点击查询</a><a style="margin-left:10px;color:#000;" href="javascript:void(0);" id="reset">重置</a>')
    $("#reset").click(function(){window.location.reload()})
    $("#query").click(function(){
        var text = $("#orderNo").val();
        var array = text.split(",");
        var arrayLength = array.length;
        var Shipping = array[arrayLength];
        console.log(Shipping)

            if(arrayLength){
                var x = 0;
                var interval = setInterval(function(){
                    if(x<arrayLength){
                        query(array[x])
                    }else{
                        clearInterval(interval);
                    }
                    x++
                },1000)
            }else{
                alert("数据为空或格式不正确！");
            }

    })

    function query(zhi){
        $("#cntrId").attr("value",zhi)
        console.log(zhi)
        $('.submit')[0].click()
    }

})()