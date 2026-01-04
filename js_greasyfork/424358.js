// ==UserScript==
// @name         销售发货单
// @namespace    http://yun.jiqinyun.com/
// @version      1.18
// @description  销售发货单无价/带合同号
// @author       skyward
// @include       /^https://yun.jiqinyun.com/erp#*/
// @include       /^https://print.jiqinyun.com/
// @grant        GM_setValue
// @license      MIT2.0
// @downloadURL https://update.greasyfork.org/scripts/424358/%E9%94%80%E5%94%AE%E5%8F%91%E8%B4%A7%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/424358/%E9%94%80%E5%94%AE%E5%8F%91%E8%B4%A7%E5%8D%95.meta.js
// ==/UserScript==
// 有价http://print.jiqinyun.com/html/erp/stockOrderOutTemplate.html?param1=74&param2=XSCK&param3=37228&param4=197&param5=4&param6=4&param7=2&token=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxN2EzYWU3YWY1IiwiaWF0IjoxNjQxODcwMzk5LCJzdWIiOiJ7XCJ1c2VySWRcIjoyNzIsXCJjb21wYW55SWRcIjo3NCxcImlzTWFpblwiOjEsXCJyb2xlXCI6XCJwbGF0Zm9ybVwifSIsImV4cCI6MTY0MTkxMzU5OX0.3ZxWxA5hqMI5_7i09_LZWa8jMQHZj5wEgAPwdUo10io
// 无价http://print.jiqinyun.com/html/erp/stockOrderOutTemplateNoPrice.html?param1=74&param2=XSCK&param3=37228&param4=198&param5=4&param6=4&param7=2&token=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxN2EzYWU3YWY1IiwiaWF0IjoxNjQxODcwMzk5LCJzdWIiOiJ7XCJ1c2VySWRcIjoyNzIsXCJjb21wYW55SWRcIjo3NCxcImlzTWFpblwiOjEsXCJyb2xlXCI6XCJwbGF0Zm9ybVwifSIsImV4cCI6MTY0MTkxMzU5OX0.3ZxWxA5hqMI5_7i09_LZWa8jMQHZj5wEgAPwdUo10io
// 自定义http://yun.jiqinyun.com/erp#/printIndex?dynamicPrintTemplateId=42&orderId=37228&moneyFixedNum=4&priceFixedNum=4&numFixedNum=2&companyId=74

let counter=0;
let dataArr=new Array(
    {name: "chaxa", data:     {
        "companyName": "\u6668\u6d69\u7fd4\u5de5\u4e1a\u0028\u798f\u5efa\u0029\u6709\u9650\u516c\u53f8\u0028\u9500\u552e\u53d1\u8d27\u5355\u0029",
        "brand":"\u6668\u6d69\u7fd4"
    }
  },
  {name: "zxwy", data:     {
        "companyName": "\u798f\u5dde\u5e02\u95fd\u4faf\u632f\u5174\u709c\u4e1a\u673a\u68b0\u6709\u9650\u516c\u53f8\u0028\u9500\u552e\u53d1\u8d27\u5355\u0029",
      "brand":"\u632f\u5174\u709c\u4e1a"
    }
  },
  {name: "suel", data:     {
        "companyName": "\u798f\u5dde\u901f\u6613\u8054\u7535\u6c14\u6709\u9650\u516c\u53f8\u0028\u9500\u552e\u53d1\u8d27\u5355\u0029",
      "brand":"\u901f\u6613\u8054"
    }
  },
  {name: "suel-wh", data:     {
        "companyName": "\u6b66\u6c49\u901f\u6613\u8054\u667a\u80fd\u88c5\u5907\u6709\u9650\u516c\u53f8",
      "brand":"\u901f\u6613\u8054"
    }
}
);


if ( /#\/printIndex\?dynamicPrintTemplateId=42.*/.test(location.hash)){
(function() {
    'use strict';
    let btn=document.createElement("button");
    btn.setAttribute('class',"el-button el-button--primary el-button--small is-round");
    btn.setAttribute('type',"button");
    btn.setAttribute('style',"border:0;");
    let icon_refresh='<i id="refresh" class="">&nbsp;</i>';
    btn.innerHTML=icon_refresh;
    btn.addEventListener("click",
                         function(){
        let icon=document.querySelector("i#refresh");
        let head_content=document.querySelector("div.head>div");

        icon.setAttribute('class',"el-icon-loading");
        setTimeout(function(){
            head_content.textContent=dataArr[counter].data.companyName;
            counter++;
            counter=counter % dataArr.length;
            icon.setAttribute('class','');
        },500);
     });

    setTimeout(()=>{
    let content = document.querySelector("div.fixedBtn");
    content.appendChild(btn);
    },1000);
})();
}

//http://print.jiqinyun.com/html/erp/stockOrderOutTemplate.html?param1=74&param2=XSCK&param3=37228&param4=197&param5=4&param6=4&param7=2&token=eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxN2EzYWU3YWY1IiwiaWF0IjoxNjQxODcwMzk5LCJzdWIiOiJ7XCJ1c2VySWRcIjoyNzIsXCJjb21wYW55SWRcIjo3NCxcImlzTWFpblwiOjEsXCJyb2xlXCI6XCJwbGF0Zm9ybVwifSIsImV4cCI6MTY0MTkxMzU5OX0.3ZxWxA5hqMI5_7i09_LZWa8jMQHZj5wEgAPwdUo10io
if (/stockOrderOutTemplate.html\?param1=74.*/.test(location.hash) || /stockOrderOutTemplateNoPrice.html\?param1=74.*/){
    let btn=document.createElement("button");
    btn.setAttribute('class',"layui-btn layui-btn-normal");
    btn.setAttribute('type',"button");
    btn.setAttribute('style',"border:0;");
    let icon_refresh='<i id="refresh" class="">&nbsp;</i>';
    btn.innerHTML=icon_refresh;

    function modBrand(item,index){
      let name=item.querySelector("td.proBrand");
      name.textContent= dataArr[counter].data.brand;
    }

    btn.addEventListener("click",
                         function(){
        counter++;
        counter=counter % dataArr.length;
        let icon=document.querySelector("i#refresh");
        let head_content=document.querySelector("h2.companyName.headTitle");

        setTimeout(function(){
        head_content.textContent=dataArr[counter].data.companyName;

        let listData=document.querySelectorAll("#listData>tr");
        listData.forEach(modBrand);


        },500);
     });

    setTimeout(()=>{
    let ele_print_btn=document.querySelector("#save");
    ele_print_btn.parentElement.appendChild(btn);
    },1000);
}

//==================================================================================


