// ==UserScript==
// @name         思否大纲
// @namespace    https://github.com/phpluo/userscript
// @version      1.1
// @license MIT
// @description  思否文章(大纲)目录列表 修改自原 https://greasyfork.org/zh-CN/scripts/407767
// @author       phpluo
// @match        https://segmentfault.com/a/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=segmentfault.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454472/%E6%80%9D%E5%90%A6%E5%A4%A7%E7%BA%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/454472/%E6%80%9D%E5%90%A6%E5%A4%A7%E7%BA%B2.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let label = 'zszen ';
  let isDebug = 1;
  let color_major = "#2B4D7C";
  let pool = [];
  let dic_title = {};

  var area = ELs('h1', el=>el.className.indexOf("article_title"),null)[0].parentNode;
  var titles = ELs('*',null,null,area)
  for(var i in titles){
    var tagName = titles[i].tagName;
    for(var k=1;k<=6;k++){
      if(tagName=='H'+k){
        pool.push([k,titles[i].textContent.replace(/(\n|  )/g,''), titles[i]])
      }
    }
  }
  var div = TagM('div',null,null, 'border-radius: 5px;line-height: 17px;z-index: 9999;width: 250px;border: 3px solid rgb(43, 77, 124);background-color: rgb(255, 255, 255);position: fixed; float: left;top: 350px;left: calc(50% - 815px);');
  div.id = 'zszen_jianshu';
  div.className = '简书列表';
  for(var j in pool){
    var t = TagM('h4',div,'<font id="title" style="font-weight:800;color:#00965d;font-size:14px;padding-left:10px;">'+pool[j][1]+'</font>','text-align:left;width:100%;line-height:13px;margin-bottom:2px;margin-top:2px;line-height:1;padding-left:2px;padding-top:0px;-webkit-margin-before:.3em;-webkit-margin-after:.3em;-webkit-margin-start: 0px;-webkit-margin-end: 0px;font-weight: bold;');
    t.idx = j;
    t.addEventListener('click', (evt)=>{
      var id = evt.target.idx ? evt.target.idx:evt.target.parentNode.idx;
      let target = pool[id][2];
      document.documentElement.scrollTop=target.offsetTop
      document.body.scrollTop=target.offsetTop
    });
  }


  //console.log(pool)

  //搜索
  function ELs(tagName, conditionFun, dealFun, parent){
    if(parent==null) parent = document;
    var tags = [...parent.getElementsByTagName(tagName)];
    if(conditionFun){
      tags = tags.filter(conditionFun);
    }
    if(dealFun){
      tags.forEach(dealFun);
    }
    return tags;
  }

  //DivMaker('<a class="aaa" href="123">asdfasdf <h1></a>', 'height:100px', 'a.aaa { color: green; }')
  function TagM(tag, parentNode, innerHtml, styleString, cssString){
    var divNode = document.createElement(tag);
    if(innerHtml!=null) divNode.innerHTML = innerHtml;
    if(parentNode==null){
      document.body.appendChild(divNode);
    }else{
      parentNode.appendChild(divNode);
    }
    if(styleString){
      divNode.style = styleString;
    }
    if(cssString){
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(cssString));
      divNode.appendChild(style);
    }
    return divNode;
  }
})();
