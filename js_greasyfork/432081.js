
// ==UserScript==
// @name        henp
// @namespace   tz.neocities.org/hen+
// @description more hicetnunc features
// @match       https://www.hicetnunc.xyz/
// @version     1.9.1
// @author      hyperobjkt
// @run-at      document-idle
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@1,npm/@violentmonkey/ui@0.5
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/432081/henp.user.js
// @updateURL https://update.greasyfork.org/scripts/432081/henp.meta.js
// ==/UserScript==

(function () {
'use strict';

var css_248z = ".hecstats{color:#fda6f6;font-family:monospace;font-size:1.2em;font-weight:900}[data-gallery]{border:1px solid red}[data-tz]{border-bottom:1px solid red}[data-dumblink]{cursor:pointer;font-size:2em}[data-dumblink]:hover{font-weight:700}[data-markets] .whale{outline:4px solid #0ff}.green{color:green}.red{color:red}.coin{color:#ff0}.qty{color:#0ff}";

// global CSS

function getGreetings() {
  return VM.createElement(VM.Fragment, null, VM.createElement("style", null, css_248z));
}

var styles = {"panel":"style-module_panel__J9HLb","primary":"style-module_primary__34GS9","market":"style-module_market__psPxT","secondary":"style-module_secondary__2gCXn","markets":"style-module_markets__1v7Iq","stats":"style-module_stats__YJSZz"};
var stylesheet=".style-module_panel__J9HLb{padding:0 15px 15px;font-family:basier_circle_monoregular,Courier New,Courier,monospace;font-size:80%}.style-module_primary__34GS9.style-module_market__psPxT h2{background:#a77e7e}.style-module_secondary__2gCXn.style-module_market__psPxT h2{background:#ccc}.style-module_market__psPxT h2{font-weight:900;background:#a77e7e;padding:3px;color:#000;margin-bottom:5px}.style-module_markets__1v7Iq{padding:20px}.style-module_market__psPxT{margin-right:20px;background:#000;padding:5px}.style-module_markets__1v7Iq div label{font-weight:900}.style-module_panel__J9HLb input{width:300px;color:red;background:#111;border:0;margin-left:-3px}.style-module_stats__YJSZz{border:1px solid #fda6f6;padding:3px;color:#fff;font-family:monospace;font-size:1.2em;font-weight:900}.style-module_markets__1v7Iq{display:flex}";

// CSS modules

function renderPrimaryMarket(data = []) {
  const avg = Math.floor(data.map(d => d.swap.price).reduce((a, b) => a + b) / data.length) / 1000000;
  const fat = Math.max(...data.map(d => d.swap.price)) / 1000000;
  const last = data[0].swap.price / 1000000;
  let whale = false;

  if (avg > 1) {
    if (data.length > 1) {
      if (last > 10) {
        whale = true;
      }
    }
  }

  return VM.createElement(VM.Fragment, null, VM.createElement("div", {
    className: `${styles.market} ${styles.primary} ${whale ? 'whale' : ''}`
  }, VM.createElement("h2", null, "1st Market"), VM.createElement("div", null, VM.createElement("div", null, VM.createElement("label", null, "Last sold:"), " ", VM.createElement("span", {
    className: "coin"
  }, `${data[0].swap.price / 1000000}`, "\uA729")), VM.createElement("div", null, VM.createElement("label", null, "Avg Sale:"), " ", VM.createElement("span", {
    className: "coin"
  }, `${avg.toFixed(2)}`, "\uA729")), VM.createElement("div", null, VM.createElement("label", null, "Top Sale:"), " ", VM.createElement("span", {
    className: "qty"
  }, `${fat}`)), VM.createElement("div", null, VM.createElement("label", null, "Qty Sold:"), " ", VM.createElement("span", {
    className: "qty"
  }, `${data.length}`)))));
}

function renderSecondaryMarket(data = []) {
  const avg = Math.floor(data.map(d => d.price).reduce((a, b) => a + b) / data.length, 0) / 1000000;
  const fat = Math.max(...data.map(d => d.price)) / 1000000;
  const last = data[0].price / 1000000;
  let whale = false;

  if (avg > 1) {
    if (data.length > 1) {
      if (last > 10) {
        whale = true;
      }
    }
  }

  return VM.createElement(VM.Fragment, null, VM.createElement("div", {
    className: `${styles.market} ${styles.secondary} ${whale ? 'whale' : ''}`
  }, VM.createElement("h2", null, "2nd Market"), VM.createElement("div", null, VM.createElement("div", null, VM.createElement("label", null, "Last sold:"), " ", VM.createElement("span", {
    className: "coin"
  }, `${data[0].price / 1000000}`, "\uA729")), VM.createElement("div", null, VM.createElement("label", null, "Avg Sale:"), " ", VM.createElement("span", {
    className: "coin"
  }, `${avg.toFixed(2)}`, "\uA729")), VM.createElement("div", null, VM.createElement("label", null, "Top Sale:"), " ", VM.createElement("span", {
    className: "coin"
  }, `${fat}ꜩ`)), VM.createElement("div", null, VM.createElement("label", null, "Qty Sold:"), " ", VM.createElement("span", {
    className: "qty"
  }, `${data.length}`)))));
}

function addPrimaryMarket(markets, data) {
  markets.appendChild(renderPrimaryMarket(data));
}
function addSecondaryMarket(markets, data) {
  markets.appendChild(renderSecondaryMarket(data));
}
function statsPanel(tz) {
  return VM.createElement(VM.Fragment, null, VM.createElement("div", {
    className: styles.panel
  }, VM.createElement("input", {
    type: "text",
    readonly: "readonly",
    value: tz
  })), VM.createElement("div", {
    "data-markets": "true",
    className: styles.markets
  }), VM.createElement("style", null, stylesheet));
}

const limit = 200;

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch("https://api.hicdex.com/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName
    })
  });
  return await result.json();
}

