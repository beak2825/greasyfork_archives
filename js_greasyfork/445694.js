// ==UserScript==
// @name         2022安全教育平台中小中学生防溺水教育专题
// @namespace    http://tampermonkey.net/
// @version      1
// @description  安全教育平台 自动答题
// @author       You
// @match        https://huodong.xueanquan.com/2022yfns/wenjuan.html?pageNum=2&tabNum=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueanquan.com
// @grant        none
// @license     GPL License
// @downloadURL https://update.greasyfork.org/scripts/445694/2022%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E4%B8%AD%E5%B0%8F%E4%B8%AD%E5%AD%A6%E7%94%9F%E9%98%B2%E6%BA%BA%E6%B0%B4%E6%95%99%E8%82%B2%E4%B8%93%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/445694/2022%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E4%B8%AD%E5%B0%8F%E4%B8%AD%E5%AD%A6%E7%94%9F%E9%98%B2%E6%BA%BA%E6%B0%B4%E6%95%99%E8%82%B2%E4%B8%93%E9%A2%98.meta.js
// ==/UserScript==

(function() {

    'use strict';

    window.addEventListener ("load", pageFullyLoaded);
    function pageFullyLoaded () {
        console.log ("==> Page is fully loaded, including images.", new Date() );
        setTimeout(alertFunc, 1000);

        function alertFunc() {
            $("#radio_0_1").attr("checked","checked");
            $("#radio_0_2").attr("checked","checked");
            $("#radio_0_3").attr("checked","checked");
            $("#radio_1_4").attr("checked","checked");

            $("#radio_1_5").attr("checked","checked");


            $("#radio_0_6").attr("checked","checked");
          
            $("#radio_2_7").attr("checked","checked");
            

            $("#radio_0_8").attr("checked","checked");

            $("#radio_0_9").attr("checked","checked");
           




            $("#radio_0_10").attr("checked","checked");


            $("#radio_0_11").attr("checked","checked");



            $("#radio_2_12").attr("checked","checked");


            $("#radio_0_13").attr("checked","checked");
            $("#radio_1_13").attr("checked","checked");
            $("#radio_2_13").attr("checked","checked");
            $("#radio_3_13").attr("checked","checked");
            $("#radio_4_13").attr("checked","checked");
            $("#radio_5_13").attr("checked","checked");
            $("#radio_6_13").attr("checked","checked");
            $("#radio_7_13").attr("checked","checked");



            $("#radio_0_14").attr("checked","checked");
             $("#radio_1_14").attr("checked","checked");
             $("#radio_2_14").attr("checked","checked");
             $("#radio_3_14").attr("checked","checked");
             $("#radio_4_14").attr("checked","checked");
             $("#radio_5_14").attr("checked","checked");
             $("#radio_6_14").attr("checked","checked");
            $("#radio_7_14").attr("checked","checked");
            $("#radio_8_14").attr("checked","checked");
            $("#radio_9_14").attr("checked","checked");


            $("#radio_0_15").attr("checked","checked");
  


            $("#radio_0_16").attr("checked","checked");
            $("#radio_1_16").attr("checked","checked");
            $("#radio_2_16").attr("checked","checked");
            $("#radio_3_16").attr("checked","checked");
             $("#radio_4_16").attr("checked","checked");
            $("#radio_5_16").attr("checked","checked");
            $("#radio_6_16").attr("checked","checked");
            $("#radio_7_16").attr("checked","checked");
             $("#radio_8_16").attr("checked","checked");
            $("#radio_9_16").attr("checked","checked");


            
            $("#radio_1_17").attr("checked","checked");
      

            $("#radio_0_18").attr("checked","checked");

            $("#radio_0_19").attr("checked","checked");

            
            $("#radio_1_20").attr("checked","checked");
            
            $("#radio_1_21").attr("checked","checked");

            $("#radio_0_22").attr("checked","checked");
            $("#radio_1_22").attr("checked","checked");
            $("#radio_2_22").attr("checked","checked");
            $("#radio_4_22").attr("checked","checked");
            $("#radio_6_22").attr("checked","checked");



            $("#radio_2_23").attr("checked","checked");
            $("#radio_3_23").attr("checked","checked");
            $("#radio_4_23").attr("checked","checked");
            $("#radio_5_23").attr("checked","checked");


            $("#radio_2_24").attr("checked","checked");
            


        }

    }
    // Your code here...
})();