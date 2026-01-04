// ==UserScript==
// @name         Підбір розміру одягу для BlackOut
// @name:uk      Підбір розміру одягу для BlackOut
// @namespace    https://blackout-shop.com.ua
// @version      1.0
// @description  Інструмент для підбору розміру тактичного одягу та взуття за довжиною устілки або параметрами тіла
// @description:uk Інструмент для підбору розміру тактичного одягу та взуття за довжиною устілки або параметрами тіла
// @author       blackout-shop.com.ua
// @match        https://blackout-shop.com.ua/*
// @icon         https://blackout-shop.com.ua/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544406/%D0%9F%D1%96%D0%B4%D0%B1%D1%96%D1%80%20%D1%80%D0%BE%D0%B7%D0%BC%D1%96%D1%80%D1%83%20%D0%BE%D0%B4%D1%8F%D0%B3%D1%83%20%D0%B4%D0%BB%D1%8F%20BlackOut.user.js
// @updateURL https://update.greasyfork.org/scripts/544406/%D0%9F%D1%96%D0%B4%D0%B1%D1%96%D1%80%20%D1%80%D0%BE%D0%B7%D0%BC%D1%96%D1%80%D1%83%20%D0%BE%D0%B4%D1%8F%D0%B3%D1%83%20%D0%B4%D0%BB%D1%8F%20BlackOut.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const container = document.createElement('div');
  container.id = 'sizePickerContainer';
  container.style = 'text-align: center; margin: 10px 0;';

  container.innerHTML = `
    <button onclick="document.getElementById('sizeModal').style.display='block'" 
            style="background-color: #b22222; color: white; padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer;">
      Підібрати розмір
    </button>

    <div id="sizeModal" style="
          display:none; 
          position:fixed; 
          top:10%; 
          left:50%; 
          transform:translateX(-50%);
          width:90%; 
          max-width:320px;
          background:#fff; 
          color:#000; 
          padding:20px; 
          border:1px solid #ccc; 
          z-index:1000; 
          border-radius:8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);">
      <h3 style="margin-top:0;">Підбір розміру</h3>
      <label>
        Зріст (см): 
        <input id="heightInput" style="width:100%; padding:8px; margin:5px 0; border-radius:4px; border:1px solid #ccc;" type="number" />
      </label><br />
      <label>
        Вага (кг): 
        <input id="weightInput" style="width:100%; padding:8px; margin:5px 0; border-radius:4px; border:1px solid #ccc;" type="number" />
      </label><br />
      <button id="getSizeBtn" 
              style="margin-top:10px; background-color:#b22222; color:white; padding:10px 15px; border:none; border-radius:5px; cursor:pointer; width:100%;">
        Дізнатись розмір
      </button>
      <button id="closeSizeModalBtn" 
              style="margin-top:10px; background-color:#444; color:white; padding:10px 15px; border:none; border-radius:5px; cursor:pointer; width:100%;">
        Закрити
      </button>

      <p id="sizeResult" style="margin-top:15px; font-weight:bold;">&nbsp;</p>
    </div>
  `;

  // Вставляємо кнопку та модалку в кінець body або інше підходяще місце
  document.body.appendChild(container);

  // Додаємо функціонал через JS, замість onclick inline
  document.getElementById('getSizeBtn').addEventListener('click', getSize);
  document.getElementById('closeSizeModalBtn').addEventListener('click', () => {
    document.getElementById('sizeModal').style.display = 'none';
  });

  function roundToCustom(value) {
    if (isNaN(value)) return NaN;
    const remainder = value % 10;
    const base = value - (value % 5);
    if ([1, 2, 6, 7].includes(remainder)) {
      return base;
    } else if ([3, 4, 8, 9].includes(remainder)) {
      return base + 5;
    } else {
      return value;
    }
  }

  function getSize() {
    const height = parseInt(document.getElementById('heightInput').value);
    const weight = parseInt(document.getElementById('weightInput').value);
    
    if (isNaN(height) || isNaN(weight)) {
      document.getElementById('sizeResult').innerHTML = 'Будь ласка, введіть коректні числові значення.';
      return;
    }
    
    const roundedHeight = roundToCustom(height);
    const roundedWeight = roundToCustom(weight);

    const sizeTable = {
      '160': { '50': '2XS', '55': 'XS', '60': 'XS', '65': 'XS', '70': 'S', '75': 'S', '80': 'M', '85': 'XL', '90': '2XL' },
      '165': { '50': '2XS', '55': 'XS', '60': 'XS', '65': 'XS', '70': 'S', '75': 'M', '80': 'L', '85': 'XL', '90': '2XL' },
      '170': { '50': 'XS', '55': 'XS', '60': 'S', '65': 'S', '70': 'S', '75': 'M', '80': 'L', '85': 'L', '90': 'XL', '95': '2XL', '100': '2XL' },
      '175': { '50': 'XS', '55': 'XS', '60': 'S', '65': 'S', '70': 'M', '75': 'M', '80': 'L', '85': 'L', '90': 'XL', '95': 'XL', '100': '2XL', '105': '3XL', '110': '3XL', '115': '4XL', '120': '5XL' },
      '180': { '50': 'M', '55': 'M', '60': 'M', '65': 'M', '70': 'M', '75': 'M', '80': 'L', '85': 'L', '90': 'XL', '95': 'XL', '100': '2XL', '105': '3XL', '110': '3XL', '115': '4XL', '120': '5XL' },
      '185': { '50': 'M', '55': 'M', '60': 'M', '65': 'M', '70': 'M', '75': 'L', '80': 'L', '85': 'XL', '90': 'XL', '95': '2XL', '100': '2XL', '105': '3XL', '110': '3XL', '115': '4XL', '120': '5XL' },
      '190': { '50': 'M', '55': 'M', '60': 'L', '65': 'L', '70': 'L', '75': 'L', '80': 'XL', '85': 'XL', '90': 'XL', '95': '2XL', '100': '3XL', '105': '3XL', '110': '4XL', '115': '4XL', '120': '5XL' },
      '195': { '50': 'M', '55': 'M', '60': 'L', '65': 'L', '70': 'L', '75': 'XL', '80': 'XL', '85': '2XL', '90': '2XL', '95': '2XL', '100': '3XL', '105': '3XL', '110': '4XL', '115': '4XL', '120': '5XL' },
      '200': { '50': 'M', '55': 'M', '60': 'L', '65': 'L', '70': 'L', '75': 'XL', '80': 'XL', '85': '2XL', '90': '2XL', '95': '2XL', '100': '3XL', '105': '3XL', '110': '4XL', '115': '4XL', '120': '5XL' }
    };

    const size = sizeTable[roundedHeight]?.[roundedWeight];
    
    const result = size 
      ? `Ваш розмір: <strong>${size}</strong>` 
      : 'Розмір не знайдено для введених параметрів.';
    
    document.getElementById('sizeResult').innerHTML = result;
  }
})();
