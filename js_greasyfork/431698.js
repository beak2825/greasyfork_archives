// ==UserScript==
// @name         kim
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  币安 价格 刷新放在网页右上角
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/431698/kim.user.js
// @updateURL https://update.greasyfork.org/scripts/431698/kim.meta.js
// ==/UserScript==

(function () {
      'use strict';

      var div=document.createElement('div');
      var ul=document.createElement('ul');
      ul.id='ul'
      div.style.position='fixed';
      div.style.zIndex=10000;
      div.style.top='5px';
      div.style.right='20px';
      div.style.background="#fff"
      div.appendChild(ul)
      document.body.appendChild(div);

      var initDataLength=0

      setInterval(() => {
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://fapi.binance.com/fapi/v1/ticker/price",
          onload: function (res) {
            if (res.status==200) {
              var text=res.responseText;
              var json=JSON.parse(text);

              var newData=json
                .filter(item => item.symbol.toLocaleLowerCase().indexOf('usdt')>-1)
                .filter(item =>
                  ['mbl', 'nkn', 'matic', 'btc'].some(_item =>
                    item.symbol.toLocaleLowerCase().startsWith(_item)
                  )
                )
                .map(item => `${item.symbol.replace('USDT', '')}_${item.price}`)


              if (initDataLength!==newData.length) {
                initDataLength=newData.length
                ul.innerHTML=''
                newData.forEach(item => {
                  var li=document.createElement('li');
                  li.id='li'
                  li.style.listStyle="demical"
                  li.innerText=item
                  ul.appendChild(li);
                })
              } else {
                document.querySelectorAll('#li').forEach((item, index) => {
                  item.innerText=newData[index]
                })
              }
            }
          }
        });
      }, 1000)

    })();