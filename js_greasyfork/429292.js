// ==UserScript==
// @name         查看卷面分和平时分
// @namespace    ershi_juanmianfen
// @version      0.2
// @description  二师教务系统查看卷面分和平时分
// @author       ljn
// @match        http://jwc.cque.edu.cn/jsxsd/kscj/cjcx_list
// @match        http://jwc.cque.edu.cn/jsxsd/kscj/pscj_list*
// @icon         https://www.google.com/s2/favicons?domain=cque.edu.cn
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/429292/%E6%9F%A5%E7%9C%8B%E5%8D%B7%E9%9D%A2%E5%88%86%E5%92%8C%E5%B9%B3%E6%97%B6%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/429292/%E6%9F%A5%E7%9C%8B%E5%8D%B7%E9%9D%A2%E5%88%86%E5%92%8C%E5%B9%B3%E6%97%B6%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
      if(window.location.pathname == "/jsxsd/kscj/cjcx_list") {
          var user = $('#dataList').children().eq(0).children().eq(1).children().eq(4).contents().eq(3)[0].data.trim().match(/id=(\d*)&jx/)[1]
          var ainput = ''
          var arr = []
          $('#dataList').children().eq(0).children().eq(0).children().last().text("查看卷面分/平时分")
          for (var i = 1; i < $('#dataList').children().eq(0).children().length; i++) {
              var a1 = $('#dataList').children().eq(0).children().eq(i).children().eq(4).contents().eq(3)[0].data.trim().match(/<a href="(\S*)">/)[1]
              ainput = $("<input></input>").text(user)
              var a4 = `<a href="${a1}" class="chachengji"></a>`
              $('#dataList').children().eq(0).children().eq(i).children().last().append(a4)
              $('#dataList').children().eq(0).children().eq(i).children().last().append(ainput)
              var a3 = $('#dataList').children().eq(0).children().eq(i).children().last().children().eq(1)
              a3.val(user)

              var a2 = $('#dataList').children().eq(0).children().eq(i).children().last().children().eq(0)
              a2.css("background", "#3390ff")
              a2.css("width", "100%")
              a2.css("height", "30px")
              a2.css("color", "#fff")
              a2.css("display", "block")
              a2.css("text-align", "center")
              a2.css("line-height", "30px")
              a2.text("点击查看")
              arr.push(Number($('#dataList').children().eq(0).children().eq(i).children().eq(4).text().replace(/\D/g, "")))

          }

          console.log(arr)
          var zongcj = 0
          for(i = 0; i < arr.length; i++) {
              zongcj += arr[i]
          }
          var newtd = `<tr><td></td><td></td><td></td><td>总成绩:${zongcj}<br/>平均成绩:${(zongcj/arr.length).toFixed(2)}</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`
          $("#dataList").children().eq(0).append(newtd)



          $(".chachengji").click(function(){
              var a5 = $(this).parent().children().eq(1).val()
              if(user != a5) {
                  alert("你查看的不是你本人的成绩，少偷窥人家")
              }
              var a6 = $(this).parent().parent().children().eq(4).contents().eq(3)[0].data.trim().match(/<a href="(\S*)">/)[1]
              var a61 = a6.split(/1\d{9}/)
              console.log(a61)
              var a62 = a61[0] + a5 + a61[1]
              $(this).attr("href", a62)
          })
      } else {
              $("body").append("<h2>插件留言：</h2>")
              $("body").append("<h2>此页面的总成绩是由计算获得，实际成绩以上一个页面为准</h2>")
              $("body").append("<h2>未计算期中和实验成绩，因为看不懂</h2>")
              $("body").append("<h2>如果成绩有误差，那多半是期中和实验影响了</h2>")
              var b1 = $("tbody").children().eq(1).children()
              var chengji = (b1.eq(1).text() * b1.eq(2).text().split("%")[0] / 100 + b1.eq(5).text() * b1.eq(6).text().split("%")[0] / 100).toFixed(2)
              b1.last().text(chengji)
      }
    })

    // Your code here...
})();