// ==UserScript==
// @name        4chan Bizantine Numbers
// @namespace   smg
// @match       *://boards.4chan.org/biz/*
// @match       *://boards.4channel.org/biz/*
// @connect     query1.finance.yahoo.com
// @grant       GM.info
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.deleteValue
// @grant       GM.listValues
// @grant       GM.xmlHttpRequest
// @grant       GM.addStyle
// @version     1.1
// @author      anon
// @description See ticker price right where it's mentioned
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/424711/4chan%20Bizantine%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/424711/4chan%20Bizantine%20Numbers.meta.js
// ==/UserScript==

// quote - lots of metadata
var YahooFinancev7 = 'https://query1.finance.yahoo.com/v7/finance/quote'; // + '?symbols='+symbols + 'fields=' (optional)
// chart - chart data; https://github.com/ranaroussi/yfinance/blob/main/yfinance/base.py
var YahooFinancev8 = 'https://query1.finance.yahoo.com/v8/finance/chart/'; // + symbol + '?range=1wk&interval=1d'
// Lock symbol while async query pulls the data.
// {"SYMBOL": …}
var lock = new Map();
// time to consider data up to date: 15 minutes * 60 seconds * 1000 milliseconds
var lifetime = 15 * 60 * 1000;
// Load existing data from storage
// {"symbol": Yahoo Finance results[{…}, …]}
var quotes = new Map();
var notasymbol = new Map();
// indices, currencies, precious metals & crypto
var idx = ['SPX', 'GSPC', 'DJI', 'VIX', 'IXIC', 'NASDAQ', 'TNX', 'FTSE', 'N225', 'CMC200'];
var forex = ['USD', 'EUR', 'JPY', 'CNY', 'KRW', 'GBP', 'CAD', 'AUD', 'RUB'];
var metals = ['silver', 'gold', 'platinum', 'palladium'];
var crypto = ['BTC', 'XMR', 'ALGO', 'LTC', 'ETH', 'LINK', 'DOGE'];
var cryptopair = ['USD', 'EUR', 'BTC', 'XMR'];
var changelog = `Tooltips no longer display above top edge of viewport`;

async function yahoo(symbol) {
  let quote = [];
  var symbols = null;
  // special case for indices, forex and crypto
  if (idx.includes(symbol)) {
    if (symbol === 'NASDAQ') { symbols = '^IXIC'; }
    else { symbols = '^' + symbol; }
  }
  if (forex.includes(symbol))  {
    if (symbol === 'USD') { symbols = forex.slice(1).map(x => symbol + x + '=X').toString() + ',XMR-'+symbol + ',BTC-'+symbol; }
    else { symbols = forex.map(x => symbol + x + '=X').toString() + ',XMR-'+symbol + ',BTC-'+symbol; }
  }
  if (metals.includes(symbol)) {
    switch (symbol) {
      case 'silver':
        symbols = 'SI=F'
        break;
      case 'gold':
        symbols = 'GC=F';
        break;
      case 'platinum':
        symbols = 'PL=F';
        break;
      case 'palladium':
        symbols = 'PA=F';
        break;
    }
  }
  if (crypto.includes(symbol)) { symbols = cryptopair.map(x => symbol + '-' + x).toString() + ',XMR-'+symbol; }
  // cache
  if (!quotes.has(symbol)) {
    // populate cache
    let rawquote = await GM.getValue('quote.'+symbol, '[]');
    quote = JSON.parse(rawquote);
    if (quote.length > 0) {
      quotes.set(symbol, quote);
    }
  } else {
    quote = quotes.get(symbol);
    if (quote.length > 0 && typeof quote[0].regularMarketTime !== 'undefined' && quote[0].regularMarketTime * 1000 < (Date.now() - lifetime)) {
      // refresh cache
      let rawquote = await GM.getValue('quote.'+symbol, '[]');
      quote = JSON.parse(rawquote);
      if (quote.length > 0) {
        quotes.set(symbol, quote);
      }
    }
  }
  // download fresh data if symbol is missing from cache or quote is too old
  if (typeof quote === 'undefined' ||
      typeof quote !== 'undefined' && quote.length === 0 ||
      typeof quote !== 'undefined' && quote.length > 0 && typeof quote[0].regularMarketTime === 'undefined' ||
      typeof quote !== 'undefined' && quote.length > 0 && typeof quote[0].regularMarketTime !== 'undefined' &&
        quote[0].regularMarketTime * 1000 < (Date.now() - lifetime)) {
    let quoteURL = YahooFinancev7 + '?symbols=' + (symbols || symbol);
    let quoteXHR = GM.xmlHttpRequest({
      method: "GET",
      url: quoteURL,
      onload: function(response) {
        let data = JSON.parse(response.responseText);
        if (data.quoteResponse.error === null) {
          if (data.quoteResponse.result.length > 0) {
            let quote = data.quoteResponse.result;
            quotes.set(symbol, quote);
            let rawquote = JSON.stringify(quote);
            GM.setValue('quote.'+symbol, rawquote);
            populate(symbol, quote);
          } else if (quotes.has(symbol)) {
            // potential temporary error, use cache
            let quote = quotes.get(symbol);
            populate(symbol, quote);
          } else {
            // not a valid symbol
            notasymbol.set(symbol, true);
          }
        }
      }
    });
  } else {
    if (quote.length > 0) {
      populate(symbol, quote);
    }
  }
  
  lock.delete(symbol);
}

