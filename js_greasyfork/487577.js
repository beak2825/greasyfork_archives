// ==UserScript==
// @name         Kioskloud Auto Password Decrpter
// @namespace    KKDEC_V1
// @version      1.2
// @description  try to resolve password in kioskloud.
// @author       Laria
// @match        https://kioskloud.io/e/*
// @match        https://kioskloud.xyz/e/*
// @icon         https://i.ibb.co/BZW3cT6/image.webp
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487577/Kioskloud%20Auto%20Password%20Decrpter.user.js
// @updateURL https://update.greasyfork.org/scripts/487577/Kioskloud%20Auto%20Password%20Decrpter.meta.js
// ==/UserScript==
/*
 * == Change log ==
 * 1.0 - Release
 * 1.1 - await password validation, show result when decrypt failed
 * 1.2 - improve internal logic
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
const kapdConstDB = {
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
  //try to resolve decrypt time interval, def:1
  timeInterval: 1,
  logPrompt: {
    default: '['+GM.info.script.namespace+']',
  },
};

//script internal db
let kapdInternalDB = {
  elements: { //define after load
    container: null,
    confirmButton: null,
    inputModal: null,
    valiateMessage: null,
  },
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
async function tryToDecrypt(inputPassword) {
  //fill password field
  kapdInternalDB.elements.inputModal.value=inputPassword;
  //remove modal valid msg
  await kapdInternalDB.elements.inputModal.dispatchEvent(new Event('input', {
    view: window,
    bubbles: true,
    cancelable: true
  }));
  //click confirm
  await kapdInternalDB.elements.confirmButton.click();
}

//await validation
function waitForValidation() {
  if(kapdInternalDB.elements.valiateMessage.style.display == 'flex') return;
  return delay(1).then(waitForValidation);
}

//decrypt procedure
async function decrypt() {
  //main process
  let tryCount = 0;
  const startTime = performance.now();
  //loop in password dict
  for (let i = 0; i < kapdConstDB.passwordDict.length; i++) {
    //if not first, await validation
    if (i > 0) await waitForValidation();
    window.console.log(kapdConstDB.logPrompt.default, 'no.', i, ', try:', kapdConstDB.passwordDict[i]);
    await delay(kapdConstDB.timeInterval);
    await tryToDecrypt(kapdConstDB.passwordDict[i]);
    //correct password
    if (document.querySelector('.swal2-container') == null) {
      const endTime = performance.now();
      const durationSec = parseFloat((Math.ceil((endTime-startTime) * 100) / 100000).toFixed(2));
      window.console.log(kapdConstDB.logPrompt.default, 'decrypt finished.');
      window.console.log(kapdConstDB.logPrompt.default, 'expected password :', kapdConstDB.passwordDict[i]);
      window.console.log(kapdConstDB.logPrompt.default, 'tries:', tryCount, ', duration:', durationSec, 'sec');
      return;
    }
    tryCount ++;
  }
  const endTime = performance.now();
  const durationSec = parseFloat((Math.ceil((endTime-startTime) * 100) / 100000).toFixed(2));
  //if resolve failed,
  window.console.log(kapdConstDB.logPrompt.default, 'cannot find password in dict..');
  window.console.log(kapdConstDB.logPrompt.default, 'tries:', tryCount, ', duration:', durationSec, 'sec');
  //replace first dict password, show summary, focus input area
  await delay(100);
  kapdInternalDB.elements.inputModal.value = kapdConstDB.passwordDict[0];
  await delay(20);
  kapdInternalDB.elements.valiateMessage.innerHTML = `<div><b>Auto Decryption Failed</b><br><i style="font-size: 82.5%;">Please input manually..</i><br><span style="font-size: 78.5%;">( tries: ${tryCount}, dur: ${durationSec} sec )</span></div>`;
  await kapdInternalDB.elements.inputModal.focus();
}

//register elements
function registerElements() {
  kapdInternalDB.elements.container = document.querySelector('.swal2-container');
  kapdInternalDB.elements.confirmButton = kapdInternalDB.elements.container.querySelector('.swal2-confirm');
  kapdInternalDB.elements.inputModal = kapdInternalDB.elements.container.querySelector('.swal2-input');
  kapdInternalDB.elements.valiateMessage = kapdInternalDB.elements.container.querySelector('#swal2-validation-message');
}

async function rootProcedure() {
  window.console.log(kapdConstDB.logPrompt.default,'V',GM.info.script.version, '-', GM.info.script.name);
  window.console.log(kapdConstDB.logPrompt.default, 'wait modal..');
  //await confirm button
  await waitForElm('.swal2-confirm');
  window.console.log(kapdConstDB.logPrompt.default,'modal loaded, decrypt ready');
  //register modal elements
  registerElements();
  //decrypt start
  await decrypt();
  window.console.log(kapdConstDB.logPrompt.default,'task finished.');
}

window.addEventListener('load', () => setTimeout(rootProcedure, 100));
