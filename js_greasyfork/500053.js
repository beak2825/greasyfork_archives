// ==UserScript==
// @name        CDJapan Mercari Integration
// @namespace   zys52712
// @match       https://www.cdjapan.co.jp/agency/mercari/product/*
// @match       https://jp.mercari.com/*/item/*
// @match       https://jp.mercari.com/*/shops/product/*
// @match       https://jp.mercari.com/item/*
// @match       https://jp.mercari.com/shops/product/*
// @grant       none
// @version     1.0
// @license     GNU GPLv3
// @author      zys52712
// @description Add buttons to easily jump between mercari and CDJapan
// @downloadURL https://update.greasyfork.org/scripts/500053/CDJapan%20Mercari%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/500053/CDJapan%20Mercari%20Integration.meta.js
// ==/UserScript==

const button = document.createElement('a');
button.classList.add('cdjapan-mercari-button');
button.setAttribute('target', '_blank');
button.setAttribute('rel', 'noopener');

const styles = document.createElement('style');

styles.innerHTML = `
.cdjapan-mercari-button {
  background: black;
  font-size: 16px;
  text-align: center;
  font-weight: 700;
  color: white;
  padding: 12px;
  display: block;
  margin-top: 15px;
}

.cdjapan-mercari-button.cdjapan {
  background: #ff3c43;
  border-radius: 2px;
}
.cdjapan-mercari-button.mercari {
  background: #09C;
  border-radius: 4px;
  margin-bottom: 15px;
}
`;

document.body.appendChild(styles);

itemId = window.location.href.split("/").pop();

if ( window.location.href.includes('cdjapan') ) {
  button.classList.add('cdjapan');
  button.innerHTML = 'View on mercari jp';
  let url;

  const regex = /^m\d+$/;
  if (regex.test(itemId)) {
    url = 'https://jp.mercari.com/en/item/' + itemId;
  } else {
    url = 'https://jp.mercari.com/shops/product/' + itemId;
  }

  button.href = url;

  insertAfter(document.querySelector('.product_info .buttons.ec-button'), button);
}

else {
  button.classList.add('mercari');
  button.innerHTML = 'View on CDJapan';
  button.href = 'https://www.cdjapan.co.jp/agency/mercari/product/' + itemId;
  const buttonSelector = '#item-info > section > section:has(+div[data-testid="checkout-button-container"]), #product-info > section > section:has(+div.merButton)';

  waitForElm(buttonSelector).then((elm) => {
    insertAfter(document.querySelector(buttonSelector), button);
  });
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function waitForElm(selector) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(mutations => {
        if (document.querySelector(selector)) {
            observer.disconnect();
            resolve(document.querySelector(selector));
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
  });
}
