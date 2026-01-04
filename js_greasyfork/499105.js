// ==UserScript==
// @name         生成数据字段
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  业务模型中生成数据字段
// @author       l
// @match        https://core.tellus-dev.saint-gobain.com.cn/ego_app/admin-area/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499105/%E7%94%9F%E6%88%90%E6%95%B0%E6%8D%AE%E5%AD%97%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/499105/%E7%94%9F%E6%88%90%E6%95%B0%E6%8D%AE%E5%AD%97%E6%AE%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRuning = false;
    setTimeout(function() {
    const iframe = document.getElementsByClassName("design-frame")['noHeader,noRoute,noTab,noBack,allowFullscreen'];
    if(iframe){
        var button = document.createElement("button");
        button.innerHTML = "测试用";
        button.style.position = "fixed";
        button.style.top = "65px";
        button.style.right = "10px";
        button.style.zIndex = "1000";
        button.style.padding = "10px 20px";
        button.style.backgroundColor = "#008CBA";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "5px";
        button.style.cursor = "pointer";
        button.onclick = function() {
            isRuning = !isRuning;
            if(isRuning){
                main(iframe.contentDocument || iframe.contentWindow.document);
            }
        };
        document.body.appendChild(button);
    }
    }, 3000);


    let cc = 0;
    const tableInfo = getTableInfo();
    async function main(document){
    for(const columnData of tableInfo){
        if(!isRuning){
            return;
        }
        let columnName = columnData.name;
        let columnType = columnData.type;
        let columnLength = columnData.length;
        let columnRemark = columnData.remark;
        if("2147483647" === columnLength){
            columnLength = "1000";
        }
        if(undefined === columnRemark){
            columnRemark = "";
        }
        const typeConvertMap = getTypeConvertMap();
        const addColumnInfo = {
            code: columnName,
            name: columnRemark,
            type: typeConvertMap[columnType],
            length: columnLength
        };
        document.getElementsByClassName('add')[0].click();
        await sleep(1000);
            const clickActiveElement = document.getElementsByClassName("click-active")[0];
            if(clickActiveElement !== undefined){
                const intputEvent = new Event('input', { bubbles: true });
                const typeIndex = addColumnInfo.type;
                clickActiveElement.querySelector('.td-code input').value = addColumnInfo.code;
                clickActiveElement.querySelector('.td-name input').value = addColumnInfo.name;
                clickActiveElement.querySelector('.td-code input').dispatchEvent(intputEvent);
                clickActiveElement.querySelector('.td-name input').dispatchEvent(intputEvent);
                if(typeIndex !== 0){
                    clickActiveElement.querySelector('.td-select-type .selectText').click();
                    await sleep(500);
                    document.getElementsByClassName("ant-popover-inner-content")[cc].querySelectorAll(".ant-radio-button-input")[typeIndex].click();
                    cc++;
                    clickActiveElement.querySelector('.td-select-type .selectText').click();
                }
                clickActiveElement.querySelector('.td-len input').value = addColumnInfo.length;
                clickActiveElement.querySelector('.td-len input').dispatchEvent(intputEvent);
            }
        await sleep(1000);
    };
    };

    function getTableInfo(){
        return [{"length":"50","name":"old_id","remark":"旧单据编号","type":"varchar"},{"length":"200","name":"GONGYINGSHANGNAME","remark":"未知1","type":"varchar"},{"length":"50","name":"HUOHAO","remark":"货号","type":"varchar"},{"length":"50","name":"SFzhekou","remark":"是否折扣","type":"varchar"},{"length":"50","name":"XIAOSHOUJIAOQI","remark":"SAP交货日期","type":"varchar"},{"length":"23","name":"ZHEKOULV","remark":"折扣率","type":"decimal"},{"length":"11","name":"autoid","remark":"未知2","type":"int"},{"length":"500","name":"baojiadanwei","remark":"报价单位","type":"varchar"},{"length":"500","name":"baozhuangfangshi","remark":"包装方式","type":"varchar"},{"length":"50","name":"caigoucankaoriqi","remark":"采购参考交期","type":"varchar"},{"length":"23","name":"caigoudanjia","remark":"预期单价","type":"numeric"},{"length":"500","name":"chanpinguige","remark":"产品规格","type":"varchar"},{"length":"500","name":"chanpinmingcheng","remark":"产品名称","type":"varchar"},{"length":"500","name":"chanpinpinpai","remark":"产品品牌/型号","type":"varchar"},{"length":"500","name":"chanpinyingwen","remark":"产品英文","type":"varchar"},{"length":"17","name":"chongliang","remark":"报价单位数量","type":"numeric"},{"length":"50","name":"chuhuoriqi","remark":"采购回复交期","type":"varchar"},{"length":"17","name":"cpchengbenhuilv","remark":"采购汇率","type":"numeric"},{"length":"50","name":"danwei","remark":"单位","type":"varchar"},{"length":"11","name":"def","remark":"Hide_def","type":"int"},{"length":"50","name":"dtlid","remark":"序号","type":"auto"},{"length":"50","name":"guid","remark":"Hide_guid","type":"varchar"},{"length":"500","name":"guige","remark":"质量等级规格","type":"varchar"},{"length":"500","name":"jiadebizhi","remark":"采购币种","type":"varchar"},{"length":"500","name":"jianshudanwei","remark":"件数单位","type":"varchar"},{"length":"17","name":"kechong","remark":"密度","type":"numeric"},{"length":"15","name":"maoli","remark":"毛利率","type":"numeric"},{"length":"1000","name":"miaoshu","remark":"产品描述","type":"varchar"},{"length":"500","name":"sapRejectReason","remark":"SAP拒绝原因","type":"varchar"},{"length":"50","name":"sapguid","remark":"SAP行号","type":"varchar"},{"length":"50","name":"sapguid2","remark":"未知3","type":"varchar"},{"length":"50","name":"shouceVerNo","remark":"手册版本号","type":"varchar"},{"length":"50","name":"shouce_status","remark":"Hide_shouce_status","type":"varchar"},{"length":"50","name":"shuchu","remark":"输出","type":"varchar"},{"length":"17","name":"shuliang","remark":"数量","type":"numeric"},{"length":"2000","name":"shuoming","remark":"其他要求","type":"varchar"},{"length":"500","name":"slhoucebianma","remark":"手册编码","type":"varchar"},{"length":"15","name":"tuishuie","remark":"退税额(￥)","type":"numeric"},{"length":"17","name":"tuishuihoudanjia","remark":"退税后单价","type":"numeric"},{"length":"17","name":"tuishuilv","remark":"退税率","type":"numeric"},{"length":"28","name":"xiaoshoudanjia","remark":"销售单价","type":"numeric"},{"length":"15","name":"xiaoshouzongjia","remark":"销售金额","type":"numeric"},{"length":"23","name":"xs_danjia","remark":"销售单价","type":"numeric"},{"length":"500","name":"yanse","remark":"颜色","type":"varchar"},{"length":"15","name":"yijibaozhuang","remark":"一级包装","type":"numeric"},{"length":"21","name":"yingkuie","remark":"盈亏额","type":"numeric"},{"length":"23","name":"yuqidanjia","remark":"预期单价","type":"numeric"},{"length":"17","name":"zhidaodanjia","remark":"货号指导成本","type":"numeric"},{"length":"500","name":"zhiliangdengji","remark":"质量等级","type":"varchar"},{"length":"17","name":"zhuangguijianshu","remark":"装柜件数","type":"numeric"},{"length":"17","name":"zhuanghuanlv","remark":"转换率","type":"numeric"}];
    }

     function getTypeConvertMap(){
        const typeMap = {};
        typeMap["varchar"] = 0;
        typeMap["text"] = 0;
        typeMap["decimal"] = 2;
        typeMap["numeric"] = 2;
        typeMap["numeric"] = 2;
        typeMap["int"] = 17;
        typeMap["date"] = 6;
        typeMap["datetime"] = 6;
        typeMap["smalldatetime"] = 6;
        typeMap["auto"] = 7;
        return typeMap;
    }

/*
0 短文本
1 长文本
2 数值（decimal）
3 数组
4 人员
5 部门
6 日期（datetime）
7 自动编号
8 图片
9 附件
10 地址
11 关联字段
12 引用字段
13 计算公式
14 JSON
15 加密文本
16 数值
17 整数
18 日期
*/

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();