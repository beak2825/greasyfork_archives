// ==UserScript==
// @name         报价单
// @namespace    http://print.jiqinyun.com/
// @version      0.11
// @description  Apply For SUEL ERP System
// @author       Skyward
// @include      http://print.jiqinyun.com/html/erp/stockOrderPriceTemplate.html*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/446441/%E6%8A%A5%E4%BB%B7%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/446441/%E6%8A%A5%E4%BB%B7%E5%8D%95.meta.js
// ==/UserScript==


if ( ! /.*stockOrderPriceTemplate.html\?param1=74&param2=XSBJ.*/.test(location.href) ){
    return;
}

let counter=0;
let dataArr=new Array(
      {name: "suel", data:{
        "brandImg":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/CXdpWCdk_67528_system_ERP%E5%B0%BA%E5%AF%B8.png",
        "companyName": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "35050161663800001149",
        "companyTax": "91350121MA3443YK64",
      "seal":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/f7BAwnHp_105573_system_%E5%90%88%E5%90%8C%E7%AB%A0.png",
      "brandName":"\u901f\u6613\u8054",
      "short":"\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14"
    }
  },
    {name: "chaxa", data:{
        "brandImg":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_07_16/Ma6SThkD_10572_system_CHAXA_BK.png",
        "companyName": "\u6668\u6D69\u7FD4\u5DE5\u4E1A\uFF08\u798F\u5EFA\uFF09\u6709\u9650\u516C\u53F8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "350100100664828",
        "companyTax": "91350100MA2YQ9BLX6",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/pGbynhZS_97675_system_chax.png",
        "brandName":"\u6668\u6d69\u7fd4",
        "short":"\u6668\u6D69\u7FD4\u5DE5\u4E1A\uFF08\u798F\u5EFA\uFF09"
    }
  },
  {name: "zxwy", data:{
        "brandImg":"data:image/gif; base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs",
        "companyName": "\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a\u673a\u68b0\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u95fd\u4faf\u9752\u53e3\u652f\u884c",
        "companyAccount": "405263413868",
        "companyTax": "91350121052327451E",
      "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/DiRxd8hz_538060_system_zxwy.png",
      "brandName":"\u632f\u5174\u709c\u4e1a",
      "short":"\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a"
    }
  }
);

(function() {
    'use strict';
    let title_comp_name=document.querySelector("span.companyName");
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
    btn.innerText='　　';

    setTimeout(()=>{
    let gap=document.createElement('p');
    let btn_container=document.createElement('p');
    btn_container.appendChild(btn);
    content.appendChild(gap);
    content.appendChild(btn_container);
    },1000);

    btn.addEventListener("click",function(){
         let current = dataArr[counter].data;
        console.log(current.companyName);

        counter++;
        counter=counter % dataArr.length;
        let dict=dataArr[counter].data;

        let desc=document.querySelectorAll('div.print>div');
        desc.forEach((item)=>{
            let l_info = item.innerText.indexOf(current.companyName);
            let s_info = item.innerText.indexOf(current.short);
            if (l_info == -1 && s_info == -1) return;
            item.innerText= item.innerText.replace(new RegExp(current.short,'g'), dict.short);
            item.innerText= item.innerText.replace(new RegExp(current.companyName,'g'), dict.companyName);
        });

        logoImage.src=dict.brandImg;
        let brands=document.querySelectorAll("#listData td.proBrand");
        brands.forEach((item)=>{
            item.textContent=dict.brandName;
        });
        if(title_comp_name !== null)title_comp_name.innerHTML=dict.companyName;
        if(companyBankAddress !== null)companyBankAddress.innerHTML=dict.companyBankAddress;
        if(companyAccount !== null)companyAccount.innerHTML=dict.companyAccount;
        if(companyTax !== null)companyTax.innerHTML=dict.companyTax;
        sealImage.setAttribute("src",dict.seal);
     });
})();