async function doFetch(query, table, addr) {
  const {
    errors,
    data
  } = await fetchGraphQL(query, table, {
    "address": addr
  });

  if (errors) {
    console.error(errors);
  }

  return data;
}

const queries = {
  primary: `
  query Sales($address: String!) {
    hic_et_nunc_trade(where: {_or: [{seller: {address: {_eq: $address}}}, {token: {creator: {address: {_eq: $address}}}}]}, order_by: {timestamp: desc}, limit: ${limit}) {
      timestamp
      token {
        id
        artifact_uri
        display_uri
        mime
        title
        creator {
          address
        }
      }
      buyer {
        address
      }
      amount
      swap {
        price
      }
    }
  }
  `,
  meOnSecondary: `
  query meOnSecondaryMarket($address: String!) {
    hic_et_nunc_swap(
      where: {
        token: {
          creator: {address: {_eq: $address}},
          swaps: {creator: {address: {_neq: $address}}}
        },
        status: {_in: [0, 1]}
      },
      order_by: {token_id: desc}
    ) {
      price
      status
      token {
        title
        mime
        description
        id
        artifact_uri
        display_uri
      }
    }
  }
`,
  secondary: `
  query mySecondaryMarketSales($address: String!) {
    hic_et_nunc_swap(
      where: {
        token: {creator: {address: {_neq: $address}}},
        status: {_in: [0, 1, 2]},
        creator: {address: {_eq: $address}}
      },
      order_by: {token_id: desc},
      limit: ${limit}
    ) {
      price
      status
      token {
        title
        mime
        description
        id
        artifact_uri
        display_uri
      }
    }
  }
  `
};

