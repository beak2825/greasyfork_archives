// ==UserScript==
// @name         Japanisch A1 WiSe 2021/22
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  It is more convenient to download various files uploaded by Sugita Sensei, you can choose to download all or download some of the sections. try to take over the world!
// @author       Ao
// @match        https://moodle.uni-due.de/course/view.php?id=26965
// @icon         https://www.google.com/s2/favicons?domain=uni-due.de
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/435472/Japanisch%20A1%20WiSe%20202122.user.js
// @updateURL https://update.greasyfork.org/scripts/435472/Japanisch%20A1%20WiSe%20202122.meta.js
// ==/UserScript==

let elementId = '';
let currentElement = '';

function courseDownload(url, filename) {
  getBlob(url, function (blob) {
    saveAs(blob, filename);
  });
}

function getBlob(url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (xhr.status === 200) {
      cb(xhr.response);
    }
  };
  xhr.send();
}

function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement('a');
    var body = document.querySelector('body');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    body.appendChild(link);
    link.click();
    body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
}

function elementDownload(element) {
  let _id = element.id;
  let _sectionName = document
    .querySelector(`#${_id} .hidden.sectionname`)
    .innerText.replace('.', '');
  [].slice
    .call(document.querySelectorAll(`#${_id} a[href*='/resource']`))
    .map((e, index) => {
      if (e['onclick']) {
        try {
          setTimeout(() => {
            courseDownload(
              e.href + '&redirect=1',
              `[${_sectionName}]-${e.text.replace(' Datei', '')}`
            );
          }, 1000 * index);
        } catch (e) {}
      }
    });
}
function pompt() {
  elementId = prompt(
    "Input section('-all' for download all)：",
    'Word List L1 - L7'
  );
  currentElement = document.querySelector(`li[aria-label="${elementId}"]`);

  if (elementId === '-all') {
    [...document.querySelectorAll('li[id^=section]')].forEach((e) => {
      elementDownload(e);
    });
  } else {
    if (elementId == null) {
      return;
    } else if (currentElement == null) {
      alert('Wrong section!');
      return;
    }
    elementDownload(currentElement);
    currentElement = '';
  }
}
function main() {
  let button = document.createElement('button');
  var body = document.querySelector('body');
  var d = document.createElement('style');
  d.setAttribute('type', 'text/css');
  d.innerHTML = `.lbtn{line-height:1;width:100px;height:40px;cursor:pointer;background:#ecf5ff;border:1px solid #b3d8ff!important;color:#409eff;-webkit-appearance:none;text-align:center;box-sizing:border-box;outline:0;margin:0;transition:.1s;font-weight:500;-webkit-user-select:none;padding:12px;font-size:14px;border-radius:4;position:fixed;right:290px;bottom:140px}.lbtn:hover{background:#409eff;border-color:#409eff;color:#fff;transition:.5s}`;
  document.getElementsByTagName('head')[0].appendChild(d);
  button.addEventListener('click', pompt);
  button.setAttribute('class', 'lbtn');
  button.innerText = 'Download';
  body.appendChild(button);
}
main();
