// ==UserScript==
// @name         华启协同报销单表格扩展
// @namespace    http://nsoft.vip/
// @version      1.0.2
// @description  【本脚本功能】扩展华启协同报销单填报表格拖拽排序行拷贝插入功能
// @author       alex.yao
// @match        *://xietong.huaqi.info:8088/febs/views/flow/createFlowForm/*
// @icon         http://www.huaqi.info/Templates/default/Common/images/logo.jpg
// @requird      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css
// @license           Apache-2.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470695/%E5%8D%8E%E5%90%AF%E5%8D%8F%E5%90%8C%E6%8A%A5%E9%94%80%E5%8D%95%E8%A1%A8%E6%A0%BC%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/470695/%E5%8D%8E%E5%90%AF%E5%8D%8F%E5%90%8C%E6%8A%A5%E9%94%80%E5%8D%95%E8%A1%A8%E6%A0%BC%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var fixHelper = function(e, ui) {
      ui.children().each(function() {
        $(this).width($(this).width());
      });
      return ui;
    };

    setTimeout(function(){
        var t = $(".dynamic-data table");
        for(var i = 0; i < t.length; i ++) {
          $("#" + t[i].id + " tbody").sortable({
                  cursor: "move",
                  helper: fixHelper,
                  axis:"y",
                  start:function(e, ui){
                    ui.helper.css({"background":"#fff"});
                    return ui;
                  }
          });
          var cols = $("#" + t[i].id +" tbody td:last-child");
          cols.each(function() {
             var button = $("<a href='javascript:;' title='复制/拖拽' class='fa fa-arrows' style='margin-left:5px;' onclick='var tr = $(this).parent().parent().clone();$(this).parent().parent().after(tr);'></a>");
             $(this).append(button);
          });
        }
    }, 1000)
})();