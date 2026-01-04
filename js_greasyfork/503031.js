// ==UserScript==
// @name         组合装商品及库存按钮自定义
// @namespace    https://www.erp321.com
// @version      1.2.20241120
// @description  聚水潭ERP组合装商品及库存按钮自定义
// @author       You
// @match        https://*.erp321.com/app/item/CombineSku/*
// @icon         https://src.erp321.com/epaas-container/assets/favicon.ico
// @run-at       document-end
// @require      https://code.jquery.com/jquery-1.8.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503031/%E7%BB%84%E5%90%88%E8%A3%85%E5%95%86%E5%93%81%E5%8F%8A%E5%BA%93%E5%AD%98%E6%8C%89%E9%92%AE%E8%87%AA%E5%AE%9A%E4%B9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/503031/%E7%BB%84%E5%90%88%E8%A3%85%E5%95%86%E5%93%81%E5%8F%8A%E5%BA%93%E5%AD%98%E6%8C%89%E9%92%AE%E8%87%AA%E5%AE%9A%E4%B9%89.meta.js
// ==/UserScript==

window.onload = function(){
    //var containerEle=document.querySelector("#form1 > div.flexFull.plb > div:nth-child(2) > div:nth-child(2)"); //null
    //var containerEle=document.querySelector("#form1 > div.flexFull.plb > div:nth-child(3) > div:nth-child(2)"); //ok
    var containerEle=document.querySelector("#form1 > div.flexFull.plb>div.flexRowMain").previousElementSibling.lastElementChild;//ok
    if(containerEle!=null)
    {
        //添加元素
        var btnEles="<button id='btn_openkucuntongbu' class='btn_search_new' type='button' style='margin-left:2px;order:-1; outline:none;'>1.启用库存同步</button>"+
            "<button id='btn_tongbukucun' class='btn_search_new' type='button' style='margin-left:4px;order:-1; outline:none;'>2.同步库存</button>"+
            "<button id='btn_qiyongzidongshangjia' class='btn_search_new' type='button' style='margin-left:4px;order:-1; outline:none;'>3.启用自动上架</button>"+
            "<button id='btn_xiugaizuhezhuangshangpinxinxi' class='btn_search_new' type='button' style='margin-left:4px;order:-1; outline:none;'>4.修改组合装商品信息</button>";
        $(containerEle).append(btnEles);
        //绑定事件
        $(containerEle).on("click","#btn_openkucuntongbu",function(){
            commonBtnEvent("Stock",2);
        })
        $(containerEle).on("click","#btn_tongbukucun",function(){
            commonBtnEvent("Stock",4);
        })
        $(containerEle).on("click","#btn_qiyongzidongshangjia",function(){
            commonBtnEvent("Stock",6);
        })
        $(containerEle).on("click","#btn_xiugaizuhezhuangshangpinxinxi",function(){
            commonBtnEvent("Modifies",1);
        })
    }else{
        alert("请刷新页面重新操作！");
    }
}

function commonBtnEvent(eleType,seed)
{
    if(eleType=="Stock"){
        var stockEle=document.querySelector("#StockDisabled_Btn > div > div:nth-child("+seed+")");
        if(stockEle!=null)
        {
            stockEle.click();
        }else
        {
            alert("请刷新页面重新操作！");
        }
    }else{
        var modifiesEle=document.querySelector("#Modifies_Btn > div > div:nth-child("+seed+")");
        if(modifiesEle!=null)
        {
            modifiesEle.click();
        }else
        {
            alert("请刷新页面重新操作！");
        }

    }
    //20241029
    if(document.querySelector("#float_frame"))
    {
        $('#float_frame').css('top', '56px').css('height', '777px');
        document.querySelector("#float_frame").onload=function(){
            var divEle2opt=document.querySelector("#float_frame").contentDocument.querySelector("#form1 > div:last-child");
            if(divEle2opt)
            {
                $(divEle2opt).css('height', '696px');
            }
            var divEle3opt=document.querySelector("#float_frame").contentDocument.querySelector("#shopdiv");
            if(divEle3opt)
            {
                $(divEle3opt).css('height', '674px');
            }
        }
    }
}
