// ==UserScript==
// @name         石墨文档表格链接批量打开
// @namespace    http://haoren.openPage.com/
// @version      1.0.0
// @description  一些美好的事，在井然有序地发生！
// @license      MIT
// @author       好人
// @description  *://*.baidu.com/*【用于测试】
// @match        *://shimo.im/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463150/%E7%9F%B3%E5%A2%A8%E6%96%87%E6%A1%A3%E8%A1%A8%E6%A0%BC%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/463150/%E7%9F%B3%E5%A2%A8%E6%96%87%E6%A1%A3%E8%A1%A8%E6%A0%BC%E9%93%BE%E6%8E%A5%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function () {
        // 处理“你即将离开石墨，跳转到外部链接”
        // $(".StyledButton-sc-j7cy4").click();
    }, 1000);

    // 插入两个窗口
    addWindow()
    addWindow2()

    // 点击显示
    $("body").on('click', '#showWindow', function (e){
        $("#operateWindow").show()
    })

    // 点击隐藏
    $("body").on('click', '#hideWindow', function (e){
        $("#operateWindow").hide()
    })

    // 点击跳转
    $("body").on('click', '#goto', function (e){
        var listStr = $("#operateWindow textarea").val()
        if(listStr.length <= 0) {
            addCueWords("请检查所输入的内容", -1)
            return;
        }
        listStr = listStr.replace(" ", "") // 删除空格
        var list = listStr.split("\n")
        if(list.length <= 0) {
            addCueWords("请检查所输入的内容", -1)
            return;
        }
        var count = 0
        for(let i = 0; i < list.length; i++) {
            var match = list[i].match(/http/) != null;
            if(match) {
                window.open(list[i]);
                count++;
            } else {
                addCueWords("链接格式不正确，序号："+ (i + 1) + "，链接：" + list[i], -1);
                continue;
            }
        }
        addCueWords("成功跳转" + count + "个页面", 1);
    })


    /**
     * 方法区
     */
    // 悬浮窗：展开按钮
    function addWindow() {
        //
        $("body").append(
            `<div id="showWindow" style='right:10px; top:80px; width:40px; background:#1a59b7; color:#ffffff; overflow:hidden; z-index:9998; position:fixed; padding:5px; text-align:left; word-break:break-all;'>
                <div id="windowTitle" style="font-size: 18px;">` + "展开" + `</div>
            </div>`
        );
    }
    // 悬浮窗：操作窗口
    function addWindow2() {
        $("body").append(
            `<div id="operateWindow" style='right:10px; top:80px; width:440px; display: none; background:#1a59b7; color:#ffffff; overflow:hidden; z-index:9999; position:fixed; padding:5px; text-align:left; word-break:break-all;'>
                <input type="button" value="跳转" class="btn-32-green" id="goto" style="margin: 5px;" />
                <input type="button" value="隐藏" class="btn-32-green" id="hideWindow" style="margin: 5px;" />
                <br/>
                <textarea name="linkList" style="margin: 5px; padding: 5px; min-height: 200px; width: 418px;"></textarea>

                <div id="cueWordWindow" style="margin: 5px; padding: 5px; background: white;"></div>
            </div>`
        );
    }

    // 更新提示词 cueWords
    function addCueWords(text, type) {
        type = type || 1;
        var mytime = new Date().toLocaleTimeString(); // 获取当前时间
        var html;
        if (type === 1) {
            html = '<p style="color: black;">' + mytime + "  " + text + '</p>'
        } else {
            html = '<p style="color: red;">' + mytime + "  " + text + '</p>'
        }

        $("#cueWordWindow").prepend(html)
    }
})();