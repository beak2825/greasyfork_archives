
// ==UserScript==
// @name 生成采集文案
// @namespace Violentmonkey Scripts
// @match *://*/*
// @grant none
// @description 生成采集文案1111

  
//var qTxtDom = document.querySelector("body > div.transfer.clear-fix > div > div.spread-info.clear-fix > div > div.js_tao_links.fr > div.copy-box.q-area > div.copy-main > div.fl.copy-con > div");
//var qTxtDom = document.querySelector("body > div.box-layout.mtop-60 > div > div > div.spread-info.clear-fix > div > div.js_tao_links.fr > div.copy-box.q-area > div.copy-main > div.fl.copy-con > div");
var qTxtDom = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.spread-info.clear-fix > div > div.js_tao_links.fr > div.copy-box.q-area > div.copy-main > div.fl.copy-con > div");
qTxtDom.id = "qTxt001";   

var qBtn = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.spread-info.clear-fix > div > div.js_tao_links.fr > div.copy-box.wx-area > div.copy-btn");
var qBefore = document.querySelector("#q-before-btn");
var qCopy =  document.querySelector("#q-copy-btn");
qBefore.style.width = "136px";
qCopy.style.width = "136px";

var newNode = document.createElement("a"); 
newNode.innerHTML = "生成商品信息"; 
newNode.onclick = function(){getPudData(this);};
newNode.className = "com-btn q-copy-btn common-bd-xCtJ-count";
newNode.style.backgroundColor = "#ec89e9";
newNode.style.boxShadow = "0 0 20px rgba(79, 6, 124, 0.4)";
newNode.style.margin = "15px 4px 15px 0";
newNode.style.width = "136px";
//qBtn.appendChild(newNode);


var newCopy = qCopy.cloneNode(true); // 克隆复制按钮 
newCopy.id = "q-copy-btn1";
newCopy.style.backgroundColor = "#ec89e9";
newCopy.onclick = function(){
  var qTxtDom = document.getElementById('qTxt001');
  var qTxtDomHTMLTemp = qTxtDom.innerHTML;
  qTxtDom.innerHTML = document.getElementById('taoToken').innerHTML
  document.querySelector("#q-copy-btn").click();
  setTimeout("document.getElementById('qTxt001').innerHTML = '" + qTxtDomHTMLTemp + "'",200);
};
newCopy.style.boxShadow = "0 0 20px rgba(79, 6, 124, 0.4)";
newCopy.style.margin = "15px auto 15px";
newCopy.style.width = "136px";
qBtn.appendChild(newCopy);

var newNode = document.createElement("div"); 
//newNode.className = "hide"; 
newNode.id = "taoToken";
qBtn.appendChild(newNode);





var thisDom = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.spread-info.clear-fix > div > div.js_tao_links.fr > div.copy-box.wx-area > div.copy-btn");
var aAry = thisDom.querySelectorAll('a');
for (i = 0; i < aAry.length; i++) {
  aAry[i].style.margin = "15px auto 0px";
}
//alert(100);
var newNode = document.createElement("a"); 
newNode.innerHTML = "生成采集文案"; 
newNode.onclick = function(){getCollect(this);};
newNode.className = "com-btn wx-copy-btn common-bd-xCtJ-count";
newNode.style.backgroundColor = "#796ED4";
newNode.style.boxShadow = "0 0 20px rgba(79, 6, 124, 0.4)";
newNode.style.margin = "15px 4px 15px 0";
thisDom.appendChild(newNode);


var theCopy = document.querySelector("#wx-copy-btn");
var newCopy = theCopy.cloneNode(true); // 克隆复制按钮 
newCopy.id = "wx-copy-btn1";
newCopy.style.backgroundColor = "#796ED4";
newCopy.onclick = function(){document.querySelector("#wx-copy-btn").click();};
newCopy.style.boxShadow = "0 0 20px rgba(79, 6, 124, 0.4)";
newCopy.style.margin = "15px auto 15px";
thisDom.appendChild(newCopy);



var newNode = document.createElement("a"); 
newNode.innerHTML = "生成夜猫"; 
newNode.onclick = function(){getCollect(this);};
newNode.className = "com-btn wx-copy-btn common-bd-xCtJ-count";
newNode.style.backgroundColor = "#302F33";
newNode.style.boxShadow = "0 0 20px rgba(43, 42, 47, 0.4)";
newNode.style.margin = "15px auto 15px";
thisDom.appendChild(newNode);

var theCopy = document.querySelector("#wx-copy-btn");
var newCopy = theCopy.cloneNode(true); // 克隆复制按钮 
newCopy.id = "wx-copy-btn2";
newCopy.style.backgroundColor = "#302F33";
newCopy.onclick = function(){document.querySelector("#wx-copy-btn").click();};
newCopy.style.boxShadow = "0 0 20px rgba(43, 42, 47, 0.4)";
newCopy.style.margin = "15px auto 15px";
thisDom.appendChild(newCopy);


