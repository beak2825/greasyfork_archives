// ==UserScript==
// @name         마지미라 입력 저장
// @namespace    https://va.pia.jp/magicalmirai25-1en/entry_hope_init.jsp
// @version      1.0.0
// @description  귀찮은 마지미라 2025 여러개 입력하면 저장하기
// @author       explnprk
// @match        https://va.pia.jp/magicalmirai*en/entry_hope_init.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pia.jp
// @grant        none
// @run-at       document-end
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/533291/%EB%A7%88%EC%A7%80%EB%AF%B8%EB%9D%BC%20%EC%9E%85%EB%A0%A5%20%EC%A0%80%EC%9E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/533291/%EB%A7%88%EC%A7%80%EB%AF%B8%EB%9D%BC%20%EC%9E%85%EB%A0%A5%20%EC%A0%80%EC%9E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const setAndSave = (selector) => {
        const el = document.querySelector(selector);
        const saved = localStorage.getItem(selector);
        if (el && saved !== null) el.value = saved;
        if (el) {
            el.addEventListener('input', e => {
                localStorage.setItem(selector, e.target.value);
            });
        }
    };

    const clickAndRemember = (selector) => {
        const el = document.querySelector(selector);
        if (el) el.click(); // always click regardless of localStorage
    };
    document.querySelector('#upppd')?.click();
;(function() {
  setAndSave(`[name="cstmr_lnm"]`);
  setAndSave(`[name="cstmr_fnm"]`);
  clickAndRemember(`[name="sex_typ"][value="1"]`);
  setAndSave(`[name="birth_yyyy"]`);
  setAndSave(`[name="birth_mm"]`);
  setAndSave(`[name="birth_dd"]`);
  setAndSave(`[name="telno1"]`);
  setAndSave(`[name="telno2"]`);
  setAndSave(`[name="telno3"]`);
  setAndSave(`[name="ml_addr"]`);
  setAndSave(`[name="ml_addr_cnfm"]`);
  setAndSave(`[name="cmnt04"]`);
  setAndSave(`[name="gnrl_cstmr_passwd"]`);
})();
;
;(function() {
  const selector = '[name="hope_numsht"]';
  const defaultValue = "1";
  const el = document.querySelector(selector);
  if (el) {
    el.value = localStorage.getItem(selector) ?? defaultValue;
    el.addEventListener('input', e => {
      localStorage.setItem(selector, e.target.value);
    });
  }
})();
;
    ;(function() {
        setAndSave(`[name="cmnt21"]`);
        setAndSave(`[name="cmnt22"]`);
        setAndSave(`[name="cmnt23"]`);
    })();
;(function() {
  const setAndSave = (selector) => {
    const el = document.querySelector(selector);
    const saved = localStorage.getItem(selector);
    if (el && saved !== null) el.value = saved;
    if (el) {
      el.addEventListener('input', e => {
        localStorage.setItem(selector, e.target.value);
      });
    }
  };

  setAndSave('[name="stlmnt_card_no"]');
  setAndSave('[name="card_trmvld_month_da"]');
  setAndSave('[name="card_trmvld_year_da"]');
  setAndSave('[name="scrtyCd"]');
})();
;

})();