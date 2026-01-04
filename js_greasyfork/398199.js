// ==UserScript==
// @name         getCoupangImage
// @name:zh-CN   CoupangImage
// @namespace    com.hct.image
// @icon         https://lk-data-collection.oss-cn-qingdao.aliyuncs.com/winner/winnercoupang/Icon.png
// @version      1.0
// @description  Coupang commodity information collection applied to winner system
// @description:zh-cn   获取coupang主图
// @author       ylfs
// @include      https://www.coupang.com/vp/products/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/398199/getCoupangImage.user.js
// @updateURL https://update.greasyfork.org/scripts/398199/getCoupangImage.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var btn = document.createElement("input");
    btn.setAttribute("id", "cj_btn");
    btn.setAttribute("type", "button");
    btn.setAttribute("value", "获取主图");
    btn.setAttribute("style", "position: fixed;z-index:999;top: 40%;right: 20px; width: 100px;height: 68px;line-height: 68px;color: #fff;background-color: #1E9FFF;text-align: center;border: none;border-radius: 3px;cursor: pointer;");
    document.body.appendChild(btn);
    $('#cj_btn').on('mouseover', function () {
        $('#cj_btn').css("background-color","#48a9f5");
    });
    $('#cj_btn').on('mouseout', function () {
        $('#cj_btn').css("background-color","#1E9FFF");
    });
    var flag=true;
    $('#cj_btn').on('click', function () {
       var htmlstr = document.head.innerHTML;
       var start = htmlstr.indexOf("exports.sdp =");
       var temp = htmlstr.substring(start);
       var end = temp.indexOf("};");
       temp = temp.substring(0,end+1);
       var jsonstr = temp.replace("exports.sdp = ","").trim();
       var jsondata = JSON.parse(jsonstr);
       var salePrice="";
       var quantityBase = jsondata.quantityBase;
       var images = jsondata.images;
       var imgstr="";
       var main_image = '';
       for(var j=0;j<images.length;j++){
           imgstr += images[j].origin+",";
           if (j==0) {
               main_image = images[j].origin;
           }
       }
       alert(main_image);
       return false;
    });

})();