// ==UserScript==
// @name         2022安全教育平台512防震减灾专题
// @namespace    http://tampermonkey.net/
// @version      1
// @description  安全教育平台 自动答题
// @author       You
// @match        https://huodong.xueanquan.com/2022fzjz/test.html?pageNum=2&tabNum=1
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueanquan.com
// @grant        none
// @license     GPL License
// @downloadURL https://update.greasyfork.org/scripts/445695/2022%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0512%E9%98%B2%E9%9C%87%E5%87%8F%E7%81%BE%E4%B8%93%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/445695/2022%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0512%E9%98%B2%E9%9C%87%E5%87%8F%E7%81%BE%E4%B8%93%E9%A2%98.meta.js
// ==/UserScript==

(function() {

    'use strict';

    window.addEventListener ("load", pageFullyLoaded);
    function pageFullyLoaded () {
        console.log ("==> Page is fully loaded, including images.", new Date() );
        setTimeout(alertFunc, 1000);

        function alertFunc() {
            $("#radio_2_1").attr("checked","checked");
            $("#radio_0_2").attr("checked","checked");
            $("#radio_0_3").attr("checked","checked");
            $("#radio_1_4").attr("checked","checked");

            $("#radio_1_5").attr("checked","checked");

            $("#radio_2_6").attr("checked","checked");

            $("#radio_0_7").attr("checked","checked");

            $("#radio_1_8").attr("checked","checked");

            $("#radio_2_9").attr("checked","checked");

            $("#radio_0_10").attr("checked","checked");

            $("#radio_2_11").attr("checked","checked");

            $("#radio_0_12").attr("checked","checked");
            $("#radio_1_12").attr("checked","checked");
            $("#radio_2_12").attr("checked","checked");
            $("#radio_3_12").attr("checked","checked");


            $("#radio_0_13").attr("checked","checked");
            $("#radio_1_13").attr("checked","checked");
            $("#radio_2_13").attr("checked","checked");


            $("#radio_0_14").attr("checked","checked");
             $("#radio_1_14").attr("checked","checked");
             $("#radio_2_14").attr("checked","checked");

            $("#radio_2_15").attr("checked","checked");

        }

    }

    // Your code here...
})();