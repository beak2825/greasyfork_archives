// ==UserScript==
// @name         ozon 实用工具
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在 ozon 平台上 价格转换 和 快速定位自己上架产品，方便关键词运营调试!
// @author       Aceo
// @match        https://www.ozon.ru/category/blendery-10581/*
// @match        https://www.ozon.ru/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      By Aceo,Nansa
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445204/ozon%20%E5%AE%9E%E7%94%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/445204/ozon%20%E5%AE%9E%E7%94%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var num = 0;
    var sname = "OtMan";
    var items = new Array();
    var next = -1;
    var ye = 0;
    //
    function getPages(){
        var pages = document.getElementsByClassName('widget-search-result-container')[0].parentElement.parentElement.lastChild.firstChild.firstChild;
        if (pages.children.length != 3){
            pages = pages.firstChild.children;
        }else{
            pages = pages.children[1].children;
        }
        if (pages){
            for (var i = 0; i < pages.length; i++){
                if (pages[i].className.length > 5){
                    ye = pages[i].innerText;
                    console.log('当前页在第'+ye);
                    next = i;
                    break;
                }
            }
        }
    }

    //
    function creatdiv(){
        //
        var cdiv = document.getElementsByClassName('widget-search-result-container')[0].parentElement.parentElement.parentElement.children[1];
        //
        const div = document.createElement("div");
        div.setAttribute("id","wyl");
        div.setAttribute("class", "xu8");
        //
        const span = document.createElement("span");
        span.innerHTML="seller: ";
        div.appendChild(span);
        //
        const input = document.createElement("input");
        input.setAttribute("id","wyl_inp");
        input.setAttribute("name","wyl_inp");
        input.setAttribute("value",sname);
        div.appendChild(input);
        //
        const button = document.createElement("button");
        button.setAttribute("id","wyl_btn");
        button.setAttribute("name","wyl_btn");
        button.innerHTML="查找";
        button.onclick = function (){
            //console.log('查找方法执行...');
            sname = document.getElementById('wyl_inp').value;
            build();
            num = 0;
        }
        div.appendChild(button);
        //
        const button2 = document.createElement("button");
        button2.setAttribute("id","wyl_btn2");
        button2.setAttribute("name","wyl_btn2");
        getPages();
        //console.log(nnum);
        button2.innerHTML="当前第"+ye+"页,去下一页查找";
        button2.onclick = function (){
            //
            fanye();
        }
        div.appendChild(button2);
        //
        cdiv.firstChild.appendChild(div);
    }

    //
    function fanye(){
        //
        var pages = document.getElementsByClassName('widget-search-result-container')[0].parentElement.parentElement.lastChild.firstChild.firstChild;
        if (pages.children.length != 3){
            pages = pages.firstChild.children;
        }else{
            pages = pages.children[1].children;
        }
        //
        if (next >= 0){
            //去往下一页
            if (pages[next+1]){
                //有下一页
                pages[next+1].click();
            }else{
                alert('已经到最后一页!');
                console.log('已经到最后一页!');
            }

        }

    }

    // Your code here...
    function build() {
      //
      var far = document.getElementsByClassName('widget-search-result-container');
      if (far.length > 0){
          var fitems = far[0].children;
          //console.log(fitems);
          //
          //var fitems = document.getElementsByClassName('iu5');
          if (fitems.length > 0){
              //找到商品列表
              var bitem = fitems[0].children;
              console.log('获取到数据'+bitem.length+'条!');
              //console.log(bitem);
              for (var i = 0; i < bitem.length; i++){
                  //
                  var titem = bitem[i];
                  //console.log(titem);
                  //console.log(titem.getAttribute("class"));
                  if (titem.getAttribute("class") && titem.getAttribute("class") != ''){
                      //console.log('产品:'+titem.innerHTML);
                      //titem.children[0] 产品图片
                      //titem.children[1] 名称说明
                      //titem.children[2] 价格
                      //titem.children[3] 收藏关注
                      //var sellers = titem.children[2].lastChild.firstChild.lastChild.innerText;
                      var sellers = titem.children[1].lastChild.firstChild.lastChild.innerText
                      //console.log(titem);
                      //console.log(sname);
                      //console.log(sellers);
                      //
                      if (sellers.indexOf(sname) >= 0){
                          //商品名称
                          //var name = titem.children[1].firstChild.children[1].innerText;
                          //var name = titem.children[1].children[1].innerText;
                          var name = '';
                          if (titem.children[1].children[1].nodeName == 'SPAN' || titem.children[1].children[1].nodeName == 'span'){
                              name = titem.children[1].children[2].innerText;
                          }else{
                              name = titem.children[1].children[1].innerText;
                          }
                          console.log('产品['+(i+1)+'],名称：'+name);
                          //商品价格
                          //var price = titem.children[1].children[1].firstChild.innerText;
                          var price = titem.children[1].firstChild.firstChild.innerText
                          console.log('产品['+(i+1)+'],价格：'+price);
                          //商品售卖者
                          var seller = sellers.split(',');
                          if (seller.length > 1){
                              seller = seller[1].replace('продавец','');
                          }else{
                              seller = sellers.split(' ');
                              seller = seller[seller.length -1]
                          }
                          seller = seller.replace('продавец','');
                          console.log('产品['+(i+1)+'],售卖者：'+seller);
                          //
                          num = num + 1;
                      }
                      //是否是自己的商品
                      //if (seller.indexOf(sname) >= 0){
                          //console.log('产品['+(i+1)+'],是我的店铺商品：');
                      //}else{
                          //console.log('产品['+(i+1)+'],不是。。。');
                      //}
                      //console.log('-----------------------------------');

                  }

              }
              //
              alert('找到我售卖的产品:'+num+"个!");
              console.log('获取到我售卖的产品'+num+'个');
          }else{
              console.log('没有找到...(iu5)');
          }
      }

    }

    setTimeout(function () { creatdiv(); }, 3000);
    //setTimeout(function () { build(); }, 5000);

})();