/* // Old code for v8 API, v7 API is better for our needs
function yahoov8(symbol, range='1wk', interval='1d') {
  let chartURL = YahooFinancev8 + symbol +
    '?range=' + range +
    '&interval=' + interval;
  // fetch data from yahoo
  var chartXHR = GM.xmlHttpRequest({
    method: "GET",
    url: chartURL,
    onload: function(response) {
      let data = JSON.parse(response.responseText);
      if (data.chart.error === null) {
        populate(symbol, data); // populate data format changed
      }
    }
  });
} */

/******************
 * Thread parsing *
 ******************/

// Parse all posts once 4chan X's init finishes
function init(e) {
  async function scriptUpdated() {
    let v = await GM.getValue('version', '0.0');
    if (v === '0.0') {
      notify('Bizantine Numbers installed' + '\nIf you find it useful, feel free to send me some XMR\n' +
            '88CNheH1h7PQgwK1Ehm6JvcAirBhXPJfyCHUvMhbgHwVCDKLu2c9fd9biPMXrEM4LK3Tta6638B9SDGwcDZDFcjw7ta8MuJ');
      GM.setValue('version', GM.info.script.version);
    } else if (v < GM.info.script.version) {
      for (let i = 0; i < changelog.length; i++) {
        if (v < changelog[i].v) {
          notify(changelog[i].msg);
        }
      }
      notify('Bizantine Numbers updated\n' + changelog + '\nIf you find the script useful, feel free to send me some XMR\n' +
            '88CNheH1h7PQgwK1Ehm6JvcAirBhXPJfyCHUvMhbgHwVCDKLu2c9fd9biPMXrEM4LK3Tta6638B9SDGwcDZDFcjw7ta8MuJ');
      GM.setValue('version', GM.info.script.version);
    }
  };
  scriptUpdated();
  
  var posts = document.getElementsByClassName('postMessage');
  tag(posts);
  parse(posts);
}

// Parse new posts on thread update
function update(e) {
  var posts = [];
  if (is4ChanX) {
    var newPosts = e.detail.newPosts;
    for (let i = 0; i < newPosts.length; i++) {
      posts.push(document.getElementById(newPosts[i].replace(/.+\./g, 'm')));
    }
  } else {
    let elements = document.getElementsByClassName('postMessage');
    for (let i = elements.length - e.detail.count; i < elements.length; i++) {
      posts.push(elements[i]);
    }
  }
  tag(posts);
  parse(posts);
}

// Get all text nodes
// @param node Root node to look for text nodes under
function textNodesUnder(node){
  var all = [];
  for (node=node.firstChild;node;node=node.nextSibling){
    if (node.nodeType==3) all.push(node);
    else all = all.concat(textNodesUnder(node));
  }
  return all;
}

// Parse posts looking for symbols, wrapping them in <data> element
// @param array Post IDs to parse
function tag(posts) {
  for (let post = 0; post < posts.length; post++) {
    var nodes = textNodesUnder(posts[post]);
    for (let node = 0; node < nodes.length; node++) {
      var n = nodes[node];
      var htmlNode = document.createElement('span');
      var html = n.textContent
        .replace(/\b[A-Z0-9]{1,6}([.=][A-Z]{1,2})?\b/g, '<data class="ticker" symbol="$&">$&</data>')
        .replace(/\b(gold|silver|platinum|palladium)\b/g, '<data class="ticker" symbol="$&">$&</data>');
      n.parentNode.insertBefore(htmlNode, n);
      n.parentNode.removeChild(n);
      htmlNode.outerHTML = html;
    }
  }
}

