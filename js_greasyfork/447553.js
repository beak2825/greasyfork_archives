// ==UserScript==
// @name         安全教育平台 2022年中小学生平安暑假专项活动（自动答题）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动答题
// @author       DFK
// @match        https://huodong.xueanquan.com/summer2022/summer_test.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xueanquan.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447553/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%202022%E5%B9%B4%E4%B8%AD%E5%B0%8F%E5%AD%A6%E7%94%9F%E5%B9%B3%E5%AE%89%E6%9A%91%E5%81%87%E4%B8%93%E9%A1%B9%E6%B4%BB%E5%8A%A8%EF%BC%88%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447553/%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%202022%E5%B9%B4%E4%B8%AD%E5%B0%8F%E5%AD%A6%E7%94%9F%E5%B9%B3%E5%AE%89%E6%9A%91%E5%81%87%E4%B8%93%E9%A1%B9%E6%B4%BB%E5%8A%A8%EF%BC%88%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';



    console.log ("==> Script start.", new Date() );

    // 1ST PART OF SCRIPT RUN GOES HERE.
    console.log ("==> 1st part of script run.", new Date() );

    document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
    window.addEventListener ("load", pageFullyLoaded);

    function DOM_ContentReady () {
        // 2ND PART OF SCRIPT RUN GOES HERE.
        // This is the equivalent of @run-at document-end
        console.log ("==> 2nd part of script run.", new Date() );
    }

    function pageFullyLoaded () {
        console.log ("==> Page is fully loaded, including images.", new Date() );
        setInterval(runFunc, 600);

        var p1 = false;
        var p2 = false;
        var p3 = false;
        function runFunc() {

            var title = $("div[id='questionlist']  p:first").text();
            console.log("title " + title);

            if(p1 == false && title.indexOf("第一部分")!=-1){
                $("#radio_1_1").attr("checked","checked").click();
                $("#radio_2_1").attr("checked","checked").click();
                $("#radio_3_4").attr("checked","checked").click();
                p1 = true;
                console.log("p1 = true");

            }

            if(p2 == false && title.indexOf("第二部分")!=-1){
                $("#radio_4_2").attr("checked","checked").click();
                $("#radio_5_3").attr("checked","checked").click();
                $("#radio_6_2").attr("checked","checked").click();
                $("#radio_7_3").attr("checked","checked").click();
                $("#radio_8_2").attr("checked","checked").click();
                $("#radio_9_2").attr("checked","checked").click();
                $("#radio_10_2").attr("checked","checked").click();
                $("#radio_11_3").attr("checked","checked").click();
                $("#radio_12_1").attr("checked","checked").click();
                $("#radio_13_3").attr("checked","checked").click();
                $("#radio_14_3").attr("checked","checked").click();
                $("#radio_15_1").attr("checked","checked").click();
                $("#radio_16_1").attr("checked","checked").click();
                $("#radio_17_2").attr("checked","checked").click();
                $("#radio_18_1").attr("checked","checked").click();
                $("#radio_19_3").attr("checked","checked").click();
                $("#radio_20_1").attr("checked","checked").click();
                $("#radio_21_2").attr("checked","checked").click();
                $("#radio_22_1").attr("checked","checked").click();
                $("#radio_23_2").attr("checked","checked").click();
                $("#radio_24_2").attr("checked","checked").click();
                $("#radio_25_2").attr("checked","checked").click();
                $("#radio_26_2").attr("checked","checked").click();
                $("#radio_27_2").attr("checked","checked").click();
                $("#radio_28_3").attr("checked","checked").click();
                $("#radio_29_1").attr("checked","checked").click();
                $("#radio_30_2").attr("checked","checked").click();
                $("#radio_31_2").attr("checked","checked").click();
                $("#radio_32_3").attr("checked","checked").click();
                $("#radio_33_3").attr("checked","checked").click();
                $("#radio_34_1").attr("checked","checked").click();
                $("#radio_35_2").attr("checked","checked").click();
                p2 = true;
                console.log("p2 = true");

            }

            if(p3 == false && title.indexOf("第三部分")!=-1){
                $("#radio_36_5").attr("checked","checked").click();
                $("#radio_37_5").attr("checked","checked").click();
                $("#radio_38_5").attr("checked","checked").click();
                $("#radio_39_5").attr("checked","checked").click();
                $("#radio_40_5").attr("checked","checked").click();
                $("#radio_41_1").attr("checked","checked").click();
                $("#radio_42_5").attr("checked","checked").click();
                $("#radio_43_5").attr("checked","checked").click();
                $("#radio_44_5").attr("checked","checked").click();
                $("#radio_45_5").attr("checked","checked").click();
                $("#radio_46_5").attr("checked","checked").click();
                $("#radio_47_1").attr("checked","checked").click();
                $("#radio_48_5").attr("checked","checked").click();
                $("#radio_49_5").attr("checked","checked").click();
                $("#radio_50_5").attr("checked","checked").click();
                $("#radio_51_5").attr("checked","checked").click();
                $("#radio_52_1").attr("checked","checked").click();
                $("#radio_53_5").attr("checked","checked").click();
                $("#radio_54_5").attr("checked","checked").click();
                $("#radio_55_5").attr("checked","checked").click();
                $("#radio_56_5").attr("checked","checked").click();
                $("#radio_57_5").attr("checked","checked").click();
                $("#radio_58_5").attr("checked","checked").click();
                $("#radio_59_1").attr("checked","checked").click();
                $("#radio_60_5").attr("checked","checked").click();
                $("#radio_61_5").attr("checked","checked").click();
                $("#radio_62_5").attr("checked","checked").click();
                $("#radio_63_5").attr("checked","checked").click();
                $("#radio_64_5").attr("checked","checked").click();
                $("#radio_65_5").attr("checked","checked").click();
                $("#radio_66_2").attr("checked","checked").click();
                $("#radio_67_5").attr("checked","checked").click();
                $("#radio_68_5").attr("checked","checked").click();
                $("#radio_69_5").attr("checked","checked").click();
                $("#radio_70_5").attr("checked","checked").click();
                $("#radio_71_5").attr("checked","checked").click();
                $("#radio_72_4").attr("checked","checked").click();
                $("#radio_73_5").attr("checked","checked").click();
                $("#radio_74_5").attr("checked","checked").click();
                p3 = true;
                console.log("p3 = true");

            }


        }

    }

    console.log ("==> Script end.", new Date() );

    /*     $(window).load(function (){
        console.log("123456");
        console.log($("#radio_4_3"));
        //debugger;
        //$("radio_4_3").attr("checked", "checked");
        $("#radio_4_3").attr("checked","checked");


    }); */
    // Your code here...
})();