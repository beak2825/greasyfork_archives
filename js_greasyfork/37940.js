// ==UserScript==
// @name        【淘宝搜索页】添加天猫&京东选项
// @name:zh-CN  【淘宝搜索页】添加天猫&京东选项
// @namespace    http://css.thatwind.com/
// @version      1.3
// @description  在淘宝搜索首页 以及 宝贝和店铺搜索结果页 添加天猫搜索选项
// @author       遍智
// @match        *://s.taobao.com/*
// @match        *://shopsearch.taobao.com/search*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/37940/%E3%80%90%E6%B7%98%E5%AE%9D%E6%90%9C%E7%B4%A2%E9%A1%B5%E3%80%91%E6%B7%BB%E5%8A%A0%E5%A4%A9%E7%8C%AB%E4%BA%AC%E4%B8%9C%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/37940/%E3%80%90%E6%B7%98%E5%AE%9D%E6%90%9C%E7%B4%A2%E9%A1%B5%E3%80%91%E6%B7%BB%E5%8A%A0%E5%A4%A9%E7%8C%AB%E4%BA%AC%E4%B8%9C%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';



    document.addEventListener("DOMContentLoaded",go);

    go();

    function go(){


        if(location.href.indexOf("search")!=-1) {

            var x=".m-header .search .tab-hover{height:93px !important;}";
            var y=document.createElement('style');
            y.innerHTML=x;
            document.getElementsByTagName('head')[0].appendChild(y);
            insearchRe();
            return;
        } //判断为搜索结果页
        if(document.querySelector("#J_SearchTab")){
            if(document.querySelector("#TWli")) return;
            var newLi=document.createElement("li");
            newLi.id="TWli";
            newLi.setAttribute("data-searchtype","tmall");
            newLi.setAttribute("data-defaultpage" , "//list.tmall.com/search_product.htm");
            newLi.setAttribute("data-action" , "//list.tmall.com/search_product.htm");
            newLi.innerHTML='<a hidefocus="true" href="">天猫</a>';
            document.querySelector("#J_SearchTab").insertBefore(newLi,document.querySelector("[data-searchtype=shop]"));
            //--------------一下为京东搜索
            if(document.querySelector("#TWli2")) return;
            var newLi=document.createElement("li");
            newLi.id="TWli2";
            newLi.setAttribute("data-searchtype","jingdong");
            newLi.setAttribute("data-defaultpage" , "http://search.jd.com/Search");
            newLi.setAttribute("data-action" , "http://search.jd.com/Search");
            newLi.innerHTML='<a hidefocus="true" href="">京东</a>';
            document.querySelector("#J_SearchTab").appendChild(newLi);
            var keywordInput=document.createElement("input");//创建名为keyword的京东参数，值为q的值
            keywordInput.id="TWkeywordInput";
            keywordInput.name="keyword";
            keywordInput.style.display="none";
            document.querySelector("#J_SearchForm").appendChild(keywordInput);
            //创建京东的enc=utf-8编码参数
            var enc=document.createElement("input");//创建名为keyword的京东参数，值为q的值
            enc.name="enc";
            enc.value="utf-8";
            enc.style.display="none";
            document.querySelector("#J_SearchForm").appendChild(enc);
            //提交处理事件
            document.querySelector("#J_SearchForm").addEventListener("submit",function(){
              document.querySelector("#TWkeywordInput").value=document.querySelector("#q").value;
            });
            //----闲鱼搜索
            if(document.querySelector("#TWli3")) return;
            var newLi=document.createElement("li");
            newLi.id="TWli3";
            newLi.setAttribute("data-searchtype","xianyu");
            newLi.setAttribute("data-defaultpage" , "https://s.2.taobao.com/list/list.htm?_input_charset=utf8");
            newLi.setAttribute("data-action" , "https://s.2.taobao.com/list/list.htm?_input_charset=utf8");
            newLi.innerHTML='<a hidefocus="true" href="">闲鱼</a>';
            document.querySelector("#J_SearchTab").appendChild(newLi);
        }
        else{
            setTimeout(go,200);
        }
    }

    function insearchRe(){


        if(document.querySelector("#TWli")) return;//如果已经存在 返回

        if(!document.querySelector(".triggers")){ //如果尚未加载完毕 返回 时间200后重试
            setTimeout(insearchRe,200);
            return;
        }

        var newLi=document.createElement("li");
        newLi.id="TWli";
        newLi.className="J_Trigger trigger";
        newLi.setAttribute("data-action" , "//list.tmall.com/search_product.htm");
        newLi.setAttribute("data-searchtype","tmall");
        newLi.innerHTML="天猫";
        insertAfter(newLi,document.querySelector("[data-searchtype=item]"));
        document.querySelector("#TWli").onclick=function(){
            document.querySelector("#J_SearchForm").setAttribute("action","//list.tmall.com/search_product.htm");
        };
    }

    function insertAfter(newElement,targetElement){
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
        parent.appendChild(newElement);
    }
    else{
        parent.insertBefore(newElement,targetElement.nextSibling);
    }
}






})();