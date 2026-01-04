// ==UserScript==
// @name        店小秘-填充助手【必须确保zonoERP为登录状态】
// @namespace   Violentmonkey Scripts
// @match       https://www.dianxiaomi.com/smtProduct/edit.htm
// @match       https://www.dianxiaomi.com/smtProduct/add.htm
// @license     MIT
// @grant       none
// @version     0.01
// @author      Yang.Mr
// @icon        https://www.dianxiaomi.com/favicon.ico
// @grant       GM_xmlhttpRequest
// @description 2023/4/28 12:58:26
// @downloadURL https://update.greasyfork.org/scripts/465748/%E5%BA%97%E5%B0%8F%E7%A7%98-%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B%E3%80%90%E5%BF%85%E9%A1%BB%E7%A1%AE%E4%BF%9DzonoERP%E4%B8%BA%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/465748/%E5%BA%97%E5%B0%8F%E7%A7%98-%E5%A1%AB%E5%85%85%E5%8A%A9%E6%89%8B%E3%80%90%E5%BF%85%E9%A1%BB%E7%A1%AE%E4%BF%9DzonoERP%E4%B8%BA%E7%99%BB%E5%BD%95%E7%8A%B6%E6%80%81%E3%80%91.meta.js
// ==/UserScript==

function CountPrice(price){
  //=====================//
  //在这里抒写你的售价计算公式//
  //=====================//

  //这是预先写的速卖通运营部计算公式
  let C5 = price / 6.6;
  let D5 = C5 + 0.2;
  let E5 = D5 * 0.03;
  let _price = (D5+E5+0.02)*1.45;
  _price = _price * 6.8;


  //到此为止
  return _price.toFixed(2);
}


var _skuItems = [];

var PRICE = 0; //初始化价格变量
let UL = document.createElement('ul');
let _basediv = document.createElement('div');

// 选择要监视的 <table> 元素
let table = document.getElementById("skuVariantList");
table = table.children[0];

// 创建一个 MutationObserver 实例
const observer = new MutationObserver((mutations) => {
  // 在元素发生改变时执行的回调函数
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      getFixButton();
    }
  });
});

// 配置需要监视的变化类型和属性
const config = { childList: true, subtree: true, characterData: true };

// 开始监听 <table> 元素的变化
observer.observe(table, config);
// function getCookie () {
//   if (COOKIE === ""){
//     GM_xmlhttpRequest({
//       url:`http://192.168.2.150/getZoNoERPCookie/?username=${ERPusername}&password=${ERPpassword}`,
//       method:'get',
//       headers: {
//         "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
//         "Content-type": "application/x-www-form-urlencoded",
//       },
//       onloadend: function(response) {
//         // console.log(response.responseText);
//         COOKIE = response.responseText;
//       },
//     })
//   }
// }
//初始化列表
(function(){
  _basediv.style.width = "300px";
  _basediv.style.height = "450px";
  _basediv.style.position = "absolute";
  _basediv.style.background = "white"
  _basediv.style.border = "1px solid #dddddd";
  _basediv.style.zIndex = "999";
  _basediv.style.borderRadius = "5px";
  // _basediv.style.top = "5px";
  _basediv.id = "skuToolUI_base";
  _basediv.style.display = "none";
  let _listdiv = document.createElement("div");
  _listdiv.id = "skuToolUI_list";
  _listdiv.style.width = "100%";
  _listdiv.style.height = "440px";
  _listdiv.style.overflowY="auto";
  UL.style.lineHeight = "25px";
  _listdiv.appendChild(UL);
  _basediv.appendChild(_listdiv);
  document.body.appendChild(_basediv);
  // console.log(_basediv);
})();
function getPriceBySKU(node,sku){
  GM_xmlhttpRequest({
    url:`http://120.24.182.188/product/search?sku=${sku}`,
    method:"get",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      // "Cookie":COOKIE,
    },
    onload: function(response) {
      let price_i = node.querySelector('td[data-names = "price"]').children[0];
      let bodyhtml = response.responseXML;
      var _tmp = bodyhtml.querySelectorAll("tbody>tr");
      for (item of _tmp) {
        var info = item.children[3].children[0].children;
        price = parseFloat(info[7].innerText.substring(0,info[7].innerText.length-2));
        price_i.value = "";
        price_i.value = CountPrice(price);
      }
    }
  });
}
function insertData(node){
  console.log(node.getAttribute('index'));
  let sku = _skuItems[node.getAttribute('index')]['SKU'];
  let price = _skuItems[node.getAttribute('index')]['price'];
  console.log(`${sku} ${price}`);
  let sku_i = node.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('td[data-names="sku"]').children[0];
  let sku_p = node.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('td[data-names="price"]').children[0];
  sku_i.value = "";
  sku_i.value = sku;
  sku_p.value = "";
  sku_p.value = CountPrice(price);
}

