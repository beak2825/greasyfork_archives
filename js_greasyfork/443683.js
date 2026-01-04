// ==UserScript==
// @name        自动打开批量打印管理插件
// @namespace   [url=mailto:281031614@qq.com]281031614@qq.com[/url]
// @match       *://lims.cst.ac.cn/*
// @exclude     *://lims.cst.ac.cn/jexcel/*
// @require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant       
// @version     1.3.1
// @author      charbinst
// @description 登录lims后，自动打开批量打印管理插件
// @downloadURL https://update.greasyfork.org/scripts/443683/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E6%89%B9%E9%87%8F%E6%89%93%E5%8D%B0%E7%AE%A1%E7%90%86%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/443683/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E6%89%B9%E9%87%8F%E6%89%93%E5%8D%B0%E7%AE%A1%E7%90%86%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==aaaaaa
(function () {
    'use strict';
  $("body").append("<div style='right: 400px;top: 10px;color:#000000;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 400px;height: 40px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;font-size:12px' onClick='openTool.openJexcel'><a href='javascript:void(0);' id='print_btn'>批量打印记录</a></div>");
  var openTool = {
        //打开jexcel管理后台
        openJexcel: function () {
                   var authorization =NetStarUtils.OAuthCode.get();
                   //alert(authorization);
                   window.open("https://lims.cst.ac.cn/jexcel/manage?Authorization="+authorization);
            },
      //批量打印电子记录及报告
        batchPrint:function(){
                    debugger
					var sendData={};
					var auth=NetStarUtils.OAuthCode.get();
					sendData["auth"]=auth;
                    if ("WebSocket" in window)
            {


               // 打开一个 web socket
               var ws = new WebSocket("ws://127.0.0.1:9876");

               ws.onopen = function()
               {
			   console.log("连接已建立");
                  // Web Socket 已连接上，使用 send() 方法发送数据
                  ws.send("PRINTRECORDANDREPORT_COMMAND "+JSON.stringify(sendData));

               };
			   ws.onerror=function()
			   {
			    alert("请联系信息部，获取并安装批量打印服务程序。");
			   }

               ws.onmessage = function (evt)
               {
                  var received_msg = evt.data;
                  console.log("数据已接收...");
               };

               ws.onclose = function()
               {
                  // 关闭 websocket
                  console.log("连接已关闭...");
               };
            }

            else
            {
               // 浏览器不支持 WebSocket
               alert("您的浏览器不支持 WebSocket!");
            }
        },
      getRecordData:function()
      {
          debugger
          var framewindow = $(NetstarUI.labelpageVm.labelPagesArr[NetstarUI.labelpageVm.currentTab].dom).find('iframe')[0].contentWindow;
          if(!framewindow)
          {
              alert("当前页面无记录");
              return;
          }
          var param=framewindow.self.location.search;
           var reg = new RegExp("(^|&)recordId=([^&]*)(&|$)");
    var r = param.substr(1).match(reg);

          var recordid=unescape(r[2]);
            var authorization =NetStarUtils.OAuthCode.get();
        let myWindow=window.open("https://limsapi.cst.ac.cn/jexcel/record/getRecordData?id="+recordid+"&Authorization="+authorization);


      }
  };
  $("#open_btn").click(function () {
            openTool.openJexcel();
        });
     $("#print_btn").click(function () {
            openTool.batchPrint();
        });

         $("#getRecordData_btn").click(function () {
            openTool.getRecordData();
        });


})();