// Parse the <data> and start fetch
function parse(posts) {
  // get all elements by tag <data>
  for (let post = 0; post < posts.length; post++) {
    var symbols = posts[post].querySelectorAll('data[symbol]');
    // extract symbols
    for (let i = 0; i < symbols.length; i++) {
      let symbol = symbols[i].getAttribute('symbol');
      if (!notasymbol.has(symbol)) {
        if (!lock.has(symbol) || lock.get(symbol) < (Date.now() - lifetime)) {
          lock.set(symbol, Date.now());
          yahoo(symbol);
        }
      }
    }
  }
}

function populate(symbol, quote) {
  if (typeof quote[0].regularMarketTime !== 'undefined' &&
      typeof quote[0].regularMarketPrice !== 'undefined' &&
      typeof quote[0].regularMarketChangePercent !== 'undefined') {
    let price = quote[0].regularMarketPrice;
    let change = quote[0].regularMarketChangePercent;
    // get all elements by tag <data> and attribute symbol="symbol"
    var tickers = document.querySelectorAll('data[symbol="'+symbol+'"]');
    for (let i = 0; i < tickers.length; i++) {
      let ticker = tickers[i];
      //ticker.setAttribute('title', price+' ('+change.toFixed(2)+'%)');
      ticker.setAttribute('price', price);
      if (change > 0.2) {
        ticker.style.backgroundColor = 'rgba('+(191-32*change)+','+(191+32*change)+',0,0.2)';
      } else if (change < -0.2) {
        ticker.style.backgroundColor = 'rgba('+(191-32*change)+','+(191+32*change)+',127,0.2)';
      } else {
        ticker.style.backgroundColor = 'rgba('+(255-63*change)+','+(255+63*change)+',0,0.2)';
      }
      ticker.onmouseover = tooltip;
    }
  }
}
// add tooltips on inlined posts
function postsInserted(e) {
  if (e.target.classList.contains('inline')) {
    console.log(e);
    // get all elements by tag <data> and attribute symbol
    var tickers = e.target.querySelectorAll('data[symbol][price]');
    for (let i = 0; i < tickers.length; i++) {
      let ticker = tickers[i];
      ticker.onmouseover = tooltip;
    }
  }
}

var currencies = new Map([
  ['USD', '$'],
  ['EUR', '€'],
  ['JPY', '¥'],
  ['CNY', '元'],
  ['GBP', '£'],
  ['CAD', '🍁'],
  ['AUD', '🦘'],
]);
var cDesc = new Map([
  ['USD', 'US Dollar'],
  ['EUR', 'Euro'],
  ['JPY', 'Japanese Yen'],
  ['CNY', 'Chinese Renminbi'],
  ['GBP', 'British Pound'],
  ['CAD', 'A Fucking Leaf'],
  ['AUD', '>money'],
  ['BTC', 'Bitcoin (shitcoin)'],
  ['XMR', 'Monero'],
  ['ALGO', 'Algorand'],
  ['ETH', 'Gas'],
  ['LTC', 'Litecoin'],
  ['LINK', 'Chainlink'],
  ['DOGE', 'Dogecoin 🚀'],
]);