function getFixButton(){
  observer.disconnect();
  let skulist = [].slice.call(document.getElementById("skuVariantList").children[0].children[0].children);
  let _td = document.createElement('td');
  for (let[index,sku] of skulist.entries()){
    if (sku.lastChild.id != 'sku_tool'){
      let _td = document.createElement('td');
      _td.className = "f-center";
      _td.id = 'sku_tool';
      if (index >= 2){
        let _button = document.createElement("button");
        _button.appendChild(document.createTextNode("仓库"));
        _button.setAttribute("type","button");
        _button.style.width = "70px";
        _button.addEventListener("click",function (event){
          event.stopPropagation()
          UpdateSKU_list();
          this.parentNode.appendChild(_basediv);
          _basediv.style.display = _basediv.style.display === 'none' ? 'block' : 'none';

          document.addEventListener("click",function(event) {
            if (!_basediv.contains(event.target)) {
              _basediv.style.display = "none";
            }
          });
        });
        let sku_i = sku.querySelector('td[data-names = "sku"]').children[0];
        sku_i.addEventListener("blur", function(){
          getPriceBySKU(sku,sku_i.value);
        });
        let _span = document.createElement("span");
        _span.className = "caret";
        _button.appendChild(_span);
        _td.appendChild(_button);
      }
      else if (index == 0){
        let _text = document.createElement('p');
        _text.appendChild(document.createTextNode("SkuHub"));
        _text.style.fontFamily = "Impact";
        _td.appendChild(_text);
      }

      sku.appendChild(_td);
    }
  }
  observer.observe(table, config);
}
function cutSting(s){
  var n = s.search("http");
  s = s.slice(0,n);
  // if
  return s;
}

// getCookie();
//更新SKU列表
function UpdateSKU_list(){
  var tmp_sku = [];
  GM_xmlhttpRequest({
    url:"http://120.24.182.188/product/search?show_all=TRUE",
    method:"get",
    headers: {
      "Content-type": "application/x-www-form-urlencoded",
      // "Cookie":COOKIE,
    },
    onloadstart: function(response) {
      UL.innerHTML = "";
      _skuItems = [];
    },
    onload: function(response) {    //当xhr的DOM加载完成后，将返回的结构分析进置入SKU_LIST全局变量
      var htmlBody = response.responseXML;
      var _tmpList = htmlBody.querySelectorAll("tbody>tr");
      for(let[index,item] of _tmpList.entries()){
        var _tmpItem = new Array();
        item = item.children;
        _tmpItem['SKU'] = item[1].children[0].innerHTML;
        var info = item[3].children[0].children;
        _tmpItem['title'] = info[1].innerHTML;
        _tmpItem['price'] = parseFloat(info[7].innerText.substring(0,info[7].innerText.length-2));
        _skuItems.push(_tmpItem);
        let _li = document.createElement('li');
        _li.style.display = "block";
        _li.style.background = "white";
        _li.style.whiteSpace = "nowrap";
        _li.style.color = "black";
        _li.setAttribute('index',index);
        _li.style.textAlign = "left";
        _li.style.paddingLeft = "8px";
        _li.style.cursor = "default";
        let _text = `[${_tmpItem['SKU']}] ${cutSting(_tmpItem['title'])}`;
        _li.style.fontFamily = "'微软雅黑', Courier, monospace";
        _li.appendChild(document.createTextNode(_text));
        _li.addEventListener('click',function() {
          insertData(this);
          _basediv.style.display = "none";
        });
        _li.addEventListener('mouseover',function() {
          this.style.background = "#056de8";
          this.style.color = "white";
        });
        _li.addEventListener('mousedown',function() {
          this.style.background = "#0461cf";

        });
        _li.addEventListener('mouseup',function() {
          this.style.background = "#056de8";
        });
        _li.addEventListener('mouseout',function() {
          this.style.background = "white";
          this.style.color = "black";
        });
        UL.appendChild(_li);
      }
    }
  });
}