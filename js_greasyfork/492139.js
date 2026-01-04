// ==UserScript==
// @name         xnyy_lms_tool
// @namespace    http://192.10.16.41:8002
// @version      0.7
// @description  xnyy_lms批量下载专用
// @author       You
// @match        http://192.10.16.41:8002/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.11.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492139/xnyy_lms_tool.user.js
// @updateURL https://update.greasyfork.org/scripts/492139/xnyy_lms_tool.meta.js
// ==/UserScript==
$(document).ready(function() {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

      var num_a = 0

      async function delayedForLoop() {
          num_a = 0;
          $("#myLabel").text('已下载'+num_a+'个');
      //下面i=0指第一行，意外中断后可以修改 i=“需要接着下载的行数-1”，重新再控制台输入一次，再重新执行delayedForLoop()
        for (let i = parseInt($("#Input1").val()); i < parseInt($("#Input2").val()); i++) {
            if($($("[name='cancelledflag']")[i]).find("svg").length==0){
                $('a')[i].click();
                num_a = i+1
                //系统反应慢可以延长等待时间，sleep中的2000设置更大
                await sleep(2000);
                $("a:contains('下载')").click()
                await sleep(1000);
                $("span:contains('返回')").click()
                await sleep(2000);
                $("#myLabel").text('已下载'+num_a+'个');
            }
        }
      }

      // 创建一个新元素
      var $div = $('<div>').attr('id', 'myDiv')

      var $input1 = $('<input>', {
        type: 'number', // 输入框类型
        id: 'Input1', // 输入框的ID
        class: 'my-input-class', // 输入框的CSS类
        value: 0, // 输入框的默认值
    });

    var $input2 = $('<input>', {
        type: 'number', // 输入框类型
        id: 'Input2', // 输入框的ID
        class: 'my-input-class', // 输入框的CSS类
        value: 0, // 输入框的默认值
        on: { // 绑定事件
            mousedown: function() {
                // 处理键盘按下事件
                //alert("123")
                $("#Input2").val($('a').length)
            }
        }
    });
    var myLabel = $('<label>', {
        id: 'myLabel',
        text: '已下载0个'
    });
$div.append($input1,$input2,myLabel)
      var $button = $('<button>', {
        id: 'myButton',
        class: 'btn btn-primary',
        text: '点我下载',
        click: function() {
            //$button.text='启动下载'
            delayedForLoop()
        }
    });
    $div.append($button)
    // 将按钮添加到DOM中
    $('body').append($div);
    })