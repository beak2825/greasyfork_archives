// ==UserScript==
// @name        ac-register-checker
// @namespace   https://su8ru.dev
// @version     0.1.0
// @description AtCoder における企業コンテストの登録フォームにて、日本在住になっていない場合に警告を表示します。
// @author      subaru <contact@su8ru.dev>
// @supportURL  https://twitter.com/su8ru_
// @license     MIT
// @match       https://atcoder.jp/contests/*/register
// @downloadURL https://update.greasyfork.org/scripts/467401/ac-register-checker.user.js
// @updateURL https://update.greasyfork.org/scripts/467401/ac-register-checker.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const registerForm = document.forms[1];
  const insertAlert = () => {
    const alertHtml = (n) => `<div id="ac-register-checker-alert-${n}" class="alert alert-danger" role="alert"><p style="font-weight:bold;">「日本国内在住か？」が「はい」になっていません！</p></div>`;
    registerForm.querySelector('button').insertAdjacentHTML('beforebegin', alertHtml(1));
    document.querySelector('.form-group').insertAdjacentHTML('afterend', alertHtml(2));
    registerForm.querySelector('button').classList.replace('btn-primary', 'btn-danger');
  }
  const removeAlert = () => {
    document.querySelector('#ac-register-checker-alert-1').remove();
    document.querySelector('#ac-register-checker-alert-2').remove();
    registerForm.querySelector('button').classList.replace('btn-danger', 'btn-primary')
  }
  const onFormChange = (e) => {
    const value = registerForm['日本国内在住か？'].value;
    if (value === 'No') insertAlert();
    else removeAlert();
  };
  registerForm.addEventListener('change', onFormChange);
  onFormChange();
})();
