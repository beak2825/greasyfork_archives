// ==UserScript==
// @name         blade enhancement
// @namespace    41frank
// @version      0.2.2
// @description  blade cloud testing feature enhancement
// @author       41frank
// @match        http://report.blade.hundsun.com/*
// @match        http://cloud.blade.hundsun.com/business/testDesign/busiCaseTree.htm
// @grant        GM_getTab
// @grant        GM_saveTab
// @grant        GM_getTabs
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/420001/blade%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/420001/blade%20enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var getCaseLocation = () => {
        GM_setValue("currentCasePath", $('#caseGeneralInfo').text() + "/" + $("li[style*='background-color: rgb(66, 139, 202)']").text());
        console.log(GM_getValue("currentCasePath"));
    }

    var selectZTreeNodeByAbsolutePath = () => {
        var zTreeObj = unsafeWindow.Horn.getComp("testDesignTree").treeObj;
        var path = GM_getValue("currentCasePath");
        var pathByLevel = path.split("/");
        var currentNode = null;
        for (var j in pathByLevel) {
            if (currentNode == null) {
                currentNode = zTreeObj.getNodeByParam("name", pathByLevel[j]);
            } else {
                currentNode = zTreeObj.getNodeByParam("name", pathByLevel[j], currentNode);
            }
            if (currentNode != null) {
                zTreeObj.selectNode(currentNode);
                unsafeWindow.$("#" + currentNode.tId + "_a").click();
            }
        }
    }

    var insertSQLReplace = () => {
        var insertSQLPattern = new RegExp(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\.\d{3})\s+\[(\w+)\]\s+执行语句-->\s+(insert\s+into)\s+([\w\_]+)\s+\(([\w\,\_\s]+)\)\s+values\s+\(([\s\S]+)\)<--完成/,"i");
        $("#log div.INFO span").each((i, e) => {
            let insertSQLComponent = insertSQLPattern.exec($(e).text());
            if (insertSQLComponent != null && insertSQLComponent.length == 8) {
                let columStr = insertSQLComponent[6];
                let valueStr = insertSQLComponent[7];
                let columArray = columStr.split(",");
                let valueArray = valueStr.split(",");
                let columWithValue = [];
                for (var j = 0; j < columArray.length; j++) {
                    columWithValue.push(columArray[j] + ":" + valueArray[j]);
                }
            $("<span></span>").text(insertSQLComponent[5] + "字段替换语句为：\n" + columWithValue.sort().join(",\n")).insertAfter($(e));
            }
        });
    }

    var init = () => {
        var location = $(document).attr("location");
        console.log(location);
        var reportPagePattern = new RegExp("http:\/\/report\.blade\.hundsun\.com\/[\w\d\?\._=&]*");
        var busiCaseTreePattern = new RegExp("http://cloud.blade.hundsun.com/business/testDesign/busiCaseTree.htm");
        if (reportPagePattern.test(location)) {
            $('<span class="input-group-addon"><i class="glyphicon glyphicon-copy"></i></span>').on("click", getCaseLocation).insertAfter($("span i").parent());
            $('<input type="button" id="insertSQLReplaceButton" value="insert重排" class="button" title="显示insert字段的实际值">').on("click", insertSQLReplace).insertAfter($("#clearButton"));
        }
        if (busiCaseTreePattern.test(location)) {
            $(".level0 span.node_name").first().parent().parent().append($("<a>➡️</a>").on("click", function() {
                selectZTreeNodeByAbsolutePath();
            }))
        }
    };

    init();
    })();