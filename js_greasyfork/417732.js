// ==UserScript==
// @name         标记系统辅助脚本
// @namespace    None
// @version      0.1
// @description  用来辅助标记系统的脚本
// @author       lovemefan
// @match        http://222.197.219.6:8080/cclzc/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/417732/%E6%A0%87%E8%AE%B0%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/417732/%E6%A0%87%E8%AE%B0%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var translate_url = 'http://lovemefan.top/translate'
    var inner_html = '<div id="transtext" style="position:fixed; left:8%; bottom:52%; z-index:10008; padding: 10px; background: #ffffff; font-size: 12px;border-radius: 5%;"><div id="transtext_content" class="transtext-content" style="padding: 10px 0px 0px 0px;font-size:2em;">标注系统翻译辅助</div> </div>'
    $(inner_html).appendTo('body')
    $('#updatexyz').bind('input propertychange blur change foucs' , function(){
        var text = ''
        setTimeout(function(){
           text = $('#updatexyz')[0].value;
           console.log(text);
           translate(text);
        }, 800);
       
    });
    //对所有的button点击后触发一次文本框的个改变，以便触发翻译事件
    $("button").on('click', function(){
        $("#updatexyz").blur();
    });

    function translate(text){
        GM_xmlhttpRequest({
            method: 'GET',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Host': 'lovemefan.top',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.92 Safari/537.36'
            },
            url: 'http://lovemefan.top/translate?text=' + text ,
            onload: function (xhr) {

                if(xhr.status == 200){

                    console.log(xhr.responseText)
                    var obj = $.parseJSON(xhr.responseText)
                    console.log(obj)
                    $('#transtext_content').text(obj.result)

                }
                if(xhr.status == 500){
                   console.log('翻译失败，请重试！')
                    $('#transtext_content').text('翻译失败，重新点击一下目标语言文本框即可')
                }
            }
        });

    }
})();