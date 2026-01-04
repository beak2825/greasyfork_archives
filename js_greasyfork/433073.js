// ==UserScript==
// @name         zjy_001
// @namespace    http://xg.com
// @version      10.0
// @description  This is a script for automatically refreshing courseware
// @author       XGGM
// @run-at       document-end
// @grant        none
// @License      MIT
// ==/UserScript==
String.prototype.replaceAll = function(s1, s2) {
    return this.split(s1).join(s2);
}
const dt = {
    quesion_list: '',
    question_number: '',
    httpData: '', 
    start: function () {
        fetch('https://dogdog.ltd:8082/dtPay/' + localStorage['userName'] + '/' + localStorage['displayName'])
            .then(data => data.json().then(data => {
                dt.httpData = data.data;
                console.log(dt.httpData);
                localStorage.setItem("httpData", JSON.stringify(dt.httpData));
                if (!dt.httpData.isActive) {
                    console.log("X.G定制");
                } else {
                    console.log("正在注册信息，请稍后重试!");
                }
                dt.init();
                if (dt.httpData.isActive) {
                    $('#pay').text('正在注册信息，请稍后重试!');
                } else {
                    $('#pay').text(`X.G破解VIP!有效期至${dt.httpData.validityPeriod}`);
                    dt.getAnswer(0);
                }
                // $('#pay').text('第三方题库失效，寻找新题库中');
            })).catch(err => console.error(err));

    },


    init: function () {
        const baseDiv = `<div id="answerBlock"
        style="max-height: 600px;background: #aeec958c;max-width:50%; float: right; margin-right: 265px;overflow:auto; position: fixed; top: 0; right: 0; z-index: 9999;">
        <table border="1" cellspacing="0" align="center" style="font-size: 14px;width: 100px;table-layout: fixed;">
            <caption style="min-width:500px;" ><a id="pay" style="color: blue">#</a></caption>
            <thead>
                <tr>
                    <th style="width: 7%;">题号</th>
                    <th style="width: 46%;">题目</th>
                    <th style="width: 40%;">答案</th>
                    <th style="width: 7%;">状态</th>
                </tr>
            </thead>
            <tbody style="text-align: left;">
    
            </tbody>
        </table>
    </div>`
        $(baseDiv).appendTo("body");

        dt.quesion_list = $(".e-q-q");
        dt.question_number = dt.quesion_list.length;
    },

    get_option: function (true_answer, question_id) {
        // 1：单选 2：多选  3：判断题
        let type = $($('.e-q-body.questionSortOrder')[question_id]).attr('data-questiontype');
        console.log('type = '+type)
        if (type == '1') {
            return dt.singleSelection(true_answer, question_id);
        } else if (type == '2') {
            return dt.multipleSelection(true_answer, question_id);
        } else if (type = '3') {
            return dt.judge(true_answer, question_id);
        }
        return 0;
    },

    //单选
    singleSelection: function (true_answer, question_id) {
        console.log('true = '+true_answer)
        var option_list = $(".e-a-g ul")[question_id];
        var option_length = $(option_list).children().length;
        for (let i = 0; i < option_length; i++) {
            let answert_1 = $($(option_list).children()[i]).children(".ErichText.destroyTitleButton")[0].innerText.trim();
            console.log('选项 = ' + answert_1)
            if (answert_1 == true_answer) {
                console.log('yesFind')
                $(option_list).children()[i].click();
                return 1;
            }
        }
        return 0;
    },

    //多选
    multipleSelection: function (true_answer, question_id) {
        var option_list = $(".e-a-g ul")[question_id];
        var option_length = $(option_list).children().length;
        let selected = 0; //已选数量
        let true_answers = true_answer.split('#');
        if (true_answers.length < 2) {
            true_answers = true_answer.split('');
            if (true_answers.length < 2) {
                true_answers = true_answer.split(';\n');
            }
        }

        for (let i = 0; i < option_length; i++) {
            let answert_1 = $($(option_list).children()[i]).children(".ErichText.destroyTitleButton")[0].innerText.trim();
            for (let index = 0; index < true_answers.length; index++) {
                const element = true_answers[index];
                if (answert_1 == element.trim()) {
                    $(option_list).children()[i].click();
                    selected++;
                    break;
                }
            }
        }
        return selected == true_answers.length ? 1 : 0;
    },

    //判断
    judge: function (true_answer, question_id) {
        var option_list = $(".e-a-g ul")[question_id];
        var option_length = $(option_list).children().length;

        if (true_answer == '对' || true_answer == '√') {
            true_answer = '正确';
        }
        if (true_answer == '错' || true_answer == '×') {
            true_answer = '错误';
        }
        for (let i = 0; i < option_length; i++) {
            let answert_1 = $($(".e-a-g ul")[question_id]).children()[i].innerText.indexOf('正确') > 0 ? '正确' : '错误';
            if (answert_1 == true_answer) {
                $(option_list).children()[i].click();
                return 1;
            }
        }
        return 0;
    },

    getAnswer: function (index) {
      let quesion = dt.quesion_list[index].innerText;
      if(quesion.length > 8 ){
        let quesion_after = quesion.substring(quesion.length - 8 , quesion.length ).replaceAll('（','').replaceAll('）','').replaceAll('。','').replaceAll('(','').replaceAll(')','').replaceAll('：','');
        let quesion_before = quesion.substring(0,quesion.length - 8);
        quesion = quesion_before +quesion_after;
      }else{
        quesion = quesion.replaceAll('（','').replaceAll('）','').replaceAll('。','').replaceAll('(','').replaceAll(')','').replaceAll('：','');
      }
      console.log(quesion.trim())
        $.ajax({
            type: "POST",
            // url: "https://dogdog.ltd:8082/dtPay/search",
            url: 'https://cx.icodef.com/wyn-nb',
            // url: "https://q.zhizhuoshuma.cn/?question=" + dt.quesion_list[index].innerText,
            dataType: 'json',
            data: {
                question: quesion.trim()
            },
            success: function (response) {
                console.log(response);
                // response
                let data = response;
                // data = data.split('}{');
                // data = data.length > 1 ? JSON.parse(data[0] + '}') : JSON.parse(data[0]);
                let code = 0;
                // if (data.success == 'true') {
                if (data.code > 0 ) {
                    code = dt.get_option(data.data.trim(), index);
                }
                let tbody = `<tr>
                    <td>${index+1}</td>
                    <td>
                        <div style="max-height: 60px;overflow-y: auto; ">
                            ${dt.quesion_list[index].innerText}
                        </div>
                    </td>
                    <td>
                        <div style="max-height: 60px; overflow-y: auto;font-weight: bold; ">
                            ${data.code > 0 ? data.data : '无答案'}
                        </div>
                    </td>
                    <td ${code == 0? "style='background: red'":null}>
                    ${code == 0? "✖︎":"✔"}
                    </td>
                </tr>`
                $(tbody).appendTo("#answerBlock table tbody");
                setTimeout(function () {
                    index += 1;
                    if (index < dt.question_number) {
                        dt.getAnswer(index)
                    }
                }, 1200);

                // console.log(response)
            }
        });
    }
}