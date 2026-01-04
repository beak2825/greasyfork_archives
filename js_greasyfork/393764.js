// ==UserScript==
// @name         批量磁力搜索
// @namespace    https://www.zhongzihu.com/
// @version      1.1.1
// @description  批量磁力搜索。
// @author       You
// @match        https://www.zhongzihu.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393764/%E6%89%B9%E9%87%8F%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/393764/%E6%89%B9%E9%87%8F%E7%A3%81%E5%8A%9B%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    $(".jumbotron .main-container").prepend("<div id='mydiv1'></div>")
    $("#mydiv1").append("<button id='myButton1'>确定</button>")
    $("#mydiv1").append("<textArea id='mySearch1'>神奇4位\n一条狗的回家路</textArea>")
    $("#mydiv1").append("<textArea id='mySearch2'></textArea>")

    let retArr = []
    $("#myButton1").click(function(){
        let searchArr = $("#mySearch1").val().split("\n")
        $("#mySearch2").html("")
        for(let searchStr of searchArr) {
            console.log(searchStr)
            $.ajax({
                url:"https://www.zhongzihu.com/list/"+searchStr+"/1",
                success: function(data){
                    let $sTable = $(data).find(".table-striped")
                    $sTable.each(function(i){
                        let retData = {}
                        let findName = $(this).find("td").eq(0).find("a").html()
                        let size = $(this).find("td").eq(2).find("strong").html().split(" ")[0]
                        let sizeType = $(this).find("td").eq(2).find("strong").html().split(" ")[1]
                        let url = $(this).find("td").eq(4).find("a").attr("href")

                        if ((sizeType == "GB" && size>= 1.00 && size <=2.3) ||
                            (sizeType == "MB" && size >= 700 && size <= 1100)) {
                            retData.name=searchStr
                            retData.size=size
                            retData.sizeType = sizeType
                            retData.url=url
                            retArr.push(retData)
                            let tData = $("#mySearch2").html()
                            tData += url + "\t" + size + sizeType + "\t" + searchStr + "\t" + findName + "\n"
                            $("#mySearch2").html(tData)
                            return false
                        }
                    })
                }
            })
        }
    })

})();