// ==UserScript==
// @name               Price History - Amazon US
// @description        A non-intrusive way to display Amazon US item's history price, featuring third-party price history.
// @version            1.0.1
 
// @name:zh-CN         价格历史 - 亚马逊美国
// @description:zh-CN  以调用方式来展示亚马逊US商品的历史价格，使用第三方价格服务。
 
// @antifeature        tracking Third-party site can collect/store/guess what you are going to purchase.
// @antifeature:zh-CN  tracking 第三方网站可能会搜集、储存或推测你将要购买的物品。
 
// @namespace          uk.jixun
// @match              https://amazon.com/*
// @match              https://www.amazon.com/*
// @match              https://smile.amazon.com/*
// @author             Jixun
// @license            bsd-3-clause
// @run-at             document-start
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/490822/Price%20History%20-%20Amazon%20US.user.js
// @updateURL https://update.greasyfork.org/scripts/490822/Price%20History%20-%20Amazon%20US.meta.js
// ==/UserScript==
 
let serviceEl = [];
const services = [{
  name: 'CCC',
  inline: false,
  url: asin => `https://us.camelcamelcamel.com/product/${asin}`,
}, {
  name: 'Keepa',
  inline: asin => () => {
    const prevImage = $('keepa-history-embed');
    if (prevImage) {
      prevImage.style.display = prevImage.style.display === 'none' ? 'block' : 'none';
      return;
    }
    
    const src = `https://graph.keepa.com/pricehistory.png?asin=${asin}&domain=com`;
    const $img = h('img', {src, id: 'keepa-history-embed', 'referrerPolicy': 'no-referrer'});
    const $price = $('price');
    if ($price) {
      $price.parentNode.insertBefore($img, $price.nextSibling);      
    } else {
      $('olp_feature_div').appendChild($img);
    }
    serviceEl.push($img);
  },
  url: asin => `https://keepa.com/#!product/1-${asin}`,
}];
 
const serviceStyle = {
  'marginRight': '0.5em',
  'display': 'inline-block',
};
 
const inlineStyle = {
  background: 'none',
  border: 'none',
};
 
function insertServices(asin) {
  return services.map(service => h('li', { style: serviceStyle }, [
    service.url && h('a', { href: service.url(asin), target: '_blank', rel: 'noreferrer' }, [service.name]),
    !service.url && h('span', null, [service.name]),
    service.inline && h('span', null, [
      ' (',
      h('a', { href: 'javascript:void(0)', onclick: service.inline(asin) }, 'inline'),
      ')',
    ])
  ]));
}
 
function $(id) {
  return document.getElementById(id);
}
 
function insertChildren(root, children = []) {
  if (!children) return;
  if (Array.isArray(children)) {
    for (const c of children) {
      insertChildren(root, c);
    }
    return;
  }
  if (typeof children === 'string') {
    children = document.createTextNode(children);
  }
  root.appendChild(children);
}
 
function h(tag, attr, ...children) {
  const el = document.createElement(tag);
  if (attr) {
    for(const [name, value] of Object.entries(attr)) {
      if (name === 'style') {
        Object.assign(el.style, value);
      } else {
        el[name] = value;
      }
    }
  }
  insertChildren(el, children);
  return el;
}
 
function remove(node) {
  node?.parentNode?.removeChild(node);
}
 
let lastRoot;
function injectPriceCompare() {
  const $asin = $('ASIN');
  if (!$asin || $asin.tagName !== 'INPUT') {
    console.info('asin not found.');
    return;
  }
 
  // clean up
  serviceEl.forEach(remove);
 
  const asin = $asin.value;
  const $priceTable = document.querySelector('#price table > tbody') || $('olp_feature_div');
  const root = h('tr', null, [
    h('td', { className: 'a-color-secondary' }, ['History']),
    h('td', null, [
      h('ul', { style: {cssText: 'margin:0'} }, insertServices(asin)),
    ])
  ]);
  $priceTable.appendChild(root);
  serviceEl = [root];
}
 
function init() {
  const root = $('desktop_buybox');
  if (!root) {
    return;
  }
 
  const observer = new MutationObserver((mutationsList, observer) => {
    for(const {removedNodes} of mutationsList) {
      console.info(removedNodes);
      if (!removedNodes) continue;
      
      for (const node of removedNodes) {
        if (node.id === 'buybox') {
          injectPriceCompare();
          return;
        }
      }
    }
  });
 
  // Start observing the target node for configured mutations
  observer.observe(root, { childList: true });
  injectPriceCompare();
}
 
addEventListener('DOMContentLoaded', init);