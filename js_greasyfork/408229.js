// ==UserScript==
// @name         Same item
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Hunk
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @grant        GM_xmlhttpRequest
// @include      *://item.taobao.com/item.htm?id=619854312083&details_id=*
// @require      http://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/408229/Same%20item.user.js
// @updateURL https://update.greasyfork.org/scripts/408229/Same%20item.meta.js
// ==/UserScript==
var api_url = "http://120.27.60.38:8093/search/api/bestInfo";
var details_id = "";
(function() {
    'use strict';

    $("body").empty();
    var url = window.location.href;
    if(url.indexOf("details_id=")>0){
        var keydatas = url.split('details_id=');
        details_id = keydatas[1];
    }
    if(details_id == ""){
        return;
    }
    var params = {"bestId":details_id};
    var view = "";
    GM_xmlhttpRequest({
        method: "POST",
        url: api_url,
        dataType: "json",
        data: JSON.stringify(params),
        headers:  {
            "Content-Type": "application/json"
        },
        onload: function(response) {console.log(response);
            if(response.readyState==4&&response.status==200){
                var jsondata = JSON.parse(response.responseText);
                if(jsondata.code==500){
                    alert(jsondata.msg);
                    return;
                }

                view="<div align='center'><img align='absmiddle' src='"+jsondata.data.goodImg+"' width='200px' high='200px'></div>";

                $("body").append(view);
            }
        }
    });
})();
