// ==UserScript==
// @name         Zen Mode for CHYOA
// @namespace    https://sleazyfork.org/en/users/55535-sllypper
// @version      1.0.1
// @description  Hide the sidebar and center the text. Click to toggle Zen Mode. You can also use the hotkey ALT+Z
// @author       sllypper
// @match        *://chyoa.com/chapter/*
// @match        *://chyoa.com/story/*
// @icon         https://chyoa.com/favicon.png
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/425599/Zen%20Mode%20for%20CHYOA.user.js
// @updateURL https://update.greasyfork.org/scripts/425599/Zen%20Mode%20for%20CHYOA.meta.js
// ==/UserScript==

'use strict';

const transitionDuration = '1s'
const automaticallyOnScrollingDownABit = false

const style = toStyleStr({
    'transition': 'cubic-bezier(.34,.34,.3,1.02) transform '+transitionDuration,
    'box-shadow': 'none !important',
    'transform': 'translateX(0px)',
}, '#content > div:first-child') +
      toStyleStr({
          'transform': 'translateX(190px)',
      }, '#content.zen > div:first-child') +
      toStyleStr({
          'transition': 'cubic-bezier(.34,.34,.3,1.02) transform '+transitionDuration+', ease opacity '+transitionDuration,
          'position': 'fixed !important',
          'opacity': 1,
          'transform': 'none',
      }, '#content .sidebar') +
      toStyleStr({
          'position': 'fixed',
          'opacity': 0,
          'transform': 'translateX(190px)',
          'z-index': '-1',
      }, '#content.zen .sidebar');

addStyle(style)

const mastHeadEl = document.getElementById('masthead')
const contentEl = document.getElementById('content')

if (GM_getValue('zen')) { makeZen() }

if (automaticallyOnScrollingDownABit) {
    document.addEventListener('scroll', (event) => {
        const y = window.scrollY
        if (window.scrollY > mastHeadEl.scrollHeight) makeZen();
        else makeNotZen()
    })
}

document.addEventListener('keydown', (event) => {
    if (event.code == 'KeyZ' && event.altKey == true) toggleZen()
})

zbox()

function zbox(){
    const z = document.createElement('button')
    const b = '26px'
    z.setAttribute('style', toStyleStr({
        'border': '1px solid #666',
        'background': '#333',
        'position': 'fixed',
        'left': '10px',
        'bottom': '10px',
        // 'width': b,
        'height': b,
        'line-heigh': b,
        'color': '#ccc',
        'padding': '0 8px',
    }))
    z.setAttribute('title', "ALT+Z")
    z.onclick = toggleZen
    z.textContent = 'Zen'
    document.body.appendChild(z)
}

let zen = false
function toggleZen() {
    if (zen) makeNotZen()
    else makeZen()
    zen = !zen
}

function makeZen(){
    contentEl.setAttribute('class', 'zen')
    GM_setValue('zen', 1)
    // let classes = contentEl.getAttribute('class')
    // classes = classes.split(' ')
    // const pos = classes.findIndex(a=>a=='zen')
    // if (pos === -1) {
    //     classes.push('zen')
    //     contentEl.setAttribute('class', classes.join(" "))
    //     return 1
    // }
    // return 0
}

function makeNotZen() {
    contentEl.setAttribute('class', null)
    GM_setValue('zen', 0)
    // let classes = contentEl.getAttribute('class')
    // classes = classes.split(' ')
    // const pos = classes.findIndex(a=>a=='zen')
    // if (pos) {
    //     classes = classes.splice(0, pos);
    //     contentEl.setAttribute('class', classes.join(" "))
    //     return 1
    // }
    // return 0
}

// function addStyle(replace = true) {
function addStyle() {
    let styleEl = document.createElement('style');
    document.head.appendChild(styleEl);
    var css = [].slice.call(arguments).join('\n');
    // if(replace) {
        styleEl.textContent = css;
    // } else {
        // styleEl.textContent += css;
    // }
}


function toStyleStr(obj, selector) {
  var stack = [],
      key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      stack.push(key + ':' + obj[key]);
    }
  }
  if (selector) {
    return selector + '{' + stack.join(';') + '}';
  } else {
    return stack.join(';');
  }
};
