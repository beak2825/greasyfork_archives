// ==UserScript==
// @name         Pluralsight Answer question helper
// @require      https://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      http://cdn.jsdelivr.net/g/filesaver.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打开历史题目页面（https://app.pluralsight.com/score/skill-assessment/xxx/summary-review）脚本自动运行，运行结束自动以试题标题命名下载为文件。
// @author       You
// @match        https://app.pluralsight.com/score/skill-assessment/*/summary-review
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406809/Pluralsight%20Answer%20question%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/406809/Pluralsight%20Answer%20question%20helper.meta.js
// ==/UserScript==



(function() {
    //'use strict';

    // Your code here...
    var result = ""
     var title= ""
     var lastQuestion = ""
    console.log("init success")
    function readQuestion(){
        var question = $('.main__2Qmtb div div p').text().trim();
        if(question=="" || question == lastQuestion ){
           setTimeout(function(){ readQuestion(); }, 1000);
           return
        }
        var answer = $('.key__2jYXf div').text().replace("Correct - ", "").trim();
        if(!answer){
            answer= $('.selectedKey__A1gk8 div').text().replace("Your choice: correct - ","").trim();
        }
        var tmp = "Q: "+question+"\nA: "+answer+"\n";
        console.log(tmp)
        result += tmp
        var nextButton = $('button[data-next="true"]')
        if (nextButton && !nextButton.is(':hidden')) {
           setTimeout(function(){
               nextButton.click();
               setTimeout(function(){ readQuestion(); }, 2000);
           }, 1000);
        }else{
           var blob = new Blob([result], {type: "text/plain;charset=utf-8"});
           saveAs(blob, title+".txt");
        }
    }
    setTimeout(function(){
        title = $('.assessmentTitle__1nfEH').text();
        readQuestion(); }, 8000);
})();
