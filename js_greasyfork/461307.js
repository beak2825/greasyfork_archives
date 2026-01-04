// ==UserScript==
// @name        亚马逊翻页
// @match       https://www.amazon.com/*
// @grant       none
// @version     1.3
// @author      -
// @description 解除翻页按钮限制 类目和产品链接可以直接跳转新的标签页
// @namespace https://greasyfork.org/users/1037559
// @downloadURL https://update.greasyfork.org/scripts/461307/%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/461307/%E4%BA%9A%E9%A9%AC%E9%80%8A%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==
// 翻页
  var dom = document.getElementsByClassName('a-disabled a-last');
if (dom.length) {
	var url = window.location.href.split('pg='),s;
	if (url.length == 1) {
		url = window.location.href.split('zg_bs');
		s = url[0] + 'zg_bs_pg_2?_encoding=UTF8&pg=2';
	} else {
		s = url[0] + 'pg=' + (Number(url[1]) + 1);
	}
	var a = document.createElement('a');
// Next page
// <span class="a-letter-space"></span>
// →
  a.href = s;
  dom[0].style.padding = '0px 0px 0px 0px';
  dom[0].innerHTML = "<a href='"+s+"'>Next page <span class='a-letter-space'></span><span class='a-letter-space'></span>→</a>";
}
// 销售方
var seller = document.getElementById("sellerProfileTriggerId");
if(seller){
  seller.target = '_blank'
}
// 产品列表
var list = document.getElementsByClassName('a-link-normal');
  if(list&&list.length){
     for(var i =0 ;i<list.length;i++){
    list[i].target = '_blank';
  }
  }
//类目节点
var nodes = document.querySelectorAll('div[role="treeitem"] a');
 if(nodes&&nodes.length){
   for(var i =0 ;i<nodes.length;i++){
    nodes[i].target = '_blank';
  }
 }
//评论跳转
var link = document.getElementById('acrCustomerReviewLink');
if(link){
   link.href = document.getElementsByClassName('a-link-emphasis a-text-bold')[0].href;
}

var sp = document.querySelectorAll('span[id="acrPopover"]');
if(sp&&sp.length){

        var spText = sp[0].children[0].outerHTML;
        sp[0].children[0].outerHTML = spText.replace(spText.match('<span(.*?)>.*')[1],'').replace('javascript:void(0)','#prodDetails');

    var spText1 = sp[1].children[0].outerHTML;
        sp[1].children[0].outerHTML = spText1.replace(spText1.match('<span(.*?)>.*')[1],'').replace('javascript:void(0)','#customer-reviews_feature_div');
}

var hs = document.querySelectorAll('h1[class="a-size-medium a-spacing-small secHeader"]');
if(hs&&hs.length){
for(var i =0 ;i<hs.length;i++){
    hs[i].outerHTML = hs[i].outerHTML.replace('h1','a').replace('<a','<a href="#ppd" style="text-decoration:none;"');
    
  }
}
