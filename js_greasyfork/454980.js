
// ==UserScript==
// @name        Helper for AlloggiatiWeb
// @namespace   marcuson
// @description Helpers for Alloggiati Web.
// @match       https://alloggiatiweb.poliziadistato.it/AlloggiatiWeb/SecurityCODS.aspx
// @version     1.2.1
// @author      marcuson
// @license     GPL-3.0-or-later
// @supportURL  https://github.com/marcuson/alloggiatiweb-helpers/issues
// @homepageURL https://github.com/marcuson/alloggiatiweb-helpers
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM.addStyle
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/454980/Helper%20for%20AlloggiatiWeb.user.js
// @updateURL https://update.greasyfork.org/scripts/454980/Helper%20for%20AlloggiatiWeb.meta.js
// ==/UserScript==

(function () {
'use strict';

function downloadObjectAsJson(exportObj, exportName) {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportObj));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

async function askFileToRead() {
  const input = document.createElement('input');
  input.type = 'file';
  const prom = new Promise((res, rej) => {
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = readerEvent => {
        const content = readerEvent.target.result;
        res(content);
      };
      reader.onerror = err => {
        rej(err);
      };
    };
  });
  input.setAttribute('style', 'display:none;');
  document.body.appendChild(input); // required for firefox
  input.click();
  const res = await prom;
  input.remove();
  return res;
}

async function getOpts() {
  return await GM.getValue('options', undefined);
}
async function saveOpts(opts) {
  await GM.setValue('options', opts);
}
function exportOpts(opts) {
  downloadObjectAsJson(opts, 'alloggiatiweb-options');
}
async function importOpts() {
  const optsStr = await askFileToRead();
  const opts = JSON.parse(optsStr);
  return opts;
}

var css_248z = "";

var styles = {"code":"style-module_code__ds1Ud","error":"style-module_error__ABgWN","warning":"style-module_warning__nASzn","success":"style-module_success__ZG5Xf"};
var stylesheet=".style-module_code__ds1Ud{max-width:100px}.style-module_error__ABgWN{color:red}.style-module_warning__nASzn{color:orange}.style-module_success__ZG5Xf{color:green}";

