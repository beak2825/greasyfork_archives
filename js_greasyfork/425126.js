// ==UserScript==
// @name         销售订单
// @namespace    http://print.jiqinyun.com/
// @version      1.23
// @description  Apply For SUEL ERP System
// @author       Skyward
// @include        *://*.jiqinyun.com/erp*
// @include        *://print.jiqinyun.com/html/erp/stockOrderTemplate.html*
// @include        *://print.jiqinyun.com/html/erp/stockOrderTemplateDetail.html*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/425126/%E9%94%80%E5%94%AE%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/425126/%E9%94%80%E5%94%AE%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

//http://yun.jiqinyun.com/erp#/printIndex?dynamicPrintTemplateId=81&orderId=124466&moneyFixedNum=4&priceFixedNum=4&numFixedNum=2&companyId=74
//https://print.jiqinyun.com/html/erp/stockOrderTemplate.html?param1=74&param2=XSDD&param3=124444&param4=195&param5=4&param6=4

let counter=0;
let dataArr=new Array(
    {name: "svlis", data:{
        "brandImg":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_07_16/Ma6SThkD_10572_system_CHAXA_BK.png",
        "companyName": "\u6668\u6d69\u7fd4\u5de5\u4e1a\u0028\u798f\u5efa\u0029\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "35050189520000000414",
        "companyTax": "91350100MA2YQ9BLX6",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/pGbynhZS_97675_system_chax.png",
        "brandName":"\u6668\u6d69\u7fd4"
    }
  },
  {name: "zxwy", data:{
        "brandImg":"data:image/gif; base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs",
        "companyName": "\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a\u673a\u68b0\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u95fd\u4faf\u9752\u53e3\u652f\u884c",
        "companyAccount": "405263413868",
        "companyTax": "91350121052327451E",
      "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/DiRxd8hz_538060_system_zxwy.png",
      "brandName":"\u632f\u5174\u709c\u4e1a"
    }
  },
  {name: "suel", data:{
        "brandImg":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/CXdpWCdk_67528_system_ERP%E5%B0%BA%E5%AF%B8.png",
        "companyName": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "35050161663800001149",
        "companyTax": "91350121MA3443YK64",
      "seal":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/f7BAwnHp_105573_system_%E5%90%88%E5%90%8C%E7%AB%A0.png",
      "brandName":"\u901f\u6613\u8054"
    }
  }
);

(function() {
    'use strict';
    let title_comp_name=document.querySelector("span#unitName");
    let table_comp_name=document.querySelector("td#unitName2");
    let companyBankAddress=document.querySelector("td#unitBank");
    let companyAccount=document.querySelector("td#unitAccount");
    let companyTax=document.querySelector("td#unitTax");
    let sealImage=document.querySelector("img#sealImage");
    let logoImage=document.querySelector("#logoImage");
    let content = document.querySelector("#content>div");

    let btn=document.createElement("button");
    btn.setAttribute('class',"layui-btn layui-btn-normal layui-btn-radius");
    btn.setAttribute('id',"change");
    btn.innerText=' ';

    setTimeout(()=>{
    let gap=document.createElement('p');
    let btn_container=document.createElement('p');
    btn_container.appendChild(btn);
    if(!content) return ;
    content.appendChild(gap);
    content.appendChild(btn_container);
    },1000);

    btn.addEventListener("click",function(){
        let dict=dataArr[counter].data;
        logoImage.src=dict.brandImg;
        let brands=document.querySelectorAll("#listData td.proBrand");
        brands.forEach((item)=>{
            item.textContent=dict.brandName;
        });
        if(title_comp_name !== null)title_comp_name.innerHTML=dict.companyName;
        if(table_comp_name !== null)table_comp_name.innerHTML=dict.companyName;
        if(companyBankAddress !== null )companyBankAddress.innerHTML=dict.companyBankAddress;
        if(companyAccount !== null)companyAccount.innerHTML=dict.companyAccount;
        if(companyTax !== null)companyTax.innerHTML=dict.companyTax;
        sealImage.setAttribute("src",dict.seal);
        counter++;
        counter=counter % dataArr.length;
        console.log(counter);
     });
})();