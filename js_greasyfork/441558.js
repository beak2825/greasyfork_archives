// ==UserScript==
// @name         抓取电商数据
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  try to take over the world!
// @author       You
// @match        https://*.tmall.com/search.htm?*
// @match        https://*.taobao.com/search.htm?*
// @match        https://*.tmall.com/category*
// @match        https://*.jd.com/view_search-*
// @match        https://detail.tmall.com/item.htm?*
// @match        http://localhost:3000/shop
// @match        https://zouzh.top/*
// @match        https://www.zouzh.top/*
// @icon         https://zouzh.top/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441558/%E6%8A%93%E5%8F%96%E7%94%B5%E5%95%86%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/441558/%E6%8A%93%E5%8F%96%E7%94%B5%E5%95%86%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  window.tampermonkeyScriptVer = '0.1.4'
  let domain = document.location.hostname;
  if (domain !== 'localhost' && domain !== 'zouzh.top' && domain !== 'www.zouzh.top') {
    let result = {
      action: 'ready',
      height: 0
    };
    if (domain.indexOf('detail.tmall.com') === -1){
      window.addEventListener('message', function (e) {
        let data = JSON.parse(e.data);
        if (data && data.action) {
          switch (data.action) {
            case 'start':
              let page;
              let list_line;
              let timer = setInterval(function () {
                if (domain.indexOf('tmall.com') > -1) {
                  page = document.querySelector('.pagination .page-cur');
                  let page2 = document.querySelector('.ui-page-s')
                  list_line = document.querySelector('.J_TItems')
                  if ((page || page2) && list_line) {
                    clearInterval(timer);
                    window.scrollTo(0,document.documentElement.clientHeight);
                    result.action = 'page';
                    if (page) {
                      result.data = parseInt(page.innerHTML);
                    } else {
                      let page_t = page2.querySelector('.ui-page-s-len').innerHTML
                      result.data = parseInt(page_t.split('/')[0]);
                    }
                    top.postMessage(JSON.stringify(result), "*");
                    list_line = list_line.children;
                    let product = [];
                    for (let i = 0; i < list_line.length; i++) {
                      if (list_line[i].classList.contains('pagination')) break;
                      list_line[i].querySelectorAll('.item ').forEach(function (item) {
                        item.scrollIntoView();
                        let img = item.querySelector('.photo img').src;
                        let name = item.querySelector('.item-name').innerHTML;
                        let link = item.querySelector('.item-name').href;
                        let price = item.querySelector('.c-price').innerHTML;
                        let volume = '-';
                        product.push({
                          img: img,
                          name: name,
                          link: link,
                          price: price,
                          volume: volume
                        })
                      });
                    }
                    result = {
                      action: 'list',
                      data: product
                    };
                    top.postMessage(JSON.stringify(result), "*");
                    
                    if (page) {
                      let next = document.querySelector('.pagination .page-cur').nextElementSibling;
                      if (!next.classList.contains('disable')) {
                        setTimeout(function () {
                          next.click();
                        }, 2000);
                      } else {
                        result = {
                          action: 'end'
                        };
                        top.postMessage(JSON.stringify(result), "*");
                      }
                    } else {
                      let next = page2.querySelector('.ui-page-s-next')
                      if (next.nodeName === 'A') {
                        setTimeout(function(){
                          next.click();
                        }, 2000);
                      } else {
                        result = {
                          action: 'end'
                        };
                        top.postMessage(JSON.stringify(result), "*");
                      }
                    }
                  }
                } else if(domain.indexOf('jd.com') > -1) {
                  page = document.querySelector('.jPage .current');
                  list_line = document.querySelector(".j-module[module-param=\"{attentType:'product', isDialog:false}\"]")
                  if (page && list_line) {
                    clearInterval(timer);
                    window.scrollTo(0,document.documentElement.clientHeight);
                    result.action = 'page';
                    result.data = parseInt(page.innerHTML);
                    top.postMessage(JSON.stringify(result), "*");
                    list_line = document.querySelectorAll(".j-module[module-param=\"{attentType:'product', isDialog:false}\"] .jItem");

                    let index = 0;
                    let timer2 = setInterval(function () {
                      let item = list_line[index]
                      item.scrollIntoView();
                      let price = item.querySelector('.jdPrice .jdNum').innerHTML.trim();
                      if (price !== '') {
                        index++;
                        let product = [];
                        let img = item.querySelector('.jPic img').src;
                        let name = item.querySelector('.jDesc a').innerHTML;
                        let link = item.querySelector('.jDesc a').href;
                        let volume = item.querySelector('.jExtra em').innerHTML;
                        product.push({
                          img: img,
                          name: name,
                          link: link,
                          price: price,
                          volume: volume
                        });
                        result = {
                          action: 'list',
                          data: product
                        };
                        top.postMessage(JSON.stringify(result), "*");

                        if (index >= list_line.length) {
                          clearInterval(timer2);
                          let next = document.querySelector('.jPage .current').nextElementSibling;
                          if (next.nodeName === 'A') {
                            setTimeout(function(){
                              next.click();
                            }, 2000);
                          } else {
                            result = {
                              action: 'end'
                            };
                            top.postMessage(JSON.stringify(result), "*");
                          }
                        }
                      }
                    }, 500);
                  }
                }
              }, 1000);
              break;
          }
        }
      });

      result.height = window.document.body.scrollHeight;
      top.postMessage(JSON.stringify(result), "*");
    } else {
      let timer = setInterval(function () {
        let dialog = document.querySelector('.baxia-dialog.auto');
        let volume_item = document.querySelector('[class^="ItemHeader--salesDesc"]');
        let sold_out = document.querySelector("#J_DetailMeta .sold-out-info");
        if (sold_out || ((!dialog || dialog.style.display === 'none') && volume_item)) {
          clearInterval(timer);
          let result;
          if (sold_out || volume_item.innerHTML.trim() === '') {
            result = {
              action: 'volume',
              data: '-'
            };
          } else {
            result = {
              action: 'volume',
              data: volume_item.innerText.trim().split(' ')[1]
            };
          }
          top.postMessage(JSON.stringify(result), "*");
        }
      }, 1000);
    }
  }
})();