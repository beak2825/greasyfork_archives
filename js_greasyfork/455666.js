// ==UserScript==
// @name         重大网络教育练习库工具
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  重庆大学网络教育学院练习库工具，提高答案检索效率
// @author       chengliang4810
// @match        https://exercise.5any.com/Exercise/WebUI/Exerpool/Index*
// @icon         https://www.google.com/s2/favicons?domain=5any.com
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455666/%E9%87%8D%E5%A4%A7%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E7%BB%83%E4%B9%A0%E5%BA%93%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/455666/%E9%87%8D%E5%A4%A7%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E7%BB%83%E4%B9%A0%E5%BA%93%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // css
    $("#accordion .dtk_items>.dtk_item").css({"width":"100%"});
    $(".subject_content").css({"width":"1600px"});
    $(".personal_nav").css({"width":"440px"});
    // 取消原点击事件
    $("#accordion .dtk_items>.dtk_item").unbind( "click" )

    // 重新绑定题目点击事件
    $("#accordion .dtk_items>.dtk_item").click(function(event){
        let index = $(this).attr("item-index");
        const that = this;
        if(!index){
            index = $(that).text();
            $(that).attr("item-index", index);
        }
        //
        console.log("点击:", index)
        const ptid = $(this).attr("data-ptid");
        const pidx = $(this).attr("data-index");
        //
        let thePath = top.location.href;
        const lastItem = thePath.substring(thePath.lastIndexOf('/') + 1)

        var num = '';
        for(var i=0;i<3;i++){
            num+=Math.floor(Math.random()*10);
        }
        $.ajax({
            type: "get",
            headers: {"Accept": "text/html, */*; q=0.01"},
            dataType : "html",
            url: `https://exercise.5any.com/Exercise/WebUI/Exerpool/LoadProblem/${lastItem}?ptid=${ptid}&pidx=${pidx}&ptidx=${index}&r=${num}`,
            success: function(msg){
                $("#load-waiting").hide();
                $("#content-detail").removeClass("hidden");
                $("#problem").html(" ");
                $("#problem").html(msg);
                const title = $("#problem > .item > .stem .richtextcontent");
                $(that).text(index + ". " + $(title).text());
                scrollTo(0,0);
            }
        });


    });

    // 自动开始加载题目
    setTimeout(function(){
        $("#accordion .dtk_items>.dtk_item").each(function(){
            let index = $(this).attr("item-index");
            const that = this;
            if(!index){
                index = $(that).text();
                $(that).attr("item-index", index);
            }
            //
            const ptid = $(this).attr("data-ptid");
            const pidx = $(this).attr("data-index");
            //
            let thePath = top.location.href;
            const lastItem = thePath.substring(thePath.lastIndexOf('/') + 1)

            var num = '';
            for(var i=0;i<3;i++){
                num+=Math.floor(Math.random()*10);
            }
            $.ajax({
                type: "get",
                headers: {"Accept": "text/html, */*; q=0.01"},
                dataType : "html",
                url: `https://exercise.5any.com/Exercise/WebUI/Exerpool/LoadProblem/${lastItem}?ptid=${ptid}&pidx=${pidx}&ptidx=${index}&r=${num}`,
                success: function(msg){
                    let placeholder = document.createElement('div');
                    placeholder.innerHTML = msg;
                    $(that).text(index + ". " + $(placeholder).find(".stem .richtextcontent").text());
                    // 添加复制答案按钮
                    $(".std-answer .answer").html("参考答案 <button class='copy-btn btn btn-success' data-clipboard-text='" + $(placeholder).find(".std-answer .richtextcontent").text() + "'>点击复制答案</button>");
                }
            });
        });
    }, 1000);

    // 显示参考答案
    setInterval(function(){
        $(".std-answer").attr("style","");
        $(".std-answer").removeClass("hidden");
    },  200)

    // 实例化Copy
    var clipboard = new ClipboardJS('.copy-btn');

    clipboard.on('success', function(e) {
        console.log(e);
    });

    clipboard.on('error', function(e) {
        console.log(e);
    });

})();
