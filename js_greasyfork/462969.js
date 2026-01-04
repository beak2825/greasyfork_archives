// ==UserScript==
// @name               Steam Game Selector for Uploading Videos
// @name:zh-TW         Steam 影片上傳遊戲篩選框
// @namespace          https://steamcommunity.com/id/ani20168/
// @version            1.1.1
// @description        When uploading a YouTube video on the Steam platform, you can quickly find the corresponding game by using the filtering option.
// @description:zh-tw  在Steam平台上傳youtube影片時，可以透過篩選框快速尋找對應的遊戲
// @author             ani20168
// @match              https://steamcommunity.com/id/*/videos/add*
// @match              https://steamcommunity.com/profiles/*/videos/add*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/462969/Steam%20Game%20Selector%20for%20Uploading%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/462969/Steam%20Game%20Selector%20for%20Uploading%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var select = document.querySelector('#app_assoc_select');

    // 創建一個新的 ul 元素
    var ul = document.createElement('ul');
    ul.classList.add('custom-list');
    ul.classList.add('form-control-list');
    ul.style.overflowY = 'auto';
    ul.style.maxHeight = '150px';
    ul.style.paddingInlineStart = '0px';
    select.parentNode.insertBefore(ul, select.nextSibling);

    var input = document.createElement('input');
    input.style.display = 'block';
    input.style.width = '420px';
    input.style.height = '25px';
    input.style.padding = '10px 12px';
    input.style.fontSize = '16px';
    input.style.lineHeight = '1.42857';
    input.style.color = '#cacaca';
    input.style.backgroundColor = '#1b1b1b';
    input.style.border = '2px solid #6F6F6F';
    input.style.borderRadius = '6px';
    input.style.boxShadow = 'rgba(0, 0, 0, 0.075) 0px 1px 1px inset';
    input.style.transition = 'border-color 0.15s ease-in-out 0s, box-shadow 0.15s ease-in-out 0s';
    input.style.marginBottom = '10px';
    input.placeholder = 'enter game name here...';
    input.addEventListener('input', filterOptions);
    select.parentNode.insertBefore(input, select);

    // inputbox的focus效果
    input.addEventListener('focus', function() {
        input.style.outline = 'none';
        input.style.borderColor = '#7FFFD4';
    });

    input.addEventListener('blur', function() {
        input.style.borderColor = '#6F6F6F';
    });

    function filterOptions() {
        var filter = input.value.trim().toLowerCase();
        var regex = new RegExp(filter, 'i');

        // 清空 ul 元素，以便重新填充匹配的選項
        ul.innerHTML = '';

        // 遍歷 select 的 options
        Array.prototype.forEach.call(select.options, function(option) {
            var text = option.text.trim().toLowerCase();
            var match = text.match(regex);

            if (match) {
                // 創建 li 元素並設置相應的內容
                var li = document.createElement('li');
                li.textContent = option.text;
                li.style.display = 'block';
                li.style.width = '93%';
                li.style.height = '25px';
                li.style.padding = '10px 12px';
                li.style.fontSize = '14px';
                li.style.lineHeight = '1.42857143';
                li.style.color = '#555';
                li.style.backgroundColor = '#fff';
                li.style.border = '1px solid #ccc';
                li.style.borderRadius = '6px';
                li.style.boxShadow = 'inset 0 1px 1px rgba(0,0,0,.075)';
                li.style.transition = 'border-color ease-in-out .15s, box-shadow ease-in-out .15s, background-color 0.5s ease';
                li.style.marginBottom = '1px';

                // 為 li 元素添加點擊事件監聽器，以在點擊時選擇對應的選項
                li.addEventListener('click', function() {
                    select.value = option.value;
                    input.value = option.text;
                    ul.innerHTML = ''; // 清空列表
                    input.focus(); // 重新聚焦在輸入框
                });

                // 為 li 元素添加 hover 效果
                li.addEventListener('mouseover', function() {
                    li.style.backgroundColor = '#7FFFD4';
                });

                li.addEventListener('mouseout', function() {
                    li.style.backgroundColor = '#fff';
                });

                // 將 li 元素添加到 ul 中
                ul.appendChild(li);
            }
        });

    }
})();