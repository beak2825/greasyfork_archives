// ==UserScript==
// @name         Auto select right answer for cnmooc
// @namespace    https://github.com/Ohdmire/autoforcnmmoc
// @version      0.9.9
// @description  A script automatically finishes exams.
// @author       Ohdmire
// @match        http://180.76.151.202/study/*
// @match        https://www.cnmooc.org/study/*
// @grant        none
// @require      https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/480670/Auto%20select%20right%20answer%20for%20cnmooc.user.js
// @updateURL https://update.greasyfork.org/scripts/480670/Auto%20select%20right%20answer%20for%20cnmooc.meta.js
// ==/UserScript==

(async function () {
    let btn=document.createElement("button");
    btn.innerHTML="一键选择答案";
    btn.onclick=function(){
    //code
    var answerlen=document.getElementsByClassName("test-ana").length;
for (var i=0;i<answerlen;i++){
    var rightanswers=document.getElementsByClassName("test-ana")[i].innerText.replace("参考答案：\n","");
    var is_single=document.getElementsByClassName("test-header")[i].innerText;
    if (is_single.indexOf("多选题") != -1){
        var rightanswerlist=rightanswers.split(' ');
        console.log(rightanswerlist);
        for (var n = 0; n < rightanswerlist.length; n++) {
            var rightanswer=rightanswerlist[n];

            if (rightanswer=="A")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[0].getElementsByClassName("input-c")[0].click();
            }
            else if (rightanswer=="B")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[1].getElementsByClassName("input-c")[0].click();
            }
            else if (rightanswer=="C")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[2].getElementsByClassName("input-c")[0].click();
            }
            else if (rightanswer=="D")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[3].getElementsByClassName("input-c")[0].click();
            }
            else if (rightanswer=="E")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[4].getElementsByClassName("input-c")[0].click();
            }
            else if (rightanswer=="F")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[5].getElementsByClassName("input-c")[0].click();
            }
            else
            {
                alert("未找到答案");
            }
            }
    }
    else{
        rightanswer=rightanswers
        if (rightanswer=="A")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[0].getElementsByClassName("input-r")[0].click();
            }
            else if (rightanswer=="B")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[1].getElementsByClassName("input-r")[0].click();
            }
            else if (rightanswer=="C")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[2].getElementsByClassName("input-r")[0].click();
            }
            else if (rightanswer=="D")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[3].getElementsByClassName("input-r")[0].click();
            }
            else if (rightanswer=="E")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[4].getElementsByClassName("input-r")[0].click();
            }
            else if (rightanswer=="F")
            {
                document.getElementsByClassName("test-ana")[i].parentElement.getElementsByClassName("t-option")[5].getElementsByClassName("input-r")[0].click();
            }
            else
            {
                alert("未找到答案");
            }
    }

};

}
    var parent=document.querySelector(".learn-nav");
    var old=document.querySelector(".btn-faq");
    parent.replaceChild(btn,old);

    ah.proxy({
    //请求发起前进入
    onRequest: (config, handler) => {
        console.log(config.url)
        handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
        console.log(err.type)
        handler.next(err)
    },
    //请求成功后进入
    onResponse: (response, handler) => {
        var res=response.response
        response.response=res.replace("var answerReviewTypeFlag = (answerReviewType == 2 && submitFlag == 1);","var answerReviewTypeFlag = true")
        console.log(response.response)
        handler.next(response)
    }
})


})();