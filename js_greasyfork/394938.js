// ==UserScript==
// @name         王永杰app监测
// @myBlog       http://xiaodongxier.com
// @namespace    undefined
// @version      7.0.8
// @description  王永杰app监测插件
// @author       王永杰app监测
// @match        *://prom.m.gome.com.cn
// @include      *://prom.m.gome.com.cn/*
// @match        王永杰app监测
// @description 2020/1/10 上午11:41:06
// @downloadURL https://update.greasyfork.org/scripts/394938/%E7%8E%8B%E6%B0%B8%E6%9D%B0app%E7%9B%91%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/394938/%E7%8E%8B%E6%B0%B8%E6%9D%B0app%E7%9B%91%E6%B5%8B.meta.js
// ==/UserScript==
$(document).ready(function () {
    var mytit = $(".toolbar h2").text();
    function zdy_ued() {
        let str = `楼层id,模块id,楼层名称,监测坑位,data_code值\n`;
        var zdy_dom = $(".cms");
        for (var i = 0; i < zdy_dom.length; i++) {
            var temp_box = $(".custom-ued").eq(i);
            var temp_id = temp_box.attr("templetid");
            var lc_id = temp_box.attr("id");
            var temp_tit = temp_box.find(".h_custom_data").attr("title");
            var a_list = temp_box.find("a")
            for (var j = 0; j < a_list.length; j++) {
                var data_tit = temp_box.find("a").eq(j).attr("title");
                var data_id = temp_box.find("a").eq(j).attr("data-code");
                str += lc_id + ",\t" + temp_id + ",\t" + temp_tit + ",\t" + data_tit + ",\t" + data_id + "\n";
            }
            str += '\n';
        }
        let zdy_url = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = zdy_url;
        link.download = mytit + "页面坑位监测&ued视觉部.csv";
        document.body.appendChild(link);
        link.click();
    }
    $(".ellipsis").click(function () {
        zdy_ued()
        alert(mytit +"页面监测数据导出成功&杰哥牛逼🐂")
    })
})