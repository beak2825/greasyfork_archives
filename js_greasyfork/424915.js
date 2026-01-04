// ==UserScript==
// @name         StockInfo
// @namespace    http://print.jiqinyun.com/
// @version      0.19
// @description  CGDD
// @author       Skyward
// @include      *://print.jiqinyun.com/html/erp/stockPurchaseTemplate.html?param1=74&param2=CGDD*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/424915/StockInfo.user.js
// @updateURL https://update.greasyfork.org/scripts/424915/StockInfo.meta.js
// ==/UserScript==

let counter=0;
let dataArr=new Array(
    {name: "svlis", data:     {
        "companyName": "\u6668\u6d69\u7fd4\u5de5\u4e1a\u0028\u798f\u5efa\u0029\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "350100100664828",
        "companyTax": "91350100MA2YQ9BLX6",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/pGbynhZS_97675_system_chax.png"
    }
  },
  {name: "zxwy", data:     {
        "companyName": "\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a\u673a\u68b0\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "350121100052765",
        "companyTax": "91350121052327451E",
      "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/DiRxd8hz_538060_system_zxwy.png"
    }
  },
  {name: "suel", data:     {
        "companyName": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "35050161663800001149",
        "companyTax": "91350121MA3443YK64",
      "seal":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/f7BAwnHp_105573_system_%E5%90%88%E5%90%8C%E7%AB%A0.png"
    }
  }
);

(function() {
    'use strict';
    let title_comp_name=document.querySelector("span.companyName");
    let table_comp_name=document.querySelector("td.companyName");
    let companyBankAddress=document.querySelector("td.companyBankAddress");
    let companyAccount=document.querySelector("td.companyAccount");
    let companyTax=document.querySelector("td.companyTax");
    let sealImage=document.querySelector("#sealImage");

    let content = document.querySelector("#content>div");

    let btn=document.createElement("botton");
    btn.setAttribute('class',"layui-btn layui-btn-normal");
    btn.setAttribute('id',"change");
    btn.textContent='公司信息变更';

    let gap=document.createElement('p');
    let btn_container=document.createElement('p');
    btn_container.appendChild(btn);
    content.appendChild(gap);
    content.appendChild(btn_container);

    btn.addEventListener("click",function(){
        title_comp_name.innerHTML=dataArr[counter].data.companyName;
        table_comp_name.innerHTML=dataArr[counter].data.companyName;
        companyBankAddress.innerHTML=dataArr[counter].data.companyBankAddress;
        companyAccount.innerHTML=dataArr[counter].data.companyAccount;
        companyTax.innerHTML=dataArr[counter].data.companyTax;
        sealImage.src=dataArr[counter].data.seal;
        counter++;
        counter=counter % dataArr.length;
     });
})();