// ==UserScript==
// @name         销售报价
// @namespace    http://print.jiqinyun.com/
// @version      0.11
// @description  Apply For SUEL ERP System
// @author       skyward
// @include      *://print.jiqinyun.com/html/erp/stockOrderPriceTemplate.html?param1=74&param2=XSBJ*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/543413/%E9%94%80%E5%94%AE%E6%8A%A5%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/543413/%E9%94%80%E5%94%AE%E6%8A%A5%E4%BB%B7.meta.js
// ==/UserScript==


let counter=0;
let dataArr=new Array(
    {name: "suel", info:{
        "brandImg":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/CXdpWCdk_67528_system_ERP%E5%B0%BA%E5%AF%B8.png",
        "companyName": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "35050161663800001149",
        "companyTax": "91350121MA3443YK64",
        "seal":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/f7BAwnHp_105573_system_%E5%90%88%E5%90%8C%E7%AB%A0.png",
        "brandName":"\u901f\u6613\u8054",
        "unitAddress2":"\u798f\u5efa\u7701\u798f\u5dde\u5e02\u95fd\u4faf\u53bf\u9752\u53e3\u9547\u9752\u56d7\u6295\u8d44\u533a\u767d\u6c34\u8def37\u53f7",
        "signingPlace":"\u798f\u5dde",
        "shortName":"\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14"
    }
  },
  {name: "wh-suel", info:{
        "brandImg":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/CXdpWCdk_67528_system_ERP%E5%B0%BA%E5%AF%B8.png",
        "companyName": "\u6b66\u6c49\u901f\u6613\u8054\u667a\u80fd\u88c5\u5907\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u6b66\u6c49\u73de\u72ee\u8def\u652f\u884c",
        "companyAccount": "42050112718900000862",
        "companyTax": "91420111MACPDGU74P",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2023_12_20/aQtYzyas_13354_system_%E5%90%88%E5%90%8C%E7%AB%A0%E7%BA%A2%E5%8D%B0%E9%80%8F%E6%98%8E.png",
        "brandName":"\u901f\u6613\u8054",
        "unitAddress2":"\u6e56\u5317\u7701\u6b66\u6c49\u5e02\u6d2a\u5c71\u533a\u73de\u5357\u8857\u6b66\u73de\u8def717\u53f7\u5146\u5bcc\u56fd\u9645\u5927\u53a61\u680b4\u5c425\u30017\u30018\u30019\u5ba4 (\u4eba\u8109\u4f17\u521b\u7a7a\u95f4583\u53f7)",
        "signingPlace":"\u6b66\u6c49",
        "shortName":"\u6b66\u6c49\u901f\u6613\u8054\u667a\u80fd\u88c5\u5907"
    }
  },
      {name: "zxwy", info:{
        "brandImg":"data:image/gif; base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs",
        "companyName": "\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a\u673a\u68b0\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u95fd\u4faf\u9752\u53e3\u652f\u884c",
        "companyAccount": "405263413868",
        "companyTax": "91350121052327451E",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/DiRxd8hz_538060_system_zxwy.png",
        "brandName":"\u632f\u5174\u709c\u4e1a",
         "unitAddress2":"\u6e56\u5317\u7701\u6b66\u6c49\u5e02\u6d2a\u5c71\u533a\u73de\u5357\u8857\u6b66\u73de\u8def717\u53f7\u5146\u5bcc\u56fd\u9645\u5927\u53a61\u680b4\u5c425\u30017\u30018\u30019\u5ba4 (\u4eba\u8109\u4f17\u521b\u7a7a\u95f4583\u53f7)",
         "signingPlace":"\u6b66\u6c49",
         "shortName":"\u632f\u5174\u709c\u4e1a",
    }
  },
  {name: "chaxa", info:{
        "brandImg":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_07_16/Ma6SThkD_10572_system_CHAXA_BK.png",
        "companyName": "\u6668\u6d69\u7fd4\u5de5\u4e1a\u0028\u798f\u5efa\u0029\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "35050189520000000414",
        "companyTax": "91350100MA2YQ9BLX6",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/pGbynhZS_97675_system_chax.png",
        "brandName":"\u6668\u6d69\u7fd4",
        "unitAddress2":"\u6e56\u5317\u7701\u6b66\u6c49\u5e02\u6d2a\u5c71\u533a\u73de\u5357\u8857\u6b66\u73de\u8def717\u53f7\u5146\u5bcc\u56fd\u9645\u5927\u53a61\u680b4\u5c425\u30017\u30018\u30019\u5ba4 (\u4eba\u8109\u4f17\u521b\u7a7a\u95f4583\u53f7)",
        "signingPlace":"\u6b66\u6c49",
        "shortName":"\u6668\u6d69\u7fd4\u5de5\u4e1a"
    }
  }
);

(function() {
    'use strict';
    let companyName=document.querySelector("span.companyName");
    // let companyAccount=document.querySelector("td#unitAccount");
    // let companyTax=document.querySelector("td#unitTax");
    // let unitAddress2=document.querySelector("#unitAddress2");
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
        const current_shortName=dataArr[counter % dataArr.length].info.shortName;
        counter++;
        counter=counter % dataArr.length;
        const infos=dataArr[counter];
        const dict=infos.info;
        logoImage.src=dict.brandImg;
        const brands=document.querySelectorAll("#listData td.proBrand");
        brands.forEach((item)=>{
            item.textContent=dict.brandName;
        });
        if(companyName !== null )companyName.innerHTML=dict.companyName;

        if(sealImage !=null){
            sealImage.setAttribute("src",dict.seal);
            if(sealImage.getAttribute("src")==""){
                sealImage.style.visibility="hidden";
            }
            else{
                sealImage.style.visibility="visible";
            }
        }
        const cxt=document.querySelectorAll("#print>div");
        cxt.forEach(item=>{
            item.innerHTML=item.innerHTML.replace(current_shortName,dict.shortName);
        });
     });
})();