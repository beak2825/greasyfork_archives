// ==UserScript==
// @name         Gxjzy快速选择所有选项
// @namespace    https://github.com/AaGMix/gxjzyTES_qsalloption
// @version      1.1
// @description  GXJZY Teacher Evaluationfor systeam Quickselect all options
// @author       AaGmix
// @supportURL   https://github.com/AaGMix/gxjzyTES_qsalloption
// @match        *://www.gxjzy.com/wwxx/wwxp/xpjaws1.php
// @require      https://code.jquery.com/jquery-3.3.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38345/Gxjzy%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9%E6%89%80%E6%9C%89%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/38345/Gxjzy%E5%BF%AB%E9%80%9F%E9%80%89%E6%8B%A9%E6%89%80%E6%9C%89%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 单个选项
    function Radio(eq) {
        for (var i = 1; i <= 5; i++) {
            // 识别只有4个选项的组
            if (i == 4) {
                var y = 4;
            }
            else {
                y = 5;
            }

            for (var i2=1; i2 <= y; i2++) {
                var a = i.toString() + i2.toString();
                var strredio = "form[name = 'form1']>table:eq(1)>tbody input[name=a" + a + "]:eq(" + eq + ")";
                var redio = $(strredio);
                redio.prop("checked",true);
            }
        }
    }
    // 两个选项
    function Radio5(eq1, eq2) {
        for (var i = 1; i <= 5; i++) {
            // 识别只有4个选项的组
            if (i == 4) {
                var y = 4;
            }
            else {
                y = 5;
            }

            for (var i2=1; i2 <= y; i2++) {
                var a = i.toString() + i2.toString();
                // 判断排列方式
                if (i != 5) {
                    if (i % 2 == 1) {

                        if (i2 % 2 == 1)
                            var eq = eq1;
                        else
                            eq = eq2;

                    } else {

                        if (i2 % 2 == 0)
                            var eq = eq1;
                        else
                            eq = eq2;

                    }
                } else {
                    // 由于上面有一个4个选项的组 下面的组要用相反排列方式
                    if (i2 % 2 == 0)
                        var eq = eq1;
                    else
                        eq = eq2;
                }

                var strredio = "form[name = 'form1']>table:eq(1)>tbody input[name=a" + a + "]:eq(" + eq + ")";
                var redio = $(strredio);
                redio.prop("checked",true);
            }
        }
    }

    var menu = $("form[name = 'form1']>table:eq(1)>tbody>tr:eq(-2)");
    var menuhtml = "<tr>" +
        "<td align='center' valign='middle' bgcolor='#FFFFFF'><strong>快速选择</strong></td>" +
        "<td align='left' valign='middle' bgcolor='#FFFFFF'>这个脚本可以让你快速选择上面的选项</td>" +
        "<td align='center' valign='middle' bgcolor='#FFFFFF'>" +
        "全部选:&nbsp;<strong>" +
        "A&nbsp;<input type='radio' name='SAll' id='salla'>" +
        "&nbsp;B&nbsp;<input type='radio' name='SAll' id='sallb'>" +
        "&nbsp;C&nbsp;<input type='radio' name='SAll' id='sallc'>" +
        "&nbsp;&nbsp;<input type='button' value='AB' name='SAB' id='sab'>" +
        "&nbsp;&nbsp;<input type='button' value='BC' name='SAB' id='sbc'>" +
        "</strong>" +
        "</td>" +
        "</tr>";
    menu.after(menuhtml);

    $("#salla").click(function () {
        Radio(0);
    });
    $("#sallb").click(function () {
        Radio(1);
    });
    $("#sallc").click(function () {
        Radio(2);
    });
    $("#sab").click(function () {
        Radio5(0,1);
    });
    $("#sbc").click(function () {
        Radio5(1,2);
    });
})();
