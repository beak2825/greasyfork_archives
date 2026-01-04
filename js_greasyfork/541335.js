// ==UserScript==
// @name         ArsonWarehouse
// @namespace    https://arsonwarehouse.com
// @version      1.0.1
// @description  Auto-calculates trade value (replaces deprecated chrome extension)
// @author       Sulsay
// @match        https://www.torn.com/trade.php
// @icon         https://arsonwarehouse.com/images/favicon.ico
// @license      MIT
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/541335/ArsonWarehouse.user.js
// @updateURL https://update.greasyfork.org/scripts/541335/ArsonWarehouse.meta.js
// ==/UserScript==

/* global Alpine */

const TEMPLATE = `
<style>
  .awh-dialog {
    min-width: 320px;
    max-width: 784px;
    box-sizing: border-box;
    z-index: 3; /* some arbitrary value that puts it above torn's native content */
    
    .close-modal-btn {
      position: absolute;
      top: -10px;
      right: -10px;
      width: 28px;
      height: 28px;
      padding: 0;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      background: #fff;
      border-radius: 10px;
      box-shadow: 1px 1px 3px rgba(0, 0, 0, .1);
    }
    
    .components-header {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 10px;
      column-gap: 10px;
      
      > :first-child {
        grid-column: 2;
      }    
    }
    
    .components-wrap {
      position: relative;
    }
    
    .scroll-indicator {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 32px;
      background: linear-gradient(to top, #fff, transparent);
    }
    
    .end-of-list {
      position: relative;
      flex: 0 0 32px; /* for flex containers */
      height: 32px; /* for non-flex containers */
      list-style: none;
      
      span {
        position: absolute;
        inset: 0;
        background: #fff;
        text-align: center;
        line-height: 32px;;
        z-index: 1; /* on top of scroll-indicator */ 
      }
    }
    
    .components {
      display: flex;
      flex-direction: column;
      max-height: 30vh;
      /*padding-bottom: 32px;*/
      overflow: auto;
    }
    
    .component {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 10px;
      column-gap: 10px;
      
      &:nth-child(even) {
        background: #0001;
      }
    }
    
    .grand-total {
      display: flex;
      flex-direction: column;
      row-gap: 5px;
      align-items: flex-end;
      padding: 10px;
      
      span {
        font-weight: bold;
        font-size: 1rem;
      }
      
      .apply-total {
        padding: 0;
        border: none;
        cursor: pointer;
      }
    }
    
    .text-right {
      text-align: right;
    }
    
    .warnings-wrap {
      position: relative;
    }
    
    .warnings {
      margin-top: 1rem;
      padding-left: .75rem;
      max-height: 10vh;
      overflow: auto;
      list-style: disc;
      
      li {
        padding: 2px 0;
      }
    }
  }
  
  .calculate-price-button {
    display: inline-flex;
    align-items: center;
    column-gap: 0.5rem;
    padding: 0.5rem 1rem 0.5rem 0.75rem;
    background-color: transparent;
    border: 2px solid #dc2626;
    border-radius: 5px;
    color: #000;
    cursor: pointer;
    transition: background-color 200ms ease, color 200ms ease;
    
    .flame-emoji {
      font-size: 1rem;
    }
    
    &:hover {
      background-color: #dc2626;
      color: #fff;
    }
  }
</style>

<button class="calculate-price-button" type="button" x-on:click="openTradeDialog">
  <span class="flame-emoji">🔥</span>
  <span>ArsonWarehouse: Calculate Price</span>
</button>

<dialog class="awh-dialog" :open="isDialogOpenOrUndefined">
  <button class="close-modal-btn" type="button" x-on:click="closeDialog">&times;</button>
  
  <template x-if="tradeModel">
    <div>
      <div class="components-header">
        <div class="text-right">Unit price</div>
        <div class="text-right">Total</div>
      </div>
      
      <div class="components-wrap">
        <div class="components">
          <template x-for="cmp in tradeModel.trade.components" :key="cmp.key">
            <div class="component">
              <div x-text="cmp._formatted.nameWithQuantity"></div>
              <div class="text-right" x-text="cmp._formatted.appliedPrice"></div>
              <div class="text-right" x-text='cmp._formatted.totalPrice'></div>
            </div>  
          </template>
          <div class="end-of-list">
            <span>-- end of list --</span>
          </div>
        </div>
        <div class="scroll-indicator"></div>
      </div>
      
      <div class="grand-total">
        <span x-text="tradeModel.trade._formatted.grandTotal"></span>
        <button class="apply-total" type="button" x-on:click="applyTotal">Apply</button>
      </div>
      
      <template x-if="tradeModel.trade._computed.hasWarnings">
        <div class="warnings-wrap">
          <ul class="warnings">
            <template x-for="warning in tradeModel.trade.warnings">
              <li x-text="warning"></li>
            </template>
            <li class="end-of-list">
              <span>-- end of list --</span>
            </li>
          </ul>
          <div class="scroll-indicator"></div>
        </div>
      </template>
      
      
    </div>
  </template>
</dialog>`;

(function () {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      const addedElements = Array.from(mutation.addedNodes ?? []).filter(
        (node) => node.nodeType === Node.ELEMENT_NODE,
      );

      if (addedElements.some((el) => el.classList.contains('trade-cont'))) {
        void tradeDetected();
      }

      if (addedElements.some((el) => el.classList.contains('add-money'))) {
        inputMoneyAndSave();
      }
    }
  });
  observer.observe(getTradeContainer(), { childList: true });
})();

