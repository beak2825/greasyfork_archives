// ==UserScript==
// @name        简历刷刷
// @description 在生效时段内自动触发刷新简历功能，适用于智联、51job、猎聘，支持设置执行间隔等
// @author      (σ｀д′)σ
// @version     0.1
// @namespace   https://greasyfork.org/zh-CN/scripts/512234
// @license     GPL-3.0-or-later
// @match       https://www.zhaopin.com/
// @match       https://www.51job.com/
// @match       https://c.liepin.com/
// @run-at      document-end
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_addValueChangeListener
// @require https://unpkg.com/sweetalert2@11.14.2/dist/sweetalert2.all.min.js
// @supportURL  https://greasyfork.org/zh-CN/scripts/512234
// @homepageURL https://github.com/Xli33/odd-monkey
// @downloadURL https://update.greasyfork.org/scripts/512234/%E7%AE%80%E5%8E%86%E5%88%B7%E5%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/512234/%E7%AE%80%E5%8E%86%E5%88%B7%E5%88%B7.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // unit fragment
  function Unit() {
    return `<div><label>单位</label><select class='swal2-select' data-time-type='1'>${Object.entries(
      {
        1: '秒',
        60: '分',
        3600: '时'
      }
    )
      .map(
        (e) =>
          `<option value=${e[0]} ${GM_getValue('timeType') == e[0] ? 'selected' : ''}>${
            e[1]
          }</option>`
      )
      .join('')}</select></div>`;
  }

  // time range
  function AvailTime() {
    return (
      '<div><label>生效时段</label><input value="' +
      GM_getValue('availBegin', init.begin) +
      '" type="time" class="swal2-input" data-begin="1" style="width:28%"><input value="' +
      GM_getValue('availEnd', init.end) +
      '" type="time" class="swal2-input" data-end="1" style="width:30%"></div>'
    );
  }

  // list fragment
  function List() {
    return hosts
      .map(
        (e) =>
          `<div><label>${e.name}</label><input class='swal2-input' value=${e.interval} type=number min=0 data-key=${e.key}></div>`
      )
      .join('');
  }

  function setup() {
    let box;
    Swal.fire({
      title: '设置各站点刷新间隔',
      // icon: "question",
      html:
        Unit() +
        AvailTime() +
        `<div><label>统一调整</label><input class='swal2-input' type=number min=0 data-all-input=1></div>` +
        List(),
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      didOpen(el) {
        el = el.querySelector('#swal2-html-container');
        el.oninput = (e) => {
          if (e.target.value <= 0) {
            e.target.value = 0;
          }
          if (e.target.dataset.allInput == 1) {
            Array.from(el.querySelectorAll('input[data-key]')).forEach((inp) => {
              inp.value = e.target.value;
            });
          }
        };
        el.onchange = (e) => {
          if (e.target.type !== 'time') return;
          if (e.target.dataset.begin == 1 && e.target.nextElementSibling.value < e.target.value) {
            e.target.nextElementSibling.value = e.target.value;
            return;
          }
          if (e.target.dataset.end == 1 && e.target.previousElementSibling.value > e.target.value) {
            e.target.previousElementSibling.value = e.target.value;
          }
        };
      },
      willClose(el) {
        box = el;
      }
    }).then((res) => {
      if (res.isConfirmed) {
        GM_setValue('timeType', box.querySelector('.swal2-select').value);
        Array.from(box.querySelectorAll('input[data-key]')).forEach((e, i) => {
          GM_setValue(e.dataset.key, (hosts[i].interval = +e.value));
        });
        GM_setValue('availBegin', box.querySelector('input[data-begin]').value);
        GM_setValue('availEnd', box.querySelector('input[data-end]').value);
        run();
      }
    });
  }
  const init = {
    begin: '08:00',
    end: '22:00',
    timeType: 1
  };
  const hosts = [
    {
      host: 'www.zhaopin.com',
      key: 'zhilian',
      name: '智联',
      btn: '.login-after .refresh',
      interval: GM_getValue('zhilian', 15)
    },
    {
      host: 'www.51job.com',
      key: 'job51',
      name: '前程无忧',
      btn: '#refreshresume',
      interval: GM_getValue('job51', 15)
    },
    {
      host: 'c.liepin.com',
      key: 'liepin',
      name: '猎聘',
      btn: '#main-container .aside-vap-bottom-btn1',
      interval: GM_getValue('liepin', 15)
    }
  ];
  let current = hosts.findIndex((e) => e.host === location.host);
  hosts.unshift(hosts.splice(current, 1)[0]);
  current = hosts[0];

  GM_registerMenuCommand('设置', setup /* { id: 1 } */);

  const isAvailable = () => {
    const now = new Date(),
      hm = (now.getHours() + '').padStart(2, 0) + ':' + (now.getMinutes() + '').padStart(2, 0);
    return hm > GM_getValue('availBegin', init.begin) && hm < GM_getValue('availEnd', init.end);
  };
  const run = () => {
    if (!isAvailable()) return;
    document.querySelector(current.btn)?.click();
    setTimeout(run, 1000 * current.interval * GM_getValue('timeType', init.timeType));
  };
  // sync data with other page
  const availChanged = (key, oldValue, newValue, remote) => {
    remote && run();
  };
  GM_addValueChangeListener('availBegin', availChanged);
  GM_addValueChangeListener('availEnd', availChanged);
  hosts.forEach((e) => {
    GM_addValueChangeListener(e.key, (key, oldValue, newValue, remote) => {
      if (!remote) return;
      e.interval = newValue;
    });
  });

  run();
  GM_addStyle(
    '#swal2-html-container label{display:inline-block;width:4em;text-align:right;}' +
      '#swal2-html-container .swal2-select{border: 1px solid #d9d9d9;border-radius:0.1875em;}' +
      '#swal2-html-container .swal2-select,#swal2-html-container .swal2-input{width:60%;margin-right:0;margin-left:.5em;}'
  );
})();
