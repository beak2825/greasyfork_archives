// ==UserScript==
// @name         工建系统打分
// @namespace    https://www.baidu.com/
// @version      1.2.1
// @description  打分累死不你算我的
// @author       莫语
// @match        http://135.41.239.25:8702/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524027/%E5%B7%A5%E5%BB%BA%E7%B3%BB%E7%BB%9F%E6%89%93%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/524027/%E5%B7%A5%E5%BB%BA%E7%B3%BB%E7%BB%9F%E6%89%93%E5%88%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(e) {
        if (e.key.toLowerCase() === 'g') {
            init()
        }
    })

    const guize ={
        "贵州企铭科技有限公司":{
            "引入签约":["12"],
            "项目落地数量":["6"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
       "安顺安和信息技术有限公司":{
           "引入签约":["9"],
           "项目落地数量":["2"],
           "客户好评":["2"],
           "协助项目回款":["5","4"],
           "售后情况":["5"],
           "采购合同内容拟定与履行的及时性":["8","6"]
       },
       "安顺屯田科技有限责任公司":{
           "引入签约":["12"],
           "项目落地数量":["6"],
           "客户好评":["2"],
           "协助项目回款":["5","4"],
           "售后情况":["5"],
           "采购合同内容拟定与履行的及时性":["8","6"]
       },
        "安顺忆闻科技有限公司":{
            "引入签约":["9"],
            "项目落地数量":["4"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "北京华信有道科技有限公司":{
            "引入签约":["9"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵阳利惠科技开发有限公司":{
            "引入签约":["3"],
            "项目落地数量":["4"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州安顺大数据发展有限公司":{
            "引入签约":["12"],
            "项目落地数量":["8"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州鸿盛诚科技有限公司":{
            "引入签约":["9"],
            "项目落地数量":["4"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州华创云科网络科技有限公司":{
            "引入签约":["9"],
            "项目落地数量":["6"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州计信科技有限公司":{
            "引入签约":["3"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州蓝鹊信息技术有限公司":{
            "引入签约":["0"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州联视安防科技有限公司":{
            "引入签约":["3"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州漫道南方信息技术有限公司":{
            "引入签约":["3"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州黔电思锐科技有限公司":{
            "引入签约":["12"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州数创控股（集团）有限公司":{
            "引入签约":["3"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州通信建设工程有限公司":{
            "引入签约":["3"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州裕安科技有限公司":{
            "引入签约":["9"],
            "项目落地数量":["6"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州云视界科技有限公司":{
            "引入签约":["9"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "贵州众享云科技有限公司":{
            "引入签约":["3"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "晖智技术有限公司":{
            "引入签约":["3"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "普定县俊垚网络科技有限公司":{
            "引入签约":["3"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "四川卓信思达通信技术有限公司":{
            "引入签约":["0"],
            "项目落地数量":["2"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "西安金讯通软件技术有限公司":{
            "引入签约":["9"],
            "项目落地数量":["6"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        },
        "中邮通网络科技有限公司":{
            "引入签约":["9"],
            "项目落地数量":["0"],
            "客户好评":["2"],
            "协助项目回款":["5","4"],
            "售后情况":["5"],
            "采购合同内容拟定与履行的及时性":["8","6"]
        }
    }



    function init() {
        document.getElementsByTagName('table')[0].getElementsByTagName('a')[0].click();
      setTimeout(do1, 1000);
    }
    function do1() {3
        document.getElementsByClassName('btn ant-btn ant-btn-primary')[0].click();
        setTimeout(do2, 1000);
    }
    function do2() {
      let offer_name= document.getElementsByClassName('content')[0].getElementsByTagName('div')[0].innerText.slice(6)
      let has_offer_name=guize[offer_name]
      let tr =  document.getElementsByTagName('tr')
        for (let i = 1; i < tr.length-9; i++) {
            if (tr[i].getElementsByTagName('td').length>6){
                let item = tr[i].getElementsByTagName('td')[2].innerText
                let score = tr[i].getElementsByTagName('td')[3].innerText
                let input =  tr[i].getElementsByTagName('td')[6].getElementsByTagName('input')[0]
                input.value = String(Number(score)-Math.floor(Math.random() * 2));
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
                if (has_offer_name!==null){
                    Object.keys(has_offer_name).forEach(function(key) {
                        if (key === item) {
                            let list = has_offer_name[key]
                            input.value=list[Math.floor(Math.random() * list.length)];
                            const inputEvent = new Event('input', { bubbles: true });
                            input.dispatchEvent(inputEvent);
                        }
                    });
                }

            }
            else if (tr[i].getElementsByTagName('td').length>5){
                let item = tr[i].getElementsByTagName('td')[0].innerText
                let score = tr[i].getElementsByTagName('td')[2].innerText
                let input =  tr[i].getElementsByTagName('td')[5].getElementsByTagName('input')[0]
                input.value = String(Number(score)-Math.floor(Math.random() * 2));
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
                if (has_offer_name!==null){
                    Object.keys(has_offer_name).forEach(function(key) {
                        if (key === item) {
                            let list = has_offer_name[key]
                            input.value=list[Math.floor(Math.random() * list.length)];
                            const inputEvent = new Event('input', { bubbles: true });
                            input.dispatchEvent(inputEvent);
                        }
                    });
                }

            }
            else {
                let item = tr[i].getElementsByTagName('td')[0].innerText
                let score = tr[i].getElementsByTagName('td')[1].innerText
                let input =  tr[i].getElementsByTagName('td')[4].getElementsByTagName('input')[0]
                input.value = String(Number(score)-Math.floor(Math.random() * 2));
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
                if (has_offer_name!==null){
                    Object.keys(has_offer_name).forEach(function(key) {
                        if (key === item) {
                            let list = has_offer_name[key]
                            input.value=list[Math.floor(Math.random() * list.length)];
                            const inputEvent = new Event('input', { bubbles: true });
                            input.dispatchEvent(inputEvent);
                        }
                    });
                }
            }
        }
        let table =  document.getElementsByClassName('ant-table-content')
        let tr2 = table[1].getElementsByTagName('tr')
        for (let i = 1; i < tr2.length; i++) {
            let label=  tr2[i].getElementsByTagName('td')[3].getElementsByTagName('label')
            if (i === tr2.length-1){
                label[0].click()
            }else {
                label[1].click()
            }

        }
        document.getElementsByClassName('foot')[0].getElementsByTagName('button')[0].click()
    }

})();