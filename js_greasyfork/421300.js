// ==UserScript==
// @name         淘宝商品信息抓取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://alds.agiso.com/AutoLogistics/AldsItemDefine.aspx

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421300/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E6%8A%93%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/421300/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E4%BF%A1%E6%81%AF%E6%8A%93%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".ui-tabs-nav").append(`<li class="ui-state-default ui-corner-top ">
                <a id="btn" class="myTab ui-tabs-anchor" style="cursor:pointer;">提取信息</a>
            </li>`);
let page =1;
    $("#btn").click(()=>{
 $.ajax({
        type: "post",
             url: "https://alds.agiso.com/AutoLogistics/AldsItemDefine.aspx?method=Get&aldsType=Pay&rdm=0.6898842433088197",
             // data: {username:$("#username").val(), content:$("#content").val()},
     data:{
         page:page++,
 rows:20
 },
             dataType: "json",
             success: function(data){
                 console.log(JSON.stringify(data))
             }
    })
    })
   
    // Your code here...
})();