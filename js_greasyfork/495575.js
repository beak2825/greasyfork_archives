// ==UserScript==
// @name         修改订单页面
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  修改客户的订单页面内容
// @author       You
// @match        https://www.smart777v.com/s*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smart777v.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495575/%E4%BF%AE%E6%94%B9%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/495575/%E4%BF%AE%E6%94%B9%E8%AE%A2%E5%8D%95%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(() => {
        let title = document.querySelector('img');
        let top_content = document.querySelector('div[class="top_content"]');
        if (title && !title.getAttribute('listen') && top_content) {
            title.setAttribute('listen', 'listened');
            title.style.cursor = 'pointer';
            title.addEventListener('click', () => {
                let name = prompt('请输入客户姓名');
                if (!name) {
                    alert('客户名不能为空，请确认');
                    return;
                }
                name = name.replace(/　/g, ' ').replace(/様/g, '');

                if (name && !document.querySelector('#namediv')) {
                    let nameDiv = document.createElement('div');
                    nameDiv.style.cursor = 'pointer';
                    nameDiv.id = 'namediv';
                    nameDiv.addEventListener('click', () => {
                        let gdList = document.querySelectorAll('table[class="gd"]')
                        if (gdList.length >= 1) {
                            for (const iterator of gdList) {
                                let firstTd = iterator.querySelector('td');
                                if (firstTd && !firstTd.querySelector('#rowdelete')) {
                                    let btn = document.createElement('button')
                                    btn.textContent = '删除行'
                                    btn.id = 'rowdelete';
                                    iterator.querySelector('td').append(btn);
                                    document.body.contentEditable = true;
                                    continue;
                                }
                                firstTd.removeChild(firstTd.querySelector('#rowdelete'));
                                document.body.contentEditable = false;
                            }
                        }
                    })
                    title.src = 'https://bossvan-online.oss-cn-hongkong.aliyuncs.com/otherPic/logo.png'
                    top_content.style.width = '1300px';
                    top_content.querySelector('div[class="userList"]').style.width = '1030px';
                    let l1e = top_content.querySelector('div[class="l1e"]');
                    l1e.style.width = '260px';
                    nameDiv.textContent = `${name} 様`
                    l1e.append(nameDiv);
                }
                if (name && document.querySelector('#namediv')) {
                    document.querySelector('#namediv').textContent = `${name} 様`;
                }
            })
        }
        let ordersDiv = document.querySelector('#orders');
        if (ordersDiv && !ordersDiv.getAttribute('listen')) {
            ordersDiv.setAttribute('listen', 'listened');
            ordersDiv.addEventListener('click', (event) => {
                let target = event.target;
                if (target.id == 'rowdelete') {
                    target.closest('div[class="order_t"]').removeChild(target.closest('table'));
                }
            })
        }
    }, 1000)
    // Your code here...
})();