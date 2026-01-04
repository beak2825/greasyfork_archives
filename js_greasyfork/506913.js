// ==UserScript==
// @name         Telephone decryption
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @license      MIT
// @description  智趣百川线索电话解密
// @author       You
// @match        https://beschannels.ma.scrmtech.com/sub-leads/leads/list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cccitu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506913/Telephone%20decryption.user.js
// @updateURL https://update.greasyfork.org/scripts/506913/Telephone%20decryption.meta.js
// ==/UserScript==

(function() {
    var button = document.createElement('button');
    button.textContent = '运行脚本';
    button.style.position = 'fixed';
    button.style.top = '50px';
    button.style.right = '20px';

    button.onclick = function() {
        const username = 'en_center';
        const password = '303EBB8F5CB2CDBAAF83A865C6CBAD9F';
        const table = document.querySelectorAll('.el-table_1_column_2.is-left.el-table__cell');
        const elements = document.querySelectorAll('.el-table_1_column_3.is-left.el-table__cell');
        const tableElements = Array.prototype.slice.call(table, 22, 42);
        const slicedElements = Array.prototype.slice.call(elements, 1, 21);


        slicedElements.forEach(function(element, index) {
            const requestData = {
                encrypt_phone: element.innerText.split("\n")[0],
            };
            const authString = btoa(username + ':' + password);

            fetch('https://gate-dev-lane.xiaoduoai.com/open/en-center/phone/decrypt', {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + authString,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data?.data?.phone) {
                    if (element.innerText.split("\n").length > 1) {
                        const div = document.querySelectorAll('.phone');
                        const divElements = Array.prototype.slice.call(div, 0, 21);
                        divElements[index].innerText = data.data.phone;
                    } else {
                        const newDiv = document.createElement('div');
                        newDiv.className = 'phone';
                        newDiv.textContent = data.data.phone;
                        element.appendChild(newDiv);
                        tableElements[index].style.height = '71.7px';
                    }
                }
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
        })
    };
    document.body.appendChild(button);
})();