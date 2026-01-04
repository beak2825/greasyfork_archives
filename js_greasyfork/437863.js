// ==UserScript==
// @name         BDO Batch Coupons
// @namespace    ruocaled
// @version      0.2
// @description  Apply BDO coupons in batch, use at your own risk
// @author       You
// @match        https://payment.naeu.playblackdesert.com/en-US/Shop/Coupon*
// @icon         https://www.google.com/s2/favicons?domain=playblackdesert.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437863/BDO%20Batch%20Coupons.user.js
// @updateURL https://update.greasyfork.org/scripts/437863/BDO%20Batch%20Coupons.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  let div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.left = '10px';
  div.style.bottom = '10px';
  div.style.zIndex = '9999';
  div.style.display = 'flex';
  div.style.flexDirection = 'column';
  div.style.alignItems = 'center';

  let textarea = document.createElement('textarea');
  textarea.style.height = '500px';
  textarea.style.width = '300px';
  textarea.placeholder = 'Copy paste your list of code here';
  textarea.style.fontSize = '14px';
  textarea.style.display = 'block';
  textarea.style.padding = '5px';
  textarea.id = 'coupons';

  let button = document.createElement('button');
  button.innerHTML = 'Apply All Coupons';
  button.style.display = 'block';
  button.style.marginTop = '15px';

  button.className = 'btn btn_mid btn_black mob_half';
  button.onclick = async function (){
    let region = document.getElementById('sendServer').value;
    if (!region) return alert('Please select a region');
    let codes = [];
    let lines = [];
    let success = 0;
    let fail = 0;
    if (textarea.value) {
      lines = textarea.value.split('\n');
      lines.map(l=>{
        let codeRegex = /\b([A-Z|0-9]{4}-?[A-Z|0-9]{4}-?[A-Z|0-9]{4}-?[A-Z|0-9]{4})\b/ig;
        let matches = l.match(codeRegex);
        if (matches) {

          codes = codes.concat(matches.map(m=>{
            if (m.length === 16) {
              return m.replace(/(.{4})(.{4})(.{4})(.{4})/, '$1-$2-$3-$4');
            }
            return `${m}`;
          }));
        }
      });
      console.log(codes);
      if (codes.length) {

        for (let i = 0; i < codes.length; i ++ ){
          let sleepTime = 1500 * Math.random() + 500;
          await sleep(sleepTime);
          button.innerHTML = `Processing Code ${i+1}/${codes.length}`;

          let code = codes[i].toUpperCase();
          let codeParts = code.split('-');
          let res = await fetch('https://payment.naeu.playblackdesert.com/Shop/Coupon/SetCouponProcess/', {
            'headers': {
              'accept': '*/*',
              'cache-control': 'no-cache',
              'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'pragma': 'no-cache',
              'sec-fetch-dest': 'empty',
              'sec-fetch-mode': 'cors',
              'sec-fetch-site': 'same-origin',
              'x-requested-with': 'XMLHttpRequest',
            },
            'referrer': 'https://payment.naeu.playblackdesert.com/en-US/Shop/Coupon/',
            'referrerPolicy': 'strict-origin-when-cross-origin',
            'body': `_couponCode1=${codeParts[0]}&_couponCode2=${codeParts[1]}&_couponCode3=${codeParts[2]}&_couponCode4=${codeParts[3]}&_linkingRegion=${region}`,
            'method': 'POST',
            'mode': 'cors'
          });
          if (res.json){
            let json = await res.json();
            if (json.errorCode) fail ++;
            else {
              success ++;
            }
          }
        }

      }

      if (success || fail) {
        if (confirm(`Successfully applied ${success} / ${success+fail} coupons, do you want to redirect to web storage?`)) {
          window.location = 'https://www.naeu.playblackdesert.com/en-US/MyPage/WebItemStorage';
        } else {
          // Do nothing!
          button.innerHTML = 'Apply All Coupons';

        }
      }
    }

  };


  div.appendChild(textarea);
  div.appendChild(button);
  document.body.appendChild(div);


})();