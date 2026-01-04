// ==UserScript==
// @name         CJYAnswer
// @namespace    asd2323208.github.io/
// @version      0.3
// @description  别看了，用就是了。
// @author       DANIAO
// @run-at       document-body
// @match        *://*.hunbys.com/student-exam/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/398765/CJYAnswer.user.js
// @updateURL https://update.greasyfork.org/scripts/398765/CJYAnswer.meta.js
// ==/UserScript==

'use strict';
(function () {

    document.getElementById("type").value=0

    var scriptHtml='function getAnswerManually(){function getAnswer(){var question = document.getElementById("questioninput").value;$.ajax({type: "GET",url: "http://daniao.phpnet.us/?q="+question,dataType: "jsonp",success: function(data) {console.log(data+"|ok");document.getElementById("answerArea").value=""}});}getAnswer()}'
    var g = document.createElement('script');
    var s = document.getElementsByTagName('script')[0];
    g.text = scriptHtml
    s.parentNode.insertBefore(g, s);
    document.body.innerHTML+='<div id="getAnswerManually" style="position: fixed;top: 100px;left: 0px;padding: 10px;background: rgb(255, 255, 255);border-radius: 4px;"><p style="color:red;">接口又坏了，暂停使用！</p><button onclick="getAnswerManually()">查询答案</button><p>  </p><textarea wrap="off" cols="45" rows="4" style="overflow: auto; border-radius: 4px; margin: 0px; width: 270px; height: 50px;" id="questioninput"></textarea><p>  </p><p>答案如下</p><textarea wrap="off" cols="45" rows="8" style="overflow: auto; border-radius: 4px; margin: 0px; width: 270px; height: 152px;" id="answerArea"></textarea><br><span style="font-size:0.7em;padding-left: 75%;"><a id="myLink">By DANIAO</a></span></div>'
    document.getElementById("myLink").setAttribute('href','https://github.com/asd2323208/asd2323208.github.io/');
    document.getElementById("myLink").setAttribute('target','_blank');

    function initAnswer(){
        var questions = document.getElementsByClassName("pointer radio")
        function getAnswer(i){
            GM_xmlhttpRequest({
                method: "GET",
                url: 'http://daniao.phpnet.us/?q='+questions[i].innerText,
                onload: function(response) {
                    var data = eval(response.responseText)
                    console.log(data)
                    questions[i].innerHTML+='<b style="color:red">'+ data +'</b>'
                }
            });
        }
        for(var i=0;i<questions.length;i++){
            setTimeout(getAnswer(i),"500");
        }
    }
    setTimeout(initAnswer,"500");
})();