function tooltip(e) {
  let ticker = e.target;
  let symbol = ticker.getAttribute('symbol');
  let quote = quotes.get(symbol);
  let tooltip = document.createElement('div');
  tooltip.classList.add('dialog', 'tooltip');
  if (!is4ChanX) {
    tooltip.classList.add('reply');
  }
  ticker.append(tooltip);
  
  let h = document.createElement('header');
  let c = document.createElement('span');   // currency
  let px = document.createElement('span');  // price
  h.style.fontSize = '1.5em';
  h.style.fontWeight = 300;
  h.append(symbol, ' ', c);
  px.style.fontWeight = 500;
  h.append(px);
  let ppbr = document.createElement('br');
  let pp = document.createElement('small');
  pp.style.fontWeight = 400;
  h.append(ppbr, pp);
  let br = document.createElement('br');
  h.append(br, ' ');
  
  let sm = document.createElement('small'); // small text
  h.append(sm);
  
  tooltip.append(h);
  
  let fx = document.createElement('table');
  fx.classList.add('fx');
  
  for (let i = 0; i < quote.length; i++) {
    if (i === 0 && (quote[i].quoteType === 'CURRENCY' || quote[i].quoteType === 'CRYPTOCURRENCY')) {
      tooltip.append(fx);
    }
    let el = document.createElement('div');
    
    let currency = quote[i].currency;
    if (currencies.has(quote[i].currency)) {
      currency = currencies.get(quote[i].currency);
    }
    c.innerHTML = currency;
    
    let t = document.createElement('table');
    t.style.width = '100%';
    
    switch (quote[i].quoteType) {
      case 'EQUITY':
      case 'ETF':
      case 'FUTURE':
      case 'INDEX':
        c.innerHTML = currency;
        let price = quote[i].regularMarketPrice.toFixed(quote[i].priceHint);
        let change = quote[i].regularMarketChangePercent.toFixed(2);
        px.innerHTML = price + ' ('+change+'%)';
        
        let prepost = '';
        if (typeof quote[i].postMarketTime !== 'undefined') {
          if (quote[i].postMarketTime > quote[i].regularMarketTime) {
            prepost = 'post ' + currency +
                      quote[i].postMarketPrice.toFixed(quote[i].priceHint) +
              ' (' +  quote[i].postMarketChangePercent.toFixed(2) + '%)';
          }
        }
        if (typeof quote[i].preMarketTime !== 'undefined') {
          if (quote[i].preMarketTime > quote[i].regularMarketTime) {
            prepost = 'pre ' + currency +
                      quote[i].preMarketPrice.toFixed(quote[i].priceHint) +
              ' (' +  quote[i].preMarketChangePercent.toFixed(2) + '%)';
          }
        }
        if (prepost !== '') {
          pp.innerHTML = prepost;
        } else {
          ppbr.remove();
          pp.remove();
          pp.remove();
        }
        
        sm.innerHTML = (quote[i].displayName || quote[i].longName || quote[i].shortName);
        
        if (typeof quote[i].fiftyTwoWeekLow !== 'undefined' && typeof quote[i].fiftyTwoWeekHigh !== 'undefined' &&
            typeof quote[i].regularMarketDayLow !== 'undefined' && typeof quote[i].regularMarketDayHigh !== 'undefined') {
          let max = quote[i].fiftyTwoWeekHigh - quote[i].fiftyTwoWeekLow;
          let hi  = quote[i].regularMarketDayHigh - quote[i].fiftyTwoWeekLow;
          let lo  = quote[i].regularMarketDayLow - quote[i].fiftyTwoWeekLow;
          //  min = 0;
          var range = document.createElement('div');
          let lcr = document.createElement('div');
          lcr.style.display = 'flex';
          lcr.style.justifyContent = 'space-between';
          let l = document.createElement('span'); l.append(quote[i].fiftyTwoWeekLow.toFixed(quote[i].priceHint));
          let c = document.createElement('span'); c.append(quote[i].regularMarketDayLow.toFixed(quote[i].priceHint), ' - ',
                                                           quote[i].regularMarketDayHigh.toFixed(quote[i].priceHint));
          let r = document.createElement('span'); r.append(quote[i].fiftyTwoWeekHigh.toFixed(quote[i].priceHint));
          lcr.append(l, c, r);
          range.append(lcr);
          let bar = document.createElement('div');
          bar.style.height = '4px';
          bar.style.minWidth = '300px';
          bar.style.background = 'linear-gradient(to right, #FFFFFF '+(lo/max*100 -1).toFixed(2)+'%, #000000 '+(lo/max*100 -1).toFixed(2)+'% '+
            (hi/max*100 +1).toFixed(2)+'%, #FFFFFF '+(lo/max*100 +1).toFixed(2)+'%)';
          bar.style.borderBottom = 'solid 2px #777';
          range.append(bar);
          el.append(range);
        }
        
        if (typeof quote[i].averageDailyVolume10Day !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('volume (10d avg.)');
          let val = document.createElement('td');
          val.append((quote[i].averageDailyVolume10Day/1000/1000).toFixed(3), 'm');
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].fiftyDayAverage !== 'undefined' && typeof quote[i].twoHundredDayAverage !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('sma 50, 200');
          let val = document.createElement('td');
          val.append(quote[i].fiftyDayAverage.toFixed(quote[i].priceHint),', ', quote[i].twoHundredDayAverage.toFixed(quote[i].priceHint));
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].epsTrailingTwelveMonths !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('eps ttm');
          let val = document.createElement('td');
          val.append(quote[i].epsTrailingTwelveMonths);
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].epsCurrentYear !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('eps current');
          let val = document.createElement('td');
          val.append(quote[i].epsCurrentYear);
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].epsForward !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('eps forward');
          let val = document.createElement('td');
          val.append(quote[i].epsForward);
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].priceEpsCurrentYear !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('P/E current');
          let val = document.createElement('td');
          val.append(quote[i].priceEpsCurrentYear.toFixed(quote[i].priceHint));
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].forwardPE !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('P/E forward');
          let val = document.createElement('td');
          val.append(quote[i].forwardPE.toFixed(quote[i].priceHint));
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].marketCap !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('mcap');
          let val = document.createElement('td');
          val.append((quote[i].marketCap/1000/1000/1000).toFixed(2), 'b');
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].priceToBook !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('price-to-book');
          let val = document.createElement('td');
          val.append(quote[i].priceToBook.toFixed(quote[i].priceHint));
          row.append(label, val);
          t.append(row);
        }
        if (typeof quote[i].averageAnalystRating !== 'undefined') {
          let row = document.createElement('tr');
          let label = document.createElement('td');
          label.append('avg. analyst rating');
          let val = document.createElement('td');
          val.append(quote[i].averageAnalystRating);
          row.append(label, val);
          t.append(row);
        }
        break;
        
      case 'CURRENCY':
      case 'CRYPTOCURRENCY':
        if (i===0) {
          if (cDesc.has(symbol)) {
            sm.innerHTML = cDesc.get(symbol);
            ppbr.remove(); pp.remove(); br.remove();
          }
          if (quote[i].quoteType === 'CRYPTOCURRENCY') { h.removeChild(c); };
        }
        let row = document.createElement('tr');
        let c1 = document.createElement('td');
        if (quote[i].quoteType === 'CURRENCY') { c1.innerHTML = quote[i].shortName; }
        if (quote[i].quoteType === 'CRYPTOCURRENCY') { c1.innerHTML = quote[i].symbol.replace('-', '/'); }
        let c2 = document.createElement('td');
        c2.innerHTML = quote[i].regularMarketPrice.toFixed(quote[i].priceHint);
        let c3 = document.createElement('td');
        c3.innerHTML = quote[i].regularMarketChangePercent.toFixed(2)+'%';
        row.append(c1, c2, c3);
        fx.append(row);
        break;
    }
    el.append(t);
    tooltip.append(el);
  }
  
  let y = e.clientY - 24 - tooltip.getBoundingClientRect().height;
  tooltip.style.top = (y<24 ? 24 : y) + 'px';
  tooltip.style.left = (e.clientX + 24) + 'px';
  e.target.onmouseout = function(e) {
    let ticker = e.target;
    let tooltip = ticker.getElementsByClassName('tooltip')[0];
    e.target.removeChild(tooltip);
  }
}

