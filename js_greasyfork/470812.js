// ==UserScript==
// @name         销售订单-武汉
// @namespace    http://print.jiqinyun.com/
// @version      0.24
// @description  Apply For SUEL ERP System
// @author       Claris
// @include      *://print.jiqinyun.com/html/erp/stockOrderTemplate.html?param1=74&param2=XSDD*
// @include      *://print.jiqinyun.com/html/erp/stockOrderTemplateDetail.html?param1=74&param2=XSDD*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/470812/%E9%94%80%E5%94%AE%E8%AE%A2%E5%8D%95-%E6%AD%A6%E6%B1%89.user.js
// @updateURL https://update.greasyfork.org/scripts/470812/%E9%94%80%E5%94%AE%E8%AE%A2%E5%8D%95-%E6%AD%A6%E6%B1%89.meta.js
// ==/UserScript==


let counter=0;
let dataArr=new Array(
  {name: "wh-suel", info:{
        "brandImg":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/CXdpWCdk_67528_system_ERP%E5%B0%BA%E5%AF%B8.png",
        "companyName": "\u6b66\u6c49\u901f\u6613\u8054\u667a\u80fd\u88c5\u5907\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u6b66\u6c49\u73de\u72ee\u8def\u652f\u884c",
        "companyAccount": "42050112718900000862",
        "companyTax": "91420111MACPDGU74P",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2023_12_20/aQtYzyas_13354_system_%E5%90%88%E5%90%8C%E7%AB%A0%E7%BA%A2%E5%8D%B0%E9%80%8F%E6%98%8E.png",
        "brandName":"\u901f\u6613\u8054",
        "unitAddress2":"\u6e56\u5317\u7701\u6b66\u6c49\u5e02\u6d2a\u5c71\u533a\u73de\u5357\u8857\u6b66\u73de\u8def717\u53f7\u5146\u5bcc\u56fd\u9645\u5927\u53a61\u680b4\u5c425\u30017\u30018\u30019\u5ba4 (\u4eba\u8109\u4f17\u521b\u7a7a\u95f4583\u53f7)",
        "signingPlace":"\u6b66\u6c49"
    }
  },
  {name: "suel", info:{
        "brandImg":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/CXdpWCdk_67528_system_ERP%E5%B0%BA%E5%AF%B8.png",
        "companyName": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "35050161663800001149",
        "companyTax": "91350121MA3443YK64",
        "seal":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/f7BAwnHp_105573_system_%E5%90%88%E5%90%8C%E7%AB%A0.png",
        "brandName":"\u901f\u6613\u8054",
        "unitAddress2":"\u798f\u5efa\u7701\u798f\u5dde\u5e02\u95fd\u4faf\u53bf\u9752\u53e3\u9547\u9752\u56d7\u6295\u8d44\u533a\u767d\u6c34\u8def37\u53f7",
        "signingPlace":"\u798f\u5dde"
    }
  }
);

(function() {
    'use strict';
    let title_comp_name=document.querySelector("span#unitName");
    let signingPlace=document.querySelector("span#signingPlace");
    let table_comp_name=document.querySelector("td#unitName2");
    let companyBankAddress=document.querySelector("td#unitBank");
    let companyAccount=document.querySelector("td#unitAccount");
    let companyTax=document.querySelector("td#unitTax");
    let unitAddress2=document.querySelector("#unitAddress2");
    let sealImage=document.querySelector("img#sealImage");
    let logoImage=document.querySelector("#logoImage");
    let content = document.querySelector("#content>div");

    let btn=document.createElement("button");
    btn.setAttribute('class',"layui-btn layui-btn-normal layui-btn-radius");
    btn.setAttribute('id',"change");
    btn.innerText='　　';

    setTimeout(()=>{
    let gap=document.createElement('p');
    let btn_container=document.createElement('p');
    btn_container.appendChild(btn);
    content.appendChild(gap);
    content.appendChild(btn_container);
    },1000);

    btn.addEventListener("click",function(){
        let dict=dataArr[counter].info;
        signingPlace.innerHTML=dict.signingPlace;
        logoImage.src=dict.brandImg;
        let brands=document.querySelectorAll("#listData td.proBrand");
        brands.forEach((item)=>{
            item.textContent=dict.brandName;
        });
        if(title_comp_name !== null)title_comp_name.innerHTML=dict.companyName;
        if(table_comp_name !== null)table_comp_name.innerHTML=dict.companyName;
        if(companyBankAddress !== null )companyBankAddress.innerHTML=dict.companyBankAddress;
        if(unitAddress2 !== null )unitAddress2.innerHTML=dict.unitAddress2;
        if(companyAccount !== null)companyAccount.innerHTML=dict.companyAccount;
        if(companyTax !== null)companyTax.innerHTML=dict.companyTax;
        if(sealImage !=null){
            sealImage.setAttribute("src",dict.seal);
            if(sealImage.getAttribute("src")==""){
                sealImage.style.visibility="hidden";
            }
            else{
                sealImage.style.visibility="visible";
            }
        }
        counter++;
        counter=counter % dataArr.length;
        console.log(counter);
     });
})();