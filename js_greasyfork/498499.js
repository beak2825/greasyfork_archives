// ==UserScript==
// @name   Vietphrase converter
// @name:vi  convert kiểu Vietphrase
// @namespace  VP
// @version  1.0.3
// @description The userscript converts chinese novel webpage to Vietphrase format to read on web browser 
// @description:vi convert kiểu Vietphrase để đọc truyện trực tiếp trên web
// @author you
// @match  http*://*/*
// @grant  GM_setValue
// @grant  GM_getValue
// @run-at   document-idle
// @downloadURL https://update.greasyfork.org/scripts/498499/Vietphrase%20converter.user.js
// @updateURL https://update.greasyfork.org/scripts/498499/Vietphrase%20converter.meta.js
// ==/UserScript==

let Options = GM_getValue('Options', {
  Ngoac: false,
  Motnghia: true,
  daucach: ';',
  DichLieu: true,
  useSP: false,
  font: 'Roboto',
  whiteList: []   //[{host:string,leftRight:boolean, noButton:boolean},{}...]
});

let dictNames = GM_getValue('dictNames', undefined);
let dictVP = GM_getValue('dictVP', undefined);
let dictPA = GM_getValue('dictPA', undefined);
let dictSP = GM_getValue('dictSP', undefined);

let tmpDictPA;
let tmpDictVP;
let tmpDictNames;
let tmpDictSP;

function findNonInline(el) {
  for (let i = el; i != null; i = i.parentElement) {
    if (i.tagName == 'IMG' || i.tagName == 'VIDEO') return false;
    el = i;
    if (window.getComputedStyle(i)['display'] != 'inline') break;
  }
  return el;
}

//https://github.com/lilydjwg/text-reflow-we
function reFlow(e) {
  const sideMargin = 10
  const winWidth = window.visualViewport.width
  let target = findNonInline(e.target);
  if (!target) return;
  const bbox = target.getBoundingClientRect()

  // if box is wider than screen, reset width to make it fit
  if (bbox.width > winWidth) {
    const newWidth = winWidth - (2 * sideMargin)
    target.style.width = newWidth + 'px'
    target.__reflowed = true
  } else if (target.__reflowed) { // don't remove width set by the page itself
    target.style.width = ''
    target.__reflowed = false
  }
}

function isOverflow(el) { return el.scrollHeight > el.clientHeight || el.scrollWidth > el.clientWidth; }
function reflow(el) {
  const smallestSize = 12;
  let count = 1;
  let computedStyle;
  do {
    count++;
    computedStyle = getComputedStyle(el)
    fontSize = parseInt(computedStyle.fontSize.slice(0, -2));
    fontSize = fontSize * .95;
    el.style.fontSize = fontSize + 'px';
  } while (isOverflow(el) && fontSize > smallestSize && count < 10)
}

function sortSP(a, b) {
  let cmp = { 'V': 2, 'N': 3 }
  let aM = a.match(/{\d}|{N\d?}|{V\d?}/g);
  let bM = b.match(/{\d}|{N\d?}|{V\d?}/g);
  if (aM.length > bM.length) return -1;
  if (aM.length < bM.length) return 1;
  let aS = aM.reduce((s, e) => s += cmp[e.charAt(0)] ?? 0, 0);
  let bS = bM.reduce((s, e) => s += cmp[e.charAt(0)] ?? 0, 0);
  if (aS > bS) return -1;
  if (aS < bS) return 1;
  return b.length - a.length || a.localeCompare(b);
}

