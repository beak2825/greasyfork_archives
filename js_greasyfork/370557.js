// ==UserScript==
// @name         将班固米首页的下一页改为加载更多
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       azuse
// @match        http://bgm.tv/
// @match        http://bangumi.tv/
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370557/%E5%B0%86%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%A6%96%E9%A1%B5%E7%9A%84%E4%B8%8B%E4%B8%80%E9%A1%B5%E6%94%B9%E4%B8%BA%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/370557/%E5%B0%86%E7%8F%AD%E5%9B%BA%E7%B1%B3%E9%A6%96%E9%A1%B5%E7%9A%84%E4%B8%8B%E4%B8%80%E9%A1%B5%E6%94%B9%E4%B8%BA%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==
var static_page = 2;
(function() {
    var a = document.createElement("a");
    a.className = "p";
    a.innerHTML = "加载更多";
    a.onclick = function(){
        $.ajax({
            type: "GET",
            url: "timeline?type=all&page="+static_page+"&ajax=1",
            success: function(html) {
                var htmlKai = $(html).html();
                var htmlNew = $(html).children("div#timeline");
                var newdate = $(html).children("h4.Header");
                var newul = $(html).children("ul");
                for(var i in newdate){
                    if(i == "length")break;
                    if($("#timeline").text().indexOf($(newdate)[i].innerHTML) != -1){
                        $("#tmlPager").before($(newul)[i].outerHTML);
                    }
                    else{
                        $("#tmlPager").before($(newdate)[i].outerHTML + $(newul)[i].outerHTML);
                    }
                }
                // if($("#timeline").text().indexOf($(newdate)[0].innerHTML)){
                //     $("#tmlPager")[0].previousElementSibling.innerHTML = $("#tmlPager")[0].previousElementSibling.innerHTML + $(html).children("ul").html();
                // }
                // else{
                //     $("#tmlPager")[0].previousElementSibling.innerHTML = $("#tmlPager")[0].previousElementSibling.innerHTML + $(html).children("*").html();
                // }
                static_page++;
                //$content.html(html);
                chiiLib.tml.prepareAjax();
            },
            error: function(html) {
                $("#robot_speech_js").html(AJAXtip['error']);
                $("#robot").animate({
                    opacity: 1
                }, 1000).fadeOut(500);
            }
        });
    };
    $(".page_inner")[0].innerHTML = "";
    $(".page_inner")[0].appendChild(a);
})();