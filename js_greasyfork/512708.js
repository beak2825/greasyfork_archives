// ==UserScript==
// @name         purchase-withdraw-checker
// @namespace    pwc
// @version      0.0.1
// @description  check purchase and withdraw
// @author       misc
// @match        https://power.fluz.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM.xmlHttpRequest
// @connect      power.fluz.app
// @downloadURL https://update.greasyfork.org/scripts/512708/purchase-withdraw-checker.user.js
// @updateURL https://update.greasyfork.org/scripts/512708/purchase-withdraw-checker.meta.js
// ==/UserScript==

(async function(){async function f(t=250){let p=JSON.parse(localStorage.getItem("persist:auth"));const{accessToken:i}=p||{};if(i){const n=`Bearer ${i.replace(/['"]+/g,"")}`,l={},o={};let h=0,u=1,e=!0;for(;e;)try{const r=await GM.xmlHttpRequest({method:"GET",url:`https://power.fluz.app/api/v1/user/cash-balance?limit=${t}&page=${u}`,headers:{accept:"application/json",authorization:n,"cache-control":"no-cache","content-type":"application/json",referrer:"https://power.fluz.app/transactions/transfers",referrerPolicy:"strict-origin-when-cross-origin","user-agent":navigator.userAgent},responseType:"json"}),{count:d,rows:s}=JSON.parse(r.responseText);h+=s.length,g(l,o,s),h<d?u+=1:e=!1}catch(r){e=!1,console.log("getCashBalance Error"),console.error(r)}Object.values(o).forEach(r=>{console.log(r)}),console.log("end")}}function g(t={},p={},i){i.forEach(n=>{const{withdraw_id:l,amount:o,withdraw_source:h,withdraw_method:u}=n;if(l&&n.user_purchase?.purchase_id&&u!=="FLUZ_REFUND"){const{purchase_id:e,purchase_display_id:r,purchase_amount:d}=n.user_purchase,s={withdraw_id:l,amount:o,withdraw_source:h};t[e]?(t[e].withdraw_amount=Math.round((t[e].withdraw_amount+o)*1e3)/1e3,t[e].withdraw.push(s),d<t[e].withdraw_amount&&(p[e]=t[e])):t[e]={purchase_id:e,purchase_display_id:r,purchase_amount:d,withdraw_amount:o,withdraw:[s]}}})}const a=document.createElement("button");a.textContent="Check balance",a.type="button",a.style.marginLeft="auto";const c=document.querySelector(".fluz-header");c.style.gap="20px";let w=c.children;w.length>0?c.insertBefore(a,w[1]):c.appendChild(a),a.addEventListener("click",function(){a.disabled=!0,console.log("getCashBalance"),f()})})();