function getCollect(thisDom){ //生成采集文案
  
  //券链接   #qtk-coupon-hide > table > tbody > tr:nth-child(1) > td:nth-child(4) > a
  //var couponDom = document.querySelector("#qtk-coupon-hide > table > tbody > tr > td:nth-child(4) > a.active");
  //var couponLink = couponDom.parentNode.parentNode.firstChild.firstChild.href;
  var couponLink = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-area > div.plan > ul > li.coupon-box > div.have-quan-info > div > a").href;
  
  //商品链接
  var pudLink = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-info-img > a").href;
  //券后价
  var newPrice = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-area > div.goods-coupon > span.coupon > em.coupon-price.font-arial").innerHTML;
 
  //券面额
  var couponPrice = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-area > div.plan > ul > li.coupon-box > div.have-quan-info > div > a > b > i").innerHTML; 
  //原价
  var oldPrice = parseInt(newPrice) + parseInt(couponPrice);
  //标题
  var pudTxt = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-area > div.goods-tit > a > p").innerHTML;
  pudTxt = thisDom.innerHTML == "生成夜猫" ? "【夜猫子福利】先抢券~0点开始下单！！<br>"+pudTxt : pudTxt; 
  try { //推广文案
    var pudAd = "";
    var pudAd = document.querySelector("#spread-copy-opts > p.common-bd-xCtJ-count.active > span").innerHTML;
  }catch (e) {}
  var collectTxtDom = document.querySelector("#qtk-content-area > div.box-layout.mtop-60 > div > div > div.spread-info.clear-fix > div > div.js_tao_links.fr > div.copy-box.wx-area > div.copy-main > div:nth-child(2) > div.fl.copy-con-area");
  collectTxtDom.innerHTML = pudTxt + "<br>" + "原价"+ oldPrice +"元【券后"+ newPrice + "元】包邮" + "<br>" + "领券:" + couponLink + "<br>" + "抢购：" + pudLink + "<br>" + pudAd;

  thisDom.className = "com-btn wx-copy-btn common-bd-xCtJ-count hide";
  if(thisDom.innerHTML == "生成夜猫"){
      document.querySelector("#wx-copy-btn2").className = "com-btn wx-copy-btn common-bd-xCtJ-count copy_text_btn";
  }else{
      document.querySelector("#wx-copy-btn1").className = "com-btn wx-copy-btn common-bd-xCtJ-count copy_text_btn";
  }
  document.querySelector("#wx-before-btn").className = "com-btn wx-copy-btn common-bd-xCtJ-count";
  document.querySelector("#wx-copy-btn").className = "com-btn wx-copy-btn hide common-bd-xCtJ-count";
  
} 

function getPudData(thisDom){ //生成商品信息
  //宝贝图片
  var pic = document.querySelector("#qTxt001 > img").src;
  //获取淘口令
  var qTxtDom = document.getElementById('qTxt001');
  var qTxtDomHTMLTemp = qTxtDom.innerHTML;
  qTxtDom.innerHTML = "{淘口令}";
  var qBefore = document.querySelector("#q-before-btn");
  var qCopy =  document.querySelector("#q-copy-btn");
  qBefore.click();
  
  setTimeout(function getTaoToken(){
    document.getElementById('qTxt001').innerHTML;
    var qTxtDomHTML = qTxtDom.innerHTML;
    var qTxtDomHTML = qTxtDomHTML.split("<br>");
    qTxtDomHTML.shift();
    qTxtDomHTML = qTxtDomHTML.join('');
    var reg = /[A-Za-z0-9]{9,}/; //正则匹配
    var taoToken = qTxtDomHTML.match(reg);
    taoToken == "" ? getTaoToken() : '';
    //alert(qTxtDomHTML + taoToken);
    document.getElementById('taoToken').innerHTML = taoToken;
    qBefore.className = "com-btn q-copy-btn common-bd-xCtJ-count";
    qCopy.className = "com-btn q-copy-btn hide common-bd-xCtJ-count";
    thisDom.className = "com-btn q-copy-btn common-bd-xCtJ-count hide";
    thisDom.nextElementSibling.className = "com-btn q-copy-btn common-bd-xCtJ-count";
  },300);
  setTimeout("document.getElementById('qTxt001').innerHTML = '" + qTxtDomHTMLTemp + "'",400);
  
  //宝贝标题
  var tit = document.querySelector("body > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-area > div.goods-tit > a > p").innerHTML;
  //券后价
  var newPrice = document.querySelector("body > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-area > div.goods-coupon > span.coupon > em.coupon-price.font-arial").innerHTML;
  //券面额
  var couponPrice = document.querySelector("body > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-area > div.plan > ul > li.coupon-box > div.have-quan-info > div > a > b > i").innerHTML;
  //原价
  var oldPrice = parseInt(newPrice) + parseInt(couponPrice);
  //商品链接
  var pudLink = document.querySelector("body > div.box-layout.mtop-60 > div > div > div.goods-info > div.goods-area > div.goods-tit > a").href;
  
  setTimeout("document.getElementById('taoToken').innerHTML = '" + pic +  "@|@" + tit + "@|@" + "' + document.getElementById('taoToken').innerHTML + '" + "@|@" + oldPrice + "@|@" + newPrice + "@|@" + pudLink + "'",700);
}

































// @version 0.0.1.201804070999999
// @downloadURL https://update.greasyfork.org/scripts/36055/%E7%94%9F%E6%88%90%E9%87%87%E9%9B%86%E6%96%87%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/36055/%E7%94%9F%E6%88%90%E9%87%87%E9%9B%86%E6%96%87%E6%A1%88.meta.js
// ==/UserScript==