// ==UserScript==
// @name        MegaCloud Auto Password Decrypter
// @namespace   MGDEC_V1
// @version     1.0
// @description try to resolve password in mega cloud
// @author      Laria
// @match       https://mega.nz/#P*
// @match       https://mega.io/#P*
// @icon        https://mega.nz/favicon.ico?v=3
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/487613/MegaCloud%20Auto%20Password%20Decrypter.user.js
// @updateURL https://update.greasyfork.org/scripts/487613/MegaCloud%20Auto%20Password%20Decrypter.meta.js
// ==/UserScript==
/*
 * == Change log ==
 * 1.0 - Release
*/

//utility
const currentDate = new Date();
function zeroPad(num, numZeros) {
    var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    if( num < 0 ) {
        zeroString = '-' + zeroString;
    }
    return zeroString+n;
}

//script const db
const mapdConstDB = {
  //password dictionary, input common password or your own password
  //you must change here.
  passwordDict: [
    'password01',
    'password02',
    'password03',
    'password04',
    'password05',
    'password06',
  ],
  //try to resolve decrypt time interval, def:50
  timeInterval: 50,  //logging prefix
  logPrompt: {
    default: '['+GM.info.script.namespace+']',
  },
};

//script internal db
let mapdInternalDB = {
  elements: { //define after load
    container: null,
    passwordVisible: null,
    inputArea: null,
    decryptButton: null,
    megaBanner: null,
    decryptionProgress: null,
  },
  isValidation: false,
};

//utility 2

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

//https://stackoverflow.com/questions/5525071
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

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

//input given password and resolve it
async function tryToDecrypt(pwd) {
  //remove modal valid msg
  await mapdInternalDB.elements.inputArea.dispatchEvent(new Event('input'));
  //fill password field
  mapdInternalDB.elements.inputArea.value = pwd;
  //click confirm
  await mapdInternalDB.elements.decryptButton.click();
}

//await validation
async function waitForValidation() {
  let timeCnt = 0;
  while(mapdInternalDB.isValidation) {
    if (timeCnt > 100) break;
    timeCnt ++;
    await delay(mapdConstDB.timeInterval);
  }
}

//decrypt procedure
async function decrypt() {
  //mutation observer - decrypt process
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mapdInternalDB.isValidation = !mutation.target.classList.contains('hidden');
    });
  });

  observer.observe(mapdInternalDB.elements.decryptionProgress, {
    attributes: true,
  });

  //pre-process
  await delay(50);
  //remove view
  await mapdInternalDB.elements.passwordVisible.click();
  //remove default input message
  mapdInternalDB.elements.inputArea.dispatchEvent(new Event('focus'));

  //main process
  let tryCount = 0;
  const startTime = performance.now();
  for (let i = 0; i < mapdConstDB.passwordDict.length; i++) {
    window.console.log(mapdConstDB.logPrompt.default, 'no.', i, ', try:', mapdConstDB.passwordDict[i]);
    await tryToDecrypt(mapdConstDB.passwordDict[i]);
    if (i > 0) await waitForValidation();
    //correct password
    if (mapdInternalDB.elements.container.classList.contains('hidden')) {
      const endTime = performance.now();
      const durationSec = parseFloat((Math.ceil((endTime-startTime) * 100) / 100000).toFixed(2));
      window.console.log(mapdConstDB.logPrompt.default, 'decrypt finished.');
      window.console.log(mapdConstDB.logPrompt.default, 'expected password :', mapdConstDB.passwordDict[i]);
      window.console.log(mapdConstDB.logPrompt.default, 'tries:', tryCount, ', duration:', durationSec, 'sec');
      return;
    }
    tryCount ++;
  }
  const endTime = performance.now();
  const durationSec = parseFloat((Math.ceil((endTime-startTime) * 100) / 100000).toFixed(2));
  //if resolve failed,
  window.console.log(mapdConstDB.logPrompt.default, 'cannot find password in dict..');
  window.console.log(mapdConstDB.logPrompt.default, 'tries:', tryCount, ', duration:', durationSec, 'sec');
  //replace first dict password, show summary, focus input area
  await delay(50);
  mapdInternalDB.elements.inputArea.value = mapdConstDB.passwordDict[0];
  await delay(20);
  mapdInternalDB.elements.megaBanner.innerHTML = `<div><b>Auto Decryption Failed</b><br><i style="font-size: 82.5%;">Please input manually..</i><br><span style="font-size: 78.5%;">( tries: ${tryCount}, dur: ${durationSec} sec )</span></div>`;
  await mapdInternalDB.elements.inputArea.focus();

}

//register elements
function registerElements() {
  mapdInternalDB.elements.container = document.querySelector('.password-dialog');
  mapdInternalDB.elements.passwordVisible = mapdInternalDB.elements.container.querySelector('.pass-visible');
  mapdInternalDB.elements.inputArea = mapdInternalDB.elements.container.querySelector('#password-decrypt-input');
  mapdInternalDB.elements.decryptButton = mapdInternalDB.elements.container.querySelector('.decrypt-link-button');
  mapdInternalDB.elements.megaBanner = mapdInternalDB.elements.container.querySelector('.mega-banner');
  mapdInternalDB.elements.decryptionProgress = mapdInternalDB.elements.container.querySelector('.decryption-in-progress');
}

async function rootProcedure() {
  window.console.log(mapdConstDB.logPrompt.default,'V',GM.info.script.version, '-', GM.info.script.name);
  window.console.log(mapdConstDB.logPrompt.default, '- wait modal..');
  //await password modal
  await waitForElm('.password-dialog');
  window.console.log(mapdConstDB.logPrompt.default,'modal loaded, decrypt ready');
  //register modal elements
  registerElements();
  //decrypt start
  await decrypt();
  window.console.log(mapdConstDB.logPrompt.default,'task finished.');
}

window.addEventListener('load', () => setTimeout(rootProcedure, 100));
