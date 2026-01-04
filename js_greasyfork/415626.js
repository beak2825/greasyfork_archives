// ==UserScript==
// @name        forest bot - antineverfate.tk
// @namespace   Violentmonkey Scripts
// @match       http://antineverfate.tk/forest.php*
// @grant       none
// @version     1.0
// @author      -
// @description 11/6/2020, 9:11:40 PM
// @downloadURL https://update.greasyfork.org/scripts/415626/forest%20bot%20-%20antineverfatetk.user.js
// @updateURL https://update.greasyfork.org/scripts/415626/forest%20bot%20-%20antineverfatetk.meta.js
// ==/UserScript==

const ALLOWED_NAVS = [
  "на север",
  "на запад",
  "на восток",
  "на юг",
];
let delay = 200;

try {
  document.querySelector('img[style*="/forest/"]').style.opacity = 0;
} catch (e) {}

// find anticheat
try {
  do {
    let ac = document.querySelector('#anticheat');
    if (!ac) break;
    
    let r = /(\d+)([\-\+])(\d+)=\?/.exec(ac.parentNode.textContent);
    if (!r) throw new Error('Anticheat error, cant read task');

    let [, a, op, b] = r;
    let result = eval(`${a}${op}${b}`);
    console.log(`Anticheat ${a}${op}${b} = ${result}`);
    
    ac.value = result;
    ac.form.submit();
  } while (false);
} catch (e) {
  console.error(e);
}

function emulateClick(element) {
  let event = document.createEvent('Events');
  event.initEvent('click', true, false);
  element.dispatchEvent(event);
}

// find res
try {
  let res = document.querySelector('img[title][onclick*="res="]');
  if (res) {
    console.log(res.title);
    setTimeout(() => emulateClick(res), parseInt(Math.random()*delay + delay));
    delay = 2000;
  }
  
  let navs = document.querySelectorAll('input.btn[onclick]');
  navs = Array.from(navs).filter(el => {
    return !el.disabled
      && ALLOWED_NAVS.includes(el.value.trim().toLowerCase());
  });

  let i = Math.floor(Math.random()*navs.length);
  setTimeout(() => emulateClick(navs[i]), parseInt(Math.random()*delay + delay + 300));

} catch (e) {
  console.error(e);
}

