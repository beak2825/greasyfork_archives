// ==UserScript==
// @name        MiniClock
// @description simple clock for full screen mode
// @version     1.0.0
// @include     *
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @icon        data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @namespace https://greasyfork.org/users/230459
// @downloadURL https://update.greasyfork.org/scripts/375196/MiniClock.user.js
// @updateURL https://update.greasyfork.org/scripts/375196/MiniClock.meta.js
// ==/UserScript==

/*==================================================================================*/
const clockSettings = {
  opacity: '0.6',       // Controls CSS Opacity and needs a value from 0 to 1
  fontSize: '0.6rem',   // Sets the size of the clock.
  is12hour: true,       // Toggles between 24 hour or 12 hour clock.
  font: 'Arial',        // Allow a custom font
}
/*==================================================================================*/

function setStyles(styles) {
  styles.forEach(style => node.style.setProperty(style.name, style.value));
}

function changeOpacity(newOpacity){
  node.style.setProperty('opacity', newOpacity);
}

function updateClock() {
  let date = new Date();
  let time = date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: clockSettings.is12hour
  });
  node.innerHTML = time;
}

function isFullscreen() {
  return (window.fullScreen || 
    (window.innerWidth == screen.width && window.innerHeight == screen.height) || 
    (window.innerWidth >= screen.width && window.innerHeight >= screen.height) || /* Fix for chrome when zoom is < 100%  */
    (!window.screenTop && !window.screenY))
}

let node = document.createElement('div');
let textnode = document.createTextNode('');
node.appendChild(textnode);
setStyles([
  { name: 'position', value: 'fixed' },
  { name: 'bottom', value: '0' },
  { name: 'right', value: '0' },
  { name: 'background-color', value: 'black' },
  { name: 'color', value: 'white' },
  { name: 'z-index', value: '99999' },
  { name: 'font-size', value: clockSettings.fontSize  },
  { name: 'padding', value: '1px 4px' },
  { name: 'border-radius', value: '4px' },
  { name: 'border', value: '1px solid rgba(250, 250, 250, 0.3)' },
  { name: 'margin', value: '2px' },
  { name: 'opacity', value: '0' },
  { name: 'font-family', value: '"' + clockSettings.font + '", sans-serif'  },
  { name: 'text-rendering', value: 'optimizelegibility' },
  { name: 'cursor', value: 'default' },
]);
document.body.appendChild(node);

setInterval(() => updateClock(), 1000);
window.addEventListener('resize', () => changeOpacity((isFullscreen())? clockSettings.opacity : '0'));
node.addEventListener('mouseover', () => changeOpacity('0'));
node.addEventListener('mouseout', () => changeOpacity(clockSettings.opacity));