function str2Dict(str) {
  let dict = {};
  str.trim().split(/\r\n|\r|\n/).forEach(line => {
    if (/^(\/\/|#|=)/.test(line)) return; //ghi chu
    let [org, trans] = line.split('=');
    if (!org || !trans) return;
    dict[org] = trans.trim();
  })
  return dict
}

function transPA(str) {
  return str.split('').reduce((s, c) => s += dictPA.trans[c] ? (' ' + dictPA.trans[c]) : c, '');
}

function transVP(str, Ngoac = true, Motnghia = false, daucach = ';', DichLieu = false) {
  const _magic = ''; //'\uf0f3'
  if (dictNames) dictNames.org?.forEach(el => str.replaceAll(el, ' ' + dictNames.trans[el]));
  if (!dictVP || !dictPA) return str;
  let result = '';
  const maxLength = dictVP.org[0]?.length;
  const dichlieu = ['的', '了', '着'];
  for (let i = 0; i < str.length; i++) {
    for (let j = maxLength; j > 0; j--) {
      let subStr = str.slice(i, i + j);
      let VP = dictVP.trans[subStr];
      if (typeof VP === 'string' && VP.length > 0) {
        if (Motnghia) VP = VP.split(daucach)[0];
        if (Ngoac) VP = `[${VP.trim()}]`;//Sometimes VP.trim() got error because no trim property/function in VP???
        result += ' ' + VP;
        str.replace(subStr, _magic.repeat(subStr.length));
        i += j;
      }
      if (j == 1) {
        if (DichLieu && dichlieu.includes(str.charAt(i))) continue;
        result += dictPA.trans[str.charAt(i)] ? (' ' + dictPA.trans[str.charAt(i)]) : str.charAt(i);
        str.replace(str.charAt(i), _magic);
      }
    }
  }
  return result.replaceAll(/[ ]+/g, ' ');
}

function transSP1(str) {
  const regNumber = /{\d}/g
  if (dictSP.org == undefined) return false;
  dictSP.org.forEach(sp => {
    let aC = sp.match(regNumber);
    let vC = new RegExp(sp.replaceAll(regNumber, '[\\p{sc=Han}、，,0-9]+'), 'ug');
    let vV = dictSP.trans[sp];
    aC.forEach(ac => vV = vV.replace(ac, `$${aC.indexOf(ac) + 1}`));
    str.replaceAll(vC, `<${vV}>`);
  })
}
const transSP = transSP1;

function translateNode(rootNode) {
  let nodeArr = [];
  let nodesText = '';
  const limiter = ''.repeat(2); //'\uf0f5'

  function nodeToArr(node) {
    if (node.nodeType == 3) {
      nodeArr.push(node);
      nodesText += node.textContent + limiter;
    }
    node.childNodes.forEach(childNode => nodeToArr(childNode))
  }

  nodeToArr(rootNode);
  let translated = transVP(nodesText, Options.Ngoac, Options.Motnghia, Options.daucach, Options.DichLieu);
  if (translated.length > 25000) {
    translated.split(limiter).forEach((text, index) => {
      if (nodeArr[index] == undefined) return;
      nodeArr[index].textContent = text;
    });
    if (Options.font)
      document.body.setAttribute('style', `font-family: ${Options.font} !important;`);
  }
  else {
    translated.split(limiter).forEach((text, index) => {
      if (nodeArr[index] == undefined) return;
      nodeArr[index].textContent = text;
      if (Options.font) nodeArr[index].parentElement ? nodeArr[index].parentElement.style = `font-family: ${Options.font} !important` : '';

      let el = findNonInline(nodeArr[index].parentElement);
      if (!el.hasAttribute('reflow') && isOverflow(el)) {
        reflow(el);
        el.style.overflow = 'hidden';
        el.setAttribute('reflow', "");
        for (c of el.children) {
          let fS = parseInt(getComputedStyle(c).fontSize.slice(0, -2));
          if (fS < 12) c.style.fontSize = '12px';
        }
      }
    });
  }
}

async function fileLoad(event) {
  let txt = '';
  let tmp;
  if (event.target.files[0]) txt = await event.target.files[0].text(); else return false;
  switch (event.target.id) {
    case 'fPA':
      tmpDictPA = {};
      tmpDictPA.trans = str2Dict(txt); break;

    case 'fVP':
      tmpDictVP = {};
      tmpDictVP.trans = str2Dict(txt);
      tmpDictVP.org = [];
      tmpDictVP.org[0] = Object.keys(tmpDictVP.trans).toSorted((a, b) => b.length - a.length || a.localeCompare(b))[0] ?? '';
      break;

    case 'fNames':
      tmpDictNames = {};
      tmpDictNames.trans = str2Dict(txt);
      tmpDictNames.org = Object.keys(tmpDictNames.trans).toSorted((a, b) => b.length - a.length || a.localeCompare(b));
      break;

    case 'fSP':
      tmpDictSP = {};
      tmpDictSP.trans = str2Dict(txt);
      tmpDictSP.org = Object.keys(tmpDictSP.trans).toSorted(sortSP);
      break;
  }
}

function addNewSite(ev) {
  const me = ev.target;
  const match = me.matches('#usDialog li:last-of-type>input[type="text"]');
  if (!me.value && match)
    return;
  if (!me.value && !match)
    me.parentElement.remove();
  if (me.value && match)
    document.querySelector('#usDialog ul').insertAdjacentHTML('beforeend', `
        <li><input type="text"> Trái <label><input type="checkbox" checked></label> Phải | <input type="checkbox"> Xóa nút</li>`);
  document.querySelector('#usDialog li:last-of-type>input[type="text"]').addEventListener("change", addNewSite);
}

(async function () {
  'use strict';
  if (window.self != window.top) return;
  if (Options.blackList?.split(/[,;]/).some(e => e.trim() && window.location.host.includes(e.trim()))) return;
  document.addEventListener('click', reFlow);
  const auto = Options.whiteList.filter(e => window.location.host.includes(e.host));
  if (auto.length > 0) {
    if (auto[0].leftRight) rightFunc(); else leftFunc();
    if (auto[0].noButton) {
      if (auto[0].leftRight) {
        const observer = new MutationObserver((mL) => {
          for (const mo of mL)
            for (const addNode of mo.addedNodes) translateNode(addNode);
        });
        observer.observe(document.body, { childList: true, subtree: true });
      }
      return;
    }
  }

  document.body.insertAdjacentHTML('beforeend', `
    <style>
      div.usButton {
        display: flex;
        position: fixed;
        top: 1%;
        right: 1%;
        margin: 0;
        padding: 0;
        border: thin;
        z-index: 9999;
      }
     
      div.usButton>button {
        height: 90%;
        border: none;
        margin: 0;
        text-align: right;
      }
     
      div.usButton>button:first-child {
      padding: 5px 0px 5px 5px;
      }
     
      div.usButton>button:last-child {
        padding: 5px 2px 5px 0px;
      }
     
      div.usButton>button:nth-child(2) {
        padding: 5px 2px 5px 0px;
      }
     
      dialog#usDialog {
        border: none;
        border-radius: .3rem;
        font-family: Arial;
        padding: .3rem;
        margin: auto;
        min-width: 20rem;
        width: fit-content;
        display: revert;
      }
     
      #usDialog>div {
        display: flex;
        justify-content: space-around;
      }
     
      #usDialog label:has(#cbMotnghia)+label {
        display: none;
      }
     
      #usDialog label:has(#cbMotnghia:checked)+label {
        display: unset;
      }
     
      #usDialog nav>label {
        width: 4.5rem;
        display: inline-block;
        border-radius: 3px 3px 0px 0px;
        border: 1px solid black;
        border-bottom: none;
        text-align: center;
      }
     
      #usDialog nav>label:has(input[type="radio"]:checked) {
        font-weight: 700;
      }
     
      #usDialog input[type="radio"] {
        width: 0px;
        height: 0px;
        display: none;
      }
     
      #usDialog fieldset {
        display: none;
        min-height: 14rem;
        text-align: left;
        min-width:fit-content;
      }
     
      #usDialog input[type="text"] {
        border: 1px solid black;
        padding:0;
      }
     
      #usDialog textarea {
        border: 1px solid black;
      }
     
      #usDialog nav:has(#rdTudien:checked)~fieldset:nth-child(2) {
        display: block;
      }
     
      #usDialog nav:has(#rdDich:checked)~fieldset:nth-child(3) {
        display: block;
      }
     
      #usDialog nav:has(#rdTudong:checked)~fieldset:nth-child(4) {
        display: grid;
      }
     
      #usDialog ul {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
        max-height: 6rem;
        overflow-y: scroll;
      }
     
      #usDialog li {
        display: unset;
        padding: 0;
        margin: 0;
        display:block;
      }
     
      #usDialog li>label {
        display: inline-block;
        position: relative;
        border-radius: 1em;
        width: 2em;
        height: 1em;
        background-color: pink;
      }
     
      #usDialog li>label:has(input[type="checkbox"])::before {
        content: '';
        display: unset;
        position: absolute;
        left: .15em;
        top: .1em;
        border-radius: 50%;
        width: .8em;
        height: .8em;
        background-color: rgb(193, 6, 245);
      }
     
      #usDialog li>label:has(input[type="checkbox"]:checked)::before {
        display: none;
      }
     
      #usDialog li>label:has(input[type="checkbox"])::after {
        display: none;
      }
     
      #usDialog li>label:has(input[type="checkbox"]:checked)::after {
        content: '';
        display: unset;
        position: absolute;
        border-radius: 50%;
        right: .15em;
        top: .1em;
        width: .8em;
        height: .8em;
        background-color: green;
      }
     
      #usDialog li>label>input[type="checkbox"] {
        width: 0px;
        height: 0px;
        display: none;
      }
     
      #usDialog button{
        min-width:fit-content;
        width: 4rem;
      }
    </style>
    <div class="usButton">
      <button>Tran</button>
      <button>slate</button>
      <button>↓</button>
    </div>
    <dialog id="usDialog" spellcheck="false" lang="vie">
      <nav>
        <label id="tudien"><input type="radio" name="groupby" id="rdTudien" checked>Từ điển</label>
        <label id="cachdich"><input type="radio" name="groupby" id="rdDich">Dịch</label>
        <label id="tudong"><input type="radio" name="groupby" id="rdTudong">Tự động</label>
      </nav>
      <fieldset>
        <label for="fPA">Phiên Âm&nbsp;&nbsp;&nbsp;<input type="file" id="fPA"></label><br />
        <label for="fVP">Vietphrase&nbsp;<input type="file" id="fVP"></label><br />
        <label for="fNames">Names&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="file" id="fNames"></label><br />
        <label for="fSP">Strucphrase<input type="file" id="fSP"></label><br />
      </fieldset>
      <fieldset>
        <label for="cbNgoac"><input type="checkbox" id="cbNgoac"> Dùng [ngoặc]</label><br />
        <label for="cbMotnghia"><input type="checkbox" id="cbMotnghia"> Một nghĩa</label>
        <label for="txtdaucach">, dấu cách nghĩa<input type="text" id="txtdaucach" size="1" maxlength="1"></label><br />
        <label for="cbDichLieu"><input type="checkbox" id="cbDichLieu"> Xóa "đích, liễu, trứ"</label><br />
        <label for="cbSP"><input type="checkbox" id="cbSP"> Dùng Strucphrase</label><br />
      </fieldset>
      <fieldset>
        <label for="txtfont" style="width:100%">Font thay thế: </label><input type="text" id="txtfont">
        <label for="txtWL" style="width:100%">Các site tự chạy: </label>
        <ul>
        </ul>
        <label for="txtBL" style="width:100%">Bỏ qua các tên miền chứa các chuỗi cách nhau bằng , ;</label>
        <textarea id="txtBL">.vn;</textarea>
      </fieldset>
      <div>
        <button>OK</button>
        <button>Cancel</button>
      </div>
    </dialog>`);

  const dialog = document.querySelector('dialog#usDialog');

  function leftFunc() {
    document.title = transPA(document.title);
    document.body.innerHTML = transVP(document.body.innerHTML, Options.Ngoac, Options.Motnghia, Options.daucach, Options.DichLieu);
    if (Options.font)
      document.body.setAttribute('style', `font-family: ${Options.font} !important;`);
  }

  function rightFunc() {
    document.title = transPA(document.title);
    translateNode(document.body);
  }

  document.querySelector('.usButton button:first-child').onclick = leftFunc;
  document.querySelector('.usButton button:nth-child(2)').onclick = rightFunc;

  document.querySelector('.usButton button:last-child').onclick = () => { // Menu ↓ button
    tmpDictPA = undefined;
    tmpDictVP = undefined;
    tmpDictNames = undefined;
    tmpDictSP = undefined;
    if (dialog.open) dialog.close();

    Options = GM_getValue('Options', Options); //sync Options across tabs
    dialog.querySelectorAll('input[type="file"]').forEach(el => el.value = null);

    dialog.querySelector('#cbNgoac').checked = Options.Ngoac;
    dialog.querySelector('#cbMotnghia').checked = Options.Motnghia;
    dialog.querySelector('#cbDichLieu').checked = Options.DichLieu;
    dialog.querySelector('#cbSP').checked = Options.useSP;
    dialog.querySelector('#txtdaucach').value = Options.daucach ?? ';';
    dialog.querySelector('#txtfont').value = Options.font ?? '';

    const ul = dialog.querySelector('ul');
    ul.innerHTML = '';
    [...Array.isArray(Options.whiteList) ? Options.whiteList : []].forEach(el => {
      if (!el || !el.host) return;
      ul.insertAdjacentHTML('beforeend', `
        <li><input type="text" value="${el.host}" > Trái <label><input type="checkbox" ${el.leftRight ? 'checked' : ''}></label> Phải | <input type="checkbox" ${el.noButton ? 'checked' : ''}> Xóa nút</li>`);
    });

    dialog.querySelector('ul').insertAdjacentHTML('beforeend', `
        <li><input type="text"> Trái <label><input type="checkbox" checked></label> Phải | <input type="checkbox"> Xóa nút</li>`);
    dialog.querySelectorAll('li input[type="text"]').forEach(el => el.addEventListener('change', addNewSite));

    dialog.querySelector('#txtBL').value = Options.blackList ?? '';
    dialog.showModal();
  }

  dialog.querySelectorAll('input[type="file"]').forEach(el => el.onchange = fileLoad);

  dialog.querySelector('div>button').onclick = () => {  //OK button
    if (tmpDictPA != undefined) {
      dictPA = tmpDictPA;
      GM_setValue('dictPA', dictPA)
    }

    if (tmpDictVP != undefined) {
      dictVP = tmpDictVP;
      GM_setValue('dictVP', dictVP)
    }

    if (tmpDictNames != undefined) {
      dictNames = tmpDictNames;
      GM_setValue('dictNames', dictNames)
    }

    if (tmpDictSP != undefined) {
      dictSP = tmpDictSP;
      GM_setValue('dictSP', dictSP)
    }

    Options.Ngoac = dialog.querySelector('#cbNgoac').checked;
    Options.Motnghia = dialog.querySelector('#cbMotnghia').checked;
    Options.DichLieu = dialog.querySelector('#cbDichLieu').checked;
    Options.useSP = dialog.querySelector('#cbSP').checked;
    Options.daucach = dialog.querySelector('#txtdaucach').value.charAt(0) ?? ';';
    Options.font = dialog.querySelector('#txtfont').value.trim().split(/[,;]/g)[0]//??'Roboto';
    Options.whiteList = [];
    dialog.querySelectorAll('li').forEach(li => {
      let host = li.querySelector('input[type="text"]').value;
      if (host) Options.whiteList.push({
        host: host,
        leftRight: li.querySelector('label>input[type="checkbox"]').checked,
        noButton: li.querySelector('label+input[type="checkbox"]').checked
      })
    });

    Options.blackList = dialog.querySelector('#txtBL').value;
    GM_setValue('Options', Options);
    dialog.close();
  }

  dialog.querySelector('div>button:last-child').onclick = () => dialog.close(); //Cancel button
})();