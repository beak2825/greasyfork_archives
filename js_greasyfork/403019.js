// ==UserScript==
// @name         会计凭证-做题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.yunsx.com/Question/DianDa_PracticalTrainingQuestion?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403019/%E4%BC%9A%E8%AE%A1%E5%87%AD%E8%AF%81-%E5%81%9A%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/403019/%E4%BC%9A%E8%AE%A1%E5%87%AD%E8%AF%81-%E5%81%9A%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('正在准备做题，等待页面渲染中......');
    setTimeout(() => {
        // 做题部分
        var answerList = `
[{"ans1":["2019","01","01","记","02"],"ans2":["借入长期借款","银行存款","建行经济开发区支行","5000000.00","","","长期借款","建行经济开发区支行","","5000000.00"],"ans3":["刘峰","郭静","","刘晓霞"],"ans4":["2"],"title":"1、借入长期借款（分录题:59576）"},{"ans1":["2019","01","31","记","40"],"ans2":["计提借款利息","财务费用","利息费用","25000.00","","","应付利息","","","25000.00"],"ans3":["刘峰","","","刘晓霞"],"ans4":["1"],"title":"2、计提借款利息（分录题:59577）"},{"ans1":["2019","02","10","记","14"],"ans2":["支付借款利息","应付利息","","25000.00","","","银行存款","建行经济开发区支行","","25000.00"],"ans3":["刘峰","郭静","","刘晓霞"],"ans4":["1"],"title":"3、支付借款利息（分录题:59578）"},{"ans1":["2019","01","10","记","12"],"ans2":["收到投资款","银行存款","建行经济开发区支行","1000000.00","","","实收资本","长沙恒远","","1000000.00"],"ans3":["刘峰","郭静","","刘晓霞"],"ans4":["2"],"title":"4、收到投资款（分录题:59579）"},{"ans1":["2019","01","15","记","20"],"ans2":["收到投入机器设备","固定资产","机械设备","100000.00","","","实收资本","万达公司","","100000.00"],"ans3":["刘峰","","","刘晓霞"],"ans4":["2"],"title":"5、收到投入机器设备（分录题:59580）"},{"ans1":["2019","01","02","记","06"],"ans2":["收到投资款","银行存款","中行麓谷支行","1000000.00","","","资本公积","资本溢价","","100000.00","","实收资本","广州陇海","","900000.00"],"ans3":["蒋艳","龙明明","李杨","高珊"],"ans4":["2"],"title":"6、收到投资款（分录题:59583）"},{"ans1":["2019","03","30","记","43"],"ans2":["资本公积转增资本","资本公积","资本溢价","100000.00","","","实收资本","邓伦","","90909.09","","实收资本","广州陇海","","9090.91"],"ans3":["蒋艳","","李杨","高珊"],"ans4":["1"],"title":"7、资本公积转增资本（分录题:59581）"},{"ans1":["2018","12","31","记","68"],"ans2":["提取盈余公积","利润分配","提取法定盈余公积","13456.00","","","盈余公积","法定盈余公积","","13456.00"],"ans3":["李萌","","蒋玲玲","赵丽娜"],"ans4":["1"],"title":"8、提取盈余公积（分录题:59582）"},{"ans1":["2019","01","24","记","31"],"ans2":["支付股利","应付股利","武汉友豪","80000.00","","","银行存款","中国银行麓谷支行","","80000.00"],"ans3":["李萌","吴小雨","蒋玲玲","赵丽娜"],"ans4":["1"],"title":"9、支付股利（分录题:59584）"},{"ans1":["2018","12","31","记","63"],"ans2":["结转利润分配","利润分配","未分配利润","162000.00","","","利润分配","提取法定盈余公积","","54000.00","","利润分配","提取任意盈余公积","","108000.00"],"ans3":["李萌","","蒋玲玲","赵丽娜"],"ans4":["1"],"title":"10、结转利润分配（分录题:59585）"},{"ans1":["2019","01","31","记","52"],"ans2":["结转损益","主营业务收入","","2184000.00","","","其他业务收入","","1258.64","","","主营业务成本","","","721500.00","","销售费用","","","23411.31","","税金及附加","","","35388.67","","管理费用","","","96173.25","","财务费用","","","33106.50","","其他业务成本","","","996.50","","营业外支出","","","200.00","","本年利润","","","1274482.41"],"ans3":["李萌","","蒋玲玲","赵丽娜"],"ans4":[""],"title":"11、结转损益（分录题:59586）"}]
`;
        answerList = JSON.parse(answerList);

        console.log('页面渲染完成，开始做题......');
        var answerLen = document.querySelector('.topic').querySelectorAll('li').length;
        console.log('本次目标做题量：' + answerLen);
        var temp = 0;

        var runDoAnswer = function() {
            var title = document.querySelector('iframe').contentDocument.querySelector('#spTitle').innerText;
            var answers = null;
            answerList.forEach(item => {
                if (item.title === title) {
                    answers = item;
                }
            });
            if (answers) {
                var dom = document.querySelector('iframe').contentDocument;
                var btns = dom.querySelectorAll('.btn_regulation');
                if (btns.length > 0) {
                    // 记账凭证题型
                    var addBtn = btns[btns.length-1].querySelector('.add_btn');
                    while(answers.ans2.length > dom.querySelector('table').querySelectorAll('input').length) {
                        addBtn.click();
                    }
                    var ans1 = dom.querySelector('.date_panel').querySelectorAll('input')
                    var ans2 = dom.querySelector('table').querySelectorAll('input')
                    var ans3 = dom.querySelector('.list-inline').querySelectorAll('input')
                    var ans4 = dom.querySelector('.right_zhang').querySelectorAll('input')

                    for(var i=0, len=ans1.length; i<len; i++) {
                        ans1[i].value = answers.ans1[i] ? answers.ans1[i] : ''
                    }
                    for(var i=0, len=ans2.length; i<len; i++) {
                        ans2[i].value = answers.ans2[i] ? answers.ans2[i] : ''
                    }
                    for(var i=0, len=ans3.length; i<len; i++) {
                        ans3[i].value = answers.ans3[i] ? answers.ans3[i] : ''
                    }
                    for(var i=0, len=ans4.length; i<len; i++) {
                        ans4[i].value = answers.ans4[i] ? answers.ans4[i] : ''
                    }
                } else {
                    var inputs = dom.querySelectorAll('input');
                    var selects = dom.querySelectorAll('select');
                    for(var i=0, len=inputs.length; i<len; i++) {
                        inputs[i].value = answers.inputs[i] ? answers.inputs[i] : '';
                    }
                    for(var i=0, len=selects.length; i<len; i++) {
                        selects[i].value = answers.selects[i] ? answers.selects[i] : '';
                    }
                }
                console.log('正在做第 ' + (temp + 1) + ' 题');
                temp++;
                UpDown('Down');
                setTimeout(() => {
                    if (temp < answerLen) {
                        runDoAnswer();
                    }
                }, 3000);
            }
        }

        runDoAnswer();

    }, 3000);
})();