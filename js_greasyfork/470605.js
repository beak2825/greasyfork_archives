// ==UserScript==
// @name         GC I Failed! Helper
// @namespace    grundos.cafe
// @version      1.1
// @description  Adds up losing stocks
// @author       Sphere
// @match        https://www.grundos.cafe/games/stockmarket/portfolio/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470605/GC%20I%20Failed%21%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/470605/GC%20I%20Failed%21%20Helper.meta.js
// ==/UserScript==

(() => {
  
  const rows = document.querySelectorAll('.portfolio-subtable tbody tr');
  const sellButton = document.querySelector('#show_sell');
  
  let maxLoss = 0;
  const negativeRows = [];
  
  rows.forEach(row => {
    const paid = parseInt(row.querySelector('td:nth-of-type(3)').textContent.replace(/,/g, ''), 10);
    const current = parseInt(row.querySelector('td:nth-last-of-type(3)').textContent.replace(/,/g, ''), 10);
    
    if (current < paid) {
      maxLoss += paid - current;
      negativeRows.push(row);
    }
  });
  
  const p = document.createElement('p');
  p.textContent = 'Possible loss: ';
  
  const strong = document.createElement('strong');
  strong.textContent = `${maxLoss.toLocaleString()} NP `;
  p.appendChild(strong);
  
  const button = document.createElement('input');
  button.classList.add('form-control');
  button.type = 'button';
  button.value = 'Select losing shares';
  button.addEventListener('click', event => {
    for (const row of negativeRows) {
      const shares = parseInt(row.querySelector('td').textContent.replace(/,/g, ''), 10);
      const input = row.querySelector('input');
      input.value = `${shares}`;
      
      row.parentNode.parentNode.parentNode.parentNode.style.removeProperty('display'); // lol
    }
    sellButton.style.removeProperty('display');
  });
  p.appendChild(button);
  
  const form = document.querySelector('main form');
  form.parentNode.insertBefore(p, form);
  
})();