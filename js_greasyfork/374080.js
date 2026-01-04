// ==UserScript==
// @name         自用三亚学院一键评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键评教
// @author       初七
// @match        http*://10.10.181.1/*
// @match        http*://10.10.181.2/*
// @match        http*://10.10.181.3/*
// @match        http*://10.10.181.4/*
// @match        http*://10.10.181.5/*
// @match        http*://10.10.181.6/*
// @match        http*://10.10.181.7/*
// @match        http*://221.182.227.251:883/*
// @resource     https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374080/%E8%87%AA%E7%94%A8%E4%B8%89%E4%BA%9A%E5%AD%A6%E9%99%A2%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/374080/%E8%87%AA%E7%94%A8%E4%B8%89%E4%BA%9A%E5%AD%A6%E9%99%A2%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {

    document.getElementById("iframeautoheight").onload = function() {
        var iframe = document.getElementById('iframeautoheight');
        var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        var selects = innerDoc.getElementsByTagName('select');
        var scorelist = [];
        var textarea = innerDoc.getElementById("pjxx");
        var g=innerDoc.getElementById('Button1');
        var g2=innerDoc.getElementById('Button2');
        // 找到下拉菜单列表
        for (var i = 0; i < selects.length; i++) {
            if (selects[i].id.indexOf("DataGrid1__") > -1) {
                scorelist.push(selects[i]);
            }
        }

        //产生随机数
        var rid = Math.floor(Math.random() * scorelist.length);
        // 选取下拉菜单项
        for (i = 0; i < scorelist.length; i++) {
            var ops = scorelist[i].options;
            for (var j = 0; j < ops.length; j++) {
                var tempValue = ops[j].value;
                if (i == rid) {
                    if (tempValue == '4') {
                        ops[j].selected = true;
                    }
                } else {
                    if (tempValue == '5') {
                        ops[j].selected = true;
                    }
                }
            }




            g.click();
            g2.click();




        };
    }
})();