// Notify helper class https://github.com/ccd0/4chan-x/wiki/4chan-X-API#createnotification
// @param type One of 'info', 'success', 'warning', or 'error'
// @param content Message to display
// @param lifetime Show notification for lifetime seconds; 0 = user needs to close it manually
function notify(content, type='info', lifetime=0) {
  var detail = {type: type, content: content, lifetime: lifetime};
  // dispatch event
  if (typeof cloneInto === 'function') {
    detail = cloneInto(detail, document.defaultView);
  }
  var event = new CustomEvent('CreateNotification', {bubbles: true, detail: detail});
  document.dispatchEvent(event);
  console.log(type, content);
}

var is4ChanX = true;
// Add event listeners
document.addEventListener('4chanXInitFinished', init, false);
document.addEventListener('ThreadUpdate', update, false);
document.addEventListener('PostsInserted', postsInserted, false);
// No 4chan X
document.addEventListener("DOMContentLoaded",
  function (event) {
    setTimeout(
      function () {
        if (!document.documentElement.classList.contains("fourchan-x")) {
          is4ChanX = false;
          document.addEventListener('4chanThreadUpdated', update, false);
          init();
        }
      },
      (1)
    );
  }
);

// Add CSS
let style = `
.ticker[price] {text-decoration: underline dotted 1px}
.ticker .tooltip {
  position: fixed;
  padding: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
  font-variant: small-caps tabular-nums;
}
.ticker .tooltip header { font-size: 1.5em }
.ticker .tooltip .fx { font-family: monospace }
.ticker[symbol="CLF"] .dialog.tooltip, .ticker[symbol="MVIS"] .dialog.tooltip {
  background-image: linear-gradient(to bottom, #55CDFC 20%, #F7A8B8 20% 40%, #FFFFFF 40% 60%, #F7A8B8 60% 80%, #55CDFC 80%) !important }
`;
GM.addStyle(style);