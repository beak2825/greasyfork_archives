// ==UserScript==
// @name         快麦助手Local售后版
// @namespace    lezizi
// @version      0.1.1
// @description  快麦助手Local售后返款版辅助
// @author       Via
// @match        https://*.superboss.cc/*
// @icon         https://erp.superboss.cc/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/460432/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E5%94%AE%E5%90%8E%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/460432/%E5%BF%AB%E9%BA%A6%E5%8A%A9%E6%89%8BLocal%E5%94%AE%E5%90%8E%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    GM_registerMenuCommand("打开登记表格",function(){
        window.open("https://alidocs.dingtalk.com/i/nodes/jkB7yl4ZK3vV6DkjGoRa8PMX2O6oxqw0");
    });

    GM_registerMenuCommand("复制工单信息",function(){
        if (!(document.URL.includes("#/aftersale/reg_supple_next/")) ){
            alert("请在 登记补款 页面使用！");
            return;
        }
        getAfsList();
    });

    GM_registerMenuCommand("绑定点击事件",function(){
        if (!(document.URL.includes("#/aftersale/reg_supple_next/")) ){
            alert("请在 登记补款 页面使用！");
            return;
        }

        if (document.querySelector("#bts5566")){
            alert("事件已绑定");
            return;
        }

        // 搜索按钮
        let btSearch = document.querySelector("#aftersale_reg_supple_next > div > div:nth-child(2) > div.rep_supple_next_header > form > div:nth-child(7) > div > button:nth-child(1)");
        btSearch.id = "bts5566";
        // 售后工单输入框
        let inputAfs = document.querySelector("#aftersale_reg_supple_next > div > div:nth-child(2) > div.rep_supple_next_header > form > div:nth-child(5) > div > div.el-input > input");
        // 获取焦点时候清空内容
        inputAfs.onfocus = ()=>{
            inputAfs.value="";
        }
        // 失去焦点时候调用搜索
        inputAfs.onblur = ()=>{
            btSearch.click();
            setTimeout(() => {
                //document.getElementsByClassName("el-icon el-icon-add-group")[0].click();
                document.querySelector("span.el-link--inner").click();
            }, 2000)
        }
        alert("事件已绑定");
    });
    function getAfsList(){
        let afsmsg = ``;
        let eurl = document.domain;
        fetch(`https://${eurl}/as/order/rep/list`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                "bx-v": "2.2.3",
                "companyid": "13798",
                "content-type": "application/json",
                "module-path": "/aftersale/reg_supple_next/",
                "sec-ch-ua": "\"Chromium\";v=\"110\", \"Not A(Brand\";v=\"24\", \"Microsoft Edge\";v=\"110\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            "referrer": `https://${eurl}/index.html`,
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"repType\":2,\"status\":2,\"isAll\":true,\"blurWorkOrder\":1,\"queryType\":\"id\",\"timeType\":\"0\",\"pageSize\":50,\"pageNo\":1,\"api_name\":\"as_order_rep_list\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        }).then(function(res) {
            return res.json();
        }).then(function(data){
            for(let afs of data.data.list){
                afsmsg += `${afs.applyTime}\t${afs.shopName}\t${afs.id}\t${afs.tid}\t${afs.reason}\t${afs.refundMoney/100}\n`;
            }
            console.log(afsmsg);
            GM_setClipboard(afsmsg);
            alert("单号已复制");
            //return afsmsg;
        })
    }
})();