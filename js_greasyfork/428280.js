// ==UserScript==
// @name        Amazon GET Requests Injector
// @description It injects custom GET requests into amazon
// @match       https://www.amazon.it/*
// @match       https://www.amazon.de/*
// @match       https://www.amazon.co.uk/*
// @match       https://www.amazon.fr/*
// @match       https://www.amazon.es/*
// @match       https://www.amazon.com/*
// @grant       none
// @version     1.0.1
// @author      SH3LL
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/428280/Amazon%20GET%20Requests%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/428280/Amazon%20GET%20Requests%20Injector.meta.js
// ==/UserScript==

function price_filter(){
  let min = parseInt(prompt("Price will be filtered starting from:", "0"));
  if(!Number.isInteger(min)){window.alert("Your input is not an integer! Request aborted."); return;}
  let max = parseInt(prompt("Price will be filtered from "+min+" to: ", "999999"));
  if(!Number.isInteger(max)){window.alert("Your input is not an integer! Request aborted."); return;}
  
  window.location.href=window.location.href+"&low-price="+min+"&high-price="+max;
  
  return;
}

function discount_filter(){
  let min = parseInt(prompt("Discount percentage will be filtered starting from: [0-99]", "0"));
  if(!Number.isInteger(min) || min <0 || min> 99){window.alert("Your input is not valid! Input must be between 0 and 99. Request aborted."); return;}
  let max = parseInt(prompt("Discount percentage will be filtered from "+min+"% to: ["+min+"-99]", "99"));
  if(!Number.isInteger(max) || max < min || max > 100){window.alert("Your input is not valid! Input must be between 0 and 100. The first number must be smaller than the second. Request aborted."); return;}
  
  window.location.href=window.location.href+"&pct-off="+min+"-"+max;
  
  return;
}

function main(){  
  let location;
  if(window.location.href.includes("&i=warehouse-deals")){
    location="warehouse";
  }
    
  let country = (window.location.href).split("www.amazon.")[1].split('/')[0];
  let amazon_url="https://www.amazon."+country;
  
  let navbar_hook = document.getElementById('navbar');

  
  let mybar = document.createElement("div");
  mybar.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
  
  if(window.location.href.includes("/s?")){
    
    let title = document.createElement("b");
    title.innerText="🔧 Get Requests Injector:"
    title.style.color="red";
    title.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    mybar.append(title);
    
    
    let oreder_desc_price = document.createElement("a");
    oreder_desc_price.innerText="📡 SORT [desc price]"
    oreder_desc_price.style.color="green";
    oreder_desc_price.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    oreder_desc_price.href = window.location.href + "&s=price-desc-rank"
    mybar.append(oreder_desc_price);
    
    let oreder_asc_price = document.createElement("a");
    oreder_asc_price.innerText="📡 SORT [asc price]"
    oreder_asc_price.style.color="green";
    oreder_asc_price.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    oreder_asc_price.href = window.location.href + "&s=price-asc-rank"
    mybar.append(oreder_asc_price);
    
    let sort_latest_arrivals = document.createElement("a");
    sort_latest_arrivals.innerText="📡 SORT [latest arrivals]"
    sort_latest_arrivals.style.color="green";
    sort_latest_arrivals.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    sort_latest_arrivals.href = window.location.href + "&s=date-desc-rank"
    mybar.append(sort_latest_arrivals);
    
    
    let filer_price_range = document.createElement("a");
    filer_price_range.innerText="📡 FILTER [price range]"
    filer_price_range.style.color="green";
    filer_price_range.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    filer_price_range.onclick = price_filter;
    mybar.append(filer_price_range);
    
    
    let filter_discount_range = document.createElement("a");
    filter_discount_range.innerText="📡 FILTER [% discount]"
    filter_discount_range.style.color="green";
    filter_discount_range.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    filter_discount_range.onclick = discount_filter;
    mybar.append(filter_discount_range);
    
  }else{
    
    let warning = document.createElement("b");
    warning.innerText="⛔ You must be in a search page in order to perform GET requests injection ⛔"
    warning.style.color="red";
    warning.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    mybar.append(warning);
    
    let link_global_search = document.createElement("a");
    link_global_search.innerText="🔗 GO to GlobalSearch"
    link_global_search.style.color="azure";
    link_global_search.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    link_global_search.href= amazon_url+"/s?k=.";
    mybar.append(link_global_search);
    
    let link_warehouse_search = document.createElement("a");
    link_warehouse_search.innerText="🔗 GO to WarehouseSearch"
    link_warehouse_search.style.color="azure";
    link_warehouse_search.style.padding = "5px 5px 5px 5px"; //top, right, bottom, left
    link_warehouse_search.href= amazon_url+"/s?k=.&i=warehouse-deals";
    mybar.append(link_warehouse_search);
    
  }
   
  navbar_hook.append(mybar);
}

main();
