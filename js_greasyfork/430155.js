// ==UserScript==
// @name         华能电子商务平台宽屏显示
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  本脚本的唯一用处就是将华能电子商务平台适配成宽屏显示
// @author       woung
// @match        http://ec.chng.com.cn/ecmall/more*
// @icon         https://www.google.com/s2/favicons?domain=chng.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430155/%E5%8D%8E%E8%83%BD%E7%94%B5%E5%AD%90%E5%95%86%E5%8A%A1%E5%B9%B3%E5%8F%B0%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/430155/%E5%8D%8E%E8%83%BD%E7%94%B5%E5%AD%90%E5%95%86%E5%8A%A1%E5%B9%B3%E5%8F%B0%E5%AE%BD%E5%B1%8F%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
     var style = document.createElement("style");
    style.type = "text/css";
 //   var text = document.createTextNode(".main_box2{ min-width:1300px; max-width:1300px; margin:0 auto; padding:0; position:relative;}"); /* 这里编写css代码 */
    var text = document.createTextNode(".main_box2{ min-width:1300px!important; max-width:1300px!important;width: 1300px!important;}"); /* 这里编写css代码 */
    style.appendChild(text);

    //text = document.createTextNode(".con_box2 .main_box2{width: 1300px!important;}"); /* 这里编写css代码 */
    //style.appendChild(text);

    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);

     $(".main_box").each(function (i, n) {
        $(this).addClass("main_box2");
        if($(this).hasClass("con_box")){
            $(this).attr("style","width: 1300px!important;");
        }
    });
   //main_box_right
    $(".main_box_right").each(function (i, n) {
        $(this).attr("style","width: 1080px!important;");

    });
   //main_r_con
    $(".main_r_con").each(function (i, n) {
        $(this).attr("style","width: 1080px!important;");
        //获取下面的li,修改宽度
        $(this).children().attr("style","width: 1080px!important;");


    });
    //选择 class为  f_l notice_a  的a链接，去掉属性
    $(".notice_a").each(function (i, n) {
        console.log( $("this"));
        $(this).attr("style","max-width: 920px;");
    });
  $(".notice_a").each(function (i, n) {
      console.log( $("this").html());
      var replaced = $("this").html().replace(/华能能源交通产业控股有限公司集团公司物资供应中心（\d[1,2]）\d[1,2]月份集中物资供应/g, "【能交】");
      replaced=replaced.replace(/华能能源交通产业控股有限公司集团公司物资供应中心/g, "【能交】");
      console.log(replaced);
      $("this").html(replaced);
    });
    console.log("--------------------------------------------------------------------------------------------------------------------")

    //console.log(document.body.innerHTML)
    //document.body.innerHTML = document.body.innerHTML.replace(/华能能源交通产业控股有限公司集团公司物资供应中心（\d[1,2]）\d[1,2]月份集中物资供应/g, "【能交】");
    //document.body.innerHTML = document.body.innerHTML.replace(/华能能源交通产业控股有限公司集团公司物资供应中心/g, "【能交】");
    console.log("--------------------------------------------------------------------------------------------------------------------")
    //console.log(document.body.innerHTML)
})();