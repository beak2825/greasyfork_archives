// ==UserScript==
// @name         老登，爆了多少金币？
// @namespace    http://tampermonkey.net/
// @version      2023-12-24
// @description  统计你给完美世界爆了多少金币
// @author       1shin
// @license      MIT License
// @match        https://id.wanmei.com/billing/chargeDetailRecord*
// @match        https://i.laohu.com/billing/chargeDetailRecord*
// @sandbox      JavaScript
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGNzkzMUEiLz48cGF0aCBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0yMy4xODkgMTQuMDJjLjMxNC0yLjA5Ni0xLjI4My0zLjIyMy0zLjQ2NS0zLjk3NWwuNzA4LTIuODRsLTEuNzI4LS40M2wtLjY5IDIuNzY1Yy0uNDU0LS4xMTQtLjkyLS4yMi0xLjM4NS0uMzI2bC42OTUtMi43ODNMMTUuNTk2IDZsLS43MDggMi44MzljLS4zNzYtLjA4Ni0uNzQ2LS4xNy0xLjEwNC0uMjZsLjAwMi0uMDA5bC0yLjM4NC0uNTk1bC0uNDYgMS44NDZzMS4yODMuMjk0IDEuMjU2LjMxMmMuNy4xNzUuODI2LjYzOC44MDUgMS4wMDZsLS44MDYgMy4yMzVjLjA0OC4wMTIuMTEuMDMuMTguMDU3bC0uMTgzLS4wNDVsLTEuMTMgNC41MzJjLS4wODYuMjEyLS4zMDMuNTMxLS43OTMuNDFjLjAxOC4wMjUtMS4yNTYtLjMxMy0xLjI1Ni0uMzEzbC0uODU4IDEuOTc4bDIuMjUuNTYxYy40MTguMTA1LjgyOC4yMTUgMS4yMzEuMzE4bC0uNzE1IDIuODcybDEuNzI3LjQzbC43MDgtMi44NGMuNDcyLjEyNy45My4yNDUgMS4zNzguMzU3bC0uNzA2IDIuODI4bDEuNzI4LjQzbC43MTUtMi44NjZjMi45NDguNTU4IDUuMTY0LjMzMyA2LjA5Ny0yLjMzM2MuNzUyLTIuMTQ2LS4wMzctMy4zODUtMS41ODgtNC4xOTJjMS4xMy0uMjYgMS45OC0xLjAwMyAyLjIwNy0yLjUzOHptLTMuOTUgNS41MzhjLS41MzMgMi4xNDctNC4xNDguOTg2LTUuMzIuNjk1bC45NS0zLjgwNWMxLjE3Mi4yOTMgNC45MjkuODcyIDQuMzcgMy4xMXptLjUzNS01LjU2OWMtLjQ4NyAxLjk1My0zLjQ5NS45Ni00LjQ3LjcxN2wuODYtMy40NWMuOTc1LjI0MyA0LjExOC42OTYgMy42MSAyLjczM3oiLz48L2c+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/482757/%E8%80%81%E7%99%BB%EF%BC%8C%E7%88%86%E4%BA%86%E5%A4%9A%E5%B0%91%E9%87%91%E5%B8%81%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/482757/%E8%80%81%E7%99%BB%EF%BC%8C%E7%88%86%E4%BA%86%E5%A4%9A%E5%B0%91%E9%87%91%E5%B8%81%EF%BC%9F.meta.js
// ==/UserScript==

var chargeData = [];
var totalPrice = 0;

