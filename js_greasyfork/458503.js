// ==UserScript==
// @name         提瓦特大地图-标记全选按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在米游社-观测枢-大地图上，允许启用插件，在每组地图标记上追加全选功能
// @author       pan
// @match        https://webstatic.mihoyo.com/ys/app/interactive-map/index.html?bbs_presentation_style=no_header&lang=zh-cn&_markerFps=24
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mihoyo.com
// @require      https://code.jquery.com/jquery-3.6.0.slim.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458503/%E6%8F%90%E7%93%A6%E7%89%B9%E5%A4%A7%E5%9C%B0%E5%9B%BE-%E6%A0%87%E8%AE%B0%E5%85%A8%E9%80%89%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/458503/%E6%8F%90%E7%93%A6%E7%89%B9%E5%A4%A7%E5%9C%B0%E5%9B%BE-%E6%A0%87%E8%AE%B0%E5%85%A8%E9%80%89%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    var check_custom_plugin = setInterval(function(){
        check_plugin_btn();
    }, 1000);
})();

function check_plugin_btn(){
    if ($(".filter-panel__header-map").length > 0){
        console.log("发现 --> filter-panel__header-map，准备添加组件")
        if ($("#custom_plugin_btn").length > 0){
            return true;
        }else{
            var btn_text = "<span id='custom_plugin_btn' style='color:white;'>启用组件</span>";
            $("#user-guide-switchArea").after(btn_text);
            $("#custom_plugin_btn").click(function(){
                add_check_btn()
            });
        }
    }else{
        //console.log("未发现 --> filter-panel__header-map，继续")
    }
}

function add_check_btn(){
    var panel_div = $(".filter-panel__labels");
    var label_list = panel_div.find(".filter-panel__labels-item")
    console.log("label_list --> "+label_list.length);
    $.each(label_list, function(index, value){
        var this_label = $(this)
        var this_label_id = this_label.attr("id")
        if (this_label_id < 1){
            return true
        }
        if (this_label.find(".custom_check_all_btn").length > 0){
            return true
        }
        var btn_text = "<span class='custom_check_all_btn' style='padding-left:20px; color:white;'>全选</span><span class='custom_uncheck_all_btn' style='padding-left:20px; color:white;'>取消全选</span>";
        this_label.find('.filter-panel__labels-title').append(btn_text);
        // 全选
        this_label.find(".custom_check_all_btn").click(function(){
            var item_list = this_label.find(".filter-panel__labels-content").find(".filter-panel__labels-filter-item")
            $.each(item_list, function(index2, value2){
                var this_item = $(this)
                var class_text = this_item.attr("class")
                if (class_text.indexOf("filter-item--selected") == -1){
                    this_item.click()
                }
            });
        });
        // 取消全选
        this_label.find(".custom_uncheck_all_btn").click(function(){
            var item_list = this_label.find(".filter-panel__labels-content").find(".filter-panel__labels-filter-item")
            $.each(item_list, function(index2, value2){
                var this_item = $(this)
                var class_text = this_item.attr("class")
                if (class_text.indexOf("filter-item--selected") >= 0){
                    this_item.click()
                }
            });
        });
    })
}