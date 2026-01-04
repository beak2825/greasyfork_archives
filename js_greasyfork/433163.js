// ==UserScript==
// @name         TGU物理实验中心课程筛选
// @namespace    TGU_WL
// @version      1.1
// @description  快速找到可以选的实验课
// @author       Drzad
// @match        http://172-23-5-165-7100-p.vpn.tiangong.edu.cn:8118/Page/PEE/PEECM/PEECM0001.aspx?flag=1&&action=PEE110101&&moduleId=PEE11
// @downloadURL https://update.greasyfork.org/scripts/433163/TGU%E7%89%A9%E7%90%86%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%BF%83%E8%AF%BE%E7%A8%8B%E7%AD%9B%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/433163/TGU%E7%89%A9%E7%90%86%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%BF%83%E8%AF%BE%E7%A8%8B%E7%AD%9B%E9%80%89.meta.js
// ==/UserScript==

(function () {
    var flag = true;
    var addElement = '<select name="select_mode" id="select_mode" style="height:20px;width:105px;">\
				<option value="-999">选择筛选模式</option>\
				<option value="1">高亮模式</option>\
				<option value="2">简洁模式</option>\
				</select>';
    var mode = -999;


    setInterval(function () {
        if ($("strong").text().indexOf("可选实验列表") > 0 && (flag || $("#select_mode").val() == undefined)) {
            flag = false;
            // 优化页面
            $("#ID_PEE110101_Table1 > tbody > tr:nth-child(1) > td > table:nth-child(2) > tbody > tr > td:nth-child(2) > table > tbody > tr > td:nth-child(6)").attr("width", "66%");
            $("#ID_PEE110101_ddlPageSize").before("建议选择200条/页  ");
            $("#ID_PEE110101_pnTwo > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2) > table > tbody > tr:nth-child(5) > td:nth-child(5)").html(addElement);
            $("#select_mode").val(mode);
        }

        mode = $("#select_mode").val();
        var littleClass = $("#ID_PEE110101_gvpee110201").find("td:contains('/12')");
        var bigClass = $("#ID_PEE110101_gvpee110201").find("td:contains('/24')");

        if (mode == 1) {
            // 高亮有空闲课程
            for (var i = 0; i < littleClass.length; i++) {
                var element = littleClass.eq(i);
                element.parent("tr").show();
                if (element.text().indexOf("12/12") <= 0) {
                    element.parent("tr").css("background-color", "#c4ffbd");
                }
            }
            for (i = 0; i < bigClass.length; i++) {
                element = bigClass.eq(i);
                element.parent("tr").show();
                if (element.text().indexOf("24/24") <= 0) {
                    element.parent("tr").css("background-color", "#c4ffbd");
                }
            }
        } else if (mode == 2) {
            //不显示已满课程
            for (i = 0; i < littleClass.length; i++) {
                element = littleClass.eq(i);
                element.parent("tr").css("background-color", "");
                if (element.text().indexOf("12/12") > 0) {
                    element.parent("tr").hide();
                }
            }
            for (i = 0; i < bigClass.length; i++) {
                element = bigClass.eq(i);
                element.parent("tr").css("background-color", "");
                if (element.text().indexOf("24/24") > 0) {
                    element.parent("tr").hide();
                }
            }
        }
    }, 100);


})();