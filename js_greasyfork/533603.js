// ==UserScript==
// @name         Nhập danh sách denylist nhanh cho nextdns
// @namespace    43vn
// @version      1.0
// @description  Nhập danh sách denylist nhanh cho nextdns. Miễn trừ trách nhiệm khi sử dụng userscript này
// @author       Bạn
// @match        https://my.nextdns.io/*/denylist
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533603/Nh%E1%BA%ADp%20danh%20s%C3%A1ch%20denylist%20nhanh%20cho%20nextdns.user.js
// @updateURL https://update.greasyfork.org/scripts/533603/Nh%E1%BA%ADp%20danh%20s%C3%A1ch%20denylist%20nhanh%20cho%20nextdns.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let injected = false;
    function insert(domain){
      const API = window.location.href.replace('my.nextdns.io','api.nextdns.io/profiles')
      return fetch(API, {
        "body": JSON.stringify({
          id: domain,
          active: true
        }),
        "headers":{
          "content-type": "application/json",
          "referrer": "https://my.nextdns.io/",
        },
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
    }
    async function doInject(domains, btn, result){
        btn.disabled = true;
         for(let i=0;i < domains.length;i++){
          const p = document.createElement('p');
          try{
            await insert(domains[i]);
            p.innerText = `Đã cập nhật ${domains[i]}`;
            p.style.color = 'green';
          }catch(e){
            console.error(e);
            p.innerText = `${domains[i]} - Lỗi: ${e}`;
            p.style.color = 'red';
          }
          result.appendChild(p);
        }
        btn.disabled = false;
    }
    async function inject(){
      if(injected) return;
      const input = document.querySelector('.form-control');
      if(input){
        const div = document.createElement('div');
        div.style.cssText = `margin: 10px;`;
        const inputList = document.createElement('textarea');
        inputList.style.cssText = `margin: 5px;`;
        inputList.className = 'form-control';
        inputList.placeholder = `Danh sách cần chặn. Phân biệt mỗi dòng 1 tên miền`;
        const result = document.createElement('div');
        result.style.cssText = `margin: 5px;`;
        const buttonFastAdd = document.createElement('button');
        buttonFastAdd.className = 'btn btn-primary';
        buttonFastAdd.style.cssText = `margin: 5px;`;
        buttonFastAdd.innerText = 'Nhập';
        buttonFastAdd.onclick = ()=>{
          const input = inputList.value;
          const hostname = input.split('\n').filter(d=>d);
          if(hostname.length > 0){
            doInject(hostname, buttonFastAdd, result);
          }
        }
        div.appendChild(inputList);
        div.appendChild(buttonFastAdd);
        div.appendChild(result);
        input.parentNode.parentNode.appendChild(div);
        injected = true;
      }else{
        injected = false;
      }
    }
    const observeDOM = () => {
        const observer = new MutationObserver(inject);
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        inject();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', observeDOM);
    } else {
        observeDOM();
    }
})();
