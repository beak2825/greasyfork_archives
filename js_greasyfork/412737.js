// ==UserScript==
// @name         Click to add tasks to local rrshare download service
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @require    https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/412737/Click%20to%20add%20tasks%20to%20local%20rrshare%20download%20service.user.js
// @updateURL https://update.greasyfork.org/scripts/412737/Click%20to%20add%20tasks%20to%20local%20rrshare%20download%20service.meta.js
// ==/UserScript==

(function() {

    $(document).ready(function(){
        // 延时绑定点击事件
        setTimeout(function(){
            console.log(100);
            doBind();
        }, 100);
        // 延时绑定点击事件
        setTimeout(function(){
            console.log(200);
            doBind();
        }, 200);
        // 延时绑定点击事件
        setTimeout(function(){
            console.log(300);
            doBind();
        }, 300);
    });

    // 任意点击绑定点击事件
    $(document).click(function(){
        doBind();
    });

    function doBind(){
        $('a').unbind("click").click(function(){
            if($(this).attr('href')){
                var link = $(this).attr('href');
                if(link.indexOf('yyets://') == 0){
                    GM_xmlhttpRequest({
                        method: 'post',
                        url: "http://{IP:PORT}/api/addtask",
                        data: "tasks="+"[\""+link+"\"]",
                        headers: {'Access-Control-Allow-Origin': '*','Content-Type': "application/x-www-form-urlencoded", 'Cookie':"session={Your session}"},
                        onload: function(response) {
                            console.log(link);
                        }
                    });

                }
            }
        });
    }
})();