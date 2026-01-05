// ==UserScript==
// @name         Prolific Exchange Rates
// @namespace    https://gist.github.com/Kadauchi
// @version      1.0.2
// @description  Converts GBP to USD and displays it
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://www.prolific.ac/studies*
// @downloadURL https://update.greasyfork.org/scripts/29038/Prolific%20Exchange%20Rates.user.js
// @updateURL https://update.greasyfork.org/scripts/29038/Prolific%20Exchange%20Rates.meta.js
// ==/UserScript==

function getExchangeRates() {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(`GET`, `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22GBPUSD%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`);
    xhr.send(null);

    xhr.onload = function () {
      if (this.status === 200) resolve(this.response);
      else reject(`${this.status} - ${this.statusText}`);
    };
    xhr.onerror = function () {
      reject(`${this.status} - ${this.statusText}`);
    };
    xhr.ontimeout = function () {
      reject(`${this.status} - ${this.statusText}`);
    };
  });
}

function parseExchangeRates (result) {
  const response = JSON.parse(result);
  const rate = response.query.results.rate.Rate;
  setTimeout(displayUSD(rate), 500);
  localStorage.setItem(`exchangeRate`, rate);
}

function displayUSD (rate) {
  for (let elem of document.querySelectorAll(`i.fa.fa-gbp`)) {
    if (elem.nextSibling.nextSibling) {
      const gbp = elem.nextSibling.nextSibling.outerHTML;
      const gbpFormat = gbp.split(`>`)[1].replace(/[^0-9.]/g, '');

      elem.nextSibling.nextSibling.insertAdjacentHTML(
        `afterend`,
        `<b style="color: green;">                $${(+rate * +gbpFormat).toFixed(2)}</b>`
      );
    }
    else {
      const gbp = elem.nextSibling.textContent;
      const gbpFormat = gbp.split(`£`)[1].replace(/[^0-9.]/g, '');

      elem.parentElement.insertAdjacentHTML(
        `beforeend`,
        `<b style="color: green;">                $${(+rate * +gbpFormat).toFixed(2)}</b>`
      );
    }
  }

  for (let elem of document.querySelectorAll(`.study`)) {
    const gpb = elem.querySelectorAll(`li`)[2].textContent.split(`:`)[1].replace(/[^0-9.]/g, ``);

    elem.querySelectorAll(`li`)[2].insertAdjacentHTML(
      `beforeend`,
      `<b style="color: green;">                $${(+rate * +gpb).toFixed(2)}/hr</b>`
    );
  }
}

getExchangeRates()
  .then(parseExchangeRates)
  .catch(function (error) {
  console.error(`Prolific Exchange Rates- ${error}`);
});