const __injectCss = () => {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .serPayBox.f12.cl button {
            display: flex;
            border: 2px solid #FF6960;
            line-height: inherit;
            color: #FF6960;
            background-color: #FFF;
            padding: 0 24px;
            border-radius: 8px;
        }
        .serPayBox.f12.cl button img {
            width: inherit;
            height: auto;
            margin: auto;
            padding-right: 6px;
        }
    `;;
    document.head.appendChild(styleElement);
};

const __chargeHistLastPage = parseInt(document.querySelector("#mainWrap > div > div.fr.w705 > div.t.f12.mt30 > div").lastChild.previousElementSibling.text);
const __coinImg = `<img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMzIgMzIiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNGNzkzMUEiLz48cGF0aCBmaWxsPSIjRkZGIiBmaWxsLXJ1bGU9Im5vbnplcm8iIGQ9Ik0yMy4xODkgMTQuMDJjLjMxNC0yLjA5Ni0xLjI4My0zLjIyMy0zLjQ2NS0zLjk3NWwuNzA4LTIuODRsLTEuNzI4LS40M2wtLjY5IDIuNzY1Yy0uNDU0LS4xMTQtLjkyLS4yMi0xLjM4NS0uMzI2bC42OTUtMi43ODNMMTUuNTk2IDZsLS43MDggMi44MzljLS4zNzYtLjA4Ni0uNzQ2LS4xNy0xLjEwNC0uMjZsLjAwMi0uMDA5bC0yLjM4NC0uNTk1bC0uNDYgMS44NDZzMS4yODMuMjk0IDEuMjU2LjMxMmMuNy4xNzUuODI2LjYzOC44MDUgMS4wMDZsLS44MDYgMy4yMzVjLjA0OC4wMTIuMTEuMDMuMTguMDU3bC0uMTgzLS4wNDVsLTEuMTMgNC41MzJjLS4wODYuMjEyLS4zMDMuNTMxLS43OTMuNDFjLjAxOC4wMjUtMS4yNTYtLjMxMy0xLjI1Ni0uMzEzbC0uODU4IDEuOTc4bDIuMjUuNTYxYy40MTguMTA1LjgyOC4yMTUgMS4yMzEuMzE4bC0uNzE1IDIuODcybDEuNzI3LjQzbC43MDgtMi44NGMuNDcyLjEyNy45My4yNDUgMS4zNzguMzU3bC0uNzA2IDIuODI4bDEuNzI4LjQzbC43MTUtMi44NjZjMi45NDguNTU4IDUuMTY0LjMzMyA2LjA5Ny0yLjMzM2MuNzUyLTIuMTQ2LS4wMzctMy4zODUtMS41ODgtNC4xOTJjMS4xMy0uMjYgMS45OC0xLjAwMyAyLjIwNy0yLjUzOHptLTMuOTUgNS41MzhjLS41MzMgMi4xNDctNC4xNDguOTg2LTUuMzIuNjk1bC45NS0zLjgwNWMxLjE3Mi4yOTMgNC45MjkuODcyIDQuMzcgMy4xMXptLjUzNS01LjU2OWMtLjQ4NyAxLjk1My0zLjQ5NS45Ni00LjQ3LjcxN2wuODYtMy40NWMuOTc1LjI0MyA0LjExOC42OTYgMy42MSAyLjczM3oiLz48L2c+PC9zdmc+">`;
const __calcBtnHtml = `<div><></div>`

const fetchChargeHist = () => {
    return new Promise((resolve, reject) => {
        const __chargeData = [];
        var fetchPromises = [];

        for (let i = 1; i <= __chargeHistLastPage; i++) {
            var fetchPromise = fetch(`https://${window.location.host}/billing/chargeDetailRecord/-1/-1/1/${i}`, { credentials: 'include' }).then(response => {
                if (!response.ok) {
                    throw new Error('请求数据出错:' + response.statusText);
                }
                return response.text();
            }).then(responseText => {
                var doc = new DOMParser().parseFromString(responseText, 'text/html');
                var paidHistTable = doc.querySelector("#mainWrap > div > div.fr.w705 > div.t.f12.mt30 > table > tbody").querySelectorAll("tr");
                var currentPrice = 0
                paidHistTable.forEach(function (row) {
                    __chargeData.push({ // 构造数据表
                        time: row.querySelector("td:nth-child(1)").textContent,
                        game: row.querySelector("td:nth-child(2)").textContent,
                        orderId: row.querySelector("td:nth-child(3)").textContent,
                        price: parseInt(row.querySelector("td:nth-child(4)").textContent.substring(1)),
                        chargeType: row.querySelector("td:nth-child(5)").textContent,
                    });
                    currentPrice += parseInt(row.querySelector("td:nth-child(4)").textContent.substring(1));
                });
                console.log(`第${i}页 爆了 ${currentPrice} 金币`);
            }).catch(error => {
                console.error('请求数据出错:', error);
                reject(error);
            });

            fetchPromises.push(fetchPromise);
        }

        // 使用 Promise.all 等待所有请求完成
        Promise.all(fetchPromises).then(() => {
            resolve(__chargeData); // 在所有异步操作完成时 resolve Promise
        }).catch(error => {
            console.error('请求数据出错:', error);
            reject(error); // 在发生错误时 reject Promise
        });
    });
};


(() => {
    'use strict';

    // 添加样式
    __injectCss();

    // 添加按钮
    var bar = document.querySelector("#mainWrap > div > div.fr.w705 > div.serPayBox.f12.cl");
    const calcBtn = document.createElement('button');
    calcBtn.textContent = '老登！爆了多少金币？';
    calcBtn.addEventListener('click', () => {
        if (chargeData.length == 0) {
            const loadingImg = document.createElement('img');
            loadingImg.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTEyLDFBMTEsMTEsMCwxLDAsMjMsMTIsMTEsMTEsMCwwLDAsMTIsMVptMCwxOWE4LDgsMCwxLDEsOC04QTgsOCwwLDAsMSwxMiwyMFoiIG9wYWNpdHk9Ii4yNSIvPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTEwLjcyLDE5LjlhOCw4LDAsMCwxLTYuNS05Ljc5QTcuNzcsNy43NywwLDAsMSwxMC40LDQuMTZhOCw4LDAsMCwxLDkuNDksNi41MkExLjU0LDEuNTQsMCwwLDAsMjEuMzgsMTJoLjEzYTEuMzcsMS4zNywwLDAsMCwxLjM4LTEuNTQsMTEsMTEsMCwxLDAtMTIuNywxMi4zOUExLjU0LDEuNTQsMCwwLDAsMTIsMjEuMzRoMEExLjQ3LDEuNDcsMCwwLDAsMTAuNzIsMTkuOVoiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgZHVyPSIwLjc1cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiIHR5cGU9InJvdGF0ZSIgdmFsdWVzPSIwIDEyIDEyOzM2MCAxMiAxMiIvPjwvcGF0aD48L3N2Zz4=";
            calcBtn.insertAdjacentElement('afterBegin', loadingImg);
            fetchChargeHist().then(d => {
                loadingImg.remove();
                chargeData = d;
                totalPrice = chargeData.reduce((acc, item) => acc + item.price, 0);
                alert(`你给完美爆了 ${totalPrice} 金币！`);
            });
        } else {
            alert(`你给完美爆了 ${totalPrice} 金币！`);
        }
    });

    bar.appendChild(calcBtn);
})();
