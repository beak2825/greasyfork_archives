// ==UserScript==
// @name         Copy BBCode
// @namespace    http://tampermonkey.net/
// @version      2024-11-03
// @description  Add a button to copy the BBCode presentation of the torrent.
// @author       zorofirely
// @match        https://www.happyfappy.org/torrents.php?id=*
// @icon         https://www.happyfappy.org/favicon.ico?v=1612648267
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510371/Copy%20BBCode.user.js
// @updateURL https://update.greasyfork.org/scripts/510371/Copy%20BBCode.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let cached = null;
  const spoilerMap = new Map();
  const torrentMap = new Map();
  const userMap = new Map();
  const mediainfoMap = new Map();

  class Node {
    constructor() {
      this.type = null;
      this.value = null;
      this.text = null;
      this.children = null;
    }
  }

  function filterFooterNodes(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === 'torrentsigbox') {
        nodes.splice(i, 1);
      }
    }
    return nodes;
  }

  function filterSpoilerNodes(nodes) {
    for (let i = 3; i < nodes.length; i++) {
      if (nodes[i].nodeName.toLowerCase() === 'blockquote' && nodes[i].className.includes('spoiler')) {
        spoilerMap.set(nodes[i], nodes[i-3].innerText);
        nodes.splice(i - 3, 3);
      }
    }
    return nodes;
  }

  function filterTorrentNodes(nodes) {
    for (let i = 1; i < nodes.length; i++) {
      if (nodes[i-1].nodeName.toLowerCase() === 'script' && nodes[i].nodeName.toLowerCase() === 'a') {
        const torrentID = nodes[i].href.match(/\d+/g)[0];
        torrentMap.set(nodes[i], torrentID);
        nodes.splice(i - 1, 1);
      }
    }
    return nodes;
  }

  function filterUserNodes(nodes) {
    for (const el of nodes) {
      if (el.nodeName.toLowerCase() === 'a' && /user.php\?/.test(el.href) && el.firstChild.className === 'taglabel') {
        const userID = el.href.match(/\d+/g)[0];
        userMap.set(el, userID);
      }
    }
    return nodes;
  }

  function filterMediaInfoNodes(nodes) {
    for (const el of nodes) {
      if (el.nodeName.toLowerCase() === 'div') {
        const mediainfo = el.querySelector('div.mediainfo');
        if (mediainfo) {
          mediainfoMap.set(el, mediainfo.innerText);
        }
      }
    }
    return nodes;
  }

  function filterNodes(nodes) {
    nodes = filterFooterNodes(nodes);
    nodes = filterSpoilerNodes(nodes);
    nodes = filterTorrentNodes(nodes);
    nodes = filterUserNodes(nodes);
    nodes = filterMediaInfoNodes(nodes);
    return nodes;
  }

  function getColorValue(style) {
    // check for color:rgba(255,0,0,1.00)
    let regex = /rgba\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*([01]?(\.\d+)?|0?\.\d+|1|0)\s*\)/;
    const match = style.match(regex);
    if (match) {
      let r = parseInt(match[1], 10);
      let g = parseInt(match[2], 10);
      let b = parseInt(match[3], 10);
      let a = parseFloat(match[4]);
      let hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
      if (a < 1) {
        let alphaHex = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
        hex += alphaHex;
      }
      return hex;
    }

    // return color:#FF0000 or color:red
    regex = /color:(#[A-Fa-f0-9]{8}|#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|[a-zA-Z]+)/;
    return style.match(regex)[1];
  }

  function getGradientValue(style) {
    const match = style.match(/gradient\((.+)\)\;/);
    const arr = match[1].split(',');
    for (let i=0; i<=arr.length-4; i++) {
      if (/rgba\(/.test(arr[i])) {
        arr.splice(i, 4, arr.slice(i, i+4).join(','));
      }
    }
    const values = arr.map((el, idx) => {
      if (idx === 0) return el;
      const color = getColorValue('color:' + el);
      const match = el.match(/(?:\d+)%/g);
      if (match) {
        return `${color} ${match.join(' ')}`;
      }
      return color;
    })
    return 'gradient:' + values.join(';');
  }

  function getTableValue(el, style) {
    const values = [];

    if (style) {
      if (/width:/.test(style)) {
        values.push(style.match(/width:\s*(\d*px|\d*\%)/)[1]);
      }
      if (/border:none/.test(style)) {
        values.push('nball');
      }
      if (/color:/.test(style)) {
        values.push(getColorValue(style));
      }
      if (/image:/.test(style)) {
        values.push(style.match(/url\(([^)]+)\)/)[1]);
      }
      if (/gradient/.test(style)) {
        values.push(getGradientValue(style));
      }

      if (/margin: 0px auto 0px 0px/.test(style)) {
        values.push('left');
      } else if (/margin: 0px 0px 0px auto/.test(style)) {
        values.push('right');
      } else if (/margin: 0px auto/.test(style)) {
        values.push('center');
      }
    }

    if (el.className.includes('nopad')) {
      values.push('nopad');
    }

    if (el.className.includes('vat')) {
      values.push('vat');
    } else if (el.className.includes('vam')) {
      values.push('vam');
    } else if (el.className.includes('vab')) {
      values.push('vab');
    }

    return (values.length > 0) ? values.join(',') : null;
  }

  function parseText(el) {
    const node = new Node();
    let text = el.textContent.trim();

    // add [n] on all no parse tags
    text = text.replaceAll('[n]', '[n[n]]')

    // add [n] on all other tags
    const regex = /\[(b|i|u|s|color|font|size|tip|url|anchor|\#|\*|img|hr|br|quote|code|pre|plain|cast|info|plot|screens|user|torrent|article|mediainfo|table|tr|td|bg|tex)(?:=[^\]]+)?\]/g;
    const match = text.match(regex);
    if (match) {
      for (const tag of match) {
        const noParseTag = tag.replace(']', '[n]]');
        text = text.replace(tag, noParseTag);
      }
    }

    node.text = text;
    return node;
  }

  function parseBr(el) {
    const node = new Node();
    node.text = '\n';
    return node;
  }

  function parseHr(el) {
    const node = new Node();
    node.type = 'hr';
    return node;
  }

  function parseStrong(el) {
    const node = new Node();
    node.type = 'b';
    return node;
  }

  function parseEm(el) {
    const node = new Node();
    node.type = 'i';
    return node;
  }

  function parseCode(el) {
    const node = new Node();
    node.type = 'code';
    return node;
  }

  function parseBlockquote(el) {
    const node = new Node();
    if (el.className.includes('spoiler')) {
      node.type = 'spoiler';
      node.value = spoilerMap.get(el);
    } else {
      node.type = 'quote';
    }
    return node;
  }

  function parsePre(el) {
    const node = new Node();
    node.type = 'pre';
    return node;
  }

  function parseLi(el) {
    const node = new Node();
    node.type = '*';
    return node;
  }

  function parseA(el) {
    const node = new Node();
    if (torrentMap.has(el)) {
      node.type = 'torrent';
      node.text = torrentMap.get(el);
    }
    else if (userMap.has(el)) {
      node.type = 'user';
      node.text = userMap.get(el);
    }
    else if (el.className.includes('article')) {
      const articleID = el.href.match(/articles\.php\?topic=(.+)/)[1];
      node.type = 'article';
      node.value = articleID;
    }
    else if (el.className === 'anchor') {
      node.type = '#';
      node.value = el.getAttribute('id');
    }
    else {
      node.type = 'url'
      node.value = el.getAttribute('href').replace('http://anonym.es/?', '');
    }
    return node;
  }

  function parseDiv(el) {
    const node = new Node();
    let style = el.getAttribute('style');
    if (el.className === 'bbcode') {
      node.type = 'bg';
      node.value = getTableValue(el, style);
    }
    else if (/text-align:/.test(style)) {
      let match = style.match(/text-align:\s*([a-zA-Z]+)/);
      node.type = 'align';
      node.value = match[1];
    }
    else if (mediainfoMap.has(el)) {
      node.type = 'mediainfo';
      node.text = mediainfoMap.get(el);
    }
    return node;
  }

  function parseSpan(el) {
    const node = new Node();
    if (el.hasAttribute('class')) {
      let c = el.getAttribute('class');
      if (/size/.test(c)) {
        node.type = 'size';
        node.value = c.match(/size(\d*)/)[1];
      }
      else if (/tooltip/.test(c)) {
        node.type = 'tip';
        node.value = el.getAttribute('title');
      }
    } else {
      let style = el.getAttribute('style');
      if (/color:/.test(style)) {
        node.type = 'color';
        node.value = getColorValue(style);
      }
      else if (/font-family:/.test(style)) {
        node.type = 'font';
        let regex = /font-family:\s*(['"]?)([^,'"]+)\1/;
        let font = style.match(regex)[2];
        switch (font) {
          case 'Helvetica Neue':
            font = 'Helvetica';
            break;
          case 'Palatino':
            font = 'Palatino Linotype'
            break;
          case 'TimesNewRoman':
            font = 'Times New Roman'
            break;
        }
        node.value = font;
      }
      else if (/text-decoration:/.test(style)) {
        let decoration = style.match(/text-decoration:\s*([a-zA-Z-]+)/)[1];
        switch (decoration) {
          case 'line-through':
            node.type = 's';
            break;
          case 'underline':
          default:
            node.type = 'u';
            break;
        }
      }
    }
    return node;
  }

  function parseImg(el) {
    const node = new Node();
    const alt = el.getAttribute('alt');
    if (el.className.includes('image')) {
      const src = el.hasAttribute('src') ? el.getAttribute('src') : el.getAttribute('data-src');
      if (el.className.includes('nopad')) {
        node.type = 'imgnm';
        node.value = (alt != src) ? alt : null;
      }
      else if (el.className.includes('thumb')) {
        node.type = 'thumb'
      }
      else if (alt != src) {
        node.type = 'imgalt'
        node.value = alt;
      }
      else {
        const width = el.getAttribute('width');
        const height = el.getAttribute('height');
        node.type = 'img';
        node.value = (width || height) ? [width, height].join(',') : null;
      }
      node.text = src;
    }
    else {
      node.type = alt;
    }
    return node;
  }

  function parseTable(el) {
    const node = new Node();
    node.type = 'table';
    node.value = getTableValue(el, el.getAttribute('style'));
    return node;
  }

  function parseTr(el) {
    const node = new Node();
    node.type = 'tr';
    node.value = getTableValue(el, el.getAttribute('style'));
    return node;
  }

  function parseTd(el) {
    const node = new Node();
    node.type = 'td';
    node.value = getTableValue(el, el.getAttribute('style'));
    return node;
  }

  function parseDOM(el) {
    let node = null;
    switch (el.nodeName.toLowerCase()) {
      case '#text':
        node = parseText(el);
        break;
      case 'br':
        node = parseBr(el);
        break;
      case 'hr':
        node = parseHr(el);
        break;
      case 'strong':
        node = parseStrong(el);
        break;
      case 'em':
        node = parseEm(el);
        break;
      case 'code':
        node = parseCode(el);
        break;
      case 'blockquote':
        node = parseBlockquote(el);
        break;
      case 'pre':
        node = parsePre(el);
        break;
      case 'li':
        node = parseLi(el);
        break;
      case 'a':
        node = parseA(el);
        break;
      case 'div':
        node = parseDiv(el);
        break;
      case 'span':
        node = parseSpan(el);
        break;
      case 'img':
        node = parseImg(el);
        break;
      case 'table':
        node = parseTable(el);
        break;
      case 'tr':
        node = parseTr(el);
        break;
      case 'td':
        node = parseTd(el);
        break;
      case 'ul':
      case 'tbody':
      default:
        node = new Node();
        break;
    }
    node.children = filterNodes([...el.childNodes]).map(parseDOM);
    return node;
  }

  function buildBBCode(node) {
    let bbcode = '';
    if (node.type) {
      switch (node.type) {
        case 'img':
        case 'imgalt':
        case 'imgnm':
        case 'thumb':
        case 'torrent':
        case 'user':
        case 'mediainfo':
        case 'plain':
          bbcode += (node.value) ? `[${node.type}=${node.value}]` : `[${node.type}]`;
          bbcode += node.text;
          bbcode += `[/${node.type}]`;
          break;
        case 'hr':
        case '*':
        case 'cast':
        case 'details':
        case 'info':
        case 'plot':
        case 'screens':
          bbcode += `[${node.type}]`;
          bbcode += node.children.map(buildBBCode).join('');
          break;
        default:
          bbcode += (node.value) ? `[${node.type}=${node.value}]` : `[${node.type}]`;
          bbcode += node.children.map(buildBBCode).join('');
          bbcode += `[/${node.type}]`;
          break;
      }
    }
    else if (node.text) {
      bbcode += node.text;
    }
    else if (node.children) {
      bbcode += node.children.map(buildBBCode).join('');
    }
    return bbcode;
  }

  function copyBBCode() {
    if (cached === null) {
      const presentationDOM = document.getElementById("descbox");
      const nodes = filterNodes([...presentationDOM.childNodes]).map(parseDOM);
      cached = nodes.map(buildBBCode).join('');
    }
    GM_setClipboard(cached);
  }

  const container = document.querySelector('a[id*="bookmarklink"]').parentElement;
  if (container) {
    let button = document.createElement('a');
    button.textContent = '[Copy BBCode]';
    button.href = 'javascript:void(0)';
    button.addEventListener('click', copyBBCode);
    container.appendChild(button);
  }
})();