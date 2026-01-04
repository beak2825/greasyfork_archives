// ==UserScript==
// @name         采购订单-自定义模板
// @namespace    http://print.jiqinyun.com/
// @version      0.18
// @description  采购订单/未税/含税
// @author       Skyward
// @include      *://yun.jiqinyun.com/erp*
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/427976/%E9%87%87%E8%B4%AD%E8%AE%A2%E5%8D%95-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/427976/%E9%87%87%E8%B4%AD%E8%AE%A2%E5%8D%95-%E8%87%AA%E5%AE%9A%E4%B9%89%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

if ( ! /#\/printIndex\?dynamicPrintTemplateId=64.*/.test(location.hash) &&
    ! /#\/printIndex\?dynamicPrintTemplateId=44.*/.test(location.hash) ){
    return;
}

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
        "companyBankAddress": "\u4e2d\u56fd\u94f6\u884c\u80a1\u4efd\u6709\u9650\u516c\u53f8\u95fd\u4faf\u9752\u53e3\u652f\u884c",
        "companyAccount": "405263413868",
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
let icon_refresh='<i id="refresh" class="">&nbsp;</i>';
function content_edit(item,index){
    let head_cmp=document.querySelector('div.head>.head-list>.head-list-item:nth-child(2)');
    head_cmp.lastChild.data=dataArr[counter].data.companyName;
    let img=document.querySelector('div.drag-img>img');
    img.src=dataArr[counter].data.seal;
    switch(index){
        case 0:
        item.lastChild.data=dataArr[counter].data.companyName;
        break;
        case 1:
        item.lastChild.data=dataArr[counter].data.companyBankAddress;
        break;
        case 2:
        item.lastChild.data=dataArr[counter].data.companyAccount;
        break;
        case 3:
        item.lastChild.data=dataArr[counter].data.companyTax;
        break;
        default:
        return;
    }
}

(function() {
    'use strict';
    let btn=document.createElement("button");
    btn.setAttribute('class',"el-button el-button--primary el-button--small is-round");
    btn.setAttribute('type',"button");
    btn.setAttribute('style',"border:0;");
    btn.innerHTML=icon_refresh;

    setTimeout(()=>{
    let content = document.querySelector("div.fixedBtn");
    console.log(content);
    content.appendChild(btn);
    },1000);

    btn.addEventListener("click",function(){
        let foot_items=document.querySelector('div.foot>.head-list').querySelectorAll('div.head-list-item:nth-child(even)');
        let icon=document.querySelector("i#refresh");
        icon.setAttribute('class',"el-icon-loading");
        setTimeout(()=>{
            foot_items.forEach(content_edit);
            icon.setAttribute('class',"");
        },500);
        counter++;
        counter=counter % dataArr.length;
     });
})();