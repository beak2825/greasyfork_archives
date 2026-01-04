// ==UserScript==
// @name         4Gamers自動點擊已滿18歲按鈕，429網頁錯誤自動重整
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  自動點擊4Gamers已滿18歲按鈕，429網頁錯誤自動重整
// @author       Shanlan
// @match        https://www.4gamers.com.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542648/4Gamers%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%B7%B2%E6%BB%BF18%E6%AD%B2%E6%8C%89%E9%88%95%EF%BC%8C429%E7%B6%B2%E9%A0%81%E9%8C%AF%E8%AA%A4%E8%87%AA%E5%8B%95%E9%87%8D%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/542648/4Gamers%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%B7%B2%E6%BB%BF18%E6%AD%B2%E6%8C%89%E9%88%95%EF%BC%8C429%E7%B6%B2%E9%A0%81%E9%8C%AF%E8%AA%A4%E8%87%AA%E5%8B%95%E9%87%8D%E6%95%B4.meta.js
// ==/UserScript==

(function(){
if(window.top!==window.self) return;
const is429=()=>/429|Too Many Requests/i.test(document.title)||(document.querySelector('h1')&&/429|Too Many Requests/i.test(document.querySelector('h1').innerText))||/429|Too Many Requests/i.test(document.body.innerText);
const tryReload=()=>{ if(is429()) setTimeout(()=>location.reload(),400); };
tryReload();
new MutationObserver(tryReload).observe(document,{childList:true,subtree:true});
if(location.hostname.endsWith('4gamers.com.tw')){
  const clickBtn=()=>{ const b=Array.from(document.querySelectorAll('button')).find(x=>x.innerText.trim()==='是，我已滿十八歲，繼續瀏覽'); if(b){b.click();return true;} return false; };
  if(!clickBtn()){
    const o=new MutationObserver((m,obs)=>{ if(clickBtn()) obs.disconnect(); });
    o.observe(document,{childList:true,subtree:true});
  }
}
})();