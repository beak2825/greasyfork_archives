// ==UserScript==
// @name         批量bthub
// @namespace    https://bthub.xyz/
// @version      1.0.3
// @description  批量bthub。
// @author       You
// @match        https://bthub.xyz/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397834/%E6%89%B9%E9%87%8Fbthub.user.js
// @updateURL https://update.greasyfork.org/scripts/397834/%E6%89%B9%E9%87%8Fbthub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;

    function myAjax(strArr){
        if (strArr.length <= 0) {
            return false
        }

        var str = strArr.pop()
        $.ajax({
            url:"https://bthub.xyz/main-search-kw-"+str+"-1.html",
            success: function(data){
                var tData = "";
                var $items = $(data).find(".search-item")
                console.log($items.length-1)
                if($items.length==0){
                	$("#mySearch2").html($("#mySearch2").html() + str + "\n")
                }
                var tmpStr = ""
                $items.each(function(i){
                	var $it = $(this)
                	var title = $it.find("a").attr("title")
                	var href = $it.find("a").attr("href").substr(6)
                	href = href.substr(0,href.length-5)
               		href = "magnet:?xt=urn:btih:" + href
               		//var $li = $it.find("li").eq(0)
               		var sizeStr = $it.find("span:contains(文件大小) > b").html()
               		var sizeType = sizeStr.substr(sizeStr.length-2,sizeStr.length)
               		var size = sizeStr.substr(0,sizeStr.length-2)
                    if(sizeType == "GB" && size*100 > 130 && size*100 <220 ){
                        tmpStr = `${str},${sizeStr},\t${href},\t ${title}\n`
               			$("#mySearch2").html($("#mySearch2").html() + tmpStr)
               			return false
                    } else if (sizeType == "GB" && size*100 > 100 && size*100 <270 ){
                        tmpStr = `${str},${sizeStr},\t${href},\t ${title}\n`
               			// $("#mySearch2").html($("#mySearch2").html() + tmpStr)
               		} else if(i == $items.length-1){
                        if (tmpStr != "") {
                            $("#mySearch2").html($("#mySearch2").html() + tmpStr)
                        } else {
                            $("#mySearch2").html($("#mySearch2").html() + str + "\n")
                        }
               		}
                })
                myAjax(strArr)
            },
            error: function(data){
                myAjax(strArr)
            }
        })
    }

    $(".header-div").append("<div style='float:right;' id='mydiv1'></div>")
    $("#mydiv1").append("<button id='myButton1'>确定</button>")
    $("#mydiv1").append("<textArea id='mySearch1'>aaaa\nbbbb</textArea>")
    $("#mydiv1").append("<textArea id='mySearch2'></textArea>")

    var retArr = []
    $("#myButton1").click(function(){
        var searchArr = $("#mySearch1").val().split("\n")
        $("#mySearch2").html("")
        myAjax(searchArr)
    })
})();