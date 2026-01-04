// ==UserScript==
// @name         青书学堂自动答题工具（选择题）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  青书学堂作业自动填写选择题
// @author       kokusan
// @match        *://*.qingshuxuetang.com/hngd/Student/ExercisePaper*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446082/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%B7%A5%E5%85%B7%EF%BC%88%E9%80%89%E6%8B%A9%E9%A2%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/446082/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E5%B7%A5%E5%85%B7%EF%BC%88%E9%80%89%E6%8B%A9%E9%A2%98%EF%BC%89.meta.js
// ==/UserScript==


var answerPageUrl;
(function() {
    'use strict';

    // 创建一个iframe用来加载答案页面
    var pageUrl = window.location.href;

    // 青书学堂答案就在下面这个地址中
    answerPageUrl = pageUrl.replace("ExercisePaper", "ViewQuiz");


    var iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    iframe.style.display = 'none';
    iframe.src = answerPageUrl;

    // 初始化所有选项
    $('#form1 > div.question-entity input[type="checkbox"]').prop('checked', false);

    listenerIframe(iframe);

})();

var answer;

// 监听创建的答案iframe是否加载完毕
function listenerIframe(iframe) {
    var iframeLoad = function () {
        window.setTimeout(function() {
            console.log("加载完毕")

            // iframe加载完毕后获取所有问题的答案存进answer中
            var an = [];
            $(iframe.contentDocument).find('.question-detail-container span.question-detail-answer.question-detail-choice-solution').each(function(i) {
                an.push({"index":i, "value":$(this).html()})
            });
            console.log('成功获取答案数量:' + an.length);
            console.log(an)
            answer = an;
            writeInAnswerFun();

        }, 500);

        // 移除监听器
        iframe.removeEventListener("load", iframeLoad, true);
    };
    iframe.addEventListener('load', iframeLoad, true);
}

let sleepFun = function(fun, time) {
  setTimeout(function() {
    fun();
  }, time);
}

// 把答案写入到试卷中
function writeInAnswerFun() {
    if (!answer) {
        alert("未成功获取答案，请刷新页面重试！");
        return;
    }

    // 下面时成功获取答案后该进行的操作
    var errNumber = [];
    var index = 0;
    var _interval = setInterval(function() {
        try {
            let item = answer[index];
            let value = item.value;
            const $q_div = $('.paper-container > .question-detail-container').eq(index);
            let $input = $q_div.find('input[value="' + value + '"]');
            if ($input.length == 0 && checkEn(value)) {
                for (let v in value) {
                    let $inp = $q_div.find('input[value="' + value[v] + '"]');
                    if ($inp) {
                        $inp.click();
                    }
                }
            } else {
                let $o_des = $q_div.find('.option-description');
                $o_des.each(function(i2, e){
                    if ($(this).text() === value) {
                        $input = $(this).parent().find('input');
                        return;
                    }
                });
            }
            if ($input) {
                $input.click();
            }
        } catch(e) {
            try {
                errNumber.push(item.index + 1)
            } catch(e2){}
        }

        if (index >= answer.length -1) {
            clearInterval(_interval);
            setTimeout(function() {
                lastFun();
            }, 1000);
        }
        index++;
    }, 1000);

    if (errNumber.length > 0) {
        alert('第' + errNumber.join(',') + '题答案录入失败！')
    }

}

function checkEn(txt){
	var re=/^[a-zA-Z]+$/;
	if(!re.test(txt)){
       return false;
    }
	return true;
};

function lastFun() {
    $('.question_group_container .group_item').eq(answer.length - 1).click();
    alert('自动填入答案程序执行完毕。')
}