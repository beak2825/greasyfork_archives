// ==UserScript==
// @name        GET parameters for Caisse d'Epargne bankwire
// @description Fill bank account informations when performing a new bankwire
// @description:fr Remplit les informations de comptes lors de la création d'un virement
// @license MIT
// @namespace   ce@galaskio.tech
// @match       https://www.caisse-epargne.fr/espace-client/virement/nouveau*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @version     1.0.0.20240805
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/502721/GET%20parameters%20for%20Caisse%20d%27Epargne%20bankwire.user.js
// @updateURL https://update.greasyfork.org/scripts/502721/GET%20parameters%20for%20Caisse%20d%27Epargne%20bankwire.meta.js
// ==/UserScript==

//eg. URL : https://www.caisse-epargne.fr/espace-client/virement/nouveau?from=LOCAL_ACCOUNT&to=IBAN&amount=AMOUNT
//where LOCAL_ACCOUNT match your local Caisse d'Epargne account eg. 04123456789
//where IBAN match the target account IBAN eg. EE95 7700 7710 0135 5096
//where AMOUNT match the amount you want to wire, eg. 13.37

// Note: This script only fills values and doesn't perform any bank wire !

var from = "";
var to = "";
var amount = "";

function getParameters(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //from account number
    from = urlParams.get('from');
    //to iban number
    to = urlParams.get('to');
    //amount
    amount = urlParams.get('amount');
    console.log(from, to, amount);
}

function formatAmount(amount){
  if(amount.includes(".")){
    return amount.replace(".",",")
  }
  if(!amount.includes(",")){
    return amount + ",00"
  }
  return amount;
}

let hasRun = false;
function fillAfterTime(miliseconds, force){
  if (!hasRun || force == true) {
    hasRun = true;
    setTimeout(() => {
        getParameters();
        updateValues(from, to, amount);
        updateValues(from, to, amount);
    }, miliseconds);
  }
}

GM_registerMenuCommand("Debug, fill records manually", function() {
    getParameters();
    updateValues(from, to, amount);
    updateValues(from, to, amount);
});

$( document ).ready(function() {
  fillAfterTime(5000, true);
  setTimeout(() => {
      setupObserver()
      console.log("3 sec");
  }, "3000");
});

function setupObserver(){
  // Select the target node (the div with class 'cdk-overlay-container')
  const targetNode = document.querySelector('.cdk-overlay-container');

  // Ensure the target node exists
  if (targetNode) {
      // Options for the observer (which mutations to observe)
      const config = { childList: true, subtree: true, characterData: true };

      // Callback function to execute when mutations are observed
      const callback = function(mutationsList, observer) {
          for (const mutation of mutationsList) {
              if (mutation.type === 'childList') {
                fillAfterTime(8000, false);
              } else if (mutation.type === 'characterData') {
                  console.log('Text content has changed.');
                  console.log('Changed node:', mutation.target);
              }
          }
      };

      // Create an observer instance linked to the callback function
      const observer = new MutationObserver(callback);

      // Start observing the target node with the configured options
      observer.observe(targetNode, config);

  } else {
      console.log('Target node not found.');
  }
}

function updateValues(from, to, amount){
    $('h3:contains("Depuis le compte")').click();
    $('span:contains("N° '+from+'")').click();
    $('h3:contains("Vers le compte")').click();
    $('div:contains("Comptes tiers")').click();
    $('span:contains('+to+')').click();
    $("#amount").click();
    $("#amount").trigger($.Event('keypress', {keycode: 13}));
    var amountInput = document.getElementById('amount');
    simulateBackspace(amountInput);
    simulateKeyPress(amountInput, formatAmount(amount.toString()));
}

function simulateKeyPress(element, text) {
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        let keyEvent = new KeyboardEvent('keypress', {
            bubbles: true,
            cancelable: true,
            key: char,
            char: char,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false
        });
        element.dispatchEvent(keyEvent);

        // For the input field to update its value, you also need to dispatch input events
        let inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        element.value += char; // Manually update the input's value
        element.dispatchEvent(inputEvent);
    }
}

function simulateBackspace(element) {
    let length = element.value.length;
    for (let i = 0; i < length; i++) {
        let backspaceEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Backspace',
            code: 'Backspace',
            charCode: 8,
            keyCode: 8,
            which: 8,
            shiftKey: false,
            ctrlKey: false,
            metaKey: false
        });
        element.dispatchEvent(backspaceEvent);

        // Manually update the input's value
        element.value = element.value.slice(0, -1);

        let inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        element.dispatchEvent(inputEvent);
    }
}