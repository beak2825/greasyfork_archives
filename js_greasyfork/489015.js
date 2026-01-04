// ==UserScript==
// @name         TypingCLub Auto Typer
// @namespace    http://tampermonkey.net/
// @description  A Typing Club Auto Typer
// @match        https://www.typingclub.com/sportal/*
// @version 0.0.1.20240304214132
// @downloadURL https://update.greasyfork.org/scripts/489015/TypingCLub%20Auto%20Typer.user.js
// @updateURL https://update.greasyfork.org/scripts/489015/TypingCLub%20Auto%20Typer.meta.js
// ==/UserScript==

/**
 * This script types for you automatically on www.typingclub.com:
 * 1. Open the website
 * 2. Blaze past the tutorials
 * 3. Go into a level
 * 4. Open Console
 * 5. Paste the script and press ENTER
 */

// NOTE: When delay (in ms between two strokes) is too low, the site might bug out and the result page will not be shown
const minDelay = 190;
const maxDelay = 190;



const keyOverrides = {
  [String.fromCharCode(160)]: ' '    // convert hardspace to normal space
};

function getTargetCharacters() {
  const els = Array.from(document.querySelectorAll('.token span.token_unit'));
  const chrs = els
    .map(el => {
      // get letter to type from each letter DOM element
      if (el.firstChild?.classList?.contains('_enter')) {
        // special case: ENTER
        return '\n';
      }
      let text = el.textContent[0];
      return text;
    })
    .map(c => keyOverrides.hasOwnProperty(c) ? keyOverrides[c] : c); // convert special characters
  return chrs;
}

function recordKey(chr) {
  // send it straight to the internal API
  window.core.record_keydown_time(chr);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function autoPlay(finish) {
  const chrs = getTargetCharacters();
  for (let i = 0; i < chrs.length - (!finish); ++i) {
    const c = chrs[i];
    recordKey(c);
    //console.log(c, c.charCodeAt());
    await sleep(Math.random() * (maxDelay - minDelay) + minDelay);
  }
}

// ############################################################################################################
// old utilities
// ############################################################################################################


// /**
//  * @see https://stackoverflow.com/questions/8942678/keyboardevent-in-chrome-keycode-is-0/12522752#12522752
//  */
// function simulateKey(chr, el) {
//   _simulateKey(chr, 'keydown', el);
//   _simulateKey(chr, 'keypress', el);
// }
// function _simulateKey(chr, type, el) {
//   var eventObj = document.createEventObject ?
//     document.createEventObject() : document.createEvent("Events");

//   if (eventObj.initEvent) {
//     eventObj.initEvent(type || "keydown", true, true);
//   }

//   let keyCode = chr.charCodeAt(0);

//   eventObj.key = chr[0];
//   eventObj.keyCode = keyCode;
//   eventObj.which = keyCode;
//   eventObj.isTrusted = true;

//   el = el || document.body;

//   // console.log(keyCode, eventObj);

//   el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj); 
// }

// document.addEventListener("keydown", function (e) {
//   console.log('down', e);
// });
// document.addEventListener("keypress", function (e) {
//   console.log('press', e);
// });
//$($('.menu-btn')[0].parentNode).prepend('<button onclick=\'simulateKeyPress("c")\'>sim</button>');
// simulateKey('a', $('input')[0]);



// ############################################################################################################
// go!
// ############################################################################################################

autoPlay(true);