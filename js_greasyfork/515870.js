// ==UserScript==
// @name         Torn Market Quick Remove
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Faster removal of singular items from your item market listings
// @author       Weav3r
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/515870/Torn%20Market%20Quick%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/515870/Torn%20Market%20Quick%20Remove.meta.js
// ==/UserScript==

(() => {
   const ICONS = {
       zero: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
           <path d="M19 5L5 19M5 5l14 14" stroke="#dc3545" stroke-width="2.5" stroke-linecap="round"/>
       </svg>`,
       confirm: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
           <path d="M7 13l3 3 7-7" stroke="#28a745" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
       </svg>`
   };

   const simulateInput = input => {
       input.value = '0';
       input.dispatchEvent(new Event('input', { bubbles: true }));
       input.dispatchEvent(new Event('change', { bubbles: true }));
   };

   const triggerCheckboxUncheck = (checkbox) => {
       const label = document.querySelector(`label[for="${checkbox.id}"]`);
       if (label) {
           label.click();
       }
   };

   const createActionButtons = row => {
       if (row.querySelector('.zero-action-wrapper') || !window.location.hash.includes('viewListing')) return;

       const nameWrapper = row.querySelector('.title___Xo6Pm');
       if (!nameWrapper) return;

       const wrapper = document.createElement('span');
       wrapper.className = 'zero-action-wrapper';
       wrapper.style.cssText = 'display:inline-flex;margin-left:5px;vertical-align:middle;gap:4px';

       const zeroBtn = document.createElement('span');
       zeroBtn.style.cssText = 'cursor:pointer;display:inline-flex;vertical-align:middle';
       zeroBtn.innerHTML = ICONS.zero;
       wrapper.appendChild(zeroBtn);
       nameWrapper.appendChild(wrapper);

       let isZeroed = false;

       zeroBtn.addEventListener('click', e => {
           e.stopPropagation();
           e.preventDefault();

           if (!isZeroed) {
               const amountWrapper = row.querySelector('.amountInputWrapper___USwSs');
               const priceWrapper = row.querySelector('.priceInputWrapper___TBFHl');
               const selectCheckbox = row.querySelector('.checkboxWrapper___d7SBC.wide___fJlfS input[type="checkbox"]');
               const priceInputs = priceWrapper.querySelectorAll('input.input-money');

               const originalValues = {
                   price: [...priceInputs].map(input => input.value)
               };

               if (selectCheckbox) {
                   originalValues.checked = selectCheckbox.checked;
                   triggerCheckboxUncheck(selectCheckbox);
               } else if (amountWrapper) {
                   const qtyInputs = amountWrapper.querySelectorAll('input.input-money');
                   originalValues.qty = [...qtyInputs].map(input => input.value);
                   qtyInputs.forEach(simulateInput);
               }

               priceInputs.forEach(simulateInput);

               wrapper.innerHTML = '';

               const confirmBtn = document.createElement('span');
               confirmBtn.className = 'confirm-btn';
               confirmBtn.style.cssText = 'cursor:pointer';
               confirmBtn.innerHTML = ICONS.confirm;
               wrapper.appendChild(confirmBtn);

               const revert = () => {
                   clearTimeout(revertTimeout);
                   document.removeEventListener('click', outsideClickListener);
                   if (selectCheckbox && originalValues.checked) {
                       triggerCheckboxUncheck(selectCheckbox);
                   } else if (originalValues.qty) {
                       const qtyInputs = amountWrapper.querySelectorAll('input.input-money');
                       qtyInputs.forEach((input, i) => {
                           input.value = originalValues.qty[i];
                           input.dispatchEvent(new Event('input', { bubbles: true }));
                           input.dispatchEvent(new Event('change', { bubbles: true }));
                       });
                   }
                   priceInputs.forEach((input, i) => {
                       input.value = originalValues.price[i];
                       input.dispatchEvent(new Event('input', { bubbles: true }));
                       input.dispatchEvent(new Event('change', { bubbles: true }));
                   });
                   wrapper.innerHTML = '';
                   wrapper.appendChild(zeroBtn);
                   isZeroed = false;
               };

               const outsideClickListener = e => {
                   if (!confirmBtn.contains(e.target)) {
                       revert();
                   }
               };

               document.addEventListener('click', outsideClickListener);
               const revertTimeout = setTimeout(revert, 5000);

               confirmBtn.addEventListener('click', e => {
                   e.stopPropagation();
                   clearTimeout(revertTimeout);
                   document.removeEventListener('click', outsideClickListener);
                   const saveBtn = document.querySelector('.controls___N9naF .torn-btn');
                   if (saveBtn) {
                       saveBtn.click();
                       wrapper.innerHTML = '';
                       wrapper.appendChild(zeroBtn);
                       isZeroed = false;
                   }
               });

               isZeroed = true;
           }
       });
   };

   const observer = new MutationObserver(mutations => {
       mutations.forEach(mutation => {
           mutation.addedNodes.forEach(node => {
               if (node.classList?.contains('itemRowWrapper___cFs4O')) {
                   createActionButtons(node);
               } else if (node.querySelector) {
                   node.querySelectorAll('.itemRowWrapper___cFs4O').forEach(createActionButtons);
               }
           });
       });
   });

   const init = () => document.querySelectorAll('.itemRowWrapper___cFs4O').forEach(createActionButtons);

   if (document.body) {
       observer.observe(document.body, { childList: true, subtree: true });
       init();
   } else {
       document.addEventListener('DOMContentLoaded', () => {
           observer.observe(document.body, { childList: true, subtree: true });
           init();
       });
   }

   window.addEventListener('hashchange', init);
   window.addEventListener('load', init);
   for (let i = 0; i < 10; i++) setTimeout(init, i * 200);
})();
