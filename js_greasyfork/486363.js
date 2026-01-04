// ==UserScript==
// @name         Alpha訂單快速查詢
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  六角國際公司內部網站Alpha使用的腳本
// @match        http://192.168.11.24/lkfi34.php
// @match        http://192.168.11.25/lkfi34.php
// @match        http://192.168.11.26/lkfi34.php
// @match        http://192.168.11.27/lkfi34.php
// @match        http://192.168.11.85/lkfi34.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486363/Alpha%E8%A8%82%E5%96%AE%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%A9%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/486363/Alpha%E8%A8%82%E5%96%AE%E5%BF%AB%E9%80%9F%E6%9F%A5%E8%A9%A2.meta.js
// ==/UserScript==

function addButton(text, query1, query2, check, requiresFriday = false) {
    const button = document.createElement('button');
    button.textContent = text;

    // 按鈕樣式設置
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.border = '1px solid #007bff';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#f0f8ff';
    button.style.color = '#007bff';
    button.style.fontSize = '14px';
    button.style.transition = 'all 0.3s ease';

    // 檢查今天是否為星期五
    const today = new Date();
    const isFriday = today.getDay() === 5;

    // 如果按鈕需要星期五才可按，且今天不是星期五，則禁用按鈕並加上提示
    if (requiresFriday && !isFriday) {
        button.disabled = true;
        button.style.opacity = '0.5'; // 增加透明度顯示禁用狀態
        button.title = '此按鈕僅在星期五可用'; // 顯示提示
    }

    // 滑鼠懸停效果
    button.addEventListener('mouseover', () => {
        if (!button.disabled) {
            button.style.backgroundColor = '#007bff';
            button.style.color = '#fff';
        }
    });

    button.addEventListener('mouseout', () => {
        if (!button.disabled) {
            button.style.backgroundColor = '#f8f9fa';
            button.style.color = '#007bff';
        }
    });

    button.addEventListener('click', () => {
        if (button.disabled) return; // 若按鈕被禁用則不執行後續操作
        var bbthqry = document.querySelector('#bbthqry img');
        bbthqry.click();

        setTimeout(() => {
            document.querySelector('input[name="pctrlquery1_state"]').value = '2';
            document.querySelector('textarea[name="Memoquery1"]').value = query1;
            document.querySelector('textarea[name="Memoquery2"]').value = query2;

            if (check) {
                var CheckBoxquery1 = document.querySelector('#CheckBoxquery1_table label');
                CheckBoxquery1.click();
            }
        }, 100);

        setTimeout(() => {
            document.querySelector('input[name="Buttonquerymsgok"]').click();
        }, 200);
    });

    return button;
}

const div = document.createElement('div');
div.style.position = 'fixed';
div.style.top = '10px';
div.style.left = '10px';
div.style.display = 'flex';
div.style.flexDirection = 'column'; // 改為垂直顯示
div.style.alignItems = 'flex-start';
div.style.padding = '10px';
div.style.backgroundColor = '#ffffff';
div.style.border = '1px solid #ddd';
div.style.borderRadius = '5px';
div.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
div.style.zIndex = '9999'; // 讓UI永遠在最上面

const orderD2Button = addButton('訂單D+2',
  '(RTRIM(COPTA.TA203) = \'' + getTodayPlus2() + '\') AND (RTRIM(COPTA.TA019) = \'N\')',
  '',
  false);

const chunShangD9Button = addButton('春上D+8',
  '(RTRIM(COPTA.TA203) >= \'' + getTodayPlus2() + '\') AND (RTRIM(COPTA.TA203) <= \'' + getTodayPlus8() + '\') AND (RTRIM(COPTA.TA019) = \'N\')',
  '(RTRIM(COPTB.TB202) = \'鮮食\')',
  true,
  true); // 指定此按鈕僅在星期五可用

// 設定按鈕之間的間距
orderD2Button.style.marginBottom = '10px';

div.appendChild(orderD2Button);
div.appendChild(chunShangD9Button);

document.body.appendChild(div);


function getTodayPlus2() {
  const today = new Date();
  today.setDate(today.getDate() + 2);
  return today.toISOString().slice(0, 10).replace(/-/g, '');
}

function getTodayPlus8() {
  const today = new Date();
  today.setDate(today.getDate() + 8);
  return today.toISOString().slice(0, 10).replace(/-/g, '');
}
