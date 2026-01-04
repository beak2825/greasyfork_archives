// ==UserScript==
// @name        Price and actual seller of B-Parts components
// @name:it     Prezzo e effettivo venditore per i pezzi su B-Parts
// @namespace   StephenP
// @match       https://www.b-parts.com/*
// @grant       none
// @version     1.0
// @author      StephenP
// @license     AGPL-3.0-or-later
// @description Show the company selling the displayed part and the price split between part cost and shipping cost.
// @description:it Mostra la ditta che vende la parte mostrata e il prezzo diviso tra costo del componente e della spedizione.
// @downloadURL https://update.greasyfork.org/scripts/520531/Price%20and%20actual%20seller%20of%20B-Parts%20components.user.js
// @updateURL https://update.greasyfork.org/scripts/520531/Price%20and%20actual%20seller%20of%20B-Parts%20components.meta.js
// ==/UserScript==
var oldUrl;
var pr;
setInterval(checkUrl,1000)
reloadData();
function checkUrl(){
  if(oldUrl!=document.location.href){
    if(oldUrl){
      let oldInfo=document.getElementsByClassName("userScriptAdded");
      console.log(oldInfo);
      for(let i=oldInfo.length;i--;i>=0){
        oldInfo[i].remove();
      }
      pr.innerHTML+="\<div class='userScriptAdded'\>Reload the page to show the split price and origin.\</div\>";
    }
    oldUrl=document.location.href;
  }
}
function reloadData(){
  let itemJson=document.getElementById("__NEXT_DATA__");
  if(itemJson){
    const item=JSON.parse(itemJson.innerHTML);
    try{
      let itemPrice, fullPrice, seller, language, currency;
      for(let el of item.props.pageProps.dehydratedState.queries){
        if(el.state.hasOwnProperty("data")){
          if(Object.prototype.toString.call(el.state.data)=="[object Object]"){
            if(el.state.data.hasOwnProperty("supplier_name")){
              seller=el.state.data.supplier_name;
            }
            if(el.state.data.hasOwnProperty("pricing")){
              itemPrice=el.state.data.pricing.price_product;
              fullPrice=el.state.data.pricing.price_final;
              currency=el.state.data.pricing.currency;
            }
            if(el.state.data.hasOwnProperty("observations_original_lang")){
              language=el.state.data.observations_original_lang;
            }
            appendData(itemPrice, fullPrice, seller, language, currency);
          }
        }
      }
    }catch(e){console.log(e)};
  }
}
function appendData(itemPrice, fullPrice, seller, language, currency){
  try{
    const prod=document.getElementsByClassName("product_title__GHi5S");
    if(prod.length>0){
      pr=prod[0];
      if((itemPrice)&&(currency)&&(!document.getElementById("_us_itemPrice"))){
        pr.innerHTML+="\<div id='_us_itemPrice' class='userScriptAdded'\>Item price: "+itemPrice+" "+currency+"\</div\>";
      }
      if((fullPrice)&&(currency)&&(!document.getElementById("_us_splitPrice"))){
        pr.innerHTML+="\<div id='_us_splitPrice' class='userScriptAdded'\>Shipping price: "+(parseFloat(fullPrice)-parseFloat(itemPrice)).toFixed(2).toString()+" "+currency+"\</div\>";
      }
      if((seller)&&(!document.getElementById("_us_seller"))){
        pr.innerHTML+="\<div id='_us_seller' class='userScriptAdded'\>Actual seller: "+seller+"\</div\>";
      }
      if((language)&&(!document.getElementById("_us_language"))){
        pr.innerHTML+="\<div id='_us_language' class='userScriptAdded'\>Original insertion language: "+language+"\</div\>";
      }
    }
  }catch(e){console.log(e)}
}