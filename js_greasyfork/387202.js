// ==UserScript==
// @name         青海大学计算机系专业课抢课
// @namespace    https://github.com/leeli73/
// @version      0.1
// @description  全自动抢课软件
// @author       Yilong Li
// @match        http://49.209.80.139:8080/student/content/00*
// @require       https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/387202/%E9%9D%92%E6%B5%B7%E5%A4%A7%E5%AD%A6%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E4%B8%93%E4%B8%9A%E8%AF%BE%E6%8A%A2%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/387202/%E9%9D%92%E6%B5%B7%E5%A4%A7%E5%AD%A6%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%B3%BB%E4%B8%93%E4%B8%9A%E8%AF%BE%E6%8A%A2%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    $('h2').text(function( index, olderContent ){
        return olderContent.replace('计算机系教学管理系统','计算机系教学管理系统——抢课插件已加载');
    });
    var saveValue = GM_getValue('class_Count')
    if(saveValue == null)
    {
         $('h2').append("<br>课程序号：<input id=\"classCount\"></input><h5>及课程在下方表中的位置,从0计数,多个已英文;隔开.例如:0;4;9</h5><br>")
         $('h2').append("<button id=\"startwork\">启动抢课...</button>")
    }
    else
    {
        $('h2').append("<br>抢课中...选中课程序号:"+ saveValue +"<br>")
        $('h2').append("<button id=\"stopwork\">取消抢课...</button>")
        var index = 0
        var temp = saveValue
        var AllCount = temp.split(";")
        var count = 0
        $('input[type="checkbox"]').each(function () {
            if(AllCount[count] == index.toString())
            {
                $(this).click()
                count++
            }
            index++
        });
        $('input[type="button"]').each(function () {
             if($(this).val().search("选课") == -1)
             {
                 return
             }
             if($(this).prop("disabled"))
             {
                 console.log("当前不能选课...")
             }
            else
            {
                console.log("提交选课...")
                $(this).cleck()
            }
        });
        setTimeout(function (){
            window.location.reload();
        }, 3000);
    }
    $("#startwork").click(function(){
        var index = 0
        var temp = $("#classCount").val()
        if(temp == "")
        {
            alert("请正确输入!")
            return
        }
        var AllCount = temp.split(";")
        var count = 0
        GM_setValue('class_Count', temp);
        $('input[type="checkbox"]').each(function () {
            if(AllCount[count] == index.toString())
            {
                $(this).click()
                count++
            }
            index++
        });
        window.location.reload();
  });
    $("#stopwork").click(function(){
        GM_setValue('class_Count', null);
        location.reload()
  });
})();