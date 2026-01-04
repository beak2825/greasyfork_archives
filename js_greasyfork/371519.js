// ==UserScript==
// @name         Mus3d 支持复制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.imus3d.com/admin/index
// @require             https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371519/Mus3d%20%E6%94%AF%E6%8C%81%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/371519/Mus3d%20%E6%94%AF%E6%8C%81%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
        var sideMenu = $('div[class="sidebar-collapse"] ul[id="side-menu"][class="nav"]');
        var yunYinGongZuo = sideMenu.children('li:eq(3)');
        // 展开运营工作
         if(!yunYinGongZuo.hasClass('active')){
              yunYinGongZuo.has("ul").children("a")[0].click();
             var quanBuMoXing = yunYinGongZuo.children('ul').children('li:eq(0)').children('a');
             // 打开全部模型页面
             quanBuMoXing[0].click();
             //
              var iframe= $("iframe[src$='/admin/project/index']")
              iframe.load(function (){
                 iframe.contents().find('html').css({'-webkit-user-select':'auto','-moz-user-select':'auto','-ms-user-select':'auto','user-select':'auto'})
                 var queryForm = iframe.contents().find('#eventqueryform')
                 console.log(iframe.contents().find('#eventqueryform').length)
                 // 添加导出btn
                 // var exportBtn = $('<input type="button" class="btn btn-default span1" id="exportPage" value="导出Json">');
                 //queryForm.append(exportBtn);
                  // 获取表格配置
                  var bootstrapTable = this.contentWindow.$.fn.bootstrapTable;
                  var config = bootstrapTable.defaults;
                  // 增加分页选项
                  config.pageList.push(200);
                  config.pageList.push(300);
                  config.pageList.push(500);
              });
         }
})();