function getTradeContainer() {
  return document.querySelector('#trade-container');
}

function inputMoneyAndSave() {
  const tradeContainer = getTradeContainer();
  const amount = tradeContainer.dataset.grandTotal;

  if (typeof amount === 'undefined') {
    return;
  }

  delete tradeContainer.dataset.grandTotal;

  const fields = Array.from(tradeContainer.querySelectorAll('input.input-money'));
  for (let field of fields) {
    field.value = amount;
  }

  const submitBtn = tradeContainer.querySelector('input[type=submit]');
  submitBtn.removeAttribute('disabled');
  submitBtn.classList.remove('disabled');
  submitBtn.click();
}

async function tradeDetected() {
  await loadAlpine();

  Alpine.data('awh-trade', () => ({
    dialogVisible: false,
    tradeModel: null,
    isDialogOpenOrUndefined() {
      return this.dialogVisible ? true : undefined;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    async openTradeDialog() {
      const theirPanel = tradeContainer.querySelector('.user.right');

      this.tradeModel = await fetchTrade({
        theirItems: getItems(theirPanel),
        theirName: getName(theirPanel),
      });
      this.dialogVisible = true;

      this.tradeModel.trade = {
        ...this.tradeModel.trade,
        _computed: {
          hasWarnings: this.tradeModel.trade.warnings.length > 0,
          grandTotal: this.tradeModel.trade.components.reduce(
            (sum, cmp) => sum + cmp.applied_price * cmp.quantity,
            0,
          ),
        },
      };

      this.tradeModel.trade = {
        ...this.tradeModel.trade,
        _formatted: {
          grandTotal: formatCurrency(this.tradeModel.trade._computed.grandTotal),
        },
      };

      this.tradeModel.trade.components.forEach((cmp) => {
        cmp._formatted = {
          nameWithQuantity: `${cmp.name} x${formatNumber(cmp.quantity)}`,
          appliedPrice: formatCurrency(cmp.applied_price),
          totalPrice: formatCurrency(cmp.applied_price * cmp.quantity),
        };
      });
    },
    applyTotal() {
      // store grand total in the #trade-container so we can grab it from there once the money field renders
      getTradeContainer().dataset.grandTotal = this.tradeModel.trade._computed.grandTotal;

      const myPanel = tradeContainer.querySelector('.user.left');
      const addMoneyBtn = myPanel.querySelector('.color1 .add a');

      addMoneyBtn.click();
    },
  }));

  const tradeContainer = getTradeContainer();
  tradeContainer.setAttribute('x-data', 'awh-trade');
  tradeContainer.insertAdjacentHTML('afterbegin', TEMPLATE);
}

function fetchTrade({ theirItems, theirName }) {
  // todo add support for pda, where GM_xmlhttpRequest does not exist
  return new Promise((resolve) => {
    GM_xmlhttpRequest({
      url: 'https://arsonwarehouse.com/api/v1/trades',
      method: 'post',
      data: JSON.stringify({
        trade_id: getTradeId(),
        plugin_version: 'userscript_v1.0.0',
        buyer: parseInt(getCookie('uid'), 10),
        seller: theirName,
        items: theirItems,
      }),
      headers: { Accept: 'application/json' },
      onload(response) {
        resolve(JSON.parse(response.responseText));
      },
    });
  });
}

function getItems(userDiv) {
  return Array.from(userDiv.querySelectorAll('.color2 li'))
    .filter((li) => li.textContent.trim() !== 'No items in trade')
    .map((li) => {
      const match = li.textContent.trim().match(/^(.*)\s+x(\d+)$/);
      return match ? { name: match[1].trim(), quantity: parseInt(match[2], 10) } : null;
    })
    .filter(Boolean);
}

function getName(userDiv) {
  return userDiv.querySelector('.title-black').textContent.trim();
}

function getTradeId() {
  const match = window.location.hash.match(/ID=([^&]+)/);
  if (!match[1]) {
    throw Error('unable to get trade id');
  }
  return parseInt(match[1], 10);
}

const { format: formatNumber } = Intl.NumberFormat('en-US');

function formatCurrency(num) {
  const formatted = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(num);

  // Try to reverse-parse the formatted string
  const match = formatted.match(/^([\d.]+)([KMBT])$/);
  if (match) {
    const [, value, unit] = match;
    const factor = { K: 1e3, M: 1e6, B: 1e9, T: 1e12 }[unit];

    const approx = parseFloat(value) * factor;

    if (Math.round(approx) !== Math.round(num)) {
      // Rounding detected
      return '$' + formatNumber(num); // fallback to raw number
    }
  }

  return '$' + formatted;
}

function loadAlpine() {
  return new Promise((resolve) => {
    if (typeof Alpine !== 'undefined') {
      // Alpine is already loaded (player may have gone back and forth between the trade index and a trade details page)
      resolve();
      return;
    }

    // todo add support for pda, where GM_addElement does not exist
    GM_addElement('script', {
      src: 'https://cdn.jsdelivr.net/npm/@alpinejs/csp@3.x.x/dist/cdn.min.js',
      type: 'text/javascript',
    });

    document.addEventListener('alpine:init', resolve);
  });
}
