// ==UserScript==
// @name        CHH站内搜索
// @namespace   Violentmonkey Scripts
// @match       https://www.chiphell.com/*
// @grant       none
// @version     1.2
// @author      liansishen
// @description CHH更好的站内搜索
// @license           MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/439090/CHH%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/439090/CHH%E7%AB%99%E5%86%85%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
	'use strict';
  var strMemo,strValue,localSearch;
  //获取前一次选择的搜索方式
  localSearch = localStorage.getItem('txtSearch');
  
  //站内搜索部分
  var form =  document.querySelector('#scbar > div:nth-child(2) > form');
  
  //添加下拉框
  var objSel = document.createElement("select"); 
  objSel.id = "selSearch";
	objSel.options.add(new Option("谷歌","google"));
  objSel.options.add(new Option("百度","baidu"));
  objSel.options.add(new Option("必应","bing"));
  objSel.onchange = function() {
    strMemo = " " + objSel.value + "站内搜索";
    if (txtSearch.value == '' | txtSearch.value == " bing站内搜索" | txtSearch.value==" google站内搜索" |  txtSearch.value== " baidu站内搜索") {txtSearch.value=strMemo}
  }
  //form.prepend(objSel)
  
  //搜索输入框显示内容修改
  var txtSearch = document.getElementsByName('q')[0];
  form.insertBefore(objSel,txtSearch);
  strMemo = " " + localSearch + "站内搜索";
  switch (localSearch) {
    case 'google':
      objSel.options[0].selected = true;
      break;
    case 'baidu':
      objSel.options[1].selected = true;
      break;
    case 'bing':
      objSel.options[2].selected = true;
      break;
    default:
      objSel.options[0].selected = true;
      break;
  }
  txtSearch.onfocus = function() {
    if(txtSearch.value==strMemo) {
      txtSearch.value='';
    }
  }
  txtSearch.onblur = function() {
    if (txtSearch.value=='') {
      txtSearch.value=strMemo;
    }
  }
  txtSearch.value=strMemo;
  
  //替换原搜索按钮的事件
  var button = document.getElementsByName('sa')[0]
  button.onclick = function (){
    strValue = txtSearch.value;
    if (strValue == '' | strValue ==" google站内搜索" |  strValue == " baidu站内搜索"|txtSearch.value == " bing站内搜索") {return false;}
    localStorage.setItem('txtSearch',objSel.value)
    switch (objSel.value) {
        case 'google':
          window.open('https://www.google.com/search?hl=zh-CN&client=opera&q=site:' + encodeURIComponent(location.hostname) +' ' + encodeURIComponent(strValue),'','');
          break;
        case 'baidu':
          window.open('https://www.baidu.com/s?wd= site:' + encodeURIComponent(location.hostname) + ' ' + encodeURIComponent(strValue),'','');
          break;
        case 'bing':
          window.open('https://cn.bing.com/search?q=site:' + encodeURIComponent(location.hostname) + ' ' + encodeURIComponent(strValue),'','');
          break;
        default:
          window.open('https://www.google.com/search?hl=zh-CN&client=opera&q=site:' + encodeURIComponent(location.hostname) +' ' + encodeURIComponent(strValue),'','');
          break;
    }
		
    return false;
	};
 
  
})();