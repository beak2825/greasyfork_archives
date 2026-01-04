// ==UserScript==
// @name        获取变种
// @namespace   Violentmonkey Scripts
// @match       https://detail.1688.com/offer/*.html
// @grant       none
// @version     1.1
// @author      -
// @license     MIT
// @description 2023/8/18 16:13:42
// @downloadURL https://update.greasyfork.org/scripts/473493/%E8%8E%B7%E5%8F%96%E5%8F%98%E7%A7%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/473493/%E8%8E%B7%E5%8F%96%E5%8F%98%E7%A7%8D.meta.js
// ==/UserScript==
let isEmpty = false;
data = __INIT_DATA;
// console.debug(data);
skuMap = data.globalData.skuModel.skuInfoMap;
if (skuMap.length === 0){
  console.debug("===此产品没有变种===");
  isEmpty = true;
}
let imgPool = {};
if(data.globalData.skuModel.skuProps === undefined){
  console.debug("===此产品没有规格===\n可能是定制款且无变种的产品！");
}else{
  let _imgPool = data.globalData.skuModel.skuProps[0].value;
  for (img of _imgPool){
    imgPool[img['name']] = img['imageUrl'];
  }
}
for ([index,skuItem] of Object.entries(skuMap)){
  let imgUrl = imgPool[skuItem['specAttrs']];
  skuMap[index]['imgUrl'] = imgUrl;
  if(skuItem['price'] === undefined){
    for(dat of Object.values(data.data)){
      if(/.+-price/g.test(dat['componentType'])){
        skuMap[index]['price'] = dat.data.priceModel.currentPrices[0].price;
      }
    }
  }
}
if(isEmpty){
  let tmpItem={}
  tmpItem['specAttrs'] = "";
  for(dat of Object.values(data.data)){
    if(/.+-price/g.test(dat['componentType'])){
      tmpItem['price'] = dat.data.priceStart;
    }
  }
  skuMap.push(tmpItem);
}
let viewPanel = document.createElement("div");
viewPanel.id = "showMySkuItems";
viewPanel.style.zIndex="999";
viewPanel.style.position = "fixed";
viewPanel.style.background = "#f2f2f2";
viewPanel.style.bottom = "20px";
viewPanel.style.left = "90px";
viewPanel.style.width = "200px";
viewPanel.style.height = "500px";
viewPanel.innerText = JSON.stringify(Object.values(skuMap));
document.body.appendChild(viewPanel);