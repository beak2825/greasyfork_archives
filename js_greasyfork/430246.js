// ==UserScript==
// @name         对帐单-打印
// @namespace    http://print.jiqinyun.com/
// @version      0.12
// @description  对帐单
// @author       Hjg
// @include      *://print.jiqinyun.com/html/erp/reconciliation.html*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/430246/%E5%AF%B9%E5%B8%90%E5%8D%95-%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/430246/%E5%AF%B9%E5%B8%90%E5%8D%95-%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

if ( ! /.*reconciliation.html\?param1=74&param2=KHDZD.*/.test(location.href) ){
    return;
}

let dataArr=new Array(
    {name: "chaxa", data:     {
        "companyName": "\u6668\u6d69\u7fd4\u5de5\u4e1a\u0028\u798f\u5efa\u0029\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "350100100664828",
        "companyTax": "91350100MA2YQ9BLX6",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/pGbynhZS_97675_system_chax.png",
        "sname":"\u6668\u6d69\u7fd4"
    }
  },
  {name: "zxwy", data:     {
        "companyName": "\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a\u673a\u68b0\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "350121100052765",
        "companyTax": "91350121052327451E",
      "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2021_04_13/DiRxd8hz_538060_system_zxwy.png",
      "sname":"\u632f\u5174\u709c\u4e1a"
    }
  },
  {name: "suel", data:     {
        "companyName": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u798f\u5dde\u4e1c\u5357\u6c7d\u8f66\u57ce\u652f\u884c",
        "companyAccount": "35050161663800001149",
        "companyTax": "91350121MA3443YK64",
      "seal":"https://trade-erp.oss-cn-beijing.aliyuncs.com/2020_11_02/f7BAwnHp_105573_system_%E5%90%88%E5%90%8C%E7%AB%A0.png",
      "sname":"\u901f\u6613\u8054"
    }
  },
  {name: "wh-suel", data:{
        "companyName": "\u6b66\u6c49\u901f\u6613\u8054\u667a\u80fd\u88c5\u5907\u6709\u9650\u516c\u53f8",
        "companyBankAddress": "\u4e2d\u56fd\u5efa\u8bbe\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u6b66\u6c49\u73de\u72ee\u8def\u652f\u884c",
        "companyAccount": "42050112718900000862",
        "companyTax": "91420111MACPDGU74P",
        "seal":"https://jiqin-online-mall.oss-cn-beijing.aliyuncs.com/2023_12_20/aQtYzyas_13354_system_%E5%90%88%E5%90%8C%E7%AB%A0%E7%BA%A2%E5%8D%B0%E9%80%8F%E6%98%8E.png",
        "sname":"\u6b66\u6c49\u901f\u6613\u8054"
    }
  }
);

let icon_refresh='　';

(function() {
    'use strict';
    let btn=document.createElement("button");
    btn.setAttribute('class',"layui-btn layui-btn-normal layui-btn-radius");
    btn.setAttribute('type',"button");
    btn.setAttribute('style',"border:0;");
    btn.setAttribute('id',"change");

    setTimeout(()=>{
    let print_btn = document.querySelector("button#save");
    let print_parent=print_btn.parentElement;
    print_parent.appendChild(btn);

        let counter=0;
        btn.addEventListener("click",function(){
            btn.innerHTML=icon_refresh;
            let content_title=document.querySelector("h2.companyName");
            let content_sealImage=document.querySelector("img#sealImage");
            content_title.textContent=dataArr[counter].data.companyName;
            content_sealImage.src=dataArr[counter].data.seal;
            btn.innerHTML="　";

            let items=document.querySelectorAll("#listData tr>td.brandAndName");
            items.forEach((item)=>{
                let content=item.textContent;
                let findIndex=content.indexOf("/");
                item.textContent=content.replace(content.substr(0,findIndex),dataArr[counter].data.sname);
            });
            counter++;
            counter=counter%dataArr.length;
    },500);
     });
})();