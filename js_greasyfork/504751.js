// ==UserScript==
// @name        Mã hóa/giải mã hex và base64
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_setClipboard
// @version     1.0.3
// @author      -
// @description 8/23/2024, 8:02:26 AM
// @license     Pirate
// @downloadURL https://update.greasyfork.org/scripts/504751/M%C3%A3%20h%C3%B3agi%E1%BA%A3i%20m%C3%A3%20hex%20v%C3%A0%20base64.user.js
// @updateURL https://update.greasyfork.org/scripts/504751/M%C3%A3%20h%C3%B3agi%E1%BA%A3i%20m%C3%A3%20hex%20v%C3%A0%20base64.meta.js
// ==/UserScript==
const Ctrl = false;
const Alt  = false;
const Shift= false;

const isHexStr = str => /^(0x|0X)?([0-9a-fA-F]{2}\s*)+$/g.test(str.trim());

const isBase64 = str => /^([A-Za-z0-9+\/]{4})*([A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{2}==)?$/g.test(str.trim());

const refineHex = str => /(^([0-9a-fA-F]{4}\s*)+$)|(^([0-9a-fA-F]{2}\s*)+$)/.test(str.trim()) && str.replaceAll(/\s+/g, '')

function hex2Str(hexStr) {
  hexStr = refineHex(hexStr.toString());
  if (!isHexStr(hexStr)) return false;
  if (hexStr.startsWith('0x') || hexStr.startsWith('0X')) hexStr = hexStr.slice(2);
  const result = { twoDigits: '', fourDigits: '' };
  if (/^(00[0-9a-fA-F]{2})+$/.test(hexStr)) { //2 digit hex
    hexStr = hexStr.replaceAll(/00/g, '');
    for (let i = 0; i < hexStr.length; i += 2) result.twoDigits += String.fromCharCode(parseInt(hexStr.slice(i, i + 2), 16));
    return result;
  }

  let tmpArr = hexStr.match(/[0-9a-fA-F]{2}/g);
  if (tmpArr.filter(el => /(0|1)[0-9a-fA-F]/.test(el)).length > 0) { //4digits
    for (let i = 0; i < hexStr.length; i += 4) result.fourDigits += String.fromCharCode(parseInt(hexStr.slice(i, i + 4), 16));
    return result;
  }

  if (tmpArr.length % 2!=0) { //2digits
    for (let i = 0; i < hexStr.length; i += 2) result.twoDigits += String.fromCharCode(parseInt(hexStr.slice(i, i + 2), 16));
    return result;
  }

  for (let i = 0; i < hexStr.length; i += 2) result.twoDigits += String.fromCharCode(parseInt(hexStr.slice(i, i + 2), 16));
  for (let i = 0; i < hexStr.length; i += 4) result.fourDigits += String.fromCharCode(parseInt(hexStr.slice(i, i + 4), 16));
  return result;
}

function str2Hex(str) {
  str = str.toString().trim();
  let fourDigits = false;
  let result = '';
  for (let i = 0; i < str.length; i++)
    if (str.charCodeAt(i) < 255) result += str.charCodeAt(i).toString(16) + ' '
    else { fourDigits = true; break; }

  if (fourDigits) {
    result = '';
    for (let i = 0; i < str.length; i++) result += ('000' + str.charCodeAt(i).toString(16)).slice(-4) + ' '
  }
  return result;
}

(function main(){
  document.body.insertAdjacentHTML('beforeend',`
  <style>
  #us_hexdecode_dialog {
    max-width:60%;
  }

  #us_hexdecode_dialog::backdrop{
    background-color: rgb(117 190 218 / 50%);
  }

  #us_hexdecode_dialog>div label {
    width: 1rem;
    height: 1rem;
  }

  #us_hexdecode_dialog>div label::before {
    display: inline-block;
    position: relative;
    content: "";
    border: 1px solid gray;
    width: .7rem;
    height: .7rem;
    top: .25rem;
    left: .01rem;
    background-color: lightgray;
  }

  #us_hexdecode_dialog>div label::after {
    display: inline-block;
    position: relative;
    content: "";
    border: 1px solid gray;
    width: .7rem;
    height: .7rem;
    top: .15rem;
    left: -.85rem;
    background-color: lightgray;
  }
  </style>
  <dialog id="us_hexdecode_dialog"><div></div><button>OK</button></dialog>`);
  const dialog=document.getElementById('us_hexdecode_dialog');
  document.addEventListener("contextmenu", e => {

    let str='';
    let aE=document.activeElement;
    if (aE?.tagName=='TEXTAREA' ||(aE?.tagName=='INPUT' && aE?.type=='text')) str=aE.value.substring(aE.selectionStart,aE.selectionEnd).trim();
    else  str=document.getSelection().toString().trim();

    if (str=='') return;
    if(e.ctrlKey!=Ctrl || e.altKey!=Alt ||e.shiftKey!=Shift) return;
    e.preventDefault();

    const dialog_div=dialog.querySelector('div');
    dialog_div.innerHTML='';
    if (isHexStr(str)) {
      let hexDecode=hex2Str(str);
      if(hexDecode.twoDigits) dialog_div.innerHTML+='Hex 8bits decode: '+`<span>${hexDecode.twoDigits}</span> <label></label><br/><br/>`;
      if(hexDecode.fourDigits) dialog_div.innerHTML+='Hex 16bits decode: '+`<span>${hexDecode.fourDigits}</span> <label></label><br/><br/>`;
    } else dialog_div.innerHTML+=`Hex encode: <span>${str2Hex(str)}</span> <label></label><br/><br/>`;

    let showedEncode=false;
    if (isBase64(str)) {
      if (!str.endsWith('=')) {
        dialog_div.innerHTML+=`Base64 encode: <span>${btoa(unescape(encodeURIComponent(str)))}</span> <label></label><br/><br/>`
        showedEncode=true;
        }
      dialog_div.innerHTML+=`Base64 decode: <span>${atob(str)}</span> <label></label>`;
    }
    else if (!showedEncode) dialog_div.innerHTML+=`Base64 encode: <span>${btoa(unescape(encodeURIComponent(str)))}</span> <label></label>`

    dialog_div.querySelectorAll('label').forEach(el=>el.onclick=(e)=>GM_setClipboard(e.target.previousElementSibling.textContent));
    dialog.querySelector('button').onclick=()=>dialog.close();
    dialog.showModal();
  })
})();