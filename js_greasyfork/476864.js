// ==UserScript==
// @name         刺猬猫后台增强Lite
// @namespace    com.yukirus.cwmsj
// @version      0.1.0
// @description  刺猬猫后台增强Lite-1.后台间贴下显示对应段落内容
// @author       神代千雪
// @match        https://author.ciweimao.com/*
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476864/%E5%88%BA%E7%8C%AC%E7%8C%AB%E5%90%8E%E5%8F%B0%E5%A2%9E%E5%BC%BALite.user.js
// @updateURL https://update.greasyfork.org/scripts/476864/%E5%88%BA%E7%8C%AC%E7%8C%AB%E5%90%8E%E5%8F%B0%E5%A2%9E%E5%BC%BALite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 查看章节地址：https://author.ciweimao.com/book_manage/get_chapter_detail_show
    // post格式：
    /*
    var postCaptchaExample = {
        book: 100272313,
        chapter: 107763230
    }
    */
    $(document).ready(()=>{
        $("iframe").load(()=>{
            console.log("iframe ready")
            var iframeDocument = document.getElementsByTagName("iframe")[0].contentDocument
            $(iframeDocument).find(".paragraph").each((i,e)=>{
                var ParagraphInfo = e.innerText.split(" / ");
                var captchaParagraph = Number(ParagraphInfo[2].split(" ")[1])
                var captchaIdstring = $(e).attr("href").split("book_id=")[1]
                var captchaIdSplit = captchaIdstring.split("&chapter_id=")
                var bookid = captchaIdSplit[0]
                var capterid = captchaIdSplit[1]
                var postCaptchaExample = {
                    book: Number(bookid),
                    chapter: Number(capterid)
                }
                $.post("https://author.ciweimao.com/book_manage/get_chapter_detail_show",postCaptchaExample,(result)=>{
                    var main = result
                    main = main.replace('</div><div class="chapter-ft"><h5>作者有话说：</h5><p>',"\n")
                    main = main.replace(/<div.*<h3 class="chapter-hd">/,"")
                    main = main.replace("</h3>","\n")
                    main = main.replaceAll('<div class="chapter-bd">',"")
                    main = main.replaceAll('</div>',"")
                    main = main.replaceAll("<p class='chapter'>　　","")
                    main = main.replaceAll('</p>',"")
                    var Paragraphs = main.split('\n')
                    console.log(Paragraphs[captchaParagraph])
                    var showPar = Paragraphs[captchaParagraph]
                    if(showPar == undefined){
                        showPar = Paragraphs[captchaParagraph-1] + "<br>" + Paragraphs[captchaParagraph-2]
                    }
                    $(e).parent().parent().append("<div class='plusaddparagraphs' style='background:#efefef;padding: 5px 5px;margin-top:10px'><span style='font-size:25px;margin-right:10px'>“</span>" + showPar +"</div>")
                })
                // console.log(captchaIdstring)
                
                // $(e).mouseover(()=>{

                // })
                console.log($(e))
            })
        })
    })

})();