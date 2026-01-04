// ==UserScript==
// @name         山西石化比武自动答题-js
// @namespace    https://greasyfork.org/zh-CN/scripts/464866
// @version      1.8
// @description  山西石油分公司2023年零售专业线条竞赛比武自动显示答案
// @match        https://ks.wjx.top/vm/hZHCxeC.aspx*
// @author       gyc2432
// @connect      cx.flsec.cn
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464866/%E5%B1%B1%E8%A5%BF%E7%9F%B3%E5%8C%96%E6%AF%94%E6%AD%A6%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-js.user.js
// @updateURL https://update.greasyfork.org/scripts/464866/%E5%B1%B1%E8%A5%BF%E7%9F%B3%E5%8C%96%E6%AF%94%E6%AD%A6%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98-js.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let question_forms = document.getElementsByClassName('field');//取到所有问题
    let question_labels = document.getElementsByClassName('field-label');
    // console.log(question_forms.length);
    let result = '';
    console.log("开始检索答案：");
    for (let i=0;i<question_forms.length;i++){
        let nowi = Number(i)-4;
        if (i >4 ){
            let question_div = question_labels[i];
            let question = question_div.innerHTML;
            var patt1 = /<.*>/g;
            question = question.replace(patt1,"");
            
            console.log("问题" + nowi + ":" + question);
            let question_type = question_forms[i].getAttribute('type');//获取题目类型，3单选，4多选
            let answer = '';
            if(question_type == '3'){
                let answer_label = question_forms[i].getElementsByClassName('ui-controlgroup')[0];
                let options_label = answer_label.getElementsByClassName('ui-radio');
                let answers = Array.of(options_label)[0];
                for (let a=0;a < answers.length; a++){
                    if (answers[a].getAttribute('ans') == '1'){
                        answer = answer + answers[a].getElementsByClassName('label')[0].innerHTML;
                        answer = answer + "｜";
                        answers[a].getElementsByClassName('label')[0].click();
                    }
                }
                answer = answer.slice(0,-1);
                console.log("答案：" + answer);
            }
            if(question_type == '4'){
                let answer_label = question_forms[i].getElementsByClassName('ui-controlgroup')[0];
                let options_label = answer_label.getElementsByClassName('ui-checkbox');
                let answers = Array.of(options_label)[0];
                for (let a=0;a < answers.length; a++){
                    if (answers[a].getAttribute('ans') == '1'){
                        answer = answer + answers[a].getElementsByClassName('label')[0].innerHTML;
                        answer = answer + "｜";
                        answers[a].getElementsByClassName('label')[0].click();
                    }
                }
                answer = answer.slice(0,-1);
                console.log("答案：" + answer);
            }
            let p = document.createElement("p");
            p.innerHTML = "答案：" + answer;
            question_div.append(p);
            
            GM_xmlhttpRequest({
                method: 'post',
                url: 'http://cx.flsec.cn/biwuup',
                //data: JSON.stringify(question),
                data:'question='+ encodeURIComponent(question) + '&answer=' + encodeURIComponent(answer),
                headers: {
                    'charset': 'UTF-8',
                    'Content-type': 'application/x-www-form-urlencoded'},
                onerror: (error) => {
                    result = "问题" + nowi + "上传错误";
                },
                ontimeout: (error) => {result = "问题" + nowi + "上传超时"},
                onload: function(response){
                    let ress = JSON.parse(response.responseText);
                    //console.log(response.responseText)
                    if (response.status == 200) {
                        //console.log(ress);
                        let res = JSON.parse(ress);
                        //console.log(res.answer);
                        //console.log(res.code);
                        if (res.code == 1){
                            //console.log(res['answer'])
                            result = "问题" + nowi + "上传成功";
                        }
                        if (res.code == 0) {
                            result = "问题" + nowi + "上传失败";
                        }
                        if (res.code == 2) {
                            result = "问题" + nowi + "已存在";
                        }
                    }
                    else {
                        result = "问题" + nowi + "上传接收返回失败";
                    }
            }});
            console.log(result);
        }
    }
})();