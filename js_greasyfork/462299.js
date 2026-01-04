// ==UserScript==
// @name         山西石化比武自动显示答案
// @namespace    https://greasyfork.org/zh-CN/scripts/462299
// @version      1.3
// @description  山西石油分公司2023年零售专业线条竞赛比武自动显示答案
// @match        https://ks.wjx.top/vm/tUMBcoX.aspx*
// @author       gyc2432
// @connect      cx.flsec.cn
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462299/%E5%B1%B1%E8%A5%BF%E7%9F%B3%E5%8C%96%E6%AF%94%E6%AD%A6%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462299/%E5%B1%B1%E8%A5%BF%E7%9F%B3%E5%8C%96%E6%AF%94%E6%AD%A6%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    window.onload = function(){
        let question_forms = document.getElementsByClassName('field ui-field-contain');//取到所有问题
        console.log("start print")
        //console.log(question_forms)
        for (let i=0;i<=question_forms.length;i++){
            if (i == 0){
                document.querySelector("#div1 > div.ui-controlgroup.column3.two_column > div:nth-child(7) > div").click();
            }
            if (i == 1){
                document.querySelector("#q2_1").value="3270";
            }
            if (i >=2 ){
                let question_labels = document.getElementsByClassName('field-label');
                let question_div = question_labels[i];
                let question = question_div.innerHTML;
                //console.log(question_div)
                var patt1 = /<.*>/g;
                question = question.replace(patt1,"")
                //document.write(question.replace(patt1,""));
                //console.log(question)
                let p = document.createElement("p");
                GM_xmlhttpRequest({
                    method: 'get',
                    //url: 'http://cx.flsec.cn/biwu?question='+ encodeURIComponent(question),
                    url: 'http://cx.flsec.cn/biwu?question='+ encodeURIComponent(question),

                    //data: JSON.stringify(question),
                    headers: {
                        'charset': 'UTF-8',
                        'Content-type': 'application/x-www-form-urlencoded'},
                    onerror: (error) => {
                        p.innerHTML= '查找失败';
                    },
                    ontimeout: (error) => {p.innerHTML= '网络超时';},
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
                                p.innerHTML='答案：'+ res.answer;
                            }
                            if (res.code == 0) {
                                p.innerHTML= '没找到答案,手动答题后本题将自动上传正确答案到题库';
                            }
                        }
                        else {
                            p.innerHTML= '获取答案失败';
                        }
                    }});
                question_div.append(p);
            }
        }
    };
    document.getElementById('lxNextBtn').onclick = function(){
        console.log('success');
        let num = document.getElementById('schedule').innerHTML;
        let num1 = Number(num) + Number(1);
        let question_type = document.querySelector("#div"+num1.toString()).getAttribute('type');
        if (Number(num) >= 2){console.log('第'+(Number(num)-1)+'题');console.log('questype；'+question_type);}
        let checked = ''
        if (Number(question_type) == 4){//4:多选题，3:选择题
            for(let i=1; i<6;i++){
                let checked1 = document.querySelector("#div"+num1.toString()+" > div.ui-controlgroup.column1 > div.ui-checkbox.checked:nth-child("+i.toString()+") > div")
                if (checked1){
                    checked = checked + checked1.innerHTML.split('、')[0]
                }
            }
            //checked = document.querySelector("#div"+num1.toString()+" > div.ui-controlgroup.column1 > div.ui-checkbox.checked > div").innerHTML;
            //console.log(checked)
        }
        if (Number(question_type) == 3){
            //checked1= document.querySelector("#div6 > div.ui-controlgroup.column1 > div.ui-radio.checked > div")
            checked = document.querySelector("#div"+num1.toString()+" > div.ui-controlgroup.column1 > div.ui-radio.checked > div").innerHTML;
            //console.log(checked)
        }
        //let checkboxs = document.getElementsByClassName("ui-checkbox checked");
        let question = document.querySelector("#div"+num1.toString()+" > div.field-label").innerHTML.split("<span")[0];
        let check = document.querySelector("#div"+num1.toString()+" > div:nth-child(4) > span").innerHTML;
        console.log(question);
        console.log('选择的是：' + checked)
        console.log(check);
        if (check.split('，')[0] == '回答错误'){
            let answer = check.split('，')[1].split('：')[1]
            //console.log(question)
            //console.log(answer)
            //console.log('question='+ encodeURIComponent(question) + '&answer=' + encodeURIComponent(answer))
            GM_xmlhttpRequest({
                method: 'post',
                url: 'http://cx.flsec.cn/biwuup',
                //data: JSON.stringify(question),
                data:'question='+ encodeURIComponent(question) + '&answer=' + encodeURIComponent(answer),
                headers: {
                    'charset': 'UTF-8',
                    'Content-type': 'application/x-www-form-urlencoded'},
                onerror: (error) => {
                    console.log("上传错误");
                },
                ontimeout: (error) => {console.log("上传超时");},
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
                            console.log("上传成功");
                        }
                        if (res.code == 0) {
                            console.log("上传失败");
                        }
                        if (res.code == 2) {
                            console.log("此题已存在");
                        }
                    }
                    else {
                        console.log("上传接收返回失败");
                    }
                }});
        };
        if (check.split('，')[0] == '回答正确'){
            //console.log(checked)
            if(checked){
                GM_xmlhttpRequest({
                method: 'post',
                url: 'http://cx.flsec.cn/biwuup',
                //data: JSON.stringify(question),
                data:'question='+ encodeURIComponent(question) + '&answer=' + encodeURIComponent(checked),
                headers: {
                    'charset': 'UTF-8',
                    'Content-type': 'application/x-www-form-urlencoded'},
                onerror: (error) => {
                    console.log("上传错误");
                },
                ontimeout: (error) => {console.log("上传超时");},
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
                            console.log("上传成功");
                        }
                        if (res.code == 0) {
                            console.log("上传失败");
                        }
                        if (res.code == 2) {
                            console.log("此题已存在");
                        }
                    }
                    else {
                        console.log("上传接收返回失败");
                    }
                }});
            }
        }
    };
})();