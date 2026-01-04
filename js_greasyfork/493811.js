// ==UserScript==
// @name         药水gpt筛选器
// @namespace    http://tampermonkey.net/
// @version      1.1.7
// @description  在车辆列表页面上根据状态筛选车辆并排序
// @author       You
// @include      *chatgpt/CarList*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493811/%E8%8D%AF%E6%B0%B4gpt%E7%AD%9B%E9%80%89%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493811/%E8%8D%AF%E6%B0%B4gpt%E7%AD%9B%E9%80%89%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to count the number of .arco-progress-steps-item elements with specific background colors
    function getCount(card, color) {
        return Array.from(card.querySelectorAll('.arco-progress-steps-item')).filter(item => {
            const bgColor = window.getComputedStyle(item).backgroundColor;
            return bgColor === color;
        }).length;
    }

    // Function to sort and filter cards
    function filterAndSortCards(filter) {
        const cardContainer = document.querySelector('.n-config-provider > .n-grid:last-child');
        const cards = Array.from(document.querySelectorAll('.cardclss'));

        // Sort cards based on the count of specific background colors
        cards.sort((a, b) => {
            const countA1 = getCount(a, 'rgb(36, 212, 174)');
            const countA2 = getCount(a, 'rgb(249, 189, 95)');
            const countB1 = getCount(b, 'rgb(36, 212, 174)');
            const countB2 = getCount(b, 'rgb(249, 189, 95)');

            // Sort by countA1 and countA2 descending
            return (countB1 - countA1) || (countB2 - countA2);
        });

        // Filter and display cards based on the selected filter
        cards.forEach(card => {
            const status = card.querySelector('.message-with-dot').textContent.trim();
            const isIdle = status.includes('空闲');
            const isBusy = status.includes('拥挤');

            if ((filter === '仅空闲' && isIdle) ||
                (filter === '仅拥挤' && isBusy) ||
                (filter === '全部（空闲在前）')) {
                card.style.display = '';  // Show the card
                cardContainer.appendChild(card);  // Append in sorted order
            } else {
                card.style.display = 'none';  // Hide the card
            }
        });
    }

    // Save the original XMLHttpRequest.open and send methods
    var oldOpen = XMLHttpRequest.prototype.open;
    var oldSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this._url = url;
        console.log('Open called: method:', method, 'url:', url, 'async:', async);
        oldOpen.call(this, method, url, async, user, pass);
    };

    XMLHttpRequest.prototype.send = function(data) {
        console.log('Send called: url:', this._url, 'data:', data);

        if (this._url.includes("/carpage") && typeof data === "string") {
            try {
                var jsonData = JSON.parse(data);
                if ('size' in jsonData) {
                    jsonData.size = 999;
                    data = JSON.stringify(jsonData);
                }
            } catch (e) {
                console.error("Error modifying request data:", e);
            }
        }

        this.addEventListener('load', function() {
            if (this._url.includes("/carpage")) {
                setTimeout(() => {
                    const initialFilter = localStorage.getItem('selectedFilter') || '全部（空闲在前）';
                    filterAndSortCards(initialFilter);
                }, 2500);
            }
        }, false);

        oldSend.call(this, data);
    };

    document.addEventListener('DOMContentLoaded', (event) => {
        const filterContainer = document.createElement('div');
        filterContainer.style.position = 'fixed';
        filterContainer.style.top = '45vh';
        filterContainer.style.right = '100px';
        filterContainer.style.zIndex = '1000';
        filterContainer.style.background = 'white';
        filterContainer.style.border = '1px solid black';
        filterContainer.style.padding = '10px';
        filterContainer.style.color = '#000';

        filterContainer.id = 'myFilter';

        const options = ['全部（空闲在前）', '仅空闲', '仅拥挤'];

        filterContainer.insertAdjacentHTML('beforeend', `<h2 style="text-align:center">药水筛选器</h2><img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202004%2F04%2F20200404021800_Nk5Tu.thumb.400_0.gif&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1717037351&t=e04b27fb5130d1e61c0d18dd9ac1d342" style="width: 120px; height: 120px;">`);

        options.forEach(opt => {
            const label = document.createElement('label');
            Object.assign(label.style, {color:'#000', display:'flex', cursor: 'pointer', padding:'8px 0', 'justify-content': 'center'});
            const radioInput = document.createElement('input');
            radioInput.type = 'radio';
            radioInput.name = 'statusFilter';
            radioInput.value = opt;

            if (localStorage.getItem('selectedFilter') === opt || (!localStorage.getItem('selectedFilter') && opt === '全部（空闲在前）')) {
                radioInput.checked = true;
            }

            Object.assign(radioInput.style, {cursor: 'pointer'});

            label.appendChild(radioInput);
            label.appendChild(document.createTextNode(opt));
            filterContainer.appendChild(label);

            radioInput.addEventListener('click', function() {
                localStorage.setItem('selectedFilter', this.value);
                filterAndSortCards(this.value);
            });
        });

        document.body.appendChild(filterContainer);
    });
})();
