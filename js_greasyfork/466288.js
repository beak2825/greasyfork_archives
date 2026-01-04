// ==UserScript==
// @name         Zunia
// @namespace    zero.zunia.torn
// @version      0.1
// @description  Auto set bazaar prices on money input field click.
// @author       -zero, tos, Lugburz
// @match        *.torn.com/bazaar.php*
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/466288/Zunia.user.js
// @updateURL https://update.greasyfork.org/scripts/466288/Zunia.meta.js
// ==/UserScript==

var apikey = 'API_KEY';
var percentage = 2;

var event = new Event('keyup')
var APIERROR = false

async function init(){
    data = await $.getJSON('https://api.torn.com/torn/?selections=items&key='+apikey+'&comment=Zunia');
    data = data.items;
    console.log(data);
}

async function lmp(itemID) {
    console.log(itemID);
    var val = Math.round(data[itemID].market_value * (100 + percentage)/100);

    return val;
}

// HACK to simulate input value change
// https://github.com/facebook/react/issues/11488#issuecomment-347775628
function reactInputHack(inputjq, value) {
    // get js object from jquery
    const input = $(inputjq).get(0);

    let lastValue = 0;
    input.value = value;
    let event = new Event('input', { bubbles: true });
    // hack React15
    event.simulated = true;
    // hack React16 内部定义了descriptor拦截value，此处重置状态
    let tracker = input._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    input.dispatchEvent(event);
}

function addOneFocusHandler(elem, itemID) {
    $(elem).on('focus', function(e) {
        this.value = '';
        if (this.value === '') {
            lmp(itemID).then((price) => {
                //this.value = price;
                reactInputHack(this, price);
                this.dispatchEvent(event);
                if(price) $(elem).off('focus');
            });
        }
    });
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
        if (typeof node.classList !== 'undefined' && node.classList) {
            const remove = $(node).find('[class*=removeAmountInput]');
            let input = $(node).find('[class^=input-money]');
            if ($(input).size() > 0 && $(remove).size() > 0) {
                // Manage items
                $(input).each(function() {
                    const img = $(this).parent().parent().find('img');
                    const src = $(img).attr('src');
                    if (src) {
                        const itemID = src.split('items/')[1].split('/medium')[0];
                        const inp = $(this).find('.input-money');
                        addOneFocusHandler($(inp), itemID);
                    }
                });
            } else if ($(input).size() > 0) {
                // Add items
                input = node.querySelector('.input-money[type=text]');
                const img = node.querySelector('img');
                if (input && img) {
                    const itemID = img.src.split('items/')[1].split('/')[0];
                    addOneFocusHandler($(input), itemID);

                    // input amount
                    const input_amount = $(node).find('div.amount').find('.clear-all[type=text]');
                    const inv_amount = $(node).find('div.name-wrap').find('span.t-hide').text();
                    const amount = 9999;
                    $(input_amount).on('focus', function() {
                        reactInputHack(input_amount, amount);
                    });
                }
            }
        }
    }
  }
});

init();
const wrapper = document.querySelector('#bazaarRoot');
observer.observe(wrapper, { subtree: true, childList: true });