const CODE_ROWS = 4;
const CODE_COLS = 4;
let panel = undefined;
let panelOptions = undefined;
let ocrSpaceApiKeyInput;
// FIXME: Add init based on rows and cols constants
const codeInputs = [[], [], [], []];
async function showOptions() {
  if (panel) {
    return;
  }
  panelOptions = await getOpts();
  if (!panelOptions) {
    // FIXME: Add init based on rows and cols constants
    panelOptions = {
      codes: [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']],
      ocrSpaceApiKey: ''
    };
  }
  ocrSpaceApiKeyInput = VM.m(VM.h("input", {
    type: "text",
    name: "ocrspaceapikey",
    onchange: onOcrSpaceApiKeyChange,
    value: panelOptions.ocrSpaceApiKey
  }));
  const codeInputsFlat = [];
  for (let x = 0; x < CODE_COLS; x++) {
    codeInputsFlat.push(VM.h("br", null));
    for (let y = 0; y < CODE_ROWS; y++) {
      codeInputs[x][y] = VM.m(VM.h("input", {
        class: styles.code,
        type: "text",
        name: `code_${x}_${y}`,
        onchange: onCodeChange,
        value: panelOptions.codes[x][y]
      }));
      codeInputsFlat.push(codeInputs[x][y]);
    }
  }
  panel = VM.getPanel({
    content: VM.m(VM.h("div", null, VM.h("form", null, VM.h("label", {
      for: "ocrspaceapikey"
    }, "OCR space API KEY"), ocrSpaceApiKeyInput, VM.h("br", null), VM.h("label", {
      for: "codes"
    }, "Codes"), codeInputsFlat), VM.h("button", {
      onclick: onSaveBtnClick
    }, "Save"), VM.h("button", {
      onclick: onCancelBtnClick
    }, "Cancel"), VM.h("hr", null), VM.h("button", {
      onclick: onExportBtnClick
    }, "Export"), VM.h("button", {
      onclick: onImportBtnClick
    }, "Import"))),
    style: [css_248z, stylesheet].join('\n')
  });
  writeOptionsIntoInputs();
  panel.wrapper.style.top = '100px';
  panel.wrapper.style.left = '100px';
  panel.show();
}
function onOcrSpaceApiKeyChange(e) {
  e.preventDefault();
  const inp = e.currentTarget;
  panelOptions.ocrSpaceApiKey = inp.value;
}
function onCodeChange(e) {
  e.preventDefault();
  const inp = e.currentTarget;
  const x = inp.name.substring('code_'.length, 'code_'.length + 1);
  const y = inp.name.substring('code_X_'.length, 'code_X_'.length + 1);
  panelOptions.codes[x][y] = inp.value;
}
function onExportBtnClick(e) {
  e.preventDefault();
  exportOpts(panelOptions);
}
async function onImportBtnClick(e) {
  e.preventDefault();
  panelOptions = await importOpts();
  writeOptionsIntoInputs();
}
function writeOptionsIntoInputs() {
  for (let x = 0; x < CODE_COLS; x++) {
    for (let y = 0; y < CODE_ROWS; y++) {
      codeInputs[x][y].value = panelOptions.codes[x][y];
    }
  }
  ocrSpaceApiKeyInput.value = panelOptions.ocrSpaceApiKey;
}
function onCancelBtnClick(e) {
  e.preventDefault();
  closePanel();
}
function closePanel() {
  panel.hide();
  panel.dispose();
  panel = undefined;
  panelOptions = undefined;
}
async function onSaveBtnClick(e) {
  e.preventDefault();
  console.debug('Options to save:', panelOptions);
  await saveOpts(panelOptions);
  closePanel();
}

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

function toast(type, msg, options) {
  const clz = styles[type];
  const st = [(options == null ? void 0 : options.style) || '', css_248z, stylesheet].join('\n');
  return VM.showToast(VM.h("div", {
    class: clz
  }, VM.h("p", null, msg)), _extends({}, options, {
    style: st
  }));
}

const BOXES_LENGTH = 8;
const BOXES_LENGTH_HALF = BOXES_LENGTH / 2;

function getBase64ImagePngFromCanvas(canvas) {
  const dataURL = canvas.toDataURL('image/png');
  return dataURL;
}
function getCanvasFromImg(imgElem) {
  const canvas = document.createElement('canvas');
  canvas.width = imgElem.naturalWidth;
  canvas.height = imgElem.naturalHeight;
  canvas.getContext('2d').drawImage(imgElem, 0, 0);
  return canvas;
}
async function ocr(apiKey, base64Img, ocrEngine) {
  const fd = new FormData();
  fd.append('base64Image', base64Img);
  fd.append('language', 'ita');
  fd.append('scale', 'true');
  fd.append('isTable', 'true');
  fd.append('OCREngine', ocrEngine || '2');
  return await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: {
      apikey: apiKey
    },
    body: fd
  }).then(res => {
    if (!res.ok) {
      throw new Error(`Error during OCR API call: status code ${res.status}.`);
    }
    return res.json();
  }).then(json => json.ParsedResults && json.ParsedResults.length > 0 ? json.ParsedResults[0] : {
    ParsedText: ''
  }).then(r => r.ParsedText);
}