const throttle = (fn, delay) => {
  let timeout;
  let noDelay = true;
  let queue = [];

  const start = () => {
    if (queue.length) {
      const first = queue.shift();
      fn.apply(first.context, first.arguments);
      timeout = setTimeout(start, delay);
    } else {
      noDelay = true;
    }
  };

  const ret = (...rest) => {
    queue.push({
      context: undefined,
      arguments: [...rest]
    });

    if (noDelay) {
      noDelay = false;
      start();
    }
  };

  ret.reset = () => {
    clearTimeout(timeout);
    queue = [];
  };

  return ret;
};

const settings = {
  throttleStats: 500
};
/***
 * The link to the wallet address has some JS bindings on it and it's a pain
 * in the ass to remove 'em. So instead, I just replace that link with a div
 * and bind a click event to it to open the page in a new tab. If we'd create
 * a new link instead of a div, their framework still binds click events to
 * it that goofs up the page.
 */

const makeDumbLink = (link, div) => {
  const dumbLink = document.createElement('div');
  dumbLink.innerText = link.innerText;
  dumbLink.dataset.dumblink = link;
  dumbLink.addEventListener('click', function (e) {
    window.open(this.dataset.dumblink);
  });
  link.parentNode.replaceChild(dumbLink, link);
  div.dataset.tz = link.href.split('/tz/')[1];
};

const processLink = (link, div) => {
  link.dataset.processed = true;
  const tz = link.href.split('/tz/')[1];
  makeDumbLink(link, div);
  div.appendChild(statsPanel(tz));
  /***
   * Fetch the various stuff here, only doing additional ones if the artist has 2ndary market sales
   */

  doFetch(queries.meOnSecondary, "meOnSecondaryMarket", tz).then(data => {
    if (data.hic_et_nunc_swap && data.hic_et_nunc_swap.length > 0) {
      // Filter anything sold aka status of 1
      const filtered = data.hic_et_nunc_swap.filter(t => {
        return t.status === 1;
      });

      if (filtered.length > 0) {
        addSecondaryMarket(div.querySelector('[data-markets]'), filtered);
        doFetch(queries.primary, "Sales", link.href.split("/tz/")[1]).then(primaryData => {
          const filteredPrimary = primaryData.hic_et_nunc_trade.filter(t => {
            return t.token.creator.address === tz;
          });

          if (filteredPrimary.length > 0) {
            addPrimaryMarket(div.querySelector('[data-markets]'), primaryData.hic_et_nunc_trade);
          }
        });
      } else {
        div.querySelector('[data-markets]').remove();
      }
    } else {
      div.querySelector('[data-markets]').remove();
    }
  });
};

const slowProcessLink = throttle(processLink, settings.throttleStats);

const watch = () => {
  // Select the node that will be observed for mutations
  const targetNode = document.getElementById('root'); // Options for the observer (which mutations to observe)

  const config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
  }; // Callback function to execute when mutations are observed

  const callback = function (mutationsList, observer) {
    // Use traditional 'for loops' for IE 11
    for (const mutation of mutationsList) {
      const newNode = mutation.addedNodes[0];

      if (mutation.type !== 'childList' || !newNode || newNode.dataset && newNode.dataset.newobj) {
        continue;
      }

      if (mutation.addedNodes[0].className === 'infinite-scroll-component__outerdiv') {
        const gallery = mutation.addedNodes[0].querySelector('div div div div div');
        gallery.dataset.gallery = true;
        [...gallery.children].forEach(div => {
          const link = [...div.querySelectorAll("a")].filter(a => a.href.includes('/tz/')).pop();
          link && processLink(link, div);
        });
      } else if (mutation.addedNodes[0].className === '') {
        const link = mutation.addedNodes[0].querySelectorAll('a')[1];
        link && slowProcessLink(link, mutation.addedNodes[0]);
      }
    }
  }; // Create an observer instance linked to the callback function


  const observer = new MutationObserver(callback); // Start observing the target node for configured mutations

  observer.observe(targetNode, config); // Later, you can stop observing
  // observer.disconnect()
};

watch();
document.body.append(getGreetings());

}());
