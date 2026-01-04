// ==UserScript==
// @name         快捷配置
// @namespace    https://gaozhengtao.cn/
// @version      1.6
// @description  try to config from excel!
// @author       gaozt
// @match        http://10.17.206.73:8080/spider
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/430102/%E5%BF%AB%E6%8D%B7%E9%85%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/430102/%E5%BF%AB%E6%8D%B7%E9%85%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 用来匹配模块
    var module_map = new Map([['1','开庭公告'], ['2','送达公告'], ['3', '立案信息'], ['4', '裁判文书'], ['5', '法院公告'], ['6', '司法案例']])
    // 点击事件
    var config = function(){
        var text = $(".my").val();
        // 清空
        $(".my").val('')
        // parse text
        var data = text.split('\t')
        // 网站名
        var sitename = data[1];
        $(".el-form-item__content div:contains('网站名')").next().find('input').val(sitename);
        // 面包屑
        var sitesort = data[2];
        $(".el-form-item__content div:contains('网站面包屑')").next().find('input').val(sitesort);
        // datasource
        var datasource = data[3];
        $(".el-form-item__content div:contains('datasource')").next().find('input').val(datasource);
        // sort
        var sort = data[4];
        $(".el-form-item__content div:contains('sort')").next().find('input').val(sort);
        // 原始地址
        var rawurl = data[5];
        $(".el-form-item__content div:contains('原始地址')").next().find('input').val(rawurl);
        // modulecode 来选择模块名称和入库模块
        var modulecode = data[6];
        if (modulecode == '4'){
            $(".el-form-item__content div:contains('入库模块')").next().find('input').val('裁判文书表');
        } else {
            $(".el-form-item__content div:contains('入库模块')").next().find('input').val('litigation');
        }
        $(".el-form-item__content div:contains('模块名称')").next().find('input').val(module_map.get(modulecode));
        // 重复字符串，应该也能设置 如果是url不管
        var repeatstr = data[8];
        if (repeatstr.trim() != 'url') {
            if (text.indexOf("(") !== -1) {
                var repeat = repeatstr.split('(');
                repeat = repeat[repeat.length - 1].split(')')[0].replace(/，/g, ',');
            }
            $(".el-form-item__content div:contains('去重参数')").next().find('input').val(repeat);
            alert("改变了去重参数，请检查。");
        }
    };
    // 展示元素
    var show = setInterval(function() {
        if ($('#tab-metadata').length > 0){
            $(".el-tabs__header:gt(0)").after("<input class='my el-input__inner' style='position:relative;width:60%'><span class='el-button my_config' style='background-color:#409EFF; color:white'>config</span>")
            $(".my_config").click(config);
            clearInterval(show);
        }
    }, 3000);
})();