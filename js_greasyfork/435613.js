// ==UserScript==
// @name         采购-退货
// @namespace    http://print.jiqinyun.com/
// @version      0.14
// @description  采购退货公司切换
// @author       Hjg
// @include      *://print.jiqinyun.com/html/erp/purchaseReturn.html*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/435613/%E9%87%87%E8%B4%AD-%E9%80%80%E8%B4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/435613/%E9%87%87%E8%B4%AD-%E9%80%80%E8%B4%A7.meta.js
// ==/UserScript==

if ( ! /.*purchaseReturn.html\?param1=74&param2=CGTH.*/.test(location.href) ){
    return;
}

let dataArr=new Array(
    {name: "svlis", data:     {
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
  }
);
 
let icon_refresh='　';
 
(function() {
    'use strict';
    let btn=document.createElement("button");
    btn.setAttribute('class',"layui-btn layui-btn-normal");
    btn.setAttribute('type',"button");
    btn.setAttribute('style',"border:0;transition:0.2s");
    btn.setAttribute('id',"change");

    setTimeout(()=>{
    let print_btn = document.querySelector("button#save");
    let print_parent=print_btn.parentElement;
    print_parent.appendChild(btn);

        let counter=0;
        btn.addEventListener("click",function(){
            setTimeout(function(){
                btn.innerHTML=icon_refresh;
            let comp=document.querySelectorAll("span.companyName");
            comp.forEach(item=>{
                item.innerText=dataArr[counter].data.companyName;
            })
            btn.innerHTML="　";
            let listing=document.querySelectorAll("#listData tr>td:nth-child(2)");
            listing.forEach((item)=>{
                item.innerHTML=dataArr[counter].data.sname;
            });
            counter++;
            counter=counter%dataArr.length;
            },500);
    });
     });
    btn.addEventListener("mouseover",function(){
       btn.setAttribute('class','layui-btn layui-btn-normal layui-btn-radius');
    });
        btn.addEventListener("mouseleave",function(){
       btn.setAttribute('class','layui-btn layui-btn-normal');
    });
})();