let showOptionsBtn;
let showCorrectCodeBtn;
let correctCodeMsgDiv;
let msgDiv;
function augmentCodesPage() {
  console.info('CODS page of Alloggiati Web detected, inject to DOM');
  addMsgs();
  addButtons();
}
function addButtons() {
  showCorrectCodeBtn = VM.m(VM.h("button", {
    class: "btn btn-primary btn-block center",
    style: "width:70%;",
    onclick: onShowCorrectCodeBtnClick
  }, "Get correct code"));
  showOptionsBtn = VM.m(VM.h("button", {
    class: "btn btn-primary btn-block center",
    style: "width:70%;",
    onclick: onShowOptionsBtnClick
  }, "Options"));
  const title = document.querySelector('#Titolo');
  title.after(showCorrectCodeBtn);
  title.after(showOptionsBtn);
}
function addMsgs() {
  msgDiv = VM.m(VM.h("div", null));
  correctCodeMsgDiv = VM.m(VM.h("div", null));
  const title = document.querySelector('#Titolo');
  title.after(correctCodeMsgDiv);
  title.after(msgDiv);
}
async function onShowCorrectCodeBtnClick(e) {
  console.debug('Show correct code btn clicked');
  e.preventDefault();
  await showCorrectCode();
}
function onShowOptionsBtnClick(e) {
  console.debug('Show options btn clicked');
  e.preventDefault();
  showOptions();
}
function showMsg(msg, divEl) {
  const actualPar = divEl || msgDiv;
  actualPar.textContent = msg;
}
function getEmptyBoxes() {
  const boxes = document.querySelectorAll('.Seccasella.Secp0');
  console.debug('Found boxes:', boxes);
  if (boxes.length !== BOXES_LENGTH) {
    throw new Error(`Boxes is not of length ${BOXES_LENGTH}!`);
  }
  const emptyBoxes = [];
  boxes.forEach((x, i) => {
    if (x.textContent === 'X') {
      return;
    }
    emptyBoxes.push({
      elem: x,
      boxGroupIdx: Math.floor(i / BOXES_LENGTH_HALF),
      groupElementIdx: i % BOXES_LENGTH_HALF
    });
  });
  return emptyBoxes;
}
async function getGroupIds(options) {
  console.debug('Get groups indexes as base64 image');
  const groupsB64 = getBase64ImagePngFromCanvas(getCanvasFromImg(document.querySelector('img.SecGruppi.pointer')));
  const groupsText = await ocr(options.ocrSpaceApiKey, groupsB64);
  console.debug('Parsed text from groups indexes is:', groupsText);
  return groupsText.toLowerCase().replace(/gruppo/g, '').replace(/\r\n/g, ' ').replace(/\s+/g, ' ').trim().split(' ').map(x => parseInt(x));
}
function getCorrectCode(options, groupIds, emptyBoxes) {
  const codesFlat = options.codes.flatMap(x => x);
  return emptyBoxes.map((x, i) => {
    const codeId = groupIds[x.boxGroupIdx];
    const code = codesFlat[codeId - 1];
    console.debug(`Code for emptyBox with index ${i} (codeId ${codeId}) is ${code}`);
    const digit = code.charAt(x.groupElementIdx);
    console.debug(`Digit for index ${i} is ${digit}`);
    return digit;
  });
}
async function showCorrectCode() {
  const options = await getOpts();
  if (!options) {
    toast('error', 'Configure options first!');
    return;
  }
  try {
    showMsg('Getting group ids...');
    const groupIds = await getGroupIds(options);
    console.info('Group ids are:', groupIds);
    showMsg('Getting empty boxes...');
    const emptyBoxes = getEmptyBoxes();
    console.info('Empty boxes info:', emptyBoxes);
    showMsg('Getting correct code...');
    const correctCode = getCorrectCode(options, groupIds, emptyBoxes);
    console.info('Correct code is:', correctCode);
    showMsg(`Correct code is: ${correctCode.join('')}`, correctCodeMsgDiv);
  } catch (e) {
    /** @type {Error} */
    const err = e;
    showMsg('Error: ' + err.message);
    throw e;
  }
}

// import CSS
document.head.append(VM.m(VM.h("style", null, css_248z)));
document.head.append(VM.m(VM.h("style", null, stylesheet)));

// init app
augmentCodesPage();

})();
